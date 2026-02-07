// NIST SP 800-171A Revision 3 Control Definitions and Migration Mapping
// Assessing Security Requirements for Protecting CUI
// Based on NIST SP 800-171 Rev 3 (May 2024) and SP 800-171A Rev 3
// Migration from Rev 2 to Rev 3 with full crosswalk

const NIST_171A_R3_CONFIG = {
    version: "3.0.0",
    framework: "NIST SP 800-171A Rev 3",
    title: "Assessing Security Requirements for Protecting CUI",
    publicationDate: "2024-11-19",
    effectiveDate: "2024-11-19",
    transitionPeriod: "24 months",
    rev2SunsetDate: "2026-11-19",
    totalRequirements: 97,
    totalObjectives: 422,
    totalFamilies: 17,
    description: "Updated assessment procedures aligned with NIST SP 800-53 Rev 5 and CMMC 2.0"
};

// Rev 2 to Rev 3 Control Migration Mapping
// Maps old control IDs to new control IDs with change type
const REV2_TO_REV3_MIGRATION = {
    // Access Control (AC) - 22 controls in Rev 2
    "3.1.1": { rev3Id: "03.01.01", changeType: "renumbered", notes: "Minor updates to requirement language" },
    "3.1.2": { rev3Id: "03.01.02", changeType: "renumbered", notes: "Minor updates" },
    "3.1.3": { rev3Id: "03.01.03", changeType: "enhanced", notes: "Added ODP for flow control policies" },
    "3.1.4": { rev3Id: "03.01.04", changeType: "renumbered", notes: "No significant changes" },
    "3.1.5": { rev3Id: "03.01.05", changeType: "enhanced", notes: "Expanded least privilege scope" },
    "3.1.6": { rev3Id: "03.01.06", changeType: "renumbered", notes: "No significant changes" },
    "3.1.7": { rev3Id: "03.01.07", changeType: "renumbered", notes: "No significant changes" },
    "3.1.8": { rev3Id: "03.01.08", changeType: "enhanced", notes: "Added account lockout duration ODP" },
    "3.1.9": { rev3Id: "03.01.09", changeType: "renumbered", notes: "No significant changes" },
    "3.1.10": { rev3Id: "03.01.10", changeType: "enhanced", notes: "Added session lock timeout ODP" },
    "3.1.11": { rev3Id: "03.01.11", changeType: "enhanced", notes: "Added session termination conditions ODP" },
    "3.1.12": { rev3Id: "03.01.12", changeType: "renumbered", notes: "No significant changes" },
    "3.1.13": { rev3Id: "03.01.12", changeType: "withdrawn", notes: "Incorporated into 03.01.12" },
    "3.1.14": { rev3Id: "03.01.01", changeType: "withdrawn", notes: "Incorporated into 03.01.01" },
    "3.1.15": { rev3Id: "03.01.12", changeType: "withdrawn", notes: "Incorporated into 03.01.12" },
    "3.1.16": { rev3Id: "03.01.16", changeType: "renumbered", notes: "No significant changes" },
    "3.1.17": { rev3Id: "03.01.16", changeType: "withdrawn", notes: "Incorporated into 03.01.16" },
    "3.1.18": { rev3Id: "03.01.18", changeType: "renumbered", notes: "No significant changes" },
    "3.1.19": { rev3Id: "03.01.01", changeType: "withdrawn", notes: "Incorporated into 03.01.01" },
    "3.1.20": { rev3Id: "03.01.20", changeType: "renumbered", notes: "No significant changes" },
    "3.1.21": { rev3Id: "03.01.20", changeType: "withdrawn", notes: "Incorporated into 03.01.20" },
    "3.1.22": { rev3Id: "03.01.22", changeType: "renumbered", notes: "No significant changes" },

    // Awareness and Training (AT) - 3 controls
    "3.2.1": { rev3Id: "03.02.01", changeType: "enhanced", notes: "Added training frequency ODP" },
    "3.2.2": { rev3Id: "03.02.02", changeType: "enhanced", notes: "Added role-based training content ODP" },
    "3.2.3": { rev3Id: "03.02.01", changeType: "withdrawn", notes: "Incorporated into 03.02.01" },

    // Audit and Accountability (AU) - 9 controls
    "3.3.1": { rev3Id: "03.03.01", changeType: "enhanced", notes: "Added audit event types ODP" },
    "3.3.2": { rev3Id: "03.03.02", changeType: "renumbered", notes: "No significant changes" },
    "3.3.3": { rev3Id: "03.03.03", changeType: "enhanced", notes: "Added review frequency ODP" },
    "3.3.4": { rev3Id: "03.03.04", changeType: "renumbered", notes: "No significant changes" },
    "3.3.5": { rev3Id: "03.03.05", changeType: "renumbered", notes: "No significant changes" },
    "3.3.6": { rev3Id: "03.03.06", changeType: "renumbered", notes: "No significant changes" },
    "3.3.7": { rev3Id: "03.03.07", changeType: "renumbered", notes: "No significant changes" },
    "3.3.8": { rev3Id: "03.03.08", changeType: "renumbered", notes: "No significant changes" },
    "3.3.9": { rev3Id: "03.03.01", changeType: "withdrawn", notes: "Addressed by 03.03.01" },

    // Configuration Management (CM) - 9 controls
    "3.4.1": { rev3Id: "03.04.01", changeType: "enhanced", notes: "Added baseline components ODP" },
    "3.4.2": { rev3Id: "03.04.02", changeType: "enhanced", notes: "Added security settings ODP" },
    "3.4.3": { rev3Id: "03.04.03", changeType: "renumbered", notes: "No significant changes" },
    "3.4.4": { rev3Id: "03.04.04", changeType: "renumbered", notes: "No significant changes" },
    "3.4.5": { rev3Id: "03.04.05", changeType: "renumbered", notes: "No significant changes" },
    "3.4.6": { rev3Id: "03.04.06", changeType: "enhanced", notes: "Added essential capabilities ODP" },
    "3.4.7": { rev3Id: "03.04.06", changeType: "withdrawn", notes: "Addressed by 03.04.06 and 03.04.08" },
    "3.4.8": { rev3Id: "03.04.08", changeType: "enhanced", notes: "Added authorized software ODP" },
    "3.4.9": { rev3Id: "03.04.02", changeType: "withdrawn", notes: "Incorporated into 03.04.02" },

    // Identification and Authentication (IA) - 11 controls
    "3.5.1": { rev3Id: "03.05.01", changeType: "renumbered", notes: "No significant changes" },
    "3.5.2": { rev3Id: "03.05.02", changeType: "renumbered", notes: "No significant changes" },
    "3.5.3": { rev3Id: "03.05.03", changeType: "enhanced", notes: "Expanded MFA requirements" },
    "3.5.4": { rev3Id: "03.05.04", changeType: "renumbered", notes: "No significant changes" },
    "3.5.5": { rev3Id: "03.05.05", changeType: "enhanced", notes: "Added identifier reuse period ODP" },
    "3.5.6": { rev3Id: "03.05.01", changeType: "withdrawn", notes: "Incorporated into 03.05.01" },
    "3.5.7": { rev3Id: "03.05.07", changeType: "enhanced", notes: "Added complexity requirements ODP" },
    "3.5.8": { rev3Id: "03.05.07", changeType: "withdrawn", notes: "Incorporated into 03.05.07" },
    "3.5.9": { rev3Id: "03.05.07", changeType: "withdrawn", notes: "Incorporated into 03.05.07" },
    "3.5.10": { rev3Id: "03.05.03", changeType: "withdrawn", notes: "Incorporated into 03.05.03" },
    "3.5.11": { rev3Id: "03.05.11", changeType: "renumbered", notes: "No significant changes" },

    // Incident Response (IR) - 3 controls
    "3.6.1": { rev3Id: "03.06.01", changeType: "enhanced", notes: "Added incident types ODP" },
    "3.6.2": { rev3Id: "03.06.02", changeType: "enhanced", notes: "Added reporting timeframes ODP" },
    "3.6.3": { rev3Id: "03.06.03", changeType: "enhanced", notes: "Added testing frequency ODP" },

    // Maintenance (MA) - 6 controls
    "3.7.1": { rev3Id: "03.07.04", changeType: "withdrawn", notes: "Addressed by 03.07.04, 03.07.05, 03.07.06" },
    "3.7.2": { rev3Id: "03.07.04", changeType: "withdrawn", notes: "Incorporated into 03.07.04" },
    "3.7.3": { rev3Id: "03.07.05", changeType: "withdrawn", notes: "Incorporated into 03.07.05" },
    "3.7.4": { rev3Id: "03.07.04", changeType: "renumbered", notes: "No significant changes" },
    "3.7.5": { rev3Id: "03.07.05", changeType: "renumbered", notes: "No significant changes" },
    "3.7.6": { rev3Id: "03.07.06", changeType: "renumbered", notes: "No significant changes" },

    // Media Protection (MP) - 9 controls
    "3.8.1": { rev3Id: "03.08.01", changeType: "renumbered", notes: "No significant changes" },
    "3.8.2": { rev3Id: "03.08.02", changeType: "renumbered", notes: "No significant changes" },
    "3.8.3": { rev3Id: "03.08.03", changeType: "enhanced", notes: "Added sanitization methods ODP" },
    "3.8.4": { rev3Id: "03.08.04", changeType: "renumbered", notes: "No significant changes" },
    "3.8.5": { rev3Id: "03.08.05", changeType: "renumbered", notes: "No significant changes" },
    "3.8.6": { rev3Id: "03.08.03", changeType: "withdrawn", notes: "Incorporated into 03.08.03" },
    "3.8.7": { rev3Id: "03.08.07", changeType: "renumbered", notes: "No significant changes" },
    "3.8.8": { rev3Id: "03.08.04", changeType: "withdrawn", notes: "Incorporated into 03.08.04" },
    "3.8.9": { rev3Id: "03.08.09", changeType: "renumbered", notes: "No significant changes" },

    // Personnel Security (PS) - 2 controls
    "3.9.1": { rev3Id: "03.09.01", changeType: "enhanced", notes: "Added screening criteria ODP" },
    "3.9.2": { rev3Id: "03.09.02", changeType: "enhanced", notes: "Added termination actions ODP" },

    // Physical Protection (PE) - 6 controls
    "3.10.1": { rev3Id: "03.10.01", changeType: "renumbered", notes: "No significant changes" },
    "3.10.2": { rev3Id: "03.10.02", changeType: "renumbered", notes: "No significant changes" },
    "3.10.3": { rev3Id: "03.10.07", changeType: "withdrawn", notes: "Incorporated into 03.10.07" },
    "3.10.4": { rev3Id: "03.10.07", changeType: "withdrawn", notes: "Incorporated into 03.10.07" },
    "3.10.5": { rev3Id: "03.10.07", changeType: "withdrawn", notes: "Incorporated into 03.10.07" },
    "3.10.6": { rev3Id: "03.10.06", changeType: "renumbered", notes: "No significant changes" },

    // Risk Assessment (RA) - 3 controls
    "3.11.1": { rev3Id: "03.11.01", changeType: "enhanced", notes: "Added risk assessment frequency ODP" },
    "3.11.2": { rev3Id: "03.11.02", changeType: "enhanced", notes: "Added vulnerability scanning ODP" },
    "3.11.3": { rev3Id: "03.11.02", changeType: "withdrawn", notes: "Incorporated into 03.11.02" },

    // Security Assessment (CA) - 4 controls
    "3.12.1": { rev3Id: "03.12.01", changeType: "enhanced", notes: "Added assessment frequency ODP" },
    "3.12.2": { rev3Id: "03.12.02", changeType: "renumbered", notes: "No significant changes" },
    "3.12.3": { rev3Id: "03.12.03", changeType: "enhanced", notes: "Added continuous monitoring ODP" },
    "3.12.4": { rev3Id: "03.15.02", changeType: "withdrawn", notes: "Incorporated into 03.15.02" },

    // System and Communications Protection (SC) - 16 controls
    "3.13.1": { rev3Id: "03.13.01", changeType: "renumbered", notes: "No significant changes" },
    "3.13.2": { rev3Id: "03.13.02", changeType: "withdrawn", notes: "Recategorized as NCO" },
    "3.13.3": { rev3Id: "03.01.01", changeType: "withdrawn", notes: "Addressed by 03.01.01-07" },
    "3.13.4": { rev3Id: "03.13.04", changeType: "renumbered", notes: "No significant changes" },
    "3.13.5": { rev3Id: "03.13.01", changeType: "withdrawn", notes: "Incorporated into 03.13.01" },
    "3.13.6": { rev3Id: "03.13.06", changeType: "renumbered", notes: "No significant changes" },
    "3.13.7": { rev3Id: "03.01.12", changeType: "withdrawn", notes: "Addressed by 03.01.12, 03.04.02, 03.04.06" },
    "3.13.8": { rev3Id: "03.13.08", changeType: "renumbered", notes: "No significant changes" },
    "3.13.9": { rev3Id: "03.13.09", changeType: "renumbered", notes: "No significant changes" },
    "3.13.10": { rev3Id: "03.13.10", changeType: "enhanced", notes: "Added key management ODP" },
    "3.13.11": { rev3Id: "03.13.11", changeType: "enhanced", notes: "Added FIPS-validated crypto ODP" },
    "3.13.12": { rev3Id: "03.13.12", changeType: "renumbered", notes: "No significant changes" },
    "3.13.13": { rev3Id: "03.13.13", changeType: "renumbered", notes: "No significant changes" },
    "3.13.14": { rev3Id: "03.13.14", changeType: "withdrawn", notes: "Technology-specific" },
    "3.13.15": { rev3Id: "03.13.15", changeType: "renumbered", notes: "No significant changes" },
    "3.13.16": { rev3Id: "03.13.08", changeType: "withdrawn", notes: "Incorporated into 03.13.08" },

    // System and Information Integrity (SI) - 7 controls
    "3.14.1": { rev3Id: "03.14.01", changeType: "enhanced", notes: "Added malware scanning frequency ODP" },
    "3.14.2": { rev3Id: "03.14.02", changeType: "enhanced", notes: "Added signature update frequency ODP" },
    "3.14.3": { rev3Id: "03.14.03", changeType: "enhanced", notes: "Added monitoring locations ODP" },
    "3.14.4": { rev3Id: "03.14.02", changeType: "withdrawn", notes: "Incorporated into 03.14.02" },
    "3.14.5": { rev3Id: "03.14.02", changeType: "withdrawn", notes: "Addressed by 03.14.02" },
    "3.14.6": { rev3Id: "03.14.06", changeType: "enhanced", notes: "Added input validation ODP" },
    "3.14.7": { rev3Id: "03.14.06", changeType: "withdrawn", notes: "Incorporated into 03.14.06" }
};

