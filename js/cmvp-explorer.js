// NIST CMVP Explorer — fetches live data from the static CMVP API
// and renders a searchable, filterable panel of FIPS 140 validated modules.

// Controls/objectives where FIPS-validated cryptography is relevant
const FIPS_RELEVANT_CONTROLS = {
    '3.1.13':  { name: 'Remote Access Cryptography', objectives: ['3.1.13[a]','3.1.13[b]'] },
    '3.1.17':  { name: 'Wireless Access Protection', objectives: ['3.1.17[b]'] },
    '3.1.19':  { name: 'Mobile Device CUI Encryption', objectives: ['3.1.19[b]'] },
    '3.5.10':  { name: 'Cryptographic Password Protection', objectives: ['3.5.10[a]','3.5.10[b]'] },
    '3.8.6':   { name: 'Portable Storage Encryption', objectives: ['3.8.6[a]'] },
    '3.13.8':  { name: 'Data in Transit Encryption', objectives: ['3.13.8[a]','3.13.8[c]'] },
    '3.13.10': { name: 'Cryptographic Key Management', objectives: ['3.13.10[a]','3.13.10[b]'] },
    '3.13.11': { name: 'FIPS-Validated Cryptography', objectives: ['3.13.11[a]'] },
    '3.13.16': { name: 'Data at Rest Encryption', objectives: ['3.13.16[a]'] }
};

