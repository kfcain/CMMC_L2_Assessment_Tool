---
name: policy-procedure-advisor
description: "Policy and procedure guidance for CMMC Level 2 / NIST 800-171. Use this skill when: (1) Advising clients on what policies and procedures they need, (2) Tailoring policy/procedure content to business case, scope, and CUI boundary, (3) Explaining how procedures should be written with concrete examples, (4) Reviewing existing policies/procedures for assessment readiness, (5) Generating procedure templates based on org size, tools, and industry."
license: Proprietary
---

# Policy & Procedure Advisor — CMMC Level 2

## Overview

This skill provides expert guidance on developing, writing, and reviewing policies and procedures for CMMC Level 2 / NIST 800-171 compliance. It helps clients understand what each policy must contain, how procedures should be written to satisfy assessors, and how to tailor content to their specific business case, CUI scope, org size, and technology stack.

## Quick Reference

| Task | Approach |
|------|----------|
| Determine which policies are needed | Use Required Policy Set (Section 2) |
| Understand what a specific policy must cover | Use Policy Content Requirements (Section 3) |
| Write a procedure for a control family | Use Procedure Writing Framework (Section 4) |
| Tailor to business case / scope | Use Business Context Calibration (Section 5) |
| Review existing policy for gaps | Use Policy Review Checklist (Section 6) |
| See a real-world example | Use Procedure Examples (Section 7) |

## Core Principles

### Policy vs. Procedure — The Critical Distinction

**Policy** = WHAT and WHY
- Management-level statement of intent and requirements
- Defines organizational position, standards, and expectations
- Approved by senior leadership (CEO, CISO, or equivalent)
- Reviewed annually minimum
- Applies broadly across the organization

**Procedure** = HOW, WHO, WHEN, WHERE
- Step-by-step operational instructions
- Names specific tools, systems, roles, and timelines
- Written so any qualified person can follow them
- Updated when tools, processes, or personnel change
- Scoped to specific activities

**CRITICAL:** Assessors look for BOTH. A policy without procedures is a statement of intent. A procedure without a policy has no authority. You need both to pass.

### The Assessor's Test

For every policy and procedure, a C3PAO assessor will ask:
1. **"Show me the policy."** → Formal document with approval, version, date
2. **"Walk me through the procedure."** → Staff can describe the actual steps
3. **"Show me evidence it's being followed."** → Logs, records, screenshots proving execution
4. **"What happens when [exception]?"** → Procedure addresses edge cases

If any of these fail, the control is at risk of a NOT MET finding.

---

## 2. Required Policy Set

### Minimum Policy Documents for CMMC Level 2

Every CMMC Level 2 organization needs **at minimum** the following policy documents. These can be standalone or combined into a single Information Security Policy with sections — but every topic must be addressed.

| # | Policy Document | NIST Families Covered | Key Controls |
|---|----------------|----------------------|-------------|
| 1 | **Access Control Policy** | AC | 03.01.01–03.01.22 |
| 2 | **Awareness & Training Policy** | AT | 03.02.01–03.02.02 |
| 3 | **Audit & Accountability Policy** | AU | 03.03.01–03.03.08 |
| 4 | **Configuration Management Policy** | CM | 03.04.01–03.04.12 |
| 5 | **Identification & Authentication Policy** | IA | 03.05.01–03.05.12 |
| 6 | **Incident Response Plan** | IR | 03.06.01–03.06.05 |
| 7 | **Maintenance Policy** | MA | 03.07.04–03.07.06 |
| 8 | **Media Protection Policy** | MP | 03.08.01–03.08.09 |
| 9 | **Personnel Security Policy** | PS | 03.09.01–03.09.02 |
| 10 | **Physical & Environmental Protection Policy** | PE | 03.10.01–03.10.08 |
| 11 | **Risk Assessment Policy** | RA | 03.11.01–03.11.04 |
| 12 | **Security Assessment & Monitoring Policy** | CA | 03.12.01–03.12.05 |
| 13 | **System & Communications Protection Policy** | SC | 03.13.01–03.13.15 |
| 14 | **System & Information Integrity Policy** | SI | 03.14.01–03.14.08 |
| 15 | **Planning Policy** (Rev 3) | PL | 03.15.01–03.15.03 |
| 16 | **Supply Chain Risk Management Policy** (Rev 3) | SR | 03.17.01–03.17.03 |

### Supporting Documents (Also Required)

