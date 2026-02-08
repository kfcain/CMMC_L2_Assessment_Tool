#!/usr/bin/env node
// Generator script for L3 expanded platform guidance
// Adds: iam_pam, custom_apps, database, saas, small_business sections to all 23 L3 controls

const fs = require('fs');

function svc(arr) { return JSON.stringify(arr); }
function steps(arr) { return JSON.stringify(arr); }

const data = {
    version: "1.0.0",
    lastUpdated: "2026-02-08",
    description: "Expanded platform guidance for L3 controls — IAM/PAM, custom apps, databases, SaaS, small business",
    objectives: {}
};

// Helper to build a tech entry
function tech(services, stepsArr, verification, cost, hours, cli) {
    const obj = {
        services,
        implementation: { steps: stepsArr, verification, cost_estimate: cost, effort_hours: hours }
    };
    if (cli) obj.implementation.cli_example = cli;
    return obj;
}

// Helper for small_business (flat structure, no nested tech key)
function sb(services, stepsArr, verification, cost, hours) {
    return { services, implementation: { steps: stepsArr, verification, cost_estimate: cost, effort_hours: hours } };
}

// ══════════════════════════════════════════════════════════════════════════
// AC.L3-3.1.1e — Dual Authorization
// ══════════════════════════════════════════════════════════════════════════
data.objectives["AC.L3-3.1.1e"] = {
    iam_pam: {
        cyberark: tech(
            ["CyberArk Privileged Access Manager","CyberArk Conjur","CyberArk Identity"],
            ["Configure CyberArk Dual Control for privileged session approval requiring two authorized users",
             "Implement PAM safe-level dual authorization for credential checkout",
             "Deploy Conjur secrets management with dual-approval workflows for secret rotation",
             "Enable session recording with mandatory second-party review before access grant",
             "Configure CyberArk Identity MFA with approval workflows for sensitive operations"],
            ["Verify dual control enforced on all privileged safes","Review session recordings","Test approval workflow"],
            "$5,000-15,000/year", 32),
        delinea: tech(
            ["Delinea Secret Server","Delinea Privilege Manager","Delinea Server PAM"],
            ["Enable Secret Server dual-control approval requiring two approvers for secret checkout",
             "Configure Privilege Manager application control with dual-approval for elevation requests",
             "Implement Server PAM session management requiring supervisor approval for critical systems",
             "Set up workflow templates requiring dual authorization for password disclosure",
             "Enable audit trails for all dual-authorization events with tamper-proof logging"],
            ["Verify approval workflows require two distinct approvers","Review audit logs","Test dual-control on critical secrets"],
            "$3,000-10,000/year", 24)
    },
    custom_apps: {
        nodejs: tech(
            ["Node.js","Express.js","Passport.js","Redis"],
            ["Implement dual-approval middleware in Express.js requiring two authenticated approvers per critical action",
             "Create approval queue using Redis-backed job queue for pending dual-auth requests",
             "Add Passport.js strategy validating both initiator and approver are distinct authorized users",
             "Implement WebSocket notifications to alert second approver when action is pending",
             "Log all dual-authorization events to immutable audit log with request/approval timestamps"],
            ["Unit test dual-approval middleware rejects single-user approval","Integration test full workflow","Verify audit log captures both identities"],
            "$0 (open source)", 40,
            "// Express.js dual-approval middleware\nconst dualApproval = require('./middleware/dual-approval');\napp.post('/api/critical-action', dualApproval.initiate, handler);\napp.post('/api/critical-action/:id/approve', dualApproval.approve, handler);"),
        dotnet: tech(
            [".NET 8","ASP.NET Core","Entity Framework Core","MediatR"],
            ["Implement IAuthorizationHandler requiring two distinct ClaimsPrincipal approvals for critical operations",
             "Create ApprovalRequest entity in EF Core tracking initiator, approver, status, and timestamps",
             "Use MediatR pipeline behavior to intercept critical commands and route through approval workflow",
             "Implement SignalR hub for real-time approval notifications to designated approvers",
             "Add audit logging middleware capturing all dual-authorization decisions with correlation IDs"],
            ["Verify handler rejects self-approval","Test workflow with concurrent requests","Review audit trail"],
            "$0 (open source)", 36),
        python: tech(
            ["Python 3.12","Django","Celery","SQLAlchemy"],
            ["Create Django dual-approval decorator requiring two authenticated users for protected views",
             "Implement approval model tracking request, initiator, approver, status, and audit trail",
             "Use Celery tasks for asynchronous approval notification and timeout handling",
             "Add Django signals to trigger approval workflows on critical model changes",
             "Implement tamper-proof audit logging using append-only database table with hash chains"],
            ["Test decorator blocks single-user operations","Verify Celery timeout expires unapproved requests","Audit log integrity check"],
            "$0 (open source)", 32)
    },
    database: {
        mssql: tech(
            ["SQL Server 2022","Always Encrypted","SQL Audit"],
            ["Implement stored procedures requiring two distinct database principals for DDL operations",
             "Configure SQL Server Audit to log all schema changes and privileged operations",
             "Create approval table tracking dual-authorization requests with initiator/approver columns",
             "Use database triggers to enforce dual-approval on DELETE/TRUNCATE of sensitive tables",
             "Enable TDE and Always Encrypted for CUI data at rest"],
            ["Verify DDL operations fail without dual approval","Review SQL Audit logs","Test trigger enforcement"],
            "$0-5,000/year", 20),
        postgresql: tech(
            ["PostgreSQL 16","pgAudit","Row-Level Security","pg_crypto"],
            ["Implement PostgreSQL functions requiring two role authentications for critical DDL",
             "Enable pgAudit extension logging all privileged operations with session details",
             "Create approval schema with RLS policies restricting approval to authorized roles",
             "Use event triggers to intercept and require dual-approval for schema modifications",
             "Configure pg_crypto for encryption of CUI columns with key management procedures"],
            ["Test event triggers block unauthorized schema changes","Verify pgAudit captures all events","Review RLS effectiveness"],
            "$0 (open source)", 18)
    },
    saas: {
        m365: tech(
            ["Microsoft 365 GCC High","Entra ID Governance","Purview Compliance"],
            ["Configure Entra ID PIM requiring two approvers for role activation",
             "Implement Access Reviews requiring dual sign-off for continued privileged access",
             "Enable Purview dual-key encryption for highly sensitive CUI documents",
             "Configure Exchange Online dual-approval for mail flow rule changes",
             "Set up SharePoint site-level approval workflows for CUI content modifications"],
            ["Verify PIM requires two distinct approvers","Test dual-key encryption","Review Access Review completion"],
            "$57/user/month (M365 G5)", 16),
        servicenow: tech(
            ["ServiceNow GRC","ServiceNow ITSM","ServiceNow SecOps"],
            ["Configure Change Management requiring two CAB approvals for critical changes",
             "Implement GRC policy exception workflow with dual-authorization requirement",
             "Set up SecOps incident escalation requiring two analysts for containment actions",
             "Create custom approval workflows for privileged access requests",
             "Enable audit logging for all approval decisions with tamper-proof records"],
            ["Verify change requests require two CAB approvals","Test policy exception flow","Review audit trail"],
            "$100-200/user/month", 24)
    },
    small_business: sb(
        ["Microsoft 365 Business Premium","Duo Security","JumpCloud"],
        ["Configure Microsoft 365 requiring two Global Admins to approve tenant-level changes",
         "Implement Duo Security with push approval for critical operations requiring second user",
         "Use JumpCloud conditional access policies requiring manager approval for privileged access",
         "Create a manual dual-authorization log for operations that cannot be automated",
         "Document dual-authorization procedures in security policy with designated approver list"],
        ["Verify two admins required for tenant changes","Test Duo push approval","Review manual log monthly"],
        "$22/user/month + $3/user Duo", 8)
};

