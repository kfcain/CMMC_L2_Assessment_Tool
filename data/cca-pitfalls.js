// CCA Assessment Pitfalls and Common Gaps
// What Lead CCAs specifically look for and common failures during CMMC assessments

const CCA_PITFALLS = {
    // Common assessment failures by control family
    byFamily: {
        "AC": {
            commonGaps: [
                {
                    issue: "No documented process for defining authorized users",
                    impact: "3.1.1[a] NOT MET - Cannot demonstrate who is authorized",
                    fix: "Create formal access authorization procedure with HR integration",
                    evidenceNeeded: ["Signed authorization forms", "HR onboarding procedure", "Access request workflow"]
                },
                {
                    issue: "Service accounts not inventoried or owned",
                    impact: "3.1.1[b] NOT MET - Processes acting on behalf of users unidentified",
                    fix: "Create service account registry with documented owners and purposes",
                    evidenceNeeded: ["Service account inventory", "Owner assignment documentation", "Business justification for each"]
                },
                {
                    issue: "CUI data flows not documented",
                    impact: "3.1.3 NOT MET - Cannot demonstrate CUI flow control",
                    fix: "Create data flow diagrams showing CUI ingress/egress/internal flows",
                    evidenceNeeded: ["Data flow diagrams", "Authorized interconnections", "DLP policy documentation"]
                },
                {
                    issue: "Admins use privileged accounts for daily work",
                    impact: "3.1.6 NOT MET - Non-privileged accounts not used for nonsecurity functions",
                    fix: "Implement separate admin accounts, enforce via Conditional Access",
                    evidenceNeeded: ["Separate admin/user account evidence", "CA policy screenshots", "Sign-in logs showing separation"]
                },
                {
                    issue: "Session lock not configured or >15 minutes",
                    impact: "3.1.10 NOT MET - Session lock timeout too long or missing",
                    fix: "Configure 15-minute (or less) session lock via GPO/Intune",
                    evidenceNeeded: ["GPO/Intune policy screenshots", "Test evidence of lock triggering"]
                },
                {
                    issue: "No system use notification/banner",
                    impact: "3.1.9 NOT MET - Privacy and security notices not displayed",
                    fix: "Deploy DoD-compliant login banner to all systems",
                    evidenceNeeded: ["Banner screenshots from each system type", "Banner text approval from Legal"]
                }
            ],
            ccaTips: [
                "CCAs will ask to see a NEW user provisioning end-to-end",
                "CCAs will verify session lock by timing inactivity themselves",
                "CCAs will log into systems to verify banner displays",
                "CCAs will ask for terminated user list and verify access was removed same-day",
                "CCAs will request CUI data flow diagram and trace a specific flow"
            ]
        },
        "AT": {
            commonGaps: [
                {
                    issue: "Security awareness training not role-based",
                    impact: "3.2.2 NOT MET - Training not tailored to job functions",
                    fix: "Create role-based training matrix mapping roles to training requirements",
                    evidenceNeeded: ["Role-based training matrix", "Different curricula for different roles", "Completion records by role"]
                },
                {
                    issue: "No insider threat training provided",
                    impact: "3.2.3 NOT MET - Insider threat awareness not addressed",
                    fix: "Deploy insider threat awareness training module",
                    evidenceNeeded: ["Insider threat training materials", "Completion records", "Indicator recognition content"]
                },
                {
                    issue: "Training records incomplete or missing dates",
                    impact: "Cannot prove training completion timing",
                    fix: "Implement LMS with automatic date/time stamping",
                    evidenceNeeded: ["LMS completion reports with timestamps", "Training certificates with dates"]
                }
            ],
            ccaTips: [
                "CCAs will ask to see training content, not just completion records",
                "CCAs will verify training is completed BEFORE access is granted",
                "CCAs will interview employees about training content retention",
                "CCAs will look for annual refresher training evidence"
            ]
        },
        "AU": {
            commonGaps: [
                {
                    issue: "Audit logs don't capture required content",
                    impact: "3.3.1[b] NOT MET - Logs lack who/what/when/where/outcome",
                    fix: "Enable verbose logging capturing all required fields",
                    evidenceNeeded: ["Sample logs showing all required fields", "Log field mapping documentation"]
                },
                {
                    issue: "No alerting on audit failures",
                    impact: "3.3.4 NOT MET - Audit process failures not alerted",
                    fix: "Configure alerts for log collection failures",
                    evidenceNeeded: ["Alert configuration", "Sample alert evidence", "Response procedure"]
                },
                {
                    issue: "Time not synchronized across systems",
                    impact: "3.3.7 NOT MET - Cannot correlate events across systems",
                    fix: "Configure NTP sync to authoritative source on all systems",
                    evidenceNeeded: ["NTP configuration evidence", "Time sync status from sample systems"]
                },
                {
                    issue: "Audit logs accessible to non-security personnel",
                    impact: "3.3.8 NOT MET - Audit information not protected",
                    fix: "Restrict log access to Security team only",
                    evidenceNeeded: ["RBAC showing log access restrictions", "Access review evidence"]
                }
            ],
            ccaTips: [
                "CCAs will request ACTUAL log samples, not just configuration",
                "CCAs will verify logs are retained for required period (typically 1 year)",
                "CCAs will check if admins can modify or delete their own logs",
                "CCAs will verify log timestamps are consistent across systems"
            ]
        },
        "CM": {
            commonGaps: [
                {
                    issue: "No documented baseline configuration",
                    impact: "3.4.1 NOT MET - Baseline not established or documented",
                    fix: "Create baseline using CIS Benchmarks or DISA STIGs",
                    evidenceNeeded: ["Baseline configuration document", "CIS/STIG mapping", "Compliance scan results"]
                },
                {
                    issue: "No change management process",
                    impact: "3.4.3 NOT MET - Changes not tracked or approved",
                    fix: "Implement formal change management with approval workflow",
                    evidenceNeeded: ["Change tickets with approvals", "CAB meeting minutes", "Change history"]
                },
                {
                    issue: "Unauthorized software installed",
                    impact: "3.4.6 NOT MET - Least functionality not employed",
                    fix: "Implement application whitelisting (WDAC/AppLocker)",
                    evidenceNeeded: ["Application whitelist policy", "Software inventory scan", "Blocked software evidence"]
                },
                {
                    issue: "Users can install software",
                    impact: "3.4.9 NOT MET - User-installed software not controlled",
                    fix: "Remove local admin rights, use software request process",
                    evidenceNeeded: ["Local admin restrictions", "Software request workflow", "Installation logs"]
                }
            ],
            ccaTips: [
                "CCAs will compare actual system config to documented baseline",
                "CCAs will ask for recent change tickets and verify approval chain",
                "CCAs will run software inventory and compare to approved list",
                "CCAs will attempt to install unauthorized software (with permission)"
            ]
        },
        "IA": {
            commonGaps: [
                {
                    issue: "MFA not enforced for all access",
                    impact: "3.5.3 NOT MET - MFA not required for privileged/network access",
                    fix: "Enable MFA via Conditional Access for all users",
                    evidenceNeeded: ["CA policy requiring MFA", "MFA enrollment status", "Sign-in logs showing MFA"]
                },
                {
                    issue: "Weak password policy",
                    impact: "3.5.7 NOT MET - Password complexity insufficient",
                    fix: "Configure password policy: 14+ chars, complexity, no common passwords",
                    evidenceNeeded: ["Password policy configuration", "Banned password list", "Test password rejection"]
                },
                {
                    issue: "Passwords stored in plaintext or weak hash",
                    impact: "3.5.10 NOT MET - Cryptographic protection for passwords missing",
                    fix: "Use modern identity provider with proper password hashing",
                    evidenceNeeded: ["Documentation of password storage mechanism", "Encryption in transit evidence"]
                },
                {
                    issue: "Shared/generic accounts in use",
                    impact: "3.5.1/3.5.2 NOT MET - Individual accountability lost",
                    fix: "Eliminate shared accounts, create individual accounts",
                    evidenceNeeded: ["Account inventory showing unique accounts", "No shared account usage"]
                }
            ],
            ccaTips: [
                "CCAs will verify MFA is ENFORCED, not just available",
                "CCAs will test password policy by attempting weak passwords",
                "CCAs will look for shared accounts or service accounts used by humans",
                "CCAs will verify MFA uses phishing-resistant methods for privileged access"
            ]
        },
        "IR": {
            commonGaps: [
                {
                    issue: "No documented incident response plan",
                    impact: "3.6.1 NOT MET - IR capability not established",
                    fix: "Create comprehensive IR plan with all phases",
                    evidenceNeeded: ["IR Plan document", "Contact lists", "Escalation procedures"]
                },
                {
                    issue: "IR plan never tested",
                    impact: "3.6.3 NOT MET - IR capability not tested",
                    fix: "Conduct annual tabletop exercise and document lessons learned",
                    evidenceNeeded: ["Tabletop exercise materials", "Attendance records", "After-action report"]
                },
                {
                    issue: "No knowledge of DFARS reporting requirements",
                    impact: "3.6.2[c] NOT MET - Reporting requirements not understood",
                    fix: "Document 72-hour reporting requirement and DC3 process",
                    evidenceNeeded: ["DFARS 252.204-7012 reporting procedure", "DC3 submission template", "Training on requirements"]
                }
            ],
            ccaTips: [
                "CCAs will ask IR team members to walk through a scenario",
                "CCAs will verify IR contacts are current and reachable",
                "CCAs will ask about DFARS 72-hour reporting requirement",
                "CCAs will request evidence of most recent tabletop exercise"
            ]
        },
        "MA": {
            commonGaps: [
                {
                    issue: "No controlled maintenance tools",
                    impact: "3.7.2 NOT MET - Maintenance tools not controlled",
                    fix: "Document approved maintenance tools and restrict access",
                    evidenceNeeded: ["Approved tool list", "Tool access restrictions", "Tool usage logs"]
                },
                {
                    issue: "Remote maintenance without MFA",
                    impact: "3.7.5 NOT MET - MFA not required for remote maintenance",
                    fix: "Require MFA for all remote access including maintenance",
                    evidenceNeeded: ["MFA configuration for remote access", "Session logs showing MFA"]
                },
                {
                    issue: "Vendor maintenance not supervised",
                    impact: "3.7.6 NOT MET - Personnel without access not supervised",
                    fix: "Implement escort/supervision procedures for vendors",
                    evidenceNeeded: ["Vendor escort procedure", "Supervision logs", "Vendor access agreements"]
                }
            ],
            ccaTips: [
                "CCAs will ask about vendor/contractor maintenance access",
                "CCAs will verify MFA for remote maintenance sessions",
                "CCAs will request maintenance activity logs"
            ]
        },
        "MP": {
            commonGaps: [
                {
                    issue: "No media sanitization before disposal",
                    impact: "3.8.3 NOT MET - Media not sanitized per NIST 800-88",
                    fix: "Implement media sanitization procedure per NIST 800-88",
                    evidenceNeeded: ["Sanitization procedure", "Sanitization logs", "Certificate of destruction"]
                },
                {
                    issue: "USB/removable media not controlled",
                    impact: "3.8.7 NOT MET - Removable media not controlled",
                    fix: "Block or encrypt removable media via endpoint management",
                    evidenceNeeded: ["USB blocking policy", "BitLocker To Go enforcement", "Device control logs"]
                },
                {
                    issue: "CUI not marked on media",
                    impact: "3.8.4 NOT MET - CUI markings missing",
                    fix: "Implement CUI marking on all media containing CUI",
                    evidenceNeeded: ["CUI marking procedure", "Sample marked media", "Label examples"]
                }
            ],
            ccaTips: [
                "CCAs will ask to see a USB device and verify it's encrypted or blocked",
                "CCAs will request media destruction logs/certificates",
                "CCAs will look for CUI markings on physical and digital media"
            ]
        },
        "PS": {
            commonGaps: [
                {
                    issue: "No background checks before CUI access",
                    impact: "3.9.1 NOT MET - Personnel not screened before access",
                    fix: "Implement pre-employment background screening",
                    evidenceNeeded: ["Screening policy", "Background check records (redacted)", "Access timing vs screening"]
                },
                {
                    issue: "Termination process doesn't revoke access same-day",
                    impact: "3.9.2 NOT MET - Access not revoked upon termination",
                    fix: "Implement same-day access revocation procedure",
                    evidenceNeeded: ["Termination checklist", "Access revocation timestamps", "HR-IT notification process"]
                }
            ],
            ccaTips: [
                "CCAs will request list of recent terminations and verify access removal timing",
                "CCAs will verify background checks completed BEFORE access granted",
                "CCAs will check for orphaned accounts from departed employees"
            ]
        },
        "PE": {
            commonGaps: [
                {
                    issue: "Visitors not escorted",
                    impact: "3.10.3 NOT MET - Visitors not escorted/monitored",
                    fix: "Implement visitor escort and logging procedures",
                    evidenceNeeded: ["Visitor logs", "Escort procedures", "Badge-in/out records"]
                },
                {
                    issue: "No physical access logs",
                    impact: "3.10.4 NOT MET - Physical access not audited",
                    fix: "Implement badge reader logging or manual access logs",
                    evidenceNeeded: ["Badge reader logs", "Access log reports", "Retention evidence"]
                },
                {
                    issue: "Remote work without controls",
                    impact: "3.10.6 NOT MET - Alternate work sites not safeguarded",
                    fix: "Implement telework policy with security requirements",
                    evidenceNeeded: ["Telework policy", "Home office requirements", "VPN/VDI evidence"]
                }
            ],
            ccaTips: [
                "CCAs will observe visitor handling during site visit",
                "CCAs will request physical access logs for specific dates",
                "CCAs will ask about remote work policies and controls"
            ]
        },
        "RA": {
            commonGaps: [
                {
                    issue: "No risk assessment performed",
                    impact: "3.11.1 NOT MET - Risk not periodically assessed",
                    fix: "Conduct annual risk assessment per NIST RMF",
                    evidenceNeeded: ["Risk assessment report", "Risk register", "Assessment methodology"]
                },
                {
                    issue: "No vulnerability scanning",
                    impact: "3.11.2 NOT MET - Vulnerabilities not scanned",
                    fix: "Implement authenticated vulnerability scanning",
                    evidenceNeeded: ["Scan reports", "Scanning schedule", "Scan configuration"]
                },
                {
                    issue: "Vulnerabilities not remediated",
                    impact: "3.11.3 NOT MET - Vulnerabilities not remediated",
                    fix: "Implement vulnerability management with SLAs",
                    evidenceNeeded: ["Remediation tickets", "Patch evidence", "POA&M for remaining vulns"]
                }
            ],
            ccaTips: [
                "CCAs will request most recent vulnerability scan results",
                "CCAs will verify critical/high vulnerabilities are remediated or in POA&M",
                "CCAs will compare scan results over time for trending"
            ]
        },
        "CA": {
            commonGaps: [
                {
                    issue: "No System Security Plan (SSP)",
                    impact: "3.12.4 NOT MET - SSP not developed or maintained",
                    fix: "Create comprehensive SSP documenting all controls",
                    evidenceNeeded: ["SSP document", "Boundary diagrams", "Control implementation details"]
                },
                {
                    issue: "No POA&M for gaps",
                    impact: "3.12.2 NOT MET - Deficiencies not tracked",
                    fix: "Create POA&M for all unmet controls with milestones",
                    evidenceNeeded: ["POA&M spreadsheet", "Milestone dates", "Resource assignments"]
                },
                {
                    issue: "No continuous monitoring",
                    impact: "3.12.3 NOT MET - Controls not continuously monitored",
                    fix: "Implement continuous monitoring program",
                    evidenceNeeded: ["Monitoring dashboards", "Alert configurations", "Review schedules"]
                }
            ],
            ccaTips: [
                "CCAs will review SSP for completeness and accuracy",
                "CCAs will verify POA&M milestones are reasonable and tracked",
                "CCAs will ask how you know controls are still effective"
            ]
        },
        "SC": {
            commonGaps: [
                {
                    issue: "No boundary protection",
                    impact: "3.13.1 NOT MET - Communications not monitored at boundaries",
                    fix: "Deploy firewall/IDS at external and key internal boundaries",
                    evidenceNeeded: ["Firewall rules", "IDS configuration", "Network diagrams"]
                },
                {
                    issue: "No encryption in transit",
                    impact: "3.13.8 NOT MET - CUI not encrypted during transmission",
                    fix: "Enforce TLS 1.2+ for all CUI transmission",
                    evidenceNeeded: ["TLS configuration", "Certificate management", "Encryption evidence"]
                },
                {
                    issue: "Non-FIPS cryptography used",
                    impact: "3.13.11 NOT MET - FIPS-validated crypto not employed",
                    fix: "Enable FIPS mode on systems processing CUI",
                    evidenceNeeded: ["FIPS mode configuration", "FIPS-validated module certificates"]
                },
                {
                    issue: "CUI not encrypted at rest",
                    impact: "3.13.16 NOT MET - CUI at rest not protected",
                    fix: "Enable encryption (BitLocker, disk encryption, database TDE)",
                    evidenceNeeded: ["Encryption configuration", "Key management", "Encrypted volume evidence"]
                }
            ],
            ccaTips: [
                "CCAs will verify FIPS mode is enabled, not just available",
                "CCAs will check TLS versions and cipher suites",
                "CCAs will verify encryption keys are properly managed",
                "CCAs will trace CUI flow and verify encryption at each point"
            ]
        },
        "SI": {
            commonGaps: [
                {
                    issue: "No endpoint protection",
                    impact: "3.14.2 NOT MET - Malicious code protection missing",
                    fix: "Deploy EDR/antivirus with auto-update and real-time scanning",
                    evidenceNeeded: ["AV deployment status", "Update configuration", "Scan schedules"]
                },
                {
                    issue: "Security alerts not monitored",
                    impact: "3.14.3 NOT MET - Security alerts not monitored",
                    fix: "Implement SIEM with alert review procedures",
                    evidenceNeeded: ["SIEM configuration", "Alert review procedures", "Escalation evidence"]
                },
                {
                    issue: "Systems not monitored for attacks",
                    impact: "3.14.6 NOT MET - Systems not monitored for unauthorized use",
                    fix: "Implement security monitoring with threat detection",
                    evidenceNeeded: ["IDS/SIEM alerts", "Monitoring dashboards", "Detection rules"]
                }
            ],
            ccaTips: [
                "CCAs will verify AV is installed on ALL in-scope systems",
                "CCAs will check AV definitions are current",
                "CCAs will request evidence of malware detection/response",
                "CCAs will verify monitoring covers all in-scope systems"
            ]
        }
    },

    // Assessment day tips
    assessmentDayTips: [
        {
            category: "Documentation Preparation",
            tips: [
                "Have SSP, POA&M, and all policies printed and organized",
                "Prepare evidence binders organized by control family",
                "Have network diagrams and data flow diagrams ready to present",
                "Ensure all document versions are current (check dates)",
                "Have SMEs scheduled and available for each control family"
            ]
        },
        {
            category: "Technical Readiness",
            tips: [
                "Verify all systems are in compliance before assessment",
                "Run fresh vulnerability scan 1-2 weeks before assessment",
                "Ensure all patches are current",
                "Verify MFA, encryption, logging are all functioning",
                "Have admin access ready to demonstrate controls"
            ]
        },
        {
            category: "Personnel Preparation",
            tips: [
                "Brief all personnel who may be interviewed",
                "Ensure everyone knows their role and responsibilities",
                "Practice answering common CCA questions",
                "Designate primary and backup SMEs for each domain",
                "Brief reception/security on CCA visit"
            ]
        },
        {
            category: "Common Mistakes to Avoid",
            tips: [
                "Don't oversell - CCAs appreciate honesty about gaps",
                "Don't guess - it's OK to say 'I'll get back to you'",
                "Don't argue with CCAs about requirements",
                "Don't hide known issues - they will likely find them",
                "Don't provide evidence you haven't reviewed first"
            ]
        }
    ],

    // Evidence quality checklist
    evidenceQuality: {
        goodEvidence: [
            "Dated and timestamped",
            "Shows system/tool name clearly",
            "Demonstrates control is implemented (not just available)",
            "Covers entire assessment scope",
            "Can be independently verified",
            "Shows continuous operation (not just point-in-time)"
        ],
        badEvidence: [
            "Undated screenshots",
            "Policy documents without approval signatures",
            "Configuration that doesn't match actual implementation",
            "Evidence from systems outside assessment scope",
            "Marketing materials instead of actual configuration",
            "Evidence that contradicts other documentation"
        ]
    },

    // Scoping pitfalls
    scopingPitfalls: [
        {
            issue: "Scope creep from poor CUI identification",
            impact: "Too many systems in scope, increased cost and complexity",
            fix: "Carefully identify CUI data flows before defining boundary"
        },
        {
            issue: "Excluding systems that process CUI",
            impact: "Assessment findings, potential certification failure",
            fix: "Include ALL systems that store, process, or transmit CUI"
        },
        {
            issue: "Not including cloud services",
            impact: "Missing controls for cloud-hosted CUI",
            fix: "Include FedRAMP-authorized cloud services in scope"
        },
        {
            issue: "Excluding mobile devices",
            impact: "Missing endpoint controls",
            fix: "Include all devices that access CUI (phones, tablets, laptops)"
        },
        {
            issue: "Forgetting about email",
            impact: "CUI in email not protected",
            fix: "Include email systems in scope if CUI is transmitted via email"
        }
    ]
};

// Helper function to get pitfalls for a control family
function getPitfallsForFamily(familyId) {
    return CCA_PITFALLS.byFamily[familyId] || null;
}

// Helper function to get all assessment day tips
function getAssessmentDayTips() {
    return CCA_PITFALLS.assessmentDayTips;
}

// Helper function to get evidence quality guidelines
function getEvidenceQualityGuidelines() {
    return CCA_PITFALLS.evidenceQuality;
}