// New controls added in Rev 3 (not present in Rev 2)
// Updated to match official NIST 800-171r3 family numbering
const REV3_NEW_CONTROLS = [
    { id: "03.04.10", family: "CM", name: "System Component Inventory", newInRev3: true },
    { id: "03.04.11", family: "CM", name: "Information Location", newInRev3: true },
    { id: "03.04.12", family: "CM", name: "Software Usage Restrictions", newInRev3: true },
    { id: "03.05.12", family: "IA", name: "Authenticator Management", newInRev3: true },
    { id: "03.06.04", family: "IR", name: "Incident Response Training", newInRev3: true },
    { id: "03.06.05", family: "IR", name: "Incident Response Plan", newInRev3: true },
    { id: "03.10.07", family: "PE", name: "Physical Access Control", newInRev3: true },
    { id: "03.10.08", family: "PE", name: "Access Control for Transmission", newInRev3: true },
    { id: "03.11.04", family: "RA", name: "Risk Response", newInRev3: true },
    { id: "03.12.05", family: "CA", name: "Information Exchange", newInRev3: true },
    { id: "03.14.08", family: "SI", name: "Information Management and Retention", newInRev3: true },
    { id: "03.15.01", family: "PL", name: "Policy and Procedures", newInRev3: true },
    { id: "03.15.02", family: "PL", name: "System Security Plan", newInRev3: true },
    { id: "03.15.03", family: "PL", name: "Rules of Behavior", newInRev3: true },
    { id: "03.16.01", family: "SA", name: "Systems Security Engineering Principles", newInRev3: true },
    { id: "03.16.02", family: "SA", name: "Unsupported System Components", newInRev3: true },
    { id: "03.16.03", family: "SA", name: "External System Services", newInRev3: true },
    { id: "03.17.01", family: "SR", name: "Supply Chain Risk Management Plan", newInRev3: true },
    { id: "03.17.02", family: "SR", name: "Acquisition Strategies, Tools, and Methods", newInRev3: true },
    { id: "03.17.03", family: "SR", name: "Supply Chain Requirements and Processes", newInRev3: true }
];

