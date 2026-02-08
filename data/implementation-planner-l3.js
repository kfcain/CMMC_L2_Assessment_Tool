// Implementation Planner - CMMC Level 3 Edition
// NIST SP 800-172 / 800-172A Enhanced Security Requirements
// Assumes L2 certification already achieved — DIBCAC performs L3 assessment
// 9 families, 23 enhanced controls, 59 assessment objectives
console.log('=== L3 IMPLEMENTATION PLANNER LOADING ===');

const IMPLEMENTATION_PLANNER_L3 = {
    version: "1.0.0",
    revision: "l3",
    title: "CMMC Implementation Planner \u2014 Level 3 (Enhanced)",
    description: "Phased approach to CMMC Level 3 compliance. Builds on existing L2 certification with 23 enhanced security requirements from NIST SP 800-172/172A designed to defend against Advanced Persistent Threats (APTs). Assessment performed by DIBCAC, not C3PAO.",
    projectPlanMapping: {
        phaseCategories: {
            "l3-phase-0": "L3 Readiness",
            "l3-phase-1": "Enhanced Governance",
            "l3-phase-2": "Enhanced Access & Identity",
            "l3-phase-3": "Enhanced Detection & Response",
            "l3-phase-4": "Enhanced Network & Comms",
            "l3-phase-5": "Enhanced Risk & Assessment",
            "l3-phase-6": "DIBCAC Preparation"
        }
    },
    phases: [
        {
            id: "l3-phase-0", name: "L3 Readiness & Gap Assessment",
            description: "Validate L2 posture, assess L3 gaps, establish enhanced security program governance, and brief leadership on DIBCAC assessment requirements. Your L2 certification is the foundation \u2014 this phase identifies what must be elevated to APT-defense grade.",
            duration: "3-4 weeks", icon: "foundation", color: "#f87171",
            milestones: [
                {
                    id: "l3-m0-1", name: "L2 Posture Validation & L3 Program Charter",
                    description: "Confirm L2 certification is current and establish L3 program governance",
                    tasks: [
                        {
                            id: "l3-t0-1-1", name: "Validate current L2 certification and SPRS score",
                            description: "Confirm L2 is current, SPRS score is 110, and all POA&Ms are closed before pursuing L3",
                            controls: [], priority: "critical", effort: "medium",
                            projectPlan: { category: "L3 Readiness", subcategory: "Validation", week: 1, taskId: "L3-T0.1", owner: "CMMC Lead", accountable: "Exec Sponsor", deliverable: "L2 Validation Report" },
                            guidance: {
                                steps: [
                                    "Verify L2 certification is current and not expired",
                                    "Confirm SPRS score is 110 (perfect) \u2014 L3 requires full L2 compliance",
                                    "Verify all L2 POA&M items are closed (no open items allowed for L3)",
                                    "Review L2 assessment findings for any areas needing strengthening",
                                    "Confirm SSP is current and reflects actual implementation",
                                    "Validate continuous monitoring is operational"
                                ],
                                artifacts: ["L2 Validation Report", "SPRS Score Confirmation", "POA&M Closure Report"]
                            }
                        },
                        {
                            id: "l3-t0-1-2", name: "Executive briefing on CMMC L3 and DIBCAC process",
                            description: "Brief leadership on L3 requirements: 23 enhanced controls, APT focus, DIBCAC assessment (not C3PAO)",
                            controls: [], priority: "critical", effort: "medium",
                            projectPlan: { category: "L3 Readiness", subcategory: "Program Management", week: 1, taskId: "L3-T0.2", owner: "CMMC Lead", accountable: "Exec Sponsor", deliverable: "L3 Executive Briefing" },
                            guidance: {
                                steps: [
                                    "Explain L3 is assessed by DIBCAC (Defense Industrial Base Cybersecurity Assessment Center), not C3PAO",
                                    "Present 23 enhanced controls across 9 families from NIST 800-172",
                                    "Emphasize APT defense focus: dual authorization, threat hunting, penetration testing",
                                    "Discuss budget: significantly higher than L2 ($500K-$2M+ depending on scope)",
                                    "Explain DIBCAC scheduling process (government-initiated, longer timeline)",
                                    "Highlight that L3 is only required for contracts with highest-sensitivity CUI",
                                    "Obtain executive commitment and resource allocation"
                                ],
                                keyDifferences: [
                                    { aspect: "Assessor", l2: "C3PAO (commercial)", l3: "DIBCAC (government)" },
                                    { aspect: "Controls", l2: "110 practices (NIST 800-171)", l3: "+23 enhanced (NIST 800-172)" },
                                    { aspect: "Focus", l2: "Good cyber hygiene", l3: "APT defense" },
                                    { aspect: "Cost", l2: "$50K-$150K assessment", l3: "Government-funded assessment" },
                                    { aspect: "Prerequisite", l2: "None", l3: "L2 certification required" }
                                ],
                                artifacts: ["L3 Executive Briefing", "Budget Estimate", "DIBCAC Process Overview"]
                            }
                        },
                        {
                            id: "l3-t0-1-3", name: "Establish L3 program governance and appoint enhanced security team",
                            description: "Form dedicated L3 team with APT defense expertise \u2014 this requires specialized skills beyond L2",
                            controls: [], priority: "critical", effort: "medium",
                            projectPlan: { category: "L3 Readiness", subcategory: "Program Management", week: 1, taskId: "L3-T0.3", owner: "Exec Sponsor", accountable: "Exec Sponsor", deliverable: "L3 Program Charter" },
                            guidance: {
                                steps: [
                                    "Appoint L3 Program Lead (CISO-level or senior security architect)",
                                    "Identify or hire threat hunting expertise (3.14.3e, 3.14.6e)",
                                    "Identify or hire penetration testing capability (3.12.1e)",
                                    "Ensure SOC/SIEM team can support enhanced monitoring (3.14.1e, 3.14.2e)",
                                    "Establish L3 steering committee (subset of L2 committee + security specialists)",
                                    "Define L3 implementation timeline (12-18 months typical)",
                                    "Allocate dedicated budget for enhanced security tools and personnel"
                                ],
                                artifacts: ["L3 Program Charter", "Team Roster", "Budget Allocation"]
                            }
                        }
                    ]
                },
                {
                    id: "l3-m0-2", name: "L3 Gap Assessment",
                    description: "Assess current posture against all 23 enhanced controls and 59 objectives",
                    tasks: [
                        {
                            id: "l3-t0-2-1", name: "Conduct L3 gap assessment against NIST 800-172A objectives",
                            description: "Systematically evaluate each of the 59 L3 assessment objectives to identify gaps",
                            controls: ["3.12.1e"], priority: "critical", effort: "high",
                            projectPlan: { category: "L3 Readiness", subcategory: "Gap Assessment", week: 2, taskId: "L3-T0.4", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "L3 Gap Assessment Report" },
                            guidance: {
                                steps: [
                                    "Review each of 23 enhanced controls across 9 families",
                                    "Assess each of 59 assessment objectives (met / not met / partial)",
                                    "Identify controls with no existing capability (likely: threat hunting, pen testing, dual auth)",
                                    "Identify controls partially met by L2 implementation (likely: enhanced monitoring, config mgmt)",
                                    "Estimate remediation effort and cost per gap",
                                    "Prioritize by risk and implementation dependency",
                                    "Create L3 implementation roadmap based on gap findings"
                                ],
                                familyBreakdown: [
                                    { family: "AC", controls: 3, objectives: 7, focus: "Dual authorization, org-controlled resources, network segmentation" },
                                    { family: "AT", controls: 2, objectives: 4, focus: "Practical exercises, APT-focused training" },
                                    { family: "AU", controls: 2, objectives: 4, focus: "Session audit, cross-org audit coordination" },
                                    { family: "CM", controls: 3, objectives: 6, focus: "Unauthorized changes detection, automation, restrict software" },
                                    { family: "IA", controls: 3, objectives: 7, focus: "Replay-resistant auth, biometrics, device attestation" },
                                    { family: "IR", controls: 2, objectives: 4, focus: "SOC capability, automated IR" },
                                    { family: "RA", controls: 3, objectives: 9, focus: "Threat hunting, vuln scanning, supply chain risk" },
                                    { family: "SC", controls: 2, objectives: 5, focus: "Network isolation, encrypted channels" },
                                    { family: "SI", controls: 3, objectives: 13, focus: "Threat intelligence, automated response, sandboxing" }
                                ],
                                artifacts: ["L3 Gap Assessment Report", "Remediation Roadmap", "Cost Estimate"]
                            }
                        },
                        {
                            id: "l3-t0-2-2", name: "Assess current threat detection and response maturity",
                            description: "Evaluate SOC, SIEM, threat hunting, and incident response capabilities against L3 requirements",
                            controls: ["3.14.1e", "3.14.2e", "3.14.3e", "3.6.1e"], priority: "critical", effort: "high",
                            projectPlan: { category: "L3 Readiness", subcategory: "Gap Assessment", week: 3, taskId: "L3-T0.5", owner: "SecOps", accountable: "CMMC Lead", deliverable: "Detection Maturity Assessment" },
                            guidance: {
                                steps: [
                                    "Evaluate current SIEM coverage and detection rules",
                                    "Assess threat hunting capability (do you have dedicated hunters?)",
                                    "Review incident response automation and playbooks",
                                    "Evaluate SOC staffing and 24/7 coverage capability",
                                    "Assess threat intelligence integration (STIX/TAXII feeds)",
                                    "Review malware analysis and sandboxing capability",
                                    "Identify gaps in APT detection (lateral movement, C2, exfiltration)"
                                ],
                                artifacts: ["Detection Maturity Assessment", "SOC Capability Report", "Tool Gap Analysis"]
                            }
                        }
                    ]
                },
                {
                    id: "l3-m0-3", name: "Enhanced Security Training",
                    description: "Deploy APT-focused security training immediately \u2014 L3 personnel must understand advanced threats before enhanced controls are implemented",
                    tasks: [
                        {
                            id: "l3-t0-3-1", name: "Deploy enhanced APT-focused security awareness training",
                            description: "Create and deliver advanced security training covering APT tactics, enhanced CUI handling, and L3-specific responsibilities",
                            controls: ["3.2.1e", "3.2.2e"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "L3 Readiness", subcategory: "Training", week: 3, taskId: "L3-T0.6", owner: "CMMC Lead", accountable: "HR Mgr", deliverable: "L3 Training Program" },
                            guidance: {
                                steps: [
                                    "Develop APT-focused training content (nation-state TTPs, spear phishing, supply chain attacks)",
                                    "Create practical exercises simulating APT scenarios per 3.2.1e",
                                    "Include hands-on tabletop exercises for incident responders",
                                    "Train IT staff on enhanced monitoring and threat hunting concepts",
                                    "Cover dual authorization procedures and why they exist",
                                    "Train on enhanced CUI handling for APT-targeted environments",
                                    "Deploy training to all in-scope personnel BEFORE technical controls go live",
                                    "Establish quarterly advanced threat briefings"
                                ],
                                artifacts: ["L3 Training Content", "Practical Exercise Scenarios", "Training Records", "Tabletop Exercise Results"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "l3-phase-1", name: "Enhanced Governance & Documentation",
            description: "Update SSP for L3 scope, create enhanced security policies, establish dual authorization governance, and document APT defense strategy. All L3 controls must be documented in the SSP before DIBCAC assessment.",
            duration: "3-4 weeks", icon: "policies", color: "#fbbf24",
            milestones: [
                {
                    id: "l3-m1-1", name: "SSP Enhancement for L3",
                    description: "Extend existing L2 SSP to cover all 23 enhanced controls",
                    tasks: [
                        {
                            id: "l3-t1-1-1", name: "Extend SSP to cover NIST 800-172 enhanced controls",
                            description: "Add L3 control descriptions, implementation details, and assessment objectives to existing SSP",
                            controls: [], priority: "critical", effort: "high",
                            projectPlan: { category: "Enhanced Governance", subcategory: "Documentation", week: 5, taskId: "L3-T1.1", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "Enhanced SSP" },
                            guidance: {
                                steps: [
                                    "Add NIST 800-172 section to existing SSP",
                                    "Document each of 23 enhanced controls with implementation approach",
                                    "Map enhanced controls to existing L2 controls they build upon",
                                    "Document APT threat model and defense-in-depth strategy",
                                    "Include enhanced monitoring architecture",
                                    "Document dual authorization procedures and approvers",
                                    "Add threat hunting program description",
                                    "Document penetration testing methodology and schedule"
                                ],
                                artifacts: ["Enhanced SSP", "APT Threat Model", "L3 Control Mapping"]
                            }
                        },
                        {
                            id: "l3-t1-1-2", name: "Create enhanced security policies for L3 controls",
                            description: "Develop policies specifically addressing APT defense, dual authorization, threat hunting, and enhanced monitoring",
                            controls: [], priority: "critical", effort: "high",
                            projectPlan: { category: "Enhanced Governance", subcategory: "Policy", week: 5, taskId: "L3-T1.2", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "L3 Security Policies" },
                            guidance: {
                                steps: [
                                    "Create Dual Authorization Policy (defines critical operations, approvers, exceptions)",
                                    "Create Threat Hunting Policy (scope, frequency, methodology, reporting)",
                                    "Create Enhanced Incident Response Policy (SOC requirements, automation, APT playbooks)",
                                    "Create Penetration Testing Policy (scope, frequency, rules of engagement)",
                                    "Create Enhanced Configuration Management Policy (automated detection, whitelisting)",
                                    "Update existing L2 policies to reference L3 enhancements",
                                    "Establish policy review cadence (at least annually)"
                                ],
                                artifacts: ["Dual Authorization Policy", "Threat Hunting Policy", "Enhanced IR Policy", "Pen Test Policy"]
                            }
                        }
                    ]
                },
                {
                    id: "l3-m1-2", name: "Personnel Security Enhancement",
                    description: "Implement enhanced personnel security controls for APT defense",
                    tasks: [
                        {
                            id: "l3-t1-2-1", name: "Implement enhanced personnel security screening and access controls",
                            description: "Establish enhanced screening for personnel with access to critical CUI systems, implement separation of duties",
                            controls: ["3.9.1e", "3.9.2e"],
                            priority: "high", effort: "medium",
                            projectPlan: { category: "Enhanced Governance", subcategory: "Personnel", week: 6, taskId: "L3-T1.3", owner: "HR Mgr", accountable: "CMMC Lead", deliverable: "Enhanced Personnel Security Program" },
                            guidance: {
                                steps: [
                                    "Define critical CUI positions requiring enhanced screening per 3.9.1e",
                                    "Implement additional background investigation requirements beyond L2",
                                    "Establish separation of duties for critical security functions per 3.9.2e",
                                    "Create insider threat indicators specific to APT recruitment/coercion",
                                    "Implement enhanced access review for privileged users (monthly vs quarterly)",
                                    "Document personnel security procedures in SSP"
                                ],
                                artifacts: ["Enhanced Screening Requirements", "Separation of Duties Matrix", "Insider Threat Indicators"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "l3-phase-2", name: "Enhanced Access Control & Identity",
            description: "Implement dual authorization, restrict to organization-controlled resources, deploy replay-resistant authentication, and enforce network segmentation to limit APT lateral movement.",
            duration: "4-6 weeks", icon: "access", color: "#34d399",
            milestones: [
                {
                    id: "l3-m2-1", name: "Enhanced Access Control (AC)",
                    description: "Implement dual authorization, org-controlled resources, and enhanced network segmentation",
                    tasks: [
                        {
                            id: "l3-t2-1-1", name: "Implement dual authorization for critical operations",
                            description: "Require two authorized individuals to approve execution of critical or sensitive operations",
                            controls: ["3.1.1e"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Enhanced Access", subcategory: "Dual Authorization", week: 8, taskId: "L3-T2.1", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Dual Auth Configuration" },
                            guidance: {
                                steps: [
                                    "Define critical operations requiring dual authorization (delete CUI, modify security configs, export data, disable monitoring)",
                                    "Configure Azure PIM with approval workflows requiring 2 approvers",
                                    "Implement break-glass procedures with dual authorization",
                                    "Configure privileged access workstations (PAWs) for dual-auth operations",
                                    "Implement audit logging for all dual authorization events",
                                    "Test dual authorization workflows with tabletop exercises",
                                    "Document exception and emergency procedures"
                                ],
                                artifacts: ["Critical Operations List", "Dual Auth Config", "PAW Deployment Guide", "Exception Procedures"]
                            }
                        },
                        {
                            id: "l3-t2-1-2", name: "Restrict access to organization-controlled resources only",
                            description: "Ensure CUI systems are only accessible from org-owned, provisioned, or issued devices",
                            controls: ["3.1.2e"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Enhanced Access", subcategory: "Device Control", week: 9, taskId: "L3-T2.2", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Device Restriction Config" },
                            guidance: {
                                steps: [
                                    "Inventory all organization-owned/provisioned devices",
                                    "Configure Conditional Access policies to block non-compliant devices",
                                    "Implement device compliance requirements (Intune, JAMF)",
                                    "Block personal device access to CUI systems (no BYOD for CUI)",
                                    "Deploy certificate-based device authentication",
                                    "Configure network access control (NAC) to enforce device compliance",
                                    "Implement device health attestation checks"
                                ],
                                artifacts: ["Device Inventory", "Conditional Access Policies", "NAC Configuration", "Compliance Policies"]
                            }
                        },
                        {
                            id: "l3-t2-1-3", name: "Implement enhanced network segmentation for CUI isolation",
                            description: "Segment network to limit APT lateral movement and isolate CUI processing",
                            controls: ["3.1.3e"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Enhanced Access", subcategory: "Segmentation", week: 10, taskId: "L3-T2.3", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Network Segmentation Design" },
                            guidance: {
                                steps: [
                                    "Design micro-segmentation architecture for CUI systems",
                                    "Implement zero-trust network access (ZTNA) for CUI resources",
                                    "Deploy next-gen firewall rules between CUI and non-CUI segments",
                                    "Implement east-west traffic inspection within CUI segment",
                                    "Configure jump servers / bastion hosts for administrative access",
                                    "Deploy network monitoring for lateral movement detection",
                                    "Test segmentation with penetration testing"
                                ],
                                artifacts: ["Segmentation Architecture", "Firewall Rules", "ZTNA Config", "Pen Test Results"]
                            }
                        }
                    ]
                },
                {
                    id: "l3-m2-2", name: "Enhanced Identification & Authentication (IA)",
                    description: "Implement replay-resistant authentication, hardware-based authenticators, and device attestation",
                    tasks: [
                        {
                            id: "l3-t2-2-1", name: "Deploy replay-resistant and phishing-resistant authentication",
                            description: "Implement FIDO2/WebAuthn or certificate-based authentication resistant to replay and phishing attacks",
                            controls: ["3.5.1e"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Enhanced Access", subcategory: "Authentication", week: 11, taskId: "L3-T2.4", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Phishing-Resistant Auth" },
                            guidance: {
                                steps: [
                                    "Deploy FIDO2 security keys (YubiKey 5, Feitian) for all privileged users",
                                    "Configure Windows Hello for Business with hardware TPM",
                                    "Implement certificate-based authentication for service accounts",
                                    "Disable legacy authentication protocols (NTLM, basic auth)",
                                    "Configure Entra ID to require phishing-resistant MFA for CUI access",
                                    "Implement Conditional Access policies enforcing FIDO2/WHfB",
                                    "Test authentication flows and document fallback procedures"
                                ],
                                artifacts: ["FIDO2 Deployment Plan", "Auth Policy Config", "Legacy Protocol Audit", "Fallback Procedures"]
                            }
                        },
                        {
                            id: "l3-t2-2-2", name: "Implement biometric or hardware-token authentication for critical systems",
                            description: "Deploy hardware-based authenticators with biometric verification for highest-sensitivity operations",
                            controls: ["3.5.2e"],
                            priority: "high", effort: "high",
                            projectPlan: { category: "Enhanced Access", subcategory: "Authentication", week: 12, taskId: "L3-T2.5", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Biometric Auth Deployment" },
                            guidance: {
                                steps: [
                                    "Identify systems requiring biometric/hardware-token authentication",
                                    "Deploy biometric readers or FIDO2 keys with fingerprint (YubiKey Bio)",
                                    "Configure Windows Hello for Business with biometric enrollment",
                                    "Implement biometric authentication for PAW access",
                                    "Establish enrollment and revocation procedures",
                                    "Configure backup authentication for biometric failures",
                                    "Document biometric data handling and privacy controls"
                                ],
                                artifacts: ["Biometric Deployment Plan", "Enrollment Procedures", "Privacy Controls"]
                            }
                        },
                        {
                            id: "l3-t2-2-3", name: "Implement device attestation and identity binding",
                            description: "Bind user identity to specific devices and implement device health attestation",
                            controls: ["3.5.3e"],
                            priority: "high", effort: "high",
                            projectPlan: { category: "Enhanced Access", subcategory: "Authentication", week: 13, taskId: "L3-T2.6", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Device Attestation Config" },
                            guidance: {
                                steps: [
                                    "Implement TPM-based device attestation for CUI workstations",
                                    "Configure Intune device compliance with health attestation",
                                    "Bind user identities to registered devices (device-user affinity)",
                                    "Implement Conditional Access requiring compliant + registered device",
                                    "Deploy certificate-based device identity (SCEP/PKCS)",
                                    "Monitor for device identity anomalies (new device, location change)",
                                    "Establish device lifecycle management procedures"
                                ],
                                artifacts: ["Device Attestation Config", "Compliance Policies", "Device Lifecycle SOP"]
                            }
                        }
                    ]
                },
                {
                    id: "l3-m2-3", name: "Physical Protection Enhancement",
                    description: "Implement enhanced physical protection for CUI processing facilities",
                    tasks: [
                        {
                            id: "l3-t2-3-1", name: "Implement enhanced physical security for critical CUI systems",
                            description: "Deploy additional physical protections for systems processing highest-sensitivity CUI",
                            controls: ["3.10.1e"],
                            priority: "high", effort: "medium",
                            projectPlan: { category: "Enhanced Access", subcategory: "Physical Security", week: 13, taskId: "L3-T2.7", owner: "FSO", accountable: "CMMC Lead", deliverable: "Enhanced Physical Security Plan" },
                            guidance: {
                                steps: [
                                    "Identify facilities housing critical CUI processing systems",
                                    "Implement additional access controls (mantrap, biometric, dual-person integrity)",
                                    "Deploy tamper-evident seals on critical hardware",
                                    "Implement CCTV monitoring with retention for critical areas",
                                    "Establish visitor escort procedures for sensitive areas",
                                    "Conduct physical penetration testing",
                                    "Document enhanced physical security in SSP"
                                ],
                                artifacts: ["Enhanced Physical Security Plan", "CCTV Coverage Map", "Physical Pen Test Results"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "l3-phase-3", name: "Enhanced Detection, Monitoring & Response",
            description: "Deploy advanced threat detection, establish threat hunting program, implement automated incident response, and build SOC capability. This is the core of L3 \u2014 defending against APTs requires proactive detection, not just reactive controls.",
            duration: "6-8 weeks", icon: "monitoring", color: "#a78bfa",
            milestones: [
                {
                    id: "l3-m3-1", name: "Enhanced System & Information Integrity (SI)",
                    description: "Deploy advanced threat detection, automated response, threat hunting, and sandboxing",
                    tasks: [
                        {
                            id: "l3-t3-1-1", name: "Deploy advanced threat detection and automated response",
                            description: "Implement SOAR, automated containment, and advanced malware detection beyond L2 EDR",
                            controls: ["3.14.1e", "3.14.2e"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Enhanced Detection", subcategory: "Threat Detection", week: 15, taskId: "L3-T3.1", owner: "SecOps", accountable: "CMMC Lead", deliverable: "Advanced Detection Platform" },
                            guidance: {
                                steps: [
                                    "Deploy SOAR platform (Sentinel SOAR, Splunk SOAR, Palo Alto XSOAR)",
                                    "Create automated containment playbooks (isolate host, disable account, block IP)",
                                    "Implement advanced malware detection (sandboxing, behavioral analysis)",
                                    "Deploy network detection and response (NDR) for east-west traffic",
                                    "Configure automated threat intelligence enrichment",
                                    "Implement deception technology (honeypots, honeytokens) for APT detection",
                                    "Establish automated alerting with severity-based escalation",
                                    "Test automated response playbooks with purple team exercises"
                                ],
                                artifacts: ["SOAR Playbooks", "Detection Rules", "NDR Config", "Deception Deployment"]
                            }
                        },
                        {
                            id: "l3-t3-1-2", name: "Establish threat hunting program",
                            description: "Create proactive threat hunting capability to identify APT activity that evades automated detection",
                            controls: ["3.14.3e", "3.14.6e"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Enhanced Detection", subcategory: "Threat Hunting", week: 17, taskId: "L3-T3.2", owner: "SecOps", accountable: "CMMC Lead", deliverable: "Threat Hunting Program" },
                            guidance: {
                                steps: [
                                    "Hire or contract dedicated threat hunters (minimum 1 FTE or managed service)",
                                    "Establish threat hunting methodology (hypothesis-driven, intel-driven, anomaly-based)",
                                    "Create hunt playbooks for common APT TTPs (MITRE ATT&CK aligned)",
                                    "Implement threat hunting tools (Jupyter notebooks, SIEM queries, EDR telemetry)",
                                    "Establish hunt cadence (weekly focused hunts, monthly comprehensive)",
                                    "Integrate threat intelligence feeds (CISA, DIB-ISAC, commercial)",
                                    "Document findings and convert successful hunts into automated detections",
                                    "Report hunt findings to leadership monthly"
                                ],
                                artifacts: ["Threat Hunting Program Charter", "Hunt Playbooks", "MITRE ATT&CK Coverage Map", "Hunt Reports"]
                            }
                        },
                        {
                            id: "l3-t3-1-3", name: "Deploy sandboxing and advanced malware analysis",
                            description: "Implement automated sandboxing for suspicious files and URLs, with behavioral analysis",
                            controls: ["3.14.4e", "3.14.5e"],
                            priority: "high", effort: "high",
                            projectPlan: { category: "Enhanced Detection", subcategory: "Malware Analysis", week: 19, taskId: "L3-T3.3", owner: "SecOps", accountable: "CMMC Lead", deliverable: "Sandbox Deployment" },
                            guidance: {
                                steps: [
                                    "Deploy email sandboxing (Defender for Office 365 Safe Attachments, FireEye)",
                                    "Implement web proxy with URL sandboxing",
                                    "Deploy endpoint sandboxing for downloaded files",
                                    "Configure automated submission of suspicious samples",
                                    "Implement behavioral analysis for zero-day detection",
                                    "Integrate sandbox results with SIEM/SOAR for automated response",
                                    "Establish malware analysis procedures for novel threats"
                                ],
                                artifacts: ["Sandbox Architecture", "Analysis Procedures", "Integration Config"]
                            }
                        }
                    ]
                },
                {
                    id: "l3-m3-2", name: "Enhanced Incident Response (IR)",
                    description: "Establish SOC capability and automated incident response for APT scenarios",
                    tasks: [
                        {
                            id: "l3-t3-2-1", name: "Establish or enhance SOC capability for APT defense",
                            description: "Build 24/7 SOC capability (in-house or managed) with APT detection focus",
                            controls: ["3.6.1e"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Enhanced Detection", subcategory: "SOC", week: 16, taskId: "L3-T3.4", owner: "SecOps", accountable: "CMMC Lead", deliverable: "SOC Operations Plan" },
                            guidance: {
                                steps: [
                                    "Evaluate build vs. buy for SOC (in-house vs. MSSP/MDR)",
                                    "Ensure 24/7 monitoring coverage for CUI systems",
                                    "Implement tiered alert handling (L1 triage, L2 investigation, L3 hunt)",
                                    "Create APT-specific incident response playbooks",
                                    "Establish communication procedures with DIBCAC and DC3",
                                    "Implement forensic readiness (disk imaging, memory capture, network capture)",
                                    "Conduct APT tabletop exercises quarterly",
                                    "Establish metrics: MTTD, MTTR, false positive rate"
                                ],
                                artifacts: ["SOC Operations Plan", "APT Playbooks", "Forensic Readiness Plan", "SOC Metrics Dashboard"]
                            }
                        },
                        {
                            id: "l3-t3-2-2", name: "Implement automated incident response capabilities",
                            description: "Deploy automated containment, eradication, and recovery procedures for common APT scenarios",
                            controls: ["3.6.2e"],
                            priority: "high", effort: "high",
                            projectPlan: { category: "Enhanced Detection", subcategory: "Automated IR", week: 18, taskId: "L3-T3.5", owner: "SecOps", accountable: "CMMC Lead", deliverable: "Automated IR Playbooks" },
                            guidance: {
                                steps: [
                                    "Create automated containment playbooks (network isolation, account disable, session kill)",
                                    "Implement automated evidence preservation (snapshot, log freeze)",
                                    "Deploy automated malware quarantine and remediation",
                                    "Configure automated notification chains (SOC > CMMC Lead > DIBCAC)",
                                    "Implement automated recovery procedures (re-image, restore from backup)",
                                    "Test all automated playbooks with red team exercises",
                                    "Document manual override procedures for automated responses"
                                ],
                                artifacts: ["Automated Playbooks", "Recovery Procedures", "Red Team Exercise Results"]
                            }
                        }
                    ]
                },
                {
                    id: "l3-m3-3", name: "Enhanced Audit & Accountability (AU)",
                    description: "Implement session-level audit and cross-organizational audit coordination",
                    tasks: [
                        {
                            id: "l3-t3-3-1", name: "Implement enhanced audit logging and session monitoring",
                            description: "Deploy session recording, enhanced audit correlation, and cross-org audit sharing",
                            controls: ["3.3.1e", "3.3.2e"],
                            priority: "high", effort: "high",
                            projectPlan: { category: "Enhanced Detection", subcategory: "Audit", week: 17, taskId: "L3-T3.6", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Enhanced Audit Config" },
                            guidance: {
                                steps: [
                                    "Implement session recording for privileged access (CyberArk, BeyondTrust)",
                                    "Deploy user and entity behavior analytics (UEBA) for anomaly detection",
                                    "Configure enhanced audit correlation across all CUI systems",
                                    "Implement cross-organizational audit log sharing where required",
                                    "Deploy data loss prevention (DLP) audit logging",
                                    "Configure real-time alerting for high-risk audit events",
                                    "Establish audit log integrity verification (hash chains, immutable storage)"
                                ],
                                artifacts: ["Session Recording Config", "UEBA Rules", "Cross-Org Audit Agreements", "DLP Audit Config"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "l3-phase-4", name: "Enhanced Network, Comms & Configuration",
            description: "Implement network isolation, encrypted channels, automated configuration monitoring, and software whitelisting to harden the environment against APT persistence and lateral movement.",
            duration: "4-5 weeks", icon: "network", color: "#60a5fa",
            milestones: [
                {
                    id: "l3-m4-1", name: "Enhanced System & Communications Protection (SC)",
                    description: "Implement network isolation and encrypted communication channels",
                    tasks: [
                        {
                            id: "l3-t4-1-1", name: "Implement network isolation and boundary defense",
                            description: "Deploy enhanced network isolation to contain APT lateral movement and protect CUI processing",
                            controls: ["3.13.1e"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Enhanced Network", subcategory: "Isolation", week: 22, taskId: "L3-T4.1", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Network Isolation Architecture" },
                            guidance: {
                                steps: [
                                    "Implement micro-segmentation for CUI processing systems",
                                    "Deploy application-aware firewalls between segments",
                                    "Implement deny-all, permit-by-exception for CUI segment",
                                    "Deploy network monitoring for anomalous traffic patterns",
                                    "Implement DNS filtering and sinkholing for C2 detection",
                                    "Configure network-based DLP at segment boundaries",
                                    "Test isolation with penetration testing from adjacent segments"
                                ],
                                artifacts: ["Isolation Architecture", "Firewall Rules", "DLP Config", "Pen Test Results"]
                            }
                        },
                        {
                            id: "l3-t4-1-2", name: "Implement encrypted communication channels",
                            description: "Deploy FIPS-validated encryption for all CUI communications with enhanced key management",
                            controls: ["3.13.2e"],
                            priority: "high", effort: "medium",
                            projectPlan: { category: "Enhanced Network", subcategory: "Encryption", week: 23, taskId: "L3-T4.2", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Encryption Architecture" },
                            guidance: {
                                steps: [
                                    "Verify all CUI communications use FIPS 140-2/3 validated encryption",
                                    "Implement TLS 1.3 for all web-based CUI access",
                                    "Deploy IPSec VPN with FIPS-validated modules for site-to-site",
                                    "Implement encrypted email (S/MIME or equivalent) for CUI",
                                    "Deploy hardware security modules (HSM) for key management",
                                    "Implement certificate lifecycle management",
                                    "Conduct cryptographic assessment and document in SSP"
                                ],
                                artifacts: ["Encryption Architecture", "FIPS Validation Certificates", "Key Management SOP"]
                            }
                        }
                    ]
                },
                {
                    id: "l3-m4-2", name: "Enhanced Configuration Management (CM)",
                    description: "Implement automated unauthorized change detection, software whitelisting, and enhanced baselines",
                    tasks: [
                        {
                            id: "l3-t4-2-1", name: "Deploy automated unauthorized change detection",
                            description: "Implement file integrity monitoring and automated detection of unauthorized configuration changes",
                            controls: ["3.4.1e"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Enhanced Network", subcategory: "Config Mgmt", week: 24, taskId: "L3-T4.3", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "FIM Deployment" },
                            guidance: {
                                steps: [
                                    "Deploy file integrity monitoring (FIM) on all CUI systems (Tripwire, OSSEC, Wazuh)",
                                    "Configure FIM to monitor critical system files, configs, and registries",
                                    "Implement automated alerting for unauthorized changes",
                                    "Configure baseline comparison and drift detection",
                                    "Integrate FIM alerts with SIEM/SOAR for automated response",
                                    "Establish change management process to whitelist authorized changes",
                                    "Conduct weekly FIM review and monthly baseline reconciliation"
                                ],
                                artifacts: ["FIM Deployment Config", "Monitored Files List", "Change Management SOP"]
                            }
                        },
                        {
                            id: "l3-t4-2-2", name: "Implement application whitelisting and software restriction",
                            description: "Deploy application control to prevent unauthorized software execution on CUI systems",
                            controls: ["3.4.2e", "3.4.3e"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Enhanced Network", subcategory: "Config Mgmt", week: 25, taskId: "L3-T4.4", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "App Whitelisting Config" },
                            guidance: {
                                steps: [
                                    "Deploy Windows Defender Application Control (WDAC) or AppLocker",
                                    "Create application whitelist based on business requirements",
                                    "Implement code signing requirements for internal applications",
                                    "Block execution from user-writable directories",
                                    "Implement DLL whitelisting for critical applications",
                                    "Configure audit mode first, then enforce after validation",
                                    "Establish exception request and approval process",
                                    "Monitor for bypass attempts and update rules accordingly"
                                ],
                                artifacts: ["Application Whitelist", "WDAC Policies", "Exception Process", "Bypass Monitoring Rules"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "l3-phase-5", name: "Enhanced Risk & Security Assessment",
            description: "Implement threat-informed risk assessment, advanced vulnerability management, supply chain risk assessment, and penetration testing program. These controls validate that all other L3 controls are effective against real-world APT tactics.",
            duration: "4-6 weeks", icon: "risk", color: "#fb923c",
            milestones: [
                {
                    id: "l3-m5-1", name: "Enhanced Risk Assessment (RA)",
                    description: "Implement threat-informed risk assessment, advanced vuln management, and supply chain risk",
                    tasks: [
                        {
                            id: "l3-t5-1-1", name: "Implement threat-informed risk assessment program",
                            description: "Conduct risk assessments informed by current threat intelligence and APT TTPs",
                            controls: ["3.11.1e"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Enhanced Risk", subcategory: "Risk Assessment", week: 28, taskId: "L3-T5.1", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "Threat-Informed Risk Assessment" },
                            guidance: {
                                steps: [
                                    "Integrate threat intelligence into risk assessment methodology",
                                    "Map APT TTPs (MITRE ATT&CK) to organizational risk scenarios",
                                    "Conduct threat modeling for CUI processing workflows",
                                    "Assess likelihood based on current threat landscape (not just generic)",
                                    "Evaluate impact considering APT objectives (exfiltration, disruption)",
                                    "Update risk register with APT-specific scenarios",
                                    "Conduct risk assessment quarterly (vs annually for L2)"
                                ],
                                artifacts: ["Threat-Informed Risk Assessment", "APT Risk Scenarios", "MITRE ATT&CK Mapping"]
                            }
                        },
                        {
                            id: "l3-t5-1-2", name: "Implement advanced vulnerability management",
                            description: "Deploy continuous vulnerability scanning with threat-intelligence-driven prioritization",
                            controls: ["3.11.2e", "3.11.3e"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Enhanced Risk", subcategory: "Vulnerability Mgmt", week: 29, taskId: "L3-T5.2", owner: "SecOps", accountable: "CMMC Lead", deliverable: "Advanced Vuln Mgmt Program" },
                            guidance: {
                                steps: [
                                    "Deploy continuous (not just monthly) vulnerability scanning",
                                    "Implement threat-intelligence-driven vulnerability prioritization (EPSS, KEV)",
                                    "Integrate vulnerability data with asset criticality and CUI exposure",
                                    "Establish SLAs: critical 24h, high 7d, medium 30d, low 90d",
                                    "Implement automated patching for standard systems",
                                    "Deploy vulnerability validation (confirm exploitability)",
                                    "Report vulnerability trends to leadership weekly"
                                ],
                                artifacts: ["Vuln Mgmt Program", "Scanning Config", "Prioritization Framework", "SLA Documentation"]
                            }
                        },
                        {
                            id: "l3-t5-1-3", name: "Implement supply chain risk assessment",
                            description: "Assess and manage cybersecurity risks from suppliers and third-party components",
                            controls: ["3.11.4e", "3.11.5e", "3.11.6e", "3.11.7e"],
                            priority: "high", effort: "high",
                            projectPlan: { category: "Enhanced Risk", subcategory: "Supply Chain", week: 30, taskId: "L3-T5.3", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "Supply Chain Risk Assessment" },
                            guidance: {
                                steps: [
                                    "Inventory all suppliers with access to CUI or CUI systems",
                                    "Assess supplier cybersecurity posture (questionnaires, audits, certifications)",
                                    "Evaluate software supply chain risks (SBOMs, dependency analysis)",
                                    "Implement supplier monitoring for security incidents",
                                    "Establish contractual security requirements for suppliers",
                                    "Create supplier risk register and review quarterly",
                                    "Implement software composition analysis for third-party code"
                                ],
                                artifacts: ["Supplier Inventory", "Risk Assessment Reports", "Contractual Requirements", "SBOM Analysis"]
                            }
                        }
                    ]
                },
                {
                    id: "l3-m5-2", name: "Enhanced Security Assessment (CA)",
                    description: "Implement penetration testing program to validate L3 controls",
                    tasks: [
                        {
                            id: "l3-t5-2-1", name: "Establish penetration testing program",
                            description: "Implement regular penetration testing to validate L3 controls are effective against APT TTPs",
                            controls: ["3.12.1e"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Enhanced Risk", subcategory: "Pen Testing", week: 31, taskId: "L3-T5.4", owner: "SecOps", accountable: "CMMC Lead", deliverable: "Pen Test Program" },
                            guidance: {
                                steps: [
                                    "Engage qualified penetration testing firm (CREST, OSCP certified)",
                                    "Define scope: all CUI systems, network segments, applications",
                                    "Conduct network penetration testing (external and internal)",
                                    "Conduct application penetration testing for CUI applications",
                                    "Perform social engineering testing (phishing, vishing, physical)",
                                    "Conduct red team exercise simulating APT TTPs",
                                    "Remediate findings and retest within 30 days",
                                    "Establish annual pen test cadence (minimum), quarterly for critical systems"
                                ],
                                artifacts: ["Pen Test Report", "Remediation Plan", "Retest Results", "Red Team Report"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "l3-phase-6", name: "DIBCAC Assessment Preparation",
            description: "Prepare for DIBCAC assessment. Unlike C3PAO for L2, DIBCAC is a government assessment team. The scheduling, process, and expectations are different. This phase ensures you are ready when DIBCAC arrives.",
            duration: "6-8 weeks", icon: "assessment", color: "#ec4899",
            milestones: [
                {
                    id: "l3-m6-1", name: "Internal L3 Readiness Assessment",
                    description: "Conduct comprehensive internal assessment against all 23 enhanced controls",
                    tasks: [
                        {
                            id: "l3-t6-1-1", name: "Conduct internal L3 mock assessment",
                            description: "Perform full internal assessment against all 59 NIST 800-172A objectives",
                            controls: [], priority: "critical", effort: "high",
                            projectPlan: { category: "DIBCAC Preparation", subcategory: "Mock Assessment", week: 34, taskId: "L3-T6.1", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "Mock Assessment Report" },
                            guidance: {
                                steps: [
                                    "Assess each of 59 objectives using NIST 800-172A assessment procedures",
                                    "Rate each objective: MET, NOT MET, or NOT APPLICABLE",
                                    "Document evidence for each MET objective",
                                    "Identify gaps and create remediation plan for NOT MET objectives",
                                    "Conduct interviews with key personnel (simulate DIBCAC interviews)",
                                    "Review all documentation for completeness and accuracy",
                                    "Test technical controls with hands-on verification",
                                    "Create findings report with remediation timeline"
                                ],
                                artifacts: ["Mock Assessment Report", "Evidence Matrix", "Remediation Plan", "Interview Notes"]
                            }
                        },
                        {
                            id: "l3-t6-1-2", name: "Remediate mock assessment findings",
                            description: "Address all gaps identified during internal mock assessment",
                            controls: [], priority: "critical", effort: "high",
                            projectPlan: { category: "DIBCAC Preparation", subcategory: "Remediation", week: 36, taskId: "L3-T6.2", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "Remediation Completion Report" },
                            guidance: {
                                steps: [
                                    "Prioritize findings by severity and DIBCAC focus areas",
                                    "Assign remediation owners and deadlines",
                                    "Implement technical fixes for NOT MET objectives",
                                    "Update documentation to address gaps",
                                    "Conduct targeted retesting of remediated controls",
                                    "Update SSP to reflect final implementation state",
                                    "Obtain management sign-off on remediation completion"
                                ],
                                artifacts: ["Remediation Completion Report", "Updated SSP", "Retest Results"]
                            }
                        }
                    ]
                },
                {
                    id: "l3-m6-2", name: "Evidence Package & DIBCAC Coordination",
                    description: "Prepare evidence package and coordinate with DIBCAC for assessment scheduling",
                    tasks: [
                        {
                            id: "l3-t6-2-1", name: "Prepare DIBCAC evidence package",
                            description: "Organize all evidence, documentation, and artifacts for DIBCAC review",
                            controls: [], priority: "critical", effort: "high",
                            projectPlan: { category: "DIBCAC Preparation", subcategory: "Evidence", week: 38, taskId: "L3-T6.3", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "Evidence Package" },
                            guidance: {
                                steps: [
                                    "Organize evidence by control family (AC, AT, AU, CM, IA, IR, RA, SC, SI)",
                                    "Create evidence cross-reference matrix (control > objective > evidence)",
                                    "Ensure all policies are signed, dated, and current",
                                    "Verify all training records are complete",
                                    "Confirm all technical configurations are documented with screenshots",
                                    "Prepare threat hunting reports and findings",
                                    "Compile penetration testing reports and remediation evidence",
                                    "Create executive summary for DIBCAC assessors",
                                    "Organize evidence in accessible repository (SharePoint, shared drive)"
                                ],
                                artifacts: ["Evidence Package", "Cross-Reference Matrix", "Executive Summary"]
                            }
                        },
                        {
                            id: "l3-t6-2-2", name: "Coordinate with DIBCAC and prepare for assessment",
                            description: "Initiate DIBCAC engagement, prepare facilities, and brief personnel on assessment process",
                            controls: [], priority: "critical", effort: "medium",
                            projectPlan: { category: "DIBCAC Preparation", subcategory: "Coordination", week: 39, taskId: "L3-T6.4", owner: "CMMC Lead", accountable: "Exec Sponsor", deliverable: "DIBCAC Coordination Plan" },
                            guidance: {
                                steps: [
                                    "Contact DIBCAC to initiate L3 assessment request",
                                    "Provide preliminary documentation package to DIBCAC",
                                    "Coordinate assessment dates and logistics",
                                    "Prepare assessment facilities (conference room, network access, projector)",
                                    "Brief all personnel on DIBCAC assessment process and expectations",
                                    "Assign POCs for each control family to support assessor interviews",
                                    "Prepare demonstration environments for technical control validation",
                                    "Conduct final readiness review 1 week before assessment"
                                ],
                                dibcacProcess: [
                                    { phase: "Pre-Assessment", description: "DIBCAC reviews documentation package, schedules on-site visit" },
                                    { phase: "On-Site Assessment", description: "DIBCAC interviews personnel, reviews evidence, tests controls (1-2 weeks)" },
                                    { phase: "Findings Review", description: "DIBCAC presents preliminary findings, org responds" },
                                    { phase: "Final Report", description: "DIBCAC issues final assessment report and certification decision" }
                                ],
                                artifacts: ["DIBCAC Coordination Plan", "Personnel Briefing", "Facility Prep Checklist", "Readiness Review"]
                            }
                        }
                    ]
                },
                {
                    id: "l3-m6-3", name: "Continuous Compliance & Steady State",
                    description: "Establish ongoing L3 compliance maintenance program",
                    tasks: [
                        {
                            id: "l3-t6-3-1", name: "Establish L3 continuous compliance program",
                            description: "Create ongoing processes to maintain L3 compliance between assessments",
                            controls: [], priority: "high", effort: "medium",
                            projectPlan: { category: "DIBCAC Preparation", subcategory: "Steady State", week: 40, taskId: "L3-T6.5", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "Continuous Compliance Plan" },
                            guidance: {
                                steps: [
                                    "Establish monthly L3 control effectiveness reviews",
                                    "Schedule quarterly threat hunting campaigns",
                                    "Schedule annual penetration testing",
                                    "Maintain threat intelligence integration and updates",
                                    "Conduct quarterly APT tabletop exercises",
                                    "Review and update SSP quarterly",
                                    "Monitor for new NIST 800-172 updates or CMMC rule changes",
                                    "Maintain DIBCAC relationship and report significant changes"
                                ],
                                artifacts: ["Continuous Compliance Plan", "Review Schedule", "Metrics Dashboard"]
                            }
                        }
                    ]
                }
            ]
        }
    ]
};
