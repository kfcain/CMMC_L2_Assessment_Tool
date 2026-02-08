// Implementation Planner - Rev 3 Edition
// NIST SP 800-171 Rev 3: 17 families, 97 controls, 422 objectives, ODPs
console.log('=== REV 3 IMPLEMENTATION PLANNER LOADING ===');

const IMPLEMENTATION_PLANNER_R3 = {
    version: "3.0.0",
    revision: "r3",
    title: "CMMC Implementation Planner \u2014 Rev 3 Edition",
    description: "Phased approach to CMMC L2 compliance under NIST SP 800-171 Rev 3. Covers 17 families, 97 controls, 422 assessment objectives, Organization-Defined Parameters (ODPs), and new families: Supply Chain (SR), Planning (PL), System Acquisition (SA).",
    projectPlanMapping: {
        phaseCategories: {
            "r3-phase-0": "Discovery", "r3-phase-1": "Governance", "r3-phase-2": "Foundation",
            "r3-phase-3": "Foundation", "r3-phase-4": "Foundation", "r3-phase-5": "Foundation",
            "r3-phase-6": "Foundation", "r3-phase-7": "Governance", "r3-phase-8": "Governance",
            "r3-phase-9": "Audit Prep"
        }
    },
    phases: [
        {
            id: "r3-phase-0", name: "Discovery & Current State Assessment",
            description: "Understand where you are today or acknowledge starting from zero. Map data flows, diagram your network, and document your current security posture.",
            duration: "3-4 weeks", icon: "foundation", color: "#f87171",
            milestones: [
                {
                    id: "r3-m0-1", name: "Executive Alignment & Program Charter",
                    description: "Secure executive sponsorship and establish CMMC program governance",
                    tasks: [
                        {
                            id: "r3-t0-1-1", name: "Executive briefing on CMMC 2.0 + Rev 3 changes",
                            description: "Brief leadership on Rev 3: 97 controls, 422 objectives, ODPs, new families, 24-month transition",
                            controls: [], priority: "critical", effort: "medium",
                            projectPlan: { category: "Governance", subcategory: "Program Management", week: 1, taskId: "R3-T0.1", owner: "CMMC Lead", accountable: "Exec Sponsor", deliverable: "Executive Briefing Deck" },
                            guidance: {
                                steps: [
                                    "Prepare CMMC overview with Rev 3 delta (20 new controls, 30+ withdrawn/merged, ODPs)",
                                    "Explain Rev 2 to Rev 3 transition timeline (24-month sunset: Nov 2026)",
                                    "Present budget requirements ($150K-$500K+ depending on scope)",
                                    "Highlight new families: Supply Chain (SR), Planning (PL), System Acquisition (SA)",
                                    "Discuss Organization-Defined Parameters (ODPs) for ~25 controls",
                                    "Obtain formal executive sponsorship and commitment"
                                ],
                                artifacts: ["Executive Briefing Deck", "Rev 3 Delta Summary", "CMMC ROI Analysis"]
                            }
                        },
                        {
                            id: "r3-t0-1-2", name: "Establish Steering Committee & appoint CMMC Lead",
                            description: "Form governance body and designate program lead with ODP governance authority",
                            controls: ["03.15.02[a]"], priority: "critical", effort: "low",
                            projectPlan: { category: "Governance", subcategory: "Program Management", week: 1, taskId: "R3-T0.2", owner: "Exec Sponsor", accountable: "Exec Sponsor", deliverable: "Steering Committee Charter" },
                            guidance: {
                                steps: [
                                    "Identify committee members (CEO/COO, CISO, IT Director, FSO, HR, Legal, Contracts, Supply Chain)",
                                    "Include supply chain representative (new SR family requirement)",
                                    "Appoint CMMC Program Lead with cross-department authority",
                                    "Establish ODP governance process for approving parameter values",
                                    "Define meeting cadence (bi-weekly implementation, monthly steady-state)"
                                ],
                                artifacts: ["Steering Committee Charter", "CMMC Lead Appointment", "ODP Governance Process"]
                            }
                        },
                        {
                            id: "r3-t0-1-3", name: "Develop budget and implementation timeline",
                            description: "Create comprehensive budget and realistic project schedule",
                            controls: [], priority: "critical", effort: "medium",
                            projectPlan: { category: "Governance", subcategory: "Program Management", week: 1, taskId: "R3-T0.3", owner: "CMMC Lead", accountable: "Exec Sponsor", deliverable: "Budget & Timeline" },
                            guidance: {
                                steps: [
                                    "Estimate technology costs (M365 GCC High, security tools, VDI if needed)",
                                    "Calculate labor costs (internal staff, contractors, consultants)",
                                    "Include C3PAO assessment costs ($50K-$150K for L2)",
                                    "Map all implementation phases (9-18 months typical)",
                                    "Account for Rev 3 transition deadline (Nov 2026)",
                                    "Include contingency (15-20% recommended)"
                                ],
                                budgetCategories: [
                                    { category: "Cloud Infrastructure", range: "$50K-$200K/yr", notes: "M365 GCC High, Azure Gov" },
                                    { category: "Security Tools", range: "$25K-$100K/yr", notes: "SIEM, EDR, vuln scanning" },
                                    { category: "Consulting/vCISO", range: "$50K-$200K", notes: "Gap assessment, implementation" },
                                    { category: "C3PAO Assessment", range: "$50K-$150K", notes: "Formal CMMC L2 assessment" },
                                    { category: "Training", range: "$10K-$30K", notes: "Security awareness, CUI handling" }
                                ],
                                artifacts: ["Budget Spreadsheet", "Project Timeline", "Resource Matrix"]
                            }
                        }
                    ]
                },
                {
                    id: "r3-m0-2", name: "Current State Assessment",
                    description: "Document your current security posture honestly, even if starting from scratch",
                    tasks: [
                        {
                            id: "r3-t0-2-1", name: "Conduct current-state maturity assessment",
                            description: "Rate maturity across all 17 Rev 3 families. Document starting-from-scratch areas explicitly.",
                            controls: ["03.12.01[a]", "03.12.01[b]"], priority: "critical", effort: "high",
                            projectPlan: { category: "Foundation", subcategory: "Current State", week: 2, taskId: "R3-T0.4", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "Maturity Report" },
                            guidance: {
                                steps: [
                                    "For each of 17 families, rate: None / Ad-Hoc / Defined / Managed / Optimized",
                                    "Document existing policies (or lack thereof) for each family",
                                    "Inventory existing security tools and technologies",
                                    "Identify existing compliance frameworks providing partial coverage",
                                    "Interview department heads on current security practices",
                                    "Document starting-from-scratch areas as Phase 2 priorities",
                                    "Create gap heat map (red/yellow/green per family)"
                                ],
                                maturityLevels: [
                                    { level: "None", description: "No controls exist", color: "#f87171" },
                                    { level: "Ad-Hoc", description: "Informal, undocumented", color: "#fb923c" },
                                    { level: "Defined", description: "Policies exist, inconsistent", color: "#fbbf24" },
                                    { level: "Managed", description: "Implemented and monitored", color: "#34d399" },
                                    { level: "Optimized", description: "Continuous improvement", color: "#6c8aff" }
                                ],
                                artifacts: ["Maturity Report", "Gap Heat Map", "Tool Inventory"]
                            }
                        },
                        {
                            id: "r3-t0-2-2", name: "Review DoD contracts for CMMC & CUI requirements",
                            description: "Analyze contracts for DFARS clauses and determine CUI scope",
                            controls: ["03.01.03[a]", "03.08.01[a]"], priority: "critical", effort: "medium",
                            projectPlan: { category: "Governance", subcategory: "Program Management", week: 2, taskId: "R3-T0.5", owner: "Contracts", accountable: "CMMC Lead", deliverable: "Contract Analysis" },
                            guidance: {
                                steps: [
                                    "Gather all current DoD contracts and subcontracts",
                                    "Identify DFARS 252.204-7012/7019/7020/7021 clauses",
                                    "Determine required CMMC level per contract",
                                    "Identify CUI categories (CTI, ITAR, Export Controlled)",
                                    "Note flow-down requirements to subcontractors (SR family)",
                                    "Create contract requirements matrix"
                                ],
                                artifacts: ["Contract Analysis Matrix", "CUI Categories List", "Flow-Down Requirements"]
                            }
                        },
                        {
                            id: "r3-t0-2-3", name: "Define assessment scope strategy",
                            description: "Decide enclave vs. enterprise-wide vs. hybrid scope",
                            controls: ["03.15.02[b]", "03.13.01[a]"], priority: "critical", effort: "medium",
                            projectPlan: { category: "Foundation", subcategory: "CUI Scoping", week: 2, taskId: "R3-T0.6", owner: "CMMC Lead", accountable: "Exec Sponsor", deliverable: "Scope Strategy" },
                            guidance: {
                                steps: [
                                    "Evaluate enclave vs. enterprise-wide vs. hybrid approach",
                                    "Consider cost/benefit and operational impact",
                                    "Document scope decision in SSP per 03.15.02[b]",
                                    "Identify in-scope systems and personnel",
                                    "Define external system boundary per 03.13.01[a]"
                                ],
                                scopeOptions: [
                                    { name: "Enclave", pros: ["Smaller scope", "Lower cost"], cons: ["Operational friction"], bestFor: "Limited CUI" },
                                    { name: "Enterprise-Wide", pros: ["No workflow changes"], cons: ["Higher cost"], bestFor: "CUI throughout ops" },
                                    { name: "Hybrid", pros: ["Balanced", "Phased"], cons: ["Complex boundary"], bestFor: "Gradual transition" }
                                ],
                                artifacts: ["Scope Strategy Document", "In-Scope Systems List"]
                            }
                        }
                    ]
                },
                {
                    id: "r3-m0-3", name: "Data Flow & Network Architecture",
                    description: "Create data flow diagrams and network architecture documentation",
                    tasks: [
                        {
                            id: "r3-t0-3-1", name: "Identify CUI data types, sources, and destinations",
                            description: "Catalog all CUI entering, residing in, and leaving your environment",
                            controls: ["03.01.03[a]", "03.01.03[b]", "03.08.01[a]"], priority: "critical", effort: "high",
                            projectPlan: { category: "Foundation", subcategory: "CUI Scoping", week: 3, taskId: "R3-T0.7", owner: "CMMC Lead", accountable: "FSO", deliverable: "CUI Data Inventory" },
                            guidance: {
                                steps: [
                                    "Review contracts and DD Form 254s for CUI categories",
                                    "Interview stakeholders who handle CUI",
                                    "Document ingress points: email, file transfers, portals, physical media",
                                    "Document storage: file shares, databases, email, cloud",
                                    "Document egress: deliverables, subcontractor sharing, archival",
                                    "Classify per NARA CUI Registry categories",
                                    "Create inventory with owner, location, classification"
                                ],
                                artifacts: ["CUI Data Inventory", "CUI Classification Guide", "Data Owner Matrix"]
                            }
                        },
                        {
                            id: "r3-t0-3-2", name: "Create CUI data flow diagrams",
                            description: "Map how CUI enters, moves through, and exits your environment",
                            controls: ["03.01.03[a]", "03.13.01[a]", "03.13.01[b]"], priority: "critical", effort: "high",
                            projectPlan: { category: "Foundation", subcategory: "CUI Scoping", week: 3, taskId: "R3-T0.8", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Data Flow Diagrams" },
                            guidance: {
                                steps: [
                                    "Create Level 0 context diagram showing external entities and CUI flows",
                                    "Create Level 1 diagrams for each major CUI process",
                                    "Document ingress: email gateways, SFTP, web portals, VPN",
                                    "Map internal flows: workstations, file servers, databases, apps",
                                    "Document egress: outbound email, deliverables, subcontractor sharing",
                                    "Identify encryption points (at rest and in transit)",
                                    "Mark trust boundaries and security zones",
                                    "Include cloud service data flows"
                                ],
                                diagramTypes: [
                                    { name: "Level 0 Context", description: "External entities and CUI flows across boundary" },
                                    { name: "Level 1 Process", description: "Major CUI handling processes with data stores" },
                                    { name: "Level 2 Technical", description: "Systems, ports, protocols, encryption" }
                                ],
                                artifacts: ["Level 0 Diagram", "Level 1 Diagrams", "Data Flow Narrative"]
                            }
                        },
                        {
                            id: "r3-t0-3-3", name: "Create network architecture diagram",
                            description: "Document network topology with security zones, segmentation, boundary devices",
                            controls: ["03.13.01[a]", "03.13.01[b]", "03.13.06[a]"], priority: "critical", effort: "high",
                            projectPlan: { category: "Foundation", subcategory: "Network Architecture", week: 3, taskId: "R3-T0.9", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Network Diagram" },
                            guidance: {
                                steps: [
                                    "Document physical topology (switches, routers, firewalls, wireless APs)",
                                    "Document logical topology (VLANs, subnets, security zones)",
                                    "Label zones: CUI, general, DMZ, management, guest",
                                    "Document boundary protection per 03.13.01[a]",
                                    "Map internal segmentation per 03.13.01[b]",
                                    "Document deny-by-default per 03.13.06[a]",
                                    "Include remote access paths and cloud connectivity",
                                    "Label IP ranges, VLAN IDs, firewall rules"
                                ],
                                artifacts: ["Network Architecture Diagram", "Security Zone Matrix", "Firewall Rule Summary"]
                            }
                        },
                        {
                            id: "r3-t0-3-4", name: "Create asset inventory (includes new Rev 3 controls)",
                            description: "Inventory all systems using new Rev 3 controls 03.04.10 and 03.04.11",
                            controls: ["03.04.01[d]", "03.04.10[a]", "03.04.10[b]", "03.04.11[a]", "03.15.02[b]"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Foundation", subcategory: "CUI Scoping", week: 4, taskId: "R3-T0.10", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Asset Inventory" },
                            guidance: {
                                steps: [
                                    "Establish component inventory per 03.04.10[a] (NEW Rev 3)",
                                    "Document information location per 03.04.11[a] (NEW Rev 3)",
                                    "Create baseline configuration per 03.04.01[d]",
                                    "Classify: CUI-In-Scope, Boundary, Security-Control, Out-of-Scope",
                                    "Run automated discovery (Nmap, Tenable, NinjaOne)",
                                    "Reconcile discovered vs. known assets",
                                    "Document asset owners and custodians"
                                ],
                                rev3NewControls: [
                                    { id: "03.04.10", name: "System Component Inventory", note: "NEW in Rev 3" },
                                    { id: "03.04.11", name: "Information Location", note: "NEW in Rev 3" }
                                ],
                                artifacts: ["Asset Inventory", "Discovery Scan Results", "Asset Classification Guide"]
                            }
                        },
                        {
                            id: "r3-t0-3-5", name: "Define system boundary and authorization scope",
                            description: "Formally define CMMC assessment boundary using data flows and network architecture",
                            controls: ["03.15.02[a]", "03.15.02[b]", "03.13.01[a]", "03.12.05[a]"],
                            priority: "critical", effort: "medium",
                            projectPlan: { category: "Foundation", subcategory: "CUI Scoping", week: 4, taskId: "R3-T0.11", owner: "CMMC Lead", accountable: "Exec Sponsor", deliverable: "System Boundary Document" },
                            guidance: {
                                steps: [
                                    "Draw formal assessment boundary using Phase 0 diagrams",
                                    "Document in SSP per 03.15.02 (NEW Rev 3, replaces old 3.12.4)",
                                    "Define external boundary per 03.13.01[a]",
                                    "List all CUI-processing systems inside boundary",
                                    "Identify cloud services and FedRAMP status",
                                    "Document external interconnections per 03.12.05 (NEW Rev 3)",
                                    "Get executive sign-off on boundary scope"
                                ],
                                rev3NewControls: [
                                    { id: "03.15.02", name: "System Security Plan", note: "NEW, replaces 3.12.4" },
                                    { id: "03.12.05", name: "Information Exchange", note: "NEW in Rev 3" }
                                ],
                                artifacts: ["System Boundary Document", "Boundary Diagram", "Interconnection Agreements"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "r3-phase-1", name: "Planning, Policy & ODP Definition",
            description: "Develop the SSP, define all Organization-Defined Parameters, create policies for all 17 families, and establish rules of behavior.",
            duration: "4-5 weeks", icon: "policies", color: "#fbbf24",
            milestones: [
                {
                    id: "r3-m1-1", name: "SSP & ODP Definition",
                    description: "Create the System Security Plan and define all Organization-Defined Parameters",
                    tasks: [
                        {
                            id: "r3-t1-1-1", name: "Initialize System Security Plan (SSP)",
                            description: "Create SSP per 03.15.02 — now a dedicated Rev 3 control",
                            controls: ["03.15.02[a]", "03.15.02[b]", "03.15.02[c]"],
                            priority: "critical", effort: "high", isODPTask: false,
                            projectPlan: { category: "Governance", subcategory: "Documentation & SSP", week: 5, taskId: "R3-T1.1", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "SSP Document (Draft)" },
                            guidance: {
                                steps: [
                                    "Create SSP using NIST or FedRAMP-aligned template",
                                    "Document system name, description, and purpose",
                                    "Include boundary, data flow, and network diagrams from Phase 0",
                                    "Document system environment (cloud, on-prem, hybrid)",
                                    "List all system interconnections per 03.12.05",
                                    "Create placeholder sections for each of 97 Rev 3 controls",
                                    "Establish SSP review and update cadence per 03.15.02[c]"
                                ],
                                rev3NewControls: [
                                    { id: "03.15.02", name: "System Security Plan", note: "NEW — [a] develop, [b] define boundary, [c] review/update" }
                                ],
                                artifacts: ["SSP Document (Draft)", "SSP Review Schedule"]
                            }
                        },
                        {
                            id: "r3-t1-1-2", name: "Define all Organization-Defined Parameters (ODPs)",
                            description: "Define values for all ~25 ODPs — organization-specific values documented in SSP",
                            controls: [], priority: "critical", effort: "high", isODPTask: true,
                            projectPlan: { category: "Governance", subcategory: "Documentation & SSP", week: 5, taskId: "R3-T1.2", owner: "CMMC Lead", accountable: "Exec Sponsor", deliverable: "ODP Definition Matrix" },
                            guidance: {
                                steps: [
                                    "Review each ODP and its suggested values from NIST guidance",
                                    "Convene steering committee to approve ODP values",
                                    "Document each ODP value with justification",
                                    "Ensure ODP values are achievable with current/planned technology",
                                    "Record ODP values in SSP for each applicable control",
                                    "Create ODP quick-reference card for implementation teams"
                                ],
                                odpDefinitions: [
                                    { control: "03.01.08", param: "Account Lockout", suggested: "3 failed attempts / 30-min lockout" },
                                    { control: "03.01.10", param: "Session Lock", suggested: "15 minutes inactivity" },
                                    { control: "03.01.11", param: "Session Termination", suggested: "Logout, timeout, policy violation" },
                                    { control: "03.02.01", param: "Training Frequency", suggested: "Annually + upon changes" },
                                    { control: "03.03.01", param: "Audit Events", suggested: "Login, logout, privilege use, data access, config changes" },
                                    { control: "03.03.03", param: "Audit Review", suggested: "Weekly critical / monthly standard" },
                                    { control: "03.04.01", param: "Baseline Components", suggested: "OS, apps, network devices, security tools" },
                                    { control: "03.05.03", param: "MFA Requirements", suggested: "Network, privileged, remote, CUI access" },
                                    { control: "03.05.05", param: "Identifier Reuse", suggested: "3 years" },
                                    { control: "03.05.07", param: "Password Complexity", suggested: "14 chars, mixed case/number/special" },
                                    { control: "03.06.01", param: "Incident Types", suggested: "Malware, unauthorized access, breach, DoS" },
                                    { control: "03.06.02", param: "Reporting Timeframe", suggested: "72h DoD / 24h critical" },
                                    { control: "03.06.03", param: "IR Testing", suggested: "Annually" },
                                    { control: "03.11.01", param: "Risk Assessment", suggested: "Annually + upon changes" },
                                    { control: "03.11.02", param: "Vuln Scanning", suggested: "Monthly authenticated / weekly critical" },
                                    { control: "03.12.01", param: "Security Assessment", suggested: "Annually" },
                                    { control: "03.12.03", param: "Continuous Monitoring", suggested: "Real-time critical / daily standard" },
                                    { control: "03.13.09", param: "Network Disconnect", suggested: "After defined inactivity period" },
                                    { control: "03.14.01", param: "Malware Scanning", suggested: "Real-time + daily full scans" },
                                    { control: "03.14.02", param: "Signature Updates", suggested: "Within 24 hours of release" }
                                ],
                                artifacts: ["ODP Definition Matrix", "ODP Quick-Reference Card", "Steering Committee Approval"]
                            }
                        },
                        {
                            id: "r3-t1-1-3", name: "Establish Rules of Behavior",
                            description: "Create and distribute rules of behavior per new Rev 3 control 03.15.03",
                            controls: ["03.15.03[a]", "03.15.03[b]"], priority: "high", effort: "medium",
                            projectPlan: { category: "Governance", subcategory: "Documentation & SSP", week: 6, taskId: "R3-T1.3", owner: "CMMC Lead", accountable: "HR Mgr", deliverable: "Rules of Behavior" },
                            guidance: {
                                steps: [
                                    "Draft rules covering CUI handling, acceptable use, security responsibilities",
                                    "Include consequences for violations",
                                    "Address remote work and BYOD policies",
                                    "Require signed acknowledgment per 03.15.03[b]",
                                    "Integrate with onboarding process",
                                    "Establish annual re-acknowledgment"
                                ],
                                rev3NewControls: [
                                    { id: "03.15.03", name: "Rules of Behavior", note: "NEW — [a] establish, [b] signed acknowledgment" }
                                ],
                                artifacts: ["Rules of Behavior", "Acknowledgment Form"]
                            }
                        }
                    ]
                },
                {
                    id: "r3-m1-2", name: "Policy Framework (All 17 Families)",
                    description: "Create policies covering all Rev 3 families including new SR, PL",
                    tasks: [
                        {
                            id: "r3-t1-2-1", name: "Develop core security policies (AC, IA, AU, CM, SC, SI)",
                            description: "Create policies for the six largest control families with ODP references",
                            controls: ["03.15.01[a]", "03.15.01[b]"], priority: "critical", effort: "high",
                            projectPlan: { category: "Governance", subcategory: "Policy Development", week: 6, taskId: "R3-T1.4", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "Core Security Policies" },
                            guidance: {
                                steps: [
                                    "Create Access Control Policy (AC: 15 controls, session lock/termination ODPs)",
                                    "Create Identification & Authentication Policy (IA: 7 controls, MFA/password ODPs)",
                                    "Create Audit & Accountability Policy (AU: 8 controls, audit event/review ODPs)",
                                    "Create Configuration Management Policy (CM: 9 controls, baseline ODP)",
                                    "Create System & Communications Protection Policy (SC: 12 controls)",
                                    "Create System & Information Integrity Policy (SI: 7 controls, malware/signature ODPs)",
                                    "Reference ODP values from R3-T1.2 within each policy",
                                    "Establish policy review cadence per 03.15.01[b]"
                                ],
                                rev3NewControls: [
                                    { id: "03.15.01", name: "Policy and Procedures", note: "NEW — [a] develop, [b] review/update" }
                                ],
                                artifacts: ["AC Policy", "IA Policy", "AU Policy", "CM Policy", "SC Policy", "SI Policy"]
                            }
                        },
                        {
                            id: "r3-t1-2-2", name: "Develop operational policies (IR, MA, MP, PE, PS, AT, RA, CA)",
                            description: "Create policies for operational and support families",
                            controls: ["03.15.01[a]"], priority: "high", effort: "high",
                            projectPlan: { category: "Governance", subcategory: "Policy Development", week: 7, taskId: "R3-T1.5", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "Operational Policies" },
                            guidance: {
                                steps: [
                                    "Create Incident Response Policy (IR: 5 controls, incident type/reporting ODPs)",
                                    "Create Maintenance Policy (MA: 4 controls)",
                                    "Create Media Protection Policy (MP: 6 controls)",
                                    "Create Physical & Environmental Protection Policy (PE: 6 controls)",
                                    "Create Personnel Security Policy (PS: 5 controls)",
                                    "Create Awareness & Training Policy (AT: 3 controls, training frequency ODP)",
                                    "Create Risk Assessment Policy (RA: 3 controls, assessment/scanning ODPs)",
                                    "Create Security Assessment Policy (CA: 5 controls, assessment frequency ODP)"
                                ],
                                artifacts: ["IR Policy", "MA Policy", "MP Policy", "PE Policy", "PS Policy", "AT Policy", "RA Policy", "CA Policy"]
                            }
                        },
                        {
                            id: "r3-t1-2-3", name: "Develop NEW Rev 3 family policies (SR, PL)",
                            description: "Create policies for brand-new Rev 3 families: Supply Chain and Planning",
                            controls: ["03.16.01[a]", "03.16.01[b]", "03.16.02[a]", "03.16.03[a]", "03.16.03[b]"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Governance", subcategory: "Policy Development", week: 7, taskId: "R3-T1.6", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "SR & PL Policies" },
                            guidance: {
                                steps: [
                                    "Create Supply Chain Risk Management Policy (SR: 3 controls)",
                                    "  - 03.16.01: Supply chain risk management plan",
                                    "  - 03.16.02: Acquisition strategies and supply chain controls",
                                    "  - 03.16.03: Supply chain requirements and processes",
                                    "Create Planning Policy (PL: 3 controls)",
                                    "  - 03.15.01: Policy and procedures for all families",
                                    "  - 03.15.02: System security plan development",
                                    "  - 03.15.03: Rules of behavior",
                                    "Document supply chain risk assessment process",
                                    "Define subcontractor flow-down requirements",
                                    "Establish supplier evaluation criteria"
                                ],
                                rev3NewControls: [
                                    { id: "03.16.01", name: "Supply Chain Risk Mgmt Plan", note: "NEW family" },
                                    { id: "03.16.02", name: "Acquisition Strategies", note: "NEW family" },
                                    { id: "03.16.03", name: "Supply Chain Requirements", note: "NEW family" }
                                ],
                                artifacts: ["Supply Chain Risk Mgmt Policy", "Planning Policy", "Supplier Evaluation Criteria"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "r3-phase-2", name: "Access Control & Identity (AC, IA)",
            description: "Implement access control and identity management controls including new Rev 3 objectives for session management ODPs and multi-factor authentication.",
            duration: "4-5 weeks", icon: "access", color: "#34d399",
            milestones: [
                {
                    id: "r3-m2-1", name: "Access Control Implementation",
                    description: "Implement all 15 AC controls with Rev 3 objectives and ODPs",
                    tasks: [
                        {
                            id: "r3-t2-1-1", name: "Implement account management & least privilege",
                            description: "Establish account types, authorize access, enforce least privilege per Rev 3",
                            controls: ["03.01.01[a]", "03.01.01[b]", "03.01.01[c]", "03.01.02[a]", "03.01.02[b]", "03.01.05[a]", "03.01.05[b]"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Foundation", subcategory: "Access Control", week: 9, taskId: "R3-T2.1", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Account Management SOP" },
                            guidance: {
                                steps: [
                                    "Define account types (privileged, user, service, shared, guest, temporary)",
                                    "Implement role-based access control (RBAC) model",
                                    "Enforce least privilege: users get minimum access needed",
                                    "Configure separation of duties for critical functions",
                                    "Establish account provisioning and deprovisioning procedures",
                                    "Implement privileged access management (PAM) solution",
                                    "Document in SSP per 03.01.01 and 03.01.02 objectives"
                                ],
                                artifacts: ["Account Management SOP", "RBAC Matrix", "PAM Configuration"]
                            }
                        },
                        {
                            id: "r3-t2-1-2", name: "Configure CUI flow control & separation",
                            description: "Control CUI flow between systems and enforce duty separation",
                            controls: ["03.01.03[a]", "03.01.03[b]", "03.01.04[a]"],
                            priority: "critical", effort: "medium",
                            projectPlan: { category: "Foundation", subcategory: "Access Control", week: 9, taskId: "R3-T2.2", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "CUI Flow Controls" },
                            guidance: {
                                steps: [
                                    "Implement information flow policies using DLP, firewalls, and labels",
                                    "Configure M365 sensitivity labels for CUI marking",
                                    "Enforce CUI flow restrictions at network boundaries",
                                    "Separate duties: no single person controls entire CUI lifecycle",
                                    "Document approved CUI flow paths from Phase 0 data flow diagrams"
                                ],
                                artifacts: ["CUI Flow Policy", "DLP Rules", "Sensitivity Label Config"]
                            }
                        },
                        {
                            id: "r3-t2-1-3", name: "Configure session controls with ODPs",
                            description: "Implement session lock, termination, and concurrent session limits using ODP values",
                            controls: ["03.01.08[a]", "03.01.08[b]", "03.01.10[a]", "03.01.10[b]", "03.01.11[a]"],
                            priority: "critical", effort: "medium", isODPTask: true,
                            projectPlan: { category: "Foundation", subcategory: "Access Control", week: 10, taskId: "R3-T2.3", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Session Control Config" },
                            guidance: {
                                steps: [
                                    "Configure unsuccessful login lockout per ODP (suggested: 3 attempts / 30-min lockout)",
                                    "Configure session lock per ODP (suggested: 15 minutes inactivity)",
                                    "Configure session termination per ODP conditions",
                                    "Apply via Group Policy (Windows), MDM (mobile), and cloud policies",
                                    "Test lockout, lock, and termination behavior across all platforms",
                                    "Document ODP values in SSP control descriptions"
                                ],
                                odpValues: [
                                    { control: "03.01.08", param: "lockout_threshold", suggested: "3 attempts" },
                                    { control: "03.01.08", param: "lockout_duration", suggested: "30 minutes" },
                                    { control: "03.01.10", param: "inactivity_period", suggested: "15 minutes" },
                                    { control: "03.01.11", param: "termination_conditions", suggested: "Logout, timeout, policy violation" }
                                ],
                                artifacts: ["GPO Configuration", "Session Control Test Results", "SSP ODP Documentation"]
                            }
                        },
                        {
                            id: "r3-t2-1-4", name: "Implement remote access and wireless controls",
                            description: "Secure remote access, VPN, wireless, and mobile device access to CUI",
                            controls: ["03.01.12[a]", "03.01.12[b]", "03.01.15[a]", "03.01.15[b]", "03.01.16[a]", "03.01.16[b]"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Foundation", subcategory: "Access Control", week: 10, taskId: "R3-T2.4", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Remote Access Config" },
                            guidance: {
                                steps: [
                                    "Deploy VPN with FIPS-validated encryption for remote CUI access",
                                    "Configure remote access monitoring and control per 03.01.12",
                                    "Implement wireless access restrictions per 03.01.15",
                                    "Configure WPA3-Enterprise or WPA2-Enterprise with RADIUS",
                                    "Implement mobile device management (MDM) per 03.01.16",
                                    "Enforce device compliance checks before CUI access",
                                    "Document remote access architecture in SSP"
                                ],
                                artifacts: ["VPN Configuration", "Wireless Security Config", "MDM Policy"]
                            }
                        },
                        {
                            id: "r3-t2-1-5", name: "Configure external system connections and public access",
                            description: "Control external system use and restrict public-facing system access",
                            controls: ["03.01.20[a]", "03.01.20[b]", "03.01.22[a]"],
                            priority: "high", effort: "medium",
                            projectPlan: { category: "Foundation", subcategory: "Access Control", week: 11, taskId: "R3-T2.5", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "External System Controls" },
                            guidance: {
                                steps: [
                                    "Establish policy for external system use (personal devices, cloud services)",
                                    "Implement controls for portable storage per 03.01.20",
                                    "Restrict public-facing system posting per 03.01.22",
                                    "Configure USB device restrictions via GPO or endpoint protection",
                                    "Document approved external systems and conditions"
                                ],
                                artifacts: ["External System Policy", "USB Restriction Config", "Public Access Controls"]
                            }
                        }
                    ]
                },
                {
                    id: "r3-m2-2", name: "Identity & Authentication",
                    description: "Implement all 7 IA controls with MFA and password ODPs",
                    tasks: [
                        {
                            id: "r3-t2-2-1", name: "Implement multi-factor authentication with ODP",
                            description: "Deploy MFA for all access types per ODP-defined requirements",
                            controls: ["03.05.03[a]", "03.05.03[b]", "03.05.03[c]"],
                            priority: "critical", effort: "high", isODPTask: true,
                            projectPlan: { category: "Foundation", subcategory: "Identity & Auth", week: 11, taskId: "R3-T2.6", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "MFA Deployment" },
                            guidance: {
                                steps: [
                                    "Define MFA requirements per ODP (network, privileged, remote, CUI access)",
                                    "Deploy MFA solution (Microsoft Authenticator, hardware tokens, FIDO2)",
                                    "Configure Conditional Access policies in Azure AD/Entra ID",
                                    "Enforce MFA for all privileged accounts",
                                    "Enforce MFA for remote access (VPN, VDI, web apps)",
                                    "Implement phishing-resistant MFA where possible (FIDO2, certificate-based)",
                                    "Test MFA across all access scenarios"
                                ],
                                odpValues: [
                                    { control: "03.05.03", param: "mfa_access_types", suggested: "Network, privileged, remote, CUI" }
                                ],
                                artifacts: ["MFA Deployment Plan", "Conditional Access Policies", "MFA Test Results"]
                            }
                        },
                        {
                            id: "r3-t2-2-2", name: "Configure password and authenticator management with ODPs",
                            description: "Implement password complexity, identifier management, and authenticator controls",
                            controls: ["03.05.01[a]", "03.05.01[b]", "03.05.02[a]", "03.05.05[a]", "03.05.07[a]", "03.05.07[b]", "03.05.07[c]"],
                            priority: "critical", effort: "medium", isODPTask: true,
                            projectPlan: { category: "Foundation", subcategory: "Identity & Auth", week: 12, taskId: "R3-T2.7", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Password & Auth Config" },
                            guidance: {
                                steps: [
                                    "Configure password complexity per ODP (suggested: 14 chars, mixed case/number/special)",
                                    "Set identifier reuse prevention per ODP (suggested: 3 years)",
                                    "Implement password history (24 passwords remembered)",
                                    "Configure account identifier management per 03.05.05",
                                    "Protect authenticator feedback (mask passwords) per 03.05.02",
                                    "Implement authenticator management per 03.05.07 objectives",
                                    "Deploy password manager for organization"
                                ],
                                odpValues: [
                                    { control: "03.05.07", param: "password_complexity", suggested: "14 chars, mixed case/number/special" },
                                    { control: "03.05.05", param: "identifier_reuse", suggested: "3 years" }
                                ],
                                artifacts: ["Password Policy Config", "GPO Settings", "Authenticator Management SOP"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "r3-phase-3", name: "Audit, Awareness & Configuration (AU, AT, CM)",
            description: "Implement audit logging, security awareness training, and configuration management controls with Rev 3 ODPs for audit events, review frequency, training cadence, and baseline components.",
            duration: "4-5 weeks", icon: "audit", color: "#60a5fa",
            milestones: [
                {
                    id: "r3-m3-1", name: "Audit & Accountability (AU)",
                    description: "Implement all 8 AU controls with audit event and review ODPs",
                    tasks: [
                        {
                            id: "r3-t3-1-1", name: "Configure audit logging with ODP-defined events",
                            description: "Enable comprehensive audit logging per ODP-defined auditable events",
                            controls: ["03.03.01[a]", "03.03.01[b]", "03.03.01[c]", "03.03.01[d]", "03.03.02[a]", "03.03.02[b]"],
                            priority: "critical", effort: "high", isODPTask: true,
                            projectPlan: { category: "Foundation", subcategory: "Audit & Accountability", week: 13, taskId: "R3-T3.1", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Audit Logging Config" },
                            guidance: {
                                steps: [
                                    "Define auditable events per ODP (login/logout, privilege use, data access, config changes, failures)",
                                    "Configure Windows Event Logging (Security, System, Application logs)",
                                    "Configure Linux auditd rules for CUI systems",
                                    "Enable M365 Unified Audit Log and Purview audit",
                                    "Configure network device logging (firewalls, switches, VPN)",
                                    "Ensure audit records include: who, what, when, where, outcome per 03.03.01[c]",
                                    "Implement audit failure alerting per 03.03.02"
                                ],
                                odpValues: [
                                    { control: "03.03.01", param: "audit_events", suggested: "Login, logout, privilege use, data access, config changes" }
                                ],
                                artifacts: ["Audit Logging Config", "Event Categories Matrix", "Audit Failure Alerts"]
                            }
                        },
                        {
                            id: "r3-t3-1-2", name: "Deploy SIEM and configure audit review with ODP",
                            description: "Centralize logs in SIEM and establish review cadence per ODP",
                            controls: ["03.03.03[a]", "03.03.03[b]", "03.03.05[a]", "03.03.06[a]"],
                            priority: "critical", effort: "high", isODPTask: true,
                            projectPlan: { category: "Foundation", subcategory: "Audit & Accountability", week: 14, taskId: "R3-T3.2", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "SIEM Deployment" },
                            guidance: {
                                steps: [
                                    "Deploy SIEM solution (Microsoft Sentinel, Splunk, ELK)",
                                    "Configure log forwarding from all in-scope systems",
                                    "Establish audit review cadence per ODP (weekly critical / monthly standard)",
                                    "Create correlation rules for security events per 03.03.03[b]",
                                    "Configure audit log retention (minimum 1 year, 90 days online)",
                                    "Implement audit reduction and report generation per 03.03.05",
                                    "Configure time synchronization per 03.03.06"
                                ],
                                odpValues: [
                                    { control: "03.03.03", param: "audit_review_frequency", suggested: "Weekly critical / monthly standard" }
                                ],
                                artifacts: ["SIEM Architecture", "Correlation Rules", "Audit Review SOP", "Retention Policy"]
                            }
                        },
                        {
                            id: "r3-t3-1-3", name: "Protect audit information and implement integrity controls",
                            description: "Protect audit logs from unauthorized access and modification",
                            controls: ["03.03.04[a]", "03.03.04[b]", "03.03.07[a]", "03.03.08[a]"],
                            priority: "high", effort: "medium",
                            projectPlan: { category: "Foundation", subcategory: "Audit & Accountability", week: 14, taskId: "R3-T3.3", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Audit Protection Config" },
                            guidance: {
                                steps: [
                                    "Restrict audit log access to authorized personnel only per 03.03.04",
                                    "Implement log integrity controls (write-once storage, checksums)",
                                    "Configure audit log backup to separate secure location",
                                    "Implement cross-organizational auditing per 03.03.07 (NEW Rev 3)",
                                    "Configure audit record protection per 03.03.08 (NEW Rev 3)"
                                ],
                                rev3NewControls: [
                                    { id: "03.03.07", name: "Cross-Organizational Auditing", note: "NEW in Rev 3" },
                                    { id: "03.03.08", name: "Audit Record Protection", note: "NEW in Rev 3" }
                                ],
                                artifacts: ["Audit Protection Config", "Log Integrity Verification", "Backup Config"]
                            }
                        }
                    ]
                },
                {
                    id: "r3-m3-2", name: "Awareness & Training (AT)",
                    description: "Implement security awareness and training with ODP frequency",
                    tasks: [
                        {
                            id: "r3-t3-2-1", name: "Develop and deploy security awareness training program",
                            description: "Create CUI-focused training with ODP-defined frequency",
                            controls: ["03.02.01[a]", "03.02.01[b]", "03.02.02[a]", "03.02.02[b]", "03.02.03[a]"],
                            priority: "critical", effort: "high", isODPTask: true,
                            projectPlan: { category: "Governance", subcategory: "Training", week: 15, taskId: "R3-T3.4", owner: "CMMC Lead", accountable: "HR Mgr", deliverable: "Training Program" },
                            guidance: {
                                steps: [
                                    "Develop security awareness content covering CUI handling, phishing, social engineering",
                                    "Set training frequency per ODP (suggested: annually + upon significant changes)",
                                    "Create role-based training for IT admins, developers, managers per 03.02.02",
                                    "Include insider threat awareness per 03.02.03",
                                    "Deploy training platform (KnowBe4, Proofpoint, SANS)",
                                    "Track completion and maintain training records",
                                    "Conduct phishing simulations quarterly"
                                ],
                                odpValues: [
                                    { control: "03.02.01", param: "training_frequency", suggested: "Annually + upon significant changes" }
                                ],
                                artifacts: ["Training Content", "Training Records", "Phishing Simulation Results"]
                            }
                        }
                    ]
                },
                {
                    id: "r3-m3-3", name: "Configuration Management (CM)",
                    description: "Implement all 9 CM controls including new Rev 3 controls",
                    tasks: [
                        {
                            id: "r3-t3-3-1", name: "Establish baseline configurations with ODP",
                            description: "Create and maintain system baselines per ODP-defined components",
                            controls: ["03.04.01[a]", "03.04.01[b]", "03.04.01[c]", "03.04.01[d]", "03.04.02[a]", "03.04.02[b]"],
                            priority: "critical", effort: "high", isODPTask: true,
                            projectPlan: { category: "Foundation", subcategory: "Configuration Mgmt", week: 16, taskId: "R3-T3.5", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Baseline Configurations" },
                            guidance: {
                                steps: [
                                    "Define baseline components per ODP (OS, apps, network devices, security tools)",
                                    "Create baseline configurations using CIS Benchmarks or DISA STIGs",
                                    "Document baselines for Windows, Linux, network devices, cloud services",
                                    "Implement configuration change control per 03.04.02",
                                    "Deploy configuration management tools (Intune, SCCM, Ansible)",
                                    "Establish change control board (CCB) process",
                                    "Automate baseline compliance scanning"
                                ],
                                odpValues: [
                                    { control: "03.04.01", param: "baseline_components", suggested: "OS, apps, network devices, security tools" }
                                ],
                                artifacts: ["Baseline Configs", "CIS/STIG Compliance Reports", "Change Control Process"]
                            }
                        },
                        {
                            id: "r3-t3-3-2", name: "Implement change control, least functionality, and software restrictions",
                            description: "Control changes, restrict unnecessary functions, and manage software",
                            controls: ["03.04.06[a]", "03.04.06[b]", "03.04.08[a]", "03.04.08[b]", "03.04.09[a]"],
                            priority: "high", effort: "high",
                            projectPlan: { category: "Foundation", subcategory: "Configuration Mgmt", week: 17, taskId: "R3-T3.6", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "CM Controls" },
                            guidance: {
                                steps: [
                                    "Implement least functionality per 03.04.06 (disable unnecessary services/ports)",
                                    "Configure application whitelisting per 03.04.08",
                                    "Restrict user-installed software per 03.04.09",
                                    "Deploy Windows AppLocker or WDAC policies",
                                    "Disable unnecessary Windows features and services",
                                    "Harden network device configurations"
                                ],
                                artifacts: ["Least Functionality Config", "AppLocker Policies", "Software Restriction Policy"]
                            }
                        },
                        {
                            id: "r3-t3-3-3", name: "Implement NEW Rev 3 CM controls (inventory, info location)",
                            description: "Deploy new Rev 3 controls for component inventory and information location",
                            controls: ["03.04.10[a]", "03.04.10[b]", "03.04.11[a]"],
                            priority: "critical", effort: "medium",
                            projectPlan: { category: "Foundation", subcategory: "Configuration Mgmt", week: 17, taskId: "R3-T3.7", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Inventory & Location Tracking" },
                            guidance: {
                                steps: [
                                    "Formalize system component inventory from Phase 0 per 03.04.10[a] (NEW)",
                                    "Implement automated inventory updates per 03.04.10[b] (NEW)",
                                    "Document CUI information locations per 03.04.11[a] (NEW)",
                                    "Deploy automated discovery tools (NinjaOne, Intune, SCCM)",
                                    "Establish inventory reconciliation process (monthly)",
                                    "Track CUI storage locations and update as changes occur"
                                ],
                                rev3NewControls: [
                                    { id: "03.04.10", name: "System Component Inventory", note: "NEW in Rev 3" },
                                    { id: "03.04.11", name: "Information Location", note: "NEW in Rev 3" }
                                ],
                                artifacts: ["Component Inventory Database", "Automated Discovery Config", "CUI Location Register"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "r3-phase-4", name: "System & Communications Protection (SC, SI)",
            description: "Implement network security, encryption, boundary protection, and system integrity controls including malware protection ODPs and new Rev 3 objectives.",
            duration: "4-5 weeks", icon: "network", color: "#a78bfa",
            milestones: [
                {
                    id: "r3-m4-1", name: "System & Communications Protection (SC)",
                    description: "Implement all 12 SC controls for boundary protection, encryption, and network security",
                    tasks: [
                        {
                            id: "r3-t4-1-1", name: "Implement boundary protection and network segmentation",
                            description: "Deploy boundary devices, segment CUI networks, and enforce deny-by-default",
                            controls: ["03.13.01[a]", "03.13.01[b]", "03.13.06[a]", "03.13.06[b]"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Foundation", subcategory: "Network Security", week: 18, taskId: "R3-T4.1", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Network Segmentation" },
                            guidance: {
                                steps: [
                                    "Deploy/configure boundary firewalls per 03.13.01[a]",
                                    "Implement internal network segmentation per 03.13.01[b]",
                                    "Configure deny-by-default / allow-by-exception per 03.13.06",
                                    "Create CUI VLAN/subnet with restricted access",
                                    "Implement micro-segmentation where feasible",
                                    "Configure IDS/IPS at boundary and key internal points",
                                    "Document firewall rules and justify each allow rule"
                                ],
                                artifacts: ["Firewall Rule Set", "Network Segmentation Diagram", "IDS/IPS Config"]
                            }
                        },
                        {
                            id: "r3-t4-1-2", name: "Implement FIPS-validated encryption (at rest and in transit)",
                            description: "Deploy FIPS 140-2/3 validated encryption for all CUI",
                            controls: ["03.13.08[a]", "03.13.10[a]", "03.13.10[b]", "03.13.11[a]"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Foundation", subcategory: "Encryption", week: 19, taskId: "R3-T4.2", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Encryption Deployment" },
                            guidance: {
                                steps: [
                                    "Enable FIPS mode on Windows systems (GPO: FIPS compliant algorithms)",
                                    "Configure BitLocker with FIPS-validated encryption for data at rest",
                                    "Implement TLS 1.2+ for all CUI data in transit per 03.13.08",
                                    "Configure VPN with FIPS-validated algorithms per 03.13.10",
                                    "Implement email encryption (S/MIME or TLS) for CUI",
                                    "Verify FIPS validation status via CMVP database",
                                    "Configure key management procedures per 03.13.11"
                                ],
                                artifacts: ["FIPS Configuration", "Encryption Inventory", "Key Management SOP"]
                            }
                        },
                        {
                            id: "r3-t4-1-3", name: "Implement remaining SC controls",
                            description: "Deploy DNS security, collaborative computing, mobile code, and VoIP controls",
                            controls: ["03.13.02[a]", "03.13.03[a]", "03.13.04[a]", "03.13.09[a]", "03.13.12[a]", "03.13.13[a]"],
                            priority: "high", effort: "medium", isODPTask: true,
                            projectPlan: { category: "Foundation", subcategory: "Network Security", week: 20, taskId: "R3-T4.3", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "SC Controls" },
                            guidance: {
                                steps: [
                                    "Implement security engineering principles per 03.13.02",
                                    "Configure collaborative computing restrictions per 03.13.03",
                                    "Restrict mobile code execution per 03.13.04",
                                    "Configure network disconnect per ODP inactivity period per 03.13.09",
                                    "Implement DNS filtering and protection per 03.13.12 (NEW Rev 3)",
                                    "Implement CUI at alternative sites per 03.13.13 (NEW Rev 3)"
                                ],
                                odpValues: [
                                    { control: "03.13.09", param: "inactivity_period", suggested: "Organization-defined period" }
                                ],
                                rev3NewControls: [
                                    { id: "03.13.12", name: "DNS Protection", note: "NEW in Rev 3" },
                                    { id: "03.13.13", name: "CUI at Alternative Sites", note: "NEW in Rev 3" }
                                ],
                                artifacts: ["DNS Security Config", "Collaborative Computing Policy", "Mobile Code Policy"]
                            }
                        }
                    ]
                },
                {
                    id: "r3-m4-2", name: "System & Information Integrity (SI)",
                    description: "Implement all 7 SI controls with malware and signature update ODPs",
                    tasks: [
                        {
                            id: "r3-t4-2-1", name: "Deploy endpoint protection with ODP-defined scanning",
                            description: "Implement malware protection with ODP scanning frequency and signature updates",
                            controls: ["03.14.01[a]", "03.14.01[b]", "03.14.02[a]", "03.14.02[b]"],
                            priority: "critical", effort: "high", isODPTask: true,
                            projectPlan: { category: "Foundation", subcategory: "Endpoint Security", week: 20, taskId: "R3-T4.4", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Endpoint Protection" },
                            guidance: {
                                steps: [
                                    "Deploy EDR/XDR solution (SentinelOne, CrowdStrike, Defender for Endpoint)",
                                    "Configure real-time scanning per ODP (suggested: real-time + daily full)",
                                    "Configure signature updates per ODP (suggested: within 24 hours)",
                                    "Enable behavioral analysis and machine learning detection",
                                    "Configure automated quarantine and remediation",
                                    "Deploy to all in-scope endpoints including servers",
                                    "Establish malware incident response procedures"
                                ],
                                odpValues: [
                                    { control: "03.14.01", param: "scanning_frequency", suggested: "Real-time + daily full scans" },
                                    { control: "03.14.02", param: "signature_updates", suggested: "Within 24 hours of release" }
                                ],
                                artifacts: ["EDR Deployment Config", "Scanning Policy", "Malware Response SOP"]
                            }
                        },
                        {
                            id: "r3-t4-2-2", name: "Implement security alerts, patching, and monitoring",
                            description: "Configure security alerting, patch management, and system monitoring",
                            controls: ["03.14.03[a]", "03.14.03[b]", "03.14.04[a]", "03.14.06[a]", "03.14.06[b]", "03.14.07[a]"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Foundation", subcategory: "System Integrity", week: 21, taskId: "R3-T4.5", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Patching & Monitoring" },
                            guidance: {
                                steps: [
                                    "Subscribe to security advisory sources (CISA, vendor bulletins) per 03.14.03",
                                    "Implement patch management process per 03.14.04",
                                    "Deploy patch management tool (WSUS, Intune, NinjaOne)",
                                    "Establish patching SLA: critical 72h, high 7d, medium 30d",
                                    "Monitor system security alerts and advisories per 03.14.06",
                                    "Implement integrity monitoring per 03.14.07 (NEW Rev 3)",
                                    "Configure file integrity monitoring (FIM) for critical files"
                                ],
                                rev3NewControls: [
                                    { id: "03.14.07", name: "System Monitoring", note: "NEW in Rev 3" }
                                ],
                                artifacts: ["Patch Management SOP", "Patching SLA", "FIM Config", "Advisory Subscriptions"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "r3-phase-5", name: "Operational Security (IR, MA, MP, PE, PS)",
            description: "Implement incident response, maintenance, media protection, physical security, and personnel security controls with Rev 3 ODPs for incident types, reporting, and IR testing.",
            duration: "4-5 weeks", icon: "operations", color: "#f472b6",
            milestones: [
                {
                    id: "r3-m5-1", name: "Incident Response (IR)",
                    description: "Implement all 5 IR controls with incident type, reporting, and testing ODPs",
                    tasks: [
                        {
                            id: "r3-t5-1-1", name: "Develop incident response plan with ODPs",
                            description: "Create IR plan with ODP-defined incident types, reporting timeframes, and testing frequency",
                            controls: ["03.06.01[a]", "03.06.01[b]", "03.06.02[a]", "03.06.02[b]", "03.06.03[a]"],
                            priority: "critical", effort: "high", isODPTask: true,
                            projectPlan: { category: "Governance", subcategory: "Incident Response", week: 22, taskId: "R3-T5.1", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "IR Plan" },
                            guidance: {
                                steps: [
                                    "Define incident types per ODP (malware, unauthorized access, data breach, DoS)",
                                    "Establish incident reporting timeframes per ODP (72h DoD / 24h critical)",
                                    "Set IR testing frequency per ODP (suggested: annually)",
                                    "Create incident response plan covering detection, analysis, containment, eradication, recovery",
                                    "Define roles and responsibilities (IR team, management, legal, PR)",
                                    "Establish communication procedures (internal, DoD DIBNet, law enforcement)",
                                    "Create incident classification and severity matrix",
                                    "Develop playbooks for common incident types"
                                ],
                                odpValues: [
                                    { control: "03.06.01", param: "incident_types", suggested: "Malware, unauthorized access, breach, DoS" },
                                    { control: "03.06.02", param: "reporting_timeframe", suggested: "72h DoD / 24h critical" },
                                    { control: "03.06.03", param: "ir_testing_frequency", suggested: "Annually" }
                                ],
                                artifacts: ["IR Plan", "Incident Playbooks", "Communication Procedures", "Severity Matrix"]
                            }
                        },
                        {
                            id: "r3-t5-1-2", name: "Implement IR tracking and conduct tabletop exercise",
                            description: "Deploy incident tracking and test the IR plan",
                            controls: ["03.06.01[c]", "03.06.03[a]", "03.06.04[a]"],
                            priority: "high", effort: "medium",
                            projectPlan: { category: "Governance", subcategory: "Incident Response", week: 23, taskId: "R3-T5.2", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "IR Exercise Results" },
                            guidance: {
                                steps: [
                                    "Deploy incident tracking system (ticketing, SIEM integration)",
                                    "Conduct tabletop exercise with realistic CUI breach scenario",
                                    "Test DIBNet reporting procedures",
                                    "Document lessons learned and update IR plan",
                                    "Implement IR training for all team members per 03.06.04 (NEW Rev 3)"
                                ],
                                rev3NewControls: [
                                    { id: "03.06.04", name: "Incident Response Training", note: "NEW in Rev 3" }
                                ],
                                artifacts: ["Tabletop Exercise Report", "Lessons Learned", "IR Training Records"]
                            }
                        }
                    ]
                },
                {
                    id: "r3-m5-2", name: "Maintenance, Media, Physical & Personnel (MA, MP, PE, PS)",
                    description: "Implement maintenance, media protection, physical security, and personnel controls",
                    tasks: [
                        {
                            id: "r3-t5-2-1", name: "Implement maintenance controls",
                            description: "Establish system maintenance procedures and controls",
                            controls: ["03.07.01[a]", "03.07.01[b]", "03.07.02[a]", "03.07.02[b]", "03.07.05[a]", "03.07.06[a]"],
                            priority: "high", effort: "medium",
                            projectPlan: { category: "Foundation", subcategory: "Maintenance", week: 23, taskId: "R3-T5.3", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Maintenance SOP" },
                            guidance: {
                                steps: [
                                    "Establish maintenance scheduling and approval process per 03.07.01",
                                    "Control nonlocal maintenance per 03.07.02 (MFA, encryption, logging)",
                                    "Sanitize equipment before off-site maintenance per 03.07.05",
                                    "Implement maintenance personnel controls per 03.07.06",
                                    "Maintain maintenance logs and records"
                                ],
                                artifacts: ["Maintenance SOP", "Maintenance Log Template", "Sanitization Procedures"]
                            }
                        },
                        {
                            id: "r3-t5-2-2", name: "Implement media protection controls",
                            description: "Protect, sanitize, and control CUI media",
                            controls: ["03.08.01[a]", "03.08.01[b]", "03.08.01[c]", "03.08.02[a]", "03.08.03[a]", "03.08.03[b]", "03.08.04[a]", "03.08.05[a]", "03.08.06[a]"],
                            priority: "critical", effort: "medium",
                            projectPlan: { category: "Foundation", subcategory: "Media Protection", week: 24, taskId: "R3-T5.4", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Media Protection SOP" },
                            guidance: {
                                steps: [
                                    "Implement CUI media marking per 03.08.01",
                                    "Restrict access to CUI media per 03.08.02",
                                    "Implement media sanitization procedures per 03.08.03 (NIST 800-88)",
                                    "Control media transport per 03.08.05",
                                    "Implement media use restrictions per 03.08.04",
                                    "Configure USB and removable media controls",
                                    "Establish media destruction procedures (shredding, degaussing)"
                                ],
                                artifacts: ["Media Protection SOP", "Sanitization Records", "Media Inventory"]
                            }
                        },
                        {
                            id: "r3-t5-2-3", name: "Implement physical and environmental protection",
                            description: "Secure physical access to CUI systems and facilities",
                            controls: ["03.10.01[a]", "03.10.01[b]", "03.10.02[a]", "03.10.03[a]", "03.10.04[a]", "03.10.05[a]", "03.10.06[a]"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Foundation", subcategory: "Physical Security", week: 25, taskId: "R3-T5.5", owner: "Facilities", accountable: "CMMC Lead", deliverable: "Physical Security Controls" },
                            guidance: {
                                steps: [
                                    "Implement physical access controls per 03.10.01 (badges, locks, mantraps)",
                                    "Monitor physical access per 03.10.02 (cameras, logs, alarms)",
                                    "Escort and monitor visitors per 03.10.03",
                                    "Maintain physical access logs per 03.10.04",
                                    "Control access to output devices per 03.10.05",
                                    "Implement alternate work site controls per 03.10.06"
                                ],
                                artifacts: ["Physical Security Plan", "Access Control List", "Visitor Log Template"]
                            }
                        },
                        {
                            id: "r3-t5-2-4", name: "Implement personnel security controls",
                            description: "Screen personnel, manage transfers, and handle terminations",
                            controls: ["03.09.01[a]", "03.09.01[b]", "03.09.02[a]", "03.09.02[b]", "03.09.03[a]", "03.09.03[b]"],
                            priority: "critical", effort: "medium",
                            projectPlan: { category: "Governance", subcategory: "Personnel Security", week: 25, taskId: "R3-T5.6", owner: "HR Mgr", accountable: "CMMC Lead", deliverable: "Personnel Security SOP" },
                            guidance: {
                                steps: [
                                    "Implement personnel screening per 03.09.01 (background checks)",
                                    "Establish CUI access termination procedures per 03.09.02",
                                    "Implement personnel transfer procedures per 03.09.03",
                                    "Coordinate with HR for onboarding/offboarding checklists",
                                    "Ensure timely access revocation upon termination (same day)",
                                    "Implement exit interviews for CUI-cleared personnel"
                                ],
                                artifacts: ["Personnel Security SOP", "Onboarding Checklist", "Offboarding Checklist"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "r3-phase-6", name: "Risk Assessment & Security Assessment (RA, CA)",
            description: "Implement risk assessment, vulnerability management, and security assessment controls with Rev 3 ODPs for assessment frequency, scanning cadence, and continuous monitoring.",
            duration: "3-4 weeks", icon: "risk", color: "#fb923c",
            milestones: [
                {
                    id: "r3-m6-1", name: "Risk Assessment (RA)",
                    description: "Implement all 3 RA controls with assessment and scanning ODPs",
                    tasks: [
                        {
                            id: "r3-t6-1-1", name: "Conduct risk assessment with ODP frequency",
                            description: "Perform comprehensive risk assessment per ODP-defined frequency",
                            controls: ["03.11.01[a]", "03.11.01[b]", "03.11.01[c]"],
                            priority: "critical", effort: "high", isODPTask: true,
                            projectPlan: { category: "Governance", subcategory: "Risk Management", week: 26, taskId: "R3-T6.1", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "Risk Assessment Report" },
                            guidance: {
                                steps: [
                                    "Set risk assessment frequency per ODP (suggested: annually + upon changes)",
                                    "Identify threats to CUI systems (threat modeling)",
                                    "Identify vulnerabilities in systems and processes",
                                    "Assess likelihood and impact of threat exploitation",
                                    "Calculate risk levels and prioritize remediation",
                                    "Document risk assessment results and risk register",
                                    "Present findings to steering committee"
                                ],
                                odpValues: [
                                    { control: "03.11.01", param: "assessment_frequency", suggested: "Annually + upon significant changes" }
                                ],
                                artifacts: ["Risk Assessment Report", "Risk Register", "Threat Model"]
                            }
                        },
                        {
                            id: "r3-t6-1-2", name: "Implement vulnerability scanning with ODP cadence",
                            description: "Deploy vulnerability scanning per ODP-defined frequency",
                            controls: ["03.11.02[a]", "03.11.02[b]", "03.11.02[c]", "03.11.03[a]"],
                            priority: "critical", effort: "high", isODPTask: true,
                            projectPlan: { category: "Foundation", subcategory: "Vulnerability Mgmt", week: 27, taskId: "R3-T6.2", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Vuln Scanning Program" },
                            guidance: {
                                steps: [
                                    "Deploy vulnerability scanner (Tenable, Qualys, Rapid7)",
                                    "Set scanning frequency per ODP (monthly authenticated / weekly critical)",
                                    "Configure authenticated scanning for accurate results",
                                    "Establish vulnerability remediation SLAs by severity",
                                    "Implement remediation tracking and verification",
                                    "Remediate vulnerabilities per 03.11.03 within defined timeframes"
                                ],
                                odpValues: [
                                    { control: "03.11.02", param: "scanning_frequency", suggested: "Monthly authenticated / weekly critical" }
                                ],
                                artifacts: ["Vuln Scanning Config", "Remediation SLAs", "Scan Reports"]
                            }
                        }
                    ]
                },
                {
                    id: "r3-m6-2", name: "Security Assessment & Authorization (CA)",
                    description: "Implement all 5 CA controls including new Rev 3 controls",
                    tasks: [
                        {
                            id: "r3-t6-2-1", name: "Conduct security assessment with ODP frequency",
                            description: "Perform security control assessment per ODP-defined frequency",
                            controls: ["03.12.01[a]", "03.12.01[b]", "03.12.01[c]"],
                            priority: "critical", effort: "high", isODPTask: true,
                            projectPlan: { category: "Governance", subcategory: "Security Assessment", week: 28, taskId: "R3-T6.3", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "Security Assessment Report" },
                            guidance: {
                                steps: [
                                    "Set assessment frequency per ODP (suggested: annually)",
                                    "Assess each of 97 controls against Rev 3 objectives",
                                    "Use this tool's assessment features to track objective-level compliance",
                                    "Document findings: satisfied, other than satisfied, not applicable",
                                    "Create Plan of Action & Milestones (POA&M) for deficiencies",
                                    "Calculate SPRS score based on assessment results"
                                ],
                                odpValues: [
                                    { control: "03.12.01", param: "assessment_frequency", suggested: "Annually" }
                                ],
                                artifacts: ["Security Assessment Report", "POA&M", "SPRS Score"]
                            }
                        },
                        {
                            id: "r3-t6-2-2", name: "Implement POA&M and continuous monitoring with ODP",
                            description: "Create POA&M process and continuous monitoring per ODP",
                            controls: ["03.12.02[a]", "03.12.02[b]", "03.12.03[a]", "03.12.03[b]"],
                            priority: "critical", effort: "high", isODPTask: true,
                            projectPlan: { category: "Governance", subcategory: "Security Assessment", week: 28, taskId: "R3-T6.4", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "POA&M & ConMon" },
                            guidance: {
                                steps: [
                                    "Create POA&M for all identified deficiencies per 03.12.02",
                                    "Assign remediation owners, milestones, and target dates",
                                    "Establish continuous monitoring per ODP (real-time critical / daily standard)",
                                    "Configure automated compliance monitoring tools",
                                    "Establish monthly POA&M review cadence",
                                    "Track remediation progress and update SPRS score"
                                ],
                                odpValues: [
                                    { control: "03.12.03", param: "monitoring_frequency", suggested: "Real-time critical / daily standard" }
                                ],
                                artifacts: ["POA&M Document", "ConMon Strategy", "Compliance Dashboard"]
                            }
                        },
                        {
                            id: "r3-t6-2-3", name: "Implement NEW Rev 3 CA controls (system connections, info exchange)",
                            description: "Deploy new Rev 3 controls for system connections and information exchange",
                            controls: ["03.12.04[a]", "03.12.04[b]", "03.12.05[a]", "03.12.05[b]"],
                            priority: "high", effort: "medium",
                            projectPlan: { category: "Foundation", subcategory: "Security Assessment", week: 29, taskId: "R3-T6.5", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "System Connection Agreements" },
                            guidance: {
                                steps: [
                                    "Document all system connections per 03.12.04 (NEW Rev 3)",
                                    "Create interconnection security agreements (ISAs)",
                                    "Implement information exchange controls per 03.12.05 (NEW Rev 3)",
                                    "Define rules for CUI exchange with external systems",
                                    "Review and approve all external connections",
                                    "Establish connection monitoring and review process"
                                ],
                                rev3NewControls: [
                                    { id: "03.12.04", name: "System Connections", note: "NEW in Rev 3" },
                                    { id: "03.12.05", name: "Information Exchange", note: "NEW in Rev 3" }
                                ],
                                artifacts: ["ISA Documents", "Connection Inventory", "Exchange Rules"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "r3-phase-7", name: "Supply Chain Risk Management (SR) — NEW",
            description: "Implement the brand-new Rev 3 Supply Chain Risk Management family. This family has no Rev 2 equivalent and requires organizations to manage supply chain risks for CUI systems.",
            duration: "3-4 weeks", icon: "supply-chain", color: "#14b8a6",
            milestones: [
                {
                    id: "r3-m7-1", name: "Supply Chain Risk Management (SR)",
                    description: "Implement all 3 SR controls — entirely new in Rev 3",
                    tasks: [
                        {
                            id: "r3-t7-1-1", name: "Develop supply chain risk management plan",
                            description: "Create comprehensive SCRM plan per 03.16.01 (NEW Rev 3 family)",
                            controls: ["03.16.01[a]", "03.16.01[b]", "03.16.01[c]"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Governance", subcategory: "Supply Chain", week: 30, taskId: "R3-T7.1", owner: "CMMC Lead", accountable: "Exec Sponsor", deliverable: "SCRM Plan" },
                            guidance: {
                                steps: [
                                    "Develop supply chain risk management plan per 03.16.01[a]",
                                    "Define supply chain risk assessment methodology",
                                    "Identify critical suppliers and subcontractors handling CUI",
                                    "Establish supplier risk evaluation criteria",
                                    "Define supply chain threat scenarios and mitigations",
                                    "Implement supply chain risk monitoring per 03.16.01[b]",
                                    "Establish plan review and update cadence per 03.16.01[c]",
                                    "Integrate SCRM into overall risk management framework"
                                ],
                                rev3NewControls: [
                                    { id: "03.16.01", name: "Supply Chain Risk Mgmt Plan", note: "ENTIRELY NEW family in Rev 3" }
                                ],
                                artifacts: ["SCRM Plan", "Supplier Risk Register", "Risk Assessment Methodology"]
                            }
                        },
                        {
                            id: "r3-t7-1-2", name: "Implement acquisition strategies and supply chain controls",
                            description: "Establish acquisition controls and supply chain protections per 03.16.02",
                            controls: ["03.16.02[a]", "03.16.02[b]"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Governance", subcategory: "Supply Chain", week: 31, taskId: "R3-T7.2", owner: "Contracts", accountable: "CMMC Lead", deliverable: "Acquisition Controls" },
                            guidance: {
                                steps: [
                                    "Develop acquisition strategies with supply chain risk considerations per 03.16.02[a]",
                                    "Include security requirements in contracts and RFPs",
                                    "Require CMMC certification from subcontractors handling CUI",
                                    "Implement supply chain controls per 03.16.02[b]",
                                    "Establish supplier security assessment process",
                                    "Define acceptable supply chain risk thresholds",
                                    "Create supplier security questionnaire"
                                ],
                                rev3NewControls: [
                                    { id: "03.16.02", name: "Acquisition Strategies", note: "NEW in Rev 3" }
                                ],
                                artifacts: ["Acquisition Strategy", "Supplier Security Questionnaire", "Contract Security Clauses"]
                            }
                        },
                        {
                            id: "r3-t7-1-3", name: "Establish supply chain requirements and processes",
                            description: "Define and enforce supply chain security requirements per 03.16.03",
                            controls: ["03.16.03[a]", "03.16.03[b]"],
                            priority: "critical", effort: "medium",
                            projectPlan: { category: "Governance", subcategory: "Supply Chain", week: 32, taskId: "R3-T7.3", owner: "CMMC Lead", accountable: "Contracts", deliverable: "Supply Chain Requirements" },
                            guidance: {
                                steps: [
                                    "Define supply chain security requirements per 03.16.03[a]",
                                    "Establish CMMC flow-down requirements for subcontractors",
                                    "Implement processes to verify supplier compliance per 03.16.03[b]",
                                    "Create supplier onboarding security checklist",
                                    "Establish periodic supplier security reviews",
                                    "Document supply chain incident notification requirements",
                                    "Maintain approved supplier list"
                                ],
                                rev3NewControls: [
                                    { id: "03.16.03", name: "Supply Chain Requirements", note: "NEW in Rev 3" }
                                ],
                                artifacts: ["Supply Chain Requirements Doc", "Supplier Checklist", "Approved Supplier List"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "r3-phase-8", name: "Continuous Monitoring & Steady State",
            description: "Establish ongoing monitoring, periodic assessments, and continuous improvement processes to maintain compliance posture.",
            duration: "Ongoing", icon: "monitoring", color: "#6c8aff",
            milestones: [
                {
                    id: "r3-m8-1", name: "Continuous Monitoring Program",
                    description: "Establish ongoing monitoring and compliance maintenance",
                    tasks: [
                        {
                            id: "r3-t8-1-1", name: "Implement continuous monitoring strategy",
                            description: "Deploy automated monitoring aligned to ODP-defined frequencies",
                            controls: ["03.12.03[a]", "03.12.03[b]", "03.14.06[a]", "03.14.06[b]"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Governance", subcategory: "Continuous Monitoring", week: 33, taskId: "R3-T8.1", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "ConMon Strategy" },
                            guidance: {
                                steps: [
                                    "Define monitoring strategy covering all 97 Rev 3 controls",
                                    "Configure automated compliance scanning (CIS, STIG benchmarks)",
                                    "Establish security metrics and KPIs dashboard",
                                    "Configure real-time alerting for critical security events",
                                    "Implement automated configuration drift detection",
                                    "Establish monthly security review meetings",
                                    "Create quarterly compliance reporting for leadership"
                                ],
                                artifacts: ["ConMon Strategy", "Security Dashboard", "Metrics & KPIs"]
                            }
                        },
                        {
                            id: "r3-t8-1-2", name: "Establish periodic review cadence",
                            description: "Schedule recurring assessments, reviews, and updates",
                            controls: ["03.15.01[b]", "03.15.02[c]", "03.12.01[a]"],
                            priority: "high", effort: "medium",
                            projectPlan: { category: "Governance", subcategory: "Continuous Monitoring", week: 34, taskId: "R3-T8.2", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "Review Schedule" },
                            guidance: {
                                steps: [
                                    "Schedule annual security assessment per 03.12.01 ODP",
                                    "Schedule annual risk assessment per 03.11.01 ODP",
                                    "Schedule policy reviews per 03.15.01[b]",
                                    "Schedule SSP updates per 03.15.02[c]",
                                    "Schedule annual IR testing per 03.06.03 ODP",
                                    "Schedule annual security awareness training per 03.02.01 ODP",
                                    "Schedule monthly vulnerability scans per 03.11.02 ODP",
                                    "Schedule quarterly POA&M reviews"
                                ],
                                artifacts: ["Master Review Schedule", "Annual Assessment Calendar"]
                            }
                        },
                        {
                            id: "r3-t8-1-3", name: "Implement change management and SSP maintenance",
                            description: "Ensure SSP stays current as environment changes",
                            controls: ["03.15.02[c]", "03.04.02[a]", "03.04.02[b]"],
                            priority: "high", effort: "medium",
                            projectPlan: { category: "Governance", subcategory: "Continuous Monitoring", week: 34, taskId: "R3-T8.3", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "Change Mgmt Process" },
                            guidance: {
                                steps: [
                                    "Establish SSP update triggers (new systems, config changes, personnel changes)",
                                    "Integrate SSP updates into change management process",
                                    "Update data flow and network diagrams as environment evolves",
                                    "Review and update ODP values as needed",
                                    "Maintain version control for all compliance documents",
                                    "Document all significant changes and their security impact"
                                ],
                                artifacts: ["Change Management SOP", "SSP Version History", "Change Impact Template"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "r3-phase-9", name: "Assessment Preparation & C3PAO Readiness",
            description: "Prepare for formal CMMC Level 2 assessment. Conduct mock assessment, remediate findings, finalize all documentation, and engage C3PAO.",
            duration: "4-6 weeks", icon: "assessment", color: "#ec4899",
            milestones: [
                {
                    id: "r3-m9-1", name: "Pre-Assessment Readiness",
                    description: "Conduct internal assessment and prepare for C3PAO",
                    tasks: [
                        {
                            id: "r3-t9-1-1", name: "Conduct mock CMMC assessment",
                            description: "Perform full internal assessment against all 422 Rev 3 objectives",
                            controls: ["03.12.01[a]", "03.12.01[b]", "03.12.01[c]"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Audit Prep", subcategory: "Mock Assessment", week: 35, taskId: "R3-T9.1", owner: "CMMC Lead", accountable: "Exec Sponsor", deliverable: "Mock Assessment Report" },
                            guidance: {
                                steps: [
                                    "Assess all 97 controls against 422 Rev 3 objectives",
                                    "Use this tool to track objective-level compliance status",
                                    "Verify all ODP values are implemented as documented in SSP",
                                    "Verify all new Rev 3 controls are implemented (SR, PL, new CA/CM/SC/SI)",
                                    "Test evidence collection for each control family",
                                    "Identify any remaining gaps and create remediation plan",
                                    "Calculate preliminary SPRS score",
                                    "Engage consultant or RPO for independent review if budget allows"
                                ],
                                artifacts: ["Mock Assessment Report", "Gap Remediation Plan", "SPRS Score"]
                            }
                        },
                        {
                            id: "r3-t9-1-2", name: "Remediate mock assessment findings",
                            description: "Address all findings from mock assessment before C3PAO engagement",
                            controls: ["03.12.02[a]", "03.12.02[b]"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Audit Prep", subcategory: "Remediation", week: 36, taskId: "R3-T9.2", owner: "IT Admin", accountable: "CMMC Lead", deliverable: "Remediation Evidence" },
                            guidance: {
                                steps: [
                                    "Prioritize findings by SPRS impact and assessment risk",
                                    "Remediate critical and high findings first",
                                    "Update POA&M with remaining items and realistic timelines",
                                    "Collect and organize evidence for each remediated finding",
                                    "Re-test remediated controls to verify effectiveness",
                                    "Update SSP to reflect all changes",
                                    "Conduct final SPRS score calculation"
                                ],
                                artifacts: ["Remediation Evidence Package", "Updated POA&M", "Updated SSP"]
                            }
                        },
                        {
                            id: "r3-t9-1-3", name: "Finalize SSP and evidence package",
                            description: "Complete all documentation and organize evidence for C3PAO review",
                            controls: ["03.15.02[a]", "03.15.02[b]", "03.15.02[c]"],
                            priority: "critical", effort: "high",
                            projectPlan: { category: "Audit Prep", subcategory: "Documentation", week: 37, taskId: "R3-T9.3", owner: "CMMC Lead", accountable: "CMMC Lead", deliverable: "Final SSP & Evidence" },
                            guidance: {
                                steps: [
                                    "Finalize SSP with all 97 control implementations documented",
                                    "Verify all ODP values are documented in SSP",
                                    "Ensure data flow and network diagrams are current",
                                    "Organize evidence by control family in shared repository",
                                    "Verify all policies are signed, dated, and current",
                                    "Confirm all training records are complete",
                                    "Prepare executive summary for C3PAO",
                                    "Create assessment readiness checklist"
                                ],
                                artifacts: ["Final SSP", "Evidence Repository", "Readiness Checklist"]
                            }
                        }
                    ]
                },
                {
                    id: "r3-m9-2", name: "C3PAO Engagement",
                    description: "Select and engage C3PAO for formal CMMC Level 2 assessment",
                    tasks: [
                        {
                            id: "r3-t9-2-1", name: "Select and engage C3PAO",
                            description: "Choose authorized C3PAO and schedule assessment",
                            controls: [], priority: "critical", effort: "medium",
                            projectPlan: { category: "Audit Prep", subcategory: "C3PAO", week: 38, taskId: "R3-T9.4", owner: "CMMC Lead", accountable: "Exec Sponsor", deliverable: "C3PAO Contract" },
                            guidance: {
                                steps: [
                                    "Research authorized C3PAOs from Cyber AB marketplace",
                                    "Request proposals from 2-3 C3PAOs",
                                    "Verify C3PAO authorization status and assessor qualifications",
                                    "Negotiate scope, timeline, and cost",
                                    "Schedule assessment (allow 4-6 weeks lead time)",
                                    "Provide SSP and evidence package for pre-assessment review",
                                    "Coordinate logistics (on-site access, personnel availability)"
                                ],
                                artifacts: ["C3PAO Contract", "Assessment Schedule", "Pre-Assessment Package"]
                            }
                        },
                        {
                            id: "r3-t9-2-2", name: "Support C3PAO assessment and achieve certification",
                            description: "Facilitate the formal assessment and address any findings",
                            controls: [], priority: "critical", effort: "high",
                            projectPlan: { category: "Audit Prep", subcategory: "C3PAO", week: 39, taskId: "R3-T9.5", owner: "CMMC Lead", accountable: "Exec Sponsor", deliverable: "CMMC Certificate" },
                            guidance: {
                                steps: [
                                    "Brief all personnel on assessment process and expectations",
                                    "Designate assessment liaison and evidence coordinator",
                                    "Support assessor interviews, demonstrations, and evidence reviews",
                                    "Address any findings or requests for additional evidence promptly",
                                    "Review preliminary findings and provide clarifications",
                                    "If conditional: create remediation plan for any NOT MET objectives",
                                    "Submit SPRS score to DoD SPRS portal",
                                    "Celebrate certification and transition to steady-state operations"
                                ],
                                artifacts: ["Assessment Support Log", "CMMC Certificate", "SPRS Submission"]
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

if (typeof window !== 'undefined') {
    window.IMPLEMENTATION_PLANNER_R3 = IMPLEMENTATION_PLANNER_R3;
}