// Controls merged or consolidated in Rev 3
const REV3_MERGED_CONTROLS = [
    {
        rev2Ids: ["3.1.16", "3.1.17"],
        rev3Id: "03.01.16",
        name: "Wireless Access",
        notes: "Authorization and protection merged into single control"
    }
];

// Controls withdrawn in Rev 3 (with disposition)
const REV3_WITHDRAWN_CONTROLS = [
    { rev2Id: "3.1.13", rev3Id: "03.01.13", disposition: "Incorporated into 03.01.12" },
    { rev2Id: "3.1.14", rev3Id: "03.01.14", disposition: "Incorporated into 03.01.01" },
    { rev2Id: "3.1.15", rev3Id: "03.01.15", disposition: "Incorporated into 03.01.12" },
    { rev2Id: "3.1.17", rev3Id: "03.01.17", disposition: "Incorporated into 03.01.16" },
    { rev2Id: "3.1.19", rev3Id: "03.01.19", disposition: "Incorporated into 03.01.01" },
    { rev2Id: "3.1.21", rev3Id: "03.01.21", disposition: "Incorporated into 03.01.20" },
    { rev2Id: "3.2.3", rev3Id: "03.02.03", disposition: "Incorporated into 03.02.01" },
    { rev2Id: "3.3.9", rev3Id: "03.03.09", disposition: "Addressed by 03.03.01" },
    { rev2Id: "3.4.7", rev3Id: "03.04.07", disposition: "Addressed by 03.04.06 and 03.04.08" },
    { rev2Id: "3.4.9", rev3Id: "03.04.09", disposition: "Incorporated into 03.04.02" },
    { rev2Id: "3.5.6", rev3Id: "03.05.06", disposition: "Incorporated into 03.05.01" },
    { rev2Id: "3.5.8", rev3Id: "03.05.08", disposition: "Incorporated into 03.05.07" },
    { rev2Id: "3.5.9", rev3Id: "03.05.09", disposition: "Incorporated into 03.05.07" },
    { rev2Id: "3.5.10", rev3Id: "03.05.10", disposition: "Incorporated into 03.05.03" },
    { rev2Id: "3.7.1", rev3Id: "03.07.01", disposition: "Addressed by 03.07.04, 03.07.05, 03.07.06" },
    { rev2Id: "3.7.2", rev3Id: "03.07.02", disposition: "Incorporated into 03.07.04" },
    { rev2Id: "3.7.3", rev3Id: "03.07.03", disposition: "Incorporated into 03.07.05" },
    { rev2Id: "3.8.6", rev3Id: "03.08.06", disposition: "Incorporated into 03.08.03" },
    { rev2Id: "3.8.8", rev3Id: "03.08.08", disposition: "Incorporated into 03.08.04" },
    { rev2Id: "3.10.3", rev3Id: "03.10.03", disposition: "Incorporated into 03.10.07" },
    { rev2Id: "3.10.4", rev3Id: "03.10.04", disposition: "Incorporated into 03.10.07" },
    { rev2Id: "3.10.5", rev3Id: "03.10.05", disposition: "Incorporated into 03.10.07" },
    { rev2Id: "3.11.3", rev3Id: "03.11.03", disposition: "Incorporated into 03.11.02" },
    { rev2Id: "3.12.4", rev3Id: "03.12.04", disposition: "Incorporated into 03.15.02" },
    { rev2Id: "3.13.2", rev3Id: "03.13.02", disposition: "Recategorized as NCO" },
    { rev2Id: "3.13.3", rev3Id: "03.13.03", disposition: "Addressed by 03.01.01-07" },
    { rev2Id: "3.13.5", rev3Id: "03.13.05", disposition: "Incorporated into 03.13.01" },
    { rev2Id: "3.13.7", rev3Id: "03.13.07", disposition: "Addressed by 03.01.12, 03.04.02, 03.04.06" },
    { rev2Id: "3.13.14", rev3Id: "03.13.14", disposition: "Technology-specific" },
    { rev2Id: "3.13.16", rev3Id: "03.13.16", disposition: "Incorporated into 03.13.08" },
    { rev2Id: "3.14.4", rev3Id: "03.14.04", disposition: "Incorporated into 03.14.02" },
    { rev2Id: "3.14.5", rev3Id: "03.14.05", disposition: "Addressed by 03.14.02" },
    { rev2Id: "3.14.7", rev3Id: "03.14.07", disposition: "Incorporated into 03.14.06" }
];

