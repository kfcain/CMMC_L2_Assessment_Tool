// Comprehensive Implementation Guidance - Part 3
// Remaining L1/L2 CMMC Assessment Objectives: IR, MA, MP, PE, PS, RE, SA, SC, SI

const COMPREHENSIVE_GUIDANCE_PART3 = {
    objectives: {
        
        "IR.L2-3.6.1": {
            objective: "Establish an operational incident-handling capability for organizational systems that includes preparation, detection, analysis, containment, recovery, and user response activities.",
            summary: "Incident response plan, IR team, playbooks, tools",
            implementation: {
                general: {
                    steps: [
                        "Develop incident response plan (IRP)",
                        "Establish incident response team with defined roles",
                        "Create incident response playbooks for common scenarios",
                        "Deploy incident response tools (SIEM, EDR, forensics)",
                        "Establish communication procedures",
                        "Define escalation paths",
                        "Document lessons learned process",
                        "Conduct annual IR plan review"
                    ],
                    effort_hours: 40
                }
            },
            cloud: {
                aws: { services: ["Security Hub", "GuardDuty", "Detective", "Systems Manager"], implementation: { steps: ["Enable AWS Security Hub for centralized findings", "Deploy GuardDuty for threat detection", "Use Amazon Detective for investigation", "Create EventBridge rules for automated response", "Implement SNS for incident notifications", "Use Systems Manager for containment actions", "Document IR procedures in wiki"], cost_estimate: "$100-500/month", effort_hours: 24 }},
                azure: { services: ["Sentinel", "Defender", "Logic Apps"], implementation: { steps: ["Deploy Microsoft Sentinel as SIEM", "Enable Defender for Cloud for detection", "Create Sentinel playbooks for automated response", "Configure incident creation rules", "Implement Teams/email notifications", "Use Azure Automation for containment", "Document IR procedures"], cost_estimate: "$200-800/month", effort_hours: 24 }},
                gcp: { services: ["Chronicle", "Security Command Center", "Cloud Functions"], implementation: { steps: ["Use Chronicle SIEM for detection", "Enable Security Command Center Premium", "Create Cloud Functions for automated response", "Configure alerting policies", "Implement Pub/Sub for notifications", "Document IR procedures"], cost_estimate: "$500-2000/month", effort_hours: 24 }}
            },
            small_business: { approach: "Create basic IR plan, designate IR team members, use cloud provider security tools, document procedures in SharePoint", cost_estimate: "$0-200/month", effort_hours: 16 }
        }
        
        ,
        
        "IR.L2-3.6.2": {
            objective: "Track, document, and report incidents to designated officials and/or authorities both internal and external to the organization.",
            summary: "Incident tracking system, reporting to management and authorities (FBI, CISA)",
            cloud: {
                aws: { services: ["Security Hub", "Systems Manager"], implementation: { steps: ["Use Security Hub for incident tracking", "Create incident tickets in ServiceNow/Jira", "Configure SNS notifications to management", "Document reporting procedures for FBI/CISA", "Maintain incident log in S3", "Generate incident reports with QuickSight"], cost_estimate: "$20-100/month", effort_hours: 12 }},
                azure: { services: ["Sentinel", "DevOps"], implementation: { steps: ["Use Sentinel incidents for tracking", "Create work items in Azure DevOps", "Configure email/Teams notifications", "Document reporting procedures", "Maintain incident log in Log Analytics", "Generate reports with Power BI"], cost_estimate: "$20-80/month", effort_hours: 12 }},
                gcp: { services: ["Chronicle", "Cloud Logging"], implementation: { steps: ["Use Chronicle for incident tracking", "Create tickets in Jira/ServiceNow", "Configure Pub/Sub notifications", "Document reporting procedures", "Maintain incident log in BigQuery", "Generate reports with Data Studio"], cost_estimate: "$20-100/month", effort_hours: 12 }}
            },
            process: {
                general: { implementation: { steps: ["Create incident tracking spreadsheet/database", "Define incident severity levels", "Establish reporting timelines (72 hours for CUI incidents)", "Identify reporting contacts (FBI, CISA, DIBNet)", "Create incident report template", "Document chain of custody procedures"], effort_hours: 8 }}
            },
            small_business: { approach: "Use Excel/SharePoint for incident tracking, email notifications to management, document FBI/CISA reporting procedures", cost_estimate: "$0", effort_hours: 6 }
        }
        
        ,
        
        "IR.L2-3.6.3": {
            objective: "Test the organizational incident response capability.",
            summary: "Annual IR tabletop exercises, test IR plan",
            implementation: {
                general: {
                    steps: [
                        "Conduct annual tabletop exercise",
                        "Test incident detection capabilities",
                        "Test incident response procedures",
                        "Test communication procedures",
                        "Test backup/recovery procedures",
                        "Document test results and lessons learned",
                        "Update IR plan based on test findings",
                        "Involve all IR team members in testing"
                    ],
                    effort_hours: 16
                }
            },
            cloud: {
                aws: { implementation: { steps: ["Simulate security incidents in test environment", "Test GuardDuty detection", "Test EventBridge automation", "Test SNS notifications", "Test containment procedures", "Document test results", "Update runbooks"], cost_estimate: "$10-50/month (test environment)", effort_hours: 12 }},
                azure: { implementation: { steps: ["Simulate security incidents in test environment", "Test Sentinel detection rules", "Test playbook automation", "Test notification procedures", "Test containment actions", "Document test results", "Update procedures"], cost_estimate: "$10-50/month", effort_hours: 12 }},
                gcp: { implementation: { steps: ["Simulate security incidents in test environment", "Test Chronicle detection", "Test Cloud Functions automation", "Test alerting", "Test containment procedures", "Document test results"], cost_estimate: "$10-50/month", effort_hours: 12 }}
            },
            small_business: { approach: "Conduct annual tabletop exercise with IR team, test key procedures, document lessons learned", cost_estimate: "$0", effort_hours: 8 }
        }
        
        ,
        
        "MA.L2-3.7.1": {
            objective: "Perform maintenance on organizational systems.",
            summary: "Scheduled maintenance, patch management, preventive maintenance",
            cloud: {
                aws: { services: ["Systems Manager", "Config"], implementation: { steps: ["Use Systems Manager Patch Manager for automated patching", "Create maintenance windows", "Use Systems Manager Maintenance Windows", "Document maintenance procedures", "Track maintenance in change management system", "Use AWS Config to verify patch compliance"], cost_estimate: "$10-50/month", effort_hours: 12 }},
                azure: { services: ["Update Management", "Automation"], implementation: { steps: ["Use Azure Update Management for patching", "Create maintenance schedules", "Use Azure Automation for maintenance tasks", "Document maintenance procedures", "Track maintenance in Azure DevOps", "Monitor compliance with Azure Policy"], cost_estimate: "$10-40/month", effort_hours: 12 }},
                gcp: { services: ["OS Config", "Cloud Scheduler"], implementation: { steps: ["Use OS Config for patch management", "Create maintenance schedules with Cloud Scheduler", "Document maintenance procedures", "Track maintenance in change management", "Monitor compliance with organization policies"], cost_estimate: "$10-40/month", effort_hours: 12 }}
            },
            small_business: { approach: "Enable automatic updates for Windows/cloud systems, schedule quarterly maintenance windows, document procedures", cost_estimate: "$0", effort_hours: 6 }
        }
        
        ,
        
        "MA.L2-3.7.2": {
            objective: "Provide controls on the tools, techniques, mechanisms, and personnel used to conduct system maintenance.",
            summary: "Approved maintenance tools, authorized personnel, maintenance logging",
            cloud: {
                aws: { implementation: { steps: ["Maintain approved tools list", "Restrict maintenance access with IAM", "Use Systems Manager Session Manager for audited access", "Log all maintenance activities in CloudTrail", "Require MFA for maintenance access", "Document authorized maintenance personnel"], cost_estimate: "$0-20/month", effort_hours: 8 }},
                azure: { implementation: { steps: ["Maintain approved tools list", "Restrict maintenance access with RBAC", "Use Azure Bastion for audited access", "Log all maintenance in Activity Log", "Require MFA for maintenance access", "Document authorized personnel"], cost_estimate: "$0-20/month", effort_hours: 8 }},
                gcp: { implementation: { steps: ["Maintain approved tools list", "Restrict maintenance access with IAM", "Use IAP for audited access", "Log all maintenance in Cloud Audit Logs", "Require MFA for maintenance access", "Document authorized personnel"], cost_estimate: "$0-20/month", effort_hours: 8 }}
            },
            small_business: { approach: "Document approved maintenance tools, maintain list of authorized personnel, log maintenance activities", cost_estimate: "$0", effort_hours: 4 }
        }
        
        ,
        
        "MA.L2-3.7.3": {
            objective: "Ensure equipment removed for off-site maintenance is sanitized of any CUI.",
            summary: "Data sanitization before off-site repair, certificate of destruction",
            implementation: {
                general: {
                    steps: [
                        "Document equipment sanitization procedures",
                        "Use NIST SP 800-88 sanitization methods",
                        "Wipe drives with DoD 5220.22-M (3-pass minimum)",
                        "Use cryptographic erase for encrypted drives",
                        "Obtain certificate of sanitization",
                        "Document equipment serial numbers",
                        "Maintain sanitization log",
                        "Consider equipment destruction instead of repair for highly sensitive systems"
                    ],
                    effort_hours: 6
                }
            },
            tools: {
                general: { implementation: { steps: ["Use DBAN (Darik's Boot and Nuke) for hard drives", "Use manufacturer secure erase tools", "Use shred command on Linux", "Use BitLocker secure erase on Windows", "Document sanitization method used", "Verify sanitization completion"], effort_hours: 4 }}
            },
            small_business: { approach: "Use Windows BitLocker secure erase or DBAN before sending equipment for repair, document sanitization", cost_estimate: "$0", effort_hours: 3 }
        }
        
        ,
        
        "MA.L2-3.7.4": {
            objective: "Check media containing diagnostic and test programs for malicious code before the media are used in organizational systems.",
            summary: "Scan USB drives and diagnostic media with antivirus before use",
            cloud: {
                aws: { implementation: { steps: ["Scan files with Amazon Inspector", "Use GuardDuty for malware detection", "Implement S3 malware scanning with Lambda", "Use third-party antivirus (CrowdStrike, Trend Micro)", "Document scanning procedures"], cost_estimate: "$20-100/month", effort_hours: 6 }},
                azure: { implementation: { steps: ["Use Microsoft Defender for Endpoint", "Scan files before use", "Implement Azure Storage malware scanning", "Use Defender for Cloud Apps", "Document scanning procedures"], cost_estimate: "$10-50/month", effort_hours: 6 }},
                gcp: { implementation: { steps: ["Use third-party antivirus integration", "Scan files with Cloud Functions", "Implement malware scanning for Cloud Storage", "Document scanning procedures"], cost_estimate: "$20-80/month", effort_hours: 6 }}
            },
            operating_system: {
                windows: { implementation: { steps: ["Enable Windows Defender real-time protection", "Scan USB drives automatically on insertion", "Configure Group Policy to scan removable media", "Update virus definitions daily"], effort_hours: 2 }},
                linux: { implementation: { steps: ["Install ClamAV antivirus", "Configure automatic scanning of mounted media", "Update virus definitions daily", "Use udev rules to trigger scans on USB insertion"], effort_hours: 3 }}
            },
            small_business: { approach: "Enable Windows Defender, scan all USB drives before use, update antivirus definitions regularly", cost_estimate: "$0", effort_hours: 2 }
        }
        
        ,
        
        "MA.L2-3.7.5": {
            objective: "Require multifactor authentication to establish nonlocal maintenance sessions via external network connections and terminate such connections when nonlocal maintenance is complete.",
            summary: "MFA for remote maintenance, auto-terminate sessions",
            cloud: {
                aws: { services: ["Systems Manager", "SSO"], implementation: { steps: ["Use Systems Manager Session Manager with MFA", "Require AWS SSO with MFA for maintenance access", "Configure session timeout (2 hours)", "Terminate sessions automatically", "Log all remote maintenance sessions", "Monitor session duration"], cost_estimate: "$0-10/month", effort_hours: 6 }},
                azure: { services: ["Bastion", "PIM"], implementation: { steps: ["Use Azure Bastion for remote access", "Require PIM activation with MFA", "Configure session timeout (2 hours)", "Terminate sessions automatically", "Log all remote maintenance", "Monitor session duration"], cost_estimate: "$140/month (Bastion)", effort_hours: 6 }},
                gcp: { services: ["IAP", "Cloud Identity"], implementation: { steps: ["Use Identity-Aware Proxy with MFA", "Configure session timeout", "Terminate sessions automatically", "Log all remote maintenance", "Monitor session duration"], cost_estimate: "$0-10/month", effort_hours: 6 }}
            },
            network: {
                general: { implementation: { steps: ["Require MFA for VPN access", "Configure VPN session timeout (2 hours)", "Terminate idle sessions (15 minutes)", "Log all remote maintenance sessions", "Monitor for unauthorized access"], effort_hours: 6 }}
            },
            small_business: { approach: "Require MFA for VPN, configure session timeout, manually terminate sessions after maintenance", cost_estimate: "$0", effort_hours: 3 }
        }
        
        ,
        
        "MA.L2-3.7.6": {
            objective: "Supervise the maintenance activities of maintenance personnel without required access authorization.",
            summary: "Escort vendors during maintenance, monitor their activities",
            implementation: {
                general: {
                    steps: [
                        "Require escort for unauthorized maintenance personnel",
                        "Monitor all maintenance activities",
                        "Restrict access to only necessary systems",
                        "Log all maintenance activities",
                        "Review logs after maintenance completion",
                        "Require sign-in/sign-out procedures",
                        "Document supervision in maintenance log",
                        "Prohibit unescorted access to CUI systems"
                    ],
                    effort_hours: 4
                }
            },
            cloud: {
                aws: { implementation: { steps: ["Create temporary IAM users for vendors", "Use CloudTrail to monitor vendor activities", "Restrict vendor access with IAM policies", "Require escort during cloud console access", "Delete vendor accounts after maintenance", "Review CloudTrail logs"], cost_estimate: "$0", effort_hours: 4 }},
                azure: { implementation: { steps: ["Create temporary Azure AD guest accounts", "Monitor vendor activities with Activity Log", "Restrict vendor access with RBAC", "Require escort during portal access", "Delete guest accounts after maintenance", "Review Activity Log"], cost_estimate: "$0", effort_hours: 4 }},
                gcp: { implementation: { steps: ["Create temporary Cloud Identity accounts", "Monitor vendor activities with Cloud Audit Logs", "Restrict vendor access with IAM", "Require escort during console access", "Delete accounts after maintenance", "Review audit logs"], cost_estimate: "$0", effort_hours: 4 }}
            },
            small_business: { approach: "Escort vendors during all maintenance activities, document supervision in log, review activities after completion", cost_estimate: "$0", effort_hours: 2 }
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
