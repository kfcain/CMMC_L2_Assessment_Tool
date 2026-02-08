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
            category: 'Administrative',
            implementation: {
                overview: 'Secure root and top-level admin accounts using hardware MFA, Organizations SCPs, and IAM Identity Center with SAML/OIDC federation.',
                steps: [
                    'Enable hardware MFA on the root account (YubiKey or equivalent FIPS 140-2 L2+ device)',
                    'Create an AWS Organization with consolidated billing and all-features enabled',
                    'Apply a root-deny SCP to prevent root account usage for day-to-day operations',
                    'Configure IAM Identity Center with an external IdP (Entra ID, Okta, or Ping) via SAML 2.0',
                    'Create permission sets mapped to job functions with session duration ≤ 4 hours',
                    'Enable CloudTrail organization trail for all management events across all regions',
                    'Store root account credentials in a physical safe with dual-person access control'
                ],
                cliExamples: [
                    { title: 'Enable Organizations All Features', cmd: 'aws organizations enable-all-features' },
                    { title: 'Create Root-Deny SCP', cmd: 'aws organizations create-policy --name "DenyRootActions" --type SERVICE_CONTROL_POLICY --content \'{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"*","Resource":"*","Condition":{"StringLike":{"aws:PrincipalArn":"arn:aws-us-gov:iam::*:root"}}}]}\'' },
                    { title: 'List MFA Devices on Root', cmd: 'aws iam list-mfa-devices --user-name root' }
                ],
                verification: [
                    'Confirm root account has hardware MFA via IAM Credential Report',
                    'Verify SCP denies root actions in member accounts',
                    'Validate CloudTrail logs capture root sign-in events',
                    'Test that IAM Identity Center SSO login works with MFA from external IdP'
                ],
                architectureNotes: 'Use a dedicated management account with no workloads. Separate security, logging, and workload accounts via OU structure. The management account should only be accessed for billing and organizational changes.',
                relatedControls: ['AC-2', 'AC-6', 'IA-2', 'IA-5']
            }
        },
        {
            id: 'FRR-RSC-02',
            title: 'Administrative Security Settings',
            description: 'Root-only security settings documentation with API commands. Documents security settings that can only be configured by the root account holder.',
            awsServices: ['Root Account', 'IAM'],
            category: 'Administrative',
            implementation: {
                overview: 'Configure root-only settings including account-level S3 Block Public Access, EBS default encryption, and IAM Access Analyzer.',
                steps: [
                    'Enable S3 Block Public Access at the account level (all four settings)',
                    'Enable EBS default encryption with a KMS CMK in each active region',
                    'Configure IAM Access Analyzer for the organization (external access findings)',
                    'Enable EC2 Serial Console access restrictions',
                    'Set IAM account password policy: 14+ chars, complexity, 90-day rotation, 24-password history',
                    'Disable STS global endpoint token versions < v2',
                    'Enable account-level GuardDuty with S3 protection, EKS audit, and Malware Protection'
                ],
                cliExamples: [
                    { title: 'S3 Block Public Access (Account)', cmd: 'aws s3control put-public-access-block --account-id $ACCOUNT_ID --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true' },
                    { title: 'EBS Default Encryption', cmd: 'aws ec2 enable-ebs-encryption-by-default --region us-gov-west-1' },
                    { title: 'IAM Password Policy', cmd: 'aws iam update-account-password-policy --minimum-password-length 14 --require-symbols --require-numbers --require-uppercase-characters --require-lowercase-characters --max-password-age 90 --password-reuse-prevention 24' },
                    { title: 'Create IAM Access Analyzer', cmd: 'aws accessanalyzer create-analyzer --analyzer-name org-analyzer --type ORGANIZATION' }
                ],
                verification: [
                    'Run aws s3control get-public-access-block to confirm all four blocks enabled',
                    'Verify EBS encryption default in each region via aws ec2 get-ebs-encryption-by-default',
                    'Check IAM Access Analyzer findings are empty or remediated',
                    'Validate password policy via aws iam get-account-password-policy'
                ],
                architectureNotes: 'These settings form the account-level security baseline. Apply via CloudFormation StackSets across all accounts in the Organization. Use AWS Config conformance packs to continuously monitor compliance.',
                relatedControls: ['AC-3', 'CM-6', 'CM-7', 'SC-28']
            }
        },
        {
            id: 'FRR-RSC-03',
            title: 'Privileged Accounts Security',
            description: 'IAM best practices, MFA enforcement, and least privilege guidance. Comprehensive guidance for securing privileged access across AWS services.',
            awsServices: ['IAM', 'IAM Identity Center', 'STS'],
            category: 'Administrative',
            implementation: {
                overview: 'Implement zero-standing-privilege model with just-in-time access, MFA everywhere, and comprehensive session controls.',
                steps: [
                    'Eliminate long-lived IAM access keys — migrate to IAM roles and STS temporary credentials',
                    'Enforce MFA for all IAM users via IAM policy condition aws:MultiFactorAuthPresent',
                    'Implement permission boundaries on all IAM entities to cap maximum permissions',
                    'Use IAM Identity Center permission sets with inline policies scoped to specific resources',
                    'Configure STS session duration: max 1 hour for admin roles, 4 hours for read-only',
                    'Deploy AWS SSO with ABAC (attribute-based access control) using cost-center and team tags',
                    'Enable IAM Access Advisor to identify unused permissions and right-size policies quarterly',
                    'Implement break-glass procedure: dedicated emergency role with CloudWatch alarm on assumption'
                ],
                cliExamples: [
                    { title: 'List Access Keys (Audit)', cmd: 'aws iam generate-credential-report && aws iam get-credential-report --query Content --output text | base64 -d | grep -v "not_supported"' },
                    { title: 'Create Permission Boundary', cmd: 'aws iam create-policy --policy-name FedRAMPBoundary --policy-document file://boundary-policy.json' },
                    { title: 'Enforce MFA Policy Condition', cmd: '"Condition": {"BoolIfExists": {"aws:MultiFactorAuthPresent": "true"}}' },
                    { title: 'Set Max Session Duration', cmd: 'aws iam update-role --role-name AdminRole --max-session-duration 3600' }
                ],
                verification: [
                    'IAM Credential Report shows zero active access keys older than 90 days',
                    'All IAM users have MFA enabled (credential report mfa_active = true)',
                    'Permission boundaries attached to all non-service-linked roles',
                    'STS session durations ≤ 4 hours for all roles',
                    'IAM Access Advisor shows no unused permissions older than 90 days'
                ],
                architectureNotes: 'Prefer IAM Identity Center over direct IAM users. Use SAML federation with Entra ID or Okta for human access. Service accounts should use IAM roles with OIDC federation (EKS) or instance profiles (EC2). Never embed credentials in code.',
                relatedControls: ['AC-2', 'AC-5', 'AC-6', 'IA-2', 'IA-4', 'IA-5']
            }
        },
        {
            id: 'FRR-RSC-04',
            title: 'Secure Defaults on Provisioning',
            description: 'AWS Well-Architected Framework security baselines per service. Guidance for configuring secure defaults when provisioning new AWS resources.',
            awsServices: ['All 161 AWS Services'],
            category: 'Configuration',
            implementation: {
                overview: 'Enforce secure-by-default configurations using Service Control Policies, CloudFormation Guard rules, and AWS Config rules at provisioning time.',
                steps: [
                    'Deploy SCPs that prevent launching resources without encryption (EBS, RDS, S3, EFS)',
                    'Create CloudFormation Guard rules to validate templates before deployment',
                    'Enable AWS Config with managed rules for CIS AWS Foundations Benchmark v3.0',
                    'Configure Security Hub with the AWS Foundational Security Best Practices standard',
                    'Deploy Service Catalog portfolios with pre-approved, hardened product templates',
                    'Implement tag enforcement SCP requiring cost-center, data-classification, and owner tags',
                    'Enable VPC Flow Logs on all VPCs with delivery to centralized S3 bucket',
                    'Configure default VPC security groups to deny all inbound traffic'
                ],
                cliExamples: [
                    { title: 'Enable Security Hub Standards', cmd: 'aws securityhub enable-security-hub --enable-default-standards --region us-gov-west-1' },
                    { title: 'Enable AWS Config', cmd: 'aws configservice put-configuration-recorder --configuration-recorder name=default,roleARN=arn:aws-us-gov:iam::$ACCT:role/aws-service-role/config.amazonaws.com/AWSServiceRoleForConfig,recordingGroup={allSupported=true,includeGlobalResourceTypes=true}' },
                    { title: 'Default Security Group Lockdown', cmd: 'aws ec2 revoke-security-group-ingress --group-id sg-default --protocol all --source-group sg-default' },
                    { title: 'Enable VPC Flow Logs', cmd: 'aws ec2 create-flow-logs --resource-type VPC --resource-ids vpc-xxx --traffic-type ALL --log-destination-type s3 --log-destination arn:aws-us-gov:s3:::flow-logs-bucket' }
                ],
                verification: [
                    'Security Hub score ≥ 90% across all enabled standards',
                    'AWS Config shows zero non-compliant resources for critical rules',
                    'All EBS volumes, RDS instances, and S3 buckets are encrypted',
                    'No security groups allow 0.0.0.0/0 inbound on ports other than 443',
                    'All VPCs have flow logs enabled'
                ],
                architectureNotes: 'Use a "landing zone" approach (AWS Control Tower or custom) to provision accounts with guardrails pre-applied. Combine preventive controls (SCPs) with detective controls (Config rules) and responsive controls (Lambda auto-remediation).',
                relatedControls: ['CM-2', 'CM-6', 'CM-7', 'SC-7', 'SC-28']
            }
        },
        {
            id: 'FRR-RSC-05',
            title: 'Comparison Capability',
            description: 'AWS Config integration for drift detection and compliance comparison. Enables comparison of current configurations against secure baselines.',
            awsServices: ['AWS Config', 'Security Hub'],
            category: 'Monitoring',
            implementation: {
                overview: 'Implement continuous configuration drift detection using AWS Config conformance packs, Security Hub cross-account aggregation, and CloudFormation drift detection.',
                steps: [
                    'Deploy AWS Config conformance packs for FedRAMP Moderate baseline across all accounts',
                    'Enable Security Hub cross-account aggregation in the security account',
                    'Configure CloudFormation drift detection on all production stacks (scheduled weekly)',
                    'Create custom Config rules for organization-specific security requirements',
                    'Set up EventBridge rules to alert on non-compliant Config evaluations',
                    'Deploy AWS Config Aggregator for organization-wide compliance dashboard',
                    'Integrate Config findings with ServiceNow or Jira for remediation tracking'
                ],
                cliExamples: [
                    { title: 'Deploy Conformance Pack', cmd: 'aws configservice put-conformance-pack --conformance-pack-name FedRAMP-Moderate --template-s3-uri s3://config-packs/fedramp-moderate.yaml' },
                    { title: 'Check Stack Drift', cmd: 'aws cloudformation detect-stack-drift --stack-name production-stack && aws cloudformation describe-stack-drift-detection-status --stack-drift-detection-id $ID' },
                    { title: 'Create Config Aggregator', cmd: 'aws configservice put-configuration-aggregator --configuration-aggregator-name OrgAggregator --organization-aggregation-source RoleArn=arn:aws-us-gov:iam::$MGMT:role/ConfigAggregatorRole,AllAwsRegions=true' },
                    { title: 'Query Non-Compliant Resources', cmd: 'aws configservice get-compliance-details-by-config-rule --config-rule-name encrypted-volumes --compliance-types NON_COMPLIANT' }
                ],
                verification: [
                    'Conformance pack compliance score ≥ 95% across all accounts',
                    'Zero critical/high findings in Security Hub older than 30 days',
                    'CloudFormation drift detection shows zero drifted resources',
                    'Config Aggregator dashboard accessible in security account'
                ],
                architectureNotes: 'Use a hub-and-spoke model: Config rules and conformance packs deployed via StackSets from management account, findings aggregated to security account. Security Hub provides the single-pane-of-glass view.',
                relatedControls: ['CA-7', 'CM-3', 'CM-4', 'SI-4']
            }
        },
        {
            id: 'FRR-RSC-06',
            title: 'Export Capability',
            description: 'JSON, OSCAL, and CloudFormation export formats. Provides machine-readable exports of security configuration guidance for automation.',
            awsServices: ['CloudFormation', 'OSCAL'],
            category: 'Automation',
            implementation: {
                overview: 'Leverage OSCAL component definitions and CloudFormation templates to automate compliance documentation and infrastructure deployment.',
                steps: [
                    'Download AWS FRR-RSC OSCAL artifacts from docs.aws.amazon.com/fedramp',
                    'Import OSCAL component definitions into your GRC tool (e.g., Telos Xacta, RegScale, or CSRC)',
                    'Map OSCAL components to your SSP control implementations',
                    'Use CloudFormation templates from FRR-RSC to deploy compliant infrastructure',
                    'Export Security Hub findings in ASFF (AWS Security Finding Format) for 3PAO evidence',
                    'Generate machine-readable POA&M from Security Hub findings via custom Lambda'
                ],
                cliExamples: [
                    { title: 'Download OSCAL Artifacts', cmd: 'curl -O https://docs.aws.amazon.com/fedramp/latest/userguide/samples/FRR-RSC.zip && unzip FRR-RSC.zip' },
                    { title: 'Export Security Hub Findings', cmd: 'aws securityhub get-findings --filters \'{"ComplianceStatus":[{"Value":"FAILED","Comparison":"EQUALS"}]}\' --max-items 100 > findings-export.json' },
                    { title: 'Deploy Compliant Stack', cmd: 'aws cloudformation create-stack --stack-name fedramp-baseline --template-url https://s3.us-gov-west-1.amazonaws.com/templates/fedramp-baseline.yaml --capabilities CAPABILITY_NAMED_IAM' }
                ],
                verification: [
                    'OSCAL component definitions successfully imported into GRC tool',
                    'CloudFormation stacks deploy without errors in GovCloud',
                    'Security Hub findings export contains all required ASFF fields',
                    'Exported POA&M matches FedRAMP template format'
                ],
                architectureNotes: 'OSCAL 1.1.2 is the standard for machine-readable security documentation. AWS provides component definitions that map directly to FedRAMP Moderate controls. Use these as the foundation for your SSP and integrate with CI/CD for continuous compliance.',
                relatedControls: ['CA-2', 'CA-5', 'PL-2', 'SA-4']
            }
        },
        {
            id: 'FRR-RSC-07',
            title: 'API Capability',
            description: '100% of security settings configurable via AWS CLI/API. All security configurations documented with corresponding API and CLI commands.',
            awsServices: ['AWS CLI', 'AWS SDK', 'All Services'],
            category: 'Automation',
            implementation: {
                overview: 'Automate all security configurations using Infrastructure as Code (IaC) with CloudFormation, Terraform, or CDK, ensuring reproducible and auditable deployments.',
                steps: [
                    'Define all security configurations in CloudFormation or Terraform (never manual console changes)',
                    'Store IaC templates in CodeCommit or GitHub with branch protection and PR reviews',
                    'Implement CI/CD pipeline with cfn-lint, checkov, and tfsec security scanning',
                    'Use AWS CDK for complex constructs that require programmatic logic',
                    'Deploy via CodePipeline with manual approval gates for production changes',
                    'Tag all resources with iac-managed=true to detect console-created resources',
                    'Implement drift detection Lambda that runs daily and alerts on unmanaged resources'
                ],
                cliExamples: [
                    { title: 'Validate CloudFormation', cmd: 'cfn-lint template.yaml && aws cloudformation validate-template --template-body file://template.yaml' },
                    { title: 'Checkov Security Scan', cmd: 'checkov -d . --framework cloudformation --check CKV_AWS_18,CKV_AWS_19,CKV_AWS_21,CKV_AWS_145' },
                    { title: 'Deploy with CDK', cmd: 'cdk deploy --require-approval broadening --context environment=govcloud FedRAMPBaselineStack' },
                    { title: 'Find Unmanaged Resources', cmd: 'aws resourcegroupstaggingapi get-resources --tag-filters Key=iac-managed,Values=false --resource-type-filters ec2:instance,rds:db,s3' }
                ],
                verification: [
                    'All production resources are IaC-managed (zero untagged resources)',
                    'CI/CD pipeline includes security scanning with zero critical findings',
                    'Change history fully traceable via Git commits and CloudFormation events',
                    'Manual console changes trigger automated alerts within 15 minutes'
                ],
                architectureNotes: 'The goal is "everything as code" — security configurations, network topology, IAM policies, monitoring rules. This enables reproducibility, auditability, and rapid disaster recovery. Use separate IaC repos per account/workload with shared modules for common patterns.',
                relatedControls: ['CM-2', 'CM-3', 'CM-5', 'SA-10', 'SA-15']
            }
        },
        {
            id: 'FRR-RSC-08',
            title: 'Machine-Readable Guidance',
            description: 'OSCAL 1.1.2 component definitions for all services. Provides Open Security Controls Assessment Language formatted guidance for automated consumption.',
            awsServices: ['OSCAL 1.1.2'],
            category: 'Automation',
            implementation: {
                overview: 'Consume and integrate OSCAL-formatted security guidance into your compliance automation pipeline for continuous assessment and documentation.',
                steps: [
                    'Parse OSCAL component definitions using oscal-cli or a Python OSCAL library',
                    'Map component statements to your SSP control implementations automatically',
                    'Generate SSP appendices from OSCAL data (service-by-service control narratives)',
                    'Integrate OSCAL assessment results with your continuous monitoring pipeline',
                    'Use OSCAL catalog and profile models to track baseline applicability',
                    'Automate POA&M generation from OSCAL assessment results'
                ],
                cliExamples: [
                    { title: 'Validate OSCAL Document', cmd: 'oscal-cli validate --as component-definition FRR-RSC-component-definition.json' },
                    { title: 'Convert OSCAL Formats', cmd: 'oscal-cli convert --to xml FRR-RSC-component-definition.json > component-definition.xml' },
                    { title: 'Python OSCAL Parsing', cmd: 'python3 -c "import json; data=json.load(open(\'component-definition.json\')); print(len(data[\'component-definition\'][\'components\']),\'components\')"' }
                ],
                verification: [
                    'OSCAL documents pass schema validation via oscal-cli',
                    'All 161 AWS service components have control implementation statements',
                    'Generated SSP appendices match FedRAMP template requirements',
                    'OSCAL assessment results integrate with GRC tool without manual intervention'
                ],
                architectureNotes: 'OSCAL is the future of compliance automation. FedRAMP is moving toward OSCAL-native submissions. Investing in OSCAL tooling now will reduce assessment effort by 40-60% and enable continuous authorization. Consider tools like Trestle (IBM), Compliance-trestle, or RegScale for OSCAL lifecycle management.',
                relatedControls: ['CA-2', 'CA-7', 'PL-2', 'SA-4']
            }
        },
        {
            id: 'FRR-RSC-09',
            title: 'Publish Guidance',
            description: 'Publicly accessible web interface and downloadable artifacts. All guidance published at docs.aws.amazon.com/fedramp with downloadable OSCAL files.',
            awsServices: ['AWS Documentation'],
            category: 'Documentation',
            implementation: {
                overview: 'Access and integrate published AWS FedRAMP guidance into your compliance documentation workflow.',
                steps: [
                    'Bookmark docs.aws.amazon.com/fedramp as your primary reference for AWS security configurations',
                    'Download per-service configuration guides for each AWS service in your boundary',
                    'Map published guidance to your SSP control implementation narratives',
                    'Subscribe to AWS Security Blog and FedRAMP PMO updates for guidance changes',
                    'Maintain a local copy of all referenced guidance documents for 3PAO evidence'
                ],
                cliExamples: [
                    { title: 'Download All Guidance', cmd: 'wget -r -np -nH --cut-dirs=3 https://docs.aws.amazon.com/fedramp/latest/userguide/ -P ./aws-fedramp-guidance/' }
                ],
                verification: [
                    'All AWS services in authorization boundary have corresponding FRR-RSC guidance downloaded',
                    'SSP references specific FRR-RSC document versions',
                    'Guidance documents are stored in evidence repository with timestamps'
                ],
                architectureNotes: 'Treat published guidance as living documents. Version-pin your references in the SSP and update during annual assessments. AWS updates guidance quarterly — track changes via the release history page.',
                relatedControls: ['PL-2', 'SA-4', 'SA-5']
            }
        },
        {
            id: 'FRR-RSC-10',
            title: 'Versioning and Release History',
            description: 'Version-controlled guidance with change tracking. Maintains a complete history of changes to security configuration guidance.',
            awsServices: ['AWS Documentation'],
            category: 'Documentation',
            implementation: {
                overview: 'Track and respond to changes in AWS FedRAMP guidance to maintain continuous compliance.',
                steps: [
                    'Monitor the FRR-RSC release history page for updates (check monthly)',
                    'Compare new guidance versions against your current SSP implementation narratives',
                    'Update SSP control implementations when guidance changes affect your boundary',
                    'Document guidance version references in SSP Appendix (e.g., "FRR-RSC v2.1, dated 2025-12-01")',
                    'Notify 3PAO of material guidance changes that affect assessment scope',
                    'Maintain a changelog of your SSP updates triggered by guidance changes'
                ],
                cliExamples: [
                    { title: 'Diff Guidance Versions', cmd: 'diff <(jq . FRR-RSC-v2.0.json) <(jq . FRR-RSC-v2.1.json) > guidance-changes.diff' }
                ],
                verification: [
                    'SSP references current FRR-RSC version (not outdated)',
                    'Changelog documents all SSP updates triggered by guidance changes',
                    '3PAO has been notified of material changes since last assessment'
                ],
                architectureNotes: 'Guidance versioning is critical for audit trail. Pin specific versions in your SSP and update systematically. Use a compliance calendar to schedule quarterly guidance reviews aligned with ConMon deliverable cycles.',
                relatedControls: ['CA-7', 'CM-3', 'PL-2']
            }
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
