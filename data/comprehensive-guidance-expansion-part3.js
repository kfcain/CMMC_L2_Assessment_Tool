// Comprehensive Implementation Guidance - Part 3
// Remaining L1/L2 CMMC Assessment Objectives: IR, MA, MP, PE, PS, RE, SA, SC, SI

const COMPREHENSIVE_GUIDANCE_PART3 = {
    objectives: {
        
        "IR.L2-3.6.1": {
            objective: "Establish an operational incident-handling capability for organizational systems that includes preparation, detection, analysis, containment, recovery, and user response activities.",
            summary: "Incident response plan, IR team, playbooks, tools",
            implementation: {
                general: {"steps":["Develop incident response plan (IRP)","Establish incident response team with defined roles","Create incident response playbooks for common scenarios","Deploy incident response tools (SIEM, EDR, forensics)","Establish communication procedures","Define escalation paths","Document lessons learned process","Conduct annual IR plan review"],"effort_hours":40}
            },
            cloud: {
                aws: {"services":["Security Hub","GuardDuty","Detective","Systems Manager"],"implementation":{"steps":["Enable AWS Security Hub for centralized findings","Deploy GuardDuty for threat detection","Use Amazon Detective for investigation","Create EventBridge rules for automated response","Implement SNS for incident notifications","Use Systems Manager for containment actions","Document IR procedures in wiki"],"cost_estimate":"$100-500/month","effort_hours":24}},
                azure: {"services":["Sentinel","Defender","Logic Apps"],"implementation":{"steps":["Deploy Microsoft Sentinel as SIEM","Enable Defender for Cloud for detection","Create Sentinel playbooks for automated response","Configure incident creation rules","Implement Teams/email notifications","Use Azure Automation for containment","Document IR procedures"],"cost_estimate":"$200-800/month","effort_hours":24}},
                gcp: {"services":["Chronicle","Security Command Center","Cloud Functions"],"implementation":{"steps":["Use Chronicle SIEM for detection","Enable Security Command Center Premium","Create Cloud Functions for automated response","Configure alerting policies","Implement Pub/Sub for notifications","Document IR procedures"],"cost_estimate":"$500-2000/month","effort_hours":24}}
            },
            small_business: {
                approach: "Create basic IR plan, designate IR team members, use cloud provider security tools, document procedures in SharePoint",
                cost_estimate: "$0-200/month",
                effort_hours: 16
            },
            firewalls: {
                paloalto: {
                    services: ["Cortex XSOAR","WildFire","Threat Prevention"],
                    implementation: {"steps":["Configure Threat Prevention to automatically block known threats on CUI traffic","Enable WildFire for zero-day malware analysis on CUI zone traffic","Deploy Cortex XSOAR for automated incident response playbooks","Configure automated alerting for critical threat events","Set up log forwarding to SIEM for incident investigation","Create IR playbooks for common CUI security events"],"cost_estimate":"$5,000-20,000/year","effort_hours":16}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Storyline","RemoteOps","Vigilance MDR"],
                    implementation: {"steps":["Configure automated threat response: Kill, Quarantine, Remediate, Rollback","Use Storyline for attack visualization and root cause analysis","Enable RemoteOps for remote forensic investigation of CUI endpoints","Set up automated notification workflows for CUI endpoint incidents","Consider Vigilance MDR for 24/7 managed detection and response","Create STAR custom rules for CUI-specific incident scenarios"],"cost_estimate":"$5-18/endpoint/month","effort_hours":12}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne RMM","Remote Access","Scripting","Ticketing"],"implementation":{"steps":["Use NinjaOne remote access for rapid incident response on CUI endpoints","Deploy containment scripts via NinjaOne for isolation actions","Configure automated ticketing for security incidents","Use NinjaOne to isolate compromised endpoints","Maintain IR runbooks in NinjaOne Documentation"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Run emergency vulnerability scans on affected CUI systems during incidents","Identify attack surface and vulnerable systems post-incident","Scan for IOCs across CUI asset inventory","Generate post-incident vulnerability reports","Verify remediation with targeted follow-up scans"],"cost_estimate":"$30-65/asset/year","effort_hours":6}}
            }
        }
        
        ,
        
        "IR.L2-3.6.2": {
            objective: "Track, document, and report incidents to designated officials and/or authorities both internal and external to the organization.",
            summary: "Incident tracking system, reporting to management and authorities (FBI, CISA)",
            cloud: {
                aws: {"services":["Security Hub","Systems Manager"],"implementation":{"steps":["Use Security Hub for incident tracking","Create incident tickets in ServiceNow/Jira","Configure SNS notifications to management","Document reporting procedures for FBI/CISA","Maintain incident log in S3","Generate incident reports with QuickSight"],"cost_estimate":"$20-100/month","effort_hours":12}},
                azure: {"services":["Sentinel","DevOps"],"implementation":{"steps":["Use Sentinel incidents for tracking","Create work items in Azure DevOps","Configure email/Teams notifications","Document reporting procedures","Maintain incident log in Log Analytics","Generate reports with Power BI"],"cost_estimate":"$20-80/month","effort_hours":12}},
                gcp: {"services":["Chronicle","Cloud Logging"],"implementation":{"steps":["Use Chronicle for incident tracking","Create tickets in Jira/ServiceNow","Configure Pub/Sub notifications","Document reporting procedures","Maintain incident log in BigQuery","Generate reports with Data Studio"],"cost_estimate":"$20-100/month","effort_hours":12}}
            },
            process: {
                general: {"implementation":{"steps":["Create incident tracking spreadsheet/database","Define incident severity levels","Establish reporting timelines (72 hours for CUI incidents)","Identify reporting contacts (FBI, CISA, DIBNet)","Create incident report template","Document chain of custody procedures"],"effort_hours":8}}
            },
            small_business: {
                approach: "Use Excel/SharePoint for incident tracking, email notifications to management, document FBI/CISA reporting procedures",
                cost_estimate: "$0",
                effort_hours: 6
            },
            firewalls: {
                paloalto: {
                    services: ["Cortex XSOAR","WildFire","Threat Prevention"],
                    implementation: {"steps":["Configure Threat Prevention to automatically block known threats on CUI traffic","Enable WildFire for zero-day malware analysis on CUI zone traffic","Deploy Cortex XSOAR for automated incident response playbooks","Configure automated alerting for critical threat events","Set up log forwarding to SIEM for incident investigation","Create IR playbooks for common CUI security events"],"cost_estimate":"$5,000-20,000/year","effort_hours":16}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Storyline","RemoteOps","Vigilance MDR"],
                    implementation: {"steps":["Configure automated threat response: Kill, Quarantine, Remediate, Rollback","Use Storyline for attack visualization and root cause analysis","Enable RemoteOps for remote forensic investigation of CUI endpoints","Set up automated notification workflows for CUI endpoint incidents","Consider Vigilance MDR for 24/7 managed detection and response","Create STAR custom rules for CUI-specific incident scenarios"],"cost_estimate":"$5-18/endpoint/month","effort_hours":12}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne RMM","Remote Access","Scripting","Ticketing"],"implementation":{"steps":["Use NinjaOne remote access for rapid incident response on CUI endpoints","Deploy containment scripts via NinjaOne for isolation actions","Configure automated ticketing for security incidents","Use NinjaOne to isolate compromised endpoints","Maintain IR runbooks in NinjaOne Documentation"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Run emergency vulnerability scans on affected CUI systems during incidents","Identify attack surface and vulnerable systems post-incident","Scan for IOCs across CUI asset inventory","Generate post-incident vulnerability reports","Verify remediation with targeted follow-up scans"],"cost_estimate":"$30-65/asset/year","effort_hours":6}}
            }
        }
        
        ,
        
        "IR.L2-3.6.3": {
            objective: "Test the organizational incident response capability.",
            summary: "Annual IR tabletop exercises, test IR plan",
            implementation: {
                general: {"steps":["Conduct annual tabletop exercise","Test incident detection capabilities","Test incident response procedures","Test communication procedures","Test backup/recovery procedures","Document test results and lessons learned","Update IR plan based on test findings","Involve all IR team members in testing"],"effort_hours":16}
            },
            cloud: {
                aws: {"implementation":{"steps":["Simulate security incidents in test environment","Test GuardDuty detection","Test EventBridge automation","Test SNS notifications","Test containment procedures","Document test results","Update runbooks"],"cost_estimate":"$10-50/month (test environment)","effort_hours":12}},
                azure: {"implementation":{"steps":["Simulate security incidents in test environment","Test Sentinel detection rules","Test playbook automation","Test notification procedures","Test containment actions","Document test results","Update procedures"],"cost_estimate":"$10-50/month","effort_hours":12}},
                gcp: {"implementation":{"steps":["Simulate security incidents in test environment","Test Chronicle detection","Test Cloud Functions automation","Test alerting","Test containment procedures","Document test results"],"cost_estimate":"$10-50/month","effort_hours":12}}
            },
            small_business: {
                approach: "Conduct annual tabletop exercise with IR team, test key procedures, document lessons learned",
                cost_estimate: "$0",
                effort_hours: 8
            },
            firewalls: {
                paloalto: {
                    services: ["Cortex XSOAR","WildFire","Threat Prevention"],
                    implementation: {"steps":["Configure Threat Prevention to automatically block known threats on CUI traffic","Enable WildFire for zero-day malware analysis on CUI zone traffic","Deploy Cortex XSOAR for automated incident response playbooks","Configure automated alerting for critical threat events","Set up log forwarding to SIEM for incident investigation","Create IR playbooks for common CUI security events"],"cost_estimate":"$5,000-20,000/year","effort_hours":16}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Storyline","RemoteOps","Vigilance MDR"],
                    implementation: {"steps":["Configure automated threat response: Kill, Quarantine, Remediate, Rollback","Use Storyline for attack visualization and root cause analysis","Enable RemoteOps for remote forensic investigation of CUI endpoints","Set up automated notification workflows for CUI endpoint incidents","Consider Vigilance MDR for 24/7 managed detection and response","Create STAR custom rules for CUI-specific incident scenarios"],"cost_estimate":"$5-18/endpoint/month","effort_hours":12}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne RMM","Remote Access","Scripting","Ticketing"],"implementation":{"steps":["Use NinjaOne remote access for rapid incident response on CUI endpoints","Deploy containment scripts via NinjaOne for isolation actions","Configure automated ticketing for security incidents","Use NinjaOne to isolate compromised endpoints","Maintain IR runbooks in NinjaOne Documentation"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Run emergency vulnerability scans on affected CUI systems during incidents","Identify attack surface and vulnerable systems post-incident","Scan for IOCs across CUI asset inventory","Generate post-incident vulnerability reports","Verify remediation with targeted follow-up scans"],"cost_estimate":"$30-65/asset/year","effort_hours":6}}
            }
        }
        
        ,
        
        "MA.L2-3.7.1": {
            objective: "Perform maintenance on organizational systems.",
            summary: "Scheduled maintenance, patch management, preventive maintenance",
            cloud: {
                aws: {"services":["Systems Manager","Config"],"implementation":{"steps":["Use Systems Manager Patch Manager for automated patching","Create maintenance windows","Use Systems Manager Maintenance Windows","Document maintenance procedures","Track maintenance in change management system","Use AWS Config to verify patch compliance"],"cost_estimate":"$10-50/month","effort_hours":12}},
                azure: {"services":["Update Management","Automation"],"implementation":{"steps":["Use Azure Update Management for patching","Create maintenance schedules","Use Azure Automation for maintenance tasks","Document maintenance procedures","Track maintenance in Azure DevOps","Monitor compliance with Azure Policy"],"cost_estimate":"$10-40/month","effort_hours":12}},
                gcp: {"services":["OS Config","Cloud Scheduler"],"implementation":{"steps":["Use OS Config for patch management","Create maintenance schedules with Cloud Scheduler","Document maintenance procedures","Track maintenance in change management","Monitor compliance with organization policies"],"cost_estimate":"$10-40/month","effort_hours":12}}
            },
            small_business: {
                approach: "Enable automatic updates for Windows/cloud systems, schedule quarterly maintenance windows, document procedures",
                cost_estimate: "$0",
                effort_hours: 6
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Patch Management","Remote Access","Scheduling"],
                    implementation: {"steps":["Configure automated patch management with approval workflows for CUI systems","Schedule maintenance windows for CUI endpoint updates","Use remote access with MFA for authorized maintenance sessions","Deploy maintenance scripts for routine CUI system upkeep","Track all maintenance in NinjaOne ticketing","Enable session recording for remote maintenance on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}
                }
            },
            xdr_edr: {
                sentinelone: {"services":["Singularity Platform","Agent Updates"],"implementation":{"steps":["Configure automated agent updates with staged rollout for CUI endpoints","Schedule maintenance windows for major agent version upgrades","Monitor agent health and update status across CUI groups","Document all maintenance affecting CUI endpoint security posture"],"cost_estimate":"$5-12/endpoint/month","effort_hours":4}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Run pre-maintenance vulnerability scans to establish baseline","Run post-maintenance scans to verify patches applied successfully","Scan for new vulnerabilities introduced by maintenance","Verify configurations remain compliant after maintenance"],"cost_estimate":"$30-65/asset/year","effort_hours":4}}
            }
        }
        
        ,
        
        "MA.L2-3.7.2": {
            objective: "Provide controls on the tools, techniques, mechanisms, and personnel used to conduct system maintenance.",
            summary: "Approved maintenance tools, authorized personnel, maintenance logging",
            cloud: {
                aws: {"implementation":{"steps":["Maintain approved tools list","Restrict maintenance access with IAM","Use Systems Manager Session Manager for audited access","Log all maintenance activities in CloudTrail","Require MFA for maintenance access","Document authorized maintenance personnel"],"cost_estimate":"$0-20/month","effort_hours":8}},
                azure: {"implementation":{"steps":["Maintain approved tools list","Restrict maintenance access with RBAC","Use Azure Bastion for audited access","Log all maintenance in Activity Log","Require MFA for maintenance access","Document authorized personnel"],"cost_estimate":"$0-20/month","effort_hours":8}},
                gcp: {"implementation":{"steps":["Maintain approved tools list","Restrict maintenance access with IAM","Use IAP for audited access","Log all maintenance in Cloud Audit Logs","Require MFA for maintenance access","Document authorized personnel"],"cost_estimate":"$0-20/month","effort_hours":8}}
            },
            small_business: {
                approach: "Document approved maintenance tools, maintain list of authorized personnel, log maintenance activities",
                cost_estimate: "$0",
                effort_hours: 4
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Patch Management","Remote Access","Scheduling"],
                    implementation: {"steps":["Configure automated patch management with approval workflows for CUI systems","Schedule maintenance windows for CUI endpoint updates","Use remote access with MFA for authorized maintenance sessions","Deploy maintenance scripts for routine CUI system upkeep","Track all maintenance in NinjaOne ticketing","Enable session recording for remote maintenance on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}
                }
            },
            xdr_edr: {
                sentinelone: {"services":["Singularity Platform","Agent Updates"],"implementation":{"steps":["Configure automated agent updates with staged rollout for CUI endpoints","Schedule maintenance windows for major agent version upgrades","Monitor agent health and update status across CUI groups","Document all maintenance affecting CUI endpoint security posture"],"cost_estimate":"$5-12/endpoint/month","effort_hours":4}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Run pre-maintenance vulnerability scans to establish baseline","Run post-maintenance scans to verify patches applied successfully","Scan for new vulnerabilities introduced by maintenance","Verify configurations remain compliant after maintenance"],"cost_estimate":"$30-65/asset/year","effort_hours":4}}
            }
        }
        
        ,
        
        "MA.L2-3.7.3": {
            objective: "Ensure equipment removed for off-site maintenance is sanitized of any CUI.",
            summary: "Data sanitization before off-site repair, certificate of destruction",
            implementation: {
                general: {"steps":["Document equipment sanitization procedures","Use NIST SP 800-88 sanitization methods","Wipe drives with DoD 5220.22-M (3-pass minimum)","Use cryptographic erase for encrypted drives","Obtain certificate of sanitization","Document equipment serial numbers","Maintain sanitization log","Consider equipment destruction instead of repair for highly sensitive systems"],"effort_hours":6}
            },
            tools: {
                general: {"implementation":{"steps":["Use DBAN (Darik's Boot and Nuke) for hard drives","Use manufacturer secure erase tools","Use shred command on Linux","Use BitLocker secure erase on Windows","Document sanitization method used","Verify sanitization completion"],"effort_hours":4}}
            },
            small_business: {
                approach: "Use Windows BitLocker secure erase or DBAN before sending equipment for repair, document sanitization",
                cost_estimate: "$0",
                effort_hours: 3
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Patch Management","Remote Access","Scheduling"],
                    implementation: {"steps":["Configure automated patch management with approval workflows for CUI systems","Schedule maintenance windows for CUI endpoint updates","Use remote access with MFA for authorized maintenance sessions","Deploy maintenance scripts for routine CUI system upkeep","Track all maintenance in NinjaOne ticketing","Enable session recording for remote maintenance on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}
                }
            },
            xdr_edr: {
                sentinelone: {"services":["Singularity Platform","Agent Updates"],"implementation":{"steps":["Configure automated agent updates with staged rollout for CUI endpoints","Schedule maintenance windows for major agent version upgrades","Monitor agent health and update status across CUI groups","Document all maintenance affecting CUI endpoint security posture"],"cost_estimate":"$5-12/endpoint/month","effort_hours":4}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Run pre-maintenance vulnerability scans to establish baseline","Run post-maintenance scans to verify patches applied successfully","Scan for new vulnerabilities introduced by maintenance","Verify configurations remain compliant after maintenance"],"cost_estimate":"$30-65/asset/year","effort_hours":4}}
            }
        }
        
        ,
        
        "MA.L2-3.7.4": {
            objective: "Check media containing diagnostic and test programs for malicious code before the media are used in organizational systems.",
            summary: "Scan USB drives and diagnostic media with antivirus before use",
            cloud: {
                aws: {"implementation":{"steps":["Scan files with Amazon Inspector","Use GuardDuty for malware detection","Implement S3 malware scanning with Lambda","Use third-party antivirus (CrowdStrike, Trend Micro)","Document scanning procedures"],"cost_estimate":"$20-100/month","effort_hours":6}},
                azure: {"implementation":{"steps":["Use Microsoft Defender for Endpoint","Scan files before use","Implement Azure Storage malware scanning","Use Defender for Cloud Apps","Document scanning procedures"],"cost_estimate":"$10-50/month","effort_hours":6}},
                gcp: {"implementation":{"steps":["Use third-party antivirus integration","Scan files with Cloud Functions","Implement malware scanning for Cloud Storage","Document scanning procedures"],"cost_estimate":"$20-80/month","effort_hours":6}}
            },
            operating_system: {
                windows: {"implementation":{"steps":["Enable Windows Defender real-time protection","Scan USB drives automatically on insertion","Configure Group Policy to scan removable media","Update virus definitions daily"],"effort_hours":2}},
                linux: {"implementation":{"steps":["Install ClamAV antivirus","Configure automatic scanning of mounted media","Update virus definitions daily","Use udev rules to trigger scans on USB insertion"],"effort_hours":3}}
            },
            small_business: {
                approach: "Enable Windows Defender, scan all USB drives before use, update antivirus definitions regularly",
                cost_estimate: "$0",
                effort_hours: 2
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Patch Management","Remote Access","Scheduling"],
                    implementation: {"steps":["Configure automated patch management with approval workflows for CUI systems","Schedule maintenance windows for CUI endpoint updates","Use remote access with MFA for authorized maintenance sessions","Deploy maintenance scripts for routine CUI system upkeep","Track all maintenance in NinjaOne ticketing","Enable session recording for remote maintenance on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}
                }
            },
            xdr_edr: {
                sentinelone: {"services":["Singularity Platform","Agent Updates"],"implementation":{"steps":["Configure automated agent updates with staged rollout for CUI endpoints","Schedule maintenance windows for major agent version upgrades","Monitor agent health and update status across CUI groups","Document all maintenance affecting CUI endpoint security posture"],"cost_estimate":"$5-12/endpoint/month","effort_hours":4}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Run pre-maintenance vulnerability scans to establish baseline","Run post-maintenance scans to verify patches applied successfully","Scan for new vulnerabilities introduced by maintenance","Verify configurations remain compliant after maintenance"],"cost_estimate":"$30-65/asset/year","effort_hours":4}}
            }
        }
        
        ,
        
        "MA.L2-3.7.5": {
            objective: "Require multifactor authentication to establish nonlocal maintenance sessions via external network connections and terminate such connections when nonlocal maintenance is complete.",
            summary: "MFA for remote maintenance, auto-terminate sessions",
            cloud: {
                aws: {"services":["Systems Manager","SSO"],"implementation":{"steps":["Use Systems Manager Session Manager with MFA","Require AWS SSO with MFA for maintenance access","Configure session timeout (2 hours)","Terminate sessions automatically","Log all remote maintenance sessions","Monitor session duration"],"cost_estimate":"$0-10/month","effort_hours":6}},
                azure: {"services":["Bastion","PIM"],"implementation":{"steps":["Use Azure Bastion for remote access","Require PIM activation with MFA","Configure session timeout (2 hours)","Terminate sessions automatically","Log all remote maintenance","Monitor session duration"],"cost_estimate":"$140/month (Bastion)","effort_hours":6}},
                gcp: {"services":["IAP","Cloud Identity"],"implementation":{"steps":["Use Identity-Aware Proxy with MFA","Configure session timeout","Terminate sessions automatically","Log all remote maintenance","Monitor session duration"],"cost_estimate":"$0-10/month","effort_hours":6}}
            },
            network: {
                general: {"implementation":{"steps":["Require MFA for VPN access","Configure VPN session timeout (2 hours)","Terminate idle sessions (15 minutes)","Log all remote maintenance sessions","Monitor for unauthorized access"],"effort_hours":6}}
            },
            small_business: {
                approach: "Require MFA for VPN, configure session timeout, manually terminate sessions after maintenance",
                cost_estimate: "$0",
                effort_hours: 3
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Patch Management","Remote Access","Scheduling"],
                    implementation: {"steps":["Configure automated patch management with approval workflows for CUI systems","Schedule maintenance windows for CUI endpoint updates","Use remote access with MFA for authorized maintenance sessions","Deploy maintenance scripts for routine CUI system upkeep","Track all maintenance in NinjaOne ticketing","Enable session recording for remote maintenance on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}
                }
            },
            xdr_edr: {
                sentinelone: {"services":["Singularity Platform","Agent Updates"],"implementation":{"steps":["Configure automated agent updates with staged rollout for CUI endpoints","Schedule maintenance windows for major agent version upgrades","Monitor agent health and update status across CUI groups","Document all maintenance affecting CUI endpoint security posture"],"cost_estimate":"$5-12/endpoint/month","effort_hours":4}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Run pre-maintenance vulnerability scans to establish baseline","Run post-maintenance scans to verify patches applied successfully","Scan for new vulnerabilities introduced by maintenance","Verify configurations remain compliant after maintenance"],"cost_estimate":"$30-65/asset/year","effort_hours":4}}
            }
        }
        
        ,
        
        "MA.L2-3.7.6": {
            objective: "Supervise the maintenance activities of maintenance personnel without required access authorization.",
            summary: "Escort vendors during maintenance, monitor their activities",
            implementation: {
                general: {"steps":["Require escort for unauthorized maintenance personnel","Monitor all maintenance activities","Restrict access to only necessary systems","Log all maintenance activities","Review logs after maintenance completion","Require sign-in/sign-out procedures","Document supervision in maintenance log","Prohibit unescorted access to CUI systems"],"effort_hours":4}
            },
            cloud: {
                aws: {"implementation":{"steps":["Create temporary IAM users for vendors","Use CloudTrail to monitor vendor activities","Restrict vendor access with IAM policies","Require escort during cloud console access","Delete vendor accounts after maintenance","Review CloudTrail logs"],"cost_estimate":"$0","effort_hours":4}},
                azure: {"implementation":{"steps":["Create temporary Azure AD guest accounts","Monitor vendor activities with Activity Log","Restrict vendor access with RBAC","Require escort during portal access","Delete guest accounts after maintenance","Review Activity Log"],"cost_estimate":"$0","effort_hours":4}},
                gcp: {"implementation":{"steps":["Create temporary Cloud Identity accounts","Monitor vendor activities with Cloud Audit Logs","Restrict vendor access with IAM","Require escort during console access","Delete accounts after maintenance","Review audit logs"],"cost_estimate":"$0","effort_hours":4}}
            },
            small_business: {
                approach: "Escort vendors during all maintenance activities, document supervision in log, review activities after completion",
                cost_estimate: "$0",
                effort_hours: 2
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Patch Management","Remote Access","Scheduling"],
                    implementation: {"steps":["Configure automated patch management with approval workflows for CUI systems","Schedule maintenance windows for CUI endpoint updates","Use remote access with MFA for authorized maintenance sessions","Deploy maintenance scripts for routine CUI system upkeep","Track all maintenance in NinjaOne ticketing","Enable session recording for remote maintenance on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}
                }
            },
            xdr_edr: {
                sentinelone: {"services":["Singularity Platform","Agent Updates"],"implementation":{"steps":["Configure automated agent updates with staged rollout for CUI endpoints","Schedule maintenance windows for major agent version upgrades","Monitor agent health and update status across CUI groups","Document all maintenance affecting CUI endpoint security posture"],"cost_estimate":"$5-12/endpoint/month","effort_hours":4}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Run pre-maintenance vulnerability scans to establish baseline","Run post-maintenance scans to verify patches applied successfully","Scan for new vulnerabilities introduced by maintenance","Verify configurations remain compliant after maintenance"],"cost_estimate":"$30-65/asset/year","effort_hours":4}}
            }
        }
        
        ,
        
        "MP.L2-3.8.1": {
            objective: "Protect (i.e., physically control and securely store) system media containing CUI, both paper and digital.",
            summary: "Lock cabinets for paper CUI, encrypt digital media, physical security",
            implementation: {
                general: {"steps":["Store paper CUI in locked cabinets/rooms","Encrypt all digital media containing CUI","Implement check-in/check-out procedures","Use media tracking system","Restrict access to authorized personnel","Label all CUI media","Implement clean desk policy"],"effort_hours":8}
            },
            cloud: {
                aws: {"implementation":{"steps":["Enable S3 encryption at rest (SSE-S3 or SSE-KMS)","Use EBS encryption for volumes","Enable RDS encryption","Use AWS Backup with encryption","Implement S3 bucket policies to prevent unencrypted uploads"],"cost_estimate":"$0-50/month","effort_hours":6}},
                azure: {"implementation":{"steps":["Enable Storage encryption at rest","Use Azure Disk Encryption for VMs","Enable SQL Database encryption","Use Azure Backup with encryption","Implement storage policies to require encryption"],"cost_estimate":"$0-50/month","effort_hours":6}},
                gcp: {"implementation":{"steps":["Enable Cloud Storage encryption at rest (default)","Use disk encryption for Compute Engine","Enable Cloud SQL encryption","Use Cloud Backup with encryption"],"cost_estimate":"$0-50/month","effort_hours":6}}
            },
            small_business: {
                approach: "Lock filing cabinets for paper CUI, enable BitLocker on all computers, encrypt USB drives with BitLocker To Go",
                cost_estimate: "$0-200 (cabinets)",
                effort_hours: 4
            },
            xdr_edr: {
                sentinelone: {"services":["Device Control","Singularity XDR"],"implementation":{"steps":["Enable Device Control to block unauthorized USB/removable media on CUI endpoints","Create allowlists for approved removable media devices","Configure alerts for blocked removable media attempts","Monitor file transfers to removable media via Deep Visibility","Enable Firewall Control to prevent unauthorized network media transfers"],"cost_estimate":"$5-12/endpoint/month","effort_hours":6}}
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Backup"],"implementation":{"steps":["Use scripting to enforce USB device policies on CUI endpoints","Monitor for removable media connections on CUI systems","Configure NinjaOne Backup with encryption for CUI data","Audit BitLocker/FileVault encryption status on CUI endpoints","Script automated media sanitization verification"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus Compliance"],"implementation":{"steps":["Scan for encryption status on all CUI system drives","Audit USB/removable media policy enforcement","Verify media protection Group Policy settings","Scan for unauthorized file sharing services","Generate media protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":6}}
            }
        }
        
        ,
        
        "MP.L2-3.8.2": {
            objective: "Limit access to CUI on system media to authorized users.",
            summary: "Access controls on file shares, encrypted drives, need-to-know basis",
            cloud: {
                aws: {"implementation":{"steps":["Use S3 bucket policies to restrict access","Implement IAM policies for least privilege","Enable S3 Block Public Access","Use VPC endpoints for private access","Enable CloudTrail to monitor access","Use S3 Access Points for granular control"],"cost_estimate":"$0-20/month","effort_hours":8}},
                azure: {"implementation":{"steps":["Use Azure RBAC to restrict storage access","Implement SAS tokens for time-limited access","Disable public access to storage accounts","Use Private Endpoints","Enable Storage Analytics logging","Use Azure AD authentication for storage"],"cost_estimate":"$0-20/month","effort_hours":8}},
                gcp: {"implementation":{"steps":["Use Cloud Storage IAM to restrict access","Implement signed URLs for time-limited access","Disable public access to buckets","Use Private Google Access","Enable Cloud Storage audit logs"],"cost_estimate":"$0-20/month","effort_hours":8}}
            },
            operating_system: {
                windows: {"implementation":{"steps":["Use NTFS permissions to restrict file access","Implement share permissions","Use BitLocker with TPM for drive encryption","Enable auditing on CUI folders","Use Windows Information Protection (WIP)"],"effort_hours":6}},
                linux: {"implementation":{"steps":["Use file permissions (chmod) to restrict access","Implement ACLs for granular control","Use LUKS encryption for drives","Enable auditd for file access monitoring","Use SELinux for mandatory access control"],"effort_hours":6}}
            },
            small_business: {
                approach: "Use Windows file permissions to restrict access, enable BitLocker, implement need-to-know access",
                cost_estimate: "$0",
                effort_hours: 4
            },
            xdr_edr: {
                sentinelone: {"services":["Device Control","Singularity XDR"],"implementation":{"steps":["Enable Device Control to block unauthorized USB/removable media on CUI endpoints","Create allowlists for approved removable media devices","Configure alerts for blocked removable media attempts","Monitor file transfers to removable media via Deep Visibility","Enable Firewall Control to prevent unauthorized network media transfers"],"cost_estimate":"$5-12/endpoint/month","effort_hours":6}}
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Backup"],"implementation":{"steps":["Use scripting to enforce USB device policies on CUI endpoints","Monitor for removable media connections on CUI systems","Configure NinjaOne Backup with encryption for CUI data","Audit BitLocker/FileVault encryption status on CUI endpoints","Script automated media sanitization verification"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus Compliance"],"implementation":{"steps":["Scan for encryption status on all CUI system drives","Audit USB/removable media policy enforcement","Verify media protection Group Policy settings","Scan for unauthorized file sharing services","Generate media protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":6}}
            }
        }
        
        ,
        
        "MP.L2-3.8.3": {
            objective: "Sanitize or destroy system media containing CUI before disposal or release for reuse.",
            summary: "NIST SP 800-88 sanitization, certificate of destruction",
            implementation: {
                general: {"steps":["Use NIST SP 800-88 sanitization methods","Clear: overwrite with non-sensitive data","Purge: degauss or cryptographic erase","Destroy: shred, incinerate, or pulverize","Document sanitization method used","Obtain certificate of destruction for destroyed media","Maintain sanitization log"],"effort_hours":6}
            },
            tools: {
                software: {"implementation":{"steps":["Use DBAN for hard drive wiping","Use shred command on Linux","Use Eraser on Windows","Use manufacturer secure erase tools","Use BitLocker cryptographic erase","Verify sanitization completion"],"effort_hours":4}},
                physical: {"implementation":{"steps":["Use hard drive shredder for physical destruction","Use degausser for magnetic media","Use disintegrator for optical media","Contract with certified destruction vendor","Obtain certificate of destruction"],"effort_hours":2}}
            },
            cloud: {
                aws: {"implementation":{"steps":["Delete S3 objects with versioning disabled","Use S3 Object Lock for retention","Delete EBS volumes (AWS handles sanitization)","Delete RDS instances (AWS handles sanitization)","Document deletion in asset inventory"],"cost_estimate":"$0","effort_hours":3}},
                azure: {"implementation":{"steps":["Delete storage blobs","Delete managed disks (Azure handles sanitization)","Delete SQL databases (Azure handles sanitization)","Use soft delete for recovery period","Document deletion"],"cost_estimate":"$0","effort_hours":3}},
                gcp: {"implementation":{"steps":["Delete Cloud Storage objects","Delete persistent disks (GCP handles sanitization)","Delete Cloud SQL instances (GCP handles sanitization)","Document deletion"],"cost_estimate":"$0","effort_hours":3}}
            },
            small_business: {
                approach: "Use DBAN to wipe drives before disposal, contract with certified e-waste recycler for physical destruction",
                cost_estimate: "$50-200/year",
                effort_hours: 3
            },
            xdr_edr: {
                sentinelone: {"services":["Device Control","Singularity XDR"],"implementation":{"steps":["Enable Device Control to block unauthorized USB/removable media on CUI endpoints","Create allowlists for approved removable media devices","Configure alerts for blocked removable media attempts","Monitor file transfers to removable media via Deep Visibility","Enable Firewall Control to prevent unauthorized network media transfers"],"cost_estimate":"$5-12/endpoint/month","effort_hours":6}}
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Backup"],"implementation":{"steps":["Use scripting to enforce USB device policies on CUI endpoints","Monitor for removable media connections on CUI systems","Configure NinjaOne Backup with encryption for CUI data","Audit BitLocker/FileVault encryption status on CUI endpoints","Script automated media sanitization verification"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus Compliance"],"implementation":{"steps":["Scan for encryption status on all CUI system drives","Audit USB/removable media policy enforcement","Verify media protection Group Policy settings","Scan for unauthorized file sharing services","Generate media protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":6}}
            }
        }
        
        ,
        
        "MP.L2-3.8.4": {
            objective: "Mark media with necessary CUI markings and distribution limitations.",
            summary: "Label all CUI media with 'CUI' marking and handling instructions",
            implementation: {
                general: {"steps":["Label all paper CUI with 'Controlled Unclassified Information'","Include distribution limitations (e.g., 'NOFORN', 'FED ONLY')","Label digital media (USB drives, hard drives, backup tapes)","Use standardized CUI labels","Include destruction date if applicable","Document labeling procedures"],"effort_hours":4}
            },
            cloud: {
                aws: {"implementation":{"steps":["Tag S3 objects with 'CUI=true'","Tag EBS volumes with CUI classification","Use S3 Object Metadata for CUI markings","Implement S3 Inventory for CUI tracking","Use AWS Config to monitor CUI tagging"],"cost_estimate":"$0-10/month","effort_hours":4}},
                azure: {"implementation":{"steps":["Tag storage blobs with CUI classification","Tag managed disks with CUI metadata","Use Azure Information Protection labels","Implement Azure Policy to enforce tagging","Use Resource Graph to track CUI resources"],"cost_estimate":"$0-10/month","effort_hours":4}},
                gcp: {"implementation":{"steps":["Label Cloud Storage objects with CUI classification","Label persistent disks with CUI metadata","Use Cloud DLP for automatic CUI detection","Implement organization policies to enforce labeling"],"cost_estimate":"$0-10/month","effort_hours":4}}
            },
            small_business: {
                approach: "Use label maker to mark paper CUI, label USB drives with 'CUI' stickers, use file naming convention for digital CUI",
                cost_estimate: "$50-100 (label maker)",
                effort_hours: 3
            },
            xdr_edr: {
                sentinelone: {"services":["Device Control","Singularity XDR"],"implementation":{"steps":["Enable Device Control to block unauthorized USB/removable media on CUI endpoints","Create allowlists for approved removable media devices","Configure alerts for blocked removable media attempts","Monitor file transfers to removable media via Deep Visibility","Enable Firewall Control to prevent unauthorized network media transfers"],"cost_estimate":"$5-12/endpoint/month","effort_hours":6}}
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Backup"],"implementation":{"steps":["Use scripting to enforce USB device policies on CUI endpoints","Monitor for removable media connections on CUI systems","Configure NinjaOne Backup with encryption for CUI data","Audit BitLocker/FileVault encryption status on CUI endpoints","Script automated media sanitization verification"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus Compliance"],"implementation":{"steps":["Scan for encryption status on all CUI system drives","Audit USB/removable media policy enforcement","Verify media protection Group Policy settings","Scan for unauthorized file sharing services","Generate media protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":6}}
            }
        }
        
        ,
        
        "MP.L2-3.8.5": {
            objective: "Control access to media containing CUI and maintain accountability for media during transport outside of controlled areas.",
            summary: "Chain of custody, encrypted transport, courier service",
            implementation: {
                general: {"steps":["Use chain of custody forms for media transport","Encrypt all digital media before transport","Use locked containers for physical transport","Use approved courier service or hand-carry","Require signature on delivery","Track media location at all times","Document transport in media log"],"effort_hours":6}
            },
            cloud: {
                aws: {"implementation":{"steps":["Use AWS Snowball for large data transfers (encrypted)","Enable S3 Transfer Acceleration with TLS","Use AWS DataSync with encryption in transit","Use VPN or Direct Connect for data transfer","Log all data transfers in CloudTrail"],"cost_estimate":"$50-500/transfer","effort_hours":6}},
                azure: {"implementation":{"steps":["Use Azure Data Box for large transfers (encrypted)","Enable Storage encryption in transit (TLS)","Use Azure File Sync with encryption","Use VPN or ExpressRoute for data transfer","Log all transfers in Activity Log"],"cost_estimate":"$50-500/transfer","effort_hours":6}},
                gcp: {"implementation":{"steps":["Use Transfer Appliance for large transfers (encrypted)","Enable Cloud Storage encryption in transit (TLS)","Use Cloud VPN for data transfer","Log all transfers in Cloud Audit Logs"],"cost_estimate":"$50-500/transfer","effort_hours":6}}
            },
            small_business: {
                approach: "Use encrypted USB drives, hand-carry or use FedEx with signature required, maintain chain of custody log",
                cost_estimate: "$20-100/shipment",
                effort_hours: 4
            },
            xdr_edr: {
                sentinelone: {"services":["Device Control","Singularity XDR"],"implementation":{"steps":["Enable Device Control to block unauthorized USB/removable media on CUI endpoints","Create allowlists for approved removable media devices","Configure alerts for blocked removable media attempts","Monitor file transfers to removable media via Deep Visibility","Enable Firewall Control to prevent unauthorized network media transfers"],"cost_estimate":"$5-12/endpoint/month","effort_hours":6}}
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Backup"],"implementation":{"steps":["Use scripting to enforce USB device policies on CUI endpoints","Monitor for removable media connections on CUI systems","Configure NinjaOne Backup with encryption for CUI data","Audit BitLocker/FileVault encryption status on CUI endpoints","Script automated media sanitization verification"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus Compliance"],"implementation":{"steps":["Scan for encryption status on all CUI system drives","Audit USB/removable media policy enforcement","Verify media protection Group Policy settings","Scan for unauthorized file sharing services","Generate media protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":6}}
            }
        }
        
        ,
        
        "MP.L2-3.8.6": {
            objective: "Implement cryptographic mechanisms to protect the confidentiality of CUI stored on digital media during transport unless otherwise protected by alternative physical safeguards.",
            summary: "Encrypt all CUI on USB drives, laptops, backup tapes during transport",
            cloud: {
                aws: {"implementation":{"steps":["Use S3 encryption for data at rest and in transit","Enable EBS encryption","Use AWS Snowball with encryption","Enable TLS 1.2+ for all data transfers","Use AWS KMS for key management"],"cost_estimate":"$1-20/month","effort_hours":6}},
                azure: {"implementation":{"steps":["Enable Storage encryption at rest and in transit","Use Azure Disk Encryption","Use Azure Data Box with encryption","Enable TLS 1.2+ for all transfers","Use Azure Key Vault for key management"],"cost_estimate":"$1-20/month","effort_hours":6}},
                gcp: {"implementation":{"steps":["Enable Cloud Storage encryption at rest and in transit","Use disk encryption","Use Transfer Appliance with encryption","Enable TLS 1.2+ for all transfers","Use Cloud KMS for key management"],"cost_estimate":"$1-20/month","effort_hours":6}}
            },
            operating_system: {
                windows: {"implementation":{"steps":["Enable BitLocker on all laptops","Use BitLocker To Go for USB drives","Enable BitLocker for backup tapes","Store recovery keys in Azure AD or on-premises AD"],"effort_hours":4}},
                macos: {"implementation":{"steps":["Enable FileVault on all Macs","Encrypt external drives with FileVault","Store recovery keys securely"],"effort_hours":3}},
                linux: {"implementation":{"steps":["Use LUKS for full disk encryption","Encrypt external drives with LUKS","Use encrypted backup solutions"],"effort_hours":4}}
            },
            small_business: {
                approach: "Enable BitLocker on all Windows laptops, use BitLocker To Go for USB drives, encrypt backup tapes",
                cost_estimate: "$0",
                effort_hours: 4
            },
            xdr_edr: {
                sentinelone: {"services":["Device Control","Singularity XDR"],"implementation":{"steps":["Enable Device Control to block unauthorized USB/removable media on CUI endpoints","Create allowlists for approved removable media devices","Configure alerts for blocked removable media attempts","Monitor file transfers to removable media via Deep Visibility","Enable Firewall Control to prevent unauthorized network media transfers"],"cost_estimate":"$5-12/endpoint/month","effort_hours":6}}
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Backup"],"implementation":{"steps":["Use scripting to enforce USB device policies on CUI endpoints","Monitor for removable media connections on CUI systems","Configure NinjaOne Backup with encryption for CUI data","Audit BitLocker/FileVault encryption status on CUI endpoints","Script automated media sanitization verification"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus Compliance"],"implementation":{"steps":["Scan for encryption status on all CUI system drives","Audit USB/removable media policy enforcement","Verify media protection Group Policy settings","Scan for unauthorized file sharing services","Generate media protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":6}}
            }
        }
        
        ,
        
        "MP.L2-3.8.7": {
            objective: "Control the use of removable media on system components.",
            summary: "Disable USB ports or whitelist approved devices, DLP for removable media",
            cloud: {
                aws: {"implementation":{"steps":["Use Systems Manager to inventory removable media usage","Implement device control policies","Monitor USB device connections","Use AWS Config to detect policy violations"],"cost_estimate":"$10-30/month","effort_hours":8}},
                azure: {"implementation":{"steps":["Use Intune to control removable media","Implement device control policies","Use Defender for Endpoint to monitor USB usage","Block unauthorized devices","Enable Endpoint DLP for removable media"],"cost_estimate":"$0-50/month","effort_hours":8}},
                gcp: {"implementation":{"steps":["Use Chrome Enterprise for device control","Implement organization policies for USB devices","Monitor device connections","Block unauthorized devices"],"cost_estimate":"$0-30/month","effort_hours":8}}
            },
            operating_system: {
                windows: {"implementation":{"steps":["Use Group Policy to disable USB storage","Whitelist approved devices by serial number","Use Windows Defender Application Control","Monitor Event ID 6416 for USB connections","Use BitLocker To Go for approved devices"],"effort_hours":6}},
                linux: {"implementation":{"steps":["Blacklist usb-storage kernel module","Use udev rules to control USB devices","Monitor /var/log/messages for USB events","Use SELinux to restrict USB access"],"effort_hours":6}}
            },
            small_business: {
                approach: "Use Group Policy to disable USB storage, whitelist approved devices, use BitLocker To Go for approved USB drives",
                cost_estimate: "$0",
                effort_hours: 4
            },
            xdr_edr: {
                sentinelone: {"services":["Device Control","Singularity XDR"],"implementation":{"steps":["Enable Device Control to block unauthorized USB/removable media on CUI endpoints","Create allowlists for approved removable media devices","Configure alerts for blocked removable media attempts","Monitor file transfers to removable media via Deep Visibility","Enable Firewall Control to prevent unauthorized network media transfers"],"cost_estimate":"$5-12/endpoint/month","effort_hours":6}}
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Backup"],"implementation":{"steps":["Use scripting to enforce USB device policies on CUI endpoints","Monitor for removable media connections on CUI systems","Configure NinjaOne Backup with encryption for CUI data","Audit BitLocker/FileVault encryption status on CUI endpoints","Script automated media sanitization verification"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus Compliance"],"implementation":{"steps":["Scan for encryption status on all CUI system drives","Audit USB/removable media policy enforcement","Verify media protection Group Policy settings","Scan for unauthorized file sharing services","Generate media protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":6}}
            }
        }
        
        ,
        
        "MP.L2-3.8.8": {
            objective: "Prohibit the use of portable storage devices when such devices have no identifiable owner.",
            summary: "Ban unknown USB drives, require registration of approved devices",
            implementation: {
                general: {"steps":["Maintain registry of approved removable media","Require serial number registration","Label all approved devices with owner name","Prohibit use of unregistered devices","Implement technical controls to block unknown devices","Document device registration procedures"],"effort_hours":6}
            },
            cloud: {
                aws: {"implementation":{"steps":["Use Systems Manager to track registered devices","Implement device inventory","Monitor for unknown device connections","Alert on unregistered device usage"],"cost_estimate":"$5-20/month","effort_hours":6}},
                azure: {"implementation":{"steps":["Use Intune to maintain device inventory","Require device enrollment","Block unregistered devices","Monitor device compliance","Alert on unknown device connections"],"cost_estimate":"$0-30/month","effort_hours":6}},
                gcp: {"implementation":{"steps":["Maintain device inventory in spreadsheet","Use Chrome Enterprise for device management","Monitor device connections","Block unregistered devices"],"cost_estimate":"$0-20/month","effort_hours":6}}
            },
            small_business: {
                approach: "Maintain Excel list of approved USB drives with serial numbers and owners, block all other devices via Group Policy",
                cost_estimate: "$0",
                effort_hours: 4
            },
            xdr_edr: {
                sentinelone: {"services":["Device Control","Singularity XDR"],"implementation":{"steps":["Enable Device Control to block unauthorized USB/removable media on CUI endpoints","Create allowlists for approved removable media devices","Configure alerts for blocked removable media attempts","Monitor file transfers to removable media via Deep Visibility","Enable Firewall Control to prevent unauthorized network media transfers"],"cost_estimate":"$5-12/endpoint/month","effort_hours":6}}
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Backup"],"implementation":{"steps":["Use scripting to enforce USB device policies on CUI endpoints","Monitor for removable media connections on CUI systems","Configure NinjaOne Backup with encryption for CUI data","Audit BitLocker/FileVault encryption status on CUI endpoints","Script automated media sanitization verification"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus Compliance"],"implementation":{"steps":["Scan for encryption status on all CUI system drives","Audit USB/removable media policy enforcement","Verify media protection Group Policy settings","Scan for unauthorized file sharing services","Generate media protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":6}}
            }
        }
        
        ,
        
        "MP.L2-3.8.9": {
            objective: "Protect the confidentiality of backup CUI at storage locations.",
            summary: "Encrypt all backups, store in secure location, test restoration",
            cloud: {
                aws: {"services":["Backup","S3","Glacier"],"implementation":{"steps":["Use AWS Backup with encryption","Store backups in separate AWS account","Enable S3 versioning for backup buckets","Use S3 Object Lock for immutability","Enable MFA Delete","Test backup restoration quarterly","Use Glacier for long-term retention"],"cost_estimate":"$50-500/month","effort_hours":12}},
                azure: {"services":["Backup","Recovery Services"],"implementation":{"steps":["Use Azure Backup with encryption","Store backups in separate subscription","Enable soft delete for backups","Use immutable backup vaults","Enable MFA for backup deletion","Test restoration quarterly","Use Archive tier for long-term retention"],"cost_estimate":"$50-400/month","effort_hours":12}},
                gcp: {"services":["Cloud Backup","Cloud Storage"],"implementation":{"steps":["Use Cloud Backup with encryption","Store backups in separate project","Enable bucket retention policies","Use customer-managed encryption keys","Test restoration quarterly","Use Coldline/Archive for long-term retention"],"cost_estimate":"$50-400/month","effort_hours":12}}
            },
            operating_system: {
                windows: {"implementation":{"steps":["Use Windows Server Backup with BitLocker","Store backups on encrypted drives","Test restoration quarterly","Store backup media in locked safe","Maintain backup log"],"effort_hours":8}},
                linux: {"implementation":{"steps":["Use rsync with encryption","Use Bacula/Amanda with encryption","Store backups on encrypted drives","Test restoration quarterly","Store backup media securely"],"effort_hours":8}}
            },
            small_business: {
                approach: "Use cloud backup service with encryption (Backblaze, Carbonite), test restoration quarterly, store local backups in locked cabinet",
                cost_estimate: "$50-200/month",
                effort_hours: 6
            },
            xdr_edr: {
                sentinelone: {"services":["Device Control","Singularity XDR"],"implementation":{"steps":["Enable Device Control to block unauthorized USB/removable media on CUI endpoints","Create allowlists for approved removable media devices","Configure alerts for blocked removable media attempts","Monitor file transfers to removable media via Deep Visibility","Enable Firewall Control to prevent unauthorized network media transfers"],"cost_estimate":"$5-12/endpoint/month","effort_hours":6}}
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Backup"],"implementation":{"steps":["Use scripting to enforce USB device policies on CUI endpoints","Monitor for removable media connections on CUI systems","Configure NinjaOne Backup with encryption for CUI data","Audit BitLocker/FileVault encryption status on CUI endpoints","Script automated media sanitization verification"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus Compliance"],"implementation":{"steps":["Scan for encryption status on all CUI system drives","Audit USB/removable media policy enforcement","Verify media protection Group Policy settings","Scan for unauthorized file sharing services","Generate media protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":6}}
            }
        }
        
        ,
        
        "PE.L2-3.10.1": {
            objective: "Limit physical access to organizational systems, equipment, and the respective operating environments to authorized individuals.",
            summary: "Badge access, visitor logs, locked server rooms",
            implementation: {
                general: {"steps":["Implement badge access system","Maintain authorized personnel list","Lock server rooms and equipment closets","Require badge for building entry","Implement visitor sign-in procedures","Review access list quarterly"],"effort_hours":12}
            },
            cloud: {
                approach: "Cloud providers handle physical security (SOC 2 Type II certified data centers)",
                cost_estimate: "$0 (included)",
                effort_hours: 2
            },
            small_business: {
                approach: "Lock server room/closet, maintain key control log, implement visitor sign-in sheet",
                cost_estimate: "$200-1000 (locks)",
                effort_hours: 6
            },
            rmm: {
                ninjaone: {"services":["NinjaOne RMM","Monitoring","Documentation"],"implementation":{"steps":["Maintain physical asset inventory with location data in Documentation","Monitor CUI endpoint online/offline status for unauthorized removal","Configure alerts for CUI endpoints going offline unexpectedly","Track hardware serial numbers and warranty for CUI assets","Verify endpoint encryption before physical transport"],"cost_estimate":"$3-5/endpoint/month","effort_hours":4}}
            }
        }
        
        ,
        
        "PE.L2-3.10.2": {
            objective: "Protect and monitor the physical facility and support infrastructure for organizational systems.",
            summary: "Security cameras, UPS, fire suppression, environmental monitoring",
            implementation: {
                general: {"steps":["Install security cameras","Implement UPS for power protection","Install fire suppression system","Monitor temperature and humidity","Implement water leak detection","Maintain HVAC systems","Test backup power quarterly"],"effort_hours":20}
            },
            cloud: {
                approach: "Cloud providers handle facility protection and monitoring",
                cost_estimate: "$0 (included)",
                effort_hours: 2
            },
            small_business: {
                approach: "Install security camera for server room, use UPS for servers, monitor temperature, maintain fire extinguisher",
                cost_estimate: "$500-2000",
                effort_hours: 8
            },
            rmm: {
                ninjaone: {"services":["NinjaOne RMM","Monitoring","Documentation"],"implementation":{"steps":["Maintain physical asset inventory with location data in Documentation","Monitor CUI endpoint online/offline status for unauthorized removal","Configure alerts for CUI endpoints going offline unexpectedly","Track hardware serial numbers and warranty for CUI assets","Verify endpoint encryption before physical transport"],"cost_estimate":"$3-5/endpoint/month","effort_hours":4}}
            }
        }
        
        ,
        
        "PE.L2-3.10.3": {
            objective: "Escort visitors and monitor visitor activity.",
            summary: "Visitor badges, escort requirements, activity monitoring",
            implementation: {
                general: {"steps":["Issue visitor badges","Require escort for all visitors","Maintain visitor log","Prohibit unescorted access to secure areas","Monitor visitor activity","Collect badges on departure"],"effort_hours":4}
            },
            cloud: {
                approach: "Cloud providers handle visitor management at data centers",
                cost_estimate: "$0 (included)",
                effort_hours: 1
            },
            small_business: {
                approach: "Maintain visitor sign-in sheet, escort visitors at all times, prohibit unescorted access to server room",
                cost_estimate: "$0-50 (visitor badges)",
                effort_hours: 2
            },
            rmm: {
                ninjaone: {"services":["NinjaOne RMM","Monitoring","Documentation"],"implementation":{"steps":["Maintain physical asset inventory with location data in Documentation","Monitor CUI endpoint online/offline status for unauthorized removal","Configure alerts for CUI endpoints going offline unexpectedly","Track hardware serial numbers and warranty for CUI assets","Verify endpoint encryption before physical transport"],"cost_estimate":"$3-5/endpoint/month","effort_hours":4}}
            }
        }
        
        ,
        
        "PE.L2-3.10.4": {
            objective: "Maintain audit logs of physical access.",
            summary: "Badge access logs, visitor logs, review quarterly",
            implementation: {
                general: {"steps":["Use badge system with logging","Maintain visitor logs","Review access logs quarterly","Investigate anomalies","Retain logs for 1 year minimum","Document access violations"],"effort_hours":6}
            },
            cloud: {
                approach: "Cloud providers maintain physical access logs (available on request)",
                cost_estimate: "$0 (included)",
                effort_hours: 1
            },
            small_business: {
                approach: "Maintain manual visitor log, document key access, review logs quarterly",
                cost_estimate: "$0",
                effort_hours: 3
            },
            rmm: {
                ninjaone: {"services":["NinjaOne RMM","Monitoring","Documentation"],"implementation":{"steps":["Maintain physical asset inventory with location data in Documentation","Monitor CUI endpoint online/offline status for unauthorized removal","Configure alerts for CUI endpoints going offline unexpectedly","Track hardware serial numbers and warranty for CUI assets","Verify endpoint encryption before physical transport"],"cost_estimate":"$3-5/endpoint/month","effort_hours":4}}
            }
        }
        
        ,
        
        "PE.L2-3.10.5": {
            objective: "Control and manage physical access devices.",
            summary: "Badge management, key control, lock changes",
            implementation: {
                general: {"steps":["Maintain inventory of access devices (badges, keys)","Issue devices to authorized personnel only","Collect devices on termination","Change locks when keys are lost","Disable lost badges immediately","Audit device inventory quarterly"],"effort_hours":6}
            },
            cloud: {
                approach: "Cloud providers manage physical access devices",
                cost_estimate: "$0 (included)",
                effort_hours: 1
            },
            small_business: {
                approach: "Maintain key control log, collect keys on termination, change locks if keys lost",
                cost_estimate: "$100-500 (lock changes)",
                effort_hours: 3
            },
            rmm: {
                ninjaone: {"services":["NinjaOne RMM","Monitoring","Documentation"],"implementation":{"steps":["Maintain physical asset inventory with location data in Documentation","Monitor CUI endpoint online/offline status for unauthorized removal","Configure alerts for CUI endpoints going offline unexpectedly","Track hardware serial numbers and warranty for CUI assets","Verify endpoint encryption before physical transport"],"cost_estimate":"$3-5/endpoint/month","effort_hours":4}}
            }
        }
        
        ,
        
        "PE.L2-3.10.6": {
            objective: "Enforce safeguarding measures for CUI at alternate work sites.",
            summary: "Remote work security, home office requirements, VPN",
            implementation: {
                general: {"steps":["Document remote work security policy","Require VPN for remote access","Require encrypted laptops","Prohibit CUI on personal devices","Require secure home office (locked room/cabinet)","Provide security awareness training","Conduct periodic compliance checks"],"effort_hours":8}
            },
            cloud: {
                aws: {"implementation":{"steps":["Require AWS SSO with MFA for remote access","Use WorkSpaces for secure remote desktop","Implement VPN with MFA","Monitor remote access with CloudTrail"],"cost_estimate":"$25-75/user/month (WorkSpaces)","effort_hours":6}},
                azure: {"implementation":{"steps":["Require Azure AD with MFA for remote access","Use Azure Virtual Desktop for secure remote desktop","Implement VPN with MFA","Use Conditional Access for location-based policies"],"cost_estimate":"$25-75/user/month (AVD)","effort_hours":6}}
            },
            small_business: {
                approach: "Require VPN for remote access, enable BitLocker on laptops, prohibit printing CUI at home, require locked home office",
                cost_estimate: "$0-50/user/month",
                effort_hours: 4
            },
            rmm: {
                ninjaone: {"services":["NinjaOne RMM","Monitoring","Documentation"],"implementation":{"steps":["Maintain physical asset inventory with location data in Documentation","Monitor CUI endpoint online/offline status for unauthorized removal","Configure alerts for CUI endpoints going offline unexpectedly","Track hardware serial numbers and warranty for CUI assets","Verify endpoint encryption before physical transport"],"cost_estimate":"$3-5/endpoint/month","effort_hours":4}}
            }
        }
        
        ,
        
        "PS.L2-3.9.1": {
            objective: "Screen individuals prior to authorizing access to organizational systems containing CUI.",
            summary: "Background checks, security clearances, reference checks",
            implementation: {
                general: {"steps":["Conduct background checks for all employees with CUI access","Verify employment history","Check references","Conduct criminal background check","Verify education credentials","Document screening results","Re-screen every 5 years","Screen contractors and vendors"],"effort_hours":4}
            },
            process: {
                levels: {"basic":{"description":"Reference checks, employment verification","cost":"$50-100/person"},"moderate":{"description":"Criminal background check, credit check","cost":"$100-300/person"},"high":{"description":"Federal background investigation (SF-85/SF-86)","cost":"$3000-5000/person"}}
            },
            small_business: {
                approach: "Use background check service (Checkr, GoodHire), conduct reference checks, document results",
                cost_estimate: "$100-300/person",
                effort_hours: 2
            },
            rmm: {
                ninjaone: {"services":["NinjaOne RMM","Scripting","Documentation"],"implementation":{"steps":["Use NinjaOne to rapidly disable access for terminated personnel on CUI endpoints","Script automated account disabling triggered by HR termination","Maintain personnel-to-device mapping in Documentation","Configure alerts for login attempts by disabled accounts","Audit local account access after personnel changes"],"cost_estimate":"$3-5/endpoint/month","effort_hours":4}}
            },
            xdr_edr: {
                sentinelone: {"services":["Singularity XDR","ITDR"],"implementation":{"steps":["Monitor for credential use by terminated personnel via ITDR","Alert on authentication from devices assigned to departed employees","Audit file access by departing personnel before termination","Configure automated response for suspicious terminated user activity"],"cost_estimate":"$5-12/endpoint/month","effort_hours":4}}
            }
        }
        
        ,
        
        "PS.L2-3.9.2": {
            objective: "Ensure that organizational systems containing CUI are protected during and after personnel actions such as terminations and transfers.",
            summary: "Termination checklist, disable accounts immediately, collect equipment",
            implementation: {
                general: {"steps":["Create termination checklist","Disable accounts immediately on termination","Collect badges, keys, and equipment","Change passwords for shared accounts","Review access rights on transfer","Conduct exit interview","Document termination in HR system"],"effort_hours":6}
            },
            cloud: {
                aws: {"implementation":{"steps":["Disable IAM user immediately","Remove from AWS SSO","Review CloudTrail for final activities","Transfer ownership of resources","Remove MFA devices","Document in ticketing system"],"cost_estimate":"$0","effort_hours":2}},
                azure: {"implementation":{"steps":["Disable Azure AD account immediately","Remove from groups and roles","Review Activity Log for final activities","Transfer resource ownership","Remove MFA registration","Document in Azure DevOps"],"cost_estimate":"$0","effort_hours":2}},
                gcp: {"implementation":{"steps":["Disable Cloud Identity account immediately","Remove from groups and roles","Review Cloud Audit Logs","Transfer resource ownership","Remove 2FA devices","Document in ticketing system"],"cost_estimate":"$0","effort_hours":2}}
            },
            small_business: {
                approach: "Use termination checklist, disable accounts immediately, collect equipment, change shared passwords, document in HR file",
                cost_estimate: "$0",
                effort_hours: 2
            },
            rmm: {
                ninjaone: {"services":["NinjaOne RMM","Scripting","Documentation"],"implementation":{"steps":["Use NinjaOne to rapidly disable access for terminated personnel on CUI endpoints","Script automated account disabling triggered by HR termination","Maintain personnel-to-device mapping in Documentation","Configure alerts for login attempts by disabled accounts","Audit local account access after personnel changes"],"cost_estimate":"$3-5/endpoint/month","effort_hours":4}}
            },
            xdr_edr: {
                sentinelone: {"services":["Singularity XDR","ITDR"],"implementation":{"steps":["Monitor for credential use by terminated personnel via ITDR","Alert on authentication from devices assigned to departed employees","Audit file access by departing personnel before termination","Configure automated response for suspicious terminated user activity"],"cost_estimate":"$5-12/endpoint/month","effort_hours":4}}
            }
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { COMPREHENSIVE_GUIDANCE_PART3 };
}

if (typeof window !== 'undefined') {
    window.COMPREHENSIVE_GUIDANCE_PART3 = COMPREHENSIVE_GUIDANCE_PART3;
}
