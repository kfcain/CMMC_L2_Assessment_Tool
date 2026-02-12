// CMMC Level 2 Assessment & Scoping Guide — Interactive Reference Data
// Source: Official DoD CMMC Assessment Guide Level 2 v2.0 & Scoping Guide Level 2 v2.0
// URLs: https://dodcio.defense.gov/Portals/0/Documents/CMMC/AssessmentGuideL2v2.pdf
//       https://dodcio.defense.gov/Portals/0/Documents/CMMC/ScopingGuideL2v2.pdf
// This data is curated for quick-reference purposes. Always verify against the official PDFs.

const CMMC_L2_GUIDE_DATA = {

    meta: {
        assessmentGuideTitle: 'CMMC Assessment Guide — Level 2 v2.0',
        assessmentGuideUrl: 'https://dodcio.defense.gov/Portals/0/Documents/CMMC/AssessmentGuideL2v2.pdf',
        scopingGuideTitle: 'CMMC Scoping Guide — Level 2 v2.0',
        scopingGuideUrl: 'https://dodcio.defense.gov/Portals/0/Documents/CMMC/ScopingGuideL2v2.pdf',
        cmmcModelUrl: 'https://dodcio.defense.gov/CMMC/Model/',
        finalRuleUrl: 'https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-D/part-170',
        disclaimer: 'This interactive guide is a curated summary for quick reference. It does not replace the official DoD documents. Always consult the original PDFs for authoritative guidance.'
    },

    // ═══════════════════════════════════════════════════════════════
    //  PART 1: ASSESSMENT GUIDE — Overview & Process
    // ═══════════════════════════════════════════════════════════════
    assessmentOverview: {
        title: 'CMMC Level 2 Assessment Overview',
        sections: [
            {
                id: 'ag-purpose',
                title: 'Purpose',
                icon: '🎯',
                content: 'The CMMC Level 2 Assessment Guide provides the methodology and procedures for assessing an Organization Seeking Certification (OSC) against the 110 security requirements derived from NIST SP 800-171 Rev 2. It defines how a CMMC Third-Party Assessment Organization (C3PAO) or the OSC (for self-assessment) evaluates whether each of the 320 assessment objectives is MET, NOT MET, or NOT APPLICABLE.',
                keyPoints: [
                    'Level 2 maps directly to the 110 security requirements in NIST SP 800-171 Rev 2',
                    '320 assessment objectives across 14 control families',
                    'Assessment can be conducted by a C3PAO (certification) or self-assessed',
                    'Results determine eligibility for CMMC Level 2 certification'
                ]
            },
            {
                id: 'ag-assessment-types',
                title: 'Assessment Types',
                icon: '📋',
                content: 'CMMC Level 2 supports two assessment types depending on the sensitivity of CUI involved in the contract.',
                keyPoints: [
                    'Self-Assessment: For contracts involving CUI that is not critical or high-value. The OSC conducts its own assessment and submits results to SPRS.',
                    'Certification Assessment (C3PAO): For contracts requiring third-party certification. A CMMC Third-Party Assessment Organization conducts the assessment.',
                    'Both types use the same 320 assessment objectives and scoring methodology.',
                    'The contracting officer determines which type is required via DFARS clause 252.204-7021.'
                ]
            },
            {
                id: 'ag-scoring',
                title: 'Scoring Methodology',
                icon: '📊',
                content: 'Each of the 320 assessment objectives is evaluated individually. An objective is scored as MET if the assessor determines the OSC has implemented the requirement. The overall assessment result depends on how many objectives are met and whether POA&Ms are permitted.',
                keyPoints: [
                    'Each objective: MET, NOT MET, or NOT APPLICABLE (N/A)',
                    'A practice (control) is MET only when ALL of its objectives are MET',
                    'CMMC Level 2 Final: ALL 110 practices must be MET (no POA&Ms)',
                    'CMMC Level 2 Conditional: Minimum 80% of practices (88/110) must be MET; remaining can have POA&Ms',
                    'POA&Ms must be closed within 180 days of the conditional certification',
                    'Certain practices are NOT POA&M eligible (see 32 CFR 170.21)'
                ]
            },
            {
                id: 'ag-poam-rules',
                title: 'POA&M Eligibility Rules',
                icon: '⚠️',
                content: 'Not all practices are eligible for Plan of Action & Milestones (POA&M). The CMMC Final Rule (32 CFR Part 170) specifies which practices cannot have POA&Ms.',
                keyPoints: [
                    'POA&Ms are only allowed for Conditional Level 2 certification',
                    'Maximum of 22 practices (20%) can have POA&Ms',
                    'POA&Ms must be closed within 180 days',
                    'Practices with a SPRS weight of 5 are NOT POA&M eligible',
                    'The following are NOT POA&M eligible: 3.1.1, 3.1.2, 3.1.22, 3.3.1, 3.5.2, 3.5.3, 3.13.1, 3.13.2, 3.13.11, and others per 32 CFR 170.21',
                    'Failure to close POA&Ms within 180 days results in loss of conditional certification'
                ]
            },
            {
                id: 'ag-evidence',
                title: 'Evidence & Artifacts',
                icon: '📁',
                content: 'Assessors evaluate evidence to determine whether each objective is met. Evidence can take multiple forms and should demonstrate both implementation and effectiveness.',
                keyPoints: [
                    'Examine: Review documents, policies, procedures, system configurations, logs',
                    'Interview: Discuss with personnel responsible for implementing and managing controls',
                    'Test: Actively test mechanisms, processes, and procedures to verify they function as intended',
                    'Evidence should be current and reflect the actual state of the environment',
                    'System Security Plan (SSP) is a foundational document — it must describe how each requirement is implemented',
                    'Evidence must cover the entire CMMC Assessment Scope (all in-scope assets)'
                ]
            },
            {
                id: 'ag-process',
                title: 'Assessment Process',
                icon: '🔄',
                content: 'The CMMC Level 2 assessment follows a structured process from pre-assessment through final determination.',
                keyPoints: [
                    'Phase 1 — Pre-Assessment: OSC prepares SSP, gathers evidence, defines scope, conducts readiness review',
                    'Phase 2 — Assessment: C3PAO (or self) evaluates all 320 objectives using examine, interview, test methods',
                    'Phase 3 — Post-Assessment: Assessor compiles findings, determines MET/NOT MET for each practice',
                    'Phase 4 — Reporting: Results submitted to CMMC eMASS or SPRS (for self-assessment)',
                    'Conditional results allow 180-day POA&M remediation window',
                    'Final certification issued when all practices are MET (or POA&Ms closed)'
                ]
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    //  PART 2: SCOPING GUIDE — Asset Categories & Boundaries
    // ═══════════════════════════════════════════════════════════════
    scopingOverview: {
        title: 'CMMC Level 2 Scoping Guide',
        sections: [
            {
                id: 'sg-purpose',
                title: 'Scoping Purpose',
                icon: '🔍',
                content: 'The CMMC Scoping Guide defines how an OSC determines which assets, systems, and network segments are in scope for a CMMC Level 2 assessment. Proper scoping is critical — it determines what must be assessed and protected.',
                keyPoints: [
                    'Scoping defines the CMMC Assessment Scope — the set of assets that process, store, or transmit CUI',
                    'Includes assets that provide security protection for CUI assets',
                    'The scope directly impacts the cost, complexity, and duration of the assessment',
                    'Under-scoping creates compliance gaps; over-scoping increases unnecessary burden',
                    'The OSC is responsible for defining and documenting the scope in the SSP'
                ]
            },
            {
                id: 'sg-cui',
                title: 'Understanding CUI',
                icon: '🔒',
                content: 'Controlled Unclassified Information (CUI) is information the Government creates or possesses, or that an entity creates or possesses for or on behalf of the Government, that a law, regulation, or Government-wide policy requires or permits an agency to handle using safeguarding or dissemination controls.',
                keyPoints: [
                    'CUI is defined by the CUI Registry maintained by NARA (National Archives)',
                    'CUI categories include: Critical Infrastructure, Defense, Export Control, Financial, Immigration, Intelligence, Law Enforcement, Legal, Natural Resources, NATO, Nuclear, Patent, Privacy, Procurement, Proprietary, Statistical, Tax, Transportation',
                    'CUI markings: CUI, CUI//SP (Specified), CUI//SP-ITAR, CUI//SP-EXPT, etc.',
                    'The contract (DD Form 254, SOW, or DFARS clause) specifies what CUI the contractor will handle',
                    'If you process, store, or transmit CUI — you are in scope for CMMC Level 2'
                ]
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    //  PART 3: ASSET CATEGORIES (from Scoping Guide)
    // ═══════════════════════════════════════════════════════════════
    assetCategories: [
        {
            id: 'cui-assets',
            name: 'CUI Assets',
            color: '#7aa2f7',
            icon: '🔐',
            inScope: true,
            allControlsApply: true,
            description: 'Assets that process, store, or transmit CUI. These are the primary assets that must be protected and are subject to ALL 110 CMMC Level 2 practices.',
            examples: [
                'File servers storing CUI documents',
                'Workstations used to create or edit CUI',
                'Email servers that transmit CUI',
                'Databases containing CUI records',
                'Cloud services (e.g., GCC High) hosting CUI',
                'Collaboration tools (Teams, SharePoint) used for CUI',
                'Printers and MFDs that print CUI',
                'Mobile devices that access CUI'
            ],
            requirements: [
                'All 110 CMMC Level 2 practices apply',
                'Must be documented in the System Security Plan (SSP)',
                'Must be within the CMMC Assessment Scope boundary',
                'Physical and logical access must be controlled',
                'Must have audit logging enabled'
            ]
        },
        {
            id: 'security-protection',
            name: 'Security Protection Assets (SPA)',
            color: '#bb9af7',
            icon: '🛡️',
            inScope: true,
            allControlsApply: true,
            description: 'Assets that provide security functions or capabilities to the CMMC Assessment Scope, even if they do not directly process, store, or transmit CUI. Because they protect CUI assets, they are subject to ALL 110 practices.',
            examples: [
                'Firewalls protecting the CUI enclave',
                'Intrusion Detection/Prevention Systems (IDS/IPS)',
                'SIEM systems collecting logs from CUI assets',
                'Endpoint Detection and Response (EDR) tools',
                'VPN concentrators providing secure remote access',
                'Domain controllers providing authentication',
                'Certificate authorities (PKI infrastructure)',
                'Vulnerability scanners',
                'Backup systems for CUI data',
                'Security orchestration and automation (SOAR) platforms'
            ],
            requirements: [
                'All 110 CMMC Level 2 practices apply',
                'Must be documented in the SSP',
                'Compromise of these assets could directly impact CUI protection',
                'Must be hardened and monitored like CUI assets',
                'Access must be restricted to authorized security personnel'
            ]
        },
        {
            id: 'contractor-risk-managed',
            name: 'Contractor Risk Managed Assets (CRMA)',
            color: '#e0af68',
            icon: '⚠️',
            inScope: true,
            allControlsApply: false,
            description: 'Assets that can, but are not intended to, process, store, or transmit CUI. The contractor determines the risk and applies a subset of security requirements based on that risk assessment. These are NOT subject to all 110 practices — only those the contractor deems necessary based on risk.',
            examples: [
                'General-purpose workstations on the same network segment that do not intentionally handle CUI',
                'Shared printers that could potentially receive CUI print jobs',
                'IT management tools that have visibility into the CUI environment',
                'Development/test systems that mirror production CUI systems',
                'Conference room systems connected to the corporate network'
            ],
            requirements: [
                'NOT all 110 practices apply — contractor performs risk assessment',
                'Contractor documents which practices apply and why in the SSP',
                'Must not introduce unacceptable risk to CUI assets',
                'The contractor is responsible for managing the risk',
                'Assessor reviews the risk determination for reasonableness'
            ]
        },
        {
            id: 'specialized',
            name: 'Specialized Assets',
            color: '#73daca',
            icon: '⚙️',
            inScope: true,
            allControlsApply: false,
            description: 'Assets that may have constraints that prevent full implementation of all CMMC practices. These include IoT devices, OT systems, Government Furnished Equipment (GFE), and test equipment. The contractor documents limitations and compensating controls.',
            examples: [
                'IoT devices (sensors, cameras, badge readers) in the CUI environment',
                'Operational Technology (OT) / Industrial Control Systems (ICS)',
                'Government Furnished Equipment (GFE) — the government controls configuration',
                'Test equipment and lab instruments',
                'Embedded systems with limited configurability',
                'Legacy systems that cannot be updated'
            ],
            requirements: [
                'Contractor documents the specialized nature and limitations',
                'Compensating controls must be documented where full compliance is not possible',
                'GFE: Government is responsible for its configuration; contractor documents what they cannot control',
                'Must not introduce unacceptable risk to CUI',
                'Assessor evaluates whether compensating controls are adequate'
            ]
        },
        {
            id: 'out-of-scope',
            name: 'Out-of-Scope Assets',
            color: '#565f89',
            icon: '❌',
            inScope: false,
            allControlsApply: false,
            description: 'Assets that cannot access, process, store, or transmit CUI and are completely separated from the CMMC Assessment Scope. These assets are NOT assessed.',
            examples: [
                'Personal devices on a separate guest WiFi network',
                'Systems in a completely separate network with no connectivity to the CUI environment',
                'Public-facing marketing websites with no CUI',
                'HR systems that do not handle CUI',
                'Assets in a physically and logically isolated network segment'
            ],
            requirements: [
                'No CMMC practices apply',
                'Must be truly isolated — no network path to CUI assets',
                'If any connectivity exists to CUI environment, the asset is NOT out-of-scope',
                'The boundary between in-scope and out-of-scope must be clearly documented',
                'Assessor verifies the separation is real and effective'
            ]
        }
    ],

    // ═══════════════════════════════════════════════════════════════
    //  PART 4: CUI ENVIRONMENT BOUNDARY
    // ═══════════════════════════════════════════════════════════════
    cuiBoundary: {
        title: 'Defining the CUI Environment Boundary',
        sections: [
            {
                id: 'boundary-definition',
                title: 'What is the CUI Boundary?',
                icon: '🏗️',
                content: 'The CUI boundary (also called the CMMC Assessment Scope boundary) is the logical and physical perimeter that encompasses all assets that process, store, transmit, or protect CUI. Everything inside this boundary is in scope for assessment.',
                keyPoints: [
                    'The boundary must be clearly defined and documented in the SSP',
                    'It includes CUI Assets, Security Protection Assets, CRMAs, and Specialized Assets',
                    'Out-of-Scope assets are outside the boundary',
                    'Network diagrams should clearly show the boundary',
                    'The boundary can be a physical enclave, a virtual enclave, or a combination'
                ]
            },
            {
                id: 'boundary-strategies',
                title: 'Boundary Reduction Strategies',
                icon: '📐',
                content: 'Organizations can reduce the size and complexity of their CMMC Assessment Scope through architectural strategies. A smaller scope means fewer assets to assess and protect.',
                keyPoints: [
                    'Network Segmentation: Use VLANs, firewalls, and access controls to isolate CUI assets from general IT',
                    'Enclave Architecture: Create a dedicated CUI enclave with strict boundary controls',
                    'Cloud-Based CUI Processing: Move CUI to a FedRAMP-authorized cloud (e.g., GCC High) to reduce on-premise scope',
                    'Thin Client / VDI: Use virtual desktops to access CUI — the endpoint may be out of scope if CUI never lands on it',
                    'Data Minimization: Reduce the amount of CUI you handle — if you do not need it, do not store it',
                    'Encryption at Rest and in Transit: While encryption alone does not remove assets from scope, it is a key protection'
                ]
            },
            {
                id: 'boundary-documentation',
                title: 'Documentation Requirements',
                icon: '📝',
                content: 'The CUI boundary must be thoroughly documented. Assessors will review this documentation as part of the assessment.',
                keyPoints: [
                    'System Security Plan (SSP): Describes the system, boundary, and how each practice is implemented',
                    'Network Diagram: Shows all in-scope assets, connections, and the boundary',
                    'Data Flow Diagram: Shows how CUI flows through the environment',
                    'Asset Inventory: Lists all in-scope assets with their category (CUI, SPA, CRMA, Specialized)',
                    'Interconnection Agreements: Documents connections to external systems',
                    'The SSP is the single most important document for CMMC assessment'
                ]
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    //  PART 5: CONTROL FAMILIES QUICK REFERENCE
    // ═══════════════════════════════════════════════════════════════
    controlFamilies: [
        { id: 'AC', name: 'Access Control', practiceCount: 22, objectiveCount: 80, description: 'Limit system access to authorized users, processes, and devices. Control CUI flow, enforce separation of duties, least privilege, session management, and remote access.', topPractices: ['3.1.1 — Authorized Access', '3.1.2 — Transaction Control', '3.1.3 — CUI Flow Control', '3.1.12 — Remote Access Control', '3.1.22 — Publicly Accessible Content'] },
        { id: 'AT', name: 'Awareness & Training', practiceCount: 3, objectiveCount: 9, description: 'Ensure personnel are aware of security risks and trained in their responsibilities for protecting CUI.', topPractices: ['3.2.1 — Security Awareness', '3.2.2 — Role-Based Training', '3.2.3 — Insider Threat Awareness'] },
        { id: 'AU', name: 'Audit & Accountability', practiceCount: 9, objectiveCount: 30, description: 'Create, protect, and review audit logs. Ensure actions can be traced to individual users. Alert on audit failures.', topPractices: ['3.3.1 — System Auditing', '3.3.2 — User Accountability', '3.3.5 — Audit Review & Analysis', '3.3.8 — Audit Protection'] },
        { id: 'CM', name: 'Configuration Management', practiceCount: 9, objectiveCount: 28, description: 'Establish and maintain baseline configurations. Control changes, restrict unnecessary software, and enforce security settings.', topPractices: ['3.4.1 — Baseline Configurations', '3.4.2 — Security Config Settings', '3.4.5 — Access Restrictions for Change', '3.4.6 — Least Functionality'] },
        { id: 'IA', name: 'Identification & Authentication', practiceCount: 11, objectiveCount: 30, description: 'Identify and authenticate users, devices, and processes. Enforce password complexity, multi-factor authentication, and replay-resistant mechanisms.', topPractices: ['3.5.1 — User Identification', '3.5.2 — Device Authentication', '3.5.3 — Multi-Factor Authentication', '3.5.10 — Cryptographic Authentication'] },
        { id: 'IR', name: 'Incident Response', practiceCount: 3, objectiveCount: 9, description: 'Establish incident handling capabilities. Detect, report, and respond to security incidents. Test incident response plans.', topPractices: ['3.6.1 — Incident Handling', '3.6.2 — Incident Tracking & Reporting', '3.6.3 — Incident Response Testing'] },
        { id: 'MA', name: 'Maintenance', practiceCount: 6, objectiveCount: 18, description: 'Perform timely maintenance. Control maintenance tools and personnel. Sanitize equipment removed for off-site maintenance.', topPractices: ['3.7.1 — System Maintenance', '3.7.2 — Maintenance Controls', '3.7.5 — Nonlocal Maintenance'] },
        { id: 'MP', name: 'Media Protection', practiceCount: 9, objectiveCount: 26, description: 'Protect, control, sanitize, and destroy media containing CUI. Mark media with CUI designations.', topPractices: ['3.8.1 — Media Protection', '3.8.3 — Media Sanitization', '3.8.6 — Portable Storage Encryption', '3.8.9 — Backup CUI Protection'] },
        { id: 'PS', name: 'Personnel Security', practiceCount: 2, objectiveCount: 6, description: 'Screen individuals before granting access. Protect CUI during personnel actions like termination or transfer.', topPractices: ['3.9.1 — Personnel Screening', '3.9.2 — Personnel Actions'] },
        { id: 'PE', name: 'Physical Protection', practiceCount: 6, objectiveCount: 20, description: 'Limit physical access to systems and facilities. Escort visitors, maintain audit logs of physical access, control physical access devices.', topPractices: ['3.10.1 — Physical Access Authorizations', '3.10.2 — Physical Access Control', '3.10.5 — Physical Access Monitoring'] },
        { id: 'RA', name: 'Risk Assessment', practiceCount: 3, objectiveCount: 11, description: 'Assess risk to operations, assets, and individuals. Scan for vulnerabilities and remediate them.', topPractices: ['3.11.1 — Risk Assessments', '3.11.2 — Vulnerability Scanning', '3.11.3 — Vulnerability Remediation'] },
        { id: 'CA', name: 'Security Assessment', practiceCount: 4, objectiveCount: 12, description: 'Assess security controls periodically. Develop and implement plans of action. Monitor controls on an ongoing basis.', topPractices: ['3.12.1 — Security Assessments', '3.12.2 — Plans of Action', '3.12.3 — Continuous Monitoring', '3.12.4 — System Security Plans'] },
        { id: 'SC', name: 'System & Comm. Protection', practiceCount: 16, objectiveCount: 46, description: 'Monitor and protect communications at system boundaries. Implement cryptographic protections, network segmentation, and CUI confidentiality.', topPractices: ['3.13.1 — Boundary Protection', '3.13.2 — Architectural Designs', '3.13.8 — CUI in Transit Encryption', '3.13.11 — FIPS-Validated Cryptography'] },
        { id: 'SI', name: 'System & Info. Integrity', practiceCount: 7, objectiveCount: 25, description: 'Identify and correct system flaws. Protect against malicious code. Monitor system security alerts and advisories.', topPractices: ['3.14.1 — Flaw Remediation', '3.14.2 — Malicious Code Protection', '3.14.6 — Monitor Communications', '3.14.7 — Detect Unauthorized Use'] }
    ],

    // ═══════════════════════════════════════════════════════════════
    //  PART 6: KEY DEFINITIONS & GLOSSARY
    // ═══════════════════════════════════════════════════════════════
    glossary: [
        { term: 'CUI', definition: 'Controlled Unclassified Information — information requiring safeguarding or dissemination controls per law, regulation, or Government-wide policy.' },
        { term: 'OSC', definition: 'Organization Seeking Certification — the contractor or subcontractor being assessed for CMMC.' },
        { term: 'C3PAO', definition: 'CMMC Third-Party Assessment Organization — an authorized organization that conducts CMMC certification assessments.' },
        { term: 'CMMC-AB / Cyber AB', definition: 'The CMMC Accreditation Body (now "The Cyber AB") — the organization that accredits C3PAOs and certifies assessors.' },
        { term: 'SSP', definition: 'System Security Plan — the foundational document describing how an organization implements each security requirement.' },
        { term: 'POA&M', definition: 'Plan of Action & Milestones — a document identifying tasks to correct deficiencies and reduce risk, with timelines.' },
        { term: 'SPRS', definition: 'Supplier Performance Risk System — the DoD system where self-assessment scores are submitted.' },
        { term: 'eMASS', definition: 'Enterprise Mission Assurance Support Service — the DoD system used for managing CMMC certification assessment results.' },
        { term: 'NIST SP 800-171', definition: 'The NIST Special Publication that defines the 110 security requirements for protecting CUI in nonfederal systems. CMMC Level 2 maps directly to these requirements.' },
        { term: 'NIST SP 800-171A', definition: 'The NIST Special Publication that defines the 320 assessment objectives (procedures) for evaluating compliance with SP 800-171.' },
        { term: 'DFARS 252.204-7012', definition: 'The Defense Federal Acquisition Regulation Supplement clause requiring contractors to implement NIST SP 800-171 and report cyber incidents.' },
        { term: 'DFARS 252.204-7021', definition: 'The DFARS clause that implements CMMC requirements in contracts, specifying the required CMMC level.' },
        { term: 'FedRAMP', definition: 'Federal Risk and Authorization Management Program — the standardized approach for cloud security assessment. Cloud services handling CUI should be FedRAMP Moderate (or equivalent).' },
        { term: 'GCC High', definition: 'Government Community Cloud High — a Microsoft Azure/M365 environment designed for CUI and ITAR data, meeting FedRAMP High and DoD IL4/IL5 requirements.' },
        { term: 'Enclave', definition: 'A logically or physically isolated network segment that contains CUI assets and is protected by boundary controls.' },
        { term: 'Assessment Objective', definition: 'A specific, testable statement derived from a security requirement. Each of the 110 practices has multiple objectives (320 total).' },
        { term: 'Practice', definition: 'A CMMC term for a security requirement. Level 2 has 110 practices, each mapping to a NIST SP 800-171 requirement.' },
        { term: 'Conditional Certification', definition: 'A temporary CMMC certification (up to 180 days) granted when at least 80% of practices are MET and the remainder have POA&Ms.' },
        { term: 'Final Certification', definition: 'Full CMMC certification granted when all 110 practices are MET (all 320 objectives satisfied).' },
        { term: 'FIPS 140-2/140-3', definition: 'Federal Information Processing Standards for cryptographic modules. CMMC requires FIPS-validated cryptography for protecting CUI.' }
    ],

    // ═══════════════════════════════════════════════════════════════
    //  PART 7: FREQUENTLY ASKED QUESTIONS
    // ═══════════════════════════════════════════════════════════════
    faq: [
        { q: 'Who needs CMMC Level 2?', a: 'Any contractor or subcontractor that processes, stores, or transmits CUI as part of a DoD contract. The specific CMMC level is determined by the contracting officer and specified in the contract via DFARS 252.204-7021.' },
        { q: 'How long is a CMMC certification valid?', a: 'A CMMC Level 2 certification is valid for 3 years from the date of the final certification. The organization must maintain compliance throughout this period and may be subject to spot checks.' },
        { q: 'What is the difference between self-assessment and C3PAO assessment?', a: 'Self-assessment is conducted by the OSC itself and results are submitted to SPRS. C3PAO assessment is conducted by an accredited third-party organization. The contract specifies which type is required. Both use the same 320 assessment objectives.' },
        { q: 'Can I use a commercial cloud service for CUI?', a: 'Yes, but the cloud service must meet FedRAMP Moderate baseline (or equivalent) requirements. For DoD CUI, Microsoft GCC High, AWS GovCloud, and Google Cloud for Government are common choices. The cloud service\'s FedRAMP authorization should cover the services you use for CUI.' },
        { q: 'What happens if I fail the assessment?', a: 'If the assessment finds deficiencies, you may receive a Conditional certification (if ≥80% of practices are MET) with 180 days to close POA&Ms. If fewer than 80% are MET, you do not receive certification and must remediate before re-assessment.' },
        { q: 'Do subcontractors need CMMC?', a: 'Yes, if they process, store, or transmit CUI as part of the contract. The prime contractor must flow down CMMC requirements to subcontractors handling CUI. The required CMMC level for subcontractors is specified in the subcontract.' },
        { q: 'What is the SPRS score and how does it relate to CMMC?', a: 'The SPRS (Supplier Performance Risk System) score is a self-assessment score ranging from -203 to +110, based on NIST SP 800-171. It is required under DFARS 252.204-7019/7020. CMMC Level 2 self-assessments also submit results to SPRS. A perfect SPRS score of 110 means all practices are implemented.' },
        { q: 'How do I determine my CMMC Assessment Scope?', a: 'Follow the CMMC Scoping Guide Level 2. Identify all assets that process, store, or transmit CUI (CUI Assets), assets that protect CUI (Security Protection Assets), assets that could access CUI (CRMAs), and specialized assets. Document the boundary in your SSP with network and data flow diagrams.' },
        { q: 'Is encryption enough to remove an asset from scope?', a: 'No. Encryption alone does not remove an asset from the CMMC Assessment Scope. If an asset can decrypt or access CUI (even if encrypted at rest), it is in scope. However, encryption is a critical control for protecting CUI in transit and at rest.' },
        { q: 'What is the role of the SSP?', a: 'The System Security Plan (SSP) is the foundational document for CMMC assessment. It describes the system boundary, all in-scope assets, how each of the 110 practices is implemented, and the security architecture. Without an adequate SSP, the assessment cannot proceed. It should be a living document, updated as the environment changes.' }
    ],

    // ═══════════════════════════════════════════════════════════════
    //  PART 8: QUICK-START CHECKLIST
    // ═══════════════════════════════════════════════════════════════
    checklist: [
        { id: 'ck-1', phase: 'Preparation', item: 'Identify all CUI in your environment — what types, where it flows, where it is stored', critical: true },
        { id: 'ck-2', phase: 'Preparation', item: 'Define the CMMC Assessment Scope boundary (network diagram + data flow diagram)', critical: true },
        { id: 'ck-3', phase: 'Preparation', item: 'Categorize all assets: CUI, SPA, CRMA, Specialized, or Out-of-Scope', critical: true },
        { id: 'ck-4', phase: 'Preparation', item: 'Develop or update the System Security Plan (SSP) describing implementation of all 110 practices', critical: true },
        { id: 'ck-5', phase: 'Preparation', item: 'Conduct a gap assessment against all 320 objectives', critical: false },
        { id: 'ck-6', phase: 'Preparation', item: 'Create POA&Ms for any gaps identified (noting POA&M eligibility rules)', critical: false },
        { id: 'ck-7', phase: 'Implementation', item: 'Implement access controls — MFA, least privilege, session management', critical: true },
        { id: 'ck-8', phase: 'Implementation', item: 'Deploy FIPS-validated encryption for CUI at rest and in transit', critical: true },
        { id: 'ck-9', phase: 'Implementation', item: 'Configure audit logging on all in-scope systems', critical: true },
        { id: 'ck-10', phase: 'Implementation', item: 'Implement endpoint protection (EDR/antivirus) on all in-scope endpoints', critical: false },
        { id: 'ck-11', phase: 'Implementation', item: 'Establish vulnerability scanning and patch management processes', critical: false },
        { id: 'ck-12', phase: 'Implementation', item: 'Conduct security awareness training for all personnel', critical: false },
        { id: 'ck-13', phase: 'Implementation', item: 'Develop and test an incident response plan', critical: false },
        { id: 'ck-14', phase: 'Implementation', item: 'Implement network segmentation to isolate CUI environment', critical: false },
        { id: 'ck-15', phase: 'Assessment', item: 'Gather evidence artifacts for all 110 practices (policies, configs, screenshots, logs)', critical: true },
        { id: 'ck-16', phase: 'Assessment', item: 'Conduct internal readiness review before formal assessment', critical: false },
        { id: 'ck-17', phase: 'Assessment', item: 'Engage C3PAO (if certification assessment required) or conduct self-assessment', critical: true },
        { id: 'ck-18', phase: 'Assessment', item: 'Submit results to SPRS (self-assessment) or eMASS (C3PAO assessment)', critical: true },
        { id: 'ck-19', phase: 'Maintenance', item: 'Maintain continuous monitoring of security controls', critical: false },
        { id: 'ck-20', phase: 'Maintenance', item: 'Update SSP when environment changes', critical: false },
        { id: 'ck-21', phase: 'Maintenance', item: 'Close any POA&Ms within 180 days (if conditional certification)', critical: true },
        { id: 'ck-22', phase: 'Maintenance', item: 'Plan for re-assessment before 3-year certification expires', critical: false }
    ]
};

if (typeof window !== 'undefined') window.CMMC_L2_GUIDE_DATA = CMMC_L2_GUIDE_DATA;
