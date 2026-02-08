# Access Review Implementation Guide for CMMC Level 2

**Practical implementation guidance for deploying the Enterprise Access Review Automation Playbook and Remediation Addendum in a CMMC-compliant environment**

---

## Document Relationships

This guide bridges two companion documents into actionable implementation steps:

| Document | Focus | Key Deliverable |
|---|---|---|
| [Enterprise Access Review Automation Playbook](./Enterprise_Access_Review_Automation_Playbook.md) | Discovery, extraction, review workflow | Automated access data collection across 5 platforms |
| [Access Review Remediation Addendum](./Access_Review_Remediation_Addendum.md) | Post-review enforcement, rollback, evidence | Automated remediation engine with audit trail |

Together, they implement the **full access lifecycle**: Discovery → Extraction → Review → Enforcement → Verification → Evidence.

---

## 1. CMMC Control Mapping — What These Documents Satisfy

The access review program directly satisfies or provides evidence for the following CMMC Level 2 / NIST 800-171 controls:

### Primary Controls (Directly Satisfied)

| Control ID | Control Name | How Access Reviews Satisfy It |
|---|---|---|
| **AC.L2-3.1.1** | Authorized Access Control | User account recertification ensures only authorized users retain access. Stale account detection removes unauthorized access. |
| **AC.L2-3.1.2** | Transaction & Function Control | Application role assignment reviews verify users only have access to functions required for their duties. |
| **AC.L2-3.1.4** | Separation of Duties | Cross-platform role analysis identifies users with conflicting privileges (e.g., both approver and requestor roles). |
| **AC.L2-3.1.5** | Least Privilege | Privileged access reviews (monthly for admins) enforce least privilege by removing unnecessary elevated access. |
| **AC.L2-3.1.6** | Non-Privileged Account Use | Directory role audits identify permanent admin assignments that should be PIM-eligible. |
| **AC.L2-3.1.7** | Privileged Functions | PIM and RBAC reviews ensure privileged functions are restricted to authorized personnel. |
| **AC.L2-3.1.22** | Publicly Accessible Content | S3 bucket and SharePoint external sharing reviews prevent unauthorized public exposure of CUI. |

### Supporting Controls (Evidence Contribution)

| Control ID | Control Name | Evidence Produced |
|---|---|---|
| **IA.L2-3.5.1** | Identification | Service account and API key reviews verify all identities are authorized and tracked. |
| **IA.L2-3.5.2** | Authentication | MFA enrollment audits (part of user review) confirm authentication requirements are met. |
| **IA.L2-3.5.7** | Password Complexity | Password age and `PasswordNeverExpires` flags are captured in AD user reviews. |
| **AU.L2-3.3.1** | System Auditing | The remediation execution log and decision log serve as audit records for access changes. |
| **AU.L2-3.3.2** | Audit Record Content | Decision records include who, what, when, where, and outcome — all required audit fields. |
| **PS.L2-3.9.2** | Personnel Actions | Offboarding reviews (triggered by HR separation) use the same remediation engine to revoke all access. |
| **PE.L2-3.10.6** | Alternative Work Sites | Guest and external access reviews cover remote/alternative site access patterns. |

---

## 2. Prerequisites Checklist

Before deploying the access review automation, ensure the following are in place:

### Licensing & Access

- [ ] **Entra ID P2 or Entra ID Governance** — Required for built-in Access Reviews
- [ ] **Microsoft Graph API permissions** — `User.ReadWrite.All`, `Group.ReadWrite.All`, `RoleManagement.ReadWrite.Directory`, `Application.ReadWrite.All`
- [ ] **PnP.PowerShell module** — For SharePoint Online permission audits
- [ ] **ExchangeOnlineManagement module** — For mailbox delegation audits
- [ ] **Az PowerShell modules** — `Az.Accounts`, `Az.Resources` for Azure RBAC
- [ ] **AWS CLI + Boto3** — With IAM permissions for `iam:*` read and write operations
- [ ] **GCP gcloud CLI + Python client libraries** — `google-cloud-asset`, `google-cloud-iam`, `google-cloud-resource-manager`
- [ ] **Active Directory PowerShell module** — On a domain-joined machine or via RSAT

### Infrastructure

- [ ] **Automation server** — Azure Automation, hardened jump box, or CI/CD pipeline for script execution
- [ ] **Secret management** — Azure Key Vault, AWS Secrets Manager, or GCP Secret Manager for credentials
- [ ] **Review platform** — SharePoint list, ServiceNow, or IGA tool for reviewer workflow
- [ ] **Email/notification system** — SMTP relay, Microsoft Graph mail, or Teams webhook for reviewer notifications
- [ ] **Evidence storage** — Immutable storage (Azure Blob with immutability policy, S3 Object Lock, or equivalent) for audit evidence retention