// ══════════════════════════════════════════════════════════════════════════
// AC.L3-3.1.2e — Restrict Privileged Account Access
// ══════════════════════════════════════════════════════════════════════════
data.objectives["AC.L3-3.1.2e"] = {
    iam_pam: {
        cyberark: tech(
            ["CyberArk Privileged Access Manager","CyberArk Endpoint Privilege Manager"],
            ["Deploy CyberArk EPM to restrict privileged access to organization-owned endpoints only",
             "Configure PAM policies limiting credential checkout to compliant managed devices",
             "Implement device trust verification before granting privileged session access",
             "Enable session isolation preventing lateral movement from unmanaged devices",
             "Create device compliance policies blocking BYOD from accessing privileged accounts"],
            ["Verify unmanaged devices cannot checkout credentials","Test session isolation","Review device compliance logs"],
            "$5,000-15,000/year", 28)
    },
    custom_apps: {
        nodejs: tech(
            ["Node.js","Express.js","device-detector-js"],
            ["Implement device fingerprinting middleware validating organization-issued device certificates",
             "Create device registry API tracking approved organization-owned endpoints",
             "Add Express.js middleware rejecting requests from unregistered device fingerprints",
             "Implement certificate pinning for API clients ensuring only org-provisioned apps connect",
             "Log all device validation events including rejected access attempts"],
            ["Test API rejects unregistered devices","Verify certificate pinning","Review validation logs"],
            "$0 (open source)", 24),
        dotnet: tech(
            [".NET 8","ASP.NET Core","Microsoft.Identity.Web"],
            ["Implement client certificate authentication requiring organization-issued certificates",
             "Create custom IAuthorizationRequirement validating device compliance claims from Entra ID",
             "Add middleware checking device ID against approved device inventory database",
             "Configure Kestrel to require and validate client certificates on all endpoints",
             "Implement device attestation verification for mobile and desktop clients"],
            ["Verify unauthenticated devices receive 403","Test compliance claim validation","Review cert revocation"],
            "$0 (open source)", 20)
    },
    small_business: sb(
        ["Microsoft Intune","Conditional Access","JumpCloud MDM"],
        ["Configure Intune device compliance policies requiring encryption and up-to-date OS",
         "Set up Conditional Access blocking access from non-compliant or unmanaged devices",
         "Implement JumpCloud MDM policies restricting CUI access to managed devices only",
         "Create asset inventory of all organization-owned devices with serial numbers",
         "Document BYOD prohibition policy for CUI-handling systems"],
        ["Test access blocked from personal device","Verify compliance enforcement","Review device inventory"],
        "$8/device/month", 12)
};

