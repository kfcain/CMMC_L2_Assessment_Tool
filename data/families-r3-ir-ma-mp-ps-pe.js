// NIST SP 800-171A Rev 3 - Incident Response, Maintenance, Media Protection, Personnel Security, Physical Protection
// Based on NIST SP 800-171A Revision 3 (November 2024) — Official assessment objectives
// Objective IDs match official NIST SP 800-171Ar3 publication exactly

const FAMILIES_R3_IR_MA_MP_PS_PE = [
    {
        id: "IR",
        name: "Incident Response",
        controls: [
            {
                id: "03.06.01", name: "Incident Handling",
                rev2Id: "3.6.1", changeType: "enhanced",
                description: "Implement an incident-handling capability that is consistent with the incident response plan.",
                sourceRef: "IR-04",
                objectives: [
                    { id: "03.06.01[01]", text: "An incident-handling capability that is consistent with the incident response plan is implemented." },
                    { id: "03.06.01[02]", text: "The incident handling capability includes preparation." },
                    { id: "03.06.01[03]", text: "The incident handling capability includes detection and analysis." },
                    { id: "03.06.01[04]", text: "The incident handling capability includes containment." },
                    { id: "03.06.01[05]", text: "The incident handling capability includes eradication." },
                    { id: "03.06.01[06]", text: "The incident handling capability includes recovery." }
                ]
            },
            {
                id: "03.06.02", name: "Incident Monitoring, Reporting, and Response Assistance",
                rev2Id: "3.6.2", changeType: "enhanced",
                description: "Track, document, and report incidents to designated officials and authorities.",
                sourceRef: "IR-05, IR-06, IR-07",
                odps: ["Time period for reporting", "Authorities to report to"],
                objectives: [
                    { id: "03.06.02.a[01]", text: "System security incidents are tracked." },
                    { id: "03.06.02.a[02]", text: "System security incidents are documented." },
                    { id: "03.06.02.b", text: "Suspected incidents are reported to the organizational incident response capability within the defined time period." },
                    { id: "03.06.02.c", text: "Incident information is reported to the defined authorities." },
                    { id: "03.06.02.d", text: "An incident response support resource that offers advice and assistance to system users on handling and reporting incidents is provided." }
                ]
            },
            {
                id: "03.06.03", name: "Incident Response Testing",
                rev2Id: "3.6.3", changeType: "enhanced",
                description: "Test the effectiveness of the incident response capability.",
                sourceRef: "IR-03",
                odps: ["Frequency of incident response testing"],
                objectives: [
                    { id: "03.06.03", text: "The effectiveness of the incident response capability is tested at the defined frequency." }
                ]
            },
            {
                id: "03.06.04", name: "Incident Response Training",
                rev2Id: null, changeType: "new",
                description: "Provide incident response training to system users consistent with assigned roles and responsibilities.",
                sourceRef: "IR-02",
                odps: ["Time period for initial training", "Frequency of refresher training", "Frequency of content review", "Events triggering content review"],
                objectives: [
                    { id: "03.06.04.a.01", text: "Incident response training for system users consistent with assigned roles and responsibilities is provided within the defined time period of assuming an incident response role or responsibility or acquiring system access." },
                    { id: "03.06.04.a.02", text: "Incident response training for system users consistent with assigned roles and responsibilities is provided when required by system changes." },
                    { id: "03.06.04.a.03", text: "Incident response training for system users consistent with assigned roles and responsibilities is provided at the defined frequency thereafter." },
                    { id: "03.06.04.b[01]", text: "Incident response training content is reviewed at the defined frequency." },
                    { id: "03.06.04.b[02]", text: "Incident response training content is updated at the defined frequency." },
                    { id: "03.06.04.b[03]", text: "Incident response training content is reviewed following the defined events." },
                    { id: "03.06.04.b[04]", text: "Incident response training content is updated following the defined events." }
                ]
            },
            {
                id: "03.06.05", name: "Incident Response Plan",
                rev2Id: null, changeType: "new",
                description: "Develop an incident response plan that provides the organization with a roadmap for implementing its incident response capability.",
                sourceRef: "IR-08",
                objectives: [
                    { id: "03.06.05.a.01", text: "An incident response plan is developed that provides the organization with a roadmap for implementing its incident response capability." },
                    { id: "03.06.05.a.02", text: "An incident response plan is developed that describes the structure and organization of the incident response capability." },
                    { id: "03.06.05.a.03", text: "An incident response plan is developed that provides a high-level approach for how the incident response capability fits into the overall organization." },
                    { id: "03.06.05.a.04", text: "An incident response plan is developed that defines reportable incidents." },
                    { id: "03.06.05.a.05", text: "An incident response plan is developed that addresses the sharing of incident information." },
                    { id: "03.06.05.a.06", text: "An incident response plan is developed that designates responsibilities to organizational entities, personnel, or roles." },
                    { id: "03.06.05.b[01]", text: "Copies of the incident response plan are distributed to designated incident response personnel (identified by name or by role)." },
                    { id: "03.06.05.b[02]", text: "Copies of the incident response plan are distributed to organizational elements." },
                    { id: "03.06.05.c", text: "The incident response plan is updated to address system and organizational changes or problems encountered during plan implementation, execution, or testing." },
                    { id: "03.06.05.d", text: "The incident response plan is protected from unauthorized disclosure." }
                ]
            }
        ]
    },
    {
        id: "MA",
        name: "Maintenance",
        controls: [
            // 03.07.01 Withdrawn — Recategorized as NCO
            // 03.07.02 Withdrawn — Incorporated into 03.07.04 and 03.07.06
            // 03.07.03 Withdrawn — Incorporated into 03.08.03
            {
                id: "03.07.04", name: "Maintenance Tools",
                rev2Id: "3.7.2", changeType: "enhanced",
                description: "Approve, control, and monitor the use of system maintenance tools.",
                sourceRef: "MA-03, MA-03(01), MA-03(02), MA-03(03)",
                objectives: [
                    { id: "03.07.04.a[01]", text: "The use of system maintenance tools is approved." },
                    { id: "03.07.04.a[02]", text: "The use of system maintenance tools is controlled." },
                    { id: "03.07.04.a[03]", text: "The use of system maintenance tools is monitored." },
                    { id: "03.07.04.b", text: "Media with diagnostic and test programs are checked for malicious code before the media are used in the system." },
                    { id: "03.07.04.c", text: "The removal of system maintenance equipment containing CUI is prevented by verifying that there is no CUI on the equipment, sanitizing or destroying the equipment, or retaining the equipment within the facility." }
                ]
            },
            {
                id: "03.07.05", name: "Nonlocal Maintenance",
                rev2Id: "3.7.5", changeType: "enhanced",
                description: "Approve and monitor nonlocal maintenance and diagnostic activities.",
                sourceRef: "MA-04",
                objectives: [
                    { id: "03.07.05.a[01]", text: "Nonlocal maintenance and diagnostic activities are approved." },
                    { id: "03.07.05.a[02]", text: "Nonlocal maintenance and diagnostic activities are monitored." },
                    { id: "03.07.05.b[01]", text: "Multi-factor authentication is implemented in the establishment of nonlocal maintenance and diagnostic sessions." },
                    { id: "03.07.05.b[02]", text: "Replay resistance is implemented in the establishment of nonlocal maintenance and diagnostic sessions." },
                    { id: "03.07.05.c[01]", text: "Session connections are terminated when nonlocal maintenance is completed." },
                    { id: "03.07.05.c[02]", text: "Network connections are terminated when nonlocal maintenance is completed." }
                ]
            },
            {
                id: "03.07.06", name: "Maintenance Personnel",
                rev2Id: "3.7.6", changeType: "enhanced",
                description: "Establish a process for maintenance personnel authorization and manage maintenance personnel access.",
                sourceRef: "MA-05",
                objectives: [
                    { id: "03.07.06.a", text: "A process for maintenance personnel authorization is established." },
                    { id: "03.07.06.b", text: "A list of authorized maintenance organizations or personnel is maintained." },
                    { id: "03.07.06.c", text: "Non-escorted personnel who perform maintenance on the system possess the required access authorizations." },
                    { id: "03.07.06.d[01]", text: "Organizational personnel with required access authorizations are designated to supervise the maintenance activities of personnel who do not possess the required access authorizations." },
                    { id: "03.07.06.d[02]", text: "Organizational personnel with required technical competence are designated to supervise the maintenance activities of personnel who do not possess the required access authorizations." }
                ]
            }
        ]
    },
    {
        id: "MP",
        name: "Media Protection",
        controls: [
            {
                id: "03.08.01", name: "Media Storage",
                rev2Id: "3.8.1", changeType: "renumbered",
                description: "Physically control and securely store system media that contain CUI.",
                sourceRef: "MP-04",
                objectives: [
                    { id: "03.08.01[01]", text: "System media that contain CUI are physically controlled." },
                    { id: "03.08.01[02]", text: "System media that contain CUI are securely stored." }
                ]
            },
            {
                id: "03.08.02", name: "Media Access",
                rev2Id: "3.8.2", changeType: "renumbered",
                description: "Restrict access to CUI on system media to authorized personnel or roles.",
                sourceRef: "MP-02",
                objectives: [
                    { id: "03.08.02", text: "Access to CUI on system media is restricted to authorized personnel or roles." }
                ]
            },
            {
                id: "03.08.03", name: "Media Sanitization",
                rev2Id: "3.8.3", changeType: "enhanced",
                description: "Sanitize system media that contain CUI prior to disposal, release out of organizational control, or release for reuse.",
                sourceRef: "MP-06",
                objectives: [
                    { id: "03.08.03", text: "System media that contain CUI are sanitized prior to disposal, release out of organizational control, or release for reuse." }
                ]
            },
            {
                id: "03.08.04", name: "Media Marking",
                rev2Id: "3.8.4", changeType: "renumbered",
                description: "Mark system media that contain CUI to indicate distribution limitations, handling caveats, and applicable CUI markings.",
                sourceRef: "MP-03",
                objectives: [
                    { id: "03.08.04[01]", text: "System media that contain CUI are marked to indicate distribution limitations." },
                    { id: "03.08.04[02]", text: "System media that contain CUI are marked to indicate handling caveats." },
                    { id: "03.08.04[03]", text: "System media that contain CUI are marked to indicate applicable CUI markings." }
                ]
            },
            {
                id: "03.08.05", name: "Media Transport",
                rev2Id: "3.8.5", changeType: "enhanced",
                description: "Protect, control, and document system media that contain CUI during transport outside of controlled areas.",
                sourceRef: "MP-05, SC-28",
                objectives: [
                    { id: "03.08.05.a[01]", text: "System media that contain CUI are protected during transport outside of controlled areas." },
                    { id: "03.08.05.a[02]", text: "System media that contain CUI are controlled during transport outside of controlled areas." },
                    { id: "03.08.05.b", text: "Accountability for system media that contain CUI is maintained during transport outside of controlled areas." },
                    { id: "03.08.05.c", text: "Activities associated with the transport of system media that contain CUI are documented." }
                ]
            },
            // 03.08.06 Withdrawn — Addressed by 03.13.08
            {
                id: "03.08.07", name: "Media Use",
                rev2Id: "3.8.7", changeType: "enhanced",
                description: "Restrict or prohibit the use of certain types of system media and prohibit the use of removable system media without an identifiable owner.",
                sourceRef: "MP-07",
                odps: ["Types of system media with usage restrictions"],
                objectives: [
                    { id: "03.08.07.a", text: "The use of the defined types of system media is restricted or prohibited." },
                    { id: "03.08.07.b", text: "The use of removable system media without an identifiable owner is prohibited." }
                ]
            },
            // 03.08.08 Withdrawn — Incorporated into 03.08.07
            {
                id: "03.08.09", name: "System Backup — Cryptographic Protection",
                rev2Id: "3.8.9", changeType: "enhanced",
                description: "Protect the confidentiality of backup information and implement cryptographic mechanisms to prevent unauthorized disclosure of CUI at backup storage locations.",
                sourceRef: "CP-09, CP-09(08)",
                objectives: [
                    { id: "03.08.09.a", text: "The confidentiality of backup information is protected." },
                    { id: "03.08.09.b", text: "Cryptographic mechanisms are implemented to prevent the unauthorized disclosure of CUI at backup storage locations." }
                ]
            }
        ]
    },
    {
        id: "PS",
        name: "Personnel Security",
        controls: [
            {
                id: "03.09.01", name: "Personnel Screening",
                rev2Id: "3.9.1", changeType: "enhanced",
                description: "Screen individuals prior to authorizing access to the system and rescreen in accordance with defined conditions.",
                sourceRef: "PS-03",
                odps: ["Conditions requiring rescreening"],
                objectives: [
                    { id: "03.09.01.a", text: "Individuals are screened prior to authorizing access to the system." },
                    { id: "03.09.01.b", text: "Individuals are rescreened in accordance with the defined conditions." }
                ]
            },
            {
                id: "03.09.02", name: "Personnel Termination and Transfer",
                rev2Id: "3.9.2", changeType: "enhanced",
                description: "Protect organizational systems and CUI during and after personnel actions such as terminations and transfers.",
                sourceRef: "PS-04, PS-05",
                odps: ["Time period for disabling system access"],
                objectives: [
                    { id: "03.09.02.a.01", text: "Upon termination of individual employment, system access is disabled within the defined time period." },
                    { id: "03.09.02.a.02[01]", text: "Upon termination of individual employment, authenticators associated with the individual are terminated or revoked." },
                    { id: "03.09.02.a.02[02]", text: "Upon termination of individual employment, credentials associated with the individual are terminated or revoked." },
                    { id: "03.09.02.a.03", text: "Upon termination of individual employment, security-related system property is retrieved." },
                    { id: "03.09.02.b.01[01]", text: "Upon individual reassignment or transfer, the ongoing operational need for current logical and physical access authorizations to the system and facility is reviewed." },
                    { id: "03.09.02.b.01[02]", text: "Upon individual reassignment or transfer, the ongoing operational need for current logical and physical access authorizations to the system and facility is confirmed." },
                    { id: "03.09.02.b.02", text: "Upon individual reassignment or transfer, access authorization is modified to correspond with any changes in operational need." }
                ]
            }
        ]
    },
    {
        id: "PE",
        name: "Physical Protection",
        controls: [
            {
                id: "03.10.01", name: "Physical Access Authorizations",
                rev2Id: "3.10.1", changeType: "enhanced",
                description: "Develop, approve, and maintain a list of individuals with authorized access to the facility where the system resides.",
                sourceRef: "PE-02",
                odps: ["Frequency of access list review"],
                objectives: [
                    { id: "03.10.01.a[01]", text: "A list of individuals with authorized access to the facility where the system resides is developed." },
                    { id: "03.10.01.a[02]", text: "A list of individuals with authorized access to the facility where the system resides is approved." },
                    { id: "03.10.01.a[03]", text: "A list of individuals with authorized access to the facility where the system resides is maintained." },
                    { id: "03.10.01.b", text: "Authorization credentials for facility access are issued." },
                    { id: "03.10.01.c", text: "The facility access list is reviewed at the defined frequency." },
                    { id: "03.10.01.d", text: "Individuals from the facility access list are removed when access is no longer required." }
                ]
            },
            {
                id: "03.10.02", name: "Monitoring Physical Access",
                rev2Id: "3.10.2", changeType: "enhanced",
                description: "Monitor physical access to the facility where the system resides to detect physical security incidents.",
                sourceRef: "PE-06",
                odps: ["Frequency of physical access log review", "Events requiring log review"],
                objectives: [
                    { id: "03.10.02.a[01]", text: "Physical access to the facility where the system resides is monitored to detect physical security incidents." },
                    { id: "03.10.02.a[02]", text: "Physical security incidents are responded to." },
                    { id: "03.10.02.b[01]", text: "Physical access logs are reviewed at the defined frequency." },
                    { id: "03.10.02.b[02]", text: "Physical access logs are reviewed upon occurrence of the defined events or potential indications of events." }
                ]
            },
            // 03.10.03 Withdrawn — Incorporated into 03.10.07
            // 03.10.04 Withdrawn — Incorporated into 03.10.07
            // 03.10.05 Withdrawn — Incorporated into 03.10.07
            {
                id: "03.10.06", name: "Alternate Work Site",
                rev2Id: "3.10.6", changeType: "enhanced",
                description: "Determine alternate work sites allowed for use by employees and employ security requirements at those sites.",
                sourceRef: "PE-17",
                odps: ["Security requirements for alternate work sites"],
                objectives: [
                    { id: "03.10.06.a", text: "Alternate work sites allowed for use by employees are determined." },
                    { id: "03.10.06.b", text: "The defined security requirements are employed at alternate work sites." }
                ]
            },
            {
                id: "03.10.07", name: "Physical Access Control",
                rev2Id: null, changeType: "new",
                description: "Enforce physical access authorizations at entry and exit points to the facility where the system resides.",
                sourceRef: "PE-03, PE-05",
                objectives: [
                    { id: "03.10.07.a.01", text: "Physical access authorizations are enforced at entry and exit points to the facility where the system resides by verifying individual physical access authorizations before granting access." },
                    { id: "03.10.07.a.02", text: "Physical access authorizations are enforced at entry and exit points to the facility where the system resides by controlling ingress and egress with physical access control systems, devices, or guards." },
                    { id: "03.10.07.b", text: "Physical access audit logs for entry or exit points are maintained." },
                    { id: "03.10.07.c[01]", text: "Visitors are escorted." },
                    { id: "03.10.07.c[02]", text: "Visitor activity is controlled." },
                    { id: "03.10.07.d", text: "Keys, combinations, and other physical access devices are secured." },
                    { id: "03.10.07.e", text: "Physical access to output devices is controlled to prevent unauthorized individuals from obtaining access to CUI." }
                ]
            },
            {
                id: "03.10.08", name: "Access Control for Transmission",
                rev2Id: null, changeType: "new",
                description: "Control physical access to system distribution and transmission lines within organizational facilities.",
                sourceRef: "PE-04",
                objectives: [
                    { id: "03.10.08", text: "Physical access to system distribution and transmission lines within organizational facilities is controlled." }
                ]
            }
        ]
    }
];
