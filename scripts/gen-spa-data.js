#!/usr/bin/env node
const fs=require('fs'),path=require('path');
const out=path.join(__dirname,'..','data','comprehensive-guidance-spa.js');
function T(s,f,a,st,v,c,h,x){const o={services:s,fedrampStatus:f,assetType:a,implementation:{steps:st,verification:v,cost_estimate:c,effort_hours:h}};if(x)Object.assign(o.implementation,x);return o;}
const O={};

// AC - Access Control
O["AC.L2-3.1.1"]={iam_pam:{
okta:T(["Okta Identity Cloud","Okta Lifecycle Management","Okta Workflows"],"High","Security Protection Asset",["Configure Okta Lifecycle Management with HR-driven provisioning","Create group rules for automatic role assignment by department/title","Set up Okta Workflows to disable accounts after ODP-defined inactivity","Configure deprovisioning: disable → revoke sessions → remove groups → deactivate","Forward Okta System Log to SIEM for account lifecycle audit trail","Set up quarterly access certification via Okta Identity Governance"],["Review Okta System Log for lifecycle events","Verify deprovisioning workflows execute within SLA"],"$6-15/user/month",24),
cyberark:T(["CyberArk Privilege Cloud","Privileged Session Manager"],"High","Security Protection Asset",["Onboard all privileged accounts into CyberArk Vault","Configure automatic password rotation (30-day for service accounts)","Set up Privileged Session Manager with full recording","Create safe-level access controls mapping to org roles","Enable alerts for privileged account changes outside CyberArk"],["Verify all privileged accounts vaulted","Confirm rotation on schedule"],"$50-100/privileged user/month",40),
jumpcloud:T(["JumpCloud Directory Platform"],"Moderate","Security Protection Asset",["Deploy JumpCloud as cloud directory for user lifecycle","Configure SCIM provisioning to downstream apps","Set up group policies for automatic access assignment","Enable account suspension for inactivity","Configure Directory Insights for audit logging"],["Review Directory Insights","Verify SCIM sync","Confirm inactive accounts suspended"],"$7-15/user/month",20),
duo:T(["Cisco Duo Access","Duo Trust Monitor"],"High","Security Protection Asset",["Integrate Duo with IdP for MFA on all account access","Enable Trust Monitor for anomalous auth detection","Set up policies to block inactive/disabled accounts","Configure Auth Proxy for on-prem LDAP/RADIUS"],["Review auth logs","Verify Trust Monitor alerts triaged"],"$3-9/user/month",12)
},xdr_edr:{
crowdstrike:T(["Falcon Identity Threat Detection","Falcon ITDR","Falcon LogScale"],"High","Security Protection Asset",["Deploy Falcon ITDR to monitor AD account changes","Configure policies to alert on unauthorized account creation/modification","Set up LogScale queries for account lifecycle events","Create detection rules for dormant account reactivation","Enable identity risk scoring for privileged accounts"],["Review ITDR alerts","Verify dormant account detection","Confirm risk scores reviewed weekly"],"$15-25/endpoint/month",16),
huntress:T(["Huntress Managed EDR","Huntress Identity Threat Detection"],"N/A","Security Protection Asset",["Deploy Huntress agents for unauthorized account creation monitoring","Enable Identity Threat Detection for AD monitoring","Configure Huntress SOC for 24/7 account event triage","Integrate findings with RMM for remediation"],["Review dashboard for account findings","Verify SOC triage SLAs met"],"$3-5/endpoint/month",8)
},siem:{
splunk:T(["Splunk Cloud","Splunk Enterprise Security"],"High","Security Protection Asset",["Ingest AD/Entra ID account lifecycle logs","Create correlation search: EventCode=4720 OR 4726 for account create/delete","Build dashboard for account lifecycle trends","Configure alert for inactive accounts re-enabled","Set up scheduled report for accounts inactive beyond ODP period"],["Verify logs ingesting < 5 min latency","Confirm correlation searches firing"],
"$15-50/GB/day",20,{splunk_queries:[{name:"Inactive Account Detection",query:'index=windows sourcetype="WinEventLog:Security" EventCode=4624 | stats latest(_time) as last_logon by Account_Name | eval days_inactive=round((now()-last_logon)/86400,0) | where days_inactive > 35 | sort -days_inactive'},{name:"Account Lifecycle Events",query:'index=windows sourcetype="WinEventLog:Security" (EventCode=4720 OR EventCode=4722 OR EventCode=4725 OR EventCode=4726) | eval action=case(EventCode=4720,"Created",EventCode=4722,"Enabled",EventCode=4725,"Disabled",EventCode=4726,"Deleted") | stats count by action, Account_Name'}]}),
sentinel:T(["Microsoft Sentinel","Entra ID Audit Logs"],"High","Security Protection Asset",["Enable Entra ID audit log connector in Sentinel","Deploy analytics rule: Account created and deleted in short timeframe","Create custom KQL for inactive account monitoring per ODP","Configure automation rule to create ticket for unauthorized changes","Build workbook for account lifecycle visualization"],["Verify Entra logs flowing","Confirm analytics rules generating incidents"],"$2.46/GB ingested",16),
blumira:T(["Blumira SIEM","Blumira Cloud Connectors"],"N/A","Security Protection Asset",["Connect Blumira to AD/Entra ID","Enable pre-built detection rules for account anomalies","Configure automated response playbooks","Set up weekly summary reports"],["Verify connector healthy","Confirm rules active"],"$3-7/user/month",8)
},grc:{
vanta:T(["Vanta Continuous Monitoring","Vanta Access Reviews"],"N/A","Security Protection Asset",["Connect Vanta to identity provider","Enable continuous monitoring for account lifecycle","Configure automated access reviews quarterly","Set up tests for inactive/orphaned accounts and MFA"],["Review Vanta dashboard for failing tests","Confirm reviews complete on schedule"],"$5,000-15,000/year",8),
drata:T(["Drata Compliance Automation","Drata Access Reviews"],"N/A","Security Protection Asset",["Integrate Drata with IdP and cloud platforms","Map control to Drata framework","Enable automated evidence collection","Configure access review workflows with manager approval"],["Review control status dashboard","Confirm evidence auto-collected"],"$5,000-20,000/year",8)
}};

O["AC.L2-3.1.2"]={iam_pam:{
okta:T(["Okta Access Gateway","Okta Authorization Server"],"High","Security Protection Asset",["Define authorization policies using group-based access rules","Configure Authorization Server with custom scopes for CUI apps","Implement Access Gateway for on-prem application enforcement","Set up ABAC using Okta Expression Language"],["Review policy evaluation logs","Verify access gateway enforces CUI policies"],"$6-15/user/month",20),
beyondtrust:T(["BeyondTrust Privilege Management","Endpoint Privilege Management"],"Moderate","Security Protection Asset",["Deploy Endpoint Privilege Management for least-privilege on workstations","Configure application control to restrict unauthorized software","Set up privilege elevation for approved admin tasks only","Enable session monitoring for elevated privilege usage"],["Review elevation logs","Verify app control blocks unauthorized apps"],"$30-60/endpoint/month",24)
},xdr_edr:{
crowdstrike:T(["Falcon Zero Trust Assessment","Device Control","Firewall Management"],"High","Security Protection Asset",["Enable Falcon ZTA to score device compliance before access","Configure Device Control to restrict USB/removable media on CUI systems","Set up Firewall Management for CUI network segmentation","Create host group policies based on device posture","Integrate ZTA scores with conditional access in IdP"],["Review ZTA scores across CUI endpoints","Verify Device Control blocks unauthorized media"],"$15-25/endpoint/month",20)
},dlp:{
purview:T(["Microsoft Purview DLP","Information Protection","Data Classification"],"High","Security Protection Asset",["Create CUI sensitivity labels in Purview Information Protection","Configure DLP policies to enforce access controls on CUI-labeled content","Set up auto-labeling for CUI based on content inspection","Enable endpoint DLP to prevent unauthorized CUI transfer","Configure DLP alerts with automated incident creation"],["Review DLP policy match reports","Verify labels applied to CUI"],"Included with M365 E5/G5",24),
netskope:T(["Netskope CASB","Netskope DLP","Private Access"],"Moderate","Security Protection Asset",["Deploy CASB to enforce access policies on cloud apps with CUI","Configure DLP profiles with CUI patterns (ITAR, EAR, FOUO)","Set up Private Access for zero-trust to on-prem CUI","Enable real-time coaching for CUI sharing in unsanctioned apps"],["Review CASB enforcement logs","Verify DLP detects CUI patterns"],"$10-25/user/month",20)
}};

