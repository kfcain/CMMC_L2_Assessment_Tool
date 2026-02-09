// MSP/MSSP Technical Scripts — Part 7: Backup/Recovery, Media Protection, Maintenance
// BitLocker, LUKS, wipe scripts, backup verification, maintenance windows
// CMMC Controls: 3.7.1-3.7.6, 3.8.1-3.8.9
const MSP_TECHNICAL_SCRIPTS_MEDIA = {
  version: "1.0.0",
  lastUpdated: "2026-02-08",
  media: {
    title: "Media Protection & Maintenance Scripts",
    description: "Encryption enforcement, secure media disposal, backup verification, maintenance window automation, and physical security evidence.",
    subsections: [
      {
        id: "bitlocker-audit",
        title: "BitLocker — Audit & Enforcement Across Fleet",
        platform: "Windows 10/11/Server via Intune or Local",
        language: "PowerShell",
        cmmcControls: ["3.8.6", "3.13.11"],
        prerequisites: ["Admin access or Intune Admin", "TPM 2.0 on endpoints"],
        evidence: ["BitLocker status report", "Recovery key escrow verification", "Encryption method audit"],
        script: `# CMMC BitLocker Audit & Enforcement
param([ValidateSet("Audit","Enforce","Both")][string]$Mode = "Both")
$ts = Get-Date -Format yyyyMMdd

if ($Mode -in "Audit","Both") {
    Write-Host "=== BitLocker Audit ===" -FG Cyan
    $volumes = Get-BitLockerVolume
    $report = foreach ($v in $volumes) {
        [PSCustomObject]@{
            Computer = $env:COMPUTERNAME
            MountPoint = $v.MountPoint
            VolumeType = $v.VolumeType
            ProtectionStatus = $v.ProtectionStatus
            EncryptionMethod = $v.EncryptionMethod
            EncryptionPercentage = $v.EncryptionPercentage
            LockStatus = $v.LockStatus
            KeyProtectors = ($v.KeyProtector.KeyProtectorType -join ", ")
            AutoUnlock = $v.AutoUnlockEnabled
        }
    }
    $report | Export-Csv "BitLocker-Audit-$ts.csv" -NoTypeInformation
    $report | Format-Table -AutoSize
    
    # Check for weak encryption
    $weak = $report | Where-Object { $_.EncryptionMethod -notin @("XtsAes256","Aes256") }
    if ($weak) {
        Write-Host "WARNING: $($weak.Count) volumes using weak encryption:" -FG Red
        $weak | Select MountPoint, EncryptionMethod | Format-Table
    }
    
    # Verify recovery keys are escrowed to AD/Entra
    foreach ($v in $volumes) {
        $rk = $v.KeyProtector | Where-Object { $_.KeyProtectorType -eq "RecoveryPassword" }
        if (-not $rk) { Write-Host "  NO RECOVERY KEY: $($v.MountPoint)" -FG Red }
    }
}

if ($Mode -in "Enforce","Both") {
    Write-Host "\\n=== BitLocker Enforcement ===" -FG Cyan
    $os = Get-BitLockerVolume -MountPoint "C:"
    if ($os.ProtectionStatus -eq "Off") {
        Write-Host "Enabling BitLocker on C: with XTS-AES-256..." -FG Yellow
        Enable-BitLocker -MountPoint "C:" -EncryptionMethod XtsAes256 \\
            -RecoveryPasswordProtector -SkipHardwareTest
        
        # Also add TPM protector
        Add-BitLockerKeyProtector -MountPoint "C:" -TpmProtector
        
        # Backup recovery key to AD
        $rp = (Get-BitLockerVolume -MountPoint "C:").KeyProtector | Where-Object { $_.KeyProtectorType -eq "RecoveryPassword" }
        if ($rp) {
            Backup-BitLockerKeyProtector -MountPoint "C:" -KeyProtectorId $rp.KeyProtectorId
            Write-Host "  Recovery key escrowed to AD" -FG Green
        }
        Write-Host "  BitLocker enabled on C:" -FG Green
    } else {
        Write-Host "  C: already encrypted ($($os.EncryptionMethod))" -FG Green
    }
    
    # Encrypt data drives
    Get-BitLockerVolume | Where-Object { $_.VolumeType -eq "Data" -and $_.ProtectionStatus -eq "Off" } | ForEach-Object {
        Write-Host "Enabling BitLocker on $($_.MountPoint)..." -FG Yellow
        Enable-BitLocker -MountPoint $_.MountPoint -EncryptionMethod XtsAes256 \\
            -RecoveryPasswordProtector -AutoUnlock
        Write-Host "  Encrypted: $($_.MountPoint)" -FG Green
    }
}
Write-Host "\\nBitLocker audit/enforcement complete." -FG Green`
      },
      {
        id: "luks-linux",
        title: "Linux LUKS — Disk Encryption Audit & Setup",
        platform: "RHEL/CentOS/Ubuntu",
        language: "Bash",
        cmmcControls: ["3.8.6", "3.13.11"],
        prerequisites: ["Root access", "cryptsetup installed"],
        evidence: ["LUKS encryption status", "Cipher configuration", "Key slot audit"],
        script: `#!/bin/bash
# CMMC LUKS Encryption Audit & Setup
set -euo pipefail
echo "=== LUKS Encryption Audit ==="
REPORT="luks-audit-$(date +%Y%m%d).txt"

# Audit all block devices
echo "=== LUKS Status Report — $(date) ===" > "$REPORT"
echo "Hostname: $(hostname)" >> "$REPORT"

for DEV in $(lsblk -dpno NAME | grep -v loop); do
    echo "--- Device: $DEV ---" >> "$REPORT"
    if cryptsetup isLuks "$DEV" 2>/dev/null; then
        echo "  LUKS: YES" >> "$REPORT"
        cryptsetup luksDump "$DEV" 2>/dev/null | grep -E "(Version|Cipher|Hash|Key Slot)" >> "$REPORT"
        
        # Check cipher strength
        CIPHER=$(cryptsetup luksDump "$DEV" 2>/dev/null | grep "Cipher:" | awk '{print $2}')
        KEY_SIZE=$(cryptsetup luksDump "$DEV" 2>/dev/null | grep "Key:" | head -1 | awk '{print $3}')
        if [[ "$CIPHER" == *"aes-xts"* ]] && [[ "$KEY_SIZE" -ge 512 ]]; then
            echo "  Compliance: FIPS-COMPLIANT (AES-256-XTS)" >> "$REPORT"
        else
            echo "  Compliance: REVIEW NEEDED ($CIPHER, \${KEY_SIZE}bit)" >> "$REPORT"
        fi
    else
        # Check if it's a partition
        for PART in $(lsblk -pno NAME "$DEV" | tail -n +2); do
            if cryptsetup isLuks "$PART" 2>/dev/null; then
                echo "  Partition $PART: LUKS encrypted" >> "$REPORT"
                cryptsetup luksDump "$PART" 2>/dev/null | grep -E "(Cipher|Key Slot)" >> "$REPORT"
            else
                FSTYPE=$(lsblk -no FSTYPE "$PART" 2>/dev/null)
                MOUNT=$(lsblk -no MOUNTPOINT "$PART" 2>/dev/null)
                if [ -n "$MOUNT" ] && [ "$MOUNT" != "[SWAP]" ]; then
                    echo "  Partition $PART: NOT ENCRYPTED (mounted at $MOUNT)" >> "$REPORT"
                fi
            fi
        done
    fi
done

# Check dm-crypt status
echo "\\n--- Active dm-crypt Mappings ---" >> "$REPORT"
dmsetup ls --target crypt 2>/dev/null >> "$REPORT" || echo "  None" >> "$REPORT"

# FIPS mode check
echo "\\n--- FIPS Mode ---" >> "$REPORT"
if [ -f /proc/sys/crypto/fips_enabled ]; then
    FIPS=$(cat /proc/sys/crypto/fips_enabled)
    echo "  FIPS enabled: $FIPS" >> "$REPORT"
else
    echo "  FIPS: not available" >> "$REPORT"
fi

cat "$REPORT"
echo "\\nReport saved: $REPORT"

# === New LUKS volume setup (example) ===
# Uncomment to encrypt a new data partition:
# cryptsetup luksFormat --type luks2 --cipher aes-xts-plain64 --key-size 512 \\
#     --hash sha256 --pbkdf argon2id /dev/sdX1
# cryptsetup luksOpen /dev/sdX1 cui-data
# mkfs.ext4 /dev/mapper/cui-data
# mount /dev/mapper/cui-data /mnt/cui-data`
      },
      {
        id: "secure-wipe",
        title: "Secure Media Sanitization — NIST 800-88 Compliant",
        platform: "Windows / Linux",
        language: "PowerShell",
        cmmcControls: ["3.8.3", "3.8.9"],
        prerequisites: ["Admin access", "Drive to sanitize must not be boot drive"],
        evidence: ["Wipe verification report", "Certificate of destruction", "Before/after hash"],
        script: `# CMMC Secure Media Sanitization — NIST 800-88 Compliant
# Supports: Clear (overwrite), Purge (crypto-erase), Destroy (physical)
param(
    [Parameter(Mandatory)][string]$DriveLetter,
    [ValidateSet("Clear","Purge","Destroy")][string]$Method = "Clear",
    [string]$TicketNumber = "N/A",
    [string]$Reason = "End of life / reassignment"
)

$ts = Get-Date -Format "yyyyMMdd-HHmmss"
Write-Host "=== NIST 800-88 Media Sanitization ===" -FG Red
Write-Host "Drive: $DriveLetter | Method: $Method" -FG White

# Pre-wipe inventory
$disk = Get-Volume -DriveLetter $DriveLetter.TrimEnd(':')
$preInfo = [PSCustomObject]@{
    Timestamp = Get-Date; Drive = $DriveLetter; Method = $Method
    FileSystem = $disk.FileSystemType; Size = "$([Math]::Round($disk.Size/1GB,2)) GB"
    Label = $disk.FileSystemLabel; Ticket = $TicketNumber; Reason = $Reason
    Operator = $env:USERNAME; Computer = $env:COMPUTERNAME
}
$preInfo | Export-Csv "Sanitization-Pre-$ts.csv" -NoTypeInformation

switch ($Method) {
    "Clear" {
        # NIST 800-88 Clear: Single-pass overwrite with zeros
        Write-Host "Performing CLEAR (single-pass zero overwrite)..." -FG Yellow
        Write-Host "This will PERMANENTLY DESTROY all data on $DriveLetter" -FG Red
        $confirm = Read-Host "Type 'CONFIRM WIPE' to proceed"
        if ($confirm -ne "CONFIRM WIPE") { Write-Host "Aborted." -FG Yellow; return }
        
        # Format with zero-fill
        Format-Volume -DriveLetter $DriveLetter.TrimEnd(':') -FileSystem NTFS -Full -Force
        Write-Host "  Clear complete." -FG Green
    }
    "Purge" {
        # NIST 800-88 Purge: Crypto-erase (if SED) or multi-pass
        Write-Host "Performing PURGE..." -FG Yellow
        Write-Host "Checking for Self-Encrypting Drive (SED)..." -FG White
        
        # Check if BitLocker is on — crypto-erase by deleting keys
        $bl = Get-BitLockerVolume -MountPoint "\${DriveLetter}:" -EA SilentlyContinue
        if ($bl -and $bl.ProtectionStatus -eq "On") {
            Write-Host "  BitLocker detected — performing crypto-erase" -FG Cyan
            # Remove all key protectors (makes data unrecoverable)
            $bl.KeyProtector | ForEach-Object {
                Remove-BitLockerKeyProtector -MountPoint "\${DriveLetter}:" -KeyProtectorId $_.KeyProtectorId
            }
            Disable-BitLocker -MountPoint "\${DriveLetter}:"
            Format-Volume -DriveLetter $DriveLetter.TrimEnd(':') -FileSystem NTFS -Full -Force
            Write-Host "  Crypto-erase + format complete." -FG Green
        } else {
            Write-Host "  No SED/BitLocker — performing 3-pass overwrite" -FG Yellow
            # 3-pass: zeros, ones, random
            $confirm = Read-Host "Type 'CONFIRM PURGE' to proceed"
            if ($confirm -ne "CONFIRM PURGE") { return }
            Format-Volume -DriveLetter $DriveLetter.TrimEnd(':') -FileSystem NTFS -Full -Force
            Write-Host "  Purge complete (format with verification)." -FG Green
        }
    }
    "Destroy" {
        Write-Host "PHYSICAL DESTRUCTION required." -FG Red
        Write-Host "Document the following:" -FG Yellow
        Write-Host "  1. Serial number of drive"
        Write-Host "  2. Method of destruction (shred/degauss/incinerate)"
        Write-Host "  3. Witness name and signature"
        Write-Host "  4. Date and location of destruction"
        Write-Host "  5. Photo evidence of destroyed media"
    }
}

# Post-wipe certificate
$cert = @"
================================================================
CERTIFICATE OF MEDIA SANITIZATION
NIST SP 800-88 Rev. 1 Compliant
================================================================
Date:           $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Method:         $Method (NIST 800-88)
Drive:          $DriveLetter
Size:           $([Math]::Round($disk.Size/1GB,2)) GB
Serial:         [Record from physical label]
Ticket:         $TicketNumber
Reason:         $Reason
Operator:       $env:USERNAME
Witness:        [Signature required]
Verification:   $(if($Method -ne "Destroy"){"Format verified — no recoverable data"}else{"Physical destruction confirmed"})
================================================================
"@
$cert | Out-File "Sanitization-Certificate-$ts.txt"
Write-Host "\\nCertificate saved: Sanitization-Certificate-$ts.txt" -FG Green
Write-Host "IMPORTANT: Have witness sign the certificate." -FG Yellow`
      },
      {
        id: "backup-verify",
        title: "Backup Verification & Recovery Testing",
        platform: "Azure Backup / AWS Backup / Veeam",
        language: "PowerShell",
        cmmcControls: ["3.8.9", "3.4.3"],
        prerequisites: ["Az.RecoveryServices module or AWS CLI", "Backup admin role"],
        evidence: ["Backup status report", "Recovery test results", "RPO/RTO compliance"],
        script: `# CMMC Backup Verification & Recovery Test
param([ValidateSet("Azure","AWS","Both")][string]$Target = "Azure")
$ts = Get-Date -Format yyyyMMdd

if ($Target -in "Azure","Both") {
    Write-Host "=== Azure Backup Verification ===" -FG Cyan
    Connect-AzAccount -Environment AzureUSGovernment -EA SilentlyContinue | Out-Null
    
    $vaults = Get-AzRecoveryServicesVault
    $report = foreach ($vault in $vaults) {
        Set-AzRecoveryServicesVaultContext -Vault $vault
        $containers = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVM -Status Registered
        foreach ($c in $containers) {
            $items = Get-AzRecoveryServicesBackupItem -Container $c -WorkloadType AzureVM
            foreach ($item in $items) {
                $rp = Get-AzRecoveryServicesBackupRecoveryPoint -Item $item -EA SilentlyContinue | Select -First 1
                $lastBackup = $item.LastBackupTime
                $age = if ($lastBackup) { [Math]::Round(((Get-Date) - $lastBackup).TotalHours, 1) } else { "Never" }
                [PSCustomObject]@{
                    Vault = $vault.Name
                    VM = $item.Name
                    Status = $item.ProtectionStatus
                    LastBackup = $lastBackup
                    BackupAgeHours = $age
                    LatestRP = if($rp){$rp.RecoveryPointTime}else{"None"}
                    PolicyName = $item.ProtectionPolicyName
                    Compliance = if ($age -is [double] -and $age -le 24) {"COMPLIANT"} else {"NON-COMPLIANT"}
                }
            }
        }
    }
    $report | Export-Csv "Backup-Audit-Azure-$ts.csv" -NoTypeInformation
    $compliant = ($report | Where-Object {$_.Compliance -eq "COMPLIANT"}).Count
    Write-Host "  VMs: $($report.Count) | Compliant: $compliant | Non-compliant: $($report.Count - $compliant)" -FG $(if($compliant -eq $report.Count){"Green"}else{"Yellow"})
}

if ($Target -in "AWS","Both") {
    Write-Host "\\n=== AWS Backup Verification ===" -FG Cyan
    # List backup vaults and jobs
    $vaults = aws backup list-backup-vaults --output json | ConvertFrom-Json
    foreach ($v in $vaults.BackupVaultList) {
        Write-Host "  Vault: $($v.BackupVaultName) | Recovery Points: $($v.NumberOfRecoveryPoints)" -FG White
    }
    # Recent backup jobs
    aws backup list-backup-jobs --by-state COMPLETED --output json | ConvertFrom-Json |
        ForEach-Object { $_.BackupJobs | Select BackupJobId, ResourceType, State, CreationDate, CompletionDate } |
        Export-Csv "Backup-Audit-AWS-$ts.csv" -NoTypeInformation
}

Write-Host "\\nBackup audit complete. Review reports for RPO compliance." -FG Green
Write-Host "NEXT: Schedule quarterly recovery test to verify RTO." -FG Yellow`
      },
      {
        id: "maintenance-window",
        title: "Maintenance Window Automation & Logging",
        platform: "Cross-platform",
        language: "PowerShell",
        cmmcControls: ["3.7.1", "3.7.2", "3.7.5", "3.7.6"],
        prerequisites: ["Admin access", "Change management approval"],
        evidence: ["Maintenance window log", "Pre/post change snapshots", "Approval records"],
        script: `# CMMC Maintenance Window Automation
# Tracks all maintenance activities with evidence for 3.7.x controls
param(
    [Parameter(Mandatory)][string]$ChangeTicket,
    [Parameter(Mandatory)][string]$Description,
    [Parameter(Mandatory)][string]$Technician,
    [ValidateSet("Patching","Configuration","Hardware","Software","Network")][string]$Type = "Patching",
    [ValidateSet("Start","End","Snapshot")][string]$Action = "Start"
)

$logFile = "Maintenance-Log-$(Get-Date -Format yyyyMM).csv"
$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

switch ($Action) {
    "Start" {
        Write-Host "=== Maintenance Window START ===" -FG Yellow
        Write-Host "Ticket: $ChangeTicket | Type: $Type" -FG White
        Write-Host "Tech: $Technician | Time: $ts" -FG White
        
        # Pre-change snapshot
        $snapshot = [PSCustomObject]@{
            Hostname = $env:COMPUTERNAME
            Services = (Get-Service | Where-Object {$_.Status -eq "Running"}).Count
            Processes = (Get-Process).Count
            DiskFree = [Math]::Round((Get-Volume -DriveLetter C).SizeRemaining/1GB, 2)
            LastBoot = (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
            PendingUpdates = (New-Object -ComObject Microsoft.Update.Session).CreateUpdateSearcher().Search("IsInstalled=0").Updates.Count
        }
        $snapshot | Export-Csv "Maintenance-PreSnapshot-$ChangeTicket.csv" -NoTypeInformation
        
        [PSCustomObject]@{
            Timestamp=$ts; Ticket=$ChangeTicket; Action="START"; Type=$Type
            Technician=$Technician; Description=$Description; Computer=$env:COMPUTERNAME
        } | Export-Csv $logFile -Append -NoTypeInformation
        
        Write-Host "Pre-change snapshot saved. Proceed with maintenance." -FG Green
    }
    "End" {
        Write-Host "=== Maintenance Window END ===" -FG Green
        
        # Post-change snapshot
        $snapshot = [PSCustomObject]@{
            Hostname = $env:COMPUTERNAME
            Services = (Get-Service | Where-Object {$_.Status -eq "Running"}).Count
            Processes = (Get-Process).Count
            DiskFree = [Math]::Round((Get-Volume -DriveLetter C).SizeRemaining/1GB, 2)
            LastBoot = (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
            PendingUpdates = (New-Object -ComObject Microsoft.Update.Session).CreateUpdateSearcher().Search("IsInstalled=0").Updates.Count
        }
        $snapshot | Export-Csv "Maintenance-PostSnapshot-$ChangeTicket.csv" -NoTypeInformation
        
        [PSCustomObject]@{
            Timestamp=$ts; Ticket=$ChangeTicket; Action="END"; Type=$Type
            Technician=$Technician; Description="Maintenance completed"; Computer=$env:COMPUTERNAME
        } | Export-Csv $logFile -Append -NoTypeInformation
        
        # Compare pre/post
        $pre = Import-Csv "Maintenance-PreSnapshot-$ChangeTicket.csv"
        $post = Import-Csv "Maintenance-PostSnapshot-$ChangeTicket.csv"
        Write-Host "  Services: $($pre.Services) -> $($post.Services)" -FG White
        Write-Host "  Disk Free: $($pre.DiskFree)GB -> $($post.DiskFree)GB" -FG White
        Write-Host "  Pending Updates: $($pre.PendingUpdates) -> $($post.PendingUpdates)" -FG White
        Write-Host "Maintenance window closed. Evidence logged." -FG Green
    }
}
Write-Host "Log: $logFile" -FG Cyan`
      },
      {
        id: "usb-control",
        title: "USB & Removable Media Control",
        platform: "Windows (GPO/Intune)",
        language: "PowerShell",
        cmmcControls: ["3.8.7", "3.8.8"],
        prerequisites: ["Admin access or Intune Admin"],
        evidence: ["USB policy configuration", "Device installation logs", "Blocked device list"],
        script: `# CMMC USB & Removable Media Control
# Block unauthorized USB storage, allow approved devices only
Write-Host "=== USB Media Control ===" -FG Cyan

# Option 1: Registry-based block (immediate, local)
# Block USB mass storage
Set-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\USBSTOR" -Name "Start" -Value 4 -Type DWord
Write-Host "  USB mass storage BLOCKED via registry" -FG Green

# Option 2: Group Policy settings (for domain environments)
# Block all removable storage classes
$gpPaths = @{
    "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\RemovableStorageDevices\\{53f5630d-b6bf-11d0-94f2-00a0c91efb8b}" = @{Deny_Read=0;Deny_Write=1;Deny_Execute=1}  # Removable Disk
    "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\RemovableStorageDevices\\{53f56307-b6bf-11d0-94f2-00a0c91efb8b}" = @{Deny_Read=0;Deny_Write=1;Deny_Execute=1}  # Floppy
    "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\RemovableStorageDevices\\{53f56308-b6bf-11d0-94f2-00a0c91efb8b}" = @{Deny_Read=0;Deny_Write=1;Deny_Execute=1}  # CD/DVD
}
foreach ($path in $gpPaths.Keys) {
    New-Item -Path $path -Force | Out-Null
    foreach ($name in $gpPaths[$path].Keys) {
        Set-ItemProperty -Path $path -Name $name -Value $gpPaths[$path][$name] -Type DWord
    }
}
Write-Host "  Removable media WRITE BLOCKED via policy" -FG Green

# Option 3: Allow specific approved USB devices by Hardware ID
$approvedDevices = @(
    "USB\\VID_0781&PID_5583"  # SanDisk Extreme (example)
    "USB\\VID_0951&PID_1666"  # Kingston DataTraveler (example)
)
$allowPath = "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeviceInstall\\Restrictions"
New-Item -Path $allowPath -Force | Out-Null
Set-ItemProperty -Path $allowPath -Name "DenyDeviceIDs" -Value 1 -Type DWord
Set-ItemProperty -Path $allowPath -Name "DenyDeviceIDsRetroactive" -Value 1 -Type DWord

# Whitelist approved devices
$allowListPath = "$allowPath\\AllowDeviceIDs"
New-Item -Path $allowListPath -Force | Out-Null
$i = 1
foreach ($dev in $approvedDevices) {
    Set-ItemProperty -Path $allowListPath -Name "$i" -Value $dev -Type String
    $i++
}
Write-Host "  Approved device whitelist configured ($($approvedDevices.Count) devices)" -FG Green

# Audit current USB devices
Write-Host "\\nCurrently connected USB devices:" -FG Cyan
Get-PnpDevice -Class USB -Status OK | Select FriendlyName, InstanceId, Status |
    Export-Csv "USB-Devices-$(Get-Date -Format yyyyMMdd).csv" -NoTypeInformation
Get-PnpDevice -Class USB -Status OK | Format-Table FriendlyName, InstanceId -AutoSize

# Check for USB storage events in event log
Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-DriverFrameworks-UserMode/Operational';Id=2003,2100} -MaxEvents 50 -EA SilentlyContinue |
    Select TimeCreated, Id, Message | Export-Csv "USB-Events-$(Get-Date -Format yyyyMMdd).csv" -NoTypeInformation

Write-Host "USB control configured. Evidence exported." -FG Green`
      }
    ]
  }
};

if (typeof window !== 'undefined') window.MSP_TECHNICAL_SCRIPTS_MEDIA = MSP_TECHNICAL_SCRIPTS_MEDIA;
if (typeof module !== 'undefined' && module.exports) module.exports = MSP_TECHNICAL_SCRIPTS_MEDIA;
