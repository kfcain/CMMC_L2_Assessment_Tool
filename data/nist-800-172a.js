// NIST SP 800-172A Enhanced Security Requirements for CMMC Level 3
// Protecting Controlled Unclassified Information in Nonfederal Systems
// Based on NIST SP 800-172 (February 2021) and SP 800-172A Assessment Procedures
// Total: 35 Enhanced Security Requirements across 14 families

const NIST_800_172A_CONFIG = {
    version: "1.0.0",
    framework: "NIST SP 800-172A",
    title: "Enhanced Security Requirements for Protecting CUI",
    publicationDate: "2022-03-15",
    cmmcLevel: 3,
    totalRequirements: 35,
    description: "Enhanced security requirements to protect CUI in nonfederal systems from Advanced Persistent Threats (APTs)"
};

// CMMC Level 3 Practice ID Mappings
const CMMC_L3_PRACTICE_IDS = {
    // Access Control Enhanced
    "3.1.1e": "AC.L3-3.1.1e",
    "3.1.2e": "AC.L3-3.1.2e",
    "3.1.3e": "AC.L3-3.1.3e",
    // Awareness and Training Enhanced
    "3.2.1e": "AT.L3-3.2.1e",
    "3.2.2e": "AT.L3-3.2.2e",
    // Audit and Accountability Enhanced
    "3.3.1e": "AU.L3-3.3.1e",
    "3.3.2e": "AU.L3-3.3.2e",
    // Configuration Management Enhanced
    "3.4.1e": "CM.L3-3.4.1e",
    "3.4.2e": "CM.L3-3.4.2e",
    "3.4.3e": "CM.L3-3.4.3e",
    // Identification and Authentication Enhanced
    "3.5.1e": "IA.L3-3.5.1e",
    "3.5.2e": "IA.L3-3.5.2e",
    "3.5.3e": "IA.L3-3.5.3e",
    // Incident Response Enhanced
    "3.6.1e": "IR.L3-3.6.1e",
    "3.6.2e": "IR.L3-3.6.2e",
    // Personnel Security Enhanced
    "3.9.1e": "PS.L3-3.9.1e",
    "3.9.2e": "PS.L3-3.9.2e",
    // Physical Protection Enhanced
    "3.10.1e": "PE.L3-3.10.1e",
    // Risk Assessment Enhanced
    "3.11.1e": "RA.L3-3.11.1e",
    "3.11.2e": "RA.L3-3.11.2e",
    "3.11.3e": "RA.L3-3.11.3e",
    "3.11.4e": "RA.L3-3.11.4e",
    "3.11.5e": "RA.L3-3.11.5e",
    "3.11.6e": "RA.L3-3.11.6e",
    "3.11.7e": "RA.L3-3.11.7e",
    // Security Assessment Enhanced
    "3.12.1e": "CA.L3-3.12.1e",
    // System and Communications Protection Enhanced
    "3.13.1e": "SC.L3-3.13.1e",
    "3.13.2e": "SC.L3-3.13.2e",
    "3.13.3e": "SC.L3-3.13.3e",
    "3.13.4e": "SC.L3-3.13.4e",
    // System and Information Integrity Enhanced
    "3.14.1e": "SI.L3-3.14.1e",
    "3.14.2e": "SI.L3-3.14.2e",
    "3.14.3e": "SI.L3-3.14.3e",
    "3.14.4e": "SI.L3-3.14.4e",
    "3.14.5e": "SI.L3-3.14.5e",
    "3.14.6e": "SI.L3-3.14.6e"
};