| Document | Purpose | Controls Supported |
|----------|---------|-------------------|
| **System Security Plan (SSP)** | Describes how all 110+ controls are implemented | PL (03.15.02), all families |
| **Plan of Action & Milestones (POA&M)** | Tracks gaps and remediation | CA (03.12.02) |
| **Incident Response Plan** | Detailed IR procedures, contacts, escalation | IR (03.06.01–03.06.05) |
| **Configuration Management Plan** | Baselines, change control process | CM (03.04.01–03.04.06) |
| **Contingency / Backup Plan** | Backup procedures, recovery | MP (03.08.09) |
| **Rules of Behavior / AUP** | User responsibilities agreement | PL (03.15.03) |
| **Access Control Matrix** | Role-to-system access mapping | AC (03.01.01, 03.01.02) |
| **Network Diagram** | CUI boundary, data flows, segmentation | SC (03.13.01), SSP |
| **Data Flow Diagram** | How CUI moves through the environment | SC, MP, SSP |
| **Asset Inventory** | All in-scope systems categorized | CM (03.04.10) |

### Policy Consolidation Strategy

**Small orgs (<50 employees):** Combine into 3-4 master documents:
1. Information Security Policy (covers AC, IA, AU, CM, SC, SI, RA, CA)
2. Incident Response Plan (covers IR)
3. Physical Security & Media Protection Policy (covers PE, MP, MA, PS)
4. Rules of Behavior / Acceptable Use Policy (covers AT, PL)

**Medium orgs (50-250):** 6-8 documents with family-specific procedures as appendices

**Large orgs (>250):** Full set of 16+ standalone policies with separate procedure documents

---

## 3. Policy Content Requirements

### Universal Policy Structure

Every policy document MUST contain:

```
DOCUMENT HEADER
├── Document Title
├── Document ID (e.g., AC-POL-001)
├── Version Number (e.g., v2.1)
├── Effective Date
├── Last Review Date
├── Next Review Date
├── Approved By (name, title, signature, date)
├── Classification (e.g., CUI, Internal Use)
└── Distribution (who receives this document)

BODY
├── 1. Purpose — Why this policy exists
├── 2. Scope — What systems, people, data it covers
├── 3. Roles & Responsibilities — Who does what
├── 4. Policy Statements — The actual requirements
├── 5. Procedures — How to implement (or reference separate doc)
├── 6. Enforcement — Consequences of non-compliance
├── 7. Exceptions — How to request and document exceptions
├── 8. Related Documents — Cross-references
├── 9. Definitions — Key terms
└── 10. Revision History — Change log
```

### What Assessors Look For in Each Section

**Purpose:** Must reference NIST 800-171 or CMMC. Example: *"This policy establishes access control requirements to satisfy NIST SP 800-171 Rev 2/3 requirements 3.1.1 through 3.1.22 and support CMMC Level 2 certification."*

**Scope:** Must explicitly define the CUI boundary. Example: *"This policy applies to all systems that process, store, or transmit CUI, including [list systems], and all personnel with access to the CUI environment."*

**Roles & Responsibilities:** Must name actual titles (not generic). Example: *"The IT Manager (Jason Smith) is responsible for..."* — at minimum name the title; the actual person's name can be in an appendix.

**Policy Statements:** Must be specific and enforceable. Each statement should map to one or more NIST controls.

**Procedures:** Must be step-by-step, tool-specific, and include timelines.

---

## 4. Procedure Writing Framework

### The 6W Procedure Formula

Every procedure must answer:

| Element | Question | Example |
|---------|----------|---------|
| **WHO** | Who performs this action? | "The IT Manager" |
| **WHAT** | What action is performed? | "generates an Active Directory user access report" |
| **WHEN** | When / how often? | "on the first business day of each quarter" |
| **WHERE** | On what system / in what location? | "from the Active Directory Administrative Center" |
| **HOW** | What are the specific steps? | "1. Open ADAC → 2. Run Global Search → 3. Export to CSV..." |
| **EVIDENCE** | What record is created? | "The exported CSV is saved to SharePoint/Access-Reviews/{quarter}" |

### Procedure Quality Levels

**Level 1 — Will Fail Assessment (Vague)**
```
Access reviews are performed periodically to ensure appropriate access.
```
Problems: No WHO, no WHEN, no HOW, no WHERE, no EVIDENCE.

**Level 2 — Borderline (Incomplete)**
```
The IT department reviews user access quarterly using Active Directory.
```
Problems: No specific person, no specific steps, no evidence trail.

**Level 3 — Assessment-Ready (Complete)**
```
Quarterly Access Review Procedure:

1. The IT Manager generates an Active Directory user report from the AD 
   Administrative Center on the first business day of Jan/Apr/Jul/Oct.
2. The IT Manager exports the report to CSV and uploads it to 
   SharePoint > IT > Access-Reviews > {Year}-Q{Quarter}.
3. The IT Manager emails the report to each Department Manager within 
   2 business days, requesting review of their team's access.
4. Each Department Manager reviews assigned users and marks accounts for:
   - Continued access (no change)
   - Modified access (specify changes needed)
   - Removal (terminated, transferred, or no longer needed)
5. Department Managers return the marked report to the IT Manager within 
   10 business days.
6. The IT Manager implements approved changes within 2 business days:
   - Disables accounts marked for removal
   - Modifies group memberships as specified
   - Documents all changes in the access review log
7. The IT Manager archives the completed review package (original report, 
   marked-up responses, change log) to SharePoint > IT > Access-Reviews.
8. The Security Officer reviews the completed package and signs off within 
   5 business days.

Evidence Produced:
- AD user export CSV (dated)
- Department Manager response emails
- Access change log
- Security Officer sign-off
```

