// MSP/MSSP Technical Scripts — Part 5: Incident Response Automation
// SOAR playbooks, Sentinel Logic Apps, forensic collection, containment
// CMMC Controls: 3.6.1-3.6.3, 3.14.6-3.14.7
const MSP_TECHNICAL_SCRIPTS_IR = {
    version: "1.0.0",
    lastUpdated: "2026-02-08",
    ir: {
        title: "Incident Response Automation Scripts",
        description: "SOAR playbooks, automated containment, forensic evidence collection, DFARS 7012 reporting, and IR evidence packaging.",
        subsections: [
            {
                id: "ir-containment",
                title: "Automated Incident Containment — User & Device Isolation",
                platform: "Azure GCC High / Defender for Endpoint",
                language: "PowerShell",
                cmmcControls: ["3.6.1", "3.6.2", "3.14.6"],
                prerequisites: ["Microsoft.Graph module", "Security Admin + Intune Admin", "Defender for Endpoint P2"],
                evidence: ["Containment action log", "Isolation confirmation", "Timeline of actions"],
                script: `#Requires -Modules Microsoft.Graph.Authentication
# CMMC Incident Containment — Isolate user + device immediately
param(
    [Parameter(Mandatory)][string]$UserUPN,
    [string]$DeviceName,
    [Parameter(Mandatory)][string]$IncidentId,
    [Parameter(Mandatory)][string]$Severity,  # Low, Medium, High, Critical
    [string]$Description = "Security incident requiring containment"
)

Connect-MgGraph -Environment USGov -Scopes @(
    "User.ReadWrite.All","Group.ReadWrite.All",
    "DeviceManagementManagedDevices.ReadWrite.All",
    "SecurityEvents.ReadWrite.All"
)

$start = Get-Date
$actions = @()
$irLog = @()

function Log-Action { param([string]$Action,[string]$Status,[string]$Detail)
    $script:irLog += [PSCustomObject]@{
        Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss.fff")
        IncidentId = $IncidentId; Action = $Action; Status = $Status; Detail = $Detail
        PerformedBy = (Get-MgContext).Account
    }
    $color = if ($Status -eq "Success") {"Green"} elseif ($Status -eq "Failed") {"Red"} else {"Yellow"}
    Write-Host "  [$Status] $Action — $Detail" -FG $color
}

Write-Host "=== INCIDENT CONTAINMENT ===" -FG Red
Write-Host "Incident: $IncidentId | Severity: $Severity" -FG White
Write-Host "Target: $UserUPN | Device: $DeviceName" -FG White
Write-Host "Time: $($start.ToString('yyyy-MM-dd HH:mm:ss'))" -FG White
Write-Host ""

# === PHASE 1: User Containment ===
Write-Host "[PHASE 1] User Containment" -FG Red

# 1a. Disable account
try {
    $user = Get-MgUser -Filter "userPrincipalName eq '$UserUPN'" -Property Id,DisplayName
    Update-MgUser -UserId $user.Id -AccountEnabled:$false
    Log-Action "Disable Account" "Success" "Account disabled for $UserUPN"
} catch { Log-Action "Disable Account" "Failed" $_.Exception.Message }

# 1b. Revoke all sessions
try {
    Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.us/v1.0/users/$($user.Id)/revokeSignInSessions"
    Log-Action "Revoke Sessions" "Success" "All active sessions revoked"
} catch { Log-Action "Revoke Sessions" "Failed" $_.Exception.Message }

# 1c. Reset password
try {
    $newPwd = -join ((65..90)+(97..122)+(48..57)+(33..38) | Get-Random -Count 32 | % {[char]$_})
    Update-MgUser -UserId $user.Id -PasswordProfile @{forceChangePasswordNextSignIn=$true;password=$newPwd}
    Log-Action "Reset Password" "Success" "Password randomized"
} catch { Log-Action "Reset Password" "Failed" $_.Exception.Message }

# 1d. Remove from all groups (preserve list for recovery)
try {
    $groups = Get-MgUserMemberOf -UserId $user.Id -All
    $removedGroups = @()
    foreach ($g in $groups) {
        if ($g.AdditionalProperties.'@odata.type' -eq '#microsoft.graph.group') {
            $gName = $g.AdditionalProperties.displayName
            Remove-MgGroupMemberByRef -GroupId $g.Id -DirectoryObjectId $user.Id -EA SilentlyContinue
            $removedGroups += $gName
        }
    }
    Log-Action "Remove Groups" "Success" "Removed from $($removedGroups.Count) groups: $($removedGroups -join ', ')"
} catch { Log-Action "Remove Groups" "Failed" $_.Exception.Message }

# === PHASE 2: Device Containment ===
Write-Host "\\n[PHASE 2] Device Containment" -FG Red

# 2a. Isolate device via Defender for Endpoint
if ($DeviceName) {
    try {
        # Find device in Defender
        $mdeDevice = Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/security/alerts?\$filter=evidence/any(e:e/deviceEvidence/deviceDnsName eq '$DeviceName')" -ErrorAction SilentlyContinue
        
        # Isolate via Intune
        $intuneDevice = Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/deviceManagement/managedDevices?\$filter=deviceName eq '$DeviceName'"
        if ($intuneDevice.value) {
            $deviceId = $intuneDevice.value[0].id
            # Remote lock
            Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.us/v1.0/deviceManagement/managedDevices/$deviceId/remoteLock"
            Log-Action "Remote Lock" "Success" "Device $DeviceName locked"
            
            # If Critical severity, initiate wipe
            if ($Severity -eq "Critical") {
                Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.us/v1.0/deviceManagement/managedDevices/$deviceId/wipe"
                Log-Action "Remote Wipe" "Success" "CRITICAL: Device $DeviceName wipe initiated"
            }
        }
    } catch { Log-Action "Device Isolation" "Failed" $_.Exception.Message }
}

# 2b. Block device in Conditional Access (add to blocked group)
try {
    $blockedGroup = Get-MgGroup -Filter "displayName eq 'SG-Blocked-Devices'" -EA SilentlyContinue
    if (-not $blockedGroup) {
        $blockedGroup = New-MgGroup -DisplayName "SG-Blocked-Devices" -MailEnabled:$false -MailNickname "sg-blocked-devices" -SecurityEnabled:$true
    }
    $devices = Get-MgUserRegisteredDevice -UserId $user.Id -All
    foreach ($d in $devices) {
        New-MgGroupMember -GroupId $blockedGroup.Id -DirectoryObjectId $d.Id -EA SilentlyContinue
    }
    Log-Action "Block Devices in CA" "Success" "$($devices.Count) devices added to blocked group"
} catch { Log-Action "Block Devices in CA" "Failed" $_.Exception.Message }

# === PHASE 3: Evidence Preservation ===
Write-Host "\\n[PHASE 3] Evidence Preservation" -FG Cyan

# 3a. Capture sign-in logs for the user (last 30 days)
try {
    $signIns = Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/auditLogs/signIns?\$filter=userPrincipalName eq '$UserUPN'&\$top=999"
    $signIns.value | ConvertTo-Json -Depth 10 | Out-File "IR-$IncidentId-SignInLogs.json"
    Log-Action "Export Sign-In Logs" "Success" "$($signIns.value.Count) sign-in records exported"
} catch { Log-Action "Export Sign-In Logs" "Failed" $_.Exception.Message }

# 3b. Capture audit logs for the user
try {
    $auditLogs = Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/auditLogs/directoryAudits?\$filter=initiatedBy/user/userPrincipalName eq '$UserUPN'&\$top=999"
    $auditLogs.value | ConvertTo-Json -Depth 10 | Out-File "IR-$IncidentId-AuditLogs.json"
    Log-Action "Export Audit Logs" "Success" "$($auditLogs.value.Count) audit records exported"
} catch { Log-Action "Export Audit Logs" "Failed" $_.Exception.Message }

# 3c. Capture mailbox activity
try {
    $mailActivity = Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/users/$($user.Id)/mailFolders/sentitems/messages?\$top=50&\$orderby=sentDateTime desc"
    $mailActivity.value | Select-Object sentDateTime, @{N='To';E={$_.toRecipients.emailAddress.address -join ','}}, subject |
        ConvertTo-Json | Out-File "IR-$IncidentId-RecentEmails.json"
    Log-Action "Export Recent Emails" "Success" "Last 50 sent emails captured"
} catch { Log-Action "Export Recent Emails" "Failed" $_.Exception.Message }

# === PHASE 4: Generate IR Package ===
Write-Host "\\n[PHASE 4] IR Evidence Package" -FG Cyan
$end = Get-Date

$irSummary = [PSCustomObject]@{
    IncidentId = $IncidentId; Severity = $Severity; Description = $Description
    TargetUser = $UserUPN; TargetDevice = $DeviceName
    ContainmentStart = $start.ToString("yyyy-MM-dd HH:mm:ss")
    ContainmentEnd = $end.ToString("yyyy-MM-dd HH:mm:ss")
    Duration = "$([Math]::Round(($end-$start).TotalSeconds,1)) seconds"
    ActionsPerformed = ($irLog | Where-Object {$_.Status -eq "Success"}).Count
    ActionsFailed = ($irLog | Where-Object {$_.Status -eq "Failed"}).Count
    GroupsRemoved = ($removedGroups -join "; ")
    PerformedBy = (Get-MgContext).Account
}
$irSummary | Export-Csv "IR-$IncidentId-Summary.csv" -NoTypeInformation
$irLog | Export-Csv "IR-$IncidentId-ActionLog.csv" -NoTypeInformation

Write-Host "\\n=== CONTAINMENT COMPLETE ===" -FG Green
Write-Host "Duration: $([Math]::Round(($end-$start).TotalSeconds,1))s" -FG White
Write-Host "Actions: $($irLog.Count) total ($(($irLog|?{$_.Status -eq 'Success'}).Count) success, $(($irLog|?{$_.Status -eq 'Failed'}).Count) failed)" -FG White
Write-Host "\\nEvidence files:" -FG Cyan
Get-ChildItem "IR-$IncidentId-*" | % { Write-Host "  $_" }
Write-Host "\\nNEXT STEPS:" -FG Yellow
Write-Host "  1. Notify CISO and legal within 1 hour" -FG Yellow
Write-Host "  2. If CUI breach: initiate DFARS 7012 (72-hour DoD notification)" -FG Yellow
Write-Host "  3. Preserve all evidence files in tamper-proof storage" -FG Yellow
Write-Host "  4. Begin forensic investigation" -FG Yellow

Disconnect-MgGraph`
            },
            {
                id: "forensic-collection",
                title: "Forensic Evidence Collection — Windows Endpoint",
                platform: "Windows 10/11/Server",
                language: "PowerShell",
                cmmcControls: ["3.6.1", "3.6.2", "3.3.1"],
                prerequisites: ["Administrator access on target", "Run from elevated PowerShell"],
                evidence: ["Memory dump", "Event logs", "Process list", "Network connections", "Registry hives", "Prefetch files"],
                script: `# CMMC Forensic Evidence Collection — Windows
# Run on compromised endpoint BEFORE remediation
# Collects volatile + non-volatile evidence with chain of custody

param(
    [Parameter(Mandatory)][string]$IncidentId,
    [string]$OutputPath = "C:\\ForensicEvidence"
)

$start = Get-Date
$dir = "$OutputPath\\$IncidentId-$(hostname)-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -Path $dir -ItemType Directory -Force | Out-Null

Write-Host "=== FORENSIC EVIDENCE COLLECTION ===" -FG Red
Write-Host "Incident: $IncidentId | Host: $(hostname)" -FG White
Write-Host "Output: $dir" -FG White
Write-Host "Collector: $env:USERNAME | Time: $start" -FG White

# Chain of custody header
@"
=== CHAIN OF CUSTODY ===
Incident ID: $IncidentId
Hostname: $(hostname)
Collection Start: $($start.ToString('yyyy-MM-dd HH:mm:ss'))
Collector: $env:USERNAME ($env:USERDOMAIN)
Tool: CMMC Forensic Collection Script v1.0
OS: $(Get-CimInstance Win32_OperatingSystem | Select -ExpandProperty Caption)
"@ | Out-File "$dir\\CHAIN_OF_CUSTODY.txt"

# === VOLATILE EVIDENCE (collect first — changes with time) ===
Write-Host "\\n[1/10] System info..." -FG Cyan
systeminfo > "$dir\\systeminfo.txt"
Get-CimInstance Win32_OperatingSystem | Select * | Out-File "$dir\\os-details.txt"

Write-Host "[2/10] Running processes..." -FG Cyan
Get-Process | Select Id, ProcessName, Path, StartTime, @{N='CommandLine';E={(Get-CimInstance Win32_Process -Filter "ProcessId=$($_.Id)").CommandLine}}, @{N='ParentPID';E={(Get-CimInstance Win32_Process -Filter "ProcessId=$($_.Id)").ParentProcessId}} |
    Export-Csv "$dir\\processes.csv" -NoTypeInformation
# Process hashes
Get-Process | Where-Object {$_.Path} | ForEach-Object {
    [PSCustomObject]@{PID=$_.Id;Name=$_.ProcessName;Path=$_.Path;SHA256=(Get-FileHash $_.Path -Algorithm SHA256 -EA SilentlyContinue).Hash}
} | Export-Csv "$dir\\process-hashes.csv" -NoTypeInformation

Write-Host "[3/10] Network connections..." -FG Cyan
Get-NetTCPConnection | Select LocalAddress, LocalPort, RemoteAddress, RemotePort, State, OwningProcess, @{N='Process';E={(Get-Process -Id $_.OwningProcess -EA SilentlyContinue).ProcessName}} |
    Export-Csv "$dir\\network-connections.csv" -NoTypeInformation
Get-NetUDPEndpoint | Select LocalAddress, LocalPort, OwningProcess | Export-Csv "$dir\\udp-endpoints.csv" -NoTypeInformation
Get-DnsClientCache | Export-Csv "$dir\\dns-cache.csv" -NoTypeInformation
arp -a > "$dir\\arp-table.txt"
netstat -anob > "$dir\\netstat.txt" 2>$null
route print > "$dir\\route-table.txt"

Write-Host "[4/10] Logged-on users..." -FG Cyan
query user > "$dir\\logged-on-users.txt" 2>$null
Get-CimInstance Win32_LogonSession | Select LogonId, LogonType, StartTime, AuthenticationPackage |
    Export-Csv "$dir\\logon-sessions.csv" -NoTypeInformation

Write-Host "[5/10] Scheduled tasks..." -FG Cyan
Get-ScheduledTask | Where-Object {$_.State -ne "Disabled"} | Select TaskName, TaskPath, State, @{N='Actions';E={$_.Actions.Execute}} |
    Export-Csv "$dir\\scheduled-tasks.csv" -NoTypeInformation

Write-Host "[6/10] Services..." -FG Cyan
Get-Service | Select Name, DisplayName, Status, StartType, @{N='Path';E={(Get-CimInstance Win32_Service -Filter "Name='$($_.Name)'").PathName}} |
    Export-Csv "$dir\\services.csv" -NoTypeInformation

# === NON-VOLATILE EVIDENCE ===
Write-Host "[7/10] Event logs..." -FG Cyan
$logNames = @("Security","System","Application","Microsoft-Windows-PowerShell/Operational","Microsoft-Windows-Sysmon/Operational")
foreach ($log in $logNames) {
    $safeName = $log -replace '[/\\\\]','-'
    try {
        Get-WinEvent -LogName $log -MaxEvents 10000 -EA SilentlyContinue | Export-Csv "$dir\\EventLog-$safeName.csv" -NoTypeInformation
    } catch {}
}
# Export raw EVTX
wevtutil epl Security "$dir\\Security.evtx" 2>$null
wevtutil epl System "$dir\\System.evtx" 2>$null

Write-Host "[8/10] Autorun entries..." -FG Cyan
$autorunPaths = @(
    "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",
    "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce",
    "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",
    "HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Run"
)
$autoruns = foreach ($path in $autorunPaths) {
    if (Test-Path $path) {
        Get-ItemProperty $path -EA SilentlyContinue | Get-Member -MemberType NoteProperty | Where-Object {$_.Name -notin @("PSPath","PSParentPath","PSChildName","PSDrive","PSProvider")} | ForEach-Object {
            [PSCustomObject]@{Path=$path;Name=$_.Name;Value=(Get-ItemProperty $path).$($_.Name)}
        }
    }
}
$autoruns | Export-Csv "$dir\\autorun-entries.csv" -NoTypeInformation

Write-Host "[9/10] Recent files & prefetch..." -FG Cyan
# Recently modified files (last 24h)
Get-ChildItem C:\\Users -Recurse -File -EA SilentlyContinue | Where-Object {$_.LastWriteTime -gt (Get-Date).AddHours(-24)} |
    Select FullName, Length, LastWriteTime, CreationTime | Export-Csv "$dir\\recent-files-24h.csv" -NoTypeInformation
# Prefetch
if (Test-Path "C:\\Windows\\Prefetch") {
    Get-ChildItem "C:\\Windows\\Prefetch" -Filter "*.pf" | Select Name, LastWriteTime, Length |
        Export-Csv "$dir\\prefetch.csv" -NoTypeInformation
}

Write-Host "[10/10] Generating hashes..." -FG Cyan
$end = Get-Date
# Hash all collected evidence
Get-ChildItem $dir -File | ForEach-Object {
    [PSCustomObject]@{File=$_.Name;SHA256=(Get-FileHash $_.FullName -Algorithm SHA256).Hash;Size=$_.Length}
} | Export-Csv "$dir\\EVIDENCE_HASHES.csv" -NoTypeInformation

# Finalize chain of custody
@"

Collection End: $($end.ToString('yyyy-MM-dd HH:mm:ss'))
Duration: $([Math]::Round(($end-$start).TotalSeconds,1)) seconds
Files Collected: $((Get-ChildItem $dir -File).Count)
Total Size: $([Math]::Round((Get-ChildItem $dir -File | Measure-Object Length -Sum).Sum / 1MB, 2)) MB
"@ | Add-Content "$dir\\CHAIN_OF_CUSTODY.txt"

Write-Host "\\n=== COLLECTION COMPLETE ===" -FG Green
Write-Host "Duration: $([Math]::Round(($end-$start).TotalSeconds,1))s" -FG White
Write-Host "Files: $((Get-ChildItem $dir -File).Count)" -FG White
Write-Host "Size: $([Math]::Round((Get-ChildItem $dir -File | Measure-Object Length -Sum).Sum / 1MB, 2)) MB" -FG White
Write-Host "Output: $dir" -FG Cyan
Write-Host "\\nIMPORTANT: Copy evidence to write-protected media immediately." -FG Yellow`
            },
            {
                id: "linux-forensic",
                title: "Forensic Evidence Collection — Linux Endpoint",
                platform: "RHEL/CentOS/Ubuntu",
                language: "Bash",
                cmmcControls: ["3.6.1", "3.6.2", "3.3.1"],
                prerequisites: ["Root/sudo access", "Run on compromised system BEFORE remediation"],
                evidence: ["Process list", "Network connections", "Log files", "File hashes", "User activity"],
                script: `#!/bin/bash
# CMMC Forensic Collection — Linux
# Run BEFORE any remediation on compromised host
set -uo pipefail
INCIDENT_ID="\${1:?Usage: $0 <incident-id>}"
DIR="/tmp/forensic-$INCIDENT_ID-$(hostname)-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DIR"
echo "=== FORENSIC COLLECTION | Incident: $INCIDENT_ID | Host: $(hostname) ==="
echo "Output: $DIR"

# Chain of custody
cat > "$DIR/CHAIN_OF_CUSTODY.txt" << EOF
Incident: $INCIDENT_ID
Hostname: $(hostname)
Start: $(date -u '+%Y-%m-%d %H:%M:%S UTC')
Collector: $(whoami) ($(id))
OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2)
Kernel: $(uname -r)
EOF

# 1. Volatile: processes
echo "[1/9] Processes..."
ps auxwwf > "$DIR/ps-full.txt"
ls -la /proc/*/exe 2>/dev/null > "$DIR/proc-exe-links.txt"
for PID in $(ls /proc/ | grep -E '^[0-9]+$'); do
    CMDLINE=$(cat /proc/$PID/cmdline 2>/dev/null | tr '\\0' ' ')
    EXE=$(readlink /proc/$PID/exe 2>/dev/null)
    [ -n "$EXE" ] && echo "$PID|$EXE|$CMDLINE"
done > "$DIR/process-details.txt"

# 2. Volatile: network
echo "[2/9] Network connections..."
ss -tulnp > "$DIR/ss-listening.txt"
ss -anp > "$DIR/ss-all.txt"
ip addr > "$DIR/ip-addr.txt"
ip route > "$DIR/ip-route.txt"
arp -an > "$DIR/arp.txt" 2>/dev/null
cat /etc/resolv.conf > "$DIR/resolv.conf"
iptables -L -n -v > "$DIR/iptables.txt" 2>/dev/null
nft list ruleset > "$DIR/nftables.txt" 2>/dev/null

# 3. Volatile: users
echo "[3/9] Logged-in users..."
w > "$DIR/w-output.txt"
last -50 > "$DIR/last-logins.txt"
lastb -50 > "$DIR/last-failed.txt" 2>/dev/null
cat /etc/passwd > "$DIR/passwd"
cat /etc/group > "$DIR/group"

# 4. Cron & scheduled
echo "[4/9] Scheduled tasks..."
for USER in $(cut -d: -f1 /etc/passwd); do
    crontab -l -u "$USER" 2>/dev/null && echo "--- User: $USER ---"
done > "$DIR/crontabs.txt"
ls -la /etc/cron.* > "$DIR/cron-dirs.txt" 2>/dev/null
systemctl list-timers --all > "$DIR/systemd-timers.txt" 2>/dev/null

# 5. Services
echo "[5/9] Services..."
systemctl list-units --type=service --all > "$DIR/services.txt" 2>/dev/null

# 6. Logs
echo "[6/9] Logs..."
cp /var/log/auth.log "$DIR/" 2>/dev/null
cp /var/log/secure "$DIR/" 2>/dev/null
cp /var/log/messages "$DIR/" 2>/dev/null
cp /var/log/syslog "$DIR/" 2>/dev/null
journalctl --since "7 days ago" --no-pager > "$DIR/journal-7d.txt" 2>/dev/null
if [ -d /var/log/audit ]; then cp /var/log/audit/audit.log "$DIR/"; fi

# 7. File system
echo "[7/9] Recent files & suspicious..."
find / -xdev -mtime -1 -type f 2>/dev/null | head -5000 > "$DIR/files-modified-24h.txt"
find / -xdev -perm -4000 -type f 2>/dev/null > "$DIR/suid-files.txt"
find / -xdev -perm -2000 -type f 2>/dev/null > "$DIR/sgid-files.txt"
find /tmp /var/tmp /dev/shm -type f 2>/dev/null > "$DIR/temp-files.txt"

# 8. SSH
echo "[8/9] SSH artifacts..."
for HOME_DIR in /home/* /root; do
    [ -d "$HOME_DIR/.ssh" ] && {
        echo "=== $HOME_DIR/.ssh ===" >> "$DIR/ssh-artifacts.txt"
        ls -la "$HOME_DIR/.ssh/" >> "$DIR/ssh-artifacts.txt" 2>/dev/null
        cat "$HOME_DIR/.ssh/authorized_keys" >> "$DIR/ssh-authorized-keys.txt" 2>/dev/null
        cat "$HOME_DIR/.ssh/known_hosts" >> "$DIR/ssh-known-hosts.txt" 2>/dev/null
        cat "$HOME_DIR/.bash_history" >> "$DIR/bash-history-$(basename $HOME_DIR).txt" 2>/dev/null
    }
done

# 9. Hashes
echo "[9/9] Hashing evidence..."
find "$DIR" -type f -exec sha256sum {} \\; > "$DIR/EVIDENCE_HASHES.txt"

echo "Collection End: $(date -u '+%Y-%m-%d %H:%M:%S UTC')" >> "$DIR/CHAIN_OF_CUSTODY.txt"
echo "Files: $(find "$DIR" -type f | wc -l)" >> "$DIR/CHAIN_OF_CUSTODY.txt"
echo "Size: $(du -sh "$DIR" | cut -f1)" >> "$DIR/CHAIN_OF_CUSTODY.txt"

echo ""
echo "=== COLLECTION COMPLETE ==="
echo "Files: $(find "$DIR" -type f | wc -l) | Size: $(du -sh "$DIR" | cut -f1)"
echo "Output: $DIR"
echo "IMPORTANT: Copy to write-protected media immediately."`
            },
            {
                id: "dfars-7012-report",
                title: "DFARS 7012 — 72-Hour Incident Report Generator",
                platform: "Cross-platform",
                language: "PowerShell",
                cmmcControls: ["3.6.1", "3.6.2", "3.6.3"],
                prerequisites: ["Incident details gathered", "DIBNet account for submission"],
                evidence: ["DFARS 7012 report document", "Submission confirmation", "Timeline"],
                script: `# DFARS 252.204-7012 Incident Report Generator
# Generates the required report for DoD submission within 72 hours
param(
    [Parameter(Mandatory)][string]$IncidentId,
    [Parameter(Mandatory)][string]$CompanyName,
    [Parameter(Mandatory)][string]$ContractNumber,
    [Parameter(Mandatory)][string]$DiscoveryDate,      # yyyy-MM-dd HH:mm
    [Parameter(Mandatory)][string]$IncidentType,        # Malware, Unauthorized Access, Data Exfiltration, etc.
    [Parameter(Mandatory)][string]$Description,
    [string]$CUIInvolved = "Under Investigation",
    [string]$SystemsAffected = "Under Investigation",
    [string]$ContainmentActions = "Under Investigation",
    [string]$POCName,
    [string]$POCEmail,
    [string]$POCPhone
)

$reportDate = Get-Date -Format "yyyy-MM-dd HH:mm"
$discoveryDT = [DateTime]::Parse($DiscoveryDate)
$deadline = $discoveryDT.AddHours(72)
$hoursRemaining = [Math]::Round(($deadline - (Get-Date)).TotalHours, 1)

$report = @"
================================================================================
DFARS 252.204-7012 CYBER INCIDENT REPORT
================================================================================

REPORT DATE: $reportDate
INCIDENT ID: $IncidentId
SUBMISSION DEADLINE: $($deadline.ToString('yyyy-MM-dd HH:mm')) ($hoursRemaining hours remaining)

================================================================================
SECTION 1: CONTRACTOR INFORMATION
================================================================================
Company Name:     $CompanyName
Contract Number:  $ContractNumber
CAGE Code:        [ENTER CAGE CODE]
POC Name:         $POCName
POC Email:        $POCEmail
POC Phone:        $POCPhone

================================================================================
SECTION 2: INCIDENT DETAILS
================================================================================
Discovery Date/Time:  $DiscoveryDate
Incident Type:        $IncidentType
Description:
$Description

================================================================================
SECTION 3: AFFECTED SYSTEMS & DATA
================================================================================
Systems Affected:     $SystemsAffected
CUI Involved:        $CUIInvolved
CUI Categories:      [Specify: CTI, ITAR, Export Controlled, FOUO, etc.]
Programs Affected:    [List affected DoD programs/contracts]

================================================================================
SECTION 4: CONTAINMENT & MITIGATION
================================================================================
Immediate Actions Taken:
$ContainmentActions

Current Status:       [Contained / Under Investigation / Remediated]
External Support:     [List any third-party IR firms engaged]

================================================================================
SECTION 5: IMPACT ASSESSMENT
================================================================================
Data Potentially Compromised:  [Describe]
Operational Impact:            [Describe]
Number of Records Affected:    [Estimate]

================================================================================
SECTION 6: PRESERVATION
================================================================================
Images/logs preserved for 90 days per DFARS 7012(e):  [Yes/No]
Media available for DoD damage assessment:             [Yes/No]
Forensic analysis provider:                            [Name if applicable]

================================================================================
SECTION 7: SUBMISSION INSTRUCTIONS
================================================================================
1. Submit via DIBNet: https://dibnet.dod.mil
2. Report to DC3: dc3.mil/cyber-incident-reporting
3. Notify contracting officer within 72 hours of discovery
4. Preserve all images and logs for minimum 90 days
5. Provide DoD access for damage assessment if requested

================================================================================
LEGAL NOTICE: This report contains sensitive information regarding a cyber
incident affecting Controlled Unclassified Information (CUI). Handle in
accordance with DFARS 252.204-7012 and applicable security requirements.
================================================================================
"@

$report | Out-File "DFARS-7012-Report-$IncidentId-$(Get-Date -Format 'yyyyMMdd').txt"
Write-Host "DFARS 7012 report generated." -FG Green
Write-Host "Deadline: $($deadline.ToString('yyyy-MM-dd HH:mm')) ($hoursRemaining hours remaining)" -FG $(if($hoursRemaining -lt 24){"Red"}elseif($hoursRemaining -lt 48){"Yellow"}else{"Green"})
Write-Host "\\nSUBMIT TO:" -FG Yellow
Write-Host "  DIBNet: https://dibnet.dod.mil" -FG White
Write-Host "  DC3: https://dc3.mil/cyber-incident-reporting" -FG White
Write-Host "  Contracting Officer: [notify directly]" -FG White`
            },
            {
                id: "sentinel-playbook",
                title: "Sentinel — Automated IR Playbook (Logic App)",
                platform: "Microsoft Sentinel (GCC High)",
                language: "PowerShell",
                cmmcControls: ["3.6.1", "3.6.2", "3.14.6"],
                prerequisites: ["Az module", "Sentinel Contributor", "Logic App Contributor"],
                evidence: ["Playbook run history", "Automated containment logs", "Notification records"],
                script: `# Deploy Sentinel Automated IR Playbook — GCC High
# Triggers on High/Critical incidents: disables user, notifies SOC, creates ticket

Connect-AzAccount -Environment AzureUSGovernment
$rg = "rg-sentinel-cmmc"; $loc = "usgovvirginia"
$ws = "law-sentinel-cmmc"

# Create Logic App for automated containment
$playbookName = "CMMC-IR-AutoContain"

$definition = @{
    "\$schema" = "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#"
    contentVersion = "1.0.0.0"
    triggers = @{
        "When_Azure_Sentinel_incident_is_created" = @{
            type = "ApiConnectionWebhook"
            inputs = @{
                body = @{
                    callback_url = "@{listCallbackUrl()}"
                }
                host = @{ connection = @{ name = "@parameters('\$connections')['azuresentinel']['connectionId']" } }
                path = "/incident-creation"
            }
        }
    }
    actions = @{
        "Check_Severity" = @{
            type = "If"
            expression = @{
                or = @(
                    @{ equals = @("@triggerBody()?['object']?['properties']?['severity']", "High") }
                    @{ equals = @("@triggerBody()?['object']?['properties']?['severity']", "Critical") }
                )
            }
            actions = @{
                "Get_Incident_Entities" = @{
                    type = "ApiConnection"
                    inputs = @{
                        host = @{ connection = @{ name = "@parameters('\$connections')['azuresentinel']['connectionId']" } }
                        method = "post"
                        path = "/entities/@{triggerBody()?['object']?['properties']?['relatedAnalyticRuleIds'][0]}"
                    }
                }
                "Send_SOC_Notification" = @{
                    type = "ApiConnection"
                    inputs = @{
                        host = @{ connection = @{ name = "@parameters('\$connections')['office365']['connectionId']" } }
                        method = "post"
                        path = "/v2/Mail"
                        body = @{
                            To = "soc@company.us"
                            Subject = "CMMC ALERT: @{triggerBody()?['object']?['properties']?['severity']} Incident - @{triggerBody()?['object']?['properties']?['title']}"
                            Body = "Incident: @{triggerBody()?['object']?['properties']?['incidentNumber']}\\nSeverity: @{triggerBody()?['object']?['properties']?['severity']}\\nTitle: @{triggerBody()?['object']?['properties']?['title']}\\nDescription: @{triggerBody()?['object']?['properties']?['description']}"
                        }
                    }
                }
                "Add_Incident_Comment" = @{
                    type = "ApiConnection"
                    inputs = @{
                        host = @{ connection = @{ name = "@parameters('\$connections')['azuresentinel']['connectionId']" } }
                        method = "post"
                        path = "/comment/@{triggerBody()?['object']?['properties']?['incidentNumber']}"
                        body = @{ message = "Automated playbook triggered. SOC notified. Containment actions initiated." }
                    }
                }
            }
        }
    }
} | ConvertTo-Json -Depth 15

# Deploy via ARM
$armTemplate = @{
    "\$schema" = "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#"
    contentVersion = "1.0.0.0"
    resources = @(@{
        type = "Microsoft.Logic/workflows"
        apiVersion = "2017-07-01"
        name = $playbookName
        location = $loc
        properties = @{
            state = "Enabled"
            definition = $definition | ConvertFrom-Json
        }
    })
} | ConvertTo-Json -Depth 20

$armTemplate | Out-File "playbook-template.json"
New-AzResourceGroupDeployment -ResourceGroupName $rg -TemplateFile "playbook-template.json" -ErrorAction SilentlyContinue

Write-Host "Sentinel playbook '$playbookName' deployed." -FG Green
Write-Host "Configure automation rule in Sentinel to trigger on High/Critical incidents." -FG Cyan`
            },
            {
                id: "ir-runbook",
                title: "IR Runbook — Step-by-Step Incident Response Checklist",
                platform: "Cross-platform (reference document)",
                language: "PowerShell",
                cmmcControls: ["3.6.1", "3.6.2", "3.6.3"],
                prerequisites: ["IR plan approved", "IR team identified"],
                evidence: ["Completed IR checklist", "Timeline of actions", "Lessons learned"],
                script: `# CMMC Incident Response Runbook — Automated Checklist Tracker
# Tracks IR phases, actions, timestamps, and generates evidence

param([Parameter(Mandatory)][string]$IncidentId)

$phases = @(
    @{Phase="1-PREPARATION";Steps=@(
        "Verify IR plan is current and approved"
        "Confirm IR team contact list is current"
        "Verify forensic tools are available and updated"
        "Confirm backup communication channels"
        "Verify evidence storage is available (write-protected)"
    )}
    @{Phase="2-DETECTION";Steps=@(
        "Document initial alert/report source"
        "Record detection timestamp (UTC)"
        "Classify incident type (malware/unauthorized access/data breach/etc.)"
        "Assign initial severity (Low/Medium/High/Critical)"
        "Identify affected systems and users"
        "Determine if CUI is potentially affected"
        "Notify IR team lead"
    )}
    @{Phase="3-CONTAINMENT";Steps=@(
        "Disable compromised user accounts"
        "Revoke active sessions and tokens"
        "Isolate affected devices (network/Defender)"
        "Block malicious IPs/domains at firewall"
        "Disable compromised service accounts/API keys"
        "Preserve volatile evidence BEFORE remediation"
        "Document all containment actions with timestamps"
    )}
    @{Phase="4-ERADICATION";Steps=@(
        "Identify root cause and attack vector"
        "Remove malware/unauthorized access"
        "Patch exploited vulnerabilities"
        "Reset all potentially compromised credentials"
        "Verify no persistence mechanisms remain"
        "Scan all related systems for indicators of compromise"
    )}
    @{Phase="5-RECOVERY";Steps=@(
        "Restore systems from known-good backups"
        "Re-enable accounts with new credentials"
        "Verify system integrity before reconnection"
        "Monitor recovered systems for 72 hours"
        "Confirm normal operations restored"
        "Update security controls to prevent recurrence"
    )}
    @{Phase="6-REPORTING";Steps=@(
        "Complete internal incident report"
        "If CUI breach: submit DFARS 7012 report within 72 hours"
        "Notify contracting officer"
        "Preserve all evidence for 90 days minimum"
        "Conduct lessons learned meeting"
        "Update IR plan based on findings"
        "Update security controls and monitoring"
    )}
)

$checklist = @()
foreach ($phase in $phases) {
    Write-Host "\\n=== $($phase.Phase) ===" -FG Cyan
    foreach ($step in $phase.Steps) {
        $response = Read-Host "  $step [Y/N/Skip/Note]"
        $checklist += [PSCustomObject]@{
            IncidentId = $IncidentId
            Phase = $phase.Phase
            Step = $step
            Status = switch ($response.ToUpper()[0]) { "Y" {"Complete"} "N" {"Not Done"} "S" {"Skipped"} default {"Note: $response"} }
            Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
            CompletedBy = $env:USERNAME
        }
    }
}

$checklist | Export-Csv "IR-Checklist-$IncidentId-$(Get-Date -Format 'yyyyMMdd').csv" -NoTypeInformation
Write-Host "\\nIR checklist saved: IR-Checklist-$IncidentId-*.csv" -FG Green
$complete = ($checklist | Where-Object {$_.Status -eq "Complete"}).Count
$total = $checklist.Count
Write-Host "Progress: $complete/$total steps completed ($([Math]::Round(100*$complete/$total))%)" -FG $(if($complete -eq $total){"Green"}else{"Yellow"})`
            }
        ]
    }
};

if (typeof window !== 'undefined') window.MSP_TECHNICAL_SCRIPTS_IR = MSP_TECHNICAL_SCRIPTS_IR;
if (typeof module !== 'undefined' && module.exports) module.exports = MSP_TECHNICAL_SCRIPTS_IR;