// Enhanced Security Requirements - Access Control Family
const FAMILY_AC_ENHANCED = {
    id: "AC-E",
    name: "Access Control (Enhanced)",
    description: "Enhanced access control requirements for APT defense",
    controls: [
        {
            id: "3.1.1e",
            baseControl: "3.1.1",
            name: "Authorized Access Enforcement",
            requirement: "Employ dual authorization to execute critical or sensitive system and organizational operations.",
            discussion: "Dual authorization requires two authorized individuals to approve execution of critical operations. This prevents a single compromised account from executing sensitive functions.",
            nist80053: ["AC-3(2)"],
            cmmcPracticeId: "AC.L3-3.1.1e",
            objectives: [
                {
                    id: "3.1.1e[a]",
                    text: "Critical or sensitive system operations requiring dual authorization are defined."
                },
                {
                    id: "3.1.1e[b]",
                    text: "Dual authorization is employed to execute defined critical or sensitive operations."
                }
            ],
            evidenceExamples: [
                "List of operations requiring dual authorization",
                "System configuration showing dual authorization controls",
                "Audit logs demonstrating dual authorization enforcement"
            ],
            implementationGuidance: {
                azure: [
                    "Configure Azure PIM with approval workflows requiring 2 approvers",
                    "Implement Azure AD Privileged Access Groups with multiple owners",
                    "Use Privileged Access Management for sensitive operations"
                ],
                aws: [
                    "Implement AWS Organizations SCPs requiring dual approval",
                    "Use AWS Systems Manager Change Manager with dual approval",
                    "Configure AWS IAM Identity Center with approval workflows"
                ],
                general: [
                    "Identify all critical operations (delete, modify security settings, export data)",
                    "Implement separation of request and approval roles",
                    "Log all dual authorization events for audit"
                ]
            }
        },
        {
            id: "3.1.2e",
            baseControl: "3.1.2",
            name: "Restrict Privileged Account Access",
            requirement: "Restrict access to systems and system components to only those information resources that are owned, provisioned, or issued by the organization.",
            discussion: "This requirement restricts system access to organization-controlled resources, preventing use of personal devices or unauthorized systems for accessing CUI.",
            nist80053: ["AC-3(13)"],
            cmmcPracticeId: "AC.L3-3.1.2e",
            objectives: [
                {
                    id: "3.1.2e[a]",
                    text: "Information resources that are owned, provisioned, or issued by the organization are identified."
                },
                {
                    id: "3.1.2e[b]",
                    text: "Access to systems and system components is restricted to organization-owned, provisioned, or issued resources."
                }
            ],
            evidenceExamples: [
                "Asset inventory of authorized devices",
                "NAC/conditional access policies",
                "Device compliance requirements"
            ],
            implementationGuidance: {
                azure: [
                    "Configure Entra ID Conditional Access to require compliant/hybrid joined devices",
                    "Deploy Intune device compliance policies",
                    "Block access from unmanaged devices via Global Secure Access"
                ],
                aws: [
                    "Use AWS Verified Access with device trust",
                    "Implement device certificates for VPN access",
                    "Configure AWS WorkSpaces for CUI access only"
                ],
                general: [
                    "Maintain comprehensive asset inventory",
                    "Deploy NAC solution requiring device authentication",
                    "Block BYOD for CUI systems"
                ]
            }
        },
        {
            id: "3.1.3e",
            baseControl: "3.1.3",
            name: "Enhanced CUI Flow Enforcement",
            requirement: "Employ [organization-defined solutions] to control the flow of CUI within the system and between connected systems.",
            discussion: "Enhanced CUI flow controls use advanced technologies such as DLP, data tagging, and encryption to track and control CUI movement.",
            nist80053: ["AC-4", "AC-4(6)", "SC-16"],
            cmmcPracticeId: "AC.L3-3.1.3e",
            objectives: [
                {
                    id: "3.1.3e[a]",
                    text: "Solutions to control the flow of CUI are defined."
                },
                {
                    id: "3.1.3e[b]",
                    text: "Defined solutions are employed to control the flow of CUI within the system."
                },
                {
                    id: "3.1.3e[c]",
                    text: "Defined solutions are employed to control the flow of CUI between connected systems."
                }
            ],
            evidenceExamples: [
                "DLP policy configurations",
                "Data classification and labeling scheme",
                "Network segmentation diagrams",
                "CUI flow monitoring reports"
            ],
            implementationGuidance: {
                azure: [
                    "Deploy Microsoft Purview DLP policies for CUI",
                    "Configure sensitivity labels with auto-labeling",
                    "Enable endpoint DLP on all CUI-processing devices",
                    "Use Azure Firewall to segment CUI network flows"
                ],
                aws: [
                    "Deploy Amazon Macie for CUI discovery and classification",
                    "Implement VPC Flow Logs with CUI monitoring",
                    "Use AWS Network Firewall for CUI segmentation"
                ],
                general: [
                    "Implement enterprise DLP solution",
                    "Deploy data classification with sensitivity labels",
                    "Monitor and alert on CUI exfiltration attempts"
                ]
            }
        }
    ]
};

// Enhanced Security Requirements - Awareness and Training Family
const FAMILY_AT_ENHANCED = {
    id: "AT-E",
    name: "Awareness and Training (Enhanced)",
    description: "Enhanced awareness and training for APT defense",
    controls: [
        {
            id: "3.2.1e",
            baseControl: "3.2.1",
            name: "Advanced Threat Awareness",
            requirement: "Provide awareness training focused on recognizing and responding to threats from social engineering, APT actors, breaches, and suspicious behaviors; update training at least annually or when there are significant changes to the threat.",
            discussion: "Enhanced awareness focuses specifically on APT tactics, techniques, and procedures (TTPs) rather than general security awareness.",
            nist80053: ["AT-2(3)", "AT-2(5)"],
            cmmcPracticeId: "AT.L3-3.2.1e",
            objectives: [
                {
                    id: "3.2.1e[a]",
                    text: "Awareness training on recognizing social engineering threats is provided."
                },
                {
                    id: "3.2.1e[b]",
                    text: "Awareness training on recognizing APT actor threats is provided."
                },
                {
                    id: "3.2.1e[c]",
                    text: "Awareness training on recognizing breach indicators is provided."
                },
                {
                    id: "3.2.1e[d]",
                    text: "Awareness training on recognizing suspicious behaviors is provided."
                },
                {
                    id: "3.2.1e[e]",
                    text: "Awareness training on responding to identified threats is provided."
                },
                {
                    id: "3.2.1e[f]",
                    text: "Training is updated at least annually or when significant threat changes occur."
                }
            ],
            evidenceExamples: [
                "APT-focused training curriculum",
                "Training completion records",
                "Phishing simulation results",
                "Training update log tied to threat intel"
            ],
            implementationGuidance: {
                general: [
                    "Subscribe to threat intelligence (CISA, FBI, DIB-ISAC)",
                    "Conduct monthly phishing simulations",
                    "Provide role-based APT training for IT/security staff",
                    "Update training when new APT campaigns are identified"
                ]
            }
        },
        {
            id: "3.2.2e",
            baseControl: "3.2.2",
            name: "Practical Exercises",
            requirement: "Include practical exercises in awareness training that simulate events and incidents.",
            discussion: "Practical exercises provide hands-on experience in identifying and responding to APT-style attacks.",
            nist80053: ["AT-2(1)", "AT-3(3)"],
            cmmcPracticeId: "AT.L3-3.2.2e",
            objectives: [
                {
                    id: "3.2.2e[a]",
                    text: "Practical exercises simulating cyber events are included in awareness training."
                },
                {
                    id: "3.2.2e[b]",
                    text: "Practical exercises simulating cyber incidents are included in awareness training."
                }
            ],
            evidenceExamples: [
                "Tabletop exercise documentation",
                "Red team/blue team exercise reports",
                "Phishing simulation results",
                "Incident response drill records"
            ],
            implementationGuidance: {
                general: [
                    "Conduct quarterly tabletop exercises",
                    "Run monthly phishing simulations",
                    "Perform annual red team exercises",
                    "Document lessons learned and remediation actions"
                ]
            }
        }
    ]
};

