// API Evidence Collection Reference
// Cloud Provider and SaaS Platform APIs for CMMC Evidence Collection

const API_EVIDENCE_COLLECTION = {
    version: "1.0.0",
    lastUpdated: "2025-01-27",

    // ==================== MICROSOFT GRAPH API ====================
    microsoftGraph: {
        title: "Microsoft Graph API",
        baseUrl: "https://graph.microsoft.us",  // GCC High
        commercialUrl: "https://graph.microsoft.com",
        documentation: "https://learn.microsoft.com/en-us/graph/api/overview",
        authMethod: "OAuth 2.0 / Azure AD App Registration",
        
        authentication: {
            flows: ["Client Credentials", "Authorization Code", "Device Code"],
            scopes: {
                readOnly: [
                    "User.Read.All",
                    "Group.Read.All", 
                    "Directory.Read.All",
                    "Policy.Read.All",
                    "AuditLog.Read.All",
                    "SecurityEvents.Read.All",
                    "DeviceManagementConfiguration.Read.All"
                ],
                evidenceCollection: [
                    "Reports.Read.All",
                    "IdentityRiskEvent.Read.All",
                    "Policy.Read.ConditionalAccess",
                    "InformationProtectionPolicy.Read"
                ]
            },
            tokenEndpoint: {
                gccHigh: "https://login.microsoftonline.us/{tenantId}/oauth2/v2.0/token",
                commercial: "https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token"
            },
            sampleTokenRequest: `// Get Access Token (Client Credentials Flow)
POST https://login.microsoftonline.us/{tenantId}/oauth2/v2.0/token
Content-Type: application/x-www-form-urlencoded

client_id={clientId}
&scope=https://graph.microsoft.us/.default
&client_secret={clientSecret}
&grant_type=client_credentials`
        },

        endpoints: [
            // Identity & Access Control
            {
                category: "Identity Management",
                cmmcControls: ["3.1.1", "3.5.1", "3.5.2"],
                endpoints: [
                    {
                        name: "List All Users",
                        method: "GET",
                        endpoint: "/v1.0/users",
                        description: "Retrieve all user accounts for access review",
                        evidenceType: "User Account Inventory",
                        sampleRequest: `GET https://graph.microsoft.us/v1.0/users
?$select=id,displayName,userPrincipalName,accountEnabled,createdDateTime,lastSignInDateTime
&$top=999`,
                        sampleResponse: `{
  "@odata.context": "https://graph.microsoft.us/v1.0/$metadata#users",
  "value": [
    {
      "id": "87d349ed-44d7-43e1-9a83-5f2406dee5bd",
      "displayName": "John Smith",
      "userPrincipalName": "jsmith@contoso.onmicrosoft.us",
      "accountEnabled": true,
      "createdDateTime": "2024-01-15T14:30:00Z",
      "lastSignInDateTime": "2025-01-26T08:45:00Z"
    }
  ]
}`
                    },
                    {
                        name: "List Privileged Role Assignments",
                        method: "GET",
                        endpoint: "/v1.0/roleManagement/directory/roleAssignments",
                        description: "Get all privileged role assignments for least privilege review",
                        evidenceType: "Privileged Access Review",
                        cmmcControls: ["3.1.5", "3.1.6"],
                        sampleRequest: `GET https://graph.microsoft.us/v1.0/roleManagement/directory/roleAssignments
?$expand=principal,roleDefinition`,
                        permissions: ["RoleManagement.Read.Directory"]
                    },
                    {
                        name: "Get Inactive Users",
                        method: "GET",
                        endpoint: "/v1.0/users",
                        description: "Find users inactive for 45+ days",
                        evidenceType: "Inactive Account Report",
                        cmmcControls: ["3.5.6"],
                        sampleRequest: `GET https://graph.microsoft.us/v1.0/users
?$filter=signInActivity/lastSignInDateTime le 2024-12-13T00:00:00Z
&$select=displayName,userPrincipalName,signInActivity`
                    }
                ]
            },
            // MFA & Authentication
            {
                category: "Authentication",
                cmmcControls: ["3.5.3", "3.5.4"],
                endpoints: [
                    {
                        name: "Get User Authentication Methods",
                        method: "GET",
                        endpoint: "/v1.0/users/{userId}/authentication/methods",
                        description: "List MFA methods registered for a user",
                        evidenceType: "MFA Registration Status",
                        sampleRequest: `GET https://graph.microsoft.us/v1.0/users/{userId}/authentication/methods`,
                        permissions: ["UserAuthenticationMethod.Read.All"]
                    },
                    {
                        name: "List Conditional Access Policies",
                        method: "GET",
                        endpoint: "/v1.0/identity/conditionalAccess/policies",
                        description: "Get all Conditional Access policies including MFA requirements",
                        evidenceType: "Conditional Access Configuration",
                        sampleRequest: `GET https://graph.microsoft.us/v1.0/identity/conditionalAccess/policies`,
                        permissions: ["Policy.Read.All"]
                    },
                    {
                        name: "MFA Registration Report",
                        method: "GET",
                        endpoint: "/v1.0/reports/authenticationMethods/userRegistrationDetails",
                        description: "Get MFA registration status for all users",
                        evidenceType: "MFA Enrollment Report",
                        sampleRequest: `GET https://graph.microsoft.us/v1.0/reports/authenticationMethods/userRegistrationDetails
?$filter=isMfaRegistered eq false`,
                        permissions: ["AuditLog.Read.All", "UserAuthenticationMethod.Read.All"]
                    }
                ]
            },
            // Audit & Logging
            {
                category: "Audit Logs",
                cmmcControls: ["3.3.1", "3.3.2", "3.3.5"],
                endpoints: [
                    {
                        name: "Get Sign-In Logs",
                        method: "GET",
                        endpoint: "/v1.0/auditLogs/signIns",
                        description: "Retrieve sign-in audit logs",
                        evidenceType: "Authentication Audit Trail",
                        sampleRequest: `GET https://graph.microsoft.us/v1.0/auditLogs/signIns
?$filter=createdDateTime ge 2025-01-01T00:00:00Z
&$top=100
&$orderby=createdDateTime desc`,
                        permissions: ["AuditLog.Read.All"]
                    },
                    {
                        name: "Get Directory Audit Logs",
                        method: "GET",
                        endpoint: "/v1.0/auditLogs/directoryAudits",
                        description: "Retrieve directory change audit logs",
                        evidenceType: "Configuration Change Audit",
                        sampleRequest: `GET https://graph.microsoft.us/v1.0/auditLogs/directoryAudits
?$filter=activityDisplayName eq 'Add member to role'`,
                        permissions: ["AuditLog.Read.All"]
                    },
                    {
                        name: "Get Security Alerts",
                        method: "GET",
                        endpoint: "/v1.0/security/alerts_v2",
                        description: "Retrieve security alerts from Microsoft 365 Defender",
                        evidenceType: "Security Alert Log",
                        cmmcControls: ["3.14.6", "3.14.7"],
                        sampleRequest: `GET https://graph.microsoft.us/v1.0/security/alerts_v2
?$filter=status eq 'new' or status eq 'inProgress'`,
                        permissions: ["SecurityAlert.Read.All"]
                    }
                ]
            },
            // Device Management (Intune)
            {
                category: "Device Management",
                cmmcControls: ["3.1.18", "3.1.19", "3.4.1"],
                endpoints: [
                    {
                        name: "List Managed Devices",
                        method: "GET",
                        endpoint: "/v1.0/deviceManagement/managedDevices",
                        description: "Get all Intune-managed devices with compliance status",
                        evidenceType: "Device Inventory",
                        sampleRequest: `GET https://graph.microsoft.us/v1.0/deviceManagement/managedDevices
?$select=deviceName,operatingSystem,complianceState,isEncrypted,lastSyncDateTime`,
                        permissions: ["DeviceManagementManagedDevices.Read.All"]
                    },
                    {
                        name: "Get Device Compliance Policies",
                        method: "GET",
                        endpoint: "/v1.0/deviceManagement/deviceCompliancePolicies",
                        description: "List all device compliance policies",
                        evidenceType: "Compliance Policy Configuration",
                        sampleRequest: `GET https://graph.microsoft.us/v1.0/deviceManagement/deviceCompliancePolicies`,
                        permissions: ["DeviceManagementConfiguration.Read.All"]
                    },
                    {
                        name: "Get Non-Compliant Devices",
                        method: "GET",
                        endpoint: "/v1.0/deviceManagement/managedDevices",
                        description: "Find devices not meeting compliance requirements",
                        evidenceType: "Non-Compliance Report",
                        sampleRequest: `GET https://graph.microsoft.us/v1.0/deviceManagement/managedDevices
?$filter=complianceState eq 'noncompliant'`
                    }
                ]
            },
            // Data Protection
            {
                category: "Information Protection",
                cmmcControls: ["3.1.3", "3.8.1", "3.8.4"],
                endpoints: [
                    {
                        name: "List Sensitivity Labels",
                        method: "GET",
                        endpoint: "/v1.0/security/informationProtection/sensitivityLabels",
                        description: "Get configured sensitivity labels",
                        evidenceType: "Data Classification Configuration",
                        sampleRequest: `GET https://graph.microsoft.us/v1.0/security/informationProtection/sensitivityLabels`,
                        permissions: ["InformationProtectionPolicy.Read"]
                    },
                    {
                        name: "Get DLP Policies",
                        method: "GET",
                        endpoint: "/v1.0/security/informationProtection/policy/labels",
                        description: "Retrieve DLP policy configurations",
                        evidenceType: "DLP Policy Evidence",
                        permissions: ["InformationProtectionPolicy.Read.All"]
                    }
                ]
            }
        ],

        bulkEvidenceScript: `# PowerShell Script for Bulk Evidence Collection via Graph API
# Requires: Microsoft.Graph PowerShell module

# Connect to Microsoft Graph (GCC High)
Connect-MgGraph -Environment USGov -Scopes @(
    "User.Read.All",
    "Group.Read.All",
    "AuditLog.Read.All",
    "Policy.Read.All",
    "DeviceManagementManagedDevices.Read.All"
)

$evidenceFolder = "C:\\CMMC-Evidence\\$(Get-Date -Format 'yyyy-MM-dd')"
New-Item -ItemType Directory -Force -Path $evidenceFolder

# 3.1.1 - User Inventory
Get-MgUser -All -Property DisplayName,UserPrincipalName,AccountEnabled,CreatedDateTime |
    Export-Csv "$evidenceFolder\\3.1.1-UserInventory.csv" -NoTypeInformation

# 3.1.5 - Privileged Role Assignments
Get-MgRoleManagementDirectoryRoleAssignment -ExpandProperty Principal,RoleDefinition |
    Export-Csv "$evidenceFolder\\3.1.5-PrivilegedRoles.csv" -NoTypeInformation

# 3.5.3 - MFA Registration Status
Get-MgReportAuthenticationMethodUserRegistrationDetail |
    Export-Csv "$evidenceFolder\\3.5.3-MfaRegistration.csv" -NoTypeInformation

# 3.5.6 - Inactive Users (45+ days)
$cutoffDate = (Get-Date).AddDays(-45)
Get-MgUser -All -Property DisplayName,UserPrincipalName,SignInActivity |
    Where-Object { $_.SignInActivity.LastSignInDateTime -lt $cutoffDate } |
    Export-Csv "$evidenceFolder\\3.5.6-InactiveUsers.csv" -NoTypeInformation

# 3.1.18 - Managed Devices
Get-MgDeviceManagementManagedDevice -All |
    Select-Object DeviceName,OperatingSystem,ComplianceState,IsEncrypted |
    Export-Csv "$evidenceFolder\\3.1.18-ManagedDevices.csv" -NoTypeInformation

# 3.3.1 - Audit Logs (last 7 days)
$startDate = (Get-Date).AddDays(-7).ToString("yyyy-MM-ddTHH:mm:ssZ")
Get-MgAuditLogSignIn -Filter "createdDateTime ge $startDate" -Top 1000 |
    Export-Csv "$evidenceFolder\\3.3.1-SignInLogs.csv" -NoTypeInformation

Write-Host "Evidence collection complete. Files saved to: $evidenceFolder"`
    },

    // ==================== AZURE RESOURCE MANAGER API ====================
    azureResourceManager: {
        title: "Azure Resource Manager API",
        baseUrl: "https://management.usgovcloudapi.net",  // Azure Government
        commercialUrl: "https://management.azure.com",
        documentation: "https://learn.microsoft.com/en-us/rest/api/azure/",
        authMethod: "OAuth 2.0 / Azure AD",

        authentication: {
            tokenEndpoint: "https://login.microsoftonline.us/{tenantId}/oauth2/v2.0/token",
            scope: "https://management.usgovcloudapi.net/.default",
            sampleTokenRequest: `POST https://login.microsoftonline.us/{tenantId}/oauth2/v2.0/token
Content-Type: application/x-www-form-urlencoded

client_id={clientId}
&scope=https://management.usgovcloudapi.net/.default
&client_secret={clientSecret}
&grant_type=client_credentials`
        },

        endpoints: [
            {
                category: "Security & Compliance",
                cmmcControls: ["3.11.2", "3.14.1", "3.14.2"],
                endpoints: [
                    {
                        name: "Get Security Assessments",
                        method: "GET",
                        endpoint: "/subscriptions/{subscriptionId}/providers/Microsoft.Security/assessments",
                        description: "Get Defender for Cloud security assessments",
                        evidenceType: "Vulnerability Assessment",
                        apiVersion: "2021-06-01",
                        sampleRequest: `GET https://management.usgovcloudapi.net/subscriptions/{subscriptionId}/providers/Microsoft.Security/assessments?api-version=2021-06-01`
                    },
                    {
                        name: "Get Secure Score",
                        method: "GET",
                        endpoint: "/subscriptions/{subscriptionId}/providers/Microsoft.Security/secureScores",
                        description: "Get overall security posture score",
                        evidenceType: "Security Posture Assessment",
                        apiVersion: "2020-01-01",
                        sampleRequest: `GET https://management.usgovcloudapi.net/subscriptions/{subscriptionId}/providers/Microsoft.Security/secureScores?api-version=2020-01-01`
                    },
                    {
                        name: "List Policy Assignments",
                        method: "GET",
                        endpoint: "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyAssignments",
                        description: "Get Azure Policy assignments for compliance",
                        evidenceType: "Policy Compliance Configuration",
                        cmmcControls: ["3.4.1", "3.4.2"],
                        apiVersion: "2022-06-01",
                        sampleRequest: `GET https://management.usgovcloudapi.net/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyAssignments?api-version=2022-06-01`
                    }
                ]
            },
            {
                category: "Network Security",
                cmmcControls: ["3.13.1", "3.13.5", "3.13.6"],
                endpoints: [
                    {
                        name: "List Network Security Groups",
                        method: "GET",
                        endpoint: "/subscriptions/{subscriptionId}/providers/Microsoft.Network/networkSecurityGroups",
                        description: "Get all NSGs and their rules",
                        evidenceType: "Firewall Rule Configuration",
                        apiVersion: "2023-05-01",
                        sampleRequest: `GET https://management.usgovcloudapi.net/subscriptions/{subscriptionId}/providers/Microsoft.Network/networkSecurityGroups?api-version=2023-05-01`
                    },
                    {
                        name: "Get Azure Firewall Policies",
                        method: "GET",
                        endpoint: "/subscriptions/{subscriptionId}/providers/Microsoft.Network/firewallPolicies",
                        description: "Get Azure Firewall policy configurations",
                        evidenceType: "Firewall Policy Evidence",
                        apiVersion: "2023-05-01"
                    }
                ]
            },
            {
                category: "Encryption & Key Management",
                cmmcControls: ["3.13.10", "3.13.11", "3.13.16"],
                endpoints: [
                    {
                        name: "List Key Vaults",
                        method: "GET",
                        endpoint: "/subscriptions/{subscriptionId}/providers/Microsoft.KeyVault/vaults",
                        description: "Get all Key Vault instances",
                        evidenceType: "Key Management Infrastructure",
                        apiVersion: "2023-02-01"
                    },
                    {
                        name: "Get Disk Encryption Sets",
                        method: "GET",
                        endpoint: "/subscriptions/{subscriptionId}/providers/Microsoft.Compute/diskEncryptionSets",
                        description: "Get disk encryption configurations",
                        evidenceType: "Encryption at Rest Configuration",
                        apiVersion: "2023-04-02"
                    }
                ]
            },
            {
                category: "Logging & Monitoring",
                cmmcControls: ["3.3.1", "3.3.4", "3.3.8"],
                endpoints: [
                    {
                        name: "Get Diagnostic Settings",
                        method: "GET",
                        endpoint: "/{resourceId}/providers/Microsoft.Insights/diagnosticSettings",
                        description: "Get diagnostic logging configuration for a resource",
                        evidenceType: "Audit Logging Configuration",
                        apiVersion: "2021-05-01-preview"
                    },
                    {
                        name: "List Log Analytics Workspaces",
                        method: "GET",
                        endpoint: "/subscriptions/{subscriptionId}/providers/Microsoft.OperationalInsights/workspaces",
                        description: "Get Log Analytics workspace configurations",
                        evidenceType: "SIEM Configuration",
                        apiVersion: "2022-10-01"
                    }
                ]
            }
        ],

        azCliEquivalents: `# Azure CLI Commands for Evidence Collection (Azure Government)
az cloud set --name AzureUSGovernment
az login

# 3.11.2 - Security Assessments
az security assessment list --subscription {subscriptionId} -o json > security-assessments.json

# 3.13.1 - Network Security Groups
az network nsg list --subscription {subscriptionId} -o json > nsg-rules.json

# 3.4.1 - Policy Compliance
az policy assignment list --subscription {subscriptionId} -o json > policy-assignments.json
az policy state list --subscription {subscriptionId} -o json > policy-compliance.json

# 3.3.1 - Diagnostic Settings (for a resource)
az monitor diagnostic-settings list --resource {resourceId} -o json > diagnostic-settings.json

# 3.13.10 - Key Vault Configuration
az keyvault list --subscription {subscriptionId} -o json > keyvaults.json`
    },

    // ==================== AWS APIs ====================
    aws: {
        title: "AWS APIs (GovCloud)",
        baseUrl: "https://{service}.us-gov-west-1.amazonaws.com",
        documentation: "https://docs.aws.amazon.com/",
        authMethod: "AWS Signature Version 4 / IAM",

        authentication: {
            methods: ["IAM User Access Keys", "IAM Role (AssumeRole)", "Instance Profile"],
            stsEndpoint: "https://sts.us-gov-west-1.amazonaws.com",
            note: "Use AWS SDK or CLI with proper credential configuration for GovCloud"
        },

        services: [
            {
                service: "IAM",
                category: "Identity & Access Management",
                cmmcControls: ["3.1.1", "3.1.5", "3.5.1", "3.5.3"],
                endpoints: [
                    {
                        name: "List Users",
                        action: "iam:ListUsers",
                        description: "List all IAM users",
                        evidenceType: "User Account Inventory",
                        cliCommand: "aws iam list-users --output json",
                        apiCall: `POST / HTTP/1.1
Host: iam.us-gov.amazonaws.com
Action=ListUsers&Version=2010-05-08`
                    },
                    {
                        name: "Get Credential Report",
                        action: "iam:GetCredentialReport",
                        description: "Get IAM credential report (password age, MFA, access keys)",
                        evidenceType: "Credential Status Report",
                        cmmcControls: ["3.5.3", "3.5.7", "3.5.8"],
                        cliCommand: `aws iam generate-credential-report
aws iam get-credential-report --output text --query Content | base64 -d`
                    },
                    {
                        name: "List MFA Devices",
                        action: "iam:ListMFADevices",
                        description: "List MFA devices for users",
                        evidenceType: "MFA Configuration",
                        cmmcControls: ["3.5.3"],
                        cliCommand: "aws iam list-virtual-mfa-devices --output json"
                    },
                    {
                        name: "Get Account Password Policy",
                        action: "iam:GetAccountPasswordPolicy",
                        description: "Get IAM password policy settings",
                        evidenceType: "Password Policy Configuration",
                        cmmcControls: ["3.5.7", "3.5.8"],
                        cliCommand: "aws iam get-account-password-policy --output json"
                    }
                ]
            },
            {
                service: "CloudTrail",
                category: "Audit Logging",
                cmmcControls: ["3.3.1", "3.3.2", "3.3.8"],
                endpoints: [
                    {
                        name: "Describe Trails",
                        action: "cloudtrail:DescribeTrails",
                        description: "Get CloudTrail configuration",
                        evidenceType: "Audit Trail Configuration",
                        cliCommand: "aws cloudtrail describe-trails --output json"
                    },
                    {
                        name: "Get Trail Status",
                        action: "cloudtrail:GetTrailStatus",
                        description: "Verify trail is logging",
                        evidenceType: "Audit Logging Status",
                        cliCommand: "aws cloudtrail get-trail-status --name {trailName} --output json"
                    },
                    {
                        name: "Lookup Events",
                        action: "cloudtrail:LookupEvents",
                        description: "Search audit events",
                        evidenceType: "Audit Event Sample",
                        cliCommand: `aws cloudtrail lookup-events \\
  --start-time $(date -d '7 days ago' --iso-8601=seconds) \\
  --max-results 50 --output json`
                    }
                ]
            },
            {
                service: "Config",
                category: "Configuration Management",
                cmmcControls: ["3.4.1", "3.4.2", "3.12.3"],
                endpoints: [
                    {
                        name: "Describe Compliance By Config Rule",
                        action: "config:DescribeComplianceByConfigRule",
                        description: "Get Config rule compliance status",
                        evidenceType: "Configuration Compliance",
                        cliCommand: "aws configservice describe-compliance-by-config-rule --output json"
                    },
                    {
                        name: "Get Compliance Details",
                        action: "config:GetComplianceDetailsByConfigRule",
                        description: "Get detailed compliance for a rule",
                        evidenceType: "Compliance Details",
                        cliCommand: "aws configservice get-compliance-details-by-config-rule --config-rule-name {ruleName}"
                    }
                ]
            },
            {
                service: "SecurityHub",
                category: "Security Assessment",
                cmmcControls: ["3.11.2", "3.12.1", "3.14.6"],
                endpoints: [
                    {
                        name: "Get Findings",
                        action: "securityhub:GetFindings",
                        description: "Get Security Hub findings",
                        evidenceType: "Security Findings",
                        cliCommand: `aws securityhub get-findings \\
  --filters '{"SeverityLabel": [{"Value": "CRITICAL", "Comparison": "EQUALS"}]}' \\
  --max-items 100 --output json`
                    },
                    {
                        name: "Get Standards Subscription",
                        action: "securityhub:GetEnabledStandards",
                        description: "Get enabled security standards (CIS, NIST)",
                        evidenceType: "Security Standards Configuration",
                        cliCommand: "aws securityhub get-enabled-standards --output json"
                    }
                ]
            },
            {
                service: "EC2",
                category: "Network Security",
                cmmcControls: ["3.13.1", "3.13.5", "3.13.6"],
                endpoints: [
                    {
                        name: "Describe Security Groups",
                        action: "ec2:DescribeSecurityGroups",
                        description: "Get all security group rules",
                        evidenceType: "Firewall Rule Configuration",
                        cliCommand: "aws ec2 describe-security-groups --output json"
                    },
                    {
                        name: "Describe Network ACLs",
                        action: "ec2:DescribeNetworkAcls",
                        description: "Get network ACL configurations",
                        evidenceType: "Network ACL Configuration",
                        cliCommand: "aws ec2 describe-network-acls --output json"
                    },
                    {
                        name: "Describe VPC Flow Logs",
                        action: "ec2:DescribeFlowLogs",
                        description: "Get VPC flow log configuration",
                        evidenceType: "Network Traffic Logging",
                        cmmcControls: ["3.13.1", "3.3.1"],
                        cliCommand: "aws ec2 describe-flow-logs --output json"
                    }
                ]
            },
            {
                service: "KMS",
                category: "Encryption",
                cmmcControls: ["3.13.10", "3.13.11"],
                endpoints: [
                    {
                        name: "List Keys",
                        action: "kms:ListKeys",
                        description: "List all KMS keys",
                        evidenceType: "Key Management Inventory",
                        cliCommand: "aws kms list-keys --output json"
                    },
                    {
                        name: "Get Key Rotation Status",
                        action: "kms:GetKeyRotationStatus",
                        description: "Check if key rotation is enabled",
                        evidenceType: "Key Rotation Configuration",
                        cliCommand: "aws kms get-key-rotation-status --key-id {keyId} --output json"
                    }
                ]
            },
            {
                service: "SSM",
                category: "Patch Management",
                cmmcControls: ["3.14.1"],
                endpoints: [
                    {
                        name: "Describe Instance Patch States",
                        action: "ssm:DescribeInstancePatchStates",
                        description: "Get patch compliance status",
                        evidenceType: "Patch Compliance Report",
                        cliCommand: "aws ssm describe-instance-patch-states --output json"
                    },
                    {
                        name: "List Compliance Items",
                        action: "ssm:ListComplianceItems",
                        description: "Get SSM compliance items",
                        evidenceType: "Systems Manager Compliance",
                        cliCommand: "aws ssm list-compliance-items --output json"
                    }
                ]
            }
        ],

        bulkEvidenceScript: `#!/bin/bash
# AWS Evidence Collection Script (GovCloud)

export AWS_DEFAULT_REGION=us-gov-west-1
EVIDENCE_DIR="./aws-evidence-$(date +%Y-%m-%d)"
mkdir -p "$EVIDENCE_DIR"

echo "Collecting AWS Evidence for CMMC..."

# 3.1.1 - User Inventory
aws iam list-users > "$EVIDENCE_DIR/3.1.1-iam-users.json"
aws iam generate-credential-report
sleep 5
aws iam get-credential-report --query Content --output text | base64 -d > "$EVIDENCE_DIR/3.1.1-credential-report.csv"

# 3.5.3 - MFA Status
aws iam list-virtual-mfa-devices > "$EVIDENCE_DIR/3.5.3-mfa-devices.json"

# 3.5.7 - Password Policy
aws iam get-account-password-policy > "$EVIDENCE_DIR/3.5.7-password-policy.json"

# 3.3.1 - CloudTrail Configuration
aws cloudtrail describe-trails > "$EVIDENCE_DIR/3.3.1-cloudtrail-config.json"

# 3.4.1 - AWS Config Compliance
aws configservice describe-compliance-by-config-rule > "$EVIDENCE_DIR/3.4.1-config-compliance.json"

# 3.11.2 - Security Hub Findings
aws securityhub get-findings --max-items 100 > "$EVIDENCE_DIR/3.11.2-security-findings.json"

# 3.13.1 - Security Groups
aws ec2 describe-security-groups > "$EVIDENCE_DIR/3.13.1-security-groups.json"

# 3.13.10 - KMS Keys
aws kms list-keys > "$EVIDENCE_DIR/3.13.10-kms-keys.json"

# 3.14.1 - Patch Compliance
aws ssm describe-instance-patch-states > "$EVIDENCE_DIR/3.14.1-patch-states.json"

echo "Evidence collection complete. Files saved to: $EVIDENCE_DIR"`
    },

    // ==================== GCP APIs ====================
    gcp: {
        title: "Google Cloud APIs",
        baseUrl: "https://{service}.googleapis.com",
        documentation: "https://cloud.google.com/apis/docs/overview",
        authMethod: "OAuth 2.0 / Service Account",

        authentication: {
            methods: ["Service Account Key", "Workload Identity", "User Credentials"],
            tokenEndpoint: "https://oauth2.googleapis.com/token",
            scopes: [
                "https://www.googleapis.com/auth/cloud-platform.read-only",
                "https://www.googleapis.com/auth/iam"
            ]
        },

        services: [
            {
                service: "Cloud IAM",
                category: "Identity & Access Management",
                cmmcControls: ["3.1.1", "3.1.5", "3.5.1"],
                endpoints: [
                    {
                        name: "Get IAM Policy",
                        method: "POST",
                        endpoint: "https://cloudresourcemanager.googleapis.com/v1/projects/{projectId}:getIamPolicy",
                        description: "Get project IAM policy bindings",
                        evidenceType: "Access Control Policy",
                        gcloudCommand: "gcloud projects get-iam-policy {projectId} --format=json"
                    },
                    {
                        name: "List Service Accounts",
                        method: "GET",
                        endpoint: "https://iam.googleapis.com/v1/projects/{projectId}/serviceAccounts",
                        description: "List all service accounts",
                        evidenceType: "Service Account Inventory",
                        gcloudCommand: "gcloud iam service-accounts list --project={projectId} --format=json"
                    }
                ]
            },
            {
                service: "Cloud Audit Logs",
                category: "Audit Logging",
                cmmcControls: ["3.3.1", "3.3.2"],
                endpoints: [
                    {
                        name: "List Log Entries",
                        method: "POST",
                        endpoint: "https://logging.googleapis.com/v2/entries:list",
                        description: "Query audit log entries",
                        evidenceType: "Audit Log Evidence",
                        gcloudCommand: `gcloud logging read 'logName:"cloudaudit.googleapis.com"' \\
  --project={projectId} --limit=100 --format=json`
                    },
                    {
                        name: "Get Audit Config",
                        method: "POST",
                        endpoint: "https://cloudresourcemanager.googleapis.com/v1/projects/{projectId}:getIamPolicy",
                        description: "Get audit logging configuration",
                        evidenceType: "Audit Configuration",
                        gcloudCommand: "gcloud projects get-iam-policy {projectId} --format='json(auditConfigs)'"
                    }
                ]
            },
            {
                service: "Security Command Center",
                category: "Security Assessment",
                cmmcControls: ["3.11.2", "3.14.6"],
                endpoints: [
                    {
                        name: "List Findings",
                        method: "GET",
                        endpoint: "https://securitycenter.googleapis.com/v1/organizations/{orgId}/sources/-/findings",
                        description: "Get security findings",
                        evidenceType: "Security Findings",
                        gcloudCommand: `gcloud scc findings list {orgId} \\
  --source=- --filter='state="ACTIVE"' --format=json`
                    }
                ]
            },
            {
                service: "VPC",
                category: "Network Security",
                cmmcControls: ["3.13.1", "3.13.6"],
                endpoints: [
                    {
                        name: "List Firewall Rules",
                        method: "GET",
                        endpoint: "https://compute.googleapis.com/compute/v1/projects/{projectId}/global/firewalls",
                        description: "Get all firewall rules",
                        evidenceType: "Firewall Configuration",
                        gcloudCommand: "gcloud compute firewall-rules list --project={projectId} --format=json"
                    }
                ]
            },
            {
                service: "Cloud KMS",
                category: "Encryption",
                cmmcControls: ["3.13.10", "3.13.11"],
                endpoints: [
                    {
                        name: "List Key Rings",
                        method: "GET",
                        endpoint: "https://cloudkms.googleapis.com/v1/projects/{projectId}/locations/{location}/keyRings",
                        description: "List KMS key rings",
                        evidenceType: "Key Management Configuration",
                        gcloudCommand: "gcloud kms keyrings list --location={location} --project={projectId} --format=json"
                    }
                ]
            }
        ],

        bulkEvidenceScript: `#!/bin/bash
# GCP Evidence Collection Script

PROJECT_ID="your-project-id"
EVIDENCE_DIR="./gcp-evidence-$(date +%Y-%m-%d)"
mkdir -p "$EVIDENCE_DIR"

echo "Collecting GCP Evidence for CMMC..."

# 3.1.1 - IAM Policy
gcloud projects get-iam-policy $PROJECT_ID --format=json > "$EVIDENCE_DIR/3.1.1-iam-policy.json"

# 3.1.5 - Service Accounts
gcloud iam service-accounts list --project=$PROJECT_ID --format=json > "$EVIDENCE_DIR/3.1.5-service-accounts.json"

# 3.3.1 - Audit Logs Sample
gcloud logging read 'logName:"cloudaudit.googleapis.com"' \\
  --project=$PROJECT_ID --limit=100 --format=json > "$EVIDENCE_DIR/3.3.1-audit-logs.json"

# 3.11.2 - Security Findings (requires Security Command Center)
# gcloud scc findings list {orgId} --source=- --format=json > "$EVIDENCE_DIR/3.11.2-scc-findings.json"

# 3.13.1 - Firewall Rules
gcloud compute firewall-rules list --project=$PROJECT_ID --format=json > "$EVIDENCE_DIR/3.13.1-firewall-rules.json"

# 3.13.10 - KMS Keys
for location in us-central1 us-east1; do
  gcloud kms keyrings list --location=$location --project=$PROJECT_ID --format=json >> "$EVIDENCE_DIR/3.13.10-kms-keyrings.json"
done

echo "Evidence collection complete. Files saved to: $EVIDENCE_DIR"`
    },

    // ==================== SAAS PLATFORMS ====================
    saasIntegrations: {
        title: "SaaS Platform Integrations",
        
        platforms: [
            {
                name: "CrowdStrike Falcon",
                category: "Endpoint Protection",
                cmmcControls: ["3.14.2", "3.14.4", "3.14.5", "3.14.6"],
                apiDocs: "https://falcon.crowdstrike.com/documentation",
                authMethod: "OAuth 2.0 Client Credentials",
                baseUrl: "https://api.crowdstrike.com",
                govCloud: "https://api.laggar.gcw.crowdstrike.com",
                endpoints: [
                    {
                        name: "Query Devices",
                        method: "GET",
                        endpoint: "/devices/queries/devices/v1",
                        description: "List all managed endpoints",
                        evidenceType: "Endpoint Inventory"
                    },
                    {
                        name: "Get Prevention Policies",
                        method: "GET",
                        endpoint: "/policy/queries/prevention/v1",
                        description: "Get endpoint protection policies",
                        evidenceType: "Antimalware Configuration"
                    },
                    {
                        name: "Get Detections",
                        method: "GET",
                        endpoint: "/detects/queries/detects/v1",
                        description: "Query threat detections",
                        evidenceType: "Threat Detection Log"
                    }
                ]
            },
            {
                name: "Tenable.io / Nessus",
                category: "Vulnerability Management",
                cmmcControls: ["3.11.2", "3.11.3"],
                apiDocs: "https://developer.tenable.com/reference",
                authMethod: "API Keys (Access Key + Secret Key)",
                baseUrl: "https://cloud.tenable.com",
                endpoints: [
                    {
                        name: "List Scans",
                        method: "GET",
                        endpoint: "/scans",
                        description: "Get vulnerability scan list",
                        evidenceType: "Scan Inventory"
                    },
                    {
                        name: "Export Vulnerabilities",
                        method: "POST",
                        endpoint: "/vulns/export",
                        description: "Export vulnerability findings",
                        evidenceType: "Vulnerability Report"
                    },
                    {
                        name: "Get Assets",
                        method: "GET",
                        endpoint: "/assets",
                        description: "List discovered assets",
                        evidenceType: "Asset Inventory"
                    }
                ]
            },
            {
                name: "Qualys",
                category: "Vulnerability Management",
                cmmcControls: ["3.11.2", "3.11.3", "3.4.1"],
                apiDocs: "https://qualysapi.qualys.com/qps/",
                authMethod: "Basic Auth / OAuth",
                baseUrl: "https://qualysapi.qualys.com",
                govCloud: "https://qualysguard.qg1.apps.qualys.com",
                endpoints: [
                    {
                        name: "Host List Detection",
                        method: "POST",
                        endpoint: "/api/2.0/fo/asset/host/vm/detection/",
                        description: "Get host vulnerability detections",
                        evidenceType: "Vulnerability Findings"
                    },
                    {
                        name: "Policy Compliance",
                        method: "POST",
                        endpoint: "/api/2.0/fo/compliance/posture/info/",
                        description: "Get policy compliance status",
                        evidenceType: "Configuration Compliance"
                    }
                ]
            },
            {
                name: "Splunk",
                category: "SIEM",
                cmmcControls: ["3.3.1", "3.3.5", "3.3.6", "3.14.6"],
                apiDocs: "https://docs.splunk.com/Documentation/Splunk/latest/RESTREF/RESTprolog",
                authMethod: "Token-based / Basic Auth",
                baseUrl: "https://{splunk-host}:8089",
                endpoints: [
                    {
                        name: "Search Jobs",
                        method: "POST",
                        endpoint: "/services/search/jobs",
                        description: "Execute search query",
                        evidenceType: "Log Search Results",
                        samplePayload: `search=search index=main sourcetype=syslog | head 100`
                    },
                    {
                        name: "Get Saved Searches",
                        method: "GET",
                        endpoint: "/services/saved/searches",
                        description: "List correlation rules/saved searches",
                        evidenceType: "Alert Configuration"
                    }
                ]
            },
            {
                name: "KnowBe4",
                category: "Security Awareness Training",
                cmmcControls: ["3.2.1", "3.2.2", "3.2.3"],
                apiDocs: "https://developer.knowbe4.com/",
                authMethod: "API Token",
                baseUrl: "https://us.api.knowbe4.com/v1",
                endpoints: [
                    {
                        name: "Get Training Enrollments",
                        method: "GET",
                        endpoint: "/training/enrollments",
                        description: "Get training completion status",
                        evidenceType: "Training Completion Report"
                    },
                    {
                        name: "Get Phishing Campaigns",
                        method: "GET",
                        endpoint: "/phishing/campaigns",
                        description: "Get phishing simulation results",
                        evidenceType: "Phishing Test Results"
                    },
                    {
                        name: "Get Users",
                        method: "GET",
                        endpoint: "/users",
                        description: "List users and training status",
                        evidenceType: "User Training Status"
                    }
                ]
            },
            {
                name: "1Password Business",
                category: "Password Management",
                cmmcControls: ["3.5.10", "3.5.7"],
                apiDocs: "https://developer.1password.com/docs/connect/",
                authMethod: "Connect Token",
                baseUrl: "https://{tenant}.1password.com/api/v1",
                endpoints: [
                    {
                        name: "List Vaults",
                        method: "GET",
                        endpoint: "/vaults",
                        description: "Get vault inventory",
                        evidenceType: "Password Vault Configuration"
                    },
                    {
                        name: "Get Audit Events",
                        method: "GET",
                        endpoint: "/auditevents",
                        description: "Get password access audit logs",
                        evidenceType: "Password Access Audit"
                    }
                ]
            },
            {
                name: "Okta",
                category: "Identity Provider",
                cmmcControls: ["3.1.1", "3.5.2", "3.5.3"],
                apiDocs: "https://developer.okta.com/docs/reference/",
                authMethod: "API Token / OAuth 2.0",
                baseUrl: "https://{domain}.okta.com/api/v1",
                govCloud: "https://{domain}.okta-gov.com/api/v1",
                endpoints: [
                    {
                        name: "List Users",
                        method: "GET",
                        endpoint: "/users",
                        description: "Get user inventory",
                        evidenceType: "User Account Inventory"
                    },
                    {
                        name: "Get Authentication Policies",
                        method: "GET",
                        endpoint: "/policies?type=ACCESS_POLICY",
                        description: "Get access/MFA policies",
                        evidenceType: "Authentication Policy Configuration"
                    },
                    {
                        name: "Get System Logs",
                        method: "GET",
                        endpoint: "/logs",
                        description: "Get audit log events",
                        evidenceType: "Authentication Audit Log"
                    }
                ]
            },
            {
                name: "ServiceNow",
                category: "ITSM / GRC",
                cmmcControls: ["3.6.1", "3.6.2", "3.12.2"],
                apiDocs: "https://developer.servicenow.com/dev.do#!/reference/api",
                authMethod: "OAuth 2.0 / Basic Auth",
                baseUrl: "https://{instance}.service-now.com/api",
                endpoints: [
                    {
                        name: "Get Incidents",
                        method: "GET",
                        endpoint: "/now/table/incident",
                        description: "Get incident records",
                        evidenceType: "Incident Tracking"
                    },
                    {
                        name: "Get Change Requests",
                        method: "GET",
                        endpoint: "/now/table/change_request",
                        description: "Get change management records",
                        evidenceType: "Change Management Evidence",
                        cmmcControls: ["3.4.3", "3.4.4"]
                    },
                    {
                        name: "Get GRC Controls",
                        method: "GET",
                        endpoint: "/now/table/sn_compliance_control",
                        description: "Get compliance control status",
                        evidenceType: "Compliance Control Status"
                    }
                ]
            }
        ]
    },

    // ==================== API AUTHENTICATION PATTERNS ====================
    authPatterns: {
        title: "Common Authentication Patterns",
        
        patterns: [
            {
                name: "OAuth 2.0 Client Credentials",
                description: "Machine-to-machine authentication for automated collection",
                flow: `1. Register application in identity provider
2. Obtain client_id and client_secret
3. Request access token from token endpoint
4. Use bearer token in Authorization header`,
                securityConsiderations: [
                    "Store client_secret securely (Key Vault, Secrets Manager)",
                    "Use least-privilege scopes",
                    "Rotate secrets regularly",
                    "Log all API access"
                ]
            },
            {
                name: "API Key Authentication",
                description: "Simple key-based authentication",
                flow: `1. Generate API key in platform console
2. Include key in request header (X-API-Key or Authorization)`,
                securityConsiderations: [
                    "Treat API keys as secrets",
                    "Use IP allowlisting where available",
                    "Rotate keys periodically",
                    "Use separate keys per integration"
                ]
            },
            {
                name: "AWS Signature V4",
                description: "AWS request signing for API authentication",
                flow: `1. Configure AWS credentials (access key + secret)
2. AWS SDK signs requests automatically
3. Use IAM roles for enhanced security`,
                securityConsiderations: [
                    "Use IAM roles instead of long-term credentials",
                    "Apply least-privilege IAM policies",
                    "Enable CloudTrail for API auditing"
                ]
            }
        ]
    },

    // ==================== CONTROL-TO-API MAPPING ====================
    controlApiMapping: {
        title: "CMMC Control to API Mapping",
        description: "Quick reference for which APIs can provide evidence for each control",
        
        mappings: {
            "3.1.1": {
                title: "Limit system access to authorized users",
                apis: [
                    { platform: "Microsoft Graph", endpoint: "/v1.0/users" },
                    { platform: "AWS IAM", action: "iam:ListUsers" },
                    { platform: "GCP IAM", endpoint: "projects.getIamPolicy" },
                    { platform: "Okta", endpoint: "/api/v1/users" }
                ]
            },
            "3.5.3": {
                title: "Use multifactor authentication",
                apis: [
                    { platform: "Microsoft Graph", endpoint: "/reports/authenticationMethods/userRegistrationDetails" },
                    { platform: "AWS IAM", action: "iam:ListMFADevices" },
                    { platform: "Okta", endpoint: "/api/v1/policies?type=ACCESS_POLICY" }
                ]
            },
            "3.3.1": {
                title: "Create and retain audit logs",
                apis: [
                    { platform: "Microsoft Graph", endpoint: "/auditLogs/signIns" },
                    { platform: "AWS CloudTrail", action: "cloudtrail:DescribeTrails" },
                    { platform: "GCP Logging", endpoint: "entries.list" },
                    { platform: "Splunk", endpoint: "/services/search/jobs" }
                ]
            },
            "3.11.2": {
                title: "Scan for vulnerabilities",
                apis: [
                    { platform: "Azure Defender", endpoint: "/providers/Microsoft.Security/assessments" },
                    { platform: "AWS Security Hub", action: "securityhub:GetFindings" },
                    { platform: "Tenable.io", endpoint: "/vulns/export" },
                    { platform: "Qualys", endpoint: "/api/2.0/fo/asset/host/vm/detection/" }
                ]
            },
            "3.14.2": {
                title: "Protection from malicious code",
                apis: [
                    { platform: "Microsoft Graph (Defender)", endpoint: "/security/alerts_v2" },
                    { platform: "CrowdStrike", endpoint: "/policy/queries/prevention/v1" }
                ]
            }
        }
    }
};

// Export
if (typeof window !== 'undefined') window.API_EVIDENCE_COLLECTION = API_EVIDENCE_COLLECTION;
if (typeof module !== 'undefined' && module.exports) module.exports = API_EVIDENCE_COLLECTION;
