// FedRAMP Docs Terminal — Static data for in-browser FedRAMP document exploration
// Mirrors the functionality of the fedramp-docs-mcp server using curated static data.

const FEDRAMP_DOCS_DATA = {
    documents: [
        { id: 'FRMR-01', type: 'FedRAMP Requirements for Moderate', title: 'System Security Plan (SSP)', description: 'Template and requirements for the System Security Plan at the Moderate impact level.', format: 'DOCX/PDF' },
        { id: 'FRMR-02', type: 'FedRAMP Requirements for Moderate', title: 'Security Assessment Plan (SAP)', description: 'Template for the Security Assessment Plan used by 3PAOs.', format: 'DOCX/PDF' },
        { id: 'FRMR-03', type: 'FedRAMP Requirements for Moderate', title: 'Security Assessment Report (SAR)', description: 'Template for documenting assessment findings and results.', format: 'DOCX/PDF' },
        { id: 'FRMR-04', type: 'FedRAMP Requirements for Moderate', title: 'Plan of Action & Milestones (POA&M)', description: 'Template for tracking remediation of identified vulnerabilities.', format: 'XLSX' },
        { id: 'FRMR-05', type: 'FedRAMP Policy', title: 'Continuous Monitoring Strategy Guide', description: 'Guidance for implementing continuous monitoring per FedRAMP requirements.', format: 'PDF' },
        { id: 'FRMR-06', type: 'FedRAMP Policy', title: 'Significant Change Request', description: 'Process and template for reporting significant changes to authorized systems.', format: 'DOCX/PDF' },
        { id: 'FRMR-07', type: 'FedRAMP Guidance', title: 'Authorization Boundary Guidance', description: 'How to define and document the authorization boundary for cloud services.', format: 'PDF' },
        { id: 'FRMR-08', type: 'FedRAMP Guidance', title: 'Digital Identity Requirements', description: 'Identity proofing and authentication requirements for FedRAMP systems.', format: 'PDF' },
        { id: 'FRMR-09', type: 'FedRAMP 20x', title: 'Key Security Indicators (KSI) Framework', description: 'The 20x modernization framework with 11 KSI families and 61 indicators.', format: 'Web/JSON' },
        { id: 'FRMR-10', type: 'FedRAMP 20x', title: 'FedRAMP 20x Automation Guide', description: 'Guidance for automated evidence collection and continuous authorization.', format: 'PDF/Web' },
        { id: 'FRMR-11', type: 'NIST Mapping', title: 'FedRAMP Moderate Baseline (800-53 Rev 5)', description: 'Complete list of 800-53 Rev 5 controls required for FedRAMP Moderate.', format: 'XLSX/OSCAL' },
        { id: 'FRMR-12', type: 'NIST Mapping', title: 'FedRAMP High Baseline (800-53 Rev 5)', description: 'Complete list of 800-53 Rev 5 controls required for FedRAMP High.', format: 'XLSX/OSCAL' }
    ],

    controlFamilies: [
        { id: 'AC', name: 'Access Control', controlCount: 25, description: 'Policies and mechanisms for controlling access to information systems.' },
        { id: 'AT', name: 'Awareness and Training', controlCount: 6, description: 'Security awareness training and role-based training requirements.' },
        { id: 'AU', name: 'Audit and Accountability', controlCount: 16, description: 'Audit logging, monitoring, and accountability mechanisms.' },
        { id: 'CA', name: 'Assessment, Authorization, and Monitoring', controlCount: 9, description: 'Security assessment, authorization, and continuous monitoring.' },
        { id: 'CM', name: 'Configuration Management', controlCount: 14, description: 'Baseline configurations, change control, and least functionality.' },
        { id: 'CP', name: 'Contingency Planning', controlCount: 13, description: 'Business continuity, disaster recovery, and backup procedures.' },
        { id: 'IA', name: 'Identification and Authentication', controlCount: 12, description: 'User identification, authentication, and credential management.' },
        { id: 'IR', name: 'Incident Response', controlCount: 10, description: 'Incident detection, reporting, response, and recovery.' },
        { id: 'MA', name: 'Maintenance', controlCount: 6, description: 'System maintenance, remote maintenance, and maintenance tools.' },
        { id: 'MP', name: 'Media Protection', controlCount: 8, description: 'Media access, marking, storage, transport, and sanitization.' },
        { id: 'PE', name: 'Physical and Environmental Protection', controlCount: 20, description: 'Physical access, monitoring, and environmental controls.' },
        { id: 'PL', name: 'Planning', controlCount: 11, description: 'Security planning, rules of behavior, and information architecture.' },
        { id: 'PM', name: 'Program Management', controlCount: 16, description: 'Information security program plan and enterprise architecture.' },
        { id: 'PS', name: 'Personnel Security', controlCount: 9, description: 'Personnel screening, termination, transfer, and access agreements.' },
        { id: 'PT', name: 'PII Processing and Transparency', controlCount: 8, description: 'Privacy impact assessments and PII processing controls.' },
        { id: 'RA', name: 'Risk Assessment', controlCount: 10, description: 'Risk assessments, vulnerability scanning, and threat analysis.' },
        { id: 'SA', name: 'System and Services Acquisition', controlCount: 22, description: 'System development lifecycle, supply chain, and acquisitions.' },
        { id: 'SC', name: 'System and Communications Protection', controlCount: 44, description: 'Boundary protection, cryptography, and communications security.' },
        { id: 'SI', name: 'System and Information Integrity', controlCount: 20, description: 'Flaw remediation, malicious code protection, and monitoring.' },
        { id: 'SR', name: 'Supply Chain Risk Management', controlCount: 12, description: 'Supply chain risk management plan, processes, and controls.' }
    ],

    evidenceExamples: {
        'access-control': [
            'Screenshots of IAM policies showing least privilege configuration',
            'MFA enrollment reports for all privileged accounts',
            'Access review logs showing quarterly recertification',
            'Network segmentation diagrams with firewall rules',
            'VPN configuration showing encrypted remote access',
            'Session timeout configuration screenshots',
            'Role-based access control (RBAC) matrix documentation'
        ],
        'audit-logging': [
            'CloudTrail or equivalent audit log configuration',
            'SIEM dashboard showing real-time alerting',
            'Log retention policy documentation (90+ days online, 1 year archive)',
            'Audit log integrity verification (hashing/signing)',
            'Sample alert rules for critical security events',
            'Log aggregation architecture diagram'
        ],
        'configuration-management': [
            'Baseline configuration documents per system component',
            'Change management board meeting minutes',
            'Configuration drift detection reports (AWS Config, etc.)',
            'Software allowlist/denylist documentation',
            'Automated configuration scanning results (CIS benchmarks)',
            'Infrastructure as Code (IaC) templates with security controls'
        ],
        'incident-response': [
            'Incident response plan with roles and escalation procedures',
            'Tabletop exercise results and after-action reports',
            'US-CERT/FedRAMP incident reporting templates',
            'Forensic investigation toolkit documentation',
            'Incident correlation dashboard screenshots',
            'Communication plan for breach notification'
        ],
        'encryption': [
            'FIPS 140-2/140-3 validated module certificates',
            'TLS configuration showing 1.2+ enforcement',
            'Key management procedures and HSM documentation',
            'Data-at-rest encryption configuration per service',
            'Certificate management and rotation procedures',
            'Cryptographic algorithm inventory'
        ],
        'vulnerability-management': [
            'Vulnerability scan reports (monthly/quarterly)',
            'Patch management SLA compliance reports',
            'Penetration test results and remediation tracking',
            'SBOM (Software Bill of Materials) for deployed components',
            'Zero-day response procedures documentation',
            'Risk acceptance documentation for deferred patches'
        ],
        'continuous-monitoring': [
            'ConMon deliverable schedule and compliance tracking',
            'Monthly vulnerability scan submissions',
            'Annual assessment plan and results',
            'POA&M status updates and closure evidence',
            'Significant change notifications and impact analyses',
            'Automated compliance dashboard screenshots'
        ]
    },

    significantChangeGuidance: [
        { trigger: 'New external service integration', impact: 'Boundary change — requires updated SSP and potentially new assessment', action: 'Submit Significant Change Request (SCR) to FedRAMP PMO' },
        { trigger: 'Migration to new cloud region', impact: 'Physical location change — may affect data residency requirements', action: 'Update SSP boundary, notify agency customers, submit SCR' },
        { trigger: 'New authentication mechanism', impact: 'IA control family affected — requires updated control implementation', action: 'Update SSP, conduct focused assessment on IA controls' },
        { trigger: 'Major version upgrade of core platform', impact: 'Multiple control families potentially affected', action: 'Conduct security impact analysis, update SSP, may require 3PAO assessment' },
        { trigger: 'New data flow or interconnection', impact: 'Boundary and data flow changes — ISA/MOU updates needed', action: 'Update SSP, create/update ISA, submit SCR' },
        { trigger: 'Change in encryption implementation', impact: 'SC control family affected — FIPS validation status may change', action: 'Verify FIPS 140 validation, update SSP, conduct focused assessment' },
        { trigger: 'Addition of new user roles/access levels', impact: 'AC control family affected — RBAC changes', action: 'Update SSP access control section, review least privilege' },
        { trigger: 'Infrastructure provider change', impact: 'Major boundary change — may require full re-assessment', action: 'Engage FedRAMP PMO early, plan for potential re-authorization' }
    ],

    // Mapping of KSI families to 800-53 control families
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
    }
};