// Enhanced Security Requirements - Audit and Accountability Family
const FAMILY_AU_ENHANCED = {
    id: "AU-E",
    name: "Audit and Accountability (Enhanced)",
    description: "Enhanced audit and accountability for APT defense",
    controls: [
        {
            id: "3.3.1e",
            baseControl: "3.3.1",
            name: "Audit Log Correlation",
            requirement: "Correlate audit record review, analysis, and reporting processes using [organization-defined automated mechanisms].",
            discussion: "Automated correlation enables detection of complex multi-stage APT attacks that span multiple systems and time periods.",
            nist80053: ["AU-6(3)"],
            cmmcPracticeId: "AU.L3-3.3.1e",
            objectives: [
                {
                    id: "3.3.1e[a]",
                    text: "Automated mechanisms for correlating audit records are defined."
                },
                {
                    id: "3.3.1e[b]",
                    text: "Defined automated mechanisms correlate audit record review, analysis, and reporting."
                }
            ],
            evidenceExamples: [
                "SIEM correlation rule documentation",
                "Automated alerting configuration",
                "Correlation analysis reports",
                "Detection use case library"
            ],
            implementationGuidance: {
                azure: [
                    "Deploy Microsoft Sentinel with analytics rules",
                    "Enable UEBA for behavioral correlation",
                    "Configure multi-stage attack detection",
                    "Integrate all log sources for correlation"
                ],
                aws: [
                    "Deploy Amazon Security Lake for centralized logs",
                    "Use Amazon Detective for correlation",
                    "Configure GuardDuty with threat intel integration"
                ],
                general: [
                    "Implement SIEM with correlation engine",
                    "Create detection rules for APT TTPs",
                    "Enable user and entity behavior analytics (UEBA)"
                ]
            }
        },
        {
            id: "3.3.2e",
            baseControl: "3.3.2",
            name: "Security Operations Center",
            requirement: "Maintain a security operation center capability that operates at a level consistent with organizational risk; and employs automated mechanisms to support the security operation center.",
            discussion: "A SOC provides continuous monitoring and response capability essential for defending against APTs.",
            nist80053: ["SI-4(7)"],
            cmmcPracticeId: "AU.L3-3.3.2e",
            objectives: [
                {
                    id: "3.3.2e[a]",
                    text: "A security operation center capability is maintained."
                },
                {
                    id: "3.3.2e[b]",
                    text: "The SOC operates at a level consistent with organizational risk."
                },
                {
                    id: "3.3.2e[c]",
                    text: "Automated mechanisms are employed to support SOC operations."
                }
            ],
            evidenceExamples: [
                "SOC charter and operating procedures",
                "24/7 coverage documentation",
                "SOC tool inventory (SIEM, SOAR, EDR)",
                "Incident response metrics"
            ],
            implementationGuidance: {
                azure: [
                    "Implement Microsoft Sentinel as SOC platform",
                    "Configure automated playbooks with Logic Apps",
                    "Deploy Microsoft Defender XDR for unified detection"
                ],
                aws: [
                    "Use AWS Security Hub as SOC dashboard",
                    "Deploy Amazon GuardDuty for threat detection",
                    "Implement AWS Step Functions for SOAR"
                ],
                general: [
                    "Establish 24/7 SOC coverage (internal or MSSP)",
                    "Implement SOAR for automated response",
                    "Define SOC metrics and SLAs"
                ]
            }
        }
    ]
};

