// GCC High / Azure Government Implementation Guidance
// Provides automation tips and human intervention notes for each assessment objective

const GCC_HIGH_GUIDANCE = {
    // === ACCESS CONTROL (AC) ===
    "3.1.1[a]": {
        automation: "Use Microsoft Entra ID to query all users via Graph API. Run `Get-MgUser -All` in PowerShell. Set up automated user provisioning from HR systems.",
        azureService: "Microsoft Entra ID, Azure AD Connect",
        humanIntervention: "Review and approve user list quarterly. Verify alignment with HR records.",
        docLink: "https://learn.microsoft.com/en-us/entra/fundamentals/users-default-permissions",
        cliCommands: [
            "Get-MgUser -All | Select DisplayName, UserPrincipalName, AccountEnabled",
            "az ad user list --query \"[].{Name:displayName, UPN:userPrincipalName, Enabled:accountEnabled}\" -o table"
        ]
    },
    "3.1.1[b]": {
        automation: "Use Managed Identities and Service Principals. Query with `Get-MgServicePrincipal -All`. Monitor via Entra ID audit logs.",
        azureService: "Managed Identities, Service Principals",
        humanIntervention: "Document business justification for each service principal. Review quarterly.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview",
        cliCommands: [
            "Get-MgServicePrincipal -All | Select DisplayName, AppId, ServicePrincipalType",
            "az ad sp list --all --query \"[].{Name:displayName, AppId:appId, Type:servicePrincipalType}\" -o table"
        ]
    },
    "3.1.1[c]": {
        automation: "Use Microsoft Intune device compliance policies and Conditional Access. Query enrolled devices via `Get-MgDeviceManagementManagedDevice`.",
        azureService: "Microsoft Intune, Conditional Access",
        humanIntervention: "Approve device enrollment requests. Define compliance baseline requirements.",
        docLink: "https://learn.microsoft.com/en-us/mem/intune/protect/device-compliance-get-started",
        cliCommands: [
            "Get-MgDeviceManagementManagedDevice -All | Select DeviceName, ComplianceState, OperatingSystem",
            "az rest --method GET --url \"https://graph.microsoft.com/v1.0/deviceManagement/managedDevices\""
        ]
    },
    "3.1.1[d]": {
        automation: "Implement Conditional Access policies requiring compliant device + user auth. Enable MFA via Security Defaults or CA policies.",
        azureService: "Conditional Access, MFA, Identity Protection",
        humanIntervention: "Review CA policy exceptions. Approve access for new user roles.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview",
        cliCommands: [
            "az ad conditional-access policy list --query '[].{name:displayName,state:state}'",
            "az rest --method GET --uri 'https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies'"
        ]
    },
    "3.1.1[e]": {
        automation: "Configure Managed Identity permissions via Azure RBAC. Use Workload Identity Federation for external services.",
        azureService: "Azure RBAC, Managed Identities",
        humanIntervention: "Review and approve RBAC role assignments for service principals annually.",
        docLink: "https://learn.microsoft.com/en-us/entra/workload-id/workload-identity-federation",
        cliCommands: [
            "az identity list --query '[].{name:name,principalId:principalId}' -o table",
            "az role assignment list --assignee PRINCIPAL_ID --all"
        ]
    },
    "3.1.1[f]": {
        automation: "Enforce device compliance via Intune + Conditional Access. Block non-compliant/unmanaged devices.",
        azureService: "Intune, Conditional Access",
        humanIntervention: "Define device compliance requirements. Review blocked device reports.",
        docLink: "https://learn.microsoft.com/en-us/mem/intune/protect/conditional-access-intune-common-ways-use",
        cliCommands: [
            "az rest --method GET --uri 'https://graph.microsoft.com/v1.0/deviceManagement/deviceCompliancePolicies'",
            "az rest --method GET --uri 'https://graph.microsoft.com/v1.0/devices' --query 'value[].{displayName:displayName,isCompliant:isCompliant}'"
        ]
    },
    "3.1.2[a]": {
        automation: "Define Azure RBAC roles and custom roles. Use PIM for just-in-time access definitions.",
        azureService: "Azure RBAC, PIM",
        humanIntervention: "Required - Define role definitions with business stakeholders. Map job functions to RBAC roles.",
        docLink: "https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles",
        cliCommands: [
            "az role definition list --custom-role-only true -o table",
            "az role definition list --name 'Contributor' --output json"
        ]
    },
    "3.1.2[b]": {
        automation: "Assign RBAC roles via Azure Policy or ARM templates. Enable PIM for elevated access with approval workflows.",
        azureService: "Azure RBAC, PIM",
        humanIntervention: "Approve PIM elevation requests. Conduct quarterly access reviews.",
        docLink: "https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure",
        cliCommands: [
            "az role assignment list --all --query '[].{principal:principalName,role:roleDefinitionName,scope:scope}' -o table",
            "az rest --method GET --uri 'https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments'"
        ]
    },
    "3.1.3[a]": {
        automation: "Define information flow policies in Microsoft Purview DLP. Create sensitivity labels for CUI classification.",
        azureService: "Microsoft Purview, Sensitivity Labels",
        humanIntervention: "Required - Define CUI categories and flow rules with data owners.",
        docLink: "https://learn.microsoft.com/en-us/purview/dlp-learn-about-dlp"
    },
    "3.1.3[b]": {
        automation: "Implement Microsoft Purview DLP policies. Use Azure Firewall/NSGs for network flow control.",
        azureService: "Purview DLP, Azure Firewall, NSG",
        humanIntervention: "Review DLP incident reports. Approve legitimate data transfers.",
        docLink: "https://learn.microsoft.com/en-us/purview/information-barriers"
    },
    "3.1.3[c]": {
        automation: "Tag resources with CUI classification via Azure Policy. Map data flows using Microsoft Purview Data Map.",
        azureService: "Purview Data Map, Azure Policy",
        humanIntervention: "Required - Identify and document CUI data sources and destinations.",
        docLink: "https://learn.microsoft.com/en-us/purview/concept-data-map"
    },
    "3.1.3[d]": {
        automation: "Define authorization rules in Purview DLP policies. Configure Conditional Access for app-based access.",
        azureService: "Purview, Conditional Access",
        humanIntervention: "Required - Approve CUI flow authorizations with business justification.",
        docLink: "https://learn.microsoft.com/en-us/purview/sensitivity-labels"
    },
    "3.1.3[e]": {
        automation: "Enable DLP policy enforcement mode. Monitor DLP alerts in Microsoft Defender portal.",
        azureService: "Purview DLP, Microsoft Defender",
        humanIntervention: "Review DLP policy violation reports weekly. Handle exceptions.",
        docLink: "https://learn.microsoft.com/en-us/purview/dlp-alerts-dashboard-learn"
    },
    "3.1.4[a]": {
        automation: "Document separation of duties matrix. Use Entra ID group memberships to define mutually exclusive roles.",
        azureService: "Entra ID Groups, Azure RBAC",
        humanIntervention: "Required - Define which duties require separation based on risk assessment.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/concept-understand-roles"
    },
    "3.1.4[b]": {
        automation: "Assign users to separate Entra ID groups for conflicting roles. Use PIM to prevent simultaneous elevated access.",
        azureService: "Entra ID, PIM",
        humanIntervention: "Assign personnel to roles. Review assignments ensuring separation.",
        docLink: "https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-resource-roles-assign-roles"
    },
    "3.1.4[c]": {
        automation: "Configure mutually exclusive Entra ID groups. Use Conditional Access to prevent concurrent conflicting sessions.",
        azureService: "Entra ID, Conditional Access",
        humanIntervention: "Review access conflicts quarterly. Approve dual-role exceptions.",
        docLink: "https://learn.microsoft.com/en-us/entra/id-governance/access-reviews-overview"
    },
    "3.1.5[a]": {
        automation: "Query privileged accounts via `Get-MgDirectoryRoleMember`. Export PIM eligible/active assignments.",
        azureService: "PIM, Entra ID Roles",
        humanIntervention: "Review privileged account list quarterly. Validate business need.",
        docLink: "https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-how-to-add-role-to-user"
    },
    "3.1.5[b]": {
        automation: "Use PIM for just-in-time privileged access. Require approval workflows. Set maximum activation duration.",
        azureService: "PIM",
        humanIntervention: "Approve PIM elevation requests.",
        docLink: "https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure"
    },
    "3.1.5[c]": {
        automation: "Document security functions in RBAC role definitions. Tag resources requiring security function access.",
        azureService: "Azure RBAC, Azure Policy",
        humanIntervention: "Required - Identify and document security functions specific to your environment.",
        docLink: "https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles"
    },
    "3.1.5[d]": {
        automation: "Restrict security function access via custom RBAC roles. Use PIM for security admin roles. Enable JIT VM access.",
        azureService: "Azure RBAC, PIM, JIT VM Access",
        humanIntervention: "Approve access requests for security functions.",
        docLink: "https://learn.microsoft.com/en-us/azure/defender-for-cloud/just-in-time-access-usage"
    },
    "3.1.6[a]": {
        automation: "Document non-security functions in policy. Tag applications/resources by security classification.",
        azureService: "Azure Policy, Resource Tags",
        humanIntervention: "Required - Define which functions are non-security functions.",
        docLink: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources"
    },
    "3.1.6[b]": {
        automation: "Configure PIM to require explicit elevation for admin tasks. Use Conditional Access to restrict admin portals.",
        azureService: "PIM, Conditional Access",
        humanIntervention: "Monitor elevation requests. Enforce use of non-privileged accounts.",
        docLink: "https://learn.microsoft.com/en-us/security/privileged-access-workstations/privileged-access-deployment"
    },
    "3.1.7[a]": {
        automation: "Export RBAC role definitions with elevated permissions via `Get-AzRoleDefinition`.",
        azureService: "Azure RBAC",
        humanIntervention: "Required - Define privileged functions specific to organizational operations.",
        docLink: "https://learn.microsoft.com/en-us/azure/role-based-access-control/role-definitions"
    },
    "3.1.7[b]": {
        automation: "Query non-privileged users via Entra ID groups. Maintain dynamic groups for non-admin users.",
        azureService: "Entra ID, Dynamic Groups",
        humanIntervention: "Validate user classifications during onboarding.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/users/groups-dynamic-membership"
    },
    "3.1.7[c]": {
        automation: "Enforce via Azure RBAC deny assignments. Use Conditional Access to block admin portals for non-admins.",
        azureService: "Azure RBAC, Conditional Access",
        humanIntervention: "Review blocked access attempts. Investigate privilege escalation.",
        docLink: "https://learn.microsoft.com/en-us/azure/role-based-access-control/deny-assignments"
    },
    "3.1.7[d]": {
        automation: "Enable Entra ID audit logs routed to Log Analytics. Configure Microsoft Sentinel for privileged operation detection.",
        azureService: "Entra ID Audit Logs, Log Analytics, Sentinel",
        humanIntervention: "Review privileged function audit reports weekly.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/monitoring-health/concept-audit-logs"
    },
    "3.1.8[a]": {
        automation: "Configure Entra ID Smart Lockout settings. Define lockout threshold and duration in Security > Authentication Methods.",
        azureService: "Entra ID Smart Lockout",
        humanIntervention: "Define acceptable lockout thresholds based on security policy.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/authentication/howto-password-smart-lockout"
    },
    "3.1.8[b]": {
        automation: "Smart Lockout is enabled by default. Configure custom thresholds. Monitor lockout events in sign-in logs.",
        azureService: "Entra ID Smart Lockout",
        humanIntervention: "Review lockout reports for attacks. Unlock legitimate users.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/authentication/howto-password-smart-lockout"
    },
    "3.1.9[a]": {
        automation: "Configure Terms of Use in Conditional Access. Create CUI-specific use policies.",
        azureService: "Entra ID Terms of Use",
        humanIntervention: "Required - Draft privacy and security notice content with legal/compliance.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/conditional-access/terms-of-use"
    },
    "3.1.9[b]": {
        automation: "Enforce Terms of Use via Conditional Access. Configure login banners for VMs via Group Policy.",
        azureService: "Terms of Use, Company Branding",
        humanIntervention: "Verify banner displays correctly. Update as regulations change.",
        docLink: "https://learn.microsoft.com/en-us/entra/fundamentals/how-to-customize-branding"
    },
    "3.1.10[a]": {
        automation: "Configure screen lock timeout via Intune device configuration policies. Deploy CMMC baseline profile via Graph API.",
        azureService: "Microsoft Intune",
        humanIntervention: "Define acceptable inactivity timeout (typically 15 minutes or less).",
        docLink: "https://learn.microsoft.com/en-us/mem/intune/configuration/device-restrictions-windows-10",
        automationScripts: [{
            name: "01_Deploy_CMMC_Baselines_GCCH.ps1",
            description: "Deploys CMMC L2 baselines to GCC High including screen lock (15 min timeout), password complexity (14 char alphanumeric)",
            script: `# Deploy CMMC Baselines to GCC High (graph.microsoft.us)
Import-Module Microsoft.Graph.DeviceManagement.Administration
Connect-MgGraph -Scopes "DeviceManagementConfiguration.ReadWrite.All" -Environment USGov

$Uri = "https://graph.microsoft.us/beta/deviceManagement/deviceConfigurations"

$HardeningJSON = @{
    "@odata.type" = "#microsoft.graph.windows10GeneralConfiguration"
    "displayName" = "CMMC - Workstation Hardening Baseline"
    "screenLockBlocked" = \$false
    "passwordBlockSimple" = \$true
    "passwordRequiredType" = "alphanumeric"
    "passwordMinimumLength" = 14
    "passwordMinutesOfInactivityBeforeScreenTimeout" = 15
    "dmaGuardEnabled" = \$true
} | ConvertTo-Json -Depth 3

Invoke-MgGraphRequest -Method POST -Uri \$Uri -Body \$HardeningJSON -ContentType "application/json"`
        }]
    },
    "3.1.10[b]": {
        automation: "Deploy Intune policies for automatic screen lock. Configure idle session timeout for M365 apps.",
        azureService: "Intune, Conditional Access Session Controls",
        humanIntervention: "Test lock functionality. Handle exception requests.",
        docLink: "https://learn.microsoft.com/en-us/mem/intune/configuration/settings-catalog"
    },
    "3.1.10[c]": {
        automation: "Configure screen saver with password requirement via Intune.",
        azureService: "Microsoft Intune",
        humanIntervention: "Verify screen saver hides all information.",
        docLink: "https://learn.microsoft.com/en-us/mem/intune/configuration/device-restrictions-windows-10"
    },
    "3.1.11[a]": {
        automation: "Define session termination in Conditional Access sign-in frequency policies.",
        azureService: "Conditional Access",
        humanIntervention: "Required - Define session termination conditions.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/conditional-access/howto-conditional-access-session-lifetime"
    },
    "3.1.11[b]": {
        automation: "Configure CA sign-in frequency controls. Set persistent browser to 'Never persistent'.",
        azureService: "Conditional Access",
        humanIntervention: "Test session termination. Review exceptions.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/conditional-access/howto-conditional-access-session-lifetime"
    },
    "3.1.12[a]": {
        automation: "Document approved remote access. Configure Azure VPN Gateway or Azure Virtual Desktop.",
        azureService: "Azure VPN Gateway, Azure Virtual Desktop",
        humanIntervention: "Required - Define and approve remote access methods.",
        docLink: "https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpngateways"
    },
    "3.1.12[b]": {
        automation: "Document in CA named locations. Define approved connection methods in policy.",
        azureService: "Conditional Access Named Locations",
        humanIntervention: "Required - Identify approved remote access types.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/conditional-access/location-condition"
    },
    "3.1.12[c]": {
        automation: "Enforce via CA requiring compliant device + approved app. Block legacy auth protocols.",
        azureService: "Conditional Access, Azure VPN",
        humanIntervention: "Review CA policy changes. Handle exceptions.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/conditional-access/block-legacy-authentication"
    },
    "3.1.12[d]": {
        automation: "Route remote access logs to Microsoft Sentinel. Create analytics rules for anomalous access.",
        azureService: "Microsoft Sentinel, Entra ID Sign-in Logs",
        humanIntervention: "Review remote access alerts daily.",
        docLink: "https://learn.microsoft.com/en-us/azure/sentinel/connect-azure-active-directory"
    },
    "3.1.13[a]": {
        automation: "Document TLS 1.2+ requirement. Azure VPN uses IKEv2/IPsec automatically.",
        azureService: "Azure VPN Gateway",
        humanIntervention: "Required - Document approved cryptographic mechanisms.",
        docLink: "https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-compliance-crypto"
    },
    "3.1.13[b]": {
        automation: "Azure VPN enforces IPsec/IKEv2 by default. Enable TLS 1.2 minimum on web endpoints.",
        azureService: "Azure VPN Gateway, App Service",
        humanIntervention: "Verify encryption meets FIPS 140-2 for GCC High.",
        docLink: "https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpn-gateway-settings"
    },
    "3.1.14[a]": {
        automation: "Deploy Azure Firewall as central egress. Use Azure Bastion for management access.",
        azureService: "Azure Firewall, Azure Bastion",
        humanIntervention: "Define and approve managed access control points.",
        docLink: "https://learn.microsoft.com/en-us/azure/bastion/bastion-overview"
    },
    "3.1.14[b]": {
        automation: "Force tunnel traffic through Azure Firewall. Use NSG rules. Configure UDRs.",
        azureService: "Azure Firewall, NSG, UDRs",
        humanIntervention: "Review firewall logs for bypass attempts.",
        docLink: "https://learn.microsoft.com/en-us/azure/firewall/forced-tunneling"
    },
    "3.1.15[a]": {
        automation: "Document in PIM eligible role assignments. Configure JIT VM Access policies.",
        azureService: "PIM, JIT VM Access",
        humanIntervention: "Required - Define privileged commands authorized for remote execution.",
        docLink: "https://learn.microsoft.com/en-us/azure/defender-for-cloud/just-in-time-access-usage"
    },
    "3.1.15[b]": {
        automation: "Use sensitivity labels to classify security-relevant information.",
        azureService: "Purview, Sensitivity Labels",
        humanIntervention: "Required - Identify security-relevant information for remote access.",
        docLink: "https://learn.microsoft.com/en-us/purview/sensitivity-labels"
    },
    "3.1.15[c]": {
        automation: "Configure PIM with approval workflows. Enable audit logging for PIM activations.",
        azureService: "PIM, Azure Bastion",
        humanIntervention: "Approve PIM activation requests. Review execution logs.",
        docLink: "https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-how-to-require-mfa"
    },
    "3.1.15[d]": {
        automation: "Enforce via CA requiring compliant device + MFA for sensitive apps.",
        azureService: "Conditional Access",
        humanIntervention: "Approve remote access requests for security information.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/what-is-access-management"
    },
    "3.1.16[a]": {
        automation: "For Azure-only: N/A. For hybrid with on-prem: inventory wireless APs via network scanning.",
        azureService: "N/A for Azure-only",
        humanIntervention: "Required - Identify and document all wireless access points.",
        docLink: "https://learn.microsoft.com/en-us/azure/architecture/hybrid/hybrid-start-here"
    },
    "3.1.16[b]": {
        automation: "For on-prem wireless: integrate with Entra ID via RADIUS/NPS. Use cert-based auth.",
        azureService: "Entra ID + NPS Extension",
        humanIntervention: "Approve wireless access requests. Maintain authorized lists.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/authentication/howto-mfa-nps-extension"
    },
    "3.1.17[a]": {
        automation: "Configure RADIUS/NPS with Entra MFA. Deploy certificates via Intune for EAP-TLS.",
        azureService: "Entra MFA, Intune SCEP/PKCS",
        humanIntervention: "Verify authentication works. Review failed attempts.",
        docLink: "https://learn.microsoft.com/en-us/mem/intune/protect/certificates-configure"
    },
    "3.1.17[b]": {
        automation: "Require WPA3 or WPA2-Enterprise on all wireless networks.",
        azureService: "N/A - Physical infrastructure",
        humanIntervention: "Verify encryption on wireless infrastructure.",
        docLink: "https://learn.microsoft.com/en-us/windows/security/identity-protection/hello-for-business/hello-overview"
    },
    "3.1.18[a]": {
        automation: "Query Intune for mobile devices: `Get-MgDeviceManagementManagedDevice -Filter \"operatingSystem eq 'iOS'\"`.",
        azureService: "Microsoft Intune",
        humanIntervention: "Review mobile device list. Verify CUI authorization.",
        docLink: "https://learn.microsoft.com/en-us/mem/intune/remote-actions/device-inventory"
    },
    "3.1.18[b]": {
        automation: "Require Intune enrollment via CA. Block unmanaged devices. Use MAM for BYOD.",
        azureService: "Intune, Conditional Access, MAM",
        humanIntervention: "Approve enrollment requests. Define BYOD policies.",
        docLink: "https://learn.microsoft.com/en-us/mem/intune/enrollment/device-enrollment"
    },
    "3.1.18[c]": {
        automation: "Enable Intune device activity logging. Route to Log Analytics/Sentinel.",
        azureService: "Intune Logs, Sentinel",
        humanIntervention: "Review mobile device activity reports.",
        docLink: "https://learn.microsoft.com/en-us/mem/intune/fundamentals/review-logs-using-azure-monitor"
    },
    "3.1.19[a]": {
        automation: "Query Intune for devices with CUI access. Filter by apps or compliance policies.",
        azureService: "Microsoft Intune",
        humanIntervention: "Identify mobile devices processing CUI. Document in SSP.",
        docLink: "https://learn.microsoft.com/en-us/mem/intune/apps/app-discovered-apps"
    },
    "3.1.19[b]": {
        automation: "Enforce device encryption via Intune compliance. Use App Protection for app-level encryption.",
        azureService: "Intune Compliance, App Protection",
        humanIntervention: "Verify encryption compliance. Remediate non-compliant devices.",
        docLink: "https://learn.microsoft.com/en-us/mem/intune/protect/encrypt-devices"
    },
    "3.1.20[a]": {
        automation: "Query Entra ID for external identities: `Get-MgUser -Filter \"userType eq 'Guest'\"`.",
        azureService: "Entra ID B2B",
        humanIntervention: "Required - Identify and document external system connections.",
        docLink: "https://learn.microsoft.com/en-us/entra/external-id/what-is-b2b"
    },
    "3.1.20[b]": {
        automation: "Document external system usage. Track via Entra ID app registrations.",
        azureService: "Entra ID Enterprise Applications",
        humanIntervention: "Required - Document external system purposes.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/view-applications-portal"
    },
    "3.1.20[c]": {
        automation: "Use Cross-tenant access settings to verify external tenant security.",
        azureService: "Cross-Tenant Access Settings",
        humanIntervention: "Verify external organization security posture.",
        docLink: "https://learn.microsoft.com/en-us/entra/external-id/cross-tenant-access-settings-b2b-collaboration"
    },
    "3.1.20[d]": {
        automation: "Configure Cross-tenant access policies. Use CA to limit external user permissions.",
        azureService: "Cross-Tenant Access Policies",
        humanIntervention: "Approve external org connections. Review periodically.",
        docLink: "https://learn.microsoft.com/en-us/entra/external-id/cross-tenant-access-overview"
    },
    "3.1.20[e]": {
        automation: "Audit external app permissions via Entra ID. Review OAuth consent grants.",
        azureService: "Entra ID, Enterprise Applications",
        humanIntervention: "Review external application permissions.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/manage-consent-requests"
    },
    "3.1.20[f]": {
        automation: "Use Defender for Cloud Apps to control SaaS access. Block unsanctioned apps.",
        azureService: "Defender for Cloud Apps",
        humanIntervention: "Review shadow IT reports. Approve/block discovered apps.",
        docLink: "https://learn.microsoft.com/en-us/defender-cloud-apps/what-is-defender-for-cloud-apps"
    },
    "3.1.21[a]": {
        automation: "Document portable storage policy. Use Intune to detect removable storage usage. Deploy Device Control XML policy.",
        azureService: "Intune, Defender Device Control",
        humanIntervention: "Required - Document portable storage use cases.",
        docLink: "https://learn.microsoft.com/en-us/defender-endpoint/device-control-removable-storage-access-control",
        automationScripts: [{
            name: "MP_Defender_Device_Control.xml",
            description: "Import into Intune (Custom OMA-URI) to block all USBs except approved devices (e.g., IronKeys)",
            script: `<!-- Defender Device Control Policy - Block Unapproved USB -->
<PolicyRules>
    <PolicyRule Id="{a2f3g4h5-1111-2222-3333-444455556666}">
        <Name>Allow IronKeys</Name>
        <IncludedIdList><GroupId>{65fa64e9-1111-2222-3333-444455556666}</GroupId></IncludedIdList>
        <AccessMask>15</AccessMask>
    </PolicyRule>
    <PolicyRule Id="{b3c4d5e6-9999-8888-7777-666655554444}">
        <Name>Block Unapproved</Name>
        <IncludedIdList><GroupId>{9b28fae8-72f7-4267-a1a5-685f747a7146}</GroupId></IncludedIdList>
        <ExcludedIdList><GroupId>{65fa64e9-1111-2222-3333-444455556666}</GroupId></ExcludedIdList>
        <AccessMask>6</AccessMask>
    </PolicyRule>
</PolicyRules>`
        }]
    },
    "3.1.21[b]": {
        automation: "Define restrictions in Intune device configuration. Configure Device Control policies.",
        azureService: "Intune, Device Control",
        humanIntervention: "Required - Define acceptable use limits.",
        docLink: "https://learn.microsoft.com/en-us/mem/intune/configuration/device-restrictions-windows-10"
    },
    "3.1.21[c]": {
        automation: "Enforce via Intune blocking unauthorized USB. Enable BitLocker To Go for allowed devices.",
        azureService: "Intune, BitLocker",
        humanIntervention: "Approve exceptions. Review usage logs.",
        docLink: "https://learn.microsoft.com/en-us/defender-endpoint/device-control-removable-storage-access-control"
    },
    "3.1.22[a]": {
        automation: "Define authorized publishers in Entra ID groups. Use CA to restrict public content access. Create Public Release Registry in SharePoint.",
        azureService: "Entra ID Groups, SharePoint",
        humanIntervention: "Required - Identify authorized individuals for public posting.",
        docLink: "https://learn.microsoft.com/en-us/entra/fundamentals/groups-view-azure-portal",
        automationScripts: [{
            name: "AC_Public_Release_Registry.ps1",
            description: "Creates Public Release Registry list in GCC High SharePoint for tracking approvals of public website content",
            script: `# Creates Public Release Registry in GCC High SharePoint (.us)
Import-Module PnP.PowerShell

\$SiteUrl = "https://yourtenant.sharepoint.us/sites/Compliance"
\$Config = Get-Content ".\\CMMC_App_Config.json" | ConvertFrom-Json

Connect-PnPOnline -Url \$SiteUrl -ClientId \$Config.ClientId -Thumbprint \$Config.Thumbprint -Tenant \$Config.Tenant -AzureEnvironment USGovernment

\$ListName = "Public Release Registry"
New-PnPList -Title \$ListName -Template GenericList
Add-PnPField -List \$ListName -DisplayName "Platform" -InternalName "Platform" -Type Choice -Choices "Website","LinkedIn","Twitter"
Add-PnPField -List \$ListName -DisplayName "Approver" -InternalName "Approver" -Type User
Add-PnPField -List \$ListName -DisplayName "CUI_Check" -InternalName "CUICheck" -Type Boolean

Write-Host "Public Release Registry Created." -ForegroundColor Green`
        }]
    },
    "3.1.22[b]": {
        automation: "Implement DLP policies scanning for CUI in public content. Use sensitivity labels.",
        azureService: "Purview DLP, Sensitivity Labels",
        humanIntervention: "Required - Document CUI review procedures.",
        docLink: "https://learn.microsoft.com/en-us/purview/dlp-learn-about-dlp"
    },
    "3.1.22[c]": {
        automation: "Configure approval workflows in SharePoint/Power Automate for public content.",
        azureService: "SharePoint, Power Automate",
        humanIntervention: "Review and approve content before posting.",
        docLink: "https://learn.microsoft.com/en-us/sharepoint/dev/business-apps/power-automate/guidance/working-with-approvals"
    },
    "3.1.22[d]": {
        automation: "Use DLP to scan public content for CUI. Schedule regular automated scans.",
        azureService: "Purview DLP",
        humanIntervention: "Review scan results. Remove any CUI found.",
        docLink: "https://learn.microsoft.com/en-us/purview/dlp-policy-reference"
    },
    "3.1.22[e]": {
        automation: "Configure DLP incident response workflows. Enable auto-quarantine for sensitive content.",
        azureService: "Purview DLP, Power Automate",
        humanIntervention: "Respond to CUI exposure incidents.",
        docLink: "https://learn.microsoft.com/en-us/purview/dlp-alerts-dashboard-get-started"
    },

    // === AWARENESS AND TRAINING (AT) ===
    "3.2.1[a]": {
        automation: "Document risks in Purview Compliance Manager. Use Defender for Cloud risk assessments.",
        azureService: "Compliance Manager, Defender for Cloud",
        humanIntervention: "Required - Identify CUI-specific security risks.",
        docLink: "https://learn.microsoft.com/en-us/purview/compliance-manager",
        cuiTrainingTemplate: "https://www.dcsa.mil/Portals/128/Documents/CTP/CUI/DCSA%20CUI%20Training%20Template%20Version%203.pdf"
    },
    "3.2.1[b]": {
        automation: "Store policies in SharePoint with version control. Track in Compliance Manager.",
        azureService: "SharePoint, Compliance Manager",
        humanIntervention: "Required - Create and maintain security policies.",
        docLink: "https://learn.microsoft.com/en-us/sharepoint/document-library-overview"
    },
    "3.2.1[c]": {
        automation: "Deploy Viva Learning for security awareness. Use Attack Simulation Training. Create SharePoint training tracker. Use DCSA CUI Training Template.",
        azureService: "Viva Learning, Attack Simulation, SharePoint",
        humanIntervention: "Review training completion. Address non-compliant users.",
        docLink: "https://learn.microsoft.com/en-us/defender-office-365/attack-simulation-training-get-started",
        cuiTrainingTemplate: "https://www.dcsa.mil/Portals/128/Documents/CTP/CUI/DCSA%20CUI%20Training%20Template%20Version%203.pdf",
        automationScripts: [{
            name: "Setup_Training_Infrastructure.ps1",
            description: "Creates Training Tracker Lists in GCC High SharePoint for annual security training automation",
            script: `# Creates Training Tracker Lists in GCC High SharePoint
Import-Module PnP.PowerShell

\$SiteUrl = "https://yourtenant.sharepoint.us/sites/HR"
\$Config = Get-Content ".\\CMMC_App_Config.json" | ConvertFrom-Json

Connect-PnPOnline -Url \$SiteUrl -ClientId \$Config.ClientId -Thumbprint \$Config.Thumbprint -Tenant \$Config.Tenant -AzureEnvironment USGovernment

# Create Document Library for training materials
New-PnPList -Title "Training_Materials" -Template DocumentLibrary

# Create the Tracking List
\$ListName = "Training_Assignments"
New-PnPList -Title \$ListName -Template GenericList
Add-PnPField -List \$ListName -DisplayName "EmployeeEmail" -InternalName "EmpEmail" -Type Text
Add-PnPField -List \$ListName -DisplayName "TrainingTopic" -InternalName "Topic" -Type Choice -Choices "Security Awareness","Insider Threat","CUI Handling"
Add-PnPField -List \$ListName -DisplayName "DueDate" -InternalName "DueDate" -Type DateTime
Add-PnPField -List \$ListName -DisplayName "Status" -InternalName "Status" -Type Choice -Choices "Pending","Completed","Overdue"

Write-Host "Training Infrastructure Created." -ForegroundColor Green`
        }]
    },
    "3.2.1[d]": {
        automation: "Distribute policies via SharePoint requiring acknowledgment. Track via Terms of Use.",
        azureService: "SharePoint, Terms of Use",
        humanIntervention: "Verify user understanding. Conduct awareness assessments.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/conditional-access/terms-of-use"
    },
    "3.2.2[a]": {
        automation: "Define in HR system integrated with Entra ID. Map job codes to security roles.",
        azureService: "Entra ID, HR Integration",
        humanIntervention: "Required - Define security duties for each role.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/app-provisioning/hr-user-creation-provisioning"
    },
    "3.2.2[b]": {
        automation: "Use Entra ID group assignments based on HR job codes. Automate via SCIM.",
        azureService: "Entra ID, SCIM",
        humanIntervention: "Approve role assignments. Verify appropriate personnel.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/app-provisioning/what-is-hr-driven-provisioning"
    },
    "3.2.2[c]": {
        automation: "Assign role-based training via Viva Learning. Track completion and send reminders. Use DCSA CUI Training Template for CUI handlers.",
        azureService: "Viva Learning",
        humanIntervention: "Verify training adequacy. Update as duties change.",
        docLink: "https://learn.microsoft.com/en-us/viva/learning/overview-viva-learning",
        cuiTrainingTemplate: "https://www.dcsa.mil/Portals/128/Documents/CTP/CUI/DCSA%20CUI%20Training%20Template%20Version%203.pdf"
    },
    "3.2.3[a]": {
        automation: "Use Purview Insider Risk Management indicators as baseline.",
        azureService: "Insider Risk Management",
        humanIntervention: "Required - Define insider threat indicators for your org.",
        docLink: "https://learn.microsoft.com/en-us/purview/insider-risk-management"
    },
    "3.2.3[b]": {
        automation: "Deploy insider threat training via Viva Learning. Track completion.",
        azureService: "Viva Learning, Attack Simulation",
        humanIntervention: "Review training effectiveness. Update for emerging threats.",
        docLink: "https://learn.microsoft.com/en-us/purview/insider-risk-management-configure"
    },

    // === AUDIT AND ACCOUNTABILITY (AU) ===
    "3.3.1[a]": {
        automation: "Configure Entra ID diagnostic settings for sign-ins, audit, and provisioning logs.",
        azureService: "Entra ID Diagnostics, Log Analytics",
        humanIntervention: "Required - Define audit events needed for compliance.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/monitoring-health/howto-integrate-activity-logs-with-log-analytics"
    },
    "3.3.1[b]": {
        automation: "Configure audit log content via Entra ID and Activity Log settings.",
        azureService: "Entra ID Audit Logs, Activity Log",
        humanIntervention: "Verify log content meets requirements.",
        docLink: "https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/activity-log-schema"
    },
    "3.3.1[c]": {
        automation: "Enable via Entra ID diagnostic settings. Route to Log Analytics workspace. Run weekly evidence export.",
        azureService: "Azure Monitor, Log Analytics",
        humanIntervention: "Verify logs are generated correctly.",
        docLink: "https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/diagnostic-settings",
        automationScripts: [{
            name: "02_Run_Weekly_Evidence_GCCH.ps1",
            description: "Exports CMMC audit evidence from GCC High to JSON files. Schedule to run weekly (e.g., Friday).",
            script: `# Exports CMMC Evidence from GCC High - Run Weekly
\$EvidenceRoot = "C:\\CMMC_Evidence\\Week_\$(Get-Date -Format 'yyyy-MM-dd')"
New-Item -Path \$EvidenceRoot -ItemType Directory -Force | Out-Null

# CRITICAL: Connects to USGov environment
Connect-MgGraph -Scopes "DeviceManagementConfiguration.Read.All","Policy.Read.All" -Environment USGov

Write-Host "Exporting Evidence (Target: Azure Gov)..."
Get-MgIdentityConditionalAccessPolicy | ConvertTo-Json -Depth 5 | Out-File "\$EvidenceRoot\\AC_Policies.json"
Get-MgDeviceManagementDeviceConfiguration | Select-Object DisplayName, LastModifiedDateTime, Version | ConvertTo-Json | Out-File "\$EvidenceRoot\\CM_Config_Versions.json"
Get-MgDeviceManagementManagedDevice | Select-Object DeviceName, IsEncrypted, OperatingSystem, SerialNumber | ConvertTo-Json | Out-File "\$EvidenceRoot\\SI_BitLocker_Status.json"

Write-Host "Done. Files at \$EvidenceRoot" -ForegroundColor Green`
        }]
    },
    "3.3.1[d]": {
        automation: "Use KQL queries to validate log content. Create workbooks for completeness visualization.",
        azureService: "Log Analytics, Workbooks",
        humanIntervention: "Review log content periodically.",
        docLink: "https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-tutorial"
    },
    "3.3.1[e]": {
        automation: "Configure Log Analytics retention to minimum 365 days. Enable archive for long-term.",
        azureService: "Log Analytics, Azure Storage Archive",
        humanIntervention: "Define retention based on policy and legal holds.",
        docLink: "https://learn.microsoft.com/en-us/azure/azure-monitor/logs/data-retention-configure"
    },
    "3.3.1[f]": {
        automation: "Configure retention and archive policies. Use immutable blob storage for compliance.",
        azureService: "Log Analytics Archive, Immutable Storage",
        humanIntervention: "Verify retention. Test log retrieval.",
        docLink: "https://learn.microsoft.com/en-us/azure/storage/blobs/immutable-storage-overview"
    },
    "3.3.2[a]": {
        automation: "Entra ID logs include user principal name, IP, and timestamp automatically.",
        azureService: "Entra ID Audit Logs",
        humanIntervention: "Verify user identity determination from logs.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/monitoring-health/concept-audit-logs"
    },
    "3.3.2[b]": {
        automation: "Enable Entra ID sign-in and audit logs. Verify UPN is included in all log types.",
        azureService: "Entra ID Logs, Log Analytics",
        humanIntervention: "Verify user actions can be traced. Investigate gaps.",
        docLink: "https://learn.microsoft.com/en-us/entra/identity/monitoring-health/howto-analyze-activity-logs-log-analytics"
    },
    "3.3.3[a]": {
        automation: "Define review schedule in Azure Monitor alert rules. Create scheduled query rules.",
        azureService: "Azure Monitor Scheduled Query Rules",
        humanIntervention: "Required - Define log review frequency.",
        docLink: "https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-create-new-alert-rule"
    },
    "3.3.3[b]": {
        automation: "Use Sentinel analytics rules for automated review. Create workbooks for manual review.",
        azureService: "Sentinel, Workbooks",
        humanIntervention: "Review automated findings. Investigate flagged events.",
        docLink: "https://learn.microsoft.com/en-us/azure/sentinel/tutorial-detect-threats-built-in"
    },
    "3.3.3[c]": {
        automation: "Use Sentinel to correlate threat intel with logging needs. Update diagnostics via Policy.",
        azureService: "Sentinel, Azure Policy",
        humanIntervention: "Review and approve logging changes.",
        docLink: "https://learn.microsoft.com/en-us/azure/sentinel/understand-threat-intelligence"
    },
    "3.3.4[a]": {
        automation: "Define alert recipients in Azure Monitor action groups.",
        azureService: "Azure Monitor Action Groups",
        humanIntervention: "Required - Identify personnel for audit failure alerts.",
        docLink: "https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/action-groups"
    },
    "3.3.4[b]": {
        automation: "Define failure types: ingestion failures, quota exceeded, diagnostic disabled.",
        azureService: "Azure Monitor, Log Analytics",
        humanIntervention: "Required - Define which failures require alerting.",
        docLink: "https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-cost-storage"
    },
    "3.3.4[c]": {
        automation: "Create alerts for log ingestion failures. Use heartbeat monitoring. Configure Service Health alerts.",
        azureService: "Azure Monitor Alerts, Service Health",
        humanIntervention: "Respond to alerts. Remediate logging issues.",
        docLink: "https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-log"
    },
    "3.3.5[a]": {
        automation: "Use Sentinel playbooks for automated investigation. Create detection rules for correlation.",
        azureService: "Sentinel Analytics, Playbooks",
        humanIntervention: "Required - Define investigation processes.",
        docLink: "https://learn.microsoft.com/en-us/azure/sentinel/tutorial-respond-threats-playbook"
    },
    "3.3.5[b]": {
        automation: "Enable Sentinel data connectors for all log sources. Create analytics rules for correlation.",
        azureService: "Sentinel, Data Connectors",
        humanIntervention: "Review correlated findings. Investigate incidents.",
        docLink: "https://learn.microsoft.com/en-us/azure/sentinel/connect-data-sources"
    },
    "3.3.6[a]": {
        automation: "Use Log Analytics KQL for on-demand analysis. Create saved queries. Use Sentinel hunting.",
        azureService: "Log Analytics, Sentinel Hunting",
        humanIntervention: "Perform ad-hoc analysis. Create new queries.",
        docLink: "https://learn.microsoft.com/en-us/azure/sentinel/hunting"
    },
    "3.3.6[b]": {
        automation: "Create Workbooks for audit reports. Schedule delivery via Logic Apps. Export to Power BI.",
        azureService: "Workbooks, Power BI, Logic Apps",
        humanIntervention: "Generate reports. Customize for stakeholders.",
        docLink: "https://learn.microsoft.com/en-us/azure/azure-monitor/visualize/workbooks-overview"
    },
    "3.3.7[a]": {
        automation: "Azure uses authoritative time (time.windows.com) automatically for all Entra ID logs.",
        azureService: "Azure Platform (automatic)",
        humanIntervention: "Verify timestamps are consistent. Document time source.",
        docLink: "https://learn.microsoft.com/en-us/azure/virtual-machines/windows/time-sync"
    },
    "3.3.7[b]": {
        automation: "Azure uses NIST-traceable time. For VMs, configure NTP to Azure time server.",
        azureService: "Azure Time Sync, NTP",
        humanIntervention: "Document time source in SSP.",
        docLink: "https://learn.microsoft.com/en-us/azure/virtual-machines/windows/time-sync"
    },
    "3.3.7[c]": {
        automation: "Azure VMs sync via VMICTimeSync or NTP automatically. Verify with `w32tm /query /status`.",
        azureService: "Azure Time Sync",
        humanIntervention: "Verify sync is working. Investigate drift.",
        docLink: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/time-sync"
    },
    "3.3.8[a]": {
        automation: "Configure Log Analytics access via Azure RBAC. Use Reader role for read-only.",
        azureService: "Azure RBAC, Log Analytics",
        humanIntervention: "Review log access permissions quarterly.",
        docLink: "https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access"
    },
    "3.3.8[b]": {
        automation: "Use RBAC without Contributor for unauthorized users. Enable customer-managed keys.",
        azureService: "Azure RBAC, CMK",
        humanIntervention: "Review RBAC. Investigate modification attempts.",
        docLink: "https://learn.microsoft.com/en-us/azure/azure-monitor/logs/customer-managed-keys"
    },
    "3.3.8[c]": {
        automation: "Enable immutable blob storage for archives. Configure admin-only delete permissions.",
        azureService: "Immutable Storage, Azure RBAC",
        humanIntervention: "Review deletion requests. Maintain legal hold.",
        docLink: "https://learn.microsoft.com/en-us/azure/storage/blobs/immutable-storage-overview"
    },
    "3.3.8[d]": {
        automation: "Restrict workspace management via RBAC. Use Policy to prevent unauthorized changes.",
        azureService: "Azure RBAC, Azure Policy",
        humanIntervention: "Approve logging tool config changes.",
        docLink: "https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access"
    },
    "3.3.8[e]": {
        automation: "Use Policy to audit diagnostic setting changes. Alert on config modifications.",
        azureService: "Azure Policy, Azure Monitor",
        humanIntervention: "Investigate unauthorized modifications.",
        docLink: "https://learn.microsoft.com/en-us/azure/governance/policy/samples/built-in-policies"
    },
    "3.3.8[f]": {
        automation: "Protect diagnostic settings with Resource Locks. Use Policy to prevent deletion.",
        azureService: "Resource Locks, Azure Policy",
        humanIntervention: "Approve deletion requests with justification.",
        docLink: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/lock-resources"
    },
    "3.3.9[a]": {
        automation: "Use PIM to define privileged users with Log Analytics Contributor. Create admin group.",
        azureService: "PIM, Entra ID Groups",
        humanIntervention: "Define and approve audit log management personnel.",
        docLink: "https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure"
    },
    "3.3.9[b]": {
        automation: "Assign Log Analytics Contributor only via PIM with approval.",
        azureService: "PIM, Azure Policy",
        humanIntervention: "Approve PIM requests for audit management.",
        docLink: "https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access"
    },

    // === CONFIGURATION MANAGEMENT (CM) ===
    "3.4.1[a]": {
        automation: "Deploy Change Management SharePoint lists for CCB tracking. Use Intune for baseline configuration deployment.",
        azureService: "SharePoint, Intune, Azure DevOps",
        humanIntervention: "Required - Establish baseline configurations with stakeholders.",
        docLink: "https://learn.microsoft.com/en-us/mem/intune/configuration/device-profile-create",
        automationScripts: [{
            name: "Create_CM_Lists_GCCH.ps1",
            description: "Deploys Change Management Lists to GCC High SharePoint for Change Control Board (CCB) and Software Catalog tracking",
            script: `# Deploys Change Management Lists to GCC High SharePoint (.us)
Import-Module PnP.PowerShell

# CRITICAL: Update to your .sharepoint.us URL
\$SiteUrl = "https://yourtenant.sharepoint.us/sites/IT"

# Load the Registered App Identity
if (Test-Path ".\\CMMC_App_Config.json") {
    \$Config = Get-Content ".\\CMMC_App_Config.json" | ConvertFrom-Json
} else {
    Write-Error "Config file missing. Run 00_Setup_PnP_App_GCCH.ps1 first."
    exit
}

Connect-PnPOnline -Url \$SiteUrl -ClientId \$Config.ClientId -Thumbprint \$Config.Thumbprint -Tenant \$Config.Tenant -AzureEnvironment USGovernment

\$ListName = "Change Requests"
New-PnPList -Title \$ListName -Template GenericList
Add-PnPField -List \$ListName -DisplayName "ChangeType" -InternalName "ChangeType" -Type Choice -Choices "Infrastructure","Software","Access"
Add-PnPField -List \$ListName -DisplayName "RiskScore" -InternalName "RiskScore" -Type Number
Add-PnPField -List \$ListName -DisplayName "SecurityReview" -InternalName "SecReview" -Type Choice -Choices "Pending","Approved","Rejected"

Write-Host "Change DB Created in GCC High (\$SiteUrl)." -ForegroundColor Green`
        }]
    },
    "3.4.2[a]": {
        automation: "Deploy security configuration settings via Intune. Track changes in SharePoint Change Requests list.",
        azureService: "Intune, SharePoint",
        humanIntervention: "Approve security setting changes via CCB process.",
        docLink: "https://learn.microsoft.com/en-us/mem/intune/configuration/settings-catalog"
    },

    // === MEDIA PROTECTION (MP) ===
    "3.8.1[a]": {
        automation: "Use Intune Device Control to detect and control removable media. Deploy Defender Device Control policies.",
        azureService: "Intune, Defender for Endpoint",
        humanIntervention: "Required - Define approved media types and devices.",
        docLink: "https://learn.microsoft.com/en-us/defender-endpoint/device-control-removable-storage-access-control",
        automationScripts: [{
            name: "MP_Defender_Device_Control.xml",
            description: "Import into Intune (Custom OMA-URI) to block all USBs except approved devices like IronKeys",
            script: `<!-- Defender Device Control Policy - Block Unapproved USB -->
<PolicyRules>
    <PolicyRule Id="{a2f3g4h5-1111-2222-3333-444455556666}">
        <Name>Allow IronKeys</Name>
        <IncludedIdList><GroupId>{65fa64e9-1111-2222-3333-444455556666}</GroupId></IncludedIdList>
        <AccessMask>15</AccessMask>
    </PolicyRule>
    <PolicyRule Id="{b3c4d5e6-9999-8888-7777-666655554444}">
        <Name>Block Unapproved</Name>
        <IncludedIdList><GroupId>{9b28fae8-72f7-4267-a1a5-685f747a7146}</GroupId></IncludedIdList>
        <ExcludedIdList><GroupId>{65fa64e9-1111-2222-3333-444455556666}</GroupId></ExcludedIdList>
        <AccessMask>6</AccessMask>
    </PolicyRule>
</PolicyRules>`
        }]
    },

    // === PHYSICAL PROTECTION (PE) ===
    "3.10.3[a]": {
        automation: "Create SharePoint Visitor Log list. Integrate with badge systems via Power Automate.",
        azureService: "SharePoint, Power Automate",
        humanIntervention: "Required - Review visitor logs. Escort foreign nationals.",
        docLink: "https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/build-a-hello-world-web-part",
        automationScripts: [{
            name: "PE_Visitor_Log_Schema.json",
            description: "JSON schema to create Visitor Log list in SharePoint for CMMC 3.10 Physical Access tracking",
            script: `{
  "list": {
    "title": "Security_Visitor_Log",
    "description": "CMMC 3.10 Physical Access Log",
    "columns": [
      { "name": "VisitorName", "type": "Text", "required": true },
      { "name": "Company", "type": "Text", "required": true },
      { "name": "CitizenshipStatus", "type": "Choice", "choices": ["US Citizen", "Foreign National"], "required": true },
      { "name": "HostUser", "type": "User", "required": true },
      { "name": "CheckInTime", "type": "DateTime", "default": "[Today]" },
      { "name": "EscortRequired", "type": "Boolean", "default": "false" }
    ]
  }
}`
        }]
    },

    // === SYSTEM AND COMMUNICATIONS PROTECTION (SC) ===
    "3.13.1[a]": {
        automation: "Define network boundaries in Azure via Virtual Networks (VNets) and Network Security Groups (NSGs). Use Azure Firewall for centralized logging.",
        azureService: "Azure VNet, NSG, Azure Firewall",
        humanIntervention: "Required - Document external boundaries (internet, partner connections) and internal boundaries (CUI zones, admin networks).",
        docLink: "https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview",
        smallOrgGuidance: "For small remote orgs without physical firewalls: Use Azure's built-in network controls as your boundary. Define VNets with NSGs as 'virtual firewalls'. Document internet access points (VPN, ExpressRoute) as external boundaries. Internal boundaries can separate CUI workloads from general workloads using subnet NSGs.",
        automationScripts: [{
            name: "SC_Create_Network_Boundaries.ps1",
            description: "Creates VNet with NSG rules for CMMC boundary protection",
            script: `# Create Network Boundaries
Connect-AzAccount -Environment AzureUSGovernment

\$RG = "RG-CUI-Boundary"
\$Location = "USGovVirginia"

# Create VNet for CUI
\$VNet = New-AzVirtualNetwork -ResourceGroupName \$RG -Name "VNet-CUI" -Location \$Location -AddressPrefix "10.100.0.0/16"
\$CuiSubnet = New-AzVirtualNetworkSubnetConfig -Name "CUI-Workloads" -AddressPrefix "10.100.1.0/24"
\$AdminSubnet = New-AzVirtualNetworkSubnetConfig -Name "Admin-Access" -AddressPrefix "10.100.2.0/24"

\$VNet.Subnets.Add(\$CuiSubnet)
\$VNet.Subnets.Add(\$AdminSubnet)

# Create NSG with logging
\$Nsg = New-AzNetworkSecurityGroup -ResourceGroupName \$RG -Name "NSG-CUI-Boundary" -Location \$Location
Set-AzDiagnosticSetting -ResourceId \$Nsg.Id -Enabled \$true -Category "NetworkSecurityGroupEvent" -StorageAccountId (Get-AzStorageAccount)[0].Id

# Apply NSG to subnets
Set-AzVirtualNetworkSubnetConfig -VirtualNetwork \$VNet -Name "CUI-Workloads" -AddressPrefix "10.100.1.0/24" -NetworkSecurityGroupId \$Nsg.Id
Set-AzVirtualNetworkSubnetConfig -VirtualNetwork \$VNet -Name "Admin-Access" -AddressPrefix "10.100.2.0/24" -NetworkSecurityGroupId \$Nsg.Id

\$VNet | Set-AzVirtualNetwork`
        }]
    },
    "3.13.1[b]": {
        automation: "Document internal boundaries via Azure Resource Manager tags and naming conventions. Use Azure Monitor to track cross-boundary traffic.",
        azureService: "Azure Resource Manager, Azure Monitor, NSG Flow Logs",
        humanIntervention: "Required - Identify and document all internal network segmentation points (CUI zones, admin networks, DMZ equivalents).",
        docLink: "https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/network-watcher-monitoring-overview",
        smallOrgGuidance: "Small remote orgs: Internal boundaries can be logical separations within Azure. Use separate subnets for: 1) CUI processing, 2) administrative access, 3) general workloads. Tag resources with 'BoundaryType' to document classification. Enable NSG flow logs to monitor traffic between zones.",
        automationScripts: [{
            name: "SC_Internal_Boundary_Tags.ps1",
            description: "Applies boundary classification tags to Azure resources",
            script: `# Tag Internal Boundaries
\$Resources = Get-AzResource -ResourceGroupNameContains "CUI"

foreach (\$Resource in \$Resources) {
    \$Tags = @{
        "BoundaryType" = "Internal"
        "CUIZone" = "Processing"
        "Compliance" = "CMMC-L2"
    }
    
    if (\$Resource.ResourceType -eq "Microsoft.Network/virtualNetworks") {
        \$Tags["BoundaryType"] = "External"
    }
    
    Update-AzResource -ResourceId \$Resource.Id -Tag \$Tags -Force
}`
        }]
    },
    "3.13.1[c]": {
        automation: "Enable NSG flow logs and Azure Network Watcher. Create Azure Monitor alerts for boundary traffic anomalies.",
        azureService: "NSG Flow Logs, Azure Monitor, Network Watcher",
        humanIntervention: "Review traffic patterns weekly. Document approved traffic flows.",
        docLink: "https://learn.microsoft.com/en-us/azure/network-watcher/network-watcher-monitoring-overview",
        smallOrgGuidance: "Small remote orgs: Enable NSG flow logs (free tier) to monitor external boundary traffic. Set up basic alerts for unusual traffic patterns. Use Azure Monitor workbooks to visualize traffic. No physical firewall needed - Azure NSGs provide the monitoring.",
        automationScripts: [{
            name: "SC_Enable_Boundary_Monitoring.ps1",
            description: "Enables NSG flow logs and basic monitoring",
            script: `# Enable Boundary Monitoring
\$Nsg = Get-AzNetworkSecurityGroup -Name "NSG-CUI-Boundary"
\$StorageAccount = Get-AzStorageAccount | Select-Object -First 1

# Enable Flow Logs
\$FlowLogConfig = @{
    TargetResourceId = \$Nsg.Id
    StorageAccountId = \$StorageAccount.Id
    Enabled = \$true
    Format = @{
        Type = "JSON"
        Version = 2
    }
}
Set-AzNetworkWatcherConfigFlowLog -NetworkWatcherLocation "USGovVirginia" -ResourceGroupName \$Nsg.ResourceGroupName -Name \$Nsg.Name @\$FlowLogConfig

# Create Alert for High Traffic
\$ActionGroup = New-AzActionGroup -ResourceGroupName \$Nsg.ResourceGroupName -Name "Boundary-Alerts" -ShortName "Boundary"
\$MetricAlert = New-AzMetricAlertRuleV2 -ResourceGroupName \$Nsg.ResourceGroupName -Name "High-Boundary-Traffic" -Scope \$Nsg.Id -Condition "Average NetworkIn > 1000" -WindowSize 00:05:00 -Severity 2 -ActionGroup \$ActionGroup`
        }]
    },
    "3.13.1[d]": {
        automation: "Monitor internal boundaries with NSG flow logs between subnets. Use Azure Sentinel for advanced correlation.",
        azureService: "NSG Flow Logs, Azure Sentinel, Azure Monitor",
        humanIntervention: "Review cross-boundary traffic monthly. Document exceptions.",
        docLink: "https://learn.microsoft.com/en-us/azure/sentinel/overview",
        smallOrgGuidance: "Small remote orgs: Monitor traffic between CUI and non-CUI subnets using NSG flow logs. Create simple alerts for traffic crossing internal boundaries. Document expected flows (e.g., admin access to CUI zone). Use Azure Monitor workbooks for visualization.",
        automationScripts: [{
            name: "SC_Internal_Boundary_Monitoring.ps1",
            description: "Monitors traffic between internal boundaries",
            script: `# Monitor Internal Boundaries
\$VNet = Get-AzVirtualNetwork -Name "VNet-CUI"
\$Subnets = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork \$VNet

foreach (\$Subnet in \$Subnets) {
    \$Nsg = (Get-AzNetworkSecurityGroup -ResourceId \$Subnet.NetworkSecurityGroup.Id)
    Write-Host "Enabling flow logs for subnet: \$(\$Subnet.Name)"
    
    Set-AzNetworkWatcherConfigFlowLog -NetworkWatcherLocation "USGovVirginia" -ResourceGroupName \$Nsg.ResourceGroupName -Name \$Nsg.Name -TargetResourceId \$Nsg.Id -StorageAccountId (Get-AzStorageAccount)[0].Id -Enabled \$true
}`
        }]
    },
    "3.13.1[e]": {
        automation: "Implement NSG rules to control external boundary traffic. Use Azure Firewall for advanced filtering.",
        azureService: "NSG Rules, Azure Firewall, Application Gateway WAF",
        humanIntervention: "Define and approve traffic control policies. Review rule effectiveness.",
        docLink: "https://learn.microsoft.com/en-us/azure/virtual-network/security-overview",
        smallOrgGuidance: "Small remote orgs: Use NSG rules as your 'virtual firewall' at the external boundary. Default deny all inbound, allow only required ports (HTTPS 443, VPN). Use Azure Firewall Basic if available for more advanced filtering. Document all allowed traffic flows.",
        automationScripts: [{
            name: "SC_External_Boundary_Control.ps1",
            description: "Implements NSG rules for external boundary control",
            script: `# External Boundary Control Rules
\$Nsg = Get-AzNetworkSecurityGroup -Name "NSG-CUI-Boundary"

# Deny all inbound by default
\$DenyInbound = New-AzNetworkSecurityRuleConfig -Name "DenyAllInbound" -Priority 4096 -Direction Inbound -Access Deny -Protocol * -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange *

# Allow HTTPS from internet
\$AllowHTTPS = New-AzNetworkSecurityRuleConfig -Name "AllowHTTPS" -Priority 100 -Direction Inbound -Access Allow -Protocol Tcp -SourceAddressPrefix Internet -SourcePortRange * -DestinationAddressPrefix 10.100.1.0/24 -DestinationPortRange 443

# Allow VPN access
\$AllowVPN = New-AzNetworkSecurityRuleConfig -Name "AllowVPN" -Priority 110 -Direction Inbound -Access Allow -Protocol Udp -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix 10.100.1.0/24 -DestinationPortRange 500

\$Nsg.SecurityRules = \$DenyInbound, \$AllowHTTPS, \$AllowVPN
\$Nsg | Set-AzNetworkSecurityGroup`
        }]
    },
    "3.13.1[f]": {
        automation: "Control internal boundaries with subnet NSGs. Use Service Endpoints and Private Endpoints for data protection.",
        azureService: "Subnet NSGs, Service Endpoints, Private Endpoints",
        humanIntervention: "Define internal traffic control policies. Document business requirements.",
        docLink: "https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoints-overview",
        smallOrgGuidance: "Small remote orgs: Use subnet NSGs to control traffic between internal boundaries. Block direct internet access from CUI subnets. Use Private Endpoints for Azure services. Allow only necessary admin traffic from designated management subnet.",
        automationScripts: [{
            name: "SC_Internal_Boundary_Control.ps1",
            description: "Implements internal boundary controls between subnets",
            script: `# Internal Boundary Controls
\$CuiSubnet = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork (Get-AzVirtualNetwork -Name "VNet-CUI") -Name "CUI-Workloads"
\$AdminSubnet = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork (Get-AzVirtualNetwork -Name "VNet-CUI") -Name "Admin-Access"

# Create NSGs for each subnet
\$CuiNsg = New-AzNetworkSecurityGroup -ResourceGroupName "RG-CUI-Boundary" -Name "NSG-CUI-Workloads" -Location "USGovVirginia"
\$AdminNsg = New-AzNetworkSecurityGroup -ResourceGroupName "RG-CUI-Boundary" -Name "NSG-Admin-Access" -Location "USGovVirginia"

# Block internet from CUI
\$BlockInternet = New-AzNetworkSecurityRuleConfig -Name "BlockInternet" -Priority 100 -Direction Outbound -Access Deny -Protocol * -SourceAddressPrefix 10.100.1.0/24 -SourcePortRange * -DestinationAddressPrefix Internet -DestinationPortRange *

# Allow admin access
\$AllowAdmin = New-AzNetworkSecurityRuleConfig -Name "AllowAdminAccess" -Priority 100 -Direction Inbound -Access Allow -Protocol Tcp -SourceAddressPrefix 10.100.2.0/24 -SourcePortRange * -DestinationAddressPrefix 10.100.1.0/24 -DestinationPortRange 22,3389

\$CuiNsg.SecurityRules = \$BlockInternet
\$AdminNsg.SecurityRules = \$AllowAdmin

# Apply to subnets
Set-AzVirtualNetworkSubnetConfig -VirtualNetwork (Get-AzVirtualNetwork -Name "VNet-CUI") -Name "CUI-Workloads" -NetworkSecurityGroupId \$CuiNsg.Id
Set-AzVirtualNetworkSubnetConfig -VirtualNetwork (Get-AzVirtualNetwork -Name "VNet-CUI") -Name "Admin-Access" -NetworkSecurityGroupId \$AdminNsg.Id`
        }]
    },
    "3.13.1[g]": {
        automation: "Protect external boundaries with Azure Firewall WAF and DDoS protection. Use TLS inspection.",
        azureService: "Azure Firewall, WAF, DDoS Protection, Front Door",
        humanIntervention: "Configure WAF rules. Test protection effectiveness.",
        docLink: "https://learn.microsoft.com/en-us/azure/web-application-firewall/overview",
        smallOrgGuidance: "Small remote orgs: Use Azure Firewall Basic (if available) or Network Security Groups with additional logging. Enable DDoS protection at the VNet level. For web applications, use Application Gateway with WAF. Document all protection mechanisms.",
        automationScripts: [{
            name: "SC_External_Boundary_Protection.ps1",
            description: "Deploys protection services at external boundaries",
            script: `# External Boundary Protection
\$VNet = Get-AzVirtualNetwork -Name "VNet-CUI"

# Enable DDoS protection
Enable-AzVNetDDoSProtection -VirtualNetwork \$VNet -ResourceGroupName \$VNet.ResourceGroupName -Name "DDoS-CUI-Protection"

# Create Public IP for Firewall
\$Pip = New-AzPublicIpAddress -ResourceGroupName \$VNet.ResourceGroupName -Name "Firewall-Pip" -Location "USGovVirginia" -Sku Standard -AllocationMethod Static

# Create Firewall (if available in your tier)
# Note: Azure Firewall may not be available in all GovCloud regions
try {
    \$Firewall = New-AzFirewall -ResourceGroupName \$VNet.ResourceGroupName -Name "FW-CUI-Boundary" -Location "USGovVirginia" -VirtualNetwork \$VNet -PublicIpAddress \$Pip
    Write-Host "Azure Firewall deployed successfully"
} catch {
    Write-Host "Azure Firewall not available - using NSG rules instead"
}`
        }]
    },
    "3.13.1[h]": {
        automation: "Protect internal boundaries with encryption and access controls. Use Private Link for service access.",
        azureService: "Private Link, Service Endpoints, Azure Key Vault",
        humanIntervention: "Define internal protection requirements. Document encryption standards.",
        docLink: "https://learn.microsoft.com/en-us/azure/private-link/private-link-overview",
        smallOrgGuidance: "Small remote orgs: Use Private Endpoints for Azure services instead of public endpoints. Enable encryption for all internal traffic (TLS 1.2+). Use Azure Key Vault for secret management. Document all internal protection mechanisms.",
        automationScripts: [{
            name: "SC_Internal_Boundary_Protection.ps1",
            description: "Implements protection for internal boundaries",
            script: `# Internal Boundary Protection
\$VNet = Get-AzVirtualNetwork -Name "VNet-CUI"
\$StorageAccount = Get-AzStorageAccount | Where-Object { \$_.ResourceGroupName -like "*CUI*" }

# Create Private Endpoint for Storage
\$PrivateLinkConnection = New-AzPrivateLinkServiceConnection -Name "Storage-Private-Link" -PrivateLinkServiceId \$StorageAccount.Id -GroupId "blob"
\$PrivateEndpoint = New-AzPrivateEndpoint -ResourceGroupName \$VNet.ResourceGroupName -Name "Storage-Private-Endpoint" -Location "USGovVirginia" -Subnet (Get-AzVirtualNetworkSubnetConfig -VirtualNetwork \$VNet -Name "CUI-Workloads") -PrivateLinkServiceConnection \$PrivateLinkConnection

# Configure DNS for Private Endpoint
\$PrivateDnsZone = New-AzPrivateDnsZone -ResourceGroupName \$VNet.ResourceGroupName -Name "privatelink.blob.core.usgovcloudapi.net"
\$VirtualNetworkLink = New-AzPrivateDnsVirtualNetworkLink -ResourceGroupName \$VNet.ResourceGroupName -ZoneName "privatelink.blob.core.usgovcloudapi.net" -Name "Storage-DNS-Link" -VirtualNetworkId \$VNet.Id -EnableRegistration

Write-Host "Private Endpoint created for secure internal access"`
        }]
    },
    "3.13.8[a]": {
        automation: "Deploy Azure VPN Gateway with FIPS-compliant IPsec policies. Use AES256/SHA384 encryption.",
        azureService: "Azure VPN Gateway, Azure Firewall",
        humanIntervention: "Required - Document approved cryptographic mechanisms.",
        docLink: "https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-compliance-crypto",
        automationScripts: [{
            name: "SC_Setup_VPN_AzureGov.ps1",
            description: "Deploys a FIPS-compliant VPN Gateway in Azure Government with AES256/SHA384/DHGroup24 encryption",
            script: `# Configures FIPS VPN in Azure Gov
Connect-AzAccount -Environment AzureUSGovernment

\$RG = "RG-Network-Sec"
\$Location = "USGovVirginia"
\$ipsecPolicy = New-AzIpsecPolicy -IkeEncryption AES256 -IkeIntegrity SHA384 -DhGroup DHGroup24 -IpsecEncryption AES256 -IpsecIntegrity GCMAES256 -PfsGroup PFS24

# Create Resource Group
New-AzResourceGroup -Name \$RG -Location \$Location

# Create VNet & Gateway
\$SubnetConfig = New-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -AddressPrefix "10.1.255.0/27"
\$VNet = New-AzVirtualNetwork -ResourceGroupName \$RG -Name "VNet-Hub-Gov" -Location \$Location -AddressPrefix "10.1.0.0/16" -Subnet \$SubnetConfig
\$Pip = New-AzPublicIpAddress -ResourceGroupName \$RG -Name "Vpn-Gw-Pip" -Location \$Location -AllocationMethod Static -Sku Standard

Write-Host "Creating Gateway (45 Mins)..."
\$Gw = New-AzVirtualNetworkGateway -Name "Vpn-Gw-Gov" -ResourceGroupName \$RG -Location \$Location -IpConfigurations (New-AzVirtualNetworkGatewayIpConfig -Name "GwIpConfig" -SubnetId \$SubnetConfig.Id -PublicIpAddressId \$Pip.Id) -GatewayType "Vpn" -VpnType "RouteBased" -GatewaySku "VpnGw2" -IpsecPolicies \$ipsecPolicy`
        }]
    },
    "3.13.11[a]": {
        automation: "Deploy BitLocker encryption via Intune with XTS-AES 256-bit. Use FIPS-compliant algorithms.",
        azureService: "Intune, BitLocker",
        humanIntervention: "Verify encryption status. Store recovery keys securely.",
        docLink: "https://learn.microsoft.com/en-us/mem/intune/protect/encrypt-devices",
        automationScripts: [{
            name: "01_Deploy_CMMC_Baselines_GCCH.ps1",
            description: "Deploys BitLocker encryption profile with FIPS XTS-AES 256 to GCC High via Graph API",
            script: `# Deploy BitLocker FIPS Profile to GCC High
Import-Module Microsoft.Graph.DeviceManagement.Administration
Connect-MgGraph -Scopes "DeviceManagementConfiguration.ReadWrite.All" -Environment USGov

\$Uri = "https://graph.microsoft.us/beta/deviceManagement/deviceConfigurations"

\$BitLockerJSON = @{
    "@odata.type" = "#microsoft.graph.windows10EndpointProtectionConfiguration"
    "displayName" = "CMMC - BitLocker Encryption"
    "bitLockerWindowsSettings" = @{
        "encryptionMethod" = "xtsAes256"
        "removableDriveEncryptionMethod" = "xtsAes256"
        "osDriveSettings" = @{
            "recoveryOptions" = @{
                "keyUsage" = "allowed"
                "hideRecoveryOptions" = \$true
            }
        }
    }
} | ConvertTo-Json -Depth 5

Invoke-MgGraphRequest -Method POST -Uri \$Uri -Body \$BitLockerJSON -ContentType "application/json"
Write-Host "BitLocker Profile Deployed" -ForegroundColor Green`
        }]
    },
    
    // SC.L2-3.13.14 - Voice over IP (VoIP) Protection
    "3.13.14[a]": {
        automation: "Deploy Microsoft Teams Voice in GCC High with E2E encryption. Configure Direct Routing with certified SBCs.",
        azureService: "Microsoft Teams, Phone System, Direct Routing",
        humanIntervention: "Required - Select certified SBC vendors. Configure PSTN connectivity. Test call quality.",
        docLink: "https://learn.microsoft.com/en-us/microsoftteams/direct-routing-plan",
        fipsCompliance: "Teams uses SRTP with AES-256 for media encryption. TLS 1.2+ for signaling.",
        implementationDetails: {
            teamsVoice: {
                description: "Microsoft Teams Phone System provides enterprise VoIP with FedRAMP High authorization",
                features: ["E2E encryption for 1:1 calls", "SRTP media encryption", "TLS signaling", "Call recording compliance"],
                directRouting: "Use certified SBCs (AudioCodes, Ribbon, Oracle) for PSTN connectivity",
                callingPlans: "Available in GCC High for domestic calling"
            },
            alternativeOptions: [
                { name: "Cisco Webex Calling (FedRAMP)", description: "Enterprise VoIP with FedRAMP Moderate authorization" },
                { name: "RingCentral for Government", description: "Cloud PBX with FedRAMP authorization" },
                { name: "Zoom Phone for Government", description: "Cloud phone with FedRAMP Moderate" }
            ],
            securityControls: [
                "Enable end-to-end encryption for 1:1 Teams calls",
                "Configure SBC with TLS 1.2+ mutual authentication",
                "Implement call admission control policies",
                "Enable call recording for compliance",
                "Configure emergency calling (E911) compliance"
            ]
        },
        cliCommands: [
            "# Check Teams Voice licensing\\nGet-CsOnlineUser -Identity user@domain.com | Select EnterpriseVoiceEnabled, LineUri",
            "# Configure Direct Routing SBC\\nNew-CsOnlinePSTNGateway -Fqdn sbc.contoso.com -SipSignalingPort 5061 -Enabled $true",
            "# Enable E2E encryption policy\\nSet-CsTeamsEnhancedEncryptionPolicy -Identity Global -CallingEndToEndEncryptionEnabledType Enabled"
        ]
    },
    
    // SC.L2-3.13.16 - Protect CUI at Rest
    "3.13.16[a]": {
        automation: "Enable Azure Storage encryption with Customer-Managed Keys (CMK) in Key Vault HSM. Configure FIPS 140-2 Level 3.",
        azureService: "Azure Key Vault HSM, Azure Storage, Azure Disk Encryption",
        humanIntervention: "Required - Generate and rotate encryption keys. Document key management procedures.",
        docLink: "https://learn.microsoft.com/en-us/azure/storage/common/customer-managed-keys-overview",
        fipsCompliance: "Azure Key Vault HSM is FIPS 140-2 Level 3 validated. Storage Service Encryption uses AES-256.",
        implementationDetails: {
            azureBlob: {
                description: "Azure Blob Storage encryption for CUI data at rest",
                encryptionOptions: [
                    { type: "Microsoft-Managed Keys (MMK)", fips: "FIPS 140-2 Level 1", recommendation: "Acceptable for non-CUI" },
                    { type: "Customer-Managed Keys (CMK)", fips: "FIPS 140-2 Level 2/3", recommendation: "Required for CUI" },
                    { type: "Customer-Provided Keys (CPK)", fips: "Customer responsibility", recommendation: "Advanced use cases" }
                ],
                steps: [
                    "Create Key Vault with HSM-backed keys in Azure Government",
                    "Enable soft-delete and purge protection on Key Vault",
                    "Grant Storage Account identity access to Key Vault",
                    "Configure CMK encryption on Storage Account",
                    "Enable infrastructure encryption (double encryption)"
                ]
            },
            azureDisk: {
                description: "Azure Disk Encryption for VMs using BitLocker/DM-Crypt",
                options: [
                    { type: "Azure Disk Encryption (ADE)", description: "BitLocker for Windows, DM-Crypt for Linux" },
                    { type: "Server-Side Encryption (SSE)", description: "Platform-managed or CMK encryption" },
                    { type: "Encryption at Host", description: "Encrypts temp disks and OS/data disk caches" }
                ]
            },
            sqlDatabase: {
                description: "Azure SQL TDE with CMK for database encryption",
                steps: [
                    "Enable Transparent Data Encryption (TDE)",
                    "Configure TDE protector with CMK from Key Vault",
                    "Enable Always Encrypted for column-level encryption"
                ]
            }
        },
        cliCommands: [
            "# Create Key Vault with HSM\\naz keyvault create --name kv-cui-cmk --resource-group rg-security --location usgovvirginia --sku premium --enable-purge-protection true --enable-soft-delete true",
            "# Create CMK for storage encryption\\naz keyvault key create --vault-name kv-cui-cmk --name storage-cmk --kty RSA-HSM --size 2048",
            "# Enable CMK on Storage Account\\naz storage account update --name stcuiencrypted --resource-group rg-data --encryption-key-vault https://kv-cui-cmk.vault.usgovcloudapi.net --encryption-key-name storage-cmk --encryption-key-source Microsoft.Keyvault",
            "# Verify encryption status\\naz storage account show --name stcuiencrypted --query encryption"
        ],
        automationScripts: [{
            name: "SC_Enable_CMK_Encryption.ps1",
            description: "Configures Customer-Managed Key encryption for Azure Storage in GCC High",
            script: `# Enable CMK Encryption for Azure Storage
Connect-AzAccount -Environment AzureUSGovernment

\$RG = "RG-CUI-Data"
\$Location = "USGovVirginia"
\$KVName = "kv-cui-cmk-\$(Get-Random -Maximum 9999)"
\$StorageName = "stcuiencrypted\$(Get-Random -Maximum 9999)"

# Create Key Vault with HSM
Write-Host "Creating Key Vault HSM..." -ForegroundColor Cyan
New-AzKeyVault -Name \$KVName -ResourceGroupName \$RG -Location \$Location -Sku Premium -EnablePurgeProtection -EnableSoftDelete

# Create CMK
\$Key = Add-AzKeyVaultKey -VaultName \$KVName -Name "storage-cmk" -Destination HSM

# Create Storage Account with CMK
Write-Host "Creating encrypted Storage Account..." -ForegroundColor Cyan
\$Storage = New-AzStorageAccount -ResourceGroupName \$RG -Name \$StorageName -Location \$Location -SkuName Standard_GRS -Kind StorageV2 -EnableHttpsTrafficOnly \$true

# Assign identity and configure CMK
Set-AzStorageAccount -ResourceGroupName \$RG -Name \$StorageName -AssignIdentity
\$Identity = (Get-AzStorageAccount -ResourceGroupName \$RG -Name \$StorageName).Identity.PrincipalId
Set-AzKeyVaultAccessPolicy -VaultName \$KVName -ObjectId \$Identity -PermissionsToKeys get,wrapkey,unwrapkey

Set-AzStorageAccount -ResourceGroupName \$RG -Name \$StorageName -KeyvaultEncryption -KeyVaultUri "https://\$KVName.vault.usgovcloudapi.net" -KeyName "storage-cmk"

Write-Host "CMK Encryption Configured Successfully" -ForegroundColor Green`
        }]
    },

    // === AUTOMATION IDENTITY SETUP (Prerequisite) ===
    "_setup": {
        automation: "Register an Entra ID App for PnP PowerShell in GCC High with certificate-based authentication for unattended automation.",
        azureService: "Entra ID, PnP PowerShell",
        humanIntervention: "Required - Run once with Global Admin credentials to register the automation identity.",
        docLink: "https://pnp.github.io/powershell/articles/registerapplication.html",
        automationScripts: [{
            name: "00_Setup_PnP_App_GCCH.ps1",
            description: "PREREQUISITE: Creates Service Principal identity in Azure Gov for automated scripts (run first with Global Admin)",
            script: `# Registers an Entra ID App for PnP PowerShell in GCC High
Write-Host "Setting up CMMC Automation Identity..." -ForegroundColor Cyan

# Install PnP Module if missing
if (-not (Get-Module -ListAvailable PnP.PowerShell)) {
    Write-Host "Installing PnP.PowerShell..."
    Install-Module PnP.PowerShell -Scope CurrentUser -Force -AllowClobber
}

\$AppName = "CMMC_Automation_Identity"
\$TenantName = Read-Host "Enter your Tenant Domain (e.g., contoso.onmicrosoft.us)"

# CRITICAL: -AzureEnvironment USGovernment
Write-Host "Please log in with Global Admin credentials when prompted..." -ForegroundColor Yellow

\$RegOutput = Register-PnPAzureADApp -ApplicationName \$AppName -Tenant \$TenantName -AzureEnvironment USGovernment -Store CurrentUser -GraphApplicationPermissions "User.Read.All","Group.Read.All","DeviceManagementConfiguration.Read.All" -SharePointDelegatePermissions "Sites.FullControl.All" -Interactive

Write-Host "--- SETUP COMPLETE ---" -ForegroundColor Green
Write-Host "Client ID: \$(\$RegOutput.ClientId)"
Write-Host "Thumbprint: \$(\$RegOutput.Certificate.Thumbprint)"

# Save config for other scripts
@{
    ClientId = \$RegOutput.ClientId
    Thumbprint = \$RegOutput.Certificate.Thumbprint
    Tenant = \$TenantName
} | ConvertTo-Json | Out-File ".\\CMMC_App_Config.json"
Write-Host "Config saved to CMMC_App_Config.json"`
        }]
    },

    // Default guidance for objectives without specific guidance
    "_default": {
        automation: "Automation guidance not yet available for this objective. Check Microsoft Learn documentation.",
        azureService: "Consult Microsoft Learn for GCC High services",
        humanIntervention: "Review objective requirements and implement appropriate controls.",
        docLink: "https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-cmmc"
    }
};

// Helper function to get guidance for an objective
function getGCCHighGuidance(objectiveId) {
    return GCC_HIGH_GUIDANCE[objectiveId] || GCC_HIGH_GUIDANCE["_default"];
}