const CMVPExplorer = {
    API_BASE: 'https://ethanolivertroy.github.io/NIST-CMVP-API/api',
    cache: { modules: null, metadata: null },
    PAGE_SIZE: 24,
    currentPage: 0,
    filteredModules: [],

    async init() {
        const container = document.getElementById('cmvp-explorer-content');
        if (!container) return;
        this.container = container;
        this.render();
    },

    render() {
        this.container.innerHTML = `
            <div class="cmvp-explorer">
                <div class="cmvp-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
                    <button class="view-back-btn" data-back-view="dashboard" title="Back to Dashboard">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        Back
                    </button>
                    <div style="flex:1;min-width:250px;">
                        <h2>NIST CMVP Explorer</h2>
                        <p>Search FIPS 140-2/140-3 validated cryptographic modules from the NIST Cryptographic Module Validation Program. Relevant to <strong>SC.L2-3.13.11</strong> (CUI encryption) and CMMC cryptographic requirements.</p>
                    </div>
                    <button class="terminal-mode-toggle" id="cmvp-terminal-toggle">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                        Terminal Mode
                    </button>
                </div>
                <div id="cmvp-terminal-container" style="display:none;margin-bottom:20px;"></div>
                <div id="cmvp-gui-content">
                <div class="cmvp-context-note">
                    <strong>Why CMVP matters for CMMC:</strong> CMMC Level 2 control SC.L2-3.13.11 requires FIPS-validated cryptography to protect CUI. Use this explorer to verify that your cryptographic modules (VPN appliances, disk encryption, TLS libraries, etc.) hold active FIPS 140 certificates.
                </div>
                <div class="cmvp-stats-bar" id="cmvp-stats-bar">
                    <div class="cmvp-stat"><span class="cmvp-stat-value">—</span><span class="cmvp-stat-label">Active Modules</span></div>
                    <div class="cmvp-stat"><span class="cmvp-stat-value">—</span><span class="cmvp-stat-label">Historical</span></div>
                    <div class="cmvp-stat"><span class="cmvp-stat-value">—</span><span class="cmvp-stat-label">In Process</span></div>
                </div>
                <div class="cmvp-search-bar">
                    <input type="text" class="cmvp-search-input" id="cmvp-search" placeholder="Search by vendor, module name, or cert #..." autocomplete="off">
                    <select class="cmvp-filter-select" id="cmvp-standard-filter">
                        <option value="all">All Standards</option>
                        <option value="FIPS 140-3">FIPS 140-3</option>
                        <option value="FIPS 140-2">FIPS 140-2</option>
                    </select>
                    <select class="cmvp-filter-select" id="cmvp-level-filter">
                        <option value="all">All Levels</option>
                        <option value="1">Level 1</option>
                        <option value="2">Level 2</option>
                        <option value="3">Level 3</option>
                        <option value="4">Level 4</option>
                    </select>
                    <select class="cmvp-filter-select" id="cmvp-type-filter">
                        <option value="all">All Types</option>
                        <option value="Software">Software</option>
                        <option value="Hardware">Hardware</option>
                        <option value="Firmware">Firmware</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                    <select class="cmvp-filter-select" id="cmvp-status-filter">
                        <option value="Active">Active</option>
                        <option value="all">All Statuses</option>
                        <option value="Revoked">Revoked</option>
                    </select>
                    <button class="cmvp-search-btn" id="cmvp-search-btn">Search</button>
                </div>
                <div id="cmvp-results-info" class="cmvp-results-info"></div>
                <div id="cmvp-results" class="cmvp-modules-grid"></div>
                <div id="cmvp-load-more" style="text-align:center;margin-top:16px;display:none;">
                    <button class="cmvp-search-btn" id="cmvp-load-more-btn">Load More</button>
                </div>
                </div>
            </div>
        `;
        this.bindEvents();
        this.bindTerminalToggle();
        this.loadData();
    },

    bindEvents() {
        const searchInput = document.getElementById('cmvp-search');
        const searchBtn = document.getElementById('cmvp-search-btn');
        const loadMoreBtn = document.getElementById('cmvp-load-more-btn');

        const doSearch = () => { this.currentPage = 0; this.applyFilters(); };

        searchBtn?.addEventListener('click', doSearch);
        searchInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
        loadMoreBtn?.addEventListener('click', () => this.loadMore());

        ['cmvp-standard-filter', 'cmvp-level-filter', 'cmvp-type-filter', 'cmvp-status-filter'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', doSearch);
        });

        // Delegate save-to-inventory clicks
        this.container.addEventListener('click', (e) => {
            const btn = e.target.closest('.cmvp-save-btn');
            if (btn) this.saveCertToInventory(btn);
        });
    },

    async loadData() {
        const resultsEl = document.getElementById('cmvp-results');
        resultsEl.innerHTML = `<div class="cmvp-loading"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg><br>Loading CMVP data...</div>`;

        try {
            const [modulesRes, metaRes] = await Promise.all([
                this.fetchJSON('/modules.json'),
                this.fetchJSON('/metadata.json')
            ]);
            this.cache.modules = modulesRes.modules || [];
            this.cache.metadata = metaRes;
            this.renderStats(metaRes);
            this.applyFilters();
        } catch (err) {
            console.error('[CMVP] Failed to load data:', err);
            resultsEl.innerHTML = `<div class="cmvp-empty">Failed to load CMVP data. Check your network connection and try again.<br><small>${err.message}</small></div>`;
        }
    },

    async fetchJSON(endpoint) {
        const resp = await fetch(this.API_BASE + endpoint);
        if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${endpoint}`);
        return resp.json();
    },

    renderStats(meta) {
        const bar = document.getElementById('cmvp-stats-bar');
        if (!bar || !meta) return;
        bar.innerHTML = `
            <div class="cmvp-stat"><span class="cmvp-stat-value">${(meta.total_modules || 0).toLocaleString()}</span><span class="cmvp-stat-label">Active Modules</span></div>
            <div class="cmvp-stat"><span class="cmvp-stat-value">${(meta.total_historical_modules || 0).toLocaleString()}</span><span class="cmvp-stat-label">Historical</span></div>
            <div class="cmvp-stat"><span class="cmvp-stat-value">${(meta.total_modules_in_process || 0).toLocaleString()}</span><span class="cmvp-stat-label">In Process</span></div>
            <div class="cmvp-stat"><span class="cmvp-stat-value">${(meta.total_certificates_with_algorithms || 0).toLocaleString()}</span><span class="cmvp-stat-label">With Algorithms</span></div>
        `;
    },

    applyFilters() {
        if (!this.cache.modules) return;
        const query = (document.getElementById('cmvp-search')?.value || '').toLowerCase().trim();
        const standard = document.getElementById('cmvp-standard-filter')?.value || 'all';
        const level = document.getElementById('cmvp-level-filter')?.value || 'all';
        const type = document.getElementById('cmvp-type-filter')?.value || 'all';
        const status = document.getElementById('cmvp-status-filter')?.value || 'Active';

        this.filteredModules = this.cache.modules.filter(m => {
            if (query) {
                const haystack = `${m['Vendor Name'] || ''} ${m.module_name || m['Module Name'] || ''} ${m['Certificate Number'] || ''}`.toLowerCase();
                if (!haystack.includes(query)) return false;
            }
            if (standard !== 'all' && m.standard !== standard) return false;
            if (level !== 'all' && String(m.overall_level) !== level) return false;
            if (type !== 'all' && (m.module_type || m['Module Type'] || '') !== type) return false;
            if (status !== 'all' && (m.status || '') !== status) return false;
            return true;
        });

        const info = document.getElementById('cmvp-results-info');
        if (info) info.textContent = `Showing ${Math.min(this.PAGE_SIZE, this.filteredModules.length)} of ${this.filteredModules.length} modules`;

        this.currentPage = 0;
        this.renderPage();
    },

    renderPage() {
        const resultsEl = document.getElementById('cmvp-results');
        const loadMoreEl = document.getElementById('cmvp-load-more');
        if (!resultsEl) return;

        const start = 0;
        const end = (this.currentPage + 1) * this.PAGE_SIZE;
        const visible = this.filteredModules.slice(start, end);

        if (visible.length === 0) {
            resultsEl.innerHTML = `<div class="cmvp-empty">No modules match your search criteria.</div>`;
            if (loadMoreEl) loadMoreEl.style.display = 'none';
            return;
        }

        resultsEl.innerHTML = visible.map(m => this.renderModuleCard(m)).join('');

        const info = document.getElementById('cmvp-results-info');
        if (info) info.textContent = `Showing ${visible.length} of ${this.filteredModules.length} modules`;

        if (loadMoreEl) {
            loadMoreEl.style.display = end < this.filteredModules.length ? 'block' : 'none';
        }
    },

    loadMore() {
        this.currentPage++;
        this.renderPage();
    },

    renderModuleCard(m) {
        const certNum = m['Certificate Number'] || '—';
        const name = m.module_name || m['Module Name'] || 'Unknown Module';
        const vendor = m['Vendor Name'] || 'Unknown Vendor';
        const standard = m.standard || '—';
        const level = m.overall_level != null ? m.overall_level : '—';
        const status = m.status || '—';
        const type = m.module_type || m['Module Type'] || '—';
        const sunset = m.sunset_date || '';
        const validated = m['Validation Date'] || '';
        const certUrl = m.certificate_detail_url || m['Certificate Number_url'] || '';
        const policyUrl = m.security_policy_url || '';
        const desc = m.description || '';

        const standardClass = standard.includes('140-3') ? 'fips3' : 'fips2';
        const statusClass = status === 'Active' ? 'active' : status === 'Revoked' ? 'revoked' : '';

        let metaLines = [];
        if (validated) metaLines.push(`Validated: ${validated}`);
        if (sunset) metaLines.push(`Sunset: ${sunset}`);
        if (desc) metaLines.push(desc.length > 120 ? desc.substring(0, 120) + '...' : desc);

        let links = '';
        if (certUrl) links += `<a href="${certUrl}" target="_blank" rel="noopener" class="cmvp-link"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> Certificate</a>`;
        if (policyUrl) links += `<a href="${policyUrl}" target="_blank" rel="noopener" class="cmvp-link"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Security Policy</a>`;

        return `
            <div class="cmvp-module-card">
                <div class="cmvp-module-header">
                    <span class="cmvp-module-name">${this.esc(name)}</span>
                    <span class="cmvp-cert-num">#${this.esc(certNum)}</span>
                </div>
                <div class="cmvp-module-vendor">${this.esc(vendor)}</div>
                <div class="cmvp-module-tags">
                    <span class="cmvp-tag ${standardClass}">${this.esc(standard)}</span>
                    <span class="cmvp-tag level">Level ${this.esc(String(level))}</span>
                    <span class="cmvp-tag ${statusClass}">${this.esc(status)}</span>
                    <span class="cmvp-tag type">${this.esc(type)}</span>
                </div>
                ${metaLines.length ? `<div class="cmvp-module-meta">${metaLines.map(l => this.esc(l)).join('<br>')}</div>` : ''}
                <div class="cmvp-module-links">
                    ${links}
                    <button class="cmvp-save-btn" data-cert="${this.esc(certNum)}" data-name="${this.esc(name)}" data-vendor="${this.esc(vendor)}" data-standard="${this.esc(standard)}" data-level="${this.esc(String(level))}" data-status="${this.esc(status)}" data-type="${this.esc(type)}" title="Save to OSC Inventory">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                        Save to Inventory
                    </button>
                </div>
            </div>
        `;
    },

    bindTerminalToggle() {
        const toggle = document.getElementById('cmvp-terminal-toggle');
        if (!toggle) return;
        this.terminalActive = false;

        toggle.addEventListener('click', () => {
            this.terminalActive = !this.terminalActive;
            toggle.classList.toggle('active', this.terminalActive);
            toggle.innerHTML = this.terminalActive
                ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg> GUI Mode'
                : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> Terminal Mode';

            const termContainer = document.getElementById('cmvp-terminal-container');
            const guiContent = document.getElementById('cmvp-gui-content');

            if (this.terminalActive) {
                termContainer.style.display = 'block';
                guiContent.style.display = 'none';
                if (!this._terminalInitialized && typeof CMVPTerminal !== 'undefined') {
                    CMVPTerminal.init('cmvp-terminal-container');
                    this._terminalInitialized = true;
                }
            } else {
                termContainer.style.display = 'none';
                guiContent.style.display = 'block';
            }
        });
    },

    saveCertToInventory(btn) {
        const certNumber = btn.dataset.cert;
        const moduleName = btn.dataset.name;
        const vendor = btn.dataset.vendor;
        const standard = btn.dataset.standard;
        const level = btn.dataset.level;
        const status = btn.dataset.status;
        const moduleType = btn.dataset.type;

        // Load OSC inventory
        const oscData = JSON.parse(localStorage.getItem('osc-inventory') || '{}');
        if (!oscData.fipsCerts) oscData.fipsCerts = [];

        // Check for duplicate
        if (oscData.fipsCerts.some(c => String(c.certNumber) === String(certNumber))) {
            this.showToast(`Certificate #${certNumber} is already in your inventory.`, 'info');
            return;
        }

        // Add cert with linkedControls field
        oscData.fipsCerts.push({
            certNumber,
            moduleName,
            vendor,
            standard,
            level,
            status: status.toLowerCase(),
            moduleType,
            linkedControls: [],
            addedFrom: 'cmvp-explorer',
            addedDate: new Date().toISOString().split('T')[0]
        });

        localStorage.setItem('osc-inventory', JSON.stringify(oscData));
        this.showToast(`Certificate #${certNumber} (${moduleName}) saved to inventory.`, 'success');

        // Update button state
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Saved';
        btn.classList.add('saved');
        btn.disabled = true;
    },

    showToast(message, type) {
        let toast = document.getElementById('cmvp-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cmvp-toast';
            toast.className = 'cmvp-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.className = `cmvp-toast ${type} show`;
        setTimeout(() => toast.classList.remove('show'), 3000);
    },

    esc(str) {
        const el = document.createElement('span');
        el.textContent = str;
        return el.innerHTML;
    }
};
