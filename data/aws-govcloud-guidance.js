// AWS GovCloud Implementation Guidance
// Provides automation tips and human intervention notes for each assessment objective

const AWS_GOVCLOUD_GUIDANCE = {
    // === ACCESS CONTROL (AC) ===
    "3.1.1[a]": {
        automation: "Use AWS IAM Identity Center (SSO) to manage users. Query users via AWS CLI: `aws iam list-users`. Integrate with external IdP via SAML/SCIM.",
        awsService: "IAM Identity Center, AWS IAM",
        humanIntervention: "Review and approve user list quarterly. Verify alignment with HR records.",
        docLink: "https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html"
    },
    "3.1.1[b]": {
        automation: "Use IAM Roles for service accounts. Query with `aws iam list-roles`. Monitor via CloudTrail and AWS Config rules.",
        awsService: "IAM Roles, CloudTrail, AWS Config",
        humanIntervention: "Document business justification for each IAM role. Review quarterly.",
        docLink: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html"
    },
    "3.1.1[c]": {
        automation: "Use AWS Systems Manager for device/instance inventory. Query managed instances via `aws ssm describe-instance-information`.",
        awsService: "Systems Manager, EC2",
        humanIntervention: "Approve instance deployments. Define compliance baseline requirements.",
        docLink: "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-inventory.html"
    },
    "3.1.1[d]": {
        automation: "Implement IAM policies with conditions requiring MFA. Use AWS Identity Center with MFA enforcement.",
        awsService: "IAM, Identity Center, MFA",
        humanIntervention: "Review IAM policy exceptions. Approve access for new user roles.",
        docLink: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html"
    },
    "3.1.1[e]": {
        automation: "Configure IAM roles with least privilege policies. Use IAM Access Analyzer to identify unused permissions.",
        awsService: "IAM, IAM Access Analyzer",
        humanIntervention: "Review and approve IAM role assignments for service accounts annually.",
        docLink: "https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-getting-started.html"
    },
    "3.1.1[f]": {
        automation: "Enforce instance compliance via Systems Manager State Manager. Block non-compliant instances with AWS Config rules.",
        awsService: "Systems Manager, AWS Config",
        humanIntervention: "Define instance compliance requirements. Review non-compliant instance reports.",
        docLink: "https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config.html"
    },
    "3.1.2[a]": {
        automation: "Define IAM policies and permission boundaries. Use AWS Organizations SCPs for guardrails.",
        awsService: "IAM, Organizations SCPs",
        humanIntervention: "Required - Define role definitions with business stakeholders. Map job functions to IAM policies.",
        docLink: "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html"
    },
    "3.1.2[b]": {
        automation: "Assign IAM policies via CloudFormation/Terraform. Use temporary credentials via STS AssumeRole.",
        awsService: "IAM, STS, CloudFormation",
        humanIntervention: "Approve role assumption requests. Conduct quarterly access reviews.",
        docLink: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html"
    },
    "3.1.3[a]": {
        automation: "Define data classification tags. Use AWS Macie for sensitive data discovery. Create S3 bucket policies for CUI.",
        awsService: "Amazon Macie, S3, Resource Tags",
        humanIntervention: "Required - Define CUI categories and flow rules with data owners.",
        docLink: "https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html"
    },
    "3.1.3[b]": {
        automation: "Implement VPC flow logs and Security Groups/NACLs. Use AWS Network Firewall for traffic inspection.",
        awsService: "VPC, Security Groups, Network Firewall",
        humanIntervention: "Review VPC flow log anomalies. Approve legitimate data transfers.",
        docLink: "https://docs.aws.amazon.com/network-firewall/latest/developerguide/what-is-aws-network-firewall.html"
    },
    "3.1.3[c]": {
        automation: "Tag resources with CUI classification via AWS Config. Use VPC endpoints for private connectivity.",
        awsService: "AWS Config, VPC Endpoints, Resource Tags",
        humanIntervention: "Required - Identify and document CUI data sources and destinations.",
        docLink: "https://docs.aws.amazon.com/config/latest/developerguide/tagging.html"
    },
    "3.1.3[d]": {
        automation: "Define S3 bucket policies and IAM policies for data access. Use Lake Formation for data lake governance.",
        awsService: "S3, IAM, Lake Formation",
        humanIntervention: "Required - Approve CUI flow authorizations with business justification.",
        docLink: "https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html"
    },
    "3.1.3[e]": {
        automation: "Enable Macie sensitive data jobs. Monitor findings in Security Hub.",
        awsService: "Macie, Security Hub",
        humanIntervention: "Review Macie findings weekly. Handle exceptions and false positives.",
        docLink: "https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html"
    },
    "3.1.4[a]": {
        automation: "Document separation of duties matrix. Use IAM permission boundaries and SCPs to enforce separation.",
        awsService: "IAM, Organizations SCPs",
        humanIntervention: "Required - Define which duties require separation based on risk assessment.",
        docLink: "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html"
    },
    "3.1.4[b]": {
        automation: "Assign users to separate IAM groups for conflicting roles. Use STS session policies for temporary access.",
        awsService: "IAM Groups, STS",
        humanIntervention: "Assign personnel to roles. Review assignments ensuring separation.",
        docLink: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html"
    },
    "3.1.4[c]": {
        automation: "Configure IAM policies to prevent conflicting permissions. Use AWS Config rules to detect violations.",
        awsService: "IAM, AWS Config",
        humanIntervention: "Review access conflicts quarterly. Approve dual-role exceptions.",
        docLink: "https://docs.aws.amazon.com/config/latest/developerguide/iam-user-no-policies-check.html"
    },
    "3.1.5[a]": {
        automation: "Use IAM Access Analyzer to identify least privilege. Enable CloudTrail for access logging.",
        awsService: "IAM Access Analyzer, CloudTrail",
        humanIntervention: "Required - Define minimum necessary access per job function.",
        docLink: "https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-policy-generation.html"
    },
    "3.1.5[b]": {
        automation: "Implement IAM policies using policy generator recommendations. Regular access reviews via IAM Access Analyzer.",
        awsService: "IAM, Access Analyzer",
        humanIntervention: "Approve access changes. Conduct quarterly privilege reviews.",
        docLink: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
    },
    "3.1.6[a]": {
        automation: "Require MFA for all IAM users. Use hardware tokens or virtual MFA via IAM.",
        awsService: "IAM MFA",
        humanIntervention: "Distribute and register MFA devices. Handle lost device recovery.",
        docLink: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html"
    },
    "3.1.6[b]": {
        automation: "Require MFA for privileged operations via IAM policy conditions. Use STS with MFA for console access.",
        awsService: "IAM, STS",
        humanIntervention: "Define which operations require MFA. Handle emergency access.",
        docLink: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_configure-api-require.html"
    },
    "3.1.7[a]": {
        automation: "Use AWS Secrets Manager for credential storage. Enforce credential rotation policies.",
        awsService: "Secrets Manager, IAM",
        humanIntervention: "Required - Define privileged functions requiring additional controls.",
        docLink: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html"
    },
    "3.1.7[b]": {
        automation: "Implement session duration limits in IAM roles. Use CloudWatch alarms for unusual activity.",
        awsService: "IAM, CloudWatch",
        humanIntervention: "Monitor privileged access logs. Investigate anomalies.",
        docLink: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html"
    },
    "3.1.8[a]": {
        automation: "Implement session locks via Amazon WorkSpaces timeout policies. Use CloudWatch alarms for idle sessions.",
        awsService: "WorkSpaces, CloudWatch",
        humanIntervention: "Required - Define inactivity timeout periods.",
        docLink: "https://docs.aws.amazon.com/workspaces/latest/adminguide/group_policy.html"
    },
    "3.1.8[b]": {
        automation: "Configure WorkSpaces session timeout. Use Lambda to terminate idle EC2 instances.",
        awsService: "WorkSpaces, Lambda, EC2",
        humanIntervention: "Review locked session reports. Handle user complaints.",
        docLink: "https://docs.aws.amazon.com/workspaces/latest/adminguide/security-groups.html"
    },
    "3.1.10[a]": {
        automation: "Configure IAM role session duration limits. Use STS temporary credentials with short TTL.",
        awsService: "IAM, STS",
        humanIntervention: "Required - Define session timeout and lock requirements.",
        docLink: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html"
    },
    "3.1.10[b]": {
        automation: "Implement automatic session termination via Lambda. Use CloudWatch Events for session monitoring.",
        awsService: "Lambda, CloudWatch Events",
        humanIntervention: "Review terminated session logs. Handle user escalations.",
        docLink: "https://docs.aws.amazon.com/lambda/latest/dg/services-cloudwatchevents.html"
    },
    "3.1.12[a]": {
        automation: "Use AWS Client VPN or Site-to-Site VPN for remote access. Configure VPN access policies.",
        awsService: "Client VPN, Site-to-Site VPN",
        humanIntervention: "Required - Define remote access requirements and monitoring procedures.",
        docLink: "https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/what-is.html"
    },
    "3.1.12[b]": {
        automation: "Monitor VPN connections via CloudWatch. Use VPC flow logs for traffic analysis.",
        awsService: "CloudWatch, VPC Flow Logs",
        humanIntervention: "Review remote access logs daily. Investigate anomalies.",
        docLink: "https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html"
    },
    "3.1.13[a]": {
        automation: "Implement AWS Verified Access for ZTNA. Use cryptographic modules for TLS termination.",
        awsService: "Verified Access, ACM, CloudFront",
        humanIntervention: "Required - Define cryptographic mechanism requirements.",
        docLink: "https://docs.aws.amazon.com/verified-access/latest/ug/what-is-verified-access.html"
    },
    "3.1.13[b]": {
        automation: "Configure TLS 1.2+ on all load balancers and CloudFront. Use ACM for certificate management.",
        awsService: "ALB/NLB, CloudFront, ACM",
        humanIntervention: "Review certificate expiration alerts. Renew certificates as needed.",
        docLink: "https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html"
    },
    "3.1.14[a]": {
        automation: "Use AWS Systems Manager Session Manager for bastion-free access. Configure VPC endpoints.",
        awsService: "Session Manager, VPC Endpoints",
        humanIntervention: "Required - Define routing requirements for CUI access.",
        docLink: "https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html"
    },
    "3.1.14[b]": {
        automation: "Configure VPC route tables for controlled egress. Use Transit Gateway for hub-spoke routing.",
        awsService: "VPC, Transit Gateway",
        humanIntervention: "Review and approve routing changes. Conduct network architecture reviews.",
        docLink: "https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html"
    },
    "3.1.20[a]": {
        automation: "Use AWS Client VPN with certificate-based auth. Configure VPN connection policies.",
        awsService: "Client VPN, Direct Connect",
        humanIntervention: "Required - Define authorized external system connections.",
        docLink: "https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/cvpn-getting-started.html"
    },
    "3.1.20[b]": {
        automation: "Monitor VPN and Direct Connect connections. Use CloudWatch alarms for connection status.",
        awsService: "CloudWatch, VPN",
        humanIntervention: "Verify authorized connections monthly. Review connection logs.",
        docLink: "https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html"
    },
    "3.1.21[a]": {
        automation: "Use AWS Client VPN or WorkSpaces for portable device access. Configure device trust policies.",
        awsService: "Client VPN, WorkSpaces",
        humanIntervention: "Required - Define authorized uses of portable storage.",
        docLink: "https://docs.aws.amazon.com/workspaces/latest/adminguide/manage-workspaces-directory.html"
    },
    "3.1.21[b]": {
        automation: "Enable S3 Block Public Access. Use Macie to detect CUI on unauthorized storage.",
        awsService: "S3, Macie",
        humanIntervention: "Review portable device access logs. Enforce storage policies.",
        docLink: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html"
    },
    "3.1.22[a]": {
        automation: "Configure VPC security groups to deny public WiFi access patterns. Use Network Firewall.",
        awsService: "Security Groups, Network Firewall",
        humanIntervention: "Required - Define publicly accessible system requirements.",
        docLink: "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html"
    },
    "3.1.22[b]": {
        automation: "Implement WAF rules for public-facing systems. Monitor with Security Hub.",
        awsService: "WAF, Security Hub",
        humanIntervention: "Review public access logs. Approve CUI access on public systems.",
        docLink: "https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html"
    },

    // === AWARENESS AND TRAINING (AT) ===
    "3.2.1[a]": {
        automation: "Integrate with LMS via AWS Lambda and API Gateway. Track completion in DynamoDB.",
        awsService: "Lambda, API Gateway, DynamoDB",
        humanIntervention: "Required - Develop security awareness training content. Review annually.",
        docLink: "https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/security.html"
    },
    "3.2.1[b]": {
        automation: "Generate training completion reports from DynamoDB. Alert on non-compliance via SNS.",
        awsService: "DynamoDB, SNS, QuickSight",
        humanIntervention: "Follow up with users missing training. Update content based on incidents.",
        docLink: "https://aws.amazon.com/training/digital/"
    },
    "3.2.2[a]": {
        automation: "Track role assignments in IAM Identity Center. Correlate with training records.",
        awsService: "IAM Identity Center, CloudTrail",
        humanIntervention: "Required - Define role-specific training requirements.",
        docLink: "https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-idp.html"
    },
    "3.2.2[b]": {
        automation: "Block access for users missing role training via IAM policies. Auto-notify via SNS.",
        awsService: "IAM, SNS, Lambda",
        humanIntervention: "Deliver specialized training. Track hands-on exercises.",
        docLink: "https://aws.amazon.com/training/learn-about/security/"
    },
    "3.2.3[a]": {
        automation: "Integrate insider threat training with LMS. Track completion in training database.",
        awsService: "Lambda, DynamoDB",
        humanIntervention: "Required - Develop insider threat awareness content. Annual updates.",
        docLink: "https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/incident-response.html"
    },
    "3.2.3[b]": {
        automation: "Generate compliance reports. Send reminders via SNS for incomplete training.",
        awsService: "SNS, CloudWatch",
        humanIntervention: "Evaluate training effectiveness. Update based on threat intelligence.",
        docLink: "https://aws.amazon.com/compliance/shared-responsibility-model/"
    },

    // === AUDIT AND ACCOUNTABILITY (AU) ===
    "3.3.1[a]": {
        automation: "Enable CloudTrail for all regions. Configure S3 access logging. Enable VPC flow logs.",
        awsService: "CloudTrail, S3, VPC Flow Logs",
        humanIntervention: "Required - Define audit event types per system component.",
        docLink: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html"
    },
    "3.3.1[b]": {
        automation: "Aggregate logs to CloudWatch Logs. Configure log retention policies.",
        awsService: "CloudWatch Logs, S3",
        humanIntervention: "Review audit log configurations quarterly. Ensure coverage.",
        docLink: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html"
    },
    "3.3.1[c]": {
        automation: "Create CloudWatch dashboards for audit metrics. Set up SNS alerts for critical events.",
        awsService: "CloudWatch, SNS",
        humanIntervention: "Coordinate audit requirements with stakeholders.",
        docLink: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html"
    },
    "3.3.2[a]": {
        automation: "Use CloudTrail event selectors to capture user identity. Configure AWS Config for attribution.",
        awsService: "CloudTrail, AWS Config",
        humanIntervention: "Required - Define accountability requirements.",
        docLink: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference.html"
    },
    "3.3.2[b]": {
        automation: "Enable CloudTrail management and data events. Ensure IAM user names are logged.",
        awsService: "CloudTrail, IAM",
        humanIntervention: "Review audit trails for investigations. Verify attribution accuracy.",
        docLink: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-management-events-with-cloudtrail.html"
    },
    "3.3.3[a]": {
        automation: "Enable GuardDuty for threat detection. Configure Security Hub for compliance monitoring.",
        awsService: "GuardDuty, Security Hub",
        humanIntervention: "Required - Define unusual activity indicators.",
        docLink: "https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html"
    },
    "3.3.3[b]": {
        automation: "Configure GuardDuty anomaly detection. Set up EventBridge rules for automated response.",
        awsService: "GuardDuty, EventBridge",
        humanIntervention: "Review and triage GuardDuty findings. Investigate anomalies.",
        docLink: "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_findings.html"
    },
    "3.3.4[a]": {
        automation: "Configure CloudWatch Logs alarms for log failures. Monitor CloudTrail delivery status.",
        awsService: "CloudWatch, CloudTrail, SNS",
        humanIntervention: "Required - Define audit logging failure response procedures.",
        docLink: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html"
    },
    "3.3.4[b]": {
        automation: "Enable CloudTrail log file integrity validation. Set up SNS alerts for logging failures.",
        awsService: "CloudTrail, SNS, Lambda",
        humanIntervention: "Respond to logging failure alerts. Escalate as needed.",
        docLink: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html"
    },
    "3.3.5[a]": {
        automation: "Correlate logs using Amazon OpenSearch or Athena. Create cross-service dashboards.",
        awsService: "OpenSearch, Athena, QuickSight",
        humanIntervention: "Required - Define correlation and analysis requirements.",
        docLink: "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html"
    },
    "3.3.5[b]": {
        automation: "Use Amazon Detective for investigation. Create saved queries in Athena.",
        awsService: "Detective, Athena",
        humanIntervention: "Perform incident investigations. Document findings.",
        docLink: "https://docs.aws.amazon.com/detective/latest/userguide/what-is-detective.html"
    },
    "3.3.6[a]": {
        automation: "Enable S3 Object Lock for audit logs. Use CloudTrail log file integrity validation.",
        awsService: "S3 Object Lock, CloudTrail",
        humanIntervention: "Required - Define audit reduction and report requirements.",
        docLink: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html"
    },
    "3.3.6[b]": {
        automation: "Create Athena views for audit summaries. Generate scheduled reports via Lambda.",
        awsService: "Athena, Lambda, QuickSight",
        humanIntervention: "Review generated reports. Customize views as needed.",
        docLink: "https://docs.aws.amazon.com/athena/latest/ug/what-is.html"
    },
    "3.3.7[a]": {
        automation: "Use Amazon Time Sync Service for all instances. Configure NTP via Systems Manager.",
        awsService: "Time Sync Service, Systems Manager",
        humanIntervention: "Required - Define authoritative time source.",
        docLink: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/set-time.html"
    },
    "3.3.7[b]": {
        automation: "Verify time synchronization via CloudWatch agent. Alert on drift.",
        awsService: "CloudWatch, Systems Manager",
        humanIntervention: "Investigate time sync failures. Update configurations.",
        docLink: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html"
    },
    "3.3.8[a]": {
        automation: "Enable S3 Object Lock with WORM. Configure Glacier Vault Lock for archives.",
        awsService: "S3 Object Lock, Glacier Vault Lock",
        humanIntervention: "Required - Define audit log protection requirements.",
        docLink: "https://docs.aws.amazon.com/amazonglacier/latest/dev/vault-lock.html"
    },
    "3.3.8[b]": {
        automation: "Use S3 bucket policies to restrict log deletion. Enable MFA Delete.",
        awsService: "S3, IAM",
        humanIntervention: "Review log protection policies annually. Handle compliance audits.",
        docLink: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/MultiFactorAuthenticationDelete.html"
    },
    "3.3.9[a]": {
        automation: "Restrict CloudTrail and log access via IAM policies. Use S3 bucket policies.",
        awsService: "IAM, S3",
        humanIntervention: "Required - Define authorized audit log managers.",
        docLink: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-sharing-logs.html"
    },
    "3.3.9[b]": {
        automation: "Implement IAM policies limiting log management access. Enable CloudTrail access logging.",
        awsService: "IAM, CloudTrail",
        humanIntervention: "Review audit management access quarterly. Update as roles change.",
        docLink: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/security-iam.html"
    },

    // Default fallback
    "_default": {
        automation: "Automation guidance not yet available for this objective. Check AWS Well-Architected Framework and GovCloud documentation.",
        awsService: "Consult AWS GovCloud documentation for applicable services",
        humanIntervention: "Review objective requirements manually and define implementation approach.",
        docLink: "https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/welcome.html"
    }
};

// Helper function to get guidance for an objective
function getAWSGovCloudGuidance(objectiveId) {
    return AWS_GOVCLOUD_GUIDANCE[objectiveId] || AWS_GOVCLOUD_GUIDANCE["_default"];
}
