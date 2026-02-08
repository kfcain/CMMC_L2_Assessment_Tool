// MSP Portal Data - Expert-Level Content for CMMC MSP/MSSP Operations
// Comprehensive guidance for Azure GCC High, AWS GovCloud, GCP Assured Workloads

const MSP_PORTAL_DATA = {
    version: "1.0.0",
    lastUpdated: "2025-01-26",

    // ==================== OFFICIAL DOCUMENTATION REFERENCES ====================
    references: {
        nist: {
            "800-171": { title: "NIST SP 800-171 Rev 2", url: "https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final" },
            "800-171A": { title: "NIST SP 800-171A", url: "https://csrc.nist.gov/publications/detail/sp/800-171a/final" },
            "800-172": { title: "NIST SP 800-172", url: "https://csrc.nist.gov/publications/detail/sp/800-172/final" },
            "800-53": { title: "NIST SP 800-53 Rev 5", url: "https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final" }
        },
        cmmc: {
            model: { title: "CMMC Model Overview", url: "https://dodcio.defense.gov/CMMC/" },
            ab: { title: "Cyber AB (Accreditation Body)", url: "https://cyberab.org/" },
            marketplace: { title: "CMMC Marketplace", url: "https://cyberab.org/Marketplace" }
        },
        fedramp: {
            marketplace: { title: "FedRAMP Marketplace", url: "https://marketplace.fedramp.gov/" },
            baselines: { title: "FedRAMP Baselines", url: "https://www.fedramp.gov/baselines/" }
        },
        dod: {
            cc_srg: { title: "DoD Cloud Computing SRG", url: "https://public.cyber.mil/dccs/" },
            stigs: { title: "DISA STIGs", url: "https://public.cyber.mil/stigs/" }
        }
    },

    // ==================== AZURE GCC HIGH CONFIGURATION ====================
    azure: {
        overview: {
            title: "Microsoft Azure Government / GCC High",
            description: "Azure Government is a separate instance of Microsoft Azure designed to handle workloads subject to US government regulations including FedRAMP High, DoD IL2/IL4/IL5, ITAR, and CMMC.",
            keyPoints: [
                "Physically isolated datacenters in US (Virginia, Texas, Arizona, Iowa)",
                "Screened US persons for operations and support",
                "Separate identity plane (login.microsoftonline.us)",
                "Required for DoD contractors handling CUI under DFARS 7012"
            ],
            portalUrl: "https://portal.azure.us",
            entraUrl: "https://entra.microsoft.us",
            complianceLevel: "FedRAMP High, DoD IL2/IL4/IL5, CMMC L2/L3"
        },

        licensing: {
            title: "Required Licensing for CMMC",
            tiers: [
                {
                    name: "Microsoft 365 GCC High",
                    plans: ["E3 GCC High", "E5 GCC High"],
                    required: true,
                    notes: "E5 recommended for advanced security features (Defender XDR, Purview)"
                },
                {
                    name: "Entra ID P2",
                    plans: ["Standalone or included in E5"],
                    required: true,
                    notes: "Required for: Conditional Access, PIM, Identity Protection, Access Reviews"
                },
                {
                    name: "Microsoft Defender for Endpoint P2",
                    plans: ["Standalone or E5"],
                    required: true,
                    notes: "EDR capability required for CMMC SI controls"
                },
                {
                    name: "Microsoft Purview",
                    plans: ["E5 Compliance or standalone"],
                    required: true,
                    notes: "Required for DLP, sensitivity labels, information barriers"
                }
            ]
        },

        identity: {
            title: "Identity & Access Management",
            controls: [
                {
                    id: "ENTRA-001",
                    name: "Multi-Factor Authentication",
                    cmmc: ["3.5.3", "3.7.5"],
                    config: {
                        requirement: "MFA required for all users, all applications",
                        methods: ["FIDO2 Security Keys (preferred)", "Microsoft Authenticator", "Hardware OATH tokens"],
                        avoid: ["SMS (phishable)", "Voice calls", "Email OTP"],
                        implementation: `// Conditional Access Policy - Require MFA
{
  "displayName": "CMMC-CA-001: Require MFA for All Users",
  "state": "enabled",
  "conditions": {
    "users": { "includeUsers": ["All"] },
    "applications": { "includeApplications": ["All"] },
    "clientAppTypes": ["all"]
  },
  "grantControls": {
    "operator": "OR",
    "builtInControls": ["mfa"]
  }
}`
                    }
                },
                {
                    id: "ENTRA-002",
                    name: "Privileged Identity Management (PIM)",
                    cmmc: ["3.1.5", "3.1.6", "3.1.7"],
                    config: {
                        requirement: "Just-in-time access for all privileged roles",
                        roles: ["Global Administrator", "Security Administrator", "Exchange Administrator", "SharePoint Administrator", "Intune Administrator"],
                        settings: {
                            maxDuration: "8 hours",
                            requireApproval: true,
                            requireJustification: true,
                            requireMFA: true,
                            notifyOnActivation: true
                        }
                    }
                },
                {
                    id: "ENTRA-003",
                    name: "Conditional Access Policies",
                    cmmc: ["3.1.1", "3.1.2", "3.5.1"],
                    policies: [
                        { name: "Require compliant device", target: "All users", condition: "Device compliance = True" },
                        { name: "Block legacy authentication", target: "All users", condition: "Client apps = Other clients" },
                        { name: "Require approved apps", target: "Mobile devices", condition: "Approved client app required" },
                        { name: "Block high-risk sign-ins", target: "All users", condition: "Sign-in risk = High → Block" },
                        { name: "Require password change", target: "All users", condition: "User risk = High → Require password change" },
                        { name: "Named locations", target: "All users", condition: "Block access from non-US locations" }
                    ]
                }
            ]
        },

        network: {
            title: "Network Security Architecture",
            patterns: [
                {
                    name: "Hub-Spoke Topology",
                    description: "Centralized security services with isolated client spokes",
                    components: [
                        "Hub VNet: Azure Firewall, VPN Gateway, Bastion",
                        "Spoke VNets: Client workloads, isolated subnets",
                        "VNet Peering: Hub-to-spoke connectivity"
                    ],
                    terraform: `# Hub-Spoke Network Architecture
resource "azurerm_virtual_network" "hub" {
  name                = "vnet-hub-gcc-\${var.region}"
  location            = var.location
  resource_group_name = azurerm_resource_group.network.name
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_firewall" "main" {
  name                = "fw-hub-gcc"
  location            = var.location
  resource_group_name = azurerm_resource_group.network.name
  sku_name            = "AZFW_VNet"
  sku_tier            = "Premium"  # Required for TLS inspection
  threat_intel_mode   = "Deny"     # Block known malicious IPs
  
  ip_configuration {
    name                 = "fw-ipconfig"
    subnet_id            = azurerm_subnet.firewall.id
    public_ip_address_id = azurerm_public_ip.firewall.id
  }
}`
                },
                {
                    name: "Private Endpoints",
                    description: "All PaaS services accessed via private IP, no public endpoints",
                    services: ["Storage Accounts", "Key Vault", "SQL Database", "Cosmos DB", "App Services"],
                    requirement: "CMMC 3.13.1 - Monitor and control communications at external boundaries"
                }
            ]
        },

        security: {
            title: "Security Services Configuration",
            services: [
                {
                    name: "Microsoft Defender for Cloud",
                    cmmc: ["3.11.1", "3.11.2", "3.14.6"],
                    config: {
                        plans: ["Defender for Servers P2", "Defender for Storage", "Defender for Key Vault", "Defender for SQL", "Defender for Containers"],
                        secureScore: "Target: 80%+ for CMMC readiness",
                        recommendations: "Address all High/Critical findings before assessment"
                    }
                },
                {
                    name: "Microsoft Sentinel",
                    cmmc: ["3.3.1", "3.3.2", "3.3.5", "3.14.6", "3.14.7"],
                    config: {
                        workspace: "Dedicated Log Analytics workspace per client",
                        retention: "90 days hot, 1 year archived (minimum)",
                        connectors: ["Azure Activity", "Entra ID", "Microsoft 365", "Defender XDR", "Azure Firewall", "Windows Security Events"],
                        rules: "Enable all CMMC-related analytics rules from Content Hub"
                    }
                }
            ]
        },

        lighthouse: {
            title: "Azure Lighthouse for MSP Management",
            description: "Delegated resource management for multi-tenant MSP operations",
            benefits: [
                "Manage client subscriptions from MSP tenant",
                "No credential storage in client tenants",
                "Audit trail of all MSP actions",
                "Role-based access with JIT elevation"
            ],
            roles: [
                { role: "Reader", purpose: "View resources, no changes", permanent: true },
                { role: "Contributor", purpose: "Manage resources (elevated)", permanent: false },
                { role: "Security Admin", purpose: "Manage security policies", permanent: false },
                { role: "Log Analytics Contributor", purpose: "Query and manage logs", permanent: true }
            ],
            template: `// Azure Lighthouse Delegation Template
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "mspOfferName": { "type": "string", "defaultValue": "MSP CMMC Management" },
    "mspTenantId": { "type": "string" }
  },
  "resources": [{
    "type": "Microsoft.ManagedServices/registrationDefinitions",
    "apiVersion": "2022-10-01",
    "name": "[guid(parameters('mspOfferName'))]",
    "properties": {
      "registrationDefinitionName": "[parameters('mspOfferName')]",
      "managedByTenantId": "[parameters('mspTenantId')]",
      "authorizations": [
        {
          "principalId": "<MSP-Security-Group-ID>",
          "roleDefinitionId": "acdd72a7-3385-48ef-bd42-f606fba81ae7",
          "principalIdDisplayName": "MSP Readers"
        }
      ]
    }
  }]
}`
        },

        checklist: {
            title: "Azure GCC High Implementation Checklist",
            categories: [
                {
                    name: "Pre-Deployment",
                    items: [
                        { task: "Obtain Microsoft 365 GCC High tenant", critical: true, effort: "1-2 weeks" },
                        { task: "Complete ITAR/EAR eligibility verification", critical: true, effort: "1-2 weeks" },
                        { task: "Provision Azure Government subscription", critical: true, effort: "1-3 days" },
                        { task: "Configure custom domain with US-based DNS", critical: false, effort: "1 day" },
                        { task: "Plan IP address space (avoid RFC 1918 conflicts)", critical: false, effort: "2-4 hours" }
                    ]
                },
                {
                    name: "Identity Foundation",
                    items: [
                        { task: "Configure Entra ID security defaults or Conditional Access", critical: true, effort: "1 day" },
                        { task: "Enable MFA for all users (FIDO2 preferred)", critical: true, effort: "1-2 days" },
                        { task: "Configure Privileged Identity Management (PIM)", critical: true, effort: "4-8 hours" },
                        { task: "Implement password policies (14+ chars, complexity)", critical: true, effort: "2-4 hours" },
                        { task: "Configure self-service password reset with MFA", critical: false, effort: "2-4 hours" },
                        { task: "Enable Identity Protection policies", critical: true, effort: "2-4 hours" },
                        { task: "Configure access reviews for privileged roles", critical: false, effort: "2-4 hours" }
                    ]
                },
                {
                    name: "Network Security",
                    items: [
                        { task: "Deploy hub-spoke or Virtual WAN topology", critical: true, effort: "1-2 days" },
                        { task: "Configure Azure Firewall with threat intelligence", critical: true, effort: "4-8 hours" },
                        { task: "Enable DDoS Protection Standard on hub VNet", critical: false, effort: "1 hour" },
                        { task: "Configure NSGs with deny-by-default rules", critical: true, effort: "2-4 hours" },
                        { task: "Enable NSG flow logs to Log Analytics", critical: true, effort: "2-4 hours" },
                        { task: "Deploy Azure Bastion for secure VM access", critical: true, effort: "2-4 hours" },
                        { task: "Configure Private DNS zones for PaaS services", critical: false, effort: "2-4 hours" }
                    ]
                },
                {
                    name: "Security & Monitoring",
                    items: [
                        { task: "Enable all Defender for Cloud plans", critical: true, effort: "2-4 hours" },
                        { task: "Deploy Microsoft Sentinel workspace", critical: true, effort: "4-8 hours" },
                        { task: "Connect all data sources to Sentinel", critical: true, effort: "1 day" },
                        { task: "Enable CMMC analytics rules from Content Hub", critical: true, effort: "2-4 hours" },
                        { task: "Configure diagnostic settings for all resources", critical: true, effort: "4-8 hours" },
                        { task: "Set up alert rules for security events", critical: true, effort: "4-8 hours" },
                        { task: "Deploy Defender for Endpoint on all VMs", critical: true, effort: "1 day" }
                    ]
                },
                {
                    name: "Data Protection",
                    items: [
                        { task: "Configure Azure Information Protection labels", critical: true, effort: "1 day" },
                        { task: "Enable sensitivity labels in M365", critical: true, effort: "4-8 hours" },
                        { task: "Configure DLP policies for CUI", critical: true, effort: "1-2 days" },
                        { task: "Enable customer-managed keys for storage", critical: false, effort: "4-8 hours" },
                        { task: "Configure Azure Key Vault for secrets management", critical: true, effort: "2-4 hours" },
                        { task: "Enable soft delete and purge protection on Key Vault", critical: true, effort: "1 hour" }
                    ]
                }
            ]
        }
    },

    // ==================== AWS GOVCLOUD CONFIGURATION ====================
    aws: {
        overview: {
            title: "AWS GovCloud (US)",
            description: "AWS GovCloud (US) is an isolated AWS region designed for US government agencies and contractors with sensitive workloads requiring compliance with FedRAMP High, DoD SRG IL2/IL4/IL5, ITAR, and CMMC.",
            keyPoints: [
                "Isolated regions: us-gov-west-1 (Oregon), us-gov-east-1 (Ohio)",
                "US persons only for root account and physical access",
                "Separate AWS partition (aws-us-gov)",
                "Linked to commercial AWS account for billing"
            ],
            consoleUrl: "https://console.amazonaws-us-gov.com",
            complianceLevel: "FedRAMP High, DoD IL2/IL4/IL5, CMMC L2/L3"
        },

        landingZone: {
            title: "AWS Landing Zone Architecture",
            description: "Multi-account strategy using AWS Organizations and Control Tower (when available in GovCloud)",
            accounts: [
                { name: "Management Account", purpose: "Organizations, billing, SCPs", access: "Break-glass only" },
                { name: "Log Archive Account", purpose: "Centralized CloudTrail, Config logs", access: "Security team read" },
                { name: "Security Tooling Account", purpose: "Security Hub, GuardDuty aggregation", access: "Security team" },
                { name: "Shared Services Account", purpose: "Transit Gateway, Directory Service", access: "Network team" },
                { name: "Client Workload OUs", purpose: "Isolated client environments", access: "Per-client RBAC" }
            ],
            scps: [
                {
                    name: "Deny Non-GovCloud Regions",
                    policy: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyNonGovCloudRegions",
    "Effect": "Deny",
    "Action": "*",
    "Resource": "*",
    "Condition": {
      "StringNotEquals": {
        "aws:RequestedRegion": ["us-gov-west-1", "us-gov-east-1"]
      }
    }
  }]
}`
                },
                {
                    name: "Require IMDSv2",
                    policy: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "RequireIMDSv2",
    "Effect": "Deny",
    "Action": "ec2:RunInstances",
    "Resource": "arn:aws-us-gov:ec2:*:*:instance/*",
    "Condition": {
      "StringNotEquals": {
        "ec2:MetadataHttpTokens": "required"
      }
    }
  }]
}`
                }
            ]
        },

        identity: {
            title: "Identity & Access Management",
            services: [
                {
                    name: "AWS IAM Identity Center (SSO)",
                    cmmc: ["3.5.1", "3.5.2", "3.5.3"],
                    config: {
                        idp: "Integrate with Okta, Entra ID, or AWS Managed AD",
                        mfa: "Required for all users (TOTP or FIDO2)",
                        sessionDuration: "Maximum 8 hours for standard, 1 hour for privileged",
                        permissionSets: [
                            { name: "ReadOnlyAccess", accounts: "All", duration: "8 hours" },
                            { name: "PowerUserAccess", accounts: "Workload", duration: "4 hours" },
                            { name: "AdministratorAccess", accounts: "Limited", duration: "1 hour" }
                        ]
                    }
                },
                {
                    name: "IAM Policies",
                    cmmc: ["3.1.1", "3.1.2", "3.1.5"],
                    bestPractices: [
                        "Use IAM roles, not long-term access keys",
                        "Implement least privilege with policy boundaries",
                        "Use service control policies (SCPs) for guardrails",
                        "Enable IAM Access Analyzer to identify overly permissive policies",
                        "Rotate any necessary access keys every 90 days"
                    ]
                }
            ]
        },

        network: {
            title: "Network Architecture",
            components: [
                {
                    name: "Transit Gateway",
                    purpose: "Central hub for VPC connectivity",
                    config: {
                        attachments: ["Client VPCs", "Shared Services VPC", "On-premises (VPN/Direct Connect)"],
                        routeTables: "Separate route tables per security zone",
                        flowLogs: "Enable and send to centralized S3"
                    }
                },
                {
                    name: "AWS Network Firewall",
                    purpose: "Stateful inspection, IDS/IPS",
                    cmmc: ["3.13.1", "3.13.5", "3.14.6"],
                    rules: [
                        "Block known malicious domains (threat intelligence)",
                        "Allow only necessary outbound ports (443, 80)",
                        "Enable Suricata-compatible IDS rules",
                        "Log all traffic to CloudWatch Logs"
                    ]
                },
                {
                    name: "VPC Configuration",
                    requirements: [
                        "Enable VPC Flow Logs (ALL traffic)",
                        "Use private subnets for all workloads",
                        "NAT Gateway or Network Firewall for outbound",
                        "No direct internet ingress (use ALB/NLB in DMZ)",
                        "Security groups with deny-by-default"
                    ]
                }
            ]
        },

        security: {
            title: "Security Services",
            services: [
                {
                    name: "AWS Security Hub",
                    cmmc: ["3.11.1", "3.12.1", "3.12.2"],
                    standards: [
                        { name: "NIST 800-171", enabled: true, note: "Primary standard for CMMC" },
                        { name: "AWS Foundational Security", enabled: true, note: "AWS best practices" },
                        { name: "CIS AWS Benchmark", enabled: true, note: "Hardening baseline" }
                    ],
                    aggregation: "Aggregate all accounts to security tooling account"
                },
                {
                    name: "Amazon GuardDuty",
                    cmmc: ["3.14.6", "3.14.7"],
                    features: ["EC2 threat detection", "S3 protection", "EKS protection", "Malware scanning"],
                    integration: "Feed findings to Security Hub"
                },
                {
                    name: "AWS Config",
                    cmmc: ["3.4.1", "3.4.2", "3.11.2"],
                    rules: [
                        "ec2-instance-managed-by-systems-manager",
                        "encrypted-volumes",
                        "s3-bucket-ssl-requests-only",
                        "iam-user-mfa-enabled",
                        "cloudtrail-enabled",
                        "vpc-flow-logs-enabled"
                    ],
                    conformancePacks: ["Operational Best Practices for NIST 800-171"]
                },
                {
                    name: "AWS CloudTrail",
                    cmmc: ["3.3.1", "3.3.2", "3.3.4"],
                    config: {
                        scope: "Organization trail covering all accounts and regions",
                        logValidation: "Enable log file validation",
                        encryption: "SSE-KMS with customer-managed key",
                        retention: "S3 lifecycle: 90 days Standard, 1 year Glacier",
                        monitoring: "CloudWatch Logs for real-time alerts"
                    }
                }
            ]
        },

        checklist: {
            title: "AWS GovCloud Implementation Checklist",
            categories: [
                {
                    name: "Account Setup",
                    items: [
                        { task: "Create GovCloud account via commercial AWS", critical: true, effort: "1-2 days" },
                        { task: "Complete US person verification for root account", critical: true, effort: "1 week" },
                        { task: "Enable AWS Organizations", critical: true, effort: "1 day" },
                        { task: "Create organizational units (Security, Workloads, Sandbox)", critical: true, effort: "2-4 hours" },
                        { task: "Deploy service control policies (SCPs)", critical: true, effort: "4-8 hours" }
                    ]
                },
                {
                    name: "Identity Foundation",
                    items: [
                        { task: "Enable IAM Identity Center", critical: true, effort: "4-8 hours" },
                        { task: "Integrate with identity provider (Okta, Entra ID)", critical: true, effort: "1 day" },
                        { task: "Configure MFA for all users", critical: true, effort: "2-4 hours" },
                        { task: "Create permission sets with least privilege", critical: true, effort: "1 day" },
                        { task: "Enable IAM Access Analyzer", critical: false, effort: "1 hour" }
                    ]
                },
                {
                    name: "Logging & Monitoring",
                    items: [
                        { task: "Create organization CloudTrail", critical: true, effort: "2-4 hours" },
                        { task: "Enable CloudTrail log validation", critical: true, effort: "1 hour" },
                        { task: "Configure S3 bucket for log archive", critical: true, effort: "2-4 hours" },
                        { task: "Enable VPC Flow Logs in all VPCs", critical: true, effort: "2-4 hours" },
                        { task: "Configure CloudWatch Log retention (1 year)", critical: true, effort: "1 hour" }
                    ]
                },
                {
                    name: "Security Services",
                    items: [
                        { task: "Enable Security Hub in all accounts", critical: true, effort: "2-4 hours" },
                        { task: "Enable NIST 800-171 standard in Security Hub", critical: true, effort: "1 hour" },
                        { task: "Enable GuardDuty in all accounts", critical: true, effort: "2-4 hours" },
                        { task: "Configure GuardDuty finding aggregation", critical: true, effort: "1 hour" },
                        { task: "Enable AWS Config with conformance packs", critical: true, effort: "4-8 hours" },
                        { task: "Deploy AWS Network Firewall", critical: true, effort: "1 day" }
                    ]
                },
                {
                    name: "Data Protection",
                    items: [
                        { task: "Enable default S3 encryption (SSE-KMS)", critical: true, effort: "2-4 hours" },
                        { task: "Create KMS keys for each data classification", critical: true, effort: "2-4 hours" },
                        { task: "Enable S3 Block Public Access at account level", critical: true, effort: "1 hour" },
                        { task: "Configure Macie for CUI scanning (if applicable)", critical: false, effort: "4-8 hours" },
                        { task: "Enable EBS encryption by default", critical: true, effort: "1 hour" }
                    ]
                }
            ]
        }
    },

    // ==================== GCP ASSURED WORKLOADS ====================
    gcp: {
        overview: {
            title: "Google Cloud Platform - Assured Workloads",
            description: "Assured Workloads enables compliance with FedRAMP and other regulatory frameworks by enforcing data residency, personnel controls, and service restrictions.",
            keyPoints: [
                "Workload folders with compliance controls enforced",
                "US-only data residency via organization policies",
                "Support for FedRAMP Moderate, High, and IL4",
                "Premium support tier required for compliance"
            ],
            consoleUrl: "https://console.cloud.google.com",
            complianceLevel: "FedRAMP Moderate/High, IL4 (limited services)"
        },

        assuredWorkloads: {
            title: "Assured Workloads Configuration",
            regimes: [
                {
                    name: "FedRAMP Moderate",
                    services: "Most GCP services available",
                    restrictions: "US regions only, access transparency"
                },
                {
                    name: "FedRAMP High",
                    services: "Subset of services, manual approval for some",
                    restrictions: "US regions, personnel access controls, key management"
                },
                {
                    name: "IL4",
                    services: "Limited services (Compute, GKE, Cloud Storage, BigQuery)",
                    restrictions: "Strictest controls, dedicated infrastructure for some"
                }
            ],
            setup: `# Create Assured Workloads folder
gcloud assured workloads create \\
  --organization=ORGANIZATION_ID \\
  --location=us \\
  --display-name="CUI-Workloads" \\
  --compliance-regime=FEDRAMP_HIGH \\
  --billing-account=BILLING_ACCOUNT_ID`
        },

        identity: {
            title: "Identity & Access Management",
            components: [
                {
                    name: "Cloud Identity",
                    config: {
                        mfa: "2-Step Verification required for all users",
                        methods: ["Security keys (FIDO2)", "Google Authenticator", "Push notifications"],
                        policy: "Security keys required for admin accounts"
                    }
                },
                {
                    name: "IAM Policies",
                    bestPractices: [
                        "Use service accounts with minimal permissions",
                        "Implement organization policy constraints",
                        "Use IAM Conditions for context-aware access",
                        "Enable IAM Recommender to identify excess permissions"
                    ]
                },
                {
                    name: "BeyondCorp Enterprise",
                    description: "Zero-trust access to applications without VPN",
                    features: ["Device trust", "User context", "Application-level access"]
                }
            ]
        },

        security: {
            title: "Security Services",
            services: [
                {
                    name: "Security Command Center Premium",
                    cmmc: ["3.11.1", "3.14.6", "3.14.7"],
                    features: [
                        "Security Health Analytics (misconfigurations)",
                        "Event Threat Detection (runtime threats)",
                        "Container Threat Detection",
                        "Web Security Scanner",
                        "Compliance monitoring"
                    ]
                },
                {
                    name: "Chronicle SIEM/SOAR",
                    cmmc: ["3.3.1", "3.3.5", "3.6.1"],
                    features: [
                        "Petabyte-scale log analysis",
                        "YARA-L detection rules",
                        "Automated response playbooks",
                        "Threat intelligence integration"
                    ]
                },
                {
                    name: "VPC Service Controls",
                    cmmc: ["3.13.1", "3.13.5"],
                    description: "Define security perimeters around GCP resources",
                    config: `# Create VPC Service Controls perimeter
gcloud access-context-manager perimeters create cui-perimeter \\
  --title="CUI Data Perimeter" \\
  --resources=projects/PROJECT_NUMBER \\
  --restricted-services=storage.googleapis.com,bigquery.googleapis.com \\
  --access-levels=accessPolicies/POLICY_ID/accessLevels/LEVEL_NAME`
                }
            ]
        },

        checklist: {
            title: "GCP Assured Workloads Checklist",
            categories: [
                {
                    name: "Organization Setup",
                    items: [
                        { task: "Create GCP Organization with Cloud Identity", critical: true, effort: "1 day" },
                        { task: "Enable Assured Workloads for organization", critical: true, effort: "1 day" },
                        { task: "Create Assured Workloads folder (FedRAMP High)", critical: true, effort: "2-4 hours" },
                        { task: "Configure organization policy constraints", critical: true, effort: "4-8 hours" },
                        { task: "Set up resource location restriction (US only)", critical: true, effort: "1 hour" }
                    ]
                },
                {
                    name: "Identity & Access",
                    items: [
                        { task: "Enable 2-Step Verification for all users", critical: true, effort: "2-4 hours" },
                        { task: "Require security keys for admin accounts", critical: true, effort: "4-8 hours" },
                        { task: "Configure IAM roles with least privilege", critical: true, effort: "1 day" },
                        { task: "Enable IAM Recommender", critical: false, effort: "1 hour" },
                        { task: "Set up BeyondCorp (if applicable)", critical: false, effort: "1-2 days" }
                    ]
                },
                {
                    name: "Security & Monitoring",
                    items: [
                        { task: "Enable Security Command Center Premium", critical: true, effort: "2-4 hours" },
                        { task: "Configure Cloud Audit Logs", critical: true, effort: "2-4 hours" },
                        { task: "Set up log sinks to BigQuery/Cloud Storage", critical: true, effort: "4-8 hours" },
                        { task: "Enable VPC Service Controls", critical: true, effort: "4-8 hours" },
                        { task: "Configure Cloud Armor WAF", critical: true, effort: "4-8 hours" }
                    ]
                },
                {
                    name: "Data Protection",
                    items: [
                        { task: "Enable CMEK for all storage services", critical: true, effort: "4-8 hours" },
                        { task: "Configure DLP API for data scanning", critical: false, effort: "1 day" },
                        { task: "Enable VPC Flow Logs", critical: true, effort: "2-4 hours" },
                        { task: "Configure data access audit logs", critical: true, effort: "2-4 hours" }
                    ]
                }
            ]
        }
    },

    // ==================== SIEM/MSSP OPERATIONS ====================
    siem: {
        platforms: {
            sentinel: {
                name: "Microsoft Sentinel",
                authorization: "FedRAMP High (GCC High)",
                bestFor: "Microsoft-centric environments, Azure/M365 shops",
                pricing: "Pay-per-GB ingested (commitment tiers available)",
                msspFeatures: [
                    "Multi-workspace architecture for client isolation",
                    "Azure Lighthouse integration for management",
                    "Cross-workspace queries for SOC visibility",
                    "MSSP-specific content hub solutions"
                ],
                cmmcContent: {
                    workbook: "CMMC 2.0 Compliance Workbook (Content Hub)",
                    rules: "CMMC-aligned analytics rules",
                    playbooks: "Automated response for common incidents"
                }
            },
            splunk: {
                name: "Splunk Enterprise Security",
                authorization: "FedRAMP High (Splunk Cloud for Government)",
                bestFor: "Multi-cloud, on-premises heavy, advanced analytics",
                pricing: "Per-GB indexed or ingest-based licensing",
                msspFeatures: [
                    "Multi-tenant architecture via apps/indexes",
                    "Federated search across deployments",
                    "Custom dashboards per client",
                    "SOAR integration (Splunk SOAR)"
                ]
            },
            chronicle: {
                name: "Google Chronicle",
                authorization: "FedRAMP Moderate (High in progress)",
                bestFor: "GCP environments, large-scale analysis, threat hunting",
                pricing: "Per-GB ingested (generous retention)",
                msspFeatures: [
                    "Native multi-tenancy",
                    "YARA-L for custom detection",
                    "Petabyte-scale search",
                    "VirusTotal integration"
                ]
            }
        },

        loggingRequirements: {
            title: "CMMC Logging Requirements Mapped",
            controls: [
                {
                    control: "3.3.1",
                    requirement: "Create and retain system audit logs",
                    sources: ["Windows Security Events", "Linux auditd", "Cloud audit logs", "Application logs"],
                    retention: "90 days online, 1 year total"
                },
                {
                    control: "3.3.2",
                    requirement: "Ensure actions can be uniquely traced to individual users",
                    sources: ["Authentication logs", "User session logs", "Privileged access logs"],
                    implementation: "Correlate events by user ID, session ID, source IP"
                },
                {
                    control: "3.3.4",
                    requirement: "Alert on audit logging process failures",
                    alerts: ["Agent heartbeat failures", "Log storage capacity", "Ingestion delays"],
                    implementation: "Monitor health of all logging agents and pipelines"
                },
                {
                    control: "3.3.5",
                    requirement: "Correlate audit record review, analysis, and reporting",
                    implementation: "SIEM correlation rules, scheduled reports, analyst workflows"
                }
            ]
        },

        msspArchitecture: {
            title: "MSSP Architecture Patterns",
            patterns: [
                {
                    name: "Hub-Spoke SIEM",
                    description: "Central SOC with dedicated workspaces per client",
                    pros: ["Complete data isolation", "Per-client retention policies", "Simplified compliance"],
                    cons: ["Higher cost", "More complex queries", "Duplicate analytics rules"]
                },
                {
                    name: "Aggregated with RBAC",
                    description: "Single workspace with client data tagged and access controlled",
                    pros: ["Lower cost", "Easier correlation", "Single rule set"],
                    cons: ["Risk of data leakage", "Complex RBAC", "May not meet strict isolation requirements"]
                }
            ],
            recommendation: "For CMMC clients: Hub-Spoke with cross-workspace queries for SOC"
        }
    },

    // ==================== VDI SOLUTIONS ====================
    vdi: {
        solutions: {
            avd: {
                name: "Azure Virtual Desktop (AVD)",
                authorization: "FedRAMP High (GCC High)",
                bestFor: "Microsoft 365 integration, Windows 10/11 desktops",
                features: [
                    "Multi-session Windows 10/11 Enterprise",
                    "FSLogix profile management",
                    "Teams AV optimization",
                    "Integrated with Entra ID Conditional Access"
                ],
                security: {
                    authentication: "Entra ID + MFA + Conditional Access",
                    networkIsolation: "Dedicated host pools per security boundary",
                    dataProtection: "No local data, encrypted profile disks",
                    monitoring: "Integrate with Sentinel for session monitoring"
                },
                sizing: {
                    lightUser: "2 vCPU, 4 GB RAM (D2s_v3)",
                    standardUser: "4 vCPU, 8 GB RAM (D4s_v3)",
                    powerUser: "8 vCPU, 16 GB RAM (D8s_v3)"
                }
            },
            workspaces: {
                name: "Amazon WorkSpaces",
                authorization: "FedRAMP High (GovCloud)",
                bestFor: "AWS-centric, BYOL Windows, Linux desktops",
                features: [
                    "PCoIP or WorkSpaces Streaming Protocol (WSP)",
                    "Managed or BYOL Windows/Linux",
                    "Directory Service integration",
                    "Pay-as-you-go or monthly billing"
                ],
                security: {
                    authentication: "AWS Directory Service or AD Connector + MFA",
                    networkIsolation: "Dedicated VPC per client",
                    dataProtection: "Encrypted volumes, no local admin",
                    monitoring: "CloudWatch Logs for session events"
                }
            },
            citrix: {
                name: "Citrix DaaS (Cloud)",
                authorization: "FedRAMP High (Citrix Cloud Government)",
                bestFor: "Enterprise features, multi-cloud, advanced policies",
                features: [
                    "HDX protocol for optimal performance",
                    "Advanced session policies",
                    "App layering and virtualization",
                    "Citrix Analytics for security"
                ],
                security: {
                    authentication: "SAML/OIDC federation + MFA",
                    networkIsolation: "Resource locations per security boundary",
                    dataProtection: "Session watermarking, clipboard control",
                    monitoring: "Citrix Analytics + SIEM integration"
                }
            }
        },

        securityControls: {
            title: "VDI Security Controls for CMMC",
            controls: [
                {
                    category: "Authentication",
                    cmmc: ["3.5.1", "3.5.2", "3.5.3"],
                    requirements: [
                        "MFA required for all VDI access",
                        "Certificate-based authentication for high-privilege users",
                        "Session timeout ≤15 minutes idle, ≤8 hours maximum",
                        "Re-authentication required for sensitive operations"
                    ]
                },
                {
                    category: "Data Protection",
                    cmmc: ["3.1.3", "3.8.1", "3.8.2"],
                    requirements: [
                        "Disable clipboard redirection (or enable one-way: host to client)",
                        "Disable drive/USB redirection",
                        "Enable session watermarking with user ID",
                        "Block printing to local devices (allow only approved network printers)"
                    ]
                },
                {
                    category: "Network",
                    cmmc: ["3.13.1", "3.13.5"],
                    requirements: [
                        "VDI hosts in isolated subnet with NSG/Security Group",
                        "No direct internet access from session hosts",
                        "All traffic through firewall with inspection",
                        "Private endpoints for backend services"
                    ]
                },
                {
                    category: "Monitoring",
                    cmmc: ["3.3.1", "3.14.6"],
                    requirements: [
                        "Log all session start/end events",
                        "Log application launches within sessions",
                        "Consider session recording for privileged access",
                        "Alert on anomalous session behavior"
                    ]
                }
            ]
        }
    },

    // ==================== AUTOMATION SCRIPTS ====================
    automation: {
        azure: {
            title: "Azure Automation Scripts",
            scripts: [
                {
                    name: "Enable MFA via Conditional Access",
                    language: "PowerShell (Microsoft Graph)",
                    code: `# Connect to Microsoft Graph
Connect-MgGraph -Scopes "Policy.Read.All","Policy.ReadWrite.ConditionalAccess"

# Create Conditional Access Policy
$params = @{
    displayName = "CMMC-CA-001: Require MFA for All Users"
    state = "enabled"
    conditions = @{
        users = @{ includeUsers = @("All") }
        applications = @{ includeApplications = @("All") }
        clientAppTypes = @("all")
    }
    grantControls = @{
        operator = "OR"
        builtInControls = @("mfa")
    }
}
New-MgIdentityConditionalAccessPolicy -BodyParameter $params`
                },
                {
                    name: "Configure Diagnostic Settings",
                    language: "Azure CLI",
                    code: `# Enable diagnostic settings for subscription activity logs
az monitor diagnostic-settings create \\
  --name "cmmc-audit-logs" \\
  --resource "/subscriptions/\${SUBSCRIPTION_ID}" \\
  --workspace "\${LOG_ANALYTICS_WORKSPACE_ID}" \\
  --logs '[
    {"category": "Administrative", "enabled": true},
    {"category": "Security", "enabled": true},
    {"category": "ServiceHealth", "enabled": true},
    {"category": "Alert", "enabled": true},
    {"category": "Recommendation", "enabled": true},
    {"category": "Policy", "enabled": true},
    {"category": "Autoscale", "enabled": true},
    {"category": "ResourceHealth", "enabled": true}
  ]'`
                },
                {
                    name: "Deploy Azure Policy for CMMC",
                    language: "Azure CLI",
                    code: `# Assign CMMC Level 2 policy initiative
az policy assignment create \\
  --name "cmmc-level2-baseline" \\
  --display-name "CMMC Level 2 Baseline" \\
  --policy-set-definition "/providers/Microsoft.Authorization/policySetDefinitions/3937e553-e5a8-4bc1-9d1e-10e5f10b48a8" \\
  --scope "/subscriptions/\${SUBSCRIPTION_ID}" \\
  --mi-system-assigned \\
  --location "usgovvirginia"`
                }
            ]
        },
        aws: {
            title: "AWS Automation Scripts",
            scripts: [
                {
                    name: "Enable CloudTrail Organization Trail",
                    language: "AWS CLI",
                    code: `# Create organization trail
aws cloudtrail create-trail \\
  --name "org-trail-cmmc" \\
  --s3-bucket-name "org-cloudtrail-logs-\${ACCOUNT_ID}" \\
  --is-organization-trail \\
  --is-multi-region-trail \\
  --enable-log-file-validation \\
  --kms-key-id "arn:aws-us-gov:kms:us-gov-west-1:\${ACCOUNT_ID}:key/\${KEY_ID}"

# Enable logging
aws cloudtrail start-logging --name "org-trail-cmmc"`
                },
                {
                    name: "Enable Security Hub with NIST 800-171",
                    language: "AWS CLI",
                    code: `# Enable Security Hub
aws securityhub enable-security-hub \\
  --enable-default-standards=false

# Enable NIST 800-171 standard
aws securityhub batch-enable-standards \\
  --standards-subscription-requests '[
    {
      "StandardsArn": "arn:aws-us-gov:securityhub:us-gov-west-1::standards/nist-800-171/v/2.0.0"
    }
  ]'`
                },
                {
                    name: "Deploy GuardDuty with Delegated Admin",
                    language: "AWS CLI",
                    code: `# Enable GuardDuty (run from management account)
aws guardduty enable-organization-admin-account \\
  --admin-account-id "\${SECURITY_ACCOUNT_ID}"

# Enable all features in security account
aws guardduty create-detector \\
  --enable \\
  --finding-publishing-frequency FIFTEEN_MINUTES \\
  --data-sources '{
    "S3Logs": {"Enable": true},
    "Kubernetes": {"AuditLogs": {"Enable": true}},
    "MalwareProtection": {"ScanEc2InstanceWithFindings": {"EbsVolumes": {"Enable": true}}}
  }'`
                }
            ]
        }
    }
};

// Export for use in modules
if (typeof window !== 'undefined') {
    window.MSP_PORTAL_DATA = MSP_PORTAL_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MSP_PORTAL_DATA;
}
