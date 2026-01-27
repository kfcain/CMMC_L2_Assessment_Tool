// Implementation Planner - CMMC Compliance Project Guide
// A comprehensive, phased approach to implementing CMMC controls

console.log('=== CLEAN IMPLEMENTATION PLANNER LOADING ===');

const IMPLEMENTATION_PLANNER = {
    version: "2.0.0",
    title: "CMMC Implementation Planner - Greenfield Edition",
    description: "A comprehensive, phased approach to implementing CMMC Level 2 compliance from scratch in under 12 months, including all policies, procedures, and technical controls needed for a greenfield deployment. Remote access is integrated with network infrastructure for logical flow.",
    
    // Integration with Implementation Guide Project Plan Categories
    projectPlanMapping: {
        // Map phases to implementation guide categories
        phaseCategories: {
            "phase-0": "Governance",           // Pre-Project Planning & Executive Alignment
            "phase-1": "Foundation",           // Foundation & Assessment
            "phase-1b": "Foundation",          // Policy Development 
            "phase-2": "Foundation",           // Identity & Access
            "phase-3": "Foundation",           // Endpoint Security
            "phase-4": "Foundation",           // Network & Infrastructure
            "phase-5": "Foundation",           // Data Protection
            "phase-6": "Governance",           // Monitoring & Logging
            "phase-7": "Foundation",           // VDI Implementation (Optional)
            "phase-8": "Governance",           // Documentation
            "phase-9": "Governance",           // POA&M Remediation
            "phase-10": "Audit Prep"           // Assessment Readiness
        },
        
        // Map subcategories for detailed task organization
        subcategories: {
            "Governance": [
                "Program Management",
                "Executive Alignment",
                "Monitoring & Logging",
                "Documentation & SSP",
                "POA&M Management",
                "Change Management",
                "Incident Response",
                "Configuration Management",
                "Supply Chain"
            ],
            "Foundation": [
                "CUI Scoping & Asset Inventory",
                "Policy Development", 
                "Identity & Access Management",
                "Endpoint Security",
                "Network Infrastructure",
                "Data Protection",
                "Remote Access & VDI",
                "Maintenance",
                "Secure Development"
            ],
            "People": [
                "Personnel Security",
                "Training & Awareness",
                "Physical Security"
            ],
            "Audit Prep": [
                "Evidence Collection",
                "Assessment Readiness",
                "Compliance Validation",
                "C3PAO Engagement"
            ]
        },
        
        // RACI role mapping
        roleMapping: {
            "Exec Sponsor": "Executive Sponsor",
            "CMMC Lead": "CMMC Program Lead", 
            "FSO": "Facility Security Officer",
            "IT Admin": "IT Administrator",
            "HR Mgr": "HR Manager",
            "Dept Leads": "Department Leads",
            "SecOps": "Security Operations"
        }
    },
    
    // Project Phases
    phases: [
        {
            id: "phase-0",
            name: "Pre-Project Planning & Executive Alignment",
            description: "Secure executive sponsorship, establish budget, define timeline, and build the CMMC program foundation",
            duration: "2-3 weeks",
            icon: "foundation",
            color: "#ff6b6b",
            milestones: [
                {
                    id: "m0-1",
                    name: "Executive Sponsorship Secured",
                    description: "Obtain executive buy-in and establish governance structure",
                    tasks: [
                        {
                            id: "t0-1-1",
                            name: "Conduct executive briefing on CMMC requirements",
                            description: "Brief leadership on CMMC 2.0, timeline, costs, and business impact",
                            controls: [],
                            priority: "critical",
                            effort: "medium",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Program Management",
                                week: 1,
                                taskId: "T-0.1",
                                owner: "CMMC Lead",
                                accountable: "Exec Sponsor",
                                deliverable: "Executive Briefing Presentation"
                            },
                            guidance: {
                                steps: [
                                    "Prepare CMMC overview presentation for executives",
                                    "Explain difference between CMMC L1 and L2 requirements",
                                    "Present timeline: typically 9-18 months for greenfield",
                                    "Discuss budget requirements ($150K-$500K+ depending on scope)",
                                    "Explain C3PAO assessment process and costs ($50K-$150K)",
                                    "Highlight business impact: contract eligibility, competitive advantage",
                                    "Obtain formal executive sponsorship and commitment"
                                ],
                                artifacts: ["Executive Briefing Deck", "CMMC ROI Analysis", "Executive Sponsorship Memo"]
                            }
                        },
                        {
                            id: "t0-1-2",
                            name: "Establish CMMC Steering Committee",
                            description: "Form cross-functional governance body for CMMC program",
                            controls: ["3.12.4[a]"],
                            priority: "critical",
                            effort: "low",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Program Management",
                                week: 1,
                                taskId: "T-0.2",
                                owner: "Exec Sponsor",
                                accountable: "Exec Sponsor",
                                deliverable: "Steering Committee Charter"
                            },
                            guidance: {
                                steps: [
                                    "Identify steering committee members (CEO/COO, CISO, IT Director, FSO, HR, Legal, Contracts)",
                                    "Define meeting cadence (bi-weekly during implementation, monthly during steady-state)",
                                    "Create committee charter with roles and decision authority",
                                    "Establish escalation procedures for blockers",
                                    "Document communication plan for organization"
                                ],
                                artifacts: ["Steering Committee Charter", "Meeting Schedule", "Communication Plan"]
                            }
                        },
                        {
                            id: "t0-1-3",
                            name: "Appoint CMMC Program Lead",
                            description: "Designate dedicated resource to lead CMMC implementation",
                            controls: ["3.12.4[a]"],
                            priority: "critical",
                            effort: "low",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Program Management",
                                week: 1,
                                taskId: "T-0.3",
                                owner: "Exec Sponsor",
                                accountable: "Exec Sponsor",
                                deliverable: "CMMC Lead Appointment Letter"
                            },
                            guidance: {
                                steps: [
                                    "Identify qualified candidate (security background preferred)",
                                    "Define role responsibilities and time allocation (50-100% during implementation)",
                                    "Provide authority to coordinate across departments",
                                    "Consider external consultant/vCISO if no internal candidate",
                                    "Document appointment and communicate to organization"
                                ],
                                artifacts: ["Appointment Letter", "Role Description", "Authority Matrix"]
                            }
                        }
                    ]
                },
                {
                    id: "m0-2",
                    name: "Budget & Timeline Established",
                    description: "Define project budget, timeline, and resource allocation",
                    tasks: [
                        {
                            id: "t0-2-1",
                            name: "Develop CMMC implementation budget",
                            description: "Create comprehensive budget covering all implementation costs",
                            controls: [],
                            priority: "critical",
                            effort: "medium",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Program Management",
                                week: 1,
                                taskId: "T-0.4",
                                owner: "CMMC Lead",
                                accountable: "Exec Sponsor",
                                deliverable: "CMMC Budget Document"
                            },
                            guidance: {
                                steps: [
                                    "Estimate technology costs (M365 GCC High, security tools, VDI if needed)",
                                    "Calculate labor costs (internal staff time, contractors, consultants)",
                                    "Include C3PAO assessment costs ($50K-$150K for L2)",
                                    "Budget for training and awareness programs",
                                    "Include contingency (15-20% recommended)",
                                    "Present budget for executive approval",
                                    "Establish cost tracking mechanism"
                                ],
                                budgetCategories: [
                                    { category: "Cloud Infrastructure", range: "$50K-$200K/year", notes: "M365 GCC High, Azure Government" },
                                    { category: "Security Tools", range: "$25K-$100K/year", notes: "SIEM, EDR, vulnerability scanning" },
                                    { category: "Consulting/vCISO", range: "$50K-$200K", notes: "Gap assessment, implementation support" },
                                    { category: "C3PAO Assessment", range: "$50K-$150K", notes: "Formal CMMC Level 2 assessment" },
                                    { category: "Training", range: "$10K-$30K", notes: "Security awareness, CUI handling" },
                                    { category: "Internal Labor", range: "500-2000 hours", notes: "Staff time for implementation" }
                                ],
                                artifacts: ["Budget Spreadsheet", "Cost Breakdown", "Executive Approval"]
                            }
                        },
                        {
                            id: "t0-2-2",
                            name: "Create implementation timeline",
                            description: "Develop realistic project schedule with milestones",
                            controls: [],
                            priority: "critical",
                            effort: "medium",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Program Management",
                                week: 2,
                                taskId: "T-0.5",
                                owner: "CMMC Lead",
                                accountable: "Exec Sponsor",
                                deliverable: "Project Timeline/Gantt Chart"
                            },
                            guidance: {
                                steps: [
                                    "Map out all implementation phases (9-18 months typical)",
                                    "Identify dependencies between phases",
                                    "Account for resource availability and constraints",
                                    "Build in buffer for unexpected delays",
                                    "Set milestone dates for steering committee reviews",
                                    "Align with contract requirements if applicable",
                                    "Create Gantt chart or project schedule"
                                ],
                                artifacts: ["Project Timeline", "Gantt Chart", "Milestone Schedule"]
                            }
                        },
                        {
                            id: "t0-2-3",
                            name: "Identify and allocate resources",
                            description: "Assign internal staff and identify external support needs",
                            controls: [],
                            priority: "high",
                            effort: "medium",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Program Management",
                                week: 2,
                                taskId: "T-0.6",
                                owner: "CMMC Lead",
                                accountable: "Exec Sponsor",
                                deliverable: "Resource Allocation Matrix"
                            },
                            guidance: {
                                steps: [
                                    "Identify required skill sets (security, IT, compliance, HR)",
                                    "Assess internal resource availability and gaps",
                                    "Determine external support needs (consultants, MSP)",
                                    "Negotiate time allocation with department managers",
                                    "Create RACI matrix for key activities",
                                    "Document resource commitments"
                                ],
                                artifacts: ["Resource Matrix", "RACI Chart", "Skills Gap Analysis"]
                            }
                        }
                    ]
                },
                {
                    id: "m0-3",
                    name: "Contract & Scope Analysis",
                    description: "Analyze DoD contracts and determine CUI scope",
                    tasks: [
                        {
                            id: "t0-3-1",
                            name: "Review DoD contracts for CMMC requirements",
                            description: "Analyze all contracts for DFARS 7012, 7019, 7020, 7021 clauses",
                            controls: ["3.1.3[c]"],
                            priority: "critical",
                            effort: "medium",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Program Management",
                                week: 2,
                                taskId: "T-0.7",
                                owner: "Contracts",
                                accountable: "CMMC Lead",
                                deliverable: "Contract Analysis Report"
                            },
                            guidance: {
                                steps: [
                                    "Gather all current DoD contracts and subcontracts",
                                    "Identify DFARS 252.204-7012 (Safeguarding CDI) clauses",
                                    "Identify DFARS 252.204-7019/7020/7021 (CMMC) clauses",
                                    "Determine required CMMC level per contract",
                                    "Identify CUI categories (CTI, ITAR, etc.)",
                                    "Note any flow-down requirements to subcontractors",
                                    "Create contract requirements matrix"
                                ],
                                artifacts: ["Contract Analysis Matrix", "CUI Categories List", "Flow-Down Requirements"]
                            }
                        },
                        {
                            id: "t0-3-2",
                            name: "Determine assessment scope strategy",
                            description: "Decide on enclave approach vs. enterprise-wide scope",
                            controls: ["3.12.4[b]"],
                            priority: "critical",
                            effort: "medium",
                            projectPlan: {
                                category: "Foundation",
                                subcategory: "CUI Scoping & Asset Inventory",
                                week: 2,
                                taskId: "T-0.8",
                                owner: "CMMC Lead",
                                accountable: "Exec Sponsor",
                                deliverable: "Scope Strategy Document"
                            },
                            guidance: {
                                steps: [
                                    "Evaluate enclave approach (isolated CUI environment) vs. enterprise-wide",
                                    "Consider cost/benefit of each approach",
                                    "Assess impact on business operations",
                                    "Evaluate technical feasibility of enclave isolation",
                                    "Document scope decision and rationale",
                                    "Identify systems and personnel in scope"
                                ],
                                scopeOptions: [
                                    {
                                        name: "Enclave Approach",
                                        pros: ["Smaller scope", "Lower cost", "Faster implementation"],
                                        cons: ["Operational friction", "Limited CUI access", "User workflow changes"],
                                        bestFor: "Organizations with limited CUI volume"
                                    },
                                    {
                                        name: "Enterprise-Wide",
                                        pros: ["No workflow changes", "All users CUI-capable", "Simpler operations"],
                                        cons: ["Higher cost", "Longer implementation", "More systems in scope"],
                                        bestFor: "Organizations with CUI throughout operations"
                                    }
                                ],
                                artifacts: ["Scope Strategy Document", "Scope Decision Matrix", "In-Scope Systems List"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-1",
            name: "Foundation & Assessment",
            description: "Establish baseline, scope CUI, and assess current state",
            duration: "2-3 weeks",
            icon: "foundation",
            color: "#61afef",
            milestones: [
                {
                    id: "m1-1",
                    name: "CUI Scoping & Asset Inventory Complete",
                    description: "Identify all systems, data flows, assets, and personnel that handle CUI",
                    tasks: [
                        {
                            id: "t1-1-1",
                            name: "Identify CUI data types and sources",
                            description: "Review contracts, DD Form 254s, and markings to identify CUI categories",
                            controls: ["3.1.3[c]", "3.8.1[a]", "3.8.1[c]"],
                            priority: "critical",
                            effort: "medium",
                            // Project Plan Integration
                            projectPlan: {
                                category: "Foundation",
                                subcategory: "CUI Scoping & Asset Inventory",
                                week: 1,
                                taskId: "T-1.1",
                                owner: "CMMC Lead",
                                accountable: "FSO",
                                raciCategory: "Governance",
                                deliverable: "CUI Inventory Spreadsheet"
                            },
                            guidance: {
                                steps: [
                                    "Review all DoD contracts for CUI requirements per 3.1.3[c] - identify designated sources and destinations",
                                    "Identify CDI (Covered Defense Information) in scope",
                                    "Document CUI categories (CTI, ITAR, Export Controlled, etc.)",
                                    "Create CUI data inventory spreadsheet per 3.8.1[a]/[c] - track paper and digital media locations"
                                ],
                                artifacts: ["CUI Inventory", "Data Classification Guide", "Contract Review Summary"]
                            }
                        },
                        {
                            id: "t1-1-2",
                            name: "Map CUI data flows",
                            description: "Document how CUI enters, moves through, and exits your environment",
                            controls: ["3.1.3[c]", "3.13.1[a]", "3.13.1[b]"],
                            priority: "critical",
                            effort: "high",
                            // Project Plan Integration
                            projectPlan: {
                                category: "Foundation",
                                subcategory: "CUI Scoping & Asset Inventory",
                                week: 1,
                                taskId: "T-1.2",
                                owner: "IT Admin",
                                accountable: "CMMC Lead",
                                raciCategory: "Operations",
                                deliverable: "CUI Data Flow Diagram"
                            },
                            guidance: {
                                steps: [
                                    "Interview stakeholders handling CUI per 3.1.3[c] - identify designated sources and destinations",
                                    "Document ingress points (email, file transfer, portals)",
                                    "Map internal storage and processing systems",
                                    "Define external system boundary per 3.13.1[a]",
                                    "Define key internal boundaries per 3.13.1[b]",
                                    "Create data flow diagrams showing all CUI flows"
                                ],
                                artifacts: ["Data Flow Diagram", "System Interconnection Matrix"]
                            }
                        },
                        {
                            id: "t1-1-3",
                            name: "Define system boundary",
                            description: "Establish the authorization boundary for CMMC assessment",
                            controls: ["3.12.4[b]", "3.13.1[a]"],
                            priority: "critical",
                            effort: "medium",
                            // Project Plan Integration
                            projectPlan: {
                                category: "Foundation",
                                subcategory: "CUI Scoping & Asset Inventory",
                                week: 2,
                                taskId: "T-1.3",
                                owner: "IT Admin",
                                accountable: "CMMC Lead",
                                raciCategory: "Architecture",
                                deliverable: "System Boundary Document"
                            },
                            guidance: {
                                steps: [
                                    "Document system boundary in SSP per 3.12.4[b] - describe boundary for assessment",
                                    "Define external system boundary per 3.13.1[a]",
                                    "List all systems processing, storing, or transmitting CUI",
                                    "Define network segments in scope",
                                    "Identify cloud services and FedRAMP authorization status",
                                    "Document boundary decisions and justifications"
                                ],
                                artifacts: ["System Boundary Diagram", "Asset Inventory", "Cloud Service Inventory"]
                            }
                        },
                        {
                            id: "t1-1-4",
                            name: "Create comprehensive asset inventory",
                            description: "Inventory all systems, data, and personnel within CMMC scope",
                            controls: ["3.4.1[d]", "3.4.1[a]", "3.4.1[f]", "3.12.4[b]"],
                            priority: "critical",
                            effort: "high",
                            // Project Plan Integration
                            projectPlan: {
                                category: "Foundation",
                                subcategory: "CUI Scoping & Asset Inventory",
                                week: 2,
                                taskId: "T-1.4",
                                owner: "IT Admin",
                                accountable: "CMMC Lead",
                                raciCategory: "Operations",
                                deliverable: "Comprehensive Asset Inventory"
                            },
                            guidance: {
                                steps: [
                                    "Establish system inventory per 3.4.1[d] - inventory all hardware, software, firmware, and documentation",
                                    "Create baseline configuration per 3.4.1[a] - document current state of all systems",
                                    "Define asset classification scheme for SSP per 3.12.4[b] - identify in-scope vs out-of-scope assets",
                                    "Document system boundaries per 3.12.4[b] - clearly define assessment scope",
                                    "Establish CMDB for ongoing inventory maintenance per 3.4.1[f]",
                                    "Create asset lifecycle management procedures",
                                    "Document asset owner responsibilities",
                                    "Conduct physical and cloud asset discovery"
                                ],
                                assetTypes: [
                                    { category: "Hardware", examples: ["Servers", "Workstations", "Laptops", "Mobile Devices", "Network Equipment", "Storage Systems"] },
                                    { category: "Software", examples: ["Operating Systems", "Applications", "Databases", "Security Tools", "Custom Code"] },
                                    { category: "Data", examples: ["CUI Data", "PII", "Intellectual Property", "System Data", "Logs"] },
                                    { category: "Cloud", examples: ["IaaS Resources", "SaaS Applications", "Storage Accounts", "Network Resources", "Identities"] },
                                    { category: "Personnel", examples: ["Employees", "Contractors", "System Accounts", "Service Accounts"] }
                                ],
                                labelingScheme: [
                                    { label: "CUI-In-Scope", description: "Assets that process, store, or transmit CUI", color: "Red" },
                                    { label: "CUI-Boundary", description: "Assets at CMMC assessment boundary", color: "Orange" },
                                    { label: "Security-Control", description: "Assets implementing security controls", color: "Blue" },
                                    { label: "Out-of-Scope", description: "Assets not in CMMC assessment scope", color: "Green" }
                                ],
                                templates: [
                                    "Asset Inventory Template.xlsx",
                                    "Asset Classification Guide.docx",
                                    "CMDB Schema.xlsx",
                                    "Asset Lifecycle Procedure.docx",
                                    "Asset Labeling Guide.docx"
                                ],
                                storage: "SharePoint > Operations > Asset Management",
                                approval: "IT Director + Asset Manager + System Owners"
                            }
                        }
                    ]
                },
                {
                    id: "m1-2",
                    name: "Gap Assessment Complete",
                    description: "Assess current state against all 110 CMMC Level 2 controls",
                    tasks: [
                        {
                            id: "t1-2-1",
                            name: "Conduct self-assessment",
                            description: "Evaluate each of the 320 assessment objectives",
                            controls: ["3.12.1"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Use this tool to assess each objective",
                                    "Gather evidence for MET objectives",
                                    "Document gaps for NOT MET objectives",
                                    "Identify partial implementations"
                                ],
                                artifacts: ["Self-Assessment Results", "Evidence Package", "Gap Analysis Report"]
                            }
                        },
                        {
                            id: "t1-2-2",
                            name: "Calculate SPRS score",
                            description: "Determine your Supplier Performance Risk System score",
                            controls: ["3.12.1", "3.12.2"],
                            priority: "critical",
                            effort: "low",
                            guidance: {
                                steps: [
                                    "Use the SPRS calculator in this tool",
                                    "Review POA&M items and timelines",
                                    "Document score and submit to SPRS",
                                    "Plan remediation based on gaps"
                                ],
                                artifacts: ["SPRS Score Documentation", "POA&M"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-1b",
            name: "Policy & Procedure Development",
            description: "Create comprehensive policies, procedures, and documentation framework",
            duration: "3-4 weeks",
            icon: "policy",
            color: "#d19a66",
            milestones: [
                {
                    id: "m1b-1",
                    name: "Policy Framework Established",
                    description: "Create all required CMMC policies with templates",
                    tasks: [
                        {
                            id: "t1b-1-1",
                            name: "Develop Access Control Policy",
                            description: "Create comprehensive access control policies and procedures",
                            controls: ["3.1.1[a-f]", "3.1.2[a-b]", "3.5.1[a-c]", "3.5.2[a-c]"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Create Access Control Policy template",
                                    "Define user access request process",
                                    "Document role-based access control (RBAC) matrix",
                                    "Establish access review procedures (quarterly)",
                                    "Define privileged access management",
                                    "Create account creation/deletion procedures",
                                    "Document remote access policies"
                                ],
                                templates: [
                                    "Access Control Policy.docx",
                                    "User Access Request Form.docx",
                                    "Role Access Matrix.xlsx",
                                    "Access Review Checklist.docx"
                                ],
                                storage: "SharePoint > Policies > Access Control",
                                approval: "Security Committee + CIO"
                            }
                        },
                        {
                            id: "t1b-1-2",
                            name: "Develop Cyber & Network Security Policy",
                            description: "Create comprehensive cybersecurity and network security policies",
                            controls: ["3.12.1", "3.12.2", "3.12.3", "3.12.4", "3.13.1"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Create Cybersecurity Program Policy",
                                    "Develop Network Security Policy",
                                    "Define boundary protection requirements",
                                    "Create incident response procedures",
                                    "Document vulnerability management process",
                                    "Establish change management procedures",
                                    "Create system security planning process"
                                ],
                                templates: [
                                    "Cybersecurity Program Policy.docx",
                                    "Network Security Policy.docx",
                                    "Incident Response Plan.docx",
                                    "Vulnerability Management Procedure.docx",
                                    "Change Management Procedure.docx"
                                ],
                                storage: "SharePoint > Policies > Cybersecurity",
                                approval: "CISO + Security Committee"
                            }
                        },
                        {
                            id: "t1b-1-3",
                            name: "Develop Mobile Device Management Policy",
                            description: "Create MDM policies for mobile devices and telework",
                            controls: ["3.1.18[a-c]", "3.1.19[a-b]", "3.5.1[a-c]", "3.5.2[a-c]"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Create Mobile Device Management Policy",
                                    "Define Bring Your Own Device (BYOD) rules",
                                    "Document telework security requirements",
                                    "Create device encryption requirements",
                                    "Define mobile application management",
                                    "Establish device sanitization procedures",
                                    "Create lost/stolen device procedures"
                                ],
                                templates: [
                                    "Mobile Device Management Policy.docx",
                                    "Telework Security Policy.docx",
                                    "BYOD Policy.docx",
                                    "Device Security Checklist.docx"
                                ],
                                storage: "SharePoint > Policies > Mobile & Telework",
                                approval: "IT Director + HR Director"
                            }
                        },
                        {
                            id: "t1b-1-4",
                            name: "Develop Acceptable Use Policy",
                            description: "Create acceptable use policies for systems and data",
                            controls: ["3.4.7[a-o]", "3.4.8[a-c]", "3.4.9[a-c]", "3.14.7[a-b]"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Create Acceptable Use Policy for IT systems",
                                    "Define acceptable use of CUI",
                                    "Document social media restrictions",
                                    "Create email and communication policies",
                                    "Define software installation restrictions",
                                    "Establish internet usage policies",
                                    "Create user acknowledgment forms"
                                ],
                                templates: [
                                    "Acceptable Use Policy.docx",
                                    "CUI Handling Guidelines.docx",
                                    "Social Media Policy.docx",
                                    "AUP Acknowledgment Form.docx"
                                ],
                                storage: "SharePoint > Policies > Acceptable Use",
                                approval: "Legal + HR + IT"
                            }
                        },
                        {
                            id: "t1b-1-5",
                            name: "Develop Incident Response Policy",
                            description: "Create comprehensive incident response procedures",
                            controls: ["3.6.1", "3.6.2"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Create Incident Response Policy",
                                    "Define incident classification levels",
                                    "Document incident response team (IRT) structure",
                                    "Create incident reporting procedures",
                                    "Establish communication protocols",
                                    "Define evidence preservation procedures",
                                    "Create post-incident review process",
                                    "Document coordination with external parties",
                                    "Document DIBNet reporting requirements (72-hour rule)",
                                    "Create DC3/CISA notification procedures"
                                ],
                                templates: [
                                    "Incident Response Plan.docx",
                                    "Incident Report Form.docx",
                                    "IRT Contact List.xlsx",
                                    "Incident Classification Guide.docx",
                                    "DIBNet Reporting Checklist.docx"
                                ],
                                storage: "SharePoint > Policies > Incident Response",
                                approval: "CISO + Legal + PR"
                            }
                        },
                        {
                            id: "t1b-1-6",
                            name: "Create Incident Response Playbooks",
                            description: "Develop detailed playbooks for common incident types",
                            controls: ["3.6.1", "3.6.2"],
                            priority: "high",
                            effort: "high",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Incident Response",
                                week: 6,
                                taskId: "T-IR.2",
                                owner: "SecOps",
                                accountable: "CMMC Lead",
                                deliverable: "Incident Response Playbooks"
                            },
                            guidance: {
                                steps: [
                                    "Create playbook for malware/ransomware incidents",
                                    "Create playbook for phishing/social engineering",
                                    "Create playbook for data breach/CUI spillage",
                                    "Create playbook for unauthorized access",
                                    "Create playbook for insider threat incidents",
                                    "Create playbook for denial of service",
                                    "Define escalation criteria for each playbook",
                                    "Include evidence collection steps in each playbook"
                                ],
                                playbooks: [
                                    { name: "Malware/Ransomware", priority: "Critical", responseTime: "1 hour" },
                                    { name: "Phishing Attack", priority: "High", responseTime: "4 hours" },
                                    { name: "CUI Spillage", priority: "Critical", responseTime: "1 hour" },
                                    { name: "Unauthorized Access", priority: "Critical", responseTime: "1 hour" },
                                    { name: "Insider Threat", priority: "High", responseTime: "4 hours" },
                                    { name: "Account Compromise", priority: "Critical", responseTime: "1 hour" }
                                ],
                                templates: [
                                    "Incident Playbook Template.docx",
                                    "Evidence Collection Checklist.docx",
                                    "Containment Procedures.docx"
                                ],
                                storage: "SharePoint > Operations > Incident Response",
                                approval: "CISO + Legal"
                            }
                        },
                        {
                            id: "t1b-1-7",
                            name: "Schedule Tabletop Exercises",
                            description: "Plan and conduct incident response tabletop exercises",
                            controls: ["3.6.3[a-b]"],
                            priority: "high",
                            effort: "medium",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Incident Response",
                                week: 20,
                                taskId: "T-IR.3",
                                owner: "CMMC Lead",
                                accountable: "Exec Sponsor",
                                deliverable: "Tabletop Exercise Report"
                            },
                            guidance: {
                                steps: [
                                    "Schedule annual tabletop exercise (minimum)",
                                    "Develop realistic scenario (ransomware, data breach, etc.)",
                                    "Include all incident response team members",
                                    "Invite executive sponsor to observe",
                                    "Document decisions and response times",
                                    "Identify gaps in procedures or training",
                                    "Create after-action report with improvements",
                                    "Update IRP based on lessons learned"
                                ],
                                scenarios: [
                                    { name: "Ransomware Attack", description: "Critical systems encrypted, ransom demanded" },
                                    { name: "CUI Data Breach", description: "CUI exfiltrated to unknown external party" },
                                    { name: "Insider Threat", description: "Employee downloading CUI before resignation" },
                                    { name: "Supply Chain Compromise", description: "Vendor software contains malware" }
                                ],
                                templates: [
                                    "Tabletop Exercise Scenario.docx",
                                    "Exercise Attendance Sheet.xlsx",
                                    "After-Action Report Template.docx"
                                ],
                                storage: "SharePoint > Governance > Incident Response Exercises",
                                approval: "CISO + Exec Sponsor",
                                notes: "Conduct at least annually; more frequently during implementation"
                            }
                        },
                        {
                            id: "t1b-1-8",
                            name: "Develop Configuration Management Policy",
                            description: "Create comprehensive configuration management procedures",
                            controls: ["3.4.1[a-f]", "3.4.2[a-b]", "3.4.3[a-c]"],
                            priority: "critical",
                            effort: "high",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Configuration Management",
                                week: 5,
                                taskId: "T-CM.1",
                                owner: "IT Admin",
                                accountable: "CMMC Lead",
                                deliverable: "Configuration Management Policy"
                            },
                            guidance: {
                                steps: [
                                    "Create Configuration Management Policy",
                                    "Define baseline configuration requirements per 3.4.1",
                                    "Establish configuration change control process per 3.4.3",
                                    "Create Change Control Board (CCB) charter",
                                    "Define CCB membership and meeting schedule",
                                    "Establish change request and approval workflow",
                                    "Create emergency change procedures",
                                    "Document configuration documentation requirements"
                                ],
                                templates: [
                                    "Configuration Management Policy.docx",
                                    "Change Control Board Charter.docx",
                                    "Change Request Form.docx",
                                    "Emergency Change Procedure.docx",
                                    "Baseline Configuration Template.xlsx"
                                ],
                                storage: "SharePoint > Governance > Configuration Management",
                                approval: "IT Director + CISO + Change Control Board"
                            }
                        },
                        {
                            id: "t1b-1-9",
                            name: "Establish Change Control Board (CCB)",
                            description: "Form CCB to review and approve system changes",
                            controls: ["3.4.3[a-c]", "3.4.5[a-c]"],
                            priority: "critical",
                            effort: "medium",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Configuration Management",
                                week: 6,
                                taskId: "T-CM.2",
                                owner: "IT Admin",
                                accountable: "CMMC Lead",
                                deliverable: "CCB Charter and Procedures"
                            },
                            guidance: {
                                steps: [
                                    "Identify CCB members (IT, Security, Business, Management)",
                                    "Create CCB charter with authority and scope",
                                    "Define meeting schedule (weekly recommended)",
                                    "Create change categorization (standard, normal, emergency)",
                                    "Establish change review criteria and approval workflow",
                                    "Document rollback procedures for failed changes",
                                    "Create change calendar and freeze periods",
                                    "Establish security impact analysis requirements per 3.4.5"
                                ],
                                templates: [
                                    "CCB Charter.docx",
                                    "CCB Meeting Agenda Template.docx",
                                    "Change Impact Assessment Form.docx",
                                    "Change Calendar.xlsx"
                                ],
                                storage: "SharePoint > Governance > Change Control Board",
                                approval: "IT Director + CISO + Exec Sponsor"
                            }
                        }
                    ]
                },
                {
                    id: "m1b-2",
                    name: "Personnel Security Framework",
                    description: "Establish personnel security processes and background checks",
                    tasks: [
                        {
                            id: "t1b-2-1",
                            name: "Implement Background Check Process",
                            description: "Create background check procedures for US persons (ITAR)",
                            controls: ["3.7.1", "3.7.2"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Define background check requirements",
                                    "Select background check vendor (FCRA compliant)",
                                    "Create background check request process",
                                    "Document adjudication procedures",
                                    "Define re-investigation schedule (5 years)",
                                    "Create ITAR-specific requirements",
                                    "Establish foreign national screening process"
                                ],
                                templates: [
                                    "Background Check Policy.docx",
                                    "Background Check Authorization Form.docx",
                                    "ITAR Screening Checklist.docx",
                                    "Personnel Security Checklist.docx"
                                ],
                                storage: "SharePoint > HR > Personnel Security",
                                approval: "HR Director + Legal + Security",
                                notes: "For ITAR: Must verify US person status, check export violations"
                            }
                        },
                        {
                            id: "t1b-2-2",
                            name: "Create Personnel Transfer & Termination Procedures",
                            description: "Document processes for personnel changes",
                            controls: ["3.7.3", "3.7.4", "3.7.5"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Create employee termination checklist",
                                    "Define access revocation procedures",
                                    "Document knowledge transfer process",
                                    "Create exit interview process",
                                    "Establish equipment return procedures",
                                    "Define CUI handover requirements",
                                    "Create notification procedures for transfers"
                                ],
                                templates: [
                                    "Employee Termination Checklist.docx",
                                    "Access Revocation Form.docx",
                                    "Knowledge Transfer Template.docx",
                                    "Exit Interview Form.docx"
                                ],
                                storage: "SharePoint > HR > Offboarding",
                                approval: "HR Director + IT Director + Security"
                            }
                        },
                        {
                            id: "t1b-2-3",
                            name: "Create Roles & Responsibilities Matrix",
                            description: "Document security roles and responsibilities",
                            controls: ["3.3.1", "3.3.2"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Create RACI matrix for security functions",
                                    "Define security officer responsibilities",
                                    "Document system owner responsibilities",
                                    "Create user responsibility definitions",
                                    "Establish management oversight roles",
                                    "Define incident response team roles",
                                    "Create training responsibility matrix"
                                ],
                                templates: [
                                    "Security RACI Matrix.xlsx",
                                    "Role Definitions.docx",
                                    "Responsibility Assignment Matrix.xlsx"
                                ],
                                storage: "SharePoint > Governance > Roles",
                                approval: "CEO + CISO + Department Heads"
                            }
                        }
                    ]
                },
                {
                    id: "m1b-3",
                    name: "Physical & Media Security Framework",
                    description: "Establish physical security and media handling procedures",
                    tasks: [
                        {
                            id: "t1b-3-1",
                            name: "Develop Physical Security Policies",
                            description: "Create physical security procedures (inheriting from CSPs)",
                            controls: ["3.10.1", "3.10.2", "3.10.3"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Document reliance on CSP physical security",
                                    "Create telework physical security policy",
                                    "Define home office security requirements",
                                    "Create visitor management procedures",
                                    "Document physical access controls",
                                    "Establish secure area requirements",
                                    "Create physical security training"
                                ],
                                templates: [
                                    "Physical Security Policy.docx",
                                    "Telework Security Guidelines.docx",
                                    "Home Office Security Checklist.docx",
                                    "Visitor Log Template.xlsx"
                                ],
                                storage: "SharePoint > Policies > Physical Security",
                                approval: "Security Manager + Facilities Manager",
                                notes: "Leverage FedRAMP documentation from cloud providers"
                            }
                        },
                        {
                            id: "t1b-3-2",
                            name: "Develop Media Handling Procedures",
                            description: "Create procedures for marking and handling CUI media",
                            controls: ["3.8.1", "3.8.2", "3.8.3", "3.8.4", "3.8.5", "3.8.6"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Create CUI marking procedures",
                                    "Define media classification system",
                                    "Document chain of custody procedures",
                                    "Create media inventory process",
                                    "Define storage requirements for CUI media",
                                    "Establish media sanitization procedures",
                                    "Create media destruction procedures",
                                    "Document transport procedures for CUI"
                                ],
                                templates: [
                                    "CUI Marking Guide.docx",
                                    "Media Handling Procedure.docx",
                                    "Chain of Custody Form.docx",
                                    "Media Inventory Log.xlsx",
                                    "Media Sanitization Procedure.docx"
                                ],
                                storage: "SharePoint > Policies > Media Security",
                                approval: "Security Manager + Records Manager"
                            }
                        },
                        {
                            id: "t1b-3-3",
                            name: "Create Data/Device Sanitization Procedures",
                            description: "Document sanitization for all data and devices",
                            controls: ["3.8.4", "3.8.5"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Create device sanitization procedures",
                                    "Define approved sanitization methods",
                                    "Document verification procedures",
                                    "Create sanitization log templates",
                                    "Define disposal procedures",
                                    "Establish third-party destruction process",
                                    "Create exception handling procedures"
                                ],
                                templates: [
                                    "Device Sanitization Procedure.docx",
                                    "Sanitization Verification Form.docx",
                                    "Media Destruction Certificate.docx",
                                    "Sanitization Log.xlsx"
                                ],
                                storage: "SharePoint > Policies > Sanitization",
                                approval: "IT Director + Security Manager"
                            }
                        }
                    ]
                },
                {
                    id: "m1b-4",
                    name: "Risk & Compliance Management",
                    description: "Establish risk management and compliance processes",
                    tasks: [
                        {
                            id: "t1b-4-1",
                            name: "Develop Corporate Risk Management Framework",
                            description: "Create comprehensive risk management process",
                            controls: ["3.11.1", "3.11.2"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Create Risk Management Policy",
                                    "Define risk assessment methodology",
                                    "Establish risk appetite statement",
                                    "Create risk register template",
                                    "Document risk treatment process",
                                    "Define risk monitoring procedures",
                                    "Create risk reporting templates",
                                    "Establish risk governance structure"
                                ],
                                templates: [
                                    "Risk Management Policy.docx",
                                    "Risk Assessment Methodology.docx",
                                    "Risk Register.xlsx",
                                    "Risk Treatment Plan.xlsx",
                                    "Risk Report Template.pptx"
                                ],
                                storage: "SharePoint > Governance > Risk Management",
                                approval: "CEO + Board + CISO"
                            }
                        },
                        {
                            id: "t1b-4-2",
                            name: "Create Vulnerability Management Program",
                            description: "Establish vulnerability scanning and remediation",
                            controls: ["3.14.1", "3.14.2", "3.14.3"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Select vulnerability scanning tool",
                                    "Create scanning schedule (weekly for critical)",
                                    "Define vulnerability classification",
                                    "Create remediation SLAs",
                                    "Establish exception process",
                                    "Document patch management procedures",
                                    "Create vulnerability reporting",
                                    "Define continuous monitoring process"
                                ],
                                tools: [
                                    { name: "Tenable.io", type: "Commercial", notes: "Comprehensive vulnerability management" },
                                    { name: "Qualys", type: "Commercial", notes: "Cloud-based vulnerability management" },
                                    { name: "OpenVAS", type: "Open Source", notes: "Free vulnerability scanner" }
                                ],
                                templates: [
                                    "Vulnerability Management Policy.docx",
                                    "Scanning Schedule.xlsx",
                                    "Remediation SLA Matrix.xlsx",
                                    "Vulnerability Report Template.xlsx"
                                ],
                                storage: "SharePoint > Operations > Vulnerability Management",
                                approval: "CISO + IT Director"
                            }
                        },
                        {
                            id: "t1b-4-3",
                            name: "Create EDR & Malware Protection Framework",
                            description: "Implement endpoint protection and malware prevention",
                            controls: ["3.1.9", "3.1.10"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Select EDR solution",
                                    "Create malware protection policy",
                                    "Define application whitelisting process",
                                    "Create incident response for malware",
                                    "Establish quarantine procedures",
                                    "Define false positive handling",
                                    "Create EDR monitoring procedures",
                                    "Document integration with SIEM"
                                ],
                                tools: [
                                    { name: "Microsoft Defender for Endpoint", type: "Included with M365", notes: "Native integration with M365" },
                                    { name: "CrowdStrike Falcon", type: "Commercial", notes: "Leading EDR solution" },
                                    { name: "SentinelOne", type: "Commercial", notes: "AI-powered endpoint protection" }
                                ],
                                templates: [
                                    "EDR Policy.docx",
                                    "Application Whitelisting Procedure.docx",
                                    "Malware Response Plan.docx",
                                    "EDR Monitoring Guide.docx"
                                ],
                                storage: "SharePoint > Operations > Endpoint Protection",
                                approval: "CISO + IT Director"
                            }
                        }
                    ]
                },
                {
                    id: "m1b-5",
                    name: "Audit & Monitoring Framework",
                    description: "Establish audit logging, monitoring, and reporting",
                    tasks: [
                        {
                            id: "t1b-5-1",
                            name: "Create Audit & Accountability Policy",
                            description: "Define comprehensive audit logging requirements",
                            controls: ["3.3.1", "3.3.2", "3.3.3", "3.3.4", "3.3.5"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Define required audit events",
                                    "Create log retention policy (minimum 1 year)",
                                    "Establish log protection procedures",
                                    "Create log review process",
                                    "Define non-repudiation requirements",
                                    "Create audit trail documentation",
                                    "Establish log failure alerts",
                                    "Define forensic evidence procedures"
                                ],
                                requiredLogs: [
                                    "User authentication (success/failure)",
                                    "Privileged access use",
                                    "Policy changes",
                                    "CUI access",
                                    "System configuration changes",
                                    "Failed logon attempts",
                                    "Data export/transfers",
                                    "Administrative actions"
                                ],
                                templates: [
                                    "Audit Policy.docx",
                                    "Log Retention Schedule.xlsx",
                                    "Log Review Checklist.docx",
                                    "Audit Evidence Guide.docx"
                                ],
                                storage: "SharePoint > Policies > Audit & Accountability",
                                approval: "CISO + Compliance Officer"
                            }
                        },
                        {
                            id: "t1b-5-2",
                            name: "Implement SIEM & Log Correlation",
                            description: "Deploy SIEM for log correlation and reporting",
                            controls: ["3.3.6", "3.3.7"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Select SIEM solution",
                                    "Define log collection requirements",
                                    "Create correlation rules",
                                    "Establish alert thresholds",
                                    "Create dashboard requirements",
                                    "Define reporting schedules",
                                    "Document escalation procedures",
                                    "Create SIEM tuning process"
                                ],
                                tools: [
                                    { name: "Microsoft Sentinel", type: "Azure Native", notes: "Integrates with M365/Azure" },
                                    { name: "Splunk", type: "Commercial", notes: "Powerful SIEM with extensive features" },
                                    { name: "LogRhythm", type: "Commercial", notes: "SIEM with compliance focus" },
                                    { name: "ELK Stack", type: "Open Source", notes: "Elasticsearch, Logstash, Kibana" }
                                ],
                                templates: [
                                    "SIEM Configuration Guide.docx",
                                    "Correlation Rules Library.xlsx",
                                    "Alert Playbooks.docx",
                                    "SIEM Dashboard Requirements.xlsx"
                                ],
                                storage: "SharePoint > Operations > SIEM",
                                approval: "CISO + Security Operations Manager"
                            }
                        },
                        {
                            id: "t1b-5-3",
                            name: "Create Continuous Monitoring Process",
                            description: "Establish continuous monitoring and self-assessment",
                            controls: ["3.12.1", "3.12.2"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Select continuous monitoring tool",
                                    "Define monitoring frequency",
                                    "Create control assessment schedule",
                                    "Establish automated testing",
                                    "Create compliance dashboards",
                                    "Define remediation workflows",
                                    "Document status reporting",
                                    "Create POA&M management process"
                                ],
                                tools: [
                                    { name: "Vanta", type: "Commercial", notes: "Automated compliance monitoring" },
                                    { name: "Drata", type: "Commercial", notes: "Continuous compliance automation" },
                                    { name: "Hyperproof", type: "Commercial", notes: "Compliance operations platform" }
                                ],
                                templates: [
                                    "Continuous Monitoring Plan.docx",
                                    "Control Assessment Schedule.xlsx",
                                    "POA&M Template.xlsx",
                                    "Compliance Dashboard.xlsx"
                                ],
                                storage: "SharePoint > Compliance > Monitoring",
                                approval: "CISO + Compliance Officer"
                            }
                        }
                    ]
                },
                {
                    id: "m1b-6",
                    name: "Training & Awareness Program",
                    description: "Establish security awareness and training programs",
                    tasks: [
                        {
                            id: "t1b-6-1",
                            name: "Create Security Awareness Training",
                            description: "Develop comprehensive security awareness program",
                            controls: ["3.2.1", "3.2.2", "3.2.3", "3.2.4"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Create annual security awareness training",
                                    "Develop role-based training modules",
                                    "Create new hire security orientation",
                                    "Establish refresher training schedule",
                                    "Create phishing simulation program",
                                    "Document training effectiveness metrics",
                                    "Create training record management",
                                    "Define training for contractors"
                                ],
                                modules: [
                                    "Introduction to CMMC",
                                    "CUI Handling and Marking",
                                    "Phishing and Social Engineering",
                                    "Password Security and MFA",
                                    "Physical Security",
                                    "Incident Reporting",
                                    "Acceptable Use",
                                    "Insider Threat Awareness"
                                ],
                                templates: [
                                    "Security Awareness Training.pptx",
                                    "Training Attendance Log.xlsx",
                                    "Training Effectiveness Survey.docx",
                                    "Phishing Test Report.xlsx"
                                ],
                                storage: "SharePoint > Training > Security Awareness",
                                approval: "CISO + HR Director + Training Manager"
                            }
                        },
                        {
                            id: "t1b-6-2",
                            name: "Create CUI-Specific Training",
                            description: "Develop specialized CUI handling training",
                            controls: ["3.2.1", "3.2.2"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Create CUI identification training",
                                    "Develop marking procedures training",
                                    "Create CUI storage and transmission training",
                                    "Establish CUI incident response training",
                                    "Create export control awareness (ITAR)",
                                    "Document CUI handling certification",
                                    "Create refresher training schedule"
                                ],
                                modules: [
                                    "CUI Identification and Marking",
                                    "CUI Storage Requirements",
                                    "Secure CUI Transmission",
                                    "ITAR and Export Controls",
                                    "CUI Incident Response",
                                    "Cross-Boundary Transfers"
                                ],
                                templates: [
                                    "CUI Training Manual.docx",
                                    "CUI Certification Form.docx",
                                    "CUI Quiz.docx",
                                    "Training Certificate Template.docx"
                                ],
                                storage: "SharePoint > Training > CUI",
                                approval: "Security Officer + Compliance Officer"
                            }
                        },
                        {
                            id: "t1b-6-3",
                            name: "Create Insider Threat Program",
                            description: "Establish insider threat detection and prevention",
                            controls: ["3.2.5"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Create insider threat policy",
                                    "Define behavioral indicators",
                                    "Establish reporting mechanisms",
                                    "Create investigation procedures",
                                    "Document privacy considerations",
                                    "Define escalation procedures",
                                    "Create training for managers",
                                    "Establish coordination with HR"
                                ],
                                templates: [
                                    "Insider Threat Policy.docx",
                                    "Insider Threat Report Form.docx",
                                    "Behavioral Indicators Guide.docx",
                                    "Manager Training Guide.docx"
                                ],
                                storage: "SharePoint > Policies > Insider Threat",
                                approval: "CISO + HR Director + Legal"
                            }
                        }
                    ]
                },
                {
                    id: "m1b-7",
                    name: "Supply Chain Risk Management",
                    description: "Establish SCRM program for vendors, subcontractors, and service providers",
                    tasks: [
                        {
                            id: "t1b-7-0a",
                            name: "Develop Supply Chain Risk Management Policy",
                            description: "Create comprehensive SCRM policy and procedures",
                            controls: ["3.4.1[d]", "3.13.1"],
                            priority: "critical",
                            effort: "high",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Supply Chain",
                                week: 4,
                                taskId: "T-SCRM.1",
                                owner: "CMMC Lead",
                                accountable: "Exec Sponsor",
                                deliverable: "SCRM Policy"
                            },
                            guidance: {
                                steps: [
                                    "Create Supply Chain Risk Management Policy",
                                    "Define vendor/supplier security requirements",
                                    "Establish vendor risk assessment process",
                                    "Create vendor security questionnaire",
                                    "Define approved vendor/product list process",
                                    "Establish ongoing vendor monitoring procedures",
                                    "Create vendor incident notification requirements",
                                    "Document counterfeit parts prevention (if applicable)"
                                ],
                                templates: [
                                    "SCRM Policy.docx",
                                    "Vendor Security Questionnaire.xlsx",
                                    "Vendor Risk Assessment Form.docx",
                                    "Approved Vendor List.xlsx"
                                ],
                                storage: "SharePoint > Governance > Supply Chain",
                                approval: "CISO + Procurement + Legal"
                            }
                        },
                        {
                            id: "t1b-7-0b",
                            name: "Implement Subcontractor Flow-Down Requirements",
                            description: "Ensure CMMC requirements flow to all subcontractors handling CUI",
                            controls: ["3.1.3[c]", "3.13.1"],
                            priority: "critical",
                            effort: "high",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Supply Chain",
                                week: 4,
                                taskId: "T-SCRM.2",
                                owner: "Contracts",
                                accountable: "CMMC Lead",
                                deliverable: "Flow-Down Clause Templates"
                            },
                            guidance: {
                                steps: [
                                    "Inventory all subcontractors handling CUI",
                                    "Determine required CMMC level for each subcontractor",
                                    "Create flow-down clause templates for contracts",
                                    "Update existing contracts with flow-down requirements",
                                    "Establish subcontractor compliance verification process",
                                    "Create subcontractor security assessment checklist",
                                    "Document coordination procedures for CUI sharing",
                                    "Establish incident notification requirements"
                                ],
                                templates: [
                                    "Flow-Down Clause Template.docx",
                                    "Subcontractor Inventory.xlsx",
                                    "Subcontractor Security Assessment.docx",
                                    "CUI Sharing Agreement.docx"
                                ],
                                storage: "SharePoint > Contracts > Subcontractors",
                                approval: "Legal + Contracts + CMMC Lead",
                                notes: "DFARS 252.204-7012 requires flow-down to subcontractors"
                            }
                        },
                        {
                            id: "t1b-7-0c",
                            name: "Establish Cloud Service Provider (CSP) Oversight",
                            description: "Document and monitor all cloud providers for FedRAMP compliance",
                            controls: ["3.13.1", "3.13.2"],
                            priority: "critical",
                            effort: "medium",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Supply Chain",
                                week: 5,
                                taskId: "T-SCRM.3",
                                owner: "IT Admin",
                                accountable: "CMMC Lead",
                                deliverable: "CSP Inventory & Authorization Status"
                            },
                            guidance: {
                                steps: [
                                    "Inventory all cloud service providers (IaaS, PaaS, SaaS)",
                                    "Verify FedRAMP authorization status (marketplace.fedramp.gov)",
                                    "Obtain Customer Responsibility Matrix (CRM) from each CSP",
                                    "Document inherited controls vs. customer responsibility",
                                    "Establish CSP monitoring and review schedule",
                                    "Create CSP incident coordination procedures",
                                    "Document data location and sovereignty requirements",
                                    "Verify CSP meets DFARS 7012 requirements"
                                ],
                                templates: [
                                    "CSP Inventory.xlsx",
                                    "FedRAMP Status Tracker.xlsx",
                                    "Customer Responsibility Matrix.xlsx",
                                    "CSP Review Checklist.docx"
                                ],
                                storage: "SharePoint > Governance > Cloud Providers",
                                approval: "CISO + IT Director + Procurement"
                            }
                        }
                    ]
                },
                {
                    id: "m1b-8",
                    name: "Maintenance Procedures",
                    description: "Establish system maintenance policies and procedures (NIST 3.7 family)",
                    tasks: [
                        {
                            id: "t1b-8-1",
                            name: "Develop System Maintenance Policy",
                            description: "Create comprehensive maintenance policies and procedures",
                            controls: ["3.7.1[a-c]", "3.7.2[a-d]"],
                            priority: "critical",
                            effort: "medium",
                            projectPlan: {
                                category: "Foundation",
                                subcategory: "Maintenance",
                                week: 5,
                                taskId: "T-MA.1",
                                owner: "IT Admin",
                                accountable: "CMMC Lead",
                                deliverable: "Maintenance Policy"
                            },
                            guidance: {
                                steps: [
                                    "Create System Maintenance Policy per 3.7.1",
                                    "Define scheduled maintenance windows",
                                    "Establish emergency maintenance procedures",
                                    "Document maintenance approval process",
                                    "Create maintenance logging requirements",
                                    "Define maintenance tool controls per 3.7.2",
                                    "Establish maintenance personnel authorization",
                                    "Create post-maintenance verification procedures"
                                ],
                                templates: [
                                    "System Maintenance Policy.docx",
                                    "Maintenance Schedule Template.xlsx",
                                    "Maintenance Request Form.docx",
                                    "Maintenance Log Template.xlsx"
                                ],
                                storage: "SharePoint > Operations > Maintenance",
                                approval: "IT Director + CISO"
                            }
                        },
                        {
                            id: "t1b-8-2",
                            name: "Implement Remote Maintenance Controls",
                            description: "Establish controls for remote maintenance and diagnostics",
                            controls: ["3.7.5[a-c]", "3.7.6[a-b]"],
                            priority: "high",
                            effort: "medium",
                            projectPlan: {
                                category: "Foundation",
                                subcategory: "Maintenance",
                                week: 5,
                                taskId: "T-MA.2",
                                owner: "IT Admin",
                                accountable: "CMMC Lead",
                                deliverable: "Remote Maintenance Procedures"
                            },
                            guidance: {
                                steps: [
                                    "Define approved remote maintenance methods per 3.7.5",
                                    "Require MFA for all remote maintenance sessions",
                                    "Implement session recording for remote maintenance",
                                    "Establish approval process for remote maintenance",
                                    "Create termination procedures for remote sessions per 3.7.6",
                                    "Document vendor remote access requirements",
                                    "Establish monitoring for remote maintenance activities"
                                ],
                                templates: [
                                    "Remote Maintenance Policy.docx",
                                    "Remote Access Request Form.docx",
                                    "Vendor Remote Access Agreement.docx"
                                ],
                                storage: "SharePoint > Operations > Remote Maintenance",
                                approval: "IT Director + CISO"
                            }
                        },
                        {
                            id: "t1b-8-3",
                            name: "Establish Maintenance Personnel Controls",
                            description: "Control and monitor maintenance personnel access",
                            controls: ["3.7.3[a-b]", "3.7.4[a-b]"],
                            priority: "high",
                            effort: "medium",
                            projectPlan: {
                                category: "Foundation",
                                subcategory: "Maintenance",
                                week: 6,
                                taskId: "T-MA.3",
                                owner: "IT Admin",
                                accountable: "CMMC Lead",
                                deliverable: "Maintenance Personnel Procedures"
                            },
                            guidance: {
                                steps: [
                                    "Create list of authorized maintenance personnel per 3.7.3",
                                    "Establish escort procedures for non-authorized personnel per 3.7.4",
                                    "Document supervision requirements for maintenance activities",
                                    "Create maintenance personnel background check requirements",
                                    "Establish access controls for maintenance areas",
                                    "Create maintenance personnel training requirements",
                                    "Document maintenance tool custody procedures"
                                ],
                                templates: [
                                    "Authorized Maintenance Personnel List.xlsx",
                                    "Escort Log Template.xlsx",
                                    "Maintenance Personnel Training Record.docx"
                                ],
                                storage: "SharePoint > Operations > Maintenance Personnel",
                                approval: "IT Director + Security Manager"
                            }
                        }
                    ]
                },
                {
                    id: "m1b-9",
                    name: "Communications & Data Protection",
                    description: "Establish communications policies and data protection",
                    tasks: [
                        {
                            id: "t1b-7-1",
                            name: "Create Communications Policy",
                            description: "Ensure CUI is not posted publicly",
                            controls: ["3.1.22[a-e]"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Create communications security policy",
                                    "Define approved communication channels",
                                    "Establish social media restrictions",
                                    "Create email security procedures",
                                    "Define public posting restrictions",
                                    "Create external communication review",
                                    "Establish secure communication methods",
                                    "Document encryption requirements"
                                ],
                                templates: [
                                    "Communications Security Policy.docx",
                                    "Social Media Policy.docx",
                                    "Email Security Guidelines.docx",
                                    "External Communication Review Form.docx"
                                ],
                                storage: "SharePoint > Policies > Communications",
                                approval: "Legal + PR + CISO"
                            }
                        },
                        {
                            id: "t1b-7-2",
                            name: "Document ESP/CSP Relationships",
                            description: "Track all cloud providers and their FedRAMP status",
                            controls: ["3.13.1", "3.13.2"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Inventory all cloud service providers",
                                    "Collect FedRAMP authorizations",
                                    "Review SRM (Security Responsibility Matrix)",
                                    "Obtain FedRAMP Body of Evidence",
                                    "Document shared responsibilities",
                                    "Create CSP monitoring procedures",
                                    "Establish CSP security reviews",
                                    "Document CSP incident coordination"
                                ],
                                templates: [
                                    "CSP Inventory.xlsx",
                                    "FedRAMP Status Tracker.xlsx",
                                    "Security Responsibility Matrix.xlsx",
                                    "CSP Security Review Checklist.docx"
                                ],
                                storage: "SharePoint > Governance > Cloud Providers",
                                approval: "CISO + Procurement + Legal",
                                notes: "Maintain current FedRAMP authorizations for all CSPs"
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-2",
            name: "Identity & Access",
            description: "Implement identity management, authentication, and access controls",
            duration: "3-4 weeks",
            icon: "identity",
            color: "#c678dd",
            milestones: [
                {
                    id: "m2-1",
                    name: "Identity Provider Configured",
                    description: "Centralized identity management with MFA",
                    tasks: [
                        {
                            id: "t2-1-1",
                            name: "Deploy identity provider",
                            description: "Implement centralized IdP (Entra ID, Okta, etc.)",
                            controls: ["3.5.1[a-c]", "3.5.2[a-c]"],
                            priority: "critical",
                            effort: "high",
                            projectPlan: {
                                category: "Foundation",
                                subcategory: "Identity & Access Management",
                                week: 3,
                                taskId: "T-2.1",
                                owner: "IT Admin",
                                accountable: "CMMC Lead",
                                raciCategory: "Operations",
                                deliverable: "Identity Provider Configuration"
                            },
                            guidance: {
                                steps: [
                                    "Select identity provider (Entra ID recommended for M365)",
                                    "Configure tenant and domain",
                                    "Sync on-prem AD if applicable (Entra Connect)",
                                    "Configure password policies"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Microsoft Entra ID",
                                        steps: ["Create Entra ID tenant", "Configure custom domain", "Enable Security Defaults or Conditional Access"],
                                        docs: "https://learn.microsoft.com/en-us/entra/identity/"
                                    },
                                    aws: {
                                        name: "AWS IAM Identity Center",
                                        steps: ["Enable IAM Identity Center", "Configure identity source", "Create permission sets"],
                                        docs: "https://docs.aws.amazon.com/singlesignon/"
                                    },
                                    onprem: {
                                        name: "Active Directory",
                                        steps: ["Deploy domain controllers", "Configure sites and replication", "Implement tiered admin model"],
                                        docs: "https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/"
                                    }
                                },
                                artifacts: ["IdP Configuration Documentation", "Domain Verification Records"]
                            }
                        },
                        {
                            id: "t2-1-2",
                            name: "Enable MFA for all users",
                            description: "Require multi-factor authentication for all access",
                            controls: ["3.5.3[a-d]"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Choose MFA methods (authenticator app preferred)",
                                    "Create rollout plan by user group",
                                    "Configure MFA registration campaign",
                                    "Enable MFA enforcement via Conditional Access or equivalent",
                                    "Document exceptions and compensating controls"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Entra ID MFA",
                                        config: [
                                            { setting: "Conditional Access Policy", value: "Require MFA for all users", location: "Entra ID > Protection > Conditional Access" },
                                            { setting: "Authentication Methods", value: "Microsoft Authenticator, FIDO2", location: "Entra ID > Protection > Authentication Methods" },
                                            { setting: "Registration Campaign", value: "Enabled", location: "Entra ID > Protection > Authentication Methods > Registration Campaign" }
                                        ]
                                    },
                                    onprem: {
                                        name: "Azure MFA with NPS Extension or Duo",
                                        config: [
                                            { setting: "NPS Extension", value: "Install on RADIUS server", location: "NPS Server" },
                                            { setting: "VPN/RDP Integration", value: "Point to NPS for RADIUS auth", location: "VPN Gateway / RD Gateway" }
                                        ]
                                    }
                                },
                                artifacts: ["MFA Policy Documentation", "User Enrollment Report", "Exception List"]
                            }
                        },
                        {
                            id: "t2-1-3",
                            name: "Implement Conditional Access",
                            description: "Context-aware access policies based on risk",
                            controls: ["3.1.1[a-f]", "3.1.2[a-b]", "3.1.12[a-d]"],
                            priority: "high",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Define access scenarios (location, device, risk)",
                                    "Create baseline policies for all users",
                                    "Create stricter policies for CUI access",
                                    "Test in report-only mode before enforcement"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Entra Conditional Access",
                                        policies: [
                                            { name: "Require MFA for all users", conditions: "All users, All cloud apps", controls: "Require MFA" },
                                            { name: "Block legacy authentication", conditions: "All users, All cloud apps, Legacy auth clients", controls: "Block access" },
                                            { name: "Require compliant device for CUI apps", conditions: "CUI app group, All locations", controls: "Require compliant device" },
                                            { name: "Block risky sign-ins", conditions: "All users, High risk sign-in", controls: "Block access" }
                                        ]
                                    }
                                },
                                artifacts: ["Conditional Access Policy Matrix", "Policy Screenshots"]
                            }
                        }
                    ]
                },
                {
                    id: "m2-1b",
                    name: "MFA Provider Integrated",
                    description: "Select and integrate MFA provider across all platforms",
                    tasks: [
                        {
                            id: "t2-1b-1",
                            name: "Select MFA Provider",
                            description: "Evaluate and select MFA solution for all platforms",
                            controls: ["3.5.3[a-d]"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Evaluate MFA provider options",
                                    "Consider integration with existing systems",
                                    "Assess FIDO2/WebAuthn support",
                                    "Evaluate hardware token support",
                                    "Review compliance features",
                                    "Assess pricing and licensing",
                                    "Create provider selection matrix",
                                    "Select primary and backup providers"
                                ],
                                providers: [
                                    {
                                        name: "Microsoft Entra ID MFA",
                                        type: "Integrated with M365",
                                        pros: ["Native M365 integration", "No additional cost", "Conditional Access integration", "FIDO2 support"],
                                        cons: ["Limited to Microsoft ecosystem", "Requires Azure AD Premium P1 for advanced features"],
                                        bestFor: "Organizations using M365/Azure"
                                    },
                                    {
                                        name: "Duo Security",
                                        type: "Third-party",
                                        pros: ["Platform agnostic", "Hardware token support", "Push notifications", "Device health checks"],
                                        cons: ["Additional licensing cost", "Separate management console"],
                                        bestFor: "Mixed environments requiring broad device support"
                                    },
                                    {
                                        name: "Okta Adaptive MFA",
                                        type: "Third-party",
                                        pros: ["Advanced risk assessment", "Broad integration", "Contextual policies", "API access"],
                                        cons: ["Higher cost", "Complex setup", "Requires Okta subscription"],
                                        bestFor: "Enterprises with advanced security needs"
                                    },
                                    {
                                        name: "Google Authenticator",
                                        type: "Free/Basic",
                                        pros: ["Free", "Simple to use", "TOTP standard", "Offline capability"],
                                        cons: ["No centralized management", "No push notifications", "No device health checks"],
                                        bestFor: "Small organizations with basic needs"
                                    }
                                ],
                                templates: [
                                    "MFA Provider Evaluation Matrix.xlsx",
                                    "MFA Requirements Document.docx",
                                    "Provider Selection Memo.docx"
                                ],
                                storage: "SharePoint > Projects > MFA Implementation",
                                approval: "CISO + IT Director + Procurement"
                            }
                        },
                        {
                            id: "t2-1b-2",
                            name: "Integrate MFA with Platforms",
                            description: "Configure MFA across all systems and applications",
                            controls: ["3.5.3[a-d]"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Configure MFA in identity provider",
                                    "Integrate with VPN/RDP solutions",
                                    "Configure MFA for cloud applications",
                                    "Set up MFA for privileged accounts",
                                    "Configure MFA for remote access",
                                    "Test MFA workflows",
                                    "Create user documentation",
                                    "Establish support procedures"
                                ],
                                integrations: [
                                    {
                                        platform: "Microsoft 365",
                                        method: "Entra ID Conditional Access",
                                        config: "Require MFA for all users, Block legacy auth",
                                        docs: "https://learn.microsoft.com/entra/identity/conditional-access/"
                                    },
                                    {
                                        platform: "VPN",
                                        method: "RADIUS/NPS with MFA extension",
                                        config: "Point NPS to MFA provider",
                                        docs: "Provider-specific documentation"
                                    },
                                    {
                                        platform: "Remote Desktop",
                                        method: "RD Gateway with MFA",
                                        config: "Configure RD Gateway to use MFA",
                                        docs: "Windows Server documentation"
                                    },
                                    {
                                        platform: "SaaS Applications",
                                        method: "SAML/OIDC with MFA",
                                        config: "Configure federation with IdP",
                                        docs: "Application-specific guides"
                                    }
                                ],
                                templates: [
                                    "MFA Integration Checklist.xlsx",
                                    "MFA Configuration Guide.docx",
                                    "User MFA Setup Guide.docx"
                                ],
                                storage: "SharePoint > Operations > MFA",
                                approval: "IT Director + Security Manager"
                            }
                        },
                        {
                            id: "t2-1b-3",
                            name: "Create MFA Policies & Procedures",
                            description: "Document MFA policies and exception handling",
                            controls: ["3.5.3"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Create MFA policy document",
                                    "Define MFA enforcement rules",
                                    "Document exception process",
                                    "Create backup authentication procedures",
                                    "Establish lost device procedures",
                                    "Create MFA training materials",
                                    "Define compliance monitoring",
                                    "Create incident response for MFA failures"
                                ],
                                templates: [
                                    "MFA Policy.docx",
                                    "MFA Exception Request Form.docx",
                                    "MFA Troubleshooting Guide.docx",
                                    "MFA Training Materials.pptx"
                                ],
                                storage: "SharePoint > Policies > Authentication",
                                approval: "CISO + Legal + HR"
                            }
                        }
                    ]
                },
                {
                    id: "m2-2",
                    name: "Privileged Access Management",
                    description: "Secure administrative access with PAM controls",
                    tasks: [
                        {
                            id: "t2-2-1",
                            name: "Implement least privilege",
                            description: "Role-based access with minimum necessary permissions",
                            controls: ["3.1.5", "3.1.6", "3.1.7"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Inventory current admin accounts and permissions",
                                    "Define role-based access model",
                                    "Remove standing admin rights",
                                    "Implement just-in-time access where possible",
                                    "Separate admin accounts from daily-use accounts"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Entra PIM",
                                        config: [
                                            { setting: "Eligible Assignments", value: "Convert permanent to eligible", location: "Entra ID > Identity Governance > PIM" },
                                            { setting: "Activation Requirements", value: "Require justification + MFA", location: "PIM > Role Settings" },
                                            { setting: "Access Reviews", value: "Quarterly for privileged roles", location: "Entra ID > Identity Governance > Access Reviews" }
                                        ]
                                    },
                                    onprem: {
                                        name: "Tiered Administration",
                                        config: [
                                            { setting: "Tier 0", value: "Domain Controllers, PKI, Entra Connect", location: "Dedicated admin workstations only" },
                                            { setting: "Tier 1", value: "Member servers", location: "Separate admin accounts" },
                                            { setting: "Tier 2", value: "Workstations", location: "Helpdesk accounts" }
                                        ]
                                    }
                                },
                                artifacts: ["RBAC Matrix", "Admin Account Inventory", "PIM Configuration"]
                            }
                        },
                        {
                            id: "t2-2-2",
                            name: "Deploy privileged access workstations",
                            description: "Secured workstations for administrative tasks",
                            controls: ["3.1.5", "3.1.12", "3.4.6"],
                            priority: "high",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Define PAW hardware requirements",
                                    "Create hardened Windows image (STIG baseline)",
                                    "Restrict network access to admin ports only",
                                    "Implement application allowlisting",
                                    "Deploy to Tier 0/1 admins"
                                ],
                                artifacts: ["PAW Build Documentation", "Hardening Checklist", "Network ACLs"]
                            }
                        },
                        {
                            id: "t2-2-3",
                            name: "Implement service account management",
                            description: "Secure and manage all service accounts and non-human identities",
                            controls: ["3.5.1[a-c]", "3.5.2[a-c]", "3.1.5"],
                            priority: "critical",
                            effort: "high",
                            projectPlan: {
                                category: "Foundation",
                                subcategory: "Identity & Access Management",
                                week: 8,
                                taskId: "T-IAM.5",
                                owner: "IT Admin",
                                accountable: "CMMC Lead",
                                deliverable: "Service Account Inventory"
                            },
                            guidance: {
                                steps: [
                                    "Inventory all service accounts across systems",
                                    "Document purpose and owner for each service account",
                                    "Implement strong passwords (25+ characters) for service accounts",
                                    "Enable managed service accounts (gMSA) where possible",
                                    "Disable interactive logon for service accounts",
                                    "Implement credential rotation schedule (90 days or less)",
                                    "Create service account naming convention",
                                    "Document dependencies for each service account"
                                ],
                                templates: [
                                    "Service Account Inventory.xlsx",
                                    "Service Account Request Form.docx",
                                    "Service Account Policy.docx"
                                ],
                                storage: "SharePoint > Operations > Identity Management",
                                approval: "IT Director + CISO"
                            }
                        },
                        {
                            id: "t2-2-4",
                            name: "Create break-glass emergency access procedures",
                            description: "Establish emergency access procedures for system recovery",
                            controls: ["3.1.1[a-f]", "3.1.5", "3.5.1[a-c]"],
                            priority: "critical",
                            effort: "medium",
                            projectPlan: {
                                category: "Foundation",
                                subcategory: "Identity & Access Management",
                                week: 8,
                                taskId: "T-IAM.6",
                                owner: "IT Admin",
                                accountable: "CMMC Lead",
                                deliverable: "Break-Glass Procedures"
                            },
                            guidance: {
                                steps: [
                                    "Create break-glass accounts (minimum 2) with global admin rights",
                                    "Generate strong, unique passwords (25+ characters)",
                                    "Store credentials in secure location (safe, HSM, or sealed envelopes)",
                                    "Document break-glass usage procedures",
                                    "Define scenarios requiring break-glass access",
                                    "Establish break-glass account monitoring and alerting",
                                    "Create post-use review and password rotation process",
                                    "Test break-glass procedures quarterly"
                                ],
                                templates: [
                                    "Break-Glass Procedure.docx",
                                    "Break-Glass Account Log.xlsx",
                                    "Emergency Access Request Form.docx"
                                ],
                                storage: "SharePoint > Operations > Emergency Access (Restricted)",
                                approval: "CISO + Exec Sponsor",
                                notes: "Break-glass accounts should be excluded from MFA but heavily monitored"
                            }
                        },
                        {
                            id: "t2-2-5",
                            name: "Implement access reviews and recertification",
                            description: "Establish periodic access reviews for all privileged access",
                            controls: ["3.1.1[a-f]", "3.1.7[a-c]"],
                            priority: "critical",
                            effort: "medium",
                            projectPlan: {
                                category: "Foundation",
                                subcategory: "Identity & Access Management",
                                week: 9,
                                taskId: "T-IAM.7",
                                owner: "IT Admin",
                                accountable: "CMMC Lead",
                                deliverable: "Access Review Schedule"
                            },
                            guidance: {
                                steps: [
                                    "Define access review schedule (quarterly for privileged, annual for standard)",
                                    "Identify access reviewers (managers, system owners)",
                                    "Configure automated access reviews in IdP (Entra ID Access Reviews)",
                                    "Create review notification and reminder process",
                                    "Establish remediation workflow for expired/revoked access",
                                    "Document access review decisions and approvals",
                                    "Create access review reports for compliance",
                                    "Establish escalation for overdue reviews"
                                ],
                                templates: [
                                    "Access Review Policy.docx",
                                    "Access Review Schedule.xlsx",
                                    "Access Review Report Template.xlsx"
                                ],
                                storage: "SharePoint > Governance > Access Reviews",
                                approval: "CISO + HR Director"
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-3",
            name: "Endpoint Security & Asset Management",
            description: "Secure endpoints with hardening, EDR, and management",
            duration: "3-4 weeks",
            icon: "endpoint",
            color: "#98c379",
            milestones: [
                {
                    id: "m3-1",
                    name: "Endpoint Hardening Complete",
                    description: "Apply security baselines to all endpoints",
                    tasks: [
                        {
                            id: "t3-1-1",
                            name: "Deploy security baselines",
                            description: "Apply STIG or CIS benchmarks to all systems",
                            controls: ["3.4.1[a-f]", "3.4.2[a-b]"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Download applicable STIG or CIS benchmark",
                                    "Create GPO or Intune profile from benchmark",
                                    "Test on pilot group",
                                    "Deploy to production with monitoring",
                                    "Document deviations with justification"
                                ],
                                platforms: {
                                    windows: {
                                        name: "Windows 11 Hardening",
                                        config: [
                                            { setting: "STIG Baseline", gpo: "Import DISA STIG GPO", registry: "Multiple settings" },
                                            { setting: "BitLocker", gpo: "Computer Config > Admin Templates > Windows Components > BitLocker", registry: "HKLM\\SOFTWARE\\Policies\\Microsoft\\FVE" },
                                            { setting: "Windows Firewall", gpo: "Computer Config > Windows Settings > Security Settings > Windows Firewall", registry: "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsFirewall" },
                                            { setting: "Credential Guard", gpo: "Computer Config > Admin Templates > System > Device Guard", registry: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard" }
                                        ]
                                    },
                                    intune: {
                                        name: "Intune Security Baselines",
                                        config: [
                                            { setting: "Windows Security Baseline", location: "Intune > Endpoint Security > Security Baselines" },
                                            { setting: "Microsoft Defender Baseline", location: "Intune > Endpoint Security > Security Baselines" },
                                            { setting: "Attack Surface Reduction", location: "Intune > Endpoint Security > Attack Surface Reduction" }
                                        ]
                                    }
                                },
                                artifacts: ["Baseline Configuration Report", "STIG Checklist", "Deviation Documentation"]
                            }
                        },
                        {
                            id: "t3-1-2",
                            name: "Enable full disk encryption",
                            description: "Encrypt all endpoint storage with BitLocker or equivalent",
                            controls: ["3.13.16"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Verify TPM availability on all devices",
                                    "Configure BitLocker policy via GPO or Intune",
                                    "Enable recovery key escrow to AD or Entra ID",
                                    "Deploy to pilot, then production",
                                    "Verify encryption status reporting"
                                ],
                                platforms: {
                                    windows: {
                                        name: "BitLocker",
                                        config: [
                                            { setting: "Require BitLocker", gpo: "Computer Config > Admin Templates > Windows Components > BitLocker > Operating System Drives > Require additional authentication at startup", value: "Enabled with TPM" },
                                            { setting: "Recovery Key Backup", gpo: "Computer Config > Admin Templates > Windows Components > BitLocker > Operating System Drives > Choose how BitLocker-protected drives can be recovered", value: "Save to AD DS" },
                                            { setting: "Encryption Method", gpo: "Computer Config > Admin Templates > Windows Components > BitLocker > Choose drive encryption method", value: "XTS-AES 256-bit" }
                                        ]
                                    }
                                },
                                artifacts: ["Encryption Status Report", "Recovery Key Escrow Verification"]
                            }
                        },
                        {
                            id: "t3-1-3",
                            name: "Implement application control",
                            description: "Restrict execution to approved applications",
                            controls: ["3.4.8[a-c]", "3.14.2[a-b]"],
                            priority: "high",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Inventory approved applications",
                                    "Choose AppLocker or WDAC",
                                    "Create initial allow policy",
                                    "Deploy in audit mode first",
                                    "Review blocked applications",
                                    "Switch to enforce mode"
                                ],
                                platforms: {
                                    windows: {
                                        name: "Windows Defender Application Control",
                                        config: [
                                            { setting: "Base Policy", value: "Microsoft recommended block rules", location: "Group Policy or Intune" },
                                            { setting: "Supplemental Policies", value: "Organization-specific allows", location: "WDAC Wizard" },
                                            { setting: "Audit Mode", value: "Start in audit, then enforce", location: "Policy Enforcement Mode" }
                                        ]
                                    }
                                },
                                artifacts: ["Application Inventory", "WDAC Policy Files", "Audit Logs"]
                            }
                        }
                    ]
                },
                {
                    id: "m3-2",
                    name: "EDR Deployed",
                    description: "Endpoint detection and response on all systems",
                    tasks: [
                        {
                            id: "t3-2-1",
                            name: "Deploy EDR solution",
                            description: "Install and configure endpoint detection and response",
                            controls: ["3.14.2[a-b]", "3.14.6[a-c]", "3.14.7[a-b]"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Select EDR solution (Defender for Endpoint, CrowdStrike, SentinelOne)",
                                    "Configure tenant and policies",
                                    "Deploy agent to all endpoints",
                                    "Configure alert thresholds",
                                    "Integrate with SIEM"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Microsoft Defender for Endpoint",
                                        config: [
                                            { setting: "Onboarding", value: "Via Intune, GPO, or script", location: "Security.microsoft.com > Settings > Endpoints > Onboarding" },
                                            { setting: "ASR Rules", value: "Enable all in block mode", location: "Intune > Endpoint Security > ASR" },
                                            { setting: "Automated Investigation", value: "Full remediation", location: "Security.microsoft.com > Settings > Endpoints > Advanced Features" }
                                        ]
                                    }
                                },
                                artifacts: ["EDR Deployment Status", "Detection Policy Configuration", "SIEM Integration"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-4",
            name: "Network, Infrastructure & Remote Access",
            description: "Segment networks, secure communications, harden infrastructure, and implement secure remote access",
            duration: "4-5 weeks",
            icon: "network",
            color: "#e5c07b",
            milestones: [
                {
                    id: "m4-1",
                    name: "Network Segmentation Complete",
                    description: "Isolate CUI systems from general network",
                    tasks: [
                        {
                            id: "t4-1-1",
                            name: "Implement CUI network segment",
                            description: "Create dedicated VLAN or subnet for CUI processing",
                            controls: ["3.13.1[a-h]", "3.13.5[a-b]", "3.13.6[a-b]"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Design network segmentation architecture",
                                    "Create CUI VLAN/subnet",
                                    "Configure firewall rules (deny by default)",
                                    "Implement micro-segmentation if using SDN",
                                    "Document allowed traffic flows"
                                ],
                                platforms: {
                                    onprem: {
                                        name: "Traditional Network",
                                        config: [
                                            { setting: "CUI VLAN", value: "Dedicated VLAN (e.g., VLAN 100)", location: "Switch configuration" },
                                            { setting: "Firewall Rules", value: "Deny all, allow specific", location: "Perimeter and internal firewalls" },
                                            { setting: "ACLs", value: "Restrict inter-VLAN routing", location: "Layer 3 switch or router" }
                                        ]
                                    },
                                    azure: {
                                        name: "Azure Virtual Network",
                                        config: [
                                            { setting: "CUI Subnet", value: "Dedicated subnet with NSG", location: "Virtual Network > Subnets" },
                                            { setting: "NSG Rules", value: "Deny all inbound, allow specific", location: "Network Security Groups" },
                                            { setting: "Azure Firewall", value: "Central egress filtering", location: "Azure Firewall or NVA" }
                                        ]
                                    }
                                },
                                artifacts: ["Network Diagram", "Firewall Rule Matrix", "NSG/ACL Documentation"]
                            }
                        },
                        {
                            id: "t4-1-2",
                            name: "Implement boundary protection",
                            description: "Secure network perimeter with managed access points",
                            controls: ["3.13.1", "3.1.14"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Deploy next-gen firewall at perimeter",
                                    "Enable IDS/IPS functionality",
                                    "Configure web filtering",
                                    "Implement DNS security",
                                    "Route all remote access through managed points"
                                ],
                                artifacts: ["Firewall Configuration", "IDS/IPS Rules", "Web Filter Policy"]
                            }
                        }
                    ]
                },
                {
                    id: "m4-2",
                    name: "Encryption in Transit",
                    description: "Encrypt all CUI data in transit",
                    tasks: [
                        {
                            id: "t4-2-1",
                            name: "Enforce TLS 1.2+ everywhere",
                            description: "Disable legacy protocols and require strong encryption",
                            controls: ["3.13.8[a-c]", "3.13.11[a]"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Audit current TLS usage",
                                    "Disable TLS 1.0/1.1 and SSL",
                                    "Configure strong cipher suites",
                                    "Update certificates to use strong algorithms",
                                    "Test application compatibility"
                                ],
                                platforms: {
                                    windows: {
                                        name: "Windows TLS Hardening",
                                        registry: [
                                            { key: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.0\\Server", value: "Enabled", data: "0 (DWORD)" },
                                            { key: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.1\\Server", value: "Enabled", data: "0 (DWORD)" },
                                            { key: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.2\\Server", value: "Enabled", data: "1 (DWORD)" },
                                            { key: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.2\\Server", value: "DisabledByDefault", data: "0 (DWORD)" }
                                        ]
                                    }
                                },
                                artifacts: ["TLS Audit Report", "Protocol Configuration", "Certificate Inventory"]
                            }
                        }
                    ]
                },
                {
                    id: "m4-3",
                    name: "Secure Remote Access Implemented",
                    description: "Establish secure remote access foundation for CUI",
                    tasks: [
                        {
                            id: "t4-3-1",
                            name: "Configure VPN with MFA",
                            description: "Implement secure VPN with multi-factor authentication",
                            controls: ["3.1.12", "3.5.3", "3.13.1"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Select VPN solution (Azure VPN, Cisco AnyConnect, etc.)",
                                    "Configure MFA integration with IdP",
                                    "Implement split tunnel prevention",
                                    "Set up connection logging",
                                    "Test VPN security controls"
                                ],
                                artifacts: ["VPN Configuration Documentation", "MFA Integration Guide"]
                            }
                        },
                        {
                            id: "t4-3-2",
                            name: "Implement Remote Access Policies",
                            description: "Create and enforce remote access security policies",
                            controls: ["3.1.12[a-d]", "3.1.22[a-e]"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Create remote access policy",
                                    "Define approved remote access methods",
                                    "Establish session timeout requirements",
                                    "Create remote user training materials"
                                ],
                                templates: [
                                    "Remote Access Policy.docx",
                                    "VPN User Guide.docx"
                                ],
                                storage: "SharePoint > Policies > Remote Access",
                                approval: "CISO + IT Director"
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-5",
            name: "Data Protection",
            description: "Protect CUI at rest and in transit with encryption and DLP",
            duration: "2-3 weeks",
            icon: "data",
            color: "#e06c75",
            milestones: [
                {
                    id: "m5-1",
                    name: "Data Classification Implemented",
                    description: "Label and classify all CUI data",
                    tasks: [
                        {
                            id: "t5-1-1",
                            name: "Deploy sensitivity labels",
                            description: "Implement data classification with labels",
                            controls: ["3.1.3[c]", "3.8.4[a-b]"],
                            priority: "high",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Define label taxonomy (Public, Internal, CUI, etc.)",
                                    "Create sensitivity labels in Purview or equivalent",
                                    "Configure label policies",
                                    "Deploy labeling client to endpoints",
                                    "Train users on labeling requirements"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Microsoft Purview Information Protection",
                                        config: [
                                            { setting: "Sensitivity Labels", value: "Public, Internal, Confidential, CUI", location: "Purview > Information Protection > Labels" },
                                            { setting: "Auto-labeling", value: "Detect CUI patterns", location: "Purview > Information Protection > Auto-labeling" },
                                            { setting: "Label Policies", value: "Require label for all documents", location: "Purview > Information Protection > Label Policies" }
                                        ]
                                    }
                                },
                                artifacts: ["Label Taxonomy", "Label Policy Configuration", "Training Materials"]
                            }
                        },
                        {
                            id: "t5-1-2",
                            name: "Implement DLP policies",
                            description: "Prevent unauthorized disclosure of CUI",
                            controls: ["3.1.3[c]", "3.13.4[a]"],
                            priority: "high",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Define sensitive information types (CUI patterns)",
                                    "Create DLP policies for email, SharePoint, endpoints",
                                    "Configure block/warn/audit actions",
                                    "Test with pilot group",
                                    "Deploy and monitor"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Microsoft Purview DLP",
                                        config: [
                                            { setting: "CUI Detection Rule", value: "Custom SIT for CUI markings", location: "Purview > DLP > Sensitive Info Types" },
                                            { setting: "Email DLP", value: "Block external sharing of CUI", location: "Purview > DLP > Policies" },
                                            { setting: "Endpoint DLP", value: "Block copy to USB, cloud storage", location: "Purview > DLP > Endpoint DLP Settings" }
                                        ]
                                    }
                                },
                                artifacts: ["DLP Policy Documentation", "SIT Definitions", "Incident Reports"]
                            }
                        }
                    ]
                },
                {
                    id: "m5-2",
                    name: "Backup and Recovery",
                    description: "Protect CUI with encrypted backups",
                    tasks: [
                        {
                            id: "t5-2-1",
                            name: "Implement encrypted backups",
                            description: "Backup all CUI systems with encryption",
                            controls: ["3.8.9[a]"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Inventory systems requiring backup",
                                    "Select backup solution with encryption",
                                    "Configure backup schedules (daily, weekly)",
                                    "Test restore procedures",
                                    "Store backups in secure, separate location"
                                ],
                                artifacts: ["Backup Configuration", "Restore Test Results", "Backup Inventory"]
                            }
                        }
                    ]
                },
                {
                    id: "m5-3",
                    name: "Secure Software Development (SSDF)",
                    description: "Implement NIST SP 800-218 SSDF for organizations developing software",
                    tasks: [
                        {
                            id: "t5-3-1",
                            name: "Establish Secure SDLC Policy",
                            description: "Create policy aligned with NIST SP 800-218 SSDF practices",
                            controls: ["3.13.2[a-f]"],
                            priority: "critical",
                            effort: "high",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Secure Development",
                                week: 6,
                                taskId: "T-SSDF.1",
                                owner: "Dev Lead",
                                accountable: "CMMC Lead",
                                deliverable: "Secure SDLC Policy"
                            },
                            guidance: {
                                steps: [
                                    "Create Secure Software Development Policy aligned with NIST SP 800-218",
                                    "Define SSDF Practice PO: Prepare Organization (roles, toolchains, standards)",
                                    "Define SSDF Practice PS: Protect Software (source control, dependencies)",
                                    "Define SSDF Practice PW: Produce Well-Secured Software (design, code, test)",
                                    "Define SSDF Practice RV: Respond to Vulnerabilities",
                                    "Establish Security Champion role for each team",
                                    "Create secure coding standards (OWASP, CERT)"
                                ],
                                templates: ["Secure SDLC Policy.docx", "Secure Coding Standards.docx", "Code Review Security Checklist.xlsx"],
                                storage: "SharePoint > Development > Security",
                                approval: "CISO + Dev Director"
                            }
                        },
                        {
                            id: "t5-3-2",
                            name: "Implement CI/CD Security Gates",
                            description: "Integrate SAST, SCA, and secrets scanning into pipelines",
                            controls: ["3.13.2[b]", "3.13.2[e]"],
                            priority: "critical",
                            effort: "high",
                            projectPlan: {
                                category: "Foundation",
                                subcategory: "Secure Development",
                                week: 7,
                                taskId: "T-SSDF.2",
                                owner: "DevOps",
                                accountable: "Dev Lead",
                                deliverable: "Secured CI/CD Pipeline"
                            },
                            guidance: {
                                steps: [
                                    "Implement pre-commit hooks for secrets scanning (gitleaks)",
                                    "Configure SAST in pipeline (SonarQube, CodeQL, Semgrep)",
                                    "Enable SCA scanning (Snyk, OWASP Dependency-Check)",
                                    "Add container scanning if applicable (Trivy)",
                                    "Configure pipeline to fail on high/critical findings",
                                    "Implement branch protection (required reviews, signed commits)"
                                ],
                                toolchain: {
                                    sast: ["SonarQube", "Semgrep", "CodeQL"],
                                    sca: ["Snyk", "OWASP Dependency-Check", "Dependabot"],
                                    secrets: ["gitleaks", "git-secrets"],
                                    container: ["Trivy", "Grype"]
                                },
                                artifacts: ["Pipeline Config", "Security Gate Documentation"]
                            }
                        },
                        {
                            id: "t5-3-3",
                            name: "Implement SBOM Generation",
                            description: "Generate Software Bill of Materials for releases",
                            controls: ["3.13.2[b]", "3.4.1[a-f]"],
                            priority: "high",
                            effort: "medium",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Secure Development",
                                week: 8,
                                taskId: "T-SSDF.3",
                                owner: "DevOps",
                                accountable: "Dev Lead",
                                deliverable: "SBOM Generation Process"
                            },
                            guidance: {
                                steps: [
                                    "Select SBOM format (CycloneDX or SPDX)",
                                    "Integrate SBOM generation into build (Syft)",
                                    "Include all dependencies (direct and transitive)",
                                    "Store SBOMs with release artifacts",
                                    "Establish SBOM review for vulnerability monitoring"
                                ],
                                tools: ["Syft", "CycloneDX CLI", "SPDX Tools"],
                                artifacts: ["SBOM Policy", "Sample SBOM"]
                            }
                        },
                        {
                            id: "t5-3-4",
                            name: "Establish Threat Modeling Process",
                            description: "Implement STRIDE threat modeling for features",
                            controls: ["3.13.2[a]", "3.13.2[d]"],
                            priority: "high",
                            effort: "medium",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Secure Development",
                                week: 7,
                                taskId: "T-SSDF.4",
                                owner: "Security",
                                accountable: "Dev Lead",
                                deliverable: "Threat Modeling Process"
                            },
                            guidance: {
                                steps: [
                                    "Adopt STRIDE methodology for threat modeling",
                                    "Create threat model template",
                                    "Define when threat modeling required",
                                    "Train Security Champions",
                                    "Track threats through remediation"
                                ],
                                templates: ["Threat Model Template.docx"],
                                artifacts: ["Threat Model Examples", "Training Records"]
                            }
                        },
                        {
                            id: "t5-3-5",
                            name: "Configure Artifact Signing",
                            description: "Sign releases and container images",
                            controls: ["3.13.2[b]", "3.4.1[a-f]"],
                            priority: "high",
                            effort: "medium",
                            projectPlan: {
                                category: "Foundation",
                                subcategory: "Secure Development",
                                week: 9,
                                taskId: "T-SSDF.5",
                                owner: "DevOps",
                                accountable: "Dev Lead",
                                deliverable: "Artifact Signing Process"
                            },
                            guidance: {
                                steps: [
                                    "Select signing tool (cosign, GPG, Sigstore)",
                                    "Generate and secure signing keys",
                                    "Integrate signing into release pipeline",
                                    "Verify signatures before deployment",
                                    "Document key management procedures"
                                ],
                                tools: ["cosign", "Sigstore", "GPG", "Notary"],
                                artifacts: ["Signing Policy", "Key Management Procedure"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-6",
            name: "Monitoring & Logging",
            description: "Implement comprehensive audit logging and monitoring",
            duration: "2-3 weeks",
            icon: "monitor",
            color: "#56b6c2",
            milestones: [
                {
                    id: "m6-1",
                    name: "Centralized Logging Deployed",
                    description: "Aggregate logs from all CUI systems",
                    tasks: [
                        {
                            id: "t6-1-1",
                            name: "Deploy SIEM/log aggregation",
                            description: "Centralize logs for analysis and retention",
                            controls: ["3.3.1[a-f]", "3.3.2[a-b]", "3.3.8[a-f]"],
                            priority: "critical",
                            effort: "high",
                            projectPlan: {
                                category: "Governance",
                                subcategory: "Program Management",
                                week: 8,
                                taskId: "T-6.1",
                                owner: "SecOps",
                                accountable: "CMMC Lead",
                                raciCategory: "Governance",
                                deliverable: "SIEM Deployment Report"
                            },
                            guidance: {
                                steps: [
                                    "Select SIEM solution (Sentinel, Splunk, etc.)",
                                    "Configure log sources (Windows, Linux, network, cloud)",
                                    "Define retention policy (minimum 1 year recommended)",
                                    "Create detection rules and alerts",
                                    "Integrate with ticketing for incident response"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Microsoft Sentinel",
                                        config: [
                                            { setting: "Log Analytics Workspace", value: "Create in CUI subscription", location: "Azure Portal > Log Analytics" },
                                            { setting: "Data Connectors", value: "Entra ID, M365, Defender, Azure Activity", location: "Sentinel > Data Connectors" },
                                            { setting: "Analytics Rules", value: "Enable CMMC-relevant detections", location: "Sentinel > Analytics" },
                                            { setting: "Retention", value: "365+ days", location: "Log Analytics > Usage and Estimated Costs > Data Retention" }
                                        ]
                                    }
                                },
                                artifacts: ["SIEM Architecture", "Log Source Inventory", "Retention Policy", "Detection Rules"]
                            }
                        },
                        {
                            id: "t6-1-2",
                            name: "Configure audit policies",
                            description: "Enable comprehensive Windows audit logging",
                            controls: ["3.3.1[a-f]", "3.3.2[a-b]"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Enable advanced audit policies via GPO",
                                    "Configure Security log size and retention",
                                    "Enable command-line auditing",
                                    "Configure PowerShell logging",
                                    "Forward events to SIEM"
                                ],
                                platforms: {
                                    windows: {
                                        name: "Windows Audit Policy",
                                        gpo: [
                                            { setting: "Audit Logon", path: "Computer Config > Windows Settings > Security > Advanced Audit > Logon/Logoff > Audit Logon", value: "Success, Failure" },
                                            { setting: "Audit Process Creation", path: "Computer Config > Windows Settings > Security > Advanced Audit > Detailed Tracking > Audit Process Creation", value: "Success" },
                                            { setting: "Command Line Logging", path: "Computer Config > Admin Templates > System > Audit Process Creation > Include command line", value: "Enabled" },
                                            { setting: "PowerShell Logging", path: "Computer Config > Admin Templates > Windows Components > Windows PowerShell > Turn on Module Logging", value: "Enabled - *" }
                                        ]
                                    }
                                },
                                artifacts: ["Audit Policy GPO", "Event Forwarding Configuration"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-7",
            name: "VDI Implementation (Optional)",
            description: "Deploy VDI for enhanced CUI protection (optional but recommended for high CUI volume)",
            duration: "2-4 weeks",
            icon: "vdi",
            color: "#d19a66",
            optional: true,
            milestones: [
                {
                    id: "m7-1",
                    name: "VDI Infrastructure Deployed",
                    description: "Deploy virtual desktop infrastructure for enhanced CUI protection",
                    tasks: [
                        {
                            id: "t7-1-1",
                            name: "Select remote access deployment model",
                            description: "Choose deployment approach based on security requirements and resources",
                            controls: ["3.1.12[a-d]", "3.13.1[a-h]"],
                            priority: "critical",
                            effort: "low",
                            guidance: {
                                steps: [
                                    "Assess remote workforce size and CUI access needs",
                                    "Evaluate existing infrastructure and budget",
                                    "Choose deployment model: VPN-Only, VDI, or Hybrid",
                                    "Document decision rationale in SSP"
                                ],
                                artifacts: ["Remote Access Strategy Document", "Deployment Decision Matrix"],
                                deploymentOptions: [
                                    {
                                        name: "Option A: VPN + Managed Endpoints (Minimum)",
                                        description: "Traditional VPN with hardened managed devices",
                                        pros: ["Lower cost", "Simpler deployment", "Familiar to users"],
                                        cons: ["CUI on endpoints", "Requires device management", "Higher endpoint risk"],
                                        bestFor: "Small teams, limited budget, low CUI volume"
                                    },
                                    {
                                        name: "Option B: VDI-Only (Maximum Security)",
                                        description: "All CUI access via virtual desktops",
                                        pros: ["CUI never leaves datacenter", "Thin client support", "Centralized control"],
                                        cons: ["Higher cost", "Complex deployment", "Latency sensitive"],
                                        bestFor: "High CUI volume, strict data control requirements"
                                    },
                                    {
                                        name: "Option C: Hybrid (VPN + VDI)",
                                        description: "VPN for general access, VDI for CUI workloads",
                                        pros: ["Flexible", "CUI isolated", "Phased deployment"],
                                        cons: ["Two systems to manage", "User training needed"],
                                        bestFor: "Mixed workloads, phased migration, budget flexibility"
                                    }
                                ]
                            }
                        },
                        {
                            id: "t7-1-2",
                            name: "Deploy secure VPN solution",
                            description: "Implement FIPS-validated VPN with MFA integration",
                            controls: ["3.1.12", "3.13.8", "3.13.11"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Select FIPS 140-2/3 validated VPN solution",
                                    "Configure TLS 1.2+ with approved cipher suites",
                                    "Integrate with identity provider for MFA",
                                    "Implement split tunneling restrictions for CUI",
                                    "Configure device compliance checks"
                                ],
                                platforms: {
                                    azure: {
                                        name: "Azure VPN / Global Secure Access",
                                        config: [
                                            { setting: "VPN Gateway", value: "VpnGw2AZ or higher (FIPS mode)", location: "Azure Portal > VPN Gateway" },
                                            { setting: "P2S Authentication", value: "Entra ID + Certificate", location: "VPN Gateway > Point-to-site" },
                                            { setting: "Global Secure Access", value: "Private Access app for CUI resources", location: "Entra Admin > Global Secure Access" }
                                        ]
                                    },
                                    onprem: {
                                        name: "On-Premises VPN (Cisco, Palo Alto, etc.)",
                                        config: [
                                            { setting: "IKEv2 + IPsec", value: "AES-256-GCM, SHA-384", location: "VPN Concentrator" },
                                            { setting: "RADIUS/SAML", value: "Integrate with IdP for MFA", location: "AAA Configuration" },
                                            { setting: "Tunnel Mode", value: "Full tunnel for CUI destinations", location: "Split Tunnel Policy" }
                                        ]
                                    }
                                },
                                artifacts: ["VPN Configuration Documentation", "Network Diagram", "FIPS Validation Certificate"]
                            }
                        },
                        {
                            id: "t7-1-3",
                            name: "Configure remote session controls",
                            description: "Implement session timeout, idle disconnect, and monitoring",
                            controls: ["3.1.10[a-c]", "3.1.11[a-b]", "3.1.21[a-c]"],
                            priority: "high",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Configure 15-minute idle timeout (CMMC requirement)",
                                    "Implement session locking after inactivity",
                                    "Enable session recording for privileged access",
                                    "Configure concurrent session limits",
                                    "Implement remote session termination capability"
                                ],
                                platforms: {
                                    windows: {
                                        name: "Windows GPO",
                                        gpo: [
                                            { setting: "Interactive logon: Machine inactivity limit", value: "900 seconds", path: "Computer > Windows Settings > Security Settings > Local Policies > Security Options" },
                                            { setting: "Screen saver timeout", value: "900 seconds", path: "User > Administrative Templates > Control Panel > Personalization" }
                                        ]
                                    },
                                    intune: {
                                        name: "Intune / Endpoint Manager",
                                        config: [
                                            { setting: "Device Lock", value: "Require after 15 min inactivity", location: "Endpoint Security > Account Protection" },
                                            { setting: "Session Limit", value: "1 concurrent session", location: "Configuration Profile > Device Restrictions" }
                                        ]
                                    }
                                },
                                artifacts: ["Session Policy Configuration", "GPO Documentation"]
                            }
                        },
                        {
                            id: "t7-1-4",
                            name: "Implement remote access monitoring",
                            description: "Deploy logging and alerting for remote connections",
                            controls: ["3.3.1", "3.3.2", "3.14.6"],
                            priority: "high",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Enable VPN connection logging",
                                    "Forward logs to SIEM",
                                    "Create alerts for anomalous connections",
                                    "Monitor for impossible travel scenarios",
                                    "Track failed authentication attempts"
                                ],
                                artifacts: ["SIEM Alert Rules", "Remote Access Monitoring Runbook"]
                            }
                        }
                    ]
                },
                {
                    id: "m7-2",
                    name: "VDI Platform (Optional - Enhanced Security)",
                    description: "Deploy virtual desktop infrastructure for centralized CUI access - recommended for high-security environments",
                    optional: true,
                    tasks: [
                        {
                            id: "t7-2-1",
                            name: "Deploy VDI platform",
                            description: "Implement AVD, Citrix, or VMware Horizon for CUI workloads",
                            controls: ["3.1.12", "3.1.13", "3.13.1"],
                            priority: "medium",
                            effort: "high",
                            optional: true,
                            guidance: {
                                steps: [
                                    "Select VDI platform based on requirements",
                                    "Design host pool architecture",
                                    "Create STIG-hardened golden image",
                                    "Configure FSLogix for profile management",
                                    "Implement restrictive security policies"
                                ],
                                platforms: {
                                    avd: {
                                        name: "Azure Virtual Desktop",
                                        config: [
                                            { setting: "Host Pool", value: "Pooled, depth-first load balancing", location: "AVD > Host Pools" },
                                            { setting: "RDP Properties", value: "redirectclipboard:i:0;drivestoredirect:s:", location: "Host Pool > RDP Properties" },
                                            { setting: "FSLogix", value: "Profile containers on Azure Files", location: "Session Host GPO" },
                                            { setting: "Conditional Access", value: "Require MFA + compliant device", location: "Entra ID > Conditional Access" }
                                        ]
                                    },
                                    citrix: {
                                        name: "Citrix Virtual Apps and Desktops",
                                        config: [
                                            { setting: "Delivery Controller", value: "HA pair in CUI network", location: "Citrix Studio" },
                                            { setting: "VDA Image", value: "STIG-hardened Windows", location: "Machine Catalog" },
                                            { setting: "Policies", value: "Disable clipboard, drives, printing", location: "Citrix Policy" }
                                        ]
                                    },
                                    vmware: {
                                        name: "VMware Horizon",
                                        config: [
                                            { setting: "Connection Server", value: "HA pair with UAG", location: "Horizon Console" },
                                            { setting: "Desktop Pool", value: "Instant clones from golden image", location: "Horizon Console > Desktop Pools" },
                                            { setting: "UAG", value: "TLS 1.2, MFA integration", location: "UAG Admin Console" }
                                        ]
                                    }
                                },
                                artifacts: ["VDI Architecture Diagram", "Host Pool Configuration", "Security Policy Documentation"]
                            }
                        },
                        {
                            id: "t7-2-2",
                            name: "Deploy VDI endpoints",
                            description: "Provision thin clients or locked-down endpoints for VDI access",
                            controls: ["3.1.1", "3.1.21", "3.4.6"],
                            priority: "medium",
                            effort: "medium",
                            optional: true,
                            guidance: {
                                steps: [
                                    "Select endpoint strategy (thin client, repurpose, IGEL)",
                                    "Configure endpoint management platform",
                                    "Disable local storage and USB on endpoints",
                                    "Implement certificate-based authentication",
                                    "Deploy and inventory all endpoints"
                                ],
                                platforms: {
                                    igel: {
                                        name: "IGEL OS",
                                        config: [
                                            { setting: "USB Control", value: "Block storage class", location: "UMS > Profiles > Devices > USB" },
                                            { setting: "Local Storage", value: "Disabled", location: "UMS > Profiles > Sessions" },
                                            { setting: "Session Protocol", value: "AVD/Citrix/Horizon client only", location: "UMS > Profiles > Sessions" }
                                        ]
                                    },
                                    windows: {
                                        name: "Windows Thin Client / Locked Kiosk",
                                        config: [
                                            { setting: "Assigned Access", value: "Single-app kiosk (VDI client)", location: "Settings > Accounts > Access work or school > Kiosk" },
                                            { setting: "USB Block", value: "Block removable storage", location: "GPO > Administrative Templates > System > Removable Storage Access" }
                                        ]
                                    }
                                },
                                artifacts: ["Endpoint Inventory", "Endpoint Configuration Standards", "UMS/Intune Profiles"]
                            }
                        },
                        {
                            id: "t7-2-3",
                            name: "Configure VDI data protection",
                            description: "Ensure CUI cannot be extracted from VDI environment",
                            controls: ["3.1.3", "3.8.3", "3.13.1"],
                            priority: "medium",
                            effort: "medium",
                            optional: true,
                            guidance: {
                                steps: [
                                    "Disable clipboard redirection",
                                    "Block drive mapping to local devices",
                                    "Disable printing or route to secure printers only",
                                    "Block USB passthrough",
                                    "Implement watermarking for screenshots"
                                ],
                                artifacts: ["VDI Security Policy", "Data Loss Prevention Configuration"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-8",
            name: "Final Documentation & Review",
            description: "Complete remaining documentation and prepare for assessment",
            duration: "1-2 weeks",
            icon: "policies",
            color: "#abb2bf",
            milestones: [
                {
                    id: "m8-1",
                    name: "SSP Complete",
                    description: "System Security Plan documenting all controls",
                    tasks: [
                        {
                            id: "t8-1-1",
                            name: "Draft System Security Plan",
                            description: "Document control implementations in SSP format",
                            controls: ["3.12.4[a-h]"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Use NIST 800-171 SSP template",
                                    "Document each control implementation",
                                    "Include system boundary and diagrams",
                                    "Describe roles and responsibilities",
                                    "Review and obtain management approval"
                                ],
                                artifacts: ["System Security Plan", "Network Diagram", "Data Flow Diagram", "Roles Matrix"]
                            }
                        }
                    ]
                },
                {
                    id: "m8-2",
                    name: "Policies Documented",
                    description: "All required security policies in place",
                    tasks: [
                        {
                            id: "t8-2-1",
                            name: "Create security policies",
                            description: "Document organizational security policies",
                            controls: ["3.1.1[a-f]", "3.2.1[a-d]", "3.12.4[a-h]"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Access Control Policy",
                                    "Acceptable Use Policy",
                                    "Incident Response Policy",
                                    "Configuration Management Policy",
                                    "Audit and Accountability Policy",
                                    "Media Protection Policy",
                                    "Personnel Security Policy"
                                ],
                                artifacts: ["Policy Documents", "Management Approval Records"]
                            }
                        },
                        {
                            id: "t8-2-2",
                            name: "Conduct security training",
                            description: "Train all personnel on security awareness",
                            controls: ["3.2.1", "3.2.2", "3.2.3"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Select training platform (KnowBe4, Proofpoint, etc.)",
                                    "Assign baseline security awareness training",
                                    "Assign role-based training for privileged users",
                                    "Include insider threat awareness",
                                    "Track completion and document"
                                ],
                                artifacts: ["Training Completion Records", "Training Materials", "Insider Threat Program Documentation"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-9",
            name: "POA&M Remediation",
            description: "Address identified gaps and track remediation to closure",
            duration: "4-8 weeks",
            icon: "remediation",
            color: "#e06c75",
            milestones: [
                {
                    id: "m9-1",
                    name: "POA&M Created",
                    description: "Document all gaps with remediation plans",
                    tasks: [
                        {
                            id: "t9-1-1",
                            name: "Create POA&M from gap assessment",
                            description: "Document each NOT MET finding with remediation details",
                            controls: ["3.12.2[a-c]"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Export NOT MET objectives from self-assessment",
                                    "Assign each finding a unique POA&M ID",
                                    "Document current state and desired state",
                                    "Identify root cause for each gap",
                                    "Estimate resources and timeline for remediation"
                                ],
                                artifacts: ["POA&M Spreadsheet", "Gap Analysis Report", "Resource Estimate"]
                            }
                        },
                        {
                            id: "t9-1-2",
                            name: "Prioritize remediation items",
                            description: "Risk-rank POA&M items and establish remediation order",
                            controls: ["3.11.1[a-b]", "3.12.2[a-c]"],
                            priority: "high",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Score each gap by risk (likelihood x impact)",
                                    "Identify quick wins (low effort, high impact)",
                                    "Group related items for efficient remediation",
                                    "Consider dependencies between items",
                                    "Obtain management approval on prioritization"
                                ],
                                artifacts: ["Prioritized POA&M", "Risk Assessment Matrix", "Remediation Roadmap"]
                            }
                        },
                        {
                            id: "t9-1-3",
                            name: "Assign remediation owners",
                            description: "Designate responsible parties for each POA&M item",
                            controls: ["3.12.2"],
                            priority: "high",
                            effort: "low",
                            guidance: {
                                steps: [
                                    "Identify SMEs for each control family",
                                    "Assign primary and backup owners",
                                    "Establish expected completion dates",
                                    "Define escalation path for blockers",
                                    "Schedule regular POA&M review meetings"
                                ],
                                artifacts: ["POA&M with Owners", "RACI Matrix", "Meeting Schedule"]
                            }
                        }
                    ]
                },
                {
                    id: "m9-2",
                    name: "Remediation Complete",
                    description: "All POA&M items closed or accepted",
                    tasks: [
                        {
                            id: "t9-2-1",
                            name: "Execute remediation tasks",
                            description: "Implement fixes for each POA&M item",
                            controls: ["3.12.2", "3.12.3"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Work through POA&M items by priority",
                                    "Document implementation for each fix",
                                    "Collect evidence of remediation",
                                    "Update assessment status as items complete",
                                    "Track progress in weekly POA&M reviews"
                                ],
                                artifacts: ["Remediation Evidence", "Updated Assessment", "Progress Reports"]
                            }
                        },
                        {
                            id: "t9-2-2",
                            name: "Validate remediation effectiveness",
                            description: "Verify each fix addresses the gap",
                            controls: ["3.12.1", "3.12.3"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Re-assess each remediated objective",
                                    "Verify evidence supports MET status",
                                    "Test technical controls are functioning",
                                    "Confirm process controls are being followed",
                                    "Document validation results"
                                ],
                                artifacts: ["Validation Test Results", "Updated Evidence Package", "Re-Assessment Results"]
                            }
                        },
                        {
                            id: "t9-2-3",
                            name: "Close or accept remaining items",
                            description: "Obtain risk acceptance for any open items",
                            controls: ["3.12.2"],
                            priority: "high",
                            effort: "low",
                            guidance: {
                                steps: [
                                    "Review any items not fully remediated",
                                    "Document compensating controls if applicable",
                                    "Prepare risk acceptance package for leadership",
                                    "Obtain signed risk acceptance memos",
                                    "Note: CMMC does not allow POA&Ms at assessment time"
                                ],
                                artifacts: ["Risk Acceptance Memos", "Compensating Control Documentation", "Final POA&M Status"]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "phase-10",
            name: "Assessment Readiness",
            description: "Prepare for C3PAO assessment with mock assessments and evidence review",
            duration: "2-3 weeks",
            icon: "readiness",
            color: "#98c379",
            milestones: [
                {
                    id: "m10-1",
                    name: "Evidence Package Complete",
                    description: "All assessment evidence organized and validated",
                    tasks: [
                        {
                            id: "t10-1-1",
                            name: "Organize evidence repository",
                            description: "Structure evidence by control family and objective",
                            controls: ["3.12.1[a-b]", "3.12.4[a-h]"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Create folder structure by control family",
                                    "Name files with control IDs for easy reference",
                                    "Include evidence description/index document",
                                    "Ensure screenshots are dated and labeled",
                                    "Verify all 320 objectives have supporting evidence"
                                ],
                                artifacts: ["Evidence Repository", "Evidence Index", "Evidence Mapping Matrix"]
                            }
                        },
                        {
                            id: "t10-1-2",
                            name: "Validate evidence quality",
                            description: "Ensure evidence clearly demonstrates control implementation",
                            controls: ["3.12.1[a-b]"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Review each artifact for completeness",
                                    "Verify timestamps are within assessment period",
                                    "Confirm screenshots show relevant settings",
                                    "Check policy documents are signed and dated",
                                    "Ensure evidence matches SSP descriptions"
                                ],
                                artifacts: ["Evidence Review Checklist", "Quality Assurance Report"]
                            }
                        },
                        {
                            id: "t10-1-3",
                            name: "Prepare interview subjects",
                            description: "Brief personnel who may be interviewed during assessment",
                            controls: ["3.2.1", "3.12.1"],
                            priority: "high",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Identify key personnel by role (ISSM, IT Admin, etc.)",
                                    "Review likely questions for each role",
                                    "Conduct practice interviews",
                                    "Ensure personnel know where policies are located",
                                    "Brief on assessment process and expectations"
                                ],
                                artifacts: ["Interview Prep Guide", "Role-Based Q&A", "Key Personnel List"]
                            }
                        }
                    ]
                },
                {
                    id: "m10-2",
                    name: "Mock Assessment Complete",
                    description: "Conduct internal or third-party readiness assessment",
                    tasks: [
                        {
                            id: "t10-2-1",
                            name: "Conduct mock assessment",
                            description: "Simulate C3PAO assessment to identify gaps",
                            controls: ["3.12.1", "3.12.3"],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Engage internal team or consultant to act as assessor",
                                    "Walk through all 320 objectives with evidence",
                                    "Conduct sample interviews with key personnel",
                                    "Test technical controls with live demonstrations",
                                    "Document findings and observations"
                                ],
                                artifacts: ["Mock Assessment Report", "Finding List", "Recommendations"]
                            }
                        },
                        {
                            id: "t10-2-2",
                            name: "Address mock assessment findings",
                            description: "Remediate any issues identified in mock assessment",
                            controls: ["3.12.2", "3.12.3"],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Review all findings from mock assessment",
                                    "Prioritize by severity and ease of fix",
                                    "Implement fixes before formal assessment",
                                    "Update evidence as needed",
                                    "Re-verify fixed items"
                                ],
                                artifacts: ["Remediation Tracker", "Updated Evidence", "Verification Results"]
                            }
                        }
                    ]
                },
                {
                    id: "m10-3",
                    name: "C3PAO Engagement",
                    description: "Select and engage C3PAO for formal assessment",
                    tasks: [
                        {
                            id: "t10-3-1",
                            name: "Select C3PAO",
                            description: "Choose authorized C3PAO from CMMC-AB marketplace",
                            controls: [],
                            priority: "critical",
                            effort: "low",
                            guidance: {
                                steps: [
                                    "Review C3PAO marketplace at cyberab.org",
                                    "Request quotes from multiple C3PAOs",
                                    "Verify C3PAO authorization status",
                                    "Check references and experience",
                                    "Negotiate timeline and pricing"
                                ],
                                artifacts: ["C3PAO Proposals", "Contract", "Assessment Schedule"]
                            }
                        },
                        {
                            id: "t10-3-2",
                            name: "Schedule and prepare for assessment",
                            description: "Coordinate logistics for formal CMMC assessment",
                            controls: [],
                            priority: "critical",
                            effort: "medium",
                            guidance: {
                                steps: [
                                    "Confirm assessment dates with C3PAO",
                                    "Reserve conference rooms for interviews",
                                    "Ensure key personnel availability",
                                    "Provide C3PAO with pre-assessment package (SSP, boundary diagram)",
                                    "Set up secure file sharing for evidence",
                                    "Brief executive sponsor on assessment process"
                                ],
                                artifacts: ["Assessment Schedule", "Logistics Plan", "Pre-Assessment Package", "Executive Brief"]
                            }
                        },
                        {
                            id: "t10-3-3",
                            name: "Complete assessment",
                            description: "Support C3PAO during formal assessment activities",
                            controls: [],
                            priority: "critical",
                            effort: "high",
                            guidance: {
                                steps: [
                                    "Provide requested evidence promptly",
                                    "Make personnel available for interviews",
                                    "Demonstrate technical controls as requested",
                                    "Take notes on assessor observations",
                                    "Address any real-time findings if possible",
                                    "Receive preliminary results and plan for any conditional items"
                                ],
                                artifacts: ["Assessment Notes", "Evidence Request Log", "Preliminary Findings"]
                            }
                        }
                    ]
                }
            ]
        }
    ],
    
    // Quick reference - controls by category
    controlCategories: {
        identity: {
            name: "Identity & Access",
            controls: ["3.1.1", "3.1.2", "3.1.5", "3.1.6", "3.1.7", "3.5.1", "3.5.2", "3.5.3"],
            description: "Authentication, authorization, and privileged access"
        },
        endpoints: {
            name: "Endpoint Security",
            controls: ["3.4.1", "3.4.2", "3.4.6", "3.4.8", "3.13.16", "3.14.2"],
            description: "Device hardening, encryption, and protection"
        },
        network: {
            name: "Network Security",
            controls: ["3.13.1", "3.13.5", "3.13.6", "3.13.7", "3.13.8", "3.1.12", "3.1.13", "3.1.14"],
            description: "Segmentation, encryption, and remote access"
        },
        data: {
            name: "Data Protection",
            controls: ["3.1.3", "3.8.1", "3.8.4", "3.8.9", "3.13.16"],
            description: "Classification, DLP, and encryption"
        },
        monitoring: {
            name: "Monitoring & Audit",
            controls: ["3.3.1", "3.3.2", "3.3.4", "3.3.8", "3.14.6", "3.14.7"],
            description: "Logging, SIEM, and detection"
        },
        governance: {
            name: "Governance & Policies",
            controls: ["3.2.1", "3.2.2", "3.2.3", "3.12.1", "3.12.4"],
            description: "Training, assessment, and documentation"
        }
    }
};

