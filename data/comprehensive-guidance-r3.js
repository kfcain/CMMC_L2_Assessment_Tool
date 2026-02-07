// Comprehensive Implementation Guidance - Rev 3 New Families + Missing AT
// Covers: AT (Awareness & Training), SR (Supply Chain Risk Management), PL (Planning)
// All vendors: AWS, Azure, GCP, Palo Alto, SentinelOne, NinjaOne, Tenable
// Keys use BOTH Rev 2 format (AT.L2-3.2.1) and Rev 3 format (AT.L2-03.02.01)

const COMPREHENSIVE_GUIDANCE_R3 = {
    version: "1.0.0",
    lastUpdated: "2026-02-06",
    description: "Guidance for AT family (Rev 2 + Rev 3) and new Rev 3 families SR, PL",
    objectives: {

        // ========================================
        // AWARENESS AND TRAINING (AT) - 3.2.x / 03.02.x
        // ========================================

        "AT.L2-3.2.1": {
            objective: "Ensure that managers, systems administrators, and users of organizational systems are made aware of the security risks associated with their activities and of the applicable policies, standards, and procedures related to the security of those systems.",
            cloud: {
                aws: {
                    services: ["AWS Security Hub","Amazon GuardDuty","AWS IAM Access Analyzer","AWS Artifact"],
                    implementation: {
                        steps: [
                            "Deploy AWS Security Hub with CIS/NIST benchmarks to generate awareness dashboards",
                            "Configure GuardDuty findings to route to security awareness distribution lists",
                            "Use AWS Artifact to distribute compliance documentation to managers",
                            "Create IAM Access Analyzer reports showing overly permissive policies for admin training",
                            "Schedule quarterly security briefings using findings from AWS Security Hub",
                            "Implement AWS Well-Architected Tool reviews as training exercises for system admins"
                        ],
                        verification: ["Review training completion records","Verify awareness materials reference current AWS security configurations","Confirm managers receive quarterly security posture briefings"],
                        cost_estimate: "$0-50/month (Security Hub free tier)",
                        effort_hours: 16
                    }
                },
                azure: {
                    services: ["Microsoft Defender for Cloud","Microsoft Secure Score","Microsoft Learn","Entra ID Identity Protection"],
                    implementation: {
                        steps: [
                            "Enable Microsoft Secure Score and share dashboards with management for awareness",
                            "Configure Defender for Cloud recommendations as training material for admins",
                            "Assign Microsoft Learn security training paths to all system users",
                            "Set up Entra ID Identity Protection risk reports for security awareness briefings",
                            "Create custom security awareness campaigns using Microsoft 365 Attack Simulation",
                            "Schedule monthly Secure Score review meetings with system administrators"
                        ],
                        verification: ["Verify Secure Score is reviewed monthly","Confirm training paths are assigned and tracked","Review attack simulation completion rates"],
                        cost_estimate: "$0-100/month (included with E5/G5)",
                        effort_hours: 12
                    }
                },
                gcp: {
                    services: ["Security Command Center","Cloud IAM Recommender","Policy Intelligence","Chronicle SIEM"],
                    implementation: {
                        steps: [
                            "Enable Security Command Center and share findings dashboards with stakeholders",
                            "Use IAM Recommender reports to train admins on least-privilege principles",
                            "Configure Policy Intelligence to generate security posture reports for management",
                            "Create Chronicle SIEM dashboards showing security trends for awareness briefings",
                            "Implement Google Cloud Skills Boost security training tracks for all users",
                            "Schedule quarterly security posture reviews using SCC vulnerability reports"
                        ],
                        verification: ["Review SCC dashboard access logs","Verify training completion in Skills Boost","Confirm quarterly briefings are documented"],
                        cost_estimate: "$0-100/month",
                        effort_hours: 14
                    }
                }
            },
            firewalls: {
                paloalto: {
                    services: ["Panorama Reporting","Threat Prevention Dashboard","URL Filtering Reports","WildFire Reports"],
                    implementation: {
                        steps: [
                            "Generate monthly Panorama threat reports and distribute to management",
                            "Create URL filtering reports showing blocked categories for user awareness training",
                            "Use WildFire malware analysis reports as real-world examples in security training",
                            "Configure automated weekly threat summary emails from Panorama to security team",
                            "Build custom dashboards in Panorama showing threat trends for awareness briefings"
                        ],
                        verification: ["Verify threat reports are distributed monthly","Confirm URL filtering data is used in training materials","Review WildFire report distribution list"],
                        cost_estimate: "Included with Panorama license",
                        effort_hours: 8
                    }
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR Dashboard","Threat Intelligence","Deep Visibility","Ranger"],
                    implementation: {
                        steps: [
                            "Generate monthly threat landscape reports from Singularity console for management briefings",
                            "Use Deep Visibility query results to demonstrate real attack patterns in training",
                            "Configure Ranger network discovery reports to show shadow IT for awareness",
                            "Create role-based dashboards: executive summary for managers, technical detail for admins",
                            "Export incident response case studies from resolved threats for training scenarios"
                        ],
                        verification: ["Verify monthly reports are generated and distributed","Confirm training materials include real threat examples","Review dashboard access by role"],
                        cost_estimate: "Included with SentinelOne license",
                        effort_hours: 6
                    }
                }
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Reporting","Patch Compliance Reports","Device Health Dashboards","Documentation"],
                    implementation: {
                        steps: [
                            "Generate monthly patch compliance reports to demonstrate security hygiene to management",
                            "Create device health dashboards showing endpoint security posture for awareness",
                            "Use NinjaOne documentation module to maintain and distribute security policies",
                            "Configure automated compliance reports sent to managers on a scheduled basis",
                            "Track and report on endpoint security agent deployment status for admin awareness"
                        ],
                        verification: ["Verify patch compliance reports are distributed monthly","Confirm security policies are accessible in documentation module","Review automated report delivery logs"],
                        cost_estimate: "Included with NinjaOne license",
                        effort_hours: 6
                    }
                }
            },
            vuln_mgmt: {
                tenable: {
                    services: ["Tenable.io Dashboards","Vulnerability Reports","Compliance Scans","VPR Scoring"],
                    implementation: {
                        steps: [
                            "Create executive vulnerability dashboards in Tenable.io for management awareness",
                            "Generate monthly vulnerability trend reports showing risk reduction progress",
                            "Use VPR (Vulnerability Priority Rating) reports to train admins on risk prioritization",
                            "Run CIS/STIG compliance scans and share results as training material for system admins",
                            "Configure automated vulnerability summary emails to stakeholders"
                        ],
                        verification: ["Verify executive dashboards are reviewed monthly","Confirm vulnerability trend reports show improvement","Review compliance scan results distribution"],
                        cost_estimate: "Included with Tenable.io license",
                        effort_hours: 8
                    }
                }
            },
            small_business: {
                approach: "Use free or low-cost security awareness training platforms combined with regular security briefings.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "KnowBe4 Free Tools", cost: "Free", purpose: "Phishing simulation and basic awareness" },
                        { name: "SANS Security Awareness", cost: "$25-50/user/year", purpose: "Comprehensive training modules" },
                        { name: "Google Phishing Quiz", cost: "Free", purpose: "Quick phishing awareness test" },
                        { name: "CISA Cybersecurity Training", cost: "Free", purpose: "Government-provided training resources" }
                    ],
                    steps: [
                        "Establish a security awareness training program with annual training requirement",
                        "Conduct monthly phishing simulations using free tools",
                        "Hold quarterly security briefings covering recent threats and policy updates",
                        "Maintain training completion records for all employees",
                        "Include security awareness in new employee onboarding"
                    ]
                }
            }
        },

        "AT.L2-3.2.2": {
            objective: "Ensure that personnel are trained to carry out their assigned information security-related duties and responsibilities.",
            cloud: {
                aws: {
                    services: ["AWS Training and Certification","AWS Skill Builder","AWS Well-Architected Labs","AWS Security Specialty"],
                    implementation: {
                        steps: [
                            "Enroll system administrators in AWS Security Specialty certification path",
                            "Assign AWS Skill Builder security-focused learning plans to technical staff",
                            "Conduct hands-on AWS Well-Architected Labs for security pillar training",
                            "Create role-specific training plans: admin, developer, auditor, manager",
                            "Document training requirements in SSP and track completion quarterly",
                            "Require AWS Cloud Practitioner as baseline for all CUI system users"
                        ],
                        verification: ["Review certification and training completion records","Verify role-specific training plans exist","Confirm quarterly training tracking reports"],
                        cost_estimate: "$0-300/person (Skill Builder subscription)",
                        effort_hours: 40
                    }
                },
                azure: {
                    services: ["Microsoft Learn","SC-200/SC-300/SC-400 Certifications","Microsoft Applied Skills","Defender Training"],
                    implementation: {
                        steps: [
                            "Assign SC-200 (Security Operations) training to SOC analysts",
                            "Assign SC-300 (Identity and Access) training to identity administrators",
                            "Assign SC-400 (Information Protection) training to compliance officers",
                            "Use Microsoft Applied Skills assessments to validate hands-on competency",
                            "Create custom learning paths in Microsoft Learn for CUI-specific roles",
                            "Track training completion through Microsoft Learn admin portal"
                        ],
                        verification: ["Verify certification completion records","Review Applied Skills assessment results","Confirm role-based training assignments"],
                        cost_estimate: "$0-165/exam (certifications)",
                        effort_hours: 40
                    }
                },
                gcp: {
                    services: ["Google Cloud Skills Boost","Professional Cloud Security Engineer","Security Foundation Blueprint","Cloud Audit Logs"],
                    implementation: {
                        steps: [
                            "Enroll security staff in Professional Cloud Security Engineer certification",
                            "Assign Google Cloud Skills Boost security quests to all technical personnel",
                            "Use Security Foundation Blueprint as hands-on training for infrastructure teams",
                            "Create role-specific training tracks: admin, developer, auditor",
                            "Document training requirements and track completion in HR system",
                            "Conduct quarterly hands-on security exercises using GCP sandbox environments"
                        ],
                        verification: ["Review certification records","Verify Skills Boost completion","Confirm quarterly exercise documentation"],
                        cost_estimate: "$0-200/person (Skills Boost subscription)",
                        effort_hours: 40
                    }
                }
            },
            firewalls: {
                paloalto: {
                    services: ["Palo Alto Networks Education","PCNSA/PCNSE Certifications","Beacon Learning","Fuel User Group"],
                    implementation: {
                        steps: [
                            "Enroll firewall administrators in PCNSA (Network Security Administrator) certification",
                            "Assign advanced staff to PCNSE (Network Security Engineer) certification path",
                            "Use Beacon digital learning platform for ongoing Palo Alto training",
                            "Participate in Fuel User Group for community knowledge sharing",
                            "Conduct quarterly firewall rule review exercises as hands-on training"
                        ],
                        verification: ["Verify PCNSA/PCNSE certification status","Review Beacon learning completion","Confirm quarterly rule review exercises"],
                        cost_estimate: "$200-400/exam",
                        effort_hours: 40
                    }
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["SentinelOne University","Singularity Certification","Purple AI Training","IR Playbook Training"],
                    implementation: {
                        steps: [
                            "Enroll SOC analysts in SentinelOne University certification program",
                            "Train incident responders on Singularity console threat hunting workflows",
                            "Conduct Purple AI query training for advanced threat detection",
                            "Practice IR playbook execution using SentinelOne simulation exercises",
                            "Document role-specific SentinelOne training requirements"
                        ],
                        verification: ["Verify SentinelOne University completion","Review threat hunting exercise logs","Confirm IR playbook training records"],
                        cost_estimate: "Included with SentinelOne license",
                        effort_hours: 24
                    }
                }
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Dojo","NinjaOne Certification","Automation Training","Scripting Library"],
                    implementation: {
                        steps: [
                            "Enroll IT staff in NinjaOne Dojo training platform",
                            "Complete NinjaOne certification for all endpoint management personnel",
                            "Train staff on automation workflows for patch management and compliance",
                            "Conduct scripting training using NinjaOne's built-in scripting library",
                            "Document role-specific NinjaOne training requirements and track completion"
                        ],
                        verification: ["Verify NinjaOne certification completion","Review automation training records","Confirm scripting competency assessments"],
                        cost_estimate: "Included with NinjaOne license",
                        effort_hours: 16
                    }
                }
            },
            vuln_mgmt: {
                tenable: {
                    services: ["Tenable University","Nessus Certification","STIG/CIS Audit Training","VPR Training"],
                    implementation: {
                        steps: [
                            "Enroll vulnerability management staff in Tenable University",
                            "Complete Nessus Professional certification for scanning personnel",
                            "Train auditors on STIG and CIS benchmark compliance scanning",
                            "Conduct VPR (Vulnerability Priority Rating) interpretation training",
                            "Practice vulnerability remediation workflows in test environments"
                        ],
                        verification: ["Verify Tenable University completion","Review Nessus certification status","Confirm STIG/CIS audit training records"],
                        cost_estimate: "Included with Tenable license",
                        effort_hours: 20
                    }
                }
            },
            small_business: {
                approach: "Leverage vendor-provided training, free certifications, and documented role-based training plans.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "Cybrary", cost: "Free tier available", purpose: "Security training courses" },
                        { name: "CISA Training", cost: "Free", purpose: "Government cybersecurity training" },
                        { name: "CompTIA Security+", cost: "$392/exam", purpose: "Baseline security certification" },
                        { name: "Vendor-specific training", cost: "Often included", purpose: "Tool-specific competency" }
                    ],
                    steps: [
                        "Define role-based training requirements for each position handling CUI",
                        "Create a training matrix mapping roles to required certifications and courses",
                        "Leverage free vendor training (AWS Skill Builder, Microsoft Learn, etc.)",
                        "Require CompTIA Security+ or equivalent as baseline for security roles",
                        "Track all training completion in a centralized spreadsheet or LMS"
                    ]
                }
            }
        },

        "AT.L2-3.2.3": {
            objective: "Provide security awareness training on recognizing and reporting potential indicators of insider threat.",
            cloud: {
                aws: {
                    services: ["Amazon GuardDuty","AWS CloudTrail Insights","Amazon Detective","AWS IAM Access Analyzer"],
                    implementation: {
                        steps: [
                            "Use GuardDuty insider threat findings as real-world training examples",
                            "Configure CloudTrail Insights anomaly detection and review findings in training",
                            "Demonstrate Amazon Detective investigation workflows for insider threat scenarios",
                            "Train staff on recognizing unusual IAM activity patterns using Access Analyzer",
                            "Develop insider threat reporting procedures integrated with AWS security tooling",
                            "Conduct tabletop exercises simulating insider threat scenarios in AWS environment"
                        ],
                        verification: ["Verify insider threat training completion records","Confirm reporting procedures are documented and accessible","Review tabletop exercise after-action reports"],
                        cost_estimate: "$50-200/month (GuardDuty + Detective)",
                        effort_hours: 16
                    }
                },
                azure: {
                    services: ["Microsoft Purview Insider Risk Management","Entra ID Identity Protection","Microsoft Sentinel","Communication Compliance"],
                    implementation: {
                        steps: [
                            "Deploy Purview Insider Risk Management and use anonymized case studies for training",
                            "Configure Entra ID Identity Protection risk policies and train staff on risk indicators",
                            "Create Microsoft Sentinel analytics rules for insider threat detection training",
                            "Implement Communication Compliance policies and train managers on review procedures",
                            "Develop insider threat reporting procedures with clear escalation paths",
                            "Conduct quarterly insider threat awareness briefings using Purview analytics"
                        ],
                        verification: ["Verify Insider Risk Management is deployed","Confirm training materials include insider threat indicators","Review quarterly briefing attendance records"],
                        cost_estimate: "$100-300/month (E5 Compliance)",
                        effort_hours: 20
                    }
                },
                gcp: {
                    services: ["Chronicle SIEM","Cloud Audit Logs","IAM Recommender","DLP API"],
                    implementation: {
                        steps: [
                            "Configure Chronicle SIEM rules for insider threat detection and use in training",
                            "Use Cloud Audit Logs to demonstrate unusual access patterns in training sessions",
                            "Train staff on recognizing excessive permission requests using IAM Recommender",
                            "Implement DLP API scanning and train users on data exfiltration indicators",
                            "Develop insider threat reporting procedures with GCP-specific indicators",
                            "Conduct tabletop exercises simulating data exfiltration scenarios"
                        ],
                        verification: ["Verify Chronicle rules are configured for insider threats","Confirm training includes GCP-specific indicators","Review tabletop exercise documentation"],
                        cost_estimate: "$100-300/month",
                        effort_hours: 16
                    }
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity ITDR","Deep Visibility","Ranger","STAR Custom Rules"],
                    implementation: {
                        steps: [
                            "Deploy Singularity ITDR (Identity Threat Detection) for insider threat monitoring",
                            "Use Deep Visibility queries to demonstrate insider threat patterns in training",
                            "Configure Ranger to detect unauthorized devices as insider threat indicators",
                            "Create STAR custom rules for insider threat behavioral patterns",
                            "Train SOC analysts on investigating insider threat alerts in Singularity console"
                        ],
                        verification: ["Verify ITDR is deployed and configured","Confirm STAR rules for insider threats exist","Review SOC analyst training on insider threat investigation"],
                        cost_estimate: "Included with SentinelOne Complete",
                        effort_hours: 12
                    }
                }
            },
            small_business: {
                approach: "Implement basic insider threat awareness using free government resources and simple reporting procedures.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "CISA Insider Threat Training", cost: "Free", purpose: "Government insider threat awareness" },
                        { name: "CDSE Insider Threat Awareness", cost: "Free", purpose: "DoD insider threat training" },
                        { name: "Anonymous Reporting Hotline", cost: "$50-100/month", purpose: "Confidential reporting mechanism" }
                    ],
                    steps: [
                        "Complete CDSE Insider Threat Awareness course for all personnel",
                        "Establish an anonymous insider threat reporting mechanism",
                        "Define insider threat indicators specific to your organization",
                        "Train managers on recognizing behavioral indicators of insider threats",
                        "Document insider threat reporting procedures in the security plan"
                    ]
                }
            }
        },

        // ========================================
        // SUPPLY CHAIN RISK MANAGEMENT (SR) - 03.17.x (New in Rev 3)
        // ========================================

        "SR.L2-03.17.01": {
            objective: "Develop, implement, and maintain a supply chain risk management plan.",
            cloud: {
                aws: {
                    services: ["AWS Marketplace","AWS Config","AWS Organizations","AWS Service Catalog","AWS Artifact"],
                    implementation: {
                        steps: [
                            "Document all AWS services and third-party marketplace products in supply chain inventory",
                            "Use AWS Config rules to enforce approved AMIs and container images only",
                            "Implement AWS Organizations SCPs to restrict service usage to approved providers",
                            "Deploy AWS Service Catalog to control which products teams can provision",
                            "Review AWS Artifact compliance reports for supply chain risk assessment",
                            "Establish vendor risk assessment process for all AWS Marketplace purchases",
                            "Create supply chain risk management plan documenting AWS shared responsibility model"
                        ],
                        verification: ["Verify supply chain inventory includes all AWS services","Confirm Config rules enforce approved images","Review vendor risk assessments for marketplace products"],
                        cost_estimate: "$0-100/month",
                        effort_hours: 40
                    }
                },
                azure: {
                    services: ["Azure Marketplace","Azure Policy","Microsoft Defender for Cloud","Supply Chain Security","Azure DevOps"],
                    implementation: {
                        steps: [
                            "Document all Azure services and marketplace products in supply chain inventory",
                            "Use Azure Policy to restrict deployments to approved publishers and images",
                            "Enable Defender for Cloud supply chain attack detection",
                            "Implement Azure DevOps pipeline security scanning for dependency vulnerabilities",
                            "Review Microsoft compliance documentation for supply chain risk assessment",
                            "Establish vendor risk assessment process for all Azure Marketplace purchases",
                            "Create supply chain risk management plan documenting Microsoft shared responsibility"
                        ],
                        verification: ["Verify supply chain inventory is complete","Confirm Azure Policy restricts to approved publishers","Review Defender for Cloud supply chain findings"],
                        cost_estimate: "$0-100/month",
                        effort_hours: 40
                    }
                },
                gcp: {
                    services: ["Artifact Registry","Binary Authorization","Container Analysis","Software Delivery Shield","Cloud Build"],
                    implementation: {
                        steps: [
                            "Document all GCP services and third-party products in supply chain inventory",
                            "Deploy Binary Authorization to enforce signed container images only",
                            "Enable Container Analysis for automated vulnerability scanning of dependencies",
                            "Implement Software Delivery Shield for end-to-end supply chain security",
                            "Use Cloud Build with verified base images for all deployments",
                            "Establish vendor risk assessment process for all GCP Marketplace purchases",
                            "Create supply chain risk management plan documenting GCP shared responsibility"
                        ],
                        verification: ["Verify Binary Authorization is enforced","Confirm Container Analysis scans all images","Review supply chain inventory completeness"],
                        cost_estimate: "$50-200/month",
                        effort_hours: 40
                    }
                }
            },
            firewalls: {
                paloalto: {
                    services: ["Panorama Software Updates","WildFire Threat Intelligence","GlobalProtect","App-ID"],
                    implementation: {
                        steps: [
                            "Document Palo Alto Networks as a critical supply chain vendor with risk assessment",
                            "Verify PAN-OS software updates are sourced only from official Palo Alto channels",
                            "Validate WildFire threat intelligence feed integrity and sourcing",
                            "Maintain inventory of all Palo Alto hardware/software including serial numbers",
                            "Review Palo Alto Networks security advisories as part of supply chain monitoring"
                        ],
                        verification: ["Verify vendor risk assessment for Palo Alto Networks","Confirm software updates are from official sources","Review hardware/software inventory"],
                        cost_estimate: "Included with support contract",
                        effort_hours: 8
                    }
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity Marketplace","Application Control","Ranger","Deep Visibility"],
                    implementation: {
                        steps: [
                            "Document SentinelOne as a critical supply chain vendor with risk assessment",
                            "Use Application Control to whitelist only approved software from verified vendors",
                            "Deploy Ranger to discover unauthorized software and devices from unknown vendors",
                            "Monitor Deep Visibility for supply chain attack indicators (e.g., compromised updates)",
                            "Review SentinelOne Marketplace integrations for supply chain risk"
                        ],
                        verification: ["Verify vendor risk assessment for SentinelOne","Confirm Application Control whitelist is maintained","Review Ranger discovery reports"],
                        cost_estimate: "Included with SentinelOne license",
                        effort_hours: 8
                    }
                }
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Software Management","Patch Management","Software Inventory","Documentation"],
                    implementation: {
                        steps: [
                            "Document NinjaOne as a critical supply chain vendor with risk assessment",
                            "Use NinjaOne software inventory to maintain complete software supply chain list",
                            "Configure patch management to source updates only from verified repositories",
                            "Monitor for unauthorized software installations across managed endpoints",
                            "Document all third-party integrations and their supply chain risk in NinjaOne Documentation"
                        ],
                        verification: ["Verify vendor risk assessment for NinjaOne","Confirm software inventory is complete","Review patch source configurations"],
                        cost_estimate: "Included with NinjaOne license",
                        effort_hours: 8
                    }
                }
            },
            vuln_mgmt: {
                tenable: {
                    services: ["Tenable.io Plugin Feed","Software Composition Analysis","Third-Party Patching","Compliance Audits"],
                    implementation: {
                        steps: [
                            "Document Tenable as a critical supply chain vendor with risk assessment",
                            "Use Tenable.io to scan for vulnerabilities in third-party software components",
                            "Implement software composition analysis for open-source dependency risks",
                            "Run compliance audits to verify third-party software meets security baselines",
                            "Monitor Tenable plugin feed for new supply chain vulnerability disclosures"
                        ],
                        verification: ["Verify vendor risk assessment for Tenable","Confirm third-party software scanning is active","Review compliance audit results"],
                        cost_estimate: "Included with Tenable.io license",
                        effort_hours: 12
                    }
                }
            },
            small_business: {
                approach: "Create a simple supply chain risk management plan using templates and maintain a vendor inventory spreadsheet.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "NIST SCRM Template", cost: "Free", purpose: "Supply chain risk management plan template" },
                        { name: "Vendor Risk Spreadsheet", cost: "Free", purpose: "Track vendor assessments" },
                        { name: "CISA Supply Chain Resources", cost: "Free", purpose: "Government supply chain guidance" },
                        { name: "SBOMs (Software Bill of Materials)", cost: "Free tools available", purpose: "Track software components" }
                    ],
                    steps: [
                        "Create a vendor inventory listing all technology providers and their risk levels",
                        "Develop a supply chain risk management plan using NIST templates",
                        "Require vendor security questionnaires for all critical suppliers",
                        "Review vendor SOC 2 or ISO 27001 reports annually",
                        "Maintain Software Bills of Materials (SBOMs) for critical applications"
                    ]
                }
            }
        },

        "SR.L2-03.17.02": {
            objective: "Establish processes to identify, assess, and mitigate supply chain risks.",
            cloud: {
                aws: {
                    services: ["AWS Config","AWS Systems Manager","Amazon Inspector","AWS CloudFormation Guard","AWS Trusted Advisor"],
                    implementation: {
                        steps: [
                            "Implement AWS Config rules to detect unapproved third-party resources",
                            "Use Systems Manager Inventory to track all software components and versions",
                            "Deploy Amazon Inspector to scan for vulnerabilities in third-party packages",
                            "Use CloudFormation Guard to validate infrastructure templates against supply chain policies",
                            "Review AWS Trusted Advisor for security recommendations on third-party integrations",
                            "Establish a vendor assessment process with security questionnaires and SLA requirements"
                        ],
                        verification: ["Verify Config rules detect unapproved resources","Confirm Inspector scans third-party packages","Review vendor assessment documentation"],
                        cost_estimate: "$50-200/month",
                        effort_hours: 32
                    }
                },
                azure: {
                    services: ["Microsoft Defender for DevOps","Azure Policy","Dependabot","GitHub Advanced Security","Azure Advisor"],
                    implementation: {
                        steps: [
                            "Enable Defender for DevOps to scan code repositories for supply chain vulnerabilities",
                            "Configure Azure Policy to enforce approved container registries and publishers",
                            "Deploy Dependabot or GitHub Advanced Security for dependency vulnerability scanning",
                            "Implement Azure Advisor security recommendations for third-party service configurations",
                            "Establish vendor risk scoring methodology and assessment cadence",
                            "Create automated alerts for new CVEs affecting supply chain components"
                        ],
                        verification: ["Verify Defender for DevOps is scanning repositories","Confirm dependency scanning is active","Review vendor risk scores"],
                        cost_estimate: "$50-200/month",
                        effort_hours: 32
                    }
                },
                gcp: {
                    services: ["Container Analysis","Artifact Registry","Binary Authorization","Cloud Build","Security Command Center"],
                    implementation: {
                        steps: [
                            "Enable Container Analysis for automated vulnerability scanning of all images",
                            "Configure Artifact Registry with vulnerability scanning for all stored artifacts",
                            "Implement Binary Authorization attestation workflow for supply chain verification",
                            "Use Cloud Build with verified base images and dependency checking",
                            "Monitor Security Command Center for supply chain-related findings",
                            "Establish vendor assessment process with GCP-specific security requirements"
                        ],
                        verification: ["Verify Container Analysis is scanning all images","Confirm Binary Authorization attestations","Review SCC supply chain findings"],
                        cost_estimate: "$50-200/month",
                        effort_hours: 32
                    }
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Application Control","Singularity Marketplace","Deep Visibility","Storyline Active Response"],
                    implementation: {
                        steps: [
                            "Configure Application Control to detect and block unapproved software",
                            "Monitor Deep Visibility for indicators of supply chain compromise (e.g., trojanized updates)",
                            "Create STAR rules to detect supply chain attack patterns (DLL sideloading, etc.)",
                            "Review Singularity Marketplace integrations for security posture",
                            "Implement automated response policies for supply chain threat indicators"
                        ],
                        verification: ["Verify Application Control policies are active","Confirm STAR rules for supply chain attacks","Review automated response configurations"],
                        cost_estimate: "Included with SentinelOne license",
                        effort_hours: 12
                    }
                }
            },
            vuln_mgmt: {
                tenable: {
                    services: ["Tenable.io","Software Composition Analysis","Plugin Feed","Compliance Audits"],
                    implementation: {
                        steps: [
                            "Configure Tenable.io scans to identify all third-party software and versions",
                            "Implement software composition analysis for open-source component risks",
                            "Create custom scan policies targeting supply chain vulnerability categories",
                            "Monitor plugin feed for new supply chain CVEs and zero-days",
                            "Generate supply chain risk reports for management review"
                        ],
                        verification: ["Verify scanning covers all third-party software","Confirm SCA is configured","Review supply chain risk reports"],
                        cost_estimate: "Included with Tenable.io license",
                        effort_hours: 12
                    }
                }
            },
            small_business: {
                approach: "Implement basic supply chain risk assessment using vendor questionnaires and software inventory tools.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "NIST Vendor Assessment Template", cost: "Free", purpose: "Standardized vendor questionnaire" },
                        { name: "Snyk Open Source", cost: "Free tier", purpose: "Open-source dependency scanning" },
                        { name: "OWASP Dependency-Check", cost: "Free", purpose: "Software composition analysis" }
                    ],
                    steps: [
                        "Create a vendor risk assessment questionnaire based on NIST guidelines",
                        "Assess all critical vendors annually using the questionnaire",
                        "Implement free dependency scanning tools for software projects",
                        "Maintain a risk register documenting supply chain risks and mitigations",
                        "Review vendor security incidents and breach notifications promptly"
                    ]
                }
            }
        },

        "SR.L2-03.17.03": {
            objective: "Employ anti-counterfeit techniques to detect and prevent counterfeit system components.",
            cloud: {
                aws: {
                    services: ["AWS Config","AWS Systems Manager","Amazon Inspector","AWS Service Catalog","AWS Marketplace"],
                    implementation: {
                        steps: [
                            "Use AWS Config to enforce that only approved AMIs from verified publishers are deployed",
                            "Implement Systems Manager to verify software integrity through hash validation",
                            "Deploy Amazon Inspector to detect tampered or vulnerable packages",
                            "Restrict procurement to AWS Marketplace verified publishers only",
                            "Use AWS Service Catalog to control which products can be provisioned",
                            "Implement code signing verification for all deployed applications"
                        ],
                        verification: ["Verify Config rules enforce approved AMIs","Confirm Inspector detects tampered packages","Review Service Catalog approved products"],
                        cost_estimate: "$0-100/month",
                        effort_hours: 24
                    }
                },
                azure: {
                    services: ["Azure Policy","Trusted Launch","Code Signing","Azure Attestation","Defender for Cloud"],
                    implementation: {
                        steps: [
                            "Enable Trusted Launch for all VMs to verify boot integrity",
                            "Implement Azure Policy to restrict deployments to signed and verified images",
                            "Use Azure Attestation to verify hardware and software integrity",
                            "Configure Defender for Cloud to detect tampered or unauthorized components",
                            "Implement code signing for all internally developed applications",
                            "Restrict Azure Marketplace purchases to verified publishers only"
                        ],
                        verification: ["Verify Trusted Launch is enabled on all VMs","Confirm code signing is enforced","Review Azure Attestation reports"],
                        cost_estimate: "$0-100/month",
                        effort_hours: 24
                    }
                },
                gcp: {
                    services: ["Binary Authorization","Artifact Registry","Container Analysis","Shielded VMs","Cloud KMS"],
                    implementation: {
                        steps: [
                            "Deploy Binary Authorization requiring cryptographic attestation for all container images",
                            "Enable Shielded VMs with Secure Boot and vTPM for all compute instances",
                            "Use Artifact Registry with vulnerability scanning to verify image integrity",
                            "Implement Cloud KMS for code signing and verification workflows",
                            "Configure Container Analysis to detect known-vulnerable or tampered packages",
                            "Restrict GCP Marketplace to verified publishers only"
                        ],
                        verification: ["Verify Binary Authorization is enforced","Confirm Shielded VMs are enabled","Review Container Analysis findings"],
                        cost_estimate: "$50-150/month",
                        effort_hours: 24
                    }
                }
            },
            firewalls: {
                paloalto: {
                    services: ["PAN-OS Software Verification","Hardware Serial Validation","Panorama Inventory","Support Portal"],
                    implementation: {
                        steps: [
                            "Verify all Palo Alto hardware serial numbers against purchase records and support portal",
                            "Validate PAN-OS software integrity using SHA-256 hash verification before installation",
                            "Use Panorama to maintain centralized inventory of all firewall hardware and software versions",
                            "Purchase hardware only from authorized Palo Alto Networks resellers",
                            "Implement tamper detection procedures for physical firewall appliances"
                        ],
                        verification: ["Verify serial numbers match purchase records","Confirm software hash validation process","Review Panorama inventory accuracy"],
                        cost_estimate: "Included with support contract",
                        effort_hours: 8
                    }
                }
            },
            small_business: {
                approach: "Implement basic anti-counterfeit measures through verified purchasing channels and software integrity checks.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "Hash verification tools", cost: "Free (built-in OS)", purpose: "Verify software integrity" },
                        { name: "Authorized reseller list", cost: "Free", purpose: "Verified purchasing channels" },
                        { name: "Asset inventory spreadsheet", cost: "Free", purpose: "Track hardware serial numbers" }
                    ],
                    steps: [
                        "Purchase hardware and software only from authorized resellers or manufacturers",
                        "Verify software integrity using SHA-256 hashes before installation",
                        "Maintain asset inventory with serial numbers and purchase records",
                        "Implement procedures for reporting suspected counterfeit components",
                        "Conduct periodic physical inspection of critical hardware components"
                    ]
                }
            }
        },

        // ========================================
        // PLANNING (PL) - 03.15.x (New in Rev 3)
        // ========================================

        "PL.L2-03.15.01": {
            objective: "Develop, document, and maintain system security plans that describe security requirements and controls.",
            cloud: {
                aws: {
                    services: ["AWS Well-Architected Tool","AWS Artifact","AWS Config","AWS Security Hub","AWS Systems Manager"],
                    implementation: {
                        steps: [
                            "Use AWS Well-Architected Tool to document security architecture and requirements",
                            "Reference AWS Artifact compliance documentation in the System Security Plan (SSP)",
                            "Map AWS Config rules to NIST 800-171 controls in the SSP",
                            "Document Security Hub findings baseline and remediation procedures in SSP",
                            "Use Systems Manager documents to maintain operational security procedures",
                            "Include AWS shared responsibility model documentation in SSP boundary definition",
                            "Review and update SSP quarterly or after significant AWS infrastructure changes"
                        ],
                        verification: ["Verify SSP documents all AWS services in scope","Confirm Config rules are mapped to controls","Review SSP update history and approval signatures"],
                        cost_estimate: "$0 (documentation effort)",
                        effort_hours: 80
                    }
                },
                azure: {
                    services: ["Microsoft Compliance Manager","Azure Policy","Defender for Cloud Regulatory Compliance","Azure Resource Graph"],
                    implementation: {
                        steps: [
                            "Use Microsoft Compliance Manager to map Azure controls to NIST 800-171 requirements",
                            "Document Azure Policy assignments and their mapping to security controls in SSP",
                            "Reference Defender for Cloud regulatory compliance dashboard in SSP",
                            "Use Azure Resource Graph to generate current infrastructure documentation for SSP",
                            "Include Microsoft shared responsibility model in SSP boundary definition",
                            "Document M365 GCC High configuration and security controls in SSP",
                            "Review and update SSP quarterly or after significant Azure changes"
                        ],
                        verification: ["Verify Compliance Manager assessment is current","Confirm SSP documents all Azure services","Review SSP approval and update records"],
                        cost_estimate: "$0 (documentation effort)",
                        effort_hours: 80
                    }
                },
                gcp: {
                    services: ["Security Command Center","Assured Workloads","Organization Policy","Cloud Asset Inventory"],
                    implementation: {
                        steps: [
                            "Document Assured Workloads configuration and compliance controls in SSP",
                            "Map Security Command Center findings to NIST 800-171 controls in SSP",
                            "Reference Organization Policy constraints in SSP control descriptions",
                            "Use Cloud Asset Inventory to generate current infrastructure documentation",
                            "Include GCP shared responsibility model in SSP boundary definition",
                            "Document all GCP services in scope and their security configurations",
                            "Review and update SSP quarterly or after significant GCP changes"
                        ],
                        verification: ["Verify SSP documents all GCP services in scope","Confirm Assured Workloads configuration is documented","Review SSP update history"],
                        cost_estimate: "$0 (documentation effort)",
                        effort_hours: 80
                    }
                }
            },
            firewalls: {
                paloalto: {
                    services: ["Panorama Configuration Export","Security Policy Documentation","Zone Configuration","Logging Configuration"],
                    implementation: {
                        steps: [
                            "Export Panorama configuration as documentation artifact for SSP",
                            "Document firewall security zones and their mapping to CUI data flows in SSP",
                            "Include firewall rule base summary and change management procedures in SSP",
                            "Document logging configuration and SIEM integration in SSP",
                            "Reference Palo Alto threat prevention and URL filtering policies in SSP"
                        ],
                        verification: ["Verify firewall configuration is documented in SSP","Confirm zone mapping is current","Review logging configuration documentation"],
                        cost_estimate: "Included (documentation effort)",
                        effort_hours: 16
                    }
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity Policy Documentation","Exclusion Lists","Response Policies","Integration Documentation"],
                    implementation: {
                        steps: [
                            "Document SentinelOne deployment scope and policy configurations in SSP",
                            "Include endpoint protection coverage metrics and exclusion justifications in SSP",
                            "Document automated response policies and their rationale in SSP",
                            "Reference SentinelOne integration with SIEM and ticketing systems in SSP",
                            "Include SentinelOne in the SSP continuous monitoring section"
                        ],
                        verification: ["Verify SentinelOne configuration is documented in SSP","Confirm coverage metrics are current","Review response policy documentation"],
                        cost_estimate: "Included (documentation effort)",
                        effort_hours: 8
                    }
                }
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Documentation Module","Policy Export","Patch Policy Documentation","Automation Documentation"],
                    implementation: {
                        steps: [
                            "Use NinjaOne Documentation module to maintain SSP artifacts",
                            "Document NinjaOne patch management policies and schedules in SSP",
                            "Include endpoint management scope and coverage in SSP",
                            "Document automation scripts and their security controls in SSP",
                            "Reference NinjaOne monitoring and alerting configuration in SSP"
                        ],
                        verification: ["Verify NinjaOne policies are documented in SSP","Confirm patch management documentation is current","Review automation documentation"],
                        cost_estimate: "Included (documentation effort)",
                        effort_hours: 8
                    }
                }
            },
            vuln_mgmt: {
                tenable: {
                    services: ["Tenable.io Scan Policies","Compliance Audit Documentation","Vulnerability Management Plan","Reporting"],
                    implementation: {
                        steps: [
                            "Document Tenable.io scan policies and schedules in SSP",
                            "Include vulnerability management plan and remediation SLAs in SSP",
                            "Reference compliance audit configurations (CIS/STIG) in SSP",
                            "Document vulnerability reporting and escalation procedures in SSP",
                            "Include Tenable.io in the SSP continuous monitoring section"
                        ],
                        verification: ["Verify scan policies are documented in SSP","Confirm remediation SLAs are defined","Review vulnerability management plan"],
                        cost_estimate: "Included (documentation effort)",
                        effort_hours: 8
                    }
                }
            },
            small_business: {
                approach: "Create a System Security Plan using NIST templates and FedRAMP SSP format as a guide.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "NIST SSP Template", cost: "Free", purpose: "System Security Plan template" },
                        { name: "FedRAMP SSP Template", cost: "Free", purpose: "Detailed SSP format reference" },
                        { name: "CMMC Assessment Guide", cost: "Free", purpose: "Control mapping reference" },
                        { name: "RegScale / Telos Xacta", cost: "$500-2000/month", purpose: "GRC platform for SSP management" }
                    ],
                    steps: [
                        "Download and customize the NIST SSP template for your organization",
                        "Define the system boundary including all CUI processing components",
                        "Document each NIST 800-171 control with implementation details",
                        "Include network diagrams, data flow diagrams, and system architecture",
                        "Have the SSP reviewed and approved by the authorizing official",
                        "Schedule quarterly SSP reviews and updates"
                    ]
                }
            }
        },

        "PL.L2-03.15.02": {
            objective: "Establish and provide rules of behavior for individuals requiring access to organizational systems and CUI.",
            cloud: {
                aws: {
                    services: ["AWS IAM Policies","AWS SSO","AWS Organizations","Amazon WorkSpaces"],
                    implementation: {
                        steps: [
                            "Create rules of behavior document covering AWS console and CLI usage",
                            "Include CUI handling requirements specific to AWS services (S3, EC2, RDS, etc.)",
                            "Document acceptable use policies for AWS resources and cost management",
                            "Integrate rules of behavior acknowledgment into AWS SSO onboarding workflow",
                            "Include AWS-specific prohibited actions (public S3 buckets, unencrypted storage, etc.)",
                            "Require annual re-acknowledgment of rules of behavior for all AWS users"
                        ],
                        verification: ["Verify rules of behavior document exists and is current","Confirm all users have acknowledged the rules","Review annual re-acknowledgment records"],
                        cost_estimate: "$0 (documentation effort)",
                        effort_hours: 16
                    }
                },
                azure: {
                    services: ["Entra ID Terms of Use","Conditional Access","Microsoft Intune","Microsoft Purview"],
                    implementation: {
                        steps: [
                            "Create Entra ID Terms of Use policy requiring rules of behavior acknowledgment",
                            "Configure Conditional Access to require Terms of Use acceptance before access",
                            "Include CUI handling requirements specific to M365 and Azure services",
                            "Document acceptable use policies for Teams, SharePoint, OneDrive, and email",
                            "Use Microsoft Intune to enforce device compliance as part of rules of behavior",
                            "Configure annual re-acknowledgment requirement in Entra ID Terms of Use"
                        ],
                        verification: ["Verify Terms of Use policy is configured in Entra ID","Confirm Conditional Access enforces acceptance","Review acknowledgment records"],
                        cost_estimate: "$0 (included with Entra ID P1/P2)",
                        effort_hours: 12
                    }
                },
                gcp: {
                    services: ["Cloud Identity","Context-Aware Access","Organization Policy","Admin Console"],
                    implementation: {
                        steps: [
                            "Create rules of behavior document covering GCP console and gcloud CLI usage",
                            "Include CUI handling requirements specific to GCP services",
                            "Document acceptable use policies for GCP resources",
                            "Implement Context-Aware Access policies that reference rules of behavior compliance",
                            "Use Admin Console to track user acknowledgments",
                            "Require annual re-acknowledgment for all GCP users"
                        ],
                        verification: ["Verify rules of behavior document exists","Confirm all users have acknowledged","Review annual re-acknowledgment records"],
                        cost_estimate: "$0 (documentation effort)",
                        effort_hours: 12
                    }
                }
            },
            small_business: {
                approach: "Create a simple rules of behavior document and require signed acknowledgment from all users.",
                budget_tier: "minimal",
                implementation: {
                    tools: [
                        { name: "Rules of Behavior Template", cost: "Free", purpose: "Document template" },
                        { name: "DocuSign / Adobe Sign", cost: "$10-25/month", purpose: "Electronic signature collection" },
                        { name: "Google Forms", cost: "Free", purpose: "Acknowledgment tracking" }
                    ],
                    steps: [
                        "Create a rules of behavior document covering CUI handling, acceptable use, and security responsibilities",
                        "Include specific prohibited actions (unauthorized data sharing, personal device use, etc.)",
                        "Require all users to sign the rules of behavior before being granted system access",
                        "Maintain signed acknowledgments in a centralized location",
                        "Review and update rules of behavior annually",
                        "Include rules of behavior in new employee onboarding process"
                    ]
                }
            }
        }
    }
};
