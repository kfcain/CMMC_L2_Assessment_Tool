// NIST SP 800-171A Rev 3 - Risk Assessment, Security Assessment, System/Communications Protection, System/Information Integrity
// Based on NIST SP 800-171A Revision 3 (November 2024) — Official assessment objectives
// Objective IDs match official NIST SP 800-171Ar3 publication exactly

const FAMILIES_R3_RA_CA_SC_SI = [
    {
        id: "RA",
        name: "Risk Assessment",
        controls: [
            {
                id: "03.11.01", name: "Risk Assessment",
                rev2Id: "3.11.1", changeType: "enhanced",
                description: "Assess the risk of unauthorized disclosure resulting from the processing, storage, or transmission of CUI.",
                sourceRef: "RA-03, RA-03(01), SR-06",
                odps: ["Frequency of risk assessment update"],
                objectives: [
                    { id: "03.11.01.a", text: "The risk (including supply chain risk) of unauthorized disclosure resulting from the processing, storage, or transmission of CUI is assessed." },
                    { id: "03.11.01.b", text: "Risk assessments are updated at the defined frequency." }
                ]
            },
            {
                id: "03.11.02", name: "Vulnerability Monitoring and Scanning",
                rev2Id: "3.11.2", changeType: "enhanced",
                description: "Monitor and scan for vulnerabilities in the system and applications periodically and when new vulnerabilities are identified.",
                sourceRef: "RA-05, RA-05(02)",
                odps: ["Frequency of vulnerability monitoring", "Frequency of vulnerability scanning", "Response times for remediation", "Frequency of scan update"],
                objectives: [
                    { id: "03.11.02.a[01]", text: "The system is monitored for vulnerabilities at the defined frequency." },
                    { id: "03.11.02.a[02]", text: "The system is scanned for vulnerabilities at the defined frequency." },
                    { id: "03.11.02.a[03]", text: "The system is monitored for vulnerabilities when new vulnerabilities that affect the system are identified." },
                    { id: "03.11.02.a[04]", text: "The system is scanned for vulnerabilities when new vulnerabilities that affect the system are identified." },
                    { id: "03.11.02.b", text: "System vulnerabilities are remediated within the defined response times." },
                    { id: "03.11.02.c[01]", text: "System vulnerabilities to be scanned are updated at the defined frequency." },
                    { id: "03.11.02.c[02]", text: "System vulnerabilities to be scanned are updated when new vulnerabilities are identified and reported." }
                ]
            },
            // 03.11.03 Withdrawn — Incorporated into 03.11.02
            {
                id: "03.11.04", name: "Risk Response",
                rev2Id: null, changeType: "new",
                description: "Respond to findings from security assessments, monitoring, and audits.",
                sourceRef: "RA-07",
                objectives: [
                    { id: "03.11.04[01]", text: "Findings from security assessments are responded to." },
                    { id: "03.11.04[02]", text: "Findings from security monitoring are responded to." },
                    { id: "03.11.04[03]", text: "Findings from security audits are responded to." }
                ]
            }
        ]
    },
    {
        id: "CA",
        name: "Security Assessment and Monitoring",
        controls: [
            {
                id: "03.12.01", name: "Security Assessment",
                rev2Id: "3.12.1", changeType: "enhanced",
                description: "Assess the security requirements for the system and its environment of operation to determine if the requirements have been satisfied.",
                sourceRef: "CA-02",
                odps: ["Frequency of security assessment"],
                objectives: [
                    { id: "03.12.01.ODP[01]", text: "The frequency at which to assess the security requirements for the system and its environment of operation is defined." },
                    { id: "03.12.01", text: "The security requirements for the system and its environment of operation are assessed at the defined frequency to determine if the requirements have been satisfied." }
                ]
            },
            {
                id: "03.12.02", name: "Plan of Action and Milestones",
                rev2Id: "3.12.2", changeType: "enhanced",
                description: "Develop and update a plan of action and milestones for the system to document planned remediation actions.",
                sourceRef: "CA-05",
                objectives: [
                    { id: "03.12.02.a.01", text: "A plan of action and milestones for the system is developed to document the planned remediation actions for correcting weaknesses or deficiencies noted during security assessments." },
                    { id: "03.12.02.a.02", text: "A plan of action and milestones for the system is developed to reduce or eliminate known system vulnerabilities." },
                    { id: "03.12.02.b.01", text: "The existing plan of action and milestones is updated based on the findings from security assessments." },
                    { id: "03.12.02.b.02", text: "The existing plan of action and milestones is updated based on the findings from audits or reviews." },
                    { id: "03.12.02.b.03", text: "The existing plan of action and milestones is updated based on the findings from continuous monitoring activities." }
                ]
            },
            {
                id: "03.12.03", name: "Continuous Monitoring",
                rev2Id: "3.12.3", changeType: "enhanced",
                description: "Develop and implement a system-level continuous monitoring strategy.",
                sourceRef: "CA-07",
                objectives: [
                    { id: "03.12.03[01]", text: "A system-level continuous monitoring strategy is developed." },
                    { id: "03.12.03[02]", text: "A system-level continuous monitoring strategy is implemented." },
                    { id: "03.12.03[03]", text: "Ongoing monitoring is included in the continuous monitoring strategy." },
                    { id: "03.12.03[04]", text: "Security assessments are included in the continuous monitoring strategy." }
                ]
            },
            // 03.12.04 Withdrawn — Incorporated into 03.15.02
            {
                id: "03.12.05", name: "Information Exchange",
                rev2Id: null, changeType: "new",
                description: "Approve and manage the exchange of CUI between the system and other systems using exchange agreements.",
                sourceRef: "CA-03",
                odps: ["Types of exchange agreements", "Frequency of agreement review"],
                objectives: [
                    { id: "03.12.05.a[01]", text: "The exchange of CUI between the system and other systems is approved using the selected agreements." },
                    { id: "03.12.05.a[02]", text: "The exchange of CUI between the system and other systems is managed using the selected agreements." },
                    { id: "03.12.05.b[01]", text: "Interface characteristics for each system are documented as part of the exchange agreements." },
                    { id: "03.12.05.b[02]", text: "Security requirements for each system are documented as part of the exchange agreements." },
                    { id: "03.12.05.b[03]", text: "Responsibilities for each system are documented as part of the exchange agreements." },
                    { id: "03.12.05.c[01]", text: "Exchange agreements are reviewed at the defined frequency." },
                    { id: "03.12.05.c[02]", text: "Exchange agreements are updated at the defined frequency." }
                ]
            }
        ]
    },
    {
        id: "SC",
        name: "System and Communications Protection",
        controls: [
            {
                id: "03.13.01", name: "Boundary Protection",
                rev2Id: "3.13.1", changeType: "enhanced",
                description: "Monitor and control communications at external and key internal managed interfaces to the system.",
                sourceRef: "SC-07",
                objectives: [
                    { id: "03.13.01.a[01]", text: "Communications at external managed interfaces to the system are monitored." },
                    { id: "03.13.01.a[02]", text: "Communications at external managed interfaces to the system are controlled." },
                    { id: "03.13.01.a[03]", text: "Communications at key internal managed interfaces within the system are monitored." },
                    { id: "03.13.01.a[04]", text: "Communications at key internal managed interfaces within the system are controlled." },
                    { id: "03.13.01.b", text: "Subnetworks are implemented for publicly accessible system components that are physically or logically separated from internal networks." },
                    { id: "03.13.01.c", text: "External system connections are only made through managed interfaces that consist of boundary protection devices arranged in accordance with an organizational security architecture." }
                ]
            },
            // 03.13.02 Withdrawn — Recategorized as NCO
            // 03.13.03 Withdrawn — Addressed by 03.01.01-07
            {
                id: "03.13.04", name: "Information in Shared System Resources",
                rev2Id: "3.13.4", changeType: "renumbered",
                description: "Prevent unauthorized and unintended information transfer via shared system resources.",
                sourceRef: "SC-04",
                objectives: [
                    { id: "03.13.04[01]", text: "Unauthorized information transfer via shared system resources is prevented." },
                    { id: "03.13.04[02]", text: "Unintended information transfer via shared system resources is prevented." }
                ]
            },
            // 03.13.05 Withdrawn — Incorporated into 03.13.01
            {
                id: "03.13.06", name: "Network Communications — Deny by Default — Allow by Exception",
                rev2Id: "3.13.6", changeType: "renumbered",
                description: "Deny network communications traffic by default and allow by exception.",
                sourceRef: "SC-07(05)",
                objectives: [
                    { id: "03.13.06[01]", text: "Network communications traffic is denied by default." },
                    { id: "03.13.06[02]", text: "Network communications traffic is allowed by exception." }
                ]
            },
            // 03.13.07 Withdrawn — Addressed by 03.01.12, 03.04.02, 03.04.06
            {
                id: "03.13.08", name: "Transmission and Storage Confidentiality",
                rev2Id: "3.13.8", changeType: "enhanced",
                description: "Implement cryptographic mechanisms to prevent the unauthorized disclosure of CUI during transmission and while in storage.",
                sourceRef: "SC-08, SC-08(01), SC-28, SC-28(01)",
                objectives: [
                    { id: "03.13.08[01]", text: "Cryptographic mechanisms are implemented to prevent the unauthorized disclosure of CUI during transmission." },
                    { id: "03.13.08[02]", text: "Cryptographic mechanisms are implemented to prevent the unauthorized disclosure of CUI while in storage." }
                ]
            },
            {
                id: "03.13.09", name: "Network Disconnect",
                rev2Id: "3.13.9", changeType: "enhanced",
                description: "Terminate the network connection associated with a communications session at the end of the session or after a defined time period of inactivity.",
                sourceRef: "SC-10",
                odps: ["Time period of inactivity"],
                objectives: [
                    { id: "03.13.09.ODP[01]", text: "The time period of inactivity after which the system terminates a network connection associated with a communications session is defined." },
                    { id: "03.13.09", text: "The network connection associated with a communications session is terminated at the end of the session or after the defined time period of inactivity." }
                ]
            },
            {
                id: "03.13.10", name: "Cryptographic Key Establishment and Management",
                rev2Id: "3.13.10", changeType: "enhanced",
                description: "Establish and manage cryptographic keys in the system in accordance with key management requirements.",
                sourceRef: "SC-12",
                odps: ["Key management requirements"],
                objectives: [
                    { id: "03.13.10[01]", text: "Cryptographic keys are established in the system in accordance with the defined key management requirements." },
                    { id: "03.13.10[02]", text: "Cryptographic keys are managed in the system in accordance with the defined key management requirements." }
                ]
            },
            {
                id: "03.13.11", name: "Cryptographic Protection",
                rev2Id: "3.13.11", changeType: "enhanced",
                description: "Implement the defined types of cryptography to protect the confidentiality of CUI.",
                sourceRef: "SC-13",
                odps: ["Types of cryptography"],
                objectives: [
                    { id: "03.13.11", text: "The defined types of cryptography are implemented to protect the confidentiality of CUI." }
                ]
            },
            {
                id: "03.13.12", name: "Collaborative Computing Devices and Applications",
                rev2Id: "3.13.12", changeType: "enhanced",
                description: "Prohibit remote activation of collaborative computing devices and applications with defined exceptions and provide indication of use.",
                sourceRef: "SC-15",
                odps: ["Exceptions for remote activation"],
                objectives: [
                    { id: "03.13.12.a", text: "The remote activation of collaborative computing devices and applications is prohibited with the defined exceptions." },
                    { id: "03.13.12.b", text: "An explicit indication of use is provided to users who are physically present at the devices." }
                ]
            },
            {
                id: "03.13.13", name: "Mobile Code",
                rev2Id: "3.13.13", changeType: "enhanced",
                description: "Define acceptable mobile code and technologies, and authorize, monitor, and control the use of mobile code.",
                sourceRef: "SC-18",
                objectives: [
                    { id: "03.13.13.a[01]", text: "Acceptable mobile code is defined." },
                    { id: "03.13.13.a[02]", text: "Acceptable mobile code technologies are defined." },
                    { id: "03.13.13.b[01]", text: "The use of mobile code is authorized." },
                    { id: "03.13.13.b[02]", text: "The use of mobile code is monitored." },
                    { id: "03.13.13.b[03]", text: "The use of mobile code is controlled." }
                ]
            },
            // 03.13.14 Withdrawn — Technology-specific
            {
                id: "03.13.15", name: "Session Authenticity",
                rev2Id: "3.13.15", changeType: "renumbered",
                description: "Protect the authenticity of communications sessions.",
                sourceRef: "SC-23",
                objectives: [
                    { id: "03.13.15", text: "The authenticity of communications sessions is protected." }
                ]
            }
            // 03.13.16 Withdrawn — Incorporated into 03.13.08
        ]
    },
    {
        id: "SI",
        name: "System and Information Integrity",
        controls: [
            {
                id: "03.14.01", name: "Flaw Remediation",
                rev2Id: "3.14.1", changeType: "enhanced",
                description: "Identify, report, and correct system flaws, and install security-relevant software and firmware updates.",
                sourceRef: "SI-02",
                odps: ["Time period for software updates", "Time period for firmware updates"],
                objectives: [
                    { id: "03.14.01.a[01]", text: "System flaws are identified." },
                    { id: "03.14.01.a[02]", text: "System flaws are reported." },
                    { id: "03.14.01.a[03]", text: "System flaws are corrected." },
                    { id: "03.14.01.b[01]", text: "Security-relevant software updates are installed within the defined time period of the release of the updates." },
                    { id: "03.14.01.b[02]", text: "Security-relevant firmware updates are installed within the defined time period of the release of the updates." }
                ]
            },
            {
                id: "03.14.02", name: "Malicious Code Protection",
                rev2Id: "3.14.2", changeType: "enhanced",
                description: "Implement malicious code protection mechanisms at system entry and exit points to detect and eradicate malicious code.",
                sourceRef: "SI-03",
                odps: ["Frequency of malicious code scans"],
                objectives: [
                    { id: "03.14.02.a[01]", text: "Malicious code protection mechanisms are implemented at system entry and exit points to detect malicious code." },
                    { id: "03.14.02.a[02]", text: "Malicious code protection mechanisms are implemented at system entry and exit points to eradicate malicious code." },
                    { id: "03.14.02.b", text: "Malicious code protection mechanisms are updated as new releases are available in accordance with configuration management policy and procedures." },
                    { id: "03.14.02.c.01[01]", text: "Malicious code protection mechanisms are configured to perform scans of the system at the defined frequency." },
                    { id: "03.14.02.c.01[02]", text: "Malicious code protection mechanisms are configured to perform real-time scans of files from external sources at endpoints or system entry and exit points as the files are downloaded, opened, or executed." },
                    { id: "03.14.02.c.02", text: "Malicious code protection mechanisms are configured to block malicious code, quarantine malicious code, or take other actions in response to malicious code detection." }
                ]
            },
            {
                id: "03.14.03", name: "Security Alerts, Advisories, and Directives",
                rev2Id: "3.14.3", changeType: "enhanced",
                description: "Receive and disseminate system security alerts, advisories, and directives from external organizations on an ongoing basis.",
                sourceRef: "SI-05",
                objectives: [
                    { id: "03.14.03.a", text: "System security alerts, advisories, and directives from external organizations are received on an ongoing basis." },
                    { id: "03.14.03.b[01]", text: "Internal security alerts, advisories, and directives are generated, as necessary." },
                    { id: "03.14.03.b[02]", text: "Internal security alerts, advisories, and directives are disseminated, as necessary." }
                ]
            },
            // 03.14.04 Withdrawn — Incorporated into 03.14.02
            // 03.14.05 Withdrawn — Addressed by 03.14.02
            {
                id: "03.14.06", name: "System Monitoring",
                rev2Id: "3.14.6", changeType: "enhanced",
                description: "Monitor the system to detect attacks, indicators of potential attacks, unauthorized connections, and unusual activities.",
                sourceRef: "SI-04, SI-04(04)",
                objectives: [
                    { id: "03.14.06.a.01[01]", text: "The system is monitored to detect attacks." },
                    { id: "03.14.06.a.01[02]", text: "The system is monitored to detect indicators of potential attacks." },
                    { id: "03.14.06.a.02", text: "The system is monitored to detect unauthorized connections." },
                    { id: "03.14.06.b", text: "Unauthorized use of the system is identified." },
                    { id: "03.14.06.c[01]", text: "Inbound communications traffic is monitored to detect unusual or unauthorized activities or conditions." },
                    { id: "03.14.06.c[02]", text: "Outbound communications traffic is monitored to detect unusual or unauthorized activities or conditions." }
                ]
            },
            // 03.14.07 Withdrawn — Incorporated into 03.14.06
            {
                id: "03.14.08", name: "Information Management and Retention",
                rev2Id: null, changeType: "new",
                description: "Manage and retain CUI within the system and CUI output from the system in accordance with applicable requirements.",
                sourceRef: "SI-12",
                objectives: [
                    { id: "03.14.08[01]", text: "CUI within the system is managed in accordance with applicable laws, Executive Orders, directives, regulations, policies, standards, guidelines, and operational requirements." },
                    { id: "03.14.08[02]", text: "CUI within the system is retained in accordance with applicable laws, Executive Orders, directives, regulations, policies, standards, guidelines, and operational requirements." },
                    { id: "03.14.08[03]", text: "CUI output from the system is managed in accordance with applicable laws, Executive Orders, directives, regulations, policies, standards, guidelines, and operational requirements." },
                    { id: "03.14.08[04]", text: "CUI output from the system is retained in accordance with applicable laws, Executive Orders, directives, regulations, policies, standards, guidelines, and operational requirements." }
                ]
            }
        ]
    }
];