// Enhanced Security Requirements - Configuration Management Family
const FAMILY_CM_ENHANCED = {
    id: "CM-E",
    name: "Configuration Management (Enhanced)",
    description: "Enhanced configuration management for APT defense",
    controls: [
        {
            id: "3.4.1e",
            baseControl: "3.4.1",
            name: "Authoritative Source Verification",
            requirement: "Establish and maintain an authoritative source and repository to provide a trusted source and accountability for approved system components.",
            discussion: "An authoritative source prevents supply chain attacks by ensuring only verified components are deployed.",
            nist80053: ["CM-2(6)", "CM-2(7)"],
            cmmcPracticeId: "CM.L3-3.4.1e",
            objectives: [
                {
                    id: "3.4.1e[a]",
                    text: "An authoritative source for approved system components is established."
                },
                {
                    id: "3.4.1e[b]",
                    text: "A repository for approved system components is maintained."
                },
                {
                    id: "3.4.1e[c]",
                    text: "Accountability for approved system components is maintained."
                }
            ],
            evidenceExamples: [
                "Approved software repository",
                "Software bill of materials (SBOM)",
                "Component verification procedures"
            ],
            implementationGuidance: {
                azure: [
                    "Use Azure Artifacts for approved packages",
                    "Deploy Azure Container Registry with signing",
                    "Implement GitHub Advanced Security for SBOM"
                ],
                aws: [
                    "Use AWS CodeArtifact for package management",
                    "Deploy Amazon ECR with image signing",
                    "Implement AWS Inspector for component scanning"
                ],
                general: [
                    "Maintain SBOM for all systems",
                    "Sign and verify all deployed components",
                    "Block unauthorized software sources"
                ]
            }
        },
        {
            id: "3.4.2e",
            baseControl: "3.4.2",
            name: "Automated Configuration Monitoring",
            requirement: "Employ automated mechanisms to detect misconfigured or unauthorized system components; after detection, remove, restore, or isolate components.",
            discussion: "Automated detection and response prevents configuration drift that APTs exploit.",
            nist80053: ["CM-6(2)", "CM-8(3)"],
            cmmcPracticeId: "CM.L3-3.4.2e",
            objectives: [
                {
                    id: "3.4.2e[a]",
                    text: "Automated mechanisms to detect misconfigured components are employed."
                },
                {
                    id: "3.4.2e[b]",
                    text: "Automated mechanisms to detect unauthorized components are employed."
                },
                {
                    id: "3.4.2e[c]",
                    text: "Detected misconfigured or unauthorized components are removed, restored, or isolated."
                }
            ],
            evidenceExamples: [
                "Configuration monitoring tool output",
                "Drift detection reports",
                "Automated remediation logs"
            ],
            implementationGuidance: {
                azure: [
                    "Deploy Azure Policy with deny/audit effects",
                    "Enable Microsoft Defender for Cloud posture management",
                    "Use Azure Automation for remediation"
                ],
                aws: [
                    "Deploy AWS Config with auto-remediation",
                    "Use AWS Security Hub for posture management",
                    "Implement AWS Systems Manager State Manager"
                ],
                general: [
                    "Implement configuration management database (CMDB)",
                    "Deploy drift detection with automated alerts",
                    "Create runbooks for common remediations"
                ]
            }
        },
        {
            id: "3.4.3e",
            baseControl: "3.4.3",
            name: "Secure Configurations",
            requirement: "Employ application allow listing and application vetting to control software execution.",
            discussion: "Application allowlisting prevents execution of unauthorized or malicious software.",
            nist80053: ["CM-7(5)"],
            cmmcPracticeId: "CM.L3-3.4.3e",
            objectives: [
                {
                    id: "3.4.3e[a]",
                    text: "Application allow listing is employed."
                },
                {
                    id: "3.4.3e[b]",
                    text: "Application vetting is employed."
                }
            ],
            evidenceExamples: [
                "Application allowlist policy",
                "App vetting procedures",
                "Blocked execution logs"
            ],
            implementationGuidance: {
                azure: [
                    "Deploy Windows Defender Application Control (WDAC)",
                    "Configure Microsoft Defender for Endpoint application control",
                    "Use Intune for app deployment and blocking"
                ],
                aws: [
                    "Use AWS AppStream with app whitelisting",
                    "Deploy CrowdStrike or similar with app control",
                    "Implement AWS Systems Manager Inventory"
                ],
                general: [
                    "Deploy enterprise application allowlisting",
                    "Implement code signing requirements",
                    "Block unauthorized executables"
                ]
            }
        }
    ]
};

