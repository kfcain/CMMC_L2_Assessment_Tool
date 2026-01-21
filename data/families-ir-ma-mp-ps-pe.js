// NIST 800-171A - IR, MA, MP, PS, PE families

const FAMILIES_IR_MA_MP_PS_PE = [
    {
        id: "IR",
        name: "Incident Response",
        controls: [
            {
                id: "3.6.1", name: "Incident Handling Capability",
                description: "Establish an operational incident-handling capability for organizational systems that includes preparation, detection, analysis, containment, recovery, and user response activities.",
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
                id: "3.6.2", name: "Incident Tracking and Reporting",
                description: "Track, document, and report incidents to designated officials and/or authorities both internal and external to the organization.",
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
                id: "3.6.3", name: "Incident Response Testing",
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
                id: "3.7.1", name: "System Maintenance",
                description: "Perform maintenance on organizational systems.",
                objectives: [
                    { id: "3.7.1[a]", text: "System maintenance is performed." }
                ]
            },
            {
                id: "3.7.2", name: "System Maintenance Controls",
                description: "Provide controls on the tools, techniques, mechanisms, and personnel used to conduct system maintenance.",
                objectives: [
                    { id: "3.7.2[a]", text: "Tools used to conduct system maintenance are controlled." },
                    { id: "3.7.2[b]", text: "Techniques used to conduct system maintenance are controlled." },
                    { id: "3.7.2[c]", text: "Mechanisms used to conduct system maintenance are controlled." },
                    { id: "3.7.2[d]", text: "Personnel used to conduct system maintenance are controlled." }
                ]
            },
            {
                id: "3.7.3", name: "Equipment Sanitization",
                description: "Ensure equipment removed for off-site maintenance is sanitized of any CUI.",
                objectives: [
                    { id: "3.7.3[a]", text: "Equipment to be removed from organizational spaces for off-site maintenance is sanitized of any CUI." }
                ]
            },
            {
                id: "3.7.4", name: "Media Inspection",
                description: "Check media containing diagnostic and test programs for malicious code before the media are used in organizational systems.",
                objectives: [
                    { id: "3.7.4[a]", text: "Media containing diagnostic and test programs are checked for malicious code before being used in organizational systems." }
                ]
            },
            {
                id: "3.7.5", name: "Nonlocal Maintenance Authentication",
                description: "Require multifactor authentication to establish nonlocal maintenance sessions via external network connections and terminate such connections when nonlocal maintenance is complete.",
                objectives: [
                    { id: "3.7.5[a]", text: "Multifactor authentication is used to establish nonlocal maintenance sessions via external network connections." },
                    { id: "3.7.5[b]", text: "Nonlocal maintenance sessions established via external network connections are terminated when nonlocal maintenance is complete." }
                ]
            },
            {
                id: "3.7.6", name: "Maintenance Personnel Supervision",
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
                id: "3.8.1", name: "Media Protection",
                description: "Protect (i.e., physically control and securely store) system media containing CUI, both paper and digital.",
                objectives: [
                    { id: "3.8.1[a]", text: "Paper media containing CUI is physically controlled." },
                    { id: "3.8.1[b]", text: "Paper media containing CUI is securely stored." },
                    { id: "3.8.1[c]", text: "Digital media containing CUI is physically controlled." },
                    { id: "3.8.1[d]", text: "Digital media containing CUI is securely stored." }
                ]
            },
            {
                id: "3.8.2", name: "Media Access Limitation",
                description: "Limit access to CUI on system media to authorized users.",
                objectives: [
                    { id: "3.8.2[a]", text: "Access to CUI on system media is limited to authorized users." }
                ]
            },
            {
                id: "3.8.3", name: "Media Sanitization",
                description: "Sanitize or destroy system media containing CUI before disposal or release for reuse.",
                objectives: [
                    { id: "3.8.3[a]", text: "System media containing CUI is sanitized or destroyed before disposal." },
                    { id: "3.8.3[b]", text: "System media containing CUI is sanitized before it is released for reuse." }
                ]
            },
            {
                id: "3.8.4", name: "Media Marking",
                description: "Mark media with necessary CUI markings and distribution limitations.",
                objectives: [
                    { id: "3.8.4[a]", text: "Media containing CUI is marked with applicable CUI markings." },
                    { id: "3.8.4[b]", text: "Media containing CUI is marked with distribution limitations." }
                ]
            },
            {
                id: "3.8.5", name: "Media Accountability",
                description: "Control access to media containing CUI and maintain accountability for media during transport outside of controlled areas.",
                objectives: [
                    { id: "3.8.5[a]", text: "Access to media containing CUI is controlled." },
                    { id: "3.8.5[b]", text: "Accountability for media containing CUI is maintained during transport outside of controlled areas." }
                ]
            },
            {
                id: "3.8.6", name: "Portable Storage Encryption",
                description: "Implement cryptographic mechanisms to protect the confidentiality of CUI stored on digital media during transport unless otherwise protected by alternative physical safeguards.",
                objectives: [
                    { id: "3.8.6[a]", text: "The confidentiality of CUI stored on digital media is protected during transport using cryptographic mechanisms or alternative physical safeguards." }
                ]
            },
            {
                id: "3.8.7", name: "Removable Media Use",
                description: "Control the use of removable media on system components.",
                objectives: [
                    { id: "3.8.7[a]", text: "The use of removable media on system components is controlled." }
                ]
            },
            {
                id: "3.8.8", name: "Shared Media Prohibition",
                description: "Prohibit the use of portable storage devices when such devices have no identifiable owner.",
                objectives: [
                    { id: "3.8.8[a]", text: "The use of portable storage devices is prohibited when such devices have no identifiable owner." }
                ]
            },
            {
                id: "3.8.9", name: "Backup Storage Protection",
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
                id: "3.9.1", name: "Personnel Screening",
                description: "Screen individuals prior to authorizing access to organizational systems containing CUI.",
                objectives: [
                    { id: "3.9.1[a]", text: "Individuals are screened prior to authorizing access to organizational systems containing CUI." }
                ]
            },
            {
                id: "3.9.2", name: "Personnel Actions",
                description: "Ensure that organizational systems containing CUI are protected during and after personnel actions such as terminations and transfers.",
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
                id: "3.10.1", name: "Physical Access Authorizations",
                description: "Limit physical access to organizational systems, equipment, and the respective operating environments to authorized individuals.",
                objectives: [
                    { id: "3.10.1[a]", text: "Authorized individuals allowed physical access are identified." },
                    { id: "3.10.1[b]", text: "Physical access to organizational systems is limited to authorized individuals." },
                    { id: "3.10.1[c]", text: "Physical access to equipment is limited to authorized individuals." },
                    { id: "3.10.1[d]", text: "Physical access to operating environments is limited to authorized individuals." }
                ]
            },
            {
                id: "3.10.2", name: "Physical Access Controls",
                description: "Protect and monitor the physical facility and support infrastructure for organizational systems.",
                objectives: [
                    { id: "3.10.2[a]", text: "The physical facility where organizational systems reside is protected." },
                    { id: "3.10.2[b]", text: "The support infrastructure for organizational systems is protected." },
                    { id: "3.10.2[c]", text: "The physical facility where organizational systems reside is monitored." },
                    { id: "3.10.2[d]", text: "The support infrastructure for organizational systems is monitored." }
                ]
            },
            {
                id: "3.10.3", name: "Visitor Management",
                description: "Escort visitors and monitor visitor activity.",
                objectives: [
                    { id: "3.10.3[a]", text: "Visitors are escorted." },
                    { id: "3.10.3[b]", text: "Visitor activity is monitored." }
                ]
            },
            {
                id: "3.10.4", name: "Physical Access Logs",
                description: "Maintain audit logs of physical access.",
                objectives: [
                    { id: "3.10.4[a]", text: "Audit logs of physical access are maintained." }
                ]
            },
            {
                id: "3.10.5", name: "Physical Access Devices",
                description: "Control and manage physical access devices.",
                objectives: [
                    { id: "3.10.5[a]", text: "Physical access devices are identified." },
                    { id: "3.10.5[b]", text: "Physical access devices are controlled." },
                    { id: "3.10.5[c]", text: "Physical access devices are managed." }
                ]
            },
            {
                id: "3.10.6", name: "Alternate Work Sites",
                description: "Enforce safeguarding measures for CUI at alternate work sites.",
                objectives: [
                    { id: "3.10.6[a]", text: "Safeguarding measures for CUI are defined for alternate work sites." },
                    { id: "3.10.6[b]", text: "Safeguarding measures for CUI are enforced at alternate work sites." }
                ]
            }
        ]
    }
];