### Procedure Verb Standards

Use these action verbs for clarity:

| Action Type | Verbs to Use | Verbs to Avoid |
|-------------|-------------|----------------|
| **Create/Configure** | generates, creates, configures, establishes, deploys | sets up, does |
| **Review/Verify** | reviews, verifies, validates, confirms, inspects | checks, looks at |
| **Approve/Authorize** | approves, authorizes, signs off, grants | OKs, agrees |
| **Document/Record** | documents, records, logs, archives, saves to | writes down, notes |
| **Disable/Remove** | disables, removes, revokes, terminates, deletes | gets rid of, turns off |
| **Monitor/Alert** | monitors, alerts, notifies, escalates, reports | watches, keeps an eye on |
| **Enforce/Restrict** | enforces, restricts, blocks, denies, prohibits | stops, prevents |

---

## 5. Business Context Calibration

### Tailoring Policies to Business Case

**CRITICAL:** Policies and procedures must reflect the ACTUAL business — not a generic template. Assessors will interview staff and compare answers to documentation. Mismatches = NOT MET.

### Scoping Questions to Ask Before Writing

Before writing any policy or procedure, establish:

1. **What CUI do you handle?** (ITAR, CDI, CTI, export-controlled data, technical drawings, etc.)
2. **How does CUI enter your environment?** (Email, file share, portal, API, physical media)
3. **How does CUI flow through your systems?** (Which systems process, store, transmit)
4. **Who needs access to CUI?** (Which roles, departments, contractors)
5. **What's your technology stack?** (M365/GCC High, AWS, on-prem AD, specific tools)
6. **How many employees?** (Determines role consolidation, process complexity)
7. **Do you have subcontractors with CUI access?** (Flow-down requirements)
8. **What's your physical footprint?** (Offices, data centers, remote workers)
9. **Do you use an MSP/MSSP?** (Shared responsibility for controls)
10. **What industry are you in?** (Manufacturing, engineering, IT services, consulting)

### Industry-Specific Procedure Adjustments

#### Manufacturing / Production
- **Media Protection:** Address CNC machines, CAD/CAM workstations, shop floor terminals
- **Physical Security:** Factory floor access, visitor escorts through production areas
- **Configuration Management:** Include OT/ICS systems, PLCs if in scope
- **Maintenance:** Equipment maintenance logs, vendor access to CNC machines
- **Procedure style:** Visual aids, laminated quick-reference cards for shop floor

#### Engineering / Design
- **Access Control:** CAD file access, PLM system permissions, design review workflows
- **Media Protection:** Large file transfers (ITAR-controlled drawings), USB policies for field work
- **System & Comms Protection:** Encryption for design files in transit, collaboration tool controls
- **Procedure style:** Integrate with existing engineering change order (ECO) processes

#### IT Services / MSP
- **Access Control:** Multi-tenant access isolation, customer environment separation
- **Audit:** Logging across customer environments, centralized SIEM
- **Incident Response:** Customer notification procedures, shared IR responsibilities
- **Procedure style:** Runbook format, integrate with PSA/ticketing tools (ConnectWise, Autotask)

#### Professional Services / Consulting
- **Access Control:** Remote access policies (VPN, VDI), BYOD restrictions
- **Media Protection:** Laptop encryption, travel procedures, client site policies
- **Personnel Security:** Contractor/subcontractor screening, NDA requirements
- **Procedure style:** Travel-friendly, mobile-accessible, exception-heavy for client sites

### Org Size Calibration

#### Small Organization (<50 employees)

**Role consolidation is expected and acceptable:**
- IT Manager = System Administrator = Security Officer (document this!)
- CEO = Authorizing Official
- Office Manager = Physical Security Coordinator

**Procedure adjustments:**
- Simpler approval chains (1-2 approvers vs. committee)
- Combined documents (fewer, more comprehensive policies)
- Manual processes acceptable if documented and followed
- Shorter timelines (e.g., "within 1 business day" vs. "within 5 business days")

