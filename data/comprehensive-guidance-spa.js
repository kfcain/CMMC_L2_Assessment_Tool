// Comprehensive Implementation Guidance - Expanded SPA Tool Coverage
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
    objectives: {
  "AC.L2-3.1.1": {
    iam_pam: {
      okta: {
        services: [
          "Okta Identity Cloud",
          "Okta Lifecycle Management",
          "Okta Workflows"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Okta Lifecycle Management with HR-driven provisioning",
            "Create group rules for automatic role assignment by department/title",
            "Set up Okta Workflows to disable accounts after ODP-defined inactivity",
            "Configure deprovisioning: disable → revoke sessions → remove groups → deactivate",
            "Forward Okta System Log to SIEM for account lifecycle audit trail",
            "Set up quarterly access certification via Okta Identity Governance"
          ],
          verification: [
            "Review Okta System Log for lifecycle events",
            "Verify deprovisioning workflows execute within SLA"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 24
        }
      },
      cyberark: {
        services: [
          "CyberArk Privilege Cloud",
          "Privileged Session Manager"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Onboard all privileged accounts into CyberArk Vault",
            "Configure automatic password rotation (30-day for service accounts)",
            "Set up Privileged Session Manager with full recording",
            "Create safe-level access controls mapping to org roles",
            "Enable alerts for privileged account changes outside CyberArk"
          ],
          verification: [
            "Verify all privileged accounts vaulted",
            "Confirm rotation on schedule"
          ],
          cost_estimate: "$50-100/privileged user/month",
          effort_hours: 40
        }
      },
      jumpcloud: {
        services: [
          "JumpCloud Directory Platform"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy JumpCloud as cloud directory for user lifecycle",
            "Configure SCIM provisioning to downstream apps",
            "Set up group policies for automatic access assignment",
            "Enable account suspension for inactivity",
            "Configure Directory Insights for audit logging"
          ],
          verification: [
            "Review Directory Insights",
            "Verify SCIM sync",
            "Confirm inactive accounts suspended"
          ],
          cost_estimate: "$7-15/user/month",
          effort_hours: 20
        }
      },
      duo: {
        services: [
          "Cisco Duo Access",
          "Duo Trust Monitor"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Integrate Duo with IdP for MFA on all account access",
            "Enable Trust Monitor for anomalous auth detection",
            "Set up policies to block inactive/disabled accounts",
            "Configure Auth Proxy for on-prem LDAP/RADIUS"
          ],
          verification: [
            "Review auth logs",
            "Verify Trust Monitor alerts triaged"
          ],
          cost_estimate: "$3-9/user/month",
          effort_hours: 12
        }
      }
    },
    xdr_edr: {
      crowdstrike: {
        services: [
          "Falcon Identity Threat Detection",
          "Falcon ITDR",
          "Falcon LogScale"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Falcon ITDR to monitor AD account changes",
            "Configure policies to alert on unauthorized account creation/modification",
            "Set up LogScale queries for account lifecycle events",
            "Create detection rules for dormant account reactivation",
            "Enable identity risk scoring for privileged accounts"
          ],
          verification: [
            "Review ITDR alerts",
            "Verify dormant account detection",
            "Confirm risk scores reviewed weekly"
          ],
          cost_estimate: "$15-25/endpoint/month",
          effort_hours: 16
        }
      },
      huntress: {
        services: [
          "Huntress Managed EDR",
          "Huntress Identity Threat Detection"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Huntress agents for unauthorized account creation monitoring",
            "Enable Identity Threat Detection for AD monitoring",
            "Configure Huntress SOC for 24/7 account event triage",
            "Integrate findings with RMM for remediation"
          ],
          verification: [
            "Review dashboard for account findings",
            "Verify SOC triage SLAs met"
          ],
          cost_estimate: "$3-5/endpoint/month",
          effort_hours: 8
        }
      }
    },
    siem: {
      splunk: {
        services: [
          "Splunk Cloud",
          "Splunk Enterprise Security"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Ingest AD/Entra ID account lifecycle logs",
            "Create correlation search: EventCode=4720 OR 4726 for account create/delete",
            "Build dashboard for account lifecycle trends",
            "Configure alert for inactive accounts re-enabled",
            "Set up scheduled report for accounts inactive beyond ODP period"
          ],
          verification: [
            "Verify logs ingesting < 5 min latency",
            "Confirm correlation searches firing"
          ],
          cost_estimate: "$15-50/GB/day",
          effort_hours: 20,
          splunk_queries: [
            {
              name: "Inactive Account Detection",
              query: "index=windows sourcetype=\"WinEventLog:Security\" EventCode=4624 | stats latest(_time) as last_logon by Account_Name | eval days_inactive=round((now()-last_logon)/86400,0) | where days_inactive > 35 | sort -days_inactive"
            },
            {
              name: "Account Lifecycle Events",
              query: "index=windows sourcetype=\"WinEventLog:Security\" (EventCode=4720 OR EventCode=4722 OR EventCode=4725 OR EventCode=4726) | eval action=case(EventCode=4720,\"Created\",EventCode=4722,\"Enabled\",EventCode=4725,\"Disabled\",EventCode=4726,\"Deleted\") | stats count by action, Account_Name"
            }
          ]
        }
      },
      sentinel: {
        services: [
          "Microsoft Sentinel",
          "Entra ID Audit Logs"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Enable Entra ID audit log connector in Sentinel",
            "Deploy analytics rule: Account created and deleted in short timeframe",
            "Create custom KQL for inactive account monitoring per ODP",
            "Configure automation rule to create ticket for unauthorized changes",
            "Build workbook for account lifecycle visualization"
          ],
          verification: [
            "Verify Entra logs flowing",
            "Confirm analytics rules generating incidents"
          ],
          cost_estimate: "$2.46/GB ingested",
          effort_hours: 16
        }
      },
      blumira: {
        services: [
          "Blumira SIEM",
          "Blumira Cloud Connectors"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Connect Blumira to AD/Entra ID",
            "Enable pre-built detection rules for account anomalies",
            "Configure automated response playbooks",
            "Set up weekly summary reports"
          ],
          verification: [
            "Verify connector healthy",
            "Confirm rules active"
          ],
          cost_estimate: "$3-7/user/month",
          effort_hours: 8
        }
      }
    },
    grc: {
      vanta: {
        services: [
          "Vanta Continuous Monitoring",
          "Vanta Access Reviews"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Connect Vanta to identity provider",
            "Enable continuous monitoring for account lifecycle",
            "Configure automated access reviews quarterly",
            "Set up tests for inactive/orphaned accounts and MFA"
          ],
          verification: [
            "Review Vanta dashboard for failing tests",
            "Confirm reviews complete on schedule"
          ],
          cost_estimate: "$5,000-15,000/year",
          effort_hours: 8
        }
      },
      drata: {
        services: [
          "Drata Compliance Automation",
          "Drata Access Reviews"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Integrate Drata with IdP and cloud platforms",
            "Map control to Drata framework",
            "Enable automated evidence collection",
            "Configure access review workflows with manager approval"
          ],
          verification: [
            "Review control status dashboard",
            "Confirm evidence auto-collected"
          ],
          cost_estimate: "$5,000-20,000/year",
          effort_hours: 8
        }
      }
    }
  },
  "AC.L2-3.1.2": {
    iam_pam: {
      okta: {
        services: [
          "Okta Access Gateway",
          "Okta Authorization Server"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Define authorization policies using group-based access rules",
            "Configure Authorization Server with custom scopes for CUI apps",
            "Implement Access Gateway for on-prem application enforcement",
            "Set up ABAC using Okta Expression Language"
          ],
          verification: [
            "Review policy evaluation logs",
            "Verify access gateway enforces CUI policies"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 20
        }
      },
      beyondtrust: {
        services: [
          "BeyondTrust Privilege Management",
          "Endpoint Privilege Management"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Endpoint Privilege Management for least-privilege on workstations",
            "Configure application control to restrict unauthorized software",
            "Set up privilege elevation for approved admin tasks only",
            "Enable session monitoring for elevated privilege usage"
          ],
          verification: [
            "Review elevation logs",
            "Verify app control blocks unauthorized apps"
          ],
          cost_estimate: "$30-60/endpoint/month",
          effort_hours: 24
        }
      }
    },
    xdr_edr: {
      crowdstrike: {
        services: [
          "Falcon Zero Trust Assessment",
          "Device Control",
          "Firewall Management"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Enable Falcon ZTA to score device compliance before access",
            "Configure Device Control to restrict USB/removable media on CUI systems",
            "Set up Firewall Management for CUI network segmentation",
            "Create host group policies based on device posture",
            "Integrate ZTA scores with conditional access in IdP"
          ],
          verification: [
            "Review ZTA scores across CUI endpoints",
            "Verify Device Control blocks unauthorized media"
          ],
          cost_estimate: "$15-25/endpoint/month",
          effort_hours: 20
        }
      }
    },
    dlp: {
      purview: {
        services: [
          "Microsoft Purview DLP",
          "Information Protection",
          "Data Classification"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Create CUI sensitivity labels in Purview Information Protection",
            "Configure DLP policies to enforce access controls on CUI-labeled content",
            "Set up auto-labeling for CUI based on content inspection",
            "Enable endpoint DLP to prevent unauthorized CUI transfer",
            "Configure DLP alerts with automated incident creation"
          ],
          verification: [
            "Review DLP policy match reports",
            "Verify labels applied to CUI"
          ],
          cost_estimate: "Included with M365 E5/G5",
          effort_hours: 24
        }
      },
      netskope: {
        services: [
          "Netskope CASB",
          "Netskope DLP",
          "Private Access"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy CASB to enforce access policies on cloud apps with CUI",
            "Configure DLP profiles with CUI patterns (ITAR, EAR, FOUO)",
            "Set up Private Access for zero-trust to on-prem CUI",
            "Enable real-time coaching for CUI sharing in unsanctioned apps"
          ],
          verification: [
            "Review CASB enforcement logs",
            "Verify DLP detects CUI patterns"
          ],
          cost_estimate: "$10-25/user/month",
          effort_hours: 20
        }
      }
    }
  },
  "AC.L2-3.1.3": {
    firewalls: {
      zscaler: {
        services: [
          "Zscaler Internet Access",
          "Zscaler Private Access",
          "Data Protection"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure ZIA policies to control outbound CUI data flows",
            "Deploy ZPA for zero-trust access to internal CUI resources",
            "Enable Data Protection to inspect CUI in transit",
            "Set up application segmentation in ZPA to restrict lateral CUI movement"
          ],
          verification: [
            "Review ZIA policy logs",
            "Verify ZPA segments isolate CUI apps"
          ],
          cost_estimate: "$8-20/user/month",
          effort_hours: 20
        }
      }
    },
    ndr: {
      darktrace: {
        services: [
          "Darktrace Enterprise Immune System",
          "RESPOND",
          "Cyber AI Analyst"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy sensors on CUI network segments to baseline normal flows",
            "Configure alerts on anomalous CUI data movement",
            "Enable RESPOND autonomous actions to block unauthorized exfiltration",
            "Set up Cyber AI Analyst for automated investigation"
          ],
          verification: [
            "Review model breach alerts for CUI segments",
            "Verify RESPOND actions appropriate"
          ],
          cost_estimate: "$20,000-100,000/year",
          effort_hours: 16
        }
      },
      vectra: {
        services: [
          "Vectra AI Platform",
          "Vectra Detect",
          "Vectra Recall"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy sensors to monitor CUI traffic for unauthorized flows",
            "Configure detection models for exfiltration and lateral movement",
            "Enable Recall for forensic analysis of historical CUI flows",
            "Set up host scoring to prioritize CUI system investigations"
          ],
          verification: [
            "Review threat scores for CUI hosts",
            "Verify models cover exfiltration scenarios"
          ],
          cost_estimate: "$15,000-80,000/year",
          effort_hours: 16
        }
      }
    },
    dlp: {
      code42: {
        services: [
          "Code42 Incydr",
          "Insider Risk Detection"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Incydr agents on CUI endpoints",
            "Configure file exposure detection for CUI file types",
            "Set up insider risk indicators for unauthorized CUI movement",
            "Enable automated response for high-risk CUI data flows"
          ],
          verification: [
            "Review Incydr exposure events",
            "Verify risk indicators calibrated"
          ],
          cost_estimate: "$8-15/user/month",
          effort_hours: 12
        }
      }
    }
  },
  "AC.L2-3.1.4": {
    iam_pam: {
      okta: {
        services: [
          "Okta Identity Governance",
          "Okta Group Management"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Define separation of duties matrix using conflicting group rules",
            "Configure Identity Governance to detect SoD violations",
            "Set up admin role separation: Super Admin, Org Admin, App Admin",
            "Enable access certifications that flag SoD conflicts",
            "Create Workflows to block provisioning creating SoD violations"
          ],
          verification: [
            "Review SoD violation reports",
            "Verify admin roles follow least-privilege"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 16
        }
      }
    },
    grc: {
      servicenow: {
        services: [
          "ServiceNow GRC",
          "Identity Governance"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Define SoD rules in ServiceNow GRC module",
            "Configure automated SoD conflict detection during provisioning",
            "Set up periodic SoD reviews with business owner approval",
            "Create SoD violation reports for compliance evidence"
          ],
          verification: [
            "Review SoD conflict reports",
            "Verify provisioning blocks violations"
          ],
          cost_estimate: "$50-100/user/month",
          effort_hours: 24
        }
      }
    }
  },
  "AC.L2-3.1.5": {
    iam_pam: {
      cyberark: {
        services: [
          "CyberArk Privilege Cloud",
          "Endpoint Privilege Manager",
          "Secure Web Sessions"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Endpoint Privilege Manager to remove local admin rights",
            "Configure JIT privilege elevation for approved admin tasks",
            "Set up Privilege Cloud with least-privilege safe access policies",
            "Enable Secure Web Sessions for cloud console access with recording",
            "Create privilege review workflows with automatic revocation"
          ],
          verification: [
            "Verify no standing local admin rights",
            "Confirm JIT requests logged and approved"
          ],
          cost_estimate: "$50-100/privileged user/month",
          effort_hours: 32
        }
      },
      delinea: {
        services: [
          "Delinea Secret Server",
          "Privilege Manager",
          "Server Suite"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Privilege Manager for endpoint least-privilege",
            "Configure application control to elevate only approved apps",
            "Set up Secret Server with role-based folder access",
            "Enable JIT access with time-limited grants"
          ],
          verification: [
            "Review elevation logs",
            "Verify Secret Server follows role-based policies"
          ],
          cost_estimate: "$30-70/user/month",
          effort_hours: 24
        }
      },
      keeper: {
        services: [
          "Keeper Vault",
          "Secrets Manager",
          "Connection Manager"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Keeper Vault with role-based folder structure",
            "Configure Secrets Manager for service account credential rotation",
            "Set up Connection Manager for secure RDP/SSH without exposing creds",
            "Enable enforcement policies: complexity, sharing restrictions, 2FA",
            "Configure BreachWatch for compromised credential monitoring"
          ],
          verification: [
            "Review audit logs for credential access",
            "Verify rotation executing"
          ],
          cost_estimate: "$4-8/user/month",
          effort_hours: 12
        }
      }
    },
    cspm: {
      wiz: {
        services: [
          "Wiz CIEM",
          "Wiz Cloud Security Platform"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Wiz CIEM to analyze effective cloud permissions",
            "Identify overly permissive IAM roles with identity graph",
            "Generate least-privilege recommendations for service accounts",
            "Set up rules to alert on privilege escalation paths"
          ],
          verification: [
            "Review CIEM findings",
            "Verify remediation reduces privilege scope"
          ],
          cost_estimate: "$30,000-100,000/year",
          effort_hours: 16
        }
      },
      prisma_cloud: {
        services: [
          "Prisma Cloud CIEM",
          "IAM Security",
          "Governance"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Enable IAM Security module for cloud identity analysis",
            "Configure net-effective permissions analysis",
            "Set up alerts for overly permissive IAM policies",
            "Create governance rules enforcing least-privilege"
          ],
          verification: [
            "Review IAM Security dashboard",
            "Verify governance rules enforced"
          ],
          cost_estimate: "$20,000-80,000/year",
          effort_hours: 16
        }
      }
    }
  },
  "AC.L2-3.1.6": {
    iam_pam: {
      cyberark: {
        services: [
          "CyberArk Privilege Cloud",
          "Identity Administration"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Inventory all privileged accounts and map to authorized personnel",
            "Onboard all privileged accounts into Vault with role-based safe access",
            "Configure checkout/approval for privileged account usage",
            "Set up dual-control approval for highest-privilege accounts",
            "Enable Privileged Threat Analytics for unauthorized privilege use"
          ],
          verification: [
            "Verify all privileged accounts vaulted",
            "Confirm checkout workflows function"
          ],
          cost_estimate: "$50-100/privileged user/month",
          effort_hours: 24
        }
      },
      beyondtrust: {
        services: [
          "BeyondTrust Password Safe",
          "Privileged Remote Access"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Password Safe to vault all privileged credentials",
            "Configure Privileged Remote Access for vendor/admin sessions with recording",
            "Set up approval workflows for privileged account checkout",
            "Enable session monitoring and recording"
          ],
          verification: [
            "Review checkout logs",
            "Verify session recordings retained"
          ],
          cost_estimate: "$30-60/user/month",
          effort_hours: 20
        }
      }
    }
  },
  "AC.L2-3.1.7": {
    iam_pam: {
      okta: {
        services: [
          "Okta Sign-On Policy",
          "ThreatInsight",
          "Behaviors"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Sign-On Policy with lockout after ODP-defined failures",
            "Set lockout duration per ODP requirements",
            "Enable ThreatInsight to block known malicious IPs",
            "Configure Behaviors for anomalous auth pattern detection"
          ],
          verification: [
            "Test lockout triggers after defined attempts",
            "Verify ThreatInsight blocks bad IPs"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 4
        }
      }
    }
  },
  "AC.L2-3.1.8": {
    iam_pam: {
      okta: {
        services: [
          "Okta Sign-On Policy",
          "ThreatInsight"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Sign-On Policy with lockout after ODP-defined consecutive failures",
            "Set lockout duration per ODP (e.g., 15 min or until admin unlock)",
            "Enable ThreatInsight to proactively block known malicious IPs",
            "Set up admin notifications for repeated lockout events"
          ],
          verification: [
            "Test lockout triggers",
            "Verify ThreatInsight blocks bad IPs"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 4
        }
      },
      duo: {
        services: [
          "Cisco Duo",
          "Duo Trust Monitor"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Duo lockout policy per ODP",
            "Enable Trust Monitor for credential stuffing detection",
            "Set up alerts for repeated failures",
            "Configure Auth Proxy for RADIUS/LDAP lockout"
          ],
          verification: [
            "Test lockout triggers",
            "Verify Trust Monitor detects brute-force"
          ],
          cost_estimate: "$3-9/user/month",
          effort_hours: 4
        }
      }
    },
    siem: {
      splunk: {
        services: [
          "Splunk Cloud",
          "Splunk ES"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Create correlation search for consecutive failed logons exceeding ODP",
            "Build dashboard for failed logon trends by user/source IP",
            "Configure notable event for brute-force with auto enrichment",
            "Set up adaptive response to disable account after threshold"
          ],
          verification: [
            "Verify correlation search fires on threshold",
            "Confirm adaptive response disables accounts"
          ],
          cost_estimate: "$15-50/GB/day",
          effort_hours: 8,
          splunk_queries: [
            {
              name: "Brute Force Detection",
              query: "index=windows sourcetype=\"WinEventLog:Security\" EventCode=4625 | bin _time span=15m | stats count by Account_Name, src_ip, _time | where count >= 3 | sort -count"
            }
          ]
        }
      }
    }
  },
  "AC.L2-3.1.10": {
    mdm_uem: {
      intune: {
        services: [
          "Microsoft Intune",
          "Configuration Profiles",
          "Compliance Policies"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Create Configuration Profile: screen lock timeout = ODP period",
            "Configure compliance policy requiring device lock with password/PIN",
            "Set up Conditional Access to block non-compliant devices from CUI",
            "Deploy profiles for Windows, macOS, iOS/Android"
          ],
          verification: [
            "Verify profiles deploy to all devices",
            "Test lock triggers after inactivity"
          ],
          cost_estimate: "Included with M365 E3/E5",
          effort_hours: 8
        }
      },
      jamf: {
        services: [
          "Jamf Pro",
          "Configuration Profiles",
          "Compliance Reporter"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Create profile with screen saver activation after ODP inactivity",
            "Configure password requirement on wake",
            "Deploy Compliance Reporter for verification",
            "Set up smart groups for non-compliant Macs"
          ],
          verification: [
            "Verify profile installed on all Macs",
            "Test screen lock activates"
          ],
          cost_estimate: "$4-8/device/month",
          effort_hours: 4
        }
      },
      kandji: {
        services: [
          "Kandji MDM",
          "Blueprints",
          "Compliance"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Blueprint with screen lock per ODP",
            "Enable auto-remediation to re-apply if user changes settings",
            "Set up compliance library for NIST screen lock requirements"
          ],
          verification: [
            "Verify Blueprint deploys",
            "Confirm auto-remediation works"
          ],
          cost_estimate: "$5-9/device/month",
          effort_hours: 4
        }
      }
    },
    rmm: {
      datto_rmm: {
        services: [
          "Datto RMM",
          "ComStore",
          "Monitoring"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy ComStore component for screen lock enforcement",
            "Configure monitoring for devices without screen lock",
            "Set up automated job to apply registry settings",
            "Create compliance report"
          ],
          verification: [
            "Verify component deploys",
            "Confirm monitoring detects non-compliant"
          ],
          cost_estimate: "$3-5/device/month",
          effort_hours: 4
        }
      }
    }
  },
  "AC.L2-3.1.12": {
    firewalls: {
      zscaler: {
        services: [
          "Zscaler Private Access",
          "Internet Access",
          "Client Connector"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Client Connector on all remote endpoints",
            "Configure ZPA application segments for CUI resources",
            "Set up device posture checks: OS, encryption, EDR agent",
            "Enable browser isolation for sensitive CUI web apps",
            "Configure ZIA for acceptable use enforcement"
          ],
          verification: [
            "Verify Client Connector on all remotes",
            "Confirm ZPA restricts to authorized CUI apps"
          ],
          cost_estimate: "$8-20/user/month",
          effort_hours: 20
        }
      }
    }
  },
  "AC.L2-3.1.13": {
    iam_pam: {
      okta: {
        services: [
          "Okta Adaptive MFA",
          "Okta Verify",
          "FIDO2"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Adaptive MFA with context-aware policies",
            "Require MFA for both local and network access to CUI",
            "Enable FIDO2 security keys as primary MFA factor",
            "Set up Okta Verify with biometric verification",
            "Disable SMS/voice as MFA factors (phishing-susceptible)"
          ],
          verification: [
            "Verify MFA on all CUI access",
            "Confirm phishing-resistant factors enforced"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 8
        }
      },
      duo: {
        services: [
          "Cisco Duo MFA",
          "Duo Push",
          "Duo Passwordless"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Duo MFA across all CUI apps and VPN",
            "Configure Verified Duo Push (number matching)",
            "Enable Duo Passwordless for FIDO2 authentication",
            "Set up policies requiring MFA for all access types"
          ],
          verification: [
            "Verify Duo MFA on all CUI apps",
            "Test FIDO2 authentication"
          ],
          cost_estimate: "$3-9/user/month",
          effort_hours: 8
        }
      }
    }
  },
  "AC.L2-3.1.16": {
    firewalls: {
      cisco: {
        services: [
          "Cisco Meraki Wireless",
          "Cisco ISE",
          "DNA Center"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure separate SSIDs for CUI and non-CUI wireless",
            "Enable 802.1X auth with Cisco ISE for CUI wireless",
            "Set up ISE posture assessment for wireless devices",
            "Configure Meraki wireless intrusion prevention",
            "Enable WPA3-Enterprise on CUI wireless network"
          ],
          verification: [
            "Verify 802.1X required for CUI SSID",
            "Confirm ISE posture checks block non-compliant"
          ],
          cost_estimate: "$10-30/AP/month",
          effort_hours: 16
        }
      }
    }
  },
  "AC.L2-3.1.18": {
    mdm_uem: {
      intune: {
        services: [
          "Microsoft Intune",
          "App Protection",
          "Conditional Access"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure device enrollment for all mobiles accessing CUI",
            "Create compliance policies: encryption, min OS, jailbreak detection",
            "Set up App Protection Policies for CUI apps without full enrollment",
            "Configure Conditional Access requiring compliant device",
            "Enable remote wipe for lost/stolen devices"
          ],
          verification: [
            "Verify all mobiles enrolled or have MAM",
            "Test remote wipe"
          ],
          cost_estimate: "Included with M365 E3/E5",
          effort_hours: 16
        }
      },
      jamf: {
        services: [
          "Jamf Pro",
          "Jamf Protect",
          "Jamf Connect"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Jamf Pro for iOS/iPadOS with supervised enrollment",
            "Configure Jamf Protect for mobile threat detection",
            "Set up restriction profiles: disable AirDrop, require encryption",
            "Enable Lost Mode and remote wipe"
          ],
          verification: [
            "Verify all Apple devices supervised",
            "Test Lost Mode and wipe"
          ],
          cost_estimate: "$4-8/device/month",
          effort_hours: 12
        }
      },
      workspace_one: {
        services: [
          "Workspace ONE UEM",
          "Access",
          "Intelligence"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy UEM for cross-platform mobile management",
            "Configure compliance policies for all platforms",
            "Set up Access for SSO with device trust",
            "Enable container encryption for CUI on mobile"
          ],
          verification: [
            "Verify all mobiles enrolled",
            "Confirm compliance enforces encryption"
          ],
          cost_estimate: "$5-12/device/month",
          effort_hours: 16
        }
      }
    }
  },
  "AC.L2-3.1.20": {
    xdr_edr: {
      crowdstrike: {
        services: [
          "Falcon Device Control",
          "USB Device Control"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Enable Falcon Device Control for USB/removable media management",
            "Create policies: block all USB storage, allow approved vendor IDs only",
            "Configure read-only exceptions for approved encrypted USBs",
            "Set up alerts for unauthorized USB attempts"
          ],
          verification: [
            "Verify block policy enforced",
            "Review unauthorized attempt alerts"
          ],
          cost_estimate: "$15-25/endpoint/month",
          effort_hours: 8
        }
      }
    }
  },
  "AC.L2-3.1.22": {
    dlp: {
      purview: {
        services: [
          "Microsoft Purview DLP",
          "Compliance Manager",
          "eDiscovery"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Purview DLP to scan public-facing SharePoint for CUI",
            "Set up auto-labeling to detect CUI in publicly accessible content",
            "Enable DLP alerts for CUI in public Teams channels",
            "Create eDiscovery searches to audit public content for CUI"
          ],
          verification: [
            "Review DLP matches for public content",
            "Verify auto-labeling detects CUI"
          ],
          cost_estimate: "Included with M365 E5/G5",
          effort_hours: 12
        }
      }
    }
  },
  "AT.L2-3.2.1": {
    security_awareness: {
      knowbe4: {
        services: [
          "KnowBe4 KMSAT",
          "PhishER",
          "Security Awareness Training"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy KMSAT with CUI-specific training modules",
            "Configure automated campaigns: new hire (immediate), recurring (quarterly)",
            "Set up phishing simulations with increasing difficulty",
            "Enable PhishER for automated phishing email triage",
            "Create custom content for CUI handling, insider threat, social engineering"
          ],
          verification: [
            "Review completion rates (target: 100%)",
            "Verify phishing click rates trending down"
          ],
          cost_estimate: "$15-25/user/year",
          effort_hours: 12
        }
      },
      ninjio: {
        services: [
          "Ninjio Security Awareness",
          "Phishing Simulator"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Ninjio with micro-learning episodes (3-4 min)",
            "Configure automated monthly delivery",
            "Set up phishing simulations aligned with training topics",
            "Enable compliance tracking for CMMC evidence"
          ],
          verification: [
            "Review episode completion rates",
            "Verify phishing results"
          ],
          cost_estimate: "$3-6/user/month",
          effort_hours: 4
        }
      }
    }
  },
  "AT.L2-3.2.2": {
    security_awareness: {
      knowbe4: {
        services: [
          "KnowBe4 KMSAT",
          "Role-Based Training",
          "Compliance Plus"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Create role-based groups: IT Admin, Security, Developers, Executives",
            "Assign role-specific modules (secure coding for devs, IR for security)",
            "Configure automated enrollment based on AD/Okta group membership",
            "Set up deadlines with escalation for non-completion"
          ],
          verification: [
            "Verify groups match org structure",
            "Review completion by role"
          ],
          cost_estimate: "$15-25/user/year",
          effort_hours: 8
        }
      }
    }
  },
  "AU.L2-3.3.1": {
    siem: {
      splunk: {
        services: [
          "Splunk Cloud",
          "Enterprise Security",
          "Add-ons"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Universal Forwarder to all CUI systems",
            "Configure sources: Windows Events, Linux syslog/auditd, network, cloud APIs",
            "Install Add-ons for AD, O365, AWS, Azure, Palo Alto, CrowdStrike",
            "Define index strategy: separate for security, app, network, cloud",
            "Configure retention matching ODP period",
            "Set up ES with CIM-compliant data models"
          ],
          verification: [
            "Verify all CUI systems forwarding",
            "Review retention meets ODP"
          ],
          cost_estimate: "$15-50/GB/day",
          effort_hours: 40,
          splunk_queries: [
            {
              name: "Log Source Inventory",
              query: "| tstats count where index=* by index, sourcetype, host | stats dc(host) as host_count, sum(count) as event_count by index, sourcetype | sort -event_count"
            }
          ]
        }
      },
      sentinel: {
        services: [
          "Microsoft Sentinel",
          "Azure Monitor",
          "Log Analytics"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Create Log Analytics Workspace in GCC High",
            "Enable connectors: Entra ID, M365 Defender, Azure Activity, Syslog, CEF",
            "Configure Azure Monitor diagnostics for all CUI resources",
            "Deploy AMA on all on-prem CUI servers",
            "Set up retention to match ODP (up to 730 days)"
          ],
          verification: [
            "Verify all connectors healthy",
            "Confirm AMA agents reporting"
          ],
          cost_estimate: "$2.46/GB ingested",
          effort_hours: 32
        }
      },
      sumo_logic: {
        services: [
          "Sumo Logic Cloud SIEM",
          "Log Analytics"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy collectors on all CUI systems",
            "Configure cloud-to-cloud integrations for SaaS sources",
            "Set up partitions for efficient querying and retention",
            "Enable Cloud SIEM for automated threat detection"
          ],
          verification: [
            "Verify collectors healthy",
            "Review SIEM detection coverage"
          ],
          cost_estimate: "$3-10/GB/day",
          effort_hours: 24
        }
      },
      blumira: {
        services: [
          "Blumira SIEM+XDR",
          "Cloud Connectors"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy sensors for on-prem log collection",
            "Configure cloud connectors for M365, Google, AWS, Azure",
            "Enable pre-built detection rules for NIST event types",
            "Set up automated response playbooks"
          ],
          verification: [
            "Verify all sources connected",
            "Confirm rules active"
          ],
          cost_estimate: "$3-7/user/month",
          effort_hours: 8
        }
      }
    }
  },
  "AU.L2-3.3.2": {
    siem: {
      splunk: {
        services: [
          "Splunk Cloud",
          "Enterprise Security"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure ES correlation searches for user activity monitoring",
            "Set up risk-based alerting to aggregate events into findings",
            "Create dashboards for security event trends",
            "Configure scheduled reports for audit review"
          ],
          verification: [
            "Review correlation search effectiveness",
            "Verify RBA scores calibrated"
          ],
          cost_estimate: "$15-50/GB/day",
          effort_hours: 20
        }
      }
    }
  },
  "AU.L2-3.3.3": {
    siem: {
      splunk: {
        services: [
          "Splunk ES",
          "ITSI",
          "Dashboard Studio"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure ES correlation searches for inappropriate activities per ODP",
            "Set up risk-based alerting (RBA) to aggregate events into findings",
            "Create executive dashboards for security posture trends",
            "Configure scheduled reports for weekly/monthly review"
          ],
          verification: [
            "Review correlation search effectiveness weekly",
            "Confirm reports delivered on time"
          ],
          cost_estimate: "$15-50/GB/day + ES license",
          effort_hours: 24,
          splunk_queries: [
            {
              name: "Unusual After-Hours Activity",
              query: "index=windows sourcetype=\"WinEventLog:Security\" EventCode=4624 Logon_Type=10 | eval hour=strftime(_time,\"%H\") | where hour < 6 OR hour > 22 | stats count by Account_Name, src_ip | where count > 3"
            },
            {
              name: "Data Exfiltration Indicators",
              query: "index=proxy OR index=firewall action=allowed bytes_out>10000000 | stats sum(bytes_out) as total_bytes by src_ip, dest_ip | eval total_MB=round(total_bytes/1048576,2) | where total_MB > 100 | sort -total_MB"
            }
          ]
        }
      }
    },
    soar: {
      cortex_xsoar: {
        services: [
          "Cortex XSOAR",
          "Marketplace",
          "TIM"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy XSOAR with SIEM integration for automated alert triage",
            "Install marketplace content packs for audit analysis playbooks",
            "Configure automated enrichment for suspicious indicators",
            "Set up war room for collaborative investigation"
          ],
          verification: [
            "Verify SIEM integration ingesting alerts",
            "Confirm playbooks execute correctly"
          ],
          cost_estimate: "$40,000-100,000/year",
          effort_hours: 32
        }
      },
      splunk_soar: {
        services: [
          "Splunk SOAR",
          "Playbooks",
          "Apps"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy SOAR integrated with Splunk ES",
            "Configure playbooks for notable event triage and enrichment",
            "Set up response actions: user disable, endpoint isolate, ticket creation",
            "Enable MTTD/MTTR reporting"
          ],
          verification: [
            "Verify SOAR receives ES notables",
            "Review MTTD/MTTR weekly"
          ],
          cost_estimate: "Included with ES Premium or $30,000+/year",
          effort_hours: 24
        }
      },
      tines: {
        services: [
          "Tines Security Automation",
          "Stories",
          "Cases"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Create stories for automated audit analysis workflows",
            "Configure SIEM webhook for real-time alert ingestion",
            "Build enrichment stories correlating with threat intel",
            "Set up Cases for tracking investigations"
          ],
          verification: [
            "Verify webhook receives alerts",
            "Review case management"
          ],
          cost_estimate: "Free community or $50,000+/year",
          effort_hours: 16
        }
      }
    }
  },
  "AU.L2-3.3.4": {
    siem: {
      splunk: {
        services: [
          "Splunk Monitoring Console",
          "Alerts"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Monitoring Console to track forwarder health",
            "Create alert: missing log sources (no events > 1 hour)",
            "Set up alert for index queue blocking",
            "Configure PagerDuty/Slack notifications for failures"
          ],
          verification: [
            "Verify monitoring tracks all forwarders",
            "Test alert fires when source goes silent"
          ],
          cost_estimate: "Included with Splunk",
          effort_hours: 8,
          splunk_queries: [
            {
              name: "Silent Log Sources",
              query: "| tstats latest(_time) as last_event by host | eval hours_silent=round((now()-last_event)/3600,1) | where hours_silent > 1 | sort -hours_silent"
            }
          ]
        }
      }
    },
    itsm: {
      jira: {
        services: [
          "Jira Service Management",
          "Automation",
          "Opsgenie"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure JSM to receive audit failure alerts from SIEM",
            "Set up Automation rules to escalate unacknowledged tickets",
            "Integrate Opsgenie for on-call alerting",
            "Create SLA policies (acknowledge within 15 min)"
          ],
          verification: [
            "Verify SIEM creates tickets on failure",
            "Confirm Opsgenie alerts on-call"
          ],
          cost_estimate: "$20-50/agent/month",
          effort_hours: 8
        }
      }
    }
  },
  "AU.L2-3.3.6": {
    rmm: {
      datto_rmm: {
        services: [
          "Datto RMM",
          "Monitoring"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy script to configure NTP on all managed endpoints",
            "Set authoritative time source per ODP",
            "Configure monitoring for NTP sync status",
            "Set up alerts for time drift exceeding threshold"
          ],
          verification: [
            "Verify NTP configured on all endpoints",
            "Confirm drift within range"
          ],
          cost_estimate: "$3-5/device/month",
          effort_hours: 4
        }
      }
    }
  },
  "AU.L2-3.3.7": {
    backup: {
      veeam: {
        services: [
          "Veeam Backup & Replication",
          "Immutable Backups",
          "Veeam ONE"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Veeam to back up SIEM/log storage with immutable copies",
            "Enable hardened repository with immutability",
            "Set up backup copy jobs to offsite/cloud",
            "Configure Veeam ONE monitoring for backup health",
            "Enable encryption for audit log backup data"
          ],
          verification: [
            "Verify immutable backups on schedule",
            "Test restore of audit logs"
          ],
          cost_estimate: "$5-15/workload/month",
          effort_hours: 8
        }
      },
      acronis: {
        services: [
          "Acronis Cyber Protect Cloud",
          "Immutable Storage"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Acronis for audit log system backup",
            "Enable immutable storage for retention",
            "Configure plans matching audit requirements",
            "Enable ransomware protection for backup data"
          ],
          verification: [
            "Verify backups complete",
            "Test restore"
          ],
          cost_estimate: "$3-10/workload/month",
          effort_hours: 4
        }
      }
    }
  },
  "CM.L2-3.4.1": {
    vuln_mgmt: {
      qualys: {
        services: [
          "Qualys VMDR",
          "Policy Compliance",
          "Global AssetView"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Cloud Agents on all CUI systems",
            "Configure Policy Compliance with CIS/STIG baselines",
            "Set up Global AssetView for asset inventory",
            "Create compliance policies mapping to NIST 800-171"
          ],
          verification: [
            "Verify agents on all CUI systems",
            "Review deviation reports"
          ],
          cost_estimate: "$25-60/asset/year",
          effort_hours: 24
        }
      },
      rapid7: {
        services: [
          "Rapid7 InsightVM",
          "InsightConnect",
          "InsightAgent"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy InsightAgent on all CUI systems",
            "Configure policy assessments for CIS/STIG baselines",
            "Set up asset groups and tagging for CUI systems",
            "Create remediation projects for baseline deviations"
          ],
          verification: [
            "Verify agents on all systems",
            "Review remediation progress"
          ],
          cost_estimate: "$20-50/asset/year",
          effort_hours: 20
        }
      }
    },
    rmm: {
      connectwise: {
        services: [
          "ConnectWise Automate",
          "Patch Management",
          "Scripting"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Automate agents for asset inventory",
            "Configure automated inventory collection",
            "Set up scripting for baseline configuration enforcement",
            "Create monitors for configuration drift detection"
          ],
          verification: [
            "Verify agents on all CUI systems",
            "Review drift alerts"
          ],
          cost_estimate: "$3-6/device/month",
          effort_hours: 12
        }
      }
    }
  },
  "CM.L2-3.4.2": {
    mdm_uem: {
      intune: {
        services: [
          "Intune Configuration Profiles",
          "Security Baselines",
          "Compliance Policies"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Intune Security Baselines for Windows endpoints",
            "Create custom configuration profiles for CUI-specific settings",
            "Configure compliance policies to detect non-compliant configs",
            "Set up Conditional Access to block non-compliant from CUI"
          ],
          verification: [
            "Verify baselines deploy to all devices",
            "Test Conditional Access blocks non-compliant"
          ],
          cost_estimate: "Included with M365 E3/E5",
          effort_hours: 16
        }
      }
    }
  },
  "CM.L2-3.4.5": {
    iam_pam: {
      okta: {
        services: [
          "Okta Workflows",
          "Okta Governance"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Workflows to enforce change management approval",
            "Set up Governance for access request and approval workflows",
            "Create policies requiring manager approval for CUI system access",
            "Enable audit logging for all access change events"
          ],
          verification: [
            "Verify approval workflows execute",
            "Confirm audit logs capture all changes"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 12
        }
      }
    }
  },
  "CM.L2-3.4.6": {
    xdr_edr: {
      crowdstrike: {
        services: [
          "Falcon Prevention Policies",
          "Falcon Firewall",
          "Device Control"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Prevention Policies to block unauthorized applications",
            "Enable Falcon Firewall to restrict unnecessary network services",
            "Set up device control to limit peripheral access",
            "Create IOA rules for unauthorized software detection"
          ],
          verification: [
            "Verify prevention policies block unauthorized apps",
            "Review IOA rule triggers"
          ],
          cost_estimate: "$15-25/endpoint/month",
          effort_hours: 12
        }
      }
    }
  },
  "CM.L2-3.4.8": {
    xdr_edr: {
      sentinelone: {
        services: [
          "SentinelOne Application Control"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Enable Application Control in enforcement mode (deny-by-default)",
            "Build application whitelist from baseline inventory",
            "Configure exception process for new approved applications",
            "Set up alerts for blocked execution attempts"
          ],
          verification: [
            "Verify deny-by-default active",
            "Review blocked execution reports"
          ],
          cost_estimate: "$6-12/endpoint/month",
          effort_hours: 16
        }
      }
    }
  },
  "IA.L2-3.5.1": {
    iam_pam: {
      okta: {
        services: [
          "Okta Universal Directory",
          "Okta SSO",
          "Device Trust"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Universal Directory as authoritative identity source",
            "Enable SSO for all CUI applications with SAML/OIDC",
            "Set up Device Trust to verify device identity before access",
            "Implement FastPass for passwordless device-bound authentication"
          ],
          verification: [
            "Verify all users in Universal Directory",
            "Confirm SSO covers all CUI apps"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 20
        }
      },
      jumpcloud: {
        services: [
          "JumpCloud Directory",
          "SSO",
          "Device Management"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy JumpCloud as cloud directory for user/device identification",
            "Configure SSO for all CUI applications",
            "Enable device management for device identity verification",
            "Set up conditional access based on device trust"
          ],
          verification: [
            "Verify all users and devices in JumpCloud",
            "Test conditional access"
          ],
          cost_estimate: "$7-15/user/month",
          effort_hours: 16
        }
      }
    }
  },
  "IA.L2-3.5.2": {
    iam_pam: {
      okta: {
        services: [
          "Okta MFA",
          "Okta Verify",
          "FastPass"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Enable MFA for all users with phishing-resistant factors (FIDO2, Okta Verify)",
            "Configure auth policies requiring MFA for CUI app access",
            "Set up FastPass for passwordless auth on managed devices",
            "Disable SMS/voice as MFA factors"
          ],
          verification: [
            "Verify MFA enabled for all users",
            "Confirm phishing-resistant factors enforced"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 8
        }
      },
      duo: {
        services: [
          "Cisco Duo MFA",
          "Duo Push",
          "Duo Passwordless"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Duo MFA across all CUI apps and VPN",
            "Configure Verified Duo Push (number matching)",
            "Enable Passwordless for FIDO2 security key auth",
            "Set up policies requiring MFA for all access types"
          ],
          verification: [
            "Verify Duo MFA on all CUI apps",
            "Test FIDO2 auth"
          ],
          cost_estimate: "$3-9/user/month",
          effort_hours: 8
        }
      }
    }
  },
  "IA.L2-3.5.3": {
    iam_pam: {
      okta: {
        services: [
          "Okta Adaptive MFA",
          "FIDO2"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Adaptive MFA with context-aware policies",
            "Require MFA for both local and network access to CUI",
            "Enable FIDO2 security keys as primary MFA factor",
            "Disable weak MFA methods (SMS, voice)"
          ],
          verification: [
            "Verify MFA on all CUI access",
            "Confirm FIDO2 enforced"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 8
        }
      },
      duo: {
        services: [
          "Cisco Duo",
          "Duo Trust Monitor"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Duo for local and network MFA",
            "Configure Verified Push for all users",
            "Enable Trust Monitor for anomalous auth detection",
            "Set up risk-based authentication policies"
          ],
          verification: [
            "Verify MFA on local and network access",
            "Confirm Trust Monitor active"
          ],
          cost_estimate: "$3-9/user/month",
          effort_hours: 8
        }
      }
    }
  },
  "IA.L2-3.5.7": {
    iam_pam: {
      keeper: {
        services: [
          "Keeper Vault",
          "Keeper Enterprise"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Keeper Vault with enforced password complexity policies",
            "Configure minimum password length per ODP requirements",
            "Enable BreachWatch for compromised password detection",
            "Set up password rotation reminders",
            "Configure Keeper admin console for policy enforcement"
          ],
          verification: [
            "Verify password policies enforced",
            "Confirm BreachWatch active"
          ],
          cost_estimate: "$4-8/user/month",
          effort_hours: 4
        }
      }
    }
  },
  "IA.L2-3.5.10": {
    iam_pam: {
      okta: {
        services: [
          "Okta Credential Management"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Okta password policies with encryption at rest",
            "Enable secure credential storage with AES-256 encryption",
            "Set up credential rotation policies for service accounts",
            "Configure audit logging for credential access events"
          ],
          verification: [
            "Verify credentials encrypted at rest",
            "Confirm rotation policies active"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 8
        }
      }
    }
  },
  "IR.L2-3.6.1": {
    soar: {
      cortex_xsoar: {
        services: [
          "Cortex XSOAR",
          "Marketplace"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy XSOAR for incident response workflow automation",
            "Configure incident classification and severity playbooks",
            "Set up automated enrichment for IOCs",
            "Create escalation workflows per incident type",
            "Enable case management for incident tracking"
          ],
          verification: [
            "Verify playbooks execute correctly",
            "Confirm case management tracks all incidents"
          ],
          cost_estimate: "$40,000-100,000/year",
          effort_hours: 32
        }
      },
      swimlane: {
        services: [
          "Swimlane SOAR",
          "Turbine"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Swimlane for low-code incident response automation",
            "Configure incident intake from SIEM and EDR",
            "Set up automated triage and enrichment workflows",
            "Create response playbooks for common incident types"
          ],
          verification: [
            "Verify incident intake working",
            "Confirm playbooks execute"
          ],
          cost_estimate: "$30,000-80,000/year",
          effort_hours: 24
        }
      }
    },
    itsm: {
      jira: {
        services: [
          "Jira Service Management",
          "Opsgenie"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure JSM for incident ticket management",
            "Set up Opsgenie for on-call alerting and escalation",
            "Create incident templates with required fields",
            "Configure SLA policies for incident response times",
            "Enable post-incident review workflows"
          ],
          verification: [
            "Verify incident tickets created automatically",
            "Confirm Opsgenie alerts on-call"
          ],
          cost_estimate: "$20-50/agent/month",
          effort_hours: 12
        }
      }
    }
  },
  "IR.L2-3.6.2": {
    siem: {
      splunk: {
        services: [
          "Splunk ES",
          "Splunk SOAR"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure ES notable events for incident detection",
            "Set up SOAR playbooks for automated incident response",
            "Create investigation dashboards for incident analysis",
            "Enable threat intelligence correlation for IOC enrichment"
          ],
          verification: [
            "Verify ES detects incidents",
            "Confirm SOAR playbooks execute"
          ],
          cost_estimate: "$15-50/GB/day + ES",
          effort_hours: 24
        }
      }
    }
  },
  "MA.L2-3.7.5": {
    iam_pam: {
      cyberark: {
        services: [
          "CyberArk Privileged Remote Access"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Privileged Remote Access for maintenance sessions",
            "Enable session recording for all remote maintenance",
            "Set up approval workflows for maintenance access",
            "Configure time-limited access windows",
            "Enable MFA for all maintenance sessions"
          ],
          verification: [
            "Verify session recordings captured",
            "Confirm time-limited access expires"
          ],
          cost_estimate: "$50-100/user/month",
          effort_hours: 16
        }
      },
      beyondtrust: {
        services: [
          "BeyondTrust Privileged Remote Access"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Privileged Remote Access for vendor maintenance sessions",
            "Enable session recording and monitoring",
            "Configure approval workflows for maintenance access",
            "Set up time-limited access with automatic revocation"
          ],
          verification: [
            "Verify session recordings",
            "Confirm access revoked after window"
          ],
          cost_estimate: "$30-60/user/month",
          effort_hours: 12
        }
      }
    }
  },
  "MP.L2-3.8.1": {
    dlp: {
      purview: {
        services: [
          "Microsoft Purview DLP",
          "Information Protection"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure sensitivity labels for CUI media classification",
            "Set up DLP policies to prevent CUI on unauthorized media",
            "Enable endpoint DLP for removable media control",
            "Configure auto-labeling for CUI content detection"
          ],
          verification: [
            "Review DLP policy matches",
            "Verify labels applied"
          ],
          cost_estimate: "Included with M365 E5/G5",
          effort_hours: 16
        }
      }
    }
  },
  "MP.L2-3.8.3": {
    dlp: {
      purview: {
        services: [
          "Microsoft Purview DLP",
          "Endpoint DLP"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Endpoint DLP to control CUI on removable media",
            "Set up policies requiring encryption for CUI on portable devices",
            "Enable DLP alerts for unauthorized CUI media transfer",
            "Configure exceptions for approved encrypted devices only"
          ],
          verification: [
            "Verify Endpoint DLP blocks unauthorized transfers",
            "Confirm encryption required"
          ],
          cost_estimate: "Included with M365 E5/G5",
          effort_hours: 12
        }
      }
    },
    xdr_edr: {
      sentinelone: {
        services: [
          "SentinelOne Device Control"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Device Control to block USB storage by default",
            "Create exceptions for approved encrypted USB devices only",
            "Set up alerts for USB connection attempts on CUI endpoints",
            "Monitor device connection events via Deep Visibility"
          ],
          verification: [
            "Verify USB blocked by default",
            "Confirm only approved devices allowed"
          ],
          cost_estimate: "$6-12/endpoint/month",
          effort_hours: 8
        }
      }
    }
  },
  "MP.L2-3.8.6": {
    backup: {
      veeam: {
        services: [
          "Veeam Backup & Replication",
          "Encryption"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Veeam encryption for all CUI backup media",
            "Enable AES-256 encryption for backup files at rest",
            "Set up encrypted backup copy jobs for offsite transport",
            "Configure key management for backup encryption keys"
          ],
          verification: [
            "Verify encryption enabled on all CUI backups",
            "Confirm key management procedures"
          ],
          cost_estimate: "$5-15/workload/month",
          effort_hours: 8
        }
      },
      druva: {
        services: [
          "Druva Data Protection",
          "Encryption"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Druva with encryption for CUI data at rest and in transit",
            "Enable immutable backups for CUI data protection",
            "Set up air-gapped backup copies for ransomware protection",
            "Configure compliance reports for encrypted backup verification"
          ],
          verification: [
            "Verify encryption on all backups",
            "Confirm immutability enabled"
          ],
          cost_estimate: "$3-8/user/month",
          effort_hours: 4
        }
      }
    }
  },
  "PE.L2-3.10.1": {
    physical_security: {
      verkada: {
        services: [
          "Verkada Security Cameras",
          "Access Control",
          "Guest Management"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Verkada cameras at CUI facility entry/exit points",
            "Configure Verkada Access Control for door access management",
            "Set up role-based access policies for CUI areas",
            "Enable guest management for visitor tracking",
            "Configure motion alerts for after-hours access to CUI areas"
          ],
          verification: [
            "Verify cameras cover all CUI entry points",
            "Confirm access policies enforced"
          ],
          cost_estimate: "$15-30/device/month",
          effort_hours: 16
        }
      },
      brivo: {
        services: [
          "Brivo Access Control",
          "Smart Spaces"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Brivo cloud-based access control for CUI facilities",
            "Configure access groups for CUI area authorization",
            "Set up time-based access schedules",
            "Enable audit logging for all door access events",
            "Configure mobile credentials for authorized personnel"
          ],
          verification: [
            "Verify access control on all CUI doors",
            "Review access logs"
          ],
          cost_estimate: "$10-25/door/month",
          effort_hours: 12
        }
      }
    }
  },
  "PS.L2-3.9.2": {
    iam_pam: {
      okta: {
        services: [
          "Okta Lifecycle Management",
          "Okta Workflows"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Okta Workflows for immediate account deactivation on termination",
            "Set up automated deprovisioning: disable account, revoke sessions, remove access",
            "Integrate with HR system for termination event triggers",
            "Configure audit trail for all termination-related access changes",
            "Set up verification workflow to confirm all access revoked"
          ],
          verification: [
            "Verify immediate deactivation on termination",
            "Confirm all sessions revoked"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 8
        }
      }
    }
  },
  "RA.L2-3.11.1": {
    vuln_mgmt: {
      qualys: {
        services: [
          "Qualys VMDR",
          "TotalCloud"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Qualys VMDR for continuous vulnerability assessment",
            "Configure automated scanning schedules for CUI systems",
            "Set up risk-based prioritization using QDS scores",
            "Create remediation workflows with SLA tracking",
            "Enable TotalCloud for cloud asset vulnerability management"
          ],
          verification: [
            "Verify all CUI systems scanned",
            "Review remediation SLA compliance"
          ],
          cost_estimate: "$25-60/asset/year",
          effort_hours: 20
        }
      },
      rapid7: {
        services: [
          "Rapid7 InsightVM",
          "InsightConnect"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy InsightVM for vulnerability scanning across CUI environment",
            "Configure risk-based prioritization using Real Risk Score",
            "Set up InsightConnect for automated remediation workflows",
            "Create dashboards for vulnerability trending"
          ],
          verification: [
            "Verify scanning covers all CUI systems",
            "Review risk score trends"
          ],
          cost_estimate: "$20-50/asset/year",
          effort_hours: 16
        }
      }
    }
  },
  "RA.L2-3.11.2": {
    vuln_mgmt: {
      qualys: {
        services: [
          "Qualys VMDR",
          "Patch Management"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Qualys for continuous vulnerability scanning per ODP frequency",
            "Set up automated patch deployment for critical vulnerabilities",
            "Create vulnerability remediation SLAs by severity",
            "Enable zero-day vulnerability alerting"
          ],
          verification: [
            "Verify scanning frequency meets ODP",
            "Confirm critical patches deployed within SLA"
          ],
          cost_estimate: "$25-60/asset/year",
          effort_hours: 16
        }
      }
    }
  },
  "CA.L2-3.12.1": {
    grc: {
      vanta: {
        services: [
          "Vanta Continuous Monitoring",
          "Compliance Automation"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Connect Vanta to all infrastructure and SaaS platforms",
            "Map NIST 800-171 controls to Vanta framework",
            "Enable continuous monitoring for control effectiveness",
            "Configure automated evidence collection for assessments",
            "Generate assessment-ready compliance reports"
          ],
          verification: [
            "Review Vanta control status",
            "Confirm evidence auto-collected"
          ],
          cost_estimate: "$5,000-15,000/year",
          effort_hours: 12
        }
      },
      drata: {
        services: [
          "Drata Compliance Automation",
          "Monitoring"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Integrate Drata with infrastructure and identity platforms",
            "Map NIST 800-171 controls to Drata framework",
            "Enable continuous monitoring and alerting",
            "Configure automated evidence collection"
          ],
          verification: [
            "Review control status dashboard",
            "Confirm monitoring active"
          ],
          cost_estimate: "$5,000-20,000/year",
          effort_hours: 12
        }
      },
      secureframe: {
        services: [
          "Secureframe Compliance",
          "Monitoring"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Secureframe with NIST 800-171 framework mapping",
            "Connect to cloud, identity, and endpoint platforms",
            "Enable continuous compliance monitoring",
            "Configure automated evidence collection and reporting"
          ],
          verification: [
            "Review compliance dashboard",
            "Confirm evidence collected"
          ],
          cost_estimate: "$5,000-15,000/year",
          effort_hours: 10
        }
      }
    }
  },
  "CA.L2-3.12.3": {
    vuln_mgmt: {
      tenable: {
        services: [
          "Tenable.io",
          "Nessus"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure continuous vulnerability monitoring for CUI systems",
            "Set up compliance scanning for configuration baselines",
            "Create dashboards for security control effectiveness",
            "Enable automated alerting for new critical vulnerabilities"
          ],
          verification: [
            "Verify continuous monitoring active",
            "Review control effectiveness reports"
          ],
          cost_estimate: "$30-65/asset/year",
          effort_hours: 16
        }
      }
    }
  },
  "SC.L2-3.13.1": {
    firewalls: {
      zscaler: {
        services: [
          "Zscaler Internet Access",
          "Private Access"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure ZIA for boundary protection of CUI communications",
            "Deploy ZPA for zero-trust internal CUI access",
            "Set up SSL inspection for encrypted traffic monitoring",
            "Enable threat prevention for inbound/outbound CUI traffic"
          ],
          verification: [
            "Verify ZIA policies enforce boundary protection",
            "Confirm ZPA segments CUI access"
          ],
          cost_estimate: "$8-20/user/month",
          effort_hours: 20
        }
      }
    },
    ndr: {
      darktrace: {
        services: [
          "Darktrace Enterprise",
          "RESPOND"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Darktrace sensors at CUI network boundaries",
            "Configure AI models for boundary anomaly detection",
            "Enable RESPOND for autonomous boundary threat response",
            "Set up Cyber AI Analyst for boundary incident investigation"
          ],
          verification: [
            "Review boundary anomaly alerts",
            "Verify RESPOND actions appropriate"
          ],
          cost_estimate: "$20,000-100,000/year",
          effort_hours: 16
        }
      }
    }
  },
  "SC.L2-3.13.4": {
    email_security: {
      proofpoint: {
        services: [
          "Proofpoint Email Protection",
          "Targeted Attack Protection"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Proofpoint for inbound/outbound email security",
            "Configure Targeted Attack Protection for advanced threat detection",
            "Set up URL defense for link rewriting and sandboxing",
            "Enable attachment sandboxing for malware detection",
            "Configure DMARC/DKIM/SPF enforcement"
          ],
          verification: [
            "Verify email filtering active",
            "Confirm TAP detects threats"
          ],
          cost_estimate: "$3-8/user/month",
          effort_hours: 12
        }
      },
      mimecast: {
        services: [
          "Mimecast Email Security",
          "Targeted Threat Protection"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Mimecast for email gateway security",
            "Configure Targeted Threat Protection for URL and attachment scanning",
            "Set up impersonation protection for executive accounts",
            "Enable DMARC management and enforcement"
          ],
          verification: [
            "Verify email security active",
            "Confirm TTP detects threats"
          ],
          cost_estimate: "$3-7/user/month",
          effort_hours: 12
        }
      },
      abnormal: {
        services: [
          "Abnormal Security",
          "Email Account Takeover Protection"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Abnormal Security for AI-based email threat detection",
            "Configure behavioral analysis for BEC and social engineering",
            "Set up account takeover protection for email accounts",
            "Enable automated remediation for detected threats"
          ],
          verification: [
            "Verify AI detection active",
            "Review threat detection accuracy"
          ],
          cost_estimate: "$4-10/user/month",
          effort_hours: 8
        }
      }
    }
  },
  "SC.L2-3.13.8": {
    firewalls: {
      zscaler: {
        services: [
          "Zscaler Internet Access",
          "SSL Inspection"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure ZIA with TLS 1.2+ enforcement for all CUI traffic",
            "Enable SSL inspection for encrypted traffic visibility",
            "Set up certificate pinning exceptions for approved services",
            "Configure crypto policy to block weak cipher suites"
          ],
          verification: [
            "Verify TLS 1.2+ enforced",
            "Confirm weak ciphers blocked"
          ],
          cost_estimate: "$8-20/user/month",
          effort_hours: 8
        }
      }
    }
  },
  "SC.L2-3.13.11": {
    dlp: {
      purview: {
        services: [
          "Microsoft Purview DLP",
          "Information Protection"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Purview sensitivity labels for CUI classification",
            "Set up DLP policies for CUI data at rest encryption enforcement",
            "Enable auto-labeling to detect and protect CUI",
            "Configure endpoint DLP for CUI data protection on devices"
          ],
          verification: [
            "Review DLP policy effectiveness",
            "Verify CUI labeled and protected"
          ],
          cost_estimate: "Included with M365 E5/G5",
          effort_hours: 16
        }
      },
      netskope: {
        services: [
          "Netskope DLP",
          "CASB"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Netskope DLP for CUI data protection in cloud apps",
            "Configure CASB policies for CUI access control",
            "Set up real-time DLP scanning for CUI patterns",
            "Enable coaching for users attempting unauthorized CUI sharing"
          ],
          verification: [
            "Review DLP scan results",
            "Verify CASB policies enforced"
          ],
          cost_estimate: "$10-25/user/month",
          effort_hours: 16
        }
      }
    }
  },
  "SC.L2-3.13.16": {
    dlp: {
      purview: {
        services: [
          "Microsoft Purview DLP",
          "Endpoint DLP"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure DLP policies to prevent CUI transmission at rest",
            "Set up endpoint DLP to block unauthorized CUI transfers",
            "Enable sensitivity labels with encryption for CUI at rest",
            "Configure DLP alerts for policy violations"
          ],
          verification: [
            "Verify DLP blocks unauthorized transfers",
            "Confirm encryption on CUI at rest"
          ],
          cost_estimate: "Included with M365 E5/G5",
          effort_hours: 12
        }
      }
    }
  },
  "SI.L2-3.14.1": {
    xdr_edr: {
      crowdstrike: {
        services: [
          "CrowdStrike Falcon Prevent",
          "Falcon Insight",
          "Falcon OverWatch"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Falcon sensor on all CUI endpoints",
            "Configure Falcon Prevent for next-gen AV protection",
            "Enable Falcon Insight for EDR visibility and response",
            "Subscribe to Falcon OverWatch for 24/7 managed threat hunting",
            "Set up automated response policies for critical threats"
          ],
          verification: [
            "Verify sensor on all CUI endpoints",
            "Confirm OverWatch active"
          ],
          cost_estimate: "$15-25/endpoint/month",
          effort_hours: 16
        }
      },
      huntress: {
        services: [
          "Huntress Managed EDR",
          "Huntress SOC"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Huntress agents on all CUI endpoints",
            "Enable managed EDR with 24/7 SOC monitoring",
            "Configure automated threat remediation",
            "Set up integration with RMM for response workflows"
          ],
          verification: [
            "Verify agents on all endpoints",
            "Confirm SOC monitoring active"
          ],
          cost_estimate: "$3-5/endpoint/month",
          effort_hours: 8
        }
      },
      sophos: {
        services: [
          "Sophos Intercept X",
          "Sophos MDR"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Intercept X on all CUI endpoints",
            "Enable deep learning malware detection",
            "Configure exploit prevention and ransomware protection",
            "Subscribe to Sophos MDR for managed detection and response"
          ],
          verification: [
            "Verify Intercept X on all endpoints",
            "Confirm MDR active"
          ],
          cost_estimate: "$3-8/endpoint/month",
          effort_hours: 8
        }
      }
    }
  },
  "SI.L2-3.14.2": {
    xdr_edr: {
      crowdstrike: {
        services: [
          "Falcon Prevent",
          "Falcon X",
          "Falcon Intelligence"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Falcon Prevent with latest threat intelligence",
            "Enable Falcon X for automated IOC analysis",
            "Set up Falcon Intelligence for threat feed integration",
            "Configure automated signature and behavioral updates"
          ],
          verification: [
            "Verify threat intelligence feeds active",
            "Confirm updates deploying"
          ],
          cost_estimate: "$15-25/endpoint/month",
          effort_hours: 8
        }
      }
    }
  },
  "SI.L2-3.14.4": {
    siem: {
      splunk: {
        services: [
          "Splunk ES",
          "Splunk UBA"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure ES for security event monitoring and alerting",
            "Enable UBA for behavioral anomaly detection",
            "Set up correlation searches for threat indicators",
            "Configure automated response for critical alerts"
          ],
          verification: [
            "Verify ES monitoring active",
            "Confirm UBA detecting anomalies"
          ],
          cost_estimate: "$15-50/GB/day",
          effort_hours: 20
        }
      }
    }
  },
  "SI.L2-3.14.6": {
    siem: {
      splunk: {
        services: [
          "Splunk ES",
          "Threat Intelligence Management"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure ES with threat intelligence feeds (STIX/TAXII)",
            "Set up automated IOC matching against log data",
            "Enable threat intelligence correlation for alert enrichment",
            "Create dashboards for threat landscape monitoring"
          ],
          verification: [
            "Verify threat feeds ingesting",
            "Confirm IOC matching active"
          ],
          cost_estimate: "$15-50/GB/day",
          effort_hours: 16
        }
      }
    }
  },
  "SI.L2-3.14.7": {
    ndr: {
      darktrace: {
        services: [
          "Darktrace Enterprise",
          "Cyber AI Analyst"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Darktrace for network traffic anomaly detection",
            "Configure AI models for unauthorized access pattern detection",
            "Enable Cyber AI Analyst for automated investigation",
            "Set up RESPOND for autonomous threat containment"
          ],
          verification: [
            "Review AI model alerts",
            "Verify RESPOND actions"
          ],
          cost_estimate: "$20,000-100,000/year",
          effort_hours: 16
        }
      },
      vectra: {
        services: [
          "Vectra AI Platform",
          "Detect"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Vectra for network detection and response",
            "Configure detection models for lateral movement and exfiltration",
            "Enable host and account scoring for threat prioritization",
            "Integrate with SOAR for automated response"
          ],
          verification: [
            "Review threat scores",
            "Verify detection models active"
          ],
          cost_estimate: "$15,000-80,000/year",
          effort_hours: 16
        }
      }
    }
  },
  "SC.L2-3.13.15": {
    secure_comms: {
      teams_gcc: {
        services: [
          "Microsoft Teams GCC High",
          "M365 GCC High"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Microsoft Teams in GCC High environment for CUI communications",
            "Configure DLP policies for Teams channels handling CUI",
            "Set up information barriers for CUI project isolation",
            "Enable meeting recording with encryption for CUI discussions",
            "Configure external sharing restrictions"
          ],
          verification: [
            "Verify GCC High tenant active",
            "Confirm DLP policies enforced in Teams"
          ],
          cost_estimate: "Included with M365 GCC High",
          effort_hours: 12
        }
      },
      slack_grid: {
        services: [
          "Slack Enterprise Grid",
          "Slack EKM"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Slack Enterprise Grid with Enterprise Key Management",
            "Configure DLP integrations for CUI content detection",
            "Set up workspace isolation for CUI projects",
            "Enable audit logging for all CUI channel activity",
            "Configure retention policies per compliance requirements"
          ],
          verification: [
            "Verify EKM active",
            "Confirm DLP scanning CUI channels"
          ],
          cost_estimate: "$12-25/user/month",
          effort_hours: 12
        }
      }
    }
  },
  "AC.L2-03.01.01": {
    iam_pam: {
      okta: {
        services: [
          "Okta Identity Cloud",
          "Okta Lifecycle Management",
          "Okta Workflows"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Okta Lifecycle Management with HR-driven provisioning",
            "Create group rules for automatic role assignment by department/title",
            "Set up Okta Workflows to disable accounts after ODP-defined inactivity",
            "Configure deprovisioning: disable → revoke sessions → remove groups → deactivate",
            "Forward Okta System Log to SIEM for account lifecycle audit trail",
            "Set up quarterly access certification via Okta Identity Governance"
          ],
          verification: [
            "Review Okta System Log for lifecycle events",
            "Verify deprovisioning workflows execute within SLA"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 24
        }
      },
      cyberark: {
        services: [
          "CyberArk Privilege Cloud",
          "Privileged Session Manager"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Onboard all privileged accounts into CyberArk Vault",
            "Configure automatic password rotation (30-day for service accounts)",
            "Set up Privileged Session Manager with full recording",
            "Create safe-level access controls mapping to org roles",
            "Enable alerts for privileged account changes outside CyberArk"
          ],
          verification: [
            "Verify all privileged accounts vaulted",
            "Confirm rotation on schedule"
          ],
          cost_estimate: "$50-100/privileged user/month",
          effort_hours: 40
        }
      },
      jumpcloud: {
        services: [
          "JumpCloud Directory Platform"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy JumpCloud as cloud directory for user lifecycle",
            "Configure SCIM provisioning to downstream apps",
            "Set up group policies for automatic access assignment",
            "Enable account suspension for inactivity",
            "Configure Directory Insights for audit logging"
          ],
          verification: [
            "Review Directory Insights",
            "Verify SCIM sync",
            "Confirm inactive accounts suspended"
          ],
          cost_estimate: "$7-15/user/month",
          effort_hours: 20
        }
      },
      duo: {
        services: [
          "Cisco Duo Access",
          "Duo Trust Monitor"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Integrate Duo with IdP for MFA on all account access",
            "Enable Trust Monitor for anomalous auth detection",
            "Set up policies to block inactive/disabled accounts",
            "Configure Auth Proxy for on-prem LDAP/RADIUS"
          ],
          verification: [
            "Review auth logs",
            "Verify Trust Monitor alerts triaged"
          ],
          cost_estimate: "$3-9/user/month",
          effort_hours: 12
        }
      }
    },
    xdr_edr: {
      crowdstrike: {
        services: [
          "Falcon Identity Threat Detection",
          "Falcon ITDR",
          "Falcon LogScale"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Falcon ITDR to monitor AD account changes",
            "Configure policies to alert on unauthorized account creation/modification",
            "Set up LogScale queries for account lifecycle events",
            "Create detection rules for dormant account reactivation",
            "Enable identity risk scoring for privileged accounts"
          ],
          verification: [
            "Review ITDR alerts",
            "Verify dormant account detection",
            "Confirm risk scores reviewed weekly"
          ],
          cost_estimate: "$15-25/endpoint/month",
          effort_hours: 16
        }
      },
      huntress: {
        services: [
          "Huntress Managed EDR",
          "Huntress Identity Threat Detection"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Huntress agents for unauthorized account creation monitoring",
            "Enable Identity Threat Detection for AD monitoring",
            "Configure Huntress SOC for 24/7 account event triage",
            "Integrate findings with RMM for remediation"
          ],
          verification: [
            "Review dashboard for account findings",
            "Verify SOC triage SLAs met"
          ],
          cost_estimate: "$3-5/endpoint/month",
          effort_hours: 8
        }
      }
    },
    siem: {
      splunk: {
        services: [
          "Splunk Cloud",
          "Splunk Enterprise Security"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Ingest AD/Entra ID account lifecycle logs",
            "Create correlation search: EventCode=4720 OR 4726 for account create/delete",
            "Build dashboard for account lifecycle trends",
            "Configure alert for inactive accounts re-enabled",
            "Set up scheduled report for accounts inactive beyond ODP period"
          ],
          verification: [
            "Verify logs ingesting < 5 min latency",
            "Confirm correlation searches firing"
          ],
          cost_estimate: "$15-50/GB/day",
          effort_hours: 20,
          splunk_queries: [
            {
              name: "Inactive Account Detection",
              query: "index=windows sourcetype=\"WinEventLog:Security\" EventCode=4624 | stats latest(_time) as last_logon by Account_Name | eval days_inactive=round((now()-last_logon)/86400,0) | where days_inactive > 35 | sort -days_inactive"
            },
            {
              name: "Account Lifecycle Events",
              query: "index=windows sourcetype=\"WinEventLog:Security\" (EventCode=4720 OR EventCode=4722 OR EventCode=4725 OR EventCode=4726) | eval action=case(EventCode=4720,\"Created\",EventCode=4722,\"Enabled\",EventCode=4725,\"Disabled\",EventCode=4726,\"Deleted\") | stats count by action, Account_Name"
            }
          ]
        }
      },
      sentinel: {
        services: [
          "Microsoft Sentinel",
          "Entra ID Audit Logs"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Enable Entra ID audit log connector in Sentinel",
            "Deploy analytics rule: Account created and deleted in short timeframe",
            "Create custom KQL for inactive account monitoring per ODP",
            "Configure automation rule to create ticket for unauthorized changes",
            "Build workbook for account lifecycle visualization"
          ],
          verification: [
            "Verify Entra logs flowing",
            "Confirm analytics rules generating incidents"
          ],
          cost_estimate: "$2.46/GB ingested",
          effort_hours: 16
        }
      },
      blumira: {
        services: [
          "Blumira SIEM",
          "Blumira Cloud Connectors"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Connect Blumira to AD/Entra ID",
            "Enable pre-built detection rules for account anomalies",
            "Configure automated response playbooks",
            "Set up weekly summary reports"
          ],
          verification: [
            "Verify connector healthy",
            "Confirm rules active"
          ],
          cost_estimate: "$3-7/user/month",
          effort_hours: 8
        }
      }
    },
    grc: {
      vanta: {
        services: [
          "Vanta Continuous Monitoring",
          "Vanta Access Reviews"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Connect Vanta to identity provider",
            "Enable continuous monitoring for account lifecycle",
            "Configure automated access reviews quarterly",
            "Set up tests for inactive/orphaned accounts and MFA"
          ],
          verification: [
            "Review Vanta dashboard for failing tests",
            "Confirm reviews complete on schedule"
          ],
          cost_estimate: "$5,000-15,000/year",
          effort_hours: 8
        }
      },
      drata: {
        services: [
          "Drata Compliance Automation",
          "Drata Access Reviews"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Integrate Drata with IdP and cloud platforms",
            "Map control to Drata framework",
            "Enable automated evidence collection",
            "Configure access review workflows with manager approval"
          ],
          verification: [
            "Review control status dashboard",
            "Confirm evidence auto-collected"
          ],
          cost_estimate: "$5,000-20,000/year",
          effort_hours: 8
        }
      }
    }
  },
  "AC.L2-03.01.02": {
    iam_pam: {
      okta: {
        services: [
          "Okta Access Gateway",
          "Okta Authorization Server"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Define authorization policies using group-based access rules",
            "Configure Authorization Server with custom scopes for CUI apps",
            "Implement Access Gateway for on-prem application enforcement",
            "Set up ABAC using Okta Expression Language"
          ],
          verification: [
            "Review policy evaluation logs",
            "Verify access gateway enforces CUI policies"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 20
        }
      },
      beyondtrust: {
        services: [
          "BeyondTrust Privilege Management",
          "Endpoint Privilege Management"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Endpoint Privilege Management for least-privilege on workstations",
            "Configure application control to restrict unauthorized software",
            "Set up privilege elevation for approved admin tasks only",
            "Enable session monitoring for elevated privilege usage"
          ],
          verification: [
            "Review elevation logs",
            "Verify app control blocks unauthorized apps"
          ],
          cost_estimate: "$30-60/endpoint/month",
          effort_hours: 24
        }
      }
    },
    xdr_edr: {
      crowdstrike: {
        services: [
          "Falcon Zero Trust Assessment",
          "Device Control",
          "Firewall Management"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Enable Falcon ZTA to score device compliance before access",
            "Configure Device Control to restrict USB/removable media on CUI systems",
            "Set up Firewall Management for CUI network segmentation",
            "Create host group policies based on device posture",
            "Integrate ZTA scores with conditional access in IdP"
          ],
          verification: [
            "Review ZTA scores across CUI endpoints",
            "Verify Device Control blocks unauthorized media"
          ],
          cost_estimate: "$15-25/endpoint/month",
          effort_hours: 20
        }
      }
    },
    dlp: {
      purview: {
        services: [
          "Microsoft Purview DLP",
          "Information Protection",
          "Data Classification"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Create CUI sensitivity labels in Purview Information Protection",
            "Configure DLP policies to enforce access controls on CUI-labeled content",
            "Set up auto-labeling for CUI based on content inspection",
            "Enable endpoint DLP to prevent unauthorized CUI transfer",
            "Configure DLP alerts with automated incident creation"
          ],
          verification: [
            "Review DLP policy match reports",
            "Verify labels applied to CUI"
          ],
          cost_estimate: "Included with M365 E5/G5",
          effort_hours: 24
        }
      },
      netskope: {
        services: [
          "Netskope CASB",
          "Netskope DLP",
          "Private Access"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy CASB to enforce access policies on cloud apps with CUI",
            "Configure DLP profiles with CUI patterns (ITAR, EAR, FOUO)",
            "Set up Private Access for zero-trust to on-prem CUI",
            "Enable real-time coaching for CUI sharing in unsanctioned apps"
          ],
          verification: [
            "Review CASB enforcement logs",
            "Verify DLP detects CUI patterns"
          ],
          cost_estimate: "$10-25/user/month",
          effort_hours: 20
        }
      }
    }
  },
  "AC.L2-03.01.03": {
    firewalls: {
      zscaler: {
        services: [
          "Zscaler Internet Access",
          "Zscaler Private Access",
          "Data Protection"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure ZIA policies to control outbound CUI data flows",
            "Deploy ZPA for zero-trust access to internal CUI resources",
            "Enable Data Protection to inspect CUI in transit",
            "Set up application segmentation in ZPA to restrict lateral CUI movement"
          ],
          verification: [
            "Review ZIA policy logs",
            "Verify ZPA segments isolate CUI apps"
          ],
          cost_estimate: "$8-20/user/month",
          effort_hours: 20
        }
      }
    },
    ndr: {
      darktrace: {
        services: [
          "Darktrace Enterprise Immune System",
          "RESPOND",
          "Cyber AI Analyst"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy sensors on CUI network segments to baseline normal flows",
            "Configure alerts on anomalous CUI data movement",
            "Enable RESPOND autonomous actions to block unauthorized exfiltration",
            "Set up Cyber AI Analyst for automated investigation"
          ],
          verification: [
            "Review model breach alerts for CUI segments",
            "Verify RESPOND actions appropriate"
          ],
          cost_estimate: "$20,000-100,000/year",
          effort_hours: 16
        }
      },
      vectra: {
        services: [
          "Vectra AI Platform",
          "Vectra Detect",
          "Vectra Recall"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy sensors to monitor CUI traffic for unauthorized flows",
            "Configure detection models for exfiltration and lateral movement",
            "Enable Recall for forensic analysis of historical CUI flows",
            "Set up host scoring to prioritize CUI system investigations"
          ],
          verification: [
            "Review threat scores for CUI hosts",
            "Verify models cover exfiltration scenarios"
          ],
          cost_estimate: "$15,000-80,000/year",
          effort_hours: 16
        }
      }
    },
    dlp: {
      code42: {
        services: [
          "Code42 Incydr",
          "Insider Risk Detection"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Incydr agents on CUI endpoints",
            "Configure file exposure detection for CUI file types",
            "Set up insider risk indicators for unauthorized CUI movement",
            "Enable automated response for high-risk CUI data flows"
          ],
          verification: [
            "Review Incydr exposure events",
            "Verify risk indicators calibrated"
          ],
          cost_estimate: "$8-15/user/month",
          effort_hours: 12
        }
      }
    }
  },
  "AC.L2-03.01.04": {
    iam_pam: {
      okta: {
        services: [
          "Okta Identity Governance",
          "Okta Group Management"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Define separation of duties matrix using conflicting group rules",
            "Configure Identity Governance to detect SoD violations",
            "Set up admin role separation: Super Admin, Org Admin, App Admin",
            "Enable access certifications that flag SoD conflicts",
            "Create Workflows to block provisioning creating SoD violations"
          ],
          verification: [
            "Review SoD violation reports",
            "Verify admin roles follow least-privilege"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 16
        }
      }
    },
    grc: {
      servicenow: {
        services: [
          "ServiceNow GRC",
          "Identity Governance"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Define SoD rules in ServiceNow GRC module",
            "Configure automated SoD conflict detection during provisioning",
            "Set up periodic SoD reviews with business owner approval",
            "Create SoD violation reports for compliance evidence"
          ],
          verification: [
            "Review SoD conflict reports",
            "Verify provisioning blocks violations"
          ],
          cost_estimate: "$50-100/user/month",
          effort_hours: 24
        }
      }
    }
  },
  "AC.L2-03.01.05": {
    iam_pam: {
      cyberark: {
        services: [
          "CyberArk Privilege Cloud",
          "Endpoint Privilege Manager",
          "Secure Web Sessions"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Endpoint Privilege Manager to remove local admin rights",
            "Configure JIT privilege elevation for approved admin tasks",
            "Set up Privilege Cloud with least-privilege safe access policies",
            "Enable Secure Web Sessions for cloud console access with recording",
            "Create privilege review workflows with automatic revocation"
          ],
          verification: [
            "Verify no standing local admin rights",
            "Confirm JIT requests logged and approved"
          ],
          cost_estimate: "$50-100/privileged user/month",
          effort_hours: 32
        }
      },
      delinea: {
        services: [
          "Delinea Secret Server",
          "Privilege Manager",
          "Server Suite"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Privilege Manager for endpoint least-privilege",
            "Configure application control to elevate only approved apps",
            "Set up Secret Server with role-based folder access",
            "Enable JIT access with time-limited grants"
          ],
          verification: [
            "Review elevation logs",
            "Verify Secret Server follows role-based policies"
          ],
          cost_estimate: "$30-70/user/month",
          effort_hours: 24
        }
      },
      keeper: {
        services: [
          "Keeper Vault",
          "Secrets Manager",
          "Connection Manager"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Keeper Vault with role-based folder structure",
            "Configure Secrets Manager for service account credential rotation",
            "Set up Connection Manager for secure RDP/SSH without exposing creds",
            "Enable enforcement policies: complexity, sharing restrictions, 2FA",
            "Configure BreachWatch for compromised credential monitoring"
          ],
          verification: [
            "Review audit logs for credential access",
            "Verify rotation executing"
          ],
          cost_estimate: "$4-8/user/month",
          effort_hours: 12
        }
      }
    },
    cspm: {
      wiz: {
        services: [
          "Wiz CIEM",
          "Wiz Cloud Security Platform"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Wiz CIEM to analyze effective cloud permissions",
            "Identify overly permissive IAM roles with identity graph",
            "Generate least-privilege recommendations for service accounts",
            "Set up rules to alert on privilege escalation paths"
          ],
          verification: [
            "Review CIEM findings",
            "Verify remediation reduces privilege scope"
          ],
          cost_estimate: "$30,000-100,000/year",
          effort_hours: 16
        }
      },
      prisma_cloud: {
        services: [
          "Prisma Cloud CIEM",
          "IAM Security",
          "Governance"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Enable IAM Security module for cloud identity analysis",
            "Configure net-effective permissions analysis",
            "Set up alerts for overly permissive IAM policies",
            "Create governance rules enforcing least-privilege"
          ],
          verification: [
            "Review IAM Security dashboard",
            "Verify governance rules enforced"
          ],
          cost_estimate: "$20,000-80,000/year",
          effort_hours: 16
        }
      }
    }
  },
  "AC.L2-03.01.06": {
    iam_pam: {
      cyberark: {
        services: [
          "CyberArk Privilege Cloud",
          "Identity Administration"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Inventory all privileged accounts and map to authorized personnel",
            "Onboard all privileged accounts into Vault with role-based safe access",
            "Configure checkout/approval for privileged account usage",
            "Set up dual-control approval for highest-privilege accounts",
            "Enable Privileged Threat Analytics for unauthorized privilege use"
          ],
          verification: [
            "Verify all privileged accounts vaulted",
            "Confirm checkout workflows function"
          ],
          cost_estimate: "$50-100/privileged user/month",
          effort_hours: 24
        }
      },
      beyondtrust: {
        services: [
          "BeyondTrust Password Safe",
          "Privileged Remote Access"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Password Safe to vault all privileged credentials",
            "Configure Privileged Remote Access for vendor/admin sessions with recording",
            "Set up approval workflows for privileged account checkout",
            "Enable session monitoring and recording"
          ],
          verification: [
            "Review checkout logs",
            "Verify session recordings retained"
          ],
          cost_estimate: "$30-60/user/month",
          effort_hours: 20
        }
      }
    }
  },
  "AC.L2-03.01.07": {
    iam_pam: {
      okta: {
        services: [
          "Okta Sign-On Policy",
          "ThreatInsight",
          "Behaviors"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Sign-On Policy with lockout after ODP-defined failures",
            "Set lockout duration per ODP requirements",
            "Enable ThreatInsight to block known malicious IPs",
            "Configure Behaviors for anomalous auth pattern detection"
          ],
          verification: [
            "Test lockout triggers after defined attempts",
            "Verify ThreatInsight blocks bad IPs"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 4
        }
      }
    }
  },
  "AC.L2-03.01.08": {
    iam_pam: {
      okta: {
        services: [
          "Okta Sign-On Policy",
          "ThreatInsight"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Sign-On Policy with lockout after ODP-defined consecutive failures",
            "Set lockout duration per ODP (e.g., 15 min or until admin unlock)",
            "Enable ThreatInsight to proactively block known malicious IPs",
            "Set up admin notifications for repeated lockout events"
          ],
          verification: [
            "Test lockout triggers",
            "Verify ThreatInsight blocks bad IPs"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 4
        }
      },
      duo: {
        services: [
          "Cisco Duo",
          "Duo Trust Monitor"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Duo lockout policy per ODP",
            "Enable Trust Monitor for credential stuffing detection",
            "Set up alerts for repeated failures",
            "Configure Auth Proxy for RADIUS/LDAP lockout"
          ],
          verification: [
            "Test lockout triggers",
            "Verify Trust Monitor detects brute-force"
          ],
          cost_estimate: "$3-9/user/month",
          effort_hours: 4
        }
      }
    },
    siem: {
      splunk: {
        services: [
          "Splunk Cloud",
          "Splunk ES"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Create correlation search for consecutive failed logons exceeding ODP",
            "Build dashboard for failed logon trends by user/source IP",
            "Configure notable event for brute-force with auto enrichment",
            "Set up adaptive response to disable account after threshold"
          ],
          verification: [
            "Verify correlation search fires on threshold",
            "Confirm adaptive response disables accounts"
          ],
          cost_estimate: "$15-50/GB/day",
          effort_hours: 8,
          splunk_queries: [
            {
              name: "Brute Force Detection",
              query: "index=windows sourcetype=\"WinEventLog:Security\" EventCode=4625 | bin _time span=15m | stats count by Account_Name, src_ip, _time | where count >= 3 | sort -count"
            }
          ]
        }
      }
    }
  },
  "AC.L2-03.01.10": {
    mdm_uem: {
      intune: {
        services: [
          "Microsoft Intune",
          "Configuration Profiles",
          "Compliance Policies"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Create Configuration Profile: screen lock timeout = ODP period",
            "Configure compliance policy requiring device lock with password/PIN",
            "Set up Conditional Access to block non-compliant devices from CUI",
            "Deploy profiles for Windows, macOS, iOS/Android"
          ],
          verification: [
            "Verify profiles deploy to all devices",
            "Test lock triggers after inactivity"
          ],
          cost_estimate: "Included with M365 E3/E5",
          effort_hours: 8
        }
      },
      jamf: {
        services: [
          "Jamf Pro",
          "Configuration Profiles",
          "Compliance Reporter"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Create profile with screen saver activation after ODP inactivity",
            "Configure password requirement on wake",
            "Deploy Compliance Reporter for verification",
            "Set up smart groups for non-compliant Macs"
          ],
          verification: [
            "Verify profile installed on all Macs",
            "Test screen lock activates"
          ],
          cost_estimate: "$4-8/device/month",
          effort_hours: 4
        }
      },
      kandji: {
        services: [
          "Kandji MDM",
          "Blueprints",
          "Compliance"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Blueprint with screen lock per ODP",
            "Enable auto-remediation to re-apply if user changes settings",
            "Set up compliance library for NIST screen lock requirements"
          ],
          verification: [
            "Verify Blueprint deploys",
            "Confirm auto-remediation works"
          ],
          cost_estimate: "$5-9/device/month",
          effort_hours: 4
        }
      }
    },
    rmm: {
      datto_rmm: {
        services: [
          "Datto RMM",
          "ComStore",
          "Monitoring"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy ComStore component for screen lock enforcement",
            "Configure monitoring for devices without screen lock",
            "Set up automated job to apply registry settings",
            "Create compliance report"
          ],
          verification: [
            "Verify component deploys",
            "Confirm monitoring detects non-compliant"
          ],
          cost_estimate: "$3-5/device/month",
          effort_hours: 4
        }
      }
    }
  },
  "AC.L2-03.01.12": {
    firewalls: {
      zscaler: {
        services: [
          "Zscaler Private Access",
          "Internet Access",
          "Client Connector"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Client Connector on all remote endpoints",
            "Configure ZPA application segments for CUI resources",
            "Set up device posture checks: OS, encryption, EDR agent",
            "Enable browser isolation for sensitive CUI web apps",
            "Configure ZIA for acceptable use enforcement"
          ],
          verification: [
            "Verify Client Connector on all remotes",
            "Confirm ZPA restricts to authorized CUI apps"
          ],
          cost_estimate: "$8-20/user/month",
          effort_hours: 20
        }
      }
    }
  },
  "AC.L2-03.01.13": {
    iam_pam: {
      okta: {
        services: [
          "Okta Adaptive MFA",
          "Okta Verify",
          "FIDO2"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Adaptive MFA with context-aware policies",
            "Require MFA for both local and network access to CUI",
            "Enable FIDO2 security keys as primary MFA factor",
            "Set up Okta Verify with biometric verification",
            "Disable SMS/voice as MFA factors (phishing-susceptible)"
          ],
          verification: [
            "Verify MFA on all CUI access",
            "Confirm phishing-resistant factors enforced"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 8
        }
      },
      duo: {
        services: [
          "Cisco Duo MFA",
          "Duo Push",
          "Duo Passwordless"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Duo MFA across all CUI apps and VPN",
            "Configure Verified Duo Push (number matching)",
            "Enable Duo Passwordless for FIDO2 authentication",
            "Set up policies requiring MFA for all access types"
          ],
          verification: [
            "Verify Duo MFA on all CUI apps",
            "Test FIDO2 authentication"
          ],
          cost_estimate: "$3-9/user/month",
          effort_hours: 8
        }
      }
    }
  },
  "AC.L2-03.01.16": {
    firewalls: {
      cisco: {
        services: [
          "Cisco Meraki Wireless",
          "Cisco ISE",
          "DNA Center"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure separate SSIDs for CUI and non-CUI wireless",
            "Enable 802.1X auth with Cisco ISE for CUI wireless",
            "Set up ISE posture assessment for wireless devices",
            "Configure Meraki wireless intrusion prevention",
            "Enable WPA3-Enterprise on CUI wireless network"
          ],
          verification: [
            "Verify 802.1X required for CUI SSID",
            "Confirm ISE posture checks block non-compliant"
          ],
          cost_estimate: "$10-30/AP/month",
          effort_hours: 16
        }
      }
    }
  },
  "AC.L2-03.01.18": {
    mdm_uem: {
      intune: {
        services: [
          "Microsoft Intune",
          "App Protection",
          "Conditional Access"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure device enrollment for all mobiles accessing CUI",
            "Create compliance policies: encryption, min OS, jailbreak detection",
            "Set up App Protection Policies for CUI apps without full enrollment",
            "Configure Conditional Access requiring compliant device",
            "Enable remote wipe for lost/stolen devices"
          ],
          verification: [
            "Verify all mobiles enrolled or have MAM",
            "Test remote wipe"
          ],
          cost_estimate: "Included with M365 E3/E5",
          effort_hours: 16
        }
      },
      jamf: {
        services: [
          "Jamf Pro",
          "Jamf Protect",
          "Jamf Connect"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Jamf Pro for iOS/iPadOS with supervised enrollment",
            "Configure Jamf Protect for mobile threat detection",
            "Set up restriction profiles: disable AirDrop, require encryption",
            "Enable Lost Mode and remote wipe"
          ],
          verification: [
            "Verify all Apple devices supervised",
            "Test Lost Mode and wipe"
          ],
          cost_estimate: "$4-8/device/month",
          effort_hours: 12
        }
      },
      workspace_one: {
        services: [
          "Workspace ONE UEM",
          "Access",
          "Intelligence"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy UEM for cross-platform mobile management",
            "Configure compliance policies for all platforms",
            "Set up Access for SSO with device trust",
            "Enable container encryption for CUI on mobile"
          ],
          verification: [
            "Verify all mobiles enrolled",
            "Confirm compliance enforces encryption"
          ],
          cost_estimate: "$5-12/device/month",
          effort_hours: 16
        }
      }
    }
  },
  "AC.L2-03.01.20": {
    xdr_edr: {
      crowdstrike: {
        services: [
          "Falcon Device Control",
          "USB Device Control"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Enable Falcon Device Control for USB/removable media management",
            "Create policies: block all USB storage, allow approved vendor IDs only",
            "Configure read-only exceptions for approved encrypted USBs",
            "Set up alerts for unauthorized USB attempts"
          ],
          verification: [
            "Verify block policy enforced",
            "Review unauthorized attempt alerts"
          ],
          cost_estimate: "$15-25/endpoint/month",
          effort_hours: 8
        }
      }
    }
  },
  "AC.L2-03.01.22": {
    dlp: {
      purview: {
        services: [
          "Microsoft Purview DLP",
          "Compliance Manager",
          "eDiscovery"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Purview DLP to scan public-facing SharePoint for CUI",
            "Set up auto-labeling to detect CUI in publicly accessible content",
            "Enable DLP alerts for CUI in public Teams channels",
            "Create eDiscovery searches to audit public content for CUI"
          ],
          verification: [
            "Review DLP matches for public content",
            "Verify auto-labeling detects CUI"
          ],
          cost_estimate: "Included with M365 E5/G5",
          effort_hours: 12
        }
      }
    }
  },
  "AT.L2-03.02.01": {
    security_awareness: {
      knowbe4: {
        services: [
          "KnowBe4 KMSAT",
          "PhishER",
          "Security Awareness Training"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy KMSAT with CUI-specific training modules",
            "Configure automated campaigns: new hire (immediate), recurring (quarterly)",
            "Set up phishing simulations with increasing difficulty",
            "Enable PhishER for automated phishing email triage",
            "Create custom content for CUI handling, insider threat, social engineering"
          ],
          verification: [
            "Review completion rates (target: 100%)",
            "Verify phishing click rates trending down"
          ],
          cost_estimate: "$15-25/user/year",
          effort_hours: 12
        }
      },
      ninjio: {
        services: [
          "Ninjio Security Awareness",
          "Phishing Simulator"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Ninjio with micro-learning episodes (3-4 min)",
            "Configure automated monthly delivery",
            "Set up phishing simulations aligned with training topics",
            "Enable compliance tracking for CMMC evidence"
          ],
          verification: [
            "Review episode completion rates",
            "Verify phishing results"
          ],
          cost_estimate: "$3-6/user/month",
          effort_hours: 4
        }
      }
    }
  },
  "AT.L2-03.02.02": {
    security_awareness: {
      knowbe4: {
        services: [
          "KnowBe4 KMSAT",
          "Role-Based Training",
          "Compliance Plus"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Create role-based groups: IT Admin, Security, Developers, Executives",
            "Assign role-specific modules (secure coding for devs, IR for security)",
            "Configure automated enrollment based on AD/Okta group membership",
            "Set up deadlines with escalation for non-completion"
          ],
          verification: [
            "Verify groups match org structure",
            "Review completion by role"
          ],
          cost_estimate: "$15-25/user/year",
          effort_hours: 8
        }
      }
    }
  },
  "AU.L2-03.03.01": {
    siem: {
      splunk: {
        services: [
          "Splunk Cloud",
          "Enterprise Security",
          "Add-ons"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Universal Forwarder to all CUI systems",
            "Configure sources: Windows Events, Linux syslog/auditd, network, cloud APIs",
            "Install Add-ons for AD, O365, AWS, Azure, Palo Alto, CrowdStrike",
            "Define index strategy: separate for security, app, network, cloud",
            "Configure retention matching ODP period",
            "Set up ES with CIM-compliant data models"
          ],
          verification: [
            "Verify all CUI systems forwarding",
            "Review retention meets ODP"
          ],
          cost_estimate: "$15-50/GB/day",
          effort_hours: 40,
          splunk_queries: [
            {
              name: "Log Source Inventory",
              query: "| tstats count where index=* by index, sourcetype, host | stats dc(host) as host_count, sum(count) as event_count by index, sourcetype | sort -event_count"
            }
          ]
        }
      },
      sentinel: {
        services: [
          "Microsoft Sentinel",
          "Azure Monitor",
          "Log Analytics"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Create Log Analytics Workspace in GCC High",
            "Enable connectors: Entra ID, M365 Defender, Azure Activity, Syslog, CEF",
            "Configure Azure Monitor diagnostics for all CUI resources",
            "Deploy AMA on all on-prem CUI servers",
            "Set up retention to match ODP (up to 730 days)"
          ],
          verification: [
            "Verify all connectors healthy",
            "Confirm AMA agents reporting"
          ],
          cost_estimate: "$2.46/GB ingested",
          effort_hours: 32
        }
      },
      sumo_logic: {
        services: [
          "Sumo Logic Cloud SIEM",
          "Log Analytics"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy collectors on all CUI systems",
            "Configure cloud-to-cloud integrations for SaaS sources",
            "Set up partitions for efficient querying and retention",
            "Enable Cloud SIEM for automated threat detection"
          ],
          verification: [
            "Verify collectors healthy",
            "Review SIEM detection coverage"
          ],
          cost_estimate: "$3-10/GB/day",
          effort_hours: 24
        }
      },
      blumira: {
        services: [
          "Blumira SIEM+XDR",
          "Cloud Connectors"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy sensors for on-prem log collection",
            "Configure cloud connectors for M365, Google, AWS, Azure",
            "Enable pre-built detection rules for NIST event types",
            "Set up automated response playbooks"
          ],
          verification: [
            "Verify all sources connected",
            "Confirm rules active"
          ],
          cost_estimate: "$3-7/user/month",
          effort_hours: 8
        }
      }
    }
  },
  "AU.L2-03.03.02": {
    siem: {
      splunk: {
        services: [
          "Splunk Cloud",
          "Enterprise Security"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure ES correlation searches for user activity monitoring",
            "Set up risk-based alerting to aggregate events into findings",
            "Create dashboards for security event trends",
            "Configure scheduled reports for audit review"
          ],
          verification: [
            "Review correlation search effectiveness",
            "Verify RBA scores calibrated"
          ],
          cost_estimate: "$15-50/GB/day",
          effort_hours: 20
        }
      }
    }
  },
  "AU.L2-03.03.03": {
    siem: {
      splunk: {
        services: [
          "Splunk ES",
          "ITSI",
          "Dashboard Studio"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure ES correlation searches for inappropriate activities per ODP",
            "Set up risk-based alerting (RBA) to aggregate events into findings",
            "Create executive dashboards for security posture trends",
            "Configure scheduled reports for weekly/monthly review"
          ],
          verification: [
            "Review correlation search effectiveness weekly",
            "Confirm reports delivered on time"
          ],
          cost_estimate: "$15-50/GB/day + ES license",
          effort_hours: 24,
          splunk_queries: [
            {
              name: "Unusual After-Hours Activity",
              query: "index=windows sourcetype=\"WinEventLog:Security\" EventCode=4624 Logon_Type=10 | eval hour=strftime(_time,\"%H\") | where hour < 6 OR hour > 22 | stats count by Account_Name, src_ip | where count > 3"
            },
            {
              name: "Data Exfiltration Indicators",
              query: "index=proxy OR index=firewall action=allowed bytes_out>10000000 | stats sum(bytes_out) as total_bytes by src_ip, dest_ip | eval total_MB=round(total_bytes/1048576,2) | where total_MB > 100 | sort -total_MB"
            }
          ]
        }
      }
    },
    soar: {
      cortex_xsoar: {
        services: [
          "Cortex XSOAR",
          "Marketplace",
          "TIM"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy XSOAR with SIEM integration for automated alert triage",
            "Install marketplace content packs for audit analysis playbooks",
            "Configure automated enrichment for suspicious indicators",
            "Set up war room for collaborative investigation"
          ],
          verification: [
            "Verify SIEM integration ingesting alerts",
            "Confirm playbooks execute correctly"
          ],
          cost_estimate: "$40,000-100,000/year",
          effort_hours: 32
        }
      },
      splunk_soar: {
        services: [
          "Splunk SOAR",
          "Playbooks",
          "Apps"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy SOAR integrated with Splunk ES",
            "Configure playbooks for notable event triage and enrichment",
            "Set up response actions: user disable, endpoint isolate, ticket creation",
            "Enable MTTD/MTTR reporting"
          ],
          verification: [
            "Verify SOAR receives ES notables",
            "Review MTTD/MTTR weekly"
          ],
          cost_estimate: "Included with ES Premium or $30,000+/year",
          effort_hours: 24
        }
      },
      tines: {
        services: [
          "Tines Security Automation",
          "Stories",
          "Cases"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Create stories for automated audit analysis workflows",
            "Configure SIEM webhook for real-time alert ingestion",
            "Build enrichment stories correlating with threat intel",
            "Set up Cases for tracking investigations"
          ],
          verification: [
            "Verify webhook receives alerts",
            "Review case management"
          ],
          cost_estimate: "Free community or $50,000+/year",
          effort_hours: 16
        }
      }
    }
  },
  "AU.L2-03.03.04": {
    siem: {
      splunk: {
        services: [
          "Splunk Monitoring Console",
          "Alerts"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Monitoring Console to track forwarder health",
            "Create alert: missing log sources (no events > 1 hour)",
            "Set up alert for index queue blocking",
            "Configure PagerDuty/Slack notifications for failures"
          ],
          verification: [
            "Verify monitoring tracks all forwarders",
            "Test alert fires when source goes silent"
          ],
          cost_estimate: "Included with Splunk",
          effort_hours: 8,
          splunk_queries: [
            {
              name: "Silent Log Sources",
              query: "| tstats latest(_time) as last_event by host | eval hours_silent=round((now()-last_event)/3600,1) | where hours_silent > 1 | sort -hours_silent"
            }
          ]
        }
      }
    },
    itsm: {
      jira: {
        services: [
          "Jira Service Management",
          "Automation",
          "Opsgenie"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure JSM to receive audit failure alerts from SIEM",
            "Set up Automation rules to escalate unacknowledged tickets",
            "Integrate Opsgenie for on-call alerting",
            "Create SLA policies (acknowledge within 15 min)"
          ],
          verification: [
            "Verify SIEM creates tickets on failure",
            "Confirm Opsgenie alerts on-call"
          ],
          cost_estimate: "$20-50/agent/month",
          effort_hours: 8
        }
      }
    }
  },
  "AU.L2-03.03.06": {
    rmm: {
      datto_rmm: {
        services: [
          "Datto RMM",
          "Monitoring"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy script to configure NTP on all managed endpoints",
            "Set authoritative time source per ODP",
            "Configure monitoring for NTP sync status",
            "Set up alerts for time drift exceeding threshold"
          ],
          verification: [
            "Verify NTP configured on all endpoints",
            "Confirm drift within range"
          ],
          cost_estimate: "$3-5/device/month",
          effort_hours: 4
        }
      }
    }
  },
  "AU.L2-03.03.07": {
    backup: {
      veeam: {
        services: [
          "Veeam Backup & Replication",
          "Immutable Backups",
          "Veeam ONE"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Veeam to back up SIEM/log storage with immutable copies",
            "Enable hardened repository with immutability",
            "Set up backup copy jobs to offsite/cloud",
            "Configure Veeam ONE monitoring for backup health",
            "Enable encryption for audit log backup data"
          ],
          verification: [
            "Verify immutable backups on schedule",
            "Test restore of audit logs"
          ],
          cost_estimate: "$5-15/workload/month",
          effort_hours: 8
        }
      },
      acronis: {
        services: [
          "Acronis Cyber Protect Cloud",
          "Immutable Storage"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Acronis for audit log system backup",
            "Enable immutable storage for retention",
            "Configure plans matching audit requirements",
            "Enable ransomware protection for backup data"
          ],
          verification: [
            "Verify backups complete",
            "Test restore"
          ],
          cost_estimate: "$3-10/workload/month",
          effort_hours: 4
        }
      }
    }
  },
  "CM.L2-03.04.01": {
    vuln_mgmt: {
      qualys: {
        services: [
          "Qualys VMDR",
          "Policy Compliance",
          "Global AssetView"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Cloud Agents on all CUI systems",
            "Configure Policy Compliance with CIS/STIG baselines",
            "Set up Global AssetView for asset inventory",
            "Create compliance policies mapping to NIST 800-171"
          ],
          verification: [
            "Verify agents on all CUI systems",
            "Review deviation reports"
          ],
          cost_estimate: "$25-60/asset/year",
          effort_hours: 24
        }
      },
      rapid7: {
        services: [
          "Rapid7 InsightVM",
          "InsightConnect",
          "InsightAgent"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy InsightAgent on all CUI systems",
            "Configure policy assessments for CIS/STIG baselines",
            "Set up asset groups and tagging for CUI systems",
            "Create remediation projects for baseline deviations"
          ],
          verification: [
            "Verify agents on all systems",
            "Review remediation progress"
          ],
          cost_estimate: "$20-50/asset/year",
          effort_hours: 20
        }
      }
    },
    rmm: {
      connectwise: {
        services: [
          "ConnectWise Automate",
          "Patch Management",
          "Scripting"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Automate agents for asset inventory",
            "Configure automated inventory collection",
            "Set up scripting for baseline configuration enforcement",
            "Create monitors for configuration drift detection"
          ],
          verification: [
            "Verify agents on all CUI systems",
            "Review drift alerts"
          ],
          cost_estimate: "$3-6/device/month",
          effort_hours: 12
        }
      }
    }
  },
  "CM.L2-03.04.02": {
    mdm_uem: {
      intune: {
        services: [
          "Intune Configuration Profiles",
          "Security Baselines",
          "Compliance Policies"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Intune Security Baselines for Windows endpoints",
            "Create custom configuration profiles for CUI-specific settings",
            "Configure compliance policies to detect non-compliant configs",
            "Set up Conditional Access to block non-compliant from CUI"
          ],
          verification: [
            "Verify baselines deploy to all devices",
            "Test Conditional Access blocks non-compliant"
          ],
          cost_estimate: "Included with M365 E3/E5",
          effort_hours: 16
        }
      }
    }
  },
  "CM.L2-03.04.05": {
    iam_pam: {
      okta: {
        services: [
          "Okta Workflows",
          "Okta Governance"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Workflows to enforce change management approval",
            "Set up Governance for access request and approval workflows",
            "Create policies requiring manager approval for CUI system access",
            "Enable audit logging for all access change events"
          ],
          verification: [
            "Verify approval workflows execute",
            "Confirm audit logs capture all changes"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 12
        }
      }
    }
  },
  "CM.L2-03.04.06": {
    xdr_edr: {
      crowdstrike: {
        services: [
          "Falcon Prevention Policies",
          "Falcon Firewall",
          "Device Control"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Prevention Policies to block unauthorized applications",
            "Enable Falcon Firewall to restrict unnecessary network services",
            "Set up device control to limit peripheral access",
            "Create IOA rules for unauthorized software detection"
          ],
          verification: [
            "Verify prevention policies block unauthorized apps",
            "Review IOA rule triggers"
          ],
          cost_estimate: "$15-25/endpoint/month",
          effort_hours: 12
        }
      }
    }
  },
  "CM.L2-03.04.08": {
    xdr_edr: {
      sentinelone: {
        services: [
          "SentinelOne Application Control"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Enable Application Control in enforcement mode (deny-by-default)",
            "Build application whitelist from baseline inventory",
            "Configure exception process for new approved applications",
            "Set up alerts for blocked execution attempts"
          ],
          verification: [
            "Verify deny-by-default active",
            "Review blocked execution reports"
          ],
          cost_estimate: "$6-12/endpoint/month",
          effort_hours: 16
        }
      }
    }
  },
  "IA.L2-03.05.01": {
    iam_pam: {
      okta: {
        services: [
          "Okta Universal Directory",
          "Okta SSO",
          "Device Trust"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Universal Directory as authoritative identity source",
            "Enable SSO for all CUI applications with SAML/OIDC",
            "Set up Device Trust to verify device identity before access",
            "Implement FastPass for passwordless device-bound authentication"
          ],
          verification: [
            "Verify all users in Universal Directory",
            "Confirm SSO covers all CUI apps"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 20
        }
      },
      jumpcloud: {
        services: [
          "JumpCloud Directory",
          "SSO",
          "Device Management"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy JumpCloud as cloud directory for user/device identification",
            "Configure SSO for all CUI applications",
            "Enable device management for device identity verification",
            "Set up conditional access based on device trust"
          ],
          verification: [
            "Verify all users and devices in JumpCloud",
            "Test conditional access"
          ],
          cost_estimate: "$7-15/user/month",
          effort_hours: 16
        }
      }
    }
  },
  "IA.L2-03.05.02": {
    iam_pam: {
      okta: {
        services: [
          "Okta MFA",
          "Okta Verify",
          "FastPass"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Enable MFA for all users with phishing-resistant factors (FIDO2, Okta Verify)",
            "Configure auth policies requiring MFA for CUI app access",
            "Set up FastPass for passwordless auth on managed devices",
            "Disable SMS/voice as MFA factors"
          ],
          verification: [
            "Verify MFA enabled for all users",
            "Confirm phishing-resistant factors enforced"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 8
        }
      },
      duo: {
        services: [
          "Cisco Duo MFA",
          "Duo Push",
          "Duo Passwordless"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Duo MFA across all CUI apps and VPN",
            "Configure Verified Duo Push (number matching)",
            "Enable Passwordless for FIDO2 security key auth",
            "Set up policies requiring MFA for all access types"
          ],
          verification: [
            "Verify Duo MFA on all CUI apps",
            "Test FIDO2 auth"
          ],
          cost_estimate: "$3-9/user/month",
          effort_hours: 8
        }
      }
    }
  },
  "IA.L2-03.05.03": {
    iam_pam: {
      okta: {
        services: [
          "Okta Adaptive MFA",
          "FIDO2"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Adaptive MFA with context-aware policies",
            "Require MFA for both local and network access to CUI",
            "Enable FIDO2 security keys as primary MFA factor",
            "Disable weak MFA methods (SMS, voice)"
          ],
          verification: [
            "Verify MFA on all CUI access",
            "Confirm FIDO2 enforced"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 8
        }
      },
      duo: {
        services: [
          "Cisco Duo",
          "Duo Trust Monitor"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Duo for local and network MFA",
            "Configure Verified Push for all users",
            "Enable Trust Monitor for anomalous auth detection",
            "Set up risk-based authentication policies"
          ],
          verification: [
            "Verify MFA on local and network access",
            "Confirm Trust Monitor active"
          ],
          cost_estimate: "$3-9/user/month",
          effort_hours: 8
        }
      }
    }
  },
  "IA.L2-03.05.07": {
    iam_pam: {
      keeper: {
        services: [
          "Keeper Vault",
          "Keeper Enterprise"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Keeper Vault with enforced password complexity policies",
            "Configure minimum password length per ODP requirements",
            "Enable BreachWatch for compromised password detection",
            "Set up password rotation reminders",
            "Configure Keeper admin console for policy enforcement"
          ],
          verification: [
            "Verify password policies enforced",
            "Confirm BreachWatch active"
          ],
          cost_estimate: "$4-8/user/month",
          effort_hours: 4
        }
      }
    }
  },
  "IA.L2-03.05.10": {
    iam_pam: {
      okta: {
        services: [
          "Okta Credential Management"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Okta password policies with encryption at rest",
            "Enable secure credential storage with AES-256 encryption",
            "Set up credential rotation policies for service accounts",
            "Configure audit logging for credential access events"
          ],
          verification: [
            "Verify credentials encrypted at rest",
            "Confirm rotation policies active"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 8
        }
      }
    }
  },
  "IR.L2-03.06.01": {
    soar: {
      cortex_xsoar: {
        services: [
          "Cortex XSOAR",
          "Marketplace"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy XSOAR for incident response workflow automation",
            "Configure incident classification and severity playbooks",
            "Set up automated enrichment for IOCs",
            "Create escalation workflows per incident type",
            "Enable case management for incident tracking"
          ],
          verification: [
            "Verify playbooks execute correctly",
            "Confirm case management tracks all incidents"
          ],
          cost_estimate: "$40,000-100,000/year",
          effort_hours: 32
        }
      },
      swimlane: {
        services: [
          "Swimlane SOAR",
          "Turbine"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Swimlane for low-code incident response automation",
            "Configure incident intake from SIEM and EDR",
            "Set up automated triage and enrichment workflows",
            "Create response playbooks for common incident types"
          ],
          verification: [
            "Verify incident intake working",
            "Confirm playbooks execute"
          ],
          cost_estimate: "$30,000-80,000/year",
          effort_hours: 24
        }
      }
    },
    itsm: {
      jira: {
        services: [
          "Jira Service Management",
          "Opsgenie"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure JSM for incident ticket management",
            "Set up Opsgenie for on-call alerting and escalation",
            "Create incident templates with required fields",
            "Configure SLA policies for incident response times",
            "Enable post-incident review workflows"
          ],
          verification: [
            "Verify incident tickets created automatically",
            "Confirm Opsgenie alerts on-call"
          ],
          cost_estimate: "$20-50/agent/month",
          effort_hours: 12
        }
      }
    }
  },
  "IR.L2-03.06.02": {
    siem: {
      splunk: {
        services: [
          "Splunk ES",
          "Splunk SOAR"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure ES notable events for incident detection",
            "Set up SOAR playbooks for automated incident response",
            "Create investigation dashboards for incident analysis",
            "Enable threat intelligence correlation for IOC enrichment"
          ],
          verification: [
            "Verify ES detects incidents",
            "Confirm SOAR playbooks execute"
          ],
          cost_estimate: "$15-50/GB/day + ES",
          effort_hours: 24
        }
      }
    }
  },
  "MA.L2-03.07.05": {
    iam_pam: {
      cyberark: {
        services: [
          "CyberArk Privileged Remote Access"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Privileged Remote Access for maintenance sessions",
            "Enable session recording for all remote maintenance",
            "Set up approval workflows for maintenance access",
            "Configure time-limited access windows",
            "Enable MFA for all maintenance sessions"
          ],
          verification: [
            "Verify session recordings captured",
            "Confirm time-limited access expires"
          ],
          cost_estimate: "$50-100/user/month",
          effort_hours: 16
        }
      },
      beyondtrust: {
        services: [
          "BeyondTrust Privileged Remote Access"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Privileged Remote Access for vendor maintenance sessions",
            "Enable session recording and monitoring",
            "Configure approval workflows for maintenance access",
            "Set up time-limited access with automatic revocation"
          ],
          verification: [
            "Verify session recordings",
            "Confirm access revoked after window"
          ],
          cost_estimate: "$30-60/user/month",
          effort_hours: 12
        }
      }
    }
  },
  "MP.L2-03.08.01": {
    dlp: {
      purview: {
        services: [
          "Microsoft Purview DLP",
          "Information Protection"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure sensitivity labels for CUI media classification",
            "Set up DLP policies to prevent CUI on unauthorized media",
            "Enable endpoint DLP for removable media control",
            "Configure auto-labeling for CUI content detection"
          ],
          verification: [
            "Review DLP policy matches",
            "Verify labels applied"
          ],
          cost_estimate: "Included with M365 E5/G5",
          effort_hours: 16
        }
      }
    }
  },
  "MP.L2-03.08.03": {
    dlp: {
      purview: {
        services: [
          "Microsoft Purview DLP",
          "Endpoint DLP"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Endpoint DLP to control CUI on removable media",
            "Set up policies requiring encryption for CUI on portable devices",
            "Enable DLP alerts for unauthorized CUI media transfer",
            "Configure exceptions for approved encrypted devices only"
          ],
          verification: [
            "Verify Endpoint DLP blocks unauthorized transfers",
            "Confirm encryption required"
          ],
          cost_estimate: "Included with M365 E5/G5",
          effort_hours: 12
        }
      }
    },
    xdr_edr: {
      sentinelone: {
        services: [
          "SentinelOne Device Control"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Device Control to block USB storage by default",
            "Create exceptions for approved encrypted USB devices only",
            "Set up alerts for USB connection attempts on CUI endpoints",
            "Monitor device connection events via Deep Visibility"
          ],
          verification: [
            "Verify USB blocked by default",
            "Confirm only approved devices allowed"
          ],
          cost_estimate: "$6-12/endpoint/month",
          effort_hours: 8
        }
      }
    }
  },
  "MP.L2-03.08.06": {
    backup: {
      veeam: {
        services: [
          "Veeam Backup & Replication",
          "Encryption"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Veeam encryption for all CUI backup media",
            "Enable AES-256 encryption for backup files at rest",
            "Set up encrypted backup copy jobs for offsite transport",
            "Configure key management for backup encryption keys"
          ],
          verification: [
            "Verify encryption enabled on all CUI backups",
            "Confirm key management procedures"
          ],
          cost_estimate: "$5-15/workload/month",
          effort_hours: 8
        }
      },
      druva: {
        services: [
          "Druva Data Protection",
          "Encryption"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Druva with encryption for CUI data at rest and in transit",
            "Enable immutable backups for CUI data protection",
            "Set up air-gapped backup copies for ransomware protection",
            "Configure compliance reports for encrypted backup verification"
          ],
          verification: [
            "Verify encryption on all backups",
            "Confirm immutability enabled"
          ],
          cost_estimate: "$3-8/user/month",
          effort_hours: 4
        }
      }
    }
  },
  "PE.L2-03.10.01": {
    physical_security: {
      verkada: {
        services: [
          "Verkada Security Cameras",
          "Access Control",
          "Guest Management"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Verkada cameras at CUI facility entry/exit points",
            "Configure Verkada Access Control for door access management",
            "Set up role-based access policies for CUI areas",
            "Enable guest management for visitor tracking",
            "Configure motion alerts for after-hours access to CUI areas"
          ],
          verification: [
            "Verify cameras cover all CUI entry points",
            "Confirm access policies enforced"
          ],
          cost_estimate: "$15-30/device/month",
          effort_hours: 16
        }
      },
      brivo: {
        services: [
          "Brivo Access Control",
          "Smart Spaces"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Brivo cloud-based access control for CUI facilities",
            "Configure access groups for CUI area authorization",
            "Set up time-based access schedules",
            "Enable audit logging for all door access events",
            "Configure mobile credentials for authorized personnel"
          ],
          verification: [
            "Verify access control on all CUI doors",
            "Review access logs"
          ],
          cost_estimate: "$10-25/door/month",
          effort_hours: 12
        }
      }
    }
  },
  "PS.L2-03.09.02": {
    iam_pam: {
      okta: {
        services: [
          "Okta Lifecycle Management",
          "Okta Workflows"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Okta Workflows for immediate account deactivation on termination",
            "Set up automated deprovisioning: disable account, revoke sessions, remove access",
            "Integrate with HR system for termination event triggers",
            "Configure audit trail for all termination-related access changes",
            "Set up verification workflow to confirm all access revoked"
          ],
          verification: [
            "Verify immediate deactivation on termination",
            "Confirm all sessions revoked"
          ],
          cost_estimate: "$6-15/user/month",
          effort_hours: 8
        }
      }
    }
  },
  "RA.L2-03.11.01": {
    vuln_mgmt: {
      qualys: {
        services: [
          "Qualys VMDR",
          "TotalCloud"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Qualys VMDR for continuous vulnerability assessment",
            "Configure automated scanning schedules for CUI systems",
            "Set up risk-based prioritization using QDS scores",
            "Create remediation workflows with SLA tracking",
            "Enable TotalCloud for cloud asset vulnerability management"
          ],
          verification: [
            "Verify all CUI systems scanned",
            "Review remediation SLA compliance"
          ],
          cost_estimate: "$25-60/asset/year",
          effort_hours: 20
        }
      },
      rapid7: {
        services: [
          "Rapid7 InsightVM",
          "InsightConnect"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy InsightVM for vulnerability scanning across CUI environment",
            "Configure risk-based prioritization using Real Risk Score",
            "Set up InsightConnect for automated remediation workflows",
            "Create dashboards for vulnerability trending"
          ],
          verification: [
            "Verify scanning covers all CUI systems",
            "Review risk score trends"
          ],
          cost_estimate: "$20-50/asset/year",
          effort_hours: 16
        }
      }
    }
  },
  "RA.L2-03.11.02": {
    vuln_mgmt: {
      qualys: {
        services: [
          "Qualys VMDR",
          "Patch Management"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Qualys for continuous vulnerability scanning per ODP frequency",
            "Set up automated patch deployment for critical vulnerabilities",
            "Create vulnerability remediation SLAs by severity",
            "Enable zero-day vulnerability alerting"
          ],
          verification: [
            "Verify scanning frequency meets ODP",
            "Confirm critical patches deployed within SLA"
          ],
          cost_estimate: "$25-60/asset/year",
          effort_hours: 16
        }
      }
    }
  },
  "CA.L2-03.12.01": {
    grc: {
      vanta: {
        services: [
          "Vanta Continuous Monitoring",
          "Compliance Automation"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Connect Vanta to all infrastructure and SaaS platforms",
            "Map NIST 800-171 controls to Vanta framework",
            "Enable continuous monitoring for control effectiveness",
            "Configure automated evidence collection for assessments",
            "Generate assessment-ready compliance reports"
          ],
          verification: [
            "Review Vanta control status",
            "Confirm evidence auto-collected"
          ],
          cost_estimate: "$5,000-15,000/year",
          effort_hours: 12
        }
      },
      drata: {
        services: [
          "Drata Compliance Automation",
          "Monitoring"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Integrate Drata with infrastructure and identity platforms",
            "Map NIST 800-171 controls to Drata framework",
            "Enable continuous monitoring and alerting",
            "Configure automated evidence collection"
          ],
          verification: [
            "Review control status dashboard",
            "Confirm monitoring active"
          ],
          cost_estimate: "$5,000-20,000/year",
          effort_hours: 12
        }
      },
      secureframe: {
        services: [
          "Secureframe Compliance",
          "Monitoring"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Secureframe with NIST 800-171 framework mapping",
            "Connect to cloud, identity, and endpoint platforms",
            "Enable continuous compliance monitoring",
            "Configure automated evidence collection and reporting"
          ],
          verification: [
            "Review compliance dashboard",
            "Confirm evidence collected"
          ],
          cost_estimate: "$5,000-15,000/year",
          effort_hours: 10
        }
      }
    }
  },
  "CA.L2-03.12.03": {
    vuln_mgmt: {
      tenable: {
        services: [
          "Tenable.io",
          "Nessus"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure continuous vulnerability monitoring for CUI systems",
            "Set up compliance scanning for configuration baselines",
            "Create dashboards for security control effectiveness",
            "Enable automated alerting for new critical vulnerabilities"
          ],
          verification: [
            "Verify continuous monitoring active",
            "Review control effectiveness reports"
          ],
          cost_estimate: "$30-65/asset/year",
          effort_hours: 16
        }
      }
    }
  },
  "SC.L2-03.13.01": {
    firewalls: {
      zscaler: {
        services: [
          "Zscaler Internet Access",
          "Private Access"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure ZIA for boundary protection of CUI communications",
            "Deploy ZPA for zero-trust internal CUI access",
            "Set up SSL inspection for encrypted traffic monitoring",
            "Enable threat prevention for inbound/outbound CUI traffic"
          ],
          verification: [
            "Verify ZIA policies enforce boundary protection",
            "Confirm ZPA segments CUI access"
          ],
          cost_estimate: "$8-20/user/month",
          effort_hours: 20
        }
      }
    },
    ndr: {
      darktrace: {
        services: [
          "Darktrace Enterprise",
          "RESPOND"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Darktrace sensors at CUI network boundaries",
            "Configure AI models for boundary anomaly detection",
            "Enable RESPOND for autonomous boundary threat response",
            "Set up Cyber AI Analyst for boundary incident investigation"
          ],
          verification: [
            "Review boundary anomaly alerts",
            "Verify RESPOND actions appropriate"
          ],
          cost_estimate: "$20,000-100,000/year",
          effort_hours: 16
        }
      }
    }
  },
  "SC.L2-03.13.04": {
    email_security: {
      proofpoint: {
        services: [
          "Proofpoint Email Protection",
          "Targeted Attack Protection"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Proofpoint for inbound/outbound email security",
            "Configure Targeted Attack Protection for advanced threat detection",
            "Set up URL defense for link rewriting and sandboxing",
            "Enable attachment sandboxing for malware detection",
            "Configure DMARC/DKIM/SPF enforcement"
          ],
          verification: [
            "Verify email filtering active",
            "Confirm TAP detects threats"
          ],
          cost_estimate: "$3-8/user/month",
          effort_hours: 12
        }
      },
      mimecast: {
        services: [
          "Mimecast Email Security",
          "Targeted Threat Protection"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Mimecast for email gateway security",
            "Configure Targeted Threat Protection for URL and attachment scanning",
            "Set up impersonation protection for executive accounts",
            "Enable DMARC management and enforcement"
          ],
          verification: [
            "Verify email security active",
            "Confirm TTP detects threats"
          ],
          cost_estimate: "$3-7/user/month",
          effort_hours: 12
        }
      },
      abnormal: {
        services: [
          "Abnormal Security",
          "Email Account Takeover Protection"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Abnormal Security for AI-based email threat detection",
            "Configure behavioral analysis for BEC and social engineering",
            "Set up account takeover protection for email accounts",
            "Enable automated remediation for detected threats"
          ],
          verification: [
            "Verify AI detection active",
            "Review threat detection accuracy"
          ],
          cost_estimate: "$4-10/user/month",
          effort_hours: 8
        }
      }
    }
  },
  "SC.L2-03.13.08": {
    firewalls: {
      zscaler: {
        services: [
          "Zscaler Internet Access",
          "SSL Inspection"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure ZIA with TLS 1.2+ enforcement for all CUI traffic",
            "Enable SSL inspection for encrypted traffic visibility",
            "Set up certificate pinning exceptions for approved services",
            "Configure crypto policy to block weak cipher suites"
          ],
          verification: [
            "Verify TLS 1.2+ enforced",
            "Confirm weak ciphers blocked"
          ],
          cost_estimate: "$8-20/user/month",
          effort_hours: 8
        }
      }
    }
  },
  "SC.L2-03.13.11": {
    dlp: {
      purview: {
        services: [
          "Microsoft Purview DLP",
          "Information Protection"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Purview sensitivity labels for CUI classification",
            "Set up DLP policies for CUI data at rest encryption enforcement",
            "Enable auto-labeling to detect and protect CUI",
            "Configure endpoint DLP for CUI data protection on devices"
          ],
          verification: [
            "Review DLP policy effectiveness",
            "Verify CUI labeled and protected"
          ],
          cost_estimate: "Included with M365 E5/G5",
          effort_hours: 16
        }
      },
      netskope: {
        services: [
          "Netskope DLP",
          "CASB"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Netskope DLP for CUI data protection in cloud apps",
            "Configure CASB policies for CUI access control",
            "Set up real-time DLP scanning for CUI patterns",
            "Enable coaching for users attempting unauthorized CUI sharing"
          ],
          verification: [
            "Review DLP scan results",
            "Verify CASB policies enforced"
          ],
          cost_estimate: "$10-25/user/month",
          effort_hours: 16
        }
      }
    }
  },
  "SC.L2-03.13.16": {
    dlp: {
      purview: {
        services: [
          "Microsoft Purview DLP",
          "Endpoint DLP"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure DLP policies to prevent CUI transmission at rest",
            "Set up endpoint DLP to block unauthorized CUI transfers",
            "Enable sensitivity labels with encryption for CUI at rest",
            "Configure DLP alerts for policy violations"
          ],
          verification: [
            "Verify DLP blocks unauthorized transfers",
            "Confirm encryption on CUI at rest"
          ],
          cost_estimate: "Included with M365 E5/G5",
          effort_hours: 12
        }
      }
    }
  },
  "SI.L2-03.14.01": {
    xdr_edr: {
      crowdstrike: {
        services: [
          "CrowdStrike Falcon Prevent",
          "Falcon Insight",
          "Falcon OverWatch"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Falcon sensor on all CUI endpoints",
            "Configure Falcon Prevent for next-gen AV protection",
            "Enable Falcon Insight for EDR visibility and response",
            "Subscribe to Falcon OverWatch for 24/7 managed threat hunting",
            "Set up automated response policies for critical threats"
          ],
          verification: [
            "Verify sensor on all CUI endpoints",
            "Confirm OverWatch active"
          ],
          cost_estimate: "$15-25/endpoint/month",
          effort_hours: 16
        }
      },
      huntress: {
        services: [
          "Huntress Managed EDR",
          "Huntress SOC"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Huntress agents on all CUI endpoints",
            "Enable managed EDR with 24/7 SOC monitoring",
            "Configure automated threat remediation",
            "Set up integration with RMM for response workflows"
          ],
          verification: [
            "Verify agents on all endpoints",
            "Confirm SOC monitoring active"
          ],
          cost_estimate: "$3-5/endpoint/month",
          effort_hours: 8
        }
      },
      sophos: {
        services: [
          "Sophos Intercept X",
          "Sophos MDR"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Intercept X on all CUI endpoints",
            "Enable deep learning malware detection",
            "Configure exploit prevention and ransomware protection",
            "Subscribe to Sophos MDR for managed detection and response"
          ],
          verification: [
            "Verify Intercept X on all endpoints",
            "Confirm MDR active"
          ],
          cost_estimate: "$3-8/endpoint/month",
          effort_hours: 8
        }
      }
    }
  },
  "SI.L2-03.14.02": {
    xdr_edr: {
      crowdstrike: {
        services: [
          "Falcon Prevent",
          "Falcon X",
          "Falcon Intelligence"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure Falcon Prevent with latest threat intelligence",
            "Enable Falcon X for automated IOC analysis",
            "Set up Falcon Intelligence for threat feed integration",
            "Configure automated signature and behavioral updates"
          ],
          verification: [
            "Verify threat intelligence feeds active",
            "Confirm updates deploying"
          ],
          cost_estimate: "$15-25/endpoint/month",
          effort_hours: 8
        }
      }
    }
  },
  "SI.L2-03.14.04": {
    siem: {
      splunk: {
        services: [
          "Splunk ES",
          "Splunk UBA"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure ES for security event monitoring and alerting",
            "Enable UBA for behavioral anomaly detection",
            "Set up correlation searches for threat indicators",
            "Configure automated response for critical alerts"
          ],
          verification: [
            "Verify ES monitoring active",
            "Confirm UBA detecting anomalies"
          ],
          cost_estimate: "$15-50/GB/day",
          effort_hours: 20
        }
      }
    }
  },
  "SI.L2-03.14.06": {
    siem: {
      splunk: {
        services: [
          "Splunk ES",
          "Threat Intelligence Management"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Configure ES with threat intelligence feeds (STIX/TAXII)",
            "Set up automated IOC matching against log data",
            "Enable threat intelligence correlation for alert enrichment",
            "Create dashboards for threat landscape monitoring"
          ],
          verification: [
            "Verify threat feeds ingesting",
            "Confirm IOC matching active"
          ],
          cost_estimate: "$15-50/GB/day",
          effort_hours: 16
        }
      }
    }
  },
  "SI.L2-03.14.07": {
    ndr: {
      darktrace: {
        services: [
          "Darktrace Enterprise",
          "Cyber AI Analyst"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Darktrace for network traffic anomaly detection",
            "Configure AI models for unauthorized access pattern detection",
            "Enable Cyber AI Analyst for automated investigation",
            "Set up RESPOND for autonomous threat containment"
          ],
          verification: [
            "Review AI model alerts",
            "Verify RESPOND actions"
          ],
          cost_estimate: "$20,000-100,000/year",
          effort_hours: 16
        }
      },
      vectra: {
        services: [
          "Vectra AI Platform",
          "Detect"
        ],
        fedrampStatus: "N/A",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Vectra for network detection and response",
            "Configure detection models for lateral movement and exfiltration",
            "Enable host and account scoring for threat prioritization",
            "Integrate with SOAR for automated response"
          ],
          verification: [
            "Review threat scores",
            "Verify detection models active"
          ],
          cost_estimate: "$15,000-80,000/year",
          effort_hours: 16
        }
      }
    }
  },
  "SC.L2-03.13.15": {
    secure_comms: {
      teams_gcc: {
        services: [
          "Microsoft Teams GCC High",
          "M365 GCC High"
        ],
        fedrampStatus: "High",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Microsoft Teams in GCC High environment for CUI communications",
            "Configure DLP policies for Teams channels handling CUI",
            "Set up information barriers for CUI project isolation",
            "Enable meeting recording with encryption for CUI discussions",
            "Configure external sharing restrictions"
          ],
          verification: [
            "Verify GCC High tenant active",
            "Confirm DLP policies enforced in Teams"
          ],
          cost_estimate: "Included with M365 GCC High",
          effort_hours: 12
        }
      },
      slack_grid: {
        services: [
          "Slack Enterprise Grid",
          "Slack EKM"
        ],
        fedrampStatus: "Moderate",
        assetType: "Security Protection Asset",
        implementation: {
          steps: [
            "Deploy Slack Enterprise Grid with Enterprise Key Management",
            "Configure DLP integrations for CUI content detection",
            "Set up workspace isolation for CUI projects",
            "Enable audit logging for all CUI channel activity",
            "Configure retention policies per compliance requirements"
          ],
          verification: [
            "Verify EKM active",
            "Confirm DLP scanning CUI channels"
          ],
          cost_estimate: "$12-25/user/month",
          effort_hours: 12
        }
      }
    }
  }
}
};

if (typeof window !== 'undefined') window.COMPREHENSIVE_GUIDANCE_SPA = COMPREHENSIVE_GUIDANCE_SPA;
console.log('[COMPREHENSIVE_GUIDANCE_SPA] Loaded - ' + Object.keys(COMPREHENSIVE_GUIDANCE_SPA.objectives).length + ' control entries');
