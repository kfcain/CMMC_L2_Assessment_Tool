// Integrations Hub Module
// Unified integration framework for external tools:
//   - Microsoft Entra ID (Graph API) — MFA, Conditional Access, Users
//   - KnowBe4 — Training completion, phishing simulations
//   - Tenable.io — Vulnerability scans, compliance audits
//   - Jira — POA&M ticket linking, remediation tracking
//   - OSCAL — Import/Export NIST standard assessment data
// All credentials stored in sessionStorage (never persisted to disk)
// Integration data cached in localStorage

const IntegrationsHub = {

    // =========================================
    // CONFIGURATION
    // =========================================
    config: {
        version: '1.0.0',
        storageKey: 'cmmc_integrations_hub',
        credentialPrefix: 'cmmc_int_cred_',
    },

    // Provider registry
    providers: {
        entra: {
            id: 'entra',
            name: 'Microsoft Entra ID',
            description: 'Pull MFA status, conditional access policies, user directory, and sign-in logs via Microsoft Graph API',
            icon: 'entra',
            category: 'identity',
            controls: ['3.1.1', '3.1.2', '3.1.5', '3.1.7', '3.1.12', '3.1.15', '3.5.1', '3.5.2', '3.5.3', '3.5.4', '3.5.7', '3.5.8', '3.5.9', '3.5.10'],
            requiredCredentials: ['tenantId', 'clientId', 'clientSecret'],
            baseUrl: 'https://graph.microsoft.com/v1.0',
            authUrl: 'https://login.microsoftonline.com',
            docUrl: 'https://learn.microsoft.com/en-us/graph/overview'
        },
        knowbe4: {
            id: 'knowbe4',
            name: 'KnowBe4',
            description: 'Import training completion rates, phishing simulation results, and user risk scores',
            icon: 'knowbe4',
            category: 'training',
            controls: ['3.2.1', '3.2.2', '3.2.3'],
            requiredCredentials: ['apiKey', 'region'],
            baseUrl: 'https://REGION.api.knowbe4.com/v1',
            docUrl: 'https://developer.knowbe4.com/'
        },
        tenable: {
            id: 'tenable',
            name: 'Tenable.io',
            description: 'Pull vulnerability scan results, compliance audit findings, and severity breakdowns',
            icon: 'tenable',
            category: 'vulnerability',
            controls: ['3.11.1', '3.11.2', '3.11.3', '3.14.1', '3.14.2', '3.14.6', '3.14.7'],
            requiredCredentials: ['accessKey', 'secretKey'],
            baseUrl: 'https://cloud.tenable.com',
            docUrl: 'https://developer.tenable.com/'
        },
        jira: {
            id: 'jira',
            name: 'Jira',
            description: 'Link POA&M items to Jira tickets, sync remediation status and milestones',
            icon: 'jira',
            category: 'ticketing',
            controls: [],
            requiredCredentials: ['domain', 'email', 'apiToken'],
            baseUrl: 'https://DOMAIN.atlassian.net/rest/api/3',
            docUrl: 'https://developer.atlassian.com/cloud/jira/platform/rest/v3/'
        },
        oscal: {
            id: 'oscal',
            name: 'OSCAL',
            description: 'Import/Export assessment results, SSP, and POA&M in NIST OSCAL JSON format',
            icon: 'oscal',
            category: 'standard',
            controls: [],
            requiredCredentials: [],
            docUrl: 'https://pages.nist.gov/OSCAL/'
        }
    },

    // Cached integration data
    data: {},
    // Connection status per provider
    connectionStatus: {},

    // =========================================
    // INITIALIZATION
    // =========================================
    init() {
        this.loadData();
        this.bindGlobalEvents();
        console.log('[IntegrationsHub] Initialized —', Object.keys(this.providers).length, 'providers registered');
    },

    bindGlobalEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#open-integrations-hub-btn') || e.target.closest('[data-view="integrations-hub"]')) {
                this.showHub();
            }
        });
    },

    loadData() {
        try {
            this.data = JSON.parse(localStorage.getItem(this.config.storageKey) || '{}');
        } catch (e) {
            this.data = {};
        }
    },

    saveData() {
        try {
            localStorage.setItem(this.config.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('[IntegrationsHub] Save failed:', e);
        }
    },

    // =========================================
    // CREDENTIAL MANAGEMENT (sessionStorage only)
    // =========================================
    getCredentials(providerId) {
        try {
            return JSON.parse(sessionStorage.getItem(this.config.credentialPrefix + providerId) || 'null');
        } catch (e) {
            return null;
        }
    },

    setCredentials(providerId, creds) {
        sessionStorage.setItem(this.config.credentialPrefix + providerId, JSON.stringify(creds));
    },

    clearCredentials(providerId) {
        sessionStorage.removeItem(this.config.credentialPrefix + providerId);
        this.connectionStatus[providerId] = 'disconnected';
    },

    hasCredentials(providerId) {
        return this.getCredentials(providerId) !== null;
    },

    // =========================================
    // HELPER UTILITIES
    // =========================================
    esc(str) {
        if (!str) return '';
        return typeof Sanitize !== 'undefined' ? Sanitize.html(String(str)) : String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    },

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `ih-toast ih-toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
    },

    formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        try { return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
        catch { return dateStr; }
    },

    formatDateTime(dateStr) {
        if (!dateStr) return 'N/A';
        try { return new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }); }
        catch { return dateStr; }
    },

    getProviderIcon(providerId) {
        const icons = {
            entra: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
            knowbe4: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
            tenable: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>',
            jira: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 12l10 10 10-10L12 2z"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>',
            oscal: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/></svg>'
        };
        return icons[providerId] || '';
    },

    getCategoryLabel(cat) {
        return { identity: 'Identity & Access', training: 'Security Training', vulnerability: 'Vulnerability Mgmt', ticketing: 'Ticketing & POA&M', standard: 'Standards & Export' }[cat] || cat;
    },

    getCategoryColor(cat) {
        return { identity: '#3b82f6', training: '#10b981', vulnerability: '#f59e0b', ticketing: '#8b5cf6', standard: '#6366f1' }[cat] || '#6b7280';
    },

    // =========================================
    // MAIN HUB UI
    // =========================================
    showHub() {
        // Remove existing modal if any
        document.querySelectorAll('.ih-modal-backdrop').forEach(m => m.remove());

        const modal = document.createElement('div');
        modal.className = 'ih-modal-backdrop';
        modal.innerHTML = this.renderHubContent();
        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.classList.add('active'));
        this.bindHubEvents(modal);
    },

    renderHubContent() {
        const providerCards = Object.values(this.providers).map(p => {
            const connected = this.connectionStatus[p.id] === 'connected';
            const hasData = this.data[p.id] && this.data[p.id].lastSync;
            const lastSync = hasData ? this.formatDateTime(this.data[p.id].lastSync) : null;
            const isOscal = p.id === 'oscal';
            const controlCount = p.controls.length;

            return `
                <div class="ih-provider-card ${connected ? 'ih-connected' : ''}" data-provider="${p.id}">
                    <div class="ih-provider-card-header">
                        <div class="ih-provider-icon" style="color:${this.getCategoryColor(p.category)}">
                            ${this.getProviderIcon(p.id)}
                        </div>
                        <div class="ih-provider-info">
                            <h4>${this.esc(p.name)}</h4>
                            <span class="ih-category-tag" style="background:${this.getCategoryColor(p.category)}20;color:${this.getCategoryColor(p.category)}">${this.getCategoryLabel(p.category)}</span>
                        </div>
                        <div class="ih-provider-status">
                            ${connected ? '<span class="ih-status-dot ih-status-connected"></span> Connected' : hasData ? '<span class="ih-status-dot ih-status-cached"></span> Cached' : '<span class="ih-status-dot ih-status-none"></span> Not configured'}
                        </div>
                    </div>
                    <p class="ih-provider-desc">${this.esc(p.description)}</p>
                    <div class="ih-provider-meta">
                        ${controlCount > 0 ? `<span class="ih-meta-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/></svg> ${controlCount} controls</span>` : ''}
                        ${lastSync ? `<span class="ih-meta-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> ${lastSync}</span>` : ''}
                    </div>
                    <div class="ih-provider-actions">
                        ${isOscal ? `
                            <button class="ih-btn ih-btn-primary ih-oscal-import-btn" data-provider="${p.id}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                Import
                            </button>
                            <button class="ih-btn ih-btn-secondary ih-oscal-export-btn" data-provider="${p.id}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                Export
                            </button>
                        ` : `
                            <button class="ih-btn ih-btn-primary ih-configure-btn" data-provider="${p.id}">
                                ${connected ? 'Sync Now' : 'Configure'}
                            </button>
                            ${connected ? `<button class="ih-btn ih-btn-secondary ih-view-data-btn" data-provider="${p.id}">View Data</button>` : ''}
                            ${connected ? `<button class="ih-btn ih-btn-ghost ih-disconnect-btn" data-provider="${p.id}">Disconnect</button>` : ''}
                        `}
                        <a href="${p.docUrl}" target="_blank" rel="noopener noreferrer" class="ih-btn ih-btn-ghost" title="API Documentation">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        </a>
                    </div>
                </div>
            `;
        }).join('');

        // Summary stats
        const connectedCount = Object.values(this.connectionStatus).filter(s => s === 'connected').length;
        const cachedCount = Object.keys(this.data).filter(k => this.data[k]?.lastSync).length;
        const totalControls = [...new Set(Object.values(this.providers).flatMap(p => p.controls))].length;

        return `
            <div class="ih-modal">
                <div class="ih-modal-header">
                    <div class="ih-modal-title">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                        <h2>Integrations Hub</h2>
                        <span class="ih-version">v${this.config.version}</span>
                    </div>
                    <button class="ih-modal-close" onclick="this.closest('.ih-modal-backdrop').remove()">&times;</button>
                </div>
                <div class="ih-modal-body">
                    <div class="ih-stats-strip">
                        <div class="ih-stat">
                            <span class="ih-stat-value">${connectedCount}</span>
                            <span class="ih-stat-label">Connected</span>
                        </div>
                        <div class="ih-stat">
                            <span class="ih-stat-value">${cachedCount}</span>
                            <span class="ih-stat-label">With Data</span>
                        </div>
                        <div class="ih-stat">
                            <span class="ih-stat-value">${totalControls}</span>
                            <span class="ih-stat-label">Controls Covered</span>
                        </div>
                        <div class="ih-stat">
                            <span class="ih-stat-value">${Object.keys(this.providers).length}</span>
                            <span class="ih-stat-label">Integrations</span>
                        </div>
                    </div>
                    <p class="ih-hub-desc">Connect external tools to automatically pull evidence and compliance data into your assessment. Credentials are stored in session memory only and never persisted to disk.</p>
                    <div class="ih-provider-grid">
                        ${providerCards}
                    </div>
                </div>
            </div>
        `;
    },

    bindHubEvents(modal) {
        // Configure / Sync buttons
        modal.querySelectorAll('.ih-configure-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const pid = btn.dataset.provider;
                if (this.connectionStatus[pid] === 'connected') {
                    this.syncProvider(pid, modal);
                } else {
                    this.showConfigureModal(pid, modal);
                }
            });
        });

        // View Data buttons
        modal.querySelectorAll('.ih-view-data-btn').forEach(btn => {
            btn.addEventListener('click', () => this.showDataView(btn.dataset.provider, modal));
        });

        // Disconnect buttons
        modal.querySelectorAll('.ih-disconnect-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.clearCredentials(btn.dataset.provider);
                this.showToast(`Disconnected from ${this.providers[btn.dataset.provider].name}`, 'info');
                this.refreshHub(modal);
            });
        });

        // OSCAL Import
        modal.querySelectorAll('.ih-oscal-import-btn').forEach(btn => {
            btn.addEventListener('click', () => this.showOscalImportModal(modal));
        });

        // OSCAL Export
        modal.querySelectorAll('.ih-oscal-export-btn').forEach(btn => {
            btn.addEventListener('click', () => this.showOscalExportModal(modal));
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    },

    refreshHub(modal) {
        const body = modal.querySelector('.ih-modal-body');
        if (!body) return;
        const temp = document.createElement('div');
        temp.innerHTML = this.renderHubContent();
        const newBody = temp.querySelector('.ih-modal-body');
        if (newBody) {
            body.innerHTML = newBody.innerHTML;
            this.bindHubEvents(modal);
        }
    },

    // =========================================
    // CONFIGURE MODAL (per provider)
    // =========================================
    showConfigureModal(providerId, parentModal) {
        const provider = this.providers[providerId];
        if (!provider) return;
        const existing = this.getCredentials(providerId) || {};

        const fields = {
            entra: [
                { key: 'tenantId', label: 'Tenant ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', type: 'text' },
                { key: 'clientId', label: 'Application (Client) ID', placeholder: 'App registration client ID', type: 'text' },
                { key: 'clientSecret', label: 'Client Secret', placeholder: 'Client secret value', type: 'password' }
            ],
            knowbe4: [
                { key: 'apiKey', label: 'API Key', placeholder: 'Your KnowBe4 reporting API key', type: 'password' },
                { key: 'region', label: 'Region', placeholder: 'us, eu, uk, de, ca, au', type: 'select', options: ['us', 'eu', 'uk', 'de', 'ca', 'au'] }
            ],
            tenable: [
                { key: 'accessKey', label: 'Access Key', placeholder: 'Tenable.io access key', type: 'password' },
                { key: 'secretKey', label: 'Secret Key', placeholder: 'Tenable.io secret key', type: 'password' }
            ],
            jira: [
                { key: 'domain', label: 'Jira Domain', placeholder: 'yourcompany (from yourcompany.atlassian.net)', type: 'text' },
                { key: 'email', label: 'Email', placeholder: 'your-email@company.com', type: 'email' },
                { key: 'apiToken', label: 'API Token', placeholder: 'Jira API token from id.atlassian.com', type: 'password' }
            ]
        };

        const providerFields = fields[providerId] || [];

        const overlay = document.createElement('div');
        overlay.className = 'ih-config-overlay';
        overlay.innerHTML = `
            <div class="ih-config-modal">
                <div class="ih-config-header">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="color:${this.getCategoryColor(provider.category)}">${this.getProviderIcon(providerId)}</span>
                        <h3>Configure ${this.esc(provider.name)}</h3>
                    </div>
                    <button class="ih-config-close">&times;</button>
                </div>
                <div class="ih-config-body">
                    <p class="ih-config-desc">${this.esc(provider.description)}</p>
                    <div class="ih-config-security-note">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        Credentials are stored in session memory only. They will be cleared when you close the browser tab.
                    </div>
                    <div class="ih-config-fields">
                        ${providerFields.map(f => `
                            <div class="ih-field">
                                <label>${this.esc(f.label)}</label>
                                ${f.type === 'select' ? `
                                    <select class="ih-input" data-key="${f.key}">
                                        ${f.options.map(o => `<option value="${o}" ${existing[f.key] === o ? 'selected' : ''}>${o.toUpperCase()}</option>`).join('')}
                                    </select>
                                ` : `
                                    <input class="ih-input" type="${f.type}" data-key="${f.key}" 
                                           placeholder="${this.esc(f.placeholder)}" 
                                           value="${this.esc(existing[f.key] || '')}" 
                                           autocomplete="off" />
                                `}
                            </div>
                        `).join('')}
                    </div>
                    <div class="ih-config-help">
                        <a href="${provider.docUrl}" target="_blank" rel="noopener noreferrer">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                            API Documentation
                        </a>
                        ${providerId === 'entra' ? '<p class="ih-help-text">Requires an Azure AD App Registration with <code>User.Read.All</code>, <code>Policy.Read.All</code>, <code>AuditLog.Read.All</code>, and <code>Reports.Read.All</code> permissions (Application type).</p>' : ''}
                        ${providerId === 'knowbe4' ? '<p class="ih-help-text">Generate an API key from KnowBe4 → Account Settings → API → Reporting API.</p>' : ''}
                        ${providerId === 'tenable' ? '<p class="ih-help-text">Generate API keys from Tenable.io → Settings → My Account → API Keys.</p>' : ''}
                        ${providerId === 'jira' ? '<p class="ih-help-text">Generate an API token from <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noopener noreferrer">id.atlassian.com</a>.</p>' : ''}
                    </div>
                    <div class="ih-test-result" id="ih-test-result-${providerId}"></div>
                </div>
                <div class="ih-config-footer">
                    <button class="ih-btn ih-btn-ghost ih-config-cancel">Cancel</button>
                    <button class="ih-btn ih-btn-secondary ih-test-connection-btn" data-provider="${providerId}">Test Connection</button>
                    <button class="ih-btn ih-btn-primary ih-connect-btn" data-provider="${providerId}">Connect & Sync</button>
                </div>
            </div>
        `;

        (parentModal || document.body).appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('active'));

        // Events
        overlay.querySelector('.ih-config-close').addEventListener('click', () => overlay.remove());
        overlay.querySelector('.ih-config-cancel').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

        overlay.querySelector('.ih-test-connection-btn').addEventListener('click', async () => {
            const creds = this.collectCredentials(overlay, providerId);
            if (!creds) return;
            this.setCredentials(providerId, creds);
            const resultEl = overlay.querySelector(`#ih-test-result-${providerId}`);
            resultEl.innerHTML = '<span class="ih-testing">Testing connection...</span>';
            const result = await this.testConnection(providerId);
            if (result.success) {
                resultEl.innerHTML = `<span class="ih-test-success">&#10003; ${this.esc(result.message)}</span>`;
            } else {
                resultEl.innerHTML = `<span class="ih-test-error">&#10007; ${this.esc(result.message)}</span>`;
            }
        });

        overlay.querySelector('.ih-connect-btn').addEventListener('click', async () => {
            const creds = this.collectCredentials(overlay, providerId);
            if (!creds) return;
            this.setCredentials(providerId, creds);
            const resultEl = overlay.querySelector(`#ih-test-result-${providerId}`);
            resultEl.innerHTML = '<span class="ih-testing">Connecting and syncing data...</span>';
            const result = await this.testConnection(providerId);
            if (result.success) {
                this.connectionStatus[providerId] = 'connected';
                overlay.remove();
                this.showToast(`Connected to ${provider.name}!`, 'success');
                await this.syncProvider(providerId, parentModal);
                if (parentModal) this.refreshHub(parentModal);
            } else {
                resultEl.innerHTML = `<span class="ih-test-error">&#10007; ${this.esc(result.message)}</span>`;
            }
        });
    },

    collectCredentials(overlay, providerId) {
        const creds = {};
        let valid = true;
        overlay.querySelectorAll('.ih-input').forEach(input => {
            const key = input.dataset.key;
            const val = input.value.trim();
            if (!val && this.providers[providerId].requiredCredentials.includes(key)) {
                input.style.borderColor = '#ef4444';
                valid = false;
            } else {
                input.style.borderColor = '';
            }
            creds[key] = val;
        });
        if (!valid) this.showToast('Please fill in all required fields', 'error');
        return valid ? creds : null;
    },

    // =========================================
    // CONNECTION TESTING
    // =========================================
    async testConnection(providerId) {
        try {
            switch (providerId) {
                case 'entra': return await this.testEntraConnection();
                case 'knowbe4': return await this.testKnowBe4Connection();
                case 'tenable': return await this.testTenableConnection();
                case 'jira': return await this.testJiraConnection();
                default: return { success: false, message: 'Unknown provider' };
            }
        } catch (e) {
            return { success: false, message: e.message || 'Connection failed' };
        }
    },

    // =========================================
    // SYNC PROVIDER DATA
    // =========================================
    async syncProvider(providerId, parentModal) {
        try {
            this.showToast(`Syncing ${this.providers[providerId].name}...`, 'info');
            switch (providerId) {
                case 'entra': await this.syncEntra(); break;
                case 'knowbe4': await this.syncKnowBe4(); break;
                case 'tenable': await this.syncTenable(); break;
                case 'jira': await this.syncJira(); break;
            }
            this.showToast(`${this.providers[providerId].name} sync complete!`, 'success');
            if (parentModal) this.refreshHub(parentModal);
        } catch (e) {
            this.showToast(`Sync failed: ${e.message}`, 'error');
        }
    },

    // =========================================
    // MICROSOFT ENTRA ID (Graph API)
    // =========================================
    async getEntraToken() {
        const creds = this.getCredentials('entra');
        if (!creds) throw new Error('Entra credentials not configured');

        const tokenUrl = `${this.providers.entra.authUrl}/${creds.tenantId}/oauth2/v2.0/token`;
        const body = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: creds.clientId,
            client_secret: creds.clientSecret,
            scope: 'https://graph.microsoft.com/.default'
        });

        const resp = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString()
        });

        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.error_description || `Auth failed (${resp.status})`);
        }
        const data = await resp.json();
        return data.access_token;
    },

    async entraGraphGet(path, token) {
        const resp = await fetch(`${this.providers.entra.baseUrl}${path}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.error?.message || `Graph API error (${resp.status})`);
        }
        return resp.json();
    },

    async testEntraConnection() {
        const token = await this.getEntraToken();
        const org = await this.entraGraphGet('/organization', token);
        const orgName = org.value?.[0]?.displayName || 'Unknown';
        return { success: true, message: `Connected to ${orgName}` };
    },

    async syncEntra() {
        const token = await this.getEntraToken();

        // 1. Organization info
        const org = await this.entraGraphGet('/organization', token);

        // 2. Users with MFA registration details
        let users = [];
        try {
            const usersResp = await this.entraGraphGet('/users?$select=id,displayName,userPrincipalName,accountEnabled,createdDateTime,signInActivity&$top=999', token);
            users = usersResp.value || [];
        } catch (e) {
            console.warn('[Entra] Users fetch limited:', e.message);
            const usersResp = await this.entraGraphGet('/users?$select=id,displayName,userPrincipalName,accountEnabled&$top=999', token);
            users = usersResp.value || [];
        }

        // 3. MFA registration details
        let mfaDetails = [];
        try {
            const mfaResp = await this.entraGraphGet('/reports/authenticationMethods/userRegistrationDetails?$top=999', token);
            mfaDetails = mfaResp.value || [];
        } catch (e) {
            console.warn('[Entra] MFA details not available:', e.message);
        }

        // 4. Conditional Access policies
        let conditionalAccess = [];
        try {
            const caResp = await this.entraGraphGet('/identity/conditionalAccess/policies', token);
            conditionalAccess = caResp.value || [];
        } catch (e) {
            console.warn('[Entra] Conditional Access not available:', e.message);
        }

        // 5. Sign-in summary (recent failures)
        let signInSummary = { totalSignIns: 0, failedSignIns: 0 };
        try {
            const signIns = await this.entraGraphGet('/auditLogs/signIns?$top=100&$orderby=createdDateTime desc', token);
            const entries = signIns.value || [];
            signInSummary.totalSignIns = entries.length;
            signInSummary.failedSignIns = entries.filter(s => s.status?.errorCode !== 0).length;
        } catch (e) {
            console.warn('[Entra] Sign-in logs not available:', e.message);
        }

        // Build MFA map
        const mfaMap = {};
        mfaDetails.forEach(d => {
            mfaMap[d.userPrincipalName] = {
                isMfaRegistered: d.isMfaRegistered,
                isMfaCapable: d.isMfaCapable,
                isPasswordlessCapable: d.isPasswordlessCapable,
                methodsRegistered: d.methodsRegistered || [],
                defaultMethod: d.defaultMfaMethod || 'none'
            };
        });

        // Merge user data with MFA
        const enrichedUsers = users.map(u => ({
            id: u.id,
            displayName: u.displayName,
            upn: u.userPrincipalName,
            enabled: u.accountEnabled,
            created: u.createdDateTime,
            lastSignIn: u.signInActivity?.lastSignInDateTime || null,
            mfa: mfaMap[u.userPrincipalName] || { isMfaRegistered: false, isMfaCapable: false, methodsRegistered: [], defaultMethod: 'none' }
        }));

        // Compute stats
        const enabledUsers = enrichedUsers.filter(u => u.enabled);
        const mfaRegistered = enabledUsers.filter(u => u.mfa.isMfaRegistered).length;
        const mfaRate = enabledUsers.length > 0 ? Math.round((mfaRegistered / enabledUsers.length) * 100) : 0;
        const activePolicies = conditionalAccess.filter(p => p.state === 'enabled').length;

        this.data.entra = {
            lastSync: new Date().toISOString(),
            orgName: org.value?.[0]?.displayName || 'Unknown',
            tenantId: org.value?.[0]?.id || '',
            users: enrichedUsers,
            conditionalAccess: conditionalAccess.map(p => ({
                id: p.id,
                displayName: p.displayName,
                state: p.state,
                createdDateTime: p.createdDateTime,
                conditions: p.conditions,
                grantControls: p.grantControls
            })),
            signInSummary,
            stats: {
                totalUsers: enrichedUsers.length,
                enabledUsers: enabledUsers.length,
                mfaRegistered,
                mfaRate,
                activePolicies,
                totalPolicies: conditionalAccess.length
            }
        };
        this.saveData();
    },

    // =========================================
    // KNOWBE4 API
    // =========================================
    async knowbe4Get(path) {
        const creds = this.getCredentials('knowbe4');
        if (!creds) throw new Error('KnowBe4 credentials not configured');
        const region = creds.region || 'us';
        const baseUrl = `https://${region}.api.knowbe4.com/v1`;
        const resp = await fetch(`${baseUrl}${path}`, {
            headers: { 'Authorization': `Bearer ${creds.apiKey}`, 'Content-Type': 'application/json' }
        });
        if (!resp.ok) {
            throw new Error(`KnowBe4 API error (${resp.status}): ${resp.statusText}`);
        }
        return resp.json();
    },

    async testKnowBe4Connection() {
        const account = await this.knowbe4Get('/account');
        return { success: true, message: `Connected to ${account.name || 'KnowBe4 account'}` };
    },

    async syncKnowBe4() {
        // 1. Account info
        const account = await this.knowbe4Get('/account');

        // 2. Training campaigns
        let campaigns = [];
        try {
            campaigns = await this.knowbe4Get('/training/campaigns');
        } catch (e) {
            console.warn('[KnowBe4] Campaigns not available:', e.message);
        }

        // 3. Training enrollments (recent)
        let enrollments = [];
        try {
            enrollments = await this.knowbe4Get('/training/enrollments?per_page=500');
        } catch (e) {
            console.warn('[KnowBe4] Enrollments not available:', e.message);
        }

        // 4. Phishing campaigns
        let phishingCampaigns = [];
        try {
            phishingCampaigns = await this.knowbe4Get('/phishing/campaigns');
        } catch (e) {
            console.warn('[KnowBe4] Phishing campaigns not available:', e.message);
        }

        // 5. Phishing security tests (results)
        let phishingTests = [];
        try {
            phishingTests = await this.knowbe4Get('/phishing/security_tests?per_page=100');
        } catch (e) {
            console.warn('[KnowBe4] Phishing tests not available:', e.message);
        }

        // 6. User risk scores
        let users = [];
        try {
            users = await this.knowbe4Get('/users?per_page=500');
        } catch (e) {
            console.warn('[KnowBe4] Users not available:', e.message);
        }

        // Compute stats
        const completedEnrollments = enrollments.filter(e => e.status === 'Passed' || e.status === 'Completed');
        const completionRate = enrollments.length > 0 ? Math.round((completedEnrollments.length / enrollments.length) * 100) : 0;

        const recentPhishing = phishingTests.slice(0, 10);
        const avgPhishProne = recentPhishing.length > 0
            ? Math.round(recentPhishing.reduce((sum, t) => sum + (t.pst_count > 0 ? ((t.clicked_count || 0) / t.pst_count) * 100 : 0), 0) / recentPhishing.length)
            : null;

        const highRiskUsers = users.filter(u => (u.current_risk_score || 0) > 60).length;

        this.data.knowbe4 = {
            lastSync: new Date().toISOString(),
            accountName: account.name || 'Unknown',
            accountType: account.type || '',
            stats: {
                totalUsers: users.length,
                highRiskUsers,
                trainingCampaigns: campaigns.length,
                totalEnrollments: enrollments.length,
                completedEnrollments: completedEnrollments.length,
                completionRate,
                phishingCampaigns: phishingCampaigns.length,
                phishingTests: phishingTests.length,
                avgPhishPronePercent: avgPhishProne
            },
            campaigns: campaigns.slice(0, 20).map(c => ({
                id: c.campaign_id,
                name: c.name,
                status: c.status,
                startDate: c.start_date,
                endDate: c.end_date,
                completionPercentage: c.completion_percentage
            })),
            recentPhishing: recentPhishing.map(t => ({
                id: t.pst_id,
                name: t.name,
                status: t.status,
                startedAt: t.started_at,
                userCount: t.pst_count,
                clickedCount: t.clicked_count,
                reportedCount: t.reported_count,
                phishPronePercent: t.pst_count > 0 ? Math.round(((t.clicked_count || 0) / t.pst_count) * 100) : 0
            })),
            topRiskUsers: users.sort((a, b) => (b.current_risk_score || 0) - (a.current_risk_score || 0)).slice(0, 10).map(u => ({
                name: u.first_name + ' ' + u.last_name,
                email: u.email,
                riskScore: u.current_risk_score,
                phishPronePercent: u.phish_prone_percentage
            }))
        };
        this.saveData();
    },

    // =========================================
    // TENABLE.IO API
    // =========================================
    async tenableGet(path) {
        const creds = this.getCredentials('tenable');
        if (!creds) throw new Error('Tenable credentials not configured');
        const resp = await fetch(`${this.providers.tenable.baseUrl}${path}`, {
            headers: {
                'X-ApiKeys': `accessKey=${creds.accessKey};secretKey=${creds.secretKey}`,
                'Accept': 'application/json'
            }
        });
        if (!resp.ok) {
            throw new Error(`Tenable API error (${resp.status}): ${resp.statusText}`);
        }
        return resp.json();
    },

    async testTenableConnection() {
        const server = await this.tenableGet('/server/status');
        return { success: true, message: `Connected to Tenable.io (status: ${server.status || 'OK'})` };
    },

    async syncTenable() {
        // 1. Vulnerability counts by severity
        let vulnCounts = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
        try {
            const counts = await this.tenableGet('/workbenches/vulnerabilities?date_range=30&filter.0.filter=severity&filter.0.quality=eq&filter.0.value=Critical');
            vulnCounts.critical = counts.total_vulnerability_count || 0;
        } catch (e) { console.warn('[Tenable] Critical count error:', e.message); }

        try {
            const counts = await this.tenableGet('/workbenches/vulnerabilities?date_range=30&filter.0.filter=severity&filter.0.quality=eq&filter.0.value=High');
            vulnCounts.high = counts.total_vulnerability_count || 0;
        } catch (e) { console.warn('[Tenable] High count error:', e.message); }

        // 2. Scan list
        let scans = [];
        try {
            const scanResp = await this.tenableGet('/scans');
            scans = (scanResp.scans || []).slice(0, 20).map(s => ({
                id: s.id,
                name: s.name,
                status: s.status,
                lastModified: s.last_modification_date ? new Date(s.last_modification_date * 1000).toISOString() : null,
                startTime: s.starttime,
                hostCount: s.hostcount || 0
            }));
        } catch (e) {
            console.warn('[Tenable] Scans not available:', e.message);
        }

        // 3. Asset count
        let assetCount = 0;
        try {
            const assets = await this.tenableGet('/assets');
            assetCount = assets.total || (assets.assets || []).length;
        } catch (e) {
            console.warn('[Tenable] Assets not available:', e.message);
        }

        // 4. Compliance summary (if available)
        let complianceSummary = null;
        try {
            const compliance = await this.tenableGet('/compliance/export/status');
            complianceSummary = compliance;
        } catch (e) {
            // Compliance endpoint may not be available on all tiers
        }

        this.data.tenable = {
            lastSync: new Date().toISOString(),
            stats: {
                totalAssets: assetCount,
                vulnerabilities: vulnCounts,
                totalVulns: vulnCounts.critical + vulnCounts.high + vulnCounts.medium + vulnCounts.low,
                scanCount: scans.length
            },
            scans,
            complianceSummary
        };
        this.saveData();
    },

    // =========================================
    // JIRA API
    // =========================================
    async jiraGet(path) {
        const creds = this.getCredentials('jira');
        if (!creds) throw new Error('Jira credentials not configured');
        const baseUrl = `https://${creds.domain}.atlassian.net/rest/api/3`;
        const auth = btoa(`${creds.email}:${creds.apiToken}`);
        const resp = await fetch(`${baseUrl}${path}`, {
            headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' }
        });
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.errorMessages?.[0] || `Jira API error (${resp.status})`);
        }
        return resp.json();
    },

    async jiraPost(path, body) {
        const creds = this.getCredentials('jira');
        if (!creds) throw new Error('Jira credentials not configured');
        const baseUrl = `https://${creds.domain}.atlassian.net/rest/api/3`;
        const auth = btoa(`${creds.email}:${creds.apiToken}`);
        const resp = await fetch(`${baseUrl}${path}`, {
            method: 'POST',
            headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.errorMessages?.[0] || `Jira API error (${resp.status})`);
        }
        return resp.json();
    },

    async testJiraConnection() {
        const myself = await this.jiraGet('/myself');
        return { success: true, message: `Connected as ${myself.displayName || myself.emailAddress}` };
    },

    async syncJira() {
        // 1. Get projects
        let projects = [];
        try {
            const projResp = await this.jiraGet('/project/search?maxResults=50');
            projects = (projResp.values || []).map(p => ({
                id: p.id,
                key: p.key,
                name: p.name,
                projectTypeKey: p.projectTypeKey
            }));
        } catch (e) {
            console.warn('[Jira] Projects not available:', e.message);
        }

        // 2. Search for POA&M-related issues (look for common labels/components)
        let poamIssues = [];
        try {
            const jql = encodeURIComponent('labels in (POAM, "POA&M", poam, remediation, CMMC, "security-finding") ORDER BY updated DESC');
            const searchResp = await this.jiraGet(`/search?jql=${jql}&maxResults=100&fields=key,summary,status,priority,assignee,created,updated,duedate,labels`);
            poamIssues = (searchResp.issues || []).map(i => ({
                key: i.key,
                summary: i.fields.summary,
                status: i.fields.status?.name,
                statusCategory: i.fields.status?.statusCategory?.key,
                priority: i.fields.priority?.name,
                assignee: i.fields.assignee?.displayName || 'Unassigned',
                created: i.fields.created,
                updated: i.fields.updated,
                dueDate: i.fields.duedate,
                labels: i.fields.labels || []
            }));
        } catch (e) {
            console.warn('[Jira] POA&M search error:', e.message);
        }

        // 3. Status summary
        const statusCounts = {};
        poamIssues.forEach(i => {
            statusCounts[i.status] = (statusCounts[i.status] || 0) + 1;
        });

        const overdue = poamIssues.filter(i => i.dueDate && new Date(i.dueDate) < new Date() && i.statusCategory !== 'done').length;

        this.data.jira = {
            lastSync: new Date().toISOString(),
            domain: this.getCredentials('jira')?.domain || '',
            stats: {
                projectCount: projects.length,
                poamIssueCount: poamIssues.length,
                overdueCount: overdue,
                statusBreakdown: statusCounts
            },
            projects,
            poamIssues
        };
        this.saveData();
    },

    // =========================================
    // JIRA — CREATE TICKET FROM POA&M
    // =========================================
    async createJiraTicketFromPoam(poamItem, projectKey) {
        if (!this.hasCredentials('jira')) {
            this.showToast('Jira not connected. Configure in Integrations Hub.', 'error');
            return null;
        }

        const body = {
            fields: {
                project: { key: projectKey },
                summary: `[POA&M] ${poamItem.controlId || ''} — ${poamItem.weakness || 'Remediation Required'}`,
                description: {
                    type: 'doc',
                    version: 1,
                    content: [
                        { type: 'paragraph', content: [{ type: 'text', text: `Control: ${poamItem.controlId || 'N/A'}` }] },
                        { type: 'paragraph', content: [{ type: 'text', text: `Weakness: ${poamItem.weakness || 'N/A'}` }] },
                        { type: 'paragraph', content: [{ type: 'text', text: `Remediation Plan: ${poamItem.remediation || 'N/A'}` }] },
                        { type: 'paragraph', content: [{ type: 'text', text: `Risk Level: ${poamItem.risk || 'N/A'}` }] },
                        { type: 'paragraph', content: [{ type: 'text', text: `Scheduled Completion: ${poamItem.scheduledDate || 'Not set'}` }] }
                    ]
                },
                issuetype: { name: 'Task' },
                labels: ['POAM', 'CMMC', 'remediation'],
                ...(poamItem.scheduledDate ? { duedate: poamItem.scheduledDate } : {})
            }
        };

        try {
            const result = await this.jiraPost('/issue', body);
            this.showToast(`Jira ticket ${result.key} created!`, 'success');
            return result;
        } catch (e) {
            this.showToast(`Failed to create Jira ticket: ${e.message}`, 'error');
            return null;
        }
    },

    // =========================================
    // OSCAL IMPORT / EXPORT
    // =========================================
    showOscalImportModal(parentModal) {
        const overlay = document.createElement('div');
        overlay.className = 'ih-config-overlay';
        overlay.innerHTML = `
            <div class="ih-config-modal">
                <div class="ih-config-header">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="color:#6366f1">${this.getProviderIcon('oscal')}</span>
                        <h3>Import OSCAL Data</h3>
                    </div>
                    <button class="ih-config-close">&times;</button>
                </div>
                <div class="ih-config-body">
                    <p class="ih-config-desc">Import assessment results, SSP, or POA&M data in NIST OSCAL JSON format. Supported models: Assessment Results, System Security Plan, Plan of Action and Milestones.</p>
                    <div class="ih-oscal-upload-area" id="ih-oscal-upload-area">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        <p>Drop an OSCAL JSON file here or click to browse</p>
                        <span class="ih-upload-hint">Supports .json files (Assessment Results, SSP, POA&M)</span>
                        <input type="file" id="ih-oscal-file-input" accept=".json" style="display:none" />
                    </div>
                    <div id="ih-oscal-import-preview" class="ih-oscal-preview" style="display:none;"></div>
                    <div id="ih-oscal-import-result" class="ih-test-result"></div>
                </div>
                <div class="ih-config-footer">
                    <button class="ih-btn ih-btn-ghost ih-config-cancel">Cancel</button>
                    <button class="ih-btn ih-btn-primary ih-oscal-apply-btn" style="display:none;">Apply Import</button>
                </div>
            </div>
        `;

        (parentModal || document.body).appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('active'));

        const uploadArea = overlay.querySelector('#ih-oscal-upload-area');
        const fileInput = overlay.querySelector('#ih-oscal-file-input');
        let parsedData = null;

        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('ih-drag-over'); });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('ih-drag-over'));
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('ih-drag-over');
            if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
        });
        fileInput.addEventListener('change', () => { if (fileInput.files.length) handleFile(fileInput.files[0]); });

        const handleFile = async (file) => {
            const resultEl = overlay.querySelector('#ih-oscal-import-result');
            const previewEl = overlay.querySelector('#ih-oscal-import-preview');
            const applyBtn = overlay.querySelector('.ih-oscal-apply-btn');

            try {
                const text = await file.text();
                const json = JSON.parse(text);
                parsedData = this.parseOscalData(json);

                if (!parsedData) {
                    resultEl.innerHTML = '<span class="ih-test-error">&#10007; Unrecognized OSCAL format. Expected assessment-results, system-security-plan, or plan-of-action-and-milestones.</span>';
                    return;
                }

                previewEl.style.display = 'block';
                previewEl.innerHTML = this.renderOscalPreview(parsedData);
                applyBtn.style.display = 'inline-flex';
                resultEl.innerHTML = `<span class="ih-test-success">&#10003; Parsed ${parsedData.type} — ${parsedData.summary}</span>`;
            } catch (e) {
                resultEl.innerHTML = `<span class="ih-test-error">&#10007; Parse error: ${this.esc(e.message)}</span>`;
            }
        };

        overlay.querySelector('.ih-oscal-apply-btn').addEventListener('click', () => {
            if (parsedData) {
                this.applyOscalImport(parsedData);
                overlay.remove();
                this.showToast('OSCAL data imported successfully!', 'success');
                if (parentModal) this.refreshHub(parentModal);
            }
        });

        overlay.querySelector('.ih-config-close').addEventListener('click', () => overlay.remove());
        overlay.querySelector('.ih-config-cancel').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    },

    parseOscalData(json) {
        // Assessment Results
        if (json['assessment-results']) {
            const ar = json['assessment-results'];
            const results = ar.results || [];
            let findings = [];
            results.forEach(r => {
                (r.findings || []).forEach(f => {
                    findings.push({
                        uuid: f.uuid,
                        title: f.title,
                        description: f.description,
                        state: f.target?.status?.state || 'unknown',
                        controlId: f.target?.['target-id'] || '',
                        implementationStatus: f.target?.status?.state || ''
                    });
                });
            });
            return {
                type: 'assessment-results',
                title: ar.metadata?.title || 'Assessment Results',
                lastModified: ar.metadata?.['last-modified'] || '',
                summary: `${findings.length} findings from ${results.length} result(s)`,
                findings,
                raw: ar
            };
        }

        // System Security Plan
        if (json['system-security-plan']) {
            const ssp = json['system-security-plan'];
            const controls = ssp['control-implementation']?.['implemented-requirements'] || [];
            return {
                type: 'system-security-plan',
                title: ssp.metadata?.title || 'System Security Plan',
                lastModified: ssp.metadata?.['last-modified'] || '',
                summary: `${controls.length} implemented requirements`,
                controls: controls.map(c => ({
                    controlId: c['control-id'],
                    uuid: c.uuid,
                    description: (c.statements || []).map(s => s.description || '').join(' ')
                })),
                systemName: ssp['system-characteristics']?.['system-name'] || '',
                raw: ssp
            };
        }

        // Plan of Action and Milestones
        if (json['plan-of-action-and-milestones']) {
            const poam = json['plan-of-action-and-milestones'];
            const items = poam['poam-items'] || [];
            return {
                type: 'plan-of-action-and-milestones',
                title: poam.metadata?.title || 'POA&M',
                lastModified: poam.metadata?.['last-modified'] || '',
                summary: `${items.length} POA&M items`,
                items: items.map(i => ({
                    uuid: i.uuid,
                    title: i.title,
                    description: i.description,
                    relatedFindings: (i['related-findings'] || []).map(f => f['finding-uuid']),
                    relatedObservations: (i['related-observations'] || []).map(o => o['observation-uuid'])
                })),
                raw: poam
            };
        }

        return null;
    },

    renderOscalPreview(data) {
        let content = `<h4>${this.esc(data.title)}</h4><p>Type: <strong>${data.type}</strong> | ${data.summary}</p>`;

        if (data.type === 'assessment-results' && data.findings.length > 0) {
            const satisfied = data.findings.filter(f => f.state === 'satisfied').length;
            const notSatisfied = data.findings.filter(f => f.state === 'not-satisfied').length;
            content += `<div class="ih-oscal-stats">
                <span class="ih-oscal-stat ih-stat-green">${satisfied} Satisfied</span>
                <span class="ih-oscal-stat ih-stat-red">${notSatisfied} Not Satisfied</span>
                <span class="ih-oscal-stat">${data.findings.length - satisfied - notSatisfied} Other</span>
            </div>`;
            content += `<div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th>Control</th><th>Title</th><th>State</th></tr></thead><tbody>`;
            data.findings.slice(0, 20).forEach(f => {
                content += `<tr><td><code>${this.esc(f.controlId)}</code></td><td>${this.esc(f.title)}</td><td>${this.esc(f.state)}</td></tr>`;
            });
            if (data.findings.length > 20) content += `<tr><td colspan="3" style="text-align:center;color:var(--text-muted)">... and ${data.findings.length - 20} more</td></tr>`;
            content += `</tbody></table></div>`;
        }

        if (data.type === 'system-security-plan' && data.controls.length > 0) {
            content += `<p>System: <strong>${this.esc(data.systemName)}</strong></p>`;
            content += `<div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th>Control ID</th><th>Description (excerpt)</th></tr></thead><tbody>`;
            data.controls.slice(0, 15).forEach(c => {
                content += `<tr><td><code>${this.esc(c.controlId)}</code></td><td>${this.esc((c.description || '').substring(0, 120))}${(c.description || '').length > 120 ? '...' : ''}</td></tr>`;
            });
            content += `</tbody></table></div>`;
        }

        if (data.type === 'plan-of-action-and-milestones' && data.items.length > 0) {
            content += `<div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th>Title</th><th>Description (excerpt)</th></tr></thead><tbody>`;
            data.items.slice(0, 15).forEach(i => {
                content += `<tr><td>${this.esc(i.title)}</td><td>${this.esc((i.description || '').substring(0, 120))}${(i.description || '').length > 120 ? '...' : ''}</td></tr>`;
            });
            content += `</tbody></table></div>`;
        }

        return content;
    },

    applyOscalImport(data) {
        if (data.type === 'assessment-results') {
            // Map OSCAL findings to assessment objective statuses
            const assessmentData = JSON.parse(localStorage.getItem('nist-assessment-data') || '{}');
            let mapped = 0;
            data.findings.forEach(f => {
                if (f.controlId) {
                    // Try to find matching objective
                    const statusMap = { 'satisfied': 'met', 'not-satisfied': 'not-met' };
                    const status = statusMap[f.state];
                    if (status) {
                        // OSCAL control IDs may need mapping — store as-is for now
                        assessmentData[f.controlId] = assessmentData[f.controlId] || {};
                        assessmentData[f.controlId].status = status;
                        assessmentData[f.controlId].oscalImported = true;
                        mapped++;
                    }
                }
            });
            localStorage.setItem('nist-assessment-data', JSON.stringify(assessmentData));
            this.showToast(`Mapped ${mapped} assessment findings`, 'success');
        }

        // Store raw OSCAL data for reference
        this.data.oscal = this.data.oscal || {};
        this.data.oscal.lastImport = {
            type: data.type,
            title: data.title,
            date: new Date().toISOString(),
            summary: data.summary
        };
        this.saveData();
    },

    showOscalExportModal(parentModal) {
        const overlay = document.createElement('div');
        overlay.className = 'ih-config-overlay';
        overlay.innerHTML = `
            <div class="ih-config-modal">
                <div class="ih-config-header">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="color:#6366f1">${this.getProviderIcon('oscal')}</span>
                        <h3>Export OSCAL Data</h3>
                    </div>
                    <button class="ih-config-close">&times;</button>
                </div>
                <div class="ih-config-body">
                    <p class="ih-config-desc">Export your assessment data in NIST OSCAL JSON format for interoperability with other GRC tools and government systems.</p>
                    <div class="ih-export-options">
                        <button class="ih-btn ih-btn-primary ih-export-ar-btn" style="width:100%;margin-bottom:8px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                            Export Assessment Results
                        </button>
                        <button class="ih-btn ih-btn-secondary ih-export-poam-btn" style="width:100%;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            Export POA&M
                        </button>
                    </div>
                </div>
                <div class="ih-config-footer">
                    <button class="ih-btn ih-btn-ghost ih-config-cancel">Close</button>
                </div>
            </div>
        `;

        (parentModal || document.body).appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('active'));

        overlay.querySelector('.ih-export-ar-btn').addEventListener('click', () => {
            this.exportOscalAssessmentResults();
            overlay.remove();
        });

        overlay.querySelector('.ih-export-poam-btn').addEventListener('click', () => {
            this.exportOscalPoam();
            overlay.remove();
        });

        overlay.querySelector('.ih-config-close').addEventListener('click', () => overlay.remove());
        overlay.querySelector('.ih-config-cancel').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    },

    exportOscalAssessmentResults() {
        const assessmentData = JSON.parse(localStorage.getItem('nist-assessment-data') || '{}');
        const orgData = JSON.parse(localStorage.getItem('nist-org-data') || '{}');
        const uuid = crypto.randomUUID ? crypto.randomUUID() : 'ar-' + Date.now();

        const findings = [];
        Object.entries(assessmentData).forEach(([objId, data]) => {
            if (data.status && data.status !== 'not-assessed') {
                const stateMap = { 'met': 'satisfied', 'not-met': 'not-satisfied', 'na': 'not-applicable' };
                findings.push({
                    uuid: crypto.randomUUID ? crypto.randomUUID() : 'f-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
                    title: `Finding for ${objId}`,
                    description: `Assessment finding for objective ${objId}`,
                    target: {
                        type: 'objective-id',
                        'target-id': objId,
                        status: {
                            state: stateMap[data.status] || 'other'
                        }
                    }
                });
            }
        });

        const oscal = {
            'assessment-results': {
                uuid: uuid,
                metadata: {
                    title: `CMMC Assessment Results — ${orgData.oscName || 'Organization'}`,
                    'last-modified': new Date().toISOString(),
                    version: '1.0.0',
                    'oscal-version': '1.1.2'
                },
                results: [{
                    uuid: crypto.randomUUID ? crypto.randomUUID() : 'r-' + Date.now(),
                    title: 'CMMC Level 2 Assessment',
                    description: 'Assessment results exported from CMMC Assessment Tool',
                    start: new Date().toISOString(),
                    findings: findings
                }]
            }
        };

        this.downloadJson(oscal, `oscal-assessment-results-${new Date().toISOString().split('T')[0]}.json`);
        this.showToast(`Exported ${findings.length} findings as OSCAL Assessment Results`, 'success');
    },

    exportOscalPoam() {
        const poamData = JSON.parse(localStorage.getItem('nist-poam-data') || '{}');
        const orgData = JSON.parse(localStorage.getItem('nist-org-data') || '{}');
        const uuid = crypto.randomUUID ? crypto.randomUUID() : 'poam-' + Date.now();

        const items = [];
        Object.entries(poamData).forEach(([objId, data]) => {
            if (data.weakness || data.remediation) {
                items.push({
                    uuid: crypto.randomUUID ? crypto.randomUUID() : 'pi-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
                    title: `POA&M: ${objId} — ${data.weakness || 'Remediation Required'}`,
                    description: data.remediation || data.weakness || ''
                });
            }
        });

        const oscal = {
            'plan-of-action-and-milestones': {
                uuid: uuid,
                metadata: {
                    title: `POA&M — ${orgData.oscName || 'Organization'}`,
                    'last-modified': new Date().toISOString(),
                    version: '1.0.0',
                    'oscal-version': '1.1.2'
                },
                'poam-items': items
            }
        };

        this.downloadJson(oscal, `oscal-poam-${new Date().toISOString().split('T')[0]}.json`);
        this.showToast(`Exported ${items.length} POA&M items as OSCAL`, 'success');
    },

    downloadJson(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // =========================================
    // DATA VIEW (per provider)
    // =========================================
    showDataView(providerId, parentModal) {
        const provider = this.providers[providerId];
        const data = this.data[providerId];
        if (!data) {
            this.showToast('No data available. Sync first.', 'info');
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'ih-config-overlay';
        overlay.innerHTML = `
            <div class="ih-config-modal ih-data-modal">
                <div class="ih-config-header">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="color:${this.getCategoryColor(provider.category)}">${this.getProviderIcon(providerId)}</span>
                        <h3>${this.esc(provider.name)} — Synced Data</h3>
                    </div>
                    <button class="ih-config-close">&times;</button>
                </div>
                <div class="ih-config-body ih-data-body">
                    ${this.renderProviderData(providerId, data)}
                </div>
                <div class="ih-config-footer">
                    <button class="ih-btn ih-btn-ghost ih-config-cancel">Close</button>
                    <button class="ih-btn ih-btn-secondary ih-copy-data-btn">Copy as JSON</button>
                </div>
            </div>
        `;

        (parentModal || document.body).appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('active'));

        overlay.querySelector('.ih-config-close').addEventListener('click', () => overlay.remove());
        overlay.querySelector('.ih-config-cancel').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

        overlay.querySelector('.ih-copy-data-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
                this.showToast('Data copied to clipboard', 'success');
            });
        });
    },

    renderProviderData(providerId, data) {
        switch (providerId) {
            case 'entra': return this.renderEntraData(data);
            case 'knowbe4': return this.renderKnowBe4Data(data);
            case 'tenable': return this.renderTenableData(data);
            case 'jira': return this.renderJiraData(data);
            default: return '<p>No data renderer available.</p>';
        }
    },

    renderEntraData(data) {
        const s = data.stats || {};
        return `
            <div class="ih-data-header">
                <h4>${this.esc(data.orgName)}</h4>
                <span class="ih-data-sync">Last sync: ${this.formatDateTime(data.lastSync)}</span>
            </div>
            <div class="ih-data-kpi-strip">
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.enabledUsers || 0}</span>
                    <span class="ih-data-kpi-label">Active Users</span>
                </div>
                <div class="ih-data-kpi ${s.mfaRate >= 95 ? 'ih-kpi-green' : s.mfaRate >= 80 ? 'ih-kpi-amber' : 'ih-kpi-red'}">
                    <span class="ih-data-kpi-value">${s.mfaRate || 0}%</span>
                    <span class="ih-data-kpi-label">MFA Enrollment</span>
                </div>
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.activePolicies || 0}</span>
                    <span class="ih-data-kpi-label">Active CA Policies</span>
                </div>
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${data.signInSummary?.failedSignIns || 0}</span>
                    <span class="ih-data-kpi-label">Failed Sign-ins (recent)</span>
                </div>
            </div>
            ${s.mfaRate < 100 ? `<div class="ih-data-alert ih-alert-warn">&#9888; ${s.enabledUsers - s.mfaRegistered} user(s) without MFA registration. This impacts AC and IA control families.</div>` : '<div class="ih-data-alert ih-alert-good">&#10003; All active users have MFA registered.</div>'}
            <h5>Conditional Access Policies</h5>
            <div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th>Policy Name</th><th>State</th><th>Grant Controls</th></tr></thead><tbody>
            ${(data.conditionalAccess || []).map(p => `<tr><td>${this.esc(p.displayName)}</td><td><span class="ih-status-tag ih-status-${p.state === 'enabled' ? 'green' : 'gray'}">${p.state}</span></td><td>${(p.grantControls?.builtInControls || []).join(', ') || '—'}</td></tr>`).join('')}
            ${data.conditionalAccess?.length === 0 ? '<tr><td colspan="3" style="text-align:center;color:var(--text-muted)">No conditional access policies found</td></tr>' : ''}
            </tbody></table></div>
            <h5>Users Without MFA (top 10)</h5>
            <div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th>User</th><th>UPN</th><th>MFA Methods</th></tr></thead><tbody>
            ${(data.users || []).filter(u => u.enabled && !u.mfa.isMfaRegistered).slice(0, 10).map(u => `<tr><td>${this.esc(u.displayName)}</td><td>${this.esc(u.upn)}</td><td>${u.mfa.methodsRegistered.length > 0 ? u.mfa.methodsRegistered.join(', ') : '<span style="color:#ef4444">None</span>'}</td></tr>`).join('')}
            </tbody></table></div>
        `;
    },

    renderKnowBe4Data(data) {
        const s = data.stats || {};
        return `
            <div class="ih-data-header">
                <h4>${this.esc(data.accountName)}</h4>
                <span class="ih-data-sync">Last sync: ${this.formatDateTime(data.lastSync)}</span>
            </div>
            <div class="ih-data-kpi-strip">
                <div class="ih-data-kpi ${s.completionRate >= 95 ? 'ih-kpi-green' : s.completionRate >= 80 ? 'ih-kpi-amber' : 'ih-kpi-red'}">
                    <span class="ih-data-kpi-value">${s.completionRate || 0}%</span>
                    <span class="ih-data-kpi-label">Training Completion</span>
                </div>
                <div class="ih-data-kpi ${(s.avgPhishPronePercent || 0) <= 5 ? 'ih-kpi-green' : (s.avgPhishPronePercent || 0) <= 15 ? 'ih-kpi-amber' : 'ih-kpi-red'}">
                    <span class="ih-data-kpi-value">${s.avgPhishPronePercent !== null ? s.avgPhishPronePercent + '%' : 'N/A'}</span>
                    <span class="ih-data-kpi-label">Phish-Prone Rate</span>
                </div>
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.totalUsers || 0}</span>
                    <span class="ih-data-kpi-label">Total Users</span>
                </div>
                <div class="ih-data-kpi ${s.highRiskUsers > 0 ? 'ih-kpi-red' : 'ih-kpi-green'}">
                    <span class="ih-data-kpi-value">${s.highRiskUsers || 0}</span>
                    <span class="ih-data-kpi-label">High Risk Users</span>
                </div>
            </div>
            <h5>Training Campaigns</h5>
            <div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th>Campaign</th><th>Status</th><th>Completion</th><th>Dates</th></tr></thead><tbody>
            ${(data.campaigns || []).map(c => `<tr><td>${this.esc(c.name)}</td><td><span class="ih-status-tag ih-status-${c.status === 'Closed' ? 'green' : 'blue'}">${c.status}</span></td><td>${c.completionPercentage || 0}%</td><td>${this.formatDate(c.startDate)} — ${this.formatDate(c.endDate)}</td></tr>`).join('')}
            </tbody></table></div>
            <h5>Recent Phishing Tests</h5>
            <div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th>Test</th><th>Users</th><th>Clicked</th><th>Reported</th><th>Phish-Prone</th></tr></thead><tbody>
            ${(data.recentPhishing || []).map(t => `<tr><td>${this.esc(t.name)}</td><td>${t.userCount}</td><td>${t.clickedCount}</td><td>${t.reportedCount}</td><td><span class="${t.phishPronePercent > 15 ? 'ih-text-red' : t.phishPronePercent > 5 ? 'ih-text-amber' : 'ih-text-green'}">${t.phishPronePercent}%</span></td></tr>`).join('')}
            </tbody></table></div>
        `;
    },

    renderTenableData(data) {
        const s = data.stats || {};
        const v = s.vulnerabilities || {};
        return `
            <div class="ih-data-header">
                <h4>Tenable.io</h4>
                <span class="ih-data-sync">Last sync: ${this.formatDateTime(data.lastSync)}</span>
            </div>
            <div class="ih-data-kpi-strip">
                <div class="ih-data-kpi ih-kpi-red">
                    <span class="ih-data-kpi-value">${v.critical || 0}</span>
                    <span class="ih-data-kpi-label">Critical Vulns</span>
                </div>
                <div class="ih-data-kpi ih-kpi-amber">
                    <span class="ih-data-kpi-value">${v.high || 0}</span>
                    <span class="ih-data-kpi-label">High Vulns</span>
                </div>
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.totalAssets || 0}</span>
                    <span class="ih-data-kpi-label">Assets Scanned</span>
                </div>
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.scanCount || 0}</span>
                    <span class="ih-data-kpi-label">Scans</span>
                </div>
            </div>
            ${v.critical > 0 ? `<div class="ih-data-alert ih-alert-warn">&#9888; ${v.critical} critical vulnerabilities detected. Immediate remediation required for RA.L2-3.11.2 compliance.</div>` : '<div class="ih-data-alert ih-alert-good">&#10003; No critical vulnerabilities detected.</div>'}
            <h5>Recent Scans</h5>
            <div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th>Scan Name</th><th>Status</th><th>Hosts</th><th>Last Run</th></tr></thead><tbody>
            ${(data.scans || []).map(s => `<tr><td>${this.esc(s.name)}</td><td><span class="ih-status-tag ih-status-${s.status === 'completed' ? 'green' : 'blue'}">${s.status}</span></td><td>${s.hostCount}</td><td>${this.formatDateTime(s.lastModified)}</td></tr>`).join('')}
            </tbody></table></div>
        `;
    },

    renderJiraData(data) {
        const s = data.stats || {};
        return `
            <div class="ih-data-header">
                <h4>Jira — ${this.esc(data.domain)}.atlassian.net</h4>
                <span class="ih-data-sync">Last sync: ${this.formatDateTime(data.lastSync)}</span>
            </div>
            <div class="ih-data-kpi-strip">
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.poamIssueCount || 0}</span>
                    <span class="ih-data-kpi-label">POA&M Issues</span>
                </div>
                <div class="ih-data-kpi ${s.overdueCount > 0 ? 'ih-kpi-red' : 'ih-kpi-green'}">
                    <span class="ih-data-kpi-value">${s.overdueCount || 0}</span>
                    <span class="ih-data-kpi-label">Overdue</span>
                </div>
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.projectCount || 0}</span>
                    <span class="ih-data-kpi-label">Projects</span>
                </div>
            </div>
            ${s.overdueCount > 0 ? `<div class="ih-data-alert ih-alert-warn">&#9888; ${s.overdueCount} overdue POA&M issue(s). Review remediation timelines.</div>` : ''}
            <h5>Status Breakdown</h5>
            <div class="ih-status-breakdown">
                ${Object.entries(s.statusBreakdown || {}).map(([status, count]) => `<span class="ih-status-chip">${this.esc(status)}: <strong>${count}</strong></span>`).join('')}
            </div>
            <h5>POA&M Issues</h5>
            <div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th>Key</th><th>Summary</th><th>Status</th><th>Priority</th><th>Assignee</th><th>Due</th></tr></thead><tbody>
            ${(data.poamIssues || []).slice(0, 25).map(i => `<tr>
                <td><a href="https://${this.esc(data.domain)}.atlassian.net/browse/${this.esc(i.key)}" target="_blank" rel="noopener noreferrer"><code>${this.esc(i.key)}</code></a></td>
                <td>${this.esc(i.summary)}</td>
                <td><span class="ih-status-tag ih-status-${i.statusCategory === 'done' ? 'green' : i.statusCategory === 'indeterminate' ? 'blue' : 'gray'}">${this.esc(i.status)}</span></td>
                <td>${this.esc(i.priority)}</td>
                <td>${this.esc(i.assignee)}</td>
                <td>${i.dueDate ? `<span class="${new Date(i.dueDate) < new Date() && i.statusCategory !== 'done' ? 'ih-text-red' : ''}">${this.formatDate(i.dueDate)}</span>` : '—'}</td>
            </tr>`).join('')}
            </tbody></table></div>
        `;
    },

    // =========================================
    // PUBLIC API — for other modules
    // =========================================
    getEntraStats() { return this.data.entra?.stats || null; },
    getKnowBe4Stats() { return this.data.knowbe4?.stats || null; },
    getTenableStats() { return this.data.tenable?.stats || null; },
    getJiraStats() { return this.data.jira?.stats || null; },

    getControlEvidence(controlId) {
        const evidence = [];
        // Entra — MFA and access controls
        if (this.data.entra && this.providers.entra.controls.includes(controlId)) {
            const s = this.data.entra.stats;
            evidence.push({
                source: 'Microsoft Entra ID',
                type: 'automated',
                syncDate: this.data.entra.lastSync,
                data: {
                    mfaRate: s.mfaRate,
                    activePolicies: s.activePolicies,
                    enabledUsers: s.enabledUsers
                },
                summary: `MFA: ${s.mfaRate}% enrolled | ${s.activePolicies} CA policies active | ${s.enabledUsers} users`
            });
        }
        // KnowBe4 — Training
        if (this.data.knowbe4 && this.providers.knowbe4.controls.includes(controlId)) {
            const s = this.data.knowbe4.stats;
            evidence.push({
                source: 'KnowBe4',
                type: 'automated',
                syncDate: this.data.knowbe4.lastSync,
                data: {
                    completionRate: s.completionRate,
                    phishPronePercent: s.avgPhishPronePercent,
                    highRiskUsers: s.highRiskUsers
                },
                summary: `Training: ${s.completionRate}% complete | Phish-prone: ${s.avgPhishPronePercent !== null ? s.avgPhishPronePercent + '%' : 'N/A'} | ${s.highRiskUsers} high-risk users`
            });
        }
        // Tenable — Vulnerability
        if (this.data.tenable && this.providers.tenable.controls.includes(controlId)) {
            const s = this.data.tenable.stats;
            evidence.push({
                source: 'Tenable.io',
                type: 'automated',
                syncDate: this.data.tenable.lastSync,
                data: {
                    criticalVulns: s.vulnerabilities?.critical || 0,
                    highVulns: s.vulnerabilities?.high || 0,
                    totalAssets: s.totalAssets
                },
                summary: `Vulns: ${s.vulnerabilities?.critical || 0} critical, ${s.vulnerabilities?.high || 0} high | ${s.totalAssets} assets scanned`
            });
        }
        return evidence;
    }
};

// Auto-init on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => IntegrationsHub.init());
} else {
    IntegrationsHub.init();
}