// ══════════════════════════════════════════════════════════════════════════
// AC.L3-3.1.3e — Control Remote Access Sessions
// ══════════════════════════════════════════════════════════════════════════
data.objectives["AC.L3-3.1.3e"] = {
    iam_pam: {
        cyberark: tech(
            ["CyberArk Privileged Access Manager","CyberArk Alero"],
            ["Deploy CyberArk Alero for zero-trust remote vendor access with session recording",
             "Configure PAM session management with automatic termination on inactivity",
             "Implement just-in-time remote access provisioning with time-bounded sessions",
             "Enable real-time session monitoring with ability to terminate suspicious sessions",
             "Create remote access policies requiring re-authentication every 15 minutes for CUI systems"],
            ["Verify session timeout enforcement","Test JIT access provisioning","Review session recordings"],
            "$5,000-15,000/year", 24)
    },
    saas: {
        zscaler: tech(
            ["Zscaler Private Access","Zscaler Internet Access","Zscaler Digital Experience"],
            ["Deploy Zscaler Private Access for zero-trust remote access replacing traditional VPN",
             "Configure application-level micro-segmentation for CUI systems",
             "Implement continuous posture assessment during remote sessions",
             "Enable session recording and DLP inspection for all remote access to CUI",
             "Set up Digital Experience monitoring for remote session quality and anomalies"],
            ["Verify ZPA enforces application-level access control","Test posture assessment","Review DLP logs"],
            "$150-250/user/year", 20)
    },
    small_business: sb(
        ["Tailscale","Cloudflare Access","Microsoft Entra Private Access"],
        ["Deploy Tailscale or Cloudflare Access for zero-trust remote access to CUI systems",
         "Configure session timeouts and re-authentication requirements for remote sessions",
         "Implement device posture checks before granting remote access",
         "Enable logging of all remote access sessions with user identity and duration",
         "Document remote access policy with approved methods and session requirements"],
        ["Test session timeout enforcement","Verify posture check blocks non-compliant devices","Review logs weekly"],
        "$5-10/user/month", 8)
};

// ══════════════════════════════════════════════════════════════════════════
// AT.L3-3.2.1e — Enhanced Security Awareness
// ══════════════════════════════════════════════════════════════════════════
data.objectives["AT.L3-3.2.1e"] = {
    saas: {
        knowbe4: tech(
            ["KnowBe4 Security Awareness Training","KnowBe4 PhishER"],
            ["Deploy KnowBe4 advanced phishing simulation campaigns targeting APT-style attacks",
             "Create custom training modules covering enhanced security requirements and APT awareness",
             "Implement PhishER automated triage for reported suspicious emails",
             "Configure role-based training tracks for administrators handling CUI systems",
             "Set up quarterly APT awareness briefings using KnowBe4 content library"],
            ["Review phishing click rates trending downward","Verify completion rates above 95%","Test PhishER triage"],
            "$15-25/user/year", 12)
    },
    small_business: sb(
        ["SANS Security Awareness","Microsoft Attack Simulator","Proofpoint Essentials"],
        ["Subscribe to SANS Security Awareness training for all CUI-handling personnel",
         "Configure Microsoft 365 Attack Simulator for monthly phishing simulations",
         "Create internal APT awareness briefing using CISA threat advisories",
         "Implement quarterly security awareness assessments with pass/fail criteria",
         "Document training requirements in security awareness policy"],
        ["Verify all personnel complete annual training","Review simulation results","Confirm briefings documented"],
        "$10-20/user/year", 8)
};

// ══════════════════════════════════════════════════════════════════════════
// AT.L3-3.2.2e — Practical Exercises
// ══════════════════════════════════════════════════════════════════════════
data.objectives["AT.L3-3.2.2e"] = {
    saas: {
        knowbe4: tech(
            ["KnowBe4 Security Awareness","KnowBe4 Compliance Plus"],
            ["Design tabletop exercises simulating APT intrusion scenarios using KnowBe4 templates",
             "Create hands-on incident response exercises for security team members",
             "Implement red team/blue team exercises using simulated APT techniques",
             "Configure automated exercise scheduling with post-exercise assessments",
             "Document lessons learned and update training materials after each exercise"],
            ["Verify exercises conducted quarterly","Review post-exercise scores","Confirm lessons learned incorporated"],
            "$15-25/user/year", 16)
    },
    small_business: sb(
        ["CISA Tabletop Exercise Packages","Microsoft Attack Simulator"],
        ["Download CISA tabletop exercise packages and customize for organization",
         "Conduct quarterly tabletop exercises with all CUI-handling personnel",
         "Use Microsoft Attack Simulator for practical phishing exercises",
         "Create simple incident response walkthrough exercises for common scenarios",
         "Document exercise results and improvement actions in training records"],
        ["Verify quarterly exercises conducted","Review documentation","Confirm improvement actions tracked"],
        "$0-500/quarter", 8)
};

