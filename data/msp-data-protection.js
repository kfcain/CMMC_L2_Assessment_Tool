// MSP Data Protection Guidance
// Microsoft Purview, Sensitivity Labels, DLP, and Federal Data Identification

const MSP_DATA_PROTECTION = {
    version: "1.0.0",
    lastUpdated: "2025-01-27",

    // ==================== MICROSOFT PURVIEW CONFIGURATION ====================
    purview: {
        title: "Microsoft Purview Information Protection",
        portalUrl: "https://compliance.microsoft.us",
        gcchighUrl: "https://compliance.microsoft.us",
        
        overview: {
            description: "Microsoft Purview provides unified data governance, information protection, and compliance management for identifying, classifying, and protecting CUI and other sensitive data.",
            cmmcAlignment: ["3.1.3", "3.8.1", "3.8.2", "3.8.4", "3.13.4"],
            fedrampStatus: "FedRAMP High (GCC High)"
        },

        // Sensitivity Labels Configuration
        sensitivityLabels: {
            title: "Sensitivity Label Hierarchy for CMMC",
            description: "Recommended label taxonomy for defense contractors",
            
            labelHierarchy: [
                {
                    name: "Public",
                    displayName: "Public",
                    priority: 0,
                    color: "#00AA00",
                    tooltip: "Information approved for public release",
                    settings: {
                        encryption: false,
                        contentMarking: false,
                        protectionActions: "None"
                    }
                },
                {
                    name: "Internal",
                    displayName: "Internal Use Only",
                    priority: 1,
                    color: "#0078D4",
                    tooltip: "Business information not for external sharing",
                    settings: {
                        encryption: false,
                        contentMarking: {
                            header: "INTERNAL USE ONLY",
                            footer: "© Company Confidential"
                        },
                        protectionActions: "Warn on external share"
                    }
                },
                {
                    name: "Confidential",
                    displayName: "Confidential",
                    priority: 2,
                    color: "#FFB900",
                    tooltip: "Sensitive business information",
                    sublabels: [
                        {
                            name: "Confidential-AllEmployees",
                            displayName: "All Employees",
                            settings: {
                                encryption: true,
                                permissions: "Co-Author for authenticated users in org"
                            }
                        },
                        {
                            name: "Confidential-Recipients",
                            displayName: "Recipients Only",
                            settings: {
                                encryption: true,
                                permissions: "View only for specified recipients"
                            }
                        }
                    ]
                },
                {
                    name: "CUI",
                    displayName: "CUI - Controlled Unclassified Information",
                    priority: 3,
                    color: "#D83B01",
                    tooltip: "Controlled Unclassified Information per 32 CFR Part 2002",
                    sublabels: [
                        {
                            name: "CUI-Basic",
                            displayName: "CUI // SP-BASIC",
                            settings: {
                                encryption: true,
                                contentMarking: {
                                    header: "CUI // SP-BASIC",
                                    footer: "Controlled by: [Organization] | CUI Category: [Category] | POC: [Contact]",
                                    watermark: "CUI"
                                },
                                permissions: "Co-Author for CUI-authorized users",
                                dlpPolicy: "Block external sharing",
                                auditLogging: true
                            }
                        },
                        {
                            name: "CUI-Specified",
                            displayName: "CUI // SP-SPECIFIED",
                            settings: {
                                encryption: true,
                                contentMarking: {
                                    header: "CUI // SP-[CATEGORY]",
                                    footer: "Controlled by: [Organization] | Dissemination: [LIMITED/NOFORN] | POC: [Contact]",
                                    watermark: "CUI // SPECIFIED"
                                },
                                permissions: "View only for specified recipients",
                                dlpPolicy: "Block all external sharing",
                                auditLogging: true
                            }
                        },
                        {
                            name: "CUI-ITAR",
                            displayName: "CUI // ITAR",
                            settings: {
                                encryption: true,
                                contentMarking: {
                                    header: "CUI // ITAR - EXPORT CONTROLLED",
                                    footer: "WARNING: This document contains technical data controlled under ITAR (22 CFR 120-130). Export to foreign persons requires prior authorization from the U.S. Department of State.",
                                    watermark: "ITAR CONTROLLED"
                                },
                                permissions: "US Persons only",
                                dlpPolicy: "Block all external + geo-restriction",
                                auditLogging: true
                            }
                        },
                        {
                            name: "CUI-EAR",
                            displayName: "CUI // EAR",
                            settings: {
                                encryption: true,
                                contentMarking: {
                                    header: "CUI // EAR - EXPORT CONTROLLED",
                                    footer: "This document contains technology controlled under EAR (15 CFR 730-774). ECCN: [NUMBER]",
                                    watermark: "EAR CONTROLLED"
                                },
                                permissions: "Authorized users only",
                                dlpPolicy: "Block external + country restrictions",
                                auditLogging: true
                            }
                        }
                    ]
                }
            ],

            // PowerShell deployment script
            deploymentScript: `# Deploy Sensitivity Labels via PowerShell
# Requires: ExchangeOnlineManagement, AzureAD modules

# Connect to Security & Compliance PowerShell (GCC High)
Connect-IPPSSession -UserPrincipalName admin@tenant.onmicrosoft.us -ConnectionUri https://ps.compliance.protection.office365.us/powershell-liveid/

# Create CUI-Basic Label
New-Label -DisplayName "CUI // SP-BASIC" \`
    -Name "CUI-Basic" \`
    -Tooltip "Apply to Controlled Unclassified Information requiring basic safeguarding" \`
    -Comment "CMMC Level 2 required protection" \`
    -ContentType "File, Email, Site, UnifiedGroup" \`
    -EncryptionEnabled $true \`
    -EncryptionProtectionType "Template" \`
    -EncryptionTemplateId "CUI-Basic-Template" \`
    -ApplyContentMarkingHeaderEnabled $true \`
    -ApplyContentMarkingHeaderText "CUI // SP-BASIC" \`
    -ApplyContentMarkingHeaderAlignment "Center" \`
    -ApplyContentMarkingFooterEnabled $true \`
    -ApplyContentMarkingFooterText "Controlled Unclassified Information" \`
    -ApplyWaterMarkingEnabled $true \`
    -ApplyWaterMarkingText "CUI"

# Create Label Policy
New-LabelPolicy -Name "CUI-Protection-Policy" \`
    -Labels "CUI-Basic","CUI-Specified","CUI-ITAR","CUI-EAR" \`
    -ExchangeLocation "All" \`
    -ModernGroupLocation "All" \`
    -Settings @{
        "mandatory" = "true";
        "requiredowngradejustification" = "true";
        "disablemandatoryinoutlook" = "false"
    }

# Enable Auto-Labeling
Set-Label -Identity "CUI-Basic" \`
    -AutoApplyType "Recommend" \`
    -Conditions @{
        "SensitiveInformationType" = @(
            @{"Name"="U.S. Social Security Number (SSN)"; "MinCount"="1"},
            @{"Name"="CUI-Contract-Number"; "MinCount"="1"}
        )
    }`
        },

        // Sensitive Information Types
        sensitiveInfoTypes: {
            title: "Custom Sensitive Information Types for Federal Data",
            description: "Regex patterns and keyword dictionaries for identifying CUI and federal data",
            
            customTypes: [
                {
                    name: "DoD Contract Number",
                    id: "dod-contract-number",
                    description: "Identifies DoD contract numbers in various formats",
                    patterns: [
                        {
                            regex: "\\b(W|N|F|DAAB|DAAE|DAAH|DAAJ|DAAL|DAAM|DAAS|SPE|SP|HR|HQ)[0-9A-Z]{2,4}-[0-9]{2}-[A-Z]-[0-9]{4}\\b",
                            description: "Standard DoD contract format (e.g., W91CRB-20-C-0045)"
                        },
                        {
                            regex: "\\b(FA|W|N|HDEC|HDTRA|HQ|MDA)[0-9]{4}-[0-9]{2}-[A-Z]-[0-9]{4}\\b",
                            description: "Air Force/Army contract format"
                        }
                    ],
                    keywords: ["contract", "modification", "task order", "delivery order", "CLIN", "CDRL"],
                    confidence: { low: 65, medium: 75, high: 85 }
                },
                {
                    name: "CAGE Code",
                    id: "cage-code",
                    description: "Commercial and Government Entity Code",
                    patterns: [
                        {
                            regex: "\\b[0-9A-Z]{5}\\b",
                            description: "5-character alphanumeric CAGE code"
                        }
                    ],
                    keywords: ["CAGE", "NCAGE", "contractor code", "SAM.gov"],
                    confidence: { low: 50, medium: 70, high: 85 },
                    corroborativeEvidence: ["Keywords within 50 characters"]
                },
                {
                    name: "DFARS Clause Reference",
                    id: "dfars-clause",
                    description: "Defense Federal Acquisition Regulation Supplement clause citations",
                    patterns: [
                        {
                            regex: "\\bDFARS\\s*252\\.[0-9]{3}-[0-9]{4}\\b",
                            description: "DFARS clause format"
                        },
                        {
                            regex: "\\b252\\.[0-9]{3}-[0-9]{4}\\b",
                            description: "DFARS clause without prefix"
                        }
                    ],
                    keywords: ["DFARS", "clause", "contract", "safeguarding", "7012", "7019", "7020", "7021"],
                    confidence: { low: 70, medium: 80, high: 90 }
                },
                {
                    name: "Federal Technical Data",
                    id: "fed-technical-data",
                    description: "Identifies technical data markings and patterns",
                    patterns: [
                        {
                            regex: "\\b(DISTRIBUTION\\s+(STATEMENT\\s+)?[A-F])\\b",
                            description: "Distribution statement markings"
                        },
                        {
                            regex: "\\b(EXPORT\\s+CONTROLLED|ITAR|EAR|ECCN\\s*[0-9][A-Z][0-9]{3})\\b",
                            description: "Export control markings"
                        }
                    ],
                    keywords: ["technical data", "engineering drawing", "specification", "blueprint", "schematic"],
                    confidence: { low: 75, medium: 85, high: 95 }
                },
                {
                    name: "Military Specification",
                    id: "mil-spec",
                    description: "Military specification and standard references",
                    patterns: [
                        {
                            regex: "\\b(MIL-STD|MIL-SPEC|MIL-PRF|MIL-DTL|MIL-HDBK)-[0-9]{1,6}[A-Z]?\\b",
                            description: "Military specification format"
                        }
                    ],
                    keywords: ["specification", "standard", "military", "defense"],
                    confidence: { low: 80, medium: 90, high: 95 }
                },
                {
                    name: "NSN - National Stock Number",
                    id: "nsn-number",
                    description: "National Stock Number for federal logistics",
                    patterns: [
                        {
                            regex: "\\b[0-9]{4}-[0-9]{2}-[0-9]{3}-[0-9]{4}\\b",
                            description: "Standard NSN format"
                        }
                    ],
                    keywords: ["NSN", "stock number", "FSC", "NIIN", "logistics"],
                    confidence: { low: 70, medium: 80, high: 90 }
                },
                {
                    name: "FOUO Legacy Marking",
                    id: "fouo-marking",
                    description: "Legacy For Official Use Only markings (now CUI)",
                    patterns: [
                        {
                            regex: "\\b(FOR\\s+OFFICIAL\\s+USE\\s+ONLY|FOUO|SENSITIVE\\s+BUT\\s+UNCLASSIFIED|SBU)\\b",
                            description: "Legacy FOUO/SBU markings"
                        }
                    ],
                    keywords: ["official use", "FOUO", "sensitive", "government"],
                    confidence: { low: 85, medium: 90, high: 95 }
                },
                {
                    name: "CUI Marking Banner",
                    id: "cui-banner",
                    description: "Controlled Unclassified Information marking banners",
                    patterns: [
                        {
                            regex: "\\bCUI\\s*(\\/\\/)?\\s*(SP-)?(BASIC|SPECIFIED|CTI|EXPT|PRVCY|PROCURE|ITAR|PROPIN|NOFORN)\\b",
                            description: "CUI category markings"
                        },
                        {
                            regex: "\\bCONTROLLED\\s+(BY|UNCLASSIFIED|INFORMATION)\\b",
                            description: "CUI header text"
                        }
                    ],
                    keywords: ["CUI", "controlled", "unclassified", "category", "safeguarding"],
                    confidence: { low: 90, medium: 95, high: 99 }
                },
                {
                    name: "Personally Identifiable Information - Federal",
                    id: "pii-federal",
                    description: "PII patterns common in federal systems",
                    patterns: [
                        {
                            regex: "\\b[0-9]{3}-[0-9]{2}-[0-9]{4}\\b",
                            description: "Social Security Number"
                        },
                        {
                            regex: "\\b[A-Z]{1,2}[0-9]{6,9}\\b",
                            description: "Passport number pattern"
                        },
                        {
                            regex: "\\b[0-9]{10}\\b",
                            description: "DoD ID Number (EDIPI)"
                        }
                    ],
                    keywords: ["SSN", "social security", "date of birth", "DOB", "passport", "EDIPI"],
                    confidence: { low: 75, medium: 85, high: 95 }
                },
                {
                    name: "Security Clearance Information",
                    id: "clearance-info",
                    description: "Security clearance level references",
                    patterns: [
                        {
                            regex: "\\b(SECRET|TOP\\s+SECRET|TS\\/SCI|CONFIDENTIAL|UNCLASSIFIED)\\s*(CLEARANCE|CLEARED)?\\b",
                            description: "Clearance level mentions"
                        }
                    ],
                    keywords: ["clearance", "adjudication", "investigation", "SF-86", "e-QIP", "polygraph"],
                    confidence: { low: 60, medium: 75, high: 85 },
                    note: "High false positive rate - requires corroborating evidence"
                }
            ],

            // PowerShell to create custom SITs
            deploymentScript: `# Create Custom Sensitive Information Types
# Connect to Security & Compliance Center

# Create DoD Contract Number SIT
$contractPattern = @{
    Pattern = '\\b(W|N|F|DAAB|DAAE|DAAH|DAAJ|DAAL|DAAM|DAAS|SPE|SP|HR|HQ)[0-9A-Z]{2,4}-[0-9]{2}-[A-Z]-[0-9]{4}\\b'
    ConfidenceLevel = 'High'
    ProximityGroups = @{
        Keywords = @('contract','modification','task order','CLIN')
        Distance = 50
    }
}

New-DlpSensitiveInformationType \`
    -Name "DoD Contract Number" \`
    -Description "Identifies DoD contract numbers" \`
    -ClassificationRuleSet @($contractPattern) \`
    -Locale "en-us"

# Create CUI Banner Detection SIT
$cuiPattern = @{
    Pattern = '\\bCUI\\s*(\\/\\/)?\\s*(SP-)?(BASIC|SPECIFIED|CTI|EXPT|PRVCY|PROCURE|ITAR|PROPIN|NOFORN)\\b'
    ConfidenceLevel = 'High'
}

New-DlpSensitiveInformationType \`
    -Name "CUI Marking Banner" \`
    -Description "Detects CUI marking banners in documents" \`
    -ClassificationRuleSet @($cuiPattern) \`
    -Locale "en-us"`
        },

        // Data Loss Prevention Policies
        dlpPolicies: {
            title: "DLP Policies for CUI Protection",
            
            policies: [
                {
                    name: "CUI External Sharing Block",
                    description: "Blocks sharing of CUI-labeled content with external recipients",
                    scope: ["Exchange", "SharePoint", "OneDrive", "Teams", "Devices"],
                    conditions: [
                        "Content contains sensitivity label: CUI*",
                        "Content is shared with people outside the organization"
                    ],
                    actions: [
                        "Block access to content",
                        "Send incident report to compliance team",
                        "Generate user notification",
                        "Log to audit"
                    ],
                    cmmcControl: "3.1.3"
                },
                {
                    name: "CUI USB/Removable Media Block",
                    description: "Prevents copying CUI to removable media",
                    scope: ["Devices"],
                    conditions: [
                        "Content contains sensitivity label: CUI*",
                        "Content copied to removable media"
                    ],
                    actions: [
                        "Block the action",
                        "Audit the attempt",
                        "Alert security team"
                    ],
                    cmmcControl: "3.8.7"
                },
                {
                    name: "CUI Print Restriction",
                    description: "Restricts printing of CUI documents",
                    scope: ["Devices"],
                    conditions: [
                        "Content contains sensitivity label: CUI*",
                        "User attempts to print"
                    ],
                    actions: [
                        "Block print to non-approved printers",
                        "Audit all print actions",
                        "Add watermark with user ID and timestamp"
                    ],
                    cmmcControl: "3.8.1"
                },
                {
                    name: "Federal Data Auto-Classification",
                    description: "Auto-applies labels based on content detection",
                    scope: ["Exchange", "SharePoint", "OneDrive"],
                    conditions: [
                        "Content contains: DoD Contract Number",
                        "Content contains: CUI Marking Banner",
                        "Content contains: DFARS Clause Reference"
                    ],
                    actions: [
                        "Recommend sensitivity label: CUI-Basic",
                        "Notify user of recommended classification",
                        "Log detection event"
                    ],
                    cmmcControl: "3.8.4"
                }
            ],

            deploymentScript: `# Create DLP Policy for CUI Protection
New-DlpCompliancePolicy -Name "CUI-External-Sharing-Block" \`
    -Comment "Blocks external sharing of CUI content" \`
    -ExchangeLocation All \`
    -SharePointLocation All \`
    -OneDriveLocation All \`
    -TeamsLocation All \`
    -Mode Enable

# Add DLP Rule
New-DlpComplianceRule -Name "Block CUI External Share" \`
    -Policy "CUI-External-Sharing-Block" \`
    -ContentContainsSensitivityLabels "CUI-Basic","CUI-Specified","CUI-ITAR","CUI-EAR" \`
    -ExceptIfRecipientDomainIs @("approved-partner.com","dod.mil") \`
    -BlockAccess $true \`
    -NotifyUser LastModifier,Owner \`
    -NotifyPolicyTipCustomText "This document contains CUI and cannot be shared externally." \`
    -GenerateIncidentReport SiteAdmin \`
    -IncidentReportContent All \`
    -ReportSeverityLevel High`
        },

        // Auto-Labeling Configuration
        autoLabeling: {
            title: "Automatic Classification Configuration",
            
            trainableClassifiers: [
                {
                    name: "Technical Documentation",
                    description: "Identifies technical manuals, specifications, and engineering documents",
                    trainingRequirements: "50+ positive samples, 50+ negative samples",
                    recommendedLabel: "CUI-Basic"
                },
                {
                    name: "Contract Documents",
                    description: "Identifies government contracts, modifications, and related documents",
                    trainingRequirements: "75+ positive samples",
                    recommendedLabel: "CUI-Basic"
                },
                {
                    name: "Export Controlled Content",
                    description: "Identifies ITAR/EAR controlled technical data",
                    trainingRequirements: "100+ positive samples for accuracy",
                    recommendedLabel: "CUI-ITAR or CUI-EAR"
                }
            ],

            simulationGuidance: {
                steps: [
                    "Create auto-labeling policy in simulation mode",
                    "Run simulation for 7-14 days",
                    "Review matched content and accuracy",
                    "Adjust conditions as needed",
                    "Enable policy in production mode",
                    "Monitor false positive rate"
                ]
            }
        }
    },

    // ==================== AZURE INFORMATION PROTECTION SCANNER ====================
    aipScanner: {
        title: "AIP Scanner for On-Premises Discovery",
        description: "Discover and classify CUI in on-premises file shares",
        
        deployment: {
            prerequisites: [
                "Windows Server 2016/2019/2022",
                "SQL Server 2016+ (Express or Standard)",
                "Entra ID app registration",
                "Service account with file share access"
            ],
            
            installationScript: `# Install AIP Scanner
# Run on scanner server as Administrator

# Install AIP client
Install-Module -Name AzureInformationProtection -Force

# Configure scanner cluster
Install-AIPScanner -SqlServerInstance "sqlserver\\instance" -Cluster "CUIScanner"

# Set authentication
Set-AIPAuthentication -AppId "app-id-guid" -AppSecret "secret" -TenantId "tenant-id"

# Add content scan job
Add-AIPScannerRepository -Path "\\\\fileserver\\share" -OverrideContentScanJob Off

# Configure scan settings
Set-AIPScannerContentScanJob -EnableDlp On -Enforce On

# Start discovery scan
Start-AIPScan -Discover`,

            contentScanJobSettings: {
                schedule: "Continuous or Weekly",
                infoTypes: ["All configured SITs", "Custom CUI patterns"],
                labelPolicy: "Apply recommended label or Enforce label",
                reportingOnly: "Start with reporting to baseline",
                exclusions: ["*.tmp", "*.log", "~$*"]
            }
        }
    },

    // ==================== ENDPOINT DLP ====================
    endpointDlp: {
        title: "Microsoft Endpoint DLP",
        description: "Protect CUI on endpoints (Windows 10/11, macOS)",
        
        capabilities: [
            "Monitor/block copy to USB",
            "Monitor/block copy to network shares",
            "Monitor/block copy to cloud services",
            "Monitor/block printing",
            "Monitor/block clipboard",
            "Browser upload restrictions"
        ],

        deployment: {
            prerequisites: [
                "Windows 10 1809+ or Windows 11",
                "macOS 11.0+ (Big Sur)",
                "Defender for Endpoint P2 or Microsoft 365 E5",
                "Devices onboarded to Defender for Endpoint"
            ],

            intunePolicy: `// Intune Endpoint DLP Configuration Profile
{
    "@odata.type": "#microsoft.graph.windows10EndpointProtectionConfiguration",
    "displayName": "CUI Endpoint DLP Policy",
    "dataProtection": {
        "enterpriseProtectedDomainNames": ["company.com", "*.company.us"],
        "cloudResources": [
            {
                "ipAddressOrFQDN": "*.sharepoint.us",
                "proxy": ""
            }
        ],
        "enterpriseIPRangesAreAuthoritative": true,
        "enterpriseNetworkDomainNames": ["corp.company.com"]
    },
    "deviceManagement": {
        "removableStorageAccess": "blocked"
    }
}`
        },

        monitoredActivities: [
            { activity: "Copy to clipboard", action: "Audit/Block for CUI" },
            { activity: "Copy to USB drive", action: "Block for CUI" },
            { activity: "Copy to network share", action: "Audit for CUI" },
            { activity: "Upload to browser", action: "Block unauthorized clouds" },
            { activity: "Print", action: "Audit with watermark" },
            { activity: "Access by unallowed app", action: "Block" },
            { activity: "Copy to RDP session", action: "Block for CUI" }
        ]
    },

    // ==================== CLOUD APP SECURITY / DEFENDER FOR CLOUD APPS ====================
    defenderCloudApps: {
        title: "Microsoft Defender for Cloud Apps",
        portalUrl: "https://security.microsoft.us/cloudapps",
        
        sessionPolicies: [
            {
                name: "Block CUI Download to Unmanaged Devices",
                conditions: ["Device not Intune compliant", "File has CUI label"],
                action: "Block download"
            },
            {
                name: "Watermark CUI Downloads",
                conditions: ["File has CUI label", "Download action"],
                action: "Apply dynamic watermark with user email and timestamp"
            },
            {
                name: "Block CUI Upload to Unsanctioned Apps",
                conditions: ["App not sanctioned", "File has CUI label"],
                action: "Block upload"
            }
        ],

        appGovernance: {
            description: "Monitor OAuth apps accessing M365 data",
            policies: [
                "Alert on app accessing CUI-labeled content",
                "Block unused app permissions",
                "Revoke suspicious app consents"
            ]
        }
    },

    // ==================== CUI CATEGORIES AND MARKING GUIDE ====================
    cuiCategories: {
        title: "CUI Category Reference",
        source: "https://www.archives.gov/cui/registry/category-list",
        
        commonCategories: [
            {
                category: "CTI - Controlled Technical Information",
                description: "Technical information with military or space application that is subject to controls on access, use, reproduction, modification, performance, display, release, or disclosure",
                marking: "CUI // SP-CTI",
                controls: "DFARS 252.204-7012"
            },
            {
                category: "EXPT - Export Controlled",
                description: "Information subject to export control regulations (ITAR/EAR)",
                marking: "CUI // SP-EXPT",
                subcategories: ["ITAR", "EAR"]
            },
            {
                category: "PRVCY - Privacy",
                description: "Information identifiable to an individual",
                marking: "CUI // SP-PRVCY",
                examples: ["PII", "PHI", "Personnel records"]
            },
            {
                category: "PROCURE - Procurement and Acquisition",
                description: "Procurement sensitive information",
                marking: "CUI // SP-PROCURE",
                examples: ["Source selection info", "Bid/proposal information"]
            },
            {
                category: "PROPIN - Proprietary Business Information",
                description: "Commercial or financial information",
                marking: "CUI // SP-PROPIN",
                examples: ["Trade secrets", "Cost data", "Pricing"]
            }
        ],

        limitedDisseminationControls: [
            { code: "NOFORN", description: "Not releasable to foreign nationals" },
            { code: "FEDCON", description: "Federal employees and contractors only" },
            { code: "NOCON", description: "Not releasable to contractors" },
            { code: "DL ONLY", description: "Dissemination list only" }
        ],

        markingFormat: {
            banner: "CUI // [Category] // [Dissemination Control]",
            examples: [
                "CUI // SP-CTI",
                "CUI // SP-EXPT // NOFORN",
                "CUI // SP-CTI // FEDCON",
                "CUI"
            ],
            portionMarking: "(CUI) for individual paragraphs"
        }
    },

    // ==================== IMPLEMENTATION CHECKLIST ====================
    implementationChecklist: {
        title: "Data Protection Implementation Checklist",
        
        phases: [
            {
                phase: "Phase 1: Foundation",
                tasks: [
                    { task: "Define sensitivity label taxonomy", status: "required" },
                    { task: "Create CUI label hierarchy", status: "required" },
                    { task: "Configure label encryption templates", status: "required" },
                    { task: "Publish labels to pilot group", status: "required" },
                    { task: "Train pilot users on labeling", status: "required" }
                ]
            },
            {
                phase: "Phase 2: Discovery",
                tasks: [
                    { task: "Create custom sensitive information types", status: "required" },
                    { task: "Run Content Explorer to identify existing CUI", status: "recommended" },
                    { task: "Deploy AIP Scanner for on-premises (if applicable)", status: "conditional" },
                    { task: "Review auto-labeling simulation results", status: "recommended" }
                ]
            },
            {
                phase: "Phase 3: Protection",
                tasks: [
                    { task: "Enable DLP policies in test mode", status: "required" },
                    { task: "Configure Endpoint DLP for managed devices", status: "required" },
                    { task: "Enable Cloud App Security session controls", status: "recommended" },
                    { task: "Review and tune DLP false positives", status: "required" }
                ]
            },
            {
                phase: "Phase 4: Enforcement",
                tasks: [
                    { task: "Enable mandatory labeling", status: "required" },
                    { task: "Enable DLP blocking mode", status: "required" },
                    { task: "Enable auto-labeling policies", status: "recommended" },
                    { task: "Configure incident management workflow", status: "required" }
                ]
            },
            {
                phase: "Phase 5: Monitoring",
                tasks: [
                    { task: "Configure DLP alerts and reports", status: "required" },
                    { task: "Review Activity Explorer regularly", status: "required" },
                    { task: "Monitor label analytics", status: "required" },
                    { task: "Conduct periodic policy reviews", status: "required" }
                ]
            }
        ]
    },

    // ==================== RELATED CMMC CONTROLS ====================
    cmmcControlMapping: {
        "3.1.3": ["DLP policies", "Sensitivity labels", "Information flow enforcement"],
        "3.8.1": ["Encryption at rest", "Label encryption", "Storage protection"],
        "3.8.2": ["Access controls on labeled content", "DLP access restrictions"],
        "3.8.4": ["CUI markings via sensitivity labels", "Banner marking"],
        "3.8.6": ["Label encryption for transport", "Secure sharing"],
        "3.13.4": ["DLP for data exfiltration", "Endpoint DLP"]
    }
};

// Export
if (typeof window !== 'undefined') window.MSP_DATA_PROTECTION = MSP_DATA_PROTECTION;
if (typeof module !== 'undefined' && module.exports) module.exports = MSP_DATA_PROTECTION;