### Network & Security

- [ ] **Hybrid Runbook Worker** (if using Azure Automation) — For on-premises AD access
- [ ] **Entra ID Connect health** — Verify sync is healthy before relying on `onPremisesSyncEnabled` attribute
- [ ] **Quarantine OU** — Create `OU=AccessReview-Disabled` in AD for disabled account staging
- [ ] **Service accounts** — gMSA for AD scheduled tasks, Managed Identity for Azure Automation

---

## 3. Phased Implementation Plan

### Phase 1: Foundation (Weeks 1–4)

**Goal:** Establish core review infrastructure and deploy the highest-priority automation (AD + Entra ID).

#### Week 1: Infrastructure Setup

```
1. Create Azure Automation Account (or configure dedicated server)
2. Configure Managed Identity with required Graph API permissions
3. Set up Azure Key Vault for certificate-based authentication
4. Create the quarantine OU in Active Directory
5. Create the review platform (SharePoint list or ITSM integration)
6. Create evidence storage container with immutability policy
```

**Validation checkpoint:** Can the automation account authenticate to Microsoft Graph and on-premises AD?

#### Week 2: AD Automation Deployment

Deploy the scripts from **Playbook Section 3**:

```
1. Deploy AD Stale Account & Privilege Audit script (Section 3.2)
2. Deploy AD Group Membership Audit script (Section 3.3)
3. Schedule both via Task Scheduler for monthly execution
4. Configure email notification to reviewers (Section 3.4)
5. Test with a dry run against a non-production OU
```

**CMMC controls addressed:** AC.L2-3.1.1, AC.L2-3.1.5

#### Week 3: Entra ID Access Reviews + Gap Scripts

```
1. Enable Entra ID Access Reviews for:
   - All security groups (quarterly, manager review)
   - All directory roles (monthly, CISO review)
   - All enterprise app assignments (semi-annual, app owner review)
   - PIM-eligible roles (monthly, self-review + manager)
2. Deploy SharePoint permission audit script (Section 4.2.1)
3. Deploy Teams guest audit script (Section 4.2.2)
4. Deploy Exchange delegation audit script (Section 4.2.3)
5. Deploy directory role audit including permanent assignments (Section 4.3.1)
6. Deploy Conditional Access policy audit (Section 4.3.2)
```

**CMMC controls addressed:** AC.L2-3.1.1, AC.L2-3.1.5, AC.L2-3.1.6, AC.L2-3.1.7

#### Week 4: Decision Enforcement Foundation

Deploy the remediation engine from **Addendum Sections 3–4**:

```
1. Deploy the core Remediation Engine (Addendum Section 3.1)
2. Deploy AD remediation handler with rollback (Addendum Section 4.1)
3. Deploy Entra ID remediation handler (Addendum Section 4.2.1)
4. Deploy hybrid routing logic (Addendum Section 8.1)
5. Configure grace period (7 days) and notification templates
6. Run a full dry-run cycle: extract → review → stage → verify
```

**CMMC controls addressed:** AC.L2-3.1.1 (enforcement), PS.L2-3.9.2 (personnel actions)

---

### Phase 2: Cloud Expansion (Weeks 5–8)

**Goal:** Extend coverage to AWS, GCP, Azure resources, and M365 gaps.

#### Week 5–6: AWS + Azure

```
1. Deploy AWS IAM user and policy audit (Playbook Section 6.2)
2. Deploy AWS IAM role and trust policy review (Playbook Section 6.3)
3. Deploy AWS S3 bucket access review (Playbook Section 6.4)
4. Deploy Azure RBAC comprehensive audit (Playbook Section 5.2)
5. Deploy Azure Key Vault access policy review (Playbook Section 5.3)
6. Schedule AWS scripts via Lambda + EventBridge (monthly)
7. Deploy AWS remediation handler (Addendum Section 4.4)
8. Deploy Azure RBAC remediation handler (Addendum Section 4.3)
```

#### Week 7–8: GCP + M365 Gaps

```
1. Deploy GCP IAM binding audit (Playbook Section 7.2)
2. Deploy GCP service account key review (Playbook Section 7.3)
3. Deploy Google Workspace directory review (Playbook Section 7.4)
4. Deploy GCP remediation handler (Addendum Section 4.5)
5. Deploy SharePoint permission revocation (Addendum Section 4.2.2)
6. Deploy Teams guest removal handler (Addendum Section 4.2.3)
7. Deploy Exchange delegation removal handler (Addendum Section 4.2.4)
8. Implement reviewer notification workflows across all platforms
```