// ══════════════════════════════════════════════════════════════════════════
// AU.L3-3.3.1e — Enhanced Audit Logging
// ══════════════════════════════════════════════════════════════════════════
data.objectives["AU.L3-3.3.1e"] = {
    database: {
        mssql: tech(
            ["SQL Server 2022","SQL Audit","Extended Events","Temporal Tables"],
            ["Configure SQL Server Audit capturing all privileged operations and CUI data access",
             "Implement Extended Events sessions for real-time monitoring of suspicious queries",
             "Enable Temporal Tables for immutable audit trail of CUI data modifications",
             "Create audit log export to centralized SIEM with tamper-proof transmission",
             "Implement database-level audit policies for DDL, DML, and security events"],
            ["Verify all CUI table access is logged","Test audit log tamper detection","Review Extended Events completeness"],
            "$0-5,000/year", 16),
        postgresql: tech(
            ["PostgreSQL 16","pgAudit","pg_stat_statements"],
            ["Enable pgAudit extension with comprehensive logging of all statement classes",
             "Configure pg_stat_statements for query performance and access pattern analysis",
             "Implement logical replication to ship audit logs to immutable storage",
             "Create custom audit triggers on CUI tables capturing before/after values",
             "Set up log rotation with integrity verification using checksums"],
            ["Verify pgAudit captures all CUI data access","Test log integrity","Review replication lag"],
            "$0 (open source)", 14)
    },
    custom_apps: {
        nodejs: tech(
            ["Node.js","Winston","Morgan","Elasticsearch"],
            ["Implement structured audit logging using Winston with JSON format and correlation IDs",
             "Create Express.js middleware capturing all API requests with user identity and action",
             "Ship audit logs to Elasticsearch for centralized analysis and tamper detection",
             "Implement log integrity verification using hash chains on audit entries",
             "Create audit dashboard for real-time monitoring of security-relevant events"],
            ["Verify all API endpoints are logged","Test hash chain integrity","Review dashboard accuracy"],
            "$0 (open source) + Elasticsearch hosting", 24)
    },
    small_business: sb(
        ["Wazuh","Graylog","Microsoft Sentinel Free Tier"],
        ["Deploy Wazuh agent on all CUI-handling systems for comprehensive audit logging",
         "Configure Graylog or Wazuh dashboard for centralized log management",
         "Enable Windows Event Forwarding to centralize Windows audit logs",
         "Implement log retention policy meeting CMMC 3-year requirement",
         "Create weekly audit log review procedures and document findings"],
        ["Verify all systems forward logs","Test retention meets requirements","Review weekly summaries"],
        "$0 (open source)", 16)
};

// ══════════════════════════════════════════════════════════════════════════
// AU.L3-3.3.2e — Cross-Organizational Audit
// ══════════════════════════════════════════════════════════════════════════
data.objectives["AU.L3-3.3.2e"] = {
    small_business: sb(
        ["Wazuh","Elastic SIEM","Syslog-ng"],
        ["Configure centralized log collection from all organizational units and partners",
         "Implement standardized log format (CEF/LEEF) across all systems",
         "Create cross-organizational audit correlation rules in SIEM",
         "Set up automated alerts for cross-boundary security events",
         "Document audit sharing agreements with external service providers"],
        ["Verify logs from all units collected","Test cross-org correlation","Review sharing agreements"],
        "$0-500/month", 20)
};

// ══════════════════════════════════════════════════════════════════════════
// CM.L3-3.4.1e — Authoritative Source Configuration
// ══════════════════════════════════════════════════════════════════════════
data.objectives["CM.L3-3.4.1e"] = {
    custom_apps: {
        nodejs: tech(
            ["Node.js","Terraform","Ansible","Git"],
            ["Implement Infrastructure-as-Code using Terraform for all CUI system configurations",
             "Create Git repository as authoritative source for all configuration baselines",
             "Deploy Ansible playbooks for automated configuration enforcement",
             "Implement CI/CD pipeline validating configuration changes against approved baselines",
             "Create drift detection scripts comparing live systems against Git-stored configurations"],
            ["Verify all configs stored in Git","Test drift detection","Review CI/CD enforcement"],
            "$0 (open source)", 32)
    },
    saas: {
        servicenow: tech(
            ["ServiceNow CMDB","ServiceNow Discovery","ServiceNow Configuration Compliance"],
            ["Configure ServiceNow CMDB as authoritative source for all CUI system configurations",
             "Deploy Discovery to automatically populate and update configuration baselines",
             "Implement Configuration Compliance policies detecting drift from authorized baselines",
             "Create change management workflows requiring CMDB update for all changes",
             "Enable audit trail for all CMDB modifications with approval tracking"],
            ["Verify CMDB reflects current state","Test compliance drift detection","Review change workflow"],
            "$100-200/user/month", 24)
    },
    small_business: sb(
        ["Ansible","Git","NinjaOne","PDQ Deploy"],
        ["Create Git repository storing all approved system configuration baselines",
         "Implement Ansible playbooks for automated configuration deployment and enforcement",
         "Use NinjaOne or PDQ Deploy for endpoint configuration management",
         "Create weekly configuration audit comparing live systems to approved baselines",
         "Document configuration management procedures and change approval process"],
        ["Verify Git contains all baselines","Test Ansible enforcement","Review weekly audits"],
        "$0-100/month", 16)
};

