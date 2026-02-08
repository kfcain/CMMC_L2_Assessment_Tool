// MSP/MSSP Technical Scripts — Part 3: Endpoint Hardening
// Intune, GPO, STIG, CIS Benchmarks, Linux hardening, macOS profiles
// CMMC Controls: 3.4.1-3.4.9, 3.14.1-3.14.7
const MSP_TECHNICAL_SCRIPTS_ENDPOINTS = {
    version: "1.0.0",
    lastUpdated: "2026-02-08",
    endpoints: {
        title: "Endpoint Hardening Scripts",
        description: "Device compliance, OS hardening, STIG automation, CIS benchmarks, application whitelisting, and patch management.",
        subsections: [
            {
                id: "intune-compliance",
                title: "Intune — CMMC Device Compliance Policies",
                platform: "Microsoft Intune (GCC High)",
                language: "PowerShell",
                cmmcControls: ["3.4.1", "3.4.2", "3.4.6", "3.4.7", "3.13.11"],
                prerequisites: ["Microsoft.Graph module", "Intune Administrator", "Intune licenses"],
                evidence: ["Compliance policy exports", "Device compliance reports", "Non-compliant device list"],
                script: `#Requires -Modules Microsoft.Graph.Authentication, Microsoft.Graph.DeviceManagement
# CMMC Intune Compliance Policies — GCC High

Connect-MgGraph -Environment USGov -Scopes "DeviceManagementConfiguration.ReadWrite.All"

# Windows 10/11 Compliance
$winPolicy = @{
    "@odata.type" = "#microsoft.graph.windows10CompliancePolicy"
    displayName = "CMMC-L2-Windows-Compliance"
    passwordRequired = $true; passwordMinimumLength = 14; passwordRequiredType = "alphanumeric"
    passwordMinutesOfInactivityBeforeLock = 15; passwordExpirationDays = 60; passwordPreviousPasswordBlockCount = 24
    osMinimumVersion = "10.0.19045.0"; storageRequireEncryption = $true; secureBootEnabled = $true
    bitLockerEnabled = $true; codeIntegrityEnabled = $true; tpmRequired = $true
    defenderEnabled = $true; rtpEnabled = $true; antivirusRequired = $true; firewallEnabled = $true
    scheduledActionsForRule = @(@{
        ruleName = "PasswordRequired"
        scheduledActionConfigurations = @(
            @{ actionType = "block"; gracePeriodHours = 24 }
            @{ actionType = "notification"; gracePeriodHours = 0 }
            @{ actionType = "retire"; gracePeriodHours = 720 }
        )
    })
}
Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.us/v1.0/deviceManagement/deviceCompliancePolicies" -Body ($winPolicy | ConvertTo-Json -Depth 5)

# macOS Compliance
$macPolicy = @{
    "@odata.type" = "#microsoft.graph.macOSCompliancePolicy"
    displayName = "CMMC-L2-macOS-Compliance"
    passwordRequired = $true; passwordMinimumLength = 14; passwordMinutesOfInactivityBeforeLock = 15
    passwordExpirationDays = 60; osMinimumVersion = "14.0"; storageRequireEncryption = $true
    firewallEnabled = $true; firewallEnableStealthMode = $true; systemIntegrityProtectionEnabled = $true
    scheduledActionsForRule = @(@{ ruleName = "PasswordRequired"; scheduledActionConfigurations = @(@{ actionType = "block"; gracePeriodHours = 24 }) })
}
Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.us/v1.0/deviceManagement/deviceCompliancePolicies" -Body ($macPolicy | ConvertTo-Json -Depth 5)

# iOS Compliance
$iosPolicy = @{
    "@odata.type" = "#microsoft.graph.iosCompliancePolicy"
    displayName = "CMMC-L2-iOS-Compliance"
    passcodeRequired = $true; passcodeMinimumLength = 6; passcodeMinutesOfInactivityBeforeLock = 5
    securityBlockJailbrokenDevices = $true; osMinimumVersion = "17.0"
    deviceThreatProtectionEnabled = $true; deviceThreatProtectionRequiredSecurityLevel = "low"
}
Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.us/v1.0/deviceManagement/deviceCompliancePolicies" -Body ($iosPolicy | ConvertTo-Json -Depth 5)

# Export non-compliant devices
$devices = Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.us/v1.0/deviceManagement/managedDevices?\$filter=complianceState ne 'compliant'"
$devices.value | ForEach-Object {
    [PSCustomObject]@{ Device=$_.deviceName; OS=$_.operatingSystem; User=$_.userPrincipalName; State=$_.complianceState; Encrypted=$_.isEncrypted; LastSync=$_.lastSyncDateTime }
} | Export-Csv "NonCompliant-Devices-$(Get-Date -Format 'yyyyMMdd').csv" -NoTypeInformation
Write-Host "Compliance policies deployed. Non-compliant devices exported." -FG Green
Disconnect-MgGraph`
            },
            {
                id: "intune-asr",
                title: "Intune — Attack Surface Reduction + BitLocker Profiles",
                platform: "Microsoft Intune (GCC High)",
                language: "PowerShell",
                cmmcControls: ["3.4.1", "3.4.6", "3.4.8", "3.14.2", "3.14.4"],
                prerequisites: ["Microsoft.Graph module", "Intune Administrator"],
                evidence: ["ASR rule status reports", "BitLocker recovery key escrow", "Configuration profile exports"],
                script: `#Requires -Modules Microsoft.Graph.Authentication
# Intune ASR Rules + BitLocker — GCC High

Connect-MgGraph -Environment USGov -Scopes "DeviceManagementConfiguration.ReadWrite.All"

# ASR Rules — all 13 critical rules in block mode
$asrProfile = @{
    "@odata.type" = "#microsoft.graph.windows10EndpointProtectionConfiguration"
    displayName = "CMMC-L2-ASR-Rules"
    defenderAttackSurfaceReductionRules = @(
        @{ruleId="BE9BA2D9-53EA-4CDC-84E5-9B1EEEE46550";state="block"}  # Block exe from email
        @{ruleId="D4F940AB-401B-4EFC-AADC-AD5F3C50688A";state="block"}  # Block Office child processes
        @{ruleId="3B576869-A4EC-4529-8536-B80A7769E899";state="block"}  # Block Office exe content
        @{ruleId="75668C1F-73B5-4CF0-BB93-3ECF5CB7CC84";state="block"}  # Block Office injection
        @{ruleId="D3E037E1-3EB8-44C8-A917-57927947596D";state="block"}  # Block JS/VBS exe launch
        @{ruleId="5BEB7EFE-FD9A-4556-801D-275E5FFC04CC";state="block"}  # Block obfuscated scripts
        @{ruleId="92E97FA1-2EDF-4476-BDD6-9DD0B4DDDC7B";state="block"}  # Block Win32 from macros
        @{ruleId="9E6C4E1F-7D60-472F-BA1A-A39EF669E4B2";state="block"}  # Block LSASS credential steal
        @{ruleId="D1E49AAC-8F56-4280-B9BA-993A6D77406C";state="block"}  # Block PSExec/WMI
        @{ruleId="B2B3F03D-6A65-4F7B-A9C7-1C7EF74A9BA4";state="block"}  # Block untrusted USB
        @{ruleId="C1DB55AB-C21A-4637-BB3F-A12568109D35";state="block"}  # Ransomware protection
        @{ruleId="7674BA52-37EB-4A4F-A9A1-F0F9A1619A2C";state="block"}  # Block Adobe child proc
        @{ruleId="E6DB77E5-3DF2-4CF1-B95A-636979351E5B";state="block"}  # Block WMI persistence
    )
    defenderGuardMyFoldersType = "enable"
    defenderAdditionalGuardedFolders = @("C:\\\\CUI","D:\\\\ContractData")
    firewallProfileDomain = @{firewallEnabled="allowed";inboundConnectionsBlocked=$true}
    firewallProfilePublic = @{firewallEnabled="allowed";inboundConnectionsBlocked=$true;inboundNotificationsBlocked=$true}
}
Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.us/v1.0/deviceManagement/deviceConfigurations" -Body ($asrProfile | ConvertTo-Json -Depth 5)

# BitLocker — XTS-AES 256
$blProfile = @{
    "@odata.type" = "#microsoft.graph.windows10EndpointProtectionConfiguration"
    displayName = "CMMC-L2-BitLocker"
    bitLockerSystemDrivePolicy = @{
        encryptionMethod = "xtsAes256"; startupAuthenticationRequired = $true
        startupAuthenticationTpmUsage = "required"
        recoveryOptions = @{
            recoveryPasswordUsage = "required"; recoveryKeyUsage = "required"
            enableRecoveryInformationSaveToStore = $true; enableBitLockerAfterRecoveryInformationToStore = $true
        }
    }
    bitLockerFixedDrivePolicy = @{ encryptionMethod = "xtsAes256"; requireEncryptionForWriteAccess = $true }
    bitLockerRemovableDrivePolicy = @{ encryptionMethod = "aes256"; requireEncryptionForWriteAccess = $true; blockCrossOrganizationWriteAccess = $true }
}
Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.us/v1.0/deviceManagement/deviceConfigurations" -Body ($blProfile | ConvertTo-Json -Depth 5)

Write-Host "ASR + BitLocker profiles deployed" -FG Green
Disconnect-MgGraph`
            },
            {
                id: "windows-stig",
                title: "Windows Server 2022 — DISA STIG Hardening",
                platform: "Windows Server 2022",
                language: "PowerShell",
                cmmcControls: ["3.4.1", "3.4.2", "3.4.6", "3.4.7", "3.4.8"],
                prerequisites: ["Administrator access", "Windows Server 2022"],
                evidence: ["GPResult HTML", "SecurityPolicy INF", "AuditPolicy TXT"],
                script: `# Windows Server 2022 STIG Hardening — Key Settings
# Based on DISA STIG V2R1
Write-Host "=== Win2022 STIG Hardening ===" -FG Cyan

# Account Policies
net accounts /minpwlen:14 /uniquepw:24 /maxpwage:60 /minpwage:1 /lockoutthreshold:3 /lockoutduration:15 /lockoutwindow:15

# Security Options
$regSettings = @{
    "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" = @{
        DontDisplayLastUserName = 1; DisableCAD = 0; InactivityTimeoutSecs = 900
        LegalNoticeCaption = "NOTICE"
        LegalNoticeText = "You are accessing a U.S. Government IS provided for USG-authorized use only. By using this IS you consent to monitoring."
    }
    "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Lsa" = @{
        LmCompatibilityLevel = 5; SCENoApplyLegacyAuditPolicy = 1
    }
    "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\MSV1_0" = @{
        NTLMMinClientSec = 537395200; NTLMMinServerSec = 537395200
    }
    "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\LanmanServer\\Parameters" = @{ SMB1 = 0 }
    "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\NTDS\\Parameters" = @{ LDAPServerIntegrity = 2; LdapEnforceChannelBinding = 2 }
}
foreach ($path in $regSettings.Keys) {
    foreach ($name in $regSettings[$path].Keys) {
        $val = $regSettings[$path][$name]
        if ($val -is [string]) { Set-ItemProperty -Path $path -Name $name -Value $val -Type String -Force }
        else { Set-ItemProperty -Path $path -Name $name -Value $val -Type DWord -Force }
    }
}

# Rename/disable default accounts
Rename-LocalUser -Name "Administrator" -NewName "CMMCAdmin" -EA SilentlyContinue
Rename-LocalUser -Name "Guest" -NewName "CMMCGuest" -EA SilentlyContinue
Disable-LocalUser -Name "CMMCGuest" -EA SilentlyContinue

# Disable SMBv1
Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol -NoRestart -EA SilentlyContinue

# TLS: disable 1.0/1.1, enable 1.2
foreach ($ver in @("TLS 1.0","TLS 1.1")) {
    foreach ($side in @("Server","Client")) {
        $p = "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\$ver\\$side"
        New-Item -Path $p -Force | Out-Null
        Set-ItemProperty -Path $p -Name "Enabled" -Value 0 -Type DWord
        Set-ItemProperty -Path $p -Name "DisabledByDefault" -Value 1 -Type DWord
    }
}
foreach ($side in @("Server","Client")) {
    $p = "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.2\\$side"
    New-Item -Path $p -Force | Out-Null
    Set-ItemProperty -Path $p -Name "Enabled" -Value 1 -Type DWord
    Set-ItemProperty -Path $p -Name "DisabledByDefault" -Value 0 -Type DWord
}

# Firewall
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
Set-NetFirewallProfile -Profile Domain -DefaultInboundAction Block -DefaultOutboundAction Allow -LogAllowed True -LogBlocked True -LogMaxSizeKilobytes 16384
Set-NetFirewallProfile -Profile Public -DefaultInboundAction Block -DefaultOutboundAction Block

# Disable unnecessary services
@("Browser","IISADMIN","FTPSVC","TlntSvr","XblAuthManager","XblGameSave","XboxNetApiSvc") | % {
    $s = Get-Service -Name $_ -EA SilentlyContinue
    if ($s) { Stop-Service $_ -Force -EA SilentlyContinue; Set-Service $_ -StartupType Disabled }
}

# Advanced Audit Policy
$auditCmds = @(
    '"Credential Validation" /success:enable /failure:enable','"Logon" /success:enable /failure:enable'
    '"Logoff" /success:enable','"Account Lockout" /success:enable /failure:enable'
    '"Special Logon" /success:enable','"User Account Management" /success:enable /failure:enable'
    '"Security Group Management" /success:enable /failure:enable','"Audit Policy Change" /success:enable /failure:enable'
    '"Sensitive Privilege Use" /success:enable /failure:enable','"Process Creation" /success:enable'
    '"File System" /success:enable /failure:enable','"Removable Storage" /success:enable /failure:enable'
    '"Security State Change" /success:enable','"System Integrity" /success:enable /failure:enable'
)
$auditCmds | % { cmd /c "auditpol /set /subcategory:$_" 2>$null }

# PowerShell logging
@{Path="HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging";Name="EnableScriptBlockLogging";Value=1},
@{Path="HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ModuleLogging";Name="EnableModuleLogging";Value=1},
@{Path="HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\Transcription";Name="EnableTranscripting";Value=1} | % {
    New-Item -Path $_.Path -Force -EA SilentlyContinue | Out-Null
    Set-ItemProperty -Path $_.Path -Name $_.Name -Value $_.Value -Type DWord -Force
}

# Event log sizes (1GB Security)
wevtutil sl Security /ms:1073741824 /rt:false
wevtutil sl System /ms:268435456 /rt:false

# Export evidence
gpresult /h "GPResult-$(hostname)-$(Get-Date -Format 'yyyyMMdd').html" /f
secedit /export /cfg "SecurityPolicy-$(hostname)-$(Get-Date -Format 'yyyyMMdd').inf"
auditpol /get /category:* > "AuditPolicy-$(hostname)-$(Get-Date -Format 'yyyyMMdd').txt"
Write-Host "STIG hardening complete. Evidence exported." -FG Green`
            },
            {
                id: "linux-cis",
                title: "Linux — CIS Benchmark Hardening (RHEL 8/9)",
                platform: "RHEL 8/9, CentOS, Rocky Linux",
                language: "Bash",
                cmmcControls: ["3.4.1", "3.4.2", "3.4.6", "3.4.7", "3.4.8", "3.4.9"],
                prerequisites: ["Root/sudo access", "RHEL 8 or 9"],
                evidence: ["Hardening log", "oscap report", "AIDE baseline"],
                script: `#!/bin/bash
# CIS Benchmark Hardening — RHEL 8/9
set -euo pipefail
LOG="/var/log/cmmc-hardening-$(date +%Y%m%d).log"
exec > >(tee -a "$LOG") 2>&1
echo "=== CIS/CMMC Linux Hardening — $(date) ==="

# 1. Disable unused filesystems
for FS in cramfs freevxfs jffs2 hfs hfsplus squashfs udf vfat; do
    echo "install $FS /bin/true" > "/etc/modprobe.d/$FS.conf"
done

# 2. Secure mount options
grep -q "/tmp" /etc/fstab || echo "tmpfs /tmp tmpfs defaults,rw,nosuid,nodev,noexec 0 0" >> /etc/fstab
grep -q "/dev/shm" /etc/fstab || echo "tmpfs /dev/shm tmpfs defaults,nodev,nosuid,noexec 0 0" >> /etc/fstab

# 3. Network hardening
cat > /etc/sysctl.d/99-cmmc.conf << 'EOF'
net.ipv4.ip_forward = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.tcp_syncookies = 1
net.ipv4.conf.all.log_martians = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.conf.all.rp_filter = 1
net.ipv6.conf.all.disable_ipv6 = 1
EOF
sysctl --system > /dev/null 2>&1

# 4. SSH hardening
cat > /etc/ssh/sshd_config.d/cmmc.conf << 'EOF'
Protocol 2
PermitRootLogin no
MaxAuthTries 4
LoginGraceTime 60
ClientAliveInterval 300
ClientAliveCountMax 3
PermitEmptyPasswords no
PasswordAuthentication no
PubkeyAuthentication yes
X11Forwarding no
AllowTcpForwarding no
Banner /etc/issue.net
Ciphers aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com
KexAlgorithms curve25519-sha256,diffie-hellman-group16-sha512
LogLevel VERBOSE
EOF

cat > /etc/issue.net << 'BANNER'
WARNING: Authorized use only. All activity monitored and recorded.
BANNER
systemctl restart sshd

# 5. Password policy
cat > /etc/security/pwquality.conf << 'EOF'
minlen = 14
dcredit = -1
ucredit = -1
ocredit = -1
lcredit = -1
minclass = 4
maxrepeat = 3
retry = 3
enforce_for_root
EOF
sed -i 's/^PASS_MAX_DAYS.*/PASS_MAX_DAYS   60/' /etc/login.defs
sed -i 's/^PASS_MIN_DAYS.*/PASS_MIN_DAYS   1/' /etc/login.defs
sed -i 's/^PASS_MIN_LEN.*/PASS_MIN_LEN    14/' /etc/login.defs

# Account lockout
cat > /etc/security/faillock.conf << 'EOF'
deny = 3
fail_interval = 900
unlock_time = 900
even_deny_root
EOF

# 6. File permissions
chmod 644 /etc/passwd; chmod 000 /etc/shadow; chmod 644 /etc/group; chmod 000 /etc/gshadow
chmod 600 /etc/ssh/sshd_config; chmod 700 /root
find / -xdev -type f -perm -0002 -print 2>/dev/null > /var/log/world-writable-files.txt
find / -xdev \\( -perm -4000 -o -perm -2000 \\) -type f 2>/dev/null > /var/log/suid-sgid-files.txt

# 7. AIDE (file integrity)
dnf install -y aide > /dev/null 2>&1 || yum install -y aide > /dev/null 2>&1
aide --init 2>/dev/null; mv /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz 2>/dev/null || true
mkdir -p /var/log/aide
cat > /etc/cron.daily/aide-check << 'CRON'
#!/bin/bash
/usr/sbin/aide --check > /var/log/aide/aide-$(date +%Y%m%d).log 2>&1
CRON
chmod 755 /etc/cron.daily/aide-check

# 8. FIPS mode
fips-mode-setup --enable 2>/dev/null || echo "FIPS requires reboot"

# 9. Firewalld
systemctl enable firewalld; systemctl start firewalld
firewall-cmd --set-default-zone=drop
firewall-cmd --zone=drop --add-service=ssh --permanent
firewall-cmd --reload

echo "Hardening complete. Log: $LOG"
echo "Reboot required for FIPS. Validate: oscap xccdf eval --profile cis"`
            },
            {
                id: "macos-hardening",
                title: "macOS — CMMC Security Hardening",
                platform: "macOS 14+ (Sonoma)",
                language: "Bash",
                cmmcControls: ["3.4.1", "3.4.2", "3.1.11", "3.13.11"],
                prerequisites: ["Admin access or MDM", "macOS 14+"],
                evidence: ["macOS-CMMC-Report-{date}.txt", "FileVault status", "Firewall status"],
                script: `#!/bin/bash
# macOS CMMC Hardening
set -euo pipefail
echo "=== macOS CMMC Hardening ==="

# FileVault
FV=$(fdesetup status)
[[ "$FV" != *"On"* ]] && echo "FileVault OFF — run: sudo fdesetup enable" || echo "FileVault ON"

# Firewall + stealth
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setstealthmode on
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setallowsigned on

# Screen lock: immediate, 15-min timeout
defaults write com.apple.screensaver askForPassword -int 1
defaults write com.apple.screensaver askForPasswordDelay -int 0
defaults -currentHost write com.apple.screensaver idleTime -int 900

# Disable auto-login
sudo defaults delete /Library/Preferences/com.apple.loginwindow autoLoginUser 2>/dev/null || true

# Gatekeeper
sudo spctl --master-enable

# Disable remote services
sudo systemsetup -setremotelogin off 2>/dev/null || true

# Auto-updates
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate AutomaticCheckEnabled -bool true
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate CriticalUpdateInstall -bool true

# Login banner
sudo defaults write /Library/Preferences/com.apple.loginwindow LoginwindowText "NOTICE: Authorized use only. All activity monitored."

# Bluetooth sharing off
defaults -currentHost write com.apple.Bluetooth PrefKeyServicesEnabled -bool false

# Audit
sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.auditd.plist 2>/dev/null || true

# Evidence report
{
    echo "=== macOS CMMC Report — $(date) ==="
    echo "Host: $(hostname) | macOS: $(sw_vers -productVersion)"
    echo "FileVault: $(fdesetup status)"
    echo "Firewall: $(/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate)"
    echo "Stealth: $(/usr/libexec/ApplicationFirewall/socketfilterfw --getstealthmode)"
    echo "Gatekeeper: $(spctl --status)"
    echo "SIP: $(csrutil status)"
} > "$HOME/Desktop/macOS-CMMC-Report-$(date +%Y%m%d).txt"
echo "Report saved to Desktop."`
            },
            {
                id: "patch-audit",
                title: "Windows — Patch Compliance Audit & Evidence",
                platform: "Windows 10/11/Server",
                language: "PowerShell",
                cmmcControls: ["3.4.1", "3.4.2", "3.14.1"],
                prerequisites: ["Administrator access"],
                evidence: ["PatchAudit-{date}.csv", "Missing patches list", "Defender definition age"],
                script: `# CMMC Patch Compliance Audit
$ts = Get-Date -Format "yyyyMMdd"

# Installed updates
$updates = Get-HotFix | Sort-Object InstalledOn -Descending
$updates | Select HotFixID, Description, InstalledOn, InstalledBy | Export-Csv "PatchAudit-Installed-$ts.csv" -NoTypeInformation

# Missing updates
$session = New-Object -ComObject Microsoft.Update.Session
$missing = $session.CreateUpdateSearcher().Search("IsInstalled=0 and Type='Software'")
$report = foreach ($u in $missing.Updates) {
    [PSCustomObject]@{ Title=$u.Title; Severity=$u.MsrcSeverity; KB=($u.KBArticleIDs -join ","); Reboot=$u.RebootRequired }
}
$report | Export-Csv "PatchAudit-Missing-$ts.csv" -NoTypeInformation

$crit = ($report | ?{$_.Severity -eq "Critical"}).Count
$imp = ($report | ?{$_.Severity -eq "Important"}).Count
$last = ($updates | Select -First 1).InstalledOn
$days = ((Get-Date) - $last).Days

# Defender definitions
$def = Get-MpComputerStatus
$defAge = ((Get-Date) - $def.AntivirusSignatureLastUpdated).TotalHours

Write-Host "Installed: $($updates.Count) | Missing: $($report.Count) (Crit: $crit, Imp: $imp)" -FG $(if($crit -gt 0){"Red"}else{"Green"})
Write-Host "Last patch: $($last.ToString('yyyy-MM-dd')) ($days days ago)" -FG $(if($days -gt 30){"Red"}elseif($days -gt 14){"Yellow"}else{"Green"})
Write-Host "Defender defs: $([Math]::Round($defAge,1))h old" -FG $(if($defAge -gt 48){"Red"}elseif($defAge -gt 24){"Yellow"}else{"Green"})

[PSCustomObject]@{
    Hostname=hostname; Date=Get-Date; InstalledPatches=$updates.Count; MissingPatches=$report.Count
    CriticalMissing=$crit; ImportantMissing=$imp; LastPatchDate=$last; DaysSincePatch=$days
    DefenderDefAge="$([Math]::Round($defAge,1))h"
} | Export-Csv "PatchAudit-Summary-$ts.csv" -NoTypeInformation
Write-Host "Evidence exported." -FG Green`
            },
            {
                id: "app-whitelisting",
                title: "Windows — Application Whitelisting (AppLocker/WDAC)",
                platform: "Windows 10/11/Server",
                language: "PowerShell",
                cmmcControls: ["3.4.8", "3.4.9", "3.14.2"],
                prerequisites: ["Enterprise/Education edition", "Administrator access"],
                evidence: ["AppLocker policy XML", "WDAC policy binary", "Blocked application logs"],
                script: `# CMMC Application Whitelisting — AppLocker + WDAC
Write-Host "=== Application Whitelisting ===" -FG Cyan

# --- Option A: AppLocker (simpler, GPO-based) ---
# Generate default rules
$ruleTypes = @("Exe","Script","Msi","Dll","Appx")
foreach ($type in $ruleTypes) {
    $rules = Get-AppLockerPolicy -Effective -Xml
    # Create default rules allowing Windows and Program Files
    Set-AppLockerPolicy -XmlPolicy $rules -Merge
}

# Create custom AppLocker policy
$policy = @"
<AppLockerPolicy Version="1">
  <RuleCollection Type="Exe" EnforcementMode="AuditOnly">
    <FilePublisherRule Id="$(New-Guid)" Name="Allow Microsoft-signed" Description="Allow all Microsoft-signed executables" UserOrGroupSid="S-1-1-0" Action="Allow">
      <Conditions>
        <FilePublisherCondition PublisherName="O=MICROSOFT*" ProductName="*" BinaryName="*">
          <BinaryVersionRange LowSection="*" HighSection="*" />
        </FilePublisherCondition>
      </Conditions>
    </FilePublisherRule>
    <FilePathRule Id="$(New-Guid)" Name="Allow Windows" Description="Allow Windows directory" UserOrGroupSid="S-1-1-0" Action="Allow">
      <Conditions><FilePathCondition Path="%WINDIR%\\*" /></Conditions>
    </FilePathRule>
    <FilePathRule Id="$(New-Guid)" Name="Allow Program Files" Description="Allow Program Files" UserOrGroupSid="S-1-1-0" Action="Allow">
      <Conditions><FilePathCondition Path="%PROGRAMFILES%\\*" /></Conditions>
    </FilePathRule>
    <FilePathRule Id="$(New-Guid)" Name="Deny user writable" Description="Deny execution from user-writable paths" UserOrGroupSid="S-1-1-0" Action="Deny">
      <Conditions><FilePathCondition Path="%USERPROFILE%\\Downloads\\*" /></Conditions>
    </FilePathRule>
  </RuleCollection>
  <RuleCollection Type="Script" EnforcementMode="AuditOnly">
    <FilePathRule Id="$(New-Guid)" Name="Allow Windows scripts" UserOrGroupSid="S-1-1-0" Action="Allow">
      <Conditions><FilePathCondition Path="%WINDIR%\\*" /></Conditions>
    </FilePathRule>
  </RuleCollection>
</AppLockerPolicy>
"@
$policy | Out-File "AppLocker-CMMC-Policy.xml"
Set-AppLockerPolicy -XmlPolicy "AppLocker-CMMC-Policy.xml" -ErrorAction SilentlyContinue

# Start AppLocker service
Set-Service -Name AppIDSvc -StartupType Automatic
Start-Service AppIDSvc

# --- Option B: WDAC (stronger, kernel-level) ---
# Create WDAC base policy from audit of current system
# New-CIPolicy -Level Publisher -FilePath "WDAC-Audit.xml" -UserPEs -Audit
# ConvertFrom-CIPolicy "WDAC-Audit.xml" "WDAC-Audit.bin"

# Export AppLocker events for evidence
Get-WinEvent -LogName "Microsoft-Windows-AppLocker/EXE and DLL" -MaxEvents 100 -EA SilentlyContinue |
    Select TimeCreated, Id, Message | Export-Csv "AppLocker-Events-$(Get-Date -Format 'yyyyMMdd').csv" -NoTypeInformation

Write-Host "AppLocker policy deployed in AUDIT mode. Review events before enforcing." -FG Yellow
Write-Host "Export: AppLocker-CMMC-Policy.xml" -FG Cyan`
            }
        ]
    }
};

if (typeof window !== 'undefined') window.MSP_TECHNICAL_SCRIPTS_ENDPOINTS = MSP_TECHNICAL_SCRIPTS_ENDPOINTS;
if (typeof module !== 'undefined' && module.exports) module.exports = MSP_TECHNICAL_SCRIPTS_ENDPOINTS;
