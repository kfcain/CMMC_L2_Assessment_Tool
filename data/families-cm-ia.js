// NIST 800-171A - Configuration Management and Identification/Authentication (CM, IA)

const FAMILIES_CM_IA = [
    {
        id: "CM",
        name: "Configuration Management",
        controls: [
            {
                id: "3.4.1", name: "Baseline Configurations",
                description: "Establish and maintain baseline configurations and inventories of organizational systems throughout the respective system development life cycles.",
                objectives: [
                    { id: "3.4.1[a]", text: "A baseline configuration is established." },
                    { id: "3.4.1[b]", text: "The baseline configuration includes hardware, software, firmware, and documentation." },
                    { id: "3.4.1[c]", text: "The baseline configuration is maintained (reviewed and updated) throughout the system development life cycle." },
                    { id: "3.4.1[d]", text: "A system inventory is established." },
                    { id: "3.4.1[e]", text: "The system inventory includes hardware, software, firmware, and documentation." },
                    { id: "3.4.1[f]", text: "The inventory is maintained (reviewed and updated) throughout the system development life cycle." }
                ]
            },
            {
                id: "3.4.2", name: "Security Configuration Settings",
                description: "Establish and enforce security configuration settings for information technology products employed in organizational systems.",
                objectives: [
                    { id: "3.4.2[a]", text: "Security configuration settings for information technology products employed in the system are established and included in the baseline configuration." },
                    { id: "3.4.2[b]", text: "Security configuration settings for information technology products employed in the system are enforced." }
                ]
            },
            {
                id: "3.4.3", name: "System Change Tracking",
                description: "Track, review, approve or disapprove, and log changes to organizational systems.",
                objectives: [
                    { id: "3.4.3[a]", text: "Changes to the system are tracked." },
                    { id: "3.4.3[b]", text: "Changes to the system are reviewed." },
                    { id: "3.4.3[c]", text: "Changes to the system are approved or disapproved." },
                    { id: "3.4.3[d]", text: "Changes to the system are logged." }
                ]
            },
            {
                id: "3.4.4", name: "Security Impact Analysis",
                description: "Analyze the security impact of changes prior to implementation.",
                objectives: [
                    { id: "3.4.4[a]", text: "The security impact of changes to the system is analyzed prior to implementation." }
                ]
            },
            {
                id: "3.4.5", name: "Access Restrictions for Change",
                description: "Define, document, approve, and enforce physical and logical access restrictions associated with changes to organizational systems.",
                objectives: [
                    { id: "3.4.5[a]", text: "Physical access restrictions associated with changes to the system are defined." },
                    { id: "3.4.5[b]", text: "Physical access restrictions associated with changes to the system are documented." },
                    { id: "3.4.5[c]", text: "Physical access restrictions associated with changes to the system are approved." },
                    { id: "3.4.5[d]", text: "Physical access restrictions associated with changes to the system are enforced." },
                    { id: "3.4.5[e]", text: "Logical access restrictions associated with changes to the system are defined." },
                    { id: "3.4.5[f]", text: "Logical access restrictions associated with changes to the system are documented." },
                    { id: "3.4.5[g]", text: "Logical access restrictions associated with changes to the system are approved." },
                    { id: "3.4.5[h]", text: "Logical access restrictions associated with changes to the system are enforced." }
                ]
            },
            {
                id: "3.4.6", name: "Least Functionality",
                description: "Employ the principle of least functionality by configuring organizational systems to provide only essential capabilities.",
                objectives: [
                    { id: "3.4.6[a]", text: "Essential system capabilities are defined based on the principle of least functionality." },
                    { id: "3.4.6[b]", text: "The system is configured to provide only the defined essential capabilities." }
                ]
            },
            {
                id: "3.4.7", name: "Nonessential Functionality",
                description: "Restrict, disable, or prevent the use of nonessential programs, functions, ports, protocols, and services.",
                objectives: [
                    { id: "3.4.7[a]", text: "Essential programs are defined." },
                    { id: "3.4.7[b]", text: "The use of nonessential programs is defined." },
                    { id: "3.4.7[c]", text: "The use of nonessential programs is restricted, disabled, or prevented as defined." },
                    { id: "3.4.7[d]", text: "Essential functions are defined." },
                    { id: "3.4.7[e]", text: "The use of nonessential functions is defined." },
                    { id: "3.4.7[f]", text: "The use of nonessential functions is restricted, disabled, or prevented as defined." },
                    { id: "3.4.7[g]", text: "Essential ports are defined." },
                    { id: "3.4.7[h]", text: "The use of nonessential ports is defined." },
                    { id: "3.4.7[i]", text: "The use of nonessential ports is restricted, disabled, or prevented as defined." },
                    { id: "3.4.7[j]", text: "Essential protocols are defined." },
                    { id: "3.4.7[k]", text: "The use of nonessential protocols is defined." },
                    { id: "3.4.7[l]", text: "The use of nonessential protocols is restricted, disabled, or prevented as defined." },
                    { id: "3.4.7[m]", text: "Essential services are defined." },
                    { id: "3.4.7[n]", text: "The use of nonessential services is defined." },
                    { id: "3.4.7[o]", text: "The use of nonessential services is restricted, disabled, or prevented as defined." }
                ]
            },
            {
                id: "3.4.8", name: "Application Execution Policy",
                description: "Apply deny-by-exception (blacklisting) policy to prevent the use of unauthorized software or deny-all, permit-by-exception (whitelisting) policy to allow the execution of authorized software.",
                objectives: [
                    { id: "3.4.8[a]", text: "A policy specifying whether whitelisting or blacklisting is to be implemented is specified." },
                    { id: "3.4.8[b]", text: "The software allowed to execute under whitelisting or denied use under blacklisting is specified." },
                    { id: "3.4.8[c]", text: "Whitelisting to allow the execution of authorized software or blacklisting to prevent the use of unauthorized software is implemented as specified." }
                ]
            },
            {
                id: "3.4.9", name: "User-Installed Software Control",
                description: "Control and monitor user-installed software.",
                objectives: [
                    { id: "3.4.9[a]", text: "A policy for controlling the installation of software by users is established." },
                    { id: "3.4.9[b]", text: "Installation of software by users is controlled based on the established policy." },
                    { id: "3.4.9[c]", text: "Installation of software by users is monitored." }
                ]
            }
        ]
    },
    {
        id: "IA",
        name: "Identification and Authentication",
        controls: [
            {
                id: "3.5.1", name: "User Identification",
                description: "Identify system users, processes acting on behalf of users, and devices.",
                objectives: [
                    { id: "3.5.1[a]", text: "System users are identified." },
                    { id: "3.5.1[b]", text: "Processes acting on behalf of users are identified." },
                    { id: "3.5.1[c]", text: "Devices accessing the system are identified." }
                ]
            },
            {
                id: "3.5.2", name: "User Authentication",
                description: "Authenticate (or verify) the identities of users, processes, or devices, as a prerequisite to allowing access to organizational systems.",
                objectives: [
                    { id: "3.5.2[a]", text: "The identity of each user is authenticated or verified as a prerequisite to system access." },
                    { id: "3.5.2[b]", text: "The identity of each process acting on behalf of a user is authenticated or verified as a prerequisite to system access." },
                    { id: "3.5.2[c]", text: "The identity of each device accessing or connecting to the system is authenticated or verified as a prerequisite to system access." }
                ]
            },
            {
                id: "3.5.3", name: "Multifactor Authentication",
                description: "Use multifactor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.",
                objectives: [
                    { id: "3.5.3[a]", text: "Privileged accounts are identified." },
                    { id: "3.5.3[b]", text: "Multifactor authentication is implemented for local access to privileged accounts." },
                    { id: "3.5.3[c]", text: "Multifactor authentication is implemented for network access to privileged accounts." },
                    { id: "3.5.3[d]", text: "Multifactor authentication is implemented for network access to non-privileged accounts." }
                ]
            },
            {
                id: "3.5.4", name: "Replay-Resistant Authentication",
                description: "Employ replay-resistant authentication mechanisms for network access to privileged and non-privileged accounts.",
                objectives: [
                    { id: "3.5.4[a]", text: "Replay-resistant authentication mechanisms are implemented for network account access to privileged accounts." },
                    { id: "3.5.4[b]", text: "Replay-resistant authentication mechanisms are implemented for network access to non-privileged accounts." }
                ]
            },
            {
                id: "3.5.5", name: "Identifier Reuse Prevention",
                description: "Prevent reuse of identifiers for a defined period.",
                objectives: [
                    { id: "3.5.5[a]", text: "A period within which identifiers cannot be reused is defined." },
                    { id: "3.5.5[b]", text: "Reuse of identifiers is prevented within the defined period." }
                ]
            },
            {
                id: "3.5.6", name: "Identifier Disabling",
                description: "Disable identifiers after a defined period of inactivity.",
                objectives: [
                    { id: "3.5.6[a]", text: "A period of inactivity after which an identifier is disabled is defined." },
                    { id: "3.5.6[b]", text: "Identifiers are disabled after the defined period of inactivity." }
                ]
            },
            {
                id: "3.5.7", name: "Password Complexity",
                description: "Enforce a minimum password complexity and change of characters when new passwords are created.",
                objectives: [
                    { id: "3.5.7[a]", text: "Password complexity requirements are defined." },
                    { id: "3.5.7[b]", text: "Password change of character requirements are defined." },
                    { id: "3.5.7[c]", text: "Minimum password complexity requirements as defined are enforced when new passwords are created." },
                    { id: "3.5.7[d]", text: "Minimum password change of character requirements as defined are enforced when new passwords are created." }
                ]
            },
            {
                id: "3.5.8", name: "Password Reuse Prohibition",
                description: "Prohibit password reuse for a specified number of generations.",
                objectives: [
                    { id: "3.5.8[a]", text: "The number of generations during which a password cannot be reused is specified." },
                    { id: "3.5.8[b]", text: "Reuse of passwords is prohibited during the specified number of generations." }
                ]
            },
            {
                id: "3.5.9", name: "Temporary Password Change",
                description: "Allow temporary password use for system logons with an immediate change to a permanent password.",
                objectives: [
                    { id: "3.5.9[a]", text: "Temporary passwords are allowed for use in system logons." },
                    { id: "3.5.9[b]", text: "An immediate change to a permanent password is required when a temporary password is used for system logon." }
                ]
            },
            {
                id: "3.5.10", name: "Cryptographic Password Protection",
                description: "Store and transmit only cryptographically-protected passwords.",
                objectives: [
                    { id: "3.5.10[a]", text: "Passwords are cryptographically protected in storage." },
                    { id: "3.5.10[b]", text: "Passwords are cryptographically protected in transit." }
                ]
            },
            {
                id: "3.5.11", name: "Authenticator Feedback Obscuring",
                description: "Obscure feedback of authentication information.",
                objectives: [
                    { id: "3.5.11[a]", text: "Authentication information is obscured during the authentication process." }
                ]
            }
        ]
    }
];
