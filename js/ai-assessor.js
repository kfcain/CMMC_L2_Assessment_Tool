/**
 * AI Assessor UI Component
 * Provides a slide-out panel for Claude-powered CMMC assessment guidance
 * Integrates with assessment data, POA&M, and implementation planner
 */

const AIAssessor = {
    isOpen: false,
    conversationHistory: [],
    currentContext: null, // 'global', 'objective', 'poam', 'planner', 'policy'
    contextData: null,
    systemPrompt: null,
    isStreaming: false,

    // Assessor skill prompts — loaded from user's Claude .md files
    skills: {
        assessor: null,      // Main assessor persona
        poamAdvisor: null,    // POA&M guidance
        implementor: null,    // Implementation guidance
        readiness: null,      // Assessment readiness check
        sspGenerator: null,   // SSP generation & authoring
        policyAdvisor: null   // Policy & procedure guidance
    },

    /**
     * Initialize the AI Assessor
     */
    init() {
        this.createPanel();
        this.bindGlobalEvents();
        this.loadSkills();
        console.log('[AIAssessor] Initialized');
    },

    /**
     * Load skill prompts from data/ai-skills/ directory
     * These will be populated from the user's Claude .md files
     */
    loadSkills() {
        // Default system prompt used until custom skills are loaded
        this.skills.assessor = this.getDefaultAssessorPrompt();
        this.skills.poamAdvisor = this.getDefaultPoamPrompt();
        this.skills.implementor = this.getDefaultImplementorPrompt();
        this.skills.readiness = this.getDefaultReadinessPrompt();
        this.skills.sspGenerator = this.getDefaultSspGeneratorPrompt();
        this.skills.policyAdvisor = this.getDefaultPolicyAdvisorPrompt();

        // Load custom skills if available
        if (typeof AI_ASSESSOR_SKILLS !== 'undefined') {
            if (AI_ASSESSOR_SKILLS.assessor) this.skills.assessor = AI_ASSESSOR_SKILLS.assessor;
            if (AI_ASSESSOR_SKILLS.poamAdvisor) this.skills.poamAdvisor = AI_ASSESSOR_SKILLS.poamAdvisor;
            if (AI_ASSESSOR_SKILLS.implementor) this.skills.implementor = AI_ASSESSOR_SKILLS.implementor;
            if (AI_ASSESSOR_SKILLS.readiness) this.skills.readiness = AI_ASSESSOR_SKILLS.readiness;
            if (AI_ASSESSOR_SKILLS.sspGenerator) this.skills.sspGenerator = AI_ASSESSOR_SKILLS.sspGenerator;
            if (AI_ASSESSOR_SKILLS.policyAdvisor) this.skills.policyAdvisor = AI_ASSESSOR_SKILLS.policyAdvisor;
            console.log('[AIAssessor] Custom skills loaded');
        }
    },

    /**
     * Create the slide-out panel DOM
     */
    createPanel() {
        // Backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'ai-assessor-backdrop';
        backdrop.className = 'ai-assessor-backdrop';
        backdrop.addEventListener('click', () => this.close());
        document.body.appendChild(backdrop);

        // Panel
        const panel = document.createElement('div');
        panel.id = 'ai-assessor-panel';
        panel.className = 'ai-assessor-panel';
        panel.innerHTML = `
            <div class="ai-panel-header">
                <div class="ai-panel-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/><circle cx="12" cy="15" r="2"/></svg>
                    <span>AI Assessor</span>
                    <span class="ai-context-badge" id="ai-context-badge">Ready</span>
                </div>
                <div class="ai-panel-actions">
                    <button class="ai-panel-btn" id="ai-settings-btn" title="API Settings">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                    </button>
                    <button class="ai-panel-btn" id="ai-clear-btn" title="Clear conversation">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                    <button class="ai-panel-btn" id="ai-close-btn" title="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
            </div>

            <!-- AI Provider Setup (shown when not configured) -->
            <div class="ai-setup" id="ai-setup">
                <div class="ai-setup-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                </div>
                ${typeof AIProvider !== 'undefined' ? AIProvider.renderSetupHTML() : '<h3>Connect AI Provider</h3><p>Loading...</p>'}
            </div>

            <!-- Quick Actions (shown when configured) -->
            <div class="ai-quick-actions" id="ai-quick-actions" style="display:none">
                <div class="ai-quick-label">Quick Actions</div>
                <div class="ai-quick-grid">
                    <button class="ai-quick-btn" data-action="readiness">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        Assessment Readiness
                    </button>
                    <button class="ai-quick-btn" data-action="gaps">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        Gap Analysis
                    </button>
                    <button class="ai-quick-btn" data-action="poam-review">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        POA&M Review
                    </button>
                    <button class="ai-quick-btn" data-action="sprs">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
                        SPRS Strategy
                    </button>
                    <button class="ai-quick-btn" data-action="next-steps">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Next Steps
                    </button>
                    <button class="ai-quick-btn" data-action="evidence">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Evidence Guidance
                    </button>
                    <button class="ai-quick-btn" data-action="ssp-generate">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        SSP Generator
                    </button>
                    <button class="ai-quick-btn" data-action="policy-advisor">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="12" y1="6" x2="12" y2="12"/><line x1="9" y1="9" x2="15" y2="9"/></svg>
                        Policy & Procedure Advisor
                    </button>
                </div>
            </div>

            <!-- Chat Messages -->
            <div class="ai-messages" id="ai-messages">
                <div class="ai-welcome" id="ai-welcome">
                    <div class="ai-welcome-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <p>Ask me anything about your CMMC assessment, POA&M strategy, implementation guidance, SSP generation, or assessment readiness.</p>
                </div>
            </div>

            <!-- Input Area -->
            <div class="ai-input-area" id="ai-input-area" style="display:none">
                <div class="ai-input-wrapper">
                    <textarea id="ai-input" class="ai-input" placeholder="Ask the AI Assessor..." rows="1"></textarea>
                    <button id="ai-send-btn" class="ai-send-btn" title="Send">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                </div>
                <div class="ai-input-hint">
                    <span id="ai-model-badge">Not connected</span>
                    <span class="ai-token-count" id="ai-token-count"></span>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // Bind panel events
        this.bindPanelEvents(panel);
    },

    /**
     * Bind events within the panel
     */
    _selectedProvider: 'anthropic',

    bindPanelEvents(panel) {
        // Close button
        panel.querySelector('#ai-close-btn').addEventListener('click', () => this.close());

        // Clear button
        panel.querySelector('#ai-clear-btn').addEventListener('click', () => this.clearConversation());

        // Settings button
        panel.querySelector('#ai-settings-btn').addEventListener('click', () => this.showSettings());

        // Provider tab clicks
        panel.querySelectorAll('.ai-provider-tab').forEach(tab => {
            tab.addEventListener('click', () => this.selectProvider(tab.dataset.provider));
        });

        // Initialize first provider tab
        this.selectProvider('anthropic');

        // Send button
        panel.querySelector('#ai-send-btn').addEventListener('click', () => this.sendUserMessage());

        // Input — enter to send, shift+enter for newline
        const input = panel.querySelector('#ai-input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendUserMessage();
            }
        });

        // Auto-resize textarea
        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        });

        // Quick action buttons
        panel.querySelectorAll('.ai-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });
    },

    /**
     * Select a provider tab and render its config
     */
    selectProvider(providerId) {
        this._selectedProvider = providerId;
        // Update tab active state
        document.querySelectorAll('.ai-provider-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.provider === providerId);
        });
        // Render provider config
        const configEl = document.getElementById('ai-provider-config');
        if (configEl && typeof AIProvider !== 'undefined') {
            configEl.innerHTML = AIProvider.renderProviderConfig(providerId);
            // Bind connect button and enter key for this provider
            const connectBtn = configEl.querySelector('#ai-connect-btn');
            const keyInput = configEl.querySelector('#ai-api-key-input');
            if (connectBtn) connectBtn.addEventListener('click', () => this.connectApiKey());
            if (keyInput) keyInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.connectApiKey();
            });
        }
    },

    /**
     * Bind global events (trigger buttons throughout the site)
     */
    bindGlobalEvents() {
        // FAB button (inline onclick blocked by CSP)
        const fabBtn = document.getElementById('ai-fab-btn');
        if (fabBtn) {
            fabBtn.addEventListener('click', () => this.toggle());
        }

        // Global keyboard shortcut: Ctrl/Cmd + Shift + I
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                this.toggle();
            }
        });

        // Delegate click for contextual AI buttons added throughout the site
        document.addEventListener('click', (e) => {
            const aiBtn = e.target.closest('.ai-assess-btn');
            if (aiBtn) {
                e.stopPropagation();
                const objectiveId = aiBtn.dataset.objectiveId;
                const context = aiBtn.dataset.context || 'objective';
                this.openWithContext(context, { objectiveId });
            }
        });
    },

    /**
     * Toggle panel open/closed
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    /**
     * Open the panel
     */
    open(context, contextData) {
        this.isOpen = true;
        document.getElementById('ai-assessor-panel').classList.add('open');
        document.getElementById('ai-assessor-backdrop').classList.add('visible');

        if (context) {
            this.currentContext = context;
            this.contextData = contextData;
        }

        // Show appropriate UI based on API key status
        if (ClaudeAPI.isConfigured()) {
            this.showChat();
        } else {
            this.showSetup();
        }

        // Update context badge
        this.updateContextBadge();
    },

    /**
     * Open with specific context (called from assessment view, POA&M, etc.)
     */
    openWithContext(context, data) {
        this.currentContext = context;
        this.contextData = data;
        this.open(context, data);

        // If already configured and context is an objective, auto-ask
        if (ClaudeAPI.isConfigured() && context === 'objective' && data.objectiveId) {
            const objContext = ClaudeAPI.buildObjectiveContext(data.objectiveId);
            if (objContext) {
                let autoMessage = `I need guidance on objective ${data.objectiveId} (${objContext.controlName}). Current status: ${objContext.status}.`;
                
                // Include inheritance context if available
                if (objContext.inheritance) {
                    const inh = objContext.inheritance;
                    autoMessage += ` ESP/CSP inheritance: ${inh.label}`;
                    if (inh.cspName) autoMessage += ` (${inh.cspName})`;
                    if (inh.notes) autoMessage += ` - ${inh.notes}`;
                    autoMessage += '.';
                }
                
                autoMessage += ' What should I do to meet this requirement?';
                this.processMessage(autoMessage);
            }
        }
    },

    /**
     * Close the panel
     */
    close() {
        this.isOpen = false;
        document.getElementById('ai-assessor-panel').classList.remove('open');
        document.getElementById('ai-assessor-backdrop').classList.remove('visible');
    },

    /**
     * Show the API key setup screen
     */
    showSetup() {
        document.getElementById('ai-setup').style.display = '';
        document.getElementById('ai-quick-actions').style.display = 'none';
        document.getElementById('ai-input-area').style.display = 'none';
    },

    /**
     * Show the chat interface
     */
    showChat() {
        document.getElementById('ai-setup').style.display = 'none';
        document.getElementById('ai-quick-actions').style.display = '';
        document.getElementById('ai-input-area').style.display = '';
    },

    /**
     * Show settings (allow changing API key)
     */
    showSettings() {
        if (AIProvider.isConfigured()) {
            const provName = AIProvider.getActiveDisplayName();
            if (confirm('Disconnect ' + provName + '?')) {
                AIProvider.clearApiKey(AIProvider.getActiveProvider());
                this.showSetup();
                this.clearConversation();
                this.selectProvider(this._selectedProvider || 'anthropic');
            }
        } else {
            this.showSetup();
            this.selectProvider(this._selectedProvider || 'anthropic');
        }
    },

    /**
     * Connect with API key (multi-provider)
     */
    async connectApiKey() {
        const input = document.getElementById('ai-api-key-input');
        const modelSelect = document.getElementById('ai-model-select');
        const key = input.value.trim();
        const providerId = this._selectedProvider;
        const modelId = modelSelect ? modelSelect.value : null;

        if (!key) {
            this.showInputError(input, 'Please enter your API key');
            return;
        }

        try {
            AIProvider.setApiKey(providerId, key);
            AIProvider.setActiveProvider(providerId);
            if (modelId) AIProvider.setActiveModel(modelId);

            // Test the connection with a minimal request
            const connectBtn = document.getElementById('ai-connect-btn');
            connectBtn.textContent = 'Connecting...';
            connectBtn.disabled = true;

            await AIProvider.sendMessage(
                'You are a test. Respond with OK.',
                [{ role: 'user', content: 'Test connection' }],
                { max_tokens: 10 }
            );

            // Success
            input.value = '';
            connectBtn.textContent = 'Connect';
            connectBtn.disabled = false;
            this.showChat();
            this.updateModelBadge();
            const displayName = AIProvider.getActiveDisplayName();
            this.addSystemMessage('Connected to ' + displayName + '. Ready to assist with your CMMC assessment.');

        } catch (error) {
            const connectBtn = document.getElementById('ai-connect-btn');
            connectBtn.textContent = 'Connect';
            connectBtn.disabled = false;

            // Rate limit (429) means the key IS valid — save it and proceed
            if (error.message && error.message.includes('Rate limited')) {
                input.value = '';
                this.showChat();
                this.updateModelBadge();
                const displayName = AIProvider.getActiveDisplayName();
                this.addSystemMessage('Connected to ' + displayName + '. (Test call was rate-limited — your key is saved. Wait a moment before sending requests.)');
                return;
            }

            AIProvider.clearApiKey(providerId);
            this.showInputError(input, error.message);
        }
    },

    /**
     * Update the model badge in the input area
     */
    updateModelBadge() {
        const badge = document.getElementById('ai-model-badge');
        if (badge) {
            badge.textContent = AIProvider.getActiveDisplayName();
        }
    },

    /**
     * Show input error
     */
    showInputError(input, message) {
        input.style.borderColor = 'var(--status-not-met)';
        const note = input.closest('.ai-provider-config, .ai-setup')?.querySelector('.ai-key-note');
        if (note) {
            note.innerHTML = `<span style="color:var(--status-not-met)">${message}</span>`;
            setTimeout(() => {
                input.style.borderColor = '';
                const provName = AIProvider.PROVIDERS[this._selectedProvider]?.name || 'AI';
                note.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Key never leaves your browser. Calls go directly to ${provName} API.
                `;
            }, 4000);
        }
    },

    /**
     * Handle quick action buttons
     */
    handleQuickAction(action) {
        const context = ClaudeAPI.buildAssessmentContext();
        const prompts = {
            'readiness': `Based on my current assessment status (${context.summary.met} met, ${context.summary.partial} partial, ${context.summary.notMet} not met, ${context.summary.notAssessed} not assessed out of ${context.summary.totalObjectives} objectives, SPRS score: ${context.summary.sprsScore}), give me a concise assessment readiness evaluation. Am I ready for a C3PAO assessment? What are my biggest risks?`,
            'gaps': `Analyze my assessment gaps. I have ${context.summary.notMet} objectives marked Not Met and ${context.summary.partial} marked Partial. My SPRS score is ${context.summary.sprsScore}. Which control families need the most attention? Prioritize by SPRS point impact.`,
            'poam-review': `Review my POA&M strategy. I have ${context.summary.poamItems} POA&M items and ${context.summary.deficiencies} critical deficiencies. My SPRS score is ${context.summary.sprsScore}. Are my POA&M items appropriate? Do I meet the 80% threshold (88/110) for Conditional Level 2 status?`,
            'sprs': `My current SPRS score is ${context.summary.sprsScore}/110. Help me develop a strategy to maximize my score. Which controls should I prioritize implementing first for the biggest SPRS point gains? Consider POA&M eligibility rules from 32 CFR 170.21.`,
            'next-steps': `Based on my assessment progress (${context.summary.percentMet}% met, SPRS: ${context.summary.sprsScore}), what are my immediate next steps? Give me a prioritized action plan for the next 30 days.`,
            'evidence': `What evidence and artifacts should I be collecting for my CMMC Level 2 assessment? Based on my current status (${context.summary.met} met, ${context.summary.notAssessed} not assessed), which areas am I most likely missing evidence for?`,
            'ssp-generate': `I need help generating SSP implementation narratives. My current assessment status: ${context.summary.met} met, ${context.summary.partial} partial, ${context.summary.notMet} not met out of ${context.summary.totalObjectives} objectives. Which control families should I prioritize writing SSP statements for? Give me a plan for building out my SSP, starting with the families that have the most "met" controls ready for documentation.`,
            'policy-advisor': `I need help with policies and procedures for my CMMC Level 2 assessment. My current assessment status: ${context.summary.met} met, ${context.summary.partial} partial, ${context.summary.notMet} not met, ${context.summary.notAssessed} not assessed out of ${context.summary.totalObjectives} objectives. Which policies and procedures do I need to prioritize? What should each one contain for my organization? Please ask me about my business context (org size, industry, tools, CUI types) so you can tailor the guidance.`
        };

        // Set context so buildSystemPrompt uses the right skill
        if (action === 'ssp-generate') {
            this.currentContext = 'ssp';
        } else if (action === 'policy-advisor') {
            this.currentContext = 'policy';
        }

        const message = prompts[action];
        if (message) {
            this.processMessage(message);
        }
    },

    /**
     * Send user message from input
     */
    sendUserMessage() {
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        if (!message || this.isStreaming) return;

        input.value = '';
        input.style.height = 'auto';
        this.processMessage(message);
    },

    /**
     * Process a message (add to UI, send to Claude, display response)
     */
    async processMessage(userMessage) {
        if (this.isStreaming) return;
        if (!ClaudeAPI.isConfigured()) {
            this.showSetup();
            return;
        }

        // Hide welcome
        const welcome = document.getElementById('ai-welcome');
        if (welcome) welcome.style.display = 'none';

        // Add user message to UI
        this.addMessage('user', userMessage);

        // Build system prompt with current context
        const systemPrompt = this.buildSystemPrompt();

        // Add to conversation history
        this.conversationHistory.push({ role: 'user', content: userMessage });

        // Show typing indicator
        const typingId = this.addTypingIndicator();

        this.isStreaming = true;
        this.updateSendButton(true);

        try {
            const response = await ClaudeAPI.sendMessage(
                systemPrompt,
                this.conversationHistory,
                { temperature: 0.3 }
            );

            // Remove typing indicator
            this.removeTypingIndicator(typingId);

            // Add response to UI and history
            this.addMessage('assistant', response.text);
            this.conversationHistory.push({ role: 'assistant', content: response.text });

            // Update token count
            if (response.usage) {
                document.getElementById('ai-token-count').textContent = 
                    `${response.usage.input_tokens + response.usage.output_tokens} tokens`;
            }

        } catch (error) {
            this.removeTypingIndicator(typingId);
            this.addSystemMessage(`Error: ${error.message}`, 'error');
            // Remove the failed user message from history
            this.conversationHistory.pop();
        }

        this.isStreaming = false;
        this.updateSendButton(false);
    },

    /**
     * Build the system prompt with assessment context
     */
    buildSystemPrompt() {
        const context = ClaudeAPI.buildAssessmentContext();
        let skill = this.skills.assessor;

        // Choose skill based on current context
        if (this.currentContext === 'poam') {
            skill = this.skills.poamAdvisor;
        } else if (this.currentContext === 'planner') {
            skill = this.skills.implementor;
        } else if (this.currentContext === 'ssp') {
            skill = this.skills.sspGenerator;
        } else if (this.currentContext === 'policy') {
            skill = this.skills.policyAdvisor;
        }

        // Inject live assessment data into the prompt
        // Build FIPS cert summary for context
        const fipsCerts = context.fipsCerts || [];
        const fipsSummary = fipsCerts.length > 0
            ? `\n- FIPS Certificates in Inventory: ${fipsCerts.length}\n### FIPS Validated Modules:\n${fipsCerts.map(c => {
                const linked = (c.linkedControls || []).length > 0 ? ` → Linked to: ${c.linkedControls.join(', ')}` : ' → Not yet linked to controls';
                return `- #${c.certNumber}: ${c.moduleName} (${c.vendor}, ${c.standard}, Level ${c.level}, ${c.status})${linked}`;
            }).join('\n')}\n`
            : '';

        const contextBlock = `

