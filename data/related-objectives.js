// Related Objectives Mapping
// Groups objectives that can be fulfilled by the same evidence and/or SSP implementation

const RELATED_OBJECTIVES = {
    // Encryption Controls - TLS/Data in Transit/FIPS Cryptography
    "encryption": {
        label: "Encryption & Cryptography",
        description: "These controls share evidence around cryptographic implementations, TLS configurations, and data protection",
        controls: ["3.13.8", "3.13.11", "3.13.16"],
        evidenceTypes: ["TLS configuration screenshots", "Encryption policy", "FIPS validation certificates", "Key management procedures"]
    },

    // Account Management - User provisioning, access reviews, account types
    "account-management": {
        label: "Account Management",
        description: "Controls related to user account lifecycle, provisioning, and access management",
        controls: ["3.1.1", "3.1.2", "3.5.1", "3.5.2"],
        evidenceTypes: ["User provisioning procedures", "Access request forms", "Account inventory", "Joiner/mover/leaver process"]
    },

    // Multi-Factor Authentication
    "mfa": {
        label: "Multi-Factor Authentication",
        description: "Controls requiring MFA implementation evidence",
        controls: ["3.5.3", "3.7.5", "3.1.12"],
        evidenceTypes: ["MFA policy", "MFA configuration screenshots", "Conditional access policies", "Authentication logs"]
    },

    // Audit Logging & Monitoring
    "audit-logging": {
        label: "Audit & Logging",
        description: "Controls around audit log generation, protection, and review",
        controls: ["3.3.1", "3.3.2", "3.3.5", "3.3.6", "3.3.8", "3.3.9"],
        evidenceTypes: ["SIEM configuration", "Log retention policy", "Audit log samples", "Log review procedures"]
    },

    // Security Awareness Training
    "security-training": {
        label: "Security Awareness Training",
        description: "Controls related to security training and awareness programs",
        controls: ["3.2.1", "3.2.2", "3.2.3"],
        evidenceTypes: ["Training policy", "Training completion records", "Training materials", "Phishing simulation results"]
    },

    // Configuration & Baseline Management
    "configuration-management": {
        label: "Configuration Management",
        description: "Controls for system configuration, baselines, and hardening",
        controls: ["3.4.1", "3.4.2", "3.4.6", "3.4.7", "3.4.8"],
        evidenceTypes: ["Baseline configurations", "CIS benchmark reports", "Configuration change logs", "Hardening standards"]
    },

    // Vulnerability Management
    "vulnerability-management": {
        label: "Vulnerability Management",
        description: "Controls for vulnerability scanning, remediation, and patch management",
        controls: ["3.11.2", "3.11.3", "3.14.1"],
        evidenceTypes: ["Vulnerability scan reports", "Patch management policy", "Remediation tracking", "POAM entries"]
    },

    // Malware Protection & Endpoint Security
    "endpoint-protection": {
        label: "Endpoint Protection",
        description: "Controls for malware detection, prevention, and endpoint security",
        controls: ["3.14.2", "3.14.3", "3.14.4", "3.14.5"],
        evidenceTypes: ["EDR/AV configuration", "Malware detection logs", "Endpoint protection policy", "Update verification"]
    },

    // Incident Response
    "incident-response": {
        label: "Incident Response",
        description: "Controls for incident handling, reporting, and response capabilities",
        controls: ["3.6.1", "3.6.2", "3.6.3"],
        evidenceTypes: ["Incident response plan", "Incident tickets/logs", "Tabletop exercise results", "Reporting procedures"]
    },

    // Media Protection & Sanitization
    "media-protection": {
        label: "Media Protection",
        description: "Controls for media handling, storage, transport, and sanitization",
        controls: ["3.8.1", "3.8.2", "3.8.3", "3.8.4", "3.8.5"],
        evidenceTypes: ["Media handling policy", "Sanitization records", "Encryption verification", "Transport logs"]
    },

    // Remote Access & Session Management
    "remote-access": {
        label: "Remote Access",
        description: "Controls for remote access, VPN, and session management",
        controls: ["3.1.12", "3.1.13", "3.1.14", "3.1.15"],
        evidenceTypes: ["VPN configuration", "Remote access policy", "Session timeout settings", "Connection logs"]
    },

    // Network Security & Boundary Protection
    "network-security": {
        label: "Network Security",
        description: "Controls for network segmentation, firewalls, and boundary protection",
        controls: ["3.13.1", "3.13.2", "3.13.5", "3.13.6"],
        evidenceTypes: ["Network diagrams", "Firewall rules", "Segmentation evidence", "ACL configurations"]
    },

    // Physical Security
    "physical-security": {
        label: "Physical Security",
        description: "Controls for physical access, monitoring, and protection",
        controls: ["3.10.1", "3.10.2", "3.10.3", "3.10.4", "3.10.5", "3.10.6"],
        evidenceTypes: ["Physical access logs", "Badge reader configurations", "Visitor logs", "Surveillance evidence"]
    },

    // Personnel Security
    "personnel-security": {
        label: "Personnel Security",
        description: "Controls for personnel screening, termination, and transfers",
        controls: ["3.9.1", "3.9.2"],
        evidenceTypes: ["Background check policy", "Termination checklists", "Access revocation evidence", "HR procedures"]
    },

    // Risk Assessment
    "risk-assessment": {
        label: "Risk Assessment",
        description: "Controls for risk identification, assessment, and management",
        controls: ["3.11.1", "3.11.2", "3.11.3"],
        evidenceTypes: ["Risk assessment reports", "Risk register", "Threat analysis", "Vulnerability assessments"]
    },

    // System Backup & Recovery
    "backup-recovery": {
        label: "Backup & Recovery",
        description: "Controls for data backup, protection, and recovery capabilities",
        controls: ["3.8.9", "3.6.3"],
        evidenceTypes: ["Backup policy", "Backup logs", "Recovery test results", "Restoration procedures"]
    },

    // Privileged Access Management
    "privileged-access": {
        label: "Privileged Access",
        description: "Controls for privileged account management and least privilege",
        controls: ["3.1.5", "3.1.6", "3.1.7", "3.1.8"],
        evidenceTypes: ["Privileged account inventory", "PAM tool configuration", "Privilege escalation logs", "Admin access reviews"]
    },

    // Wireless Security
    "wireless-security": {
        label: "Wireless Security",
        description: "Controls for wireless network protection and authentication",
        controls: ["3.1.16", "3.1.17"],
        evidenceTypes: ["Wireless configuration", "WPA2/WPA3 settings", "Rogue AP detection", "Wireless access policy"]
    },

    // Mobile Device Management
    "mobile-security": {
        label: "Mobile Device Security",
        description: "Controls for mobile device management and protection",
        controls: ["3.1.18", "3.1.19"],
        evidenceTypes: ["MDM configuration", "Mobile device policy", "Encryption verification", "Remote wipe capability"]
    },

    // Security Assessment & Authorization
    "security-assessment": {
        label: "Security Assessment",
        description: "Controls for security testing, assessment, and continuous monitoring",
        controls: ["3.12.1", "3.12.2", "3.12.3", "3.12.4"],
        evidenceTypes: ["Security assessment plan", "Penetration test results", "Continuous monitoring evidence", "POA&M"]
    },

    // System Monitoring & Alerting
    "system-monitoring": {
        label: "System Monitoring",
        description: "Controls for system monitoring, alerting, and anomaly detection",
        controls: ["3.14.6", "3.14.7", "3.3.5"],
        evidenceTypes: ["SIEM dashboards", "Alert configurations", "Monitoring procedures", "Anomaly detection evidence"]
    },

    // Password & Authenticator Management
    "authenticator-management": {
        label: "Authenticator Management",
        description: "Controls for password policies and authenticator protection",
        controls: ["3.5.7", "3.5.8", "3.5.9", "3.5.10", "3.5.11"],
        evidenceTypes: ["Password policy", "Authenticator storage evidence", "Complexity requirements", "Rotation procedures"]
    },

    // Maintenance & Support
    "maintenance": {
        label: "System Maintenance",
        description: "Controls for system maintenance, tools, and remote maintenance",
        controls: ["3.7.1", "3.7.2", "3.7.3", "3.7.4", "3.7.5", "3.7.6"],
        evidenceTypes: ["Maintenance logs", "Maintenance policy", "Authorized personnel list", "Remote maintenance procedures"]
    }
};

