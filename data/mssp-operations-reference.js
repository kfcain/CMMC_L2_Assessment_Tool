// MSSP Operations Reference - Vendor-Neutral SOC/MSSP Operational Patterns
// How MSSPs and MDR providers structure their operations, tooling, and service delivery
// Based on industry patterns from Arctic Wolf, LevelBlue, Deepwatch, and similar providers
// Version: 1.0.0

const MSSP_OPERATIONS_REFERENCE = {
    version: "1.0.0",
    lastUpdated: "2026-02-09",

    // ==================== SOC ARCHITECTURE & TIERS ====================
    socArchitecture: {
        title: "SOC Architecture & Tiered Operations",
        description: "How MSSPs structure their Security Operations Centers with tiered analyst models, shift coverage, and escalation paths.",
        tiers: [
            {
                tier: "Tier 1 — Alert Triage & Monitoring",
                role: "SOC Analyst / Alert Analyst",
                coverage: "24/7/365",
                responsibilities: [
                    "Monitor SIEM dashboards and alert queues in real-time",
                    "Perform initial alert triage — true positive vs. false positive determination",
                    "Execute pre-built runbooks for common alert types",
                    "Enrich alerts with threat intelligence lookups (IP, domain, hash)",
                    "Create and update tickets in ITSM/ticketing system",
                    "Escalate confirmed incidents to Tier 2 within SLA (typically 15 min)",
                    "Acknowledge and document all alerts per client SLA",
                    "Monitor health of log sources and data ingestion pipelines"
                ],
                tools: ["SIEM console", "Ticketing system", "TI lookup tools", "Runbook platform", "ChatOps"],
                metrics: ["MTTA (Mean Time to Acknowledge)", "Alert volume per shift", "False positive rate", "Escalation rate"]
            },
            {
                tier: "Tier 2 — Incident Investigation",
                role: "Senior SOC Analyst / Incident Responder",
                coverage: "24/7 or on-call after hours",
                responsibilities: [
                    "Deep-dive investigation of escalated alerts",
                    "Correlate events across multiple log sources and timeframes",
                    "Perform host and network forensic triage",
                    "Determine blast radius and affected assets/accounts",
                    "Execute containment actions (isolate host, disable account, block IP)",
                    "Coordinate with client IT teams for response actions",
                    "Document incident timeline and root cause analysis",
                    "Develop and tune detection rules based on investigation findings",
                    "Perform threat hunting based on IOCs and TTPs"
                ],
                tools: ["SIEM advanced search", "EDR console", "SOAR playbooks", "Forensic tools", "Sandbox"],
                metrics: ["MTTD (Mean Time to Detect)", "MTTR (Mean Time to Respond)", "Incidents per analyst", "Containment time"]
            },
            {
                tier: "Tier 3 — Threat Hunting & Engineering",
                role: "Threat Hunter / Detection Engineer / Security Architect",
                coverage: "Business hours + on-call",
                responsibilities: [
                    "Proactive threat hunting using hypothesis-driven methodology",
                    "Develop custom detection content (SIEM rules, YARA, Sigma)",
                    "Reverse engineer malware samples and attack tooling",
                    "Conduct adversary emulation and purple team exercises",
                    "Build and maintain SOAR automation playbooks",
                    "Tune detection logic to reduce false positives",
                    "Research emerging threats and update detection coverage",
                    "Map detection coverage to MITRE ATT&CK framework",
                    "Develop client-specific threat models"
                ],
                tools: ["Threat hunting platform", "Malware sandbox", "ATT&CK Navigator", "Sigma/YARA editors", "SOAR"],
                metrics: ["Hunts completed per month", "New detections created", "ATT&CK coverage %", "FP reduction rate"]
            },
            {
                tier: "Concierge / vCISO Layer",
                role: "Concierge Security Team / Virtual CISO",
                coverage: "Business hours, scheduled reviews",
                responsibilities: [
                    "Serve as named security advisor for assigned clients",
                    "Conduct monthly/quarterly security posture reviews",
                    "Deliver executive-level security reporting and risk briefings",
                    "Guide clients through compliance frameworks (CMMC, SOC 2, HIPAA)",
                    "Review and prioritize vulnerability remediation roadmaps",
                    "Assist with security policy development and review",
                    "Coordinate tabletop exercises and incident response planning",
                    "Provide strategic security architecture recommendations",
                    "Act as escalation point for client security concerns"
                ],
                tools: ["GRC platform", "Reporting dashboards", "Risk register", "Policy templates"],
                metrics: ["Client satisfaction (NPS/CSAT)", "Time to remediation guidance", "Compliance readiness score"]
            }
        ],
        shiftModels: [
            {
                model: "Follow-the-Sun",
                description: "SOC locations in multiple time zones (e.g., US, EU, APAC) hand off coverage as the day progresses. Each team works standard business hours.",
                pros: ["No overnight shifts", "Better analyst retention", "Local language support"],
                cons: ["Requires 3+ SOC locations", "Handoff complexity", "Higher infrastructure cost"],
                bestFor: "Large MSSPs with global presence"
            },
            {
                model: "Rotating Shifts",
                description: "Single or dual SOC location with analysts rotating through day/swing/night shifts on a fixed schedule (e.g., 4 on / 4 off, 12-hour shifts).",
                pros: ["Single location", "Lower overhead", "Consistent team"],
                cons: ["Night shift burnout", "Higher turnover risk", "Fatigue-related errors"],
                bestFor: "Mid-size MSSPs, single-region operations"
            },
            {
                model: "Hybrid (Core + On-Call)",
                description: "Full staffing during business hours and peak periods, with on-call senior analysts for nights/weekends. AI/automation handles initial triage after hours.",
                pros: ["Cost-effective", "Senior analysts available for real incidents", "AI handles noise"],
                cons: ["Slower after-hours response", "On-call fatigue", "Requires strong automation"],
                bestFor: "Smaller MSSPs, MDR providers with strong automation"
            }
        ]
    },

    // ==================== LOG MANAGEMENT & DATA PIPELINE ====================
    logManagement: {
        title: "Log Ingestion, Normalization & Storage",
        description: "How MSSPs collect, normalize, correlate, and store logs from diverse client environments at scale.",
        pipeline: [
            {
                stage: "1. Collection",
                description: "Gather logs from all client data sources",
                methods: [
                    {
                        method: "Agent-Based",
                        description: "Lightweight agents installed on endpoints/servers forward logs directly to SIEM",
                        examples: ["Splunk Universal Forwarder", "Elastic Agent", "Microsoft MMA/AMA", "CrowdStrike Falcon sensor"],
                        pros: "Rich telemetry, real-time, works behind NAT",
                        cons: "Agent deployment overhead, resource consumption"
                    },
                    {
                        method: "Syslog / CEF / LEEF",
                        description: "Network devices, firewalls, and appliances send logs via syslog protocol to a collector",
                        examples: ["rsyslog/syslog-ng collector", "Palo Alto syslog", "Cisco ASA syslog", "F5 HSL"],
                        pros: "Universal support, no agent needed",
                        cons: "UDP unreliable, requires syslog infrastructure"
                    },
                    {
                        method: "API Polling",
                        description: "SIEM pulls logs from cloud services via REST APIs on a schedule",
                        examples: ["Microsoft Graph API", "AWS CloudTrail via S3", "Google Workspace Reports API", "Okta System Log API"],
                        pros: "No infrastructure at client site, cloud-native",
                        cons: "API rate limits, polling delay, authentication management"
                    },
                    {
                        method: "Event Hub / Stream",
                        description: "Real-time streaming of events from cloud platforms to SIEM",
                        examples: ["Azure Event Hub → Sentinel", "AWS Kinesis → Splunk", "GCP Pub/Sub → Chronicle", "Kafka → Elastic"],
                        pros: "Real-time, high throughput, reliable delivery",
                        cons: "More complex setup, streaming costs"
                    },
                    {
                        method: "Cloud-to-Cloud Connectors",
                        description: "Pre-built integrations between SaaS platforms and SIEM",
                        examples: ["Sentinel Data Connectors", "Splunk Add-ons (TAs)", "Chronicle Forwarder", "Elastic integrations"],
                        pros: "Easy setup, maintained by vendor",
                        cons: "Limited customization, vendor dependency"
                    }
                ]
            },
            {
                stage: "2. Normalization",
                description: "Transform diverse log formats into a common schema for correlation",
                details: [
                    "Parse raw logs into structured fields (timestamp, source IP, user, action, etc.)",
                    "Map to common data model (CIM for Splunk, ASIM for Sentinel, ECS for Elastic, UDM for Chronicle)",
                    "Enrich with asset context (hostname → business unit, IP → location, user → role)",
                    "Enrich with threat intelligence (IP/domain/hash reputation, geo-IP, ASN)",
                    "Tag with MITRE ATT&CK technique IDs where applicable",
                    "Standardize timestamps to UTC"
                ],
                commonSchemas: [
                    { name: "Splunk CIM", description: "Common Information Model — field naming standard for Splunk apps and searches" },
                    { name: "Sentinel ASIM", description: "Advanced Security Information Model — normalizes data across Microsoft Sentinel tables" },
                    { name: "Elastic ECS", description: "Elastic Common Schema — unified field naming for Elastic Stack" },
                    { name: "Chronicle UDM", description: "Unified Data Model — Google Chronicle's normalized event format" },
                    { name: "OCSF", description: "Open Cybersecurity Schema Framework — vendor-neutral schema standard (AWS-led)" }
                ]
            },
            {
                stage: "3. Reduction & Filtering",
                description: "Reduce log volume to control costs while retaining security-relevant data",
                techniques: [
                    "Drop known-noisy events (health checks, heartbeats, routine cron jobs)",
                    "Aggregate repeated events (e.g., 1000 firewall denies from same IP → 1 summary event)",
                    "Route low-value logs to cold/archive storage instead of hot SIEM",
                    "Use tiered storage: hot (30 days searchable) → warm (90 days) → cold/archive (1+ year)",
                    "Implement per-source volume caps with alerting on anomalous spikes",
                    "Filter at the collector level before ingestion to reduce bandwidth and cost"
                ],
                costOptimization: [
                    "Sentinel: Use Basic Logs tier ($0.50/GB vs $2.46/GB) for verbose sources like NetFlow, DNS",
                    "Splunk: Use Ingest Actions to filter/mask before indexing; use SmartStore for S3-backed warm storage",
                    "Chronicle: Flat-rate pricing model — ingest everything, no per-GB penalty",
                    "Elastic: Use ILM (Index Lifecycle Management) to auto-roll indices to cheaper storage tiers"
                ]
            },
            {
                stage: "4. Correlation & Detection",
                description: "Apply detection rules, ML models, and correlation logic to identify threats",
                approaches: [
                    {
                        approach: "Rule-Based Detection",
                        description: "Predefined correlation rules matching known attack patterns",
                        examples: ["Brute force: >10 failed logins in 5 min from same source", "Impossible travel: logins from 2 countries within 1 hour", "Lateral movement: PsExec/WMI to multiple hosts"]
                    },
                    {
                        approach: "Behavioral Analytics (UEBA)",
                        description: "Machine learning baselines normal behavior and alerts on anomalies",
                        examples: ["User accessing resources never accessed before", "Unusual data download volume", "Off-hours activity for user with no history of it"]
                    },
                    {
                        approach: "Threat Intelligence Matching",
                        description: "Match observed IOCs against known threat intelligence feeds",
                        examples: ["IP/domain matches known C2 infrastructure", "File hash matches known malware", "URL matches phishing campaign"]
                    },
                    {
                        approach: "Sigma Rules (Portable Detection)",
                        description: "Vendor-neutral detection rules that compile to SIEM-specific queries",
                        examples: ["Sigma rule → SPL (Splunk)", "Sigma rule → KQL (Sentinel)", "Sigma rule → Lucene (Elastic)"]
                    }
                ]
            },
            {
                stage: "5. Storage & Retention",
                description: "Long-term log storage for compliance, forensics, and audit requirements",
                retentionGuidelines: [
                    { requirement: "CMMC / NIST 800-171", retention: "Minimum 1 year retention, 90 days readily accessible", notes: "AU.L2-3.3.1 requires audit records sufficient to reconstruct events" },
                    { requirement: "DFARS 7012", retention: "90 days forensic image preservation after incident", notes: "Images must be available to DoD upon request" },
                    { requirement: "FedRAMP", retention: "1 year minimum, 90 days online", notes: "AU-11 requires retention per NARA schedules" },
                    { requirement: "HIPAA", retention: "6 years", notes: "Audit logs for PHI access" },
                    { requirement: "SOX", retention: "7 years", notes: "Financial system audit trails" },
                    { requirement: "PCI DSS", retention: "1 year, 3 months immediately available", notes: "Requirement 10.7" }
                ],
                storageArchitecture: [
                    { tier: "Hot", duration: "0-30 days", technology: "SIEM primary storage (SSD/NVMe)", searchable: "Full-text, sub-second", cost: "$$$$" },
                    { tier: "Warm", duration: "30-90 days", technology: "SIEM secondary / object storage", searchable: "Full-text, seconds", cost: "$$$" },
                    { tier: "Cold", duration: "90 days - 1 year", technology: "S3/Blob/GCS with compression", searchable: "Rehydrate to search (minutes)", cost: "$$" },
                    { tier: "Archive", duration: "1-7 years", technology: "Glacier/Archive tier, immutable", searchable: "Restore required (hours)", cost: "$" }
                ]
            }
        ]
    },

    // ==================== TICKETING & CASE MANAGEMENT ====================
    ticketingWorkflow: {
        title: "Ticketing, Case Management & Client Communication",
        description: "How MSSPs manage the lifecycle of security events from alert to resolution, including client communication and SLA tracking.",
        ticketLifecycle: [
            { stage: "New", description: "Alert auto-creates ticket from SIEM/SOAR. Assigned to Tier 1 queue.", sla: "Acknowledge within 15 min (P1) / 30 min (P2) / 4 hours (P3)" },
            { stage: "Triage", description: "Analyst reviews alert context, enriches with TI, determines true/false positive.", sla: "Initial triage within 30 min (P1)" },
            { stage: "Investigation", description: "Deep analysis of confirmed incidents. Scope determination, IOC extraction.", sla: "Investigation started within 1 hour (P1)" },
            { stage: "Containment", description: "Execute containment actions per pre-approved playbook or with client approval.", sla: "Containment action within 4 hours (P1)" },
            { stage: "Client Notification", description: "Notify client via portal, email, phone (P1), or Slack/Teams integration.", sla: "Client notified within 1 hour of confirmed incident" },
            { stage: "Remediation", description: "Work with client IT to eradicate threat and restore services.", sla: "Remediation plan within 24 hours" },
            { stage: "Post-Incident", description: "Document lessons learned, update detections, close ticket with full timeline.", sla: "PIR within 5 business days for P1/P2" }
        ],
        priorityMatrix: [
            { priority: "P1 — Critical", description: "Active breach, ransomware, data exfiltration in progress", responseTime: "15 min acknowledge, 1 hour containment", examples: ["Active ransomware encryption", "Confirmed data exfiltration", "Compromised admin account in use"] },
            { priority: "P2 — High", description: "Confirmed compromise, not yet active exploitation", responseTime: "30 min acknowledge, 4 hour investigation", examples: ["Malware on endpoint (contained)", "Compromised user credentials", "C2 beacon detected"] },
            { priority: "P3 — Medium", description: "Suspicious activity requiring investigation", responseTime: "4 hour acknowledge, 24 hour investigation", examples: ["Unusual login patterns", "Policy violation detected", "Vulnerability exploitation attempt"] },
            { priority: "P4 — Low / Informational", description: "Security hygiene, policy tuning, advisory", responseTime: "Next business day", examples: ["New vulnerability advisory", "Detection tuning request", "Compliance finding"] }
        ],
        clientCommunication: [
            {
                channel: "Client Portal",
                description: "Web-based portal where clients view real-time alert status, open tickets, download reports, and review security posture dashboards",
                features: ["Real-time alert feed with severity", "Ticket status tracking", "Monthly/quarterly report downloads", "Asset inventory view", "SLA compliance dashboard"]
            },
            {
                channel: "Automated Notifications",
                description: "System-generated alerts via email, SMS, or webhook for critical events",
                features: ["P1 incidents: phone call + email + SMS", "P2 incidents: email + portal notification", "Weekly digest of all activity", "Threshold-based alerts (e.g., >100 failed logins)"]
            },
            {
                channel: "ChatOps Integration",
                description: "Bi-directional integration with client's collaboration platform",
                features: ["Dedicated Slack/Teams channel per client", "Alert cards with approve/reject containment buttons", "Analyst can request info from client IT in real-time", "Automated status updates posted to channel"]
            },
            {
                channel: "Scheduled Reviews",
                description: "Regular cadence of security review meetings with client stakeholders",
                features: ["Monthly operational review (alert trends, SLA performance)", "Quarterly business review (risk posture, roadmap)", "Annual security strategy session", "Ad-hoc incident debriefs"]
            }
        ]
    },

    // ==================== CLOUD ACCESS & MULTI-TENANT MANAGEMENT ====================
    cloudAccess: {
        title: "Cloud Access Patterns & Multi-Tenant Management",
        description: "How MSSPs establish secure, read-only (or scoped) access to client cloud environments for monitoring, investigation, and response.",
        platforms: [
            {
                cloud: "AWS",
                accessModel: "Cross-Account IAM Roles",
                setupSteps: [
                    "Client creates IAM role in their account with trust policy pointing to MSSP's AWS account ID",
                    "Role uses AWS-managed SecurityAudit policy (read-only) plus custom policies for specific services",
                    "MSSP assumes role via STS AssumeRole — no long-lived credentials stored",
                    "External ID required in trust policy to prevent confused deputy attacks",
                    "CloudTrail logs all MSSP access for client audit"
                ],
                iamPolicy: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "MSSPSecurityAudit",
      "Effect": "Allow",
      "Action": [
        "guardduty:Get*", "guardduty:List*",
        "securityhub:Get*", "securityhub:List*",
        "cloudtrail:LookupEvents", "cloudtrail:GetTrailStatus",
        "config:Describe*", "config:Get*",
        "iam:Get*", "iam:List*",
        "ec2:Describe*",
        "s3:GetBucketPolicy", "s3:GetBucketAcl",
        "logs:FilterLogEvents", "logs:GetLogEvents"
      ],
      "Resource": "*"
    }
  ]
}`,
                trustPolicy: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "AWS": "arn:aws:iam::MSSP_ACCOUNT_ID:root" },
    "Action": "sts:AssumeRole",
    "Condition": {
      "StringEquals": { "sts:ExternalId": "CLIENT_UNIQUE_EXTERNAL_ID" }
    }
  }]
}`,
                responseActions: [
                    "Isolate EC2 instance (modify security group to deny-all)",
                    "Disable IAM user/access key",
                    "Revoke active sessions via IAM policy",
                    "Quarantine S3 bucket (block public access)",
                    "Snapshot EBS volume for forensics"
                ],
                automationTools: ["AWS SSM Run Command (pre-approved)", "Lambda functions triggered by SOAR", "Step Functions for multi-step response"]
            },
            {
                cloud: "Azure",
                accessModel: "Azure Lighthouse + Entra ID B2B",
                setupSteps: [
                    "Client onboards MSSP via Azure Lighthouse — delegates specific subscriptions/resource groups",
                    "MSSP analysts access client tenant from their own Entra ID with delegated permissions",
                    "Permissions scoped via Azure RBAC: Security Reader + Sentinel Responder roles",
                    "Microsoft Sentinel workspace shared via Lighthouse — MSSP sees client data in their own portal",
                    "All access logged in client's Azure Activity Log and Entra ID sign-in logs"
                ],
                lighthouseRoles: [
                    { role: "Security Reader", scope: "Subscription", purpose: "Read security alerts, policies, Defender for Cloud findings" },
                    { role: "Microsoft Sentinel Reader", scope: "Sentinel workspace", purpose: "View incidents, workbooks, analytics rules" },
                    { role: "Microsoft Sentinel Responder", scope: "Sentinel workspace", purpose: "Manage incidents, run playbooks, add comments" },
                    { role: "Log Analytics Reader", scope: "Log Analytics workspace", purpose: "Run KQL queries across client log data" }
                ],
                responseActions: [
                    "Isolate VM via NSG modification",
                    "Disable Entra ID user account",
                    "Revoke user sessions and refresh tokens",
                    "Block IP in Azure Firewall / NSG",
                    "Trigger Logic App playbook for automated response"
                ],
                automationTools: ["Sentinel Playbooks (Logic Apps)", "Azure Automation Runbooks", "Azure Functions"]
            },
            {
                cloud: "GCP",
                accessModel: "Organization-Level IAM + Workload Identity Federation",
                setupSteps: [
                    "Client grants MSSP service account roles at organization or project level",
                    "Use Workload Identity Federation to avoid service account key files",
                    "Assign Security Center Viewer + Logs Viewer roles",
                    "Chronicle SIEM ingests GCP logs via Pub/Sub — MSSP accesses Chronicle directly",
                    "All access logged in Cloud Audit Logs (Admin Activity + Data Access)"
                ],
                roles: [
                    "roles/securitycenter.viewer — View Security Command Center findings",
                    "roles/logging.viewer — Read Cloud Logging entries",
                    "roles/compute.viewer — View Compute Engine instances",
                    "roles/iam.securityReviewer — Review IAM policies"
                ],
                responseActions: [
                    "Stop/suspend Compute Engine instance",
                    "Disable service account keys",
                    "Update VPC firewall rules to isolate",
                    "Revoke OAuth tokens"
                ]
            },
            {
                cloud: "Microsoft 365",
                accessModel: "GDAP (Granular Delegated Admin Privileges)",
                setupSteps: [
                    "MSSP establishes GDAP relationship via Partner Center (replaces legacy DAP)",
                    "Client approves specific Entra ID roles — no Global Admin needed",
                    "MSSP assigns roles to security groups: Security Reader, Security Operator",
                    "Access to Defender portal, Purview, Entra ID via delegated permissions",
                    "All access logged in Unified Audit Log"
                ],
                recommendedRoles: [
                    "Security Reader — View alerts, incidents, secure score",
                    "Security Operator — Manage alerts, run investigations",
                    "Compliance Reader — View DLP alerts, compliance reports",
                    "Cloud App Security Administrator — Manage Defender for Cloud Apps policies"
                ],
                responseActions: [
                    "Disable user account in Entra ID",
                    "Revoke all refresh tokens",
                    "Block sign-in via Conditional Access",
                    "Quarantine email messages",
                    "Isolate device via Defender for Endpoint"
                ]
            }
        ],
        multiTenantManagement: {
            description: "Patterns for managing hundreds of client environments from a single pane of glass",
            approaches: [
                {
                    approach: "Centralized SIEM with Tenant Tagging",
                    description: "All client logs flow into a single SIEM instance. Each event is tagged with a client/tenant identifier. RBAC ensures analysts only see their assigned clients.",
                    platforms: ["Splunk (index-per-client)", "Sentinel (workspace-per-client via Lighthouse)", "Chronicle (tenant-per-client)"],
                    pros: "Single search interface, cross-client threat correlation, unified detection content",
                    cons: "Data sovereignty concerns, noisy neighbor risk, complex RBAC"
                },
                {
                    approach: "Federated / Per-Client Instances",
                    description: "Each client gets their own SIEM workspace/instance. MSSP uses a management layer to aggregate views across all instances.",
                    platforms: ["Sentinel multi-workspace (Azure Lighthouse)", "Elastic multi-cluster (CCR)", "Splunk federated search"],
                    pros: "Data isolation, client owns their data, easier compliance",
                    cons: "Higher cost, harder to correlate across clients, more infrastructure"
                },
                {
                    approach: "Hybrid (Shared Detection, Isolated Storage)",
                    description: "Detection rules and playbooks are centrally managed and pushed to per-client instances. Log data stays in client-owned storage.",
                    platforms: ["Sentinel content hub + Lighthouse", "Splunk ES with deployment server", "Chronicle with shared YARA-L rules"],
                    pros: "Best of both worlds — shared expertise, isolated data",
                    cons: "Complex deployment pipeline, version management"
                }
            ]
        }
    },

    // ==================== AUTOMATION & SOAR PATTERNS ====================
    automationPatterns: {
        title: "SOAR Automation & Orchestration Patterns",
        description: "Common automation playbooks and orchestration patterns used by MSSPs to handle alert volume at scale.",
        commonPlaybooks: [
            {
                name: "Phishing Email Triage",
                trigger: "User-reported phishing or email gateway alert",
                automatedSteps: [
                    "Extract URLs, attachments, sender info from reported email",
                    "Detonate attachments in sandbox (e.g., Any.Run, Joe Sandbox)",
                    "Check URLs against threat intelligence (VirusTotal, URLhaus)",
                    "Check sender domain age, SPF/DKIM/DMARC alignment",
                    "Search mailboxes for other recipients of same message",
                    "If malicious: quarantine from all mailboxes, block sender domain",
                    "If clean: close ticket, notify reporter",
                    "Update ticket with full analysis and IOCs"
                ],
                timeWithout: "30-45 minutes per email (manual)",
                timeWith: "2-5 minutes per email (automated)",
                platforms: "Cortex XSOAR, Splunk SOAR, Sentinel Playbooks, Tines"
            },
            {
                name: "Endpoint Malware Response",
                trigger: "EDR alert — malware detected on endpoint",
                automatedSteps: [
                    "Query EDR for full process tree and file details",
                    "Check file hash against TI feeds",
                    "If confirmed malicious: isolate endpoint from network via EDR API",
                    "Collect forensic artifacts (running processes, network connections, autoruns)",
                    "Disable user account if credential theft suspected",
                    "Create ticket with full context and notify client",
                    "Add IOCs to blocklist across all client endpoints",
                    "Schedule follow-up scan after remediation"
                ],
                timeWithout: "1-2 hours (manual investigation + containment)",
                timeWith: "5-10 minutes (automated containment, parallel investigation)",
                platforms: "CrowdStrike Falcon + XSOAR, SentinelOne + Swimlane, Defender + Sentinel"
            },
            {
                name: "Brute Force / Account Lockout",
                trigger: "SIEM correlation rule — multiple failed logins from single source",
                automatedSteps: [
                    "Enrich source IP (geo-IP, reputation, ASN, VPN/proxy check)",
                    "Check if source IP is known client VPN or office IP",
                    "If external + malicious reputation: block IP at firewall via API",
                    "If internal: check for compromised host, alert client IT",
                    "Check if any successful login followed the failures (account compromise)",
                    "If account compromised: force password reset, revoke sessions",
                    "Update ticket and notify client"
                ],
                timeWithout: "20-30 minutes",
                timeWith: "1-3 minutes",
                platforms: "Any SOAR + firewall API + IdP API"
            },
            {
                name: "Impossible Travel Detection",
                trigger: "UEBA alert — user logged in from two distant locations within impossible timeframe",
                automatedSteps: [
                    "Verify both login locations via geo-IP enrichment",
                    "Check if either IP is a known VPN endpoint",
                    "Query user's recent login history for travel patterns",
                    "Check device fingerprints — same device or different?",
                    "If suspicious: force MFA re-authentication, notify user and manager",
                    "If confirmed compromise: disable account, revoke sessions",
                    "Collect sign-in logs for forensic timeline"
                ],
                timeWithout: "15-25 minutes",
                timeWith: "2-5 minutes",
                platforms: "Sentinel + Logic Apps, Splunk SOAR, Cortex XSOAR"
            },
            {
                name: "Cloud Resource Exposure",
                trigger: "CSPM alert — S3 bucket / storage account made public, or security group opened to 0.0.0.0/0",
                automatedSteps: [
                    "Identify the resource and who made the change (CloudTrail/Activity Log)",
                    "Check if resource contains sensitive data (tags, classification)",
                    "If public exposure: automatically revert to private (if pre-approved)",
                    "If security group: remove 0.0.0.0/0 rule, add client CIDR only",
                    "Notify client with change details and remediation taken",
                    "Check for data access during exposure window",
                    "Create compliance finding in GRC platform"
                ],
                timeWithout: "30-60 minutes",
                timeWith: "1-5 minutes (auto-remediation)",
                platforms: "AWS Config Rules + Lambda, Azure Policy + Logic Apps, GCP SCC + Cloud Functions"
            }
        ],
        aiInOperations: {
            title: "AI/ML in MSSP Operations",
            applications: [
                {
                    area: "Alert Triage & Scoring",
                    description: "ML models score alerts based on historical true/false positive patterns, analyst actions, and environmental context. High-confidence false positives are auto-closed.",
                    impact: "Reduces Tier 1 workload by 40-60%"
                },
                {
                    area: "Natural Language Investigation",
                    description: "LLM-powered copilots allow analysts to query SIEM data in natural language, summarize incidents, and draft client notifications.",
                    impact: "Reduces investigation time by 30-50%"
                },
                {
                    area: "Automated Report Generation",
                    description: "AI generates monthly security reports, executive summaries, and incident post-mortems from structured data.",
                    impact: "Saves 2-4 hours per client per month"
                },
                {
                    area: "Detection Content Generation",
                    description: "AI assists in writing SIEM detection rules from threat intelligence reports, CVE descriptions, or MITRE ATT&CK techniques.",
                    impact: "Accelerates detection engineering by 3-5x"
                },
                {
                    area: "Anomaly Detection (UEBA)",
                    description: "Unsupervised ML models baseline normal user and entity behavior, flagging deviations without predefined rules.",
                    impact: "Catches insider threats and novel attacks missed by rules"
                },
                {
                    area: "Predictive Risk Scoring",
                    description: "Models predict which clients or assets are most likely to be targeted based on industry, exposure, and threat landscape.",
                    impact: "Enables proactive threat hunting prioritization"
                }
            ]
        }
    },

    // ==================== INCIDENT RESPONSE ORCHESTRATION ====================
    incidentResponse: {
        title: "Incident Response Orchestration",
        description: "How MSSPs coordinate incident response across their SOC, client IT teams, and third parties.",
        preApprovedActions: {
            description: "Actions the MSSP can take immediately without waiting for client approval. Defined during onboarding in the Rules of Engagement (ROE).",
            typical: [
                { action: "Isolate endpoint from network", approval: "Pre-approved", notes: "Via EDR network isolation — reversible, no data loss" },
                { action: "Disable compromised user account", approval: "Pre-approved", notes: "Temporary disable, not delete. Client notified immediately." },
                { action: "Block malicious IP at firewall", approval: "Pre-approved", notes: "Add to blocklist. Auto-expires after 72 hours unless extended." },
                { action: "Quarantine malicious email from all mailboxes", approval: "Pre-approved", notes: "Soft delete — recoverable if false positive" },
                { action: "Force password reset for compromised account", approval: "Pre-approved", notes: "User notified via alternate channel" },
                { action: "Revoke active sessions / refresh tokens", approval: "Pre-approved", notes: "User must re-authenticate" },
                { action: "Snapshot VM/disk for forensics", approval: "Pre-approved", notes: "Non-disruptive — creates copy" },
                { action: "Shut down / stop a server", approval: "Client approval required", notes: "Business impact — requires client sign-off" },
                { action: "Wipe / reimage endpoint", approval: "Client approval required", notes: "Destructive — data loss possible" },
                { action: "Modify firewall rules (beyond blocklist)", approval: "Client approval required", notes: "May affect business connectivity" },
                { action: "Engage law enforcement", approval: "Client approval required", notes: "Legal implications — client decision" },
                { action: "Notify regulators / affected parties", approval: "Client approval required", notes: "Legal/compliance — client's obligation" }
            ]
        },
        warRoomProtocol: {
            description: "Structured approach to managing major incidents (P1/P2) with multiple stakeholders",
            steps: [
                "Incident Commander (IC) declared — senior MSSP analyst or client CISO",
                "War room channel created (Teams/Slack/Zoom bridge)",
                "Roles assigned: IC, Lead Investigator, Scribe, Client Liaison, Comms Lead",
                "Status updates every 30 minutes (or as situation changes)",
                "Scribe maintains running incident timeline in shared doc",
                "All containment/remediation actions logged with timestamp and actor",
                "Client executive briefing at 1-hour, 4-hour, and 24-hour marks",
                "Evidence preservation chain of custody maintained throughout",
                "Post-incident review scheduled within 5 business days"
            ]
        }
    },

    // ==================== KEY METRICS & SLA FRAMEWORK ====================
    metricsAndSLAs: {
        title: "Key Metrics & SLA Framework",
        description: "Standard metrics and SLA targets used by MSSPs to measure and report on service quality.",
        coreMetrics: [
            { metric: "MTTA", fullName: "Mean Time to Acknowledge", target: "< 15 min (P1), < 30 min (P2)", description: "Time from alert firing to analyst acknowledgment" },
            { metric: "MTTD", fullName: "Mean Time to Detect", target: "< 1 hour", description: "Time from attack start to detection (includes dwell time)" },
            { metric: "MTTI", fullName: "Mean Time to Investigate", target: "< 30 min (P1), < 4 hours (P2)", description: "Time from acknowledgment to investigation completion" },
            { metric: "MTTC", fullName: "Mean Time to Contain", target: "< 4 hours (P1)", description: "Time from detection to containment action executed" },
            { metric: "MTTR", fullName: "Mean Time to Respond/Resolve", target: "< 24 hours (P1)", description: "Time from detection to full incident resolution" },
            { metric: "FP Rate", fullName: "False Positive Rate", target: "< 20%", description: "Percentage of alerts that are false positives after triage" },
            { metric: "Escalation Rate", fullName: "Tier 1 → Tier 2 Escalation Rate", target: "15-25%", description: "Percentage of alerts requiring Tier 2 investigation" },
            { metric: "SLA Compliance", fullName: "SLA Adherence Rate", target: "> 99%", description: "Percentage of tickets meeting SLA response times" },
            { metric: "Coverage", fullName: "Log Source Coverage", target: "> 95%", description: "Percentage of in-scope assets with active log collection" },
            { metric: "Detection Coverage", fullName: "MITRE ATT&CK Coverage", target: "> 80% of relevant techniques", description: "Percentage of ATT&CK techniques with active detections" }
        ],
        reportingCadence: [
            { report: "Daily Alert Summary", audience: "Client IT team", content: "Alert counts by severity, open tickets, notable events" },
            { report: "Weekly Threat Brief", audience: "Client IT + management", content: "Threat landscape updates, relevant CVEs, detection updates" },
            { report: "Monthly Operations Report", audience: "Client management", content: "SLA performance, alert trends, top threats, recommendations" },
            { report: "Quarterly Business Review", audience: "Client executives", content: "Risk posture, compliance status, roadmap, ROI metrics" },
            { report: "Annual Security Assessment", audience: "Board / C-suite", content: "Year-over-year trends, strategic recommendations, budget planning" }
        ]
    }
};

// Export
if (typeof window !== 'undefined') window.MSSP_OPERATIONS_REFERENCE = MSSP_OPERATIONS_REFERENCE;
if (typeof module !== 'undefined' && module.exports) module.exports = MSSP_OPERATIONS_REFERENCE;
