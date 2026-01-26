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
    }
};

// Helper function
function getEnclaveGuidance() {
    return ENCLAVE_GUIDANCE;
}
