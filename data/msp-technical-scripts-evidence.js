// MSP/MSSP Technical Scripts — Part 6: Evidence Collection
// CMMC Controls: All families (3.1-3.14)
const MSP_TECHNICAL_SCRIPTS_EVIDENCE = {
  version: "1.0.0",
  evidence: {
    title: "Evidence Collection Automation Scripts",
    description: "Automated evidence gathering for every CMMC L2 control family with assessment-ready packaging.",
    subsections: [
      {
        id: "evidence-master",
        title: "Master Evidence Collector — Azure GCC High",
        platform: "Azure GCC High",
        language: "PowerShell",
        cmmcControls: ["3.1.1","3.3.1","3.4.1","3.5.1","3.13.1","3.14.1"],
        prerequisites: ["Microsoft.Graph module","Az module","Admin roles"],
        evidence: ["Full evidence package per family","SHA256 manifest"],
        script: `#Requires -Modules Microsoft.Graph.Authentication
# CMMC Master Evidence Collection — All 14 Control Families
param([string]$Out="C:\\CMMC-Evidence",[string]$Tenant="company")

Connect-MgGraph -Environment USGov -Scopes @(
    "User.Read.All","Group.Read.All","Policy.Read.All","AuditLog.Read.All",
    "DeviceManagementConfiguration.Read.All","DeviceManagementManagedDevices.Read.All",
    "RoleManagement.Read.All","AccessReview.Read.All","SecurityEvents.Read.All"
)
$ts=Get-Date -Format yyyyMMdd; $root="$Out\\$Tenant-$ts"; $manifest=@()

function Collect-Evidence {
    param([string]$Family,[string]$Control,[string]$Name,[scriptblock]$Action)
    $dir="$root\\$Family"; New-Item -Path $dir -ItemType Directory -Force|Out-Null
    try {
        & $Action|Out-Null
        $hash=if(Test-Path "$dir\\$Name"){(Get-FileHash "$dir\\$Name" SHA256).Hash}else{"N/A"}
        $script:manifest+=[PSCustomObject]@{Family=$Family;Control=$Control;File=$Name;Status="OK";Hash=$hash;Time=Get-Date}
        Write-Host "  [OK] $Family/$Name" -FG Green
    } catch {
        $script:manifest+=[PSCustomObject]@{Family=$Family;Control=$Control;File=$Name;Status="FAIL: $_";Hash="N/A";Time=Get-Date}
        Write-Host "  [FAIL] $Family/$Name" -FG Red
    }
}

Write-Host "=== CMMC Evidence Collection ===" -FG Cyan

# --- 3.1 ACCESS CONTROL ---
Write-Host "[3.1] Access Control" -FG Cyan
Collect-Evidence "3.1-AccessControl" "3.1.1" "CA-Policies.json" {
    (Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/identity/conditionalAccess/policies").value |
        ConvertTo-Json -Depth 10 | Out-File "$root\\3.1-AccessControl\\CA-Policies.json"
}
Collect-Evidence "3.1-AccessControl" "3.1.1" "Users-All.csv" {
    Get-MgUser -All -Property DisplayName,UserPrincipalName,AccountEnabled,Department,JobTitle,CreatedDateTime |
        Export-Csv "$root\\3.1-AccessControl\\Users-All.csv" -NoTypeInformation
}
Collect-Evidence "3.1-AccessControl" "3.1.5" "RoleAssignments.csv" {
    Get-MgRoleManagementDirectoryRoleAssignmentScheduleInstance -All |
        Export-Csv "$root\\3.1-AccessControl\\RoleAssignments.csv" -NoTypeInformation
}
Collect-Evidence "3.1-AccessControl" "3.1.5" "PIM-Eligible.csv" {
    Get-MgRoleManagementDirectoryRoleEligibilityScheduleInstance -All |
        Export-Csv "$root\\3.1-AccessControl\\PIM-Eligible.csv" -NoTypeInformation
}
Collect-Evidence "3.1-AccessControl" "3.1.7" "AccessReviews.json" {
    (Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/identityGovernance/accessReviews/definitions").value |
        ConvertTo-Json -Depth 5 | Out-File "$root\\3.1-AccessControl\\AccessReviews.json"
}
Collect-Evidence "3.1-AccessControl" "3.1.1" "Groups-Security.csv" {
    Get-MgGroup -All -Filter "securityEnabled eq true" -Property DisplayName,Id,Description,CreatedDateTime |
        Export-Csv "$root\\3.1-AccessControl\\Groups-Security.csv" -NoTypeInformation
}
Collect-Evidence "3.1-AccessControl" "3.1.12" "NamedLocations.json" {
    (Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/identity/conditionalAccess/namedLocations").value |
        ConvertTo-Json -Depth 5 | Out-File "$root\\3.1-AccessControl\\NamedLocations.json"
}

# --- 3.3 AUDIT & ACCOUNTABILITY ---
Write-Host "[3.3] Audit & Accountability" -FG Cyan
Collect-Evidence "3.3-Audit" "3.3.1" "AuditLogs-Recent.json" {
    (Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/auditLogs/directoryAudits?\$top=999").value |
        ConvertTo-Json -Depth 5 | Out-File "$root\\3.3-Audit\\AuditLogs-Recent.json"
}
Collect-Evidence "3.3-Audit" "3.3.1" "SignInLogs-Recent.csv" {
    (Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/auditLogs/signIns?\$top=999").value |
        ForEach-Object { [PSCustomObject]@{Time=$_.createdDateTime;User=$_.userPrincipalName;App=$_.appDisplayName;IP=$_.ipAddress;Status=$_.status.errorCode} } |
        Export-Csv "$root\\3.3-Audit\\SignInLogs-Recent.csv" -NoTypeInformation
}

# --- 3.4 CONFIGURATION MANAGEMENT ---
Write-Host "[3.4] Configuration Management" -FG Cyan
Collect-Evidence "3.4-ConfigMgmt" "3.4.1" "CompliancePolicies.json" {
    (Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/deviceManagement/deviceCompliancePolicies").value |
        ConvertTo-Json -Depth 5 | Out-File "$root\\3.4-ConfigMgmt\\CompliancePolicies.json"
}
Collect-Evidence "3.4-ConfigMgmt" "3.4.1" "ConfigProfiles.json" {
    (Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/deviceManagement/deviceConfigurations").value |
        ConvertTo-Json -Depth 5 | Out-File "$root\\3.4-ConfigMgmt\\ConfigProfiles.json"
}
Collect-Evidence "3.4-ConfigMgmt" "3.4.1" "DeviceStatus.csv" {
    (Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/deviceManagement/managedDevices").value |
        ForEach-Object { [PSCustomObject]@{Name=$_.deviceName;OS=$_.operatingSystem;Version=$_.osVersion;Compliance=$_.complianceState;User=$_.userPrincipalName;Encrypted=$_.isEncrypted;LastSync=$_.lastSyncDateTime} } |
        Export-Csv "$root\\3.4-ConfigMgmt\\DeviceStatus.csv" -NoTypeInformation
}

# --- 3.5 IDENTIFICATION & AUTHENTICATION ---
Write-Host "[3.5] Identification & Authentication" -FG Cyan
Collect-Evidence "3.5-IdentAuth" "3.5.3" "MFA-Registration.csv" {
    (Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/reports/authenticationMethods/userRegistrationDetails").value |
        ForEach-Object { [PSCustomObject]@{User=$_.userPrincipalName;MFARegistered=$_.isMfaRegistered;MFACapable=$_.isMfaCapable;Methods=($_.methodsRegistered -join ",")} } |
        Export-Csv "$root\\3.5-IdentAuth\\MFA-Registration.csv" -NoTypeInformation
}
Collect-Evidence "3.5-IdentAuth" "3.5.3" "AuthMethods-Policy.json" {
    Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/policies/authenticationMethodsPolicy" |
        ConvertTo-Json -Depth 5 | Out-File "$root\\3.5-IdentAuth\\AuthMethods-Policy.json"
}

# --- 3.8 MEDIA PROTECTION ---
Write-Host "[3.8] Media Protection" -FG Cyan
Collect-Evidence "3.8-MediaProtect" "3.8.1" "BitLocker-Keys.csv" {
    Get-MgInformationProtectionBitlockerRecoveryKey -All |
        Select Id,CreatedDateTime,DeviceId,VolumeType |
        Export-Csv "$root\\3.8-MediaProtect\\BitLocker-Keys.csv" -NoTypeInformation
}

# --- 3.12 SECURITY ASSESSMENT ---
Write-Host "[3.12] Security Assessment" -FG Cyan
Collect-Evidence "3.12-SecAssess" "3.12.1" "SecureScore.json" {
    Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/security/secureScores?\$top=1" |
        ConvertTo-Json -Depth 5 | Out-File "$root\\3.12-SecAssess\\SecureScore.json"
}

# --- 3.13 SYSTEM & COMMUNICATIONS PROTECTION ---
Write-Host "[3.13] System & Comms Protection" -FG Cyan
Collect-Evidence "3.13-SysComms" "3.13.1" "NSG-Rules.csv" {
    Connect-AzAccount -Environment AzureUSGovernment -EA SilentlyContinue|Out-Null
    Get-AzNetworkSecurityGroup | ForEach-Object {
        $n=$_.Name; $_.SecurityRules | Select @{N='NSG';E={$n}},Name,Priority,Direction,Access,Protocol,SourceAddressPrefix,DestinationAddressPrefix,DestinationPortRange
    } | Export-Csv "$root\\3.13-SysComms\\NSG-Rules.csv" -NoTypeInformation
}

# --- 3.14 SYSTEM & INFORMATION INTEGRITY ---
Write-Host "[3.14] System & Info Integrity" -FG Cyan
Collect-Evidence "3.14-SysInteg" "3.14.1" "SecurityAlerts.csv" {
    (Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/security/alerts?\$top=100").value |
        ForEach-Object { [PSCustomObject]@{Title=$_.title;Severity=$_.severity;Status=$_.status;Category=$_.category;Created=$_.createdDateTime} } |
        Export-Csv "$root\\3.14-SysInteg\\SecurityAlerts.csv" -NoTypeInformation
}

# --- Generate Manifest ---
Write-Host "\\nGenerating manifest..." -FG Cyan
$manifest | Export-Csv "$root\\COLLECTION-MANIFEST.csv" -NoTypeInformation
$ok=($manifest|?{$_.Status -eq "OK"}).Count; $fail=($manifest|?{$_.Status -ne "OK"}).Count
Write-Host "\\n=== Collection Complete ===" -FG Green
Write-Host "Collected: $ok | Failed: $fail | Output: $root" -FG White
Disconnect-MgGraph`
      },
      {
        id: "evidence-aws",
        title: "AWS GovCloud Evidence Collection",
        platform: "AWS GovCloud",
        language: "Bash",
        cmmcControls: ["3.1.1","3.3.1","3.4.1","3.5.1","3.13.1"],
        prerequisites: ["AWS CLI v2 for GovCloud","IAM/Config/CloudTrail read access","jq"],
        evidence: ["AWS evidence package","credential-report.csv","config-rules.json"],
        script: `#!/bin/bash
# CMMC Evidence Collection — AWS GovCloud
set -euo pipefail
DIR="aws-evidence-$(date +%Y%m%d)"; mkdir -p "$DIR"
ACCT=$(aws sts get-caller-identity --query Account --output text)
echo "=== AWS CMMC Evidence | Account: $ACCT ==="

# 3.1 Access Control
echo "[3.1] Access Control..."
aws iam generate-credential-report > /dev/null 2>&1; sleep 5
aws iam get-credential-report --query Content --output text | base64 -d > "$DIR/credential-report.csv"
aws iam list-users --output json > "$DIR/iam-users.json"
aws iam list-roles --output json > "$DIR/iam-roles.json"
aws iam list-policies --scope Local --output json > "$DIR/iam-policies.json"
aws organizations list-policies --filter SERVICE_CONTROL_POLICY --output json > "$DIR/scps.json" 2>/dev/null || true

# 3.3 Audit
echo "[3.3] Audit..."
aws cloudtrail describe-trails --output json > "$DIR/cloudtrail-config.json"
aws cloudtrail get-trail-status --name $(aws cloudtrail describe-trails --query 'trailList[0].Name' --output text) --output json > "$DIR/cloudtrail-status.json" 2>/dev/null || true
aws logs describe-log-groups --output json > "$DIR/cloudwatch-loggroups.json"

# 3.4 Configuration
echo "[3.4] Configuration..."
aws configservice describe-config-rules --output json > "$DIR/config-rules.json" 2>/dev/null || true
aws configservice describe-compliance-by-config-rule --output json > "$DIR/config-compliance.json" 2>/dev/null || true
aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PlatformDetails,Tags]' --output json > "$DIR/ec2-instances.json"

# 3.5 Authentication
echo "[3.5] Authentication..."
for USER in $(aws iam list-users --query 'Users[*].UserName' --output text); do
    MFA=$(aws iam list-mfa-devices --user-name "$USER" --query 'MFADevices|length(@)' --output text)
    echo "$USER,$MFA"
done > "$DIR/mfa-status.csv"

# 3.13 Network
echo "[3.13] Network..."
aws ec2 describe-security-groups --output json > "$DIR/security-groups.json"
aws ec2 describe-network-acls --output json > "$DIR/nacls.json"
aws ec2 describe-vpcs --output json > "$DIR/vpcs.json"
aws ec2 describe-flow-logs --output json > "$DIR/flow-logs.json"

# 3.14 Integrity
echo "[3.14] Integrity..."
aws guardduty list-detectors --output json > "$DIR/guardduty-detectors.json" 2>/dev/null || true
DETECTOR=$(aws guardduty list-detectors --query 'DetectorIds[0]' --output text 2>/dev/null || echo "")
if [ -n "$DETECTOR" ] && [ "$DETECTOR" != "None" ]; then
    aws guardduty list-findings --detector-id "$DETECTOR" --output json > "$DIR/guardduty-findings.json"
fi

# Manifest
echo "=== Manifest ===" > "$DIR/MANIFEST.txt"
for F in "$DIR"/*; do
    SHA=$(shasum -a 256 "$F" | cut -d' ' -f1)
    echo "$(basename $F)|$SHA|$(stat -f%z "$F" 2>/dev/null || stat -c%s "$F" 2>/dev/null)" >> "$DIR/MANIFEST.txt"
done

echo "\\nEvidence collected in: $DIR/"
ls -la "$DIR/" | tail -n +2 | awk '{print "  "$NF" ("$5" bytes)"}'`
      },
      {
        id: "evidence-scheduler",
        title: "Scheduled Evidence Collection (Monthly Automation)",
        platform: "Windows (Task Scheduler) / Linux (cron)",
        language: "PowerShell",
        cmmcControls: ["3.12.1","3.12.3"],
        prerequisites: ["Service account with required permissions","Network access to cloud APIs"],
        evidence: ["Monthly evidence archives","Collection run logs","Schedule configuration"],
        script: `# CMMC Scheduled Evidence Collection — Monthly Automation
# Creates Windows Task Scheduler job or outputs cron entry for Linux

param(
    [ValidateSet("Install","Run","Status")][string]$Action = "Install",
    [string]$ScriptPath = "C:\\CMMC-Scripts\\Collect-Evidence.ps1",
    [string]$OutputPath = "C:\\CMMC-Evidence",
    [int]$DayOfMonth = 1,
    [int]$Hour = 2
)

switch ($Action) {
    "Install" {
        # Create the collection script wrapper
        $wrapper = @'
# Monthly CMMC Evidence Collection Wrapper
$logFile = "C:\\CMMC-Evidence\\collection-log-$(Get-Date -Format yyyyMMdd).txt"
Start-Transcript -Path $logFile
try {
    # Run master collection
    & "C:\\CMMC-Scripts\\Collect-Evidence.ps1" -Out "C:\\CMMC-Evidence" -Tenant "company"
    
    # Archive previous month
    $prevMonth = (Get-Date).AddMonths(-1).ToString("yyyyMM")
    $archiveDir = "C:\\CMMC-Evidence\\Archives"
    New-Item -Path $archiveDir -ItemType Directory -Force | Out-Null
    Get-ChildItem "C:\\CMMC-Evidence\\company-*" -Directory | Where-Object {
        $_.Name -match "company-$prevMonth"
    } | ForEach-Object {
        $zip = "$archiveDir\\$($_.Name).zip"
        Compress-Archive -Path $_.FullName -DestinationPath $zip -Force
        $hash = (Get-FileHash $zip SHA256).Hash
        "$hash  $(Split-Path $zip -Leaf)" | Out-File "$archiveDir\\$($_.Name).sha256"
        Remove-Item $_.FullName -Recurse -Force
        Write-Host "Archived: $zip (SHA256: $hash)"
    }
    
    # Send notification
    Send-MailMessage -From "cmmc-automation@company.us" -To "security@company.us" \\
        -Subject "CMMC Evidence Collection Complete - $(Get-Date -Format yyyy-MM-dd)" \\
        -Body "Monthly evidence collection completed. Review at: C:\\CMMC-Evidence" \\
        -SmtpServer "smtp.company.us" -ErrorAction SilentlyContinue
} catch {
    Write-Error "Collection failed: $_"
} finally {
    Stop-Transcript
}
'@
        $wrapper | Out-File $ScriptPath -Force
        
        # Register scheduled task
        $taskAction = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File \`"$ScriptPath\`""
        $taskTrigger = New-ScheduledTaskTrigger -Monthly -DaysOfMonth $DayOfMonth -At "\${Hour}:00"
        $taskSettings = New-ScheduledTaskSettingsSet -RunOnlyIfNetworkAvailable -WakeToRun -AllowStartIfOnBatteries
        $taskPrincipal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
        
        Register-ScheduledTask -TaskName "CMMC-MonthlyEvidenceCollection" -Action $taskAction \\
            -Trigger $taskTrigger -Settings $taskSettings -Principal $taskPrincipal \\
            -Description "Monthly CMMC evidence collection for all control families"
        
        Write-Host "Scheduled task created: CMMC-MonthlyEvidenceCollection" -FG Green
        Write-Host "Runs: Day $DayOfMonth of each month at \${Hour}:00" -FG Cyan
        Write-Host "Script: $ScriptPath" -FG Cyan
        
        # Also output Linux cron equivalent
        Write-Host "\\nLinux cron equivalent:" -FG Yellow
        Write-Host "0 $Hour $DayOfMonth * * /usr/bin/pwsh /opt/cmmc/collect-evidence.ps1 >> /var/log/cmmc-evidence.log 2>&1"
    }
    "Status" {
        $task = Get-ScheduledTask -TaskName "CMMC-MonthlyEvidenceCollection" -EA SilentlyContinue
        if ($task) {
            $info = Get-ScheduledTaskInfo -TaskName "CMMC-MonthlyEvidenceCollection"
            Write-Host "Task: $($task.TaskName)" -FG Cyan
            Write-Host "State: $($task.State)" -FG $(if($task.State -eq "Ready"){"Green"}else{"Yellow"})
            Write-Host "Last Run: $($info.LastRunTime)" -FG White
            Write-Host "Last Result: $($info.LastTaskResult)" -FG $(if($info.LastTaskResult -eq 0){"Green"}else{"Red"})
            Write-Host "Next Run: $($info.NextRunTime)" -FG White
        } else { Write-Host "Task not found. Run with -Action Install first." -FG Red }
    }
    "Run" {
        Start-ScheduledTask -TaskName "CMMC-MonthlyEvidenceCollection"
        Write-Host "Evidence collection started. Monitor: Get-ScheduledTaskInfo CMMC-MonthlyEvidenceCollection" -FG Cyan
    }
}`
      },
      {
        id: "evidence-package",
        title: "Assessment Evidence Packager — ZIP with Manifest",
        platform: "Cross-platform",
        language: "PowerShell",
        cmmcControls: ["3.12.1"],
        prerequisites: ["Evidence already collected"],
        evidence: ["Assessment-ready ZIP package","Manifest with hashes","Control-to-evidence mapping"],
        script: `# CMMC Assessment Evidence Packager
# Creates assessment-ready ZIP with manifest, control mapping, and integrity verification
param(
    [Parameter(Mandatory)][string]$EvidencePath,
    [string]$OutputZip = "CMMC-Evidence-Package-$(Get-Date -Format yyyyMMdd).zip",
    [string]$AssessorName = "",
    [string]$CompanyName = ""
)

Write-Host "=== CMMC Evidence Packager ===" -FG Cyan

# Build control-to-evidence mapping
$mapping = @()
Get-ChildItem $EvidencePath -Recurse -File | ForEach-Object {
    $family = ($_.Directory.Name -split '-')[0]
    $mapping += [PSCustomObject]@{
        ControlFamily = $family
        FileName = $_.Name
        FullPath = $_.FullName.Replace($EvidencePath, ".")
        SizeKB = [Math]::Round($_.Length/1KB, 2)
        SHA256 = (Get-FileHash $_.FullName SHA256).Hash
        LastModified = $_.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
    }
}

# Generate mapping CSV
$mapping | Export-Csv "$EvidencePath\\EVIDENCE-MAPPING.csv" -NoTypeInformation

# Generate cover sheet
@"
================================================================
CMMC LEVEL 2 ASSESSMENT EVIDENCE PACKAGE
================================================================
Company:        $CompanyName
Prepared For:   $AssessorName
Date:           $(Get-Date -Format "yyyy-MM-dd")
Generated By:   CMMC Evidence Automation Tool v1.0

CONTENTS:
$(($mapping | Group-Object ControlFamily | ForEach-Object { "  $($_.Name): $($_.Count) files" }) -join "\`n")

TOTAL FILES:    $($mapping.Count)
TOTAL SIZE:     $([Math]::Round(($mapping | Measure-Object SizeKB -Sum).Sum / 1024, 2)) MB

INTEGRITY:
  All files hashed with SHA-256. See EVIDENCE-MAPPING.csv for verification.
  
INSTRUCTIONS:
  1. Extract ZIP to a secure location
  2. Verify hashes against EVIDENCE-MAPPING.csv
  3. Each subfolder corresponds to a CMMC control family
  4. Files are named descriptively for easy identification
================================================================
"@ | Out-File "$EvidencePath\\COVER-SHEET.txt"

# Create ZIP
Compress-Archive -Path "$EvidencePath\\*" -DestinationPath $OutputZip -Force
$zipHash = (Get-FileHash $OutputZip SHA256).Hash
"$zipHash  $OutputZip" | Out-File "$OutputZip.sha256"

Write-Host "Package: $OutputZip" -FG Green
Write-Host "SHA256: $zipHash" -FG White
Write-Host "Files: $($mapping.Count) | Size: $([Math]::Round((Get-Item $OutputZip).Length/1MB,2)) MB" -FG White`
      }
    ]
  }
};

if (typeof window !== 'undefined') window.MSP_TECHNICAL_SCRIPTS_EVIDENCE = MSP_TECHNICAL_SCRIPTS_EVIDENCE;
if (typeof module !== 'undefined' && module.exports) module.exports = MSP_TECHNICAL_SCRIPTS_EVIDENCE;
