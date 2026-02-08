// Command Center - SOC-Style Single Pane of Glass
// Aggregates all assessment data: SSP, POA&M, assets, implementation, inheritance, diagrams
// Includes spreadsheet import for bulk implementation status upload

const CommandCenter = {
    config: {
        version: '1.0.0',
        storageKey: 'cmmc_command_center',
        refreshInterval: null
    },

    // Panel visibility state
    panelState: {},
    activePanel: null, // For drill-down
    importHistory: [],

    // =========================================================================
    // Initialization
    // =========================================================================

    init() {
        this.loadState();
        console.log('[CommandCenter] Initialized');
    },

    loadState() {
        try {
            const saved = localStorage.getItem(this.config.storageKey);
            const data = saved ? JSON.parse(saved) : {};
            this.panelState = data.panelState || {};
            this.importHistory = data.importHistory || [];
        } catch (e) {
            this.panelState = {};
            this.importHistory = [];
        }
    },

    saveState() {
        try {
            localStorage.setItem(this.config.storageKey, JSON.stringify({
                panelState: this.panelState,
                importHistory: this.importHistory
            }));
        } catch (e) { console.error('[CommandCenter] Save error:', e); }
    },

    // =========================================================================
    // Data Aggregation - Pull from ALL modules
    // =========================================================================

    gatherAllData() {
        const app = window.app;
        if (!app) return this.getEmptyData();

        const prefix = app.getStoragePrefix();
        const assessmentData = JSON.parse(localStorage.getItem(prefix + 'assessment-data') || '{}');
        const poamData = JSON.parse(localStorage.getItem(prefix + 'poam-data') || '{}');
        const implementationData = JSON.parse(localStorage.getItem(prefix + 'implementation-data') || '{}');
        const orgData = JSON.parse(localStorage.getItem('nist-org-data') || '{}');

        // OSC Inventory
        const oscData = JSON.parse(localStorage.getItem('osc-inventory') || '{}');
        const policies = oscData.policies || [];
        const procedures = oscData.procedures || [];
        const ssp = oscData.ssp || [];
        const assets = oscData.assets || [];
        const fipsCerts = oscData.fipsCerts || [];
        const dataFlowDiagrams = oscData.dataFlowDiagrams || [];
        const networkDiagrams = oscData.networkDiagrams || [];

        // Inheritance
        const inheritanceData = JSON.parse(localStorage.getItem('cmmc_inheritance_data') || '{}');
        const espProfiles = JSON.parse(localStorage.getItem('cmmc_esp_profiles') || '[]');

        // Diagram Hub
        const diagramHub = JSON.parse(localStorage.getItem('cmmc_diagram_hub') || '{}');
        const dhApps = diagramHub.applications || [];
        const dhDiagrams = diagramHub.diagrams || [];
        const dhConnections = diagramHub.connections || [];

        // Control families
        const families = app.getActiveControlFamilies();
        const isRev3 = app.assessmentRevision === 'r3';

        // Compute assessment stats
        let totalObjectives = 0, met = 0, partial = 0, notMet = 0, notAssessed = 0;
        let totalControls = 0;
        const familyStats = [];
        const controlDetails = [];
        const objectiveDetails = [];

        families.forEach(family => {
            let fMet = 0, fPartial = 0, fNotMet = 0, fNA = 0, fTotal = 0;
            family.controls.forEach(control => {
                totalControls++;
                let cMet = 0, cTotal = 0;
                control.objectives.forEach(obj => {
                    totalObjectives++;
                    fTotal++;
                    cTotal++;
                    const status = assessmentData[obj.id]?.status || 'not-assessed';
                    const impl = implementationData[obj.id] || null;
                    const poam = poamData[obj.id] || null;

                    if (status === 'met') { met++; fMet++; cMet++; }
                    else if (status === 'partial') { partial++; fPartial++; }
                    else if (status === 'not-met') { notMet++; fNotMet++; }
                    else { notAssessed++; fNA++; }

                    objectiveDetails.push({
                        id: obj.id,
                        text: obj.text,
                        controlId: control.id,
                        controlName: control.name,
                        familyId: family.id,
                        familyName: family.name,
                        status: status,
                        implementation: impl,
                        poam: poam,
                        hasPoam: !!poam,
                        hasImpl: !!impl
                    });
                });
                controlDetails.push({
                    id: control.id,
                    name: control.name,
                    familyId: family.id,
                    totalObjectives: cTotal,
                    metObjectives: cMet,
                    allMet: cMet === cTotal,
                    pointValue: control.pointValue || 1
                });
            });
            familyStats.push({
                id: family.id,
                name: family.name,
                total: fTotal,
                met: fMet,
                partial: fPartial,
                notMet: fNotMet,
                notAssessed: fNA,
                pct: fTotal > 0 ? Math.round((fMet / fTotal) * 100) : 0
            });
        });

        // SPRS
        let sprsScore = 110;
        if (typeof SPRS_SCORING !== 'undefined' && !isRev3) {
            try { sprsScore = app.calculateTotalSPRS(); } catch (e) { sprsScore = 110; }
        }

        // POA&M stats
        const poamEntries = Object.entries(poamData).filter(([k, v]) => v && v.status);
        const poamOpen = poamEntries.filter(([k, v]) => v.status === 'open' || v.status === 'in-progress');
        const poamClosed = poamEntries.filter(([k, v]) => v.status === 'closed' || v.status === 'completed');
        const poamOverdue = poamEntries.filter(([k, v]) => {
            if (!v.dueDate) return false;
            return new Date(v.dueDate) < new Date() && v.status !== 'closed' && v.status !== 'completed';
        });

        // Asset breakdown
        const assetsByCategory = { cui: 0, spa: 0, crma: 0, specialized: 0, oos: 0 };
        assets.forEach(a => {
            const cat = a.category || 'cui';
            if (assetsByCategory[cat] !== undefined) assetsByCategory[cat]++;
        });

        // Inheritance stats
        const inhEntries = Object.entries(inheritanceData);
        const inhFull = inhEntries.filter(([k, v]) => v.type === 'fully-inherited');
        const inhShared = inhEntries.filter(([k, v]) => v.type === 'shared');
        const inhCustomer = inhEntries.filter(([k, v]) => v.type === 'customer');
        const inhHybrid = inhEntries.filter(([k, v]) => v.type === 'hybrid');

        // Controls met count
        const controlsMet = controlDetails.filter(c => c.allMet).length;

        // Implementation coverage
        const implEntries = Object.entries(implementationData).filter(([k, v]) => v && (v.description || v.notes || v.evidence));
        const implCoverage = totalObjectives > 0 ? Math.round((implEntries.length / totalObjectives) * 100) : 0;

        return {
            org: orgData,
            isRev3,
            assessment: {
                totalObjectives, met, partial, notMet, notAssessed,
                totalControls, controlsMet,
                pctMet: totalObjectives > 0 ? Math.round((met / totalObjectives) * 100) : 0,
                pctAddressed: totalObjectives > 0 ? Math.round(((met + partial) / totalObjectives) * 100) : 0,
                sprsScore,
                familyStats,
                controlDetails,
                objectiveDetails
            },
            poam: {
                total: poamEntries.length,
                open: poamOpen.length,
                closed: poamClosed.length,
                overdue: poamOverdue.length,
                entries: poamEntries.map(([k, v]) => ({ objectiveId: k, ...v }))
            },
            implementation: {
                total: implEntries.length,
                coverage: implCoverage,
                entries: implEntries.map(([k, v]) => ({ objectiveId: k, ...v }))
            },
            documents: {
                policies: policies.length,
                procedures: procedures.length,
                ssp: ssp.length,
                policyList: policies,
                procedureList: procedures,
                sspList: ssp
            },
            assets: {
                total: assets.length,
                byCategory: assetsByCategory,
                fipsCerts: fipsCerts.length,
                fipsList: fipsCerts,
                assetList: assets
            },
            diagrams: {
                oscDataFlow: dataFlowDiagrams.length,
                oscNetwork: networkDiagrams.length,
                hubApps: dhApps.length,
                hubDiagrams: dhDiagrams.length,
                hubConnections: dhConnections.length
            },
            inheritance: {
                total: inhEntries.length,
                fullyInherited: inhFull.length,
                shared: inhShared.length,
                customer: inhCustomer.length,
                hybrid: inhHybrid.length,
                espProfiles: espProfiles.length
            }
        };
    },

    getEmptyData() {
        return {
            org: {},
            isRev3: false,
            assessment: { totalObjectives: 0, met: 0, partial: 0, notMet: 0, notAssessed: 0, totalControls: 0, controlsMet: 0, pctMet: 0, pctAddressed: 0, sprsScore: 110, familyStats: [], controlDetails: [], objectiveDetails: [] },
            poam: { total: 0, open: 0, closed: 0, overdue: 0, entries: [] },
            implementation: { total: 0, coverage: 0, entries: [] },
            documents: { policies: 0, procedures: 0, ssp: 0, policyList: [], procedureList: [], sspList: [] },
            assets: { total: 0, byCategory: { cui: 0, spa: 0, crma: 0, specialized: 0, oos: 0 }, fipsCerts: 0, fipsList: [], assetList: [] },
            diagrams: { oscDataFlow: 0, oscNetwork: 0, hubApps: 0, hubDiagrams: 0, hubConnections: 0 },
            inheritance: { total: 0, fullyInherited: 0, shared: 0, customer: 0, hybrid: 0, espProfiles: 0 }
        };
    },

    // =========================================================================
    // Spreadsheet Import Parser
    // =========================================================================

    showImportModal() {
        const html = `
        <div class="cc-modal-overlay" id="cc-modal">
            <div class="cc-modal cc-modal-wide">
                <div class="cc-modal-header">
                    <h3>Import Implementation Status</h3>
                    <button class="cc-modal-close" id="cc-modal-close">&times;</button>
                </div>
                <div class="cc-modal-body">
                    <div class="cc-import-intro">
                        <p>Upload a spreadsheet (Excel or CSV) containing your organization's implementation status for each assessment objective. The parser will match rows to objectives and update the assessment.</p>
                    </div>

                    <div class="cc-import-format">
                        <h4>Expected Spreadsheet Format</h4>
                        <div class="cc-format-table-wrap">
                            <table class="cc-format-table">
                                <thead>
                                    <tr>
                                        <th>Column</th>
                                        <th>Required</th>
                                        <th>Description</th>
                                        <th>Example</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td><code>Objective ID</code></td><td>Yes</td><td>NIST 800-171 objective identifier</td><td><code>3.1.1[a]</code> or <code>03.01.01[a]</code></td></tr>
                                    <tr><td><code>Status</code></td><td>Yes</td><td>Assessment status</td><td><code>Met</code>, <code>Not Met</code>, <code>Partial</code>, <code>N/A</code></td></tr>
                                    <tr><td><code>Implementation</code></td><td>No</td><td>How the objective is implemented</td><td>Free text description</td></tr>
                                    <tr><td><code>Evidence</code></td><td>No</td><td>Evidence references</td><td>Policy doc, screenshot, config</td></tr>
                                    <tr><td><code>POA&amp;M</code></td><td>No</td><td>POA&amp;M status if not met</td><td><code>Open</code>, <code>In Progress</code>, <code>Closed</code></td></tr>
                                    <tr><td><code>POA&amp;M Due Date</code></td><td>No</td><td>Remediation target date</td><td><code>2025-06-30</code></td></tr>
                                    <tr><td><code>POA&amp;M Milestone</code></td><td>No</td><td>Remediation milestone</td><td>Free text</td></tr>
                                    <tr><td><code>Notes</code></td><td>No</td><td>Additional assessor notes</td><td>Free text</td></tr>
                                    <tr><td><code>Asset Category</code></td><td>No</td><td>Asset scoping category</td><td><code>CUI</code>, <code>SPA</code>, <code>CRMA</code></td></tr>
                                    <tr><td><code>Responsible Party</code></td><td>No</td><td>Who is responsible</td><td><code>IT Security</code>, <code>ESP</code></td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="cc-format-notes">
                            <p><strong>Column matching is flexible:</strong> The parser looks for keywords in column headers (e.g., "objective", "id", "status", "implementation", "evidence", "poam", "notes"). Exact column names are not required.</p>
                            <p><strong>Status values:</strong> <code>Met</code>, <code>Satisfied</code>, <code>Yes</code>, <code>Implemented</code> → Met | <code>Partial</code>, <code>In Progress</code> → Partial | <code>Not Met</code>, <code>No</code>, <code>Failed</code> → Not Met</p>
                        </div>
                    </div>

                    <div class="cc-import-actions">
                        <div class="cc-upload-area" id="cc-upload-area">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            <p>Drop Excel (.xlsx, .xls) or CSV file here, or click to browse</p>
                            <input type="file" id="cc-import-file" accept=".xlsx,.xls,.csv" style="display:none">
                        </div>
                        <button class="cc-btn cc-btn-ghost" id="cc-download-template">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Download Template CSV
                        </button>
                    </div>

                    <div id="cc-import-preview" style="display:none"></div>
                    <div id="cc-import-status" style="display:none"></div>
                </div>
                <div class="cc-modal-footer">
                    <button class="cc-btn cc-btn-ghost" id="cc-modal-cancel">Cancel</button>
                    <button class="cc-btn cc-btn-primary" id="cc-modal-apply" style="display:none">Apply Import</button>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', html);
        this.bindImportModalEvents();
    },

    bindImportModalEvents() {
        const close = () => document.getElementById('cc-modal')?.remove();
        document.getElementById('cc-modal-close')?.addEventListener('click', close);
        document.getElementById('cc-modal-cancel')?.addEventListener('click', close);
        document.getElementById('cc-modal')?.addEventListener('click', (e) => { if (e.target.id === 'cc-modal') close(); });

        // Upload area
        const uploadArea = document.getElementById('cc-upload-area');
        const fileInput = document.getElementById('cc-import-file');
        uploadArea?.addEventListener('click', () => fileInput?.click());
        uploadArea?.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
        uploadArea?.addEventListener('dragleave', () => uploadArea?.classList.remove('drag-over'));
        uploadArea?.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea?.classList.remove('drag-over');
            if (e.dataTransfer.files[0]) this.processImportFile(e.dataTransfer.files[0]);
        });
        fileInput?.addEventListener('change', () => {
            if (fileInput.files[0]) this.processImportFile(fileInput.files[0]);
        });

        // Download template
        document.getElementById('cc-download-template')?.addEventListener('click', () => this.downloadTemplate());
    },

    downloadTemplate() {
        const app = window.app;
        if (!app) return;
        const families = app.getActiveControlFamilies();
        let csv = 'Objective ID,Control ID,Control Name,Status,Implementation,Evidence,POA&M Status,POA&M Due Date,POA&M Milestone,Notes,Asset Category,Responsible Party\n';
        families.forEach(family => {
            family.controls.forEach(control => {
                control.objectives.forEach(obj => {
                    csv += `"${obj.id}","${control.id}","${control.name}","","","","","","","","",""\n`;
                });
            });
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cmmc-implementation-template-${app.assessmentRevision}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    },

    async processImportFile(file) {
        const statusEl = document.getElementById('cc-import-status');
        const previewEl = document.getElementById('cc-import-preview');
        statusEl.style.display = '';
        statusEl.innerHTML = '<div class="cc-import-loading">Parsing file...</div>';

        try {
            let rows;
            if (file.name.endsWith('.csv')) {
                const text = await file.text();
                rows = this.parseCSV(text);
            } else {
                // Excel - use SheetJS
                if (typeof XLSX === 'undefined') {
                    statusEl.innerHTML = '<div class="cc-import-error">SheetJS library not loaded. Please use CSV format or reload the page.</div>';
                    return;
                }
                const data = await file.arrayBuffer();
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            }

            if (!rows || rows.length < 2) {
                statusEl.innerHTML = '<div class="cc-import-error">File must have a header row and at least one data row.</div>';
                return;
            }

            const parsed = this.parseImportRows(rows);
            this.showImportPreview(parsed, previewEl, statusEl);
        } catch (e) {
            console.error('[CommandCenter] Import error:', e);
            statusEl.innerHTML = `<div class="cc-import-error">Error parsing file: ${e.message}</div>`;
        }
    },

    parseCSV(text) {
        const rows = [];
        let current = [];
        let inQuotes = false;
        let field = '';
        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (inQuotes) {
                if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
                else if (ch === '"') { inQuotes = false; }
                else { field += ch; }
            } else {
                if (ch === '"') { inQuotes = true; }
                else if (ch === ',') { current.push(field); field = ''; }
                else if (ch === '\n' || (ch === '\r' && text[i + 1] === '\n')) {
                    current.push(field); field = '';
                    if (current.some(c => c.trim())) rows.push(current);
                    current = [];
                    if (ch === '\r') i++;
                } else { field += ch; }
            }
        }
        if (field || current.length) { current.push(field); if (current.some(c => c.trim())) rows.push(current); }
        return rows;
    },

    parseImportRows(rows) {
        const headers = rows[0].map(h => (h || '').toString().toLowerCase().trim());

        // Flexible column matching
        const findCol = (...keywords) => {
            return headers.findIndex(h => keywords.some(kw => h.includes(kw)));
        };

        const colMap = {
            objectiveId: findCol('objective', 'obj id', 'obj_id', 'assessment objective'),
            controlId: findCol('control id', 'control_id', 'ctrl'),
            status: findCol('status', 'result', 'finding', 'determination'),
            implementation: findCol('implementation', 'impl', 'how implemented', 'description'),
            evidence: findCol('evidence', 'artifact', 'proof'),
            poamStatus: findCol('poa&m', 'poam', 'plan of action'),
            poamDueDate: findCol('due date', 'due_date', 'target date', 'milestone date'),
            poamMilestone: findCol('milestone', 'remediation'),
            notes: findCol('note', 'comment', 'remark', 'assessor'),
            assetCategory: findCol('asset cat', 'asset_cat', 'category', 'scope'),
            responsible: findCol('responsible', 'owner', 'party', 'assigned')
        };

        // If no objective ID column found, try first column
        if (colMap.objectiveId === -1) colMap.objectiveId = 0;
        if (colMap.status === -1) {
            // Try to find status in any column after objective
            for (let i = 1; i < headers.length; i++) {
                if (headers[i] && !Object.values(colMap).includes(i)) {
                    colMap.status = i;
                    break;
                }
            }
        }

        const results = { matched: [], unmatched: [], errors: [], colMap };
        const app = window.app;
        if (!app) return results;

        // Build lookup of valid objective IDs
        const validIds = new Set();
        const families = app.getActiveControlFamilies();
        families.forEach(f => f.controls.forEach(c => c.objectives.forEach(o => validIds.add(o.id))));

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0 || (row.length === 1 && !row[0])) continue;

            const rawId = (row[colMap.objectiveId] || '').toString().trim();
            if (!rawId) continue;

            // Normalize objective ID
            const objId = this.normalizeObjectiveId(rawId);
            const statusRaw = colMap.status >= 0 ? (row[colMap.status] || '').toString().trim() : '';
            const status = this.normalizeStatus(statusRaw);

            const entry = {
                row: i + 1,
                rawId,
                objectiveId: objId,
                status,
                statusRaw,
                implementation: colMap.implementation >= 0 ? (row[colMap.implementation] || '').toString().trim() : '',
                evidence: colMap.evidence >= 0 ? (row[colMap.evidence] || '').toString().trim() : '',
                poamStatus: colMap.poamStatus >= 0 ? (row[colMap.poamStatus] || '').toString().trim() : '',
                poamDueDate: colMap.poamDueDate >= 0 ? (row[colMap.poamDueDate] || '').toString().trim() : '',
                poamMilestone: colMap.poamMilestone >= 0 ? (row[colMap.poamMilestone] || '').toString().trim() : '',
                notes: colMap.notes >= 0 ? (row[colMap.notes] || '').toString().trim() : '',
                assetCategory: colMap.assetCategory >= 0 ? (row[colMap.assetCategory] || '').toString().trim() : '',
                responsible: colMap.responsible >= 0 ? (row[colMap.responsible] || '').toString().trim() : ''
            };

            if (validIds.has(objId)) {
                results.matched.push(entry);
            } else {
                results.unmatched.push(entry);
            }
        }

        return results;
    },

    normalizeObjectiveId(raw) {
        // Handle various formats: "3.1.1[a]", "03.01.01[a]", "3.1.1(a)", "3.1.1.a", "AC-3.1.1[a]"
        let id = raw.replace(/^[A-Z]{2}-/i, ''); // Strip family prefix
        // Convert Rev3 format to Rev2 if needed
        const r3Match = id.match(/^0?(\d+)\.0?(\d+)\.0?(\d+)(.*)/);
        if (r3Match) {
            const app = window.app;
            if (app && app.assessmentRevision === 'r3') {
                // Keep Rev3 format: pad to 2 digits
                id = `${r3Match[1].padStart(2, '0')}.${r3Match[2].padStart(2, '0')}.${r3Match[3].padStart(2, '0')}${r3Match[4]}`;
            } else {
                id = `${parseInt(r3Match[1])}.${parseInt(r3Match[2])}.${parseInt(r3Match[3])}${r3Match[4]}`;
            }
        }
        // Normalize bracket format: (a) -> [a]
        id = id.replace(/\(([a-z])\)/g, '[$1]');
        // Handle dot format: .a -> [a]
        id = id.replace(/\.([a-z])$/g, '[$1]');
        return id;
    },

    normalizeStatus(raw) {
        const s = raw.toLowerCase().trim();
        if (['met', 'satisfied', 'yes', 'implemented', 'compliant', 'pass', 'complete'].some(k => s.includes(k))) return 'met';
        if (['partial', 'in progress', 'in-progress', 'partially'].some(k => s.includes(k))) return 'partial';
        if (['not met', 'not-met', 'no', 'failed', 'non-compliant', 'not implemented', 'deficient'].some(k => s.includes(k))) return 'not-met';
        if (['n/a', 'not applicable', 'na'].some(k => s === k)) return 'not-assessed';
        return '';
    },

    showImportPreview(parsed, previewEl, statusEl) {
        const total = parsed.matched.length + parsed.unmatched.length;
        const statusCounts = { met: 0, partial: 0, 'not-met': 0, 'not-assessed': 0, unknown: 0 };
        parsed.matched.forEach(e => {
            if (statusCounts[e.status] !== undefined) statusCounts[e.status]++;
            else statusCounts.unknown++;
        });

        statusEl.innerHTML = `
            <div class="cc-import-summary">
                <div class="cc-import-stat cc-import-good"><strong>${parsed.matched.length}</strong> matched objectives</div>
                ${parsed.unmatched.length > 0 ? `<div class="cc-import-stat cc-import-warn"><strong>${parsed.unmatched.length}</strong> unmatched rows</div>` : ''}
                <div class="cc-import-stat"><strong>${statusCounts.met}</strong> Met</div>
                <div class="cc-import-stat"><strong>${statusCounts.partial}</strong> Partial</div>
                <div class="cc-import-stat"><strong>${statusCounts['not-met']}</strong> Not Met</div>
                ${statusCounts.unknown > 0 ? `<div class="cc-import-stat cc-import-warn"><strong>${statusCounts.unknown}</strong> Unknown status</div>` : ''}
            </div>
        `;

        // Preview table
        const previewRows = parsed.matched.slice(0, 20);
        previewEl.style.display = '';
        previewEl.innerHTML = `
            <h4>Preview (first ${Math.min(20, parsed.matched.length)} of ${parsed.matched.length} rows)</h4>
            <div class="cc-preview-table-wrap">
                <table class="cc-preview-table">
                    <thead><tr><th>Objective</th><th>Status</th><th>Implementation</th><th>POA&M</th><th>Notes</th></tr></thead>
                    <tbody>
                        ${previewRows.map(e => `
                            <tr>
                                <td><code>${e.objectiveId}</code></td>
                                <td><span class="cc-status-dot cc-status-${e.status}">${e.status || '?'}</span></td>
                                <td class="cc-preview-text">${(e.implementation || '').substring(0, 80)}${e.implementation?.length > 80 ? '...' : ''}</td>
                                <td>${e.poamStatus || '-'}</td>
                                <td class="cc-preview-text">${(e.notes || '').substring(0, 60)}${e.notes?.length > 60 ? '...' : ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${parsed.unmatched.length > 0 ? `
                <details class="cc-unmatched-details">
                    <summary>${parsed.unmatched.length} unmatched rows (click to expand)</summary>
                    <div class="cc-unmatched-list">
                        ${parsed.unmatched.map(e => `<div class="cc-unmatched-row">Row ${e.row}: <code>${e.rawId}</code> → <code>${e.objectiveId}</code></div>`).join('')}
                    </div>
                </details>
            ` : ''}
        `;

        // Show apply button
        const applyBtn = document.getElementById('cc-modal-apply');
        if (applyBtn && parsed.matched.length > 0) {
            applyBtn.style.display = '';
            applyBtn.onclick = () => this.applyImport(parsed);
        }
    },

    applyImport(parsed) {
        const app = window.app;
        if (!app) return;

        const prefix = app.getStoragePrefix();
        const assessmentData = JSON.parse(localStorage.getItem(prefix + 'assessment-data') || '{}');
        const implementationData = JSON.parse(localStorage.getItem(prefix + 'implementation-data') || '{}');
        const poamData = JSON.parse(localStorage.getItem(prefix + 'poam-data') || '{}');

        let updated = 0;
        parsed.matched.forEach(entry => {
            if (entry.status) {
                assessmentData[entry.objectiveId] = assessmentData[entry.objectiveId] || {};
                assessmentData[entry.objectiveId].status = entry.status;
                updated++;
            }

            if (entry.implementation || entry.evidence || entry.notes || entry.responsible) {
                implementationData[entry.objectiveId] = implementationData[entry.objectiveId] || {};
                if (entry.implementation) implementationData[entry.objectiveId].description = entry.implementation;
                if (entry.evidence) implementationData[entry.objectiveId].evidence = entry.evidence;
                if (entry.notes) implementationData[entry.objectiveId].notes = entry.notes;
                if (entry.responsible) implementationData[entry.objectiveId].responsible = entry.responsible;
            }

            if (entry.poamStatus) {
                const pStatus = entry.poamStatus.toLowerCase();
                let normalizedPoamStatus = 'open';
                if (pStatus.includes('progress') || pStatus.includes('in-progress')) normalizedPoamStatus = 'in-progress';
                else if (pStatus.includes('close') || pStatus.includes('complete')) normalizedPoamStatus = 'completed';

                poamData[entry.objectiveId] = poamData[entry.objectiveId] || {};
                poamData[entry.objectiveId].status = normalizedPoamStatus;
                if (entry.poamDueDate) poamData[entry.objectiveId].dueDate = entry.poamDueDate;
                if (entry.poamMilestone) poamData[entry.objectiveId].milestone = entry.poamMilestone;
            }
        });

        localStorage.setItem(prefix + 'assessment-data', JSON.stringify(assessmentData));
        localStorage.setItem(prefix + 'implementation-data', JSON.stringify(implementationData));
        localStorage.setItem(prefix + 'poam-data', JSON.stringify(poamData));

        // Reload app data
        app.assessmentData = assessmentData;
        app.implementationData = implementationData;
        app.poamData = poamData;
        app.updateProgress();

        // Record import
        this.importHistory.push({
            date: new Date().toISOString(),
            matched: parsed.matched.length,
            unmatched: parsed.unmatched.length,
            updated: updated
        });
        this.saveState();

        // Close modal and re-render
        document.getElementById('cc-modal')?.remove();
        this.render();

        // Show success toast
        this.showToast(`Imported ${updated} objective statuses successfully.`);
    },

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'cc-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('visible'), 10);
        setTimeout(() => { toast.classList.remove('visible'); setTimeout(() => toast.remove(), 300); }, 3000);
    },

    // =========================================================================
    // Main Render - SOC Dashboard
    // =========================================================================

    render() {
        const container = document.getElementById('command-center-content');
        if (!container) return;

        const data = this.gatherAllData();
        const ts = new Date().toLocaleString();

        container.innerHTML = `
            <div class="cc-header">
                <div class="cc-header-left">
                    <h1>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue, #6c8aff)" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M6 8h.01M10 8h.01"/></svg>
                        Command Center
                    </h1>
                    <p class="cc-subtitle">${data.org.oscName ? data.org.oscName + ' — ' : ''}CMMC ${data.isRev3 ? '3.0 (Rev 3)' : '2.0 (Rev 2)'} Assessment Overview</p>
                    <span class="cc-timestamp">Last refreshed: ${ts}</span>
                </div>
                <div class="cc-header-actions">
                    <button class="cc-btn cc-btn-primary" id="cc-import-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Import Spreadsheet
                    </button>
                    <button class="cc-btn cc-btn-ghost" id="cc-refresh-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                        Refresh
                    </button>
                </div>
            </div>

            <!-- Top-Level KPI Strip -->
            ${this.renderKPIStrip(data)}

            <!-- SOC Grid -->
            <div class="cc-grid">
                <!-- Row 1: Assessment Posture + SPRS + Compliance Readiness -->
                <div class="cc-panel cc-panel-2x" id="cc-panel-posture">
                    <div class="cc-panel-header">
                        <h3><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Assessment Posture</h3>
                    </div>
                    <div class="cc-panel-body">
                        ${this.renderPosturePanel(data)}
                    </div>
                </div>

                <div class="cc-panel" id="cc-panel-sprs">
                    <div class="cc-panel-header">
                        <h3><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> ${data.isRev3 ? 'Compliance Score' : 'SPRS Score'}</h3>
                    </div>
                    <div class="cc-panel-body">
                        ${this.renderSPRSPanel(data)}
                    </div>
                </div>

                <!-- Row 2: Family Heatmap -->
                <div class="cc-panel cc-panel-full" id="cc-panel-heatmap">
                    <div class="cc-panel-header">
                        <h3><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Family Compliance Heatmap</h3>
                    </div>
                    <div class="cc-panel-body">
                        ${this.renderHeatmapPanel(data)}
                    </div>
                </div>

                <!-- Row 3: POA&M + Documents + Assets -->
                <div class="cc-panel" id="cc-panel-poam">
                    <div class="cc-panel-header">
                        <h3><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> POA&amp;M Tracker</h3>
                    </div>
                    <div class="cc-panel-body">
                        ${this.renderPOAMPanel(data)}
                    </div>
                </div>

                <div class="cc-panel" id="cc-panel-docs">
                    <div class="cc-panel-header">
                        <h3><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> SSP &amp; Documentation</h3>
                    </div>
                    <div class="cc-panel-body">
                        ${this.renderDocsPanel(data)}
                    </div>
                </div>

                <div class="cc-panel" id="cc-panel-assets">
                    <div class="cc-panel-header">
                        <h3><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg> Asset Inventory</h3>
                    </div>
                    <div class="cc-panel-body">
                        ${this.renderAssetsPanel(data)}
                    </div>
                </div>

                <!-- Row 4: Implementation Coverage + Inheritance + Diagrams -->
                <div class="cc-panel" id="cc-panel-impl">
                    <div class="cc-panel-header">
                        <h3><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> Implementation Coverage</h3>
                    </div>
                    <div class="cc-panel-body">
                        ${this.renderImplPanel(data)}
                    </div>
                </div>

                <div class="cc-panel" id="cc-panel-inheritance">
                    <div class="cc-panel-header">
                        <h3><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M6 9v12"/></svg> ESP/CSP Inheritance</h3>
                    </div>
                    <div class="cc-panel-body">
                        ${this.renderInheritancePanel(data)}
                    </div>
                </div>

                <div class="cc-panel" id="cc-panel-diagrams">
                    <div class="cc-panel-header">
                        <h3><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> Diagram Coverage</h3>
                    </div>
                    <div class="cc-panel-body">
                        ${this.renderDiagramsPanel(data)}
                    </div>
                </div>

                <!-- Row 5: Risk Summary + Import History -->
                <div class="cc-panel cc-panel-2x" id="cc-panel-risk">
                    <div class="cc-panel-header">
                        <h3><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Risk &amp; Gap Summary</h3>
                    </div>
                    <div class="cc-panel-body">
                        ${this.renderRiskPanel(data)}
                    </div>
                </div>

                <div class="cc-panel" id="cc-panel-history">
                    <div class="cc-panel-header">
                        <h3><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Import History</h3>
                    </div>
                    <div class="cc-panel-body">
                        ${this.renderHistoryPanel()}
                    </div>
                </div>
            </div>
        `;

        this.bindEvents(container);
    },

    // =========================================================================
    // Panel Renderers
    // =========================================================================

    renderKPIStrip(data) {
        const a = data.assessment;
        const sprsClass = a.sprsScore >= 0 ? 'cc-kpi-green' : a.sprsScore >= -50 ? 'cc-kpi-amber' : 'cc-kpi-red';
        const poamClass = data.poam.overdue > 0 ? 'cc-kpi-red' : data.poam.open > 0 ? 'cc-kpi-amber' : 'cc-kpi-green';
        const implClass = data.implementation.coverage >= 80 ? 'cc-kpi-green' : data.implementation.coverage >= 40 ? 'cc-kpi-amber' : 'cc-kpi-red';
        const assetClass = data.assets.total > 0 ? 'cc-kpi-green' : 'cc-kpi-red';
        const docClass = (data.documents.policies > 0 && data.documents.ssp > 0) ? 'cc-kpi-green' : (data.documents.policies > 0 || data.documents.ssp > 0) ? 'cc-kpi-amber' : 'cc-kpi-red';

        return `
            <div class="cc-kpi-strip">
                <div class="cc-kpi ${sprsClass}">
                    <div class="cc-kpi-value">${data.isRev3 ? a.pctMet + '%' : a.sprsScore}</div>
                    <div class="cc-kpi-label">${data.isRev3 ? 'Compliance' : 'SPRS Score'}</div>
                </div>
                <div class="cc-kpi">
                    <div class="cc-kpi-value">${a.controlsMet}<span class="cc-kpi-denom">/${a.totalControls}</span></div>
                    <div class="cc-kpi-label">Controls Met</div>
                </div>
                <div class="cc-kpi">
                    <div class="cc-kpi-value">${a.pctMet}%</div>
                    <div class="cc-kpi-label">Objectives Met</div>
                </div>
                <div class="cc-kpi">
                    <div class="cc-kpi-value">${a.pctAddressed}%</div>
                    <div class="cc-kpi-label">Addressed</div>
                </div>
                <div class="cc-kpi ${poamClass}">
                    <div class="cc-kpi-value">${data.poam.open}</div>
                    <div class="cc-kpi-label">Open POA&Ms</div>
                </div>
                <div class="cc-kpi ${poamClass}">
                    <div class="cc-kpi-value">${data.poam.overdue}</div>
                    <div class="cc-kpi-label">Overdue</div>
                </div>
                <div class="cc-kpi ${implClass}">
                    <div class="cc-kpi-value">${data.implementation.coverage}%</div>
                    <div class="cc-kpi-label">Impl. Documented</div>
                </div>
                <div class="cc-kpi ${assetClass}">
                    <div class="cc-kpi-value">${data.assets.total}</div>
                    <div class="cc-kpi-label">Assets</div>
                </div>
                <div class="cc-kpi ${docClass}">
                    <div class="cc-kpi-value">${data.documents.policies + data.documents.procedures + data.documents.ssp}</div>
                    <div class="cc-kpi-label">Documents</div>
                </div>
            </div>
        `;
    },

    renderPosturePanel(data) {
        const a = data.assessment;
        const ringR = 50, ringC = 2 * Math.PI * ringR, ringOff = ringC - (a.pctMet / 100) * ringC;
        const addrOff = ringC - (a.pctAddressed / 100) * ringC;

        return `
            <div class="cc-posture-layout">
                <div class="cc-posture-rings">
                    <div class="cc-ring-container">
                        <svg viewBox="0 0 120 120" width="110" height="110">
                            <circle cx="60" cy="60" r="${ringR}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="8"/>
                            <circle cx="60" cy="60" r="${ringR}" fill="none" stroke="var(--status-met, #34d399)" stroke-width="8" stroke-linecap="round"
                                stroke-dasharray="${ringC}" stroke-dashoffset="${ringOff}" transform="rotate(-90 60 60)"/>
                        </svg>
                        <div class="cc-ring-label"><span class="cc-ring-pct">${a.pctMet}%</span><span class="cc-ring-sub">Met</span></div>
                    </div>
                    <div class="cc-ring-container">
                        <svg viewBox="0 0 120 120" width="110" height="110">
                            <circle cx="60" cy="60" r="${ringR}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="8"/>
                            <circle cx="60" cy="60" r="${ringR}" fill="none" stroke="var(--accent-blue, #6c8aff)" stroke-width="8" stroke-linecap="round"
                                stroke-dasharray="${ringC}" stroke-dashoffset="${addrOff}" transform="rotate(-90 60 60)"/>
                        </svg>
                        <div class="cc-ring-label"><span class="cc-ring-pct">${a.pctAddressed}%</span><span class="cc-ring-sub">Addressed</span></div>
                    </div>
                </div>
                <div class="cc-posture-bars">
                    <div class="cc-posture-bar-row">
                        <span class="cc-bar-label cc-status-met">Met</span>
                        <div class="cc-bar-track"><div class="cc-bar-fill cc-bar-met" style="width:${a.totalObjectives ? (a.met/a.totalObjectives)*100 : 0}%"></div></div>
                        <span class="cc-bar-count">${a.met}</span>
                    </div>
                    <div class="cc-posture-bar-row">
                        <span class="cc-bar-label cc-status-partial">Partial</span>
                        <div class="cc-bar-track"><div class="cc-bar-fill cc-bar-partial" style="width:${a.totalObjectives ? (a.partial/a.totalObjectives)*100 : 0}%"></div></div>
                        <span class="cc-bar-count">${a.partial}</span>
                    </div>
                    <div class="cc-posture-bar-row">
                        <span class="cc-bar-label cc-status-not-met">Not Met</span>
                        <div class="cc-bar-track"><div class="cc-bar-fill cc-bar-not-met" style="width:${a.totalObjectives ? (a.notMet/a.totalObjectives)*100 : 0}%"></div></div>
                        <span class="cc-bar-count">${a.notMet}</span>
                    </div>
                    <div class="cc-posture-bar-row">
                        <span class="cc-bar-label" style="color:var(--text-muted)">Pending</span>
                        <div class="cc-bar-track"><div class="cc-bar-fill cc-bar-pending" style="width:${a.totalObjectives ? (a.notAssessed/a.totalObjectives)*100 : 0}%"></div></div>
                        <span class="cc-bar-count">${a.notAssessed}</span>
                    </div>
                </div>
            </div>
        `;
    },

    renderSPRSPanel(data) {
        const a = data.assessment;
        if (data.isRev3) {
            return `
                <div class="cc-sprs-center">
                    <div class="cc-sprs-big">${a.pctMet}%</div>
                    <div class="cc-sprs-sub">Compliance Rate</div>
                    <div class="cc-sprs-detail">${a.controlsMet} of ${a.totalControls} controls fully met</div>
                    <div class="cc-sprs-detail">${a.met} of ${a.totalObjectives} objectives met</div>
                </div>
            `;
        }
        const sprsClass = a.sprsScore >= 0 ? 'cc-sprs-green' : a.sprsScore >= -50 ? 'cc-sprs-amber' : 'cc-sprs-red';
        const conditionalEligible = a.controlsMet >= 88;
        return `
            <div class="cc-sprs-center">
                <div class="cc-sprs-big ${sprsClass}">${a.sprsScore}</div>
                <div class="cc-sprs-sub">SPRS Score (of 110)</div>
                <div class="cc-sprs-gauge">
                    <div class="cc-gauge-track">
                        <div class="cc-gauge-fill ${sprsClass}" style="width:${Math.max(0, ((a.sprsScore + 203) / 313) * 100)}%"></div>
                        <div class="cc-gauge-marker" style="left:${((110 + 203) / 313) * 100}%" title="Max: 110"></div>
                        <div class="cc-gauge-marker cc-gauge-zero" style="left:${(203 / 313) * 100}%" title="Zero"></div>
                    </div>
                    <div class="cc-gauge-labels"><span>-203</span><span>0</span><span>110</span></div>
                </div>
                <div class="cc-conditional-badge ${conditionalEligible ? 'cc-cond-yes' : 'cc-cond-no'}">
                    ${conditionalEligible ? '✓ Conditional L2 Eligible' : '⚠ Not Yet Eligible'} (${a.controlsMet}/88 required)
                </div>
            </div>
        `;
    },

    renderHeatmapPanel(data) {
        const families = data.assessment.familyStats;
        return `
            <div class="cc-heatmap">
                ${families.map(f => {
                    const color = f.pct === 100 ? 'var(--status-met, #34d399)' :
                                  f.pct >= 75 ? '#6c8aff' :
                                  f.pct >= 50 ? 'var(--status-partial, #fbbf24)' :
                                  f.pct > 0 ? '#e06c75' : 'rgba(255,255,255,0.06)';
                    return `
                    <div class="cc-heatmap-cell" title="${f.id}: ${f.name} — ${f.pct}% met (${f.met}/${f.total})">
                        <div class="cc-heatmap-bar" style="height:${Math.max(4, f.pct)}%;background:${color}"></div>
                        <div class="cc-heatmap-id">${f.id}</div>
                        <div class="cc-heatmap-pct">${f.pct}%</div>
                        <div class="cc-heatmap-detail">${f.met}/${f.total}</div>
                    </div>`;
                }).join('')}
            </div>
        `;
    },

    renderPOAMPanel(data) {
        const p = data.poam;
        if (p.total === 0) {
            return `<div class="cc-panel-empty">No POA&M items recorded.</div>`;
        }
        return `
            <div class="cc-poam-stats">
                <div class="cc-mini-stat"><span class="cc-mini-val cc-val-amber">${p.open}</span><span class="cc-mini-label">Open</span></div>
                <div class="cc-mini-stat"><span class="cc-mini-val cc-val-green">${p.closed}</span><span class="cc-mini-label">Closed</span></div>
                <div class="cc-mini-stat"><span class="cc-mini-val cc-val-red">${p.overdue}</span><span class="cc-mini-label">Overdue</span></div>
                <div class="cc-mini-stat"><span class="cc-mini-val">${p.total}</span><span class="cc-mini-label">Total</span></div>
            </div>
            <div class="cc-poam-bar">
                <div class="cc-poam-bar-closed" style="width:${p.total ? (p.closed/p.total)*100 : 0}%" title="Closed"></div>
                <div class="cc-poam-bar-open" style="width:${p.total ? (p.open/p.total)*100 : 0}%" title="Open"></div>
            </div>
            ${p.overdue > 0 ? `<div class="cc-poam-alert">⚠ ${p.overdue} overdue POA&M item${p.overdue > 1 ? 's' : ''} require immediate attention</div>` : ''}
        `;
    },

    renderDocsPanel(data) {
        const d = data.documents;
        const total = d.policies + d.procedures + d.ssp;
        return `
            <div class="cc-docs-grid">
                <div class="cc-doc-item">
                    <div class="cc-doc-icon cc-doc-ssp">SSP</div>
                    <div class="cc-doc-count">${d.ssp}</div>
                    <div class="cc-doc-label">System Security Plan${d.ssp !== 1 ? 's' : ''}</div>
                </div>
                <div class="cc-doc-item">
                    <div class="cc-doc-icon cc-doc-policy">POL</div>
                    <div class="cc-doc-count">${d.policies}</div>
                    <div class="cc-doc-label">Policies</div>
                </div>
                <div class="cc-doc-item">
                    <div class="cc-doc-icon cc-doc-proc">PROC</div>
                    <div class="cc-doc-count">${d.procedures}</div>
                    <div class="cc-doc-label">Procedures</div>
                </div>
            </div>
            ${d.ssp === 0 ? '<div class="cc-panel-warn">⚠ No SSP document uploaded</div>' : ''}
            ${d.policies === 0 ? '<div class="cc-panel-warn">⚠ No policies documented</div>' : ''}
            ${total > 0 ? `<div class="cc-doc-list">${[...d.sspList.map(s => `<div class="cc-doc-row"><span class="cc-doc-tag cc-doc-ssp">SSP</span> ${s.name}${s.version ? ` v${s.version}` : ''}</div>`), ...d.policyList.slice(0, 5).map(p => `<div class="cc-doc-row"><span class="cc-doc-tag cc-doc-policy">POL</span> ${p.name}</div>`), ...d.procedureList.slice(0, 5).map(p => `<div class="cc-doc-row"><span class="cc-doc-tag cc-doc-proc">PROC</span> ${p.name}</div>`)].join('')}${total > 10 ? `<div class="cc-doc-more">+${total - 10} more</div>` : ''}</div>` : ''}
        `;
    },

    renderAssetsPanel(data) {
        const a = data.assets;
        const cats = [
            { key: 'cui', name: 'CUI', color: '#c678dd' },
            { key: 'spa', name: 'SPA', color: '#e5c07b' },
            { key: 'crma', name: 'CRMA', color: '#e06c75' },
            { key: 'specialized', name: 'Specialized', color: '#61afef' },
            { key: 'oos', name: 'OOS', color: '#5c6370' }
        ];
        if (a.total === 0) {
            return `<div class="cc-panel-empty">No assets in inventory. Add assets in Asset Inventory.</div>`;
        }
        return `
            <div class="cc-asset-donut">
                ${cats.map(c => {
                    const count = a.byCategory[c.key] || 0;
                    const pct = a.total > 0 ? Math.round((count / a.total) * 100) : 0;
                    return `
                    <div class="cc-asset-cat-row">
                        <span class="cc-asset-dot" style="background:${c.color}"></span>
                        <span class="cc-asset-cat-name">${c.name}</span>
                        <div class="cc-asset-bar-track"><div class="cc-asset-bar-fill" style="width:${pct}%;background:${c.color}"></div></div>
                        <span class="cc-asset-cat-count">${count}</span>
                    </div>`;
                }).join('')}
            </div>
            <div class="cc-asset-footer">
                <span>${a.total} total assets</span>
                <span>${a.fipsCerts} FIPS cert${a.fipsCerts !== 1 ? 's' : ''}</span>
            </div>
        `;
    },

    renderImplPanel(data) {
        const impl = data.implementation;
        const ringR = 36, ringC = 2 * Math.PI * ringR, ringOff = ringC - (impl.coverage / 100) * ringC;
        const color = impl.coverage >= 80 ? 'var(--status-met, #34d399)' : impl.coverage >= 40 ? 'var(--status-partial, #fbbf24)' : 'var(--status-not-met, #e06c75)';
        return `
            <div class="cc-impl-layout">
                <div class="cc-impl-ring">
                    <svg viewBox="0 0 80 80" width="80" height="80">
                        <circle cx="40" cy="40" r="${ringR}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="6"/>
                        <circle cx="40" cy="40" r="${ringR}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"
                            stroke-dasharray="${ringC}" stroke-dashoffset="${ringOff}" transform="rotate(-90 40 40)"/>
                    </svg>
                    <div class="cc-impl-ring-label">${impl.coverage}%</div>
                </div>
                <div class="cc-impl-details">
                    <div class="cc-impl-stat"><strong>${impl.total}</strong> objectives have implementation details</div>
                    <div class="cc-impl-stat"><strong>${data.assessment.totalObjectives - impl.total}</strong> objectives need documentation</div>
                </div>
            </div>
            ${impl.coverage < 50 ? '<div class="cc-panel-warn">⚠ Less than 50% of objectives have implementation details documented</div>' : ''}
        `;
    },

    renderInheritancePanel(data) {
        const inh = data.inheritance;
        if (inh.total === 0) {
            return `<div class="cc-panel-empty">No ESP/CSP inheritance configured. Upload an SRM in the Assessment view.</div>`;
        }
        return `
            <div class="cc-inh-stats">
                <div class="cc-inh-row"><span class="cc-inh-dot" style="background:#34d399"></span><span>Fully Inherited</span><strong>${inh.fullyInherited}</strong></div>
                <div class="cc-inh-row"><span class="cc-inh-dot" style="background:#6c8aff"></span><span>Shared</span><strong>${inh.shared}</strong></div>
                <div class="cc-inh-row"><span class="cc-inh-dot" style="background:#fbbf24"></span><span>Customer</span><strong>${inh.customer}</strong></div>
                <div class="cc-inh-row"><span class="cc-inh-dot" style="background:#c678dd"></span><span>Hybrid</span><strong>${inh.hybrid}</strong></div>
            </div>
            <div class="cc-inh-footer">${inh.espProfiles} ESP/CSP profile${inh.espProfiles !== 1 ? 's' : ''} loaded</div>
        `;
    },

    renderDiagramsPanel(data) {
        const d = data.diagrams;
        const total = d.oscDataFlow + d.oscNetwork + d.hubDiagrams;
        if (total === 0 && d.hubApps === 0) {
            return `<div class="cc-panel-empty">No diagrams uploaded. Use Diagram Hub or Asset Inventory.</div>`;
        }
        return `
            <div class="cc-diag-stats">
                <div class="cc-mini-stat"><span class="cc-mini-val">${d.hubApps}</span><span class="cc-mini-label">Applications</span></div>
                <div class="cc-mini-stat"><span class="cc-mini-val">${d.hubDiagrams + d.oscDataFlow + d.oscNetwork}</span><span class="cc-mini-label">Diagrams</span></div>
                <div class="cc-mini-stat"><span class="cc-mini-val">${d.hubConnections}</span><span class="cc-mini-label">Data Flows</span></div>
            </div>
            <div class="cc-diag-breakdown">
                <div class="cc-diag-row"><span>Data Flow Diagrams</span><strong>${d.oscDataFlow + d.hubDiagrams}</strong></div>
                <div class="cc-diag-row"><span>Network Diagrams</span><strong>${d.oscNetwork}</strong></div>
            </div>
        `;
    },

    renderRiskPanel(data) {
        const a = data.assessment;
        // Find families with worst compliance
        const worstFamilies = [...a.familyStats].sort((a, b) => a.pct - b.pct).slice(0, 5);
        // Find controls with most not-met objectives
        const gapControls = a.controlDetails.filter(c => !c.allMet).sort((a, b) => (a.metObjectives / a.totalObjectives) - (b.metObjectives / b.totalObjectives)).slice(0, 8);

        const riskLevel = a.pctMet >= 80 ? 'LOW' : a.pctMet >= 50 ? 'MEDIUM' : a.pctMet > 0 ? 'HIGH' : 'CRITICAL';
        const riskClass = riskLevel === 'LOW' ? 'cc-risk-low' : riskLevel === 'MEDIUM' ? 'cc-risk-med' : riskLevel === 'HIGH' ? 'cc-risk-high' : 'cc-risk-crit';

        return `
            <div class="cc-risk-layout">
                <div class="cc-risk-indicator">
                    <div class="cc-risk-badge ${riskClass}">${riskLevel}</div>
                    <div class="cc-risk-sub">Overall Risk Level</div>
                </div>
                <div class="cc-risk-details">
                    <div class="cc-risk-section">
                        <h4>Lowest Compliance Families</h4>
                        <div class="cc-risk-list">
                            ${worstFamilies.map(f => `
                                <div class="cc-risk-item">
                                    <span class="cc-risk-fam">${f.id}</span>
                                    <div class="cc-risk-bar-track"><div class="cc-risk-bar-fill" style="width:${f.pct}%;background:${f.pct >= 75 ? '#34d399' : f.pct >= 50 ? '#fbbf24' : '#e06c75'}"></div></div>
                                    <span class="cc-risk-pct">${f.pct}%</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="cc-risk-section">
                        <h4>Top Gap Controls</h4>
                        <div class="cc-risk-list">
                            ${gapControls.map(c => `
                                <div class="cc-risk-item">
                                    <span class="cc-risk-ctrl">${c.id}</span>
                                    <span class="cc-risk-ctrl-name">${c.name.substring(0, 35)}${c.name.length > 35 ? '...' : ''}</span>
                                    <span class="cc-risk-gap">${c.metObjectives}/${c.totalObjectives}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderHistoryPanel() {
        if (this.importHistory.length === 0) {
            return `<div class="cc-panel-empty">No imports yet. Use "Import Spreadsheet" to upload implementation data.</div>`;
        }
        return `
            <div class="cc-history-list">
                ${this.importHistory.slice(-10).reverse().map(h => `
                    <div class="cc-history-row">
                        <span class="cc-history-date">${new Date(h.date).toLocaleDateString()} ${new Date(h.date).toLocaleTimeString()}</span>
                        <span class="cc-history-stat">${h.updated} updated, ${h.matched} matched${h.unmatched > 0 ? `, ${h.unmatched} unmatched` : ''}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // =========================================================================
    // Event Binding
    // =========================================================================

    bindEvents(container) {
        container.querySelector('#cc-import-btn')?.addEventListener('click', () => this.showImportModal());
        container.querySelector('#cc-refresh-btn')?.addEventListener('click', () => this.render());
    }
};

// Initialize
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => CommandCenter.init());
    } else {
        CommandCenter.init();
    }
}
if (typeof window !== 'undefined') {
    window.CommandCenter = CommandCenter;
}
