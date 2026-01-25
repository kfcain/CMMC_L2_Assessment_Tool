// Implementation Notes for Assessment Objectives
// Provides step-by-step guidance for implementing each CMMC L2 control objective
// Organized by control family with cloud-specific guidance

const IMPL_NOTES = {
    // === ACCESS CONTROL (3.1) ===
    "3.1.1[a]": {
        azure: {
            steps: [
                "1. Navigate to Entra ID > Users > All users",
                "2. Export user list via 'Download users' or Graph API",
                "3. Compare against HR system of record",
                "4. Document authorized users in SSP Appendix",
                "5. Set up SCIM provisioning from HR system for automation"
            ],
            quickWin: "Run `Get-MgUser -All | Export-Csv users.csv` to generate evidence",
            evidenceArtifact: "AC_UserList.csv"
        },
        aws: {
            steps: [
                "1. Navigate to IAM > Users in AWS Console",
                "2. Export via `aws iam list-users --output json`",
                "3. Review IAM Identity Center if using SSO",
                "4. Compare against HR records",
                "5. Document in SSP"
            ],
            quickWin: "Run `aws iam get-credential-report` for comprehensive user inventory",
            evidenceArtifact: "IAM_CredentialReport.csv"
        },
        gcp: {
            steps: [
                "1. Navigate to Cloud Identity > Users",
                "2. Export via Admin SDK or `gcloud identity groups memberships list`",
                "3. Compare against HR system",
                "4. Document authorized users",
                "5. Enable Cloud Identity sync with HR"
            ],
            quickWin: "Use Admin Console Reports for user inventory export",
            evidenceArtifact: "CloudIdentity_Users.csv"
        }
    },
    "3.1.1[b]": {
        azure: {
            steps: [
                "1. Navigate to Entra ID > Enterprise applications",
                "2. List all service principals and managed identities",
                "3. Document business owner for each",
                "4. Remove unused service principals",
                "5. Enable workload identity federation where possible"
            ],
            quickWin: "Run `Get-MgServicePrincipal -All | Select DisplayName, AppId`",
            evidenceArtifact: "AC_ServicePrincipals.json"
        },
        aws: {
            steps: [
                "1. List IAM roles: `aws iam list-roles`",
                "2. Identify service-linked roles",
                "3. Document purpose of each role",
                "4. Review trust policies",
                "5. Remove unused roles"
            ],
            quickWin: "Use IAM Access Analyzer to identify unused roles",
            evidenceArtifact: "IAM_Roles.json"
        },
        gcp: {
            steps: [
                "1. List service accounts: `gcloud iam service-accounts list`",
                "2. Document owner and purpose for each",
                "3. Disable unused service accounts",
                "4. Implement workload identity federation",
                "5. Remove long-lived keys"
            ],
            quickWin: "Use Policy Analyzer to find unused service accounts",
            evidenceArtifact: "ServiceAccounts.json"
        }
    },
    "3.1.1[c]": {
        azure: {
            steps: [
                "1. Navigate to Intune > Devices > All devices",
                "2. Review device compliance status",
                "3. Create device compliance policies",
                "4. Configure Conditional Access to require compliant devices",
                "5. Export device inventory for SSP"
            ],
            quickWin: "Create CA policy: Require compliant device for all cloud apps",
            evidenceArtifact: "Intune_DeviceInventory.json"
        },
        aws: {
            steps: [
                "1. Deploy AWS Systems Manager agent to all endpoints",
                "2. Use Fleet Manager for device inventory",
                "3. Configure SSM compliance rules",
                "4. Export managed instance list",
                "5. Document in SSP"
            ],
            quickWin: "Run `aws ssm describe-instance-information` for inventory",
            evidenceArtifact: "SSM_ManagedInstances.json"
        },
        gcp: {
            steps: [
                "1. Enable Endpoint Verification in Workspace",
                "2. Configure Context-Aware Access policies",
                "3. Require device trust for sensitive apps",
                "4. Export device inventory from Admin Console",
                "5. Document approved devices"
            ],
            quickWin: "Enable Endpoint Verification + Context-Aware Access",
            evidenceArtifact: "EndpointVerification_Devices.csv"
        }
    },
    "3.1.2[a]": {
        azure: {
            steps: [
                "1. Document job functions and required access",
                "2. Map job functions to Azure RBAC roles",
                "3. Create custom roles if built-in roles too broad",
                "4. Document role definitions in SSP",
                "5. Use PIM for privileged roles"
            ],
            quickWin: "Export role definitions: `Get-AzRoleDefinition | Export-Csv roles.csv`",
            evidenceArtifact: "RBAC_RoleDefinitions.json"
        },
        aws: {
            steps: [
                "1. Document job functions in access matrix",
                "2. Create IAM policies per function",
                "3. Use AWS managed policies where appropriate",
                "4. Create permission boundaries",
                "5. Document in SSP"
            ],
            quickWin: "Use IAM Access Analyzer to validate least privilege",
            evidenceArtifact: "IAM_Policies.json"
        },
        gcp: {
            steps: [
                "1. Document job functions and required permissions",
                "2. Map to predefined IAM roles",
                "3. Create custom roles if needed",
                "4. Use IAM Recommender to right-size",
                "5. Document role assignments"
            ],
            quickWin: "Run `gcloud iam roles list --project PROJECT_ID`",
            evidenceArtifact: "IAM_Roles.json"
        }
    },
    "3.1.5[a]": {
        azure: {
            steps: [
                "1. Navigate to Entra ID > Roles and administrators",
                "2. Export all privileged role assignments",
                "3. Enable PIM for all privileged roles",
                "4. Document privileged accounts in SSP",
                "5. Set up quarterly access reviews"
            ],
            quickWin: "Run `Get-MgDirectoryRoleMember -DirectoryRoleId [GlobalAdmin-ID]`",
            evidenceArtifact: "PIM_PrivilegedAccounts.json"
        },
        aws: {
            steps: [
                "1. List IAM users with admin access",
                "2. Review IAM policies for AdministratorAccess",
                "3. Document all privileged users",
                "4. Implement MFA for all admins",
                "5. Use AWS Organizations SCPs to limit"
            ],
            quickWin: "Run `aws iam list-users` + check attached policies",
            evidenceArtifact: "IAM_AdminUsers.json"
        },
        gcp: {
            steps: [
                "1. List users with Owner/Editor roles",
                "2. Review organization-level IAM bindings",
                "3. Document privileged accounts",
                "4. Enforce 2SV with security keys",
                "5. Set up regular access reviews"
            ],
            quickWin: "Run `gcloud projects get-iam-policy PROJECT_ID`",
            evidenceArtifact: "IAM_PrivilegedBindings.json"
        }
    },
    "3.1.9[a]": {
        azure: {
            steps: [
                "1. Navigate to Entra ID > Terms of Use",
                "2. Create new Terms of Use with DoD banner text",
                "3. Configure Conditional Access to require acceptance",
                "4. Deploy Windows logon banner via Intune Settings Catalog",
                "5. Test banner displays correctly"
            ],
            quickWin: "Create CA policy requiring Terms of Use for all apps",
            evidenceArtifact: "TermsOfUse_Config.json",
            bannerText: "You are accessing a U.S. Government information system..."
        },
        aws: {
            steps: [
                "1. Configure AWS SSO login banner",
                "2. Deploy EC2 login banner via SSM Run Command",
                "3. Configure CloudFront custom error pages with notice",
                "4. Document banner deployment",
                "5. Test user acknowledgment"
            ],
            quickWin: "Use SSM to deploy /etc/motd banner to all Linux instances",
            evidenceArtifact: "SystemBanner_Deployment.json"
        },
        gcp: {
            steps: [
                "1. Configure Google Workspace custom login page",
                "2. Create Terms of Use in Admin Console",
                "3. Deploy VM login banners via Compute Engine metadata",
                "4. Document banner content",
                "5. Test acknowledgment flow"
            ],
            quickWin: "Enable custom login page with security notice in Workspace",
            evidenceArtifact: "LoginBanner_Config.json"
        }
    },
    "3.1.10[a]": {
        azure: {
            steps: [
                "1. Create Intune Configuration Profile for Windows",
                "2. Configure screen timeout to 15 minutes max",
                "3. Require password on wake",
                "4. Assign to all CUI-accessing devices",
                "5. Monitor compliance status"
            ],
            quickWin: "Deploy Settings Catalog: 'Interactive logon: Machine inactivity limit' = 900",
            evidenceArtifact: "Intune_ScreenLock.json"
        },
        aws: {
            steps: [
                "1. Create SSM document for screen lock settings",
                "2. Deploy via SSM State Manager",
                "3. Configure 15-minute timeout",
                "4. Require password on wake",
                "5. Verify compliance via SSM Compliance"
            ],
            quickWin: "Deploy Group Policy via SSM for screen lock settings",
            evidenceArtifact: "SSM_ScreenLock.json"
        },
        gcp: {
            steps: [
                "1. Configure Chrome Enterprise policies",
                "2. Set screen lock timeout in Admin Console",
                "3. Deploy endpoint policies via Workspace",
                "4. Require password on wake",
                "5. Monitor compliance"
            ],
            quickWin: "Set Chrome policy: ScreenLockDelaySeconds = 900",
            evidenceArtifact: "Workspace_ScreenLock.json"
        }
    },
    "3.1.12[a]": {
        azure: {
            steps: [
                "1. Deploy Azure VPN Gateway for site-to-site VPN",
                "2. Configure Azure Virtual Desktop for remote access",
                "3. Document approved remote access methods in SSP",
                "4. Configure Conditional Access for remote sessions",
                "5. Enable MFA for all remote access"
            ],
            quickWin: "Create CA policy: Block access from untrusted locations except VPN",
            evidenceArtifact: "VPN_Config.json"
        },
        aws: {
            steps: [
                "1. Configure AWS Client VPN endpoint",
                "2. Enable certificate-based authentication",
                "3. Configure authorization rules",
                "4. Document approved access methods",
                "5. Enable CloudWatch logging"
            ],
            quickWin: "Deploy Client VPN with certificate + MFA authentication",
            evidenceArtifact: "ClientVPN_Config.json"
        },
        gcp: {
            steps: [
                "1. Configure Cloud VPN for site-to-site",
                "2. Deploy Identity-Aware Proxy for app access",
                "3. Enable BeyondCorp Enterprise",
                "4. Document approved methods",
                "5. Require 2SV for all access"
            ],
            quickWin: "Enable IAP for zero-trust application access",
            evidenceArtifact: "CloudVPN_Config.json"
        }
    },
    "3.1.21[a]": {
        azure: {
            steps: [
                "1. Navigate to Intune > Endpoint Security > Device Control",
                "2. Create policy to block all removable storage",
                "3. Define allowlist for approved FIPS-encrypted devices",
                "4. Deploy to all managed devices",
                "5. Monitor block events"
            ],
            quickWin: "Deploy Defender Device Control policy to block USB storage",
            evidenceArtifact: "DeviceControl_USBBlock.json"
        },
        aws: {
            steps: [
                "1. Create SSM document for USB blocking",
                "2. Deploy via State Manager to managed instances",
                "3. Use Windows GPO or Linux udev rules",
                "4. Document exceptions for approved devices",
                "5. Monitor compliance"
            ],
            quickWin: "Deploy USB storage blocking via SSM association",
            evidenceArtifact: "SSM_USBBlock.json"
        },
        gcp: {
            steps: [
                "1. Configure Chrome Enterprise USB policies",
                "2. Block removable storage via Workspace policies",
                "3. Define allowlist for approved devices",
                "4. Deploy to managed endpoints",
                "5. Monitor policy compliance"
            ],
            quickWin: "Set Chrome policy: RemovableStoragePolicy = BlockAll",
            evidenceArtifact: "ChromePolicy_USB.json"
        }
    },

    // === AWARENESS AND TRAINING (3.2) ===
    "3.2.1[a]": {
        azure: {
            steps: [
                "1. Navigate to Defender for Office 365 > Attack simulation",
                "2. Create security awareness training campaign",
                "3. Assign CUI-specific training modules",
                "4. Track completion in SharePoint list",
                "5. Export completion reports for SSP"
            ],
            quickWin: "Deploy Defender Attack Simulation training to all users",
            evidenceArtifact: "Training_CompletionReport.csv"
        },
        aws: {
            steps: [
                "1. Integrate third-party LMS (KnowBe4, etc.)",
                "2. Create CMMC awareness training assignments",
                "3. Track completion in training platform",
                "4. Export completion evidence",
                "5. Document in SSP"
            ],
            quickWin: "Deploy security awareness training via integrated LMS",
            evidenceArtifact: "LMS_CompletionReport.csv"
        },
        gcp: {
            steps: [
                "1. Configure Google Workspace Learning",
                "2. Assign security awareness courses",
                "3. Create CUI handling training",
                "4. Track completion in Admin Console",
                "5. Export reports"
            ],
            quickWin: "Deploy phishing awareness via Workspace Security Center",
            evidenceArtifact: "Workspace_TrainingReport.csv"
        }
    },
    "3.2.2[a]": {
        azure: {
            steps: [
                "1. Create insider threat awareness training in Defender",
                "2. Include CUI handling procedures",
                "3. Deploy to all users with CUI access",
                "4. Require annual completion",
                "5. Track and report completion"
            ],
            quickWin: "Add insider threat module to existing security training",
            evidenceArtifact: "InsiderThreat_Training.csv"
        },
        aws: {
            steps: [
                "1. Create insider threat training module",
                "2. Include AWS-specific security procedures",
                "3. Deploy via LMS",
                "4. Require annual completion",
                "5. Document completion evidence"
            ],
            quickWin: "Add insider threat awareness to onboarding training",
            evidenceArtifact: "InsiderThreat_Training.csv"
        },
        gcp: {
            steps: [
                "1. Create insider threat training content",
                "2. Deploy via Workspace Learning",
                "3. Include GCP security best practices",
                "4. Require annual completion",
                "5. Export completion reports"
            ],
            quickWin: "Add insider threat content to security training",
            evidenceArtifact: "InsiderThreat_Training.csv"
        }
    },

    // === AUDIT AND ACCOUNTABILITY (3.3) ===
    "3.3.1[a]": {
        azure: {
            steps: [
                "1. Deploy Microsoft Sentinel workspace in Azure Gov",
                "2. Enable data connectors: Entra ID, Intune, Defender, Office 365",
                "3. Configure log retention (365 days minimum)",
                "4. Enable Diagnostic Settings on all resources",
                "5. Document logging architecture in SSP"
            ],
            quickWin: "Deploy Sentinel with all Microsoft 365 data connectors",
            evidenceArtifact: "Sentinel_DataConnectors.json"
        },
        aws: {
            steps: [
                "1. Enable CloudTrail in all regions",
                "2. Create organization trail for multi-account",
                "3. Enable data events for S3 and Lambda",
                "4. Configure log retention in S3 (365 days)",
                "5. Enable CloudTrail Insights"
            ],
            quickWin: "Create organization trail with data events enabled",
            evidenceArtifact: "CloudTrail_Config.json"
        },
        gcp: {
            steps: [
                "1. Enable Cloud Audit Logs (Admin Activity auto-enabled)",
                "2. Enable Data Access logs for CUI resources",
                "3. Configure log retention (365 days)",
                "4. Export logs to Cloud Storage",
                "5. Enable Chronicle SIEM"
            ],
            quickWin: "Enable Data Access logs on all CUI projects",
            evidenceArtifact: "AuditLogs_Config.json"
        }
    },
    "3.3.1[b]": {
        azure: {
            steps: [
                "1. Configure Sentinel to capture user actions",
                "2. Enable sign-in and audit logs in Entra ID",
                "3. Configure activity alerts",
                "4. Create analytics rules for suspicious activity",
                "5. Test alert generation"
            ],
            quickWin: "Enable all Entra ID sign-in log categories",
            evidenceArtifact: "AuditLog_UserActions.json"
        },
        aws: {
            steps: [
                "1. Enable CloudTrail management events",
                "2. Configure IAM Access Analyzer",
                "3. Enable AWS Config rules for user actions",
                "4. Set up CloudWatch alerts",
                "5. Document user action logging"
            ],
            quickWin: "Enable CloudTrail management events in all regions",
            evidenceArtifact: "CloudTrail_ManagementEvents.json"
        },
        gcp: {
            steps: [
                "1. Verify Admin Activity logs enabled (default)",
                "2. Configure log-based alerting",
                "3. Create Cloud Monitoring alerts",
                "4. Set up log sinks for analysis",
                "5. Document logging architecture"
            ],
            quickWin: "Create log-based metrics for admin actions",
            evidenceArtifact: "AdminActivity_Logs.json"
        }
    },
    "3.3.2[a]": {
        azure: {
            steps: [
                "1. Configure Sentinel analytics rules for accountability",
                "2. Enable user and entity behavior analytics (UEBA)",
                "3. Create alert rules for unusual activity",
                "4. Document accountability in incident response",
                "5. Test alert accuracy"
            ],
            quickWin: "Enable Sentinel UEBA for user accountability",
            evidenceArtifact: "UEBA_Config.json"
        },
        aws: {
            steps: [
                "1. Enable CloudTrail with user identity logging",
                "2. Configure GuardDuty for anomaly detection",
                "3. Set up IAM Access Analyzer",
                "4. Create CloudWatch alarms for suspicious activity",
                "5. Document in SSP"
            ],
            quickWin: "Enable GuardDuty in all regions",
            evidenceArtifact: "GuardDuty_Config.json"
        },
        gcp: {
            steps: [
                "1. Enable Security Command Center Premium",
                "2. Configure Event Threat Detection",
                "3. Set up anomaly detection rules",
                "4. Create log-based alerts",
                "5. Document accountability measures"
            ],
            quickWin: "Enable Event Threat Detection in SCC",
            evidenceArtifact: "SCC_ThreatDetection.json"
        }
    },

    // === CONFIGURATION MANAGEMENT (3.4) ===
    "3.4.1[a]": {
        azure: {
            steps: [
                "1. Create Intune Configuration Profiles as baseline",
                "2. Import CIS or STIG benchmarks",
                "3. Document baseline settings in SSP",
                "4. Assign to device groups",
                "5. Monitor compliance status"
            ],
            quickWin: "Import Microsoft Security Baselines into Intune",
            evidenceArtifact: "Intune_Baselines.json"
        },
        aws: {
            steps: [
                "1. Create AMI golden images with hardened config",
                "2. Use AWS Config rules for compliance",
                "3. Deploy SSM State Manager associations",
                "4. Document baseline in SSP",
                "5. Automate compliance reporting"
            ],
            quickWin: "Enable AWS Config conformance pack for CIS benchmarks",
            evidenceArtifact: "Config_Baselines.json"
        },
        gcp: {
            steps: [
                "1. Create VM image templates with hardened config",
                "2. Deploy Organization Policies for guardrails",
                "3. Use Config Connector for IaC baselines",
                "4. Enable Security Health Analytics",
                "5. Document baselines in SSP"
            ],
            quickWin: "Deploy CIS benchmark Organization Policies",
            evidenceArtifact: "OrgPolicy_Baselines.json"
        }
    },
    "3.4.2[a]": {
        azure: {
            steps: [
                "1. Define security configuration settings in Intune",
                "2. Configure Defender security baselines",
                "3. Enable Windows Update for Business",
                "4. Document settings in SSP",
                "5. Monitor compliance"
            ],
            quickWin: "Deploy Windows Security Baseline via Intune",
            evidenceArtifact: "SecuritySettings_Config.json"
        },
        aws: {
            steps: [
                "1. Define security settings in SSM documents",
                "2. Create Config rules for security settings",
                "3. Deploy via State Manager",
                "4. Document in SSP",
                "5. Monitor compliance"
            ],
            quickWin: "Deploy CIS benchmarks via SSM associations",
            evidenceArtifact: "SSM_SecurityConfig.json"
        },
        gcp: {
            steps: [
                "1. Configure Organization Policy constraints",
                "2. Deploy security settings via Compute Engine policies",
                "3. Enable OS Config agent",
                "4. Document settings in SSP",
                "5. Monitor via Security Health Analytics"
            ],
            quickWin: "Enable restrictive Organization Policies",
            evidenceArtifact: "OrgPolicy_Security.json"
        }
    },

    // === IDENTIFICATION AND AUTHENTICATION (3.5) ===
    "3.5.1[a]": {
        azure: {
            steps: [
                "1. Navigate to Entra ID > Users",
                "2. Verify unique UPN for each user",
                "3. Configure naming convention policy",
                "4. Remove duplicate/shared accounts",
                "5. Document user identification in SSP"
            ],
            quickWin: "Export user list and verify uniqueness",
            evidenceArtifact: "UserIdentification.csv"
        },
        aws: {
            steps: [
                "1. List all IAM users and federated identities",
                "2. Verify unique usernames",
                "3. Remove shared credentials",
                "4. Document user identification process",
                "5. Enforce unique identifiers in IAM policy"
            ],
            quickWin: "Run credential report to identify shared accounts",
            evidenceArtifact: "IAM_CredentialReport.csv"
        },
        gcp: {
            steps: [
                "1. Review Cloud Identity users",
                "2. Verify unique email addresses",
                "3. Remove shared accounts",
                "4. Document identification policy",
                "5. Configure identity lifecycle"
            ],
            quickWin: "Export Cloud Identity user list for review",
            evidenceArtifact: "CloudIdentity_Users.csv"
        }
    },
    "3.5.3[a]": {
        azure: {
            steps: [
                "1. Navigate to Entra ID > Security > MFA",
                "2. Create Conditional Access policy requiring MFA",
                "3. Configure FIDO2 security keys",
                "4. Disable SMS/voice authentication",
                "5. Verify MFA for all users"
            ],
            quickWin: "Create CA policy: Require MFA for all users, all apps",
            evidenceArtifact: "MFA_Policy.json"
        },
        aws: {
            steps: [
                "1. Enable MFA for all IAM users",
                "2. Require MFA in IAM Identity Center",
                "3. Use hardware tokens or TOTP apps",
                "4. Create IAM policy requiring MFA",
                "5. Document MFA requirements"
            ],
            quickWin: "Enable MFA enforcement in IAM Identity Center",
            evidenceArtifact: "IAM_MFAStatus.json"
        },
        gcp: {
            steps: [
                "1. Navigate to Admin Console > Security > 2-Step Verification",
                "2. Enforce 2SV for all users",
                "3. Require security keys for admins",
                "4. Disable less secure methods",
                "5. Monitor enrollment status"
            ],
            quickWin: "Enforce 2SV with security keys for super admins",
            evidenceArtifact: "2SV_Enrollment.json"
        }
    },

    // === INCIDENT RESPONSE (3.6) ===
    "3.6.1[a]": {
        azure: {
            steps: [
                "1. Create incident response plan document",
                "2. Define roles and responsibilities",
                "3. Document escalation procedures",
                "4. Configure Sentinel playbooks for automation",
                "5. Schedule annual tabletop exercises"
            ],
            quickWin: "Create IR plan based on NIST 800-61 template",
            evidenceArtifact: "IR_Plan.pdf"
        },
        aws: {
            steps: [
                "1. Create incident response plan",
                "2. Define IAM roles for IR team",
                "3. Configure EventBridge rules for automated response",
                "4. Document escalation procedures",
                "5. Plan tabletop exercises"
            ],
            quickWin: "Create IR runbooks in AWS Systems Manager",
            evidenceArtifact: "IR_Plan.pdf"
        },
        gcp: {
            steps: [
                "1. Create incident response plan",
                "2. Define IAM roles for IR team",
                "3. Configure Pub/Sub notifications for SCC findings",
                "4. Document escalation procedures",
                "5. Schedule exercises"
            ],
            quickWin: "Create IR plan with GCP-specific procedures",
            evidenceArtifact: "IR_Plan.pdf"
        }
    },
    "3.6.2[a]": {
        azure: {
            steps: [
                "1. Configure Microsoft Sentinel for incident tracking",
                "2. Create incident response workflow",
                "3. Document DIBNet reporting procedures",
                "4. Obtain ECA certificate for DIBNet access",
                "5. Test reporting procedures"
            ],
            quickWin: "Enable Sentinel incident management with automated ticketing",
            evidenceArtifact: "Sentinel_Incidents.json"
        },
        aws: {
            steps: [
                "1. Configure Security Hub for incident aggregation",
                "2. Set up incident tracking in ServiceNow or similar",
                "3. Document DIBNet reporting procedures",
                "4. Train team on 72-hour reporting requirement",
                "5. Test procedures"
            ],
            quickWin: "Enable Security Hub findings aggregation",
            evidenceArtifact: "SecurityHub_Findings.json"
        },
        gcp: {
            steps: [
                "1. Configure Security Command Center for incident tracking",
                "2. Set up notification channels",
                "3. Document DIBNet reporting procedures",
                "4. Create incident ticketing integration",
                "5. Test reporting workflow"
            ],
            quickWin: "Enable SCC Premium for incident management",
            evidenceArtifact: "SCC_Incidents.json"
        }
    },

    // === MAINTENANCE (3.7) ===
    "3.7.1[a]": {
        azure: {
            steps: [
                "1. Enable Windows Update for Business via Intune",
                "2. Configure update rings for staged deployment",
                "3. Define maintenance windows",
                "4. Document maintenance schedule",
                "5. Monitor update compliance"
            ],
            quickWin: "Configure Intune update rings with 7-day deferral",
            evidenceArtifact: "UpdateRings_Config.json"
        },
        aws: {
            steps: [
                "1. Configure Systems Manager Patch Manager",
                "2. Define patch baselines",
                "3. Create maintenance windows",
                "4. Document maintenance procedures",
                "5. Monitor compliance"
            ],
            quickWin: "Create SSM maintenance window for weekly patching",
            evidenceArtifact: "PatchManager_Config.json"
        },
        gcp: {
            steps: [
                "1. Enable OS Patch Management",
                "2. Define patch policies",
                "3. Create maintenance schedules",
                "4. Document procedures",
                "5. Monitor patch compliance"
            ],
            quickWin: "Enable OS Config agent for patch management",
            evidenceArtifact: "OSPatch_Config.json"
        }
    },

    // === MEDIA PROTECTION (3.8) ===
    "3.8.1[a]": {
        azure: {
            steps: [
                "1. Configure BitLocker via Intune device configuration",
                "2. Require TPM + PIN for encryption",
                "3. Store recovery keys in Entra ID",
                "4. Monitor encryption status",
                "5. Document in SSP"
            ],
            quickWin: "Deploy BitLocker policy with TPM + startup PIN",
            evidenceArtifact: "BitLocker_Status.json"
        },
        aws: {
            steps: [
                "1. Enable EBS encryption by default",
                "2. Use KMS CMKs for encryption",
                "3. Configure SSM for endpoint encryption",
                "4. Verify EC2 volumes encrypted",
                "5. Document encryption status"
            ],
            quickWin: "Enable EBS encryption by default in all regions",
            evidenceArtifact: "EBS_Encryption.json"
        },
        gcp: {
            steps: [
                "1. Verify default encryption (Google-managed keys)",
                "2. Enable CMEK for CUI data",
                "3. Configure endpoint encryption policies",
                "4. Monitor encryption status",
                "5. Document in SSP"
            ],
            quickWin: "Enable CMEK encryption for CUI storage buckets",
            evidenceArtifact: "CMEK_Config.json"
        }
    },

    // === PHYSICAL PROTECTION (3.10) ===
    "3.10.1[a]": {
        azure: {
            steps: [
                "1. Document physical access controls in SSP",
                "2. For Azure: Rely on Microsoft datacenter controls (SOC 2)",
                "3. For on-prem: Deploy badge access system",
                "4. Create visitor log (SharePoint/PowerApps)",
                "5. Review access logs quarterly"
            ],
            quickWin: "Create SharePoint visitor log with Power Automate approval",
            evidenceArtifact: "VisitorLog.xlsx"
        },
        aws: {
            steps: [
                "1. Document reliance on AWS datacenter controls",
                "2. Reference AWS SOC 2 and FedRAMP reports",
                "3. For on-prem: Implement badge access",
                "4. Create visitor management system",
                "5. Document in SSP"
            ],
            quickWin: "Reference AWS Artifact compliance reports in SSP",
            evidenceArtifact: "PhysicalAccess_Policy.pdf"
        },
        gcp: {
            steps: [
                "1. Document reliance on Google datacenter controls",
                "2. Reference GCP SOC 2 and FedRAMP reports",
                "3. For on-prem: Implement access controls",
                "4. Create visitor log",
                "5. Document in SSP"
            ],
            quickWin: "Reference GCP compliance reports in SSP",
            evidenceArtifact: "PhysicalAccess_Policy.pdf"
        }
    },

    // === RISK ASSESSMENT (3.11) ===
    "3.11.1[a]": {
        azure: {
            steps: [
                "1. Enable Microsoft Defender for Cloud",
                "2. Review security recommendations",
                "3. Conduct risk assessment workshop",
                "4. Document risks in risk register",
                "5. Update SSP with risk assessment results"
            ],
            quickWin: "Enable Defender for Cloud and export recommendations",
            evidenceArtifact: "RiskAssessment.xlsx"
        },
        aws: {
            steps: [
                "1. Enable AWS Security Hub",
                "2. Run Inspector vulnerability scans",
                "3. Conduct risk assessment workshop",
                "4. Document in risk register",
                "5. Update SSP"
            ],
            quickWin: "Enable Security Hub with NIST 800-171 standard",
            evidenceArtifact: "RiskAssessment.xlsx"
        },
        gcp: {
            steps: [
                "1. Enable Security Command Center",
                "2. Review Security Health Analytics findings",
                "3. Conduct risk assessment workshop",
                "4. Document risks",
                "5. Update SSP"
            ],
            quickWin: "Enable SCC Security Health Analytics",
            evidenceArtifact: "RiskAssessment.xlsx"
        }
    },
    "3.11.2[a]": {
        azure: {
            steps: [
                "1. Enable Microsoft Defender Vulnerability Management",
                "2. Configure scan schedules",
                "3. Review vulnerabilities weekly",
                "4. Prioritize by CVSS score",
                "5. Track remediation in POA&M"
            ],
            quickWin: "Enable Defender Vulnerability Management on all devices",
            evidenceArtifact: "VulnScan_Report.json"
        },
        aws: {
            steps: [
                "1. Enable Amazon Inspector",
                "2. Configure automatic scanning",
                "3. Review findings weekly",
                "4. Prioritize by severity",
                "5. Track remediation"
            ],
            quickWin: "Enable Inspector for EC2, ECR, and Lambda",
            evidenceArtifact: "Inspector_Findings.json"
        },
        gcp: {
            steps: [
                "1. Enable Web Security Scanner",
                "2. Configure Container Analysis",
                "3. Review findings weekly",
                "4. Prioritize remediation",
                "5. Track in POA&M"
            ],
            quickWin: "Enable Container Analysis for all GCR images",
            evidenceArtifact: "VulnScan_Findings.json"
        }
    },

    // === SYSTEM AND COMMUNICATIONS PROTECTION (3.13) ===
    "3.13.1[a]": {
        azure: {
            steps: [
                "1. Define system boundary in architecture diagram",
                "2. Deploy Azure Firewall at perimeter",
                "3. Configure NSGs for internal segmentation",
                "4. Document boundary in SSP",
                "5. Monitor traffic flows"
            ],
            quickWin: "Deploy Azure Firewall with allow-list rules only",
            evidenceArtifact: "NetworkDiagram.png"
        },
        aws: {
            steps: [
                "1. Define VPC boundaries",
                "2. Configure security groups and NACLs",
                "3. Deploy AWS WAF for web apps",
                "4. Document boundary in SSP",
                "5. Enable VPC Flow Logs"
            ],
            quickWin: "Enable VPC Flow Logs in all VPCs",
            evidenceArtifact: "NetworkDiagram.png"
        },
        gcp: {
            steps: [
                "1. Define VPC boundaries",
                "2. Configure firewall rules",
                "3. Enable VPC Service Controls",
                "4. Document boundary in SSP",
                "5. Enable flow logs"
            ],
            quickWin: "Enable VPC Service Controls for CUI projects",
            evidenceArtifact: "NetworkDiagram.png"
        }
    },
    "3.13.8[a]": {
        azure: {
            steps: [
                "1. Document encryption requirements (TLS 1.2+)",
                "2. Configure Azure VPN with FIPS IPsec policy",
                "3. Enable TLS 1.2 minimum on all endpoints",
                "4. Deploy certificates via Azure Key Vault",
                "5. Test encryption configuration"
            ],
            quickWin: "Set TLS 1.2 minimum on all App Services and APIs",
            evidenceArtifact: "TLS_Config.json"
        },
        aws: {
            steps: [
                "1. Document encryption requirements",
                "2. Configure ALB security policies (TLS 1.2)",
                "3. Enable HTTPS-only on CloudFront",
                "4. Use ACM for certificate management",
                "5. Test encryption"
            ],
            quickWin: "Set ELBSecurityPolicy-TLS13-1-2-2021-06 on all ALBs",
            evidenceArtifact: "TLS_Config.json"
        },
        gcp: {
            steps: [
                "1. Document encryption requirements",
                "2. Configure Cloud VPN with AES-256-GCM",
                "3. Enable SSL policies on load balancers",
                "4. Use Google-managed SSL certificates",
                "5. Test encryption configuration"
            ],
            quickWin: "Create SSL policy requiring TLS 1.2+",
            evidenceArtifact: "TLS_Config.json"
        }
    },
    "3.13.11[a]": {
        azure: {
            steps: [
                "1. Enable BitLocker for endpoints via Intune",
                "2. Configure Azure Storage encryption (SSE)",
                "3. Enable Azure SQL TDE",
                "4. Use Key Vault for key management",
                "5. Document encryption in SSP"
            ],
            quickWin: "Enable CMK encryption on all storage accounts",
            evidenceArtifact: "Encryption_AtRest.json"
        },
        aws: {
            steps: [
                "1. Enable EBS encryption by default",
                "2. Configure S3 default encryption (SSE-KMS)",
                "3. Enable RDS encryption",
                "4. Use KMS CMKs for all encryption",
                "5. Document in SSP"
            ],
            quickWin: "Enable default S3 encryption with KMS CMK",
            evidenceArtifact: "Encryption_AtRest.json"
        },
        gcp: {
            steps: [
                "1. Verify Google-managed encryption (default)",
                "2. Enable CMEK for CUI data",
                "3. Configure Cloud KMS key rings",
                "4. Enable key rotation",
                "5. Document encryption architecture"
            ],
            quickWin: "Create CMEK keys for CUI storage",
            evidenceArtifact: "Encryption_AtRest.json"
        }
    },

    // === SYSTEM AND INFORMATION INTEGRITY (3.14) ===
    "3.14.1[a]": {
        azure: {
            steps: [
                "1. Enable Microsoft Defender for Endpoint",
                "2. Configure Defender Vulnerability Management",
                "3. Set up vulnerability scan schedules",
                "4. Review findings weekly",
                "5. Track remediation in POA&M"
            ],
            quickWin: "Enable Defender for Endpoint on all devices",
            evidenceArtifact: "DefenderVuln_Report.json"
        },
        aws: {
            steps: [
                "1. Enable Amazon Inspector",
                "2. Configure automatic scanning",
                "3. Enable Security Hub for aggregation",
                "4. Review findings weekly",
                "5. Track remediation"
            ],
            quickWin: "Enable Inspector across all AWS accounts",
            evidenceArtifact: "Inspector_Report.json"
        },
        gcp: {
            steps: [
                "1. Enable Security Command Center",
                "2. Configure Web Security Scanner",
                "3. Enable Container Analysis",
                "4. Review findings weekly",
                "5. Track remediation in POA&M"
            ],
            quickWin: "Enable SCC Premium for vulnerability findings",
            evidenceArtifact: "SCC_VulnReport.json"
        }
    },
    "3.14.2[a]": {
        azure: {
            steps: [
                "1. Enable Microsoft Defender Antivirus via Intune",
                "2. Configure real-time protection",
                "3. Enable cloud-delivered protection",
                "4. Set up automatic definition updates",
                "5. Monitor protection status"
            ],
            quickWin: "Deploy Defender Antivirus baseline via Intune",
            evidenceArtifact: "Defender_Status.json"
        },
        aws: {
            steps: [
                "1. Enable GuardDuty for threat detection",
                "2. Deploy endpoint protection (third-party or SSM)",
                "3. Configure malware scanning for S3",
                "4. Monitor findings",
                "5. Document protection measures"
            ],
            quickWin: "Enable GuardDuty Malware Protection for EC2",
            evidenceArtifact: "GuardDuty_Findings.json"
        },
        gcp: {
            steps: [
                "1. Enable Security Command Center Premium",
                "2. Configure Container Threat Detection",
                "3. Deploy endpoint protection on GCE instances",
                "4. Monitor threat findings",
                "5. Document protection measures"
            ],
            quickWin: "Enable Container Threat Detection in SCC",
            evidenceArtifact: "SCC_ThreatFindings.json"
        }
    },
    "3.14.6[a]": {
        azure: {
            steps: [
                "1. Enable Sentinel for security monitoring",
                "2. Configure analytics rules for threats",
                "3. Enable UEBA for behavioral analysis",
                "4. Set up alert notifications",
                "5. Create incident response workflows"
            ],
            quickWin: "Enable Sentinel UEBA and threat analytics",
            evidenceArtifact: "Sentinel_Monitoring.json"
        },
        aws: {
            steps: [
                "1. Enable GuardDuty for threat detection",
                "2. Configure Security Hub for monitoring",
                "3. Set up EventBridge rules for alerts",
                "4. Enable Detective for investigation",
                "5. Document monitoring architecture"
            ],
            quickWin: "Enable GuardDuty in all regions and accounts",
            evidenceArtifact: "GuardDuty_Status.json"
        },
        gcp: {
            steps: [
                "1. Enable Security Command Center Premium",
                "2. Configure Event Threat Detection",
                "3. Set up Chronicle SIEM",
                "4. Create Pub/Sub notifications",
                "5. Document monitoring architecture"
            ],
            quickWin: "Enable SCC Event Threat Detection",
            evidenceArtifact: "SCC_ThreatDetection.json"
        }
    }
};

// Helper function to get implementation notes for an objective
function getImplNotes(objectiveId, cloud = 'azure') {
    const notes = IMPL_NOTES[objectiveId];
    if (!notes) return null;
    return notes[cloud] || notes.azure || null;
}

// Get all clouds with notes for an objective
function getAvailableCloudsForNotes(objectiveId) {
    const notes = IMPL_NOTES[objectiveId];
    if (!notes) return [];
    return Object.keys(notes);
}
