---
name: ssp-generator
description: "System Security Plan (SSP) generation and implementation narrative authoring for CMMC Level 2 / NIST 800-171. Use this skill when: (1) Generating SSP control implementation statements, (2) Building complete SSP sections with narratives, evidence references, and responsible roles, (3) Reviewing existing SSP content for assessment readiness, (4) Mapping tools/processes to controls, (5) Producing exportable SSP content."
license: Proprietary
---

# SSP Generator & Implementor - CMMC Level 2

## Overview

This skill generates complete, assessment-ready System Security Plan (SSP) content for CMMC Level 2 / NIST 800-171. It transforms assessment data, implementation details, and organizational context into structured SSP narratives that satisfy C3PAO requirements.

## Quick Reference

| Task | Approach |
|------|----------|
| Generate SSP statement for a control | Use Control Implementation Statement Template |
| Build full SSP section for a family | Use Family Section Generator |
| Review existing SSP content | Apply SSP Quality Checklist |
| Map tools to controls | Use Technology-to-Control Mapping |
| Handle inherited controls | Use Shared Responsibility Narrative |
| Address partial implementations | Use Partial Implementation Narrative |

## Core Principles

### SSP Purpose

The SSP is the **foundational document** for CMMC Level 2 assessment:
- Describes HOW each of 110 NIST 800-171 requirements is implemented
- Identifies WHO is responsible for each control
- Documents WHAT tools and processes enforce each requirement
- Provides EVIDENCE REFERENCES for assessor verification
- Defines the CUI SCOPE BOUNDARY

**CRITICAL:** The SSP is the #1 cause of assessment failure when incomplete, outdated, or future-tense.

### Writing Rules

**ALWAYS:**
- Present tense: "The IT Manager reviews access logs monthly"
- Name tools: "Microsoft Defender for Endpoint scans all workstations daily"
- Quantify: "Within 24 hours of termination notification"
- Reference roles: "The Security Officer conducts quarterly access reviews"
- Address each [a], [b], [c] sub-objective explicitly

**NEVER:**
- Future tense: "Will implement" or "Plans to deploy"
- Vague: "Appropriate controls are in place"
- Generic: "Antivirus software" instead of "SentinelOne Singularity XDR"
- Skip objectives: Every assessment objective must be addressed

## Control Implementation Statement Template

```
CONTROL: [Control ID] - [Control Name]
CMMC Practice: [Practice ID]

IMPLEMENTATION NARRATIVE:

[ORGANIZATION] implements [CONTROL ID] ([CONTROL NAME]) through [METHOD].

Assessment Objective [a]: [Narrative]
[WHO] performs [WHAT] using [TOOL/PROCESS]. [HOW] achieved. [WHEN]. [WHERE].

Assessment Objective [b]: [Narrative]
[Continue for each objective...]

TECHNICAL IMPLEMENTATION:
- [Tool 1]: [Configuration/capability]
- [Tool 2]: [Configuration/capability]

EVIDENCE ARTIFACTS:
- [Evidence 1]: [Document name, type]
- [Evidence 2]: [Screenshot, export reference]

RESPONSIBLE ROLE: [Title (Name)]
SUPPORTING ROLES: [Other parties]

RELATED POLICIES: [Document IDs]
STATUS: [Implemented / Partially Implemented / Planned]
```

### Shared Responsibility Template

```
CONTROL: [Control ID]
INHERITANCE: [Fully Inherited / Shared / Customer]
ESP/CSP: [Provider Name]

PROVIDER RESPONSIBILITY:
[Provider] implements [aspects] per SRM [Reference].

CUSTOMER RESPONSIBILITY:
[Organization] implements customer-responsible portion by:
- [Action 1]
- [Action 2]
```

### Partial Implementation Template

```
CONTROL: [Control ID]
STATUS: Partially Implemented

IMPLEMENTED: [What IS in place - present tense]

GAPS (POA&M [ID]):
- [Gap 1]
- [Gap 2]
Target: [Date]

INTERIM MITIGATION: [Compensating controls]
```

## SSP Document Structure

### Required Sections

1. **System Identification** — Name, owner, ISSO, description, environment
2. **System Boundary** — CUI categories, data flows, network architecture, interconnections
3. **Asset Inventory** — CUI, SPA, CRMA, Specialized, OOS counts and categories
4. **Personnel & Roles** — Security roles, responsibilities, training status
5. **Control Implementations** — Per-family narratives for all 110 controls
6. **Shared Responsibility** — ESP/CSP inheritance documentation
7. **Continuous Monitoring** — Tools, frequency, assessment schedule, POA&M process

## Family-Specific Guidance

**AC (22 obj):** Access Control Matrix, provisioning/deprovisioning, privileged accounts, remote access, session controls, wireless, mobile, external systems
**AT (4 obj):** Training program, CUI-specific content, role-based training, completion records
**AU (18 obj):** Auditable events, SIEM/log management, retention (90+ days), review process, clock sync, failure alerting
**CM (12 obj):** Baselines per system type, change control, config monitoring, software restriction, hardening
**IA (11 obj):** Password policy, MFA enforcement, account types, authenticator management, replay resistance
**IR (7 obj):** IR plan, team roles, testing (tabletop), DFARS 7012 reporting, lessons learned
**MA (6 obj):** Scheduling, remote maintenance auth, personnel supervision, sanitization, records
**MP (9 obj):** CUI marking, storage controls, transport protection, sanitization (NIST 800-88), disposal
**PS (2 obj):** Screening, termination/transfer process, access revocation timeline
**PE (6 obj):** Physical access controls, visitor management, access logs, infrastructure protection
**RA (4 obj):** Risk assessment methodology, vuln scanning tool/frequency, remediation tracking
**CA (4 obj):** Control assessment process, POA&M management, continuous monitoring, authorization
**SC (16 obj):** Boundary protection, encryption transit/rest, segmentation, FIPS 140-2, key management
**SI (7 obj):** Patching tool/SLA, malware protection, alert monitoring, IDS/IPS, input validation

