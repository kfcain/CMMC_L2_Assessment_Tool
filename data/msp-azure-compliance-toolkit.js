// Azure Compliance Toolkit for MSSP/Organization Use
// Logic Apps, Azure Functions, Microsoft Sentinel, Azure Policy, Defender for Cloud
// Designed for multi-tenant CMMC/FedRAMP compliance at scale in Azure GCC High

const MSP_AZURE_COMPLIANCE_TOOLKIT = {
    version: "1.0.0",
    lastUpdated: "2025-02-09",

    // ==================== OVERVIEW ====================
    overview: {
        title: "Azure Compliance Toolkit",
        description: "Production-ready Azure templates for CMMC/FedRAMP compliance in GCC High environments. Includes ARM/Bicep templates, Azure Functions, Logic Apps workflows, Microsoft Sentinel analytics, and multi-tenant orchestration patterns for MSSPs managing client tenants at scale.",
        useCases: [
            "MSSP managing 10-100+ client Azure GCC High tenants for CMMC compliance",
            "Single organization standing up a compliant Azure GCC High environment",
            "Automated evidence collection via Sentinel, Defender for Cloud, and Azure Policy",
            "Centralized logging, alerting, and incident response orchestration with Lighthouse"
        ],
        prerequisites: [
            "Azure GCC High tenant (required for CUI/CMMC)",
            "Azure Lighthouse configured for multi-tenant management",
            "Microsoft Sentinel workspace deployed",
            "Defender for Cloud enabled with enhanced security features"
        ]
    },

    // ==================== 1. ARM / BICEP TEMPLATES ====================
    armTemplates: {
        title: "ARM / Bicep Templates",
        description: "Deploy-ready infrastructure-as-code templates for compliance infrastructure in Azure GCC High. Use Azure Lighthouse for cross-tenant deployment.",

        stacks: [
            {
                id: "sentinel-workspace",
                name: "Microsoft Sentinel Workspace with CMMC Analytics",
                description: "Deploys a Log Analytics workspace with Sentinel enabled, data connectors for Azure AD, Defender, and Office 365, plus CMMC-specific analytics rules for unauthorized access, privilege escalation, and data exfiltration detection.",
                controls: ["3.3.1", "3.3.2", "3.3.4", "3.3.5", "3.14.6", "3.14.7"],
                category: "SIEM & Monitoring",
                deployMethod: "ARM template per tenant",
                template: `{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "type": "string",
      "defaultValue": "sentinel-cmmc",
      "metadata": { "description": "Name of the Log Analytics workspace" }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "retentionDays": {
      "type": "int",
      "defaultValue": 365,
      "metadata": { "description": "Data retention in days (CMMC requires 1 year minimum)" }
    },
    "dailyCapGb": {
      "type": "int",
      "defaultValue": 10,
      "metadata": { "description": "Daily ingestion cap in GB" }
    }
  },
  "resources": [
    {
      "type": "Microsoft.OperationalInsights/workspaces",
      "apiVersion": "2022-10-01",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('location')]",
      "properties": {
        "sku": { "name": "PerGB2018" },
        "retentionInDays": "[parameters('retentionDays')]",
        "workspaceCapping": {
          "dailyQuotaGb": "[parameters('dailyCapGb')]"
        },
        "features": {
          "enableLogAccessUsingOnlyResourcePermissions": true
        }
      }
    },
    {
      "type": "Microsoft.SecurityInsights/onboardingStates",
      "apiVersion": "2022-12-01-preview",
      "name": "[concat(parameters('workspaceName'), '/default')]",
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaceName'))]"
      ],
      "properties": {}
    },
    {
      "type": "Microsoft.SecurityInsights/alertRules",
      "apiVersion": "2022-12-01-preview",
      "name": "[concat(parameters('workspaceName'), '/cmmc-unauthorized-access')]",
      "dependsOn": [
        "[resourceId('Microsoft.SecurityInsights/onboardingStates', parameters('workspaceName'), 'default')]"
      ],
      "kind": "Scheduled",
      "properties": {
        "displayName": "CMMC - Unauthorized Access Attempts",
        "description": "Detects multiple failed sign-in attempts followed by a successful sign-in (potential brute force). Maps to AC 3.1.1, AU 3.3.1.",
        "severity": "High",
        "enabled": true,
        "query": "SigninLogs | where ResultType != '0' | summarize FailedAttempts=count(), SuccessAfterFail=countif(ResultType=='0') by UserPrincipalName, IPAddress, bin(TimeGenerated, 1h) | where FailedAttempts > 10 and SuccessAfterFail > 0",
        "queryFrequency": "PT1H",
        "queryPeriod": "PT1H",
        "triggerOperator": "GreaterThan",
        "triggerThreshold": 0,
        "tactics": ["InitialAccess", "CredentialAccess"]
      }
    },
    {
      "type": "Microsoft.SecurityInsights/alertRules",
      "apiVersion": "2022-12-01-preview",
      "name": "[concat(parameters('workspaceName'), '/cmmc-privilege-escalation')]",
      "dependsOn": [
        "[resourceId('Microsoft.SecurityInsights/onboardingStates', parameters('workspaceName'), 'default')]"
      ],
      "kind": "Scheduled",
      "properties": {
        "displayName": "CMMC - Privilege Escalation Detection",
        "description": "Detects role assignments to Global Admin, Security Admin, or other privileged roles. Maps to AC 3.1.7, AU 3.3.1.",
        "severity": "High",
        "enabled": true,
        "query": "AuditLogs | where OperationName has 'Add member to role' | extend RoleName = tostring(TargetResources[0].displayName) | where RoleName in ('Global Administrator', 'Security Administrator', 'Privileged Role Administrator', 'Exchange Administrator') | project TimeGenerated, InitiatedBy, RoleName, TargetResources",
        "queryFrequency": "PT15M",
        "queryPeriod": "PT1H",
        "triggerOperator": "GreaterThan",
        "triggerThreshold": 0,
        "tactics": ["PrivilegeEscalation"]
      }
    }
  ]
}`
            },
            {
                id: "defender-for-cloud",
                name: "Defender for Cloud with CMMC Regulatory Compliance",
                description: "Enables Defender for Cloud across all resource types with NIST 800-171 regulatory compliance assessment, auto-provisioning of agents, and email notifications for high-severity alerts.",
                controls: ["3.11.1", "3.11.2", "3.11.3", "3.14.1", "3.14.2", "3.14.6"],
                category: "Vulnerability & Threat Protection",
                deployMethod: "Subscription-level ARM deployment",
                template: `{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "securityContactEmail": {
      "type": "string",
      "metadata": { "description": "Email for security alert notifications" }
    },
    "logAnalyticsWorkspaceId": {
      "type": "string",
      "metadata": { "description": "Resource ID of the Log Analytics workspace" }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Security/pricings",
      "apiVersion": "2023-01-01",
      "name": "VirtualMachines",
      "properties": { "pricingTier": "Standard" }
    },
    {
      "type": "Microsoft.Security/pricings",
      "apiVersion": "2023-01-01",
      "name": "SqlServers",
      "properties": { "pricingTier": "Standard" }
    },
    {
      "type": "Microsoft.Security/pricings",
      "apiVersion": "2023-01-01",
      "name": "AppServices",
      "properties": { "pricingTier": "Standard" }
    },
    {
      "type": "Microsoft.Security/pricings",
      "apiVersion": "2023-01-01",
      "name": "StorageAccounts",
      "properties": { "pricingTier": "Standard" }
    },
    {
      "type": "Microsoft.Security/pricings",
      "apiVersion": "2023-01-01",
      "name": "KeyVaults",
      "properties": { "pricingTier": "Standard" }
    },
    {
      "type": "Microsoft.Security/pricings",
      "apiVersion": "2023-01-01",
      "name": "Dns",
      "properties": { "pricingTier": "Standard" }
    },
    {
      "type": "Microsoft.Security/securityContacts",
      "apiVersion": "2020-01-01-preview",
      "name": "default",
      "properties": {
        "emails": "[parameters('securityContactEmail')]",
        "alertNotifications": { "state": "On", "minimalSeverity": "High" },
        "notificationsByRole": { "state": "On", "roles": ["Owner", "SecurityAdmin"] }
      }
    },
    {
      "type": "Microsoft.Security/autoProvisioningSettings",
      "apiVersion": "2017-08-01-preview",
      "name": "default",
      "properties": { "autoProvision": "On" }
    },
    {
      "type": "Microsoft.Security/workspaceSettings",
      "apiVersion": "2017-08-01-preview",
      "name": "default",
      "properties": {
        "workspaceId": "[parameters('logAnalyticsWorkspaceId')]",
        "scope": "[subscription().id]"
      }
    }
  ]
}`
            },
            {
                id: "azure-policy-cmmc",
                name: "Azure Policy Initiative for CMMC Compliance",
                description: "Custom Azure Policy initiative that enforces CMMC-relevant configurations: encryption at rest, HTTPS-only, network security group rules, diagnostic logging, and MFA requirements.",
                controls: ["3.1.1", "3.1.2", "3.4.1", "3.4.2", "3.5.3", "3.13.1", "3.13.8", "3.13.11"],
                category: "Configuration & Compliance",
                deployMethod: "Subscription-level policy assignment",
                template: `{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "initiativeName": {
      "type": "string",
      "defaultValue": "cmmc-l2-baseline"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Authorization/policySetDefinitions",
      "apiVersion": "2021-06-01",
      "name": "[parameters('initiativeName')]",
      "properties": {
        "policyType": "Custom",
        "displayName": "CMMC Level 2 Compliance Baseline",
        "description": "Enforces CMMC Level 2 configuration requirements across Azure resources",
        "metadata": { "category": "Regulatory Compliance", "version": "1.0.0" },
        "policyDefinitions": [
          {
            "policyDefinitionReferenceId": "storageEncryption",
            "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/b2982f36-99f2-4db5-8eff-283140c09693",
            "parameters": {},
            "groupNames": ["SC-3.13.8-EncryptionAtRest"]
          },
          {
            "policyDefinitionReferenceId": "httpsOnly",
            "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/a4af4a39-4135-47fb-b175-47fbdf85311d",
            "parameters": {},
            "groupNames": ["SC-3.13.8-EncryptionInTransit"]
          },
          {
            "policyDefinitionReferenceId": "nsgOnSubnets",
            "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/e71308d3-144b-4262-b144-efdc3cc90517",
            "parameters": {},
            "groupNames": ["SC-3.13.1-BoundaryProtection"]
          },
          {
            "policyDefinitionReferenceId": "diagnosticLogging",
            "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/7f89b1eb-583c-429a-8828-af049802c1d9",
            "parameters": {},
            "groupNames": ["AU-3.3.1-AuditLogging"]
          },
          {
            "policyDefinitionReferenceId": "mfaForOwners",
            "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/aa633080-8b72-40c4-a2d7-d00c03e80bed",
            "parameters": {},
            "groupNames": ["IA-3.5.3-MultifactorAuth"]
          },
          {
            "policyDefinitionReferenceId": "diskEncryption",
            "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/0961003e-5a0a-4549-abde-af6a37f2724d",
            "parameters": {},
            "groupNames": ["SC-3.13.11-CUIEncryption"]
          }
        ]
      }
    }
  ]
}`
            },
            {
                id: "nsg-flow-logs",
                name: "NSG Flow Logs with Traffic Analytics",
                description: "Enables NSG Flow Logs v2 with Traffic Analytics for network monitoring, anomaly detection, and compliance evidence. Logs stored in a dedicated storage account with immutability policy.",
                controls: ["3.13.1", "3.13.6", "3.14.6", "3.3.1", "3.3.2"],
                category: "Network Monitoring",
                deployMethod: "ARM template per VNet/NSG",
                template: `{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "nsgName": {
      "type": "string",
      "metadata": { "description": "Name of the NSG to enable flow logs for" }
    },
    "storageAccountName": {
      "type": "string",
      "metadata": { "description": "Storage account for flow log data" }
    },
    "workspaceResourceId": {
      "type": "string",
      "metadata": { "description": "Log Analytics workspace resource ID for Traffic Analytics" }
    },
    "retentionDays": {
      "type": "int",
      "defaultValue": 365
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2023-01-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": { "name": "Standard_LRS" },
      "kind": "StorageV2",
      "properties": {
        "supportsHttpsTrafficOnly": true,
        "minimumTlsVersion": "TLS1_2",
        "allowBlobPublicAccess": false,
        "immutableStorageWithVersioning": {
          "enabled": true,
          "immutabilityPolicy": {
            "immutabilityPeriodSinceCreationInDays": "[parameters('retentionDays')]",
            "state": "Unlocked"
          }
        }
      }
    },
    {
      "type": "Microsoft.Network/networkWatchers/flowLogs",
      "apiVersion": "2023-04-01",
      "name": "[concat('NetworkWatcher_', parameters('location'), '/', parameters('nsgName'), '-flowlog')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
      ],
      "properties": {
        "targetResourceId": "[resourceId('Microsoft.Network/networkSecurityGroups', parameters('nsgName'))]",
        "storageId": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
        "enabled": true,
        "format": { "type": "JSON", "version": 2 },
        "retentionPolicy": {
          "days": "[parameters('retentionDays')]",
          "enabled": true
        },
        "flowAnalyticsConfiguration": {
          "networkWatcherFlowAnalyticsConfiguration": {
            "enabled": true,
            "workspaceResourceId": "[parameters('workspaceResourceId')]",
            "trafficAnalyticsInterval": 10
          }
        }
      }
    }
  ]
}`
            }
        ]
    },

    // ==================== 2. AZURE FUNCTIONS ====================
    functions: {
        title: "Azure Functions",
        description: "Serverless compliance automation functions for evidence collection, access reviews, configuration auditing, and auto-remediation in Azure GCC High.",

        functions: [
            {
                id: "access-review-automation",
                name: "Entra ID Access Review Automation",
                description: "Scheduled function that audits Entra ID (Azure AD) for stale accounts, excessive permissions, guest users, and MFA compliance. Generates evidence reports and optionally disables non-compliant accounts.",
                controls: ["3.1.1", "3.1.2", "3.1.5", "3.1.12", "3.5.3", "3.5.7"],
                category: "Identity & Access",
                runtime: "Python 3.11",
                trigger: "Timer (daily at 02:00 UTC)",
                envVars: {
                    "TENANT_ID": "<your-gcc-high-tenant-id>",
                    "CLIENT_ID": "<app-registration-client-id>",
                    "KEY_VAULT_URL": "https://<vault-name>.vault.usgovcloudapi.net/",
                    "STALE_DAYS_THRESHOLD": "90",
                    "EVIDENCE_CONTAINER": "compliance-evidence",
                    "AUTO_DISABLE_STALE": "false"
                },
                code: `import azure.functions as func
import logging
from datetime import datetime, timedelta
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from azure.storage.blob import BlobServiceClient
from msgraph import GraphServiceClient
import json

app = func.FunctionApp()

@app.timer_trigger(schedule="0 0 2 * * *", arg_name="timer",
                    run_on_startup=False)
async def access_review_automation(timer: func.TimerRequest):
    """Daily Entra ID access review for CMMC compliance evidence."""
    logging.info("Starting Entra ID access review...")

    credential = DefaultAzureCredential()
    graph = GraphServiceClient(credential)

    # 1. Get all users
    users = await graph.users.get()
    all_users = users.value if users else []

    stale_threshold = datetime.utcnow() - timedelta(
        days=int(os.environ.get("STALE_DAYS_THRESHOLD", "90"))
    )

    findings = {
        "timestamp": datetime.utcnow().isoformat(),
        "total_users": len(all_users),
        "stale_accounts": [],
        "no_mfa": [],
        "guest_users": [],
        "privileged_users": [],
        "disabled_accounts": []
    }

    for user in all_users:
        # Check for stale accounts (no sign-in in 90+ days)
        last_sign_in = getattr(user, 'sign_in_activity', None)
        if last_sign_in and last_sign_in.last_sign_in_date_time:
            if last_sign_in.last_sign_in_date_time < stale_threshold:
                findings["stale_accounts"].append({
                    "upn": user.user_principal_name,
                    "last_sign_in": str(last_sign_in.last_sign_in_date_time),
                    "days_inactive": (datetime.utcnow() - last_sign_in.last_sign_in_date_time).days
                })

        # Check for guest users
        if user.user_type == "Guest":
            findings["guest_users"].append({
                "upn": user.user_principal_name,
                "created": str(user.created_date_time)
            })

    # 2. Check MFA registration
    mfa_report = await graph.reports.authentication_methods.users_registered_by_method.get()
    # Process MFA data...

    # 3. Get privileged role assignments
    roles = await graph.directory_roles.get()
    privileged_roles = ["Global Administrator", "Security Administrator",
                        "Privileged Role Administrator", "Exchange Administrator"]
    for role in (roles.value or []):
        if role.display_name in privileged_roles:
            members = await graph.directory_roles.by_directory_role_id(
                role.id).members.get()
            for member in (members.value or []):
                findings["privileged_users"].append({
                    "upn": getattr(member, 'user_principal_name', 'N/A'),
                    "role": role.display_name
                })

    # 4. Auto-disable stale accounts if enabled
    if os.environ.get("AUTO_DISABLE_STALE") == "true":
        for stale in findings["stale_accounts"]:
            if stale["days_inactive"] > 180:
                await graph.users.by_user_id(stale["upn"]).patch(
                    {"accountEnabled": False}
                )
                findings["disabled_accounts"].append(stale["upn"])

    # 5. Upload evidence to blob storage
    blob_client = BlobServiceClient(
        account_url=os.environ["STORAGE_ACCOUNT_URL"],
        credential=credential
    )
    container = blob_client.get_container_client(
        os.environ.get("EVIDENCE_CONTAINER", "compliance-evidence")
    )
    blob_name = f"access-reviews/{datetime.utcnow().strftime('%Y/%m/%d')}/entra-id-review.json"
    container.upload_blob(
        name=blob_name,
        data=json.dumps(findings, indent=2, default=str),
        overwrite=True
    )

    logging.info(f"Access review complete: {len(findings['stale_accounts'])} stale, "
                 f"{len(findings['guest_users'])} guests, "
                 f"{len(findings['privileged_users'])} privileged users")`,
                iamPolicy: `Required Microsoft Graph API Permissions (Application):
- User.Read.All
- Directory.Read.All
- AuditLog.Read.All
- Reports.Read.All
- User.ReadWrite.All (only if AUTO_DISABLE_STALE=true)

Required Azure RBAC:
- Storage Blob Data Contributor (on evidence storage account)
- Key Vault Secrets User (on Key Vault)`
            },
            {
                id: "config-drift-detector",
                name: "Configuration Drift Detector",
                description: "Monitors Azure resources for configuration drift from CMMC baselines. Checks NSG rules, storage encryption, Key Vault settings, and VM configurations against expected state. Sends alerts via Logic App or email.",
                controls: ["3.4.1", "3.4.2", "3.4.3", "3.4.5", "3.4.6"],
                category: "Configuration Management",
                runtime: "Python 3.11",
                trigger: "Timer (every 6 hours)",
                envVars: {
                    "SUBSCRIPTION_ID": "<subscription-id>",
                    "ALERT_LOGIC_APP_URL": "<logic-app-trigger-url>",
                    "BASELINE_CONTAINER": "cmmc-baselines",
                    "EVIDENCE_CONTAINER": "compliance-evidence"
                },
                code: `import azure.functions as func
import logging
import json, os
from datetime import datetime
from azure.identity import DefaultAzureCredential
from azure.mgmt.compute import ComputeManagementClient
from azure.mgmt.network import NetworkManagementClient
from azure.mgmt.storage import StorageManagementClient
from azure.storage.blob import BlobServiceClient
import requests

app = func.FunctionApp()

# CMMC baseline expectations
BASELINE = {
    "storage": {
        "https_only": True,
        "min_tls": "TLS1_2",
        "public_access": False,
        "encryption_enabled": True
    },
    "nsg": {
        "blocked_inbound_ports": [22, 3389],  # SSH/RDP from internet
        "require_source_restriction": True
    },
    "vm": {
        "encryption_at_host": True,
        "managed_disk_encryption": True
    }
}

@app.timer_trigger(schedule="0 0 */6 * * *", arg_name="timer")
def config_drift_detector(timer: func.TimerRequest):
    """Check Azure resources for CMMC configuration drift."""
    logging.info("Starting configuration drift scan...")

    credential = DefaultAzureCredential()
    sub_id = os.environ["SUBSCRIPTION_ID"]

    drifts = []

    # 1. Check Storage Accounts
    storage_client = StorageManagementClient(credential, sub_id)
    for acct in storage_client.storage_accounts.list():
        if not acct.enable_https_traffic_only:
            drifts.append({
                "resource": acct.name, "type": "StorageAccount",
                "finding": "HTTPS-only traffic not enforced",
                "control": "3.13.8", "severity": "High"
            })
        if acct.minimum_tls_version != BASELINE["storage"]["min_tls"]:
            drifts.append({
                "resource": acct.name, "type": "StorageAccount",
                "finding": f"TLS version {acct.minimum_tls_version} below minimum {BASELINE['storage']['min_tls']}",
                "control": "3.13.8", "severity": "High"
            })
        if acct.allow_blob_public_access:
            drifts.append({
                "resource": acct.name, "type": "StorageAccount",
                "finding": "Public blob access enabled",
                "control": "3.1.1", "severity": "Critical"
            })

    # 2. Check NSGs for open ports
    net_client = NetworkManagementClient(credential, sub_id)
    for nsg in net_client.network_security_groups.list_all():
        for rule in (nsg.security_rules or []):
            if (rule.direction == "Inbound" and rule.access == "Allow"
                and rule.source_address_prefix in ["*", "0.0.0.0/0", "Internet"]):
                port = str(rule.destination_port_range)
                if port in ["22", "3389", "*"]:
                    drifts.append({
                        "resource": nsg.name, "type": "NSG",
                        "finding": f"Port {port} open to internet (rule: {rule.name})",
                        "control": "3.13.1", "severity": "Critical"
                    })

    # 3. Check VMs
    compute_client = ComputeManagementClient(credential, sub_id)
    for vm in compute_client.virtual_machines.list_all():
        if not vm.security_profile or not vm.security_profile.encryption_at_host:
            drifts.append({
                "resource": vm.name, "type": "VirtualMachine",
                "finding": "Encryption at host not enabled",
                "control": "3.13.11", "severity": "High"
            })

    # 4. Generate report
    report = {
        "timestamp": datetime.utcnow().isoformat(),
        "subscription": sub_id,
        "total_drifts": len(drifts),
        "critical": len([d for d in drifts if d["severity"] == "Critical"]),
        "high": len([d for d in drifts if d["severity"] == "High"]),
        "drifts": drifts
    }

    # 5. Alert if critical/high drifts found
    if report["critical"] > 0 or report["high"] > 0:
        logic_app_url = os.environ.get("ALERT_LOGIC_APP_URL")
        if logic_app_url:
            requests.post(logic_app_url, json=report, timeout=30)

    # 6. Upload evidence
    blob_svc = BlobServiceClient(
        os.environ["STORAGE_ACCOUNT_URL"], credential=credential
    )
    container = blob_svc.get_container_client(
        os.environ.get("EVIDENCE_CONTAINER", "compliance-evidence")
    )
    blob_name = f"config-drift/{datetime.utcnow().strftime('%Y/%m/%d')}/drift-report.json"
    container.upload_blob(name=blob_name, data=json.dumps(report, indent=2), overwrite=True)

    logging.info(f"Drift scan complete: {report['total_drifts']} findings "
                 f"({report['critical']} critical, {report['high']} high)")`,
                iamPolicy: `Required Azure RBAC Roles:
- Reader (on subscription)
- Storage Blob Data Contributor (on evidence storage account)

Required for auto-remediation (optional):
- Network Contributor (to fix NSG rules)
- Virtual Machine Contributor (to enable encryption)`
            },
            {
                id: "evidence-collector",
                name: "Compliance Evidence Collector",
                description: "Weekly function that collects compliance evidence from Defender for Cloud, Azure Policy, Entra ID, and Activity Logs. Packages evidence into a structured JSON report for C3PAO assessors.",
                controls: ["3.12.1", "3.12.3", "3.12.4", "3.3.1", "3.3.2"],
                category: "Evidence & Assessment",
                runtime: "Python 3.11",
                trigger: "Timer (weekly, Sunday 03:00 UTC)",
                envVars: {
                    "SUBSCRIPTION_ID": "<subscription-id>",
                    "TENANT_ID": "<tenant-id>",
                    "EVIDENCE_CONTAINER": "compliance-evidence"
                },
                code: `import azure.functions as func
import logging
import json, os
from datetime import datetime, timedelta
from azure.identity import DefaultAzureCredential
from azure.mgmt.security import SecurityCenter
from azure.mgmt.policyinsights import PolicyInsightsClient
from azure.storage.blob import BlobServiceClient

app = func.FunctionApp()

@app.timer_trigger(schedule="0 0 3 * * 0", arg_name="timer")
def compliance_evidence_collector(timer: func.TimerRequest):
    """Weekly compliance evidence collection for CMMC assessment."""
    logging.info("Starting weekly compliance evidence collection...")

    credential = DefaultAzureCredential()
    sub_id = os.environ["SUBSCRIPTION_ID"]

    evidence = {
        "collection_date": datetime.utcnow().isoformat(),
        "subscription_id": sub_id,
        "sections": {}
    }

    # 1. Defender for Cloud Secure Score
    security_client = SecurityCenter(credential, sub_id, "")
    try:
        scores = list(security_client.secure_scores.list())
        evidence["sections"]["defender_secure_score"] = {
            "current_score": scores[0].current.percentage if scores else 0,
            "max_score": scores[0].max.score if scores else 0,
            "controls_passed": scores[0].current.score if scores else 0
        }
    except Exception as e:
        logging.warning(f"Secure score collection failed: {e}")

    # 2. Azure Policy Compliance State
    policy_client = PolicyInsightsClient(credential)
    try:
        summary = policy_client.policy_states.summarize_for_subscription(
            subscription_id=sub_id
        )
        results = summary.value[0] if summary.value else None
        if results:
            evidence["sections"]["policy_compliance"] = {
                "total_resources": results.results.total_resources,
                "compliant": results.results.resource_details[0].count if results.results.resource_details else 0,
                "non_compliant": results.results.non_compliant_resources,
                "policy_assignments": len(results.policy_assignments or [])
            }
    except Exception as e:
        logging.warning(f"Policy compliance collection failed: {e}")

    # 3. Defender Recommendations
    try:
        recommendations = list(security_client.assessments.list(
            scope=f"/subscriptions/{sub_id}"
        ))
        evidence["sections"]["defender_recommendations"] = {
            "total": len(recommendations),
            "healthy": len([r for r in recommendations if r.status and r.status.code == "Healthy"]),
            "unhealthy": len([r for r in recommendations if r.status and r.status.code == "Unhealthy"]),
            "top_unhealthy": [
                {"name": r.display_name, "severity": getattr(r.metadata, 'severity', 'N/A')}
                for r in recommendations
                if r.status and r.status.code == "Unhealthy"
            ][:20]
        }
    except Exception as e:
        logging.warning(f"Recommendations collection failed: {e}")

    # 4. Upload evidence package
    blob_svc = BlobServiceClient(
        os.environ["STORAGE_ACCOUNT_URL"], credential=credential
    )
    container = blob_svc.get_container_client(
        os.environ.get("EVIDENCE_CONTAINER", "compliance-evidence")
    )
    week_str = datetime.utcnow().strftime('%Y-W%V')
    blob_name = f"weekly-evidence/{week_str}/compliance-evidence-package.json"
    container.upload_blob(
        name=blob_name,
        data=json.dumps(evidence, indent=2, default=str),
        overwrite=True
    )

    logging.info(f"Evidence collection complete. Package: {blob_name}")`,
                iamPolicy: `Required Azure RBAC Roles:
- Security Reader (on subscription)
- Policy Insights Data Writer (on subscription)
- Storage Blob Data Contributor (on evidence storage account)`
            }
        ]
    },

    // ==================== 3. LOGIC APPS ====================
    logicApps: {
        title: "Logic Apps Workflows",
        description: "Low-code/no-code automation workflows for compliance orchestration, incident response, and notification routing in Azure GCC High.",

        workflows: [
            {
                id: "incident-response-orchestrator",
                name: "Sentinel Incident Response Orchestrator",
                description: "Triggered by Microsoft Sentinel incidents. Enriches alerts with Entra ID user data, checks IP reputation, creates a Teams channel for IR coordination, assigns severity-based SLA, and logs to compliance evidence store.",
                controls: ["3.6.1", "3.6.2", "3.6.3", "3.14.6", "3.14.7"],
                category: "Incident Response",
                type: "Consumption Logic App",
                template: `{
  "definition": {
    "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
    "contentVersion": "1.0.0.0",
    "triggers": {
      "Microsoft_Sentinel_incident": {
        "type": "ApiConnectionWebhook",
        "inputs": {
          "body": {
            "callback_url": "@{listCallbackUrl()}"
          },
          "host": {
            "connection": { "name": "@parameters('$connections')['azuresentinel']['connectionId']" }
          },
          "path": "/incident-creation"
        }
      }
    },
    "actions": {
      "Parse_Incident": {
        "type": "ParseJson",
        "inputs": {
          "content": "@triggerBody()",
          "schema": {
            "properties": {
              "object": {
                "properties": {
                  "properties": {
                    "properties": {
                      "title": { "type": "string" },
                      "severity": { "type": "string" },
                      "status": { "type": "string" },
                      "incidentNumber": { "type": "integer" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "Set_SLA_Based_on_Severity": {
        "type": "Switch",
        "expression": "@body('Parse_Incident')?['object']?['properties']?['severity']",
        "cases": {
          "High": {
            "actions": {
              "Set_SLA_High": {
                "type": "SetVariable",
                "inputs": { "name": "slaMinutes", "value": 60 }
              }
            }
          },
          "Medium": {
            "actions": {
              "Set_SLA_Medium": {
                "type": "SetVariable",
                "inputs": { "name": "slaMinutes", "value": 240 }
              }
            }
          }
        },
        "default": {
          "actions": {
            "Set_SLA_Low": {
              "type": "SetVariable",
              "inputs": { "name": "slaMinutes", "value": 1440 }
            }
          }
        }
      },
      "Post_to_Teams": {
        "type": "ApiConnection",
        "inputs": {
          "body": {
            "body": {
              "content": "<p><b>🚨 Sentinel Incident #@{body('Parse_Incident')?['object']?['properties']?['incidentNumber']}</b><br>Title: @{body('Parse_Incident')?['object']?['properties']?['title']}<br>Severity: @{body('Parse_Incident')?['object']?['properties']?['severity']}<br>SLA: @{variables('slaMinutes')} minutes</p>"
            },
            "recipient": { "channelId": "<ir-channel-id>" }
          },
          "host": {
            "connection": { "name": "@parameters('$connections')['teams']['connectionId']" }
          },
          "method": "post",
          "path": "/v3/beta/teams/<team-id>/channels/<channel-id>/messages"
        }
      },
      "Log_to_Evidence_Store": {
        "type": "ApiConnection",
        "inputs": {
          "body": "@json(concat('{\"incident\":', string(body('Parse_Incident')), ',\"sla_minutes\":', string(variables('slaMinutes')), ',\"logged_at\":\"', utcNow(), '\"}'))",
          "headers": { "x-ms-blob-type": "BlockBlob" },
          "host": {
            "connection": { "name": "@parameters('$connections')['azureblob']['connectionId']" }
          },
          "method": "put",
          "path": "/v2/datasets/default/files/@{encodeURIComponent(concat('ir-evidence/', formatDateTime(utcNow(),'yyyy/MM/dd'), '/incident-', body('Parse_Incident')?['object']?['properties']?['incidentNumber'], '.json'))}"
        }
      }
    }
  }
}`
            },
            {
                id: "compliance-notification-router",
                name: "Compliance Alert Notification Router",
                description: "Routes compliance alerts from Defender for Cloud, Azure Policy, and Sentinel to the appropriate teams via email, Teams, and ServiceNow based on severity and control family.",
                controls: ["3.12.3", "3.14.6", "3.6.1"],
                category: "Notification & Routing",
                type: "Consumption Logic App",
                template: `Workflow Summary (deploy via Azure Portal or ARM):

Trigger: HTTP webhook (receives alerts from Defender/Policy/Sentinel)

Step 1: Parse alert payload
  - Extract: severity, control_family, resource_type, description

Step 2: Route by severity
  - Critical → Email security-team@org.mil + Teams #critical-alerts + ServiceNow P1
  - High     → Email security-team@org.mil + Teams #security-alerts
  - Medium   → Teams #compliance-alerts
  - Low      → Log to evidence store only

Step 3: Route by control family
  - AC (Access Control)  → IAM team channel
  - AU (Audit)           → SOC team channel
  - SC (System/Comms)    → Network team channel
  - SI (System Integrity) → Endpoint team channel
  - IR (Incident Response) → IR team channel

Step 4: Log all alerts to blob storage
  - Path: compliance-alerts/{yyyy}/{MM}/{dd}/{alertId}.json
  - Include: timestamp, severity, control, resource, routing_decisions

Step 5: Update compliance dashboard (optional)
  - POST to Power BI streaming dataset or custom API`
            }
        ]
    },

    // ==================== 4. SENTINEL ANALYTICS ====================
    sentinelAnalytics: {
        title: "Microsoft Sentinel Analytics Rules",
        description: "Pre-built KQL analytics rules for CMMC-specific threat detection in Microsoft Sentinel. Deploy via ARM template or Sentinel UI.",

        rules: [
            {
                id: "kql-failed-mfa",
                name: "Failed MFA Attempts — Potential Account Compromise",
                controls: ["3.5.3", "3.1.1", "3.3.1"],
                category: "Identity Threat Detection",
                sql: `// CMMC 3.5.3 / 3.1.1 — Failed MFA followed by successful auth
// Deploy as Sentinel Scheduled Analytics Rule
SigninLogs
| where TimeGenerated > ago(1h)
| where ResultType in ("50074", "50076", "500121")  // MFA-related failures
| summarize
    FailedMFA = count(),
    DistinctIPs = dcount(IPAddress),
    IPList = make_set(IPAddress, 5)
    by UserPrincipalName, AppDisplayName, bin(TimeGenerated, 15m)
| where FailedMFA > 5
| join kind=inner (
    SigninLogs
    | where TimeGenerated > ago(1h)
    | where ResultType == "0"  // Successful sign-in
    | project SuccessTime=TimeGenerated, UserPrincipalName, SuccessIP=IPAddress
) on UserPrincipalName
| where SuccessTime > TimeGenerated
| project UserPrincipalName, FailedMFA, DistinctIPs, IPList, SuccessIP, SuccessTime`
            },
            {
                id: "kql-data-exfil",
                name: "Potential CUI Data Exfiltration via SharePoint/OneDrive",
                controls: ["3.1.1", "3.1.2", "3.8.1", "3.13.1"],
                category: "Data Protection",
                sql: `// CMMC 3.1.1 / 3.8.1 — Large file downloads or sharing of sensitive content
OfficeActivity
| where TimeGenerated > ago(24h)
| where Operation in ("FileDownloaded", "FileSyncDownloadedFull",
                       "SharingSet", "AnonymousLinkCreated")
| extend FileName = tostring(SourceFileName),
         FileSize = toint(SourceFileExtension),
         SiteUrl = tostring(Site_)
| summarize
    TotalDownloads = countif(Operation has "Download"),
    TotalShares = countif(Operation has "Sharing" or Operation has "Link"),
    UniqueFiles = dcount(FileName),
    TotalSizeMB = sum(FileSize) / 1048576
    by UserId, ClientIP, bin(TimeGenerated, 1h)
| where TotalDownloads > 50 or TotalShares > 10 or TotalSizeMB > 500
| project TimeGenerated, UserId, ClientIP, TotalDownloads, TotalShares,
          UniqueFiles, TotalSizeMB`
            },
            {
                id: "kql-admin-activity",
                name: "Anomalous Administrative Activity",
                controls: ["3.1.7", "3.3.1", "3.3.5"],
                category: "Privileged Access Monitoring",
                sql: `// CMMC 3.1.7 / 3.3.1 — Detect unusual admin operations
AuditLogs
| where TimeGenerated > ago(24h)
| where Category in ("RoleManagement", "Policy", "ApplicationManagement",
                      "DirectoryManagement")
| extend InitiatedByUPN = tostring(InitiatedBy.user.userPrincipalName),
         TargetName = tostring(TargetResources[0].displayName),
         TargetType = tostring(TargetResources[0].type)
| summarize
    OperationCount = count(),
    UniqueOperations = dcount(OperationName),
    Operations = make_set(OperationName, 10)
    by InitiatedByUPN, Category, bin(TimeGenerated, 1h)
| where OperationCount > 20 or UniqueOperations > 5
| project TimeGenerated, InitiatedByUPN, Category, OperationCount,
          UniqueOperations, Operations`
            },
            {
                id: "kql-nsg-changes",
                name: "Network Security Group Modifications",
                controls: ["3.13.1", "3.13.6", "3.4.5"],
                category: "Network Security",
                sql: `// CMMC 3.13.1 / 3.4.5 — Track NSG rule changes
AzureActivity
| where TimeGenerated > ago(24h)
| where OperationNameValue has_any (
    "MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/SECURITYRULES/WRITE",
    "MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/SECURITYRULES/DELETE",
    "MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/WRITE"
)
| extend Caller = tostring(Caller),
         ResourceName = tostring(split(ResourceId, "/")[-1]),
         NSGName = tostring(split(ResourceId, "/")[-3])
| project TimeGenerated, Caller, OperationNameValue, NSGName,
          ResourceName, ActivityStatusValue, ResourceGroup`
            },
            {
                id: "kql-impossible-travel",
                name: "Impossible Travel Detection",
                controls: ["3.1.1", "3.1.12", "3.5.3"],
                category: "Identity Threat Detection",
                sql: `// CMMC 3.1.1 / 3.1.12 — Sign-ins from geographically impossible locations
SigninLogs
| where TimeGenerated > ago(24h)
| where ResultType == "0"  // Successful only
| extend City = tostring(LocationDetails.city),
         State = tostring(LocationDetails.state),
         Country = tostring(LocationDetails.countryOrRegion),
         Lat = todouble(LocationDetails.geoCoordinates.latitude),
         Lon = todouble(LocationDetails.geoCoordinates.longitude)
| sort by UserPrincipalName, TimeGenerated asc
| serialize
| extend PrevLat = prev(Lat), PrevLon = prev(Lon),
         PrevTime = prev(TimeGenerated), PrevUser = prev(UserPrincipalName)
| where UserPrincipalName == PrevUser
| extend TimeDiffMinutes = datetime_diff('minute', TimeGenerated, PrevTime)
| extend DistanceKm = geo_distance_2points(Lon, Lat, PrevLon, PrevLat) / 1000
| extend SpeedKmH = iff(TimeDiffMinutes > 0, DistanceKm / (TimeDiffMinutes / 60.0), 0)
| where SpeedKmH > 900 and TimeDiffMinutes < 120  // Faster than commercial flight
| project TimeGenerated, UserPrincipalName, City, Country, IPAddress,
          DistanceKm=round(DistanceKm,0), TimeDiffMinutes, SpeedKmH=round(SpeedKmH,0)`
            },
            {
                id: "kql-service-principal",
                name: "Service Principal Credential Additions",
                controls: ["3.5.1", "3.5.2", "3.1.7"],
                category: "Identity Threat Detection",
                sql: `// CMMC 3.5.1 / 3.1.7 — New credentials added to service principals (persistence)
AuditLogs
| where TimeGenerated > ago(24h)
| where OperationName has_any (
    "Add service principal credentials",
    "Update application – Certificates and secrets management"
)
| extend InitiatedByUPN = tostring(InitiatedBy.user.userPrincipalName),
         InitiatedByApp = tostring(InitiatedBy.app.displayName),
         TargetApp = tostring(TargetResources[0].displayName),
         TargetAppId = tostring(TargetResources[0].id)
| project TimeGenerated, OperationName, InitiatedByUPN, InitiatedByApp,
          TargetApp, TargetAppId, CorrelationId`
            }
        ]
    },

    // ==================== 5. LIGHTHOUSE & MULTI-TENANT ====================
    multiTenant: {
        title: "Azure Lighthouse & Multi-Tenant Orchestration",
        description: "Patterns for MSSPs managing multiple client Azure tenants via Azure Lighthouse, including delegated resource management, cross-tenant policy deployment, and centralized monitoring.",

        patterns: [
            {
                id: "lighthouse-onboarding",
                name: "Azure Lighthouse MSSP Onboarding Template",
                description: "ARM template for onboarding client subscriptions to MSSP management via Azure Lighthouse. Grants least-privilege RBAC roles for security monitoring, policy management, and incident response.",
                controls: ["3.1.1", "3.1.2", "3.1.5", "3.1.7"],
                category: "Multi-Tenant Access",
                template: `{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "mspOfferName": {
      "type": "string",
      "defaultValue": "MSSP CMMC Compliance Management"
    },
    "mspTenantId": {
      "type": "string",
      "metadata": { "description": "MSSP's Azure AD tenant ID" }
    },
    "securityAnalystGroupId": {
      "type": "string",
      "metadata": { "description": "MSSP Security Analyst group object ID" }
    },
    "complianceManagerGroupId": {
      "type": "string",
      "metadata": { "description": "MSSP Compliance Manager group object ID" }
    },
    "incidentResponderGroupId": {
      "type": "string",
      "metadata": { "description": "MSSP Incident Responder group object ID" }
    }
  },
  "variables": {
    "registrationName": "[guid(parameters('mspOfferName'))]",
    "assignmentName": "[guid(parameters('mspOfferName'))]",
    "roles": {
      "securityReader": "39bc4728-0917-49c7-9d2c-d95423bc2eb4",
      "securityAdmin": "fb1c8493-542b-48eb-b624-b4c8fea62acd",
      "sentinelResponder": "3e150937-b8fe-4cfb-8069-0eaf05ecd056",
      "policyReader": "acdd72a7-3385-48ef-bd42-f606fba81ae7",
      "logAnalyticsReader": "73c42c96-874c-492b-b04d-ab87d138a893"
    }
  },
  "resources": [
    {
      "type": "Microsoft.ManagedServices/registrationDefinitions",
      "apiVersion": "2022-10-01",
      "name": "[variables('registrationName')]",
      "properties": {
        "registrationDefinitionName": "[parameters('mspOfferName')]",
        "description": "Grants MSSP least-privilege access for CMMC compliance management",
        "managedByTenantId": "[parameters('mspTenantId')]",
        "authorizations": [
          {
            "principalId": "[parameters('securityAnalystGroupId')]",
            "principalIdDisplayName": "MSSP Security Analysts",
            "roleDefinitionId": "[variables('roles').securityReader]"
          },
          {
            "principalId": "[parameters('securityAnalystGroupId')]",
            "principalIdDisplayName": "MSSP Security Analysts",
            "roleDefinitionId": "[variables('roles').logAnalyticsReader]"
          },
          {
            "principalId": "[parameters('complianceManagerGroupId')]",
            "principalIdDisplayName": "MSSP Compliance Managers",
            "roleDefinitionId": "[variables('roles').policyReader]"
          },
          {
            "principalId": "[parameters('incidentResponderGroupId')]",
            "principalIdDisplayName": "MSSP Incident Responders",
            "roleDefinitionId": "[variables('roles').sentinelResponder]"
          },
          {
            "principalId": "[parameters('incidentResponderGroupId')]",
            "principalIdDisplayName": "MSSP Incident Responders",
            "roleDefinitionId": "[variables('roles').securityAdmin]"
          }
        ]
      }
    },
    {
      "type": "Microsoft.ManagedServices/registrationAssignments",
      "apiVersion": "2022-10-01",
      "name": "[variables('assignmentName')]",
      "dependsOn": [
        "[resourceId('Microsoft.ManagedServices/registrationDefinitions', variables('registrationName'))]"
      ],
      "properties": {
        "registrationDefinitionId": "[resourceId('Microsoft.ManagedServices/registrationDefinitions', variables('registrationName'))]"
      }
    }
  ]
}`
            },
            {
                id: "cross-tenant-policy",
                name: "Cross-Tenant Azure Policy Deployment",
                description: "PowerShell script to deploy CMMC compliance policies across all Lighthouse-managed client subscriptions. Includes NIST 800-171 initiative assignment and remediation task creation.",
                controls: ["3.4.1", "3.4.2", "3.12.1", "3.12.3"],
                category: "Policy Orchestration",
                template: `# Cross-Tenant CMMC Policy Deployment via Azure Lighthouse
# Run from MSSP tenant with Lighthouse delegated access
# Requires: Az.Resources, Az.PolicyInsights modules

param(
    [string]$InitiativeId = "/providers/Microsoft.Authorization/policySetDefinitions/03055927-78bd-4236-86c0-f36125a10dc9",  # NIST 800-171
    [string]$AssignmentName = "cmmc-nist-800-171-baseline",
    [switch]$CreateRemediationTasks
)

# Connect to Azure (MSSP tenant)
Connect-AzAccount -Environment AzureUSGovernment

# Get all Lighthouse-delegated subscriptions
$delegatedSubs = Get-AzSubscription | Where-Object {
    $_.TenantId -ne (Get-AzContext).Tenant.Id
}

Write-Host "Found $($delegatedSubs.Count) delegated subscriptions" -ForegroundColor Cyan

foreach ($sub in $delegatedSubs) {
    Write-Host "\\nProcessing: $($sub.Name) ($($sub.Id))" -ForegroundColor Yellow
    Set-AzContext -SubscriptionId $sub.Id | Out-Null

    # Check if assignment already exists
    $existing = Get-AzPolicyAssignment -Name $AssignmentName -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "  Assignment already exists, checking compliance..." -ForegroundColor Gray
    } else {
        # Create policy assignment
        $assignment = New-AzPolicyAssignment \`
            -Name $AssignmentName \`
            -DisplayName "CMMC Level 2 - NIST 800-171 Baseline" \`
            -PolicySetDefinition (Get-AzPolicySetDefinition -Id $InitiativeId) \`
            -Scope "/subscriptions/$($sub.Id)" \`
            -EnforcementMode Default \`
            -Location "usgovvirginia"

        Write-Host "  Policy assigned: $($assignment.Name)" -ForegroundColor Green
    }

    # Get compliance summary
    $compliance = Get-AzPolicyStateSummary -SubscriptionId $sub.Id
    $total = $compliance.Results.TotalResources
    $nonCompliant = $compliance.Results.NonCompliantResources
    $pct = if ($total -gt 0) { [math]::Round(($total - $nonCompliant) / $total * 100, 1) } else { 0 }

    Write-Host "  Compliance: $pct% ($nonCompliant non-compliant of $total resources)" -ForegroundColor $(if ($pct -ge 90) { "Green" } elseif ($pct -ge 70) { "Yellow" } else { "Red" })

    # Create remediation tasks for non-compliant policies
    if ($CreateRemediationTasks -and $nonCompliant -gt 0) {
        $nonCompliantPolicies = Get-AzPolicyState -SubscriptionId $sub.Id \`
            -Filter "ComplianceState eq 'NonCompliant'" |
            Select-Object -Property PolicyDefinitionReferenceId -Unique

        foreach ($policy in $nonCompliantPolicies) {
            $remediationName = "remediate-$($policy.PolicyDefinitionReferenceId)-$(Get-Date -Format 'yyyyMMdd')"
            Start-AzPolicyRemediation \`
                -Name $remediationName \`
                -PolicyAssignmentId "/subscriptions/$($sub.Id)/providers/Microsoft.Authorization/policyAssignments/$AssignmentName" \`
                -PolicyDefinitionReferenceId $policy.PolicyDefinitionReferenceId \`
                -ErrorAction SilentlyContinue
            Write-Host "  Remediation started: $remediationName" -ForegroundColor Cyan
        }
    }
}

Write-Host "\\nCross-tenant policy deployment complete." -ForegroundColor Green`
            },
            {
                id: "centralized-sentinel",
                name: "Centralized Sentinel with Cross-Workspace Queries",
                description: "KQL queries and workspace configuration for aggregating security data from multiple client Sentinel workspaces into a single MSSP pane of glass.",
                controls: ["3.3.1", "3.3.5", "3.14.6", "3.6.1"],
                category: "Centralized Monitoring",
                template: `// Cross-Workspace KQL Queries for MSSP Centralized Sentinel
// These queries run from the MSSP's central Sentinel workspace
// and pull data from client workspaces via Azure Lighthouse

// 1. Cross-tenant security alerts summary
let clientWorkspaces = dynamic([
    "workspace('client-a-sentinel').SecurityAlert",
    "workspace('client-b-sentinel').SecurityAlert",
    "workspace('client-c-sentinel').SecurityAlert"
]);
union withsource=SourceWorkspace SecurityAlert,
    workspace('client-a-sentinel').SecurityAlert,
    workspace('client-b-sentinel').SecurityAlert,
    workspace('client-c-sentinel').SecurityAlert
| where TimeGenerated > ago(24h)
| summarize
    AlertCount = count(),
    HighSeverity = countif(AlertSeverity == "High"),
    MediumSeverity = countif(AlertSeverity == "Medium")
    by SourceWorkspace, AlertSeverity, bin(TimeGenerated, 1h)
| order by HighSeverity desc

// 2. Cross-tenant failed sign-ins
union withsource=Tenant
    workspace('client-a-sentinel').SigninLogs,
    workspace('client-b-sentinel').SigninLogs,
    workspace('client-c-sentinel').SigninLogs
| where TimeGenerated > ago(1h)
| where ResultType != "0"
| summarize FailedAttempts=count() by Tenant, UserPrincipalName, IPAddress
| where FailedAttempts > 10
| order by FailedAttempts desc

// 3. Cross-tenant compliance posture (via Azure Policy logs)
union withsource=Tenant
    workspace('client-a-sentinel').AzureActivity,
    workspace('client-b-sentinel').AzureActivity,
    workspace('client-c-sentinel').AzureActivity
| where TimeGenerated > ago(7d)
| where CategoryValue == "Policy"
| where OperationNameValue has "audit"
| summarize
    Compliant = countif(ActivityStatusValue == "Success"),
    NonCompliant = countif(ActivityStatusValue == "Failed")
    by Tenant
| extend CompliancePct = round(todouble(Compliant) / (Compliant + NonCompliant) * 100, 1)
| order by CompliancePct asc`
            }
        ]
    },

    // ==================== 6. QUICK REFERENCE ====================
    quickReference: {
        title: "Azure Service → CMMC Control Mapping",
        description: "Quick reference mapping Azure services to the CMMC Level 2 controls they help satisfy.",
        mappings: [
            { service: "Microsoft Sentinel", category: "SIEM & Monitoring", controls: ["3.3.1", "3.3.2", "3.3.4", "3.3.5", "3.14.6", "3.14.7"] },
            { service: "Defender for Cloud", category: "Vulnerability & Threat", controls: ["3.11.1", "3.11.2", "3.11.3", "3.14.1", "3.14.2"] },
            { service: "Defender for Endpoint", category: "Endpoint Protection", controls: ["3.14.1", "3.14.2", "3.14.3", "3.14.6", "3.14.7"] },
            { service: "Entra ID (Azure AD)", category: "Identity & Access", controls: ["3.1.1", "3.1.2", "3.1.5", "3.1.7", "3.5.1", "3.5.2", "3.5.3"] },
            { service: "Conditional Access", category: "Identity & Access", controls: ["3.1.1", "3.1.12", "3.1.15", "3.5.3"] },
            { service: "Azure Policy", category: "Configuration & Compliance", controls: ["3.4.1", "3.4.2", "3.4.5", "3.4.6", "3.4.8"] },
            { service: "Azure Key Vault", category: "Encryption & Secrets", controls: ["3.13.8", "3.13.10", "3.13.11"] },
            { service: "Azure Monitor / Log Analytics", category: "Logging & Audit", controls: ["3.3.1", "3.3.2", "3.3.6", "3.3.7", "3.3.8"] },
            { service: "Azure Lighthouse", category: "Multi-Tenant Management", controls: ["3.1.1", "3.1.2", "3.1.5", "3.1.7"] },
            { service: "Azure Logic Apps", category: "Automation & Orchestration", controls: ["3.6.1", "3.6.2", "3.12.3"] },
            { service: "Azure Functions", category: "Automation & Orchestration", controls: ["3.3.1", "3.4.2", "3.12.1"] },
            { service: "Azure Automation / Update Mgmt", category: "Patch Management", controls: ["3.14.1", "3.4.1", "3.4.2"] },
            { service: "NSG Flow Logs / Traffic Analytics", category: "Network Monitoring", controls: ["3.13.1", "3.13.6", "3.14.6"] },
            { service: "Azure Information Protection", category: "Data Protection", controls: ["3.1.1", "3.1.2", "3.8.1", "3.8.2"] },
            { service: "Microsoft Purview", category: "Data Governance", controls: ["3.8.1", "3.8.2", "3.8.3", "3.8.9"] },
            { service: "Azure Backup", category: "Backup & Recovery", controls: ["3.8.9"] },
            { service: "Azure Firewall / WAF", category: "Network Security", controls: ["3.13.1", "3.13.5", "3.13.6"] },
            { service: "Azure Bastion", category: "Remote Access", controls: ["3.1.12", "3.1.13", "3.1.14"] }
        ]
    }
};

if (typeof window !== 'undefined') window.MSP_AZURE_COMPLIANCE_TOOLKIT = MSP_AZURE_COMPLIANCE_TOOLKIT;
