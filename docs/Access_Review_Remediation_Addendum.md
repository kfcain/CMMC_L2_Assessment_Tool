# Enterprise Access Review Automation Playbook — ADDENDUM

**Post-Review Remediation Automation: Closing the Access Lifecycle Loop Across Hybrid Cloud Environments**

**Scope:** Automated decision enforcement, revocation orchestration, rollback safeguards, audit evidence generation, and exception handling across all platforms

---

## Table of Contents

1. [Purpose and Context](#1-purpose-and-context)
2. [Standardized Decision Schema](#2-standardized-decision-schema)
3. [Remediation Engine Architecture](#3-remediation-engine-architecture)
4. [Platform-Specific Remediation Handlers](#4-platform-specific-remediation-handlers)
5. [Grace Period, Notification, and Exception Handling](#5-grace-period-notification-and-exception-handling)
6. [Post-Remediation Verification](#6-post-remediation-verification)
7. [Audit Evidence Generation](#7-audit-evidence-generation)
8. [Hybrid Entra ID Sync: Remediation Routing](#8-hybrid-entra-id-sync-remediation-routing)
9. [End-to-End Orchestration Example](#9-end-to-end-orchestration-example)
10. [Remediation Capability Matrix](#10-remediation-capability-matrix)

---

## 1. Purpose and Context

The companion playbook established the methodology for discovering, extracting, and reviewing access across on-premises Active Directory, Microsoft Entra ID and M365, Azure, AWS, and GCP. It detailed how to identify stale accounts, over-privileged users, orphaned service principals, and unreviewed group memberships, and how to route review decisions to designated reviewers.

This addendum completes the access lifecycle by addressing the critical question: **what happens after the reviewer clicks "Revoke"?** Without automated, auditable enforcement of review decisions, the entire review program produces paper artifacts but no security improvement. This document provides the full technical implementation for automated remediation across every platform, including safeguards to prevent disruption, rollback capabilities, exception workflows, and the generation of compliance-grade audit evidence.

**The Full Access Lifecycle:**
Discovery → Extraction → Normalization → Review Assignment → Decision Capture → **Approval Gate → Staged Remediation → Verification → Audit Evidence → Rollback (if needed)**. This addendum covers everything from Approval Gate onward.

---

## 2. Standardized Decision Schema

Before enforcement can be automated, all platforms must use a common decision schema. Every review decision, regardless of its source platform, is normalized into the following structure.

### 2.1 Decision Record Fields

| Field | Type | Description |
|---|---|---|
| `decision_id` | UUID | Unique identifier for the decision record |
| `review_cycle_id` | String | Identifier for the review cycle (e.g., Q1-2026-QUARTERLY) |
| `platform` | Enum | AD, ENTRA_ID, M365, AZURE, AWS, GCP |
| `principal_id` | String | User/group/service principal/role identifier on the source platform |
| `principal_name` | String | Human-readable display name of the principal |
| `principal_type` | Enum | USER, GROUP, SERVICE_PRINCIPAL, SERVICE_ACCOUNT, IAM_ROLE, IAM_USER |
| `resource_target` | String | The resource, group, role, or scope the access applies to |
| `access_type` | Enum | GROUP_MEMBERSHIP, ROLE_ASSIGNMENT, DIRECT_PERMISSION, POLICY_ATTACHMENT, KEY_ACCESS, DELEGATION |
| `decision` | Enum | APPROVE, REVOKE, MODIFY, EXCEPTION, ESCALATE |
| `reviewer_id` | String | Identity of the person who made the decision |
| `decision_date` | ISO 8601 | Timestamp when the reviewer submitted their decision |
| `justification` | Text | Free-text reason (required for EXCEPTION and MODIFY decisions) |
| `remediation_action` | Enum | DISABLE_ACCOUNT, REMOVE_FROM_GROUP, REVOKE_ROLE, DELETE_KEY, REMOVE_POLICY, REMOVE_DELEGATION, RESTRICT_SCOPE, NONE |
| `enforcement_status` | Enum | PENDING, STAGED, EXECUTED, VERIFIED, ROLLED_BACK, FAILED, EXCEPTION_GRANTED |
| `enforcement_date` | ISO 8601 | Timestamp when remediation was executed (null until executed) |
| `rollback_eligible` | Boolean | Whether this action can be reversed within the rollback window |

### 2.2 Decision Lifecycle State Machine

```
PENDING ─────────────────────────────────────────────────────────
  │ Reviewer submits decision = REVOKE
  ▼
STAGED ──────────────────────────────────────────────────────────
  │ Grace period expires (7 days default) OR
  │ Admin override for immediate execution
  ▼
EXECUTED ────────────────────────────────────────────────────────
  │ Automated verification confirms access was removed
  ▼
VERIFIED ───── (Terminal success state)

Alternate paths:
  STAGED ───> EXCEPTION_GRANTED  (business justification accepted)
  EXECUTED ─> ROLLED_BACK         (within 30-day rollback window)
  EXECUTED ─> FAILED              (remediation API call failed)
  FAILED ───> PENDING             (retry after error resolution)
```

---

## 3. Remediation Engine Architecture

The remediation engine is the central orchestrator that reads decision records, determines the correct enforcement action for each platform, executes the action, verifies the result, and logs the outcome. It is designed to be **idempotent** (safe to re-run), to support a grace period before enforcement, and to capture a rollback snapshot before making any changes.

### 3.1 Core Engine Logic (Platform-Agnostic)

```python
#!/usr/bin/env python3
"""
Remediation Engine - Core Orchestrator
Processes review decisions and dispatches enforcement actions
"""
import json, csv, logging, uuid
from datetime import datetime, timezone, timedelta
from dataclasses import dataclass, asdict
from enum import Enum
from typing import Optional, List, Dict, Callable

# ── Configuration ──
GRACE_PERIOD_DAYS = 7        # Days between STAGED and EXECUTED
ROLLBACK_WINDOW_DAYS = 30    # Days after execution during which rollback is possible
DRY_RUN = False              # Set True to simulate without making changes
NOTIFY_ON_STAGE = True       # Email affected user when access is staged for removal
REQUIRE_APPROVAL_FOR_ADMIN = True  # Privileged revocations need secondary approval

class Status(Enum):
    PENDING = 'PENDING'
    STAGED = 'STAGED'
    EXECUTED = 'EXECUTED'
    VERIFIED = 'VERIFIED'
    ROLLED_BACK = 'ROLLED_BACK'
    FAILED = 'FAILED'
    EXCEPTION_GRANTED = 'EXCEPTION_GRANTED'

@dataclass
class RemediationResult:
    success: bool
    action_taken: str
    details: str
    rollback_data: Optional[Dict] = None
    error: Optional[str] = None

class RemediationEngine:
    def __init__(self, handlers: Dict[str, Callable], config: dict = None):
        self.handlers = handlers  # platform -> handler function
        self.config = config or {}
        self.audit_log = []
        self.logger = logging.getLogger('RemediationEngine')

    def process_decisions(self, decisions: List[dict]):
        """Main entry point: process a batch of review decisions."""
        now = datetime.now(timezone.utc)
        for d in decisions:
            if d['decision'] != 'REVOKE':
                continue
            status = d.get('enforcement_status', 'PENDING')

            if status == 'PENDING':
                self._stage_decision(d, now)
            elif status == 'STAGED':
                staged_date = datetime.fromisoformat(d['staged_date'])
                grace = timedelta(days=self.config.get(
                    'grace_period_days', GRACE_PERIOD_DAYS))
                if now >= staged_date + grace:
                    self._execute_decision(d, now)
                else:
                    remaining = (staged_date + grace - now).days
                    self.logger.info(
                        f"{d['principal_name']}: {remaining}d grace remaining")
            elif status == 'EXECUTED':
                self._verify_decision(d, now)

    def _stage_decision(self, d, now):
        """Move to STAGED: notify affected user, start grace period."""
        d['enforcement_status'] = 'STAGED'
        d['staged_date'] = now.isoformat()
        self._log(d, 'STAGED',
            f"Access revocation staged. Grace period: "
            f"{GRACE_PERIOD_DAYS} days. Enforcement after "
            f"{(now + timedelta(days=GRACE_PERIOD_DAYS)).strftime('%Y-%m-%d')}")
        if NOTIFY_ON_STAGE:
            self._notify_user(d, 'staged')

    def _execute_decision(self, d, now):
        """Execute the actual remediation via platform handler."""
        platform = d['platform']
        handler = self.handlers.get(platform)
        if not handler:
            self._log(d, 'FAILED', f'No handler for platform: {platform}')
            d['enforcement_status'] = 'FAILED'
            return
        if DRY_RUN:
            self._log(d, 'DRY_RUN', f'Would execute: {d["remediation_action"]}')
            return
        try:
            result = handler(d)
            if result.success:
                d['enforcement_status'] = 'EXECUTED'
                d['enforcement_date'] = now.isoformat()
                d['rollback_data'] = json.dumps(result.rollback_data or {})
                d['rollback_eligible'] = True
                self._log(d, 'EXECUTED', result.details)
                self._notify_user(d, 'executed')
            else:
                d['enforcement_status'] = 'FAILED'
                self._log(d, 'FAILED', result.error)
        except Exception as e:
            d['enforcement_status'] = 'FAILED'
            self._log(d, 'FAILED', str(e))

    def _verify_decision(self, d, now):
        """Confirm the revocation actually took effect."""
        platform = d['platform']
        verifier = self.handlers.get(f'{platform}_verify')
        if verifier:
            is_removed = verifier(d)
            if is_removed:
                d['enforcement_status'] = 'VERIFIED'
                self._log(d, 'VERIFIED', 'Access confirmed removed')
            else:
                self._log(d, 'VERIFY_FAILED',
                    'Access still present after execution - retrying')
                d['enforcement_status'] = 'STAGED'

    def rollback(self, d):
        """Reverse a previously executed remediation."""
        if not d.get('rollback_eligible'):
            return RemediationResult(False, 'ROLLBACK', 'Not eligible')
        exec_date = datetime.fromisoformat(d['enforcement_date'])
        if datetime.now(timezone.utc) > exec_date + timedelta(
                days=ROLLBACK_WINDOW_DAYS):
            return RemediationResult(False, 'ROLLBACK', 'Window expired')
        handler = self.handlers.get(f"{d['platform']}_rollback")
        if handler:
            result = handler(d, json.loads(d.get('rollback_data', '{}')))
            if result.success:
                d['enforcement_status'] = 'ROLLED_BACK'
                self._log(d, 'ROLLED_BACK', result.details)
            return result

    def _notify_user(self, d, event_type):
        """Send notification to the affected user (stub - implement per org)."""
        self.logger.info(f"Notify {d['principal_name']}: {event_type}")

    def _log(self, d, status, message):
        entry = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'decision_id': d.get('decision_id'),
            'principal_name': d.get('principal_name'),
            'platform': d.get('platform'),
            'action': d.get('remediation_action'),
            'status': status,
            'message': message,
            'reviewer': d.get('reviewer_id'),
        }
        self.audit_log.append(entry)
        self.logger.info(json.dumps(entry))

    def export_audit_log(self, path):
        with open(path, 'w', newline='') as f:
            w = csv.DictWriter(f, fieldnames=self.audit_log[0].keys())
            w.writeheader()
            w.writerows(self.audit_log)
```

---

## 4. Platform-Specific Remediation Handlers

Each platform requires its own handler that translates a generic revocation decision into the platform-native API calls needed to actually remove access. Every handler follows the same contract: accept a decision record, capture a rollback snapshot, execute the change, and return a `RemediationResult`.

### 4.1 On-Premises Active Directory

AD remediation handles four primary action types: disabling user accounts, removing users from security groups, resetting passwords to force re-authentication, and moving accounts to a quarantine OU.

#### 4.1.1 AD Account Disable with Rollback Snapshot

```powershell
# ── AD Remediation Handler (PowerShell) ──
function Invoke-ADRemediation {
    param(
        [Parameter(Mandatory)] [PSCustomObject]$Decision,
        [switch]$DryRun
    )

    $sam = $Decision.principal_id
    $action = $Decision.remediation_action
    $result = @{ Success = $false; RollbackData = @{}; Details = '' }

    # ── Capture rollback snapshot BEFORE any changes ──
    $user = Get-ADUser -Identity $sam -Properties MemberOf, Enabled,
        DistinguishedName, Description, PasswordNeverExpires
    $snapshot = @{
        SamAccountName     = $sam
        WasEnabled         = $user.Enabled
        OriginalDN         = $user.DistinguishedName
        OriginalGroups     = @($user.MemberOf)
        OriginalDescription = $user.Description
        SnapshotTime       = (Get-Date -Format o)
    }

    if ($DryRun) {
        $result.Success = $true
        $result.Details = "[DRY RUN] Would execute: $action on $sam"
        $result.RollbackData = $snapshot
        return $result
    }

    switch ($action) {
        'DISABLE_ACCOUNT' {
            Disable-ADAccount -Identity $sam -Confirm:$false
            $ts = Get-Date -Format 'yyyy-MM-dd'
            $rev = $Decision.reviewer_id
            Set-ADUser -Identity $sam -Description (
                "ACCESS REVIEW DISABLED $ts by $rev | " +
                "Original: $($user.Description)")
            $quarantineOU = 'OU=AccessReview-Disabled,DC=corp,DC=local'
            Move-ADObject -Identity $user.DistinguishedName `
                -TargetPath $quarantineOU
            $result.Details = "Account disabled and moved to quarantine OU"
        }
        'REMOVE_FROM_GROUP' {
            $group = $Decision.resource_target
            Remove-ADGroupMember -Identity $group -Members $sam `
                -Confirm:$false
            $result.Details = "Removed $sam from group: $group"
        }
        'FORCE_PASSWORD_RESET' {
            Set-ADUser -Identity $sam -ChangePasswordAtLogon $true
            $newPwd = [System.Web.Security.Membership]::GeneratePassword(24, 6)
            Set-ADAccountPassword -Identity $sam `
                -Reset -NewPassword (ConvertTo-SecureString $newPwd -AsPlain -Force)
            $result.Details = "Password reset forced, Kerberos tickets invalidated"
        }
    }

    $result.Success = $true
    $result.RollbackData = $snapshot
    return $result
}
```

#### 4.1.2 AD Rollback Handler

```powershell
function Invoke-ADRollback {
    param(
        [Parameter(Mandatory)] [PSCustomObject]$Decision,
        [Parameter(Mandatory)] [hashtable]$Snapshot
    )

    $sam = $Snapshot.SamAccountName
    $action = $Decision.remediation_action

    switch ($action) {
        'DISABLE_ACCOUNT' {
            if ($Snapshot.WasEnabled) {
                Enable-ADAccount -Identity $sam
            }
            $user = Get-ADUser -Identity $sam
            Move-ADObject -Identity $user.DistinguishedName `
                -TargetPath ($Snapshot.OriginalDN | Split-Path -Parent)
            Set-ADUser -Identity $sam `
                -Description $Snapshot.OriginalDescription
            return @{ Success = $true;
                Details = "Account re-enabled and restored to original OU" }
        }
        'REMOVE_FROM_GROUP' {
            $group = $Decision.resource_target
            Add-ADGroupMember -Identity $group -Members $sam
            return @{ Success = $true;
                Details = "Re-added $sam to group: $group" }
        }
    }
}
```

#### 4.1.3 AD Verification Handler

```powershell
function Test-ADRemediationVerified {
    param([Parameter(Mandatory)] [PSCustomObject]$Decision)

    $sam = $Decision.principal_id
    switch ($Decision.remediation_action) {
        'DISABLE_ACCOUNT' {
            $user = Get-ADUser -Identity $sam -Properties Enabled
            return ($user.Enabled -eq $false)
        }
        'REMOVE_FROM_GROUP' {
            $group = $Decision.resource_target
            $members = Get-ADGroupMember -Identity $group |
                Select-Object -ExpandProperty SamAccountName
            return ($sam -notin $members)
        }
    }
    return $false
}
```

### 4.2 Microsoft Entra ID and M365

#### 4.2.1 Entra ID User and Group Remediation

```powershell
# ── Entra ID Remediation Handler ──
Import-Module Microsoft.Graph.Users
Import-Module Microsoft.Graph.Groups
Import-Module Microsoft.Graph.Identity.DirectoryManagement

Connect-MgGraph -Scopes 'User.ReadWrite.All','Group.ReadWrite.All',
    'RoleManagement.ReadWrite.Directory','Application.ReadWrite.All'

function Invoke-EntraRemediation {
    param([Parameter(Mandatory)] [PSCustomObject]$Decision)

    $principalId = $Decision.principal_id
    $action = $Decision.remediation_action
    $target = $Decision.resource_target

    # ── Snapshot before changes ──
    $user = Get-MgUser -UserId $principalId -Property `
        AccountEnabled, DisplayName, OnPremisesSyncEnabled
    $snapshot = @{
        UserId = $principalId
        WasEnabled = $user.AccountEnabled
        IsSynced = $user.OnPremisesSyncEnabled
        Timestamp = (Get-Date -Format o)
    }

    # ── Check for hybrid sync ──
    if ($user.OnPremisesSyncEnabled -and $action -eq 'DISABLE_ACCOUNT') {
        Write-Warning "$($user.DisplayName) is hybrid-synced."
        Write-Warning "Routing to on-prem AD handler instead."
        return @{
            Success = $false
            Details = 'REROUTE_TO_AD: Account is hybrid-synced'
            RollbackData = $snapshot
        }
    }

    switch ($action) {
        'DISABLE_ACCOUNT' {
            Update-MgUser -UserId $principalId -AccountEnabled:$false
            Invoke-MgGraphRequest -Method POST `
                -Uri "https://graph.microsoft.com/v1.0/users/$principalId/revokeSignInSessions"
            return @{
                Success = $true
                Details = 'Account disabled + sign-in sessions revoked'
                RollbackData = $snapshot
            }
        }
        'REMOVE_FROM_GROUP' {
            Remove-MgGroupMemberByRef -GroupId $target `
                -DirectoryObjectId $principalId
            return @{
                Success = $true
                Details = "Removed from Entra group: $target"
                RollbackData = $snapshot
            }
        }
        'REVOKE_ROLE' {
            $assignments = Get-MgRoleManagementDirectoryRoleAssignment `
                -Filter "principalId eq '$principalId'"
            $targetAssignment = $assignments | Where-Object `
                { $_.RoleDefinitionId -eq $target }
            if ($targetAssignment) {
                Remove-MgRoleManagementDirectoryRoleAssignment `
                    -UnifiedRoleAssignmentId $targetAssignment.Id
            }
            return @{
                Success = $true
                Details = "Directory role revoked: $target"
                RollbackData = @{
                    AssignmentId = $targetAssignment.Id
                    RoleDefinitionId = $target
                    PrincipalId = $principalId
                    DirectoryScopeId = $targetAssignment.DirectoryScopeId
                }
            }
        }
    }
}
```

#### 4.2.2 SharePoint Site Permission Revocation

```powershell
# ── SharePoint Permission Removal ──
Import-Module PnP.PowerShell

function Invoke-SPORemediation {
    param([PSCustomObject]$Decision)

    $siteUrl = $Decision.resource_target
    $loginName = $Decision.principal_id

    Connect-PnPOnline -Url $siteUrl -Interactive

    $web = Get-PnPWeb -Includes RoleAssignments
    $currentPerms = foreach ($ra in $web.RoleAssignments) {
        $member = Get-PnPProperty -ClientObject $ra -Property Member
        $roles = Get-PnPProperty -ClientObject $ra -Property RoleDefinitionBindings
        if ($member.LoginName -eq $loginName) {
            @{ Roles = ($roles | Select-Object -Exp Name) }
        }
    }

    Set-PnPWebPermission -User $loginName -RemoveRole 'Full Control',
        'Edit', 'Contribute', 'Read'

    return @{
        Success = $true
        Details = "Removed all SPO permissions for $loginName on $siteUrl"
        RollbackData = @{
            SiteUrl = $siteUrl; LoginName = $loginName
            OriginalRoles = $currentPerms.Roles
        }
    }
}
```

#### 4.2.3 Teams Guest Removal

```powershell
# ── Teams Guest Removal ──
function Invoke-TeamsGuestRemediation {
    param([PSCustomObject]$Decision)

    $guestId = $Decision.principal_id
    $teamId = $Decision.resource_target

    $memberships = Get-MgUserMemberOf -UserId $guestId |
        Where-Object { $_.AdditionalProperties['@odata.type'] -eq
            '#microsoft.graph.group' }

    Remove-MgGroupMemberByRef -GroupId $teamId -DirectoryObjectId $guestId

    $remainingTeams = $memberships | Where-Object { $_.Id -ne $teamId }
    $guestDeleted = $false
    if ($remainingTeams.Count -eq 0) {
        Remove-MgUser -UserId $guestId
        $guestDeleted = $true
    }

    return @{
        Success = $true
        Details = if ($guestDeleted) {
            'Guest removed from team AND deleted from tenant (no remaining memberships)'
        } else { 'Guest removed from team; still in other teams' }
        RollbackData = @{
            GuestId = $guestId; TeamId = $teamId
            WasDeletedFromTenant = $guestDeleted
            OriginalTeams = ($memberships | Select-Object -Exp Id)
        }
    }
}
```

#### 4.2.4 Exchange Delegation Removal

```powershell
# ── Exchange Mailbox Delegation Removal ──
Import-Module ExchangeOnlineManagement
Connect-ExchangeOnline

function Invoke-ExchangeRemediation {
    param([PSCustomObject]$Decision)

    $mailbox = $Decision.resource_target
    $delegate = $Decision.principal_id
    $permType = $Decision.access_type

    switch ($permType) {
        'FullAccess' {
            Remove-MailboxPermission -Identity $mailbox `
                -User $delegate -AccessRights FullAccess -Confirm:$false
        }
        'SendAs' {
            Remove-RecipientPermission -Identity $mailbox `
                -Trustee $delegate -AccessRights SendAs -Confirm:$false
        }
        'SendOnBehalf' {
            $mbx = Get-Mailbox -Identity $mailbox
            $updated = $mbx.GrantSendOnBehalfTo | Where-Object { $_ -ne $delegate }
            Set-Mailbox -Identity $mailbox -GrantSendOnBehalfTo $updated
        }
    }

    return @{
        Success = $true
        Details = "Removed $permType delegation: $delegate from $mailbox"
        RollbackData = @{
            Mailbox = $mailbox; Delegate = $delegate; PermType = $permType
        }
    }
}
```

### 4.3 Azure Resource RBAC

#### 4.3.1 Azure Role Assignment Revocation

```powershell
# ── Azure RBAC Remediation Handler ──
Import-Module Az.Accounts, Az.Resources
Connect-AzAccount

function Invoke-AzureRBACRemediation {
    param([PSCustomObject]$Decision)

    $principalId = $Decision.principal_id
    $scope = $Decision.resource_target
    $roleName = $Decision.access_type

    $assignment = Get-AzRoleAssignment -ObjectId $principalId `
        -Scope $scope -RoleDefinitionName $roleName

    if (-not $assignment) {
        return @{ Success = $false;
            Details = 'Role assignment not found (may be PIM-eligible)' }
    }

    $snapshot = @{
        RoleAssignmentId = $assignment.RoleAssignmentId
        Scope = $assignment.Scope
        RoleDefinitionName = $assignment.RoleDefinitionName
        RoleDefinitionId = $assignment.RoleDefinitionId
        ObjectId = $assignment.ObjectId
        ObjectType = $assignment.ObjectType
        DisplayName = $assignment.DisplayName
    }

    Remove-AzRoleAssignment -InputObject $assignment

    return @{
        Success = $true
        Details = "Removed $roleName from $($assignment.DisplayName) at scope $scope"
        RollbackData = $snapshot
    }
}
```

#### 4.3.2 Azure Key Vault Access Policy Revocation

```powershell
# ── Key Vault Access Policy Removal ──
function Invoke-KeyVaultRemediation {
    param([PSCustomObject]$Decision)

    $vaultName = $Decision.resource_target
    $objectId = $Decision.principal_id

    $vault = Get-AzKeyVault -VaultName $vaultName
    $policy = $vault.AccessPolicies | Where-Object { $_.ObjectId -eq $objectId }
    $snapshot = @{
        VaultName = $vaultName; ObjectId = $objectId
        KeyPerms = $policy.PermissionsToKeys
        SecretPerms = $policy.PermissionsToSecrets
        CertPerms = $policy.PermissionsToCertificates
    }

    Remove-AzKeyVaultAccessPolicy -VaultName $vaultName -ObjectId $objectId

    return @{
        Success = $true
        Details = "Removed all Key Vault access for $objectId on $vaultName"
        RollbackData = $snapshot
    }
}
```

### 4.4 Amazon Web Services

#### 4.4.1 AWS IAM User Remediation

```python
#!/usr/bin/env python3
"""AWS IAM Remediation Handler"""
import boto3, json
from datetime import datetime, timezone

iam = boto3.client('iam')

def handle_aws_remediation(decision: dict) -> dict:
    username = decision['principal_id']
    action = decision['remediation_action']
    target = decision.get('resource_target', '')

    snapshot = capture_aws_user_snapshot(username)

    if action == 'DISABLE_ACCOUNT':
        return disable_aws_user(username, snapshot)
    elif action == 'REMOVE_FROM_GROUP':
        return remove_from_aws_group(username, target, snapshot)
    elif action == 'REMOVE_POLICY':
        return detach_aws_policy(username, target, snapshot)
    elif action == 'DELETE_KEY':
        return deactivate_aws_keys(username, snapshot)
    else:
        return {'success': False, 'details': f'Unknown action: {action}'}

def capture_aws_user_snapshot(username):
    """Full state snapshot for rollback capability."""
    user = iam.get_user(UserName=username)['User']
    groups = [g['GroupName'] for g in
              iam.list_groups_for_user(UserName=username)['Groups']]
    policies = [p['PolicyArn'] for p in
                iam.list_attached_user_policies(UserName=username)
                ['AttachedPolicies']]
    inline = iam.list_user_policies(UserName=username)['PolicyNames']
    inline_docs = {}
    for pname in inline:
        doc = iam.get_user_policy(UserName=username,
            PolicyName=pname)['PolicyDocument']
        inline_docs[pname] = doc
    keys = iam.list_access_keys(UserName=username)['AccessKeyMetadata']
    try:
        login_profile = iam.get_login_profile(UserName=username)
        has_console = True
    except iam.exceptions.NoSuchEntityException:
        has_console = False
    mfa_devices = iam.list_mfa_devices(UserName=username)['MFADevices']

    return {
        'username': username,
        'groups': groups,
        'attached_policies': policies,
        'inline_policies': inline_docs,
        'access_keys': [{'id': k['AccessKeyId'], 'status': k['Status']}
                        for k in keys],
        'has_console_access': has_console,
        'mfa_devices': [d['SerialNumber'] for d in mfa_devices],
        'snapshot_time': datetime.now(timezone.utc).isoformat()
    }

def disable_aws_user(username, snapshot):
    """Full user lockout: deactivate keys, remove console, remove all policies."""
    actions_taken = []
    for key in snapshot['access_keys']:
        if key['status'] == 'Active':
            iam.update_access_key(UserName=username,
                AccessKeyId=key['id'], Status='Inactive')
            actions_taken.append(f"Deactivated key {key['id'][-4:]}")
    if snapshot['has_console_access']:
        iam.delete_login_profile(UserName=username)
        actions_taken.append('Console access removed')
    for policy_arn in snapshot['attached_policies']:
        iam.detach_user_policy(UserName=username, PolicyArn=policy_arn)
        actions_taken.append(f"Detached {policy_arn.split('/')[-1]}")
    for pname in snapshot['inline_policies']:
        iam.delete_user_policy(UserName=username, PolicyName=pname)
        actions_taken.append(f"Deleted inline policy: {pname}")
    for group in snapshot['groups']:
        iam.remove_user_from_group(UserName=username, GroupName=group)
        actions_taken.append(f"Removed from group: {group}")
    iam.tag_user(UserName=username, Tags=[
        {'Key': 'AccessReview-Disabled', 'Value': datetime.now().isoformat()},
        {'Key': 'AccessReview-Reviewer',
         'Value': decision.get('reviewer_id', 'system')}
    ])
    return {
        'success': True, 'action_taken': 'DISABLE_ACCOUNT',
        'details': '; '.join(actions_taken), 'rollback_data': snapshot
    }
```

#### 4.4.2 AWS IAM Rollback Handler

```python
def handle_aws_rollback(decision: dict, snapshot: dict) -> dict:
    username = snapshot['username']
    action = decision['remediation_action']
    restored = []

    if action == 'DISABLE_ACCOUNT':
        for key in snapshot['access_keys']:
            if key['status'] == 'Active':
                iam.update_access_key(UserName=username,
                    AccessKeyId=key['id'], Status='Active')
                restored.append(f"Re-activated key {key['id'][-4:]}")
        for policy_arn in snapshot['attached_policies']:
            iam.attach_user_policy(UserName=username, PolicyArn=policy_arn)
            restored.append(f"Re-attached {policy_arn.split('/')[-1]}")
        for pname, doc in snapshot['inline_policies'].items():
            iam.put_user_policy(UserName=username,
                PolicyName=pname, PolicyDocument=json.dumps(doc))
            restored.append(f"Restored inline: {pname}")
        for group in snapshot['groups']:
            iam.add_user_to_group(UserName=username, GroupName=group)
            restored.append(f"Re-added to group: {group}")
        if snapshot['has_console_access']:
            restored.append('NOTE: Console login requires manual password reset')
    elif action == 'REMOVE_FROM_GROUP':
        iam.add_user_to_group(UserName=username,
            GroupName=decision['resource_target'])
        restored.append(f"Re-added to {decision['resource_target']}")
    elif action == 'REMOVE_POLICY':
        iam.attach_user_policy(UserName=username,
            PolicyArn=decision['resource_target'])
        restored.append(f"Re-attached {decision['resource_target']}")
    elif action == 'DELETE_KEY':
        for key in snapshot['access_keys']:
            if key['status'] == 'Active':
                iam.update_access_key(UserName=username,
                    AccessKeyId=key['id'], Status='Active')
                restored.append(f"Re-activated {key['id'][-4:]}")

    iam.untag_user(UserName=username,
        TagKeys=['AccessReview-Disabled', 'AccessReview-Reviewer'])
    return {'success': True, 'action_taken': 'ROLLBACK',
            'details': '; '.join(restored)}
```

### 4.5 Google Cloud Platform

#### 4.5.1 GCP IAM Binding Revocation

```python
#!/usr/bin/env python3
"""GCP IAM Remediation Handler"""
from google.cloud import resourcemanager_v3
from google.iam.v1 import iam_policy_pb2, policy_pb2
from google.cloud import iam_admin_v1
import json
from datetime import datetime, timezone

def handle_gcp_remediation(decision: dict) -> dict:
    member = decision['principal_id']
    role = decision['resource_target']
    resource = decision.get('resource_scope', '')
    action = decision['remediation_action']

    if action == 'REVOKE_ROLE':
        return revoke_gcp_iam_binding(resource, role, member)
    elif action == 'DELETE_KEY':
        return delete_gcp_sa_key(decision)
    elif action == 'DISABLE_ACCOUNT':
        return disable_gcp_sa(decision)
    return {'success': False, 'details': f'Unknown action: {action}'}

def revoke_gcp_iam_binding(resource_name, role, member):
    """Remove a specific member from a specific role binding."""
    client = resourcemanager_v3.ProjectsClient()

    get_request = iam_policy_pb2.GetIamPolicyRequest(resource=resource_name)
    policy = client.get_iam_policy(request=get_request)

    original_bindings = []
    for b in policy.bindings:
        original_bindings.append({
            'role': b.role, 'members': list(b.members)
        })

    modified = False
    for binding in policy.bindings:
        if binding.role == role and member in binding.members:
            binding.members.remove(member)
            modified = True
            if len(binding.members) == 0:
                policy.bindings.remove(binding)
            break

    if not modified:
        return {'success': False,
                'details': f'{member} not found in {role} on {resource_name}'}

    set_request = iam_policy_pb2.SetIamPolicyRequest(
        resource=resource_name, policy=policy)
    client.set_iam_policy(request=set_request)

    return {
        'success': True, 'action_taken': 'REVOKE_ROLE',
        'details': f'Removed {member} from {role} on {resource_name}',
        'rollback_data': {
            'resource': resource_name, 'role': role,
            'member': member, 'original_bindings': original_bindings
        }
    }

def delete_gcp_sa_key(decision):
    """Delete a service account key (IRREVERSIBLE)."""
    client = iam_admin_v1.IAMClient()
    key_name = decision['resource_target']
    snapshot = {
        'key_name': key_name,
        'sa_email': decision['principal_id'],
        'deletion_time': datetime.now(timezone.utc).isoformat(),
        'WARNING': 'Key deletion is irreversible'
    }
    request = iam_admin_v1.DeleteServiceAccountKeyRequest(name=key_name)
    client.delete_service_account_key(request=request)
    return {
        'success': True, 'action_taken': 'DELETE_KEY',
        'details': f'Deleted SA key: {key_name}',
        'rollback_data': snapshot
    }

def disable_gcp_sa(decision):
    """Disable a service account entirely."""
    client = iam_admin_v1.IAMClient()
    sa_name = f"projects/-/serviceAccounts/{decision['principal_id']}"
    request = iam_admin_v1.DisableServiceAccountRequest(name=sa_name)
    client.disable_service_account(request=request)
    return {
        'success': True, 'action_taken': 'DISABLE_ACCOUNT',
        'details': f'Disabled SA: {decision["principal_id"]}',
        'rollback_data': {'sa_name': sa_name}
    }
```

#### 4.5.2 GCP Rollback Handler

```python
def handle_gcp_rollback(decision: dict, snapshot: dict) -> dict:
    action = decision['remediation_action']

    if action == 'REVOKE_ROLE':
        client = resourcemanager_v3.ProjectsClient()
        resource = snapshot['resource']
        get_request = iam_policy_pb2.GetIamPolicyRequest(resource=resource)
        policy = client.get_iam_policy(request=get_request)

        role = snapshot['role']
        member = snapshot['member']

        found = False
        for binding in policy.bindings:
            if binding.role == role:
                binding.members.append(member)
                found = True
                break
        if not found:
            new_binding = policy_pb2.Binding()
            new_binding.role = role
            new_binding.members.append(member)
            policy.bindings.append(new_binding)

        set_request = iam_policy_pb2.SetIamPolicyRequest(
            resource=resource, policy=policy)
        client.set_iam_policy(request=set_request)
        return {'success': True,
                'details': f'Restored {member} to {role} on {resource}'}

    elif action == 'DELETE_KEY':
        return {'success': False,
                'details': 'SA key deletion is irreversible. A new key must be created.'}

    elif action == 'DISABLE_ACCOUNT':
        client = iam_admin_v1.IAMClient()
        request = iam_admin_v1.EnableServiceAccountRequest(
            name=snapshot['sa_name'])
        client.enable_service_account(request=request)
        return {'success': True,
                'details': f'Re-enabled SA: {snapshot["sa_name"]}'}
```

---

## 5. Grace Period, Notification, and Exception Handling

### 5.1 Grace Period Workflow

Every revocation decision enters a configurable grace period (default: 7 calendar days) before enforcement. During this window, the affected user receives a notification informing them that their access has been marked for removal, what specific access is affected, who made the decision, and how to request an exception or escalation.

#### 5.1.1 Staged Notification Template

```
Subject: [ACTION REQUIRED] Your access to {resource_target} is
    scheduled for removal

Dear {principal_name},

As part of our regular access review process, the following access
has been reviewed and marked for revocation:

  Platform:      {platform}
  Access Type:   {access_type}
  Resource:      {resource_target}
  Reviewed By:   {reviewer_name}
  Decision Date: {decision_date}
  Enforcement:   {enforcement_date} (in {grace_remaining} days)

If you believe this access is still required for your role,
you have until {enforcement_date} to:

  1. Submit an exception request: {exception_url}
  2. Contact your manager: {manager_email}
  3. Reply to this email with business justification

If no action is taken, access will be automatically removed on
{enforcement_date}.

This is an automated message from the Access Review system.
Review cycle: {review_cycle_id}
```

### 5.2 Exception Workflow

| Exception Type | Approver | Max Duration | Re-Review |
|---|---|---|---|
| Business-critical access | Resource Owner + CISO | 90 days | Next quarterly review |
| Transitional access | Manager | 30 days | On expiration |
| Privileged role exception | CISO mandatory | 30 days | Monthly |
| Service account exception | System Owner + Security | 90 days with monitoring | Next quarterly review |

### 5.3 Escalation and Non-Response Handling

- **Privileged access** (admin roles, Owner/Contributor, AdministratorAccess): Auto-revoke on non-response.
- **Standard access** (group memberships, Reader roles): Auto-approve on first non-response, escalate to manager on second consecutive non-response, auto-revoke on third.
- **Guest/external access:** Auto-revoke on non-response.
- **Service accounts and API keys:** Escalate to system owner on non-response, then to security team. Never auto-approve.

---

## 6. Post-Remediation Verification

After every enforcement action, the remediation engine must verify that the change actually took effect. This is **not optional**; it is required for audit evidence and to catch silent failures. The verification step runs automatically 15 minutes after execution and again at 24 hours.

### 6.1 Verification Methods by Platform

| Platform | Verification Method | Implementation |
|---|---|---|
| Active Directory | Re-query user/group via AD Module | `Get-ADUser -Properties Enabled, MemberOf`; confirm `Enabled=$false` or group membership removed |
| Entra ID | Re-query via Microsoft Graph API | `Get-MgUser AccountEnabled`; `Get-MgGroupMember`; confirm expected state |
| Azure RBAC | Re-query role assignments at scope | `Get-AzRoleAssignment -ObjectId -Scope`; confirm no matching assignment |
| AWS IAM | Re-query user policies, groups, keys | `list_attached_user_policies`, `list_groups_for_user`, `list_access_keys`; confirm empty/inactive |
| GCP IAM | Re-query IAM policy on resource | `get_iam_policy`; confirm member not in role binding; `testIamPermissions` as additional check |

### 6.2 Verification Failure Handling

If verification fails (access is still present after execution), the engine automatically re-queues the decision for another enforcement attempt. After three consecutive failures, the decision is escalated to the security team with a FAILED status and a detailed error log.

---

## 7. Audit Evidence Generation

### 7.1 Evidence Package Contents

- **Review Cycle Summary Report:** Total access items reviewed, breakdown of decisions, completion percentage.
- **Decision Detail Log:** Complete timestamped CSV/JSON of every decision record with all fields.
- **Remediation Execution Log:** Timestamped log of every enforcement action, pre-change snapshot, API call, result, and post-change verification.
- **Exception Register:** All exceptions granted with business justification, approver, expiration date, and re-review date.
- **Rollback Register:** Any rollbacks performed with reason, approver, and confirmation of access restoration.
- **Non-Response Escalation Log:** Reviewers who did not respond and the default action taken.
- **Platform-Specific Extracts:** Raw access data exports timestamped at the beginning of the review cycle.

### 7.2 Evidence Retention

| Framework | Minimum Retention | Recommended Retention |
|---|---|---|
| CMMC Level 2 / NIST 800-171 | 3 years (per DFARS 252.204-7012) | 5 years |
| SOC 2 Type II | 1 year (audit period + request window) | 3 years |
| ISO 27001 | 3 years | 5 years |
| HIPAA | 6 years | 7 years |

---

## 8. Hybrid Entra ID Sync: Remediation Routing

### 8.1 Decision Routing Logic

```powershell
# ── Hybrid Remediation Router ──
function Route-HybridRemediation {
    param([PSCustomObject]$Decision)

    $userId = $Decision.principal_id

    $entraUser = Get-MgUser -UserId $userId -Property `
        OnPremisesSyncEnabled, OnPremisesSamAccountName,
        OnPremisesDistinguishedName

    if ($entraUser.OnPremisesSyncEnabled -eq $true) {
        # ── SYNCED OBJECT: Route to AD handler ──
        Write-Host "Routing to AD: $($entraUser.OnPremisesSamAccountName)"

        $adDecision = $Decision.PSObject.Copy()
        $adDecision.platform = 'AD'
        $adDecision.principal_id = $entraUser.OnPremisesSamAccountName

        $result = Invoke-ADRemediation -Decision $adDecision

        if ($result.Success) {
            Write-Host 'Triggering Entra Connect delta sync...'
            Invoke-Command -ComputerName 'AADConnectServer' -ScriptBlock {
                Import-Module ADSync
                Start-ADSyncSyncCycle -PolicyType Delta
            }
            Start-Sleep -Seconds 120
            $postSync = Get-MgUser -UserId $userId -Property AccountEnabled
            $result.SyncVerified = ($postSync.AccountEnabled -eq $false)
        }
        return $result
    } else {
        # ── CLOUD-ONLY OBJECT: Route to Entra handler ──
        Write-Host "Routing to Entra ID (cloud-only): $userId"
        return Invoke-EntraRemediation -Decision $Decision
    }
}
```

### 8.2 Group Membership Routing

```powershell
function Route-GroupRemediation {
    param(
        [string]$GroupId,
        [string]$MemberId
    )

    $group = Get-MgGroup -GroupId $GroupId -Property `
        OnPremisesSyncEnabled, OnPremisesNetBiosName

    if ($group.OnPremisesSyncEnabled -eq $true) {
        $adGroup = Get-ADGroup -Filter {
            ObjectGuid -eq $GroupId.Replace('-','') } -EA 0
        if (-not $adGroup) {
            $adGroup = Get-ADGroup -Filter {
                Name -eq $group.DisplayName } -EA 0
        }
        if ($adGroup) {
            $entraUser = Get-MgUser -UserId $MemberId -Property `
                OnPremisesSamAccountName
            Remove-ADGroupMember -Identity $adGroup.Name `
                -Members $entraUser.OnPremisesSamAccountName `
                -Confirm:$false
            Write-Host 'Removed from AD group; triggering delta sync'
            return @{ Success = $true; Route = 'AD'; NeedsDeltaSync = $true }
        }
    }

    Remove-MgGroupMemberByRef -GroupId $GroupId `
        -DirectoryObjectId $MemberId
    return @{ Success = $true; Route = 'ENTRA_ID' }
}
```

> **Critical Warning: Never Modify Synced Objects in Entra ID Directly**
> If a synced user is disabled directly in Entra ID, the next Entra Connect sync cycle will re-enable them based on the on-premises AD state. All changes to synced objects MUST be routed through the on-premises AD handler.

---

## 9. End-to-End Orchestration Example

### 9.1 Complete Cycle Timeline

| Day | Phase | Actions |
|---|---|---|
| Day 0 | Discovery | Scheduled extraction scripts run across all platforms. Raw access data exported and loaded into review platform. |
| Day 1 | Normalization | Data normalized into standard schema. Risk scoring applied. Review queues generated per reviewer. |
| Day 1 | Assignment | Review tasks routed to designated reviewers via email/Teams/ITSM. |
| Days 2–14 | Review Period | Reviewers evaluate access and submit decisions. Automated reminders sent on Day 7 and Day 12. |
| Day 14 | Review Close | Review window closes. Non-responses handled per policy. Decision records finalized. |
| Day 15 | Staging | All REVOKE decisions enter STAGED status. Affected users notified with grace period details. |
| Days 15–22 | Grace Period | 7-day grace window. Exception requests processed. |
| Day 22 | Enforcement | Remediation engine processes all STAGED decisions past grace period. Rollback snapshots captured. |
| Day 22 | Verification T+15m | First verification pass. Failed items re-queued. Hybrid sync triggered. |
| Day 23 | Verification T+24h | Second verification pass. Remaining failures escalated. |
| Day 23–25 | Evidence | Audit evidence package auto-generated and stored per retention policy. |
| Days 22–52 | Rollback Window | 30-day rollback window open for business-critical rollback requests. |

### 9.2 Master Orchestration Script

```powershell
# ── Master Access Review Orchestrator ──
# Run via Azure Automation Runbook, Task Scheduler, or CI/CD pipeline

param(
    [string]$ReviewCycleId = "Q1-2026-QUARTERLY",
    [ValidateSet('Discovery','Notify','Enforce','Verify','Evidence')]
    [string]$Phase = 'Discovery',
    [switch]$DryRun
)

$Config = @{
    GracePeriodDays  = 7
    ReviewWindowDays = 14
    RollbackWindowDays = 30
    OutputPath       = "C:\AccessReviews\Cycles\$ReviewCycleId"
    NotifyEmail      = 'access-reviews@company.com'
    EscalationEmail  = 'ciso@company.com'
}

New-Item -ItemType Directory -Path $Config.OutputPath -Force | Out-Null

switch ($Phase) {
    'Discovery' {
        Write-Host '=== PHASE 1: DISCOVERY & EXTRACTION ==='
        & .\Extract-ADAccess.ps1 -OutputPath $Config.OutputPath
        & .\Extract-EntraAccess.ps1 -OutputPath $Config.OutputPath
        & .\Extract-AzureRBAC.ps1 -OutputPath $Config.OutputPath
        & python .\extract_aws_iam.py --output $Config.OutputPath
        & python .\extract_gcp_iam.py --output $Config.OutputPath
        & .\Normalize-AccessData.ps1 -InputPath $Config.OutputPath `
            -ReviewCycleId $ReviewCycleId
        Write-Host 'Discovery complete. Schedule Notify phase for Day 1.'
    }
    'Notify' {
        Write-Host '=== PHASE 2: REVIEWER NOTIFICATION ==='
        & .\Send-ReviewerNotifications.ps1 `
            -ReviewCycleId $ReviewCycleId `
            -Deadline (Get-Date).AddDays($Config.ReviewWindowDays)
    }
    'Enforce' {
        Write-Host '=== PHASE 3: ENFORCEMENT ==='
        $decisions = Import-Csv (Join-Path $Config.OutputPath 'decisions.csv')
        foreach ($d in $decisions | Where-Object decision -eq 'REVOKE') {
            if ($d.enforcement_status -eq 'PENDING') {
                $d.enforcement_status = 'STAGED'
                $d.staged_date = (Get-Date -Format o)
            }
            elseif ($d.enforcement_status -eq 'STAGED') {
                $staged = [datetime]$d.staged_date
                $grace = $staged.AddDays($Config.GracePeriodDays)
                if ((Get-Date) -ge $grace) {
                    $result = Route-HybridRemediation -Decision $d
                    $d.enforcement_status = if ($result.Success) {
                        'EXECUTED' } else { 'FAILED' }
                    $d.enforcement_date = (Get-Date -Format o)
                }
            }
        }
        $decisions | Export-Csv (Join-Path $Config.OutputPath 'decisions.csv') -NoType
    }
    'Verify' {
        Write-Host '=== PHASE 4: VERIFICATION ==='
        $decisions = Import-Csv (Join-Path $Config.OutputPath 'decisions.csv')
        foreach ($d in $decisions | Where-Object enforcement_status -eq 'EXECUTED') {
            switch ($d.platform) {
                'AD'       { $verified = Test-ADRemediationVerified -Decision $d }
                'ENTRA_ID' { $verified = Test-EntraRemediationVerified -Decision $d }
                'AZURE'    { $verified = Test-AzureRemediationVerified -Decision $d }
                'AWS'      { $verified = (& python .\verify_aws.py --decision $d) }
                'GCP'      { $verified = (& python .\verify_gcp.py --decision $d) }
            }
            $d.enforcement_status = if ($verified) { 'VERIFIED' } else { 'FAILED' }
        }
        $decisions | Export-Csv (Join-Path $Config.OutputPath 'decisions.csv') -NoType
    }
    'Evidence' {
        Write-Host '=== PHASE 5: AUDIT EVIDENCE PACKAGE ==='
        & .\Generate-EvidencePackage.ps1 `
            -ReviewCycleId $ReviewCycleId `
            -OutputPath $Config.OutputPath
    }
}
```

---

## 10. Remediation Capability Matrix

| Platform | Remediation Action | Rollback? | Auto? | Verification Method |
|---|---|---|---|---|
| AD | Disable account | Yes | Yes | `Get-ADUser Enabled=$false` |
| AD | Remove from group | Yes | Yes | `Get-ADGroupMember` exclusion check |
| AD | Force password reset | No | Yes | `PasswordLastSet` timestamp changed |
| AD | Move to quarantine OU | Yes | Yes | `DistinguishedName` contains quarantine OU |
| Entra ID | Disable account | Yes | Yes | `Get-MgUser AccountEnabled=$false` |
| Entra ID | Revoke sessions | No | Yes | Session tokens invalidated (implicit) |
| Entra ID | Remove group membership | Yes | Yes | `Get-MgGroupMember` exclusion check |
| Entra ID | Revoke directory role | Yes | Yes | `RoleAssignment` query returns empty |
| M365 | Remove SPO permissions | Yes | Yes | Re-query `RoleAssignments` on site |
| M365 | Remove Teams guest | Yes | Yes | `Get-MgGroupMember` exclusion check |
| M365 | Remove mailbox delegation | Yes | Yes | `Get-MailboxPermission` re-query |
| Azure | Remove RBAC assignment | Yes | Yes | `Get-AzRoleAssignment` returns empty |
| Azure | Remove Key Vault policy | Yes | Yes | `Get-AzKeyVault AccessPolicies` re-query |
| AWS | Deactivate access keys | Yes | Yes | `list_access_keys Status=Inactive` |
| AWS | Remove console access | Partial | Yes | `get_login_profile` raises `NoSuchEntity` |
| AWS | Detach managed policy | Yes | Yes | `list_attached_user_policies` exclusion check |
| AWS | Remove from IAM group | Yes | Yes | `list_groups_for_user` exclusion check |
| GCP | Remove IAM binding | Yes | Yes | `get_iam_policy` member not in binding |
| GCP | Delete SA key | **No** | Yes | `list_service_account_keys` key absent |
| GCP | Disable service account | Yes | Yes | `get_service_account disabled=true` |

---

*End of Addendum*
