---
name: cmmc-assessment
description: "Expert guidance for CMMC Level 2 assessments, NIST 800-171A compliance, and defense contractor cybersecurity documentation. Use this skill when: (1) Generating SSP-ready control statements and narratives, (2) Evaluating evidence adequacy (screenshots, policies, procedures, logs) against CMMC/NIST requirements, (3) Performing gap analysis on security controls, (4) Providing assessment feedback aligned with CMMC Assessment Guide and NIST 800-171A Rev 2 methodologies, (5) Reviewing scope documentation for CUI environments"
license: Proprietary
---

# CMMC Assessment & NIST 800-171A Documentation

## Overview

This skill provides expert guidance for CMMC Level 2 assessments and NIST 800-171A Rev 2 compliance work with defense contractors. It enables rigorous evidence evaluation, SSP statement generation, and gap analysis using official CMMC 2.0/2.1 assessment methodologies.

## Quick Reference

| Task | Approach |
|------|----------|
| Evaluate evidence adequacy | Use Evidence Evaluation Framework (see below) |
| Generate SSP statements | Follow SSP Statement Structure template |
| Assess control implementation | Apply CMMC Objective Assessment methodology |
| Identify gaps | Use Gap Analysis Criteria |
| Review policies/procedures | Apply Documentation Quality Standards |
| Scope CUI environment | Follow CMMC Scoping Guide principles |

## Core Assessment Principles

### CMMC Assessment Philosophy

**CRITICAL:** CMMC assessments evaluate three dimensions for each practice:
1. **Implementation** - Is the practice actually in place?
2. **Documentation** - Is there evidence the practice exists?
3. **Effectiveness** - Does the practice achieve its intended security outcome?

Evidence must demonstrate **all three dimensions** to meet the objective.

### Evidence Hierarchy

Evidence quality from strongest to weakest:

1. **System-Generated Evidence** (Highest)
   - Configuration exports, logs, automated reports
   - Screenshots with metadata/timestamps
   - Tool-generated compliance reports

2. **Documented Procedures**
   - Formal policies with approval/version control
   - Standard Operating Procedures (SOPs)
   - Work instructions with defined roles

3. **Process Evidence**
   - Records of implementation (tickets, forms, checklists)
   - Interview confirmations
   - Activity logs showing actual practice

4. **Attestation** (Lowest)
   - Self-declaration without supporting evidence
   - Verbal confirmation only
   - Plans without proof of execution

**Assessment Rule:** Higher evidence quality reduces need for additional corroboration. Lower quality requires multiple sources.

## Evidence Evaluation Framework

### Assessment Questions for Any Evidence

When reviewing evidence (screenshot, policy, log, etc.), evaluate against these criteria:

#### 1. Relevance
- ✅ Does this evidence address the specific CMMC practice/NIST control?
- ✅ Is it scoped to the CUI environment (not out-of-scope systems)?
- ✅ Does it demonstrate the required security function?

#### 2. Completeness
- ✅ Are all aspects of the practice covered?
- ✅ If multiple systems exist, is evidence from each included?
- ✅ Are all required data elements present (who, what, when, where)?

#### 3. Currency
- ✅ Is the evidence recent enough to demonstrate current state?
- ✅ For periodic activities: Does evidence show the required frequency?
- ✅ For continuous controls: Does evidence show ongoing operation?

#### 4. Authenticity
- ✅ Can the evidence be verified as genuine?
- ✅ Is the source system/process identifiable?
- ✅ Are timestamps/metadata present and consistent?

#### 5. Sufficiency
- ✅ Does the evidence meet the assessment objective independently?
- ✅ Or does it require corroboration from additional sources?
- ✅ Does it demonstrate actual implementation (not just intent)?

### Evidence Adequacy Determination

**ADEQUATE:** Evidence clearly demonstrates implementation, is current, complete, and authentic. Single source may suffice if high quality.

