// GCP / Google Workspace Implementation Guide - Client Resources
// Structured data for CMMC L2 deployment in Google Cloud Platform and Google Workspace

const GCP_IMPL_GUIDE = {
    // 8-Week Implementation Timeline
    projectPlan: [
        { phase: "1. Foundation", week: 1, taskId: "T-1.1", task: "Create GCP Organization with Assured Workloads (IL4/IL5)", owner: "Cloud Admin", accountable: "IT Director", deliverable: "Assured Workloads Folder" },
        { phase: "1. Foundation", week: 1, taskId: "T-1.2", task: "Configure Cloud Identity with 2-Step Verification", owner: "Cloud Admin", accountable: "FSO", deliverable: "Cloud Identity Active" },
        { phase: "1. Foundation", week: 1, taskId: "T-1.3", task: "Enable Organization Policy constraints", owner: "Cloud Admin", accountable: "FSO", deliverable: "Org Policies Applied" },
        { phase: "1. Foundation", week: 1, taskId: "T-1.4", task: "Configure VPC Service Controls for CUI data", owner: "Cloud Admin", accountable: "FSO", deliverable: "Service Perimeter Active" },
        { phase: "1. Foundation", week: 2, taskId: "T-2.1", task: "Deploy Cloud VPN or Interconnect to on-prem", owner: "Cloud Admin", accountable: "IT Director", deliverable: "VPN Tunnels Active" },
        { phase: "1. Foundation", week: 2, taskId: "T-2.2", task: "Enable Cloud Audit Logs for all services", owner: "Cloud Admin", accountable: "FSO", deliverable: "Audit Logs Enabled" },
        { phase: "1. Foundation", week: 2, taskId: "T-2.3", task: "Configure Cloud KMS with HSM-backed keys", owner: "Cloud Admin", accountable: "FSO", deliverable: "CMEK Keys Created" },
        { phase: "2. Workspace", week: 3, taskId: "T-3.1", task: "Configure Google Workspace security settings", owner: "Workspace Admin", accountable: "FSO", deliverable: "Security Settings Applied" },
        { phase: "2. Workspace", week: 3, taskId: "T-3.2", task: "Deploy Context-Aware Access policies", owner: "Workspace Admin", accountable: "FSO", deliverable: "CAA Policies Active" },
        { phase: "2. Workspace", week: 3, taskId: "T-3.3", task: "Configure Drive DLP rules for CUI detection", owner: "Workspace Admin", accountable: "FSO", deliverable: "DLP Rules Active" },
        { phase: "2. Workspace", week: 4, taskId: "T-4.1", task: "Enable endpoint verification for managed devices", owner: "Workspace Admin", accountable: "IT Director", deliverable: "Endpoint Verification Active" },
        { phase: "2. Workspace", week: 4, taskId: "T-4.2", task: "Configure Gmail advanced protection settings", owner: "Workspace Admin", accountable: "FSO", deliverable: "ATP Settings Applied" },
        { phase: "3. Security", week: 5, taskId: "T-5.1", task: "Deploy Security Command Center Premium", owner: "SecOps", accountable: "FSO", deliverable: "SCC Premium Active" },
        { phase: "3. Security", week: 5, taskId: "T-5.2", task: "Configure Chronicle SIEM for log analysis", owner: "SecOps", accountable: "FSO", deliverable: "Chronicle Ingesting Logs" },
        { phase: "3. Security", week: 6, taskId: "T-6.1", task: "Enable Web Security Scanner for vulnerabilities", owner: "SecOps", accountable: "IT Director", deliverable: "Scans Running" },
        { phase: "3. Security", week: 6, taskId: "T-6.2", task: "Configure Binary Authorization for GKE", owner: "Cloud Admin", accountable: "FSO", deliverable: "Binary Auth Active" },
        { phase: "4. Audit Prep", week: 7, taskId: "T-7.1", task: "Run Security Health Analytics assessment", owner: "FSO", accountable: "Exec Sponsor", deliverable: "SHA Report" },
        { phase: "4. Audit Prep", week: 7, taskId: "T-7.2", task: "Export logs to Cloud Storage with retention lock", owner: "Cloud Admin", accountable: "FSO", deliverable: "Locked Log Buckets" },
        { phase: "4. Audit Prep", week: 8, taskId: "T-8.1", task: "Generate evidence via gcloud CLI scripts", owner: "Cloud Admin", accountable: "FSO", deliverable: "JSON Evidence Files" },
        { phase: "4. Audit Prep", week: 8, taskId: "T-8.2", task: "Finalize & Sign SSP", owner: "FSO", accountable: "Exec Sponsor", deliverable: "Signed SSP" }
    ],

    // Recurring Operations
    recurringOps: [
        { frequency: "Daily", activity: "SCC Finding Review", owner: "SecOps", purpose: "Review critical/high severity findings." },
        { frequency: "Weekly", activity: "Security Health Analytics Review", owner: "FSO", purpose: "Check compliance posture." },
        { frequency: "Weekly", activity: "Workspace Alert Center Review", owner: "Workspace Admin", purpose: "Review security alerts." },
        { frequency: "Monthly", activity: "IAM Access Review", owner: "FSO + HR", purpose: "Review IAM bindings. Remove stale access." },
        { frequency: "Quarterly", activity: "Penetration Test", owner: "SecOps", purpose: "Conduct authorized pen test." },
        { frequency: "Annually", activity: "Assured Workloads Compliance Review", owner: "FSO", purpose: "Full compliance assessment." }
    ],

    // SSP Conformity Statements
    sspStatements: {
        "3.1.1": "The organization utilizes Google Cloud Identity as the central Identity Provider. Authorized users are identified by unique email addresses in the organization domain. Access is controlled via IAM policies and Organization Policy constraints.",
        "3.1.5": "Privileged access is managed via Google Cloud IAM with predefined and custom roles. Administrative actions are logged via Cloud Audit Logs. Service accounts use workload identity and short-lived credentials.",
        "3.1.12": "Remote access to GCP resources is controlled via Cloud VPN with IKEv2/IPsec or Cloud Interconnect. Identity-Aware Proxy (IAP) provides zero-trust access to applications. All connections require 2-Step Verification.",
        "3.3.1": "Audit logs are generated by Cloud Audit Logs (Admin Activity, Data Access, System Event). Logs are exported to Cloud Storage buckets with retention lock for immutability. Chronicle SIEM provides log analysis and threat detection.",
        "3.4.1": "Baseline configurations are enforced via Organization Policy constraints. Non-compliant resources are detected by Security Health Analytics. Config Connector maintains infrastructure as code.",
        "3.5.3": "2-Step Verification is enforced for all users via Google Workspace Admin Console. Hardware security keys (Titan) are required for privileged users. Context-Aware Access ensures device trust before granting access.",
        "3.13.8": "CUI in transit is protected using TLS 1.2+ enforced by default on all GCP services. Cloud VPN uses IKEv2 with AES-256-GCM. External HTTPS load balancers use managed SSL certificates.",
        "3.13.11": "CUI at rest is protected using Customer-Managed Encryption Keys (CMEK) via Cloud KMS with HSM protection (FIPS 140-2 Level 3). All GCP storage services support CMEK encryption.",
        "3.14.1": "System flaws are identified via Web Security Scanner (OWASP Top 10), Container Analysis (CVE scanning), and Security Health Analytics. Vulnerabilities are tracked in Security Command Center."
    },

    // Evidence Collection Strategy
    evidenceStrategy: [
        { domain: "Access Control", artifact: "iam_policies.json", source: "gcloud CLI", command: "gcloud projects get-iam-policy PROJECT_ID --format=json", proves: "IAM bindings defined" },
        { domain: "Access Control", artifact: "org_policies.json", source: "gcloud CLI", command: "gcloud resource-manager org-policies list --organization=ORG_ID --format=json", proves: "Org policies active" },
        { domain: "Access Control", artifact: "2sv_status.json", source: "Admin SDK", command: "gcloud identity groups memberships list --group-email=all@domain.com --format=json", proves: "2SV enrollment" },
        { domain: "Audit & Accountability", artifact: "audit_configs.json", source: "gcloud CLI", command: "gcloud logging sinks list --format=json", proves: "Audit log sinks configured" },
        { domain: "Audit & Accountability", artifact: "log_buckets.json", source: "gcloud CLI", command: "gcloud logging buckets list --format=json", proves: "Log retention configured" },
        { domain: "Config Management", artifact: "org_constraints.json", source: "gcloud CLI", command: "gcloud resource-manager org-policies describe compute.vmExternalIpAccess --organization=ORG_ID --format=json", proves: "Compute constraints" },
        { domain: "Risk Assessment", artifact: "scc_findings.json", source: "gcloud CLI", command: "gcloud scc findings list organizations/ORG_ID --filter='severity=\"CRITICAL\" OR severity=\"HIGH\"' --format=json", proves: "Security findings" },
        { domain: "System Protection", artifact: "vpc_firewall.json", source: "gcloud CLI", command: "gcloud compute firewall-rules list --format=json", proves: "Firewall rules defined" },
        { domain: "System Protection", artifact: "kms_keys.json", source: "gcloud CLI", command: "gcloud kms keys list --location=us --keyring=KEYRING_NAME --format=json", proves: "KMS encryption keys" },
        { domain: "Data Protection", artifact: "dlp_templates.json", source: "gcloud CLI", command: "gcloud dlp inspect-templates list --format=json", proves: "DLP templates configured" }
    ],

    // Policy Templates
    policyTemplates: {
        accessControl: {
            title: "GCP Access Control Policy",
            purpose: "To limit GCP resource access to authorized users via IAM.",
            sections: [
                { heading: "Identity Management", items: ["All users access GCP via Cloud Identity SSO.", "Service accounts use workload identity federation.", "External identities require domain verification."] },
                { heading: "2-Step Verification", items: ["2SV is enforced for all users in Admin Console.", "Hardware security keys required for super admins.", "Context-Aware Access validates device posture."] },
                { heading: "Least Privilege", items: ["Use predefined roles over primitive roles.", "Custom roles scoped to minimum permissions.", "IAM Recommender reviews and suggests removal of excess permissions."] }
            ]
        },
        logging: {
            title: "GCP Logging & Monitoring Policy",
            purpose: "To ensure comprehensive audit logging of all GCP activity.",
            sections: [
                { heading: "Cloud Audit Logs", items: ["Admin Activity logs enabled (always on).", "Data Access logs enabled for CUI resources.", "System Event logs capture infrastructure changes."] },
                { heading: "Retention", items: ["Logs exported to Cloud Storage with retention lock.", "Minimum 365-day retention for compliance.", "Chronicle SIEM for long-term analysis."] },
                { heading: "Alerting", items: ["SCC findings trigger Pub/Sub notifications.", "Critical alerts page SecOps via PagerDuty.", "Cloud Monitoring dashboards for visibility."] }
            ]
        },
        encryption: {
            title: "GCP Encryption Policy",
            purpose: "To protect CUI using FIPS 140-2 validated cryptography.",
            sections: [
                { heading: "Data at Rest", items: ["CMEK encryption for all CUI data.", "Cloud KMS keys use HSM protection.", "Key rotation enabled (90 days recommended)."] },
                { heading: "Data in Transit", items: ["TLS 1.2+ enforced on all services.", "Cloud VPN uses AES-256-GCM.", "Private Google Access for internal traffic."] },
                { heading: "Key Management", items: ["Cloud KMS with Cloud HSM (FIPS 140-2 Level 3).", "Key access controlled via IAM.", "Key destruction requires multi-party approval."] }
            ]
        },
        workspace: {
            title: "Google Workspace Security Policy",
            purpose: "To secure collaboration tools handling CUI.",
            sections: [
                { heading: "Drive Security", items: ["External sharing disabled for CUI folders.", "DLP rules detect and block CUI exfiltration.", "Drive labels classify sensitive content."] },
                { heading: "Gmail Security", items: ["Advanced phishing protection enabled.", "Attachment scanning via Security Sandbox.", "S/MIME encryption for sensitive emails."] },
                { heading: "Endpoint Management", items: ["Endpoint verification required for access.", "Mobile device management enforced.", "Context-Aware Access validates device state."] }
            ]
        }
    },

    // GCP Services for CMMC
    gcpServices: [
        { control: "3.1.x (AC)", service: "Cloud Identity + IAM", purpose: "Centralized identity and access control" },
        { control: "3.1.x (AC)", service: "Organization Policies", purpose: "Guardrails and constraints" },
        { control: "3.1.x (AC)", service: "Context-Aware Access", purpose: "Zero-trust access policies" },
        { control: "3.3.x (AU)", service: "Cloud Audit Logs", purpose: "API audit logging" },
        { control: "3.3.x (AU)", service: "Chronicle SIEM", purpose: "Log analysis and threat detection" },
        { control: "3.4.x (CM)", service: "Config Connector", purpose: "Infrastructure as code" },
        { control: "3.5.x (IA)", service: "2-Step Verification", purpose: "Multi-factor authentication" },
        { control: "3.6.x (IR)", service: "SCC + Pub/Sub", purpose: "Threat detection and alerting" },
        { control: "3.11.x (RA)", service: "Security Health Analytics", purpose: "Vulnerability detection" },
        { control: "3.12.x (CA)", service: "Security Command Center", purpose: "Compliance monitoring" },
        { control: "3.13.x (SC)", service: "Cloud KMS + VPC SC", purpose: "Encryption and network isolation" },
        { control: "3.14.x (SI)", service: "Web Security Scanner", purpose: "Application vulnerability scanning" }
    ],

    // FedRAMP Authorized GCP Services
    fedrampServices: [
        { category: "Compute", service: "Compute Engine, GKE, Cloud Run, Cloud Functions", authorization: "FedRAMP High" },
        { category: "Storage", service: "Cloud Storage, Persistent Disk, Filestore", authorization: "FedRAMP High" },
        { category: "Database", service: "Cloud SQL, Cloud Spanner, Firestore, Bigtable", authorization: "FedRAMP High" },
        { category: "Security", service: "Cloud IAM, Cloud KMS, SCC, VPC SC", authorization: "FedRAMP High" },
        { category: "Networking", service: "VPC, Cloud VPN, Cloud Interconnect, Cloud CDN", authorization: "FedRAMP High" },
        { category: "Management", service: "Cloud Logging, Cloud Monitoring, Cloud Asset Inventory", authorization: "FedRAMP High" }
    ],

    // Organization Policy Examples
    orgPolicyExamples: [
        { name: "Restrict VM External IP", constraint: "compute.vmExternalIpAccess", description: "Deny external IPs on VMs", effect: "Deny all external IPs except allowlisted" },
        { name: "Require OS Login", constraint: "compute.requireOsLogin", description: "Enforce OS Login for SSH", effect: "All VMs require IAM-based SSH" },
        { name: "Uniform Bucket Access", constraint: "storage.uniformBucketLevelAccess", description: "Require uniform bucket IAM", effect: "Disable ACLs on buckets" },
        { name: "Restrict Resource Locations", constraint: "gcp.resourceLocations", description: "Limit to US regions", effect: "Resources only in us-* regions" },
        { name: "Disable Service Account Keys", constraint: "iam.disableServiceAccountKeyCreation", description: "Prevent long-lived keys", effect: "Use workload identity instead" }
    ],

    // Assured Workloads Info
    assuredWorkloads: {
        description: "Assured Workloads provides compliance controls for regulated workloads including FedRAMP High and IL4/IL5.",
        complianceRegimes: ["FedRAMP High", "FedRAMP Moderate", "IL4", "IL5", "CJIS", "ITAR"],
        features: [
            "Data residency controls (US only)",
            "Personnel access controls (US persons)",
            "Support access restrictions",
            "Encryption key locality requirements",
            "Automatic Organization Policy application"
        ],
        note: "Assured Workloads is required for ITAR compliance on GCP."
    },

    // Native Services by Control Family
    servicesByFamily: {
        "Access Control (AC)": {
            native: [
                { service: "Cloud Identity", type: "Identity Provider", purpose: "User/group management, SSO, directory sync" },
                { service: "Cloud IAM", type: "Authorization", purpose: "Roles, policies, least-privilege access" },
                { service: "Organization Policies", type: "Guardrails", purpose: "Organization-wide constraints and restrictions" },
                { service: "Identity-Aware Proxy (IAP)", type: "Zero Trust", purpose: "Context-aware access to applications" },
                { service: "BeyondCorp Enterprise", type: "ZTNA", purpose: "Zero-trust network access, device trust" }
            ],
            thirdParty: [
                { service: "Cisco Duo", type: "MFA", fedramp: "High", assetType: "Security Protection Asset", purpose: "Hardware tokens, push notifications, adaptive MFA" },
                { service: "Okta (Fed)", type: "Identity Provider", fedramp: "High", assetType: "Security Protection Asset", purpose: "SSO, lifecycle management, SAML federation" },
                { service: "CyberArk", type: "PAM", fedramp: "High", assetType: "Security Protection Asset", purpose: "Privileged credential vaulting, session recording" },
                { service: "BeyondTrust", type: "PAM", fedramp: "High", assetType: "Security Protection Asset", purpose: "Privileged remote access, password management" }
            ]
        },
        "Awareness & Training (AT)": {
            native: [
                { service: "Google Cloud Skills Boost", type: "Training", purpose: "GCP security training and certifications" }
            ],
            thirdParty: [
                { service: "KnowBe4", type: "Security Awareness", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Phishing simulation, security training modules" },
                { service: "Proofpoint", type: "Security Awareness", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Security awareness training, threat simulation" },
                { service: "SANS Security Awareness", type: "Training", fedramp: "N/A", assetType: "Security Protection Asset", purpose: "Role-based security training content" }
            ]
        },
        "Audit & Accountability (AU)": {
            native: [
                { service: "Cloud Audit Logs", type: "Audit Logging", purpose: "Admin Activity, Data Access, System Event logs" },
                { service: "Cloud Logging", type: "Log Management", purpose: "Log aggregation, queries, alerting" },
                { service: "Chronicle SIEM", type: "SIEM", purpose: "Security analytics, threat detection, YARA-L rules" },
                { service: "Cloud Storage (logs)", type: "Log Retention", purpose: "Immutable log storage with retention lock" }
            ],
            thirdParty: [
                { service: "Splunk (GovCloud)", type: "SIEM", fedramp: "High", assetType: "Security Protection Asset", purpose: "Log management, security analytics, dashboards" },
                { service: "Elastic (GovCloud)", type: "SIEM", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Log aggregation, search, visualization" },
                { service: "Sumo Logic (Fed)", type: "SIEM", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Cloud-native log analytics" }
            ]
        },
        "Configuration Management (CM)": {
            native: [
                { service: "Organization Policy Service", type: "Compliance", purpose: "Resource constraints, guardrails" },
                { service: "Security Health Analytics", type: "CSPM", purpose: "Misconfiguration detection, recommendations" },
                { service: "Config Connector", type: "IaC", purpose: "Kubernetes-style resource management" },
                { service: "Cloud Asset Inventory", type: "Asset Management", purpose: "Resource inventory, change history" }
            ],
            thirdParty: [
                { service: "Tenable.io (Fed)", type: "Vulnerability Management", fedramp: "High", assetType: "Security Protection Asset", purpose: "Vulnerability scanning, configuration assessment" },
                { service: "Qualys (Fed)", type: "Vulnerability Management", fedramp: "High", assetType: "Security Protection Asset", purpose: "Asset inventory, vulnerability scanning" },
                { service: "Wiz", type: "CNAPP", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Cloud security posture, vulnerability management" }
            ]
        },
        "Identification & Authentication (IA)": {
            native: [
                { service: "2-Step Verification", type: "MFA", purpose: "TOTP, push, security keys" },
                { service: "Titan Security Keys", type: "Hardware Token", purpose: "FIDO2 phishing-resistant authentication" },
                { service: "Cloud KMS", type: "Key Management", purpose: "FIPS 140-2 Level 3 HSM-backed keys" },
                { service: "Secret Manager", type: "Secrets Management", purpose: "API keys, passwords, certificates" }
            ],
            thirdParty: [
                { service: "Yubico YubiKey", type: "Hardware Token", fedramp: "N/A", assetType: "Security Protection Asset", purpose: "FIDO2 security keys, PIV smart cards" },
                { service: "RSA SecurID", type: "MFA", fedramp: "High", assetType: "Security Protection Asset", purpose: "Hardware/software tokens, risk-based auth" },
                { service: "Thales SafeNet", type: "PKI/HSM", fedramp: "High", assetType: "Security Protection Asset", purpose: "HSM, certificate management" }
            ]
        },
        "Incident Response (IR)": {
            native: [
                { service: "Security Command Center", type: "Security Posture", purpose: "Centralized findings, threat detection" },
                { service: "Chronicle SIEM", type: "SIEM/SOAR", purpose: "Detection rules, playbooks, investigation" },
                { service: "Cloud Pub/Sub", type: "Event Routing", purpose: "Real-time alerting, automation triggers" },
                { service: "Event Threat Detection", type: "Threat Detection", purpose: "Malware, cryptomining, exfiltration detection" }
            ],
            thirdParty: [
                { service: "CrowdStrike Falcon", type: "EDR", fedramp: "High", assetType: "Security Protection Asset", purpose: "Endpoint detection, threat hunting, IR" },
                { service: "Palo Alto Cortex XSOAR", type: "SOAR", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Playbook automation, case management" },
                { service: "ServiceNow SecOps", type: "ITSM/SOAR", fedramp: "High", assetType: "Security Protection Asset", purpose: "Security incident management, workflows" }
            ]
        },
        "Maintenance (MA)": {
            native: [
                { service: "OS Patch Management", type: "Patch Management", purpose: "Automated VM patching via OS Config" },
                { service: "Identity-Aware Proxy", type: "Remote Access", purpose: "Secure access without VPN" },
                { service: "Cloud Shell", type: "Admin Access", purpose: "Browser-based CLI with audit logging" }
            ],
            thirdParty: [
                { service: "Ivanti", type: "Patch Management", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Patch management, endpoint security" },
                { service: "ManageEngine", type: "IT Management", fedramp: "N/A", assetType: "Security Protection Asset", purpose: "Patch management, remote support" }
            ]
        },
        "Media Protection (MP)": {
            native: [
                { service: "Cloud KMS", type: "Encryption", purpose: "CMEK encryption, key rotation" },
                { service: "Cloud DLP", type: "Data Classification", purpose: "CUI discovery, redaction, de-identification" },
                { service: "Persistent Disk Encryption", type: "Disk Encryption", purpose: "CMEK for VM disks" },
                { service: "Cloud Storage Encryption", type: "Object Encryption", purpose: "Server-side encryption with CMEK" }
            ],
            thirdParty: [
                { service: "Virtru", type: "Email Encryption", fedramp: "Moderate", assetType: "CUI Asset", purpose: "End-to-end email encryption, key management" },
                { service: "Digital Guardian", type: "DLP", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Data loss prevention, endpoint DLP" },
                { service: "IronKey", type: "Encrypted Storage", fedramp: "N/A", assetType: "CUI Asset", purpose: "FIPS 140-2 encrypted USB drives" }
            ]
        },
        "Physical Protection (PE)": {
            native: [
                { service: "Google Datacenter (Inherited)", type: "Physical Security", purpose: "Google manages physical datacenter security (FedRAMP High)" }
            ],
            thirdParty: [
                { service: "Envoy", type: "Visitor Management", fedramp: "N/A", assetType: "Contractor Risk Managed Asset", purpose: "Digital visitor logs, badge printing" },
                { service: "Verkada", type: "Physical Security", fedramp: "N/A", assetType: "Security Protection Asset", purpose: "Cloud-managed cameras, access control" },
                { service: "Brivo", type: "Access Control", fedramp: "N/A", assetType: "Security Protection Asset", purpose: "Cloud-based door access control" }
            ]
        },
        "Personnel Security (PS)": {
            native: [
                { service: "Cloud Identity Lifecycle", type: "Identity Lifecycle", purpose: "User provisioning/deprovisioning via SCIM" }
            ],
            thirdParty: [
                { service: "Sterling", type: "Background Check", fedramp: "N/A", assetType: "Contractor Risk Managed Asset", purpose: "Employment verification, background screening" },
                { service: "Workday", type: "HCM", fedramp: "Moderate", assetType: "Contractor Risk Managed Asset", purpose: "HR system of record, personnel tracking" }
            ]
        },
        "Risk Assessment (RA)": {
            native: [
                { service: "Security Health Analytics", type: "Vulnerability Scanner", purpose: "GCP misconfiguration and vulnerability detection" },
                { service: "Web Security Scanner", type: "DAST", purpose: "OWASP Top 10 scanning for web apps" },
                { service: "Container Analysis", type: "Container Security", purpose: "CVE scanning for container images" },
                { service: "Security Command Center", type: "Security Posture", purpose: "Aggregated risk view and scoring" }
            ],
            thirdParty: [
                { service: "Tenable.sc", type: "Vulnerability Management", fedramp: "High", assetType: "Security Protection Asset", purpose: "On-prem vulnerability management" },
                { service: "Qualys VMDR", type: "Vulnerability Management", fedramp: "High", assetType: "Security Protection Asset", purpose: "Vulnerability detection and response" },
                { service: "Archer", type: "GRC", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Risk management, compliance tracking" }
            ]
        },
        "Security Assessment (CA)": {
            native: [
                { service: "Security Command Center Premium", type: "Compliance", purpose: "Compliance reports, benchmarks" },
                { service: "Assured Workloads", type: "Compliance Framework", purpose: "FedRAMP/IL4/IL5 compliance controls" },
                { service: "Cloud Asset Inventory", type: "Continuous Monitoring", purpose: "Real-time resource visibility" }
            ],
            thirdParty: [
                { service: "ServiceNow GRC", type: "GRC", fedramp: "High", assetType: "Security Protection Asset", purpose: "Risk register, policy management" },
                { service: "Archer", type: "GRC", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Security assessment automation" }
            ]
        },
        "System & Communications Protection (SC)": {
            native: [
                { service: "VPC", type: "Network Isolation", purpose: "Private networks, subnets, firewall rules" },
                { service: "VPC Service Controls", type: "Data Exfil Prevention", purpose: "Service perimeters for API access" },
                { service: "Cloud Armor", type: "WAF/DDoS", purpose: "Web application firewall, DDoS protection" },
                { service: "Private Google Access", type: "Private Connectivity", purpose: "Access Google APIs without public IP" },
                { service: "Cloud VPN", type: "VPN", purpose: "IPsec VPN with IKEv2" },
                { service: "Cloud KMS", type: "Encryption", purpose: "FIPS 140-2 Level 3 key management" }
            ],
            thirdParty: [
                { service: "Palo Alto VM-Series", type: "NGFW", fedramp: "High", assetType: "Security Protection Asset", purpose: "Next-gen firewall, threat prevention" },
                { service: "Fortinet FortiGate", type: "NGFW", fedramp: "High", assetType: "Security Protection Asset", purpose: "Firewall, VPN, IPS" },
                { service: "Zscaler (Gov)", type: "SASE", fedramp: "High", assetType: "Security Protection Asset", purpose: "Zero-trust network access, web security" }
            ]
        },
        "System & Information Integrity (SI)": {
            native: [
                { service: "Event Threat Detection", type: "Threat Detection", purpose: "Malware, anomaly, exfiltration detection" },
                { service: "Container Analysis", type: "Vulnerability Management", purpose: "CVE scanning for containers" },
                { service: "Web Security Scanner", type: "Application Security", purpose: "OWASP vulnerability scanning" },
                { service: "Cloud Monitoring", type: "Monitoring", purpose: "Metrics, alerting, uptime checks" }
            ],
            thirdParty: [
                { service: "CrowdStrike Falcon", type: "EDR/AV", fedramp: "High", assetType: "Security Protection Asset", purpose: "Endpoint protection, malware prevention" },
                { service: "SentinelOne", type: "EDR", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "AI-powered endpoint protection" },
                { service: "Carbon Black", type: "EDR", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Endpoint detection and response" }
            ]
        }
    },

    // CUI Asset Categories
    cuiAssetCategories: [
        { category: "Endpoint", example: "Compute Engine VMs", protection: "Security Health Analytics + OS Config + Shielded VMs" },
        { category: "Storage", example: "Cloud Storage buckets with CUI", protection: "CMEK + VPC SC + DLP" },
        { category: "Database", example: "Cloud SQL with CUI data", protection: "CMEK + Private IP + Audit Logs" },
        { category: "Application", example: "Cloud Run services processing CUI", protection: "VPC SC + Binary Auth + Cloud Armor" },
        { category: "Network", example: "VPC with CUI workloads", protection: "VPC Firewall + Flow Logs + Cloud Armor" }
    ]
};

// Helper functions
function getGCPImplGuide() {
    return GCP_IMPL_GUIDE;
}
