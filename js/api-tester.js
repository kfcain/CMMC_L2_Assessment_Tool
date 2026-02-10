// API Tester Component
// Built-in API request builder and tester for evidence collection

const APITester = {
    config: {
        name: "API Evidence Tester",
        version: "1.0.0"
    },

    state: {
        isOpen: false,
        activeTab: 'builder',
        requestHistory: [],
        savedRequests: [],
        currentRequest: {
            method: 'GET',
            url: '',
            headers: [],
            body: '',
            authType: 'none',
            authConfig: {}
        },
        response: null,
        isLoading: false
    },

    // Initialize the API Tester
    init: function() {
        this.loadState();
        this.bindGlobalEvents();
    },

    // Load saved state from localStorage
    loadState: function() {
        try {
            const saved = localStorage.getItem('apiTesterState');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.state.requestHistory = parsed.requestHistory || [];
                this.state.savedRequests = parsed.savedRequests || [];
            }
        } catch (e) {
            console.warn('Failed to load API tester state:', e);
        }
    },

    // Save state to localStorage
    saveState: function() {
        try {
            localStorage.setItem('apiTesterState', JSON.stringify({
                requestHistory: this.state.requestHistory.slice(-50), // Keep last 50
                savedRequests: this.state.savedRequests
            }));
        } catch (e) {
            console.warn('Failed to save API tester state:', e);
        }
    },

    // Bind global keyboard shortcuts
    bindGlobalEvents: function() {
        // FAB button (inline onclick blocked by CSP)
        const fabBtn = document.getElementById('api-tester-fab-btn');
        if (fabBtn) {
            fabBtn.addEventListener('click', () => this.toggle());
        }

        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + A to open API Tester
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                this.toggle();
            }
            // Escape to close
            if (e.key === 'Escape' && this.state.isOpen) {
                this.close();
            }
        });
    },

    // Toggle API Tester panel
    toggle: function() {
        if (this.state.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    // Open API Tester
    open: function() {
        this.state.isOpen = true;
        this.render();
        document.body.classList.add('api-tester-open');
    },

    // Close API Tester
    close: function() {
        this.state.isOpen = false;
        const container = document.getElementById('api-tester-container');
        if (container) {
            container.remove();
        }
        document.body.classList.remove('api-tester-open');
    },

    // Main render function
    render: function() {
        let container = document.getElementById('api-tester-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'api-tester-container';
            container.className = 'api-tester-container';
            document.body.appendChild(container);
        }

        container.innerHTML = `
            <div class="api-tester-panel">
                <div class="api-tester-header">
                    <div class="api-tester-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                        </svg>
                        <span>API Evidence Tester</span>
                    </div>
                    <div class="api-tester-tabs">
                        <button class="api-tab ${this.state.activeTab === 'builder' ? 'active' : ''}" data-tab="builder">Builder</button>
                        <button class="api-tab ${this.state.activeTab === 'templates' ? 'active' : ''}" data-tab="templates">Templates</button>
                        <button class="api-tab ${this.state.activeTab === 'history' ? 'active' : ''}" data-tab="history">History</button>
                        <button class="api-tab ${this.state.activeTab === 'saved' ? 'active' : ''}" data-tab="saved">Saved</button>
                    </div>
                    <button class="api-tester-close" data-action="api-close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="api-tester-content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;

        this.bindEvents();
    },

    // Render content based on active tab
    renderTabContent: function() {
        switch (this.state.activeTab) {
            case 'builder':
                return this.renderBuilder();
            case 'templates':
                return this.renderTemplates();
            case 'history':
                return this.renderHistory();
            case 'saved':
                return this.renderSaved();
            default:
                return this.renderBuilder();
        }
    },

    // Render the request builder
    renderBuilder: function() {
        const req = this.state.currentRequest;
        const headersHtml = req.headers.map((h, i) => `
            <div class="header-row" data-index="${i}">
                <input type="text" class="header-key" placeholder="Header name" value="${this.escapeHtml(h.key || '')}">
                <input type="text" class="header-value" placeholder="Value" value="${this.escapeHtml(h.value || '')}">
                <button class="remove-header" data-index="${i}">×</button>
            </div>
        `).join('');

        return `
            <div class="api-builder">
                <div class="request-section">
                    <div class="request-line">
                        <select class="method-select" id="api-method">
                            <option value="GET" ${req.method === 'GET' ? 'selected' : ''}>GET</option>
                            <option value="POST" ${req.method === 'POST' ? 'selected' : ''}>POST</option>
                            <option value="PUT" ${req.method === 'PUT' ? 'selected' : ''}>PUT</option>
                            <option value="PATCH" ${req.method === 'PATCH' ? 'selected' : ''}>PATCH</option>
                            <option value="DELETE" ${req.method === 'DELETE' ? 'selected' : ''}>DELETE</option>
                        </select>
                        <input type="text" class="url-input" id="api-url" placeholder="Enter request URL (e.g., https://graph.microsoft.us/v1.0/users)" value="${this.escapeHtml(req.url)}">
                        <button class="send-btn" id="send-request" ${this.state.isLoading ? 'disabled' : ''}>
                            ${this.state.isLoading ? 'Sending...' : 'Send'}
                        </button>
                    </div>

                    <div class="request-config">
                        <div class="config-tabs">
                            <button class="config-tab active" data-config="auth">Authorization</button>
                            <button class="config-tab" data-config="headers">Headers</button>
                            <button class="config-tab" data-config="body">Body</button>
                        </div>

                        <div class="config-content" id="config-auth">
                            <div class="auth-type-select">
                                <label>Auth Type:</label>
                                <select id="auth-type">
                                    <option value="none" ${req.authType === 'none' ? 'selected' : ''}>No Auth</option>
                                    <option value="bearer" ${req.authType === 'bearer' ? 'selected' : ''}>Bearer Token</option>
                                    <option value="basic" ${req.authType === 'basic' ? 'selected' : ''}>Basic Auth</option>
                                    <option value="apikey" ${req.authType === 'apikey' ? 'selected' : ''}>API Key</option>
                                    <option value="oauth2" ${req.authType === 'oauth2' ? 'selected' : ''}>OAuth 2.0</option>
                                </select>
                            </div>
                            <div class="auth-config" id="auth-config-fields">
                                ${this.renderAuthConfig(req.authType, req.authConfig)}
                            </div>
                        </div>

                        <div class="config-content hidden" id="config-headers">
                            <div class="headers-list">
                                ${headersHtml}
                            </div>
                            <button class="add-header-btn" id="add-header">+ Add Header</button>
                        </div>

                        <div class="config-content hidden" id="config-body">
                            <div class="body-type-select">
                                <label>Content Type:</label>
                                <select id="body-type">
                                    <option value="json">JSON</option>
                                    <option value="form">Form URL Encoded</option>
                                    <option value="text">Raw Text</option>
                                </select>
                            </div>
                            <textarea class="body-input" id="api-body" placeholder='{"key": "value"}'>${this.escapeHtml(req.body)}</textarea>
                        </div>
                    </div>

                    <div class="request-actions">
                        <button class="action-btn" id="save-request">💾 Save Request</button>
                        <button class="action-btn" id="copy-curl">📋 Copy as cURL</button>
                        <button class="action-btn" id="clear-request">🗑️ Clear</button>
                    </div>
                </div>

                <div class="response-section">
                    <div class="response-header">
                        <span>Response</span>
                        ${this.state.response ? `
                            <span class="response-status ${this.getStatusClass(this.state.response.status)}">
                                ${this.state.response.status} ${this.state.response.statusText}
                            </span>
                            <span class="response-time">${this.state.response.time}ms</span>
                        ` : ''}
                    </div>
                    <div class="response-body">
                        ${this.state.response ? `
                            <div class="response-tabs">
                                <button class="resp-tab active" data-resp="body">Body</button>
                                <button class="resp-tab" data-resp="headers">Headers</button>
                            </div>
                            <div class="response-content" id="response-body-content">
                                <pre><code>${this.formatResponse(this.state.response.body)}</code></pre>
                            </div>
                            <div class="response-content hidden" id="response-headers-content">
                                <pre><code>${this.formatHeaders(this.state.response.headers)}</code></pre>
                            </div>
                            <div class="response-actions">
                                <button class="action-btn" data-action="api-copy-response">📋 Copy Response</button>
                                <button class="action-btn" data-action="api-download-response">⬇️ Download JSON</button>
                                <button class="action-btn" data-action="api-map-evidence">📎 Map to Evidence</button>
                            </div>
                        ` : `
                            <div class="no-response">
                                <p>Send a request to see the response</p>
                                <p class="hint">💡 Use templates for pre-configured API calls</p>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    },

    // Render auth configuration fields based on type
    renderAuthConfig: function(authType, config) {
        switch (authType) {
            case 'bearer':
                return `
                    <div class="auth-field">
                        <label>Token:</label>
                        <input type="password" id="auth-token" placeholder="Enter bearer token" value="${this.escapeHtml(config.token || '')}">
                        <button class="toggle-visibility" data-action="api-toggle-visibility" data-param="auth-token">👁️</button>
                    </div>
                `;
            case 'basic':
                return `
                    <div class="auth-field">
                        <label>Username:</label>
                        <input type="text" id="auth-username" placeholder="Username" value="${this.escapeHtml(config.username || '')}">
                    </div>
                    <div class="auth-field">
                        <label>Password:</label>
                        <input type="password" id="auth-password" placeholder="Password" value="${this.escapeHtml(config.password || '')}">
                        <button class="toggle-visibility" data-action="api-toggle-visibility" data-param="auth-password">👁️</button>
                    </div>
                `;
            case 'apikey':
                return `
                    <div class="auth-field">
                        <label>Header Name:</label>
                        <input type="text" id="auth-header-name" placeholder="X-API-Key" value="${this.escapeHtml(config.headerName || 'X-API-Key')}">
                    </div>
                    <div class="auth-field">
                        <label>API Key:</label>
                        <input type="password" id="auth-apikey" placeholder="Enter API key" value="${this.escapeHtml(config.apiKey || '')}">
                        <button class="toggle-visibility" data-action="api-toggle-visibility" data-param="auth-apikey">👁️</button>
                    </div>
                `;
            case 'oauth2':
                return `
                    <div class="oauth2-info">
                        <p>OAuth 2.0 requires a multi-step flow. Use the token generator below:</p>
                    </div>
                    <div class="auth-field">
                        <label>Token Endpoint:</label>
                        <input type="text" id="oauth-token-url" placeholder="https://login.microsoftonline.us/{tenant}/oauth2/v2.0/token" value="${this.escapeHtml(config.tokenUrl || '')}">
                    </div>
                    <div class="auth-field">
                        <label>Client ID:</label>
                        <input type="text" id="oauth-client-id" placeholder="Client ID" value="${this.escapeHtml(config.clientId || '')}">
                    </div>
                    <div class="auth-field">
                        <label>Client Secret:</label>
                        <input type="password" id="oauth-client-secret" placeholder="Client Secret" value="${this.escapeHtml(config.clientSecret || '')}">
                        <button class="toggle-visibility" data-action="api-toggle-visibility" data-param="oauth-client-secret">👁️</button>
                    </div>
                    <div class="auth-field">
                        <label>Scope:</label>
                        <input type="text" id="oauth-scope" placeholder="https://graph.microsoft.us/.default" value="${this.escapeHtml(config.scope || '')}">
                    </div>
                    <button class="get-token-btn" data-action="api-get-oauth-token">🔑 Get Token</button>
                    <div class="auth-field">
                        <label>Access Token:</label>
                        <textarea id="oauth-access-token" placeholder="Token will appear here..." readonly>${this.escapeHtml(config.accessToken || '')}</textarea>
                    </div>
                `;
            default:
                return '<p class="auth-none-msg">No authentication required</p>';
        }
    },

    // Render API templates from the evidence collection data
    renderTemplates: function() {
        const data = window.API_EVIDENCE_COLLECTION;
        if (!data) {
            return '<div class="no-templates"><p>API evidence collection data not loaded</p></div>';
        }

        let html = '<div class="templates-container">';

        // Microsoft Graph templates
        if (data.microsoftGraph) {
            html += this.renderTemplateSection('Microsoft Graph API', 'microsoft', data.microsoftGraph);
        }

        // Azure ARM templates
        if (data.azureResourceManager) {
            html += this.renderTemplateSection('Azure Resource Manager', 'azure', data.azureResourceManager);
        }

        // AWS templates
        if (data.aws) {
            html += this.renderTemplateSection('AWS APIs', 'aws', data.aws);
        }

        // GCP templates
        if (data.gcp) {
            html += this.renderTemplateSection('Google Cloud APIs', 'gcp', data.gcp);
        }

        // SaaS templates
        if (data.saasIntegrations) {
            html += this.renderSaaSTemplates(data.saasIntegrations);
        }

        html += '</div>';
        return html;
    },

    // Render a template section
    renderTemplateSection: function(title, provider, data) {
        let html = `
            <div class="template-section">
                <h3 class="template-section-title">${title}</h3>
                <div class="template-section-content">
        `;

        const endpoints = data.endpoints || data.services || [];
        endpoints.forEach(category => {
            const items = category.endpoints || category.endpoints || [];
            if (items && items.length > 0) {
                html += `
                    <div class="template-category">
                        <h4>${category.category || category.service}</h4>
                        <div class="template-list">
                `;
                items.forEach(endpoint => {
                    const controls = endpoint.cmmcControls || category.cmmcControls || [];
                    html += `
                        <div class="template-item" data-provider="${provider}" data-endpoint='${JSON.stringify(endpoint).replace(/'/g, "\\'")}'>
                            <div class="template-item-header">
                                <span class="template-method ${(endpoint.method || 'GET').toLowerCase()}">${endpoint.method || 'CLI'}</span>
                                <span class="template-name">${endpoint.name}</span>
                            </div>
                            <p class="template-desc">${endpoint.description || ''}</p>
                            <div class="template-meta">
                                ${endpoint.evidenceType ? `<span class="evidence-type">📋 ${endpoint.evidenceType}</span>` : ''}
                                ${controls.length > 0 ? `<span class="cmmc-controls">🎯 ${controls.join(', ')}</span>` : ''}
                            </div>
                            <button class="use-template-btn" data-action="api-use-template">Use Template</button>
                        </div>
                    `;
                });
                html += '</div></div>';
            }
        });

        html += '</div></div>';
        return html;
    },

    // Render SaaS platform templates
    renderSaaSTemplates: function(data) {
        let html = `
            <div class="template-section">
                <h3 class="template-section-title">SaaS Platforms</h3>
                <div class="template-section-content">
        `;

        data.platforms.forEach(platform => {
            html += `
                <div class="template-category">
                    <h4>${platform.name} <span class="platform-category">${platform.category}</span></h4>
                    <p class="platform-docs"><a href="${platform.apiDocs}" target="_blank" rel="noopener noreferrer">📖 API Documentation</a></p>
                    <div class="template-list">
            `;
            platform.endpoints.forEach(endpoint => {
                const controls = endpoint.cmmcControls || platform.cmmcControls || [];
                html += `
                    <div class="template-item" data-provider="saas" data-platform="${platform.name}" data-base-url="${platform.baseUrl}" data-endpoint='${JSON.stringify(endpoint).replace(/'/g, "\\'")}'>
                        <div class="template-item-header">
                            <span class="template-method ${(endpoint.method || 'GET').toLowerCase()}">${endpoint.method || 'GET'}</span>
                            <span class="template-name">${endpoint.name}</span>
                        </div>
                        <p class="template-desc">${endpoint.description || ''}</p>
                        <div class="template-meta">
                            ${endpoint.evidenceType ? `<span class="evidence-type">📋 ${endpoint.evidenceType}</span>` : ''}
                            ${controls.length > 0 ? `<span class="cmmc-controls">🎯 ${controls.join(', ')}</span>` : ''}
                        </div>
                        <button class="use-template-btn" data-action="api-use-template">Use Template</button>
                    </div>
                `;
            });
            html += '</div></div>';
        });

        html += '</div></div>';
        return html;
    },

    // Render request history
    renderHistory: function() {
        if (this.state.requestHistory.length === 0) {
            return `
                <div class="empty-state">
                    <p>No request history yet</p>
                    <p class="hint">Your requests will appear here after you send them</p>
                </div>
            `;
        }

        let html = '<div class="history-list">';
        this.state.requestHistory.slice().reverse().forEach((req, i) => {
            const statusClass = this.getStatusClass(req.response?.status);
            html += `
                <div class="history-item" data-index="${this.state.requestHistory.length - 1 - i}">
                    <div class="history-item-header">
                        <span class="history-method ${req.method.toLowerCase()}">${req.method}</span>
                        <span class="history-url">${this.truncate(req.url, 60)}</span>
                        <span class="history-status ${statusClass}">${req.response?.status || 'Error'}</span>
                    </div>
                    <div class="history-meta">
                        <span class="history-time">${this.formatDate(req.timestamp)}</span>
                        ${req.response?.time ? `<span class="history-duration">${req.response.time}ms</span>` : ''}
                    </div>
                    <div class="history-actions">
                        <button data-action="api-load-history" data-param="${this.state.requestHistory.length - 1 - i}">Load</button>
                        <button data-action="api-remove-history" data-param="${this.state.requestHistory.length - 1 - i}">Remove</button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        return html;
    },

    // Render saved requests
    renderSaved: function() {
        if (this.state.savedRequests.length === 0) {
            return `
                <div class="empty-state">
                    <p>No saved requests</p>
                    <p class="hint">Save frequently used requests for quick access</p>
                </div>
            `;
        }

        let html = '<div class="saved-list">';
        this.state.savedRequests.forEach((req, i) => {
            html += `
                <div class="saved-item" data-index="${i}">
                    <div class="saved-item-header">
                        <span class="saved-name">${this.escapeHtml(req.name)}</span>
                        <span class="saved-method ${req.method.toLowerCase()}">${req.method}</span>
                    </div>
                    <p class="saved-url">${this.truncate(req.url, 70)}</p>
                    ${req.description ? `<p class="saved-desc">${this.escapeHtml(req.description)}</p>` : ''}
                    <div class="saved-actions">
                        <button data-action="api-load-saved" data-param="${i}">Load</button>
                        <button data-action="api-delete-saved" data-param="${i}">Delete</button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        return html;
    },

    // Bind event listeners
    bindEvents: function() {
        const container = document.getElementById('api-tester-container');
        if (!container) return;

        // Tab switching
        container.querySelectorAll('.api-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.state.activeTab = tab.dataset.tab;
                this.render();
            });
        });

        // Config tab switching
        container.querySelectorAll('.config-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                container.querySelectorAll('.config-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                container.querySelectorAll('.config-content').forEach(c => c.classList.add('hidden'));
                document.getElementById(`config-${tab.dataset.config}`).classList.remove('hidden');
            });
        });

        // Response tab switching
        container.querySelectorAll('.resp-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                container.querySelectorAll('.resp-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                container.querySelectorAll('.response-content').forEach(c => c.classList.add('hidden'));
                document.getElementById(`response-${tab.dataset.resp}-content`).classList.remove('hidden');
            });
        });

        // Send request button
        const sendBtn = document.getElementById('send-request');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendRequest());
        }

        // Add header button
        const addHeaderBtn = document.getElementById('add-header');
        if (addHeaderBtn) {
            addHeaderBtn.addEventListener('click', () => {
                this.state.currentRequest.headers.push({ key: '', value: '' });
                this.render();
            });
        }

        // Remove header buttons
        container.querySelectorAll('.remove-header').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                this.state.currentRequest.headers.splice(index, 1);
                this.render();
            });
        });

        // Auth type change
        const authTypeSelect = document.getElementById('auth-type');
        if (authTypeSelect) {
            authTypeSelect.addEventListener('change', () => {
                this.state.currentRequest.authType = authTypeSelect.value;
                this.state.currentRequest.authConfig = {};
                this.render();
            });
        }

        // Save request button
        const saveBtn = document.getElementById('save-request');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCurrentRequest());
        }

        // Copy cURL button
        const curlBtn = document.getElementById('copy-curl');
        if (curlBtn) {
            curlBtn.addEventListener('click', () => this.copyAsCurl());
        }

        // Clear button
        const clearBtn = document.getElementById('clear-request');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearRequest());
        }

        // Update state on input changes
        const urlInput = document.getElementById('api-url');
        if (urlInput) {
            urlInput.addEventListener('input', () => {
                this.state.currentRequest.url = urlInput.value;
            });
        }

        const methodSelect = document.getElementById('api-method');
        if (methodSelect) {
            methodSelect.addEventListener('change', () => {
                this.state.currentRequest.method = methodSelect.value;
            });
        }

        const bodyInput = document.getElementById('api-body');
        if (bodyInput) {
            bodyInput.addEventListener('input', () => {
                this.state.currentRequest.body = bodyInput.value;
            });
        }

        // Header inputs
        container.querySelectorAll('.header-key, .header-value').forEach(input => {
            input.addEventListener('input', () => {
                const row = input.closest('.header-row');
                const index = parseInt(row.dataset.index);
                const key = row.querySelector('.header-key').value;
                const value = row.querySelector('.header-value').value;
                this.state.currentRequest.headers[index] = { key, value };
            });
        });
    },

    // Send the API request
    sendRequest: async function() {
        this.updateAuthConfig();
        const req = this.state.currentRequest;

        if (!req.url) {
            this.showNotification('Please enter a URL', 'error');
            return;
        }

        this.state.isLoading = true;
        this.render();

        const startTime = Date.now();

        try {
            const headers = {};

            // Add custom headers
            req.headers.forEach(h => {
                if (h.key && h.value) {
                    headers[h.key] = h.value;
                }
            });

            // Add auth headers
            this.addAuthHeaders(headers);

            const options = {
                method: req.method,
                headers: headers,
                mode: 'cors'
            };

            // Add body for non-GET requests
            if (req.method !== 'GET' && req.body) {
                options.body = req.body;
                if (!headers['Content-Type']) {
                    headers['Content-Type'] = 'application/json';
                }
            }

            const response = await fetch(req.url, options);
            const endTime = Date.now();

            let body;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                body = await response.json();
            } else {
                body = await response.text();
            }

            const responseHeaders = {};
            response.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });

            this.state.response = {
                status: response.status,
                statusText: response.statusText,
                headers: responseHeaders,
                body: body,
                time: endTime - startTime
            };

            // Add to history
            this.state.requestHistory.push({
                method: req.method,
                url: req.url,
                headers: req.headers,
                body: req.body,
                authType: req.authType,
                timestamp: new Date().toISOString(),
                response: {
                    status: response.status,
                    time: endTime - startTime
                }
            });

            this.saveState();

        } catch (error) {
            this.state.response = {
                status: 0,
                statusText: 'Network Error',
                headers: {},
                body: { error: error.message, hint: 'This may be due to CORS restrictions. Try using a proxy or testing from a server-side script.' },
                time: Date.now() - startTime
            };
        }

        this.state.isLoading = false;
        this.render();
    },

    // Update auth config from form inputs
    updateAuthConfig: function() {
        const authType = this.state.currentRequest.authType;
        const config = {};

        switch (authType) {
            case 'bearer':
                config.token = document.getElementById('auth-token')?.value || '';
                break;
            case 'basic':
                config.username = document.getElementById('auth-username')?.value || '';
                config.password = document.getElementById('auth-password')?.value || '';
                break;
            case 'apikey':
                config.headerName = document.getElementById('auth-header-name')?.value || 'X-API-Key';
                config.apiKey = document.getElementById('auth-apikey')?.value || '';
                break;
            case 'oauth2':
                config.tokenUrl = document.getElementById('oauth-token-url')?.value || '';
                config.clientId = document.getElementById('oauth-client-id')?.value || '';
                config.clientSecret = document.getElementById('oauth-client-secret')?.value || '';
                config.scope = document.getElementById('oauth-scope')?.value || '';
                config.accessToken = document.getElementById('oauth-access-token')?.value || '';
                break;
        }

        this.state.currentRequest.authConfig = config;
    },

    // Add authentication headers
    addAuthHeaders: function(headers) {
        const authType = this.state.currentRequest.authType;
        const config = this.state.currentRequest.authConfig;

        switch (authType) {
            case 'bearer':
                if (config.token) {
                    headers['Authorization'] = `Bearer ${config.token}`;
                }
                break;
            case 'basic':
                if (config.username && config.password) {
                    const encoded = btoa(`${config.username}:${config.password}`);
                    headers['Authorization'] = `Basic ${encoded}`;
                }
                break;
            case 'apikey':
                if (config.apiKey) {
                    headers[config.headerName || 'X-API-Key'] = config.apiKey;
                }
                break;
            case 'oauth2':
                if (config.accessToken) {
                    headers['Authorization'] = `Bearer ${config.accessToken}`;
                }
                break;
        }
    },

    // Get OAuth token
    getOAuthToken: async function() {
        this.updateAuthConfig();
        const config = this.state.currentRequest.authConfig;

        if (!config.tokenUrl || !config.clientId || !config.clientSecret) {
            this.showNotification('Please fill in all OAuth 2.0 fields', 'error');
            return;
        }

        try {
            const body = new URLSearchParams({
                client_id: config.clientId,
                client_secret: config.clientSecret,
                scope: config.scope || '',
                grant_type: 'client_credentials'
            });

            const response = await fetch(config.tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body
            });

            const data = await response.json();

            if (data.access_token) {
                document.getElementById('oauth-access-token').value = data.access_token;
                this.state.currentRequest.authConfig.accessToken = data.access_token;
                this.showNotification('Token obtained successfully!', 'success');
            } else {
                this.showNotification('Failed to get token: ' + (data.error_description || data.error), 'error');
            }
        } catch (error) {
            this.showNotification('OAuth error: ' + error.message, 'error');
        }
    },

    // Use a template
    useTemplate: function(element) {
        const endpointData = JSON.parse(element.dataset.endpoint);
        const provider = element.dataset.provider;
        const baseUrl = element.dataset.baseUrl;

        let url = '';
        if (endpointData.endpoint) {
            if (provider === 'microsoft') {
                url = `https://graph.microsoft.us${endpointData.endpoint}`;
            } else if (provider === 'azure') {
                url = `https://management.usgovcloudapi.net${endpointData.endpoint}`;
            } else if (provider === 'saas' && baseUrl) {
                url = `${baseUrl}${endpointData.endpoint}`;
            } else {
                url = endpointData.endpoint;
            }
        }

        if (endpointData.sampleRequest) {
            // Extract URL from sample request if it looks like a full URL
            const match = endpointData.sampleRequest.match(/(GET|POST|PUT|DELETE|PATCH)\s+(https?:\/\/[^\s]+)/);
            if (match) {
                url = match[2];
            }
        }

        this.state.currentRequest = {
            method: endpointData.method || 'GET',
            url: url,
            headers: [],
            body: endpointData.samplePayload || '',
            authType: 'bearer',
            authConfig: {}
        };

        this.state.activeTab = 'builder';
        this.render();
        this.showNotification(`Template loaded: ${endpointData.name}`, 'success');
    },

    // Load from history
    loadFromHistory: function(index) {
        const req = this.state.requestHistory[index];
        if (req) {
            this.state.currentRequest = {
                method: req.method,
                url: req.url,
                headers: req.headers || [],
                body: req.body || '',
                authType: req.authType || 'none',
                authConfig: {}
            };
            this.state.activeTab = 'builder';
            this.render();
        }
    },

    // Remove from history
    removeFromHistory: function(index) {
        this.state.requestHistory.splice(index, 1);
        this.saveState();
        this.render();
    },

    // Save current request
    saveCurrentRequest: function() {
        this.updateAuthConfig();
        const req = this.state.currentRequest;

        const name = prompt('Enter a name for this request:', 'My API Request');
        if (!name) return;

        this.state.savedRequests.push({
            name: name,
            method: req.method,
            url: req.url,
            headers: req.headers,
            body: req.body,
            authType: req.authType,
            timestamp: new Date().toISOString()
        });

        this.saveState();
        this.showNotification('Request saved!', 'success');
    },

    // Load saved request
    loadSavedRequest: function(index) {
        const req = this.state.savedRequests[index];
        if (req) {
            this.state.currentRequest = {
                method: req.method,
                url: req.url,
                headers: req.headers || [],
                body: req.body || '',
                authType: req.authType || 'none',
                authConfig: {}
            };
            this.state.activeTab = 'builder';
            this.render();
        }
    },

    // Delete saved request
    deleteSavedRequest: function(index) {
        if (confirm('Delete this saved request?')) {
            this.state.savedRequests.splice(index, 1);
            this.saveState();
            this.render();
        }
    },

    // Copy response
    copyResponse: function() {
        if (this.state.response) {
            const text = typeof this.state.response.body === 'object'
                ? JSON.stringify(this.state.response.body, null, 2)
                : this.state.response.body;
            navigator.clipboard.writeText(text);
            this.showNotification('Response copied to clipboard', 'success');
        }
    },

    // Download response as JSON
    downloadResponse: function() {
        if (this.state.response) {
            const text = typeof this.state.response.body === 'object'
                ? JSON.stringify(this.state.response.body, null, 2)
                : this.state.response.body;
            const blob = new Blob([text], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `api-response-${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    },

    // Map response to evidence (placeholder for future integration)
    mapToEvidence: function() {
        this.showNotification('Evidence mapping feature coming soon!', 'info');
    },

    // Copy as cURL
    copyAsCurl: function() {
        this.updateAuthConfig();
        const req = this.state.currentRequest;
        let curl = `curl -X ${req.method} '${req.url}'`;

        // Add headers
        req.headers.forEach(h => {
            if (h.key && h.value) {
                curl += ` \\\n  -H '${h.key}: ${h.value}'`;
            }
        });

        // Add auth
        const authType = req.authType;
        const config = req.authConfig;
        if (authType === 'bearer' && config.token) {
            curl += ` \\\n  -H 'Authorization: Bearer ${config.token}'`;
        } else if (authType === 'basic' && config.username) {
            curl += ` \\\n  -u '${config.username}:${config.password}'`;
        } else if (authType === 'apikey' && config.apiKey) {
            curl += ` \\\n  -H '${config.headerName || 'X-API-Key'}: ${config.apiKey}'`;
        }

        // Add body
        if (req.method !== 'GET' && req.body) {
            curl += ` \\\n  -d '${req.body.replace(/'/g, "\\'")}'`;
        }

        navigator.clipboard.writeText(curl);
        this.showNotification('cURL command copied to clipboard', 'success');
    },

    // Clear request
    clearRequest: function() {
        this.state.currentRequest = {
            method: 'GET',
            url: '',
            headers: [],
            body: '',
            authType: 'none',
            authConfig: {}
        };
        this.state.response = null;
        this.render();
    },

    // Toggle password visibility
    toggleVisibility: function(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
        }
    },

    // Utility functions
    escapeHtml: function(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    formatResponse: function(body) {
        if (typeof body === 'object') {
            return this.escapeHtml(JSON.stringify(body, null, 2));
        }
        return this.escapeHtml(body);
    },

    formatHeaders: function(headers) {
        return Object.entries(headers)
            .map(([k, v]) => `${k}: ${v}`)
            .join('\n');
    },

    getStatusClass: function(status) {
        if (!status) return 'error';
        if (status >= 200 && status < 300) return 'success';
        if (status >= 300 && status < 400) return 'redirect';
        if (status >= 400 && status < 500) return 'client-error';
        return 'server-error';
    },

    truncate: function(str, len) {
        if (!str) return '';
        return str.length > len ? str.substring(0, len) + '...' : str;
    },

    formatDate: function(isoString) {
        const date = new Date(isoString);
        return date.toLocaleString();
    },

    showNotification: function(message, type) {
        const notification = document.createElement('div');
        notification.className = `api-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => APITester.init());
} else {
    APITester.init();
}

// Export
if (typeof window !== 'undefined') window.APITester = APITester;
