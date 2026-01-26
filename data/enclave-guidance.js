// VDI and Enclave Implementation Guidance for CMMC
// Architecture patterns, cost optimization, and integration strategies

const ENCLAVE_GUIDANCE = {
    // Architecture Decision Framework
    architectureOptions: [
        {
            pattern: "Dedicated CUI Enclave",
            description: "Fully isolated environment for CUI processing, separate from enterprise IT",
            bestFor: "Organizations with significant CUI volume or high-risk contracts",
            pros: ["Clear security boundary", "Simplified compliance scope", "Dedicated security controls", "Easier audit preparation"],
            cons: ["Higher infrastructure costs", "Potential workflow friction", "Duplicate tooling", "Staff training on separate systems"],
            costProfile: "$$$ - Higher upfront, lower ongoing compliance burden",
            timeToImplement: "8-16 weeks"
        },
        {
            pattern: "Enterprise Integration",
            description: "CUI handling integrated into existing enterprise environment with enhanced controls",
            bestFor: "Organizations where CUI is core to business operations",
            pros: ["Unified user experience", "Leverage existing investments", "Single toolset", "Easier adoption"],
            cons: ["Larger compliance scope", "More complex SSP", "Higher audit complexity", "Broader control implementation"],
            costProfile: "$$ - Lower upfront, higher ongoing compliance effort",
            timeToImplement: "12-24 weeks"
        },
        {
            pattern: "Hybrid Enclave",
            description: "Core CUI processing in enclave with controlled integration points to enterprise",
            bestFor: "Organizations needing both isolation and enterprise connectivity",
            pros: ["Balanced approach", "Controlled data flows", "Flexible architecture", "Scalable"],
            cons: ["Complex boundary management", "Integration testing required", "Multiple security domains"],
            costProfile: "$$ - Moderate costs with flexibility",
            timeToImplement: "10-20 weeks"
        }
    ],

    // VDI Platform Comparison
    vdiPlatforms: {
        azure: {
            name: "Azure Virtual Desktop (AVD)",
            environment: "Azure Government / GCC High",
            fedrampStatus: "FedRAMP High (Azure Gov)",
            strengths: [
                "Native M365 GCC High integration",
                "FSLogix profile management included",
                "Multi-session Windows 11 support",
                "Entra ID integration",
                "Intune MDM for session hosts"
            ],
            considerations: [
                "Requires Azure Government subscription",
                "Network connectivity to GCC High tenant",
                "GPU instances for CAD/engineering workloads"
            ],
            typicalCosts: {
                perUser: "$150-300/month",
                breakdown: "Compute + Storage + Licensing + Network"
            },
            bestFor: "M365-centric organizations, knowledge workers"
        },
        aws: {
            name: "Amazon WorkSpaces",
            environment: "AWS GovCloud",
            fedrampStatus: "FedRAMP High",
            strengths: [
                "Persistent desktop experience",
                "Multiple bundle options (Value to Power)",
                "Linux and Windows options",
                "WorkSpaces Web for browser-based access",
                "WorkDocs integration"
            ],
            considerations: [
                "Separate identity management (AD Connector or Managed AD)",
                "Limited M365 integration",
                "Per-desktop billing model"
            ],
            typicalCosts: {
                perUser: "$35-75/month (hourly) or $175-400/month (always-on)",
                breakdown: "Bundle pricing includes compute + storage"
            },
            bestFor: "AWS-centric organizations, persistent desktop needs"
        },
        gcp: {
            name: "Chrome Enterprise + Partner VDI",
            environment: "Google Cloud with Assured Workloads",
            fedrampStatus: "FedRAMP High (with Assured Workloads)",
            strengths: [
                "Chromebook endpoint simplicity",
                "Zero-trust architecture native",
                "Partner VDI (Citrix, VMware) on GCP",
                "BeyondCorp Enterprise integration"
            ],
            considerations: [
                "Requires partner VDI solution for Windows",
                "Less mature than Azure/AWS for VDI",
                "Workspace considerations for email/collaboration"
            ],
            typicalCosts: {
                perUser: "$100-250/month",
                breakdown: "Compute + Partner licensing + Storage"
            },
            bestFor: "Chrome-first organizations, web app workloads"
        },
        onPrem: {
            name: "On-Premises VDI (Citrix/VMware/RDS)",
            environment: "Customer Datacenter",
            fedrampStatus: "Customer Responsibility",
            strengths: [
                "Full control over infrastructure",
                "No cloud dependency",
                "Existing investment leverage",
                "Predictable costs (CapEx model)"
            ],
            considerations: [
                "Hardware lifecycle management",
                "Facility security requirements (PE controls)",
                "DR/BC complexity",
                "Staffing for infrastructure management"
            ],
            typicalCosts: {
                perUser: "$200-500/month (amortized)",
                breakdown: "Hardware + Licensing + Facilities + Staff"
            },
            bestFor: "Air-gapped requirements, existing datacenter investment"
        }
    },

    // Cost Optimization Strategies
    costOptimization: [
        {
            category: "Right-Sizing",
            strategies: [
                { name: "Start Small, Scale Up", description: "Begin with smaller VM sizes, upgrade based on performance data" },
                { name: "Persona-Based Sizing", description: "Match VM specs to user workload (Task Worker vs Power User vs Engineer)" },
                { name: "Performance Monitoring", description: "Use cloud-native monitoring to identify over-provisioned resources" },
                { name: "Reserved Instances", description: "Commit to 1-3 year terms for 30-60% savings on steady-state workloads" }
            ]
        },
        {
            category: "Scheduling",
            strategies: [
                { name: "Auto-Shutdown", description: "Power off non-production VDI hosts outside business hours" },
                { name: "Scaling Policies", description: "Scale session host pools based on demand (AVD scaling plans)" },
                { name: "Spot/Preemptible Instances", description: "Use for dev/test VDI environments (not production)" },
                { name: "Time-Zone Optimization", description: "Stagger pools for global workforce, share capacity" }
            ]
        },
        {
            category: "Storage",
            strategies: [
                { name: "Tiered Storage", description: "Use premium SSD for OS, standard for profiles, archive for backups" },
                { name: "FSLogix Cloud Cache", description: "Reduce profile storage costs with intelligent caching" },
                { name: "OneDrive Known Folder Move", description: "Offload user data to M365, reduce VDI storage" },
                { name: "Deduplication", description: "Enable storage deduplication for profile containers" }
            ]
        },
        {
            category: "Licensing",
            strategies: [
                { name: "M365 E3/E5 Entitlements", description: "AVD access rights included in M365 E3/E5 licenses" },
                { name: "Azure Hybrid Benefit", description: "Use existing Windows Server licenses for session hosts" },
                { name: "License Mobility", description: "Bring existing Citrix/VMware licenses to cloud" },
                { name: "Per-User vs Per-Device", description: "Analyze usage patterns to optimize CAL strategy" }
            ]
        }
    ],

    // Enclave Network Architecture
    networkArchitecture: {
        components: [
            {
                name: "Boundary Firewall",
                purpose: "Control all traffic entering/leaving enclave",
                options: ["Azure Firewall Premium", "AWS Network Firewall", "Palo Alto VM-Series", "Fortinet FortiGate"],
                cmmcRelevance: "SC.L2-3.13.1 (Boundary Protection), SC.L2-3.13.6 (Deny by Default)"
            },
            {
                name: "Network Segmentation",
                purpose: "Isolate CUI workloads from non-CUI",
                options: ["VNet/VPC Peering with NSGs", "Microsegmentation (Illumio, Guardicore)", "VLAN Isolation"],
                cmmcRelevance: "SC.L2-3.13.5 (Public Access Subnetworks), AC.L2-3.1.3 (CUI Flow)"
            },
            {
                name: "VPN/Private Connectivity",
                purpose: "Secure access from on-premises or remote users",
                options: ["Site-to-Site VPN", "ExpressRoute/Direct Connect", "Always-On VPN (client)"],
                cmmcRelevance: "SC.L2-3.13.8 (Transmission Encryption), AC.L2-3.1.12 (Remote Access)"
            },
            {
                name: "DNS Security",
                purpose: "Prevent DNS-based exfiltration, malware C2",
                options: ["Azure DNS Private Resolver", "Route 53 Resolver", "Cisco Umbrella", "Infoblox"],
                cmmcRelevance: "SC.L2-3.13.4 (Unauthorized Transfer), SI.L2-3.14.6 (Traffic Monitoring)"
            },
            {
                name: "Web Application Firewall",
                purpose: "Protect enclave-hosted applications",
                options: ["Azure Front Door + WAF", "AWS WAF", "Cloudflare (FedRAMP)", "F5 BIG-IP"],
                cmmcRelevance: "SC.L2-3.13.1 (Boundary Protection), SI.L2-3.14.1 (Flaw Remediation)"
            }
        ],
        referenceArchitectures: [
            {
                name: "Azure Landing Zone for Defense",
                url: "https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/defense/",
                description: "Microsoft's reference architecture for DoD workloads"
            },
            {
                name: "AWS Aerospace & Defense",
                url: "https://aws.amazon.com/government-education/defense/",
                description: "AWS reference architectures for defense contractors"
            },
            {
                name: "CISA Zero Trust Maturity Model",
                url: "https://www.cisa.gov/zero-trust-maturity-model",
                description: "Framework for zero-trust architecture alignment"
            }
        ]
    },

    // Integration Patterns
    integrationPatterns: [
        {
            pattern: "Identity Federation",
            description: "Federate enclave identity with enterprise IdP",
            implementation: [
                "Entra ID cross-tenant sync or B2B",
                "SAML/OIDC federation to enterprise IdP",
                "Conditional Access policies for enclave access",
                "Separate MFA registration for enclave"
            ],
            securityConsiderations: "Ensure enclave has independent MFA; don't trust enterprise-only authentication"
        },
        {
            pattern: "Data Transfer Gateway",
            description: "Controlled mechanism for moving data into/out of enclave",
            implementation: [
                "Azure Storage with Private Endpoints + DLP scanning",
                "SFTP server with malware scanning",
                "Content Disarm & Reconstruction (CDR) solutions",
                "Manual review process for high-sensitivity transfers"
            ],
            securityConsiderations: "All transfers should be logged, scanned, and require approval workflow"
        },
        {
            pattern: "Email Gateway",
            description: "Secure email flow between enclave and external parties",
            implementation: [
                "M365 GCC High with transport rules",
                "Encryption gateway (Virtru, Zix)",
                "Separate enclave email domain",
                "Auto-labeling for CUI content"
            ],
            securityConsiderations: "Consider CUI marking requirements for external email"
        },
        {
            pattern: "Collaboration Bridge",
            description: "Enable collaboration between enclave and enterprise users",
            implementation: [
                "Teams External Access (federation)",
                "Shared SharePoint sites with guest access",
                "Separate collaboration space in enclave",
                "Real-time collaboration with sensitivity labels"
            ],
            securityConsiderations: "Guest access should be time-limited and reviewed regularly"
        }
    ],

    // Implementation Checklist
    implementationChecklist: {
        phase1_foundation: {
            name: "Phase 1: Foundation (Weeks 1-3)",
            tasks: [
                { task: "Architecture decision (Enclave vs Enterprise vs Hybrid)", deliverable: "Architecture Decision Document" },
                { task: "Cloud subscription setup (GCC High, GovCloud, etc.)", deliverable: "Activated subscriptions" },
                { task: "Network design and IP planning", deliverable: "Network architecture diagram" },
                { task: "Identity strategy (federation, sync, standalone)", deliverable: "Identity architecture document" },
                { task: "Baseline security controls deployment", deliverable: "Security baseline applied" }
            ]
        },
        phase2_infrastructure: {
            name: "Phase 2: Infrastructure (Weeks 4-6)",
            tasks: [
                { task: "VDI platform deployment (AVD, WorkSpaces, etc.)", deliverable: "VDI infrastructure operational" },
                { task: "Session host image creation and hardening", deliverable: "Golden image with STIG baseline" },
                { task: "Profile management configuration (FSLogix)", deliverable: "User profiles functional" },
                { task: "Network connectivity (VPN, peering)", deliverable: "Connectivity validated" },
                { task: "Endpoint protection deployment", deliverable: "EDR/AV on all session hosts" }
            ]
        },
        phase3_security: {
            name: "Phase 3: Security Controls (Weeks 7-9)",
            tasks: [
                { task: "DLP policies for CUI", deliverable: "DLP rules active" },
                { task: "Conditional Access policies", deliverable: "CA policies enforced" },
                { task: "Logging and SIEM integration", deliverable: "Logs flowing to SIEM" },
                { task: "Vulnerability management", deliverable: "Scanning operational" },
                { task: "Backup and recovery testing", deliverable: "DR plan validated" }
            ]
        },
        phase4_operations: {
            name: "Phase 4: Operations (Weeks 10-12)",
            tasks: [
                { task: "User pilot and feedback", deliverable: "Pilot complete, issues resolved" },
                { task: "Runbooks and SOPs", deliverable: "Operational documentation" },
                { task: "Security awareness training", deliverable: "Users trained on enclave policies" },
                { task: "Full production rollout", deliverable: "All CUI users migrated" },
                { task: "SSP documentation", deliverable: "SSP updated with enclave details" }
            ]
        }
    },

    // User Personas and Sizing
    userPersonas: [
        {
            persona: "Task Worker",
            description: "Email, web apps, light Office usage",
            typicalApps: ["Outlook", "Teams", "Browser", "Office (light)"],
            recommendedSpecs: {
                azure: "D2s_v5 (2 vCPU, 8 GB RAM)",
                aws: "Value Bundle (2 vCPU, 4 GB RAM)",
                general: "2 vCPU, 4-8 GB RAM, 128 GB SSD"
            },
            usersPerHost: "10-15 (multi-session)"
        },
        {
            persona: "Knowledge Worker",
            description: "Heavy Office, collaboration, light data analysis",
            typicalApps: ["Office Suite", "Teams", "Power BI", "SharePoint"],
            recommendedSpecs: {
                azure: "D4s_v5 (4 vCPU, 16 GB RAM)",
                aws: "Standard Bundle (4 vCPU, 8 GB RAM)",
                general: "4 vCPU, 8-16 GB RAM, 256 GB SSD"
            },
            usersPerHost: "6-10 (multi-session)"
        },
        {
            persona: "Power User",
            description: "Data analysis, development, multiple applications",
            typicalApps: ["Visual Studio", "SQL Tools", "Power BI", "Heavy Excel"],
            recommendedSpecs: {
                azure: "D8s_v5 (8 vCPU, 32 GB RAM)",
                aws: "Performance Bundle (8 vCPU, 32 GB RAM)",
                general: "8 vCPU, 32 GB RAM, 512 GB SSD"
            },
            usersPerHost: "2-4 (multi-session) or dedicated"
        },
        {
            persona: "Engineer/Designer",
            description: "CAD, 3D modeling, GPU-intensive applications",
            typicalApps: ["AutoCAD", "SolidWorks", "Revit", "Adobe Creative Suite"],
            recommendedSpecs: {
                azure: "NV-series (GPU) or NCas_T4_v3",
                aws: "Graphics.g4dn Bundle",
                general: "8+ vCPU, 32+ GB RAM, NVIDIA GPU, 512 GB+ SSD"
            },
            usersPerHost: "Dedicated desktop per user"
        }
    ],

    // Endpoint Strategy
    endpointStrategy: {
        options: [
            {
                type: "Thin Client",
                description: "Purpose-built device for VDI access only",
                examples: ["HP t640", "Dell Wyse 5070", "IGEL UD3"],
                pros: ["Low attack surface", "Easy management", "Long lifespan", "Lower power consumption"],
                cons: ["Limited offline capability", "Additional hardware cost", "Single-purpose device"],
                cmmcConsiderations: "Minimal local data storage, reduced PE/MP scope"
            },
            {
                type: "Managed Laptop (VDI-only)",
                description: "Corporate laptop locked to VDI access, no local CUI",
                examples: ["Windows 11 with Intune", "Chromebook Enterprise"],
                pros: ["Familiar form factor", "Some offline capability", "Dual-use potential"],
                cons: ["Larger attack surface", "Must ensure no local CUI storage", "Higher management overhead"],
                cmmcConsiderations: "Ensure DLP prevents local CUI storage; consider full disk encryption"
            },
            {
                type: "BYOD with VDI",
                description: "Personal device accessing VDI through secure client",
                examples: ["AVD Web Client", "WorkSpaces Web", "Citrix Workspace App"],
                pros: ["No hardware cost", "User convenience", "Rapid deployment"],
                cons: ["Device trust challenges", "Screen capture risks", "User privacy concerns"],
                cmmcConsiderations: "Require device compliance (Conditional Access); consider watermarking"
            }
        ],
        recommendations: [
            "Prefer thin clients for dedicated CUI workers",
            "Use managed laptops for hybrid workers needing some local capability",
            "Limit BYOD to emergency/travel scenarios with additional controls",
            "Implement screen capture prevention where available",
            "Require device certificates or compliance checks before VDI access"
        ]
    },

    // ========================================
    // DEEP VDI PLATFORM CONFIGURATION GUIDES
    // ========================================
    
    vdiDeepDive: {
        // Azure Virtual Desktop (AVD) Deep Configuration
        avd: {
            name: "Azure Virtual Desktop (AVD)",
            overview: "Microsoft's cloud-native VDI platform with native GCC High support",
            
            deploymentOptions: {
                pooled: {
                    name: "Pooled (Multi-Session)",
                    description: "Multiple users share session hosts, users get random VM assignment",
                    bestFor: "Task workers, cost optimization, standardized workloads",
                    sessionHostOS: "Windows 11 Enterprise Multi-Session or Windows 10 Enterprise Multi-Session",
                    maxUsersPerHost: "Depends on VM size: D4s_v5 = 10-15 users, D8s_v5 = 20-25 users",
                    profileRequirement: "FSLogix required for profile persistence"
                },
                personal: {
                    name: "Personal (Dedicated)",
                    description: "Each user assigned dedicated VM, persists between sessions",
                    bestFor: "Power users, developers, CAD/engineering, specialized software",
                    sessionHostOS: "Windows 11 Enterprise or Windows 10 Enterprise (single-session)",
                    autoStartStop: "Configure auto-start/stop to control costs",
                    profileRequirement: "Local profiles acceptable, FSLogix optional"
                }
            },
            
            securityConfiguration: {
                hostPoolSettings: [
                    { setting: "Load Balancing", recommendation: "Breadth-first for better distribution, Depth-first for cost optimization" },
                    { setting: "Max Session Limit", recommendation: "Set based on VM sizing and performance testing" },
                    { setting: "Validation Environment", recommendation: "Enable for host pool used to test updates before production" },
                    { setting: "Start VM on Connect", recommendation: "Enable to reduce always-on costs for personal desktops" },
                    { setting: "Drain Mode", recommendation: "Use during maintenance to gracefully move users" }
                ],
                rdpProperties: [
                    { property: "audiocapturemode:i:1", purpose: "Enable microphone redirection (for Teams)" },
                    { property: "audiomode:i:0", purpose: "Audio plays on remote computer" },
                    { property: "camerastoredirect:s:*", purpose: "Enable camera redirection" },
                    { property: "drivestoredirect:s:", purpose: "DISABLE drive redirection for CUI security" },
                    { property: "redirectclipboard:i:0", purpose: "DISABLE clipboard for CUI security" },
                    { property: "redirectprinters:i:0", purpose: "DISABLE printer redirection for CUI security" },
                    { property: "encode redirected video capture:i:1", purpose: "Improve camera quality" },
                    { property: "redirected video capture encoding quality:i:2", purpose: "High quality video encoding" }
                ],
                conditionalAccess: [
                    { policy: "Require MFA", target: "Windows Virtual Desktop cloud app", setting: "Grant: Require MFA" },
                    { policy: "Require Compliant Device", target: "Windows Virtual Desktop + Azure Virtual Desktop", setting: "Grant: Require device compliance or Hybrid Azure AD joined" },
                    { policy: "Block Legacy Auth", target: "All cloud apps", setting: "Conditions: Client apps = Other clients; Block" },
                    { policy: "Session Controls", target: "Windows Virtual Desktop", setting: "Sign-in frequency: 8 hours; Persistent browser: No" },
                    { policy: "Named Locations", target: "Windows Virtual Desktop", setting: "Block access from non-approved countries" }
                ],
                networkSecurity: [
                    { control: "Private Endpoints", description: "Deploy AVD private endpoints for workspace and host pool" },
                    { control: "RDP Shortpath", description: "Enable for managed networks to reduce latency (UDP-based)" },
                    { control: "Network Firewall", description: "Azure Firewall Premium with TLS inspection for egress" },
                    { control: "NSG Rules", description: "Restrict session host subnet to required ports only" },
                    { control: "Azure Bastion", description: "Use for administrative access, never expose RDP directly" }
                ]
            },
            
            baselineHardening: {
                stig: {
                    name: "DISA STIGs",
                    description: "Apply Windows 11 STIG or Windows 10 STIG to session hosts",
                    automationTools: ["Azure Policy Guest Configuration", "Intune Security Baselines", "PowerSTIG (PowerShell DSC)"],
                    keySettings: [
                        "Disable SMBv1",
                        "Enable Credential Guard",
                        "Configure Windows Firewall",
                        "Disable unnecessary services",
                        "Audit policy configuration",
                        "User rights assignments"
                    ]
                },
                cis: {
                    name: "CIS Benchmarks",
                    description: "Alternative to STIG, widely recognized baseline",
                    levels: ["Level 1 (recommended minimum)", "Level 2 (more restrictive)"],
                    automationTools: ["Intune Security Baselines", "Azure Policy", "Third-party tools (Nessus, Qualys)"]
                },
                microsoftBaselines: {
                    name: "Microsoft Security Baselines",
                    description: "Microsoft's recommended security settings",
                    source: "Microsoft Security Compliance Toolkit",
                    deployment: "Deploy via Intune Security Baselines or GPO"
                }
            },
            
            imageManagement: {
                goldenImage: {
                    description: "Master image used for session host deployment",
                    components: [
                        "Base Windows 11 Enterprise Multi-Session",
                        "All Windows Updates applied",
                        "FSLogix Agent installed and configured",
                        "Required applications (Office, Teams, LOB apps)",
                        "Security baseline applied",
                        "Optimizations (VDI optimizer tool)",
                        "Endpoint protection agent"
                    ],
                    tools: [
                        { name: "Azure Image Builder", description: "Automate image creation in Azure" },
                        { name: "HashiCorp Packer", description: "Cross-platform image automation" },
                        { name: "Azure VM Capture", description: "Manual image creation from configured VM" }
                    ],
                    updateStrategy: "Monthly image refresh aligned with Patch Tuesday"
                },
                sharedImageGallery: {
                    description: "Store and version golden images in Azure",
                    features: [
                        "Version tracking for rollback",
                        "Replication across regions",
                        "RBAC for image access control",
                        "Integration with Image Builder"
                    ],
                    bestPractices: [
                        "Maintain last 3 image versions for rollback",
                        "Use naming convention with date (e.g., AVD-Win11-2026-01)",
                        "Document changes in image description",
                        "Test new images in validation pool first"
                    ]
                }
            },
            
            monitoring: {
                azureMonitor: [
                    { metric: "User Connections", description: "Track concurrent users and peak usage" },
                    { metric: "Session Host Health", description: "Monitor VM health and availability" },
                    { metric: "User Experience Metrics", description: "Round-trip time, input delay, frames skipped" },
                    { metric: "Profile Load Time", description: "FSLogix profile container attach duration" }
                ],
                avdInsights: {
                    description: "Pre-built Azure Monitor workbook for AVD",
                    features: ["Connection reliability", "Performance trends", "User session details", "Host pool health"],
                    requirement: "Log Analytics workspace with AVD diagnostics enabled"
                },
                alerts: [
                    { alert: "No Available Hosts", condition: "Available session hosts = 0", action: "Scale out or investigate" },
                    { alert: "High CPU", condition: "CPU > 80% for 10 minutes", action: "Add capacity or investigate runaway process" },
                    { alert: "Profile Attach Failure", condition: "FSLogix error events", action: "Investigate storage or profile corruption" },
                    { alert: "Disconnected Sessions", condition: "Disconnected > 50% for 30 minutes", action: "Network or client issue investigation" }
                ]
            },
            
            cmmcDocumentation: [
                { artifact: "Network Diagram", description: "Show AVD subnet, NSGs, firewall, private endpoints", controls: "SC.L2-3.13.1, SC.L2-3.13.5" },
                { artifact: "Baseline Configuration", description: "Document STIG/CIS baseline applied to session hosts", controls: "CM.L2-3.4.1, CM.L2-3.4.2" },
                { artifact: "Access Control Policy", description: "Document Conditional Access policies and RDP restrictions", controls: "AC.L2-3.1.1, AC.L2-3.1.12" },
                { artifact: "User Access List", description: "Entra ID group membership for AVD access", controls: "AC.L2-3.1.1, AC.L2-3.1.2" },
                { artifact: "Audit Log Configuration", description: "Diagnostic settings, Log Analytics, retention", controls: "AU.L2-3.3.1, AU.L2-3.3.2" },
                { artifact: "Encryption Documentation", description: "Disk encryption, TLS in transit, profile encryption", controls: "SC.L2-3.13.8, SC.L2-3.13.16" }
            ]
        },
        
        // Citrix Deep Configuration
        citrix: {
            name: "Citrix Virtual Apps and Desktops",
            overview: "Enterprise VDI platform with on-prem, cloud, and hybrid deployment options",
            
            deploymentOptions: {
                citrixCloud: {
                    name: "Citrix DaaS (Cloud)",
                    description: "Control plane hosted by Citrix, resources in customer environment",
                    components: ["Citrix Cloud (control plane)", "Cloud Connectors (on-prem agents)", "VDAs (session hosts)", "StoreFront or Workspace"],
                    gccHighSupport: "Citrix DaaS for Government (FedRAMP High authorized)",
                    advantages: ["Reduced management overhead", "Always current platform", "Faster deployment"]
                },
                onPremises: {
                    name: "Citrix CVAD On-Premises",
                    description: "Full control plane hosted in customer datacenter",
                    components: ["Delivery Controllers", "SQL Database", "StoreFront", "License Server", "Director", "VDAs"],
                    advantages: ["Full control", "Air-gap capable", "No cloud dependency"],
                    disadvantages: ["Higher management burden", "Manual updates", "Infrastructure requirements"]
                },
                hybrid: {
                    name: "Hybrid (Cloud + On-Prem Resources)",
                    description: "Citrix Cloud control with resources across clouds and on-prem",
                    useCases: ["DR failover", "Cloud bursting", "Migration pathway"]
                }
            },
            
            securityConfiguration: {
                policies: [
                    { policy: "Client Drive Mapping", setting: "Disable for CUI environment", purpose: "Prevent data exfiltration" },
                    { policy: "Clipboard Redirection", setting: "Disable or one-way (to server only)", purpose: "Control data movement" },
                    { policy: "Client Printer Mapping", setting: "Disable or restrict to specific printers", purpose: "Control print of CUI" },
                    { policy: "USB Device Redirection", setting: "Disable or whitelist specific devices", purpose: "Prevent unauthorized removable media" },
                    { policy: "Session Recording", setting: "Enable for privileged sessions", purpose: "Audit trail for sensitive access" },
                    { policy: "Watermarking", setting: "Enable with username and timestamp", purpose: "Deter screen photography" },
                    { policy: "Anti-Keylogging", setting: "Enable App Protection", purpose: "Protect against keyloggers on endpoints" },
                    { policy: "Anti-Screen Capture", setting: "Enable App Protection", purpose: "Block screen capture tools" }
                ],
                authentication: [
                    { method: "SAML 2.0 Federation", description: "Integrate with Entra ID or Okta for SSO" },
                    { method: "Smart Card", description: "PKI certificate-based authentication (CAC/PIV)" },
                    { method: "TOTP MFA", description: "Native Citrix Cloud MFA or third-party integration" },
                    { method: "Federated Authentication Service (FAS)", description: "SSO to Windows without password prompts" }
                ],
                networkSecurity: [
                    { component: "Citrix Gateway", description: "Secure remote access with SSL VPN and ICA proxy" },
                    { component: "NetScaler ADC", description: "Load balancing, WAF, DDoS protection" },
                    { component: "SSL/TLS Configuration", description: "TLS 1.2+ only, strong cipher suites" },
                    { component: "ICA Encryption", description: "SecureICA with RC5-128 minimum" }
                ]
            },
            
            profileManagement: {
                citrixProfileManagement: {
                    name: "Citrix Profile Management (CPM)",
                    description: "Native Citrix solution for user profile roaming",
                    features: [
                        "Active write-back for real-time sync",
                        "Profile streaming for fast logon",
                        "Folder redirection integration",
                        "Cross-platform profile support"
                    ],
                    configuration: [
                        { setting: "Enable Profile Management", value: "Policy: Enabled" },
                        { setting: "Path to User Store", value: "UNC path: \\\\server\\profiles$\\%username%" },
                        { setting: "Profile Streaming", value: "Enabled for faster logon" },
                        { setting: "Active Write Back", value: "Enabled for profile resilience" },
                        { setting: "Delete Cached Copies", value: "Enabled for non-persistent VDA" }
                    ],
                    storageOptions: ["On-premises file share (SMB)", "Azure Files", "Azure NetApp Files", "NetApp ONTAP"]
                },
                fslogixWithCitrix: {
                    name: "FSLogix with Citrix",
                    description: "Microsoft FSLogix can be used with Citrix VDA",
                    advantages: ["Better Office 365 container support", "Application masking", "Unified solution if using AVD too"],
                    configuration: "Same as AVD FSLogix configuration",
                    considerations: ["Licensing (included with M365 E3/E5 or RDS CAL)", "Separate from Citrix CPM (choose one)"]
                }
            },
            
            baselineHardening: {
                citrixSecurityBaseline: {
                    name: "Citrix Hardening Guide",
                    source: "Citrix Product Documentation",
                    keyAreas: [
                        "Disable unnecessary Citrix services",
                        "Configure XML service encryption",
                        "Harden StoreFront IIS settings",
                        "Configure Delivery Controller security",
                        "Enable auditing and logging"
                    ]
                },
                vdaHardening: [
                    { area: "Windows Baseline", description: "Apply STIG/CIS to VDA Windows OS" },
                    { area: "Citrix Policies", description: "Disable risky redirections and features" },
                    { area: "Application Control", description: "AppLocker or Citrix App Protection" },
                    { area: "Antimalware", description: "VDA-optimized AV (CrowdStrike, Defender)" },
                    { area: "Local Accounts", description: "Rename/disable local admin, use LAPS" }
                ]
            },
            
            cmmcDocumentation: [
                { artifact: "Architecture Diagram", description: "Show all Citrix components, network flows, integration points", controls: "SC.L2-3.13.1" },
                { artifact: "Policy Documentation", description: "Export and document all Citrix policies applied", controls: "CM.L2-3.4.2, AC.L2-3.1.1" },
                { artifact: "Session Recording Procedures", description: "Document when/how session recording is used", controls: "AU.L2-3.3.1" },
                { artifact: "Certificate Management", description: "Document SSL certs, renewal process, key storage", controls: "SC.L2-3.13.10" },
                { artifact: "Citrix Cloud SOC Reports", description: "Obtain SOC 2 Type II for Citrix Cloud environment", controls: "CA.L2-3.12.4" }
            ]
        },
        
        // VMware Horizon Deep Configuration
        vmwareHorizon: {
            name: "VMware Horizon",
            overview: "VMware's enterprise VDI and application virtualization platform",
            
            deploymentOptions: {
                horizonCloud: {
                    name: "Horizon Cloud on Azure",
                    description: "VMware control plane with VMs running in Azure",
                    azureGov: "Supported in Azure Government for GCC High workloads",
                    components: ["Horizon Cloud Service", "Unified Access Gateway", "Connection Servers", "Desktop Pools"]
                },
                horizonOnPrem: {
                    name: "Horizon On-Premises",
                    description: "Full VMware infrastructure in customer datacenter",
                    components: ["vCenter Server", "ESXi Hosts", "Connection Servers", "Unified Access Gateway", "App Volumes", "DEM"],
                    vSAN: "vSAN for hyper-converged storage"
                }
            },
            
            securityConfiguration: {
                uag: {
                    name: "Unified Access Gateway (UAG)",
                    description: "Secure edge gateway for Horizon remote access",
                    features: [
                        "SAML authentication",
                        "RADIUS/RSA integration",
                        "Smart card support",
                        "Compliance checking",
                        "Per-app tunneling"
                    ],
                    hardening: [
                        "Deploy in DMZ with proper NSG/firewall rules",
                        "Enable FIPS 140-2 mode",
                        "Configure TLS 1.2+ only",
                        "Disable unused authentication methods",
                        "Enable syslog to SIEM"
                    ]
                },
                desktopPolicies: [
                    { policy: "USB Redirection", setting: "Disable or filter by device class", purpose: "Prevent removable media" },
                    { policy: "Clipboard", setting: "Disable or server-to-client only", purpose: "Control data exfiltration" },
                    { policy: "Drive Redirection", setting: "Disable", purpose: "Prevent local drive access" },
                    { policy: "Printing", setting: "Disable or restrict to specific printers", purpose: "Control CUI printing" },
                    { policy: "PCoIP Security", setting: "AES-256 encryption", purpose: "Encrypt display protocol" }
                ],
                dynamicEnvironmentManager: {
                    name: "VMware DEM",
                    description: "Profile and application personalization",
                    features: ["Profile management", "Application configuration", "Conditional settings based on context"],
                    cmmcUse: "Apply different policies based on CUI vs non-CUI sessions"
                }
            },
            
            profileManagement: {
                dem: {
                    name: "Dynamic Environment Manager (DEM)",
                    description: "VMware's native profile and settings management",
                    features: [
                        "Application personalization",
                        "Windows settings roaming",
                        "Conditional policies",
                        "Privilege elevation"
                    ],
                    storage: "File share for configuration data"
                },
                appVolumes: {
                    name: "App Volumes",
                    description: "Real-time application delivery",
                    useCase: "Deliver applications as VMDK layers, not installed in base image",
                    advantages: ["Smaller base images", "Instant app updates", "Per-user app entitlements"]
                },
                fslogixWithHorizon: {
                    name: "FSLogix with Horizon",
                    description: "Can use FSLogix for profile containers with VMware",
                    advantages: ["Better Office 365 integration", "Profile container approach"],
                    configuration: "Same as AVD/Citrix FSLogix setup"
                }
            },
            
            cmmcDocumentation: [
                { artifact: "vSphere Security Config", description: "Document ESXi and vCenter hardening", controls: "CM.L2-3.4.1" },
                { artifact: "UAG Configuration", description: "Document gateway security settings", controls: "SC.L2-3.13.1, AC.L2-3.1.12" },
                { artifact: "Desktop Pool Policies", description: "Export and document Horizon policies", controls: "CM.L2-3.4.2" },
                { artifact: "Network Diagram", description: "Show Horizon components and traffic flows", controls: "SC.L2-3.13.5" }
            ]
        }
    },

    // ========================================
    // FSLOGIX DEEP DIVE
    // ========================================
    
    fslogixDeepDive: {
        overview: {
            description: "Microsoft FSLogix provides profile container and application masking solutions for VDI environments",
            licensing: "Included with Microsoft 365 E3/E5, Windows Enterprise E3/E5, or RDS CAL with SA",
            components: [
                { name: "Profile Container", description: "VHD/VHDX that contains entire user profile" },
                { name: "Office Container", description: "Separate container for Office 365 data (optional)" },
                { name: "Application Masking", description: "Show/hide applications based on user/group" },
                { name: "Java Version Control", description: "Manage multiple Java versions per application" }
            ]
        },
        
        profileContainerConfig: {
            description: "Core FSLogix configuration for profile management",
            
            registrySettings: [
                { key: "HKLM\\SOFTWARE\\FSLogix\\Profiles", value: "Enabled", data: "1", description: "Enable Profile Containers" },
                { key: "HKLM\\SOFTWARE\\FSLogix\\Profiles", value: "VHDLocations", data: "\\\\server\\share", description: "UNC path to profile storage" },
                { key: "HKLM\\SOFTWARE\\FSLogix\\Profiles", value: "SizeInMBs", data: "30000", description: "Max profile size (30GB)" },
                { key: "HKLM\\SOFTWARE\\FSLogix\\Profiles", value: "IsDynamic", data: "1", description: "Dynamic VHD (grows as needed)" },
                { key: "HKLM\\SOFTWARE\\FSLogix\\Profiles", value: "VolumeType", data: "VHDX", description: "Use VHDX format for larger profiles" },
                { key: "HKLM\\SOFTWARE\\FSLogix\\Profiles", value: "FlipFlopProfileDirectoryName", data: "1", description: "SID_Username format (recommended)" },
                { key: "HKLM\\SOFTWARE\\FSLogix\\Profiles", value: "DeleteLocalProfileWhenVHDShouldApply", data: "1", description: "Clean up local profiles" },
                { key: "HKLM\\SOFTWARE\\FSLogix\\Profiles", value: "LockedRetryCount", data: "3", description: "Retry if container locked" },
                { key: "HKLM\\SOFTWARE\\FSLogix\\Profiles", value: "LockedRetryInterval", data: "15", description: "Seconds between retries" }
            ],
            
            officeContainerSettings: [
                { key: "HKLM\\SOFTWARE\\Policies\\FSLogix\\ODFC", value: "Enabled", data: "1", description: "Enable Office Container" },
                { key: "HKLM\\SOFTWARE\\Policies\\FSLogix\\ODFC", value: "VHDLocations", data: "\\\\server\\odfc$", description: "Separate location for Office data" },
                { key: "HKLM\\SOFTWARE\\Policies\\FSLogix\\ODFC", value: "IncludeOutlook", data: "1", description: "Include Outlook data/OST" },
                { key: "HKLM\\SOFTWARE\\Policies\\FSLogix\\ODFC", value: "IncludeOneDrive", data: "1", description: "Include OneDrive cache" },
                { key: "HKLM\\SOFTWARE\\Policies\\FSLogix\\ODFC", value: "IncludeTeams", data: "1", description: "Include Teams data" }
            ],
            
            advancedSettings: [
                { setting: "Concurrent User Access", description: "RW access for primary, RO for additional sessions", recommendation: "Enable if users may have multiple sessions" },
                { setting: "Profile Compaction", description: "Automatically shrink VHD on logoff", recommendation: "Enable to reclaim space, slight logoff delay" },
                { setting: "Cloud Cache", description: "Local cache with async replication to multiple locations", recommendation: "Use for multi-region or DR scenarios" },
                { setting: "Redirections.xml", description: "Exclude folders from profile container", recommendation: "Exclude Chrome/Edge cache, temp files, OneDrive (if using KFM)" }
            ]
        },
        
        storageOptions: {
            azureFiles: {
                name: "Azure Files",
                description: "Native Azure file shares for FSLogix",
                tiers: [
                    { tier: "Premium", iops: "Based on provisioned size", latency: "Sub-millisecond", bestFor: "Production VDI" },
                    { tier: "Standard (Hot)", iops: "Transaction-based", latency: "Single-digit ms", bestFor: "Dev/test or low-intensity" }
                ],
                setup: [
                    "Create Storage Account in same region as session hosts",
                    "Enable Azure AD DS or AD DS authentication",
                    "Create file share with appropriate quota",
                    "Configure NTFS permissions via storage account key or AD",
                    "Set share-level permissions in Azure portal",
                    "Mount in session hosts via Private Endpoint"
                ],
                sizing: "Formula: (Users x 30GB) / 1024 = TB provisioned; Premium IOPS = Size(GB) + baseline",
                privateEndpoint: "Required for GCC High / secure environments"
            },
            azureNetAppFiles: {
                name: "Azure NetApp Files (ANF)",
                description: "High-performance NFS/SMB for large-scale VDI",
                tiers: ["Ultra (128 MiB/s per TiB)", "Premium (64 MiB/s per TiB)", "Standard (16 MiB/s per TiB)"],
                advantages: ["Sub-millisecond latency", "Massive scale", "Snapshot and backup built-in"],
                bestFor: "Large deployments (500+ users), performance-sensitive workloads",
                sizing: "Start with Premium tier, 4TB minimum capacity pool"
            },
            onPremFileServer: {
                name: "On-Premises File Server",
                description: "Windows File Server with SMB shares",
                requirements: [
                    "Windows Server 2019/2022",
                    "SSD or NVMe storage for profile share",
                    "Proper IOPS (5 IOPS/user minimum, 10+ recommended)",
                    "SMB 3.0+ with encryption enabled",
                    "DFS-N for namespace abstraction (optional)"
                ],
                sizing: "RAID10 with enterprise SSD, 10GbE network minimum",
                highAvailability: "DFS-R for replication, failover clustering for server HA"
            },
            cloudCache: {
                name: "FSLogix Cloud Cache",
                description: "Local SSD cache with async replication to cloud storage",
                architecture: "Local VHD on fast storage, changes replicated to Azure Files or remote SMB",
                advantages: ["Fast logon (local read)", "DR built-in", "Multi-region support"],
                configuration: "CCDLocations instead of VHDLocations, specify multiple providers",
                bestFor: "Hybrid scenarios, DR requirements, multi-region deployments"
            }
        },
        
        troubleshooting: {
            commonIssues: [
                { issue: "Slow logon times", cause: "Network latency to storage, large profile", solution: "Use premium storage, enable Cloud Cache, clean up profile bloat" },
                { issue: "Profile not loading", cause: "Container locked by previous session", solution: "Check for stale locks, increase retry settings, reboot session host" },
                { issue: "Disk full errors", cause: "Profile exceeded SizeInMBs limit", solution: "Increase limit, enable compaction, clean up via Redirections.xml" },
                { issue: "Permission denied", cause: "NTFS or share permissions incorrect", solution: "Users need Modify on profile folder, Full Control on their VHD" },
                { issue: "Office data not roaming", cause: "ODFC not enabled or misconfigured", solution: "Enable Office Container, verify Include* settings" }
            ],
            logLocations: [
                { log: "FSLogix Profile Log", path: "C:\\ProgramData\\FSLogix\\Logs\\Profile*.log" },
                { log: "FSLogix ODFC Log", path: "C:\\ProgramData\\FSLogix\\Logs\\ODFC*.log" },
                { log: "Windows Event Log", path: "Applications and Services > FSLogix Apps" }
            ],
            tools: [
                { tool: "frx.exe", description: "FSLogix command-line utility for troubleshooting" },
                { tool: "FSLogix Profile Container Sizing", description: "Script to analyze profile sizes" },
                { tool: "ProcMon", description: "Trace file access during logon issues" }
            ]
        },
        
        cmmcDocumentation: [
            { artifact: "Storage Security", description: "Document share permissions, encryption, private endpoints", controls: "SC.L2-3.13.16, AC.L2-3.1.1" },
            { artifact: "Backup Configuration", description: "Document VHD backup strategy and retention", controls: "MP.L2-3.8.9" },
            { artifact: "Access Control", description: "Document who can access profile storage", controls: "AC.L2-3.1.2, AC.L2-3.1.3" },
            { artifact: "Encryption Settings", description: "Document BitLocker on VHD and SMB encryption in transit", controls: "SC.L2-3.13.8, SC.L2-3.13.16" }
        ]
    },

    // ========================================
    // PERSISTENT VS NON-PERSISTENT VDI
    // ========================================
    
    persistentVsNonPersistent: {
        comparison: {
            persistent: {
                name: "Persistent VDI",
                description: "User gets the same VM every session, changes persist",
                architecture: "1:1 mapping of user to VM",
                profileManagement: "Local profiles work, FSLogix optional",
                applications: "Install on each desktop or use app virtualization",
                
                pros: [
                    "Full desktop experience",
                    "No profile solution complexity",
                    "Works with poorly-designed apps",
                    "Users can personalize extensively",
                    "Simpler troubleshooting (dedicated VM)"
                ],
                cons: [
                    "Higher storage costs (full VM per user)",
                    "Patch management at scale",
                    "Longer provisioning time",
                    "No user density benefits",
                    "VM sprawl risk"
                ],
                
                bestFor: "Developers, power users, CAD/engineering, niche software requirements",
                
                costModel: {
                    compute: "VM runs during user hours (or always-on for quick access)",
                    storage: "Full OS disk (~128GB) + data per user",
                    example: "100 users x D4s_v5 ($140/mo) + 128GB Premium SSD ($19/mo) = $15,900/mo"
                }
            },
            nonPersistent: {
                name: "Non-Persistent VDI (Pooled)",
                description: "Users get a random VM from a pool, VM resets between sessions",
                architecture: "N:M mapping of users to VMs (multi-session or pooled single-session)",
                profileManagement: "FSLogix required for profile persistence",
                applications: "Baked into gold image or app virtualization (MSIX, App-V)",
                
                pros: [
                    "Lower compute costs (VM sharing)",
                    "Simplified patching (update gold image)",
                    "Consistent user experience",
                    "Reduced storage costs",
                    "Better security (clean state each session)"
                ],
                cons: [
                    "Profile solution required (FSLogix)",
                    "App compatibility testing needed",
                    "More complex troubleshooting",
                    "Some apps don't work well (per-machine installs)",
                    "Initial logon may be slower (profile attach)"
                ],
                
                bestFor: "Task workers, call center, standardized workloads, security-sensitive environments",
                
                costModel: {
                    compute: "Shared VMs with user density 10-25 users per host",
                    storage: "Shared OS disk + profile containers (smaller)",
                    example: "100 users / 15 per host = 7 hosts x D8s_v5 ($280/mo) + profiles = $2,500/mo"
                }
            }
        },
        
        costBenefitAnalysis: {
            factors: [
                {
                    factor: "User Count",
                    persistent: "Cost scales linearly with users",
                    nonPersistent: "Cost scales sub-linearly due to density",
                    breakeven: "Non-persistent almost always cheaper at scale"
                },
                {
                    factor: "User Workload",
                    persistent: "Better for inconsistent, heavy workloads",
                    nonPersistent: "Better for consistent, predictable workloads",
                    guidance: "Mix: pooled for task workers, persistent for power users"
                },
                {
                    factor: "Application Complexity",
                    persistent: "Handles any application",
                    nonPersistent: "Requires app compatibility testing",
                    guidance: "Test critical apps in non-persistent before committing"
                },
                {
                    factor: "Security Requirements",
                    persistent: "VM state persists (potential for malware persistence)",
                    nonPersistent: "Clean slate each session (better security posture)",
                    guidance: "Non-persistent preferred for CUI environments"
                },
                {
                    factor: "Management Overhead",
                    persistent: "More VMs to patch and maintain",
                    nonPersistent: "Update gold image, redeploy",
                    guidance: "Non-persistent significantly easier at scale"
                }
            ],
            
            recommendations: [
                {
                    scenario: "Small CUI user base (<25 users)",
                    recommendation: "Persistent may be simpler despite higher cost",
                    reasoning: "Profile solution complexity may not be worth it for small scale"
                },
                {
                    scenario: "Medium CUI user base (25-200 users)",
                    recommendation: "Non-persistent pooled with FSLogix",
                    reasoning: "Cost savings justify FSLogix complexity"
                },
                {
                    scenario: "Large CUI user base (200+ users)",
                    recommendation: "Non-persistent with tiered pools",
                    reasoning: "Significant savings, mature FSLogix deployment"
                },
                {
                    scenario: "Mixed workload types",
                    recommendation: "Hybrid: pooled for task workers, personal for power users",
                    reasoning: "Match solution to user needs"
                }
            ]
        },
        
        hybridApproach: {
            description: "Use different pool types for different user personas",
            implementation: [
                {
                    pool: "Task Worker Pool",
                    type: "Pooled multi-session",
                    users: "Email, web apps, basic Office",
                    density: "15-20 users per D8s_v5",
                    profile: "FSLogix Profile Container"
                },
                {
                    pool: "Knowledge Worker Pool",
                    type: "Pooled multi-session",
                    users: "Heavy Office, SharePoint, Teams",
                    density: "8-12 users per D8s_v5",
                    profile: "FSLogix with Office Container"
                },
                {
                    pool: "Power User Pool",
                    type: "Personal (dedicated)",
                    users: "Developers, analysts",
                    density: "1:1",
                    profile: "Local profiles, auto-start on connect"
                },
                {
                    pool: "Engineering Pool",
                    type: "Personal (GPU)",
                    users: "CAD, 3D modeling",
                    density: "1:1 with GPU",
                    profile: "Local profiles, large OS disk"
                }
            ]
        }
    },

    // ========================================
    // CMMC DOCUMENTATION FOR VDI
    // ========================================
    
    cmmcVdiDocumentation: {
        overview: "Documentation artifacts required for CMMC assessment of VDI environments",
        
        sspSections: [
            {
                section: "System Boundary",
                vdiContent: [
                    "Define VDI session hosts as part of CUI boundary",
                    "Document profile storage location and security",
                    "Define endpoint strategy (thin client, managed laptop, BYOD)",
                    "Document network segmentation of VDI infrastructure"
                ],
                artifacts: ["Network diagram", "System inventory", "Data flow diagram"]
            },
            {
                section: "System Components",
                vdiContent: [
                    "List all VDI infrastructure (connection brokers, session hosts, gateways)",
                    "Document VDI platform and version",
                    "List supporting infrastructure (storage, networking, identity)"
                ],
                artifacts: ["Hardware/software inventory", "Component diagram"]
            },
            {
                section: "User Roles",
                vdiContent: [
                    "Define VDI user roles and access levels",
                    "Document VDI administrator roles",
                    "Define privileged access for VDI management"
                ],
                artifacts: ["Role definitions", "Access matrix"]
            }
        ],
        
        controlEvidence: {
            accessControl: [
                { control: "AC.L2-3.1.1", evidence: "Conditional Access policies, host pool assignments, Entra ID group membership" },
                { control: "AC.L2-3.1.2", evidence: "Role-based access to different host pools, application groups" },
                { control: "AC.L2-3.1.3", evidence: "RDP policies restricting clipboard, drives, printers for CUI flow control" },
                { control: "AC.L2-3.1.12", evidence: "Gateway configuration, Conditional Access for remote access" },
                { control: "AC.L2-3.1.13", evidence: "TLS configuration for connection broker and gateway" }
            ],
            auditAccountability: [
                { control: "AU.L2-3.3.1", evidence: "Diagnostic settings for AVD/Citrix/VMware to Log Analytics or SIEM" },
                { control: "AU.L2-3.3.2", evidence: "User login/logout events, session duration, application usage" },
                { control: "AU.L2-3.3.4", evidence: "Alerting on audit log failures, log shipping monitoring" }
            ],
            configurationManagement: [
                { control: "CM.L2-3.4.1", evidence: "Gold image documentation, baseline configuration" },
                { control: "CM.L2-3.4.2", evidence: "STIG/CIS benchmark applied, VDI policy settings" },
                { control: "CM.L2-3.4.5", evidence: "Change management for gold image updates" },
                { control: "CM.L2-3.4.6", evidence: "Disabled services, removed features in gold image" }
            ],
            identification: [
                { control: "IA.L2-3.5.1", evidence: "Entra ID integration, user identification in VDI" },
                { control: "IA.L2-3.5.3", evidence: "MFA configuration for VDI access (Conditional Access)" },
                { control: "IA.L2-3.5.4", evidence: "Token-based auth for broker, SAML integration" }
            ],
            systemProtection: [
                { control: "SC.L2-3.13.1", evidence: "VDI network segmentation, firewall rules, gateway config" },
                { control: "SC.L2-3.13.8", evidence: "TLS for management plane, ICA/RDP encryption, profile traffic encryption" },
                { control: "SC.L2-3.13.11", evidence: "FIPS-validated cryptography settings in VDI platform" },
                { control: "SC.L2-3.13.16", evidence: "Profile container encryption, OS disk encryption" }
            ],
            integrity: [
                { control: "SI.L2-3.14.1", evidence: "Session host patch management, gold image update schedule" },
                { control: "SI.L2-3.14.2", evidence: "Endpoint protection on session hosts (Defender, CrowdStrike)" },
                { control: "SI.L2-3.14.6", evidence: "Network monitoring for VDI traffic, anomaly detection" }
            ]
        },
        
        // Enhanced Assessment Questions with Controls and Technical Implementation
        assessmentQuestionsEnhanced: [
            {
                question: "How do you prevent CUI from being extracted from VDI sessions?",
                answer: "Clipboard, drive, and printer redirection are disabled. Screen watermarking is enabled. DLP policies scan for CUI content. USB device filtering blocks removable media.",
                controls: ["3.1.3", "3.1.21", "3.8.7"],
                controlDescriptions: {
                    "3.1.3": "Control CUI flow in accordance with approved authorizations",
                    "3.1.21": "Limit use of portable storage devices on external systems",
                    "3.8.7": "Control the use of removable media on system components"
                },
                technicalImplementation: {
                    windowsGPO: [
                        { setting: "Disable Clipboard Redirection", path: "Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Device and Resource Redirection > Do not allow Clipboard redirection", value: "Enabled" },
                        { setting: "Disable Drive Redirection", path: "Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Device and Resource Redirection > Do not allow drive redirection", value: "Enabled" },
                        { setting: "Disable Printer Redirection", path: "Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Printer Redirection > Do not allow client printer redirection", value: "Enabled" },
                        { setting: "Block USB Storage", path: "Computer Configuration > Administrative Templates > System > Removable Storage Access > All Removable Storage classes: Deny all access", value: "Enabled" }
                    ],
                    windowsRegistry: [
                        { key: "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Terminal Services", value: "fDisableClip", data: "1 (DWORD)", description: "Disable clipboard redirection" },
                        { key: "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Terminal Services", value: "fDisableCdm", data: "1 (DWORD)", description: "Disable drive mapping" },
                        { key: "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Terminal Services", value: "fDisableCpm", data: "1 (DWORD)", description: "Disable printer mapping" },
                        { key: "HKLM\\SYSTEM\\CurrentControlSet\\Services\\USBSTOR", value: "Start", data: "4 (DWORD)", description: "Disable USB storage driver" }
                    ],
                    avd: [
                        { setting: "RDP Properties", config: "redirectclipboard:i:0;drivestoredirect:s:;redirectprinters:i:0", location: "Host Pool > RDP Properties" },
                        { setting: "Screen Capture Protection", config: "Enable via Intune or GPO on session hosts", location: "Session Host Policy" },
                        { setting: "Watermarking", config: "Enable via third-party or custom solution", location: "Application" }
                    ],
                    citrix: [
                        { setting: "Client Clipboard Redirection", config: "Prohibited", location: "Citrix Policy > ICA > Client Clipboard Redirection" },
                        { setting: "Client Drive Redirection", config: "Prohibited", location: "Citrix Policy > ICA > File Redirection > Client Drive Redirection" },
                        { setting: "Auto Connect Client Drives", config: "Prohibited", location: "Citrix Policy > ICA > File Redirection" },
                        { setting: "Session Watermark", config: "Enabled with username", location: "Citrix Policy > ICA > Graphics > Session Watermark" },
                        { setting: "App Protection", config: "Anti-screen capture enabled", location: "Delivery Group > App Protection" }
                    ],
                    vmware: [
                        { setting: "Clipboard Redirection", config: "Disabled or Server to Client only", location: "Horizon Admin > Settings > Global Policies" },
                        { setting: "Client Drive Redirection", config: "Disabled", location: "Horizon Admin > Settings > Global Policies" },
                        { setting: "USB Redirection", config: "Disabled or filtered", location: "Horizon Admin > Settings > Global Policies > USB Settings" },
                        { setting: "Digital Watermark", config: "Enabled", location: "Horizon Admin > Settings > Global Settings > Security Settings" }
                    ],
                    igel: [
                        { setting: "USB Device Control", config: "Block storage class devices", location: "UMS > Profiles > Devices > USB Access Control" },
                        { setting: "Clipboard", config: "Disable local clipboard", location: "UMS > Profiles > Sessions > [Protocol] > Clipboard" },
                        { setting: "Drive Mapping", config: "Disable local drive mapping", location: "UMS > Profiles > Sessions > [Protocol] > Drives" }
                    ]
                }
            },
            {
                question: "How are VDI session hosts patched?",
                answer: "For non-persistent: Gold image updated monthly via automated pipeline, session hosts redeployed from new image. For persistent: Intune/WSUS patch management with compliance reporting.",
                controls: ["3.14.1", "3.4.1", "3.4.5"],
                controlDescriptions: {
                    "3.14.1": "Identify, report, and correct system flaws in a timely manner",
                    "3.4.1": "Establish and maintain baseline configurations and inventories",
                    "3.4.5": "Define, document, approve, and enforce physical and logical access restrictions"
                },
                technicalImplementation: {
                    windowsGPO: [
                        { setting: "Configure Automatic Updates", path: "Computer Configuration > Administrative Templates > Windows Components > Windows Update > Configure Automatic Updates", value: "Enabled - Auto download and schedule install" },
                        { setting: "WSUS Server", path: "Computer Configuration > Administrative Templates > Windows Components > Windows Update > Specify intranet Microsoft update service location", value: "https://wsus.domain.com:8531" }
                    ],
                    windowsRegistry: [
                        { key: "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate", value: "WUServer", data: "https://wsus.domain.com:8531", description: "WSUS server URL" },
                        { key: "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU", value: "UseWUServer", data: "1 (DWORD)", description: "Use WSUS server" }
                    ],
                    avd: [
                        { setting: "Image Update", config: "Azure Image Builder pipeline with monthly schedule", location: "Azure DevOps / Image Builder" },
                        { setting: "Session Host Replacement", config: "Drain mode > Delete > Redeploy from new image", location: "Host Pool > Session Hosts" },
                        { setting: "Intune Patching", config: "Windows Update for Business ring deployment", location: "Intune > Devices > Windows 10 update rings" }
                    ],
                    citrix: [
                        { setting: "MCS Image Update", config: "Update master image > Update machines", location: "Machine Catalog > Update Machines" },
                        { setting: "PVS vDisk Update", config: "Create new vDisk version > Promote to production", location: "PVS Console > vDisk Versioning" },
                        { setting: "CVAD Patching", config: "Schedule maintenance window in Director", location: "Citrix Director > Scheduling" }
                    ],
                    vmware: [
                        { setting: "Instant Clone Update", config: "Update parent VM > Push to pool", location: "Horizon Console > Desktop Pool > Instant Clone Maintenance" },
                        { setting: "Linked Clone Recompose", config: "New snapshot > Recompose pool", location: "Horizon Console > Desktop Pool > Recompose" },
                        { setting: "App Volumes Update", config: "Update AppStack > Assign new version", location: "App Volumes Manager" }
                    ],
                    igel: [
                        { setting: "Firmware Update", config: "Schedule firmware deployment", location: "UMS > Scheduled Jobs > Firmware Update" },
                        { setting: "Profile Update", config: "Assign updated profile > Reboot", location: "UMS > Profiles > Assign" }
                    ]
                }
            },
            {
                question: "How is user activity in VDI sessions logged?",
                answer: "VDI diagnostic logs sent to Log Analytics/SIEM. Session recording enabled for privileged users. Windows Event logs forwarded from session hosts.",
                controls: ["3.3.1", "3.3.2", "3.3.4"],
                controlDescriptions: {
                    "3.3.1": "Create and retain system audit logs and records",
                    "3.3.2": "Ensure actions of individual system users can be uniquely traced",
                    "3.3.4": "Alert in the event of an audit logging process failure"
                },
                technicalImplementation: {
                    windowsGPO: [
                        { setting: "Audit Logon Events", path: "Computer Configuration > Windows Settings > Security Settings > Advanced Audit Policy Configuration > Logon/Logoff > Audit Logon", value: "Success, Failure" },
                        { setting: "Audit Process Creation", path: "Computer Configuration > Windows Settings > Security Settings > Advanced Audit Policy Configuration > Detailed Tracking > Audit Process Creation", value: "Success" },
                        { setting: "Command Line in Process Events", path: "Computer Configuration > Administrative Templates > System > Audit Process Creation > Include command line in process creation events", value: "Enabled" },
                        { setting: "Event Log Size", path: "Computer Configuration > Windows Settings > Security Settings > Event Log > Security Log > Maximum Log Size", value: "4194240 KB" }
                    ],
                    windowsRegistry: [
                        { key: "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System\\Audit", value: "ProcessCreationIncludeCmdLine_Enabled", data: "1 (DWORD)", description: "Include command line in audit" },
                        { key: "HKLM\\SYSTEM\\CurrentControlSet\\Services\\EventLog\\Security", value: "MaxSize", data: "4194240 (DWORD)", description: "Security log max size" }
                    ],
                    avd: [
                        { setting: "Diagnostic Settings", config: "Send to Log Analytics workspace", location: "Host Pool > Diagnostic Settings" },
                        { setting: "Categories", config: "Checkpoint, Connection, Error, HostRegistration, Management", location: "Diagnostic Settings > Categories" },
                        { setting: "Azure Monitor Agent", config: "Deploy AMA to session hosts", location: "Azure Monitor > Data Collection Rules" },
                        { setting: "Microsoft Sentinel", config: "Enable AVD connector", location: "Sentinel > Data Connectors" }
                    ],
                    citrix: [
                        { setting: "Session Recording", config: "Enable for target users/groups", location: "Session Recording Policy > Recording" },
                        { setting: "CVAD Logging", config: "Enable Configuration Logging", location: "Citrix Studio > Logging" },
                        { setting: "OData Export", config: "Export to SIEM via OData API", location: "Citrix Director > OData" },
                        { setting: "Citrix Analytics", config: "Enable Security Analytics", location: "Citrix Cloud > Analytics" }
                    ],
                    vmware: [
                        { setting: "Event Database", config: "Configure event database connection", location: "Horizon Console > View Configuration > Event Configuration" },
                        { setting: "Syslog Integration", config: "Forward events to SIEM", location: "vCenter > Configure > Syslog" },
                        { setting: "Session Recording", config: "Third-party integration (Teramind, ObserveIT)", location: "VDA Agent" }
                    ],
                    igel: [
                        { setting: "System Logging", config: "Enable remote syslog", location: "UMS > Profiles > System > Logging > Remote Syslog" },
                        { setting: "UMS Logging", config: "Enable database logging", location: "UMS > Global Configuration > Logging" }
                    ]
                }
            },
            {
                question: "How do you ensure only authorized users access CUI in VDI?",
                answer: "Conditional Access requires MFA, compliant/managed device, and approved location. Host pool assignment via Entra ID groups with access reviews.",
                controls: ["3.1.1", "3.1.2", "3.5.3"],
                controlDescriptions: {
                    "3.1.1": "Limit system access to authorized users, processes, and devices",
                    "3.1.2": "Limit system access to the types of transactions and functions that authorized users are permitted to execute",
                    "3.5.3": "Use multifactor authentication for local and network access to privileged accounts and for network access to non-privileged accounts"
                },
                technicalImplementation: {
                    windowsGPO: [
                        { setting: "Deny Log On Locally", path: "Computer Configuration > Windows Settings > Security Settings > Local Policies > User Rights Assignment > Deny log on locally", value: "Add unauthorized groups" },
                        { setting: "Deny Access from Network", path: "Computer Configuration > Windows Settings > Security Settings > Local Policies > User Rights Assignment > Deny access to this computer from the network", value: "Add unauthorized groups" }
                    ],
                    windowsRegistry: [
                        { key: "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System", value: "DontDisplayLastUserName", data: "1 (DWORD)", description: "Don't display last user" },
                        { key: "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System", value: "LegalNoticeCaption", data: "CUI System Warning", description: "Logon banner title" }
                    ],
                    avd: [
                        { setting: "Conditional Access", config: "Require MFA + Compliant Device + Approved Location", location: "Entra ID > Conditional Access > New Policy" },
                        { setting: "Target Apps", config: "Windows Virtual Desktop + Azure Virtual Desktop", location: "Conditional Access > Cloud Apps" },
                        { setting: "Application Group Assignment", config: "Entra ID Security Group", location: "AVD > Application Group > Assignments" },
                        { setting: "Access Reviews", config: "Quarterly review of group membership", location: "Entra ID > Identity Governance > Access Reviews" }
                    ],
                    citrix: [
                        { setting: "SmartAccess", config: "Require compliant endpoint", location: "Citrix Gateway > Session Policies > SmartAccess" },
                        { setting: "Delivery Group Access", config: "AD Security Group assignment", location: "Citrix Studio > Delivery Group > Users" },
                        { setting: "SAML/OIDC", config: "Federate with Entra ID for SSO + MFA", location: "Citrix Cloud > Identity and Access Management" },
                        { setting: "Contextual Access", config: "Location/device-based policies", location: "Citrix Workspace > Access Policies" }
                    ],
                    vmware: [
                        { setting: "Entitlements", config: "AD Group-based desktop entitlements", location: "Horizon Console > Users and Groups > Entitlements" },
                        { setting: "SAML Authentication", config: "Integrate with Entra ID", location: "Horizon Console > Settings > SAML 2.0 Authentication" },
                        { setting: "UAG MFA", config: "RADIUS integration for MFA", location: "UAG Admin > Authentication Settings" },
                        { setting: "Compliance Check", config: "Endpoint compliance via Workspace ONE", location: "Workspace ONE UEM" }
                    ],
                    igel: [
                        { setting: "Certificate Authentication", config: "Require device certificate", location: "UMS > Profiles > Security > Certificates" },
                        { setting: "Allowed Users", config: "Restrict local login", location: "UMS > Profiles > Security > Local Security > Users" }
                    ]
                }
            },
            {
                question: "Where is user data stored in VDI?",
                answer: "User profiles in FSLogix containers on encrypted Azure Files (or specified storage). No CUI stored locally on session hosts. OneDrive KFM for user files with DLP.",
                controls: ["3.13.16", "3.8.9", "3.1.3"],
                controlDescriptions: {
                    "3.13.16": "Protect the confidentiality of CUI at rest",
                    "3.8.9": "Protect the confidentiality of backup CUI at storage locations",
                    "3.1.3": "Control CUI flow in accordance with approved authorizations"
                },
                technicalImplementation: {
                    windowsGPO: [
                        { setting: "Folder Redirection", path: "User Configuration > Windows Settings > Folder Redirection > Documents", value: "Redirect to network share" },
                        { setting: "Offline Files Disabled", path: "Computer Configuration > Administrative Templates > Network > Offline Files > Allow or Disallow use of Offline Files feature", value: "Disabled" }
                    ],
                    windowsRegistry: [
                        { key: "HKLM\\SOFTWARE\\FSLogix\\Profiles", value: "Enabled", data: "1 (DWORD)", description: "Enable FSLogix" },
                        { key: "HKLM\\SOFTWARE\\FSLogix\\Profiles", value: "VHDLocations", data: "\\\\storage\\profiles$", description: "Profile storage path" },
                        { key: "HKLM\\SOFTWARE\\Policies\\Microsoft\\OneDrive", value: "KFMSilentOptIn", data: "{TenantID}", description: "OneDrive KFM silent opt-in" }
                    ],
                    avd: [
                        { setting: "Azure Files", config: "Premium tier with Private Endpoint", location: "Storage Account > File Shares" },
                        { setting: "AD Authentication", config: "Enable AD DS or Entra DS auth", location: "Storage Account > File Shares > Active Directory" },
                        { setting: "Encryption", config: "Customer-managed keys (optional)", location: "Storage Account > Encryption" },
                        { setting: "FSLogix VHDLocations", config: "\\\\storageacct.file.core.windows.net\\profiles", location: "Session Host GPO/Intune" },
                        { setting: "OneDrive KFM", config: "Redirect Desktop, Documents, Pictures", location: "Intune > OneDrive Configuration" }
                    ],
                    citrix: [
                        { setting: "Profile Management Path", config: "UNC to encrypted share", location: "Citrix Policy > Profile Management > Path to user store" },
                        { setting: "Profile Streaming", config: "Enabled for fast logon", location: "Citrix Policy > Profile Management > Streamed user profiles" },
                        { setting: "Azure Files for Citrix", config: "NetApp Files or Azure Files", location: "Storage infrastructure" },
                        { setting: "Folder Redirection", config: "Redirect to secured share", location: "Citrix Policy > Profile Management > Folder Redirection" }
                    ],
                    vmware: [
                        { setting: "DEM Profile Path", config: "UNC path to encrypted share", location: "DEM Management Console > Configuration" },
                        { setting: "Profile Archive Path", config: "Separate archive location", location: "DEM > Profile Archive" },
                        { setting: "vSAN Encryption", config: "Enable data-at-rest encryption", location: "vCenter > vSAN > Services > Encryption" }
                    ],
                    igel: [
                        { setting: "No Local Storage", config: "Disable local user data", location: "UMS > Profiles > Sessions > Local Storage = Disabled" },
                        { setting: "Hotplug Disabled", config: "Block local device attachment", location: "UMS > Profiles > Devices > Hotplug" }
                    ]
                }
            },
            {
                question: "How do you secure remote access to the VDI environment?",
                answer: "VDI gateway with TLS 1.2+, split tunneling disabled, session timeout enforced. Only approved protocols allowed through firewall.",
                controls: ["3.1.12", "3.1.13", "3.13.7", "3.13.8"],
                controlDescriptions: {
                    "3.1.12": "Monitor and control remote access sessions",
                    "3.1.13": "Employ cryptographic mechanisms to protect the confidentiality of remote access sessions",
                    "3.13.7": "Prevent remote devices from simultaneously establishing non-remote connections with organizational systems and communicating via some other connection to resources in external networks (split tunneling)",
                    "3.13.8": "Implement cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission"
                },
                technicalImplementation: {
                    windowsGPO: [
                        { setting: "RDP Encryption Level", path: "Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Security > Set client connection encryption level", value: "High Level" },
                        { setting: "Require NLA", path: "Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Security > Require user authentication for remote connections by using NLA", value: "Enabled" },
                        { setting: "TLS 1.2 Only", path: "Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Security > Require use of specific security layer for remote (RDP) connections", value: "SSL (TLS 1.2)" }
                    ],
                    windowsRegistry: [
                        { key: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.0\\Server", value: "Enabled", data: "0 (DWORD)", description: "Disable TLS 1.0" },
                        { key: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.1\\Server", value: "Enabled", data: "0 (DWORD)", description: "Disable TLS 1.1" },
                        { key: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.2\\Server", value: "Enabled", data: "1 (DWORD)", description: "Enable TLS 1.2" },
                        { key: "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Terminal Services", value: "MinEncryptionLevel", data: "3 (DWORD)", description: "High encryption level" }
                    ],
                    avd: [
                        { setting: "RDP Shortpath", config: "Enable for managed networks only", location: "Host Pool > RDP Properties" },
                        { setting: "Private Endpoints", config: "Private Link for workspace and hostpool", location: "AVD > Private Endpoints" },
                        { setting: "Conditional Access", config: "Block from untrusted networks", location: "Entra ID > Conditional Access" },
                        { setting: "Session Timeout", config: "Disconnect after inactivity", location: "RDP Properties: autoreconnection enabled:i:0" }
                    ],
                    citrix: [
                        { setting: "Gateway SSL", config: "TLS 1.2 only, strong ciphers", location: "NetScaler > SSL > SSL Profile" },
                        { setting: "ICA Encryption", config: "SecureICA RC5-128 minimum", location: "Citrix Policy > ICA > Security > SecureICA encryption" },
                        { setting: "Gateway SmartAccess", config: "EPA scans before connection", location: "NetScaler > Gateway > Policies" },
                        { setting: "Session Timeout", config: "Configure idle and session limits", location: "Citrix Policy > ICA > Session Limits" }
                    ],
                    vmware: [
                        { setting: "UAG TLS", config: "TLS 1.2 only", location: "UAG Admin > TLS Configuration" },
                        { setting: "Blast Secure Gateway", config: "Enable BSG", location: "Horizon Console > Settings > Servers" },
                        { setting: "PCoIP Security", config: "AES-256-GCM encryption", location: "Horizon Admin > Global Settings > Security" },
                        { setting: "Session Timeout", config: "Configure via GPO or Horizon policy", location: "Horizon Console > Global Policies" }
                    ],
                    igel: [
                        { setting: "VPN Split Tunnel", config: "Disabled - all traffic through VPN", location: "UMS > Profiles > Network > VPN" },
                        { setting: "TLS Version", config: "Minimum TLS 1.2", location: "UMS > Profiles > Security > TLS" },
                        { setting: "Session Lock", config: "Auto-lock after inactivity", location: "UMS > Profiles > Security > Screen Lock" }
                    ]
                }
            },
            {
                question: "How do you protect the VDI environment from malware?",
                answer: "EDR/AV on all session hosts (Defender for Endpoint or equivalent). Application control via AppLocker/WDAC. Network-level scanning at firewall.",
                controls: ["3.14.2", "3.14.4", "3.14.5", "3.4.8"],
                controlDescriptions: {
                    "3.14.2": "Provide protection from malicious code at designated locations",
                    "3.14.4": "Update malicious code protection mechanisms when new releases are available",
                    "3.14.5": "Perform periodic scans of organizational systems and real-time scans of files from external sources",
                    "3.4.8": "Apply deny-by-exception (blacklisting) policy to prevent the use of unauthorized software"
                },
                technicalImplementation: {
                    windowsGPO: [
                        { setting: "Windows Defender AV", path: "Computer Configuration > Administrative Templates > Windows Components > Microsoft Defender Antivirus > Real-time Protection > Turn on real-time protection", value: "Enabled" },
                        { setting: "Cloud Protection", path: "Computer Configuration > Administrative Templates > Windows Components > Microsoft Defender Antivirus > MAPS > Join Microsoft MAPS", value: "Enabled - Advanced MAPS" },
                        { setting: "AppLocker", path: "Computer Configuration > Windows Settings > Security Settings > Application Control Policies > AppLocker", value: "Configure rules" },
                        { setting: "WDAC", path: "Computer Configuration > Administrative Templates > System > Device Guard > Deploy Code Integrity Policies", value: "Enable with policy file" }
                    ],
                    windowsRegistry: [
                        { key: "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender", value: "DisableAntiSpyware", data: "0 (DWORD)", description: "Ensure Defender enabled" },
                        { key: "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender\\Real-Time Protection", value: "DisableRealtimeMonitoring", data: "0 (DWORD)", description: "Real-time protection on" }
                    ],
                    avd: [
                        { setting: "Defender for Endpoint", config: "Onboard via Intune or GPO", location: "Intune > Endpoint Security > Endpoint Detection and Response" },
                        { setting: "Attack Surface Reduction", config: "Enable ASR rules", location: "Intune > Endpoint Security > Attack Surface Reduction" },
                        { setting: "Application Control", config: "WDAC or AppLocker policy", location: "Intune > Configuration Profiles > Templates > Device Control" }
                    ],
                    citrix: [
                        { setting: "VDA AV Optimization", config: "Configure exclusions for Citrix", location: "AV product > Exclusions" },
                        { setting: "App Protection", config: "Anti-keylogging, anti-screen capture", location: "Delivery Group > App Protection" },
                        { setting: "Workspace App Security", config: "App Protection enabled on client", location: "Citrix Workspace App > Advanced Preferences" }
                    ],
                    vmware: [
                        { setting: "Carbon Black Integration", config: "Deploy CB sensor to VDI", location: "Carbon Black Console" },
                        { setting: "vShield/NSX Malware", config: "Agentless AV scanning", location: "NSX > Security > Endpoint Protection" },
                        { setting: "App Volumes Exclusions", config: "Exclude writable volumes from AV", location: "AV product > Exclusions" }
                    ],
                    igel: [
                        { setting: "Read-Only OS", config: "Default - OS cannot be modified", location: "Built-in protection" },
                        { setting: "Secure Boot", config: "Enable secure boot", location: "UMS > Profiles > Security > Secure Boot" },
                        { setting: "Application Whitelist", config: "Only approved apps run", location: "UMS > Profiles > Sessions > Applications" }
                    ]
                }
            }
        ],
        
        assessmentPrep: {
            commonQuestions: [
                {
                    question: "How do you prevent CUI from being extracted from VDI sessions?",
                    answer: "Clipboard, drive, and printer redirection are disabled. Screen watermarking is enabled. DLP policies scan for CUI content. USB device filtering blocks removable media."
                },
                {
                    question: "How are VDI session hosts patched?",
                    answer: "For non-persistent: Gold image updated monthly via automated pipeline, session hosts redeployed from new image. For persistent: Intune/WSUS patch management with compliance reporting."
                },
                {
                    question: "How is user activity in VDI sessions logged?",
                    answer: "VDI diagnostic logs sent to Log Analytics/SIEM. Session recording enabled for privileged users. Windows Event logs forwarded from session hosts."
                },
                {
                    question: "How do you ensure only authorized users access CUI in VDI?",
                    answer: "Conditional Access requires MFA, compliant/managed device, and approved location. Host pool assignment via Entra ID groups with access reviews."
                },
                {
                    question: "Where is user data stored in VDI?",
                    answer: "User profiles in FSLogix containers on encrypted Azure Files (or specified storage). No CUI stored locally on session hosts. OneDrive KFM for user files with DLP."
                }
            ],
            
            documentChecklist: [
                { document: "VDI Architecture Diagram", status: "Required", description: "Show all components, network flows, storage locations" },
                { document: "RDP/ICA Policy Export", status: "Required", description: "Prove redirection restrictions" },
                { document: "Conditional Access Policy Screenshots", status: "Required", description: "Show MFA and device compliance requirements" },
                { document: "Gold Image Build Documentation", status: "Required", description: "Show STIG baseline, installed software, hardening" },
                { document: "FSLogix Configuration Export", status: "Required", description: "Show profile storage settings, encryption" },
                { document: "SIEM Integration Proof", status: "Required", description: "Show logs flowing to SIEM, retention settings" },
                { document: "Patch Management Records", status: "Required", description: "Show image update schedule, compliance reports" },
                { document: "VDI User Access List", status: "Required", description: "Export Entra ID group membership" },
                { document: "Session Host Vulnerability Scans", status: "Required", description: "Recent scan results for gold image or session hosts" },
                { document: "DR/BC Documentation", status: "Recommended", description: "VDI recovery procedures, profile backup" }
            ]
        }
    },

    // ========================================
    // COST MANAGEMENT DEEP DIVE
    // ========================================
    
    costManagementDeepDive: {
        azure: {
            name: "Azure Cost Management for AVD",
            strategies: [
                {
                    name: "Scaling Plans",
                    description: "Automatically scale session hosts based on schedule and demand",
                    configuration: [
                        "Ramp-up: 7 AM, increase capacity for morning login surge",
                        "Peak hours: 9 AM - 5 PM, maintain capacity based on load",
                        "Ramp-down: 5 PM, start draining and shutting down",
                        "Off-hours: 7 PM - 7 AM, minimum hosts for emergency access"
                    ],
                    savings: "40-60% compute cost reduction vs always-on"
                },
                {
                    name: "Start VM on Connect",
                    description: "Personal desktops start when user connects",
                    bestFor: "Personal desktop pools",
                    savings: "30-50% vs always-on personal desktops"
                },
                {
                    name: "Reserved Instances",
                    description: "1-year or 3-year commitment for steady-state VMs",
                    savings: "1-year: 30-40%, 3-year: 50-60%",
                    recommendation: "Reserve minimum required capacity, use PAYG for burst"
                },
                {
                    name: "Spot Instances",
                    description: "Deeply discounted VMs with eviction risk",
                    bestFor: "Dev/test VDI, non-critical burst capacity",
                    savings: "Up to 90% discount",
                    warning: "NOT for production CUI workloads"
                },
                {
                    name: "Azure Hybrid Benefit",
                    description: "Use existing Windows Server licenses",
                    savings: "Up to 40% on Windows VMs",
                    requirement: "Windows Server with active SA or subscription"
                }
            ],
            monitoring: {
                tools: ["Azure Cost Management + Billing", "AVD Insights workbook", "Azure Advisor"],
                metrics: [
                    "Cost per user per month",
                    "Session host utilization",
                    "Idle time percentage",
                    "Profile storage growth"
                ],
                alerts: [
                    "Budget threshold alerts (50%, 75%, 90%)",
                    "Anomaly detection for unusual spending",
                    "Unattached disk alerts",
                    "Over-provisioned VM alerts"
                ]
            }
        },
        
        aws: {
            name: "AWS Cost Management for WorkSpaces",
            strategies: [
                {
                    name: "AutoStop Mode",
                    description: "WorkSpaces stop after idle period, restart on connect",
                    default: "Enabled by default for hourly bundles",
                    savings: "Significant for part-time users"
                },
                {
                    name: "Billing Mode Selection",
                    description: "Choose hourly vs monthly billing per WorkSpace",
                    hourly: "Best for users < 80 hours/month",
                    monthly: "Best for users > 80 hours/month (always-on)",
                    automation: "Use WorkSpaces Cost Optimizer to auto-switch"
                },
                {
                    name: "Reserved Bundles",
                    description: "Commit to 1-year term for monthly billing WorkSpaces",
                    savings: "Up to 50% vs on-demand monthly"
                },
                {
                    name: "Bundle Right-Sizing",
                    description: "Match bundle to actual user workload",
                    analysis: "Use CloudWatch metrics to identify over-provisioned bundles",
                    action: "Downgrade Value users using Standard bundles"
                }
            ],
            monitoring: {
                tools: ["AWS Cost Explorer", "CloudWatch", "WorkSpaces Events"],
                metrics: [
                    "WorkSpaces running hours",
                    "Connection success rate",
                    "Monthly active users vs provisioned",
                    "Bundle utilization (CPU, memory)"
                ]
            }
        },
        
        onPrem: {
            name: "On-Premises VDI Cost Management",
            strategies: [
                {
                    name: "Right-Sized Hardware",
                    description: "Match server specs to actual VDI density requirements",
                    analysis: "Pilot with monitoring before full deployment",
                    tip: "Budget for 25% growth headroom"
                },
                {
                    name: "Hyper-Converged Infrastructure",
                    description: "vSAN, Nutanix, or Azure Stack HCI for simplified management",
                    advantages: "Reduced storage costs, easier scaling",
                    considerations: "Upfront cost vs long-term OpEx savings"
                },
                {
                    name: "License Optimization",
                    description: "Right-size Windows, Citrix, VMware licensing",
                    perDevice: "Citrix/VMware per-CCU licensing for shift workers",
                    perUser: "Better for dedicated users with multiple devices"
                },
                {
                    name: "Power Management",
                    description: "Server and storage power savings",
                    actions: ["Consolidate workloads", "Power off unused hosts", "Use efficient cooling"]
                }
            ],
            tcoBudgeting: {
                categories: [
                    { category: "Hardware", items: ["Servers", "Storage", "Networking", "Endpoints"], lifecycle: "3-5 years" },
                    { category: "Software", items: ["VDI platform", "OS licenses", "CALs", "Security tools"], lifecycle: "Annual" },
                    { category: "Facilities", items: ["Power", "Cooling", "Rack space", "Physical security"], lifecycle: "Monthly" },
                    { category: "Personnel", items: ["VDI admins", "Helpdesk", "Security team"], lifecycle: "Annual" }
                ]
            }
        },
        
        crossPlatformComparison: {
            description: "Compare TCO across VDI platforms",
            template: [
                {
                    lineItem: "Compute",
                    azure: "VM cost x hours",
                    aws: "Bundle pricing",
                    onPrem: "Server amortization"
                },
                {
                    lineItem: "Storage",
                    azure: "Premium SSD + Azure Files",
                    aws: "Included in bundle (root), extra for user",
                    onPrem: "SAN/vSAN cost"
                },
                {
                    lineItem: "Networking",
                    azure: "Egress, Private Endpoints, Firewall",
                    aws: "NAT Gateway, Direct Connect",
                    onPrem: "WAN, internet, DMZ"
                },
                {
                    lineItem: "Licensing",
                    azure: "Included with M365/Windows E3+",
                    aws: "WorkSpaces includes Windows (standard)",
                    onPrem: "Windows Server, VDI platform, CALs"
                },
                {
                    lineItem: "Management",
                    azure: "Included in Azure pricing",
                    aws: "Included in WorkSpaces",
                    onPrem: "Admin FTEs, management tools"
                }
            ]
        }
    },

    // ========================================
    // VDI ENDPOINTS DEEP DIVE
    // ========================================
    
    vdiEndpointsDeepDive: {
        overview: "Endpoint selection is critical for VDI success. The right endpoint reduces attack surface, simplifies management, and improves user experience.",
        
        // Thin Client Hardware
        thinClientHardware: {
            description: "Purpose-built devices for VDI/remote desktop access with minimal local attack surface",
            
            vendors: [
                {
                    vendor: "HP",
                    products: [
                        { model: "HP t640", specs: "AMD Ryzen R1505G, 8GB RAM, 64GB flash", useCase: "General VDI, dual-monitor support", priceRange: "$400-500" },
                        { model: "HP t740", specs: "AMD Ryzen V1756B, 8GB RAM, 128GB SSD", useCase: "Power users, graphics workloads", priceRange: "$600-800" },
                        { model: "HP t430", specs: "Intel Celeron, 4GB RAM, 32GB flash", useCase: "Task workers, cost-sensitive", priceRange: "$250-350" },
                        { model: "HP mt46", specs: "AMD Ryzen 3, 8GB RAM, mobile thin client", useCase: "Mobile workers, laptop form factor", priceRange: "$500-650" }
                    ],
                    osOptions: ["HP ThinPro (Linux-based)", "Windows 10 IoT Enterprise"],
                    management: "HP Device Manager for centralized management",
                    strengths: ["Wide product range", "Strong enterprise support", "Good build quality"]
                },
                {
                    vendor: "Dell Wyse",
                    products: [
                        { model: "Wyse 5070", specs: "Intel Celeron/Pentium, 4-8GB RAM", useCase: "General VDI, reliable workhorse", priceRange: "$350-500" },
                        { model: "Wyse 5470", specs: "Intel Celeron, 4GB RAM, mobile", useCase: "Mobile thin client laptop", priceRange: "$450-600" },
                        { model: "Wyse 5070 Extended", specs: "Intel Pentium, 8GB RAM, PCIe slot", useCase: "Expansion needs, graphics cards", priceRange: "$500-650" },
                        { model: "Wyse 3040", specs: "Intel Atom, 2GB RAM, 8GB flash", useCase: "Ultra-low cost, basic VDI", priceRange: "$200-280" }
                    ],
                    osOptions: ["Wyse ThinOS", "ThinLinux", "Windows 10 IoT"],
                    management: "Dell Wyse Management Suite (WMS)",
                    strengths: ["ThinOS is very secure (proprietary)", "Good Dell ecosystem integration", "Long lifecycle"]
                },
                {
                    vendor: "LG",
                    products: [
                        { model: "LG gram", specs: "Intel Core i5/i7, 16GB RAM, ultralight laptop", useCase: "Executive/mobile VDI access, also local work", priceRange: "$1,200-1,600" },
                        { model: "LG CL600N", specs: "Intel Celeron, 4GB RAM, Chromebook", useCase: "Chrome Enterprise + VDI client", priceRange: "$350-450" }
                    ],
                    osOptions: ["Windows 11 Pro", "Chrome OS"],
                    management: "Standard Windows/Chrome management",
                    strengths: ["Ultra-portable", "All-day battery", "Dual-use capability"]
                },
                {
                    vendor: "Lenovo",
                    products: [
                        { model: "ThinkCentre M75n", specs: "AMD Athlon, 4-8GB RAM, nano form", useCase: "Space-constrained, VESA mount", priceRange: "$350-450" },
                        { model: "ThinkCentre M90n", specs: "Intel Core i3/i5, 8GB RAM", useCase: "Higher performance thin client", priceRange: "$500-700" }
                    ],
                    osOptions: ["Windows 10 IoT Enterprise", "Linux"],
                    management: "Lenovo Device Manager",
                    strengths: ["ThinkCentre reliability", "Good port selection", "VESA mounting"]
                }
            ],
            
            selectionCriteria: [
                { factor: "Display Support", guidance: "Match to user needs (single, dual, 4K). Most thin clients support 2 displays." },
                { factor: "USB Ports", guidance: "Ensure enough for keyboard, mouse, headset, webcam. USB-C is increasingly common." },
                { factor: "Form Factor", guidance: "Desktop (VESA mount), mobile (laptop), or all-in-one" },
                { factor: "Processor", guidance: "Celeron/Atom for basic, Ryzen/Core for local decode or multimedia" },
                { factor: "Local Storage", guidance: "Minimal (16-64GB) for thin OS, more for hybrid use" },
                { factor: "Network", guidance: "Gigabit Ethernet required, Wi-Fi 6 for mobile. Dual NIC for network isolation." }
            ]
        },
        
        // Thin Client Software/OS
        thinClientSoftware: {
            description: "Operating systems and software that convert endpoints into secure VDI access points",
            
            solutions: [
                {
                    name: "IGEL OS",
                    type: "Linux-based endpoint OS",
                    description: "Read-only Linux OS designed specifically for VDI/DaaS access",
                    features: [
                        "Read-only OS (cannot be modified by malware)",
                        "Supports all major VDI platforms (AVD, Citrix, VMware, AWS)",
                        "USB device filtering and control",
                        "Smart card and biometric authentication",
                        "Integrated 2FA support",
                        "Secure boot and full disk encryption",
                        "Kiosk mode for locked-down access"
                    ],
                    management: {
                        tool: "IGEL Universal Management Suite (UMS)",
                        capabilities: ["Centralized configuration", "Profile-based management", "Remote firmware updates", "Asset tracking", "Shadow sessions for support"]
                    },
                    deployment: [
                        "Native on IGEL hardware",
                        "Convert existing PCs to IGEL (IGEL OS Creator)",
                        "USB boot (IGEL UD Pocket)"
                    ],
                    licensing: "Per-device subscription (~$50-100/year)",
                    cmmcRelevance: [
                        "AC.L2-3.1.1: Read-only OS limits local access",
                        "SC.L2-3.13.16: No local data storage capability",
                        "CM.L2-3.4.2: Centralized baseline enforcement",
                        "SI.L2-3.14.2: Minimal attack surface, no local malware persistence"
                    ],
                    bestFor: "Organizations wanting maximum endpoint security with managed thin clients"
                },
                {
                    name: "Dell Wyse ThinOS",
                    type: "Proprietary secure OS",
                    description: "Dell's proprietary thin client OS, extremely lightweight and secure",
                    features: [
                        "Proprietary OS (not based on Windows/Linux)",
                        "Boots in under 10 seconds",
                        "No local attack surface",
                        "Citrix and VMware native support",
                        "AVD support via browser"
                    ],
                    management: {
                        tool: "Wyse Management Suite (WMS)",
                        capabilities: ["Cloud or on-prem management", "Configuration policies", "Firmware updates", "Real-time monitoring"]
                    },
                    deployment: ["Dell Wyse hardware only"],
                    licensing: "Included with Dell Wyse hardware",
                    cmmcRelevance: [
                        "Proprietary OS has extremely small attack surface",
                        "No local user accounts or data storage",
                        "Centralized management for baseline enforcement"
                    ],
                    bestFor: "Dell shops wanting simplest possible thin client with Citrix/VMware"
                },
                {
                    name: "HP ThinPro",
                    type: "Linux-based endpoint OS",
                    description: "HP's Linux-based thin client OS for HP thin client hardware",
                    features: [
                        "Lightweight Linux kernel",
                        "Support for Citrix, VMware, AVD, RDP",
                        "Imprivata OneSign integration",
                        "Smart card and proximity badge support",
                        "Write filter for OS protection"
                    ],
                    management: {
                        tool: "HP Device Manager",
                        capabilities: ["Central configuration", "Group policies", "Software deployment", "Remote troubleshooting"]
                    },
                    deployment: ["HP thin client hardware only"],
                    licensing: "Included with HP thin client hardware",
                    cmmcRelevance: [
                        "Write filter prevents persistent changes",
                        "Centralized management and configuration",
                        "Healthcare-grade authentication options"
                    ],
                    bestFor: "HP hardware customers, healthcare with Imprivata needs"
                },
                {
                    name: "Windows 10/11 IoT Enterprise",
                    type: "Locked-down Windows",
                    description: "Windows with enterprise lockdown features for kiosk/thin client use",
                    features: [
                        "Full Windows compatibility",
                        "Unified Write Filter (UWF) for protection",
                        "AppLocker/WDAC for application control",
                        "Assigned Access (kiosk mode)",
                        "Shell Launcher for custom shell"
                    ],
                    management: {
                        tool: "Intune, SCCM, or third-party",
                        capabilities: ["Standard Windows management", "GPO/MDM policies", "Windows Update for Business"]
                    },
                    deployment: ["Any compatible hardware"],
                    licensing: "OEM or volume licensing",
                    cmmcRelevance: [
                        "UWF provides malware resilience (reboot to clean state)",
                        "Full STIG available for Windows 10/11",
                        "Native Intune/Entra ID integration"
                    ],
                    bestFor: "Organizations needing some local Windows apps alongside VDI"
                },
                {
                    name: "Chrome OS / ChromeOS Flex",
                    type: "Google's cloud-first OS",
                    description: "Lightweight, secure OS designed for web and cloud access",
                    features: [
                        "Verified boot (secure boot chain)",
                        "Automatic updates",
                        "Sandboxed browser",
                        "Native Citrix/VMware Workspace clients",
                        "Parallels Desktop for Chromebook (Windows apps)"
                    ],
                    management: {
                        tool: "Google Workspace / Chrome Enterprise",
                        capabilities: ["Zero-touch enrollment", "Policy management", "App deployment", "Remote wipe"]
                    },
                    deployment: ["Chromebooks (native)", "Any PC (ChromeOS Flex - free)"],
                    licensing: "Chrome Enterprise Upgrade (~$50/device/year)",
                    cmmcRelevance: [
                        "Verified boot ensures OS integrity",
                        "No local data (cloud-first)",
                        "Minimal management overhead"
                    ],
                    bestFor: "Google Workspace shops, web-app focused organizations"
                }
            ],
            
            comparisonTable: [
                { feature: "Attack Surface", igel: "Minimal (read-only)", thinOS: "Minimal (proprietary)", thinPro: "Low (Linux)", winIoT: "Medium (Windows)", chromeOS: "Low (sandboxed)" },
                { feature: "VDI Support", igel: "All platforms", thinOS: "Citrix, VMware, AVD", thinPro: "Citrix, VMware, AVD", winIoT: "All platforms", chromeOS: "Citrix, VMware, AVD" },
                { feature: "Hardware Lock-in", igel: "No (converts PCs)", thinOS: "Dell only", thinPro: "HP only", winIoT: "No", chromeOS: "No" },
                { feature: "Management Complexity", igel: "Medium", thinOS: "Low", thinPro: "Low", winIoT: "High", chromeOS: "Low" },
                { feature: "Local Apps", igel: "Limited", thinOS: "None", thinPro: "Limited", winIoT: "Full Windows", chromeOS: "Web + Android" },
                { feature: "STIG Available", igel: "Vendor hardening guide", thinOS: "Vendor hardening", thinPro: "Vendor hardening", winIoT: "Full DISA STIG", chromeOS: "CIS Benchmark" }
            ]
        },
        
        // Zero Client Options
        zeroClients: {
            description: "Hardware with no local OS - all processing done on VDI host. Smallest possible attack surface.",
            
            options: [
                {
                    vendor: "Teradici (HP)",
                    product: "Tera2 PCoIP Zero Clients",
                    description: "Hardware-based PCoIP clients for VMware Horizon",
                    features: ["No local OS", "Hardware PCoIP decode", "Dual 4K display support", "Smart card reader"],
                    limitation: "VMware Horizon with PCoIP only",
                    priceRange: "$300-500"
                },
                {
                    vendor: "Dell",
                    product: "Wyse 3030 LT Zero Client",
                    description: "Citrix HDX and VMware PCoIP support",
                    features: ["Dual display", "PoE option", "Very small form factor"],
                    limitation: "Citrix or VMware only",
                    priceRange: "$250-350"
                },
                {
                    vendor: "10ZiG",
                    product: "Zero Client Series",
                    description: "Purpose-built for VMware and Citrix",
                    features: ["Hardware-based protocol decode", "Lowest latency", "Fanless designs"],
                    limitation: "Specific VDI platform",
                    priceRange: "$300-450"
                }
            ],
            
            prosAndCons: {
                pros: [
                    "Absolute minimal attack surface (no OS)",
                    "Cannot be compromised (nothing to compromise)",
                    "Simple lifecycle (hardware only)",
                    "Lowest latency for real-time graphics"
                ],
                cons: [
                    "Locked to specific VDI platform",
                    "No flexibility for local tasks",
                    "Higher per-unit cost than repurposed PCs",
                    "Declining market (thin clients more flexible)"
                ]
            }
        },
        
        // Repurposing Existing Hardware
        repurposingHardware: {
            description: "Convert existing PCs and laptops into thin clients to extend hardware life and reduce costs",
            
            options: [
                {
                    solution: "IGEL OS Creator (UD Pocket)",
                    method: "Boot from USB to run IGEL OS",
                    hardware: "Any x86 PC with 2GB+ RAM",
                    cost: "~$50-100/year per device",
                    pros: ["Instant conversion", "No reimaging", "Boot from USB"],
                    cons: ["Requires USB boot capability", "Performance depends on host hardware"]
                },
                {
                    solution: "ChromeOS Flex",
                    method: "Install Google's free Chrome OS on existing PCs",
                    hardware: "Most PCs with 4GB+ RAM (check certified list)",
                    cost: "Free (Chrome Enterprise upgrade optional at ~$50/year)",
                    pros: ["Free OS", "Easy deployment", "Google management"],
                    cons: ["Not all hardware certified", "Limited offline capability"]
                },
                {
                    solution: "Windows Unified Write Filter",
                    method: "Lock down existing Windows PCs with UWF and kiosk mode",
                    hardware: "Any Windows 10/11 Enterprise PC",
                    cost: "Included with Windows Enterprise licensing",
                    pros: ["Keeps Windows familiarity", "No new hardware", "Full STIG baseline"],
                    cons: ["Windows attack surface still present", "More management overhead"]
                },
                {
                    solution: "ThinKiosk (by ThinScale)",
                    method: "Convert Windows PCs to locked-down thin clients",
                    hardware: "Any Windows PC",
                    cost: "~$30-50/device/year",
                    pros: ["Works on any Windows PC", "Granular lockdown", "BYOD support"],
                    cons: ["Underlying Windows still present", "Additional software layer"]
                }
            ],
            
            costBenefit: {
                scenario: "100 users needing new endpoints",
                newThinClients: "$400 x 100 = $40,000 hardware + $5,000/year management",
                repurpose: "$100/year x 100 = $10,000/year (reuse existing PCs)",
                breakeven: "Repurposing saves money if existing PCs have 2+ years remaining life"
            }
        },
        
        // Mobile/BYOD Access
        mobileAccess: {
            description: "Strategies for mobile device access to VDI environments",
            
            options: [
                {
                    type: "Native VDI Apps",
                    description: "Install VDI client on mobile device",
                    apps: ["AVD (Microsoft Remote Desktop)", "Citrix Workspace", "VMware Horizon Client", "AWS WorkSpaces"],
                    security: ["Conditional Access for device compliance", "MAM policies for app protection", "Certificate-based auth"],
                    pros: ["Best user experience", "Offline capability (some)"],
                    cons: ["App must be installed", "Device compliance required"]
                },
                {
                    type: "Web Client (HTML5)",
                    description: "Browser-based VDI access, no app install",
                    platforms: ["AVD Web Client", "Citrix StoreFront/Workspace", "VMware Horizon HTML5"],
                    security: ["Conditional Access", "Session-based controls", "Watermarking"],
                    pros: ["No app install", "Works on any browser", "Easier BYOD"],
                    cons: ["Performance may be lower", "Some features unavailable"]
                },
                {
                    type: "Secure Browser/Container",
                    description: "Isolated browser for VDI access on untrusted devices",
                    solutions: ["Island Enterprise Browser", "Citrix Secure Browser", "Microsoft Edge for Business"],
                    security: ["Sandboxed environment", "No data leakage to device", "DLP integration"],
                    pros: ["Strong isolation", "Works on personal devices"],
                    cons: ["Browser-only experience", "Additional licensing"]
                }
            ],
            
            byodPolicy: {
                description: "BYOD access to CUI VDI should be carefully controlled",
                requirements: [
                    "Device must pass compliance check (MDM enrollment or health attestation)",
                    "MFA required for every session",
                    "Clipboard/drive/print redirection disabled",
                    "Screen watermarking enabled",
                    "Session timeout enforced",
                    "Conditional Access blocks jailbroken/rooted devices",
                    "Consider prohibiting BYOD for CUI entirely"
                ],
                cmmcConsiderations: "BYOD for CUI access is high-risk. Consider VDI-only access from managed endpoints or use strict Conditional Access with device compliance."
            }
        },
        
        // Endpoint Security Hardening
        endpointHardening: {
            description: "Security configurations for VDI endpoints regardless of platform",
            
            universalControls: [
                { control: "Disable Local Storage", description: "No USB mass storage, no local drives mapped to VDI", cmmc: "AC.L2-3.1.21, MP.L2-3.8.7" },
                { control: "Disable Clipboard", description: "Prevent copy/paste between VDI and local", cmmc: "AC.L2-3.1.3" },
                { control: "Disable Printing", description: "Or restrict to approved network printers only", cmmc: "AC.L2-3.1.3" },
                { control: "Enable Screen Watermarking", description: "Display username/timestamp to deter screen photos", cmmc: "AU.L2-3.3.1" },
                { control: "Enforce MFA", description: "Require MFA for VDI connection, not just endpoint login", cmmc: "IA.L2-3.5.3" },
                { control: "Certificate-Based Auth", description: "Require device certificate for VDI access", cmmc: "IA.L2-3.5.2" },
                { control: "Network Segmentation", description: "Endpoints on separate VLAN from VDI hosts", cmmc: "SC.L2-3.13.5" },
                { control: "Firmware Updates", description: "Keep endpoint firmware current (BIOS, NIC, etc.)", cmmc: "SI.L2-3.14.1" }
            ],
            
            platformSpecific: {
                igel: [
                    "Enable secure boot in UMS",
                    "Configure USB device class filtering",
                    "Disable local terminal/shell access",
                    "Enable full disk encryption for persistent storage",
                    "Configure automatic screen lock"
                ],
                windows: [
                    "Apply Windows 10/11 STIG baseline",
                    "Enable Unified Write Filter (UWF)",
                    "Configure AppLocker/WDAC for application control",
                    "Disable all unnecessary services",
                    "Configure BitLocker with TPM",
                    "Enable Credential Guard",
                    "Use Assigned Access or Shell Launcher for kiosk mode"
                ],
                chromeOS: [
                    "Enroll in Chrome Enterprise",
                    "Disable developer mode",
                    "Configure verified access",
                    "Restrict sign-in to managed accounts",
                    "Disable external storage",
                    "Configure idle timeout and screen lock"
                ]
            }
        },
        
        // Management and Lifecycle
        endpointManagement: {
            description: "Centralized management is critical for VDI endpoints at scale",
            
            capabilities: [
                { capability: "Zero-Touch Provisioning", description: "Endpoints auto-configure on first boot", importance: "Reduces deployment time" },
                { capability: "Configuration Management", description: "Centrally push settings and policies", importance: "Ensures consistent baseline" },
                { capability: "Firmware Updates", description: "Remote OS/firmware updates without physical access", importance: "Security patching" },
                { capability: "Asset Inventory", description: "Track all endpoints and their status", importance: "Compliance and auditing" },
                { capability: "Remote Support", description: "Shadow sessions, remote reboot, diagnostics", importance: "Helpdesk efficiency" },
                { capability: "Compliance Reporting", description: "Report on endpoint configuration state", importance: "CMMC evidence" }
            ],
            
            toolsByPlatform: {
                igel: "IGEL Universal Management Suite (UMS)",
                dellWyse: "Wyse Management Suite (WMS)",
                hp: "HP Device Manager",
                windows: "Intune, SCCM, or third-party UEM",
                chromeOS: "Google Admin Console / Chrome Enterprise"
            },
            
            lifecycleRecommendations: [
                "Plan 5-7 year lifecycle for thin clients (longer than PCs due to less wear)",
                "Maintain spare pool (5-10%) for quick replacements",
                "Standardize on 1-2 models for simplified management",
                "Include endpoint refresh in annual budgeting",
                "Document decommissioning process (sanitization not usually needed for true thin clients)"
            ]
        }
    },

    // Platform-Specific CUI Identification (Native Tools - No 3rd Party Required)
    cuiIdentification: {
        azure: {
            name: "Microsoft Purview (Native)",
            description: "Microsoft's native data governance and DLP platform for CUI identification",
            nativeTools: [
                {
                    tool: "Microsoft Purview Information Protection",
                    purpose: "Classify and label documents containing CUI",
                    howItWorks: "Uses trainable classifiers, regex patterns, and ML to identify sensitive data",
                    setup: [
                        "Navigate to Microsoft Purview Compliance Portal",
                        "Create sensitivity labels for CUI categories",
                        "Configure auto-labeling policies with CUI patterns",
                        "Enable default labeling for new documents"
                    ],
                    cliCommands: [
                        "# PowerShell - Get sensitivity labels",
                        "Connect-IPPSSession",
                        "Get-Label | Select Name, DisplayName, Priority",
                        "Get-LabelPolicy | Select Name, Labels, Mode"
                    ],
                    cuiPatterns: [
                        { pattern: "CONTROLLED UNCLASSIFIED INFORMATION", type: "Header marking" },
                        { pattern: "CUI//SP-CTI", type: "Dissemination control" },
                        { pattern: "EXPORT CONTROLLED", type: "Export control marking" }
                    ],
                    docLink: "https://learn.microsoft.com/en-us/purview/sensitivity-labels"
                },
                {
                    tool: "Microsoft Purview Data Loss Prevention",
                    purpose: "Prevent CUI from leaving authorized boundaries",
                    howItWorks: "Monitors and blocks sensitive data in email, SharePoint, OneDrive, Teams, and endpoints",
                    setup: [
                        "Create DLP policy in Purview Compliance Portal",
                        "Select 'CUI' or create custom sensitive info types",
                        "Define policy scope (Exchange, SharePoint, OneDrive, Teams)",
                        "Configure actions (block, notify, require justification)"
                    ],
                    builtInTypes: [
                        "U.S. Social Security Number (SSN)",
                        "U.S. Individual Taxpayer Identification Number (ITIN)",
                        "U.S. Passport Number",
                        "Credit Card Number",
                        "Custom patterns for contract numbers, project codes"
                    ],
                    docLink: "https://learn.microsoft.com/en-us/purview/dlp-learn-about-dlp"
                },
                {
                    tool: "Microsoft Purview Data Map (formerly Azure Purview)",
                    purpose: "Discover and catalog CUI across Azure data estate",
                    howItWorks: "Scans Azure Storage, SQL, Synapse, etc. for sensitive data patterns",
                    setup: [
                        "Create Purview account in Azure Portal",
                        "Register data sources (Storage, SQL, etc.)",
                        "Configure scanning with CUI classification rules",
                        "Review discovered sensitive data in Data Catalog"
                    ],
                    supportedSources: ["Azure Blob Storage", "Azure SQL", "Azure Synapse", "Azure Data Lake", "Power BI"],
                    docLink: "https://learn.microsoft.com/en-us/purview/concept-best-practices-scanning"
                }
            ],
            costConsiderations: "Purview included in M365 E5/G5; standalone requires additional licensing"
        },
        
        aws: {
            name: "Amazon Macie (Native)",
            description: "AWS's native ML-powered service for discovering and protecting sensitive data",
            nativeTools: [
                {
                    tool: "Amazon Macie",
                    purpose: "Automated discovery and classification of CUI in S3",
                    howItWorks: "Uses ML and pattern matching to identify sensitive data in S3 buckets",
                    setup: [
                        "Enable Macie in AWS Console or CLI",
                        "Create classification jobs for S3 buckets",
                        "Configure custom data identifiers for CUI patterns",
                        "Review findings in Macie console or Security Hub"
                    ],
                    cliCommands: [
                        "# Enable Macie",
                        "aws macie2 enable-macie --region us-gov-west-1",
                        "",
                        "# Create a classification job",
                        "aws macie2 create-classification-job \\",
                        "  --job-type SCHEDULED \\",
                        "  --name 'CUI-Discovery-Job' \\",
                        "  --s3-job-definition '{\"bucketDefinitions\":[{\"accountId\":\"123456789012\",\"buckets\":[\"cui-bucket\"]}]}'",
                        "",
                        "# List findings",
                        "aws macie2 list-findings --region us-gov-west-1",
                        "",
                        "# Create custom data identifier for CUI markings",
                        "aws macie2 create-custom-data-identifier \\",
                        "  --name 'CUI-Header-Marking' \\",
                        "  --regex 'CUI\\/\\/[A-Z\\-]+' \\",
                        "  --description 'Identifies CUI banner markings'"
                    ],
                    builtInDetectors: [
                        "PII (SSN, passport, driver's license)",
                        "Financial data (credit cards, bank accounts)",
                        "Credentials (API keys, passwords)",
                        "Healthcare (HIPAA identifiers)"
                    ],
                    customIdentifiers: [
                        { name: "CUI Banner", regex: "CONTROLLED\\s+UNCLASSIFIED\\s+INFORMATION", description: "Standard CUI header" },
                        { name: "CUI Category", regex: "CUI\\/\\/[A-Z]{2,10}(-[A-Z]{2,10})*", description: "CUI category marking" },
                        { name: "Export Control", regex: "(ITAR|EAR|EXPORT\\s+CONTROLLED)", description: "Export control markings" },
                        { name: "Contract Number", regex: "[A-Z]{1,2}\\d{2}-\\d{4}-[A-Z]-\\d{4}", description: "DoD contract format" }
                    ],
                    docLink: "https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html"
                },
                {
                    tool: "AWS Config Rules",
                    purpose: "Ensure S3 buckets with CUI have proper controls",
                    howItWorks: "Evaluates resource configurations against compliance rules",
                    setup: [
                        "Enable AWS Config in your account",
                        "Deploy managed rules for S3 security",
                        "Create custom rules for CUI-tagged resources"
                    ],
                    relevantRules: [
                        "s3-bucket-server-side-encryption-enabled",
                        "s3-bucket-ssl-requests-only",
                        "s3-bucket-public-read-prohibited",
                        "s3-bucket-public-write-prohibited",
                        "s3-bucket-logging-enabled"
                    ],
                    docLink: "https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html"
                },
                {
                    tool: "AWS Security Hub",
                    purpose: "Centralized view of security findings including Macie discoveries",
                    howItWorks: "Aggregates findings from Macie, GuardDuty, Inspector, and custom sources",
                    setup: [
                        "Enable Security Hub in AWS Console",
                        "Enable Macie integration",
                        "Configure NIST 800-171 security standard",
                        "Create custom insights for CUI findings"
                    ],
                    cliCommands: [
                        "# Enable Security Hub",
                        "aws securityhub enable-security-hub --enable-default-standards",
                        "",
                        "# Enable NIST 800-171 standard",
                        "aws securityhub batch-enable-standards \\",
                        "  --standards-subscription-requests '[{\"StandardsArn\":\"arn:aws-us-gov:securityhub:us-gov-west-1::standards/nist-800-171/v/2.0.0\"}]'"
                    ],
                    docLink: "https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html"
                },
                {
                    tool: "S3 Object Tagging + Resource Policies",
                    purpose: "Tag and control access to CUI objects",
                    howItWorks: "Apply tags to objects, then use tag-based access control",
                    setup: [
                        "Define tagging schema (e.g., DataClassification=CUI)",
                        "Apply tags via S3 console, CLI, or Macie automation",
                        "Create IAM policies with tag conditions",
                        "Enforce tagging via S3 bucket policies"
                    ],
                    cliCommands: [
                        "# Tag an object as CUI",
                        "aws s3api put-object-tagging \\",
                        "  --bucket cui-bucket \\",
                        "  --key sensitive-doc.pdf \\",
                        "  --tagging 'TagSet=[{Key=DataClassification,Value=CUI},{Key=CUICategory,Value=CTI}]'",
                        "",
                        "# List objects with CUI tag",
                        "aws resourcegroupstaggingapi get-resources \\",
                        "  --tag-filters Key=DataClassification,Values=CUI \\",
                        "  --resource-type-filters s3"
                    ],
                    docLink: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-tagging.html"
                }
            ],
            costConsiderations: "Macie: ~$1/GB scanned first month, $0.10/GB thereafter. Security Hub: $0.0010/finding/month"
        },
        
        gcp: {
            name: "Cloud DLP (Native)",
            description: "Google's native sensitive data discovery and protection service",
            nativeTools: [
                {
                    tool: "Cloud Data Loss Prevention (DLP)",
                    purpose: "Discover, classify, and protect sensitive data across GCP",
                    howItWorks: "Scans data in Cloud Storage, BigQuery, Datastore using 150+ built-in detectors",
                    setup: [
                        "Enable Cloud DLP API in GCP Console",
                        "Create inspection job for target data stores",
                        "Configure custom infoTypes for CUI patterns",
                        "Set up automated actions (redact, notify, quarantine)"
                    ],
                    cliCommands: [
                        "# Enable DLP API",
                        "gcloud services enable dlp.googleapis.com",
                        "",
                        "# Create inspection template with CUI patterns",
                        "gcloud dlp inspect-templates create \\",
                        "  --display-name='CUI-Detection' \\",
                        "  --info-types='US_SOCIAL_SECURITY_NUMBER,US_PASSPORT,CREDIT_CARD_NUMBER' \\",
                        "  --custom-info-types='[{\"infoType\":{\"name\":\"CUI_MARKING\"},\"regex\":{\"pattern\":\"CUI\\\\/\\\\/[A-Z-]+\"}}]'",
                        "",
                        "# Inspect a Cloud Storage bucket",
                        "gcloud dlp jobs create \\",
                        "  --project=PROJECT_ID \\",
                        "  --display-name='CUI-Scan' \\",
                        "  --inspect-template='projects/PROJECT_ID/inspectTemplates/CUI-Detection' \\",
                        "  --storage-config='{\"cloudStorageOptions\":{\"fileSet\":{\"url\":\"gs://cui-bucket/**\"}}}'",
                        "",
                        "# List job findings",
                        "gcloud dlp jobs list --project=PROJECT_ID"
                    ],
                    builtInInfoTypes: [
                        "US_SOCIAL_SECURITY_NUMBER",
                        "US_PASSPORT",
                        "US_INDIVIDUAL_TAXPAYER_IDENTIFICATION_NUMBER",
                        "CREDIT_CARD_NUMBER",
                        "US_DRIVERS_LICENSE_NUMBER",
                        "EMAIL_ADDRESS",
                        "PHONE_NUMBER"
                    ],
                    customInfoTypes: [
                        { name: "CUI_BANNER", pattern: "CONTROLLED\\\\s+UNCLASSIFIED\\\\s+INFORMATION", type: "REGEX" },
                        { name: "CUI_CATEGORY", pattern: "CUI\\\\/\\\\/[A-Z]{2,10}(-[A-Z]{2,10})*", type: "REGEX" },
                        { name: "ITAR_MARKING", pattern: "(ITAR|22\\\\s+CFR|EXPORT\\\\s+CONTROLLED)", type: "REGEX" },
                        { name: "CONTRACT_NUMBER", pattern: "[FWNH]\\\\d{5}-\\\\d{2}-[A-Z]-\\\\d{4}", type: "REGEX" }
                    ],
                    docLink: "https://cloud.google.com/dlp/docs"
                },
                {
                    tool: "Security Command Center (SCC)",
                    purpose: "Centralized security and risk management for GCP",
                    howItWorks: "Aggregates findings from DLP, Security Health Analytics, and other sources",
                    setup: [
                        "Enable Security Command Center (Standard or Premium)",
                        "Enable DLP integration",
                        "Configure notification channels for CUI findings",
                        "Create custom security marks for CUI resources"
                    ],
                    cliCommands: [
                        "# List DLP findings in SCC",
                        "gcloud scc findings list organizations/ORG_ID \\",
                        "  --source=SOURCE_ID \\",
                        "  --filter='category=\"DLP\"'",
                        "",
                        "# Add security mark to a CUI resource",
                        "gcloud scc assets update-marks ASSET_NAME \\",
                        "  --organization=ORG_ID \\",
                        "  --security-marks='data_classification=CUI,cui_category=CTI'"
                    ],
                    docLink: "https://cloud.google.com/security-command-center/docs"
                },
                {
                    tool: "Data Catalog",
                    purpose: "Metadata management and data discovery",
                    howItWorks: "Catalogs and tags data assets across GCP for governance",
                    setup: [
                        "Enable Data Catalog API",
                        "Create tag template for CUI classification",
                        "Apply tags to BigQuery datasets, GCS buckets",
                        "Use policy tags for column-level security"
                    ],
                    cliCommands: [
                        "# Create a tag template for CUI",
                        "gcloud data-catalog tag-templates create cui-classification \\",
                        "  --location=us \\",
                        "  --display-name='CUI Classification' \\",
                        "  --field=id=classification,display-name='Classification',type=enum(CUI,CUI-SP,Non-CUI) \\",
                        "  --field=id=category,display-name='CUI Category',type=string \\",
                        "  --field=id=handling,display-name='Handling Instructions',type=string",
                        "",
                        "# Tag a BigQuery table",
                        "gcloud data-catalog tags create \\",
                        "  --entry=ENTRY_NAME \\",
                        "  --tag-template=cui-classification \\",
                        "  --tag-template-location=us \\",
                        "  --classification=CUI \\",
                        "  --category=CTI"
                    ],
                    docLink: "https://cloud.google.com/data-catalog/docs"
                },
                {
                    tool: "VPC Service Controls",
                    purpose: "Create security perimeters around CUI data",
                    howItWorks: "Prevents data exfiltration from GCP services",
                    setup: [
                        "Enable Access Context Manager",
                        "Create service perimeter for CUI project",
                        "Add GCS, BigQuery, Cloud SQL to perimeter",
                        "Configure access levels (device trust, IP ranges)"
                    ],
                    cliCommands: [
                        "# Create access policy",
                        "gcloud access-context-manager policies create \\",
                        "  --organization=ORG_ID \\",
                        "  --title='CUI Access Policy'",
                        "",
                        "# Create service perimeter",
                        "gcloud access-context-manager perimeters create cui-perimeter \\",
                        "  --policy=POLICY_ID \\",
                        "  --title='CUI Data Perimeter' \\",
                        "  --resources='projects/CUI_PROJECT_NUMBER' \\",
                        "  --restricted-services='storage.googleapis.com,bigquery.googleapis.com'"
                    ],
                    docLink: "https://cloud.google.com/vpc-service-controls/docs"
                },
                {
                    tool: "Resource Labels",
                    purpose: "Tag GCP resources for CUI identification",
                    howItWorks: "Apply key-value labels to resources for organization and policy",
                    setup: [
                        "Define labeling schema (data-classification, cui-category)",
                        "Apply labels via Console, CLI, or Terraform",
                        "Use labels in IAM conditions",
                        "Query labeled resources via Asset Inventory"
                    ],
                    cliCommands: [
                        "# Label a GCS bucket as CUI",
                        "gcloud storage buckets update gs://cui-bucket \\",
                        "  --update-labels=data-classification=cui,cui-category=cti",
                        "",
                        "# Find all CUI-labeled resources",
                        "gcloud asset search-all-resources \\",
                        "  --scope='projects/PROJECT_ID' \\",
                        "  --query='labels.data-classification:cui'"
                    ],
                    docLink: "https://cloud.google.com/resource-manager/docs/creating-managing-labels"
                }
            ],
            costConsiderations: "Cloud DLP: $1-3 per GB inspected. SCC Premium: ~$0.0060/resource/hour"
        }
    },
    
    // CUI Identification Best Practices
    cuiBestPractices: [
        {
            practice: "Define CUI Patterns First",
            description: "Document what CUI looks like in your environment before scanning",
            examples: ["Contract numbers", "Technical data markings", "Export control notices", "Project code names"]
        },
        {
            practice: "Start with Known CUI Locations",
            description: "Begin scanning repositories you know contain CUI to validate detectors",
            examples: ["Contract file shares", "Engineering document libraries", "Proposal repositories"]
        },
        {
            practice: "Layer Multiple Detection Methods",
            description: "Combine keyword/regex with ML classifiers for better accuracy",
            examples: ["Regex for markings + ML for unmarked technical data"]
        },
        {
            practice: "Tune for False Positives",
            description: "Review and refine detection rules to reduce noise",
            examples: ["Exclude template documents", "Whitelist known non-CUI patterns"]
        },
        {
            practice: "Automate Tagging",
            description: "Once detected, automatically tag/label for ongoing protection",
            examples: ["Auto-apply sensitivity labels", "Tag S3 objects", "Add Data Catalog entries"]
        },
        {
            practice: "Integrate with DLP",
            description: "Connect discovery findings to prevention policies",
            examples: ["Block sharing of detected CUI", "Require encryption", "Notify data owners"]
        }
    ]
};

// Helper function
function getEnclaveGuidance() {
    return ENCLAVE_GUIDANCE;
}

