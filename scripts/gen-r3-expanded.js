#!/usr/bin/env node
// Generator script for R3 expanded platform guidance
// Adds: iam_pam, custom_apps, database, saas sections to R3 controls that lack them
// Covers: R3 main (AT, SR, PL), R3-new (CM, IA, IR), R3-new2 (PE, RA, CA, SI, PL, SA)

const fs = require('fs');

function tech(services, stepsArr, verification, cost, hours, cli) {
    const obj = { services, implementation: { steps: stepsArr, verification, cost_estimate: cost, effort_hours: hours } };
    if (cli) obj.implementation.cli_example = cli;
    return obj;
}

const data = {
    version: "1.0.0",
    lastUpdated: "2026-02-08",
    description: "Expanded platform guidance for Rev 3 controls — IAM/PAM, custom apps, databases, SaaS",
    objectives: {}
};

// ══════════════════════════════════════════════════════════════════════════
// AT.L2-3.2.1 — Security Awareness (R3 main)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["AT.L2-3.2.1"] = {
    saas: {
        knowbe4: tech(
            ["KnowBe4 Security Awareness Training", "KnowBe4 PhishER"],
            ["Deploy KnowBe4 security awareness training platform for all CUI-handling personnel",
             "Configure automated phishing simulation campaigns on monthly cadence",
             "Implement PhishER for automated suspicious email triage and response",
             "Create role-based training tracks (admin, user, executive) with CUI-specific modules",
             "Set up training completion dashboards and automated reminders for non-compliant users"],
            ["Verify training completion rates above 95%", "Review phishing simulation click rates", "Confirm role-based tracks assigned"],
            "$15-25/user/year", 12),
        proofpoint: tech(
            ["Proofpoint Security Awareness", "Proofpoint Targeted Attack Protection"],
            ["Deploy Proofpoint Security Awareness with CUI-focused training content",
             "Configure simulated phishing with real-world threat templates",
             "Implement Targeted Attack Protection for email-borne threat awareness",
             "Create custom training modules covering CMMC-specific requirements",
             "Set up automated reporting on training effectiveness and risk scores"],
            ["Verify training modules assigned", "Review simulation results", "Confirm TAP integration"],
            "$20-35/user/year", 10)
    },
    custom_apps: {
        nodejs: tech(
            ["Node.js", "Express.js", "Nodemailer"],
            ["Build internal security awareness portal using Express.js with training module tracking",
             "Implement training completion API tracking user progress and quiz scores",
             "Create automated email reminders using Nodemailer for overdue training",
             "Build dashboard showing training metrics per department and role",
             "Implement training content CMS allowing security team to update modules"],
            ["Test training tracking API", "Verify email reminders trigger correctly", "Review dashboard accuracy"],
            "$0 (open source)", 32)
    }
};

// Also map the Rev 3 format key
data.objectives["AT.L2-03.02.01"] = data.objectives["AT.L2-3.2.1"];

// ══════════════════════════════════════════════════════════════════════════
// AT.L2-3.2.2 — Role-Based Training (R3 main)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["AT.L2-3.2.2"] = {
    saas: {
        knowbe4: tech(
            ["KnowBe4 Security Awareness", "KnowBe4 Compliance Plus"],
            ["Configure role-based training assignments for privileged users and administrators",
             "Create custom training tracks for CUI system administrators vs general users",
             "Implement advanced social engineering simulations for high-risk roles",
             "Set up compliance tracking with automated escalation for non-completion",
             "Generate role-based training effectiveness reports for management review"],
            ["Verify role assignments match job functions", "Review advanced simulation results", "Confirm compliance tracking"],
            "$15-25/user/year", 8)
    }
};
data.objectives["AT.L2-03.02.02"] = data.objectives["AT.L2-3.2.2"];

