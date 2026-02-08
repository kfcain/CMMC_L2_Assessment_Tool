// Access Review Implementation Guide — Structured Data for Comprehensive Guidance UI
// Source: docs/access-review-implementation-guide.md
// Provides per-control implementation guidance for the Enterprise Access Review Automation Program

const ACCESS_REVIEW_GUIDE = {
    metadata: {
        title: "Access Review Implementation Guide for CMMC Level 2",
        version: "1.0.0",
        description: "Practical implementation guidance for deploying the Enterprise Access Review Automation Playbook and Remediation Addendum in a CMMC-compliant environment",
        companionDocs: [
            { name: "Enterprise Access Review Automation Playbook", file: "Enterprise_Access_Review_Automation_Playbook.md", focus: "Discovery, extraction, review workflow" },
            { name: "Access Review Remediation Addendum", file: "Access_Review_Remediation_Addendum.md", focus: "Post-review enforcement, rollback, evidence" }
        ],
        lifecycle: "Discovery → Extraction → Review → Enforcement → Verification → Evidence"
    },

    prerequisites: {
        licensing: [
            "Entra ID P2 or Entra ID Governance — Required for built-in Access Reviews",
            "Microsoft Graph API permissions — User.ReadWrite.All, Group.ReadWrite.All, RoleManagement.ReadWrite.Directory, Application.ReadWrite.All",
            "PnP.PowerShell module — For SharePoint Online permission audits",
            "ExchangeOnlineManagement module — For mailbox delegation audits",
            "Az PowerShell modules — Az.Accounts, Az.Resources for Azure RBAC",
            "AWS CLI + Boto3 — With IAM permissions for iam:* read and write operations",
            "GCP gcloud CLI + Python client libraries — google-cloud-asset, google-cloud-iam, google-cloud-resource-manager",
            "Active Directory PowerShell module — On a domain-joined machine or via RSAT"
        ],
        infrastructure: [
            "Automation server — Azure Automation, hardened jump box, or CI/CD pipeline for script execution",
            "Secret management — Azure Key Vault, AWS Secrets Manager, or GCP Secret Manager for credentials",
            "Review platform — SharePoint list, ServiceNow, or IGA tool for reviewer workflow",
            "Email/notification system — SMTP relay, Microsoft Graph mail, or Teams webhook for reviewer notifications",
            "Evidence storage — Immutable storage (Azure Blob with immutability policy, S3 Object Lock) for audit evidence retention"
        ],
        network: [
            "Hybrid Runbook Worker (if using Azure Automation) — For on-premises AD access",
            "Entra ID Connect health — Verify sync is healthy before relying on onPremisesSyncEnabled attribute",
            "Quarantine OU — Create OU=AccessReview-Disabled in AD for disabled account staging",
            "Service accounts — gMSA for AD scheduled tasks, Managed Identity for Azure Automation"
        ]
    },

    phasedPlan: [
        {
            phase: 1, name: "Foundation", weeks: "1–4",
            goal: "Establish core review infrastructure and deploy the highest-priority automation (AD + Entra ID)",
            milestones: [
                { week: 1, title: "Infrastructure Setup", steps: [
                    "Create Azure Automation Account (or configure dedicated server)",
                    "Configure Managed Identity with required Graph API permissions",
                    "Set up Azure Key Vault for certificate-based authentication",
                    "Create the quarantine OU in Active Directory",
                    "Create the review platform (SharePoint list or ITSM integration)",
                    "Create evidence storage container with immutability policy"
                ], validation: "Can the automation account authenticate to Microsoft Graph and on-premises AD?" },
                { week: 2, title: "AD Automation Deployment", steps: [
                    "Deploy AD Stale Account & Privilege Audit script (Playbook Section 3.2)",
                    "Deploy AD Group Membership Audit script (Playbook Section 3.3)",
                    "Schedule both via Task Scheduler for monthly execution",
                    "Configure email notification to reviewers (Playbook Section 3.4)",
                    "Test with a dry run against a non-production OU"
                ], controls: ["3.1.1", "3.1.5"] },
                { week: 3, title: "Entra ID Access Reviews + Gap Scripts", steps: [
                    "Enable Entra ID Access Reviews for all security groups (quarterly, manager review)",
                    "Enable Entra ID Access Reviews for all directory roles (monthly, CISO review)",
                    "Enable Entra ID Access Reviews for all enterprise app assignments (semi-annual, app owner review)",
                    "Enable PIM-eligible roles review (monthly, self-review + manager)",
                    "Deploy SharePoint permission audit script (Playbook Section 4.2.1)",
                    "Deploy Teams guest audit script (Playbook Section 4.2.2)",
                    "Deploy Exchange delegation audit script (Playbook Section 4.2.3)",
                    "Deploy directory role audit including permanent assignments (Playbook Section 4.3.1)",
                    "Deploy Conditional Access policy audit (Playbook Section 4.3.2)"
                ], controls: ["3.1.1", "3.1.5", "3.1.6", "3.1.7"] },
                { week: 4, title: "Decision Enforcement Foundation", steps: [
                    "Deploy the core Remediation Engine (Addendum Section 3.1)",
                    "Deploy AD remediation handler with rollback (Addendum Section 4.1)",
                    "Deploy Entra ID remediation handler (Addendum Section 4.2.1)",
                    "Deploy hybrid routing logic (Addendum Section 8.1)",
                    "Configure grace period (7 days) and notification templates",
                    "Run a full dry-run cycle: extract → review → stage → verify"
                ], controls: ["3.1.1", "3.9.2"] }
            ]
        },
        {
            phase: 2, name: "Cloud Expansion", weeks: "5–8",
            goal: "Extend coverage to AWS, GCP, Azure resources, and M365 gaps",
            milestones: [
                { week: "5–6", title: "AWS + Azure", steps: [
                    "Deploy AWS IAM user and policy audit (Playbook Section 6.2)",
                    "Deploy AWS IAM role and trust policy review (Playbook Section 6.3)",
                    "Deploy AWS S3 bucket access review (Playbook Section 6.4)",
                    "Deploy Azure RBAC comprehensive audit (Playbook Section 5.2)",
                    "Deploy Azure Key Vault access policy review (Playbook Section 5.3)",
                    "Schedule AWS scripts via Lambda + EventBridge (monthly)",
                    "Deploy AWS remediation handler (Addendum Section 4.4)",
                    "Deploy Azure RBAC remediation handler (Addendum Section 4.3)"
                ] },
                { week: "7–8", title: "GCP + M365 Gaps", steps: [
                    "Deploy GCP IAM binding audit (Playbook Section 7.2)",
                    "Deploy GCP service account key review (Playbook Section 7.3)",
                    "Deploy Google Workspace directory review (Playbook Section 7.4)",
                    "Deploy GCP remediation handler (Addendum Section 4.5)",
                    "Deploy SharePoint permission revocation (Addendum Section 4.2.2)",
                    "Deploy Teams guest removal handler (Addendum Section 4.2.3)",
                    "Deploy Exchange delegation removal handler (Addendum Section 4.2.4)",
                    "Implement reviewer notification workflows across all platforms"
                ] }
            ]
        },
        {
            phase: 3, name: "Enforcement & Maturity", weeks: "9–12",
            goal: "Full automated lifecycle with evidence generation and KPI tracking",
            milestones: [
                { week: "9–10", title: "End-to-End Orchestration", steps: [
                    "Deploy the Master Orchestration Script (Addendum Section 9.2)",
                    "Configure the 5-phase pipeline: Discovery → Notify → Enforce → Verify → Evidence",
                    "Implement the grace period workflow (Addendum Section 5.1)",
                    "Implement the exception workflow (Addendum Section 5.2)",
                    "Configure non-response escalation policies (Addendum Section 5.3)",
                    "Deploy post-remediation verification for all platforms (Addendum Section 6)"
                ] },
                { week: 11, title: "Evidence & Compliance", steps: [
                    "Deploy audit evidence package generation (Addendum Section 7)",
                    "Configure evidence retention per CMMC requirements (3-year minimum, 5-year recommended)",
                    "Build compliance dashboard: review completion rate, mean time to remediation, excessive privileges found/removed, stale account removal rate, exception rate",
                    "Map evidence artifacts to specific CMMC assessment objectives"
                ] },
                { week: 12, title: "Validation & Go-Live", steps: [
                    "Conduct tabletop exercise with security team",
                    "Run a full live review cycle (all 5 platforms)",
                    "Validate evidence package meets C3PAO expectations",
                    "Document lessons learned and adjust frequencies/thresholds",
                    "Establish ongoing KPIs and reporting cadence"
                ] }
            ]
        }
    ],

    evidenceArtifacts: [
        { artifact: "Access review policy document", source: "Manual (you write this)", objective: "AC.L2-3.1.1[a]" },
        { artifact: "Recurring review schedule", source: "Orchestration script config", objective: "AC.L2-3.1.1[b]" },
        { artifact: "User account review reports (per platform)", source: "Playbook extraction scripts", objective: "AC.L2-3.1.1[c], AC.L2-3.1.1[d]" },
        { artifact: "Privileged account review reports", source: "AD privilege audit + Entra role audit", objective: "AC.L2-3.1.5[a], AC.L2-3.1.6[a]" },
        { artifact: "Reviewer assignment records", source: "Review platform (SharePoint/ITSM)", objective: "AC.L2-3.1.1[e]" },
        { artifact: "Decision logs (approve/revoke/exception)", source: "Remediation engine decision CSV", objective: "AC.L2-3.1.1[f]" },
        { artifact: "Remediation execution logs", source: "Remediation engine audit log", objective: "AC.L2-3.1.1[g]" },
        { artifact: "Post-remediation verification results", source: "Verification handlers output", objective: "AC.L2-3.1.1[h]" },
        { artifact: "Exception register with justifications", source: "Exception workflow output", objective: "AC.L2-3.1.5[b]" },
        { artifact: "Stale account removal evidence", source: "AD/Entra/AWS/GCP stale detection", objective: "AC.L2-3.1.1[d]" },
        { artifact: "Guest/external access review evidence", source: "Teams guest + SPO external audit", objective: "AC.L2-3.1.22[a]" },
        { artifact: "Service account review evidence", source: "AWS IAM + GCP SA key audit", objective: "IA.L2-3.5.1[a]" },
        { artifact: "Evidence retention proof", source: "Immutable storage configuration", objective: "AU.L2-3.3.1" }
    ],

    commonPitfalls: [
        { pitfall: "Modifying synced objects in Entra ID directly", impact: "Changes overwritten on next sync cycle; silent failure", mitigation: "Use hybrid routing logic (Addendum Section 8) — always check onPremisesSyncEnabled" },
        { pitfall: "No grace period before enforcement", impact: "Business disruption, emergency rollbacks", mitigation: "Configure 7-day grace period with user notification (Addendum Section 5.1)" },
        { pitfall: "Hardcoded credentials in scripts", impact: "Security vulnerability, compliance failure", mitigation: "Use Managed Identities, gMSA, certificate auth, and secret managers exclusively" },
        { pitfall: "No verification after remediation", impact: "False confidence; access not actually removed", mitigation: "Deploy verification handlers that run at T+15m and T+24h (Addendum Section 6)" },
        { pitfall: "Reviewer fatigue from too many items", impact: "Low completion rates, rubber-stamping", mitigation: "Risk-score items, prioritize privileged access, use multi-stage reviews" },
        { pitfall: "No exception workflow", impact: "Legitimate access removed, business impact", mitigation: "Implement exception workflow with documented justification and expiration (Addendum Section 5.2)" },
        { pitfall: "Evidence not retained long enough", impact: "Compliance failure at audit", mitigation: "Configure immutable storage with 5-year retention (Addendum Section 7.2)" },
        { pitfall: "GCP SA key deletion without snapshot", impact: "Irreversible action, no rollback possible", mitigation: "Warn in UI, require secondary approval, document in rollback register" }
    ],

    scriptReference: [
        { script: "AD Stale Account Audit", section: "Playbook 3.2", platform: "On-Prem AD", language: "PowerShell" },
        { script: "AD Group Membership Audit", section: "Playbook 3.3", platform: "On-Prem AD", language: "PowerShell" },
        { script: "AD Decision Enforcement", section: "Playbook 3.5", platform: "On-Prem AD", language: "PowerShell" },
        { script: "SPO Permission Audit", section: "Playbook 4.2.1", platform: "M365", language: "PowerShell" },
        { script: "Teams Guest Audit", section: "Playbook 4.2.2", platform: "M365", language: "PowerShell" },
        { script: "Exchange Delegation Audit", section: "Playbook 4.2.3", platform: "M365", language: "PowerShell" },
        { script: "Entra ID Role Audit", section: "Playbook 4.3.1", platform: "Entra ID", language: "PowerShell" },
        { script: "Conditional Access Audit", section: "Playbook 4.3.2", platform: "Entra ID", language: "PowerShell" },
        { script: "Azure RBAC Audit", section: "Playbook 5.2", platform: "Azure", language: "PowerShell" },
        { script: "Key Vault Access Audit", section: "Playbook 5.3", platform: "Azure", language: "PowerShell" },
        { script: "AWS IAM User Audit", section: "Playbook 6.2", platform: "AWS", language: "Python" },
        { script: "AWS IAM Role Audit", section: "Playbook 6.3", platform: "AWS", language: "Python" },
        { script: "AWS S3 Bucket Audit", section: "Playbook 6.4", platform: "AWS", language: "Python" },
        { script: "GCP IAM Binding Audit", section: "Playbook 7.2", platform: "GCP", language: "Python" },
        { script: "GCP SA Key Audit", section: "Playbook 7.3", platform: "GCP", language: "Python" },
        { script: "Google Workspace Audit", section: "Playbook 7.4", platform: "GCP", language: "Python" },
        { script: "Remediation Engine", section: "Addendum 3.1", platform: "All", language: "Python" },
        { script: "AD Remediation Handler", section: "Addendum 4.1", platform: "On-Prem AD", language: "PowerShell" },
        { script: "Entra ID Remediation", section: "Addendum 4.2.1", platform: "Entra ID", language: "PowerShell" },
        { script: "SPO Remediation", section: "Addendum 4.2.2", platform: "M365", language: "PowerShell" },
        { script: "Teams Guest Remediation", section: "Addendum 4.2.3", platform: "M365", language: "PowerShell" },
        { script: "Exchange Remediation", section: "Addendum 4.2.4", platform: "M365", language: "PowerShell" },
        { script: "Azure RBAC Remediation", section: "Addendum 4.3.1", platform: "Azure", language: "PowerShell" },
        { script: "Key Vault Remediation", section: "Addendum 4.3.2", platform: "Azure", language: "PowerShell" },
        { script: "AWS IAM Remediation", section: "Addendum 4.4.1", platform: "AWS", language: "Python" },
        { script: "GCP IAM Remediation", section: "Addendum 4.5.1", platform: "GCP", language: "Python" },
        { script: "Hybrid Routing Logic", section: "Addendum 8.1", platform: "Hybrid", language: "PowerShell" },
        { script: "Master Orchestrator", section: "Addendum 9.2", platform: "All", language: "PowerShell" }
    ],

    maintenance: {
        monthly: [
            "Review KPI dashboard (completion rate, remediation time, exception rate)",
            "Validate privileged access review completion",
            "Rotate automation service account credentials"
        ],
        quarterly: [
            "Review and update review frequencies based on risk changes",
            "Audit the automation scripts themselves for drift",
            "Review exception register — are exceptions being re-reviewed on schedule?",
            "Update reviewer assignments for organizational changes"
        ],
        annually: [
            "Full program review with CISO and compliance team",
            "Update compliance framework mapping for any control changes",
            "Benchmark against industry peers (if data available)",
            "Plan for next year's assessment cycle evidence requirements"
        ]
    },

    // Per-control guidance entries for the Comprehensive Guidance UI
    // These plug into the existing guidance system as an "access_review" section
    objectives: {
        // === PRIMARY CONTROLS (Directly Satisfied) ===

        "AC.L2-3.1.1": {
            access_review: {
                access_review_program: {
                    services: ["Entra ID Access Reviews", "AD Stale Account Audit", "AD Group Membership Audit", "Remediation Engine", "Evidence Package Generator"],
                    recommended_approach: "Deploy the full Enterprise Access Review Automation program to satisfy authorized access control. User account recertification ensures only authorized users retain access. Stale account detection removes unauthorized access. The 5-phase lifecycle (Discovery → Extraction → Review → Enforcement → Verification) provides complete coverage.",
                    implementation: {
                        steps: [
                            "Phase 1 (Weeks 1–4): Deploy AD stale account & privilege audit, AD group membership audit, Entra ID Access Reviews for groups/roles/apps, and the core Remediation Engine with AD + Entra handlers",
                            "Phase 2 (Weeks 5–8): Extend to AWS IAM user/role/S3 audits, Azure RBAC/Key Vault audits, GCP IAM binding/SA key audits, and Google Workspace directory reviews",
                            "Phase 3 (Weeks 9–12): Deploy Master Orchestration Script, grace period & exception workflows, post-remediation verification, and audit evidence package generation",
                            "Configure review frequencies: Quarterly for standard users, Monthly for privileged accounts, Semi-annual for application assignments",
                            "Set up immutable evidence storage with 5-year retention for C3PAO audit readiness"
                        ],
                        verification: [
                            "Confirm automation account authenticates to Microsoft Graph and on-premises AD",
                            "Validate dry-run cycle completes: extract → review → stage → verify",
                            "Verify evidence package includes: review reports, decision logs, remediation logs, verification results",
                            "Confirm stale accounts (>90 days inactive) are detected and flagged"
                        ],
                        cost_estimate: "$5K–$15K (tooling + labor)",
                        effort_hours: "160–320"
                    },
                    evidenceArtifacts: [
                        "Access review policy document → AC.L2-3.1.1[a]",
                        "Recurring review schedule → AC.L2-3.1.1[b]",
                        "User account review reports (per platform) → AC.L2-3.1.1[c], AC.L2-3.1.1[d]",
                        "Reviewer assignment records → AC.L2-3.1.1[e]",
                        "Decision logs (approve/revoke/exception) → AC.L2-3.1.1[f]",
                        "Remediation execution logs → AC.L2-3.1.1[g]",
                        "Post-remediation verification results → AC.L2-3.1.1[h]"
                    ],
                    pitfalls: [
                        "Modifying synced objects in Entra ID directly → Use hybrid routing logic, always check onPremisesSyncEnabled",
                        "No grace period before enforcement → Configure 7-day grace period with user notification",
                        "Reviewer fatigue from too many items → Risk-score items, prioritize privileged access, use multi-stage reviews"
                    ]
                }
            }
        },

        "AC.L2-3.1.2": {
            access_review: {
                access_review_program: {
                    services: ["Application Role Assignment Reviews", "Entra ID Enterprise App Reviews", "Azure RBAC Audit"],
                    recommended_approach: "Application role assignment reviews verify users only have access to functions required for their duties. Entra ID Access Reviews for enterprise app assignments (semi-annual, app owner review) ensure transaction and function control is maintained.",
                    implementation: {
                        steps: [
                            "Enable Entra ID Access Reviews for all enterprise application assignments (semi-annual, app owner review)",
                            "Deploy Azure RBAC comprehensive audit (Playbook Section 5.2) to review resource-level permissions",
                            "Configure application-specific role reviews for LOB applications",
                            "Implement the remediation engine to automatically revoke denied app assignments",
                            "Generate evidence reports mapping users to application roles and functions"
                        ],
                        verification: [
                            "Confirm all enterprise apps have assigned reviewers",
                            "Verify denied access is actually revoked within the grace period",
                            "Validate evidence shows function-level access mapping"
                        ],
                        cost_estimate: "$2K–$5K",
                        effort_hours: "40–80"
                    }
                }
            }
        },

        "AC.L2-3.1.4": {
            access_review: {
                access_review_program: {
                    services: ["Cross-Platform Role Analysis", "Separation of Duties Detection", "Conflicting Privilege Audit"],
                    recommended_approach: "Cross-platform role analysis identifies users with conflicting privileges (e.g., both approver and requestor roles). The access review extraction scripts collect role data from AD, Entra ID, AWS, Azure, and GCP to enable SoD analysis.",
                    implementation: {
                        steps: [
                            "Define separation of duties matrix for your organization (conflicting role pairs)",
                            "Deploy extraction scripts across all 5 platforms to collect user-role mappings",
                            "Build cross-platform role correlation report identifying SoD violations",
                            "Flag violations in the review platform for manager remediation",
                            "Implement automated detection of new SoD conflicts when roles are assigned"
                        ],
                        verification: [
                            "Confirm SoD matrix covers all critical business processes",
                            "Verify cross-platform correlation identifies users with conflicting roles",
                            "Validate remediation of identified SoD violations"
                        ],
                        cost_estimate: "$3K–$8K",
                        effort_hours: "60–120"
                    }
                }
            }
        },

        "AC.L2-3.1.5": {
            access_review: {
                access_review_program: {
                    services: ["Privileged Access Reviews", "AD Privilege Audit", "Entra ID Role Audit", "PIM Reviews", "AWS IAM Privileged User Audit"],
                    recommended_approach: "Privileged access reviews (monthly for admins) enforce least privilege by removing unnecessary elevated access. The AD privilege audit detects stale admin accounts, and Entra ID role audits identify permanent admin assignments that should be PIM-eligible.",
                    implementation: {
                        steps: [
                            "Deploy AD Stale Account & Privilege Audit (Playbook Section 3.2) with focus on admin groups",
                            "Enable Entra ID Access Reviews for all directory roles (monthly, CISO review)",
                            "Enable PIM-eligible role reviews (monthly, self-review + manager)",
                            "Deploy directory role audit to identify permanent admin assignments (Playbook Section 4.3.1)",
                            "Deploy AWS IAM user audit focusing on AdministratorAccess and PowerUserAccess policies",
                            "Configure monthly review cadence for all privileged accounts across all platforms"
                        ],
                        verification: [
                            "Confirm all privileged roles have monthly review schedules",
                            "Verify permanent admin assignments are flagged for PIM conversion",
                            "Validate stale privileged accounts are disabled within grace period",
                            "Confirm exception register tracks all privileged access exceptions with justification"
                        ],
                        cost_estimate: "$3K–$8K",
                        effort_hours: "80–160"
                    },
                    evidenceArtifacts: [
                        "Privileged account review reports → AC.L2-3.1.5[a]",
                        "Exception register with justifications → AC.L2-3.1.5[b]"
                    ]
                }
            }
        },

        "AC.L2-3.1.6": {
            access_review: {
                access_review_program: {
                    services: ["Directory Role Audit", "Permanent Assignment Detection", "PIM Eligibility Analysis"],
                    recommended_approach: "Directory role audits identify permanent admin assignments that should be PIM-eligible. The Entra ID role audit (Playbook Section 4.3.1) detects users with standing privileged access who should instead use just-in-time elevation.",
                    implementation: {
                        steps: [
                            "Deploy Entra ID directory role audit (Playbook Section 4.3.1)",
                            "Identify all permanent (non-PIM) directory role assignments",
                            "Create remediation plan to convert permanent assignments to PIM-eligible",
                            "Configure PIM activation requirements (MFA, justification, approval for critical roles)",
                            "Schedule monthly reviews of remaining permanent assignments"
                        ],
                        verification: [
                            "Confirm all Global Admin assignments are PIM-eligible (zero permanent)",
                            "Verify PIM activation requires MFA and justification",
                            "Validate monthly audit report shows decreasing permanent assignments"
                        ],
                        cost_estimate: "$1K–$3K",
                        effort_hours: "20–40"
                    }
                }
            }
        },

        "AC.L2-3.1.7": {
            access_review: {
                access_review_program: {
                    services: ["PIM Reviews", "RBAC Reviews", "AWS IAM Role Reviews", "GCP IAM Binding Audit"],
                    recommended_approach: "PIM and RBAC reviews ensure privileged functions are restricted to authorized personnel. Cross-platform privileged role audits verify that admin-level access is justified, time-limited, and properly approved.",
                    implementation: {
                        steps: [
                            "Enable PIM-eligible role reviews for all privileged Entra ID roles (monthly)",
                            "Deploy Azure RBAC audit (Playbook Section 5.2) focusing on Owner and Contributor roles",
                            "Deploy AWS IAM role and trust policy review (Playbook Section 6.3)",
                            "Deploy GCP IAM binding audit (Playbook Section 7.2) focusing on roles/owner and roles/editor",
                            "Implement cross-platform privileged function inventory and review schedule"
                        ],
                        verification: [
                            "Confirm all privileged functions across all platforms have assigned reviewers",
                            "Verify PIM activation logs show proper justification and approval",
                            "Validate no unauthorized privileged role assignments exist"
                        ],
                        cost_estimate: "$2K–$5K",
                        effort_hours: "40–80"
                    }
                }
            }
        },

        "AC.L2-3.1.22": {
            access_review: {
                access_review_program: {
                    services: ["S3 Bucket Access Review", "SharePoint External Sharing Audit", "Teams Guest Audit", "Public Exposure Detection"],
                    recommended_approach: "S3 bucket and SharePoint external sharing reviews prevent unauthorized public exposure of CUI. The Teams guest audit identifies external users with access to internal resources. Together these scripts detect and remediate publicly accessible content.",
                    implementation: {
                        steps: [
                            "Deploy AWS S3 bucket access review (Playbook Section 6.4) to detect public/cross-account access",
                            "Deploy SharePoint permission audit (Playbook Section 4.2.1) focusing on external sharing",
                            "Deploy Teams guest audit (Playbook Section 4.2.2) to identify external users",
                            "Configure automated alerts for new public S3 buckets or externally shared SPO sites",
                            "Implement remediation handlers to revoke unauthorized external access"
                        ],
                        verification: [
                            "Confirm no S3 buckets with CUI are publicly accessible",
                            "Verify SharePoint sites with CUI have no anonymous or external sharing links",
                            "Validate Teams guest access is limited to approved external collaborators"
                        ],
                        cost_estimate: "$2K–$5K",
                        effort_hours: "40–80"
                    }
                }
            }
        },

        // === SUPPORTING CONTROLS (Evidence Contribution) ===

        "IA.L2-3.5.1": {
            access_review: {
                access_review_program: {
                    services: ["Service Account Review", "API Key Audit", "GCP SA Key Review", "AWS IAM User Audit"],
                    recommended_approach: "Service account and API key reviews verify all identities are authorized and tracked. The AWS IAM user audit and GCP service account key review identify stale or unauthorized service identities.",
                    implementation: {
                        steps: [
                            "Deploy AWS IAM user audit (Playbook Section 6.2) including service accounts and access keys",
                            "Deploy GCP service account key review (Playbook Section 7.3) to detect old/unused keys",
                            "Include service accounts in AD stale account audit scope",
                            "Implement service account ownership tracking in review platform",
                            "Schedule quarterly service account recertification"
                        ],
                        verification: [
                            "Confirm all service accounts have documented owners",
                            "Verify stale API keys (>90 days unused) are flagged for rotation or deletion",
                            "Validate service account inventory is complete across all platforms"
                        ],
                        cost_estimate: "$1K–$3K",
                        effort_hours: "20–40"
                    }
                }
            }
        },

        "IA.L2-3.5.2": {
            access_review: {
                access_review_program: {
                    services: ["MFA Enrollment Audit", "Authentication Method Review", "Conditional Access Audit"],
                    recommended_approach: "MFA enrollment audits (part of user review) confirm authentication requirements are met. The Conditional Access policy audit (Playbook Section 4.3.2) verifies that authentication policies are properly configured and enforced.",
                    implementation: {
                        steps: [
                            "Include MFA enrollment status in Entra ID user extraction",
                            "Deploy Conditional Access policy audit (Playbook Section 4.3.2)",
                            "Flag users without MFA registered in review reports",
                            "Implement automated notification for users missing MFA registration",
                            "Track MFA coverage percentage as a KPI"
                        ],
                        verification: [
                            "Confirm 100% MFA enrollment for all interactive accounts",
                            "Verify Conditional Access policies require MFA for all cloud apps",
                            "Validate no legacy authentication methods are permitted"
                        ],
                        cost_estimate: "$500–$2K",
                        effort_hours: "10–20"
                    }
                }
            }
        },

        "IA.L2-3.5.7": {
            access_review: {
                access_review_program: {
                    services: ["AD User Review", "Password Policy Audit", "PasswordNeverExpires Detection"],
                    recommended_approach: "Password age and PasswordNeverExpires flags are captured in AD user reviews. The AD stale account audit includes password policy compliance checks.",
                    implementation: {
                        steps: [
                            "Include password age and PasswordNeverExpires flag in AD user extraction",
                            "Flag accounts with PasswordNeverExpires set to True",
                            "Report accounts exceeding password age policy",
                            "Include password compliance metrics in review dashboard"
                        ],
                        verification: [
                            "Confirm no accounts have PasswordNeverExpires without documented exception",
                            "Verify password age compliance across all AD accounts"
                        ],
                        cost_estimate: "$500–$1K",
                        effort_hours: "5–10"
                    }
                }
            }
        },

        "AU.L2-3.3.1": {
            access_review: {
                access_review_program: {
                    services: ["Remediation Execution Log", "Decision Log", "Evidence Package Generator"],
                    recommended_approach: "The remediation execution log and decision log serve as audit records for access changes. The evidence package generator produces immutable audit evidence with full chain of custody.",
                    implementation: {
                        steps: [
                            "Configure remediation engine to log all actions with timestamp, actor, target, action, and outcome",
                            "Deploy audit evidence package generation (Addendum Section 7)",
                            "Configure immutable storage (Azure Blob immutability policy or S3 Object Lock)",
                            "Set retention to 5 years (exceeds CMMC 3-year minimum)",
                            "Include evidence retention proof in audit package"
                        ],
                        verification: [
                            "Confirm all remediation actions are logged with required audit fields",
                            "Verify evidence storage has immutability policy enabled",
                            "Validate retention period meets or exceeds 3-year CMMC requirement"
                        ],
                        cost_estimate: "$1K–$3K",
                        effort_hours: "15–30"
                    }
                }
            }
        },

        "AU.L2-3.3.2": {
            access_review: {
                access_review_program: {
                    services: ["Decision Records", "Audit Trail", "Remediation Logs"],
                    recommended_approach: "Decision records include who, what, when, where, and outcome — all required audit fields. The remediation engine produces structured logs that satisfy audit record content requirements.",
                    implementation: {
                        steps: [
                            "Ensure decision records capture: reviewer identity, decision (approve/revoke/exception), timestamp, target account/role, platform, justification",
                            "Ensure remediation logs capture: action taken, executor identity, timestamp, target, result, rollback capability",
                            "Include source IP and session context where available",
                            "Generate summary reports with aggregate audit statistics"
                        ],
                        verification: [
                            "Confirm decision records contain all 5 required audit fields (who, what, when, where, outcome)",
                            "Verify remediation logs are tamper-evident (immutable storage)"
                        ],
                        cost_estimate: "$500–$1K",
                        effort_hours: "5–10"
                    }
                }
            }
        },

        "PS.L2-3.9.2": {
            access_review: {
                access_review_program: {
                    services: ["Offboarding Reviews", "HR-Triggered Remediation", "Cross-Platform Access Revocation"],
                    recommended_approach: "Offboarding reviews (triggered by HR separation) use the same remediation engine to revoke all access across all platforms. The cross-platform remediation handlers ensure complete access removal.",
                    implementation: {
                        steps: [
                            "Integrate HR separation events with the remediation engine trigger",
                            "Configure immediate (no grace period) remediation for terminated employees",
                            "Deploy cross-platform revocation: AD disable → Entra ID disable → AWS IAM deactivate → GCP IAM remove → M365 license remove",
                            "Deploy post-termination verification at T+15m and T+24h",
                            "Generate termination evidence package for compliance records"
                        ],
                        verification: [
                            "Confirm terminated user access is revoked within 1 hour across all platforms",
                            "Verify post-termination verification confirms no residual access",
                            "Validate termination evidence package is complete and stored immutably"
                        ],
                        cost_estimate: "$2K–$5K",
                        effort_hours: "30–60"
                    }
                }
            }
        },

        "PE.L2-3.10.6": {
            access_review: {
                access_review_program: {
                    services: ["Guest Access Review", "External Access Audit", "Teams Guest Audit"],
                    recommended_approach: "Guest and external access reviews cover remote/alternative site access patterns. The Teams guest audit and SharePoint external sharing audit identify external users accessing organizational resources from alternative work sites.",
                    implementation: {
                        steps: [
                            "Deploy Teams guest audit (Playbook Section 4.2.2) to review external collaborators",
                            "Include guest/external user review in quarterly access review cycle",
                            "Review Conditional Access policies for guest access restrictions",
                            "Verify external users have appropriate access scope and expiration dates"
                        ],
                        verification: [
                            "Confirm all guest accounts have documented business justification",
                            "Verify guest access is time-limited with expiration dates",
                            "Validate Conditional Access restricts guest access appropriately"
                        ],
                        cost_estimate: "$500–$2K",
                        effort_hours: "10–20"
                    }
                }
            }
        }
    }
};
