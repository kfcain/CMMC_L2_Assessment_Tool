// FedRAMP Documentation Hub — Interactive GUI for FedRAMP documentation,
// templates, baselines, 20x references, and tools.
// Depends on: data/fedramp-docs-hub-data.js

const FedRAMPDocsHub = {

    activeTab: 'templates',
    searchQuery: '',

    tabIcons: {
        templates: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
        baselines: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        controls: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
        twentyx: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
        guidance: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
        tools: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
    },

    tabs: [
        { id: 'templates', label: 'Templates & Deliverables' },
        { id: 'baselines', label: 'Baselines' },
        { id: 'controls',  label: '800-53 Control Families' },
        { id: 'twentyx',   label: 'FedRAMP 20x' },
        { id: 'guidance',  label: 'Guidance & Policy' },
        { id: 'tools',     label: 'Tools & Resources' }
    ],

    init() {
        this.render();
    },

    render() {
        const container = document.getElementById('fedramp-docs-hub-content');
        if (!container) return;

        const data = typeof FEDRAMP_DOCS_HUB_DATA !== 'undefined' ? FEDRAMP_DOCS_HUB_DATA : null;
        if (!data) {
            container.innerHTML = '<div class="fdh-error">FedRAMP Docs Hub data not loaded.</div>';
            return;
        }

        container.innerHTML = this.renderShell(data);
        this.bindEvents(container);
    },

    renderShell(data) {
        return `
            <div class="fdh-container">
                <div class="fdh-header">
                    <div class="fdh-header-left">
                        <button class="fdh-back-btn" id="fdh-back-btn" title="Back to Dashboard">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        <div>
                            <h2 class="fdh-title">FedRAMP Documentation Hub</h2>
                            <p class="fdh-subtitle">Templates, baselines, 20x references, and tools for FedRAMP authorization</p>
                        </div>
                    </div>
                    <div class="fdh-search-wrap">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="text" id="fdh-search" class="fdh-search" placeholder="Search documents, templates, controls..." value="${this.esc(this.searchQuery)}">
                    </div>
                </div>

                ${this.renderStatsBar(data)}

                <div class="fdh-tabs" id="fdh-tabs">
                    ${this.tabs.map(t => `
                        <button class="fdh-tab ${this.activeTab === t.id ? 'active' : ''}" data-tab="${t.id}">
                            <span class="fdh-tab-icon">${this.tabIcons[t.id] || ''}</span>
                            <span class="fdh-tab-label">${t.label}</span>
                        </button>
                    `).join('')}
                </div>

                <div class="fdh-content" id="fdh-content">
                    ${this.renderTabContent(data)}
                </div>
            </div>
        `;
    },

    renderStatsBar(data) {
        const s = data.stats;
        return `
            <div class="fdh-stats-bar">
                <div class="fdh-stat"><span class="fdh-stat-num">${s.totalTemplates}</span><span class="fdh-stat-label">Templates</span></div>
                <div class="fdh-stat"><span class="fdh-stat-num">${s.totalBaselines}</span><span class="fdh-stat-label">Baselines</span></div>
                <div class="fdh-stat"><span class="fdh-stat-num">${s.controlFamilyCount}</span><span class="fdh-stat-label">Control Families</span></div>
                <div class="fdh-stat"><span class="fdh-stat-num">${s.totalKSIs}</span><span class="fdh-stat-label">KSIs (20x)</span></div>
                <div class="fdh-stat"><span class="fdh-stat-num">${s.guidanceDocCount}</span><span class="fdh-stat-label">Guidance Docs</span></div>
                <div class="fdh-stat"><span class="fdh-stat-num">${s.toolCount}</span><span class="fdh-stat-label">Tools</span></div>
            </div>
        `;
    },

    renderTabContent(data) {
        const q = this.searchQuery.toLowerCase();
        switch (this.activeTab) {
            case 'templates': return this.renderTemplatesTab(data, q);
            case 'baselines': return this.renderBaselinesTab(data, q);
            case 'controls':  return this.renderControlsTab(data, q);
            case 'twentyx':   return this.renderTwentyXTab(data, q);
            case 'guidance':  return this.renderGuidanceTab(data, q);
            case 'tools':     return this.renderToolsTab(data, q);
            default: return '';
        }
    },

    // =========================================================================
    // Templates & Deliverables Tab
    // =========================================================================
    renderTemplatesTab(data, q) {
        const categoryLabels = {
            core: 'Core Deliverables',
            authorization: 'Authorization',
            boundary: 'Boundary & Architecture',
            conmon: 'Continuous Monitoring'
        };
        const categoryOrder = ['core', 'authorization', 'boundary', 'conmon'];

        let templates = data.templates;
        if (q) {
            templates = templates.filter(t =>
                t.title.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q) ||
                (t.tags || []).some(tag => tag.includes(q))
            );
        }

        if (templates.length === 0) {
            return '<div class="fdh-empty">No templates match your search.</div>';
        }

        const grouped = {};
        templates.forEach(t => {
            const cat = t.category || 'core';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(t);
        });

        return categoryOrder.filter(c => grouped[c]).map(cat => `
            <div class="fdh-section">
                <h3 class="fdh-section-title">${categoryLabels[cat] || cat}</h3>
                <div class="fdh-card-grid">
                    ${grouped[cat].map(t => this.renderTemplateCard(t)).join('')}
                </div>
            </div>
        `).join('');
    },

    renderTemplateCard(t) {
        const formatBadge = t.format ? `<span class="fdh-format-badge">${t.format}</span>` : '';
        const oscalBadge = t.oscalUrl ? '<span class="fdh-oscal-badge">OSCAL</span>' : '';
        const tags = (t.tags || []).map(tag => `<span class="fdh-tag">${tag}</span>`).join('');

        return `
            <div class="fdh-card fdh-template-card" data-tpl-id="${t.id}">
                <div class="fdh-card-header">
                    <h4 class="fdh-card-title">${this.esc(t.title)}</h4>
                    <div class="fdh-card-badges">${formatBadge}${oscalBadge}</div>
                </div>
                <p class="fdh-card-desc">${this.esc(t.description)}</p>
                <div class="fdh-card-footer">
                    <div class="fdh-card-tags">${tags}</div>
                    <div class="fdh-card-actions">
                        ${t.downloadUrl ? `<a href="${t.downloadUrl}" target="_blank" rel="noopener" class="fdh-btn fdh-btn-primary fdh-btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Download
                        </a>` : ''}
                        ${t.oscalUrl ? `<button class="fdh-btn fdh-btn-ghost fdh-btn-sm fdh-oscal-preview-btn" data-oscal-url="${t.oscalUrl}" data-tpl-id="${t.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            Preview OSCAL
                        </button>` : ''}
                    </div>
                </div>
                ${t.oscalUrl ? `<div class="fdh-oscal-preview" id="fdh-oscal-${t.id}" style="display:none;"></div>` : ''}
            </div>
        `;
    },

    // =========================================================================
    // Baselines Tab
    // =========================================================================
    renderBaselinesTab(data, q) {
        let baselines = data.baselines;
        if (q) {
            baselines = baselines.filter(b =>
                b.title.toLowerCase().includes(q) ||
                b.description.toLowerCase().includes(q) ||
                b.impact.toLowerCase().includes(q)
            );
        }

        if (baselines.length === 0) {
            return '<div class="fdh-empty">No baselines match your search.</div>';
        }

        const maxControls = Math.max(...baselines.map(b => b.controlCount));

        return `
            <div class="fdh-section">
                <h3 class="fdh-section-title">Baseline Comparison</h3>
                <p class="fdh-section-desc">Visual comparison of control counts across FedRAMP impact levels.</p>
                <div class="fdh-baseline-chart">
                    ${baselines.map(b => `
                        <div class="fdh-chart-row">
                            <span class="fdh-chart-label" style="color:${b.color}">${b.impact}</span>
                            <div class="fdh-chart-bar-wrap">
                                <div class="fdh-chart-bar" style="width:${Math.round(b.controlCount / maxControls * 100)}%;background:${b.color}"></div>
                            </div>
                            <span class="fdh-chart-value">${b.controlCount}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="fdh-section">
                <h3 class="fdh-section-title">FedRAMP Security Baselines (NIST 800-53 Rev 5)</h3>
                <p class="fdh-section-desc">OSCAL-formatted baseline profiles from the GSA FedRAMP Automation repository. Click "Preview Profile" to inspect the OSCAL JSON structure in-app.</p>
                <div class="fdh-baseline-grid">
                    ${baselines.map(b => this.renderBaselineCard(b)).join('')}
                </div>
            </div>
        `;
    },

    renderBaselineCard(b) {
        return `
            <div class="fdh-baseline-card" style="border-top: 3px solid ${b.color}" data-baseline-id="${b.id}">
                <div class="fdh-baseline-header">
                    <span class="fdh-baseline-impact" style="background:${b.color}20;color:${b.color};border:1px solid ${b.color}40">${b.impact}</span>
                    <span class="fdh-baseline-count">${b.controlCount} controls</span>
                </div>
                <h4 class="fdh-baseline-title">${this.esc(b.title)}</h4>
                <p class="fdh-baseline-desc">${this.esc(b.description)}</p>
                <div class="fdh-baseline-source">${this.esc(b.nistSource)}</div>
                <div class="fdh-baseline-actions">
                    <button class="fdh-btn fdh-btn-primary fdh-btn-sm fdh-oscal-preview-btn" data-oscal-url="${b.oscalProfileUrl}" data-tpl-id="bl-${b.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        Preview Profile
                    </button>
                    ${b.oscalResolvedUrl ? `<button class="fdh-btn fdh-btn-ghost fdh-btn-sm fdh-oscal-preview-btn" data-oscal-url="${b.oscalResolvedUrl}" data-tpl-id="blr-${b.id}">Resolved Catalog</button>` : ''}
                </div>
                <div class="fdh-oscal-preview" id="fdh-oscal-bl-${b.id}" style="display:none;"></div>
                ${b.oscalResolvedUrl ? `<div class="fdh-oscal-preview" id="fdh-oscal-blr-${b.id}" style="display:none;"></div>` : ''}
            </div>
        `;
    },

    // =========================================================================
    // 800-53 Control Families Tab
    // =========================================================================
    renderControlsTab(data, q) {
        let families = data.controlFamilies;
        if (q) {
            families = families.filter(f =>
                f.id.toLowerCase().includes(q) ||
                f.name.toLowerCase().includes(q) ||
                f.description.toLowerCase().includes(q)
            );
        }

        if (families.length === 0) {
            return '<div class="fdh-empty">No control families match your search.</div>';
        }

        // Build reverse mapping: family prefix → KSI families
        const familyToKsi = {};
        Object.entries(data.ksiTo80053).forEach(([ksi, controls]) => {
            controls.forEach(ctrl => {
                const prefix = ctrl.split('-')[0];
                if (!familyToKsi[prefix]) familyToKsi[prefix] = new Set();
                familyToKsi[prefix].add(ksi);
            });
        });

        // Build reverse mapping: KSI → controls for detail panels
        const ksiControlsMap = data.ksiTo80053 || {};

        return `
            <div class="fdh-section">
                <h3 class="fdh-section-title">NIST 800-53 Rev 5 Control Families</h3>
                <p class="fdh-section-desc">All 20 control families used in FedRAMP baselines. Expand a family to see related KSI mappings and controls. Click KSI badges to navigate to the FedRAMP Reference module.</p>
                <div class="fdh-controls-grid">
                    ${families.map(f => {
                        const relatedKsis = familyToKsi[f.id] ? Array.from(familyToKsi[f.id]) : [];
                        // Get specific controls mapped from each KSI to this family
                        const ksiDetails = relatedKsis.map(ksiId => {
                            const controls = (ksiControlsMap[ksiId] || []).filter(c => c.startsWith(f.id + '-'));
                            const ksi = data.ksiFamilies.find(k => k.id === ksiId);
                            return { ksiId, name: ksi ? ksi.name : ksiId, controls };
                        }).filter(d => d.controls.length > 0);
                        return this.renderControlFamilyCard(f, relatedKsis, data.ksiFamilies, ksiDetails);
                    }).join('')}
                </div>
            </div>
        `;
    },

    renderControlFamilyCard(f, relatedKsis, ksiFamilies, ksiDetails) {
        const ksiBadges = relatedKsis.map(ksiId => {
            const ksi = ksiFamilies.find(k => k.id === ksiId);
            return ksi ? `<button class="fdh-ksi-link" data-view="fedramp-reference" title="View ${ksi.name} in FedRAMP Reference">${ksiId}</button>` : '';
        }).join('');

        const detailRows = (ksiDetails || []).map(d => `
            <div class="fdh-cf-detail-row">
                <span class="fdh-cf-detail-ksi">${d.ksiId} &mdash; ${this.esc(d.name)}</span>
                <div class="fdh-cf-detail-ctrls">${d.controls.map(c => `<span class="fdh-ctrl-chip">${c}</span>`).join(' ')}</div>
            </div>
        `).join('');

        return `
            <div class="fdh-control-family-card" data-cf-id="${f.id}">
                <button class="fdh-cf-toggle" data-cf-id="${f.id}">
                    <div class="fdh-cf-header">
                        <span class="fdh-cf-id">${f.id}</span>
                        <span class="fdh-cf-count">${f.controlCount} controls</span>
                        <svg class="fdh-cf-chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    <h4 class="fdh-cf-name">${this.esc(f.name)}</h4>
                </button>
                <p class="fdh-cf-desc">${this.esc(f.description)}</p>
                ${relatedKsis.length > 0 ? `
                <div class="fdh-cf-ksi">
                    <span class="fdh-cf-ksi-label">Related 20x KSIs:</span>
                    ${ksiBadges}
                </div>` : ''}
                <div class="fdh-cf-detail" id="fdh-cf-detail-${f.id}" style="display:none;">
                    ${detailRows ? `
                    <div class="fdh-cf-detail-header">KSI-to-Control Mappings for ${f.id}</div>
                    ${detailRows}` : ''}
                    <div class="fdh-cf-actions">
                        <a href="${f.nistUrl}" target="_blank" rel="noopener" class="fdh-btn fdh-btn-ghost fdh-btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            View Full Family on NIST CSRC
                        </a>
                    </div>
                </div>
            </div>
        `;
    },

    // =========================================================================
    // FedRAMP 20x Tab
    // =========================================================================
    renderTwentyXTab(data, q) {
        const docCategories = {
            overview: 'Overview',
            framework: 'Framework',
            requirements: 'Requirements',
            guidance: 'Guidance',
            playbook: 'Playbooks'
        };
        const catOrder = ['overview', 'framework', 'requirements', 'guidance', 'playbook'];

        let docs = data.twentyXDocs;
        if (q) {
            docs = docs.filter(d =>
                d.title.toLowerCase().includes(q) ||
                d.description.toLowerCase().includes(q) ||
                (d.tags || []).some(tag => tag.includes(q))
            );
        }

        const grouped = {};
        docs.forEach(d => {
            const cat = d.category || 'overview';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(d);
        });

        // KSI families overview
        let ksiFamilies = data.ksiFamilies || [];
        if (q) {
            ksiFamilies = ksiFamilies.filter(k =>
                k.id.toLowerCase().includes(q) ||
                k.name.toLowerCase().includes(q) ||
                k.description.toLowerCase().includes(q)
            );
        }

        return `
            ${catOrder.filter(c => grouped[c]).map(cat => `
                <div class="fdh-section">
                    <h3 class="fdh-section-title">20x ${docCategories[cat]}</h3>
                    <div class="fdh-card-grid">
                        ${grouped[cat].map(d => this.renderTwentyXDocCard(d)).join('')}
                    </div>
                </div>
            `).join('')}

            <div class="fdh-section">
                <h3 class="fdh-section-title">Key Security Indicator (KSI) Families</h3>
                <p class="fdh-section-desc">The 11 KSI families form the core of FedRAMP 20x automated assessment. Click a family to view detailed KSIs in the FedRAMP Reference module.</p>
                <div class="fdh-ksi-grid">
                    ${ksiFamilies.map(k => this.renderKSIFamilyCard(k)).join('')}
                </div>
            </div>

            <div class="fdh-section">
                <div class="fdh-cross-link-bar">
                    <span>Explore 20x CSOs in the FedRAMP Marketplace:</span>
                    <button class="fdh-btn fdh-btn-primary fdh-btn-sm fdh-nav-btn" data-view="fedramp-explorer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        Open FedRAMP Explorer
                    </button>
                </div>
            </div>
        `;
    },

    renderTwentyXDocCard(d) {
        const tags = (d.tags || []).map(tag => `<span class="fdh-tag">${tag}</span>`).join('');
        const inAppBtn = d.inAppView ? `<button class="fdh-btn fdh-btn-ghost fdh-btn-sm fdh-nav-btn" data-view="${d.inAppView}">Open In-App</button>` : '';

        return `
            <div class="fdh-card fdh-twentyx-card">
                <h4 class="fdh-card-title">${this.esc(d.title)}</h4>
                <p class="fdh-card-desc">${this.esc(d.description)}</p>
                <div class="fdh-card-footer">
                    <div class="fdh-card-tags">${tags}</div>
                    <div class="fdh-card-actions">
                        <a href="${d.url}" target="_blank" rel="noopener" class="fdh-btn fdh-btn-primary fdh-btn-sm">View</a>
                        ${inAppBtn}
                    </div>
                </div>
            </div>
        `;
    },

    renderKSIFamilyCard(k) {
        const docsLink = k.url ? `<a href="${k.url}" target="_blank" rel="noopener" class="fdh-ksi-docs-link" title="View official requirements">Requirements</a>` : '';
        return `
            <div class="fdh-ksi-family-card">
                <button class="fdh-ksi-family-card-inner fdh-nav-btn" data-view="fedramp-reference" title="View ${k.name} KSIs in-app">
                    <span class="fdh-ksi-id">${k.id}</span>
                    <span class="fdh-ksi-name">${this.esc(k.name)}</span>
                    <span class="fdh-ksi-count">${k.ksiCount} KSIs</span>
                    <p class="fdh-ksi-desc">${this.esc(k.description)}</p>
                </button>
                ${docsLink}
            </div>
        `;
    },

    // =========================================================================
    // Guidance & Policy Tab
    // =========================================================================
    renderGuidanceTab(data, q) {
        const categoryLabels = {
            boundary: 'Authorization Boundary',
            conmon: 'Continuous Monitoring',
            change: 'Change Management',
            evidence: 'Evidence & Documentation',
            process: 'Authorization Process',
            marketplace: 'Marketplace',
            transition: 'Transition & Migration',
            identity: 'Digital Identity',
            assessment: 'Assessment & Testing'
        };

        let guidance = data.guidance;
        if (q) {
            guidance = guidance.filter(g =>
                g.title.toLowerCase().includes(q) ||
                g.description.toLowerCase().includes(q) ||
                g.category.toLowerCase().includes(q)
            );
        }

        if (guidance.length === 0) {
            return '<div class="fdh-empty">No guidance documents match your search.</div>';
        }

        // KSI-to-800-53 mapping section
        const mappingHtml = this.renderKsiMappingSection(data);

        return `
            <div class="fdh-section">
                <h3 class="fdh-section-title">FedRAMP Guidance & Policy Documents</h3>
                <div class="fdh-card-grid">
                    ${guidance.map(g => {
                        const catLabel = categoryLabels[g.category] || g.category;
                        const inAppBtn = g.inAppView ? `<button class="fdh-btn fdh-btn-ghost fdh-btn-sm fdh-nav-btn" data-view="${g.inAppView}">Open In-App</button>` : '';
                        return `
                        <div class="fdh-card fdh-guidance-card">
                            <div class="fdh-card-header">
                                <h4 class="fdh-card-title">${this.esc(g.title)}</h4>
                                <span class="fdh-guidance-cat">${catLabel}</span>
                            </div>
                            <p class="fdh-card-desc">${this.esc(g.description)}</p>
                            <div class="fdh-card-footer">
                                <span class="fdh-format-badge">${g.format}</span>
                                <div class="fdh-card-actions">
                                    <a href="${g.url}" target="_blank" rel="noopener" class="fdh-btn fdh-btn-primary fdh-btn-sm">
                                        ${g.format === 'Web' ? 'Visit' : 'Download'}
                                    </a>
                                    ${inAppBtn}
                                </div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>
            ${mappingHtml}
        `;
    },

    renderKsiMappingSection(data) {
        const mapping = data.ksiTo80053;
        const ksiFamilies = data.ksiFamilies || [];

        return `
            <div class="fdh-section">
                <h3 class="fdh-section-title">KSI-to-800-53 Control Mapping</h3>
                <p class="fdh-section-desc">How FedRAMP 20x Key Security Indicators map to traditional NIST 800-53 Rev 5 controls. Use the filter to search by KSI or control ID.</p>
                <div class="fdh-mapping-filter-wrap">
                    <input type="text" id="fdh-mapping-filter" class="fdh-mapping-filter" placeholder="Filter by KSI or control (e.g. IAM, AC-2)..." />
                </div>
                <div class="fdh-mapping-table-wrap">
                    <table class="fdh-mapping-table">
                        <thead>
                            <tr>
                                <th>KSI Family</th>
                                <th>Name</th>
                                <th>Related 800-53 Controls</th>
                            </tr>
                        </thead>
                        <tbody id="fdh-mapping-tbody">
                            ${Object.entries(mapping).map(([ksiId, controls]) => {
                                const ksi = ksiFamilies.find(k => k.id === ksiId);
                                return `
                                <tr data-ksi="${ksiId}" data-controls="${controls.join(' ')}">
                                    <td><strong>${ksiId}</strong></td>
                                    <td>${ksi ? this.esc(ksi.name) : ksiId}</td>
                                    <td>${controls.map(c => `<span class="fdh-ctrl-chip fdh-ctrl-chip-link" data-ctrl="${c}" title="View ${c} on NIST CSRC">${c}</span>`).join(' ')}</td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="fdh-mapping-stats" id="fdh-mapping-stats">
                    ${Object.keys(mapping).length} KSI families &middot; ${Object.values(mapping).flat().length} control mappings
                </div>
            </div>
        `;
    },

    // =========================================================================
    // Tools & Resources Tab
    // =========================================================================
    renderToolsTab(data, q) {
        const categoryLabels = {
            repository: 'Repositories',
            tools: 'CLI & Validation Tools',
            ai: 'AI & Automation',
            marketplace: 'Marketplace',
            reference: 'External References',
            'in-app': 'In-App Views'
        };
        const catOrder = ['in-app', 'repository', 'tools', 'ai', 'marketplace', 'reference'];

        let tools = data.tools;
        if (q) {
            tools = tools.filter(t =>
                t.title.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q)
            );
        }

        if (tools.length === 0) {
            return '<div class="fdh-empty">No tools match your search.</div>';
        }

        const grouped = {};
        tools.forEach(t => {
            const cat = t.category || 'tools';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(t);
        });

        return catOrder.filter(c => grouped[c]).map(cat => `
            <div class="fdh-section">
                <h3 class="fdh-section-title">${categoryLabels[cat] || cat}</h3>
                <div class="fdh-card-grid fdh-tools-grid">
                    ${grouped[cat].map(t => this.renderToolCard(t)).join('')}
                </div>
            </div>
        `).join('');
    },

    renderToolCard(t) {
        const iconSvg = this.getToolIcon(t.icon);
        const isInApp = t.inAppView;

        return `
            <div class="fdh-card fdh-tool-card">
                <div class="fdh-tool-icon">${iconSvg}</div>
                <div class="fdh-tool-info">
                    <h4 class="fdh-card-title">${this.esc(t.title)}</h4>
                    <p class="fdh-card-desc">${this.esc(t.description)}</p>
                </div>
                <div class="fdh-tool-action">
                    ${isInApp
                        ? `<button class="fdh-btn fdh-btn-primary fdh-btn-sm fdh-nav-btn" data-view="${t.inAppView}">Open</button>`
                        : `<a href="${t.url}" target="_blank" rel="noopener" class="fdh-btn fdh-btn-ghost fdh-btn-sm">Visit</a>`
                    }
                </div>
            </div>
        `;
    },

    getToolIcon(icon) {
        const icons = {
            github: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
            terminal: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
            eye: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
            bot: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>',
            store: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
            book: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
            compass: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
            shield: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
            library: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="14" y2="10"/></svg>'
        };
        return icons[icon] || icons.book;
    },

    // =========================================================================
    // Event Binding
    // =========================================================================
    bindEvents(container) {
        // Back button
        container.querySelector('#fdh-back-btn')?.addEventListener('click', () => {
            if (typeof window.app?.switchView === 'function') {
                window.app.switchView('dashboard');
            }
        });

        // Tab switching
        container.querySelectorAll('.fdh-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.activeTab = tab.dataset.tab;
                this.render();
            });
        });

        // Search
        const searchInput = container.querySelector('#fdh-search');
        if (searchInput) {
            let debounce;
            searchInput.addEventListener('input', () => {
                clearTimeout(debounce);
                debounce = setTimeout(() => {
                    this.searchQuery = searchInput.value.trim();
                    const contentEl = container.querySelector('#fdh-content');
                    if (contentEl) {
                        const data = typeof FEDRAMP_DOCS_HUB_DATA !== 'undefined' ? FEDRAMP_DOCS_HUB_DATA : null;
                        if (data) contentEl.innerHTML = this.renderTabContent(data);
                        this.bindContentEvents(container);
                    }
                }, 250);
            });
        }

        this.bindContentEvents(container);
    },

    bindContentEvents(container) {
        // In-app navigation buttons
        container.querySelectorAll('.fdh-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const view = btn.dataset.view;
                if (view && typeof window.app?.switchView === 'function') {
                    window.app.switchView(view);
                }
            });
        });

        // KSI cross-links
        container.querySelectorAll('.fdh-ksi-link').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const view = btn.dataset.view;
                if (view && typeof window.app?.switchView === 'function') {
                    window.app.switchView(view);
                }
            });
        });

        // OSCAL Preview buttons (templates + baselines)
        container.querySelectorAll('.fdh-oscal-preview-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const url = btn.dataset.oscalUrl;
                const tplId = btn.dataset.tplId;
                const previewEl = container.querySelector(`#fdh-oscal-${tplId}`);
                if (!previewEl) return;

                // Find the text node inside the button (after the SVG)
                const setLabel = (label) => {
                    const textNodes = [...btn.childNodes].filter(n => n.nodeType === 3);
                    if (textNodes.length > 0) {
                        textNodes[textNodes.length - 1].textContent = ' ' + label;
                    }
                };

                if (previewEl.style.display !== 'none') {
                    previewEl.style.display = 'none';
                    setLabel(btn.textContent.includes('Profile') ? 'Preview Profile' : btn.textContent.includes('Catalog') ? 'Resolved Catalog' : 'Preview OSCAL');
                    return;
                }

                previewEl.style.display = 'block';
                previewEl.innerHTML = '<div class="fdh-oscal-loading">Loading OSCAL JSON...</div>';
                setLabel('Hide Preview');

                fetch(url)
                    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
                    .then(json => {
                        const summary = this.summarizeOscal(json);
                        const truncated = JSON.stringify(json, null, 2).slice(0, 3000);
                        previewEl.innerHTML = `
                            <div class="fdh-oscal-summary">${summary}</div>
                            <div class="fdh-oscal-toolbar">
                                <button class="fdh-btn fdh-btn-ghost fdh-btn-xs fdh-oscal-copy" data-url="${url}">Copy URL</button>
                                <a href="${url}" target="_blank" rel="noopener" class="fdh-btn fdh-btn-ghost fdh-btn-xs">Open Raw</a>
                            </div>
                            <pre class="fdh-oscal-json"><code>${this.esc(truncated)}${truncated.length >= 3000 ? '\n\n... (truncated — open raw for full document)' : ''}</code></pre>
                        `;
                        previewEl.querySelector('.fdh-oscal-copy')?.addEventListener('click', (e) => {
                            navigator.clipboard.writeText(url).then(() => {
                                e.target.textContent = 'Copied!';
                                setTimeout(() => e.target.textContent = 'Copy URL', 1500);
                            });
                        });
                    })
                    .catch(err => {
                        previewEl.innerHTML = `<div class="fdh-oscal-error">Failed to load OSCAL JSON (${err.message}). <a href="${url}" target="_blank" rel="noopener">Open directly</a></div>`;
                    });
            });
        });

        // Control family expand/collapse toggles
        container.querySelectorAll('.fdh-cf-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const cfId = btn.dataset.cfId;
                const detail = container.querySelector(`#fdh-cf-detail-${cfId}`);
                const card = btn.closest('.fdh-control-family-card');
                if (!detail) return;
                const isOpen = detail.style.display !== 'none';
                detail.style.display = isOpen ? 'none' : 'block';
                card?.classList.toggle('fdh-cf-expanded', !isOpen);
            });
        });

        // KSI mapping table filter
        const mappingFilter = container.querySelector('#fdh-mapping-filter');
        if (mappingFilter) {
            mappingFilter.addEventListener('input', () => {
                const val = mappingFilter.value.trim().toUpperCase();
                const rows = container.querySelectorAll('#fdh-mapping-tbody tr');
                let visible = 0;
                rows.forEach(row => {
                    const ksi = row.dataset.ksi || '';
                    const ctrls = row.dataset.controls || '';
                    const name = row.children[1]?.textContent || '';
                    const match = !val || ksi.toUpperCase().includes(val) || ctrls.toUpperCase().includes(val) || name.toUpperCase().includes(val);
                    row.style.display = match ? '' : 'none';
                    if (match) visible++;
                });
                const stats = container.querySelector('#fdh-mapping-stats');
                if (stats) stats.textContent = val ? `${visible} matching rows` : '';
            });
        }

        // Clickable control chips in mapping table → open NIST CSRC
        container.querySelectorAll('.fdh-ctrl-chip-link').forEach(chip => {
            chip.addEventListener('click', () => {
                const ctrl = chip.dataset.ctrl;
                if (!ctrl) return;
                const family = ctrl.split('-')[0];
                window.open(`https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=${family}`, '_blank');
            });
        });
    },

    summarizeOscal(json) {
        const parts = [];
        if (json.catalog) {
            const groups = json.catalog.groups || [];
            const controls = groups.reduce((sum, g) => sum + (g.controls || []).length, 0);
            parts.push(`<strong>Catalog:</strong> ${groups.length} groups, ${controls} controls`);
            if (json.catalog.metadata?.title) parts.push(`<strong>Title:</strong> ${this.esc(json.catalog.metadata.title)}`);
        }
        if (json.profile) {
            const imports = json.profile.imports || [];
            parts.push(`<strong>Profile:</strong> ${imports.length} import(s)`);
            if (json.profile.metadata?.title) parts.push(`<strong>Title:</strong> ${this.esc(json.profile.metadata.title)}`);
        }
        if (json['system-security-plan']) {
            const ssp = json['system-security-plan'];
            parts.push(`<strong>SSP:</strong> ${this.esc(ssp.metadata?.title || 'Untitled')}`);
        }
        if (json['plan-of-action-and-milestones']) {
            parts.push(`<strong>POA&M Template</strong>`);
        }
        if (json['assessment-plan']) {
            parts.push(`<strong>SAP Template</strong>`);
        }
        if (json['assessment-results']) {
            parts.push(`<strong>SAR Template</strong>`);
        }
        if (parts.length === 0) {
            parts.push(`<strong>OSCAL Document</strong> (${Object.keys(json).length} top-level keys)`);
        }
        return parts.join(' &middot; ');
    },

    // =========================================================================
    // Utility
    // =========================================================================
    esc(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

if (typeof window !== 'undefined') {
    window.FedRAMPDocsHub = FedRAMPDocsHub;
}
