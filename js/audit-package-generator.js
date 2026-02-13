/**
 * AI Audit-Ready Package Generator (Multi-Agent Workflow)
 * 12 specialized AI agents that take an OSC stem-to-stern through
 * assessment, evaluation, remediation, and audit readiness.
 *
 * Uses AIProvider.sendMessage() — user's own API key (Claude/OpenAI/Gemini).
 * Output stored in `audit-package-results` localStorage key.
 */

const AuditPackageGenerator = {

    // ── Constants ─────────────────────────────────────────────────
    STORAGE_KEY: 'audit-package-results',
    VERSION: '3.0',

    // ── State ─────────────────────────────────────────────────────
    _running: false,
    _cancelled: false,
    _currentAgentId: null,
    _results: null,

    // ── Agent Definitions ─────────────────────────────────────────
    // Execution order follows the 4-phase pipeline from the plan
    AGENTS: {
        'platform-context': {
            id: 'platform-context',
            name: 'Platform Context Analyzer',
            number: 9,
            phase: 'A',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
            description: 'Detects technology stack and maps tools to controls',
            getSystemPrompt: () => AuditPackageGenerator._buildPlatformContextPrompt(),
            buildUserMessage: () => AuditPackageGenerator._buildPlatformContextMessage(),
            maxTokens: 8192
        },
        'srm-validator': {
            id: 'srm-validator',
            name: 'SRM Validator',
            number: 10,
            phase: 'A',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
            description: 'Validates ESP/CSP inheritance claims against SRM documentation',
            getSystemPrompt: () => AuditPackageGenerator._buildSRMValidatorPrompt(),
            buildUserMessage: () => AuditPackageGenerator._buildSRMValidatorMessage(),
            maxTokens: 8192
        },
        'policy-evaluator': {
            id: 'policy-evaluator',
            name: 'Policy & Procedure Evaluator',
            number: 1,
            phase: 'B',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
            description: 'Evaluates policy/procedure alignment with CMMC L2 objectives',
            getSystemPrompt: () => AuditPackageGenerator._buildPolicyEvaluatorPrompt(),
            buildUserMessage: (familyId) => AuditPackageGenerator._buildPolicyEvaluatorMessage(familyId),
            perFamily: true,
            maxTokens: 8192
        },
        'ssp-narrator': {
            id: 'ssp-narrator',
            name: 'SSP Narrative Generator',
            number: 2,
            phase: 'B',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
            description: 'Generates present-tense SSP implementation narratives per objective',
            getSystemPrompt: () => AuditPackageGenerator._buildSSPNarratorPrompt(),
            buildUserMessage: (familyId) => AuditPackageGenerator._buildSSPNarratorMessage(familyId),
            perFamily: true,
            maxTokens: 8192
        },
        'poam-advisor': {
            id: 'poam-advisor',
            name: 'POA&M Remediation Advisor',
            number: 3,
            phase: 'B',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            description: 'Generates remediation plans for POA&M items with milestones and cost',
            getSystemPrompt: () => AuditPackageGenerator._buildPOAMAdvisorPrompt(),
            buildUserMessage: () => AuditPackageGenerator._buildPOAMAdvisorMessage(),
            maxTokens: 8192
        },
        'evidence-assembler': {
            id: 'evidence-assembler',
            name: 'Evidence Package Assembler',
            number: 4,
            phase: 'B',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
            description: 'Maps evidence artifacts to assessment objectives, identifies gaps',
            getSystemPrompt: () => AuditPackageGenerator._buildEvidenceAssemblerPrompt(),
            buildUserMessage: (familyId) => AuditPackageGenerator._buildEvidenceAssemblerMessage(familyId),
            perFamily: true,
            maxTokens: 8192
        },
        'cca-simulator': {
            id: 'cca-simulator',
            name: 'CCA Interview Simulator',
            number: 6,
            phase: 'C',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
            description: 'Simulates C3PAO assessor interview questions and evaluates readiness',
            getSystemPrompt: () => AuditPackageGenerator._buildCCASimulatorPrompt(),
            buildUserMessage: (familyId) => AuditPackageGenerator._buildCCASimulatorMessage(familyId),
            perFamily: true,
            maxTokens: 8192
        },
        'scope-validator': {
            id: 'scope-validator',
            name: 'Scope & Boundary Validator',
            number: 7,
            phase: 'C',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
            description: 'Validates CUI boundary, asset scoping, and data flow completeness',
            getSystemPrompt: () => AuditPackageGenerator._buildScopeValidatorPrompt(),
            buildUserMessage: () => AuditPackageGenerator._buildScopeValidatorMessage(),
            maxTokens: 8192
        },
        'dependency-analyzer': {
            id: 'dependency-analyzer',
            name: 'Cross-Control Dependency Analyzer',
            number: 8,
            phase: 'C',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
            description: 'Maps control dependencies and calculates blast radius for gaps',
            getSystemPrompt: () => AuditPackageGenerator._buildDependencyAnalyzerPrompt(),
            buildUserMessage: () => AuditPackageGenerator._buildDependencyAnalyzerMessage(),
            maxTokens: 8192
        },
        'conmon-planner': {
            id: 'conmon-planner',
            name: 'Continuous Monitoring Plan Generator',
            number: 11,
            phase: 'D',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
            description: 'Generates ongoing monitoring strategy with frequencies and automation',
            getSystemPrompt: () => AuditPackageGenerator._buildConMonPlannerPrompt(),
            buildUserMessage: () => AuditPackageGenerator._buildConMonPlannerMessage(),
            maxTokens: 8192
        },
        'mssp-advisor': {
            id: 'mssp-advisor',
            name: 'MSSP/Managed Service Advisor',
            number: 12,
            phase: 'D',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
            description: 'Validates MSSP coverage and identifies responsibility gaps',
            getSystemPrompt: () => AuditPackageGenerator._buildMSSPAdvisorPrompt(),
            buildUserMessage: () => AuditPackageGenerator._buildMSSPAdvisorMessage(),
            maxTokens: 8192
        },
        'readiness-report': {
            id: 'readiness-report',
            name: 'Audit Readiness Report',
            number: 5,
            phase: 'D',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
            description: 'Aggregates all agent outputs into executive readiness assessment',
            getSystemPrompt: () => AuditPackageGenerator._buildReadinessReportPrompt(),
            buildUserMessage: () => AuditPackageGenerator._buildReadinessReportMessage(),
            maxTokens: 8192
        }
    },

    // Pipeline phase order
    PHASES: [
        { id: 'A', name: 'Context Gathering', agents: ['platform-context', 'srm-validator'] },
        { id: 'B', name: 'Core Assessment', agents: ['policy-evaluator', 'ssp-narrator', 'poam-advisor', 'evidence-assembler'] },
        { id: 'C', name: 'Analysis', agents: ['cca-simulator', 'scope-validator', 'dependency-analyzer'] },
        { id: 'D', name: 'Synthesis', agents: ['conmon-planner', 'mssp-advisor', 'readiness-report'] }
    ],

    // ══════════════════════════════════════════════════════════════
    //  INITIALIZATION & RENDERING
    // ══════════════════════════════════════════════════════════════

    render() {
        const container = document.getElementById('audit-package-content');
        if (!container) return;

        this._results = this._loadResults();
        container.innerHTML = this._renderMainView();
        this._bindEvents(container);
    },

    _renderMainView() {
        const results = this._results;
        const hasResults = results && results.agents && Object.keys(results.agents).length > 0;
        const isConfigured = typeof AIProvider !== 'undefined' && AIProvider.isConfigured();

        return `
            <div class="apg-container">
                <div class="apg-header">
                    <div class="apg-header-left">
                        <h2 class="apg-title">AI Audit Package Generator</h2>
                        <span class="apg-subtitle">12-agent pipeline for CCA/C3PAO-grade audit readiness</span>
                    </div>
                    <div class="apg-header-actions">
                        ${isConfigured ? `
                            <span class="apg-model-badge">${AIProvider.getActiveDisplayName()}</span>
                            <button class="apg-btn apg-btn-primary" id="apg-run-pipeline-btn" ${this._running ? 'disabled' : ''}>
                                ${this._running ? '<span class="apg-spinner"></span> Running...' : 'Run Full Pipeline'}
                            </button>
                        ` : `
                            <span class="apg-model-badge apg-not-connected">No AI Connected</span>
                            <button class="apg-btn apg-btn-secondary" id="apg-connect-btn">Connect AI Provider</button>
                        `}
                        ${hasResults ? '<button class="apg-btn apg-btn-ghost" id="apg-export-btn">Export Package</button>' : ''}
                    </div>
                </div>

                ${this._running ? this._renderPipelineProgress() : ''}

                <div class="apg-pipeline">
                    <div class="apg-phase-grid">
                        ${this.PHASES.map(phase => this._renderPhase(phase, results)).join('')}
                    </div>
                </div>

                ${hasResults ? this._renderResultsSummary(results) : this._renderEmptyState()}
            </div>
        `;
    },

    _renderPhase(phase, results) {
        return `
            <div class="apg-phase" data-phase="${phase.id}">
                <div class="apg-phase-header">
                    <span class="apg-phase-letter">${phase.id}</span>
                    <span class="apg-phase-name">${phase.name}</span>
                </div>
                <div class="apg-agent-list">
                    ${phase.agents.map(agentId => this._renderAgentCard(agentId, results)).join('')}
                </div>
            </div>
        `;
    },

    _renderAgentCard(agentId, results) {
        const agent = this.AGENTS[agentId];
        if (!agent) return '';
        const agentResult = results?.agents?.[agentId];
        const status = agentResult?.status || 'pending';
        const isActive = this._currentAgentId === agentId;
        const isConfigured = typeof AIProvider !== 'undefined' && AIProvider.isConfigured();

        const statusBadge = {
            'pending': '<span class="apg-status apg-status-pending">Pending</span>',
            'running': '<span class="apg-status apg-status-running"><span class="apg-spinner-sm"></span> Running</span>',
            'completed': '<span class="apg-status apg-status-completed">Completed</span>',
            'error': '<span class="apg-status apg-status-error">Error</span>',
            'skipped': '<span class="apg-status apg-status-skipped">Skipped</span>'
        }[status] || '';

        return `
            <div class="apg-agent-card ${isActive ? 'active' : ''} apg-agent-${status}" data-agent="${agentId}">
                <div class="apg-agent-icon">${agent.icon}</div>
                <div class="apg-agent-info">
                    <div class="apg-agent-name">${agent.name}</div>
                    <div class="apg-agent-desc">${agent.description}</div>
                </div>
                <div class="apg-agent-actions">
                    ${statusBadge}
                    ${!this._running && isConfigured ? `<button class="apg-btn-icon apg-run-agent-btn" data-agent="${agentId}" title="Run this agent">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </button>` : ''}
                </div>
                ${agentResult?.status === 'completed' && agentResult?.tokensUsed ? `
                    <div class="apg-agent-meta">${(agentResult.tokensUsed.input + agentResult.tokensUsed.output).toLocaleString()} tokens</div>
                ` : ''}
            </div>
        `;
    },

    _renderPipelineProgress() {
        return `
            <div class="apg-progress-bar">
                <div class="apg-progress-fill" id="apg-progress-fill" style="width: 0%"></div>
            </div>
            <div class="apg-progress-info">
                <span id="apg-progress-text">Initializing pipeline...</span>
                <button class="apg-btn apg-btn-ghost apg-btn-sm" id="apg-cancel-btn">Cancel</button>
            </div>
        `;
    },

    _renderEmptyState() {
        return `
            <div class="apg-empty-state">
                <div class="apg-empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                        <rect x="9" y="3" width="6" height="4" rx="2"/>
                        <path d="M9 14l2 2 4-4"/>
                    </svg>
                </div>
                <h3>Ready to Generate Your Audit Package</h3>
                <p>Run the full 12-agent pipeline or individual agents to generate a CCA/C3PAO-grade audit readiness package. Each agent analyzes your assessment data from a different perspective.</p>
                <div class="apg-empty-phases">
                    <div class="apg-empty-phase"><strong>Phase A:</strong> Context Gathering (platform detection, SRM validation)</div>
                    <div class="apg-empty-phase"><strong>Phase B:</strong> Core Assessment (policy, SSP, POA&M, evidence)</div>
                    <div class="apg-empty-phase"><strong>Phase C:</strong> Analysis (CCA simulation, scope, dependencies)</div>
                    <div class="apg-empty-phase"><strong>Phase D:</strong> Synthesis (monitoring, MSSP, readiness report)</div>
                </div>
            </div>
        `;
    },

    _renderResultsSummary(results) {
        const agents = results.agents || {};
        const completed = Object.values(agents).filter(a => a.status === 'completed').length;
        const total = Object.keys(this.AGENTS).length;
        const totalTokens = Object.values(agents).reduce((sum, a) => {
            return sum + (a.tokensUsed ? a.tokensUsed.input + a.tokensUsed.output : 0);
        }, 0);

        return `
            <div class="apg-results-summary">
                <div class="apg-results-header">
                    <h3>Results</h3>
                    <div class="apg-results-meta">
                        <span>${completed}/${total} agents completed</span>
                        <span>${totalTokens.toLocaleString()} total tokens</span>
                        ${results.lastRun ? `<span>Last run: ${new Date(results.lastRun).toLocaleString()}</span>` : ''}
                    </div>
                </div>
                <div class="apg-results-grid" id="apg-results-grid">
                    ${Object.entries(agents).filter(([, a]) => a.status === 'completed').map(([agentId, agentData]) => {
                        const agent = this.AGENTS[agentId];
                        if (!agent) return '';
                        return `
                            <div class="apg-result-card" data-agent="${agentId}">
                                <div class="apg-result-card-header">
                                    <span class="apg-result-icon">${agent.icon}</span>
                                    <span class="apg-result-name">${agent.name}</span>
                                </div>
                                <div class="apg-result-preview">${this._getResultPreview(agentId, agentData)}</div>
                                <button class="apg-btn apg-btn-ghost apg-btn-sm apg-view-result-btn" data-agent="${agentId}">View Details</button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    _getResultPreview(agentId, agentData) {
        if (!agentData.results) return '<span class="apg-muted">No results</span>';
        const r = agentData.results;
        // Return a brief text summary based on agent type
        if (typeof r === 'string') {
            return r.substring(0, 200) + (r.length > 200 ? '...' : '');
        }
        return '<span class="apg-muted">Results available — click to view</span>';
    },

    // ══════════════════════════════════════════════════════════════
    //  EVENT BINDING
    // ══════════════════════════════════════════════════════════════

    _bindEvents(container) {
        // Run full pipeline
        container.querySelector('#apg-run-pipeline-btn')?.addEventListener('click', () => this.runPipeline());

        // Connect AI
        container.querySelector('#apg-connect-btn')?.addEventListener('click', () => {
            if (typeof AIAssessor !== 'undefined') AIAssessor.open();
        });

        // Cancel pipeline
        container.querySelector('#apg-cancel-btn')?.addEventListener('click', () => this.cancelPipeline());

        // Run individual agent
        container.querySelectorAll('.apg-run-agent-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const agentId = btn.dataset.agent;
                this.runSingleAgent(agentId);
            });
        });

        // View agent results
        container.querySelectorAll('.apg-agent-card').forEach(card => {
            card.addEventListener('click', () => {
                const agentId = card.dataset.agent;
                this._showAgentResults(agentId);
            });
        });

        // View result details
        container.querySelectorAll('.apg-view-result-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this._showAgentResults(btn.dataset.agent);
            });
        });

        // Export
        container.querySelector('#apg-export-btn')?.addEventListener('click', () => this._exportPackage());
    },

    // ══════════════════════════════════════════════════════════════
    //  PIPELINE EXECUTION
    // ══════════════════════════════════════════════════════════════

    async runPipeline() {
        if (this._running) return;
        if (!AIProvider.isConfigured()) {
            if (typeof AIAssessor !== 'undefined') AIAssessor.open();
            return;
        }

        this._running = true;
        this._cancelled = false;
        this._results = this._loadResults() || this._createEmptyResults();
        this._results.pipeline = {
            status: 'running',
            startedAt: new Date().toISOString(),
            completedAt: null,
            agentsRun: [],
            modelUsed: AIProvider.getActiveDisplayName()
        };
        this._saveResults();
        this.render();

        const allAgents = this.PHASES.flatMap(p => p.agents);
        let completed = 0;

        for (const agentId of allAgents) {
            if (this._cancelled) break;

            this._currentAgentId = agentId;
            this._updateProgress(agentId, completed, allAgents.length);
            this.render();

            try {
                await this._executeAgent(agentId);
                this._results.pipeline.agentsRun.push(agentId);
                completed++;
            } catch (err) {
                console.error(`[AuditPackage] Agent ${agentId} failed:`, err);
                this._results.agents[agentId] = {
                    status: 'error',
                    timestamp: new Date().toISOString(),
                    error: err.message
                };
            }

            this._saveResults();
        }

        this._running = false;
        this._currentAgentId = null;
        this._results.pipeline.status = this._cancelled ? 'cancelled' : 'completed';
        this._results.pipeline.completedAt = new Date().toISOString();
        this._results.lastRun = new Date().toISOString();
        this._saveResults();
        this.render();
    },

    async runSingleAgent(agentId) {
        if (this._running) return;
        if (!AIProvider.isConfigured()) {
            if (typeof AIAssessor !== 'undefined') AIAssessor.open();
            return;
        }

        this._running = true;
        this._cancelled = false;
        this._currentAgentId = agentId;
        this._results = this._loadResults() || this._createEmptyResults();
        this.render();

        try {
            await this._executeAgent(agentId);
            this._results.lastRun = new Date().toISOString();
        } catch (err) {
            console.error(`[AuditPackage] Agent ${agentId} failed:`, err);
            this._results.agents[agentId] = {
                status: 'error',
                timestamp: new Date().toISOString(),
                error: err.message
            };
        }

        this._running = false;
        this._currentAgentId = null;
        this._saveResults();
        this.render();
    },

    cancelPipeline() {
        this._cancelled = true;
    },

    async _executeAgent(agentId) {
        const agent = this.AGENTS[agentId];
        if (!agent) throw new Error('Unknown agent: ' + agentId);

        this._results.agents[agentId] = {
            status: 'running',
            timestamp: new Date().toISOString(),
            modelUsed: AIProvider.getActiveDisplayName(),
            tokensUsed: { input: 0, output: 0 },
            results: null
        };

        const systemPrompt = agent.getSystemPrompt();

        if (agent.perFamily) {
            // Run per-family and aggregate
            const families = this._getFamilyIds();
            const allResults = {};
            for (const familyId of families) {
                if (this._cancelled) break;
                const userMessage = agent.buildUserMessage(familyId);
                if (!userMessage) continue; // skip families with no relevant data

                const response = await AIProvider.sendMessage(systemPrompt, [
                    { role: 'user', content: userMessage }
                ], { max_tokens: agent.maxTokens || 8192, temperature: 0.2 });

                allResults[familyId] = response.text;
                if (response.usage) {
                    this._results.agents[agentId].tokensUsed.input += (response.usage.input_tokens || 0);
                    this._results.agents[agentId].tokensUsed.output += (response.usage.output_tokens || 0);
                }
            }
            this._results.agents[agentId].results = allResults;
        } else {
            // Single call
            const userMessage = agent.buildUserMessage();
            const response = await AIProvider.sendMessage(systemPrompt, [
                { role: 'user', content: userMessage }
            ], { max_tokens: agent.maxTokens || 8192, temperature: 0.2 });

            this._results.agents[agentId].results = response.text;
            if (response.usage) {
                this._results.agents[agentId].tokensUsed = {
                    input: response.usage.input_tokens || 0,
                    output: response.usage.output_tokens || 0
                };
            }
        }

        this._results.agents[agentId].status = 'completed';
        this._results.agents[agentId].timestamp = new Date().toISOString();
    },

    _updateProgress(agentId, completed, total) {
        const fill = document.getElementById('apg-progress-fill');
        const text = document.getElementById('apg-progress-text');
        if (fill) fill.style.width = `${Math.round((completed / total) * 100)}%`;
        if (text) {
            const agent = this.AGENTS[agentId];
            text.textContent = `Running Agent ${agent?.number || '?'}: ${agent?.name || agentId} (${completed + 1}/${total})`;
        }
    },

    // ══════════════════════════════════════════════════════════════
    //  STORAGE
    // ══════════════════════════════════════════════════════════════

    _loadResults() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error('[AuditPackage] Failed to load results:', e);
            return null;
        }
    },

    _saveResults() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._results));
        } catch (e) {
            console.error('[AuditPackage] Failed to save results:', e);
        }
    },

    _createEmptyResults() {
        return {
            version: this.VERSION,
            lastRun: null,
            pipeline: { status: 'pending', startedAt: null, completedAt: null, agentsRun: [], modelUsed: '' },
            agents: {}
        };
    },

    // ══════════════════════════════════════════════════════════════
    //  CONTEXT HELPERS
    // ══════════════════════════════════════════════════════════════

    _getAssessmentContext() {
        if (typeof ClaudeAPI !== 'undefined' && ClaudeAPI.buildAssessmentContext) {
            return ClaudeAPI.buildAssessmentContext();
        }
        return { summary: {}, familyStats: {}, poamData: {}, implementationData: {}, fipsCerts: [] };
    },

    _getFamilyIds() {
        const families = typeof CONTROL_FAMILIES !== 'undefined' ? CONTROL_FAMILIES : [];
        return families.map(f => f.id);
    },

    _getFamilyData(familyId) {
        const families = typeof CONTROL_FAMILIES !== 'undefined' ? CONTROL_FAMILIES : [];
        return families.find(f => f.id === familyId) || null;
    },

    _getOSCInventory() {
        try { return JSON.parse(localStorage.getItem('osc-inventory') || '{}'); } catch { return {}; }
    },

    _getSystemInventory() {
        try { return JSON.parse(localStorage.getItem('nist-system-inventory') || '{}'); } catch { return {}; }
    },

    _getInheritanceData() {
        try { return JSON.parse(localStorage.getItem('cmmc_inheritance_data') || '{}'); } catch { return {}; }
    },

    _getESPProfiles() {
        try { return JSON.parse(localStorage.getItem('cmmc_esp_profiles') || '{}'); } catch { return {}; }
    },

    _getImplementationData() {
        try { return JSON.parse(localStorage.getItem('nist-implementation-data') || '{}'); } catch { return {}; }
    },

    _getAssessmentData() {
        try { return JSON.parse(localStorage.getItem('nist-assessment-data') || '{}'); } catch { return {}; }
    },

    _getPOAMData() {
        try { return JSON.parse(localStorage.getItem('nist-poam-data') || '{}'); } catch { return {}; }
    },

    _getGuideData() {
        return typeof CMMC_L2_GUIDE_DATA !== 'undefined' ? CMMC_L2_GUIDE_DATA : null;
    },

    _getCCAMethodologyContext() {
        const guide = this._getGuideData();
        if (!guide) return '';
        return `
## CCA METHODOLOGY GROUNDING (from official CMMC L2 Assessment Guide + Scoping Guide v2.0)

### Assessment Methods
Assessors evaluate each of the 320 objectives using three methods:
- **Examine:** Review documents, policies, procedures, system configurations, logs
- **Interview:** Discuss with personnel responsible for implementing and managing controls
- **Test:** Actively test mechanisms, processes, and procedures to verify they function as intended

### Scoring
- Each objective: MET, NOT MET, or NOT APPLICABLE (N/A)
- A practice (control) is MET only when ALL of its objectives are MET
- CMMC Level 2 Final: ALL 110 practices must be MET (no POA&Ms)
- CMMC Level 2 Conditional: Minimum 80% of practices (88/110) must be MET; remaining can have POA&Ms
- POA&Ms must be closed within 180 days of the conditional certification

### POA&M Eligibility (32 CFR 170.21)
- Maximum of 22 practices (20%) can have POA&Ms
- Practices with a SPRS weight of 5 are NOT POA&M eligible
- Non-eligible practices include: 3.1.1, 3.1.2, 3.1.22, 3.3.1, 3.5.2, 3.5.3, 3.13.1, 3.13.2, 3.13.11

### Asset Categories (from Scoping Guide)
- **CUI Assets:** Process, store, or transmit CUI — ALL 110 practices apply
- **Security Protection Assets (SPA):** Provide security functions — ALL 110 practices apply
- **Contractor Risk Managed Assets (CRMA):** Can but not intended to handle CUI — contractor risk-based subset
- **Specialized Assets:** IoT, OT, GFE, test equipment — compensating controls documented
- **Out-of-Scope Assets:** No CUI access, completely separated — NOT assessed

### Evidence Quality (4-tier hierarchy)
1. System-generated evidence (highest): configs, logs, automated reports
2. Documented procedures: formal policies with approval/version control
3. Process evidence: records of implementation, tickets, checklists
4. Attestation (lowest): self-declaration without supporting evidence

### Assessment Philosophy
Every practice evaluated on 3 dimensions: Implementation, Documentation, Effectiveness.
Evidence must demonstrate ALL THREE to meet the objective.
`;
    },

    // ══════════════════════════════════════════════════════════════
    //  AGENT SYSTEM PROMPTS
    // ══════════════════════════════════════════════════════════════

    _buildPolicyEvaluatorPrompt() {
        return `You are an expert CMMC Level 2 Policy & Procedure Evaluator. Your role is to evaluate the alignment of an organization's policies and procedures against CMMC L2 assessment objectives.

${this._getCCAMethodologyContext()}

## YOUR TASK
For the given control family, evaluate each policy/procedure against every assessment objective. Score alignment and identify gaps.

## OUTPUT FORMAT (JSON)
Respond with a JSON object:
{
  "familyId": "AC",
  "familyName": "Access Control",
  "overallScore": 85,
  "findings": [
    {
      "objectiveId": "3.1.1[a]",
      "status": "covered|partially-covered|not-covered|not-addressed",
      "finding": "Description of what was found",
      "gap": "What is missing (if any)",
      "ccaQuestion": "The CCA interview question that would expose this gap",
      "recommendation": "Specific action to close the gap"
    }
  ],
  "summary": "Brief executive summary of policy alignment for this family"
}

## EVALUATION CRITERIA
For each objective, check if the policy addresses:
- WHO is responsible
- WHAT action is taken
- WHEN/how frequently
- WHERE (which systems/locations)
- HOW (specific tools/processes)
- EVIDENCE (what artifacts demonstrate compliance)

Flag: Missing objectives, vague language, future-tense statements ("will implement"), missing approval blocks, generic templates without customization.`;
    },

    _buildSSPNarratorPrompt() {
        return `You are an expert CMMC Level 2 SSP Narrative Generator. Your role is to generate present-tense, implementation-specific SSP narratives for each assessment objective.

${this._getCCAMethodologyContext()}

## YOUR TASK
For the given control family and its objectives, generate SSP implementation narratives.

## SSP STATEMENT STRUCTURE
Each narrative must follow this pattern:
- [ORGANIZATION] implements [CONTROL] by [SPECIFIC METHOD]
- WHO performs WHAT ACTION using WHAT TOOL/PROCESS
- HOW the security function is achieved
- WHEN/FREQUENCY the activity occurs
- WHERE the control is implemented
- Evidence references

## OUTPUT FORMAT (JSON)
{
  "familyId": "AC",
  "narratives": [
    {
      "objectiveId": "3.1.1[a]",
      "narrative": "Present-tense SSP narrative...",
      "evidenceReferences": ["Evidence artifact 1", "Evidence artifact 2"],
      "responsibleRole": "IT Manager",
      "status": "complete|placeholder|needs-data",
      "gaps": ["Any missing information needed"]
    }
  ]
}

## RULES
- ALWAYS use present tense ("The IT Manager reviews..." not "will review")
- Name actual tools and systems from the implementation data
- Be specific about frequencies and quantities
- Reference FIPS certificates for crypto-relevant controls
- For objectives without implementation data, generate [PLACEHOLDER] narrative with guidance
- Never use vague language ("appropriately", "as needed", "in a timely manner")`;
    },

    _buildPOAMAdvisorPrompt() {
        return `You are an expert CMMC Level 2 POA&M Remediation Advisor. Your role is to generate actionable remediation plans for POA&M items.

${this._getCCAMethodologyContext()}

## YOUR TASK
For each POA&M item, generate a detailed remediation plan with milestones, cost estimates, and success criteria.

## OUTPUT FORMAT (JSON)
{
  "poamItems": [
    {
      "controlId": "3.1.1",
      "objectiveId": "3.1.1[a]",
      "currentState": "Description of current implementation state",
      "remediationPlan": {
        "steps": ["Step 1", "Step 2"],
        "milestones": [{"name": "Milestone 1", "targetDate": "30 days", "criteria": "Success criteria"}],
        "estimatedCost": "$X-$Y",
        "estimatedTimeline": "X weeks",
        "toolsNeeded": ["Tool 1"],
        "personnelNeeded": ["Role 1"]
      },
      "poamEligible": true,
      "riskIfDelayed": "Impact description",
      "evidenceOfClosure": ["What evidence proves this is fixed"]
    }
  ],
  "priorityOrder": ["controlId1", "controlId2"],
  "totalEstimatedCost": "$X",
  "conditionalStatusEligible": true,
  "summary": "Executive summary"
}

## RULES
- Always check POA&M eligibility per 32 CFR 170.21
- Flag non-eligible controls that are NOT MET (these are showstoppers)
- Prioritize by SPRS point impact (higher point value = fix first)
- Include realistic cost estimates
- 180-day closure window is mandatory for conditional certification`;
    },

    _buildEvidenceAssemblerPrompt() {
        return `You are an expert CMMC Level 2 Evidence Package Assembler. Your role is to map available evidence artifacts to assessment objectives and identify gaps.

${this._getCCAMethodologyContext()}

## YOUR TASK
For the given control family, map available evidence to each objective and identify what's missing.

## OUTPUT FORMAT (JSON)
{
  "familyId": "AC",
  "evidenceMatrix": [
    {
      "objectiveId": "3.1.1[a]",
      "availableEvidence": [
        {"name": "AD User Export", "type": "system-generated", "status": "available", "adequacy": "adequate|partial|inadequate"}
      ],
      "missingEvidence": ["Access Control Matrix", "Account Provisioning Procedure"],
      "assessmentMethod": "examine|interview|test",
      "collectionPriority": "high|medium|low",
      "automatable": true
    }
  ],
  "summary": {
    "totalObjectives": 22,
    "evidenceComplete": 15,
    "evidencePartial": 4,
    "evidenceMissing": 3
  }
}

## EVIDENCE ADEQUACY CRITERIA
- **Adequate:** Clearly demonstrates implementation, current, complete, authentic
- **Partial:** Shows some implementation but has gaps (missing elements, outdated, incomplete scope)
- **Inadequate:** Fails to demonstrate implementation (wrong control, plans only, out of scope)`;
    },

    _buildCCASimulatorPrompt() {
        return `You are simulating a CMMC Third-Party Assessment Organization (C3PAO) Certified CMMC Assessor (CCA). Your role is to conduct a rigorous mock assessment interview.

${this._getCCAMethodologyContext()}

## YOUR TASK
For each objective in the given family, simulate what a CCA would ask during assessment, evaluate the OSC's current evidence/documentation, and identify weaknesses.

## OUTPUT FORMAT (JSON)
{
  "familyId": "AC",
  "simulations": [
    {
      "objectiveId": "3.1.1[a]",
      "ccaQuestion": "The primary question a CCA would ask",
      "followUpQuestions": ["Follow-up 1", "Follow-up 2"],
      "expectedAnswer": "What a good answer looks like based on current data",
      "currentReadiness": "ready|needs-work|not-ready",
      "weaknesses": ["Weakness 1"],
      "suggestedImprovements": ["Improvement 1"],
      "assessorNotes": "What the assessor would likely note"
    }
  ],
  "overallReadiness": "ready|needs-work|not-ready",
  "criticalFindings": ["Finding 1"]
}

## APPROACH
- Be adversarial — look for gaps a real assessor would find
- Ask follow-up questions that probe beyond surface-level compliance
- Consider whether interview answers would match documented evidence
- Flag any inconsistencies between SSP, evidence, and likely interview responses`;
    },

    _buildScopeValidatorPrompt() {
        return `You are an expert CMMC Level 2 Scope & Boundary Validator. Your role is to validate the completeness and accuracy of the OSC's CMMC Assessment Scope.

${this._getCCAMethodologyContext()}

## YOUR TASK
Validate the CUI boundary definition, asset categorization, and data flow completeness.

## OUTPUT FORMAT (JSON)
{
  "scopeHealth": {
    "score": 85,
    "rating": "good|needs-attention|critical"
  },
  "assetValidation": {
    "cuiAssets": {"count": 0, "issues": []},
    "spaAssets": {"count": 0, "issues": []},
    "crmaAssets": {"count": 0, "issues": []},
    "specializedAssets": {"count": 0, "issues": []},
    "outOfScope": {"count": 0, "issues": []}
  },
  "boundaryIssues": ["Issue 1"],
  "diagramCoverage": {"hasNetworkDiagram": false, "hasDataFlowDiagram": false, "gaps": []},
  "inheritanceIssues": ["Issue 1"],
  "aggressiveScopingFlags": ["Flag 1"],
  "recommendations": ["Recommendation 1"],
  "summary": "Executive summary"
}`;
    },

    _buildDependencyAnalyzerPrompt() {
        return `You are an expert CMMC Level 2 Cross-Control Dependency Analyzer. Your role is to identify control interdependencies and calculate the blast radius of gaps.

${this._getCCAMethodologyContext()}

## YOUR TASK
Analyze control dependencies, identify cascade failures, and recommend optimal remediation order.

## OUTPUT FORMAT (JSON)
{
  "dependencies": [
    {
      "controlId": "3.1.1",
      "dependsOn": ["3.5.1", "3.5.2", "3.5.3"],
      "dependedOnBy": ["3.1.3", "3.1.5"],
      "blastRadius": 5,
      "status": "met|not-met|partial"
    }
  ],
  "criticalPath": ["3.5.1", "3.5.2", "3.1.1", "3.1.3"],
  "sprsOptimization": [
    {"controlId": "3.1.1", "pointValue": 5, "priority": 1, "reason": "Foundational + high SPRS impact"}
  ],
  "crossFamilyChains": [
    {"chain": ["AC-3.1.1", "IA-3.5.1", "SC-3.13.1"], "description": "Authentication chain"}
  ],
  "summary": "Executive summary"
}`;
    },

    _buildPlatformContextPrompt() {
        return `You are an expert CMMC Level 2 Platform Context Analyzer. Your role is to detect the OSC's technology stack and map it to CMMC controls.

${this._getCCAMethodologyContext()}

## YOUR TASK
Analyze the asset inventory and implementation notes to detect the technology platform, map tools to controls, and identify EOL risks.

## OUTPUT FORMAT (JSON)
{
  "detectedPlatform": "azure-gcc-high|aws-govcloud|gcp|hybrid|on-prem",
  "confidence": "high|medium|low",
  "toolMapping": {
    "3.1.1": {"tools": ["Microsoft Entra ID"], "coverage": "full|partial|none"},
    "3.5.3": {"tools": ["Microsoft Authenticator", "Duo"], "coverage": "full"}
  },
  "enclavePattern": "dedicated|enterprise|hybrid",
  "eolAlerts": [
    {"asset": "Server-01", "os": "Windows Server 2012 R2", "eolDate": "2023-10-10", "risk": "critical"}
  ],
  "cloudServiceRecommendations": [
    {"controlId": "3.1.1", "service": "Microsoft Entra ID", "reason": "Centralized identity management"}
  ],
  "summary": "Executive summary"
}`;
    },

    _buildSRMValidatorPrompt() {
        return `You are an expert CMMC Level 2 Shared Responsibility Matrix (SRM) Validator. Your role is to validate ESP/CSP inheritance claims against actual SRM documentation.

${this._getCCAMethodologyContext()}

## YOUR TASK
Validate every control marked as inherited/shared has corresponding SRM documentation. Flag over-inheritance and missing SRM uploads.

## OUTPUT FORMAT (JSON)
{
  "validationResults": [
    {
      "controlId": "3.1.1",
      "claimedType": "fully-inherited|shared|customer",
      "srmDocumented": true,
      "cspName": "Azure GCC High",
      "issue": null,
      "recommendation": null
    }
  ],
  "overInheritanceFlags": [
    {"controlId": "3.1.1", "claimedType": "fully-inherited", "expectedType": "shared", "reason": "Typically requires customer configuration"}
  ],
  "missingSRMs": ["CSP Name without uploaded SRM"],
  "customerGaps": [
    {"controlId": "3.1.1", "issue": "Customer portion not documented in implementation notes"}
  ],
  "coverageScore": 85,
  "summary": "Executive summary"
}`;
    },

    _buildConMonPlannerPrompt() {
        return `You are an expert CMMC Level 2 Continuous Monitoring Plan Generator. Your role is to create an ongoing monitoring strategy per 32 CFR 170.

${this._getCCAMethodologyContext()}

## YOUR TASK
Generate a continuous monitoring plan with per-control frequencies, automation opportunities, and a 12-month calendar.

## OUTPUT FORMAT (JSON)
{
  "monitoringPlan": [
    {
      "controlId": "3.1.1",
      "monitoringType": "technical|operational|management",
      "frequency": "daily|weekly|monthly|quarterly|annual",
      "method": "automated|manual|hybrid",
      "tool": "Tool name or null",
      "activity": "What to monitor",
      "evidenceGenerated": "What evidence this produces"
    }
  ],
  "automationOpportunities": [
    {"controlId": "3.1.1", "tool": "Microsoft Entra ID", "capability": "Automated access reviews"}
  ],
  "annualCalendar": {
    "Q1": ["Activity 1"],
    "Q2": ["Activity 2"],
    "Q3": ["Activity 3"],
    "Q4": ["Activity 4"]
  },
  "summary": "Executive summary"
}`;
    },

    _buildMSSPAdvisorPrompt() {
        return `You are an expert CMMC Level 2 MSSP/Managed Service Advisor. Your role is to validate MSSP coverage and identify responsibility gaps.

${this._getCCAMethodologyContext()}

## YOUR TASK
Map MSSP services to controls, delineate responsibilities, and identify gaps the OSC must handle independently.

## OUTPUT FORMAT (JSON)
{
  "msspCoverage": [
    {
      "controlId": "3.1.1",
      "msspCovers": true,
      "msspService": "Managed Identity",
      "oscResponsibility": "Define access policies",
      "evidenceOwner": "mssp|osc|shared"
    }
  ],
  "slaIssues": [
    {"requirement": "72-hour DFARS incident reporting", "msspSla": "24 hours", "status": "compliant|gap"}
  ],
  "uncoveredControls": ["3.2.1", "3.9.1"],
  "recommendations": ["Recommendation 1"],
  "summary": "Executive summary"
}`;
    },

    _buildReadinessReportPrompt() {
        return `You are an expert CMMC Level 2 Audit Readiness Assessor. Your role is to aggregate all assessment data and agent outputs into an executive readiness report.

${this._getCCAMethodologyContext()}

## YOUR TASK
Generate a comprehensive readiness assessment with a RED/YELLOW/GREEN rating, critical gaps, and recommended timeline.

## OUTPUT FORMAT (JSON)
{
  "readinessRating": "RED|YELLOW|GREEN",
  "sprsScore": 0,
  "conditionalEligible": true,
  "criticalGaps": [
    {"controlId": "3.1.1", "issue": "Description", "impact": "high|medium|low", "remediation": "Action needed"}
  ],
  "strengthAreas": ["Area 1"],
  "riskHeatMap": {
    "AC": "green|yellow|red",
    "AT": "green|yellow|red"
  },
  "recommendedTimeline": {
    "immediate": ["Action 1"],
    "30days": ["Action 2"],
    "90days": ["Action 3"],
    "180days": ["Action 4"]
  },
  "executiveSummary": "2-3 paragraph executive summary"
}`;
    },

    // ══════════════════════════════════════════════════════════════
    //  AGENT USER MESSAGE BUILDERS
    // ══════════════════════════════════════════════════════════════

    _buildPolicyEvaluatorMessage(familyId) {
        const family = this._getFamilyData(familyId);
        if (!family) return null;
        const osc = this._getOSCInventory();
        const assessmentData = this._getAssessmentData();
        const implData = this._getImplementationData();

        // Get policies/procedures for this family
        const policies = (osc.policies || []).filter(p =>
            p.name?.toLowerCase().includes(family.name.toLowerCase()) ||
            p.family === familyId
        );
        const procedures = (osc.procedures || []).filter(p =>
            p.name?.toLowerCase().includes(family.name.toLowerCase()) ||
            p.family === familyId
        );

        const objectives = family.controls.flatMap(c =>
            c.objectives.map(o => ({
                id: o.id,
                text: o.text,
                controlId: c.id,
                controlName: c.name,
                status: assessmentData[o.id]?.status || 'not-assessed',
                implementation: implData[o.id]?.description || ''
            }))
        );

        return `## Family: ${family.name} (${familyId})

### Policies Found (${policies.length})
${policies.length > 0 ? policies.map(p => `- ${p.name}: ${p.content?.substring(0, 500) || '[No content]'}`).join('\n') : 'No policies uploaded for this family.'}

### Procedures Found (${procedures.length})
${procedures.length > 0 ? procedures.map(p => `- ${p.name}: ${p.content?.substring(0, 500) || '[No content]'}`).join('\n') : 'No procedures uploaded for this family.'}

### Assessment Objectives (${objectives.length})
${objectives.map(o => `- ${o.id} (${o.controlId} - ${o.controlName}): Status=${o.status}${o.implementation ? ', Impl: ' + o.implementation.substring(0, 200) : ''}\n  Text: ${o.text}`).join('\n')}

Evaluate the alignment of the policies and procedures against each objective. Return JSON.`;
    },

    _buildSSPNarratorMessage(familyId) {
        const family = this._getFamilyData(familyId);
        if (!family) return null;
        const assessmentData = this._getAssessmentData();
        const implData = this._getImplementationData();
        const osc = this._getOSCInventory();
        const inheritance = this._getInheritanceData();

        const objectives = family.controls.flatMap(c => {
            const inh = inheritance[c.id];
            return c.objectives.map(o => ({
                id: o.id,
                text: o.text,
                controlId: c.id,
                controlName: c.name,
                pointValue: c.pointValue || 1,
                status: assessmentData[o.id]?.status || 'not-assessed',
                implementation: implData[o.id]?.description || '',
                inheritance: inh ? `${inh.type} (${inh.csp || 'N/A'})` : 'Customer-only'
            }));
        });

        const fipsCerts = (osc.fipsCerts || []).filter(c =>
            (c.linkedControls || []).some(ctrl => family.controls.some(fc => fc.id === ctrl))
        );

        // Get platform context from prior agent results if available
        const platformResults = this._results?.agents?.['platform-context']?.results;

        return `## Family: ${family.name} (${familyId})

### Objectives (${objectives.length})
${objectives.map(o => `- ${o.id} (${o.controlId} - ${o.controlName}, ${o.pointValue}pt): Status=${o.status}, Inheritance=${o.inheritance}${o.implementation ? '\n  Implementation: ' + o.implementation.substring(0, 300) : ''}\n  Objective: ${o.text}`).join('\n')}

${fipsCerts.length > 0 ? `### FIPS Certificates\n${fipsCerts.map(c => `- #${c.certNumber}: ${c.moduleName} (${c.vendor}, ${c.standard}, Level ${c.level})`).join('\n')}` : ''}

${platformResults ? `### Platform Context (from Agent 9)\n${typeof platformResults === 'string' ? platformResults.substring(0, 1000) : JSON.stringify(platformResults).substring(0, 1000)}` : ''}

Generate SSP narratives for each objective. Return JSON.`;
    },

    _buildPOAMAdvisorMessage() {
        const poamData = this._getPOAMData();
        const assessmentData = this._getAssessmentData();
        const implData = this._getImplementationData();
        const context = this._getAssessmentContext();

        const poamItems = Object.entries(poamData).map(([objId, poam]) => {
            const families = typeof CONTROL_FAMILIES !== 'undefined' ? CONTROL_FAMILIES : [];
            let control = null, family = null, objective = null;
            families.forEach(f => f.controls.forEach(c => c.objectives.forEach(o => {
                if (o.id === objId) { objective = o; control = c; family = f; }
            })));

            return {
                objectiveId: objId,
                controlId: control?.id || '',
                controlName: control?.name || '',
                familyId: family?.id || '',
                pointValue: control?.pointValue || 1,
                status: assessmentData[objId]?.status || 'not-assessed',
                poamWeakness: poam.weakness || poam.remediation || '',
                poamRemediation: poam.remediation || '',
                poamDueDate: poam.scheduledDate || '',
                poamRisk: poam.risk || '',
                implementation: implData[objId]?.description || ''
            };
        });

        return `## POA&M Items (${poamItems.length})

### Assessment Summary
- SPRS Score: ${context.summary.sprsScore || 'N/A'}/110
- Met: ${context.summary.met || 0}, Not Met: ${context.summary.notMet || 0}, Partial: ${context.summary.partial || 0}

### POA&M Items
${poamItems.length > 0 ? poamItems.map(p => `- ${p.objectiveId} (${p.controlId} - ${p.controlName}, ${p.pointValue}pt, Family: ${p.familyId})
  Status: ${p.status}
  Weakness: ${p.poamWeakness || 'Not specified'}
  Remediation: ${p.poamRemediation || 'Not specified'}
  Due: ${p.poamDueDate || 'Not set'}
  Risk: ${p.poamRisk || 'Not set'}
  Implementation: ${p.implementation || 'None'}`).join('\n\n') : 'No POA&M items found.'}

Generate remediation plans for each POA&M item. Return JSON.`;
    },

    _buildEvidenceAssemblerMessage(familyId) {
        const family = this._getFamilyData(familyId);
        if (!family) return null;
        const osc = this._getOSCInventory();
        const assessmentData = this._getAssessmentData();
        const implData = this._getImplementationData();

        const objectives = family.controls.flatMap(c =>
            c.objectives.map(o => ({
                id: o.id,
                text: o.text,
                controlId: c.id,
                controlName: c.name,
                status: assessmentData[o.id]?.status || 'not-assessed',
                implementation: implData[o.id]?.description || ''
            }))
        );

        // Gather all evidence artifacts
        const allAssets = [
            ...(osc.cuiAssets || []).map(a => ({ ...a, category: 'CUI' })),
            ...(osc.spaAssets || []).map(a => ({ ...a, category: 'SPA' })),
            ...(osc.crmaAssets || []).map(a => ({ ...a, category: 'CRMA' })),
            ...(osc.specializedAssets || []).map(a => ({ ...a, category: 'Specialized' })),
            ...(osc.outOfScopeAssets || []).map(a => ({ ...a, category: 'OOS' }))
        ];

        return `## Family: ${family.name} (${familyId})

### Objectives (${objectives.length})
${objectives.map(o => `- ${o.id} (${o.controlId}): Status=${o.status}${o.implementation ? ', Impl: ' + o.implementation.substring(0, 200) : ''}\n  ${o.text}`).join('\n')}

### Available Artifacts
- Policies: ${(osc.policies || []).length}
- Procedures: ${(osc.procedures || []).length}
- SSP Documents: ${(osc.sspDocs || []).length}
- FIPS Certificates: ${(osc.fipsCerts || []).length}
- Assets in Inventory: ${allAssets.length} (CUI: ${(osc.cuiAssets || []).length}, SPA: ${(osc.spaAssets || []).length}, CRMA: ${(osc.crmaAssets || []).length})

Map evidence to objectives and identify gaps. Return JSON.`;
    },

    _buildCCASimulatorMessage(familyId) {
        const family = this._getFamilyData(familyId);
        if (!family) return null;
        const assessmentData = this._getAssessmentData();
        const implData = this._getImplementationData();

        // Get prior agent results for this family
        const policyResults = this._results?.agents?.['policy-evaluator']?.results?.[familyId];
        const sspResults = this._results?.agents?.['ssp-narrator']?.results?.[familyId];
        const evidenceResults = this._results?.agents?.['evidence-assembler']?.results?.[familyId];

        const objectives = family.controls.flatMap(c =>
            c.objectives.map(o => ({
                id: o.id,
                text: o.text,
                controlId: c.id,
                controlName: c.name,
                status: assessmentData[o.id]?.status || 'not-assessed',
                implementation: implData[o.id]?.description || ''
            }))
        );

        return `## Family: ${family.name} (${familyId})

### Objectives (${objectives.length})
${objectives.map(o => `- ${o.id} (${o.controlId} - ${o.controlName}): Status=${o.status}${o.implementation ? '\n  Implementation: ' + o.implementation.substring(0, 200) : ''}\n  Objective: ${o.text}`).join('\n')}

${policyResults ? `### Policy Evaluation Results (Agent 1)\n${typeof policyResults === 'string' ? policyResults.substring(0, 1500) : ''}` : ''}
${sspResults ? `### SSP Narratives (Agent 2)\n${typeof sspResults === 'string' ? sspResults.substring(0, 1500) : ''}` : ''}
${evidenceResults ? `### Evidence Status (Agent 4)\n${typeof evidenceResults === 'string' ? evidenceResults.substring(0, 1500) : ''}` : ''}

Simulate CCA interview questions for each objective. Return JSON.`;
    },

    _buildScopeValidatorMessage() {
        const osc = this._getOSCInventory();
        const sysInv = this._getSystemInventory();
        const inheritance = this._getInheritanceData();
        const espProfiles = this._getESPProfiles();
        const context = this._getAssessmentContext();

        const assets = {
            cui: osc.cuiAssets || [],
            spa: osc.spaAssets || [],
            crma: osc.crmaAssets || [],
            specialized: osc.specializedAssets || [],
            oos: osc.outOfScopeAssets || []
        };

        const sysAssets = Array.isArray(sysInv) ? sysInv : (sysInv.assets || []);

        return `## Scope & Boundary Validation

### OSC Inventory Asset Categories
- CUI Assets: ${assets.cui.length} ${assets.cui.length > 0 ? '(' + assets.cui.map(a => a.name || a.description || 'unnamed').slice(0, 10).join(', ') + ')' : ''}
- Security Protection Assets (SPA): ${assets.spa.length} ${assets.spa.length > 0 ? '(' + assets.spa.map(a => a.name || a.description || 'unnamed').slice(0, 10).join(', ') + ')' : ''}
- Contractor Risk Managed (CRMA): ${assets.crma.length}
- Specialized Assets: ${assets.specialized.length}
- Out-of-Scope: ${assets.oos.length}

### System Inventory
- Total Assets: ${sysAssets.length}
${sysAssets.slice(0, 20).map(a => `- ${a.name || 'unnamed'}: Type=${a.type || 'unknown'}, Boundary=${a.boundary || 'unknown'}, CUI=${a.cuiFlag || 'unknown'}, OS=${a.os || 'unknown'}`).join('\n')}

### Diagrams
- Network Diagrams: ${(osc.diagrams || []).filter(d => d.type === 'network').length}
- Data Flow Diagrams: ${(osc.diagrams || []).filter(d => d.type === 'dataflow').length}

### Inheritance Data
- Controls with inheritance: ${Object.keys(inheritance).length}
- ESP Profiles uploaded: ${Object.keys(espProfiles).length}

### Assessment Summary
- SPRS Score: ${context.summary.sprsScore || 'N/A'}/110

Validate the scope and boundary. Return JSON.`;
    },

    _buildDependencyAnalyzerMessage() {
        const assessmentData = this._getAssessmentData();
        const context = this._getAssessmentContext();

        // Build control status summary
        const families = typeof CONTROL_FAMILIES !== 'undefined' ? CONTROL_FAMILIES : [];
        const controlStatuses = [];
        families.forEach(f => {
            f.controls.forEach(c => {
                const allMet = c.objectives.every(o => assessmentData[o.id]?.status === 'met');
                const anyNotMet = c.objectives.some(o => assessmentData[o.id]?.status === 'not-met');
                controlStatuses.push({
                    id: c.id,
                    name: c.name,
                    family: f.id,
                    pointValue: c.pointValue || 1,
                    status: allMet ? 'met' : anyNotMet ? 'not-met' : 'partial',
                    objectiveCount: c.objectives.length
                });
            });
        });

        const notMet = controlStatuses.filter(c => c.status !== 'met');

        // Get cross-reference data if available
        const xrefData = typeof CTRL_XREF !== 'undefined' ? JSON.stringify(CTRL_XREF).substring(0, 3000) : 'Not available';
        const relatedObj = typeof RELATED_OBJECTIVES !== 'undefined' ? JSON.stringify(RELATED_OBJECTIVES).substring(0, 3000) : 'Not available';

        return `## Cross-Control Dependency Analysis

### Assessment Summary
- SPRS Score: ${context.summary.sprsScore || 'N/A'}/110
- Total Controls: ${controlStatuses.length}
- Controls NOT MET: ${notMet.length}

### Control Statuses (NOT MET / PARTIAL only)
${notMet.map(c => `- ${c.id} (${c.name}, ${c.family}, ${c.pointValue}pt): ${c.status}`).join('\n')}

### Cross-Reference Data
${xrefData}

### Related Objectives / Cross-Family Chains
${relatedObj}

Analyze dependencies and recommend remediation order. Return JSON.`;
    },

    _buildPlatformContextMessage() {
        const osc = this._getOSCInventory();
        const sysInv = this._getSystemInventory();
        const implData = this._getImplementationData();

        const sysAssets = Array.isArray(sysInv) ? sysInv : (sysInv.assets || []);

        // Extract tool mentions from implementation notes
        const toolMentions = new Set();
        Object.values(implData).forEach(impl => {
            const desc = impl?.description || '';
            const tools = desc.match(/(?:Microsoft|Azure|AWS|Google|CrowdStrike|Palo Alto|Cisco|Okta|Duo|CyberArk|SentinelOne|Qualys|Tenable|Splunk|Rapid7|KnowBe4|Proofpoint|Fortinet|SonicWall|Barracuda|Zscaler|Netskope|Cloudflare|Defender|Intune|Entra|Sentinel|Purview)\s*\w*/gi);
            if (tools) tools.forEach(t => toolMentions.add(t.trim()));
        });

        return `## Platform Context Analysis

### System Inventory (${sysAssets.length} assets)
${sysAssets.slice(0, 30).map(a => `- ${a.name || 'unnamed'}: Type=${a.type || 'unknown'}, OS=${a.os || 'unknown'}, Location=${a.location || 'unknown'}`).join('\n')}

### Tool Mentions in Implementation Notes
${toolMentions.size > 0 ? Array.from(toolMentions).join(', ') : 'No tools detected'}

### OSC Inventory Summary
- Policies: ${(osc.policies || []).length}
- Assets: CUI=${(osc.cuiAssets || []).length}, SPA=${(osc.spaAssets || []).length}, CRMA=${(osc.crmaAssets || []).length}
- FIPS Certs: ${(osc.fipsCerts || []).length}

Detect the platform, map tools to controls, and identify EOL risks. Return JSON.`;
    },

    _buildSRMValidatorMessage() {
        const inheritance = this._getInheritanceData();
        const espProfiles = this._getESPProfiles();
        const implData = this._getImplementationData();

        const inheritedControls = Object.entries(inheritance).map(([controlId, data]) => ({
            controlId,
            type: data.type || 'unknown',
            csp: data.csp || 'unknown',
            notes: data.notes || '',
            srmSource: data.srmSource || null
        }));

        return `## SRM Validation

### Inheritance Assignments (${inheritedControls.length} controls)
${inheritedControls.map(c => `- ${c.controlId}: Type=${c.type}, CSP=${c.csp}${c.srmSource ? ', SRM=' + c.srmSource : ', NO SRM'}${c.notes ? '\n  Notes: ' + c.notes.substring(0, 200) : ''}`).join('\n')}

### ESP Profiles Uploaded
${Object.keys(espProfiles).length > 0 ? Object.entries(espProfiles).map(([name, profile]) => `- ${name}: ${JSON.stringify(profile).substring(0, 300)}`).join('\n') : 'No ESP profiles uploaded.'}

Validate inheritance claims against SRM documentation. Return JSON.`;
    },

    _buildConMonPlannerMessage() {
        const context = this._getAssessmentContext();
        const implData = this._getImplementationData();

        // Get platform context from prior agent
        const platformResults = this._results?.agents?.['platform-context']?.results;

        // Get tool mentions
        const toolMentions = new Set();
        Object.values(implData).forEach(impl => {
            const desc = impl?.description || '';
            const tools = desc.match(/(?:Microsoft|Azure|AWS|Google|CrowdStrike|Splunk|Sentinel|Defender|Qualys|Tenable)\s*\w*/gi);
            if (tools) tools.forEach(t => toolMentions.add(t.trim()));
        });

        return `## Continuous Monitoring Plan

### Assessment Summary
- SPRS Score: ${context.summary.sprsScore || 'N/A'}/110
- Met: ${context.summary.met || 0}/${context.summary.totalObjectives || 320}

### Detected Tools
${toolMentions.size > 0 ? Array.from(toolMentions).join(', ') : 'No tools detected'}

${platformResults ? `### Platform Context (from Agent 9)\n${typeof platformResults === 'string' ? platformResults.substring(0, 2000) : JSON.stringify(platformResults).substring(0, 2000)}` : ''}

Generate a continuous monitoring plan. Return JSON.`;
    },

    _buildMSSPAdvisorMessage() {
        const implData = this._getImplementationData();
        const inheritance = this._getInheritanceData();
        const context = this._getAssessmentContext();

        // Look for MSSP mentions in implementation notes
        const msspMentions = [];
        Object.entries(implData).forEach(([objId, impl]) => {
            const desc = (impl?.description || '').toLowerCase();
            if (desc.includes('mssp') || desc.includes('managed') || desc.includes('soc') || desc.includes('mdr')) {
                msspMentions.push({ objectiveId: objId, mention: impl.description.substring(0, 200) });
            }
        });

        return `## MSSP/Managed Service Analysis

### Assessment Summary
- SPRS Score: ${context.summary.sprsScore || 'N/A'}/110

### MSSP Mentions in Implementation Notes (${msspMentions.length})
${msspMentions.length > 0 ? msspMentions.map(m => `- ${m.objectiveId}: ${m.mention}`).join('\n') : 'No MSSP mentions found in implementation notes.'}

### Inheritance Data
- Controls with inheritance: ${Object.keys(inheritance).length}

Analyze MSSP coverage and identify gaps. Return JSON.`;
    },

    _buildReadinessReportMessage() {
        const context = this._getAssessmentContext();
        const results = this._results;

        // Gather summaries from all completed agents
        const agentSummaries = {};
        Object.entries(results?.agents || {}).forEach(([agentId, data]) => {
            if (data.status === 'completed' && data.results) {
                agentSummaries[agentId] = typeof data.results === 'string'
                    ? data.results.substring(0, 2000)
                    : JSON.stringify(data.results).substring(0, 2000);
            }
        });

        return `## Audit Readiness Assessment

### Assessment Summary
- SPRS Score: ${context.summary.sprsScore || 'N/A'}/110
- Total Objectives: ${context.summary.totalObjectives || 320}
- Met: ${context.summary.met || 0} (${context.summary.percentMet || 0}%)
- Partial: ${context.summary.partial || 0}
- Not Met: ${context.summary.notMet || 0}
- Not Assessed: ${context.summary.notAssessed || 0}
- POA&M Items: ${context.summary.poamItems || 0}
- Deficiencies: ${context.summary.deficiencies || 0}

### Family Breakdown
${Object.entries(context.familyStats || {}).map(([id, f]) =>
    `- ${f.name}: ${f.met}/${f.total} met, ${f['not-met']} not met, ${f.partial} partial`
).join('\n')}

### Agent Results Summary
${Object.entries(agentSummaries).map(([id, summary]) => {
    const agent = this.AGENTS[id];
    return `#### ${agent?.name || id}\n${summary}`;
}).join('\n\n')}

Generate a comprehensive readiness report. Return JSON.`;
    },

    // ══════════════════════════════════════════════════════════════
    //  RESULTS VIEWER
    // ══════════════════════════════════════════════════════════════

    _showAgentResults(agentId) {
        const agent = this.AGENTS[agentId];
        const agentData = this._results?.agents?.[agentId];
        if (!agent || !agentData) return;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'apg-modal-backdrop';
        modal.innerHTML = `
            <div class="apg-modal">
                <div class="apg-modal-header">
                    <div class="apg-modal-title">
                        ${agent.icon}
                        <span>${agent.name}</span>
                        <span class="apg-status apg-status-${agentData.status}">${agentData.status}</span>
                    </div>
                    <button class="apg-modal-close">&times;</button>
                </div>
                <div class="apg-modal-meta">
                    <span>Model: ${agentData.modelUsed || 'N/A'}</span>
                    <span>Tokens: ${agentData.tokensUsed ? (agentData.tokensUsed.input + agentData.tokensUsed.output).toLocaleString() : 'N/A'}</span>
                    <span>Time: ${agentData.timestamp ? new Date(agentData.timestamp).toLocaleString() : 'N/A'}</span>
                </div>
                <div class="apg-modal-body">
                    ${agentData.error ? `<div class="apg-error">${agentData.error}</div>` : ''}
                    ${this._renderAgentResults(agentId, agentData)}
                </div>
            </div>
        `;

        modal.querySelector('.apg-modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

        // Wire family tab switching
        modal.querySelectorAll('.apg-family-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const fId = tab.dataset.family;
                modal.querySelectorAll('.apg-family-tab').forEach(t => t.classList.remove('active'));
                modal.querySelectorAll('.apg-family-result').forEach(r => r.classList.remove('active'));
                tab.classList.add('active');
                const target = modal.querySelector(`.apg-family-result[data-family="${fId}"]`);
                if (target) target.classList.add('active');
            });
        });

        document.body.appendChild(modal);
    },

    _renderAgentResults(agentId, agentData) {
        if (!agentData.results) return '<p class="apg-muted">No results available.</p>';

        const results = agentData.results;

        // If per-family results (object with family IDs as keys)
        if (typeof results === 'object' && !Array.isArray(results) && this.AGENTS[agentId]?.perFamily) {
            return `
                <div class="apg-family-tabs">
                    ${Object.keys(results).map((fId, i) => `<button class="apg-family-tab ${i === 0 ? 'active' : ''}" data-family="${fId}">${fId}</button>`).join('')}
                </div>
                <div class="apg-family-results">
                    ${Object.entries(results).map(([fId, content], i) => `
                        <div class="apg-family-result ${i === 0 ? 'active' : ''}" data-family="${fId}">
                            <pre class="apg-result-content">${this._escapeHtml(typeof content === 'string' ? content : JSON.stringify(content, null, 2))}</pre>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Single result (string)
        if (typeof results === 'string') {
            return `<pre class="apg-result-content">${this._escapeHtml(results)}</pre>`;
        }

        // Object result
        return `<pre class="apg-result-content">${this._escapeHtml(JSON.stringify(results, null, 2))}</pre>`;
    },

    // ══════════════════════════════════════════════════════════════
    //  EXPORT
    // ══════════════════════════════════════════════════════════════

    _exportPackage() {
        const results = this._results;
        if (!results) return;

        const context = this._getAssessmentContext();
        const orgData = (() => { try { return JSON.parse(localStorage.getItem('nist-org-data') || '{}'); } catch { return {}; } })();

        let html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>CMMC L2 Audit Package - ${orgData.orgName || 'Organization'}</title>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:1000px;margin:0 auto;padding:40px;color:#1a1a2e;line-height:1.6}
h1{color:#1a1a2e;border-bottom:3px solid #7aa2f7;padding-bottom:12px}
h2{color:#414868;margin-top:40px;border-bottom:1px solid #e0e0e0;padding-bottom:8px}
h3{color:#565f89}
pre{background:#f5f5f5;padding:16px;border-radius:8px;overflow-x:auto;font-size:13px;border:1px solid #e0e0e0}
.meta{color:#888;font-size:14px;margin-bottom:30px}
.agent-section{margin:30px 0;padding:20px;border:1px solid #e0e0e0;border-radius:8px}
.agent-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600}
.badge-completed{background:#c3e88d33;color:#4caf50}
.badge-error{background:#f7768e33;color:#f44336}
</style></head><body>
<h1>CMMC Level 2 Audit-Ready Package</h1>
<div class="meta">
<p><strong>Organization:</strong> ${orgData.orgName || 'Not specified'}</p>
<p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
<p><strong>SPRS Score:</strong> ${context.summary.sprsScore || 'N/A'}/110</p>
<p><strong>Assessment Progress:</strong> ${context.summary.met || 0}/${context.summary.totalObjectives || 320} objectives met (${context.summary.percentMet || 0}%)</p>
<p><strong>Model:</strong> ${results.pipeline?.modelUsed || 'N/A'}</p>
</div>`;

        // Add each agent's results
        Object.entries(results.agents || {}).forEach(([agentId, agentData]) => {
            const agent = this.AGENTS[agentId];
            if (!agent) return;
            html += `
<div class="agent-section">
<div class="agent-header">
<h2>Agent ${agent.number}: ${agent.name}</h2>
<span class="badge badge-${agentData.status}">${agentData.status}</span>
</div>
<p>${agent.description}</p>
${agentData.results ? `<pre>${this._escapeHtml(typeof agentData.results === 'string' ? agentData.results : JSON.stringify(agentData.results, null, 2))}</pre>` : '<p>No results.</p>'}
</div>`;
        });

        html += '</body></html>';

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CMMC-L2-Audit-Package-${new Date().toISOString().split('T')[0]}.html`;
        a.click();
        URL.revokeObjectURL(url);
    },

    // ══════════════════════════════════════════════════════════════
    //  UTILITIES
    // ══════════════════════════════════════════════════════════════

    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

console.log('[AuditPackageGenerator] Module loaded');