// Enhanced Security Requirements - Identification and Authentication Family
const FAMILY_IA_ENHANCED = {
    id: "IA-E",
    name: "Identification and Authentication (Enhanced)",
    description: "Enhanced identification and authentication for APT defense",
    controls: [
        {
            id: "3.5.1e",
            baseControl: "3.5.1",
            name: "Bidirectional Authentication",
            requirement: "Employ multifactor, replay-resistant authentication mechanisms for network access to privileged and non-privileged accounts that are bidirectional.",
            discussion: "Bidirectional authentication ensures both client and server authenticate, preventing man-in-the-middle attacks.",
            nist80053: ["IA-2(6)"],
            cmmcPracticeId: "IA.L3-3.5.1e",
            objectives: [
                {
                    id: "3.5.1e[a]",
                    text: "Multifactor authentication mechanisms for network access are bidirectional."
                },
                {
                    id: "3.5.1e[b]",
                    text: "Authentication mechanisms are replay-resistant."
                },
                {
                    id: "3.5.1e[c]",
                    text: "Requirements apply to both privileged and non-privileged accounts."
                }
            ],
            evidenceExamples: [
                "Certificate-based mutual TLS configuration",
                "Smart card authentication logs",
                "PKI infrastructure documentation"
            ],
            implementationGuidance: {
                azure: [
                    "Deploy certificate-based authentication with Entra ID",
                    "Implement FIDO2 security keys",
                    "Configure mutual TLS for sensitive applications"
                ],
                aws: [
                    "Use AWS IAM Identity Center with hardware MFA",
                    "Deploy AWS Certificate Manager for mutual TLS",
                    "Implement AWS Client VPN with certificate auth"
                ],
                general: [
                    "Deploy PKI infrastructure",
                    "Require hardware tokens or smart cards",
                    "Configure mutual TLS for all sensitive systems"
                ]
            }
        },
        {
            id: "3.5.2e",
            baseControl: "3.5.2",
            name: "Privileged Account Protection",
            requirement: "Use automated mechanisms to prohibit system components from connecting to organizational systems unless the component is known, authenticated, in a properly configured state, and is in compliance with applicable policies.",
            discussion: "Zero trust network access (ZTNA) ensures only healthy, authenticated devices can connect.",
            nist80053: ["IA-3(1)"],
            cmmcPracticeId: "IA.L3-3.5.2e",
            objectives: [
                {
                    id: "3.5.2e[a]",
                    text: "Automated mechanisms prohibit unknown components from connecting."
                },
                {
                    id: "3.5.2e[b]",
                    text: "Components must be authenticated before connecting."
                },
                {
                    id: "3.5.2e[c]",
                    text: "Components must be properly configured before connecting."
                },
                {
                    id: "3.5.2e[d]",
                    text: "Components must comply with policies before connecting."
                }
            ],
            evidenceExamples: [
                "NAC/ZTNA configuration",
                "Device health attestation",
                "Conditional access policies"
            ],
            implementationGuidance: {
                azure: [
                    "Deploy Microsoft Entra Global Secure Access",
                    "Configure Conditional Access with device compliance",
                    "Implement Microsoft Intune device health attestation"
                ],
                aws: [
                    "Deploy AWS Verified Access",
                    "Use AWS IoT Device Defender for device trust",
                    "Implement AWS Systems Manager for device compliance"
                ],
                general: [
                    "Deploy NAC with 802.1X",
                    "Require device health attestation",
                    "Block non-compliant devices from network"
                ]
            }
        },
        {
            id: "3.5.3e",
            baseControl: "3.5.3",
            name: "Password-less Authentication",
            requirement: "Employ password-less authentication mechanisms.",
            discussion: "Password-less authentication eliminates credential theft and reuse attacks.",
            nist80053: ["IA-5(18)"],
            cmmcPracticeId: "IA.L3-3.5.3e",
            objectives: [
                {
                    id: "3.5.3e[a]",
                    text: "Password-less authentication mechanisms are employed."
                }
            ],
            evidenceExamples: [
                "FIDO2/WebAuthn configuration",
                "Certificate-based auth settings",
                "Passwordless adoption metrics"
            ],
            implementationGuidance: {
                azure: [
                    "Enable Microsoft Authenticator passwordless",
                    "Deploy FIDO2 security keys",
                    "Configure Windows Hello for Business"
                ],
                aws: [
                    "Use AWS IAM Identity Center with passkeys",
                    "Deploy hardware MFA devices",
                    "Implement certificate-based authentication"
                ],
                general: [
                    "Deploy FIDO2 security keys",
                    "Implement smart card authentication",
                    "Phase out password-based authentication"
                ]
            }
        }
    ]
};

// Enhanced Security Requirements - Incident Response Family
const FAMILY_IR_ENHANCED = {
    id: "IR-E",
    name: "Incident Response (Enhanced)",
    description: "Enhanced incident response for APT defense",
    controls: [
        {
            id: "3.6.1e",
            baseControl: "3.6.1",
            name: "Security Operations Center",
            requirement: "Establish and maintain a security operations center capability.",
            discussion: "A dedicated SOC provides 24/7 monitoring and rapid response to APT activity.",
            nist80053: ["IR-4(1)", "IR-4(4)"],
            cmmcPracticeId: "IR.L3-3.6.1e",
            objectives: [
                {
                    id: "3.6.1e[a]",
                    text: "A security operations center capability is established."
                },
                {
                    id: "3.6.1e[b]",
                    text: "The security operations center capability is maintained."
                }
            ],
            evidenceExamples: [
                "SOC charter",
                "24/7 staffing schedule",
                "SOC metrics dashboard",
                "Incident response procedures"
            ],
            implementationGuidance: {
                general: [
                    "Establish SOC with 24/7 coverage",
                    "Deploy SIEM and SOAR platforms",
                    "Define escalation procedures",
                    "Maintain threat hunting capability"
                ]
            }
        },
        {
            id: "3.6.2e",
            baseControl: "3.6.2",
            name: "Cyber Incident Reporting",
            requirement: "Report cyber incidents to DoD in accordance with DoD requirements.",
            discussion: "Timely incident reporting enables coordinated response to APT campaigns.",
            nist80053: ["IR-6(1)"],
            cmmcPracticeId: "IR.L3-3.6.2e",
            objectives: [
                {
                    id: "3.6.2e[a]",
                    text: "Cyber incidents are reported to DoD in accordance with DoD requirements."
                }
            ],
            evidenceExamples: [
                "Incident reporting procedures",
                "DIBNet/DC3 registration",
                "Incident report templates"
            ],
            implementationGuidance: {
                general: [
                    "Register with DIBNet",
                    "Establish 72-hour reporting procedures",
                    "Train staff on reporting requirements",
                    "Document all reportable incidents"
                ]
            }
        }
    ]
};

