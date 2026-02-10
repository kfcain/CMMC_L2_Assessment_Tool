// Executive Dashboard — Full-page CIO/CEO compliance reporting view
// Dynamic KPIs, SPRS gauge, family heatmap, risk matrix, trend chart,
// executive summary, POA&M snapshot, and print-friendly HTML export.
// All data updates live from assessment state — no manual refresh.

const ExecDashboard = {

    // ── Render into the view container ────────────────────────────
    render() {
        const container = document.getElementById('exec-dashboard-content');
        if (!container) return;

        const families = (typeof app !== 'undefined' && app.getActiveControlFamilies) ? app.getActiveControlFamilies() : (typeof CONTROL_FAMILIES !== 'undefined' ? CONTROL_FAMILIES : []);
        const data = (typeof app !== 'undefined' && app.assessmentData) ? app.assessmentData : {};

        if (families.length === 0) {
            container.innerHTML = '<div class="ed-empty">Assessment data not loaded. Navigate to the Assessment view first.</div>';
            return;
        }

        const a = this.analyze(families, data);
        container.innerHTML = this.buildHTML(a);
        this.bindEvents(container);
        console.log('[ExecDashboard] Rendered');
    },

    // ── Analytics engine ──────────────────────────────────────────
    analyze(families, data) {
        let total = 0, met = 0, partial = 0, notMet = 0, notAssessed = 0;
        const prefix = (typeof app !== 'undefined' && app.getStoragePrefix) ? app.getStoragePrefix() : 'nist-';
        const poamData = JSON.parse(localStorage.getItem(prefix + 'poam-data') || '{}');
        const poamCount = Object.keys(poamData).length;

        // SPRS calculation
        let sprsScore = 110;
        const familyBreakdown = [];

        families.forEach(family => {
            let fTotal = 0, fMet = 0, fPartial = 0, fNotMet = 0;
            family.controls.forEach(control => {
                const pv = control.pointValue || 1;
                const allMet = control.objectives.every(o => (data[o.id]?.status || 'not-assessed') === 'met');
                if (!allMet) sprsScore -= pv;

                control.objectives.forEach(o => {
                    total++; fTotal++;
                    const s = data[o.id]?.status || 'not-assessed';
                    if (s === 'met') { met++; fMet++; }
                    else if (s === 'partial') { partial++; fPartial++; }
                    else if (s === 'not-met') { notMet++; fNotMet++; }
                    else { notAssessed++; }
                });
            });
            const rate = fTotal > 0 ? Math.round((fMet / fTotal) * 100) : 0;
            familyBreakdown.push({ id: family.id, name: family.name, total: fTotal, met: fMet, partial: fPartial, notMet: fNotMet, rate });
        });

        familyBreakdown.sort((a, b) => a.rate - b.rate);
        const complianceRate = total > 0 ? Math.round((met / total) * 100) : 0;
        const assessedPct = total > 0 ? Math.round(((total - notAssessed) / total) * 100) : 0;

        // Risk areas
        const risks = [];
        families.forEach(family => {
            let crit = 0, high = 0, sprsImpact = 0;
            family.controls.forEach(control => {
                const neverPoam = control.poamEligibility?.selfAssessment?.canBeOnPoam === false;
                const pv = control.pointValue || 1;
                const hasGap = control.objectives.some(o => {
                    const s = data[o.id]?.status;
                    return s === 'not-met' || s === 'partial';
                });
                if (hasGap) {
                    sprsImpact += pv;
                    if (neverPoam || pv >= 5) crit++;
                    else if (pv >= 3) high++;
                }
            });
            if (crit > 0 || high > 2) {
                risks.push({ family: family.name, crit, high, sprsImpact, severity: crit > 0 ? 'critical' : 'high' });
            }
        });
        risks.sort((a, b) => b.crit - a.crit || b.sprsImpact - a.sprsImpact);

        // Recommendations
        const recs = this.buildRecommendations({ complianceRate, sprsScore, notAssessed, partial, notMet, total, poamCount });

        // Timeline
        const timeline = this.buildTimeline();

        // Org info
        const orgRaw = localStorage.getItem('nist-org-data');
        const org = orgRaw ? JSON.parse(orgRaw) : {};

        return {
            total, met, partial, notMet, notAssessed, complianceRate, assessedPct,
            sprsScore, poamCount, familyBreakdown, risks, recs, timeline, org,
            generatedAt: new Date()
        };
    },

    buildTimeline() {
        const prefix = (typeof app !== 'undefined' && app.getStoragePrefix) ? app.getStoragePrefix() : 'nist-';
        const hist = JSON.parse(localStorage.getItem(prefix + 'edit-history') || '{}');
        const days = {};
        Object.values(hist).forEach(edits => {
            (edits || []).forEach(e => {
                const d = new Date(e.timestamp).toISOString().split('T')[0];
                if (!days[d]) days[d] = { date: d, up: 0, down: 0 };
                if (e.newValue === 'met') days[d].up++;
                else if (e.newValue === 'not-met') days[d].down++;
            });
        });
        return Object.values(days).sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
    },

    buildRecommendations(s) {
        const r = [];
        if (s.complianceRate < 70) r.push({ p: 'high', t: 'Accelerate Compliance Efforts', d: `Compliance rate of ${s.complianceRate}% is below the 70% threshold. Dedicate resources to close gaps in high-impact control families.`, i: 'Critical for certification readiness' });
        if (s.sprsScore < 80) r.push({ p: 'high', t: 'Improve SPRS Score', d: `Current SPRS score of ${s.sprsScore}/110 may impact contract eligibility. Prioritize controls with the highest point values.`, i: 'Contract and business risk' });
        if (s.notAssessed > s.total * 0.3) r.push({ p: 'medium', t: 'Complete Assessment Coverage', d: `${s.notAssessed} objectives (${Math.round((s.notAssessed / s.total) * 100)}%) remain unassessed. Full visibility is required before scheduling a C3PAO assessment.`, i: 'Incomplete compliance posture visibility' });
        if (s.partial > s.total * 0.2) r.push({ p: 'medium', t: 'Close Partial Implementations', d: `${s.partial} partially implemented controls need completion. Partial implementations are audit findings.`, i: 'Potential audit findings' });
        if (s.poamCount > 0) r.push({ p: 'low', t: 'Monitor POA&M Progress', d: `${s.poamCount} active POA&M items. Ensure milestones are on track and within the 180-day remediation window.`, i: 'Conditional certification risk' });
        if (r.length === 0) r.push({ p: 'low', t: 'Maintain Compliance Posture', d: 'All major indicators are healthy. Continue monitoring and prepare evidence packages for assessment.', i: 'Ongoing compliance maintenance' });
        return r;
    },

    // ── Readiness helpers ─────────────────────────────────────────
    readinessClass(r) { return r >= 95 ? 'ready' : r >= 80 ? 'near-ready' : r >= 60 ? 'in-progress' : 'early-stage'; },
    readinessLabel(r) { return r >= 95 ? 'Ready for Assessment' : r >= 80 ? 'Near Ready' : r >= 60 ? 'In Progress' : r >= 30 ? 'Early Stage' : 'Getting Started'; },
    readinessDesc(r) {
        if (r >= 95) return 'Organization is positioned to schedule a formal CMMC Level 2 assessment with a C3PAO.';
        if (r >= 80) return 'Close remaining gaps to achieve assessment readiness. Focus on high-SPRS-value controls.';
        if (r >= 60) return 'Significant progress made. Prioritize gap analysis and resource allocation for remaining families.';
        if (r >= 30) return 'Establish dedicated compliance resources and a structured remediation timeline.';
        return 'Begin with governance framework, high-priority controls, and baseline security configurations.';
    },

    // ── Executive summary text ────────────────────────────────────
    summaryText(a) {
        const orgName = a.org.clientName || 'The organization';
        const level = a.org.assessmentLevel === '1' ? 'Level 1' : 'Level 2';
        let txt = `<strong>${this.esc(orgName)}</strong> is pursuing CMMC ${level} certification. `;
        txt += `As of ${a.generatedAt.toLocaleDateString()}, <strong>${a.complianceRate}%</strong> of ${a.total} assessment objectives are fully met, `;
        txt += `with an estimated SPRS score of <strong>${a.sprsScore}/110</strong>. `;
        if (a.notMet > 0) txt += `There are <strong>${a.notMet}</strong> objectives marked Not Met and <strong>${a.partial}</strong> partially implemented. `;
        if (a.notAssessed > 0) txt += `<strong>${a.notAssessed}</strong> objectives have not yet been assessed. `;
        if (a.poamCount > 0) txt += `The organization has <strong>${a.poamCount}</strong> active POA&M items under remediation. `;
        txt += `Overall readiness is assessed as <strong>${this.readinessLabel(a.complianceRate)}</strong>.`;
        return txt;
    },

    esc(s) { return typeof Sanitize !== 'undefined' ? Sanitize.html(s) : String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); },

    // ── SPRS Gauge SVG ────────────────────────────────────────────
    gaugeHTML(score) {
        const clamped = Math.max(-203, Math.min(110, score));
        const pct = (clamped + 203) / 313; // 0..1
        const angle = -180 + pct * 180; // -180..0 degrees
        const r = 60, cx = 80, cy = 75;
        const rad = (angle * Math.PI) / 180;
        const x = cx + r * Math.cos(rad);
        const y = cy + r * Math.sin(rad);
        const color = score >= 88 ? 'var(--status-met,#34d399)' : score >= 50 ? 'var(--status-partial,#fbbf24)' : 'var(--status-not-met,#f87171)';
        // Arc: always large-arc=0 for semicircle track, draw filled arc
        const trackD = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
        // Filled arc from left to current
        const largeArc = pct > 0.5 ? 1 : 0;
        const fillD = `M ${cx - r} ${cy} A ${r} ${r} 0 ${largeArc} 1 ${x} ${y}`;
        return `
            <svg viewBox="0 0 160 90" width="160" height="90">
                <path d="${trackD}" fill="none" stroke="var(--bg-tertiary,#1e1f2e)" stroke-width="12" stroke-linecap="round"/>
                <path d="${fillD}" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"/>
                <circle cx="${x}" cy="${y}" r="5" fill="${color}"/>
            </svg>`;
    },

    // ── Trend bars ────────────────────────────────────────────────
    trendHTML(timeline) {
        if (timeline.length === 0) return '<div class="ed-empty">No activity recorded yet.</div>';
        const maxVal = Math.max(1, ...timeline.map(t => Math.max(t.up, t.down)));
        let bars = '';
        timeline.forEach(t => {
            const net = t.up - t.down;
            if (net > 0) bars += `<div class="ed-trend-bar positive" style="height:${Math.max(4, (net / maxVal) * 100)}%" title="${t.date}: +${t.up}${t.down > 0 ? ', -' + t.down : ''}"></div>`;
            else if (net < 0) bars += `<div class="ed-trend-bar negative" style="height:${Math.max(4, (Math.abs(net) / maxVal) * 100)}%" title="${t.date}: -${t.down}${t.up > 0 ? ', +' + t.up : ''}"></div>`;
            else if (t.up > 0) bars += `<div class="ed-trend-bar neutral" style="height:4%;min-height:4px" title="${t.date}: +${t.up}, -${t.down} (net zero)"></div>`;
            else bars += `<div class="ed-trend-bar neutral"></div>`;
        });
        const totalUp = timeline.reduce((s, t) => s + t.up, 0);
        const totalDown = timeline.reduce((s, t) => s + t.down, 0);
        return `
            <div class="ed-trend-bars">${bars}</div>
            <div class="ed-trend-summary">
                <div class="ed-trend-stat"><span class="ed-trend-stat-val positive">${totalUp}</span><span class="ed-trend-stat-lbl">Improvements</span></div>
                <div class="ed-trend-stat"><span class="ed-trend-stat-val negative">${totalDown}</span><span class="ed-trend-stat-lbl">Regressions</span></div>
            </div>`;
    },

    // ── Build full HTML ───────────────────────────────────────────
    buildHTML(a) {
        const orgName = this.esc(a.org.clientName || 'Organization');
        const dateStr = a.generatedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr = a.generatedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        return `
        <!-- Header -->
        <div class="ed-header">
            <div class="ed-header-top">
                <button class="view-back-btn" data-back-view="dashboard" title="Back to Dashboard">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Back
                </button>
                <div class="ed-title-block">
                    <h2>Executive Compliance Dashboard</h2>
                    <p class="ed-subtitle">${orgName} &mdash; CMMC ${a.org.assessmentLevel === '1' ? 'Level 1' : 'Level 2'}</p>
                </div>
                <div class="ed-header-actions">
                    <button class="ed-btn" id="ed-refresh-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
                        Refresh
                    </button>
                    <button class="ed-btn ed-btn-primary" id="ed-print-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                        Print Report
                    </button>
                </div>
            </div>
            <div class="ed-timestamp">Generated ${dateStr} at ${timeStr}</div>
        </div>

        <!-- KPI Strip -->
        <div class="ed-kpi-strip">
            <div class="ed-kpi">
                <div class="ed-kpi-icon blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                <div class="ed-kpi-data"><span class="ed-kpi-val">${a.complianceRate}%</span><span class="ed-kpi-label">Compliance Rate</span><span class="ed-kpi-sub">${a.met} of ${a.total} objectives met</span></div>
            </div>
            <div class="ed-kpi">
                <div class="ed-kpi-icon purple"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg></div>
                <div class="ed-kpi-data"><span class="ed-kpi-val">${a.sprsScore}</span><span class="ed-kpi-label">SPRS Score</span><span class="ed-kpi-sub">Out of 110</span></div>
            </div>
            <div class="ed-kpi">
                <div class="ed-kpi-icon red"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                <div class="ed-kpi-data"><span class="ed-kpi-val">${a.notMet}</span><span class="ed-kpi-label">Not Met</span><span class="ed-kpi-sub">${a.partial} partial</span></div>
            </div>
            <div class="ed-kpi">
                <div class="ed-kpi-icon green"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg></div>
                <div class="ed-kpi-data"><span class="ed-kpi-val">${a.assessedPct}%</span><span class="ed-kpi-label">Assessed</span><span class="ed-kpi-sub">${a.total - a.notAssessed} of ${a.total}</span></div>
            </div>
            <div class="ed-kpi">
                <div class="ed-kpi-icon amber"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                <div class="ed-kpi-data"><span class="ed-kpi-val">${a.poamCount}</span><span class="ed-kpi-label">POA&M Items</span><span class="ed-kpi-sub">Active remediation</span></div>
            </div>
        </div>

        <!-- Main Grid -->
        <div class="ed-grid">

            <!-- Executive Summary -->
            <div class="ed-card full-width">
                <div class="ed-card-head">
                    <h3><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Executive Summary</h3>
                </div>
                <div class="ed-card-body">
                    <div class="ed-summary-text">${this.summaryText(a)}</div>
                </div>
            </div>

            <!-- SPRS Gauge + Readiness -->
            <div class="ed-card">
                <div class="ed-card-head">
                    <h3><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg> SPRS Score</h3>
                    <span class="ed-card-badge ${a.sprsScore >= 88 ? 'green' : a.sprsScore >= 50 ? 'amber' : 'red'}">${a.sprsScore}/110</span>
                </div>
                <div class="ed-card-body">
                    <div class="ed-gauge-wrap">
                        <div class="ed-gauge">
                            ${this.gaugeHTML(a.sprsScore)}
                            <div class="ed-gauge-val">${a.sprsScore}</div>
                        </div>
                        <div class="ed-gauge-label">SPRS Score</div>
                        <div class="ed-gauge-range"><span>-203</span><span>110</span></div>
                    </div>
                    <div class="ed-readiness ${this.readinessClass(a.complianceRate)}">
                        <div>
                            <div class="ed-readiness-level">${this.readinessLabel(a.complianceRate)}</div>
                            <div class="ed-readiness-desc">${this.readinessDesc(a.complianceRate)}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Compliance Trend -->
            <div class="ed-card">
                <div class="ed-card-head">
                    <h3><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Activity Trend (30 Days)</h3>
                </div>
                <div class="ed-card-body">
                    ${this.trendHTML(a.timeline)}
                </div>
            </div>

            <!-- Family Heatmap -->
            <div class="ed-card full-width">
                <div class="ed-card-head">
                    <h3><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Compliance by Control Family</h3>
                </div>
                <div class="ed-card-body">
                    <div class="ed-heatmap">
                        ${a.familyBreakdown.map(f => {
                            const metPct = f.total > 0 ? (f.met / f.total * 100) : 0;
                            const partPct = f.total > 0 ? (f.partial / f.total * 100) : 0;
                            const nmPct = f.total > 0 ? (f.notMet / f.total * 100) : 0;
                            return `<div class="ed-hm-row">
                                <div class="ed-hm-name" title="${this.esc(f.name)}">${this.esc(f.name)}</div>
                                <div class="ed-hm-bar">
                                    <div class="ed-hm-met" style="width:${metPct}%"></div>
                                    <div class="ed-hm-partial" style="width:${partPct}%"></div>
                                    <div class="ed-hm-notmet" style="width:${nmPct}%"></div>
                                </div>
                                <div class="ed-hm-pct">${f.rate}%</div>
                            </div>`;
                        }).join('')}
                    </div>
                    <div class="ed-hm-legend">
                        <div class="ed-hm-legend-item"><div class="ed-hm-legend-dot met"></div>Met</div>
                        <div class="ed-hm-legend-item"><div class="ed-hm-legend-dot partial"></div>Partial</div>
                        <div class="ed-hm-legend-item"><div class="ed-hm-legend-dot notmet"></div>Not Met</div>
                    </div>
                </div>
            </div>

            <!-- Risk Areas -->
            <div class="ed-card">
                <div class="ed-card-head">
                    <h3><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Risk Areas</h3>
                    ${a.risks.length > 0 ? `<span class="ed-card-badge red">${a.risks.length} areas</span>` : '<span class="ed-card-badge green">None</span>'}
                </div>
                <div class="ed-card-body">
                    ${a.risks.length > 0 ? `<div class="ed-risks">${a.risks.map(r => `
                        <div class="ed-risk-item ${r.severity}">
                            <div class="ed-risk-fam">${this.esc(r.family)}</div>
                            <div class="ed-risk-detail">${r.crit > 0 ? r.crit + ' critical' : ''}${r.crit > 0 && r.high > 0 ? ', ' : ''}${r.high > 0 ? r.high + ' high' : ''}</div>
                            <div class="ed-risk-pts">${r.sprsImpact} pts</div>
                            <div class="ed-risk-badge ${r.severity}">${r.severity}</div>
                        </div>`).join('')}</div>` : '<div class="ed-empty">No high-risk areas identified.</div>'}
                </div>
            </div>

            <!-- Recommendations -->
            <div class="ed-card">
                <div class="ed-card-head">
                    <h3><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> Recommendations</h3>
                </div>
                <div class="ed-card-body">
                    <div class="ed-recs">
                        ${a.recs.map(r => `
                            <div class="ed-rec ${r.p}">
                                <div class="ed-rec-head">
                                    <span class="ed-rec-priority ${r.p}">${r.p}</span>
                                    <span class="ed-rec-title">${r.t}</span>
                                </div>
                                <div class="ed-rec-desc">${r.d}</div>
                                <div class="ed-rec-impact">Impact: ${r.i}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

        </div><!-- /ed-grid -->
        `;
    },

    // ── Event binding ─────────────────────────────────────────────
    bindEvents(container) {
        container.querySelector('#ed-refresh-btn')?.addEventListener('click', () => this.render());
        container.querySelector('#ed-print-btn')?.addEventListener('click', () => window.print());
    },

    // ── Toast helper ──────────────────────────────────────────────
    toast(msg, type) {
        if (typeof app !== 'undefined' && app.showToast) app.showToast(msg, type);
        else console.log('[ExecDashboard]', type, msg);
    }
};

// Initialize & export
if (typeof document !== 'undefined') {
    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', () => console.log('[ExecDashboard] Ready'))
        : console.log('[ExecDashboard] Ready');
}
if (typeof window !== 'undefined') {
    window.ExecDashboard = ExecDashboard;
    // Backward compat
    window.ExecutiveDashboard = ExecDashboard;
}
