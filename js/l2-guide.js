// CMMC Level 2 Interactive Guide Viewer
// Standalone quick-reference viewer for the L2 Assessment & Scoping Guides

const L2Guide = {

    _activeTab: 'overview',
    _searchTerm: '',
    _expandedSections: new Set(),
    _checklistState: null,

    // ── Public API ──────────────────────────────────────────────────
    render() {
        const container = document.getElementById('l2-guide-content');
        if (!container) return;
        const data = window.CMMC_L2_GUIDE_DATA;
        if (!data) {
            container.innerHTML = '<div class="l2g-empty">Guide data not loaded.</div>';
            return;
        }

        this._checklistState = this._checklistState || this._loadChecklist();

        container.innerHTML = `
            <div class="l2g-wrap">
                ${this._renderHeader(data)}
                ${this._renderTabs()}
                <div class="l2g-search-bar">
                    <svg class="l2g-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <input type="text" class="l2g-search-input" id="l2g-search" placeholder="Search the guide..." value="${this._esc(this._searchTerm)}">
                    ${this._searchTerm ? '<button class="l2g-search-clear" id="l2g-search-clear">&times;</button>' : ''}
                </div>
                <div class="l2g-body" id="l2g-body">
                    ${this._renderActiveTab(data)}
                </div>
                ${this._renderSourceLinks(data)}
            </div>
        `;

        this._bind(container);
    },

    // ── Header ──────────────────────────────────────────────────────
    _renderHeader(data) {
        return `
            <div class="l2g-header">
                <div class="l2g-header-badge">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <span>CMMC 2.0 — Level 1 &amp; Level 2</span>
                </div>
                <h1 class="l2g-header-title">Interactive Assessment &amp; Scoping Guide</h1>
                <p class="l2g-header-sub">Pocket reference for the official DoD CMMC guides. <strong>L1: 17 practices &middot; L2: 110 practices &middot; 320 objectives &middot; 14 families</strong></p>
                <div class="l2g-disclaimer">${this._esc(data.meta.disclaimer)}</div>
            </div>
        `;
    },

    // ── Tabs ─────────────────────────────────────────────────────────
    _renderTabs() {
        const tabs = [
            { id: 'l1', label: 'Level 1', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
            { id: 'overview', label: 'L2 Assessment', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
            { id: 'scoping', label: 'Scoping Guide', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' },
            { id: 'assets', label: 'Asset Categories', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20"/><path d="M17 2v20"/><path d="M2 12h20"/></svg>' },
            { id: 'families', label: 'Control Families', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>' },
            { id: 'glossary', label: 'Glossary', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
            { id: 'faq', label: 'FAQ', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' },
            { id: 'checklist', label: 'Readiness Checklist', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>' }
        ];
        return `
            <div class="l2g-tabs" id="l2g-tabs">
                ${tabs.map(t => `<button class="l2g-tab ${this._activeTab === t.id ? 'active' : ''}" data-tab="${t.id}">${t.icon}<span>${t.label}</span></button>`).join('')}
            </div>
        `;
    },

    // ── Tab Router ───────────────────────────────────────────────────
    _renderActiveTab(data) {
        const s = this._searchTerm.toLowerCase().trim();
        switch (this._activeTab) {
            case 'l1': return this._renderL1Overview(data, s);
            case 'overview': return this._renderSections(data.assessmentOverview.sections, s);
            case 'scoping': return this._renderScopingSections(data, s);
            case 'assets': return this._renderAssetCategories(data.assetCategories, s);
            case 'families': return this._renderFamilies(data.controlFamilies, s);
            case 'glossary': return this._renderGlossary(data.glossary, s);
            case 'faq': return this._renderFAQ(data.faq, s);
            case 'checklist': return this._renderChecklist(data.checklist, s);
            default: return '';
        }
    },

    // ── Assessment Overview Sections ─────────────────────────────────
    _renderSections(sections, search) {
        const filtered = search ? sections.filter(s => this._matchSection(s, search)) : sections;
        if (!filtered.length) return this._emptyState('No matching sections found.');
        return `<div class="l2g-sections">${filtered.map(s => this._renderAccordion(s, search)).join('')}</div>`;
    },

    _renderAccordion(section, search) {
        const open = this._expandedSections.has(section.id) || !!search;
        const highlighted = search ? this._highlight(section.content, search) : this._esc(section.content);
        return `
            <div class="l2g-accordion ${open ? 'open' : ''}" data-section="${section.id}">
                <button class="l2g-accordion-header" data-section="${section.id}">
                    <span class="l2g-accordion-icon">${section.icon}</span>
                    <span class="l2g-accordion-title">${search ? this._highlight(section.title, search) : this._esc(section.title)}</span>
                    <svg class="l2g-accordion-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <div class="l2g-accordion-body" ${open ? 'style="display:block"' : ''}>
                    <p class="l2g-section-text">${highlighted}</p>
                    <ul class="l2g-key-points">
                        ${section.keyPoints.map(kp => {
                            if (search && !kp.toLowerCase().includes(search)) return '';
                            return `<li>${search ? this._highlight(kp, search) : this._esc(kp)}</li>`;
                        }).filter(Boolean).join('') || section.keyPoints.map(kp => `<li>${this._esc(kp)}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    },

    // ── Scoping Guide (combined sections + boundary) ─────────────────
    _renderScopingSections(data, search) {
        const scopeSections = data.scopingOverview.sections;
        const boundarySections = data.cuiBoundary.sections;
        const all = [...scopeSections, ...boundarySections];
        const filtered = search ? all.filter(s => this._matchSection(s, search)) : all;
        if (!filtered.length) return this._emptyState('No matching scoping sections found.');

        return `
            <div class="l2g-sections">
                <h3 class="l2g-group-title">Scoping Fundamentals</h3>
                ${scopeSections.filter(s => !search || this._matchSection(s, search)).map(s => this._renderAccordion(s, search)).join('') || '<p class="l2g-muted">No matches in this section.</p>'}
                <h3 class="l2g-group-title" style="margin-top:24px">CUI Environment Boundary</h3>
                ${boundarySections.filter(s => !search || this._matchSection(s, search)).map(s => this._renderAccordion(s, search)).join('') || '<p class="l2g-muted">No matches in this section.</p>'}
            </div>
        `;
    },

    // ── Asset Categories ─────────────────────────────────────────────
    _renderAssetCategories(categories, search) {
        const filtered = search ? categories.filter(c => this._matchAsset(c, search)) : categories;
        if (!filtered.length) return this._emptyState('No matching asset categories found.');

        return `
            <div class="l2g-asset-grid">
                ${filtered.map(cat => {
                    const open = this._expandedSections.has(cat.id) || !!search;
                    return `
                        <div class="l2g-asset-card ${open ? 'open' : ''}" data-section="${cat.id}" style="--cat-color:${cat.color}">
                            <button class="l2g-asset-header" data-section="${cat.id}">
                                <span class="l2g-asset-icon">${cat.icon}</span>
                                <div class="l2g-asset-meta">
                                    <span class="l2g-asset-name">${search ? this._highlight(cat.name, search) : this._esc(cat.name)}</span>
                                    <span class="l2g-asset-badges">
                                        <span class="l2g-badge ${cat.inScope ? 'in-scope' : 'oos'}">${cat.inScope ? 'In Scope' : 'Out of Scope'}</span>
                                        ${cat.allControlsApply ? '<span class="l2g-badge all-controls">All 110 Practices</span>' : '<span class="l2g-badge partial-controls">Risk-Based</span>'}
                                    </span>
                                </div>
                                <svg class="l2g-accordion-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                            </button>
                            <div class="l2g-asset-body" ${open ? 'style="display:block"' : ''}>
                                <p class="l2g-section-text">${search ? this._highlight(cat.description, search) : this._esc(cat.description)}</p>
                                <div class="l2g-two-col">
                                    <div>
                                        <h4 class="l2g-col-title">Examples</h4>
                                        <ul class="l2g-examples">${cat.examples.map(e => `<li>${search ? this._highlight(e, search) : this._esc(e)}</li>`).join('')}</ul>
                                    </div>
                                    <div>
                                        <h4 class="l2g-col-title">Requirements</h4>
                                        <ul class="l2g-requirements">${cat.requirements.map(r => `<li>${search ? this._highlight(r, search) : this._esc(r)}</li>`).join('')}</ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    // ── Level 1 Overview ──────────────────────────────────────────────
    _renderL1Overview(data, search) {
        if (!data.l1Overview) return this._emptyState('Level 1 data not available.');
        const sections = data.l1Overview.sections;
        const filtered = search ? sections.filter(s => this._matchSection(s, search)) : sections;
        if (!filtered.length) return this._emptyState('No matching Level 1 sections found.');

        const l1Controls = [];
        (data.controlFamilies || []).forEach(f => {
            (f.allControls || []).forEach(c => { if (c.l1) l1Controls.push({ ...c, family: f.id, familyName: f.name }); });
        });

        let html = `
            <div class="l2g-l1-banner">
                <div class="l2g-l1-banner-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div class="l2g-l1-banner-text">
                    <strong>CMMC Level 1 — Foundational</strong>
                    <span>17 practices &middot; Self-assessment &middot; FCI protection &middot; Annual submission to SPRS</span>
                </div>
            </div>
            <div class="l2g-sections">${filtered.map(s => this._renderAccordion(s, search)).join('')}</div>
        `;

        if (l1Controls.length) {
            html += `
                <h3 class="l2g-group-title" style="margin-top:24px">All 17 Level 1 Practices</h3>
                <div class="l2g-all-controls-list">
                    ${l1Controls.map(c => `
                        <div class="l2g-control-row l2g-control-l1">
                            <span class="l2g-control-id">${this._esc(c.id)}</span>
                            <span class="l2g-control-name">${search ? this._highlight(c.name, search) : this._esc(c.name)}</span>
                            <span class="l2g-control-family-tag">${this._esc(c.family)}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        return html;
    },

    // ── Control Families ─────────────────────────────────────────────
    _renderFamilies(families, search) {
        const filtered = search ? families.filter(f => this._matchFamily(f, search)) : families;
        if (!filtered.length) return this._emptyState('No matching control families found.');

        const totalPractices = families.reduce((s, f) => s + f.practiceCount, 0);
        const totalObj = families.reduce((s, f) => s + f.objectiveCount, 0);
        const totalL1 = families.reduce((s, f) => s + (f.allControls || []).filter(c => c.l1).length, 0);

        return `
            <div class="l2g-families-summary">
                <div class="l2g-fam-kpi"><span class="l2g-fam-kpi-val">${families.length}</span><span class="l2g-fam-kpi-label">Families</span></div>
                <div class="l2g-fam-kpi"><span class="l2g-fam-kpi-val">${totalPractices}</span><span class="l2g-fam-kpi-label">L2 Practices</span></div>
                <div class="l2g-fam-kpi"><span class="l2g-fam-kpi-val">${totalL1}</span><span class="l2g-fam-kpi-label">L1 Practices</span></div>
                <div class="l2g-fam-kpi"><span class="l2g-fam-kpi-val">${totalObj}</span><span class="l2g-fam-kpi-label">Objectives</span></div>
            </div>
            <div class="l2g-families-grid">
                ${filtered.map(f => {
                    const open = this._expandedSections.has('fam-' + f.id) || !!search;
                    const pctOfTotal = Math.round((f.practiceCount / totalPractices) * 100);
                    const l1Count = (f.allControls || []).filter(c => c.l1).length;
                    return `
                        <div class="l2g-family-card ${open ? 'open' : ''}" data-section="fam-${f.id}">
                            <button class="l2g-family-header" data-section="fam-${f.id}">
                                <span class="l2g-family-id">${f.id}</span>
                                <div class="l2g-family-info">
                                    <span class="l2g-family-name">${search ? this._highlight(f.name, search) : this._esc(f.name)}</span>
                                    <span class="l2g-family-counts">${f.practiceCount} practices &middot; ${f.objectiveCount} obj${l1Count ? ' &middot; ' + l1Count + ' L1' : ''}</span>
                                </div>
                                <div class="l2g-family-bar-wrap">
                                    <div class="l2g-family-bar" style="width:${pctOfTotal}%"></div>
                                </div>
                                <svg class="l2g-accordion-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                            </button>
                            <div class="l2g-family-body" ${open ? 'style="display:block"' : ''}>
                                <p class="l2g-section-text">${search ? this._highlight(f.description, search) : this._esc(f.description)}</p>
                                <h4 class="l2g-col-title">Key Practices</h4>
                                <ul class="l2g-top-practices">${f.topPractices.map(p => `<li>${search ? this._highlight(p, search) : this._esc(p)}</li>`).join('')}</ul>
                                ${f.allControls && f.allControls.length ? `
                                    <h4 class="l2g-col-title" style="margin-top:16px">All ${f.allControls.length} Controls</h4>
                                    <div class="l2g-all-controls-list">
                                        ${f.allControls.map(c => `
                                            <div class="l2g-control-row ${c.l1 ? 'l2g-control-l1' : ''}">
                                                <span class="l2g-control-id">${this._esc(c.id)}</span>
                                                <span class="l2g-control-name">${search ? this._highlight(c.name, search) : this._esc(c.name)}</span>
                                                ${c.l1 ? '<span class="l2g-l1-badge">L1</span>' : ''}
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                                <button class="l2g-assess-link" data-family="${f.id}">Open in Assessment Tool &rarr;</button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    // ── Glossary ─────────────────────────────────────────────────────
    _renderGlossary(glossary, search) {
        const filtered = search ? glossary.filter(g => g.term.toLowerCase().includes(search) || g.definition.toLowerCase().includes(search)) : glossary;
        if (!filtered.length) return this._emptyState('No matching glossary terms found.');

        return `
            <div class="l2g-glossary-list">
                ${filtered.map(g => `
                    <div class="l2g-glossary-item">
                        <dt class="l2g-glossary-term">${search ? this._highlight(g.term, search) : this._esc(g.term)}</dt>
                        <dd class="l2g-glossary-def">${search ? this._highlight(g.definition, search) : this._esc(g.definition)}</dd>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // ── FAQ ──────────────────────────────────────────────────────────
    _renderFAQ(faq, search) {
        const filtered = search ? faq.filter(f => f.q.toLowerCase().includes(search) || f.a.toLowerCase().includes(search)) : faq;
        if (!filtered.length) return this._emptyState('No matching questions found.');

        return `
            <div class="l2g-faq-list">
                ${filtered.map((f, i) => {
                    const open = this._expandedSections.has('faq-' + i) || !!search;
                    return `
                        <div class="l2g-faq-item ${open ? 'open' : ''}" data-section="faq-${i}">
                            <button class="l2g-faq-q" data-section="faq-${i}">
                                <span class="l2g-faq-q-text">${search ? this._highlight(f.q, search) : this._esc(f.q)}</span>
                                <svg class="l2g-accordion-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                            </button>
                            <div class="l2g-faq-a" ${open ? 'style="display:block"' : ''}>
                                <p>${search ? this._highlight(f.a, search) : this._esc(f.a)}</p>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    // ── Readiness Checklist ──────────────────────────────────────────
    _renderChecklist(checklist, search) {
        const phases = ['Preparation', 'Implementation', 'Assessment', 'Maintenance'];
        const filtered = search ? checklist.filter(c => c.item.toLowerCase().includes(search) || c.phase.toLowerCase().includes(search)) : checklist;
        if (!filtered.length) return this._emptyState('No matching checklist items found.');

        const totalChecked = Object.values(this._checklistState).filter(Boolean).length;
        const totalItems = checklist.length;
        const pct = Math.round((totalChecked / totalItems) * 100);

        let html = `
            <div class="l2g-checklist-progress">
                <div class="l2g-checklist-bar-wrap">
                    <div class="l2g-checklist-bar" style="width:${pct}%"></div>
                </div>
                <span class="l2g-checklist-pct">${totalChecked}/${totalItems} complete (${pct}%)</span>
            </div>
        `;

        phases.forEach(phase => {
            const items = filtered.filter(c => c.phase === phase);
            if (!items.length) return;
            html += `<h3 class="l2g-checklist-phase">${phase}</h3><div class="l2g-checklist-items">`;
            items.forEach(c => {
                const checked = this._checklistState[c.id] || false;
                html += `
                    <label class="l2g-checklist-item ${checked ? 'checked' : ''} ${c.critical ? 'critical' : ''}">
                        <input type="checkbox" class="l2g-ck-input" data-ck="${c.id}" ${checked ? 'checked' : ''}>
                        <span class="l2g-ck-box"></span>
                        <span class="l2g-ck-text">${search ? this._highlight(c.item, search) : this._esc(c.item)}</span>
                        ${c.critical ? '<span class="l2g-ck-critical">Critical</span>' : ''}
                    </label>
                `;
            });
            html += '</div>';
        });

        return html;
    },

    // ── Source Links Footer ──────────────────────────────────────────
    _renderSourceLinks(data) {
        return `
            <div class="l2g-source-links">
                <span class="l2g-source-label">Official Sources:</span>
                <a href="${this._esc(data.meta.assessmentGuideUrl)}" target="_blank" rel="noopener noreferrer" class="l2g-source-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    L2 Assessment Guide
                </a>
                <a href="${this._esc(data.meta.assessmentGuideL1Url)}" target="_blank" rel="noopener noreferrer" class="l2g-source-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    L1 Assessment Guide
                </a>
                <a href="${this._esc(data.meta.scopingGuideUrl)}" target="_blank" rel="noopener noreferrer" class="l2g-source-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    L2 Scoping Guide
                </a>
                <a href="${this._esc(data.meta.cmmcModelUrl)}" target="_blank" rel="noopener noreferrer" class="l2g-source-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    CMMC Model Overview
                </a>
                <a href="${this._esc(data.meta.finalRuleUrl)}" target="_blank" rel="noopener noreferrer" class="l2g-source-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                    32 CFR Part 170 (Final Rule)
                </a>
            </div>
        `;
    },

    // ── Event Binding ────────────────────────────────────────────────
    _bind(container) {
        // Tab clicks
        container.querySelectorAll('.l2g-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                this._activeTab = btn.dataset.tab;
                this._expandedSections.clear();
                this.render();
            });
        });

        // Search
        const searchInput = container.querySelector('#l2g-search');
        if (searchInput) {
            let debounce;
            searchInput.addEventListener('input', () => {
                clearTimeout(debounce);
                debounce = setTimeout(() => {
                    this._searchTerm = searchInput.value;
                    this._rerenderBody();
                }, 200);
            });
            // Restore focus after re-render
            if (this._searchTerm) {
                searchInput.focus();
                searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
            }
        }

        const clearBtn = container.querySelector('#l2g-search-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this._searchTerm = '';
                this.render();
            });
        }

        // Accordions
        this._bindAccordions(container);

        // Checklist
        container.querySelectorAll('.l2g-ck-input').forEach(cb => {
            cb.addEventListener('change', () => {
                this._checklistState[cb.dataset.ck] = cb.checked;
                this._saveChecklist();
                this._rerenderBody();
            });
        });

        // Assess link (navigate to assessment tool)
        container.querySelectorAll('.l2g-assess-link').forEach(btn => {
            btn.addEventListener('click', () => {
                const familyId = btn.dataset.family;
                if (window.app && typeof window.app.navigateToFamily === 'function') {
                    window.app.navigateToFamily(familyId);
                }
            });
        });
    },

    _bindAccordions(container) {
        const headers = container.querySelectorAll('.l2g-accordion-header, .l2g-asset-header, .l2g-family-header, .l2g-faq-q');
        headers.forEach(h => {
            h.addEventListener('click', () => {
                const sectionId = h.dataset.section;
                const parent = h.parentElement.closest('[data-section]');
                if (!parent) return;
                const isOpen = parent.classList.contains('open');
                if (isOpen) {
                    parent.classList.remove('open');
                    this._expandedSections.delete(sectionId);
                    const body = parent.querySelector('.l2g-accordion-body, .l2g-asset-body, .l2g-family-body, .l2g-faq-a');
                    if (body) body.style.display = 'none';
                } else {
                    parent.classList.add('open');
                    this._expandedSections.add(sectionId);
                    const body = parent.querySelector('.l2g-accordion-body, .l2g-asset-body, .l2g-family-body, .l2g-faq-a');
                    if (body) body.style.display = 'block';
                }
            });
        });
    },

    _rerenderBody() {
        const body = document.getElementById('l2g-body');
        const data = window.CMMC_L2_GUIDE_DATA;
        if (!body || !data) return;
        body.innerHTML = this._renderActiveTab(data);
        this._bindAccordions(body);
        // Re-bind checklist
        body.querySelectorAll('.l2g-ck-input').forEach(cb => {
            cb.addEventListener('change', () => {
                this._checklistState[cb.dataset.ck] = cb.checked;
                this._saveChecklist();
                this._rerenderBody();
            });
        });
        // Re-bind assess links
        body.querySelectorAll('.l2g-assess-link').forEach(btn => {
            btn.addEventListener('click', () => {
                const familyId = btn.dataset.family;
                if (window.app && typeof window.app.navigateToFamily === 'function') {
                    window.app.navigateToFamily(familyId);
                }
            });
        });
    },

    // ── Search Helpers ───────────────────────────────────────────────
    _matchSection(s, search) {
        return s.title.toLowerCase().includes(search) ||
               s.content.toLowerCase().includes(search) ||
               (s.keyPoints && s.keyPoints.some(kp => kp.toLowerCase().includes(search)));
    },

    _matchAsset(c, search) {
        return c.name.toLowerCase().includes(search) ||
               c.description.toLowerCase().includes(search) ||
               c.examples.some(e => e.toLowerCase().includes(search)) ||
               c.requirements.some(r => r.toLowerCase().includes(search));
    },

    _matchFamily(f, search) {
        return f.id.toLowerCase().includes(search) ||
               f.name.toLowerCase().includes(search) ||
               f.description.toLowerCase().includes(search) ||
               f.topPractices.some(p => p.toLowerCase().includes(search)) ||
               (f.allControls && f.allControls.some(c => c.id.toLowerCase().includes(search) || c.name.toLowerCase().includes(search)));
    },

    // ── Utilities ────────────────────────────────────────────────────
    _esc(str) {
        if (typeof Sanitize !== 'undefined' && Sanitize.html) return Sanitize.html(str);
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    },

    _highlight(text, search) {
        const escaped = this._esc(text);
        if (!search) return escaped;
        const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return escaped.replace(regex, '<mark class="l2g-highlight">$1</mark>');
    },

    _emptyState(msg) {
        return `<div class="l2g-empty"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg><p>${msg}</p></div>`;
    },

    // ── Checklist Persistence ────────────────────────────────────────
    _loadChecklist() {
        try {
            const raw = localStorage.getItem('cmmc_l2_guide_checklist');
            return raw ? JSON.parse(raw) : {};
        } catch { return {}; }
    },

    _saveChecklist() {
        try {
            localStorage.setItem('cmmc_l2_guide_checklist', JSON.stringify(this._checklistState));
        } catch (e) { console.warn('[L2Guide] Could not save checklist:', e); }
    }
};

if (typeof window !== 'undefined') window.L2Guide = L2Guide;
