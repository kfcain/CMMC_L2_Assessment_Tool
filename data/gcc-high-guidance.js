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
        automation: "Configure screen lock timeout via Intune device configuration policies.",
        azureService: "Microsoft Intune",
        humanIntervention: "Define acceptable inactivity timeout (typically 15 minutes or less).",
        docLink: "https://learn.microsoft.com/en-us/mem/intune/configuration/device-restrictions-windows-10"
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
        automation: "Document portable storage policy. Use Intune to detect removable storage usage.",
        azureService: "Intune, Defender Device Control",
        humanIntervention: "Required - Document portable storage use cases.",
        docLink: "https://learn.microsoft.com/en-us/defender-endpoint/device-control-removable-storage-access-control"
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
        automation: "Define authorized publishers in Entra ID groups. Use CA to restrict public content access.",
        azureService: "Entra ID Groups",
        humanIntervention: "Required - Identify authorized individuals for public posting.",
        docLink: "https://learn.microsoft.com/en-us/entra/fundamentals/groups-view-azure-portal"
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
        docLink: "https://learn.microsoft.com/en-us/purview/compliance-manager"
    },
    "3.2.1[b]": {
        automation: "Store policies in SharePoint with version control. Track in Compliance Manager.",
        azureService: "SharePoint, Compliance Manager",
        humanIntervention: "Required - Create and maintain security policies.",
        docLink: "https://learn.microsoft.com/en-us/sharepoint/document-library-overview"
    },
    "3.2.1[c]": {
        automation: "Deploy Viva Learning for security awareness. Use Attack Simulation Training.",
        azureService: "Viva Learning, Attack Simulation",
        humanIntervention: "Review training completion. Address non-compliant users.",
        docLink: "https://learn.microsoft.com/en-us/defender-office-365/attack-simulation-training-get-started"
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
        automation: "Assign role-based training via Viva Learning. Track completion and send reminders.",
        azureService: "Viva Learning",
        humanIntervention: "Verify training adequacy. Update as duties change.",
        docLink: "https://learn.microsoft.com/en-us/viva/learning/overview-viva-learning"
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
        automation: "Enable via Entra ID diagnostic settings. Route to Log Analytics workspace.",
        azureService: "Azure Monitor, Log Analytics",
        humanIntervention: "Verify logs are generated correctly.",
        docLink: "https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/diagnostic-settings"
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
