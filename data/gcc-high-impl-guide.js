// GCC High Implementation Guide - Client Resources
// Structured data for CMMC L2 deployment in M365 GCC High / Azure Government

const GCC_HIGH_IMPL_GUIDE = {
    // 8-Week Implementation Timeline
    projectPlan: [
        { phase: "1. Foundation", week: 1, taskId: "T-1.1", task: "Register PnP Automation Identity (Script 00)", owner: "IT Admin", accountable: "FSO", deliverable: "CMMC_App_Config.json" },
        { phase: "1. Foundation", week: 1, taskId: "T-1.2", task: "Configure Azure Gov VPN Gateway", owner: "IT Admin", accountable: "IT Director", deliverable: "VPN Gateway Active" },
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
        { phase: "4. Audit Prep", week: 7, taskId: "T-7.1", task: "Review & Close POA&M Items", owner: "FSO", accountable: "Exec Sponsor", deliverable: "Updated POAM" },
        { phase: "4. Audit Prep", week: 7, taskId: "T-7.2", task: "Run Weekly Log Review (Script)", owner: "FSO", accountable: "IT Director", deliverable: "Weekly Review Log" },
        { phase: "4. Audit Prep", week: 8, taskId: "T-8.1", task: "Final Evidence Export (Script 02)", owner: "IT Admin", accountable: "FSO", deliverable: "JSON Artifacts" },
        { phase: "4. Audit Prep", week: 8, taskId: "T-8.2", task: "Finalize & Sign SSP", owner: "FSO", accountable: "Exec Sponsor", deliverable: "Signed SSP" }
    ],

    // Recurring Operations (Post-Implementation)
    recurringOps: [
        { frequency: "Weekly", activity: "Log Review", owner: "FSO", purpose: "Run evidence script. Sign off on alerts." },
        { frequency: "Weekly", activity: "Vulnerability Check", owner: "IT Admin", purpose: "Check Defender Exposure Score. Patch criticals." },
        { frequency: "Monthly", activity: "Change Control Board (CCB)", owner: "FSO + IT", purpose: "Approve new software/hardware. Review Visitor Logs." },
        { frequency: "Quarterly", activity: "Access Review", owner: "HR + FSO", purpose: "Verify user list. Disable inactive accounts." },
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
        { domain: "Access Control", artifact: "AC_Policies.json", source: "Graph API", command: "Get-MgIdentityConditionalAccessPolicy | ConvertTo-Json -Depth 5", proves: "Geo-blocking, MFA enforcement, Block Legacy Auth" },
        { domain: "Access Control", artifact: "PIM_Elevation_History.json", source: "Graph API", command: "Get-MgAuditLogDirectoryAudit -Filter \"activityDisplayName eq 'Add member to role'\"", proves: "Privilege escalation tracking" },
        { domain: "Access Control", artifact: "Dynamic_Group_Rules.json", source: "Graph API", command: "Get-MgGroup -Filter \"groupTypes/any(c:c eq 'DynamicMembership')\"", proves: "Automated onboarding/offboarding" },
        { domain: "Awareness & Training", artifact: "AT_TrainingStatus.csv", source: "Defender", command: "Get-AttackSimulationTrainingUserCoverage | Export-Csv", proves: "Training completion" },
        { domain: "Audit & Accountability", artifact: "AU_LogSettings.json", source: "Exchange", command: "Get-AdminAuditLogConfig | ConvertTo-Json", proves: "Logging is enabled" },
        { domain: "Config Management", artifact: "CM_DeviceConfig.json", source: "Graph API", command: "Get-MgDeviceManagementDeviceConfiguration | ConvertTo-Json -Depth 4", proves: "USB Block, Software Restrictions" },
        { domain: "Identification & Auth", artifact: "IA_AuthMethods.json", source: "Graph API", command: "Get-MgPolicyAuthenticationMethodPolicy | ConvertTo-Json -Depth 5", proves: "FIDO2/MFA is configured" },
        { domain: "Incident Response", artifact: "IR_Playbooks.json", source: "Azure", command: "Get-AzSentinelAutomationRule | ConvertTo-Json -Depth 3", proves: "Automated response capability" },
        { domain: "Media Protection", artifact: "MP_Encryption_Status.json", source: "Graph API", command: "Get-MgDeviceManagementManagedDevice | Select DeviceName, IsEncrypted | ConvertTo-Json", proves: "BitLocker is ON" },
        { domain: "System Protection", artifact: "SC_FirewallRules.json", source: "Graph API", command: "Get-MgDeviceManagementDeviceConfiguration -Filter \"displayname eq 'Firewall Policy'\" | ConvertTo-Json", proves: "Firewall rules deployed" },
        { domain: "System Integrity", artifact: "SI_MalwareConfig.json", source: "Graph API", command: "Get-MgDeviceManagementManagedDevice | Select DeviceName, RealTimeProtectionEnabled | ConvertTo-Json", proves: "Real-time protection ON" }
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
