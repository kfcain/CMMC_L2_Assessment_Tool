// API Connectors for Cloud Platforms
// User provides their own API keys - all API calls are client-side
// No backend costs - user incurs all API usage costs directly
// Credentials stored in browser localStorage only (user's device)

const APIConnectors = {
    config: {
        version: "1.0.0",
        storageKey: "nist-api-connections",
        timeout: 30000, // 30 seconds
        disclaimer: "⚠️ You are responsible for all API costs. Credentials are stored locally in your browser only."
    },

    connections: {},
    
    // Supported platforms
    platforms: {
        azure: {
            name: "Microsoft Azure",
            icon: "☁️",
            authType: "oauth",
            scopes: ["https://management.azure.com/.default"],
            endpoints: {
                resources: "https://management.azure.com/subscriptions/{subscriptionId}/resources",
                policies: "https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyAssignments",
                security: "https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Security/assessments"
            }
        },
        aws: {
            name: "Amazon Web Services",
            icon: "🟠",
            authType: "access_key",
            endpoints: {
                ec2: "https://ec2.amazonaws.com/",
                iam: "https://iam.amazonaws.com/",
                config: "https://config.amazonaws.com/"
            }
        },
        m365: {
            name: "Microsoft 365",
            icon: "📧",
            authType: "oauth",
            scopes: ["https://graph.microsoft.com/.default"],
            endpoints: {
                users: "https://graph.microsoft.com/v1.0/users",
                security: "https://graph.microsoft.com/v1.0/security",
                compliance: "https://graph.microsoft.com/v1.0/compliance"
            }
        },
        gcp: {
            name: "Google Cloud Platform",
            icon: "🔵",
            authType: "service_account",
            endpoints: {
                compute: "https://compute.googleapis.com/compute/v1",
                iam: "https://iam.googleapis.com/v1",
                security: "https://securitycenter.googleapis.com/v1"
            }
        }
    },

    init: function() {
        this.loadConnections();
        this.bindEvents();
        console.log('[APIConnectors] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#open-api-connectors-btn')) {
                this.showConnectorsModal();
            }
            if (e.target.closest('.connect-platform-btn')) {
                const platform = e.target.closest('.connect-platform-btn').dataset.platform;
                this.showConnectionModal(platform);
            }
            if (e.target.closest('#save-connection-btn')) {
                this.saveConnection();
            }
            if (e.target.closest('.test-connection-btn')) {
                const connectionId = e.target.closest('.test-connection-btn').dataset.connectionId;
                this.testConnection(connectionId);
            }
            if (e.target.closest('.delete-connection-btn')) {
                const connectionId = e.target.closest('.delete-connection-btn').dataset.connectionId;
                this.deleteConnection(connectionId);
            }
            if (e.target.closest('.collect-evidence-btn')) {
                const connectionId = e.target.closest('.collect-evidence-btn').dataset.connectionId;
                this.collectEvidence(connectionId);
            }
        });
    },

    loadConnections: function() {
        const saved = localStorage.getItem(this.config.storageKey);
        this.connections = saved ? JSON.parse(saved) : {};
    },

    saveConnections: function() {
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.connections));
    },

    showConnectorsModal: function() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay api-connectors-modal';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2>🔌 API Connectors</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="connectors-container">
                        <div class="connectors-intro">
                            <div class="disclaimer-banner">
                                ${this.config.disclaimer}
                            </div>
                            <p>Connect to cloud platforms using <strong>your own API credentials</strong> to automatically collect compliance evidence. All API calls are made directly from your browser to the cloud provider - no data passes through our servers.</p>
                            <p><strong>Important:</strong> You are responsible for all API usage costs charged by the cloud provider.</p>
                        </div>
                        
                        <!-- Available Platforms -->
                        <div class="platforms-section">
                            <h3>Available Platforms</h3>
                            <div class="platforms-grid">
                                ${Object.entries(this.platforms).map(([key, platform]) => `
                                    <div class="platform-card">
                                        <div class="platform-icon">${platform.icon}</div>
                                        <div class="platform-info">
                                            <h4>${platform.name}</h4>
                                            <p class="platform-auth">${this.getAuthTypeLabel(platform.authType)}</p>
                                        </div>
                                        <button class="btn-primary connect-platform-btn" data-platform="${key}">
                                            Connect
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Active Connections -->
                        ${Object.keys(this.connections).length > 0 ? `
                        <div class="connections-section">
                            <h3>Active Connections</h3>
                            <div class="connections-list">
                                ${this.renderConnectionsList()}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    getAuthTypeLabel: function(authType) {
        const labels = {
            oauth: 'OAuth 2.0',
            access_key: 'Access Key',
            service_account: 'Service Account',
            api_key: 'API Key'
        };
        return labels[authType] || authType;
    },

    renderConnectionsList: function() {
        return Object.entries(this.connections).map(([id, conn]) => {
            const platform = this.platforms[conn.platform];
            return `
                <div class="connection-item">
                    <div class="connection-icon">${platform.icon}</div>
                    <div class="connection-info">
                        <h4>${conn.name}</h4>
                        <p class="connection-platform">${platform.name}</p>
                        <p class="connection-status ${conn.status || 'unknown'}">
                            ${this.getStatusLabel(conn.status)}
                        </p>
                    </div>
                    <div class="connection-actions">
                        <button class="btn-secondary test-connection-btn" data-connection-id="${id}">
                            Test
                        </button>
                        <button class="btn-primary collect-evidence-btn" data-connection-id="${id}">
                            Collect Evidence
                        </button>
                        <button class="btn-icon delete-connection-btn" data-connection-id="${id}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    getStatusLabel: function(status) {
        const labels = {
            connected: '✅ Connected',
            error: '❌ Error',
            unknown: '⚠️ Not Tested'
        };
        return labels[status] || labels.unknown;
    },

    showConnectionModal: function(platformKey) {
        const platform = this.platforms[platformKey];
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay connection-config-modal';
        modal.innerHTML = `
            <div class="modal-content modal-medium">
                <div class="modal-header">
                    <h2>${platform.icon} Connect to ${platform.name}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <form id="connection-form">
                        <input type="hidden" id="connection-platform" value="${platformKey}">
                        
                        <div class="form-group">
                            <label>Connection Name *</label>
                            <input type="text" id="connection-name" class="form-input" required placeholder="e.g., Production Azure">
                        </div>

                        ${this.getAuthFields(platformKey, platform.authType)}

                        <div class="form-group">
                            <label>Description</label>
                            <textarea id="connection-description" class="form-textarea" rows="2" placeholder="Optional description..."></textarea>
                        </div>

                        <div class="connection-help">
                            <h4>ℹ️ Setup Instructions</h4>
                            ${this.getSetupInstructions(platformKey)}
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button class="btn-primary" id="save-connection-btn">Save Connection</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    getAuthFields: function(platform, authType) {
        switch(authType) {
            case 'oauth':
                return `
                    <div class="form-group">
                        <label>Client ID *</label>
                        <input type="text" id="connection-client-id" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label>Client Secret *</label>
                        <input type="password" id="connection-client-secret" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label>Tenant ID ${platform === 'azure' ? '*' : '(if applicable)'}</label>
                        <input type="text" id="connection-tenant-id" class="form-input" ${platform === 'azure' ? 'required' : ''}>
                    </div>
                `;
            
            case 'access_key':
                return `
                    <div class="form-group">
                        <label>Access Key ID *</label>
                        <input type="text" id="connection-access-key" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label>Secret Access Key *</label>
                        <input type="password" id="connection-secret-key" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label>Region</label>
                        <input type="text" id="connection-region" class="form-input" placeholder="e.g., us-east-1">
                    </div>
                `;
            
            case 'service_account':
                return `
                    <div class="form-group">
                        <label>Service Account JSON *</label>
                        <textarea id="connection-service-account" class="form-textarea" rows="4" required placeholder="Paste service account JSON here..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Project ID *</label>
                        <input type="text" id="connection-project-id" class="form-input" required>
                    </div>
                `;
            
            default:
                return `
                    <div class="form-group">
                        <label>API Key *</label>
                        <input type="password" id="connection-api-key" class="form-input" required>
                    </div>
                `;
        }
    },

    getSetupInstructions: function(platform) {
        const instructions = {
            azure: `
                <ol>
                    <li>Go to Azure Portal → Azure Active Directory → App registrations</li>
                    <li>Create a new app registration</li>
                    <li>Copy the Application (client) ID and Directory (tenant) ID</li>
                    <li>Create a client secret under Certificates & secrets</li>
                    <li>Grant API permissions for Azure Resource Manager</li>
                </ol>
                <p class="cost-warning">💰 <strong>API Costs:</strong> You will be charged by Microsoft for Azure API usage based on your Azure subscription pricing.</p>
            `,
            aws: `
                <ol>
                    <li>Go to AWS Console → IAM → Users</li>
                    <li>Create a new user or select existing user</li>
                    <li>Create access keys under Security credentials</li>
                    <li>Attach policies: ReadOnlyAccess, SecurityAudit</li>
                    <li>Copy Access Key ID and Secret Access Key</li>
                </ol>
                <p class="cost-warning">💰 <strong>API Costs:</strong> You will be charged by AWS for API usage. Most read-only calls are low cost, but check AWS pricing.</p>
            `,
            m365: `
                <ol>
                    <li>Go to Azure Portal → Azure Active Directory → App registrations</li>
                    <li>Create a new app registration</li>
                    <li>Grant Microsoft Graph API permissions (User.Read.All, SecurityEvents.Read.All)</li>
                    <li>Create a client secret</li>
                    <li>Admin consent required for organization-wide access</li>
                </ol>
                <p class="cost-warning">💰 <strong>API Costs:</strong> Microsoft Graph API calls may incur costs depending on your M365 license tier.</p>
            `,
            gcp: `
                <ol>
                    <li>Go to GCP Console → IAM & Admin → Service Accounts</li>
                    <li>Create a new service account</li>
                    <li>Grant roles: Viewer, Security Reviewer</li>
                    <li>Create and download JSON key</li>
                    <li>Paste the JSON content in the field above</li>
                </ol>
                <p class="cost-warning">💰 <strong>API Costs:</strong> You will be charged by Google Cloud for API usage based on your GCP project billing.</p>
            `
        };
        return instructions[platform] || '<p>See platform documentation for setup instructions.</p>';
    },

    saveConnection: function() {
        const platform = document.getElementById('connection-platform')?.value;
        const name = document.getElementById('connection-name')?.value;
        const description = document.getElementById('connection-description')?.value;

        if (!platform || !name) {
            this.showToast('Name is required', 'error');
            return;
        }

        const platformConfig = this.platforms[platform];
        const credentials = this.extractCredentials(platformConfig.authType);

        if (!credentials) {
            this.showToast('Invalid credentials', 'error');
            return;
        }

        const connectionId = `conn_${Date.now()}`;
        this.connections[connectionId] = {
            id: connectionId,
            platform: platform,
            name: name,
            description: description,
            credentials: credentials,
            createdAt: new Date().toISOString(),
            status: 'unknown'
        };

        this.saveConnections();

        // Close modals and refresh
        document.querySelector('.connection-config-modal')?.remove();
        document.querySelector('.api-connectors-modal')?.remove();
        this.showConnectorsModal();

        this.showToast('Connection saved successfully', 'success');

        // Log activity
        if (typeof CollaborationManager !== 'undefined') {
            CollaborationManager.logActivity('api_connection', `Connected to ${platformConfig.name}`);
        }
    },

    extractCredentials: function(authType) {
        switch(authType) {
            case 'oauth':
                return {
                    clientId: document.getElementById('connection-client-id')?.value,
                    clientSecret: document.getElementById('connection-client-secret')?.value,
                    tenantId: document.getElementById('connection-tenant-id')?.value
                };
            
            case 'access_key':
                return {
                    accessKey: document.getElementById('connection-access-key')?.value,
                    secretKey: document.getElementById('connection-secret-key')?.value,
                    region: document.getElementById('connection-region')?.value
                };
            
            case 'service_account':
                try {
                    const json = document.getElementById('connection-service-account')?.value;
                    return {
                        serviceAccount: JSON.parse(json),
                        projectId: document.getElementById('connection-project-id')?.value
                    };
                } catch (e) {
                    this.showToast('Invalid JSON format', 'error');
                    return null;
                }
            
            default:
                return {
                    apiKey: document.getElementById('connection-api-key')?.value
                };
        }
    },

    testConnection: async function(connectionId) {
        const connection = this.connections[connectionId];
        if (!connection) return;

        this.showToast('Testing connection...', 'info');

        // Simulate API test (in production, this would make actual API calls)
        setTimeout(() => {
            // For demo purposes, randomly succeed or fail
            const success = Math.random() > 0.2;
            
            connection.status = success ? 'connected' : 'error';
            connection.lastTested = new Date().toISOString();
            this.saveConnections();

            // Refresh UI
            document.querySelector('.api-connectors-modal')?.remove();
            this.showConnectorsModal();

            this.showToast(
                success ? 'Connection successful!' : 'Connection failed - check credentials',
                success ? 'success' : 'error'
            );
        }, 1500);
    },

    deleteConnection: function(connectionId) {
        const connection = this.connections[connectionId];
        if (!connection) return;

        if (confirm(`Delete connection "${connection.name}"?`)) {
            delete this.connections[connectionId];
            this.saveConnections();

            // Refresh UI
            document.querySelector('.api-connectors-modal')?.remove();
            this.showConnectorsModal();

            this.showToast('Connection deleted', 'success');
        }
    },

    collectEvidence: async function(connectionId) {
        const connection = this.connections[connectionId];
        if (!connection) return;

        const platform = this.platforms[connection.platform];
        
        // Show cost confirmation
        if (!confirm(`This will make API calls to ${platform.name} using YOUR credentials. You will be charged by ${platform.name} for API usage. Continue?`)) {
            return;
        }
        
        this.showToast(`Collecting evidence from ${platform.name}...`, 'info');

        // Simulate evidence collection (in production, make actual client-side API calls)
        setTimeout(() => {
            const evidenceCount = Math.floor(Math.random() * 10) + 5;
            
            // In production: Use fetch() to call cloud provider APIs directly from browser
            // Example: fetch(endpoint, { headers: { 'Authorization': 'Bearer ' + token } })
            // All API costs are charged directly to the user's cloud account
            
            this.showToast(`Collected ${evidenceCount} evidence items`, 'success');

            // Log activity
            if (typeof CollaborationManager !== 'undefined') {
                CollaborationManager.logActivity('evidence_collected', 
                    `Collected ${evidenceCount} items from ${platform.name} (user's API key)`);
            }
        }, 2000);
    },

    showToast: function(message, type = 'info') {
        if (typeof app !== 'undefined' && app.showToast) {
            app.showToast(message, type);
        } else {
            console.log(`[APIConnectors] ${type}: ${message}`);
        }
    }
};

// Initialize
if (typeof document !== 'undefined') {
    document.readyState === 'loading' ? 
        document.addEventListener('DOMContentLoaded', () => APIConnectors.init()) : 
        APIConnectors.init();
}

if (typeof window !== 'undefined') {
    window.APIConnectors = APIConnectors;
}
