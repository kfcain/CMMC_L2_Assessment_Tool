/**
 * Claude API Client for CMMC AI Assessor
 * Handles communication with the Anthropic Claude API
 * API key is stored in sessionStorage (never persisted to disk)
 */

const ClaudeAPI = {
    API_URL: 'https://api.anthropic.com/v1/messages',
    MODEL: 'claude-sonnet-4-20250514',
    MAX_TOKENS: 4096,
    _apiKey: null,

    /**
     * Get the API key from sessionStorage
     */
    getApiKey() {
        if (this._apiKey) return this._apiKey;
        this._apiKey = sessionStorage.getItem('claude-api-key');
        return this._apiKey;
    },

    /**
     * Set the API key (stored in sessionStorage only — cleared on tab close)
     */
    setApiKey(key) {
        if (!key || typeof key !== 'string' || !key.startsWith('sk-ant-')) {
            throw new Error('Invalid API key format. Must start with sk-ant-');
        }
        this._apiKey = key;
        sessionStorage.setItem('claude-api-key', key);
    },

    /**
     * Clear the API key
     */
    clearApiKey() {
        this._apiKey = null;
        sessionStorage.removeItem('claude-api-key');
    },

    /**
     * Check if API key is configured
     */
    isConfigured() {
        return !!this.getApiKey();
    },

    /**
     * Send a message to Claude with a system prompt and conversation history
     * @param {string} systemPrompt - The system prompt (assessor persona)
     * @param {Array} messages - Array of {role, content} message objects
     * @param {object} options - Optional overrides (model, max_tokens, temperature)
     * @returns {Promise<string>} Claude's response text
     */
    async sendMessage(systemPrompt, messages, options = {}) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            throw new Error('API key not configured. Please set your Claude API key.');
        }

        const body = {
            model: options.model || this.MODEL,
            max_tokens: options.max_tokens || this.MAX_TOKENS,
            system: systemPrompt,
            messages: messages
        };

        if (options.temperature !== undefined) {
            body.temperature = options.temperature;
        }

        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerous-direct-browser-access': 'true'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 401) {
                    this.clearApiKey();
                    throw new Error('Invalid API key. Please re-enter your Claude API key.');
                }
                if (response.status === 429) {
                    throw new Error('Rate limited. Please wait a moment and try again.');
                }
                throw new Error(errorData.error?.message || `API error: ${response.status}`);
            }

            const data = await response.json();
            
            // Extract text from response
            if (data.content && data.content.length > 0) {
                return {
                    text: data.content.map(c => c.text).join(''),
                    usage: data.usage,
                    stopReason: data.stop_reason
                };
            }
            
            throw new Error('Empty response from Claude');
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error. Check your connection and CSP settings.');
            }
            throw error;
        }
    },

    /**
     * Build assessment context from the current site data
     * This creates a structured summary of the user's assessment state
     */
    buildAssessmentContext() {
        const assessmentData = JSON.parse(localStorage.getItem('nist-assessment-data') || '{}');
        const poamData = JSON.parse(localStorage.getItem('nist-poam-data') || '{}');
        const deficiencyData = JSON.parse(localStorage.getItem('nist-deficiency-data') || '{}');
        const implementationData = JSON.parse(localStorage.getItem('nist-implementation-data') || '{}');
        const level = localStorage.getItem('nist-assessment-level') || '2';

        // Calculate summary stats
        const statuses = { met: 0, partial: 0, 'not-met': 0, 'not-assessed': 0 };
        const familyStats = {};

        const families = typeof CONTROL_FAMILIES !== 'undefined' ? CONTROL_FAMILIES : [];
        families.forEach(family => {
            const fStats = { met: 0, partial: 0, 'not-met': 0, 'not-assessed': 0, total: 0 };
            family.controls.forEach(control => {
                control.objectives.forEach(obj => {
                    const status = assessmentData[obj.id]?.status || 'not-assessed';
                    statuses[status]++;
                    fStats[status]++;
                    fStats.total++;
                });
            });
            familyStats[family.id] = { name: family.name, ...fStats };
        });

        const totalObjectives = Object.values(statuses).reduce((a, b) => a + b, 0);
        const poamCount = Object.keys(poamData).length;
        const deficiencyCount = Object.keys(deficiencyData).length;

        // Calculate SPRS score
        let sprsScore = 110;
        if (typeof SPRS_SCORING !== 'undefined' && typeof CONTROL_FAMILIES !== 'undefined') {
            CONTROL_FAMILIES.forEach(family => {
                family.controls.forEach(control => {
                    const allMet = control.objectives.every(obj => 
                        assessmentData[obj.id]?.status === 'met'
                    );
                    if (!allMet) {
                        sprsScore -= (control.pointValue || 1);
                    }
                });
            });
        }

        // Load FIPS certificates from OSC inventory
        const oscData = JSON.parse(localStorage.getItem('osc-inventory') || '{}');
        const fipsCerts = (oscData.fipsCerts || []).map(c => ({
            certNumber: c.certNumber,
            moduleName: c.moduleName,
            vendor: c.vendor,
            standard: c.standard,
            level: c.level,
            status: c.status,
            linkedControls: c.linkedControls || []
        }));

        return {
            level: level === '1' ? 'CMMC Level 1' : 'CMMC Level 2',
            summary: {
                totalObjectives,
                met: statuses.met,
                partial: statuses.partial,
                notMet: statuses['not-met'],
                notAssessed: statuses['not-assessed'],
                percentComplete: totalObjectives > 0 ? Math.round(((statuses.met + statuses.partial + statuses['not-met']) / totalObjectives) * 100) : 0,
                percentMet: totalObjectives > 0 ? Math.round((statuses.met / totalObjectives) * 100) : 0,
                sprsScore,
                poamItems: poamCount,
                deficiencies: deficiencyCount,
                fipsCertsCount: fipsCerts.length
            },
            familyStats,
            poamData,
            deficiencyData,
            implementationData,
            fipsCerts
        };
    },

    /**
     * Build context for a specific control/objective
     */
    buildObjectiveContext(objectiveId) {
        const assessmentData = JSON.parse(localStorage.getItem('nist-assessment-data') || '{}');
        const poamData = JSON.parse(localStorage.getItem('nist-poam-data') || '{}');
        const implementationData = JSON.parse(localStorage.getItem('nist-implementation-data') || '{}');

        let objective = null;
        let control = null;
        let family = null;

        const families = typeof CONTROL_FAMILIES !== 'undefined' ? CONTROL_FAMILIES : [];
        families.forEach(f => {
            f.controls.forEach(c => {
                c.objectives.forEach(o => {
                    if (o.id === objectiveId) {
                        objective = o;
                        control = c;
                        family = f;
                    }
                });
            });
        });

        if (!objective) return null;

        // Get inheritance data if available
        let inheritance = null;
        if (typeof InheritedControls !== 'undefined') {
            const inhData = InheritedControls.getInheritance(control.id);
            if (inhData) {
                const typeKey = inhData.type.toUpperCase().replace(/-/g, '_');
                const typeInfo = InheritedControls.RESPONSIBILITY_TYPES[typeKey];
                inheritance = {
                    type: inhData.type,
                    label: typeInfo?.label || inhData.type,
                    csp: inhData.csp || '',
                    cspName: inhData.csp ? (InheritedControls.CSP_PROFILES[inhData.csp]?.shortName || inhData.csp) : '',
                    notes: inhData.notes || '',
                    srmSource: inhData.srmSource || null
                };
            }
        }

        // Find FIPS certs linked to this control
        const oscData = JSON.parse(localStorage.getItem('osc-inventory') || '{}');
        const allFipsCerts = oscData.fipsCerts || [];
        const linkedFipsCerts = allFipsCerts.filter(c => 
            (c.linkedControls || []).includes(control.id)
        ).map(c => ({
            certNumber: c.certNumber,
            moduleName: c.moduleName,
            vendor: c.vendor,
            standard: c.standard,
            level: c.level,
            status: c.status
        }));

        return {
            objectiveId: objective.id,
            objectiveText: objective.text,
            controlId: control.id,
            controlName: control.name,
            controlDescription: control.description,
            familyId: family.id,
            familyName: family.name,
            pointValue: control.pointValue || 1,
            cmmcPracticeId: control.cmmcPracticeId || '',
            status: assessmentData[objectiveId]?.status || 'not-assessed',
            poam: poamData[objectiveId] || null,
            implementation: implementationData[objectiveId] || null,
            canBeOnPoam: !(typeof SPRS_SCORING !== 'undefined' && SPRS_SCORING.neverPoam?.includes(control.id)),
            inheritance: inheritance,
            fipsCerts: linkedFipsCerts
        };
    }
};

console.log('[ClaudeAPI] Module loaded');