**Example — Small Org Account Termination:**
```
Account Termination Procedure (Small Org):

1. HR/Office Manager notifies the IT Manager of employee departure 
   via email or Teams message.
2. The IT Manager disables the user's Active Directory account within 
   4 hours of notification (same business day for planned departures, 
   immediately for involuntary terminations).
3. The IT Manager disables the user's M365 account and revokes all 
   active sessions via Entra ID > Users > Revoke Sessions.
4. The IT Manager removes the user from all security groups and 
   distribution lists.
5. The IT Manager changes any shared passwords the departing employee 
   had access to (documented in the Shared Credential Log).
6. The IT Manager collects or remotely wipes company-owned devices 
   via Intune > Devices > Wipe.
7. The IT Manager documents all actions in the Termination Checklist 
   (SharePoint > HR > Terminations > {Employee Name}).
8. The IT Manager confirms completion to HR/Office Manager via email.

Timeline: Complete within 4 hours (involuntary) or end of last day (voluntary).
Evidence: Termination checklist, AD disable timestamp, Intune wipe confirmation.
```

#### Medium Organization (50-250 employees)

**Role specialization begins:**
- Dedicated IT Manager + separate Security Officer (or part-time)
- HR department handles personnel actions
- Department managers involved in access decisions

**Procedure adjustments:**
- Formal ticketing for requests (ServiceNow, Jira, ConnectWise)
- Multi-level approval for sensitive actions
- Separate procedures for different system types
- Quarterly reviews involve multiple stakeholders

#### Large Organization (>250 employees)

**Full security team expected:**
- CISO, Security Analysts, SOC team
- Dedicated compliance/GRC function
- Change Advisory Board (CAB)

**Procedure adjustments:**
- Formal change management with CAB approval
- Automated workflows (SOAR, ITSM)
- Role-based procedure variants (Tier 1 vs. Tier 2 vs. Tier 3)
- Metrics and KPIs tracked

---

## 6. Policy Review Checklist

### Quick Assessment for Existing Policies

Use this checklist when reviewing a client's existing policy documents:

#### Document Quality
- [ ] Has document ID and version number
- [ ] Has effective date and review date (within last 12 months)
- [ ] Has approval signature from authorized individual
- [ ] Has defined scope referencing CUI environment
- [ ] References NIST 800-171 or CMMC requirements
- [ ] Uses present tense throughout (not "will" or "shall implement")

#### Content Completeness
- [ ] Purpose statement connects to security requirements
- [ ] Scope explicitly defines CUI boundary and covered systems
- [ ] Roles and responsibilities name actual job titles
- [ ] Policy statements are specific and enforceable
- [ ] Procedures are step-by-step with tools, timelines, and evidence
- [ ] Enforcement/consequences section exists
- [ ] Exception process is defined
- [ ] Related documents are cross-referenced

#### Organization Specificity
- [ ] Names actual tools and systems used (not generic placeholders)
- [ ] References actual job titles in the organization
- [ ] Procedures match what staff actually do (interview-verifiable)
- [ ] Timelines are realistic for the org's size and resources
- [ ] Addresses the org's specific CUI types and data flows

#### Common Red Flags
- ❌ Downloaded template with "[ORGANIZATION NAME]" placeholders still present
- ❌ References tools or systems the org doesn't use
- ❌ Procedures describe enterprise processes for a 20-person company
- ❌ No revision history or last review date > 12 months ago
- ❌ Policy says "annually" but no evidence of annual review
- ❌ Roles described don't match actual org chart
- ❌ Future tense: "The organization will implement..."
- ❌ No connection between policy statements and NIST/CMMC controls

---

## 7. Procedure Examples by Control Family

### Access Control (AC) — Account Provisioning

**Business Context:** 75-person engineering firm, M365 GCC High, on-prem AD synced to Entra ID, Autodesk Vault for CAD files.

