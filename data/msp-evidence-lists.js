// MSP Evidence Collection - Exhaustive Lists by Control Family
// Comprehensive evidence artifacts for CMMC Level 2 assessments

const MSP_EVIDENCE_LISTS = {
    version: "1.0.0",
    lastUpdated: "2025-01-27",

    // ==================== ACCESS CONTROL (AC) ====================
    accessControl: {
        familyId: "AC",
        familyName: "Access Control",
        controls: [
            {
                controlId: "3.1.1",
                title: "Limit system access to authorized users",
                evidenceItems: [
                    "Active Directory/Entra ID user list with group memberships",
                    "User account provisioning procedures (SOP)",
                    "Access request and approval workflow documentation",
                    "User access review records (quarterly/annual)",
                    "Terminated user account disable/removal logs",
                    "Guest/external user access policies",
                    "Service account inventory with owners",
                    "Conditional Access policy configurations",
                    "VPN access logs showing authorized users",
                    "Application access control lists (ACLs)",
                    "Role-based access control (RBAC) matrix",
                    "Just-in-time (JIT) access configuration (if applicable)"
                ],
                automatedCollection: {
                    azure: "Get-MgUser -All | Export-Csv; Get-MgGroup -All | Export-Csv",
                    aws: "aws iam list-users; aws iam list-groups",
                    m365: "Get-MsolUser -All | Export-Csv"
                }
            },
            {
                controlId: "3.1.2",
                title: "Limit system access to authorized transactions and functions",
                evidenceItems: [
                    "Role definitions and permission assignments",
                    "Privileged role membership lists",
                    "Application permission matrices",
                    "Function-level access controls documentation",
                    "API access tokens and scopes inventory",
                    "Database role assignments",
                    "File share permission reports",
                    "SharePoint/OneDrive permission audits",
                    "Admin portal access restrictions",
                    "Segregation of duties matrix"
                ]
            },
            {
                controlId: "3.1.3",
                title: "Control CUI flow in accordance with approved authorizations",
                evidenceItems: [
                    "Data flow diagrams showing CUI paths",
                    "Data Loss Prevention (DLP) policy configurations",
                    "Email transport rules for CUI",
                    "Cloud App Security/Defender for Cloud Apps policies",
                    "File classification and labeling policies",
                    "USB/removable media restrictions",
                    "Printing restrictions for CUI",
                    "Screen capture/clipboard restrictions",
                    "Data exfiltration prevention controls",
                    "Approved file sharing platforms list",
                    "Cross-boundary data transfer authorizations"
                ]
            },
            {
                controlId: "3.1.4",
                title: "Separate duties of individuals",
                evidenceItems: [
                    "Segregation of duties policy",
                    "Role conflict analysis report",
                    "Privileged access management (PAM) configurations",
                    "Approval workflows requiring multiple approvers",
                    "Change management separation (dev/test/prod)",
                    "Financial system access controls",
                    "Security administrator vs system administrator separation"
                ]
            },
            {
                controlId: "3.1.5",
                title: "Employ least privilege principle",
                evidenceItems: [
                    "Least privilege policy documentation",
                    "Admin account inventory (should be minimal)",
                    "Privileged Identity Management (PIM) configurations",
                    "Just-in-time access logs",
                    "Elevated privilege request and approval records",
                    "Standard user vs admin account analysis",
                    "Application admin role assignments",
                    "Database privilege audits",
                    "Cloud IAM policy analysis (Access Analyzer, etc.)"
                ]
            },
            {
                controlId: "3.1.6",
                title: "Use non-privileged accounts for non-security functions",
                evidenceItems: [
                    "Policy requiring separate admin accounts",
                    "Admin account naming convention (e.g., adm-username)",
                    "Privileged Access Workstation (PAW) documentation",
                    "Evidence of admin using standard account for email/web",
                    "Conditional Access requiring compliant device for admin",
                    "Session recordings showing account switching"
                ]
            },
            {
                controlId: "3.1.7",
                title: "Prevent non-privileged users from executing privileged functions",
                evidenceItems: [
                    "UAC (User Account Control) configuration",
                    "sudo/RBAC configurations for Linux",
                    "Group Policy Objects preventing elevation",
                    "Application whitelisting configurations",
                    "Endpoint privilege management tool configs",
                    "Admin approval mode settings"
                ]
            },
            {
                controlId: "3.1.8",
                title: "Limit unsuccessful logon attempts",
                evidenceItems: [
                    "Account lockout policy settings (AD/Entra)",
                    "Lockout threshold configuration (recommend 3-5 attempts)",
                    "Lockout duration settings",
                    "Failed logon attempt logs/alerts",
                    "Smart lockout configurations (Entra ID)",
                    "Application-level lockout settings"
                ]
            },
            {
                controlId: "3.1.9",
                title: "Provide privacy and security notices",
                evidenceItems: [
                    "Login banner text/screenshots",
                    "Group Policy for logon message",
                    "VPN login banner",
                    "Application login banners",
                    "Acknowledgment logs (if required)",
                    "Banner content review documentation"
                ]
            },
            {
                controlId: "3.1.10",
                title: "Use session lock with pattern-hiding displays",
                evidenceItems: [
                    "Screen saver/lock policy (GPO/Intune)",
                    "Inactivity timeout settings (15 min max)",
                    "Lock screen configuration screenshots",
                    "Mobile device lock settings",
                    "VDI session timeout configurations",
                    "Conditional Access session controls"
                ]
            },
            {
                controlId: "3.1.11",
                title: "Terminate user sessions after defined conditions",
                evidenceItems: [
                    "Session timeout policy documentation",
                    "Idle session termination settings",
                    "Maximum session duration settings",
                    "Re-authentication requirements",
                    "VPN session timeout configurations",
                    "Web application session management",
                    "Token lifetime configurations"
                ]
            },
            {
                controlId: "3.1.12",
                title: "Monitor and control remote access sessions",
                evidenceItems: [
                    "Remote access policy",
                    "VPN solution documentation and configurations",
                    "Remote Desktop Gateway logs",
                    "Conditional Access policies for remote access",
                    "Session recording for remote admin access",
                    "Remote access approval workflows",
                    "Azure Bastion/AWS SSM Session Manager logs"
                ]
            },
            {
                controlId: "3.1.13",
                title: "Employ cryptographic mechanisms for remote access",
                evidenceItems: [
                    "VPN encryption configuration (IKEv2, TLS 1.2+)",
                    "TLS/SSL certificate inventory",
                    "Remote Desktop encryption settings",
                    "SSH configuration (Protocol 2, strong ciphers)",
                    "FIPS 140-2 validation documentation",
                    "Cipher suite configurations"
                ]
            },
            {
                controlId: "3.1.14",
                title: "Route remote access via managed access control points",
                evidenceItems: [
                    "Network architecture diagram showing access points",
                    "VPN gateway configurations",
                    "Jump server/bastion host documentation",
                    "Firewall rules for remote access",
                    "Proxy server configurations",
                    "Zero Trust Network Access (ZTNA) documentation"
                ]
            },
            {
                controlId: "3.1.15",
                title: "Authorize remote execution of privileged commands",
                evidenceItems: [
                    "Policy for remote privileged access",
                    "Privileged Access Management (PAM) tool configuration",
                    "Just-in-time access approval records",
                    "Session recordings of remote admin sessions",
                    "Audit logs of remote privileged commands",
                    "Emergency access procedures"
                ]
            },
            {
                controlId: "3.1.16",
                title: "Authorize wireless access prior to connection",
                evidenceItems: [
                    "Wireless access policy",
                    "802.1X/RADIUS configuration",
                    "Certificate-based WiFi authentication",
                    "MAC address filtering (if used)",
                    "Guest wireless isolation configuration",
                    "Wireless access point inventory"
                ]
            },
            {
                controlId: "3.1.17",
                title: "Protect wireless access using authentication and encryption",
                evidenceItems: [
                    "WPA3/WPA2-Enterprise configuration",
                    "Wireless encryption settings (AES)",
                    "RADIUS server configuration",
                    "Wireless IDS/IPS configurations",
                    "Rogue AP detection capabilities",
                    "Wireless security assessment results"
                ]
            },
            {
                controlId: "3.1.18",
                title: "Control connection of mobile devices",
                evidenceItems: [
                    "Mobile Device Management (MDM) enrollment policies",
                    "Conditional Access requiring managed devices",
                    "BYOD policy and configurations",
                    "Mobile device inventory",
                    "Compliance policies for mobile devices",
                    "Jailbreak/root detection configurations"
                ]
            },
            {
                controlId: "3.1.19",
                title: "Encrypt CUI on mobile devices",
                evidenceItems: [
                    "MDM encryption enforcement policy",
                    "Device compliance report showing encryption status",
                    "BitLocker/FileVault configuration for laptops",
                    "iOS/Android encryption requirements",
                    "App protection policies for CUI apps",
                    "Containerization configurations"
                ]
            },
            {
                controlId: "3.1.20",
                title: "Verify and control connections to external systems",
                evidenceItems: [
                    "External connection authorization policy",
                    "Interconnection Security Agreements (ISAs)",
                    "Third-party connection inventory",
                    "API integration documentation",
                    "Cloud service connections inventory",
                    "B2B connection configurations"
                ]
            },
            {
                controlId: "3.1.21",
                title: "Limit use of portable storage devices on external systems",
                evidenceItems: [
                    "Portable storage policy",
                    "USB device control configurations (Intune/GPO)",
                    "Approved USB device list",
                    "DLP policies for removable media",
                    "Endpoint protection USB blocking logs"
                ]
            },
            {
                controlId: "3.1.22",
                title: "Control CUI posted or processed on publicly accessible systems",
                evidenceItems: [
                    "Public-facing system inventory",
                    "Content review procedures for public systems",
                    "Web application security configurations",
                    "Public website content approval workflow",
                    "CUI handling procedures for public systems"
                ]
            }
        ]
    },

    // ==================== AWARENESS AND TRAINING (AT) ====================
    awarenessTraining: {
        familyId: "AT",
        familyName: "Awareness and Training",
        controls: [
            {
                controlId: "3.2.1",
                title: "Ensure personnel are aware of security risks",
                evidenceItems: [
                    "Security awareness training program documentation",
                    "Training completion records (all users)",
                    "Annual security training curriculum",
                    "Phishing simulation results",
                    "Security newsletter/communications",
                    "New hire security orientation materials",
                    "Training platform configuration (KnowBe4, Proofpoint, etc.)",
                    "LMS training completion reports",
                    "Acknowledgment of acceptable use policy",
                    "CUI-specific handling training records"
                ]
            },
            {
                controlId: "3.2.2",
                title: "Ensure personnel are trained to carry out duties",
                evidenceItems: [
                    "Role-based training matrix",
                    "System administrator training records",
                    "Security team certifications (CISSP, Security+, etc.)",
                    "Specialized training for privileged users",
                    "Incident response training records",
                    "Developer secure coding training",
                    "Vendor/contractor training requirements"
                ]
            },
            {
                controlId: "3.2.3",
                title: "Provide security awareness training on recognizing threats",
                evidenceItems: [
                    "Insider threat awareness training",
                    "Social engineering awareness materials",
                    "Phishing identification training",
                    "Physical security awareness training",
                    "Reporting procedures training",
                    "Training effectiveness metrics"
                ]
            }
        ]
    },

    // ==================== AUDIT AND ACCOUNTABILITY (AU) ====================
    auditAccountability: {
        familyId: "AU",
        familyName: "Audit and Accountability",
        controls: [
            {
                controlId: "3.3.1",
                title: "Create and retain system audit logs",
                evidenceItems: [
                    "Audit logging policy",
                    "SIEM configuration and dashboard screenshots",
                    "Log source inventory",
                    "Sample audit logs from key systems",
                    "Windows Security Event log configurations",
                    "Linux auditd configurations",
                    "Cloud audit log configurations (Azure Activity, CloudTrail, etc.)",
                    "Application audit log configurations",
                    "Database audit configurations",
                    "Network device logging configurations"
                ],
                automatedCollection: {
                    azure: "Get-AzDiagnosticSetting -ResourceId $resourceId",
                    aws: "aws cloudtrail describe-trails",
                    sentinel: "SecurityEvent | take 100"
                }
            },
            {
                controlId: "3.3.2",
                title: "Ensure actions can be traced to individual users",
                evidenceItems: [
                    "User ID attribution in logs",
                    "Shared account prohibition policy",
                    "Service account logging configuration",
                    "Session correlation capabilities",
                    "Sample log showing user attribution",
                    "Named user account policy"
                ]
            },
            {
                controlId: "3.3.3",
                title: "Review and update logged events",
                evidenceItems: [
                    "Log review procedure",
                    "Annual audit log configuration review records",
                    "Log source additions/modifications",
                    "Audit log adequacy assessment"
                ]
            },
            {
                controlId: "3.3.4",
                title: "Alert on audit logging process failures",
                evidenceItems: [
                    "Logging failure alerting configuration",
                    "SIEM health monitoring dashboards",
                    "Agent heartbeat monitoring",
                    "Log ingestion delay alerts",
                    "Storage capacity alerts",
                    "Sample failure alerts"
                ]
            },
            {
                controlId: "3.3.5",
                title: "Correlate audit record review, analysis, and reporting",
                evidenceItems: [
                    "SIEM correlation rules inventory",
                    "Analytics rules configurations",
                    "Automated alert response procedures",
                    "Scheduled security reports",
                    "Threat hunting procedures",
                    "SOC runbooks"
                ]
            },
            {
                controlId: "3.3.6",
                title: "Provide audit record reduction and report generation",
                evidenceItems: [
                    "SIEM query/search capabilities demonstration",
                    "Report generation examples",
                    "Dashboard configurations",
                    "Data retention and archival procedures",
                    "Compliance report templates"
                ]
            },
            {
                controlId: "3.3.7",
                title: "Provide system capability for authoritative time source",
                evidenceItems: [
                    "NTP configuration (Group Policy/chrony)",
                    "Time source server documentation",
                    "Time synchronization verification",
                    "Cloud provider time sync documentation",
                    "Time drift monitoring"
                ]
            },
            {
                controlId: "3.3.8",
                title: "Protect audit information from unauthorized access",
                evidenceItems: [
                    "Audit log access controls",
                    "SIEM access role configurations",
                    "Log storage permissions",
                    "Immutable log storage configuration",
                    "Log integrity verification"
                ]
            },
            {
                controlId: "3.3.9",
                title: "Limit management of audit logging functionality",
                evidenceItems: [
                    "Audit admin role membership",
                    "Log configuration change monitoring",
                    "Privileged access for audit management",
                    "Change control for audit configurations"
                ]
            }
        ]
    },

    // ==================== CONFIGURATION MANAGEMENT (CM) ====================
    configurationManagement: {
        familyId: "CM",
        familyName: "Configuration Management",
        controls: [
            {
                controlId: "3.4.1",
                title: "Establish and maintain baseline configurations",
                evidenceItems: [
                    "Baseline configuration documentation",
                    "CIS Benchmark implementation evidence",
                    "STIG compliance reports",
                    "Group Policy Objects (GPO) export",
                    "Intune configuration profiles",
                    "Terraform/ARM/CloudFormation templates",
                    "Server build documentation",
                    "Workstation build documentation",
                    "Network device configurations",
                    "Golden image documentation",
                    "Configuration management database (CMDB)"
                ]
            },
            {
                controlId: "3.4.2",
                title: "Establish and enforce security configuration settings",
                evidenceItems: [
                    "Security baseline policy",
                    "Compliance scanning results (Defender, Qualys, etc.)",
                    "Policy compliance dashboards",
                    "Remediation tracking",
                    "Exception/deviation documentation",
                    "Hardening checklists"
                ]
            },
            {
                controlId: "3.4.3",
                title: "Track, review, approve changes to organizational systems",
                evidenceItems: [
                    "Change management policy",
                    "Change Advisory Board (CAB) meeting minutes",
                    "Change request tickets/records",
                    "Change approval workflow documentation",
                    "Emergency change procedures",
                    "Change implementation logs"
                ]
            },
            {
                controlId: "3.4.4",
                title: "Analyze security impact of changes prior to implementation",
                evidenceItems: [
                    "Security impact analysis procedures",
                    "Change risk assessment templates",
                    "Pre-implementation security reviews",
                    "Testing/staging environment documentation",
                    "Rollback procedures"
                ]
            },
            {
                controlId: "3.4.5",
                title: "Define and enforce physical and logical access restrictions",
                evidenceItems: [
                    "Access control procedures for system changes",
                    "Administrative access controls",
                    "Change window restrictions",
                    "Privileged access for configuration changes",
                    "Audit logs of configuration changes"
                ]
            },
            {
                controlId: "3.4.6",
                title: "Employ least functionality principle",
                evidenceItems: [
                    "Unnecessary services disabled documentation",
                    "Port/protocol restrictions",
                    "Application whitelisting configuration",
                    "Unused feature removal documentation",
                    "Network segmentation showing limited connectivity"
                ]
            },
            {
                controlId: "3.4.7",
                title: "Restrict, disable, or prevent nonessential programs",
                evidenceItems: [
                    "Application control policy",
                    "AppLocker/WDAC configurations",
                    "Software restriction policies",
                    "Unauthorized software detection",
                    "Software inventory management"
                ]
            },
            {
                controlId: "3.4.8",
                title: "Apply deny-by-exception policy for unauthorized software",
                evidenceItems: [
                    "Default deny application control",
                    "Approved software list",
                    "Exception request process",
                    "Blocked application logs"
                ]
            },
            {
                controlId: "3.4.9",
                title: "Control and monitor user-installed software",
                evidenceItems: [
                    "User software installation restrictions",
                    "Admin rights removal for standard users",
                    "Software request and approval process",
                    "Installed software monitoring/inventory"
                ]
            }
        ]
    },

    // ==================== IDENTIFICATION AND AUTHENTICATION (IA) ====================
    identificationAuthentication: {
        familyId: "IA",
        familyName: "Identification and Authentication",
        controls: [
            {
                controlId: "3.5.1",
                title: "Identify system users, processes, and devices",
                evidenceItems: [
                    "User account management procedures",
                    "User ID standards/naming conventions",
                    "Device inventory with identifiers",
                    "Service account inventory",
                    "Process/application identity documentation",
                    "Machine certificates for device identity"
                ]
            },
            {
                controlId: "3.5.2",
                title: "Authenticate users, processes, and devices",
                evidenceItems: [
                    "Authentication policy",
                    "Password policy configuration",
                    "MFA enrollment reports",
                    "Certificate-based authentication configuration",
                    "Service account authentication methods",
                    "Device certificate enrollment",
                    "SSO configuration"
                ]
            },
            {
                controlId: "3.5.3",
                title: "Use multifactor authentication for local and network access",
                evidenceItems: [
                    "MFA policy documentation",
                    "Conditional Access policies requiring MFA",
                    "MFA method configurations (FIDO2, Authenticator, etc.)",
                    "MFA coverage report (% of users enrolled)",
                    "Privileged account MFA requirements",
                    "VPN MFA configuration",
                    "Remote access MFA requirements"
                ],
                automatedCollection: {
                    azure: "Get-MgUser -All | Select-Object DisplayName,StrongAuthenticationMethods",
                    entra: "Get-MgIdentityConditionalAccessPolicy | Where-Object {$_.GrantControls.BuiltInControls -contains 'mfa'}"
                }
            },
            {
                controlId: "3.5.4",
                title: "Employ replay-resistant authentication mechanisms",
                evidenceItems: [
                    "FIDO2/WebAuthn configuration",
                    "Certificate-based authentication",
                    "One-time password configurations",
                    "Kerberos/modern authentication protocols",
                    "Deprecated protocol restrictions (NTLM, etc.)"
                ]
            },
            {
                controlId: "3.5.5",
                title: "Prevent reuse of identifiers",
                evidenceItems: [
                    "User ID reuse prohibition policy",
                    "Account lifecycle management procedures",
                    "Terminated user account handling",
                    "Unique identifier requirements"
                ]
            },
            {
                controlId: "3.5.6",
                title: "Disable identifiers after period of inactivity",
                evidenceItems: [
                    "Inactive account policy (45 days typical)",
                    "Automated account disable process",
                    "Inactive account reports",
                    "Account reactivation procedures"
                ]
            },
            {
                controlId: "3.5.7",
                title: "Enforce minimum password complexity",
                evidenceItems: [
                    "Password policy settings",
                    "Minimum length (14+ characters recommended)",
                    "Complexity requirements",
                    "Password strength enforcement",
                    "Banned password list configuration"
                ]
            },
            {
                controlId: "3.5.8",
                title: "Prohibit password reuse for specified generations",
                evidenceItems: [
                    "Password history setting (24 passwords recommended)",
                    "Password policy configuration",
                    "Application password reuse prevention"
                ]
            },
            {
                controlId: "3.5.9",
                title: "Allow temporary passwords for system logons with immediate change",
                evidenceItems: [
                    "Temporary password procedures",
                    "Force password change at first logon settings",
                    "Self-service password reset configuration",
                    "Temporary password expiration settings"
                ]
            },
            {
                controlId: "3.5.10",
                title: "Store and transmit only cryptographically-protected passwords",
                evidenceItems: [
                    "Password storage mechanisms (hashing algorithms)",
                    "LDAPS/secure LDAP configuration",
                    "TLS for authentication traffic",
                    "Password vault encryption",
                    "No plaintext password storage verification"
                ]
            },
            {
                controlId: "3.5.11",
                title: "Obscure feedback of authentication information",
                evidenceItems: [
                    "Password masking on input fields",
                    "Error message review (no username/password hints)",
                    "Failed logon message configuration",
                    "Application authentication error handling"
                ]
            }
        ]
    },

    // ==================== INCIDENT RESPONSE (IR) ====================
    incidentResponse: {
        familyId: "IR",
        familyName: "Incident Response",
        controls: [
            {
                controlId: "3.6.1",
                title: "Establish operational incident-handling capability",
                evidenceItems: [
                    "Incident Response Plan (IRP)",
                    "IR team roster and contact information",
                    "IR roles and responsibilities",
                    "Incident classification/severity definitions",
                    "Escalation procedures",
                    "Communication templates",
                    "Evidence preservation procedures",
                    "Containment procedures",
                    "Eradication and recovery procedures",
                    "Post-incident review process"
                ]
            },
            {
                controlId: "3.6.2",
                title: "Track, document, and report incidents",
                evidenceItems: [
                    "Incident tracking system/ticketing",
                    "Sample incident tickets",
                    "Incident reporting procedures",
                    "DIB-CS reporting requirements",
                    "Management reporting on incidents",
                    "Incident metrics and trends",
                    "Lessons learned documentation"
                ]
            },
            {
                controlId: "3.6.3",
                title: "Test incident response capability",
                evidenceItems: [
                    "Tabletop exercise documentation",
                    "IR drill/simulation records",
                    "Exercise after-action reports",
                    "Annual testing schedule",
                    "Improvement recommendations from testing"
                ]
            }
        ]
    },

    // ==================== MAINTENANCE (MA) ====================
    maintenance: {
        familyId: "MA",
        familyName: "Maintenance",
        controls: [
            {
                controlId: "3.7.1",
                title: "Perform maintenance on organizational systems",
                evidenceItems: [
                    "Maintenance policy and procedures",
                    "Scheduled maintenance calendar",
                    "Maintenance logs/records",
                    "Patch management procedures",
                    "Preventive maintenance schedules",
                    "Maintenance personnel authorization"
                ]
            },
            {
                controlId: "3.7.2",
                title: "Provide controls on maintenance tools",
                evidenceItems: [
                    "Approved maintenance tools list",
                    "Tool inspection procedures",
                    "Portable maintenance device policies",
                    "Tool access controls",
                    "Maintenance tool inventory"
                ]
            },
            {
                controlId: "3.7.3",
                title: "Ensure equipment removed for maintenance is sanitized",
                evidenceItems: [
                    "Media sanitization procedures for maintenance",
                    "Data removal verification before off-site repair",
                    "Loaner equipment procedures",
                    "Sanitization logs"
                ]
            },
            {
                controlId: "3.7.4",
                title: "Check media containing diagnostic programs for malware",
                evidenceItems: [
                    "Media scanning procedures",
                    "Diagnostic media inventory",
                    "Malware scanning logs for maintenance media"
                ]
            },
            {
                controlId: "3.7.5",
                title: "Require MFA for nonlocal maintenance sessions",
                evidenceItems: [
                    "Remote maintenance policy",
                    "MFA for remote maintenance tools",
                    "VPN MFA for maintenance access",
                    "RMM tool MFA configuration",
                    "Session logging for remote maintenance"
                ]
            },
            {
                controlId: "3.7.6",
                title: "Supervise nonlocal maintenance activities",
                evidenceItems: [
                    "Remote maintenance supervision procedures",
                    "Session recording for remote maintenance",
                    "Audit logs of maintenance activities",
                    "Vendor maintenance oversight procedures"
                ]
            }
        ]
    },

    // ==================== MEDIA PROTECTION (MP) ====================
    mediaProtection: {
        familyId: "MP",
        familyName: "Media Protection",
        controls: [
            {
                controlId: "3.8.1",
                title: "Protect CUI in storage",
                evidenceItems: [
                    "Data at rest encryption policy",
                    "BitLocker/FileVault configurations",
                    "Storage account encryption settings",
                    "Database encryption (TDE)",
                    "Backup encryption configurations",
                    "Key management procedures",
                    "Encrypted container solutions"
                ]
            },
            {
                controlId: "3.8.2",
                title: "Limit access to CUI on storage media",
                evidenceItems: [
                    "Media access control procedures",
                    "Physical media storage controls",
                    "USB device restrictions",
                    "File share permissions",
                    "Cloud storage access controls"
                ]
            },
            {
                controlId: "3.8.3",
                title: "Sanitize or destroy media before disposal or reuse",
                evidenceItems: [
                    "Media sanitization policy",
                    "Sanitization procedures by media type",
                    "Destruction certificates",
                    "Sanitization verification records",
                    "Vendor destruction agreements",
                    "Approved sanitization tools"
                ]
            },
            {
                controlId: "3.8.4",
                title: "Mark media with CUI markings",
                evidenceItems: [
                    "Media marking procedures",
                    "CUI marking guide",
                    "Label examples/templates",
                    "Electronic marking configurations"
                ]
            },
            {
                controlId: "3.8.5",
                title: "Control access to CUI media and maintain accountability",
                evidenceItems: [
                    "Media inventory",
                    "Chain of custody procedures",
                    "Media checkout/check-in logs",
                    "Secure media storage (safes, locked cabinets)"
                ]
            },
            {
                controlId: "3.8.6",
                title: "Implement cryptographic mechanisms for CUI during transport",
                evidenceItems: [
                    "Encrypted portable storage devices",
                    "Encrypted email for CUI transmission",
                    "Secure file transfer configurations",
                    "TLS configurations for web transfers"
                ]
            },
            {
                controlId: "3.8.7",
                title: "Control use of removable media on system components",
                evidenceItems: [
                    "Removable media policy",
                    "USB device control configurations",
                    "Approved removable media list",
                    "Autorun disabled configurations",
                    "DLP for removable media"
                ]
            },
            {
                controlId: "3.8.8",
                title: "Prohibit use of portable storage without identifiable owner",
                evidenceItems: [
                    "Authorized device registry",
                    "Device tagging/labeling procedures",
                    "Found media handling procedures"
                ]
            },
            {
                controlId: "3.8.9",
                title: "Protect backup confidentiality at storage locations",
                evidenceItems: [
                    "Backup encryption configurations",
                    "Backup storage access controls",
                    "Off-site backup protection",
                    "Cloud backup encryption"
                ]
            }
        ]
    },

    // ==================== PERSONNEL SECURITY (PS) ====================
    personnelSecurity: {
        familyId: "PS",
        familyName: "Personnel Security",
        controls: [
            {
                controlId: "3.9.1",
                title: "Screen individuals prior to authorizing access",
                evidenceItems: [
                    "Background check policy",
                    "Pre-employment screening procedures",
                    "Background check completion records",
                    "Contractor screening requirements",
                    "Screening vendor agreements",
                    "Re-screening schedule (if applicable)"
                ]
            },
            {
                controlId: "3.9.2",
                title: "Ensure CUI is protected during personnel actions",
                evidenceItems: [
                    "Termination procedures/checklist",
                    "Transfer procedures",
                    "Access revocation timelines",
                    "Exit interview procedures",
                    "Equipment return procedures",
                    "Access review for role changes"
                ]
            }
        ]
    },

    // ==================== PHYSICAL PROTECTION (PE) ====================
    physicalProtection: {
        familyId: "PE",
        familyName: "Physical Protection",
        controls: [
            {
                controlId: "3.10.1",
                title: "Limit physical access to authorized individuals",
                evidenceItems: [
                    "Physical security policy",
                    "Facility access control procedures",
                    "Badge/key card access system documentation",
                    "Authorized personnel list",
                    "Visitor management procedures",
                    "Data center access controls",
                    "Server room access logs"
                ]
            },
            {
                controlId: "3.10.2",
                title: "Protect and monitor the physical facility",
                evidenceItems: [
                    "Security camera locations/coverage",
                    "Video retention policy",
                    "Alarm system documentation",
                    "Security guard procedures",
                    "Physical security monitoring procedures",
                    "Intrusion detection systems"
                ]
            },
            {
                controlId: "3.10.3",
                title: "Escort visitors and monitor visitor activity",
                evidenceItems: [
                    "Visitor policy",
                    "Visitor sign-in/sign-out logs",
                    "Escort procedures",
                    "Visitor badge system",
                    "Visitor access restrictions"
                ]
            },
            {
                controlId: "3.10.4",
                title: "Maintain audit logs of physical access",
                evidenceItems: [
                    "Physical access log samples",
                    "Badge reader logs",
                    "Log retention configuration",
                    "Log review procedures"
                ]
            },
            {
                controlId: "3.10.5",
                title: "Control physical access devices",
                evidenceItems: [
                    "Key/badge inventory",
                    "Key/badge issuance procedures",
                    "Lost key/badge procedures",
                    "Combination/code change procedures",
                    "Master key control"
                ]
            },
            {
                controlId: "3.10.6",
                title: "Enforce safeguarding measures for CUI at alternate work sites",
                evidenceItems: [
                    "Remote work policy",
                    "Home office security requirements",
                    "Equipment security for remote work",
                    "Secure document handling at home",
                    "VPN/secure connection requirements"
                ]
            }
        ]
    },

    // ==================== RISK ASSESSMENT (RA) ====================
    riskAssessment: {
        familyId: "RA",
        familyName: "Risk Assessment",
        controls: [
            {
                controlId: "3.11.1",
                title: "Periodically assess risk to operations and assets",
                evidenceItems: [
                    "Risk assessment methodology",
                    "Annual risk assessment report",
                    "Asset inventory for risk assessment",
                    "Threat identification",
                    "Vulnerability identification",
                    "Risk register/matrix",
                    "Risk acceptance documentation",
                    "Risk treatment plans"
                ]
            },
            {
                controlId: "3.11.2",
                title: "Scan for vulnerabilities periodically and when new vulnerabilities identified",
                evidenceItems: [
                    "Vulnerability scanning policy",
                    "Scanning schedule",
                    "Vulnerability scan results",
                    "Remediation tracking",
                    "Scanning tool configurations",
                    "Authenticated vs unauthenticated scan results",
                    "Vulnerability trend reports"
                ]
            },
            {
                controlId: "3.11.3",
                title: "Remediate vulnerabilities in accordance with risk assessments",
                evidenceItems: [
                    "Vulnerability remediation policy (timelines)",
                    "Remediation tracking records",
                    "Critical/high vulnerability response times",
                    "Compensating controls for delays",
                    "Remediation verification"
                ]
            }
        ]
    },

    // ==================== SECURITY ASSESSMENT (CA) ====================
    securityAssessment: {
        familyId: "CA",
        familyName: "Security Assessment",
        controls: [
            {
                controlId: "3.12.1",
                title: "Periodically assess security controls",
                evidenceItems: [
                    "Security assessment plan",
                    "Assessment schedule",
                    "Internal assessment reports",
                    "Third-party assessment reports",
                    "Penetration test results",
                    "Compliance audit results",
                    "Control testing documentation"
                ]
            },
            {
                controlId: "3.12.2",
                title: "Develop and implement plans of action for deficiencies",
                evidenceItems: [
                    "Plan of Action and Milestones (POA&M)",
                    "POA&M tracking procedures",
                    "Milestone completion evidence",
                    "POA&M review meetings",
                    "Deficiency prioritization"
                ]
            },
            {
                controlId: "3.12.3",
                title: "Monitor security controls on an ongoing basis",
                evidenceItems: [
                    "Continuous monitoring strategy",
                    "Security dashboard/metrics",
                    "Control effectiveness monitoring",
                    "Automated compliance scanning",
                    "Security reporting cadence"
                ]
            },
            {
                controlId: "3.12.4",
                title: "Develop, document, and update system security plans",
                evidenceItems: [
                    "System Security Plan (SSP)",
                    "SSP review and update records",
                    "System boundary documentation",
                    "Control implementation statements",
                    "Authorization to Operate (if applicable)"
                ]
            }
        ]
    },

    // ==================== SYSTEM AND COMMUNICATIONS PROTECTION (SC) ====================
    systemCommunicationsProtection: {
        familyId: "SC",
        familyName: "System and Communications Protection",
        controls: [
            {
                controlId: "3.13.1",
                title: "Monitor, control, and protect communications at boundaries",
                evidenceItems: [
                    "Network architecture diagram",
                    "Firewall rule sets",
                    "IDS/IPS configurations",
                    "Web Application Firewall (WAF) configs",
                    "DMZ configuration",
                    "Network segmentation documentation",
                    "Traffic inspection capabilities"
                ]
            },
            {
                controlId: "3.13.2",
                title: "Employ architectural designs and techniques for security",
                evidenceItems: [
                    "Security architecture documentation",
                    "Defense-in-depth strategy",
                    "Network segmentation design",
                    "Zero Trust architecture documentation",
                    "Micro-segmentation configurations"
                ]
            },
            {
                controlId: "3.13.3",
                title: "Separate user functionality from system management",
                evidenceItems: [
                    "Administrative network segmentation",
                    "Management plane isolation",
                    "Jump server/PAW documentation",
                    "Out-of-band management",
                    "Admin vs user network diagrams"
                ]
            },
            {
                controlId: "3.13.4",
                title: "Prevent unauthorized and unintended information transfer",
                evidenceItems: [
                    "DLP policy configurations",
                    "Covert channel analysis",
                    "Data transfer monitoring",
                    "Egress filtering rules",
                    "Cloud App Security policies"
                ]
            },
            {
                controlId: "3.13.5",
                title: "Implement subnetworks for publicly accessible components",
                evidenceItems: [
                    "DMZ network diagram",
                    "Public-facing system placement",
                    "Firewall rules between DMZ and internal",
                    "Web server network configurations",
                    "Reverse proxy configurations"
                ]
            },
            {
                controlId: "3.13.6",
                title: "Deny network traffic by default",
                evidenceItems: [
                    "Default deny firewall rules",
                    "Implicit deny configurations",
                    "Whitelist-based traffic rules",
                    "NSG/Security Group configurations",
                    "Firewall rule order verification"
                ]
            },
            {
                controlId: "3.13.7",
                title: "Prevent remote devices from simultaneously connecting",
                evidenceItems: [
                    "Split tunneling policy (should be disabled)",
                    "VPN configuration preventing split tunnel",
                    "Always-on VPN configurations",
                    "Network isolation for remote devices"
                ]
            },
            {
                controlId: "3.13.8",
                title: "Implement cryptographic mechanisms for CUI transmission",
                evidenceItems: [
                    "TLS 1.2+ configuration",
                    "VPN encryption settings",
                    "Email encryption (S/MIME, TLS)",
                    "File transfer encryption",
                    "API encryption requirements",
                    "Certificate management"
                ]
            },
            {
                controlId: "3.13.9",
                title: "Terminate network connections after defined period",
                evidenceItems: [
                    "Session timeout configurations",
                    "VPN session limits",
                    "Firewall connection timeout settings",
                    "Application session management"
                ]
            },
            {
                controlId: "3.13.10",
                title: "Establish and manage cryptographic keys",
                evidenceItems: [
                    "Key management policy",
                    "Key lifecycle documentation",
                    "Key storage (HSM, Key Vault)",
                    "Key rotation procedures",
                    "Key backup and recovery",
                    "Certificate authority management"
                ]
            },
            {
                controlId: "3.13.11",
                title: "Employ FIPS-validated cryptography for CUI protection",
                evidenceItems: [
                    "FIPS 140-2 validation certificates",
                    "FIPS mode configurations",
                    "Cryptographic module inventory",
                    "Algorithm usage documentation",
                    "Schannel/crypto policy settings"
                ]
            },
            {
                controlId: "3.13.12",
                title: "Prohibit remote activation of collaborative computing devices",
                evidenceItems: [
                    "Webcam/microphone policies",
                    "Conference room device security",
                    "IoT device controls",
                    "Smart device policies"
                ]
            },
            {
                controlId: "3.13.13",
                title: "Control and monitor use of mobile code",
                evidenceItems: [
                    "Mobile code policy (JavaScript, ActiveX, etc.)",
                    "Browser security settings",
                    "Script execution controls",
                    "Macro security settings"
                ]
            },
            {
                controlId: "3.13.14",
                title: "Control and monitor use of VoIP",
                evidenceItems: [
                    "VoIP security policy",
                    "VoIP network segmentation",
                    "VoIP encryption (SRTP)",
                    "VoIP access controls",
                    "VoIP logging and monitoring"
                ]
            },
            {
                controlId: "3.13.15",
                title: "Protect authenticity of communications sessions",
                evidenceItems: [
                    "Session authentication mechanisms",
                    "Certificate pinning",
                    "DNSSEC configuration",
                    "Email authentication (SPF, DKIM, DMARC)"
                ]
            },
            {
                controlId: "3.13.16",
                title: "Protect CUI at rest",
                evidenceItems: [
                    "Full disk encryption",
                    "Database encryption",
                    "Cloud storage encryption",
                    "Backup encryption",
                    "Key management for encryption at rest"
                ]
            }
        ]
    },

    // ==================== SYSTEM AND INFORMATION INTEGRITY (SI) ====================
    systemInformationIntegrity: {
        familyId: "SI",
        familyName: "System and Information Integrity",
        controls: [
            {
                controlId: "3.14.1",
                title: "Identify, report, and correct system flaws in timely manner",
                evidenceItems: [
                    "Patch management policy",
                    "Patch management procedures",
                    "Patch deployment records",
                    "WSUS/SCCM/Intune patching configurations",
                    "Third-party patching solutions",
                    "Patching metrics/reports",
                    "Critical patch timelines"
                ]
            },
            {
                controlId: "3.14.2",
                title: "Provide protection from malicious code",
                evidenceItems: [
                    "Antimalware policy",
                    "Endpoint protection configurations",
                    "Defender for Endpoint deployment",
                    "Real-time protection settings",
                    "Signature update configurations",
                    "Malware detection logs/alerts",
                    "EDR configurations"
                ]
            },
            {
                controlId: "3.14.3",
                title: "Monitor system security alerts and advisories",
                evidenceItems: [
                    "Threat intelligence subscriptions",
                    "CISA alerts monitoring",
                    "Vendor security advisory tracking",
                    "Alert response procedures",
                    "Security feed integrations"
                ]
            },
            {
                controlId: "3.14.4",
                title: "Update malicious code protection mechanisms",
                evidenceItems: [
                    "Signature update frequency",
                    "Automatic update configurations",
                    "Update compliance reports",
                    "Engine version tracking"
                ]
            },
            {
                controlId: "3.14.5",
                title: "Perform periodic and real-time scans",
                evidenceItems: [
                    "Scheduled scan configurations",
                    "Real-time protection settings",
                    "On-access scanning configurations",
                    "Scan completion reports"
                ]
            },
            {
                controlId: "3.14.6",
                title: "Monitor systems for attacks and indicators of compromise",
                evidenceItems: [
                    "SIEM monitoring configurations",
                    "EDR/XDR deployment",
                    "Network monitoring (NDR)",
                    "IoC detection rules",
                    "Behavioral analytics",
                    "Alert investigation procedures",
                    "Threat hunting activities"
                ]
            },
            {
                controlId: "3.14.7",
                title: "Identify unauthorized use of systems",
                evidenceItems: [
                    "User behavior analytics (UBA/UEBA)",
                    "Anomaly detection configurations",
                    "Insider threat monitoring",
                    "Account compromise detection",
                    "Impossible travel alerts"
                ]
            }
        ]
    }
};

// Export
if (typeof window !== 'undefined') window.MSP_EVIDENCE_LISTS = MSP_EVIDENCE_LISTS;
if (typeof module !== 'undefined' && module.exports) module.exports = MSP_EVIDENCE_LISTS;
