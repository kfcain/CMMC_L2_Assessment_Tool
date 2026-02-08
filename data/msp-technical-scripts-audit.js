// MSP/MSSP Technical Scripts — Part 2: Audit & Logging
// Sentinel KQL, Splunk SPL, CloudWatch, Chronicle YARA-L, auditd, syslog
// CMMC Controls: 3.3.1-3.3.8
// Version: 1.0.0

const MSP_TECHNICAL_SCRIPTS_AUDIT = {
    version: "1.0.0",
    lastUpdated: "2026-02-08",

    audit: {
        title: "Audit & Logging Scripts",
        description: "SIEM queries, log configuration, retention, and automated review for Sentinel, Splunk, CloudWatch, Chronicle, auditd, and syslog.",
        subsections: [
            {
                id: "sentinel-weekly-review",
                title: "Sentinel — CMMC Weekly Log Review (10 KQL Queries)",
                platform: "Microsoft Sentinel (GCC High)",
                language: "KQL",
                cmmcControls: ["3.3.1", "3.3.2", "3.3.5"],
                prerequisites: ["Sentinel workspace with data connectors", "Log Analytics Reader role"],
                evidence: ["Weekly log review report", "Anomaly investigation records", "Query result exports"],
                script: `// ============================================================
// CMMC Weekly Log Review — 10 KQL Queries
// Run each weekly. Document findings in review report.
// ============================================================

// --- Q1: Failed Sign-Ins (>5 per user in 7d) ---
// CMMC 3.3.5 — Correlate audit records
SigninLogs
| where TimeGenerated > ago(7d)
| where ResultType != "0"
| summarize FailCount=count(), IPs=dcount(IPAddress), LastAttempt=max(TimeGenerated), ErrorCodes=make_set(ResultType) by UserPrincipalName, AppDisplayName
| where FailCount > 5
| sort by FailCount desc

// --- Q2: PIM Role Activations ---
// CMMC 3.1.5, 3.1.7
AuditLogs
| where TimeGenerated > ago(7d)
| where OperationName has "PIM" or OperationName has "role"
| where Result == "success"
| extend Initiator=tostring(InitiatedBy.user.userPrincipalName), TargetRole=tostring(TargetResources[0].displayName)
| project TimeGenerated, Initiator, OperationName, TargetRole

// --- Q3: After-Hours Admin Activity ---
// CMMC 3.3.1
AuditLogs
| where TimeGenerated > ago(7d)
| extend Hour=hourofday(TimeGenerated)
| where Hour < 6 or Hour > 20
| extend Initiator=tostring(InitiatedBy.user.userPrincipalName)
| where Initiator != ""
| summarize Actions=count(), Ops=make_set(OperationName) by Initiator, bin(TimeGenerated, 1h)
| sort by TimeGenerated desc

// --- Q4: Admin Group Membership Changes ---
// CMMC 3.1.1
AuditLogs
| where TimeGenerated > ago(7d)
| where OperationName in ("Add member to role","Add member to group","Remove member from role")
| extend Target=tostring(TargetResources[0].displayName), Initiator=tostring(InitiatedBy.user.userPrincipalName)
| where Target has_any ("Admin","Global","Security","Privileged")
| project TimeGenerated, Initiator, OperationName, Target, Result

// --- Q5: Conditional Access Policy Changes ---
// CMMC 3.1.1
AuditLogs
| where TimeGenerated > ago(7d)
| where OperationName has "conditional access"
| extend Initiator=tostring(InitiatedBy.user.userPrincipalName), Policy=tostring(TargetResources[0].displayName)
| project TimeGenerated, Initiator, OperationName, Policy, Result

// --- Q6: MFA Bypass / Failures ---
// CMMC 3.5.3
SigninLogs
| where TimeGenerated > ago(7d)
| where AuthenticationRequirement == "multiFactorAuthentication" and ResultType != "0"
| summarize Fails=count() by UserPrincipalName, ResultType, ResultDescription
| sort by Fails desc

// --- Q7: Impossible Travel ---
// CMMC 3.14.6
SigninLogs
| where TimeGenerated > ago(7d) and ResultType == "0"
| project TimeGenerated, UserPrincipalName, IPAddress, Loc=strcat(LocationDetails.city,", ",LocationDetails.state,", ",LocationDetails.countryOrRegion)
| sort by UserPrincipalName, TimeGenerated asc
| serialize
| extend PrevTime=prev(TimeGenerated,1), PrevLoc=prev(Loc,1), PrevUser=prev(UserPrincipalName,1)
| where UserPrincipalName==PrevUser
| extend MinDiff=datetime_diff('minute',TimeGenerated,PrevTime)
| where MinDiff < 120 and Loc != PrevLoc and Loc != "" and PrevLoc != ""

// --- Q8: CUI File Access in SharePoint ---
// CMMC 3.1.3
OfficeActivity
| where TimeGenerated > ago(7d)
| where Operation in ("FileAccessed","FileDownloaded","FileModified","FileCopied")
| where SourceRelativeUrl has_any ("CUI","Controlled","ITAR","Export")
| summarize Count=count(), Ops=make_set(Operation) by UserId, SourceFileName
| sort by Count desc

// --- Q9: Firewall Denied Traffic Top Sources ---
// CMMC 3.13.1
AzureDiagnostics
| where Category == "AzureFirewallNetworkRule" and TimeGenerated > ago(7d)
| where msg_s has "Deny"
| parse msg_s with * "from " SrcIP ":" * " to " DstIP ":" * ". " *
| summarize Denies=count() by SrcIP
| top 20 by Denies

// --- Q10: Device Compliance Changes ---
// CMMC 3.4.1
IntuneDeviceComplianceOrg
| where TimeGenerated > ago(7d) and ComplianceState != "Compliant"
| project TimeGenerated, DeviceName, OS, ComplianceState, UserName
| sort by TimeGenerated desc`
            },
            {
                id: "sentinel-analytics-rules",
                title: "Sentinel — CMMC Detection Analytics Rules",
                platform: "Microsoft Sentinel (GCC High)",
                language: "KQL",
                cmmcControls: ["3.3.5", "3.14.6", "3.14.7"],
                prerequisites: ["Sentinel workspace", "Security Contributor role"],
                evidence: ["Analytics rule configurations", "Incident records", "Alert evidence"],
                script: `// ============================================================
// CMMC Sentinel Analytics Rules — Deploy as Scheduled Rules
// ============================================================

// --- RULE: CUI Data Exfiltration Attempt ---
// Severity: High | Frequency: 5min | Lookback: 5min
// CMMC 3.1.3, 3.14.6
OfficeActivity
| where TimeGenerated > ago(5m)
| where Operation in ("FileSyncDownloadedFull","FileDownloaded","FileCopied")
| where SourceRelativeUrl has_any ("CUI","ITAR","Export Controlled")
| join kind=leftouter (
    SigninLogs | where TimeGenerated > ago(1h) | where RiskLevelDuringSignIn in ("medium","high") | distinct UserPrincipalName
) on $left.UserId == $right.UserPrincipalName
| where isnotempty(UserPrincipalName)

// --- RULE: Brute Force on Admin Accounts ---
// Severity: High | Frequency: 15min | Lookback: 1h
// CMMC 3.1.8, 3.5.3
let Admins = AuditLogs | where TimeGenerated > ago(30d) | where OperationName has "role" | extend User=tostring(TargetResources[0].userPrincipalName) | distinct User;
SigninLogs
| where TimeGenerated > ago(1h)
| where UserPrincipalName in (Admins) and ResultType != "0"
| summarize Fails=count(), IPs=make_set(IPAddress) by UserPrincipalName
| where Fails > 10

// --- RULE: Service Account Interactive Login ---
// Severity: Medium | Frequency: 15min
// CMMC 3.1.6, 3.5.1
SigninLogs
| where TimeGenerated > ago(15m)
| where UserPrincipalName matches regex @"^(svc|service|sa|app)-"
| where IsInteractive == true

// --- RULE: Mass File Deletion ---
// Severity: High | Frequency: 5min
// CMMC 3.8.3, 3.14.6
OfficeActivity
| where TimeGenerated > ago(5m)
| where Operation in ("FileDeleted","FileDeletedFirstStageRecycleBin","FileRecycled")
| summarize Deletes=count(), Files=make_set(SourceFileName) by UserId, bin(TimeGenerated,5m)
| where Deletes > 50

// --- RULE: Security Control Disabled ---
// Severity: Critical | Frequency: 5min
// CMMC 3.14.2
AuditLogs
| where TimeGenerated > ago(5m)
| where OperationName in ("Disable Strong Authentication","Delete conditional access policy","Update conditional access policy")
| extend Initiator=tostring(InitiatedBy.user.userPrincipalName), Target=tostring(TargetResources[0].displayName)

// --- RULE: New External User Added ---
// Severity: Medium | Frequency: 15min
// CMMC 3.1.1
AuditLogs
| where TimeGenerated > ago(15m)
| where OperationName == "Invite external user"
| extend Initiator=tostring(InitiatedBy.user.userPrincipalName), InvitedUser=tostring(TargetResources[0].userPrincipalName)

// --- RULE: Mailbox Forwarding Rule Created ---
// Severity: High | Frequency: 5min
// CMMC 3.1.3, 3.14.6
OfficeActivity
| where TimeGenerated > ago(5m)
| where Operation in ("New-InboxRule","Set-InboxRule","Set-Mailbox")
| where Parameters has_any ("ForwardTo","ForwardingSmtpAddress","RedirectTo")
| extend User=UserId, RuleName=tostring(parse_json(Parameters)[0].Value)

// --- RULE: Password Spray Detection ---
// Severity: High | Frequency: 15min
// CMMC 3.5.3
SigninLogs
| where TimeGenerated > ago(15m) and ResultType == "50126"
| summarize TargetUsers=dcount(UserPrincipalName), Attempts=count() by IPAddress
| where TargetUsers > 10 and Attempts > 20`
            },
            {
                id: "sentinel-workbook-deploy",
                title: "Sentinel — Deploy CMMC Compliance Workbook via API",
                platform: "Microsoft Sentinel (GCC High)",
                language: "PowerShell",
                cmmcControls: ["3.3.1", "3.3.5", "3.12.1"],
                prerequisites: ["Az.SecurityInsights module", "Sentinel Contributor"],
                evidence: ["Workbook deployment confirmation", "Dashboard screenshots"],
                script: `# Deploy CMMC Compliance Workbook to Sentinel
# Includes: MFA coverage, CA policy hits, PIM activations, log health

Connect-AzAccount -Environment AzureUSGovernment
$sub = (Get-AzContext).Subscription.Id
$rg = "rg-sentinel-cmmc"
$ws = "law-sentinel-cmmc"

# Install CMMC content from Content Hub
$contentHub = Get-AzSentinelContentPackage -ResourceGroupName $rg -WorkspaceName $ws | Where-Object { $_.DisplayName -like "*CMMC*" }
if ($contentHub) {
    Install-AzSentinelContentPackage -ResourceGroupName $rg -WorkspaceName $ws -ContentId $contentHub.ContentId
    Write-Host "CMMC Content Hub package installed" -FG Green
}

# Deploy custom workbook with CMMC KPIs
$workbookJson = @{
    version = "Notebook/1.0"
    items = @(
        @{ type = 1; content = @{ json = "## CMMC Level 2 Compliance Dashboard" } }
        @{ type = 3; content = @{ version = "KqlItem/1.0"
            query = "SigninLogs | where TimeGenerated > ago(30d) | summarize Total=count(), MFASuccess=countif(AuthenticationRequirement=='multiFactorAuthentication' and ResultType=='0'), MFAFail=countif(AuthenticationRequirement=='multiFactorAuthentication' and ResultType!='0') | extend MFARate=round(100.0*MFASuccess/Total,1)"
            size = 3; title = "MFA Enforcement Rate (30d)"; queryType = 0
        }}
        @{ type = 3; content = @{ version = "KqlItem/1.0"
            query = "AuditLogs | where TimeGenerated > ago(30d) | where OperationName has 'PIM' | summarize Activations=count() by bin(TimeGenerated, 1d) | render timechart"
            size = 0; title = "PIM Activations (30d)"; queryType = 0
        }}
        @{ type = 3; content = @{ version = "KqlItem/1.0"
            query = "Heartbeat | summarize LastHeartbeat=max(TimeGenerated) by Computer | extend Status=iff(LastHeartbeat < ago(5m), 'Offline', 'Online') | summarize Online=countif(Status=='Online'), Offline=countif(Status=='Offline')"
            size = 3; title = "Agent Health"; queryType = 0
        }}
        @{ type = 3; content = @{ version = "KqlItem/1.0"
            query = "SecurityAlert | where TimeGenerated > ago(7d) | summarize Alerts=count() by AlertSeverity | sort by AlertSeverity asc"
            size = 1; title = "Security Alerts (7d)"; queryType = 0
        }}
    )
} | ConvertTo-Json -Depth 10

$workbookId = [guid]::NewGuid().ToString()
New-AzResourceGroupDeployment -ResourceGroupName $rg -TemplateUri "https://raw.githubusercontent.com/microsoft/Application-Insights-Workbooks/master/schema/workbook.json" -TemplateParameterObject @{
    workbookId = $workbookId; workbookDisplayName = "CMMC Level 2 Compliance"; workbookType = "sentinel"
    workbookSourceId = "/subscriptions/$sub/resourceGroups/$rg/providers/Microsoft.OperationalInsights/workspaces/$ws"
    serializedData = $workbookJson
} -ErrorAction SilentlyContinue

Write-Host "CMMC Workbook deployed. Open Sentinel > Workbooks to view." -FG Green`
            },
            {
                id: "splunk-cmmc-queries",
                title: "Splunk — CMMC Detection Queries (SPL)",
                platform: "Splunk Cloud for Government",
                language: "SPL",
                cmmcControls: ["3.3.1", "3.3.2", "3.3.5", "3.14.6"],
                prerequisites: ["Splunk Enterprise Security", "Relevant data sources indexed"],
                evidence: ["Saved search results", "Notable events", "Investigation reports"],
                script: `| ============================================================
| CMMC Splunk SPL Queries — Weekly Review + Detection
| ============================================================

| --- Q1: Failed Authentication (>5 failures per user, 7d) ---
| CMMC 3.3.5, 3.5.3
index=main sourcetype=WinEventLog:Security EventCode=4625
| stats count as FailCount dc(src_ip) as UniqueIPs values(src_ip) as SourceIPs by user
| where FailCount > 5
| sort -FailCount
| table user FailCount UniqueIPs SourceIPs

| --- Q2: Privileged Account Usage ---
| CMMC 3.1.5, 3.1.7
index=main sourcetype=WinEventLog:Security (EventCode=4672 OR EventCode=4624)
| search user IN ("*admin*","*svc-*","Administrator")
| stats count by user EventCode src_ip dest
| sort -count

| --- Q3: After-Hours Logons ---
| CMMC 3.3.1
index=main sourcetype=WinEventLog:Security EventCode=4624
| eval hour=strftime(_time,"%H") | eval dow=strftime(_time,"%u")
| where (hour<6 OR hour>20) OR (dow>5)
| stats count by user src_ip dest hour
| sort -count

| --- Q4: Account Lockouts ---
| CMMC 3.1.8
index=main sourcetype=WinEventLog:Security EventCode=4740
| stats count by user src_ip _time
| sort -_time

| --- Q5: New Local Admin Created ---
| CMMC 3.1.1
index=main sourcetype=WinEventLog:Security EventCode=4732
| search Group_Name="Administrators"
| table _time user Member_Name Group_Name src

| --- Q6: Audit Log Cleared ---
| CMMC 3.3.4
index=main sourcetype=WinEventLog:Security (EventCode=1102 OR EventCode=104)
| table _time user host EventCode Message

| --- Q7: USB Device Connected ---
| CMMC 3.8.7
index=main sourcetype=WinEventLog:System EventCode=20001
| rex field=Message "Device (?<DeviceName>[^\\\\]+)"
| table _time host DeviceName user

| --- Q8: Large Data Transfer (>100MB outbound) ---
| CMMC 3.1.3, 3.14.6
index=network sourcetype=firewall action=allowed direction=outbound
| stats sum(bytes_out) as TotalBytes by src_ip dest_ip
| eval TotalMB=round(TotalBytes/1048576,2)
| where TotalMB > 100
| sort -TotalMB

| --- Q9: DNS Queries to Suspicious TLDs ---
| CMMC 3.14.6
index=dns sourcetype=dns
| rex field=query "(?<tld>\\.[a-z]+)$"
| search tld IN (".tk",".ml",".ga",".cf",".gq",".xyz",".top",".buzz",".club",".work")
| stats count by src_ip query tld
| sort -count

| --- Q10: Firewall Deny Summary ---
| CMMC 3.13.1
index=network sourcetype=firewall action=blocked
| stats count as Blocks by src_ip dest_ip dest_port
| sort -Blocks | head 50

| --- SAVED SEARCH: Password Spray Detection ---
| CMMC 3.5.3
index=main sourcetype=WinEventLog:Security EventCode=4625
| bin _time span=15m
| stats dc(user) as TargetUsers count as Attempts by src_ip _time
| where TargetUsers > 10 AND Attempts > 20
| table _time src_ip TargetUsers Attempts`
            },
            {
                id: "cloudwatch-setup",
                title: "AWS CloudWatch — CMMC Log Group & Metric Alarms",
                platform: "AWS GovCloud",
                language: "Bash",
                cmmcControls: ["3.3.1", "3.3.4", "3.14.6"],
                prerequisites: ["AWS CLI v2 for GovCloud", "CloudWatch permissions"],
                evidence: ["CloudWatch log group configs", "Alarm configurations", "Metric filter definitions"],
                script: `#!/bin/bash
# CMMC CloudWatch Setup — Log groups, metric filters, alarms
set -euo pipefail
REGION="us-gov-west-1"
SNS_TOPIC="arn:aws-us-gov:sns:$REGION:$(aws sts get-caller-identity --query Account --output text):cmmc-security-alerts"

echo "=== CMMC CloudWatch Configuration ==="

# 1. Create log groups with 1-year retention
for LG in "/aws/cloudtrail" "/aws/vpc-flow-logs" "/aws/guardduty" "/aws/config" "/cmmc/application-logs" "/cmmc/security-events"; do
    aws logs create-log-group --log-group-name "$LG" --region "$REGION" 2>/dev/null || true
    aws logs put-retention-policy --log-group-name "$LG" --retention-in-days 365 --region "$REGION"
    echo "  Log group: $LG (365d retention)"
done

# 2. Metric Filters — Security Events
echo "Creating metric filters..."

# Root account usage
aws logs put-metric-filter --log-group-name "/aws/cloudtrail" --filter-name "CMMC-RootAccountUsage" \\
    --filter-pattern '{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }' \\
    --metric-transformations metricName=RootAccountUsage,metricNamespace=CMMC/Security,metricValue=1 --region "$REGION"

# Console sign-in without MFA
aws logs put-metric-filter --log-group-name "/aws/cloudtrail" --filter-name "CMMC-ConsoleSignInNoMFA" \\
    --filter-pattern '{ ($.eventName = "ConsoleLogin") && ($.additionalEventData.MFAUsed != "Yes") }' \\
    --metric-transformations metricName=ConsoleSignInNoMFA,metricNamespace=CMMC/Security,metricValue=1 --region "$REGION"

# IAM policy changes
aws logs put-metric-filter --log-group-name "/aws/cloudtrail" --filter-name "CMMC-IAMPolicyChanges" \\
    --filter-pattern '{ ($.eventName=DeleteGroupPolicy) || ($.eventName=DeleteRolePolicy) || ($.eventName=DeleteUserPolicy) || ($.eventName=PutGroupPolicy) || ($.eventName=PutRolePolicy) || ($.eventName=PutUserPolicy) || ($.eventName=CreatePolicy) || ($.eventName=DeletePolicy) || ($.eventName=AttachRolePolicy) || ($.eventName=DetachRolePolicy) || ($.eventName=AttachUserPolicy) || ($.eventName=DetachUserPolicy) || ($.eventName=AttachGroupPolicy) || ($.eventName=DetachGroupPolicy) }' \\
    --metric-transformations metricName=IAMPolicyChanges,metricNamespace=CMMC/Security,metricValue=1 --region "$REGION"

# CloudTrail config changes
aws logs put-metric-filter --log-group-name "/aws/cloudtrail" --filter-name "CMMC-CloudTrailChanges" \\
    --filter-pattern '{ ($.eventName = CreateTrail) || ($.eventName = UpdateTrail) || ($.eventName = DeleteTrail) || ($.eventName = StartLogging) || ($.eventName = StopLogging) }' \\
    --metric-transformations metricName=CloudTrailChanges,metricNamespace=CMMC/Security,metricValue=1 --region "$REGION"

# Security group changes
aws logs put-metric-filter --log-group-name "/aws/cloudtrail" --filter-name "CMMC-SecurityGroupChanges" \\
    --filter-pattern '{ ($.eventName = AuthorizeSecurityGroupIngress) || ($.eventName = AuthorizeSecurityGroupEgress) || ($.eventName = RevokeSecurityGroupIngress) || ($.eventName = RevokeSecurityGroupEgress) || ($.eventName = CreateSecurityGroup) || ($.eventName = DeleteSecurityGroup) }' \\
    --metric-transformations metricName=SecurityGroupChanges,metricNamespace=CMMC/Security,metricValue=1 --region "$REGION"

# Failed console logins
aws logs put-metric-filter --log-group-name "/aws/cloudtrail" --filter-name "CMMC-FailedConsoleLogins" \\
    --filter-pattern '{ ($.eventName = ConsoleLogin) && ($.errorMessage = "Failed authentication") }' \\
    --metric-transformations metricName=FailedConsoleLogins,metricNamespace=CMMC/Security,metricValue=1 --region "$REGION"

# S3 bucket policy changes
aws logs put-metric-filter --log-group-name "/aws/cloudtrail" --filter-name "CMMC-S3PolicyChanges" \\
    --filter-pattern '{ ($.eventName = PutBucketAcl) || ($.eventName = PutBucketPolicy) || ($.eventName = PutBucketCors) || ($.eventName = PutBucketLifecycle) || ($.eventName = PutBucketReplication) || ($.eventName = DeleteBucketPolicy) || ($.eventName = DeleteBucketCors) || ($.eventName = DeleteBucketLifecycle) || ($.eventName = DeleteBucketReplication) }' \\
    --metric-transformations metricName=S3PolicyChanges,metricNamespace=CMMC/Security,metricValue=1 --region "$REGION"

echo "  7 metric filters created"

# 3. CloudWatch Alarms
echo "Creating alarms..."
for METRIC in RootAccountUsage ConsoleSignInNoMFA IAMPolicyChanges CloudTrailChanges SecurityGroupChanges FailedConsoleLogins S3PolicyChanges; do
    THRESHOLD=1
    if [ "$METRIC" = "FailedConsoleLogins" ]; then THRESHOLD=5; fi
    
    aws cloudwatch put-metric-alarm --alarm-name "CMMC-$METRIC" \\
        --metric-name "$METRIC" --namespace "CMMC/Security" \\
        --statistic Sum --period 300 --evaluation-periods 1 \\
        --threshold "$THRESHOLD" --comparison-operator GreaterThanOrEqualToThreshold \\
        --alarm-actions "$SNS_TOPIC" \\
        --treat-missing-data notBreaching --region "$REGION" 2>/dev/null || true
    echo "  Alarm: CMMC-$METRIC (threshold: $THRESHOLD)"
done

echo "\\nCloudWatch CMMC monitoring configured."
echo "Verify: aws cloudwatch describe-alarms --alarm-name-prefix CMMC --region $REGION"`
            },
            {
                id: "linux-auditd-cmmc",
                title: "Linux auditd — CMMC Audit Rules Configuration",
                platform: "RHEL/CentOS/Ubuntu",
                language: "Bash",
                cmmcControls: ["3.3.1", "3.3.2", "3.3.4", "3.3.6"],
                prerequisites: ["Root/sudo access", "auditd package installed"],
                evidence: ["audit.rules file", "auditd.conf", "aureport output"],
                script: `#!/bin/bash
# CMMC auditd Configuration — Comprehensive audit rules
# Deploy to: /etc/audit/rules.d/cmmc.rules
set -euo pipefail

RULES_FILE="/etc/audit/rules.d/cmmc.rules"
echo "=== Deploying CMMC auditd Rules ==="

cat > "$RULES_FILE" << 'AUDITRULES'
## CMMC Level 2 Audit Rules
## Deploy: /etc/audit/rules.d/cmmc.rules
## Reload: augenrules --load

# Remove existing rules
-D

# Set buffer size (increase for busy systems)
-b 8192

# Failure mode: 1=printk, 2=panic
-f 1

# ============ IDENTITY & ACCESS (3.1.x, 3.5.x) ============

# Monitor login/logout events
-w /var/log/lastlog -p wa -k logins
-w /var/log/faillog -p wa -k logins
-w /var/log/tallylog -p wa -k logins
-w /var/run/faillock -p wa -k logins

# Monitor user/group changes
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/group -p wa -k identity
-w /etc/gshadow -p wa -k identity
-w /etc/security/opasswd -p wa -k identity

# Monitor sudoers
-w /etc/sudoers -p wa -k sudoers
-w /etc/sudoers.d/ -p wa -k sudoers

# Monitor PAM configuration
-w /etc/pam.d/ -p wa -k pam

# Monitor SSH configuration
-w /etc/ssh/sshd_config -p wa -k sshd
-w /etc/ssh/sshd_config.d/ -p wa -k sshd

# Privileged command execution
-a always,exit -F path=/usr/bin/sudo -F perm=x -F auid>=1000 -F auid!=4294967295 -k privileged
-a always,exit -F path=/usr/bin/su -F perm=x -F auid>=1000 -F auid!=4294967295 -k privileged
-a always,exit -F path=/usr/bin/chage -F perm=x -F auid>=1000 -F auid!=4294967295 -k privileged
-a always,exit -F path=/usr/bin/passwd -F perm=x -F auid>=1000 -F auid!=4294967295 -k privileged
-a always,exit -F path=/usr/sbin/useradd -F perm=x -F auid>=1000 -F auid!=4294967295 -k privileged
-a always,exit -F path=/usr/sbin/userdel -F perm=x -F auid>=1000 -F auid!=4294967295 -k privileged
-a always,exit -F path=/usr/sbin/usermod -F perm=x -F auid>=1000 -F auid!=4294967295 -k privileged
-a always,exit -F path=/usr/sbin/groupadd -F perm=x -F auid>=1000 -F auid!=4294967295 -k privileged
-a always,exit -F path=/usr/sbin/groupdel -F perm=x -F auid>=1000 -F auid!=4294967295 -k privileged
-a always,exit -F path=/usr/sbin/groupmod -F perm=x -F auid>=1000 -F auid!=4294967295 -k privileged

# ============ SYSTEM INTEGRITY (3.4.x, 3.14.x) ============

# Monitor system configuration changes
-w /etc/sysctl.conf -p wa -k sysctl
-w /etc/sysctl.d/ -p wa -k sysctl
-w /etc/modprobe.d/ -p wa -k modprobe

# Monitor cron/scheduled tasks
-w /etc/crontab -p wa -k cron
-w /etc/cron.d/ -p wa -k cron
-w /etc/cron.daily/ -p wa -k cron
-w /etc/cron.hourly/ -p wa -k cron
-w /etc/cron.weekly/ -p wa -k cron
-w /etc/cron.monthly/ -p wa -k cron
-w /var/spool/cron/ -p wa -k cron

# Monitor systemd services
-w /etc/systemd/ -p wa -k systemd
-w /usr/lib/systemd/ -p wa -k systemd

# Kernel module loading
-w /sbin/insmod -p x -k modules
-w /sbin/rmmod -p x -k modules
-w /sbin/modprobe -p x -k modules
-a always,exit -F arch=b64 -S init_module -S delete_module -k modules

# File deletion by users
-a always,exit -F arch=b64 -S unlink -S unlinkat -S rename -S renameat -F auid>=1000 -F auid!=4294967295 -k delete

# ============ NETWORK (3.13.x) ============

# Network configuration changes
-w /etc/hosts -p wa -k network
-w /etc/sysconfig/network -p wa -k network
-w /etc/sysconfig/network-scripts/ -p wa -k network
-w /etc/NetworkManager/ -p wa -k network
-w /etc/resolv.conf -p wa -k network

# Firewall changes
-w /etc/firewalld/ -p wa -k firewall
-w /etc/sysconfig/iptables -p wa -k firewall
-w /etc/sysconfig/ip6tables -p wa -k firewall

# ============ AUDIT SYSTEM PROTECTION (3.3.4, 3.3.6) ============

# Protect audit configuration
-w /etc/audit/ -p wa -k audit_config
-w /etc/audisp/ -p wa -k audit_config
-w /var/log/audit/ -p wa -k audit_logs

# Time changes (for log integrity)
-a always,exit -F arch=b64 -S adjtimex -S settimeofday -k time_change
-a always,exit -F arch=b64 -S clock_settime -k time_change
-w /etc/localtime -p wa -k time_change

# Make rules immutable (requires reboot to change)
-e 2
AUDITRULES

# Configure auditd.conf for CMMC retention
cat > /etc/audit/auditd.conf << 'AUDITCONF'
log_file = /var/log/audit/audit.log
log_format = ENRICHED
log_group = root
priority_boost = 4
flush = INCREMENTAL_ASYNC
freq = 50
num_logs = 10
max_log_file = 50
max_log_file_action = ROTATE
space_left = 75
space_left_action = email
action_mail_acct = root
admin_space_left = 50
admin_space_left_action = halt
disk_full_action = halt
disk_error_action = halt
name_format = hostname
AUDITCONF

# Reload rules
augenrules --load
systemctl restart auditd

echo "CMMC auditd rules deployed. Verify:"
echo "  auditctl -l | wc -l   # Should show 40+ rules"
echo "  aureport --summary     # Audit summary"
echo "  ausearch -k identity   # Search by key"`
            },
            {
                id: "windows-audit-policy",
                title: "Windows — Advanced Audit Policy for CMMC",
                platform: "Windows Server / Windows 10/11",
                language: "PowerShell",
                cmmcControls: ["3.3.1", "3.3.2", "3.3.4"],
                prerequisites: ["Administrator access", "Group Policy or local policy"],
                evidence: ["Audit policy export", "Security event log configuration"],
                script: `# CMMC Windows Advanced Audit Policy Configuration
# Deploy via GPO or run locally with admin rights

# Enable advanced audit policy (override basic)
Set-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Lsa" -Name "SCENoApplyLegacyAuditPolicy" -Value 1

# === Account Logon ===
auditpol /set /subcategory:"Credential Validation" /success:enable /failure:enable
auditpol /set /subcategory:"Kerberos Authentication Service" /success:enable /failure:enable
auditpol /set /subcategory:"Kerberos Service Ticket Operations" /success:enable /failure:enable

# === Account Management ===
auditpol /set /subcategory:"Computer Account Management" /success:enable /failure:enable
auditpol /set /subcategory:"Security Group Management" /success:enable /failure:enable
auditpol /set /subcategory:"User Account Management" /success:enable /failure:enable
auditpol /set /subcategory:"Distribution Group Management" /success:enable /failure:enable

# === Logon/Logoff ===
auditpol /set /subcategory:"Logon" /success:enable /failure:enable
auditpol /set /subcategory:"Logoff" /success:enable
auditpol /set /subcategory:"Account Lockout" /success:enable /failure:enable
auditpol /set /subcategory:"Special Logon" /success:enable
auditpol /set /subcategory:"Other Logon/Logoff Events" /success:enable /failure:enable
auditpol /set /subcategory:"Network Policy Server" /success:enable /failure:enable

# === Object Access ===
auditpol /set /subcategory:"File System" /success:enable /failure:enable
auditpol /set /subcategory:"Registry" /success:enable /failure:enable
auditpol /set /subcategory:"Removable Storage" /success:enable /failure:enable
auditpol /set /subcategory:"Central Policy Staging" /success:enable /failure:enable

# === Policy Change ===
auditpol /set /subcategory:"Audit Policy Change" /success:enable /failure:enable
auditpol /set /subcategory:"Authentication Policy Change" /success:enable
auditpol /set /subcategory:"Authorization Policy Change" /success:enable
auditpol /set /subcategory:"MPSSVC Rule-Level Policy Change" /success:enable /failure:enable

# === Privilege Use ===
auditpol /set /subcategory:"Sensitive Privilege Use" /success:enable /failure:enable

# === System ===
auditpol /set /subcategory:"Security State Change" /success:enable
auditpol /set /subcategory:"Security System Extension" /success:enable /failure:enable
auditpol /set /subcategory:"System Integrity" /success:enable /failure:enable

# === Detailed Tracking ===
auditpol /set /subcategory:"Process Creation" /success:enable
auditpol /set /subcategory:"Plug and Play Events" /success:enable

# Enable command-line logging in process creation events
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System\\Audit" -Name "ProcessCreationIncludeCmdLine_Enabled" -Value 1 -Type DWord -Force

# Configure Security Event Log size (1GB) and retention
wevtutil sl Security /ms:1073741824 /rt:false
wevtutil sl System /ms:268435456 /rt:false
wevtutil sl Application /ms:268435456 /rt:false

# PowerShell logging
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging" -Name "EnableScriptBlockLogging" -Value 1 -Force
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ModuleLogging" -Name "EnableModuleLogging" -Value 1 -Force
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\Transcription" -Name "EnableTranscripting" -Value 1 -Force
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\Transcription" -Name "OutputDirectory" -Value "C:\\PSTranscripts" -Force
New-Item -Path "C:\\PSTranscripts" -ItemType Directory -Force | Out-Null

# Export current audit policy for evidence
auditpol /get /category:* > "AuditPolicy-$(hostname)-$(Get-Date -Format 'yyyyMMdd').txt"
Write-Host "Audit policy configured. Export saved." -FG Green
Write-Host "Verify: auditpol /get /category:*" -FG Cyan`
            },
            {
                id: "log-retention-automation",
                title: "Cross-Platform — Automated Log Retention & Archive",
                platform: "Azure / AWS / On-Prem",
                language: "PowerShell",
                cmmcControls: ["3.3.1", "3.3.8"],
                prerequisites: ["Storage account or S3 bucket", "Appropriate permissions"],
                evidence: ["Log archive manifests", "Retention policy configurations", "Archive verification reports"],
                script: `# CMMC Log Retention Automation
# Archives logs to immutable storage with 1-year retention
# Supports: Azure Blob (WORM), AWS S3 (Object Lock), local archive

param(
    [ValidateSet("Azure","AWS","Local")][string]$Target = "Azure",
    [int]$RetentionDays = 365,
    [string]$SourcePath = "C:\\Logs"
)

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$archiveName = "cmmc-logs-$timestamp"

switch ($Target) {
    "Azure" {
        # Archive to Azure Blob with immutability policy
        $ctx = New-AzStorageContext -StorageAccountName "stcmmclogarchive" -StorageAccountKey $env:AZURE_STORAGE_KEY
        $container = "log-archives"
        
        # Compress logs
        $zipPath = "$env:TEMP\\$archiveName.zip"
        Compress-Archive -Path "$SourcePath\\*" -DestinationPath $zipPath
        
        # Upload with immutability
        Set-AzStorageBlobContent -File $zipPath -Container $container -Blob "$archiveName.zip" -Context $ctx
        
        # Set immutability policy (WORM - Write Once Read Many)
        $blob = Get-AzStorageBlob -Container $container -Blob "$archiveName.zip" -Context $ctx
        Set-AzStorageBlobImmutabilityPolicy -Container $container -Blob "$archiveName.zip" \\
            -Context $ctx -ExpiresOn (Get-Date).AddDays($RetentionDays) -PolicyMode Unlocked
        
        # Generate manifest
        $manifest = [PSCustomObject]@{
            ArchiveName = "$archiveName.zip"
            Timestamp = $timestamp
            SourcePath = $SourcePath
            FileCount = (Get-ChildItem $SourcePath -Recurse -File).Count
            SizeBytes = (Get-Item $zipPath).Length
            Target = "Azure Blob (Immutable)"
            RetentionDays = $RetentionDays
            ExpiresOn = (Get-Date).AddDays($RetentionDays).ToString("yyyy-MM-dd")
            SHA256 = (Get-FileHash $zipPath -Algorithm SHA256).Hash
        }
        $manifest | Export-Csv "LogArchive-Manifest-$timestamp.csv" -NoTypeInformation
        Remove-Item $zipPath
        Write-Host "Archived to Azure Blob with $RetentionDays-day immutability" -FG Green
    }
    "AWS" {
        # Archive to S3 with Object Lock
        $zipPath = "/tmp/$archiveName.tar.gz"
        tar -czf $zipPath -C (Split-Path $SourcePath) (Split-Path $SourcePath -Leaf)
        
        aws s3 cp $zipPath "s3://cmmc-log-archive/$archiveName.tar.gz" \\
            --storage-class GLACIER_IR \\
            --region us-gov-west-1
        
        # Set Object Lock retention
        aws s3api put-object-retention \\
            --bucket cmmc-log-archive \\
            --key "$archiveName.tar.gz" \\
            --retention "Mode=COMPLIANCE,RetainUntilDate=$(date -d "+${RetentionDays} days" +%Y-%m-%dT00:00:00Z)" \\
            --region us-gov-west-1
        
        Write-Host "Archived to S3 Glacier IR with $RetentionDays-day Object Lock" -FG Green
    }
    "Local" {
        $archiveDir = "D:\\LogArchives"
        New-Item -Path $archiveDir -ItemType Directory -Force | Out-Null
        $zipPath = "$archiveDir\\$archiveName.zip"
        Compress-Archive -Path "$SourcePath\\*" -DestinationPath $zipPath
        
        # Calculate hash for integrity
        $hash = (Get-FileHash $zipPath -Algorithm SHA256).Hash
        "$hash  $archiveName.zip" | Out-File "$archiveDir\\$archiveName.sha256"
        
        Write-Host "Archived locally: $zipPath (SHA256: $hash)" -FG Green
    }
}

Write-Host "Log archive complete. Manifest saved." -FG Cyan`
            },
            {
                id: "chronicle-yaral",
                title: "Google Chronicle — YARA-L Detection Rules",
                platform: "Google Chronicle SIEM",
                language: "YARA-L",
                cmmcControls: ["3.3.5", "3.14.6", "3.14.7"],
                prerequisites: ["Chronicle SIEM instance", "Log sources configured"],
                evidence: ["Detection rule configurations", "Alert records"],
                script: `// ============================================================
// CMMC Chronicle YARA-L Detection Rules
// ============================================================

// --- RULE: Brute Force Login Attempt ---
// CMMC 3.5.3, 3.14.6
rule cmmc_brute_force_login {
  meta:
    author = "MSP SOC"
    description = "Detects brute force login attempts (>10 failures from single IP in 15 min)"
    severity = "HIGH"
    cmmc_controls = "3.5.3, 3.14.6"

  events:
    $login.metadata.event_type = "USER_LOGIN"
    $login.security_result.action = "BLOCK"
    $login.principal.ip = $ip

  match:
    $ip over 15m

  condition:
    #login > 10

  outcome:
    $risk_score = 80
    $event_count = count($login)
}

// --- RULE: Impossible Travel ---
// CMMC 3.14.6
rule cmmc_impossible_travel {
  meta:
    description = "Detects logins from geographically distant locations within short time"
    severity = "HIGH"
    cmmc_controls = "3.14.6"

  events:
    $login1.metadata.event_type = "USER_LOGIN"
    $login1.security_result.action = "ALLOW"
    $login1.target.user.userid = $user
    $login1.principal.location.country_or_region = $country1

    $login2.metadata.event_type = "USER_LOGIN"
    $login2.security_result.action = "ALLOW"
    $login2.target.user.userid = $user
    $login2.principal.location.country_or_region = $country2

    $login2.metadata.event_timestamp.seconds > $login1.metadata.event_timestamp.seconds
    $login2.metadata.event_timestamp.seconds - $login1.metadata.event_timestamp.seconds < 7200

  match:
    $user over 2h

  condition:
    $login1 and $login2 and $country1 != $country2
}

// --- RULE: Privileged Account Created ---
// CMMC 3.1.1
rule cmmc_privileged_account_created {
  meta:
    description = "Detects creation of accounts with admin/privileged naming"
    severity = "MEDIUM"
    cmmc_controls = "3.1.1, 3.1.5"

  events:
    $event.metadata.event_type = "USER_CREATION"
    $event.target.user.userid = $new_user

  condition:
    $event and re.regex($new_user, "(?i)(admin|root|svc|service|privileged)")
}

// --- RULE: Large Data Exfiltration ---
// CMMC 3.1.3, 3.14.6
rule cmmc_data_exfiltration {
  meta:
    description = "Detects large outbound data transfers (>500MB in 1 hour)"
    severity = "HIGH"
    cmmc_controls = "3.1.3, 3.14.6"

  events:
    $transfer.metadata.event_type = "NETWORK_CONNECTION"
    $transfer.network.direction = "OUTBOUND"
    $transfer.network.sent_bytes > 0
    $transfer.principal.ip = $src

  match:
    $src over 1h

  condition:
    sum($transfer.network.sent_bytes) > 524288000
}`
            }
        ]
    }
};

if (typeof window !== 'undefined') window.MSP_TECHNICAL_SCRIPTS_AUDIT = MSP_TECHNICAL_SCRIPTS_AUDIT;
if (typeof module !== 'undefined' && module.exports) module.exports = MSP_TECHNICAL_SCRIPTS_AUDIT;
