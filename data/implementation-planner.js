// Implementation Planner - CMMC Compliance Project Guide
// A comprehensive, phased approach to implementing CMMC controls

const IMPLEMENTATION_PLANNER = {
    version: "1.0.0",
    title: "CMMC Implementation Planner",
    description: "A structured, phased approach to achieving CMMC Level 2 compliance with trackable milestones and technical implementation guidance.",
    
    // Project Phases
    phases: [
        {
            id: "phase-1",
            name: "Foundation & Assessment",
            description: "Establish baseline, scope CUI, and assess current state",
            duration: "4-6 weeks",
            icon: "foundation",
            color: "#61afef",
            milestones: [
                {
                    id: "m1-1",
                    name: "CUI Scoping Complete",
                    description: "Identify all systems, data flows, and personnel that handle CUI",
                    tasks: [
                        {
                            id: "t1-1-1",
                            name: "Identify CUI data types and sources",
                            description: "Review contracts, DD Form 254s, and markings to identify CUI categories",
                            controls: ["3.1.3", "3.8.1"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Review all DoD contracts for CUI requirements",
                                    "Identify CDI (Covered Defense Information) in scope",
                                    "Document CUI categories (CTI, ITAR, Export Controlled, etc.)",
                                    "Create CUI data inventory spreadsheet"
                                ],
                                artifacts: ["CUI Inventory", "Data Classification Guide", "Contract Review Summary"]
                            }
                        },
                        {
                            id: "t1-1-2",
                            name: "Map CUI data flows",
                            description: "Document how CUI enters, moves through, and exits your environment",
                            controls: ["3.1.3", "3.13.1"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Interview stakeholders handling CUI",
                                    "Document ingress points (email, file transfer, portals)",
                                    "Map internal storage and processing systems",
                                    "Identify egress points (deliverables, sharing)",
                                    "Create data flow diagrams"
                                ],
                                artifacts: ["Data Flow Diagram", "System Interconnection Matrix"]
                            }
                        },
                        {
                            id: "t1-1-3",
                            name: "Define system boundary",
                            description: "Establish the authorization boundary for CMMC assessment",
                            controls: ["3.12.4", "3.13.1"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "List all systems processing, storing, or transmitting CUI",
                                    "Define network segments in scope",
                                    "Identify cloud services and FedRAMP authorization status",
                                    "Document boundary decisions and justifications"
                                ],
                                artifacts: ["System Boundary Diagram", "Asset Inventory", "Cloud Service Inventory"]
                            }
                        }
                    ]
                },
                {
                    id: "m1-2",
                    name: "Gap Assessment Complete",
                    description: "Assess current state against all 110 CMMC Level 2 controls",
                    tasks: [
                        {
                            id: "t1-2-1",
                            name: "Conduct self-assessment",
                            description: "Evaluate each of the 320 assessment objectives",
                            controls: ["3.12.1"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Use this tool to assess each objective",
                                    "Gather evidence for MET objectives",
                                    "Document gaps for NOT MET objectives",
                                    "Identify partial implementations"
                                ],
                                artifacts: ["Self-Assessment Results", "Evidence Package", "Gap Analysis Report"]
                            }
                        },
                        {
                            id: "t1-2-2",
                            name: "Calculate SPRS score",
                            description: "Determine your Supplier Performance Risk System score",
                            controls: ["3.12.1", "3.12.2"],
                            priority: "critical",
                            effort: "low",
                            guidance: {
                                steps: [
                                    "Use the SPRS calculator in this tool",
                                    "Review POA&M items and timelines",
                                    "Document score and submit to SPRS",
                                    "Plan remediation based on gaps"
                                ],
                                artifacts: ["SPRS Score Documentation", "POA&M"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-2",
            name: "Identity & Access",
            description: "Implement identity management, authentication, and access controls",
            duration: "6-8 weeks",
            icon: "identity",
            color: "#c678dd",
            milestones: [
                {
                    id: "m2-1",
                    name: "Identity Provider Configured",
                    description: "Centralized identity management with MFA",
                    tasks: [
                        {
                            id: "t2-1-1",
                            name: "Deploy identity provider",
                            description: "Implement centralized IdP (Entra ID, Okta, etc.)",
                            controls: ["3.5.1", "3.5.2"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Select identity provider (Entra ID recommended for M365)",
                                    "Configure tenant and domain",
                                    "Sync on-prem AD if applicable (Entra Connect)",
                                    "Configure password policies"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Microsoft Entra ID",
                                        steps: ["Create Entra ID tenant", "Configure custom domain", "Enable Security Defaults or Conditional Access"],
                                        docs: "https://learn.microsoft.com/en-us/entra/identity/"
                                    },
                                    aws: {
                                        name: "AWS IAM Identity Center",
                                        steps: ["Enable IAM Identity Center", "Configure identity source", "Create permission sets"],
                                        docs: "https://docs.aws.amazon.com/singlesignon/"
                                    },
                                    onprem: {
                                        name: "Active Directory",
                                        steps: ["Deploy domain controllers", "Configure sites and replication", "Implement tiered admin model"],
                                        docs: "https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/"
                                    }
                                },
                                artifacts: ["IdP Configuration Documentation", "Domain Verification Records"]
                            }
                        },
                        {
                            id: "t2-1-2",
                            name: "Enable MFA for all users",
                            description: "Require multi-factor authentication for all access",
                            controls: ["3.5.3"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Choose MFA methods (authenticator app preferred)",
                                    "Create rollout plan by user group",
                                    "Configure MFA registration campaign",
                                    "Enable MFA enforcement via Conditional Access or equivalent",
                                    "Document exceptions and compensating controls"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Entra ID MFA",
                                        config: [
                                            { setting: "Conditional Access Policy", value: "Require MFA for all users", location: "Entra ID > Protection > Conditional Access" },
                                            { setting: "Authentication Methods", value: "Microsoft Authenticator, FIDO2", location: "Entra ID > Protection > Authentication Methods" },
                                            { setting: "Registration Campaign", value: "Enabled", location: "Entra ID > Protection > Authentication Methods > Registration Campaign" }
                                        ]
                                    },
                                    onprem: {
                                        name: "Azure MFA with NPS Extension or Duo",
                                        config: [
                                            { setting: "NPS Extension", value: "Install on RADIUS server", location: "NPS Server" },
                                            { setting: "VPN/RDP Integration", value: "Point to NPS for RADIUS auth", location: "VPN Gateway / RD Gateway" }
                                        ]
                                    }
                                },
                                artifacts: ["MFA Policy Documentation", "User Enrollment Report", "Exception List"]
                            }
                        },
                        {
                            id: "t2-1-3",
                            name: "Implement Conditional Access",
                            description: "Context-aware access policies based on risk",
                            controls: ["3.1.1", "3.1.2", "3.1.12"],
                            priority: "high",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Define access scenarios (location, device, risk)",
                                    "Create baseline policies for all users",
                                    "Create stricter policies for CUI access",
                                    "Test in report-only mode before enforcement"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Entra Conditional Access",
                                        policies: [
                                            { name: "Require MFA for all users", conditions: "All users, All cloud apps", controls: "Require MFA" },
                                            { name: "Block legacy authentication", conditions: "All users, All cloud apps, Legacy auth clients", controls: "Block access" },
                                            { name: "Require compliant device for CUI apps", conditions: "CUI app group, All locations", controls: "Require compliant device" },
                                            { name: "Block risky sign-ins", conditions: "All users, High risk sign-in", controls: "Block access" }
                                        ]
                                    }
                                },
                                artifacts: ["Conditional Access Policy Matrix", "Policy Screenshots"]
                            }
                        }
                    ]
                },
                {
                    id: "m2-2",
                    name: "Privileged Access Management",
                    description: "Secure administrative access with PAM controls",
                    tasks: [
                        {
                            id: "t2-2-1",
                            name: "Implement least privilege",
                            description: "Role-based access with minimum necessary permissions",
                            controls: ["3.1.5", "3.1.6", "3.1.7"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Inventory current admin accounts and permissions",
                                    "Define role-based access model",
                                    "Remove standing admin rights",
                                    "Implement just-in-time access where possible",
                                    "Separate admin accounts from daily-use accounts"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Entra PIM",
                                        config: [
                                            { setting: "Eligible Assignments", value: "Convert permanent to eligible", location: "Entra ID > Identity Governance > PIM" },
                                            { setting: "Activation Requirements", value: "Require justification + MFA", location: "PIM > Role Settings" },
                                            { setting: "Access Reviews", value: "Quarterly for privileged roles", location: "Entra ID > Identity Governance > Access Reviews" }
                                        ]
                                    },
                                    onprem: {
                                        name: "Tiered Administration",
                                        config: [
                                            { setting: "Tier 0", value: "Domain Controllers, PKI, Entra Connect", location: "Dedicated admin workstations only" },
                                            { setting: "Tier 1", value: "Member servers", location: "Separate admin accounts" },
                                            { setting: "Tier 2", value: "Workstations", location: "Helpdesk accounts" }
                                        ]
                                    }
                                },
                                artifacts: ["RBAC Matrix", "Admin Account Inventory", "PIM Configuration"]
                            }
                        },
                        {
                            id: "t2-2-2",
                            name: "Deploy privileged access workstations",
                            description: "Secured workstations for administrative tasks",
                            controls: ["3.1.5", "3.1.12", "3.4.6"],
                            priority: "high",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Define PAW hardware requirements",
                                    "Create hardened Windows image (STIG baseline)",
                                    "Restrict network access to admin ports only",
                                    "Implement application allowlisting",
                                    "Deploy to Tier 0/1 admins"
                                ],
                                artifacts: ["PAW Build Documentation", "Hardening Checklist", "Network ACLs"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-3",
            name: "Endpoint Security",
            description: "Secure endpoints with hardening, EDR, and management",
            duration: "4-6 weeks",
            icon: "endpoint",
            color: "#98c379",
            milestones: [
                {
                    id: "m3-1",
                    name: "Endpoint Hardening Complete",
                    description: "Apply security baselines to all endpoints",
                    tasks: [
                        {
                            id: "t3-1-1",
                            name: "Deploy security baselines",
                            description: "Apply STIG or CIS benchmarks to all systems",
                            controls: ["3.4.1", "3.4.2"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Download applicable STIG or CIS benchmark",
                                    "Create GPO or Intune profile from benchmark",
                                    "Test on pilot group",
                                    "Deploy to production with monitoring",
                                    "Document deviations with justification"
                                ],
                                platforms: {
                                    windows: {
                                        name: "Windows 11 Hardening",
                                        config: [
                                            { setting: "STIG Baseline", gpo: "Import DISA STIG GPO", registry: "Multiple settings" },
                                            { setting: "BitLocker", gpo: "Computer Config > Admin Templates > Windows Components > BitLocker", registry: "HKLM\\SOFTWARE\\Policies\\Microsoft\\FVE" },
                                            { setting: "Windows Firewall", gpo: "Computer Config > Windows Settings > Security Settings > Windows Firewall", registry: "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsFirewall" },
                                            { setting: "Credential Guard", gpo: "Computer Config > Admin Templates > System > Device Guard", registry: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard" }
                                        ]
                                    },
                                    intune: {
                                        name: "Intune Security Baselines",
                                        config: [
                                            { setting: "Windows Security Baseline", location: "Intune > Endpoint Security > Security Baselines" },
                                            { setting: "Microsoft Defender Baseline", location: "Intune > Endpoint Security > Security Baselines" },
                                            { setting: "Attack Surface Reduction", location: "Intune > Endpoint Security > Attack Surface Reduction" }
                                        ]
                                    }
                                },
                                artifacts: ["Baseline Configuration Report", "STIG Checklist", "Deviation Documentation"]
                            }
                        },
                        {
                            id: "t3-1-2",
                            name: "Enable full disk encryption",
                            description: "Encrypt all endpoint storage with BitLocker or equivalent",
                            controls: ["3.13.16"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Verify TPM availability on all devices",
                                    "Configure BitLocker policy via GPO or Intune",
                                    "Enable recovery key escrow to AD or Entra ID",
                                    "Deploy to pilot, then production",
                                    "Verify encryption status reporting"
                                ],
                                platforms: {
                                    windows: {
                                        name: "BitLocker",
                                        config: [
                                            { setting: "Require BitLocker", gpo: "Computer Config > Admin Templates > Windows Components > BitLocker > Operating System Drives > Require additional authentication at startup", value: "Enabled with TPM" },
                                            { setting: "Recovery Key Backup", gpo: "Computer Config > Admin Templates > Windows Components > BitLocker > Operating System Drives > Choose how BitLocker-protected drives can be recovered", value: "Save to AD DS" },
                                            { setting: "Encryption Method", gpo: "Computer Config > Admin Templates > Windows Components > BitLocker > Choose drive encryption method", value: "XTS-AES 256-bit" }
                                        ]
                                    }
                                },
                                artifacts: ["Encryption Status Report", "Recovery Key Escrow Verification"]
                            }
                        },
                        {
                            id: "t3-1-3",
                            name: "Implement application control",
                            description: "Restrict execution to approved applications",
                            controls: ["3.4.8", "3.14.2"],
                            priority: "high",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Inventory approved applications",
                                    "Choose AppLocker or WDAC",
                                    "Create initial allow policy",
                                    "Deploy in audit mode first",
                                    "Review blocked applications",
                                    "Switch to enforce mode"
                                ],
                                platforms: {
                                    windows: {
                                        name: "Windows Defender Application Control",
                                        config: [
                                            { setting: "Base Policy", value: "Microsoft recommended block rules", location: "Group Policy or Intune" },
                                            { setting: "Supplemental Policies", value: "Organization-specific allows", location: "WDAC Wizard" },
                                            { setting: "Audit Mode", value: "Start in audit, then enforce", location: "Policy Enforcement Mode" }
                                        ]
                                    }
                                },
                                artifacts: ["Application Inventory", "WDAC Policy Files", "Audit Logs"]
                            }
                        }
                    ]
                },
                {
                    id: "m3-2",
                    name: "EDR Deployed",
                    description: "Endpoint detection and response on all systems",
                    tasks: [
                        {
                            id: "t3-2-1",
                            name: "Deploy EDR solution",
                            description: "Install and configure endpoint detection and response",
                            controls: ["3.14.2", "3.14.6", "3.14.7"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Select EDR solution (Defender for Endpoint, CrowdStrike, SentinelOne)",
                                    "Configure tenant and policies",
                                    "Deploy agent to all endpoints",
                                    "Configure alert thresholds",
                                    "Integrate with SIEM"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Microsoft Defender for Endpoint",
                                        config: [
                                            { setting: "Onboarding", value: "Via Intune, GPO, or script", location: "Security.microsoft.com > Settings > Endpoints > Onboarding" },
                                            { setting: "ASR Rules", value: "Enable all in block mode", location: "Intune > Endpoint Security > ASR" },
                                            { setting: "Automated Investigation", value: "Full remediation", location: "Security.microsoft.com > Settings > Endpoints > Advanced Features" }
                                        ]
                                    }
                                },
                                artifacts: ["EDR Deployment Status", "Detection Policy Configuration", "SIEM Integration"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-4",
            name: "Network & Infrastructure",
            description: "Segment networks, secure communications, and harden infrastructure",
            duration: "6-8 weeks",
            icon: "network",
            color: "#e5c07b",
            milestones: [
                {
                    id: "m4-1",
                    name: "Network Segmentation Complete",
                    description: "Isolate CUI systems from general network",
                    tasks: [
                        {
                            id: "t4-1-1",
                            name: "Implement CUI network segment",
                            description: "Create dedicated VLAN or subnet for CUI processing",
                            controls: ["3.13.1", "3.13.5", "3.13.6"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Design network segmentation architecture",
                                    "Create CUI VLAN/subnet",
                                    "Configure firewall rules (deny by default)",
                                    "Implement micro-segmentation if using SDN",
                                    "Document allowed traffic flows"
                                ],
                                platforms: {
                                    onprem: {
                                        name: "Traditional Network",
                                        config: [
                                            { setting: "CUI VLAN", value: "Dedicated VLAN (e.g., VLAN 100)", location: "Switch configuration" },
                                            { setting: "Firewall Rules", value: "Deny all, allow specific", location: "Perimeter and internal firewalls" },
                                            { setting: "ACLs", value: "Restrict inter-VLAN routing", location: "Layer 3 switch or router" }
                                        ]
                                    },
                                    azure: {
                                        name: "Azure Virtual Network",
                                        config: [
                                            { setting: "CUI Subnet", value: "Dedicated subnet with NSG", location: "Virtual Network > Subnets" },
                                            { setting: "NSG Rules", value: "Deny all inbound, allow specific", location: "Network Security Groups" },
                                            { setting: "Azure Firewall", value: "Central egress filtering", location: "Azure Firewall or NVA" }
                                        ]
                                    }
                                },
                                artifacts: ["Network Diagram", "Firewall Rule Matrix", "NSG/ACL Documentation"]
                            }
                        },
                        {
                            id: "t4-1-2",
                            name: "Implement boundary protection",
                            description: "Secure network perimeter with managed access points",
                            controls: ["3.13.1", "3.1.14"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Deploy next-gen firewall at perimeter",
                                    "Enable IDS/IPS functionality",
                                    "Configure web filtering",
                                    "Implement DNS security",
                                    "Route all remote access through managed points"
                                ],
                                artifacts: ["Firewall Configuration", "IDS/IPS Rules", "Web Filter Policy"]
                            }
                        }
                    ]
                },
                {
                    id: "m4-2",
                    name: "Encryption in Transit",
                    description: "Encrypt all CUI data in transit",
                    tasks: [
                        {
                            id: "t4-2-1",
                            name: "Enforce TLS 1.2+ everywhere",
                            description: "Disable legacy protocols and require strong encryption",
                            controls: ["3.13.8", "3.13.11"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Audit current TLS usage",
                                    "Disable TLS 1.0/1.1 and SSL",
                                    "Configure strong cipher suites",
                                    "Update certificates to use strong algorithms",
                                    "Test application compatibility"
                                ],
                                platforms: {
                                    windows: {
                                        name: "Windows TLS Hardening",
                                        registry: [
                                            { key: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.0\\Server", value: "Enabled", data: "0 (DWORD)" },
                                            { key: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.1\\Server", value: "Enabled", data: "0 (DWORD)" },
                                            { key: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.2\\Server", value: "Enabled", data: "1 (DWORD)" },
                                            { key: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.2\\Server", value: "DisabledByDefault", data: "0 (DWORD)" }
                                        ]
                                    }
                                },
                                artifacts: ["TLS Audit Report", "Protocol Configuration", "Certificate Inventory"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-5",
            name: "Data Protection",
            description: "Protect CUI at rest and in transit with encryption and DLP",
            duration: "4-6 weeks",
            icon: "data",
            color: "#e06c75",
            milestones: [
                {
                    id: "m5-1",
                    name: "Data Classification Implemented",
                    description: "Label and classify all CUI data",
                    tasks: [
                        {
                            id: "t5-1-1",
                            name: "Deploy sensitivity labels",
                            description: "Implement data classification with labels",
                            controls: ["3.1.3", "3.8.4"],
                            priority: "high",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Define label taxonomy (Public, Internal, CUI, etc.)",
                                    "Create sensitivity labels in Purview or equivalent",
                                    "Configure label policies",
                                    "Deploy labeling client to endpoints",
                                    "Train users on labeling requirements"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Microsoft Purview Information Protection",
                                        config: [
                                            { setting: "Sensitivity Labels", value: "Public, Internal, Confidential, CUI", location: "Purview > Information Protection > Labels" },
                                            { setting: "Auto-labeling", value: "Detect CUI patterns", location: "Purview > Information Protection > Auto-labeling" },
                                            { setting: "Label Policies", value: "Require label for all documents", location: "Purview > Information Protection > Label Policies" }
                                        ]
                                    }
                                },
                                artifacts: ["Label Taxonomy", "Label Policy Configuration", "Training Materials"]
                            }
                        },
                        {
                            id: "t5-1-2",
                            name: "Implement DLP policies",
                            description: "Prevent unauthorized disclosure of CUI",
                            controls: ["3.1.3", "3.13.4"],
                            priority: "high",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Define sensitive information types (CUI patterns)",
                                    "Create DLP policies for email, SharePoint, endpoints",
                                    "Configure block/warn/audit actions",
                                    "Test with pilot group",
                                    "Deploy and monitor"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Microsoft Purview DLP",
                                        config: [
                                            { setting: "CUI Detection Rule", value: "Custom SIT for CUI markings", location: "Purview > DLP > Sensitive Info Types" },
                                            { setting: "Email DLP", value: "Block external sharing of CUI", location: "Purview > DLP > Policies" },
                                            { setting: "Endpoint DLP", value: "Block copy to USB, cloud storage", location: "Purview > DLP > Endpoint DLP Settings" }
                                        ]
                                    }
                                },
                                artifacts: ["DLP Policy Documentation", "SIT Definitions", "Incident Reports"]
                            }
                        }
                    ]
                },
                {
                    id: "m5-2",
                    name: "Backup and Recovery",
                    description: "Protect CUI with encrypted backups",
                    tasks: [
                        {
                            id: "t5-2-1",
                            name: "Implement encrypted backups",
                            description: "Backup all CUI systems with encryption",
                            controls: ["3.8.9"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Inventory systems requiring backup",
                                    "Select backup solution with encryption",
                                    "Configure backup schedules (daily, weekly)",
                                    "Test restore procedures",
                                    "Store backups in secure, separate location"
                                ],
                                artifacts: ["Backup Configuration", "Restore Test Results", "Backup Inventory"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-6",
            name: "Monitoring & Logging",
            description: "Implement comprehensive audit logging and monitoring",
            duration: "4-6 weeks",
            icon: "monitor",
            color: "#56b6c2",
            milestones: [
                {
                    id: "m6-1",
                    name: "Centralized Logging Deployed",
                    description: "Aggregate logs from all CUI systems",
                    tasks: [
                        {
                            id: "t6-1-1",
                            name: "Deploy SIEM/log aggregation",
                            description: "Centralize logs for analysis and retention",
                            controls: ["3.3.1", "3.3.2", "3.3.8"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Select SIEM solution (Sentinel, Splunk, etc.)",
                                    "Configure log sources (Windows, Linux, network, cloud)",
                                    "Define retention policy (minimum 1 year recommended)",
                                    "Create detection rules and alerts",
                                    "Integrate with ticketing for incident response"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Microsoft Sentinel",
                                        config: [
                                            { setting: "Log Analytics Workspace", value: "Create in CUI subscription", location: "Azure Portal > Log Analytics" },
                                            { setting: "Data Connectors", value: "Entra ID, M365, Defender, Azure Activity", location: "Sentinel > Data Connectors" },
                                            { setting: "Analytics Rules", value: "Enable CMMC-relevant detections", location: "Sentinel > Analytics" },
                                            { setting: "Retention", value: "365+ days", location: "Log Analytics > Usage and Estimated Costs > Data Retention" }
                                        ]
                                    }
                                },
                                artifacts: ["SIEM Architecture", "Log Source Inventory", "Retention Policy", "Detection Rules"]
                            }
                        },
                        {
                            id: "t6-1-2",
                            name: "Configure audit policies",
                            description: "Enable comprehensive Windows audit logging",
                            controls: ["3.3.1", "3.3.2"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Enable advanced audit policies via GPO",
                                    "Configure Security log size and retention",
                                    "Enable command-line auditing",
                                    "Configure PowerShell logging",
                                    "Forward events to SIEM"
                                ],
                                platforms: {
                                    windows: {
                                        name: "Windows Audit Policy",
                                        gpo: [
                                            { setting: "Audit Logon", path: "Computer Config > Windows Settings > Security > Advanced Audit > Logon/Logoff > Audit Logon", value: "Success, Failure" },
                                            { setting: "Audit Process Creation", path: "Computer Config > Windows Settings > Security > Advanced Audit > Detailed Tracking > Audit Process Creation", value: "Success" },
                                            { setting: "Command Line Logging", path: "Computer Config > Admin Templates > System > Audit Process Creation > Include command line", value: "Enabled" },
                                            { setting: "PowerShell Logging", path: "Computer Config > Admin Templates > Windows Components > Windows PowerShell > Turn on Module Logging", value: "Enabled - *" }
                                        ]
                                    }
                                },
                                artifacts: ["Audit Policy GPO", "Event Forwarding Configuration"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-7",
            name: "Remote Access & VDI",
            description: "Implement secure remote access (required) with optional VDI for enhanced CUI protection",
            duration: "4-8 weeks",
            icon: "vdi",
            color: "#d19a66",
            milestones: [
                {
                    id: "m7-1",
                    name: "Secure Remote Access (Required)",
                    description: "Establish secure remote access foundation - required for all remote CUI access",
                    tasks: [
                        {
                            id: "t7-1-1",
                            name: "Select remote access deployment model",
                            description: "Choose deployment approach based on security requirements and resources",
                            controls: ["3.1.12", "3.13.1"],
                            priority: "critical",
                            effort: "low",
                            guidance: {
                                steps: [
                                    "Assess remote workforce size and CUI access needs",
                                    "Evaluate existing infrastructure and budget",
                                    "Choose deployment model: VPN-Only, VDI, or Hybrid",
                                    "Document decision rationale in SSP"
                                ],
                                artifacts: ["Remote Access Strategy Document", "Deployment Decision Matrix"],
                                deploymentOptions: [
                                    {
                                        name: "Option A: VPN + Managed Endpoints (Minimum)",
                                        description: "Traditional VPN with hardened managed devices",
                                        pros: ["Lower cost", "Simpler deployment", "Familiar to users"],
                                        cons: ["CUI on endpoints", "Requires device management", "Higher endpoint risk"],
                                        bestFor: "Small teams, limited budget, low CUI volume"
                                    },
                                    {
                                        name: "Option B: VDI-Only (Maximum Security)",
                                        description: "All CUI access via virtual desktops",
                                        pros: ["CUI never leaves datacenter", "Thin client support", "Centralized control"],
                                        cons: ["Higher cost", "Complex deployment", "Latency sensitive"],
                                        bestFor: "High CUI volume, strict data control requirements"
                                    },
                                    {
                                        name: "Option C: Hybrid (VPN + VDI)",
                                        description: "VPN for general access, VDI for CUI workloads",
                                        pros: ["Flexible", "CUI isolated", "Phased deployment"],
                                        cons: ["Two systems to manage", "User training needed"],
                                        bestFor: "Mixed workloads, phased migration, budget flexibility"
                                    }
                                ]
                            }
                        },
                        {
                            id: "t7-1-2",
                            name: "Deploy secure VPN solution",
                            description: "Implement FIPS-validated VPN with MFA integration",
                            controls: ["3.1.12", "3.13.8", "3.13.11"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Select FIPS 140-2/3 validated VPN solution",
                                    "Configure TLS 1.2+ with approved cipher suites",
                                    "Integrate with identity provider for MFA",
                                    "Implement split tunneling restrictions for CUI",
                                    "Configure device compliance checks"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Azure VPN / Global Secure Access",
                                        config: [
                                            { setting: "VPN Gateway", value: "VpnGw2AZ or higher (FIPS mode)", location: "Azure Portal > VPN Gateway" },
                                            { setting: "P2S Authentication", value: "Entra ID + Certificate", location: "VPN Gateway > Point-to-site" },
                                            { setting: "Global Secure Access", value: "Private Access app for CUI resources", location: "Entra Admin > Global Secure Access" }
                                        ]
                                    },
                                    onprem: {
                                        name: "On-Premises VPN (Cisco, Palo Alto, etc.)",
                                        config: [
                                            { setting: "IKEv2 + IPsec", value: "AES-256-GCM, SHA-384", location: "VPN Concentrator" },
                                            { setting: "RADIUS/SAML", value: "Integrate with IdP for MFA", location: "AAA Configuration" },
                                            { setting: "Tunnel Mode", value: "Full tunnel for CUI destinations", location: "Split Tunnel Policy" }
                                        ]
                                    }
                                },
                                artifacts: ["VPN Configuration Documentation", "Network Diagram", "FIPS Validation Certificate"]
                            }
                        },
                        {
                            id: "t7-1-3",
                            name: "Configure remote session controls",
                            description: "Implement session timeout, idle disconnect, and monitoring",
                            controls: ["3.1.10", "3.1.11", "3.1.21"],
                            priority: "high",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Configure 15-minute idle timeout (CMMC requirement)",
                                    "Implement session locking after inactivity",
                                    "Enable session recording for privileged access",
                                    "Configure concurrent session limits",
                                    "Implement remote session termination capability"
                                ],
                                platforms: {
                                    windows: {
                                        name: "Windows GPO",
                                        gpo: [
                                            { setting: "Interactive logon: Machine inactivity limit", value: "900 seconds", path: "Computer > Windows Settings > Security Settings > Local Policies > Security Options" },
                                            { setting: "Screen saver timeout", value: "900 seconds", path: "User > Administrative Templates > Control Panel > Personalization" }
                                        ]
                                    },
                                    intune: {
                                        name: "Intune / Endpoint Manager",
                                        config: [
                                            { setting: "Device Lock", value: "Require after 15 min inactivity", location: "Endpoint Security > Account Protection" },
                                            { setting: "Session Limit", value: "1 concurrent session", location: "Configuration Profile > Device Restrictions" }
                                        ]
                                    }
                                },
                                artifacts: ["Session Policy Configuration", "GPO Documentation"]
                            }
                        },
                        {
                            id: "t7-1-4",
                            name: "Implement remote access monitoring",
                            description: "Deploy logging and alerting for remote connections",
                            controls: ["3.3.1", "3.3.2", "3.14.6"],
                            priority: "high",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Enable VPN connection logging",
                                    "Forward logs to SIEM",
                                    "Create alerts for anomalous connections",
                                    "Monitor for impossible travel scenarios",
                                    "Track failed authentication attempts"
                                ],
                                artifacts: ["SIEM Alert Rules", "Remote Access Monitoring Runbook"]
                            }
                        }
                    ]
                },
                {
                    id: "m7-2",
                    name: "VDI Platform (Optional - Enhanced Security)",
                    description: "Deploy virtual desktop infrastructure for centralized CUI access - recommended for high-security environments",
                    optional: true,
                    tasks: [
                        {
                            id: "t7-2-1",
                            name: "Deploy VDI platform",
                            description: "Implement AVD, Citrix, or VMware Horizon for CUI workloads",
                            controls: ["3.1.12", "3.1.13", "3.13.1"],
                            priority: "medium",
                            effort: "high",
                            optional: true,
                            guidance: {
                                steps: [
                                    "Select VDI platform based on requirements",
                                    "Design host pool architecture",
                                    "Create STIG-hardened golden image",
                                    "Configure FSLogix for profile management",
                                    "Implement restrictive security policies"
                                ],
                                platforms: {
                                    avd: {
                                        name: "Azure Virtual Desktop",
                                        config: [
                                            { setting: "Host Pool", value: "Pooled, depth-first load balancing", location: "AVD > Host Pools" },
                                            { setting: "RDP Properties", value: "redirectclipboard:i:0;drivestoredirect:s:", location: "Host Pool > RDP Properties" },
                                            { setting: "FSLogix", value: "Profile containers on Azure Files", location: "Session Host GPO" },
                                            { setting: "Conditional Access", value: "Require MFA + compliant device", location: "Entra ID > Conditional Access" }
                                        ]
                                    },
                                    citrix: {
                                        name: "Citrix Virtual Apps and Desktops",
                                        config: [
                                            { setting: "Delivery Controller", value: "HA pair in CUI network", location: "Citrix Studio" },
                                            { setting: "VDA Image", value: "STIG-hardened Windows", location: "Machine Catalog" },
                                            { setting: "Policies", value: "Disable clipboard, drives, printing", location: "Citrix Policy" }
                                        ]
                                    },
                                    vmware: {
                                        name: "VMware Horizon",
                                        config: [
                                            { setting: "Connection Server", value: "HA pair with UAG", location: "Horizon Console" },
                                            { setting: "Desktop Pool", value: "Instant clones from golden image", location: "Horizon Console > Desktop Pools" },
                                            { setting: "UAG", value: "TLS 1.2, MFA integration", location: "UAG Admin Console" }
                                        ]
                                    }
                                },
                                artifacts: ["VDI Architecture Diagram", "Host Pool Configuration", "Security Policy Documentation"]
                            }
                        },
                        {
                            id: "t7-2-2",
                            name: "Deploy VDI endpoints",
                            description: "Provision thin clients or locked-down endpoints for VDI access",
                            controls: ["3.1.1", "3.1.21", "3.4.6"],
                            priority: "medium",
                            effort: "medium",
                            optional: true,
                            guidance: {
                                steps: [
                                    "Select endpoint strategy (thin client, repurpose, IGEL)",
                                    "Configure endpoint management platform",
                                    "Disable local storage and USB on endpoints",
                                    "Implement certificate-based authentication",
                                    "Deploy and inventory all endpoints"
                                ],
                                platforms: {
                                    igel: {
                                        name: "IGEL OS",
                                        config: [
                                            { setting: "USB Control", value: "Block storage class", location: "UMS > Profiles > Devices > USB" },
                                            { setting: "Local Storage", value: "Disabled", location: "UMS > Profiles > Sessions" },
                                            { setting: "Session Protocol", value: "AVD/Citrix/Horizon client only", location: "UMS > Profiles > Sessions" }
                                        ]
                                    },
                                    windows: {
                                        name: "Windows Thin Client / Locked Kiosk",
                                        config: [
                                            { setting: "Assigned Access", value: "Single-app kiosk (VDI client)", location: "Settings > Accounts > Access work or school > Kiosk" },
                                            { setting: "USB Block", value: "Block removable storage", location: "GPO > Administrative Templates > System > Removable Storage Access" }
                                        ]
                                    }
                                },
                                artifacts: ["Endpoint Inventory", "Endpoint Configuration Standards", "UMS/Intune Profiles"]
                            }
                        },
                        {
                            id: "t7-2-3",
                            name: "Configure VDI data protection",
                            description: "Ensure CUI cannot be extracted from VDI environment",
                            controls: ["3.1.3", "3.8.3", "3.13.1"],
                            priority: "medium",
                            effort: "medium",
                            optional: true,
                            guidance: {
                                steps: [
                                    "Disable clipboard redirection",
                                    "Block drive mapping to local devices",
                                    "Disable printing or route to secure printers only",
                                    "Block USB passthrough",
                                    "Implement watermarking for screenshots"
                                ],
                                artifacts: ["VDI Security Policy", "Data Loss Prevention Configuration"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-8",
            name: "Policies & Procedures",
            description: "Document all required policies and procedures",
            duration: "Ongoing",
            icon: "policies",
            color: "#abb2bf",
            milestones: [
                {
                    id: "m8-1",
                    name: "SSP Complete",
                    description: "System Security Plan documenting all controls",
                    tasks: [
                        {
                            id: "t8-1-1",
                            name: "Draft System Security Plan",
                            description: "Document control implementations in SSP format",
                            controls: ["3.12.4"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Use NIST 800-171 SSP template",
                                    "Document each control implementation",
                                    "Include system boundary and diagrams",
                                    "Describe roles and responsibilities",
                                    "Review and obtain management approval"
                                ],
                                artifacts: ["System Security Plan", "Network Diagram", "Data Flow Diagram", "Roles Matrix"]
                            }
                        }
                    ]
                },
                {
                    id: "m8-2",
                    name: "Policies Documented",
                    description: "All required security policies in place",
                    tasks: [
                        {
                            id: "t8-2-1",
                            name: "Create security policies",
                            description: "Document organizational security policies",
                            controls: ["3.1.1", "3.2.1", "3.12.4"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Access Control Policy",
                                    "Acceptable Use Policy",
                                    "Incident Response Policy",
                                    "Configuration Management Policy",
                                    "Audit and Accountability Policy",
                                    "Media Protection Policy",
                                    "Personnel Security Policy"
                                ],
                                artifacts: ["Policy Documents", "Management Approval Records"]
                            }
                        },
                        {
                            id: "t8-2-2",
                            name: "Conduct security training",
                            description: "Train all personnel on security awareness",
                            controls: ["3.2.1", "3.2.2", "3.2.3"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Select training platform (KnowBe4, Proofpoint, etc.)",
                                    "Assign baseline security awareness training",
                                    "Assign role-based training for privileged users",
                                    "Include insider threat awareness",
                                    "Track completion and document"
                                ],
                                artifacts: ["Training Completion Records", "Training Materials", "Insider Threat Program Documentation"]
                            }
                        }
                    ]
                }
            ]
        }
    ],
    
    // Quick reference - controls by category
    controlCategories: {
        identity: {
            name: "Identity & Access",
            controls: ["3.1.1", "3.1.2", "3.1.5", "3.1.6", "3.1.7", "3.5.1", "3.5.2", "3.5.3"],
            description: "Authentication, authorization, and privileged access"
        },
        endpoints: {
            name: "Endpoint Security",
            controls: ["3.4.1", "3.4.2", "3.4.6", "3.4.8", "3.13.16", "3.14.2"],
            description: "Device hardening, encryption, and protection"
        },
        network: {
            name: "Network Security",
            controls: ["3.13.1", "3.13.5", "3.13.6", "3.13.7", "3.13.8", "3.1.12", "3.1.13", "3.1.14"],
            description: "Segmentation, encryption, and remote access"
        },
        data: {
            name: "Data Protection",
            controls: ["3.1.3", "3.8.1", "3.8.4", "3.8.9", "3.13.16"],
            description: "Classification, DLP, and encryption"
        },
        monitoring: {
            name: "Monitoring & Audit",
            controls: ["3.3.1", "3.3.2", "3.3.4", "3.3.8", "3.14.6", "3.14.7"],
            description: "Logging, SIEM, and detection"
        },
        governance: {
            name: "Governance & Policies",
            controls: ["3.2.1", "3.2.2", "3.2.3", "3.12.1", "3.12.4"],
            description: "Training, assessment, and documentation"
        }
    }
};

// Helper functions
function getImplementationPlanner() {
    return IMPLEMENTATION_PLANNER;
}

function getPhaseById(phaseId) {
    return IMPLEMENTATION_PLANNER.phases.find(p => p.id === phaseId);
}

function getTaskById(taskId) {
    for (const phase of IMPLEMENTATION_PLANNER.phases) {
        for (const milestone of phase.milestones) {
            const task = milestone.tasks.find(t => t.id === taskId);
            if (task) return { task, milestone, phase };
        }
    }
    return null;
}

function getAllTasks() {
    const tasks = [];
    for (const phase of IMPLEMENTATION_PLANNER.phases) {
        for (const milestone of phase.milestones) {
            for (const task of milestone.tasks) {
                tasks.push({ ...task, phaseId: phase.id, milestoneId: milestone.id });
            }
        }
    }
    return tasks;
}