```
PROCEDURE: User Account Provisioning
Document ID: AC-PROC-001 | Version: 2.0 | Effective: 2025-01-15

SCOPE: All user accounts in the CUI environment (Active Directory, 
Microsoft 365 GCC High, Autodesk Vault, Palo Alto GlobalProtect VPN).

TRIGGER: New hire, role change, or contractor onboarding.

STEPS:

1. HR submits a New User Request form via SharePoint to the IT Manager, 
   including:
   - Employee name, start date, department, job title
   - Manager name
   - Required system access (selected from Access Control Matrix)
   - CUI access required? (Yes/No — if Yes, requires Security Officer approval)

2. The IT Manager reviews the request against the Access Control Matrix 
   (AC-DOC-001) to verify requested access aligns with the job role.

3. If CUI access is requested:
   a. The Security Officer reviews and approves/denies within 2 business days
   b. The Security Officer verifies the user has completed:
      - Background check (per PS-PROC-001)
      - Security awareness training (per AT-PROC-001)
      - CUI handling training
      - Signed Rules of Behavior (AUP-001)

4. The IT Manager creates the Active Directory account:
   a. Username format: first.last
   b. Assigns to appropriate security groups per Access Control Matrix
   c. Sets initial password (16+ characters, generated via KeePass)
   d. Enables "User must change password at next logon"
   e. Assigns to correct OU (CUI-Users or Standard-Users)

5. The IT Manager provisions Microsoft 365 GCC High:
   a. Assigns appropriate license (E3 or E5 per role)
   b. Adds to M365 security groups for Teams, SharePoint access
   c. Configures Conditional Access group membership
   d. Verifies MFA enrollment is prompted at first sign-in

6. If engineering role, the IT Manager provisions Autodesk Vault:
   a. Creates Vault account linked to AD credentials
   b. Assigns project-level permissions per engineering manager's request
   c. Restricts to appropriate project folders only

7. If remote access required, the IT Manager configures VPN:
   a. Creates GlobalProtect user profile
   b. Assigns to appropriate VPN group (CUI-VPN or Standard-VPN)
   c. Verifies split-tunnel is disabled for CUI-VPN group

8. The IT Manager documents all provisioned access in the User Access Log 
   (SharePoint > IT > Access-Management > User-Access-Log.xlsx).

9. The IT Manager sends welcome email to the new user with:
   - Account credentials (via separate secure channel — phone call or 
     in-person, NEVER email)
   - MFA setup instructions
   - Link to Rules of Behavior
   - IT support contact information

10. The IT Manager closes the provisioning request in SharePoint and 
    attaches all approvals as evidence.

EVIDENCE PRODUCED:
- New User Request form (with approvals)
- Security Officer CUI access approval (if applicable)
- AD account creation timestamp
- M365 license assignment screenshot
- User Access Log entry
- Welcome email confirmation

RESPONSIBLE: IT Manager
APPROVERS: Department Manager (access request), Security Officer (CUI access)
TIMELINE: Complete within 2 business days of approved request
```

### Audit & Accountability (AU) — Log Review

**Business Context:** 30-person defense contractor, Microsoft Sentinel SIEM, Windows environment, Palo Alto firewall.

```
PROCEDURE: Weekly Audit Log Review
Document ID: AU-PROC-002 | Version: 1.3 | Effective: 2025-03-01

SCOPE: All audit logs from CUI environment systems forwarded to 
Microsoft Sentinel.

FREQUENCY: Weekly (every Monday by 12:00 PM).

STEPS:

1. The IT Manager opens Microsoft Sentinel > Logs and runs the 
   following saved queries:

   a. "Failed Logon Attempts (>5 per user in 7 days)"
      - KQL: SigninLogs | where ResultType != 0 | summarize 
        FailCount=count() by UserPrincipalName | where FailCount > 5
      - ACTION: Investigate accounts with excessive failures. If 
        suspicious, disable account and escalate to Security Officer.

   b. "After-Hours Privileged Access"
      - KQL: SecurityEvent | where EventID in (4672, 4673) | where 
        TimeGenerated between (datetime(prev_monday) .. datetime(today)) 
        | where hourofday(TimeGenerated) < 6 or hourofday(TimeGenerated) > 20
      - ACTION: Verify each after-hours admin action was authorized. 
        Flag unauthorized activity.

   c. "New Admin Group Membership"
      - KQL: SecurityEvent | where EventID == 4728 or EventID == 4732 
        | where TargetAccount contains "Admin"
      - ACTION: Verify each addition was approved via change request.

   d. "Firewall Denied Traffic (Top Sources)"
      - KQL: PaloAltoNetworks_CL | where Action_s == "deny" | 
        summarize count() by SourceIP_s | top 10 by count_
      - ACTION: Review top denied sources for reconnaissance patterns.

   e. "CUI File Access (SharePoint)"
      - KQL: OfficeActivity | where Operation in ("FileAccessed", 
        "FileDownloaded") | where Site_Url contains "CUI"
      - ACTION: Verify all access is from authorized users per ACM.

2. The IT Manager documents findings in the Weekly Log Review Report 
   (SharePoint > Security > Log-Reviews > {Year}-W{Week}.docx) using 
   the standard template:
   - Date/time of review
   - Queries executed
   - Number of events reviewed
   - Anomalies identified (if any)
   - Actions taken
   - Reviewer signature

3. If anomalies are found:
   a. The IT Manager creates an incident ticket per IR-PROC-001
   b. The IT Manager notifies the Security Officer within 4 hours
   c. The Security Officer determines if escalation is required

4. If no anomalies are found, the IT Manager notes "No anomalies 
   detected" in the report and signs.

5. The Security Officer reviews and countersigns the Weekly Log Review 
   Report within 2 business days.

EVIDENCE PRODUCED:
- Weekly Log Review Report (dated, signed)
- Sentinel query results (exported/screenshot)
- Incident tickets (if anomalies found)
- Security Officer countersignature

RESPONSIBLE: IT Manager (review), Security Officer (oversight)
TIMELINE: Every Monday by 12:00 PM; report completed same day
RETENTION: Reports retained for minimum 3 years per AU-POL-001
```

### Incident Response (IR) — Incident Classification & Escalation

