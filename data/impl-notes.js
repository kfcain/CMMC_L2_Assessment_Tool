// Implementation Notes for Assessment Objectives
// Provides comprehensive guidance for implementing each CMMC L2 control objective
// Includes technical implementation, human-in-the-loop, policy/procedural, and evidence collection

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
            evidenceArtifact: "AC_UserList.csv",
            humanInTheLoop: [
                "HR Manager must validate user list against employment records quarterly",
                "FSO must approve any additions to CUI-accessing user groups",
                "Department managers must certify their team's access needs annually"
            ],
            policyEvidence: [
                "Access Control Policy documenting user authorization process",
                "User Account Management Procedure (onboarding/offboarding)",
                "Signed Acceptable Use Agreements for each user"
            ],
            manualEvidence: [
                "Screenshot of Entra ID user list with filter applied",
                "Quarterly access review meeting minutes",
                "HR certification letter confirming employment status"
            ],
            evidenceMethodology: "Export user list via Graph API weekly. Compare against HR HRIS export. Document discrepancies in access review log. Retain JSON exports for 1 year."
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
            evidenceArtifact: "IAM_CredentialReport.csv",
            humanInTheLoop: [
                "HR must validate IAM users against employment records",
                "Security team must approve new IAM user creation",
                "Managers must certify direct reports' access quarterly"
            ],
            policyEvidence: [
                "IAM User Management Policy",
                "Account Provisioning/Deprovisioning Procedure",
                "AWS Access Request Form template"
            ],
            manualEvidence: [
                "IAM credential report screenshot",
                "Access review spreadsheet with manager sign-off",
                "Terminated user removal confirmation emails"
            ],
            evidenceMethodology: "Generate credential report weekly. Cross-reference with HR termination list. Archive reports in S3 with Object Lock."
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
            evidenceArtifact: "CloudIdentity_Users.csv",
            humanInTheLoop: [
                "HR validates user accounts against employment records",
                "IT Admin approves new account creation requests",
                "Department heads certify team access needs"
            ],
            policyEvidence: [
                "Identity Management Policy",
                "User Lifecycle Management Procedure",
                "Access Request and Approval Form"
            ],
            manualEvidence: [
                "Cloud Identity user export screenshot",
                "Access certification spreadsheet",
                "Offboarding checklist completion records"
            ],
            evidenceMethodology: "Export user list from Admin Console monthly. Compare with HR system. Document in access review tracker."
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
            evidenceArtifact: "AC_ServicePrincipals.json",
            humanInTheLoop: [
                "Application owner must document business justification for each service principal",
                "Security team reviews service principal permissions quarterly",
                "IT Admin must approve new service principal creation"
            ],
            policyEvidence: [
                "Service Account Management Policy",
                "Non-Person Entity (NPE) Registration Procedure",
                "Service Principal Inventory Spreadsheet with owners"
            ],
            manualEvidence: [
                "Service principal inventory with owner assignments",
                "Business justification forms for each service account",
                "Quarterly review meeting minutes"
            ],
            evidenceMethodology: "Export service principals monthly via Graph API. Maintain ownership registry in SharePoint. Review unused accounts (no sign-ins >90 days) quarterly."
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
            evidenceArtifact: "IAM_Roles.json",
            humanInTheLoop: [
                "Application owner must justify each IAM role",
                "Security team reviews trust policies quarterly",
                "CloudOps approves new role creation"
            ],
            policyEvidence: [
                "IAM Role Management Policy",
                "Service Account Governance Procedure",
                "Role inventory with business owners"
            ],
            manualEvidence: [
                "IAM role inventory spreadsheet",
                "Trust policy review documentation",
                "Unused role removal tickets"
            ],
            evidenceMethodology: "Run IAM Access Analyzer monthly. Document findings. Track role usage via CloudTrail. Archive reports in S3."
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
            evidenceArtifact: "ServiceAccounts.json",
            humanInTheLoop: [
                "Application owner must document each service account purpose",
                "Security reviews service account permissions quarterly",
                "IT approves new service account requests"
            ],
            policyEvidence: [
                "Service Account Policy",
                "Workload Identity Procedure",
                "Service account registry with owners"
            ],
            manualEvidence: [
                "Service account inventory export",
                "Key rotation evidence",
                "Quarterly review documentation"
            ],
            evidenceMethodology: "Export service accounts monthly. Use Recommender to identify unused accounts. Document in Cloud Asset Inventory."
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
            evidenceArtifact: "Intune_DeviceInventory.json",
            humanInTheLoop: [
                "IT Admin reviews device enrollment requests",
                "FSO approves BYOD exceptions (if any)",
                "Help desk processes device retirement/wipe requests"
            ],
            policyEvidence: [
                "Device Management Policy (corporate vs BYOD)",
                "Endpoint Compliance Requirements document",
                "Device Retirement/Sanitization Procedure"
            ],
            manualEvidence: [
                "Device inventory spreadsheet with assigned users",
                "Non-compliant device remediation tickets",
                "Device wipe confirmation logs"
            ],
            evidenceMethodology: "Export Intune device compliance report weekly. Track non-compliant devices in ticketing system. Require remediation within 7 days or block access."
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
            evidenceArtifact: "SSM_ManagedInstances.json",
            humanInTheLoop: [
                "IT Admin verifies SSM agent deployment on new instances",
                "Security reviews compliance status weekly",
                "Operations handles non-compliant instance remediation"
            ],
            policyEvidence: [
                "Endpoint Management Policy",
                "SSM Agent Deployment Procedure",
                "Instance Compliance Requirements"
            ],
            manualEvidence: [
                "SSM managed instances report",
                "Compliance status dashboard screenshot",
                "Remediation action tickets"
            ],
            evidenceMethodology: "Query SSM inventory daily. Track compliance via AWS Config. Alert on unmanaged instances. Archive reports in S3."
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
            evidenceArtifact: "EndpointVerification_Devices.csv",
            humanInTheLoop: [
                "IT Admin reviews device enrollment requests",
                "Security approves Context-Aware Access policy changes",
                "Help desk processes device removal requests"
            ],
            policyEvidence: [
                "Endpoint Verification Policy",
                "Device Trust Requirements",
                "BYOD Acceptable Use Policy (if applicable)"
            ],
            manualEvidence: [
                "Endpoint verification enrollment report",
                "Context-Aware Access policy screenshot",
                "Device trust level assignments"
            ],
            evidenceMethodology: "Export device inventory from Admin Console monthly. Monitor Context-Aware Access denials. Document in compliance tracker."
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
            evidenceArtifact: "RBAC_RoleDefinitions.json",
            humanInTheLoop: [
                "HR/Management must define job functions and responsibilities",
                "Security team maps job functions to technical access",
                "Business owners validate role assignments for their teams"
            ],
            policyEvidence: [
                "Role-Based Access Control Policy",
                "Job Function to Role Mapping Matrix",
                "Principle of Least Privilege Standard"
            ],
            manualEvidence: [
                "Completed role mapping matrix spreadsheet",
                "Management approval of role definitions",
                "Annual role review meeting minutes"
            ],
            evidenceMethodology: "Document role mapping in spreadsheet. Get management sign-off. Export RBAC definitions quarterly. Compare against job descriptions annually."
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
            evidenceArtifact: "IAM_Policies.json",
            humanInTheLoop: [
                "HR defines job functions and duties",
                "Security creates corresponding IAM policies",
                "Managers validate team member role assignments"
            ],
            policyEvidence: [
                "IAM Policy Management Standard",
                "Job Function Access Matrix",
                "Permission Boundary Policy"
            ],
            manualEvidence: [
                "Job function to policy mapping document",
                "IAM policy review approvals",
                "Access matrix with management sign-off"
            ],
            evidenceMethodology: "Maintain access matrix in documentation. Use Access Analyzer for policy validation. Review and update quarterly."
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
            evidenceArtifact: "IAM_Roles.json",
            humanInTheLoop: [
                "HR defines organizational job functions",
                "Security team creates role mappings",
                "Department heads validate access for their teams"
            ],
            policyEvidence: [
                "GCP IAM Role Assignment Policy",
                "Job Function Access Matrix",
                "Custom Role Creation Standard"
            ],
            manualEvidence: [
                "Role mapping spreadsheet",
                "IAM Recommender review documentation",
                "Management approval records"
            ],
            evidenceMethodology: "Document role mappings. Run IAM Recommender monthly. Archive role binding exports. Review with management quarterly."
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
            evidenceArtifact: "PIM_PrivilegedAccounts.json",
            humanInTheLoop: [
                "Executive sponsor must approve privileged account list",
                "FSO reviews and validates business need quarterly",
                "IT Director approves new privileged access requests"
            ],
            policyEvidence: [
                "Privileged Access Management Policy",
                "Administrator Account Standards",
                "PIM Activation Approval Procedure"
            ],
            manualEvidence: [
                "Signed privileged account authorization forms",
                "Quarterly access review completion records",
                "PIM activation audit logs with approver names"
            ],
            evidenceMethodology: "Export PIM eligible/active assignments weekly. Conduct quarterly access reviews with business justification. Maintain signed authorization forms for each privileged account."
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
            evidenceArtifact: "IAM_AdminUsers.json",
            humanInTheLoop: [
                "Security team validates admin user list",
                "Management approves each admin account",
                "Quarterly review with business justification"
            ],
            policyEvidence: [
                "Privileged User Management Policy",
                "AWS Admin Account Standard",
                "Root Account Usage Policy"
            ],
            manualEvidence: [
                "Admin account authorization forms",
                "Quarterly review meeting minutes",
                "MFA enrollment verification screenshots"
            ],
            evidenceMethodology: "Generate IAM credential report weekly. Document admin accounts with justification. Conduct quarterly reviews with sign-off. Archive in S3 with versioning."
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
            evidenceArtifact: "IAM_PrivilegedBindings.json",
            humanInTheLoop: [
                "Security reviews privileged role assignments",
                "Management approves each privileged account",
                "Quarterly access review with justification"
            ],
            policyEvidence: [
                "GCP Privileged Access Policy",
                "Super Admin Account Standards",
                "Organization Admin Procedure"
            ],
            manualEvidence: [
                "Privileged account authorization forms",
                "Access review completion records",
                "Security key enrollment evidence"
            ],
            evidenceMethodology: "Export IAM bindings monthly. Document privileged accounts with business justification. Conduct quarterly reviews. Archive in Cloud Storage."
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
            humanInTheLoop: [
                "Legal/Compliance must approve banner text content",
                "FSO validates banner meets DoD/DFARS requirements",
                "IT verifies banner displays on all access paths"
            ],
            policyEvidence: [
                "System Use Notification Policy",
                "Approved banner text document (signed by Legal)",
                "Terms of Use acceptance tracking procedure"
            ],
            manualEvidence: [
                "Screenshot of login banner on Windows endpoint",
                "Screenshot of Terms of Use in web portal",
                "User acceptance log export from Entra ID"
            ],
            evidenceMethodology: "Capture banner screenshots from each device type (Windows, Mac, mobile, web). Export ToU acceptance logs monthly. Document any users who haven't accepted.",
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
            evidenceArtifact: "SystemBanner_Deployment.json",
            humanInTheLoop: [
                "Legal approves banner text",
                "Security validates banner deployment coverage",
                "IT tests banner on all system entry points"
            ],
            policyEvidence: [
                "System Use Notification Policy",
                "Banner Text Approval Document",
                "SSM Document for banner deployment"
            ],
            manualEvidence: [
                "Screenshot of SSO login page with banner",
                "Screenshot of EC2 SSH login banner",
                "SSM compliance report showing banner deployment"
            ],
            evidenceMethodology: "Deploy banner via SSM State Manager. Capture screenshots from each entry point. Document in evidence repository. Verify monthly."
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
            evidenceArtifact: "LoginBanner_Config.json",
            humanInTheLoop: [
                "Legal approves banner content",
                "Security validates all access points covered",
                "IT tests user acknowledgment flow"
            ],
            policyEvidence: [
                "System Use Notification Policy",
                "Banner Text Approval (Legal sign-off)",
                "Workspace Login Customization Procedure"
            ],
            manualEvidence: [
                "Screenshot of Workspace login page",
                "Screenshot of VM SSH banner",
                "Terms of Use acceptance report"
            ],
            evidenceMethodology: "Configure custom login page. Deploy startup scripts for VM banners. Capture screenshots. Export acceptance logs monthly."
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
            evidenceArtifact: "Intune_ScreenLock.json",
            humanInTheLoop: [
                "Security defines acceptable inactivity timeout (max 15 min)",
                "IT validates policy deployment across all device types",
                "Help desk handles user exception requests"
            ],
            policyEvidence: [
                "Session Lock Policy (15-min requirement)",
                "Endpoint Security Baseline Standard",
                "Exception Request Procedure"
            ],
            manualEvidence: [
                "Intune compliance report showing screen lock status",
                "Screenshot of Settings Catalog configuration",
                "Test verification on sample device"
            ],
            evidenceMethodology: "Export Intune compliance report weekly. Document non-compliant devices. Test screen lock on sample devices during audit. Retain configuration screenshots."
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
            evidenceArtifact: "SSM_ScreenLock.json",
            humanInTheLoop: [
                "Security approves screen lock timeout value",
                "IT validates SSM association deployment",
                "Operations monitors compliance status"
            ],
            policyEvidence: [
                "Session Lock Policy",
                "SSM State Manager Configuration Standard",
                "Workstation Security Baseline"
            ],
            manualEvidence: [
                "SSM compliance report",
                "Screenshot of SSM document configuration",
                "Test verification log"
            ],
            evidenceMethodology: "Run SSM compliance scan weekly. Export compliance report. Test on sample instances. Document in evidence repository."
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
            evidenceArtifact: "Workspace_ScreenLock.json",
            humanInTheLoop: [
                "Security defines timeout requirement",
                "IT deploys Chrome policies",
                "Operations validates compliance"
            ],
            policyEvidence: [
                "Session Lock Policy",
                "Chrome Enterprise Configuration Standard",
                "Endpoint Security Baseline"
            ],
            manualEvidence: [
                "Admin Console policy screenshot",
                "Chrome policy export",
                "Test verification on enrolled device"
            ],
            evidenceMethodology: "Export Chrome policies from Admin Console. Test on sample devices. Document compliance status monthly."
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
            evidenceArtifact: "VPN_Config.json",
            humanInTheLoop: [
                "FSO must approve each remote access method",
                "IT documents approved VPN/AVD configurations",
                "Security reviews remote access logs weekly"
            ],
            policyEvidence: [
                "Remote Access Policy (approved methods)",
                "Telework Agreement template",
                "VPN Usage Acceptable Use Policy"
            ],
            manualEvidence: [
                "Network diagram showing remote access paths",
                "Signed telework agreements for remote workers",
                "Weekly remote access log review sign-off"
            ],
            evidenceMethodology: "Document approved remote access methods in SSP. Maintain signed telework agreements. Export VPN connection logs weekly. Review for anomalies."
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
            evidenceArtifact: "ClientVPN_Config.json",
            humanInTheLoop: [
                "Security approves VPN configuration",
                "IT manages certificate issuance",
                "Operations reviews connection logs"
            ],
            policyEvidence: [
                "Remote Access Policy",
                "Certificate Management Procedure",
                "VPN Authorization Rules document"
            ],
            manualEvidence: [
                "Client VPN endpoint configuration screenshot",
                "Certificate authority setup documentation",
                "CloudWatch VPN connection logs"
            ],
            evidenceMethodology: "Export Client VPN configuration. Archive CloudWatch logs. Review connection patterns weekly. Document in evidence repository."
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
            evidenceArtifact: "CloudVPN_Config.json",
            humanInTheLoop: [
                "Security approves IAP/VPN configurations",
                "IT manages tunnel setup",
                "Operations reviews access logs"
            ],
            policyEvidence: [
                "Remote Access Policy",
                "BeyondCorp Implementation Guide",
                "IAP Access Policy document"
            ],
            manualEvidence: [
                "Cloud VPN tunnel status screenshot",
                "IAP configuration export",
                "Access logs from Cloud Logging"
            ],
            evidenceMethodology: "Export VPN and IAP configurations. Monitor access via Cloud Logging. Review patterns weekly. Archive in Cloud Storage."
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
            evidenceArtifact: "DeviceControl_USBBlock.json",
            humanInTheLoop: [
                "FSO approves list of authorized portable storage devices",
                "IT maintains inventory of FIPS-encrypted USB drives",
                "Security reviews USB block events for policy violations"
            ],
            policyEvidence: [
                "Portable Storage Device Policy",
                "Approved USB Device List (with serial numbers)",
                "Media Handling and Transport Procedure"
            ],
            manualEvidence: [
                "Device Control policy configuration screenshot",
                "Authorized USB device inventory spreadsheet",
                "USB block event logs showing enforcement"
            ],
            evidenceMethodology: "Export Device Control policy configuration. Maintain signed USB device issuance log. Review block events weekly. Conduct spot checks during physical audits."
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
            evidenceArtifact: "SSM_USBBlock.json",
            humanInTheLoop: [
                "Security approves USB blocking policy",
                "IT manages approved device exceptions",
                "Operations monitors compliance status"
            ],
            policyEvidence: [
                "Removable Media Policy",
                "Approved Device Exception List",
                "SSM Document for USB Control"
            ],
            manualEvidence: [
                "SSM document configuration",
                "Compliance status report",
                "Exception approval records"
            ],
            evidenceMethodology: "Deploy via SSM State Manager. Run compliance scans weekly. Document exceptions with approval. Archive reports in S3."
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
            evidenceArtifact: "ChromePolicy_USB.json",
            humanInTheLoop: [
                "Security defines USB blocking requirements",
                "IT configures and deploys policies",
                "FSO approves any exceptions"
            ],
            policyEvidence: [
                "Removable Storage Policy",
                "Chrome Enterprise Configuration Standard",
                "Exception Request Procedure"
            ],
            manualEvidence: [
                "Admin Console policy screenshot",
                "Chrome policy export",
                "Exception approval documentation"
            ],
            evidenceMethodology: "Export Chrome policies from Admin Console. Test on enrolled devices. Document exceptions. Review compliance monthly."
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
            evidenceArtifact: "Training_CompletionReport.csv",
            humanInTheLoop: [
                "FSO defines required training topics (CUI handling, insider threat, etc.)",
                "HR tracks training completion and follows up on delinquent users",
                "Managers certify team members have completed required training"
            ],
            policyEvidence: [
                "Security Awareness Training Policy",
                "Training Requirements Matrix (by role)",
                "Training Curriculum document (topics covered)"
            ],
            manualEvidence: [
                "LMS/Defender training completion report",
                "Signed training acknowledgment forms",
                "Training attendance sheets (if in-person)"
            ],
            evidenceMethodology: "Export training completion report monthly. Track delinquent users. Require manager sign-off on team completion. Maintain signed acknowledgment forms. Retain for duration of employment + 3 years."
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
            evidenceArtifact: "LMS_CompletionReport.csv",
            humanInTheLoop: [
                "FSO/Security defines training requirements",
                "HR assigns training to new hires within 30 days",
                "Managers follow up on incomplete training"
            ],
            policyEvidence: [
                "Security Awareness Training Policy",
                "New Hire Training Checklist",
                "Annual Training Requirements"
            ],
            manualEvidence: [
                "LMS completion report export",
                "Signed training acknowledgments",
                "New hire training completion records"
            ],
            evidenceMethodology: "Export LMS reports monthly. Track completion rates. Follow up on delinquent users. Archive in S3 or document repository."
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
            evidenceArtifact: "Workspace_TrainingReport.csv",
            humanInTheLoop: [
                "FSO defines training content requirements",
                "HR assigns and tracks completion",
                "Managers certify team completion"
            ],
            policyEvidence: [
                "Security Awareness Training Policy",
                "Training Curriculum and Schedule",
                "Role-Based Training Requirements"
            ],
            manualEvidence: [
                "Workspace Learning completion report",
                "Signed acknowledgment forms",
                "Phishing simulation results"
            ],
            evidenceMethodology: "Export completion reports from Admin Console monthly. Run phishing simulations quarterly. Document completion rates. Archive reports."
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
            evidenceArtifact: "InsiderThreat_Training.csv",
            humanInTheLoop: [
                "FSO develops insider threat training content with HR",
                "Managers identify high-risk roles requiring enhanced training",
                "HR tracks completion and escalates non-compliance"
            ],
            policyEvidence: [
                "Insider Threat Program Policy",
                "Insider Threat Training Curriculum",
                "Reporting Procedures for Suspicious Behavior"
            ],
            manualEvidence: [
                "Training completion certificates",
                "Signed acknowledgment of insider threat policy",
                "Attendance records for in-person sessions"
            ],
            evidenceMethodology: "Track completion in LMS. Require signed acknowledgments. Document escalation for non-compliance. Retain records for employment duration + 3 years."
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
            evidenceArtifact: "InsiderThreat_Training.csv",
            humanInTheLoop: [
                "Security develops insider threat content",
                "HR assigns during onboarding",
                "Managers verify team completion"
            ],
            policyEvidence: [
                "Insider Threat Program Policy",
                "Training Content Outline",
                "Behavioral Indicators Guide"
            ],
            manualEvidence: [
                "LMS completion report",
                "Signed policy acknowledgments",
                "New hire training checklist"
            ],
            evidenceMethodology: "Export LMS reports quarterly. Track completion rates. Follow up on delinquent users. Archive reports."
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
            evidenceArtifact: "InsiderThreat_Training.csv",
            humanInTheLoop: [
                "Security develops training content",
                "HR manages assignments",
                "Managers verify completion"
            ],
            policyEvidence: [
                "Insider Threat Program Policy",
                "Training Curriculum",
                "Suspicious Activity Reporting Procedure"
            ],
            manualEvidence: [
                "Workspace Learning completion report",
                "Signed acknowledgments",
                "Attendance records"
            ],
            evidenceMethodology: "Export completion reports quarterly. Require signed acknowledgments. Document in compliance tracker."
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
            evidenceArtifact: "Sentinel_DataConnectors.json",
            humanInTheLoop: [
                "Security team defines audit events to capture",
                "FSO reviews audit logs weekly for anomalies",
                "IT Admin responds to log ingestion failures"
            ],
            policyEvidence: [
                "Audit and Accountability Policy",
                "Log Retention Schedule (365 days min)",
                "Log Review Procedure (weekly sign-off)"
            ],
            manualEvidence: [
                "Sentinel data connector status screenshot",
                "Weekly log review sign-off sheets",
                "Log retention configuration documentation"
            ],
            evidenceMethodology: "Export Sentinel data connector status weekly. Conduct weekly log reviews with documented sign-off. Archive log review findings. Verify retention settings quarterly."
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
            evidenceArtifact: "CloudTrail_Config.json",
            humanInTheLoop: [
                "Security defines audit requirements",
                "FSO reviews CloudTrail logs weekly",
                "Operations monitors trail health"
            ],
            policyEvidence: [
                "Audit Logging Policy",
                "CloudTrail Configuration Standard",
                "Log Review Procedure"
            ],
            manualEvidence: [
                "CloudTrail configuration screenshot",
                "Weekly log review documentation",
                "S3 lifecycle policy for retention"
            ],
            evidenceMethodology: "Export CloudTrail configuration. Review logs weekly via Athena queries. Document findings. Verify S3 Object Lock for integrity."
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
            evidenceArtifact: "AuditLogs_Config.json",
            humanInTheLoop: [
                "Security defines logging requirements",
                "FSO reviews audit logs weekly",
                "IT monitors log export jobs"
            ],
            policyEvidence: [
                "Audit Logging Policy",
                "Cloud Audit Log Configuration Standard",
                "Log Review Procedure"
            ],
            manualEvidence: [
                "Audit log configuration screenshot",
                "Weekly log review sign-off",
                "Log sink configuration"
            ],
            evidenceMethodology: "Export audit log configuration. Review logs weekly via Chronicle or BigQuery. Document findings. Verify retention settings."
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
    },

    // === AUDIT AND ACCOUNTABILITY (3.3) - Expanded ===
    "3.3.3[a]": {
        azure: {
            steps: ["1. Review current audit events in Microsoft Purview Audit", "2. Enable Advanced Audit for enhanced logging", "3. Configure Log Analytics retention policies", "4. Document audit event categories", "5. Schedule quarterly reviews"],
            quickWin: "Enable Purview Advanced Audit and extend retention to 1 year",
            evidenceArtifact: "AuditConfig_Review.json",
            humanInTheLoop: ["Security reviews audit events quarterly", "Compliance validates audit scope", "IT confirms log retention meets policy"],
            policyEvidence: ["Audit and Accountability Policy", "Audit Event Configuration Procedure", "Quarterly Audit Review Checklist"]
        },
        aws: {
            steps: ["1. Review CloudTrail configuration", "2. Audit S3 data events and Lambda invocations", "3. Review VPC Flow Logs", "4. Document audit changes", "5. Schedule quarterly reviews"],
            quickWin: "Enable CloudTrail Insights for anomaly detection",
            evidenceArtifact: "CloudTrail_ConfigReview.json"
        },
        gcp: {
            steps: ["1. Review Cloud Audit Logs configuration", "2. Enable Data Access logs for critical resources", "3. Configure log router retention", "4. Document audit decisions", "5. Schedule quarterly reviews"],
            quickWin: "Enable Data Access logs for BigQuery and Cloud Storage",
            evidenceArtifact: "AuditLogs_Config.json"
        }
    },
    "3.3.4[a]": {
        azure: {
            steps: ["1. Configure Azure Monitor alerts for log ingestion failures", "2. Set up Sentinel health monitoring", "3. Create alert rules for Log Analytics issues", "4. Configure notifications for audit failures", "5. Document alerting procedures"],
            quickWin: "Create alert rule: Log Analytics data ingestion stopped",
            evidenceArtifact: "AuditFailure_Alerts.json",
            humanInTheLoop: ["SOC responds to audit failure alerts within 1 hour", "IT Operations investigates and restores logging", "Security documents incident"],
            policyEvidence: ["Audit Failure Response Procedure", "Logging System Health Monitoring Standard", "Alert Escalation Matrix"]
        },
        aws: {
            steps: ["1. Create CloudWatch alarms for CloudTrail delivery failures", "2. Monitor S3 bucket metrics for log delivery", "3. Set up SNS notifications", "4. Configure EventBridge rules", "5. Document response procedures"],
            quickWin: "Create CloudWatch alarm: CloudTrailDeliveryFailure metric",
            evidenceArtifact: "CloudTrail_HealthAlerts.json"
        },
        gcp: {
            steps: ["1. Configure Cloud Monitoring alerts for audit log sinks", "2. Monitor log router health metrics", "3. Set up notification channels", "4. Create uptime checks", "5. Document response procedures"],
            quickWin: "Create alert policy for log sink export failures",
            evidenceArtifact: "LogSink_HealthAlerts.json"
        }
    },
    "3.3.7[a]": {
        azure: {
            steps: ["1. Verify Windows time sync to time.windows.com", "2. Configure Linux VMs to sync with Azure NTP", "3. Verify domain controllers are authoritative", "4. Document time sync architecture", "5. Monitor time drift"],
            quickWin: "Verify: `w32tm /query /status` on Windows, `timedatectl` on Linux",
            evidenceArtifact: "TimeSync_Config.txt",
            humanInTheLoop: ["IT Admin verifies time sync during VM deployment", "Security validates time correlation in log analysis"],
            policyEvidence: ["Time Synchronization Standard", "System Configuration Baseline"]
        },
        aws: {
            steps: ["1. Verify EC2 instances use Amazon Time Sync (169.254.169.123)", "2. Configure chrony/ntpd", "3. Verify containers use host time", "4. Document time source", "5. Monitor time drift"],
            quickWin: "Verify: `chronyc sources` shows Amazon Time Sync",
            evidenceArtifact: "TimeSync_Status.txt"
        },
        gcp: {
            steps: ["1. Verify VMs use Google NTP (metadata.google.internal)", "2. Configure explicit NTP if needed", "3. Verify GKE time sync", "4. Document time source", "5. Monitor accuracy"],
            quickWin: "Verify: `timedatectl show` displays Google NTP source",
            evidenceArtifact: "TimeSync_GCP.txt"
        }
    },

    // === CONFIGURATION MANAGEMENT (3.4) - Expanded ===
    "3.4.3[a]": {
        azure: {
            steps: ["1. Implement Azure DevOps/GitHub for infrastructure as code", "2. Configure branch protection with PR reviews", "3. Enable Azure Policy for drift detection", "4. Use Deployment Environments for staging", "5. Document change tracking"],
            quickWin: "Enable Azure Policy compliance scanning for drift detection",
            evidenceArtifact: "ChangeTracking_Config.json",
            humanInTheLoop: ["Change requester submits PR with justification", "Security reviews security-impacting changes", "CAB approves production deployments"],
            policyEvidence: ["Configuration Management Policy", "Change Management Procedure", "Infrastructure as Code Standards"]
        },
        aws: {
            steps: ["1. Use CloudFormation/CDK with source control", "2. Enable AWS Config for tracking", "3. Configure Config rules for compliance", "4. Use CodePipeline for deployments", "5. Document changes"],
            quickWin: "Enable AWS Config with required-tags and approved-amis rules",
            evidenceArtifact: "AWSConfig_ChangeHistory.json"
        },
        gcp: {
            steps: ["1. Use Terraform with source control", "2. Enable Cloud Asset Inventory", "3. Configure SCC for drift", "4. Use Cloud Build for deployments", "5. Document changes"],
            quickWin: "Enable Cloud Asset Inventory real-time feed to BigQuery",
            evidenceArtifact: "AssetInventory_Changes.json"
        }
    },
    "3.4.5[a]": {
        azure: {
            steps: ["1. Define who can make system changes in policy", "2. Restrict Azure subscription Owner/Contributor", "3. Use PIM for just-in-time admin access", "4. Require approval workflow for privileged ops", "5. Document access restrictions"],
            quickWin: "Enable PIM approval workflow for subscription-level changes",
            evidenceArtifact: "ChangeAccess_Restrictions.json",
            humanInTheLoop: ["IT Director approves change access", "Security validates restrictions quarterly", "PIM approver authorizes JIT access"],
            policyEvidence: ["Change Access Control Policy", "Privileged Access Management Procedure", "Change Authorization Matrix"]
        },
        aws: {
            steps: ["1. Define change access in IAM policies", "2. Use permission boundaries", "3. Require MFA for destructive operations", "4. Use Organizations SCPs for guardrails", "5. Document restrictions"],
            quickWin: "Create SCP requiring MFA for sensitive operations",
            evidenceArtifact: "IAM_ChangeAccess_Policy.json"
        },
        gcp: {
            steps: ["1. Define change access in IAM roles", "2. Use IAM Conditions for context-aware access", "3. Require org admin approval for org changes", "4. Use Organization Policies", "5. Document restrictions"],
            quickWin: "Add IAM Condition requiring justification for privileged roles",
            evidenceArtifact: "IAM_ChangeAccess_Bindings.json"
        }
    },
    "3.4.7[c]": {
        azure: {
            steps: ["1. Document required ports per application", "2. Configure NSGs with deny-all default", "3. Use Azure Firewall for centralized control", "4. Enable JIT VM access for management ports", "5. Scan for unauthorized open ports"],
            quickWin: "Enable Defender recommendation: Close management ports",
            evidenceArtifact: "NSG_PortRestrictions.json",
            humanInTheLoop: ["Application owner requests required ports", "Security approves port openings", "Network team implements NSG rules"],
            policyEvidence: ["Network Port Management Policy", "Approved Port List by Application", "JIT Access Procedure"]
        },
        aws: {
            steps: ["1. Document required ports per workload", "2. Configure Security Groups minimally", "3. Use VPC Flow Logs for analysis", "4. Enable Inspector for open port findings", "5. Remediate unauthorized ports"],
            quickWin: "Enable Security Hub CIS control: VPC security group port restriction",
            evidenceArtifact: "SecurityGroup_PortConfig.json"
        },
        gcp: {
            steps: ["1. Document required ports", "2. Configure VPC firewall with specific ports", "3. Use Firewall Insights for analysis", "4. Enable SCC for open port findings", "5. Remediate unauthorized ports"],
            quickWin: "Enable Firewall Insights for overly permissive rule detection",
            evidenceArtifact: "FirewallRules_PortConfig.json"
        }
    },
    "3.4.8[b]": {
        azure: {
            steps: ["1. Deploy Windows Defender Application Control (WDAC)", "2. Configure WDAC policy in enforced mode", "3. Use Intune to deploy WDAC to endpoints", "4. Monitor enforcement events in Sentinel", "5. Process exceptions through change management"],
            quickWin: "Start with WDAC audit mode, analyze CodeIntegrity logs",
            evidenceArtifact: "WDAC_Policy_Enforced.xml",
            humanInTheLoop: ["Security defines baseline allowed publishers", "Users request exceptions via help desk", "Security reviews and approves exceptions"],
            policyEvidence: ["Application Control Policy", "WDAC Exception Request Procedure", "Approved Publisher List"]
        },
        aws: {
            steps: ["1. Use AMI pipelines with only approved software", "2. Configure SSM to detect unauthorized executables", "3. Use ECR image scanning with deny policy", "4. Block execution paths via OS config", "5. Document deny-by-exception approach"],
            quickWin: "Configure ECR scanning to block vulnerable/unapproved images",
            evidenceArtifact: "ECR_ScanPolicy.json"
        },
        gcp: {
            steps: ["1. Use Binary Authorization for containers", "2. Configure admission policy requiring attestation", "3. Use OS Config for VM software compliance", "4. Block unauthorized container registries", "5. Document deny-by-exception"],
            quickWin: "Enable Binary Authorization with require_attestations_by",
            evidenceArtifact: "BinaryAuth_DenyPolicy.json"
        }
    },

    // === IDENTIFICATION AND AUTHENTICATION (3.5) - Expanded ===
    "3.5.4[a]": {
        azure: {
            steps: ["1. Enable FIDO2 security keys in Entra ID", "2. Configure Authenticator app with number matching", "3. Disable SMS/voice for privileged users", "4. Require phishing-resistant MFA via Conditional Access", "5. Document replay-resistant methods"],
            quickWin: "Enable number matching for Microsoft Authenticator",
            evidenceArtifact: "MFA_ReplayResistant_Config.json",
            humanInTheLoop: ["Security defines approved MFA methods", "IT provisions FIDO2 keys", "Help desk assists with registration"],
            policyEvidence: ["Multi-Factor Authentication Policy", "Phishing-Resistant MFA Standard", "Authentication Method Hierarchy"]
        },
        aws: {
            steps: ["1. Enable MFA for IAM users (virtual or hardware)", "2. Require MFA in IAM policies for sensitive ops", "3. Use IAM Identity Center with WebAuthn", "4. Configure TOTP or hardware tokens", "5. Document replay-resistant requirements"],
            quickWin: "Require MFA for all console access via IAM policy",
            evidenceArtifact: "IAM_MFA_Config.json"
        },
        gcp: {
            steps: ["1. Enable 2-Step Verification in Cloud Identity", "2. Require security keys for privileged users", "3. Configure context-aware access with 2SV", "4. Disable less secure verification methods", "5. Document replay-resistant methods"],
            quickWin: "Require security keys for super admins",
            evidenceArtifact: "2SV_Config.json"
        }
    },
    "3.5.6[a]": {
        azure: {
            steps: ["1. Configure Entra ID sign-in risk policy for inactive accounts", "2. Create Logic App to disable accounts after 90 days inactivity", "3. Use Access Reviews to identify inactive accounts", "4. Configure guest user access reviews", "5. Document inactivity thresholds"],
            quickWin: "Run Graph API query for accounts with lastSignInDateTime > 90 days",
            evidenceArtifact: "InactiveAccounts_Report.csv",
            humanInTheLoop: ["IT runs monthly inactive account report", "Managers confirm inactive users should be disabled", "HR confirms employment status"],
            policyEvidence: ["Account Inactivity Policy (90-day threshold)", "Inactive Account Review Procedure", "Account Disable/Delete Workflow"]
        },
        aws: {
            steps: ["1. Generate IAM credential report for last activity", "2. Create Lambda to disable inactive users (>90 days)", "3. Use Config rule for inactive IAM detection", "4. Send notifications before disabling", "5. Document inactivity policy"],
            quickWin: "Enable Config rule: iam-user-unused-credentials-check",
            evidenceArtifact: "IAM_InactiveUsers.csv"
        },
        gcp: {
            steps: ["1. Use Cloud Identity Reports for last sign-in", "2. Create automation to suspend inactive users", "3. Configure alerts for accounts approaching threshold", "4. Document inactivity policy", "5. Process exceptions through management"],
            quickWin: "Enable Cloud Identity inactive user report",
            evidenceArtifact: "CloudIdentity_InactiveUsers.csv"
        }
    },
    "3.5.7[a]": {
        azure: {
            steps: ["1. Configure Entra ID password policy: min 14 chars, complexity", "2. Enable Password Protection with custom banned list", "3. For hybrid: Configure AD password policy via GPO", "4. Integrate with Azure AD Password Protection", "5. Document password requirements"],
            quickWin: "Enable Entra ID Password Protection with custom banned words",
            evidenceArtifact: "PasswordPolicy_Config.json",
            humanInTheLoop: ["Security defines password complexity requirements", "IT implements technical controls", "Help desk assists with password changes"],
            policyEvidence: ["Password Policy (14+ chars, complexity)", "Banned Password List", "Password Change Procedure"]
        },
        aws: {
            steps: ["1. Configure IAM password policy: min length, complexity", "2. Require at least one of each character type", "3. Set max password age if required by policy", "4. Document password requirements", "5. Test enforcement"],
            quickWin: "`aws iam update-account-password-policy --minimum-password-length 14 --require-symbols --require-numbers --require-uppercase-characters --require-lowercase-characters`",
            evidenceArtifact: "IAM_PasswordPolicy.json"
        },
        gcp: {
            steps: ["1. Configure Cloud Identity password policy", "2. Set minimum length and complexity", "3. Enable password strength meter", "4. Document password requirements", "5. Test enforcement"],
            quickWin: "Configure password policy in Admin Console > Security > Password management",
            evidenceArtifact: "CloudIdentity_PasswordPolicy.json"
        }
    },
    "3.5.8[a]": {
        azure: {
            steps: ["1. Configure Entra ID password history: remember 24 passwords", "2. For hybrid: Configure AD password history via GPO", "3. Enable password change on next sign-in for compromised passwords", "4. Document password reuse prevention", "5. Test enforcement"],
            quickWin: "Entra ID enforces password history by default - verify setting",
            evidenceArtifact: "PasswordHistory_Config.json",
            humanInTheLoop: ["Security defines password history depth", "IT implements technical controls", "Users informed of password policy"],
            policyEvidence: ["Password Policy (24 password history)", "Password Change Procedure"]
        },
        aws: {
            steps: ["1. Configure IAM password policy: password reuse prevention = 24", "2. Apply to all IAM users", "3. Document password history requirements", "4. Test enforcement"],
            quickWin: "`aws iam update-account-password-policy --password-reuse-prevention 24`",
            evidenceArtifact: "IAM_PasswordHistory.json"
        },
        gcp: {
            steps: ["1. Configure Cloud Identity password policy", "2. Set password history to prevent reuse", "3. Document password requirements", "4. Test enforcement"],
            quickWin: "Configure password reuse in Admin Console > Security",
            evidenceArtifact: "CloudIdentity_PasswordHistory.json"
        }
    },

    // === INCIDENT RESPONSE (3.6) - Expanded ===
    "3.6.1[d]": {
        azure: {
            steps: ["1. Configure Sentinel analytics rules for incident detection", "2. Create investigation workbooks", "3. Define triage procedures and severity classification", "4. Set up Entity Behavior Analytics", "5. Document analysis procedures in IR runbooks"],
            quickWin: "Import Sentinel Investigation Insights workbook",
            evidenceArtifact: "IncidentAnalysis_Runbook.docx",
            humanInTheLoop: ["SOC analyst performs initial triage within 15 minutes", "Security engineer conducts deep investigation", "IR lead escalates high severity to management"],
            policyEvidence: ["Incident Analysis Procedure", "Severity Classification Matrix", "Escalation Criteria"]
        },
        aws: {
            steps: ["1. Use Security Hub for finding aggregation", "2. Enable Detective for investigation", "3. Create investigation playbooks", "4. Define severity classification", "5. Document analysis procedures"],
            quickWin: "Enable Amazon Detective for automated investigation",
            evidenceArtifact: "Detective_Investigation.json"
        },
        gcp: {
            steps: ["1. Use SCC for finding aggregation", "2. Enable Chronicle for investigation", "3. Create investigation procedures", "4. Define severity classification", "5. Document analysis workflows"],
            quickWin: "Enable Chronicle SIEM for investigation capabilities",
            evidenceArtifact: "SCC_Investigation.json"
        }
    },
    "3.6.1[e]": {
        azure: {
            steps: ["1. Create containment playbooks in Sentinel", "2. Configure automated response (isolate VM, disable user)", "3. Define manual containment procedures", "4. Set up network isolation capabilities", "5. Document containment strategies per incident type"],
            quickWin: "Create Sentinel playbook to isolate compromised VM",
            evidenceArtifact: "Containment_Playbooks.json",
            humanInTheLoop: ["IR lead authorizes containment actions", "SOC executes containment", "Legal consulted before user suspension"],
            policyEvidence: ["Incident Containment Procedure", "Containment Authorization Matrix", "Business Impact Considerations"]
        },
        aws: {
            steps: ["1. Create containment Lambda functions", "2. Configure Security Hub automated response", "3. Document manual containment procedures", "4. Set up VPC network isolation", "5. Test containment procedures"],
            quickWin: "Create Lambda to isolate EC2 instance (remove from security group)",
            evidenceArtifact: "Containment_Automation.json"
        },
        gcp: {
            steps: ["1. Create containment Cloud Functions", "2. Configure SCC notifications for automated response", "3. Document manual containment procedures", "4. Set up VPC network isolation", "5. Test containment"],
            quickWin: "Create Cloud Function to apply deny-all firewall rule",
            evidenceArtifact: "Containment_CloudFunction.json"
        }
    },
    "3.6.2[c]": {
        azure: {
            steps: ["1. Document DIBNet/DC3 reporting requirements", "2. Create incident report template for cyber incidents", "3. Define 72-hour reporting timeline", "4. Identify reporting contacts and procedures", "5. Train IR team on reporting obligations"],
            quickWin: "Create DIBCAC incident report template in SharePoint",
            evidenceArtifact: "IncidentReporting_Procedure.docx",
            humanInTheLoop: ["IR lead determines if incident is reportable", "FSO validates reporting decision", "Legal reviews before external reporting", "CISO approves final report"],
            policyEvidence: ["Cyber Incident Reporting Policy", "DFARS 252.204-7012 Compliance Procedure", "DC3 Reporting Template"]
        },
        aws: {
            steps: ["1. Document DFARS reporting requirements", "2. Create incident report template", "3. Define reporting timeline (72 hours)", "4. Document DC3 submission process", "5. Train team on reporting"],
            quickWin: "Create DFARS incident report template",
            evidenceArtifact: "DFARS_ReportTemplate.docx"
        },
        gcp: {
            steps: ["1. Document DFARS reporting requirements", "2. Create incident report template", "3. Define reporting timeline", "4. Document DC3 submission process", "5. Train team on reporting"],
            quickWin: "Create incident reporting procedure document",
            evidenceArtifact: "IncidentReporting_GCP.docx"
        }
    },

    // === SYSTEM AND COMMUNICATIONS PROTECTION (3.13) - Expanded ===
    "3.13.2[a]": {
        azure: {
            steps: ["1. Document defense-in-depth architecture", "2. Implement network segmentation (VNets, NSGs, Azure Firewall)", "3. Deploy layered security controls", "4. Use Azure Landing Zones for secure architecture", "5. Document security architecture decisions"],
            quickWin: "Deploy Hub-Spoke network topology with Azure Firewall",
            evidenceArtifact: "SecurityArchitecture_Diagram.pdf",
            humanInTheLoop: ["Security architect designs defense-in-depth", "Network team implements segmentation", "Security validates architecture controls"],
            policyEvidence: ["Security Architecture Policy", "Defense-in-Depth Standard", "Network Segmentation Requirements"]
        },
        aws: {
            steps: ["1. Document layered security architecture", "2. Implement VPC segmentation (public/private subnets)", "3. Deploy Network Firewall/WAF", "4. Use AWS Control Tower for landing zone", "5. Document architecture decisions"],
            quickWin: "Deploy AWS Control Tower with security baseline",
            evidenceArtifact: "AWS_SecurityArchitecture.pdf"
        },
        gcp: {
            steps: ["1. Document security architecture", "2. Implement VPC Service Controls", "3. Use Shared VPC for segmentation", "4. Deploy Cloud Armor/Firewall", "5. Document architecture decisions"],
            quickWin: "Enable VPC Service Controls for CUI data perimeter",
            evidenceArtifact: "GCP_SecurityArchitecture.pdf"
        }
    },
    "3.13.5[b]": {
        azure: {
            steps: ["1. Deploy Azure Firewall or NVA in hub VNet", "2. Configure DMZ subnet for public-facing systems", "3. Implement subnet isolation with NSGs", "4. Route all traffic through firewall", "5. Document DMZ architecture"],
            quickWin: "Create separate subnet for internet-facing workloads with restricted NSG",
            evidenceArtifact: "DMZ_NetworkDiagram.pdf",
            humanInTheLoop: ["Network team designs DMZ architecture", "Security approves firewall rules", "Operations manages DMZ systems separately"],
            policyEvidence: ["DMZ Architecture Standard", "Public-Facing System Requirements", "Network Segmentation Policy"]
        },
        aws: {
            steps: ["1. Create separate VPC or public subnet for DMZ", "2. Deploy ALB/NLB for public access", "3. Implement strict security groups", "4. Route through NAT Gateway/Firewall", "5. Document DMZ design"],
            quickWin: "Use separate public subnet with WAF for internet-facing workloads",
            evidenceArtifact: "AWS_DMZ_Design.pdf"
        },
        gcp: {
            steps: ["1. Create separate VPC or subnet for DMZ", "2. Deploy Cloud Load Balancing with Cloud Armor", "3. Implement strict firewall rules", "4. Use Cloud NAT for egress", "5. Document DMZ design"],
            quickWin: "Deploy Cloud Armor WAF for public-facing applications",
            evidenceArtifact: "GCP_DMZ_Design.pdf"
        }
    },
    "3.13.6[a]": {
        azure: {
            steps: ["1. Configure NSG with deny-all inbound/outbound by default", "2. Add only required allow rules with justification", "3. Use Azure Firewall for centralized default-deny", "4. Enable NSG flow logs for monitoring", "5. Document default-deny implementation"],
            quickWin: "Create NSG baseline with deny-all, add specific allow rules",
            evidenceArtifact: "NSG_DefaultDeny_Config.json",
            humanInTheLoop: ["Network team implements default-deny", "Application owners request firewall exceptions", "Security approves firewall rules"],
            policyEvidence: ["Default-Deny Network Policy", "Firewall Rule Request Procedure", "Network Access Justification Requirements"]
        },
        aws: {
            steps: ["1. Configure Security Groups with minimal rules", "2. Use Network ACLs for subnet-level deny", "3. Implement AWS Network Firewall default-deny", "4. Enable VPC Flow Logs", "5. Document default-deny posture"],
            quickWin: "Configure Network ACL with explicit deny rules",
            evidenceArtifact: "VPC_DefaultDeny_Config.json"
        },
        gcp: {
            steps: ["1. Configure VPC firewall with implied deny", "2. Add only required allow rules", "3. Use hierarchical firewall policies", "4. Enable firewall logging", "5. Document default-deny implementation"],
            quickWin: "Verify implied deny-all ingress is not overridden",
            evidenceArtifact: "GCP_Firewall_DefaultDeny.json"
        }
    },
    "3.13.10[a]": {
        azure: {
            steps: ["1. Use Azure Key Vault for key management", "2. Enable HSM-backed keys for FIPS compliance", "3. Configure key rotation policies", "4. Implement RBAC for key access", "5. Document key management procedures"],
            quickWin: "Create Key Vault with HSM-backed keys and 90-day rotation",
            evidenceArtifact: "KeyVault_Config.json",
            humanInTheLoop: ["Security defines key management policy", "IT implements Key Vault configuration", "Key custodians manage key lifecycle"],
            policyEvidence: ["Cryptographic Key Management Policy", "Key Rotation Schedule", "Key Access Authorization Procedure"]
        },
        aws: {
            steps: ["1. Use AWS KMS for key management", "2. Enable CloudHSM for FIPS 140-2 Level 3", "3. Configure automatic key rotation", "4. Implement key policies for access control", "5. Document key management"],
            quickWin: "Enable automatic annual key rotation for KMS CMKs",
            evidenceArtifact: "KMS_KeyManagement.json"
        },
        gcp: {
            steps: ["1. Use Cloud KMS for key management", "2. Enable Cloud HSM for FIPS compliance", "3. Configure key rotation schedules", "4. Implement IAM for key access", "5. Document key management"],
            quickWin: "Configure automatic key rotation in Cloud KMS",
            evidenceArtifact: "CloudKMS_Config.json"
        }
    },
    "3.13.15[a]": {
        azure: {
            steps: ["1. Configure TLS 1.2+ for all communications", "2. Enable session tokens with secure attributes", "3. Implement token refresh and expiration", "4. Use Entra ID for session management", "5. Document session protection mechanisms"],
            quickWin: "Configure Conditional Access session controls with sign-in frequency",
            evidenceArtifact: "SessionProtection_Config.json",
            humanInTheLoop: ["Security defines session security requirements", "IT configures session controls", "Users informed of session timeouts"],
            policyEvidence: ["Session Management Policy", "Token Security Requirements", "Session Timeout Standards"]
        },
        aws: {
            steps: ["1. Configure TLS 1.2+ for ALB/CloudFront", "2. Implement session management in applications", "3. Use Cognito for session handling", "4. Configure session token expiration", "5. Document session protection"],
            quickWin: "Configure ALB to require TLS 1.2 minimum",
            evidenceArtifact: "ALB_TLSConfig.json"
        },
        gcp: {
            steps: ["1. Configure TLS 1.2+ for Load Balancers", "2. Use Identity-Aware Proxy for session control", "3. Implement session management in apps", "4. Configure session token expiration", "5. Document session protection"],
            quickWin: "Configure SSL policy requiring TLS 1.2+ on load balancers",
            evidenceArtifact: "GCP_TLSConfig.json"
        }
    },

    // === SYSTEM AND INFORMATION INTEGRITY (3.14) - Expanded ===
    "3.14.3[a]": {
        azure: {
            steps: ["1. Configure Defender for Cloud security alerts", "2. Set up Sentinel analytics rules for threat detection", "3. Enable email/SMS notifications for high-severity alerts", "4. Create alert response procedures", "5. Document alert monitoring process"],
            quickWin: "Enable Defender for Cloud continuous export to Sentinel",
            evidenceArtifact: "SecurityAlerts_Config.json",
            humanInTheLoop: ["SOC monitors security alerts 24x7 or during business hours", "Security engineer investigates alerts", "IR team escalates confirmed incidents"],
            policyEvidence: ["Security Alert Monitoring Procedure", "Alert Response SLAs", "Escalation Matrix"]
        },
        aws: {
            steps: ["1. Enable Security Hub for alert aggregation", "2. Configure GuardDuty notifications", "3. Set up SNS for alert delivery", "4. Create alert response procedures", "5. Document monitoring process"],
            quickWin: "Enable Security Hub with CIS AWS Foundations Benchmark",
            evidenceArtifact: "SecurityHub_Alerts.json"
        },
        gcp: {
            steps: ["1. Enable SCC for security findings", "2. Configure alert policies in Cloud Monitoring", "3. Set up notification channels", "4. Create alert response procedures", "5. Document monitoring process"],
            quickWin: "Enable SCC notifications via Pub/Sub",
            evidenceArtifact: "SCC_AlertConfig.json"
        }
    },
    "3.14.4[a]": {
        azure: {
            steps: ["1. Configure Defender Antivirus automatic updates via Intune", "2. Set update frequency to every 4 hours", "3. Enable cloud-delivered protection", "4. Monitor update status in Defender portal", "5. Document update configuration"],
            quickWin: "Configure Intune policy: Defender signature update interval = 4 hours",
            evidenceArtifact: "DefenderUpdate_Config.json",
            humanInTheLoop: ["IT monitors update compliance", "Security validates protection status", "Help desk assists with update failures"],
            policyEvidence: ["Malware Protection Update Policy", "Definition Update Frequency Requirements", "Update Failure Response Procedure"]
        },
        aws: {
            steps: ["1. Configure automatic updates for endpoint protection", "2. Use Systems Manager for update management", "3. Monitor update compliance via Config", "4. Alert on outdated definitions", "5. Document update process"],
            quickWin: "Configure SSM Patch Manager for endpoint protection updates",
            evidenceArtifact: "EndpointUpdate_Config.json"
        },
        gcp: {
            steps: ["1. Configure automatic updates for endpoint protection", "2. Use OS Config for patch management", "3. Monitor update compliance", "4. Alert on outdated definitions", "5. Document update process"],
            quickWin: "Enable OS Patch Management for automatic updates",
            evidenceArtifact: "EndpointUpdate_GCP.json"
        }
    },
    "3.14.5[b]": {
        azure: {
            steps: ["1. Enable Defender Antivirus real-time protection", "2. Configure on-access scanning in Intune policy", "3. Enable behavior monitoring", "4. Enable script scanning", "5. Document real-time scan configuration"],
            quickWin: "Verify Intune Defender policy: Real-time protection = Enabled",
            evidenceArtifact: "RealTimeScan_Config.json",
            humanInTheLoop: ["IT deploys real-time scanning policy", "Security monitors scan effectiveness", "Users report performance issues"],
            policyEvidence: ["Malware Scanning Policy", "Real-Time Protection Requirements", "Scan Exception Procedure"]
        },
        aws: {
            steps: ["1. Enable real-time scanning on endpoint protection", "2. Configure on-access scanning", "3. Enable behavior-based detection", "4. Monitor scan activity", "5. Document configuration"],
            quickWin: "Verify endpoint agent real-time protection is enabled",
            evidenceArtifact: "RealTimeScan_AWS.json"
        },
        gcp: {
            steps: ["1. Enable real-time scanning on endpoints", "2. Configure on-access scanning", "3. Enable Container Threat Detection for GKE", "4. Monitor scan activity", "5. Document configuration"],
            quickWin: "Enable Container Threat Detection in SCC",
            evidenceArtifact: "RealTimeScan_GCP.json"
        }
    },
    "3.14.7[a]": {
        azure: {
            steps: ["1. Define unauthorized use in policy (personal use, prohibited activities)", "2. Configure Sentinel analytics for unauthorized use detection", "3. Enable Insider Risk Management for user behavior", "4. Create alerts for policy violations", "5. Document detection mechanisms"],
            quickWin: "Enable Insider Risk Management policy templates",
            evidenceArtifact: "UnauthorizedUse_Detection.json",
            humanInTheLoop: ["Security defines unauthorized use criteria", "SOC monitors for violations", "HR/Legal involved in confirmed violations"],
            policyEvidence: ["Acceptable Use Policy", "Unauthorized Use Detection Procedure", "Violation Response Process"]
        },
        aws: {
            steps: ["1. Define unauthorized use criteria", "2. Configure GuardDuty for anomaly detection", "3. Use CloudTrail Insights for unusual activity", "4. Create alerts for policy violations", "5. Document detection mechanisms"],
            quickWin: "Enable GuardDuty with all detection categories",
            evidenceArtifact: "UnauthorizedUse_AWS.json"
        },
        gcp: {
            steps: ["1. Define unauthorized use criteria", "2. Configure SCC Event Threat Detection", "3. Enable anomaly detection in Chronicle", "4. Create alerts for violations", "5. Document detection mechanisms"],
            quickWin: "Enable Event Threat Detection in SCC Premium",
            evidenceArtifact: "UnauthorizedUse_GCP.json"
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