O["AC.L2-3.1.3"]={firewalls:{
zscaler:T(["Zscaler Internet Access","Zscaler Private Access","Data Protection"],"High","Security Protection Asset",["Configure ZIA policies to control outbound CUI data flows","Deploy ZPA for zero-trust access to internal CUI resources","Enable Data Protection to inspect CUI in transit","Set up application segmentation in ZPA to restrict lateral CUI movement"],["Review ZIA policy logs","Verify ZPA segments isolate CUI apps"],"$8-20/user/month",20)
},ndr:{
darktrace:T(["Darktrace Enterprise Immune System","RESPOND","Cyber AI Analyst"],"N/A","Security Protection Asset",["Deploy sensors on CUI network segments to baseline normal flows","Configure alerts on anomalous CUI data movement","Enable RESPOND autonomous actions to block unauthorized exfiltration","Set up Cyber AI Analyst for automated investigation"],["Review model breach alerts for CUI segments","Verify RESPOND actions appropriate"],"$20,000-100,000/year",16),
vectra:T(["Vectra AI Platform","Vectra Detect","Vectra Recall"],"N/A","Security Protection Asset",["Deploy sensors to monitor CUI traffic for unauthorized flows","Configure detection models for exfiltration and lateral movement","Enable Recall for forensic analysis of historical CUI flows","Set up host scoring to prioritize CUI system investigations"],["Review threat scores for CUI hosts","Verify models cover exfiltration scenarios"],"$15,000-80,000/year",16)
},dlp:{
code42:T(["Code42 Incydr","Insider Risk Detection"],"N/A","Security Protection Asset",["Deploy Incydr agents on CUI endpoints","Configure file exposure detection for CUI file types","Set up insider risk indicators for unauthorized CUI movement","Enable automated response for high-risk CUI data flows"],["Review Incydr exposure events","Verify risk indicators calibrated"],"$8-15/user/month",12)
}};

O["AC.L2-3.1.4"]={iam_pam:{
okta:T(["Okta Identity Governance","Okta Group Management"],"High","Security Protection Asset",["Define separation of duties matrix using conflicting group rules","Configure Identity Governance to detect SoD violations","Set up admin role separation: Super Admin, Org Admin, App Admin","Enable access certifications that flag SoD conflicts","Create Workflows to block provisioning creating SoD violations"],["Review SoD violation reports","Verify admin roles follow least-privilege"],"$6-15/user/month",16)
},grc:{
servicenow:T(["ServiceNow GRC","Identity Governance"],"High","Security Protection Asset",["Define SoD rules in ServiceNow GRC module","Configure automated SoD conflict detection during provisioning","Set up periodic SoD reviews with business owner approval","Create SoD violation reports for compliance evidence"],["Review SoD conflict reports","Verify provisioning blocks violations"],"$50-100/user/month",24)
}};

O["AC.L2-3.1.5"]={iam_pam:{
cyberark:T(["CyberArk Privilege Cloud","Endpoint Privilege Manager","Secure Web Sessions"],"High","Security Protection Asset",["Deploy Endpoint Privilege Manager to remove local admin rights","Configure JIT privilege elevation for approved admin tasks","Set up Privilege Cloud with least-privilege safe access policies","Enable Secure Web Sessions for cloud console access with recording","Create privilege review workflows with automatic revocation"],["Verify no standing local admin rights","Confirm JIT requests logged and approved"],"$50-100/privileged user/month",32),
delinea:T(["Delinea Secret Server","Privilege Manager","Server Suite"],"High","Security Protection Asset",["Deploy Privilege Manager for endpoint least-privilege","Configure application control to elevate only approved apps","Set up Secret Server with role-based folder access","Enable JIT access with time-limited grants"],["Review elevation logs","Verify Secret Server follows role-based policies"],"$30-70/user/month",24),
keeper:T(["Keeper Vault","Secrets Manager","Connection Manager"],"Moderate","Security Protection Asset",["Deploy Keeper Vault with role-based folder structure","Configure Secrets Manager for service account credential rotation","Set up Connection Manager for secure RDP/SSH without exposing creds","Enable enforcement policies: complexity, sharing restrictions, 2FA","Configure BreachWatch for compromised credential monitoring"],["Review audit logs for credential access","Verify rotation executing"],"$4-8/user/month",12)
},cspm:{
wiz:T(["Wiz CIEM","Wiz Cloud Security Platform"],"N/A","Security Protection Asset",["Deploy Wiz CIEM to analyze effective cloud permissions","Identify overly permissive IAM roles with identity graph","Generate least-privilege recommendations for service accounts","Set up rules to alert on privilege escalation paths"],["Review CIEM findings","Verify remediation reduces privilege scope"],"$30,000-100,000/year",16),
prisma_cloud:T(["Prisma Cloud CIEM","IAM Security","Governance"],"Moderate","Security Protection Asset",["Enable IAM Security module for cloud identity analysis","Configure net-effective permissions analysis","Set up alerts for overly permissive IAM policies","Create governance rules enforcing least-privilege"],["Review IAM Security dashboard","Verify governance rules enforced"],"$20,000-80,000/year",16)
}};

O["AC.L2-3.1.6"]={iam_pam:{
cyberark:T(["CyberArk Privilege Cloud","Identity Administration"],"High","Security Protection Asset",["Inventory all privileged accounts and map to authorized personnel","Onboard all privileged accounts into Vault with role-based safe access","Configure checkout/approval for privileged account usage","Set up dual-control approval for highest-privilege accounts","Enable Privileged Threat Analytics for unauthorized privilege use"],["Verify all privileged accounts vaulted","Confirm checkout workflows function"],"$50-100/privileged user/month",24),
beyondtrust:T(["BeyondTrust Password Safe","Privileged Remote Access"],"Moderate","Security Protection Asset",["Deploy Password Safe to vault all privileged credentials","Configure Privileged Remote Access for vendor/admin sessions with recording","Set up approval workflows for privileged account checkout","Enable session monitoring and recording"],["Review checkout logs","Verify session recordings retained"],"$30-60/user/month",20)
}};

O["AC.L2-3.1.7"]={iam_pam:{
okta:T(["Okta Sign-On Policy","ThreatInsight","Behaviors"],"High","Security Protection Asset",["Configure Sign-On Policy with lockout after ODP-defined failures","Set lockout duration per ODP requirements","Enable ThreatInsight to block known malicious IPs","Configure Behaviors for anomalous auth pattern detection"],["Test lockout triggers after defined attempts","Verify ThreatInsight blocks bad IPs"],"$6-15/user/month",4)
}};

