// FedRAMP Marketplace Explorer
// Interactive browser for all FedRAMP authorized Cloud Service Offerings (CSOs)
// Pulls live data from the 18F/fedramp-data public JSON feed via FedRAMPMarketplace module

const FedRAMPExplorer = {
    container: null,
    allProviders: [],
    filtered: [],
    searchTerm: '',
    filters: {
        designation: 'all',
        impact: 'all',
        serviceModel: 'all',
        path: 'all'
    },
    sortField: 'name',
    sortDir: 'asc',
    page: 0,
    pageSize: 50,
    expandedId: null,
    viewMode: 'cards',        // 'cards', 'all', 'alpha', 'status', 'impact'
    expandedGroup: null,       // which group card is open

    // ── Render Entry Point ────────────────────────────────────────────
    render() {
        this.container = document.getElementById('fedramp-explorer-content');
        if (!this.container) return;

        if (typeof FedRAMPMarketplace === 'undefined') {
            this.container.innerHTML = '<div class="fre-empty">FedRAMP Marketplace module not loaded.</div>';
            return;
        }

        if (FedRAMPMarketplace.loaded) {
            this._onDataReady();
        } else if (FedRAMPMarketplace.error) {
            this._showError(FedRAMPMarketplace.error);
        } else {
            this.container.innerHTML = '<div class="fre-loading"><div class="fre-spinner"></div><span>Loading FedRAMP Marketplace data...</span></div>';
            FedRAMPMarketplace.onReady(() => {
                if (FedRAMPMarketplace.loaded) {
                    this._onDataReady();
                } else {
                    this._showError(FedRAMPMarketplace.error || 'Failed to load data');
                }
            });
            if (!FedRAMPMarketplace.loading) FedRAMPMarketplace.init();
        }
    },

    _showError(msg) {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="fre-empty" style="text-align:center;padding:40px 20px">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--status-not-met, #f87171)" stroke-width="1.5" style="margin-bottom:12px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <h3 style="margin:0 0 8px;font-size:1rem;color:var(--text-primary)">Unable to load FedRAMP Marketplace</h3>
                <p style="margin:0 0 16px;font-size:0.8rem;color:var(--text-secondary)">${typeof Sanitize !== 'undefined' ? Sanitize.html(msg) : msg}</p>
                <button class="fre-retry-btn" style="padding:8px 20px;border-radius:8px;border:1px solid var(--accent-blue);background:rgba(108,138,255,0.1);color:var(--accent-blue);cursor:pointer;font-size:0.8rem;font-weight:500">Retry</button>
            </div>`;
        var retryBtn = this.container.querySelector('.fre-retry-btn');
        if (retryBtn) retryBtn.addEventListener('click', () => {
            FedRAMPMarketplace.loaded = false;
            FedRAMPMarketplace.loading = false;
            FedRAMPMarketplace.error = null;
            this.render();
        });
    },

    _onDataReady() {
        this._pkgIndex = null; // Clear package lookup cache on data refresh
        this.allProviders = (FedRAMPMarketplace.providers || []).map(p => {
            const impact = p.Impact_Level || '';
            const rawImpact = p.Impact_Level_Raw || impact;
            const path = p.Path || '';
            const is20x = p.Is_20x || /20x/i.test(rawImpact) || path === 'Program';
            return {
                id: p.Package_ID || '',
                name: p.Cloud_Service_Provider_Name || '',
                package: p.Cloud_Service_Provider_Package || '',
                designation: p.Designation || '',
                impact: impact,
                impactRaw: rawImpact,
                is20x: is20x,
                path: path,
                serviceModel: p.Service_Model || [],
                deploymentModel: p.Deployment_Model || '',
                authDate: p.Original_Authorization_Date || '',
                sponsorAgency: p.Sponsoring_Agency || '',
                authAgency: p.Authorizing_Agency || '',
                assessor: p.Independent_Assessor || '',
                website: p.CSP_Website || '',
                description: p.CSO_Description || '',
                logoUrl: p.CSP_URL || '',
                faviconUrl: this._buildFaviconUrl(p.CSP_Website || p.CSP_URL || ''),
                atoLetters: (p.Leveraged_ATO_Letters || []).filter(l => l.Include_In_Marketplace === 'Y'),
                agencyReuseCount: p.Agency_Reuse_Count || 0,
                underlyingPackageIds: p.Underlying_CSP_Package_ID || [],
                marketplaceUrl: 'https://marketplace.fedramp.gov/products/' + (p.Package_ID || '')
            };
        });

        // Pre-resolve underlying services for card tiles
        for (const p of this.allProviders) {
            p.underlying = this._resolvePackageIds(p.underlyingPackageIds);
        }

        this._applyFilters();
        this._renderFull();
    },

    // ── Filtering & Sorting ───────────────────────────────────────────
    _applyFilters() {
        let list = this.allProviders;

        // Text search
        if (this.searchTerm) {
            const q = this.searchTerm.toLowerCase();
            list = list.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.package.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.assessor.toLowerCase().includes(q) ||
                p.sponsorAgency.toLowerCase().includes(q) ||
                p.authAgency.toLowerCase().includes(q) ||
                (p.website || '').toLowerCase().includes(q)
            );
        }

        // Designation filter
        if (this.filters.designation !== 'all') {
            list = list.filter(p => p.designation === this.filters.designation);
        }

        // Impact filter
        if (this.filters.impact !== 'all') {
            if (this.filters.impact === '20x') {
                list = list.filter(p => p.is20x);
            } else if (this.filters.impact === 'LI-SaaS') {
                list = list.filter(p => p.impact === 'LI-SaaS' || p.impact === 'Li-SaaS');
            } else {
                list = list.filter(p => p.impact === this.filters.impact && !p.is20x);
            }
        }

        // Service model filter
        if (this.filters.serviceModel !== 'all') {
            list = list.filter(p => p.serviceModel.includes(this.filters.serviceModel));
        }

        // Path filter
        if (this.filters.path !== 'all') {
            list = list.filter(p => p.path === this.filters.path);
        }

        // Sort
        const dir = this.sortDir === 'asc' ? 1 : -1;
        list.sort((a, b) => {
            let va, vb;
            if (this.sortField === 'name') {
                va = a.name.toLowerCase(); vb = b.name.toLowerCase();
            } else if (this.sortField === 'impact') {
                const pri = { 'High': 4, 'Moderate': 3, 'Low': 2, 'LI-SaaS': 1 };
                // 20x gets its own tier
                if (a.is20x) va = 5; else va = pri[a.impact] || 0;
                if (b.is20x) vb = 5; else vb = pri[b.impact] || 0;
                // skip the normal assignment below
                if (va < vb) return -1 * dir;
                if (va > vb) return 1 * dir;
                return 0;
            } else if (this.sortField === 'authDate') {
                va = a.authDate || ''; vb = b.authDate || '';
            } else if (this.sortField === 'atos') {
                va = a.atoLetters.length; vb = b.atoLetters.length;
            } else {
                va = (a[this.sortField] || '').toLowerCase();
                vb = (b[this.sortField] || '').toLowerCase();
            }
            if (va < vb) return -1 * dir;
            if (va > vb) return 1 * dir;
            return 0;
        });

        this.filtered = list;
        this.page = 0;
    },

    // ── Full Render ───────────────────────────────────────────────────
    _renderFull() {
        const stats = this._getStats();
        const esc = typeof Sanitize !== 'undefined' ? Sanitize.html.bind(Sanitize) : (s => s);
        const vm = this.viewMode;

        let html = '';

        // Back button
        html += '<button class="view-back-btn" data-back-view="dashboard"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg> Back</button>';

        // Header
        html += '<div class="fre-header">';
        html += '<div class="fre-title-row">';
        html += '<h1 class="fre-title"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg> FedRAMP Marketplace Explorer</h1>';
        html += '<div class="fre-title-meta">Live data from <a href="https://marketplace.fedramp.gov" target="_blank" rel="noopener noreferrer">marketplace.fedramp.gov</a> &middot; ' + stats.total + ' Cloud Service Offerings &middot; <button class="fre-refresh-link" id="fre-refresh-data">&#x21bb; Refresh</button></div>';
        html += '</div>';
        html += '</div>';

        // Stats strip
        html += '<div class="fre-stats">';
        html += this._statPill('Total CSOs', stats.total, 'var(--text-primary)');
        html += this._statPill('Authorized', stats.authorized, '#10b981');
        html += this._statPill('In Process', stats.inProcess, '#f59e0b');
        html += this._statPill('FedRAMP Ready', stats.ready, '#6366f1');
        html += '<span class="fre-stats-sep"></span>';
        html += this._statPill('High', stats.high, '#ef4444');
        html += this._statPill('Moderate', stats.moderate, '#f59e0b');
        html += this._statPill('Low', stats.low, '#3b82f6');
        html += this._statPill('LI-SaaS', stats.lisaas, '#06b6d4');
        html += this._statPill('20x', stats.twentyx, '#a855f7');
        html += '</div>';

        // View mode selector
        html += '<div class="fre-view-modes">';
        html += '<button class="fre-view-mode-btn' + (vm === 'cards' ? ' fre-vm-active' : '') + '" data-mode="cards"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> Cards</button>';
        html += '<button class="fre-view-mode-btn' + (vm === 'status' ? ' fre-vm-active' : '') + '" data-mode="status"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> By Status</button>';
        html += '<button class="fre-view-mode-btn' + (vm === 'impact' ? ' fre-vm-active' : '') + '" data-mode="impact"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> By Impact</button>';
        html += '<button class="fre-view-mode-btn' + (vm === 'alpha' ? ' fre-vm-active' : '') + '" data-mode="alpha"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h12M3 18h6"/></svg> A &ndash; Z</button>';
        html += '<button class="fre-view-mode-btn' + (vm === 'all' ? ' fre-vm-active' : '') + '" data-mode="all"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> List</button>';
        html += '</div>';

        // Search bar (always visible)
        html += '<div class="fre-toolbar">';
        html += '<div class="fre-search-wrap"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" class="fre-search" id="fre-search" placeholder="Search CSOs, vendors, assessors, agencies..." value="' + esc(this.searchTerm) + '" spellcheck="false" autocomplete="off"></div>';

        // Filter dropdowns (list & card view)
        if (vm === 'all' || vm === 'cards') {
            html += '<select class="fre-filter" id="fre-filter-designation"><option value="all">All Designations</option><option value="Compliant"' + (this.filters.designation === 'Compliant' ? ' selected' : '') + '>Authorized</option><option value="In Process"' + (this.filters.designation === 'In Process' ? ' selected' : '') + '>In Process</option><option value="FedRAMP Ready"' + (this.filters.designation === 'FedRAMP Ready' ? ' selected' : '') + '>FedRAMP Ready</option></select>';
            html += '<select class="fre-filter" id="fre-filter-impact"><option value="all">All Impact Levels</option><option value="High"' + (this.filters.impact === 'High' ? ' selected' : '') + '>High</option><option value="Moderate"' + (this.filters.impact === 'Moderate' ? ' selected' : '') + '>Moderate</option><option value="Low"' + (this.filters.impact === 'Low' ? ' selected' : '') + '>Low</option><option value="LI-SaaS"' + (this.filters.impact === 'LI-SaaS' ? ' selected' : '') + '>LI-SaaS</option><option value="20x"' + (this.filters.impact === '20x' ? ' selected' : '') + '>20x</option></select>';
            html += '<select class="fre-filter" id="fre-filter-service"><option value="all">All Service Models</option><option value="IaaS"' + (this.filters.serviceModel === 'IaaS' ? ' selected' : '') + '>IaaS</option><option value="PaaS"' + (this.filters.serviceModel === 'PaaS' ? ' selected' : '') + '>PaaS</option><option value="SaaS"' + (this.filters.serviceModel === 'SaaS' ? ' selected' : '') + '>SaaS</option></select>';
            html += '<select class="fre-filter" id="fre-filter-path"><option value="all">All Paths</option><option value="JAB"' + (this.filters.path === 'JAB' ? ' selected' : '') + '>JAB</option><option value="Agency"' + (this.filters.path === 'Agency' ? ' selected' : '') + '>Agency</option><option value="Program"' + (this.filters.path === 'Program' ? ' selected' : '') + '>Program (20x)</option><option value="CSP"' + (this.filters.path === 'CSP' ? ' selected' : '') + '>CSP</option></select>';
        }
        html += '</div>';

        // Result count + sort (list & card view)
        if (vm === 'all' || vm === 'cards') {
            html += '<div class="fre-sort-bar">';
            html += '<span class="fre-result-count">' + this.filtered.length + ' result' + (this.filtered.length !== 1 ? 's' : '') + '</span>';
            html += '<div class="fre-sort-controls">';
            html += '<label class="fre-sort-label">Sort by</label>';
            html += '<select class="fre-filter fre-sort-select" id="fre-sort-field">';
            html += '<option value="name"' + (this.sortField === 'name' ? ' selected' : '') + '>Name</option>';
            html += '<option value="impact"' + (this.sortField === 'impact' ? ' selected' : '') + '>Impact Level</option>';
            html += '<option value="authDate"' + (this.sortField === 'authDate' ? ' selected' : '') + '>Auth Date</option>';
            html += '<option value="atos"' + (this.sortField === 'atos' ? ' selected' : '') + '>Agency ATOs</option>';
            html += '<option value="designation"' + (this.sortField === 'designation' ? ' selected' : '') + '>Designation</option>';
            html += '</select>';
            html += '<button class="fre-sort-dir-btn" id="fre-sort-dir" title="Toggle sort direction">' + (this.sortDir === 'asc' ? '&#9650;' : '&#9660;') + '</button>';
            html += '</div>';
            html += '</div>';
        }

        // Main content area
        html += '<div id="fre-grid">';
        if (vm === 'all') {
            html += this._renderPage();
        } else if (vm === 'cards') {
            html += this._renderCardGrid();
        } else {
            html += this._renderGroupedView();
        }
        html += '</div>';

        // Pagination (list & card view)
        if (vm === 'all' || vm === 'cards') {
            html += this._renderPagination();
        }

        this.container.innerHTML = html;
        this._bindEvents();
    },

    // ── Render a page of results (list view) ──────────────────────────
    _renderPage() {
        const start = this.page * this.pageSize;
        const pageItems = this.filtered.slice(start, start + this.pageSize);
        const esc = typeof Sanitize !== 'undefined' ? Sanitize.html.bind(Sanitize) : (s => s);

        if (pageItems.length === 0) {
            return '<div class="fre-empty">No CSOs match your filters.</div>';
        }

        let html = '';
        for (const p of pageItems) {
            html += this._renderProviderCard(p, esc);
        }
        return html;
    },

    // ── Card Grid View ────────────────────────────────────────────────
    _renderCardGrid() {
        const start = this.page * this.pageSize;
        const pageItems = this.filtered.slice(start, start + this.pageSize);
        const esc = typeof Sanitize !== 'undefined' ? Sanitize.html.bind(Sanitize) : (s => s);

        if (pageItems.length === 0) {
            return '<div class="fre-empty">No CSOs match your filters.</div>';
        }

        let html = '<div class="fre-card-grid">';
        for (const p of pageItems) {
            const designCls = p.designation === 'Compliant' ? 'fre-tag-auth' :
                              p.designation === 'In Process' ? 'fre-tag-ip' : 'fre-tag-ready';
            const impactCls = p.impact === 'High' ? 'fre-impact-high' :
                              p.impact === 'Moderate' ? 'fre-impact-mod' : 'fre-impact-low';
            const svcModel = p.serviceModel.join(', ') || '—';
            const atoCount = p.atoLetters.length;
            const primaryLogo = p.faviconUrl || p.logoUrl || '';

            html += '<div class="fre-tile" data-id="' + esc(p.id) + '">';

            // Logo area
            html += '<div class="fre-tile-logo">';
            if (primaryLogo) {
                html += '<img src="' + esc(primaryLogo) + '" alt="" class="fre-tile-logo-img" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">';
            }
            html += '<div class="fre-tile-logo-fallback"' + (primaryLogo ? ' style="display:none"' : '') + '>' + esc(p.name.substring(0, 2).toUpperCase()) + '</div>';
            html += '</div>';

            // Name & package
            html += '<div class="fre-tile-name">' + esc(p.name) + '</div>';
            html += '<div class="fre-tile-package">' + esc(p.package) + '</div>';

            // Tags
            html += '<div class="fre-tile-tags">';
            html += '<span class="fre-tag ' + designCls + '">' + (p.designation === 'Compliant' ? 'Authorized' : esc(p.designation)) + '</span>';
            html += '<span class="fre-tag ' + impactCls + '">' + esc(p.impact) + '</span>';
            if (p.is20x) html += '<span class="fre-tag fre-tag-20x">20x</span>';
            html += '</div>';

            // Meta row
            html += '<div class="fre-tile-meta">';
            html += '<span title="Service Model">' + esc(svcModel) + '</span>';
            if (atoCount > 0) html += '<span title="Agency ATOs">' + atoCount + ' ATO' + (atoCount !== 1 ? 's' : '') + '</span>';
            html += '</div>';

            // Underlying authorized services
            if (p.underlying && p.underlying.length > 0) {
                html += '<div class="fre-tile-services">';
                html += '<span class="fre-tile-services-label">Built on:</span>';
                for (const u of p.underlying.slice(0, 3)) {
                    html += '<a href="' + esc(u.url) + '" target="_blank" rel="noopener noreferrer" class="fre-tile-svc-chip" onclick="event.stopPropagation()" title="' + esc(u.name) + '">' + esc(u.name.length > 22 ? u.name.substring(0, 20) + '...' : u.name) + '</a>';
                }
                if (p.underlying.length > 3) html += '<span class="fre-tile-svc-more">+' + (p.underlying.length - 3) + ' more</span>';
                html += '</div>';
            }

            // Action link
            html += '<a href="' + esc(p.marketplaceUrl) + '" target="_blank" rel="noopener noreferrer" class="fre-tile-link" onclick="event.stopPropagation()">View on Marketplace <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>';

            html += '</div>';
        }
        html += '</div>';
        return html;
    },

    // ── Grouped View Rendering ──────────────────────────────────────────
    _renderGroupedView() {
        const esc = typeof Sanitize !== 'undefined' ? Sanitize.html.bind(Sanitize) : (s => s);
        const groups = this._buildGroups();
        let html = '';

        if (groups.length === 0) {
            return '<div class="fre-empty">No CSOs match your search.</div>';
        }

        if (this.viewMode === 'alpha') {
            html += '<div class="fre-group-grid fre-group-grid-alpha">';
        } else {
            html += '<div class="fre-group-grid">';
        }

        for (const g of groups) {
            const isOpen = this.expandedGroup === g.key;
            const cardCls = 'fre-group-card' + (isOpen ? ' fre-group-open' : '') + (g.colorClass ? ' ' + g.colorClass : '');

            html += '<div class="' + cardCls + '" data-group="' + esc(g.key) + '">';

            // Group card header
            html += '<div class="fre-group-header" data-group="' + esc(g.key) + '">';
            html += '<div class="fre-group-icon">' + g.icon + '</div>';
            html += '<div class="fre-group-info">';
            html += '<div class="fre-group-name">' + esc(g.label) + '</div>';
            html += '<div class="fre-group-count">' + g.items.length + ' CSO' + (g.items.length !== 1 ? 's' : '') + '</div>';
            html += '</div>';
            if (g.badges) html += '<div class="fre-group-badges">' + g.badges + '</div>';
            html += '<svg class="fre-group-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
            html += '</div>';

            // Expanded content
            if (isOpen) {
                html += '<div class="fre-group-body">';
                html += '<div class="fre-group-body-count">' + g.items.length + ' result' + (g.items.length !== 1 ? 's' : '') + '</div>';
                html += '<div class="fre-grid">';
                for (const p of g.items) {
                    html += this._renderProviderCard(p, esc);
                }
                html += '</div>';
                html += '</div>';
            }

            html += '</div>';
        }

        html += '</div>';
        return html;
    },

    _buildGroups() {
        // Apply search filter to allProviders
        let list = this.allProviders;
        if (this.searchTerm) {
            const q = this.searchTerm.toLowerCase();
            list = list.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.package.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.assessor.toLowerCase().includes(q) ||
                p.sponsorAgency.toLowerCase().includes(q) ||
                p.authAgency.toLowerCase().includes(q) ||
                (p.website || '').toLowerCase().includes(q)
            );
        }

        // Sort within groups by name
        list = [...list].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        if (this.viewMode === 'alpha') {
            return this._buildAlphaGroups(list);
        } else if (this.viewMode === 'status') {
            return this._buildStatusGroups(list);
        } else if (this.viewMode === 'impact') {
            return this._buildImpactGroups(list);
        }
        return [];
    },

    _buildAlphaGroups(list) {
        const map = {};
        for (const p of list) {
            const ch = (p.name.charAt(0) || '#').toUpperCase();
            const letter = /[A-Z]/.test(ch) ? ch : '#';
            if (!map[letter]) map[letter] = [];
            map[letter].push(p);
        }
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
        return letters
            .filter(l => map[l] && map[l].length > 0)
            .map(l => ({
                key: 'alpha-' + l,
                label: l === '#' ? '0-9 / Other' : l,
                icon: '<span class="fre-group-letter">' + l + '</span>',
                items: map[l],
                colorClass: 'fre-group-alpha',
                badges: ''
            }));
    },

    _buildStatusGroups(list) {
        const defs = [
            { key: 'authorized', designation: 'Compliant', label: 'FedRAMP Authorized', color: '#10b981', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>', cls: 'fre-group-authorized' },
            { key: 'inprocess', designation: 'In Process', label: 'In Process', color: '#f59e0b', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>', cls: 'fre-group-inprocess' },
            { key: 'ready', designation: 'FedRAMP Ready', label: 'FedRAMP Ready', color: '#6366f1', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>', cls: 'fre-group-ready' }
        ];
        return defs.map(d => {
            const items = list.filter(p => p.designation === d.designation);
            if (items.length === 0) return null;
            // Build impact breakdown badges
            const high = items.filter(p => p.impact === 'High').length;
            const mod = items.filter(p => p.impact === 'Moderate').length;
            const low = items.filter(p => p.impact === 'Low' && !p.is20x).length;
            const lisaas = items.filter(p => p.impact === 'LI-SaaS' || p.impact === 'Li-SaaS').length;
            let badges = '';
            if (high) badges += '<span class="fre-tag fre-impact-high">' + high + ' High</span>';
            if (mod) badges += '<span class="fre-tag fre-impact-mod">' + mod + ' Moderate</span>';
            if (low) badges += '<span class="fre-tag fre-impact-low">' + low + ' Low</span>';
            if (lisaas) badges += '<span class="fre-tag fre-impact-lisaas">' + lisaas + ' LI-SaaS</span>';
            return { key: d.key, label: d.label, icon: d.icon, items, colorClass: d.cls, badges };
        }).filter(Boolean);
    },

    _buildImpactGroups(list) {
        const defs = [
            { key: 'high', filter: p => p.impact === 'High' && !p.is20x, label: 'High Impact', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>', cls: 'fre-group-high' },
            { key: 'moderate', filter: p => p.impact === 'Moderate' && !p.is20x, label: 'Moderate Impact', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', cls: 'fre-group-moderate' },
            { key: 'low', filter: p => p.impact === 'Low' && !p.is20x, label: 'Low Impact', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', cls: 'fre-group-low' },
            { key: 'lisaas', filter: p => (p.impact === 'LI-SaaS' || p.impact === 'Li-SaaS') && !p.is20x, label: 'LI-SaaS', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', cls: 'fre-group-lisaas' },
            { key: '20x', filter: p => p.is20x, label: 'FedRAMP 20x', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>', cls: 'fre-group-20x' }
        ];
        return defs.map(d => {
            const items = list.filter(d.filter);
            if (items.length === 0) return null;
            // Build status breakdown badges
            const auth = items.filter(p => p.designation === 'Compliant').length;
            const ip = items.filter(p => p.designation === 'In Process').length;
            const rdy = items.filter(p => p.designation === 'FedRAMP Ready').length;
            let badges = '';
            if (auth) badges += '<span class="fre-tag fre-tag-auth">' + auth + ' Authorized</span>';
            if (ip) badges += '<span class="fre-tag fre-tag-ip">' + ip + ' In Process</span>';
            if (rdy) badges += '<span class="fre-tag fre-tag-ready">' + rdy + ' Ready</span>';
            return { key: d.key, label: d.label, icon: d.icon, items, colorClass: d.cls, badges };
        }).filter(Boolean);
    },

    _renderProviderCard(p, esc) {
        const isExpanded = this.expandedId === p.id;
        const designCls = p.designation === 'Compliant' ? 'fre-tag-auth' :
                          p.designation === 'In Process' ? 'fre-tag-ip' : 'fre-tag-ready';
        const impactCls = p.impact === 'High' ? 'fre-impact-high' :
                          p.impact === 'Moderate' ? 'fre-impact-mod' : 'fre-impact-low';
        const authDate = p.authDate ? new Date(p.authDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '—';
        const svcModel = p.serviceModel.join(', ') || '—';
        const atoCount = p.atoLetters.length;

        let html = '<div class="fre-card' + (isExpanded ? ' fre-card-expanded' : '') + '" data-id="' + esc(p.id) + '">';

        // Card header
        html += '<div class="fre-card-header" data-id="' + esc(p.id) + '">';
        html += '<div class="fre-card-logo">';
        const primaryLogo = p.faviconUrl || p.logoUrl || '';
        if (primaryLogo) {
            html += '<img src="' + esc(primaryLogo) + '" alt="" class="fre-logo-img" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">';
        }
        html += '<div class="fre-logo-fallback"' + (primaryLogo ? ' style="display:none"' : '') + '>' + esc(p.name.charAt(0)) + '</div>';
        html += '</div>';

        html += '<div class="fre-card-info">';
        html += '<div class="fre-card-name">' + esc(p.name) + '</div>';
        html += '<div class="fre-card-package">' + esc(p.package) + '</div>';
        html += '</div>';

        html += '<div class="fre-card-tags">';
        html += '<span class="fre-tag ' + designCls + '">' + (p.designation === 'Compliant' ? 'Authorized' : esc(p.designation)) + '</span>';
        html += '<span class="fre-tag ' + impactCls + '">' + esc(p.impact) + '</span>';
        html += '</div>';

        html += '<div class="fre-card-meta">';
        html += '<span class="fre-meta-item" title="Service Model">' + esc(svcModel) + '</span>';
        html += '<span class="fre-meta-item" title="Authorization Path">' + esc(p.path || 'Agency') + '</span>';
        html += '<span class="fre-meta-item" title="Agency ATOs">' + atoCount + ' ATO' + (atoCount !== 1 ? 's' : '') + '</span>';
        html += '</div>';

        html += '<svg class="fre-card-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
        html += '</div>'; // end header

        // Expandable detail
        if (isExpanded) {
            html += this._renderCardDetail(p, esc, authDate, svcModel, atoCount);
        }

        html += '</div>'; // end card
        return html;
    },

    _renderCardDetail(p, esc, authDate, svcModel, atoCount) {
        let html = '<div class="fre-card-detail">';

        // Description
        if (p.description) {
            const desc = p.description.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
            html += '<div class="fre-detail-desc">' + esc(desc) + '</div>';
        }

        // Detail grid
        html += '<div class="fre-detail-grid">';
        html += this._detailRow('Package ID', p.id);
        html += this._detailRow('Impact Level', p.impact);
        html += this._detailRow('Service Model', svcModel);
        html += this._detailRow('Deployment', p.deploymentModel || '—');
        html += this._detailRow('Auth Path', p.path || 'Agency');
        html += this._detailRow('Auth Date', authDate);
        html += this._detailRow('Sponsor', p.sponsorAgency || '—');
        html += this._detailRow('Authorizing Agency', p.authAgency || '—');
        html += this._detailRow('3PAO Assessor', p.assessor || '—');
        html += this._detailRow('Agency ATOs', String(atoCount));
        if (p.website) {
            const url = p.website.startsWith('http') ? p.website : 'https://' + p.website;
            html += '<div class="fre-detail-row"><span class="fre-detail-key">Website</span><span class="fre-detail-val"><a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(p.website) + '</a></span></div>';
        }
        html += '</div>';

        // Leveraged / Underlying Authorized Services
        if (p.underlyingPackageIds && p.underlyingPackageIds.length > 0) {
            const resolved = this._resolvePackageIds(p.underlyingPackageIds);
            if (resolved.length > 0) {
                html += '<div class="fre-ato-section">';
                html += '<h4 class="fre-ato-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" style="vertical-align:-2px;margin-right:4px"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>Leveraged Authorized Services (' + resolved.length + ')</h4>';
                html += '<div class="fre-svc-grid">';
                for (const svc of resolved) {
                    const tip = (svc.designation === 'Compliant' ? 'Authorized' : svc.designation) + ' — ' + svc.impact;
                    html += '<a href="' + esc(svc.url) + '" target="_blank" rel="noopener noreferrer" class="fre-svc-chip" title="' + esc(tip) + '">';
                    html += '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' + (svc.designation === 'Compliant' ? '<path d="M9 12l2 2 4-4"/>' : '') + '</svg> ';
                    html += esc(svc.name) + '</a>';
                }
                html += '</div>';
                html += '</div>';
            }
        }

        // ATO Letters table
        if (atoCount > 0) {
            html += '<div class="fre-ato-section">';
            html += '<h4 class="fre-ato-title">Agency ATO Letters (' + atoCount + ')</h4>';
            html += '<div class="fre-ato-table-wrap"><table class="fre-ato-table"><thead><tr><th>Agency</th><th>Letter Date</th><th>Last Signed</th></tr></thead><tbody>';
            for (const ato of p.atoLetters) {
                const letterDate = ato.Letter_Date ? new Date(ato.Letter_Date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '—';
                const signDate = ato.Authorizing_Letter_Last_Sign_Date ? new Date(ato.Authorizing_Letter_Last_Sign_Date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '—';
                html += '<tr><td>' + esc(ato.Authorizing_Agency || '—') + '</td><td>' + letterDate + '</td><td>' + signDate + '</td></tr>';
            }
            html += '</tbody></table></div>';
            html += '</div>';
        }

        // Action links
        html += '<div class="fre-detail-actions">';
        html += '<a href="' + esc(p.marketplaceUrl) + '" target="_blank" rel="noopener noreferrer" class="fre-btn-primary"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> View on FedRAMP Marketplace</a>';
        html += '</div>';

        html += '</div>'; // end detail
        return html;
    },

    // ── Pagination ────────────────────────────────────────────────────
    _renderPagination() {
        const totalPages = Math.ceil(this.filtered.length / this.pageSize);
        if (totalPages <= 1) return '';

        let html = '<div class="fre-pagination">';
        html += '<button class="fre-page-btn" data-page="prev"' + (this.page === 0 ? ' disabled' : '') + '>&laquo; Prev</button>';

        const maxVisible = 7;
        let startPage = Math.max(0, this.page - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible);
        if (endPage - startPage < maxVisible) startPage = Math.max(0, endPage - maxVisible);

        if (startPage > 0) {
            html += '<button class="fre-page-btn" data-page="0">1</button>';
            if (startPage > 1) html += '<span class="fre-page-ellipsis">&hellip;</span>';
        }

        for (let i = startPage; i < endPage; i++) {
            html += '<button class="fre-page-btn' + (i === this.page ? ' fre-page-active' : '') + '" data-page="' + i + '">' + (i + 1) + '</button>';
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) html += '<span class="fre-page-ellipsis">&hellip;</span>';
            html += '<button class="fre-page-btn" data-page="' + (totalPages - 1) + '">' + totalPages + '</button>';
        }

        html += '<button class="fre-page-btn" data-page="next"' + (this.page >= totalPages - 1 ? ' disabled' : '') + '>Next &raquo;</button>';
        html += '</div>';
        return html;
    },

    // ── Event Binding ─────────────────────────────────────────────────
    _bindEvents() {
        const self = this;

        // View mode selector
        this.container?.querySelectorAll('.fre-view-mode-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const mode = this.dataset.mode;
                if (mode === self.viewMode) return;
                self.viewMode = mode;
                self.expandedGroup = null;
                self.expandedId = null;
                self.page = 0;
                self._renderFull();
            });
        });

        // Refresh data button
        document.getElementById('fre-refresh-data')?.addEventListener('click', async function() {
            this.textContent = 'Refreshing...';
            this.disabled = true;
            try {
                await FedRAMPMarketplace.forceRefresh();
                self._onDataReady();
            } catch (e) {
                self._showError('Refresh failed: ' + e.message);
            }
        });

        // Search
        const searchInput = document.getElementById('fre-search');
        let searchTimer = null;
        searchInput?.addEventListener('input', function() {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                self.searchTerm = this.value.trim();
                self.expandedGroup = null;
                self._applyFilters();
                self._updateResults();
            }, 200);
        });

        // Filters (list view only)
        document.getElementById('fre-filter-designation')?.addEventListener('change', function() {
            self.filters.designation = this.value;
            self._applyFilters();
            self._updateResults();
        });
        document.getElementById('fre-filter-impact')?.addEventListener('change', function() {
            self.filters.impact = this.value;
            self._applyFilters();
            self._updateResults();
        });
        document.getElementById('fre-filter-service')?.addEventListener('change', function() {
            self.filters.serviceModel = this.value;
            self._applyFilters();
            self._updateResults();
        });
        document.getElementById('fre-filter-path')?.addEventListener('change', function() {
            self.filters.path = this.value;
            self._applyFilters();
            self._updateResults();
        });

        // Sort (list view only)
        document.getElementById('fre-sort-field')?.addEventListener('change', function() {
            self.sortField = this.value;
            self._applyFilters();
            self._updateResults();
        });
        document.getElementById('fre-sort-dir')?.addEventListener('click', function() {
            self.sortDir = self.sortDir === 'asc' ? 'desc' : 'asc';
            this.innerHTML = self.sortDir === 'asc' ? '&#9650;' : '&#9660;';
            self._applyFilters();
            self._updateResults();
        });

        // Delegated click handler for cards, groups, pagination.
        // Bind directly on the container element (primary) AND on document (fallback).
        // Direct binding is more reliable against Cloudflare Rocket Loader and
        // other script rewriters that can break document-level delegation.
        if (this._docClickHandler) document.removeEventListener('click', this._docClickHandler);
        if (this._containerClickHandler && this.container) {
            this.container.removeEventListener('click', this._containerClickHandler);
        }

        this._containerClickHandler = function(e) {
            // Group card expand/collapse
            const groupHeader = e.target.closest('.fre-group-header');
            if (groupHeader) {
                const key = groupHeader.dataset.group;
                self.expandedGroup = self.expandedGroup === key ? null : key;
                self.expandedId = null;
                self._updateResults();
                // Scroll to the group
                if (self.expandedGroup) {
                    setTimeout(() => {
                        const card = self.container?.querySelector('.fre-group-card[data-group="' + key + '"]');
                        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                }
                return;
            }

            // Provider card expand/collapse
            const header = e.target.closest('.fre-card-header');
            if (header) {
                const id = header.dataset.id;
                self.expandedId = self.expandedId === id ? null : id;
                self._updateResults();
                return;
            }

            // Tile click (card grid view) — expand to detail
            const tile = e.target.closest('.fre-tile');
            if (tile && !e.target.closest('a')) {
                const id = tile.dataset.id;
                self.expandedId = self.expandedId === id ? null : id;
                self._updateResults();
                return;
            }

            // Pagination (list view)
            const pageBtn = e.target.closest('.fre-page-btn');
            if (pageBtn && !pageBtn.disabled) {
                const val = pageBtn.dataset.page;
                const totalPages = Math.ceil(self.filtered.length / self.pageSize);
                if (val === 'prev') self.page = Math.max(0, self.page - 1);
                else if (val === 'next') self.page = Math.min(totalPages - 1, self.page + 1);
                else self.page = parseInt(val);
                self._updateResults();
                document.getElementById('fre-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        // PRIMARY: direct binding on container
        if (this.container) {
            this.container.addEventListener('click', function(e) {
                e._freHandled = true;
                self._containerClickHandler(e);
            });
        }

        // SECONDARY: document-level fallback
        this._docClickHandler = function(e) {
            if (e._freHandled) return; // Already handled by direct listener
            if (!e.target.closest('#fedramp-explorer-content')) return;
            self._containerClickHandler(e);
        };
        document.addEventListener('click', this._docClickHandler);
    },

    // ── Partial re-render (grid + pagination + count) ─────────────────
    _updateResults() {
        const grid = document.getElementById('fre-grid');
        if (!grid) return;

        if (this.viewMode === 'all' || this.viewMode === 'cards') {
            // List/card view: update grid + pagination + count
            grid.innerHTML = this.viewMode === 'cards' ? this._renderCardGrid() : this._renderPage();

            const existingPag = this.container?.querySelector('.fre-pagination');
            const newPag = this._renderPagination();
            if (existingPag) {
                existingPag.outerHTML = newPag;
            } else if (newPag) {
                grid.insertAdjacentHTML('afterend', newPag);
            }

            const countEl = this.container?.querySelector('.fre-result-count');
            if (countEl) countEl.textContent = this.filtered.length + ' result' + (this.filtered.length !== 1 ? 's' : '');
        } else {
            // Grouped view: re-render group cards
            grid.innerHTML = this._renderGroupedView();
        }
    },

    // ── Helpers ────────────────────────────────────────────────────────
    _getStats() {
        const all = this.allProviders;
        return {
            total: all.length,
            authorized: all.filter(p => p.designation === 'Compliant').length,
            inProcess: all.filter(p => p.designation === 'In Process').length,
            ready: all.filter(p => p.designation === 'FedRAMP Ready').length,
            high: all.filter(p => p.impact === 'High' && !p.is20x).length,
            moderate: all.filter(p => p.impact === 'Moderate' && !p.is20x).length,
            low: all.filter(p => p.impact === 'Low' && !p.is20x).length,
            lisaas: all.filter(p => (p.impact === 'LI-SaaS' || p.impact === 'Li-SaaS') && !p.is20x).length,
            twentyx: all.filter(p => p.is20x).length
        };
    },

    _statPill(label, value, color) {
        return '<div class="fre-stat"><span class="fre-stat-val" style="color:' + color + '">' + value + '</span><span class="fre-stat-label">' + label + '</span></div>';
    },

    _detailRow(key, val) {
        const esc = typeof Sanitize !== 'undefined' ? Sanitize.html.bind(Sanitize) : (s => s);
        return '<div class="fre-detail-row"><span class="fre-detail-key">' + esc(key) + '</span><span class="fre-detail-val">' + esc(val) + '</span></div>';
    },

    _formatDate(dateStr) {
        if (!dateStr) return 'recently';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch { return 'recently'; }
    },

    _buildFaviconUrl(urlOrDomain) {
        if (!urlOrDomain) return '';
        try {
            let domain = urlOrDomain.trim();
            // Strip protocol if present
            domain = domain.replace(/^https?:\/\//i, '');
            // Strip path
            domain = domain.split('/')[0];
            // Strip www.
            domain = domain.replace(/^www\./i, '');
            if (!domain || domain.includes(' ')) return '';
            return 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(domain) + '&sz=64';
        } catch { return ''; }
    },

    _resolvePackageIds(packageIds) {
        if (!packageIds || !packageIds.length || !FedRAMPMarketplace.providers) return [];
        // Build a quick lookup from Package_ID → provider info
        if (!this._pkgIndex) {
            this._pkgIndex = new Map();
            for (const p of FedRAMPMarketplace.providers) {
                if (p.Package_ID) this._pkgIndex.set(p.Package_ID, p);
            }
        }
        const results = [];
        for (const pid of packageIds) {
            const match = this._pkgIndex.get(pid);
            if (match) {
                results.push({
                    name: match.Cloud_Service_Provider_Package || match.Cloud_Service_Provider_Name || pid,
                    designation: match.Designation || '',
                    impact: match.Impact_Level || '',
                    url: 'https://marketplace.fedramp.gov/products/' + pid
                });
            } else {
                results.push({ name: pid, designation: '', impact: '', url: 'https://marketplace.fedramp.gov/products/' + pid });
            }
        }
        return results;
    },

    // ── Docs Hub Widget ───────────────────────────────────────────────
    renderDocsHubWidget() {
        if (!FedRAMPMarketplace.loaded) return '';
        const stats = this._getStats();

        let html = '<div class="fre-widget">';
        html += '<div class="fre-widget-header">';
        html += '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>';
        html += '<span class="fre-widget-title">FedRAMP Marketplace — Live Data</span>';
        html += '</div>';

        html += '<div class="fre-widget-stats">';
        html += '<div class="fre-widget-stat"><span class="fre-widget-stat-val">' + stats.total + '</span><span class="fre-widget-stat-label">Total CSOs</span></div>';
        html += '<div class="fre-widget-stat"><span class="fre-widget-stat-val" style="color:#10b981">' + stats.authorized + '</span><span class="fre-widget-stat-label">Authorized</span></div>';
        html += '<div class="fre-widget-stat"><span class="fre-widget-stat-val" style="color:#ef4444">' + stats.high + '</span><span class="fre-widget-stat-label">High</span></div>';
        html += '<div class="fre-widget-stat"><span class="fre-widget-stat-val" style="color:#f59e0b">' + stats.moderate + '</span><span class="fre-widget-stat-label">Moderate</span></div>';
        html += '<div class="fre-widget-stat"><span class="fre-widget-stat-val" style="color:#3b82f6">' + stats.low + '</span><span class="fre-widget-stat-label">Low</span></div>';
        html += '<div class="fre-widget-stat"><span class="fre-widget-stat-val" style="color:#a855f7">' + stats.twentyx + '</span><span class="fre-widget-stat-label">20x</span></div>';
        html += '</div>';

        html += '<button class="fre-widget-btn hamburger-nav-btn" data-view="fedramp-explorer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> Open FedRAMP Explorer</button>';
        html += '</div>';

        return html;
    }
};