**PARTIALLY ADEQUATE:** Evidence shows some implementation but has gaps:
- Missing required elements
- Outdated or inconsistent timestamps
- Covers only portion of scope
- Requires additional corroboration

**INADEQUATE:** Evidence fails to demonstrate practice implementation:
- Addresses wrong control/practice
- Shows only planning/intent, not implementation
- Out of scope or irrelevant
- Unverifiable or questionable authenticity
- Does not support assessment objective

### Red Flags in Evidence

**CRITICAL:** Watch for these indicators of inadequate evidence:

❌ **Generic templates without customization** - Boilerplate text not adapted to organization
❌ **Future-tense language** - "Will implement" instead of "Is implemented"
❌ **Missing dates/versions** - No way to verify currency
❌ **No approval/ownership** - Policy without authorized signatory
❌ **Theoretical descriptions** - Explains what should happen, not what does happen
❌ **Out-of-scope systems** - Evidence from non-CUI environment
❌ **Inconsistent information** - Evidence contradicts other sources
❌ **Screenshots without context** - No labels, unclear what is shown
❌ **Incomplete coverage** - Missing required systems or components

## SSP Statement Generation

### SSP Statement Structure

Every SSP control implementation statement should follow this pattern:

```
[ORGANIZATION] implements [CONTROL FAMILY.CONTROL NUMBER] ([CONTROL NAME]) 
by [SPECIFIC IMPLEMENTATION METHOD(s)].

[DETAILED IMPLEMENTATION NARRATIVE:]
- [WHO] performs [WHAT ACTION] using [WHAT TOOL/PROCESS]
- [HOW] the security function is achieved
- [WHEN/FREQUENCY] the activity occurs
- [WHERE] the control is implemented (systems/locations)

[EVIDENCE REFERENCE:]
Evidence of implementation includes [EVIDENCE TYPE 1], [EVIDENCE TYPE 2], etc.

[RESPONSIBLE ROLES:]
Responsible Role: [POSITION/TITLE]
Supporting Roles: [OTHER POSITIONS if applicable]
```

### SSP Writing Guidelines

**Use active, present-tense language:**
- ✅ "The IT Manager reviews access logs monthly"
- ❌ "Access logs will be reviewed by IT staff"

**Be specific about implementation:**
- ✅ "Using Cisco Meraki dashboard, the Network Administrator configures firewall rules..."
- ❌ "Firewalls are configured appropriately"

**Quantify where possible:**
- ✅ "Within 24 hours of termination notification"
- ❌ "In a timely manner"

**Name actual tools and systems:**
- ✅ "Microsoft Defender for Endpoint scans all workstations daily"
- ❌ "Antivirus software scans endpoints regularly"

**CRITICAL:** SSP statements must describe CURRENT implementation, not plans or intentions.

### Control-Specific SSP Patterns

#### Access Control Example (AC.L2-3.1.1 - Authorized Access)

```
[ORGANIZATION] implements AC.L2-3.1.1 (Limit system access to authorized users) 
through role-based access control (RBAC) enforced in Microsoft 365 and on-premises 
Active Directory.

All user accounts are created following the Account Provisioning Procedure (AP-001). 
The IT Manager approves access requests via [TICKETING SYSTEM] and provisions accounts 
based on the Access Control Matrix (ACM-2024). User permissions are assigned according 
to job function and principle of least privilege.

Technical enforcement includes:
- Active Directory security groups mapped to business roles
- Microsoft 365 conditional access policies requiring MFA
- Network access control via Cisco ISE authenticating against AD
- Application-level permissions managed through SSO (Okta)

Evidence of implementation includes: Access Control Matrix, Account Provisioning 
Procedure (AP-001), Active Directory security group export, Okta access policy 
configuration, sample access request tickets showing approval workflow.

Responsible Role: IT Manager
Supporting Roles: System Owner, Security Officer
```