O["AC.L2-3.1.8"]={iam_pam:{
okta:T(["Okta Sign-On Policy","ThreatInsight"],"High","Security Protection Asset",["Configure Sign-On Policy with lockout after ODP-defined consecutive failures","Set lockout duration per ODP (e.g., 15 min or until admin unlock)","Enable ThreatInsight to proactively block known malicious IPs","Set up admin notifications for repeated lockout events"],["Test lockout triggers","Verify ThreatInsight blocks bad IPs"],"$6-15/user/month",4),
duo:T(["Cisco Duo","Duo Trust Monitor"],"High","Security Protection Asset",["Configure Duo lockout policy per ODP","Enable Trust Monitor for credential stuffing detection","Set up alerts for repeated failures","Configure Auth Proxy for RADIUS/LDAP lockout"],["Test lockout triggers","Verify Trust Monitor detects brute-force"],"$3-9/user/month",4)
},siem:{
splunk:T(["Splunk Cloud","Splunk ES"],"High","Security Protection Asset",["Create correlation search for consecutive failed logons exceeding ODP","Build dashboard for failed logon trends by user/source IP","Configure notable event for brute-force with auto enrichment","Set up adaptive response to disable account after threshold"],["Verify correlation search fires on threshold","Confirm adaptive response disables accounts"],"$15-50/GB/day",8,{splunk_queries:[{name:"Brute Force Detection",query:'index=windows sourcetype="WinEventLog:Security" EventCode=4625 | bin _time span=15m | stats count by Account_Name, src_ip, _time | where count >= 3 | sort -count'}]})
}};

O["AC.L2-3.1.10"]={mdm_uem:{
intune:T(["Microsoft Intune","Configuration Profiles","Compliance Policies"],"High","Security Protection Asset",["Create Configuration Profile: screen lock timeout = ODP period","Configure compliance policy requiring device lock with password/PIN","Set up Conditional Access to block non-compliant devices from CUI","Deploy profiles for Windows, macOS, iOS/Android"],["Verify profiles deploy to all devices","Test lock triggers after inactivity"],"Included with M365 E3/E5",8),
jamf:T(["Jamf Pro","Configuration Profiles","Compliance Reporter"],"Moderate","Security Protection Asset",["Create profile with screen saver activation after ODP inactivity","Configure password requirement on wake","Deploy Compliance Reporter for verification","Set up smart groups for non-compliant Macs"],["Verify profile installed on all Macs","Test screen lock activates"],"$4-8/device/month",4),
kandji:T(["Kandji MDM","Blueprints","Compliance"],"N/A","Security Protection Asset",["Configure Blueprint with screen lock per ODP","Enable auto-remediation to re-apply if user changes settings","Set up compliance library for NIST screen lock requirements"],["Verify Blueprint deploys","Confirm auto-remediation works"],"$5-9/device/month",4)
},rmm:{
datto_rmm:T(["Datto RMM","ComStore","Monitoring"],"N/A","Security Protection Asset",["Deploy ComStore component for screen lock enforcement","Configure monitoring for devices without screen lock","Set up automated job to apply registry settings","Create compliance report"],["Verify component deploys","Confirm monitoring detects non-compliant"],"$3-5/device/month",4)
}};

O["AC.L2-3.1.12"]={firewalls:{
zscaler:T(["Zscaler Private Access","Internet Access","Client Connector"],"High","Security Protection Asset",["Deploy Client Connector on all remote endpoints","Configure ZPA application segments for CUI resources","Set up device posture checks: OS, encryption, EDR agent","Enable browser isolation for sensitive CUI web apps","Configure ZIA for acceptable use enforcement"],["Verify Client Connector on all remotes","Confirm ZPA restricts to authorized CUI apps"],"$8-20/user/month",20)
}};

O["AC.L2-3.1.13"]={iam_pam:{
okta:T(["Okta Adaptive MFA","Okta Verify","FIDO2"],"High","Security Protection Asset",["Configure Adaptive MFA with context-aware policies","Require MFA for both local and network access to CUI","Enable FIDO2 security keys as primary MFA factor","Set up Okta Verify with biometric verification","Disable SMS/voice as MFA factors (phishing-susceptible)"],["Verify MFA on all CUI access","Confirm phishing-resistant factors enforced"],"$6-15/user/month",8),
duo:T(["Cisco Duo MFA","Duo Push","Duo Passwordless"],"High","Security Protection Asset",["Deploy Duo MFA across all CUI apps and VPN","Configure Verified Duo Push (number matching)","Enable Duo Passwordless for FIDO2 authentication","Set up policies requiring MFA for all access types"],["Verify Duo MFA on all CUI apps","Test FIDO2 authentication"],"$3-9/user/month",8)
}};

O["AC.L2-3.1.16"]={firewalls:{
cisco:T(["Cisco Meraki Wireless","Cisco ISE","DNA Center"],"Moderate","Security Protection Asset",["Configure separate SSIDs for CUI and non-CUI wireless","Enable 802.1X auth with Cisco ISE for CUI wireless","Set up ISE posture assessment for wireless devices","Configure Meraki wireless intrusion prevention","Enable WPA3-Enterprise on CUI wireless network"],["Verify 802.1X required for CUI SSID","Confirm ISE posture checks block non-compliant"],"$10-30/AP/month",16)
}};

O["AC.L2-3.1.18"]={mdm_uem:{
intune:T(["Microsoft Intune","App Protection","Conditional Access"],"High","Security Protection Asset",["Configure device enrollment for all mobiles accessing CUI","Create compliance policies: encryption, min OS, jailbreak detection","Set up App Protection Policies for CUI apps without full enrollment","Configure Conditional Access requiring compliant device","Enable remote wipe for lost/stolen devices"],["Verify all mobiles enrolled or have MAM","Test remote wipe"],"Included with M365 E3/E5",16),
jamf:T(["Jamf Pro","Jamf Protect","Jamf Connect"],"Moderate","Security Protection Asset",["Deploy Jamf Pro for iOS/iPadOS with supervised enrollment","Configure Jamf Protect for mobile threat detection","Set up restriction profiles: disable AirDrop, require encryption","Enable Lost Mode and remote wipe"],["Verify all Apple devices supervised","Test Lost Mode and wipe"],"$4-8/device/month",12),
workspace_one:T(["Workspace ONE UEM","Access","Intelligence"],"Moderate","Security Protection Asset",["Deploy UEM for cross-platform mobile management","Configure compliance policies for all platforms","Set up Access for SSO with device trust","Enable container encryption for CUI on mobile"],["Verify all mobiles enrolled","Confirm compliance enforces encryption"],"$5-12/device/month",16)
}};

O["AC.L2-3.1.20"]={xdr_edr:{
crowdstrike:T(["Falcon Device Control","USB Device Control"],"High","Security Protection Asset",["Enable Falcon Device Control for USB/removable media management","Create policies: block all USB storage, allow approved vendor IDs only","Configure read-only exceptions for approved encrypted USBs","Set up alerts for unauthorized USB attempts"],["Verify block policy enforced","Review unauthorized attempt alerts"],"$15-25/endpoint/month",8)
}};

O["AC.L2-3.1.22"]={dlp:{
purview:T(["Microsoft Purview DLP","Compliance Manager","eDiscovery"],"High","Security Protection Asset",["Configure Purview DLP to scan public-facing SharePoint for CUI","Set up auto-labeling to detect CUI in publicly accessible content","Enable DLP alerts for CUI in public Teams channels","Create eDiscovery searches to audit public content for CUI"],["Review DLP matches for public content","Verify auto-labeling detects CUI"],"Included with M365 E5/G5",12)
}};