// Enhanced Security Requirements - Risk Assessment Family
const FAMILY_RA_ENHANCED = {
    id: "RA-E",
    name: "Risk Assessment (Enhanced)",
    description: "Enhanced risk assessment for APT defense",
    controls: [
        {
            id: "3.11.1e",
            baseControl: "3.11.1",
            name: "Threat Hunting",
            requirement: "Employ threat hunting activities to search for indicators of compromise in organizational systems and detect, track, and disrupt threats that evade existing controls.",
            discussion: "Proactive threat hunting identifies APT activity that automated tools miss.",
            nist80053: ["RA-5(10)", "RA-10"],
            cmmcPracticeId: "RA.L3-3.11.1e",
            objectives: [
                {
                    id: "3.11.1e[a]",
                    text: "Threat hunting activities are employed."
                },
                {
                    id: "3.11.1e[b]",
                    text: "Threat hunting searches for indicators of compromise."
                },
                {
                    id: "3.11.1e[c]",
                    text: "Threats that evade existing controls are detected, tracked, and disrupted."
                }
            ],
            evidenceExamples: [
                "Threat hunting procedures",
                "Hunt mission reports",
                "IOC library",
                "Hunting tool output"
            ],
            implementationGuidance: {
                azure: [
                    "Use Microsoft Sentinel hunting queries",
                    "Deploy Microsoft Defender for Endpoint advanced hunting",
                    "Leverage Microsoft threat intelligence"
                ],
                aws: [
                    "Use Amazon Detective for investigation",
                    "Deploy Amazon GuardDuty findings",
                    "Implement CloudTrail Lake for hunting"
                ],
                general: [
                    "Establish threat hunting program",
                    "Subscribe to threat intelligence feeds",
                    "Conduct regular hunting missions based on TTPs"
                ]
            }
        },
        {
            id: "3.11.2e",
            baseControl: "3.11.2",
            name: "Cyber Threat Intelligence",
            requirement: "Employ threat intelligence to inform the development of the system and security architecture, the selection of security solutions, and the activities associated with monitoring and hunting.",
            discussion: "Threat intelligence enables proactive defense based on current APT tactics.",
            nist80053: ["PM-16"],
            cmmcPracticeId: "RA.L3-3.11.2e",
            objectives: [
                {
                    id: "3.11.2e[a]",
                    text: "Threat intelligence informs system and security architecture development."
                },
                {
                    id: "3.11.2e[b]",
                    text: "Threat intelligence informs selection of security solutions."
                },
                {
                    id: "3.11.2e[c]",
                    text: "Threat intelligence informs monitoring and hunting activities."
                }
            ],
            evidenceExamples: [
                "Threat intel subscriptions",
                "Intel-driven architecture decisions",
                "Detection rule updates from intel"
            ],
            implementationGuidance: {
                general: [
                    "Subscribe to DIB-ISAC, CISA, FBI Flash",
                    "Integrate threat intel into SIEM",
                    "Update detection rules based on intel",
                    "Brief leadership on threat landscape"
                ]
            }
        },
        {
            id: "3.11.3e",
            baseControl: "3.11.3",
            name: "Advanced Automated Analysis",
            requirement: "Employ advanced automated tools to perform analysis of system, system component, or network configurations.",
            discussion: "Advanced analysis tools identify subtle configuration weaknesses that APTs exploit.",
            nist80053: ["RA-5(5)"],
            cmmcPracticeId: "RA.L3-3.11.3e",
            objectives: [
                {
                    id: "3.11.3e[a]",
                    text: "Advanced automated tools are employed for configuration analysis."
                }
            ],
            evidenceExamples: [
                "Advanced scanning tool output",
                "Configuration analysis reports",
                "Remediation tracking"
            ],
            implementationGuidance: {
                azure: [
                    "Deploy Microsoft Defender for Cloud",
                    "Use Azure Policy for compliance scanning",
                    "Enable Microsoft Secure Score"
                ],
                aws: [
                    "Deploy AWS Security Hub",
                    "Use AWS Inspector for vulnerability scanning",
                    "Implement AWS Config conformance packs"
                ],
                general: [
                    "Deploy enterprise vulnerability scanner",
                    "Implement cloud security posture management",
                    "Automate compliance scanning"
                ]
            }
        }
    ]
};

