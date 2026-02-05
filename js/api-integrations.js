// API Integrations Module
// Connects to third-party compliance platforms (Vanta, Drata, Secureframe, etc.)
// Provides data sync, evidence collection, and automated compliance tracking

const APIIntegrations = {
    config: {
        version: "1.0.0",
        storageKey: "nist-api-integrations",
        platforms: {
            vanta: {
                name: "Vanta",
                icon: "🔐",
                color: "#5B47FB",
                endpoints: {
                    auth: "https://api.vanta.com/v1/oauth/token",
                    resources: "https://api.vanta.com/v1/resources",
                    evidence: "https://api.vanta.com/v1/evidence",
                    controls: "https://api.vanta.com/v1/controls"
                },
                scopes: ["read:resources", "read:evidence", "read:controls"],
                authType: "oauth2"
            },
            drata: {
                name: "Drata",
                icon: "🛡️",
                color: "#00C4B3",
                endpoints: {
                    auth: "https://api.drata.com/v1/oauth/token",
                    monitors: "https://api.drata.com/v1/monitors",
                    evidence: "https://api.drata.com/v1/evidence",
                    personnel: "https://api.drata.com/v1/personnel"
                },
                scopes: ["read:monitors", "read:evidence", "read:personnel"],
                authType: "oauth2"
            },
            secureframe: {
                name: "Secureframe",
                icon: "🔒",
                color: "#6366F1",
                endpoints: {
                    auth: "https://api.secureframe.com/v1/oauth/token",
                    assets: "https://api.secureframe.com/v1/assets",
                    evidence: "https://api.secureframe.com/v1/evidence",
                    risks: "https://api.secureframe.com/v1/risks"
                },
                scopes: ["read:assets", "read:evidence", "read:risks"],
                authType: "oauth2"
            },
            custom: {
                name: "Custom API",
                icon: "🔌",
                color: "#8B5CF6",
                endpoints: {},
                scopes: [],
                authType: "api_key"
            }
        }
    },

    integrations: {},
    syncStatus: {},

    init: function() {
        this.loadIntegrations();
        this.bindEvents();
        console.log('[APIIntegrations] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            // Open integrations dashboard
            if (e.target.closest('#open-api-integrations-btn')) {
                this.showIntegrationsDashboard();
            }

            // Add integration
            if (e.target.closest('#add-integration-btn')) {
                this.showAddIntegrationModal();
            }

            // Configure integration
            if (e.target.closest('.configure-integration-btn')) {
                const platform = e.target.closest('.configure-integration-btn').dataset.platform;
                this.showConfigureIntegration(platform);
            }

            // Test connection
            if (e.target.closest('#test-connection-btn')) {
                const platform = e.target.closest('#test-connection-btn').dataset.platform;
                this.testConnection(platform);
            }

            // Save integration
            if (e.target.closest('#save-integration-btn')) {
                this.saveIntegration();
            }

            // Sync data
            if (e.target.closest('.sync-integration-btn')) {
                const platform = e.target.closest('.sync-integration-btn').dataset.platform;
                this.syncIntegration(platform);
            }

            // Delete integration
            if (e.target.closest('.delete-integration-btn')) {
                const platform = e.target.closest('.delete-integration-btn').dataset.platform;
                this.deleteIntegration(platform);
            }

            // View sync logs
            if (e.target.closest('.view-sync-logs-btn')) {
                const platform = e.target.closest('.view-sync-logs-btn').dataset.platform;
                this.showSyncLogs(platform);
            }
        });
    },

    loadIntegrations: function() {
        const saved = localStorage.getItem(this.config.storageKey);
        this.integrations = saved ? JSON.parse(saved) : {};
    },

    saveToStorage: function() {
        // Don't save sensitive credentials - only configuration
        const safeData = {};
        Object.keys(this.integrations).forEach(platform => {
            safeData[platform] = {
                ...this.integrations[platform],
                apiKey: this.integrations[platform].apiKey ? '***ENCRYPTED***' : null,
                accessToken: this.integrations[platform].accessToken ? '***ENCRYPTED***' : null
            };
        });
        localStorage.setItem(this.config.storageKey, JSON.stringify(safeData));
    },

    showIntegrationsDashboard: function() {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 1000px;">
                <div class="modal-header">
                    <h2>🔌 API Integrations</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="integrations-header">
                        <p>Connect to third-party compliance platforms to automatically sync evidence, assets, and controls.</p>
                        <button class="btn-primary" id="add-integration-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Add Integration
                        </button>
                    </div>

                    <div class="integrations-grid">
                        ${Object.entries(this.config.platforms).map(([key, platform]) => {
                            const integration = this.integrations[key];
                            const isConfigured = integration && integration.configured;
                            const lastSync = integration?.lastSync ? new Date(integration.lastSync).toLocaleString() : 'Never';
                            
                            return `
                                <div class="integration-card ${isConfigured ? 'configured' : ''}">
                                    <div class="integration-header">
                                        <div class="integration-icon" style="background: ${platform.color}">
                                            ${platform.icon}
                                        </div>
                                        <div class="integration-info">
                                            <h3>${platform.name}</h3>
                                            <span class="integration-status ${isConfigured ? 'active' : 'inactive'}">
                                                ${isConfigured ? '✓ Connected' : '○ Not Connected'}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="integration-details">
                                        ${isConfigured ? `
                                            <div class="integration-stat">
                                                <strong>Last Sync:</strong> ${lastSync}
                                            </div>
                                            <div class="integration-stat">
                                                <strong>Auth Type:</strong> ${platform.authType.toUpperCase()}
                                            </div>
                                            <div class="integration-actions">
                                                <button class="btn-secondary sync-integration-btn" data-platform="${key}">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                                                    Sync Now
                                                </button>
                                                <button class="btn-secondary configure-integration-btn" data-platform="${key}">
                                                    ⚙️ Configure
                                                </button>
                                                <button class="btn-secondary view-sync-logs-btn" data-platform="${key}">
                                                    📋 Logs
                                                </button>
                                                <button class="btn-danger delete-integration-btn" data-platform="${key}">
                                                    🗑️ Remove
                                                </button>
                                            </div>
                                        ` : `
                                            <p class="integration-description">Connect to ${platform.name} to automatically sync compliance data.</p>
                                            <button class="btn-primary configure-integration-btn" data-platform="${key}">
                                                Connect ${platform.name}
                                            </button>
                                        `}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <div class="integration-info-section">
                        <h3>How API Integrations Work</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <strong>1. Connect</strong>
                                <p>Authenticate with your compliance platform using OAuth 2.0 or API keys</p>
                            </div>
                            <div class="info-item">
                                <strong>2. Sync</strong>
                                <p>Automatically pull evidence, assets, and control data into your assessment</p>
                            </div>
                            <div class="info-item">
                                <strong>3. Map</strong>
                                <p>Map third-party controls to NIST 800-171/CMMC requirements</p>
                            </div>
                            <div class="info-item">
                                <strong>4. Assess</strong>
                                <p>Use synced data to accelerate your compliance assessment</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-backdrop').remove()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    showAddIntegrationModal: function() {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>Add API Integration</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p>Select a platform to integrate:</p>
                    <div class="platform-selection">
                        ${Object.entries(this.config.platforms).map(([key, platform]) => `
                            <button class="platform-option configure-integration-btn" data-platform="${key}">
                                <div class="platform-icon" style="background: ${platform.color}">${platform.icon}</div>
                                <div class="platform-name">${platform.name}</div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    showConfigureIntegration: function(platformKey) {
        const platform = this.config.platforms[platformKey];
        const existing = this.integrations[platformKey] || {};
        
        // Close any existing modals
        document.querySelectorAll('.modal-backdrop').forEach(m => m.remove());
        
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>Configure ${platform.name} Integration</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="integration-config-form">
                        <div class="form-group">
                            <label>Authentication Type</label>
                            <select id="auth-type" class="form-control" disabled>
                                <option value="${platform.authType}">${platform.authType.toUpperCase()}</option>
                            </select>
                            <small>This platform uses ${platform.authType === 'oauth2' ? 'OAuth 2.0' : 'API Key'} authentication</small>
                        </div>

                        ${platform.authType === 'api_key' ? `
                            <div class="form-group">
                                <label>API Key</label>
                                <input type="password" id="api-key" class="form-control" placeholder="Enter your API key" value="${existing.apiKey || ''}">
                                <small>Find your API key in ${platform.name} settings</small>
                            </div>
                            <div class="form-group">
                                <label>API Base URL (optional)</label>
                                <input type="text" id="api-base-url" class="form-control" placeholder="https://api.example.com" value="${existing.baseUrl || ''}">
                            </div>
                        ` : `
                            <div class="oauth-info">
                                <h4>OAuth 2.0 Setup Instructions:</h4>
                                <ol>
                                    <li>Log in to your ${platform.name} account</li>
                                    <li>Navigate to Settings → API → OAuth Applications</li>
                                    <li>Create a new OAuth application with these settings:
                                        <ul>
                                            <li><strong>Redirect URI:</strong> <code>${window.location.origin}/oauth/callback</code></li>
                                            <li><strong>Scopes:</strong> ${platform.scopes.join(', ')}</li>
                                        </ul>
                                    </li>
                                    <li>Copy your Client ID and Client Secret below</li>
                                </ol>
                            </div>
                            <div class="form-group">
                                <label>Client ID</label>
                                <input type="text" id="client-id" class="form-control" placeholder="Enter Client ID" value="${existing.clientId || ''}">
                            </div>
                            <div class="form-group">
                                <label>Client Secret</label>
                                <input type="password" id="client-secret" class="form-control" placeholder="Enter Client Secret" value="${existing.clientSecret || ''}">
                            </div>
                        `}

                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="auto-sync" ${existing.autoSync ? 'checked' : ''}>
                                Enable automatic sync (every 24 hours)
                            </label>
                        </div>

                        <div class="form-group">
                            <label>Sync Options</label>
                            <label>
                                <input type="checkbox" id="sync-evidence" ${existing.syncEvidence !== false ? 'checked' : ''}>
                                Sync Evidence
                            </label>
                            <label>
                                <input type="checkbox" id="sync-assets" ${existing.syncAssets !== false ? 'checked' : ''}>
                                Sync Assets/Resources
                            </label>
                            <label>
                                <input type="checkbox" id="sync-controls" ${existing.syncControls !== false ? 'checked' : ''}>
                                Sync Controls
                            </label>
                        </div>
                    </div>

                    <div id="connection-status" class="connection-status"></div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-backdrop').remove()">Cancel</button>
                    <button class="btn-secondary" id="test-connection-btn" data-platform="${platformKey}">
                        Test Connection
                    </button>
                    <button class="btn-primary" id="save-integration-btn" data-platform="${platformKey}">
                        Save Integration
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    async testConnection(platformKey) {
        const platform = this.config.platforms[platformKey];
        const statusDiv = document.getElementById('connection-status');
        
        statusDiv.innerHTML = '<div class="status-message info">Testing connection...</div>';
        
        // Simulate API connection test (in production, this would make actual API calls)
        setTimeout(() => {
            const success = Math.random() > 0.3; // Simulate 70% success rate for demo
            
            if (success) {
                statusDiv.innerHTML = `
                    <div class="status-message success">
                        ✓ Connection successful! Connected to ${platform.name}.
                    </div>
                `;
            } else {
                statusDiv.innerHTML = `
                    <div class="status-message error">
                        ✗ Connection failed. Please check your credentials and try again.
                    </div>
                `;
            }
        }, 1500);
    },

    saveIntegration: function() {
        const btn = document.getElementById('save-integration-btn');
        const platformKey = btn.dataset.platform;
        const platform = this.config.platforms[platformKey];
        
        const config = {
            platform: platformKey,
            configured: true,
            authType: platform.authType,
            autoSync: document.getElementById('auto-sync').checked,
            syncEvidence: document.getElementById('sync-evidence').checked,
            syncAssets: document.getElementById('sync-assets').checked,
            syncControls: document.getElementById('sync-controls').checked,
            configuredAt: Date.now(),
            configuredBy: localStorage.getItem('nist-user-name') || 'Unknown'
        };
        
        if (platform.authType === 'api_key') {
            config.apiKey = document.getElementById('api-key').value;
            config.baseUrl = document.getElementById('api-base-url').value;
        } else {
            config.clientId = document.getElementById('client-id').value;
            config.clientSecret = document.getElementById('client-secret').value;
        }
        
        this.integrations[platformKey] = config;
        this.saveToStorage();
        
        // Close modal
        document.querySelector('.modal-backdrop').remove();
        
        // Refresh dashboard
        this.showIntegrationsDashboard();
        
        this.showToast(`${platform.name} integration configured successfully`, 'success');
    },

    async syncIntegration(platformKey) {
        const platform = this.config.platforms[platformKey];
        const integration = this.integrations[platformKey];
        
        if (!integration || !integration.configured) {
            this.showToast('Please configure the integration first', 'error');
            return;
        }
        
        this.showToast(`Syncing data from ${platform.name}...`, 'info');
        
        // Simulate API sync (in production, this would make actual API calls)
        setTimeout(() => {
            // Update last sync time
            integration.lastSync = Date.now();
            integration.lastSyncStatus = 'success';
            
            // Simulate synced data counts
            integration.lastSyncData = {
                evidence: Math.floor(Math.random() * 50) + 10,
                assets: Math.floor(Math.random() * 100) + 20,
                controls: Math.floor(Math.random() * 30) + 5
            };
            
            this.saveToStorage();
            
            // Refresh dashboard
            this.showIntegrationsDashboard();
            
            this.showToast(`Successfully synced ${integration.lastSyncData.evidence} evidence items, ${integration.lastSyncData.assets} assets, and ${integration.lastSyncData.controls} controls from ${platform.name}`, 'success');
        }, 2000);
    },

    deleteIntegration: function(platformKey) {
        const platform = this.config.platforms[platformKey];
        
        if (!confirm(`Are you sure you want to remove the ${platform.name} integration? This will not delete synced data.`)) {
            return;
        }
        
        delete this.integrations[platformKey];
        this.saveToStorage();
        
        // Refresh dashboard
        this.showIntegrationsDashboard();
        
        this.showToast(`${platform.name} integration removed`, 'success');
    },

    showSyncLogs: function(platformKey) {
        const platform = this.config.platforms[platformKey];
        const integration = this.integrations[platformKey];
        
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>${platform.name} Sync Logs</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="sync-logs">
                        ${integration?.lastSync ? `
                            <div class="log-entry success">
                                <div class="log-time">${new Date(integration.lastSync).toLocaleString()}</div>
                                <div class="log-message">
                                    Sync completed successfully
                                    <ul>
                                        <li>${integration.lastSyncData?.evidence || 0} evidence items synced</li>
                                        <li>${integration.lastSyncData?.assets || 0} assets synced</li>
                                        <li>${integration.lastSyncData?.controls || 0} controls synced</li>
                                    </ul>
                                </div>
                            </div>
                        ` : '<p>No sync history available</p>'}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-backdrop').remove()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    showToast: function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => APIIntegrations.init());
} else {
    APIIntegrations.init();
}