// AT - Awareness and Training
O["AT.L2-3.2.1"]={security_awareness:{
knowbe4:T(["KnowBe4 KMSAT","PhishER","Security Awareness Training"],"Moderate","Security Protection Asset",["Deploy KMSAT with CUI-specific training modules","Configure automated campaigns: new hire (immediate), recurring (quarterly)","Set up phishing simulations with increasing difficulty","Enable PhishER for automated phishing email triage","Create custom content for CUI handling, insider threat, social engineering"],["Review completion rates (target: 100%)","Verify phishing click rates trending down"],"$15-25/user/year",12),
ninjio:T(["Ninjio Security Awareness","Phishing Simulator"],"N/A","Security Protection Asset",["Deploy Ninjio with micro-learning episodes (3-4 min)","Configure automated monthly delivery","Set up phishing simulations aligned with training topics","Enable compliance tracking for CMMC evidence"],["Review episode completion rates","Verify phishing results"],"$3-6/user/month",4)
}};

O["AT.L2-3.2.2"]={security_awareness:{
knowbe4:T(["KnowBe4 KMSAT","Role-Based Training","Compliance Plus"],"Moderate","Security Protection Asset",["Create role-based groups: IT Admin, Security, Developers, Executives","Assign role-specific modules (secure coding for devs, IR for security)","Configure automated enrollment based on AD/Okta group membership","Set up deadlines with escalation for non-completion"],["Verify groups match org structure","Review completion by role"],"$15-25/user/year",8)
}};

// AU - Audit and Accountability
O["AU.L2-3.3.1"]={siem:{
splunk:T(["Splunk Cloud","Enterprise Security","Add-ons"],"High","Security Protection Asset",["Deploy Universal Forwarder to all CUI systems","Configure sources: Windows Events, Linux syslog/auditd, network, cloud APIs","Install Add-ons for AD, O365, AWS, Azure, Palo Alto, CrowdStrike","Define index strategy: separate for security, app, network, cloud","Configure retention matching ODP period","Set up ES with CIM-compliant data models"],["Verify all CUI systems forwarding","Review retention meets ODP"],"$15-50/GB/day",40,{splunk_queries:[{name:"Log Source Inventory",query:'| tstats count where index=* by index, sourcetype, host | stats dc(host) as host_count, sum(count) as event_count by index, sourcetype | sort -event_count'}]}),
sentinel:T(["Microsoft Sentinel","Azure Monitor","Log Analytics"],"High","Security Protection Asset",["Create Log Analytics Workspace in GCC High","Enable connectors: Entra ID, M365 Defender, Azure Activity, Syslog, CEF","Configure Azure Monitor diagnostics for all CUI resources","Deploy AMA on all on-prem CUI servers","Set up retention to match ODP (up to 730 days)"],["Verify all connectors healthy","Confirm AMA agents reporting"],"$2.46/GB ingested",32),
sumo_logic:T(["Sumo Logic Cloud SIEM","Log Analytics"],"Moderate","Security Protection Asset",["Deploy collectors on all CUI systems","Configure cloud-to-cloud integrations for SaaS sources","Set up partitions for efficient querying and retention","Enable Cloud SIEM for automated threat detection"],["Verify collectors healthy","Review SIEM detection coverage"],"$3-10/GB/day",24),
blumira:T(["Blumira SIEM+XDR","Cloud Connectors"],"N/A","Security Protection Asset",["Deploy sensors for on-prem log collection","Configure cloud connectors for M365, Google, AWS, Azure","Enable pre-built detection rules for NIST event types","Set up automated response playbooks"],["Verify all sources connected","Confirm rules active"],"$3-7/user/month",8)
}};

O["AU.L2-3.3.2"]={siem:{
splunk:T(["Splunk Cloud","Enterprise Security"],"High","Security Protection Asset",["Configure ES correlation searches for user activity monitoring","Set up risk-based alerting to aggregate events into findings","Create dashboards for security event trends","Configure scheduled reports for audit review"],["Review correlation search effectiveness","Verify RBA scores calibrated"],"$15-50/GB/day",20)
}};

O["AU.L2-3.3.3"]={siem:{
splunk:T(["Splunk ES","ITSI","Dashboard Studio"],"High","Security Protection Asset",["Configure ES correlation searches for inappropriate activities per ODP","Set up risk-based alerting (RBA) to aggregate events into findings","Create executive dashboards for security posture trends","Configure scheduled reports for weekly/monthly review"],["Review correlation search effectiveness weekly","Confirm reports delivered on time"],"$15-50/GB/day + ES license",24,{splunk_queries:[{name:"Unusual After-Hours Activity",query:'index=windows sourcetype="WinEventLog:Security" EventCode=4624 Logon_Type=10 | eval hour=strftime(_time,"%H") | where hour < 6 OR hour > 22 | stats count by Account_Name, src_ip | where count > 3'},{name:"Data Exfiltration Indicators",query:'index=proxy OR index=firewall action=allowed bytes_out>10000000 | stats sum(bytes_out) as total_bytes by src_ip, dest_ip | eval total_MB=round(total_bytes/1048576,2) | where total_MB > 100 | sort -total_MB'}]})
},soar:{
cortex_xsoar:T(["Cortex XSOAR","Marketplace","TIM"],"Moderate","Security Protection Asset",["Deploy XSOAR with SIEM integration for automated alert triage","Install marketplace content packs for audit analysis playbooks","Configure automated enrichment for suspicious indicators","Set up war room for collaborative investigation"],["Verify SIEM integration ingesting alerts","Confirm playbooks execute correctly"],"$40,000-100,000/year",32),
splunk_soar:T(["Splunk SOAR","Playbooks","Apps"],"High","Security Protection Asset",["Deploy SOAR integrated with Splunk ES","Configure playbooks for notable event triage and enrichment","Set up response actions: user disable, endpoint isolate, ticket creation","Enable MTTD/MTTR reporting"],["Verify SOAR receives ES notables","Review MTTD/MTTR weekly"],"Included with ES Premium or $30,000+/year",24),
tines:T(["Tines Security Automation","Stories","Cases"],"N/A","Security Protection Asset",["Create stories for automated audit analysis workflows","Configure SIEM webhook for real-time alert ingestion","Build enrichment stories correlating with threat intel","Set up Cases for tracking investigations"],["Verify webhook receives alerts","Review case management"],"Free community or $50,000+/year",16)
}};

O["AU.L2-3.3.4"]={siem:{
splunk:T(["Splunk Monitoring Console","Alerts"],"High","Security Protection Asset",["Configure Monitoring Console to track forwarder health","Create alert: missing log sources (no events > 1 hour)","Set up alert for index queue blocking","Configure PagerDuty/Slack notifications for failures"],["Verify monitoring tracks all forwarders","Test alert fires when source goes silent"],"Included with Splunk",8,{splunk_queries:[{name:"Silent Log Sources",query:'| tstats latest(_time) as last_event by host | eval hours_silent=round((now()-last_event)/3600,1) | where hours_silent > 1 | sort -hours_silent'}]})
},itsm:{
jira:T(["Jira Service Management","Automation","Opsgenie"],"Moderate","Security Protection Asset",["Configure JSM to receive audit failure alerts from SIEM","Set up Automation rules to escalate unacknowledged tickets","Integrate Opsgenie for on-call alerting","Create SLA policies (acknowledge within 15 min)"],["Verify SIEM creates tickets on failure","Confirm Opsgenie alerts on-call"],"$20-50/agent/month",8)
}};