// Helper functions
function getImplementationPlanner() {
    return IMPLEMENTATION_PLANNER;
}

function getPhaseById(phaseId) {
    return IMPLEMENTATION_PLANNER.phases.find(p => p.id === phaseId);
}

function getTaskById(taskId) {
    for (const phase of IMPLEMENTATION_PLANNER.phases) {
        for (const milestone of phase.milestones) {
            const task = milestone.tasks.find(t => t.id === taskId);
            if (task) return { task, milestone, phase };
        }
    }
    return null;
}

function getAllTasks() {
    const tasks = [];
    for (const phase of IMPLEMENTATION_PLANNER.phases) {
        for (const milestone of phase.milestones) {
            for (const task of milestone.tasks) {
                tasks.push({ ...task, phaseId: phase.id, milestoneId: milestone.id });
            }
        }
    }
    return tasks;
}

// Helper functions for project plan integration
const ProjectPlanIntegration = {
    // Generate project plan view from implementation planner
    generateProjectPlan: function(planner) {
        const projectPlan = [];
        let weekCounter = 1;
        const phaseCategories = planner.projectPlanMapping?.phaseCategories || {};
        
        planner.phases.forEach(phase => {
            phase.milestones.forEach(milestone => {
                milestone.tasks.forEach(task => {
                    // Include tasks even if projectPlan metadata is missing
                    const projectPlanMeta = task.projectPlan || {};
                    const category = projectPlanMeta.category || phaseCategories[phase.id] || "Foundation";
                    projectPlan.push({
                        category,
                        week: projectPlanMeta.week || weekCounter,
                        taskId: projectPlanMeta.taskId || `${phase.id}-${task.id}`,
                        task: task.name,
                        owner: projectPlanMeta.owner || "Owner TBD",
                        accountable: projectPlanMeta.accountable || "Accountable TBD",
                        deliverable: projectPlanMeta.deliverable || "Deliverable TBD",
                        // Link back to implementation planner
                        phaseId: phase.id,
                        implTaskId: task.id,
                        controls: task.controls,
                        priority: task.priority,
                        effort: task.effort,
                        duration: phase.duration
                    });
                });
            });
            // Increment week based on phase duration (rough estimate)
            weekCounter += Math.ceil(parseInt(phase.duration) / 7) || 1;
        });
        
        return projectPlan;
    },
    
    // Generate RACI matrix from implementation planner
    generateRACIMatrix: function(planner) {
        const raciMatrix = {
            roles: ["Exec Sponsor", "CMMC Lead", "FSO", "IT Admin", "HR Mgr", "Dept Leads"],
            tasks: []
        };
        
        const categoryMapping = {
            "Governance": ["Approve SSP & Policies", "Maintain POA&M", "Coordinate CMMC Assessment", "CUI Scope Definition"],
            "Access Control": ["Create Entra ID / MFA Rules", "Manage Privileged Access (PIM)", "Quarterly Access Reviews"],
            "Endpoints": ["Deploy Intune Baselines", "Patch Management"],
            "Personnel": ["Background Checks & Screening", "Onboarding/Offboarding"],
            "Training": ["CUI Awareness Training", "Insider Threat Training"],
            "Physical (PE)": ["Facility Access Control", "Escort Visitors / Visitor Log", "Physical Security Inspections", "Badge Management"],
            "Media (MP)": ["CUI Media Handling Procedures", "Removable Media Authorization", "Media Sanitization & Disposal", "CUI Transport Approval"],
            "Change Mgmt": ["Approve Firewall/Software Changes", "Change Control Board (CCB)"],
            "Incidents": ["Incident Detection & Triage", "Report to DIBNet (72-Hour Rule)", "Forensic Preservation"],
            "Audit": ["Weekly Evidence Collection", "Log Review & Anomaly Detection", "Annual Internal Assessment"]
        };
        
        // Add RACI entries based on task assignments
        Object.entries(categoryMapping).forEach(([category, actions]) => {
            actions.forEach(action => {
                const raci = this.getRACIPattern(category);
                raciMatrix.tasks.push({
                    category: category,
                    action: action,
                    raci: raci
                });
            });
        });
        
        return raciMatrix;
    },
    
    // Get RACI pattern for category
    getRACIPattern: function(category) {
        const patterns = {
            "Governance": ["A", "R", "C", "C", "I", "I"],
            "Access Control": ["I", "A", "I", "R", "I", "I"],
            "Endpoints": ["I", "C", "I", "R/A", "I", "C"],
            "Personnel": ["I", "C", "I", "I", "R/A", "I"],
            "Training": ["I", "A", "C", "I", "R", "C"],
            "Physical (PE)": ["I", "C", "R/A", "I", "I", "I"],
            "Media (MP)": ["I", "A", "R", "C", "I", "C"],
            "Change Mgmt": ["I", "A", "I", "R", "I", "C"],
            "Incidents": ["I", "A", "I", "R", "I", "I"],
            "Audit": ["I", "R/A", "I", "R", "I", "I"]
        };
        return patterns[category] || ["I", "C", "I", "R", "I", "I"];
    },
    
    // Generate timeline view
    generateTimeline: function(planner) {
        const timeline = [];
        let currentWeek = 1;
        
        planner.phases.forEach(phase => {
            const phaseDuration = Math.ceil(parseInt(phase.duration) / 7) || 1;
            
            phase.milestones.forEach(milestone => {
                milestone.tasks.forEach(task => {
                    if (task.projectPlan) {
                        timeline.push({
                            week: task.projectPlan.week || currentWeek,
                            phase: phase.name,
                            milestone: milestone.name,
                            task: task.name,
                            owner: task.projectPlan.owner,
                            category: task.projectPlan.category,
                            priority: task.priority,
                            status: "Planned"
                        });
                    }
                });
            });
            
            currentWeek += phaseDuration;
        });
        
        return timeline;
    },
    
    // Get tasks by category
    getTasksByCategory: function(planner, category) {
        const tasks = [];
        
        planner.phases.forEach(phase => {
            phase.milestones.forEach(milestone => {
                milestone.tasks.forEach(task => {
                    if (task.projectPlan && task.projectPlan.category === category) {
                        tasks.push({
                            ...task,
                            phase: phase.name,
                            milestone: milestone.name
                        });
                    }
                });
            });
        });
        
        return tasks;
    },
    
    // Get tasks by owner
    getTasksByOwner: function(planner, owner) {
        const tasks = [];
        
        planner.phases.forEach(phase => {
            phase.milestones.forEach(milestone => {
                milestone.tasks.forEach(task => {
                    if (task.projectPlan && task.projectPlan.owner === owner) {
                        tasks.push({
                            ...task,
                            phase: phase.name,
                            milestone: milestone.name
                        });
                    }
                });
            });
        });
        
        return tasks;
    }
};