// ══════════════════════════════════════════════════════════════════════════
// CM.L3-3.4.2e — Automated Configuration Monitoring
// ══════════════════════════════════════════════════════════════════════════
data.objectives["CM.L3-3.4.2e"] = {
    custom_apps: {
        nodejs: tech(
            ["Node.js","OWASP Dependency-Check","Snyk","npm audit"],
            ["Integrate npm audit and Snyk into CI/CD pipeline for automated dependency scanning",
             "Implement OWASP Dependency-Check in build process blocking vulnerable dependencies",
             "Create automated configuration validation tests running on every deployment",
             "Deploy runtime configuration monitoring detecting unauthorized changes",
             "Implement automated rollback on configuration drift detection"],
            ["Verify CI/CD blocks vulnerable deps","Test runtime drift detection","Review rollback effectiveness"],
            "$0-200/month", 20)
    },
    small_business: sb(
        ["NinjaOne","Wazuh","OSSEC"],
        ["Deploy NinjaOne for automated endpoint configuration monitoring",
         "Configure Wazuh File Integrity Monitoring on all CUI systems",
         "Set up automated alerts for unauthorized configuration changes",
         "Create baseline configuration snapshots for comparison",
         "Implement weekly automated configuration compliance reports"],
        ["Verify FIM detects file changes","Test alert generation","Review weekly reports"],
        "$3-5/endpoint/month", 12)
};

// ══════════════════════════════════════════════════════════════════════════
// CM.L3-3.4.3e — Restrict Software Installation
// ══════════════════════════════════════════════════════════════════════════
data.objectives["CM.L3-3.4.3e"] = {
    custom_apps: {
        nodejs: tech(
            ["Node.js","npm","Verdaccio","Socket.dev"],
            ["Deploy Verdaccio as private npm registry restricting package sources to approved list",
             "Implement Socket.dev for supply chain security scanning of npm packages",
             "Create .npmrc configuration enforcing private registry and blocking public installs",
             "Implement pre-commit hooks validating all dependencies against approved package list",
             "Create automated dependency review workflow for new package requests"],
            ["Verify npm install only works from private registry","Test Socket.dev blocks malicious packages","Review approval workflow"],
            "$0-100/month", 16)
    },
    small_business: sb(
        ["Microsoft Intune","AppLocker","NinjaOne"],
        ["Configure AppLocker or Windows Defender Application Control on all endpoints",
         "Implement Intune application deployment restricting installs to approved software",
         "Create approved software list and review quarterly",
         "Use NinjaOne to monitor for unauthorized software installations",
         "Document software restriction policy with exception request process"],
        ["Test unauthorized install blocked","Verify approved list current","Review exceptions"],
        "$8/device/month", 12)
};

// ══════════════════════════════════════════════════════════════════════════
// IA.L3-3.5.1e — Replay-Resistant Authentication
// ══════════════════════════════════════════════════════════════════════════
data.objectives["IA.L3-3.5.1e"] = {
    iam_pam: {
        cyberark: tech(
            ["CyberArk Identity","CyberArk Workforce Identity"],
            ["Deploy CyberArk Identity with FIDO2/WebAuthn for replay-resistant authentication",
             "Configure hardware security key requirements for all privileged accounts",
             "Implement certificate-based authentication with short-lived certificates",
             "Enable adaptive MFA with risk-based step-up authentication",
             "Create authentication policies blocking replay-vulnerable methods (SMS, TOTP)"],
            ["Verify FIDO2 enforced for privileged accounts","Test replay attack resistance","Review policy enforcement"],
            "$5,000-15,000/year", 20)
    },
    custom_apps: {
        nodejs: tech(
            ["Node.js","@simplewebauthn/server","passport-fido2"],
            ["Implement WebAuthn/FIDO2 authentication using @simplewebauthn/server library",
             "Create challenge-response flow with server-side nonce validation preventing replay",
             "Store authenticator credentials with attestation verification",
             "Implement token binding to prevent token export and replay attacks",
             "Add authentication event logging with replay attempt detection"],
            ["Test WebAuthn registration and auth flow","Verify replay of captured auth fails","Review event logs"],
            "$0 (open source)", 24)
    },
    small_business: sb(
        ["YubiKey","Duo Security","Microsoft Entra ID"],
        ["Deploy YubiKey hardware security keys to all CUI-handling personnel",
         "Configure Entra ID to require FIDO2 security keys for authentication",
         "Disable SMS and phone-call MFA methods (replay-vulnerable)",
         "Implement Duo Security with push notifications as backup MFA method",
         "Document authentication policy requiring phishing-resistant MFA"],
        ["Verify FIDO2 required for all CUI access","Test SMS/phone MFA disabled","Review auth logs"],
        "$50/key + $3/user/month", 8)
};

// ══════════════════════════════════════════════════════════════════════════
// IA.L3-3.5.2e — Device Authentication
// ══════════════════════════════════════════════════════════════════════════
data.objectives["IA.L3-3.5.2e"] = {
    small_business: sb(
        ["Microsoft Intune","802.1X","JumpCloud"],
        ["Implement 802.1X network access control requiring device certificates",
         "Configure Intune device compliance as authentication prerequisite",
         "Deploy JumpCloud for cross-platform device identity management",
         "Create device certificate enrollment process for organization-owned devices",
         "Document device authentication requirements in network access policy"],
        ["Verify uncertified devices blocked","Test compliance enforcement","Review enrollment process"],
        "$8/device/month", 16)
};

