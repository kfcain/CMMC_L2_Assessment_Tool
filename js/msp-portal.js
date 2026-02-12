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
        { id: 'cloud-toolkits', name: 'Cloud Compliance Toolkits', icon: 'server', section: 'tools' },
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

    // ── Live SOC Clock (synced via NTP → WorldTimeAPI) ──────────────
    _clockInterval: null,
    _ntpOffset: 0,
    _ntpSynced: false,

    _syncNTPTime: function() {
        const self = this;
        fetch('https://worldtimeapi.org/api/timezone/Etc/UTC', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                if (data && data.utc_datetime) {
                    const serverTime = new Date(data.utc_datetime).getTime();
                    self._ntpOffset = serverTime - Date.now();
                    self._ntpSynced = true;
                    const badge = document.querySelector('.soc-sync-source');
                    if (badge) badge.textContent = 'NTP Synced';
                }
            })
            .catch(() => { self._ntpSynced = false; });
    },

    _tickClock: function() {
        const now = new Date(Date.now() + this._ntpOffset);
        const timeEl = document.querySelector('.soc-time');
        const dateEl = document.querySelector('.soc-date');
        if (timeEl) {
            const h = String(now.getUTCHours()).padStart(2, '0');
            const m = String(now.getUTCMinutes()).padStart(2, '0');
            const s = String(now.getUTCSeconds()).padStart(2, '0');
            timeEl.textContent = h + ':' + m + ':' + s + ' UTC';
        }
        if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
    },

    _startClock: function() {
        this._stopClock();
        this._syncNTPTime();
        // Tick immediately, then every second
        this._tickClock();
        const self = this;
        this._clockInterval = setInterval(function() { self._tickClock(); }, 1000);
    },

    _stopClock: function() {
        if (this._clockInterval) { clearInterval(this._clockInterval); this._clockInterval = null; }
    },

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

        // Build content with error resilience — if any view throws, portal still opens
        let sidebarHtml = '', headerHtml = '', contentHtml = '';
        try { sidebarHtml = this.renderSidebar(); } catch (e) { console.error('[MSPPortal] Sidebar render error:', e); }
        try { headerHtml = this.renderHeader(); } catch (e) { console.error('[MSPPortal] Header render error:', e); }
        try { contentHtml = this.renderView('dashboard'); } catch (e) { console.error('[MSPPortal] Dashboard render error:', e); contentHtml = '<div class="soc-empty"><p>Dashboard failed to load. Check console for errors.</p></div>'; }

        const portalEl = document.createElement('div');
        portalEl.className = 'msp-portal-overlay';
        portalEl.id = 'msp-portal';
        portalEl.innerHTML = `
            <div class="msp-portal-container">
                <div class="msp-portal-sidebar">${sidebarHtml}</div>
                <div class="msp-portal-main">
                    <div class="msp-portal-header">${headerHtml}</div>
                    <div class="msp-portal-content" id="msp-portal-content">${contentHtml}</div>
                </div>
            </div>`;
        document.body.appendChild(portalEl);
        this.attachPortalEvents(portalEl);

        // Diagnostic: identify what element is blocking clicks on the portal
        setTimeout(() => {
            const p = document.getElementById('msp-portal');
            if (!p) { console.error('[MSPPortal] Portal not in DOM!'); return; }
            const r = p.getBoundingClientRect();
            const cx = Math.round(r.left + r.width / 2);
            const cy = Math.round(r.top + r.height / 2);
            const topEl = document.elementFromPoint(cx, cy);
            const cs = getComputedStyle(p);
            console.log('[MSPPortal] Diag — z-index:', cs.zIndex,
                '| pointer-events:', cs.pointerEvents,
                '| display:', cs.display,
                '| visibility:', cs.visibility,
                '| opacity:', cs.opacity,
                '| position:', cs.position);
            console.log('[MSPPortal] Diag — portal rect:', JSON.stringify({w: r.width, h: r.height, t: r.top, l: r.left}));
            if (topEl) {
                const isPortal = topEl.closest('#msp-portal');
                console.log('[MSPPortal] Diag — elementFromPoint(' + cx + ',' + cy + '):',
                    topEl.tagName, '#' + topEl.id, '.' + topEl.className.toString().substring(0, 80),
                    isPortal ? '✓ inside portal' : '✗ BLOCKING portal');
                if (!isPortal) {
                    const bcs = getComputedStyle(topEl);
                    console.error('[MSPPortal] BLOCKER CSS — z-index:', bcs.zIndex,
                        '| position:', bcs.position,
                        '| display:', bcs.display,
                        '| pointer-events:', bcs.pointerEvents);
                    // Walk up to find the positioned ancestor
                    let el = topEl;
                    while (el && el !== document.body) {
                        const s = getComputedStyle(el);
                        if (s.position !== 'static' && s.zIndex !== 'auto') {
                            console.error('[MSPPortal] Positioned ancestor:', el.tagName, '#' + el.id, '.' + (el.className || '').toString().substring(0, 60), 'z-index:', s.zIndex);
                        }
                        el = el.parentElement;
                    }
                }
            }
        }, 300);

        // Start live clock on dashboard
        if (this.state.activeView === 'dashboard') this._startClock();

        // Escape key handler
        this._escHandler = (e) => { if (e.key === 'Escape') this.closePortal(); };
        document.addEventListener('keydown', this._escHandler);
    },

    closePortal: function() {
        this._stopClock();
        // Remove Escape handler
        if (this._escHandler) {
            document.removeEventListener('keydown', this._escHandler);
            this._escHandler = null;
        }
        // Remove portal click handler
        if (this._portalClickHandler) {
            document.removeEventListener('click', this._portalClickHandler);
            this._portalClickHandler = null;
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
        <div class="msp-sidebar-footer"><button class="msp-close-btn" data-action="close-portal">${this.getIcon('x')}<span>Close Portal</span></button></div>`;
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
            <button class="msp-header-btn" data-action="refresh">${this.getIcon('refresh-cw')}</button>
        </div>`;
    },

    _handlePortalClick: function(e) {
        // Nav buttons
        const navBtn = e.target.closest('.msp-nav-btn');
        if (navBtn) { this.switchView(navBtn.dataset.view); return; }
        // Close button
        if (e.target.closest('.msp-close-btn')) { this.closePortal(); return; }

        // data-action delegation for all portal buttons
        const actionBtn = e.target.closest('[data-action]');
        if (actionBtn) {
            const action = actionBtn.dataset.action;
            const param = actionBtn.dataset.param || '';
            switch (action) {
                case 'switch-view': this.switchView(param); break;
                case 'add-client': this.showAddClientModal(); break;
                case 'edit-client': this.editClient(param); break;
                case 'remove-client': this.confirmRemoveClient(param); break;
                case 'open-client-project': MSPPortalViews._switchKanbanClient(param); this.switchView('projects'); break;
                case 'open-hub': if (typeof IntegrationsHub !== 'undefined') IntegrationsHub.showHub(); break;
                case 'refresh': this.refresh(); break;
                case 'export-portfolio': this.exportPortfolio(); break;
                case 'generate-report': this.generateReport(param); break;
                case 'filter-clients': this.filterClients(param); break;
                case 'switch-env-tab': MSPPortalViews.switchEnvTab(param); break;
                case 'env-tab': MSPPortalViews.switchEnvTab(param); break;
                case 'add-task': MSPPortalViews._showAddTaskModal(param); break;
                case 'edit-task': MSPPortalViews._editTask(param); break;
                case 'seed-tasks': MSPPortalViews._seedDefaultTasks(param); break;
                case 'close-portal': this.closePortal(); break;
                case 'close-and-navigate':
                    this.closePortal();
                    if (window.app && typeof window.app.switchView === 'function') window.app.switchView(param);
                    break;
                case 'copy-code': {
                    const codeEl = actionBtn.closest('.dp-code-wrap, .ev-auto-cmd, .ts-code-wrap');
                    const code = codeEl ? codeEl.querySelector('code') : null;
                    if (code) {
                        navigator.clipboard.writeText(code.textContent).then(() => {
                            const orig = actionBtn.textContent;
                            actionBtn.textContent = 'Copied!';
                            setTimeout(() => { actionBtn.textContent = orig; }, 1500);
                        });
                    }
                    break;
                }
                case 'copy-data': {
                    const copyText = actionBtn.dataset.copy || '';
                    const lbl = actionBtn.dataset.label || 'Copy';
                    navigator.clipboard.writeText(copyText).then(() => {
                        actionBtn.textContent = 'Copied!';
                        setTimeout(() => { actionBtn.textContent = lbl; }, 1500);
                    });
                    break;
                }
            }
            return;
        }
    },

    attachPortalEvents: function(portalRef) {
        const self = this;

        // PRIMARY: Bind directly on the portal element.
        // This is the most reliable approach — it works regardless of
        // Cloudflare Rocket Loader, script rewriting, or other document-level
        // interference that can break document-delegated listeners.
        if (portalRef) {
            portalRef.addEventListener('click', function(e) {
                e._mspHandled = true;
                self._handlePortalClick(e);
            });
        }

        // SECONDARY: Also keep document-level delegation as a safety net
        // (e.g. for modals appended to <body> outside #msp-portal)
        this._portalClickHandler = function(e) {
            if (e._mspHandled) return; // Already handled by direct listener
            if (!e.target.closest('#msp-portal')) return;
            self._handlePortalClick(e);
        };
        document.addEventListener('click', this._portalClickHandler);

        // DIAGNOSTIC: capture-phase listener on document to detect if clicks
        // reach the document at all when portal is open
        if (!this._diagClickBound) {
            this._diagClickBound = true;
            document.addEventListener('click', function(e) {
                if (!document.getElementById('msp-portal')) return;
                const inPortal = e.target.closest('#msp-portal');
                console.log('[MSPPortal] DOC click — target:', e.target.tagName,
                    e.target.className?.toString().substring(0, 40),
                    inPortal ? '(inside portal)' : '(outside portal)');
            }, true); // capture phase
        }
        this.attachDataViewEvents();
    },

    _bindOpsSubTabs: function() {
        document.querySelectorAll('.ops-sub-tab').forEach(tab => {
            const newTab = tab.cloneNode(true);
            tab.parentNode.replaceChild(newTab, tab);
            newTab.addEventListener('click', (e) => {
                const tabBtn = e.target.closest('.ops-sub-tab');
                if (!tabBtn) return;
                const tabKey = tabBtn.dataset.opsTab;
                document.querySelectorAll('.ops-sub-tab').forEach(t => t.classList.remove('active'));
                tabBtn.classList.add('active');
                const contentEl = document.getElementById('ops-sub-content');
                if (contentEl) contentEl.innerHTML = MSPPortalViews._renderOpsSection(tabKey);
            });
        });
    },

    _bindCloudToolkitSubTabs: function() {
        document.querySelectorAll('.ctk-sub-tab').forEach(tab => {
            const newTab = tab.cloneNode(true);
            tab.parentNode.replaceChild(newTab, tab);
            newTab.addEventListener('click', (e) => {
                const subtab = e.target.dataset.subtab;
                const provider = e.target.closest('.ctk-sub-tabs')?.dataset.provider;
                if (!subtab || !provider) return;

                // Update active sub-tab
                e.target.closest('.ctk-sub-tabs').querySelectorAll('.ctk-sub-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');

                // Get the correct data source
                const dataSources = {
                    aws: typeof MSP_AWS_COMPLIANCE_TOOLKIT !== 'undefined' ? MSP_AWS_COMPLIANCE_TOOLKIT : null,
                    azure: typeof MSP_AZURE_COMPLIANCE_TOOLKIT !== 'undefined' ? MSP_AZURE_COMPLIANCE_TOOLKIT : null,
                    gcp: typeof MSP_GCP_COMPLIANCE_TOOLKIT !== 'undefined' ? MSP_GCP_COMPLIANCE_TOOLKIT : null
                };
                const data = dataSources[provider];
                if (!data) return;

                const contentEl = document.getElementById(`ctk-sub-content-${provider}`);
                if (contentEl) {
                    contentEl.innerHTML = MSPPortalViews._renderProviderSubSection(data, subtab, provider);
                }
            });
        });
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
                    const tabBtn = e.target.closest('.msp-data-tab');
                    if (!tabBtn) return;
                    const section = tabBtn.dataset.section;
                    const container = tabBtn.closest('.msp-data-view');
                    if (!container) return;
                    
                    // Update active tab
                    container.querySelectorAll('.msp-data-tab').forEach(t => t.classList.remove('active'));
                    tabBtn.classList.add('active');
                    
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
                    } else if (contentId === 'cloud-toolkits-content') {
                        contentEl.innerHTML = MSPPortalViews.renderCloudToolkitContent(section);
                        MSPPortal._bindCloudToolkitSubTabs();
                    } else if (contentId === 'data-protection-content') {
                        const data = typeof MSP_DATA_PROTECTION !== 'undefined' ? MSP_DATA_PROTECTION : null;
                        if (data) contentEl.innerHTML = MSPPortalViews.renderDataProtectionSection(data, section);
                    }
                });
            });

            // Evidence family navigation (use closest() for nested SVG/span children)
            document.querySelectorAll('.family-nav-btn').forEach(btn => {
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                newBtn.addEventListener('click', (e) => {
                    const navBtn = e.target.closest('.family-nav-btn');
                    if (!navBtn) return;
                    const familyKey = navBtn.dataset.family;
                    const data = typeof MSP_EVIDENCE_LISTS !== 'undefined' ? MSP_EVIDENCE_LISTS : null;
                    if (!data) return;
                    
                    document.querySelectorAll('.family-nav-btn').forEach(b => b.classList.remove('active'));
                    navBtn.classList.add('active');
                    
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

            // Evidence search input
            const evSearchInput = document.getElementById('ev-search-input');
            if (evSearchInput) {
                evSearchInput.addEventListener('input', (e) => {
                    const query = e.target.value.toLowerCase().trim();
                    const contentEl = document.getElementById('evidence-lists-content');
                    if (!contentEl) return;
                    const cards = contentEl.querySelectorAll('.ev-control-card');
                    cards.forEach(card => {
                        if (!query) {
                            card.style.display = '';
                            card.removeAttribute('open');
                            return;
                        }
                        const items = card.querySelectorAll('.ev-item');
                        let hasMatch = false;
                        items.forEach(item => {
                            const searchText = item.dataset.search || '';
                            const match = searchText.includes(query);
                            item.style.display = match ? '' : 'none';
                            if (match) hasMatch = true;
                        });
                        // Also check control title/id
                        const titleText = (card.querySelector('.ev-ctrl-title')?.textContent || '').toLowerCase();
                        const idText = (card.querySelector('.ev-ctrl-id')?.textContent || '').toLowerCase();
                        if (titleText.includes(query) || idText.includes(query)) hasMatch = true;
                        card.style.display = hasMatch ? '' : 'none';
                        if (hasMatch && query) card.setAttribute('open', '');
                    });
                });
            }

            // Cloud Toolkit sub-tabs (provider-level)
            this._bindCloudToolkitSubTabs();

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
                        case 'operations': contentEl.innerHTML = MSPPortalViews.renderPlaybookOperations(); MSPPortal._bindOpsSubTabs(); break;
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

            // SIEM/SOC Playbook tabs
            document.querySelectorAll('[data-siem-tab]').forEach(tab => {
                const newTab = tab.cloneNode(true);
                tab.parentNode.replaceChild(newTab, tab);
                newTab.addEventListener('click', (e) => {
                    const tabId = e.target.dataset.siemTab;
                    if (!tabId) return;
                    document.querySelectorAll('[data-siem-tab]').forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');
                    const contentEl = document.getElementById('siem-tab-content');
                    if (!contentEl) return;
                    switch (tabId) {
                        case 'overview': contentEl.innerHTML = MSPPortalViews.renderSIEMOverview(MSPPortal); break;
                        case 'siem-platforms': contentEl.innerHTML = MSPPortalViews.renderSIEMPlatforms(); break;
                        case 'soar': contentEl.innerHTML = MSPPortalViews.renderSOARSection(); break;
                        case 'ticketing': contentEl.innerHTML = MSPPortalViews.renderTicketingSection(); break;
                        case 'detection': contentEl.innerHTML = MSPPortalViews.renderDetectionEngineering(); break;
                        case 'operations': contentEl.innerHTML = MSPPortalViews.renderOperationsSection(); break;
                    }
                });
            });

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
        // Start/stop live clock based on view
        if (viewId === 'dashboard') this._startClock(); else this._stopClock();
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
        const ih = typeof IntegrationsHub !== 'undefined' ? IntegrationsHub : null;
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
        const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        // Gather integration statuses
        const integrations = ih ? Object.keys(ih.providers).map(pid => {
            const p = ih.providers[pid];
            const connected = ih.hasCredentials(pid);
            const data = ih.data[pid];
            const lastSync = data?.lastSync ? new Date(data.lastSync) : null;
            const minsAgo = lastSync ? Math.round((now - lastSync) / 60000) : null;
            return { id: pid, name: p.name, category: p.category, connected, lastSync, minsAgo, data };
        }) : [];
        const connectedCount = integrations.filter(i => i.connected).length;
        const syncedCount = integrations.filter(i => i.data).length;

        // Security metrics from integrations
        const defStats = ih?.data?.defender?.stats;
        const s1Stats = ih?.data?.sentinelone?.stats;
        const csStats = ih?.data?.crowdstrike?.stats;
        const tenStats = ih?.data?.tenable?.stats;
        const qualStats = ih?.data?.qualys?.stats;
        const entraStats = ih?.data?.entra?.stats;
        const kb4Stats = ih?.data?.knowbe4?.stats;

        const totalEndpoints = (defStats?.totalDevices || 0) + (s1Stats?.totalAgents || 0) + (csStats?.totalHosts || 0);
        const totalAlerts = (defStats?.totalAlerts || 0) + (s1Stats?.totalThreats || 0) + (csStats?.detectionCount || 0);
        const critAlerts = (defStats?.criticalAlerts || 0) + (s1Stats?.activeThreats || 0);
        const complianceRate = defStats?.complianceRate ?? (s1Stats?.healthRate ?? null);

        // Bar chart helper (CSS-only)
        const bar = (val, max, color) => {
            const pct = max > 0 ? Math.min(100, Math.round((val / max) * 100)) : 0;
            return `<div class="soc-bar-track"><div class="soc-bar-fill" style="width:${pct}%;background:${color}"></div></div>`;
        };

        return `
        <div class="soc-dashboard">
            <!-- SOC Status Bar -->
            <div class="soc-status-bar">
                <div class="soc-status-left">
                    <span class="soc-pulse"></span>
                    <span class="soc-status-text">SOC OPERATIONAL</span>
                    <span class="soc-time">${timeStr} UTC</span>
                    <span class="soc-date">${dateStr}</span>
                    <span class="soc-sync-source" title="Clock synced via NTP (worldtimeapi.org)">Syncing...</span>
                </div>
                <div class="soc-status-right">
                    <span class="soc-integrations-badge">${connectedCount} Integrations Active</span>
                    <span class="soc-sync-badge">${syncedCount} Synced</span>
                    <button class="soc-refresh-btn" data-action="refresh" title="Refresh">${this.getIcon('refresh-cw')}</button>
                </div>
            </div>

            <!-- KPI Ticker Strip -->
            <div class="soc-ticker">
                <div class="soc-ticker-item"><div class="soc-ticker-val">${stats.totalClients}</div><div class="soc-ticker-lbl">Clients</div></div>
                <div class="soc-ticker-sep"></div>
                <div class="soc-ticker-item"><div class="soc-ticker-val soc-green">${stats.compliant}</div><div class="soc-ticker-lbl">Ready</div></div>
                <div class="soc-ticker-sep"></div>
                <div class="soc-ticker-item"><div class="soc-ticker-val soc-amber">${stats.inProgress}</div><div class="soc-ticker-lbl">In Progress</div></div>
                <div class="soc-ticker-sep"></div>
                <div class="soc-ticker-item"><div class="soc-ticker-val soc-red">${stats.atRisk}</div><div class="soc-ticker-lbl">At Risk</div></div>
                <div class="soc-ticker-sep"></div>
                <div class="soc-ticker-item"><div class="soc-ticker-val">${totalEndpoints}</div><div class="soc-ticker-lbl">Endpoints</div></div>
                <div class="soc-ticker-sep"></div>
                <div class="soc-ticker-item"><div class="soc-ticker-val ${totalAlerts > 0 ? 'soc-red' : 'soc-green'}">${totalAlerts}</div><div class="soc-ticker-lbl">Alerts</div></div>
                <div class="soc-ticker-sep"></div>
                <div class="soc-ticker-item"><div class="soc-ticker-val ${critAlerts > 0 ? 'soc-red' : 'soc-green'}">${critAlerts}</div><div class="soc-ticker-lbl">Critical</div></div>
                ${complianceRate !== null ? `<div class="soc-ticker-sep"></div><div class="soc-ticker-item"><div class="soc-ticker-val ${complianceRate >= 90 ? 'soc-green' : complianceRate >= 70 ? 'soc-amber' : 'soc-red'}">${complianceRate}%</div><div class="soc-ticker-lbl">Compliance</div></div>` : ''}
                ${entraStats ? `<div class="soc-ticker-sep"></div><div class="soc-ticker-item"><div class="soc-ticker-val ${entraStats.mfaRate >= 90 ? 'soc-green' : 'soc-amber'}">${entraStats.mfaRate}%</div><div class="soc-ticker-lbl">MFA Rate</div></div>` : ''}
            </div>

            <!-- Main SOC Grid -->
            <div class="soc-grid">
                <!-- Endpoint Security Panel -->
                <div class="soc-panel">
                    <div class="soc-panel-head"><span class="soc-panel-title">${this.getIcon('shield')} Endpoint Security</span></div>
                    <div class="soc-panel-body">
                        ${totalEndpoints === 0 ? '<div class="soc-empty">Connect Defender, SentinelOne, or CrowdStrike to see endpoint data</div>' : `
                        <div class="soc-metric-rows">
                            ${defStats ? `<div class="soc-metric-row"><span class="soc-metric-name">Defender Devices</span>${bar(defStats.compliantDevices, defStats.totalDevices, 'var(--status-met)')}<span class="soc-metric-val">${defStats.compliantDevices}/${defStats.totalDevices}</span></div>` : ''}
                            ${s1Stats ? `<div class="soc-metric-row"><span class="soc-metric-name">S1 Agents</span>${bar(s1Stats.activeAgents, s1Stats.totalAgents, 'var(--status-met)')}<span class="soc-metric-val">${s1Stats.activeAgents}/${s1Stats.totalAgents}</span></div>` : ''}
                            ${csStats ? `<div class="soc-metric-row"><span class="soc-metric-name">CS Hosts</span>${bar(csStats.onlineHosts, csStats.totalHosts, 'var(--status-met)')}<span class="soc-metric-val">${csStats.onlineHosts}/${csStats.totalHosts}</span></div>` : ''}
                        </div>
                        ${critAlerts > 0 ? `<div class="soc-alert-banner soc-alert-red">${critAlerts} critical alert(s) require immediate attention</div>` : '<div class="soc-alert-banner soc-alert-green">No critical alerts</div>'}
                        `}
                    </div>
                </div>

                <!-- Vulnerability Posture Panel -->
                <div class="soc-panel">
                    <div class="soc-panel-head"><span class="soc-panel-title">${this.getIcon('activity')} Vulnerability Posture</span></div>
                    <div class="soc-panel-body">
                        ${!tenStats && !qualStats ? '<div class="soc-empty">Connect Tenable or Qualys to see vulnerability data</div>' : `
                        <div class="soc-metric-rows">
                            ${tenStats ? `
                            <div class="soc-metric-row"><span class="soc-metric-name">Critical</span>${bar(tenStats.vulnerabilities?.critical || 0, 50, '#ef4444')}<span class="soc-metric-val soc-red">${tenStats.vulnerabilities?.critical || 0}</span></div>
                            <div class="soc-metric-row"><span class="soc-metric-name">High</span>${bar(tenStats.vulnerabilities?.high || 0, 100, '#f59e0b')}<span class="soc-metric-val soc-amber">${tenStats.vulnerabilities?.high || 0}</span></div>
                            <div class="soc-metric-row"><span class="soc-metric-name">Medium</span>${bar(tenStats.vulnerabilities?.medium || 0, 200, '#6c8aff')}<span class="soc-metric-val">${tenStats.vulnerabilities?.medium || 0}</span></div>
                            <div class="soc-metric-row"><span class="soc-metric-name">Assets</span><span class="soc-metric-val">${tenStats.totalAssets || 0} scanned</span></div>
                            ` : ''}
                            ${qualStats ? `
                            <div class="soc-metric-row"><span class="soc-metric-name">Qualys Hosts</span><span class="soc-metric-val">${qualStats.hostCount || 0}</span></div>
                            <div class="soc-metric-row"><span class="soc-metric-name">Recent Scans</span><span class="soc-metric-val">${qualStats.scanCount || 0}</span></div>
                            ` : ''}
                        </div>
                        `}
                    </div>
                </div>

                <!-- Integration Status Panel -->
                <div class="soc-panel soc-wide">
                    <div class="soc-panel-head"><span class="soc-panel-title">${this.getIcon('layers')} Integration Status</span><button class="soc-panel-btn" data-action="open-hub">Open Hub</button></div>
                    <div class="soc-panel-body">
                        <div class="soc-integration-grid">
                            ${integrations.map(i => `
                            <div class="soc-int-card ${i.connected ? 'connected' : 'disconnected'}">
                                <div class="soc-int-status ${i.connected ? 'on' : 'off'}"></div>
                                <div class="soc-int-info">
                                    <span class="soc-int-name">${i.name}</span>
                                    <span class="soc-int-meta">${i.connected ? (i.minsAgo !== null ? (i.minsAgo < 60 ? i.minsAgo + 'm ago' : Math.round(i.minsAgo / 60) + 'h ago') : 'Connected') : 'Not configured'}</span>
                                </div>
                            </div>`).join('')}
                        </div>
                    </div>
                </div>

                <!-- Identity & Training Panel -->
                <div class="soc-panel">
                    <div class="soc-panel-head"><span class="soc-panel-title">${this.getIcon('users')} Identity & Training</span></div>
                    <div class="soc-panel-body">
                        ${!entraStats && !kb4Stats ? '<div class="soc-empty">Connect Entra ID or KnowBe4</div>' : `
                        <div class="soc-metric-rows">
                            ${entraStats ? `
                            <div class="soc-metric-row"><span class="soc-metric-name">MFA Enrollment</span>${bar(entraStats.mfaRate, 100, entraStats.mfaRate >= 90 ? 'var(--status-met)' : 'var(--status-partial)')}<span class="soc-metric-val">${entraStats.mfaRate}%</span></div>
                            <div class="soc-metric-row"><span class="soc-metric-name">CA Policies</span><span class="soc-metric-val">${entraStats.activePolicies || 0} active</span></div>
                            <div class="soc-metric-row"><span class="soc-metric-name">Users</span><span class="soc-metric-val">${entraStats.enabledUsers || 0} enabled</span></div>
                            ` : ''}
                            ${kb4Stats ? `
                            <div class="soc-metric-row"><span class="soc-metric-name">Training</span>${bar(kb4Stats.completionRate, 100, kb4Stats.completionRate >= 80 ? 'var(--status-met)' : 'var(--status-partial)')}<span class="soc-metric-val">${kb4Stats.completionRate}%</span></div>
                            <div class="soc-metric-row"><span class="soc-metric-name">Phish-Prone</span><span class="soc-metric-val ${(kb4Stats.avgPhishPronePercent || 0) > 15 ? 'soc-red' : 'soc-green'}">${kb4Stats.avgPhishPronePercent ?? 'N/A'}%</span></div>
                            ` : ''}
                        </div>
                        `}
                    </div>
                </div>

                <!-- Quick Actions Panel -->
                <div class="soc-panel">
                    <div class="soc-panel-head"><span class="soc-panel-title">${this.getIcon('cpu')} Quick Actions</span></div>
                    <div class="soc-panel-body">
                        <div class="soc-actions-grid">
                            <button class="soc-action-btn" data-action="switch-view" data-param="clients">${this.getIcon('user-plus')}<span>Clients</span></button>
                            <button class="soc-action-btn" data-action="switch-view" data-param="siem">${this.getIcon('activity')}<span>SIEM Ops</span></button>
                            <button class="soc-action-btn" data-action="switch-view" data-param="projects">${this.getIcon('calendar')}<span>Projects</span></button>
                            <button class="soc-action-btn" data-action="switch-view" data-param="reports">${this.getIcon('file-text')}<span>Reports</span></button>
                            <button class="soc-action-btn" data-action="switch-view" data-param="env-setup">${this.getIcon('server')}<span>Env Setup</span></button>
                            <button class="soc-action-btn" data-action="open-hub">${this.getIcon('settings')}<span>Integrations</span></button>
                        </div>
                    </div>
                </div>

                <!-- Client Overview -->
                <div class="soc-panel soc-wide">
                    <div class="soc-panel-head"><span class="soc-panel-title">${this.getIcon('users')} Client Portfolio</span><button class="soc-panel-btn" data-action="switch-view" data-param="clients">View All</button></div>
                    <div class="soc-panel-body">${this.renderClientTable()}</div>
                </div>
            </div>
        </div>`;
    },

    renderClientTable: function() {
        if (this.state.clients.length === 0) return `<div class="soc-empty"><p>No clients yet</p><button class="msp-btn-primary" data-action="add-client">${this.getIcon('user-plus')} Add First Client</button></div>`;
        return `<table class="msp-table"><thead><tr><th>Organization</th><th>Level</th><th>SPRS</th><th>Progress</th><th>Status</th></tr></thead><tbody>
            ${this.state.clients.slice(0, 8).map(c => `<tr><td><strong>${c.name}</strong></td><td><span class="level-badge">L${c.assessmentLevel}</span></td><td class="${c.sprsScore >= 70 ? 'sprs-good' : c.sprsScore >= 0 ? 'sprs-warning' : ''}">${c.sprsScore ?? '--'}</td><td><div class="progress-bar-mini"><div class="progress-fill" style="width:${c.completionPercent||0}%"></div></div></td><td>${c.completionPercent >= 100 ? '<span class="status-badge success">Ready</span>' : '<span class="status-badge warning">In Progress</span>'}</td></tr>`).join('')}
        </tbody></table>`;
    },

    showAddClientModal: function() {
        // Always use MSP Portal's own modal (PortfolioDashboard modal uses
        // data-pd-action events that don't work inside the MSP portal overlay)
        const modalHtml = `
        <div class="msp-modal-overlay" id="msp-add-client-modal">
            <div class="msp-modal">
                <div class="msp-modal-header">
                    <h3>${this.getIcon('user-plus')} Add New Client</h3>
                    <button class="msp-modal-close" id="msp-add-client-close-x">${this.getIcon('x')}</button>
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
                    <button class="msp-btn-secondary" id="msp-add-client-cancel">Cancel</button>
                    <button class="msp-btn-primary" id="msp-add-client-submit">${this.getIcon('check-circle')} Add Client</button>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        // Bind modal events programmatically
        document.getElementById('msp-add-client-close-x')?.addEventListener('click', () => this.closeAddClientModal());
        document.getElementById('msp-add-client-cancel')?.addEventListener('click', () => this.closeAddClientModal());
        document.getElementById('msp-add-client-submit')?.addEventListener('click', () => this.submitAddClient());
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
        // Sync to PortfolioDashboard if available
        if (typeof PortfolioDashboard !== 'undefined') {
            PortfolioDashboard.portfolioData.clients = this.state.clients;
            PortfolioDashboard.savePortfolioData();
        }
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
                    <button class="msp-modal-close" id="msp-edit-client-close-x">${this.getIcon('x')}</button>
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
                    <button class="msp-btn-danger" id="msp-edit-client-remove" style="margin-right:auto">${this.getIcon('x')} Remove Client</button>
                    <button class="msp-btn-secondary" id="msp-edit-client-cancel">Cancel</button>
                    <button class="msp-btn-primary" id="msp-edit-client-submit">${this.getIcon('check-circle')} Save Changes</button>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        // Bind edit modal events programmatically
        document.getElementById('msp-edit-client-close-x')?.addEventListener('click', () => this.closeEditClientModal());
        document.getElementById('msp-edit-client-cancel')?.addEventListener('click', () => this.closeEditClientModal());
        document.getElementById('msp-edit-client-submit')?.addEventListener('click', () => this.submitEditClient());
        document.getElementById('msp-edit-client-remove')?.addEventListener('click', () => this.confirmRemoveClient(client.id));
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
        // Sync to PortfolioDashboard if available
        if (typeof PortfolioDashboard !== 'undefined') {
            PortfolioDashboard.portfolioData.clients = this.state.clients;
            PortfolioDashboard.savePortfolioData();
        }
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
        // Sync to PortfolioDashboard if available
        if (typeof PortfolioDashboard !== 'undefined') {
            PortfolioDashboard.portfolioData.clients = this.state.clients;
            PortfolioDashboard.savePortfolioData();
        }
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
