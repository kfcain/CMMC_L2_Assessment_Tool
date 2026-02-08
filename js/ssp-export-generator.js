// SSP Export Generator
// Generates a structured System Security Plan document based on the SSP Template format
// Pulls data from: assessment data, org info, OSC inventory, implementation data, FIPS certs
// Exports as HTML (print-ready) with option to copy or download

const SSPExportGenerator = {
    version: '1.0.0',

    // Gather all data needed for SSP generation
    gatherData() {
        const prefix = (typeof app !== 'undefined' && app.getStoragePrefix) ? app.getStoragePrefix() : 'nist-';
        const assessmentData = JSON.parse(localStorage.getItem(prefix + 'assessment-data') || '{}');
        const poamData = JSON.parse(localStorage.getItem(prefix + 'poam-data') || '{}');
        const implementationData = JSON.parse(localStorage.getItem(prefix + 'implementation-data') || '{}');
        const orgData = JSON.parse(localStorage.getItem('nist-org-data') || '{}');
        const oscData = JSON.parse(localStorage.getItem('osc-inventory') || '{}');
        const families = typeof CONTROL_FAMILIES !== 'undefined' ? CONTROL_FAMILIES : [];

        return { assessmentData, poamData, implementationData, orgData, oscData, families };
    },

    // Calculate SPRS score
    calculateSPRS(assessmentData, families) {
        const sprs = typeof SPRS_SCORING !== 'undefined' ? SPRS_SCORING : null;
        if (!sprs) return 110;
        let score = 110;
        for (const fam of families) {
            for (const ctrl of fam.controls) {
                const allMet = ctrl.objectives.every(o => assessmentData[o.id]?.status === 'met');
                if (!allMet && sprs[ctrl.id]) {
                    score += sprs[ctrl.id]; // sprs values are negative
                }
            }
        }
        return Math.max(-203, score);
    },

    // Get status label
    statusLabel(status) {
        switch (status) {
            case 'met': return 'Met';
            case 'not-met': return 'Not Met';
            case 'partial': return 'Partial';
            case 'na': return 'N/A';
            default: return 'Not Assessed';
        }
    },

    statusClass(status) {
        switch (status) {
            case 'met': return 'ssp-status-met';
            case 'not-met': return 'ssp-status-not-met';
            case 'partial': return 'ssp-status-partial';
            case 'na': return 'ssp-status-na';
            default: return 'ssp-status-na';
        }
    },

    // Escape HTML
    esc(str) {
        if (!str) return '';
        const el = document.createElement('span');
        el.textContent = String(str);
        return el.innerHTML;
    },

    // Generate the full SSP HTML document
    generate() {
        const d = this.gatherData();
        const org = d.orgData;
        const osc = d.oscData;
        const orgName = org.assessorOrg || org.oscOrg || '[Organization Name]';
        const oscName = org.oscOrg || orgName;
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const sprs = this.calculateSPRS(d.assessmentData, d.families);
        const fipsCerts = osc.fipsCerts || [];
        const policies = osc.policies || [];
        const assets = osc.assets || [];

        // Count objectives
        let totalObj = 0, metCount = 0, notMetCount = 0, partialCount = 0, naCount = 0;
        for (const fam of d.families) {
            for (const ctrl of fam.controls) {
                for (const obj of ctrl.objectives) {
                    totalObj++;
                    const s = d.assessmentData[obj.id]?.status;
                    if (s === 'met') metCount++;
                    else if (s === 'not-met') notMetCount++;
                    else if (s === 'partial') partialCount++;
                    else if (s === 'na') naCount++;
                }
            }
        }

        let html = this.renderStyles();
        html += `<div class="ssp-document">`;

        // Cover Page
        html += `
            <div class="ssp-cover">
                <div class="ssp-cover-badge">SYSTEM SECURITY PLAN</div>
                <h1 class="ssp-cover-title">${this.esc(oscName)}</h1>
                <h2 class="ssp-cover-subtitle">Enterprise Controlled Unclassified Information (CUI) Operating Environment</h2>
                <div class="ssp-cover-meta">
                    <div class="ssp-cover-meta-row"><span>Document Version:</span> <strong>1.0</strong></div>
                    <div class="ssp-cover-meta-row"><span>Date:</span> <strong>${today}</strong></div>
                    <div class="ssp-cover-meta-row"><span>Classification:</span> <strong>CUI // SP-SSP</strong></div>
                    <div class="ssp-cover-meta-row"><span>SPRS Score:</span> <strong>${sprs}</strong></div>
                </div>
            </div>
            <div class="ssp-page-break"></div>
        `;

        // Table of Contents
        html += `
            <div class="ssp-section">
                <h2 class="ssp-section-title">Table of Contents</h2>
                <div class="ssp-toc">
                    <div class="ssp-toc-item"><span>1.</span> Purpose</div>
                    <div class="ssp-toc-item"><span>2.</span> Scope</div>
                    <div class="ssp-toc-item"><span>3.</span> References</div>
                    <div class="ssp-toc-item"><span>4.</span> Roles & Responsibilities</div>
                    <div class="ssp-toc-item"><span>5.</span> System Information</div>
                    <div class="ssp-toc-item"><span>6.</span> System Environment & CUI Scoping</div>
                    <div class="ssp-toc-item"><span>7.</span> FIPS Validated Cryptographic Modules</div>
                    <div class="ssp-toc-item"><span>8.</span> Assessment Summary</div>
                    ${d.families.map((f, i) => `<div class="ssp-toc-item ssp-toc-sub"><span>${9 + i}.</span> ${this.esc(f.name)} [${this.esc(f.id)}] Family</div>`).join('')}
                    <div class="ssp-toc-item"><span>${9 + d.families.length}.</span> Acronyms</div>
                    <div class="ssp-toc-item"><span>${10 + d.families.length}.</span> Revision History</div>
                </div>
            </div>
            <div class="ssp-page-break"></div>
        `;

        // 1. Purpose
        html += `
            <div class="ssp-section">
                <h2 class="ssp-section-title">1. Purpose</h2>
                <p>This System Security Plan (SSP) describes the security controls in place and planned for ${this.esc(oscName)}'s information system that processes, stores, or transmits Controlled Unclassified Information (CUI). This plan is developed in accordance with NIST SP 800-171 Revision 2 requirements and supports Cybersecurity Maturity Model Certification (CMMC) Level 2 assessment readiness.</p>
                <p>This document serves as the primary artifact for demonstrating compliance with the 110 security requirements across 14 control families defined in NIST SP 800-171r2, as required by DFARS 252.204-7012 and 32 CFR Part 170.</p>
            </div>
        `;

        // 2. Scope
        html += `
            <div class="ssp-section">
                <h2 class="ssp-section-title">2. Scope</h2>
                <p>Except as specified in the plan for out-of-scope portions, the scope includes the processes that collect, store, and transfer CUI, with all underlying support technologies, services, human resources, hardware, and software systems that support, maintain, and operate all corporate business applications within ${this.esc(oscName)}'s enterprise IT environment.</p>
                <p>The system boundary encompasses all CUI Assets, Security Protection Assets (SPAs), and Contractor Risk Managed Assets (CRMAs) as identified in the System Environment section of this document.</p>
            </div>
        `;

        // 3. References
        html += `
            <div class="ssp-section">
                <h2 class="ssp-section-title">3. References</h2>
                <ul class="ssp-ref-list">
                    <li>Federal Information Security Modernization Act (FISMA) of 2014</li>
                    <li>32 Code of Federal Regulations (CFR) Part 117 – National Industrial Security Program Operating Manual (NISPOM)</li>
                    <li>32 CFR Part 2002 – Controlled Unclassified Information (CUI)</li>
                    <li>48 CFR §52.204-21 – Basic Safeguarding of Covered Contractor Information Systems</li>
                    <li>Defense Federal Acquisition Regulation Supplement (DFARS) 252.204-7012</li>
                    <li>NIST SP 800-53 Revision 5, Security and Privacy Controls for Information Systems and Organizations</li>
                    <li>NIST SP 800-171 Revision 2, Protecting Controlled Unclassified Information in Nonfederal Systems and Organizations</li>
                    <li>NIST SP 800-171A, Assessing Security Requirements for CUI</li>
                    <li>Cybersecurity Maturity Model Certification (CMMC) Model and related documentation</li>
                </ul>
            </div>
        `;

        // 4. Roles & Responsibilities
        html += `
            <div class="ssp-section">
                <h2 class="ssp-section-title">4. Roles & Responsibilities</h2>
                <table class="ssp-table">
                    <thead><tr><th>Role</th><th>Responsibilities</th></tr></thead>
                    <tbody>
                        <tr><td><strong>Chief Executive Officer (CEO)</strong></td><td>Ensure the requirements and resources required in the plan are provided; ensure execution of organizational security goals and objectives</td></tr>
                        <tr><td><strong>Chief Information Officer (CIO)</strong></td><td>Oversee implementation of this Plan; update this plan as needed; review this plan no less than every year for updates</td></tr>
                        <tr><td><strong>Chief Information Security Officer (CISO)</strong></td><td>Manage day-to-day security operations; oversee incident response; conduct security assessments; manage POA&M items</td></tr>
                        <tr><td><strong>System Administrator</strong></td><td>Implement technical controls; manage system configurations; maintain audit logs; apply security patches</td></tr>
                        <tr><td><strong>All Personnel</strong></td><td>Comply with security policies and procedures; complete required security awareness training; report security incidents</td></tr>
                    </tbody>
                </table>
            </div>
        `;

        // 5. System Information
        html += `
            <div class="ssp-section">
                <h2 class="ssp-section-title">5. System Information</h2>
                <table class="ssp-table ssp-info-table">
                    <tbody>
                        <tr><td><strong>System Name/Title</strong></td><td>${this.esc(oscName)} Enterprise Controlled Unclassified Information (CUI) Operating Environment</td></tr>
                        <tr><td><strong>System Categorization</strong></td><td>High Impact for Confidentiality</td></tr>
                        <tr><td><strong>System Unique Identifier</strong></td><td>${this.esc(oscName)}</td></tr>
                        <tr><td><strong>Organization Name</strong></td><td>${this.esc(orgName)}</td></tr>
                        ${org.oscOrg ? `<tr><td><strong>OSC Organization</strong></td><td>${this.esc(org.oscOrg)}</td></tr>` : ''}
                    </tbody>
                </table>
            </div>
        `;

        // 6. System Environment & CUI Scoping
        html += this.renderScopingSection(osc, assets);

        // 7. FIPS Certificates
        html += this.renderFIPSSection(fipsCerts);

        // 8. Assessment Summary
        html += `
            <div class="ssp-section">
                <h2 class="ssp-section-title">8. Assessment Summary</h2>
                <div class="ssp-summary-grid">
                    <div class="ssp-summary-card">
                        <div class="ssp-summary-value">${sprs}</div>
                        <div class="ssp-summary-label">SPRS Score</div>
                    </div>
                    <div class="ssp-summary-card ssp-met">
                        <div class="ssp-summary-value">${metCount}</div>
                        <div class="ssp-summary-label">Objectives Met</div>
                    </div>
                    <div class="ssp-summary-card ssp-partial">
                        <div class="ssp-summary-value">${partialCount}</div>
                        <div class="ssp-summary-label">Partial</div>
                    </div>
                    <div class="ssp-summary-card ssp-not-met">
                        <div class="ssp-summary-value">${notMetCount}</div>
                        <div class="ssp-summary-label">Not Met</div>
                    </div>
                    <div class="ssp-summary-card">
                        <div class="ssp-summary-value">${totalObj}</div>
                        <div class="ssp-summary-label">Total Objectives</div>
                    </div>
                </div>
                <table class="ssp-table" style="margin-top:16px;">
                    <thead><tr><th>Family</th><th>Controls</th><th>Met</th><th>Partial</th><th>Not Met</th><th>N/A</th></tr></thead>
                    <tbody>
                        ${d.families.map(fam => {
                            let fm = 0, fp = 0, fnm = 0, fna = 0, fc = fam.controls.length;
                            fam.controls.forEach(c => c.objectives.forEach(o => {
                                const s = d.assessmentData[o.id]?.status;
                                if (s === 'met') fm++; else if (s === 'partial') fp++; else if (s === 'not-met') fnm++; else if (s === 'na') fna++;
                            }));
                            return `<tr><td><strong>${this.esc(fam.name)}</strong></td><td>${fc}</td><td class="ssp-status-met">${fm}</td><td class="ssp-status-partial">${fp}</td><td class="ssp-status-not-met">${fnm}</td><td>${fna}</td></tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            <div class="ssp-page-break"></div>
        `;

        // Per-family control sections
        d.families.forEach((fam, fi) => {
            html += this.renderFamilySection(fam, fi + 9, d);
        });

        // Acronyms
        html += this.renderAcronyms(d.families.length + 9);

        // Revision History
        html += `
            <div class="ssp-section">
                <h2 class="ssp-section-title">${d.families.length + 10}. Revision History</h2>
                <table class="ssp-table">
                    <thead><tr><th>Date</th><th>Version</th><th>Description</th><th>Author</th></tr></thead>
                    <tbody>
                        <tr><td>${today}</td><td>1.0</td><td>Initial SSP generation from CMMC Assessment Tool</td><td>${this.esc(orgName)}</td></tr>
                    </tbody>
                </table>
            </div>
        `;

        html += `</div>`; // close ssp-document
        return html;
    },

    renderScopingSection(osc, assets) {
        const cuiAssets = assets.filter(a => a.category === 'cui' || a.assetCategory === 'cui');
        const spaAssets = assets.filter(a => a.category === 'spa' || a.assetCategory === 'spa');
        const crmaAssets = assets.filter(a => a.category === 'crma' || a.assetCategory === 'crma');
        const oosAssets = assets.filter(a => a.category === 'oos' || a.assetCategory === 'oos');

        const renderAssetList = (list, label) => {
            if (list.length === 0) return `<p class="ssp-placeholder">[No ${label} assets documented in OSC Inventory. Add assets to populate this section.]</p>`;
            return `<ul>${list.map(a => `<li>${this.esc(a.name || a.hostname || 'Unnamed')}${a.description ? ' — ' + this.esc(a.description) : ''}</li>`).join('')}</ul>`;
        };

        return `
            <div class="ssp-section">
                <h2 class="ssp-section-title">6. System Environment & CUI Scoping</h2>
                <h3>CUI Assets</h3>
                <p>Assets that process, store, or transmit CUI. Full CMMC control set applies. Must use FedRAMP Moderate/High authorized tools where applicable.</p>
                ${renderAssetList(cuiAssets, 'CUI')}

                <h3>Security Protection Assets (SPA)</h3>
                <p>Assets that provide security functions for CUI assets but do not process/store/transmit CUI themselves.</p>
                ${renderAssetList(spaAssets, 'SPA')}

                <h3>Contractor Risk Managed Assets (CRMA)</h3>
                <p>Assets not in scope but can access CUI assets; contractor manages risk.</p>
                ${renderAssetList(crmaAssets, 'CRMA')}

                <h3>Out-of-Scope Assets</h3>
                <p>Assets with no connection to CUI processing, storage, or transmission.</p>
                ${renderAssetList(oosAssets, 'Out-of-Scope')}
            </div>
        `;
    },

    renderFIPSSection(fipsCerts) {
        if (fipsCerts.length === 0) {
            return `
                <div class="ssp-section">
                    <h2 class="ssp-section-title">7. FIPS Validated Cryptographic Modules</h2>
                    <p class="ssp-placeholder">[No FIPS certificates documented. Use the CMVP Explorer to search and save FIPS certificates to your OSC Inventory.]</p>
                </div>
            `;
        }
        return `
            <div class="ssp-section">
                <h2 class="ssp-section-title">7. FIPS Validated Cryptographic Modules</h2>
                <p>The following FIPS 140-2/140-3 validated cryptographic modules are employed within the system boundary:</p>
                <table class="ssp-table">
                    <thead><tr><th>Cert #</th><th>Module Name</th><th>Vendor</th><th>Standard</th><th>Level</th><th>Status</th><th>Linked Controls</th></tr></thead>
                    <tbody>
                        ${fipsCerts.map(c => `
                            <tr>
                                <td>${this.esc(c.certNumber)}</td>
                                <td>${this.esc(c.moduleName)}</td>
                                <td>${this.esc(c.vendor)}</td>
                                <td>${this.esc(c.standard || 'FIPS 140-2')}</td>
                                <td>Level ${this.esc(c.level || '1')}</td>
                                <td>${this.esc(c.status || 'Active')}</td>
                                <td>${(c.linkedControls || []).join(', ') || '—'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderFamilySection(fam, sectionNum, d) {
        let html = `
            <div class="ssp-section ssp-family-section">
                <h2 class="ssp-section-title">${sectionNum}. ${this.esc(fam.name)} [${this.esc(fam.id)}] Family</h2>
        `;

        for (const ctrl of fam.controls) {
            // Determine overall control status
            let ctrlMet = 0, ctrlTotal = ctrl.objectives.length;
            ctrl.objectives.forEach(o => {
                if (d.assessmentData[o.id]?.status === 'met') ctrlMet++;
            });
            const allMet = ctrlMet === ctrlTotal;
            const noneMet = ctrlMet === 0;
            const overallStatus = allMet ? 'Met' : (noneMet ? 'Not Met' : 'Partial');
            const overallClass = allMet ? 'ssp-status-met' : (noneMet ? 'ssp-status-not-met' : 'ssp-status-partial');

            // Get implementation notes
            const implData = d.implementationData[ctrl.id] || {};
            const implNotes = implData.notes || implData.implementation || '';
            const evidence = implData.evidence || '';

            // Get CMMC practice ID
            const mapping = typeof FRAMEWORK_MAPPINGS !== 'undefined' ? FRAMEWORK_MAPPINGS[ctrl.id] : null;
            const practice = mapping?.cmmc?.practice || '';
            const level = mapping?.cmmc?.level || 2;

            html += `
                <div class="ssp-control-block">
                    <div class="ssp-control-header">
                        <div class="ssp-control-header-left">
                            <span class="ssp-control-id">${this.esc(ctrl.id)}</span>
                            <span class="ssp-control-name">${this.esc(ctrl.name)}</span>
                        </div>
                        <div class="ssp-control-header-right">
                            <span class="${overallClass}">${overallStatus}</span>
                            ${practice ? `<span class="ssp-practice-id">CMMC L${level}: ${this.esc(practice)}</span>` : ''}
                        </div>
                    </div>
                    <div class="ssp-control-desc">${this.esc(ctrl.description || '')}</div>

                    <table class="ssp-table ssp-obj-table">
                        <thead><tr><th>Assessment Objective</th><th>Status</th></tr></thead>
                        <tbody>
                            ${ctrl.objectives.map(obj => {
                                const s = d.assessmentData[obj.id]?.status || 'not-assessed';
                                return `<tr>
                                    <td><strong>${this.esc(obj.id)}</strong> ${this.esc(obj.text)}</td>
                                    <td class="${this.statusClass(s)}">${this.statusLabel(s)}</td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>

                    <div class="ssp-conformity-section">
                        <h4>Assessment Objective Conformity Statement</h4>
                        ${implNotes
                            ? `<p>${this.esc(implNotes)}</p>`
                            : `<p class="ssp-placeholder">[Implementation details not yet documented for this control. Use the Implementation Guide or AI Assessor to generate conformity statements.]</p>`
                        }
                        ${evidence ? `<div class="ssp-evidence"><strong>Evidence:</strong> ${this.esc(evidence)}</div>` : ''}
                    </div>
                </div>
            `;
        }

        html += `</div><div class="ssp-page-break"></div>`;
        return html;
    },

    renderAcronyms(sectionNum) {
        const acronyms = [
            ['ACL', 'Access Control List'], ['AD', 'Active Directory'], ['API', 'Application Programming Interface'],
            ['AWS', 'Amazon Web Services'], ['CA', 'Conditional Access'], ['CCB', 'Change Control Board'],
            ['CIO', 'Chief Information Officer'], ['CISO', 'Chief Information Security Officer'],
            ['CMMC', 'Cybersecurity Maturity Model Certification'], ['CRMA', 'Contractor Risk Managed Asset'],
            ['CSP', 'Cloud Service Provider'], ['CUI', 'Controlled Unclassified Information'],
            ['DFARS', 'Defense Federal Acquisition Regulation Supplement'], ['DLP', 'Data Loss Prevention'],
            ['DMZ', 'Demilitarized Zone'], ['EDR', 'Endpoint Detection and Response'],
            ['ESP', 'External Service Provider'], ['FIPS', 'Federal Information Processing Standards'],
            ['FISMA', 'Federal Information Security Modernization Act'], ['GPO', 'Group Policy Object'],
            ['IAM', 'Identity and Access Management'], ['IDS', 'Intrusion Detection System'],
            ['IPS', 'Intrusion Prevention System'], ['ITAR', 'International Traffic in Arms Regulations'],
            ['MFA', 'Multi-Factor Authentication'], ['MDM', 'Mobile Device Management'],
            ['MSSP', 'Managed Security Service Provider'], ['NIST', 'National Institute of Standards and Technology'],
            ['NISPOM', 'National Industrial Security Program Operating Manual'],
            ['PAM', 'Privileged Access Management'], ['POA&M', 'Plan of Action and Milestones'],
            ['RBAC', 'Role-Based Access Control'], ['SIEM', 'Security Information and Event Management'],
            ['SPA', 'Security Protection Asset'], ['SPRS', 'Supplier Performance Risk System'],
            ['SSO', 'Single Sign-On'], ['SSP', 'System Security Plan'],
            ['VDI', 'Virtual Desktop Infrastructure'], ['VLAN', 'Virtual Local Area Network'],
            ['VPN', 'Virtual Private Network']
        ];

        return `
            <div class="ssp-section">
                <h2 class="ssp-section-title">${sectionNum}. Acronyms</h2>
                <table class="ssp-table">
                    <thead><tr><th>Acronym</th><th>Definition</th></tr></thead>
                    <tbody>
                        ${acronyms.map(([a, d]) => `<tr><td><strong>${a}</strong></td><td>${d}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderStyles() {
        return `<style>
            .ssp-document { font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif; color: #1a1a2e; max-width: 900px; margin: 0 auto; line-height: 1.6; font-size: 13px; }
            .ssp-cover { text-align: center; padding: 80px 40px; border: 2px solid #4f46e5; border-radius: 12px; margin-bottom: 32px; }
            .ssp-cover-badge { display: inline-block; padding: 6px 16px; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 6px; margin-bottom: 24px; }
            .ssp-cover-title { font-size: 28px; font-weight: 700; color: #1a1a2e; margin: 0 0 8px; }
            .ssp-cover-subtitle { font-size: 16px; color: #64748b; font-weight: 400; margin: 0 0 32px; }
            .ssp-cover-meta { display: inline-block; text-align: left; }
            .ssp-cover-meta-row { padding: 4px 0; font-size: 13px; color: #475569; }
            .ssp-cover-meta-row span { display: inline-block; min-width: 140px; }
            .ssp-page-break { page-break-after: always; margin: 32px 0; border-bottom: 1px solid #e2e8f0; }
            .ssp-section { margin-bottom: 28px; }
            .ssp-section-title { font-size: 18px; font-weight: 700; color: #1e293b; border-bottom: 2px solid #4f46e5; padding-bottom: 6px; margin: 0 0 16px; }
            .ssp-section h3 { font-size: 14px; font-weight: 600; color: #334155; margin: 16px 0 8px; }
            .ssp-section p { margin: 0 0 12px; color: #334155; }
            .ssp-section ul, .ssp-ref-list { padding-left: 24px; margin: 0 0 12px; }
            .ssp-section li { margin-bottom: 4px; color: #334155; }
            .ssp-toc { padding: 12px 0; }
            .ssp-toc-item { padding: 4px 0; font-size: 13px; }
            .ssp-toc-item span { display: inline-block; min-width: 32px; font-weight: 600; color: #4f46e5; }
            .ssp-toc-sub { padding-left: 24px; }
            .ssp-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px; }
            .ssp-table th { background: #f1f5f9; padding: 8px 10px; text-align: left; font-weight: 600; color: #334155; border: 1px solid #e2e8f0; }
            .ssp-table td { padding: 6px 10px; border: 1px solid #e2e8f0; color: #475569; vertical-align: top; }
            .ssp-info-table td:first-child { width: 200px; background: #f8fafc; font-weight: 500; }
            .ssp-summary-grid { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
            .ssp-summary-card { flex: 1; min-width: 120px; text-align: center; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; }
            .ssp-summary-value { font-size: 24px; font-weight: 700; color: #1e293b; }
            .ssp-summary-label { font-size: 11px; color: #64748b; margin-top: 4px; }
            .ssp-summary-card.ssp-met { border-color: #10b981; }
            .ssp-summary-card.ssp-met .ssp-summary-value { color: #059669; }
            .ssp-summary-card.ssp-partial { border-color: #f59e0b; }
            .ssp-summary-card.ssp-partial .ssp-summary-value { color: #d97706; }
            .ssp-summary-card.ssp-not-met { border-color: #ef4444; }
            .ssp-summary-card.ssp-not-met .ssp-summary-value { color: #dc2626; }
            .ssp-control-block { margin-bottom: 20px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
            .ssp-control-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; gap: 8px; }
            .ssp-control-header-left { display: flex; align-items: center; gap: 10px; }
            .ssp-control-header-right { display: flex; align-items: center; gap: 8px; }
            .ssp-control-id { font-family: 'SF Mono', monospace; font-weight: 700; color: #4f46e5; font-size: 13px; }
            .ssp-control-name { font-weight: 600; color: #1e293b; font-size: 13px; }
            .ssp-practice-id { font-size: 11px; color: #64748b; font-family: 'SF Mono', monospace; }
            .ssp-control-desc { padding: 10px 14px; font-size: 12px; color: #475569; border-bottom: 1px solid #e2e8f0; }
            .ssp-obj-table { margin: 0; }
            .ssp-obj-table td:last-child { width: 100px; text-align: center; font-weight: 600; }
            .ssp-status-met { color: #059669; font-weight: 600; }
            .ssp-status-not-met { color: #dc2626; font-weight: 600; }
            .ssp-status-partial { color: #d97706; font-weight: 600; }
            .ssp-status-na { color: #94a3b8; }
            .ssp-conformity-section { padding: 12px 14px; background: #fafbfc; }
            .ssp-conformity-section h4 { font-size: 12px; font-weight: 600; color: #334155; margin: 0 0 8px; }
            .ssp-conformity-section p { font-size: 12px; margin: 0 0 8px; }
            .ssp-placeholder { color: #94a3b8; font-style: italic; }
            .ssp-evidence { font-size: 11px; color: #64748b; padding: 6px 10px; background: #f1f5f9; border-radius: 4px; margin-top: 8px; }
            @media print {
                .ssp-page-break { page-break-after: always; border: none; margin: 0; }
                .ssp-document { max-width: none; }
                .ssp-control-block { break-inside: avoid; }
            }
        </style>`;
    },

    // Open SSP in a new window for printing/saving
    exportToWindow() {
        const html = this.generate();
        const win = window.open('', '_blank');
        if (!win) {
            alert('Please allow popups to export the SSP document.');
            return;
        }
        win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>System Security Plan - ${new Date().toISOString().split('T')[0]}</title></head><body>${html}</body></html>`);
        win.document.close();
    },

    // Download as HTML file
    exportToFile() {
        const html = this.generate();
        const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>System Security Plan</title></head><body>${html}</body></html>`;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SSP-${new Date().toISOString().split('T')[0]}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }
};
