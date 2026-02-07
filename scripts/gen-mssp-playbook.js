#!/usr/bin/env node
const fs=require('fs'),path=require('path');
const out=path.join(__dirname,'..','data','mssp-playbook-data.js');

const data = {
  version: "1.0.0",
  lastUpdated: "2026-02-07",

  // SPA vs CUI Asset Decision Matrix
  scopingDecisionMatrix: {
    title: "CMMC Asset Scoping Decision Matrix",
    description: "Use this matrix to classify assets in the client environment for CMMC scoping",
    categories: [
      {
        type: "CUI Asset",
        definition: "Processes, stores, or transmits CUI",
        examples: ["File servers with CUI", "Email systems handling CUI", "ERP with contract data", "CAD workstations", "CUI databases"],
        requirements: ["Must use FedRAMP Mod/High authorized tools", "Full CMMC control set applies", "Must be in assessment scope", "Requires FIPS 140-2/3 validated encryption"],
        color: "#f87171"
      },
      {
        type: "Security Protection Asset (SPA)",
        definition: "Provides security functions for CUI assets but does not process/store/transmit CUI itself",
        examples: ["SIEM/SOAR platforms", "EDR/XDR agents", "Firewalls/IDS/IPS", "Vulnerability scanners", "PAM vaults", "MFA providers", "DLP tools", "Backup systems (if not storing CUI)"],
        requirements: ["FedRAMP recommended but NOT required", "Security controls apply to protect integrity", "Must be documented in SSP", "Commercial tools acceptable with risk acceptance"],
        color: "#a78bfa"
      },
      {
        type: "Contractor Risk Managed Asset (CRMA)",
        definition: "Not in scope but can access CUI assets; contractor manages risk",
        examples: ["Corporate laptops not handling CUI", "General office network", "HR systems", "Accounting software"],
        requirements: ["Contractor determines controls", "Must not introduce unacceptable risk", "Document risk acceptance", "Network segmentation from CUI recommended"],
        color: "#94a3b8"
      },
      {
        type: "Out of Scope",
        definition: "No connection to CUI processing, storage, or transmission",
        examples: ["Guest WiFi (isolated)", "Personal devices (no CUI access)", "Marketing systems", "Public website"],
        requirements: ["No CMMC controls required", "Must be physically/logically separated", "Document separation in SSP"],
        color: "#6b7280"
      }
    ],
    decisionTree: [
      { question: "Does this asset process, store, or transmit CUI?", yes: "CUI Asset", no: "next" },
      { question: "Does this asset provide security protection to CUI assets?", yes: "Security Protection Asset (SPA)", no: "next" },
      { question: "Can this asset access or connect to CUI assets?", yes: "Contractor Risk Managed Asset (CRMA)", no: "Out of Scope" }
    ]
  },

  // Tool Comparison Matrix
  toolMatrix: {
    categories: [
      {
        name: "Identity & Access Management",
        tools: [
          { name: "Okta", fedramp: "High", bestFor: "Cloud-first orgs, SSO/MFA", msspFit: "Excellent", cost: "$6-15/user/mo", notes: "Best IdP for multi-tenant MSSP. Lifecycle automation via Workflows." },
          { name: "CyberArk", fedramp: "High", bestFor: "PAM, privileged accounts", msspFit: "Excellent", cost: "$50-100/priv user/mo", notes: "Gold standard for PAM. Session recording, JIT access." },
          { name: "JumpCloud", fedramp: "Moderate", bestFor: "SMB cloud directory", msspFit: "Good", cost: "$7-15/user/mo", notes: "Good for smaller clients. Cross-platform directory." },
          { name: "Cisco Duo", fedramp: "High", bestFor: "MFA add-on", msspFit: "Excellent", cost: "$3-9/user/mo", notes: "Easy MFA overlay. Trust Monitor for anomaly detection." },
          { name: "Keeper Security", fedramp: "Moderate", bestFor: "Password management", msspFit: "Good", cost: "$4-8/user/mo", notes: "BreachWatch, Secrets Manager. Good for SMB." },
          { name: "BeyondTrust", fedramp: "Moderate", bestFor: "Endpoint privilege mgmt", msspFit: "Good", cost: "$30-60/user/mo", notes: "EPM + Password Safe. Good for hybrid environments." },
          { name: "Delinea", fedramp: "High", bestFor: "Secret Server, PAM", msspFit: "Good", cost: "$30-70/user/mo", notes: "Strong PAM with JIT. Good for on-prem heavy." }
        ]
      },
      {
        name: "SIEM & Security Monitoring",
        tools: [
          { name: "Splunk Cloud", fedramp: "High", bestFor: "Advanced analytics, on-prem heavy", msspFit: "Excellent", cost: "$15-50/GB/day", notes: "Most powerful SIEM. ES + SOAR. High cost but unmatched flexibility." },
          { name: "Microsoft Sentinel", fedramp: "High", bestFor: "M365/Azure environments", msspFit: "Excellent", cost: "$2.46/GB ingested", notes: "Native M365 integration. Lighthouse for multi-tenant. KQL." },
          { name: "Sumo Logic", fedramp: "Moderate", bestFor: "Cloud-native SIEM", msspFit: "Good", cost: "$3-10/GB/day", notes: "Cloud SIEM with built-in compliance dashboards." },
          { name: "Blumira", fedramp: "N/A", bestFor: "SMB SIEM", msspFit: "Good", cost: "$3-7/user/mo", notes: "Pre-built detections. Low effort to deploy. Great for SMB clients." }
        ]
      },
      {
        name: "SOAR & Automation",
        tools: [
          { name: "Cortex XSOAR", fedramp: "Moderate", bestFor: "Enterprise SOAR", msspFit: "Excellent", cost: "$40-100K/year", notes: "Most mature SOAR. 800+ integrations. War rooms." },
          { name: "Splunk SOAR", fedramp: "High", bestFor: "Splunk-centric SOCs", msspFit: "Excellent", cost: "Included w/ ES Premium", notes: "Tight Splunk integration. Visual playbook editor." },
          { name: "Tines", fedramp: "N/A", bestFor: "No-code automation", msspFit: "Good", cost: "Free community/$50K+", notes: "Stories-based automation. Free tier available." },
          { name: "Swimlane", fedramp: "N/A", bestFor: "Low-code SOAR", msspFit: "Good", cost: "$30-80K/year", notes: "Turbine platform. Good for custom workflows." }
        ]
      },
      {
        name: "XDR / EDR",
        tools: [
          { name: "CrowdStrike Falcon", fedramp: "High", bestFor: "Enterprise EDR/XDR", msspFit: "Excellent", cost: "$15-25/endpoint/mo", notes: "Best-in-class EDR. ITDR, Device Control, OverWatch MDR." },
          { name: "SentinelOne", fedramp: "Moderate", bestFor: "Autonomous EDR", msspFit: "Excellent", cost: "$6-12/endpoint/mo", notes: "AI-driven. Good multi-tenant. Ranger for network discovery." },
          { name: "Huntress", fedramp: "N/A", bestFor: "MSP-focused MDR", msspFit: "Excellent", cost: "$3-5/endpoint/mo", notes: "Built for MSPs. 24/7 SOC included. Identity threat detection." },
          { name: "Sophos", fedramp: "N/A", bestFor: "SMB endpoint protection", msspFit: "Good", cost: "$3-8/endpoint/mo", notes: "Intercept X + MDR. Good for budget-conscious clients." }
        ]
      },
      {
        name: "Email Security",
        tools: [
          { name: "Proofpoint", fedramp: "High", bestFor: "Enterprise email security", msspFit: "Excellent", cost: "$3-8/user/mo", notes: "TAP for advanced threats. URL defense. Best for large orgs." },
          { name: "Mimecast", fedramp: "Moderate", bestFor: "Email gateway + archive", msspFit: "Good", cost: "$3-7/user/mo", notes: "TTP for URL/attachment. Good archiving. DMARC management." },
          { name: "Abnormal Security", fedramp: "N/A", bestFor: "AI email defense", msspFit: "Good", cost: "$4-10/user/mo", notes: "Behavioral AI for BEC. Account takeover protection." }
        ]
      },
      {
        name: "DLP & Data Protection",
        tools: [
          { name: "Microsoft Purview", fedramp: "High", bestFor: "M365 DLP", msspFit: "Excellent", cost: "Included w/ E5/G5", notes: "Best for M365 shops. Sensitivity labels, endpoint DLP." },
          { name: "Netskope", fedramp: "Moderate", bestFor: "CASB + cloud DLP", msspFit: "Good", cost: "$10-25/user/mo", notes: "CASB, DLP, Private Access. Good for multi-cloud." },
          { name: "Code42 Incydr", fedramp: "N/A", bestFor: "Insider risk", msspFit: "Good", cost: "$8-15/user/mo", notes: "File exposure detection. Insider risk indicators." }
        ]
      },
      {
        name: "Vulnerability Management",
        tools: [
          { name: "Tenable.io", fedramp: "High", bestFor: "Enterprise vuln mgmt", msspFit: "Excellent", cost: "$30-65/asset/year", notes: "VMDR, compliance scanning, VPR scoring." },
          { name: "Qualys VMDR", fedramp: "High", bestFor: "Cloud-native vuln mgmt", msspFit: "Excellent", cost: "$25-60/asset/year", notes: "Cloud agents, policy compliance, TotalCloud." },
          { name: "Rapid7 InsightVM", fedramp: "Moderate", bestFor: "Risk-based vuln mgmt", msspFit: "Good", cost: "$20-50/asset/year", notes: "Real Risk Score, InsightConnect integration." }
        ]
      },
      {
        name: "NDR / Network Detection",
        tools: [
          { name: "Darktrace", fedramp: "N/A", bestFor: "AI network detection", msspFit: "Good", cost: "$20-100K/year", notes: "Enterprise Immune System. RESPOND autonomous actions." },
          { name: "Vectra AI", fedramp: "N/A", bestFor: "Network + identity detection", msspFit: "Good", cost: "$15-80K/year", notes: "Host and account scoring. Good for lateral movement detection." }
        ]
      },
      {
        name: "GRC & Compliance",
        tools: [
          { name: "Vanta", fedramp: "N/A", bestFor: "Continuous compliance", msspFit: "Excellent", cost: "$5-15K/year", notes: "Auto evidence collection. Access reviews. Multi-framework." },
          { name: "Drata", fedramp: "N/A", bestFor: "Compliance automation", msspFit: "Excellent", cost: "$5-20K/year", notes: "Monitoring + evidence. Good UI. Multi-framework." },
          { name: "Secureframe", fedramp: "N/A", bestFor: "SMB compliance", msspFit: "Good", cost: "$5-15K/year", notes: "Easy setup. Good for smaller clients." }
        ]
      },
      {
        name: "Backup & Recovery",
        tools: [
          { name: "Veeam", fedramp: "Moderate", bestFor: "Enterprise backup", msspFit: "Excellent", cost: "$5-15/workload/mo", notes: "Immutable backups, encryption. Veeam ONE monitoring." },
          { name: "Druva", fedramp: "Moderate", bestFor: "Cloud backup", msspFit: "Good", cost: "$3-8/user/mo", notes: "SaaS backup. Air-gapped. Ransomware protection." },
          { name: "Acronis", fedramp: "N/A", bestFor: "MSP backup", msspFit: "Good", cost: "$3-10/workload/mo", notes: "Cyber Protect Cloud. Built for MSPs." }
        ]
      },
      {
        name: "MDM / UEM",
        tools: [
          { name: "Microsoft Intune", fedramp: "High", bestFor: "Windows/cross-platform", msspFit: "Excellent", cost: "Included w/ E3/E5", notes: "Security baselines, compliance policies, Conditional Access." },
          { name: "Jamf Pro", fedramp: "Moderate", bestFor: "Apple devices", msspFit: "Good", cost: "$4-8/device/mo", notes: "Best for Apple-heavy environments. Jamf Protect." },
          { name: "Kandji", fedramp: "N/A", bestFor: "Apple MDM", msspFit: "Good", cost: "$5-9/device/mo", notes: "Auto-remediation. Compliance library." },
          { name: "Workspace ONE", fedramp: "Moderate", bestFor: "Enterprise UEM", msspFit: "Good", cost: "$5-12/device/mo", notes: "Cross-platform. Access + Intelligence." }
        ]
      },
      {
        name: "RMM & Endpoint Management",
        tools: [
          { name: "NinjaOne", fedramp: "N/A", bestFor: "MSP RMM", msspFit: "Excellent", cost: "$3-6/device/mo", notes: "Patch management, scripting, monitoring. MSP-native." },
          { name: "Datto RMM", fedramp: "N/A", bestFor: "MSP RMM", msspFit: "Excellent", cost: "$3-5/device/mo", notes: "ComStore, monitoring. Good PSA integration." },
          { name: "ConnectWise Automate", fedramp: "Moderate", bestFor: "MSP automation", msspFit: "Excellent", cost: "$3-6/device/mo", notes: "Deep scripting. Patch management. PSA integration." }
        ]
      }
    ]
  },

  // SOC Operational Playbooks
  socPlaybooks: [
    {
      id: "pb-001",
      title: "Unauthorized Account Creation",
      severity: "High",
      triggerEvent: "New user account created outside of approved provisioning workflow",
      cmmcControls: ["3.1.1", "3.1.2", "3.3.1", "3.3.2"],
      detectionSources: ["SIEM correlation rule", "ITDR alert", "IdP audit log"],
      splunkQuery: 'index=windows sourcetype="WinEventLog:Security" EventCode=4720 | eval creator=Account_Name | eval new_account=Target_Account_Name | where NOT match(creator, "^(svc_|SYSTEM)") | table _time, creator, new_account, ComputerName',
      sentinelKQL: 'AuditLogs | where OperationName == "Add user" | where InitiatedBy.user.userPrincipalName !has "serviceaccount" | project TimeGenerated, InitiatedBy.user.userPrincipalName, TargetResources[0].displayName',
      responseSteps: [
        "Verify account creation against approved change requests/tickets",
        "If unauthorized: disable account immediately via IdP/AD",
        "Revoke any sessions and tokens for the new account",
        "Identify the creator account and assess for compromise",
        "If creator compromised: initiate incident response for credential theft",
        "Document findings in incident ticket",
        "Notify client security contact within SLA"
      ],
      automationOpportunities: ["Auto-disable account if no matching ticket", "Auto-enrich with HR system data", "Auto-create incident ticket"],
      escalationCriteria: "Escalate to Tier 2 if creator account shows signs of compromise"
    },
    {
      id: "pb-002",
      title: "Brute Force / Credential Stuffing",
      severity: "High",
      triggerEvent: "Multiple failed authentication attempts exceeding threshold",
      cmmcControls: ["3.1.8", "3.5.2", "3.14.6"],
      detectionSources: ["SIEM correlation", "IdP lockout event", "EDR alert"],
      splunkQuery: 'index=windows sourcetype="WinEventLog:Security" EventCode=4625 | bin _time span=5m | stats count dc(Account_Name) as unique_accounts values(Account_Name) as targets by src_ip, _time | where count > 10 OR unique_accounts > 3 | sort -count',
      sentinelKQL: 'SigninLogs | where ResultType != 0 | summarize FailureCount=count(), UniqueAccounts=dcount(UserPrincipalName), Accounts=make_set(UserPrincipalName) by IPAddress, bin(TimeGenerated, 5m) | where FailureCount > 10 or UniqueAccounts > 3',
      responseSteps: [
        "Identify source IP and check against threat intelligence",
        "If external: block IP at firewall/WAF immediately",
        "If internal: isolate source endpoint via EDR",
        "Check if any accounts were successfully compromised (4624 after 4625 series)",
        "Force password reset for targeted accounts",
        "Enable/verify MFA on all targeted accounts",
        "Review for password spray pattern (few attempts per account, many accounts)",
        "Update firewall rules and threat intel feeds"
      ],
      automationOpportunities: ["Auto-block IP after threshold", "Auto-lock targeted accounts", "Auto-enrich IP with threat intel", "Auto-force MFA challenge"],
      escalationCriteria: "Escalate if any successful auth detected after brute force attempts"
    },
    {
      id: "pb-003",
      title: "Suspicious Data Exfiltration",
      severity: "Critical",
      triggerEvent: "Anomalous outbound data transfer exceeding baseline",
      cmmcControls: ["3.1.3", "3.13.1", "3.13.16", "3.14.7"],
      detectionSources: ["DLP alert", "NDR anomaly", "CASB alert", "Proxy logs"],
      splunkQuery: 'index=proxy OR index=firewall action=allowed | stats sum(bytes_out) as total_bytes by src_ip, dest_ip, dest_port | eval total_MB=round(total_bytes/1048576,2) | where total_MB > 500 | lookup threat_intel dest_ip OUTPUT threat_category | sort -total_MB',
      sentinelKQL: 'CommonSecurityLog | where DeviceAction == "allow" | summarize TotalBytes=sum(SentBytes) by SourceIP, DestinationIP | extend TotalMB = TotalBytes/1048576 | where TotalMB > 500 | sort by TotalMB desc',
      responseSteps: [
        "Identify source user/device and destination",
        "Check if destination is a known cloud service or suspicious endpoint",
        "Review DLP alerts for CUI content in the transfer",
        "If CUI detected: block transfer immediately (DLP/firewall)",
        "Isolate source endpoint via EDR if active exfiltration",
        "Capture forensic image of source system",
        "Interview user to determine if authorized activity",
        "If malicious: escalate to full incident response",
        "Notify client CISO and legal if CUI breach confirmed",
        "Initiate DFARS 7012 72-hour notification if applicable"
      ],
      automationOpportunities: ["Auto-block large transfers to uncategorized destinations", "Auto-isolate endpoint on DLP critical match", "Auto-capture network forensics"],
      escalationCriteria: "Immediately escalate if CUI content confirmed in unauthorized transfer"
    },
    {
      id: "pb-004",
      title: "Privileged Account Misuse",
      severity: "High",
      triggerEvent: "Privileged account used outside normal patterns or from unusual location",
      cmmcControls: ["3.1.5", "3.1.6", "3.1.7", "3.3.1"],
      detectionSources: ["PAM alert", "SIEM behavioral analytics", "ITDR"],
      splunkQuery: 'index=windows sourcetype="WinEventLog:Security" EventCode=4624 Logon_Type=10 Account_Name IN ("*admin*","*svc_*") | eval hour=strftime(_time,"%H") | eval day=strftime(_time,"%A") | where (hour < 6 OR hour > 22) OR NOT match(day,"^(Monday|Tuesday|Wednesday|Thursday|Friday)$") | table _time, Account_Name, src_ip, ComputerName',
      sentinelKQL: 'SigninLogs | where UserPrincipalName has "admin" | where ResultType == 0 | extend Hour = datetime_part("hour", TimeGenerated) | where Hour < 6 or Hour > 22 | project TimeGenerated, UserPrincipalName, IPAddress, AppDisplayName, Location',
      responseSteps: [
        "Verify activity with account owner via out-of-band communication",
        "Check PAM system for approved checkout/session",
        "If no approved session: force session termination",
        "Rotate privileged account credentials immediately",
        "Review all actions taken during the suspicious session",
        "Check for persistence mechanisms (scheduled tasks, services, registry)",
        "If compromised: initiate full incident response",
        "Review and tighten PAM policies"
      ],
      automationOpportunities: ["Auto-terminate session if no PAM checkout", "Auto-rotate credentials", "Auto-enrich with PAM checkout data"],
      escalationCriteria: "Escalate if actions include data access, account creation, or security tool modification"
    },
    {
      id: "pb-005",
      title: "Malware / Ransomware Detection",
      severity: "Critical",
      triggerEvent: "EDR detects malicious process execution or ransomware behavior",
      cmmcControls: ["3.14.1", "3.14.2", "3.14.4", "3.14.5"],
      detectionSources: ["EDR alert", "AV detection", "SIEM correlation"],
      splunkQuery: 'index=edr sourcetype=crowdstrike:events event_simpleName=DetectionSummaryEvent | eval severity=case(Severity<=2,"Low",Severity<=4,"Medium",Severity<=6,"High",true(),"Critical") | where severity IN ("High","Critical") | table _time, ComputerName, UserName, FileName, FilePath, severity, Tactic, Technique',
      sentinelKQL: 'SecurityAlert | where ProviderName == "MDATP" | where AlertSeverity in ("High", "Critical") | extend Entities = parse_json(Entities) | project TimeGenerated, AlertName, AlertSeverity, CompromisedEntity, Description',
      responseSteps: [
        "Isolate affected endpoint immediately via EDR network containment",
        "Verify detection is true positive (check hash against VT/threat intel)",
        "Identify patient zero and initial access vector",
        "Check for lateral movement indicators",
        "Scan all endpoints for IOCs from the detection",
        "If ransomware: disconnect affected network segment",
        "Preserve forensic evidence (memory dump, disk image)",
        "Eradicate malware and persistence mechanisms",
        "Restore from known-good backup if needed",
        "Conduct post-incident review and update detections"
      ],
      automationOpportunities: ["Auto-isolate endpoint on critical EDR alert", "Auto-scan environment for IOCs", "Auto-block hashes at EDR policy level", "Auto-create forensic snapshot"],
      escalationCriteria: "Immediately escalate any ransomware detection or lateral movement"
    },
    {
      id: "pb-006",
      title: "Phishing / Business Email Compromise",
      severity: "High",
      triggerEvent: "Email security detects phishing or user reports suspicious email",
      cmmcControls: ["3.2.1", "3.2.2", "3.13.4", "3.14.1"],
      detectionSources: ["Email gateway alert", "User report", "SIEM correlation"],
      splunkQuery: 'index=email sourcetype=proofpoint:messagelog action=quarantine OR action=blocked | stats count by sender, subject, threat_type | where threat_type IN ("phish","credential","malware") | sort -count',
      sentinelKQL: 'EmailEvents | where ThreatTypes has "Phish" or ThreatTypes has "Malware" | summarize Count=count() by SenderFromAddress, Subject, ThreatTypes | sort by Count desc',
      responseSteps: [
        "Quarantine the email across all mailboxes (search and purge)",
        "Identify all recipients who received the email",
        "Check if any recipients clicked links or opened attachments",
        "If credentials entered: force password reset + revoke sessions",
        "If attachment opened: scan endpoint with EDR, isolate if needed",
        "Block sender domain/IP at email gateway",
        "Add IOCs to threat intelligence feeds",
        "Send awareness notification to affected users",
        "If BEC: check for mail forwarding rules, delegate access changes"
      ],
      automationOpportunities: ["Auto-quarantine similar emails", "Auto-reset passwords for clickers", "Auto-block sender domain", "Auto-check for forwarding rules"],
      escalationCriteria: "Escalate if credentials were entered or executive accounts targeted"
    },
    {
      id: "pb-007",
      title: "Audit Log Failure / Tampering",
      severity: "High",
      triggerEvent: "Audit logging stops or evidence of log tampering detected",
      cmmcControls: ["3.3.4", "3.3.7", "3.3.8"],
      detectionSources: ["SIEM health monitoring", "Log source silence alert"],
      splunkQuery: '| tstats latest(_time) as last_event by host, sourcetype | eval hours_silent=round((now()-last_event)/3600,1) | where hours_silent > 1 | sort -hours_silent | head 20',
      sentinelKQL: 'Heartbeat | summarize LastHeartbeat=max(TimeGenerated) by Computer | extend HoursSilent = datetime_diff("hour", now(), LastHeartbeat) | where HoursSilent > 1 | sort by HoursSilent desc',
      responseSteps: [
        "Identify which log sources have stopped reporting",
        "Check agent/forwarder health on affected systems",
        "Verify network connectivity to SIEM",
        "If agent stopped: restart and investigate why",
        "If tampering suspected: isolate system, preserve evidence",
        "Check for cleared event logs (EventCode 1102 on Windows)",
        "Review for attacker activity during logging gap",
        "Restore logging and verify data flow",
        "Document gap period for compliance records"
      ],
      automationOpportunities: ["Auto-alert on log source silence", "Auto-restart agents", "Auto-create ticket for logging gaps"],
      escalationCriteria: "Escalate if log clearing detected or tampering confirmed"
    },
    {
      id: "pb-008",
      title: "Configuration Drift / Baseline Violation",
      severity: "Medium",
      triggerEvent: "System configuration deviates from approved baseline",
      cmmcControls: ["3.4.1", "3.4.2", "3.4.5", "3.4.6"],
      detectionSources: ["Compliance scan", "MDM compliance policy", "CSPM alert"],
      splunkQuery: 'index=tenable sourcetype=tenable:io:vulns compliance_status=FAILED | stats count by asset_hostname, plugin_name, severity | sort -severity, -count',
      sentinelKQL: 'IntuneDeviceComplianceOrg | where ComplianceState == "NonCompliant" | project TimeGenerated, DeviceName, OS, ComplianceState, InGracePeriodUntil',
      responseSteps: [
        "Identify specific configuration deviations",
        "Determine if change was authorized (check change management)",
        "If unauthorized: revert to approved baseline",
        "If authorized but not documented: update baseline documentation",
        "Re-scan to verify remediation",
        "Review change management process for gaps",
        "Update compliance dashboard"
      ],
      automationOpportunities: ["Auto-remediate common drift (GPO reapply, Intune sync)", "Auto-create change ticket", "Auto-rescan after remediation"],
      escalationCriteria: "Escalate if drift affects CUI system security controls"
    }
  ],

  // MSSP Client Onboarding Checklist
  onboardingChecklist: {
    phases: [
      {
        name: "Phase 1: Discovery & Scoping",
        duration: "1-2 weeks",
        tasks: [
          { task: "Conduct CUI data flow analysis", critical: true, tools: ["Interviews", "Network diagrams", "Data flow mapping"] },
          { task: "Identify all CUI assets, SPAs, and CRMAs", critical: true, tools: ["Asset inventory", "Network scanning", "Interviews"] },
          { task: "Document current security posture (gap assessment)", critical: true, tools: ["NIST Assessment Tool", "Vulnerability scan", "Config audit"] },
          { task: "Calculate initial SPRS score", critical: true, tools: ["NIST Assessment Tool SPRS Calculator"] },
          { task: "Define CUI boundary and network segmentation plan", critical: true, tools: ["Network diagrams", "Firewall rules review"] },
          { task: "Identify FedRAMP requirements for CUI assets", critical: false, tools: ["FedRAMP Marketplace", "Vendor documentation"] }
        ]
      },
      {
        name: "Phase 2: Tool Deployment",
        duration: "2-4 weeks",
        tasks: [
          { task: "Deploy EDR/XDR on all CUI endpoints", critical: true, tools: ["CrowdStrike", "SentinelOne", "Huntress"] },
          { task: "Configure SIEM with all required log sources", critical: true, tools: ["Splunk", "Sentinel", "Blumira"] },
          { task: "Deploy MFA on all CUI access points", critical: true, tools: ["Okta", "Duo", "Entra ID"] },
          { task: "Configure DLP for CUI data protection", critical: true, tools: ["Purview", "Netskope"] },
          { task: "Set up vulnerability scanning", critical: true, tools: ["Tenable", "Qualys", "Rapid7"] },
          { task: "Deploy MDM/UEM for endpoint management", critical: false, tools: ["Intune", "Jamf", "Kandji"] },
          { task: "Configure backup with encryption and immutability", critical: false, tools: ["Veeam", "Druva", "Acronis"] },
          { task: "Deploy email security gateway", critical: false, tools: ["Proofpoint", "Mimecast"] }
        ]
      },
      {
        name: "Phase 3: Policy & Configuration",
        duration: "2-3 weeks",
        tasks: [
          { task: "Configure security baselines on all CUI systems", critical: true, tools: ["Intune", "GPO", "CIS Benchmarks"] },
          { task: "Set up SIEM correlation rules and alerts", critical: true, tools: ["SIEM platform"] },
          { task: "Configure PAM for all privileged accounts", critical: true, tools: ["CyberArk", "Delinea", "Keeper"] },
          { task: "Implement network segmentation for CUI", critical: true, tools: ["Firewall", "Zscaler", "VLANs"] },
          { task: "Deploy security awareness training", critical: false, tools: ["KnowBe4", "Ninjio"] },
          { task: "Configure GRC platform for continuous monitoring", critical: false, tools: ["Vanta", "Drata"] }
        ]
      },
      {
        name: "Phase 4: Validation & Documentation",
        duration: "1-2 weeks",
        tasks: [
          { task: "Run full vulnerability scan and remediate critical findings", critical: true, tools: ["Vuln scanner"] },
          { task: "Validate all SIEM log sources are reporting", critical: true, tools: ["SIEM health dashboard"] },
          { task: "Test incident response playbooks", critical: true, tools: ["Tabletop exercise"] },
          { task: "Complete System Security Plan (SSP)", critical: true, tools: ["SSP template"] },
          { task: "Calculate final SPRS score", critical: true, tools: ["NIST Assessment Tool"] },
          { task: "Create POA&M for any remaining gaps", critical: true, tools: ["POA&M template"] },
          { task: "Conduct mock assessment", critical: false, tools: ["Assessment checklist"] }
        ]
      }
    ]
  },

  // DFARS 7012 Incident Reporting Guide
  incidentReporting: {
    title: "DFARS 252.204-7012 Cyber Incident Reporting",
    timeline: [
      { time: "0-1 hours", action: "Detect and contain", details: "Isolate affected systems, preserve evidence, activate IR team" },
      { time: "1-4 hours", action: "Initial assessment", details: "Determine scope, identify CUI impact, classify severity" },
      { time: "4-24 hours", action: "Detailed investigation", details: "Forensic analysis, IOC identification, impact assessment" },
      { time: "24-48 hours", action: "Prepare report", details: "Complete DIBNet incident report form, gather required data" },
      { time: "Within 72 hours", action: "Report to DoD", details: "Submit via DIBNet (https://dibnet.dod.mil). Include: company info, incident description, CUI affected, compromised systems, actions taken" },
      { time: "72+ hours", action: "Ongoing cooperation", details: "Preserve images for 90 days, cooperate with DoD investigation, provide additional data as requested" }
    ],
    requiredData: [
      "Company name, CAGE code, and contract numbers",
      "Date incident discovered and date reported",
      "Type of compromise (data exfiltration, ransomware, unauthorized access, etc.)",
      "Description of CUI affected and marking categories",
      "Systems and networks compromised",
      "Actions taken to contain and remediate",
      "Point of contact information",
      "Forensic images preserved (90-day requirement)"
    ]
  }
};

let content = `// MSSP Playbook Data - Technical/Tactical Guidance for MSSPs
// Includes: SPA/CUI scoping matrix, tool comparison, SOC playbooks,
// onboarding checklists, DFARS 7012 incident reporting guide
// Version: ${data.version}

const MSSP_PLAYBOOK_DATA = `;
content += JSON.stringify(data, null, 2);
content += `;

if (typeof window !== 'undefined') window.MSSP_PLAYBOOK_DATA = MSSP_PLAYBOOK_DATA;
console.log('[MSSP_PLAYBOOK_DATA] Loaded - ' + MSSP_PLAYBOOK_DATA.socPlaybooks.length + ' SOC playbooks, ' + MSSP_PLAYBOOK_DATA.toolMatrix.categories.length + ' tool categories');
`;

fs.writeFileSync(out, content, 'utf8');
const stats = fs.statSync(out);
console.log('Written: ' + out);
console.log('Size: ' + (stats.size / 1024).toFixed(1) + ' KB');
