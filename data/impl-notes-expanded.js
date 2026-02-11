// Implementation Notes - Expanded Coverage
// Fills gaps in impl-notes.js for controls missing quick-start guidance
// Covers: AC, AU, CM, IA, IR, MA, MP, PE, RA, CP, SC families

const IMPL_NOTES_EXPANDED = {

    // ═══════════════════════════════════════════════════════════════
    // ACCESS CONTROL (3.1) — Missing controls
    // ═══════════════════════════════════════════════════════════════

    "3.1.3[a]": {
        azure: {
            steps: ["1. Map CUI data flows in architecture diagram", "2. Configure Conditional Access policies to restrict CUI app access", "3. Deploy Azure Information Protection labels for CUI classification", "4. Configure DLP policies in Microsoft Purview", "5. Document approved CUI flow paths in SSP"],
            quickWin: "Deploy Sensitivity Labels for CUI and configure auto-labeling policies",
            evidenceArtifact: "CUI_DataFlow_Diagram.png",
            humanInTheLoop: ["Data owner approves CUI flow paths", "Security reviews DLP policy violations weekly"],
            policyEvidence: ["Information Flow Control Policy", "CUI Data Flow Diagram", "DLP Policy Configuration"]
        },
        aws: {
            steps: ["1. Map CUI data flows across VPCs and services", "2. Configure VPC endpoints for private service access", "3. Use S3 bucket policies to restrict CUI data movement", "4. Enable Macie for CUI data discovery", "5. Document flows in SSP"],
            quickWin: "Enable Macie to discover and classify CUI in S3",
            evidenceArtifact: "CUI_DataFlow_AWS.json"
        },
        gcp: {
            steps: ["1. Map CUI data flows across projects", "2. Configure VPC Service Controls perimeters", "3. Use DLP API for CUI discovery", "4. Restrict data export with Organization Policies", "5. Document flows in SSP"],
            quickWin: "Create VPC Service Controls perimeter around CUI projects",
            evidenceArtifact: "CUI_DataFlow_GCP.json"
        }
    },

    "3.1.4[a]": {
        azure: {
            steps: ["1. Identify conflicting duties (e.g., admin + auditor)", "2. Create separate Entra ID roles for conflicting functions", "3. Configure PIM so no user holds conflicting roles simultaneously", "4. Document separation of duties matrix", "5. Review role assignments quarterly"],
            quickWin: "Create SoD matrix and verify no user has both Security Admin and Global Admin active",
            evidenceArtifact: "SoD_Matrix.xlsx",
            humanInTheLoop: ["HR validates role assignments against job descriptions", "Security reviews SoD violations quarterly"],
            policyEvidence: ["Separation of Duties Policy", "Role Assignment Matrix", "Quarterly SoD Review Records"]
        },
        aws: {
            steps: ["1. Define SoD requirements for AWS roles", "2. Use IAM permission boundaries to prevent role conflicts", "3. Implement SCPs to enforce SoD at org level", "4. Document SoD matrix", "5. Review quarterly"],
            quickWin: "Create permission boundaries preventing admin + audit role overlap",
            evidenceArtifact: "SoD_Matrix_AWS.xlsx"
        }
    },

    "3.1.6[a]": {
        azure: {
            steps: ["1. Identify non-privileged accounts accessing CUI systems", "2. Configure Conditional Access to block privileged operations from non-privileged accounts", "3. Enforce standard user accounts for daily work (no local admin)", "4. Use PIM for just-in-time privileged access", "5. Document in SSP"],
            quickWin: "Remove local admin rights from standard user accounts via Intune",
            evidenceArtifact: "NonPriv_Access_Config.json",
            humanInTheLoop: ["Managers confirm staff use standard accounts for daily work", "IT validates no shared admin accounts exist"],
            policyEvidence: ["Least Privilege Policy", "Standard User Account Procedure"]
        },
        aws: {
            steps: ["1. Enforce IAM users use non-admin roles for daily tasks", "2. Require role assumption for privileged operations", "3. Use SSO with standard roles by default", "4. Document non-privileged access requirements", "5. Review access patterns"],
            quickWin: "Configure IAM Identity Center with standard user permission set as default",
            evidenceArtifact: "NonPriv_IAM_Config.json"
        }
    },

    "3.1.7[a]": {
        azure: {
            steps: ["1. Identify all privileged functions in CUI environment", "2. Configure PIM for all privileged roles with approval workflow", "3. Enable Privileged Access Workstations (PAWs) for admin tasks", "4. Log all privileged operations to Sentinel", "5. Review privileged access monthly"],
            quickWin: "Enable PIM with approval required for Global Admin and Security Admin roles",
            evidenceArtifact: "PrivilegedAccess_Config.json",
            humanInTheLoop: ["Approver reviews and approves PIM elevation requests", "Security reviews privileged activity logs weekly"],
            policyEvidence: ["Privileged Access Management Policy", "PAW Deployment Standard", "Privileged Activity Review Procedure"]
        },
        aws: {
            steps: ["1. Identify privileged IAM actions", "2. Require MFA for privileged operations via IAM policies", "3. Use CloudTrail to log all privileged API calls", "4. Implement break-glass procedures", "5. Review privileged access monthly"],
            quickWin: "Add MFA condition to IAM policies for destructive/privileged actions",
            evidenceArtifact: "PrivilegedAccess_AWS.json"
        }
    },

    "3.1.8[a]": {
        azure: {
            steps: ["1. Configure Entra ID sign-in risk policies to limit failed attempts", "2. Set account lockout threshold (5 attempts) via Conditional Access", "3. Enable Smart Lockout in Entra ID", "4. Configure lockout duration (15+ minutes)", "5. Monitor lockout events in Sentinel"],
            quickWin: "Enable Entra ID Smart Lockout with 5-attempt threshold",
            evidenceArtifact: "AccountLockout_Config.json",
            humanInTheLoop: ["Help desk validates identity before unlocking accounts", "Security investigates repeated lockout patterns"],
            policyEvidence: ["Account Lockout Policy", "Help Desk Identity Verification Procedure"]
        },
        aws: {
            steps: ["1. Configure IAM password policy with lockout", "2. Use IAM Identity Center lockout settings", "3. Implement WAF rate limiting for console access", "4. Monitor failed login attempts via CloudTrail", "5. Document lockout procedures"],
            quickWin: "Set IAM password policy: lockout after 5 failed attempts",
            evidenceArtifact: "AccountLockout_AWS.json"
        }
    },

    "3.1.11[a]": {
        azure: {
            steps: ["1. Configure Conditional Access session controls (sign-in frequency)", "2. Set session timeout to 15 minutes for CUI applications", "3. Configure idle session timeout in SharePoint/Teams admin", "4. Implement Continuous Access Evaluation (CAE)", "5. Document session policies"],
            quickWin: "Set Conditional Access sign-in frequency to 1 hour for CUI apps",
            evidenceArtifact: "SessionControl_Config.json",
            humanInTheLoop: ["Users re-authenticate after session timeout", "Security reviews session duration policies quarterly"],
            policyEvidence: ["Session Management Policy", "Conditional Access Policy Documentation"]
        },
        aws: {
            steps: ["1. Configure IAM role session duration (1 hour max)", "2. Set console session timeout", "3. Configure application-level session timeouts", "4. Monitor long-running sessions", "5. Document session policies"],
            quickWin: "Set IAM role maximum session duration to 3600 seconds",
            evidenceArtifact: "SessionControl_AWS.json"
        }
    },

    "3.1.13[a]": {
        azure: {
            steps: ["1. Deploy Azure VPN Gateway or use Entra ID Application Proxy", "2. Configure Conditional Access requiring compliant device + MFA for remote access", "3. Enable Microsoft Tunnel for mobile device VPN", "4. Block legacy authentication protocols", "5. Monitor remote access patterns in Sentinel"],
            quickWin: "Create Conditional Access policy: require compliant device + MFA for all remote access",
            evidenceArtifact: "RemoteAccess_Config.json",
            humanInTheLoop: ["Users enroll devices in Intune before remote access", "Security reviews remote access logs weekly"],
            policyEvidence: ["Remote Access Policy", "VPN Configuration Standard", "Telework Agreement"]
        },
        aws: {
            steps: ["1. Deploy AWS Client VPN or Site-to-Site VPN", "2. Require MFA for VPN connections", "3. Use Systems Manager Session Manager for remote admin", "4. Monitor VPN connections via CloudWatch", "5. Document remote access architecture"],
            quickWin: "Deploy Client VPN with certificate + MFA authentication",
            evidenceArtifact: "RemoteAccess_AWS.json"
        }
    },

    "3.1.14[a]": {
        azure: {
            steps: ["1. Configure Azure VPN Gateway with IPsec/IKEv2", "2. Route all remote CUI access through VPN or Conditional Access managed paths", "3. Block direct internet access to CUI resources", "4. Use Private Endpoints for Azure PaaS services", "5. Document managed access points"],
            quickWin: "Deploy Private Endpoints for all Azure PaaS services hosting CUI",
            evidenceArtifact: "ManagedAccessPoints_Config.json"
        },
        aws: {
            steps: ["1. Configure VPC with no direct internet access for CUI subnets", "2. Use VPC endpoints for AWS service access", "3. Route all remote access through VPN or Session Manager", "4. Deploy NAT Gateway for controlled outbound access", "5. Document managed access points"],
            quickWin: "Create VPC endpoints for S3, KMS, and CloudWatch in CUI VPC",
            evidenceArtifact: "ManagedAccessPoints_AWS.json"
        }
    },

    "3.1.18[a]": {
        azure: {
            steps: ["1. Enroll all mobile devices in Microsoft Intune", "2. Create device compliance policies (encryption, PIN, OS version)", "3. Configure Conditional Access to require compliant device", "4. Deploy app protection policies for BYOD", "5. Monitor device compliance dashboard"],
            quickWin: "Create Intune compliance policy requiring encryption + PIN + current OS",
            evidenceArtifact: "MobileDevice_Compliance.json",
            humanInTheLoop: ["Users enroll personal devices or receive corporate devices", "IT reviews non-compliant devices weekly"],
            policyEvidence: ["Mobile Device Policy", "BYOD Agreement", "Device Compliance Standards"]
        },
        aws: {
            steps: ["1. Deploy MDM solution (Intune, Jamf, or similar)", "2. Require device enrollment before AWS console/app access", "3. Configure identity provider to check device compliance", "4. Block unmanaged devices from CUI resources", "5. Document mobile device requirements"],
            quickWin: "Configure IdP to require managed device for AWS SSO access",
            evidenceArtifact: "MobileDevice_AWS.json"
        }
    },

    "3.1.19[a]": {
        azure: {
            steps: ["1. Require BitLocker on Windows devices via Intune", "2. Verify iOS/Android device encryption via compliance policy", "3. Deploy Azure Information Protection for CUI file encryption", "4. Configure Intune to block non-encrypted devices", "5. Document encryption requirements"],
            quickWin: "Deploy Intune compliance policy requiring device encryption on all platforms",
            evidenceArtifact: "MobileEncryption_Config.json",
            humanInTheLoop: ["Users enable device encryption during enrollment", "IT validates encryption status on non-compliant devices"],
            policyEvidence: ["Encryption Policy", "Mobile Device Encryption Standard"]
        },
        aws: {
            steps: ["1. Require device encryption via MDM compliance policy", "2. Configure IdP to verify encryption status", "3. Block unencrypted devices from CUI access", "4. Document encryption requirements", "5. Monitor compliance"],
            quickWin: "Add device encryption check to IdP conditional access policy",
            evidenceArtifact: "MobileEncryption_AWS.json"
        }
    },

    "3.1.20[a]": {
        azure: {
            steps: ["1. Configure Conditional Access to block connections from unauthorized external systems", "2. Define approved external connections in SSP", "3. Use Azure Private Link for partner connections", "4. Monitor external connection attempts in Sentinel", "5. Review approved connections quarterly"],
            quickWin: "Create Conditional Access policy blocking access from non-approved locations/devices",
            evidenceArtifact: "ExternalConnections_Config.json"
        },
        aws: {
            steps: ["1. Configure VPC peering only with approved external systems", "2. Use PrivateLink for approved SaaS connections", "3. Block unauthorized external IPs via security groups", "4. Monitor VPC Flow Logs for external connections", "5. Document approved connections"],
            quickWin: "Review and restrict VPC peering connections to approved partners only",
            evidenceArtifact: "ExternalConnections_AWS.json"
        }
    },

    "3.1.22[a]": {
        azure: {
            steps: ["1. Configure Intune to control Bluetooth, USB, and wireless on devices", "2. Disable unauthorized wireless protocols via device configuration", "3. Deploy Wi-Fi profiles for approved networks only", "4. Block personal hotspot usage on corporate devices", "5. Document wireless restrictions"],
            quickWin: "Deploy Intune device restriction profile disabling personal hotspot and unapproved Bluetooth",
            evidenceArtifact: "WirelessControl_Config.json"
        },
        aws: {
            steps: ["1. Configure endpoint management to restrict wireless protocols", "2. Deploy approved Wi-Fi profiles via MDM", "3. Block unauthorized wireless connections", "4. Monitor for rogue wireless access points", "5. Document wireless access controls"],
            quickWin: "Deploy MDM Wi-Fi profile restricting connections to approved SSIDs only",
            evidenceArtifact: "WirelessControl_AWS.json"
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // AUDIT & ACCOUNTABILITY (3.3) — Missing controls
    // ═══════════════════════════════════════════════════════════════

    "3.3.5[a]": {
        azure: {
            steps: ["1. Configure Sentinel analytics rules for audit log correlation", "2. Create workbooks for audit review dashboards", "3. Set up automated investigation playbooks", "4. Schedule weekly audit review meetings", "5. Document review process and findings"],
            quickWin: "Deploy Sentinel UEBA and create weekly audit review workbook",
            evidenceArtifact: "AuditReview_Process.json",
            humanInTheLoop: ["Security analyst reviews correlated audit findings weekly", "Management reviews audit summary monthly"],
            policyEvidence: ["Audit Review Procedure", "Audit Correlation Rules Documentation"]
        },
        aws: {
            steps: ["1. Configure Security Hub for cross-service finding correlation", "2. Use Athena to query CloudTrail logs", "3. Create QuickSight dashboards for audit review", "4. Schedule weekly review meetings", "5. Document review process"],
            quickWin: "Create Athena queries for weekly CloudTrail audit review",
            evidenceArtifact: "AuditReview_AWS.json"
        }
    },

    "3.3.6[a]": {
        azure: {
            steps: ["1. Configure Log Analytics workspace with 1-year retention", "2. Archive logs to Azure Storage for long-term retention", "3. Enable immutable storage for audit log archives", "4. Protect log integrity with Azure Monitor diagnostic settings", "5. Document retention and reduction procedures"],
            quickWin: "Set Log Analytics retention to 365 days and archive to immutable blob storage",
            evidenceArtifact: "AuditRetention_Config.json",
            humanInTheLoop: ["Security validates log retention meets policy requirements", "Compliance reviews log reduction procedures annually"],
            policyEvidence: ["Audit Log Retention Policy", "Log Archive Procedure"]
        },
        aws: {
            steps: ["1. Configure CloudTrail log retention in S3 with lifecycle policies", "2. Enable S3 Object Lock for immutable log storage", "3. Use Glacier for long-term archive", "4. Protect logs with KMS encryption", "5. Document retention procedures"],
            quickWin: "Enable S3 Object Lock (compliance mode) on CloudTrail log bucket",
            evidenceArtifact: "AuditRetention_AWS.json"
        }
    },

    "3.3.8[a]": {
        azure: {
            steps: ["1. Restrict Log Analytics workspace access to Security Admin role", "2. Configure RBAC to prevent audit log deletion", "3. Enable Azure Monitor resource locks", "4. Use Azure Policy to prevent diagnostic setting changes", "5. Monitor for unauthorized log access attempts"],
            quickWin: "Apply CanNotDelete resource lock on Log Analytics workspace and Sentinel",
            evidenceArtifact: "AuditProtection_Config.json",
            humanInTheLoop: ["Security Admin is sole owner of audit log infrastructure", "Unauthorized access attempts trigger incident response"],
            policyEvidence: ["Audit Log Protection Policy", "RBAC Configuration for Audit Systems"]
        },
        aws: {
            steps: ["1. Restrict CloudTrail configuration to security admin IAM role", "2. Enable CloudTrail log file validation", "3. Use S3 bucket policy to prevent log deletion", "4. Enable MFA Delete on log bucket", "5. Monitor for unauthorized access"],
            quickWin: "Enable CloudTrail log file validation and S3 MFA Delete",
            evidenceArtifact: "AuditProtection_AWS.json"
        }
    },

    "3.3.9[a]": {
        azure: {
            steps: ["1. Restrict Sentinel and Log Analytics admin access to security team", "2. Use PIM for just-in-time access to audit management", "3. Separate audit admin role from system admin role", "4. Log all changes to audit configuration", "5. Review audit management access quarterly"],
            quickWin: "Configure PIM requiring approval for Log Analytics Contributor role",
            evidenceArtifact: "AuditMgmt_Access.json"
        },
        aws: {
            steps: ["1. Create dedicated IAM role for CloudTrail/Config management", "2. Restrict role assumption to security team", "3. Require MFA for audit management operations", "4. Monitor CloudTrail for audit config changes", "5. Review access quarterly"],
            quickWin: "Create IAM policy allowing CloudTrail management only with MFA",
            evidenceArtifact: "AuditMgmt_AWS.json"
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // CONFIGURATION MANAGEMENT (3.4) — Missing controls
    // ═══════════════════════════════════════════════════════════════

    "3.4.4[a]": {
        azure: {
            steps: ["1. Conduct security impact analysis before changes", "2. Document impact analysis in change request", "3. Test changes in staging environment", "4. Require security review for CUI system changes", "5. Update SSP after significant changes"],
            quickWin: "Add security impact analysis checklist to change management process",
            evidenceArtifact: "SecurityImpactAnalysis_Template.docx",
            humanInTheLoop: ["Security team reviews impact analysis for CUI changes", "Change Advisory Board approves significant changes"],
            policyEvidence: ["Security Impact Analysis Procedure", "Change Management Policy"]
        },
        aws: {
            steps: ["1. Require security impact analysis in change tickets", "2. Use CloudFormation change sets to preview changes", "3. Test in staging account before production", "4. Document security impact", "5. Update SSP after changes"],
            quickWin: "Require CloudFormation change sets with security review before deployment",
            evidenceArtifact: "SecurityImpactAnalysis_AWS.json"
        }
    },

    "3.4.6[a]": {
        azure: {
            steps: ["1. Deploy Windows Defender Application Control (WDAC) or AppLocker", "2. Configure Intune to restrict app installations", "3. Use Azure AD App Catalog for approved applications", "4. Disable unnecessary Windows features via Intune", "5. Monitor for unauthorized software"],
            quickWin: "Deploy Intune app restriction policy allowing only approved applications",
            evidenceArtifact: "LeastFunctionality_Config.json",
            humanInTheLoop: ["Application owner requests software approval", "Security reviews and approves/denies software requests"],
            policyEvidence: ["Least Functionality Policy", "Approved Software List", "Software Request Procedure"]
        },
        aws: {
            steps: ["1. Use hardened AMIs with minimal software", "2. Configure SSM to detect unauthorized software", "3. Use ECR with approved images only", "4. Disable unnecessary services on EC2 instances", "5. Document approved software baseline"],
            quickWin: "Create golden AMI pipeline with only approved software packages",
            evidenceArtifact: "LeastFunctionality_AWS.json"
        }
    },

    "3.4.9[a]": {
        azure: {
            steps: ["1. Configure Intune to block USB storage devices", "2. Use Windows Defender Device Control for removable media", "3. Configure Azure Information Protection to prevent unauthorized sharing", "4. Block personal cloud storage via Conditional Access", "5. Monitor for policy violations"],
            quickWin: "Deploy Intune device restriction profile blocking USB mass storage",
            evidenceArtifact: "UserInstalledSoftware_Config.json"
        },
        aws: {
            steps: ["1. Configure endpoint management to restrict user software installs", "2. Use SSM to enforce approved software baseline", "3. Monitor for unauthorized software via Inspector", "4. Block unauthorized package repositories", "5. Document restrictions"],
            quickWin: "Configure SSM State Manager to enforce approved software baseline",
            evidenceArtifact: "UserInstalledSoftware_AWS.json"
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // IDENTIFICATION & AUTHENTICATION (3.5) — Missing controls
    // ═══════════════════════════════════════════════════════════════

    "3.5.2[a]": {
        azure: {
            steps: ["1. Configure Entra ID device registration for all CUI devices", "2. Require Intune enrollment for device authentication", "3. Use certificate-based authentication for service accounts", "4. Configure Conditional Access to require managed device", "5. Document device authentication requirements"],
            quickWin: "Require Entra ID device registration + Intune compliance for CUI app access",
            evidenceArtifact: "DeviceAuth_Config.json",
            humanInTheLoop: ["IT provisions and enrolls devices", "Users register devices during onboarding"],
            policyEvidence: ["Device Authentication Policy", "Device Registration Procedure"]
        },
        aws: {
            steps: ["1. Configure device trust via IdP integration", "2. Require device certificates for VPN access", "3. Use SSM for managed instance authentication", "4. Document device authentication requirements", "5. Monitor unmanaged device access attempts"],
            quickWin: "Configure IdP to require device certificate for AWS SSO",
            evidenceArtifact: "DeviceAuth_AWS.json"
        }
    },

    "3.5.5[a]": {
        azure: {
            steps: ["1. Configure Entra ID to disable accounts after 90 days of inactivity", "2. Use Access Reviews to identify inactive accounts", "3. Implement automated account lifecycle management via SCIM", "4. Disable accounts immediately upon termination", "5. Review account status monthly"],
            quickWin: "Create Entra ID Access Review for inactive accounts (90-day threshold)",
            evidenceArtifact: "AccountLifecycle_Config.json",
            humanInTheLoop: ["HR notifies IT of terminations same day", "Managers review team accounts quarterly"],
            policyEvidence: ["Account Management Policy", "Offboarding Procedure", "Inactive Account Review Process"]
        },
        aws: {
            steps: ["1. Use IAM credential report to identify inactive users", "2. Configure automated disabling of unused credentials (90 days)", "3. Implement SCIM provisioning via IAM Identity Center", "4. Delete unused access keys", "5. Review monthly"],
            quickWin: "Run credential report and disable users with no activity in 90+ days",
            evidenceArtifact: "AccountLifecycle_AWS.json"
        }
    },

    "3.5.9[a]": {
        azure: {
            steps: ["1. Configure Entra ID password policy (12+ chars, complexity)", "2. Enable password protection (banned password list)", "3. Enforce password history (24 passwords)", "4. Set maximum password age (60 days) or go passwordless", "5. Document password requirements"],
            quickWin: "Enable Entra ID Password Protection with custom banned password list",
            evidenceArtifact: "PasswordPolicy_Config.json"
        },
        aws: {
            steps: ["1. Configure IAM password policy (14+ chars, complexity)", "2. Enforce password history (24 passwords)", "3. Set maximum password age (90 days)", "4. Require password change on first login", "5. Document policy"],
            quickWin: "Set IAM password policy: 14 chars, complexity, 24 history, 90-day expiry",
            evidenceArtifact: "PasswordPolicy_AWS.json"
        }
    },

    "3.5.10[a]": {
        azure: {
            steps: ["1. Verify Entra ID stores passwords using bcrypt/PBKDF2 (default)", "2. Configure on-prem AD to use AES-256 for Kerberos", "3. Disable legacy NTLM authentication where possible", "4. Use Azure Key Vault for application credential storage", "5. Document cryptographic protection measures"],
            quickWin: "Disable NTLM authentication via Conditional Access and Group Policy",
            evidenceArtifact: "PasswordStorage_Config.json"
        },
        aws: {
            steps: ["1. Verify IAM uses salted hashing for passwords (AWS managed)", "2. Use Secrets Manager for application credentials", "3. Rotate secrets automatically via Lambda", "4. Never store credentials in code or config files", "5. Document credential protection"],
            quickWin: "Migrate all hardcoded credentials to Secrets Manager with auto-rotation",
            evidenceArtifact: "PasswordStorage_AWS.json"
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // INCIDENT RESPONSE (3.6) — Missing controls
    // ═══════════════════════════════════════════════════════════════

    "3.6.3[a]": {
        azure: {
            steps: ["1. Conduct tabletop exercises quarterly", "2. Test incident response procedures with simulated incidents", "3. Review and update IR plan after each exercise", "4. Document lessons learned", "5. Update playbooks based on findings"],
            quickWin: "Schedule quarterly tabletop exercise using Sentinel incident simulation",
            evidenceArtifact: "IR_TestResults.docx",
            humanInTheLoop: ["IR team participates in tabletop exercises", "Management reviews exercise results and approves plan updates"],
            policyEvidence: ["Incident Response Testing Procedure", "Tabletop Exercise Schedule", "Lessons Learned Documentation"]
        },
        aws: {
            steps: ["1. Conduct tabletop exercises quarterly", "2. Use GameDay for simulated incidents", "3. Test automated response playbooks", "4. Document lessons learned", "5. Update IR plan"],
            quickWin: "Schedule quarterly tabletop exercise focused on AWS-specific scenarios",
            evidenceArtifact: "IR_TestResults_AWS.docx"
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // MAINTENANCE (3.7) — Missing controls
    // ═══════════════════════════════════════════════════════════════

    "3.7.2[a]": {
        azure: {
            steps: ["1. Require approval for all maintenance activities on CUI systems", "2. Use Intune remote actions with audit logging", "3. Supervise remote maintenance sessions (screen sharing)", "4. Terminate remote sessions when maintenance is complete", "5. Document all maintenance activities"],
            quickWin: "Configure Intune remote actions to require admin approval and log all sessions",
            evidenceArtifact: "MaintenanceControl_Config.json",
            humanInTheLoop: ["IT manager approves maintenance requests", "Security monitors remote maintenance sessions"],
            policyEvidence: ["System Maintenance Policy", "Remote Maintenance Procedure", "Maintenance Log"]
        },
        aws: {
            steps: ["1. Use Systems Manager Session Manager for remote maintenance", "2. Enable session logging to S3/CloudWatch", "3. Require IAM approval for maintenance operations", "4. Terminate sessions after maintenance", "5. Document all activities"],
            quickWin: "Enable Session Manager with full session logging to S3",
            evidenceArtifact: "MaintenanceControl_AWS.json"
        }
    },

    "3.7.4[a]": {
        azure: {
            steps: ["1. Inspect maintenance tools before connecting to CUI systems", "2. Maintain approved tools list for maintenance activities", "3. Scan removable media before use on CUI systems", "4. Use only organization-approved remote access tools", "5. Document approved maintenance tools"],
            quickWin: "Create approved maintenance tools list and block unapproved remote access tools",
            evidenceArtifact: "MaintenanceTools_Approved.xlsx",
            humanInTheLoop: ["IT validates tools before use on CUI systems", "Security approves new maintenance tools"],
            policyEvidence: ["Maintenance Tools Policy", "Approved Tools List"]
        }
    },

    "3.7.5[a]": {
        azure: {
            steps: ["1. Require MFA for all remote maintenance sessions", "2. Use Entra ID Conditional Access for maintenance tool access", "3. Deploy VPN for remote maintenance connections", "4. Log all remote maintenance sessions in Sentinel", "5. Review remote maintenance logs weekly"],
            quickWin: "Require MFA + VPN + compliant device for all remote maintenance access",
            evidenceArtifact: "RemoteMaintenance_Config.json"
        },
        aws: {
            steps: ["1. Require MFA for Session Manager access", "2. Use VPN for remote maintenance", "3. Log all sessions to CloudWatch", "4. Restrict maintenance IAM roles", "5. Review logs weekly"],
            quickWin: "Add MFA requirement to Session Manager IAM policy",
            evidenceArtifact: "RemoteMaintenance_AWS.json"
        }
    },

    "3.7.6[a]": {
        azure: {
            steps: ["1. Supervise maintenance personnel without authorized access", "2. Escort non-cleared maintenance staff in CUI areas", "3. Log all maintenance activities by external personnel", "4. Verify maintenance personnel credentials before granting access", "5. Remove temporary access after maintenance"],
            quickWin: "Create temporary Entra ID guest accounts with time-limited access for maintenance vendors",
            evidenceArtifact: "MaintenancePersonnel_Log.xlsx",
            humanInTheLoop: ["Facility manager escorts maintenance personnel", "IT creates and revokes temporary access"],
            policyEvidence: ["Maintenance Personnel Policy", "Visitor/Vendor Escort Procedure", "Temporary Access Request Form"]
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // MEDIA PROTECTION (3.8) — Missing controls
    // ═══════════════════════════════════════════════════════════════

    "3.8.2[a]": {
        azure: {
            steps: ["1. Configure Intune to block USB mass storage devices", "2. Use Windows Defender Device Control for removable media", "3. Restrict CD/DVD access via Intune device restrictions", "4. Block unauthorized cloud storage via Conditional Access", "5. Document removable media restrictions"],
            quickWin: "Deploy Intune device restriction profile blocking all removable storage",
            evidenceArtifact: "RemovableMedia_Restrictions.json",
            humanInTheLoop: ["Users request removable media exceptions through IT", "Security approves exceptions with business justification"],
            policyEvidence: ["Removable Media Policy", "Media Exception Request Form"]
        },
        aws: {
            steps: ["1. Configure endpoint management to block USB storage", "2. Restrict S3 data export to approved methods", "3. Use Macie to detect CUI on unauthorized media", "4. Block unauthorized data transfer services", "5. Document restrictions"],
            quickWin: "Deploy endpoint agent blocking USB mass storage on all CUI endpoints",
            evidenceArtifact: "RemovableMedia_AWS.json"
        }
    },

    "3.8.3[a]": {
        azure: {
            steps: ["1. Implement Azure Information Protection for CUI document sanitization", "2. Use Microsoft Purview Data Lifecycle Management for retention/disposal", "3. Configure secure deletion policies for CUI data", "4. Use BitLocker secure wipe for decommissioned devices", "5. Document sanitization procedures"],
            quickWin: "Configure Purview retention labels with secure disposal for CUI documents",
            evidenceArtifact: "MediaSanitization_Config.json",
            humanInTheLoop: ["Data owner approves media sanitization", "IT performs and documents sanitization"],
            policyEvidence: ["Media Sanitization Policy", "Data Disposal Procedure", "Sanitization Verification Form"]
        },
        aws: {
            steps: ["1. Use S3 lifecycle policies for CUI data deletion", "2. Configure EBS volume deletion on instance termination", "3. Use AWS-managed key deletion for crypto-shredding", "4. Document sanitization for decommissioned resources", "5. Verify sanitization"],
            quickWin: "Enable EBS DeleteOnTermination and S3 lifecycle deletion for CUI data",
            evidenceArtifact: "MediaSanitization_AWS.json"
        }
    },

    "3.8.5[a]": {
        azure: {
            steps: ["1. Configure Azure Information Protection with CUI sensitivity labels", "2. Apply labels automatically to CUI documents", "3. Restrict access to labeled documents via DLP policies", "4. Control distribution of labeled media", "5. Document CUI marking procedures"],
            quickWin: "Deploy CUI sensitivity label with auto-labeling for documents containing CUI keywords",
            evidenceArtifact: "CUI_Marking_Config.json",
            humanInTheLoop: ["Users apply CUI labels to documents", "Data owner validates CUI classification"],
            policyEvidence: ["CUI Marking Policy", "Sensitivity Label Configuration", "CUI Identification Guide"]
        },
        aws: {
            steps: ["1. Use S3 object tagging for CUI classification", "2. Configure Macie to identify and tag CUI data", "3. Apply resource tags for CUI classification", "4. Restrict access based on CUI tags", "5. Document marking procedures"],
            quickWin: "Configure Macie custom data identifiers for CUI patterns",
            evidenceArtifact: "CUI_Marking_AWS.json"
        }
    },

    "3.8.7[a]": {
        azure: {
            steps: ["1. Block USB storage via Intune device restrictions", "2. Configure Windows Defender Device Control policies", "3. Restrict Bluetooth file transfer", "4. Block unauthorized cloud storage services", "5. Monitor for policy violations"],
            quickWin: "Deploy Intune policy blocking USB storage, Bluetooth file transfer, and personal cloud storage",
            evidenceArtifact: "RemovableMedia_Control.json"
        },
        aws: {
            steps: ["1. Deploy endpoint agent blocking removable media", "2. Restrict data export from CUI environments", "3. Monitor for unauthorized data transfer", "4. Block unauthorized file sharing services", "5. Document controls"],
            quickWin: "Deploy endpoint DLP blocking USB and unauthorized file sharing",
            evidenceArtifact: "RemovableMedia_AWS.json"
        }
    },

    "3.8.9[a]": {
        azure: {
            steps: ["1. Enable BitLocker for all CUI endpoint drives", "2. Configure Azure Storage encryption (SSE) with CMK", "3. Enable Azure SQL TDE with CMK", "4. Encrypt backup media with AES-256", "5. Document encryption for all CUI storage"],
            quickWin: "Verify BitLocker is enabled on all CUI endpoints via Intune compliance report",
            evidenceArtifact: "BackupEncryption_Config.json"
        },
        aws: {
            steps: ["1. Enable EBS encryption by default", "2. Configure S3 default encryption with KMS CMK", "3. Encrypt RDS backups with KMS", "4. Encrypt EFS with KMS", "5. Document backup encryption"],
            quickWin: "Enable default encryption on all S3 buckets and EBS volumes in CUI account",
            evidenceArtifact: "BackupEncryption_AWS.json"
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // PHYSICAL PROTECTION (3.10) — Missing controls
    // ═══════════════════════════════════════════════════════════════

    "3.10.2[a]": {
        azure: {
            steps: ["1. Deploy badge access system for CUI areas", "2. Install security cameras at entry/exit points", "3. Maintain visitor logs with escort requirements", "4. Review physical access logs monthly", "5. Document physical protection measures in SSP"],
            quickWin: "Implement visitor sign-in log and escort policy for CUI areas",
            evidenceArtifact: "PhysicalAccess_Monitoring.xlsx",
            humanInTheLoop: ["Security guard monitors entry points", "Facility manager reviews access logs monthly"],
            policyEvidence: ["Physical Access Monitoring Policy", "Visitor Management Procedure", "Security Camera Policy"]
        }
    },

    "3.10.3[a]": {
        azure: {
            steps: ["1. Require visitor sign-in with government-issued ID", "2. Issue visitor badges with expiration", "3. Escort visitors in CUI areas at all times", "4. Log visitor entry/exit times", "5. Review visitor logs monthly"],
            quickWin: "Create visitor sign-in form (SharePoint/paper) with ID verification and escort assignment",
            evidenceArtifact: "VisitorLog_Template.xlsx",
            humanInTheLoop: ["Receptionist verifies visitor ID and logs entry", "Employee escorts visitor at all times in CUI areas"],
            policyEvidence: ["Visitor Management Policy", "Visitor Sign-In Form", "Escort Procedure"]
        }
    },

    "3.10.4[a]": {
        azure: {
            steps: ["1. Maintain physical access logs (badge system or manual)", "2. Retain logs for minimum 1 year", "3. Review logs for unauthorized access attempts", "4. Investigate anomalies", "5. Document review process"],
            quickWin: "Export badge access logs monthly and store in secure SharePoint library",
            evidenceArtifact: "PhysicalAccessLogs_Export.csv"
        }
    },

    "3.10.5[a]": {
        azure: {
            steps: ["1. Deploy locks on server rooms and network closets", "2. Secure portable CUI devices (laptops) with cable locks or secure storage", "3. Implement clean desk policy for CUI documents", "4. Secure CUI media in locked cabinets", "5. Document physical protection measures"],
            quickWin: "Implement clean desk policy and provide locking cabinets for CUI documents",
            evidenceArtifact: "PhysicalProtection_Checklist.xlsx",
            humanInTheLoop: ["Employees secure CUI materials when leaving workspace", "Facility manager conducts monthly clean desk audits"],
            policyEvidence: ["Clean Desk Policy", "Physical Security Checklist", "Equipment Protection Standard"]
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // RISK ASSESSMENT (3.11) — Missing controls
    // ═══════════════════════════════════════════════════════════════

    "3.11.3[a]": {
        azure: {
            steps: ["1. Identify vulnerabilities from Defender scans", "2. Prioritize by CVSS score and CUI impact", "3. Create POA&M entries for vulnerabilities", "4. Track remediation progress", "5. Verify remediation and close findings"],
            quickWin: "Create automated POA&M workflow from Defender vulnerability findings",
            evidenceArtifact: "VulnRemediation_Tracker.xlsx",
            humanInTheLoop: ["System owner prioritizes remediation based on risk", "Security validates remediation before closing"],
            policyEvidence: ["Vulnerability Remediation Policy", "POA&M Procedure", "Risk Acceptance Criteria"]
        },
        aws: {
            steps: ["1. Review Inspector and Security Hub findings", "2. Prioritize by severity and CUI impact", "3. Create POA&M entries", "4. Track remediation", "5. Verify and close"],
            quickWin: "Configure Security Hub to auto-create tickets for critical/high findings",
            evidenceArtifact: "VulnRemediation_AWS.xlsx"
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // CONTINGENCY PLANNING (3.12) — All missing
    // ═══════════════════════════════════════════════════════════════

    "3.12.1[a]": {
        azure: {
            steps: ["1. Develop Security Assessment Plan (SAP)", "2. Define assessment scope covering all CUI systems", "3. Identify assessment methods (interview, examine, test)", "4. Schedule assessments annually", "5. Document plan and get management approval"],
            quickWin: "Create SAP template covering all 110 CMMC L2 controls with assessment methods",
            evidenceArtifact: "SecurityAssessmentPlan.docx",
            humanInTheLoop: ["Assessor conducts interviews and examinations", "Management approves assessment plan"],
            policyEvidence: ["Security Assessment Policy", "Assessment Plan Template", "Assessment Schedule"]
        }
    },

    "3.12.2[a]": {
        azure: {
            steps: ["1. Develop System Security Plan (SSP)", "2. Document system boundary and architecture", "3. Map all 110 controls to implementation details", "4. Include data flow diagrams and network diagrams", "5. Review and update SSP annually"],
            quickWin: "Use CMMC assessment tool to generate initial SSP from assessment data",
            evidenceArtifact: "SystemSecurityPlan.docx",
            humanInTheLoop: ["System owner reviews and approves SSP", "Security updates SSP after significant changes"],
            policyEvidence: ["SSP Template", "SSP Review Procedure", "Annual SSP Update Schedule"]
        }
    },

    "3.12.3[a]": {
        azure: {
            steps: ["1. Develop Plan of Action and Milestones (POA&M)", "2. Document all unmet or partially met controls", "3. Assign remediation owners and target dates", "4. Track progress monthly", "5. Close POA&M items when remediated"],
            quickWin: "Export POA&M from assessment tool and assign owners with 90-day milestones",
            evidenceArtifact: "POAM_Export.xlsx",
            humanInTheLoop: ["Remediation owners implement fixes", "Security validates remediation before closing POA&M items"],
            policyEvidence: ["POA&M Management Procedure", "Remediation Tracking Process"]
        }
    },

    "3.12.4[a]": {
        azure: {
            steps: ["1. Conduct annual security assessments", "2. Assess all 110 CMMC L2 controls", "3. Document findings and update assessment status", "4. Update POA&M with new findings", "5. Brief management on assessment results"],
            quickWin: "Schedule annual self-assessment using CMMC assessment tool",
            evidenceArtifact: "AnnualAssessment_Results.xlsx",
            humanInTheLoop: ["Assessor conducts control assessments", "Management reviews assessment results and approves remediation priorities"],
            policyEvidence: ["Annual Assessment Procedure", "Assessment Results Report Template"]
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // SYSTEM & COMMUNICATIONS PROTECTION (3.13) — Missing controls
    // ═══════════════════════════════════════════════════════════════

    "3.13.3[a]": {
        azure: {
            steps: ["1. Separate user functionality from system management in architecture", "2. Use separate admin accounts for management tasks", "3. Deploy PAWs for system administration", "4. Restrict management interfaces to management network", "5. Document separation in SSP"],
            quickWin: "Require separate admin accounts (no daily-use accounts with admin privileges)",
            evidenceArtifact: "UserMgmtSeparation_Config.json"
        },
        aws: {
            steps: ["1. Separate management VPC from application VPC", "2. Use bastion hosts for management access", "3. Restrict management ports to management subnet", "4. Use separate IAM roles for admin vs user functions", "5. Document separation"],
            quickWin: "Deploy bastion host in management subnet with restricted security group",
            evidenceArtifact: "UserMgmtSeparation_AWS.json"
        }
    },

    "3.13.4[a]": {
        azure: {
            steps: ["1. Identify shared system resources (memory, storage, network)", "2. Configure Azure resource isolation (dedicated hosts if needed)", "3. Use Azure Confidential Computing for sensitive workloads", "4. Prevent information leakage between tenants", "5. Document shared resource controls"],
            quickWin: "Use Azure Dedicated Hosts for CUI VMs requiring hardware isolation",
            evidenceArtifact: "SharedResource_Controls.json"
        },
        aws: {
            steps: ["1. Use Dedicated Instances or Dedicated Hosts for CUI workloads", "2. Configure VPC isolation for CUI resources", "3. Use Nitro Enclaves for sensitive processing", "4. Prevent cross-account resource sharing", "5. Document isolation controls"],
            quickWin: "Enable Dedicated Instances for CUI EC2 workloads",
            evidenceArtifact: "SharedResource_AWS.json"
        }
    },

    "3.13.7[a]": {
        azure: {
            steps: ["1. Disable split tunneling in VPN configuration", "2. Configure Always On VPN with force tunnel", "3. Use Conditional Access to block access from non-VPN networks", "4. Monitor for split tunnel violations", "5. Document split tunneling policy"],
            quickWin: "Configure Azure VPN client with force tunnel (no split tunneling)",
            evidenceArtifact: "SplitTunnel_Config.json"
        },
        aws: {
            steps: ["1. Configure Client VPN with full tunnel mode", "2. Block split tunneling in VPN configuration", "3. Monitor for unauthorized direct internet access", "4. Use VPC routing to force all traffic through VPN", "5. Document policy"],
            quickWin: "Set Client VPN to full tunnel mode (route all traffic through VPN)",
            evidenceArtifact: "SplitTunnel_AWS.json"
        }
    },

    "3.13.9[a]": {
        azure: {
            steps: ["1. Terminate VPN connections at network boundary (Azure VPN Gateway)", "2. Terminate TLS at Azure Application Gateway or Front Door", "3. Inspect traffic before forwarding to internal resources", "4. Log all connection termination events", "5. Document connection termination architecture"],
            quickWin: "Deploy Azure Application Gateway with WAF for TLS termination and inspection",
            evidenceArtifact: "ConnectionTermination_Config.json"
        },
        aws: {
            steps: ["1. Terminate TLS at ALB/NLB", "2. Terminate VPN at VPN Gateway", "3. Use WAF for HTTP inspection at termination point", "4. Log all connections", "5. Document architecture"],
            quickWin: "Configure ALB with TLS termination and WAF inspection for CUI web apps",
            evidenceArtifact: "ConnectionTermination_AWS.json"
        }
    },

    "3.13.16[a]": {
        azure: {
            steps: ["1. Enable BitLocker for all CUI endpoints", "2. Configure Azure Storage SSE with CMK", "3. Enable Azure SQL TDE", "4. Use Azure Disk Encryption for VMs", "5. Document all encryption-at-rest configurations"],
            quickWin: "Verify all Azure storage accounts use CMK encryption via Azure Policy",
            evidenceArtifact: "EncryptionAtRest_Config.json"
        },
        aws: {
            steps: ["1. Enable EBS encryption by default in all regions", "2. Configure S3 default encryption with KMS CMK", "3. Enable RDS encryption", "4. Encrypt EFS and DynamoDB", "5. Document encryption configurations"],
            quickWin: "Enable EBS encryption by default and S3 bucket encryption in all CUI accounts",
            evidenceArtifact: "EncryptionAtRest_AWS.json"
        }
    }
};

// Helper function to get expanded implementation notes
function getImplNotesExpanded(objectiveId, cloud) {
    cloud = cloud || 'azure';
    var notes = IMPL_NOTES_EXPANDED[objectiveId];
    if (!notes) return null;
    return notes[cloud] || notes.azure || null;
}

// Merge expanded notes into the main getImplNotes function
(function() {
    var origGetImplNotes = typeof getImplNotes === 'function' ? getImplNotes : null;
    window.getImplNotes = function(objectiveId, cloud) {
        cloud = cloud || 'azure';
        // Try original first
        if (origGetImplNotes) {
            var result = origGetImplNotes(objectiveId, cloud);
            if (result) return result;
        }
        // Fall back to expanded
        return getImplNotesExpanded(objectiveId, cloud);
    };
})();