**Business Context:** 120-person manufacturer, uses SentinelOne EDR, Microsoft Sentinel SIEM, Palo Alto firewall. MSSP (Progent) provides 24/7 monitoring.

```
PROCEDURE: Incident Classification and Escalation
Document ID: IR-PROC-002 | Version: 1.1 | Effective: 2025-02-01

SCOPE: All security incidents affecting the CUI environment.

TRIGGER: Alert from SentinelOne, Microsoft Sentinel, Palo Alto, 
user report, or MSSP (Progent) notification.

CLASSIFICATION MATRIX:

| Severity | Criteria | Response Time | Escalation |
|----------|----------|---------------|------------|
| CRITICAL | Active data exfiltration, ransomware, confirmed CUI breach | Immediate | CEO + Legal + DIBCAC (72hr) |
| HIGH | Malware on CUI system, compromised admin account, unauthorized CUI access | 1 hour | Security Officer + IT Manager |
| MEDIUM | Failed attack blocked, suspicious login pattern, policy violation | 4 hours | IT Manager |
| LOW | Phishing attempt (no click), minor policy deviation, false positive | Next business day | IT Manager (log only) |

STEPS:

1. DETECTION: Alert received via one of:
   - SentinelOne console alert (email to it-alerts@company.com)
   - Microsoft Sentinel automated incident
   - Progent (MSSP) phone call or email notification
   - Employee report to IT Manager or helpdesk

2. INITIAL TRIAGE (within 15 minutes of detection):
   a. The IT Manager (or on-call responder) reviews the alert
   b. Determines affected systems (CUI or non-CUI)
   c. Assigns severity per Classification Matrix above
   d. Creates incident ticket in [TICKETING SYSTEM]:
      - Incident ID (auto-generated: INC-{YYYY}-{###})
      - Date/time detected
      - Detection source
      - Affected systems
      - Initial severity classification
      - Initial description

3. CONTAINMENT (based on severity):
   
   CRITICAL:
   a. Isolate affected systems immediately (SentinelOne > Isolate Endpoint)
   b. Block attacker IPs at Palo Alto firewall
   c. Disable compromised accounts in Entra ID
   d. Notify Security Officer and CEO by phone
   e. Engage Progent for forensic support
   f. Begin 72-hour DFARS 7012 reporting clock
   
   HIGH:
   a. Isolate affected endpoint via SentinelOne
   b. Reset compromised credentials
   c. Notify Security Officer within 1 hour
   d. Determine if CUI was accessed/exfiltrated
   
   MEDIUM:
   a. Monitor affected systems for additional indicators
   b. Block suspicious IPs/domains if applicable
   c. Document in incident ticket
   
   LOW:
   a. Log in incident ticket
   b. No immediate containment required

4. NOTIFICATION (CRITICAL incidents only):
   a. Security Officer notifies CEO within 1 hour
   b. If CUI breach confirmed, Legal Counsel notified within 4 hours
   c. DIBCAC notification within 72 hours per DFARS 252.204-7012:
      - Report via https://dibnet.dod.mil
      - Include: company name, incident date, systems affected, 
        CUI categories involved, containment actions taken
   d. Prime contractor notified per contract requirements

5. INVESTIGATION & ERADICATION:
   a. The IT Manager (with Progent support for CRITICAL/HIGH):
      - Collects forensic evidence (SentinelOne Deep Visibility, 
        Sentinel logs, firewall logs)
      - Determines root cause
      - Identifies all affected systems
      - Removes malware/threat actor access
      - Patches exploited vulnerabilities
   b. All actions documented in incident ticket with timestamps

6. RECOVERY:
   a. Restore systems from known-good backups if needed
   b. Re-enable accounts with new credentials
   c. Verify systems are clean before reconnecting to network
   d. Monitor recovered systems for 72 hours post-recovery

7. POST-INCIDENT:
   a. The Security Officer conducts lessons-learned review within 
      5 business days of incident closure
   b. The IT Manager updates incident ticket with:
      - Root cause analysis
      - Timeline of events
      - Actions taken
      - Lessons learned
      - Recommended improvements
   c. The Security Officer updates IR Plan if process gaps identified
   d. The IT Manager implements approved improvements within 30 days

EVIDENCE PRODUCED:
- Incident ticket (complete timeline)
- SentinelOne isolation/remediation logs
- Sentinel query results
- Firewall block rules
- DIBCAC report confirmation (if applicable)
- Lessons-learned report
- IR Plan update (if applicable)

RESPONSIBLE: IT Manager (triage, containment, investigation)
ESCALATION: Security Officer (oversight), CEO (CRITICAL), Legal (breach)
EXTERNAL: Progent MSSP (monitoring, forensic support)
```

### Configuration Management (CM) — Change Control

**Business Context:** 45-person IT services company, uses ConnectWise Manage for ticketing, Azure/M365 GCC High, Intune for device management.