// ══════════════════════════════════════════════════════════════════════════
// IA.L3-3.5.3e — Multi-Factor Authentication
// ══════════════════════════════════════════════════════════════════════════
data.objectives["IA.L3-3.5.3e"] = {
    iam_pam: {
        cyberark: tech(
            ["CyberArk Identity","CyberArk Adaptive MFA"],
            ["Deploy CyberArk Adaptive MFA with risk-based authentication policies",
             "Configure hardware token requirements for all privileged and CUI access",
             "Implement continuous authentication monitoring during active sessions",
             "Enable biometric authentication as additional factor for high-risk operations",
             "Create MFA bypass detection and alerting for anomalous patterns"],
            ["Verify MFA enforced on all CUI access","Test risk-based step-up","Review bypass detection alerts"],
            "$5,000-15,000/year", 16)
    },
    small_business: sb(
        ["YubiKey","Duo Security","Microsoft Authenticator"],
        ["Deploy phishing-resistant MFA (FIDO2/YubiKey) for all CUI system access",
         "Configure Duo Security as MFA provider with push and hardware token support",
         "Implement MFA for all remote, privileged, and CUI data access",
         "Disable weaker MFA methods (SMS, phone call) per NIST 800-63B",
         "Document MFA policy and distribute hardware tokens to all personnel"],
        ["Verify MFA required on all CUI paths","Test hardware token enrollment","Review enforcement logs"],
        "$50/key + $3/user/month", 8)
};

// ══════════════════════════════════════════════════════════════════════════
// IR.L3-3.6.1e — Enhanced Incident Response
// ══════════════════════════════════════════════════════════════════════════
data.objectives["IR.L3-3.6.1e"] = {
    saas: {
        servicenow: tech(
            ["ServiceNow SecOps","ServiceNow ITSM","ServiceNow SOAR"],
            ["Configure ServiceNow SecOps for automated incident triage and enrichment",
             "Implement SOAR playbooks for APT-specific incident response procedures",
             "Create escalation workflows integrating with threat intelligence feeds",
             "Set up automated containment actions for detected APT indicators",
             "Enable post-incident review workflows with lessons learned tracking"],
            ["Test SOAR playbook execution for APT scenarios","Verify escalation workflows","Review post-incident docs"],
            "$100-200/user/month", 32)
    },
    small_business: sb(
        ["TheHive","MISP","Cortex"],
        ["Deploy TheHive as open-source incident response platform",
         "Configure MISP for threat intelligence sharing and IOC management",
         "Implement Cortex analyzers for automated indicator enrichment",
         "Create incident response playbooks for common APT attack patterns",
         "Document IR procedures and conduct quarterly exercises"],
        ["Test incident creation and escalation","Verify MISP IOC feeds","Review playbook effectiveness"],
        "$0 (open source)", 24)
};

// ══════════════════════════════════════════════════════════════════════════
// IR.L3-3.6.2e — Incident Response Testing
// ══════════════════════════════════════════════════════════════════════════
data.objectives["IR.L3-3.6.2e"] = {
    small_business: sb(
        ["Atomic Red Team","MITRE Caldera","CISA Tabletop Exercises"],
        ["Deploy Atomic Red Team for automated adversary simulation testing",
         "Use MITRE Caldera for automated red team exercises against CUI systems",
         "Conduct quarterly tabletop exercises using CISA-provided scenarios",
         "Test incident response procedures against simulated APT intrusions",
         "Document test results and update IR procedures based on findings"],
        ["Verify quarterly testing conducted","Review test result documentation","Confirm IR updates implemented"],
        "$0 (open source)", 16)
};

// ══════════════════════════════════════════════════════════════════════════
// RA.L3-3.11.1e — Threat-Informed Risk Assessment
// ══════════════════════════════════════════════════════════════════════════
data.objectives["RA.L3-3.11.1e"] = {
    saas: {
        servicenow: tech(
            ["ServiceNow GRC","ServiceNow Vulnerability Response"],
            ["Configure ServiceNow GRC for threat-informed risk assessment workflows",
             "Integrate vulnerability response with threat intelligence feeds (CISA KEV, MITRE ATT&CK)",
             "Create risk scoring models incorporating APT threat landscape data",
             "Implement automated risk recalculation when new threat intelligence is received",
             "Generate executive risk dashboards showing threat-informed risk posture"],
            ["Verify threat feeds integrated","Test risk recalculation triggers","Review dashboard accuracy"],
            "$100-200/user/month", 24)
    },
    small_business: sb(
        ["NIST RMF Tools","CISA KEV Catalog","MITRE ATT&CK Navigator"],
        ["Subscribe to CISA Known Exploited Vulnerabilities (KEV) catalog alerts",
         "Map organizational assets to MITRE ATT&CK techniques for threat modeling",
         "Conduct annual threat-informed risk assessment using NIST SP 800-30 methodology",
         "Create risk register incorporating APT threat intelligence",
         "Document risk assessment results and mitigation priorities"],
        ["Verify KEV alerts monitored","Review ATT&CK mapping completeness","Confirm annual assessment conducted"],
        "$0 (free tools)", 16)
};

