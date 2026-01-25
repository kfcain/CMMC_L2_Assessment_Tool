// Cross-Framework Control Mappings
// Maps NIST 800-171 Rev 2 controls to NIST 800-53 Rev 5 and FedRAMP 20x KSI (Phase 2)
// Reference: NIST SP 800-171 Rev 2 Appendix D, FedRAMP 20x Phase 2 Pilot (Low/Moderate)
// NOTE: FedRAMP High baselines removed - focusing on 20x pilot programs for Low/Moderate

const FRAMEWORK_MAPPINGS = {
    // === ACCESS CONTROL (AC) ===
    "3.1.1": {
        nist80053: ["AC-2", "AC-3", "AC-17"],
        fedramp20x: ["KSI-IAM-01", "KSI-IAM-04", "KSI-IAM-05", "KSI-IAM-06", "KSI-IAM-07"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.1" },
        description: "Limit system access to authorized users, processes, and devices"
    },
    "3.1.2": {
        nist80053: ["AC-2", "AC-3", "AC-6"],
        fedramp20x: ["KSI-IAM-02", "KSI-IAM-04", "KSI-IAM-05"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.2" },
        description: "Limit system access to authorized transaction types and functions"
    },
    "3.1.3": {
        nist80053: ["AC-4"],
        fedramp20x: ["KSI-AFR-03", "KSI-IAM-03", "KSI-IAM-04", "KSI-IAM-05"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.3" },
        description: "Control CUI flow in accordance with approved authorizations"
    },
    "3.1.4": {
        nist80053: ["AC-5", "AC-6"],
        fedramp20x: ["KSI-IAM-04", "KSI-IAM-05", "KSI-PIY-04", "KSI-PIY-06"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.4" },
        description: "Separate duties of individuals to reduce risk of malicious activity"
    },
    "3.1.5": {
        nist80053: ["AC-6(1)", "AC-6(2)", "AC-6(5)", "AC-6(9)", "AC-6(10)"],
        fedramp20x: ["KSI-IAM-04", "KSI-IAM-05", "KSI-MLA-02"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.5" },
        description: "Employ principle of least privilege"
    },
    "3.1.6": {
        nist80053: ["AC-6(3)"],
        fedramp20x: ["KSI-IAM-04", "KSI-IAM-05"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.6" },
        description: "Use non-privileged accounts when accessing non-security functions"
    },
    "3.1.7": {
        nist80053: ["AC-6(7)", "AC-6(8)"],
        fedramp20x: ["KSI-IAM-04", "KSI-IAM-05", "KSI-IAM-07"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.7" },
        description: "Prevent non-privileged users from executing privileged functions"
    },
    "3.1.8": {
        nist80053: ["AC-7"],
        fedramp20x: ["KSI-IAM-04", "KSI-IAM-06"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.8" },
        description: "Limit unsuccessful logon attempts"
    },
    "3.1.9": {
        nist80053: ["AC-8"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.9" },
        description: "Provide privacy and security notices"
    },
    "3.1.10": {
        nist80053: ["AC-11", "AC-11(1)"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.10" },
        description: "Use session lock with pattern-hiding displays"
    },
    "3.1.11": {
        nist80053: ["AC-12"],
        fedramp20x: ["KSI-CNA-03", "KSI-IAM-05"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.11" },
        description: "Terminate user sessions automatically"
    },
    "3.1.12": {
        nist80053: ["AC-17(1)", "AC-17(2)", "AC-17(3)", "AC-17(4)"],
        fedramp20x: ["KSI-IAM-04", "KSI-IAM-05", "KSI-MLA-01", "KSI-MLA-07", "KSI-SVC-02", "KSI-SVC-06"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.12" },
        description: "Monitor and control remote access sessions"
    },
    "3.1.13": {
        nist80053: ["AC-17(2)"],
        fedramp20x: ["KSI-IAM-05", "KSI-SVC-02", "KSI-SVC-06"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.13" },
        description: "Employ cryptographic mechanisms for remote access"
    },
    "3.1.14": {
        nist80053: ["AC-17(3)"],
        fedramp20x: ["KSI-CNA-01", "KSI-CNA-02", "KSI-CNA-07", "KSI-IAM-05"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.14" },
        description: "Route remote access via managed access control points"
    },
    "3.1.15": {
        nist80053: ["AC-18"],
        fedramp20x: ["KSI-CNA-02"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.15" },
        description: "Authorize wireless access"
    },
    "3.1.16": {
        nist80053: ["AC-18(1)"],
        fedramp20x: ["KSI-CNA-02"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.16" },
        description: "Protect wireless access using authentication and encryption"
    },
    "3.1.17": {
        nist80053: ["AC-19"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.17" },
        description: "Control connection of mobile devices"
    },
    "3.1.18": {
        nist80053: ["AC-19(5)"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.18" },
        description: "Encrypt CUI on mobile devices"
    },
    "3.1.19": {
        nist80053: ["AC-20", "AC-20(1)", "AC-20(2)"],
        fedramp20x: ["KSI-CNA-02", "KSI-IAM-04", "KSI-IAM-05", "KSI-MLA-01", "KSI-MLA-07", "KSI-TPR-03", "KSI-TPR-04"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.19" },
        description: "Control CUI on external systems"
    },
    "3.1.20": {
        nist80053: ["AC-20(1)"],
        fedramp20x: ["KSI-CNA-02", "KSI-IAM-04", "KSI-IAM-05", "KSI-MLA-01", "KSI-MLA-07", "KSI-TPR-03", "KSI-TPR-04"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.20" },
        description: "Verify external systems implement required controls"
    },
    "3.1.21": {
        nist80053: ["AC-20(2)"],
        fedramp20x: ["KSI-CNA-02", "KSI-IAM-04", "KSI-IAM-05", "KSI-TPR-03", "KSI-TPR-04"],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.21" },
        description: "Limit use of portable storage on external systems"
    },
    "3.1.22": {
        nist80053: ["AC-22"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "AC", practice: "AC.L2-3.1.22" },
        description: "Control publicly accessible content"
    },

    // === AWARENESS AND TRAINING (AT) ===
    "3.2.1": {
        nist80053: ["AT-2", "AT-2(2)"],
        fedramp20x: ["KSI-CED-01", "KSI-CED-02"],
        cmmc: { level: 2, domain: "AT", practice: "AT.L2-3.2.1" },
        description: "Ensure personnel are aware of security risks"
    },
    "3.2.2": {
        nist80053: ["AT-3"],
        fedramp20x: ["KSI-CED-02"],
        cmmc: { level: 2, domain: "AT", practice: "AT.L2-3.2.2" },
        description: "Train personnel on security responsibilities"
    },
    "3.2.3": {
        nist80053: ["AT-2(3)"],
        fedramp20x: ["KSI-CED-01", "KSI-CED-02"],
        cmmc: { level: 2, domain: "AT", practice: "AT.L2-3.2.3" },
        description: "Provide security awareness training on insider threats"
    },

    // === AUDIT AND ACCOUNTABILITY (AU) ===
    "3.3.1": {
        nist80053: ["AU-2", "AU-3", "AU-3(1)", "AU-6", "AU-11", "AU-12"],
        fedramp20x: ["KSI-MLA-01", "KSI-MLA-02", "KSI-MLA-07"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.1" },
        description: "Create and retain audit records"
    },
    "3.3.2": {
        nist80053: ["AU-2(3)", "AU-3(1)"],
        fedramp20x: ["KSI-MLA-01", "KSI-MLA-02", "KSI-MLA-07"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.2" },
        description: "Ensure actions are uniquely traced to individuals"
    },
    "3.3.3": {
        nist80053: ["AU-6(4)"],
        fedramp20x: ["KSI-MLA-02"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.3" },
        description: "Review and update audited events"
    },
    "3.3.4": {
        nist80053: ["AU-7"],
        fedramp20x: ["KSI-MLA-01"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.4" },
        description: "Alert on audit logging process failures"
    },
    "3.3.5": {
        nist80053: ["AU-7(1)"],
        fedramp20x: ["KSI-MLA-01", "KSI-MLA-07"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.5" },
        description: "Correlate audit review, analysis, and reporting"
    },
    "3.3.6": {
        nist80053: ["AU-8"],
        fedramp20x: ["KSI-MLA-01"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.6" },
        description: "Provide audit record reduction and report generation"
    },
    "3.3.7": {
        nist80053: ["AU-8(1)"],
        fedramp20x: ["KSI-MLA-01"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.7" },
        description: "Use internal system clocks synchronized to authoritative source"
    },
    "3.3.8": {
        nist80053: ["AU-9"],
        fedramp20x: ["KSI-MLA-01"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.8" },
        description: "Protect audit information from unauthorized access"
    },
    "3.3.9": {
        nist80053: ["AU-9(4)"],
        fedramp20x: ["KSI-IAM-04"],
        cmmc: { level: 2, domain: "AU", practice: "AU.L2-3.3.9" },
        description: "Limit management of audit functionality"
    },

    // === CONFIGURATION MANAGEMENT (CM) ===
    "3.4.1": {
        nist80053: ["CM-2", "CM-6", "CM-8", "CM-8(1)"],
        fedramp20x: ["KSI-CMT-02", "KSI-CNA-04", "KSI-CNA-07", "KSI-MLA-05", "KSI-PIY-01", "KSI-SVC-04"],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.1" },
        description: "Establish and maintain baseline configurations"
    },
    "3.4.2": {
        nist80053: ["CM-2(7)", "CM-7", "CM-7(1)", "CM-7(2)", "CM-7(5)"],
        fedramp20x: ["KSI-CMT-02", "KSI-CMT-04", "KSI-CNA-01", "KSI-IAM-04", "KSI-PIY-01", "KSI-SVC-01", "KSI-SVC-04"],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.2" },
        description: "Establish security configuration settings"
    },
    "3.4.3": {
        nist80053: ["CM-3", "CM-4"],
        fedramp20x: ["KSI-AFR-05", "KSI-CMT-01", "KSI-CMT-02", "KSI-CMT-03", "KSI-CMT-04"],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.3" },
        description: "Track, review, approve changes to systems"
    },
    "3.4.4": {
        nist80053: ["CM-4"],
        fedramp20x: ["KSI-AFR-05", "KSI-CMT-03"],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.4" },
        description: "Analyze security impact of changes"
    },
    "3.4.5": {
        nist80053: ["CM-5"],
        fedramp20x: ["KSI-CMT-02", "KSI-CMT-04", "KSI-IAM-04"],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.5" },
        description: "Define and enforce access restrictions for change"
    },
    "3.4.6": {
        nist80053: ["CM-7", "CM-7(1)", "CM-7(2)"],
        fedramp20x: ["KSI-CNA-01", "KSI-CMT-04", "KSI-IAM-04", "KSI-SVC-01", "KSI-SVC-04"],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.6" },
        description: "Employ principle of least functionality"
    },
    "3.4.7": {
        nist80053: ["CM-7(4)", "CM-7(5)"],
        fedramp20x: ["KSI-IAM-04", "KSI-PIY-01"],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.7" },
        description: "Restrict and disable nonessential programs"
    },
    "3.4.8": {
        nist80053: ["CM-10", "CM-11"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.8" },
        description: "Apply deny-by-exception policy for software"
    },
    "3.4.9": {
        nist80053: ["CM-11"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "CM", practice: "CM.L2-3.4.9" },
        description: "Control and monitor user-installed software"
    },

    // === IDENTIFICATION AND AUTHENTICATION (IA) ===
    "3.5.1": {
        nist80053: ["IA-2", "IA-5"],
        fedramp20x: ["KSI-IAM-01", "KSI-IAM-02", "KSI-IAM-03", "KSI-IAM-05", "KSI-SVC-06"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.1" },
        description: "Identify system users, processes, and devices"
    },
    "3.5.2": {
        nist80053: ["IA-2", "IA-5"],
        fedramp20x: ["KSI-IAM-01", "KSI-IAM-02", "KSI-IAM-03", "KSI-IAM-05", "KSI-SVC-06"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.2" },
        description: "Authenticate identities before access"
    },
    "3.5.3": {
        nist80053: ["IA-2(1)", "IA-2(2)", "IA-2(3)"],
        fedramp20x: ["KSI-IAM-01", "KSI-IAM-02"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.3" },
        description: "Use multifactor authentication"
    },
    "3.5.4": {
        nist80053: ["IA-2(8)", "IA-2(9)"],
        fedramp20x: ["KSI-IAM-01"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.4" },
        description: "Employ replay-resistant authentication"
    },
    "3.5.5": {
        nist80053: ["IA-3"],
        fedramp20x: ["KSI-IAM-03", "KSI-IAM-05"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.5" },
        description: "Prevent reuse of identifiers"
    },
    "3.5.6": {
        nist80053: ["IA-4"],
        fedramp20x: ["KSI-IAM-04", "KSI-IAM-05", "KSI-IAM-07"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.6" },
        description: "Disable identifiers after period of inactivity"
    },
    "3.5.7": {
        nist80053: ["IA-5(1)"],
        fedramp20x: ["KSI-IAM-02"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.7" },
        description: "Enforce minimum password complexity"
    },
    "3.5.8": {
        nist80053: ["IA-5(1)"],
        fedramp20x: ["KSI-IAM-02"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.8" },
        description: "Prohibit password reuse"
    },
    "3.5.9": {
        nist80053: ["IA-5(1)"],
        fedramp20x: ["KSI-IAM-02"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.9" },
        description: "Allow temporary passwords for system logon"
    },
    "3.5.10": {
        nist80053: ["IA-5(2)"],
        fedramp20x: ["KSI-IAM-03", "KSI-IAM-05", "KSI-SVC-06"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.10" },
        description: "Store and transmit only cryptographically-protected passwords"
    },
    "3.5.11": {
        nist80053: ["IA-6"],
        fedramp20x: ["KSI-IAM-02"],
        cmmc: { level: 2, domain: "IA", practice: "IA.L2-3.5.11" },
        description: "Obscure feedback of authentication information"
    },

    // === INCIDENT RESPONSE (IR) ===
    "3.6.1": {
        nist80053: ["IR-2", "IR-4", "IR-5", "IR-6", "IR-7"],
        fedramp20x: ["KSI-AFR-04", "KSI-AFR-10", "KSI-CED-03", "KSI-INR-01", "KSI-INR-02", "KSI-INR-03"],
        cmmc: { level: 2, domain: "IR", practice: "IR.L2-3.6.1" },
        description: "Establish incident-handling capability"
    },
    "3.6.2": {
        nist80053: ["IR-6"],
        fedramp20x: ["KSI-AFR-04", "KSI-AFR-10", "KSI-INR-01", "KSI-TPR-04"],
        cmmc: { level: 2, domain: "IR", practice: "IR.L2-3.6.2" },
        description: "Track, document, and report incidents"
    },
    "3.6.3": {
        nist80053: ["IR-8"],
        fedramp20x: ["KSI-INR-01", "KSI-INR-02", "KSI-INR-03"],
        cmmc: { level: 2, domain: "IR", practice: "IR.L2-3.6.3" },
        description: "Test incident response capability"
    },

    // === MAINTENANCE (MA) ===
    "3.7.1": {
        nist80053: ["MA-2", "MA-3", "MA-3(1)", "MA-3(2)"],
        fedramp20x: ["KSI-CMT-01", "KSI-SVC-01"],
        cmmc: { level: 2, domain: "MA", practice: "MA.L2-3.7.1" },
        description: "Perform maintenance on organizational systems"
    },
    "3.7.2": {
        nist80053: ["MA-2", "MA-3"],
        fedramp20x: ["KSI-CMT-01", "KSI-SVC-01"],
        cmmc: { level: 2, domain: "MA", practice: "MA.L2-3.7.2" },
        description: "Control tools and media for maintenance"
    },
    "3.7.3": {
        nist80053: ["MA-3(2)"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "MA", practice: "MA.L2-3.7.3" },
        description: "Sanitize equipment for off-site maintenance"
    },
    "3.7.4": {
        nist80053: ["MA-3(1)"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "MA", practice: "MA.L2-3.7.4" },
        description: "Check media for malicious code before use"
    },
    "3.7.5": {
        nist80053: ["MA-4"],
        fedramp20x: ["KSI-IAM-01"],
        cmmc: { level: 2, domain: "MA", practice: "MA.L2-3.7.5" },
        description: "Require multifactor authentication for nonlocal maintenance"
    },
    "3.7.6": {
        nist80053: ["MA-5"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "MA", practice: "MA.L2-3.7.6" },
        description: "Supervise maintenance activities"
    },

    // === MEDIA PROTECTION (MP) ===
    "3.8.1": {
        nist80053: ["MP-2", "MP-4", "MP-6"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "MP", practice: "MP.L2-3.8.1" },
        description: "Protect system media containing CUI"
    },
    "3.8.2": {
        nist80053: ["MP-4"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "MP", practice: "MP.L2-3.8.2" },
        description: "Limit access to CUI on system media"
    },
    "3.8.3": {
        nist80053: ["MP-6"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "MP", practice: "MP.L2-3.8.3" },
        description: "Sanitize or destroy media containing CUI"
    },
    "3.8.4": {
        nist80053: ["MP-3"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "MP", practice: "MP.L2-3.8.4" },
        description: "Mark media with necessary CUI markings"
    },
    "3.8.5": {
        nist80053: ["MP-5", "MP-5(4)"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "MP", practice: "MP.L2-3.8.5" },
        description: "Control access to media during transport"
    },
    "3.8.6": {
        nist80053: ["MP-5(4)"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "MP", practice: "MP.L2-3.8.6" },
        description: "Implement cryptographic mechanisms during transport"
    },
    "3.8.7": {
        nist80053: ["MP-7"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "MP", practice: "MP.L2-3.8.7" },
        description: "Control use of removable media"
    },
    "3.8.8": {
        nist80053: ["MP-7(1)"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "MP", practice: "MP.L2-3.8.8" },
        description: "Prohibit use of portable storage when owner unknown"
    },
    "3.8.9": {
        nist80053: ["MP-6(8)"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "MP", practice: "MP.L2-3.8.9" },
        description: "Protect backup CUI at storage locations"
    },

    // === PERSONNEL SECURITY (PS) ===
    "3.9.1": {
        nist80053: ["PS-3", "PS-6", "PS-7"],
        fedramp20x: ["KSI-CED-03", "KSI-IAM-04", "KSI-IAM-05", "KSI-TPR-04"],
        cmmc: { level: 2, domain: "PS", practice: "PS.L2-3.9.1" },
        description: "Screen individuals before CUI access"
    },
    "3.9.2": {
        nist80053: ["PS-4", "PS-5"],
        fedramp20x: ["KSI-IAM-04", "KSI-IAM-05", "KSI-IAM-06"],
        cmmc: { level: 2, domain: "PS", practice: "PS.L2-3.9.2" },
        description: "Protect CUI during personnel actions"
    },

    // === PHYSICAL PROTECTION (PE) ===
    "3.10.1": {
        nist80053: ["PE-2", "PE-6"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "PE", practice: "PE.L2-3.10.1" },
        description: "Limit physical access to authorized individuals"
    },
    "3.10.2": {
        nist80053: ["PE-2", "PE-3", "PE-4", "PE-5"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "PE", practice: "PE.L2-3.10.2" },
        description: "Protect and monitor physical facility"
    },
    "3.10.3": {
        nist80053: ["PE-3"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "PE", practice: "PE.L2-3.10.3" },
        description: "Escort and monitor visitors"
    },
    "3.10.4": {
        nist80053: ["PE-6"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "PE", practice: "PE.L2-3.10.4" },
        description: "Maintain audit logs of physical access"
    },
    "3.10.5": {
        nist80053: ["PE-6(1)"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "PE", practice: "PE.L2-3.10.5" },
        description: "Control and manage physical access devices"
    },
    "3.10.6": {
        nist80053: ["PE-17"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "PE", practice: "PE.L2-3.10.6" },
        description: "Enforce safeguards at alternate work sites"
    },

    // === RISK ASSESSMENT (RA) ===
    "3.11.1": {
        nist80053: ["RA-3"],
        fedramp20x: ["KSI-AFR-04", "KSI-TPR-03"],
        cmmc: { level: 2, domain: "RA", practice: "RA.L2-3.11.1" },
        description: "Periodically assess risk to operations"
    },
    "3.11.2": {
        nist80053: ["RA-5", "RA-5(5)"],
        fedramp20x: ["KSI-AFR-03", "KSI-AFR-04", "KSI-AFR-05", "KSI-IAM-03", "KSI-PIY-03", "KSI-TPR-04"],
        cmmc: { level: 2, domain: "RA", practice: "RA.L2-3.11.2" },
        description: "Scan for vulnerabilities periodically"
    },
    "3.11.3": {
        nist80053: ["RA-5"],
        fedramp20x: ["KSI-AFR-03", "KSI-AFR-04", "KSI-AFR-05", "KSI-TPR-04"],
        cmmc: { level: 2, domain: "RA", practice: "RA.L2-3.11.3" },
        description: "Remediate vulnerabilities per risk assessments"
    },

    // === SECURITY ASSESSMENT (CA) ===
    "3.12.1": {
        nist80053: ["CA-2", "CA-5", "CA-7", "PL-2"],
        fedramp20x: ["KSI-AFR-03", "KSI-AFR-04", "KSI-AFR-05", "KSI-AFR-06", "KSI-AFR-09", "KSI-MLA-05", "KSI-PIY-06"],
        cmmc: { level: 2, domain: "CA", practice: "CA.L2-3.12.1" },
        description: "Periodically assess security controls"
    },
    "3.12.2": {
        nist80053: ["CA-2", "CA-5", "CA-7"],
        fedramp20x: ["KSI-AFR-03", "KSI-AFR-04", "KSI-AFR-05", "KSI-AFR-06", "KSI-MLA-05", "KSI-PIY-06"],
        cmmc: { level: 2, domain: "CA", practice: "CA.L2-3.12.2" },
        description: "Develop and implement remediation plans"
    },
    "3.12.3": {
        nist80053: ["CA-7"],
        fedramp20x: ["KSI-AFR-04", "KSI-AFR-05", "KSI-AFR-06", "KSI-MLA-05"],
        cmmc: { level: 2, domain: "CA", practice: "CA.L2-3.12.3" },
        description: "Monitor security controls on ongoing basis"
    },
    "3.12.4": {
        nist80053: ["PL-2", "PM-1", "PM-6"],
        fedramp20x: ["KSI-PIY-04", "KSI-PIY-06", "KSI-PIY-08"],
        cmmc: { level: 2, domain: "CA", practice: "CA.L2-3.12.4" },
        description: "Develop and update system security plans"
    },

    // === SYSTEM AND COMMUNICATIONS PROTECTION (SC) ===
    "3.13.1": {
        nist80053: ["SC-7", "SA-8"],
        fedramp20x: ["KSI-CNA-03", "KSI-PIY-04", "KSI-SVC-01"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.1" },
        description: "Monitor and control communications at boundaries"
    },
    "3.13.2": {
        nist80053: ["SA-8"],
        fedramp20x: ["KSI-PIY-04"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.2" },
        description: "Employ architectural designs for security"
    },
    "3.13.3": {
        nist80053: ["SC-2"],
        fedramp20x: ["KSI-IAM-04"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.3" },
        description: "Separate user functionality from management"
    },
    "3.13.4": {
        nist80053: ["SC-3"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.4" },
        description: "Prevent unauthorized information transfer"
    },
    "3.13.5": {
        nist80053: ["SC-7", "SC-7(5)"],
        fedramp20x: ["KSI-CNA-01", "KSI-CNA-02", "KSI-CNA-03", "KSI-SVC-01"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.5" },
        description: "Implement subnetworks for publicly accessible components"
    },
    "3.13.6": {
        nist80053: ["SC-7(7)"],
        fedramp20x: ["KSI-CNA-03"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.6" },
        description: "Deny network communications by default"
    },
    "3.13.7": {
        nist80053: ["SC-7(18)"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.7" },
        description: "Prevent remote devices from split tunneling"
    },
    "3.13.8": {
        nist80053: ["SC-8", "SC-8(1)"],
        fedramp20x: ["KSI-AFR-03", "KSI-CNA-02", "KSI-CNA-03", "KSI-SVC-02"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.8" },
        description: "Implement cryptographic mechanisms for CUI in transit"
    },
    "3.13.9": {
        nist80053: ["SC-10"],
        fedramp20x: ["KSI-CNA-03"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.9" },
        description: "Terminate network connections at end of sessions"
    },
    "3.13.10": {
        nist80053: ["SC-12"],
        fedramp20x: ["KSI-SVC-06"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.10" },
        description: "Establish and manage cryptographic keys"
    },
    "3.13.11": {
        nist80053: ["SC-13"],
        fedramp20x: ["KSI-AFR-11", "KSI-SVC-02", "KSI-SVC-05"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.11" },
        description: "Employ FIPS-validated cryptography"
    },
    "3.13.12": {
        nist80053: ["SC-15"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.12" },
        description: "Prohibit remote activation of collaborative devices"
    },
    "3.13.13": {
        nist80053: ["SC-18"],
        fedramp20x: ["KSI-PIY-04", "KSI-TPR-03"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.13" },
        description: "Control and monitor use of mobile code"
    },
    "3.13.14": {
        nist80053: ["SC-19"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.14" },
        description: "Control and monitor use of VoIP"
    },
    "3.13.15": {
        nist80053: ["SC-20", "SC-21"],
        fedramp20x: ["KSI-IAM-05", "KSI-SVC-02"],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.15" },
        description: "Protect authenticity of communications sessions"
    },
    "3.13.16": {
        nist80053: ["SC-28", "SC-28(1)"],
        fedramp20x: [],
        cmmc: { level: 2, domain: "SC", practice: "SC.L2-3.13.16" },
        description: "Protect CUI at rest"
    },

    // === SYSTEM AND INFORMATION INTEGRITY (SI) ===
    "3.14.1": {
        nist80053: ["SI-2", "SI-3", "SI-5"],
        fedramp20x: ["KSI-AFR-04", "KSI-AFR-05", "KSI-CMT-03", "KSI-CMT-02", "KSI-CNA-04", "KSI-IAM-05", "KSI-SVC-01", "KSI-SVC-04"],
        cmmc: { level: 2, domain: "SI", practice: "SI.L2-3.14.1" },
        description: "Identify, report, and correct flaws in timely manner"
    },
    "3.14.2": {
        nist80053: ["SI-3"],
        fedramp20x: ["KSI-AFR-04", "KSI-AFR-05", "KSI-CMT-02", "KSI-CNA-04", "KSI-IAM-05"],
        cmmc: { level: 2, domain: "SI", practice: "SI.L2-3.14.2" },
        description: "Provide protection from malicious code"
    },
    "3.14.3": {
        nist80053: ["SI-5"],
        fedramp20x: ["KSI-SVC-04", "KSI-TPR-04"],
        cmmc: { level: 2, domain: "SI", practice: "SI.L2-3.14.3" },
        description: "Monitor system security alerts and advisories"
    },
    "3.14.4": {
        nist80053: ["SI-3"],
        fedramp20x: ["KSI-AFR-04", "KSI-AFR-05", "KSI-CMT-02", "KSI-CNA-04", "KSI-IAM-05"],
        cmmc: { level: 2, domain: "SI", practice: "SI.L2-3.14.4" },
        description: "Update malicious code protection mechanisms"
    },
    "3.14.5": {
        nist80053: ["SI-3"],
        fedramp20x: ["KSI-AFR-04", "KSI-AFR-05", "KSI-CMT-02", "KSI-CNA-04", "KSI-IAM-05"],
        cmmc: { level: 2, domain: "SI", practice: "SI.L2-3.14.5" },
        description: "Perform periodic and real-time scans"
    },
    "3.14.6": {
        nist80053: ["SI-4"],
        fedramp20x: ["KSI-AFR-04", "KSI-MLA-02", "KSI-SVC-01"],
        cmmc: { level: 2, domain: "SI", practice: "SI.L2-3.14.6" },
        description: "Monitor systems to detect attacks"
    },
    "3.14.7": {
        nist80053: ["SI-4(4)", "SI-4(5)"],
        fedramp20x: ["KSI-INR-01", "KSI-MLA-01", "KSI-MLA-02", "KSI-MLA-07"],
        cmmc: { level: 2, domain: "SI", practice: "SI.L2-3.14.7" },
        description: "Identify unauthorized use of systems"
    },

    // === CONTINGENCY PLANNING (implied by recovery-related controls) ===
    // These map to the RPL KSI family for recovery planning
    "_recovery": {
        fedramp20x: ["KSI-RPL-01", "KSI-RPL-02", "KSI-RPL-03", "KSI-RPL-04"],
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