O["AU.L2-3.3.6"]={rmm:{
datto_rmm:T(["Datto RMM","Monitoring"],"N/A","Security Protection Asset",["Deploy script to configure NTP on all managed endpoints","Set authoritative time source per ODP","Configure monitoring for NTP sync status","Set up alerts for time drift exceeding threshold"],["Verify NTP configured on all endpoints","Confirm drift within range"],"$3-5/device/month",4)
}};

O["AU.L2-3.3.7"]={backup:{
veeam:T(["Veeam Backup & Replication","Immutable Backups","Veeam ONE"],"Moderate","Security Protection Asset",["Configure Veeam to back up SIEM/log storage with immutable copies","Enable hardened repository with immutability","Set up backup copy jobs to offsite/cloud","Configure Veeam ONE monitoring for backup health","Enable encryption for audit log backup data"],["Verify immutable backups on schedule","Test restore of audit logs"],"$5-15/workload/month",8),
acronis:T(["Acronis Cyber Protect Cloud","Immutable Storage"],"N/A","Security Protection Asset",["Deploy Acronis for audit log system backup","Enable immutable storage for retention","Configure plans matching audit requirements","Enable ransomware protection for backup data"],["Verify backups complete","Test restore"],"$3-10/workload/month",4)
}};

// CM - Configuration Management
O["CM.L2-3.4.1"]={vuln_mgmt:{
qualys:T(["Qualys VMDR","Policy Compliance","Global AssetView"],"High","Security Protection Asset",["Deploy Cloud Agents on all CUI systems","Configure Policy Compliance with CIS/STIG baselines","Set up Global AssetView for asset inventory","Create compliance policies mapping to NIST 800-171"],["Verify agents on all CUI systems","Review deviation reports"],"$25-60/asset/year",24),
rapid7:T(["Rapid7 InsightVM","InsightConnect","InsightAgent"],"Moderate","Security Protection Asset",["Deploy InsightAgent on all CUI systems","Configure policy assessments for CIS/STIG baselines","Set up asset groups and tagging for CUI systems","Create remediation projects for baseline deviations"],["Verify agents on all systems","Review remediation progress"],"$20-50/asset/year",20)
},rmm:{
connectwise:T(["ConnectWise Automate","Patch Management","Scripting"],"Moderate","Security Protection Asset",["Deploy Automate agents for asset inventory","Configure automated inventory collection","Set up scripting for baseline configuration enforcement","Create monitors for configuration drift detection"],["Verify agents on all CUI systems","Review drift alerts"],"$3-6/device/month",12)
}};

O["CM.L2-3.4.2"]={mdm_uem:{
intune:T(["Intune Configuration Profiles","Security Baselines","Compliance Policies"],"High","Security Protection Asset",["Deploy Intune Security Baselines for Windows endpoints","Create custom configuration profiles for CUI-specific settings","Configure compliance policies to detect non-compliant configs","Set up Conditional Access to block non-compliant from CUI"],["Verify baselines deploy to all devices","Test Conditional Access blocks non-compliant"],"Included with M365 E3/E5",16)
}};

O["CM.L2-3.4.5"]={iam_pam:{
okta:T(["Okta Workflows","Okta Governance"],"High","Security Protection Asset",["Configure Workflows to enforce change management approval","Set up Governance for access request and approval workflows","Create policies requiring manager approval for CUI system access","Enable audit logging for all access change events"],["Verify approval workflows execute","Confirm audit logs capture all changes"],"$6-15/user/month",12)
}};

O["CM.L2-3.4.6"]={xdr_edr:{
crowdstrike:T(["Falcon Prevention Policies","Falcon Firewall","Device Control"],"High","Security Protection Asset",["Configure Prevention Policies to block unauthorized applications","Enable Falcon Firewall to restrict unnecessary network services","Set up device control to limit peripheral access","Create IOA rules for unauthorized software detection"],["Verify prevention policies block unauthorized apps","Review IOA rule triggers"],"$15-25/endpoint/month",12)
}};

O["CM.L2-3.4.8"]={xdr_edr:{
sentinelone:T(["SentinelOne Application Control"],"Moderate","Security Protection Asset",["Enable Application Control in enforcement mode (deny-by-default)","Build application whitelist from baseline inventory","Configure exception process for new approved applications","Set up alerts for blocked execution attempts"],["Verify deny-by-default active","Review blocked execution reports"],"$6-12/endpoint/month",16)
}};

// IA - Identification and Authentication
O["IA.L2-3.5.1"]={iam_pam:{
okta:T(["Okta Universal Directory","Okta SSO","Device Trust"],"High","Security Protection Asset",["Configure Universal Directory as authoritative identity source","Enable SSO for all CUI applications with SAML/OIDC","Set up Device Trust to verify device identity before access","Implement FastPass for passwordless device-bound authentication"],["Verify all users in Universal Directory","Confirm SSO covers all CUI apps"],"$6-15/user/month",20),
jumpcloud:T(["JumpCloud Directory","SSO","Device Management"],"Moderate","Security Protection Asset",["Deploy JumpCloud as cloud directory for user/device identification","Configure SSO for all CUI applications","Enable device management for device identity verification","Set up conditional access based on device trust"],["Verify all users and devices in JumpCloud","Test conditional access"],"$7-15/user/month",16)
}};

O["IA.L2-3.5.2"]={iam_pam:{
okta:T(["Okta MFA","Okta Verify","FastPass"],"High","Security Protection Asset",["Enable MFA for all users with phishing-resistant factors (FIDO2, Okta Verify)","Configure auth policies requiring MFA for CUI app access","Set up FastPass for passwordless auth on managed devices","Disable SMS/voice as MFA factors"],["Verify MFA enabled for all users","Confirm phishing-resistant factors enforced"],"$6-15/user/month",8),
duo:T(["Cisco Duo MFA","Duo Push","Duo Passwordless"],"High","Security Protection Asset",["Deploy Duo MFA across all CUI apps and VPN","Configure Verified Duo Push (number matching)","Enable Passwordless for FIDO2 security key auth","Set up policies requiring MFA for all access types"],["Verify Duo MFA on all CUI apps","Test FIDO2 auth"],"$3-9/user/month",8)
}};

O["IA.L2-3.5.3"]={iam_pam:{
okta:T(["Okta Adaptive MFA","FIDO2"],"High","Security Protection Asset",["Configure Adaptive MFA with context-aware policies","Require MFA for both local and network access to CUI","Enable FIDO2 security keys as primary MFA factor","Disable weak MFA methods (SMS, voice)"],["Verify MFA on all CUI access","Confirm FIDO2 enforced"],"$6-15/user/month",8),
duo:T(["Cisco Duo","Duo Trust Monitor"],"High","Security Protection Asset",["Deploy Duo for local and network MFA","Configure Verified Push for all users","Enable Trust Monitor for anomalous auth detection","Set up risk-based authentication policies"],["Verify MFA on local and network access","Confirm Trust Monitor active"],"$3-9/user/month",8)
}};

O["IA.L2-3.5.7"]={iam_pam:{
keeper:T(["Keeper Vault","Keeper Enterprise"],"Moderate","Security Protection Asset",["Deploy Keeper Vault with enforced password complexity policies","Configure minimum password length per ODP requirements","Enable BreachWatch for compromised password detection","Set up password rotation reminders","Configure Keeper admin console for policy enforcement"],["Verify password policies enforced","Confirm BreachWatch active"],"$4-8/user/month",4)
}};

