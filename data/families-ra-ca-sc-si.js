// NIST 800-171A - RA, CA, SC, SI families

const FAMILIES_RA_CA_SC_SI = [
    {
        id: "RA",
        name: "Risk Assessment",
        controls: [
            {
                id: "3.11.1", name: "Risk Assessment",
                description: "Periodically assess the risk to organizational operations, organizational assets, and individuals, resulting from the operation of organizational systems and the associated processing, storage, or transmission of CUI.",
                objectives: [
                    { id: "3.11.1[a]", text: "The frequency to assess risk to organizational operations, organizational assets, and individuals is defined." },
                    { id: "3.11.1[b]", text: "Risk to organizational operations, organizational assets, and individuals resulting from the operation of an organizational system that processes, stores, or transmits CUI is assessed with the defined frequency." }
                ]
            },
            {
                id: "3.11.2", name: "Vulnerability Scanning",
                description: "Scan for vulnerabilities in organizational systems and applications periodically and when new vulnerabilities affecting those systems and applications are identified.",
                objectives: [
                    { id: "3.11.2[a]", text: "The frequency to scan for vulnerabilities in organizational systems and applications is defined." },
                    { id: "3.11.2[b]", text: "Vulnerability scans are performed on organizational systems with the defined frequency." },
                    { id: "3.11.2[c]", text: "Vulnerability scans are performed on applications with the defined frequency." },
                    { id: "3.11.2[d]", text: "Vulnerability scans are performed on organizational systems when new vulnerabilities are identified." },
                    { id: "3.11.2[e]", text: "Vulnerability scans are performed on applications when new vulnerabilities are identified." }
                ]
            },
            {
                id: "3.11.3", name: "Vulnerability Remediation",
                description: "Remediate vulnerabilities in accordance with risk assessments.",
                objectives: [
                    { id: "3.11.3[a]", text: "Vulnerabilities are identified." },
                    { id: "3.11.3[b]", text: "Vulnerabilities are remediated in accordance with risk assessments." }
                ]
            }
        ]
    },
    {
        id: "CA",
        name: "Security Assessment",
        controls: [
            {
                id: "3.12.1", name: "Security Control Assessment",
                description: "Periodically assess the security controls in organizational systems to determine if the controls are effective in their application.",
                objectives: [
                    { id: "3.12.1[a]", text: "The frequency of security control assessments is defined." },
                    { id: "3.12.1[b]", text: "Security controls are assessed with the defined frequency to determine if the controls are effective in their application." }
                ]
            },
            {
                id: "3.12.2", name: "Plan of Action",
                description: "Develop and implement plans of action designed to correct deficiencies and reduce or eliminate vulnerabilities in organizational systems.",
                objectives: [
                    { id: "3.12.2[a]", text: "Deficiencies and vulnerabilities to be addressed by the plan of action are identified." },
                    { id: "3.12.2[b]", text: "A plan of action is developed to correct identified deficiencies and reduce or eliminate identified vulnerabilities." },
                    { id: "3.12.2[c]", text: "The plan of action is implemented to correct identified deficiencies and reduce or eliminate identified vulnerabilities." }
                ]
            },
            {
                id: "3.12.3", name: "Continuous Monitoring",
                description: "Monitor security controls on an ongoing basis to ensure the continued effectiveness of the controls.",
                objectives: [
                    { id: "3.12.3[a]", text: "Security controls are monitored on an ongoing basis to ensure the continued effectiveness of those controls." }
                ]
            },
            {
                id: "3.12.4", name: "System Security Plan",
                description: "Develop, document, and periodically update system security plans that describe system boundaries, system environments of operation, how security requirements are implemented, and the relationships with or connections to other systems.",
                objectives: [
                    { id: "3.12.4[a]", text: "A system security plan is developed." },
                    { id: "3.12.4[b]", text: "The system boundary is described and documented in the system security plan." },
                    { id: "3.12.4[c]", text: "The system environment of operation is described and documented in the system security plan." },
                    { id: "3.12.4[d]", text: "The security requirements identified and approved by the designated authority as non-applicable are identified." },
                    { id: "3.12.4[e]", text: "The method of security requirement implementation is described and documented in the system security plan." },
                    { id: "3.12.4[f]", text: "The relationship with or connection to other systems is described and documented in the system security plan." },
                    { id: "3.12.4[g]", text: "The frequency to update the system security plan is defined." },
                    { id: "3.12.4[h]", text: "The system security plan is updated with the defined frequency." }
                ]
            }
        ]
    },
    {
        id: "SC",
        name: "System and Communications Protection",
        controls: [
            {
                id: "3.13.1", name: "Boundary Protection",
                description: "Monitor, control, and protect communications at the external boundaries and key internal boundaries of organizational systems.",
                objectives: [
                    { id: "3.13.1[a]", text: "The external system boundary is defined." },
                    { id: "3.13.1[b]", text: "Key internal system boundaries are defined." },
                    { id: "3.13.1[c]", text: "Communications are monitored at the external system boundary." },
                    { id: "3.13.1[d]", text: "Communications are monitored at key internal boundaries." },
                    { id: "3.13.1[e]", text: "Communications are controlled at the external system boundary." },
                    { id: "3.13.1[f]", text: "Communications are controlled at key internal boundaries." },
                    { id: "3.13.1[g]", text: "Communications are protected at the external system boundary." },
                    { id: "3.13.1[h]", text: "Communications are protected at key internal boundaries." }
                ]
            },
            {
                id: "3.13.2", name: "Security Function Isolation",
                description: "Employ architectural designs, software development techniques, and systems engineering principles that promote effective information security within organizational systems.",
                objectives: [
                    { id: "3.13.2[a]", text: "Architectural designs that promote effective information security are identified." },
                    { id: "3.13.2[b]", text: "Software development techniques that promote effective information security are identified." },
                    { id: "3.13.2[c]", text: "Systems engineering principles that promote effective information security are identified." },
                    { id: "3.13.2[d]", text: "Identified architectural designs that promote effective information security are employed." },
                    { id: "3.13.2[e]", text: "Identified software development techniques that promote effective information security are employed." },
                    { id: "3.13.2[f]", text: "Identified systems engineering principles that promote effective information security are employed." }
                ]
            },
            {
                id: "3.13.3", name: "User/System Functionality Separation",
                description: "Separate user functionality from system management functionality.",
                objectives: [
                    { id: "3.13.3[a]", text: "User functionality is identified." },
                    { id: "3.13.3[b]", text: "System management functionality is identified." },
                    { id: "3.13.3[c]", text: "User functionality is separated from system management functionality." }
                ]
            },
            {
                id: "3.13.4", name: "Shared Resource Control",
                description: "Prevent unauthorized and unintended information transfer via shared system resources.",
                objectives: [
                    { id: "3.13.4[a]", text: "Unauthorized and unintended information transfer via shared system resources is prevented." }
                ]
            },
            {
                id: "3.13.5", name: "Publicly Accessible Subnetworks",
                description: "Implement subnetworks for publicly accessible system components that are physically or logically separated from internal networks.",
                objectives: [
                    { id: "3.13.5[a]", text: "Publicly accessible system components are identified." },
                    { id: "3.13.5[b]", text: "Subnetworks for publicly accessible system components are physically or logically separated from internal networks." }
                ]
            },
            {
                id: "3.13.6", name: "Network Communication by Exception",
                description: "Deny network communications traffic by default and allow network communications traffic by exception (i.e., deny all, permit by exception).",
                objectives: [
                    { id: "3.13.6[a]", text: "Network communications traffic is denied by default." },
                    { id: "3.13.6[b]", text: "Network communications traffic is allowed by exception." }
                ]
            },
            {
                id: "3.13.7", name: "Split Tunneling Prevention",
                description: "Prevent remote devices from simultaneously establishing non-remote connections with organizational systems and communicating via some other connection to resources in external networks (i.e., split tunneling).",
                objectives: [
                    { id: "3.13.7[a]", text: "Split tunneling is prevented in remote devices." }
                ]
            },
            {
                id: "3.13.8", name: "Data in Transit Encryption",
                description: "Implement cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission unless otherwise protected by alternative physical safeguards.",
                objectives: [
                    { id: "3.13.8[a]", text: "Cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission are identified." },
                    { id: "3.13.8[b]", text: "Alternative physical safeguards to prevent unauthorized disclosure of CUI during transmission are identified." },
                    { id: "3.13.8[c]", text: "Either cryptographic mechanisms or alternative physical safeguards are implemented to prevent unauthorized disclosure of CUI during transmission." }
                ]
            },
            {
                id: "3.13.9", name: "Network Connection Termination",
                description: "Terminate network connections associated with communications sessions at the end of the sessions or after a defined period of inactivity.",
                objectives: [
                    { id: "3.13.9[a]", text: "A period of inactivity to terminate network connections associated with communications sessions is defined." },
                    { id: "3.13.9[b]", text: "Network connections associated with communications sessions are terminated at the end of the sessions." },
                    { id: "3.13.9[c]", text: "Network connections associated with communications sessions are terminated after the defined period of inactivity." }
                ]
            },
            {
                id: "3.13.10", name: "Cryptographic Key Management",
                description: "Establish and manage cryptographic keys for cryptography employed in organizational systems.",
                objectives: [
                    { id: "3.13.10[a]", text: "Cryptographic keys are established for required cryptography employed in organizational systems." },
                    { id: "3.13.10[b]", text: "Cryptographic keys are managed for required cryptography employed in organizational systems." }
                ]
            },
            {
                id: "3.13.11", name: "FIPS-Validated Cryptography",
                description: "Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.",
                objectives: [
                    { id: "3.13.11[a]", text: "FIPS-validated cryptography is employed to protect the confidentiality of CUI." }
                ]
            },
            {
                id: "3.13.12", name: "Collaborative Device Control",
                description: "Prohibit remote activation of collaborative computing devices and provide indication of devices in use to users present at the device.",
                objectives: [
                    { id: "3.13.12[a]", text: "Collaborative computing devices are identified." },
                    { id: "3.13.12[b]", text: "Remote activation of collaborative computing devices is prohibited." },
                    { id: "3.13.12[c]", text: "An indication of devices in use is provided to users present at the device." }
                ]
            },
            {
                id: "3.13.13", name: "Mobile Code Control",
                description: "Control and monitor the use of mobile code.",
                objectives: [
                    { id: "3.13.13[a]", text: "Use of mobile code is controlled." },
                    { id: "3.13.13[b]", text: "Use of mobile code is monitored." }
                ]
            },
            {
                id: "3.13.14", name: "Voice over Internet Protocol",
                description: "Control and monitor the use of Voice over Internet Protocol (VoIP) technologies.",
                objectives: [
                    { id: "3.13.14[a]", text: "Use of VoIP technologies is controlled." },
                    { id: "3.13.14[b]", text: "Use of VoIP technologies is monitored." }
                ]
            },
            {
                id: "3.13.15", name: "Communications Authenticity",
                description: "Protect the authenticity of communications sessions.",
                objectives: [
                    { id: "3.13.15[a]", text: "The authenticity of communications sessions is protected." }
                ]
            },
            {
                id: "3.13.16", name: "Data at Rest Encryption",
                description: "Protect the confidentiality of CUI at rest.",
                objectives: [
                    { id: "3.13.16[a]", text: "The confidentiality of CUI at rest is protected." }
                ]
            }
        ]
    },
    {
        id: "SI",
        name: "System and Information Integrity",
        controls: [
            {
                id: "3.14.1", name: "Flaw Remediation",
                description: "Identify, report, and correct system flaws in a timely manner.",
                objectives: [
                    { id: "3.14.1[a]", text: "The time within which to identify system flaws is specified." },
                    { id: "3.14.1[b]", text: "System flaws are identified within the specified time frame." },
                    { id: "3.14.1[c]", text: "The time within which to report system flaws is specified." },
                    { id: "3.14.1[d]", text: "System flaws are reported within the specified time frame." },
                    { id: "3.14.1[e]", text: "The time within which to correct system flaws is specified." },
                    { id: "3.14.1[f]", text: "System flaws are corrected within the specified time frame." }
                ]
            },
            {
                id: "3.14.2", name: "Malicious Code Protection",
                description: "Provide protection from malicious code at designated locations within organizational systems.",
                objectives: [
                    { id: "3.14.2[a]", text: "Designated locations for malicious code protection are identified." },
                    { id: "3.14.2[b]", text: "Protection from malicious code at designated locations is provided." }
                ]
            },
            {
                id: "3.14.3", name: "Security Alerts and Advisories",
                description: "Monitor system security alerts and advisories and take action in response.",
                objectives: [
                    { id: "3.14.3[a]", text: "Response actions to system security alerts and advisories are identified." },
                    { id: "3.14.3[b]", text: "System security alerts and advisories are monitored." },
                    { id: "3.14.3[c]", text: "Actions in response to system security alerts and advisories are taken." }
                ]
            },
            {
                id: "3.14.4", name: "Malicious Code Updates",
                description: "Update malicious code protection mechanisms when new releases are available.",
                objectives: [
                    { id: "3.14.4[a]", text: "Malicious code protection mechanisms are updated when new releases are available." }
                ]
            },
            {
                id: "3.14.5", name: "System and File Scanning",
                description: "Perform periodic scans of organizational systems and real-time scans of files from external sources as files are downloaded, opened, or executed.",
                objectives: [
                    { id: "3.14.5[a]", text: "The frequency for malicious code scans is defined." },
                    { id: "3.14.5[b]", text: "Malicious code scans are performed with the defined frequency." },
                    { id: "3.14.5[c]", text: "Real-time malicious code scans of files from external sources as files are downloaded, opened, or executed are performed." }
                ]
            },
            {
                id: "3.14.6", name: "Inbound and Outbound Traffic Monitoring",
                description: "Monitor organizational systems, including inbound and outbound communications traffic, to detect attacks and indicators of potential attacks.",
                objectives: [
                    { id: "3.14.6[a]", text: "The system is monitored to detect attacks and indicators of potential attacks." },
                    { id: "3.14.6[b]", text: "Inbound communications traffic is monitored to detect attacks and indicators of potential attacks." },
                    { id: "3.14.6[c]", text: "Outbound communications traffic is monitored to detect attacks and indicators of potential attacks." }
                ]
            },
            {
                id: "3.14.7", name: "Unauthorized Use Detection",
                description: "Identify unauthorized use of organizational systems.",
                objectives: [
                    { id: "3.14.7[a]", text: "Authorized use of the system is defined." },
                    { id: "3.14.7[b]", text: "Unauthorized use of the system is identified." }
                ]
            }
        ]
    }
];
