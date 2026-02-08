// SCuBA Baselines & Configuration Drift Tracking Data
// Sources:
//   - Microsoft Graph UTCM API (beta): https://learn.microsoft.com/en-us/graph/api/resources/unified-tenant-configuration-management-api-overview
//   - CISA ScubaGear (M365): https://github.com/cisagov/ScubaGear
//   - CISA ScubaGoggles (Google Workspace): https://github.com/cisagov/ScubaGoggles
// Version: 1.0.0

const SCUBA_CONFIG_DRIFT_DATA = {
    version: "1.0.0",
    lastUpdated: "2026-02-08",

    // ===== MICROSOFT GRAPH UTCM API =====
    utcm: {
        title: "Microsoft Graph Unified Tenant Configuration Management (UTCM)",
        description: "The UTCM APIs (beta) allow administrators to create configuration baselines, monitor for drift across M365/Azure workloads, take snapshots, and detect when settings deviate from your desired state. Runs every 6 hours automatically.",
        status: "Public Preview (Beta)",
        appId: "03b07b79-c5bc-4b5e-9bfa-13acf4a99998",
        docsUrl: "https://learn.microsoft.com/en-us/graph/api/resources/unified-tenant-configuration-management-api-overview?view=graph-rest-beta",
        authSetupUrl: "https://learn.microsoft.com/en-us/graph/utcm-authentication-setup",

        coreResources: [
            {
                name: "configurationBaseline",
                description: "Defines the desired configuration state for your tenant. Serves as the reference point for drift detection.",
                docsUrl: "https://learn.microsoft.com/en-us/graph/api/resources/configurationbaseline?view=graph-rest-beta",
                methods: ["List", "Get", "Create", "Update", "Delete"]
            },
            {
                name: "configurationMonitor",
                description: "Watches for changes against a baseline. Runs every 6 hours. Up to 30 monitors per tenant, 800 resources/day.",
                docsUrl: "https://learn.microsoft.com/en-us/graph/api/resources/configurationmonitor?view=graph-rest-beta",
                methods: ["List", "Get", "Create", "Update", "Delete"]
            },
            {
                name: "configurationDrift",
                description: "Represents a detected deviation from the baseline. Active drifts persist until resolved; fixed drifts retained 30 days.",
                docsUrl: "https://learn.microsoft.com/en-us/graph/api/resources/configurationdrift?view=graph-rest-beta",
                methods: ["List", "Get"]
            },
            {
                name: "configurationMonitoringResult",
                description: "Results from each monitoring cycle showing which resources matched or deviated from the baseline.",
                docsUrl: "https://learn.microsoft.com/en-us/graph/api/resources/configurationmonitoringresult?view=graph-rest-beta",
                methods: ["List", "Get"]
            },
            {
                name: "configurationSnapshotJob",
                description: "Extracts current tenant configuration as a point-in-time snapshot. Max 20,000 resources/month, retained 7 days.",
                docsUrl: "https://learn.microsoft.com/en-us/graph/api/resources/configurationsnapshotjob?view=graph-rest-beta",
                methods: ["List", "Get", "Create", "Delete"]
            }
        ],

        limits: {
            monitors: { max: 30, note: "Per tenant" },
            monitorInterval: { hours: 6, note: "Fixed, cannot be changed" },
            resourcesPerDay: { max: 800, note: "Across all monitors" },
            snapshotResourcesPerMonth: { max: 20000, note: "Cumulative across all snapshots" },
            snapshotRetention: { days: 7, note: "Auto-deleted after 7 days" },
            maxSnapshotJobs: { max: 12, note: "Visible at a time; delete old to create new" },
            driftRetention: { note: "Active drifts retained indefinitely; fixed drifts deleted after 30 days" }
        },

        setupSteps: [
            {
                title: "Install PowerShell Modules",
                description: "Install the Microsoft Graph PowerShell SDK modules required for UTCM setup.",
                commands: [
                    "Install-Module Microsoft.Graph.Authentication",
                    "Install-Module Microsoft.Graph.Applications"
                ]
            },
            {
                title: "Connect to Microsoft Graph",
                description: "Authenticate with Application.ReadWrite.All scope to create the service principal.",
                commands: [
                    "Connect-MgGraph -Scopes 'Application.ReadWrite.All'"
                ]
            },
            {
                title: "Create UTCM Service Principal",
                description: "Add the UTCM service principal to your tenant using the official App ID.",
                commands: [
                    "New-MgServicePrincipal -AppId '03b07b79-c5bc-4b5e-9bfa-13acf4a99998'"
                ]
            },
            {
                title: "Grant Permissions to UTCM SP",
                description: "Grant the UTCM service principal the necessary permissions (e.g., User.ReadWrite.All, Policy.Read.All) to read workload configurations.",
                commands: [
                    "$permissions = @('User.ReadWrite.All', 'Policy.Read.All')",
                    "$Graph = Get-MgServicePrincipal -Filter \"AppId eq '00000003-0000-0000-c000-000000000000'\"",
                    "$UTCM = Get-MgServicePrincipal -Filter \"AppId eq '03b07b79-c5bc-4b5e-9bfa-13acf4a99998'\"",
                    "foreach ($requestedPermission in $permissions) {",
                    "    $AppRole = $Graph.AppRoles | Where-Object { $_.Value -eq $requestedPermission }",
                    "    $body = @{ AppRoleId = $AppRole.Id; ResourceId = $Graph.Id; PrincipalId = $UTCM.Id }",
                    "    New-MgServicePrincipalAppRoleAssignment -ServicePrincipalId $UTCM.Id -BodyParameter $body",
                    "}"
                ]
            },
            {
                title: "Create a Configuration Snapshot",
                description: "Take a point-in-time snapshot of your current tenant configuration to establish a baseline.",
                commands: [
                    "# Via Graph API:",
                    "POST https://graph.microsoft.com/beta/tenantManagement/configurationSnapshotJobs",
                    "Content-Type: application/json",
                    "{ \"displayName\": \"Initial Baseline Snapshot\" }"
                ]
            },
            {
                title: "Create a Configuration Monitor",
                description: "Set up a monitor that checks your tenant against the baseline every 6 hours and reports drifts.",
                commands: [
                    "# Via Graph API:",
                    "POST https://graph.microsoft.com/beta/tenantManagement/configurationMonitors",
                    "Content-Type: application/json",
                    "{",
                    "  \"displayName\": \"CMMC Compliance Monitor\",",
                    "  \"baselineId\": \"<your-baseline-id>\"",
                    "}"
                ]
            },
            {
                title: "Review Drifts",
                description: "Query active drifts to identify configuration changes that deviate from your baseline.",
                commands: [
                    "# List all active drifts:",
                    "GET https://graph.microsoft.com/beta/tenantManagement/configurationDrifts",
                    "",
                    "# Get specific drift details:",
                    "GET https://graph.microsoft.com/beta/tenantManagement/configurationDrifts/{drift-id}"
                ]
            }
        ],

        cmmcRelevance: [
            { control: "3.4.1", name: "System Baseline Configuration", description: "UTCM baselines directly satisfy the requirement to establish and maintain baseline configurations." },
            { control: "3.4.2", name: "Security Configuration Settings", description: "Monitors detect when security settings deviate from established configurations." },
            { control: "3.4.3", name: "Configuration Change Control", description: "Drift detection provides automated change tracking for M365/Azure configurations." },
            { control: "3.4.5", name: "Access Restrictions for Change", description: "Monitoring results show who/what changed configurations, supporting access restriction verification." },
            { control: "3.3.1", name: "System Audit Logs", description: "Snapshot and monitoring results provide an audit trail of configuration states over time." },
            { control: "3.12.1", name: "Security Assessment", description: "Automated 6-hour monitoring cycles serve as continuous security assessment of cloud configurations." },
            { control: "3.12.3", name: "Monitoring Security Controls", description: "UTCM monitors provide ongoing monitoring of security control effectiveness in M365/Azure." }
        ]
    },

    // ===== CISA ScubaGear (M365) =====
    scubaGear: {
        title: "CISA ScubaGear — M365 Secure Configuration Assessment",
        description: "ScubaGear is CISA's official assessment tool that verifies Microsoft 365 tenant configuration against SCuBA Secure Configuration Baselines. Uses PowerShell + Open Policy Agent (OPA) with Rego policies. Outputs HTML, JSON, and CSV reports.",
        repoUrl: "https://github.com/cisagov/ScubaGear",
        docsUrl: "https://cisagov.github.io/ScubaGear",
        mappingsUrl: "https://github.com/cisagov/ScubaGear/blob/main/docs/misc/mappings.md",
        license: "CC0-1.0 (Public Domain)",
        bod2501: true,
        bod2501Note: "Required for CISA Binding Operational Directive (BOD) 25-01 compliance submissions.",

        baselines: [
            {
                id: "aad",
                name: "Microsoft Entra ID",
                description: "Identity and access management policies — MFA, conditional access, privileged roles, authentication methods, guest access, password policies.",
                policyCount: 20,
                docsUrl: "https://github.com/cisagov/ScubaGear/blob/main/PowerShell/ScubaGear/baselines/aad.md",
                cmmcControls: ["3.1.1", "3.1.2", "3.1.5", "3.5.1", "3.5.2", "3.5.3", "3.5.7", "3.5.8", "3.5.10"],
                keyPolicies: [
                    "Phishing-resistant MFA for all users",
                    "Conditional Access policies blocking legacy authentication",
                    "Privileged role assignments limited and reviewed",
                    "Guest access restricted to minimum necessary",
                    "Password expiration and complexity requirements",
                    "Authentication methods restricted to secure options"
                ]
            },
            {
                id: "defender",
                name: "Microsoft Defender",
                description: "Advanced threat protection settings — Safe Links, Safe Attachments, anti-phishing, anti-malware, preset security policies.",
                policyCount: 14,
                docsUrl: "https://github.com/cisagov/ScubaGear/blob/main/PowerShell/ScubaGear/baselines/defender.md",
                cmmcControls: ["3.13.1", "3.13.2", "3.14.1", "3.14.2", "3.14.4", "3.14.5", "3.14.6"],
                keyPolicies: [
                    "Safe Links enabled for all users with URL scanning",
                    "Safe Attachments enabled with Dynamic Delivery",
                    "Anti-phishing policies with impersonation protection",
                    "Anti-malware with common attachment type filtering",
                    "Preset security policies applied (Standard or Strict)",
                    "Zero-hour Auto Purge (ZAP) enabled"
                ]
            },
            {
                id: "exo",
                name: "Exchange Online",
                description: "Email security and compliance — transport rules, DMARC/DKIM/SPF, external forwarding, audit logging, mailbox access.",
                policyCount: 17,
                docsUrl: "https://github.com/cisagov/ScubaGear/blob/main/PowerShell/ScubaGear/baselines/exo.md",
                cmmcControls: ["3.1.1", "3.1.3", "3.3.1", "3.3.2", "3.13.1", "3.13.8"],
                keyPolicies: [
                    "External email forwarding disabled",
                    "SPF, DKIM, and DMARC configured and enforced",
                    "Unified audit logging enabled",
                    "Mailbox audit logging enabled for all mailboxes",
                    "Transport rules reviewed and documented",
                    "Automatic replies restricted for external recipients"
                ]
            },
            {
                id: "sharepoint",
                name: "SharePoint Online",
                description: "Document collaboration and access controls — external sharing, guest access, site-level permissions, DLP integration.",
                policyCount: 8,
                docsUrl: "https://github.com/cisagov/ScubaGear/blob/main/PowerShell/ScubaGear/baselines/sharepoint.md",
                cmmcControls: ["3.1.1", "3.1.2", "3.1.3", "3.1.22", "3.8.1", "3.8.2"],
                keyPolicies: [
                    "External sharing restricted to authenticated guests",
                    "Guest access expiration configured",
                    "File and folder link defaults set to organization-only",
                    "DLP policies applied to SharePoint sites",
                    "Site-level sharing controls enforced",
                    "OneDrive sync restricted to managed devices"
                ]
            },
            {
                id: "teams",
                name: "Microsoft Teams",
                description: "Communication and meeting security — external access, guest policies, meeting settings, app permissions, channel policies.",
                policyCount: 10,
                docsUrl: "https://github.com/cisagov/ScubaGear/blob/main/PowerShell/ScubaGear/baselines/teams.md",
                cmmcControls: ["3.1.1", "3.1.2", "3.1.3", "3.1.12", "3.13.1"],
                keyPolicies: [
                    "External access limited to specific domains or disabled",
                    "Guest access controlled and reviewed",
                    "Anonymous meeting join disabled or restricted",
                    "Third-party app installation controlled",
                    "Meeting recording and transcription policies set",
                    "Channel creation restricted to appropriate roles"
                ]
            },
            {
                id: "powerbi",
                name: "Power BI",
                description: "Cloud-based data visualization security — external sharing, export controls, embed settings, certification.",
                policyCount: 6,
                docsUrl: "https://github.com/cisagov/ScubaGear/blob/main/PowerShell/ScubaGear/baselines/powerbi.md",
                cmmcControls: ["3.1.1", "3.1.2", "3.1.22", "3.8.1"],
                keyPolicies: [
                    "External sharing of reports/dashboards restricted",
                    "Export to file formats controlled",
                    "Embed codes for public websites disabled",
                    "Certification and endorsement policies configured"
                ]
            },
            {
                id: "powerplatform",
                name: "Power Platform",
                description: "Low-code application security — environment creation, DLP policies, connector controls, tenant isolation.",
                policyCount: 7,
                docsUrl: "https://github.com/cisagov/ScubaGear/blob/main/PowerShell/ScubaGear/baselines/powerplatform.md",
                cmmcControls: ["3.1.1", "3.1.2", "3.4.1", "3.4.2", "3.13.1"],
                keyPolicies: [
                    "Environment creation restricted to admins",
                    "DLP policies applied to all environments",
                    "Third-party connectors blocked or restricted",
                    "Tenant isolation enabled",
                    "Power Apps sharing restricted",
                    "Dataverse security roles configured"
                ]
            }
        ],

        installation: {
            prerequisites: [
                "Windows with PowerShell 5.1+",
                "Internet connectivity to PSGallery and M365 APIs",
                "Global Administrator or equivalent M365 admin role",
                "Microsoft Graph PowerShell SDK"
            ],
            steps: [
                { title: "Install ScubaGear", command: "Install-Module -Name ScubaGear" },
                { title: "Install Dependencies", command: "Initialize-SCuBA" },
                { title: "Verify Installation", command: "Invoke-SCuBA -Version" },
                { title: "Run First Assessment (All Products)", command: "Invoke-SCuBA -ProductNames *" },
                { title: "Run with Config File", command: "Invoke-SCuBA -ConfigFilePath \"path/to/config.yaml\" -Organization 'example.onmicrosoft.com'" },
                { title: "Run for BOD 25-01", command: "Invoke-SCuBA -ConfigFilePath \"path/to/config.yaml\"" },
                { title: "Run without BOD Warning", command: "Invoke-SCuBA -ConfigFilePath \"path/to/config.yaml\" -SilenceBODWarnings" },
                { title: "Update ScubaGear", command: "Update-ScubaGear" },
                { title: "Reset Dependencies", command: "Reset-ScubaGearDependencies" }
            ],
            configFile: {
                description: "YAML configuration file defines how your environment should be evaluated. Required for BOD 25-01 submissions.",
                purposes: [
                    "Specify which products, baselines, and rules apply",
                    "Align policies with your tenant's current settings",
                    "Document intentional deviations using exclusions, annotations, or omissions",
                    "Maintain audit trail of accepted risks and policy decisions",
                    "Run consistent assessments over time or across environments"
                ],
                sampleUrl: "https://github.com/cisagov/ScubaGear/blob/main/PowerShell/ScubaGear/Sample-Config-Files/full_config.yaml",
                configDocsUrl: "https://github.com/cisagov/ScubaGear/blob/main/docs/configuration/configuration.md"
            }
        },

        workflow: {
            description: "ScubaGear uses a three-step process to assess M365 configuration compliance.",
            steps: [
                { step: 1, name: "Export", description: "PowerShell queries M365 APIs for configuration settings across all selected products." },
                { step: 2, name: "Verify", description: "Open Policy Agent (OPA) compares exported settings against Rego security policies written per the SCuBA baseline documents." },
                { step: 3, name: "Report", description: "Results packaged as HTML, JSON, and CSV reports showing pass/fail/warning/error for each policy." }
            ]
        },

        iterativeApproach: [
            { run: "First Run (No Config)", description: "Run without a configuration file to generate a baseline template of your environment's current settings. Does not make changes." },
            { run: "Review Results", description: "Analyze the HTML report. Identify gaps between your tenant and the SCuBA baselines." },
            { run: "Build YAML Config", description: "Create a YAML configuration file documenting exclusions, annotations, and omissions for intentional deviations." },
            { run: "Subsequent Runs (With Config)", description: "Run with the config file to compare intended settings against actual environment. Discrepancies are elevated." },
            { run: "Remediate & Re-assess", description: "Fix identified gaps, update config file, and re-run to verify compliance." }
        ]
    },

    // ===== CISA ScubaGoggles (Google Workspace) =====
    scubaGoggles: {
        title: "CISA ScubaGoggles — Google Workspace Secure Configuration Assessment",
        description: "ScubaGoggles is CISA's assessment tool for Google Workspace (GWS) organizations. Uses Python + Google Admin SDK API + OPA Rego policies. Exports settings as JSON, verifies against baselines, and reports as HTML/JSON.",
        repoUrl: "https://github.com/cisagov/ScubaGoggles",
        license: "CC0-1.0 (Public Domain)",
        status: "Alpha (Active Development)",
        statusNote: "Outputs should be reviewed carefully as the tool is in active development.",

        baselines: [
            {
                id: "gmail",
                name: "Gmail",
                description: "Email security — SPF, DKIM, DMARC, attachment security, link protection, spoofing controls, content compliance.",
                docsUrl: "https://github.com/cisagov/ScubaGoggles/blob/main/scubagoggles/baselines/gmail.md",
                cmmcControls: ["3.13.1", "3.13.8", "3.14.1", "3.14.5"],
                keyPolicies: [
                    "SPF records published for all domains",
                    "DKIM signing enabled for all domains",
                    "DMARC policy set to reject or quarantine",
                    "Attachment security with enhanced scanning",
                    "Link protection with URL scanning",
                    "Spoofing and authentication controls enabled"
                ]
            },
            {
                id: "drive",
                name: "Google Drive and Docs",
                description: "File sharing and collaboration — external sharing, link sharing defaults, DLP, access controls, offline access.",
                docsUrl: "https://github.com/cisagov/ScubaGoggles/blob/main/scubagoggles/baselines/drive.md",
                cmmcControls: ["3.1.1", "3.1.2", "3.1.3", "3.1.22", "3.8.1", "3.8.2"],
                keyPolicies: [
                    "External sharing restricted or disabled for CUI",
                    "Link sharing defaults set to restricted",
                    "DLP rules applied to detect CUI patterns",
                    "Offline access disabled for sensitive content",
                    "Shared drive creation restricted to admins",
                    "Transfer of ownership controls configured"
                ]
            },
            {
                id: "meet",
                name: "Google Meet",
                description: "Video conferencing security — meeting access, recording, external participants, host controls.",
                docsUrl: "https://github.com/cisagov/ScubaGoggles/blob/main/scubagoggles/baselines/meet.md",
                cmmcControls: ["3.1.1", "3.1.12", "3.13.1"],
                keyPolicies: [
                    "External participant access controlled",
                    "Meeting recording policies configured",
                    "Host management controls enabled",
                    "Anonymous join restricted"
                ]
            },
            {
                id: "chat",
                name: "Google Chat",
                description: "Messaging security — external chat, spaces, history, file sharing controls.",
                docsUrl: "https://github.com/cisagov/ScubaGoggles/blob/main/scubagoggles/baselines/chat.md",
                cmmcControls: ["3.1.1", "3.1.3", "3.13.1"],
                keyPolicies: [
                    "External chat restricted or disabled",
                    "Chat history retention configured",
                    "File sharing in chat controlled",
                    "Spaces creation restricted"
                ]
            },
            {
                id: "calendar",
                name: "Google Calendar",
                description: "Calendar sharing and access — external sharing, event visibility, resource booking.",
                docsUrl: "https://github.com/cisagov/ScubaGoggles/blob/main/scubagoggles/baselines/calendar.md",
                cmmcControls: ["3.1.1", "3.1.3"],
                keyPolicies: [
                    "External calendar sharing restricted",
                    "Event details visibility controlled",
                    "Resource booking policies configured"
                ]
            },
            {
                id: "groups",
                name: "Groups for Business",
                description: "Group management — creation controls, external membership, posting permissions, group visibility.",
                docsUrl: "https://github.com/cisagov/ScubaGoggles/blob/main/scubagoggles/baselines/groups.md",
                cmmcControls: ["3.1.1", "3.1.2", "3.1.22"],
                keyPolicies: [
                    "Group creation restricted to admins",
                    "External membership controlled",
                    "Posting permissions configured",
                    "Group visibility and discoverability managed"
                ]
            },
            {
                id: "sites",
                name: "Google Sites",
                description: "Website creation and sharing — site creation controls, external sharing, publishing restrictions.",
                docsUrl: "https://github.com/cisagov/ScubaGoggles/blob/main/scubagoggles/baselines/sites.md",
                cmmcControls: ["3.1.1", "3.1.3"],
                keyPolicies: [
                    "Site creation restricted to appropriate users",
                    "External sharing of sites controlled",
                    "Publishing to public web restricted"
                ]
            },
            {
                id: "classroom",
                name: "Google Classroom",
                description: "Education platform security — class creation, student data, external access.",
                docsUrl: "https://github.com/cisagov/ScubaGoggles/blob/main/scubagoggles/baselines/classroom.md",
                cmmcControls: ["3.1.1"],
                keyPolicies: [
                    "Class creation permissions controlled",
                    "External access to classes restricted"
                ]
            },
            {
                id: "commoncontrols",
                name: "Common Controls",
                description: "Tenant-wide settings — login challenges, 2-step verification, session management, mobile management, app access.",
                docsUrl: "https://github.com/cisagov/ScubaGoggles/blob/main/scubagoggles/baselines/commoncontrols.md",
                cmmcControls: ["3.1.1", "3.1.2", "3.5.1", "3.5.2", "3.5.3", "3.5.7", "3.5.8", "3.13.11"],
                keyPolicies: [
                    "2-step verification enforced for all users",
                    "Security keys required for privileged accounts",
                    "Session duration and timeout configured",
                    "Mobile device management enforced",
                    "Third-party app access controlled via OAuth",
                    "Login challenges and suspicious activity detection enabled",
                    "Password policies configured"
                ]
            },
            {
                id: "gemini",
                name: "Gemini",
                description: "AI assistant security — data usage, training opt-out, access controls for Gemini features.",
                docsUrl: "https://github.com/cisagov/ScubaGoggles/blob/main/scubagoggles/baselines/gemini.md",
                cmmcControls: ["3.1.1", "3.1.2"],
                keyPolicies: [
                    "Gemini access restricted to appropriate users",
                    "Data usage for AI training opted out",
                    "Gemini features controlled per organizational unit"
                ]
            },
            {
                id: "assuredcontrols",
                name: "Assured Controls",
                description: "Compliance and data residency — data regions, access management, encryption controls for regulated workloads.",
                docsUrl: "https://github.com/cisagov/ScubaGoggles/blob/main/scubagoggles/baselines/assuredcontrols.md",
                cmmcControls: ["3.1.1", "3.8.1", "3.13.8", "3.13.11"],
                keyPolicies: [
                    "Data region restrictions configured",
                    "Access management controls for compliance",
                    "Encryption key management configured",
                    "Compliance monitoring enabled"
                ]
            }
        ],

        installation: {
            prerequisites: [
                "Python 3.10+",
                "Google Cloud project with Admin SDK API enabled",
                "Google Workspace Super Admin or delegated admin role",
                "OAuth credentials or Service Account with domain-wide delegation",
                "OPA executable (downloaded separately)"
            ],
            steps: [
                { title: "Clone Repository", command: "git clone https://github.com/cisagov/ScubaGoggles.git && cd ScubaGoggles" },
                { title: "Install Python Package", command: "pip install ." },
                { title: "Download OPA Executable", command: "# Download from https://www.openpolicyagent.org/docs/latest/#running-opa" },
                { title: "Configure Credentials (OAuth)", command: "# Place credentials.json in working directory\n# See: docs/authentication/OAuth.md" },
                { title: "Configure Credentials (Service Account)", command: "# Create service account with domain-wide delegation\n# See: docs/authentication/ServiceAccount.md" },
                { title: "Run Assessment (All Baselines)", command: "scubagoggles gws --baselines *" },
                { title: "Run Assessment (Specific Baselines)", command: "scubagoggles gws --baselines gmail drive commoncontrols" },
                { title: "Run with Config File", command: "scubagoggles gws --config config.yaml" },
                { title: "Run with Service Account", command: "scubagoggles gws --baselines * --subjectemail admin@example.com --credentials service_account.json" }
            ],
            authMethods: [
                { method: "OAuth (Interactive)", description: "Browser-based consent flow. Best for one-time or manual assessments.", docsUrl: "https://github.com/cisagov/ScubaGoggles/blob/main/docs/authentication/OAuth.md" },
                { method: "Service Account", description: "Non-interactive, domain-wide delegation. Best for automated/scheduled assessments.", docsUrl: "https://github.com/cisagov/ScubaGoggles/blob/main/docs/authentication/ServiceAccount.md" }
            ]
        },

        workflow: {
            description: "ScubaGoggles uses a three-step process to assess Google Workspace configuration compliance.",
            steps: [
                { step: 1, name: "Export", description: "Uses Google Admin SDK API to export and serialize all relevant logs and settings into JSON." },
                { step: 2, name: "Verify", description: "OPA Rego policies compare exported settings against SCuBA baseline requirements." },
                { step: 3, name: "Report", description: "Results packaged as HTML and JSON reports showing pass/fail/warning for each policy." }
            ]
        },

        driftRules: {
            description: "ScubaGoggles includes a drift-rules directory for detecting configuration changes over time in Google Workspace.",
            docsUrl: "https://github.com/cisagov/ScubaGoggles/tree/main/drift-rules"
        }
    },

    // ===== CMMC Control Mapping Summary =====
    cmmcMapping: {
        description: "How SCuBA baselines and UTCM config drift tracking map to CMMC L2 / NIST 800-171 controls.",
        families: [
            {
                family: "Access Control (AC)",
                controls: [
                    { id: "3.1.1", name: "Authorized Access Control", tools: ["ScubaGear (Entra ID, EXO, SPO, Teams)", "ScubaGoggles (Common Controls, Drive, Gmail)"], evidence: "Baseline assessment reports showing access policies enforced" },
                    { id: "3.1.2", name: "Transaction & Function Control", tools: ["ScubaGear (Entra ID, SPO, Teams, Power BI)", "ScubaGoggles (Common Controls, Groups)"], evidence: "Role-based access reports, conditional access policy exports" },
                    { id: "3.1.3", name: "CUI Flow Enforcement", tools: ["ScubaGear (EXO, SPO, Teams)", "ScubaGoggles (Drive, Chat, Calendar)"], evidence: "External sharing restrictions, DLP policy reports" },
                    { id: "3.1.5", name: "Least Privilege", tools: ["ScubaGear (Entra ID)", "ScubaGoggles (Common Controls)"], evidence: "Privileged role assignment reports" },
                    { id: "3.1.12", name: "Remote Access Monitoring", tools: ["ScubaGear (Teams)", "ScubaGoggles (Meet)"], evidence: "Meeting and collaboration access policy reports" },
                    { id: "3.1.22", name: "Publicly Accessible Content", tools: ["ScubaGear (SPO, Power BI)", "ScubaGoggles (Drive, Groups, Sites)"], evidence: "External sharing and publishing restriction reports" }
                ]
            },
            {
                family: "Audit & Accountability (AU)",
                controls: [
                    { id: "3.3.1", name: "System Audit Logs", tools: ["ScubaGear (EXO)", "UTCM (Monitoring Results)"], evidence: "Unified audit log status, UTCM monitoring result exports" },
                    { id: "3.3.2", name: "User Accountability", tools: ["ScubaGear (EXO)", "UTCM (Drift Detection)"], evidence: "Mailbox audit reports, drift attribution data" }
                ]
            },
            {
                family: "Configuration Management (CM)",
                controls: [
                    { id: "3.4.1", name: "System Baseline Configuration", tools: ["UTCM (Baselines + Snapshots)", "ScubaGear (All)", "ScubaGoggles (All)"], evidence: "UTCM baseline exports, ScubaGear/ScubaGoggles HTML reports as baseline documentation" },
                    { id: "3.4.2", name: "Security Configuration Settings", tools: ["UTCM (Monitors)", "ScubaGear (All)", "ScubaGoggles (All)"], evidence: "SCuBA assessment reports showing security settings compliance" },
                    { id: "3.4.3", name: "Configuration Change Control", tools: ["UTCM (Drift Detection)"], evidence: "UTCM drift reports showing configuration changes detected every 6 hours" },
                    { id: "3.4.5", name: "Access Restrictions for Change", tools: ["UTCM (Monitoring Results)", "ScubaGear (Entra ID)"], evidence: "Conditional access and PIM reports, UTCM change attribution" }
                ]
            },
            {
                family: "Identification & Authentication (IA)",
                controls: [
                    { id: "3.5.1", name: "User Identification", tools: ["ScubaGear (Entra ID)", "ScubaGoggles (Common Controls)"], evidence: "Identity provider configuration reports" },
                    { id: "3.5.2", name: "Authentication for Users", tools: ["ScubaGear (Entra ID)", "ScubaGoggles (Common Controls)"], evidence: "MFA/2SV enforcement reports" },
                    { id: "3.5.3", name: "Multi-Factor Authentication", tools: ["ScubaGear (Entra ID)", "ScubaGoggles (Common Controls)"], evidence: "Phishing-resistant MFA / security key enforcement reports" }
                ]
            },
            {
                family: "System & Communications Protection (SC)",
                controls: [
                    { id: "3.13.1", name: "Boundary Protection", tools: ["ScubaGear (Defender, EXO, Teams, Power Platform)", "ScubaGoggles (Gmail, Meet, Chat)"], evidence: "Email security, meeting access, and app control reports" },
                    { id: "3.13.8", name: "CUI in Transit", tools: ["ScubaGear (EXO)", "ScubaGoggles (Gmail, Assured Controls)"], evidence: "TLS enforcement, email encryption policy reports" },
                    { id: "3.13.11", name: "FIPS-Validated Cryptography", tools: ["ScubaGoggles (Common Controls, Assured Controls)"], evidence: "Encryption configuration and key management reports" }
                ]
            },
            {
                family: "System & Information Integrity (SI)",
                controls: [
                    { id: "3.14.1", name: "Flaw Remediation", tools: ["ScubaGear (Defender)"], evidence: "Defender threat protection configuration reports" },
                    { id: "3.14.2", name: "Malicious Code Protection", tools: ["ScubaGear (Defender)"], evidence: "Anti-malware, Safe Attachments, Safe Links reports" },
                    { id: "3.14.4", name: "Update Malicious Code Protection", tools: ["ScubaGear (Defender)"], evidence: "Defender update and ZAP configuration reports" },
                    { id: "3.14.5", name: "System Monitoring", tools: ["ScubaGear (Defender)", "ScubaGoggles (Gmail)", "UTCM (Monitors)"], evidence: "Threat detection, email scanning, and config monitoring reports" }
                ]
            },
            {
                family: "Security Assessment (CA)",
                controls: [
                    { id: "3.12.1", name: "Security Assessment", tools: ["UTCM (Monitors)", "ScubaGear (All)", "ScubaGoggles (All)"], evidence: "Periodic SCuBA assessment reports + UTCM continuous monitoring" },
                    { id: "3.12.3", name: "Monitoring Security Controls", tools: ["UTCM (Monitors + Drifts)"], evidence: "UTCM 6-hour monitoring cycle results and drift alerts" }
                ]
            }
        ]
    },

    // ===== Automation & Scheduling Guidance =====
    automation: {
        title: "Automating SCuBA Assessments & Drift Monitoring",
        strategies: [
            {
                name: "Scheduled ScubaGear via Task Scheduler",
                platform: "Windows",
                description: "Use Windows Task Scheduler to run ScubaGear assessments on a recurring schedule (weekly/monthly).",
                commands: [
                    "# Create a scheduled task to run ScubaGear weekly:",
                    "$action = New-ScheduledTaskAction -Execute 'PowerShell.exe' -Argument '-NoProfile -ExecutionPolicy Bypass -Command \"Invoke-SCuBA -ConfigFilePath C:\\ScubaGear\\config.yaml -SilenceBODWarnings\"'",
                    "$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 6am",
                    "$settings = New-ScheduledTaskSettingsSet -RunOnlyIfNetworkAvailable",
                    "Register-ScheduledTask -TaskName 'ScubaGear Weekly Assessment' -Action $action -Trigger $trigger -Settings $settings -User 'SYSTEM'"
                ]
            },
            {
                name: "Scheduled ScubaGoggles via Cron",
                platform: "Linux/macOS",
                description: "Use cron to run ScubaGoggles assessments on a recurring schedule.",
                commands: [
                    "# Add to crontab (run every Monday at 6 AM):",
                    "0 6 * * 1 cd /opt/ScubaGoggles && scubagoggles gws --baselines * --subjectemail admin@example.com --credentials /opt/creds/service_account.json >> /var/log/scubagoggles.log 2>&1"
                ]
            },
            {
                name: "Azure DevOps Pipeline",
                platform: "Azure DevOps",
                description: "Run ScubaGear as part of a CI/CD pipeline for continuous compliance monitoring.",
                commands: [
                    "# azure-pipelines.yml snippet:",
                    "trigger:",
                    "  schedules:",
                    "    - cron: '0 6 * * 1'",
                    "      branches: { include: [main] }",
                    "",
                    "pool:",
                    "  vmImage: 'windows-latest'",
                    "",
                    "steps:",
                    "  - powershell: |",
                    "      Install-Module -Name ScubaGear -Force",
                    "      Initialize-SCuBA",
                    "      Invoke-SCuBA -ConfigFilePath config.yaml -SilenceBODWarnings",
                    "    displayName: 'Run ScubaGear Assessment'"
                ]
            },
            {
                name: "GitHub Actions Workflow",
                platform: "GitHub",
                description: "Run ScubaGoggles as a GitHub Action for automated Google Workspace assessments.",
                commands: [
                    "# .github/workflows/scubagoggles.yml:",
                    "name: ScubaGoggles Assessment",
                    "on:",
                    "  schedule:",
                    "    - cron: '0 6 * * 1'",
                    "",
                    "jobs:",
                    "  assess:",
                    "    runs-on: ubuntu-latest",
                    "    steps:",
                    "      - uses: actions/checkout@v4",
                    "      - uses: actions/setup-python@v5",
                    "        with: { python-version: '3.12' }",
                    "      - run: pip install scubagoggles",
                    "      - run: scubagoggles gws --baselines * --subjectemail ${{ secrets.ADMIN_EMAIL }} --credentials ${{ secrets.GWS_CREDENTIALS }}",
                    "      - uses: actions/upload-artifact@v4",
                    "        with: { name: scubagoggles-report, path: './ScubaGogglesResults/' }"
                ]
            },
            {
                name: "UTCM Continuous Monitoring",
                platform: "Microsoft Graph",
                description: "UTCM monitors run automatically every 6 hours once created. No scheduling needed — just create the monitor and review drifts.",
                commands: [
                    "# Create monitor (one-time setup):",
                    "POST https://graph.microsoft.com/beta/tenantManagement/configurationMonitors",
                    "{ \"displayName\": \"CMMC Config Monitor\", \"baselineId\": \"<baseline-id>\" }",
                    "",
                    "# Query drifts (run periodically or on-demand):",
                    "GET https://graph.microsoft.com/beta/tenantManagement/configurationDrifts",
                    "",
                    "# PowerShell to check drifts:",
                    "Connect-MgGraph -Scopes 'TenantConfiguration.Read.All'",
                    "Get-MgBetaTenantManagementConfigurationDrift | Format-Table DisplayName, Status, DetectedDateTime"
                ]
            }
        ]
    }
};
