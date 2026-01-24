// GCP / Google Workspace Implementation Guidance
// Provides automation tips and human intervention notes for each assessment objective

const GCP_GUIDANCE = {
    // === ACCESS CONTROL (AC) ===
    "3.1.1[a]": {
        automation: "Use Cloud Identity or Google Workspace Admin SDK to list users. Run `gcloud identity groups memberships list`. Integrate with external IdP via SAML.",
        gcpService: "Cloud Identity, Google Workspace",
        humanIntervention: "Review and approve user list quarterly. Verify alignment with HR records.",
        docLink: "https://cloud.google.com/identity/docs/overview"
    },
    "3.1.1[b]": {
        automation: "Use Service Accounts with Workload Identity. Query with `gcloud iam service-accounts list`. Monitor via Cloud Audit Logs.",
        gcpService: "IAM Service Accounts, Workload Identity",
        humanIntervention: "Document business justification for each service account. Review quarterly.",
        docLink: "https://cloud.google.com/iam/docs/service-accounts"
    },
    "3.1.1[c]": {
        automation: "Use Google Endpoint Management or BeyondCorp Enterprise for device management. Query enrolled devices via Admin SDK.",
        gcpService: "Endpoint Management, BeyondCorp Enterprise",
        humanIntervention: "Approve device enrollment requests. Define compliance baseline requirements.",
        docLink: "https://cloud.google.com/endpoint-management/docs"
    },
    "3.1.1[d]": {
        automation: "Implement Context-Aware Access policies requiring device trust + user auth. Enable 2-Step Verification.",
        gcpService: "BeyondCorp, Context-Aware Access",
        humanIntervention: "Review access level exceptions. Approve access for new user roles.",
        docLink: "https://cloud.google.com/context-aware-access/docs/overview"
    },
    "3.1.1[e]": {
        automation: "Configure Service Account permissions via IAM. Use Workload Identity Federation for external services.",
        gcpService: "IAM, Workload Identity Federation",
        humanIntervention: "Review and approve IAM role assignments for service accounts annually.",
        docLink: "https://cloud.google.com/iam/docs/workload-identity-federation"
    },
    "3.1.1[f]": {
        automation: "Enforce device compliance via BeyondCorp Enterprise + Context-Aware Access. Block non-compliant devices.",
        gcpService: "BeyondCorp Enterprise, Context-Aware Access",
        humanIntervention: "Define device compliance requirements. Review blocked device reports.",
        docLink: "https://cloud.google.com/beyondcorp-enterprise/docs"
    },
    "3.1.2[a]": {
        automation: "Define custom IAM roles and use predefined roles. Document role mappings in Policy Analyzer.",
        gcpService: "IAM Custom Roles, Policy Analyzer",
        humanIntervention: "Required - Define role definitions with business stakeholders. Map job functions to IAM roles.",
        docLink: "https://cloud.google.com/iam/docs/creating-custom-roles"
    },
    "3.1.2[b]": {
        automation: "Assign IAM roles via Terraform/Deployment Manager. Use IAM Conditions for time-bound access.",
        gcpService: "IAM, IAM Conditions",
        humanIntervention: "Approve privileged access requests. Conduct quarterly access reviews.",
        docLink: "https://cloud.google.com/iam/docs/conditions-overview"
    },
    "3.1.3[a]": {
        automation: "Define data classification using resource labels. Use Cloud DLP for sensitive data discovery.",
        gcpService: "Cloud DLP, Resource Labels",
        humanIntervention: "Required - Define CUI categories and flow rules with data owners.",
        docLink: "https://cloud.google.com/dlp/docs"
    },
    "3.1.3[b]": {
        automation: "Implement VPC Service Controls for data exfiltration prevention. Use Cloud Armor for edge protection.",
        gcpService: "VPC Service Controls, Cloud Armor",
        humanIntervention: "Review DLP incident reports. Approve legitimate data transfers.",
        docLink: "https://cloud.google.com/vpc-service-controls/docs/overview"
    },
    "3.1.3[c]": {
        automation: "Tag resources with CUI classification via labels. Use Data Catalog for data asset inventory.",
        gcpService: "Data Catalog, Resource Labels",
        humanIntervention: "Required - Identify and document CUI data sources and destinations.",
        docLink: "https://cloud.google.com/data-catalog/docs"
    },
    "3.1.3[d]": {
        automation: "Define IAM policies and VPC Service Controls for data access. Use Access Context Manager.",
        gcpService: "IAM, VPC Service Controls, Access Context Manager",
        humanIntervention: "Required - Approve CUI flow authorizations with business justification.",
        docLink: "https://cloud.google.com/access-context-manager/docs"
    },
    "3.1.3[e]": {
        automation: "Enable Cloud DLP scanning jobs. Monitor findings in Security Command Center.",
        gcpService: "Cloud DLP, Security Command Center",
        humanIntervention: "Review DLP findings weekly. Handle exceptions and false positives.",
        docLink: "https://cloud.google.com/security-command-center/docs"
    },
    "3.1.4[a]": {
        automation: "Document separation of duties matrix. Use IAM deny policies and organization policies.",
        gcpService: "IAM Deny Policies, Organization Policy",
        humanIntervention: "Required - Define which duties require separation based on risk assessment.",
        docLink: "https://cloud.google.com/iam/docs/deny-overview"
    },
    "3.1.4[b]": {
        automation: "Assign users to separate Google Groups for conflicting roles. Use IAM Conditions.",
        gcpService: "Google Groups, IAM Conditions",
        humanIntervention: "Assign personnel to roles. Review assignments ensuring separation.",
        docLink: "https://cloud.google.com/identity/docs/groups"
    },
    "3.1.4[c]": {
        automation: "Configure IAM deny policies to prevent conflicting permissions. Monitor with Policy Analyzer.",
        gcpService: "IAM Deny Policies, Policy Analyzer",
        humanIntervention: "Review access conflicts quarterly. Approve dual-role exceptions.",
        docLink: "https://cloud.google.com/iam/docs/deny-access"
    },
    "3.1.5[a]": {
        automation: "Use IAM Recommender for least privilege. Enable Cloud Audit Logs for access tracking.",
        gcpService: "IAM Recommender, Cloud Audit Logs",
        humanIntervention: "Required - Define minimum necessary access per job function.",
        docLink: "https://cloud.google.com/iam/docs/recommender-overview"
    },
    "3.1.5[b]": {
        automation: "Implement IAM policies using Recommender suggestions. Regular access reviews via Policy Analyzer.",
        gcpService: "IAM Recommender, Policy Analyzer",
        humanIntervention: "Approve access changes. Conduct quarterly privilege reviews.",
        docLink: "https://cloud.google.com/policy-intelligence/docs/policy-analyzer"
    },
    "3.1.6[a]": {
        automation: "Require 2-Step Verification for all users. Use hardware security keys or Google Authenticator.",
        gcpService: "2-Step Verification, Cloud Identity",
        humanIntervention: "Distribute and register security keys. Handle lost device recovery.",
        docLink: "https://cloud.google.com/identity/docs/how-to/setup-2sv"
    },
    "3.1.6[b]": {
        automation: "Require 2SV for privileged operations via Context-Aware Access. Use session controls.",
        gcpService: "Context-Aware Access, Session Controls",
        humanIntervention: "Define which operations require 2SV. Handle emergency access.",
        docLink: "https://cloud.google.com/context-aware-access/docs/access-levels"
    },
    "3.1.7[a]": {
        automation: "Use Secret Manager for credential storage. Enforce secret rotation policies.",
        gcpService: "Secret Manager, Cloud KMS",
        humanIntervention: "Required - Define privileged functions requiring additional controls.",
        docLink: "https://cloud.google.com/secret-manager/docs"
    },
    "3.1.7[b]": {
        automation: "Implement session duration limits in Cloud Identity. Use Cloud Audit Logs for monitoring.",
        gcpService: "Cloud Identity, Cloud Audit Logs",
        humanIntervention: "Monitor privileged access logs. Investigate anomalies.",
        docLink: "https://cloud.google.com/identity/docs/how-to/session-length"
    },
    "3.1.8[a]": {
        automation: "Configure session timeout in Google Workspace Admin Console. Use Chrome Enterprise for browser policies.",
        gcpService: "Google Workspace Admin, Chrome Enterprise",
        humanIntervention: "Required - Define inactivity timeout periods.",
        docLink: "https://support.google.com/a/answer/9368756"
    },
    "3.1.8[b]": {
        automation: "Configure Google Workspace session length policies. Use Context-Aware Access for device trust.",
        gcpService: "Google Workspace, Context-Aware Access",
        humanIntervention: "Review locked session reports. Handle user complaints.",
        docLink: "https://cloud.google.com/context-aware-access/docs/caa-requirements"
    },
    "3.1.10[a]": {
        automation: "Configure session duration in Cloud Identity console. Use OAuth token expiration settings.",
        gcpService: "Cloud Identity, OAuth",
        humanIntervention: "Required - Define session timeout and lock requirements.",
        docLink: "https://cloud.google.com/identity/docs/how-to/session-length"
    },
    "3.1.10[b]": {
        automation: "Implement automatic session termination via Cloud Functions. Monitor with Cloud Monitoring.",
        gcpService: "Cloud Functions, Cloud Monitoring",
        humanIntervention: "Review terminated session logs. Handle user escalations.",
        docLink: "https://cloud.google.com/functions/docs"
    },
    "3.1.12[a]": {
        automation: "Use Cloud VPN or BeyondCorp Enterprise for remote access. Configure Identity-Aware Proxy.",
        gcpService: "Cloud VPN, BeyondCorp, Identity-Aware Proxy",
        humanIntervention: "Required - Define remote access requirements and monitoring procedures.",
        docLink: "https://cloud.google.com/iap/docs"
    },
    "3.1.12[b]": {
        automation: "Monitor VPN connections via Cloud Logging. Use VPC Flow Logs for traffic analysis.",
        gcpService: "Cloud Logging, VPC Flow Logs",
        humanIntervention: "Review remote access logs daily. Investigate anomalies.",
        docLink: "https://cloud.google.com/vpc/docs/flow-logs"
    },
    "3.1.13[a]": {
        automation: "Implement BeyondCorp Enterprise for ZTNA. Use Cloud KMS for cryptographic operations.",
        gcpService: "BeyondCorp Enterprise, Cloud KMS",
        humanIntervention: "Required - Define cryptographic mechanism requirements.",
        docLink: "https://cloud.google.com/kms/docs"
    },
    "3.1.13[b]": {
        automation: "Configure TLS 1.2+ on all load balancers and Cloud CDN. Use Certificate Manager.",
        gcpService: "Cloud Load Balancing, Certificate Manager",
        humanIntervention: "Review certificate expiration alerts. Renew certificates as needed.",
        docLink: "https://cloud.google.com/certificate-manager/docs"
    },
    "3.1.14[a]": {
        automation: "Use Identity-Aware Proxy for controlled access. Configure Private Google Access.",
        gcpService: "Identity-Aware Proxy, Private Google Access",
        humanIntervention: "Required - Define routing requirements for CUI access.",
        docLink: "https://cloud.google.com/vpc/docs/private-google-access"
    },
    "3.1.14[b]": {
        automation: "Configure VPC routes for controlled egress. Use Cloud NAT for outbound connectivity.",
        gcpService: "VPC, Cloud NAT",
        humanIntervention: "Review and approve routing changes. Conduct network architecture reviews.",
        docLink: "https://cloud.google.com/nat/docs/overview"
    },
    "3.1.20[a]": {
        automation: "Use Cloud VPN with certificate-based auth. Configure Cloud Interconnect for dedicated connectivity.",
        gcpService: "Cloud VPN, Cloud Interconnect",
        humanIntervention: "Required - Define authorized external system connections.",
        docLink: "https://cloud.google.com/network-connectivity/docs/vpn/how-to"
    },
    "3.1.20[b]": {
        automation: "Monitor VPN and Interconnect connections. Use Cloud Monitoring for connection status.",
        gcpService: "Cloud Monitoring, VPN",
        humanIntervention: "Verify authorized connections monthly. Review connection logs.",
        docLink: "https://cloud.google.com/network-connectivity/docs/interconnect"
    },
    "3.1.21[a]": {
        automation: "Use Chrome Enterprise for device management. Configure Endpoint Verification.",
        gcpService: "Chrome Enterprise, Endpoint Verification",
        humanIntervention: "Required - Define authorized uses of portable storage.",
        docLink: "https://cloud.google.com/endpoint-verification/docs"
    },
    "3.1.21[b]": {
        automation: "Enable Cloud DLP to detect CUI on unauthorized storage. Use uniform bucket-level access.",
        gcpService: "Cloud DLP, Cloud Storage",
        humanIntervention: "Review portable device access logs. Enforce storage policies.",
        docLink: "https://cloud.google.com/storage/docs/uniform-bucket-level-access"
    },
    "3.1.22[a]": {
        automation: "Configure VPC firewall rules to control access. Use Cloud Armor for DDoS protection.",
        gcpService: "VPC Firewall, Cloud Armor",
        humanIntervention: "Required - Define publicly accessible system requirements.",
        docLink: "https://cloud.google.com/armor/docs"
    },
    "3.1.22[b]": {
        automation: "Implement Cloud Armor WAF rules for public-facing systems. Monitor with Security Command Center.",
        gcpService: "Cloud Armor, Security Command Center",
        humanIntervention: "Review public access logs. Approve CUI access on public systems.",
        docLink: "https://cloud.google.com/armor/docs/waf-rules"
    },

    // === AWARENESS AND TRAINING (AT) ===
    "3.2.1[a]": {
        automation: "Integrate with LMS via Cloud Functions and API Gateway. Track completion in Firestore.",
        gcpService: "Cloud Functions, Firestore",
        humanIntervention: "Required - Develop security awareness training content. Review annually.",
        docLink: "https://cloud.google.com/security/overview"
    },
    "3.2.1[b]": {
        automation: "Generate training completion reports from Firestore. Alert on non-compliance via Pub/Sub.",
        gcpService: "Firestore, Pub/Sub, Data Studio",
        humanIntervention: "Follow up with users missing training. Update content based on incidents.",
        docLink: "https://cloud.google.com/training"
    },
    "3.2.2[a]": {
        automation: "Track role assignments in Cloud Identity. Correlate with training records.",
        gcpService: "Cloud Identity, Cloud Audit Logs",
        humanIntervention: "Required - Define role-specific training requirements.",
        docLink: "https://cloud.google.com/identity/docs/concepts/overview"
    },
    "3.2.2[b]": {
        automation: "Block access for users missing role training via IAM Conditions. Auto-notify via Pub/Sub.",
        gcpService: "IAM Conditions, Pub/Sub",
        humanIntervention: "Deliver specialized training. Track hands-on exercises.",
        docLink: "https://cloud.google.com/training/security"
    },
    "3.2.3[a]": {
        automation: "Integrate insider threat training with LMS. Track completion in training database.",
        gcpService: "Cloud Functions, Firestore",
        humanIntervention: "Required - Develop insider threat awareness content. Annual updates.",
        docLink: "https://cloud.google.com/security/best-practices"
    },
    "3.2.3[b]": {
        automation: "Generate compliance reports. Send reminders via Pub/Sub for incomplete training.",
        gcpService: "Pub/Sub, Cloud Scheduler",
        humanIntervention: "Evaluate training effectiveness. Update based on threat intelligence.",
        docLink: "https://cloud.google.com/security/infrastructure"
    },

    // === AUDIT AND ACCOUNTABILITY (AU) ===
    "3.3.1[a]": {
        automation: "Enable Cloud Audit Logs for all services. Configure VPC Flow Logs. Enable Access Transparency.",
        gcpService: "Cloud Audit Logs, VPC Flow Logs",
        humanIntervention: "Required - Define audit event types per system component.",
        docLink: "https://cloud.google.com/logging/docs/audit"
    },
    "3.3.1[b]": {
        automation: "Aggregate logs to Cloud Logging. Configure log retention and export to Cloud Storage.",
        gcpService: "Cloud Logging, Cloud Storage",
        humanIntervention: "Review audit log configurations quarterly. Ensure coverage.",
        docLink: "https://cloud.google.com/logging/docs"
    },
    "3.3.1[c]": {
        automation: "Create Cloud Monitoring dashboards for audit metrics. Set up Pub/Sub alerts for critical events.",
        gcpService: "Cloud Monitoring, Pub/Sub",
        humanIntervention: "Coordinate audit requirements with stakeholders.",
        docLink: "https://cloud.google.com/monitoring/docs"
    },
    "3.3.2[a]": {
        automation: "Cloud Audit Logs automatically capture user identity. Configure Admin Activity logs.",
        gcpService: "Cloud Audit Logs, Admin Activity Logs",
        humanIntervention: "Required - Define accountability requirements.",
        docLink: "https://cloud.google.com/logging/docs/audit/understanding-audit-logs"
    },
    "3.3.2[b]": {
        automation: "Enable Data Access audit logs. Ensure principal emails are captured.",
        gcpService: "Cloud Audit Logs",
        humanIntervention: "Review audit trails for investigations. Verify attribution accuracy.",
        docLink: "https://cloud.google.com/logging/docs/audit/configure-data-access"
    },
    "3.3.3[a]": {
        automation: "Enable Security Command Center for threat detection. Configure Event Threat Detection.",
        gcpService: "Security Command Center, Event Threat Detection",
        humanIntervention: "Required - Define unusual activity indicators.",
        docLink: "https://cloud.google.com/security-command-center/docs/concepts-event-threat-detection-overview"
    },
    "3.3.3[b]": {
        automation: "Configure Security Command Center premium. Set up Cloud Functions for automated response.",
        gcpService: "Security Command Center, Cloud Functions",
        humanIntervention: "Review and triage SCC findings. Investigate anomalies.",
        docLink: "https://cloud.google.com/security-command-center/docs/how-to-notifications"
    },
    "3.3.4[a]": {
        automation: "Configure Cloud Monitoring alerts for logging failures. Monitor log sink status.",
        gcpService: "Cloud Monitoring, Cloud Logging",
        humanIntervention: "Required - Define audit logging failure response procedures.",
        docLink: "https://cloud.google.com/logging/docs/routing/overview"
    },
    "3.3.4[b]": {
        automation: "Enable log sink error reporting. Set up Pub/Sub alerts for logging failures.",
        gcpService: "Cloud Logging, Pub/Sub",
        humanIntervention: "Respond to logging failure alerts. Escalate as needed.",
        docLink: "https://cloud.google.com/logging/docs/export/configure_export_v2"
    },
    "3.3.5[a]": {
        automation: "Correlate logs using BigQuery. Create cross-service dashboards in Data Studio.",
        gcpService: "BigQuery, Data Studio",
        humanIntervention: "Required - Define correlation and analysis requirements.",
        docLink: "https://cloud.google.com/logging/docs/export/bigquery"
    },
    "3.3.5[b]": {
        automation: "Use Chronicle SIEM for investigation. Create saved queries in BigQuery.",
        gcpService: "Chronicle, BigQuery",
        humanIntervention: "Perform incident investigations. Document findings.",
        docLink: "https://cloud.google.com/chronicle/docs"
    },
    "3.3.6[a]": {
        automation: "Enable Cloud Storage Object Versioning and retention policies. Use bucket lock.",
        gcpService: "Cloud Storage, Bucket Lock",
        humanIntervention: "Required - Define audit reduction and report requirements.",
        docLink: "https://cloud.google.com/storage/docs/bucket-lock"
    },
    "3.3.6[b]": {
        automation: "Create BigQuery views for audit summaries. Generate scheduled reports via Cloud Scheduler.",
        gcpService: "BigQuery, Cloud Scheduler",
        humanIntervention: "Review generated reports. Customize views as needed.",
        docLink: "https://cloud.google.com/bigquery/docs/views"
    },
    "3.3.7[a]": {
        automation: "GCP uses Google's internal NTP infrastructure. Verify with Cloud Monitoring.",
        gcpService: "Google NTP, Cloud Monitoring",
        humanIntervention: "Required - Verify time source configuration.",
        docLink: "https://cloud.google.com/compute/docs/instances/configure-ntp"
    },
    "3.3.7[b]": {
        automation: "Verify time synchronization via Cloud Monitoring agent. Alert on drift.",
        gcpService: "Cloud Monitoring, Ops Agent",
        humanIntervention: "Investigate time sync failures. Update configurations.",
        docLink: "https://cloud.google.com/monitoring/agent"
    },
    "3.3.8[a]": {
        automation: "Enable Cloud Storage retention policies with bucket lock. Use WORM configuration.",
        gcpService: "Cloud Storage Retention, Bucket Lock",
        humanIntervention: "Required - Define audit log protection requirements.",
        docLink: "https://cloud.google.com/storage/docs/retention-policies"
    },
    "3.3.8[b]": {
        automation: "Use IAM policies to restrict log deletion. Enable organization policy constraints.",
        gcpService: "IAM, Organization Policy",
        humanIntervention: "Review log protection policies annually. Handle compliance audits.",
        docLink: "https://cloud.google.com/resource-manager/docs/organization-policy/overview"
    },
    "3.3.9[a]": {
        automation: "Restrict Cloud Logging and Storage access via IAM policies. Use VPC Service Controls.",
        gcpService: "IAM, VPC Service Controls",
        humanIntervention: "Required - Define authorized audit log managers.",
        docLink: "https://cloud.google.com/logging/docs/access-control"
    },
    "3.3.9[b]": {
        automation: "Implement IAM policies limiting log management access. Enable Admin Activity logs.",
        gcpService: "IAM, Cloud Audit Logs",
        humanIntervention: "Review audit management access quarterly. Update as roles change.",
        docLink: "https://cloud.google.com/iam/docs/granting-changing-revoking-access"
    },

    // Default fallback
    "_default": {
        automation: "Automation guidance not yet available for this objective. Check GCP Security Best Practices documentation.",
        gcpService: "Consult Google Cloud documentation for applicable services",
        humanIntervention: "Review objective requirements manually and define implementation approach.",
        docLink: "https://cloud.google.com/security/best-practices"
    }
};

// Helper function to get guidance for an objective
function getGCPGuidance(objectiveId) {
    return GCP_GUIDANCE[objectiveId] || GCP_GUIDANCE["_default"];
}
