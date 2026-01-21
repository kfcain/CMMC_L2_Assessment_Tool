// NIST 800-171A Additional Control Families (Part 2)

const CONTROL_FAMILIES_PART2 = [
    {
        id: "IR",
        name: "Incident Response",
        controls: [
            {
                id: "3.6.1",
                name: "Incident Handling Capability",
                description: "Establish an operational incident-handling capability for organizational systems.",
                objectives: [
                    { id: "3.6.1[a]", text: "An operational incident-handling capability is established." },
                    { id: "3.6.1[b]", text: "The incident-handling capability includes preparation." },
                    { id: "3.6.1[c]", text: "The incident-handling capability includes detection." },
                    { id: "3.6.1[d]", text: "The incident-handling capability includes analysis." },
                    { id: "3.6.1[e]", text: "The incident-handling capability includes containment." },
                    { id: "3.6.1[f]", text: "The incident-handling capability includes recovery." },
                    { id: "3.6.1[g]", text: "The incident-handling capability includes user response activities." }
                ]
            },
            {
                id: "3.6.2",
                name: "Incident Tracking and Reporting",
                description: "Track, document, and report incidents to designated officials and/or authorities.",
                objectives: [
                    { id: "3.6.2[a]", text: "Incidents are tracked." },
                    { id: "3.6.2[b]", text: "Incidents are documented." },
                    { id: "3.6.2[c]", text: "Authorities to whom incidents are to be reported are identified." },
                    { id: "3.6.2[d]", text: "Organizational officials to whom incidents are to be reported are identified." },
                    { id: "3.6.2[e]", text: "Identified authorities are notified of incidents." },
                    { id: "3.6.2[f]", text: "Identified organizational officials are notified of incidents." }
                ]
            },
            {
                id: "3.6.3",
                name: "Incident Response Testing",
                description: "Test the organizational incident response capability.",
                objectives: [
                    { id: "3.6.3[a]", text: "The incident response capability is tested." }
                ]
            }
        ]
    },
    {
        id: "MA",
        name: "Maintenance",
        controls: [
            {
                id: "3.7.1",
                name: "System Maintenance",
                description: "Perform maintenance on organizational systems.",
                objectives: [
                    { id: "3.7.1[a]", text: "System maintenance is performed." }
                ]
            },
            {
                id: "3.7.2",
                name: "System Maintenance Controls",
                description: "Provide controls on the tools, techniques, mechanisms, and personnel used to conduct system maintenance.",
                objectives: [
                    { id: "3.7.2[a]", text: "Tools used to conduct system maintenance are controlled." },
                    { id: "3.7.2[b]", text: "Techniques used to conduct system maintenance are controlled." },
                    { id: "3.7.2[c]", text: "Mechanisms used to conduct system maintenance are controlled." },
                    { id: "3.7.2[d]", text: "Personnel used to conduct system maintenance are controlled." }
                ]
            },
            {
                id: "3.7.3",
                name: "Equipment Sanitization",
                description: "Ensure equipment removed for off-site maintenance is sanitized of any CUI.",
                objectives: [
                    { id: "3.7.3[a]", text: "Equipment to be removed from organizational spaces for off-site maintenance is sanitized of any CUI." }
                ]
            },
            {
                id: "3.7.4",
                name: "Media Inspection",
                description: "Check media containing diagnostic and test programs for malicious code before use.",
                objectives: [
                    { id: "3.7.4[a]", text: "Media containing diagnostic and test programs are checked for malicious code before being used." }
                ]
            },
            {
                id: "3.7.5",
                name: "Nonlocal Maintenance Authentication",
                description: "Require multifactor authentication to establish nonlocal maintenance sessions.",
                objectives: [
                    { id: "3.7.5[a]", text: "Multifactor authentication is used to establish nonlocal maintenance sessions via external network connections." },
                    { id: "3.7.5[b]", text: "Nonlocal maintenance sessions established via external network connections are terminated when nonlocal maintenance is complete." }
                ]
            },
            {
                id: "3.7.6",
                name: "Maintenance Personnel Supervision",
                description: "Supervise the maintenance activities of maintenance personnel without required access authorization.",
                objectives: [
                    { id: "3.7.6[a]", text: "Maintenance personnel without required access authorization are supervised during maintenance activities." }
                ]
            }
        ]
    },
    {
        id: "MP",
        name: "Media Protection",
        controls: [
            {
                id: "3.8.1",
                name: "Media Protection",
                description: "Protect (i.e., physically control and securely store) system media containing CUI.",
                objectives: [
                    { id: "3.8.1[a]", text: "Paper media containing CUI is physically controlled." },
                    { id: "3.8.1[b]", text: "Paper media containing CUI is securely stored." },
                    { id: "3.8.1[c]", text: "Digital media containing CUI is physically controlled." },
                    { id: "3.8.1[d]", text: "Digital media containing CUI is securely stored." }
                ]
            },
            {
                id: "3.8.2",
                name: "Media Access Limitation",
                description: "Limit access to CUI on system media to authorized users.",
                objectives: [
                    { id: "3.8.2[a]", text: "Access to CUI on system media is limited to authorized users." }
                ]
            },
            {
                id: "3.8.3",
                name: "Media Sanitization",
                description: "Sanitize or destroy system media containing CUI before disposal or release for reuse.",
                objectives: [
                    { id: "3.8.3[a]", text: "System media containing CUI is sanitized or destroyed before disposal." },
                    { id: "3.8.3[b]", text: "System media containing CUI is sanitized before it is released for reuse." }
                ]
            },
            {
                id: "3.8.4",
                name: "Media Marking",
                description: "Mark media with necessary CUI markings and distribution limitations.",
                objectives: [
                    { id: "3.8.4[a]", text: "Media containing CUI is marked with applicable CUI markings." },
                    { id: "3.8.4[b]", text: "Media containing CUI is marked with distribution limitations." }
                ]
            },
            {
                id: "3.8.5",
                name: "Media Accountability",
                description: "Control access to media containing CUI and maintain accountability during transport.",
                objectives: [
                    { id: "3.8.5[a]", text: "Access to media containing CUI is controlled." },
                    { id: "3.8.5[b]", text: "Accountability for media containing CUI is maintained during transport outside of controlled areas." }
                ]
            },
            {
                id: "3.8.6",
                name: "Portable Storage Encryption",
                description: "Implement cryptographic mechanisms to protect CUI on digital media during transport.",
                objectives: [
                    { id: "3.8.6[a]", text: "The confidentiality of CUI stored on digital media is protected during transport using cryptographic mechanisms or alternative physical safeguards." }
                ]
            },
            {
                id: "3.8.7",
                name: "Removable Media Use",
                description: "Control the use of removable media on system components.",
                objectives: [
                    { id: "3.8.7[a]", text: "The use of removable media on system components is controlled." }
                ]
            },
            {
                id: "3.8.8",
                name: "Shared Media Prohibition",
                description: "Prohibit the use of portable storage devices when such devices have no identifiable owner.",
                objectives: [
                    { id: "3.8.8[a]", text: "The use of portable storage devices is prohibited when such devices have no identifiable owner." }
                ]
            },
            {
                id: "3.8.9",
                name: "Backup Storage Protection",
                description: "Protect the confidentiality of backup CUI at storage locations.",
                objectives: [
                    { id: "3.8.9[a]", text: "The confidentiality of backup CUI is protected at storage locations." }
                ]
            }
        ]
    },
    {
        id: "PS",
        name: "Personnel Security",
        controls: [
            {
                id: "3.9.1",
                name: "Personnel Screening",
                description: "Screen individuals prior to authorizing access to organizational systems containing CUI.",
                objectives: [
                    { id: "3.9.1[a]", text: "Individuals are screened prior to authorizing access to organizational systems containing CUI." }
                ]
            },
            {
                id: "3.9.2",
                name: "Personnel Actions",
                description: "Ensure that organizational systems containing CUI are protected during and after personnel actions.",
                objectives: [
                    { id: "3.9.2[a]", text: "A policy and/or process for terminating system access and any credentials coincident with personnel actions is established." },
                    { id: "3.9.2[b]", text: "System access and credentials are terminated consistent with personnel actions such as termination or transfer." },
                    { id: "3.9.2[c]", text: "The system is protected during and after personnel transfer actions." }
                ]
            }
        ]
    },
    {
        id: "PE",
        name: "Physical Protection",
        controls: [
            {
                id: "3.10.1",
                name: "Physical Access Authorizations",
                description: "Limit physical access to organizational systems, equipment, and the respective operating environments.",
                objectives: [
                    { id: "3.10.1[a]", text: "Authorized individuals allowed physical access are identified." },
                    { id: "3.10.1[b]", text: "Physical access to organizational systems is limited to authorized individuals." },
                    { id: "3.10.1[c]", text: "Physical access to equipment is limited to authorized individuals." },
                    { id: "3.10.1[d]", text: "Physical access to operating environments is limited to authorized individuals." }
                ]
            },
            {
                id: "3.10.2",
                name: "Physical Access Controls",
                description: "Protect and monitor the physical facility and support infrastructure for organizational systems.",
                objectives: [
                    { id: "3.10.2[a]", text: "The physical facility where organizational systems reside is protected." },
                    { id: "3.10.2[b]", text: "The support infrastructure for organizational systems is protected." },
                    { id: "3.10.2[c]", text: "The physical facility where organizational systems reside is monitored." },
                    { id: "3.10.2[d]", text: "The support infrastructure for organizational systems is monitored." }
                ]
            },
            {
                id: "3.10.3",
                name: "Visitor Management",
                description: "Escort visitors and monitor visitor activity.",
                objectives: [
                    { id: "3.10.3[a]", text: "Visitors are escorted." },
                    { id: "3.10.3[b]", text: "Visitor activity is monitored." }
                ]
            },
            {
                id: "3.10.4",
                name: "Physical Access Logs",
                description: "Maintain audit logs of physical access.",
                objectives: [
                    { id: "3.10.4[a]", text: "Audit logs of physical access are maintained." }
                ]
            },
            {
                id: "3.10.5",
                name: "Physical Access Devices",
                description: "Control and manage physical access devices.",
                objectives: [
                    { id: "3.10.5[a]", text: "Physical access devices are identified." },
                    { id: "3.10.5[b]", text: "Physical access devices are controlled." },
                    { id: "3.10.5[c]", text: "Physical access devices are managed." }
                ]
            },
            {
                id: "3.10.6",
                name: "Alternate Work Sites",
                description: "Enforce safeguarding measures for CUI at alternate work sites.",
                objectives: [
                    { id: "3.10.6[a]", text: "Safeguarding measures for CUI are defined for alternate work sites." },
                    { id: "3.10.6[b]", text: "Safeguarding measures for CUI are enforced at alternate work sites." }
                ]
            }
        ]
    },
    {
        id: "RA",
        name: "Risk Assessment",
        controls: [
            {
                id: "3.11.1",
                name: "Risk Assessment",
                description: "Periodically assess the risk to organizational operations, assets, and individuals.",
                objectives: [
                    { id: "3.11.1[a]", text: "The frequency to assess risk to organizational operations, assets, and individuals is defined." },
                    { id: "3.11.1[b]", text: "Risk to organizational operations, assets, and individuals is assessed with the defined frequency." }
                ]
            },
            {
                id: "3.11.2",
                name: "Vulnerability Scanning",
                description: "Scan for vulnerabilities in organizational systems and applications periodically.",
                objectives: [
                    { id: "3.11.2[a]", text: "The frequency to scan for vulnerabilities in organizational systems and applications is defined." },
                    { id: "3.11.2[b]", text: "Vulnerability scans are performed on organizational systems with the defined frequency." },
                    { id: "3.11.2[c]", text: "Vulnerability scans are performed on applications with the defined frequency." },
                    { id: "3.11.2[d]", text: "Vulnerability scans are performed when new vulnerabilities are identified." }
                ]
            },
            {
                id: "3.11.3",
                name: "Vulnerability Remediation",
                description: "Remediate vulnerabilities in accordance with risk assessments.",
                objectives: [
                    { id: "3.11.3[a]", text: "Vulnerabilities are remediated in accordance with risk assessments." }
                ]
            }
        ]
    },
    {
        id: "CA",
        name: "Security Assessment",
        controls: [
            {
                id: "3.12.1",
                name: "Security Control Assessment",
                description: "Periodically assess the security controls in organizational systems to determine effectiveness.",
                objectives: [
                    { id: "3.12.1[a]", text: "The frequency of security control assessments is defined." },
                    { id: "3.12.1[b]", text: "Security controls are assessed with the defined frequency to determine if the controls are effective." }
                ]
            },
            {
                id: "3.12.2",
                name: "Plan of Action",
                description: "Develop and implement plans of action designed to correct deficiencies and reduce or eliminate vulnerabilities.",
                objectives: [
                    { id: "3.12.2[a]", text: "Deficiencies and vulnerabilities to be addressed by the plan of action are identified." },
                    { id: "3.12.2[b]", text: "A plan of action is developed to correct identified deficiencies and reduce or eliminate identified vulnerabilities." },
                    { id: "3.12.2[c]", text: "The plan of action is implemented to correct identified deficiencies and reduce or eliminate identified vulnerabilities." }
                ]
            },
            {
                id: "3.12.3",
                name: "Continuous Monitoring",
                description: "Monitor security controls on an ongoing basis to ensure continued effectiveness.",
                objectives: [
                    { id: "3.12.3[a]", text: "Security controls are monitored on an ongoing basis to ensure the continued effectiveness of those controls." }
                ]
            },
            {
                id: "3.12.4",
                name: "System Security Plan",
                description: "Develop, document, and periodically update system security plans.",
                objectives: [
                    { id: "3.12.4[a]", text: "A system security plan is developed." },
                    { id: "3.12.4[b]", text: "The system boundary is described and documented in the system security plan." },
                    { id: "3.12.4[c]", text: "The system environment of operation is described and documented in the system security plan." },
                    { id: "3.12.4[d]", text: "The way security requirements are implemented is described and documented in the system security plan." },
                    { id: "3.12.4[e]", text: "The relationships with or connections to other systems are described and documented in the system security plan." },
                    { id: "3.12.4[f]", text: "The frequency to update the system security plan is defined." },
                    { id: "3.12.4[g]", text: "The system security plan is updated with the defined frequency." }
                ]
            }
        ]
    },
    {
        id: "SC",
        name: "System and Communications Protection",
        controls: [
            {
                id: "3.13.1",
                name: "Boundary Protection",
                description: "Monitor, control, and protect communications at external and key internal boundaries.",
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
                id: "3.13.2",
                name: "Security Function Isolation",
                description: "Employ architectural designs, software development techniques, and systems engineering principles that promote effective information security.",
                objectives: [
                    { id: "3.13.2[a]", text: "Architectural designs that promote effective information security are identified and employed." },
                    { id: "3.13.2[b]", text: "Software development techniques that promote effective information security are identified and employed." },
                    { id: "3.13.2[c]", text: "Systems engineering principles that promote effective information security are identified and employed." }
                ]
            },
            {
                id: "3.13.3",
                name: "User/System Functionality Separation",
                description: "Separate user functionality from system management functionality.",
                objectives: [
                    { id: "3.13.3[a]", text: "User functionality is identified." },
                    { id: "3.13.3[b]", text: "System management functionality is identified." },
                    { id: "3.13.3[c]", text: "User functionality is separated from system management functionality." }
                ]
            },
            {
                id: "3.13.4",
                name: "Shared Resource Control",
                description: "Prevent unauthorized and unintended information transfer via shared system resources.",
                objectives: [
                    { id: "3.13.4[a]", text: "Unauthorized and unintended information transfer via shared system resources is prevented." }
                ]
            },
            {
                id: "3.13.5",
                name: "Publicly Accessible Subnetworks",
                description: "Implement subnetworks for publicly accessible system components that are physically or logically separated.",
                objectives: [
                    { id: "3.13.5[a]", text: "Publicly accessible system components are identified." },
                    { id: "3.13.5[b]", text: "Subnetworks for publicly accessible system components are physically or logically separated from internal networks." }
                ]
            },
            {
                id: "3.13.6",
                name: "Network Communication by Exception",
                description: "Deny network communications traffic by default and allow by exception.",
                objectives: [
                    { id: "3.13.6[a]", text: "Network communications traffic is denied by default." },
                    { id: "3.13.6[b]", text: "Network communications traffic is allowed by exception." }
                ]
            },
            {
                id: "3.13.7",
                name: "Split Tunneling Prevention",
                description: "Prevent remote devices from simultaneously establishing non-remote connections with organizational systems and other external networks.",
                objectives: [
                    { id: "3.13.7[a]", text: "Split tunneling is prevented in remote devices." }
                ]
            },
            {
                id: "3.13.8",
                name: "Data in Transit Encryption",
                description: "Implement cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission.",
                objectives: [
                    { id: "3.13.8[a]", text: "Cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission are identified." },
                    { id: "3.13.8[b]", text: "Cryptographic mechanisms or alternative physical safeguards are implemented to prevent unauthorized disclosure of CUI during transmission." }
                ]
            },
            {
                id: "3.13.9",
                name: "Network Connection Termination",
                description: "Terminate network connections associated with communications sessions at the end of the sessions or after a defined period of inactivity.",
                objectives: [
                    { id: "3.13.9[a]", text: "A period of inactivity to terminate network connections is defined." },
                    { id: "3.13.9[b]", text: "Network connections are terminated at the end of the sessions or after the defined period of inactivity." }
                ]
            },
            {
                id: "3.13.10",
                name: "Cryptographic Key Management",
                description: "Establish and manage cryptographic keys for cryptography employed in organizational systems.",
                objectives: [
                    { id: "3.13.10[a]", text: "Cryptographic keys are established for required cryptography employed in organizational systems." },
                    { id: "3.13.10[b]", text: "Cryptographic keys are managed for required cryptography employed in organizational systems." }
                ]
            },
            {
                id: "3.13.11",
                name: "FIPS-Validated Cryptography",
                description: "Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.",
                objectives: [
                    { id: "3.13.11[a]", text: "FIPS-validated cryptography is employed to protect the confidentiality of CUI." }
                ]
            },
            {
                id: "3.13.12",
                name: "Collaborative Device Control",
                description: "Prohibit remote activation of collaborative computing devices and provide indication of devices in use.",
                objectives: [
                    { id: "3.13.12[a]", text: "Collaborative computing devices are identified." },
                    { id: "3.13.12[b]", text: "Remote activation of collaborative computing devices is prohibited." },
                    { id: "3.13.12[c]", text: "An indication of devices in use is provided to users present at the device." }
                ]
            },
            {
                id: "3.13.13",
                name: "Mobile Code Control",
                description: "Control and monitor the use of mobile code.",
                objectives: [
                    { id: "3.13.13[a]", text: "Use of mobile code is controlled." },
                    { id: "3.13.13[b]", text: "Use of mobile code is monitored." }
                ]
            },
            {
                id: "3.13.14",
                name: "Voice over Internet Protocol",
                description: "Control and monitor the use of Voice over Internet Protocol (VoIP) technologies.",
                objectives: [
                    { id: "3.13.14[a]", text: "Use of VoIP technologies is controlled." },
                    { id: "3.13.14[b]", text: "Use of VoIP technologies is monitored." }
                ]
            },
            {
                id: "3.13.15",
                name: "Communications Authenticity",
                description: "Protect the authenticity of communications sessions.",
                objectives: [
                    { id: "3.13.15[a]", text: "The authenticity of communications sessions is protected." }
                ]
            },
            {
                id: "3.13.16",
                name: "Data at Rest Encryption",
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
                id: "3.14.1",
                name: "Flaw Remediation",
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
                id: "3.14.2",
                name: "Malicious Code Protection",
                description: "Provide protection from malicious code at designated locations within organizational systems.",
                objectives: [
                    { id: "3.14.2[a]", text: "Designated locations for malicious code protection are identified." },
                    { id: "3.14.2[b]", text: "Protection from malicious code at designated locations is provided." }
                ]
            },
            {
                id: "3.14.3",
                name: "Security Alerts and Advisories",
                description: "Monitor system security alerts and advisories and take action in response.",
                objectives: [
                    { id: "3.14.3[a]", text: "System security alerts and advisories are monitored." },
                    { id: "3.14.3[b]", text: "Actions in response to system security alerts and advisories are taken." }
                ]
            },
            {
                id: "3.14.4",
                name: "Malicious Code Updates",
                description: "Update malicious code protection mechanisms when new releases are available.",
                objectives: [
                    { id: "3.14.4[a]", text: "Malicious code protection mechanisms are updated when new releases are available." }
                ]
            },
            {
                id: "3.14.5",
                name: "System and File Scanning",
                description: "Perform periodic scans of organizational systems and real-time scans of files from external sources.",
                objectives: [
                    { id: "3.14.5[a]", text: "The frequency for malicious code scans is defined." },
                    { id: "3.14.5[b]", text: "Malicious code scans are performed with the defined frequency." },
                    { id: "3.14.5[c]", text: "Real-time malicious code scans of files from external sources as files are downloaded, opened, or executed are performed." }
                ]
            },
            {
                id: "3.14.6",
                name: "Inbound and Outbound Traffic Monitoring",
                description: "Monitor organizational systems, including inbound and outbound communications traffic, to detect attacks and indicators of potential attacks.",
                objectives: [
                    { id: "3.14.6[a]", text: "The system is monitored to detect attacks and indicators of potential attacks." },
                    { id: "3.14.6[b]", text: "Inbound communications traffic is monitored to detect attacks and indicators of potential attacks." },
                    { id: "3.14.6[c]", text: "Outbound communications traffic is monitored to detect attacks and indicators of potential attacks." }
                ]
            },
            {
                id: "3.14.7",
                name: "Unauthorized Use Detection",
                description: "Identify unauthorized use of organizational systems.",
                objectives: [
                    { id: "3.14.7[a]", text: "Unauthorized use of the system is identified." }
                ]
            }
        ]
    }
];

// Merge both parts
CONTROL_FAMILIES.push(...CONTROL_FAMILIES_PART2);
