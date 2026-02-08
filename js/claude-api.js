/**
 * Claude API — Assessment Context Builders
 * API communication is handled by AIProvider (js/ai-provider.js).
 * This file provides ClaudeAPI.buildAssessmentContext() and buildObjectiveContext()
 * which are used by the AI Assessor to inject assessment state into prompts.
 *
 * The ClaudeAPI object is defined in ai-provider.js as a backward-compatible shim
 * that delegates isConfigured/sendMessage/etc to AIProvider. This file extends it
 * with the context-building methods.
 */

// Extend the ClaudeAPI shim (defined in ai-provider.js) with context builders
if (typeof ClaudeAPI !== 'undefined') {

    /**
     * Build assessment context from the current site data
     */
    ClaudeAPI.buildAssessmentContext = function() {
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
    };

    /**
     * Build context for a specific control/objective
     */
    ClaudeAPI.buildObjectiveContext = function(objectiveId) {
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
    };

}

console.log('[ClaudeAPI] Context builders loaded');