// Enhanced Security Requirements - System and Communications Protection Family
const FAMILY_SC_ENHANCED = {
    id: "SC-E",
    name: "System and Communications Protection (Enhanced)",
    description: "Enhanced system and communications protection for APT defense",
    controls: [
        {
            id: "3.13.1e",
            baseControl: "3.13.1",
            name: "Network Segmentation",
            requirement: "Isolate CUI and organizational systems processing, storing, or transmitting CUI from other systems through the use of physical and logical network isolation.",
            discussion: "Network isolation limits APT lateral movement within the environment.",
            nist80053: ["SC-7(13)", "SC-7(14)"],
            cmmcPracticeId: "SC.L3-3.13.1e",
            objectives: [
                {
                    id: "3.13.1e[a]",
                    text: "CUI systems are isolated using physical network isolation."
                },
                {
                    id: "3.13.1e[b]",
                    text: "CUI systems are isolated using logical network isolation."
                }
            ],
            evidenceExamples: [
                "Network architecture diagram",
                "VLAN configurations",
                "Firewall rules between zones"
            ],
            implementationGuidance: {
                azure: [
                    "Implement Azure Virtual Network isolation",
                    "Deploy Azure Firewall between segments",
                    "Use Network Security Groups and ASGs"
                ],
                aws: [
                    "Implement VPC isolation for CUI",
                    "Deploy AWS Network Firewall",
                    "Use Security Groups and NACLs"
                ],
                general: [
                    "Segment CUI from non-CUI networks",
                    "Implement micro-segmentation",
                    "Deploy next-gen firewalls between zones"
                ]
            }
        },
        {
            id: "3.13.2e",
            baseControl: "3.13.2",
            name: "Domain Isolation",
            requirement: "Employ domain separation, network isolation, network traffic control, isolation techniques, and monitoring of communications at managed interfaces to protect CUI.",
            discussion: "Multiple isolation techniques provide defense-in-depth against APT lateral movement.",
            nist80053: ["SC-7(21)"],
            cmmcPracticeId: "SC.L3-3.13.2e",
            objectives: [
                {
                    id: "3.13.2e[a]",
                    text: "Domain separation is employed to protect CUI."
                },
                {
                    id: "3.13.2e[b]",
                    text: "Network isolation is employed to protect CUI."
                },
                {
                    id: "3.13.2e[c]",
                    text: "Network traffic control is employed to protect CUI."
                },
                {
                    id: "3.13.2e[d]",
                    text: "Isolation techniques are employed to protect CUI."
                },
                {
                    id: "3.13.2e[e]",
                    text: "Communications are monitored at managed interfaces."
                }
            ],
            evidenceExamples: [
                "Domain architecture documentation",
                "Traffic flow diagrams",
                "IDS/IPS configurations",
                "Network monitoring logs"
            ],
            implementationGuidance: {
                azure: [
                    "Separate CUI into dedicated Azure tenant or subscription",
                    "Implement Azure Private Endpoints",
                    "Deploy Azure Firewall Premium with IDPS"
                ],
                aws: [
                    "Separate CUI into dedicated AWS account",
                    "Implement AWS PrivateLink",
                    "Deploy AWS Network Firewall with IPS"
                ],
                general: [
                    "Create separate AD domains for CUI",
                    "Deploy IDS/IPS at all boundaries",
                    "Monitor all cross-boundary traffic"
                ]
            }
        }
    ]
};

