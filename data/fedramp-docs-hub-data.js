// FedRAMP Documentation Hub — Curated catalog of FedRAMP templates, baselines,
// guidance, 20x docs, and resources.  Sourced from fedramp.gov and
// GSA/fedramp-automation GitHub.

const FEDRAMP_DOCS_HUB_DATA = {

    // =========================================================================
    // Templates & Deliverables
    // =========================================================================
    templates: [
        {
            id: 'tpl-ssp',
            title: 'System Security Plan (SSP)',
            description: 'Core deliverable documenting system security controls, architecture, and authorization boundary.',
            format: 'DOCX',
            category: 'core',
            baseline: 'all',
            downloadUrl: 'https://www.fedramp.gov/resources/templates/FedRAMP-High-Moderate-Low-LI-SaaS-Baseline-System-Security-Plan-(SSP).docx',
            oscalUrl: 'https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/templates/ssp/json/FedRAMP-SSP-OSCAL-Template.json',
            oscalFormats: ['json', 'xml'],
            tags: ['required', 'authorization']
        },
        {
            id: 'tpl-sap',
            title: 'Security Assessment Plan (SAP)',
            description: 'Template for 3PAO security assessment planning, test procedures, and scope.',
            format: 'DOCX',
            category: 'core',
            baseline: 'all',
            downloadUrl: 'https://www.fedramp.gov/resources/templates/FedRAMP-Security-Assessment-Plan-(SAP)-Template.docx',
            oscalUrl: 'https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/templates/sap/json/FedRAMP-SAP-OSCAL-Template.json',
            oscalFormats: ['json', 'xml'],
            tags: ['required', 'assessment']
        },
        {
            id: 'tpl-sar',
            title: 'Security Assessment Report (SAR)',
            description: 'Template for documenting 3PAO assessment findings, risk ratings, and recommendations.',
            format: 'DOCX',
            category: 'core',
            baseline: 'all',
            downloadUrl: 'https://www.fedramp.gov/resources/templates/FedRAMP-Security-Assessment-Report-(SAR)-Template.docx',
            oscalUrl: 'https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/templates/sar/json/FedRAMP-SAR-OSCAL-Template.json',
            oscalFormats: ['json', 'xml'],
            tags: ['required', 'assessment']
        },
        {
            id: 'tpl-poam',
            title: 'Plan of Action & Milestones (POA&M)',
            description: 'Tracks identified vulnerabilities, remediation plans, milestones, and closure evidence.',
            format: 'XLSX',
            category: 'core',
            baseline: 'all',
            downloadUrl: 'https://www.fedramp.gov/resources/templates/FedRAMP-POAM-Template.xlsx',
            oscalUrl: 'https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/templates/poam/json/FedRAMP-POAM-OSCAL-Template.json',
            oscalFormats: ['json', 'xml'],
            tags: ['required', 'conmon']
        },
        {
            id: 'tpl-cis',
            title: 'Control Implementation Summary (CIS)',
            description: 'Workbook summarizing control implementation status, responsible roles, and implementation details.',
            format: 'XLSX',
            category: 'core',
            baseline: 'all',
            downloadUrl: 'https://www.fedramp.gov/resources/templates/SSP-Appendix-J-CSO-CIS-and-CRM-Workbook.xlsx',
            tags: ['required', 'authorization']
        },
        {
            id: 'tpl-ato-letter',
            title: 'ATO Letter Template',
            description: 'Template for the Agency Authorization to Operate letter.',
            format: 'DOCX',
            category: 'authorization',
            baseline: 'all',
            downloadUrl: 'https://www.fedramp.gov/resources/templates/FedRAMP-ATO-Letter-Template.docx',
            tags: ['authorization']
        },
        {
            id: 'tpl-baseline-controls',
            title: 'FedRAMP Security Controls Baseline',
            description: 'Catalog of FedRAMP High, Moderate, Low, and LI-SaaS baseline security controls with guidance.',
            format: 'XLSX',
            category: 'core',
            baseline: 'all',
            downloadUrl: 'https://www.fedramp.gov/resources/documents/FedRAMP_Security_Controls_Baseline.xlsx',
            tags: ['required', 'baseline', 'controls']
        },
        {
            id: 'tpl-boundary',
            title: 'Authorization Boundary Diagram Template',
            description: 'Guidance and template for documenting the system authorization boundary.',
            format: 'DOCX',
            category: 'boundary',
            baseline: 'all',
            downloadUrl: 'https://www.fedramp.gov/resources/documents/CSP_A_FedRAMP_Authorization_Boundary_Guidance.pdf',
            tags: ['boundary', 'diagrams']
        },
        {
            id: 'tpl-conmon-exec',
            title: 'Continuous Monitoring Monthly Executive Summary',
            description: 'Provides FedRAMP and agency AOs with an executive summary of monthly continuous monitoring submissions.',
            format: 'XLSX',
            category: 'conmon',
            baseline: 'all',
            downloadUrl: 'https://www.fedramp.gov/resources/templates/FedRAMP-Continuous-Monitoring-Monthly-Executive-Summary-Template.xlsx',
            tags: ['conmon', 'monthly']
        },
        {
            id: 'tpl-vdr',
            title: 'Vulnerability Deviation Request Form',
            description: 'Standardized method to document deviation requests, risk adjustments, false positives, and operational requirements.',
            format: 'XLSX',
            category: 'conmon',
            baseline: 'all',
            downloadUrl: 'https://www.fedramp.gov/resources/templates/FedRAMP-Vulnerability-Deviation-Request-Form.xlsx',
            tags: ['conmon', 'vulnerability']
        },
        {
            id: 'tpl-conmon',
            title: 'Continuous Monitoring Monthly Deliverables',
            description: 'Monthly POA&M, scan results, and deviation request templates for ConMon.',
            format: 'XLSX',
            category: 'conmon',
            baseline: 'all',
            downloadUrl: 'https://www.fedramp.gov/resources/templates/FedRAMP-Continuous-Monitoring-Deliverables-Template.xlsx',
            tags: ['conmon', 'monthly']
        },
        {
            id: 'tpl-readiness',
            title: 'Readiness Assessment Report (RAR)',
            description: 'Template for 3PAO readiness assessment prior to full authorization.',
            format: 'DOCX',
            category: 'authorization',
            baseline: 'all',
            downloadUrl: 'https://www.fedramp.gov/resources/templates/FedRAMP-Moderate-Readiness-Assessment-Report-(RAR)-Template.docx',
            tags: ['authorization', 'readiness']
        }
    ],

    // =========================================================================
    // FedRAMP Baselines (OSCAL profiles from GSA/fedramp-automation)
    // =========================================================================
    baselines: [
        {
            id: 'bl-low',
            title: 'FedRAMP Low Baseline',
            description: 'Minimum security controls for low-impact cloud systems. Suitable for publicly available data.',
            impact: 'Low',
            controlCount: 156,
            color: '#98c379',
            oscalProfileUrl: 'https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/baselines/json/FedRAMP_rev5_LOW-baseline_profile.json',
            oscalResolvedUrl: 'https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/baselines/json/FedRAMP_rev5_LOW-baseline-resolved-profile_catalog.json',
            oscalFormats: ['json', 'xml'],
            nistSource: 'NIST SP 800-53 Rev 5'
        },
        {
            id: 'bl-moderate',
            title: 'FedRAMP Moderate Baseline',
            description: 'Controls for moderate-impact systems processing CUI. Most common FedRAMP authorization level.',
            impact: 'Moderate',
            controlCount: 325,
            color: '#e5c07b',
            oscalProfileUrl: 'https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/baselines/json/FedRAMP_rev5_MODERATE-baseline_profile.json',
            oscalResolvedUrl: 'https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/baselines/json/FedRAMP_rev5_MODERATE-baseline-resolved-profile_catalog.json',
            oscalFormats: ['json', 'xml'],
            nistSource: 'NIST SP 800-53 Rev 5'
        },
        {
            id: 'bl-high',
            title: 'FedRAMP High Baseline',
            description: 'Maximum security controls for high-impact systems. Required for law enforcement, healthcare, financial data.',
            impact: 'High',
            controlCount: 421,
            color: '#e06c75',
            oscalProfileUrl: 'https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/baselines/json/FedRAMP_rev5_HIGH-baseline_profile.json',
            oscalResolvedUrl: 'https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/baselines/json/FedRAMP_rev5_HIGH-baseline-resolved-profile_catalog.json',
            oscalFormats: ['json', 'xml'],
            nistSource: 'NIST SP 800-53 Rev 5'
        },
        {
            id: 'bl-li-saas',
            title: 'FedRAMP LI-SaaS Baseline',
            description: 'Tailored low-impact baseline for SaaS applications that do not store PII.',
            impact: 'LI-SaaS',
            controlCount: 128,
            color: '#56b6c2',
            oscalProfileUrl: 'https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/baselines/json/FedRAMP_rev5_LI-SaaS-baseline_profile.json',
            oscalFormats: ['json', 'xml'],
            nistSource: 'NIST SP 800-53 Rev 5'
        }
    ],

    // =========================================================================
    // 800-53 Rev 5 Control Families
    // =========================================================================
    controlFamilies: [
        { id: 'AC', name: 'Access Control', controlCount: 25, description: 'Policies and mechanisms for controlling access to information systems and data.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=AC' },
        { id: 'AT', name: 'Awareness and Training', controlCount: 6, description: 'Security awareness training and role-based training requirements.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=AT' },
        { id: 'AU', name: 'Audit and Accountability', controlCount: 16, description: 'Audit logging, monitoring, and accountability mechanisms.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=AU' },
        { id: 'CA', name: 'Assessment, Authorization, and Monitoring', controlCount: 9, description: 'Security assessment, authorization decisions, and continuous monitoring.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=CA' },
        { id: 'CM', name: 'Configuration Management', controlCount: 14, description: 'Baseline configurations, change control, and least functionality.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=CM' },
        { id: 'CP', name: 'Contingency Planning', controlCount: 13, description: 'Business continuity, disaster recovery, and backup procedures.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=CP' },
        { id: 'IA', name: 'Identification and Authentication', controlCount: 12, description: 'User identification, authentication, and credential management.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=IA' },
        { id: 'IR', name: 'Incident Response', controlCount: 10, description: 'Incident detection, reporting, response, and recovery.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=IR' },
        { id: 'MA', name: 'Maintenance', controlCount: 6, description: 'System maintenance, remote maintenance, and maintenance tools.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=MA' },
        { id: 'MP', name: 'Media Protection', controlCount: 8, description: 'Media access, marking, storage, transport, and sanitization.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=MP' },
        { id: 'PE', name: 'Physical and Environmental Protection', controlCount: 20, description: 'Physical access, monitoring, and environmental controls.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=PE' },
        { id: 'PL', name: 'Planning', controlCount: 11, description: 'Security planning, rules of behavior, and information architecture.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=PL' },
        { id: 'PM', name: 'Program Management', controlCount: 16, description: 'Information security program plan and enterprise architecture.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=PM' },
        { id: 'PS', name: 'Personnel Security', controlCount: 9, description: 'Personnel screening, termination, transfer, and access agreements.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=PS' },
        { id: 'PT', name: 'PII Processing and Transparency', controlCount: 8, description: 'Privacy impact assessments and PII processing controls.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=PT' },
        { id: 'RA', name: 'Risk Assessment', controlCount: 10, description: 'Risk assessments, vulnerability scanning, and threat analysis.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=RA' },
        { id: 'SA', name: 'System and Services Acquisition', controlCount: 22, description: 'System development lifecycle, supply chain, and acquisitions.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=SA' },
        { id: 'SC', name: 'System and Communications Protection', controlCount: 44, description: 'Boundary protection, cryptography, and communications security.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=SC' },
        { id: 'SI', name: 'System and Information Integrity', controlCount: 20, description: 'Flaw remediation, malicious code protection, and monitoring.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=SI' },
        { id: 'SR', name: 'Supply Chain Risk Management', controlCount: 12, description: 'Supply chain risk management plan, processes, and controls.', nistUrl: 'https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=SR' }
    ],

    // =========================================================================
    // FedRAMP 20x Documentation
    // =========================================================================
    twentyXDocs: [
        {
            id: '20x-overview',
            title: 'FedRAMP 20x Program Overview',
            description: 'Official overview of the FedRAMP 20x modernization initiative with 5-phase delivery timeline. Currently in Phase 2 (FY26 Q1-Q2).',
            category: 'overview',
            url: 'https://www.fedramp.gov/20x/',
            tags: ['20x', 'overview', 'phases']
        },
        {
            id: '20x-phase2',
            title: 'Phase 2 Pilot — Moderate Impact',
            description: 'Phase 2 pilot details, milestones, and participation criteria. ~13 cloud services selected for Moderate pilot authorizations with new KSI-AFR requirements.',
            category: 'overview',
            url: 'https://www.fedramp.gov/20x/phase-two/',
            tags: ['20x', 'phase-2', 'pilot', 'moderate']
        },
        {
            id: '20x-phase2-participants',
            title: 'Phase 2 Pilot Participants',
            description: 'Official list of 13 Phase 2 pilot participants including Confluent, Paramify, Vanta, Secureframe, and others.',
            category: 'overview',
            url: 'https://www.fedramp.gov/20x/phase-two/participate/',
            tags: ['20x', 'phase-2', 'participants']
        },
        {
            id: '20x-ksi-requirements',
            title: 'Key Security Indicators (Phase 2)',
            description: 'Official KSI requirements and recommendations for 20x. 11 themes including the new "Authorization by FedRAMP" (KSI-AFR) with government-specific requirements.',
            category: 'requirements',
            url: 'https://www.fedramp.gov/docs/20x/key-security-indicators/',
            inAppView: 'fedramp-reference',
            tags: ['20x', 'ksi', 'requirements', 'phase-2']
        },
        {
            id: '20x-ksi-phase1-archive',
            title: 'Phase 1 KSI Archive (Reference Only)',
            description: 'Archived Phase 1 pilot KSI documentation. Phase 1 ended Sep 2026; participants have 12 months to adopt Phase 2 standards.',
            category: 'framework',
            url: 'https://www.fedramp.gov/docs/20x/phase1/key-security-indicators/',
            tags: ['20x', 'ksi', 'phase-1', 'archive']
        },
        {
            id: '20x-definitions',
            title: 'FedRAMP 20x Definitions',
            description: 'Official glossary of FedRAMP 20x terminology, concepts, and definitions used throughout KSI documentation.',
            category: 'framework',
            url: 'https://www.fedramp.gov/docs/20x/fedramp-definitions/',
            tags: ['20x', 'definitions', 'glossary']
        },
        {
            id: '20x-rfcs',
            title: 'FedRAMP RFCs (Public Comment)',
            description: 'Active and closed Requests for Comment on FedRAMP policy — machine-readable packages (RFC-0024), external frameworks (RFC-0022), marketplace expansion, and more.',
            category: 'requirements',
            url: 'https://www.fedramp.gov/rfcs/',
            tags: ['20x', 'rfc', 'policy']
        },
        {
            id: '20x-community',
            title: 'FedRAMP Community Working Group',
            description: 'GitHub Discussions forum with 20x Community Working Group, Q&A, RFC discussions, and monthly webinars.',
            category: 'overview',
            url: 'https://github.com/FedRAMP/community/discussions',
            tags: ['20x', 'community', 'discussions']
        },
        {
            id: '20x-roadmap',
            title: 'FedRAMP Public Roadmap',
            description: 'Bi-weekly updated roadmap tracking all FedRAMP delivery activities. Includes active, planned, and delivered work items.',
            category: 'overview',
            url: 'https://github.com/FedRAMP/roadmap',
            tags: ['20x', 'roadmap', 'progress']
        },
        {
            id: '20x-oscal-automation',
            title: 'OSCAL Content & Automation (GSA GitHub)',
            description: 'Official GSA repository with OSCAL content, ASAP validation rules, baselines, and automation tooling for FedRAMP Rev 5.',
            category: 'requirements',
            url: 'https://github.com/GSA/fedramp-automation',
            tags: ['20x', 'oscal', 'automation']
        },
        {
            id: '20x-csp-playbook',
            title: 'CSP Authorization Playbook',
            description: 'Official FedRAMP playbook covering authorization strategies, partner roles, and offering considerations.',
            category: 'guidance',
            url: 'https://www.fedramp.gov/docs/rev5/playbook/csp/authorization/getting-started',
            tags: ['20x', 'csp', 'authorization']
        },
        {
            id: '20x-conmon-playbook',
            title: 'Continuous Monitoring Playbook',
            description: 'Overview of FedRAMP Rev 5 continuous monitoring requirements, activities, and best practices.',
            category: 'guidance',
            url: 'https://www.fedramp.gov/docs/rev5/playbook/csp/continuous-monitoring/intro',
            tags: ['20x', 'conmon', 'playbook']
        },
        {
            id: '20x-agency-playbook',
            title: 'Agency Authorization Playbook',
            description: 'Best practices and step-by-step guidance for agencies seeking FedRAMP authorization.',
            category: 'guidance',
            url: 'https://www.fedramp.gov/docs/rev5/playbook/agency/authorization/',
            tags: ['20x', 'agency', 'authorization']
        },
        {
            id: '20x-marketplace',
            title: 'FedRAMP Marketplace — 20x CSOs',
            description: 'Browse authorized Cloud Service Offerings in the FedRAMP Marketplace, including 20x Phase 2 pilot participants.',
            category: 'overview',
            url: 'https://marketplace.fedramp.gov/',
            inAppView: 'fedramp-explorer',
            tags: ['20x', 'marketplace', 'cso']
        }
    ],

    // =========================================================================
    // KSI Family Summary (for quick reference cards)
    // =========================================================================
    ksiFamilies: [
        { id: 'AFR', name: 'Authorization by FedRAMP', ksiCount: 5, description: 'Government-specific requirements for maintaining a secure system and reporting on activities to government customers. New in Phase 2.', url: 'https://www.fedramp.gov/docs/20x/key-security-indicators/authorization-by-fedramp/' },
        { id: 'CED', name: 'Cybersecurity Education', ksiCount: 4, description: 'Educating employees on cybersecurity measures and persistently testing their knowledge.', url: 'https://www.fedramp.gov/docs/20x/key-security-indicators/cybersecurity-education/' },
        { id: 'CMT', name: 'Change Management', ksiCount: 7, description: 'Ensuring all changes are properly documented and configuration baselines are updated accordingly.', url: 'https://www.fedramp.gov/docs/20x/key-security-indicators/change-management/' },
        { id: 'CNA', name: 'Cloud Native Architecture', ksiCount: 5, description: 'Using cloud native architecture and design principles to enforce and enhance confidentiality, integrity, and availability.', url: 'https://www.fedramp.gov/docs/20x/key-security-indicators/cloud-native-architecture/' },
        { id: 'IAM', name: 'Identity and Access Management', ksiCount: 8, description: 'Protecting user data, controlling access, and applying zero trust principles.', url: 'https://www.fedramp.gov/docs/20x/key-security-indicators/identity-and-access-management/' },
        { id: 'INR', name: 'Incident Response', ksiCount: 6, description: 'Documenting, reporting, and analyzing security incidents for regulatory compliance and continuous improvement.', url: 'https://www.fedramp.gov/docs/20x/key-security-indicators/incident-response/' },
        { id: 'MLA', name: 'Monitoring, Logging, and Auditing', ksiCount: 9, description: 'Monitoring, logging, and auditing all important events, activity, and changes.', url: 'https://www.fedramp.gov/docs/20x/key-security-indicators/monitoring-logging-and-auditing/' },
        { id: 'PIY', name: 'Policy and Inventory', ksiCount: 4, description: 'Intentional, organized, universal guidance for how every information resource, including personnel, is secured.', url: 'https://www.fedramp.gov/docs/20x/key-security-indicators/policy-and-inventory/' },
        { id: 'RPL', name: 'Recovery Planning', ksiCount: 6, description: 'Defining, maintaining, and testing incident response plans and recovery capabilities for minimal service disruption.', url: 'https://www.fedramp.gov/docs/20x/key-security-indicators/recovery-planning/' },
        { id: 'SVC', name: 'Service Configuration', ksiCount: 5, description: 'Following FedRAMP encryption policies, continuously verifying integrity, and restricting access to third-party resources.', url: 'https://www.fedramp.gov/docs/20x/key-security-indicators/service-configuration/' },
        { id: 'TPR', name: 'Supply Chain Risk', ksiCount: 4, description: 'Understanding, monitoring, and managing supply chain risks from third-party information resources.', url: 'https://www.fedramp.gov/docs/20x/key-security-indicators/supply-chain-risk/' }
    ],

    // =========================================================================
    // Guidance & Policy Documents
    // =========================================================================
    guidance: [
        {
            id: 'guid-boundary',
            title: 'Authorization Boundary Guidance',
            description: 'How to define, document, and maintain the authorization boundary for cloud services.',
            category: 'boundary',
            url: 'https://www.fedramp.gov/resources/documents/CSP_A_FedRAMP_Authorization_Boundary_Guidance.pdf',
            format: 'PDF'
        },
        {
            id: 'guid-conmon',
            title: 'Continuous Monitoring Playbook',
            description: 'Official FedRAMP playbook for continuous monitoring requirements, activities, and best practices.',
            category: 'conmon',
            url: 'https://www.fedramp.gov/docs/rev5/playbook/csp/continuous-monitoring/intro',
            format: 'Web'
        },
        {
            id: 'guid-docs-templates',
            title: 'FedRAMP Documents & Templates Portal',
            description: 'Official FedRAMP Rev 5 documents and templates portal with all 39 downloadable resources.',
            category: 'process',
            url: 'https://www.fedramp.gov/rev5/documents-templates/',
            format: 'Web'
        },
        {
            id: 'guid-evidence',
            title: 'Evidence Suggestions for FedRAMP Controls',
            description: 'Suggested evidence artifacts for demonstrating control implementation.',
            category: 'evidence',
            url: 'https://www.fedramp.gov/assets/resources/documents/FedRAMP_General_Document_Acceptance_Criteria.pdf',
            format: 'PDF'
        },
        {
            id: 'guid-timeliness',
            title: 'Timeliness and Accuracy of Testing Requirements',
            description: 'Describes timeliness and accuracy of testing requirements for CSPs seeking FedRAMP authorization.',
            category: 'process',
            url: 'https://www.fedramp.gov/resources/documents/CSP_Timeliness_and_Accuracy_of_Testing_Requirements.pdf',
            format: 'PDF'
        },
        {
            id: 'guid-marketplace',
            title: 'FedRAMP Marketplace Guide',
            description: 'How to navigate the FedRAMP Marketplace and find authorized CSOs.',
            category: 'marketplace',
            url: 'https://marketplace.fedramp.gov/',
            format: 'Web',
            inAppView: 'fedramp-explorer'
        },
        {
            id: 'guid-crypto-policy',
            title: 'Cryptographic Module Selection Policy',
            description: 'Requirements and recommendations for CSPs, 3PAOs, and reviewers regarding cryptographic module selection.',
            category: 'process',
            url: 'https://www.fedramp.gov/resources/documents/FedRAMP_Policy_for_Cryptographic_Module_Selection_v1.1.0.pdf',
            format: 'PDF'
        },
        {
            id: 'guid-3pao-obligations',
            title: '3PAO Obligations and Performance Guide',
            description: 'Guidance for 3PAOs on quality, independence, personnel, and FedRAMP knowledge standards.',
            category: 'assessment',
            url: 'https://www.fedramp.gov/resources/documents/3PAO_Obligations_and_Performance_Standards.pdf',
            format: 'PDF'
        },
        {
            id: 'guid-penetration-testing',
            title: 'Penetration Test Guidance',
            description: 'Requirements and methodology for penetration testing of FedRAMP systems.',
            category: 'assessment',
            url: 'https://www.fedramp.gov/resources/documents/CSP_Penetration_Test_Guidance.pdf',
            format: 'PDF'
        },
        {
            id: 'guid-vulnerability-scanning',
            title: 'Vulnerability Scanning Requirements',
            description: 'Scanning frequency, tool requirements, and reporting for FedRAMP ConMon.',
            category: 'conmon',
            url: 'https://www.fedramp.gov/assets/resources/documents/CSP_Vulnerability_Scanning_Requirements.pdf',
            format: 'PDF'
        }
    ],

    // =========================================================================
    // Tools & Resources
    // =========================================================================
    tools: [
        {
            id: 'tool-gsa-github',
            title: 'GSA FedRAMP Automation GitHub',
            description: 'Official GSA repository with OSCAL content, validation rules, baselines, and automation tools.',
            url: 'https://github.com/GSA/fedramp-automation',
            icon: 'github',
            category: 'repository'
        },
        {
            id: 'tool-asap-validator',
            title: 'FedRAMP ASAP Validation Rules',
            description: 'In-browser OSCAL document validator and browsable validation rules documentation. Replaces the deprecated src/validations path.',
            url: 'https://federalist-b6c4d61f-facd-4833-a4a9-554523a87147.sites.pages.cloud.gov/site/gsa/fedramp-automation/',
            icon: 'terminal',
            category: 'tools'
        },
        {
            id: 'tool-oscal-viewer',
            title: 'NIST OSCAL Tools & Resources',
            description: 'Official NIST OSCAL tools including converters, validators, and reference documentation.',
            url: 'https://pages.nist.gov/OSCAL/tools/',
            icon: 'eye',
            category: 'tools'
        },
        {
            id: 'tool-community',
            title: 'FedRAMP Community Discussions',
            description: 'Official GitHub Discussions forum for FedRAMP community — 20x working group, RFCs, Q&A, and policy discussions.',
            url: 'https://github.com/FedRAMP/community/discussions',
            icon: 'github',
            category: 'repository'
        },
        {
            id: 'tool-roadmap',
            title: 'FedRAMP Public Roadmap',
            description: 'Bi-weekly updated public roadmap tracking planned, in-progress, and delivered FedRAMP activities. Last update: Sprint 18.',
            url: 'https://github.com/FedRAMP/roadmap',
            icon: 'compass',
            category: 'repository'
        },
        {
            id: 'tool-rfcs',
            title: 'FedRAMP RFCs (Requests for Comment)',
            description: 'Public RFCs on FedRAMP policy changes — machine-readable packages, external frameworks, marketplace expansion, and more.',
            url: 'https://www.fedramp.gov/rfcs/',
            icon: 'book',
            category: 'reference'
        },
        {
            id: 'tool-blog',
            title: 'Focus on FedRAMP Blog',
            description: 'Official FedRAMP blog with the latest news, updates, and announcements on 20x, Rev 5, and program changes.',
            url: 'https://www.fedramp.gov/blog/1',
            icon: 'book',
            category: 'reference'
        },
        {
            id: 'tool-fedramp-mcp',
            title: 'FedRAMP Docs MCP Server',
            description: 'Model Context Protocol server for AI-assisted FedRAMP document exploration.',
            url: 'https://github.com/ethanolivertroy/fedramp-docs-mcp',
            icon: 'bot',
            category: 'ai'
        },
        {
            id: 'tool-marketplace',
            title: 'FedRAMP Marketplace',
            description: 'Official marketplace for browsing FedRAMP authorized cloud service offerings, including 20x Phase 2 pilot participants.',
            url: 'https://marketplace.fedramp.gov/',
            icon: 'store',
            category: 'marketplace',
            inAppView: 'fedramp-explorer'
        },
        {
            id: 'tool-nist-csrc',
            title: 'NIST CSRC — SP 800-53 Rev 5',
            description: 'Official NIST Computer Security Resource Center for 800-53 Rev 5 controls.',
            url: 'https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final',
            icon: 'book',
            category: 'reference'
        },
        {
            id: 'tool-fedramp-ref',
            title: 'FedRAMP 20x Reference (In-App)',
            description: 'Browse KSI families, implementation guides, 800-171 mappings, and AWS RSC guidance.',
            url: '#',
            icon: 'compass',
            category: 'in-app',
            inAppView: 'fedramp-reference'
        },
        {
            id: 'tool-cmvp',
            title: 'CMVP Explorer (In-App)',
            description: 'Search FIPS 140-2/140-3 validated cryptographic modules for FedRAMP compliance.',
            url: '#',
            icon: 'shield',
            category: 'in-app',
            inAppView: 'cmvp-explorer'
        },
        {
            id: 'tool-docs-hub',
            title: 'CMMC/NIST Docs Hub (In-App)',
            description: 'Browse CMMC and NIST documentation, guides, and assessment resources.',
            url: '#',
            icon: 'library',
            category: 'in-app',
            inAppView: 'docs-hub'
        }
    ],

    // =========================================================================
    // KSI-to-800-53 Mapping (for cross-reference)
    // =========================================================================
    ksiTo80053: {
        'AFR': ['CA-1', 'CA-2', 'CA-5', 'CA-6', 'CA-7'],
        'CED': ['AT-1', 'AT-2', 'AT-3', 'AT-4'],
        'CMT': ['CM-1', 'CM-2', 'CM-3', 'CM-4', 'CM-5', 'CM-6', 'CM-7', 'CM-8'],
        'CNA': ['SC-7', 'SC-8', 'SA-8', 'SA-15'],
        'IAM': ['AC-2', 'AC-3', 'AC-6', 'IA-1', 'IA-2', 'IA-4', 'IA-5', 'IA-8'],
        'INR': ['IR-1', 'IR-2', 'IR-4', 'IR-5', 'IR-6', 'IR-7', 'IR-8'],
        'MLA': ['AU-1', 'AU-2', 'AU-3', 'AU-4', 'AU-5', 'AU-6', 'AU-7', 'AU-8', 'AU-9', 'AU-11', 'AU-12'],
        'PIY': ['PL-1', 'PL-2', 'PL-4', 'CM-8', 'PM-5'],
        'RPL': ['CP-1', 'CP-2', 'CP-3', 'CP-4', 'CP-6', 'CP-7', 'CP-9', 'CP-10'],
        'SVC': ['SC-8', 'SC-12', 'SC-13', 'SC-28', 'SI-2', 'SI-3', 'SI-5', 'RA-5'],
        'TPR': ['SR-1', 'SR-2', 'SR-3', 'SR-5', 'SA-4', 'SA-9', 'SA-12']
    },

    // =========================================================================
    // Stats (for the stats bar)
    // =========================================================================
    stats: {
        totalTemplates: 12,
        totalBaselines: 4,
        controlFamilyCount: 20,
        totalControls: 1189,
        ksiFamilyCount: 11,
        totalKSIs: 61,
        guidanceDocCount: 10,
        toolCount: 13
    }
};