#### Audit and Accountability Example (AU.L2-3.3.1 - Audit Events)

```
[ORGANIZATION] implements AU.L2-3.3.1 (Create audit records) through centralized 
logging to [SIEM/LOG MANAGEMENT TOOL] from all CUI environment systems.

Auditable events are defined in the Audit and Accountability Policy (AA-POL-001) 
and include: successful/failed logon attempts, privileged command execution, account 
management actions, object access events, policy changes, and system events.

Event logging is configured as follows:
- Windows systems: Advanced Audit Policy configured via GPO to capture Security event 
  IDs [SPECIFIC EVENT IDS]
- Linux systems: auditd rules capturing authentication, file access, and privileged 
  command execution
- Network devices: syslog forwarding to [LOG SERVER] capturing config changes and 
  access events
- Applications: Application-specific logging per vendor guidance

All logs are forwarded to [CENTRALIZED SYSTEM] with minimum retention of 90 days 
per Audit Log Retention Policy (AA-POL-002).

Evidence of implementation includes: Audit and Accountability Policy (AA-POL-001), 
Windows GPO audit configuration export, Linux auditd.rules file, SIEM event 
correlation rule configuration, sample audit log extracts showing defined events.

Responsible Role: Security Officer
Supporting Roles: IT Manager, System Administrators
```

## Assessment Objective Methodology

### NIST 800-171A Assessment Objectives

Each NIST control has specific assessment objectives. When evaluating evidence or generating statements, map to these objectives:

**Determine if:**
- [Objective a] The organization... [specific requirement]
- [Objective b] The organization... [specific requirement]
- [Objective c] The organization... [specific requirement]

**Example: AC.L2-3.1.2 (Transaction & Function Control)**

Assessment objectives:
- **Determine if:** [a] the organization identifies types of transactions and functions authorized for CUI
- **Determine if:** [b] the organization limits access to those types of transactions and functions

**Evidence must demonstrate BOTH objectives** - not just that authorized transactions are identified, but that access is actually limited.

### Interview Validation Approach

Evidence review is often supplemented by interviews. When assessing evidence adequacy, consider what interview questions would validate implementation:

**For Policies/Procedures:**
- "Walk me through how you actually perform this in practice"
- "Show me a recent example of this being done"
- "What happens if [exception scenario]?"

**For Screenshots/Configurations:**
- "How do you maintain this configuration?"
- "Who can change this setting?"
- "How would you know if this changed?"

**For Logs/Reports:**
- "How often do you review these?"
- "What actions do you take based on these results?"
- "Show me an example of acting on this information"

**CRITICAL:** Evidence is inadequate if likely interview answers would reveal the practice isn't actually implemented as documented.

## Gap Analysis Criteria

### Identifying Implementation Gaps

When reviewing evidence against a CMMC practice, categorize gaps as:

#### 1. **Full Gap** - Practice Not Implemented
- No evidence of the security function existing
- Only plans or intentions documented
- Implementation applies only to out-of-scope systems
- Required technical controls are absent

**Gap Statement Template:**
```
GAP: [PRACTICE ID] - [PRACTICE NAME]
Severity: High
Current State: [What exists today, if anything]
Required State: [What CMMC/NIST requires]
Recommended Action: [Specific implementation steps]
Resources Needed: [Tools, budget, personnel]
Estimated Timeline: [Realistic implementation timeframe]
```

#### 2. **Partial Gap** - Incomplete Implementation
- Practice implemented for some but not all systems
- Some assessment objectives met, others not
- Control exists but effectiveness uncertain
- Documentation incomplete or outdated

**Partial Gap Template:**
```
PARTIAL GAP: [PRACTICE ID] - [PRACTICE NAME]
Severity: Medium/High
Implemented Aspects: [What is currently in place]
Missing Elements: [What still needs implementation]
Evidence Status: [What documentation exists vs. what's needed]
Recommended Action: [Steps to complete implementation]
Estimated Timeline: [Timeframe to close gap]
```