O["IA.L2-3.5.10"]={iam_pam:{
okta:T(["Okta Credential Management"],"High","Security Protection Asset",["Configure Okta password policies with encryption at rest","Enable secure credential storage with AES-256 encryption","Set up credential rotation policies for service accounts","Configure audit logging for credential access events"],["Verify credentials encrypted at rest","Confirm rotation policies active"],"$6-15/user/month",8)
}};

// IR - Incident Response
O["IR.L2-3.6.1"]={soar:{
cortex_xsoar:T(["Cortex XSOAR","Marketplace"],"Moderate","Security Protection Asset",["Deploy XSOAR for incident response workflow automation","Configure incident classification and severity playbooks","Set up automated enrichment for IOCs","Create escalation workflows per incident type","Enable case management for incident tracking"],["Verify playbooks execute correctly","Confirm case management tracks all incidents"],"$40,000-100,000/year",32),
swimlane:T(["Swimlane SOAR","Turbine"],"N/A","Security Protection Asset",["Deploy Swimlane for low-code incident response automation","Configure incident intake from SIEM and EDR","Set up automated triage and enrichment workflows","Create response playbooks for common incident types"],["Verify incident intake working","Confirm playbooks execute"],"$30,000-80,000/year",24)
},itsm:{
jira:T(["Jira Service Management","Opsgenie"],"Moderate","Security Protection Asset",["Configure JSM for incident ticket management","Set up Opsgenie for on-call alerting and escalation","Create incident templates with required fields","Configure SLA policies for incident response times","Enable post-incident review workflows"],["Verify incident tickets created automatically","Confirm Opsgenie alerts on-call"],"$20-50/agent/month",12)
}};

O["IR.L2-3.6.2"]={siem:{
splunk:T(["Splunk ES","Splunk SOAR"],"High","Security Protection Asset",["Configure ES notable events for incident detection","Set up SOAR playbooks for automated incident response","Create investigation dashboards for incident analysis","Enable threat intelligence correlation for IOC enrichment"],["Verify ES detects incidents","Confirm SOAR playbooks execute"],"$15-50/GB/day + ES",24)
}};

// MA - Maintenance
O["MA.L2-3.7.5"]={iam_pam:{
cyberark:T(["CyberArk Privileged Remote Access"],"High","Security Protection Asset",["Configure Privileged Remote Access for maintenance sessions","Enable session recording for all remote maintenance","Set up approval workflows for maintenance access","Configure time-limited access windows","Enable MFA for all maintenance sessions"],["Verify session recordings captured","Confirm time-limited access expires"],"$50-100/user/month",16),
beyondtrust:T(["BeyondTrust Privileged Remote Access"],"Moderate","Security Protection Asset",["Deploy Privileged Remote Access for vendor maintenance sessions","Enable session recording and monitoring","Configure approval workflows for maintenance access","Set up time-limited access with automatic revocation"],["Verify session recordings","Confirm access revoked after window"],"$30-60/user/month",12)
}};

// MP - Media Protection
O["MP.L2-3.8.1"]={dlp:{
purview:T(["Microsoft Purview DLP","Information Protection"],"High","Security Protection Asset",["Configure sensitivity labels for CUI media classification","Set up DLP policies to prevent CUI on unauthorized media","Enable endpoint DLP for removable media control","Configure auto-labeling for CUI content detection"],["Review DLP policy matches","Verify labels applied"],"Included with M365 E5/G5",16)
}};

O["MP.L2-3.8.3"]={dlp:{
purview:T(["Microsoft Purview DLP","Endpoint DLP"],"High","Security Protection Asset",["Configure Endpoint DLP to control CUI on removable media","Set up policies requiring encryption for CUI on portable devices","Enable DLP alerts for unauthorized CUI media transfer","Configure exceptions for approved encrypted devices only"],["Verify Endpoint DLP blocks unauthorized transfers","Confirm encryption required"],"Included with M365 E5/G5",12)
},xdr_edr:{
sentinelone:T(["SentinelOne Device Control"],"Moderate","Security Protection Asset",["Configure Device Control to block USB storage by default","Create exceptions for approved encrypted USB devices only","Set up alerts for USB connection attempts on CUI endpoints","Monitor device connection events via Deep Visibility"],["Verify USB blocked by default","Confirm only approved devices allowed"],"$6-12/endpoint/month",8)
}};

O["MP.L2-3.8.6"]={backup:{
veeam:T(["Veeam Backup & Replication","Encryption"],"Moderate","Security Protection Asset",["Configure Veeam encryption for all CUI backup media","Enable AES-256 encryption for backup files at rest","Set up encrypted backup copy jobs for offsite transport","Configure key management for backup encryption keys"],["Verify encryption enabled on all CUI backups","Confirm key management procedures"],"$5-15/workload/month",8),
druva:T(["Druva Data Protection","Encryption"],"Moderate","Security Protection Asset",["Configure Druva with encryption for CUI data at rest and in transit","Enable immutable backups for CUI data protection","Set up air-gapped backup copies for ransomware protection","Configure compliance reports for encrypted backup verification"],["Verify encryption on all backups","Confirm immutability enabled"],"$3-8/user/month",4)
}};

// PE - Physical and Environmental Protection
O["PE.L2-3.10.1"]={physical_security:{
verkada:T(["Verkada Security Cameras","Access Control","Guest Management"],"N/A","Security Protection Asset",["Deploy Verkada cameras at CUI facility entry/exit points","Configure Verkada Access Control for door access management","Set up role-based access policies for CUI areas","Enable guest management for visitor tracking","Configure motion alerts for after-hours access to CUI areas"],["Verify cameras cover all CUI entry points","Confirm access policies enforced"],"$15-30/device/month",16),
brivo:T(["Brivo Access Control","Smart Spaces"],"N/A","Security Protection Asset",["Deploy Brivo cloud-based access control for CUI facilities","Configure access groups for CUI area authorization","Set up time-based access schedules","Enable audit logging for all door access events","Configure mobile credentials for authorized personnel"],["Verify access control on all CUI doors","Review access logs"],"$10-25/door/month",12)
}};

// PS - Personnel Security
O["PS.L2-3.9.2"]={iam_pam:{
okta:T(["Okta Lifecycle Management","Okta Workflows"],"High","Security Protection Asset",["Configure Okta Workflows for immediate account deactivation on termination","Set up automated deprovisioning: disable account, revoke sessions, remove access","Integrate with HR system for termination event triggers","Configure audit trail for all termination-related access changes","Set up verification workflow to confirm all access revoked"],["Verify immediate deactivation on termination","Confirm all sessions revoked"],"$6-15/user/month",8)
}};

// RA - Risk Assessment
O["RA.L2-3.11.1"]={vuln_mgmt:{
qualys:T(["Qualys VMDR","TotalCloud"],"High","Security Protection Asset",["Deploy Qualys VMDR for continuous vulnerability assessment","Configure automated scanning schedules for CUI systems","Set up risk-based prioritization using QDS scores","Create remediation workflows with SLA tracking","Enable TotalCloud for cloud asset vulnerability management"],["Verify all CUI systems scanned","Review remediation SLA compliance"],"$25-60/asset/year",20),
rapid7:T(["Rapid7 InsightVM","InsightConnect"],"Moderate","Security Protection Asset",["Deploy InsightVM for vulnerability scanning across CUI environment","Configure risk-based prioritization using Real Risk Score","Set up InsightConnect for automated remediation workflows","Create dashboards for vulnerability trending"],["Verify scanning covers all CUI systems","Review risk score trends"],"$20-50/asset/year",16)
}};