---

### Phase 3: Enforcement & Maturity (Weeks 9–12)

**Goal:** Full automated lifecycle with evidence generation and KPI tracking.

#### Week 9–10: End-to-End Orchestration

```
1. Deploy the Master Orchestration Script (Addendum Section 9.2)
2. Configure the 5-phase pipeline: Discovery → Notify → Enforce → Verify → Evidence
3. Implement the grace period workflow (Addendum Section 5.1)
4. Implement the exception workflow (Addendum Section 5.2)
5. Configure non-response escalation policies (Addendum Section 5.3)
6. Deploy post-remediation verification for all platforms (Addendum Section 6)
```

#### Week 11: Evidence & Compliance

```
1. Deploy audit evidence package generation (Addendum Section 7)
2. Configure evidence retention per CMMC requirements (3-year minimum, 5-year recommended)
3. Build compliance dashboard showing:
   - Review completion rate per cycle
   - Mean time to remediation
   - Number of excessive privileges found and removed
   - Stale account removal rate
   - Exception rate and justification quality
4. Map evidence artifacts to specific CMMC assessment objectives
```

#### Week 12: Validation & Go-Live

```
1. Conduct tabletop exercise with security team
2. Run a full live review cycle (all 5 platforms)
3. Validate evidence package meets C3PAO expectations
4. Document lessons learned and adjust frequencies/thresholds
5. Establish ongoing KPIs and reporting cadence
```

---

## 4. Evidence Artifacts for C3PAO Assessment

When a C3PAO assessor evaluates your access review program, they will look for the following evidence. The playbook and addendum automation produces all of these:

| Evidence Artifact | Source | CMMC Objective |
|---|---|---|
| Access review policy document | Manual (you write this) | AC.L2-3.1.1[a] |
| Recurring review schedule | Orchestration script config | AC.L2-3.1.1[b] |
| User account review reports (per platform) | Playbook extraction scripts | AC.L2-3.1.1[c], AC.L2-3.1.1[d] |
| Privileged account review reports | AD privilege audit + Entra role audit | AC.L2-3.1.5[a], AC.L2-3.1.6[a] |
| Reviewer assignment records | Review platform (SharePoint/ITSM) | AC.L2-3.1.1[e] |
| Decision logs (approve/revoke/exception) | Remediation engine decision CSV | AC.L2-3.1.1[f] |
| Remediation execution logs | Remediation engine audit log | AC.L2-3.1.1[g] |
| Post-remediation verification results | Verification handlers output | AC.L2-3.1.1[h] |
| Exception register with justifications | Exception workflow output | AC.L2-3.1.5[b] |
| Stale account removal evidence | AD/Entra/AWS/GCP stale detection | AC.L2-3.1.1[d] |
| Guest/external access review evidence | Teams guest + SPO external audit | AC.L2-3.1.22[a] |
| Service account review evidence | AWS IAM + GCP SA key audit | IA.L2-3.5.1[a] |
| Evidence retention proof | Immutable storage configuration | AU.L2-3.3.1 |

---

## 5. Integration with This Assessment Tool

The access review automation integrates with several features of this CMMC assessment tool:

### MSP Portal — Technical Scripts

The access review scripts are available in the **Technical Scripts** section of the MSP Portal under the **Identity & Access** tab. These scripts can be copied directly and customized for your environment.

### Evidence Collection

The evidence artifacts produced by the access review automation map directly to the evidence items tracked in the **Evidence Collection Lists** view of the MSP Portal. When running the evidence collection scripts (`msp-technical-scripts-evidence.js`), access review outputs are included in the master evidence package.

### AI Assessor Context

When assessing AC-family controls (3.1.1 through 3.1.22), the AI Assessor can reference the access review program as implementation evidence. Mention your review frequency, platforms covered, and remediation automation when providing implementation details.

### POA&M Integration

If your access review program is not yet fully deployed, create POA&M entries for each phase of the implementation roadmap. The phased approach in Section 3 above maps cleanly to POA&M milestones:

| POA&M Milestone | Target Date | Controls |
|---|---|---|
| Phase 1: AD + Entra ID reviews operational | Week 4 | AC.L2-3.1.1, AC.L2-3.1.5 |
| Phase 2: AWS + GCP + Azure reviews operational | Week 8 | AC.L2-3.1.1, IA.L2-3.5.1 |
| Phase 3: Full automated lifecycle with evidence | Week 12 | All AC controls, AU.L2-3.3.1 |