#### 3. **Documentation Gap** - Implemented but Undocumented
- Practice appears to be implemented
- Insufficient or missing documentation
- No evidence trail despite actual implementation
- Tribal knowledge only

**Documentation Gap Template:**
```
DOCUMENTATION GAP: [PRACTICE ID] - [PRACTICE NAME]
Severity: Medium
Implementation Status: Appears implemented based on [observation/interview]
Documentation Status: Missing [specific documentation needs]
Required Evidence: [List needed documentation/evidence]
Recommended Action: [Steps to document existing practice]
Estimated Timeline: [Usually shorter - documentation only]
```

### Common CMMC Documentation Gaps

**Access Control (AC):**
- Access Control Matrix missing or outdated
- No documented provisioning/deprovisioning process
- Privilege escalation procedures undefined
- Remote access policy lacks technical enforcement details

**Awareness and Training (AT):**
- Training completion records don't cover all personnel
- Training content doesn't address CUI-specific requirements
- No evidence of periodic refresher training
- Security awareness materials are generic, not customized

**Audit and Accountability (AU):**
- Audit event definitions not documented
- Log retention period not specified or enforced
- No evidence of log review actually occurring
- Clock synchronization not configured or documented

**Configuration Management (CM):**
- Baseline configurations not documented
- Change control process exists but not followed
- No evidence of configuration monitoring
- Baseline deviations not tracked

**Identification and Authentication (IA):**
- Password requirements documented but not enforced
- MFA implemented but not for all required access scenarios
- Account management procedures incomplete
- No process for handling shared/group accounts

**Incident Response (IR):**
- IR plan exists but not tested
- No evidence of actual incidents being handled per plan
- Contact lists outdated
- No documentation of lessons learned

**Maintenance (MA):**
- Maintenance activities occur but aren't logged
- No process for sanitizing/supervising maintenance
- Tools used for maintenance aren't controlled
- Remote maintenance lacks distinct authentication

**Media Protection (MP):**
- Media sanitization performed but process not documented
- No tracking of CUI media location/status
- Disposal certificates missing
- Transportation security not addressed

**Physical Protection (PE):**
- Visitor logs exist but don't capture required information
- Physical access controls rely on attestation
- No evidence of access credential management
- Monitoring/escort procedures not defined

**Risk Assessment (RA):**
- Risk assessment exists but outdated (>3 years)
- Doesn't cover all systems in scope
- Vulnerabilities identified but not tracked to remediation
- No evidence of supply chain risk consideration

**Security Assessment (CA):**
- No regular assessment of control effectiveness
- Remediation plans exist but tracking incomplete
- Plans of Action & Milestones (POA&M) not maintained
- No connection between assessments and updates to security posture

**System and Communications Protection (SC):**
- Boundary protections exist but configuration not documented
- Cryptography in use but key management process missing
- Network segmentation implemented but not documented
- Public access controls not fully defined

**System and Information Integrity (SI):**
- Flaw remediation happening but no metrics/tracking
- Malware protection configured but update process unclear
- Security alerts generated but response process undocumented
- Information input validation spotty or undocumented

## Scope Documentation Review

### CMMC Scoping Principles

**CRITICAL:** Evidence must clearly demonstrate implementation within the defined CUI environment boundary.

When reviewing scope documentation, verify:

✅ **CUI Asset Identification**
- All systems that process, store, or transmit CUI are identified
- Asset inventory distinguishes CUI vs non-CUI systems
- Connections between CUI and non-CUI environments are mapped

✅ **Security Protection Asset Identification**
- Systems that protect CUI are identified (firewalls, IDS, SIEM, etc.)
- Security infrastructure is included even if it doesn't touch CUI directly
- Management/monitoring systems for CUI environment are in scope

