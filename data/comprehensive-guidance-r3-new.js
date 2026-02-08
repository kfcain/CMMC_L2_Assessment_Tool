// Comprehensive Implementation Guidance - Rev 3 New Controls (No Rev 2 Equivalent)
// Covers 14 controls that are brand new in NIST 800-171 Rev 3
// All vendors: AWS, Azure, GCP, Palo Alto, SentinelOne, NinjaOne, Tenable
// Keys use Rev 3 format: FAM.L2-03.XX.YY

const COMPREHENSIVE_GUIDANCE_R3_NEW = {
    version: "1.0.0",
    lastUpdated: "2026-02-08",
    description: "Guidance for 14 new Rev 3 controls with no Rev 2 equivalent",
    objectives: {

        // ========================================
        // CONFIGURATION MANAGEMENT (CM) - New Controls
        // ========================================

        "CM.L2-03.04.10": {
            objective: "Develop and document an inventory of system components that accurately reflects the system, includes all components within the system boundary, and identifies individuals responsible for administering those components.",
            cloud: {
                aws: {
                    services: ["AWS Config", "AWS Systems Manager Inventory", "AWS Resource Groups", "AWS Organizations"],
                    implementation: {
                        steps: [
                            "Enable AWS Config in all regions to discover and record all AWS resources",
                            "Deploy Systems Manager Inventory to collect metadata from EC2 instances",
                            "Create Resource Groups to organize components by CUI boundary and owner",
                            "Tag all resources with mandatory tags: Owner, CUI-Boundary, DataClassification",
                            "Configure Config aggregator for multi-account inventory",
                            "Set up compliance rules to detect untagged or untracked resources",
                            "Schedule monthly inventory reconciliation using Config snapshots"
                        ],
                        verification: ["Review Config resource inventory for completeness", "Verify all resources have required tags", "Confirm SSM Inventory is collecting from all instances"],
                        cost_estimate: "$50-200/month",
                        effort_hours: 24
                    }
                },
                azure: {
                    services: ["Azure Resource Graph", "Defender for Cloud Asset Inventory", "Azure Policy", "Azure Monitor"],
                    implementation: {
                        steps: [
                            "Use Azure Resource Graph to query and catalog all resources across subscriptions",
                            "Enable Defender for Cloud asset inventory for continuous resource discovery",
                            "Implement Azure Policy to enforce mandatory tagging (Owner, CUI-Boundary)",
                            "Create custom Resource Graph queries for inventory reporting",
                            "Configure Azure Monitor workbooks for visual inventory dashboards",
                            "Set up alerts for new resource creation without required tags",
                            "Schedule monthly inventory review and reconciliation"
                        ],
                        verification: ["Verify Resource Graph returns all expected resources", "Confirm tagging policy compliance", "Review Defender asset inventory completeness"],
                        cost_estimate: "$0-100/month",
                        effort_hours: 20
                    }
                },
                gcp: {
                    services: ["Cloud Asset Inventory", "Security Command Center", "Resource Manager", "Cloud Monitoring"],
                    implementation: {
                        steps: [
                            "Enable Cloud Asset Inventory API for organization-wide resource discovery",
                            "Use Security Command Center asset discovery to catalog all GCP resources",
                            "Implement organization-level labels for CUI boundary, owner, and classification",
                            "Create Cloud Asset Inventory feeds for real-time change notifications",
                            "Build BigQuery exports of asset inventory for reporting",
                            "Configure Resource Manager constraints to enforce labeling",
                            "Schedule monthly inventory reconciliation using asset snapshots"
                        ],
                        verification: ["Verify Cloud Asset Inventory captures all resources", "Confirm labeling policy enforcement", "Review SCC asset discovery completeness"],
                        cost_estimate: "$0-50/month",
                        effort_hours: 20
                    }
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity Console", "Ranger Network Discovery", "Device Control"],
                    implementation: {
                        steps: [
                            "Use Singularity Console to generate complete endpoint inventory with OS, apps, and hardware",
                            "Deploy Ranger to discover all network-connected devices including unmanaged endpoints",
                            "Enable Device Control to inventory USB and peripheral devices",
                            "Create scheduled reports for endpoint inventory with agent health status",
                            "Configure Ranger alerts for new or rogue devices on CUI segments",
                            "Export endpoint inventory data via API for CMDB integration"
                        ],
                        verification: ["Verify agent deployment covers all endpoints", "Confirm Ranger discovers all network devices", "Review Device Control inventory"],
                        cost_estimate: "Included with Singularity Complete",
                        effort_hours: 12
                    }
                }
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Device Management", "Network Discovery", "Custom Fields", "Documentation"],
                    implementation: {
                        steps: [
                            "Deploy NinjaOne agent to all managed endpoints for automated inventory",
                            "Enable network discovery to identify all devices on CUI segments",
                            "Configure custom fields for CUI boundary, classification, and responsible party",
                            "Create device groups organized by CUI boundary, location, and function",
                            "Set up automated inventory reports with hardware and software details",
                            "Configure alerts for new devices or agent health issues"
                        ],
                        verification: ["Verify agent deployment on all managed devices", "Confirm custom fields are populated", "Review network discovery results"],
                        cost_estimate: "$3-5/device/month",
                        effort_hours: 16
                    }
                }
            },
            vuln_mgmt: {
                tenable: {
                    services: ["Tenable.io Asset Discovery", "Nessus Network Monitor", "Tenable.io Asset Inventory"],
                    implementation: {
                        steps: [
                            "Configure discovery scans to identify all assets on CUI network segments",
                            "Deploy Nessus Network Monitor for passive asset discovery",
                            "Use Tenable.io asset inventory to track hardware and software attributes",
                            "Tag assets with CUI boundary and owner using Tenable asset tags",
                            "Create asset inventory dashboards showing coverage and gaps",
                            "Schedule weekly discovery scans to detect new or changed assets"
                        ],
                        verification: ["Verify discovery scan coverage", "Confirm passive monitoring detects all device types", "Review asset tag completeness"],
                        cost_estimate: "$30-50/asset/year",
                        effort_hours: 16
                    }
                }
            },
            small_business: {
                approach: "Maintain a comprehensive inventory using spreadsheets or free tools with clear ownership assignments.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "Snipe-IT", cost: "Free (self-hosted)", purpose: "Open-source IT asset management" },
                        { name: "Nmap", cost: "Free", purpose: "Network device discovery" },
                        { name: "Spreadsheet template", cost: "Free", purpose: "Component inventory tracking" }
                    ],
                    steps: [
                        "Create inventory spreadsheet: Name, Type, Location, IP, OS, Owner, CUI Boundary",
                        "Run Nmap scans monthly to discover all network-connected devices",
                        "Reconcile scan results with inventory to identify gaps",
                        "Assign a responsible individual for each component",
                        "Document which components process, store, or transmit CUI",
                        "Review and update inventory quarterly or after system changes"
                    ]
                }
            }
        },

        "CM.L2-03.04.11": {
            objective: "Identify the location of CUI and the system components on which it is processed, stored, or transmitted, and document changes to the location.",
            cloud: {
                aws: {
                    services: ["Amazon Macie", "AWS Config", "AWS CloudTrail", "Amazon S3 Inventory"],
                    implementation: {
                        steps: [
                            "Deploy Amazon Macie to discover and classify CUI in S3 buckets",
                            "Use Config rules to track resources tagged as CUI-processing",
                            "Enable CloudTrail data events to log CUI data access and movement",
                            "Configure S3 Inventory reports to document CUI storage locations",
                            "Create Config custom rules to detect CUI in unauthorized regions",
                            "Set up SNS notifications for changes to CUI resource locations",
                            "Document CUI data flow maps showing processing, storage, and transmission paths"
                        ],
                        verification: ["Review Macie findings for CUI classification accuracy", "Verify Config tracks all CUI-tagged resources", "Confirm CloudTrail logs CUI data movement"],
                        cost_estimate: "$100-500/month",
                        effort_hours: 32
                    }
                },
                azure: {
                    services: ["Microsoft Purview Data Map", "Azure Information Protection", "Defender for Cloud"],
                    implementation: {
                        steps: [
                            "Deploy Microsoft Purview to discover and classify CUI across Azure services",
                            "Configure Azure Information Protection labels for CUI sensitivity",
                            "Use Purview Data Map to visualize CUI locations across storage and databases",
                            "Implement Azure Policy to restrict CUI storage to approved regions",
                            "Enable Purview audit logging to track CUI data movement",
                            "Set up alerts for CUI data detected in unauthorized locations",
                            "Document CUI data flow diagrams for all processing and storage points"
                        ],
                        verification: ["Verify Purview data map accuracy", "Confirm AIP labels applied to CUI", "Review CUI location change audit logs"],
                        cost_estimate: "$200-800/month",
                        effort_hours: 40
                    }
                },
                gcp: {
                    services: ["Cloud DLP", "Data Catalog", "Security Command Center", "Cloud Audit Logs"],
                    implementation: {
                        steps: [
                            "Deploy Cloud DLP to scan and classify CUI in Storage, BigQuery, and Datastore",
                            "Use Data Catalog to tag and document CUI data locations",
                            "Configure SCC to monitor for CUI in unauthorized locations",
                            "Enable Cloud Audit Logs to track CUI data access and movement",
                            "Create Data Catalog entry groups organized by CUI classification",
                            "Implement organization policies to restrict CUI to approved regions",
                            "Document CUI data flow maps with processing and transmission paths"
                        ],
                        verification: ["Verify DLP scan coverage and accuracy", "Confirm Data Catalog entries are current", "Review audit logs for CUI movement"],
                        cost_estimate: "$100-400/month",
                        effort_hours: 32
                    }
                }
            },
            small_business: {
                approach: "Document CUI locations using data flow diagrams and maintain a CUI registry tracking where CUI is processed, stored, and transmitted.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "CUI Data Flow Diagram", cost: "Free (Draw.io)", purpose: "Visual mapping of CUI locations" },
                        { name: "CUI Registry Spreadsheet", cost: "Free", purpose: "Track CUI locations" },
                        { name: "File server search tools", cost: "Free (built-in)", purpose: "Locate CUI on file systems" }
                    ],
                    steps: [
                        "Create a CUI registry listing all systems and storage locations containing CUI",
                        "Document data flow diagrams showing how CUI moves between systems",
                        "Identify all endpoints, servers, and cloud services that process CUI",
                        "Implement change management requiring CUI location updates on system changes",
                        "Conduct quarterly reviews to verify CUI location documentation accuracy",
                        "Train staff to report CUI stored in new or unauthorized locations"
                    ]
                }
            }
        },

        "CM.L2-03.04.12": {
            objective: "Control and monitor the use of system components when traveling to high-risk locations, and apply additional security measures as needed.",
            cloud: {
                aws: {
                    services: ["AWS IAM Identity Center", "CloudTrail", "AWS WAF"],
                    implementation: {
                        steps: [
                            "Configure IAM Identity Center with location-based conditional access policies",
                            "Create CloudTrail alerts for API calls from high-risk geographic regions",
                            "Implement AWS WAF geographic restrictions on CUI web applications",
                            "Create IAM policies restricting CUI access during travel periods",
                            "Document procedures for temporary access exceptions during authorized travel",
                            "Configure VPN-only access requirements from high-risk locations"
                        ],
                        verification: ["Verify geo-restriction policies are active", "Confirm CloudTrail alerts trigger for high-risk regions", "Review travel access exception logs"],
                        cost_estimate: "$50-150/month",
                        effort_hours: 20
                    }
                },
                azure: {
                    services: ["Entra ID Conditional Access", "Microsoft Intune", "Defender for Endpoint"],
                    implementation: {
                        steps: [
                            "Configure Entra ID Named Locations to define high-risk geographic regions",
                            "Create Conditional Access policies blocking or requiring MFA from high-risk locations",
                            "Deploy Intune compliance policies restricting CUI access on travel devices",
                            "Enable Defender for Endpoint travel risk detection",
                            "Implement device wipe capabilities for lost devices during travel",
                            "Create travel request workflow requiring security review before CUI device travel"
                        ],
                        verification: ["Verify Conditional Access blocks high-risk locations", "Confirm Intune enforces travel restrictions", "Review travel request approvals"],
                        cost_estimate: "$0-50/month (included with E5/G5)",
                        effort_hours: 16
                    }
                },
                gcp: {
                    services: ["BeyondCorp Enterprise", "Access Context Manager", "VPC Service Controls"],
                    implementation: {
                        steps: [
                            "Configure Access Context Manager with geographic access levels for high-risk regions",
                            "Implement BeyondCorp policies restricting CUI access from high-risk locations",
                            "Create VPC Service Controls perimeters with geographic restrictions",
                            "Configure device trust policies requiring managed devices during travel",
                            "Document travel authorization procedures and security requirements",
                            "Implement logging and alerting for access from high-risk regions"
                        ],
                        verification: ["Verify Access Context Manager geo-restrictions", "Confirm BeyondCorp policies enforce travel controls", "Review access logs from high-risk regions"],
                        cost_estimate: "$6/user/month",
                        effort_hours: 20
                    }
                }
            },
            small_business: {
                approach: "Establish travel security policies with pre-travel and post-travel checklists for CUI devices.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "Full-disk encryption (BitLocker/FileVault)", cost: "Free (built-in)", purpose: "Protect data on travel devices" },
                        { name: "VPN client", cost: "$5-10/user/month", purpose: "Secure connections while traveling" },
                        { name: "Travel security checklist", cost: "Free", purpose: "Pre/post-travel procedures" }
                    ],
                    steps: [
                        "Develop travel security policy defining high-risk locations and required controls",
                        "Require full-disk encryption on all devices that may travel with CUI",
                        "Issue loaner devices with minimal CUI for travel to high-risk locations",
                        "Require VPN for all CUI system access while traveling",
                        "Pre-travel: encrypt, backup, remove unnecessary CUI, update patches",
                        "Post-travel: scan for malware, check for tampering, change passwords"
                    ]
                }
            }
        },

        // ========================================
        // IDENTIFICATION AND AUTHENTICATION (IA)
        // ========================================

        "IA.L2-03.05.12": {
            objective: "Manage system authenticators by verifying identity before initial distribution, establishing initial content, and ensuring authenticators have sufficient strength for their intended use.",
            cloud: {
                aws: {
                    services: ["AWS IAM", "AWS Secrets Manager", "AWS Certificate Manager", "AWS KMS"],
                    implementation: {
                        steps: [
                            "Implement IAM password policies enforcing minimum 14 characters and complexity",
                            "Use Secrets Manager for automated rotation of service credentials and API keys",
                            "Deploy Certificate Manager for TLS certificate lifecycle management",
                            "Configure IAM Identity Center with MFA enforcement for all users",
                            "Use KMS for cryptographic key management with automated rotation",
                            "Implement identity verification procedures before issuing credentials",
                            "Create IAM policies requiring credential rotation on first use"
                        ],
                        verification: ["Verify IAM password policy meets requirements", "Confirm Secrets Manager rotation schedules", "Review certificate expiration monitoring"],
                        cost_estimate: "$50-200/month",
                        effort_hours: 24
                    }
                },
                azure: {
                    services: ["Entra ID", "Azure Key Vault", "Microsoft Authenticator", "Entra ID Protection"],
                    implementation: {
                        steps: [
                            "Configure Entra ID password policies with minimum 14 characters and complexity",
                            "Deploy Azure Key Vault for centralized secret, key, and certificate management",
                            "Enforce Microsoft Authenticator or FIDO2 security keys for all accounts",
                            "Implement Entra ID Protection to detect compromised credentials",
                            "Configure self-service password reset with identity verification",
                            "Create Conditional Access policies requiring strong authentication",
                            "Set up automated certificate rotation using Key Vault"
                        ],
                        verification: ["Verify password policies meet requirements", "Confirm Key Vault rotation schedules", "Review Entra ID Protection risk detections"],
                        cost_estimate: "$0-100/month (included with E5/G5)",
                        effort_hours: 20
                    }
                },
                gcp: {
                    services: ["Cloud Identity", "Secret Manager", "Certificate Authority Service", "Cloud KMS"],
                    implementation: {
                        steps: [
                            "Configure Cloud Identity password policies with minimum length and complexity",
                            "Deploy Secret Manager for automated rotation of service account keys",
                            "Use Certificate Authority Service for internal PKI management",
                            "Enforce 2-Step Verification with hardware security keys",
                            "Implement Cloud KMS for key management with rotation schedules",
                            "Create organizational policies requiring identity verification for credential issuance",
                            "Configure audit logging for all authentication events"
                        ],
                        verification: ["Verify password policies are enforced", "Confirm Secret Manager rotation is active", "Review authentication audit logs"],
                        cost_estimate: "$50-200/month",
                        effort_hours: 24
                    }
                }
            },
            small_business: {
                approach: "Implement strong authenticator management using password managers, MFA, and documented credential issuance procedures.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "Password manager (Bitwarden/1Password)", cost: "$3-8/user/month", purpose: "Centralized credential management" },
                        { name: "MFA app (Authenticator)", cost: "Free", purpose: "Multi-factor authentication" },
                        { name: "FIDO2 security keys", cost: "$25-50 each", purpose: "Phishing-resistant authentication" }
                    ],
                    steps: [
                        "Deploy enterprise password manager with enforced master password requirements",
                        "Require MFA for all accounts accessing CUI systems",
                        "Establish identity verification procedures before issuing credentials",
                        "Require password changes on first login for all new accounts",
                        "Implement minimum 14-character passwords with complexity",
                        "Document procedures for credential revocation upon personnel changes"
                    ]
                }
            }
        },

        // ========================================
        // INCIDENT RESPONSE (IR) - New Controls
        // ========================================

        "IR.L2-03.06.04": {
            objective: "Provide incident response training to system users consistent with assigned roles and responsibilities within a defined time period and at a defined frequency thereafter.",
            cloud: {
                aws: {
                    services: ["AWS Incident Manager", "AWS Security Hub", "Amazon GuardDuty"],
                    implementation: {
                        steps: [
                            "Create incident response runbooks in AWS Incident Manager for training exercises",
                            "Conduct tabletop exercises using real Security Hub and GuardDuty findings",
                            "Train IR team members on AWS-specific incident investigation procedures",
                            "Document role-based training requirements for IR team, admins, and general users",
                            "Schedule annual IR training with quarterly refreshers for IR team members",
                            "Maintain training completion records with dates and topics covered"
                        ],
                        verification: ["Review training completion records", "Verify tabletop exercise documentation", "Confirm role-based training assignments"],
                        cost_estimate: "$0-50/month",
                        effort_hours: 40
                    }
                },
                azure: {
                    services: ["Microsoft Sentinel", "Defender for Cloud", "Microsoft Learn"],
                    implementation: {
                        steps: [
                            "Use Microsoft Sentinel playbooks as training scenarios for IR exercises",
                            "Conduct tabletop exercises using Defender for Cloud security alerts",
                            "Assign Microsoft Learn IR training paths to all IR team members",
                            "Train staff on Azure-specific incident investigation and containment",
                            "Schedule annual IR training with quarterly refreshers",
                            "Maintain training records with completion dates and assessment scores"
                        ],
                        verification: ["Verify training path completion", "Review tabletop exercise reports", "Confirm training frequency compliance"],
                        cost_estimate: "$0 (included with licensing)",
                        effort_hours: 40
                    }
                },
                gcp: {
                    services: ["Security Command Center", "Google SecOps SIEM", "Cloud Logging"],
                    implementation: {
                        steps: [
                            "Create IR training scenarios using Security Command Center findings",
                            "Conduct tabletop exercises with Google SecOps SIEM investigation workflows",
                            "Train IR team on GCP-specific log analysis and incident containment",
                            "Document role-based training requirements and schedules",
                            "Schedule annual IR training with quarterly refreshers for IR team",
                            "Maintain training completion records and assessment results"
                        ],
                        verification: ["Review training completion records", "Verify exercise documentation", "Confirm training schedule compliance"],
                        cost_estimate: "$0 (documentation effort)",
                        effort_hours: 40
                    }
                }
            },
            small_business: {
                approach: "Conduct annual incident response training using tabletop exercises and document completion for all personnel with IR responsibilities.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "CISA tabletop exercise packages", cost: "Free", purpose: "IR training scenarios" },
                        { name: "Training tracking spreadsheet", cost: "Free", purpose: "Record training completion" },
                        { name: "IR procedure documentation", cost: "Free", purpose: "Reference material for training" }
                    ],
                    steps: [
                        "Define IR roles and responsibilities for all personnel",
                        "Develop role-based IR training curriculum (general users vs IR team)",
                        "Conduct annual tabletop exercises using CISA scenarios",
                        "Train new IR team members within 30 days of role assignment",
                        "Document all training activities with dates, attendees, and topics",
                        "Update training materials when IR procedures or systems change"
                    ]
                }
            }
        },

        "IR.L2-03.06.05": {
            objective: "Develop, document, and maintain an incident response plan that provides the organization with a roadmap for implementing its incident response capability.",
            cloud: {
                aws: {
                    services: ["AWS Incident Manager", "AWS Security Hub", "Amazon EventBridge", "AWS SNS"],
                    implementation: {
                        steps: [
                            "Create incident response plans in AWS Incident Manager with escalation paths",
                            "Define response plans for common AWS incident types (compromised credentials, data exposure, etc.)",
                            "Configure EventBridge rules to automatically trigger incident response workflows",
                            "Set up SNS topics for IR team notifications and escalation",
                            "Document AWS-specific containment procedures (IAM key rotation, SG lockdown, instance isolation)",
                            "Schedule annual IR plan review and update cycle",
                            "Test IR plan through tabletop and functional exercises"
                        ],
                        verification: ["Review IR plan completeness", "Verify Incident Manager runbooks are current", "Confirm notification chains work"],
                        cost_estimate: "$0-50/month",
                        effort_hours: 60
                    }
                },
                azure: {
                    services: ["Microsoft Sentinel", "Defender for Cloud", "Azure Logic Apps", "Microsoft Teams"],
                    implementation: {
                        steps: [
                            "Develop IR plan documenting Azure-specific incident types and response procedures",
                            "Create Sentinel playbooks automating initial response actions",
                            "Configure Defender for Cloud workflow automation for common incident types",
                            "Set up Teams channels for IR communication and coordination",
                            "Document Azure containment procedures (account disable, NSG lockdown, VM isolation)",
                            "Schedule annual IR plan review and update cycle",
                            "Test IR plan through tabletop and functional exercises"
                        ],
                        verification: ["Review IR plan completeness", "Verify Sentinel playbooks are tested", "Confirm communication channels work"],
                        cost_estimate: "$0 (documentation effort)",
                        effort_hours: 60
                    }
                },
                gcp: {
                    services: ["Security Command Center", "Google SecOps SOAR", "Cloud Functions", "Pub/Sub"],
                    implementation: {
                        steps: [
                            "Develop IR plan documenting GCP-specific incident types and response procedures",
                            "Create Google SecOps SOAR playbooks for automated response actions",
                            "Configure Cloud Functions for automated containment (disable SA keys, update firewall rules)",
                            "Set up Pub/Sub topics for IR team notifications",
                            "Document GCP containment procedures (project isolation, IAM revocation)",
                            "Schedule annual IR plan review and update cycle",
                            "Test IR plan through tabletop and functional exercises"
                        ],
                        verification: ["Review IR plan completeness", "Verify SOAR playbooks are tested", "Confirm notification chains work"],
                        cost_estimate: "$0 (documentation effort)",
                        effort_hours: 60
                    }
                }
            },
            small_business: {
                approach: "Develop a documented incident response plan covering detection, analysis, containment, eradication, recovery, and lessons learned.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "NIST SP 800-61 Rev 2", cost: "Free", purpose: "IR plan framework and guidance" },
                        { name: "IR plan template", cost: "Free (CISA)", purpose: "Structured IR plan document" },
                        { name: "Communication plan template", cost: "Free", purpose: "Notification and escalation procedures" }
                    ],
                    steps: [
                        "Develop IR plan using NIST 800-61 framework covering all phases",
                        "Define incident categories, severity levels, and escalation criteria",
                        "Document roles, responsibilities, and contact information for IR team",
                        "Include DFARS 7012 72-hour reporting requirements for cyber incidents",
                        "Define evidence preservation and chain-of-custody procedures",
                        "Schedule annual IR plan review and update",
                        "Test the plan annually through tabletop exercises"
                    ]
                }
            }
        }

    }
};