### OSC Inventory

Document the following in your OSC Inventory:

- **Policy:** Access Review and Recertification Policy
- **Procedure:** Access Review Execution Procedure (this playbook)
- **Procedure:** Access Revocation and Remediation Procedure (this addendum)
- **Assets:** Automation server, review platform, evidence storage

---

## 6. Common Pitfalls and Mitigations

| Pitfall | Impact | Mitigation |
|---|---|---|
| Modifying synced objects in Entra ID directly | Changes overwritten on next sync cycle; silent failure | Use hybrid routing logic (Addendum Section 8) — always check `onPremisesSyncEnabled` |
| No grace period before enforcement | Business disruption, emergency rollbacks | Configure 7-day grace period with user notification (Addendum Section 5.1) |
| Hardcoded credentials in scripts | Security vulnerability, compliance failure | Use Managed Identities, gMSA, certificate auth, and secret managers exclusively |
| No verification after remediation | False confidence; access not actually removed | Deploy verification handlers that run at T+15m and T+24h (Addendum Section 6) |
| Reviewer fatigue from too many items | Low completion rates, rubber-stamping | Risk-score items, prioritize privileged access, use multi-stage reviews |
| No exception workflow | Legitimate access removed, business impact | Implement exception workflow with documented justification and expiration (Addendum Section 5.2) |
| Evidence not retained long enough | Compliance failure at audit | Configure immutable storage with 5-year retention (Addendum Section 7.2) |
| GCP SA key deletion without snapshot | Irreversible action, no rollback possible | Warn in UI, require secondary approval, document in rollback register |

---

## 7. Maintenance and Continuous Improvement

### Monthly

- Review KPI dashboard (completion rate, remediation time, exception rate)
- Validate privileged access review completion
- Rotate automation service account credentials

### Quarterly

- Review and update review frequencies based on risk changes
- Audit the automation scripts themselves for drift
- Review exception register — are exceptions being re-reviewed on schedule?
- Update reviewer assignments for organizational changes

### Annually

- Full program review with CISO and compliance team
- Update compliance framework mapping for any control changes
- Benchmark against industry peers (if data available)
- Plan for next year's assessment cycle evidence requirements

---

## Quick Reference: Script Locations

| Script | Playbook Section | Platform | Language |
|---|---|---|---|
| AD Stale Account Audit | 3.2 | On-Prem AD | PowerShell |
| AD Group Membership Audit | 3.3 | On-Prem AD | PowerShell |
| AD Decision Enforcement | 3.5 | On-Prem AD | PowerShell |
| SPO Permission Audit | 4.2.1 | M365 | PowerShell |
| Teams Guest Audit | 4.2.2 | M365 | PowerShell |
| Exchange Delegation Audit | 4.2.3 | M365 | PowerShell |
| Entra ID Role Audit | 4.3.1 | Entra ID | PowerShell |
| Conditional Access Audit | 4.3.2 | Entra ID | PowerShell |
| Azure RBAC Audit | 5.2 | Azure | PowerShell |
| Key Vault Access Audit | 5.3 | Azure | PowerShell |
| AWS IAM User Audit | 6.2 | AWS | Python |
| AWS IAM Role Audit | 6.3 | AWS | Python |
| AWS S3 Bucket Audit | 6.4 | AWS | Python |
| GCP IAM Binding Audit | 7.2 | GCP | Python |
| GCP SA Key Audit | 7.3 | GCP | Python |
| Google Workspace Audit | 7.4 | GCP | Python |
| Remediation Engine | Addendum 3.1 | All | Python |
| AD Remediation Handler | Addendum 4.1 | On-Prem AD | PowerShell |
| Entra ID Remediation | Addendum 4.2.1 | Entra ID | PowerShell |
| SPO Remediation | Addendum 4.2.2 | M365 | PowerShell |
| Teams Guest Remediation | Addendum 4.2.3 | M365 | PowerShell |
| Exchange Remediation | Addendum 4.2.4 | M365 | PowerShell |
| Azure RBAC Remediation | Addendum 4.3.1 | Azure | PowerShell |
| Key Vault Remediation | Addendum 4.3.2 | Azure | PowerShell |
| AWS IAM Remediation | Addendum 4.4.1 | AWS | Python |
| GCP IAM Remediation | Addendum 4.5.1 | GCP | Python |
| Hybrid Routing Logic | Addendum 8.1 | Hybrid | PowerShell |
| Master Orchestrator | Addendum 9.2 | All | PowerShell |

---

*This implementation guide should be reviewed and updated as your access review program matures and as CMMC assessment requirements evolve.*