// ══════════════════════════════════════════════════════════════════════════
// RA.L3-3.11.2e — Cyber Threat Intelligence
// ══════════════════════════════════════════════════════════════════════════
data.objectives["RA.L3-3.11.2e"] = {
    small_business: sb(
        ["MISP","OpenCTI","AlienVault OTX"],
        ["Deploy MISP or OpenCTI for threat intelligence platform management",
         "Subscribe to AlienVault OTX and CISA threat feeds for automated IOC ingestion",
         "Create automated IOC matching against network and endpoint telemetry",
         "Implement threat intelligence sharing with sector ISACs",
         "Document threat intelligence procedures and review cadence"],
        ["Verify threat feeds are current","Test IOC matching automation","Review sharing agreements"],
        "$0 (open source)", 20)
};

// ══════════════════════════════════════════════════════════════════════════
// RA.L3-3.11.3e — Advanced Risk Assessment
// ══════════════════════════════════════════════════════════════════════════
data.objectives["RA.L3-3.11.3e"] = {
    small_business: sb(
        ["NIST SP 800-30","FAIR Risk Model","CISA Cyber Hygiene"],
        ["Implement FAIR (Factor Analysis of Information Risk) methodology for quantitative risk assessment",
         "Conduct advanced risk assessment incorporating supply chain and APT threat vectors",
         "Create risk scenarios modeling sophisticated adversary capabilities",
         "Implement continuous risk monitoring with automated risk score updates",
         "Document advanced risk assessment methodology and results"],
        ["Verify FAIR methodology applied","Review risk scenarios","Confirm continuous monitoring active"],
        "$0-2,000/year", 24)
};

// ══════════════════════════════════════════════════════════════════════════
// SC.L3-3.13.1e — Enhanced Boundary Protection
// ══════════════════════════════════════════════════════════════════════════
data.objectives["SC.L3-3.13.1e"] = {
    custom_apps: {
        nodejs: tech(
            ["Node.js","helmet","express-rate-limit","cors"],
            ["Implement helmet middleware for comprehensive HTTP security headers",
             "Configure express-rate-limit for API rate limiting and DDoS protection",
             "Implement strict CORS policies limiting cross-origin access to approved domains",
             "Create API gateway middleware for request validation and sanitization",
             "Deploy Web Application Firewall rules for application-layer boundary protection"],
            ["Verify security headers present on all responses","Test rate limiting enforcement","Review CORS policy"],
            "$0 (open source)", 16)
    },
    saas: {
        cloudflare: tech(
            ["Cloudflare WAF","Cloudflare Zero Trust","Cloudflare DDoS Protection"],
            ["Deploy Cloudflare WAF with managed rulesets for application boundary protection",
             "Configure Zero Trust policies for network boundary enforcement",
             "Enable DDoS protection with automatic mitigation for CUI-facing services",
             "Implement Bot Management to detect and block automated threats",
             "Set up Cloudflare Logs for boundary event monitoring and analysis"],
            ["Verify WAF rules active","Test Zero Trust policy enforcement","Review DDoS mitigation logs"],
            "$200-500/month", 16)
    },
    small_business: sb(
        ["pfSense","OPNsense","Cloudflare","Ubiquiti"],
        ["Deploy pfSense or OPNsense as network boundary firewall with IDS/IPS",
         "Configure Cloudflare as reverse proxy for web application boundary protection",
         "Implement network segmentation isolating CUI systems from general network",
         "Enable IDS/IPS signatures for APT-related network indicators",
         "Document network boundary architecture and firewall rule justifications"],
        ["Verify firewall rules enforce segmentation","Test IDS/IPS detection","Review rule justifications"],
        "$0-200/month", 16)
};

// ══════════════════════════════════════════════════════════════════════════
// SC.L3-3.13.2e — Enhanced Encryption
// ══════════════════════════════════════════════════════════════════════════
data.objectives["SC.L3-3.13.2e"] = {
    database: {
        mssql: tech(
            ["SQL Server 2022","Always Encrypted","TDE","Column-Level Encryption"],
            ["Enable Transparent Data Encryption (TDE) with FIPS 140-validated module",
             "Implement Always Encrypted for CUI columns with customer-managed keys",
             "Configure TLS 1.3 for all database connections with certificate pinning",
             "Implement column-level encryption for highly sensitive CUI fields",
             "Create key rotation procedures using Azure Key Vault or HSM"],
            ["Verify TDE active on all CUI databases","Test Always Encrypted column access","Review key rotation schedule"],
            "$0-5,000/year", 16),
        postgresql: tech(
            ["PostgreSQL 16","pg_crypto","SSL/TLS","pgBackRest"],
            ["Configure PostgreSQL SSL/TLS with FIPS-validated cipher suites",
             "Implement pg_crypto column-level encryption for CUI data fields",
             "Enable full-disk encryption on database storage volumes",
             "Configure pgBackRest encrypted backups with separate key management",
             "Implement key rotation procedures with documented key lifecycle"],
            ["Verify SSL/TLS enforced on all connections","Test column encryption","Review backup encryption"],
            "$0 (open source)", 14)
    },
    custom_apps: {
        nodejs: tech(
            ["Node.js","crypto","tls","node-forge"],
            ["Implement TLS 1.3 for all API communications with certificate pinning",
             "Use Node.js crypto module with FIPS-validated algorithms for CUI encryption",
             "Implement envelope encryption for CUI data at rest using AWS KMS or Azure Key Vault",
             "Create key management module with automated rotation and audit logging",
             "Enable HTTP Strict Transport Security (HSTS) with long max-age"],
            ["Verify TLS 1.3 enforced","Test FIPS algorithm usage","Review key rotation logs"],
            "$0 (open source)", 20)
    },
    small_business: sb(
        ["BitLocker","FileVault","VeraCrypt","Let's Encrypt"],
        ["Enable BitLocker (Windows) or FileVault (macOS) on all CUI endpoints with FIPS mode",
         "Configure Let's Encrypt or commercial TLS certificates for all web services",
         "Implement VeraCrypt encrypted containers for portable CUI storage",
         "Enable FIPS mode on all operating systems handling CUI",
         "Document encryption standards and key management procedures"],
        ["Verify full-disk encryption on all endpoints","Test TLS configuration","Review FIPS mode status"],
        "$0-100/year", 8)
};

