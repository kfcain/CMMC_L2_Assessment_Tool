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
            docUrl: 'https://learn.microsoft.com/en-us/graph/overview',
            environments: {
                commercial: { label: 'Commercial', baseUrl: 'https://graph.microsoft.com/v1.0', authUrl: 'https://login.microsoftonline.com', scope: 'https://graph.microsoft.com/.default' },
                gcc: { label: 'GCC', baseUrl: 'https://graph.microsoft.com/v1.0', authUrl: 'https://login.microsoftonline.com', scope: 'https://graph.microsoft.com/.default' },
                gcchigh: { label: 'GCC High', baseUrl: 'https://graph.microsoft.us/v1.0', authUrl: 'https://login.microsoftonline.us', scope: 'https://graph.microsoft.us/.default' },
                dod: { label: 'DoD', baseUrl: 'https://dod-graph.microsoft.us/v1.0', authUrl: 'https://login.microsoftonline.us', scope: 'https://dod-graph.microsoft.us/.default' }
            }
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
            docUrl: 'https://developer.tenable.com/',
            environments: {
                commercial: { label: 'Commercial', baseUrl: 'https://cloud.tenable.com' },
                fedramp: { label: 'FedRAMP (Gov)', baseUrl: 'https://fedcloud.tenable.com' }
            }
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
        },
        notion: {
            id: 'notion',
            name: 'Notion',
            description: 'Sync meeting notes, documentation pages, and assessment evidence from Notion workspaces',
            icon: 'notion',
            category: 'documentation',
            controls: [],
            requiredCredentials: ['apiKey'],
            baseUrl: 'https://api.notion.com/v1',
            docUrl: 'https://developers.notion.com/'
        },
        m365: {
            id: 'm365',
            name: 'Microsoft 365',
            description: 'Access SharePoint sites, OneDrive files, and Teams channels for policy documents and evidence artifacts',
            icon: 'm365',
            category: 'storage',
            controls: ['3.8.1', '3.8.2', '3.8.3', '3.8.5', '3.8.6', '3.13.8', '3.13.16'],
            requiredCredentials: ['tenantId', 'clientId', 'clientSecret'],
            baseUrl: 'https://graph.microsoft.com/v1.0',
            authUrl: 'https://login.microsoftonline.com',
            docUrl: 'https://learn.microsoft.com/en-us/graph/api/resources/sharepoint',
            environments: {
                commercial: { label: 'Commercial', baseUrl: 'https://graph.microsoft.com/v1.0', authUrl: 'https://login.microsoftonline.com', scope: 'https://graph.microsoft.com/.default' },
                gcc: { label: 'GCC', baseUrl: 'https://graph.microsoft.com/v1.0', authUrl: 'https://login.microsoftonline.com', scope: 'https://graph.microsoft.com/.default' },
                gcchigh: { label: 'GCC High', baseUrl: 'https://graph.microsoft.us/v1.0', authUrl: 'https://login.microsoftonline.us', scope: 'https://graph.microsoft.us/.default' },
                dod: { label: 'DoD', baseUrl: 'https://dod-graph.microsoft.us/v1.0', authUrl: 'https://login.microsoftonline.us', scope: 'https://dod-graph.microsoft.us/.default' }
            }
        },
        gdrive: {
            id: 'gdrive',
            name: 'Google Workspace',
            description: 'Browse Google Drive folders, Shared Drives, and Docs for policies, procedures, and evidence collection',
            icon: 'gdrive',
            category: 'storage',
            controls: ['3.8.1', '3.8.2', '3.8.3', '3.8.5', '3.13.8', '3.13.16'],
            requiredCredentials: ['apiKey'],
            baseUrl: 'https://www.googleapis.com/drive/v3',
            docUrl: 'https://developers.google.com/drive/api/reference/rest/v3'
        },
        s3: {
            id: 's3',
            name: 'AWS S3',
            description: 'Connect to S3 buckets for artifact storage, evidence uploads, and policy document management',
            icon: 's3',
            category: 'storage',
            controls: ['3.8.1', '3.8.6', '3.13.8', '3.13.16'],
            requiredCredentials: ['accessKeyId', 'secretAccessKey', 'region', 'bucket'],
            docUrl: 'https://docs.aws.amazon.com/AmazonS3/latest/API/',
            environments: {
                commercial: { label: 'AWS Commercial', stsEndpoint: 'https://sts.amazonaws.com', partition: 'aws' },
                govcloud: { label: 'AWS GovCloud (US)', stsEndpoint: 'https://sts.us-gov-west-1.amazonaws.com', partition: 'aws-us-gov', defaultRegion: 'us-gov-west-1' }
            }
        },
        defender: {
            id: 'defender',
            name: 'Microsoft Defender',
            description: 'Pull endpoint protection status, threat detections, vulnerability assessments, and device compliance from Defender for Endpoint via Graph Security API',
            icon: 'defender',
            category: 'endpoint',
            controls: ['3.4.1', '3.4.2', '3.4.6', '3.4.7', '3.4.8', '3.4.9', '3.11.1', '3.11.2', '3.11.3', '3.14.1', '3.14.2', '3.14.3', '3.14.4', '3.14.5', '3.14.6', '3.14.7'],
            requiredCredentials: ['tenantId', 'clientId', 'clientSecret'],
            baseUrl: 'https://graph.microsoft.com/v1.0',
            authUrl: 'https://login.microsoftonline.com',
            docUrl: 'https://learn.microsoft.com/en-us/graph/api/resources/security-api-overview',
            environments: {
                commercial: { label: 'Commercial', baseUrl: 'https://graph.microsoft.com/v1.0', authUrl: 'https://login.microsoftonline.com', scope: 'https://graph.microsoft.com/.default', mdeUrl: 'https://api.securitycenter.microsoft.com' },
                gcc: { label: 'GCC', baseUrl: 'https://graph.microsoft.com/v1.0', authUrl: 'https://login.microsoftonline.com', scope: 'https://graph.microsoft.com/.default', mdeUrl: 'https://api-gcc.securitycenter.microsoft.us' },
                gcchigh: { label: 'GCC High', baseUrl: 'https://graph.microsoft.us/v1.0', authUrl: 'https://login.microsoftonline.us', scope: 'https://graph.microsoft.us/.default', mdeUrl: 'https://api-gov.securitycenter.microsoft.us' },
                dod: { label: 'DoD', baseUrl: 'https://dod-graph.microsoft.us/v1.0', authUrl: 'https://login.microsoftonline.us', scope: 'https://dod-graph.microsoft.us/.default', mdeUrl: 'https://api-gov.securitycenter.microsoft.us' }
            }
        },
        sentinelone: {
            id: 'sentinelone',
            name: 'SentinelOne',
            description: 'Import endpoint agent status, threat detections, device inventory, and vulnerability data from SentinelOne management console',
            icon: 'sentinelone',
            category: 'endpoint',
            controls: ['3.4.1', '3.4.2', '3.11.1', '3.11.2', '3.14.1', '3.14.2', '3.14.3', '3.14.4', '3.14.5', '3.14.6', '3.14.7'],
            requiredCredentials: ['apiToken', 'consoleUrl'],
            docUrl: 'https://usea1-partners.sentinelone.net/api-doc/overview',
            environments: {
                commercial: { label: 'Commercial', consolePlaceholder: 'https://usea1-xxx.sentinelone.net' },
                govcloud: { label: 'FedRAMP / GovCloud', consolePlaceholder: 'https://usea1-gov-xxx.sentinelone.net' }
            }
        },
        crowdstrike: {
            id: 'crowdstrike',
            name: 'CrowdStrike Falcon',
            description: 'Pull host inventory, detection events, vulnerability scores, and Zero Trust assessments from CrowdStrike Falcon platform',
            icon: 'crowdstrike',
            category: 'endpoint',
            controls: ['3.4.1', '3.4.2', '3.4.6', '3.11.1', '3.11.2', '3.11.3', '3.14.1', '3.14.2', '3.14.3', '3.14.4', '3.14.5', '3.14.6', '3.14.7'],
            requiredCredentials: ['clientId', 'clientSecret', 'baseUrl'],
            docUrl: 'https://falcon.crowdstrike.com/documentation/',
            environments: {
                commercial: { label: 'Commercial (US-1)', defaultBaseUrl: 'https://api.crowdstrike.com' },
                us2: { label: 'Commercial (US-2)', defaultBaseUrl: 'https://api.us-2.crowdstrike.com' },
                eu1: { label: 'EU Cloud', defaultBaseUrl: 'https://api.eu-1.crowdstrike.com' },
                govcloud: { label: 'GovCloud (US)', defaultBaseUrl: 'https://api.laggar.gcw.crowdstrike.com' }
            }
        },
        qualys: {
            id: 'qualys',
            name: 'Qualys VMDR',
            description: 'Import vulnerability scan results, asset inventory, compliance posture, and patch status from Qualys VMDR platform',
            icon: 'qualys',
            category: 'vulnerability',
            controls: ['3.4.1', '3.4.2', '3.4.8', '3.4.9', '3.11.1', '3.11.2', '3.11.3', '3.14.1', '3.14.2', '3.14.6', '3.14.7'],
            requiredCredentials: ['username', 'password', 'apiUrl'],
            docUrl: 'https://qualysguard.qg2.apps.qualys.com/qwebhelp/fo_portal/api_doc/',
            environments: {
                commercial: { label: 'Commercial (US)', defaultApiUrl: 'https://qualysapi.qualys.com' },
                eu: { label: 'EU Platform', defaultApiUrl: 'https://qualysapi.qg2.apps.qualys.eu' },
                govcloud: { label: 'FedRAMP / GovCloud', defaultApiUrl: 'https://qualysapi.qg1.apps.qualys.com' }
            }
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
    // ENVIRONMENT RESOLUTION
    // =========================================
    getProviderEnv(providerId) {
        const provider = this.providers[providerId];
        if (!provider?.environments) return null;
        const creds = this.getCredentials(providerId);
        const envKey = creds?.environment || 'commercial';
        return provider.environments[envKey] || provider.environments.commercial || Object.values(provider.environments)[0];
    },

    getProviderEnvKey(providerId) {
        const creds = this.getCredentials(providerId);
        return creds?.environment || 'commercial';
    },

    resolveBaseUrl(providerId) {
        const env = this.getProviderEnv(providerId);
        if (env?.baseUrl) return env.baseUrl;
        return this.providers[providerId]?.baseUrl || '';
    },

    resolveAuthUrl(providerId) {
        const env = this.getProviderEnv(providerId);
        if (env?.authUrl) return env.authUrl;
        return this.providers[providerId]?.authUrl || '';
    },

    resolveScope(providerId) {
        const env = this.getProviderEnv(providerId);
        if (env?.scope) return env.scope;
        return 'https://graph.microsoft.com/.default';
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
        // Use VendorLogos registry (actual brand logos) when available
        if (typeof VendorLogos !== 'undefined' && VendorLogos.has(providerId)) {
            return VendorLogos.get(providerId, 20);
        }
        // Fallback for providers not yet in VendorLogos
        const icons = {
            oscal: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/></svg>',
            gdrive: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 19h7l3-5"/><path d="M12 2l10 17h-7l-3-5"/><path d="M5 14h14"/></svg>'
        };
        return icons[providerId] || '';
    },

    getCategoryLabel(cat) {
        return { identity: 'Identity & Access', training: 'Security Training', vulnerability: 'Vulnerability Mgmt', ticketing: 'Ticketing & POA&M', standard: 'Standards & Export', documentation: 'Documentation & Notes', storage: 'File Storage & Evidence', endpoint: 'Endpoint Protection' }[cat] || cat;
    },

    getCategoryColor(cat) {
        return { identity: '#3b82f6', training: '#10b981', vulnerability: '#f59e0b', ticketing: '#8b5cf6', standard: '#6366f1', documentation: '#ec4899', storage: '#14b8a6', endpoint: '#ef4444' }[cat] || '#6b7280';
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
                    <button class="ih-modal-close">&times;</button>
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

        // Close button
        const closeBtn = modal.querySelector('.ih-modal-close');
        if (closeBtn) closeBtn.addEventListener('click', () => modal.remove());

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
    // GovCloud / FedRAMP guidance text per provider
    getGovCloudGuidance(providerId, envKey) {
        const guidance = {
            entra: {
                commercial: 'Requires an Azure AD App Registration with <code>User.Read.All</code>, <code>Policy.Read.All</code>, <code>AuditLog.Read.All</code>, and <code>Reports.Read.All</code> permissions (Application type).',
                gcc: 'GCC uses the same endpoints as Commercial. Register your app in the standard Azure AD portal. Ensure your tenant is provisioned for GCC.',
                gcchigh: '<strong>GCC High</strong> uses isolated Azure Government endpoints. Register your app at <a href="https://portal.azure.us" target="_blank" rel="noopener noreferrer">portal.azure.us</a>. Graph API calls route to <code>graph.microsoft.us</code>. Auth uses <code>login.microsoftonline.us</code>. Requires Azure Government subscription.',
                dod: '<strong>DoD</strong> uses dedicated DoD endpoints. Register your app at <a href="https://portal.azure.us" target="_blank" rel="noopener noreferrer">portal.azure.us</a>. Graph API calls route to <code>dod-graph.microsoft.us</code>. Requires DoD Azure Government subscription with IL5+ authorization.'
            },
            m365: {
                commercial: 'Register an app in Azure AD with <code>Sites.Read.All</code>, <code>Files.Read.All</code> permissions for SharePoint/OneDrive access.',
                gcc: 'GCC uses standard commercial endpoints. Ensure your M365 GCC tenant is properly configured.',
                gcchigh: '<strong>GCC High</strong>: Register your app at <a href="https://portal.azure.us" target="_blank" rel="noopener noreferrer">portal.azure.us</a>. SharePoint Online for GCC High uses <code>*.sharepoint.us</code> domains. Graph calls route to <code>graph.microsoft.us</code>.',
                dod: '<strong>DoD</strong>: Register at <a href="https://portal.azure.us" target="_blank" rel="noopener noreferrer">portal.azure.us</a>. Uses <code>dod-graph.microsoft.us</code>. Requires IL5 authorization for CUI handling.'
            },
            defender: {
                commercial: 'Register an app in Azure AD with <code>SecurityEvents.Read.All</code>, <code>DeviceManagementManagedDevices.Read.All</code>, <code>SecurityActions.Read.All</code> permissions.',
                gcc: '<strong>GCC</strong>: Defender for Endpoint GCC uses <code>api-gcc.securitycenter.microsoft.us</code>. Register your app in the standard Azure AD portal. Ensure MDE is licensed for GCC.',
                gcchigh: '<strong>GCC High</strong>: Register at <a href="https://portal.azure.us" target="_blank" rel="noopener noreferrer">portal.azure.us</a>. MDE API uses <code>api-gov.securitycenter.microsoft.us</code>. Graph calls route to <code>graph.microsoft.us</code>. Requires GCC High MDE license.',
                dod: '<strong>DoD</strong>: Register at <a href="https://portal.azure.us" target="_blank" rel="noopener noreferrer">portal.azure.us</a>. MDE API uses <code>api-gov.securitycenter.microsoft.us</code>. Graph calls route to <code>dod-graph.microsoft.us</code>. Requires DoD MDE license.'
            },
            tenable: {
                commercial: 'Generate API keys from Tenable.io → Settings → My Account → API Keys.',
                fedramp: '<strong>Tenable FedRAMP</strong>: Uses <code>fedcloud.tenable.com</code> instead of <code>cloud.tenable.com</code>. API keys are generated the same way but within your FedRAMP-authorized Tenable.io instance. Contact Tenable for FedRAMP provisioning.'
            },
            sentinelone: {
                commercial: 'Generate an API token from SentinelOne Console → Settings → Users → API Token. Use your commercial console URL (e.g., <code>usea1-xxx.sentinelone.net</code>).',
                govcloud: '<strong>SentinelOne GovCloud</strong>: Uses a dedicated FedRAMP-authorized console (e.g., <code>usea1-gov-xxx.sentinelone.net</code>). Generate API tokens the same way. Contact SentinelOne for GovCloud provisioning and ensure your console URL ends with the gov-specific domain.'
            },
            crowdstrike: {
                commercial: 'Create an OAuth2 API client in Falcon Console → Support → API Clients. Select required scopes: <code>Hosts (Read)</code>, <code>Detections (Read)</code>, <code>Zero Trust Assessment (Read)</code>.',
                us2: 'US-2 cloud uses <code>api.us-2.crowdstrike.com</code>. Create API client the same way in your US-2 Falcon console.',
                eu1: 'EU cloud uses <code>api.eu-1.crowdstrike.com</code>. Create API client in your EU Falcon console.',
                govcloud: '<strong>CrowdStrike GovCloud</strong>: Uses <code>api.laggar.gcw.crowdstrike.com</code>. Your Falcon GovCloud instance is FedRAMP-authorized. Create API clients the same way. Ensure your GovCloud subscription is active.'
            },
            s3: {
                commercial: 'Create an IAM user or role with <code>s3:ListBucket</code>, <code>s3:GetObject</code>, <code>s3:PutObject</code> permissions. Use standard AWS regions (e.g., <code>us-east-1</code>).',
                govcloud: '<strong>AWS GovCloud (US)</strong>: Uses isolated <code>us-gov-west-1</code> or <code>us-gov-east-1</code> regions. IAM credentials are separate from commercial AWS. You must have a GovCloud account linked to your commercial account. S3 endpoints use <code>s3.us-gov-west-1.amazonaws.com</code>.'
            },
            qualys: {
                commercial: 'Use your Qualys platform credentials. API URL depends on your assigned platform (US1, US2, US3, etc.).',
                eu: 'EU platform uses <code>qualysapi.qg2.apps.qualys.eu</code>. Ensure your Qualys subscription is on the EU platform.',
                govcloud: '<strong>Qualys FedRAMP</strong>: Uses <code>qualysapi.qg1.apps.qualys.com</code> (US Gov platform). Your Qualys instance must be FedRAMP-authorized. Contact Qualys for Gov provisioning.'
            }
        };
        return guidance[providerId]?.[envKey] || '';
    },

    showConfigureModal(providerId, parentModal) {
        const provider = this.providers[providerId];
        if (!provider) return;
        const existing = this.getCredentials(providerId) || {};
        const currentEnv = existing.environment || 'commercial';

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
            ],
            notion: [
                { key: 'apiKey', label: 'Integration Token', placeholder: 'secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', type: 'password' }
            ],
            m365: [
                { key: 'tenantId', label: 'Tenant ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', type: 'text' },
                { key: 'clientId', label: 'Application (Client) ID', placeholder: 'App registration client ID', type: 'text' },
                { key: 'clientSecret', label: 'Client Secret', placeholder: 'Client secret value', type: 'password' }
            ],
            gdrive: [
                { key: 'apiKey', label: 'API Key', placeholder: 'Google Cloud API key with Drive scope', type: 'password' }
            ],
            s3: [
                { key: 'accessKeyId', label: 'Access Key ID', placeholder: 'AKIAIOSFODNN7EXAMPLE', type: 'text' },
                { key: 'secretAccessKey', label: 'Secret Access Key', placeholder: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', type: 'password' },
                { key: 'region', label: 'Region', placeholder: 'us-east-1, us-gov-west-1, etc.', type: 'text' },
                { key: 'bucket', label: 'Bucket Name', placeholder: 'my-evidence-bucket', type: 'text' }
            ],
            defender: [
                { key: 'tenantId', label: 'Tenant ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', type: 'text' },
                { key: 'clientId', label: 'Application (Client) ID', placeholder: 'App registration client ID', type: 'text' },
                { key: 'clientSecret', label: 'Client Secret', placeholder: 'Client secret value', type: 'password' }
            ],
            sentinelone: [
                { key: 'apiToken', label: 'API Token', placeholder: 'SentinelOne API token', type: 'password' },
                { key: 'consoleUrl', label: 'Console URL', placeholder: 'https://usea1-xxx.sentinelone.net', type: 'text' }
            ],
            crowdstrike: [
                { key: 'clientId', label: 'Client ID', placeholder: 'CrowdStrike OAuth2 client ID', type: 'text' },
                { key: 'clientSecret', label: 'Client Secret', placeholder: 'CrowdStrike OAuth2 client secret', type: 'password' },
                { key: 'baseUrl', label: 'API Base URL', placeholder: 'https://api.crowdstrike.com', type: 'text' }
            ],
            qualys: [
                { key: 'username', label: 'Username', placeholder: 'Qualys API username', type: 'text' },
                { key: 'password', label: 'Password', placeholder: 'Qualys API password', type: 'password' },
                { key: 'apiUrl', label: 'API URL', placeholder: 'https://qualysapi.qualys.com', type: 'text' }
            ]
        };

        const providerFields = fields[providerId] || [];
        const hasEnvs = !!provider.environments;
        const envEntries = hasEnvs ? Object.entries(provider.environments) : [];

        // Build environment selector HTML
        const envSelectorHtml = hasEnvs ? `
            <div class="ih-field ih-env-selector">
                <label>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    Cloud Environment
                </label>
                <div class="ih-env-pills" id="ih-env-pills-${providerId}">
                    ${envEntries.map(([key, env]) => `
                        <button type="button" class="ih-env-pill ${key === currentEnv ? 'active' : ''}" data-env="${key}">
                            ${key !== 'commercial' && key !== 'gcc' ? '<span class="ih-env-gov-badge">GOV</span>' : ''}
                            ${this.esc(env.label)}
                        </button>
                    `).join('')}
                </div>
            </div>
        ` : '';

        // Build guidance HTML
        const guidanceHtml = `<div class="ih-env-guidance" id="ih-env-guidance-${providerId}">${this.getGovCloudGuidance(providerId, currentEnv) ? '<p class="ih-help-text">' + this.getGovCloudGuidance(providerId, currentEnv) + '</p>' : ''}</div>`;

        const overlay = document.createElement('div');
        overlay.className = 'ih-config-overlay';
        overlay.innerHTML = `
            <div class="ih-config-modal">
                <div class="ih-config-header">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="color:${this.getCategoryColor(provider.category)}">${this.getProviderIcon(providerId)}</span>
                        <h3>Configure ${this.esc(provider.name)}</h3>
                        ${hasEnvs ? '<span class="ih-env-active-badge" id="ih-env-active-badge-' + providerId + '">' + (provider.environments[currentEnv]?.label || 'Commercial') + '</span>' : ''}
                    </div>
                    <button class="ih-config-close">&times;</button>
                </div>
                <div class="ih-config-body">
                    <p class="ih-config-desc">${this.esc(provider.description)}</p>
                    <div class="ih-config-security-note">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        Credentials are stored in session memory only. They will be cleared when you close the browser tab.
                    </div>
                    ${envSelectorHtml}
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
                        ${guidanceHtml}
                        ${providerId === 'knowbe4' ? '<p class="ih-help-text">Generate an API key from KnowBe4 → Account Settings → API → Reporting API.</p>' : ''}
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

        // Environment pill switching
        overlay.querySelectorAll('.ih-env-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                const envKey = pill.dataset.env;
                overlay.querySelectorAll('.ih-env-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                // Update guidance text
                const guidanceEl = overlay.querySelector(`#ih-env-guidance-${providerId}`);
                if (guidanceEl) {
                    const text = this.getGovCloudGuidance(providerId, envKey);
                    guidanceEl.innerHTML = text ? '<p class="ih-help-text">' + text + '</p>' : '';
                }
                // Update header badge
                const badgeEl = overlay.querySelector(`#ih-env-active-badge-${providerId}`);
                if (badgeEl) {
                    const envConfig = provider.environments?.[envKey];
                    badgeEl.textContent = envConfig?.label || 'Commercial';
                    badgeEl.className = 'ih-env-active-badge' + (envKey !== 'commercial' && envKey !== 'gcc' ? ' ih-env-gov' : '');
                }
                // Auto-fill default URLs based on environment selection
                const envConfig = provider.environments?.[envKey];
                if (envConfig) {
                    // CrowdStrike: auto-fill baseUrl
                    if (providerId === 'crowdstrike' && envConfig.defaultBaseUrl) {
                        const urlInput = overlay.querySelector('.ih-input[data-key="baseUrl"]');
                        if (urlInput && !urlInput.value.trim()) urlInput.value = envConfig.defaultBaseUrl;
                    }
                    // Qualys: auto-fill apiUrl
                    if (providerId === 'qualys' && envConfig.defaultApiUrl) {
                        const urlInput = overlay.querySelector('.ih-input[data-key="apiUrl"]');
                        if (urlInput && !urlInput.value.trim()) urlInput.value = envConfig.defaultApiUrl;
                    }
                    // SentinelOne: update placeholder
                    if (providerId === 'sentinelone' && envConfig.consolePlaceholder) {
                        const urlInput = overlay.querySelector('.ih-input[data-key="consoleUrl"]');
                        if (urlInput) urlInput.placeholder = envConfig.consolePlaceholder;
                    }
                    // S3: auto-fill region for GovCloud
                    if (providerId === 's3' && envConfig.defaultRegion) {
                        const regionInput = overlay.querySelector('.ih-input[data-key="region"]');
                        if (regionInput && !regionInput.value.trim()) regionInput.value = envConfig.defaultRegion;
                    }
                }
            });
        });

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
        // Capture selected environment
        const activePill = overlay.querySelector('.ih-env-pill.active');
        if (activePill) {
            creds.environment = activePill.dataset.env;
        }
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
                case 'notion': return await this.testNotionConnection();
                case 'm365': return await this.testM365Connection();
                case 'gdrive': return await this.testGDriveConnection();
                case 's3': return await this.testS3Connection();
                case 'defender': return await this.testDefenderConnection();
                case 'sentinelone': return await this.testSentinelOneConnection();
                case 'crowdstrike': return await this.testCrowdStrikeConnection();
                case 'qualys': return await this.testQualysConnection();
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
                case 'notion': await this.syncNotion(); break;
                case 'm365': await this.syncM365(); break;
                case 'gdrive': await this.syncGDrive(); break;
                case 's3': await this.syncS3(); break;
                case 'defender': await this.syncDefender(); break;
                case 'sentinelone': await this.syncSentinelOne(); break;
                case 'crowdstrike': await this.syncCrowdStrike(); break;
                case 'qualys': await this.syncQualys(); break;
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

        const authUrl = this.resolveAuthUrl('entra');
        const scope = this.resolveScope('entra');
        const tokenUrl = `${authUrl}/${creds.tenantId}/oauth2/v2.0/token`;
        const body = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: creds.clientId,
            client_secret: creds.clientSecret,
            scope: scope
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
        const baseUrl = this.resolveBaseUrl('entra');
        const resp = await fetch(`${baseUrl}${path}`, {
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
        const baseUrl = this.resolveBaseUrl('tenable');
        const resp = await fetch(`${baseUrl}${path}`, {
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
    // NOTION API
    // =========================================
    async notionGet(path) {
        const creds = this.getCredentials('notion');
        if (!creds) throw new Error('Notion credentials not configured');
        const resp = await fetch(`${this.providers.notion.baseUrl}${path}`, {
            headers: {
                'Authorization': `Bearer ${creds.apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        });
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.message || `Notion API error (${resp.status})`);
        }
        return resp.json();
    },

    async notionPost(path, body) {
        const creds = this.getCredentials('notion');
        if (!creds) throw new Error('Notion credentials not configured');
        const resp = await fetch(`${this.providers.notion.baseUrl}${path}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${creds.apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.message || `Notion API error (${resp.status})`);
        }
        return resp.json();
    },

    async testNotionConnection() {
        const me = await this.notionGet('/users/me');
        return { success: true, message: `Connected as ${me.name || me.type || 'Notion bot'}` };
    },

    async syncNotion() {
        // 1. Search for pages shared with the integration
        const searchResp = await this.notionPost('/search', {
            filter: { property: 'object', value: 'page' },
            sort: { direction: 'descending', timestamp: 'last_edited_time' },
            page_size: 50
        });
        const pages = (searchResp.results || []).map(p => ({
            id: p.id,
            title: p.properties?.title?.title?.[0]?.plain_text || p.properties?.Name?.title?.[0]?.plain_text || 'Untitled',
            url: p.url,
            lastEdited: p.last_edited_time,
            createdTime: p.created_time,
            icon: p.icon?.emoji || null
        }));

        // 2. Search for databases
        const dbResp = await this.notionPost('/search', {
            filter: { property: 'object', value: 'database' },
            page_size: 20
        });
        const databases = (dbResp.results || []).map(d => ({
            id: d.id,
            title: d.title?.[0]?.plain_text || 'Untitled DB',
            url: d.url,
            lastEdited: d.last_edited_time
        }));

        this.data.notion = {
            lastSync: new Date().toISOString(),
            stats: {
                pageCount: pages.length,
                databaseCount: databases.length
            },
            pages,
            databases
        };
        this.saveData();
    },

    // =========================================
    // MICROSOFT 365 (SharePoint / OneDrive)
    // =========================================
    async getM365Token() {
        const creds = this.getCredentials('m365');
        if (!creds) throw new Error('M365 credentials not configured');
        const authUrl = this.resolveAuthUrl('m365');
        const scope = this.resolveScope('m365');
        const tokenUrl = `${authUrl}/${creds.tenantId}/oauth2/v2.0/token`;
        const body = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: creds.clientId,
            client_secret: creds.clientSecret,
            scope: scope
        });
        const resp = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString()
        });
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.error_description || `M365 auth failed (${resp.status})`);
        }
        return (await resp.json()).access_token;
    },

    async m365Get(path, token) {
        const baseUrl = this.resolveBaseUrl('m365');
        const resp = await fetch(`${baseUrl}${path}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.error?.message || `Graph API error (${resp.status})`);
        }
        return resp.json();
    },

    async testM365Connection() {
        const token = await this.getM365Token();
        const org = await this.m365Get('/organization', token);
        return { success: true, message: `Connected to ${org.value?.[0]?.displayName || 'M365 tenant'}` };
    },

    async syncM365() {
        const token = await this.getM365Token();

        // 1. SharePoint sites
        let sites = [];
        try {
            const sitesResp = await this.m365Get('/sites?search=*&$top=50', token);
            sites = (sitesResp.value || []).map(s => ({
                id: s.id,
                name: s.displayName || s.name,
                webUrl: s.webUrl,
                lastModified: s.lastModifiedDateTime
            }));
        } catch (e) { console.warn('[M365] Sites error:', e.message); }

        // 2. Root OneDrive files (top-level folders)
        let driveItems = [];
        try {
            const driveResp = await this.m365Get('/drive/root/children?$top=50', token);
            driveItems = (driveResp.value || []).map(i => ({
                id: i.id,
                name: i.name,
                type: i.folder ? 'folder' : 'file',
                size: i.size,
                webUrl: i.webUrl,
                lastModified: i.lastModifiedDateTime,
                mimeType: i.file?.mimeType || null,
                childCount: i.folder?.childCount || 0
            }));
        } catch (e) { console.warn('[M365] OneDrive error:', e.message); }

        this.data.m365 = {
            lastSync: new Date().toISOString(),
            stats: {
                siteCount: sites.length,
                driveItemCount: driveItems.length,
                folderCount: driveItems.filter(i => i.type === 'folder').length,
                fileCount: driveItems.filter(i => i.type === 'file').length
            },
            sites,
            driveItems
        };
        this.saveData();
    },

    // =========================================
    // GOOGLE DRIVE / WORKSPACE
    // =========================================
    async gdriveGet(path) {
        const creds = this.getCredentials('gdrive');
        if (!creds) throw new Error('Google Drive credentials not configured');
        const separator = path.includes('?') ? '&' : '?';
        const resp = await fetch(`${this.providers.gdrive.baseUrl}${path}${separator}key=${creds.apiKey}`, {
            headers: { 'Accept': 'application/json' }
        });
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.error?.message || `Google Drive API error (${resp.status})`);
        }
        return resp.json();
    },

    async testGDriveConnection() {
        const about = await this.gdriveGet('/about?fields=user');
        return { success: true, message: `Connected as ${about.user?.displayName || about.user?.emailAddress || 'Google user'}` };
    },

    async syncGDrive() {
        // List files (recent, shared, policy-related)
        let files = [];
        try {
            const filesResp = await this.gdriveGet('/files?pageSize=50&orderBy=modifiedTime desc&fields=files(id,name,mimeType,size,webViewLink,modifiedTime,owners,shared,parents)');
            files = (filesResp.files || []).map(f => ({
                id: f.id,
                name: f.name,
                mimeType: f.mimeType,
                size: f.size ? parseInt(f.size) : 0,
                webUrl: f.webViewLink,
                lastModified: f.modifiedTime,
                owner: f.owners?.[0]?.displayName || 'Unknown',
                shared: f.shared || false,
                isFolder: f.mimeType === 'application/vnd.google-apps.folder'
            }));
        } catch (e) { console.warn('[GDrive] Files error:', e.message); }

        // Shared drives
        let sharedDrives = [];
        try {
            const drivesResp = await this.gdriveGet('/drives?pageSize=20');
            sharedDrives = (drivesResp.drives || []).map(d => ({
                id: d.id,
                name: d.name
            }));
        } catch (e) { console.warn('[GDrive] Shared drives error:', e.message); }

        this.data.gdrive = {
            lastSync: new Date().toISOString(),
            stats: {
                fileCount: files.filter(f => !f.isFolder).length,
                folderCount: files.filter(f => f.isFolder).length,
                sharedDriveCount: sharedDrives.length,
                totalSize: files.reduce((sum, f) => sum + (f.size || 0), 0)
            },
            files,
            sharedDrives
        };
        this.saveData();
    },

    // =========================================
    // AWS S3
    // =========================================
    async testS3Connection() {
        // S3 REST API requires AWS Signature V4 which is complex client-side.
        // For now, validate credentials are present and well-formed.
        const creds = this.getCredentials('s3');
        if (!creds) throw new Error('S3 credentials not configured');
        if (!creds.accessKeyId || !creds.secretAccessKey || !creds.region || !creds.bucket) {
            throw new Error('All S3 fields are required');
        }
        // Basic format validation
        if (!/^[A-Z0-9]{16,128}$/i.test(creds.accessKeyId)) {
            throw new Error('Access Key ID format appears invalid');
        }
        return { success: true, message: `Configured for bucket "${creds.bucket}" in ${creds.region}. Full S3 sync requires AWS SDK — use the AI agent bridge for file operations.` };
    },

    async syncS3() {
        // S3 ListObjectsV2 requires AWS Signature V4 signing which is non-trivial
        // in a browser without the AWS SDK. Store config for AI agent access.
        const creds = this.getCredentials('s3');
        if (!creds) throw new Error('S3 credentials not configured');

        this.data.s3 = {
            lastSync: new Date().toISOString(),
            bucket: creds.bucket,
            region: creds.region,
            stats: {
                configured: true,
                note: 'S3 file listing requires AWS SDK. Use the MCP agent bridge or export credentials for CLI access.'
            }
        };
        this.saveData();
    },

    // =========================================
    // MICROSOFT DEFENDER FOR ENDPOINT (Graph Security API)
    // =========================================
    async getDefenderToken() {
        const creds = this.getCredentials('defender');
        if (!creds) throw new Error('Defender credentials not configured');
        const authUrl = this.resolveAuthUrl('defender');
        const scope = this.resolveScope('defender');
        const tokenUrl = `${authUrl}/${creds.tenantId}/oauth2/v2.0/token`;
        const body = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: creds.clientId,
            client_secret: creds.clientSecret,
            scope: scope
        });
        const resp = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString()
        });
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.error_description || `Defender auth failed (${resp.status})`);
        }
        return (await resp.json()).access_token;
    },

    async defenderGet(path, token) {
        const baseUrl = this.resolveBaseUrl('defender');
        const resp = await fetch(`${baseUrl}${path}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.error?.message || `Defender API error (${resp.status})`);
        }
        return resp.json();
    },

    async testDefenderConnection() {
        const token = await this.getDefenderToken();
        const org = await this.defenderGet('/organization', token);
        return { success: true, message: `Connected to ${org.value?.[0]?.displayName || 'Defender tenant'}` };
    },

    async syncDefender() {
        const token = await this.getDefenderToken();

        // 1. Managed devices
        let devices = [];
        try {
            const devResp = await this.defenderGet('/deviceManagement/managedDevices?$top=200&$select=id,deviceName,operatingSystem,complianceState,lastSyncDateTime,managedDeviceOwnerType', token);
            devices = (devResp.value || []).map(d => ({
                id: d.id,
                name: d.deviceName,
                os: d.operatingSystem,
                compliance: d.complianceState,
                lastSync: d.lastSyncDateTime,
                ownerType: d.managedDeviceOwnerType
            }));
        } catch (e) { console.warn('[Defender] Devices error:', e.message); }

        // 2. Security alerts
        let alerts = [];
        try {
            const alertResp = await this.defenderGet('/security/alerts_v2?$top=50&$orderby=createdDateTime desc', token);
            alerts = (alertResp.value || []).map(a => ({
                id: a.id,
                title: a.title,
                severity: a.severity,
                status: a.status,
                category: a.category,
                createdDateTime: a.createdDateTime,
                description: (a.description || '').substring(0, 200)
            }));
        } catch (e) { console.warn('[Defender] Alerts error:', e.message); }

        // 3. Secure score
        let secureScore = null;
        try {
            const scoreResp = await this.defenderGet('/security/secureScores?$top=1', token);
            const latest = scoreResp.value?.[0];
            if (latest) {
                secureScore = {
                    currentScore: latest.currentScore,
                    maxScore: latest.maxScore,
                    percentage: latest.maxScore > 0 ? Math.round((latest.currentScore / latest.maxScore) * 100) : 0,
                    createdDateTime: latest.createdDateTime
                };
            }
        } catch (e) { console.warn('[Defender] Secure score error:', e.message); }

        // Compute stats
        const compliant = devices.filter(d => d.compliance === 'compliant').length;
        const nonCompliant = devices.filter(d => d.compliance === 'noncompliant').length;
        const critAlerts = alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length;

        this.data.defender = {
            lastSync: new Date().toISOString(),
            stats: {
                totalDevices: devices.length,
                compliantDevices: compliant,
                nonCompliantDevices: nonCompliant,
                complianceRate: devices.length > 0 ? Math.round((compliant / devices.length) * 100) : 0,
                totalAlerts: alerts.length,
                criticalAlerts: critAlerts,
                secureScorePercent: secureScore?.percentage || null
            },
            devices: devices.slice(0, 50),
            alerts: alerts.slice(0, 25),
            secureScore
        };
        this.saveData();
    },

    // =========================================
    // SENTINELONE API
    // =========================================
    async sentinelOneGet(path) {
        const creds = this.getCredentials('sentinelone');
        if (!creds) throw new Error('SentinelOne credentials not configured');
        const baseUrl = creds.consoleUrl.replace(/\/+$/, '');
        const resp = await fetch(`${baseUrl}/web/api/v2.1${path}`, {
            headers: { 'Authorization': `ApiToken ${creds.apiToken}`, 'Content-Type': 'application/json' }
        });
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.errors?.[0]?.detail || `SentinelOne API error (${resp.status})`);
        }
        return resp.json();
    },

    async testSentinelOneConnection() {
        const resp = await this.sentinelOneGet('/system/info');
        return { success: true, message: `Connected to SentinelOne (build ${resp.data?.build || 'unknown'})` };
    },

    async syncSentinelOne() {
        // 1. Agent statistics
        let agents = [];
        try {
            const agentResp = await this.sentinelOneGet('/agents?limit=200&sortBy=updatedAt&sortOrder=desc');
            agents = (agentResp.data || []).map(a => ({
                id: a.id,
                computerName: a.computerName,
                os: a.osName,
                osVersion: a.osRevision,
                agentVersion: a.agentVersion,
                isActive: a.isActive,
                infected: a.infected,
                networkStatus: a.networkStatus,
                lastActiveDate: a.lastActiveDate,
                threatRebootRequired: a.threatRebootRequired
            }));
        } catch (e) { console.warn('[SentinelOne] Agents error:', e.message); }

        // 2. Threats
        let threats = [];
        try {
            const threatResp = await this.sentinelOneGet('/threats?limit=50&sortBy=createdAt&sortOrder=desc');
            threats = (threatResp.data || []).map(t => ({
                id: t.id,
                classification: t.classification,
                agentComputerName: t.agentRealtimeInfo?.agentComputerName,
                threatName: t.threatInfo?.threatName,
                confidenceLevel: t.threatInfo?.confidenceLevel,
                mitigationStatus: t.mitigationStatus?.[0],
                createdAt: t.createdAt
            }));
        } catch (e) { console.warn('[SentinelOne] Threats error:', e.message); }

        // Stats
        const activeAgents = agents.filter(a => a.isActive).length;
        const infectedAgents = agents.filter(a => a.infected).length;

        this.data.sentinelone = {
            lastSync: new Date().toISOString(),
            stats: {
                totalAgents: agents.length,
                activeAgents,
                infectedAgents,
                healthRate: agents.length > 0 ? Math.round(((agents.length - infectedAgents) / agents.length) * 100) : 0,
                totalThreats: threats.length,
                activeThreats: threats.filter(t => t.mitigationStatus !== 'mitigated').length
            },
            agents: agents.slice(0, 50),
            threats: threats.slice(0, 25)
        };
        this.saveData();
    },

    // =========================================
    // CROWDSTRIKE FALCON API
    // =========================================
    async getCrowdStrikeToken() {
        const creds = this.getCredentials('crowdstrike');
        if (!creds) throw new Error('CrowdStrike credentials not configured');
        const baseUrl = (creds.baseUrl || 'https://api.crowdstrike.com').replace(/\/+$/, '');
        const resp = await fetch(`${baseUrl}/oauth2/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ client_id: creds.clientId, client_secret: creds.clientSecret }).toString()
        });
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.errors?.[0]?.message || `CrowdStrike auth failed (${resp.status})`);
        }
        const data = await resp.json();
        return { token: data.access_token, baseUrl };
    },

    async crowdStrikeGet(path, token, baseUrl) {
        const resp = await fetch(`${baseUrl}${path}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.errors?.[0]?.message || `CrowdStrike API error (${resp.status})`);
        }
        return resp.json();
    },

    async testCrowdStrikeConnection() {
        const { token, baseUrl } = await this.getCrowdStrikeToken();
        const resp = await this.crowdStrikeGet('/sensors/queries/sensors/v1?limit=1', token, baseUrl);
        return { success: true, message: `Connected to CrowdStrike Falcon (${resp.meta?.pagination?.total || 0} sensors)` };
    },

    async syncCrowdStrike() {
        const { token, baseUrl } = await this.getCrowdStrikeToken();

        // 1. Host count and recent hosts
        let hostIds = [];
        let hosts = [];
        try {
            const hostIdResp = await this.crowdStrikeGet('/devices/queries/devices-scroll/v1?limit=200&sort=last_seen.desc', token, baseUrl);
            hostIds = hostIdResp.resources || [];
            if (hostIds.length > 0) {
                const detailResp = await this.crowdStrikeGet(`/devices/entities/devices/v2?ids=${hostIds.slice(0, 50).join('&ids=')}`, token, baseUrl);
                hosts = (detailResp.resources || []).map(h => ({
                    id: h.device_id,
                    hostname: h.hostname,
                    os: h.os_product_name || h.platform_name,
                    osVersion: h.os_version,
                    lastSeen: h.last_seen,
                    status: h.status,
                    agentVersion: h.agent_version,
                    externalIp: h.external_ip
                }));
            }
        } catch (e) { console.warn('[CrowdStrike] Hosts error:', e.message); }

        // 2. Detection summary
        let detections = [];
        try {
            const detResp = await this.crowdStrikeGet('/detects/queries/detects/v1?limit=50&sort=last_behavior|desc', token, baseUrl);
            const detIds = detResp.resources || [];
            if (detIds.length > 0) {
                const detDetailResp = await this.crowdStrikeGet(`/detects/entities/summaries/GET/v1`, token, baseUrl);
                // Fallback: just use count
                detections = detIds.map(id => ({ id }));
            }
        } catch (e) { console.warn('[CrowdStrike] Detections error:', e.message); }

        // 3. Zero Trust Assessment (if available)
        let ztaScore = null;
        try {
            const ztaResp = await this.crowdStrikeGet('/zero-trust-assessment/queries/assessments/v1?limit=1', token, baseUrl);
            if (ztaResp.resources?.length > 0) {
                ztaScore = ztaResp.resources[0];
            }
        } catch (e) { /* ZTA may not be available */ }

        const onlineHosts = hosts.filter(h => h.status === 'normal' || h.status === 'contained').length;

        this.data.crowdstrike = {
            lastSync: new Date().toISOString(),
            stats: {
                totalHosts: hostIds.length,
                onlineHosts,
                detectionCount: detections.length,
                ztaScore: ztaScore?.overall || null
            },
            hosts: hosts.slice(0, 50),
            detections: detections.slice(0, 25),
            ztaScore
        };
        this.saveData();
    },

    // =========================================
    // QUALYS VMDR API
    // =========================================
    async qualysGet(path) {
        const creds = this.getCredentials('qualys');
        if (!creds) throw new Error('Qualys credentials not configured');
        const apiUrl = (creds.apiUrl || 'https://qualysapi.qualys.com').replace(/\/+$/, '');
        const auth = btoa(`${creds.username}:${creds.password}`);
        const resp = await fetch(`${apiUrl}${path}`, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            }
        });
        if (!resp.ok) {
            throw new Error(`Qualys API error (${resp.status}): ${resp.statusText}`);
        }
        return resp.json();
    },

    async testQualysConnection() {
        // Use the VMDR API to check connectivity
        const creds = this.getCredentials('qualys');
        if (!creds) throw new Error('Qualys credentials not configured');
        const apiUrl = (creds.apiUrl || 'https://qualysapi.qualys.com').replace(/\/+$/, '');
        const auth = btoa(`${creds.username}:${creds.password}`);
        const resp = await fetch(`${apiUrl}/api/2.0/fo/activity_log/?action=list&truncation_limit=1`, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        if (!resp.ok) throw new Error(`Qualys auth failed (${resp.status})`);
        return { success: true, message: 'Connected to Qualys VMDR' };
    },

    async syncQualys() {
        // 1. Host count
        let hostCount = 0;
        try {
            const hostResp = await this.qualysGet('/api/2.0/fo/asset/host/?action=list&truncation_limit=0');
            hostCount = hostResp?.HOST_LIST_OUTPUT?.RESPONSE?.HOST_LIST?.HOST?.length || 0;
        } catch (e) {
            console.warn('[Qualys] Host count error:', e.message);
            // Try VMDR asset count endpoint
            try {
                const assetResp = await this.qualysGet('/rest/2.0/count/am/asset');
                hostCount = assetResp?.count || 0;
            } catch (e2) { console.warn('[Qualys] Asset count error:', e2.message); }
        }

        // 2. Vulnerability summary via VMDR
        let vulnSummary = { severity1: 0, severity2: 0, severity3: 0, severity4: 0, severity5: 0 };
        try {
            const vulnResp = await this.qualysGet('/api/2.0/fo/knowledge_base/vuln/?action=count');
            // Parse counts if available
            if (vulnResp) {
                vulnSummary.total = vulnResp.count || 0;
            }
        } catch (e) { console.warn('[Qualys] Vuln summary error:', e.message); }

        // 3. Scan list
        let scans = [];
        try {
            const scanResp = await this.qualysGet('/api/2.0/fo/scan/?action=list&show_last=10');
            const scanList = scanResp?.SCAN_LIST_OUTPUT?.RESPONSE?.SCAN_LIST?.SCAN || [];
            scans = (Array.isArray(scanList) ? scanList : [scanList]).filter(Boolean).map(s => ({
                ref: s.REF,
                title: s.TITLE,
                status: s.STATUS?.STATE,
                launchDate: s.LAUNCH_DATETIME,
                type: s.TYPE
            }));
        } catch (e) { console.warn('[Qualys] Scans error:', e.message); }

        this.data.qualys = {
            lastSync: new Date().toISOString(),
            stats: {
                hostCount,
                scanCount: scans.length,
                vulnSummary
            },
            scans
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
            case 'notion': return this.renderNotionData(data);
            case 'm365': return this.renderM365Data(data);
            case 'gdrive': return this.renderGDriveData(data);
            case 's3': return this.renderS3Data(data);
            case 'defender': return this.renderDefenderData(data);
            case 'sentinelone': return this.renderSentinelOneData(data);
            case 'crowdstrike': return this.renderCrowdStrikeData(data);
            case 'qualys': return this.renderQualysData(data);
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

    renderNotionData(data) {
        const s = data.stats || {};
        return `
            <div class="ih-data-header">
                <h4>Notion Workspace</h4>
                <span class="ih-data-sync">Last sync: ${this.formatDateTime(data.lastSync)}</span>
            </div>
            <div class="ih-data-kpi-strip">
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.pageCount || 0}</span>
                    <span class="ih-data-kpi-label">Pages</span>
                </div>
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.databaseCount || 0}</span>
                    <span class="ih-data-kpi-label">Databases</span>
                </div>
            </div>
            <h5>Recent Pages</h5>
            <div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th></th><th>Title</th><th>Last Edited</th><th>Link</th></tr></thead><tbody>
            ${(data.pages || []).slice(0, 20).map(p => `<tr>
                <td>${p.icon || '📄'}</td>
                <td>${this.esc(p.title)}</td>
                <td>${this.formatDateTime(p.lastEdited)}</td>
                <td>${p.url ? `<a href="${this.esc(p.url)}" target="_blank" rel="noopener noreferrer">Open</a>` : '—'}</td>
            </tr>`).join('')}
            </tbody></table></div>
            ${data.databases.length > 0 ? `
                <h5>Databases</h5>
                <div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th>Name</th><th>Last Edited</th><th>Link</th></tr></thead><tbody>
                ${data.databases.map(d => `<tr>
                    <td>${this.esc(d.title)}</td>
                    <td>${this.formatDateTime(d.lastEdited)}</td>
                    <td>${d.url ? `<a href="${this.esc(d.url)}" target="_blank" rel="noopener noreferrer">Open</a>` : '—'}</td>
                </tr>`).join('')}
                </tbody></table></div>
            ` : ''}
        `;
    },

    renderM365Data(data) {
        const s = data.stats || {};
        return `
            <div class="ih-data-header">
                <h4>Microsoft 365</h4>
                <span class="ih-data-sync">Last sync: ${this.formatDateTime(data.lastSync)}</span>
            </div>
            <div class="ih-data-kpi-strip">
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.siteCount || 0}</span>
                    <span class="ih-data-kpi-label">SharePoint Sites</span>
                </div>
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.folderCount || 0}</span>
                    <span class="ih-data-kpi-label">OneDrive Folders</span>
                </div>
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.fileCount || 0}</span>
                    <span class="ih-data-kpi-label">OneDrive Files</span>
                </div>
            </div>
            ${data.sites.length > 0 ? `
                <h5>SharePoint Sites</h5>
                <div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th>Site</th><th>Last Modified</th><th>Link</th></tr></thead><tbody>
                ${data.sites.slice(0, 15).map(s => `<tr>
                    <td>${this.esc(s.name)}</td>
                    <td>${this.formatDateTime(s.lastModified)}</td>
                    <td>${s.webUrl ? `<a href="${this.esc(s.webUrl)}" target="_blank" rel="noopener noreferrer">Open</a>` : '—'}</td>
                </tr>`).join('')}
                </tbody></table></div>
            ` : ''}
            ${data.driveItems.length > 0 ? `
                <h5>OneDrive Root Items</h5>
                <div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th>Name</th><th>Type</th><th>Size</th><th>Last Modified</th></tr></thead><tbody>
                ${data.driveItems.slice(0, 20).map(i => `<tr>
                    <td>${this.esc(i.name)}</td>
                    <td>${i.type === 'folder' ? `📁 Folder (${i.childCount})` : '📄 File'}</td>
                    <td>${i.size ? (i.size > 1048576 ? (i.size / 1048576).toFixed(1) + ' MB' : (i.size / 1024).toFixed(0) + ' KB') : '—'}</td>
                    <td>${this.formatDateTime(i.lastModified)}</td>
                </tr>`).join('')}
                </tbody></table></div>
            ` : ''}
        `;
    },

    renderGDriveData(data) {
        const s = data.stats || {};
        const totalMB = s.totalSize ? (s.totalSize / 1048576).toFixed(1) : '0';
        return `
            <div class="ih-data-header">
                <h4>Google Workspace</h4>
                <span class="ih-data-sync">Last sync: ${this.formatDateTime(data.lastSync)}</span>
            </div>
            <div class="ih-data-kpi-strip">
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.fileCount || 0}</span>
                    <span class="ih-data-kpi-label">Files</span>
                </div>
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.folderCount || 0}</span>
                    <span class="ih-data-kpi-label">Folders</span>
                </div>
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.sharedDriveCount || 0}</span>
                    <span class="ih-data-kpi-label">Shared Drives</span>
                </div>
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${totalMB} MB</span>
                    <span class="ih-data-kpi-label">Total Size</span>
                </div>
            </div>
            <h5>Recent Files</h5>
            <div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th>Name</th><th>Owner</th><th>Modified</th><th>Link</th></tr></thead><tbody>
            ${(data.files || []).filter(f => !f.isFolder).slice(0, 20).map(f => `<tr>
                <td>${this.esc(f.name)}</td>
                <td>${this.esc(f.owner)}</td>
                <td>${this.formatDateTime(f.lastModified)}</td>
                <td>${f.webUrl ? `<a href="${this.esc(f.webUrl)}" target="_blank" rel="noopener noreferrer">Open</a>` : '—'}</td>
            </tr>`).join('')}
            </tbody></table></div>
        `;
    },

    renderS3Data(data) {
        return `
            <div class="ih-data-header">
                <h4>AWS S3 — ${this.esc(data.bucket || 'N/A')}</h4>
                <span class="ih-data-sync">Last sync: ${this.formatDateTime(data.lastSync)}</span>
            </div>
            <div class="ih-data-kpi-strip">
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${this.esc(data.region || 'N/A')}</span>
                    <span class="ih-data-kpi-label">Region</span>
                </div>
                <div class="ih-data-kpi ih-kpi-green">
                    <span class="ih-data-kpi-value">✓</span>
                    <span class="ih-data-kpi-label">Configured</span>
                </div>
            </div>
            <div class="ih-data-alert ih-alert-info">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                S3 bucket browsing requires AWS Signature V4 signing which is not available in the browser. Use the AI agent bridge (MCP server) to list and retrieve objects, or use the AWS CLI with the configured credentials.
            </div>
            <div style="margin-top:12px;">
                <p style="font-size:0.75rem;color:var(--text-secondary);">Bucket: <code>${this.esc(data.bucket)}</code></p>
                <p style="font-size:0.75rem;color:var(--text-secondary);">Region: <code>${this.esc(data.region)}</code></p>
                <p style="font-size:0.75rem;color:var(--text-muted);margin-top:8px;">AI agents with access to this integration can read/write evidence artifacts, policy documents, and assessment exports from this bucket.</p>
            </div>
        `;
    },

    renderDefenderData(data) {
        const s = data.stats || {};
        return `
            <div class="ih-data-header">
                <h4>Microsoft Defender for Endpoint</h4>
                <span class="ih-data-sync">Last sync: ${this.formatDateTime(data.lastSync)}</span>
            </div>
            <div class="ih-data-kpi-strip">
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.totalDevices || 0}</span>
                    <span class="ih-data-kpi-label">Managed Devices</span>
                </div>
                <div class="ih-data-kpi ${s.complianceRate >= 95 ? 'ih-kpi-green' : s.complianceRate >= 80 ? 'ih-kpi-amber' : 'ih-kpi-red'}">
                    <span class="ih-data-kpi-value">${s.complianceRate || 0}%</span>
                    <span class="ih-data-kpi-label">Compliance Rate</span>
                </div>
                <div class="ih-data-kpi ${s.criticalAlerts > 0 ? 'ih-kpi-red' : 'ih-kpi-green'}">
                    <span class="ih-data-kpi-value">${s.criticalAlerts || 0}</span>
                    <span class="ih-data-kpi-label">Critical/High Alerts</span>
                </div>
                ${s.secureScorePercent !== null ? `<div class="ih-data-kpi ${s.secureScorePercent >= 80 ? 'ih-kpi-green' : s.secureScorePercent >= 60 ? 'ih-kpi-amber' : 'ih-kpi-red'}">
                    <span class="ih-data-kpi-value">${s.secureScorePercent}%</span>
                    <span class="ih-data-kpi-label">Secure Score</span>
                </div>` : ''}
            </div>
            ${s.nonCompliantDevices > 0 ? `<div class="ih-data-alert ih-alert-warn">&#9888; ${s.nonCompliantDevices} non-compliant device(s). Review device compliance policies for CM and SI control families.</div>` : '<div class="ih-data-alert ih-alert-good">&#10003; All managed devices are compliant.</div>'}
            ${(data.alerts || []).length > 0 ? `
                <h5>Recent Security Alerts</h5>
                <div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th>Alert</th><th>Severity</th><th>Category</th><th>Status</th><th>Date</th></tr></thead><tbody>
                ${data.alerts.slice(0, 15).map(a => `<tr>
                    <td>${this.esc(a.title)}</td>
                    <td><span class="ih-status-tag ih-status-${a.severity === 'critical' || a.severity === 'high' ? 'red' : a.severity === 'medium' ? 'amber' : 'gray'}">${a.severity}</span></td>
                    <td>${this.esc(a.category || '—')}</td>
                    <td>${this.esc(a.status)}</td>
                    <td>${this.formatDateTime(a.createdDateTime)}</td>
                </tr>`).join('')}
                </tbody></table></div>
            ` : ''}
        `;
    },

    renderSentinelOneData(data) {
        const s = data.stats || {};
        return `
            <div class="ih-data-header">
                <h4>SentinelOne</h4>
                <span class="ih-data-sync">Last sync: ${this.formatDateTime(data.lastSync)}</span>
            </div>
            <div class="ih-data-kpi-strip">
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.totalAgents || 0}</span>
                    <span class="ih-data-kpi-label">Total Agents</span>
                </div>
                <div class="ih-data-kpi ${s.healthRate >= 95 ? 'ih-kpi-green' : s.healthRate >= 80 ? 'ih-kpi-amber' : 'ih-kpi-red'}">
                    <span class="ih-data-kpi-value">${s.healthRate || 0}%</span>
                    <span class="ih-data-kpi-label">Health Rate</span>
                </div>
                <div class="ih-data-kpi ${s.infectedAgents > 0 ? 'ih-kpi-red' : 'ih-kpi-green'}">
                    <span class="ih-data-kpi-value">${s.infectedAgents || 0}</span>
                    <span class="ih-data-kpi-label">Infected</span>
                </div>
                <div class="ih-data-kpi ${s.activeThreats > 0 ? 'ih-kpi-red' : 'ih-kpi-green'}">
                    <span class="ih-data-kpi-value">${s.activeThreats || 0}</span>
                    <span class="ih-data-kpi-label">Active Threats</span>
                </div>
            </div>
            ${s.infectedAgents > 0 ? `<div class="ih-data-alert ih-alert-warn">&#9888; ${s.infectedAgents} infected endpoint(s) detected. Immediate remediation required for SI-3.14.1 compliance.</div>` : '<div class="ih-data-alert ih-alert-good">&#10003; No infected endpoints detected.</div>'}
            ${(data.threats || []).length > 0 ? `
                <h5>Recent Threats</h5>
                <div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th>Threat</th><th>Host</th><th>Classification</th><th>Confidence</th><th>Status</th></tr></thead><tbody>
                ${data.threats.slice(0, 15).map(t => `<tr>
                    <td>${this.esc(t.threatName || '—')}</td>
                    <td>${this.esc(t.agentComputerName || '—')}</td>
                    <td>${this.esc(t.classification || '—')}</td>
                    <td>${this.esc(t.confidenceLevel || '—')}</td>
                    <td><span class="ih-status-tag ih-status-${t.mitigationStatus === 'mitigated' ? 'green' : 'red'}">${this.esc(t.mitigationStatus || 'active')}</span></td>
                </tr>`).join('')}
                </tbody></table></div>
            ` : ''}
        `;
    },

    renderCrowdStrikeData(data) {
        const s = data.stats || {};
        return `
            <div class="ih-data-header">
                <h4>CrowdStrike Falcon</h4>
                <span class="ih-data-sync">Last sync: ${this.formatDateTime(data.lastSync)}</span>
            </div>
            <div class="ih-data-kpi-strip">
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.totalHosts || 0}</span>
                    <span class="ih-data-kpi-label">Total Hosts</span>
                </div>
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.onlineHosts || 0}</span>
                    <span class="ih-data-kpi-label">Online</span>
                </div>
                <div class="ih-data-kpi ${s.detectionCount > 0 ? 'ih-kpi-red' : 'ih-kpi-green'}">
                    <span class="ih-data-kpi-value">${s.detectionCount || 0}</span>
                    <span class="ih-data-kpi-label">Detections</span>
                </div>
                ${s.ztaScore !== null ? `<div class="ih-data-kpi ${s.ztaScore >= 80 ? 'ih-kpi-green' : s.ztaScore >= 60 ? 'ih-kpi-amber' : 'ih-kpi-red'}">
                    <span class="ih-data-kpi-value">${s.ztaScore}</span>
                    <span class="ih-data-kpi-label">ZTA Score</span>
                </div>` : ''}
            </div>
            ${s.detectionCount > 0 ? `<div class="ih-data-alert ih-alert-warn">&#9888; ${s.detectionCount} detection(s) require review. Impacts SI-3.14.x controls.</div>` : '<div class="ih-data-alert ih-alert-good">&#10003; No active detections.</div>'}
            ${(data.hosts || []).length > 0 ? `
                <h5>Recent Hosts</h5>
                <div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th>Hostname</th><th>OS</th><th>Status</th><th>Agent</th><th>Last Seen</th></tr></thead><tbody>
                ${data.hosts.slice(0, 20).map(h => `<tr>
                    <td>${this.esc(h.hostname)}</td>
                    <td>${this.esc(h.os || '—')}</td>
                    <td><span class="ih-status-tag ih-status-${h.status === 'normal' ? 'green' : 'amber'}">${h.status}</span></td>
                    <td>${this.esc(h.agentVersion || '—')}</td>
                    <td>${this.formatDateTime(h.lastSeen)}</td>
                </tr>`).join('')}
                </tbody></table></div>
            ` : ''}
        `;
    },

    renderQualysData(data) {
        const s = data.stats || {};
        return `
            <div class="ih-data-header">
                <h4>Qualys VMDR</h4>
                <span class="ih-data-sync">Last sync: ${this.formatDateTime(data.lastSync)}</span>
            </div>
            <div class="ih-data-kpi-strip">
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.hostCount || 0}</span>
                    <span class="ih-data-kpi-label">Hosts</span>
                </div>
                <div class="ih-data-kpi">
                    <span class="ih-data-kpi-value">${s.scanCount || 0}</span>
                    <span class="ih-data-kpi-label">Recent Scans</span>
                </div>
                ${s.vulnSummary?.total ? `<div class="ih-data-kpi ih-kpi-amber">
                    <span class="ih-data-kpi-value">${s.vulnSummary.total}</span>
                    <span class="ih-data-kpi-label">Known Vulns</span>
                </div>` : ''}
            </div>
            ${(data.scans || []).length > 0 ? `
                <h5>Recent Scans</h5>
                <div class="ih-oscal-table-wrap"><table class="ih-oscal-table"><thead><tr><th>Scan</th><th>Type</th><th>Status</th><th>Launch Date</th></tr></thead><tbody>
                ${data.scans.map(s => `<tr>
                    <td>${this.esc(s.title || s.ref)}</td>
                    <td>${this.esc(s.type || '—')}</td>
                    <td><span class="ih-status-tag ih-status-${s.status === 'Finished' ? 'green' : 'blue'}">${this.esc(s.status || '—')}</span></td>
                    <td>${this.formatDateTime(s.launchDate)}</td>
                </tr>`).join('')}
                </tbody></table></div>
            ` : ''}
        `;
    },

    // =========================================
    // PUBLIC API — for other modules
    // =========================================
    getEntraStats() { return this.data.entra?.stats || null; },
    getKnowBe4Stats() { return this.data.knowbe4?.stats || null; },
    getTenableStats() { return this.data.tenable?.stats || null; },
    getJiraStats() { return this.data.jira?.stats || null; },
    getNotionStats() { return this.data.notion?.stats || null; },
    getM365Stats() { return this.data.m365?.stats || null; },
    getGDriveStats() { return this.data.gdrive?.stats || null; },
    getS3Stats() { return this.data.s3?.stats || null; },
    getDefenderStats() { return this.data.defender?.stats || null; },
    getSentinelOneStats() { return this.data.sentinelone?.stats || null; },
    getCrowdStrikeStats() { return this.data.crowdstrike?.stats || null; },
    getQualysStats() { return this.data.qualys?.stats || null; },

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
        // M365 — Media protection, data protection
        if (this.data.m365 && this.providers.m365.controls.includes(controlId)) {
            const s = this.data.m365.stats;
            evidence.push({
                source: 'Microsoft 365',
                type: 'automated',
                syncDate: this.data.m365.lastSync,
                data: { siteCount: s.siteCount, fileCount: s.fileCount },
                summary: `${s.siteCount} SharePoint sites | ${s.fileCount} OneDrive files accessible`
            });
        }
        // Google Drive — Media protection, data protection
        if (this.data.gdrive && this.providers.gdrive.controls.includes(controlId)) {
            const s = this.data.gdrive.stats;
            evidence.push({
                source: 'Google Workspace',
                type: 'automated',
                syncDate: this.data.gdrive.lastSync,
                data: { fileCount: s.fileCount, sharedDriveCount: s.sharedDriveCount },
                summary: `${s.fileCount} files | ${s.sharedDriveCount} shared drives`
            });
        }
        // S3 — Media protection
        if (this.data.s3 && this.providers.s3.controls.includes(controlId)) {
            evidence.push({
                source: 'AWS S3',
                type: 'configured',
                syncDate: this.data.s3.lastSync,
                data: { bucket: this.data.s3.bucket, region: this.data.s3.region },
                summary: `S3 bucket "${this.data.s3.bucket}" in ${this.data.s3.region} configured for evidence storage`
            });
        }
        // Defender — Endpoint protection, config mgmt, vulnerability, system integrity
        if (this.data.defender && this.providers.defender.controls.includes(controlId)) {
            const s = this.data.defender.stats;
            evidence.push({
                source: 'Microsoft Defender',
                type: 'automated',
                syncDate: this.data.defender.lastSync,
                data: { complianceRate: s.complianceRate, criticalAlerts: s.criticalAlerts, secureScore: s.secureScorePercent },
                summary: `${s.totalDevices} devices | ${s.complianceRate}% compliant | ${s.criticalAlerts} critical alerts${s.secureScorePercent !== null ? ' | Secure Score: ' + s.secureScorePercent + '%' : ''}`
            });
        }
        // SentinelOne — Endpoint protection, system integrity
        if (this.data.sentinelone && this.providers.sentinelone.controls.includes(controlId)) {
            const s = this.data.sentinelone.stats;
            evidence.push({
                source: 'SentinelOne',
                type: 'automated',
                syncDate: this.data.sentinelone.lastSync,
                data: { healthRate: s.healthRate, infectedAgents: s.infectedAgents, activeThreats: s.activeThreats },
                summary: `${s.totalAgents} agents | ${s.healthRate}% healthy | ${s.activeThreats} active threats`
            });
        }
        // CrowdStrike — Endpoint protection, vulnerability, system integrity
        if (this.data.crowdstrike && this.providers.crowdstrike.controls.includes(controlId)) {
            const s = this.data.crowdstrike.stats;
            evidence.push({
                source: 'CrowdStrike Falcon',
                type: 'automated',
                syncDate: this.data.crowdstrike.lastSync,
                data: { totalHosts: s.totalHosts, detectionCount: s.detectionCount, ztaScore: s.ztaScore },
                summary: `${s.totalHosts} hosts | ${s.detectionCount} detections${s.ztaScore !== null ? ' | ZTA: ' + s.ztaScore : ''}`
            });
        }
        // Qualys — Vulnerability, config mgmt, system integrity
        if (this.data.qualys && this.providers.qualys.controls.includes(controlId)) {
            const s = this.data.qualys.stats;
            evidence.push({
                source: 'Qualys VMDR',
                type: 'automated',
                syncDate: this.data.qualys.lastSync,
                data: { hostCount: s.hostCount, scanCount: s.scanCount },
                summary: `${s.hostCount} hosts | ${s.scanCount} recent scans`
            });
        }
        return evidence;
    },

    // Alias for settings-page.js compatibility
    openHub() { this.showHub(); }
};

// Auto-init on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => IntegrationsHub.init());
} else {
    IntegrationsHub.init();
}
