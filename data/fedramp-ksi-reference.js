// FedRAMP 20x Key Security Indicator (KSI) Reference Data
// Curated from the official FedRAMP 20x framework for in-app reference.

const FEDRAMP_KSI_REFERENCE = {
    families: [
        {
            id: 'AFR',
            name: 'Authorization by FedRAMP',
            description: 'Requirements for obtaining and maintaining FedRAMP authorization, including continuous monitoring and reporting obligations.',
            ksis: [
                { id: 'AFR-L01', title: 'FedRAMP Authorization Boundary', desc: 'Define and document the authorization boundary for the cloud service offering.', baselines: ['low', 'moderate'] },
                { id: 'AFR-L02', title: 'Continuous Monitoring', desc: 'Implement continuous monitoring strategy aligned with FedRAMP requirements.', baselines: ['low', 'moderate'] },
                { id: 'AFR-L03', title: 'Significant Change Reporting', desc: 'Report significant changes to the system that may affect authorization status.', baselines: ['low', 'moderate'] },
                { id: 'AFR-L04', title: 'Annual Assessment', desc: 'Conduct annual security assessments per FedRAMP requirements.', baselines: ['low', 'moderate'] },
                { id: 'AFR-L05', title: 'POA&M Management', desc: 'Maintain and remediate Plan of Action and Milestones items within required timeframes.', baselines: ['low', 'moderate'] }
            ]
        },
        {
            id: 'CED',
            name: 'Cybersecurity Education',
            description: 'Security awareness training and education requirements for personnel with access to the cloud environment.',
            ksis: [
                { id: 'CED-L01', title: 'Security Awareness Training', desc: 'Provide security awareness training to all personnel before granting access and annually thereafter.', baselines: ['low', 'moderate'] },
                { id: 'CED-L02', title: 'Role-Based Training', desc: 'Provide role-based security training for personnel with significant security responsibilities.', baselines: ['low', 'moderate'] },
                { id: 'CED-L03', title: 'Phishing Awareness', desc: 'Conduct phishing awareness exercises and training for all users.', baselines: ['low', 'moderate'] }
            ]
        },
        {
            id: 'CMT',
            name: 'Change Management',
            description: 'Controls for managing changes to the cloud environment, including configuration management and change control processes.',
            ksis: [
                { id: 'CMT-L01', title: 'Configuration Baseline', desc: 'Establish and maintain baseline configurations for all system components.', baselines: ['low', 'moderate'] },
                { id: 'CMT-L02', title: 'Change Control Process', desc: 'Implement formal change control procedures for all system modifications.', baselines: ['low', 'moderate'] },
                { id: 'CMT-L03', title: 'Security Impact Analysis', desc: 'Analyze security impact of changes before implementation.', baselines: ['low', 'moderate'] },
                { id: 'CMT-L04', title: 'Configuration Monitoring', desc: 'Monitor and alert on unauthorized configuration changes.', baselines: ['low', 'moderate'] },
                { id: 'CMT-L05', title: 'Least Functionality', desc: 'Configure systems to provide only essential capabilities and restrict unnecessary functions.', baselines: ['low', 'moderate'] },
                { id: 'CMT-L06', title: 'Software Restrictions', desc: 'Identify and restrict unauthorized or high-risk software.', baselines: ['moderate'] }
            ]
        },
        {
            id: 'CNA',
            name: 'Cloud Native Architecture',
            description: 'Requirements specific to cloud-native architectures, including containerization, microservices, and serverless computing.',
            ksis: [
                { id: 'CNA-L01', title: 'Container Security', desc: 'Implement security controls for container images, registries, and runtime environments.', baselines: ['low', 'moderate'] },
                { id: 'CNA-L02', title: 'Infrastructure as Code', desc: 'Manage infrastructure through version-controlled, auditable code.', baselines: ['low', 'moderate'] },
                { id: 'CNA-L03', title: 'API Security', desc: 'Secure all APIs with authentication, authorization, rate limiting, and input validation.', baselines: ['low', 'moderate'] },
                { id: 'CNA-L04', title: 'Service Mesh Security', desc: 'Implement mutual TLS and network policies for service-to-service communication.', baselines: ['moderate'] },
                { id: 'CNA-L05', title: 'Immutable Infrastructure', desc: 'Deploy immutable infrastructure components that are replaced rather than modified.', baselines: ['moderate'] }
            ]
        },
        {
            id: 'IAM',
            name: 'Identity & Access Management',
            description: 'Identity lifecycle management, authentication, and authorization controls for cloud environments.',
            ksis: [
                { id: 'IAM-L01', title: 'Identity Lifecycle', desc: 'Manage the full lifecycle of digital identities from provisioning through deprovisioning.', baselines: ['low', 'moderate'] },
                { id: 'IAM-L02', title: 'Multi-Factor Authentication', desc: 'Require MFA for all privileged and remote access to the cloud environment.', baselines: ['low', 'moderate'] },
                { id: 'IAM-L03', title: 'Privileged Access Management', desc: 'Implement just-in-time and least-privilege access for administrative accounts.', baselines: ['low', 'moderate'] },
                { id: 'IAM-L04', title: 'Access Reviews', desc: 'Conduct periodic access reviews and recertification of user privileges.', baselines: ['low', 'moderate'] },
                { id: 'IAM-L05', title: 'Federation & SSO', desc: 'Implement federated identity and single sign-on using SAML/OIDC standards.', baselines: ['low', 'moderate'] },
                { id: 'IAM-L06', title: 'Service Account Management', desc: 'Manage and monitor service accounts and API keys with rotation policies.', baselines: ['moderate'] },
                { id: 'IAM-L07', title: 'Conditional Access', desc: 'Implement risk-based conditional access policies based on context and behavior.', baselines: ['moderate'] }
            ]
        },
        {
            id: 'INR',
            name: 'Incident Response',
            description: 'Incident detection, response, and recovery capabilities for cloud security events.',
            ksis: [
                { id: 'INR-L01', title: 'Incident Response Plan', desc: 'Maintain and test an incident response plan specific to the cloud environment.', baselines: ['low', 'moderate'] },
                { id: 'INR-L02', title: 'Incident Detection', desc: 'Implement automated detection capabilities for security incidents.', baselines: ['low', 'moderate'] },
                { id: 'INR-L03', title: 'Incident Reporting', desc: 'Report security incidents to FedRAMP and affected agencies within required timeframes.', baselines: ['low', 'moderate'] },
                { id: 'INR-L04', title: 'Forensic Capability', desc: 'Maintain forensic investigation capabilities for cloud-based incidents.', baselines: ['moderate'] },
                { id: 'INR-L05', title: 'Incident Correlation', desc: 'Correlate security events across cloud services and tenants.', baselines: ['moderate'] }
            ]
        },
        {
            id: 'MLA',
            name: 'Monitoring, Logging & Auditing',
            description: 'Comprehensive monitoring, logging, and audit capabilities for cloud environments.',
            ksis: [
                { id: 'MLA-L01', title: 'Centralized Logging', desc: 'Aggregate logs from all cloud components into a centralized, tamper-resistant logging system.', baselines: ['low', 'moderate'] },
                { id: 'MLA-L02', title: 'Audit Log Retention', desc: 'Retain audit logs for the required period with integrity protections.', baselines: ['low', 'moderate'] },
                { id: 'MLA-L03', title: 'Real-Time Monitoring', desc: 'Implement real-time security monitoring and alerting for critical events.', baselines: ['low', 'moderate'] },
                { id: 'MLA-L04', title: 'Log Analysis', desc: 'Perform automated and manual analysis of audit logs for indicators of compromise.', baselines: ['low', 'moderate'] },
                { id: 'MLA-L05', title: 'Audit Reduction', desc: 'Implement audit reduction and report generation capabilities.', baselines: ['moderate'] },
                { id: 'MLA-L06', title: 'Cross-Tenant Monitoring', desc: 'Monitor for cross-tenant security events and data leakage.', baselines: ['moderate'] }
            ]
        },
        {
            id: 'PIY',
            name: 'Policy and Inventory',
            description: 'Security policy management and asset inventory requirements for cloud environments.',
            ksis: [
                { id: 'PIY-L01', title: 'Security Policy Framework', desc: 'Maintain comprehensive security policies covering all FedRAMP control families.', baselines: ['low', 'moderate'] },
                { id: 'PIY-L02', title: 'Asset Inventory', desc: 'Maintain an accurate, automated inventory of all cloud assets and components.', baselines: ['low', 'moderate'] },
                { id: 'PIY-L03', title: 'Data Classification', desc: 'Classify and label data according to sensitivity and handling requirements.', baselines: ['low', 'moderate'] },
                { id: 'PIY-L04', title: 'Software Inventory', desc: 'Maintain an inventory of all authorized software and versions.', baselines: ['low', 'moderate'] },
                { id: 'PIY-L05', title: 'Policy Review', desc: 'Review and update security policies at least annually or after significant changes.', baselines: ['low', 'moderate'] }
            ]
        },
        {
            id: 'RPL',
            name: 'Recovery Planning',
            description: 'Business continuity and disaster recovery planning for cloud services.',
            ksis: [
                { id: 'RPL-L01', title: 'Contingency Plan', desc: 'Develop and maintain a contingency plan for the cloud service offering.', baselines: ['low', 'moderate'] },
                { id: 'RPL-L02', title: 'Backup & Recovery', desc: 'Implement automated backup and tested recovery procedures for all critical data.', baselines: ['low', 'moderate'] },
                { id: 'RPL-L03', title: 'Contingency Testing', desc: 'Test contingency plans at least annually with documented results.', baselines: ['low', 'moderate'] },
                { id: 'RPL-L04', title: 'Alternate Processing', desc: 'Maintain alternate processing sites capable of resuming operations within RTO.', baselines: ['moderate'] },
                { id: 'RPL-L05', title: 'Data Portability', desc: 'Ensure customer data portability and provide data export capabilities.', baselines: ['low', 'moderate'] }
            ]
        },
        {
            id: 'SVC',
            name: 'Service Configuration',
            description: 'Secure configuration and hardening requirements for cloud services and infrastructure.',
            ksis: [
                { id: 'SVC-L01', title: 'Secure Defaults', desc: 'Configure all services with secure defaults and disable unnecessary features.', baselines: ['low', 'moderate'] },
                { id: 'SVC-L02', title: 'Encryption in Transit', desc: 'Encrypt all data in transit using FIPS-validated cryptographic modules (TLS 1.2+).', baselines: ['low', 'moderate'] },
                { id: 'SVC-L03', title: 'Encryption at Rest', desc: 'Encrypt all data at rest using FIPS-validated cryptographic modules.', baselines: ['low', 'moderate'] },
                { id: 'SVC-L04', title: 'Key Management', desc: 'Implement cryptographic key management with HSM-backed key storage.', baselines: ['low', 'moderate'] },
                { id: 'SVC-L05', title: 'Network Segmentation', desc: 'Implement network segmentation between tenants and security zones.', baselines: ['low', 'moderate'] },
                { id: 'SVC-L06', title: 'Vulnerability Management', desc: 'Scan for vulnerabilities and remediate critical/high findings within required timeframes.', baselines: ['low', 'moderate'] },
                { id: 'SVC-L07', title: 'Patch Management', desc: 'Apply security patches within FedRAMP-defined timeframes based on severity.', baselines: ['low', 'moderate'] }
            ]
        },
        {
            id: 'TPR',
            name: 'Third-Party Resources',
            description: 'Supply chain risk management and third-party service provider oversight.',
            ksis: [
                { id: 'TPR-L01', title: 'Supply Chain Risk Management', desc: 'Implement a supply chain risk management program for all third-party components.', baselines: ['low', 'moderate'] },
                { id: 'TPR-L02', title: 'Third-Party Assessment', desc: 'Assess security posture of third-party service providers and components.', baselines: ['low', 'moderate'] },
                { id: 'TPR-L03', title: 'SBOM Management', desc: 'Maintain Software Bill of Materials for all deployed software components.', baselines: ['moderate'] },
                { id: 'TPR-L04', title: 'Interconnection Agreements', desc: 'Establish and maintain interconnection security agreements with external systems.', baselines: ['low', 'moderate'] },
                { id: 'TPR-L05', title: 'Vendor Risk Monitoring', desc: 'Continuously monitor third-party vendors for security risks and compliance status.', baselines: ['moderate'] }
            ]
        }
    ],

    // Mapping of FedRAMP 20x families to relevant NIST 800-171 control families
    familyToNist171: {
        'AFR': ['CA', 'PM'],
        'CED': ['AT'],
        'CMT': ['CM'],
        'CNA': ['SC', 'SA'],
        'IAM': ['AC', 'IA'],
        'INR': ['IR'],
        'MLA': ['AU'],
        'PIY': ['PL', 'PM', 'CM'],
        'RPL': ['CP'],
        'SVC': ['SC', 'SI', 'RA'],
        'TPR': ['SR', 'SA']
    },

    // AWS FedRAMP Rev5 Recommended Secure Configuration (FRR-RSC) Requirements
    awsRSC: [
        {
            id: 'FRR-RSC-01',
            title: 'Top-Level Administrative Accounts Guidance',
            description: 'Detailed guidance for securing Root Account, AWS Organizations, and IAM Identity Center. Covers protection of top-level administrative accounts with specific configuration steps.',
            awsServices: ['Root Account', 'AWS Organizations', 'IAM Identity Center'],
            category: 'Administrative'
        },
        {
            id: 'FRR-RSC-02',
            title: 'Administrative Security Settings',
            description: 'Root-only security settings documentation with API commands. Documents security settings that can only be configured by the root account holder.',
            awsServices: ['Root Account', 'IAM'],
            category: 'Administrative'
        },
        {
            id: 'FRR-RSC-03',
            title: 'Privileged Accounts Security',
            description: 'IAM best practices, MFA enforcement, and least privilege guidance. Comprehensive guidance for securing privileged access across AWS services.',
            awsServices: ['IAM', 'IAM Identity Center', 'STS'],
            category: 'Administrative'
        },
        {
            id: 'FRR-RSC-04',
            title: 'Secure Defaults on Provisioning',
            description: 'AWS Well-Architected Framework security baselines per service. Guidance for configuring secure defaults when provisioning new AWS resources.',
            awsServices: ['All 161 AWS Services'],
            category: 'Configuration'
        },
        {
            id: 'FRR-RSC-05',
            title: 'Comparison Capability',
            description: 'AWS Config integration for drift detection and compliance comparison. Enables comparison of current configurations against secure baselines.',
            awsServices: ['AWS Config', 'Security Hub'],
            category: 'Monitoring'
        },
        {
            id: 'FRR-RSC-06',
            title: 'Export Capability',
            description: 'JSON, OSCAL, and CloudFormation export formats. Provides machine-readable exports of security configuration guidance for automation.',
            awsServices: ['CloudFormation', 'OSCAL'],
            category: 'Automation'
        },
        {
            id: 'FRR-RSC-07',
            title: 'API Capability',
            description: '100% of security settings configurable via AWS CLI/API. All security configurations documented with corresponding API and CLI commands.',
            awsServices: ['AWS CLI', 'AWS SDK', 'All Services'],
            category: 'Automation'
        },
        {
            id: 'FRR-RSC-08',
            title: 'Machine-Readable Guidance',
            description: 'OSCAL 1.1.2 component definitions for all services. Provides Open Security Controls Assessment Language formatted guidance for automated consumption.',
            awsServices: ['OSCAL 1.1.2'],
            category: 'Automation'
        },
        {
            id: 'FRR-RSC-09',
            title: 'Publish Guidance',
            description: 'Publicly accessible web interface and downloadable artifacts. All guidance published at docs.aws.amazon.com/fedramp with downloadable OSCAL files.',
            awsServices: ['AWS Documentation'],
            category: 'Documentation'
        },
        {
            id: 'FRR-RSC-10',
            title: 'Versioning and Release History',
            description: 'Version-controlled guidance with change tracking. Maintains a complete history of changes to security configuration guidance.',
            awsServices: ['AWS Documentation'],
            category: 'Documentation'
        }
    ],

    externalResources: [
        {
            title: 'AWS FedRAMP Rev5 Secure Config',
            url: 'https://docs.aws.amazon.com/fedramp/latest/userguide/introduction.html',
            description: 'AWS FedRAMP Rev5 Recommended Secure Configuration guidance for 161 AWS services with OSCAL exports.',
            icon: 'cloud'
        },
        {
            title: 'FedRAMP Docs MCP Server',
            url: 'https://github.com/ethanolivertroy/fedramp-docs-mcp',
            description: 'Full MCP server for AI-assisted FedRAMP compliance analysis. Provides 20 tools for document discovery, KSI lookup, control mapping, and evidence collection.',
            icon: 'server'
        },
        {
            title: 'Official FedRAMP Website',
            url: 'https://www.fedramp.gov/',
            description: 'Official FedRAMP program website with authorization guidance, marketplace, and policy documents.',
            icon: 'globe'
        },
        {
            title: 'FedRAMP 20x Overview',
            url: 'https://www.fedramp.gov/20x/',
            description: 'FedRAMP 20x modernization initiative — streamlined authorization with Key Security Indicators.',
            icon: 'zap'
        },
        {
            title: 'NIST 800-53 Rev 5 Controls',
            url: 'https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final',
            description: 'Complete NIST 800-53 Rev 5 security and privacy controls catalog — the foundation for FedRAMP baselines.',
            icon: 'book'
        },
        {
            title: 'NIST CMVP Explorer',
            url: 'https://ethanolivertroy.github.io/NIST-CMVP-API/',
            description: 'API documentation for the NIST Cryptographic Module Validation Program data explorer.',
            icon: 'shield'
        },
        {
            title: 'CMVP TUI (Terminal)',
            url: 'https://github.com/ethanolivertroy/cmvp-tui',
            description: 'Terminal-based CMVP explorer for command-line lookup of FIPS 140 validated modules.',
            icon: 'terminal'
        },
        {
            title: 'AWS FedRAMP OSCAL Artifacts',
            url: 'https://docs.aws.amazon.com/fedramp/latest/userguide/samples/FRR-RSC.zip',
            description: 'Downloadable OSCAL 1.1.2 component definitions and CloudFormation templates for FedRAMP compliance automation.',
            icon: 'download'
        }
    ]
};
