// NIST SP 800-171A Rev 3 - Access Control, Awareness/Training, Audit (AC, AT, AU)
// Based on NIST SP 800-171A Revision 3 (November 2024) — Official assessment objectives
// Uses Rev 3 numbering format: 03.XX.YY
// Objective IDs match official NIST SP 800-171Ar3 publication exactly

const FAMILIES_R3_AC_AT_AU = [
    {
        id: "AC",
        name: "Access Control",
        controls: [
            {
                id: "03.01.01", name: "Account Management",
                rev2Id: "3.1.1", changeType: "enhanced",
                description: "Manage system accounts, including establishing, activating, modifying, reviewing, disabling, and removing accounts.",
                sourceRef: "AC-02, AC-02(03), AC-02(05), AC-02(13)",
                odps: ["Time period for account inactivity", "Notification time periods", "Logout time period", "Logout circumstances"],
                objectives: [
                    { id: "03.01.01.a[01]", text: "System account types allowed are defined." },
                    { id: "03.01.01.a[02]", text: "System account types prohibited are defined." },
                    { id: "03.01.01.b[01]", text: "System accounts are created in accordance with organizational policy, procedures, prerequisites, and criteria." },
                    { id: "03.01.01.b[02]", text: "System accounts are enabled in accordance with organizational policy, procedures, prerequisites, and criteria." },
                    { id: "03.01.01.b[03]", text: "System accounts are modified in accordance with organizational policy, procedures, prerequisites, and criteria." },
                    { id: "03.01.01.b[04]", text: "System accounts are disabled in accordance with organizational policy, procedures, prerequisites, and criteria." },
                    { id: "03.01.01.b[05]", text: "System accounts are removed in accordance with organizational policy, procedures, prerequisites, and criteria." },
                    { id: "03.01.01.c.01", text: "Authorized users of the system are specified." },
                    { id: "03.01.01.c.02", text: "Group and role memberships are specified." },
                    { id: "03.01.01.c.03", text: "Access authorizations (i.e., privileges) for each account are specified." },
                    { id: "03.01.01.d.01", text: "Access to the system is authorized based on a valid access authorization." },
                    { id: "03.01.01.d.02", text: "Access to the system is authorized based on intended system usage." },
                    { id: "03.01.01.e", text: "The use of system accounts is monitored." },
                    { id: "03.01.01.f[01]", text: "System accounts are disabled when the accounts have expired." },
                    { id: "03.01.01.f[02]", text: "System accounts are disabled when the accounts have been inactive for the defined time period." },
                    { id: "03.01.01.f[03]", text: "System accounts are disabled when the accounts are no longer associated with a user or individual." },
                    { id: "03.01.01.f[04]", text: "System accounts are disabled when the accounts violate organizational policy." },
                    { id: "03.01.01.f[05]", text: "System accounts are disabled when significant risks associated with individuals are discovered." },
                    { id: "03.01.01.g[01]", text: "Account managers and designated personnel or roles are notified within the defined time period when accounts are no longer required." },
                    { id: "03.01.01.g[02]", text: "Account managers and designated personnel or roles are notified within the defined time period when users are terminated or transferred." },
                    { id: "03.01.01.g[03]", text: "Account managers and designated personnel or roles are notified within the defined time period when system usage or the need-to-know changes for an individual." },
                    { id: "03.01.01.h", text: "Users are required to log out of the system after the defined time period of expected inactivity or when the defined circumstances occur." }
                ]
            },
            {
                id: "03.01.02", name: "Access Enforcement",
                rev2Id: "3.1.2", changeType: "renumbered",
                description: "Enforce approved authorizations for logical access to CUI and system resources in accordance with applicable access control policies.",
                sourceRef: "AC-03",
                objectives: [
                    { id: "03.01.02[01]", text: "Approved authorizations for logical access to CUI are enforced in accordance with applicable access control policies." },
                    { id: "03.01.02[02]", text: "Approved authorizations for logical access to system resources are enforced in accordance with applicable access control policies." }
                ]
            },
            {
                id: "03.01.03", name: "Information Flow Enforcement",
                rev2Id: "3.1.3", changeType: "renumbered",
                description: "Enforce approved authorizations for controlling the flow of CUI within the system and between connected systems.",
                sourceRef: "AC-04",
                objectives: [
                    { id: "03.01.03[01]", text: "Approved authorizations are enforced for controlling the flow of CUI within the system." },
                    { id: "03.01.03[02]", text: "Approved authorizations are enforced for controlling the flow of CUI between connected systems." }
                ]
            },
            {
                id: "03.01.04", name: "Separation of Duties",
                rev2Id: "3.1.4", changeType: "renumbered",
                description: "Separate the duties of individuals to reduce the risk of malevolent activity without collusion.",
                sourceRef: "AC-05",
                objectives: [
                    { id: "03.01.04.a", text: "Duties of individuals requiring separation are identified." },
                    { id: "03.01.04.b", text: "System access authorizations to support separation of duties are defined." }
                ]
            },
            {
                id: "03.01.05", name: "Least Privilege",
                rev2Id: "3.1.5", changeType: "enhanced",
                description: "Employ the principle of least privilege, including for specific security functions and privileged accounts.",
                sourceRef: "AC-06, AC-06(01), AC-06(07), AU-09(04)",
                odps: ["Security functions", "Security-relevant information", "Frequency of privilege review"],
                objectives: [
                    { id: "03.01.05.a", text: "System access for users (or processes acting on behalf of users) is authorized only when necessary to accomplish assigned organizational tasks." },
                    { id: "03.01.05.b[01]", text: "Access to the defined security functions is authorized." },
                    { id: "03.01.05.b[02]", text: "Access to the defined security-relevant information is authorized." },
                    { id: "03.01.05.c", text: "The privileges assigned to roles or classes of users are reviewed at the defined frequency to validate the need for such privileges." },
                    { id: "03.01.05.d", text: "Privileges are reassigned or removed, as necessary." }
                ]
            },
            {
                id: "03.01.06", name: "Least Privilege — Privileged Accounts",
                rev2Id: "3.1.6", changeType: "enhanced",
                description: "Restrict privileged accounts on the system to defined personnel or roles.",
                sourceRef: "AC-06(02), AC-06(05)",
                odps: ["Personnel or roles for privileged accounts"],
                objectives: [
                    { id: "03.01.06.a", text: "Privileged accounts on the system are restricted to the defined personnel or roles." },
                    { id: "03.01.06.b", text: "Users (or roles) with privileged accounts are required to use non-privileged accounts when accessing non-security functions or non-security information." }
                ]
            },
            {
                id: "03.01.07", name: "Least Privilege — Privileged Functions",
                rev2Id: "3.1.7", changeType: "renumbered",
                description: "Prevent non-privileged users from executing privileged functions and log the execution of such functions.",
                sourceRef: "AC-06(09), AC-06(10)",
                objectives: [
                    { id: "03.01.07.a", text: "Non-privileged users are prevented from executing privileged functions." },
                    { id: "03.01.07.b", text: "The execution of privileged functions is logged." }
                ]
            },
            {
                id: "03.01.08", name: "Unsuccessful Logon Attempts",
                rev2Id: "3.1.8", changeType: "enhanced",
                description: "Enforce a limit of consecutive invalid logon attempts by a user during a specified time period.",
                sourceRef: "AC-07",
                odps: ["Number of consecutive invalid logon attempts", "Time period", "System action", "Lockout time period"],
                objectives: [
                    { id: "03.01.08.a", text: "A limit of the defined number of consecutive invalid logon attempts by a user during the defined time period is enforced." },
                    { id: "03.01.08.b", text: "The selected system action is taken when the maximum number of unsuccessful attempts is exceeded." }
                ]
            },
            {
                id: "03.01.09", name: "System Use Notification",
                rev2Id: "3.1.9", changeType: "renumbered",
                description: "Display a system use notification message with privacy and security notices consistent with applicable CUI rules before granting access.",
                sourceRef: "AC-08",
                objectives: [
                    { id: "03.01.09", text: "A system use notification message with privacy and security notices consistent with applicable CUI rules is displayed before granting access to the system." }
                ]
            },
            {
                id: "03.01.10", name: "Device Lock",
                rev2Id: "3.1.10", changeType: "enhanced",
                description: "Prevent access to the system by initiating a device lock after a defined period of inactivity.",
                sourceRef: "AC-11, AC-11(01)",
                odps: ["Device lock trigger", "Time period of inactivity"],
                objectives: [
                    { id: "03.01.10.ODP[01]", text: "One or more of the following is selected: a device lock is initiated after the defined time period of inactivity; the user is required to initiate a device lock before leaving the system unattended." },
                    { id: "03.01.10.ODP[02]", text: "The time period of inactivity after which a device lock is initiated is defined (if selected)." },
                    { id: "03.01.10.a", text: "Access to the system is prevented by the selected device lock trigger." },
                    { id: "03.01.10.b", text: "The device lock is retained until the user reestablishes access using established identification and authentication procedures." },
                    { id: "03.01.10.c", text: "Information previously visible on the display is concealed via device lock with a publicly viewable image." }
                ]
            },
            {
                id: "03.01.11", name: "Session Termination",
                rev2Id: "3.1.11", changeType: "enhanced",
                description: "Automatically terminate a user session after defined conditions or trigger events.",
                sourceRef: "AC-12",
                odps: ["Conditions or trigger events requiring session disconnect"],
                objectives: [
                    { id: "03.01.11.ODP[01]", text: "Conditions or trigger events that require session disconnect are defined." },
                    { id: "03.01.11", text: "A user session is terminated automatically after the defined conditions or trigger events." }
                ]
            },
            {
                id: "03.01.12", name: "Remote Access",
                rev2Id: "3.1.12", changeType: "enhanced",
                description: "Establish and document usage restrictions, configuration/connection requirements for each type of remote access allowed; authorize and route remote access through managed access control points.",
                sourceRef: "AC-17, AC-17(03), AC-17(04)",
                objectives: [
                    { id: "03.01.12.a[01]", text: "Types of allowable remote system access are defined." },
                    { id: "03.01.12.a[02]", text: "Usage restrictions are established for each type of allowable remote system access." },
                    { id: "03.01.12.a[03]", text: "Configuration requirements are established for each type of allowable remote system access." },
                    { id: "03.01.12.a[04]", text: "Connection requirements are established for each type of allowable remote system access." },
                    { id: "03.01.12.b", text: "Each type of remote system access is authorized prior to establishing such connections." },
                    { id: "03.01.12.c[01]", text: "Remote access to the system is routed through authorized access control points." },
                    { id: "03.01.12.c[02]", text: "Remote access to the system is routed through managed access control points." },
                    { id: "03.01.12.d[01]", text: "Remote execution of privileged commands is authorized." },
                    { id: "03.01.12.d[02]", text: "Remote access to security-relevant information is authorized." }
                ]
            },
            // 03.01.13 Withdrawn — Addressed by 03.13.08
            // 03.01.14 Withdrawn — Incorporated into 03.01.12
            // 03.01.15 Withdrawn — Incorporated into 03.01.12
            {
                id: "03.01.16", name: "Wireless Access",
                rev2Id: "3.1.16", changeType: "enhanced",
                description: "Establish and document usage restrictions, configuration/connection requirements for each type of wireless access; authorize, protect, and monitor wireless access.",
                sourceRef: "AC-18, AC-18(01), AC-18(03)",
                objectives: [
                    { id: "03.01.16.a[01]", text: "Each type of wireless access to the system is defined." },
                    { id: "03.01.16.a[02]", text: "Usage restrictions are established for each type of wireless access to the system." },
                    { id: "03.01.16.a[03]", text: "Configuration requirements are established for each type of wireless access to the system." },
                    { id: "03.01.16.a[04]", text: "Connection requirements are established for each type of wireless access to the system." },
                    { id: "03.01.16.b", text: "Each type of wireless access to the system is authorized prior to establishing such connections." },
                    { id: "03.01.16.c", text: "Wireless networking capabilities not intended for use are disabled prior to issuance and deployment." },
                    { id: "03.01.16.d[01]", text: "Wireless access to the system is protected using authentication." },
                    { id: "03.01.16.d[02]", text: "Wireless access to the system is protected using encryption." }
                ]
            },
            // 03.01.17 Withdrawn — Incorporated into 03.01.16
            {
                id: "03.01.18", name: "Access Control for Mobile Devices",
                rev2Id: "3.1.18", changeType: "enhanced",
                description: "Establish usage restrictions, configuration requirements, and connection requirements for mobile devices; authorize connection and implement encryption.",
                sourceRef: "AC-19, AC-19(05)",
                objectives: [
                    { id: "03.01.18.a[01]", text: "Usage restrictions are established for mobile devices." },
                    { id: "03.01.18.a[02]", text: "Configuration requirements are established for mobile devices." },
                    { id: "03.01.18.a[03]", text: "Connection requirements are established for mobile devices." },
                    { id: "03.01.18.b", text: "The connection of mobile devices to the system is authorized." },
                    { id: "03.01.18.c", text: "Full-device or container-based encryption is implemented to protect the confidentiality of CUI on mobile devices." }
                ]
            },
            // 03.01.19 Withdrawn — Incorporated into 03.01.18
            {
                id: "03.01.20", name: "Use of External Systems",
                rev2Id: "3.1.20", changeType: "enhanced",
                description: "Establish security requirements for external systems and restrict the use of organization-controlled portable storage devices on external systems.",
                sourceRef: "AC-20, AC-20(01), AC-20(02)",
                odps: ["Security requirements for external systems"],
                objectives: [
                    { id: "03.01.20.a", text: "The use of external systems is prohibited unless the systems are specifically authorized." },
                    { id: "03.01.20.b", text: "The defined security requirements to be satisfied on external systems prior to allowing the use of or access to those systems by authorized individuals are established." },
                    { id: "03.01.20.c[01]", text: "Authorized individuals are permitted to use external systems to access the organizational system or to process, store, or transmit CUI only after verifying that the security requirements on the external systems as specified in the organization's system security plans have been satisfied." },
                    { id: "03.01.20.c[02]", text: "Authorized individuals are permitted to use external systems to access the organizational system or to process, store, or transmit CUI only after retaining approved system connection or processing agreements with the organizational entity hosting the external systems." },
                    { id: "03.01.20.d", text: "The use of organization-controlled portable storage devices by authorized individuals on external systems is restricted." }
                ]
            },
            // 03.01.21 Withdrawn — Incorporated into 03.01.20
            {
                id: "03.01.22", name: "Publicly Accessible Content",
                rev2Id: "3.1.22", changeType: "renumbered",
                description: "Ensure that publicly accessible information does not contain CUI.",
                sourceRef: "AC-22",
                objectives: [
                    { id: "03.01.22.a", text: "Authorized individuals are trained to ensure that publicly accessible information does not contain CUI." },
                    { id: "03.01.22.b[01]", text: "The content on publicly accessible systems is reviewed for CUI." },
                    { id: "03.01.22.b[02]", text: "CUI is removed from publicly accessible systems, if discovered." }
                ]
            }
        ]
    },
    {
        id: "AT",
        name: "Awareness and Training",
        controls: [
            {
                id: "03.02.01", name: "Literacy Training and Awareness",
                rev2Id: "3.2.1", changeType: "enhanced",
                description: "Provide security literacy training to system users including insider threat and social engineering awareness.",
                sourceRef: "AT-02, AT-02(02), AT-02(03)",
                odps: ["Frequency of literacy training", "Events requiring training", "Frequency of content updates", "Events requiring content updates"],
                objectives: [
                    { id: "03.02.01.a.01[01]", text: "Security literacy training is provided to system users as part of initial training for new users." },
                    { id: "03.02.01.a.01[02]", text: "Security literacy training is provided to system users at the defined frequency after initial training." },
                    { id: "03.02.01.a.02", text: "Security literacy training is provided to system users when required by system changes or following the defined events." },
                    { id: "03.02.01.a.03[01]", text: "Security literacy training is provided to system users on recognizing indicators of insider threat." },
                    { id: "03.02.01.a.03[02]", text: "Security literacy training is provided to system users on reporting indicators of insider threat." },
                    { id: "03.02.01.a.03[03]", text: "Security literacy training is provided to system users on recognizing indicators of social engineering." },
                    { id: "03.02.01.a.03[04]", text: "Security literacy training is provided to system users on reporting indicators of social engineering." },
                    { id: "03.02.01.a.03[05]", text: "Security literacy training is provided to system users on recognizing indicators of social mining." },
                    { id: "03.02.01.a.03[06]", text: "Security literacy training is provided to system users on reporting indicators of social mining." },
                    { id: "03.02.01.b[01]", text: "Security literacy training content is updated at the defined frequency." },
                    { id: "03.02.01.b[02]", text: "Security literacy training content is updated following the defined events." }
                ]
            },
            {
                id: "03.02.02", name: "Role-Based Training",
                rev2Id: "3.2.2", changeType: "enhanced",
                description: "Provide role-based security training to personnel with assigned security roles and responsibilities.",
                sourceRef: "AT-03",
                odps: ["Frequency of role-based training", "Events requiring training", "Frequency of content updates", "Events requiring content updates"],
                objectives: [
                    { id: "03.02.02.a.01[01]", text: "Role-based security training is provided to organizational personnel before authorizing access to the system or CUI." },
                    { id: "03.02.02.a.01[02]", text: "Role-based security training is provided to organizational personnel before performing assigned duties." },
                    { id: "03.02.02.a.01[03]", text: "Role-based security training is provided to organizational personnel at the defined frequency after initial training." },
                    { id: "03.02.02.a.02", text: "Role-based security training is provided to organizational personnel when required by system changes or following the defined events." },
                    { id: "03.02.02.b[01]", text: "Role-based security training content is updated at the defined frequency." },
                    { id: "03.02.02.b[02]", text: "Role-based security training content is updated following the defined events." }
                ]
            }
            // 03.02.03 Withdrawn — Incorporated into 03.02.01
        ]
    },
    {
        id: "AU",
        name: "Audit and Accountability",
        controls: [
            {
                id: "03.03.01", name: "Event Logging",
                rev2Id: "3.3.1", changeType: "enhanced",
                description: "Identify the types of events that the system is capable of logging in support of the audit function.",
                sourceRef: "AU-02, AU-03, AU-03(01), AU-11",
                odps: ["Event types", "Content of audit records", "Frequency of event type review", "Retention period"],
                objectives: [
                    { id: "03.03.01.a[01]", text: "The defined event types that the system is capable of logging are identified in support of the audit function." },
                    { id: "03.03.01.a[02]", text: "The event types selected for logging are reviewed and updated at the defined frequency." },
                    { id: "03.03.01.b[01]", text: "The content of audit records for the defined event types is specified." },
                    { id: "03.03.01.b[02]", text: "Audit records contain the defined additional information." },
                    { id: "03.03.01.c", text: "Audit records are generated for the defined event types with the specified content." },
                    { id: "03.03.01.d", text: "Audit records are retained for the defined retention period." }
                ]
            },
            {
                id: "03.03.02", name: "Audit Record Content",
                rev2Id: "3.3.2", changeType: "renumbered",
                description: "Ensure that the actions of individual system users can be uniquely traced to those users.",
                sourceRef: "AU-03",
                objectives: [
                    { id: "03.03.02[01]", text: "The content of audit records is specified to support the ability to uniquely trace users to their actions." },
                    { id: "03.03.02[02]", text: "Audit records contain the specified content to uniquely trace users to their actions." }
                ]
            },
            {
                id: "03.03.03", name: "Audit Record Review, Analysis, and Reporting",
                rev2Id: "3.3.3", changeType: "enhanced",
                description: "Review, analyze, and report on audit records for indications of inappropriate or unusual activity.",
                sourceRef: "AU-06, AU-06(03)",
                odps: ["Frequency of audit record review", "Inappropriate or unusual activities to look for"],
                objectives: [
                    { id: "03.03.03.a", text: "Audit records are reviewed and analyzed at the defined frequency for indications of the defined inappropriate or unusual activities." },
                    { id: "03.03.03.b", text: "Findings are reported to designated personnel or roles." },
                    { id: "03.03.03.c", text: "Audit record review, analysis, and reporting processes for investigation and response to indications of unlawful, unauthorized, suspicious, or unusual activity are correlated." }
                ]
            },
            {
                id: "03.03.04", name: "Audit Logging Process Failure Alerting",
                rev2Id: "3.3.4", changeType: "enhanced",
                description: "Alert designated personnel or roles in the event of an audit logging process failure and take defined additional actions.",
                sourceRef: "AU-05",
                odps: ["Personnel or roles to alert", "Additional actions", "Audit logging failures"],
                objectives: [
                    { id: "03.03.04.a", text: "The defined personnel or roles are alerted within a defined time period in the event of the defined audit logging failures." },
                    { id: "03.03.04.b", text: "The defined additional actions are taken in the event of an audit logging process failure." }
                ]
            },
            {
                id: "03.03.05", name: "Audit Record Reduction and Report Generation",
                rev2Id: "3.3.5", changeType: "renumbered",
                description: "Provide audit record reduction and report generation to support on-demand analysis and reporting.",
                sourceRef: "AU-07",
                objectives: [
                    { id: "03.03.05[01]", text: "An audit record reduction capability that supports on-demand analysis is provided." },
                    { id: "03.03.05[02]", text: "A report generation capability that supports on-demand reporting is provided." }
                ]
            },
            {
                id: "03.03.06", name: "Time Stamps",
                rev2Id: "3.3.7", changeType: "enhanced",
                description: "Use internal system clocks to generate time stamps for audit records and synchronize with an authoritative time source.",
                sourceRef: "AU-08",
                odps: ["Granularity of time measurement", "Authoritative time source"],
                objectives: [
                    { id: "03.03.06.a", text: "Internal system clocks are used to generate time stamps for audit records." },
                    { id: "03.03.06.b[01]", text: "Internal system clocks used to generate time stamps for audit records are compared to the defined authoritative time source at the defined granularity of time measurement." },
                    { id: "03.03.06.b[02]", text: "Internal system clocks used to generate time stamps for audit records are synchronized with the defined authoritative time source at the defined granularity of time measurement." }
                ]
            },
            {
                id: "03.03.07", name: "Audit Record Protection",
                rev2Id: "3.3.8", changeType: "renumbered",
                description: "Protect audit information and audit logging tools from unauthorized access, modification, and deletion.",
                sourceRef: "AU-09",
                objectives: [
                    { id: "03.03.07[01]", text: "Audit information is protected from unauthorized access." },
                    { id: "03.03.07[02]", text: "Audit information is protected from unauthorized modification." },
                    { id: "03.03.07[03]", text: "Audit information is protected from unauthorized deletion." },
                    { id: "03.03.07[04]", text: "Audit logging tools are protected from unauthorized access." },
                    { id: "03.03.07[05]", text: "Audit logging tools are protected from unauthorized modification." },
                    { id: "03.03.07[06]", text: "Audit logging tools are protected from unauthorized deletion." }
                ]
            },
            {
                id: "03.03.08", name: "Audit Record Management",
                rev2Id: "3.3.9", changeType: "renumbered",
                description: "Limit management of audit logging functionality to a subset of privileged users or roles.",
                sourceRef: "AU-09(04)",
                objectives: [
                    { id: "03.03.08[01]", text: "Management of audit logging functionality is limited to the defined subset of privileged users or roles." }
                ]
            }
            // 03.03.09 Withdrawn — Incorporated into 03.03.07 and 03.03.08
        ]
    }
];