// Export integration functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        IMPLEMENTATION_PLANNER,
        ProjectPlanIntegration,
        getAllTasks
    };
}

// Also expose globally for browser use
if (typeof window !== 'undefined') {
    window.IMPLEMENTATION_PLANNER = IMPLEMENTATION_PLANNER;
    window.ProjectPlanIntegration = ProjectPlanIntegration;
    console.log('Implementation Planner loaded successfully');
}

// Integration Summary
const INTEGRATION_SUMMARY = {
    purpose: "Bridge Implementation Planner with Implementation Guide Project Plan Structure",
    mapping: {
        phasesToCategories: {
            "Foundation": ["phase-1", "phase-1b", "phase-2", "phase-3", "phase-4", "phase-5", "phase-7"],
            "People": ["Personnel Security", "Training & Awareness", "Physical Security"],
            "Governance": ["phase-6", "phase-8", "phase-9"],
            "Audit Prep": ["phase-10"]
        },
        features: [
            "Project Plan Generation: Convert implementation phases to weekly project plan",
            "RACI Matrix: Auto-generate responsibility assignments",
            "Timeline View: Week-by-week task scheduling",
            "Category Filtering: View tasks by project plan category",
            "Owner Assignment: Track responsibilities across phases",
            "Deliverable Tracking: Link tasks to specific deliverables"
        ],
        benefits: [
            "Unified project management across platform",
            "Consistent terminology and structure",
            "Seamless transition between planning and execution",
            "Integrated compliance tracking",
            "Role-based task assignment",
            "Timeline-based progress tracking"
        ]
    }
};
