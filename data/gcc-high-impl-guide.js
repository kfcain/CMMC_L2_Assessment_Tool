// M365 GCC High + Azure Government Implementation Guide - Client Resources
// Structured data for CMMC L2 deployment in Microsoft 365 GCC High AND Azure Government

const GCC_HIGH_IMPL_GUIDE = {
    // 8-Week Implementation Timeline
    projectPlan: [
        { phase: "1. Foundation", week: 1, taskId: "T-1.1", task: "Register PnP Automation Identity (Script 00)", owner: "IT Admin", accountable: "FSO", deliverable: "CMMC_App_Config.json" },
        { phase: "1. Foundation", week: 1, taskId: "T-1.2", task: "Connect to Azure Government (Connect-AzAccount -Environment AzureUSGovernment)", owner: "IT Admin", accountable: "IT Director", deliverable: "Az Module Connected" },
        { phase: "1. Foundation", week: 1, taskId: "T-1.2b", task: "Deploy Azure Gov VPN Gateway with FIPS IPsec Policy", owner: "IT Admin", accountable: "IT Director", deliverable: "VPN Gateway Active" },
        { phase: "1. Foundation", week: 1, taskId: "T-1.3", task: "Inventory & Assign Service Account Owners", owner: "IT Admin", accountable: "FSO", deliverable: "Service Account List" },
        { phase: "1. Foundation", week: 1, taskId: "T-1.4", task: "Enforce MFA (FIDO2/Number Match) for All Users", owner: "IT Admin", accountable: "FSO", deliverable: "MFA Report" },
        { phase: "1. Foundation", week: 2, taskId: "T-2.1", task: "Deploy Intune Hardening Baselines (Script 01)", owner: "IT Admin", accountable: "FSO", deliverable: "Intune Compliance Green" },
        { phase: "1. Foundation", week: 2, taskId: "T-2.2", task: "Deploy Defender USB Block Policy", owner: "IT Admin", accountable: "FSO", deliverable: "USB Block Policy Active" },
        { phase: "1. Foundation", week: 2, taskId: "T-2.3", task: "Apply CUI Stickers to Laptops/Media", owner: "FSO", accountable: "Exec Sponsor", deliverable: "Photo Evidence" },
        { phase: "2. People", week: 3, taskId: "T-3.1", task: "Run Background Checks (Admins & Legacy Staff)", owner: "HR Mgr", accountable: "Exec Sponsor", deliverable: "Screening Reports" },
        { phase: "2. People", week: 3, taskId: "T-3.2", task: "Deploy Training Tracker (SharePoint)", owner: "IT Admin", accountable: "FSO", deliverable: "SharePoint List Active" },
        { phase: "2. People", week: 3, taskId: "T-3.3", task: "Assign 'CUI Awareness' Training", owner: "FSO", accountable: "HR Mgr", deliverable: "LMS Completion Report" },
        { phase: "2. People", week: 3, taskId: "T-3.4", task: "Sign Telework Agreements (Clean Desk)", owner: "HR Mgr", accountable: "FSO", deliverable: "Signed PDFs" },
        { phase: "2. People", week: 4, taskId: "T-4.1", task: "Deploy Visitor Log PowerApp", owner: "IT Admin", accountable: "FSO", deliverable: "App Active on Kiosk" },
        { phase: "2. People", week: 4, taskId: "T-4.2", task: "Physical Security Audit (Lock Server Rack)", owner: "FSO", accountable: "Exec Sponsor", deliverable: "Locked Rack Key" },
        { phase: "3. Governance", week: 5, taskId: "T-5.1", task: "Establish Change Control Board (CCB)", owner: "FSO", accountable: "Exec Sponsor", deliverable: "CCB Charter Document" },
        { phase: "3. Governance", week: 5, taskId: "T-5.2", task: "Hold First CCB Meeting (Review Baselines)", owner: "FSO", accountable: "IT Admin", deliverable: "Meeting Minutes" },
        { phase: "3. Governance", week: 6, taskId: "T-6.1", task: "Conduct Risk Assessment Workshop", owner: "FSO", accountable: "Exec Sponsor", deliverable: "Risk Register" },
        { phase: "3. Governance", week: 6, taskId: "T-6.2", task: "Run IR Tabletop Exercise (Ransomware)", owner: "FSO", accountable: "Exec Sponsor", deliverable: "After Action Report" },
        { phase: "3. Governance", week: 6, taskId: "T-6.3", task: "Deploy Azure Policy NIST 800-171 Initiative", owner: "IT Admin", accountable: "FSO", deliverable: "Policy Assignment Active" },
        { phase: "3. Governance", week: 6, taskId: "T-6.4", task: "Configure Microsoft Sentinel Workspace (Azure Gov)", owner: "SecOps", accountable: "FSO", deliverable: "Sentinel Workspace Active" },
        { phase: "4. Audit Prep", week: 7, taskId: "T-7.1", task: "Review & Close POA&M Items", owner: "FSO", accountable: "Exec Sponsor", deliverable: "Updated POAM" },
        { phase: "4. Audit Prep", week: 7, taskId: "T-7.2", task: "Run Weekly Log Review (Script)", owner: "FSO", accountable: "IT Director", deliverable: "Weekly Review Log" },
        { phase: "4. Audit Prep", week: 8, taskId: "T-8.1", task: "Export Azure Gov Compliance State (Get-AzPolicyState)", owner: "IT Admin", accountable: "FSO", deliverable: "Azure Policy Report" },
        { phase: "4. Audit Prep", week: 8, taskId: "T-8.2", task: "Final M365 Evidence Export (Graph API Scripts)", owner: "IT Admin", accountable: "FSO", deliverable: "JSON Artifacts" },
        { phase: "4. Audit Prep", week: 8, taskId: "T-8.3", task: "Finalize & Sign SSP", owner: "FSO", accountable: "Exec Sponsor", deliverable: "Signed SSP" }
    ],

    // Recurring Operations (Post-Implementation)
    recurringOps: [
        { frequency: "Weekly", activity: "M365 Log Review", owner: "FSO", purpose: "Run Graph API evidence scripts. Sign off on Defender alerts." },
        { frequency: "Weekly", activity: "Azure Gov Policy Check", owner: "IT Admin", purpose: "Run Get-AzPolicyState. Remediate non-compliant resources." },
        { frequency: "Weekly", activity: "Sentinel Alert Review", owner: "SecOps", purpose: "Triage incidents in Microsoft Sentinel (Azure Gov)." },
        { frequency: "Weekly", activity: "Vulnerability Check", owner: "IT Admin", purpose: "Check Defender Exposure Score. Patch criticals." },
        { frequency: "Monthly", activity: "Change Control Board (CCB)", owner: "FSO + IT", purpose: "Approve new software/hardware. Review Visitor Logs." },
        { frequency: "Monthly", activity: "Azure Cost Review", owner: "IT Admin", purpose: "Review Azure Gov spend. Identify unused resources." },
        { frequency: "Quarterly", activity: "Access Review", owner: "HR + FSO", purpose: "Verify Entra ID + Azure RBAC. Disable inactive accounts." },
        { frequency: "Annually", activity: "Incident Response Drill", owner: "All Hands", purpose: "Tabletop exercise (Ransomware/Insider Threat)." },
        { frequency: "Annually", activity: "Policy Refresh", owner: "FSO", purpose: "Review and re-sign the SSP." }
    ],

    // RACI Matrix
    raciMatrix: {
        roles: ["Exec Sponsor", "FSO", "IT Admin", "HR Mgr", "Dept Leads"],
        tasks: [
            { category: "Governance", action: "Approve SSP & Policies", raci: ["A", "R", "C", "I", "I"] },
            { category: "Identity", action: "Create Entra ID / MFA Rules", raci: ["I", "A", "R", "I", "I"] },
            { category: "Endpoints", action: "Deploy Intune Baselines", raci: ["I", "C", "R", "I", "C"] },
            { category: "Personnel", action: "Background Checks & Screening", raci: ["I", "C", "I", "R/A", "I"] },
            { category: "Training", action: "Enforce CUI Awareness Completion", raci: ["A", "R", "I", "C", "C"] },
            { category: "Physical", action: "Escort Visitors / Visitor Log", raci: ["I", "A", "I", "R", "R"] },
            { category: "Change Mgmt", action: "Approve Firewall/Software Changes", raci: ["I", "R/A", "R", "I", "C"] },
            { category: "Incidents", action: "Report to DIBNet (72-Hour Rule)", raci: ["I", "R/A", "C", "I", "I"] },
            { category: "Audit", action: "Weekly Evidence Collection", raci: ["I", "R", "R", "I", "I"] }
        ]
    },

    // SSP Conformity Statements (by control)
    sspStatements: {
        "3.1.1": "The organization utilizes Microsoft Entra ID Government (Azure AD) as the central Identity Provider. Authorized users are identified by unique User Principal Names (UPN) hosted in the GCC High tenant. Access is limited to authorized devices via Microsoft Intune compliance policies.",
        "3.1.5": "Privileged access is managed via Microsoft Entra Privileged Identity Management (PIM). Administrators must request just-in-time elevation with business justification. All PIM activations are logged and exported weekly as machine-readable evidence.",
        "3.1.9": "System use notifications are displayed via Intune Settings Catalog (Interactive Logon Message) on Windows endpoints and Entra ID Terms of Use for web/mobile access. Users must acknowledge the DoD standard banner before accessing CUI.",
        "3.1.10": "Session lock is enforced after 15 minutes of inactivity via Intune Configuration Profile. Screen saver with password requirement is deployed to all managed endpoints.",
        "3.1.21": "Portable storage is blocked via Microsoft Defender Device Control policies. Only FIPS-encrypted company-issued drives (IronKey) are authorized via Device ID allowlist.",
        "3.1.22": "Public content release is controlled via SharePoint approval workflow. A Public Release Registry tracks all approvals with CUI verification checkbox.",
        "3.2.1": "Security awareness training is tracked via SharePoint-based Training Assignments list. Users must complete CUI Awareness, Insider Threat, and CUI Handling modules annually.",
        "3.3.1": "Audit logs are generated by Microsoft Sentinel (SIEM) in Azure Government. Data connectors ingest logs from Entra ID, Intune, Defender for Endpoint, and on-premises firewalls. Retention is configured for 365 days with immutable blob storage archive.",
        "3.4.1": "Baseline configurations for Windows endpoints are established and enforced via Microsoft Intune Configuration Profiles aligned with CIS Level 1 benchmarks. Changes are managed via the Change Control Board (CCB).",
        "3.5.3": "Multifactor Authentication (MFA) is enforced for 100% of user and administrator access via Entra ID Conditional Access. The organization utilizes FIDO2 Hardware Keys and Certificate-Based Authentication. SMS/Voice is disabled.",
        "3.6.2": "Incidents are tracked in Microsoft Sentinel. The organization possesses an active ECA Medium Assurance Certificate to access the DoD DIBNet portal. Cyber incidents are reported to DC3 within 72 hours via https://dibnet.dod.mil.",
        "3.7.5": "Remote maintenance is conducted via Microsoft Intune Remote Help and Azure Bastion. MFA is required prior to establishing any session. All sessions are encrypted via TLS 1.2+ and terminated upon completion.",
        "3.8.1": "All system media (endpoints) is encrypted at rest using BitLocker with XTS-AES 256-bit encryption. Access to removable media is restricted via Intune. Media sanitization uses Intune Wipe (NIST 800-88 Purge equivalent).",
        "3.10.1": "Physical access to the organizational facility is controlled via electronic badge readers. Access logs are retained for one year. Visitors sign a digital log, verify citizenship, and are escorted at all times.",
        "3.10.6": "Remote employees must maintain a dedicated workspace with lockable storage for any physical CUI. Telework Agreements acknowledging Clean Desk policy are signed annually.",
        "3.13.8": "CUI in transit is protected using FIPS 140-2 validated cryptography. Azure VPN Gateway uses custom IPsec policy (AES256/SHA384/DHGroup24). TLS 1.2 minimum is enforced on all web endpoints.",
        "3.13.11": "CUI at rest is protected using FIPS 140-2 validated cryptography. BitLocker uses XTS-AES 256. Azure Storage uses Microsoft-managed keys with FIPS compliance in Azure Government.",
        "3.14.1": "System flaws are identified via Microsoft Defender Vulnerability Management continuous scanning. Remediation is tracked in Defender and linked to Intune for automated patching."
    },

    // Evidence Collection Strategy (machine-readable artifacts)
    evidenceStrategy: [
        // M365 GCC High Evidence (Graph API)
        { domain: "Access Control", artifact: "AC_Policies.json", source: "M365 Graph API", command: "Connect-MgGraph -Environment USGov; Get-MgIdentityConditionalAccessPolicy | ConvertTo-Json -Depth 5", proves: "Geo-blocking, MFA enforcement, Block Legacy Auth" },
        { domain: "Access Control", artifact: "PIM_Elevation_History.json", source: "M365 Graph API", command: "Get-MgAuditLogDirectoryAudit -Filter \"activityDisplayName eq 'Add member to role'\" | ConvertTo-Json", proves: "Privilege escalation tracking" },
        { domain: "Access Control", artifact: "Dynamic_Group_Rules.json", source: "M365 Graph API", command: "Get-MgGroup -Filter \"groupTypes/any(c:c eq 'DynamicMembership')\" | ConvertTo-Json", proves: "Automated onboarding/offboarding" },
        { domain: "Awareness & Training", artifact: "AT_TrainingStatus.csv", source: "M365 Defender", command: "Get-AttackSimulationTrainingUserCoverage | Export-Csv -Path AT_TrainingStatus.csv", proves: "Training completion" },
        { domain: "Audit & Accountability", artifact: "AU_LogSettings.json", source: "M365 Exchange", command: "Connect-ExchangeOnline -ExchangeEnvironmentName O365USGovGCCHigh; Get-AdminAuditLogConfig | ConvertTo-Json", proves: "Logging is enabled" },
        { domain: "Config Management", artifact: "CM_DeviceConfig.json", source: "M365 Intune", command: "Get-MgDeviceManagementDeviceConfiguration | ConvertTo-Json -Depth 4", proves: "USB Block, Software Restrictions" },
        { domain: "Identification & Auth", artifact: "IA_AuthMethods.json", source: "M365 Graph API", command: "Get-MgPolicyAuthenticationMethodPolicy | ConvertTo-Json -Depth 5", proves: "FIDO2/MFA is configured" },
        { domain: "Media Protection", artifact: "MP_Encryption_Status.json", source: "M365 Intune", command: "Get-MgDeviceManagementManagedDevice | Select DeviceName, IsEncrypted | ConvertTo-Json", proves: "BitLocker is ON" },
        { domain: "System Integrity", artifact: "SI_MalwareConfig.json", source: "M365 Defender", command: "Get-MgDeviceManagementManagedDevice | Select DeviceName, RealTimeProtectionEnabled | ConvertTo-Json", proves: "Real-time protection ON" },
        // Azure Government Evidence (Az Module)
        { domain: "Access Control", artifact: "AzureRBAC_Assignments.json", source: "Azure Gov", command: "Connect-AzAccount -Environment AzureUSGovernment; Get-AzRoleAssignment | ConvertTo-Json -Depth 3", proves: "Azure RBAC assignments" },
        { domain: "Audit & Accountability", artifact: "AzureActivityLog.json", source: "Azure Gov", command: "Get-AzActivityLog -StartTime (Get-Date).AddDays(-7) | ConvertTo-Json", proves: "Azure activity logging" },
        { domain: "Audit & Accountability", artifact: "SentinelDataConnectors.json", source: "Azure Gov", command: "Get-AzSentinelDataConnector -ResourceGroupName RG -WorkspaceName WS | ConvertTo-Json", proves: "SIEM data connectors active" },
        { domain: "Config Management", artifact: "AzurePolicyCompliance.json", source: "Azure Gov", command: "Get-AzPolicyState -Filter \"complianceState eq 'NonCompliant'\" | ConvertTo-Json", proves: "Azure Policy compliance state" },
        { domain: "Config Management", artifact: "AzurePolicyAssignments.json", source: "Azure Gov", command: "Get-AzPolicyAssignment | ConvertTo-Json -Depth 3", proves: "NIST 800-171 initiative assigned" },
        { domain: "Incident Response", artifact: "SentinelIncidents.json", source: "Azure Gov", command: "Get-AzSentinelIncident -ResourceGroupName RG -WorkspaceName WS | ConvertTo-Json -Depth 3", proves: "Incident tracking active" },
        { domain: "Incident Response", artifact: "SentinelAutomation.json", source: "Azure Gov", command: "Get-AzSentinelAutomationRule -ResourceGroupName RG -WorkspaceName WS | ConvertTo-Json", proves: "Automated response capability" },
        { domain: "System Protection", artifact: "AzureNSGs.json", source: "Azure Gov", command: "Get-AzNetworkSecurityGroup | ConvertTo-Json -Depth 4", proves: "Network security groups configured" },
        { domain: "System Protection", artifact: "AzureKeyVault.json", source: "Azure Gov", command: "Get-AzKeyVault | ForEach-Object { Get-AzKeyVaultKey -VaultName $_.VaultName } | ConvertTo-Json", proves: "Key Vault encryption keys" },
        { domain: "System Protection", artifact: "VPNGatewayIPsec.json", source: "Azure Gov", command: "Get-AzVirtualNetworkGatewayConnection | Select Name, IpsecPolicies | ConvertTo-Json", proves: "FIPS IPsec policy active" }
    ],

    // Policy Templates
    policyTemplates: {
        accessControl: {
            title: "Access Control & Identity Policy (AC/IA)",
            purpose: "To limit system access to authorized users and processes.",
            sections: [
                { heading: "Identifier Lifecycle", items: ["Usernames (UPNs) are unique to individuals.", "Re-use of identifiers is prohibited for 3 years post-termination.", "Naming Convention: First.Last (User), ADM-First.Last (Admin), SVC-App (Service)."] },
                { heading: "Access Enforcement", items: ["Multifactor Authentication (MFA) is mandatory for all access.", "Guest access to the tenant is disabled by default.", "External maintenance sessions must be escorted by a US Person."] }
            ]
        },
        configManagement: {
            title: "Configuration & Change Management Policy (CM)",
            purpose: "To prevent unauthorized changes to the system boundary.",
            sections: [
                { heading: "Baseline Configuration", items: ["All endpoints must adhere to the Intune 'CMMC Hardening' profile.", "Deviations from the baseline are automatically remediated or blocked."] },
                { heading: "Change Control Board (CCB)", items: ["'Normal' changes (Firewall rules, New Software) require CCB approval.", "'Emergency' changes must be documented retroactively within 24 hours."] },
                { heading: "Software Restrictions", items: ["Only software listed in the 'Approved Software Catalog' SharePoint list is permitted."] }
            ]
        },
        physicalProtection: {
            title: "Physical Protection & Telework Policy (PE)",
            purpose: "To secure CUI in physical spaces and home offices.",
            sections: [
                { heading: "Facility Access", items: ["All visitors must sign in via the Visitor Kiosk.", "Foreign Nationals must be escorted at all times."] },
                { heading: "Telework Requirements", items: ["Printing CUI at home is strictly PROHIBITED.", "Connection of GFE (laptops) to smart home devices (Alexa, IoT) is PROHIBITED.", "Split-tunneling is disabled; all CUI traffic routes through the secure VPN."] }
            ]
        },
        mediaProtection: {
            title: "Media Protection Policy (MP)",
            purpose: "To prevent data exfiltration via removable media.",
            sections: [
                { heading: "USB Usage", items: ["Use of personal USB drives is blocked by technical policy.", "Only FIPS-encrypted company-issued drives (IronKey) are authorized."] },
                { heading: "Marking", items: ["All physical media containing CUI must be labeled with a purple 'CUI' sticker."] },
                { heading: "Transport", items: ["Paper CUI must be transported in opaque envelopes and remain in personal possession."] }
            ]
        },
        incidentResponse: {
            title: "Incident Response Policy (IR)",
            purpose: "To ensure rapid reporting of cyber incidents.",
            sections: [
                { heading: "Reporting Timeline", items: ["All potential incidents must be reported to the FSO immediately.", "Confirmed incidents must be reported to DIBNet (https://dibnet.dod.mil) within 72 hours."] },
                { heading: "Preservation", items: ["In the event of an incident, do not reboot the machine.", "Disconnect the network cable and await FSO instructions."] }
            ]
        }
    },

    // FedRAMP Authorized Providers
    fedrampProviders: [
        { category: "MFA / Identity", provider: "Cisco Duo (Federal)", notes: "FedRAMP Authorized. Hardware token management." },
        { category: "Backup / Recovery", provider: "AvePoint (Gov)", notes: "FedRAMP Authorized. Backs up GCC High SharePoint/Teams/Exchange." },
        { category: "File Transfer", provider: "Kiteworks or Box (Gov)", notes: "FedRAMP Authorized. Secure CUI sharing with external parties." },
        { category: "Visitor Management", provider: "Envoy (Global)", notes: "Check FedRAMP status or use manual log." },
        { category: "Remote Support", provider: "BeyondTrust (Gov)", notes: "FedRAMP Authorized. Secure remote IT support." }
    ],

    // Sensitivity Label Taxonomy
    sensitivityLabels: [
        { name: "L1", displayName: "Public", encryption: "None", marking: "None", audience: "All Users" },
        { name: "L2", displayName: "Internal", encryption: "None", marking: "Footer: 'Internal Use Only'", audience: "All Users" },
        { name: "L3", displayName: "CUI Basic", encryption: "Co-Author", marking: "Header: 'CUI - BASIC'", audience: "All Employees" },
        { name: "L4", displayName: "CUI Specified", encryption: "Co-Author", marking: "Header: 'CUI - SP- [CATEGORY]'", audience: "SG_CUI_Handlers" },
        { name: "L5", displayName: "ITAR Restricted", encryption: "Co-Author (Strict)", marking: "Header: 'ITAR RESTRICTED - US PERSONS ONLY'", audience: "SG_US_Persons (Vetted)" }
    ],

    // Conditional Access Policies to Deploy
    conditionalAccessPolicies: [
        { name: "Geo-Blocking", description: "Block all traffic from outside the US", critical: true, reason: "ITAR requirement" },
        { name: "Compliant Devices", description: "Require devices marked as Compliant in Intune", critical: true, reason: "Endpoint security" },
        { name: "Block Legacy Auth", description: "Deny POP, IMAP, SMTP protocols", critical: true, reason: "Prevent credential theft" },
        { name: "Risk-Based Access", description: "Block sign-ins with High/Medium user/sign-in risk", critical: false, reason: "Requires Entra ID P2" },
        { name: "Terms of Use", description: "Require acceptance of DoD banner", critical: true, reason: "3.1.9 requirement" }
    ],

    // System Use Banner Text (DoD Standard)
    systemUseBanner: {
        title: "US GOVERNMENT SYSTEM - AUTHORIZED USE ONLY",
        text: "You are accessing a U.S. Government information system (IS) that is provided for USG-authorized use only. By using this IS (which includes any device attached to this IS), you consent to the following conditions: The USG routinely intercepts and monitors communications on this IS for purposes including, but not limited to, penetration testing, COMSEC monitoring, network operations and defense, personnel misconduct (PM), law enforcement (LE), and counterintelligence (CI) investigations. At any time, the USG may inspect and seize data stored on this IS. Communications using, or data stored on, this IS are not private, are subject to routine monitoring, interception, and search, and may be disclosed or used for any USG-authorized purpose. This IS includes security measures (e.g., authentication and access controls) to protect USG interests--not for your personal benefit or privacy."
    },

    // M365 GCC High Services for CMMC
    m365Services: [
        { control: "3.1.x (AC)", service: "Entra ID (Azure AD) Government", purpose: "Identity management, Conditional Access, MFA" },
        { control: "3.1.x (AC)", service: "Intune (Endpoint Manager)", purpose: "Device compliance, app protection policies" },
        { control: "3.2.x (AT)", service: "Defender for Office 365", purpose: "Attack simulation, security awareness training" },
        { control: "3.3.x (AU)", service: "Microsoft Purview", purpose: "Audit logs, eDiscovery, retention policies" },
        { control: "3.4.x (CM)", service: "Intune Configuration Profiles", purpose: "Baseline enforcement, settings catalog" },
        { control: "3.5.x (IA)", service: "Entra ID MFA + FIDO2", purpose: "Multi-factor authentication, passwordless" },
        { control: "3.6.x (IR)", service: "Defender XDR", purpose: "Incident detection and response" },
        { control: "3.8.x (MP)", service: "Defender Device Control", purpose: "USB blocking, removable media policies" },
        { control: "3.13.x (SC)", service: "Purview Information Protection", purpose: "Sensitivity labels, DLP, encryption" }
    ],

    // Azure Government Services for CMMC
    azureGovServices: [
        { control: "3.1.x (AC)", service: "Azure RBAC + PIM", purpose: "Role-based access, just-in-time elevation" },
        { control: "3.3.x (AU)", service: "Microsoft Sentinel", purpose: "SIEM, log aggregation, threat hunting" },
        { control: "3.3.x (AU)", service: "Azure Monitor + Log Analytics", purpose: "Resource logging, diagnostics" },
        { control: "3.4.x (CM)", service: "Azure Policy", purpose: "NIST 800-171 initiative, compliance enforcement" },
        { control: "3.5.x (IA)", service: "Azure Key Vault", purpose: "Secrets management, certificate storage" },
        { control: "3.6.x (IR)", service: "Sentinel Playbooks (Logic Apps)", purpose: "Automated incident response" },
        { control: "3.11.x (RA)", service: "Microsoft Defender for Cloud", purpose: "Vulnerability assessment, security posture" },
        { control: "3.13.x (SC)", service: "Azure VPN Gateway", purpose: "FIPS IPsec, site-to-site VPN" },
        { control: "3.13.x (SC)", service: "Azure Key Vault HSM", purpose: "FIPS 140-2 Level 3 key storage" },
        { control: "3.13.x (SC)", service: "Azure Storage Encryption", purpose: "SSE with customer-managed keys" },
        { control: "3.14.x (SI)", service: "Azure Update Manager", purpose: "Patch management for Azure VMs" }
    ],

    // Native Services by Control Family
    servicesByFamily: {
        "Access Control (AC)": {
            native: [
                { service: "Microsoft Entra ID", type: "Identity Provider", purpose: "User/group management, SSO, Conditional Access" },
                { service: "Intune", type: "MDM/MAM", purpose: "Device compliance, app protection, enrollment" },
                { service: "Azure RBAC", type: "Authorization", purpose: "Role-based access control for Azure resources" },
                { service: "Privileged Identity Management (PIM)", type: "PAM", purpose: "Just-in-time privileged access, approval workflows" },
                { service: "Azure Bastion", type: "Secure Access", purpose: "Secure RDP/SSH without public IPs" }
            ],
            thirdParty: [
                { service: "Cisco Duo", type: "MFA", fedramp: "High", assetType: "Security Protection Asset", purpose: "Hardware tokens, push notifications, adaptive MFA" },
                { service: "Okta (Fed)", type: "Identity Provider", fedramp: "High", assetType: "Security Protection Asset", purpose: "SSO, lifecycle management, directory integration" },
                { service: "CyberArk", type: "PAM", fedramp: "High", assetType: "Security Protection Asset", purpose: "Privileged credential vaulting, session recording" },
                { service: "BeyondTrust", type: "PAM", fedramp: "High", assetType: "Security Protection Asset", purpose: "Privileged remote access, password management" },
                { service: "SailPoint", type: "IGA", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Identity governance, access certifications" }
            ]
        },
        "Awareness & Training (AT)": {
            native: [
                { service: "Defender for Office 365", type: "Security Training", purpose: "Attack simulation, phishing campaigns" },
                { service: "Microsoft Viva Learning", type: "LMS", purpose: "Training content delivery, tracking" }
            ],
            thirdParty: [
                { service: "KnowBe4", type: "Security Awareness", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Phishing simulation, security training modules" },
                { service: "Proofpoint", type: "Security Awareness", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Security awareness training, threat simulation" },
                { service: "SANS Security Awareness", type: "Training", fedramp: "N/A", assetType: "Security Protection Asset", purpose: "Role-based security training content" }
            ]
        },
        "Audit & Accountability (AU)": {
            native: [
                { service: "Microsoft Sentinel", type: "SIEM", purpose: "Log aggregation, threat detection, analytics rules" },
                { service: "Azure Monitor", type: "Logging", purpose: "Resource diagnostics, metrics, alerts" },
                { service: "Microsoft Purview Audit", type: "Audit Logs", purpose: "M365 audit logs, search, retention" },
                { service: "Log Analytics", type: "Log Management", purpose: "KQL queries, workbooks, dashboards" }
            ],
            thirdParty: [
                { service: "Splunk (GovCloud)", type: "SIEM", fedramp: "High", assetType: "Security Protection Asset", purpose: "Log management, security analytics, dashboards" },
                { service: "Elastic (GovCloud)", type: "SIEM", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Log aggregation, search, visualization" },
                { service: "Sumo Logic (Fed)", type: "SIEM", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Cloud-native log analytics" },
                { service: "LogRhythm", type: "SIEM", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "On-prem/hybrid SIEM, SOAR capabilities" }
            ]
        },
        "Configuration Management (CM)": {
            native: [
                { service: "Intune Configuration Profiles", type: "MDM", purpose: "Device settings, baselines, compliance" },
                { service: "Azure Policy", type: "Governance", purpose: "Resource compliance, NIST initiatives" },
                { service: "Azure Automation", type: "Automation", purpose: "Runbooks, DSC, update management" },
                { service: "Microsoft Defender for Cloud", type: "CSPM", purpose: "Security posture, recommendations" }
            ],
            thirdParty: [
                { service: "Tenable.io (Fed)", type: "Vulnerability Management", fedramp: "High", assetType: "Security Protection Asset", purpose: "Vulnerability scanning, configuration assessment" },
                { service: "Qualys (Fed)", type: "Vulnerability Management", fedramp: "High", assetType: "Security Protection Asset", purpose: "Asset inventory, vulnerability scanning" },
                { service: "Rapid7 InsightVM", type: "Vulnerability Management", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Vulnerability management, remediation tracking" },
                { service: "Tanium", type: "Endpoint Management", fedramp: "High", assetType: "Security Protection Asset", purpose: "Endpoint visibility, configuration compliance" }
            ]
        },
        "Identification & Authentication (IA)": {
            native: [
                { service: "Entra ID MFA", type: "MFA", purpose: "Microsoft Authenticator, FIDO2, phone" },
                { service: "Windows Hello for Business", type: "Passwordless", purpose: "Biometric/PIN authentication" },
                { service: "Certificate-Based Auth", type: "PKI", purpose: "Smart card, certificate authentication" },
                { service: "Azure Key Vault", type: "Secrets Management", purpose: "Certificate storage, key management" }
            ],
            thirdParty: [
                { service: "Yubico YubiKey", type: "Hardware Token", fedramp: "N/A", assetType: "Security Protection Asset", purpose: "FIDO2 security keys, PIV smart cards" },
                { service: "RSA SecurID", type: "MFA", fedramp: "High", assetType: "Security Protection Asset", purpose: "Hardware/software tokens, risk-based auth" },
                { service: "Thales SafeNet", type: "PKI/HSM", fedramp: "High", assetType: "Security Protection Asset", purpose: "HSM, certificate management" },
                { service: "Entrust", type: "PKI", fedramp: "High", assetType: "Security Protection Asset", purpose: "Certificate authority, identity verification" }
            ]
        },
        "Incident Response (IR)": {
            native: [
                { service: "Microsoft Defender XDR", type: "XDR", purpose: "Unified incident management, automated response" },
                { service: "Sentinel Playbooks", type: "SOAR", purpose: "Logic Apps automation, incident enrichment" },
                { service: "Defender for Endpoint", type: "EDR", purpose: "Endpoint detection, live response, isolation" }
            ],
            thirdParty: [
                { service: "CrowdStrike Falcon (GovCloud)", type: "EDR", fedramp: "High", assetType: "Security Protection Asset", purpose: "Endpoint detection, threat hunting, IR" },
                { service: "Palo Alto Cortex XSOAR", type: "SOAR", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Playbook automation, case management" },
                { service: "ServiceNow SecOps", type: "ITSM/SOAR", fedramp: "High", assetType: "Security Protection Asset", purpose: "Security incident management, workflows" },
                { service: "Swimlane", type: "SOAR", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Low-code security automation" }
            ]
        },
        "Maintenance (MA)": {
            native: [
                { service: "Azure Update Manager", type: "Patch Management", purpose: "VM patching, update scheduling" },
                { service: "Intune Windows Update", type: "Patch Management", purpose: "Update rings, feature updates" },
                { service: "Azure Bastion", type: "Remote Access", purpose: "Secure maintenance access" },
                { service: "Intune Remote Help", type: "Remote Support", purpose: "Helpdesk remote assistance" }
            ],
            thirdParty: [
                { service: "SCCM/MECM", type: "Endpoint Management", fedramp: "N/A (on-prem)", assetType: "Security Protection Asset", purpose: "Software deployment, patching, inventory" },
                { service: "Ivanti", type: "Patch Management", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Patch management, endpoint security" },
                { service: "ManageEngine", type: "IT Management", fedramp: "N/A", assetType: "Security Protection Asset", purpose: "Patch management, remote support" }
            ]
        },
        "Media Protection (MP)": {
            native: [
                { service: "BitLocker", type: "Encryption", purpose: "Full disk encryption, TPM integration" },
                { service: "Defender Device Control", type: "DLP", purpose: "USB blocking, removable media policies" },
                { service: "Purview Information Protection", type: "DLP", purpose: "Sensitivity labels, encryption" },
                { service: "Intune Wipe", type: "Sanitization", purpose: "Remote wipe, selective wipe" }
            ],
            thirdParty: [
                { service: "Virtru", type: "Email Encryption", fedramp: "Moderate", assetType: "CUI Asset", purpose: "End-to-end email encryption, key management" },
                { service: "Digital Guardian", type: "DLP", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Data loss prevention, endpoint DLP" },
                { service: "Forcepoint DLP", type: "DLP", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Cloud and endpoint DLP" },
                { service: "IronKey", type: "Encrypted Storage", fedramp: "N/A", assetType: "CUI Asset", purpose: "FIPS 140-2 encrypted USB drives" }
            ]
        },
        "Physical Protection (PE)": {
            native: [
                { service: "Azure Datacenter (Inherited)", type: "Physical Security", purpose: "Microsoft manages physical datacenter security" }
            ],
            thirdParty: [
                { service: "Envoy", type: "Visitor Management", fedramp: "N/A", assetType: "Contractor Risk Managed Asset", purpose: "Digital visitor logs, badge printing" },
                { service: "Verkada", type: "Physical Security", fedramp: "N/A", assetType: "Security Protection Asset", purpose: "Cloud-managed cameras, access control" },
                { service: "Brivo", type: "Access Control", fedramp: "N/A", assetType: "Security Protection Asset", purpose: "Cloud-based door access control" }
            ]
        },
        "Personnel Security (PS)": {
            native: [
                { service: "Entra ID Lifecycle Workflows", type: "Identity Lifecycle", purpose: "Onboarding/offboarding automation" }
            ],
            thirdParty: [
                { service: "Sterling", type: "Background Check", fedramp: "N/A", assetType: "Contractor Risk Managed Asset", purpose: "Employment verification, background screening" },
                { service: "HireRight", type: "Background Check", fedramp: "N/A", assetType: "Contractor Risk Managed Asset", purpose: "Background checks, drug screening" },
                { service: "Workday", type: "HCM", fedramp: "Moderate", assetType: "Contractor Risk Managed Asset", purpose: "HR system of record, personnel tracking" }
            ]
        },
        "Risk Assessment (RA)": {
            native: [
                { service: "Microsoft Defender for Cloud", type: "CSPM", purpose: "Security posture, vulnerability assessment" },
                { service: "Defender Vulnerability Management", type: "Vulnerability Scanner", purpose: "Continuous vulnerability scanning" },
                { service: "Microsoft Secure Score", type: "Security Posture", purpose: "Security recommendations, benchmarking" }
            ],
            thirdParty: [
                { service: "Tenable.sc", type: "Vulnerability Management", fedramp: "High", assetType: "Security Protection Asset", purpose: "On-prem vulnerability management" },
                { service: "Qualys VMDR", type: "Vulnerability Management", fedramp: "High", assetType: "Security Protection Asset", purpose: "Vulnerability detection and response" },
                { service: "Archer", type: "GRC", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Risk management, compliance tracking" },
                { service: "ServiceNow GRC", type: "GRC", fedramp: "High", assetType: "Security Protection Asset", purpose: "Risk register, policy management" }
            ]
        },
        "System & Communications Protection (SC)": {
            native: [
                { service: "Azure Firewall", type: "Network Security", purpose: "L3-L7 filtering, threat intelligence" },
                { service: "Azure VPN Gateway", type: "VPN", purpose: "FIPS IPsec, site-to-site connectivity" },
                { service: "Azure Front Door + WAF", type: "WAF", purpose: "Web application firewall, DDoS protection" },
                { service: "Azure Key Vault HSM", type: "HSM", purpose: "FIPS 140-2 Level 3 key storage" },
                { service: "Azure Private Link", type: "Network Isolation", purpose: "Private connectivity to PaaS services" }
            ],
            thirdParty: [
                { service: "Palo Alto Networks (VM-Series)", type: "NGFW", fedramp: "High", assetType: "Security Protection Asset", purpose: "Next-gen firewall, threat prevention" },
                { service: "Zscaler (GovCloud)", type: "SASE/SSE", fedramp: "High", assetType: "Security Protection Asset", purpose: "Zero trust network access, SWG" },
                { service: "Netskope (GovCloud)", type: "CASB/SSE", fedramp: "High", assetType: "Security Protection Asset", purpose: "Cloud security, DLP, CASB" },
                { service: "Cloudflare (Gov)", type: "CDN/WAF", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "DDoS protection, WAF, CDN" },
                { service: "Cisco Umbrella", type: "DNS Security", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "DNS filtering, secure web gateway" }
            ]
        },
        "System & Information Integrity (SI)": {
            native: [
                { service: "Microsoft Defender for Endpoint", type: "EDR", purpose: "Antimalware, EDR, threat analytics" },
                { service: "Microsoft Defender Antivirus", type: "Antimalware", purpose: "Real-time protection, cloud-delivered" },
                { service: "Azure DDoS Protection", type: "DDoS", purpose: "Volumetric attack mitigation" }
            ],
            thirdParty: [
                { service: "CrowdStrike Falcon", type: "EDR/XDR", fedramp: "High", assetType: "Security Protection Asset", purpose: "Next-gen antivirus, threat intelligence" },
                { service: "SentinelOne", type: "EDR", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Autonomous endpoint protection" },
                { service: "Carbon Black", type: "EDR", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Endpoint detection, application control" },
                { service: "Trend Micro", type: "Endpoint Security", fedramp: "Moderate", assetType: "Security Protection Asset", purpose: "Server and endpoint protection" }
            ]
        }
    },

    // CUI Asset Categories
    cuiAssetTypes: [
        { type: "CUI Asset", description: "Systems that store, process, or transmit CUI directly", examples: "SharePoint libraries, file shares, databases with CUI" },
        { type: "Security Protection Asset", description: "Systems that provide security functions protecting CUI", examples: "Firewalls, SIEM, EDR, MFA providers" },
        { type: "Contractor Risk Managed Asset", description: "Systems managed by contractors with appropriate controls", examples: "Background check services, HR systems, visitor management" },
        { type: "Specialized Asset", description: "OT/IoT systems with limited security capability", examples: "Manufacturing equipment, lab instruments" },
        { type: "Out of Scope", description: "Systems with no CUI nexus", examples: "Marketing website, public-facing apps" }
    ],

    // Azure Government Environment Info
    azureGovEndpoints: {
        description: "Azure Government uses separate endpoints from commercial Azure for FedRAMP High compliance.",
        endpoints: [
            { service: "Portal", url: "https://portal.azure.us" },
            { service: "Azure AD / Entra ID", url: "https://login.microsoftonline.us" },
            { service: "Graph API", url: "https://graph.microsoft.us" },
            { service: "Management API", url: "https://management.usgovcloudapi.net" },
            { service: "Key Vault", url: "https://{vault-name}.vault.usgovcloudapi.net" },
            { service: "Storage", url: "https://{storage-account}.blob.core.usgovcloudapi.net" }
        ],
        powershellConnections: [
            { module: "Az Module", command: "Connect-AzAccount -Environment AzureUSGovernment" },
            { module: "Microsoft Graph", command: "Connect-MgGraph -Environment USGov" },
            { module: "Exchange Online", command: "Connect-ExchangeOnline -ExchangeEnvironmentName O365USGovGCCHigh" },
            { module: "Security & Compliance", command: "Connect-IPPSSession -ConnectionUri https://ps.compliance.protection.office365.us/powershell-liveid/" },
            { module: "SharePoint Online", command: "Connect-SPOService -Url https://{tenant}-admin.sharepoint.us" }
        ]
    }
};

// Helper function to get implementation guide data
function getGCCHighImplGuide() {
    return GCC_HIGH_IMPL_GUIDE;
}

// Export project plan as CSV format
function exportProjectPlanCSV() {
    const headers = ["Phase", "Week", "Task_ID", "Task", "Owner", "Accountable", "Deliverable", "Status"];
    const rows = GCC_HIGH_IMPL_GUIDE.projectPlan.map(t => 
        [t.phase, t.week, t.taskId, t.task, t.owner, t.accountable, t.deliverable, "Pending"].join(",")
    );
    return [headers.join(","), ...rows].join("\n");
}

// Export SSP statements for a specific control
function getSSPStatement(controlId) {
    const baseId = controlId.split('[')[0]; // Get base control ID (e.g., "3.1.1" from "3.1.1[a]")
    return GCC_HIGH_IMPL_GUIDE.sspStatements[baseId] || null;
}

// Get evidence strategy for a domain
function getEvidenceStrategy(domain) {
    return GCC_HIGH_IMPL_GUIDE.evidenceStrategy.filter(e => e.domain.toLowerCase().includes(domain.toLowerCase()));
}