```
PROCEDURE: Configuration Change Control
Document ID: CM-PROC-002 | Version: 1.0 | Effective: 2025-01-01

SCOPE: All configuration changes to CUI environment systems including 
servers, workstations, network devices, cloud services (Azure/M365), 
and security tools.

CHANGE CATEGORIES:

| Category | Examples | Approval Required | Lead Time |
|----------|----------|-------------------|-----------|
| Standard | Password reset, new user, license assignment | IT Manager | Same day |
| Normal | GPO change, firewall rule, software install | IT Manager + Security Officer | 3 business days |
| Emergency | Active incident response, critical patch | IT Manager (retroactive approval) | Immediate |
| Major | New system deployment, architecture change, cloud migration | IT Manager + Security Officer + CEO | 10 business days |

STEPS:

1. REQUEST: The requestor submits a Change Request in ConnectWise Manage:
   - Change title and description
   - Systems affected
   - Business justification
   - Proposed implementation date
   - Rollback plan
   - Category (Standard/Normal/Emergency/Major)

2. SECURITY IMPACT ANALYSIS (Normal and Major changes):
   a. The IT Manager evaluates the change for security impact:
      - Does it affect CUI data flows?
      - Does it modify access controls?
      - Does it change network segmentation?
      - Does it affect encryption or authentication?
      - Does it introduce new software or services?
   b. Documents security impact assessment in the ConnectWise ticket
   c. If security impact identified, the Security Officer must review

3. APPROVAL:
   - Standard: IT Manager approves in ConnectWise
   - Normal: IT Manager approves, Security Officer reviews impact assessment
   - Emergency: IT Manager implements, documents retroactively within 24 hours
   - Major: IT Manager + Security Officer + CEO approve in ConnectWise

4. IMPLEMENTATION:
   a. The IT Manager (or assigned technician) implements the change 
      during the approved maintenance window
   b. Documents exact steps taken in the ConnectWise ticket
   c. Takes before/after screenshots of configuration changes
   d. Updates the Configuration Baseline Document (CM-DOC-001) if 
      the change modifies a baseline setting

5. VERIFICATION:
   a. The implementer verifies the change works as intended
   b. The implementer verifies no unintended side effects
   c. For security-impacting changes, the Security Officer verifies 
      security controls remain effective

6. DOCUMENTATION:
   a. The IT Manager updates the ConnectWise ticket with:
      - Implementation date/time
      - Actual steps performed
      - Before/after evidence (screenshots, exports)
      - Verification results
      - Baseline document updated? (Yes/No)
   b. The IT Manager closes the ticket

7. ROLLBACK (if change causes issues):
   a. Execute the rollback plan documented in the change request
   b. Document rollback actions and reason in ConnectWise
   c. Re-submit change request with modifications

EVIDENCE PRODUCED:
- ConnectWise change request ticket (with approvals)
- Security impact assessment
- Before/after configuration screenshots
- Updated Configuration Baseline Document
- Verification results

RESPONSIBLE: IT Manager (implementation), Security Officer (security review)
TIMELINE: Per category lead times above
```

---

## 8. Policy-to-Control Mapping Guide

### How to Connect Policy Statements to NIST Controls

Every policy statement should trace to one or more NIST 800-171 controls. This mapping is what assessors use to verify coverage.

**Template for Policy Statements:**

```
POLICY STATEMENT [AC-PS-001]:
[Clear, enforceable requirement statement]

NIST 800-171 Controls: [Control IDs]
Implementation: [Brief description of how this is implemented]
Procedure Reference: [Procedure document ID]
Evidence: [What proves this is being followed]
```

**Example — Access Control Policy Statements:**

```
AC-PS-001: All system access requires unique user identification 
and authentication before access is granted.
  NIST: 03.01.01, 03.05.01, 03.05.02
  Implementation: Active Directory enforces unique usernames; 
  Entra ID Conditional Access requires MFA for all users.
  Procedure: AC-PROC-001 (Account Provisioning)
  Evidence: AD user list, Conditional Access policy export

AC-PS-002: Access to CUI is restricted to authorized personnel 
based on job function using role-based access control.
  NIST: 03.01.01, 03.01.02, 03.01.05
  Implementation: Access Control Matrix defines role-to-access 
  mappings; AD security groups enforce RBAC.
  Procedure: AC-PROC-001 (Provisioning), AC-PROC-003 (Quarterly Review)
  Evidence: Access Control Matrix, AD security group export

AC-PS-003: User access is reviewed quarterly and modified or 
revoked when no longer required.
  NIST: 03.01.01, 03.01.02
  Implementation: Quarterly access review process with department 
  manager validation.
  Procedure: AC-PROC-003 (Quarterly Access Review)
  Evidence: Quarterly review reports with sign-off

AC-PS-004: System access is terminated within 4 hours of 
involuntary separation and by end of last business day for 
voluntary departures.
  NIST: 03.01.01, 03.09.02
  Implementation: HR notifies IT Manager; IT Manager disables 
  AD/M365/VPN accounts per termination checklist.
  Procedure: AC-PROC-004 (Account Termination)
  Evidence: Termination checklists, AD disable timestamps

AC-PS-005: Remote access to the CUI environment requires VPN 
with multi-factor authentication.
  NIST: 03.01.12, 03.05.03
  Implementation: Palo Alto GlobalProtect VPN with Entra ID 
  MFA integration; split-tunnel disabled for CUI traffic.
  Procedure: AC-PROC-005 (Remote Access Configuration)
  Evidence: GlobalProtect config export, Conditional Access policy
```