✅ **Contractor Risk Managed Assets (CRMA)**
- Assets with limited/no CUI but requiring protection are identified
- Justification for CRMA designation is documented
- Appropriate subset of controls applied to CRMA is defined

✅ **Out-of-Scope Justification**
- Clear technical separation from CUI environment
- No data flow or administrative connection to in-scope systems
- Out-of-scope status is defensible and documented

### Scope Red Flags

❌ **Overly aggressive scoping** - Excluding systems that clearly interact with CUI
❌ **Vague boundaries** - "Cloud" or "Corporate network" without specifics
❌ **Missing security infrastructure** - Not including firewalls, logging, etc.
❌ **Inconsistent asset lists** - Different inventories showing different systems
❌ **No network diagram** - Cannot visualize CUI data flows
❌ **Unexplained CRMA designation** - Using CRMA to avoid full compliance

## Policy and Procedure Review Standards

### Documentation Quality Criteria

When reviewing policies and procedures, evaluate:

#### 1. Formal Characteristics
✅ Document identifier/version number
✅ Effective date and review date
✅ Approval signature and date
✅ Distribution/audience clearly stated
✅ Review frequency defined (typically annually)

#### 2. Content Completeness
✅ Purpose/scope clearly stated
✅ Roles and responsibilities defined
✅ Specific procedures with step-by-step instructions
✅ References to related documents
✅ Compliance mapped to specific CMMC/NIST controls

#### 3. Implementation Evidence Integration
✅ Names actual tools/systems used by organization
✅ References specific job titles/roles in organization
✅ Includes organization-specific details (not generic template)
✅ Procedures match actual practice (verifiable through interview)
✅ Contact information is current

### Policy vs. Procedure Distinction

**Policy (What & Why):**
- High-level statement of intent
- Defines requirements and standards
- Sets organizational position
- Approved by senior leadership

**Procedure (How):**
- Step-by-step instructions
- Defines specific process
- Includes roles, tools, timelines
- Operational guidance for staff

**Example:**

**Policy Statement:** "All user accounts must be reviewed quarterly to ensure access remains appropriate to current job function."

**Procedure:** 
```
1. IT Manager generates Active Directory user report on first business day of 
   Jan/Apr/Jul/Oct
2. IT Manager emails report to each Department Manager within 2 business days
3. Department Managers review assigned users and mark for continued access or removal
4. Department Managers return marked report within 10 business days
5. IT Manager disables accounts marked for removal within 2 business days
6. IT Manager archives completed review documentation to SharePoint/Access-Reviews/
```

**CRITICAL:** Procedures must be this specific to demonstrate implementation maturity.

## Screenshot Evidence Guidelines

### Effective Screenshot Evidence

Screenshots are common evidence but often inadequate. Quality screenshots include:

✅ **Context Information:**
- Date/timestamp visible
- System/application name clear
- User account shown (if relevant to demonstrate segregation)
- URL visible (for web applications)

✅ **Relevant Configuration:**
- Specific setting being demonstrated is visible
- Surrounding context shows where setting exists
- Full path to setting (navigation breadcrumbs)
- Applied/enabled status clear

✅ **Completeness:**
- All required settings visible in frame
- If multi-page, all pages captured
- Lists/tables not truncated mid-content
- No critical information cut off at edges

✅ **Annotations (When Helpful):**
- Arrows/boxes highlighting key elements
- Labels explaining what is shown
- Especially useful for complex interfaces
- Keep annotations professional

### Screenshot Inadequacy Examples

❌ **Too zoomed in** - Shows one setting but no context of what system/screen
❌ **Cut-off content** - Missing top menu bar, can't identify system
❌ **Outdated** - Screenshot from previous year doesn't show current state
❌ **Wrong system** - Shows out-of-scope test environment, not production
❌ **Unclear relevance** - Not obvious how screenshot addresses the requirement
❌ **No timestamp** - Cannot verify currency
❌ **Generic dashboard** - Shows system exists but not specific required configuration