// ══════════════════════════════════════════════════════════════════════════
// AT.L2-3.2.3 — Insider Threat Awareness (R3 main)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["AT.L2-3.2.3"] = {
    saas: {
        knowbe4: tech(
            ["KnowBe4 Security Awareness", "KnowBe4 Inside Man Series"],
            ["Deploy KnowBe4 Inside Man training series for insider threat awareness",
             "Configure insider threat indicator recognition training for managers",
             "Implement behavioral indicator reporting mechanisms within training platform",
             "Create custom insider threat scenarios relevant to CUI handling",
             "Set up annual insider threat awareness refresher training"],
            ["Verify insider threat training assigned to all personnel", "Review training completion", "Confirm reporting mechanisms work"],
            "$15-25/user/year", 8)
    },
    iam_pam: {
        cyberark: tech(
            ["CyberArk Identity", "CyberArk Insider Threat Analytics"],
            ["Deploy CyberArk behavioral analytics to detect insider threat indicators",
             "Configure privileged session monitoring for anomalous behavior patterns",
             "Implement user behavior baseline with deviation alerting",
             "Create insider threat risk scoring based on access patterns and behavior",
             "Integrate insider threat alerts with security awareness training triggers"],
            ["Verify behavioral analytics active", "Test anomaly detection", "Review risk scoring accuracy"],
            "$5,000-15,000/year", 20)
    }
};
data.objectives["AT.L2-03.02.03"] = data.objectives["AT.L2-3.2.3"];

