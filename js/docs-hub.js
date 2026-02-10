// CMMC Documentation Reference Hub
// Curated links to official CMMC, NIST, FedRAMP, and DoD documents

const DocsHub = {

    esc(s) { return typeof escHtml === 'function' ? escHtml(s) : String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); },

    categories: [
        {
            id: 'cmmc-core',
            name: 'CMMC 2.0 Core',
            icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
            color: '#6c8aff',
            docs: [
                { title: '32 CFR Part 170 — CMMC Final Rule', url: 'https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-D/part-170', desc: 'The official CMMC Program regulation published in the Federal Register.', tags: ['regulation', 'official'] },
                { title: 'CMMC Model Overview', url: 'https://dodcio.defense.gov/CMMC/Model/', desc: 'DoD CIO overview of CMMC 2.0 model levels, practices, and assessment types.', tags: ['overview'] },
                { title: 'CMMC Assessment Guide — Level 2', url: 'https://dodcio.defense.gov/Portals/0/Documents/CMMC/AGLevel2.pdf', desc: 'Official assessment guide for CMMC Level 2 with all 110 practices and 320 objectives.', tags: ['assessment', 'L2', 'pdf'] },
                { title: 'CMMC Assessment Guide — Level 1', url: 'https://dodcio.defense.gov/Portals/0/Documents/CMMC/AGLevel1.pdf', desc: 'Official assessment guide for CMMC Level 1 (17 practices, self-assessment).', tags: ['assessment', 'L1', 'pdf'] },
                { title: 'CMMC Scoping Guide — Level 2', url: 'https://dodcio.defense.gov/Portals/0/Documents/CMMC/ScopingGuideL2.pdf', desc: 'Guidance on defining the CMMC assessment scope, asset categories, and CUI boundaries.', tags: ['scoping', 'L2', 'pdf'] },
                { title: 'CMMC Scoping Guide — Level 1', url: 'https://dodcio.defense.gov/Portals/0/Documents/CMMC/ScopingGuideL1.pdf', desc: 'Scoping guidance for Level 1 self-assessments.', tags: ['scoping', 'L1', 'pdf'] },
                { title: 'POA&M Eligibility (32 CFR 170.21)', url: 'https://www.ecfr.gov/current/title-32/section-170.21', desc: 'Rules for which controls can have POA&Ms and which are "Not POA&M Eligible".', tags: ['regulation', 'poam'] },
                { title: 'CMMC Hashing & Artifacts', url: 'https://dodcio.defense.gov/CMMC/Documentation/', desc: 'Official CMMC documentation page with all downloadable artifacts.', tags: ['official', 'artifacts'] }
            ]
        },
        {
            id: 'nist-standards',
            name: 'NIST Standards',
            icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
            color: '#34d399',
            docs: [
                { title: 'NIST SP 800-171 Rev 2', url: 'https://csrc.nist.gov/pubs/sp/800/171/r2/upd1/final', desc: 'Protecting CUI in Nonfederal Systems — the basis for CMMC Level 2.', tags: ['standard', 'rev2'] },
                { title: 'NIST SP 800-171 Rev 3', url: 'https://csrc.nist.gov/pubs/sp/800/171/r3/final', desc: 'Updated CUI protection requirements (97 controls, 17 families). Future CMMC basis.', tags: ['standard', 'rev3'] },
                { title: 'NIST SP 800-171A Rev 2', url: 'https://csrc.nist.gov/pubs/sp/800/171a/final', desc: 'Assessment procedures for 800-171 Rev 2 — defines the 320 assessment objectives.', tags: ['assessment', 'rev2'] },
                { title: 'NIST SP 800-171A Rev 3', url: 'https://csrc.nist.gov/pubs/sp/800/171a/r3/final', desc: 'Assessment procedures for 800-171 Rev 3 — defines 422 assessment objectives.', tags: ['assessment', 'rev3'] },
                { title: 'NIST SP 800-172', url: 'https://csrc.nist.gov/pubs/sp/800/172/final', desc: 'Enhanced security requirements for CUI — basis for CMMC Level 3.', tags: ['standard', 'L3'] },
                { title: 'NIST SP 800-172A', url: 'https://csrc.nist.gov/pubs/sp/800/172a/final', desc: 'Assessment procedures for 800-172 enhanced requirements (Level 3).', tags: ['assessment', 'L3'] },
                { title: 'NIST SP 800-53 Rev 5', url: 'https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final', desc: 'Security and Privacy Controls — the parent control catalog that 800-171 derives from.', tags: ['standard', 'controls'] },
                { title: 'NIST SP 800-53B', url: 'https://csrc.nist.gov/pubs/sp/800/53b/upd1/final', desc: 'Control Baselines — Low, Moderate, High baselines for federal systems.', tags: ['baselines'] },
                { title: 'NIST Cybersecurity Framework (CSF) 2.0', url: 'https://www.nist.gov/cyberframework', desc: 'Voluntary framework for managing cybersecurity risk. Maps to 800-53 controls.', tags: ['framework'] }
            ]
        },
        {
            id: 'fedramp',
            name: 'FedRAMP',
            icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
            color: '#a78bfa',
            docs: [
                { title: 'FedRAMP 20x Overview', url: 'https://www.fedramp.gov/20x/', desc: 'FedRAMP modernization initiative with Key Security Indicators (KSIs).', tags: ['20x', 'overview'] },
                { title: 'FedRAMP Marketplace', url: 'https://marketplace.fedramp.gov/', desc: 'Search authorized cloud service providers and their authorization status.', tags: ['marketplace'] },
                { title: 'FedRAMP Authorization Boundary Guidance', url: 'https://www.fedramp.gov/assets/resources/documents/CSP_A_FedRAMP_Authorization_Boundary_Guidance.pdf', desc: 'How to define and document your FedRAMP authorization boundary.', tags: ['boundary', 'pdf'] },
                { title: 'FedRAMP SSP Template', url: 'https://www.fedramp.gov/assets/resources/templates/FedRAMP-SSP-Moderate-Baseline-Template.docx', desc: 'Official System Security Plan template for Moderate baseline.', tags: ['template', 'ssp'] },
                { title: 'FedRAMP Continuous Monitoring Guide', url: 'https://www.fedramp.gov/assets/resources/documents/CSP_Continuous_Monitoring_Strategy_Guide.pdf', desc: 'Requirements for ongoing monitoring after FedRAMP authorization.', tags: ['conmon', 'pdf'] },
                { title: 'FedRAMP Rev 5 Baselines', url: 'https://www.fedramp.gov/baselines/', desc: 'FedRAMP-specific baselines built on NIST 800-53 Rev 5.', tags: ['baselines', 'rev5'] }
            ]
        },
        {
            id: 'dod-dfars',
            name: 'DoD & DFARS',
            icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
            color: '#fbbf24',
            docs: [
                { title: 'DFARS 252.204-7012', url: 'https://www.ecfr.gov/current/title-48/section-252.204-7012', desc: 'Safeguarding Covered Defense Information and Cyber Incident Reporting. Unchanged by the RFO.', tags: ['regulation', 'dfars'] },
                { title: 'DFARS 252.204-7021', url: 'https://www.ecfr.gov/current/title-48/section-252.204-7021', desc: 'Contractor Compliance with the CMMC Program. Unchanged by the RFO.', tags: ['regulation', 'cmmc'] },
                { title: 'DFARS 252.240-7997 (formerly 7020)', url: 'https://www.ecfr.gov/current/title-48/section-252.240-7997', desc: 'NIST SP 800-171 DoD Assessment Requirements — renumbered from 252.204-7020 via RFO class deviation. Basic self-assessment requirement removed; Medium/High DIBCAC assessments unchanged.', tags: ['regulation', 'dfars', 'rfo'] },
                { title: 'FAR 52.240-93 (formerly 52.204-21)', url: 'https://www.ecfr.gov/current/title-48/section-52.240-93', desc: 'Basic Safeguarding of Covered Contractor Information Systems — renumbered from 52.204-21 via RFO. Same 15 cybersecurity requirements; still flows down to subcontractors.', tags: ['regulation', 'far', 'rfo'] },
                { title: 'DFARS 252.204-7019 (Removed)', url: '#', desc: 'Notice of NIST SP 800-171 DoD Assessment Requirements — this provision no longer exists as of the Revolutionary FAR Overhaul (RFO).', tags: ['regulation', 'dfars', 'rfo', 'removed'] },
                { title: 'SPRS Score Submission', url: 'https://www.sprs.csd.disa.mil/', desc: 'Supplier Performance Risk System — used for Medium/High assessment scores. Basic self-assessment upload requirement removed by RFO.', tags: ['sprs', 'portal'] },
                { title: 'CUI Registry', url: 'https://www.archives.gov/cui/registry', desc: 'National Archives CUI Registry — defines CUI categories and markings.', tags: ['cui', 'registry'] },
                { title: 'NIST SP 800-171 DoD Assessment Methodology', url: 'https://www.acq.osd.mil/asda/dpc/cp/cyber/docs/safeguarding/NIST-SP-800-171-Assessment-Methodology-Version-1.2.1-6.24.2020.pdf', desc: 'DoD methodology for scoring NIST 800-171 assessments (Medium/High DIBCAC scoring).', tags: ['sprs', 'methodology', 'pdf'] },
                { title: 'DIBCAC Assessment Information', url: 'https://www.dcma.mil/DIBCAC/', desc: 'Defense Industrial Base Cybersecurity Assessment Center — conducts Medium and High assessments.', tags: ['assessment', 'dibcac'] },
                { title: 'RFO Impact on DFARS 7019 & 7020', url: 'https://www.summit7.us/blog/why-the-rfo-ended-dfars-7019-and-7020', desc: 'Summit 7 analysis of how the Revolutionary FAR Overhaul affects DFARS cybersecurity clauses.', tags: ['article', 'rfo', 'analysis'] }
            ]
        },
        {
            id: 'templates',
            name: 'Templates & Tools',
            icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
            color: '#f87171',
            docs: [
                { title: 'NIST 800-171 SSP Template', url: 'https://csrc.nist.gov/CSRC/media/Publications/sp/800-171/rev-2/final/documents/sp800-171r2-template-ssp.docx', desc: 'Official NIST System Security Plan template for 800-171 Rev 2.', tags: ['template', 'ssp'] },
                { title: 'NIST 800-171A Assessment Template', url: 'https://csrc.nist.gov/CSRC/media/Publications/sp/800-171a/final/documents/sp800-171A-assessment-template.docx', desc: 'Official assessment worksheet template from NIST.', tags: ['template', 'assessment'] },
                { title: 'POA&M Template', url: 'https://dodcio.defense.gov/Portals/0/Documents/CMMC/POAM-Template.xlsx', desc: 'DoD Plan of Action & Milestones template for CMMC assessments.', tags: ['template', 'poam'] },
                { title: 'myctrl.tools — NIST 800-53 Explorer', url: 'https://www.myctrl.tools/frameworks/nist-800-53-r5/', desc: 'Interactive explorer for NIST 800-53 Rev 5 controls with cross-references.', tags: ['tool', 'explorer'] },
                { title: 'myctrl.tools — FedRAMP 20x KSI', url: 'https://www.myctrl.tools/frameworks/fedramp-20x-ksi/', desc: 'Interactive explorer for FedRAMP 20x Key Security Indicators.', tags: ['tool', 'fedramp'] },
                { title: 'OSCAL (Open Security Controls Assessment Language)', url: 'https://pages.nist.gov/OSCAL/', desc: 'NIST machine-readable format for security plans, assessments, and results.', tags: ['tool', 'oscal'] },
                { title: 'NIST CMVP — Validated Modules', url: 'https://csrc.nist.gov/projects/cryptographic-module-validation-program/validated-modules', desc: 'Search FIPS 140-2/3 validated cryptographic modules.', tags: ['tool', 'fips'] }
            ]
        },
        {
            id: 'policy-guidance',
            name: 'Policy & Procedure Guidance',
            icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>',
            color: '#f472b6',
            docs: [
                // ── Bundled CMMC Policy Templates ──
                { title: 'Access Control Policy', url: 'docs/CMMC Policies/Access_Control_Policy_CMMC.docx', desc: 'CMMC-aligned policy template covering AC 3.1.1–3.1.22: least privilege, remote access, wireless, session controls, CUI flow enforcement.', tags: ['policy', 'template', 'AC', 'bundled'] },
                { title: 'Audit & Accountability Policy', url: 'docs/CMMC Policies/Audit_And_Accountability_Policy_CMMC.docx', desc: 'Policy template for AU 3.3.1–3.3.8: audit logging, correlation, protection, retention, and review requirements.', tags: ['policy', 'template', 'AU', 'bundled'] },
                { title: 'Awareness & Training Policy', url: 'docs/CMMC Policies/Awareness_And_Training_Policy_CMMC.docx', desc: 'Policy template for AT 3.2.1–3.2.2: security awareness training, role-based training, insider threat awareness.', tags: ['policy', 'template', 'AT', 'bundled'] },
                { title: 'Configuration Management Policy', url: 'docs/CMMC Policies/Configuration_Management_Policy_CMMC.docx', desc: 'Policy template for CM 3.4.1–3.4.12: baselines, change control, least functionality, software restrictions.', tags: ['policy', 'template', 'CM', 'bundled'] },
                { title: 'Identification & Authentication Policy', url: 'docs/CMMC Policies/Identification_And_Authentication_Policy_CMMC.docx', desc: 'Policy template for IA 3.5.1–3.5.12: MFA, password complexity, authenticator management, replay resistance.', tags: ['policy', 'template', 'IA', 'bundled'] },
                { title: 'Incident Response Policy', url: 'docs/CMMC Policies/Incident_Response_Policy_CMMC.docx', desc: 'Policy template for IR 3.6.1–3.6.5: incident handling, reporting to DIBNet, testing, and training.', tags: ['policy', 'template', 'IR', 'bundled'] },
                { title: 'Maintenance Policy', url: 'docs/CMMC Policies/Maintenance_Policy_CMMC.docx', desc: 'Policy template for MA 3.7.4–3.7.6: controlled maintenance, media sanitization, remote maintenance oversight.', tags: ['policy', 'template', 'MA', 'bundled'] },
                { title: 'Media Protection Policy', url: 'docs/CMMC Policies/Media_Protection_Policy_CMMC.docx', desc: 'Policy template for MP 3.8.1–3.8.9: CUI marking, storage, transport, sanitization, and disposal.', tags: ['policy', 'template', 'MP', 'bundled'] },
                { title: 'Personnel Security Policy', url: 'docs/CMMC Policies/Personnel_Security_Policy_CMMC.docx', desc: 'Policy template for PS 3.9.1–3.9.2: screening, termination/transfer procedures, access revocation.', tags: ['policy', 'template', 'PS', 'bundled'] },
                { title: 'Physical & Environmental Protection Policy', url: 'docs/CMMC Policies/Physical_Protection_Policy_CMMC.docx', desc: 'Policy template for PE 3.10.1–3.10.8: physical access, visitor control, monitoring, alternate work sites.', tags: ['policy', 'template', 'PE', 'bundled'] },
                { title: 'Risk Assessment Policy', url: 'docs/CMMC Policies/Risk_Assessment_Policy_CMMC.docx', desc: 'Policy template for RA 3.11.1–3.11.4: risk assessments, vulnerability scanning, risk response.', tags: ['policy', 'template', 'RA', 'bundled'] },
                { title: 'Security Assessment & Monitoring Policy', url: 'docs/CMMC Policies/Security_Assessment_Policy_CMMC.docx', desc: 'Policy template for CA 3.12.1–3.12.5: security assessments, continuous monitoring, system connections.', tags: ['policy', 'template', 'CA', 'bundled'] },
                { title: 'System & Communications Protection Policy', url: 'docs/CMMC Policies/System_And_Communication_Protection_Policy_CMMC.docx', desc: 'Policy template for SC 3.13.1–3.13.15: boundary protection, FIPS crypto, session authenticity, CUI at rest.', tags: ['policy', 'template', 'SC', 'bundled'] },
                { title: 'System & Information Integrity Policy', url: 'docs/CMMC Policies/System_And_Information_Integrity_Policy_CMMC.docx', desc: 'Policy template for SI 3.14.1–3.14.8: flaw remediation, malicious code, monitoring, alerting.', tags: ['policy', 'template', 'SI', 'bundled'] },

                // ── Bundled CMMC Procedure Templates ──
                { title: 'Access Control Procedure', url: 'docs/CMMC Procedures/CMMC-PRO-AC Access Control Procedure.docx', desc: 'Step-by-step procedures for account management, access reviews, remote access, wireless, and session controls.', tags: ['procedure', 'template', 'AC', 'bundled'] },
                { title: 'Audit & Accountability Procedure', url: 'docs/CMMC Procedures/CMMC-PRO-AU Audit And Accountability Procedure.docx', desc: 'Procedures for audit log configuration, review, correlation, protection, and retention.', tags: ['procedure', 'template', 'AU', 'bundled'] },
                { title: 'Awareness & Training Procedure', url: 'docs/CMMC Procedures/CMMC-PRO-AT Awareness And Training Procedure.docx', desc: 'Procedures for onboarding training, annual refreshers, phishing simulations, and role-based training.', tags: ['procedure', 'template', 'AT', 'bundled'] },
                { title: 'Configuration Management Procedure', url: 'docs/CMMC Procedures/CMMC-PRO-CM Configuration Management Procedure.docx', desc: 'Procedures for baseline management, change control boards, software whitelisting, and hardening.', tags: ['procedure', 'template', 'CM', 'bundled'] },
                { title: 'Identification & Authentication Procedure', url: 'docs/CMMC Procedures/CMMC-PRO-IAM Identification Authentication Procedure.docx', desc: 'Procedures for MFA enrollment, password resets, service account management, and authenticator lifecycle.', tags: ['procedure', 'template', 'IA', 'bundled'] },
                { title: 'Incident Response Procedure', url: 'docs/CMMC Procedures/CMMC-PRO-INC Incident Response Procedure.docx', desc: 'Procedures for detection, containment, eradication, recovery, DIBNet reporting, and lessons learned.', tags: ['procedure', 'template', 'IR', 'bundled'] },
                { title: 'Maintenance Procedure', url: 'docs/CMMC Procedures/CMMC-PRO-MP Maintenance Procedure.docx', desc: 'Procedures for scheduled maintenance, remote maintenance sessions, and maintenance tool controls.', tags: ['procedure', 'template', 'MA', 'bundled'] },
                { title: 'Media Protection Procedure', url: 'docs/CMMC Procedures/CMMC-PRO-MPP Media Protection Procedure.docx', desc: 'Procedures for CUI media marking, storage, transport, sanitization (NIST 800-88), and destruction.', tags: ['procedure', 'template', 'MP', 'bundled'] },
                { title: 'Physical Protection Procedure', url: 'docs/CMMC Procedures/CMMC-PRO-PP Physical Protection Procedure.docx', desc: 'Procedures for badge issuance, visitor escort, physical access logs, and alternate work site controls.', tags: ['procedure', 'template', 'PE', 'bundled'] },
                { title: 'Personnel Security Procedure', url: 'docs/CMMC Procedures/CMMC-PRO-PSP Personnel Security Procedure.docx', desc: 'Procedures for background checks, onboarding/offboarding, access revocation within 24 hours.', tags: ['procedure', 'template', 'PS', 'bundled'] },
                { title: 'Risk Assessment Procedure', url: 'docs/CMMC Procedures/CMMC-PRO-RA Risk Assessment Procedure.docx', desc: 'Procedures for annual risk assessments, vulnerability scanning schedules, and risk response tracking.', tags: ['procedure', 'template', 'RA', 'bundled'] },
                { title: 'Security Assessment Procedure', url: 'docs/CMMC Procedures/CMMC-PRO-SAP Security Assessment Procedure.docx', desc: 'Procedures for internal assessments, continuous monitoring, POA&M management, and system interconnections.', tags: ['procedure', 'template', 'CA', 'bundled'] },
                { title: 'System & Communications Protection Procedure', url: 'docs/CMMC Procedures/CMMC-PRO-SCP System Communications Protection Procedure.docx', desc: 'Procedures for firewall rules, TLS/VPN configuration, FIPS crypto validation, and network segmentation.', tags: ['procedure', 'template', 'SC', 'bundled'] },
                { title: 'System & Information Integrity Procedure', url: 'docs/CMMC Procedures/CMMC-PRO-SIP System Information Integrity Procedure.docx', desc: 'Procedures for patch management, AV/EDR deployment, security alert monitoring, and spam protection.', tags: ['procedure', 'template', 'SI', 'bundled'] },

                // ── Supplemental Policy Guidance ──
                { title: 'Acceptable Use Policy (AUP) / Rules of Behavior', url: 'docs/policy-procedure-advisor-SKILL.md', desc: 'Guidance for writing an AUP/Rules of Behavior covering authorized use, prohibited activities, monitoring consent, and CUI handling responsibilities. Required by PL 3.15.3.', tags: ['policy', 'guidance', 'AUP', 'PL'] },
                { title: 'Telework & Remote Access Policy', url: 'docs/policy-procedure-advisor-SKILL.md', desc: 'Guidance for telework policies: VPN requirements, approved devices, home network security, CUI handling at alternate work sites, and session timeout rules. Supports AC 3.1.12, PE 3.10.6.', tags: ['policy', 'guidance', 'telework', 'remote'] },
                { title: 'Mobile Device Management (MDM) Policy', url: 'docs/policy-procedure-advisor-SKILL.md', desc: 'Guidance for MDM policies: device enrollment, encryption requirements, remote wipe, approved apps, BYOD restrictions, and CUI on mobile devices. Supports AC 3.1.18, AC 3.1.19, MP 3.8.1.', tags: ['policy', 'guidance', 'MDM', 'mobile'] },
                { title: 'Data Classification & CUI Handling Policy', url: 'docs/policy-procedure-advisor-SKILL.md', desc: 'Guidance for data classification: CUI categories, marking requirements, handling procedures, storage, transmission, and destruction. Supports MP 3.8.1–3.8.9.', tags: ['policy', 'guidance', 'CUI', 'classification'] },
                { title: 'Wireless Security Policy', url: 'docs/policy-procedure-advisor-SKILL.md', desc: 'Guidance for wireless policies: WPA3/WPA2-Enterprise, SSID segmentation, rogue AP detection, guest network isolation. Supports AC 3.1.16, AC 3.1.17.', tags: ['policy', 'guidance', 'wireless', 'AC'] },
                { title: 'Removable Media Policy', url: 'docs/policy-procedure-advisor-SKILL.md', desc: 'Guidance for removable media: USB restrictions, encryption requirements, approved device lists, sanitization before reuse. Supports MP 3.8.7, MP 3.8.8.', tags: ['policy', 'guidance', 'media', 'USB'] },
                { title: 'Password & Authentication Standards', url: 'docs/policy-procedure-advisor-SKILL.md', desc: 'Guidance for password policies: complexity rules, MFA requirements, banned password lists, service account standards, and NIST 800-63B alignment. Supports IA 3.5.1–3.5.11.', tags: ['policy', 'guidance', 'password', 'MFA'] },
                { title: 'Backup & Recovery Policy', url: 'docs/policy-procedure-advisor-SKILL.md', desc: 'Guidance for backup policies: 3-2-1 rule, encryption of backups, testing schedules, RTO/RPO targets, and offsite storage. Supports MP 3.8.9, CP controls.', tags: ['policy', 'guidance', 'backup', 'recovery'] },
                { title: 'Vendor & Supply Chain Risk Management Policy', url: 'docs/policy-procedure-advisor-SKILL.md', desc: 'Guidance for vendor management: supply chain risk assessments, FedRAMP requirements for cloud vendors, flow-down clauses, and third-party access controls. Supports SR 3.17.1–3.17.3 (Rev 3).', tags: ['policy', 'guidance', 'vendor', 'supply-chain'] },
                { title: 'Encryption & Key Management Policy', url: 'docs/policy-procedure-advisor-SKILL.md', desc: 'Guidance for encryption policies: FIPS 140-2/3 requirements, data-at-rest and data-in-transit encryption, key lifecycle management, and certificate rotation. Supports SC 3.13.8, SC 3.13.10, SC 3.13.11.', tags: ['policy', 'guidance', 'encryption', 'FIPS'] },
                { title: 'Policy & Procedure Writing Guide', url: 'docs/policy-procedure-advisor-SKILL.md', desc: 'Comprehensive guide to writing assessment-ready policies and procedures: the 6W formula, quality levels, universal structure, assessor expectations, and consolidation strategies.', tags: ['guidance', 'writing', 'framework'] }
            ]
        },
        {
            id: 'guidance',
            name: 'Implementation Guidance',
            icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
            color: '#38bdf8',
            docs: [
                { title: 'CISA Cybersecurity Best Practices', url: 'https://www.cisa.gov/topics/cybersecurity-best-practices', desc: 'CISA guidance on implementing cybersecurity controls and best practices.', tags: ['guidance', 'cisa'] },
                { title: 'CIS Benchmarks', url: 'https://www.cisecurity.org/cis-benchmarks', desc: 'Center for Internet Security configuration benchmarks for hardening systems.', tags: ['guidance', 'hardening'] },
                { title: 'DISA STIGs', url: 'https://public.cyber.mil/stigs/', desc: 'Security Technical Implementation Guides for DoD system hardening.', tags: ['guidance', 'stigs'] },
                { title: 'AWS CMMC Compliance Guide', url: 'https://aws.amazon.com/compliance/cmmc/', desc: 'AWS guidance for achieving CMMC compliance on AWS GovCloud.', tags: ['cloud', 'aws'] },
                { title: 'Azure CMMC Compliance', url: 'https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-cmmc', desc: 'Microsoft Azure guidance for CMMC compliance including GCC High.', tags: ['cloud', 'azure'] },
                { title: 'Google Cloud CMMC', url: 'https://cloud.google.com/security/compliance/cmmc', desc: 'Google Cloud Platform guidance for CMMC compliance.', tags: ['cloud', 'gcp'] }
            ]
        }
    ],

    render() {
        const container = document.getElementById('docs-hub-content');
        if (!container) return;

        const allTags = new Set();
        this.categories.forEach(cat => cat.docs.forEach(d => d.tags.forEach(t => allTags.add(t))));

        container.innerHTML = `
        <div class="dh-page">
            <div class="dh-header">
                <button class="view-back-btn" data-back-view="dashboard" title="Back to Dashboard">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Back
                </button>
                <div class="dh-header-text">
                    <h1 class="dh-title">Documentation Reference Hub</h1>
                    <p class="dh-subtitle">Curated links to official CMMC, NIST, FedRAMP, and DoD documents, templates, and tools.</p>
                </div>
            </div>

            <div class="dh-search-bar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" class="dh-search-input" id="docs-hub-search" placeholder="Search documents..." autocomplete="off">
            </div>

            <div class="dh-stats-row">
                ${this.categories.map(cat => `
                    <a href="#dh-cat-${cat.id}" class="dh-stat-chip" style="--chip-color:${cat.color}">
                        ${cat.icon}
                        <span>${cat.name}</span>
                        <span class="dh-stat-count">${cat.docs.length}</span>
                    </a>
                `).join('')}
            </div>

            ${typeof FedRAMPExplorer !== 'undefined' && typeof FedRAMPMarketplace !== 'undefined' && FedRAMPMarketplace.loaded ? FedRAMPExplorer.renderDocsHubWidget() : ''}

            <div class="dh-categories" id="docs-hub-results">
                ${this.renderCategories()}
            </div>
        </div>`;

        this.bindEvents();
    },

    renderCategories(query) {
        query = (query || '').toLowerCase().trim();
        let html = '';

        for (const cat of this.categories) {
            const filtered = query ? cat.docs.filter(d => {
                const haystack = `${d.title} ${d.desc} ${d.tags.join(' ')} ${cat.name}`.toLowerCase();
                return haystack.includes(query);
            }) : cat.docs;

            if (filtered.length === 0) continue;

            html += `
            <div class="dh-category" id="dh-cat-${cat.id}">
                <div class="dh-category-header" style="--cat-color:${cat.color}">
                    <span class="dh-category-icon">${cat.icon}</span>
                    <h2 class="dh-category-name">${this.esc(cat.name)}</h2>
                    <span class="dh-category-count">${filtered.length} document${filtered.length !== 1 ? 's' : ''}</span>
                </div>
                <div class="dh-doc-grid">
                    ${filtered.map(d => `
                        <a href="${this.esc(d.url)}" target="_blank" rel="noopener noreferrer" class="dh-doc-card" title="${this.esc(d.title)}">
                            <div class="dh-doc-title">${this.esc(d.title)}</div>
                            <div class="dh-doc-desc">${this.esc(d.desc)}</div>
                            <div class="dh-doc-tags">
                                ${d.tags.map(t => `<span class="dh-doc-tag">${this.esc(t)}</span>`).join('')}
                            </div>
                            <div class="dh-doc-link">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                Open
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>`;
        }

        if (!html) {
            html = '<div class="dh-empty">No documents match your search.</div>';
        }
        return html;
    },

    bindEvents() {
        const search = document.getElementById('docs-hub-search');
        const results = document.getElementById('docs-hub-results');
        if (search && results) {
            search.addEventListener('input', () => {
                results.innerHTML = this.renderCategories(search.value);
            });
        }
    }
};

if (typeof window !== 'undefined') window.DocsHub = DocsHub;