// ══════════════════════════════════════════════════════════════════════════
// SI.L3-3.14.1e — Enhanced Threat Detection
// ══════════════════════════════════════════════════════════════════════════
data.objectives["SI.L3-3.14.1e"] = {
    custom_apps: {
        nodejs: tech(
            ["Node.js","OWASP ZAP","Snyk","SonarQube"],
            ["Integrate OWASP ZAP into CI/CD pipeline for automated security scanning",
             "Implement Snyk for real-time dependency vulnerability monitoring",
             "Deploy SonarQube for static code analysis detecting security flaws",
             "Create runtime application self-protection (RASP) middleware",
             "Implement automated vulnerability remediation workflows"],
            ["Verify CI/CD security scanning active","Test Snyk monitoring","Review SonarQube findings"],
            "$0-500/month", 24)
    },
    small_business: sb(
        ["ClamAV","Wazuh","OSSEC","Windows Defender"],
        ["Deploy Wazuh for host-based intrusion detection on all CUI systems",
         "Configure Windows Defender with cloud-delivered protection and ASR rules",
         "Implement ClamAV for additional malware scanning on Linux systems",
         "Enable automated threat detection alerts with escalation procedures",
         "Create weekly threat detection review and response procedures"],
        ["Verify HIDS active on all systems","Test detection capabilities","Review weekly reports"],
        "$0 (open source)", 12)
};

// ══════════════════════════════════════════════════════════════════════════
// SI.L3-3.14.2e — Automated Security Monitoring
// ══════════════════════════════════════════════════════════════════════════
data.objectives["SI.L3-3.14.2e"] = {
    small_business: sb(
        ["Wazuh","Grafana","Prometheus","Elastic Stack"],
        ["Deploy Wazuh with Grafana dashboards for automated security monitoring",
         "Configure Prometheus for infrastructure metrics and anomaly detection",
         "Implement automated alerting for security events exceeding thresholds",
         "Create security monitoring runbooks for common alert types",
         "Set up 24/7 monitoring with on-call rotation for critical alerts"],
        ["Verify monitoring covers all CUI systems","Test alert generation","Review runbook completeness"],
        "$0 (open source)", 20)
};

// ══════════════════════════════════════════════════════════════════════════
// SI.L3-3.14.3e — Advanced Malicious Code Protection
// ══════════════════════════════════════════════════════════════════════════
data.objectives["SI.L3-3.14.3e"] = {
    small_business: sb(
        ["SentinelOne","CrowdStrike Falcon Go","Malwarebytes"],
        ["Deploy SentinelOne or CrowdStrike Falcon Go for advanced EDR on all endpoints",
         "Configure behavioral analysis and AI-based threat detection",
         "Implement automated containment and rollback for detected threats",
         "Enable threat hunting capabilities using EDR telemetry",
         "Create malware incident response procedures with containment playbooks"],
        ["Verify EDR active on all endpoints","Test automated containment","Review threat hunting results"],
        "$5-10/endpoint/month", 12)
};

// ── Write output ────────────────────────────────────────────────────────
const header = `// Comprehensive Implementation Guidance - L3 Expanded Platforms
// Supplements comprehensive-guidance-l3.js with: iam_pam, custom_apps, database, saas, small_business
// Covers all 23 CMMC Level 3 controls (NIST SP 800-172A)
// Auto-generated by scripts/gen-l3-expanded.js on ${new Date().toISOString().slice(0,10)}

const COMPREHENSIVE_GUIDANCE_L3_EXPANDED = `;

const output = header + JSON.stringify(data, null, 4) + ';\n';
fs.writeFileSync('data/comprehensive-guidance-l3-expanded.js', output, 'utf8');
console.log('Written data/comprehensive-guidance-l3-expanded.js');
console.log('Controls covered:', Object.keys(data.objectives).length);
let totalTechs = 0;
for (const key of Object.keys(data.objectives)) {
    const obj = data.objectives[key];
    for (const section of Object.keys(obj)) {
        if (section === 'small_business') { totalTechs++; continue; }
        totalTechs += Object.keys(obj[section]).length;
    }
}
console.log('Total technology entries:', totalTechs);