// Organization-Defined Parameters (ODPs) introduced in Rev 3
const REV3_ODPS = {
    "03.01.08": {
        odpName: "account_lockout",
        parameters: [
            { name: "lockout_threshold", description: "Number of failed attempts before lockout", suggestedValue: "3" },
            { name: "lockout_duration", description: "Duration of account lockout", suggestedValue: "30 minutes or admin unlock" }
        ]
    },
    "03.01.10": {
        odpName: "session_lock",
        parameters: [
            { name: "inactivity_period", description: "Period of inactivity before session lock", suggestedValue: "15 minutes" }
        ]
    },
    "03.01.11": {
        odpName: "session_termination",
        parameters: [
            { name: "termination_conditions", description: "Conditions requiring session termination", suggestedValue: "Logout, timeout, policy violation" }
        ]
    },
    "03.02.01": {
        odpName: "awareness_training",
        parameters: [
            { name: "frequency", description: "Frequency of security awareness training", suggestedValue: "Annually and upon significant changes" },
            { name: "content", description: "Training content requirements", suggestedValue: "Phishing, social engineering, insider threat, CUI handling" }
        ]
    },
    "03.03.01": {
        odpName: "audit_events",
        parameters: [
            { name: "event_types", description: "Types of events to audit", suggestedValue: "Login, logout, privilege use, data access, configuration changes" }
        ]
    },
    "03.03.03": {
        odpName: "audit_review",
        parameters: [
            { name: "review_frequency", description: "Frequency of audit log review", suggestedValue: "Weekly for critical systems, monthly for others" }
        ]
    },
    "03.04.01": {
        odpName: "baseline_config",
        parameters: [
            { name: "baseline_components", description: "Components requiring baselines", suggestedValue: "OS, applications, network devices, security tools" }
        ]
    },
    "03.05.03": {
        odpName: "mfa_requirements",
        parameters: [
            { name: "mfa_access_types", description: "Access types requiring MFA", suggestedValue: "Network access, privileged access, remote access, CUI access" },
            { name: "authenticator_types", description: "Acceptable MFA types", suggestedValue: "Hardware token, push notification, TOTP" }
        ]
    },
    "03.05.05": {
        odpName: "identifier_management",
        parameters: [
            { name: "reuse_period", description: "Period before identifier can be reused", suggestedValue: "3 years" }
        ]
    },
    "03.05.06": {
        odpName: "account_disable",
        parameters: [
            { name: "inactivity_period", description: "Inactivity period before disabling", suggestedValue: "90 days" }
        ]
    },
    "03.05.07": {
        odpName: "password_complexity",
        parameters: [
            { name: "min_length", description: "Minimum password length", suggestedValue: "14 characters" },
            { name: "complexity", description: "Complexity requirements", suggestedValue: "Mix of upper, lower, number, special" }
        ]
    },
    "03.05.08": {
        odpName: "password_history",
        parameters: [
            { name: "remembered_passwords", description: "Number of passwords remembered", suggestedValue: "24" }
        ]
    },
    "03.06.01": {
        odpName: "incident_handling",
        parameters: [
            { name: "incident_types", description: "Types of incidents to handle", suggestedValue: "Malware, unauthorized access, data breach, DoS" }
        ]
    },
    "03.06.02": {
        odpName: "incident_reporting",
        parameters: [
            { name: "reporting_timeframe", description: "Timeframe for reporting incidents", suggestedValue: "72 hours for DoD, 24 hours for critical" }
        ]
    },
    "03.06.03": {
        odpName: "ir_testing",
        parameters: [
            { name: "testing_frequency", description: "Frequency of IR plan testing", suggestedValue: "Annually" }
        ]
    },
    "03.07.01": {
        odpName: "maintenance_schedule",
        parameters: [
            { name: "maintenance_frequency", description: "Maintenance schedule", suggestedValue: "Monthly patching, quarterly hardware" }
        ]
    },
    "03.08.03": {
        odpName: "media_sanitization",
        parameters: [
            { name: "sanitization_methods", description: "Approved sanitization methods", suggestedValue: "Clear, Purge, Destroy per NIST 800-88" }
        ]
    },
    "03.11.01": {
        odpName: "risk_assessment",
        parameters: [
            { name: "assessment_frequency", description: "Risk assessment frequency", suggestedValue: "Annually and upon significant changes" }
        ]
    },
    "03.11.02": {
        odpName: "vulnerability_scanning",
        parameters: [
            { name: "scan_frequency", description: "Vulnerability scan frequency", suggestedValue: "Monthly for authenticated, weekly for critical systems" }
        ]
    },
    "03.11.03": {
        odpName: "vulnerability_remediation",
        parameters: [
            { name: "critical_timeframe", description: "Critical vulnerability remediation", suggestedValue: "15 days" },
            { name: "high_timeframe", description: "High vulnerability remediation", suggestedValue: "30 days" },
            { name: "medium_timeframe", description: "Medium vulnerability remediation", suggestedValue: "90 days" }
        ]
    },
    "03.12.01": {
        odpName: "security_assessment",
        parameters: [
            { name: "assessment_frequency", description: "Security assessment frequency", suggestedValue: "Annually" }
        ]
    },
    "03.12.03": {
        odpName: "continuous_monitoring",
        parameters: [
            { name: "monitoring_frequency", description: "Continuous monitoring frequency", suggestedValue: "Real-time for critical, daily for standard" }
        ]
    },
    "03.14.01": {
        odpName: "malware_protection",
        parameters: [
            { name: "scan_frequency", description: "Malware scan frequency", suggestedValue: "Real-time with daily full scans" }
        ]
    },
    "03.14.02": {
        odpName: "signature_updates",
        parameters: [
            { name: "update_frequency", description: "Signature update frequency", suggestedValue: "Within 24 hours of release" }
        ]
    }
};

