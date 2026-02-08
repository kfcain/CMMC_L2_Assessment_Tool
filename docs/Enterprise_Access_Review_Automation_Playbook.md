# Enterprise Access Review Automation Playbook

**Comprehensive Guide to Automating User, Group, and Resource Permission Reviews Across Hybrid Cloud Environments**

**Platforms Covered:** Active Directory | Microsoft 365 / Entra ID | Azure | AWS | Google Cloud Platform

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Scope and Architecture Overview](#2-scope-and-architecture-overview)
3. [On-Premises Active Directory](#3-on-premises-active-directory)
4. [Microsoft Entra ID / Microsoft 365](#4-microsoft-entra-id--microsoft-365)
5. [Azure Resource Access](#5-azure-resource-access)
6. [Amazon Web Services (AWS)](#6-amazon-web-services-aws)
7. [Google Cloud Platform (GCP)](#7-google-cloud-platform-gcp)
8. [Centralized Review Platform Options](#8-centralized-review-platform-options)
9. [Scheduling, Orchestration, and Automation](#9-scheduling-orchestration-and-automation)
10. [Compliance Framework Mapping](#10-compliance-framework-mapping)
11. [Implementation Roadmap](#11-implementation-roadmap)
12. [Summary of Recommendations](#12-summary-of-recommendations)

---

## 1. Executive Summary

Access reviews are a foundational security control required by virtually every compliance framework, including NIST 800-171, CMMC Level 2, SOC 2 Type II, ISO 27001, and HIPAA. They ensure that only authorized users retain access to systems and data, and that access privileges align with current job roles and business needs. Despite their importance, access reviews remain one of the most manual, error-prone, and time-consuming processes in most organizations.

This playbook provides a comprehensive, platform-by-platform approach to automating access reviews across five major environments that most defense contractors and regulated organizations operate: on-premises Active Directory, Microsoft 365 and Entra ID (formerly Azure AD), Azure resource roles, Amazon Web Services (AWS), and Google Cloud Platform (GCP). For each platform, we identify what can be accomplished through built-in user interfaces, what remains a manual gap, and how PowerShell, CLI, and API-based automation can close those gaps.

The intended outcome is an organization that can execute full-scope access reviews on a recurring, automated schedule with designated reviewers, documented evidence trails, and minimal manual intervention.

### Key Compliance Alignment

This playbook directly supports NIST SP 800-171 controls **AC-2** (Account Management), **AC-6** (Least Privilege), and **AU-6** (Audit Record Review), which are foundational to CMMC Level 2 certification. It also maps to SOC 2 CC6.1–6.3 (Logical and Physical Access Controls) and ISO 27001 A.9.2 (User Access Management).

---

## 2. Scope and Architecture Overview

The following environments are in scope for this access review automation program. Each environment has its own identity provider, permissions model, and tooling landscape. The goal of this architecture is to normalize the review process across all of them into a consistent workflow: extract access data, assign reviewers, collect decisions, execute remediations, and generate audit evidence.

### 2.1 Environments in Scope

| Platform | Identity Provider | Built-In Review Tool | Automation Method |
|---|---|---|---|
| On-Prem Active Directory | AD DS / LDAP | None (manual only) | PowerShell / AD Module |
| Microsoft 365 / Entra ID | Entra ID (Azure AD) | Entra ID Access Reviews (P2) | Microsoft Graph API / PowerShell |
| Azure Resources | Entra ID / Azure RBAC | Entra PIM Access Reviews | Az PowerShell / Azure CLI |
| Amazon Web Services | AWS IAM / IAM Identity Center | IAM Access Analyzer (partial) | AWS CLI / Boto3 (Python) |
| Google Cloud Platform | Google Cloud Identity / Workspace | IAM Recommender (partial) | gcloud CLI / Python Client Libraries |

### 2.2 Review Process Architecture

Regardless of platform, every access review follows a five-phase lifecycle. Automation targets each phase to reduce human effort and eliminate missed reviews.

1. **Discovery & Extraction:** Programmatically pull all users, groups, role assignments, resource permissions, and service accounts from each platform.
2. **Normalization & Risk Scoring:** Transform raw access data into a standardized schema. Flag anomalies such as stale accounts, excessive privileges, orphaned service principals, and accounts without MFA.
3. **Reviewer Assignment & Notification:** Route review tasks to designated reviewers (managers, resource owners, or security team) via email, Teams, Slack, or ticketing systems.
4. **Decision Capture & Enforcement:** Collect approve/revoke/modify decisions. Optionally auto-remediate (disable accounts, remove group memberships, revoke roles) based on reviewer decisions.
5. **Evidence Generation & Archival:** Produce timestamped audit reports documenting who reviewed what, the decision rendered, and any changes made. Store evidence for compliance audits.

---

## 3. On-Premises Active Directory

### 3.1 Built-In Capabilities

On-premises Active Directory Domain Services (AD DS) does not include any native access review functionality. Organizations relying solely on AD must perform all user, group, and permission reviews manually using tools such as Active Directory Users and Computers (ADUC), or by exporting data with PowerShell. There is no built-in workflow for assigning reviewers, tracking decisions, or scheduling recurring reviews.

> **Gap Identified — No Native Review Workflow**
> Active Directory has zero built-in access review automation. Every review is fully manual. This is the single highest-priority automation target for most hybrid environments.

### 3.2 Automation: Stale and Inactive Account Detection

The following PowerShell script identifies user accounts that have not logged in within 90 days (configurable), disabled accounts still in privileged groups, and accounts with passwords that never expire. This forms the foundation of any AD access review.

```powershell
# ── AD Stale Account & Privilege Audit ──
Import-Module ActiveDirectory

$DaysInactive = 90
$CutoffDate  = (Get-Date).AddDays(-$DaysInactive)
$ReportPath   = "C:\AccessReviews\AD_UserReview_$(Get-Date -f yyyy-MM-dd).csv"

# Pull all enabled user accounts with last logon data
$Users = Get-ADUser -Filter {Enabled -eq $true} -Properties `
    LastLogonTimestamp, PasswordLastSet, PasswordNeverExpires, `
    MemberOf, Manager, Department, Title, whenCreated |
  Select-Object Name, SamAccountName, Department, Title,
    @{N='LastLogon';E={[DateTime]::FromFileTime($_.LastLogonTimestamp)}},
    @{N='PasswordAge';E={(New-TimeSpan $_.PasswordLastSet (Get-Date)).Days}},
    PasswordNeverExpires, whenCreated,
    @{N='GroupCount';E={($_.MemberOf | Measure-Object).Count}},
    @{N='PrivilegedGroups';E={
      $privGroups = @('Domain Admins','Enterprise Admins',
        'Schema Admins','Account Operators','Backup Operators')
      ($_.MemberOf | ForEach-Object {
        (Get-ADGroup $_).Name } | Where-Object {
          $_ -in $privGroups }) -join '; '
    }},
    @{N='Manager';E={(Get-ADUser $_.Manager -EA 0).Name}},
    @{N='IsStale';E={
      [DateTime]::FromFileTime($_.LastLogonTimestamp) -lt $CutoffDate
    }}

$Users | Export-Csv -Path $ReportPath -NoTypeInformation
Write-Host "Exported $($Users.Count) accounts to $ReportPath"
```

### 3.3 Automation: Group Membership Review

Group memberships in AD control access to file shares, applications, and privileged operations. The following script enumerates all security groups, their members, and flags groups that have not been modified in over 180 days (potentially stale groups with outdated membership).

```powershell
# ── AD Group Membership Audit ──
$GroupReport = "C:\AccessReviews\AD_GroupReview_$(Get-Date -f yyyy-MM-dd).csv"
$StaleThreshold = (Get-Date).AddDays(-180)

$Results = Get-ADGroup -Filter {GroupCategory -eq 'Security'} `
    -Properties Members, whenChanged, Description, ManagedBy |
  ForEach-Object {
    $group = $_
    $members = Get-ADGroupMember -Identity $group -EA 0
    foreach ($member in $members) {
      [PSCustomObject]@{
        GroupName       = $group.Name
        GroupDN         = $group.DistinguishedName
        ManagedBy       = if($group.ManagedBy){(Get-ADUser $group.ManagedBy -EA 0).Name}else{'UNMANAGED'}
        MemberName      = $member.Name
        MemberType      = $member.objectClass
        MemberSAM       = $member.SamAccountName
        GroupLastChanged = $group.whenChanged
        IsStaleGroup    = $group.whenChanged -lt $StaleThreshold
        Description     = $group.Description
      }
    }
  }

$Results | Export-Csv -Path $GroupReport -NoTypeInformation
```

### 3.4 Automation: Scheduling and Reviewer Workflow

Since AD has no reviewer workflow, one must be built. The most practical approach is to schedule the scripts above via Windows Task Scheduler, output review spreadsheets to a shared location, and send notifications to designated reviewers via email.

```powershell
# ── Email Notification to Reviewer ──
$SmtpServer = 'smtp.company.com'
$From       = 'access-reviews@company.com'
$To         = 'security-team@company.com'
$Subject    = "[Action Required] Quarterly AD Access Review - $(Get-Date -f 'MMMM yyyy')"
$Body       = @"
A new Active Directory access review has been generated.

Please review the attached reports and record your decisions
(Approve / Revoke) in the Decision column by $($(Get-Date).AddDays(14).ToString('MMMM dd')).

Reports attached:
  - User Account Review (stale accounts, privilege audit)
  - Group Membership Review

Questions? Contact the Security Team.
"@

Send-MailMessage -SmtpServer $SmtpServer -From $From -To $To `
  -Subject $Subject -Body $Body `
  -Attachments $ReportPath, $GroupReport
```

### 3.5 Automation: Decision Enforcement

After reviewers submit decisions, the following script reads the decision file and executes revocations for any access marked for removal.

```powershell
# ── Process Review Decisions ──
$DecisionFile = 'C:\AccessReviews\Decisions_Q1_2026.csv'
$AuditLog     = "C:\AccessReviews\RemediationLog_$(Get-Date -f yyyy-MM-dd).csv"

$Decisions = Import-Csv $DecisionFile
$Log = @()

foreach ($row in $Decisions | Where-Object Decision -eq 'Revoke') {
  try {
    if ($row.ActionType -eq 'DisableAccount') {
      Disable-ADAccount -Identity $row.SamAccountName -Confirm:$false
    } elseif ($row.ActionType -eq 'RemoveFromGroup') {
      Remove-ADGroupMember -Identity $row.GroupName `
        -Members $row.SamAccountName -Confirm:$false
    }
    $Log += [PSCustomObject]@{
      Timestamp = Get-Date; User = $row.SamAccountName
      Action = $row.ActionType; Group = $row.GroupName
      Status = 'Success'; Reviewer = $row.ReviewerName
    }
  } catch {
    $Log += [PSCustomObject]@{
      Timestamp = Get-Date; User = $row.SamAccountName
      Action = $row.ActionType; Status = "Error: $_"
    }
  }
}
$Log | Export-Csv $AuditLog -NoTypeInformation
```

---

## 4. Microsoft Entra ID / Microsoft 365

### 4.1 Built-In Capabilities: Entra ID Access Reviews

Microsoft Entra ID (formerly Azure AD) provides the most mature built-in access review capability of any platform covered in this report, but it requires **Entra ID P2** (or Entra ID Governance) licensing. The following features are available:

- Recurring access reviews for Entra ID group memberships, including M365 Groups and Teams memberships
- Application role assignment reviews for enterprise applications registered in Entra ID
- Entra ID directory role reviews (e.g., Global Admin, User Admin) via Privileged Identity Management (PIM)
- Azure resource role reviews (e.g., Subscription Contributor, Resource Group Owner) via PIM for Azure Resources
- Access package assignment reviews via Entra ID Governance Entitlement Management
- Multi-stage reviews with different reviewers at each stage (e.g., manager first, then resource owner)
- Auto-apply of results: automatically remove access for users who are denied or who do not respond
- Reviewer assignment options: self-review, manager of user, specific users/groups, or application owners

> **Built-In Coverage — Entra ID Access Reviews (P2 Required)**
> Entra Access Reviews cover Entra groups, app roles, directory roles, PIM-eligible roles, and entitlement management packages. However, they do **NOT** cover SharePoint site permissions, Teams channel-level permissions, Exchange mailbox delegates, OneDrive sharing, or Conditional Access policy assignments. These remain manual gaps.

### 4.2 Gap: SharePoint, Teams, and Exchange Permissions

Entra ID Access Reviews do not extend to SharePoint Online site-level permissions, Teams channel-level guest access, Exchange Online mailbox delegation, or OneDrive external sharing links. These must be reviewed through custom automation.

#### 4.2.1 SharePoint Online Site Permission Review

```powershell
# ── SharePoint Online Site Permissions Audit ──
# Requires: PnP.PowerShell
Import-Module PnP.PowerShell

$AdminUrl  = 'https://contoso-admin.sharepoint.com'
$OutFile   = "SPO_Permissions_$(Get-Date -f yyyy-MM-dd).csv"

Connect-PnPOnline -Url $AdminUrl -Interactive
$Sites = Get-PnPTenantSite -Detailed | Where-Object Template -ne 'RedirectSite#0'

$AllPerms = foreach ($site in $Sites) {
  Connect-PnPOnline -Url $site.Url -Interactive
  $web = Get-PnPWeb -Includes RoleAssignments
  foreach ($ra in $web.RoleAssignments) {
    $member = Get-PnPProperty -ClientObject $ra -Property Member
    $roles  = Get-PnPProperty -ClientObject $ra -Property RoleDefinitionBindings
    [PSCustomObject]@{
      SiteUrl       = $site.Url
      SiteTitle     = $site.Title
      PrincipalName = $member.Title
      PrincipalType = $member.PrincipalType
      Permissions   = ($roles | Select -Exp Name) -join '; '
      LoginName     = $member.LoginName
      SiteOwner     = $site.Owner
    }
  }
}
$AllPerms | Export-Csv $OutFile -NoTypeInformation
```

#### 4.2.2 Microsoft Teams Guest and External Access Review

```powershell
# ── Teams Guest Access Audit via Microsoft Graph ──
Import-Module Microsoft.Graph.Groups
Import-Module Microsoft.Graph.Users

Connect-MgGraph -Scopes 'Group.Read.All','User.Read.All','TeamMember.Read.All'

$Teams = Get-MgGroup -Filter "resourceProvisioningOptions/any(x:x eq 'Team')" -All
$GuestReport = foreach ($team in $Teams) {
  $members = Get-MgGroupMember -GroupId $team.Id -All
  foreach ($m in $members) {
    $user = Get-MgUser -UserId $m.Id -Property UserType,Mail,DisplayName -EA 0
    if ($user.UserType -eq 'Guest') {
      [PSCustomObject]@{
        TeamName     = $team.DisplayName
        TeamId       = $team.Id
        GuestName    = $user.DisplayName
        GuestEmail   = $user.Mail
        GuestId      = $user.Id
        ReviewAction = '' # Reviewer fills: Approve / Revoke
      }
    }
  }
}
$GuestReport | Export-Csv 'Teams_GuestReview.csv' -NoTypeInformation
```

#### 4.2.3 Exchange Online Mailbox Delegation Review

```powershell
# ── Exchange Online Delegation Audit ──
Import-Module ExchangeOnlineManagement
Connect-ExchangeOnline

$Mailboxes = Get-Mailbox -ResultSize Unlimited
$DelegationReport = foreach ($mbx in $Mailboxes) {
  # Full Access delegates
  $fullAccess = Get-MailboxPermission -Identity $mbx.Identity |
    Where-Object { $_.User -ne 'NT AUTHORITY\SELF' -and $_.IsInherited -eq $false }
  # Send-As delegates
  $sendAs = Get-RecipientPermission -Identity $mbx.Identity |
    Where-Object { $_.Trustee -ne 'NT AUTHORITY\SELF' }
  foreach ($fa in $fullAccess) {
    [PSCustomObject]@{
      Mailbox = $mbx.PrimarySmtpAddress; Delegate = $fa.User
      PermType = 'FullAccess'; AccessRights = $fa.AccessRights -join ','
    }
  }
  foreach ($sa in $sendAs) {
    [PSCustomObject]@{
      Mailbox = $mbx.PrimarySmtpAddress; Delegate = $sa.Trustee
      PermType = 'SendAs'; AccessRights = 'SendAs'
    }
  }
}
$DelegationReport | Export-Csv 'Exchange_Delegations.csv' -NoTypeInformation
```

### 4.3 Automation: Entra ID Roles and Service Principals

While Entra Access Reviews handle directory role reviews if PIM is configured, many organizations have direct (permanent) role assignments that bypass PIM. Additionally, service principals with high-privilege roles are often overlooked.

#### 4.3.1 Directory Role Assignment Audit (Including Permanent)

```powershell
# ── Entra ID Directory Role Audit ──
Import-Module Microsoft.Graph.Identity.DirectoryManagement
Connect-MgGraph -Scopes 'RoleManagement.Read.All','User.Read.All'

$Roles = Get-MgDirectoryRole -All
$RoleReport = foreach ($role in $Roles) {
  $members = Get-MgDirectoryRoleMember -DirectoryRoleId $role.Id -All
  foreach ($m in $members) {
    $detail = Get-MgDirectoryObject -DirectoryObjectId $m.Id
    [PSCustomObject]@{
      RoleName      = $role.DisplayName
      PrincipalName = $detail.AdditionalProperties['displayName']
      PrincipalType = $detail.AdditionalProperties['@odata.type']
      PrincipalId   = $m.Id
      AssignmentType = 'Permanent'  # PIM-eligible tracked separately
    }
  }
}
$RoleReport | Export-Csv 'EntraID_RoleAssignments.csv' -NoTypeInformation
```

#### 4.3.2 Entra ID Conditional Access Policy Review

```powershell
# ── Conditional Access Policy Configuration Audit ──
Import-Module Microsoft.Graph.Identity.SignIns
Connect-MgGraph -Scopes 'Policy.Read.All'

$Policies = Get-MgIdentityConditionalAccessPolicy -All
$CAPReport = foreach ($p in $Policies) {
  [PSCustomObject]@{
    PolicyName    = $p.DisplayName
    State         = $p.State
    IncludeUsers  = ($p.Conditions.Users.IncludeUsers) -join '; '
    ExcludeUsers  = ($p.Conditions.Users.ExcludeUsers) -join '; '
    IncludeGroups = ($p.Conditions.Users.IncludeGroups) -join '; '
    ExcludeGroups = ($p.Conditions.Users.ExcludeGroups) -join '; '
    IncludeApps   = ($p.Conditions.Applications.IncludeApplications) -join '; '
    GrantControls = ($p.GrantControls.BuiltInControls) -join '; '
    SessionCtrls  = ($p.SessionControls | ConvertTo-Json -Compress)
    LastModified  = $p.ModifiedDateTime
  }
}
$CAPReport | Export-Csv 'EntraID_ConditionalAccess.csv' -NoTypeInformation
```

### 4.4 Hybrid Entra ID Sync Considerations

Organizations using Entra ID Connect to synchronize on-premises AD with Entra ID must account for the fact that changes to synced accounts must be made in the on-premises AD, not in Entra ID.

- **Synced accounts** (`onPremisesSyncEnabled = true`): Disable/modify in on-premises AD; changes replicate to Entra ID on next sync cycle.
- **Cloud-only accounts** (`onPremisesSyncEnabled = false/null`): Disable/modify directly in Entra ID via Graph API.
- Group membership changes for synced groups must also be made in on-premises AD.
- Automation scripts should query the `onPremisesSyncEnabled` property and branch logic accordingly.

---

## 5. Azure Resource Access

### 5.1 Built-In Capabilities

Azure PIM provides access reviews for Azure resource roles and Entra ID directory roles. However, PIM access reviews only cover role assignments managed through PIM. Direct Azure RBAC assignments made outside PIM are not automatically included.

> **Built-In Coverage — Azure PIM Access Reviews**
> PIM reviews cover eligible and active role assignments for Azure subscriptions, resource groups, and individual resources. They do **NOT** cover Azure Key Vault access policies, Storage Account access keys, Azure SQL firewall rules, or resource-level shared access signatures (SAS tokens).

### 5.2 Automation: Full Azure RBAC Audit

```powershell
# ── Azure RBAC Comprehensive Audit ──
Import-Module Az.Accounts, Az.Resources
Connect-AzAccount

$Subscriptions = Get-AzSubscription
$AzureRBAC = foreach ($sub in $Subscriptions) {
  Set-AzContext -SubscriptionId $sub.Id | Out-Null
  $assignments = Get-AzRoleAssignment -IncludeClassicAdministrators
  foreach ($a in $assignments) {
    [PSCustomObject]@{
      SubscriptionName = $sub.Name
      SubscriptionId   = $sub.Id
      Scope            = $a.Scope
      RoleDefinition   = $a.RoleDefinitionName
      PrincipalName    = $a.DisplayName
      PrincipalType    = $a.ObjectType
      PrincipalId      = $a.ObjectId
      CanDelegate      = $a.CanDelegate
      IsCustomRole     = ($a.RoleDefinitionName -notin @(
        'Owner','Contributor','Reader','User Access Administrator'))
    }
  }
}
$AzureRBAC | Export-Csv 'Azure_RBAC_Review.csv' -NoTypeInformation
```

### 5.3 Automation: Azure Key Vault Access Policy Review

```powershell
# ── Key Vault Access Policy Audit ──
$Vaults = Get-AzKeyVault
$KVReport = foreach ($v in $Vaults) {
  $vault = Get-AzKeyVault -VaultName $v.VaultName
  foreach ($policy in $vault.AccessPolicies) {
    [PSCustomObject]@{
      VaultName   = $v.VaultName
      ResourceGroup = $v.ResourceGroupName
      ObjectId    = $policy.ObjectId
      DisplayName = (Get-AzADServicePrincipal -ObjectId $policy.ObjectId -EA 0).DisplayName
      KeyPerms    = $policy.PermissionsToKeys -join '; '
      SecretPerms = $policy.PermissionsToSecrets -join '; '
      CertPerms   = $policy.PermissionsToCertificates -join '; '
    }
  }
}
$KVReport | Export-Csv 'Azure_KeyVault_Access.csv' -NoTypeInformation
```

---

## 6. Amazon Web Services (AWS)

### 6.1 Built-In Capabilities

AWS provides several native tools that partially address access review needs, but none constitute a full access review workflow:

- **IAM Access Analyzer:** Identifies resources shared with external entities. Useful for finding overshared resources but does not review user-level access.
- **IAM Credential Report:** A downloadable CSV of all IAM users showing password age, MFA status, access key age, and last usage. Point-in-time snapshot, not a review workflow.
- **IAM Access Advisor:** Shows last-accessed timestamps for each service a user/role has permissions to. Helps identify unused permissions.
- **AWS IAM Identity Center:** Provides centralized permission set management but has no built-in access review or recertification workflow.
- **AWS Organizations SCPs:** Service Control Policies provide guardrails but are not a review mechanism.

> **Gap Identified — No Native User Access Review Workflow in AWS**
> AWS has strong tools for detecting issues but no mechanism for assigning reviewers, collecting decisions, or scheduling recurring reviews. The entire access review workflow must be built through automation.

### 6.2 Automation: IAM User and Policy Audit

```python
#!/usr/bin/env python3
"""AWS IAM Comprehensive Access Review Script"""
import boto3, csv, json
from datetime import datetime, timezone, timedelta

iam = boto3.client('iam')
STALE_DAYS = 90
cutoff = datetime.now(timezone.utc) - timedelta(days=STALE_DAYS)

def get_all_users():
    paginator = iam.get_paginator('list_users')
    users = []
    for page in paginator.paginate():
        users.extend(page['Users'])
    return users

def audit_user(user):
    username = user['UserName']
    groups = [g['GroupName'] for g in
              iam.list_groups_for_user(UserName=username)['Groups']]
    policies = [p['PolicyArn'] for p in
                iam.list_attached_user_policies(UserName=username)
                ['AttachedPolicies']]
    inline = iam.list_user_policies(UserName=username)['PolicyNames']
    mfa = iam.list_mfa_devices(UserName=username)['MFADevices']
    keys = iam.list_access_keys(UserName=username)
    key_info = []
    for k in keys['AccessKeyMetadata']:
        last_used = iam.get_access_key_last_used(AccessKeyId=k['AccessKeyId'])
        key_info.append({
            'KeyId': k['AccessKeyId'][-4:],
            'Status': k['Status'],
            'Created': str(k['CreateDate']),
            'LastUsed': str(last_used['AccessKeyLastUsed'].get(
                'LastUsedDate', 'Never'))
        })
    last_login = user.get('PasswordLastUsed')
    is_stale = (last_login and last_login < cutoff) if last_login else True
    return {
        'UserName': username,
        'Created': str(user['CreateDate']),
        'LastLogin': str(last_login) if last_login else 'Never/NoConsole',
        'IsStale': is_stale,
        'MFA_Enabled': len(mfa) > 0,
        'Groups': '; '.join(groups),
        'AttachedPolicies': '; '.join([p.split('/')[-1] for p in policies]),
        'InlinePolicies': '; '.join(inline),
        'AccessKeys': json.dumps(key_info),
        'HasAdminAccess': 'AdministratorAccess' in
            [p.split('/')[-1] for p in policies]
    }

users = get_all_users()
results = [audit_user(u) for u in users]
with open(f'aws_iam_review_{datetime.now():%Y-%m-%d}.csv', 'w') as f:
    w = csv.DictWriter(f, fieldnames=results[0].keys())
    w.writeheader()
    w.writerows(results)
print(f'Audited {len(results)} IAM users')
```

### 6.3 Automation: IAM Role and Trust Policy Review

```python
# ── AWS IAM Role Trust & Permission Audit ──
import boto3, csv, json
from datetime import datetime

iam = boto3.client('iam')
roles = []
paginator = iam.get_paginator('list_roles')
for page in paginator.paginate():
    roles.extend(page['Roles'])

results = []
for role in roles:
    trust = role['AssumeRolePolicyDocument']
    principals = []
    for stmt in trust.get('Statement', []):
        p = stmt.get('Principal', {})
        if isinstance(p, str): principals.append(p)
        else:
            for v in p.values():
                if isinstance(v, list): principals.extend(v)
                else: principals.append(v)
    attached = iam.list_attached_role_policies(
        RoleName=role['RoleName'])['AttachedPolicies']
    results.append({
        'RoleName': role['RoleName'],
        'RoleId': role['RoleId'],
        'Created': str(role['CreateDate']),
        'TrustedPrincipals': '; '.join(principals),
        'IsExternalTrust': any(
            ':root' in p or '.amazonaws.com' not in p
            for p in principals if 'arn:' in p),
        'AttachedPolicies': '; '.join(
            [p['PolicyName'] for p in attached]),
        'HasAdminAccess': 'AdministratorAccess' in
            [p['PolicyName'] for p in attached],
        'Path': role['Path'],
    })

with open(f'aws_role_review_{datetime.now():%Y-%m-%d}.csv', 'w') as f:
    w = csv.DictWriter(f, fieldnames=results[0].keys())
    w.writeheader()
    w.writerows(results)
```

### 6.4 Automation: S3 Bucket Access and Public Exposure Review

```python
# ── S3 Bucket Access & Public Exposure Audit ──
import boto3, csv, json
from datetime import datetime

s3 = boto3.client('s3')
buckets = s3.list_buckets()['Buckets']
results = []

for bucket in buckets:
    name = bucket['Name']
    try:
        acl = s3.get_bucket_acl(Bucket=name)
        public_acl = any(
            g.get('URI','').endswith('AllUsers') or
            g.get('URI','').endswith('AuthenticatedUsers')
            for grant in acl['Grants']
            for g in [grant.get('Grantee', {})])
    except: public_acl = 'Error'
    try:
        pub_access = s3.get_public_access_block(Bucket=name)
        block_config = pub_access['PublicAccessBlockConfiguration']
        fully_blocked = all(block_config.values())
    except: fully_blocked = False
    try:
        policy = s3.get_bucket_policy(Bucket=name)
        policy_json = json.loads(policy['Policy'])
        has_public_policy = any(
            stmt.get('Principal') in ['*', {'AWS': '*'}]
            for stmt in policy_json.get('Statement', []))
    except: has_public_policy = False
    results.append({
        'BucketName': name,
        'PublicACL': public_acl,
        'PublicAccessBlocked': fully_blocked,
        'HasPublicPolicy': has_public_policy,
        'RiskLevel': 'HIGH' if (public_acl or has_public_policy)
            and not fully_blocked else 'OK',
    })

with open(f'aws_s3_review_{datetime.now():%Y-%m-%d}.csv', 'w') as f:
    w = csv.DictWriter(f, fieldnames=results[0].keys())
    w.writeheader()
    w.writerows(results)
```

### 6.5 Scheduling AWS Reviews

- **AWS Lambda + EventBridge:** Schedule Lambda functions on a cron schedule. Output to S3 and trigger SNS notifications.
- **AWS Step Functions:** Orchestrate multi-step review workflows including extraction, notification, decision collection, and remediation.
- **AWS Systems Manager Automation:** Run scripts on EC2 instances or as SSM documents on a schedule.
- **External Scheduler:** Run Python/Boto3 scripts from a hardened jump box, CI/CD pipeline, or centralized automation server.

---

## 7. Google Cloud Platform (GCP)

### 7.1 Built-In Capabilities

GCP does not have a native access review or recertification workflow.

- **IAM Recommender:** Analyzes actual permission usage over 90 days and suggests role reductions. Recommendation engine, not a review workflow.
- **Policy Analyzer:** Answers "Who can access this resource?" by analyzing IAM policies. Useful for one-off investigations, not recurring reviews.
- **Cloud Asset Inventory:** Searchable inventory of all GCP resources and their IAM bindings. Can export to BigQuery.
- **Access Transparency Logs:** Shows Google staff access to customer data (for Assured Workloads). Not a user access review tool.

> **Gap Identified — No Native Access Review Workflow in GCP**
> GCP provides strong analysis and recommendation tools but has no mechanism for scheduling reviews, assigning reviewers, collecting decisions, or automating remediation. The full workflow must be custom-built.

### 7.2 Automation: GCP IAM Binding Audit

```python
#!/usr/bin/env python3
"""GCP Organization-Wide IAM Binding Audit"""
from google.cloud import asset_v1, resourcemanager_v3
import csv
from datetime import datetime

def audit_org_iam(org_id):
    client = asset_v1.AssetServiceClient()
    scope = f'organizations/{org_id}'
    results = []

    request = asset_v1.SearchAllIamPoliciesRequest(
        scope=scope, page_size=500)
    for policy in client.search_all_iam_policies(request=request):
        resource = policy.resource
        for binding in policy.policy.bindings:
            role = binding.role
            for member in binding.members:
                member_type = member.split(':')[0]
                member_id = member.split(':')[-1] if ':' in member else member
                results.append({
                    'Resource': resource,
                    'Role': role,
                    'MemberType': member_type,
                    'MemberId': member_id,
                    'IsServiceAccount': member_type == 'serviceAccount',
                    'IsAllUsers': member in ('allUsers','allAuthenticatedUsers'),
                    'IsOwnerOrEditor': role in (
                        'roles/owner', 'roles/editor'),
                    'RiskLevel': 'HIGH' if (
                        member in ('allUsers','allAuthenticatedUsers') or
                        role in ('roles/owner','roles/editor'))
                        else 'NORMAL',
                })
    return results

org_id = 'YOUR_ORG_ID'
results = audit_org_iam(org_id)
with open(f'gcp_iam_review_{datetime.now():%Y-%m-%d}.csv', 'w') as f:
    w = csv.DictWriter(f, fieldnames=results[0].keys())
    w.writeheader()
    w.writerows(results)
print(f'Found {len(results)} IAM bindings across org')
```

### 7.3 Automation: GCP Service Account Key Review

```python
# ── GCP Service Account Key Audit ──
from google.cloud import iam_admin_v1
from google.cloud import resourcemanager_v3
import csv
from datetime import datetime, timezone, timedelta

def audit_sa_keys(project_id):
    client = iam_admin_v1.IAMClient()
    request = iam_admin_v1.ListServiceAccountsRequest(
        name=f'projects/{project_id}')
    results = []
    for sa in client.list_service_accounts(request=request):
        keys_req = iam_admin_v1.ListServiceAccountKeysRequest(
            name=sa.name,
            key_types=[iam_admin_v1.ListServiceAccountKeysRequest.KeyType.USER_MANAGED]
        )
        keys = client.list_service_account_keys(request=keys_req)
        for key in keys.keys:
            age = (datetime.now(timezone.utc) -
                   key.valid_after_time).days
            results.append({
                'Project': project_id,
                'ServiceAccount': sa.email,
                'KeyId': key.name.split('/')[-1][:12],
                'Created': str(key.valid_after_time),
                'KeyAgeDays': age,
                'IsStale': age > 90,
                'Expires': str(key.valid_before_time),
                'Disabled': key.disabled,
            })
    return results
```

### 7.4 Automation: Google Workspace Directory and Group Review

```python
# ── Google Workspace User & Group Audit ──
from googleapiclient.discovery import build
from google.oauth2 import service_account
import csv
from datetime import datetime

SCOPES = ['https://www.googleapis.com/auth/admin.directory.user.readonly',
          'https://www.googleapis.com/auth/admin.directory.group.readonly']
SA_FILE = 'service-account-key.json'
ADMIN_EMAIL = 'admin@yourdomain.com'

creds = service_account.Credentials.from_service_account_file(
    SA_FILE, scopes=SCOPES, subject=ADMIN_EMAIL)
service = build('admin', 'directory_v1', credentials=creds)

# List all users
users = []
request = service.users().list(customer='my_customer',
    orderBy='email', projection='full')
while request:
    response = request.execute()
    users.extend(response.get('users', []))
    request = service.users().list_next(request, response)

user_report = []
for u in users:
    user_report.append({
        'Email': u['primaryEmail'],
        'Name': u['name']['fullName'],
        'Suspended': u.get('suspended', False),
        'IsAdmin': u.get('isAdmin', False),
        'Is2SVEnrolled': u.get('isEnrolledIn2Sv', False),
        'Is2SVEnforced': u.get('isEnforcedIn2Sv', False),
        'LastLogin': u.get('lastLoginTime', 'Never'),
        'CreationTime': u.get('creationTime'),
        'OrgUnit': u.get('orgUnitPath'),
    })
```

---

## 8. Centralized Review Platform Options

### 8.1 Option A: SharePoint/Teams-Based Review (Low Cost)

Use SharePoint Online lists or Microsoft Lists as the review platform. Upload extracted CSV data as list items, assign reviewers via the Person column type, and use Power Automate flows to send reminders and process decisions.

- **Advantages:** No additional licensing cost, familiar interface, integrates with Teams and Outlook, Power Automate provides workflow capability.
- **Limitations:** Manual setup of review lists per cycle, limited scalability, no built-in enforcement/remediation automation, reporting requires manual effort or Power BI.

### 8.2 Option B: ServiceNow / ITSM Integration (Medium Cost)

For organizations with an existing ITSM platform like ServiceNow, Jira Service Management, or Freshservice, access review tasks can be created as tickets or catalog items. Scripts push review items into the ITSM platform via API.

### 8.3 Option C: Dedicated IGA Platform (Enterprise)

Identity Governance and Administration (IGA) platforms such as SailPoint IdentityNow, Saviynt, ConductorOne, Veza, or Opal provide purpose-built access review workflows with connectors for all major platforms. Gold standard but carry significant licensing and implementation costs.

### 8.4 Option D: Custom Web Application (Flexible)

Build a lightweight internal web application (e.g., using a Python/Flask or Node.js backend with a database) that ingests extracted access data, presents review queues to assigned reviewers, captures decisions, and triggers remediation scripts via API calls.

---

## 9. Scheduling, Orchestration, and Automation

### 9.1 Recommended Review Frequencies

| Review Type | Frequency | Reviewer | Priority |
|---|---|---|---|
| Privileged role holders (admin accounts) | Monthly | CISO / Security Lead | Critical |
| Service accounts and API keys | Monthly | System Owner | Critical |
| External/guest user access | Quarterly | Sponsoring Employee | High |
| Group membership (security groups) | Quarterly | Group Owner / Manager | High |
| Application role assignments | Semi-annually | App Owner | Medium |
| All user accounts (full recertification) | Annually | Direct Manager | Standard |
| Cloud resource RBAC (Azure/AWS/GCP) | Quarterly | Cloud Admin / DevOps Lead | High |
| Conditional Access / Security policies | Semi-annually | Security Architect | High |

### 9.2 Orchestration Architecture

- **Azure Automation Runbooks:** Host PowerShell and Python scripts as runbooks with schedules. Use Managed Identity for authentication and Hybrid Runbook Workers for on-premises AD access.
- **Azure Logic Apps or Power Automate:** Orchestrate end-to-end workflow including triggering extraction, sending notifications, collecting responses, and triggering remediation.
- **GitHub Actions or Azure DevOps Pipelines:** Store scripts in version control and run on a cron schedule. Provides audit trail of script changes and execution history.
- **Dedicated Server with Task Scheduler / Cron:** A hardened, restricted-access server that runs all review scripts on schedule. Simplest for hybrid environments.

### 9.3 Authentication and Secret Management

- **Azure/M365:** Use Managed Identities for Azure Automation. Certificate-based app registration authentication for Microsoft Graph. Store certificates in Azure Key Vault.
- **AWS:** Use IAM Roles for EC2/Lambda execution. For cross-account access, use AssumeRole with external ID. Store credentials in AWS Secrets Manager.
- **GCP:** Use service account impersonation and Workload Identity Federation. Store service account keys (if required) in Secret Manager.
- **On-Premises AD:** Use Group Managed Service Accounts (gMSA) for scheduled task execution. Use Constrained Delegation where possible.

---

## 10. Compliance Framework Mapping

| Review Capability | NIST 800-171 | CMMC L2 | SOC 2 | ISO 27001 |
|---|---|---|---|---|
| User account recertification | AC-2(j), AC-2(3) | AC.L2-3.1.1 | CC6.1, CC6.2 | A.9.2.5 |
| Privileged access review | AC-6(7) | AC.L2-3.1.5, AC.L2-3.1.6 | CC6.1, CC6.3 | A.9.2.3 |
| Stale/inactive account detection | AC-2(3) | AC.L2-3.1.1 | CC6.2 | A.9.2.6 |
| Separation of duties | AC-5 | AC.L2-3.1.4 | CC6.1 | A.6.1.2 |
| External/guest access review | AC-2, PE-2 | AC.L2-3.1.1 | CC6.1, CC6.6 | A.9.4.1 |
| Service account / API key review | IA-4, IA-5 | IA.L2-3.5.1, IA.L2-3.5.2 | CC6.1 | A.9.2.1 |
| Audit log and evidence generation | AU-6, AU-12 | AU.L2-3.3.1 | CC7.2 | A.12.4.1 |

---

## 11. Implementation Roadmap

### Phase 1: Foundation (Weeks 1–4)

- Deploy Entra ID Access Reviews for all Entra ID groups, directory roles, and application assignments (requires P2 licensing).
- Implement the on-premises AD user and group audit scripts. Schedule via Task Scheduler for monthly execution.
- Configure Entra ID Connect health monitoring to ensure hybrid sync is functioning correctly.
- Establish the centralized review platform (SharePoint list, ITSM tickets, or IGA tool).

### Phase 2: Cloud Expansion (Weeks 5–8)

- Deploy AWS IAM user, role, and S3 access review scripts. Schedule via Lambda + EventBridge or centralized automation server.
- Deploy GCP IAM binding and service account key review scripts. Schedule via Cloud Scheduler + Cloud Functions.
- Deploy the SharePoint, Teams guest, and Exchange delegation review scripts for M365.
- Implement reviewer notification workflows (email, Teams messages, or ITSM ticket creation).

### Phase 3: Enforcement and Maturity (Weeks 9–12)

- Implement automated remediation for reviewer decisions (account disablement, group removal, role revocation).
- Build compliance evidence reports documenting each review cycle.
- Conduct a tabletop exercise to validate the end-to-end process.
- Establish KPIs: review completion rate, mean time to remediation, number of excessive privileges found, and percentage of stale accounts removed.

---

## 12. Summary of Recommendations

| Platform | Built-In Coverage | Manual Gaps | Automation Priority |
|---|---|---|---|
| On-Prem AD | None | All user, group, and OU reviews are fully manual | **HIGHEST:** Deploy PowerShell automation immediately |
| Entra ID / M365 | Access Reviews (P2): groups, roles, apps, PIM | SharePoint permissions, Teams guests, Exchange delegates, Conditional Access | **HIGH:** Enable Access Reviews + script remaining gaps |
| Azure Resources | PIM Access Reviews for PIM-managed roles | Direct RBAC assignments, Key Vault policies, Storage keys | **HIGH:** Script full RBAC + resource-level access audit |
| AWS | Credential Report, Access Analyzer, Access Advisor (analysis only) | Full review workflow: no reviewer assignment, decision tracking, or remediation | **HIGH:** Build complete review pipeline with Python/Boto3 |
| GCP | IAM Recommender, Policy Analyzer (analysis only) | Full review workflow: no reviewer assignment, decision tracking, or remediation | **HIGH:** Build complete review pipeline with Python/gcloud |

---

*End of Report*