// Build reverse lookup map (control -> groups)
const CONTROL_TO_GROUPS = {};
Object.entries(RELATED_OBJECTIVES).forEach(([groupId, group]) => {
    group.controls.forEach(controlId => {
        if (!CONTROL_TO_GROUPS[controlId]) {
            CONTROL_TO_GROUPS[controlId] = [];
        }
        CONTROL_TO_GROUPS[controlId].push(groupId);
    });
});

// Helper function to get related objectives for a control
function getRelatedObjectives(controlId) {
    // Strip objective suffix to get control ID (e.g., "3.1.1[a]" -> "3.1.1")
    const baseControlId = controlId.replace(/\[.*\]$/, '');
    
    const groupIds = CONTROL_TO_GROUPS[baseControlId];
    if (!groupIds || groupIds.length === 0) {
        return null;
    }

    const results = [];
    groupIds.forEach(groupId => {
        const group = RELATED_OBJECTIVES[groupId];
        const relatedControls = group.controls.filter(c => c !== baseControlId);
        if (relatedControls.length > 0) {
            results.push({
                groupId: groupId,
                label: group.label,
                description: group.description,
                relatedControls: relatedControls,
                evidenceTypes: group.evidenceTypes
            });
        }
    });

    return results.length > 0 ? results : null;
}