// Rev 3 Family Structure (new families added)
const REV3_FAMILIES = [
    { id: "AC", name: "Access Control", controlCount: 23 },
    { id: "AT", name: "Awareness and Training", controlCount: 3 },
    { id: "AU", name: "Audit and Accountability", controlCount: 9 },
    { id: "CM", name: "Configuration Management", controlCount: 11 },
    { id: "IA", name: "Identification and Authentication", controlCount: 11 },
    { id: "IR", name: "Incident Response", controlCount: 3 },
    { id: "MA", name: "Maintenance", controlCount: 6 },
    { id: "MP", name: "Media Protection", controlCount: 9 },
    { id: "PS", name: "Personnel Security", controlCount: 2 },
    { id: "PE", name: "Physical Protection", controlCount: 6 },
    { id: "RA", name: "Risk Assessment", controlCount: 4 },
    { id: "CA", name: "Security Assessment", controlCount: 4 },
    { id: "SC", name: "System and Communications Protection", controlCount: 16 },
    { id: "SI", name: "System and Information Integrity", controlCount: 8 },
    { id: "SR", name: "Supply Chain Risk Management", controlCount: 3, newInRev3: true },
    { id: "PL", name: "Planning", controlCount: 2, newInRev3: true }
];

// Migration Helper Functions
const Rev3MigrationHelper = {
    // Get Rev 3 ID from Rev 2 ID
    getRev3Id: function(rev2Id) {
        const mapping = REV2_TO_REV3_MIGRATION[rev2Id];
        return mapping ? mapping.rev3Id : null;
    },

    // Get Rev 2 ID from Rev 3 ID
    getRev2Id: function(rev3Id) {
        for (const [rev2Id, mapping] of Object.entries(REV2_TO_REV3_MIGRATION)) {
            if (mapping.rev3Id === rev3Id) {
                return rev2Id;
            }
        }
        return null;
    },

    // Check if control is new in Rev 3
    isNewInRev3: function(rev3Id) {
        return REV3_NEW_CONTROLS.some(c => c.id === rev3Id);
    },

    // Get migration notes for a control
    getMigrationNotes: function(rev2Id) {
        const mapping = REV2_TO_REV3_MIGRATION[rev2Id];
        return mapping ? mapping.notes : null;
    },

    // Get change type (renumbered, enhanced, merged, new)
    getChangeType: function(rev2Id) {
        const mapping = REV2_TO_REV3_MIGRATION[rev2Id];
        return mapping ? mapping.changeType : null;
    },

    // Get all enhanced controls (those with new ODPs)
    getEnhancedControls: function() {
        return Object.entries(REV2_TO_REV3_MIGRATION)
            .filter(([_, m]) => m.changeType === 'enhanced')
            .map(([id, m]) => ({ rev2Id: id, ...m }));
    },

    // Get ODPs for a Rev 3 control
    getODPs: function(rev3Id) {
        return REV3_ODPS[rev3Id] || null;
    },

    // Migrate assessment data from Rev 2 to Rev 3 format
    migrateAssessmentData: function(rev2Data) {
        const rev3Data = {};
        
        // Migrate existing controls
        for (const [rev2Id, status] of Object.entries(rev2Data)) {
            const mapping = REV2_TO_REV3_MIGRATION[rev2Id];
            if (mapping) {
                rev3Data[mapping.rev3Id] = {
                    status: status,
                    migratedFrom: rev2Id,
                    migrationDate: new Date().toISOString()
                };
            }
        }

        // Mark new controls as not-assessed
        REV3_NEW_CONTROLS.forEach(control => {
            rev3Data[control.id] = {
                status: 'not-assessed',
                newInRev3: true
            };
        });

        return rev3Data;
    },

    // Generate migration report
    generateMigrationReport: function(rev2Data) {
        const report = {
            timestamp: new Date().toISOString(),
            sourceFramework: "NIST SP 800-171A Rev 2",
            targetFramework: "NIST SP 800-171A Rev 3",
            summary: {
                totalRev2Controls: Object.keys(REV2_TO_REV3_MIGRATION).length,
                migratedControls: 0,
                enhancedControls: 0,
                newControls: REV3_NEW_CONTROLS.length,
                mergedControls: REV3_MERGED_CONTROLS.length
            },
            controls: [],
            newControlsRequired: [],
            odpUpdatesRequired: []
        };

        // Process each Rev 2 control
        for (const [rev2Id, mapping] of Object.entries(REV2_TO_REV3_MIGRATION)) {
            const status = rev2Data[rev2Id] || 'not-assessed';
            report.controls.push({
                rev2Id: rev2Id,
                rev3Id: mapping.rev3Id,
                changeType: mapping.changeType,
                currentStatus: status,
                notes: mapping.notes
            });
            report.summary.migratedControls++;
            
            if (mapping.changeType === 'enhanced') {
                report.summary.enhancedControls++;
                const odps = REV3_ODPS[mapping.rev3Id];
                if (odps) {
                    report.odpUpdatesRequired.push({
                        controlId: mapping.rev3Id,
                        ...odps
                    });
                }
            }
        }

        // Add new controls
        REV3_NEW_CONTROLS.forEach(control => {
            report.newControlsRequired.push({
                id: control.id,
                family: control.family,
                name: control.name,
                rationale: control.rationale
            });
        });

        return report;
    },

    // Get controls requiring ODP definition
    getControlsNeedingODPs: function() {
        return Object.entries(REV3_ODPS).map(([id, odp]) => ({
            controlId: id,
            ...odp
        }));
    }
};

// Export for use in application
if (typeof window !== 'undefined') {
    window.NIST_171A_R3_CONFIG = NIST_171A_R3_CONFIG;
    window.REV2_TO_REV3_MIGRATION = REV2_TO_REV3_MIGRATION;
    window.REV3_NEW_CONTROLS = REV3_NEW_CONTROLS;
    window.REV3_MERGED_CONTROLS = REV3_MERGED_CONTROLS;
    window.REV3_ODPS = REV3_ODPS;
    window.REV3_FAMILIES = REV3_FAMILIES;
    window.Rev3MigrationHelper = Rev3MigrationHelper;
}
