// MSP Portal - Comprehensive MSP/MSSP Management Center
// Summit7-level functionality for managing multiple CMMC clients

const MSPPortal = {
    config: { version: "1.0.0", name: "MSP Command Center" },

    state: {
        activeView: 'dashboard',
        activeClient: null,
        clients: [],
        projectPlans: {}
    },

    navigation: [
        { id: 'dashboard', name: 'Dashboard', icon: 'dashboard', section: 'main' },
        { id: 'clients', name: 'Client Portfolio', icon: 'users', section: 'main' },
        { id: 'projects', name: 'Project Planner', icon: 'calendar', section: 'main' },
        { id: 'evidence', name: 'Evidence Builder', icon: 'folder', section: 'main' },
        { id: 'reports', name: 'Reports Center', icon: 'file-text', section: 'main' },
        { id: 'env-setup', name: 'Environment Setup', icon: 'server', section: 'infrastructure' },
        { id: 'architecture', name: 'Multi-Tenant Architecture', icon: 'layers', section: 'infrastructure' },
        { id: 'enclaves', name: 'Enclave Design', icon: 'shield', section: 'infrastructure' },
        { id: 'vdi', name: 'VDI Solutions', icon: 'monitor', section: 'infrastructure' },
        { id: 'siem', name: 'SIEM/MSSP Operations', icon: 'activity', section: 'security' },
        { id: 'mssp-playbook', name: 'MSSP Playbook', icon: 'shield', section: 'security' },
        { id: 'scuba-baselines', name: 'SCuBA Baselines & Drift', icon: 'shield', section: 'security' },
        { id: 'automation', name: 'Automation & Compliance', icon: 'cpu', section: 'security' },
        { id: 'automation-platforms', name: 'RMM & Automation Tools', icon: 'settings', section: 'tools' },
        { id: 'cloud-templates', name: 'Cloud Templates', icon: 'database', section: 'tools' },
        { id: 'evidence-lists', name: 'Evidence Collection Lists', icon: 'list', section: 'tools' },
        { id: 'data-protection', name: 'Data Protection Guide', icon: 'shield', section: 'tools' },
        { id: 'tech-scripts', name: 'Technical Scripts', icon: 'terminal', section: 'tools' },
        { id: 'documentation', name: 'Best Practices', icon: 'book', section: 'resources' }
    ],

    icons: {
        'dashboard': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
        'users': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
        'calendar': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
        'folder': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>',
        'file-text': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
        'server': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
        'layers': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
        'shield': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        'monitor': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
        'activity': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
        'cpu': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/></svg>',
        'terminal': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
        'book': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
        'x': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        'check-circle': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        'clock': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        'alert-triangle': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        'user-plus': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',
        'external-link': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
        'refresh-cw': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>',
        'plus': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
        'edit': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
        'layout': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
        'bar-chart': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
        'list': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
        'database': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
        'settings': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'
    },

    init: function() {
        this.loadState();
        this.bindEvents();
        console.log('[MSPPortal] Initialized v' + this.config.version);
    },

    _escHandler: null,

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#open-msp-portal-btn')) this.openPortal();
        });
    },

    loadState: function() {
        try {
            const saved = localStorage.getItem('msp_portal_state');
            if (saved) {
                const data = JSON.parse(saved);
                this.state.clients = data.clients || [];
                this.state.projectPlans = data.projectPlans || {};
            }
            if (typeof PortfolioDashboard !== 'undefined' && PortfolioDashboard.portfolioData?.clients) {
                this.state.clients = PortfolioDashboard.portfolioData.clients;
            }
        } catch (e) { console.error('[MSPPortal] Load error:', e); }
    },

    saveState: function() {
        try {
            localStorage.setItem('msp_portal_state', JSON.stringify({
                clients: this.state.clients,
                projectPlans: this.state.projectPlans
            }));
        } catch (e) { console.error('[MSPPortal] Save error:', e); }
    },

    getIcon: function(name) { return this.icons[name] || this.icons['file-text']; },

    openPortal: function() {
        // Close hamburger menu if open
        document.getElementById('hamburger-dropdown')?.classList.remove('active');
        document.getElementById('hamburger-overlay')?.classList.remove('active');
        document.getElementById('hamburger-menu-toggle')?.classList.remove('open');

        const html = `
        <div class="msp-portal-overlay" id="msp-portal">
            <div class="msp-portal-container">
                <div class="msp-portal-sidebar">${this.renderSidebar()}</div>
                <div class="msp-portal-main">
                    <div class="msp-portal-header">${this.renderHeader()}</div>
                    <div class="msp-portal-content" id="msp-portal-content">${this.renderView('dashboard')}</div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        this.attachPortalEvents();

        // Escape key handler
        this._escHandler = (e) => { if (e.key === 'Escape') this.closePortal(); };
        document.addEventListener('keydown', this._escHandler);
    },

    closePortal: function() {
        // Remove Escape handler
        if (this._escHandler) {
            document.removeEventListener('keydown', this._escHandler);
            this._escHandler = null;
        }
        document.getElementById('msp-portal')?.remove();
    },

    renderSidebar: function() {
        const sections = { main: { label: 'Management', items: [] }, infrastructure: { label: 'Infrastructure', items: [] }, security: { label: 'Security Ops', items: [] }, tools: { label: 'Tools & Data', items: [] }, resources: { label: 'Resources', items: [] } };
        this.navigation.forEach(n => sections[n.section].items.push(n));
        return `
        <div class="msp-sidebar-header">
            <div class="msp-logo">${this.getIcon('layers')}</div>
            <div class="msp-brand"><span class="msp-brand-name">MSP Command Center</span><span class="msp-brand-tag">CMMC Management</span></div>
        </div>
        <nav class="msp-sidebar-nav">
            ${Object.entries(sections).map(([k, s]) => `
                <div class="msp-nav-section">
                    <div class="msp-nav-section-label">${s.label}</div>
                    ${s.items.map(i => `<button class="msp-nav-btn ${i.id === this.state.activeView ? 'active' : ''}" data-view="${i.id}">${this.getIcon(i.icon)}<span>${i.name}</span></button>`).join('')}
                </div>
            `).join('')}
        </nav>
        <div class="msp-sidebar-footer"><button class="msp-close-btn" onclick="MSPPortal.closePortal()">${this.getIcon('x')}<span>Close Portal</span></button></div>`;
    },

    renderHeader: function() {
        const stats = this.getStats();
        return `
        <div class="msp-header-left"><h1 class="msp-header-title" id="msp-view-title">Dashboard</h1></div>
        <div class="msp-header-right">
            <div class="msp-header-stats">
                <div class="msp-stat-mini"><span class="stat-value">${stats.totalClients}</span><span class="stat-label">Clients</span></div>
                <div class="msp-stat-mini"><span class="stat-value">${stats.inProgress}</span><span class="stat-label">Active</span></div>
            </div>
            <button class="msp-header-btn" onclick="MSPPortal.refresh()">${this.getIcon('refresh-cw')}</button>
        </div>`;
    },

    attachPortalEvents: function() {
        // Use single delegated listener on the portal container to avoid stacking
        const portal = document.getElementById('msp-portal');
        if (!portal) return;
        portal.addEventListener('click', (e) => {
            // Nav buttons
            const navBtn = e.target.closest('.msp-nav-btn');
            if (navBtn) { this.switchView(navBtn.dataset.view); return; }
            // Close button
            if (e.target.closest('.msp-close-btn')) { this.closePortal(); return; }
        });
        this.attachDataViewEvents();
    },

    attachDataViewEvents: function() {
        // Data view tabs (automation platforms, cloud templates, data protection)
        // Use setTimeout to ensure DOM is fully rendered
        setTimeout(() => {
            document.querySelectorAll('.msp-data-tab').forEach(tab => {
                // Remove existing listeners by cloning
                const newTab = tab.cloneNode(true);
                tab.parentNode.replaceChild(newTab, tab);
                
                newTab.addEventListener('click', (e) => {
                    const section = e.target.dataset.section;
                    const container = e.target.closest('.msp-data-view');
                    if (!container) return;
                    
                    // Update active tab
                    container.querySelectorAll('.msp-data-tab').forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    // Render content based on view type - check by content ID
                    const contentEl = container.querySelector('.msp-data-content');
                    if (!contentEl) return;
                    
                    const contentId = contentEl.id;
                    if (contentId === 'automation-platforms-content') {
                        const data = typeof MSP_AUTOMATION_PLATFORMS !== 'undefined' ? MSP_AUTOMATION_PLATFORMS : null;
                        if (data) contentEl.innerHTML = MSPPortalViews.renderAutomationPlatformsSection(data, section);
                    } else if (contentId === 'cloud-templates-content') {
                        const data = typeof MSP_CLOUD_TEMPLATES !== 'undefined' ? MSP_CLOUD_TEMPLATES : null;
                        if (data) contentEl.innerHTML = MSPPortalViews.renderCloudTemplatesSection(data, section);
                    } else if (contentId === 'data-protection-content') {
                        const data = typeof MSP_DATA_PROTECTION !== 'undefined' ? MSP_DATA_PROTECTION : null;
                        if (data) contentEl.innerHTML = MSPPortalViews.renderDataProtectionSection(data, section);
                    }
                });
            });

            // Evidence family navigation
            document.querySelectorAll('.family-nav-btn').forEach(btn => {
                // Remove existing listeners by cloning
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                newBtn.addEventListener('click', (e) => {
                    const familyKey = e.target.dataset.family;
                    const data = typeof MSP_EVIDENCE_LISTS !== 'undefined' ? MSP_EVIDENCE_LISTS : null;
                    if (!data) return;
                    
                    // Update active button
                    document.querySelectorAll('.family-nav-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    // Build family object from key (must match keys in msp-evidence-lists.js)
                    const familyMap = {
                        accessControl: { id: 'AC', name: 'Access Control' },
                        awarenessTraining: { id: 'AT', name: 'Awareness & Training' },
                        auditAccountability: { id: 'AU', name: 'Audit & Accountability' },
                        configurationManagement: { id: 'CM', name: 'Configuration Management' },
                        identificationAuthentication: { id: 'IA', name: 'Identification & Authentication' },
                        incidentResponse: { id: 'IR', name: 'Incident Response' },
                        maintenance: { id: 'MA', name: 'Maintenance' },
                        mediaProtection: { id: 'MP', name: 'Media Protection' },
                        personnelSecurity: { id: 'PS', name: 'Personnel Security' },
                        physicalProtection: { id: 'PE', name: 'Physical Protection' },
                        riskAssessment: { id: 'RA', name: 'Risk Assessment' },
                        securityAssessment: { id: 'CA', name: 'Security Assessment' },
                        systemCommunicationsProtection: { id: 'SC', name: 'System & Communications' },
                        systemInformationIntegrity: { id: 'SI', name: 'System & Information Integrity' }
                    };
                    
                    const familyInfo = familyMap[familyKey];
                    if (familyInfo && data[familyKey]) {
                        const family = { key: familyKey, ...familyInfo, data: data[familyKey] };
                        const contentEl = document.getElementById('evidence-lists-content');
                        if (contentEl) {
                            contentEl.innerHTML = MSPPortalViews.renderEvidenceFamily(family);
                        }
                    }
                });
            });

            // MSSP Playbook tabs
            document.querySelectorAll('.mssp-pb-tab').forEach(tab => {
                const newTab = tab.cloneNode(true);
                tab.parentNode.replaceChild(newTab, tab);
                newTab.addEventListener('click', (e) => {
                    const tabId = e.target.dataset.pbTab;
                    const data = typeof MSSP_PLAYBOOK_DATA !== 'undefined' ? MSSP_PLAYBOOK_DATA : null;
                    if (!data) return;
                    document.querySelectorAll('.mssp-pb-tab').forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');
                    const contentEl = document.getElementById('mssp-pb-content');
                    if (!contentEl) return;
                    switch (tabId) {
                        case 'scoping': contentEl.innerHTML = MSPPortalViews.renderPlaybookScoping(data); break;
                        case 'tools': contentEl.innerHTML = MSPPortalViews.renderPlaybookTools(data); break;
                        case 'playbooks': contentEl.innerHTML = MSPPortalViews.renderPlaybookSOC(data); break;
                        case 'onboarding': contentEl.innerHTML = MSPPortalViews.renderPlaybookOnboarding(data); break;
                        case 'dfars': contentEl.innerHTML = MSPPortalViews.renderPlaybookDFARS(data); break;
                    }
                });
            });
            // SCuBA Baselines tabs
            document.querySelectorAll('[data-scuba-tab]').forEach(tab => {
                const newTab = tab.cloneNode(true);
                tab.parentNode.replaceChild(newTab, tab);
                newTab.addEventListener('click', (e) => {
                    const tabId = e.target.dataset.scubaTab;
                    const d = typeof SCUBA_CONFIG_DRIFT_DATA !== 'undefined' ? SCUBA_CONFIG_DRIFT_DATA : null;
                    if (!d) return;
                    document.querySelectorAll('[data-scuba-tab]').forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');
                    const contentEl = document.getElementById('scuba-tab-content');
                    if (!contentEl) return;
                    switch (tabId) {
                        case 'utcm': contentEl.innerHTML = MSPPortalViews.renderScubaUTCM(d.utcm, MSPPortal); break;
                        case 'scubagear': contentEl.innerHTML = MSPPortalViews.renderScubaGear(d.scubaGear, MSPPortal); break;
                        case 'scubagoggles': contentEl.innerHTML = MSPPortalViews.renderScubaGoggles(d.scubaGoggles, MSPPortal); break;
                        case 'mapping': contentEl.innerHTML = MSPPortalViews.renderScubaMapping(d.cmmcMapping, MSPPortal); break;
                        case 'automation': contentEl.innerHTML = MSPPortalViews.renderScubaAutomation(d.automation, MSPPortal); break;
                    }
                    // Re-bind expand and copy after tab switch
                    MSPPortal.bindScubaInteractions();
                });
            });

            // Technical Scripts tabs + search
            document.querySelectorAll('.tech-script-tab').forEach(tab => {
                const newTab = tab.cloneNode(true);
                tab.parentNode.replaceChild(newTab, tab);
                newTab.addEventListener('click', (e) => {
                    const tabId = e.target.dataset.tsTab;
                    if (!tabId) return;
                    document.querySelectorAll('.tech-script-tab').forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');
                    const contentEl = document.getElementById('tech-scripts-content');
                    if (!contentEl) return;
                    const searchEl = document.getElementById('tech-scripts-search');
                    const searchTerm = searchEl ? searchEl.value : '';
                    contentEl.innerHTML = MSPPortalViews.renderTechScriptSection(tabId, searchTerm);
                });
            });
            const tsSearch = document.getElementById('tech-scripts-search');
            if (tsSearch) {
                const newSearch = tsSearch.cloneNode(true);
                tsSearch.parentNode.replaceChild(newSearch, tsSearch);
                let tsDebounce;
                newSearch.addEventListener('input', (e) => {
                    clearTimeout(tsDebounce);
                    tsDebounce = setTimeout(() => {
                        const activeTab = document.querySelector('.tech-script-tab.active');
                        const tabId = activeTab ? activeTab.dataset.tsTab : 'identity';
                        const contentEl = document.getElementById('tech-scripts-content');
                        if (contentEl) contentEl.innerHTML = MSPPortalViews.renderTechScriptSection(tabId, e.target.value);
                    }, 300);
                });
            }

            // SCuBA expand/copy interactions
            this.bindScubaInteractions();
        }, 0);
    },

    bindScubaInteractions: function() {
        // Baseline expand/collapse
        document.querySelectorAll('.scuba-expand-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const expandId = e.currentTarget.dataset.expand;
                const card = document.querySelector('[data-baseline-id="' + expandId + '"]');
                if (!card) return;
                const detail = card.querySelector('.scuba-baseline-detail');
                if (!detail) return;
                const isHidden = detail.style.display === 'none';
                detail.style.display = isHidden ? 'block' : 'none';
                e.currentTarget.classList.toggle('expanded', isHidden);
            });
        });

        // Copy-to-clipboard
        document.querySelectorAll('.scuba-copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.currentTarget.dataset.copy;
                if (!text) return;
                navigator.clipboard.writeText(text.replace(/&quot;/g, '"')).then(() => {
                    const orig = e.currentTarget.innerHTML;
                    e.currentTarget.innerHTML = '<span style="font-size:11px;">Copied!</span>';
                    setTimeout(() => { e.currentTarget.innerHTML = orig; }, 1500);
                });
            });
        });
    },

    switchView: function(viewId) {
        this.state.activeView = viewId;
        document.querySelectorAll('.msp-nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewId));
        const nav = this.navigation.find(n => n.id === viewId);
        document.getElementById('msp-view-title').textContent = nav?.name || viewId;
        document.getElementById('msp-portal-content').innerHTML = this.renderView(viewId);
        this.attachDataViewEvents();
    },

    refresh: function() { this.loadState(); this.switchView(this.state.activeView); },

    getStats: function() {
        const c = this.state.clients;
        return { totalClients: c.length, compliant: c.filter(x => x.completionPercent >= 100).length, inProgress: c.filter(x => x.completionPercent > 0 && x.completionPercent < 100).length, atRisk: c.filter(x => x.sprsScore !== null && x.sprsScore < 70).length };
    },

    renderView: function(viewId) {
        if (typeof MSPPortalViews !== 'undefined' && MSPPortalViews[viewId]) {
            return MSPPortalViews[viewId](this);
        }
        return this.renderDashboard();
    },

    renderDashboard: function() {
        const stats = this.getStats();
        return `
        <div class="msp-dashboard">
            <div class="msp-dashboard-stats">
                <div class="msp-stat-card primary"><div class="stat-icon">${this.getIcon('users')}</div><div class="stat-content"><div class="stat-value">${stats.totalClients}</div><div class="stat-label">Total Clients</div></div></div>
                <div class="msp-stat-card success"><div class="stat-icon">${this.getIcon('check-circle')}</div><div class="stat-content"><div class="stat-value">${stats.compliant}</div><div class="stat-label">Assessment Ready</div></div></div>
                <div class="msp-stat-card warning"><div class="stat-icon">${this.getIcon('clock')}</div><div class="stat-content"><div class="stat-value">${stats.inProgress}</div><div class="stat-label">In Progress</div></div></div>
                <div class="msp-stat-card danger"><div class="stat-icon">${this.getIcon('alert-triangle')}</div><div class="stat-content"><div class="stat-value">${stats.atRisk}</div><div class="stat-label">At Risk</div></div></div>
            </div>
            <div class="msp-dashboard-grid">
                <div class="msp-card"><div class="msp-card-header"><h3>Quick Actions</h3></div><div class="msp-card-body">
                    <div class="msp-quick-actions">
                        <button class="msp-action-btn" onclick="MSPPortal.switchView('clients')">${this.getIcon('user-plus')}<span>Add Client</span></button>
                        <button class="msp-action-btn" onclick="MSPPortal.switchView('env-setup')">${this.getIcon('server')}<span>Environment Setup</span></button>
                        <button class="msp-action-btn" onclick="MSPPortal.switchView('reports')">${this.getIcon('file-text')}<span>Generate Report</span></button>
                        <button class="msp-action-btn" onclick="MSPPortal.switchView('siem')">${this.getIcon('activity')}<span>SIEM Dashboard</span></button>
                    </div>
                </div></div>
                <div class="msp-card"><div class="msp-card-header"><h3>Recent Activity</h3></div><div class="msp-card-body">${this.renderRecentActivity()}</div></div>
                <div class="msp-card full-width"><div class="msp-card-header"><h3>Client Overview</h3><button class="msp-btn-text" onclick="MSPPortal.switchView('clients')">View All</button></div><div class="msp-card-body">${this.renderClientTable()}</div></div>
            </div>
        </div>`;
    },

    renderRecentActivity: function() {
        if (this.state.clients.length === 0) return '<div class="msp-empty-state">No recent activity</div>';
        return '<div class="msp-activity-list"><div class="activity-item"><span class="activity-icon">📊</span><span>Portfolio initialized</span></div></div>';
    },

    renderClientTable: function() {
        if (this.state.clients.length === 0) return `<div class="msp-empty-state"><p>No clients yet</p><button class="msp-btn-primary" onclick="MSPPortal.showAddClientModal()">${this.getIcon('user-plus')} Add First Client</button></div>`;
        return `<table class="msp-table"><thead><tr><th>Organization</th><th>Level</th><th>SPRS</th><th>Progress</th><th>Status</th></tr></thead><tbody>
            ${this.state.clients.slice(0, 5).map(c => `<tr><td><strong>${c.name}</strong></td><td><span class="level-badge">L${c.assessmentLevel}</span></td><td class="${c.sprsScore >= 70 ? 'sprs-good' : c.sprsScore >= 0 ? 'sprs-warning' : ''}">${c.sprsScore ?? '--'}</td><td><div class="progress-bar-mini"><div class="progress-fill" style="width:${c.completionPercent||0}%"></div></div></td><td>${c.completionPercent >= 100 ? '<span class="status-badge success">Ready</span>' : '<span class="status-badge warning">In Progress</span>'}</td></tr>`).join('')}
        </tbody></table>`;
    },

    showAddClientModal: function() {
        // Try PortfolioDashboard first, otherwise show our own modal
        if (typeof PortfolioDashboard !== 'undefined' && PortfolioDashboard.showAddClientModal) {
            PortfolioDashboard.showAddClientModal();
            return;
        }
        
        // Show MSP Portal's own add client modal
        const modalHtml = `
        <div class="msp-modal-overlay" id="msp-add-client-modal">
            <div class="msp-modal">
                <div class="msp-modal-header">
                    <h3>${this.getIcon('user-plus')} Add New Client</h3>
                    <button class="msp-modal-close" onclick="MSPPortal.closeAddClientModal()">${this.getIcon('x')}</button>
                </div>
                <div class="msp-modal-body">
                    <form id="msp-add-client-form">
                        <div class="msp-form-group">
                            <label for="client-name">Organization Name *</label>
                            <input type="text" id="client-name" name="name" required placeholder="Enter organization name">
                        </div>
                        <div class="msp-form-row">
                            <div class="msp-form-group">
                                <label for="client-level">CMMC Level *</label>
                                <select id="client-level" name="assessmentLevel" required>
                                    <option value="1">Level 1 (FCI)</option>
                                    <option value="2" selected>Level 2 (CUI)</option>
                                    <option value="3">Level 3 (Enhanced)</option>
                                </select>
                            </div>
                            <div class="msp-form-group">
                                <label for="client-industry">Industry</label>
                                <select id="client-industry" name="industry">
                                    <option value="Defense">Defense Contractor</option>
                                    <option value="Aerospace">Aerospace</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="IT Services">IT Services</option>
                                    <option value="Research">Research</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="msp-form-row">
                            <div class="msp-form-group">
                                <label for="client-sprs">Current SPRS Score</label>
                                <input type="number" id="client-sprs" name="sprsScore" min="-203" max="110" placeholder="e.g., 75">
                            </div>
                            <div class="msp-form-group">
                                <label for="client-assessment-date">Target Assessment Date</label>
                                <input type="date" id="client-assessment-date" name="nextAssessment">
                            </div>
                        </div>
                        <div class="msp-form-group">
                            <label for="client-contact">Primary Contact</label>
                            <input type="text" id="client-contact" name="contact" placeholder="Contact name">
                        </div>
                        <div class="msp-form-group">
                            <label for="client-email">Contact Email</label>
                            <input type="email" id="client-email" name="email" placeholder="contact@company.com">
                        </div>
                        <div class="msp-form-group">
                            <label for="client-notes">Notes</label>
                            <textarea id="client-notes" name="notes" rows="3" placeholder="Additional notes about this client..."></textarea>
                        </div>
                    </form>
                </div>
                <div class="msp-modal-footer">
                    <button class="msp-btn-secondary" onclick="MSPPortal.closeAddClientModal()">Cancel</button>
                    <button class="msp-btn-primary" onclick="MSPPortal.submitAddClient()">${this.getIcon('check-circle')} Add Client</button>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    closeAddClientModal: function() {
        document.getElementById('msp-add-client-modal')?.remove();
    },

    submitAddClient: function() {
        const form = document.getElementById('msp-add-client-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const formData = new FormData(form);
        const clientData = {
            name: formData.get('name'),
            assessmentLevel: formData.get('assessmentLevel'),
            industry: formData.get('industry'),
            sprsScore: formData.get('sprsScore') ? parseInt(formData.get('sprsScore')) : null,
            nextAssessment: formData.get('nextAssessment') || null,
            contact: formData.get('contact'),
            email: formData.get('email'),
            notes: formData.get('notes'),
            completionPercent: 0,
            poamCount: 0
        };
        
        this.addClient(clientData);
        this.closeAddClientModal();
        this.switchView('clients');
    },

    addClient: function(data) {
        const client = { id: 'client_' + Date.now(), ...data, createdAt: new Date().toISOString() };
        this.state.clients.push(client);
        this.saveState();
        return client;
    },

    openClientProject: function(clientId) {
        this.state.activeClient = clientId;
        this.switchView('projects');
    },

    editClient: function(clientId) {
        const client = this.state.clients.find(c => c.id === clientId);
        if (!client) return;
        const esc = typeof Sanitize !== 'undefined' ? Sanitize.html : (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const modalHtml = `
        <div class="msp-modal-overlay" id="msp-edit-client-modal">
            <div class="msp-modal">
                <div class="msp-modal-header">
                    <h3>${this.getIcon('edit')} Edit Client</h3>
                    <button class="msp-modal-close" onclick="MSPPortal.closeEditClientModal()">${this.getIcon('x')}</button>
                </div>
                <div class="msp-modal-body">
                    <form id="msp-edit-client-form">
                        <input type="hidden" name="id" value="${client.id}">
                        <div class="msp-form-group">
                            <label for="edit-client-name">Organization Name *</label>
                            <input type="text" id="edit-client-name" name="name" required value="${esc(client.name || '')}" maxlength="200">
                        </div>
                        <div class="msp-form-row">
                            <div class="msp-form-group">
                                <label for="edit-client-level">CMMC Level *</label>
                                <select id="edit-client-level" name="assessmentLevel" required>
                                    <option value="1" ${client.assessmentLevel == '1' ? 'selected' : ''}>Level 1 (FCI)</option>
                                    <option value="2" ${client.assessmentLevel == '2' ? 'selected' : ''}>Level 2 (CUI)</option>
                                    <option value="3" ${client.assessmentLevel == '3' ? 'selected' : ''}>Level 3 (Enhanced)</option>
                                </select>
                            </div>
                            <div class="msp-form-group">
                                <label for="edit-client-industry">Industry</label>
                                <select id="edit-client-industry" name="industry">
                                    ${['Defense','Aerospace','Manufacturing','IT Services','Research','Other'].map(i => `<option value="${i}" ${client.industry === i ? 'selected' : ''}>${i === 'Defense' ? 'Defense Contractor' : i}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="msp-form-row">
                            <div class="msp-form-group">
                                <label for="edit-client-sprs">Current SPRS Score</label>
                                <input type="number" id="edit-client-sprs" name="sprsScore" min="-203" max="110" value="${client.sprsScore ?? ''}">
                            </div>
                            <div class="msp-form-group">
                                <label for="edit-client-assessment-date">Target Assessment Date</label>
                                <input type="date" id="edit-client-assessment-date" name="nextAssessment" value="${client.nextAssessment || ''}">
                            </div>
                        </div>
                        <div class="msp-form-group">
                            <label for="edit-client-contact">Primary Contact</label>
                            <input type="text" id="edit-client-contact" name="contact" value="${esc(client.contact || '')}" maxlength="200">
                        </div>
                        <div class="msp-form-group">
                            <label for="edit-client-email">Contact Email</label>
                            <input type="email" id="edit-client-email" name="email" value="${esc(client.email || '')}">
                        </div>
                        <div class="msp-form-group">
                            <label for="edit-client-notes">Notes</label>
                            <textarea id="edit-client-notes" name="notes" rows="3" maxlength="5000">${esc(client.notes || '')}</textarea>
                        </div>
                    </form>
                </div>
                <div class="msp-modal-footer">
                    <button class="msp-btn-danger" onclick="MSPPortal.confirmRemoveClient('${client.id}')" style="margin-right:auto">${this.getIcon('x')} Remove Client</button>
                    <button class="msp-btn-secondary" onclick="MSPPortal.closeEditClientModal()">Cancel</button>
                    <button class="msp-btn-primary" onclick="MSPPortal.submitEditClient()">${this.getIcon('check-circle')} Save Changes</button>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    closeEditClientModal: function() {
        document.getElementById('msp-edit-client-modal')?.remove();
    },

    submitEditClient: function() {
        const form = document.getElementById('msp-edit-client-form');
        if (!form || !form.checkValidity()) { form?.reportValidity(); return; }
        const fd = new FormData(form);
        const id = fd.get('id');
        const idx = this.state.clients.findIndex(c => c.id === id);
        if (idx === -1) return;
        this.state.clients[idx] = {
            ...this.state.clients[idx],
            name: fd.get('name'),
            assessmentLevel: fd.get('assessmentLevel'),
            industry: fd.get('industry'),
            sprsScore: fd.get('sprsScore') ? parseInt(fd.get('sprsScore')) : null,
            nextAssessment: fd.get('nextAssessment') || null,
            contact: fd.get('contact'),
            email: fd.get('email'),
            notes: fd.get('notes'),
            updatedAt: new Date().toISOString()
        };
        this.saveState();
        this.closeEditClientModal();
        this.switchView('clients');
    },

    confirmRemoveClient: function(clientId) {
        const client = this.state.clients.find(c => c.id === clientId);
        if (!client) return;
        if (confirm('Remove client "' + client.name + '"? This action cannot be undone.')) {
            this.removeClient(clientId);
            this.closeEditClientModal();
            this.switchView('clients');
        }
    },

    removeClient: function(clientId) {
        this.state.clients = this.state.clients.filter(c => c.id !== clientId);
        delete this.state.projectPlans[clientId];
        if (this.state.activeClient === clientId) this.state.activeClient = null;
        this.saveState();
    },

    filterClients: function(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        document.querySelectorAll('.msp-client-card').forEach(card => {
            const name = card.querySelector('h4')?.textContent?.toLowerCase() || '';
            const industry = card.querySelector('.client-industry')?.textContent?.toLowerCase() || '';
            card.style.display = (term === '' || name.includes(term) || industry.includes(term)) ? '' : 'none';
        });
    },

    exportPortfolio: function() {
        if (this.state.clients.length === 0) {
            if (typeof app !== 'undefined' && app.showToast) app.showToast('No clients to export', 'error');
            return;
        }
        const report = {
            title: 'MSP Portfolio Summary',
            generatedAt: new Date().toISOString(),
            totalClients: this.state.clients.length,
            clients: this.state.clients.map(c => ({
                name: c.name,
                level: 'L' + c.assessmentLevel,
                industry: c.industry || 'N/A',
                sprsScore: c.sprsScore ?? 'N/A',
                completionPercent: (c.completionPercent || 0) + '%',
                poamCount: c.poamCount || 0,
                contact: c.contact || 'N/A',
                email: c.email || 'N/A',
                targetAssessment: c.nextAssessment || 'TBD'
            }))
        };
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'msp-portfolio-' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        URL.revokeObjectURL(url);
    },

    generateReport: function(type) {
        if (typeof ReportGenerator !== 'undefined') {
            const data = typeof app !== 'undefined' ? app.assessmentData : {};
            switch(type) {
                case 'executive': ReportGenerator.generateExecutiveSummary(data); break;
                case 'gap': ReportGenerator.generateGapAnalysis(data); break;
                case 'c3pao': ReportGenerator.generateC3PAOReport(data); break;
                case 'ssp': ReportGenerator.generateSSPAppendix(data); break;
            }
        }
    }
};

// Initialize
if (typeof document !== 'undefined') {
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', () => MSPPortal.init()) : MSPPortal.init();
}
if (typeof window !== 'undefined') window.MSPPortal = MSPPortal;