### Screenshot Best Practices by Control Family

**Access Control:**
- User list showing account status (enabled/disabled)
- Permission assignments for specific accounts
- Group membership for role-based access
- Conditional access policies and enforcement

**Audit and Accountability:**
- Audit policy configuration showing enabled categories
- Log export showing event types being captured
- Retention policy settings
- SIEM correlation rules for defined events

**Identification and Authentication:**
- Password policy settings (length, complexity, history)
- MFA enrollment status by user
- Account lockout policy configuration
- Session timeout settings

**System and Communications Protection:**
- Firewall rule sets showing boundary protection
- Encryption settings (in-transit, at-rest)
- Network segmentation configuration
- TLS/SSL certificate settings

## Common Assessment Pitfalls

### Evidence Collection Mistakes

**Pitfall 1: Providing Plans Instead of Implementation**
- **Issue:** POA&M, implementation plans, or roadmaps submitted as evidence
- **Why Inadequate:** Shows intent, not current state
- **Solution:** Request evidence of actual deployment/operation

**Pitfall 2: Generic Templates Without Customization**
- **Issue:** Downloaded policy templates with placeholder text
- **Why Inadequate:** Doesn't prove organizational implementation
- **Solution:** Require organization-specific details, approvals, version history

**Pitfall 3: Out-of-Scope Evidence**
- **Issue:** Evidence from test environments, personal devices, or non-CUI systems
- **Why Inadequate:** Doesn't demonstrate protection of CUI environment
- **Solution:** Verify evidence is from in-scope systems per asset inventory

**Pitfall 4: Undated Documentation**
- **Issue:** Policies without effective dates, screenshots without timestamps
- **Why Inadequate:** Cannot verify currency
- **Solution:** Require dated/versioned documentation and current evidence

**Pitfall 5: Single Evidence Source for Complex Controls**
- **Issue:** One screenshot submitted for multi-faceted requirement
- **Why Inadequate:** Doesn't cover all assessment objectives
- **Solution:** Map evidence to each specific objective, request additional sources

**Pitfall 6: Attestation Without Corroboration**
- **Issue:** Self-declaration or interview statements with no supporting evidence
- **Why Inadequate:** Lowest evidence quality, easily disputed
- **Solution:** Request system-generated or documented proof

**Pitfall 7: Theoretical Descriptions**
- **Issue:** SSP describes how control "would work" using future tense
- **Why Inadequate:** Describes intent, not implementation
- **Solution:** Require present-tense narrative with evidence of operation

### Assessment Methodology Errors

**Error 1: Not Validating Across All Systems**
- **Issue:** Accepting evidence from one system when multiple exist in scope
- **Why Problematic:** Partial implementation doesn't meet control
- **Solution:** Verify evidence covers all in-scope assets

**Error 2: Accepting Compensating Controls Without Analysis**
- **Issue:** Alternative implementation accepted without equivalence review
- **Why Problematic:** May not achieve same security outcome
- **Solution:** Rigorously evaluate if compensating control meets intent

**Error 3: Not Testing Effectiveness**
- **Issue:** Configuration shown but actual operation not validated
- **Why Problematic:** Setting may exist but not function as intended
- **Solution:** Request operational evidence (logs showing control in action)

**Error 4: Inconsistent Evidence Standards**
- **Issue:** Accepting lower quality evidence for some controls than others
- **Why Problematic:** Creates audit risk and unfair assessment
- **Solution:** Apply Evidence Evaluation Framework consistently

## Contextual Assessment Approach

### Tailoring to Organizational Size/Maturity

Evidence expectations should be calibrated to organization size and maturity while still meeting requirements:

**Small Organizations (<50 employees):**
- May have combined roles (IT Manager = Security Officer)
- Simpler technical environments
- Less formal documentation acceptable if processes clear
- Tool selection often limited by budget
- **Still Required:** All practices implemented, evidence demonstrable