---

## 9. Common Mistakes and How to Fix Them

### Mistake 1: Template Policies Without Customization

**Problem:** Client downloads a CMMC policy template and submits it with minimal changes.

**What the assessor sees:**
- Generic language: "The organization shall..."
- References to tools the org doesn't use
- Procedures that don't match actual practice
- Placeholder text still present

**Fix:** Interview the client about their actual processes, then rewrite each section to reflect reality. A 5-page policy that accurately describes what they do beats a 50-page template they don't follow.

### Mistake 2: Policy Without Procedures

**Problem:** Client has a policy that says "Access reviews shall be conducted quarterly" but no procedure describing how.

**What the assessor sees:**
- Policy exists but no evidence of execution
- Staff can't describe the process when interviewed
- No records of reviews being performed

**Fix:** Write the procedure FIRST (document what they actually do), then write the policy to formalize it. Bottom-up is easier than top-down.

### Mistake 3: Procedures That Don't Match Reality

**Problem:** Procedure says "The CISO reviews all access requests" but the org doesn't have a CISO — the IT Manager does everything.

**What the assessor sees:**
- Procedure names a role that doesn't exist
- Interview reveals different person/process
- Credibility of all documentation questioned

**Fix:** Use actual job titles. If the IT Manager is also the Security Officer, document that: *"The IT Manager, who also serves as the Security Officer for the organization, reviews..."*

### Mistake 4: Missing Evidence Trail

**Problem:** Procedure is well-written but produces no evidence.

**What the assessor sees:**
- Good procedure on paper
- No records proving it's followed
- "We do it but don't document it"

**Fix:** Every procedure must end with an "Evidence Produced" section listing the specific artifacts created. Build evidence collection into the procedure itself.

### Mistake 5: One-Size-Fits-All Timelines

**Problem:** Small org copies enterprise timelines (30-day change windows, weekly CAB meetings).

**What the assessor sees:**
- Unrealistic timelines that aren't being met
- Evidence shows changes happening faster than procedure allows
- Procedure is aspirational, not operational

**Fix:** Set timelines that match the org's actual cadence. A 20-person company can approve changes in hours, not weeks. Document what's real.

---

## 10. Integration with Other Skills

### Workflow: Policy → SSP → Assessment → POA&M

```
1. POLICY ADVISOR (this skill)
   → Determines what policies/procedures are needed
   → Tailors to business context
   → Generates procedure templates

2. SSP GENERATOR (ssp-generator skill)
   → Takes policy/procedure content
   → Generates SSP implementation narratives per control
   → References policies as evidence artifacts

3. CMMC ASSESSMENT (cmmc-assessment skill)
   → Evaluates policies against assessment objectives
   → Identifies gaps in documentation
   → Verifies evidence adequacy

4. POA&M OPERATOR (poam-operator skill)
   → Creates POA&M entries for policy/procedure gaps
   → Tracks remediation (write missing procedures, update stale policies)
   → Moves completed items when documentation is finalized
```

### Handoff Triggers

| From This Skill | To Skill | When |
|-----------------|----------|------|
| Policy Advisor | SSP Generator | Policies/procedures written → generate SSP narratives |
| Policy Advisor | CMMC Assessment | Existing policy reviewed → evaluate against objectives |
| CMMC Assessment | Policy Advisor | Gap identified → need new policy or procedure |
| POA&M Operator | Policy Advisor | POA&M item = "documentation gap" → write the procedure |

---

## Response Format

When advising on policies and procedures:

1. **Ask for business context** if not provided (org size, tools, industry, CUI types)
2. **Identify which policies/procedures are needed** for the requested controls
3. **Provide the procedure at Level 3 quality** (assessment-ready, tool-specific, with evidence)
4. **Map to NIST controls** explicitly
5. **Flag common mistakes** for the org's profile
6. **List evidence artifacts** the procedure will produce
7. **Provide copy-paste-ready content** formatted for the client's documentation system

When reviewing existing policies:
1. Run through the Policy Review Checklist (Section 6)
2. Identify specific gaps with line-level feedback
3. Provide rewrite suggestions at Level 3 quality
4. Flag interview risks (where staff answers won't match documentation)
5. Prioritize fixes by assessment impact
