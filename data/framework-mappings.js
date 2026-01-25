// Cross-Framework Control Mappings
// Maps NIST 800-171 Rev 2 controls to NIST 800-53 Rev 5 and CMMC L1/L2
// Reference: NIST SP 800-171 Rev 2 Appendix D, CMMC Level 1 Assessment Guide
// Classification: Basic/Derived per NIST 800-171; L1/L2 per CMMC 2.0 (17 L1 controls from FAR 52.204-21)
// NOTE: FedRAMP 20x KSIs are dynamically derived from 800-53 controls via fedramp-20x-ksi.js

const FRAMEWORK_MAPPINGS = {
    // === ACCESS CONTROL (AC) ===
    "3.1.1": {
        nist80053: ["AC-2", "AC-3", "AC-17"],
        cmmc: { level: 1, domain: "AC", practice: "AC.L1-3.1.1" },
        classification: "Basic",
        description: "Limit system access to authorized users, processes, and devices"
    },
    "3.1.2": {
        nist80053: ["AC-2", "AC-3", "AC-6"],
        cmmc: { level: 1, domain: "AC", practice: "AC.L1-3.1.2" },
        classification: "Basic",
        description: "Limit system access to authorized transaction types and functions"
    },
    "3.1.3": {
        nist80053: ["AC-4"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.3" },
        classification: "Derived",
        description: "Control CUI flow in accordance with approved authorizations"
    },
    "3.1.4": {
        nist80053: ["AC-5", "AC-6"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.4" },
        classification: "Derived",
        description: "Separate duties of individuals to reduce risk of malicious activity"
    },
    "3.1.5": {
        nist80053: ["AC-6(1)", "AC-6(2)", "AC-6(5)", "AC-6(9)", "AC-6(10)"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.5" },
        classification: "Derived",
        description: "Employ principle of least privilege"
    },
    "3.1.6": {
        nist80053: ["AC-6(3)"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.6" },
        classification: "Derived",
        description: "Use non-privileged accounts when accessing non-security functions"
    },
    "3.1.7": {
        nist80053: ["AC-6(7)", "AC-6(8)"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.7" },
        classification: "Derived",
        description: "Prevent non-privileged users from executing privileged functions"
    },
    "3.1.8": {
        nist80053: ["AC-7"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.8" },
        classification: "Derived",
        description: "Limit unsuccessful logon attempts"
    },
    "3.1.9": {
        nist80053: ["AC-8"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.9" },
        classification: "Derived",
        description: "Provide privacy and security notices"
    },
    "3.1.10": {
        nist80053: ["AC-11", "AC-11(1)"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.10" },
        classification: "Derived",
        description: "Use session lock with pattern-hiding displays"
    },
    "3.1.11": {
        nist80053: ["AC-12"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.11" },
        classification: "Derived",
        description: "Terminate user sessions automatically"
    },
    "3.1.12": {
        nist80053: ["AC-17(1)", "AC-17(2)", "AC-17(3)", "AC-17(4)"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.12" },
        classification: "Derived",
        description: "Monitor and control remote access sessions"
    },
    "3.1.13": {
        nist80053: ["AC-17(2)"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.13" },
        classification: "Derived",
        description: "Employ cryptographic mechanisms for remote access"
    },
    "3.1.14": {
        nist80053: ["AC-17(3)"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.14" },
        classification: "Derived",
        description: "Route remote access via managed access control points"
    },
    "3.1.15": {
        nist80053: ["AC-18"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.15" },
        classification: "Derived",
        description: "Authorize wireless access"
    },
    "3.1.16": {
        nist80053: ["AC-18(1)"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.16" },
        classification: "Derived",
        description: "Protect wireless access using authentication and encryption"
    },
    "3.1.17": {
        nist80053: ["AC-19"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.17" },
        classification: "Derived",
        description: "Control connection of mobile devices"
    },
    "3.1.18": {
        nist80053: ["AC-19(5)"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.18" },
        classification: "Derived",
        description: "Encrypt CUI on mobile devices"
    },
    "3.1.19": {
        nist80053: ["AC-20", "AC-20(1)", "AC-20(2)"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.19" },
        classification: "Derived",
        description: "Control CUI on external systems"
    },
    "3.1.20": {
        nist80053: ["AC-20(1)"],
        cmmc: { level: 1, domain: "AC", practice: "AC.L1-3.1.20" },
        classification: "Derived",
        description: "Verify external systems implement required controls"
    },
    "3.1.21": {
        nist80053: ["AC-20(2)"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.21" },
        classification: "Derived",
        description: "Limit use of portable storage on external systems"
    },
    "3.1.22": {
        nist80053: ["AC-22"],
        cmmc: { level: 1, domain: "AC", practice: "AC.L1-3.1.22" },
        classification: "Derived",
        description: "Control publicly accessible content"
    },

    // === AWARENESS AND TRAINING (AT) ===
    "3.2.1": {
        nist80053: ["AT-2", "AT-2(2)"],
        cmmc: { level: 2, domain: "AT", practice: "AT.L2-3.2.1" },
        classification: "Basic",
        description: "Ensure personnel are aware of security risks"
    },
    "3.2.2": {
        nist80053: ["AT-3"],
        cmmc: { level: 2, domain: "AT", practice: "AT.L2-3.2.2" },
        classification: "Basic",
        description: "Train personnel on security responsibilities"
    },
    "3.2.3": {
        nist80053: ["AT-2(3)"],
        cmmc: { level: 2, domain: "AT", practice: "AT.L2-3.2.3" },
        classification: "Derived",
        description: "Provide security awareness training on insider threats"
    },

    // === AUDIT AND ACCOUNTABILITY (AU) ===
    "3.3.1": {
        nist80053: ["AU-2", "AU-3", "AU-3(1)", "AU-6", "AU-11", "AU-12"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.1" },
        classification: "Basic",
        description: "Create and retain audit records"
    },
    "3.3.2": {
        nist80053: ["AU-2(3)", "AU-3(1)"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.2" },
        classification: "Basic",
        description: "Ensure actions are uniquely traced to individuals"
    },
    "3.3.3": {
        nist80053: ["AU-6(4)"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.3" },
        classification: "Derived",
        description: "Review and update audited events"
    },
    "3.3.4": {
        nist80053: ["AU-7"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.4" },
        classification: "Derived",
        description: "Alert on audit logging process failures"
    },
    "3.3.5": {
        nist80053: ["AU-7(1)"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.5" },
        classification: "Derived",
        description: "Correlate audit review, analysis, and reporting"
    },
    "3.3.6": {
        nist80053: ["AU-8"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.6" },
        classification: "Derived",
        description: "Provide audit record reduction and report generation"
    },
    "3.3.7": {
        nist80053: ["AU-8(1)"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.7" },
        classification: "Derived",
        description: "Use internal system clocks synchronized to authoritative source"
    },
    "3.3.8": {
        nist80053: ["AU-9"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.8" },
        classification: "Derived",
        description: "Protect audit information from unauthorized access"
    },
    "3.3.9": {
        nist80053: ["AU-9(4)"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.9" },
        classification: "Derived",
        description: "Limit management of audit functionality"
    },

    // === CONFIGURATION MANAGEMENT (CM) ===
    "3.4.1": {
        nist80053: ["CM-2", "CM-6", "CM-8", "CM-8(1)"],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.1" },
        classification: "Basic",
        description: "Establish and maintain baseline configurations"
    },
    "3.4.2": {
        nist80053: ["CM-2(7)", "CM-7", "CM-7(1)", "CM-7(2)", "CM-7(5)"],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.2" },
        classification: "Basic",
        description: "Establish security configuration settings"
    },
    "3.4.3": {
        nist80053: ["CM-3", "CM-4"],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.3" },
        classification: "Derived",
        description: "Track, review, approve changes to systems"
    },
    "3.4.4": {
        nist80053: ["CM-4"],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.4" },
        classification: "Derived",
        description: "Analyze security impact of changes"
    },
    "3.4.5": {
        nist80053: ["CM-5"],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.5" },
        classification: "Derived",
        description: "Define and enforce access restrictions for change"
    },
    "3.4.6": {
        nist80053: ["CM-7", "CM-7(1)", "CM-7(2)"],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.6" },
        classification: "Derived",
        description: "Employ principle of least functionality"
    },
    "3.4.7": {
        nist80053: ["CM-7(4)", "CM-7(5)"],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.7" },
        classification: "Derived",
        description: "Restrict and disable nonessential programs"
    },
    "3.4.8": {
        nist80053: ["CM-10", "CM-11"],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.8" },
        classification: "Derived",
        description: "Apply deny-by-exception policy for software"
    },
    "3.4.9": {
        nist80053: ["CM-11"],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.9" },
        classification: "Derived",
        description: "Control and monitor user-installed software"
    },

    // === IDENTIFICATION AND AUTHENTICATION (IA) ===
    "3.5.1": {
        nist80053: ["IA-2", "IA-5"],
        cmmc: { level: 1, domain: "IA", practice: "IA.L1-3.5.1" },
        classification: "Basic",
        description: "Identify system users, processes, and devices"
    },
    "3.5.2": {
        nist80053: ["IA-2", "IA-5"],
        cmmc: { level: 1, domain: "IA", practice: "IA.L1-3.5.2" },
        classification: "Basic",
        description: "Authenticate identities before access"
    },
    "3.5.3": {
        nist80053: ["IA-2(1)", "IA-2(2)", "IA-2(3)"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.3" },
        classification: "Derived",
        description: "Use multifactor authentication"
    },
    "3.5.4": {
        nist80053: ["IA-2(8)", "IA-2(9)"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.4" },
        classification: "Derived",
        description: "Employ replay-resistant authentication"
    },
    "3.5.5": {
        nist80053: ["IA-3"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.5" },
        classification: "Derived",
        description: "Prevent reuse of identifiers"
    },
    "3.5.6": {
        nist80053: ["IA-4"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.6" },
        classification: "Derived",
        description: "Disable identifiers after period of inactivity"
    },
    "3.5.7": {
        nist80053: ["IA-5(1)"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.7" },
        classification: "Derived",
        description: "Enforce minimum password complexity"
    },
    "3.5.8": {
        nist80053: ["IA-5(1)"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.8" },
        classification: "Derived",
        description: "Prohibit password reuse"
    },
    "3.5.9": {
        nist80053: ["IA-5(1)"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.9" },
        classification: "Derived",
        description: "Allow temporary passwords for system logon"
    },
    "3.5.10": {
        nist80053: ["IA-5(2)"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.10" },
        classification: "Derived",
        description: "Store and transmit only cryptographically-protected passwords"
    },
    "3.5.11": {
        nist80053: ["IA-6"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.11" },
        classification: "Derived",
        description: "Obscure feedback of authentication information"
    },

    // === INCIDENT RESPONSE (IR) ===
    "3.6.1": {
        nist80053: ["IR-2", "IR-4", "IR-5", "IR-6", "IR-7"],
        cmmc: { level: 2, domain: "IR", practice: "IR.L2-3.6.1" },
        classification: "Basic",
        description: "Establish incident-handling capability"
    },
    "3.6.2": {
        nist80053: ["IR-6"],
        cmmc: { level: 2, domain: "IR", practice: "IR.L2-3.6.2" },
        classification: "Basic",
        description: "Track, document, and report incidents"
    },
    "3.6.3": {
        nist80053: ["IR-8"],
        cmmc: { level: 2, domain: "IR", practice: "IR.L2-3.6.3" },
        classification: "Derived",
        description: "Test incident response capability"
    },

    // === MAINTENANCE (MA) ===
    "3.7.1": {
        nist80053: ["MA-2", "MA-3", "MA-3(1)", "MA-3(2)"],
        cmmc: { level: 2, domain: "MA", practice: "MA.L2-3.7.1" },
        classification: "Basic",
        description: "Perform maintenance on organizational systems"
    },
    "3.7.2": {
        nist80053: ["MA-2", "MA-3"],
        cmmc: { level: 2, domain: "MA", practice: "MA.L2-3.7.2" },
        classification: "Basic",
        description: "Control tools and media for maintenance"
    },
    "3.7.3": {
        nist80053: ["MA-3(2)"],
        cmmc: { level: 2, domain: "MA", practice: "MA.L2-3.7.3" },
        classification: "Derived",
        description: "Sanitize equipment for off-site maintenance"
    },
    "3.7.4": {
        nist80053: ["MA-3(1)"],
        cmmc: { level: 2, domain: "MA", practice: "MA.L2-3.7.4" },
        classification: "Derived",
        description: "Check media for malicious code before use"
    },
    "3.7.5": {
        nist80053: ["MA-4"],
        cmmc: { level: 2, domain: "MA", practice: "MA.L2-3.7.5" },
        classification: "Derived",
        description: "Require multifactor authentication for nonlocal maintenance"
    },
    "3.7.6": {
        nist80053: ["MA-5"],
        cmmc: { level: 2, domain: "MA", practice: "MA.L2-3.7.6" },
        classification: "Derived",
        description: "Supervise maintenance activities"
    },

    // === MEDIA PROTECTION (MP) ===
    "3.8.1": {
        nist80053: ["MP-2", "MP-4", "MP-6"],
        cmmc: { level: 2, domain: "MP", practice: "MP.L2-3.8.1" },
        classification: "Basic",
        description: "Protect system media containing CUI"
    },
    "3.8.2": {
        nist80053: ["MP-4"],
        cmmc: { level: 2, domain: "MP", practice: "MP.L2-3.8.2" },
        classification: "Basic",
        description: "Limit access to CUI on system media"
    },
    "3.8.3": {
        nist80053: ["MP-6"],
        cmmc: { level: 1, domain: "MP", practice: "MP.L1-3.8.3" },
        classification: "Basic",
        description: "Sanitize or destroy media containing CUI"
    },
    "3.8.4": {
        nist80053: ["MP-3"],
        cmmc: { level: 2, domain: "MP", practice: "MP.L2-3.8.4" },
        classification: "Derived",
        description: "Mark media with necessary CUI markings"
    },
    "3.8.5": {
        nist80053: ["MP-5", "MP-5(4)"],
        cmmc: { level: 2, domain: "MP", practice: "MP.L2-3.8.5" },
        classification: "Derived",
        description: "Control access to media during transport"
    },
    "3.8.6": {
        nist80053: ["MP-5(4)"],
        cmmc: { level: 2, domain: "MP", practice: "MP.L2-3.8.6" },
        classification: "Derived",
        description: "Implement cryptographic mechanisms during transport"
    },
    "3.8.7": {
        nist80053: ["MP-7"],
        cmmc: { level: 2, domain: "MP", practice: "MP.L2-3.8.7" },
        classification: "Derived",
        description: "Control use of removable media"
    },
    "3.8.8": {
        nist80053: ["MP-7(1)"],
        cmmc: { level: 2, domain: "MP", practice: "MP.L2-3.8.8" },
        classification: "Derived",
        description: "Prohibit use of portable storage when owner unknown"
    },
    "3.8.9": {
        nist80053: ["MP-6(8)"],
        cmmc: { level: 2, domain: "MP", practice: "MP.L2-3.8.9" },
        classification: "Derived",
        description: "Protect backup CUI at storage locations"
    },

    // === PERSONNEL SECURITY (PS) ===
    "3.9.1": {
        nist80053: ["PS-3", "PS-6", "PS-7"],
        cmmc: { level: 2, domain: "PS", practice: "PS.L2-3.9.1" },
        classification: "Basic",
        description: "Screen individuals before CUI access"
    },
    "3.9.2": {
        nist80053: ["PS-4", "PS-5"],
        cmmc: { level: 2, domain: "PS", practice: "PS.L2-3.9.2" },
        classification: "Basic",
        description: "Protect CUI during personnel actions"
    },

    // === PHYSICAL PROTECTION (PE) ===
    "3.10.1": {
        nist80053: ["PE-2", "PE-6"],
        cmmc: { level: 1, domain: "PE", practice: "PE.L1-3.10.1" },
        classification: "Basic",
        description: "Limit physical access to authorized individuals"
    },
    "3.10.2": {
        nist80053: ["PE-2", "PE-3", "PE-4", "PE-5"],
        cmmc: { level: 2, domain: "PE", practice: "PE.L2-3.10.2" },
        classification: "Basic",
        description: "Protect and monitor physical facility"
    },
    "3.10.3": {
        nist80053: ["PE-3"],
        cmmc: { level: 1, domain: "PE", practice: "PE.L1-3.10.3" },
        classification: "Derived",
        description: "Escort and monitor visitors"
    },
    "3.10.4": {
        nist80053: ["PE-6"],
        cmmc: { level: 1, domain: "PE", practice: "PE.L1-3.10.4" },
        classification: "Derived",
        description: "Maintain audit logs of physical access"
    },
    "3.10.5": {
        nist80053: ["PE-6(1)"],
        cmmc: { level: 1, domain: "PE", practice: "PE.L1-3.10.5" },
        classification: "Derived",
        description: "Control and manage physical access devices"
    },
    "3.10.6": {
        nist80053: ["PE-17"],
        cmmc: { level: 2, domain: "PE", practice: "PE.L2-3.10.6" },
        classification: "Derived",
        description: "Enforce safeguards at alternate work sites"
    },

    // === RISK ASSESSMENT (RA) ===
    "3.11.1": {
        nist80053: ["RA-3"],
        cmmc: { level: 2, domain: "RA", practice: "RA.L2-3.11.1" },
        classification: "Basic",
        description: "Periodically assess risk to operations"
    },
    "3.11.2": {
        nist80053: ["RA-5", "RA-5(5)"],
        cmmc: { level: 2, domain: "RA", practice: "RA.L2-3.11.2" },
        classification: "Derived",
        description: "Scan for vulnerabilities periodically"
    },
    "3.11.3": {
        nist80053: ["RA-5"],
        cmmc: { level: 2, domain: "RA", practice: "RA.L2-3.11.3" },
        classification: "Derived",
        description: "Remediate vulnerabilities per risk assessments"
    },

    // === SECURITY ASSESSMENT (CA) ===
    "3.12.1": {
        nist80053: ["CA-2", "CA-5", "CA-7", "PL-2"],
        cmmc: { level: 2, domain: "CA", practice: "CA.L2-3.12.1" },
        classification: "Basic",
        description: "Periodically assess security controls"
    },
    "3.12.2": {
        nist80053: ["CA-2", "CA-5", "CA-7"],
        cmmc: { level: 2, domain: "CA", practice: "CA.L2-3.12.2" },
        classification: "Basic",
        description: "Develop and implement remediation plans"
    },
    "3.12.3": {
        nist80053: ["CA-7"],
        cmmc: { level: 2, domain: "CA", practice: "CA.L2-3.12.3" },
        classification: "Basic",
        description: "Monitor security controls on ongoing basis"
    },
    "3.12.4": {
        nist80053: ["PL-2", "PM-1", "PM-6"],
        cmmc: { level: 2, domain: "CA", practice: "CA.L2-3.12.4" },
        classification: "Basic",
        description: "Develop and update system security plans"
    },

    // === SYSTEM AND COMMUNICATIONS PROTECTION (SC) ===
    "3.13.1": {
        nist80053: ["SC-7", "SA-8"],
        cmmc: { level: 1, domain: "SC", practice: "SC.L1-3.13.1" },
        classification: "Basic",
        description: "Monitor and control communications at boundaries"
    },
    "3.13.2": {
        nist80053: ["SA-8"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.2" },
        classification: "Basic",
        description: "Employ architectural designs for security"
    },
    "3.13.3": {
        nist80053: ["SC-2"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.3" },
        classification: "Derived",
        description: "Separate user functionality from management"
    },
    "3.13.4": {
        nist80053: ["SC-3"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.4" },
        classification: "Derived",
        description: "Prevent unauthorized information transfer"
    },
    "3.13.5": {
        nist80053: ["SC-7", "SC-7(5)"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.5" },
        classification: "Derived",
        description: "Implement subnetworks for publicly accessible components"
    },
    "3.13.6": {
        nist80053: ["SC-7(7)"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.6" },
        classification: "Derived",
        description: "Deny network communications by default"
    },
    "3.13.7": {
        nist80053: ["SC-7(18)"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.7" },
        classification: "Derived",
        description: "Prevent remote devices from split tunneling"
    },
    "3.13.8": {
        nist80053: ["SC-8", "SC-8(1)"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.8" },
        classification: "Derived",
        description: "Implement cryptographic mechanisms for CUI in transit"
    },
    "3.13.9": {
        nist80053: ["SC-10"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.9" },
        classification: "Derived",
        description: "Terminate network connections at end of sessions"
    },
    "3.13.10": {
        nist80053: ["SC-12"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.10" },
        classification: "Derived",
        description: "Establish and manage cryptographic keys"
    },
    "3.13.11": {
        nist80053: ["SC-13"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.11" },
        classification: "Derived",
        description: "Employ FIPS-validated cryptography"
    },
    "3.13.12": {
        nist80053: ["SC-15"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.12" },
        classification: "Derived",
        description: "Prohibit remote activation of collaborative devices"
    },
    "3.13.13": {
        nist80053: ["SC-18"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.13" },
        classification: "Derived",
        description: "Control and monitor use of mobile code"
    },
    "3.13.14": {
        nist80053: ["SC-19"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.14" },
        classification: "Derived",
        description: "Control and monitor use of VoIP"
    },
    "3.13.15": {
        nist80053: ["SC-20", "SC-21"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.15" },
        classification: "Derived",
        description: "Protect authenticity of communications sessions"
    },
    "3.13.16": {
        nist80053: ["SC-28", "SC-28(1)"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.16" },
        classification: "Derived",
        description: "Protect CUI at rest"
    },

    // === SYSTEM AND INFORMATION INTEGRITY (SI) ===
    "3.14.1": {
        nist80053: ["SI-2", "SI-3", "SI-5"],
        cmmc: { level: 1, domain: "SI", practice: "SI.L1-3.14.1" },
        classification: "Basic",
        description: "Identify, report, and correct flaws in timely manner"
    },
    "3.14.2": {
        nist80053: ["SI-3"],
        cmmc: { level: 1, domain: "SI", practice: "SI.L1-3.14.2" },
        classification: "Basic",
        description: "Provide protection from malicious code"
    },
    "3.14.3": {
        nist80053: ["SI-5"],
        cmmc: { level: 2, domain: "SI", practice: "SI.L2-3.14.3" },
        classification: "Basic",
        description: "Monitor system security alerts and advisories"
    },
    "3.14.4": {
        nist80053: ["SI-3"],
        cmmc: { level: 1, domain: "SI", practice: "SI.L1-3.14.4" },
        classification: "Derived",
        description: "Update malicious code protection mechanisms"
    },
    "3.14.5": {
        nist80053: ["SI-3"],
        cmmc: { level: 1, domain: "SI", practice: "SI.L1-3.14.5" },
        classification: "Derived",
        description: "Perform periodic and real-time scans"
    },
    "3.14.6": {
        nist80053: ["SI-4"],
        cmmc: { level: 2, domain: "SI", practice: "SI.L2-3.14.6" },
        classification: "Derived",
        description: "Monitor systems to detect attacks"
    },
    "3.14.7": {
        nist80053: ["SI-4(4)", "SI-4(5)"],
        cmmc: { level: 2, domain: "SI", practice: "SI.L2-3.14.7" },
        classification: "Derived",
        description: "Identify unauthorized use of systems"
    },

    // === CONTINGENCY PLANNING (implied by recovery-related controls) ===
    // These map to the RPL KSI family for recovery planning
    "_recovery": {
        description: "Recovery planning KSIs (apply to CP controls)"
    }
};

// Helper function to get framework mappings for a control
function getFrameworkMappings(controlId) {
    const baseControlId = controlId.replace(/\[.*\]$/, '');
    return FRAMEWORK_MAPPINGS[baseControlId] || null;
}

// Helper function to get FedRAMP 20x KSIs for a control
function getFedRAMP20xKSIs(controlId) {
    const mapping = getFrameworkMappings(controlId);
    return mapping ? (mapping.fedramp20x || []) : [];
}

// Helper function to get NIST 800-53 controls for a 800-171 control
function getNIST80053Controls(controlId) {
    const mapping = getFrameworkMappings(controlId);
    return mapping ? mapping.nist80053 : null;
}

// Helper function to get CMMC practice info
function getCMMCPractice(controlId) {
    const mapping = getFrameworkMappings(controlId);
    return mapping ? mapping.cmmc : null;
}
