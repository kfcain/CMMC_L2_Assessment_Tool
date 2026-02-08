// SOC/NOC Platform Implementation Guidance for CMMC Assessment
// Platforms: Splunk ES/SOAR, Sentinel, Google SecOps, Elastic, QRadar, LogRhythm,
//            Sumo Logic, Exabeam, Securonix, Arctic Wolf, Cortex XSOAR, Splunk SOAR
// Version 1.0.0

const COMPREHENSIVE_GUIDANCE_SOC = {
    version: "1.0.0",
    lastUpdated: "2026-02-08",
    objectives: {

        "AU.L2-3.3.1": {
            objective: "Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.",
            siem: {
                splunk_es: {
                    services: ["Splunk Enterprise Security","Splunk Cloud","Heavy/Universal Forwarders","HTTP Event Collector","Splunk ITSI"],
                    implementation: {
                        steps: [
                            "Deploy Splunk Universal Forwarders on all endpoints and servers to collect Windows Security, Sysmon, Linux auditd, and application logs",
                            "Configure Heavy Forwarders at network boundaries for syslog aggregation from firewalls, switches, routers, and IDS/IPS",
                            "Set up HTTP Event Collector (HEC) endpoints for cloud-native log sources (AWS CloudTrail, Azure Activity, GCP Audit)",
                            "Create indexes with retention policies: main (90d hot/warm), security (1yr), compliance (3yr cold/frozen)",
                            "Install Splunk ES Content Update (ESCU) for pre-built correlation searches and detection rules",
                            "Configure CIM data models (Authentication, Change, Endpoint, Network Traffic, Web) for normalized searching",
                            "Implement SmartStore or S3-backed remote storage for cost-effective long-term retention",
                            "Create scheduled searches for audit log completeness — verify all expected sources report within SLA",
                            "Deploy Monitoring Console to track indexing health, forwarder connectivity, and license usage",
                            "Integrate with AWS S3, Azure Blob, or GCS for tiered archival storage beyond hot retention"
                        ],
                        splunk_inputs_conf: "[WinEventLog://Security]\ndisabled = 0\nindex = security\nstart_from = oldest\ncurrent_only = 0\nevt_resolve_ad_obj = 1\ncheckpointInterval = 5\n\n[WinEventLog://Microsoft-Windows-Sysmon/Operational]\ndisabled = 0\nindex = security\nrenderXml = true\n\n[monitor:///var/log/audit/audit.log]\nindex = security\nsourcetype = linux:audit\n\n[monitor:///var/log/secure]\nindex = security\nsourcetype = linux_secure",
                        verification: ["Run: | tstats count WHERE index=security by sourcetype — verify all expected sourcetypes present","Check forwarder health: | rest /services/deployment/server/clients","Validate retention: | eventcount summarize=false index=security — confirm 90+ days","Review ES audit dashboard for gaps in log collection","Test search across all CIM data models to confirm normalization"],
                        cost_estimate: "$15-50/GB/day ingested (volume licensing available)",
                        effort_hours: 40
                    }
                },
                sentinel: {
                    services: ["Microsoft Sentinel","Azure Monitor","Log Analytics Workspace","Azure Arc","Data Connectors"],
                    implementation: {
                        steps: [
                            "Create dedicated Log Analytics Workspace in Azure GCC High for CMMC compliance data",
                            "Enable Microsoft Sentinel on the workspace and configure Sentinel-specific tables",
                            "Deploy Data Connectors: M365 Defender, Entra ID, Azure Activity, Defender for Cloud",
                            "Configure Azure Arc for hybrid/on-prem servers to stream Windows Security Events and Linux Syslog",
                            "Set up Custom Logs (DCR-based) for application-specific audit trails and CUI access logs",
                            "Configure workspace retention: 90 days interactive, 2 years archive via Azure Data Explorer",
                            "Enable Diagnostic Settings on all Azure resources to route audit logs to the Sentinel workspace",
                            "Deploy Azure Monitor Agent (AMA) on all endpoints replacing legacy MMA/OMS agents",
                            "Create Watchlists for CUI asset inventory, privileged users, and critical systems for enrichment",
                            "Set up Workspace Manager for multi-tenant MSSP scenarios with Azure Lighthouse"
                        ],
                        kql_query: "// Verify all expected log sources are reporting\nHeartbeat\n| summarize LastHeartbeat=max(TimeGenerated) by Computer, OSType\n| where LastHeartbeat < ago(15m)\n| project Computer, OSType, LastHeartbeat, TimeSince=now()-LastHeartbeat\n| order by TimeSince desc",
                        verification: ["Run KQL: Heartbeat | summarize by Computer — verify all assets reporting","Check Data Connectors health page for disconnected sources","Validate retention: Usage | where TimeGenerated > ago(90d) | summarize by DataType","Review Sentinel Workbooks > Data Collection Health for ingestion gaps","Test cross-workspace queries for multi-tenant environments"],
                        cost_estimate: "$2.46/GB ingested (commitment tiers: 100GB/day=$196/day)",
                        effort_hours: 32
                    }
                },
                chronicle: {
                    services: ["Google SecOps SIEM","Google SecOps Forwarders","Google SecOps Feeds","YARA-L Detection Engine"],
                    implementation: {
                        steps: [
                            "Deploy Google SecOps SIEM instance with US data residency controls",
                            "Install Google SecOps Forwarders on-premises for syslog, Windows Event, and file-based log collection",
                            "Configure Google SecOps Feeds for cloud ingestion: AWS CloudTrail via S3, Azure via Event Hub, GCP via Pub/Sub",
                            "Set up Google SecOps Ingestion API for custom application logs and CUI access audit trails",
                            "Enable Unified Data Model (UDM) normalization for consistent cross-source querying",
                            "Configure default 12-month hot retention with configurable cold storage for compliance",
                            "Create Reference Lists for CUI assets, privileged accounts, and critical network segments",
                            "Deploy YARA-L rules for CMMC-specific threat detection patterns",
                            "Set up Google SecOps RBAC with data access scoping for multi-tenant MSSP operations",
                            "Integrate VirusTotal Enterprise for automated IOC enrichment on all ingested events"
                        ],
                        verification: ["Verify all log sources in Google SecOps > Ingestion & Health dashboard","Run UDM search across all asset types to confirm normalization","Check data retention by querying events from 90+ days ago","Validate YARA-L rules fire on test data","Review feed status for ingestion failures"],
                        cost_estimate: "$3-12/GB/day (generous retention included)",
                        effort_hours: 36
                    }
                },
                elastic_siem: {
                    services: ["Elastic Security (SIEM)","Elastic Agent","Fleet Server","Elasticsearch","Kibana"],
                    implementation: {
                        steps: [
                            "Deploy Elasticsearch cluster (3+ nodes) with security features enabled (TLS, RBAC, audit logging)",
                            "Set up Fleet Server for centralized Elastic Agent management and policy deployment",
                            "Deploy Elastic Agents with Security integration on all endpoints for event collection",
                            "Configure integrations: Windows, Linux Auditd, AWS CloudTrail, Azure Logs, GCP Audit",
                            "Enable Elastic Common Schema (ECS) field mapping for normalized cross-source correlation",
                            "Set up Index Lifecycle Management (ILM): hot (30d SSD), warm (60d HDD), cold (1yr), frozen (3yr S3/GCS)",
                            "Install prebuilt detection rules from elastic/detection-rules repository",
                            "Configure snapshots to S3/GCS/Azure Blob for backup and disaster recovery",
                            "Set up Kibana Spaces for multi-tenant data isolation in MSSP environments",
                            "Enable Elasticsearch audit logging for compliance evidence of SIEM access"
                        ],
                        verification: ["Check Fleet > Agents page for all enrolled agents and health status","Run: GET _cat/indices?v&s=index to verify all expected indices exist","Validate ILM policies: GET _ilm/policy and check phase transitions","Test detection rules with simulated events","Review Elasticsearch audit logs for unauthorized access attempts"],
                        cost_estimate: "$5-20/GB/day (self-managed) or Elastic Cloud pricing",
                        effort_hours: 40
                    }
                },
                qradar: {
                    services: ["IBM QRadar SIEM","QRadar SOAR","QRadar Network Insights","WinCollect","QRadar Cloud"],
                    implementation: {
                        steps: [
                            "Deploy QRadar Console and Event/Flow Processors sized for expected EPS",
                            "Install WinCollect agents on Windows endpoints for Security Event Log forwarding",
                            "Configure syslog sources for Linux, network devices, firewalls, and IDS/IPS",
                            "Set up DSM (Device Support Modules) for each log source type for proper parsing",
                            "Configure log source extensions for custom application audit logs and CUI access tracking",
                            "Set retention: 90 days online, archive to SAN/NAS for 1-3 year compliance retention",
                            "Deploy QRadar Network Insights for full packet capture and network metadata analysis",
                            "Create custom properties and reference sets for CUI assets and privileged user tracking",
                            "Configure multi-tenancy (domains) for MSSP client isolation",
                            "Set up Pulse dashboards for SOC operational visibility and SLA monitoring"
                        ],
                        verification: ["Check Admin > System & License Management for all managed hosts health","Review Log Sources page for parsing errors or disconnections","Validate retention: run AQL query across 90-day window","Test offense generation with simulated attack patterns","Review QRadar audit log for system access and config changes"],
                        cost_estimate: "$20-60K/year (EPS-based licensing)",
                        effort_hours: 48
                    }
                },
                logrhythm: {
                    services: ["LogRhythm SIEM","LogRhythm NDR","LogRhythm UEBA","System Monitor Agent","Open Collector"],
                    implementation: {
                        steps: [
                            "Deploy LogRhythm Platform Manager (PM), Data Processor (DP), and Data Indexer (DX) components",
                            "Install System Monitor (SysMon) agents on all Windows and Linux endpoints",
                            "Configure Open Collector for cloud log sources: AWS, Azure, GCP, SaaS applications",
                            "Set up Log Source types with Message Processing Engine (MPE) rules for each source",
                            "Configure archiving: 90 days online, 1-3 years archived to external storage",
                            "Enable AI Engine for automated threat detection and behavioral analytics",
                            "Deploy LogRhythm NDR for network traffic analysis and anomaly detection",
                            "Create Entity structures mapping users, hosts, and network segments for CUI environment",
                            "Configure UEBA for insider threat detection on CUI data access patterns",
                            "Set up Web Console dashboards for 24/7 SOC monitoring with shift-based views"
                        ],
                        verification: ["Check Deployment Manager for all agent and collector health","Review System Monitor Dashboard for offline or degraded agents","Validate archiving by restoring data from 90+ days ago","Test AI Engine rules with simulated threat scenarios","Review audit trail for platform access and config changes"],
                        cost_estimate: "$25-75K/year (MPS-based licensing)",
                        effort_hours: 44
                    }
                },
                sumo_logic: {
                    services: ["Sumo Logic Cloud SIEM","CSE","Installed Collectors","Hosted Collectors","Cloud-to-Cloud Sources"],
                    implementation: {
                        steps: [
                            "Provision Sumo Logic Cloud SIEM with FedRAMP Moderate deployment option",
                            "Deploy Installed Collectors on on-prem servers for local log file and Windows Event collection",
                            "Configure Hosted Collectors with HTTP Sources for cloud-native and API-based log ingestion",
                            "Set up Cloud-to-Cloud integrations for AWS CloudTrail, Entra ID, GCP Audit, M365",
                            "Configure Field Extraction Rules (FERs) and parsing logic for custom log formats",
                            "Set retention tiers: 90d Continuous (searchable), 1yr Frequent, 3yr Infrequent",
                            "Enable Cloud SIEM Enterprise (CSE) for automated signal correlation and insight generation",
                            "Create Partitions for CUI-related data to optimize search performance and access control",
                            "Configure RBAC with role-based data access for multi-tenant MSSP operations",
                            "Set up dashboards and scheduled searches for SOC operational metrics"
                        ],
                        verification: ["Check Collection > Status page for all collector and source health","Run log search across 90-day window to validate retention","Verify CSE insights are generating from correlated signals","Test partition-based access controls for data isolation","Review Sumo Logic audit index for platform access logs"],
                        cost_estimate: "$3-10/GB/day (credit-based model)",
                        effort_hours: 30
                    }
                },
                exabeam: {
                    services: ["Exabeam New-Scale SIEM","Advanced Analytics","Exabeam SOAR","Cloud Connectors"],
                    implementation: {
                        steps: [
                            "Deploy Exabeam New-Scale SIEM (cloud-native) or Security Operations Platform",
                            "Configure log collectors for on-prem sources via syslog and file-based collection",
                            "Set up Cloud Connectors for AWS CloudTrail, Entra ID, GCP, M365, and SaaS apps",
                            "Enable Advanced Analytics for UEBA-driven threat detection and user risk scoring",
                            "Configure Smart Timelines for automated investigation context assembly",
                            "Set retention: 90 days hot search, 1 year warm, extended cold for compliance",
                            "Create Context Tables for CUI assets, privileged users, and network segment classification",
                            "Deploy Exabeam SOAR playbooks for automated incident response workflows",
                            "Configure multi-tenant workspaces for MSSP client data isolation",
                            "Set up dashboards for SOC shift handoff and operational KPIs"
                        ],
                        verification: ["Review Data Pipeline health for all configured log sources","Validate UEBA risk scores calculating for all monitored users","Check Smart Timeline generation for recent security events","Test SOAR playbook execution with simulated incidents","Review platform audit logs for access and config changes"],
                        cost_estimate: "$30-80K/year (user-based licensing)",
                        effort_hours: 36
                    }
                },
                arctic_wolf: {
                    services: ["Arctic Wolf MDR","Managed Risk","Log Retention","Concierge Security Team"],
                    implementation: {
                        steps: [
                            "Engage Arctic Wolf MDR and deploy Arctic Wolf Agent on all endpoints",
                            "Configure Arctic Wolf Sensor for network traffic analysis at key network boundaries",
                            "Set up cloud log integrations: AWS CloudTrail, Entra ID/Sentinel, GCP, M365, Okta",
                            "Configure Log Retention for CMMC-compliant 1-year+ log storage",
                            "Work with Concierge Security Team (CST) to define CUI scope and alerting priorities",
                            "Set up Managed Risk for continuous vulnerability scanning and hardening guidance",
                            "Configure escalation procedures and notification channels (email, SMS, PagerDuty, ServiceNow)",
                            "Define SLAs: 15-min critical alert response, 1-hour investigation, 4-hour remediation guidance",
                            "Set up monthly security posture reviews with CST aligned to CMMC control families",
                            "Configure Arctic Wolf portal access for internal team with appropriate RBAC"
                        ],
                        verification: ["Verify Agent deployment coverage matches CUI asset inventory","Check portal for sensor health and log source connectivity","Validate alert response times against defined SLAs","Review monthly security posture report for CMMC alignment","Test escalation procedures with simulated critical alert"],
                        cost_estimate: "$15-30/endpoint/month (MDR bundled)",
                        effort_hours: 16
                    }
                }
            },
            soar: {
                cortex_xsoar: {
                    services: ["Palo Alto Cortex XSOAR","XSOAR Marketplace","War Rooms","Threat Intel Management"],
                    implementation: {
                        steps: [
                            "Deploy Cortex XSOAR server or activate XSOAR cloud instance",
                            "Install integration packs from Marketplace for all SOC tools (SIEM, EDR, firewall, ticketing)",
                            "Create audit log collection playbook: auto-verify all expected log sources report within SLA",
                            "Build log gap detection playbook: alert SOC when any critical source stops reporting for >15 min",
                            "Configure War Rooms for collaborative incident investigation with full audit trail",
                            "Set up Threat Intel Management (TIM) for IOC lifecycle management and enrichment",
                            "Create automated evidence collection playbook for CMMC assessment artifact gathering",
                            "Deploy multi-tenant architecture for MSSP operations with tenant-level playbooks",
                            "Configure XSOAR audit logging for all playbook executions and analyst actions",
                            "Build SOC shift handoff playbook summarizing open incidents, pending actions, SLA status"
                        ],
                        verification: ["Test log gap detection by temporarily stopping a log source","Verify War Room audit trails capture all analyst actions","Run evidence collection playbook and validate output","Check XSOAR audit log for all playbook executions","Test shift handoff playbook generates accurate summary"],
                        cost_estimate: "$40-100K/year",
                        effort_hours: 32
                    }
                },
                splunk_soar: {
                    services: ["Splunk SOAR (Phantom)","SOAR Apps","Visual Playbook Editor","Case Management"],
                    implementation: {
                        steps: [
                            "Deploy Splunk SOAR (included with ES Premium or standalone)",
                            "Install SOAR Apps for all integrated platforms: Splunk ES, EDR, firewall, cloud, ticketing",
                            "Create log source monitoring playbook: query Splunk for source completeness every 15 min",
                            "Build automated log retention verification playbook for required retention periods",
                            "Configure Case Management for SOC incident tracking with CMMC-aligned severity",
                            "Create visual playbooks for common SOC workflows: triage, enrichment, containment, escalation",
                            "Set up SOAR audit logging for all playbook runs, analyst actions, and case modifications",
                            "Configure bidirectional Splunk ES integration for notable event management",
                            "Build compliance reporting playbook generating CMMC audit evidence packages",
                            "Deploy multi-tenancy for MSSP operations with tenant-scoped playbooks and assets"
                        ],
                        verification: ["Test log monitoring playbook detects missing sources within SLA","Verify retention playbook confirms data availability","Review SOAR audit log for completeness of action tracking","Test end-to-end: alert > triage > containment > case closure","Validate compliance reporting output against CMMC requirements"],
                        cost_estimate: "Included with ES Premium or $30-60K/year standalone",
                        effort_hours: 28
                    }
                }
            }
        },

        "AU.L2-3.3.2": {
            objective: "Ensure that the actions of individual system users can be uniquely traced to those users so they can be held accountable for their actions.",
            siem: {
                splunk_es: {
                    services: ["Splunk ES","Identity Management","Asset & Identity Framework","User Activity Monitoring"],
                    implementation: {
                        steps: [
                            "Configure Splunk ES Asset & Identity Framework with authoritative identity sources (AD, Okta, Entra ID)",
                            "Set up identity correlation: map usernames, email, employee IDs, service accounts to single identities",
                            "Create identity lookup tables from HR systems for user attribution and accountability",
                            "Enable Windows Security Event collection (4624/4625/4648/4672) for logon tracking with user context",
                            "Configure ES Access Center dashboard for user activity monitoring across all data sources",
                            "Build correlation searches for shared account usage detection and service account abuse",
                            "Create user activity timeline searches aggregating all actions by normalized user identity",
                            "Set up Notable Events for impossible travel, concurrent sessions, and privilege escalation",
                            "Configure Splunk UBA (User Behavior Analytics) for anomalous user activity detection",
                            "Build compliance reports showing per-user audit trails for CUI system access"
                        ],
                        spl_query: "| tstats summariesonly=t count from datamodel=Authentication by _time, Authentication.user, Authentication.src, Authentication.dest, Authentication.action span=1h\n| rename Authentication.* as *\n| eval activity_type=\"authentication\"\n| append [| tstats summariesonly=t count from datamodel=Change by _time, All_Changes.user, All_Changes.object, All_Changes.action span=1h | rename All_Changes.* as * | eval activity_type=\"change\"]\n| sort _time\n| stats values(activity_type) as activities, dc(dest) as unique_systems, count as total_events by user",
                        verification: ["Verify identity correlation resolves all usernames to unique individuals","Test user timeline search returns complete activity for a known test user","Validate shared account detection alerts fire correctly","Review Access Center dashboard for completeness across all log sources","Run compliance report and verify per-user audit trail accuracy"],
                        cost_estimate: "Included with Splunk ES",
                        effort_hours: 24
                    }
                },
                sentinel: {
                    services: ["Microsoft Sentinel","Entra ID","UEBA","Entity Behavior Analytics"],
                    implementation: {
                        steps: [
                            "Enable Sentinel UEBA for automated user activity profiling",
                            "Configure Entra ID as primary identity source with all sign-in and audit logs streaming to Sentinel",
                            "Set up IdentityInfo table synchronization for user metadata enrichment (department, manager, title)",
                            "Create Analytics Rules for shared account detection, concurrent sessions, impossible travel",
                            "Configure Entity Pages for users showing aggregated activity timeline across all data sources",
                            "Build KQL queries for per-user audit trails combining SigninLogs, AuditLogs, SecurityEvent",
                            "Set up Watchlists for privileged users and CUI system administrators for enhanced monitoring",
                            "Enable Sentinel Notebooks for advanced user investigation and forensic timeline analysis",
                            "Configure UEBA anomaly detection thresholds for CUI environment user behavior baselines",
                            "Create Workbooks for user accountability reporting aligned with CMMC audit requirements"
                        ],
                        kql_query: "let targetUser = \"user@contoso.com\";\nunion SigninLogs, AADNonInteractiveUserSignInLogs\n| where UserPrincipalName =~ targetUser\n| project TimeGenerated, Activity=\"SignIn\", Detail=AppDisplayName, Result=ResultType, IPAddress\n| union (\n    SecurityEvent | where Account contains targetUser\n    | project TimeGenerated, Activity=\"SecurityEvent\", Detail=Activity, Result=tostring(EventID), IPAddress=IpAddress\n)\n| sort by TimeGenerated desc",
                        verification: ["Verify UEBA is profiling all active users in the CUI environment","Test Entity Page shows complete activity timeline for a test user","Validate impossible travel detection with simulated concurrent logins","Review user accountability Workbook for completeness","Check IdentityInfo table has current HR data for all users"],
                        cost_estimate: "Included with Sentinel (UEBA add-on)",
                        effort_hours: 20
                    }
                },
                chronicle: {
                    services: ["Google SecOps SIEM","Google SecOps UEBA","Entity Analytics","Reference Lists"],
                    implementation: {
                        steps: [
                            "Configure Google SecOps identity enrichment with AD, Okta, and cloud IdP log sources",
                            "Set up Entity Analytics for automated user behavior profiling and risk scoring",
                            "Create Reference Lists for privileged users, service accounts, CUI system administrators",
                            "Build YARA-L detection rules for shared account usage and concurrent session anomalies",
                            "Configure UDM search for per-user activity timelines across all normalized events",
                            "Set up Dashboards for user accountability and activity monitoring",
                            "Create automated reports for user audit trails exportable for CMMC assessment evidence",
                            "Configure alert rules for impossible travel and anomalous authentication patterns",
                            "Set up Google SecOps RBAC to ensure analyst access is logged and attributable",
                            "Integrate with HR systems for user lifecycle tracking (onboarding, role changes, offboarding)"
                        ],
                        verification: ["Verify all user identities resolve correctly in Google SecOps Entity view","Test UDM search returns complete activity for known test users","Validate shared account detection rules fire on test scenarios","Review user audit trail reports for completeness and accuracy","Check Entity Analytics risk scores reflect actual user behavior"],
                        cost_estimate: "Included with Google SecOps SIEM",
                        effort_hours: 22
                    }
                }
            }
        },

        "AU.L2-3.3.4": {
            objective: "Alert in the event of an audit logging process failure.",
            siem: {
                splunk_es: {
                    services: ["Splunk ES","Monitoring Console","Deployment Server","Forwarder Management"],
                    implementation: {
                        steps: [
                            "Configure Monitoring Console to track all forwarder connectivity and indexing health",
                            "Create scheduled search: detect forwarders that stop reporting within 15-min SLA window",
                            "Build alert for index storage capacity thresholds (warn at 80%, critical at 90%)",
                            "Set up Deployment Server health monitoring for agent configuration drift detection",
                            "Create correlation search for HEC endpoint failures and HTTP 503 responses",
                            "Configure Splunk-to-Splunk forwarding health checks for distributed architectures",
                            "Build dashboard showing real-time log source health with red/yellow/green indicators",
                            "Set up PagerDuty/ServiceNow integration for critical logging failure alerts to on-call SOC",
                            "Create weekly compliance report showing logging uptime percentage per source",
                            "Configure ITSI service health monitoring for end-to-end log pipeline visibility"
                        ],
                        spl_query: "| tstats latest(_time) as last_seen where index=_internal by host\n| eval minutes_since_last = round((now() - last_seen) / 60, 1)\n| where minutes_since_last > 15\n| eval severity = case(minutes_since_last > 60, \"critical\", minutes_since_last > 30, \"high\", minutes_since_last > 15, \"medium\", true(), \"low\")\n| table host, last_seen, minutes_since_last, severity\n| sort -minutes_since_last",
                        verification: ["Test: stop a forwarder and verify alert fires within 15 minutes","Simulate disk space exhaustion and verify capacity alert triggers","Validate PagerDuty/ServiceNow integration delivers alerts to on-call","Review weekly compliance report for logging uptime accuracy","Check Monitoring Console for any undetected forwarder issues"],
                        cost_estimate: "Included with Splunk",
                        effort_hours: 16
                    }
                },
                sentinel: {
                    services: ["Microsoft Sentinel","Azure Monitor Alerts","Data Connector Health","Workbooks"],
                    implementation: {
                        steps: [
                            "Enable Sentinel Data Connector Health monitoring workbook for all active connectors",
                            "Create Analytics Rule: alert when any data connector stops ingesting for >15 minutes",
                            "Configure Azure Monitor Alerts for Log Analytics workspace ingestion anomalies",
                            "Set up Heartbeat-based monitoring for all Azure Monitor Agent (AMA) deployments",
                            "Create KQL-based alert for unexpected drops in event volume by source type",
                            "Configure Action Groups for critical alerts: email, SMS, PagerDuty, ServiceNow webhook",
                            "Build Sentinel Workbook showing real-time data connector health with SLA tracking",
                            "Set up Azure Service Health alerts for Log Analytics and Sentinel service degradation",
                            "Create automation rule to auto-create incident when logging failure detected",
                            "Configure weekly diagnostic report on logging pipeline health and uptime metrics"
                        ],
                        kql_query: "let expectedSources = dynamic([\"SecurityEvent\",\"Syslog\",\"SigninLogs\",\"AuditLogs\",\"CommonSecurityLog\"]);\nunion withsource=TableName *\n| where TimeGenerated > ago(1h)\n| summarize LastEvent=max(TimeGenerated), EventCount=count() by TableName\n| where TableName in (expectedSources)\n| extend MinutesSinceLastEvent = datetime_diff('minute', now(), LastEvent)\n| where MinutesSinceLastEvent > 15\n| project TableName, LastEvent, MinutesSinceLastEvent, EventCount",
                        verification: ["Test: disable a data connector and verify alert fires within SLA","Validate Action Group delivers notifications to all configured channels","Review Data Connector Health workbook for undetected gaps","Check Azure Monitor Alerts history for false positives","Verify automation rule creates incidents for logging failures"],
                        cost_estimate: "Included with Sentinel",
                        effort_hours: 12
                    }
                },
                elastic_siem: {
                    services: ["Elastic Security","Fleet Server","Elasticsearch Monitoring","Watcher"],
                    implementation: {
                        steps: [
                            "Configure Fleet Server health monitoring for all enrolled Elastic Agents",
                            "Set up Elasticsearch Watcher alerts for agent check-in failures exceeding 15-minute threshold",
                            "Create Kibana dashboard showing real-time agent health, enrollment status, and policy compliance",
                            "Configure index monitoring alerts for ingestion rate drops or indexing failures",
                            "Set up cluster health monitoring: disk watermarks, shard allocation, node availability",
                            "Create Watcher alert for ILM policy failures that could impact data retention compliance",
                            "Configure PagerDuty/ServiceNow integration for critical infrastructure alerts",
                            "Build Elastic Observability dashboard for end-to-end log pipeline health visibility",
                            "Set up snapshot monitoring to verify backup integrity for disaster recovery",
                            "Create weekly compliance report on logging uptime and agent coverage metrics"
                        ],
                        verification: ["Test: unenroll an agent and verify alert fires within threshold","Simulate disk pressure and verify watermark alerts trigger","Validate PagerDuty integration delivers critical alerts","Review weekly compliance report for accuracy","Check ILM policy execution for any stuck or failed transitions"],
                        cost_estimate: "Included with Elastic subscription",
                        effort_hours: 14
                    }
                },
                qradar: {
                    services: ["IBM QRadar","System Notifications","Health Metrics","Log Source Management"],
                    implementation: {
                        steps: [
                            "Configure QRadar System Notifications for log source disconnection alerts",
                            "Set up health metric thresholds for EPS capacity, disk usage, and processing latency",
                            "Create custom rules to detect log sources that stop reporting within defined SLA",
                            "Configure email/SNMP/webhook notifications for critical system health events",
                            "Build QRadar Pulse dashboard for real-time log source health visualization",
                            "Set up QRadar Health Metrics app for historical trending and capacity planning",
                            "Create offense rules for audit logging infrastructure failures",
                            "Configure automated log source testing to verify parsing and normalization",
                            "Set up weekly compliance report on log source uptime and coverage",
                            "Integrate with ServiceNow/PagerDuty for on-call SOC alerting"
                        ],
                        verification: ["Test: disconnect a log source and verify notification fires","Validate health metric thresholds trigger at correct levels","Review Pulse dashboard for accurate real-time status","Check offense rules generate for infrastructure failures","Verify weekly report captures all log source health data"],
                        cost_estimate: "Included with QRadar",
                        effort_hours: 14
                    }
                }
            }
        },

        "AU.L2-3.3.5": {
            objective: "Correlate audit record review, analysis, and reporting processes to support organizational processes for investigation and response to suspicious activities.",
            siem: {
                splunk_es: {
                    services: ["Splunk ES","Correlation Searches","Risk-Based Alerting","Investigation Workbench"],
                    implementation: {
                        steps: [
                            "Enable Splunk ES Risk-Based Alerting (RBA) framework for multi-signal threat correlation",
                            "Configure risk factors for auth failures, privilege escalation, data access anomalies, network anomalies",
                            "Create risk rules assigning scores to users and assets based on correlated events across data models",
                            "Set up Risk Notables that trigger only when cumulative risk exceeds threshold (reducing alert fatigue)",
                            "Configure ES Investigation Workbench for analyst-driven correlation and timeline analysis",
                            "Build correlation searches spanning Authentication, Change, Endpoint, Network Traffic, Web data models",
                            "Create adaptive response actions: auto-enrich with threat intel, geo-lookup, asset/identity context",
                            "Set up Incident Review dashboard with CMMC-aligned severity classifications",
                            "Configure automated report generation for weekly/monthly audit review summaries",
                            "Build SOC analyst workflow: triage > investigate > correlate > respond > document > close"
                        ],
                        verification: ["Test RBA: simulate multi-stage attack and verify risk accumulation triggers Notable","Validate correlation searches fire across multiple data models","Review Investigation Workbench for complete timeline assembly","Check automated reports contain all required CMMC audit evidence","Test analyst workflow end-to-end with simulated incident"],
                        cost_estimate: "Included with Splunk ES",
                        effort_hours: 28
                    }
                },
                sentinel: {
                    services: ["Microsoft Sentinel","Fusion ML","Analytics Rules","Incidents","Hunting Queries"],
                    implementation: {
                        steps: [
                            "Enable Sentinel Fusion ML detection for automated multi-stage attack correlation",
                            "Configure Analytics Rules with entity mapping for cross-source event correlation",
                            "Set up Incident grouping to automatically correlate related alerts into unified incidents",
                            "Create Hunting Queries for proactive threat hunting across all ingested data sources",
                            "Configure Sentinel Notebooks (Jupyter) for advanced investigation and data analysis",
                            "Build Automation Rules for incident enrichment: auto-add entity details, threat intel, geo context",
                            "Set up Workbooks for weekly audit review and trend analysis reporting",
                            "Configure MITRE ATT&CK mapping for all Analytics Rules to track technique coverage",
                            "Create custom Analytics Rules for CMMC-specific correlation scenarios",
                            "Set up SOC analyst workflow with Incident tasks, comments, and evidence attachment"
                        ],
                        verification: ["Test Fusion detection with simulated multi-stage attack pattern","Validate incident grouping correlates related alerts correctly","Review Hunting Query results for false positive rates","Check MITRE ATT&CK coverage map for detection gaps","Test automation rules enrich incidents with correct context"],
                        cost_estimate: "Included with Sentinel",
                        effort_hours: 24
                    }
                },
                chronicle: {
                    services: ["Google SecOps SIEM","Detection Engine","YARA-L","Investigation Views"],
                    implementation: {
                        steps: [
                            "Configure Google SecOps Detection Engine with YARA-L rules for multi-source event correlation",
                            "Create detection rules spanning authentication, network, endpoint, and cloud data sources",
                            "Set up Google SecOps Investigation Views for analyst-driven timeline analysis and entity pivoting",
                            "Configure alert severity and priority based on correlated signal strength and asset criticality",
                            "Build Google SecOps Dashboards for SOC operational metrics and correlation effectiveness",
                            "Create YARA-L rules for CMMC-specific threat scenarios: CUI exfiltration, unauthorized access patterns",
                            "Set up automated enrichment with VirusTotal, MISP, and commercial threat intel feeds",
                            "Configure Google SecOps Cases for incident tracking with evidence attachment and analyst notes",
                            "Build scheduled reports for weekly audit review and trend analysis",
                            "Set up SOC analyst workflow with investigation playbooks and escalation procedures"
                        ],
                        verification: ["Test YARA-L correlation rules with simulated multi-source attack","Validate Investigation Views assemble complete timelines","Review detection rule coverage against MITRE ATT&CK","Check automated enrichment adds correct context to alerts","Test SOC workflow end-to-end with simulated incident"],
                        cost_estimate: "Included with Google SecOps SIEM",
                        effort_hours: 26
                    }
                }
            }
        },

        "IR.L2-3.6.1": {
            objective: "Establish an operational incident-handling capability for organizational systems that includes preparation, detection, analysis, containment, recovery, and user response activities.",
            siem: {
                splunk_es: {
                    services: ["Splunk ES","Splunk SOAR","Mission Control","Threat Intelligence Framework"],
                    implementation: {
                        steps: [
                            "Configure Splunk ES as primary SOC detection platform with all CUI environment data sources ingested",
                            "Deploy Splunk SOAR for automated incident response playbooks covering the full incident lifecycle",
                            "Set up Mission Control for unified SOC analyst experience combining ES and SOAR",
                            "Create detection content for each MITRE ATT&CK tactic relevant to CUI environments",
                            "Build SOAR playbooks for each incident type: malware, phishing, unauthorized access, data exfiltration, insider threat",
                            "Configure automated containment: disable user accounts, isolate endpoints, block IPs, quarantine files",
                            "Set up incident severity classification aligned with CMMC: Critical (CUI breach), High, Medium, Low",
                            "Create SOC runbooks documenting procedures for each incident type with escalation paths",
                            "Configure Threat Intelligence Framework with commercial and open-source feeds for IOC matching",
                            "Build post-incident review workflow: lessons learned, detection improvement, playbook updates"
                        ],
                        verification: ["Run tabletop exercise covering each incident type with SOC team","Test automated containment actions in isolated test environment","Validate SOAR playbooks execute correctly for each incident type","Review detection coverage against MITRE ATT&CK framework","Test escalation procedures reach correct personnel within SLA"],
                        cost_estimate: "$50-150K/year (ES + SOAR bundle)",
                        effort_hours: 60
                    }
                },
                sentinel: {
                    services: ["Microsoft Sentinel","Defender XDR","Logic Apps","Automation Rules","Playbooks"],
                    implementation: {
                        steps: [
                            "Configure Sentinel as primary SIEM with Defender XDR integration for unified incident management",
                            "Deploy Logic Apps-based Playbooks for automated incident response across the full lifecycle",
                            "Create Analytics Rules covering detection and analysis phases for CUI-relevant threats",
                            "Configure Automation Rules for auto-triage: assign severity, owner, and initial enrichment",
                            "Build containment playbooks: disable Entra ID accounts, isolate Defender-managed endpoints, block IPs in NSG",
                            "Set up recovery playbooks: re-enable accounts after verification, restore from backup, update security controls",
                            "Configure Sentinel Incidents with Tasks for structured analyst workflow and accountability",
                            "Create Workbooks for incident metrics: MTTD, MTTR, incident volume, SLA compliance",
                            "Set up Microsoft Teams integration for real-time SOC communication during active incidents",
                            "Build post-incident Playbook that generates incident report and updates detection rules"
                        ],
                        verification: ["Run purple team exercise testing detection and response for each incident type","Test containment playbooks in staging environment","Validate incident metrics Workbook accuracy","Review Automation Rules for correct triage assignments","Test Teams integration delivers real-time notifications"],
                        cost_estimate: "$2.46/GB + Logic Apps consumption",
                        effort_hours: 48
                    }
                },
                chronicle: {
                    services: ["Google SecOps SIEM","Google SecOps SOAR","Detection Engine","Case Management"],
                    implementation: {
                        steps: [
                            "Configure Google SecOps SIEM as primary detection platform with all CUI data sources",
                            "Deploy Google SecOps SOAR for automated incident response playbooks and case management",
                            "Create YARA-L detection rules for each incident type relevant to CUI environments",
                            "Build SOAR playbooks for incident lifecycle: detection, triage, analysis, containment, recovery",
                            "Configure automated containment actions via SOAR integrations with EDR, firewall, IdP",
                            "Set up Google SecOps Cases for structured incident tracking with evidence and timeline",
                            "Create incident classification aligned with CMMC severity levels",
                            "Configure escalation procedures and notification channels for 24/7 SOC operations",
                            "Build post-incident review workflow with detection rule updates and playbook improvements",
                            "Set up SOC operational dashboards for incident metrics and SLA tracking"
                        ],
                        verification: ["Run tabletop exercise for each incident type","Test SOAR containment playbooks in staging","Validate Google SecOps Cases track full incident lifecycle","Review detection rule coverage against MITRE ATT&CK","Test escalation procedures reach correct personnel"],
                        cost_estimate: "$3-12/GB/day + Google SecOps SOAR licensing",
                        effort_hours: 52
                    }
                },
                elastic_siem: {
                    services: ["Elastic Security","Elastic Agent Response Actions","Detection Rules","Case Management"],
                    implementation: {
                        steps: [
                            "Configure Elastic Security as primary SIEM with all CUI environment data sources",
                            "Enable Elastic Agent response actions for automated endpoint isolation and process termination",
                            "Install prebuilt detection rules covering MITRE ATT&CK tactics relevant to CUI",
                            "Set up Elastic Security Cases for incident tracking with timeline and evidence attachment",
                            "Configure automated response actions: isolate host, kill process, block IP via integration",
                            "Build investigation guides for each detection rule with analyst procedures",
                            "Set up Kibana alerting with PagerDuty/ServiceNow/email for SOC notification",
                            "Create Elastic Security dashboards for incident metrics and SOC operational KPIs",
                            "Configure Elastic Agent osquery integration for live forensic data collection during incidents",
                            "Build post-incident workflow: update detection rules, document lessons learned, archive evidence"
                        ],
                        verification: ["Test endpoint isolation via Elastic Agent response actions","Validate detection rules fire for simulated attack scenarios","Review Cases workflow for complete incident lifecycle tracking","Test alerting integrations deliver to all configured channels","Verify osquery forensic collection works during investigation"],
                        cost_estimate: "$5-20/GB/day + Elastic subscription",
                        effort_hours: 44
                    }
                },
                qradar: {
                    services: ["IBM QRadar SIEM","QRadar SOAR (Resilient)","Offense Management","Threat Intelligence"],
                    implementation: {
                        steps: [
                            "Configure QRadar SIEM as primary detection platform with all CUI data sources",
                            "Deploy QRadar SOAR (formerly Resilient) for automated incident response playbooks",
                            "Create custom rules and building blocks for CUI-relevant threat detection",
                            "Configure QRadar Offense management with CMMC-aligned severity classifications",
                            "Build SOAR playbooks for each incident type with automated containment actions",
                            "Set up QRadar-to-SOAR integration for automatic offense-to-incident escalation",
                            "Configure Threat Intelligence feeds for IOC matching against network and endpoint events",
                            "Create SOC runbooks with QRadar investigation procedures and escalation paths",
                            "Set up QRadar Pulse dashboards for real-time SOC monitoring and incident metrics",
                            "Build post-incident workflow: update rules, document findings, archive evidence in SOAR"
                        ],
                        verification: ["Run tabletop exercise using QRadar offense scenarios","Test SOAR playbook containment actions in staging","Validate offense-to-SOAR escalation works correctly","Review detection rule coverage against MITRE ATT&CK","Test escalation procedures and notification delivery"],
                        cost_estimate: "$20-60K/year SIEM + $30-80K/year SOAR",
                        effort_hours: 56
                    }
                },
                arctic_wolf: {
                    services: ["Arctic Wolf MDR","Incident Response","Concierge Security Team","Security Operations Cloud"],
                    implementation: {
                        steps: [
                            "Engage Arctic Wolf MDR for 24/7 incident detection and response coverage",
                            "Define incident response procedures and escalation paths with Concierge Security Team",
                            "Configure alert severity levels and response SLAs aligned with CMMC requirements",
                            "Set up automated containment capabilities: endpoint isolation, account disable, IP blocking",
                            "Define communication channels for incident notification: email, SMS, phone, Teams/Slack",
                            "Configure Arctic Wolf portal for internal team incident visibility and collaboration",
                            "Set up monthly incident review meetings with CST for trend analysis and improvement",
                            "Define DFARS 7012 reporting procedures with Arctic Wolf support for 72-hour timeline",
                            "Configure evidence preservation procedures for forensic investigation support",
                            "Build internal incident response plan referencing Arctic Wolf MDR capabilities"
                        ],
                        verification: ["Test incident response SLAs with simulated critical alert","Validate containment actions execute within defined timeframes","Review monthly incident reports for completeness","Test DFARS 7012 reporting workflow end-to-end","Verify communication channels deliver notifications correctly"],
                        cost_estimate: "$15-30/endpoint/month (MDR bundled)",
                        effort_hours: 20
                    }
                }
            },
            soar: {
                cortex_xsoar: {
                    services: ["Cortex XSOAR","Incident Lifecycle Management","War Rooms","Playbook Marketplace"],
                    implementation: {
                        steps: [
                            "Deploy XSOAR as central incident management platform integrated with all SOC tools",
                            "Install incident lifecycle playbooks from Marketplace covering all NIST IR phases",
                            "Configure incident types: CUI Data Breach, Unauthorized Access, Malware, Phishing, Insider Threat",
                            "Build preparation phase: automated asset inventory sync, contact list updates, communication templates",
                            "Create detection phase playbooks: SIEM alert ingestion, deduplication, enrichment, severity assignment",
                            "Build analysis phase: automated IOC extraction, threat intel lookup, affected asset identification",
                            "Configure containment playbooks: endpoint isolation via EDR, account disable via IdP, IP block via firewall",
                            "Create recovery playbooks: system restoration verification, account re-enablement, monitoring enhancement",
                            "Set up War Rooms for collaborative real-time incident investigation with full audit trail",
                            "Build post-incident playbook: generate report, update detection rules, conduct lessons learned"
                        ],
                        verification: ["Execute full incident lifecycle drill for each incident type","Test containment actions execute within defined SLA windows","Validate War Room audit trails capture all analyst actions","Review post-incident reports for completeness","Test playbook error handling for failed containment actions"],
                        cost_estimate: "$40-100K/year",
                        effort_hours: 48
                    }
                },
                splunk_soar: {
                    services: ["Splunk SOAR","Visual Playbook Editor","Case Management","Adaptive Response"],
                    implementation: {
                        steps: [
                            "Deploy Splunk SOAR integrated with Splunk ES for unified detection and response",
                            "Create visual playbooks for each incident type covering full NIST IR lifecycle",
                            "Configure Case Management with CMMC-aligned severity and priority classifications",
                            "Build automated containment playbooks: isolate endpoint, disable account, block IP, quarantine email",
                            "Set up Adaptive Response actions in ES that trigger SOAR playbooks automatically",
                            "Configure SOAR audit logging for all playbook executions and analyst actions",
                            "Build evidence collection playbooks for forensic data preservation",
                            "Create recovery verification playbooks: confirm containment, validate restoration, update monitoring",
                            "Set up SOAR dashboards for incident metrics: MTTD, MTTR, playbook success rates",
                            "Build post-incident playbook: generate report, update ES correlation searches, archive case"
                        ],
                        verification: ["Test each incident type playbook end-to-end","Validate containment actions execute correctly in staging","Review SOAR audit logs for complete action tracking","Test Adaptive Response triggers SOAR playbooks from ES","Verify incident metrics dashboard accuracy"],
                        cost_estimate: "Included with ES Premium or $30-60K/year standalone",
                        effort_hours: 40
                    }
                }
            }
        },

        "IR.L2-3.6.2": {
            objective: "Track, document, and report incidents to designated officials and/or authorities both internal and external to the organization.",
            siem: {
                splunk_es: {
                    services: ["Splunk ES Incident Review","Splunk SOAR Case Management","Splunk ITSI"],
                    implementation: {
                        steps: [
                            "Configure Splunk ES Incident Review as primary incident tracking dashboard with custom status workflow",
                            "Set up SOAR Case Management for detailed incident documentation with evidence attachment",
                            "Create incident classification taxonomy aligned with CMMC and DFARS 7012 reporting requirements",
                            "Build automated notification playbook: email/SMS to designated officials within 1 hour of detection",
                            "Configure DFARS 7012 72-hour reporting workflow with automated timeline and evidence packaging",
                            "Set up incident metrics tracking: MTTD, MTTR, incidents by type/severity/source, SLA compliance",
                            "Create executive incident summary reports with trend analysis and risk assessment",
                            "Build evidence chain-of-custody tracking within SOAR case management",
                            "Configure integration with external reporting systems (DIBNet, CISA) for mandatory reporting",
                            "Set up quarterly incident review reports for CMMC assessment evidence"
                        ],
                        verification: ["Test notification playbook delivers alerts to all designated officials within SLA","Validate DFARS 7012 reporting workflow generates compliant report package","Review incident metrics dashboard for accuracy","Test evidence chain-of-custody tracking maintains integrity","Verify quarterly reports contain all required CMMC evidence"],
                        cost_estimate: "Included with Splunk ES + SOAR",
                        effort_hours: 20
                    }
                },
                sentinel: {
                    services: ["Sentinel Incidents","Logic Apps","Power Automate","ServiceNow Integration"],
                    implementation: {
                        steps: [
                            "Configure Sentinel Incidents with custom status workflow: New > Active > Investigating > Contained > Resolved > Closed",
                            "Set up Logic Apps playbook for automated incident notification to designated officials",
                            "Create DFARS 7012 reporting automation: 72-hour countdown timer with escalation at 24h and 48h",
                            "Configure ServiceNow/Jira integration for incident ticket creation and tracking",
                            "Build Power Automate flows for executive incident summary generation and distribution",
                            "Set up Sentinel Workbook for incident metrics: volume, MTTD, MTTR, SLA compliance trends",
                            "Create incident report template with CMMC-aligned fields and evidence attachment",
                            "Configure Sentinel Comments and Tasks for incident documentation and accountability",
                            "Build automated evidence packaging playbook for assessment and reporting",
                            "Set up quarterly compliance reporting with incident trend analysis"
                        ],
                        verification: ["Test notification Logic App delivers to all designated officials within SLA","Validate DFARS 7012 countdown and escalation triggers correctly","Review incident metrics Workbook for accuracy","Test ServiceNow integration creates and updates tickets correctly","Verify evidence packaging produces complete assessment artifacts"],
                        cost_estimate: "Included with Sentinel + Logic Apps consumption",
                        effort_hours: 18
                    }
                }
            }
        },

        "SI.L2-3.14.1": {
            objective: "Identify, report, and correct system flaws in a timely manner.",
            siem: {
                splunk_es: {
                    services: ["Splunk ES","Splunk SOAR","Tenable/Qualys Integration","Vulnerability Dashboards"],
                    implementation: {
                        steps: [
                            "Integrate vulnerability scanner data (Tenable, Qualys, Rapid7) into Splunk via API or syslog",
                            "Create ES correlation searches for newly discovered critical/high vulnerabilities on CUI assets",
                            "Build SOAR playbook: auto-create patch tickets in ServiceNow/Jira when critical vulns detected",
                            "Configure vulnerability-to-asset correlation using Splunk ES Asset Framework",
                            "Set up SLA tracking dashboards: Critical=72h, High=30d, Medium=90d remediation windows",
                            "Create automated reports for vulnerability remediation progress by asset category and severity",
                            "Build SOAR playbook for emergency patching workflow: detect > approve > deploy > verify > close",
                            "Configure alerts for vulnerability scan coverage gaps (assets not scanned in 30+ days)",
                            "Set up trend analysis dashboards showing vulnerability posture improvement over time",
                            "Create CMMC evidence reports showing flaw identification, reporting, and remediation timelines"
                        ],
                        verification: ["Verify vulnerability data ingestion from all scanners is current and complete","Test auto-ticketing playbook creates tickets with correct severity and SLA","Validate SLA tracking dashboard accurately reflects remediation timelines","Review scan coverage report for any unscanned CUI assets","Test emergency patching workflow end-to-end"],
                        cost_estimate: "Included with Splunk ES (scanner licensing separate)",
                        effort_hours: 24
                    }
                },
                sentinel: {
                    services: ["Microsoft Sentinel","Defender Vulnerability Management","Logic Apps","Azure Policy"],
                    implementation: {
                        steps: [
                            "Enable Defender Vulnerability Management data connector in Sentinel for unified visibility",
                            "Create Analytics Rules for critical vulnerability detection on CUI-scoped assets",
                            "Build Logic Apps playbook for automated ticket creation when critical vulnerabilities discovered",
                            "Configure Sentinel Watchlist with CUI asset inventory for vulnerability-to-scope correlation",
                            "Set up Workbook for vulnerability remediation tracking with SLA compliance metrics",
                            "Create automation rules for vulnerability alert enrichment with asset context and owner info",
                            "Build remediation verification playbook: re-scan after patch deployment and update ticket status",
                            "Configure Azure Policy for automated compliance assessment of patch levels",
                            "Set up weekly vulnerability posture reports for security leadership and CMMC evidence",
                            "Create trend analysis Workbook showing remediation velocity and risk reduction"
                        ],
                        verification: ["Verify Defender VM data flows correctly into Sentinel workspace","Test auto-ticketing playbook for critical vulnerability scenarios","Validate SLA tracking Workbook against manual remediation records","Review Azure Policy compliance for patch management","Test remediation verification playbook confirms patches applied"],
                        cost_estimate: "Included with Sentinel + Defender for Endpoint P2",
                        effort_hours: 20
                    }
                }
            }
        },

        "SI.L2-3.14.2": {
            objective: "Provide protection from malicious code at designated locations within organizational systems.",
            siem: {
                splunk_es: {
                    services: ["Splunk ES","Splunk SOAR","EDR Integration","Threat Intelligence Framework"],
                    implementation: {
                        steps: [
                            "Integrate EDR telemetry (SentinelOne, CrowdStrike, Defender) into Splunk ES for centralized malware visibility",
                            "Configure ES Malware data model for CIM-normalized malware event correlation",
                            "Set up Threat Intelligence Framework with malware hash feeds (VirusTotal, AlienVault OTX, MISP)",
                            "Create correlation searches for malware detection gaps: endpoints without EDR, outdated signatures",
                            "Build SOAR playbooks for malware response: isolate endpoint, collect forensics, block hash, scan environment",
                            "Configure automated file hash reputation lookups for all file creation/execution events",
                            "Set up dashboards for malware protection coverage: EDR deployment, signature currency, detection rates",
                            "Create correlation searches for fileless malware: PowerShell abuse, WMI persistence, LOLBins",
                            "Build automated malware sample submission playbook to sandbox (WildFire, Joe Sandbox, ANY.RUN)",
                            "Configure 24/7 alerting for critical malware detections with automated containment"
                        ],
                        verification: ["Test malware detection with EICAR test file across all protected endpoints","Validate SOAR playbook executes containment within defined SLA","Review malware coverage dashboard for any unprotected CUI assets","Test fileless malware detection with simulated PowerShell attack","Verify threat intel hash matching against known malware samples"],
                        cost_estimate: "Included with Splunk ES (EDR licensing separate)",
                        effort_hours: 28
                    }
                },
                sentinel: {
                    services: ["Microsoft Sentinel","Defender for Endpoint","Defender Antivirus","Threat Intelligence"],
                    implementation: {
                        steps: [
                            "Enable Defender for Endpoint data connector in Sentinel for unified malware event visibility",
                            "Configure Defender Antivirus policies via Intune for all CUI-scoped endpoints",
                            "Create Analytics Rules for malware detection events, quarantine failures, and protection gaps",
                            "Set up Threat Intelligence connectors for malware IOC feeds and automated matching",
                            "Build Logic Apps playbook for malware response: isolate device, collect investigation package, block hash",
                            "Configure Workbook for malware protection coverage and detection metrics",
                            "Create Analytics Rules for fileless attack detection: suspicious PowerShell, WMI, script execution",
                            "Set up automated malware sample submission to Defender cloud protection for detonation",
                            "Configure real-time alerts for critical malware detections with Teams/PagerDuty notification",
                            "Build post-malware incident playbook: scan environment for IOCs, verify containment, restore if needed"
                        ],
                        verification: ["Test with EICAR file and verify detection flows through to Sentinel incident","Validate containment playbook isolates device and collects evidence","Review protection coverage Workbook for gaps in CUI scope","Test fileless attack detection with simulated PowerShell abuse","Verify threat intel IOC matching for known malware hashes"],
                        cost_estimate: "Included with Sentinel + Defender for Endpoint",
                        effort_hours: 24
                    }
                }
            }
        },

        "SI.L2-3.14.6": {
            objective: "Monitor organizational systems, including inbound and outbound communications traffic, to detect attacks and indicators of potential attacks.",
            siem: {
                splunk_es: {
                    services: ["Splunk ES","Splunk Stream","ES Content Update","Network Traffic Analysis"],
                    implementation: {
                        steps: [
                            "Configure firewall log ingestion (Palo Alto, Fortinet, Cisco ASA) into Splunk for all perimeter traffic",
                            "Deploy Splunk Stream or integrate with Zeek/Suricata for deep network traffic analysis",
                            "Enable ESCU network-focused detection rules: C2 beaconing, DNS tunneling, data exfiltration",
                            "Configure Network Traffic data model with CIM-normalized fields for cross-source correlation",
                            "Build correlation searches for anomalous outbound traffic: unusual destinations, volumes, protocols, times",
                            "Set up threat intelligence feed integration for real-time IOC matching against network traffic",
                            "Create dashboards for inbound attack monitoring: port scans, brute force, exploit attempts, web attacks",
                            "Configure DNS log analysis for DGA detection, DNS tunneling, and suspicious domain lookups",
                            "Build SOAR playbooks for automated network containment: firewall block, DNS sinkhole, proxy block",
                            "Set up 24/7 SOC monitoring views with real-time network traffic anomaly detection"
                        ],
                        verification: ["Test C2 beaconing detection with simulated periodic callbacks","Validate DNS tunneling detection with test exfiltration tool","Review threat intel IOC matching against known-bad indicators","Test automated containment playbooks in isolated environment","Verify 24/7 monitoring views update in real-time"],
                        cost_estimate: "Included with Splunk ES",
                        effort_hours: 32
                    }
                },
                sentinel: {
                    services: ["Microsoft Sentinel","Defender for Endpoint","Azure Firewall","Network Watcher","Threat Intelligence"],
                    implementation: {
                        steps: [
                            "Configure Azure Firewall and NSG flow logs streaming to Sentinel workspace",
                            "Enable Defender for Endpoint network protection data connector for endpoint-level traffic visibility",
                            "Deploy Threat Intelligence data connectors for commercial and open-source IOC feeds",
                            "Create Analytics Rules for inbound attack detection: brute force, port scanning, web application attacks",
                            "Build outbound traffic monitoring rules: unusual destinations, large data transfers, non-standard protocols",
                            "Configure DNS Analytics solution for malicious domain detection and DNS tunneling identification",
                            "Set up Network Watcher packet capture for on-demand deep inspection during investigations",
                            "Create Fusion rules correlating network anomalies with endpoint and identity signals",
                            "Build automated response playbooks: block IP in Azure Firewall, isolate endpoint, alert SOC",
                            "Configure real-time Workbooks for 24/7 SOC network monitoring with geographic visualization"
                        ],
                        verification: ["Test inbound attack detection with simulated port scan and brute force","Validate outbound anomaly detection with simulated large data transfer","Review threat intelligence matching against known IOC feeds","Test automated blocking playbook in staging environment","Verify real-time Workbooks display current network traffic patterns"],
                        cost_estimate: "Included with Sentinel + Defender licensing",
                        effort_hours: 28
                    }
                },
                chronicle: {
                    services: ["Google SecOps SIEM","Google SecOps NDR","YARA-L","VirusTotal Integration"],
                    implementation: {
                        steps: [
                            "Configure firewall and proxy log ingestion into Google SecOps via Forwarders and Feeds",
                            "Deploy Google SecOps NDR capabilities for network traffic metadata analysis",
                            "Create YARA-L detection rules for C2 beaconing, DNS tunneling, and data exfiltration patterns",
                            "Configure UDM network event normalization for cross-source traffic correlation",
                            "Set up VirusTotal integration for automated domain and IP reputation checking",
                            "Build Google SecOps Dashboards for inbound/outbound traffic monitoring and anomaly detection",
                            "Create Reference Lists for known-good destinations and baseline traffic patterns",
                            "Configure alert rules for traffic to/from sanctioned countries or known-bad infrastructure",
                            "Set up automated response via Google SecOps SOAR: block IP, sinkhole domain, isolate endpoint",
                            "Build 24/7 SOC monitoring views with real-time network threat visibility"
                        ],
                        verification: ["Test C2 detection rules with simulated beaconing traffic","Validate DNS tunneling detection with test scenarios","Review VirusTotal enrichment accuracy for suspicious domains","Test SOAR containment playbooks in staging","Verify 24/7 monitoring dashboards update in real-time"],
                        cost_estimate: "Included with Google SecOps SIEM",
                        effort_hours: 30
                    }
                },
                elastic_siem: {
                    services: ["Elastic Security","Packetbeat","Network Detection Rules","Elastic Agent"],
                    implementation: {
                        steps: [
                            "Deploy Packetbeat or integrate Zeek/Suricata for network traffic metadata collection",
                            "Configure Elastic Agent network integrations for firewall, proxy, and DNS log collection",
                            "Install Elastic Security prebuilt network detection rules for C2, tunneling, exfiltration",
                            "Set up ECS-normalized network event correlation across all traffic sources",
                            "Create custom detection rules for CUI environment-specific traffic patterns",
                            "Configure Elastic Security Network map for geographic traffic visualization",
                            "Build Kibana dashboards for inbound/outbound traffic monitoring and anomaly detection",
                            "Set up threat intelligence integration for IOC matching against network events",
                            "Configure automated response actions for network-based threats via Elastic Agent",
                            "Build 24/7 SOC monitoring views with real-time network traffic analysis"
                        ],
                        verification: ["Test network detection rules with simulated attack traffic","Validate Packetbeat/Zeek data flows into Elasticsearch correctly","Review Network map for accurate geographic visualization","Test threat intel IOC matching against known indicators","Verify real-time dashboards update with current traffic"],
                        cost_estimate: "$5-20/GB/day + Elastic subscription",
                        effort_hours: 32
                    }
                }
            }
        },

        "SI.L2-3.14.7": {
            objective: "Identify unauthorized use of organizational systems.",
            siem: {
                splunk_es: {
                    services: ["Splunk ES","UBA","Access Center","Correlation Searches"],
                    implementation: {
                        steps: [
                            "Configure Splunk ES Access Center for comprehensive authentication monitoring across all systems",
                            "Deploy Splunk UBA for machine learning-based anomalous access detection",
                            "Create correlation searches for unauthorized access patterns: off-hours access, unusual locations, new devices",
                            "Build detection rules for unauthorized service usage: shadow IT, unapproved SaaS, rogue devices",
                            "Configure alerts for privileged account usage outside approved maintenance windows",
                            "Set up VPN and remote access monitoring for unauthorized connection attempts",
                            "Create dashboards for system usage patterns with baseline comparison and anomaly highlighting",
                            "Build SOAR playbooks for unauthorized access response: verify with user, disable if unconfirmed, escalate",
                            "Configure wireless access monitoring for rogue access points and unauthorized connections",
                            "Set up 24/7 SOC monitoring for real-time unauthorized access detection and response"
                        ],
                        verification: ["Test unauthorized access detection with simulated off-hours login","Validate UBA anomaly detection for unusual access patterns","Review Access Center for comprehensive coverage of all systems","Test SOAR playbook for unauthorized access response workflow","Verify rogue device detection identifies unauthorized endpoints"],
                        cost_estimate: "Included with Splunk ES + UBA add-on",
                        effort_hours: 24
                    }
                },
                sentinel: {
                    services: ["Microsoft Sentinel","UEBA","Entra ID Protection","Conditional Access"],
                    implementation: {
                        steps: [
                            "Enable Sentinel UEBA for automated detection of anomalous system usage patterns",
                            "Configure Entra ID Protection risk-based policies for unauthorized access detection",
                            "Create Analytics Rules for off-hours access, unusual locations, impossible travel, new devices",
                            "Set up Conditional Access policies to block or challenge unauthorized access attempts",
                            "Build KQL queries for unauthorized service usage: shadow IT detection via cloud app logs",
                            "Configure Sentinel Workbook for system usage monitoring with baseline comparison",
                            "Create automation rules for unauthorized access alerts: auto-enrich, verify, escalate",
                            "Set up Defender for Cloud Apps for shadow IT discovery and unsanctioned app detection",
                            "Build Logic Apps playbook for unauthorized access response: notify user, block if unconfirmed",
                            "Configure 24/7 alerting for critical unauthorized access events"
                        ],
                        verification: ["Test unauthorized access detection with simulated anomalous login","Validate UEBA anomaly scores for unusual usage patterns","Review Conditional Access policies block unauthorized attempts","Test shadow IT detection identifies unapproved applications","Verify response playbook executes correctly for unauthorized access"],
                        cost_estimate: "Included with Sentinel + Entra ID P2",
                        effort_hours: 20
                    }
                }
            }
        },

        "SC.L2-3.13.1": {
            objective: "Monitor, control, and protect communications at the external managed interfaces to the system and at key internal boundaries in the system.",
            siem: {
                splunk_es: {
                    services: ["Splunk ES","Firewall Log Analysis","Network Traffic Data Model","Zone-Based Monitoring"],
                    implementation: {
                        steps: [
                            "Ingest all perimeter firewall logs (Palo Alto, Fortinet, Cisco) into Splunk with zone tagging",
                            "Configure internal boundary device logs: internal firewalls, VLANs, microsegmentation (Illumio, Guardicore)",
                            "Set up ES Network Traffic data model with zone-aware field extractions (CUI zone, DMZ, external)",
                            "Create correlation searches for unauthorized cross-zone traffic: CUI zone to internet, DMZ to internal",
                            "Build dashboards showing traffic flows between security zones with volume and protocol breakdowns",
                            "Configure alerts for new/unexpected communication paths between security boundaries",
                            "Set up IDS/IPS log integration (Snort, Suricata, Palo Alto Threat Prevention) for boundary threat detection",
                            "Create SOAR playbooks for boundary violation response: block traffic, alert network team, create incident",
                            "Build compliance reports showing boundary protection effectiveness and policy enforcement",
                            "Configure real-time zone traffic visualization for 24/7 SOC monitoring"
                        ],
                        verification: ["Test cross-zone violation detection with simulated unauthorized traffic","Validate zone-based dashboards accurately reflect network architecture","Review IDS/IPS alert correlation for boundary-crossing threats","Test SOAR playbook for boundary violation containment","Verify compliance reports capture all boundary protection evidence"],
                        cost_estimate: "Included with Splunk ES",
                        effort_hours: 28
                    }
                },
                sentinel: {
                    services: ["Microsoft Sentinel","Azure Firewall","NSG Flow Logs","Defender for Cloud"],
                    implementation: {
                        steps: [
                            "Configure Azure Firewall diagnostic logs streaming to Sentinel for perimeter traffic analysis",
                            "Enable NSG Flow Logs for all network security groups to capture internal boundary traffic",
                            "Set up Defender for Cloud network topology visualization for boundary identification",
                            "Create Analytics Rules for unauthorized cross-boundary communications in CUI environment",
                            "Build KQL queries for traffic flow analysis between security zones (CUI, DMZ, external, management)",
                            "Configure Workbook for real-time boundary traffic monitoring with zone visualization",
                            "Set up alerts for new communication paths that violate network segmentation policies",
                            "Create Logic Apps playbook for boundary violation response: update NSG rules, alert network team",
                            "Build compliance Workbook showing boundary protection metrics and policy enforcement",
                            "Configure Azure Network Watcher for on-demand packet capture at boundary points"
                        ],
                        verification: ["Test cross-boundary violation detection with simulated unauthorized traffic","Validate zone-based Workbook accurately reflects Azure network topology","Review NSG Flow Log analysis for unexpected traffic patterns","Test boundary violation playbook executes containment correctly","Verify compliance Workbook captures all required CMMC evidence"],
                        cost_estimate: "Included with Sentinel + Azure networking",
                        effort_hours: 24
                    }
                }
            }
        },

        "RA.L2-3.11.2": {
            objective: "Scan for vulnerabilities in organizational systems and applications periodically and when new vulnerabilities affecting those systems and applications are identified.",
            siem: {
                splunk_es: {
                    services: ["Splunk ES","Tenable/Qualys/Rapid7 Integration","Vulnerability Dashboards","SOAR Automation"],
                    implementation: {
                        steps: [
                            "Integrate vulnerability scanner results (Tenable.io, Qualys, Rapid7) into Splunk via API add-ons",
                            "Configure ES Vulnerability data model for CIM-normalized vulnerability correlation",
                            "Create dashboards showing scan coverage: % of CUI assets scanned, scan frequency compliance",
                            "Build correlation searches for scan coverage gaps: CUI assets not scanned within required frequency",
                            "Set up SOAR playbook for new critical vulnerability response: identify affected assets, create tickets, track",
                            "Configure automated vulnerability-to-asset correlation using ES Asset Framework",
                            "Create trend analysis dashboards: vulnerability count over time, mean time to remediate, risk scores",
                            "Build SOAR playbook for emergency vulnerability scanning when new CVEs announced",
                            "Set up executive vulnerability posture reports for CMMC assessment evidence",
                            "Configure real-time alerting for critical/high vulnerabilities on CUI-scoped assets"
                        ],
                        verification: ["Verify scanner data ingestion is current and complete for all CUI assets","Test scan coverage gap detection identifies unscanned assets","Validate SOAR playbook creates tickets with correct severity and SLA","Review trend analysis dashboards for accuracy","Test emergency scanning playbook triggers correctly for new CVEs"],
                        cost_estimate: "Included with Splunk ES (scanner licensing separate)",
                        effort_hours: 24
                    }
                },
                sentinel: {
                    services: ["Microsoft Sentinel","Defender Vulnerability Management","Qualys/Tenable Connector","Logic Apps"],
                    implementation: {
                        steps: [
                            "Enable Defender Vulnerability Management data connector in Sentinel",
                            "Configure third-party scanner connectors (Qualys, Tenable) for multi-scanner visibility",
                            "Create Analytics Rules for critical vulnerability detection on CUI-scoped assets",
                            "Build Logic Apps playbook for automated ticket creation and remediation tracking",
                            "Configure Watchlist with CUI asset inventory for vulnerability-to-scope correlation",
                            "Set up Workbook for vulnerability scan coverage and remediation SLA tracking",
                            "Create automation rules for vulnerability enrichment with asset context and owner info",
                            "Build remediation verification playbook: re-scan after patch and update ticket status",
                            "Set up weekly vulnerability posture reports for CMMC evidence",
                            "Configure trend analysis Workbook showing remediation velocity and risk reduction"
                        ],
                        verification: ["Verify scanner data flows correctly into Sentinel workspace","Test auto-ticketing playbook for critical vulnerability scenarios","Validate scan coverage Workbook identifies unscanned assets","Review remediation SLA tracking for accuracy","Test remediation verification playbook confirms patches applied"],
                        cost_estimate: "Included with Sentinel + Defender for Endpoint P2",
                        effort_hours: 20
                    }
                }
            }
        },

        "AC.L2-3.1.1": {
            objective: "Limit system access to authorized users, processes acting on behalf of authorized users, and devices.",
            siem: {
                splunk_es: {
                    services: ["Splunk ES","Access Center","Identity Framework","Correlation Searches"],
                    implementation: {
                        steps: [
                            "Configure Splunk ES Access Center for centralized authentication monitoring across all CUI systems",
                            "Set up Asset & Identity Framework with authoritative sources: AD, Entra ID, Okta, RADIUS, TACACS+",
                            "Create correlation searches for unauthorized access attempts: failed logins, locked accounts, unknown users",
                            "Build detection rules for unauthorized device connections: unknown MAC addresses, rogue DHCP, NAC violations",
                            "Configure alerts for service account abuse: interactive logins, off-hours usage, unusual destinations",
                            "Set up VPN/remote access monitoring with geolocation and device compliance checking",
                            "Create dashboards for access control effectiveness: authorized vs unauthorized attempts, trends",
                            "Build SOAR playbooks for access violation response: verify identity, disable if unauthorized, escalate",
                            "Configure integration with NAC (Cisco ISE, Aruba ClearPass) for device authorization monitoring",
                            "Set up 24/7 SOC monitoring for real-time access control enforcement visibility"
                        ],
                        verification: ["Test unauthorized access detection with simulated failed login attempts","Validate device authorization monitoring detects rogue devices","Review Access Center for comprehensive coverage","Test SOAR playbook for access violation response","Verify NAC integration provides device compliance visibility"],
                        cost_estimate: "Included with Splunk ES",
                        effort_hours: 24
                    }
                },
                sentinel: {
                    services: ["Microsoft Sentinel","Entra ID","Conditional Access","Defender for Identity"],
                    implementation: {
                        steps: [
                            "Configure Entra ID sign-in and audit log streaming to Sentinel for centralized access monitoring",
                            "Enable Defender for Identity for on-premises AD authentication monitoring and threat detection",
                            "Create Analytics Rules for unauthorized access: failed logins, account lockouts, unknown users/devices",
                            "Set up Conditional Access policies with Sentinel monitoring for policy violation detection",
                            "Build KQL queries for device compliance monitoring: non-compliant devices accessing CUI resources",
                            "Configure Sentinel Workbook for access control effectiveness metrics and trend analysis",
                            "Create automation rules for access violation enrichment and automated response",
                            "Set up Entra ID Protection risk-based policies with Sentinel alert correlation",
                            "Build Logic Apps playbook for access violation response: verify, block, escalate",
                            "Configure 24/7 alerting for critical access control violations"
                        ],
                        verification: ["Test unauthorized access detection with simulated scenarios","Validate Conditional Access policy violation detection","Review access control Workbook for comprehensive coverage","Test response playbook for access violation handling","Verify Defender for Identity detects on-premises AD threats"],
                        cost_estimate: "Included with Sentinel + Entra ID P2",
                        effort_hours: 20
                    }
                }
            }
        },

        "AC.L2-3.1.7": {
            objective: "Prevent non-privileged users from executing privileged functions and capture the execution of such functions in audit logs.",
            siem: {
                splunk_es: {
                    services: ["Splunk ES","Privileged Activity Monitoring","Correlation Searches","SOAR"],
                    implementation: {
                        steps: [
                            "Configure Splunk ES to ingest all privilege escalation events: sudo, runas, UAC elevation, admin logons",
                            "Create correlation searches for unauthorized privilege usage: non-admin users executing admin commands",
                            "Build detection rules for privilege escalation attacks: token manipulation, DLL injection, exploit attempts",
                            "Set up monitoring for privileged group membership changes: Domain Admins, local Administrators, sudo group",
                            "Configure alerts for service account privilege abuse: interactive logins, lateral movement, unusual commands",
                            "Create dashboards for privileged activity monitoring: who, what, when, where for all privileged actions",
                            "Build SOAR playbooks for privilege violation response: verify authorization, revoke if unauthorized, escalate",
                            "Set up PAM integration (CyberArk, Delinea) log ingestion for privileged session monitoring",
                            "Configure real-time alerting for critical privilege escalation events on CUI systems",
                            "Build compliance reports showing privileged function execution audit trails"
                        ],
                        verification: ["Test privilege escalation detection with simulated unauthorized elevation","Validate group membership change alerts fire correctly","Review privileged activity dashboards for completeness","Test SOAR playbook for privilege violation response","Verify PAM integration captures all privileged sessions"],
                        cost_estimate: "Included with Splunk ES",
                        effort_hours: 22
                    }
                },
                sentinel: {
                    services: ["Microsoft Sentinel","Defender for Identity","Entra PIM","Privileged Access Monitoring"],
                    implementation: {
                        steps: [
                            "Configure Defender for Identity for privilege escalation detection in on-premises AD",
                            "Enable Entra Privileged Identity Management (PIM) audit logs streaming to Sentinel",
                            "Create Analytics Rules for unauthorized privilege usage: non-admin executing admin functions",
                            "Set up monitoring for privileged group changes: Global Admin, Domain Admin, local Administrator",
                            "Build KQL queries for privilege escalation attack detection: pass-the-hash, golden ticket, DCSync",
                            "Configure Workbook for privileged activity monitoring with timeline and user attribution",
                            "Create automation rules for privilege violation alerts: auto-enrich, verify authorization, escalate",
                            "Set up Entra PIM just-in-time access monitoring with Sentinel correlation",
                            "Build Logic Apps playbook for unauthorized privilege response: revoke access, notify admin, create incident",
                            "Configure 24/7 alerting for critical privilege escalation events"
                        ],
                        verification: ["Test privilege escalation detection with simulated attack scenarios","Validate PIM audit log integration captures all privileged activations","Review privileged activity Workbook for completeness","Test response playbook for unauthorized privilege handling","Verify Defender for Identity detects AD-based privilege attacks"],
                        cost_estimate: "Included with Sentinel + Entra ID P2 + Defender for Identity",
                        effort_hours: 20
                    }
                }
            }
        }
    }
};
