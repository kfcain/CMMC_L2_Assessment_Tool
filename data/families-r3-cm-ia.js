// NIST SP 800-171A Rev 3 - Configuration Management and Identification/Authentication (CM, IA)
// Based on NIST SP 800-171A Revision 3 (November 2024) — Official assessment objectives
// Objective IDs match official NIST SP 800-171Ar3 publication exactly

const FAMILIES_R3_CM_IA = [
    {
        id: "CM",
        name: "Configuration Management",
        controls: [
            {
                id: "03.04.01", name: "Baseline Configuration",
                rev2Id: "3.4.1", changeType: "enhanced",
                description: "Establish and maintain baseline configurations and inventories of organizational systems.",
                sourceRef: "CM-02",
                odps: ["Frequency of baseline configuration review and update"],
                objectives: [
                    { id: "03.04.01.a[01]", text: "A current baseline configuration of the system is developed." },
                    { id: "03.04.01.a[02]", text: "A current baseline configuration of the system is maintained under configuration control." },
                    { id: "03.04.01.b[01]", text: "The baseline configuration of the system is reviewed at the defined frequency." },
                    { id: "03.04.01.b[02]", text: "The baseline configuration of the system is updated at the defined frequency." },
                    { id: "03.04.01.b[03]", text: "The baseline configuration of the system is reviewed when system components are installed or modified." },
                    { id: "03.04.01.b[04]", text: "The baseline configuration of the system is updated when system components are installed or modified." }
                ]
            },
            {
                id: "03.04.02", name: "Configuration Settings",
                rev2Id: "3.4.2", changeType: "enhanced",
                description: "Establish and enforce security configuration settings for information technology products employed in organizational systems.",
                sourceRef: "CM-06",
                odps: ["Configuration settings"],
                objectives: [
                    { id: "03.04.02.a[01]", text: "The defined configuration settings that reflect the most restrictive mode consistent with operational requirements are established and documented." },
                    { id: "03.04.02.a[02]", text: "The defined configuration settings are implemented." },
                    { id: "03.04.02.b[01]", text: "Any deviations from established configuration settings are identified and documented." },
                    { id: "03.04.02.b[02]", text: "Any deviations from established configuration settings are approved." }
                ]
            },
            {
                id: "03.04.03", name: "Configuration Change Control",
                rev2Id: "3.4.3", changeType: "renumbered",
                description: "Track, review, approve or disapprove, and log changes to organizational systems.",
                sourceRef: "CM-03",
                objectives: [
                    { id: "03.04.03.a", text: "The types of changes to the system that are configuration-controlled are defined." },
                    { id: "03.04.03.b[01]", text: "Proposed configuration-controlled changes to the system are reviewed with explicit consideration for security impacts." },
                    { id: "03.04.03.b[02]", text: "Proposed configuration-controlled changes to the system are approved or disapproved with explicit consideration for security impacts." },
                    { id: "03.04.03.c[01]", text: "Approved configuration-controlled changes to the system are implemented." },
                    { id: "03.04.03.c[02]", text: "Approved configuration-controlled changes to the system are documented." },
                    { id: "03.04.03.d[01]", text: "Activities associated with configuration-controlled changes to the system are monitored." },
                    { id: "03.04.03.d[02]", text: "Activities associated with configuration-controlled changes to the system are reviewed." }
                ]
            },
            {
                id: "03.04.04", name: "Impact Analyses",
                rev2Id: "3.4.4", changeType: "renumbered",
                description: "Analyze the security impact of changes prior to implementation.",
                sourceRef: "CM-04, CM-04(02)",
                objectives: [
                    { id: "03.04.04.a", text: "Changes to the system are analyzed to determine potential security impacts prior to change implementation." },
                    { id: "03.04.04.b", text: "The security requirements for the system continue to be satisfied after the system changes have been implemented." }
                ]
            },
            {
                id: "03.04.05", name: "Access Restrictions for Change",
                rev2Id: "3.4.5", changeType: "renumbered",
                description: "Define, document, approve, and enforce physical and logical access restrictions associated with changes to organizational systems.",
                sourceRef: "CM-05",
                objectives: [
                    { id: "03.04.05[01]", text: "Physical access restrictions associated with changes to the system are defined and documented." },
                    { id: "03.04.05[02]", text: "Physical access restrictions associated with changes to the system are approved." },
                    { id: "03.04.05[03]", text: "Physical access restrictions associated with changes to the system are enforced." },
                    { id: "03.04.05[04]", text: "Logical access restrictions associated with changes to the system are defined and documented." },
                    { id: "03.04.05[05]", text: "Logical access restrictions associated with changes to the system are approved." },
                    { id: "03.04.05[06]", text: "Logical access restrictions associated with changes to the system are enforced." }
                ]
            },
            {
                id: "03.04.06", name: "Least Functionality",
                rev2Id: "3.4.6", changeType: "enhanced",
                description: "Configure the system to provide only mission-essential capabilities; prohibit or restrict use of specified functions, ports, protocols, connections, and services.",
                sourceRef: "CM-07, CM-07(01)",
                odps: ["Functions", "Ports", "Protocols", "Connections", "Services", "Frequency of review"],
                objectives: [
                    { id: "03.04.06.a", text: "The system is configured to provide only mission-essential capabilities." },
                    { id: "03.04.06.b[01]", text: "The use of the defined functions is prohibited or restricted." },
                    { id: "03.04.06.b[02]", text: "The use of the defined ports is prohibited or restricted." },
                    { id: "03.04.06.b[03]", text: "The use of the defined protocols is prohibited or restricted." },
                    { id: "03.04.06.b[04]", text: "The use of the defined connections is prohibited or restricted." },
                    { id: "03.04.06.b[05]", text: "The use of the defined services is prohibited or restricted." },
                    { id: "03.04.06.c", text: "The system is reviewed at the defined frequency to identify unnecessary or nonsecure functions, ports, protocols, connections, and services." },
                    { id: "03.04.06.d", text: "Unnecessary or nonsecure functions, ports, protocols, connections, and services are disabled or removed." }
                ]
            },
            // 03.04.07 Withdrawn — Incorporated into 03.04.06 and 03.04.08
            {
                id: "03.04.08", name: "Authorized Software — Allow by Exception",
                rev2Id: "3.4.8", changeType: "enhanced",
                description: "Identify software programs authorized to execute on the system and implement a deny-all, allow-by-exception policy.",
                sourceRef: "CM-07(05)",
                odps: ["Frequency of authorized software list review"],
                objectives: [
                    { id: "03.04.08.a", text: "Software programs authorized to execute on the system are identified." },
                    { id: "03.04.08.b", text: "A deny-all, allow-by-exception policy for the execution of authorized software programs on the system is implemented." },
                    { id: "03.04.08.c", text: "The list of authorized software programs is reviewed and updated at the defined frequency." }
                ]
            },
            // 03.04.09 Withdrawn — Addressed by 03.01.05, 03.01.06, 03.01.07, 03.04.08, and 03.12.03
            {
                id: "03.04.10", name: "System Component Inventory",
                rev2Id: null, changeType: "new",
                description: "Develop and document an inventory of system components that accurately reflects the system.",
                sourceRef: "CM-08, CM-08(01)",
                odps: ["Frequency of inventory review and update"],
                objectives: [
                    { id: "03.04.10.a", text: "An inventory of system components is developed and documented." },
                    { id: "03.04.10.b[01]", text: "The system component inventory is reviewed at the defined frequency." },
                    { id: "03.04.10.b[02]", text: "The system component inventory is updated at the defined frequency." },
                    { id: "03.04.10.c[01]", text: "The system component inventory is updated as part of component installations." },
                    { id: "03.04.10.c[02]", text: "The system component inventory is updated as part of component removals." },
                    { id: "03.04.10.c[03]", text: "The system component inventory is updated as part of system updates." }
                ]
            },
            {
                id: "03.04.11", name: "Information Location",
                rev2Id: null, changeType: "new",
                description: "Identify and document the location of CUI and the system components on which it is processed and stored.",
                sourceRef: "CM-12",
                objectives: [
                    { id: "03.04.11.a[01]", text: "The location of CUI is identified and documented." },
                    { id: "03.04.11.a[02]", text: "The system components on which CUI is processed are identified and documented." },
                    { id: "03.04.11.a[03]", text: "The system components on which CUI is stored are identified and documented." },
                    { id: "03.04.11.b[01]", text: "Changes to the system or system component location where CUI is processed are documented." },
                    { id: "03.04.11.b[02]", text: "Changes to the system or system component location where CUI is stored are documented." }
                ]
            },
            {
                id: "03.04.12", name: "System and Component Configuration for High-Risk Areas",
                rev2Id: null, changeType: "new",
                description: "Issue systems or system components with specific configurations to individuals traveling to high-risk locations.",
                sourceRef: "CM-02(07)",
                odps: ["Configurations for high-risk travel", "Security requirements upon return"],
                objectives: [
                    { id: "03.04.12.a", text: "Systems or system components with the defined configurations are issued to individuals traveling to high-risk locations." },
                    { id: "03.04.12.b", text: "The defined security requirements are applied to the system or system components when the individuals return from travel." }
                ]
            }
        ]
    },
    {
        id: "IA",
        name: "Identification and Authentication",
        controls: [
            {
                id: "03.05.01", name: "User Identification, Authentication, and Re-Authentication",
                rev2Id: "3.5.1", changeType: "enhanced",
                description: "Uniquely identify and authenticate system users and reauthenticate users when defined circumstances occur.",
                sourceRef: "IA-02, IA-11",
                odps: ["Circumstances requiring re-authentication"],
                objectives: [
                    { id: "03.05.01.a[01]", text: "System users are uniquely identified." },
                    { id: "03.05.01.a[02]", text: "System users are authenticated." },
                    { id: "03.05.01.a[03]", text: "Processes acting on behalf of users are associated with uniquely identified and authenticated system users." },
                    { id: "03.05.01.b", text: "Users are reauthenticated when the defined circumstances or situations occur." }
                ]
            },
            {
                id: "03.05.02", name: "Device Identification and Authentication",
                rev2Id: "3.5.2", changeType: "enhanced",
                description: "Uniquely identify and authenticate devices before establishing a system connection.",
                sourceRef: "IA-03",
                odps: ["Devices or types of devices requiring identification and authentication"],
                objectives: [
                    { id: "03.05.02[01]", text: "The defined devices or types of devices are uniquely identified before establishing a system connection." },
                    { id: "03.05.02[02]", text: "The defined devices or types of devices are authenticated before establishing a system connection." }
                ]
            },
            {
                id: "03.05.03", name: "Multi-Factor Authentication",
                rev2Id: "3.5.3", changeType: "renumbered",
                description: "Implement multi-factor authentication for access to privileged and non-privileged accounts.",
                sourceRef: "IA-02(01), IA-02(02)",
                objectives: [
                    { id: "03.05.03[01]", text: "Multi-factor authentication for access to privileged accounts is implemented." },
                    { id: "03.05.03[02]", text: "Multi-factor authentication for access to non-privileged accounts is implemented." }
                ]
            },
            {
                id: "03.05.04", name: "Replay-Resistant Authentication",
                rev2Id: "3.5.4", changeType: "renumbered",
                description: "Employ replay-resistant authentication mechanisms for access to privileged and non-privileged accounts.",
                sourceRef: "IA-02(08)",
                objectives: [
                    { id: "03.05.04[01]", text: "Replay-resistant authentication mechanisms for access to privileged accounts are implemented." },
                    { id: "03.05.04[02]", text: "Replay-resistant authentication mechanisms for access to non-privileged accounts are implemented." }
                ]
            },
            {
                id: "03.05.05", name: "Identifier Management",
                rev2Id: "3.5.5", changeType: "enhanced",
                description: "Manage system identifiers by receiving authorization, selecting and assigning identifiers, preventing reuse, and managing individual status.",
                sourceRef: "IA-04, IA-04(04)",
                odps: ["Time period for preventing identifier reuse", "Characteristics for identifying individual status"],
                objectives: [
                    { id: "03.05.05.a", text: "Authorization is received from organizational personnel or roles to assign an individual, group, role, service, or device identifier." },
                    { id: "03.05.05.b[01]", text: "An identifier that identifies an individual, group, role, service, or device is selected." },
                    { id: "03.05.05.b[02]", text: "An identifier that identifies an individual, group, role, service, or device is assigned." },
                    { id: "03.05.05.c", text: "The reuse of identifiers for the defined time period is prevented." },
                    { id: "03.05.05.d", text: "Individual identifiers are managed by uniquely identifying each individual as the defined characteristic." }
                ]
            },
            // 03.05.06 Withdrawn — Consistency with SP 800-53
            {
                id: "03.05.07", name: "Password Management",
                rev2Id: "3.5.7", changeType: "enhanced",
                description: "Manage passwords including maintaining lists of compromised passwords, enforcing composition rules, and protecting passwords.",
                sourceRef: "IA-05(01)",
                odps: ["Frequency of compromised password list update", "Password composition and complexity rules"],
                objectives: [
                    { id: "03.05.07.a[01]", text: "A list of commonly used, expected, or compromised passwords is maintained." },
                    { id: "03.05.07.a[02]", text: "A list of commonly used, expected, or compromised passwords is updated at the defined frequency." },
                    { id: "03.05.07.a[03]", text: "A list of commonly used, expected, or compromised passwords is updated when organizational passwords are suspected to have been compromised." },
                    { id: "03.05.07.b", text: "Passwords are verified not to be found on the list of commonly used, expected, or compromised passwords when they are created or updated by users." },
                    { id: "03.05.07.c", text: "Passwords are only transmitted over cryptographically protected channels." },
                    { id: "03.05.07.d", text: "Passwords are stored in a cryptographically protected form." },
                    { id: "03.05.07.e", text: "A new password is selected upon first use after account recovery." },
                    { id: "03.05.07.f", text: "The defined composition and complexity rules for passwords are enforced." }
                ]
            },
            // 03.05.08 Withdrawn — Consistency with SP 800-53
            // 03.05.09 Withdrawn — Consistency with SP 800-53
            // 03.05.10 Withdrawn — Incorporated into 03.05.07
            {
                id: "03.05.11", name: "Authentication Feedback",
                rev2Id: "3.5.11", changeType: "renumbered",
                description: "Obscure feedback of authentication information during the authentication process.",
                sourceRef: "IA-06",
                objectives: [
                    { id: "03.05.11", text: "Feedback of authentication information during the authentication process is obscured." }
                ]
            },
            {
                id: "03.05.12", name: "Authenticator Management",
                rev2Id: null, changeType: "new",
                description: "Manage system authenticators including verifying identity, establishing initial content, and protecting authenticator content.",
                sourceRef: "IA-05",
                odps: ["Frequency for changing authenticators", "Events triggering authenticator change"],
                objectives: [
                    { id: "03.05.12.a", text: "The identity of the individual, group, role, service, or device receiving the authenticator as part of the initial authenticator distribution is verified." },
                    { id: "03.05.12.b", text: "Initial authenticator content for any authenticators issued by the organization is established." },
                    { id: "03.05.12.c[01]", text: "Administrative procedures for initial authenticator distribution are established." },
                    { id: "03.05.12.c[02]", text: "Administrative procedures for lost, compromised, or damaged authenticators are established." },
                    { id: "03.05.12.c[03]", text: "Administrative procedures for revoking authenticators are established." },
                    { id: "03.05.12.c[04]", text: "Administrative procedures for initial authenticator distribution are implemented." },
                    { id: "03.05.12.c[05]", text: "Administrative procedures for lost, compromised, or damaged authenticators are implemented." },
                    { id: "03.05.12.c[06]", text: "Administrative procedures for revoking authenticators are implemented." },
                    { id: "03.05.12.d", text: "Default authenticators are changed at first use." },
                    { id: "03.05.12.e", text: "Authenticators are changed or refreshed at the defined frequency or when the defined events occur." },
                    { id: "03.05.12.f[01]", text: "Authenticator content is protected from unauthorized disclosure." },
                    { id: "03.05.12.f[02]", text: "Authenticator content is protected from unauthorized modification." }
                ]
            }
        ]
    }
];
