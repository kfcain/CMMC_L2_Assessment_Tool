// Comprehensive Implementation Guidance - Rev 3 New Controls Part 2
// Covers: PE.03.10.08, RA.03.11.04, CA.03.12.05, SI.03.14.08,
//         PL.03.15.03, SA.03.16.01, SA.03.16.02, SA.03.16.03

const COMPREHENSIVE_GUIDANCE_R3_NEW2 = {
    version: "1.0.0",
    lastUpdated: "2026-02-08",
    description: "Guidance for remaining 8 new Rev 3 controls (Part 2)",
    objectives: {

        // ========================================
        // PHYSICAL AND ENVIRONMENTAL PROTECTION (PE)
        // ========================================

        "PE.L2-03.10.08": {
            objective: "Control physical access to system distribution and transmission lines within organizational facilities to prevent unauthorized access, tampering, or interception.",
            cloud: {
                aws: {
                    services: ["AWS Direct Connect", "AWS PrivateLink", "AWS VPN", "AWS CloudTrail"],
                    implementation: {
                        steps: [
                            "Use AWS Direct Connect with dedicated connections to avoid public internet for CUI transmission",
                            "Implement PrivateLink for private connectivity to AWS services without internet exposure",
                            "Deploy Site-to-Site VPN with IPSec encryption for all CUI data in transit",
                            "Document physical security controls at Direct Connect locations and colocation facilities",
                            "Verify AWS data center physical security certifications (SOC 2, FedRAMP)",
                            "Monitor CloudTrail for Direct Connect and VPN configuration changes"
                        ],
                        verification: ["Verify Direct Connect physical security documentation", "Confirm PrivateLink endpoints are configured", "Review VPN tunnel encryption settings"],
                        cost_estimate: "$200-1000/month (Direct Connect)",
                        effort_hours: 16
                    }
                },
                azure: {
                    services: ["Azure ExpressRoute", "Azure Private Link", "Azure VPN Gateway"],
                    implementation: {
                        steps: [
                            "Deploy Azure ExpressRoute for private connectivity bypassing public internet",
                            "Implement Private Link for private access to Azure PaaS services",
                            "Configure VPN Gateway with IPSec/IKEv2 encryption for site-to-site connectivity",
                            "Document physical security at ExpressRoute peering locations",
                            "Verify Microsoft data center physical security certifications",
                            "Enable diagnostic logging for ExpressRoute and VPN configuration changes"
                        ],
                        verification: ["Verify ExpressRoute physical security documentation", "Confirm Private Link endpoints", "Review VPN encryption settings"],
                        cost_estimate: "$200-1000/month (ExpressRoute)",
                        effort_hours: 16
                    }
                },
                gcp: {
                    services: ["Cloud Interconnect", "Private Google Access", "Cloud VPN"],
                    implementation: {
                        steps: [
                            "Deploy Dedicated Interconnect for private connectivity to GCP",
                            "Enable Private Google Access for private communication with GCP services",
                            "Configure Cloud VPN with IPSec encryption for site-to-site connectivity",
                            "Document physical security at Interconnect colocation facilities",
                            "Verify GCP data center physical security certifications",
                            "Enable audit logging for Interconnect and VPN configuration changes"
                        ],
                        verification: ["Verify Interconnect physical security documentation", "Confirm Private Google Access is enabled", "Review VPN encryption settings"],
                        cost_estimate: "$200-1000/month (Interconnect)",
                        effort_hours: 16
                    }
                }
            },
            firewalls: {
                paloalto: {
                    services: ["Palo Alto NGFW", "GlobalProtect", "Panorama"],
                    implementation: {
                        steps: [
                            "Deploy firewalls in physically secured network closets and data centers",
                            "Implement encrypted tunnels (IPSec/SSL) for all CUI transmission between sites",
                            "Configure GlobalProtect for encrypted remote access to CUI resources",
                            "Use Panorama to monitor and audit all tunnel and VPN configurations",
                            "Document physical access controls for firewall hardware and network cabling",
                            "Implement tamper detection for network cabling in accessible areas"
                        ],
                        verification: ["Verify firewall physical security", "Confirm tunnel encryption settings", "Review physical access logs for network closets"],
                        cost_estimate: "Included with existing deployment",
                        effort_hours: 12
                    }
                }
            },
            small_business: {
                approach: "Secure network cabling and equipment in locked spaces, use encrypted connections for all CUI transmission, and document physical access controls.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "Locking network cabinets", cost: "$200-500", purpose: "Physical security for network equipment" },
                        { name: "Cable management with tamper seals", cost: "$50-100", purpose: "Detect unauthorized cable access" },
                        { name: "VPN solution", cost: "$5-10/user/month", purpose: "Encrypted transmission" }
                    ],
                    steps: [
                        "Install network equipment in locked cabinets or rooms with access controls",
                        "Route network cabling through secured pathways (conduit, ceiling, locked raceways)",
                        "Use encrypted connections (VPN/TLS) for all CUI transmission between locations",
                        "Implement visitor escort procedures for areas with network infrastructure",
                        "Conduct periodic physical inspections of cabling and network equipment",
                        "Document physical security controls for all transmission infrastructure"
                    ]
                }
            }
        },

        // ========================================
        // RISK ASSESSMENT (RA) - New Controls
        // ========================================

        "RA.L2-03.11.04": {
            objective: "Respond to findings from security assessments, monitoring, and audits in accordance with organizational risk tolerance and priorities.",
            cloud: {
                aws: {
                    services: ["AWS Security Hub", "AWS Config", "Amazon EventBridge", "AWS Systems Manager"],
                    implementation: {
                        steps: [
                            "Configure Security Hub to aggregate findings with severity-based prioritization",
                            "Create EventBridge rules to automatically route critical findings to response workflows",
                            "Use Systems Manager Automation to remediate common findings automatically",
                            "Define risk response categories: Accept, Mitigate, Transfer, Avoid for each finding type",
                            "Establish SLAs for risk response by severity: Critical (15 days), High (30 days), Medium (90 days)",
                            "Create Security Hub custom actions for risk acceptance documentation",
                            "Schedule monthly risk review meetings to assess open findings and response progress"
                        ],
                        verification: ["Review Security Hub finding age and response status", "Verify automated remediation is functioning", "Confirm risk acceptance decisions are documented"],
                        cost_estimate: "$50-200/month",
                        effort_hours: 24
                    }
                },
                azure: {
                    services: ["Defender for Cloud", "Azure Policy", "Azure Logic Apps", "Microsoft Sentinel"],
                    implementation: {
                        steps: [
                            "Use Defender for Cloud recommendations with severity-based prioritization",
                            "Create Logic Apps to automate response workflows for common finding types",
                            "Implement Azure Policy remediation tasks for configuration drift",
                            "Define risk response categories and document acceptance criteria",
                            "Establish SLAs for risk response by severity level",
                            "Configure Sentinel analytics rules to detect unresolved high-risk findings",
                            "Schedule monthly risk review meetings to assess response progress"
                        ],
                        verification: ["Review Defender recommendation status", "Verify automated remediation workflows", "Confirm risk acceptance documentation"],
                        cost_estimate: "$0-100/month",
                        effort_hours: 24
                    }
                },
                gcp: {
                    services: ["Security Command Center", "Cloud Functions", "Pub/Sub", "Cloud Monitoring"],
                    implementation: {
                        steps: [
                            "Configure SCC to prioritize findings by severity and asset criticality",
                            "Create Cloud Functions to automate response for common finding types",
                            "Use Pub/Sub to route findings to appropriate response teams",
                            "Define risk response categories and document acceptance criteria",
                            "Establish SLAs for risk response by severity level",
                            "Set up Cloud Monitoring dashboards tracking finding resolution rates",
                            "Schedule monthly risk review meetings to assess response progress"
                        ],
                        verification: ["Review SCC finding status and age", "Verify automated response functions", "Confirm risk acceptance documentation"],
                        cost_estimate: "$0-100/month",
                        effort_hours: 24
                    }
                }
            },
            vuln_mgmt: {
                tenable: {
                    services: ["Tenable.io Vulnerability Management", "Tenable.io Dashboards", "Tenable.io Reports"],
                    implementation: {
                        steps: [
                            "Configure Tenable.io to prioritize vulnerabilities using VPR (Vulnerability Priority Rating)",
                            "Create remediation SLAs: Critical VPR 9+ (15 days), High 7-8.9 (30 days), Medium 4-6.9 (90 days)",
                            "Set up automated scan schedules and remediation tracking workflows",
                            "Create dashboards showing vulnerability age, SLA compliance, and remediation trends",
                            "Document risk acceptance decisions for vulnerabilities that cannot be remediated",
                            "Generate monthly risk response reports for management review"
                        ],
                        verification: ["Review VPR-based prioritization accuracy", "Verify SLA compliance rates", "Confirm risk acceptance documentation"],
                        cost_estimate: "Included with Tenable.io",
                        effort_hours: 16
                    }
                }
            },
            small_business: {
                approach: "Establish a risk response process with defined SLAs, document risk acceptance decisions, and track remediation progress.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "Risk register spreadsheet", cost: "Free", purpose: "Track findings and response decisions" },
                        { name: "POA&M template", cost: "Free", purpose: "Document remediation plans" },
                        { name: "Risk acceptance form", cost: "Free", purpose: "Document accepted risks" }
                    ],
                    steps: [
                        "Create a risk register to track all findings from assessments and monitoring",
                        "Define risk response SLAs by severity: Critical (15 days), High (30 days), Medium (90 days)",
                        "Categorize each finding: Mitigate, Accept, Transfer, or Avoid",
                        "Document risk acceptance decisions with justification and approver signature",
                        "Create POA&M entries for findings requiring remediation",
                        "Conduct monthly risk review meetings to assess progress"
                    ]
                }
            }
        },

        // ========================================
        // SECURITY ASSESSMENT (CA) - New Controls
        // ========================================

        "CA.L2-03.12.05": {
            objective: "Define, document, approve, and enforce access restrictions associated with information exchange between systems and external parties.",
            cloud: {
                aws: {
                    services: ["AWS RAM", "AWS PrivateLink", "AWS API Gateway", "AWS WAF", "AWS Organizations SCPs"],
                    implementation: {
                        steps: [
                            "Use AWS RAM to control resource sharing with external AWS accounts",
                            "Implement PrivateLink for secure data exchange with external service providers",
                            "Deploy API Gateway with authentication and rate limiting for external API access",
                            "Configure WAF rules to protect external-facing data exchange endpoints",
                            "Create Organizations SCPs restricting external sharing capabilities",
                            "Document all information exchange agreements (ISAs/MOUs) with external parties",
                            "Implement CloudTrail monitoring for all cross-account and external data transfers"
                        ],
                        verification: ["Review RAM sharing permissions", "Verify API Gateway authentication", "Confirm ISA/MOU documentation is current"],
                        cost_estimate: "$50-300/month",
                        effort_hours: 32
                    }
                },
                azure: {
                    services: ["Azure B2B Collaboration", "Azure API Management", "Azure Private Link", "Azure Policy"],
                    implementation: {
                        steps: [
                            "Configure Entra ID B2B collaboration policies for external user access",
                            "Deploy API Management for controlled external API access with authentication",
                            "Implement Private Link for secure data exchange with external partners",
                            "Create Azure Policy to restrict external sharing and guest access",
                            "Document all information exchange agreements with external parties",
                            "Enable audit logging for all external collaboration and data sharing events",
                            "Review and recertify external access quarterly"
                        ],
                        verification: ["Review B2B collaboration policies", "Verify API Management authentication", "Confirm ISA/MOU documentation"],
                        cost_estimate: "$0-200/month",
                        effort_hours: 28
                    }
                },
                gcp: {
                    services: ["VPC Service Controls", "Cloud IAM", "Apigee API Management", "Cloud Armor"],
                    implementation: {
                        steps: [
                            "Configure VPC Service Controls to restrict data exchange across project boundaries",
                            "Implement Cloud IAM policies controlling external user and service account access",
                            "Deploy Apigee for managed external API access with authentication and rate limiting",
                            "Use Cloud Armor to protect external-facing data exchange endpoints",
                            "Document all information exchange agreements with external parties",
                            "Enable audit logging for all cross-project and external data transfers",
                            "Review and recertify external access quarterly"
                        ],
                        verification: ["Review VPC Service Controls perimeters", "Verify Apigee authentication policies", "Confirm ISA/MOU documentation"],
                        cost_estimate: "$50-300/month",
                        effort_hours: 28
                    }
                }
            },
            small_business: {
                approach: "Document all information exchange agreements with external parties and implement technical controls to enforce approved exchange methods.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "ISA/MOU templates", cost: "Free", purpose: "Document exchange agreements" },
                        { name: "Encrypted file transfer (SFTP)", cost: "Free-$50/month", purpose: "Secure data exchange" },
                        { name: "Firewall rules", cost: "Included", purpose: "Restrict external connections" }
                    ],
                    steps: [
                        "Inventory all external parties with whom CUI is exchanged",
                        "Create Information Sharing Agreements (ISAs) or MOUs for each external party",
                        "Define approved methods for information exchange (encrypted email, SFTP, API)",
                        "Configure firewall rules to restrict external connections to approved endpoints",
                        "Implement encryption for all CUI data in transit to external parties",
                        "Review and recertify exchange agreements annually"
                    ]
                }
            }
        },

        // ========================================
        // SYSTEM AND INFORMATION INTEGRITY (SI)
        // ========================================

        "SI.L2-03.14.08": {
            objective: "Manage and retain information within the system and information output from the system in accordance with applicable laws, executive orders, directives, regulations, policies, standards, guidelines, and operational requirements.",
            cloud: {
                aws: {
                    services: ["Amazon S3 Lifecycle", "AWS Backup", "Amazon S3 Object Lock", "AWS CloudTrail Lake"],
                    implementation: {
                        steps: [
                            "Configure S3 Lifecycle policies to manage CUI data retention and deletion schedules",
                            "Implement S3 Object Lock (WORM) for records requiring immutable retention",
                            "Deploy AWS Backup with retention policies aligned to regulatory requirements",
                            "Use CloudTrail Lake for long-term audit log retention (DFARS requires 6 years)",
                            "Create data retention policies mapping CUI types to retention periods",
                            "Implement automated deletion workflows for data past retention period",
                            "Document retention schedules and legal holds procedures"
                        ],
                        verification: ["Review S3 Lifecycle policy configurations", "Verify Object Lock compliance mode settings", "Confirm backup retention meets requirements"],
                        cost_estimate: "$50-300/month (storage costs)",
                        effort_hours: 24
                    }
                },
                azure: {
                    services: ["Microsoft Purview Data Lifecycle", "Azure Blob Storage Lifecycle", "Azure Backup", "Microsoft 365 Retention"],
                    implementation: {
                        steps: [
                            "Configure Purview Data Lifecycle Management for automated retention and deletion",
                            "Implement Azure Blob Storage lifecycle management for CUI data",
                            "Deploy Azure Backup with retention policies aligned to regulatory requirements",
                            "Configure M365 retention policies for email, Teams, and SharePoint containing CUI",
                            "Create retention labels for different CUI categories and retention periods",
                            "Implement legal hold capabilities for litigation or investigation scenarios",
                            "Document retention schedules and disposal procedures"
                        ],
                        verification: ["Review Purview retention policies", "Verify backup retention settings", "Confirm M365 retention labels are applied"],
                        cost_estimate: "$0-200/month (included with E5/G5)",
                        effort_hours: 24
                    }
                },
                gcp: {
                    services: ["Cloud Storage Lifecycle", "BigQuery Data Retention", "Cloud Backup and DR", "Vault (Google Workspace)"],
                    implementation: {
                        steps: [
                            "Configure Cloud Storage lifecycle rules for CUI data retention and deletion",
                            "Implement BigQuery table expiration and partition retention policies",
                            "Deploy Cloud Backup and DR with retention aligned to regulatory requirements",
                            "Configure Google Vault retention rules for Workspace data containing CUI",
                            "Create retention policies mapping CUI types to required retention periods",
                            "Implement automated deletion for data past retention period",
                            "Document retention schedules and legal hold procedures"
                        ],
                        verification: ["Review Storage lifecycle rules", "Verify BigQuery retention settings", "Confirm Vault retention rules"],
                        cost_estimate: "$50-200/month (storage costs)",
                        effort_hours: 24
                    }
                }
            },
            small_business: {
                approach: "Develop data retention policies aligned with DFARS and CMMC requirements, implement automated retention controls where possible.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "Data retention policy template", cost: "Free", purpose: "Document retention requirements" },
                        { name: "Backup solution with retention", cost: "$10-50/month", purpose: "Automated data retention" },
                        { name: "Secure deletion tools", cost: "Free (built-in)", purpose: "Compliant data disposal" }
                    ],
                    steps: [
                        "Develop data retention policy mapping CUI types to retention periods",
                        "Implement DFARS 7012 requirement: retain CUI for 6 years after contract completion",
                        "Configure backup solutions with retention periods matching policy requirements",
                        "Implement secure deletion procedures for data past retention period",
                        "Create legal hold procedures for litigation or investigation scenarios",
                        "Review retention compliance quarterly and document disposal actions"
                    ]
                }
            }
        },

        // ========================================
        // PLANNING (PL) - New Controls
        // ========================================

        "PL.L2-03.15.03": {
            objective: "Establish and make available to individuals requiring access to the system, the rules that describe their responsibilities and expected behavior for information and system usage, security, and privacy.",
            cloud: {
                aws: {
                    services: ["AWS IAM Identity Center", "AWS SSO Login Page", "Amazon WorkDocs"],
                    implementation: {
                        steps: [
                            "Create Rules of Behavior (RoB) document covering CUI handling in AWS environments",
                            "Configure IAM Identity Center to present RoB acknowledgment during first login",
                            "Store current RoB document in WorkDocs or S3 for user access",
                            "Include AWS-specific acceptable use policies (resource creation, data handling, access)",
                            "Require annual re-acknowledgment of RoB for all users",
                            "Maintain signed RoB records with dates and user identities",
                            "Update RoB when AWS services or security policies change"
                        ],
                        verification: ["Verify RoB acknowledgment records", "Confirm RoB is current and accessible", "Review annual re-acknowledgment completion"],
                        cost_estimate: "$0 (documentation effort)",
                        effort_hours: 16
                    }
                },
                azure: {
                    services: ["Entra ID Terms of Use", "Microsoft Intune", "SharePoint"],
                    implementation: {
                        steps: [
                            "Create Rules of Behavior document covering CUI handling in Azure/M365",
                            "Configure Entra ID Terms of Use to require RoB acceptance before access",
                            "Store current RoB in SharePoint for user reference",
                            "Include Azure/M365-specific acceptable use policies",
                            "Configure Conditional Access to enforce RoB acceptance",
                            "Require annual re-acknowledgment through Terms of Use expiration",
                            "Maintain acceptance records with dates and user identities"
                        ],
                        verification: ["Verify Terms of Use acceptance records", "Confirm RoB is current", "Review Conditional Access enforcement"],
                        cost_estimate: "$0 (included with licensing)",
                        effort_hours: 12
                    }
                },
                gcp: {
                    services: ["Cloud Identity", "Google Workspace", "Access Context Manager"],
                    implementation: {
                        steps: [
                            "Create Rules of Behavior document covering CUI handling in GCP",
                            "Configure Cloud Identity login page with RoB acknowledgment requirement",
                            "Store current RoB in Google Drive for user access",
                            "Include GCP-specific acceptable use policies",
                            "Require annual re-acknowledgment for all users",
                            "Maintain signed RoB records with dates and user identities",
                            "Update RoB when GCP services or security policies change"
                        ],
                        verification: ["Verify RoB acknowledgment records", "Confirm RoB is current and accessible", "Review annual re-acknowledgment completion"],
                        cost_estimate: "$0 (documentation effort)",
                        effort_hours: 16
                    }
                }
            },
            small_business: {
                approach: "Develop Rules of Behavior document and require signed acknowledgment from all users before granting system access.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "RoB template", cost: "Free", purpose: "Rules of Behavior document" },
                        { name: "Electronic signature tool", cost: "Free-$15/month", purpose: "Collect signed acknowledgments" },
                        { name: "Tracking spreadsheet", cost: "Free", purpose: "Record acknowledgment status" }
                    ],
                    steps: [
                        "Develop Rules of Behavior covering CUI handling, acceptable use, and security responsibilities",
                        "Include consequences for non-compliance with rules",
                        "Require signed acknowledgment before granting system access",
                        "Require annual re-acknowledgment from all users",
                        "Update RoB when policies, systems, or regulations change",
                        "Maintain records of all acknowledgments with dates and signatures"
                    ]
                }
            }
        },

        // ========================================
        // SYSTEM AND SERVICES ACQUISITION (SA)
        // ========================================

        "SA.L2-03.16.01": {
            objective: "Apply systems security engineering principles in the specification, design, development, implementation, and modification of the system and system components.",
            cloud: {
                aws: {
                    services: ["AWS Well-Architected Tool", "AWS CloudFormation", "AWS Service Catalog", "AWS Config"],
                    implementation: {
                        steps: [
                            "Conduct AWS Well-Architected Reviews using the Security pillar for all CUI workloads",
                            "Implement Infrastructure as Code (CloudFormation/CDK) with security controls built in",
                            "Create Service Catalog portfolios with pre-approved, security-hardened architectures",
                            "Define security architecture patterns for common CUI workload types",
                            "Implement defense-in-depth with VPC segmentation, security groups, and NACLs",
                            "Require security architecture review for all new systems and major changes",
                            "Document security engineering decisions in Architecture Decision Records (ADRs)"
                        ],
                        verification: ["Review Well-Architected assessment results", "Verify IaC templates include security controls", "Confirm architecture review process is followed"],
                        cost_estimate: "$0 (process and documentation)",
                        effort_hours: 40
                    }
                },
                azure: {
                    services: ["Azure Well-Architected Framework", "Azure Blueprints", "ARM Templates", "Defender for Cloud"],
                    implementation: {
                        steps: [
                            "Conduct Azure Well-Architected Reviews for all CUI workloads",
                            "Create Azure Blueprints with security controls for repeatable deployments",
                            "Implement ARM/Bicep templates with security configurations built in",
                            "Define security architecture patterns for common CUI workload types",
                            "Implement defense-in-depth with VNets, NSGs, and Azure Firewall",
                            "Require security architecture review for all new systems and major changes",
                            "Document security engineering decisions in ADRs"
                        ],
                        verification: ["Review Well-Architected assessment results", "Verify Blueprint compliance", "Confirm architecture review process"],
                        cost_estimate: "$0 (process and documentation)",
                        effort_hours: 40
                    }
                },
                gcp: {
                    services: ["Architecture Framework", "Deployment Manager", "Assured Workloads", "Security Command Center"],
                    implementation: {
                        steps: [
                            "Apply GCP Architecture Framework security principles to all CUI workloads",
                            "Implement Deployment Manager or Terraform templates with security controls",
                            "Use Assured Workloads for compliance-aligned project configurations",
                            "Define security architecture patterns for common CUI workload types",
                            "Implement defense-in-depth with VPC, firewall rules, and service perimeters",
                            "Require security architecture review for all new systems and major changes",
                            "Document security engineering decisions in ADRs"
                        ],
                        verification: ["Review architecture framework compliance", "Verify IaC templates include security", "Confirm architecture review process"],
                        cost_estimate: "$0 (process and documentation)",
                        effort_hours: 40
                    }
                }
            },
            small_business: {
                approach: "Apply security-by-design principles using documented architecture patterns, security checklists, and change review processes.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "NIST SP 800-160 Vol 1", cost: "Free", purpose: "Systems security engineering guidance" },
                        { name: "Security architecture checklist", cost: "Free", purpose: "Design review checklist" },
                        { name: "Threat modeling tool (STRIDE)", cost: "Free", purpose: "Identify security threats in design" }
                    ],
                    steps: [
                        "Develop security architecture principles document for the organization",
                        "Create security design checklists for new systems and major changes",
                        "Require threat modeling (STRIDE) for systems processing CUI",
                        "Implement defense-in-depth with network segmentation and access controls",
                        "Document security engineering decisions for all CUI systems",
                        "Review and approve security architecture before implementation"
                    ]
                }
            }
        },

        "SA.L2-03.16.02": {
            objective: "Replace or provide additional protections for system components when support for those components is no longer available from the developer, vendor, or manufacturer.",
            cloud: {
                aws: {
                    services: ["AWS Systems Manager Patch Manager", "AWS Config", "AWS Trusted Advisor", "AWS Health"],
                    implementation: {
                        steps: [
                            "Use AWS Health notifications to track service deprecations and EOL announcements",
                            "Configure Config rules to detect EC2 instances running unsupported OS versions",
                            "Create Systems Manager inventory reports identifying software nearing end-of-support",
                            "Implement Trusted Advisor checks for deprecated or unsupported resource types",
                            "Develop migration plans for workloads on unsupported platforms (minimum 6 months ahead)",
                            "Implement compensating controls (network isolation, enhanced monitoring) for components awaiting migration",
                            "Document all unsupported components in POA&M with remediation timelines"
                        ],
                        verification: ["Review Config rules for unsupported OS detection", "Verify migration plans exist for EOL components", "Confirm compensating controls for unsupported systems"],
                        cost_estimate: "$0-50/month",
                        effort_hours: 20
                    }
                },
                azure: {
                    services: ["Azure Advisor", "Defender for Cloud", "Azure Policy", "Azure Migrate"],
                    implementation: {
                        steps: [
                            "Use Azure Advisor to identify resources using deprecated or unsupported services",
                            "Configure Defender for Cloud to flag VMs running unsupported OS versions",
                            "Implement Azure Policy to prevent deployment of unsupported OS images",
                            "Use Azure Migrate to plan migrations from unsupported platforms",
                            "Develop migration plans minimum 6 months before end-of-support dates",
                            "Implement compensating controls for components awaiting migration",
                            "Document all unsupported components in POA&M"
                        ],
                        verification: ["Review Advisor recommendations for deprecations", "Verify Defender flags unsupported OS", "Confirm migration plans exist"],
                        cost_estimate: "$0-50/month",
                        effort_hours: 20
                    }
                },
                gcp: {
                    services: ["Security Command Center", "Recommender", "Cloud Asset Inventory"],
                    implementation: {
                        steps: [
                            "Use Recommender to identify resources using deprecated APIs or services",
                            "Configure SCC to detect instances running unsupported OS versions",
                            "Monitor GCP deprecation announcements and plan migrations proactively",
                            "Use Cloud Asset Inventory to identify all components nearing end-of-support",
                            "Develop migration plans minimum 6 months before end-of-support",
                            "Implement compensating controls for components awaiting migration",
                            "Document all unsupported components in POA&M"
                        ],
                        verification: ["Review Recommender findings", "Verify SCC detects unsupported OS", "Confirm migration plans exist"],
                        cost_estimate: "$0-50/month",
                        effort_hours: 20
                    }
                }
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Patch Management", "OS Lifecycle Tracking", "Custom Alerts"],
                    implementation: {
                        steps: [
                            "Use NinjaOne to inventory all OS versions and identify unsupported systems",
                            "Create custom alerts for systems running EOL operating systems",
                            "Generate reports showing software nearing end-of-support dates",
                            "Implement automated patching to keep supported systems current",
                            "Create device groups for unsupported systems requiring migration",
                            "Document compensating controls applied to unsupported systems"
                        ],
                        verification: ["Review OS lifecycle reports", "Verify EOL alerts are configured", "Confirm migration tracking"],
                        cost_estimate: "Included with NinjaOne",
                        effort_hours: 12
                    }
                }
            },
            vuln_mgmt: {
                tenable: {
                    services: ["Tenable.io", "Nessus Compliance Scans", "EOL Detection Plugins"],
                    implementation: {
                        steps: [
                            "Enable Tenable EOL detection plugins to identify unsupported software and OS",
                            "Create dashboards showing all systems with unsupported components",
                            "Configure automated scan schedules to detect newly unsupported software",
                            "Generate reports mapping unsupported components to CUI systems",
                            "Track remediation progress for unsupported component replacement",
                            "Document risk acceptance for any unsupported components that cannot be replaced"
                        ],
                        verification: ["Review EOL detection scan results", "Verify dashboard accuracy", "Confirm remediation tracking"],
                        cost_estimate: "Included with Tenable.io",
                        effort_hours: 12
                    }
                }
            },
            small_business: {
                approach: "Track software and hardware end-of-support dates, plan migrations proactively, and implement compensating controls for unsupported components.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "endoflife.date", cost: "Free", purpose: "Track software EOL dates" },
                        { name: "Asset inventory with EOL tracking", cost: "Free", purpose: "Monitor component support status" },
                        { name: "POA&M template", cost: "Free", purpose: "Document unsupported components" }
                    ],
                    steps: [
                        "Add end-of-support dates to asset inventory for all software and hardware",
                        "Monitor vendor announcements for EOL and end-of-support dates",
                        "Create migration plans at least 6 months before end-of-support",
                        "Implement compensating controls for unsupported components: network isolation, enhanced monitoring",
                        "Document unsupported components in POA&M with remediation timelines",
                        "Review component support status quarterly"
                    ]
                }
            }
        },

        "SA.L2-03.16.03": {
            objective: "Employ security controls and oversight for external system services used by the organization, including defining and documenting government, organizational, and user roles and responsibilities.",
            cloud: {
                aws: {
                    services: ["AWS Marketplace", "AWS Config", "AWS Organizations SCPs", "AWS CloudTrail"],
                    implementation: {
                        steps: [
                            "Maintain inventory of all external services (SaaS, IaaS, PaaS) processing CUI",
                            "Verify FedRAMP authorization or equivalent for external cloud services handling CUI",
                            "Implement Organizations SCPs to restrict use of unapproved external services",
                            "Configure Config rules to detect unauthorized external service integrations",
                            "Require security assessments for all new external service providers",
                            "Document roles and responsibilities in service agreements and ISAs",
                            "Monitor CloudTrail for external service API calls and data transfers"
                        ],
                        verification: ["Review external service inventory", "Verify FedRAMP authorization status", "Confirm service agreements are current"],
                        cost_estimate: "$0 (process and documentation)",
                        effort_hours: 32
                    }
                },
                azure: {
                    services: ["Entra ID Enterprise Applications", "Microsoft Cloud App Security", "Azure Policy"],
                    implementation: {
                        steps: [
                            "Inventory all external services via Entra ID Enterprise Applications",
                            "Deploy Cloud App Security (MCAS) to discover and assess shadow IT services",
                            "Verify FedRAMP authorization for external services handling CUI",
                            "Implement Azure Policy to restrict external service integrations",
                            "Require security assessments for all new external service providers",
                            "Document roles and responsibilities in service agreements",
                            "Monitor external service access and data transfers through MCAS"
                        ],
                        verification: ["Review Enterprise Applications inventory", "Verify MCAS discovery results", "Confirm service agreements"],
                        cost_estimate: "$0-100/month",
                        effort_hours: 28
                    }
                },
                gcp: {
                    services: ["Cloud Asset Inventory", "VPC Service Controls", "Organization Policy", "Cloud Audit Logs"],
                    implementation: {
                        steps: [
                            "Inventory all external services integrated with GCP environment",
                            "Verify FedRAMP authorization for external services handling CUI",
                            "Implement Organization Policy constraints to restrict external service usage",
                            "Configure VPC Service Controls to prevent data exfiltration to unauthorized services",
                            "Require security assessments for all new external service providers",
                            "Document roles and responsibilities in service agreements",
                            "Monitor Cloud Audit Logs for external service API calls"
                        ],
                        verification: ["Review external service inventory", "Verify FedRAMP authorization status", "Confirm service agreements"],
                        cost_estimate: "$0 (process and documentation)",
                        effort_hours: 28
                    }
                }
            },
            small_business: {
                approach: "Maintain an inventory of external services, verify their security posture, and document responsibilities in service agreements.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "External service inventory", cost: "Free", purpose: "Track all external services" },
                        { name: "FedRAMP Marketplace", cost: "Free", purpose: "Verify cloud service authorization" },
                        { name: "Service agreement templates", cost: "Free", purpose: "Document responsibilities" }
                    ],
                    steps: [
                        "Create inventory of all external services that process, store, or transmit CUI",
                        "Verify FedRAMP authorization (Moderate baseline minimum) for cloud services handling CUI",
                        "Document security requirements in service agreements and contracts",
                        "Define roles and responsibilities for security oversight of external services",
                        "Conduct annual security reviews of external service providers",
                        "Monitor external service security posture through SOC 2 reports and security advisories"
                    ]
                }
            }
        }

    }
};