**Medium Organizations (50-250 employees):**
- Beginning role specialization
- Mix of manual processes and automation
- Increasing documentation formality
- Multiple systems requiring coordination
- **Still Required:** More sophisticated evidence, clearer procedures

**Large Organizations (>250 employees):**
- Dedicated security roles
- Mature processes with automation
- Formal change management
- Enterprise tools and integration
- **Still Required:** Comprehensive documentation, evidence at scale

**CRITICAL:** Organization size affects HOW controls are implemented, not WHETHER they must be implemented. All 110 practices are required regardless of size.

### Industry-Specific Considerations

**Manufacturing/Production:**
- Operational Technology (OT) considerations
- CUI often in design files, production data
- Physical security highly relevant
- Legacy systems common
- **Watch For:** IT/OT convergence, older systems unable to support modern controls

**Engineering/Design:**
- Heavy use of CAD/CAM systems
- Large file transfers with partners
- Intellectual property is CUI
- Cloud collaboration tools
- **Watch For:** Third-party file sharing, bring-your-own-device usage

**Professional Services/Consulting:**
- Distributed workforce
- Remote access critical
- CUI in documents/emails
- Less physical infrastructure
- **Watch For:** Home office security, personal device usage, cloud-only environments

**Software Development:**
- Code repositories containing CUI
- Development/production separation
- CI/CD pipelines
- Cloud-native architectures
- **Watch For:** DevOps practices, container security, API security

## Feedback Delivery Guidelines

### Constructive Gap Communication

When providing assessment feedback, follow this structure:

**1. Acknowledge What's Working**
Start with implemented controls or partial implementations to maintain engagement.

**2. Clearly State the Gap**
Be specific about what's missing, using CMMC/NIST language.

**3. Explain the Security Risk**
Help client understand WHY the control matters (not just compliance).

**4. Provide Actionable Recommendations**
Give specific, achievable steps to close the gap.

**5. Offer Resources/Examples**
Reference templates, tools, or examples when available.

### Feedback Template

```
CONTROL: [PRACTICE ID] - [PRACTICE NAME]
Assessment Objective: [Specific objective from 800-171A]

CURRENT STATE:
[Objective description of what evidence shows]

GAP IDENTIFIED:
[Specific deficiency - what's missing or inadequate]

SECURITY IMPACT:
[Why this control matters - the actual risk]

RECOMMENDED ACTIONS:
1. [Specific step 1]
2. [Specific step 2]
3. [Specific step 3]

EVIDENCE NEEDED:
[What documentation/evidence will demonstrate closure]

IMPLEMENTATION NOTES:
[Any org-specific context, challenges, or considerations]
```

### Example Feedback

```
CONTROL: AC.L2-3.1.5 - Prevent non-privileged users from executing privileged functions
Assessment Objective: Determine if the organization prevents non-privileged users from 
executing privileged functions.

CURRENT STATE:
The organization has documented standard user accounts in Active Directory. However, 
submitted evidence (AD group membership screenshot) shows multiple users in "Domain Admins" 
group. Interview indicated these users have admin rights for convenience.

GAP IDENTIFIED:
Privileged access is not restricted to authorized personnel performing admin functions. 
Users have persistent elevated privileges rather than just-in-time elevation. No 
documented justification for which roles require privileged access.

SECURITY IMPACT:
Excessive privileged access increases risk of:
- Accidental system misconfiguration by unauthorized users
- Intentional or unintentional data exfiltration
- Malware executing with elevated rights if user compromised
- Difficulty in audit trail when many accounts have admin access

RECOMMENDED ACTIONS:
1. Create Access Control Matrix defining which job roles require privileged access
2. Remove unnecessary users from privileged groups (Domain Admins, Enterprise Admins, etc.)
3. Implement Just-In-Time (JIT) privileged access using:
   - Option A: Privileged Access Management (PAM) solution (CyberArk, BeyondTrust, etc.)
   - Option B: Microsoft PIM (if using Azure AD Premium)
   - Option C: Manual elevation via separate admin accounts with strict processes
4. Document privileged account management procedures
5. Implement monitoring/alerting on privileged account usage

EVIDENCE NEEDED:
- Access Control Matrix showing privileged access roles
- Updated AD group membership showing reduced privileged accounts
- PAM/PIM configuration screenshots OR privileged account procedures
- Sample evidence of privilege elevation process (ticket, approval, log)

IMPLEMENTATION NOTES:
For an organization of your size (~25 users), separate admin accounts with documented 
procedures (Option C) is acceptable. Full PAM solution may be cost-prohibitive. Ensure 
admin accounts have distinct credentials from standard accounts (e.g., jsmith vs jsmith-admin) 
and are only used for administrative tasks.
```