O["RA.L2-3.11.2"]={vuln_mgmt:{
qualys:T(["Qualys VMDR","Patch Management"],"High","Security Protection Asset",["Configure Qualys for continuous vulnerability scanning per ODP frequency","Set up automated patch deployment for critical vulnerabilities","Create vulnerability remediation SLAs by severity","Enable zero-day vulnerability alerting"],["Verify scanning frequency meets ODP","Confirm critical patches deployed within SLA"],"$25-60/asset/year",16)
}};

// CA - Security Assessment
O["CA.L2-3.12.1"]={grc:{
vanta:T(["Vanta Continuous Monitoring","Compliance Automation"],"N/A","Security Protection Asset",["Connect Vanta to all infrastructure and SaaS platforms","Map NIST 800-171 controls to Vanta framework","Enable continuous monitoring for control effectiveness","Configure automated evidence collection for assessments","Generate assessment-ready compliance reports"],["Review Vanta control status","Confirm evidence auto-collected"],"$5,000-15,000/year",12),
drata:T(["Drata Compliance Automation","Monitoring"],"N/A","Security Protection Asset",["Integrate Drata with infrastructure and identity platforms","Map NIST 800-171 controls to Drata framework","Enable continuous monitoring and alerting","Configure automated evidence collection"],["Review control status dashboard","Confirm monitoring active"],"$5,000-20,000/year",12),
secureframe:T(["Secureframe Compliance","Monitoring"],"N/A","Security Protection Asset",["Deploy Secureframe with NIST 800-171 framework mapping","Connect to cloud, identity, and endpoint platforms","Enable continuous compliance monitoring","Configure automated evidence collection and reporting"],["Review compliance dashboard","Confirm evidence collected"],"$5,000-15,000/year",10)
}};

O["CA.L2-3.12.3"]={vuln_mgmt:{
tenable:T(["Tenable.io","Nessus"],"High","Security Protection Asset",["Configure continuous vulnerability monitoring for CUI systems","Set up compliance scanning for configuration baselines","Create dashboards for security control effectiveness","Enable automated alerting for new critical vulnerabilities"],["Verify continuous monitoring active","Review control effectiveness reports"],"$30-65/asset/year",16)
}};

// SC - System and Communications Protection
O["SC.L2-3.13.1"]={firewalls:{
zscaler:T(["Zscaler Internet Access","Private Access"],"High","Security Protection Asset",["Configure ZIA for boundary protection of CUI communications","Deploy ZPA for zero-trust internal CUI access","Set up SSL inspection for encrypted traffic monitoring","Enable threat prevention for inbound/outbound CUI traffic"],["Verify ZIA policies enforce boundary protection","Confirm ZPA segments CUI access"],"$8-20/user/month",20)
},ndr:{
darktrace:T(["Darktrace Enterprise","RESPOND"],"N/A","Security Protection Asset",["Deploy Darktrace sensors at CUI network boundaries","Configure AI models for boundary anomaly detection","Enable RESPOND for autonomous boundary threat response","Set up Cyber AI Analyst for boundary incident investigation"],["Review boundary anomaly alerts","Verify RESPOND actions appropriate"],"$20,000-100,000/year",16)
}};

O["SC.L2-3.13.4"]={email_security:{
proofpoint:T(["Proofpoint Email Protection","Targeted Attack Protection"],"High","Security Protection Asset",["Deploy Proofpoint for inbound/outbound email security","Configure Targeted Attack Protection for advanced threat detection","Set up URL defense for link rewriting and sandboxing","Enable attachment sandboxing for malware detection","Configure DMARC/DKIM/SPF enforcement"],["Verify email filtering active","Confirm TAP detects threats"],"$3-8/user/month",12),
mimecast:T(["Mimecast Email Security","Targeted Threat Protection"],"Moderate","Security Protection Asset",["Deploy Mimecast for email gateway security","Configure Targeted Threat Protection for URL and attachment scanning","Set up impersonation protection for executive accounts","Enable DMARC management and enforcement"],["Verify email security active","Confirm TTP detects threats"],"$3-7/user/month",12),
abnormal:T(["Abnormal Security","Email Account Takeover Protection"],"N/A","Security Protection Asset",["Deploy Abnormal Security for AI-based email threat detection","Configure behavioral analysis for BEC and social engineering","Set up account takeover protection for email accounts","Enable automated remediation for detected threats"],["Verify AI detection active","Review threat detection accuracy"],"$4-10/user/month",8)
}};

O["SC.L2-3.13.8"]={firewalls:{
zscaler:T(["Zscaler Internet Access","SSL Inspection"],"High","Security Protection Asset",["Configure ZIA with TLS 1.2+ enforcement for all CUI traffic","Enable SSL inspection for encrypted traffic visibility","Set up certificate pinning exceptions for approved services","Configure crypto policy to block weak cipher suites"],["Verify TLS 1.2+ enforced","Confirm weak ciphers blocked"],"$8-20/user/month",8)
}};

O["SC.L2-3.13.11"]={dlp:{
purview:T(["Microsoft Purview DLP","Information Protection"],"High","Security Protection Asset",["Configure Purview sensitivity labels for CUI classification","Set up DLP policies for CUI data at rest encryption enforcement","Enable auto-labeling to detect and protect CUI","Configure endpoint DLP for CUI data protection on devices"],["Review DLP policy effectiveness","Verify CUI labeled and protected"],"Included with M365 E5/G5",16),
netskope:T(["Netskope DLP","CASB"],"Moderate","Security Protection Asset",["Deploy Netskope DLP for CUI data protection in cloud apps","Configure CASB policies for CUI access control","Set up real-time DLP scanning for CUI patterns","Enable coaching for users attempting unauthorized CUI sharing"],["Review DLP scan results","Verify CASB policies enforced"],"$10-25/user/month",16)
}};

O["SC.L2-3.13.16"]={dlp:{
purview:T(["Microsoft Purview DLP","Endpoint DLP"],"High","Security Protection Asset",["Configure DLP policies to prevent CUI transmission at rest","Set up endpoint DLP to block unauthorized CUI transfers","Enable sensitivity labels with encryption for CUI at rest","Configure DLP alerts for policy violations"],["Verify DLP blocks unauthorized transfers","Confirm encryption on CUI at rest"],"Included with M365 E5/G5",12)
}};

// SI - System and Information Integrity
O["SI.L2-3.14.1"]={xdr_edr:{
crowdstrike:T(["CrowdStrike Falcon Prevent","Falcon Insight","Falcon OverWatch"],"High","Security Protection Asset",["Deploy Falcon sensor on all CUI endpoints","Configure Falcon Prevent for next-gen AV protection","Enable Falcon Insight for EDR visibility and response","Subscribe to Falcon OverWatch for 24/7 managed threat hunting","Set up automated response policies for critical threats"],["Verify sensor on all CUI endpoints","Confirm OverWatch active"],"$15-25/endpoint/month",16),
huntress:T(["Huntress Managed EDR","Huntress SOC"],"N/A","Security Protection Asset",["Deploy Huntress agents on all CUI endpoints","Enable managed EDR with 24/7 SOC monitoring","Configure automated threat remediation","Set up integration with RMM for response workflows"],["Verify agents on all endpoints","Confirm SOC monitoring active"],"$3-5/endpoint/month",8),
sophos:T(["Sophos Intercept X","Sophos MDR"],"N/A","Security Protection Asset",["Deploy Intercept X on all CUI endpoints","Enable deep learning malware detection","Configure exploit prevention and ransomware protection","Subscribe to Sophos MDR for managed detection and response"],["Verify Intercept X on all endpoints","Confirm MDR active"],"$3-8/endpoint/month",8)
}};

