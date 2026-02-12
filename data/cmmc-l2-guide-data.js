// CMMC Level 2 Assessment & Scoping Guide — Interactive Reference Data
// Source: Official DoD CMMC Assessment Guide Level 2 v2.0 & Scoping Guide Level 2 v2.0
// URLs: https://dodcio.defense.gov/Portals/0/Documents/CMMC/AssessmentGuideL2v2.pdf
//       https://dodcio.defense.gov/Portals/0/Documents/CMMC/ScopingGuideL2v2.pdf
// This data is curated for quick-reference purposes. Always verify against the official PDFs.

const CMMC_L2_GUIDE_DATA = {

    meta: {
        assessmentGuideTitle: 'CMMC Assessment Guide — Level 2 v2.0',
        assessmentGuideUrl: 'https://dodcio.defense.gov/Portals/0/Documents/CMMC/AssessmentGuideL2v2.pdf',
        assessmentGuideL1Url: 'https://dodcio.defense.gov/Portals/0/Documents/CMMC/AssessmentGuideL1v2.pdf',
        scopingGuideTitle: 'CMMC Scoping Guide — Level 2 v2.0',
        scopingGuideUrl: 'https://dodcio.defense.gov/Portals/0/Documents/CMMC/ScopingGuideL2v2.pdf',
        scopingGuideL1Url: 'https://dodcio.defense.gov/Portals/0/Documents/CMMC/ScopingGuideL1v2.pdf',
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
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
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
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
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
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
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
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
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
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
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
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
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
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
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
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
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
            icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',
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
            icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
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
            icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
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
            icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
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
            icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
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
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="22" height="16" rx="2" ry="2"/><path d="M1 10h22"/></svg>',
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
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
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
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
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
    //  PART 5: CONTROL FAMILIES — Full Reference (L1 + L2)
    //  l1 = true means the practice is also required for CMMC Level 1
    //  (17 practices from FAR 52.204-21 / NIST SP 800-171 Rev 2)
    // ═══════════════════════════════════════════════════════════════
    controlFamilies: [
        {
            id: 'AC', name: 'Access Control', practiceCount: 22, objectiveCount: 70,
            description: 'Limit system access to authorized users, processes, and devices. Control CUI flow, enforce separation of duties, least privilege, session management, and remote access.',
            topPractices: ['3.1.1 — Authorized Access', '3.1.2 — Transaction Control', '3.1.3 — CUI Flow Control', '3.1.12 — Remote Access Control', '3.1.22 — Publicly Accessible Content'],
            allControls: [
                { id: '3.1.1', name: 'Authorized Access Control', l1: true },
                { id: '3.1.2', name: 'Transaction & Function Access Control', l1: true },
                { id: '3.1.3', name: 'CUI Flow Control', l1: false },
                { id: '3.1.4', name: 'Separation of Duties', l1: false },
                { id: '3.1.5', name: 'Least Privilege', l1: false },
                { id: '3.1.6', name: 'Non-Privileged Account Use', l1: false },
                { id: '3.1.7', name: 'Privileged Function Control', l1: false },
                { id: '3.1.8', name: 'Unsuccessful Logon Attempts', l1: false },
                { id: '3.1.9', name: 'Privacy & Security Notices', l1: false },
                { id: '3.1.10', name: 'Session Lock', l1: false },
                { id: '3.1.11', name: 'Session Termination', l1: false },
                { id: '3.1.12', name: 'Remote Access Control', l1: false },
                { id: '3.1.13', name: 'Remote Access Cryptography', l1: false },
                { id: '3.1.14', name: 'Remote Access Routing', l1: false },
                { id: '3.1.15', name: 'Privileged Remote Access', l1: false },
                { id: '3.1.16', name: 'Wireless Access Authorization', l1: false },
                { id: '3.1.17', name: 'Wireless Access Protection', l1: false },
                { id: '3.1.18', name: 'Mobile Device Connection', l1: false },
                { id: '3.1.19', name: 'Encrypt CUI on Mobile Devices', l1: false },
                { id: '3.1.20', name: 'External System Connections', l1: false },
                { id: '3.1.21', name: 'Portable Storage Use', l1: false },
                { id: '3.1.22', name: 'Publicly Accessible Content', l1: true }
            ]
        },
        {
            id: 'AT', name: 'Awareness & Training', practiceCount: 3, objectiveCount: 9,
            description: 'Ensure personnel are aware of security risks and trained in their responsibilities for protecting CUI.',
            topPractices: ['3.2.1 — Security Awareness', '3.2.2 — Role-Based Training', '3.2.3 — Insider Threat Awareness'],
            allControls: [
                { id: '3.2.1', name: 'Security Awareness', l1: false },
                { id: '3.2.2', name: 'Role-Based Training', l1: false },
                { id: '3.2.3', name: 'Insider Threat Awareness', l1: false }
            ]
        },
        {
            id: 'AU', name: 'Audit & Accountability', practiceCount: 9, objectiveCount: 29,
            description: 'Create, protect, and review audit logs. Ensure actions can be traced to individual users. Alert on audit failures.',
            topPractices: ['3.3.1 — System Auditing', '3.3.2 — User Accountability', '3.3.5 — Audit Review & Analysis', '3.3.8 — Audit Protection'],
            allControls: [
                { id: '3.3.1', name: 'System Auditing', l1: false },
                { id: '3.3.2', name: 'User Accountability', l1: false },
                { id: '3.3.3', name: 'Event Review', l1: false },
                { id: '3.3.4', name: 'Audit Failure Alerting', l1: false },
                { id: '3.3.5', name: 'Audit Review & Analysis', l1: false },
                { id: '3.3.6', name: 'Audit Reduction & Reporting', l1: false },
                { id: '3.3.7', name: 'Authoritative Time Source', l1: false },
                { id: '3.3.8', name: 'Audit Protection', l1: false },
                { id: '3.3.9', name: 'Audit Management Restriction', l1: false }
            ]
        },
        {
            id: 'CM', name: 'Configuration Management', practiceCount: 9, objectiveCount: 44,
            description: 'Establish and maintain baseline configurations. Control changes, restrict unnecessary software, and enforce security settings.',
            topPractices: ['3.4.1 — Baseline Configurations', '3.4.2 — Security Config Settings', '3.4.5 — Access Restrictions for Change', '3.4.6 — Least Functionality'],
            allControls: [
                { id: '3.4.1', name: 'Baseline Configurations', l1: false },
                { id: '3.4.2', name: 'Security Configuration Settings', l1: false },
                { id: '3.4.3', name: 'System Change Management', l1: false },
                { id: '3.4.4', name: 'Impact Analysis', l1: false },
                { id: '3.4.5', name: 'Access Restrictions for Change', l1: false },
                { id: '3.4.6', name: 'Least Functionality', l1: false },
                { id: '3.4.7', name: 'Nonessential Software Restriction', l1: false },
                { id: '3.4.8', name: 'Application Execution Policy', l1: false },
                { id: '3.4.9', name: 'User-Installed Software', l1: false }
            ]
        },
        {
            id: 'IA', name: 'Identification & Authentication', practiceCount: 11, objectiveCount: 25,
            description: 'Identify and authenticate users, devices, and processes. Enforce password complexity, multi-factor authentication, and replay-resistant mechanisms.',
            topPractices: ['3.5.1 — User Identification', '3.5.2 — Device Authentication', '3.5.3 — Multi-Factor Authentication', '3.5.10 — Cryptographic Authentication'],
            allControls: [
                { id: '3.5.1', name: 'User Identification', l1: true },
                { id: '3.5.2', name: 'Device & Process Authentication', l1: true },
                { id: '3.5.3', name: 'Multi-Factor Authentication', l1: false },
                { id: '3.5.4', name: 'Replay-Resistant Authentication', l1: false },
                { id: '3.5.5', name: 'Identifier Reuse Prevention', l1: false },
                { id: '3.5.6', name: 'Identifier Disabling', l1: false },
                { id: '3.5.7', name: 'Password Complexity', l1: false },
                { id: '3.5.8', name: 'Password Reuse Limitation', l1: false },
                { id: '3.5.9', name: 'Temporary Password Use', l1: false },
                { id: '3.5.10', name: 'Cryptographic Authentication', l1: false },
                { id: '3.5.11', name: 'Obscured Authentication Feedback', l1: false }
            ]
        },
        {
            id: 'IR', name: 'Incident Response', practiceCount: 3, objectiveCount: 14,
            description: 'Establish incident handling capabilities. Detect, report, and respond to security incidents. Test incident response plans.',
            topPractices: ['3.6.1 — Incident Handling', '3.6.2 — Incident Tracking & Reporting', '3.6.3 — Incident Response Testing'],
            allControls: [
                { id: '3.6.1', name: 'Incident Handling', l1: false },
                { id: '3.6.2', name: 'Incident Tracking & Reporting', l1: false },
                { id: '3.6.3', name: 'Incident Response Testing', l1: false }
            ]
        },
        {
            id: 'MA', name: 'Maintenance', practiceCount: 6, objectiveCount: 10,
            description: 'Perform timely maintenance. Control maintenance tools and personnel. Sanitize equipment removed for off-site maintenance.',
            topPractices: ['3.7.1 — System Maintenance', '3.7.2 — Maintenance Controls', '3.7.5 — Nonlocal Maintenance'],
            allControls: [
                { id: '3.7.1', name: 'System Maintenance', l1: false },
                { id: '3.7.2', name: 'System Maintenance Controls', l1: false },
                { id: '3.7.3', name: 'Equipment Sanitization', l1: false },
                { id: '3.7.4', name: 'Media Inspection', l1: false },
                { id: '3.7.5', name: 'Nonlocal Maintenance Authentication', l1: false },
                { id: '3.7.6', name: 'Maintenance Personnel Supervision', l1: false }
            ]
        },
        {
            id: 'MP', name: 'Media Protection', practiceCount: 9, objectiveCount: 15,
            description: 'Protect, control, sanitize, and destroy media containing CUI. Mark media with CUI designations.',
            topPractices: ['3.8.1 — Media Protection', '3.8.3 — Media Sanitization', '3.8.6 — Portable Storage Encryption', '3.8.9 — Backup CUI Protection'],
            allControls: [
                { id: '3.8.1', name: 'Media Protection', l1: true },
                { id: '3.8.2', name: 'Media Access Limitation', l1: false },
                { id: '3.8.3', name: 'Media Sanitization', l1: true },
                { id: '3.8.4', name: 'Media Marking', l1: false },
                { id: '3.8.5', name: 'Media Accountability', l1: false },
                { id: '3.8.6', name: 'Portable Storage Encryption', l1: false },
                { id: '3.8.7', name: 'Removable Media Use', l1: false },
                { id: '3.8.8', name: 'Shared Media Prohibition', l1: false },
                { id: '3.8.9', name: 'Backup Storage Protection', l1: false }
            ]
        },
        {
            id: 'PS', name: 'Personnel Security', practiceCount: 2, objectiveCount: 4,
            description: 'Screen individuals before granting access. Protect CUI during personnel actions like termination or transfer.',
            topPractices: ['3.9.1 — Personnel Screening', '3.9.2 — Personnel Actions'],
            allControls: [
                { id: '3.9.1', name: 'Personnel Screening', l1: false },
                { id: '3.9.2', name: 'Personnel Actions', l1: false }
            ]
        },
        {
            id: 'PE', name: 'Physical Protection', practiceCount: 6, objectiveCount: 16,
            description: 'Limit physical access to systems and facilities. Escort visitors, maintain audit logs of physical access, control physical access devices.',
            topPractices: ['3.10.1 — Physical Access Authorizations', '3.10.2 — Physical Access Control', '3.10.5 — Physical Access Monitoring'],
            allControls: [
                { id: '3.10.1', name: 'Physical Access Authorizations', l1: true },
                { id: '3.10.2', name: 'Physical Access Controls', l1: false },
                { id: '3.10.3', name: 'Visitor Management', l1: true },
                { id: '3.10.4', name: 'Physical Access Logs', l1: false },
                { id: '3.10.5', name: 'Physical Access Devices', l1: true },
                { id: '3.10.6', name: 'Alternate Work Sites', l1: false }
            ]
        },
        {
            id: 'RA', name: 'Risk Assessment', practiceCount: 3, objectiveCount: 9,
            description: 'Assess risk to operations, assets, and individuals. Scan for vulnerabilities and remediate them.',
            topPractices: ['3.11.1 — Risk Assessments', '3.11.2 — Vulnerability Scanning', '3.11.3 — Vulnerability Remediation'],
            allControls: [
                { id: '3.11.1', name: 'Risk Assessment', l1: false },
                { id: '3.11.2', name: 'Vulnerability Scanning', l1: false },
                { id: '3.11.3', name: 'Vulnerability Remediation', l1: false }
            ]
        },
        {
            id: 'CA', name: 'Security Assessment', practiceCount: 4, objectiveCount: 14,
            description: 'Assess security controls periodically. Develop and implement plans of action. Monitor controls on an ongoing basis.',
            topPractices: ['3.12.1 — Security Assessments', '3.12.2 — Plans of Action', '3.12.3 — Continuous Monitoring', '3.12.4 — System Security Plans'],
            allControls: [
                { id: '3.12.1', name: 'Security Control Assessment', l1: false },
                { id: '3.12.2', name: 'Plan of Action', l1: false },
                { id: '3.12.3', name: 'Continuous Monitoring', l1: false },
                { id: '3.12.4', name: 'System Security Plan', l1: false }
            ]
        },
        {
            id: 'SC', name: 'System & Comm. Protection', practiceCount: 16, objectiveCount: 41,
            description: 'Monitor and protect communications at system boundaries. Implement cryptographic protections, network segmentation, and CUI confidentiality.',
            topPractices: ['3.13.1 — Boundary Protection', '3.13.2 — Architectural Designs', '3.13.8 — CUI in Transit Encryption', '3.13.11 — FIPS-Validated Cryptography'],
            allControls: [
                { id: '3.13.1', name: 'Boundary Protection', l1: true },
                { id: '3.13.2', name: 'Security Function Isolation', l1: false },
                { id: '3.13.3', name: 'User/System Functionality Separation', l1: false },
                { id: '3.13.4', name: 'Shared Resource Control', l1: false },
                { id: '3.13.5', name: 'Publicly Accessible Subnetworks', l1: false },
                { id: '3.13.6', name: 'Network Communication by Exception', l1: false },
                { id: '3.13.7', name: 'Split Tunneling Prevention', l1: false },
                { id: '3.13.8', name: 'Data in Transit Encryption', l1: false },
                { id: '3.13.9', name: 'Network Connection Termination', l1: false },
                { id: '3.13.10', name: 'Cryptographic Key Management', l1: false },
                { id: '3.13.11', name: 'FIPS-Validated Cryptography', l1: false },
                { id: '3.13.12', name: 'Collaborative Device Control', l1: false },
                { id: '3.13.13', name: 'Mobile Code Control', l1: false },
                { id: '3.13.14', name: 'Voice over Internet Protocol', l1: false },
                { id: '3.13.15', name: 'Communications Authenticity', l1: false },
                { id: '3.13.16', name: 'Data at Rest Encryption', l1: false }
            ]
        },
        {
            id: 'SI', name: 'System & Info. Integrity', practiceCount: 7, objectiveCount: 20,
            description: 'Identify and correct system flaws. Protect against malicious code. Monitor system security alerts and advisories.',
            topPractices: ['3.14.1 — Flaw Remediation', '3.14.2 — Malicious Code Protection', '3.14.6 — Monitor Communications', '3.14.7 — Detect Unauthorized Use'],
            allControls: [
                { id: '3.14.1', name: 'Flaw Remediation', l1: true },
                { id: '3.14.2', name: 'Malicious Code Protection', l1: true },
                { id: '3.14.3', name: 'Security Alerts and Advisories', l1: false },
                { id: '3.14.4', name: 'Malicious Code Updates', l1: true },
                { id: '3.14.5', name: 'System and File Scanning', l1: true },
                { id: '3.14.6', name: 'Inbound and Outbound Traffic Monitoring', l1: false },
                { id: '3.14.7', name: 'Unauthorized Use Detection', l1: false }
            ]
        }
    ],

    // ═══════════════════════════════════════════════════════════════
    //  PART 5b: CMMC LEVEL 1 OVERVIEW
    //  17 practices from FAR 52.204-21 — self-assessment only
    // ═══════════════════════════════════════════════════════════════
    l1Overview: {
        title: 'CMMC Level 1 — Foundational (FCI Protection)',
        sections: [
            {
                id: 'l1-purpose',
                title: 'Level 1 Purpose',
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
                content: 'CMMC Level 1 protects Federal Contract Information (FCI) — information not intended for public release that is provided by or generated for the Government under contract. Level 1 requires implementation of 17 basic safeguarding practices derived from FAR 52.204-21.',
                keyPoints: [
                    '17 practices across 6 control families (AC, IA, MP, PE, SC, SI)',
                    'Self-assessment only — no third-party certification required',
                    'Results submitted to SPRS annually',
                    'Applies to all DoD contractors handling FCI',
                    'Practices are a subset of the 110 Level 2 requirements'
                ]
            },
            {
                id: 'l1-vs-l2',
                title: 'Level 1 vs. Level 2',
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
                content: 'Level 1 and Level 2 differ in scope, rigor, and the type of information they protect. Understanding the distinction is critical for determining which level applies to your contracts.',
                keyPoints: [
                    'Level 1: Protects FCI (17 practices, self-assessment, annual)',
                    'Level 2: Protects CUI (110 practices, self or C3PAO assessment, triennial)',
                    'All 17 Level 1 practices are included in Level 2',
                    'Level 1 has no POA&M provisions — all 17 must be MET',
                    'Level 1 does not require an SSP (though documentation is recommended)',
                    'The contract specifies which level is required via DFARS 252.204-7021'
                ]
            },
            {
                id: 'l1-families',
                title: 'Level 1 Control Families',
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
                content: 'Level 1 practices span 6 of the 14 NIST SP 800-171 control families. The remaining 8 families (AT, AU, CM, IR, MA, PS, RA, CA) are only required at Level 2.',
                keyPoints: [
                    'AC — Access Control: 3.1.1, 3.1.2, 3.1.22 (3 practices)',
                    'IA — Identification & Authentication: 3.5.1, 3.5.2 (2 practices)',
                    'MP — Media Protection: 3.8.1, 3.8.3 (2 practices)',
                    'PE — Physical Protection: 3.10.1, 3.10.3, 3.10.5 (3 practices)',
                    'SC — System & Communications Protection: 3.13.1 (1 practice)',
                    'SI — System & Information Integrity: 3.14.1, 3.14.2, 3.14.4, 3.14.5 (4 practices)'
                ]
            }
        ]
    },

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
