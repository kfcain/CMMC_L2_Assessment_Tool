// AWS GovCloud Implementation Guide - Client Resources
// Structured data for CMMC L2 deployment in AWS GovCloud

const AWS_GOVCLOUD_IMPL_GUIDE = {
    // 8-Week Implementation Timeline
    projectPlan: [
        { phase: "1. Foundation", week: 1, taskId: "T-1.1", task: "Provision AWS GovCloud Account via AWS Organizations", owner: "Cloud Admin", accountable: "IT Director", deliverable: "GovCloud Account Active" },
        { phase: "1. Foundation", week: 1, taskId: "T-1.2", task: "Configure AWS IAM Identity Center (SSO) with MFA", owner: "Cloud Admin", accountable: "FSO", deliverable: "SSO Configured" },
        { phase: "1. Foundation", week: 1, taskId: "T-1.3", task: "Enable AWS CloudTrail in all regions", owner: "Cloud Admin", accountable: "FSO", deliverable: "CloudTrail Logs Active" },
        { phase: "1. Foundation", week: 1, taskId: "T-1.4", task: "Deploy AWS Config Rules for NIST 800-171", owner: "Cloud Admin", accountable: "FSO", deliverable: "Config Rules Active" },
        { phase: "1. Foundation", week: 2, taskId: "T-2.1", task: "Configure VPC with private subnets and NAT Gateway", owner: "Cloud Admin", accountable: "IT Director", deliverable: "VPC Deployed" },
        { phase: "1. Foundation", week: 2, taskId: "T-2.2", task: "Deploy AWS Client VPN with certificate auth", owner: "Cloud Admin", accountable: "FSO", deliverable: "VPN Endpoint Active" },
        { phase: "1. Foundation", week: 2, taskId: "T-2.3", task: "Enable AWS KMS with FIPS 140-2 validated HSMs", owner: "Cloud Admin", accountable: "FSO", deliverable: "KMS Keys Created" },
        { phase: "2. Security", week: 3, taskId: "T-3.1", task: "Deploy AWS Security Hub with NIST 800-171 standard", owner: "SecOps", accountable: "FSO", deliverable: "Security Hub Active" },
        { phase: "2. Security", week: 3, taskId: "T-3.2", task: "Configure Amazon GuardDuty for threat detection", owner: "SecOps", accountable: "FSO", deliverable: "GuardDuty Active" },
        { phase: "2. Security", week: 3, taskId: "T-3.3", task: "Deploy AWS WAF on ALBs and CloudFront", owner: "Cloud Admin", accountable: "IT Director", deliverable: "WAF Rules Active" },
        { phase: "2. Security", week: 4, taskId: "T-4.1", task: "Configure Amazon Macie for CUI data discovery", owner: "SecOps", accountable: "FSO", deliverable: "Macie Jobs Running" },
        { phase: "2. Security", week: 4, taskId: "T-4.2", task: "Deploy AWS Systems Manager for endpoint management", owner: "Cloud Admin", accountable: "IT Director", deliverable: "SSM Agents Deployed" },
        { phase: "3. Governance", week: 5, taskId: "T-5.1", task: "Configure AWS Organizations SCPs for guardrails", owner: "Cloud Admin", accountable: "FSO", deliverable: "SCPs Applied" },
        { phase: "3. Governance", week: 5, taskId: "T-5.2", task: "Deploy AWS Control Tower (if multi-account)", owner: "Cloud Admin", accountable: "IT Director", deliverable: "Control Tower Active" },
        { phase: "3. Governance", week: 6, taskId: "T-6.1", task: "Configure AWS Backup with vault lock", owner: "Cloud Admin", accountable: "FSO", deliverable: "Backup Vaults Locked" },
        { phase: "3. Governance", week: 6, taskId: "T-6.2", task: "Deploy Amazon Inspector for vulnerability scanning", owner: "SecOps", accountable: "FSO", deliverable: "Inspector Scans Active" },
        { phase: "4. Audit Prep", week: 7, taskId: "T-7.1", task: "Run AWS Audit Manager NIST 800-171 assessment", owner: "FSO", accountable: "Exec Sponsor", deliverable: "Audit Report" },
        { phase: "4. Audit Prep", week: 7, taskId: "T-7.2", task: "Export CloudTrail logs to S3 with Object Lock", owner: "Cloud Admin", accountable: "FSO", deliverable: "Immutable Log Archive" },
        { phase: "4. Audit Prep", week: 8, taskId: "T-8.1", task: "Generate evidence artifacts via AWS CLI scripts", owner: "Cloud Admin", accountable: "FSO", deliverable: "JSON Evidence Files" },
        { phase: "4. Audit Prep", week: 8, taskId: "T-8.2", task: "Finalize & Sign SSP", owner: "FSO", accountable: "Exec Sponsor", deliverable: "Signed SSP" }
    ],

    // Recurring Operations
    recurringOps: [
        { frequency: "Daily", activity: "GuardDuty Finding Review", owner: "SecOps", purpose: "Review high/medium severity findings." },
        { frequency: "Weekly", activity: "Security Hub Score Review", owner: "FSO", purpose: "Check NIST 800-171 compliance score." },
        { frequency: "Weekly", activity: "Inspector Vulnerability Review", owner: "Cloud Admin", purpose: "Patch critical CVEs within 7 days." },
        { frequency: "Monthly", activity: "IAM Access Review", owner: "FSO + HR", purpose: "Review IAM users/roles. Remove stale access." },
        { frequency: "Quarterly", activity: "Penetration Test", owner: "SecOps", purpose: "Conduct authorized pen test via AWS marketplace." },
        { frequency: "Annually", activity: "Audit Manager Assessment", owner: "FSO", purpose: "Full NIST 800-171 compliance assessment." }
    ],

    // SSP Conformity Statements
    sspStatements: {
        "3.1.1": "The organization utilizes AWS IAM Identity Center (SSO) as the central Identity Provider for AWS GovCloud. Authorized users are identified by unique usernames federated from the corporate identity provider. Access is limited via IAM policies and Service Control Policies (SCPs).",
        "3.1.5": "Privileged access is managed via AWS IAM with least-privilege policies. Administrative actions require MFA. AWS CloudTrail logs all API calls for audit. Temporary credentials are used via IAM Roles where possible.",
        "3.1.12": "Remote access to AWS GovCloud resources is controlled via AWS Client VPN with certificate-based authentication. VPN connections require MFA. All traffic is encrypted using TLS 1.2+. Session logs are captured in CloudWatch.",
        "3.3.1": "Audit logs are generated by AWS CloudTrail (management and data events) and stored in S3 with Object Lock for immutability. Logs are retained for 365+ days. AWS Config records resource configuration changes continuously.",
        "3.4.1": "Baseline configurations are enforced via AWS Config Rules aligned with NIST 800-171. Non-compliant resources trigger SNS alerts and auto-remediation via Lambda. AWS Systems Manager maintains patch compliance.",
        "3.5.3": "Multifactor Authentication (MFA) is enforced for all IAM users and federated access via IAM Identity Center. Hardware MFA tokens or virtual MFA apps are required. Root account MFA uses hardware tokens stored in a safe.",
        "3.13.8": "CUI in transit is protected using TLS 1.2+ enforced via ALB/NLB security policies. AWS Certificate Manager provisions certificates. VPN uses IPsec with AES-256. API Gateway enforces HTTPS-only.",
        "3.13.11": "CUI at rest is protected using AWS KMS with FIPS 140-2 Level 3 validated HSMs (AWS GovCloud). S3 buckets use SSE-KMS. EBS volumes use encrypted AMIs. RDS uses encrypted storage.",
        "3.14.1": "System flaws are identified via Amazon Inspector (CVE scanning) and AWS Security Hub. Patches are deployed via AWS Systems Manager Patch Manager within defined maintenance windows."
    },

    // Evidence Collection Strategy
    evidenceStrategy: [
        { domain: "Access Control", artifact: "iam_policies.json", source: "AWS CLI", command: "aws iam list-policies --scope Local --output json", proves: "IAM policies defined" },
        { domain: "Access Control", artifact: "iam_users_mfa.json", source: "AWS CLI", command: "aws iam list-users | jq -r '.Users[].UserName' | xargs -I {} aws iam list-mfa-devices --user-name {}", proves: "MFA enabled for users" },
        { domain: "Access Control", artifact: "sso_instances.json", source: "AWS CLI", command: "aws sso-admin list-instances --output json", proves: "SSO configured" },
        { domain: "Audit & Accountability", artifact: "cloudtrail_trails.json", source: "AWS CLI", command: "aws cloudtrail describe-trails --output json", proves: "CloudTrail enabled" },
        { domain: "Audit & Accountability", artifact: "config_rules.json", source: "AWS CLI", command: "aws configservice describe-config-rules --output json", proves: "Config rules active" },
        { domain: "Config Management", artifact: "ssm_compliance.json", source: "AWS CLI", command: "aws ssm list-compliance-summaries --output json", proves: "Patch compliance status" },
        { domain: "Risk Assessment", artifact: "inspector_findings.json", source: "AWS CLI", command: "aws inspector2 list-findings --filter-criteria '{\"severity\":[{\"comparison\":\"EQUALS\",\"value\":\"CRITICAL\"}]}' --output json", proves: "Vulnerability findings" },
        { domain: "Security Assessment", artifact: "securityhub_standards.json", source: "AWS CLI", command: "aws securityhub get-enabled-standards --output json", proves: "Security standards enabled" },
        { domain: "System Protection", artifact: "vpc_flow_logs.json", source: "AWS CLI", command: "aws ec2 describe-flow-logs --output json", proves: "VPC flow logs enabled" },
        { domain: "System Protection", artifact: "kms_keys.json", source: "AWS CLI", command: "aws kms list-keys --output json", proves: "KMS encryption keys" }
    ],

    // Policy Templates
    policyTemplates: {
        accessControl: {
            title: "AWS Access Control Policy",
            purpose: "To limit AWS resource access to authorized users via IAM.",
            sections: [
                { heading: "IAM User Management", items: ["All users access AWS via IAM Identity Center (SSO).", "Direct IAM users are prohibited except for service accounts.", "Service accounts use IAM Roles with scoped permissions."] },
                { heading: "MFA Requirements", items: ["MFA is required for all human users.", "Root account uses hardware MFA stored in a safe.", "Programmatic access uses temporary credentials via STS."] },
                { heading: "Least Privilege", items: ["IAM policies follow least-privilege principle.", "Wildcard (*) actions are prohibited in production.", "Access is reviewed quarterly and stale permissions removed."] }
            ]
        },
        logging: {
            title: "AWS Logging & Monitoring Policy",
            purpose: "To ensure comprehensive audit logging of all AWS activity.",
            sections: [
                { heading: "CloudTrail", items: ["CloudTrail is enabled in all regions.", "Management and data events are logged.", "Logs are stored in S3 with Object Lock (WORM)."] },
                { heading: "Retention", items: ["CloudTrail logs retained for 365+ days.", "S3 access logs enabled on all CUI buckets.", "VPC Flow Logs enabled for all VPCs."] },
                { heading: "Alerting", items: ["GuardDuty findings trigger SNS notifications.", "Security Hub critical findings page SecOps on-call.", "CloudWatch Alarms monitor for unauthorized API calls."] }
            ]
        },
        encryption: {
            title: "AWS Encryption Policy",
            purpose: "To protect CUI using FIPS 140-2 validated cryptography.",
            sections: [
                { heading: "Data at Rest", items: ["All S3 buckets use SSE-KMS encryption.", "EBS volumes use encrypted AMIs by default.", "RDS instances use encrypted storage."] },
                { heading: "Data in Transit", items: ["TLS 1.2+ required on all endpoints.", "ALB security policies enforce modern ciphers.", "VPN uses IPsec with AES-256-GCM."] },
                { heading: "Key Management", items: ["KMS keys use FIPS 140-2 Level 3 HSMs (GovCloud).", "Key rotation enabled (annual).", "Key policies restrict access to authorized roles."] }
            ]
        }
    },

    // AWS Services for CMMC
    awsServices: [
        { control: "3.1.x (AC)", service: "IAM Identity Center", purpose: "Centralized identity and MFA enforcement" },
        { control: "3.1.x (AC)", service: "IAM Policies & SCPs", purpose: "Least-privilege access control" },
        { control: "3.3.x (AU)", service: "CloudTrail", purpose: "API audit logging" },
        { control: "3.3.x (AU)", service: "AWS Config", purpose: "Resource configuration tracking" },
        { control: "3.4.x (CM)", service: "Systems Manager", purpose: "Patch management and baselines" },
        { control: "3.5.x (IA)", service: "IAM MFA", purpose: "Multi-factor authentication" },
        { control: "3.6.x (IR)", service: "GuardDuty + EventBridge", purpose: "Threat detection and automated response" },
        { control: "3.11.x (RA)", service: "Inspector", purpose: "Vulnerability scanning" },
        { control: "3.12.x (CA)", service: "Security Hub + Audit Manager", purpose: "Compliance monitoring and assessments" },
        { control: "3.13.x (SC)", service: "KMS + ACM", purpose: "FIPS encryption and certificate management" },
        { control: "3.14.x (SI)", service: "GuardDuty + Macie", purpose: "Threat detection and data classification" }
    ],

    // FedRAMP Authorized AWS Services
    fedrampServices: [
        { category: "Compute", service: "EC2, Lambda, ECS, EKS", authorization: "FedRAMP High" },
        { category: "Storage", service: "S3, EBS, EFS, Glacier", authorization: "FedRAMP High" },
        { category: "Database", service: "RDS, DynamoDB, Aurora", authorization: "FedRAMP High" },
        { category: "Security", service: "IAM, KMS, CloudTrail, GuardDuty", authorization: "FedRAMP High" },
        { category: "Networking", service: "VPC, CloudFront, Route 53", authorization: "FedRAMP High" },
        { category: "Management", service: "CloudWatch, Config, Systems Manager", authorization: "FedRAMP High" }
    ],

    // Service Control Policy Examples
    scpExamples: [
        { name: "Deny Non-GovCloud Regions", description: "Prevent resources in commercial regions", policy: '{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"*","Resource":"*","Condition":{"StringNotEquals":{"aws:RequestedRegion":["us-gov-west-1","us-gov-east-1"]}}}]}' },
        { name: "Require S3 Encryption", description: "Deny unencrypted S3 uploads", policy: '{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"s3:PutObject","Resource":"*","Condition":{"Null":{"s3:x-amz-server-side-encryption":"true"}}}]}' },
        { name: "Require MFA for Sensitive Actions", description: "Require MFA for IAM changes", policy: '{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":["iam:*"],"Resource":"*","Condition":{"BoolIfExists":{"aws:MultiFactorAuthPresent":"false"}}}]}' }
    ]
};

// Helper functions
function getAWSGovCloudImplGuide() {
    return AWS_GOVCLOUD_IMPL_GUIDE;
}
