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
                { title: 'Access Control Policy & Procedure', desc: 'Defines who can access what, how access is granted/revoked, and controls for remote, wireless, and privileged access.', tags: ['policy', 'procedure', 'AC'], guidance: {
                    summary: 'The Access Control policy is the cornerstone of CMMC compliance. It establishes rules for granting, reviewing, and revoking access to systems that process CUI. The accompanying procedure documents the step-by-step processes for account provisioning, periodic access reviews, and emergency access revocation.',
                    applicability: ['Organizations with any CUI-processing systems', 'Environments with remote workers or VPN access', 'Companies using cloud services (SaaS, IaaS)', 'Contractors with privileged admin accounts', 'Facilities with wireless networks accessible to CUI systems'],
                    considerations: ['Define access based on job function (role-based access control) — avoid individual permission grants', 'Establish a formal access request/approval workflow with documented approvals', 'Require access reviews at least quarterly for privileged accounts, semi-annually for standard users', 'Address remote access specifically: VPN requirements, MFA, session timeouts (15 min idle / 30 min max)', 'Document wireless access controls: WPA3/WPA2-Enterprise, separate SSIDs for CUI vs. guest', 'Include session lock and termination policies — screensaver with password after 15 minutes', 'Address CUI flow enforcement: how data moves between systems and authorization boundaries', 'Plan for emergency access revocation within 24 hours of personnel termination'],
                    controls: ['AC 3.1.1', 'AC 3.1.2', 'AC 3.1.3', 'AC 3.1.4', 'AC 3.1.5', 'AC 3.1.6', 'AC 3.1.7', 'AC 3.1.8', 'AC 3.1.9', 'AC 3.1.10', 'AC 3.1.11', 'AC 3.1.12', 'AC 3.1.13', 'AC 3.1.14', 'AC 3.1.15', 'AC 3.1.16', 'AC 3.1.17', 'AC 3.1.18', 'AC 3.1.19', 'AC 3.1.20', 'AC 3.1.21', 'AC 3.1.22']
                }},
                { title: 'Audit & Accountability Policy & Procedure', desc: 'Establishes requirements for logging system events, protecting audit records, and reviewing logs for anomalies.', tags: ['policy', 'procedure', 'AU'], guidance: {
                    summary: 'This policy ensures your organization creates, protects, and reviews audit logs sufficient to detect unauthorized activity on CUI systems. The procedure defines what events to log, how logs are correlated and reviewed, retention periods, and who is responsible for log analysis.',
                    applicability: ['All systems that store, process, or transmit CUI', 'SIEM/log aggregation platforms', 'Cloud environments (AWS CloudTrail, Azure Monitor, GCP Cloud Audit)', 'Endpoint detection and response (EDR) tools', 'Network devices (firewalls, switches, routers)'],
                    considerations: ['Define auditable events: login/logout, failed auth, privilege escalation, file access to CUI, config changes, account changes', 'Establish log retention: minimum 1 year recommended, 90 days readily accessible', 'Implement centralized log collection (SIEM) — individual device logs are insufficient for correlation', 'Assign specific personnel for log review with defined frequency (daily for critical alerts, weekly for trends)', 'Protect audit logs from tampering: write-once storage, separate access controls, integrity verification', 'Address audit failure alerting: what happens when logging stops or storage fills up', 'For small orgs: managed SIEM/SOC services can satisfy these requirements cost-effectively', 'Ensure timestamps are synchronized across all systems (NTP) for accurate correlation'],
                    controls: ['AU 3.3.1', 'AU 3.3.2', 'AU 3.3.3', 'AU 3.3.4', 'AU 3.3.5', 'AU 3.3.6', 'AU 3.3.7', 'AU 3.3.8']
                }},
                { title: 'Awareness & Training Policy & Procedure', desc: 'Defines security awareness training requirements, role-based training, and insider threat awareness programs.', tags: ['policy', 'procedure', 'AT'], guidance: {
                    summary: 'This policy mandates that all personnel with access to CUI systems receive security awareness training and that personnel with security-specific roles receive additional role-based training. The procedure documents training schedules, content requirements, tracking, and evidence collection.',
                    applicability: ['All employees, contractors, and third parties with system access', 'IT administrators and security personnel (role-based)', 'New hires during onboarding', 'Organizations using phishing simulation tools'],
                    considerations: ['Training must occur before granting system access and at least annually thereafter', 'Include CUI-specific content: what CUI is, how to identify it, handling requirements, reporting incidents', 'Role-based training for admins should cover: secure configuration, log review, incident response procedures', 'Include insider threat awareness: indicators, reporting channels, consequences', 'Document completion with sign-off sheets or LMS records — assessors will ask for evidence', 'Phishing simulations are not required but strongly demonstrate a mature program', 'For small orgs: affordable options include KnowBe4, Proofpoint SAT, or SANS security awareness', 'Address social engineering awareness: phone pretexting, tailgating, USB drop attacks'],
                    controls: ['AT 3.2.1', 'AT 3.2.2', 'AT 3.2.3']
                }},
                { title: 'Configuration Management Policy & Procedure', desc: 'Governs system baselines, change control processes, software restrictions, and security hardening standards.', tags: ['policy', 'procedure', 'CM'], guidance: {
                    summary: 'This policy establishes how systems are configured, baselined, and changed in a controlled manner. It covers hardening standards, change control boards, software whitelisting, and least-functionality principles. The procedure documents the step-by-step change management workflow.',
                    applicability: ['All CUI-processing systems, servers, workstations, and network devices', 'Cloud infrastructure (IaC templates, VM images)', 'Mobile devices under MDM', 'Development and staging environments connected to CUI systems'],
                    considerations: ['Establish documented baselines for each system type (server, workstation, network device, cloud instance)', 'Reference CIS Benchmarks or DISA STIGs as your hardening standard — assessors expect a named standard', 'Implement a formal change control process: request, review, approve, test, implement, verify', 'Restrict software installation to authorized lists — application whitelisting is the gold standard', 'Disable unnecessary services, ports, and protocols on all systems (least functionality)', 'Track and manage system component inventory — you cannot protect what you do not know about', 'Address user-installed software: either prohibit it or define an approval process', 'For cloud: use infrastructure-as-code and immutable images to enforce configuration consistency'],
                    controls: ['CM 3.4.1', 'CM 3.4.2', 'CM 3.4.3', 'CM 3.4.4', 'CM 3.4.5', 'CM 3.4.6', 'CM 3.4.7', 'CM 3.4.8', 'CM 3.4.9']
                }},
                { title: 'Identification & Authentication Policy & Procedure', desc: 'Covers user identification, MFA requirements, password standards, and authenticator lifecycle management.', tags: ['policy', 'procedure', 'IA'], guidance: {
                    summary: 'This policy defines how users and devices are identified and authenticated before accessing CUI systems. It covers MFA requirements, password complexity aligned with NIST 800-63B, service account management, and authenticator lifecycle (issuance, revocation, refresh).',
                    applicability: ['All user accounts accessing CUI systems', 'Service accounts and API keys', 'Privileged/admin accounts (stricter requirements)', 'Remote access and VPN connections', 'Cloud identity providers (Azure AD, Okta, etc.)'],
                    considerations: ['MFA is mandatory for all network access to CUI systems — this is non-negotiable for CMMC L2', 'Align password policy with NIST 800-63B: minimum 8 chars (12+ recommended), no periodic rotation unless compromised, check against breached password lists', 'Unique account per user — no shared accounts, especially for admin access', 'Service accounts: document purpose, owner, review schedule, and use managed identities where possible', 'Address replay-resistant authentication for privileged and remote access (FIDO2, PKI, time-based OTP)', 'Implement account lockout or throttling after failed authentication attempts', 'Plan for authenticator lifecycle: how are tokens/certs issued, renewed, revoked, and recovered', 'For small orgs: cloud-based IdP with built-in MFA (Microsoft Entra, Okta, JumpCloud) simplifies compliance'],
                    controls: ['IA 3.5.1', 'IA 3.5.2', 'IA 3.5.3', 'IA 3.5.4', 'IA 3.5.5', 'IA 3.5.6', 'IA 3.5.7', 'IA 3.5.8', 'IA 3.5.9', 'IA 3.5.10', 'IA 3.5.11']
                }},
                { title: 'Incident Response Policy & Procedure', desc: 'Defines incident handling capabilities, reporting requirements (including 72-hour DIBNet reporting), and post-incident activities.', tags: ['policy', 'procedure', 'IR'], guidance: {
                    summary: 'This policy establishes the organization\'s capability to detect, respond to, and recover from cybersecurity incidents, with specific emphasis on the 72-hour reporting requirement to DIBNet for incidents involving CUI. The procedure documents the full incident lifecycle: preparation, detection, containment, eradication, recovery, and lessons learned.',
                    applicability: ['All organizations handling CUI under DFARS 7012', 'SOC/NOC teams and incident responders', 'Management and legal teams (for reporting decisions)', 'Third-party incident response retainers'],
                    considerations: ['DFARS 252.204-7012 requires reporting cyber incidents to DIBNet within 72 hours — this is a contractual obligation', 'Define incident severity levels and escalation paths: who gets called at 2 AM for a critical incident', 'Establish an incident response team with defined roles: incident commander, technical lead, communications, legal', 'Test the IR plan at least annually: tabletop exercises count, but live simulations are stronger evidence', 'Document evidence preservation procedures: forensic imaging, chain of custody, log preservation', 'Address coordination with law enforcement, DC3, and the contracting officer', 'Include communication templates: internal notification, customer notification, DIBNet submission', 'For small orgs: an IR retainer with a qualified firm satisfies the capability requirement cost-effectively'],
                    controls: ['IR 3.6.1', 'IR 3.6.2', 'IR 3.6.3']
                }},
                { title: 'Maintenance Policy & Procedure', desc: 'Governs system maintenance activities, remote maintenance controls, and maintenance tool oversight.', tags: ['policy', 'procedure', 'MA'], guidance: {
                    summary: 'This policy controls how maintenance is performed on CUI systems, ensuring that maintenance activities are authorized, logged, and supervised. It addresses both on-site and remote maintenance, including requirements for sanitizing equipment sent off-site and controlling maintenance tools.',
                    applicability: ['IT teams performing system updates and repairs', 'Third-party maintenance vendors and MSPs', 'Remote support sessions (TeamViewer, ConnectWise, etc.)', 'Hardware sent for repair or replacement'],
                    considerations: ['All maintenance must be authorized and documented — maintain a maintenance log', 'Remote maintenance sessions require MFA, encryption, and session monitoring/recording', 'Terminate remote maintenance sessions when complete — no persistent remote access for vendors', 'Sanitize equipment before sending off-site for repair: remove CUI data, remove storage media if possible', 'Control and monitor maintenance tools brought into the facility or installed on systems', 'For MSP-managed environments: ensure the MSP\'s remote access meets all these requirements', 'Address emergency/unscheduled maintenance: who can authorize, how is it documented after the fact', 'Small orgs often overlook this: even routine patching counts as maintenance and should be documented'],
                    controls: ['MA 3.7.1', 'MA 3.7.2', 'MA 3.7.3', 'MA 3.7.4', 'MA 3.7.5', 'MA 3.7.6']
                }},
                { title: 'Media Protection Policy & Procedure', desc: 'Covers CUI marking, storage, transport, sanitization, and destruction requirements for all media types.', tags: ['policy', 'procedure', 'MP'], guidance: {
                    summary: 'This policy defines how media containing CUI is marked, protected, transported, sanitized, and destroyed. It covers both digital media (hard drives, USB drives, backup tapes) and physical media (printed documents). The procedure documents specific handling steps for each media type.',
                    applicability: ['USB drives, external hard drives, and portable storage', 'Server and workstation hard drives / SSDs', 'Printed documents and physical CUI', 'Backup media (tapes, cloud backups)', 'Mobile devices that may store CUI'],
                    considerations: ['Mark all CUI media with appropriate CUI markings per NARA CUI Registry', 'Restrict use of removable media: disable USB ports by default, whitelist approved devices only', 'Encrypt all portable/removable media containing CUI with FIPS-validated encryption', 'Define secure transport procedures: encrypted containers, tamper-evident packaging, chain of custody', 'Sanitize media before reuse or disposal per NIST SP 800-88: Clear, Purge, or Destroy based on media type', 'Maintain sanitization/destruction records with date, method, personnel, and media identifier', 'Address cloud storage: ensure cloud backups are encrypted and access-controlled', 'For small orgs: a shredder for paper and a certified e-waste vendor for electronics covers most scenarios'],
                    controls: ['MP 3.8.1', 'MP 3.8.2', 'MP 3.8.3', 'MP 3.8.4', 'MP 3.8.5', 'MP 3.8.6', 'MP 3.8.7', 'MP 3.8.8', 'MP 3.8.9']
                }},
                { title: 'Personnel Security Policy & Procedure', desc: 'Addresses personnel screening, access provisioning/deprovisioning, and termination procedures.', tags: ['policy', 'procedure', 'PS'], guidance: {
                    summary: 'This policy ensures that personnel with access to CUI systems are screened before access is granted and that access is promptly revoked upon termination or role change. The procedure documents the screening process, onboarding/offboarding checklists, and transfer procedures.',
                    applicability: ['All employees and contractors with CUI system access', 'HR departments managing onboarding/offboarding', 'Managers approving access for their teams', 'Third-party personnel (consultants, auditors)'],
                    considerations: ['Screen personnel before granting access: background checks appropriate to the position sensitivity', 'Define a formal onboarding checklist: NDA, security training, access provisioning, CUI handling briefing', 'Revoke all access within 24 hours of termination — coordinate between HR, IT, and management', 'Retrieve all company assets upon termination: laptops, badges, tokens, mobile devices', 'Address internal transfers: review and adjust access when personnel change roles', 'Include contractor and third-party personnel in the same screening and offboarding processes', 'Maintain records of screening, training completion, and access grants for each individual', 'For small orgs: even a basic background check service and a documented checklist satisfies the requirement'],
                    controls: ['PS 3.9.1', 'PS 3.9.2']
                }},
                { title: 'Physical & Environmental Protection Policy & Procedure', desc: 'Defines physical access controls, visitor management, monitoring, and alternate work site protections.', tags: ['policy', 'procedure', 'PE'], guidance: {
                    summary: 'This policy establishes physical security controls for facilities where CUI is processed or stored. It covers access control mechanisms, visitor management, physical monitoring, and protections for alternate work sites (home offices, co-working spaces).',
                    applicability: ['Office facilities with CUI-processing systems', 'Server rooms and data centers', 'Home offices / telework locations', 'Shared or co-working spaces', 'Shipping/receiving areas for CUI media'],
                    considerations: ['Limit physical access to authorized individuals: badge readers, key cards, or combination locks at minimum', 'Maintain visitor logs: name, organization, date/time in/out, escort assigned', 'Escort visitors at all times in areas where CUI is accessible — no unescorted visitor access', 'Monitor physical access with cameras, guards, or alarm systems at entry points', 'Protect CUI equipment in alternate work sites: locked rooms, privacy screens, secure storage', 'Address server room / data center access: separate access controls, environmental monitoring', 'Define procedures for lost badges/keys: immediate deactivation and reissuance', 'For small orgs: a locked office with a visitor sign-in sheet and a security camera can meet basic requirements'],
                    controls: ['PE 3.10.1', 'PE 3.10.2', 'PE 3.10.3', 'PE 3.10.4', 'PE 3.10.5', 'PE 3.10.6']
                }},
                { title: 'Risk Assessment Policy & Procedure', desc: 'Establishes risk assessment methodology, vulnerability scanning requirements, and risk response processes.', tags: ['policy', 'procedure', 'RA'], guidance: {
                    summary: 'This policy defines how the organization identifies, assesses, and responds to cybersecurity risks to CUI systems. It covers periodic risk assessments, vulnerability scanning, and the process for accepting, mitigating, transferring, or avoiding identified risks.',
                    applicability: ['All CUI-processing systems and networks', 'Vulnerability management teams', 'Management responsible for risk acceptance decisions', 'Third-party penetration testing engagements'],
                    considerations: ['Conduct risk assessments at least annually and whenever significant changes occur to systems or threats', 'Use a documented methodology: NIST RMF, FAIR, or a simplified risk matrix with likelihood and impact', 'Vulnerability scanning must occur at regular intervals: monthly for internal, quarterly for external at minimum', 'Scan for new vulnerabilities when identified (e.g., critical CVEs) — not just on schedule', 'Remediate vulnerabilities based on risk: critical/high within 30 days, medium within 90 days', 'Document risk acceptance decisions with management sign-off — assessors will ask who accepted what risk', 'Address third-party risk: include vendor/supply chain risks in your assessment', 'For small orgs: Tenable Nessus Essentials (free for 16 IPs) or OpenVAS can satisfy scanning requirements'],
                    controls: ['RA 3.11.1', 'RA 3.11.2', 'RA 3.11.3']
                }},
                { title: 'Security Assessment & Monitoring Policy & Procedure', desc: 'Covers internal security assessments, continuous monitoring, POA&M management, and system interconnections.', tags: ['policy', 'procedure', 'CA'], guidance: {
                    summary: 'This policy establishes requirements for periodically assessing the effectiveness of security controls, continuously monitoring the security posture, managing Plans of Action & Milestones (POA&Ms), and authorizing system interconnections.',
                    applicability: ['Internal audit and compliance teams', 'IT security teams responsible for monitoring', 'System owners authorizing interconnections', 'Management reviewing POA&M status'],
                    considerations: ['Assess security controls at least annually — this can be a self-assessment using the CMMC assessment guide', 'Develop and maintain POA&Ms for any identified deficiencies with realistic milestones and responsible parties', 'Continuous monitoring should include: vulnerability scanning, log review, configuration compliance checks', 'Define what "continuous" means for your org: automated tools running daily plus human review weekly/monthly', 'Document all system interconnections (ISAs/MOUs): what data flows, security controls at each end', 'Track POA&M progress and report to management at least quarterly', 'Address information exchange agreements with external partners who access your CUI systems', 'For small orgs: a quarterly self-assessment checklist plus automated scanning tools provides solid coverage'],
                    controls: ['CA 3.12.1', 'CA 3.12.2', 'CA 3.12.3', 'CA 3.12.4']
                }},
                { title: 'System & Communications Protection Policy & Procedure', desc: 'Addresses boundary protection, FIPS-validated encryption, network segmentation, and CUI data-at-rest/in-transit protections.', tags: ['policy', 'procedure', 'SC'], guidance: {
                    summary: 'This policy defines how the organization protects CUI during transmission and storage through boundary protection, encryption, network segmentation, and session management. It is one of the most technically complex policy areas, covering firewalls, VPNs, TLS, FIPS crypto, and architectural controls.',
                    applicability: ['Network infrastructure (firewalls, routers, switches)', 'VPN and remote access gateways', 'Web applications and APIs handling CUI', 'Storage systems (file servers, databases, cloud storage)', 'Email systems transmitting CUI'],
                    considerations: ['Implement boundary protection at all network boundaries: firewalls with deny-by-default rules', 'Segment CUI systems from general-purpose networks: VLANs, subnets, or separate physical networks', 'Use FIPS 140-2/3 validated cryptographic modules for all CUI encryption — this is a hard requirement', 'Encrypt CUI in transit: TLS 1.2+ for web, IPsec or TLS VPN for network, S/MIME or TLS for email', 'Encrypt CUI at rest: full-disk encryption (BitLocker, FileVault) plus database/file-level where appropriate', 'Implement DNS filtering and URL filtering to block known malicious sites at the boundary', 'Address session authenticity: protect against session hijacking and replay attacks', 'For small orgs: a next-gen firewall (Palo Alto, Fortinet) with proper segmentation covers many SC controls'],
                    controls: ['SC 3.13.1', 'SC 3.13.2', 'SC 3.13.3', 'SC 3.13.4', 'SC 3.13.5', 'SC 3.13.6', 'SC 3.13.7', 'SC 3.13.8', 'SC 3.13.9', 'SC 3.13.10', 'SC 3.13.11', 'SC 3.13.12', 'SC 3.13.13', 'SC 3.13.14', 'SC 3.13.15', 'SC 3.13.16']
                }},
                { title: 'System & Information Integrity Policy & Procedure', desc: 'Covers flaw remediation (patching), malicious code protection, security monitoring, and alerting requirements.', tags: ['policy', 'procedure', 'SI'], guidance: {
                    summary: 'This policy ensures the organization maintains the integrity of CUI systems through timely patching, malicious code protection, security monitoring, and alerting. The procedure documents patch management workflows, AV/EDR deployment standards, and alert triage processes.',
                    applicability: ['All endpoints (workstations, servers, mobile devices)', 'Patch management systems (WSUS, SCCM, Intune, NinjaOne)', 'Antivirus/EDR platforms (SentinelOne, CrowdStrike, Defender)', 'Email security gateways and spam filters'],
                    considerations: ['Patch critical vulnerabilities within 30 days, high within 60 days — document your SLA and track compliance', 'Deploy AV/EDR on all endpoints with real-time protection and automatic signature updates', 'Monitor system security alerts from all sources: EDR, SIEM, firewall, email gateway', 'Implement email protections: spam filtering, attachment scanning, URL rewriting/sandboxing', 'Define alert triage procedures: who reviews alerts, response timeframes by severity, escalation paths', 'Address zero-day vulnerabilities: compensating controls while waiting for patches', 'Perform integrity monitoring on critical system files and configurations (file integrity monitoring)', 'For small orgs: a managed EDR service with 24/7 SOC monitoring satisfies multiple SI controls efficiently'],
                    controls: ['SI 3.14.1', 'SI 3.14.2', 'SI 3.14.3', 'SI 3.14.4', 'SI 3.14.5', 'SI 3.14.6', 'SI 3.14.7']
                }},
                { title: 'Acceptable Use Policy (AUP) & Rules of Behavior', desc: 'Defines authorized and prohibited system use, monitoring consent, and user responsibilities for CUI handling.', tags: ['policy', 'supplemental', 'AUP'], guidance: {
                    summary: 'The AUP/Rules of Behavior is a user-facing document that every person with system access must read and sign. It defines what constitutes acceptable use, prohibited activities, the organization\'s right to monitor, and individual responsibilities for protecting CUI.',
                    applicability: ['All employees, contractors, and third parties with any system access', 'New hires during onboarding (must sign before access is granted)', 'Annual re-acknowledgment for all personnel'],
                    considerations: ['Must be signed before granting system access — no exceptions', 'Include explicit monitoring consent: "By using this system, you consent to monitoring and recording"', 'Define prohibited activities: personal use limits, unauthorized software, sharing credentials, unauthorized CUI disclosure', 'Address social media: what can/cannot be shared about work, projects, or CUI', 'Include consequences for violations: disciplinary action up to and including termination', 'Keep it readable: 2-3 pages maximum, plain language, avoid legal jargon that users will not read', 'Require annual re-acknowledgment and update the AUP when policies change significantly', 'For small orgs: a one-page AUP with a signature block is sufficient — complexity is not the goal, coverage is'],
                    controls: ['PL 3.15.3', 'AT 3.2.1', 'AC 3.1.1']
                }},
                { title: 'Telework & Remote Access Policy', desc: 'Addresses VPN requirements, approved devices, home network security, and CUI handling at alternate work sites.', tags: ['policy', 'supplemental', 'telework', 'remote'], guidance: {
                    summary: 'This supplemental policy addresses the specific security requirements for personnel who work remotely or from alternate work sites. It covers VPN requirements, approved device standards, home network security expectations, and rules for handling CUI outside the primary facility.',
                    applicability: ['All remote/hybrid workers with CUI access', 'Organizations with BYOD or company-issued laptop programs', 'Personnel who travel with CUI-capable devices'],
                    considerations: ['Require VPN with MFA for all remote access to CUI systems — split tunneling should be prohibited or carefully controlled', 'Define approved devices: company-managed only, or BYOD with specific security requirements (MDM, encryption, patching)', 'Address home network security: require WPA3/WPA2, recommend separate network segment for work devices', 'CUI should not be printed at home unless specifically authorized with secure storage requirements', 'Require privacy screens in public spaces (airports, coffee shops, co-working spaces)', 'Address session timeout: auto-lock after 15 minutes of inactivity, VPN session limits', 'Include physical security at home: locked room or cabinet for work devices when not in use', 'For small orgs: a clear one-page remote work agreement covering VPN, device security, and CUI handling is effective'],
                    controls: ['AC 3.1.12', 'AC 3.1.14', 'PE 3.10.6', 'SC 3.13.8']
                }},
                { title: 'Mobile Device Management (MDM) Policy', desc: 'Covers device enrollment, encryption, remote wipe, approved apps, and BYOD restrictions for mobile devices.', tags: ['policy', 'supplemental', 'MDM', 'mobile'], guidance: {
                    summary: 'This policy governs the use of mobile devices (smartphones, tablets) that access organizational systems or data, including CUI. It defines enrollment requirements, security configurations, approved applications, and the organization\'s authority to remotely wipe devices.',
                    applicability: ['Organizations allowing mobile device access to email, VPN, or cloud apps', 'BYOD environments', 'Company-issued mobile devices', 'Tablets used in field operations or manufacturing'],
                    considerations: ['Enroll all mobile devices in an MDM platform before granting access to organizational resources', 'Require device encryption (enabled by default on modern iOS/Android, but must be verified and enforced)', 'Implement remote wipe capability and define triggers: lost device, stolen device, employee termination', 'Restrict app installation to approved sources and block known-risky applications', 'Enforce screen lock with PIN/biometric and auto-lock timeout (5 minutes recommended for mobile)', 'Address BYOD specifically: containerization to separate work/personal data, privacy expectations', 'Prohibit CUI storage on mobile devices unless specifically authorized with additional controls', 'For small orgs: Microsoft Intune (included with M365 Business Premium) or JumpCloud provides affordable MDM'],
                    controls: ['AC 3.1.18', 'AC 3.1.19', 'MP 3.8.1', 'SC 3.13.16']
                }},
                { title: 'Data Classification & CUI Handling Policy', desc: 'Defines CUI categories, marking requirements, handling procedures, storage, transmission, and destruction rules.', tags: ['policy', 'supplemental', 'CUI', 'classification'], guidance: {
                    summary: 'This policy establishes how data is classified within the organization and specifically how CUI is identified, marked, handled, stored, transmitted, and destroyed. It is foundational to all other CMMC policies because it defines what you are protecting.',
                    applicability: ['All personnel who create, receive, or handle CUI', 'Document management and file sharing systems', 'Email systems and collaboration platforms', 'Physical document handling and storage'],
                    considerations: ['Define your data classification levels: Public, Internal, Confidential, CUI — keep it simple', 'Reference the NARA CUI Registry for applicable CUI categories in your contracts', 'Establish CUI marking requirements: banner markings on documents, email subject line tags, folder naming', 'Define handling rules for each classification level: who can access, how to store, how to share, how to destroy', 'Address CUI in email: encryption requirements, approved recipients, prohibition on personal email', 'Define CUI storage locations: approved file shares, cloud storage with appropriate controls, no local desktop storage', 'Include CUI spillage procedures: what to do when CUI ends up in an unauthorized location', 'For small orgs: start by identifying where CUI enters your organization (contracts, emails, file shares) and trace its flow'],
                    controls: ['MP 3.8.1', 'MP 3.8.2', 'MP 3.8.3', 'MP 3.8.4', 'MP 3.8.5', 'SC 3.13.16']
                }},
                { title: 'Encryption & Key Management Policy', desc: 'Addresses FIPS 140-2/3 requirements, data-at-rest and in-transit encryption, and cryptographic key lifecycle management.', tags: ['policy', 'supplemental', 'encryption', 'FIPS'], guidance: {
                    summary: 'This policy defines the organization\'s encryption standards for protecting CUI, with specific emphasis on the FIPS 140-2/3 validation requirement. It covers encryption for data at rest, data in transit, key generation, storage, rotation, and destruction.',
                    applicability: ['All systems storing or transmitting CUI', 'VPN and remote access infrastructure', 'Cloud storage and SaaS platforms', 'Backup systems and media', 'Email encryption solutions'],
                    considerations: ['FIPS 140-2/3 validated cryptographic modules are required — not just FIPS-compliant algorithms, but validated implementations', 'Check the CMVP database for your specific products: BitLocker, OpenSSL, AWS KMS, Azure Key Vault, etc.', 'Data at rest: full-disk encryption on all endpoints, database encryption for CUI fields, encrypted backups', 'Data in transit: TLS 1.2+ (prefer 1.3), IPsec VPN, disable SSLv3/TLS 1.0/1.1', 'Key management: define key generation, distribution, storage, rotation, and destruction procedures', 'Separate key storage from encrypted data — keys should not be stored alongside the data they protect', 'Address certificate management: inventory, expiration tracking, renewal procedures', 'For small orgs: BitLocker (Windows) and FileVault (Mac) are FIPS-validated; cloud providers handle key management for SaaS'],
                    controls: ['SC 3.13.8', 'SC 3.13.10', 'SC 3.13.11', 'SC 3.13.16']
                }},
                { title: 'Backup & Recovery Policy', desc: 'Defines backup strategies (3-2-1 rule), encryption requirements, testing schedules, and RTO/RPO targets.', tags: ['policy', 'supplemental', 'backup', 'recovery'], guidance: {
                    summary: 'This policy establishes requirements for backing up CUI systems and data, testing recovery procedures, and defining recovery objectives. While not a standalone CMMC control family, backup and recovery underpins multiple control areas including media protection, contingency planning, and system integrity.',
                    applicability: ['All systems storing CUI data', 'Cloud-hosted applications and databases', 'On-premises file servers and email systems', 'Configuration data for network devices and security tools'],
                    considerations: ['Follow the 3-2-1 rule: 3 copies, 2 different media types, 1 offsite (cloud or physical offsite)', 'Encrypt all backups containing CUI with FIPS-validated encryption', 'Define RTO (Recovery Time Objective) and RPO (Recovery Point Objective) for each critical system', 'Test backup restoration at least annually — document the test, results, and any issues found', 'Protect backup access: separate credentials, MFA, limited personnel with restore capability', 'Address ransomware resilience: immutable backups, air-gapped copies, or cloud backups with versioning', 'Include configuration backups: firewall rules, switch configs, GPOs, cloud infrastructure templates', 'For small orgs: cloud backup services (Veeam, Datto, Azure Backup) with encryption and immutability are cost-effective'],
                    controls: ['MP 3.8.9', 'SC 3.13.16', 'SI 3.14.1']
                }},
                { title: 'Vendor & Supply Chain Risk Management Policy', desc: 'Covers vendor risk assessments, FedRAMP requirements for cloud services, flow-down clauses, and third-party access controls.', tags: ['policy', 'supplemental', 'vendor', 'supply-chain'], guidance: {
                    summary: 'This policy addresses how the organization manages cybersecurity risks from vendors, suppliers, and third-party service providers. It is increasingly important as CMMC Rev 3 adds explicit supply chain controls and as more organizations rely on cloud services and managed service providers.',
                    applicability: ['Cloud service providers (SaaS, IaaS, PaaS) processing CUI', 'Managed service providers (MSPs) with system access', 'Software vendors with access to CUI systems', 'Subcontractors receiving CUI flow-down'],
                    considerations: ['Assess vendor security posture before granting access: security questionnaires, SOC 2 reports, FedRAMP authorization', 'Cloud services processing CUI should be FedRAMP Authorized or equivalent — use the FedRAMP Marketplace to verify', 'Include DFARS 252.204-7012 flow-down clauses in all subcontracts involving CUI', 'Define minimum security requirements for vendors: encryption, MFA, incident reporting, background checks', 'Maintain a vendor inventory with security assessment status, contract terms, and data access scope', 'Review vendor security posture at least annually and upon contract renewal', 'Address vendor incident notification: require vendors to report security incidents within a defined timeframe', 'For small orgs: a vendor security questionnaire template and a tracking spreadsheet is a solid starting point'],
                    controls: ['SR 3.17.1', 'SR 3.17.2', 'SR 3.17.3', 'AC 3.1.1', 'CA 3.12.4']
                }},
                { title: 'Policy & Procedure Writing Guide', desc: 'Framework for writing assessment-ready policies and procedures: the 6W formula, quality levels, structure, and assessor expectations.', tags: ['guidance', 'writing', 'framework'], guidance: {
                    summary: 'This guide provides a framework for writing policies and procedures that will satisfy CMMC assessors. It covers the critical distinction between policies (WHAT and WHY) and procedures (HOW, WHO, WHEN, WHERE), the universal document structure, and the "Assessor\'s Test" for evaluating document quality.',
                    applicability: ['Anyone responsible for writing or reviewing CMMC policies', 'Compliance officers and security managers', 'Consultants preparing clients for CMMC assessment', 'Organizations starting their documentation from scratch'],
                    considerations: ['Policies define WHAT must be done and WHY — they are management directives, not technical instructions', 'Procedures define HOW, WHO, WHEN, and WHERE — they are step-by-step instructions a new employee could follow', 'Use the "Assessor\'s Test": Could a new employee follow this procedure without asking questions? If not, add more detail', 'Universal policy structure: Purpose, Scope, Roles & Responsibilities, Policy Statements, Enforcement, Review Schedule', 'Use the 6W Procedure Formula: WHO does WHAT, WHEN, WHERE, HOW, and what EVIDENCE is produced', 'Small orgs (< 50 people) can consolidate into 4-5 policies; larger orgs should have one per control family', 'Every policy needs an owner, a review date, and version history — assessors check for currency', 'Avoid copy-pasting NIST control text as your policy — assessors want to see how YOU implement the control in YOUR environment'],
                    controls: []
                }}
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

            <div id="dh-fedramp-widget-slot">${typeof FedRAMPExplorer !== 'undefined' && typeof FedRAMPMarketplace !== 'undefined' && FedRAMPMarketplace.loaded ? FedRAMPExplorer.renderDocsHubWidget() : '<div class="fre-widget fre-widget-loading"><div class="fre-widget-header"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg><span class="fre-widget-title">FedRAMP Marketplace — Live Data</span></div><div style="text-align:center;padding:12px 0;color:var(--text-muted);font-size:0.75rem"><div class="fre-spinner" style="display:inline-block;margin-bottom:8px"></div><br>Loading marketplace data...</div></div>'}</div>

            <div class="dh-categories" id="docs-hub-results">
                ${this.renderCategories()}
            </div>
        </div>`;

        this.bindEvents();
        this._initFedRAMPWidget();
    },

    expandedGuidance: null,

    renderCategories(query) {
        query = (query || '').toLowerCase().trim();
        let html = '';

        for (const cat of this.categories) {
            const filtered = query ? cat.docs.filter(d => {
                const haystack = `${d.title} ${d.desc} ${d.tags.join(' ')} ${cat.name}`.toLowerCase();
                if (d.guidance) {
                    const gHay = `${d.guidance.summary} ${d.guidance.applicability.join(' ')} ${d.guidance.considerations.join(' ')} ${d.guidance.controls.join(' ')}`.toLowerCase();
                    return haystack.includes(query) || gHay.includes(query);
                }
                return haystack.includes(query);
            }) : cat.docs;

            if (filtered.length === 0) continue;

            html += `
            <div class="dh-category" id="dh-cat-${cat.id}">
                <div class="dh-category-header" style="--cat-color:${cat.color}">
                    <span class="dh-category-icon">${cat.icon}</span>
                    <h2 class="dh-category-name">${this.esc(cat.name)}</h2>
                    <span class="dh-category-count">${filtered.length} item${filtered.length !== 1 ? 's' : ''}</span>
                </div>
                <div class="dh-doc-grid">
                    ${filtered.map((d, i) => d.guidance ? this._renderGuidanceCard(d, cat.id + '-' + i) : `
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

    _renderGuidanceCard(d, cardId) {
        const isOpen = this.expandedGuidance === cardId;
        const g = d.guidance;
        const esc = this.esc;
        const tagType = d.tags.includes('supplemental') ? 'supplemental' : d.tags.includes('procedure') ? 'policy-procedure' : 'guidance';
        const tagLabel = tagType === 'supplemental' ? 'Supplemental' : tagType === 'policy-procedure' ? 'Policy & Procedure' : 'Guide';

        let card = `<div class="dh-guidance-card${isOpen ? ' dh-guidance-open' : ''}" data-guidance-id="${cardId}">
            <div class="dh-guidance-header" data-guidance-id="${cardId}">
                <div class="dh-guidance-header-top">
                    <span class="dh-guidance-type-badge dh-guidance-type-${tagType}">${tagLabel}</span>
                    ${g.controls.length ? `<span class="dh-guidance-ctrl-count">${g.controls.length} control${g.controls.length !== 1 ? 's' : ''}</span>` : ''}
                </div>
                <div class="dh-guidance-title">${esc(d.title)}</div>
                <div class="dh-guidance-desc">${esc(d.desc)}</div>
                <div class="dh-doc-tags">
                    ${d.tags.map(t => `<span class="dh-doc-tag">${esc(t)}</span>`).join('')}
                </div>
                <div class="dh-guidance-expand-hint">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="${isOpen ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}"/></svg>
                    ${isOpen ? 'Collapse' : 'Click to explore guidance'}
                </div>
            </div>`;

        if (isOpen) {
            card += `<div class="dh-guidance-body">
                <div class="dh-guidance-section">
                    <div class="dh-guidance-section-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        Summary
                    </div>
                    <div class="dh-guidance-section-text">${esc(g.summary)}</div>
                </div>

                <div class="dh-guidance-section">
                    <div class="dh-guidance-section-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                        Who Should This Apply To?
                    </div>
                    <ul class="dh-guidance-list">
                        ${g.applicability.map(a => `<li>${esc(a)}</li>`).join('')}
                    </ul>
                </div>

                <div class="dh-guidance-section">
                    <div class="dh-guidance-section-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        Implementation Considerations
                    </div>
                    <ul class="dh-guidance-considerations">
                        ${g.considerations.map(c => `<li>${esc(c)}</li>`).join('')}
                    </ul>
                </div>`;

            if (g.controls.length) {
                card += `<div class="dh-guidance-section">
                    <div class="dh-guidance-section-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                        Related NIST 800-171 Controls
                    </div>
                    <div class="dh-guidance-controls">
                        ${g.controls.map(c => `<span class="dh-guidance-ctrl-chip">${esc(c)}</span>`).join('')}
                    </div>
                </div>`;
            }

            card += `</div>`;
        }

        card += `</div>`;
        return card;
    },

    bindEvents() {
        const self = this;
        const search = document.getElementById('docs-hub-search');
        const results = document.getElementById('docs-hub-results');
        if (search && results) {
            search.addEventListener('input', () => {
                self.expandedGuidance = null;
                results.innerHTML = self.renderCategories(search.value);
            });
        }

        // Delegated click for guidance card expand/collapse
        const container = document.getElementById('docs-hub-content');
        if (container) {
            container.addEventListener('click', function(e) {
                const header = e.target.closest('.dh-guidance-header');
                if (!header) return;

                // Prevent click from bubbling to anchor tags
                e.preventDefault();
                e.stopPropagation();

                const cardId = header.dataset.guidanceId;
                if (!cardId) return;

                self.expandedGuidance = self.expandedGuidance === cardId ? null : cardId;

                if (results) {
                    const query = search ? search.value : '';
                    results.innerHTML = self.renderCategories(query);

                    // Scroll to the expanded card
                    if (self.expandedGuidance) {
                        setTimeout(() => {
                            const card = container.querySelector('.dh-guidance-open');
                            if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 50);
                    }
                }
            });
        }
    },

    _initFedRAMPWidget() {
        const slot = document.getElementById('dh-fedramp-widget-slot');
        if (!slot) return;

        const updateWidget = () => {
            if (typeof FedRAMPExplorer === 'undefined' || typeof FedRAMPMarketplace === 'undefined') return;
            if (!FedRAMPMarketplace.loaded) return;
            slot.innerHTML = FedRAMPExplorer.renderDocsHubWidget();
            // Bind the "Open FedRAMP Explorer" button to navigate
            const btn = slot.querySelector('.fre-widget-btn');
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (window.app && typeof window.app.switchView === 'function') {
                        window.app.switchView('fedramp-explorer');
                    }
                });
            }
        };

        // If already loaded, update immediately
        if (typeof FedRAMPMarketplace !== 'undefined' && FedRAMPMarketplace.loaded) {
            updateWidget();
            return;
        }

        // Otherwise wait for data
        if (typeof FedRAMPMarketplace !== 'undefined') {
            FedRAMPMarketplace.onReady(() => updateWidget());
            if (!FedRAMPMarketplace.loading && !FedRAMPMarketplace.loaded) {
                FedRAMPMarketplace.init();
            }
        }

        // Also listen for the DOM event as a fallback
        document.addEventListener('fedramp-marketplace-ready', () => updateWidget(), { once: true });
    }
};

if (typeof window !== 'undefined') window.DocsHub = DocsHub;
