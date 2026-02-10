// FedRAMP Marketplace Client
// Fetches live authorization data from the 18F/fedramp-data public JSON feed
// and provides FedRAMP badges for vendor cards throughout the UI.
//
// Data source: https://github.com/18F/fedramp-data (GSA, public domain)
// Updated daily by GSA via Google Sheets → JSON export

const FedRAMPMarketplace = {
    // ── Configuration ────────────────────────────────────────────────
    DATA_URL: 'https://raw.githubusercontent.com/18F/fedramp-data/master/data/data.json',
    CACHE_KEY: 'fedramp_marketplace_cache',
    CACHE_TTL: 12 * 60 * 60 * 1000, // 12 hours

    // ── State ────────────────────────────────────────────────────────
    providers: null,       // Array of provider objects from the feed
    index: null,           // Map<normalizedName, provider[]>
    loading: false,
    loaded: false,
    error: null,
    listeners: [],

    // ── Vendor Key → FedRAMP CSP Name(s) Mapping ─────────────────────
    // Maps our internal tech keys to the CSP names used in the FedRAMP Marketplace.
    // Some vendors have multiple packages (e.g. Microsoft has Azure, M365, Intune, etc.)
    // We use arrays to match any package from that vendor.
    vendorMap: {
        // Cloud Platforms
        aws:            ['Amazon Web Services'],
        azure:          ['Microsoft Corporation'],
        gcp:            ['Google'],
        oracle:         ['Oracle'],

        // SaaS Platforms
        microsoft365:   ['Microsoft Corporation'],
        google_workspace: ['Google'],
        salesforce:     ['Salesforce'],

        // Identity & Access
        okta:           ['Okta'],
        cyberark:       ['CyberArk'],
        duo:            ['Cisco Systems', 'Duo Security'],
        jumpcloud:      ['JumpCloud'],
        beyondtrust:    ['BeyondTrust'],
        keeper:         ['Keeper Security'],
        delinea:        ['Delinea', 'Thycotic'],

        // XDR / EDR
        sentinelone:    ['SentinelOne'],
        crowdstrike:    ['CrowdStrike'],
        carbon_black:   ['VMware', 'Broadcom', 'Carbon Black'],
        huntress:       ['Huntress'],
        sophos:         ['Sophos'],

        // SIEM & Monitoring
        splunk:         ['Splunk'],
        splunk_es:      ['Splunk'],
        elk:            ['Elastic'],
        elastic_siem:   ['Elastic'],
        sentinel:       ['Microsoft Corporation'],
        chronicle:      ['Google'],
        qradar:         ['IBM'],
        logrhythm:      ['LogRhythm'],
        sumo_logic:     ['Sumo Logic'],
        exabeam:        ['Exabeam'],
        securonix:      ['Securonix'],
        blumira:        ['Blumira'],

        // MDR
        arctic_wolf:    ['Arctic Wolf'],

        // SOAR
        cortex_xsoar:   ['Palo Alto Networks'],
        splunk_soar:    ['Splunk'],
        tines:          ['Tines'],
        swimlane:       ['Swimlane'],

        // Vulnerability Management
        tenable:        ['Tenable'],
        qualys:         ['Qualys'],
        rapid7:         ['Rapid7'],

        // Firewalls & Network
        paloalto:       ['Palo Alto Networks'],
        cisco:          ['Cisco Systems'],
        fortinet:       ['Fortinet'],
        zscaler:        ['Zscaler'],

        // Email Security
        proofpoint:     ['Proofpoint'],
        mimecast:       ['Mimecast'],
        abnormal:       ['Abnormal Security'],

        // DLP & Data Protection
        purview:        ['Microsoft Corporation'],
        netskope:       ['Netskope'],
        code42:         ['Code42'],

        // Security Awareness
        knowbe4:        ['KnowBe4'],

        // RMM & Endpoint Mgmt
        ninjaone:       ['NinjaOne', 'NinjaRMM'],
        datto_rmm:      ['Datto', 'Kaseya'],
        connectwise:    ['ConnectWise'],
        nable:          ['N-able'],

        // MDM / UEM
        intune:         ['Microsoft Corporation'],
        jamf:           ['Jamf'],
        kandji:         ['Kandji'],
        workspace_one:  ['VMware', 'Omnissa'],

        // Backup & Recovery
        veeam:          ['Veeam'],
        druva:          ['Druva'],
        datto_bcdr:     ['Datto', 'Kaseya'],
        acronis:        ['Acronis'],

        // GRC & Compliance
        vanta:          ['Vanta'],
        drata:          ['Drata'],
        secureframe:    ['Secureframe'],
        intelligrc:     ['IntelliGRC', 'Telos'],
        archer:         ['Archer', 'RSA'],
        servicenow:     ['ServiceNow'],

        // NDR
        darktrace:      ['Darktrace'],
        vectra:         ['Vectra'],

        // CSPM / Cloud Security
        prisma_cloud:   ['Palo Alto Networks'],
        wiz:            ['Wiz'],
        orca:           ['Orca Security'],

        // Physical Security
        verkada:        ['Verkada'],

        // Ticketing / ITSM
        jira:           ['Atlassian'],
        freshservice:   ['Freshworks'],

        // Secure Communications
        teams_gcc:      ['Microsoft Corporation'],
        slack_grid:     ['Salesforce', 'Slack'],

        // Containers
        kubernetes:     ['Google'],
        docker:         ['Docker'],
        openshift:      ['Red Hat'],
        eks:            ['Amazon Web Services'],
        aks:            ['Microsoft Corporation'],
        gke:            ['Google'],
        ecs:            ['Amazon Web Services'],
        nutanix:        ['Nutanix']
    },

    // ── Initialization ───────────────────────────────────────────────
    async init() {
        if (this.loaded || this.loading) return;
        this.loading = true;
        this.error = null;

        try {
            // Try cache first — instant load
            const cached = this._loadCache();
            if (cached) {
                this.providers = cached;
                this._buildIndex();
                this.loaded = true;
                this.loading = false;
                this._notify();
                // Refresh in background if cache is > 6 hours old
                const age = Date.now() - (parseInt(localStorage.getItem(this.CACHE_KEY + '_ts')) || 0);
                if (age > this.CACHE_TTL / 2) this._fetchFresh().catch(() => {});
                return;
            }

            await this._fetchFresh();
        } catch (e) {
            this.error = e.message;
            this.loading = false;
            console.warn('[FedRAMP] Failed to load marketplace data:', e.message);
            this._notify(); // notify listeners so UI can show error instead of spinner
        }
    },

    async _fetchFresh() {
        console.log('[FedRAMP] Fetching marketplace data...');
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout
        try {
            const resp = await fetch(this.DATA_URL, { signal: controller.signal });
            clearTimeout(timeout);
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            const json = await resp.json();
            this.providers = json?.data?.Providers || [];
            this._buildIndex();
            this._saveCache();
            this.loaded = true;
            this.loading = false;
            this._notify();
            console.log('[FedRAMP] Loaded ' + this.providers.length + ' CSO listings');
        } catch (e) {
            clearTimeout(timeout);
            throw e;
        }
    },

    _buildIndex() {
        this.index = new Map();
        if (!this.providers) return;
        for (const p of this.providers) {
            const name = (p.Cloud_Service_Provider_Name || '').toLowerCase().trim();
            if (!this.index.has(name)) this.index.set(name, []);
            this.index.get(name).push(p);
        }
    },

    // ── Cache Management ─────────────────────────────────────────────
    _loadCache() {
        try {
            const ts = parseInt(localStorage.getItem(this.CACHE_KEY + '_ts')) || 0;
            if (Date.now() - ts > this.CACHE_TTL) return null;
            const raw = localStorage.getItem(this.CACHE_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch { return null; }
    },

    _saveCache() {
        try {
            localStorage.setItem(this.CACHE_KEY, JSON.stringify(this.providers));
            localStorage.setItem(this.CACHE_KEY + '_ts', String(Date.now()));
        } catch (e) {
            console.warn('[FedRAMP] Cache save failed (storage full?):', e.message);
        }
    },

    // ── Lookup API ───────────────────────────────────────────────────

    /**
     * Get all FedRAMP packages for a vendor key.
     * Returns array of { name, package, designation, impactLevel, path, serviceModel, authDate, packageId, marketplaceUrl }
     */
    getVendorPackages(vendorKey) {
        if (!this.loaded || !this.index) return [];
        const cspNames = this.vendorMap[vendorKey];
        if (!cspNames) return [];

        const results = [];
        for (const cspName of cspNames) {
            const normalized = cspName.toLowerCase().trim();
            // Exact match first
            if (this.index.has(normalized)) {
                for (const p of this.index.get(normalized)) {
                    results.push(this._formatPackage(p));
                }
            }
            // Partial match for vendor names that may differ slightly
            for (const [key, packages] of this.index) {
                if (key !== normalized && (key.includes(normalized) || normalized.includes(key))) {
                    for (const p of packages) {
                        if (!results.find(r => r.packageId === p.Package_ID)) {
                            results.push(this._formatPackage(p));
                        }
                    }
                }
            }
        }

        return results;
    },

    /**
     * Get the highest FedRAMP authorization for a vendor key.
     * Returns null if not found, or { designation, impactLevel, packages, ... }
     */
    getVendorStatus(vendorKey) {
        const packages = this.getVendorPackages(vendorKey);
        if (packages.length === 0) return null;

        // Priority: Compliant > In Process > FedRAMP Ready
        const designationPriority = { 'Compliant': 3, 'In Process': 2, 'FedRAMP Ready': 1 };
        const impactPriority = { 'High': 4, 'Moderate': 3, 'Low': 2, 'LI-SaaS': 1 };

        // Find the highest-impact authorized package
        let best = packages[0];
        for (const p of packages) {
            const dP = designationPriority[p.designation] || 0;
            const bP = designationPriority[best.designation] || 0;
            if (dP > bP) { best = p; continue; }
            if (dP === bP) {
                const iP = impactPriority[p.impactLevel] || 0;
                const bI = impactPriority[best.impactLevel] || 0;
                if (iP > bI) best = p;
            }
        }

        return {
            designation: best.designation,
            impactLevel: best.impactLevel,
            path: best.path,
            totalPackages: packages.length,
            highestPackage: best,
            allPackages: packages
        };
    },

    _formatPackage(p) {
        return {
            name: p.Cloud_Service_Provider_Name || '',
            package: p.Cloud_Service_Provider_Package || '',
            designation: p.Designation || '',
            impactLevel: p.Impact_Level || '',
            path: p.Path || '',
            serviceModel: p.Service_Model || [],
            authDate: p.Original_Authorization_Date || '',
            packageId: p.Package_ID || '',
            description: p.CSO_Description || '',
            website: p.CSP_Website || '',
            atoCount: (p.Leveraged_ATO_Letters || []).filter(l => l.Include_In_Marketplace === 'Y').length,
            marketplaceUrl: 'https://marketplace.fedramp.gov/products/' + (p.Package_ID || '')
        };
    },

    // ── Badge Rendering ──────────────────────────────────────────────

    /**
     * Render a compact FedRAMP badge for a vendor key.
     * Returns HTML string or empty string if no FedRAMP data.
     */
    renderBadge(vendorKey, opts = {}) {
        const status = this.getVendorStatus(vendorKey);
        if (!status) return '';

        const size = opts.size || 'sm'; // 'sm', 'md', 'lg'
        const showTooltip = opts.tooltip !== false;
        const showPackageCount = opts.packageCount !== false && status.totalPackages > 1;

        let cls, label, icon;
        if (status.designation === 'Compliant') {
            cls = 'fedramp-badge-authorized';
            label = status.impactLevel === 'High' ? 'FedRAMP High' :
                    status.impactLevel === 'Moderate' ? 'FedRAMP Mod' :
                    status.impactLevel === 'LI-SaaS' ? 'FedRAMP Li-SaaS' :
                    'FedRAMP ' + status.impactLevel;
            icon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>';
        } else if (status.designation === 'In Process') {
            cls = 'fedramp-badge-inprocess';
            label = 'FedRAMP In Process';
            icon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
        } else {
            cls = 'fedramp-badge-ready';
            label = 'FedRAMP Ready';
            icon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
        }

        const tooltip = showTooltip ? ` title="${status.designation} — ${status.impactLevel} impact | ${status.totalPackages} package(s) | ${status.path || 'Agency'} path"` : '';
        const countBadge = showPackageCount ? `<span class="fedramp-pkg-count">${status.totalPackages}</span>` : '';

        return `<a href="${status.highestPackage.marketplaceUrl}" target="_blank" rel="noopener" class="fedramp-badge ${cls} fedramp-badge-${size}"${tooltip}>${icon}<span class="fedramp-badge-label">${label}</span>${countBadge}</a>`;
    },

    /**
     * Render a detailed FedRAMP card for a vendor key (for Infrastructure Guide).
     * Returns HTML string or empty string if no FedRAMP data.
     */
    renderDetailCard(vendorKey) {
        const status = this.getVendorStatus(vendorKey);
        if (!status) return '';

        const p = status.highestPackage;
        const authDate = p.authDate ? new Date(p.authDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A';
        const svcModel = p.serviceModel.join(', ') || 'N/A';

        return `<div class="fedramp-detail-card">
            <div class="fedramp-detail-header">
                ${this.renderBadge(vendorKey, { size: 'md', packageCount: true })}
            </div>
            <div class="fedramp-detail-body">
                <div class="fedramp-detail-row"><span class="fedramp-detail-key">Package</span><span class="fedramp-detail-val">${p.package}</span></div>
                <div class="fedramp-detail-row"><span class="fedramp-detail-key">Impact</span><span class="fedramp-detail-val">${p.impactLevel}</span></div>
                <div class="fedramp-detail-row"><span class="fedramp-detail-key">Path</span><span class="fedramp-detail-val">${p.path || 'Agency'}</span></div>
                <div class="fedramp-detail-row"><span class="fedramp-detail-key">Service</span><span class="fedramp-detail-val">${svcModel}</span></div>
                <div class="fedramp-detail-row"><span class="fedramp-detail-key">Auth Date</span><span class="fedramp-detail-val">${authDate}</span></div>
                <div class="fedramp-detail-row"><span class="fedramp-detail-key">Agency ATOs</span><span class="fedramp-detail-val">${p.atoCount}</span></div>
            </div>
        </div>`;
    },

    // ── Event System ─────────────────────────────────────────────────
    onReady(fn) {
        if (this.loaded) { fn(); return; }
        this.listeners.push(fn);
    },

    _notify() {
        for (const fn of this.listeners) {
            try { fn(); } catch (e) { console.warn('[FedRAMP] Listener error:', e); }
        }
        this.listeners = [];
        // Dispatch a DOM event for any UI that needs to refresh
        document.dispatchEvent(new CustomEvent('fedramp-marketplace-ready'));
    },

    // ── Stats ────────────────────────────────────────────────────────
    getStats() {
        if (!this.loaded) return null;
        const authorized = this.providers.filter(p => p.Designation === 'Compliant').length;
        const inProcess = this.providers.filter(p => p.Designation === 'In Process').length;
        const ready = this.providers.filter(p => p.Designation === 'FedRAMP Ready').length;
        const high = this.providers.filter(p => p.Impact_Level === 'High').length;
        const moderate = this.providers.filter(p => p.Impact_Level === 'Moderate').length;
        const low = this.providers.filter(p => p.Impact_Level === 'Low' || p.Impact_Level === 'LI-SaaS').length;
        return { total: this.providers.length, authorized, inProcess, ready, high, moderate, low };
    },

    /**
     * Count how many of our tracked vendors have FedRAMP authorization.
     */
    getTrackedVendorStats() {
        if (!this.loaded) return null;
        const keys = Object.keys(this.vendorMap);
        let authorized = 0, inProcess = 0, ready = 0, none = 0;
        for (const key of keys) {
            const status = this.getVendorStatus(key);
            if (!status) { none++; continue; }
            if (status.designation === 'Compliant') authorized++;
            else if (status.designation === 'In Process') inProcess++;
            else ready++;
        }
        return { total: keys.length, authorized, inProcess, ready, none };
    }
};

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    FedRAMPMarketplace.init();
}