// ══════════════════════════════════════════════════════════════════════════
// SR.L2-03.17.01 — Supply Chain Risk Management Policy (R3 main)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["SR.L2-03.17.01"] = {
    saas: {
        servicenow: tech(
            ["ServiceNow Vendor Risk Management", "ServiceNow GRC"],
            ["Configure ServiceNow VRM for supply chain risk assessment workflows",
             "Implement vendor questionnaire automation for CMMC supply chain requirements",
             "Create vendor risk scoring model incorporating cybersecurity posture",
             "Set up continuous vendor monitoring with automated risk recalculation",
             "Generate supply chain risk reports for management review"],
            ["Verify vendor assessments completed", "Test risk scoring model", "Review monitoring alerts"],
            "$100-200/user/month", 24)
    },
    custom_apps: {
        nodejs: tech(
            ["Node.js", "Express.js", "npm audit", "Socket.dev"],
            ["Implement software supply chain scanning using npm audit in CI/CD pipeline",
             "Deploy Socket.dev for real-time dependency risk monitoring",
             "Create vendor/dependency risk registry API tracking all third-party components",
             "Implement automated SBOM generation for all deployed applications",
             "Build supply chain risk dashboard showing dependency health and vulnerabilities"],
            ["Verify npm audit runs on every build", "Test Socket.dev alerting", "Review SBOM completeness"],
            "$0-100/month", 20),
        python: tech(
            ["Python", "pip-audit", "Safety", "CycloneDX"],
            ["Integrate pip-audit and Safety into CI/CD for Python dependency scanning",
             "Generate CycloneDX SBOMs for all Python applications",
             "Create dependency allowlist restricting approved packages",
             "Implement automated vulnerability notification for dependency updates",
             "Build supply chain risk tracking for all Python third-party libraries"],
            ["Verify pip-audit in CI/CD", "Test SBOM generation", "Review allowlist enforcement"],
            "$0 (open source)", 16)
    },
    database: {
        mssql: tech(
            ["SQL Server 2022", "SQL Vulnerability Assessment"],
            ["Enable SQL Vulnerability Assessment scanning for all CUI databases",
             "Document all third-party database components and extensions in supply chain inventory",
             "Implement database patching policy aligned with vendor security advisories",
             "Create database SBOM listing all installed extensions, drivers, and connectors",
             "Review and approve all database-level third-party integrations"],
            ["Verify vulnerability assessment runs weekly", "Review SBOM completeness", "Confirm patching cadence"],
            "$0 (included)", 12)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// SR.L2-03.17.02 — Supply Chain Risk Assessment (R3 main)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["SR.L2-03.17.02"] = {
    saas: {
        servicenow: tech(
            ["ServiceNow VRM", "ServiceNow Third-Party Risk"],
            ["Implement ServiceNow Third-Party Risk Management for vendor assessments",
             "Configure automated vendor security questionnaires with scoring",
             "Create risk assessment workflows for new vendor onboarding",
             "Implement continuous monitoring of vendor security posture changes",
             "Generate vendor risk heat maps for executive reporting"],
            ["Verify vendor assessments current", "Test automated questionnaires", "Review heat map accuracy"],
            "$100-200/user/month", 20)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// SR.L2-03.17.03 — Supply Chain Controls (R3 main)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["SR.L2-03.17.03"] = {
    custom_apps: {
        nodejs: tech(
            ["Node.js", "Verdaccio", "Snyk", "Sigstore"],
            ["Deploy Verdaccio private npm registry as approved package source",
             "Implement Snyk for continuous dependency vulnerability monitoring",
             "Use Sigstore for software artifact signing and verification",
             "Create package approval workflow for new dependency requests",
             "Implement automated SBOM generation and attestation for releases"],
            ["Verify private registry enforced", "Test Snyk monitoring", "Review signing verification"],
            "$0-200/month", 16)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// PL.L2-03.15.01 — Security Planning Policy (R3 main)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["PL.L2-03.15.01"] = {
    saas: {
        servicenow: tech(
            ["ServiceNow GRC", "ServiceNow Policy Management"],
            ["Configure ServiceNow Policy Management for security planning documentation",
             "Create policy lifecycle workflows with review, approval, and distribution tracking",
             "Implement automated policy compliance checking against CMMC requirements",
             "Set up policy acknowledgment tracking for all CUI-handling personnel",
             "Generate policy gap analysis reports comparing current state to requirements"],
            ["Verify policy lifecycle tracking", "Test compliance checking", "Review acknowledgment rates"],
            "$100-200/user/month", 16)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// PL.L2-03.15.02 — System Security Plan (R3 main)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["PL.L2-03.15.02"] = {
    saas: {
        servicenow: tech(
            ["ServiceNow GRC", "ServiceNow CMDB"],
            ["Use ServiceNow GRC to maintain living SSP document with automated updates",
             "Integrate CMDB data to auto-populate system boundary and component inventory in SSP",
             "Create SSP review workflows with annual review and change-triggered updates",
             "Implement SSP version control with approval tracking and change history",
             "Generate SSP appendices from live CMDB and vulnerability data"],
            ["Verify SSP reflects current system state", "Test automated updates", "Review version history"],
            "$100-200/user/month", 20)
    },
    custom_apps: {
        nodejs: tech(
            ["Node.js", "Markdown", "Pandoc", "Git"],
            ["Maintain SSP as Markdown documents in Git repository with version control",
             "Create Node.js scripts to auto-generate SSP sections from system inventory data",
             "Implement CI/CD pipeline converting Markdown SSP to PDF using Pandoc",
             "Build SSP validation scripts checking completeness against CMMC control requirements",
             "Create automated SSP diff reports showing changes since last review"],
            ["Verify SSP in version control", "Test auto-generation scripts", "Review validation output"],
            "$0 (open source)", 24)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// CM.L2-03.04.10 — System Component Inventory (R3-new)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["CM.L2-03.04.10"] = {
    saas: {
        servicenow: tech(
            ["ServiceNow CMDB", "ServiceNow Discovery", "ServiceNow SAM"],
            ["Deploy ServiceNow Discovery for automated system component inventory",
             "Configure CMDB to track all hardware, software, and firmware components",
             "Implement Software Asset Management for license and version tracking",
             "Create automated reconciliation between CMDB and network scan results",
             "Set up change detection alerts for unauthorized component additions"],
            ["Verify CMDB completeness against network scans", "Test change detection", "Review reconciliation reports"],
            "$100-200/user/month", 20)
    },
    custom_apps: {
        nodejs: tech(
            ["Node.js", "nmap", "systeminformation"],
            ["Build automated inventory collection agent using systeminformation library",
             "Create REST API for centralized component inventory management",
             "Implement scheduled network scanning using nmap for discovery validation",
             "Build inventory dashboard showing all system components with version tracking",
             "Create drift detection comparing current inventory against approved baseline"],
            ["Test inventory agent collection", "Verify API stores all components", "Review drift detection"],
            "$0 (open source)", 28)
    },
    database: {
        mssql: tech(
            ["SQL Server 2022", "sys.dm_os_loaded_modules", "SERVERPROPERTY"],
            ["Query sys.dm_os_loaded_modules to inventory all loaded database components",
             "Document all installed SQL Server features, services, and extensions",
             "Create inventory stored procedure capturing version, patch level, and configuration",
             "Implement automated weekly inventory snapshots stored in audit table",
             "Track all database client drivers and connection libraries in use"],
            ["Verify inventory captures all modules", "Test weekly snapshot automation", "Review driver inventory"],
            "$0 (included)", 8),
        postgresql: tech(
            ["PostgreSQL 16", "pg_available_extensions", "pg_stat_activity"],
            ["Query pg_available_extensions and pg_extension to inventory all installed extensions",
             "Document PostgreSQL version, compile options, and loaded shared libraries",
             "Create inventory function capturing all database objects and their versions",
             "Implement automated inventory export to centralized CMDB",
             "Track all client libraries and connection poolers in use"],
            ["Verify extension inventory complete", "Test automated export", "Review client library tracking"],
            "$0 (open source)", 6)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// CM.L2-03.04.11 — Information Location (R3-new)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["CM.L2-03.04.11"] = {
    saas: {
        m365: tech(
            ["Microsoft 365 GCC High", "Purview Data Map", "Purview Information Protection"],
            ["Deploy Purview Data Map to discover and classify CUI across M365 services",
             "Configure sensitive information types for CUI identification",
             "Implement Purview Information Protection labels for CUI marking",
             "Create data flow maps showing CUI movement between M365 services",
             "Set up DLP policies alerting on CUI in unauthorized locations"],
            ["Verify Data Map covers all M365 services", "Test CUI classification accuracy", "Review DLP alerts"],
            "$57/user/month (G5)", 16)
    },
    database: {
        mssql: tech(
            ["SQL Server 2022", "Data Classification", "Dynamic Data Masking"],
            ["Enable SQL Server Data Classification to identify and label CUI columns",
             "Implement Dynamic Data Masking for CUI fields in non-production environments",
             "Create data lineage documentation showing CUI flow through database objects",
             "Configure audit policies specifically for CUI-classified columns",
             "Generate CUI location report listing all tables, columns, and databases containing CUI"],
            ["Verify all CUI columns classified", "Test masking in non-prod", "Review location report"],
            "$0 (included)", 12),
        postgresql: tech(
            ["PostgreSQL 16", "COMMENT", "Row-Level Security"],
            ["Use PostgreSQL COMMENT to label CUI-containing tables and columns",
             "Implement Row-Level Security policies restricting CUI access by role",
             "Create CUI data catalog documenting all schemas, tables, and columns with CUI",
             "Implement audit triggers on CUI-classified tables logging all access",
             "Generate automated CUI location reports from database metadata"],
            ["Verify CUI labels applied", "Test RLS enforcement", "Review catalog completeness"],
            "$0 (open source)", 10)
    },
    custom_apps: {
        nodejs: tech(
            ["Node.js", "Express.js", "DLP libraries"],
            ["Implement data classification middleware tagging API responses containing CUI",
             "Create CUI data flow map documenting all application data paths",
             "Build automated CUI discovery scanning file systems and databases",
             "Implement logging of all CUI data access with source and destination tracking",
             "Create CUI location dashboard showing all systems and storage containing CUI"],
            ["Test classification middleware accuracy", "Verify data flow map completeness", "Review discovery results"],
            "$0 (open source)", 24)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// CM.L2-03.04.12 — High-Risk Area Configuration (R3-new)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["CM.L2-03.04.12"] = {
    custom_apps: {
        nodejs: tech(
            ["Node.js", "helmet", "express-rate-limit", "csurf"],
            ["Implement security hardening middleware (helmet, rate-limit, CSRF protection) for high-risk endpoints",
             "Create configuration profiles for high-risk vs standard deployment environments",
             "Implement automated security configuration scanning for high-risk application components",
             "Deploy additional logging and monitoring on high-risk application paths",
             "Create security configuration baseline documents for high-risk deployments"],
            ["Test hardening middleware active", "Verify high-risk logging", "Review configuration baselines"],
            "$0 (open source)", 16)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// IA.L2-03.05.12 — Authenticator Management (R3-new)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["IA.L2-03.05.12"] = {
    iam_pam: {
        cyberark: tech(
            ["CyberArk Identity", "CyberArk Privileged Access Manager"],
            ["Configure CyberArk for centralized authenticator lifecycle management",
             "Implement automated credential rotation policies for all service accounts",
             "Deploy hardware token management with issuance, revocation, and replacement tracking",
             "Create authenticator inventory tracking all MFA devices, certificates, and credentials",
             "Enable automated alerting for expired or compromised authenticators"],
            ["Verify credential rotation active", "Test token lifecycle management", "Review authenticator inventory"],
            "$5,000-15,000/year", 20),
        delinea: tech(
            ["Delinea Secret Server", "Delinea Privilege Manager"],
            ["Configure Secret Server for automated password rotation on all managed accounts",
             "Implement Privilege Manager for endpoint credential management",
             "Create authenticator lifecycle policies covering issuance through revocation",
             "Set up automated alerts for credentials approaching expiration",
             "Enable audit logging for all authenticator management operations"],
            ["Verify rotation policies active", "Test expiration alerts", "Review audit logs"],
            "$3,000-10,000/year", 16)
    },
    custom_apps: {
        nodejs: tech(
            ["Node.js", "bcrypt", "jsonwebtoken", "speakeasy"],
            ["Implement secure password hashing using bcrypt with appropriate cost factor",
             "Create JWT token management with short-lived tokens and refresh rotation",
             "Implement TOTP authenticator enrollment and management using speakeasy",
             "Build credential lifecycle API handling issuance, rotation, and revocation",
             "Create automated credential expiration and renewal notification system"],
            ["Test password hashing strength", "Verify JWT rotation works", "Review TOTP enrollment flow"],
            "$0 (open source)", 20)
    },
    saas: {
        m365: tech(
            ["Microsoft 365 GCC High", "Entra ID", "Microsoft Authenticator"],
            ["Configure Entra ID authentication methods policy managing allowed authenticators",
             "Implement FIDO2 security key registration and lifecycle management",
             "Set up Microsoft Authenticator with number matching and additional context",
             "Create Conditional Access policies enforcing authenticator strength requirements",
             "Enable authentication methods activity reports for lifecycle monitoring"],
            ["Verify authentication methods policy", "Test FIDO2 lifecycle", "Review activity reports"],
            "$57/user/month (G5)", 12)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// IR.L2-03.06.04 — Incident Response Training (R3-new)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["IR.L2-03.06.04"] = {
    saas: {
        knowbe4: tech(
            ["KnowBe4 Security Awareness", "KnowBe4 Incident Response Training"],
            ["Deploy incident response training modules for all security team members",
             "Configure tabletop exercise simulations for CUI breach scenarios",
             "Implement role-specific IR training (first responder, analyst, manager)",
             "Create automated training assignments triggered by IR plan updates",
             "Track IR training completion and competency assessment scores"],
            ["Verify IR training assigned to all IR team", "Review tabletop exercise results", "Confirm competency scores"],
            "$15-25/user/year", 12)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// IR.L2-03.06.05 — Incident Response Plan (R3-new)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["IR.L2-03.06.05"] = {
    saas: {
        servicenow: tech(
            ["ServiceNow SecOps", "ServiceNow ITSM"],
            ["Configure ServiceNow SecOps as the incident response management platform",
             "Create IR playbooks aligned with NIST SP 800-61 and CMMC requirements",
             "Implement automated incident classification and escalation workflows",
             "Set up integration with SIEM for automated incident creation",
             "Create IR plan review workflows with annual update tracking"],
            ["Verify playbooks cover all incident types", "Test escalation workflows", "Review annual update status"],
            "$100-200/user/month", 20)
    },
    custom_apps: {
        nodejs: tech(
            ["Node.js", "Express.js", "Nodemailer", "PagerDuty API"],
            ["Build incident response tracking application with Node.js/Express",
             "Implement automated incident notification using Nodemailer and PagerDuty",
             "Create incident timeline tracking with evidence attachment support",
             "Build IR metrics dashboard showing MTTD, MTTR, and incident trends",
             "Implement post-incident review workflow with lessons learned tracking"],
            ["Test incident creation and notification", "Verify timeline tracking", "Review metrics accuracy"],
            "$0 (open source) + PagerDuty", 32)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// PE.L2-03.10.08 — Access Control for Transmission (R3-new2)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["PE.L2-03.10.08"] = {
    custom_apps: {
        nodejs: tech(
            ["Node.js", "tls", "crypto", "helmet"],
            ["Implement TLS 1.3 for all application data transmission with certificate pinning",
             "Configure HSTS headers using helmet middleware for all web endpoints",
             "Implement mutual TLS (mTLS) for service-to-service communication",
             "Create encrypted API communication channels for CUI data transfer",
             "Log all data transmission events with encryption status verification"],
            ["Verify TLS 1.3 enforced", "Test mTLS between services", "Review transmission logs"],
            "$0 (open source)", 16)
    },
    database: {
        mssql: tech(
            ["SQL Server 2022", "TLS/SSL", "Always Encrypted"],
            ["Configure SQL Server to require TLS 1.2+ for all client connections",
             "Implement Always Encrypted for CUI data transmitted between app and database",
             "Enable Force Encryption on SQL Server instance",
             "Configure certificate-based authentication for database connections",
             "Audit all unencrypted connection attempts and block them"],
            ["Verify TLS required on all connections", "Test Always Encrypted", "Review connection audit"],
            "$0 (included)", 8)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// RA.L2-03.11.04 — Risk Response (R3-new2)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["RA.L2-03.11.04"] = {
    saas: {
        servicenow: tech(
            ["ServiceNow GRC", "ServiceNow Risk Management"],
            ["Configure ServiceNow Risk Management for risk response tracking and workflows",
             "Create risk response plans with accept, mitigate, transfer, or avoid options",
             "Implement automated risk response tracking with milestone and deadline monitoring",
             "Set up risk response effectiveness measurement and reporting",
             "Generate executive risk response dashboards showing remediation progress"],
            ["Verify risk responses documented", "Test milestone tracking", "Review dashboard accuracy"],
            "$100-200/user/month", 16)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// CA.L2-03.12.05 — Information Exchange (R3-new2)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["CA.L2-03.12.05"] = {
    saas: {
        m365: tech(
            ["Microsoft 365 GCC High", "Purview DLP", "Exchange Online"],
            ["Configure Purview DLP policies controlling CUI sharing with external organizations",
             "Implement Exchange Online mail flow rules for CUI-labeled email handling",
             "Set up sensitivity labels for CUI documents shared externally",
             "Configure SharePoint external sharing policies restricting CUI access",
             "Create information exchange agreements tracked in Purview Compliance"],
            ["Verify DLP policies active", "Test external sharing restrictions", "Review exchange agreements"],
            "$57/user/month (G5)", 16)
    },
    custom_apps: {
        nodejs: tech(
            ["Node.js", "Express.js", "crypto", "multer"],
            ["Implement secure file exchange API with encryption-at-rest and in-transit",
             "Create partner authentication and authorization for data exchange endpoints",
             "Implement DLP scanning middleware for outbound CUI data transfers",
             "Build audit trail for all information exchanges with partner organizations",
             "Create exchange agreement management module tracking approved partners"],
            ["Test encryption on file exchange", "Verify partner authentication", "Review audit trail"],
            "$0 (open source)", 24)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// SI.L2-03.14.08 — Information Management and Retention (R3-new2)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["SI.L2-03.14.08"] = {
    saas: {
        m365: tech(
            ["Microsoft 365 GCC High", "Purview Data Lifecycle", "Purview Records Management"],
            ["Configure Purview retention policies for CUI with appropriate retention periods",
             "Implement Records Management labels for CUI requiring specific retention",
             "Set up automated disposition reviews for CUI reaching end of retention",
             "Configure retention policies across Exchange, SharePoint, OneDrive, and Teams",
             "Create retention compliance reports for audit evidence"],
            ["Verify retention policies applied", "Test disposition workflow", "Review compliance reports"],
            "$57/user/month (G5)", 12)
    },
    database: {
        mssql: tech(
            ["SQL Server 2022", "Temporal Tables", "Partition Management"],
            ["Implement Temporal Tables for CUI data retention with system-versioned history",
             "Configure partition management for efficient data lifecycle handling",
             "Create automated data purge procedures for CUI past retention period",
             "Implement data archival procedures with encrypted archive storage",
             "Set up retention compliance monitoring with automated reporting"],
            ["Verify temporal tables active on CUI tables", "Test purge procedures", "Review retention reports"],
            "$0 (included)", 12),
        postgresql: tech(
            ["PostgreSQL 16", "pg_partman", "pg_cron"],
            ["Implement table partitioning using pg_partman for CUI data lifecycle management",
             "Configure pg_cron for automated retention enforcement and data purging",
             "Create archived partition management with encrypted cold storage",
             "Implement retention policy metadata on CUI tables using COMMENT",
             "Build automated retention compliance reports from partition metadata"],
            ["Verify partitioning active", "Test automated purging", "Review compliance reports"],
            "$0 (open source)", 10)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// PL.L2-03.15.03 — Rules of Behavior (R3-new2)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["PL.L2-03.15.03"] = {
    saas: {
        m365: tech(
            ["Microsoft 365 GCC High", "Entra ID Terms of Use", "Intune"],
            ["Configure Entra ID Terms of Use requiring acceptance before CUI system access",
             "Implement Intune compliance policies enforcing rules of behavior on devices",
             "Create custom Terms of Use documents covering CUI handling requirements",
             "Set up periodic re-acceptance requirements (annual or on policy change)",
             "Generate Terms of Use acceptance reports for compliance evidence"],
            ["Verify Terms of Use required at login", "Test re-acceptance triggers", "Review acceptance reports"],
            "$57/user/month (G5)", 8)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// SA.L2-03.16.01 — Security Engineering Principles (R3-new2)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["SA.L2-03.16.01"] = {
    custom_apps: {
        nodejs: tech(
            ["Node.js", "OWASP", "ESLint Security", "SonarQube"],
            ["Implement OWASP Top 10 security controls in all Node.js applications",
             "Configure ESLint with security plugins for secure coding standards enforcement",
             "Deploy SonarQube for continuous code quality and security analysis",
             "Create secure coding guidelines document for Node.js development team",
             "Implement security architecture review process for all new features"],
            ["Verify ESLint security rules active", "Test SonarQube scanning", "Review coding guidelines"],
            "$0-500/month", 20),
        dotnet: tech(
            [".NET 8", "Roslyn Analyzers", "SonarQube", "OWASP"],
            ["Enable Roslyn security analyzers in all .NET projects",
             "Implement OWASP security controls in ASP.NET Core applications",
             "Deploy SonarQube for continuous security analysis of .NET code",
             "Create secure development lifecycle (SDL) procedures for .NET team",
             "Implement threat modeling using STRIDE for all new application features"],
            ["Verify Roslyn analyzers active", "Test SonarQube integration", "Review SDL procedures"],
            "$0-500/month", 20),
        python: tech(
            ["Python", "Bandit", "Safety", "SonarQube"],
            ["Integrate Bandit static analysis for Python security scanning in CI/CD",
             "Implement Safety for dependency vulnerability checking",
             "Deploy SonarQube for continuous Python code security analysis",
             "Create Python secure coding standards document aligned with OWASP",
             "Implement security code review process for all pull requests"],
            ["Verify Bandit runs in CI/CD", "Test Safety scanning", "Review code review process"],
            "$0-500/month", 16)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// SA.L2-03.16.02 — Unsupported System Components (R3-new2)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["SA.L2-03.16.02"] = {
    saas: {
        servicenow: tech(
            ["ServiceNow CMDB", "ServiceNow SAM", "ServiceNow Lifecycle Events"],
            ["Configure ServiceNow SAM to track software end-of-life and end-of-support dates",
             "Create automated alerts for components approaching end-of-support",
             "Implement lifecycle event tracking for all CUI system components",
             "Create migration plans for unsupported components with timeline tracking",
             "Generate unsupported component risk reports for management review"],
            ["Verify EOL tracking active", "Test alert generation", "Review migration plans"],
            "$100-200/user/month", 12)
    },
    database: {
        mssql: tech(
            ["SQL Server", "Microsoft Lifecycle Policy"],
            ["Document SQL Server version and support lifecycle status",
             "Create migration plan for any SQL Server versions approaching end-of-support",
             "Implement compensating controls for any temporarily unsupported database versions",
             "Track all database client drivers and their support status",
             "Set up automated alerts for upcoming SQL Server end-of-support dates"],
            ["Verify version support status documented", "Review migration plan", "Test alert system"],
            "$0 (documentation)", 8)
    }
};

// ══════════════════════════════════════════════════════════════════════════
// SA.L2-03.16.03 — External System Services (R3-new2)
// ══════════════════════════════════════════════════════════════════════════
data.objectives["SA.L2-03.16.03"] = {
    saas: {
        servicenow: tech(
            ["ServiceNow VRM", "ServiceNow GRC"],
            ["Configure ServiceNow VRM for external service provider risk assessment",
             "Create service level agreements (SLAs) with security requirements for all external services",
             "Implement continuous monitoring of external service provider security posture",
             "Track external service provider compliance with CMMC flow-down requirements",
             "Generate external service risk reports for management review"],
            ["Verify VRM assessments current", "Test SLA monitoring", "Review compliance tracking"],
            "$100-200/user/month", 16)
    },
    custom_apps: {
        nodejs: tech(
            ["Node.js", "Express.js", "API Gateway"],
            ["Implement API gateway for all external service integrations with monitoring",
             "Create external service inventory documenting all third-party API dependencies",
             "Implement circuit breaker patterns for external service resilience",
             "Build external service health monitoring dashboard",
             "Create automated external service security assessment questionnaires"],
            ["Verify API gateway covers all external calls", "Test circuit breakers", "Review service inventory"],
            "$0 (open source)", 20)
    }
};

// ── Write output ────────────────────────────────────────────────────────
const header = `// Comprehensive Implementation Guidance - R3 Expanded Platforms
// Supplements R3, R3-new, and R3-new2 guidance with: iam_pam, custom_apps, database, saas
// Covers Rev 3 controls across AT, SR, PL, CM, IA, IR, PE, RA, CA, SI, SA families
// Auto-generated by scripts/gen-r3-expanded.js on ${new Date().toISOString().slice(0,10)}

const COMPREHENSIVE_GUIDANCE_R3_EXPANDED = `;

const output = header + JSON.stringify(data, null, 4) + ';\n';
fs.writeFileSync('data/comprehensive-guidance-r3-expanded.js', output, 'utf8');
console.log('Written data/comprehensive-guidance-r3-expanded.js');
console.log('Controls covered:', Object.keys(data.objectives).length);
let totalTechs = 0;
for (const key of Object.keys(data.objectives)) {
    const obj = data.objectives[key];
    for (const section of Object.keys(obj)) {
        if (typeof obj[section] === 'object' && obj[section].services) { totalTechs++; continue; }
        totalTechs += Object.keys(obj[section]).length;
    }
}
console.log('Total technology entries:', totalTechs);