// Enhanced Security Requirements - System and Information Integrity Family
const FAMILY_SI_ENHANCED = {
    id: "SI-E",
    name: "System and Information Integrity (Enhanced)",
    description: "Enhanced system and information integrity for APT defense",
    controls: [
        {
            id: "3.14.1e",
            baseControl: "3.14.1",
            name: "Integrity Verification",
            requirement: "Verify the integrity of security critical software using root of trust mechanisms or cryptographic signatures.",
            discussion: "Cryptographic verification prevents execution of tampered or malicious software.",
            nist80053: ["SI-7(1)"],
            cmmcPracticeId: "SI.L3-3.14.1e",
            objectives: [
                {
                    id: "3.14.1e[a]",
                    text: "Security critical software is identified."
                },
                {
                    id: "3.14.1e[b]",
                    text: "Integrity of security critical software is verified using root of trust or cryptographic signatures."
                }
            ],
            evidenceExamples: [
                "Code signing certificates",
                "TPM/secure boot configuration",
                "Integrity verification logs"
            ],
            implementationGuidance: {
                azure: [
                    "Enable Secure Boot on all VMs",
                    "Deploy Azure Trusted Launch VMs",
                    "Require code signing for all scripts"
                ],
                aws: [
                    "Enable AWS Nitro Enclaves",
                    "Use AWS Signer for code signing",
                    "Deploy EC2 with TPM support"
                ],
                general: [
                    "Enable TPM and Secure Boot",
                    "Require code signing for all executables",
                    "Monitor integrity verification failures"
                ]
            }
        },
        {
            id: "3.14.2e",
            baseControl: "3.14.2",
            name: "Automated Response",
            requirement: "Employ automated tools to identify and respond to malicious code injected into organizational systems.",
            discussion: "Automated response limits dwell time of injected malicious code.",
            nist80053: ["SI-3(7)", "SI-10(6)"],
            cmmcPracticeId: "SI.L3-3.14.2e",
            objectives: [
                {
                    id: "3.14.2e[a]",
                    text: "Automated tools identify malicious code injected into systems."
                },
                {
                    id: "3.14.2e[b]",
                    text: "Automated tools respond to malicious code injected into systems."
                }
            ],
            evidenceExamples: [
                "EDR configuration",
                "Automated isolation rules",
                "Response playbooks"
            ],
            implementationGuidance: {
                azure: [
                    "Deploy Microsoft Defender for Endpoint with automated response",
                    "Configure Microsoft Sentinel SOAR playbooks",
                    "Enable attack disruption"
                ],
                aws: [
                    "Deploy Amazon GuardDuty with auto-remediation",
                    "Use AWS Lambda for automated response",
                    "Implement AWS Step Functions for SOAR"
                ],
                general: [
                    "Deploy EDR with automated response",
                    "Create automated containment playbooks",
                    "Test response automation regularly"
                ]
            }
        },
        {
            id: "3.14.3e",
            baseControl: "3.14.3",
            name: "Sandboxing",
            requirement: "Employ sandboxing to detect and block potentially malicious content.",
            discussion: "Sandboxing analyzes suspicious content in isolated environments before allowing execution.",
            nist80053: ["SC-44"],
            cmmcPracticeId: "SI.L3-3.14.3e",
            objectives: [
                {
                    id: "3.14.3e[a]",
                    text: "Sandboxing is employed to detect potentially malicious content."
                },
                {
                    id: "3.14.3e[b]",
                    text: "Sandboxing is employed to block potentially malicious content."
                }
            ],
            evidenceExamples: [
                "Sandbox solution configuration",
                "Detonation reports",
                "Blocked content logs"
            ],
            implementationGuidance: {
                azure: [
                    "Deploy Microsoft Defender for Office 365 Safe Attachments",
                    "Enable Safe Links for URL detonation",
                    "Configure sandbox for email attachments"
                ],
                aws: [
                    "Deploy third-party sandbox solution",
                    "Use Amazon Macie for content analysis",
                    "Implement file analysis workflows"
                ],
                general: [
                    "Deploy email attachment sandboxing",
                    "Implement URL detonation for suspicious links",
                    "Sandbox all downloaded executables"
                ]
            }
        }
    ]
};

// Compile all enhanced families
const NIST_800_172A_FAMILIES = [
    FAMILY_AC_ENHANCED,
    FAMILY_AT_ENHANCED,
    FAMILY_AU_ENHANCED,
    FAMILY_CM_ENHANCED,
    FAMILY_IA_ENHANCED,
    FAMILY_IR_ENHANCED,
    FAMILY_RA_ENHANCED,
    FAMILY_SC_ENHANCED,
    FAMILY_SI_ENHANCED
];

// L3 Assessment Helper Functions
const L3AssessmentHelper = {
    // Get all L3 enhanced controls
    getAllEnhancedControls: function() {
        const controls = [];
        NIST_800_172A_FAMILIES.forEach(family => {
            family.controls.forEach(control => {
                controls.push({
                    ...control,
                    familyId: family.id,
                    familyName: family.name
                });
            });
        });
        return controls;
    },

    // Get total objective count
    getTotalObjectives: function() {
        let count = 0;
        NIST_800_172A_FAMILIES.forEach(family => {
            family.controls.forEach(control => {
                count += control.objectives.length;
            });
        });
        return count;
    },

    // Check if control is enhanced version of base
    getBaseControl: function(enhancedId) {
        return enhancedId.replace('e', '');
    },

    // Get L3 requirements by family
    getByFamily: function(familyId) {
        return NIST_800_172A_FAMILIES.find(f => f.id === familyId || f.id === familyId + '-E');
    },

    // Generate L3 assessment summary
    generateAssessmentSummary: function(assessmentData) {
        const controls = this.getAllEnhancedControls();
        const summary = {
            total: controls.length,
            met: 0,
            notMet: 0,
            partiallyMet: 0,
            notApplicable: 0,
            notAssessed: 0
        };

        controls.forEach(control => {
            const status = assessmentData[control.id] || 'not-assessed';
            if (status === 'met') summary.met++;
            else if (status === 'not-met') summary.notMet++;
            else if (status === 'partially-met') summary.partiallyMet++;
            else if (status === 'not-applicable') summary.notApplicable++;
            else summary.notAssessed++;
        });

        summary.percentComplete = Math.round(((summary.met + summary.notApplicable) / summary.total) * 100);
        return summary;
    }
};

// Export for use in application
if (typeof window !== 'undefined') {
    window.NIST_800_172A_CONFIG = NIST_800_172A_CONFIG;
    window.NIST_800_172A_FAMILIES = NIST_800_172A_FAMILIES;
    window.CMMC_L3_PRACTICE_IDS = CMMC_L3_PRACTICE_IDS;
    window.L3AssessmentHelper = L3AssessmentHelper;
}
