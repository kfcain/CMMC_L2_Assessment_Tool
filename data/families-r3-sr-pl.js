// NIST SP 800-171A Rev 3 - Planning (PL), System and Services Acquisition (SA), Supply Chain Risk Management (SR)
// NEW families added in Rev 3 - not present in Rev 2
// Based on NIST SP 800-171A Revision 3 (November 2024) — Official assessment objectives
// Objective IDs match official NIST SP 800-171Ar3 publication exactly

const FAMILIES_R3_SR_PL = [
    {
        id: "PL",
        name: "Planning",
        controls: [
            {
                id: "03.15.01", name: "Policy and Procedures",
                rev2Id: null, changeType: "new",
                description: "Develop, document, disseminate, review, and update policies and procedures needed to satisfy security requirements for the protection of CUI.",
                sourceRef: "AC-01, AT-01, AU-01, CA-01, CM-01, IA-01, IR-01, MA-01, MP-01, PE-01, PL-01, PS-01, RA-01, SA-01, SC-01, SI-01, SR-01",
                odps: ["Frequency of policy and procedure review"],
                objectives: [
                    { id: "03.15.01.a[01]", text: "Policies needed to satisfy the security requirements for the protection of CUI are developed and documented." },
                    { id: "03.15.01.a[02]", text: "Policies needed to satisfy the security requirements for the protection of CUI are disseminated to organizational personnel or roles." },
                    { id: "03.15.01.a[03]", text: "Procedures needed to satisfy the security requirements for the protection of CUI are developed and documented." },
                    { id: "03.15.01.a[04]", text: "Procedures needed to satisfy the security requirements for the protection of CUI are disseminated to organizational personnel or roles." },
                    { id: "03.15.01.b[01]", text: "Policies and procedures are reviewed at the defined frequency." },
                    { id: "03.15.01.b[02]", text: "Policies and procedures are updated at the defined frequency." }
                ]
            },
            {
                id: "03.15.02", name: "System Security Plan",
                rev2Id: "3.12.4", changeType: "new",
                description: "Develop, review, update, and protect the system security plan.",
                sourceRef: "PL-02",
                odps: ["Frequency of SSP review and update"],
                objectives: [
                    { id: "03.15.02.a.01", text: "A system security plan that defines the constituent system components is developed." },
                    { id: "03.15.02.a.02", text: "A system security plan that identifies the information types processed, stored, and transmitted by the system is developed." },
                    { id: "03.15.02.a.03", text: "A system security plan that describes specific threats to the system that are of concern to the organization is developed." },
                    { id: "03.15.02.a.04", text: "A system security plan that describes the operational environment for the system and any dependencies on or connections to other systems or system components is developed." },
                    { id: "03.15.02.a.05", text: "A system security plan that provides an overview of the security requirements for the system is developed." },
                    { id: "03.15.02.a.06", text: "A system security plan that describes the safeguards in place or planned for meeting the security requirements is developed." },
                    { id: "03.15.02.a.07", text: "A system security plan that identifies individuals that fulfill system roles and responsibilities is developed." },
                    { id: "03.15.02.a.08", text: "A system security plan that includes other relevant information necessary for the protection of CUI is developed." },
                    { id: "03.15.02.b[01]", text: "The system security plan is reviewed at the defined frequency." },
                    { id: "03.15.02.b[02]", text: "The system security plan is updated at the defined frequency." },
                    { id: "03.15.02.c", text: "The system security plan is protected from unauthorized disclosure." }
                ]
            },
            {
                id: "03.15.03", name: "Rules of Behavior",
                rev2Id: null, changeType: "new",
                description: "Establish rules that describe responsibilities and expected behavior for system usage and protecting CUI.",
                sourceRef: "PL-04",
                odps: ["Frequency of rules of behavior review"],
                objectives: [
                    { id: "03.15.03.a", text: "Rules that describe responsibilities and expected behavior for system usage and protecting CUI are established." },
                    { id: "03.15.03.b", text: "Rules are provided to individuals who require access to the system." },
                    { id: "03.15.03.c", text: "A documented acknowledgement from individuals indicating that they have read, understand, and agree to abide by the rules of behavior is received before authorizing access to CUI and the system." },
                    { id: "03.15.03.d[01]", text: "The rules of behavior are reviewed at the defined frequency." },
                    { id: "03.15.03.d[02]", text: "The rules of behavior are updated at the defined frequency." }
                ]
            }
        ]
    },
    {
        id: "SA",
        name: "System and Services Acquisition",
        controls: [
            {
                id: "03.16.01", name: "Systems Security Engineering Principles",
                rev2Id: null, changeType: "new",
                description: "Apply systems security engineering principles to the development or modification of the system and system components.",
                sourceRef: "SA-08",
                odps: ["Systems security engineering principles"],
                objectives: [
                    { id: "03.16.01", text: "The defined systems security engineering principles are applied to the development or modification of the system and system components." }
                ]
            },
            {
                id: "03.16.02", name: "Unsupported System Components",
                rev2Id: null, changeType: "new",
                description: "Replace system components when support is no longer available or provide risk mitigation alternatives.",
                sourceRef: "SA-22",
                objectives: [
                    { id: "03.16.02.a", text: "System components are replaced when support for the components is no longer available from the developer, vendor, or manufacturer." },
                    { id: "03.16.02.b", text: "Options for risk mitigation or alternative sources for continued support for unsupported components that cannot be replaced are provided." }
                ]
            },
            {
                id: "03.16.03", name: "External System Services",
                rev2Id: null, changeType: "new",
                description: "Require external system service providers to comply with security requirements and monitor compliance on an ongoing basis.",
                sourceRef: "SA-09",
                odps: ["Security requirements for external service providers"],
                objectives: [
                    { id: "03.16.03.a", text: "The providers of external system services used for the processing, storage, or transmission of CUI comply with the defined security requirements." },
                    { id: "03.16.03.b", text: "User roles and responsibilities with regard to external system services, including shared responsibilities with external service providers, are defined and documented." },
                    { id: "03.16.03.c", text: "Processes, methods, and techniques to monitor security requirement compliance by external service providers on an ongoing basis are implemented." }
                ]
            }
        ]
    },
    {
        id: "SR",
        name: "Supply Chain Risk Management",
        controls: [
            {
                id: "03.17.01", name: "Supply Chain Risk Management Plan",
                rev2Id: null, changeType: "new",
                description: "Develop, review, update, and protect a plan for managing supply chain risks.",
                sourceRef: "SR-02",
                odps: ["Frequency of SCRM plan review"],
                objectives: [
                    { id: "03.17.01.a[01]", text: "A plan for managing supply chain risks is developed." },
                    { id: "03.17.01.a[02]", text: "The SCRM plan addresses risks associated with the research and development of the system, system components, or system services." },
                    { id: "03.17.01.a[03]", text: "The SCRM plan addresses risks associated with the design of the system, system components, or system services." },
                    { id: "03.17.01.a[04]", text: "The SCRM plan addresses risks associated with the manufacturing of the system, system components, or system services." },
                    { id: "03.17.01.a[05]", text: "The SCRM plan addresses risks associated with the acquisition of the system, system components, or system services." },
                    { id: "03.17.01.a[06]", text: "The SCRM plan addresses risks associated with the delivery of the system, system components, or system services." },
                    { id: "03.17.01.a[07]", text: "The SCRM plan addresses risks associated with the integration of the system, system components, or system services." },
                    { id: "03.17.01.a[08]", text: "The SCRM plan addresses risks associated with the operation of the system, system components, or system services." },
                    { id: "03.17.01.a[09]", text: "The SCRM plan addresses risks associated with the maintenance of the system, system components, or system services." },
                    { id: "03.17.01.a[10]", text: "The SCRM plan addresses risks associated with the disposal of the system, system components, or system services." },
                    { id: "03.17.01.b[01]", text: "The SCRM plan is reviewed at the defined frequency." },
                    { id: "03.17.01.b[02]", text: "The SCRM plan is updated at the defined frequency." },
                    { id: "03.17.01.c", text: "The SCRM plan is protected from unauthorized disclosure." }
                ]
            },
            {
                id: "03.17.02", name: "Acquisition Strategies, Tools, and Methods",
                rev2Id: null, changeType: "new",
                description: "Develop and implement acquisition strategies, contract tools, and procurement methods to identify, protect against, and mitigate supply chain risks.",
                sourceRef: "SR-05",
                objectives: [
                    { id: "03.17.02[01]", text: "Acquisition strategies, contract tools, and procurement methods are developed to identify supply chain risks." },
                    { id: "03.17.02[02]", text: "Acquisition strategies, contract tools, and procurement methods are developed to protect against supply chain risks." },
                    { id: "03.17.02[03]", text: "Acquisition strategies, contract tools, and procurement methods are developed to mitigate supply chain risks." },
                    { id: "03.17.02[04]", text: "Acquisition strategies, contract tools, and procurement methods are implemented to identify supply chain risks." },
                    { id: "03.17.02[05]", text: "Acquisition strategies, contract tools, and procurement methods are implemented to protect against supply chain risks." },
                    { id: "03.17.02[06]", text: "Acquisition strategies, contract tools, and procurement methods are implemented to mitigate supply chain risks." }
                ]
            },
            {
                id: "03.17.03", name: "Supply Chain Requirements and Processes",
                rev2Id: null, changeType: "new",
                description: "Establish processes for identifying and addressing weaknesses or deficiencies in supply chain elements and enforce security requirements.",
                sourceRef: "SR-03",
                odps: ["Security requirements for supply chain protection"],
                objectives: [
                    { id: "03.17.03.a[01]", text: "A process for identifying weaknesses or deficiencies in the supply chain elements and processes is established." },
                    { id: "03.17.03.a[02]", text: "A process for addressing weaknesses or deficiencies in the supply chain elements and processes is established." },
                    { id: "03.17.03.b", text: "The defined security requirements are enforced to protect against supply chain risks to the system, system components, or system services and to limit the harm or consequences of supply chain-related events." }
                ]
            }
        ]
    }
];
