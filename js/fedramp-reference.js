// FedRAMP 20x Reference Panel
// Provides an in-app browser for FedRAMP 20x KSI families, control mappings,
// and links to external FedRAMP/CMVP resources.

const FedRAMPReference = {
    currentTab: 'ksi',

    init() {
        const container = document.getElementById('fedramp-reference-content');
        if (!container) return;
        this.container = container;
        this.render();
    },

    render() {
        this.container.innerHTML = `
            <div class="fedramp-reference">
                <div class="fedramp-ref-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
                    <div style="flex:1;min-width:250px;">
                        <h2>FedRAMP 20x Reference</h2>
                        <p>Browse FedRAMP 20x Key Security Indicators (KSIs), explore 800-53 control mappings, and access external compliance resources. The FedRAMP 20x framework modernizes cloud authorization with 11 KSI families and 61 indicators.</p>
                    </div>
                    <button class="terminal-mode-toggle" id="fedramp-terminal-toggle">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                        Terminal Mode
                    </button>
                </div>
                <div id="fedramp-terminal-container" style="display:none;margin-bottom:20px;"></div>
                <div id="fedramp-gui-content">
                <div class="fedramp-ref-tabs">
                    <button class="fedramp-ref-tab active" data-tab="ksi">KSI Families</button>
                    <button class="fedramp-ref-tab" data-tab="impl-guide">Implementation Guide</button>
                    <button class="fedramp-ref-tab" data-tab="mapping">800-171 Mapping</button>
                    <button class="fedramp-ref-tab" data-tab="aws-rsc">AWS RSC Guidance</button>
                    <button class="fedramp-ref-tab" data-tab="resources">Resources & Tools</button>
                </div>
                <div id="fedramp-tab-content"></div>
                </div>
            </div>
        `;
        this.bindTabs();
        this.bindTerminalToggle();
        this.renderTab('ksi');
    },

    bindTabs() {
        this.container.querySelectorAll('.fedramp-ref-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.container.querySelectorAll('.fedramp-ref-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentTab = tab.dataset.tab;
                this.renderTab(this.currentTab);
            });
        });
    },

    renderTab(tab) {
        const content = document.getElementById('fedramp-tab-content');
        if (!content) return;
        switch (tab) {
            case 'ksi': content.innerHTML = this.renderKSITab(); break;
            case 'impl-guide': content.innerHTML = this.renderImplGuideTab(); break;
            case 'mapping': content.innerHTML = this.renderMappingTab(); break;
            case 'aws-rsc': content.innerHTML = this.renderAWSRSCTab(); break;
            case 'resources': content.innerHTML = this.renderResourcesTab(); break;
        }
        if (tab === 'ksi') this.bindKSIFilters();
        if (tab === 'impl-guide') this.bindImplGuide();
    },

    renderKSITab() {
        if (typeof FEDRAMP_KSI_REFERENCE === 'undefined') {
            return '<div class="cmvp-empty">KSI reference data not loaded.</div>';
        }
        const families = FEDRAMP_KSI_REFERENCE.families;
        const totalKSIs = families.reduce((sum, f) => sum + f.ksis.length, 0);
        const moderateOnly = families.reduce((sum, f) => sum + f.ksis.filter(k => k.baselines.length === 1 && k.baselines[0] === 'moderate').length, 0);

        let html = `
            <div class="cmvp-stats-bar">
                <div class="cmvp-stat"><span class="cmvp-stat-value">${families.length}</span><span class="cmvp-stat-label">KSI Families</span></div>
                <div class="cmvp-stat"><span class="cmvp-stat-value">${totalKSIs}</span><span class="cmvp-stat-label">Total KSIs</span></div>
                <div class="cmvp-stat"><span class="cmvp-stat-value">${totalKSIs - moderateOnly}</span><span class="cmvp-stat-label">Low Baseline</span></div>
                <div class="cmvp-stat"><span class="cmvp-stat-value">${moderateOnly}</span><span class="cmvp-stat-label">Moderate-Only</span></div>
            </div>
            <div class="cmvp-search-bar">
                <input type="text" class="cmvp-search-input" id="fedramp-ksi-search" placeholder="Search KSIs by ID, title, or description..." autocomplete="off">
                <select class="cmvp-filter-select" id="fedramp-family-filter">
                    <option value="all">All Families</option>
                    ${families.map(f => `<option value="${f.id}">${f.id} — ${f.name}</option>`).join('')}
                </select>
                <select class="cmvp-filter-select" id="fedramp-baseline-filter">
                    <option value="all">All Baselines</option>
                    <option value="low">Low + Moderate</option>
                    <option value="moderate">Moderate-Only</option>
                </select>
            </div>
            <div id="fedramp-ksi-results">
        `;

        html += this.renderKSICards(families);
        html += '</div>';
        return html;
    },

    renderKSICards(families, query, familyFilter, baselineFilter) {
        query = (query || '').toLowerCase().trim();
        familyFilter = familyFilter || 'all';
        baselineFilter = baselineFilter || 'all';

        let html = '';
        for (const family of families) {
            if (familyFilter !== 'all' && family.id !== familyFilter) continue;

            const filteredKSIs = family.ksis.filter(k => {
                if (baselineFilter === 'low' && !(k.baselines.includes('low'))) return false;
                if (baselineFilter === 'moderate' && !(k.baselines.length === 1 && k.baselines[0] === 'moderate')) return false;
                if (query) {
                    const haystack = `${k.id} ${k.title} ${k.desc} ${family.id} ${family.name}`.toLowerCase();
                    if (!haystack.includes(query)) return false;
                }
                return true;
            });

            if (filteredKSIs.length === 0) continue;

            html += `<h3 style="margin:16px 0 8px;font-size:0.9rem;color:var(--text-primary);">${this.esc(family.id)} — ${this.esc(family.name)}</h3>`;
            html += `<p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:12px;">${this.esc(family.description)}</p>`;
            html += '<div class="fedramp-ksi-grid">';

            for (const ksi of filteredKSIs) {
                const baselineTags = ksi.baselines.map(b =>
                    `<span class="cmvp-tag ${b === 'moderate' ? 'fips2' : 'fips3'}">${b}</span>`
                ).join('');

                const nist171Families = (FEDRAMP_KSI_REFERENCE.familyToNist171[family.id] || []).join(', ');

                html += `
                    <div class="fedramp-ksi-card">
                        <span class="fedramp-ksi-id">${this.esc(ksi.id)}</span>
                        <div class="fedramp-ksi-title">${this.esc(ksi.title)}</div>
                        <div class="fedramp-ksi-desc">${this.esc(ksi.desc)}</div>
                        <div class="cmvp-module-tags" style="margin-bottom:6px;">${baselineTags}</div>
                        ${nist171Families ? `<div class="fedramp-ksi-controls"><strong>Related 800-171:</strong> ${this.esc(nist171Families)}</div>` : ''}
                    </div>
                `;
            }
            html += '</div>';
        }

        if (!html) {
            html = '<div class="cmvp-empty">No KSIs match your search criteria.</div>';
        }
        return html;
    },

    bindKSIFilters() {
        const search = document.getElementById('fedramp-ksi-search');
        const familyFilter = document.getElementById('fedramp-family-filter');
        const baselineFilter = document.getElementById('fedramp-baseline-filter');
        const results = document.getElementById('fedramp-ksi-results');

        const doFilter = () => {
            if (!results || typeof FEDRAMP_KSI_REFERENCE === 'undefined') return;
            results.innerHTML = this.renderKSICards(
                FEDRAMP_KSI_REFERENCE.families,
                search?.value,
                familyFilter?.value,
                baselineFilter?.value
            );
        };

        search?.addEventListener('input', doFilter);
        familyFilter?.addEventListener('change', doFilter);
        baselineFilter?.addEventListener('change', doFilter);
    },

    renderMappingTab() {
        if (typeof FEDRAMP_KSI_REFERENCE === 'undefined') {
            return '<div class="cmvp-empty">Reference data not loaded.</div>';
        }

        const mapping = FEDRAMP_KSI_REFERENCE.familyToNist171;
        let html = `
            <div class="cmvp-context-note">
                <strong>FedRAMP 20x ↔ NIST 800-171 Mapping:</strong> This table shows which FedRAMP 20x KSI families relate to NIST 800-171 control families. Use this to understand how your CMMC assessment maps to FedRAMP requirements when pursuing dual compliance.
            </div>
            <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
                <thead>
                    <tr style="border-bottom:2px solid var(--border-color);">
                        <th style="text-align:left;padding:10px 12px;color:var(--text-secondary);font-weight:600;">FedRAMP 20x Family</th>
                        <th style="text-align:left;padding:10px 12px;color:var(--text-secondary);font-weight:600;">Description</th>
                        <th style="text-align:left;padding:10px 12px;color:var(--text-secondary);font-weight:600;">Related 800-171 Families</th>
                        <th style="text-align:center;padding:10px 12px;color:var(--text-secondary);font-weight:600;">KSIs</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (const family of FEDRAMP_KSI_REFERENCE.families) {
            const related = (mapping[family.id] || []).map(f =>
                `<span class="cmvp-tag fips2" style="margin:2px;">${f}</span>`
            ).join('');

            html += `
                <tr style="border-bottom:1px solid var(--border-color);">
                    <td style="padding:10px 12px;font-weight:600;color:var(--text-primary);white-space:nowrap;">
                        <span class="fedramp-ksi-id" style="margin-right:8px;">${this.esc(family.id)}</span>
                        ${this.esc(family.name)}
                    </td>
                    <td style="padding:10px 12px;color:var(--text-secondary);">${this.esc(family.description)}</td>
                    <td style="padding:10px 12px;">${related || '<span style="color:var(--text-muted);">—</span>'}</td>
                    <td style="padding:10px 12px;text-align:center;font-weight:600;color:var(--accent-blue);">${family.ksis.length}</td>
                </tr>
            `;
        }

        html += '</tbody></table></div>';
        return html;
    },

    renderResourcesTab() {
        if (typeof FEDRAMP_KSI_REFERENCE === 'undefined') {
            return '<div class="cmvp-empty">Reference data not loaded.</div>';
        }

        const icons = {
            server: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
            globe: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
            zap: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
            book: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
            shield: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
            terminal: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
            cloud: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
            download: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
        };

        const arrow = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

        let html = `
            <div class="cmvp-context-note">
                <strong>External Resources:</strong> These tools and references provide deeper access to FedRAMP documentation, NIST CMVP data, and compliance guidance. The FedRAMP Docs MCP Server provides AI-assisted compliance analysis when used with compatible AI clients.
            </div>
            <div class="fedramp-external-links">
        `;

        for (const res of FEDRAMP_KSI_REFERENCE.externalResources) {
            html += `
                <a href="${res.url}" target="_blank" rel="noopener" class="fedramp-ext-link">
                    <div class="ext-icon">${icons[res.icon] || icons.globe}</div>
                    <div class="ext-info">
                        <h4>${this.esc(res.title)}</h4>
                        <p>${this.esc(res.description)}</p>
                    </div>
                    <div class="ext-arrow">${arrow}</div>
                </a>
            `;
        }

        html += '</div>';
        return html;
    },

    renderAWSRSCTab() {
        if (typeof FEDRAMP_KSI_REFERENCE === 'undefined' || !FEDRAMP_KSI_REFERENCE.awsRSC) {
            return '<div class="cmvp-empty">AWS RSC reference data not loaded.</div>';
        }

        const rscs = FEDRAMP_KSI_REFERENCE.awsRSC;
        const categories = [...new Set(rscs.map(r => r.category))];
        const totalSteps = rscs.reduce((s, r) => s + (r.implementation?.steps?.length || 0), 0);
        const totalCLI = rscs.reduce((s, r) => s + (r.implementation?.cliExamples?.length || 0), 0);

        let html = `
            <div class="cmvp-context-note">
                <strong>AWS FedRAMP Rev5 Recommended Secure Configuration (FRR-RSC):</strong>
                AWS provides comprehensive security configuration guidance aligned with FedRAMP Revision 5 across 10 RSC requirements covering 161 AWS services. Each requirement below includes detailed implementation steps, CLI commands, verification checklists, and architecture guidance.
            </div>
            <div class="cmvp-stats-bar">
                <div class="cmvp-stat"><span class="cmvp-stat-value">${rscs.length}</span><span class="cmvp-stat-label">RSC Requirements</span></div>
                <div class="cmvp-stat"><span class="cmvp-stat-value">161</span><span class="cmvp-stat-label">AWS Services</span></div>
                <div class="cmvp-stat"><span class="cmvp-stat-value">${totalSteps}</span><span class="cmvp-stat-label">Implementation Steps</span></div>
                <div class="cmvp-stat"><span class="cmvp-stat-value">${totalCLI}</span><span class="cmvp-stat-label">CLI Examples</span></div>
            </div>
            <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;">
                <a href="https://docs.aws.amazon.com/fedramp/latest/userguide/introduction.html" target="_blank" rel="noopener" class="rsc-action-btn primary">View Full AWS Guidance ↗</a>
                <a href="https://docs.aws.amazon.com/fedramp/latest/userguide/samples/FRR-RSC.zip" target="_blank" rel="noopener" class="rsc-action-btn secondary">Download OSCAL Artifacts ↓</a>
            </div>
        `;

        for (const cat of categories) {
            const catRSCs = rscs.filter(r => r.category === cat);
            const catIcon = { Administrative: '🔐', Configuration: '⚙️', Monitoring: '📡', Automation: '🤖', Documentation: '📋' }[cat] || '📦';
            html += `<h3 class="rsc-category-heading"><span class="rsc-cat-icon">${catIcon}</span> ${this.esc(cat)}</h3>`;

            for (const rsc of catRSCs) {
                const impl = rsc.implementation;
                const serviceTags = rsc.awsServices.map(s =>
                    `<span class="cmvp-tag type">${this.esc(s)}</span>`
                ).join('');
                const controlTags = (impl?.relatedControls || []).map(c =>
                    `<span class="cmvp-tag fips2">${this.esc(c)}</span>`
                ).join('');

                html += `
                    <div class="rsc-impl-card" data-rsc-id="${rsc.id}">
                        <div class="rsc-impl-header">
                            <div class="rsc-impl-header-left">
                                <span class="fedramp-ksi-id" style="background:rgba(245,158,11,0.12);color:#fbbf24;">${this.esc(rsc.id)}</span>
                                <div>
                                    <div class="rsc-impl-title">${this.esc(rsc.title)}</div>
                                    <div class="rsc-impl-desc">${this.esc(rsc.description)}</div>
                                </div>
                            </div>
                            <button class="rsc-expand-btn" aria-label="Expand details">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                            </button>
                        </div>
                        <div class="cmvp-module-tags" style="margin:8px 0 0;">${serviceTags} ${controlTags}</div>
                        <div class="rsc-impl-details" style="display:none;">
                `;

                if (impl) {
                    // Overview
                    html += `<div class="rsc-detail-section">
                        <div class="rsc-detail-label">Overview</div>
                        <p class="rsc-overview-text">${this.esc(impl.overview)}</p>
                    </div>`;

                    // Implementation Steps
                    if (impl.steps?.length) {
                        html += `<div class="rsc-detail-section">
                            <div class="rsc-detail-label">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                Implementation Steps
                            </div>
                            <ol class="rsc-steps-list">
                                ${impl.steps.map(s => `<li>${this.esc(s)}</li>`).join('')}
                            </ol>
                        </div>`;
                    }

                    // CLI Examples
                    if (impl.cliExamples?.length) {
                        html += `<div class="rsc-detail-section">
                            <div class="rsc-detail-label">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                                CLI / API Examples
                            </div>
                            <div class="rsc-cli-examples">
                                ${impl.cliExamples.map(ex => `
                                    <div class="rsc-cli-block">
                                        <div class="rsc-cli-title">${this.esc(ex.title)}</div>
                                        <pre class="rsc-cli-code"><code>${this.esc(ex.cmd)}</code></pre>
                                    </div>
                                `).join('')}
                            </div>
                        </div>`;
                    }

                    // Verification
                    if (impl.verification?.length) {
                        html += `<div class="rsc-detail-section">
                            <div class="rsc-detail-label">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                Verification Checklist
                            </div>
                            <ul class="rsc-verification-list">
                                ${impl.verification.map(v => `<li><span class="rsc-check-icon">☐</span> ${this.esc(v)}</li>`).join('')}
                            </ul>
                        </div>`;
                    }

                    // Architecture Notes
                    if (impl.architectureNotes) {
                        html += `<div class="rsc-detail-section rsc-arch-notes">
                            <div class="rsc-detail-label">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                Architecture Notes
                            </div>
                            <p class="rsc-arch-text">${this.esc(impl.architectureNotes)}</p>
                        </div>`;
                    }
                }

                html += `</div></div>`;
            }
        }

        // Bind expand/collapse after render
        setTimeout(() => this.bindRSCExpanders(), 0);
        return html;
    },

    bindRSCExpanders() {
        const cards = document.querySelectorAll('.rsc-impl-card');
        cards.forEach(card => {
            const btn = card.querySelector('.rsc-expand-btn');
            const details = card.querySelector('.rsc-impl-details');
            if (!btn || !details) return;
            btn.addEventListener('click', () => {
                const isOpen = details.style.display !== 'none';
                details.style.display = isOpen ? 'none' : 'block';
                card.classList.toggle('expanded', !isOpen);
                btn.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
            });
            // Also allow clicking the header area
            const header = card.querySelector('.rsc-impl-header');
            header.style.cursor = 'pointer';
            header.addEventListener('click', (e) => {
                if (e.target.closest('.rsc-expand-btn')) return;
                btn.click();
            });
        });
    },

    bindTerminalToggle() {
        const toggle = document.getElementById('fedramp-terminal-toggle');
        if (!toggle) return;
        this._terminalActive = false;

        toggle.addEventListener('click', () => {
            this._terminalActive = !this._terminalActive;
            toggle.classList.toggle('active', this._terminalActive);
            toggle.innerHTML = this._terminalActive
                ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg> GUI Mode'
                : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> Terminal Mode';

            const termContainer = document.getElementById('fedramp-terminal-container');
            const guiContent = document.getElementById('fedramp-gui-content');

            if (this._terminalActive) {
                termContainer.style.display = 'block';
                guiContent.style.display = 'none';
                if (!this._terminalInitialized && typeof FedRAMPTerminal !== 'undefined') {
                    FedRAMPTerminal.init('fedramp-terminal-container');
                    this._terminalInitialized = true;
                }
            } else {
                termContainer.style.display = 'none';
                guiContent.style.display = 'block';
            }
        });
    },

    // ===== IMPLEMENTATION GUIDE TAB =====

    renderImplGuideTab() {
        if (typeof FEDRAMP_20X_KSI === 'undefined') {
            return '<div class="cmvp-empty">FedRAMP 20x KSI data not loaded.</div>';
        }

        const indicators = FEDRAMP_20X_KSI.indicators;
        const families = FEDRAMP_20X_KSI.families;
        const totalKSIs = Object.keys(indicators).length;
        const lowCount = Object.values(indicators).filter(k => k.low).length;

        let html = `
            <div class="cmvp-context-note">
                <strong>Interactive FedRAMP 20x Implementation Guide:</strong>
                Click any KSI to drill down into related 800-53 controls, mapped 800-171 controls with your <strong>live assessment status</strong>, implementation guidance, evidence examples, and MCP server queries. Powered by data from the <a href="https://github.com/ethanolivertroy/fedramp-docs-mcp" target="_blank" rel="noopener" style="color:#8ba2ff;">FedRAMP Docs MCP Server</a>.
            </div>
            <div class="cmvp-stats-bar">
                <div class="cmvp-stat"><span class="cmvp-stat-value">${Object.keys(families).length}</span><span class="cmvp-stat-label">KSI Families</span></div>
                <div class="cmvp-stat"><span class="cmvp-stat-value">${totalKSIs}</span><span class="cmvp-stat-label">Total KSIs</span></div>
                <div class="cmvp-stat"><span class="cmvp-stat-value">${lowCount}</span><span class="cmvp-stat-label">Low Baseline</span></div>
                <div class="cmvp-stat"><span class="cmvp-stat-value">${totalKSIs - lowCount}</span><span class="cmvp-stat-label">Moderate-Only</span></div>
            </div>
            <div class="cmvp-search-bar">
                <input type="text" class="cmvp-search-input" id="impl-guide-search" placeholder="Search KSIs, controls, or topics..." autocomplete="off">
                <select class="cmvp-filter-select" id="impl-guide-family-filter">
                    <option value="all">All Families</option>
                    ${Object.entries(families).map(([id, f]) => `<option value="${id}">${id} — ${f.name}</option>`).join('')}
                </select>
            </div>
            <div id="impl-guide-detail" style="display:none;"></div>
            <div id="impl-guide-list">
        `;

        html += this.renderImplGuideList(indicators, families);
        html += '</div>';
        return html;
    },

    renderImplGuideList(indicators, families, query, familyFilter) {
        query = (query || '').toLowerCase().trim();
        familyFilter = familyFilter || 'all';

        // Group by family
        const grouped = {};
        for (const [id, ksi] of Object.entries(indicators)) {
            if (familyFilter !== 'all' && ksi.family !== familyFilter) continue;
            if (query) {
                const haystack = `${id} ${ksi.title} ${ksi.description} ${ksi.family}`.toLowerCase();
                if (!haystack.includes(query)) continue;
            }
            if (!grouped[ksi.family]) grouped[ksi.family] = [];
            grouped[ksi.family].push({ id, ...ksi });
        }

        if (Object.keys(grouped).length === 0) {
            return '<div class="cmvp-empty">No KSIs match your search.</div>';
        }

        let html = '';
        for (const [famId, ksis] of Object.entries(grouped)) {
            const fam = families[famId] || { name: famId };
            html += `<h3 class="impl-guide-family-heading">${this.esc(famId)} — ${this.esc(fam.name)}</h3>`;
            html += '<div class="impl-guide-grid">';

            for (const ksi of ksis) {
                const baselineTags = [];
                if (ksi.low) baselineTags.push('<span class="cmvp-tag fips3">low</span>');
                if (ksi.moderate) baselineTags.push('<span class="cmvp-tag fips2">moderate</span>');

                // Count related 800-53 controls
                const related053 = this.get80053ForKSI(ksi.id);
                const related171 = this.get171ForKSI(ksi.id);

                html += `
                    <div class="impl-guide-card" data-ksi-id="${ksi.id}">
                        <div class="impl-guide-card-header">
                            <span class="fedramp-ksi-id">${this.esc(ksi.id)}</span>
                            <div class="cmvp-module-tags">${baselineTags.join('')}</div>
                        </div>
                        <div class="impl-guide-card-title">${this.esc(ksi.title)}</div>
                        <div class="impl-guide-card-desc">${this.esc(ksi.description.length > 120 ? ksi.description.substring(0, 120) + '...' : ksi.description)}</div>
                        <div class="impl-guide-card-footer">
                            <span class="impl-guide-badge" title="Related 800-53 controls">${related053.length} 800-53</span>
                            <span class="impl-guide-badge blue" title="Related 800-171 controls">${related171.length} 800-171</span>
                            <span class="impl-guide-drill">View Details →</span>
                        </div>
                    </div>
                `;
            }
            html += '</div>';
        }
        return html;
    },

    // Reverse lookup: find 800-53 controls that map to a given KSI
    get80053ForKSI(ksiId) {
        if (typeof FEDRAMP_20X_KSI === 'undefined') return [];
        const mapping = FEDRAMP_20X_KSI.nist80053ToKSI;
        const results = [];
        for (const [ctrl, ksis] of Object.entries(mapping)) {
            if (ksis.includes(ksiId)) results.push(ctrl);
        }
        return results;
    },

    // Get 800-171 controls related to a KSI via 800-53 bridge
    get171ForKSI(ksiId) {
        if (typeof FRAMEWORK_MAPPINGS === 'undefined') return [];
        const controls053 = this.get80053ForKSI(ksiId);
        const results = new Set();
        for (const [ctrl171, mapping] of Object.entries(FRAMEWORK_MAPPINGS)) {
            if (!mapping.nist80053) continue;
            for (const c53 of mapping.nist80053) {
                // Match base control or with enhancement
                const base53 = c53.replace(/\(.*\)/, '');
                if (controls053.some(r => r === c53 || r === base53 || r.startsWith(base53 + '.'))) {
                    results.add(ctrl171);
                }
            }
        }
        return [...results];
    },

    // Get live assessment status for an 800-171 control
    getAssessmentStatus(controlId) {
        const prefix = (typeof app !== 'undefined' && app.getStoragePrefix) ? app.getStoragePrefix() : 'nist-';
        const assessmentData = JSON.parse(localStorage.getItem(prefix + 'assessment-data') || '{}');
        const families = typeof CONTROL_FAMILIES !== 'undefined' ? CONTROL_FAMILIES : [];

        let totalObj = 0, met = 0, partial = 0, notMet = 0, notAssessed = 0;
        for (const fam of families) {
            for (const ctrl of fam.controls) {
                if (ctrl.id !== controlId) continue;
                for (const obj of ctrl.objectives) {
                    totalObj++;
                    const s = assessmentData[obj.id]?.status || 'not-assessed';
                    if (s === 'met') met++;
                    else if (s === 'partial') partial++;
                    else if (s === 'not-met') notMet++;
                    else notAssessed++;
                }
            }
        }
        if (totalObj === 0) return null;
        return { totalObj, met, partial, notMet, notAssessed };
    },

    renderImplGuideDetail(ksiId) {
        const ksi = FEDRAMP_20X_KSI.indicators[ksiId];
        if (!ksi) return '<div class="cmvp-empty">KSI not found.</div>';

        const fam = FEDRAMP_20X_KSI.families[ksi.family] || { name: ksi.family };
        const controls053 = this.get80053ForKSI(ksiId);
        const controls171 = this.get171ForKSI(ksiId);

        // Get evidence theme for this KSI family
        const evidenceThemeMap = {
            IAM: 'access-control', MLA: 'audit-logging', CMT: 'configuration-management',
            INR: 'incident-response', SVC: 'encryption', CNA: 'vulnerability-management',
            AFR: 'continuous-monitoring', RPL: 'continuous-monitoring'
        };
        const evidenceTheme = evidenceThemeMap[ksi.family];
        const evidenceExamples = (typeof FEDRAMP_DOCS_DATA !== 'undefined' && evidenceTheme)
            ? (FEDRAMP_DOCS_DATA.evidenceExamples[evidenceTheme] || []) : [];

        let html = `
            <div class="impl-detail-panel">
                <button class="impl-detail-back" id="impl-guide-back">← Back to KSI List</button>
                <div class="impl-detail-header">
                    <span class="fedramp-ksi-id" style="font-size:1rem;padding:6px 12px;">${this.esc(ksiId)}</span>
                    <div>
                        <h3 class="impl-detail-title">${this.esc(ksi.title)}</h3>
                        <div class="impl-detail-family">${this.esc(ksi.family)} — ${this.esc(fam.name)}</div>
                    </div>
                    <div class="cmvp-module-tags">
                        ${ksi.low ? '<span class="cmvp-tag fips3">low</span>' : ''}
                        ${ksi.moderate ? '<span class="cmvp-tag fips2">moderate</span>' : ''}
                    </div>
                </div>
                <p class="impl-detail-desc">${this.esc(ksi.description)}</p>
        `;

        // === 800-53 Controls Section ===
        html += `
            <div class="impl-detail-section">
                <h4 class="impl-detail-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Related NIST 800-53 Controls (${controls053.length})
                </h4>
                <div class="impl-detail-tags">
                    ${controls053.length > 0 ? controls053.map(c => `<span class="cmvp-tag fips2">${this.esc(c)}</span>`).join('') : '<span style="color:var(--text-muted);font-size:0.8rem;">No direct 800-53 mappings found</span>'}
                </div>
            </div>
        `;

        // === 800-171 Controls with Live Assessment Status ===
        html += `
            <div class="impl-detail-section">
                <h4 class="impl-detail-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Related NIST 800-171 Controls — Live Assessment Status (${controls171.length})
                </h4>
        `;

        if (controls171.length > 0) {
            html += '<div class="impl-detail-171-grid">';
            for (const ctrlId of controls171) {
                const mapping = typeof FRAMEWORK_MAPPINGS !== 'undefined' ? FRAMEWORK_MAPPINGS[ctrlId] : null;
                const status = this.getAssessmentStatus(ctrlId);
                const desc = mapping?.description || '';
                const practice = mapping?.cmmc?.practice || '';

                let statusHtml = '<span class="impl-status-badge not-assessed">Not Assessed</span>';
                let statusClass = 'not-assessed';
                if (status) {
                    if (status.met === status.totalObj) {
                        statusHtml = `<span class="impl-status-badge met">Met (${status.met}/${status.totalObj})</span>`;
                        statusClass = 'met';
                    } else if (status.notMet > 0 && status.met === 0 && status.partial === 0) {
                        statusHtml = `<span class="impl-status-badge not-met">Not Met (${status.notMet}/${status.totalObj})</span>`;
                        statusClass = 'not-met';
                    } else if (status.notAssessed === status.totalObj) {
                        statusHtml = `<span class="impl-status-badge not-assessed">Not Assessed (${status.totalObj} obj)</span>`;
                    } else {
                        statusHtml = `<span class="impl-status-badge partial">Partial (${status.met}M/${status.partial}P/${status.notMet}NM)</span>`;
                        statusClass = 'partial';
                    }
                }

                html += `
                    <div class="impl-171-card ${statusClass}">
                        <div class="impl-171-header">
                            <span class="impl-171-id">${this.esc(ctrlId)}</span>
                            ${statusHtml}
                        </div>
                        <div class="impl-171-desc">${this.esc(desc)}</div>
                        ${practice ? `<div class="impl-171-practice">CMMC: ${this.esc(practice)}</div>` : ''}
                    </div>
                `;
            }
            html += '</div>';
        } else {
            html += '<p style="color:var(--text-muted);font-size:0.8rem;">No 800-171 controls mapped via 800-53 bridge for this KSI.</p>';
        }
        html += '</div>';

        // === Evidence Examples ===
        if (evidenceExamples.length > 0) {
            html += `
                <div class="impl-detail-section">
                    <h4 class="impl-detail-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        Evidence Collection Suggestions (${evidenceTheme})
                    </h4>
                    <ul class="impl-evidence-list">
                        ${evidenceExamples.map(e => `<li>${this.esc(e)}</li>`).join('')}
                    </ul>
                    <p class="impl-evidence-note">These are community-suggested examples from the <a href="https://github.com/ethanolivertroy/fedramp-docs-mcp" target="_blank" rel="noopener" style="color:#8ba2ff;">FedRAMP Docs MCP Server</a>. Always verify with official FedRAMP guidance.</p>
                </div>
            `;
        }

        // === MCP Server Integration ===
        html += `
            <div class="impl-detail-section impl-mcp-section">
                <h4 class="impl-detail-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                    FedRAMP Docs MCP Server — Advanced Queries
                </h4>
                <p class="impl-mcp-desc">Use these queries with the <a href="https://github.com/ethanolivertroy/fedramp-docs-mcp" target="_blank" rel="noopener" style="color:#8ba2ff;">fedramp-docs-mcp</a> server in Claude Desktop, Claude Code, or any MCP client:</p>
                <div class="impl-mcp-queries">
                    <div class="impl-mcp-query">
                        <span class="impl-mcp-label">Get KSI Details</span>
                        <code class="impl-mcp-code">get_requirement_by_id id="${ksiId}"</code>
                    </div>
                    <div class="impl-mcp-query">
                        <span class="impl-mcp-label">Theme Summary</span>
                        <code class="impl-mcp-code">get_theme_summary theme="${ksi.family}"</code>
                    </div>
                    <div class="impl-mcp-query">
                        <span class="impl-mcp-label">Evidence Checklist</span>
                        <code class="impl-mcp-code">get_evidence_examples theme="${ksi.family}"</code>
                    </div>
                    ${controls053.length > 0 ? `<div class="impl-mcp-query">
                        <span class="impl-mcp-label">Control Requirements</span>
                        <code class="impl-mcp-code">get_control_requirements control="${controls053[0]}"</code>
                    </div>` : ''}
                    <div class="impl-mcp-query">
                        <span class="impl-mcp-label">Search Docs</span>
                        <code class="impl-mcp-code">search_markdown query="${ksi.title.toLowerCase()}"</code>
                    </div>
                </div>
                <div class="impl-mcp-install">
                    <span class="impl-mcp-label">Quick Install:</span>
                    <code class="impl-mcp-code">npx fedramp-docs-mcp</code>
                </div>
            </div>
        `;

        html += '</div>';
        return html;
    },

    bindImplGuide() {
        const search = document.getElementById('impl-guide-search');
        const familyFilter = document.getElementById('impl-guide-family-filter');
        const list = document.getElementById('impl-guide-list');
        const detail = document.getElementById('impl-guide-detail');

        if (!list || !detail) return;

        const doFilter = () => {
            if (typeof FEDRAMP_20X_KSI === 'undefined') return;
            list.innerHTML = this.renderImplGuideList(
                FEDRAMP_20X_KSI.indicators,
                FEDRAMP_20X_KSI.families,
                search?.value,
                familyFilter?.value
            );
            this.bindImplGuideCards();
        };

        search?.addEventListener('input', doFilter);
        familyFilter?.addEventListener('change', doFilter);

        this.bindImplGuideCards();
    },

    bindImplGuideCards() {
        const list = document.getElementById('impl-guide-list');
        const detail = document.getElementById('impl-guide-detail');
        if (!list || !detail) return;

        list.querySelectorAll('.impl-guide-card').forEach(card => {
            card.addEventListener('click', () => {
                const ksiId = card.dataset.ksiId;
                detail.innerHTML = this.renderImplGuideDetail(ksiId);
                detail.style.display = 'block';
                list.style.display = 'none';
                const tabContent = document.getElementById('fedramp-tab-content');
                tabContent?.querySelector('.cmvp-search-bar')?.style.setProperty('display', 'none');

                // Bind back button
                document.getElementById('impl-guide-back')?.addEventListener('click', () => {
                    detail.style.display = 'none';
                    detail.innerHTML = '';
                    list.style.display = 'block';
                    tabContent?.querySelector('.cmvp-search-bar')?.style.setProperty('display', '');
                });

                // Bind copy on MCP code blocks
                detail.querySelectorAll('.impl-mcp-code').forEach(code => {
                    code.style.cursor = 'pointer';
                    code.title = 'Click to copy';
                    code.addEventListener('click', (e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(code.textContent).then(() => {
                            const orig = code.textContent;
                            code.textContent = 'Copied!';
                            setTimeout(() => code.textContent = orig, 1200);
                        });
                    });
                });
            });
        });
    },

    esc(str) {
        const el = document.createElement('span');
        el.textContent = str;
        return el.innerHTML;
    }
};
