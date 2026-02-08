// MSP/MSSP Technical Scripts — Part 4: Network Security
// Firewall rules, NSG/SG configs, VPN, DNS, IDS/IPS Suricata, Zero Trust
// CMMC Controls: 3.13.1-3.13.15
const MSP_TECHNICAL_SCRIPTS_NETWORK = {
    version: "1.0.0",
    lastUpdated: "2026-02-08",
    network: {
        title: "Network Security Scripts",
        description: "Boundary protection, segmentation, VPN, DNS security, IDS/IPS, and zero-trust network configurations.",
        subsections: [
            {
                id: "azure-nsg",
                title: "Azure — NSG & Azure Firewall CMMC Rules",
                platform: "Azure GCC High",
                language: "PowerShell",
                cmmcControls: ["3.13.1", "3.13.2", "3.13.5", "3.13.6"],
                prerequisites: ["Az module", "Network Contributor role"],
                evidence: ["NSG rule exports", "Azure Firewall policy export", "Flow log configuration"],
                script: `# CMMC Azure NSG + Firewall Configuration — GCC High
Connect-AzAccount -Environment AzureUSGovernment
$rg = "rg-cmmc-network"; $loc = "usgovvirginia"

# === CUI Subnet NSG — Strict inbound/outbound ===
$cuiNsg = New-AzNetworkSecurityGroup -Name "nsg-cui-subnet" -ResourceGroupName $rg -Location $loc

# Inbound: Allow only from VPN gateway + management subnet
$cuiNsg | Add-AzNetworkSecurityRuleConfig -Name "Allow-VPN-Inbound" -Priority 100 -Direction Inbound -Access Allow \\
    -Protocol Tcp -SourceAddressPrefix "10.0.1.0/24" -SourcePortRange "*" -DestinationAddressPrefix "10.0.10.0/24" -DestinationPortRange "443","3389","22"
$cuiNsg | Add-AzNetworkSecurityRuleConfig -Name "Allow-Mgmt-Inbound" -Priority 110 -Direction Inbound -Access Allow \\
    -Protocol Tcp -SourceAddressPrefix "10.0.2.0/24" -SourcePortRange "*" -DestinationAddressPrefix "10.0.10.0/24" -DestinationPortRange "443","3389","5985-5986"
$cuiNsg | Add-AzNetworkSecurityRuleConfig -Name "Deny-All-Inbound" -Priority 4096 -Direction Inbound -Access Deny \\
    -Protocol "*" -SourceAddressPrefix "*" -SourcePortRange "*" -DestinationAddressPrefix "*" -DestinationPortRange "*"

# Outbound: Allow only to specific services, deny internet
$cuiNsg | Add-AzNetworkSecurityRuleConfig -Name "Allow-DNS" -Priority 100 -Direction Outbound -Access Allow \\
    -Protocol Udp -SourceAddressPrefix "10.0.10.0/24" -SourcePortRange "*" -DestinationAddressPrefix "10.0.2.10/32" -DestinationPortRange "53"
$cuiNsg | Add-AzNetworkSecurityRuleConfig -Name "Allow-AzureAD" -Priority 110 -Direction Outbound -Access Allow \\
    -Protocol Tcp -SourceAddressPrefix "10.0.10.0/24" -SourcePortRange "*" -DestinationAddressPrefix "AzureActiveDirectory" -DestinationPortRange "443"
$cuiNsg | Add-AzNetworkSecurityRuleConfig -Name "Allow-AzureMonitor" -Priority 120 -Direction Outbound -Access Allow \\
    -Protocol Tcp -SourceAddressPrefix "10.0.10.0/24" -SourcePortRange "*" -DestinationAddressPrefix "AzureMonitor" -DestinationPortRange "443"
$cuiNsg | Add-AzNetworkSecurityRuleConfig -Name "Deny-Internet-Outbound" -Priority 4096 -Direction Outbound -Access Deny \\
    -Protocol "*" -SourceAddressPrefix "*" -SourcePortRange "*" -DestinationAddressPrefix "Internet" -DestinationPortRange "*"
$cuiNsg | Set-AzNetworkSecurityGroup

# === DMZ NSG ===
$dmzNsg = New-AzNetworkSecurityGroup -Name "nsg-dmz" -ResourceGroupName $rg -Location $loc
$dmzNsg | Add-AzNetworkSecurityRuleConfig -Name "Allow-HTTPS-Inbound" -Priority 100 -Direction Inbound -Access Allow \\
    -Protocol Tcp -SourceAddressPrefix "Internet" -SourcePortRange "*" -DestinationAddressPrefix "10.0.20.0/24" -DestinationPortRange "443"
$dmzNsg | Add-AzNetworkSecurityRuleConfig -Name "Deny-All-Inbound" -Priority 4096 -Direction Inbound -Access Deny \\
    -Protocol "*" -SourceAddressPrefix "*" -SourcePortRange "*" -DestinationAddressPrefix "*" -DestinationPortRange "*"
$dmzNsg | Add-AzNetworkSecurityRuleConfig -Name "Deny-To-CUI" -Priority 100 -Direction Outbound -Access Deny \\
    -Protocol "*" -SourceAddressPrefix "10.0.20.0/24" -SourcePortRange "*" -DestinationAddressPrefix "10.0.10.0/24" -DestinationPortRange "*"
$dmzNsg | Set-AzNetworkSecurityGroup

# === Enable NSG Flow Logs ===
$workspace = Get-AzOperationalInsightsWorkspace -ResourceGroupName $rg -Name "law-sentinel-cmmc"
$storageAcct = Get-AzStorageAccount -ResourceGroupName $rg -Name "stcmmcflowlogs"
foreach ($nsg in @($cuiNsg, $dmzNsg)) {
    Set-AzNetworkWatcherFlowLog -NetworkWatcher (Get-AzNetworkWatcher -ResourceGroupName "NetworkWatcherRG") \\
        -TargetResourceId $nsg.Id -StorageAccountId $storageAcct.Id -EnableFlowLog $true \\
        -FormatVersion 2 -EnableRetention $true -RetentionPolicyDays 365 \\
        -EnableTrafficAnalytics -TrafficAnalyticsWorkspaceId $workspace.ResourceId \\
        -TrafficAnalyticsInterval 10
    Write-Host "Flow logs enabled for $($nsg.Name)" -FG Green
}

# === Export NSG rules for evidence ===
foreach ($nsg in @($cuiNsg, $dmzNsg)) {
    $nsg.SecurityRules | Select Name, Priority, Direction, Access, Protocol, SourceAddressPrefix, DestinationAddressPrefix, DestinationPortRange |
        Export-Csv "NSG-Rules-$($nsg.Name)-$(Get-Date -Format 'yyyyMMdd').csv" -NoTypeInformation
}
Write-Host "NSG rules exported for evidence." -FG Green`
            },
            {
                id: "aws-sg-nacl",
                title: "AWS — Security Groups & NACLs for CMMC",
                platform: "AWS GovCloud",
                language: "Bash",
                cmmcControls: ["3.13.1", "3.13.2", "3.13.5", "3.13.6"],
                prerequisites: ["AWS CLI v2 for GovCloud", "EC2/VPC permissions"],
                evidence: ["Security group rules export", "NACL rules export", "VPC Flow Logs config"],
                script: `#!/bin/bash
# CMMC AWS Security Groups + NACLs — GovCloud
set -euo pipefail
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=tag:Name,Values=cmmc-vpc" --query 'Vpcs[0].VpcId' --output text)
echo "=== CMMC Network Security | VPC: $VPC_ID ==="

# CUI Subnet Security Group
CUI_SG=$(aws ec2 create-security-group --group-name "cmmc-cui-sg" --description "CUI subnet - strict access" --vpc-id "$VPC_ID" --query 'GroupId' --output text)
# Inbound: RDP/SSH from VPN only
aws ec2 authorize-security-group-ingress --group-id "$CUI_SG" --protocol tcp --port 3389 --cidr 10.0.1.0/24  # VPN subnet
aws ec2 authorize-security-group-ingress --group-id "$CUI_SG" --protocol tcp --port 22 --cidr 10.0.1.0/24
aws ec2 authorize-security-group-ingress --group-id "$CUI_SG" --protocol tcp --port 443 --cidr 10.0.2.0/24  # Mgmt subnet
# Outbound: Restrict to internal + AWS services only
aws ec2 revoke-security-group-egress --group-id "$CUI_SG" --protocol all --cidr 0.0.0.0/0  # Remove default allow-all
aws ec2 authorize-security-group-egress --group-id "$CUI_SG" --protocol tcp --port 443 --cidr 10.0.0.0/16
aws ec2 authorize-security-group-egress --group-id "$CUI_SG" --protocol udp --port 53 --cidr 10.0.2.10/32  # DNS
aws ec2 authorize-security-group-egress --group-id "$CUI_SG" --ip-permissions "IpProtocol=tcp,FromPort=443,ToPort=443,PrefixListIds=[{PrefixListId=$(aws ec2 describe-prefix-lists --filters 'Name=prefix-list-name,Values=com.amazonaws.us-gov-west-1.s3' --query 'PrefixLists[0].PrefixListId' --output text)}]"
echo "CUI SG: $CUI_SG"

# DMZ Security Group
DMZ_SG=$(aws ec2 create-security-group --group-name "cmmc-dmz-sg" --description "DMZ - public-facing" --vpc-id "$VPC_ID" --query 'GroupId' --output text)
aws ec2 authorize-security-group-ingress --group-id "$DMZ_SG" --protocol tcp --port 443 --cidr 0.0.0.0/0
aws ec2 revoke-security-group-egress --group-id "$DMZ_SG" --protocol all --cidr 0.0.0.0/0
aws ec2 authorize-security-group-egress --group-id "$DMZ_SG" --protocol tcp --port 443 --cidr 10.0.3.0/24  # App tier only
echo "DMZ SG: $DMZ_SG"

# Management Security Group
MGMT_SG=$(aws ec2 create-security-group --group-name "cmmc-mgmt-sg" --description "Management subnet" --vpc-id "$VPC_ID" --query 'GroupId' --output text)
aws ec2 authorize-security-group-ingress --group-id "$MGMT_SG" --protocol tcp --port 22 --cidr 10.0.1.0/24
aws ec2 authorize-security-group-ingress --group-id "$MGMT_SG" --protocol tcp --port 3389 --cidr 10.0.1.0/24
aws ec2 authorize-security-group-ingress --group-id "$MGMT_SG" --protocol tcp --port 443 --cidr 10.0.1.0/24
echo "MGMT SG: $MGMT_SG"

# Network ACL — CUI Subnet (stateless, additional layer)
CUI_SUBNET=$(aws ec2 describe-subnets --filters "Name=tag:Name,Values=cmmc-cui-subnet" --query 'Subnets[0].SubnetId' --output text)
NACL=$(aws ec2 create-network-acl --vpc-id "$VPC_ID" --query 'NetworkAcl.NetworkAclId' --output text)
aws ec2 create-network-acl-entry --network-acl-id "$NACL" --rule-number 100 --protocol tcp --port-range From=443,To=443 --cidr-block 10.0.0.0/16 --rule-action allow --ingress
aws ec2 create-network-acl-entry --network-acl-id "$NACL" --rule-number 110 --protocol tcp --port-range From=3389,To=3389 --cidr-block 10.0.1.0/24 --rule-action allow --ingress
aws ec2 create-network-acl-entry --network-acl-id "$NACL" --rule-number 120 --protocol tcp --port-range From=22,To=22 --cidr-block 10.0.1.0/24 --rule-action allow --ingress
aws ec2 create-network-acl-entry --network-acl-id "$NACL" --rule-number 32766 --protocol -1 --cidr-block 0.0.0.0/0 --rule-action deny --ingress
# Outbound
aws ec2 create-network-acl-entry --network-acl-id "$NACL" --rule-number 100 --protocol tcp --port-range From=443,To=443 --cidr-block 10.0.0.0/16 --rule-action allow --egress
aws ec2 create-network-acl-entry --network-acl-id "$NACL" --rule-number 110 --protocol udp --port-range From=53,To=53 --cidr-block 10.0.2.10/32 --rule-action allow --egress
aws ec2 create-network-acl-entry --network-acl-id "$NACL" --rule-number 120 --protocol tcp --port-range From=1024,To=65535 --cidr-block 10.0.0.0/16 --rule-action allow --egress
aws ec2 create-network-acl-entry --network-acl-id "$NACL" --rule-number 32766 --protocol -1 --cidr-block 0.0.0.0/0 --rule-action deny --egress
aws ec2 replace-network-acl-association --association-id "$(aws ec2 describe-network-acls --filters "Name=association.subnet-id,Values=$CUI_SUBNET" --query 'NetworkAcls[0].Associations[0].NetworkAclAssociationId' --output text)" --network-acl-id "$NACL"

# Enable VPC Flow Logs
aws ec2 create-flow-logs --resource-type VPC --resource-ids "$VPC_ID" \\
    --traffic-type ALL --log-destination-type cloud-watch-logs \\
    --log-group-name "/aws/vpc-flow-logs" --deliver-logs-permission-arn "arn:aws-us-gov:iam::$(aws sts get-caller-identity --query Account --output text):role/VPCFlowLogsRole" \\
    --max-aggregation-interval 60

# Export for evidence
DIR="network-audit-$(date +%Y%m%d)"; mkdir -p "$DIR"
aws ec2 describe-security-groups --group-ids "$CUI_SG" "$DMZ_SG" "$MGMT_SG" --output json > "$DIR/security-groups.json"
aws ec2 describe-network-acls --network-acl-ids "$NACL" --output json > "$DIR/nacls.json"
echo "Network security configured. Evidence in: $DIR/"`
            },
            {
                id: "suricata-ids",
                title: "Suricata IDS/IPS — CMMC Detection Rules",
                platform: "Linux (any distro)",
                language: "Bash",
                cmmcControls: ["3.13.1", "3.14.6", "3.14.7"],
                prerequisites: ["Suricata installed", "Network tap or SPAN port configured"],
                evidence: ["Suricata rule files", "Alert logs", "EVE JSON logs"],
                script: `#!/bin/bash
# CMMC Suricata IDS/IPS Rules Deployment
set -euo pipefail
RULES_DIR="/etc/suricata/rules"
mkdir -p "$RULES_DIR"

# === Custom CMMC Detection Rules ===
cat > "$RULES_DIR/cmmc-custom.rules" << 'RULES'
# ============================================================
# CMMC Custom Suricata Rules
# ============================================================

# --- CUI Keyword Detection in Cleartext ---
alert http any any -> any any (msg:"CMMC: CUI keyword in cleartext HTTP"; content:"CONTROLLED UNCLASSIFIED"; nocase; flow:to_server,established; classtype:policy-violation; sid:9000001; rev:1;)
alert http any any -> any any (msg:"CMMC: ITAR keyword in cleartext HTTP"; content:"ITAR"; nocase; content:"export"; nocase; distance:0; within:50; flow:to_server,established; classtype:policy-violation; sid:9000002; rev:1;)
alert smtp any any -> any any (msg:"CMMC: CUI in unencrypted email"; content:"CUI"; nocase; flow:to_server,established; classtype:policy-violation; sid:9000003; rev:1;)

# --- Unauthorized Protocol Detection ---
alert tcp any any -> any 23 (msg:"CMMC: Telnet connection attempt"; flow:to_server; classtype:policy-violation; sid:9000010; rev:1;)
alert tcp any any -> any 21 (msg:"CMMC: FTP connection attempt"; flow:to_server; classtype:policy-violation; sid:9000011; rev:1;)
alert tcp any any -> any 80 (msg:"CMMC: Unencrypted HTTP to external"; flow:to_server,established; classtype:policy-violation; sid:9000012; rev:1;)
alert tcp any any -> any 445 (msg:"CMMC: SMB to external network"; flow:to_server; classtype:policy-violation; sid:9000013; rev:1;)
alert tcp any any -> any 135:139 (msg:"CMMC: NetBIOS to external"; flow:to_server; classtype:policy-violation; sid:9000014; rev:1;)

# --- Brute Force Detection ---
alert tcp any any -> any 22 (msg:"CMMC: SSH brute force"; flow:to_server; flags:S; threshold:type both, track by_src, count 10, seconds 60; classtype:attempted-admin; sid:9000020; rev:1;)
alert tcp any any -> any 3389 (msg:"CMMC: RDP brute force"; flow:to_server; flags:S; threshold:type both, track by_src, count 10, seconds 60; classtype:attempted-admin; sid:9000021; rev:1;)
alert http any any -> any any (msg:"CMMC: Web login brute force"; content:"POST"; http_method; content:"login"; http_uri; nocase; threshold:type both, track by_src, count 20, seconds 120; classtype:attempted-admin; sid:9000022; rev:1;)

# --- Data Exfiltration Indicators ---
alert dns any any -> any any (msg:"CMMC: DNS tunnel suspected (long query)"; dns.query; content:"|00|"; offset:0; depth:1; isdataat:60; classtype:policy-violation; sid:9000030; rev:1;)
alert tcp any any -> any any (msg:"CMMC: Large outbound transfer >100MB"; flow:to_server,established; stream_size:server,>,104857600; classtype:policy-violation; sid:9000031; rev:1;)
alert tls any any -> any any (msg:"CMMC: TLS to suspicious TLD"; tls.sni; content:".tk"; endswith; classtype:policy-violation; sid:9000032; rev:1;)
alert tls any any -> any any (msg:"CMMC: TLS to suspicious TLD .xyz"; tls.sni; content:".xyz"; endswith; classtype:policy-violation; sid:9000033; rev:1;)

# --- Malware / C2 Indicators ---
alert http any any -> any any (msg:"CMMC: PowerShell download cradle"; content:"powershell"; nocase; content:"downloadstring"; nocase; distance:0; within:100; classtype:trojan-activity; sid:9000040; rev:1;)
alert http any any -> any any (msg:"CMMC: Certutil download abuse"; content:"certutil"; nocase; content:"-urlcache"; nocase; classtype:trojan-activity; sid:9000041; rev:1;)
alert dns any any -> any any (msg:"CMMC: Known malware domain"; dns.query; content:"malware-c2.example.com"; nocase; classtype:trojan-activity; sid:9000042; rev:1;)

# --- Lateral Movement ---
alert tcp $HOME_NET any -> $HOME_NET 5985 (msg:"CMMC: WinRM lateral movement"; flow:to_server; classtype:attempted-admin; sid:9000050; rev:1;)
alert tcp $HOME_NET any -> $HOME_NET 5986 (msg:"CMMC: WinRM-S lateral movement"; flow:to_server; classtype:attempted-admin; sid:9000051; rev:1;)
alert tcp $HOME_NET any -> $HOME_NET 445 (msg:"CMMC: Internal SMB (potential lateral)"; flow:to_server,established; content:"|ff|SMB"; offset:0; depth:4; threshold:type both, track by_src, count 5, seconds 60; classtype:attempted-admin; sid:9000052; rev:1;)

# --- Compliance: Weak Crypto ---
alert tls any any -> any any (msg:"CMMC: TLS 1.0 detected"; tls.version:1.0; classtype:policy-violation; sid:9000060; rev:1;)
alert tls any any -> any any (msg:"CMMC: TLS 1.1 detected"; tls.version:1.1; classtype:policy-violation; sid:9000061; rev:1;)
alert tls any any -> any any (msg:"CMMC: SSLv3 detected"; tls.version:SSLV3; classtype:policy-violation; sid:9000062; rev:1;)
RULES

# === Suricata Configuration ===
cat > /etc/suricata/suricata-cmmc.yaml << 'YAML'
%YAML 1.1
---
vars:
  address-groups:
    HOME_NET: "[10.0.0.0/8,172.16.0.0/12,192.168.0.0/16]"
    EXTERNAL_NET: "!$HOME_NET"
    CUI_NET: "[10.0.10.0/24]"
  port-groups:
    HTTP_PORTS: "[80,443,8080,8443]"
    SSH_PORTS: "[22]"

default-log-dir: /var/log/suricata/
outputs:
  - eve-log:
      enabled: yes
      filetype: regular
      filename: eve.json
      types:
        - alert: { tagged-packets: yes; metadata: yes }
        - dns: { query: yes; answer: yes }
        - tls: { extended: yes }
        - http: { extended: yes }
        - files: { force-magic: yes; force-hash: [md5, sha256] }
        - flow
        - netflow
  - fast:
      enabled: yes
      filename: fast.log
  - stats:
      enabled: yes
      filename: stats.log
      interval: 60

default-rule-path: /etc/suricata/rules
rule-files:
  - suricata.rules
  - cmmc-custom.rules

af-packet:
  - interface: eth0
    cluster-id: 99
    cluster-type: cluster_flow
    defrag: yes

app-layer:
  protocols:
    tls:
      enabled: yes
      detection-ports: { dp: "443,465,993,995,8443" }
    http:
      enabled: yes
    dns:
      enabled: yes
    smb:
      enabled: yes
    ssh:
      enabled: yes
YAML

# Update ET rules
suricata-update 2>/dev/null || echo "Run: suricata-update to fetch ET rulesets"

# Test configuration
suricata -T -c /etc/suricata/suricata-cmmc.yaml 2>/dev/null && echo "Config valid" || echo "Config errors — review"

# Restart
systemctl restart suricata 2>/dev/null || suricata -c /etc/suricata/suricata-cmmc.yaml -i eth0 -D

echo "Suricata CMMC rules deployed. Monitor: tail -f /var/log/suricata/fast.log"`
            },
            {
                id: "vpn-audit",
                title: "VPN Configuration Audit & Hardening",
                platform: "Azure VPN / AWS VPN / IPsec",
                language: "PowerShell",
                cmmcControls: ["3.1.12", "3.1.13", "3.13.7", "3.13.8"],
                prerequisites: ["Az module or AWS CLI", "VPN Gateway admin"],
                evidence: ["VPN gateway config export", "Cipher suite audit", "Connection logs"],
                script: `# CMMC VPN Audit — Azure VPN Gateway
Connect-AzAccount -Environment AzureUSGovernment
$rg = "rg-cmmc-network"

# Get VPN Gateway configuration
$gw = Get-AzVirtualNetworkGateway -ResourceGroupName $rg
Write-Host "=== VPN Gateway Audit ===" -FG Cyan
Write-Host "Name: $($gw.Name)"
Write-Host "SKU: $($gw.Sku.Name)"
Write-Host "VPN Type: $($gw.VpnType)"
Write-Host "Generation: $($gw.VpnGatewayGeneration)"

# Check IPsec/IKE policy (should use FIPS-compliant ciphers)
$connections = Get-AzVirtualNetworkGatewayConnection -ResourceGroupName $rg
foreach ($conn in $connections) {
    Write-Host "\\nConnection: $($conn.Name)" -FG White
    Write-Host "  Status: $($conn.ConnectionStatus)"
    Write-Host "  Protocol: $($conn.ConnectionProtocol)"
    
    if ($conn.IpsecPolicies) {
        foreach ($pol in $conn.IpsecPolicies) {
            Write-Host "  IPsec Policy:" -FG Yellow
            Write-Host "    IKE Encryption: $($pol.IkeEncryption)"
            Write-Host "    IKE Integrity: $($pol.IkeIntegrity)"
            Write-Host "    DH Group: $($pol.DhGroup)"
            Write-Host "    IPsec Encryption: $($pol.IpsecEncryption)"
            Write-Host "    IPsec Integrity: $($pol.IpsecIntegrity)"
            Write-Host "    PFS Group: $($pol.PfsGroup)"
            Write-Host "    SA Lifetime (s): $($pol.SaLifeTimeSeconds)"
            Write-Host "    SA Data Size (KB): $($pol.SaDataSizeKilobytes)"
            
            # Validate FIPS compliance
            $fipsEncryption = @("AES256","GCMAES256")
            $fipsIntegrity = @("SHA256","SHA384","GCMAES256")
            $fipsDH = @("DHGroup14","DHGroup24","ECP256","ECP384")
            
            $issues = @()
            if ($pol.IkeEncryption -notin $fipsEncryption) { $issues += "IKE encryption not FIPS: $($pol.IkeEncryption)" }
            if ($pol.IpsecEncryption -notin $fipsEncryption) { $issues += "IPsec encryption not FIPS: $($pol.IpsecEncryption)" }
            if ($pol.DhGroup -notin $fipsDH) { $issues += "DH group weak: $($pol.DhGroup)" }
            
            if ($issues.Count -gt 0) {
                Write-Host "    COMPLIANCE ISSUES:" -FG Red
                $issues | % { Write-Host "      - $_" -FG Red }
            } else {
                Write-Host "    FIPS COMPLIANT" -FG Green
            }
        }
    } else {
        Write-Host "  NO CUSTOM IPSEC POLICY — using defaults (may not be FIPS compliant)" -FG Red
    }
}

# Apply FIPS-compliant IPsec policy
Write-Host "\\nApplying FIPS-compliant IPsec policy..." -FG Cyan
$ipsecPolicy = New-AzIpsecPolicy -IkeEncryption AES256 -IkeIntegrity SHA256 -DhGroup DHGroup14 \\
    -IpsecEncryption GCMAES256 -IpsecIntegrity GCMAES256 -PfsGroup PFS2048 \\
    -SALifeTimeSeconds 28800 -SADataSizeKilobytes 102400000

foreach ($conn in $connections) {
    Set-AzVirtualNetworkGatewayConnection -VirtualNetworkGatewayConnection $conn \\
        -IpsecPolicies $ipsecPolicy -UsePolicyBasedTrafficSelectors $false -Force
    Write-Host "  Updated: $($conn.Name)" -FG Green
}

# Export evidence
$connections | Select Name, ConnectionStatus, ConnectionProtocol, @{N='IkeEncryption';E={$_.IpsecPolicies[0].IkeEncryption}}, @{N='IpsecEncryption';E={$_.IpsecPolicies[0].IpsecEncryption}} |
    Export-Csv "VPN-Audit-$(Get-Date -Format 'yyyyMMdd').csv" -NoTypeInformation
Write-Host "VPN audit complete. Evidence exported." -FG Green`
            },
            {
                id: "dns-security",
                title: "DNS Security — Protective DNS & Logging",
                platform: "Windows DNS / BIND / Azure DNS",
                language: "PowerShell",
                cmmcControls: ["3.13.1", "3.13.4", "3.14.6"],
                prerequisites: ["DNS server admin access"],
                evidence: ["DNS query logs", "Blocked domain lists", "DNS configuration export"],
                script: `# CMMC DNS Security Configuration
Write-Host "=== CMMC DNS Security ===" -FG Cyan

# === Windows DNS Server — Enable Logging + Response Policy ===
# Enable DNS analytical logging
Set-DnsServerDiagnostics -All $true -EnableLoggingForLocalLookupEvent $true \\
    -EnableLoggingForPluginDllEvent $true -EnableLoggingForRecursiveLookupEvent $true \\
    -EnableLoggingForRemoteServerEvent $true -EnableLoggingForServerStartStopEvent $true \\
    -EnableLoggingForTombstoneEvent $true -EnableLoggingForZoneDataWriteEvent $true \\
    -EnableLoggingForZoneLoadingEvent $true -EnableLoggingToFile $true \\
    -LogFilePath "C:\\DNS-Logs\\dns.log" -MaxMBFileSize 500

# DNS query logging via Event Log
wevtutil sl "Microsoft-Windows-DNS-Server/Analytical" /e:true /rt:false

# Create DNS Response Policy Zone for blocking
Add-DnsServerPrimaryZone -Name "rpz.cmmc.local" -ZoneFile "rpz.cmmc.local.dns" -DynamicUpdate None

# Block known malicious TLDs
$blockedTLDs = @(".tk",".ml",".ga",".cf",".gq",".buzz",".top",".work",".click",".link")
foreach ($tld in $blockedTLDs) {
    Add-DnsServerResourceRecordCName -ZoneName "rpz.cmmc.local" -Name "*$tld" -HostNameAlias "sinkhole.cmmc.local" -ErrorAction SilentlyContinue
}

# Block known C2 domains (sample — integrate with threat intel feed)
$blockedDomains = @(
    "malware-c2.example.com","phishing-site.example.net","cryptominer.example.org"
)
foreach ($domain in $blockedDomains) {
    Add-DnsServerResourceRecordA -ZoneName "rpz.cmmc.local" -Name "$domain" -IPv4Address "0.0.0.0" -ErrorAction SilentlyContinue
}

# Configure DNS forwarders (use protective DNS)
# CISA Protective DNS: 
Set-DnsServerForwarder -IPAddress @("208.67.222.222","208.67.220.220") -UseRootHint $false

# DNSSEC validation
Set-DnsServerRecursion -Enable $true -SecureResponse $true

# Export DNS configuration
Get-DnsServerDiagnostics | Export-Csv "DNS-Diagnostics-$(Get-Date -Format 'yyyyMMdd').csv" -NoTypeInformation
Get-DnsServerForwarder | Export-Csv "DNS-Forwarders-$(Get-Date -Format 'yyyyMMdd').csv" -NoTypeInformation
Get-DnsServerZone | Export-Csv "DNS-Zones-$(Get-Date -Format 'yyyyMMdd').csv" -NoTypeInformation

Write-Host "DNS security configured: logging, RPZ blocking, protective forwarders." -FG Green`
            },
            {
                id: "network-audit-script",
                title: "Cross-Platform — Network Security Audit & Evidence",
                platform: "Azure / AWS / On-Prem",
                language: "PowerShell",
                cmmcControls: ["3.13.1", "3.13.2", "3.13.5", "3.13.6", "3.13.8"],
                prerequisites: ["Network admin access", "Az module or AWS CLI"],
                evidence: ["Network topology diagram data", "Firewall rule audit", "Open port scan results"],
                script: `# CMMC Network Security Audit — Comprehensive Evidence Collection
param([ValidateSet("Azure","AWS","OnPrem","All")][string]$Target = "All")
$ts = Get-Date -Format "yyyyMMdd"; $dir = "NetworkAudit-$ts"; New-Item -Path $dir -ItemType Directory -Force | Out-Null

if ($Target -in "Azure","All") {
    Write-Host "=== Azure Network Audit ===" -FG Cyan
    Connect-AzAccount -Environment AzureUSGovernment -ErrorAction SilentlyContinue
    
    # NSG rules
    Get-AzNetworkSecurityGroup | ForEach-Object {
        $nsgName = $_.Name
        $_.SecurityRules | Select @{N='NSG';E={$nsgName}}, Name, Priority, Direction, Access, Protocol, SourceAddressPrefix, DestinationAddressPrefix, DestinationPortRange
    } | Export-Csv "$dir/Azure-NSG-Rules.csv" -NoTypeInformation
    
    # VNet peerings
    Get-AzVirtualNetwork | ForEach-Object {
        $vnet = $_.Name
        $_.VirtualNetworkPeerings | Select @{N='VNet';E={$vnet}}, Name, PeeringState, AllowForwardedTraffic, AllowGatewayTransit
    } | Export-Csv "$dir/Azure-VNet-Peerings.csv" -NoTypeInformation
    
    # Public IPs
    Get-AzPublicIpAddress | Select Name, IpAddress, PublicIpAllocationMethod, @{N='AssociatedTo';E={$_.IpConfiguration.Id}} |
        Export-Csv "$dir/Azure-PublicIPs.csv" -NoTypeInformation
    
    # Azure Firewall rules
    Get-AzFirewall | ForEach-Object {
        $fw = $_.Name
        $_.NetworkRuleCollections | ForEach-Object {
            $col = $_.Name
            $_.Rules | Select @{N='Firewall';E={$fw}}, @{N='Collection';E={$col}}, Name, @{N='Protocols';E={$_.Protocols -join ','}}, @{N='Sources';E={$_.SourceAddresses -join ','}}, @{N='Destinations';E={$_.DestinationAddresses -join ','}}, @{N='Ports';E={$_.DestinationPorts -join ','}}
        }
    } | Export-Csv "$dir/Azure-Firewall-Rules.csv" -NoTypeInformation
    
    Write-Host "  Azure audit exported" -FG Green
}

if ($Target -in "OnPrem","All") {
    Write-Host "=== On-Prem Network Audit ===" -FG Cyan
    
    # Windows Firewall rules
    Get-NetFirewallRule -Enabled True | Get-NetFirewallPortFilter | Select @{N='Rule';E={(Get-NetFirewallRule -AssociatedNetFirewallPortFilter $_).DisplayName}}, Protocol, LocalPort, RemotePort |
        Export-Csv "$dir/Windows-Firewall-Rules.csv" -NoTypeInformation
    
    # Listening ports
    Get-NetTCPConnection -State Listen | Select LocalAddress, LocalPort, OwningProcess, @{N='ProcessName';E={(Get-Process -Id $_.OwningProcess -EA SilentlyContinue).ProcessName}} |
        Export-Csv "$dir/Listening-Ports.csv" -NoTypeInformation
    
    # Network adapters
    Get-NetAdapter | Select Name, Status, LinkSpeed, MacAddress | Export-Csv "$dir/Network-Adapters.csv" -NoTypeInformation
    
    # IP configuration
    Get-NetIPConfiguration | Select InterfaceAlias, @{N='IPv4';E={$_.IPv4Address.IPAddress}}, @{N='Gateway';E={$_.IPv4DefaultGateway.NextHop}}, @{N='DNS';E={$_.DnsServer.ServerAddresses -join ','}} |
        Export-Csv "$dir/IP-Configuration.csv" -NoTypeInformation
    
    # Route table
    Get-NetRoute -AddressFamily IPv4 | Select DestinationPrefix, NextHop, InterfaceAlias, RouteMetric |
        Export-Csv "$dir/Route-Table.csv" -NoTypeInformation
    
    Write-Host "  On-prem audit exported" -FG Green
}

Write-Host "\\nNetwork audit complete. Evidence in: $dir/" -FG Green
Get-ChildItem $dir | Select Name, Length | Format-Table -AutoSize`
            }
        ]
    }
};

if (typeof window !== 'undefined') window.MSP_TECHNICAL_SCRIPTS_NETWORK = MSP_TECHNICAL_SCRIPTS_NETWORK;
if (typeof module !== 'undefined' && module.exports) module.exports = MSP_TECHNICAL_SCRIPTS_NETWORK;