## CURRENT ASSESSMENT STATE (LIVE DATA)
- Assessment Level: ${context.level}
- Total Objectives: ${context.summary.totalObjectives}
- Met: ${context.summary.met} (${context.summary.percentMet}%)
- Partial: ${context.summary.partial}
- Not Met: ${context.summary.notMet}
- Not Assessed: ${context.summary.notAssessed}
- SPRS Score: ${context.summary.sprsScore}/110
- POA&M Items: ${context.summary.poamItems}
- Critical Deficiencies: ${context.summary.deficiencies}
- Assessment Completion: ${context.summary.percentComplete}%
${fipsSummary}
### Family Breakdown:
${Object.entries(context.familyStats).map(([id, f]) => 
    `- ${f.name}: ${f.met}/${f.total} met, ${f['not-met']} not met, ${f.partial} partial`
).join('\n')}
`;

        // Add objective-specific context if available
        let objectiveBlock = '';
        if (this.currentContext === 'objective' && this.contextData?.objectiveId) {
            const obj = ClaudeAPI.buildObjectiveContext(this.contextData.objectiveId);
            if (obj) {
                const objFips = (obj.fipsCerts || []).length > 0
                    ? `\n- FIPS Certificates for this control:\n${obj.fipsCerts.map(c => `  - #${c.certNumber}: ${c.moduleName} (${c.vendor}, ${c.standard}, Level ${c.level}, ${c.status})`).join('\n')}`
                    : '';
                const objMeetingQuotes = (obj.meetingQuotes || []).length > 0
                    ? `\n### Meeting Evidence (OSC Quotes from Assessment Interviews):\n${obj.meetingQuotes.map(q => `  - "${q.text}" — ${q.speaker}${q.speakerRole ? ' (' + q.speakerRole + ')' : ''}, ${q.meetingTitle || 'Meeting'}${q.meetingDate ? ' (' + new Date(q.meetingDate).toLocaleDateString() + ')' : ''}${q.assessorNote ? '\n    Assessor Note: ' + q.assessorNote : ''}`).join('\n')}\nUse these direct quotes from the OSC as evidence when evaluating this objective. Reference specific quotes in your assessment.`
                    : '';
                const objIntegrations = (obj.integrationEvidence || []).length > 0
                    ? `\n### Automated Integration Evidence:\n${obj.integrationEvidence.map(e => `  - **${e.source}** (synced ${new Date(e.syncDate).toLocaleDateString()}): ${e.summary}`).join('\n')}\nThis data was pulled automatically from connected tools. Reference these metrics when evaluating compliance.`
                    : '';
                objectiveBlock = `

## CURRENT OBJECTIVE CONTEXT
- Objective: ${obj.objectiveId}
- Text: ${obj.objectiveText}
- Control: ${obj.controlId} - ${obj.controlName}
- Family: ${obj.familyName}
- CMMC Practice: ${obj.cmmcPracticeId}
- Point Value: ${obj.pointValue}
- Current Status: ${obj.status}
- POA&M Eligible: ${obj.canBeOnPoam ? 'Yes' : 'No (32 CFR 170.21)'}
${obj.implementation ? `- Implementation Notes: ${obj.implementation.description}` : ''}
${obj.poam ? `- POA&M: Remediation: ${obj.poam.remediation || 'None'}, Due: ${obj.poam.scheduledDate || 'Not set'}, Risk: ${obj.poam.risk || 'Not set'}` : ''}${objFips}${objMeetingQuotes}${objIntegrations}
`;
            }
        }

        return skill + contextBlock + objectiveBlock;
    },

    /**
     * Add a message to the chat UI
     */
    addMessage(role, content) {
        const container = document.getElementById('ai-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-message ai-message-${role}`;

        if (role === 'assistant') {
            // Parse markdown-like formatting
            msgDiv.innerHTML = `
                <div class="ai-message-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/><circle cx="12" cy="15" r="2"/></svg>
                </div>
                <div class="ai-message-content">${this.formatResponse(content)}</div>
            `;
        } else {
            msgDiv.innerHTML = `
                <div class="ai-message-content">${this.escapeHtml(content)}</div>
            `;
        }

        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    },

    /**
     * Add a system message
     */
    addSystemMessage(text, type = 'info') {
        const container = document.getElementById('ai-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-system-message ai-system-${type}`;
        msgDiv.textContent = text;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    },

    /**
     * Add typing indicator
     */
    addTypingIndicator() {
        const id = 'typing-' + Date.now();
        const container = document.getElementById('ai-messages');
        const indicator = document.createElement('div');
        indicator.id = id;
        indicator.className = 'ai-typing-indicator';
        indicator.innerHTML = `
            <div class="ai-message-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/><circle cx="12" cy="15" r="2"/></svg>
            </div>
            <div class="ai-typing-dots"><span></span><span></span><span></span></div>
        `;
        container.appendChild(indicator);
        container.scrollTop = container.scrollHeight;
        return id;
    },

    /**
     * Remove typing indicator
     */
    removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    },

    /**
     * Update send button state
     */
    updateSendButton(loading) {
        const btn = document.getElementById('ai-send-btn');
        if (loading) {
            btn.disabled = true;
            btn.innerHTML = '<div class="ai-spinner"></div>';
        } else {
            btn.disabled = false;
            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
        }
    },

    /**
     * Update context badge
     */
    updateContextBadge() {
        const badge = document.getElementById('ai-context-badge');
        const labels = {
            'global': 'Full Assessment',
            'objective': 'Objective',
            'poam': 'POA&M',
            'planner': 'Planner',
            'policy': 'Policy Advisor'
        };
        badge.textContent = labels[this.currentContext] || 'Ready';
    },

    /**
     * Clear conversation
     */
    clearConversation() {
        this.conversationHistory = [];
        this.currentContext = 'global';
        this.contextData = null;
        const container = document.getElementById('ai-messages');
        container.innerHTML = '';
        const welcome = document.createElement('div');
        welcome.id = 'ai-welcome';
        welcome.className = 'ai-welcome';
        welcome.innerHTML = `
            <div class="ai-welcome-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <p>Ask me anything about your CMMC assessment, POA&M strategy, implementation guidance, SSP generation, or assessment readiness.</p>
        `;
        container.appendChild(welcome);
        document.getElementById('ai-token-count').textContent = '';
        this.updateContextBadge();
    },

    /**
     * Format Claude's response with basic markdown
     */
    formatResponse(text) {
        let html = this.escapeHtml(text);
        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        // Code blocks
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
        // Headers
        html = html.replace(/^### (.*$)/gm, '<h4>$1</h4>');
        html = html.replace(/^## (.*$)/gm, '<h3>$1</h3>');
        html = html.replace(/^# (.*$)/gm, '<h2>$1</h2>');
        // Lists
        html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
        // Numbered lists
        html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
        // Paragraphs
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';
        html = html.replace(/<p><\/p>/g, '');
        return html;
    },

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // =========================================
    // DEFAULT SKILL PROMPTS
    // These are used until custom .md files are loaded
    // =========================================

    getDefaultAssessorPrompt() {
        return `You are an expert CMMC Level 2 assessor with deep knowledge of NIST SP 800-171 Rev 2, NIST SP 800-171A, 32 CFR Part 170, and the CMMC Assessment Guide. You are helping an organization prepare for their CMMC Level 2 assessment.

## Your Role
- Act as a knowledgeable, practical assessor who gives actionable guidance
- Reference specific NIST 800-171 controls, assessment objectives, and CMMC practices
- Consider SPRS scoring implications and POA&M eligibility rules
- Be direct and specific — avoid generic compliance advice
- When discussing POA&M items, always reference 32 CFR 170.21 rules
- Understand that controls with point value > 1 cannot be on POA&M (except 3.13.11 FIPS exception)
- Know the 5 never-POA&M controls per 32 CFR 170.21(a)(2)(iii)

## Key Rules You Enforce
1. 80% threshold (88/110 controls) required before POA&M is permitted for Conditional status
2. Never-POA&M controls must be fully implemented: AC.L2-3.1.1, AC.L2-3.1.2, IA.L2-3.5.2, MP.L2-3.8.3, SC.L2-3.13.11
3. Controls with SPRS point value > 1 cannot be on POA&M for Conditional status
4. POA&M items must be closed within 180 days
5. Evidence must demonstrate both implementation AND effectiveness

## Response Style
- Use specific control IDs (e.g., AC.L2-3.1.1 or 3.1.1[a])
- Provide concrete, implementable steps
- Reference specific technologies when relevant (Azure/M365, AWS, etc.)
- Flag risks and common assessment findings
- Be concise but thorough`;
    },

    getDefaultPoamPrompt() {
        return `You are a CMMC POA&M specialist. You help organizations develop compliant Plans of Action & Milestones per 32 CFR Part 170 and NIST SP 800-171.

## POA&M Rules (32 CFR 170.21)
- Conditional Level 2 requires ≥ 80% (88/110) controls implemented
- POA&M items must be closed within 180 days of Conditional status
- Controls with SPRS point value > 1 CANNOT be on POA&M (except SC.L2-3.13.11 FIPS exception)
- 5 controls can NEVER be on POA&M: AC.L2-3.1.1, AC.L2-3.1.2, IA.L2-3.5.2, MP.L2-3.8.3, SC.L2-3.13.11
- Each POA&M entry needs: weakness description, remediation plan, milestones, responsible party, target date, risk level, estimated cost

## Your Role
- Review POA&M entries for completeness and compliance
- Suggest realistic remediation plans and timelines
- Flag items that cannot be on POA&M
- Help prioritize remediation by risk and SPRS impact
- Ensure POA&M entries would satisfy a C3PAO assessor`;
    },

    getDefaultImplementorPrompt() {
        return `You are a CMMC implementation specialist helping organizations build their security program from scratch or improve existing controls. You have expertise in:

- NIST SP 800-171 Rev 2 and Rev 3 requirements
- Microsoft 365 GCC High / Azure Government
- AWS GovCloud
- On-premises infrastructure
- Policy and procedure development
- Evidence collection and documentation

## Your Role
- Provide specific, actionable implementation guidance
- Recommend technologies and configurations
- Help develop policies, procedures, and SSP content
- Guide evidence collection for assessment
- Consider budget and resource constraints for small/medium businesses
- Reference the implementation planner phases when relevant`;
    },

    getDefaultReadinessPrompt() {
        return `You are a CMMC assessment readiness evaluator. You help organizations determine if they are ready for a C3PAO assessment and identify gaps that need to be addressed.

## Readiness Criteria
1. All 110 controls assessed (no "not assessed" items remaining)
2. SPRS score calculated and submitted to SPRS
3. System Security Plan (SSP) complete and current
4. POA&M items comply with 32 CFR 170.21 rules
5. Evidence artifacts collected for all "met" controls
6. Policies and procedures documented for all 14 families
7. Personnel trained on security awareness
8. Incident response plan tested
9. Configuration baselines documented
10. Continuous monitoring program in place

## Your Role
- Evaluate readiness based on current assessment data
- Identify critical gaps that would cause assessment failure
- Prioritize remediation actions
- Estimate timeline to readiness
- Flag common C3PAO findings`;
    },

    getDefaultPolicyAdvisorPrompt() {
        return `You are an expert CMMC Level 2 policy and procedure advisor with deep knowledge of NIST SP 800-171 Rev 2/3, NIST SP 800-171A, and CMMC assessment methodology. You help organizations develop assessment-ready policies and procedures tailored to their specific business context.

## Core Principles

### Policy vs. Procedure
- **Policy** = WHAT and WHY (management-level statement of intent, approved by leadership)
- **Procedure** = HOW, WHO, WHEN, WHERE (step-by-step operational instructions with specific tools, roles, timelines)
- Assessors require BOTH. A policy without procedures is a statement of intent. A procedure without a policy has no authority.

### The Assessor's Test
For every policy/procedure, a C3PAO assessor asks:
1. "Show me the policy." → Formal document with approval, version, date
2. "Walk me through the procedure." → Staff can describe actual steps
3. "Show me evidence it's being followed." → Logs, records, screenshots
4. "What happens when [exception]?" → Procedure addresses edge cases

## Your Role
- Determine which policies and procedures the organization needs based on their assessment status
- Tailor content to the organization's size, industry, tools, and CUI scope
- Write procedures at Level 3 quality: tool-specific, role-specific, with timelines and evidence
- Map every policy statement to specific NIST 800-171 controls
- Flag common mistakes (template policies, missing procedures, role mismatches)
- Always ask for business context before writing: org size, tools, industry, CUI types, physical footprint

## Procedure Quality Standard (Level 3)
Every procedure must answer the 6W formula:
- WHO performs the action (specific job title)
- WHAT action is performed
- WHEN / how often
- WHERE (on what system / in what location)
- HOW (specific step-by-step instructions)
- EVIDENCE (what record is created)

## Required Policy Set (14-16 documents minimum)
1. Access Control Policy (AC)
2. Awareness & Training Policy (AT)
3. Audit & Accountability Policy (AU)
4. Configuration Management Policy (CM)
5. Identification & Authentication Policy (IA)
6. Incident Response Plan (IR)
7. Maintenance Policy (MA)
8. Media Protection Policy (MP)
9. Personnel Security Policy (PS)
10. Physical & Environmental Protection Policy (PE)
11. Risk Assessment Policy (RA)
12. Security Assessment & Monitoring Policy (CA)
13. System & Communications Protection Policy (SC)
14. System & Information Integrity Policy (SI)
15. Planning Policy (PL) — Rev 3
16. Supply Chain Risk Management Policy (SR) — Rev 3

## Org Size Calibration
- **Small (<50):** Role consolidation expected (IT Manager = Security Officer). Combine into 3-4 master documents. Simpler approval chains.
- **Medium (50-250):** 6-8 documents with family-specific procedure appendices. Formal ticketing.
- **Large (>250):** Full 16+ standalone policies. Dedicated security team. CAB process.

## Response Format
1. Ask for business context if not provided
2. Identify which policies/procedures are needed
3. Provide procedures at Level 3 quality (assessment-ready)
4. Map to NIST controls explicitly
5. List evidence artifacts the procedure produces
6. Flag common mistakes for the org's profile
7. Provide copy-paste-ready content`;
    },

    getDefaultSspGeneratorPrompt() {
        return `You are an expert System Security Plan (SSP) author for CMMC Level 2 / NIST 800-171. You generate complete, assessment-ready SSP implementation narratives that satisfy C3PAO requirements.

## Core Rules
1. ALWAYS write in present tense — describe what IS implemented, never what WILL BE
2. ALWAYS name specific tools, systems, roles, and configurations
3. ALWAYS address every assessment objective ([a], [b], [c], etc.) explicitly
4. ALWAYS include evidence artifact references
5. ALWAYS identify responsible roles by title
6. NEVER use vague language or future tense
7. NEVER skip assessment objectives

## Your Role
- Generate SSP control implementation statements from assessment data
- Build complete SSP sections with narratives, evidence references, and responsible roles
- Review and improve existing SSP content for assessment readiness
- Map organizational tools, processes, and personnel to NIST 800-171 controls
- Produce exportable, copy-paste-ready SSP content for each control family
- Flag missing objectives, vague language, or future-tense statements in existing SSP content`;
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AIAssessor.init());
} else {
    AIAssessor.init();
}

console.log('[AIAssessor] Module loaded');
