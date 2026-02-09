// MSP Automation Platforms & Tools - Comprehensive Guide
// For CMMC Level 2/FedRAMP Moderate MSP Operations

const MSP_AUTOMATION_PLATFORMS = {
    version: "1.0.0",
    lastUpdated: "2025-01-27",

    // ==================== REMOTE MANAGEMENT PLATFORMS ====================
    remoteManagement: {
        title: "Remote Management & Monitoring (RMM) Platforms",
        description: "FedRAMP-authorized RMM solutions for managing client endpoints securely",
        
        platforms: [
            {
                name: "ConnectWise Automate (ScreenConnect)",
                fedrampStatus: "FedRAMP Authorized (Moderate)",
                url: "https://www.connectwise.com/platform/unified-management/automate",
                encryptionMethod: "TLS 1.2/1.3, AES-256 at rest",
                features: [
                    "Agentless and agent-based remote access",
                    "Automated patch management",
                    "Script execution and automation",
                    "Asset inventory and discovery",
                    "Session recording for audit compliance"
                ],
                cmmcAlignment: ["3.4.1", "3.4.2", "3.7.1", "3.7.2", "3.7.5"],
                msspIntegration: {
                    multiTenant: true,
                    rbac: "Role-based access per client",
                    auditLogging: "Full session and action logging",
                    siemIntegration: ["Sentinel", "Splunk", "Chronicle"]
                },
                bestPractices: [
                    "Enable MFA for all technician accounts",
                    "Configure session timeouts (15 min idle)",
                    "Enable session recording for privileged access",
                    "Use dedicated service accounts per client",
                    "Restrict access to US-based data centers only"
                ]
            },
            {
                name: "Datto RMM",
                fedrampStatus: "FedRAMP In Process",
                url: "https://www.datto.com/products/rmm",
                encryptionMethod: "TLS 1.2+, AES-256",
                features: [
                    "Cloud-native architecture",
                    "Automated remediation workflows",
                    "Integrated backup monitoring",
                    "Ransomware detection",
                    "Network discovery"
                ],
                cmmcAlignment: ["3.4.1", "3.4.2", "3.14.2", "3.14.4"]
            },
            {
                name: "NinjaOne (NinjaRMM)",
                fedrampStatus: "SOC 2 Type II (FedRAMP pending)",
                url: "https://www.ninjaone.com/",
                encryptionMethod: "TLS 1.2+, AES-256",
                features: [
                    "Unified endpoint management",
                    "Cross-platform support (Windows, Mac, Linux)",
                    "Automated patching",
                    "Remote access with MFA",
                    "Ticketing integration"
                ],
                cmmcAlignment: ["3.4.1", "3.4.2", "3.7.1"]
            }
        ],

        securityRequirements: {
            title: "RMM Security Requirements for CMMC",
            requirements: [
                {
                    control: "3.7.5",
                    requirement: "Require MFA for nonlocal maintenance sessions",
                    implementation: "Enable MFA on all RMM admin and technician accounts"
                },
                {
                    control: "3.3.1",
                    requirement: "Create audit logs of maintenance activities",
                    implementation: "Enable full session recording and export logs to SIEM"
                },
                {
                    control: "3.13.8",
                    requirement: "Encrypt maintenance sessions",
                    implementation: "Verify TLS 1.2+ for all RMM communications"
                }
            ]
        }
    },

    // ==================== PASSWORD MANAGEMENT PLATFORMS ====================
    passwordManagement: {
        title: "Enterprise Password Management for MSPs",
        description: "Centralized credential management with automated rotation and privileged access",
        
        platforms: [
            {
                name: "Delinea Secret Server",
                fedrampStatus: "FedRAMP High Authorized",
                url: "https://delinea.com/products/secret-server",
                govCloudUrl: "https://delinea.com/solutions/government",
                features: [
                    "Privileged access management (PAM)",
                    "Automated password rotation",
                    "Session recording and monitoring",
                    "Just-in-time access provisioning",
                    "Discovery of privileged accounts",
                    "Multi-tenant architecture for MSPs"
                ],
                autoRotation: {
                    supported: true,
                    frequency: "Configurable (30/60/90 days)",
                    targets: ["Active Directory", "Local Admin", "SQL Server", "SSH Keys", "Cloud Service Principals"],
                    workflow: `// Secret Server PowerShell - Rotate All Expired Secrets
$secrets = Get-TssSecret -TssSession $session -FolderId 42
foreach ($secret in $secrets) {
    if ($secret.IsExpired) {
        Set-TssSecret -TssSession $session -Id $secret.Id -AutoChangeEnabled $true
        Start-TssSecretChangePassword -TssSession $session -Id $secret.Id
    }
}`
                },
                cmmcAlignment: ["3.5.2", "3.5.4", "3.5.7", "3.5.10", "3.5.11"],
                msspFeatures: [
                    "Separate folders/vaults per client",
                    "Client-specific access policies",
                    "Delegated administration",
                    "Cross-client reporting"
                ]
            },
            {
                name: "CyberArk Privileged Access Manager",
                fedrampStatus: "FedRAMP High Authorized",
                url: "https://www.cyberark.com/products/privileged-access-manager/",
                govUrl: "https://www.cyberark.com/solutions/government/",
                features: [
                    "Enterprise-grade PAM",
                    "Vault technology for credential storage",
                    "Session isolation and recording",
                    "Threat analytics",
                    "Application identity management"
                ],
                autoRotation: {
                    supported: true,
                    frequency: "Policy-based (immediate to 365 days)",
                    targets: ["Windows", "Unix", "Database", "Cloud", "Network Devices", "Applications"]
                },
                cmmcAlignment: ["3.5.2", "3.5.4", "3.5.10", "3.5.11", "3.7.5"]
            },
            {
                name: "1Password Business (with SCIM)",
                fedrampStatus: "SOC 2 Type II",
                url: "https://1password.com/business/",
                features: [
                    "Team password management",
                    "SSO integration (SAML/OIDC)",
                    "SCIM provisioning",
                    "Watchtower security alerts",
                    "Travel mode for border crossings"
                ],
                cmmcAlignment: ["3.5.2", "3.5.10"],
                note: "Good for end-user passwords, not service accounts"
            },
            {
                name: "Keeper Security",
                fedrampStatus: "FedRAMP Authorized (Moderate)",
                url: "https://www.keepersecurity.com/",
                govUrl: "https://www.keepersecurity.com/government.html",
                features: [
                    "Zero-knowledge encryption",
                    "Secrets Manager for DevOps",
                    "Connection Manager for RDP/SSH",
                    "BreachWatch dark web monitoring",
                    "SCIM and SSO integration"
                ],
                autoRotation: {
                    supported: true,
                    frequency: "Configurable",
                    targets: ["Active Directory", "AWS", "Azure", "Database"]
                },
                cmmcAlignment: ["3.5.2", "3.5.4", "3.5.10"]
            }
        ],

        serviceAccountAutomation: {
            title: "Service Account & Service Principal Automation",
            description: "Automated management of non-human identities across cloud platforms",
            
            azureServicePrincipals: {
                title: "Azure/Entra ID Service Principal Management",
                consoleUrl: "https://portal.azure.us/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps",
                automation: {
                    createServicePrincipal: `# Create Service Principal with Certificate
$cert = New-SelfSignedCertificate -Subject "CN=CMMC-Automation-SP" \\
    -CertStoreLocation "Cert:\\CurrentUser\\My" \\
    -KeyExportPolicy Exportable \\
    -KeySpec Signature \\
    -KeyLength 2048 \\
    -NotAfter (Get-Date).AddYears(2)

$sp = New-AzADServicePrincipal -DisplayName "CMMC-Client-Automation" \\
    -CertValue ([Convert]::ToBase64String($cert.RawData))

# Assign minimum required role
New-AzRoleAssignment -ObjectId $sp.Id \\
    -RoleDefinitionName "Contributor" \\
    -Scope "/subscriptions/$subscriptionId/resourceGroups/$rgName"`,
                    
                    rotateCredentials: `# Rotate Service Principal Certificate
$spId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
$sp = Get-AzADServicePrincipal -ObjectId $spId

# Create new certificate
$newCert = New-SelfSignedCertificate -Subject "CN=CMMC-Automation-SP-$(Get-Date -Format 'yyyyMMdd')" \\
    -CertStoreLocation "Cert:\\CurrentUser\\My" \\
    -KeyExportPolicy Exportable \\
    -NotAfter (Get-Date).AddYears(1)

# Add new credential (overlap period for zero-downtime rotation)
$keyCredential = New-AzADSpCredential -ObjectId $sp.Id \\
    -CertValue ([Convert]::ToBase64String($newCert.RawData))

# After updating applications, remove old credential
$oldCreds = Get-AzADSpCredential -ObjectId $sp.Id | Where-Object { $_.EndDateTime -lt (Get-Date).AddDays(30) }
foreach ($cred in $oldCreds) {
    Remove-AzADSpCredential -ObjectId $sp.Id -KeyId $cred.KeyId
}`,
                    
                    auditServicePrincipals: `# Audit Service Principal Usage and Expiring Credentials
$servicePrincipals = Get-AzADServicePrincipal -All

$report = foreach ($sp in $servicePrincipals) {
    $creds = Get-AzADSpCredential -ObjectId $sp.Id
    foreach ($cred in $creds) {
        [PSCustomObject]@{
            DisplayName = $sp.DisplayName
            AppId = $sp.AppId
            CredentialType = $cred.Type
            StartDate = $cred.StartDateTime
            EndDate = $cred.EndDateTime
            DaysUntilExpiry = ($cred.EndDateTime - (Get-Date)).Days
            Status = if (($cred.EndDateTime - (Get-Date)).Days -lt 30) { "EXPIRING SOON" } 
                     elseif (($cred.EndDateTime - (Get-Date)).Days -lt 0) { "EXPIRED" } 
                     else { "OK" }
        }
    }
}

$report | Where-Object { $_.Status -ne "OK" } | Export-Csv "SP-Credential-Audit.csv"`
                },
                bestPractices: [
                    "Use certificates instead of client secrets when possible",
                    "Implement credential expiration alerts (30/60/90 days)",
                    "Use managed identities for Azure resources",
                    "Apply least privilege role assignments",
                    "Enable service principal sign-in logs in Entra ID"
                ]
            },
            
            awsServiceAccounts: {
                title: "AWS IAM Role & Access Key Management",
                consoleUrl: "https://console.amazonaws-us-gov.com/iamv2/home",
                automation: {
                    rotateAccessKeys: `#!/bin/bash
# Rotate IAM Access Keys for Service Accounts
SERVICE_USER="cmmc-automation-svc"

# Create new access key
NEW_KEY=$(aws iam create-access-key --user-name $SERVICE_USER --output json)
NEW_ACCESS_KEY=$(echo $NEW_KEY | jq -r '.AccessKey.AccessKeyId')
NEW_SECRET_KEY=$(echo $NEW_KEY | jq -r '.AccessKey.SecretAccessKey')

# Store in Secrets Manager
aws secretsmanager update-secret \\
    --secret-id "service/$SERVICE_USER/credentials" \\
    --secret-string "{\\"AccessKeyId\\":\\"$NEW_ACCESS_KEY\\",\\"SecretAccessKey\\":\\"$NEW_SECRET_KEY\\"}"

# Wait for propagation
sleep 30

# List old keys and delete (keep only newest)
OLD_KEYS=$(aws iam list-access-keys --user-name $SERVICE_USER \\
    --query "AccessKeyMetadata[?AccessKeyId!=\\\`$NEW_ACCESS_KEY\\\`].AccessKeyId" --output text)

for KEY in $OLD_KEYS; do
    aws iam update-access-key --user-name $SERVICE_USER --access-key-id $KEY --status Inactive
    aws iam delete-access-key --user-name $SERVICE_USER --access-key-id $KEY
done

echo "Rotated keys for $SERVICE_USER - New key: $NEW_ACCESS_KEY"`,

                    auditAccessKeys: `#!/bin/bash
# Audit all IAM users for access key age
echo "User,AccessKeyId,CreateDate,Age(Days),Status" > iam-key-audit.csv

for USER in $(aws iam list-users --query 'Users[*].UserName' --output text); do
    KEYS=$(aws iam list-access-keys --user-name $USER --output json)
    echo $KEYS | jq -r ".AccessKeyMetadata[] | \\"$USER,\\(.AccessKeyId),\\(.CreateDate),\\((now - (\\(.CreateDate) | fromdateiso8601)) / 86400 | floor),\\(.Status)\\"" >> iam-key-audit.csv
done

# Flag keys older than 90 days
awk -F',' 'NR>1 && $4>90 {print "WARNING: " $1 " has key " $2 " aged " $4 " days"}' iam-key-audit.csv`
                },
                bestPractices: [
                    "Prefer IAM roles with temporary credentials over long-term access keys",
                    "Rotate access keys every 90 days maximum",
                    "Use AWS Secrets Manager for credential storage and rotation",
                    "Enable IAM Access Analyzer to detect overly permissive policies",
                    "Tag service accounts with owner, purpose, and rotation schedule"
                ]
            },
            
            gcpServiceAccounts: {
                title: "GCP Service Account Key Management",
                consoleUrl: "https://console.cloud.google.com/iam-admin/serviceaccounts",
                automation: {
                    rotateKeys: `#!/bin/bash
# Rotate GCP Service Account Keys
SA_EMAIL="cmmc-automation@PROJECT_ID.iam.gserviceaccount.com"
PROJECT_ID="your-project-id"

# Create new key
gcloud iam service-accounts keys create new-key.json \\
    --iam-account=$SA_EMAIL

# Upload to Secret Manager
gcloud secrets versions add sa-credentials \\
    --data-file=new-key.json

# List and delete old keys (keep last 2)
KEYS=$(gcloud iam service-accounts keys list \\
    --iam-account=$SA_EMAIL \\
    --format="value(name)" | tail -n +3)

for KEY in $KEYS; do
    gcloud iam service-accounts keys delete $KEY \\
        --iam-account=$SA_EMAIL --quiet
done

rm new-key.json
echo "Key rotation complete for $SA_EMAIL"`
                },
                bestPractices: [
                    "Use Workload Identity Federation instead of service account keys",
                    "Set organization policy to disable service account key creation where possible",
                    "Rotate service account keys every 90 days",
                    "Use Cloud KMS for key encryption",
                    "Enable service account key insights"
                ]
            }
        }
    },

    // ==================== WORKFLOW AUTOMATION PLATFORMS ====================
    workflowAutomation: {
        title: "Workflow Automation & Orchestration Platforms",
        description: "Platforms for automating MSP operations, compliance workflows, and incident response",
        
        platforms: [
            {
                name: "Microsoft Power Automate (GCC High)",
                fedrampStatus: "FedRAMP High (GCC High)",
                url: "https://flow.microsoft.us",
                docsUrl: "https://learn.microsoft.com/en-us/power-automate/",
                useCases: [
                    "Automated user onboarding/offboarding",
                    "Compliance evidence collection",
                    "Security alert triage",
                    "Access review notifications",
                    "Scheduled compliance reports"
                ],
                exampleFlows: {
                    userOffboarding: `// Power Automate - User Offboarding Workflow
{
  "trigger": {
    "type": "When HR system marks employee terminated",
    "connector": "Dataverse"
  },
  "actions": [
    {
      "step": 1,
      "action": "Disable user account in Entra ID",
      "connector": "Entra ID"
    },
    {
      "step": 2,
      "action": "Revoke all active sessions",
      "connector": "Microsoft Graph"
    },
    {
      "step": 3,
      "action": "Remove from all security groups",
      "connector": "Entra ID"
    },
    {
      "step": 4,
      "action": "Initiate mailbox hold for legal",
      "connector": "Exchange Online"
    },
    {
      "step": 5,
      "action": "Create ServiceNow ticket for equipment return",
      "connector": "ServiceNow"
    },
    {
      "step": 6,
      "action": "Log action to compliance audit trail",
      "connector": "SharePoint"
    }
  ]
}`,
                    accessReview: `// Quarterly Access Review Automation
{
  "trigger": {
    "type": "Recurrence",
    "frequency": "Quarter"
  },
  "actions": [
    {
      "action": "Get all users with privileged roles",
      "connector": "Entra ID PIM"
    },
    {
      "action": "For each user, send review request to manager",
      "connector": "Outlook"
    },
    {
      "action": "Wait 14 days for responses",
      "connector": "Delay"
    },
    {
      "action": "If no response, escalate to Security team",
      "connector": "Teams"
    },
    {
      "action": "Generate access review report",
      "connector": "Word Online"
    },
    {
      "action": "Store report in compliance evidence library",
      "connector": "SharePoint"
    }
  ]
}`
                },
                cmmcAlignment: ["3.1.7", "3.2.1", "3.2.2", "3.9.2"]
            },
            {
                name: "Tines (Security Automation)",
                fedrampStatus: "SOC 2 Type II",
                url: "https://www.tines.com/",
                useCases: [
                    "Security incident response automation",
                    "Threat intelligence enrichment",
                    "Phishing response workflows",
                    "Vulnerability management",
                    "Compliance evidence gathering"
                ],
                cmmcAlignment: ["3.6.1", "3.6.2", "3.14.6"]
            },
            {
                name: "Torq (Security Hyperautomation)",
                fedrampStatus: "SOC 2 Type II, ISO 27001",
                url: "https://torq.io/",
                useCases: [
                    "No-code security automation",
                    "Cross-platform orchestration",
                    "AI-assisted workflow building",
                    "Pre-built security templates"
                ]
            },
            {
                name: "Azure Logic Apps (GCC High)",
                fedrampStatus: "FedRAMP High (GCC High)",
                url: "https://portal.azure.us/#create/Microsoft.LogicApp",
                useCases: [
                    "System integration automation",
                    "B2B workflows",
                    "Data transformation",
                    "Scheduled tasks"
                ]
            }
        ],

        mspAutomationScenarios: {
            title: "Common MSP Automation Scenarios for CMMC",
            scenarios: [
                {
                    name: "Automated Evidence Collection",
                    description: "Scheduled collection of compliance evidence from client environments",
                    schedule: "Daily/Weekly/Monthly based on control",
                    outputs: [
                        "User access reports",
                        "Configuration baselines",
                        "Security scan results",
                        "Audit log exports",
                        "Policy compliance screenshots"
                    ],
                    tools: ["Power Automate", "Azure Automation", "AWS Systems Manager"]
                },
                {
                    name: "Continuous Compliance Monitoring",
                    description: "Real-time monitoring of control effectiveness",
                    alerts: [
                        "Non-compliant configurations detected",
                        "Privileged access without MFA",
                        "Disabled security controls",
                        "Policy violations",
                        "Expiring credentials"
                    ],
                    tools: ["Defender for Cloud", "AWS Security Hub", "GCP SCC"]
                },
                {
                    name: "Incident Response Automation",
                    description: "Automated initial response to security incidents",
                    actions: [
                        "Isolate compromised endpoint",
                        "Disable compromised user account",
                        "Collect forensic data",
                        "Notify incident response team",
                        "Create incident ticket",
                        "Preserve evidence"
                    ],
                    tools: ["Sentinel Playbooks", "Splunk SOAR", "Tines"]
                }
            ]
        }
    },

    // ==================== MDM PLATFORMS ====================
    mdmPlatforms: {
        title: "Mobile Device Management (MDM) / Unified Endpoint Management (UEM)",
        description: "FedRAMP-authorized platforms for managing endpoints and enforcing security policies",
        
        platforms: [
            {
                name: "Microsoft Intune (GCC High)",
                fedrampStatus: "FedRAMP High",
                consoleUrl: "https://intune.microsoft.us",
                docsUrl: "https://learn.microsoft.com/en-us/mem/intune/",
                supportedPlatforms: ["Windows 10/11", "macOS", "iOS/iPadOS", "Android"],
                features: [
                    "Device enrollment and compliance",
                    "Application management (MAM)",
                    "Conditional Access integration",
                    "Configuration profiles",
                    "Endpoint security policies",
                    "Windows Autopilot",
                    "Remote wipe and lock"
                ],
                cmmcPolicies: {
                    title: "CMMC-Required Intune Policies",
                    policies: [
                        {
                            control: "3.1.1",
                            policy: "Require compliant device for access",
                            configuration: "Conditional Access: Require device to be marked as compliant"
                        },
                        {
                            control: "3.1.19",
                            policy: "Encrypt CUI on mobile devices",
                            configuration: "Device Compliance: Require encryption of data storage on device"
                        },
                        {
                            control: "3.5.3",
                            policy: "MFA for device enrollment",
                            configuration: "Enrollment restrictions with MFA requirement"
                        },
                        {
                            control: "3.8.1",
                            policy: "Protect CUI on media",
                            configuration: "App protection policies: Block copy/paste to unmanaged apps"
                        },
                        {
                            control: "3.13.11",
                            policy: "FIPS-validated cryptography",
                            configuration: "Enable BitLocker with XTS-AES 256"
                        }
                    ]
                },
                compliancePolicyTemplate: `// Intune Device Compliance Policy for CMMC
{
  "@odata.type": "#microsoft.graph.windows10CompliancePolicy",
  "displayName": "CMMC-Level2-Windows-Compliance",
  "description": "Compliance policy for CMMC Level 2 Windows devices",
  "passwordRequired": true,
  "passwordMinimumLength": 14,
  "passwordRequiredType": "alphanumeric",
  "passwordMinutesOfInactivityBeforeLock": 15,
  "passwordExpirationDays": 60,
  "passwordPreviousPasswordBlockCount": 24,
  "passwordRequireWhenResumeFromIdleState": true,
  "osMinimumVersion": "10.0.19044.0",
  "storageRequireEncryption": true,
  "secureBootEnabled": true,
  "bitLockerEnabled": true,
  "defenderEnabled": true,
  "defenderVersion": null,
  "signatureOutOfDate": true,
  "rtpEnabled": true,
  "antivirusRequired": true,
  "antiSpywareRequired": true,
  "codeIntegrityEnabled": true,
  "tpmRequired": true
}`
            },
            {
                name: "VMware Workspace ONE",
                fedrampStatus: "FedRAMP Moderate",
                url: "https://www.vmware.com/products/workspace-one.html",
                supportedPlatforms: ["Windows", "macOS", "iOS", "Android", "ChromeOS", "Linux"],
                features: [
                    "Unified endpoint management",
                    "Digital workspace platform",
                    "Intelligence (analytics)",
                    "Tunnel (per-app VPN)",
                    "Access (SSO/MFA)"
                ],
                cmmcAlignment: ["3.1.1", "3.1.2", "3.5.3", "3.8.1"]
            },
            {
                name: "Jamf Pro",
                fedrampStatus: "FedRAMP Authorized (Moderate)",
                url: "https://www.jamf.com/products/jamf-pro/",
                supportedPlatforms: ["macOS", "iOS", "iPadOS", "tvOS"],
                features: [
                    "Apple device management",
                    "Zero-touch deployment",
                    "App catalog",
                    "Security compliance",
                    "Self Service portal"
                ],
                cmmcAlignment: ["3.1.1", "3.4.1", "3.4.2", "3.8.1"]
            }
        ]
    },

    // ==================== MDM SOLUTIONS ====================
    mdmSolutions: {
        title: "Mobile Device Management (MDM) Solutions",
        description: "Enterprise MDM platforms for managing and securing mobile devices, enforcing compliance policies, and protecting CUI on endpoints",

        platforms: [
            {
                name: "Microsoft Intune (GCC High)",
                fedrampStatus: "FedRAMP Authorized (High)",
                url: "https://learn.microsoft.com/en-us/mem/intune/",
                supportedPlatforms: ["Windows", "macOS", "iOS", "Android"],
                encryptionMethod: "BitLocker (Windows), FileVault (macOS), device-level encryption (mobile)",
                features: [
                    "Conditional Access integration with Entra ID",
                    "Compliance policies with automated remediation",
                    "App protection policies (MAM without enrollment)",
                    "Configuration profiles for security baselines",
                    "Windows Autopilot zero-touch deployment",
                    "Endpoint Privilege Management",
                    "Remote wipe and selective wipe",
                    "Certificate-based authentication via SCEP/PKCS"
                ],
                bestPractices: [
                    "Deploy CMMC security baseline configuration profiles",
                    "Require device compliance for Conditional Access",
                    "Enable BitLocker/FileVault with key escrow to Entra ID",
                    "Block personal devices from accessing CUI via MAM policies",
                    "Use Windows Autopilot for consistent, secure provisioning"
                ],
                cmmcAlignment: ["3.1.1", "3.1.2", "3.1.18", "3.1.19", "3.4.1", "3.4.2", "3.4.6", "3.8.1", "3.13.11"]
            },
            {
                name: "VMware Workspace ONE UEM",
                fedrampStatus: "FedRAMP Authorized (Moderate)",
                url: "https://www.omnissa.com/platform/workspace-one/",
                supportedPlatforms: ["Windows", "macOS", "iOS", "Android", "ChromeOS", "Linux"],
                encryptionMethod: "Platform-native encryption enforcement",
                features: [
                    "Unified endpoint management across all platforms",
                    "Intelligence-driven automation and analytics",
                    "Tunnel VPN for per-app secure access",
                    "Content Locker for secure document distribution",
                    "Freestyle Orchestrator for workflow automation",
                    "Sensors and scripts for custom compliance checks"
                ],
                bestPractices: [
                    "Use compliance policies to enforce encryption and passcode",
                    "Deploy per-app VPN tunnels for CUI applications",
                    "Leverage Content Locker for secure CUI document access",
                    "Configure automated compliance escalation actions"
                ],
                cmmcAlignment: ["3.1.1", "3.1.2", "3.1.18", "3.4.1", "3.4.2", "3.8.1"]
            },
            {
                name: "Jamf Pro",
                fedrampStatus: "FedRAMP Authorized (Moderate)",
                url: "https://www.jamf.com/products/jamf-pro/",
                supportedPlatforms: ["macOS", "iOS", "iPadOS", "tvOS"],
                encryptionMethod: "FileVault 2 (macOS), device-level (iOS)",
                features: [
                    "Apple-native device management",
                    "Zero-touch deployment via Apple Business Manager",
                    "Smart Groups for dynamic device targeting",
                    "Jamf Protect for endpoint security",
                    "Self Service app catalog",
                    "Declarative Device Management (DDM)",
                    "Compliance Reporter for CIS/STIG benchmarks"
                ],
                bestPractices: [
                    "Enforce FileVault with institutional recovery key escrow",
                    "Use Jamf Protect + Jamf Pro for unified Apple security",
                    "Deploy CIS macOS benchmarks via configuration profiles",
                    "Restrict App Store and sideloading on managed devices"
                ],
                cmmcAlignment: ["3.1.1", "3.4.1", "3.4.2", "3.4.6", "3.8.1", "3.13.11"]
            },
            {
                name: "Ivanti Neurons for MDM (MobileIron)",
                fedrampStatus: "FedRAMP Authorized (Moderate)",
                url: "https://www.ivanti.com/products/mobileiron",
                supportedPlatforms: ["Windows", "macOS", "iOS", "Android"],
                encryptionMethod: "Platform-native + Ivanti Docs@Work encryption",
                features: [
                    "Zero Sign-On with certificate-based auth",
                    "Threat Defense integration for mobile threat detection",
                    "AppConnect containerization for managed apps",
                    "Sentry gateway for secure email/app access",
                    "Compliance and privacy engine"
                ],
                bestPractices: [
                    "Deploy AppConnect containers for CUI-handling apps",
                    "Use Sentry as gateway to block non-compliant devices",
                    "Enable Threat Defense for real-time mobile threat detection"
                ],
                cmmcAlignment: ["3.1.1", "3.1.2", "3.1.18", "3.4.1", "3.8.1", "3.14.2"]
            },
            {
                name: "BlackBerry UEM",
                fedrampStatus: "FedRAMP Authorized (High)",
                url: "https://www.blackberry.com/us/en/products/blackberry-uem",
                supportedPlatforms: ["Windows", "macOS", "iOS", "Android"],
                encryptionMethod: "FIPS 140-2 validated encryption (BlackBerry Dynamics)",
                features: [
                    "FIPS 140-2 validated secure container",
                    "BlackBerry Dynamics SDK for app containerization",
                    "CylancePROTECT AI-driven endpoint protection",
                    "Secure communication (BBM Enterprise)",
                    "Multi-OS management from single console",
                    "DoD-approved for classified environments"
                ],
                bestPractices: [
                    "Use BlackBerry Dynamics containers for CUI apps",
                    "Deploy CylancePROTECT for AI-based threat prevention",
                    "Leverage FIPS-validated crypto for all data at rest/in transit",
                    "Ideal for organizations requiring highest security posture"
                ],
                cmmcAlignment: ["3.1.1", "3.1.2", "3.1.18", "3.1.19", "3.4.1", "3.8.1", "3.13.8", "3.13.11"]
            }
        ]
    }
};

// Export
if (typeof window !== 'undefined') window.MSP_AUTOMATION_PLATFORMS = MSP_AUTOMATION_PLATFORMS;
if (typeof module !== 'undefined' && module.exports) module.exports = MSP_AUTOMATION_PLATFORMS;
