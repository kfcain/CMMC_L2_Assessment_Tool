// Settings Page - Site-wide preferences, AI providers, integrations, theme, storage
// Inspired by myctrl.tools/preferences

const SettingsPage = {

    // Provider logos as inline SVGs for professional appearance
    logos: {
        anthropic: '<svg viewBox="0 0 24 24" width="28" height="28"><path d="M17.304 3.541h-3.48l6.157 16.918h3.48L17.304 3.541zm-10.609 0L.539 20.459H4.02l1.27-3.592h6.46l1.27 3.592h3.48L10.344 3.541H6.695zm.703 10.592l2.026-5.734 2.026 5.734H7.398z" fill="currentColor"/></svg>',
        openai: '<svg viewBox="0 0 24 24" width="28" height="28"><path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0011.708.2a6.046 6.046 0 00-5.764 4.162 5.998 5.998 0 00-3.997 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.26 23.8a6.046 6.046 0 005.764-4.162 5.998 5.998 0 003.997-2.9 6.046 6.046 0 00-.738-6.917zM13.26 22.43a4.476 4.476 0 01-2.876-1.04l.143-.08 4.779-2.758a.795.795 0 00.392-.681v-6.737l2.02 1.168a.071.071 0 01.038.052v5.583a4.504 4.504 0 01-4.496 4.494zM3.6 18.304a4.47 4.47 0 01-.535-3.014l.143.085 4.783 2.767a.77.77 0 00.78 0l5.843-3.369v2.332a.08.08 0 01-.033.062L9.74 19.95a4.5 4.5 0 01-6.14-1.646zM2.34 7.896a4.485 4.485 0 012.366-1.973V11.6a.766.766 0 00.388.676l5.815 3.355-2.02 1.168a.076.076 0 01-.071 0l-4.83-2.786A4.504 4.504 0 012.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 01.071 0l4.83 2.791a4.494 4.494 0 01-.676 8.105v-5.678a.79.79 0 00-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 00-.785 0L9.409 9.23V6.897a.066.066 0 01.028-.061l4.83-2.787a4.5 4.5 0 016.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 01-.038-.057V6.075a4.5 4.5 0 017.375-3.453l-.142.08L8.704 5.46a.795.795 0 00-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="currentColor"/></svg>',
        google: '<svg viewBox="0 0 24 24" width="28" height="28"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor"/></svg>',
        entra: '<svg viewBox="0 0 24 24" width="28" height="28"><path d="M5.483 21.3H1.2L8.3 2.7h4.3l2.133 5.7-4.6 12.9zm6.85 0h4.1L21.6 8.4h-4.1z" fill="#00a4ef"/></svg>',
        knowbe4: '<svg viewBox="0 0 24 24" width="28" height="28"><rect width="24" height="24" rx="4" fill="#E8451C" opacity="0.15"/><text x="12" y="16" text-anchor="middle" font-size="10" font-weight="700" fill="#E8451C">K4</text></svg>',
        tenable: '<svg viewBox="0 0 24 24" width="28" height="28"><rect width="24" height="24" rx="4" fill="#0B2B5B" opacity="0.15"/><text x="12" y="16" text-anchor="middle" font-size="9" font-weight="700" fill="#4B9CD3">T.io</text></svg>',
        jira: '<svg viewBox="0 0 24 24" width="28" height="28"><path d="M11.571 11.513H0a5.218 5.218 0 005.232 5.215h2.13v2.057A5.215 5.215 0 0012.575 24V12.518a1.005 1.005 0 00-1.005-1.005z" fill="#2684FF"/><path d="M17.59 5.527H6.019a5.215 5.215 0 005.213 5.214h2.129v2.058a5.218 5.218 0 005.214 5.214V6.532a1.005 1.005 0 00-1.005-1.005z" fill="#2684FF" opacity="0.8"/><path d="M23.611 0H12.041a5.216 5.216 0 005.214 5.213h2.13v2.057A5.216 5.216 0 0024.598 12.484V1.005A1.005 1.005 0 0023.593 0z" fill="#2684FF" opacity="0.6"/></svg>',
        granola: '<svg viewBox="0 0 24 24" width="28" height="28"><rect width="24" height="24" rx="4" fill="#8B5CF6" opacity="0.15"/><text x="12" y="16" text-anchor="middle" font-size="9" font-weight="700" fill="#8B5CF6">GR</text></svg>'
    },

    render: function() {
        const container = document.getElementById('settings-content');
        if (!container) return;

        const activeSection = this._activeSection || 'ai';

        container.innerHTML = `
        <div class="stg-page">
            <div class="stg-header">
                <button class="view-back-btn" data-back-view="dashboard" title="Back to Dashboard">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Back
                </button>
                <h1 class="stg-title">Settings</h1>
                <p class="stg-subtitle">Manage your preferences, API connections, and platform configuration. Everything is stored locally in your browser.</p>
            </div>

            <div class="stg-layout">
                <nav class="stg-nav">
                    <button class="stg-nav-btn ${activeSection === 'ai' ? 'active' : ''}" data-section="ai">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z"/><path d="M16 14H8a4 4 0 00-4 4v2h16v-2a4 4 0 00-4-4z"/></svg>
                        AI Providers
                    </button>
                    <button class="stg-nav-btn ${activeSection === 'integrations' ? 'active' : ''}" data-section="integrations">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                        Integrations
                    </button>
                    <button class="stg-nav-btn ${activeSection === 'theme' ? 'active' : ''}" data-section="theme">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>
                        Appearance
                    </button>
                    <button class="stg-nav-btn ${activeSection === 'data' ? 'active' : ''}" data-section="data">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                        Storage & Data
                    </button>
                    <button class="stg-nav-btn ${activeSection === 'mcp' ? 'active' : ''}" data-section="mcp">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                        MCP Server
                    </button>
                    <button class="stg-nav-btn ${activeSection === 'about' ? 'active' : ''}" data-section="about">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        About
                    </button>
                </nav>

                <div class="stg-content" id="stg-section-content">
                    ${this.renderSection(activeSection)}
                </div>
            </div>
        </div>`;

        this.bindEvents(container);
    },

    renderSection: function(section) {
        switch (section) {
            case 'ai': return this.renderAISection();
            case 'integrations': return this.renderIntegrationsSection();
            case 'mcp': return this.renderMCPSection();
            case 'theme': return this.renderThemeSection();
            case 'data': return this.renderDataSection();
            case 'about': return this.renderAboutSection();
            default: return this.renderAISection();
        }
    },

    // ==================== AI PROVIDERS ====================
    renderAISection: function() {
        const providers = typeof AIProvider !== 'undefined' ? AIProvider.PROVIDERS : {};
        const activeProvider = typeof AIProvider !== 'undefined' ? AIProvider.getActiveProvider() : null;
        const activeModel = typeof AIProvider !== 'undefined' ? AIProvider.getActiveModel() : null;

        // AI Assistant config (separate system)
        const assistantConfig = (() => {
            try {
                const saved = localStorage.getItem('ai-assistant-config');
                return saved ? JSON.parse(saved) : null;
            } catch(e) { return null; }
        })();

        const providerCards = Object.entries(providers).map(([id, prov]) => {
            const hasKey = typeof AIProvider !== 'undefined' && !!AIProvider.getApiKey(id);
            const isActive = activeProvider === id;
            const logo = this.logos[id === 'google' ? 'google' : id] || '';
            const activeModelObj = isActive && activeModel ? prov.models.find(m => m.id === activeModel) : null;

            return `
            <div class="stg-provider-card ${isActive ? 'active' : ''} ${hasKey ? 'connected' : ''}" data-provider="${id}">
                <div class="stg-provider-header">
                    <div class="stg-provider-logo">${logo}</div>
                    <div class="stg-provider-info">
                        <div class="stg-provider-name">${prov.name}</div>
                        <div class="stg-provider-status">
                            ${hasKey ? `<span class="stg-status-dot connected"></span> Connected${activeModelObj ? ' — ' + activeModelObj.name : ''}` : '<span class="stg-status-dot"></span> Not connected'}
                        </div>
                    </div>
                    ${hasKey ? `<button class="stg-btn-sm stg-btn-danger" data-action="disconnect-ai" data-provider="${id}">Disconnect</button>` : ''}
                </div>
                <div class="stg-provider-config" id="stg-config-${id}" style="display:${isActive || (!activeProvider && id === 'anthropic') ? 'block' : 'none'}">
                    <div class="stg-form-group">
                        <label>Model</label>
                        <select class="stg-select" data-model-select="${id}">
                            ${prov.models.map(m => {
                                const badge = m.tier === 'recommended' ? ' ★' : m.tier === 'premium' ? ' ◆' : m.tier === 'fast' ? ' ⚡' : '';
                                return `<option value="${m.id}" ${(isActive && activeModel === m.id) ? 'selected' : ''}>${m.name} (${m.context})${badge}</option>`;
                            }).join('')}
                        </select>
                    </div>
                    <div class="stg-form-group">
                        <label>API Key</label>
                        <div class="stg-key-row">
                            <input type="password" class="stg-input" placeholder="${prov.keyPlaceholder}" data-key-input="${id}" autocomplete="off" spellcheck="false" ${hasKey ? 'value="••••••••••••"' : ''}>
                            <button class="stg-btn-primary" data-action="connect-ai" data-provider="${id}">${hasKey ? 'Update' : 'Connect'}</button>
                        </div>
                        <div class="stg-key-note">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            Key stored in session memory only. Calls go directly to ${prov.name}.
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');

        return `
        <div class="stg-section">
            <div class="stg-section-header">
                <h2>AI Providers</h2>
                <p>Connect your AI provider for the assessment assistant, SSP generation, and compliance analysis. Keys are stored in session memory and never persisted to disk.</p>
            </div>
            <div class="stg-provider-list">
                ${providerCards}
            </div>

            ${assistantConfig ? `
            <div class="stg-card" style="margin-top:20px">
                <div class="stg-card-header">
                    <h3>AI Assessment Assistant (Legacy)</h3>
                    <span class="stg-badge">Separate Config</span>
                </div>
                <div class="stg-card-body">
                    <p style="color:var(--text-secondary);font-size:0.8rem;">Provider: ${assistantConfig.provider || 'N/A'} | Model: ${assistantConfig.model || 'N/A'} | Validated: ${assistantConfig.validated ? 'Yes' : 'No'}</p>
                    ${assistantConfig.usageStats ? `<p style="color:var(--text-muted);font-size:0.75rem;">Calls: ${assistantConfig.usageStats.totalCalls} | Tokens: ${assistantConfig.usageStats.totalTokens?.toLocaleString()} | Est. Cost: $${assistantConfig.usageStats.estimatedCost?.toFixed(2)}</p>` : ''}
                </div>
            </div>` : ''}
        </div>`;
    },

    // ==================== INTEGRATIONS ====================
    renderIntegrationsSection: function() {
        const integrations = [
            { id: 'entra', name: 'Microsoft Entra ID', desc: 'Azure AD users, MFA, conditional access policies', logo: this.logos.entra, controls: 'AC, IA' },
            { id: 'knowbe4', name: 'KnowBe4', desc: 'Security awareness training campaigns & phishing tests', logo: this.logos.knowbe4, controls: 'AT' },
            { id: 'tenable', name: 'Tenable.io', desc: 'Vulnerability scanning, asset inventory, compliance', logo: this.logos.tenable, controls: 'RA, SI' },
            { id: 'jira', name: 'Jira', desc: 'POA&M tracking, project management, issue tracking', logo: this.logos.jira, controls: 'PM' },
            { id: 'granola', name: 'Granola', desc: 'Meeting notes, transcripts, evidence collection', logo: this.logos.granola, controls: 'Evidence' }
        ];

        // Check connection status from IntegrationsHub
        const getStatus = (id) => {
            if (typeof IntegrationsHub === 'undefined') return { connected: false };
            const data = IntegrationsHub._syncData || {};
            return { connected: !!data[id]?.lastSync, lastSync: data[id]?.lastSync };
        };

        // Check Granola separately
        const getGranolaStatus = () => {
            try {
                const cfg = JSON.parse(localStorage.getItem('nist-meeting-notes-config') || '{}');
                return { connected: !!cfg.apiKey, provider: cfg.provider };
            } catch(e) { return { connected: false }; }
        };

        return `
        <div class="stg-section">
            <div class="stg-section-header">
                <h2>Integrations</h2>
                <p>Connect external tools to automatically pull compliance evidence and sync data. Configure credentials in the Integrations Hub for full setup.</p>
            </div>
            <div class="stg-integration-grid">
                ${integrations.map(int => {
                    const status = int.id === 'granola' ? getGranolaStatus() : getStatus(int.id);
                    return `
                    <div class="stg-integration-card ${status.connected ? 'connected' : ''}">
                        <div class="stg-int-logo">${int.logo}</div>
                        <div class="stg-int-info">
                            <div class="stg-int-name">${int.name}</div>
                            <div class="stg-int-desc">${int.desc}</div>
                            <div class="stg-int-meta">
                                <span class="stg-int-controls">${int.controls}</span>
                                ${status.connected ? `<span class="stg-status-dot connected"></span> Connected` : '<span class="stg-status-dot"></span> Not connected'}
                            </div>
                        </div>
                        <button class="stg-btn-sm" data-action="configure-integration" data-integration="${int.id}">Configure</button>
                    </div>`;
                }).join('')}
            </div>
            <div class="stg-hint" style="margin-top:16px">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Full integration configuration is available in the <a href="#" data-action="open-integrations-hub" style="color:var(--accent-blue)">Integrations Hub</a>.
            </div>
        </div>`;
    },

    // ==================== MCP SERVER ====================
    renderMCPSection: function() {
        const toolGroups = [
            { name: 'Controls', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>', tools: [
                { name: 'get_control_info', desc: 'Look up a control with objectives, ODPs, cross-refs' },
                { name: 'search_controls', desc: 'Full-text search across all controls' },
                { name: 'list_families', desc: 'List all control families with counts' }
            ]},
            { name: 'Crosswalk & ODPs', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>', tools: [
                { name: 'get_crosswalk', desc: 'Rev 2 to Rev 3 control mapping' },
                { name: 'get_odp_values', desc: 'DoD-defined ODP values for Rev 3' },
                { name: 'get_new_rev3_controls', desc: 'New controls added in Rev 3' },
                { name: 'get_800_53_mapping', desc: '800-53 to 800-171 tailoring mapping' }
            ]},
            { name: 'Implementation', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>', tools: [
                { name: 'get_implementation_guidance', desc: 'Platform-specific guidance (AWS, Azure, Palo Alto, etc.)' },
                { name: 'get_evidence_requirements', desc: 'Evidence artifacts needed for assessment' }
            ]},
            { name: 'FedRAMP', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', tools: [
                { name: 'get_fedramp_ksi', desc: 'FedRAMP 20x Key Security Indicators' },
                { name: 'search_fedramp_ksi', desc: 'Search KSIs by keyword' }
            ]},
            { name: 'SPRS Scoring', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>', tools: [
                { name: 'get_sprs_score_info', desc: 'Point values, methodology, POA&M rules' },
                { name: 'calculate_sprs_impact', desc: 'Calculate SPRS impact for NOT MET controls' }
            ]},
            { name: 'Assessment Bridge', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>', tools: [
                { name: 'get_assessment_snapshot', desc: 'Read latest assessment context from UI export' },
                { name: 'get_assessment_gaps', desc: 'Analyze gaps with SPRS impact and priorities' },
                { name: 'get_poam_summary', desc: 'POA&M items summary with overdue tracking' }
            ]}
        ];

        return `
        <div class="stg-section">
            <div class="stg-section-header">
                <h2>MCP Server</h2>
                <p>The CMMC Reference MCP Server exposes compliance data to AI tools (Claude Desktop, Windsurf, Cursor) via the Model Context Protocol. 17 tools across 6 categories.</p>
            </div>

            <div class="stg-card" style="margin-bottom:16px">
                <div class="stg-card-header">
                    <h3>Server Status</h3>
                    <span class="stg-badge">v2.0.0</span>
                </div>
                <div class="stg-card-body">
                    <div class="stg-mcp-status">
                        <div class="stg-mcp-stat"><span class="stg-mcp-stat-val">17</span><span class="stg-mcp-stat-label">Tools</span></div>
                        <div class="stg-mcp-stat"><span class="stg-mcp-stat-val">2</span><span class="stg-mcp-stat-label">Layers</span></div>
                        <div class="stg-mcp-stat"><span class="stg-mcp-stat-val">230+</span><span class="stg-mcp-stat-label">Controls</span></div>
                        <div class="stg-mcp-stat"><span class="stg-mcp-stat-val">742+</span><span class="stg-mcp-stat-label">Objectives</span></div>
                        <div class="stg-mcp-stat"><span class="stg-mcp-stat-val">165+</span><span class="stg-mcp-stat-label">Guidance</span></div>
                        <div class="stg-mcp-stat"><span class="stg-mcp-stat-val">4</span><span class="stg-mcp-stat-label">GRC Platforms</span></div>
                    </div>
                    <p style="color:var(--text-muted);font-size:0.75rem;margin:10px 0 0">
                        <strong>Layer 1:</strong> Static reference data (controls, crosswalk, guidance, FedRAMP, SPRS, GRC platforms) &mdash; always safe, no auth<br>
                        <strong>Layer 2:</strong> Assessment context bridge (snapshot export &rarr; local file &rarr; MCP read) &mdash; ephemeral, redacted<br>
                        <strong>Coverage:</strong> Rev 2 (110 controls) + Rev 3 (97 controls) + L3/800-172A (23 controls) &bull; FedRAMP Low/Moderate/High/20x baselines
                    </p>
                </div>
            </div>

            <div class="stg-card" style="margin-bottom:16px">
                <div class="stg-card-header">
                    <h3>Configuration</h3>
                    <button class="stg-btn-sm" data-action="copy-mcp-config" title="Copy to clipboard">Copy Config</button>
                </div>
                <div class="stg-card-body">
                    <p style="color:var(--text-secondary);font-size:0.78rem;margin:0 0 10px">Add this to your AI client's MCP configuration file:</p>
                    <div class="stg-mcp-tabs">
                        <button class="stg-mcp-tab active" data-mcp-tab="claude">Claude Desktop</button>
                        <button class="stg-mcp-tab" data-mcp-tab="windsurf">Windsurf / Cursor</button>
                    </div>
                    <pre class="stg-mcp-config" id="stg-mcp-config-block"><code>// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "cmmc-reference": {
      "command": "node",
      "args": ["${location.pathname.replace(/\/[^\/]*$/, '')}/mcp-server/src/index.js"]
    }
  }
}</code></pre>
                </div>
            </div>

            <div class="stg-card" style="margin-bottom:16px">
                <div class="stg-card-header">
                    <h3>Assessment Bridge</h3>
                    <span class="stg-badge">Layer 2</span>
                </div>
                <div class="stg-card-body">
                    <p style="color:var(--text-secondary);font-size:0.78rem;margin:0 0 10px">Export a snapshot of your current assessment state so AI tools can read it via MCP. The snapshot is saved to <code>~/.cmmc-mcp/assessment-context.json</code> and auto-expires after 1 hour.</p>
                    <div style="display:flex;gap:8px;flex-wrap:wrap">
                        <button class="stg-btn-primary" data-action="export-mcp-snapshot">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Export Assessment Snapshot
                        </button>
                        <button class="stg-btn-secondary" data-action="copy-snapshot-json">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                            Copy to Clipboard
                        </button>
                    </div>
                    <div id="stg-mcp-bridge-status" style="margin-top:8px"></div>
                </div>
            </div>

            <div class="stg-card">
                <div class="stg-card-header">
                    <h3>Available Tools (17)</h3>
                </div>
                <div class="stg-card-body">
                    ${toolGroups.map(g => `
                        <div class="stg-mcp-tool-group">
                            <div class="stg-mcp-group-label">${g.icon} ${g.name}</div>
                            ${g.tools.map(t => `
                                <div class="stg-mcp-tool">
                                    <code class="stg-mcp-tool-name">${t.name}</code>
                                    <span class="stg-mcp-tool-desc">${t.desc}</span>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;
    },

    // ==================== THEME / APPEARANCE ==
    renderThemeSection: function() {
        const tp = typeof ThemePicker !== 'undefined' ? ThemePicker : null;
        const currentTheme = tp ? tp.currentTheme : 'deepObsidian';
        const categories = tp ? tp.themeCategories : {};
        const themes = tp ? tp.themes : {};

        return `
        <div class="stg-section">
            <div class="stg-section-header">
                <h2>Appearance</h2>
                <p>Choose a color theme. Changes apply instantly across the entire platform.</p>
            </div>
            <div class="stg-theme-grid">
                ${Object.entries(categories).map(([catKey, cat]) => `
                    <div class="stg-theme-category">
                        <div class="stg-theme-cat-label">${cat.name}</div>
                        <div class="stg-theme-options">
                            ${cat.themes.map(tKey => {
                                const t = themes[tKey];
                                if (!t) return '';
                                const isActive = tKey === currentTheme;
                                const bg = t.colors['--bg-primary'] || '#0a0a0f';
                                const accent = t.colors['--accent-blue'] || '#6c8aff';
                                const text = t.colors['--text-primary'] || '#e4e5ea';
                                return `
                                <button class="stg-theme-btn ${isActive ? 'active' : ''}" data-action="set-theme" data-theme="${tKey}" title="${t.name}">
                                    <div class="stg-theme-preview" style="background:${bg}">
                                        <div class="stg-theme-accent" style="background:${accent}"></div>
                                        <div class="stg-theme-text" style="background:${text}"></div>
                                        <div class="stg-theme-text short" style="background:${text}"></div>
                                    </div>
                                    <span class="stg-theme-name">${t.name}</span>
                                    ${isActive ? '<span class="stg-theme-check">✓</span>' : ''}
                                </button>`;
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    },

    // ==================== STORAGE & DATA ====================
    renderDataSection: function() {
        // Calculate localStorage usage
        let totalBytes = 0;
        const items = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const val = localStorage.getItem(key);
            const bytes = new Blob([key + val]).size;
            totalBytes += bytes;
            items.push({ key, bytes });
        }
        items.sort((a, b) => b.bytes - a.bytes);
        const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
        const maxMB = 5;
        const pct = Math.min(100, (totalBytes / (maxMB * 1024 * 1024)) * 100);

        const formatBytes = (b) => b > 1024 * 1024 ? (b / (1024 * 1024)).toFixed(2) + ' MB' : b > 1024 ? (b / 1024).toFixed(1) + ' KB' : b + ' B';

        return `
        <div class="stg-section">
            <div class="stg-section-header">
                <h2>Storage & Data</h2>
                <p>All data is stored locally in your browser's localStorage. Export to back up, import to restore.</p>
            </div>

            <div class="stg-storage-bar-container">
                <div class="stg-storage-bar">
                    <div class="stg-storage-fill ${pct > 80 ? 'warning' : pct > 95 ? 'danger' : ''}" style="width:${pct}%"></div>
                </div>
                <div class="stg-storage-label">${totalMB} MB of ~${maxMB} MB used (${pct.toFixed(0)}%)</div>
            </div>

            <div class="stg-data-actions">
                <button class="stg-btn-primary" data-action="export-all-data">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export All Data
                </button>
                <button class="stg-btn-secondary" data-action="import-data">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Import Data
                </button>
                <button class="stg-btn-danger" data-action="clear-all-data">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    Clear All Data
                </button>
            </div>

            <div class="stg-data-table">
                <div class="stg-data-header">
                    <span>Key</span><span>Size</span>
                </div>
                ${items.slice(0, 20).map(item => `
                    <div class="stg-data-row">
                        <span class="stg-data-key">${item.key}</span>
                        <span class="stg-data-size">${formatBytes(item.bytes)}</span>
                    </div>
                `).join('')}
                ${items.length > 20 ? `<div class="stg-data-row"><span class="stg-data-key" style="color:var(--text-muted)">...and ${items.length - 20} more</span><span></span></div>` : ''}
            </div>
            <input type="file" id="stg-import-file" accept=".json" style="display:none">
        </div>`;
    },

    // ==================== ABOUT ====================
    renderAboutSection: function() {
        return `
        <div class="stg-section">
            <div class="stg-section-header">
                <h2>About</h2>
                <p>CMMC 2.0 Assessment Tool — a comprehensive platform for managing Cybersecurity Maturity Model Certification assessments.</p>
            </div>
            <div class="stg-about-grid">
                <div class="stg-about-card">
                    <h3>Keyboard Shortcuts</h3>
                    <div class="stg-shortcuts">
                        <div class="stg-shortcut"><kbd>⌘</kbd> + <kbd>K</kbd><span>Search controls, views, guides</span></div>
                        <div class="stg-shortcut"><kbd>/</kbd><span>Quick search (when not in input)</span></div>
                        <div class="stg-shortcut"><kbd>Esc</kbd><span>Close modals and menus</span></div>
                    </div>
                </div>
                <div class="stg-about-card">
                    <h3>Platform Info</h3>
                    <div class="stg-info-list">
                        <div class="stg-info-row"><span>Version</span><span>2.0</span></div>
                        <div class="stg-info-row"><span>Framework</span><span>CMMC 2.0 / NIST 800-171</span></div>
                        <div class="stg-info-row"><span>Storage</span><span>Browser localStorage</span></div>
                        <div class="stg-info-row"><span>Data Privacy</span><span>100% client-side</span></div>
                    </div>
                </div>
            </div>
        </div>`;
    },

    // ==================== EVENT BINDING ====================
    bindEvents: function(container) {
        container.addEventListener('click', (e) => {
            // Section navigation
            const navBtn = e.target.closest('.stg-nav-btn');
            if (navBtn) {
                this._activeSection = navBtn.dataset.section;
                container.querySelectorAll('.stg-nav-btn').forEach(b => b.classList.toggle('active', b === navBtn));
                document.getElementById('stg-section-content').innerHTML = this.renderSection(this._activeSection);
                return;
            }

            const action = e.target.closest('[data-action]')?.dataset.action;
            if (!action) {
                // Toggle provider config on card click
                const card = e.target.closest('.stg-provider-card');
                if (card && !e.target.closest('.stg-btn-sm') && !e.target.closest('.stg-key-row') && !e.target.closest('select')) {
                    const id = card.dataset.provider;
                    document.querySelectorAll('.stg-provider-config').forEach(c => {
                        c.style.display = c.id === 'stg-config-' + id ? (c.style.display === 'none' ? 'block' : 'none') : 'none';
                    });
                }
                return;
            }

            switch (action) {
                case 'connect-ai': this.connectAI(e.target.closest('[data-provider]').dataset.provider); break;
                case 'disconnect-ai': this.disconnectAI(e.target.closest('[data-provider]').dataset.provider); break;
                case 'set-theme': this.setTheme(e.target.closest('[data-theme]').dataset.theme); break;
                case 'export-all-data': this.exportAllData(); break;
                case 'import-data': document.getElementById('stg-import-file')?.click(); break;
                case 'clear-all-data': this.clearAllData(); break;
                case 'configure-integration': this.configureIntegration(e.target.closest('[data-integration]').dataset.integration); break;
                case 'copy-mcp-config': this.copyMCPConfig(); break;
                case 'export-mcp-snapshot': this.exportMCPSnapshot(); break;
                case 'copy-snapshot-json': this.copySnapshotJSON(); break;
                case 'open-integrations-hub':
                    e.preventDefault();
                    if (typeof IntegrationsHub !== 'undefined') IntegrationsHub.openHub();
                    break;
            }
        });

        // Import file handler
        container.addEventListener('change', (e) => {
            if (e.target.id === 'stg-import-file') this.importData(e.target);
        });

        // MCP tab switching
        container.addEventListener('click', (e) => {
            const tab = e.target.closest('.stg-mcp-tab');
            if (tab) {
                container.querySelectorAll('.stg-mcp-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const configBlock = document.getElementById('stg-mcp-config-block');
                if (configBlock) {
                    if (tab.dataset.mcpTab === 'windsurf') {
                        configBlock.innerHTML = `<code>// .windsurf/mcp.json or Cursor MCP settings\n{\n  "cmmc-reference": {\n    "command": "node",\n    "args": ["/absolute/path/to/nist-assessment-tool/mcp-server/src/index.js"]\n  }\n}</code>`;
                    } else {
                        configBlock.innerHTML = `<code>// ~/Library/Application Support/Claude/claude_desktop_config.json\n{\n  "mcpServers": {\n    "cmmc-reference": {\n      "command": "node",\n      "args": ["/absolute/path/to/nist-assessment-tool/mcp-server/src/index.js"]\n    }\n  }\n}</code>`;
                    }
                }
            }
        });
    },

    // ==================== AI ACTIONS ====================
    connectAI: async function(providerId) {
        if (typeof AIProvider === 'undefined') return;
        const input = document.querySelector(`[data-key-input="${providerId}"]`);
        const modelSelect = document.querySelector(`[data-model-select="${providerId}"]`);
        const key = input?.value?.trim();
        if (!key || key === '••••••••••••') {
            input.style.borderColor = 'var(--status-not-met)';
            setTimeout(() => { input.style.borderColor = ''; }, 2000);
            return;
        }
        try {
            AIProvider.setApiKey(providerId, key);
            AIProvider.setActiveProvider(providerId);
            if (modelSelect) AIProvider.setActiveModel(modelSelect.value);
            this.showToast(`Connected to ${AIProvider.PROVIDERS[providerId].name}`, 'success');
            this._activeSection = 'ai';
            this.render();
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    disconnectAI: function(providerId) {
        if (typeof AIProvider === 'undefined') return;
        const name = AIProvider.PROVIDERS[providerId]?.name || providerId;
        if (confirm('Disconnect ' + name + '? Your API key will be removed from session.')) {
            AIProvider.clearApiKey(providerId);
            this._activeSection = 'ai';
            this.render();
            this.showToast(name + ' disconnected', 'success');
        }
    },

    // ==================== THEME ACTIONS ====================
    setTheme: function(themeKey) {
        if (typeof ThemePicker !== 'undefined') {
            ThemePicker.applyTheme(themeKey);
            this._activeSection = 'theme';
            this.render();
        }
    },

    // ==================== DATA ACTIONS ====================
    exportAllData: function() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try { data[key] = JSON.parse(localStorage.getItem(key)); }
            catch(e) { data[key] = localStorage.getItem(key); }
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cmmc-assessment-backup-' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Data exported successfully', 'success');
    },

    importData: function(input) {
        const file = input.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (typeof data !== 'object') throw new Error('Invalid format');
                if (!confirm(`Import ${Object.keys(data).length} keys? This will merge with existing data.`)) return;
                Object.entries(data).forEach(([key, val]) => {
                    localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
                });
                this.showToast(`Imported ${Object.keys(data).length} keys`, 'success');
                this._activeSection = 'data';
                this.render();
            } catch (err) {
                this.showToast('Import failed: ' + err.message, 'error');
            }
        };
        reader.readAsText(file);
        input.value = '';
    },

    clearAllData: function() {
        if (!confirm('Clear ALL localStorage data? This cannot be undone. Make sure to export first!')) return;
        if (!confirm('Are you absolutely sure? All assessment data, settings, and configurations will be lost.')) return;
        localStorage.clear();
        this.showToast('All data cleared', 'success');
        this._activeSection = 'data';
        this.render();
    },

    // ==================== MCP ACTIONS ====================
    copyMCPConfig: function() {
        const config = JSON.stringify({
            mcpServers: {
                'cmmc-reference': {
                    command: 'node',
                    args: ['/absolute/path/to/nist-assessment-tool/mcp-server/src/index.js']
                }
            }
        }, null, 2);
        navigator.clipboard.writeText(config).then(() => {
            this.showToast('MCP config copied to clipboard', 'success');
        }).catch(() => {
            this.showToast('Copy failed — check clipboard permissions', 'error');
        });
    },

    buildAssessmentSnapshot: function() {
        const prefix = typeof window.AssessmentApp !== 'undefined' && window.AssessmentApp.storagePrefix ? window.AssessmentApp.storagePrefix : 'cmmc_';
        const snapshot = { _exportedAt: new Date().toISOString(), _source: 'cmmc-assessment-tool' };

        // Objective statuses
        try {
            const raw = localStorage.getItem(prefix + 'assessment-data');
            if (raw) snapshot.objectiveStatuses = JSON.parse(raw);
        } catch(e) {}

        // POA&M
        try {
            const raw = localStorage.getItem(prefix + 'poam-data');
            if (raw) snapshot.poamItems = JSON.parse(raw);
        } catch(e) {}

        // Implementation details
        try {
            const raw = localStorage.getItem(prefix + 'implementation-data');
            if (raw) snapshot.implementationDetails = JSON.parse(raw);
        } catch(e) {}

        // Org info
        try {
            const raw = localStorage.getItem('nist-org-data');
            if (raw) {
                const org = JSON.parse(raw);
                snapshot.organization = { name: org.orgName || '', assessor: org.assessorName || '' };
            }
        } catch(e) {}

        // OSC inventory summary
        try {
            const raw = localStorage.getItem('osc-inventory');
            if (raw) {
                const inv = JSON.parse(raw);
                snapshot.inventory = {
                    policies: (inv.policies || []).length,
                    procedures: (inv.procedures || []).length,
                    assets: (inv.assets || []).length,
                    fipsCerts: (inv.fipsCerts || []).length
                };
            }
        } catch(e) {}

        return snapshot;
    },

    exportMCPSnapshot: function() {
        const snapshot = this.buildAssessmentSnapshot();
        const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'assessment-context.json';
        a.click();
        URL.revokeObjectURL(url);

        const statusEl = document.getElementById('stg-mcp-bridge-status');
        if (statusEl) {
            const objCount = snapshot.objectiveStatuses ? Object.keys(snapshot.objectiveStatuses).length : 0;
            const poamCount = Array.isArray(snapshot.poamItems) ? snapshot.poamItems.length : 0;
            statusEl.innerHTML = `<span style="color:#34d399;font-size:0.78rem">&#10003; Snapshot exported (${objCount} objectives, ${poamCount} POA&M items). Save to <code>~/.cmmc-mcp/assessment-context.json</code> for MCP access.</span>`;
        }
        this.showToast('Assessment snapshot exported', 'success');
    },

    copySnapshotJSON: function() {
        const snapshot = this.buildAssessmentSnapshot();
        const json = JSON.stringify(snapshot, null, 2);
        navigator.clipboard.writeText(json).then(() => {
            this.showToast('Snapshot JSON copied to clipboard', 'success');
        }).catch(() => {
            this.showToast('Copy failed', 'error');
        });
    },

    // ==================== INTEGRATION ACTIONS ====================
    configureIntegration: function(integrationId) {
        if (integrationId === 'granola') {
            // Open meeting notes settings
            const btn = document.getElementById('open-meeting-notes-btn');
            if (btn) btn.click();
            return;
        }
        // Open Integrations Hub for the specific provider
        if (typeof IntegrationsHub !== 'undefined') {
            IntegrationsHub.openHub();
        }
    },

    // ==================== TOAST ====================
    showToast: function(message, type) {
        const existing = document.querySelector('.stg-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'stg-toast ' + (type || 'info');
        toast.textContent = message;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
    }
};

if (typeof window !== 'undefined') window.SettingsPage = SettingsPage;