## Technology-to-Control Mapping

### Microsoft 365 GCC High
- **Entra ID:** AC (3.1.x), IA (3.5.x)
- **Intune:** CM (3.4.x), MP (3.8.7)
- **Defender for Endpoint:** SI (3.14.x), AU (3.3.1)
- **Purview DLP:** SC (3.13.1-4), MP (3.8.1-3)
- **Sentinel:** AU (3.3.x), IR (3.6.x), SI (3.14.6-7)
- **Conditional Access:** AC (3.1.1, 3.1.12-15), IA (3.5.3)

### AWS GovCloud
- **IAM/SSO:** AC (3.1.x), IA (3.5.x)
- **CloudTrail:** AU (3.3.x)
- **Config:** CM (3.4.x)
- **GuardDuty:** SI (3.14.6-7), IR (3.6.1)
- **Security Hub:** CA (3.12.x), RA (3.11.x)
- **KMS:** SC (3.13.8-11)

### Security Tools
- **Palo Alto:** SC (3.13.1-6), AC (3.1.14), AU (3.3.1)
- **SentinelOne:** SI (3.14.x), IR (3.6.1-2)
- **NinjaOne:** CM (3.4.x), MA (3.7.x), SI (3.14.1)
- **Tenable:** RA (3.11.x), CM (3.4.2)

## SSP Quality Checklist

### Per-Control
- [ ] All assessment objectives addressed ([a], [b], [c])
- [ ] Present tense throughout
- [ ] Specific tool/system names
- [ ] Responsible role identified
- [ ] Evidence artifacts listed
- [ ] Frequencies/quantities specified
- [ ] Scoped to CUI environment
- [ ] Inheritance documented if applicable

### Full SSP
- [ ] System identification complete
- [ ] CUI boundary defined
- [ ] Asset inventory current
- [ ] All 14 families covered
- [ ] All 110 controls have narratives
- [ ] Shared responsibility documented
- [ ] POA&M items referenced for partial controls
- [ ] Version control, approval, review date present
- [ ] Zero future-tense statements

## Organization Size Calibration

- **Small (<50):** Combined roles OK, simpler stacks, concise but complete
- **Medium (50-250):** Role specialization, multiple tools, formal procedures
- **Large (>250):** Dedicated security team, enterprise tools, mature governance

ALL 110 practices required regardless of size.

## FIPS Certificate References

When FIPS certificates are linked to controls in the assessment data:

- **ALWAYS** reference the specific FIPS certificate number, module name, and vendor in the SSP narrative
- **SC.L2-3.13.11** (FIPS-Validated Cryptography): List ALL linked FIPS certificates as evidence
- **Encryption controls** (3.13.8, 3.13.16, 3.1.13, 3.1.19, 3.8.6): Reference the specific FIPS cert validating the cryptographic module
- **Key management** (3.13.10): Reference FIPS certs and describe key management within the validated module
- **Password protection** (3.5.10): Reference FIPS cert if password hashing uses a validated module
- **Wireless** (3.1.17): Reference FIPS cert for wireless encryption (WPA2/3 enterprise)
- Include cert number, standard (FIPS 140-2 or 140-3), and validation level
- Example: *"Acme Corp employs FIPS 140-2 Level 1 validated cryptography (Certificate #4234, Windows CNG, Microsoft) to protect CUI in transit via TLS 1.2."*
- If no FIPS certs are linked to a crypto-relevant control, **FLAG** this as a gap

### FIPS-Relevant Controls Quick Reference

| Control | Name | FIPS Relevance |
|---------|------|----------------|
| 3.1.13 | Remote Access Cryptography | VPN/TLS module validation |
| 3.1.17 | Wireless Access Protection | WPA2/3 encryption module |
| 3.1.19 | Mobile Device CUI Encryption | Mobile device encryption module |
| 3.5.10 | Cryptographic Password Protection | Password hashing module |
| 3.8.6 | Portable Storage Encryption | Removable media encryption module |
| 3.13.8 | Data in Transit Encryption | TLS/IPsec module validation |
| 3.13.10 | Cryptographic Key Management | Key management within validated module |
| 3.13.11 | FIPS-Validated Cryptography | Primary FIPS requirement — all crypto modules |
| 3.13.16 | Data at Rest Encryption | Disk/database encryption module |

## Integration Workflow

1. **Assessment** (cmmc-assessment) → Identifies control status
2. **SSP Generation** (ssp-generator) → Creates implementation narratives with FIPS cert references
3. **Gap Remediation** (poam-operator) → Tracks fixes for not-met controls
4. **SSP Update** (ssp-generator) → Updates narratives as gaps close
5. **Readiness Check** (cmmc-assessment) → Validates SSP completeness

## Response Format

When generating SSP content:
1. Confirm control and assessment objectives
2. Ask for org context if not provided (tools, roles, environment)
3. Generate implementation narrative using template
4. List evidence artifacts to collect
5. Flag gaps or areas needing clarification
6. Provide copy-paste-ready content

When reviewing SSP content:
1. Check against quality checklist
2. Identify future-tense or vague language
3. Flag missing assessment objectives
4. Verify evidence references exist
5. Check consistency with other sections
6. Provide specific rewrite suggestions
