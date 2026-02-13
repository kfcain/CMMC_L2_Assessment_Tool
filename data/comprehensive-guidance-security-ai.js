// Comprehensive Implementation Guidance — Security Platforms & AI/LLM Platforms
// Covers: Datadog, Black Duck, Wiz, and AI/LLM platforms (AWS Bedrock, Azure OpenAI,
// Google Gemini for Gov, OpenAI ChatGPT Enterprise/Gov) for CMMC L2 compliance
// Focus: Secure deployment of AI with CUI, observability, CSPM, and SCA
// Version: 1.0.0

const COMPREHENSIVE_GUIDANCE_SECURITY_AI = {
    version: "1.0.0",
    lastUpdated: "2026-02-12",
    description: "Implementation guidance for Datadog, Black Duck, Wiz, and AI/LLM platforms (AWS Bedrock, Azure OpenAI, Google Gemini Gov, OpenAI Gov) across CMMC L2 controls",

    objectives: {

        // =====================================================================
        // AC.L2-3.1.1 — Limit system access to authorized users
        // =====================================================================
        "AC.L2-3.1.1": {
            cspm: {
                wiz: {
                    services: ["Wiz CSPM", "Wiz CIEM", "Wiz Identity Graph"],
                    implementation: {
                        steps: [
                            "Deploy Wiz agentless scanning across all cloud accounts handling CUI",
                            "Enable Wiz CIEM (Cloud Infrastructure Entitlement Management) to discover over-privileged identities",
                            "Configure Wiz Identity Graph to map effective permissions across AWS/Azure/GCP",
                            "Create Wiz policies to alert on IAM misconfigurations (wildcard permissions, unused credentials)",
                            "Set up Wiz Rules to detect service accounts with excessive privileges",
                            "Integrate Wiz findings with ticketing (Jira/ServiceNow) for remediation tracking",
                            "Schedule weekly Wiz identity risk reports for access review"
                        ],
                        verification: [
                            "Review Wiz CIEM dashboard for over-privileged identities",
                            "Verify Wiz policies detect IAM misconfigurations",
                            "Check Wiz Identity Graph for lateral movement paths",
                            "Confirm ticketing integration creates remediation tickets"
                        ],
                        cost_estimate: "$30,000-80,000/year (based on cloud resource count)",
                        effort_hours: 12
                    }
                }
            },
            observability: {
                datadog: {
                    services: ["Datadog Cloud SIEM", "Datadog Cloud Security Management", "Datadog Identity Risks"],
                    implementation: {
                        steps: [
                            "Deploy Datadog Agent on all CUI-handling systems for identity event collection",
                            "Enable Datadog Cloud Security Management (CSM) for cloud identity posture monitoring",
                            "Configure Datadog Cloud SIEM detection rules for unauthorized access attempts",
                            "Set up Datadog Identity Risks to detect compromised credentials and impossible travel",
                            "Create Datadog dashboards tracking authentication success/failure rates across CUI systems",
                            "Configure notification channels (PagerDuty/Slack/email) for critical access violations",
                            "Implement Datadog RBAC to restrict access to CUI monitoring data"
                        ],
                        verification: [
                            "Review Datadog Cloud SIEM for unauthorized access alerts",
                            "Verify CSM identity posture findings are triaged",
                            "Check Identity Risks dashboard for compromised credential alerts",
                            "Confirm RBAC restricts Datadog access to authorized personnel"
                        ],
                        cost_estimate: "$23-34/host/month (Pro/Enterprise)",
                        effort_hours: 10
                    }
                }
            },
            ai_platforms: {
                aws_bedrock: {
                    services: ["Amazon Bedrock", "IAM", "VPC Endpoints", "CloudTrail"],
                    implementation: {
                        steps: [
                            "Deploy Amazon Bedrock in a dedicated VPC with no internet gateway for CUI workloads",
                            "Create IAM policies restricting Bedrock model invocation to authorized roles only",
                            "Use VPC Endpoints (PrivateLink) for Bedrock API calls — no data traverses public internet",
                            "Enable CloudTrail logging for all Bedrock API calls (InvokeModel, InvokeModelWithResponseStream)",
                            "Implement SCP (Service Control Policy) to restrict Bedrock to approved regions (e.g., us-east-1, us-west-2)",
                            "Use IAM condition keys to restrict model access by IP range and MFA status",
                            "Tag all Bedrock resources with data classification labels (CUI, FOUO, etc.)"
                        ],
                        verification: [
                            "Verify VPC Endpoints are configured — no public internet path to Bedrock",
                            "Review IAM policies for least-privilege Bedrock access",
                            "Check CloudTrail for Bedrock API call logging",
                            "Confirm SCP restricts Bedrock to approved regions"
                        ],
                        cost_estimate: "Per-token pricing (varies by model) + VPC Endpoint ~$7.30/month",
                        effort_hours: 8
                    }
                },
                azure_openai: {
                    services: ["Azure OpenAI Service", "Entra ID", "Private Endpoints", "Azure Monitor"],
                    implementation: {
                        steps: [
                            "Deploy Azure OpenAI in a Government region (USGov Virginia/Arizona) for CUI workloads",
                            "Configure Private Endpoints to ensure all API traffic stays on Microsoft backbone",
                            "Use Entra ID managed identities for application authentication — no API keys in code",
                            "Implement Azure RBAC roles (Cognitive Services OpenAI User/Contributor) for least privilege",
                            "Enable diagnostic logging to Azure Monitor/Log Analytics for all API calls",
                            "Configure content filtering policies to prevent CUI leakage in prompts/responses",
                            "Disable shared key access — require Entra ID authentication only",
                            "Use customer-managed keys (CMK) for encryption of fine-tuned models and stored data"
                        ],
                        verification: [
                            "Verify Private Endpoints are active — no public network access",
                            "Confirm Entra ID authentication is enforced (shared keys disabled)",
                            "Review Azure Monitor logs for API call audit trail",
                            "Check content filtering policies are applied to all deployments"
                        ],
                        cost_estimate: "Per-token pricing + Private Endpoint ~$7.30/month + Azure Gov premium",
                        effort_hours: 10
                    }
                },
                google_gemini_gov: {
                    services: ["Vertex AI (Gemini)", "Google Cloud IAM", "VPC Service Controls", "Cloud Audit Logs"],
                    implementation: {
                        steps: [
                            "Deploy Vertex AI with Gemini models in Assured Workloads environment for FedRAMP compliance",
                            "Configure VPC Service Controls perimeter around Vertex AI to prevent data exfiltration",
                            "Use Google Cloud IAM with predefined Vertex AI roles for least-privilege access",
                            "Enable Cloud Audit Logs for all Vertex AI API calls (admin and data access)",
                            "Implement CMEK (Customer-Managed Encryption Keys) for model and data encryption",
                            "Configure organization policies to restrict Vertex AI to approved regions",
                            "Use service accounts with Workload Identity Federation — no long-lived keys"
                        ],
                        verification: [
                            "Verify VPC Service Controls perimeter is enforced",
                            "Review IAM bindings for Vertex AI roles",
                            "Check Cloud Audit Logs for API access events",
                            "Confirm CMEK encryption is active on all Vertex AI resources"
                        ],
                        cost_estimate: "Per-token pricing + Assured Workloads premium + VPC SC included",
                        effort_hours: 12
                    }
                },
                openai_gov: {
                    services: ["OpenAI ChatGPT Enterprise", "OpenAI API (via Azure Gov)", "SSO/SCIM"],
                    implementation: {
                        steps: [
                            "Deploy ChatGPT Enterprise with SSO integration via Entra ID/Okta for centralized access control",
                            "Enable SCIM provisioning for automated user lifecycle management",
                            "Configure workspace-level permissions restricting CUI-related GPT access to authorized groups",
                            "For API access, route through Azure OpenAI Service on Government cloud (not direct OpenAI API)",
                            "Disable data sharing for model training — verify enterprise data retention settings",
                            "Implement custom GPTs with system prompts that enforce CUI handling rules",
                            "Configure admin console audit logs and export to SIEM"
                        ],
                        verification: [
                            "Verify SSO is enforced — no password-only accounts",
                            "Confirm SCIM deprovisioning removes access within 24 hours",
                            "Review workspace permissions for CUI GPT access",
                            "Verify data sharing is disabled in admin settings"
                        ],
                        cost_estimate: "$60/user/month (ChatGPT Enterprise) or Azure OpenAI per-token",
                        effort_hours: 8
                    }
                }
            }
        },

        // =====================================================================
        // AC.L2-3.1.3 — Control the flow of CUI
        // =====================================================================
        "AC.L2-3.1.3": {
            cspm: {
                wiz: {
                    services: ["Wiz Data Security", "Wiz DSPM", "Wiz Network Graph"],
                    implementation: {
                        steps: [
                            "Enable Wiz Data Security Posture Management (DSPM) to discover CUI across cloud storage",
                            "Configure Wiz data classification rules to identify CUI patterns (ITAR, export-controlled, PII)",
                            "Use Wiz Network Graph to visualize data flow paths and identify unencrypted channels",
                            "Create Wiz policies alerting on CUI stored in publicly accessible resources",
                            "Set up Wiz Rules to detect cross-account or cross-region data transfers involving CUI",
                            "Integrate Wiz DSPM findings with DLP tools for enforcement"
                        ],
                        verification: [
                            "Review Wiz DSPM dashboard for CUI data exposure",
                            "Verify data classification rules detect CUI patterns",
                            "Check Network Graph for unencrypted data flow paths",
                            "Confirm public exposure alerts are generated"
                        ],
                        cost_estimate: "$30,000-80,000/year",
                        effort_hours: 14
                    }
                }
            },
            ai_platforms: {
                aws_bedrock: {
                    services: ["Amazon Bedrock Guardrails", "VPC Endpoints", "S3 Bucket Policies", "Macie"],
                    implementation: {
                        steps: [
                            "Configure Bedrock Guardrails to filter CUI from model responses (PII, sensitive data patterns)",
                            "Use VPC Endpoints to ensure all Bedrock traffic stays within AWS network",
                            "Implement S3 bucket policies preventing CUI training data from leaving the account/region",
                            "Enable Amazon Macie to scan S3 buckets used for Bedrock fine-tuning for CUI classification",
                            "Configure Bedrock model invocation logging to track all prompts containing CUI",
                            "Implement AWS Network Firewall rules to block Bedrock traffic to unauthorized destinations"
                        ],
                        verification: [
                            "Test Bedrock Guardrails with sample CUI data — verify filtering works",
                            "Verify VPC Endpoints are the only path to Bedrock APIs",
                            "Check Macie findings for CUI in training data buckets",
                            "Review CloudTrail for Bedrock invocation audit trail"
                        ],
                        cost_estimate: "Guardrails: $0.75-1.00/1K text units + Macie $1/GB",
                        effort_hours: 12
                    }
                },
                azure_openai: {
                    services: ["Azure OpenAI Content Filtering", "Private Endpoints", "Azure Policy", "Purview"],
                    implementation: {
                        steps: [
                            "Configure Azure OpenAI content filtering to detect and block CUI in prompts/responses",
                            "Deploy Private Endpoints — disable public network access entirely",
                            "Use Azure Policy to enforce Private Endpoint requirement on all OpenAI resources",
                            "Integrate Microsoft Purview for data classification of documents sent to OpenAI",
                            "Configure Azure OpenAI to use customer-managed keys for all stored data",
                            "Implement network security groups restricting which subnets can reach OpenAI endpoints"
                        ],
                        verification: [
                            "Test content filtering with sample CUI patterns",
                            "Verify public network access is disabled",
                            "Check Azure Policy compliance for Private Endpoint enforcement",
                            "Review Purview classification results for AI-processed documents"
                        ],
                        cost_estimate: "Content filtering included + Private Endpoint ~$7.30/month",
                        effort_hours: 10
                    }
                },
                google_gemini_gov: {
                    services: ["Vertex AI Guardrails", "VPC Service Controls", "DLP API", "Cloud Armor"],
                    implementation: {
                        steps: [
                            "Configure Vertex AI safety settings to filter sensitive content in prompts/responses",
                            "Enforce VPC Service Controls perimeter preventing data exfiltration from Vertex AI",
                            "Use Cloud DLP API to scan and redact CUI from prompts before sending to Gemini",
                            "Implement Cloud Armor WAF rules on any Vertex AI-backed APIs exposed to users",
                            "Configure organization policies restricting Vertex AI data residency to US regions",
                            "Enable data access audit logs for all Vertex AI prediction requests"
                        ],
                        verification: [
                            "Test safety settings with CUI-like content",
                            "Verify VPC Service Controls block unauthorized data egress",
                            "Check DLP API redaction on sample CUI prompts",
                            "Review audit logs for prediction request tracking"
                        ],
                        cost_estimate: "DLP API: $1-3/GB + VPC SC included",
                        effort_hours: 12
                    }
                }
            }
        },

        // =====================================================================
        // AU.L2-3.3.1 — Create and retain system audit logs
        // =====================================================================
        "AU.L2-3.3.1": {
            observability: {
                datadog: {
                    services: ["Datadog Log Management", "Datadog Cloud SIEM", "Datadog Audit Trail"],
                    implementation: {
                        steps: [
                            "Deploy Datadog Agent on all CUI systems with log collection enabled",
                            "Configure log pipelines to parse and enrich security-relevant events",
                            "Set up Datadog Log Archives to S3/Azure Blob/GCS for long-term retention (1+ year for CMMC)",
                            "Enable Datadog Cloud SIEM for real-time threat detection on audit logs",
                            "Configure Datadog Audit Trail to log all Datadog user actions (who viewed what logs)",
                            "Create log-based metrics for authentication events, privilege escalations, and data access",
                            "Implement log exclusion filters to prevent CUI from appearing in Datadog (redact sensitive fields)",
                            "Set up Datadog Sensitive Data Scanner to automatically redact CUI patterns in logs"
                        ],
                        verification: [
                            "Verify log collection from all CUI systems in Datadog Log Explorer",
                            "Check Log Archives are configured with appropriate retention (365+ days)",
                            "Confirm Sensitive Data Scanner rules detect and redact CUI patterns",
                            "Review Cloud SIEM detection rules for security event coverage"
                        ],
                        cost_estimate: "$1.70/million log events (ingestion) + $0.10/million (retention)",
                        effort_hours: 14
                    }
                }
            },
            ai_platforms: {
                aws_bedrock: {
                    services: ["CloudTrail", "CloudWatch Logs", "S3 Access Logging", "Bedrock Model Invocation Logging"],
                    implementation: {
                        steps: [
                            "Enable Bedrock Model Invocation Logging to capture all prompts and responses",
                            "Configure CloudTrail to log all Bedrock API calls (management and data events)",
                            "Send Bedrock invocation logs to CloudWatch Logs for real-time monitoring",
                            "Archive logs to S3 with lifecycle policies for 1+ year retention",
                            "Enable S3 access logging on buckets containing Bedrock training data",
                            "Create CloudWatch alarms for unusual Bedrock invocation patterns",
                            "Implement log encryption with KMS customer-managed keys"
                        ],
                        verification: [
                            "Verify Bedrock invocation logging captures prompts/responses",
                            "Check CloudTrail for Bedrock API event coverage",
                            "Confirm S3 lifecycle policies retain logs for 365+ days",
                            "Test CloudWatch alarms trigger on anomalous patterns"
                        ],
                        cost_estimate: "CloudTrail: $2/100K data events + CloudWatch Logs: $0.50/GB",
                        effort_hours: 8
                    }
                },
                azure_openai: {
                    services: ["Azure Monitor", "Log Analytics", "Diagnostic Settings", "Azure Storage"],
                    implementation: {
                        steps: [
                            "Enable diagnostic settings on Azure OpenAI resource — send to Log Analytics workspace",
                            "Configure audit logging for all API requests (RequestResponse category)",
                            "Set up Azure Storage account for long-term log archival (1+ year retention)",
                            "Create KQL queries in Log Analytics for monitoring AI usage patterns",
                            "Implement Azure Monitor alerts for unusual API call volumes or error rates",
                            "Enable Azure OpenAI abuse monitoring logs",
                            "Use customer-managed keys for log encryption at rest"
                        ],
                        verification: [
                            "Verify diagnostic settings capture all API requests",
                            "Check Log Analytics for Azure OpenAI audit events",
                            "Confirm storage account retention policy meets 365+ days",
                            "Test alert rules trigger on anomalous patterns"
                        ],
                        cost_estimate: "Log Analytics: $2.76/GB ingestion + Storage: $0.018/GB/month",
                        effort_hours: 8
                    }
                }
            }
        },

        // =====================================================================
        // CM.L2-3.4.1 — Establish and maintain baseline configurations
        // =====================================================================
        "CM.L2-3.4.1": {
            cspm: {
                wiz: {
                    services: ["Wiz CSPM", "Wiz Cloud Configuration", "Wiz Frameworks"],
                    implementation: {
                        steps: [
                            "Connect all cloud accounts to Wiz for continuous configuration assessment",
                            "Enable Wiz built-in frameworks (CIS Benchmarks, NIST 800-53, FedRAMP) for baseline compliance",
                            "Create custom Wiz Rules for organization-specific baseline requirements",
                            "Configure Wiz to detect configuration drift from established baselines",
                            "Set up Wiz auto-remediation for critical misconfigurations (e.g., public S3 buckets)",
                            "Generate Wiz compliance reports showing baseline adherence across all accounts",
                            "Integrate Wiz with IaC scanning to catch misconfigurations before deployment"
                        ],
                        verification: [
                            "Review Wiz CSPM dashboard for configuration compliance percentage",
                            "Verify framework assessments show baseline adherence",
                            "Check drift detection alerts are generated for changes",
                            "Confirm auto-remediation resolves critical misconfigurations"
                        ],
                        cost_estimate: "$30,000-80,000/year",
                        effort_hours: 16
                    }
                }
            },
            observability: {
                datadog: {
                    services: ["Datadog CSM Misconfigurations", "Datadog CSM Threats", "Datadog Compliance Monitoring"],
                    implementation: {
                        steps: [
                            "Enable Datadog Cloud Security Management (CSM) Misconfigurations for all cloud accounts",
                            "Configure CSM compliance frameworks (CIS, NIST 800-53) as baseline standards",
                            "Set up CSM Threats for real-time detection of configuration changes",
                            "Create Datadog Security Signals for baseline drift detection",
                            "Configure notification rules for critical misconfiguration findings",
                            "Generate compliance posture reports from CSM dashboard",
                            "Implement Datadog Infrastructure as Code (IaC) scanning in CI/CD pipelines"
                        ],
                        verification: [
                            "Review CSM Misconfigurations dashboard for compliance score",
                            "Verify framework compliance reports match baseline requirements",
                            "Check CSM Threats for real-time configuration change detection",
                            "Confirm notification rules alert on critical findings"
                        ],
                        cost_estimate: "$7.50/host/month (CSM Pro)",
                        effort_hours: 12
                    }
                }
            }
        },

        // =====================================================================
        // RA.L2-3.11.2 — Scan for vulnerabilities periodically and when new
        //                 vulnerabilities are identified
        // =====================================================================
        "RA.L2-3.11.2": {
            sca: {
                black_duck: {
                    services: ["Black Duck SCA", "Black Duck Binary Analysis", "Black Duck SBOM"],
                    implementation: {
                        steps: [
                            "Deploy Black Duck SCA (Software Composition Analysis) in CI/CD pipelines for all CUI applications",
                            "Configure Black Duck to scan all open-source and third-party components for known vulnerabilities",
                            "Enable Black Duck Binary Analysis for compiled artifacts and container images",
                            "Generate SBOM (Software Bill of Materials) for all deployed applications using Black Duck",
                            "Configure Black Duck policies to block builds with critical/high vulnerabilities",
                            "Set up Black Duck continuous monitoring for newly disclosed vulnerabilities (NVD feed)",
                            "Integrate Black Duck findings with Jira/ServiceNow for vulnerability remediation tracking",
                            "Configure Black Duck license compliance scanning to identify restrictive OSS licenses"
                        ],
                        verification: [
                            "Verify Black Duck scans run on every CI/CD build",
                            "Check Black Duck dashboard for open critical/high vulnerabilities",
                            "Confirm SBOM generation for all deployed applications",
                            "Review policy enforcement — builds blocked on critical findings",
                            "Verify continuous monitoring alerts for newly disclosed CVEs"
                        ],
                        cost_estimate: "$15,000-50,000/year (based on contributor count)",
                        effort_hours: 16
                    }
                }
            },
            cspm: {
                wiz: {
                    services: ["Wiz Vulnerability Management", "Wiz Container Security", "Wiz SBOM"],
                    implementation: {
                        steps: [
                            "Enable Wiz agentless vulnerability scanning across all cloud workloads",
                            "Configure Wiz to scan VMs, containers, serverless functions, and cloud-managed services",
                            "Set up Wiz vulnerability prioritization using Wiz Risk Score (exploitability + exposure + blast radius)",
                            "Generate Wiz SBOM for all running workloads",
                            "Configure Wiz policies to alert on critical vulnerabilities with network exposure",
                            "Integrate Wiz with CI/CD for pre-deployment image scanning",
                            "Schedule Wiz vulnerability reports for weekly review"
                        ],
                        verification: [
                            "Review Wiz vulnerability dashboard for critical/high findings",
                            "Verify agentless scanning covers all cloud accounts",
                            "Check Wiz Risk Score prioritization is accurate",
                            "Confirm CI/CD integration blocks vulnerable images"
                        ],
                        cost_estimate: "$30,000-80,000/year",
                        effort_hours: 10
                    }
                }
            },
            observability: {
                datadog: {
                    services: ["Datadog Software Composition Analysis", "Datadog CSM Vulnerabilities", "Datadog CI Visibility"],
                    implementation: {
                        steps: [
                            "Enable Datadog Software Composition Analysis (SCA) for application dependency scanning",
                            "Configure Datadog CSM Vulnerabilities for infrastructure-level vulnerability detection",
                            "Integrate Datadog SCA into CI/CD pipelines via Datadog CI Visibility",
                            "Set up Datadog vulnerability severity-based alerting (Critical/High within 24 hours)",
                            "Configure Datadog to correlate vulnerabilities with runtime exposure data",
                            "Generate vulnerability posture reports from Datadog Security dashboard"
                        ],
                        verification: [
                            "Verify SCA scans detect known vulnerable dependencies",
                            "Check CSM Vulnerabilities for infrastructure findings",
                            "Confirm CI/CD integration reports vulnerabilities before deployment",
                            "Review alerting rules for critical vulnerability notification"
                        ],
                        cost_estimate: "$7.50/host/month (CSM Pro) + SCA included in ASM",
                        effort_hours: 10
                    }
                }
            }
        },

        // =====================================================================
        // SA.L2-3.14.1 — Monitor organizational systems to detect attacks
        // =====================================================================
        "SA.L2-3.14.1": {
            observability: {
                datadog: {
                    services: ["Datadog Cloud SIEM", "Datadog APM Security", "Datadog Cloud Workload Security"],
                    implementation: {
                        steps: [
                            "Deploy Datadog Cloud SIEM with out-of-the-box detection rules for common attack patterns",
                            "Enable Datadog Application Security Monitoring (ASM) for web application threat detection",
                            "Configure Datadog Cloud Workload Security (CWS) for runtime threat detection on hosts/containers",
                            "Set up Datadog Security Signals with severity-based notification routing",
                            "Create custom SIEM detection rules for CUI-specific attack patterns",
                            "Integrate Datadog with incident response workflows (PagerDuty, Opsgenie)",
                            "Configure Datadog threat intelligence feeds for IOC matching",
                            "Set up Datadog Security Monitoring dashboards for SOC visibility"
                        ],
                        verification: [
                            "Review Cloud SIEM detection rule coverage against MITRE ATT&CK",
                            "Verify ASM detects OWASP Top 10 attacks on CUI applications",
                            "Check CWS detects suspicious process execution on CUI hosts",
                            "Confirm Security Signals route to appropriate response teams"
                        ],
                        cost_estimate: "$0.20/GB analyzed (Cloud SIEM) + $40/host/month (CWS)",
                        effort_hours: 16
                    }
                }
            },
            cspm: {
                wiz: {
                    services: ["Wiz Runtime Sensor", "Wiz Cloud Detection & Response", "Wiz Threat Center"],
                    implementation: {
                        steps: [
                            "Deploy Wiz Runtime Sensor on critical CUI workloads for real-time threat detection",
                            "Enable Wiz Cloud Detection & Response (CDR) for cloud-native attack detection",
                            "Configure Wiz Threat Center for threat intelligence and IOC matching",
                            "Set up Wiz detection rules for cloud-specific attack patterns (credential theft, lateral movement)",
                            "Integrate Wiz CDR alerts with SIEM/SOAR for automated response",
                            "Configure Wiz to detect and alert on suspicious API calls across cloud accounts"
                        ],
                        verification: [
                            "Verify Wiz Runtime Sensor is deployed on CUI workloads",
                            "Check CDR detection rules cover cloud attack patterns",
                            "Confirm Threat Center IOC matching is active",
                            "Review SIEM/SOAR integration for automated response"
                        ],
                        cost_estimate: "$30,000-80,000/year + Runtime Sensor add-on",
                        effort_hours: 14
                    }
                }
            }
        },

        // =====================================================================
        // SA.L2-3.14.7 — Identify unauthorized use of organizational systems
        // =====================================================================
        "SA.L2-3.14.7": {
            sca: {
                black_duck: {
                    services: ["Black Duck SCA", "Black Duck Security Advisories", "Black Duck Policy Engine"],
                    implementation: {
                        steps: [
                            "Configure Black Duck to identify unauthorized or unapproved open-source components in CUI systems",
                            "Set up Black Duck policies to flag components with known security advisories",
                            "Enable Black Duck license policy enforcement to detect unauthorized license types",
                            "Configure Black Duck to scan container images for unauthorized base images",
                            "Integrate Black Duck with CI/CD to prevent deployment of unauthorized components",
                            "Set up Black Duck alerts for newly discovered vulnerabilities in deployed components"
                        ],
                        verification: [
                            "Verify Black Duck detects unauthorized components",
                            "Check policy enforcement blocks unapproved libraries",
                            "Confirm container image scanning catches unauthorized base images",
                            "Review security advisory alerts for deployed components"
                        ],
                        cost_estimate: "$15,000-50,000/year",
                        effort_hours: 12
                    }
                }
            }
        },

        // =====================================================================
        // SC.L2-3.13.1 — Monitor, control, and protect communications at
        //                 external boundaries and key internal boundaries
        // =====================================================================
        "SC.L2-3.13.1": {
            cspm: {
                wiz: {
                    services: ["Wiz Network Graph", "Wiz Cloud Configuration", "Wiz Attack Path Analysis"],
                    implementation: {
                        steps: [
                            "Use Wiz Network Graph to visualize all network boundaries and data flows",
                            "Configure Wiz to detect misconfigured security groups, NACLs, and firewall rules",
                            "Enable Wiz Attack Path Analysis to identify paths from internet to CUI resources",
                            "Set up Wiz policies alerting on publicly exposed CUI resources",
                            "Use Wiz to verify network segmentation between CUI and non-CUI environments",
                            "Generate Wiz network topology reports for boundary documentation"
                        ],
                        verification: [
                            "Review Wiz Network Graph for unauthorized external exposure",
                            "Verify Attack Path Analysis shows no internet-to-CUI paths",
                            "Check network segmentation between CUI and non-CUI environments",
                            "Confirm public exposure alerts are generated for CUI resources"
                        ],
                        cost_estimate: "$30,000-80,000/year",
                        effort_hours: 10
                    }
                }
            },
            observability: {
                datadog: {
                    services: ["Datadog Network Performance Monitoring", "Datadog Cloud SIEM", "Datadog Network Device Monitoring"],
                    implementation: {
                        steps: [
                            "Deploy Datadog Network Performance Monitoring (NPM) on CUI network segments",
                            "Configure NPM to map all network flows between CUI and non-CUI systems",
                            "Set up Datadog Cloud SIEM rules for detecting unauthorized cross-boundary traffic",
                            "Enable Datadog Network Device Monitoring for firewall and router visibility",
                            "Create Datadog dashboards showing boundary traffic patterns and anomalies",
                            "Configure alerts for unexpected network flows crossing CUI boundaries"
                        ],
                        verification: [
                            "Review NPM flow maps for unauthorized cross-boundary traffic",
                            "Verify SIEM rules detect boundary violations",
                            "Check Network Device Monitoring for firewall rule compliance",
                            "Confirm alerting for unexpected CUI boundary crossings"
                        ],
                        cost_estimate: "$7/host/month (NPM) + $5/device/month (NDM)",
                        effort_hours: 12
                    }
                }
            },
            ai_platforms: {
                aws_bedrock: {
                    services: ["VPC Endpoints", "Security Groups", "Network Firewall", "PrivateLink"],
                    implementation: {
                        steps: [
                            "Deploy Bedrock exclusively via VPC Endpoints (PrivateLink) — no internet gateway",
                            "Configure Security Groups to restrict Bedrock endpoint access to authorized subnets only",
                            "Implement AWS Network Firewall to inspect and log all traffic to/from Bedrock VPC Endpoints",
                            "Use VPC Flow Logs to monitor all network traffic to Bedrock endpoints",
                            "Implement DNS firewall to prevent DNS-based data exfiltration from Bedrock workloads",
                            "Document network boundary architecture including Bedrock data flow paths"
                        ],
                        verification: [
                            "Verify no internet gateway in Bedrock VPC",
                            "Check Security Groups restrict access to authorized subnets",
                            "Review VPC Flow Logs for Bedrock endpoint traffic",
                            "Confirm Network Firewall rules inspect Bedrock traffic"
                        ],
                        cost_estimate: "VPC Endpoint: $7.30/month + Network Firewall: $0.395/hour",
                        effort_hours: 8
                    }
                },
                azure_openai: {
                    services: ["Private Endpoints", "NSG", "Azure Firewall", "Network Watcher"],
                    implementation: {
                        steps: [
                            "Deploy Azure OpenAI with Private Endpoints only — disable public network access",
                            "Configure NSGs to restrict Private Endpoint access to authorized subnets",
                            "Route Azure OpenAI traffic through Azure Firewall for inspection and logging",
                            "Enable Network Watcher flow logs for Azure OpenAI subnet traffic",
                            "Implement Azure DNS Private Zones for OpenAI endpoint resolution",
                            "Document network architecture showing AI service boundary controls"
                        ],
                        verification: [
                            "Verify public network access is disabled on Azure OpenAI resource",
                            "Check NSG rules restrict access to authorized subnets",
                            "Review Azure Firewall logs for OpenAI traffic",
                            "Confirm DNS resolution uses Private DNS Zones"
                        ],
                        cost_estimate: "Private Endpoint: $7.30/month + Azure Firewall: $1.25/hour",
                        effort_hours: 8
                    }
                }
            }
        },

        // =====================================================================
        // SC.L2-3.13.8 — Implement cryptographic mechanisms to prevent
        //                 unauthorized disclosure of CUI during transmission
        // =====================================================================
        "SC.L2-3.13.8": {
            ai_platforms: {
                aws_bedrock: {
                    services: ["VPC Endpoints (TLS 1.2+)", "KMS", "Certificate Manager"],
                    implementation: {
                        steps: [
                            "All Bedrock API calls use TLS 1.2+ by default — verify no TLS downgrade",
                            "Use VPC Endpoints to keep all Bedrock traffic on AWS private network (encrypted in transit)",
                            "Implement KMS encryption for Bedrock model customization data at rest",
                            "Configure S3 bucket policies requiring TLS for all training data access",
                            "Use AWS Certificate Manager for custom domain certificates on Bedrock-backed APIs",
                            "Verify Bedrock endpoint certificates are valid and not expired"
                        ],
                        verification: [
                            "Verify TLS 1.2+ on all Bedrock connections: aws bedrock-runtime invoke-model --debug",
                            "Check KMS key policies for Bedrock encryption",
                            "Confirm S3 bucket policies require ssl:true",
                            "Review certificate expiration dates"
                        ],
                        cost_estimate: "KMS: $1/key/month + $0.03/10K requests",
                        effort_hours: 4
                    }
                },
                azure_openai: {
                    services: ["TLS 1.2+", "Private Endpoints", "Customer-Managed Keys"],
                    implementation: {
                        steps: [
                            "Azure OpenAI enforces TLS 1.2+ for all API connections by default",
                            "Deploy Private Endpoints to ensure all traffic stays on Microsoft backbone",
                            "Configure customer-managed keys (CMK) for encryption of stored data",
                            "Verify minimum TLS version is set to 1.2 on the Azure OpenAI resource",
                            "Implement Azure Front Door with WAF for any public-facing AI endpoints (TLS termination)",
                            "Document encryption-in-transit architecture for AI data flows"
                        ],
                        verification: [
                            "Verify minimum TLS version: az cognitiveservices account show --query properties.encryption",
                            "Check Private Endpoint connectivity",
                            "Confirm CMK encryption is active",
                            "Test TLS version with: openssl s_client -connect <endpoint>:443"
                        ],
                        cost_estimate: "CMK: $1/key/month via Azure Key Vault",
                        effort_hours: 4
                    }
                },
                google_gemini_gov: {
                    services: ["TLS 1.2+", "VPC Service Controls", "CMEK"],
                    implementation: {
                        steps: [
                            "Vertex AI enforces TLS 1.2+ for all API connections by default",
                            "Configure VPC Service Controls to prevent data exfiltration over unencrypted channels",
                            "Implement CMEK for encryption of model data and predictions at rest",
                            "Use Private Google Access to keep Vertex AI traffic on Google's network",
                            "Verify SSL/TLS certificates on any custom Vertex AI endpoints",
                            "Document encryption architecture for AI data flows"
                        ],
                        verification: [
                            "Verify TLS 1.2+ on Vertex AI connections",
                            "Check VPC Service Controls perimeter enforcement",
                            "Confirm CMEK encryption is active",
                            "Review Private Google Access configuration"
                        ],
                        cost_estimate: "CMEK: $0.06/key version/month via Cloud KMS",
                        effort_hours: 4
                    }
                }
            }
        },

        // =====================================================================
        // SI.L2-3.14.2 — Provide protection from malicious code
        // =====================================================================
        "SI.L2-3.14.2": {
            sca: {
                black_duck: {
                    services: ["Black Duck SCA", "Black Duck Vulnerability Database", "Black Duck Policy Engine"],
                    implementation: {
                        steps: [
                            "Deploy Black Duck SCA to detect known malicious packages in application dependencies",
                            "Configure Black Duck to scan for typosquatting and dependency confusion attacks",
                            "Enable Black Duck continuous monitoring for newly disclosed malware in OSS packages",
                            "Set up Black Duck policies to block packages with known malware indicators",
                            "Integrate Black Duck with container registries to scan images for malicious layers",
                            "Configure Black Duck alerts for supply chain compromise indicators"
                        ],
                        verification: [
                            "Verify Black Duck detects known malicious packages",
                            "Check typosquatting detection catches suspicious package names",
                            "Confirm continuous monitoring alerts on newly disclosed malware",
                            "Review container image scan results for malicious layers"
                        ],
                        cost_estimate: "$15,000-50,000/year",
                        effort_hours: 10
                    }
                }
            },
            observability: {
                datadog: {
                    services: ["Datadog Cloud Workload Security", "Datadog ASM", "Datadog CSM Threats"],
                    implementation: {
                        steps: [
                            "Deploy Datadog Cloud Workload Security (CWS) for runtime malware detection on CUI hosts",
                            "Enable Datadog Application Security Monitoring (ASM) for web app malware protection",
                            "Configure CWS detection rules for malicious process execution, file integrity changes",
                            "Set up Datadog CSM Threats for cloud-level malicious activity detection",
                            "Create Security Signals for malware-related events with automated response actions",
                            "Integrate Datadog with endpoint protection for correlated threat detection"
                        ],
                        verification: [
                            "Verify CWS detects malicious process execution on test system",
                            "Check ASM detects web application attacks (SQLi, XSS, RCE)",
                            "Confirm CSM Threats detects cloud-level malicious activity",
                            "Review Security Signals for malware event coverage"
                        ],
                        cost_estimate: "$40/host/month (CWS) + $40/host/month (ASM)",
                        effort_hours: 12
                    }
                }
            }
        },

        // =====================================================================
        // SR.L2-3.17.1 — Develop, implement, and review supply chain risk
        //                 management plan
        // =====================================================================
        "SR.L2-3.17.1": {
            sca: {
                black_duck: {
                    services: ["Black Duck SCA", "Black Duck SBOM", "Black Duck Open Source Risk Management"],
                    implementation: {
                        steps: [
                            "Deploy Black Duck across all development teams for comprehensive software supply chain visibility",
                            "Generate SBOMs for all CUI-handling applications using Black Duck",
                            "Configure Black Duck to track all open-source component origins, versions, and licenses",
                            "Set up Black Duck vulnerability monitoring for all deployed components",
                            "Create Black Duck policies aligned with supply chain risk management plan requirements",
                            "Integrate Black Duck with procurement workflows for third-party software assessment",
                            "Generate quarterly Black Duck supply chain risk reports for management review",
                            "Configure Black Duck to detect abandoned or unmaintained open-source projects"
                        ],
                        verification: [
                            "Verify SBOM completeness for all CUI applications",
                            "Check Black Duck tracks all third-party component origins",
                            "Confirm vulnerability monitoring covers all deployed components",
                            "Review supply chain risk reports for management sign-off"
                        ],
                        cost_estimate: "$15,000-50,000/year",
                        effort_hours: 20
                    }
                }
            }
        },

        // =====================================================================
        // AC.L2-3.1.2 — Limit system access to the types of transactions
        //                and functions that authorized users are permitted
        // =====================================================================
        "AC.L2-3.1.2": {
            ai_platforms: {
                aws_bedrock: {
                    services: ["IAM Policies", "Bedrock Model Access", "Resource Policies"],
                    implementation: {
                        steps: [
                            "Create fine-grained IAM policies restricting which Bedrock models each role can invoke",
                            "Use Bedrock Model Access settings to enable only approved models (disable unrestricted access)",
                            "Implement resource-based policies on Bedrock custom models limiting invocation to specific roles",
                            "Use IAM condition keys to restrict Bedrock actions by time, IP, and MFA status",
                            "Create separate IAM roles for Bedrock administrators vs. Bedrock consumers",
                            "Implement AWS Organizations SCP to restrict Bedrock model provisioning to approved accounts"
                        ],
                        verification: [
                            "Verify IAM policies restrict model access per role",
                            "Check Bedrock Model Access shows only approved models enabled",
                            "Confirm resource policies limit custom model invocation",
                            "Test IAM condition keys enforce MFA and IP restrictions"
                        ],
                        cost_estimate: "No additional cost (IAM included)",
                        effort_hours: 6
                    }
                },
                azure_openai: {
                    services: ["Azure RBAC", "Deployment-Level Access", "Entra ID Groups"],
                    implementation: {
                        steps: [
                            "Assign Azure RBAC roles at the deployment level (not resource level) for granular model access",
                            "Create Entra ID security groups for different AI use cases (CUI analysis, general, admin)",
                            "Use Cognitive Services OpenAI User role for consumers, Contributor for administrators",
                            "Implement Conditional Access policies requiring compliant devices for Azure OpenAI access",
                            "Configure per-deployment rate limits to prevent abuse",
                            "Use Azure Policy to enforce RBAC assignment requirements on OpenAI resources"
                        ],
                        verification: [
                            "Verify RBAC assignments are at deployment level",
                            "Check Entra ID group membership for AI access groups",
                            "Confirm Conditional Access policies apply to OpenAI access",
                            "Test rate limits prevent excessive usage"
                        ],
                        cost_estimate: "No additional cost (RBAC included)",
                        effort_hours: 6
                    }
                },
                google_gemini_gov: {
                    services: ["IAM Roles", "Vertex AI Permissions", "Organization Policies"],
                    implementation: {
                        steps: [
                            "Assign Vertex AI predefined roles (aiplatform.user, aiplatform.admin) per least privilege",
                            "Create custom IAM roles for specific Vertex AI actions (predict only, no training)",
                            "Use organization policies to restrict Vertex AI model deployment to approved projects",
                            "Implement IAM conditions restricting Vertex AI access by IP range and time",
                            "Configure per-model access controls using Vertex AI endpoint IAM bindings",
                            "Use service accounts with minimal Vertex AI permissions for application access"
                        ],
                        verification: [
                            "Verify IAM role assignments follow least privilege",
                            "Check custom roles restrict to required actions only",
                            "Confirm organization policies limit model deployment",
                            "Test IAM conditions enforce access restrictions"
                        ],
                        cost_estimate: "No additional cost (IAM included)",
                        effort_hours: 6
                    }
                },
                openai_gov: {
                    services: ["ChatGPT Enterprise Admin Console", "Workspace Permissions", "Custom GPTs"],
                    implementation: {
                        steps: [
                            "Configure workspace-level permissions in ChatGPT Enterprise admin console",
                            "Create separate workspaces for CUI-authorized and general users",
                            "Restrict Custom GPT creation to authorized administrators only",
                            "Configure which models and features each workspace can access",
                            "Implement data loss prevention rules in Custom GPT system prompts",
                            "Disable file upload capabilities for non-CUI workspaces",
                            "Configure API access restrictions per workspace"
                        ],
                        verification: [
                            "Verify workspace separation between CUI and general users",
                            "Check Custom GPT creation is restricted to admins",
                            "Confirm model access is limited per workspace",
                            "Test DLP rules in Custom GPT system prompts"
                        ],
                        cost_estimate: "$60/user/month (ChatGPT Enterprise)",
                        effort_hours: 6
                    }
                }
            }
        },

        // =====================================================================
        // AU.L2-3.3.2 — Ensure actions can be traced to individual users
        // =====================================================================
        "AU.L2-3.3.2": {
            ai_platforms: {
                aws_bedrock: {
                    services: ["CloudTrail", "Bedrock Invocation Logging", "IAM Identity Center"],
                    implementation: {
                        steps: [
                            "Enable CloudTrail with Bedrock data events to capture per-user API calls",
                            "Configure Bedrock Model Invocation Logging with user identity in log records",
                            "Use IAM Identity Center (SSO) to ensure all Bedrock access is tied to named users",
                            "Prohibit shared IAM credentials — each user must have individual identity",
                            "Configure CloudWatch Logs Insights queries to trace Bedrock actions to specific users",
                            "Archive Bedrock audit logs with user attribution for 1+ year retention"
                        ],
                        verification: [
                            "Verify CloudTrail captures Bedrock API calls with user identity",
                            "Check invocation logs include user ARN/principal",
                            "Confirm no shared credentials are used for Bedrock access",
                            "Test CloudWatch query traces action to specific user"
                        ],
                        cost_estimate: "CloudTrail: $2/100K data events",
                        effort_hours: 6
                    }
                },
                azure_openai: {
                    services: ["Azure Monitor", "Entra ID Sign-in Logs", "Diagnostic Settings"],
                    implementation: {
                        steps: [
                            "Enable diagnostic settings to capture all Azure OpenAI API requests with caller identity",
                            "Use Entra ID managed identities (not shared API keys) for application authentication",
                            "Configure Entra ID sign-in logs to track user access to Azure OpenAI resources",
                            "Implement per-user API key rotation if direct API access is required",
                            "Create KQL queries in Log Analytics to trace AI actions to individual users",
                            "Archive audit logs with user attribution for 1+ year retention"
                        ],
                        verification: [
                            "Verify diagnostic logs include caller identity",
                            "Confirm managed identities are used (no shared API keys)",
                            "Check Entra ID sign-in logs for OpenAI resource access",
                            "Test KQL query traces action to specific user"
                        ],
                        cost_estimate: "Log Analytics: $2.76/GB ingestion",
                        effort_hours: 6
                    }
                }
            },
            observability: {
                datadog: {
                    services: ["Datadog Cloud SIEM", "Datadog Audit Trail", "Datadog User Analytics"],
                    implementation: {
                        steps: [
                            "Configure Datadog Cloud SIEM to correlate log events with user identities",
                            "Enable Datadog Audit Trail to track all Datadog platform actions by user",
                            "Set up user-based log facets for filtering and tracing actions to individuals",
                            "Create Datadog saved views for per-user activity investigation",
                            "Configure SIEM detection rules for user behavior anomalies",
                            "Implement Datadog RBAC to ensure audit trail integrity"
                        ],
                        verification: [
                            "Verify SIEM correlates events with user identities",
                            "Check Audit Trail captures all platform actions",
                            "Confirm user-based facets enable per-user tracing",
                            "Test saved views for user activity investigation"
                        ],
                        cost_estimate: "$0.20/GB analyzed (Cloud SIEM)",
                        effort_hours: 8
                    }
                }
            }
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { COMPREHENSIVE_GUIDANCE_SECURITY_AI };
}

if (typeof window !== 'undefined') {
    window.COMPREHENSIVE_GUIDANCE_SECURITY_AI = COMPREHENSIVE_GUIDANCE_SECURITY_AI;
}
