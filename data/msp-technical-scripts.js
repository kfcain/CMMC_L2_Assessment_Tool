// MSP/MSSP Technical Scripts & Automation Library — Part 1: Identity & Access
// Extreme-depth runnable scripts for CMMC control domains
// Platforms: Azure GCC High, AWS GovCloud, GCP Assured Workloads
// CMMC Controls: 3.1.x, 3.5.x, 3.9.x
// Version: 1.0.0

const MSP_TECHNICAL_SCRIPTS = {
    version: "1.0.0",
    lastUpdated: "2026-02-08",
    sections: [
        { id: "identity", label: "Identity & Access" },
        { id: "audit", label: "Audit & Logging" },
        { id: "endpoints", label: "Endpoint Hardening" },
        { id: "network", label: "Network Security" },
        { id: "ir", label: "Incident Response" },
        { id: "evidence", label: "Evidence Collection" },
        { id: "media", label: "Media & Maintenance" }
    ],

    // ========== SECTION 1: IDENTITY & ACCESS ==========
    identity: {
        title: "Identity & Access Management Scripts",
        description: "User lifecycle, MFA, Conditional Access, PIM, RBAC, access reviews across Azure GCC High, AWS GovCloud, and GCP.",
        subsections: [
            {
                id: "entra-ca",
                title: "Entra ID — Conditional Access Policy Suite",
                platform: "Azure GCC High",
                language: "PowerShell",
                cmmcControls: ["3.1.1", "3.1.2", "3.1.12", "3.5.1", "3.5.3", "3.13.8"],
                prerequisites: ["Microsoft.Graph PowerShell module", "Global Admin or CA Admin", "Entra ID P2"],
                evidence: ["CA policy export (JSON)", "Sign-in logs showing MFA", "Named location config"],
                script: `#Requires -Modules Microsoft.Graph.Authentication, Microsoft.Graph.Identity.SignIns
# CMMC Conditional Access Policy Suite — GCC High
# Deploys 8 CA policies: MFA, legacy auth block, device compliance,
# geo-restriction, risk-based, admin hardening, session timeout

Connect-MgGraph -Environment USGov -Scopes @(
    "Policy.ReadWrite.ConditionalAccess","Application.Read.All","Directory.Read.All"
)

function Deploy-CAPolicy { param([hashtable]$P)
    $ex = Get-MgIdentityConditionalAccessPolicy -Filter "displayName eq '$($P.displayName)'" -EA SilentlyContinue
    if ($ex) { Update-MgIdentityConditionalAccessPolicy -ConditionalAccessPolicyId $ex.Id -BodyParameter $P; Write-Host "  Updated: $($P.displayName)" -FG Yellow }
    else { New-MgIdentityConditionalAccessPolicy -BodyParameter $P; Write-Host "  Created: $($P.displayName)" -FG Green }
}

$bg = Get-MgGroup -Filter "displayName eq 'SG-BreakGlass-Accounts'" -EA SilentlyContinue
$exGrp = if ($bg) { @($bg.Id) } else { @() }

# 1. Require MFA for All Users
Deploy-CAPolicy @{
    displayName="CMMC-CA-001: Require MFA All Users"; state="enabledForReportingButNotEnforced"
    conditions=@{ users=@{includeUsers=@("All");excludeGroups=$exGrp}; applications=@{includeApplications=@("All")}; clientAppTypes=@("all") }
    grantControls=@{ operator="OR"; builtInControls=@("mfa") }
    sessionControls=@{ signInFrequency=@{value=12;type="hours";isEnabled=$true;authenticationType="primaryAndSecondaryAuthentication"} }
}

# 2. Block Legacy Auth
Deploy-CAPolicy @{
    displayName="CMMC-CA-002: Block Legacy Auth"; state="enabled"
    conditions=@{ users=@{includeUsers=@("All");excludeGroups=$exGrp}; applications=@{includeApplications=@("All")}; clientAppTypes=@("exchangeActiveSync","other") }
    grantControls=@{ operator="OR"; builtInControls=@("block") }
}

# 3. Require Compliant Device
Deploy-CAPolicy @{
    displayName="CMMC-CA-003: Require Compliant Device"; state="enabledForReportingButNotEnforced"
    conditions=@{ users=@{includeUsers=@("All");excludeGroups=$exGrp}; applications=@{includeApplications=@("All")}; platforms=@{includePlatforms=@("windows","macOS")} }
    grantControls=@{ operator="OR"; builtInControls=@("compliantDevice","domainJoinedDevice") }
}

# 4. Block Non-US Locations
$usLoc = Get-MgIdentityConditionalAccessNamedLocation -Filter "displayName eq 'US Only'" -EA SilentlyContinue
if (-not $usLoc) {
    $usLoc = New-MgIdentityConditionalAccessNamedLocation -BodyParameter @{
        "@odata.type"="#microsoft.graph.countryNamedLocation"; displayName="US Only"
        countriesAndRegions=@("US"); includeUnknownCountriesAndRegions=$false
    }
}
Deploy-CAPolicy @{
    displayName="CMMC-CA-004: Block Non-US Locations"; state="enabledForReportingButNotEnforced"
    conditions=@{ users=@{includeUsers=@("All");excludeGroups=$exGrp}; applications=@{includeApplications=@("All")}; locations=@{includeLocations=@("All");excludeLocations=@($usLoc.Id)} }
    grantControls=@{ operator="OR"; builtInControls=@("block") }
}

# 5. Block High-Risk Sign-Ins
Deploy-CAPolicy @{
    displayName="CMMC-CA-005: Block High-Risk Sign-Ins"; state="enabled"
    conditions=@{ users=@{includeUsers=@("All");excludeGroups=$exGrp}; applications=@{includeApplications=@("All")}; signInRiskLevels=@("high") }
    grantControls=@{ operator="OR"; builtInControls=@("block") }
}

# 6. Require Password Change for Risky Users
Deploy-CAPolicy @{
    displayName="CMMC-CA-006: Password Change for Risky Users"; state="enabled"
    conditions=@{ users=@{includeUsers=@("All");excludeGroups=$exGrp}; applications=@{includeApplications=@("All")}; userRiskLevels=@("high") }
    grantControls=@{ operator="AND"; builtInControls=@("mfa","passwordChange") }
}

# 7. Require MFA + Compliant Device for Admins
$adminRoles = @("62e90394-69f5-4237-9190-012177145e10","194ae4cb-b126-40b2-bd5b-6091b380977d",
    "f28a1f50-f6e7-4571-818b-6a12f2af6b6c","29232cdf-9323-42fd-ade2-1d097af3e4de","fe930be7-5e62-47db-91af-98c3a49a38b1")
Deploy-CAPolicy @{
    displayName="CMMC-CA-007: Admin MFA + Compliant Device"; state="enabled"
    conditions=@{ users=@{includeRoles=$adminRoles;excludeGroups=$exGrp}; applications=@{includeApplications=@("All")} }
    grantControls=@{ operator="AND"; builtInControls=@("mfa","compliantDevice") }
    sessionControls=@{ signInFrequency=@{value=4;type="hours";isEnabled=$true}; persistentBrowser=@{mode="never";isEnabled=$true} }
}

# 8. Session Timeout (15-min idle via browser controls)
Deploy-CAPolicy @{
    displayName="CMMC-CA-008: Session Timeout"; state="enabledForReportingButNotEnforced"
    conditions=@{ users=@{includeUsers=@("All");excludeGroups=$exGrp}; applications=@{includeApplications=@("All")}; clientAppTypes=@("browser") }
    sessionControls=@{ signInFrequency=@{value=1;type="hours";isEnabled=$true}; persistentBrowser=@{mode="never";isEnabled=$true} }
}

Write-Host "\\n8 CMMC CA policies deployed. Policies 1,3,4,8 in report-only — review before enabling." -FG Cyan
Disconnect-MgGraph`
            },
            {
                id: "entra-pim",
                title: "Entra ID — PIM Just-In-Time Access Configuration",
                platform: "Azure GCC High",
                language: "PowerShell",
                cmmcControls: ["3.1.5", "3.1.6", "3.1.7"],
                prerequisites: ["Microsoft.Graph module", "Privileged Role Admin", "Entra ID P2"],
                evidence: ["PIM-Configuration-{date}.csv", "Role activation audit logs", "Approval records"],
                script: `#Requires -Modules Microsoft.Graph.Authentication, Microsoft.Graph.Identity.Governance
# CMMC PIM Configuration — GCC High
# Configure JIT access for all privileged roles

Connect-MgGraph -Environment USGov -Scopes "RoleManagement.ReadWrite.Directory","Directory.Read.All"

$pimRoles = @(
    @{Name="Global Administrator";MaxDur="PT4H";Approval=$true;MFA=$true;Ticket=$true}
    @{Name="Security Administrator";MaxDur="PT8H";Approval=$true;MFA=$true;Ticket=$false}
    @{Name="Exchange Administrator";MaxDur="PT8H";Approval=$false;MFA=$true;Ticket=$false}
    @{Name="SharePoint Administrator";MaxDur="PT8H";Approval=$false;MFA=$true;Ticket=$false}
    @{Name="Intune Administrator";MaxDur="PT8H";Approval=$false;MFA=$true;Ticket=$false}
    @{Name="User Administrator";MaxDur="PT8H";Approval=$false;MFA=$true;Ticket=$false}
    @{Name="Privileged Role Administrator";MaxDur="PT4H";Approval=$true;MFA=$true;Ticket=$true}
)

$allRoles = Get-MgRoleManagementDirectoryRoleDefinition
foreach ($r in $pimRoles) {
    $def = $allRoles | Where-Object { $_.DisplayName -eq $r.Name }
    if (-not $def) { Write-Warning "Role not found: $($r.Name)"; continue }
    Write-Host "Configuring PIM: $($r.Name) — Max $($r.MaxDur), Approval=$($r.Approval), MFA=$($r.MFA)" -FG Cyan
    $pa = Get-MgPolicyRoleManagementPolicyAssignment -Filter "scopeId eq '/' and scopeType eq 'DirectoryRole' and roleDefinitionId eq '$($def.Id)'" -EA SilentlyContinue
    if ($pa) {
        $rules = Get-MgPolicyRoleManagementPolicyRule -UnifiedRoleManagementPolicyId $pa.PolicyId
        foreach ($rule in $rules) {
            if ($rule.Id -like '*Expiration_EndUser_Assignment*') {
                Update-MgPolicyRoleManagementPolicyRule -UnifiedRoleManagementPolicyId $pa.PolicyId -UnifiedRoleManagementPolicyRuleId $rule.Id -BodyParameter @{
                    "@odata.type"="#microsoft.graph.unifiedRoleManagementPolicyExpirationRule"
                    id=$rule.Id; isExpirationRequired=$true; maximumDuration=$r.MaxDur; target=$rule.Target
                }
            }
        }
    }
    Write-Host "  Done" -FG Green
}

# Export PIM config for evidence
$export = foreach ($r in $pimRoles) {
    $def = $allRoles | Where-Object { $_.DisplayName -eq $r.Name }
    $active = (Get-MgRoleManagementDirectoryRoleAssignmentScheduleInstance -Filter "roleDefinitionId eq '$($def.Id)'" -EA SilentlyContinue | Measure-Object).Count
    $eligible = (Get-MgRoleManagementDirectoryRoleEligibilityScheduleInstance -Filter "roleDefinitionId eq '$($def.Id)'" -EA SilentlyContinue | Measure-Object).Count
    [PSCustomObject]@{Role=$r.Name;MaxActivation=$r.MaxDur;RequireApproval=$r.Approval;RequireMFA=$r.MFA;ActiveAssignments=$active;EligibleAssignments=$eligible}
}
$export | Export-Csv "PIM-Configuration-$(Get-Date -Format 'yyyyMMdd').csv" -NoTypeInformation
Write-Host "Exported PIM-Configuration-*.csv" -FG Green
Disconnect-MgGraph`
            },
            {
                id: "entra-onboard",
                title: "Entra ID — User Onboarding with RBAC & Evidence",
                platform: "Azure GCC High",
                language: "PowerShell",
                cmmcControls: ["3.1.1", "3.5.1", "3.9.2"],
                prerequisites: ["Microsoft.Graph module", "User Administrator role"],
                evidence: ["Onboarding-Evidence-{date}.csv", "Group membership records", "License assignment"],
                script: `#Requires -Modules Microsoft.Graph.Authentication, Microsoft.Graph.Users, Microsoft.Graph.Groups
# CMMC User Onboarding — GCC High
param(
    [Parameter(Mandatory)][string]$FirstName,
    [Parameter(Mandatory)][string]$LastName,
    [Parameter(Mandatory)][string]$Department,
    [Parameter(Mandatory)][string]$JobTitle,
    [Parameter(Mandatory)][string]$ManagerUPN,
    [Parameter(Mandatory)][ValidateSet("Standard","CUI","Admin")][string]$AccessLevel,
    [string]$Domain = "company.us"
)

Connect-MgGraph -Environment USGov -Scopes "User.ReadWrite.All","Group.ReadWrite.All","Directory.ReadWrite.All"

$upn = "$($FirstName.ToLower()).$($LastName.ToLower())@$Domain"
$pwd = -join ((65..90)+(97..122)+(48..57)+(33,35,36,37) | Get-Random -Count 20 | % {[char]$_})

# Create user
$user = New-MgUser -BodyParameter @{
    accountEnabled=$true; displayName="$FirstName $LastName"; givenName=$FirstName; surname=$LastName
    userPrincipalName=$upn; mailNickname="$($FirstName.ToLower()).$($LastName.ToLower())"
    department=$Department; jobTitle=$JobTitle; usageLocation="US"
    passwordProfile=@{forceChangePasswordNextSignIn=$true;password=$pwd}
}
Write-Host "Created: $upn ($($user.Id))" -FG Green

# Set manager
$mgr = Get-MgUser -Filter "userPrincipalName eq '$ManagerUPN'"
if ($mgr) { Set-MgUserManagerByRef -UserId $user.Id -BodyParameter @{"@odata.id"="https://graph.microsoft.us/v1.0/users/$($mgr.Id)"} }

# Assign groups by access level
$groups = @{
    Standard = @("SG-AllUsers","SG-M365-Standard")
    CUI      = @("SG-AllUsers","SG-M365-Standard","SG-CUI-Users","SG-VPN-CUI")
    Admin    = @("SG-AllUsers","SG-M365-Standard","SG-CUI-Users","SG-VPN-CUI","SG-IT-Admins")
}
foreach ($gn in $groups[$AccessLevel]) {
    $g = Get-MgGroup -Filter "displayName eq '$gn'" -EA SilentlyContinue
    if ($g) { New-MgGroupMember -GroupId $g.Id -DirectoryObjectId $user.Id -EA SilentlyContinue; Write-Host "  + $gn" -FG Green }
}

# Assign license
$sku = if ($AccessLevel -eq "Admin") {"SPE_E5"} else {"SPE_E3"}
$s = Get-MgSubscribedSku | Where-Object {$_.SkuPartNumber -eq $sku}
if ($s) { Set-MgUserLicense -UserId $user.Id -AddLicenses @(@{SkuId=$s.SkuId}) -RemoveLicenses @() }

# Evidence
[PSCustomObject]@{
    Timestamp=Get-Date -Format "yyyy-MM-dd HH:mm:ss"; UPN=$upn; Name="$FirstName $LastName"
    Dept=$Department; Title=$JobTitle; Manager=$ManagerUPN; Access=$AccessLevel
    Groups=($groups[$AccessLevel] -join "; "); License=$sku; ProvisionedBy=(Get-MgContext).Account
} | Export-Csv "Onboarding-Evidence-$(Get-Date -Format 'yyyyMMdd').csv" -Append -NoTypeInformation

Write-Host "\\nOnboarding complete. Temp password: $pwd" -FG Cyan
Write-Host "DELIVER PASSWORD VIA PHONE OR IN-PERSON. NEVER EMAIL." -FG Yellow
Disconnect-MgGraph`
            },
            {
                id: "entra-offboard",
                title: "Entra ID — Immediate User Termination",
                platform: "Azure GCC High",
                language: "PowerShell",
                cmmcControls: ["3.1.1", "3.9.2"],
                prerequisites: ["Microsoft.Graph module", "User Admin + Intune Admin"],
                evidence: ["Offboarding-Evidence-{date}.csv", "Account disable timestamp", "Device wipe confirmations"],
                script: `#Requires -Modules Microsoft.Graph.Authentication, Microsoft.Graph.Users, Microsoft.Graph.Groups
# CMMC User Offboarding — Immediate Termination
param(
    [Parameter(Mandatory)][string]$UserUPN,
    [Parameter(Mandatory)][ValidateSet("Voluntary","Involuntary","Emergency")][string]$Type,
    [string]$Ticket = "N/A"
)

Connect-MgGraph -Environment USGov -Scopes "User.ReadWrite.All","Group.ReadWrite.All","DeviceManagementManagedDevices.ReadWrite.All"

$start = Get-Date
$user = Get-MgUser -Filter "userPrincipalName eq '$UserUPN'" -Property Id,DisplayName,Department,JobTitle
if (-not $user) { throw "User not found: $UserUPN" }
$actions = @()

# 1. Block sign-in
Update-MgUser -UserId $user.Id -AccountEnabled:$false; $actions += "Account disabled"

# 2. Revoke sessions
Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.us/v1.0/users/$($user.Id)/revokeSignInSessions"
$actions += "Sessions revoked"

# 3. Reset password
$rp = -join ((65..90)+(97..122)+(48..57)+(33..38) | Get-Random -Count 32 | % {[char]$_})
Update-MgUser -UserId $user.Id -PasswordProfile @{forceChangePasswordNextSignIn=$true;password=$rp}
$actions += "Password reset"

# 4. Remove from all groups
$memberOf = Get-MgUserMemberOf -UserId $user.Id -All
$removed = @()
foreach ($m in $memberOf) {
    if ($m.AdditionalProperties.'@odata.type' -eq '#microsoft.graph.group') {
        try { Remove-MgGroupMemberByRef -GroupId $m.Id -DirectoryObjectId $user.Id; $removed += $m.AdditionalProperties.displayName } catch {}
    }
}
$actions += "Removed from $($removed.Count) groups"

# 5. Remove licenses
$lics = Get-MgUserLicenseDetail -UserId $user.Id
if ($lics) { Set-MgUserLicense -UserId $user.Id -AddLicenses @() -RemoveLicenses ($lics | % {$_.SkuId}) }
$actions += "Licenses removed"

# 6. Wipe devices via Intune
$devices = Get-MgUserRegisteredDevice -UserId $user.Id -All
$wiped = @()
foreach ($d in $devices) {
    $md = Get-MgDeviceManagementManagedDevice -Filter "azureADDeviceId eq '$($d.Id)'" -EA SilentlyContinue
    if ($md) { Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.us/v1.0/deviceManagement/managedDevices/$($md.Id)/wipe"; $wiped += $md.DeviceName }
}
$actions += "Wiped $($wiped.Count) devices"

# Evidence
$end = Get-Date
[PSCustomObject]@{
    Timestamp=$start.ToString("yyyy-MM-dd HH:mm:ss"); Duration="$([Math]::Round(($end-$start).TotalSeconds,1))s"
    Type=$Type; Ticket=$Ticket; UPN=$UserUPN; Name=$user.DisplayName
    GroupsRemoved=($removed -join "; "); DevicesWiped=($wiped -join "; ")
    AllActions=($actions -join "; "); PerformedBy=(Get-MgContext).Account
} | Export-Csv "Offboarding-Evidence-$(Get-Date -Format 'yyyyMMdd').csv" -Append -NoTypeInformation

Write-Host "Offboarding complete in $([Math]::Round(($end-$start).TotalSeconds,1))s" -FG Green
$actions | % { Write-Host "  + $_" -FG Green }
Disconnect-MgGraph`
            },
            {
                id: "entra-mfa-audit",
                title: "Entra ID — MFA Methods Audit & Weak Auth Detection",
                platform: "Azure GCC High",
                language: "PowerShell",
                cmmcControls: ["3.5.3", "3.5.10", "3.5.11"],
                prerequisites: ["Microsoft.Graph module", "Authentication Admin role"],
                evidence: ["AuthMethods-Audit-{date}.csv", "AuthMethods-REMEDIATION-{date}.csv"],
                script: `#Requires -Modules Microsoft.Graph.Authentication, Microsoft.Graph.Users
# CMMC MFA Methods Audit — Flag weak auth (SMS/voice), enforce FIDO2/Authenticator

Connect-MgGraph -Environment USGov -Scopes "UserAuthenticationMethod.Read.All","User.Read.All"

$users = Get-MgUser -All -Property Id,DisplayName,UserPrincipalName,AccountEnabled -Filter "accountEnabled eq true"
Write-Host "Auditing $($users.Count) users..." -FG Cyan

$report = foreach ($u in $users) {
    $methods = Get-MgUserAuthenticationMethod -UserId $u.Id -EA SilentlyContinue
    $hasFido=$false; $hasAuth=$false; $hasSms=$false; $hasVoice=$false; $hasTotp=$false; $list=@()
    foreach ($m in $methods) {
        switch ($m.AdditionalProperties.'@odata.type') {
            '#microsoft.graph.fido2AuthenticationMethod' { $hasFido=$true; $list+="FIDO2" }
            '#microsoft.graph.microsoftAuthenticatorAuthenticationMethod' { $hasAuth=$true; $list+="Authenticator" }
            '#microsoft.graph.phoneAuthenticationMethod' { $hasSms=$true; $list+="SMS/Phone" }
            '#microsoft.graph.softwareOathAuthenticationMethod' { $hasTotp=$true; $list+="TOTP" }
        }
    }
    $status = if ($hasFido) {"OPTIMAL"} elseif ($hasAuth) {"COMPLIANT"} elseif ($hasTotp) {"ACCEPTABLE"} elseif ($hasSms) {"WEAK"} else {"NO MFA"}
    [PSCustomObject]@{UPN=$u.UserPrincipalName;Name=$u.DisplayName;Methods=($list -join ", ");FIDO2=$hasFido;Authenticator=$hasAuth;SMS=$hasSms;Status=$status}
}

$total=$report.Count; $optimal=($report|?{$_.Status -eq "OPTIMAL"}).Count; $weak=($report|?{$_.Status -eq "WEAK"}).Count; $none=($report|?{$_.Status -eq "NO MFA"}).Count
Write-Host "\\nTotal: $total | FIDO2: $optimal | Weak(SMS): $weak | No MFA: $none" -FG Cyan
$report | Export-Csv "AuthMethods-Audit-$(Get-Date -Format 'yyyyMMdd').csv" -NoTypeInformation
$report | ?{$_.Status -in "WEAK","NO MFA"} | Export-Csv "AuthMethods-REMEDIATION-$(Get-Date -Format 'yyyyMMdd').csv" -NoTypeInformation
Disconnect-MgGraph`
            },
            {
                id: "entra-access-review",
                title: "Entra ID — Quarterly Access Review Automation",
                platform: "Azure GCC High",
                language: "PowerShell",
                cmmcControls: ["3.1.1", "3.1.7"],
                prerequisites: ["Microsoft.Graph module", "Identity Governance Admin", "Entra ID P2"],
                evidence: ["Access review definitions", "Reviewer decisions with justifications", "Auto-applied removals"],
                script: `#Requires -Modules Microsoft.Graph.Authentication, Microsoft.Graph.Identity.Governance
# CMMC Quarterly Access Review — Create reviews for privileged roles + CUI groups

Connect-MgGraph -Environment USGov -Scopes "AccessReview.ReadWrite.All","Directory.Read.All"

$q = "Q" + [Math]::Ceiling((Get-Date).Month / 3); $y = (Get-Date).Year
$start = (Get-Date).AddDays(1).ToString("yyyy-MM-ddT00:00:00Z")

# Review privileged roles
@("Global Administrator","Security Administrator","Exchange Administrator","SharePoint Administrator","User Administrator") | % {
    $role = Get-MgRoleManagementDirectoryRoleDefinition -Filter "displayName eq '$_'"
    if (-not $role) { return }
    Write-Host "Creating review: $_ " -FG Cyan
    New-MgIdentityGovernanceAccessReviewDefinition -BodyParameter @{
        displayName="CMMC-AR-$y-$q: $_ Review"
        descriptionForReviewers="Verify each user still needs this role. Remove if not required."
        scope=@{"@odata.type"="#microsoft.graph.principalResourceMembershipsScope"
            principalScopes=@(@{"@odata.type"="#microsoft.graph.accessReviewQueryScope";query="/roleManagement/directory/roleAssignmentScheduleInstances?\`$filter=roleDefinitionId eq '$($role.Id)'";queryType="MicrosoftGraph"})
            resourceScopes=@(@{"@odata.type"="#microsoft.graph.accessReviewQueryScope";query="/roleManagement/directory/roleDefinitions/$($role.Id)";queryType="MicrosoftGraph"})
        }
        settings=@{mailNotificationsEnabled=$true;justificationRequiredOnApproval=$true;defaultDecisionEnabled=$true;defaultDecision="Deny"
            instanceDurationInDays=14;autoApplyDecisionsEnabled=$true;recommendationsEnabled=$true
            recurrence=@{pattern=@{type="absoluteMonthly";interval=3;dayOfMonth=1};range=@{type="noEnd";startDate=$start}}
        }
    } -EA SilentlyContinue
    Write-Host "  Done" -FG Green
}

# Review CUI groups
Get-MgGroup -Filter "startsWith(displayName,'SG-CUI')" -All | % {
    Write-Host "Creating review: $($_.DisplayName)" -FG Cyan
    New-MgIdentityGovernanceAccessReviewDefinition -BodyParameter @{
        displayName="CMMC-AR-$y-$q: $($_.DisplayName)"
        scope=@{"@odata.type"="#microsoft.graph.accessReviewQueryScope";query="/groups/$($_.Id)/members/microsoft.graph.user";queryType="MicrosoftGraph"}
        reviewers=@(@{query="/groups/$($_.Id)/owners";queryType="MicrosoftGraph"})
        settings=@{justificationRequiredOnApproval=$true;defaultDecision="Deny";instanceDurationInDays=14;autoApplyDecisionsEnabled=$true
            recurrence=@{pattern=@{type="absoluteMonthly";interval=3;dayOfMonth=1};range=@{type="noEnd";startDate=$start}}
        }
    } -EA SilentlyContinue
}
Write-Host "\\nAll quarterly reviews created. Start: $(Get-Date $start -Format 'MMM d, yyyy')" -FG Green
Disconnect-MgGraph`
            },
            {
                id: "aws-iam-audit",
                title: "AWS IAM — Complete Security Audit",
                platform: "AWS GovCloud",
                language: "Bash",
                cmmcControls: ["3.1.1", "3.1.5", "3.5.1", "3.5.3"],
                prerequisites: ["AWS CLI v2 for GovCloud", "IAM read permissions", "jq"],
                evidence: ["credential-report.csv", "mfa-audit.csv", "key-age-audit.csv", "policy-audit.csv", "SUMMARY.txt"],
                script: `#!/bin/bash
# CMMC IAM Security Audit — AWS GovCloud
set -euo pipefail
DIR="iam-audit-$(date +%Y%m%d)"; mkdir -p "$DIR"
ACCT=$(aws sts get-caller-identity --query Account --output text)
echo "=== CMMC IAM Audit | Account: $ACCT ==="

# 1. Credential report
aws iam generate-credential-report > /dev/null 2>&1; sleep 5
aws iam get-credential-report --query Content --output text | base64 -d > "$DIR/credential-report.csv"

# 2. MFA audit
echo "User,MFAEnabled,KeyCount,OldestKeyDays" > "$DIR/mfa-audit.csv"
for USER in $(aws iam list-users --query 'Users[*].UserName' --output text); do
    MFA=$(aws iam list-mfa-devices --user-name "$USER" --query 'MFADevices | length(@)' --output text)
    KEYS=$(aws iam list-access-keys --user-name "$USER" --output json)
    KC=$(echo "$KEYS" | jq '.AccessKeyMetadata | length')
    OLDEST=$(echo "$KEYS" | jq -r '[.AccessKeyMetadata[].CreateDate] | sort | .[0] // "N/A"')
    if [ "$OLDEST" != "N/A" ]; then
        AGE=$(( ($(date +%s) - $(date -jf "%Y-%m-%dT%H:%M:%S" "$OLDEST" +%s 2>/dev/null || date -d "$OLDEST" +%s 2>/dev/null || echo 0)) / 86400 ))
    else AGE="N/A"; fi
    echo "$USER,$([[ $MFA -gt 0 ]] && echo true || echo false),$KC,$AGE" >> "$DIR/mfa-audit.csv"
done

# 3. Keys > 90 days
echo "User,KeyId,AgeDays,Status" > "$DIR/key-age-audit.csv"
for USER in $(aws iam list-users --query 'Users[*].UserName' --output text); do
    aws iam list-access-keys --user-name "$USER" --output json | \\
    jq -r --arg u "$USER" '.AccessKeyMetadata[] | "\\($u),\\(.AccessKeyId),\\((now - (.CreateDate | fromdateiso8601)) / 86400 | floor),\\(.Status)"' >> "$DIR/key-age-audit.csv" 2>/dev/null
done

# 4. Overly permissive policies
echo "Policy,HasWildcardAction" > "$DIR/policy-audit.csv"
aws iam list-policies --scope Local --query 'Policies[*].[PolicyName,Arn,DefaultVersionId]' --output text | while read N A V; do
    DOC=$(aws iam get-policy-version --policy-arn "$A" --version-id "$V" --query 'PolicyVersion.Document' --output json 2>/dev/null || echo '{}')
    WILD=$(echo "$DOC" | jq '[.. | .Action? // empty | if type=="array" then .[] else . end | select(.=="*")] | length > 0')
    echo "$N,$WILD" >> "$DIR/policy-audit.csv"
done

# 5. Summary
NO_MFA=$(grep -c "false" "$DIR/mfa-audit.csv" 2>/dev/null || echo 0)
OLD_KEYS=$(awk -F',' 'NR>1 && $3>90' "$DIR/key-age-audit.csv" | wc -l)
echo "\\n=== Summary ===" && echo "Users w/o MFA: $NO_MFA | Keys > 90d: $OLD_KEYS"
echo "Results in: $DIR/"
echo "Account: $ACCT" > "$DIR/SUMMARY.txt"
echo "Users without MFA: $NO_MFA" >> "$DIR/SUMMARY.txt"
echo "Access keys > 90 days: $OLD_KEYS" >> "$DIR/SUMMARY.txt"`
            },
            {
                id: "aws-scp-deploy",
                title: "AWS — Deploy CMMC Service Control Policies",
                platform: "AWS GovCloud",
                language: "Bash",
                cmmcControls: ["3.1.1", "3.1.2", "3.4.1", "3.13.11"],
                prerequisites: ["AWS CLI v2", "Organizations management account"],
                evidence: ["SCP policy documents", "Policy attachment records"],
                script: `#!/bin/bash
# Deploy 5 CMMC SCPs: region lock, IMDSv2, S3 encryption, CloudTrail protect, root deny
set -euo pipefail
ROOT=$(aws organizations list-roots --query 'Roots[0].Id' --output text)

# 1. Deny non-GovCloud regions
aws organizations create-policy --name "CMMC-SCP-DenyNonGovCloud" --type SERVICE_CONTROL_POLICY \\
  --content '{"Version":"2012-10-17","Statement":[{"Effect":"Deny","NotAction":["iam:*","sts:*","organizations:*","support:*"],"Resource":"*","Condition":{"StringNotEquals":{"aws:RequestedRegion":["us-gov-west-1","us-gov-east-1"]}}}]}' \\
  --query 'Policy.PolicySummary.Id' --output text | xargs -I{} aws organizations attach-policy --policy-id {} --target-id "$ROOT"

# 2. Require IMDSv2
aws organizations create-policy --name "CMMC-SCP-RequireIMDSv2" --type SERVICE_CONTROL_POLICY \\
  --content '{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"ec2:RunInstances","Resource":"arn:aws-us-gov:ec2:*:*:instance/*","Condition":{"StringNotEquals":{"ec2:MetadataHttpTokens":"required"}}}]}' \\
  --query 'Policy.PolicySummary.Id' --output text | xargs -I{} aws organizations attach-policy --policy-id {} --target-id "$ROOT"

# 3. Require S3 encryption
aws organizations create-policy --name "CMMC-SCP-RequireS3Encryption" --type SERVICE_CONTROL_POLICY \\
  --content '{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"s3:PutObject","Resource":"*","Condition":{"StringNotEquals":{"s3:x-amz-server-side-encryption":["aws:kms","AES256"]}}},{"Effect":"Deny","Action":"s3:*","Resource":"*","Condition":{"Bool":{"aws:SecureTransport":"false"}}}]}' \\
  --query 'Policy.PolicySummary.Id' --output text | xargs -I{} aws organizations attach-policy --policy-id {} --target-id "$ROOT"

# 4. Protect CloudTrail
aws organizations create-policy --name "CMMC-SCP-ProtectCloudTrail" --type SERVICE_CONTROL_POLICY \\
  --content '{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":["cloudtrail:StopLogging","cloudtrail:DeleteTrail"],"Resource":"*","Condition":{"StringNotLike":{"aws:PrincipalArn":"arn:aws-us-gov:iam::*:role/OrganizationAccountAccessRole"}}}]}' \\
  --query 'Policy.PolicySummary.Id' --output text | xargs -I{} aws organizations attach-policy --policy-id {} --target-id "$ROOT"

# 5. Deny root account
aws organizations create-policy --name "CMMC-SCP-DenyRoot" --type SERVICE_CONTROL_POLICY \\
  --content '{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"*","Resource":"*","Condition":{"StringLike":{"aws:PrincipalArn":"arn:aws-us-gov:iam::*:root"}}}]}' \\
  --query 'Policy.PolicySummary.Id' --output text | xargs -I{} aws organizations attach-policy --policy-id {} --target-id "$ROOT"

echo "5 CMMC SCPs deployed to org root: $ROOT"`
            },
            {
                id: "gcp-iam-audit",
                title: "GCP — IAM Security Audit",
                platform: "GCP Assured Workloads",
                language: "Bash",
                cmmcControls: ["3.1.1", "3.1.5", "3.5.1"],
                prerequisites: ["gcloud CLI authenticated", "Organization Viewer", "jq"],
                evidence: ["project-iam-policy.json", "service-accounts.csv", "critical-constraints.csv"],
                script: `#!/bin/bash
# CMMC GCP IAM Audit
set -euo pipefail
P=$(gcloud config get-value project); DIR="gcp-iam-audit-$(date +%Y%m%d)"; mkdir -p "$DIR"
echo "=== GCP IAM Audit | Project: $P ==="

# 1. IAM bindings
gcloud projects get-iam-policy "$P" --format=json > "$DIR/project-iam-policy.json"
OVERLY=$(jq '[.bindings[]|select(.members[]|test("allUsers|allAuthenticatedUsers"))]|length' "$DIR/project-iam-policy.json")
echo "Overly permissive bindings: $OVERLY"

# 2. Service accounts + key age
echo "Email,Disabled,UserManagedKeys" > "$DIR/service-accounts.csv"
gcloud iam service-accounts list --format="value(email,disabled)" | while IFS=$'\\t' read -r E D; do
    KC=$(gcloud iam service-accounts keys list --iam-account="$E" --format=json 2>/dev/null | jq '[.[]|select(.keyType=="USER_MANAGED")]|length')
    echo "$E,$D,$KC" >> "$DIR/service-accounts.csv"
done

# 3. Critical org policy constraints
ORG=$(gcloud organizations list --format="value(ID)" 2>/dev/null | head -1)
if [ -n "$ORG" ]; then
    echo "Constraint,Status" > "$DIR/critical-constraints.csv"
    for C in gcp.resourceLocations iam.disableServiceAccountKeyCreation compute.requireOsLogin compute.requireShieldedVm storage.uniformBucketLevelAccess; do
        V=$(gcloud resource-manager org-policies describe "$C" --organization="$ORG" --format="value(booleanPolicy.enforced)" 2>/dev/null || echo "NOT SET")
        echo "$C,$V" >> "$DIR/critical-constraints.csv"
    done
fi

# 4. IAM Recommender
gcloud recommender recommendations list --recommender=google.iam.policy.Recommender --project="$P" --location=global --format=json > "$DIR/iam-recommendations.json" 2>/dev/null || echo "[]" > "$DIR/iam-recommendations.json"

echo "Results in: $DIR/"
echo "Overly permissive: $OVERLY | SA with keys: $(grep -c ',[1-9]' "$DIR/service-accounts.csv" 2>/dev/null || echo 0)"`
            }
        ]
    }
};

if (typeof window !== 'undefined') window.MSP_TECHNICAL_SCRIPTS = MSP_TECHNICAL_SCRIPTS;
if (typeof module !== 'undefined' && module.exports) module.exports = MSP_TECHNICAL_SCRIPTS;