O["SI.L2-3.14.2"]={xdr_edr:{
crowdstrike:T(["Falcon Prevent","Falcon X","Falcon Intelligence"],"High","Security Protection Asset",["Configure Falcon Prevent with latest threat intelligence","Enable Falcon X for automated IOC analysis","Set up Falcon Intelligence for threat feed integration","Configure automated signature and behavioral updates"],["Verify threat intelligence feeds active","Confirm updates deploying"],"$15-25/endpoint/month",8)
}};

O["SI.L2-3.14.4"]={siem:{
splunk:T(["Splunk ES","Splunk UBA"],"High","Security Protection Asset",["Configure ES for security event monitoring and alerting","Enable UBA for behavioral anomaly detection","Set up correlation searches for threat indicators","Configure automated response for critical alerts"],["Verify ES monitoring active","Confirm UBA detecting anomalies"],"$15-50/GB/day",20)
}};

O["SI.L2-3.14.6"]={siem:{
splunk:T(["Splunk ES","Threat Intelligence Management"],"High","Security Protection Asset",["Configure ES with threat intelligence feeds (STIX/TAXII)","Set up automated IOC matching against log data","Enable threat intelligence correlation for alert enrichment","Create dashboards for threat landscape monitoring"],["Verify threat feeds ingesting","Confirm IOC matching active"],"$15-50/GB/day",16)
}};

O["SI.L2-3.14.7"]={ndr:{
darktrace:T(["Darktrace Enterprise","Cyber AI Analyst"],"N/A","Security Protection Asset",["Deploy Darktrace for network traffic anomaly detection","Configure AI models for unauthorized access pattern detection","Enable Cyber AI Analyst for automated investigation","Set up RESPOND for autonomous threat containment"],["Review AI model alerts","Verify RESPOND actions"],"$20,000-100,000/year",16),
vectra:T(["Vectra AI Platform","Detect"],"N/A","Security Protection Asset",["Deploy Vectra for network detection and response","Configure detection models for lateral movement and exfiltration","Enable host and account scoring for threat prioritization","Integrate with SOAR for automated response"],["Review threat scores","Verify detection models active"],"$15,000-80,000/year",16)
}};

// Secure Communications
O["SC.L2-3.13.15"]={secure_comms:{
teams_gcc:T(["Microsoft Teams GCC High","M365 GCC High"],"High","Security Protection Asset",["Deploy Microsoft Teams in GCC High environment for CUI communications","Configure DLP policies for Teams channels handling CUI","Set up information barriers for CUI project isolation","Enable meeting recording with encryption for CUI discussions","Configure external sharing restrictions"],["Verify GCC High tenant active","Confirm DLP policies enforced in Teams"],"Included with M365 GCC High",12),
slack_grid:T(["Slack Enterprise Grid","Slack EKM"],"Moderate","Security Protection Asset",["Deploy Slack Enterprise Grid with Enterprise Key Management","Configure DLP integrations for CUI content detection","Set up workspace isolation for CUI projects","Enable audit logging for all CUI channel activity","Configure retention policies per compliance requirements"],["Verify EKM active","Confirm DLP scanning CUI channels"],"$12-25/user/month",12)
}};

// Now duplicate all Rev2 keys as Rev3 keys (03.XX.YY format)
const rev2ToRev3Map = {
"3.1.1":"03.01.01","3.1.2":"03.01.02","3.1.3":"03.01.03","3.1.4":"03.01.04","3.1.5":"03.01.05",
"3.1.6":"03.01.06","3.1.7":"03.01.07","3.1.8":"03.01.08","3.1.10":"03.01.10","3.1.12":"03.01.12",
"3.1.13":"03.01.13","3.1.16":"03.01.16","3.1.18":"03.01.18","3.1.20":"03.01.20","3.1.22":"03.01.22",
"3.2.1":"03.02.01","3.2.2":"03.02.02",
"3.3.1":"03.03.01","3.3.2":"03.03.02","3.3.3":"03.03.03","3.3.4":"03.03.04","3.3.6":"03.03.06","3.3.7":"03.03.07",
"3.4.1":"03.04.01","3.4.2":"03.04.02","3.4.5":"03.04.05","3.4.6":"03.04.06","3.4.8":"03.04.08",
"3.5.1":"03.05.01","3.5.2":"03.05.02","3.5.3":"03.05.03","3.5.7":"03.05.07","3.5.10":"03.05.10",
"3.6.1":"03.06.01","3.6.2":"03.06.02",
"3.7.5":"03.07.05",
"3.8.1":"03.08.01","3.8.3":"03.08.03","3.8.6":"03.08.06",
"3.9.2":"03.09.02",
"3.10.1":"03.10.01",
"3.11.1":"03.11.01","3.11.2":"03.11.02",
"3.12.1":"03.12.01","3.12.3":"03.12.03",
"3.13.1":"03.13.01","3.13.4":"03.13.04","3.13.8":"03.13.08","3.13.11":"03.13.11","3.13.15":"03.13.15","3.13.16":"03.13.16",
"3.14.1":"03.14.01","3.14.2":"03.14.02","3.14.4":"03.14.04","3.14.6":"03.14.06","3.14.7":"03.14.07"
};

for (const [r2key, entry] of Object.entries(O)) {
  const match = r2key.match(/^([A-Z]{2})\.L(\d)-(.+)$/);
  if (match) {
    const [, fam, lvl, ctrlId] = match;
    if (rev2ToRev3Map[ctrlId]) {
      const r3key = fam + ".L" + lvl + "-" + rev2ToRev3Map[ctrlId];
      if (!O[r3key]) O[r3key] = entry;
    }
  }
}

// Write output
let content = `// Comprehensive Implementation Guidance - Expanded SPA Tool Coverage
// Security Protection Assets (SPAs) - FedRAMP Mod/High and commercial tools
// Supplements existing guidance with IAM/PAM, SIEM, SOAR, DLP, Email Security,
// Security Awareness, MDM/UEM, Backup, GRC, NDR, CSPM, Physical Security, ITSM
// Each tool tagged with fedrampStatus and assetType per CMMC scoping rules
//
// CMMC Scoping:
//   CUI Asset - processes/stores/transmits CUI -> MUST be FedRAMP Mod/High
//   Security Protection Asset (SPA) - provides security functions -> FedRAMP recommended, not required
//   Contractor Risk Managed Asset - not in scope but connected -> per contractor policy

const COMPREHENSIVE_GUIDANCE_SPA = {
    version: "1.0.0",
    lastUpdated: "2026-02-07",
    description: "Expanded SPA tool guidance - FedRAMP + commercial tools across all control families",
    objectives: `;

content += JSON.stringify(O, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');
content += `
};

if (typeof window !== 'undefined') window.COMPREHENSIVE_GUIDANCE_SPA = COMPREHENSIVE_GUIDANCE_SPA;
console.log('[COMPREHENSIVE_GUIDANCE_SPA] Loaded - ' + Object.keys(COMPREHENSIVE_GUIDANCE_SPA.objectives).length + ' control entries');
`;

fs.writeFileSync(out, content, 'utf8');
const stats = fs.statSync(out);
console.log('Written: ' + out);
console.log('Size: ' + (stats.size / 1024).toFixed(1) + ' KB');
console.log('Controls: ' + Object.keys(O).length);
