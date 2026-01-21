// NIST 800-171A - Access Control, Awareness/Training, Audit (AC, AT, AU)

const FAMILIES_AC_AT_AU = [
    {
        id: "AC",
        name: "Access Control",
        controls: [
            {
                id: "3.1.1", name: "Authorized Access Control",
                description: "Limit system access to authorized users, processes acting on behalf of authorized users, and devices.",
                objectives: [
                    { id: "3.1.1[a]", text: "Authorized users are identified." },
                    { id: "3.1.1[b]", text: "Processes acting on behalf of authorized users are identified." },
                    { id: "3.1.1[c]", text: "Devices (and other systems) authorized to connect to the system are identified." },
                    { id: "3.1.1[d]", text: "System access is limited to authorized users." },
                    { id: "3.1.1[e]", text: "System access is limited to processes acting on behalf of authorized users." },
                    { id: "3.1.1[f]", text: "System access is limited to authorized devices (including other systems)." }
                ]
            },
            {
                id: "3.1.2", name: "Transaction & Function Access Control",
                description: "Limit system access to the types of transactions and functions that authorized users are permitted to execute.",
                objectives: [
                    { id: "3.1.2[a]", text: "The types of transactions and functions that authorized users are permitted to execute are defined." },
                    { id: "3.1.2[b]", text: "System access is limited to the defined types of transactions and functions for authorized users." }
                ]
            },
            {
                id: "3.1.3", name: "CUI Flow Control",
                description: "Control the flow of CUI in accordance with approved authorizations.",
                objectives: [
                    { id: "3.1.3[a]", text: "Information flow control policies are defined." },
                    { id: "3.1.3[b]", text: "Methods and enforcement mechanisms for controlling the flow of CUI are defined." },
                    { id: "3.1.3[c]", text: "Designated sources and destinations for CUI within the system and between interconnected systems are identified." },
                    { id: "3.1.3[d]", text: "Authorizations for controlling the flow of CUI are defined." },
                    { id: "3.1.3[e]", text: "Approved authorizations for controlling the flow of CUI are enforced." }
                ]
            },
            {
                id: "3.1.4", name: "Separation of Duties",
                description: "Separate the duties of individuals to reduce the risk of malevolent activity without collusion.",
                objectives: [
                    { id: "3.1.4[a]", text: "The duties of individuals requiring separation are defined." },
                    { id: "3.1.4[b]", text: "Responsibilities for duties that require separation are assigned to separate individuals." },
                    { id: "3.1.4[c]", text: "Access privileges that enable individuals to exercise the duties that require separation are granted to separate individuals." }
                ]
            },
            {
                id: "3.1.5", name: "Least Privilege",
                description: "Employ the principle of least privilege, including for specific security functions and privileged accounts.",
                objectives: [
                    { id: "3.1.5[a]", text: "Privileged accounts are identified." },
                    { id: "3.1.5[b]", text: "Access to privileged accounts is authorized in accordance with the principle of least privilege." },
                    { id: "3.1.5[c]", text: "Security functions are identified." },
                    { id: "3.1.5[d]", text: "Access to security functions is authorized in accordance with the principle of least privilege." }
                ]
            },
            {
                id: "3.1.6", name: "Non-Privileged Account Use",
                description: "Use non-privileged accounts or roles when accessing nonsecurity functions.",
                objectives: [
                    { id: "3.1.6[a]", text: "Nonsecurity functions are identified." },
                    { id: "3.1.6[b]", text: "Users are required to use non-privileged accounts or roles when accessing nonsecurity functions." }
                ]
            },
            {
                id: "3.1.7", name: "Privileged Function Control",
                description: "Prevent non-privileged users from executing privileged functions and capture the execution of such functions in audit logs.",
                objectives: [
                    { id: "3.1.7[a]", text: "Privileged functions are defined." },
                    { id: "3.1.7[b]", text: "Non-privileged users are defined." },
                    { id: "3.1.7[c]", text: "Non-privileged users are prevented from executing privileged functions." },
                    { id: "3.1.7[d]", text: "The execution of privileged functions is captured in audit logs." }
                ]
            },
            {
                id: "3.1.8", name: "Unsuccessful Logon Attempts",
                description: "Limit unsuccessful logon attempts.",
                objectives: [
                    { id: "3.1.8[a]", text: "The means of limiting unsuccessful logon attempts is defined." },
                    { id: "3.1.8[b]", text: "The defined means of limiting unsuccessful logon attempts is implemented." }
                ]
            },
            {
                id: "3.1.9", name: "Privacy & Security Notices",
                description: "Provide privacy and security notices consistent with applicable CUI rules.",
                objectives: [
                    { id: "3.1.9[a]", text: "Privacy and security notices required by CUI-specified rules are identified, consistent, and associated with the specific CUI category." },
                    { id: "3.1.9[b]", text: "Privacy and security notices are displayed." }
                ]
            },
            {
                id: "3.1.10", name: "Session Lock",
                description: "Use session lock with pattern-hiding displays to prevent access and viewing of data after a period of inactivity.",
                objectives: [
                    { id: "3.1.10[a]", text: "The period of inactivity after which the system initiates a session lock is defined." },
                    { id: "3.1.10[b]", text: "Access to the system and viewing of data is prevented by initiating a session lock after the defined period of inactivity." },
                    { id: "3.1.10[c]", text: "Previously visible information is concealed via a pattern-hiding display after the defined period of inactivity." }
                ]
            },
            {
                id: "3.1.11", name: "Session Termination",
                description: "Terminate (automatically) a user session after a defined condition.",
                objectives: [
                    { id: "3.1.11[a]", text: "Conditions requiring a user session to terminate are defined." },
                    { id: "3.1.11[b]", text: "A user session is automatically terminated after any of the defined conditions occur." }
                ]
            },
            {
                id: "3.1.12", name: "Remote Access Control",
                description: "Monitor and control remote access sessions.",
                objectives: [
                    { id: "3.1.12[a]", text: "Remote access sessions are permitted." },
                    { id: "3.1.12[b]", text: "The types of permitted remote access are identified." },
                    { id: "3.1.12[c]", text: "Remote access sessions are controlled." },
                    { id: "3.1.12[d]", text: "Remote access sessions are monitored." }
                ]
            },
            {
                id: "3.1.13", name: "Remote Access Cryptography",
                description: "Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.",
                objectives: [
                    { id: "3.1.13[a]", text: "Cryptographic mechanisms to protect the confidentiality of remote access sessions are identified." },
                    { id: "3.1.13[b]", text: "Cryptographic mechanisms to protect the confidentiality of remote access sessions are implemented." }
                ]
            },
            {
                id: "3.1.14", name: "Remote Access Routing",
                description: "Route remote access via managed access control points.",
                objectives: [
                    { id: "3.1.14[a]", text: "Managed access control points are identified and implemented." },
                    { id: "3.1.14[b]", text: "Remote access is routed through managed network access control points." }
                ]
            },
            {
                id: "3.1.15", name: "Privileged Remote Access Authorization",
                description: "Authorize remote execution of privileged commands and remote access to security-relevant information.",
                objectives: [
                    { id: "3.1.15[a]", text: "Privileged commands authorized for remote execution are identified." },
                    { id: "3.1.15[b]", text: "Security-relevant information authorized to be accessed remotely is identified." },
                    { id: "3.1.15[c]", text: "The remote execution of the identified privileged commands is authorized." },
                    { id: "3.1.15[d]", text: "Remote access to the identified security-relevant information is authorized." }
                ]
            },
            {
                id: "3.1.16", name: "Wireless Access Authorization",
                description: "Authorize wireless access prior to allowing such connections.",
                objectives: [
                    { id: "3.1.16[a]", text: "Wireless access points are identified." },
                    { id: "3.1.16[b]", text: "Wireless access is authorized prior to allowing such connections." }
                ]
            },
            {
                id: "3.1.17", name: "Wireless Access Protection",
                description: "Protect wireless access using authentication and encryption.",
                objectives: [
                    { id: "3.1.17[a]", text: "Wireless access to the system is protected using authentication." },
                    { id: "3.1.17[b]", text: "Wireless access to the system is protected using encryption." }
                ]
            },
            {
                id: "3.1.18", name: "Mobile Device Connection Control",
                description: "Control connection of mobile devices.",
                objectives: [
                    { id: "3.1.18[a]", text: "Mobile devices that process, store, or transmit CUI are identified." },
                    { id: "3.1.18[b]", text: "Mobile device connections are authorized." },
                    { id: "3.1.18[c]", text: "Mobile device connections are monitored and logged." }
                ]
            },
            {
                id: "3.1.19", name: "Mobile Device CUI Encryption",
                description: "Encrypt CUI on mobile devices and mobile computing platforms.",
                objectives: [
                    { id: "3.1.19[a]", text: "Mobile devices and mobile computing platforms that process, store, or transmit CUI are identified." },
                    { id: "3.1.19[b]", text: "Encryption is employed to protect CUI on identified mobile devices and mobile computing platforms." }
                ]
            },
            {
                id: "3.1.20", name: "External System Connections",
                description: "Verify and control/limit connections to and use of external systems.",
                objectives: [
                    { id: "3.1.20[a]", text: "Connections to external systems are identified." },
                    { id: "3.1.20[b]", text: "The use of external systems is identified." },
                    { id: "3.1.20[c]", text: "Connections to external systems are verified." },
                    { id: "3.1.20[d]", text: "Connections to external systems are controlled/limited." },
                    { id: "3.1.20[e]", text: "Use of external systems is verified." },
                    { id: "3.1.20[f]", text: "Use of external systems is controlled/limited." }
                ]
            },
            {
                id: "3.1.21", name: "Portable Storage Use",
                description: "Limit use of portable storage devices on external systems.",
                objectives: [
                    { id: "3.1.21[a]", text: "The use of portable storage devices containing CUI on external systems is identified and documented." },
                    { id: "3.1.21[b]", text: "Limits on the use of portable storage devices containing CUI on external systems are defined." },
                    { id: "3.1.21[c]", text: "Use of portable storage devices containing CUI on external systems is limited as defined." }
                ]
            },
            {
                id: "3.1.22", name: "Publicly Accessible Content Control",
                description: "Control CUI posted or processed on publicly accessible systems.",
                objectives: [
                    { id: "3.1.22[a]", text: "Individuals authorized to post or process information on publicly accessible systems are identified." },
                    { id: "3.1.22[b]", text: "Procedures to ensure CUI is not posted or processed on publicly accessible systems are identified." },
                    { id: "3.1.22[c]", text: "A review process is in place prior to posting of any content to publicly accessible systems." },
                    { id: "3.1.22[d]", text: "Content on publicly accessible systems is reviewed to ensure that it does not include CUI." }
                ]
            }
        ]
    },
    {
        id: "AT",
        name: "Awareness and Training",
        controls: [
            {
                id: "3.2.1", name: "Security Awareness",
                description: "Ensure that managers, systems administrators, and users are made aware of the security risks and applicable policies.",
                objectives: [
                    { id: "3.2.1[a]", text: "Security risks associated with organizational activities involving CUI are identified." },
                    { id: "3.2.1[b]", text: "Policies, standards, and procedures related to the security of the system are identified." },
                    { id: "3.2.1[c]", text: "Managers, systems administrators, and users of the system are made aware of the security risks associated with their activities." },
                    { id: "3.2.1[d]", text: "Managers, systems administrators, and users of the system are made aware of the applicable policies, standards, and procedures related to the security of the system." }
                ]
            },
            {
                id: "3.2.2", name: "Role-Based Security Training",
                description: "Ensure that personnel are trained to carry out their assigned information security-related duties and responsibilities.",
                objectives: [
                    { id: "3.2.2[a]", text: "Information security-related duties, roles, and responsibilities are defined." },
                    { id: "3.2.2[b]", text: "Information security-related duties, roles, and responsibilities are assigned to designated personnel." },
                    { id: "3.2.2[c]", text: "Personnel are adequately trained to carry out their assigned information security-related duties, roles, and responsibilities." }
                ]
            },
            {
                id: "3.2.3", name: "Insider Threat Awareness",
                description: "Provide security awareness training on recognizing and reporting potential indicators of insider threat.",
                objectives: [
                    { id: "3.2.3[a]", text: "Potential indicators associated with insider threats are identified." },
                    { id: "3.2.3[b]", text: "Security awareness training on recognizing and reporting potential indicators of insider threat is provided to managers and employees." }
                ]
            }
        ]
    },
    {
        id: "AU",
        name: "Audit and Accountability",
        controls: [
            {
                id: "3.3.1", name: "System Auditing",
                description: "Create and retain system audit logs and records to enable monitoring, analysis, investigation, and reporting.",
                objectives: [
                    { id: "3.3.1[a]", text: "Audit logs needed (i.e., event types to be logged) to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity are specified." },
                    { id: "3.3.1[b]", text: "The content of audit records needed to support monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity is defined." },
                    { id: "3.3.1[c]", text: "Audit records are created (generated)." },
                    { id: "3.3.1[d]", text: "Audit records, once created, contain the defined content." },
                    { id: "3.3.1[e]", text: "Retention requirements for audit records are defined." },
                    { id: "3.3.1[f]", text: "Audit records are retained as defined." }
                ]
            },
            {
                id: "3.3.2", name: "User Accountability",
                description: "Ensure that the actions of individual system users can be uniquely traced to those users.",
                objectives: [
                    { id: "3.3.2[a]", text: "The content of the audit records needed to support the ability to uniquely trace users to their actions is defined." },
                    { id: "3.3.2[b]", text: "Audit records, once created, contain the defined content." }
                ]
            },
            {
                id: "3.3.3", name: "Audit Review and Analysis",
                description: "Review and update logged events.",
                objectives: [
                    { id: "3.3.3[a]", text: "A process for determining when to review logged events is defined." },
                    { id: "3.3.3[b]", text: "Event types being logged are reviewed in accordance with the defined review process." },
                    { id: "3.3.3[c]", text: "Event types being logged are updated based on the review." }
                ]
            },
            {
                id: "3.3.4", name: "Audit Failure Alerting",
                description: "Alert in the event of an audit logging process failure.",
                objectives: [
                    { id: "3.3.4[a]", text: "Personnel or roles to be alerted in the event of an audit logging process failure are identified." },
                    { id: "3.3.4[b]", text: "Types of audit logging process failures for which alert will be generated are defined." },
                    { id: "3.3.4[c]", text: "Identified personnel or roles are alerted in the event of an audit logging process failure." }
                ]
            },
            {
                id: "3.3.5", name: "Audit Record Correlation",
                description: "Correlate audit record review, analysis, and reporting processes for investigation and response.",
                objectives: [
                    { id: "3.3.5[a]", text: "Audit record review, analysis, and reporting processes for investigation and response to indications of unlawful, unauthorized, suspicious, or unusual activity are defined." },
                    { id: "3.3.5[b]", text: "Defined audit record review, analysis, and reporting processes are correlated." }
                ]
            },
            {
                id: "3.3.6", name: "Audit Reduction and Reporting",
                description: "Provide audit record reduction and report generation to support on-demand analysis and reporting.",
                objectives: [
                    { id: "3.3.6[a]", text: "An audit record reduction capability that supports on-demand analysis is provided." },
                    { id: "3.3.6[b]", text: "A report generation capability that supports on-demand reporting is provided." }
                ]
            },
            {
                id: "3.3.7", name: "Authoritative Time Source",
                description: "Provide a system capability that compares and synchronizes internal system clocks with an authoritative source.",
                objectives: [
                    { id: "3.3.7[a]", text: "Internal system clocks are used to generate time stamps for audit records." },
                    { id: "3.3.7[b]", text: "An authoritative time source is specified." },
                    { id: "3.3.7[c]", text: "Internal system clocks used to generate time stamps for audit records are compared to and synchronized with the specified authoritative time source." }
                ]
            },
            {
                id: "3.3.8", name: "Audit Information Protection",
                description: "Protect audit information and audit logging tools from unauthorized access, modification, and deletion.",
                objectives: [
                    { id: "3.3.8[a]", text: "Audit information is protected from unauthorized access." },
                    { id: "3.3.8[b]", text: "Audit information is protected from unauthorized modification." },
                    { id: "3.3.8[c]", text: "Audit information is protected from unauthorized deletion." },
                    { id: "3.3.8[d]", text: "Audit logging tools are protected from unauthorized access." },
                    { id: "3.3.8[e]", text: "Audit logging tools are protected from unauthorized modification." },
                    { id: "3.3.8[f]", text: "Audit logging tools are protected from unauthorized deletion." }
                ]
            },
            {
                id: "3.3.9", name: "Audit Management Limitation",
                description: "Limit management of audit logging functionality to a subset of privileged users.",
                objectives: [
                    { id: "3.3.9[a]", text: "A subset of privileged users granted access to manage audit logging functionality is defined." },
                    { id: "3.3.9[b]", text: "Management of audit logging functionality is limited to the defined subset of privileged users." }
                ]
            }
        ]
    }
];