## Quick Assessment Checklist

Use this checklist when reviewing any evidence submission:

### Pre-Review
- [ ] Confirmed control/practice being assessed
- [ ] Reviewed all assessment objectives from 800-171A
- [ ] Verified systems in scope per asset inventory
- [ ] Noted any organization-specific context

### Evidence Review
- [ ] Evidence is relevant to the specific control
- [ ] Evidence is from in-scope CUI environment
- [ ] Evidence is current (dated within assessment period)
- [ ] Evidence can be verified as authentic
- [ ] Evidence demonstrates actual implementation (not plans)
- [ ] Evidence covers all required systems/locations
- [ ] Evidence addresses all assessment objectives

### Documentation Review (if policy/procedure)
- [ ] Document has version control and approval
- [ ] Document is specific to organization (not generic template)
- [ ] Document references actual tools/roles/systems
- [ ] Procedures are detailed enough to follow
- [ ] Document is current (reviewed within last year)

### Gap Analysis
- [ ] Identified what is working/implemented
- [ ] Clearly stated what is missing or inadequate
- [ ] Categorized gap (full, partial, documentation)
- [ ] Determined severity and security impact
- [ ] Developed specific remediation recommendations

### Communication
- [ ] Feedback is specific and actionable
- [ ] Security rationale is clear
- [ ] Recommendations are appropriate to org size/maturity
- [ ] Evidence requirements for closure are defined
- [ ] Timeline expectations are realistic

## Additional Resources

### Key Reference Documents

- **NIST SP 800-171 Rev 2** - The 110 security requirements
- **NIST SP 800-171A Rev 2** - Assessment procedures and objectives
- **CMMC Model 2.0/2.1** - Practice definitions and alignment
- **CMMC Assessment Guide** - Level 2 assessment methodology
- **CMMC Scoping Guide** - CUI environment boundary definition

### Common Evidence Types by Control

**Policies/Procedures:**
- Access Control Policy
- Incident Response Plan
- Configuration Management Plan
- Media Protection Policy
- Physical Security Policy

**Technical Configurations:**
- Firewall rule sets
- Audit policy settings
- MFA enrollment reports
- Encryption configurations
- Baseline configurations

**Operational Records:**
- Access review documentation
- Training completion records
- Incident response logs
- Vulnerability scan results
- Penetration test reports

**Inventory/Tracking:**
- Asset inventory
- CUI data flow diagrams
- Network diagrams
- Media tracking logs
- Software inventory

## Remember

**Core Assessment Principle:** Evidence must prove the practice is implemented, documented, and effective. "Could be compliant" is not compliant. The assessment standard is "preponderance of evidence" - more likely than not that the control is implemented and effective.

**When in Doubt:** Request additional evidence or corroboration. It's better to gather sufficient evidence during assessment than discover gaps during C3PAO audit.

**Client Education:** Help clients understand that CMMC is about actual security, not checkbox compliance. Controls that appear on paper but don't function provide no protection to CUI.
