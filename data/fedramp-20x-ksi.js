// FedRAMP 20x Key Security Indicators (KSI) - Phase 2
// Source: https://www.fedramp.gov/20x/ via myctrl.tools
// Pilot program for Low and Moderate impact levels

const FEDRAMP_20X_KSI = {
    metadata: {
        version: "Phase 2",
        source: "https://www.fedramp.gov/20x/",
        totalIndicators: 61
    },
    
    // KSI Family Definitions
    families: {
        AFR: { name: "Authorization by FedRAMP", description: "FedRAMP-specific authorization requirements" },
        CED: { name: "Cybersecurity Education", description: "Training and awareness requirements" },
        CMT: { name: "Change Management", description: "Change control and deployment processes" },
        CNA: { name: "Cloud Native Architecture", description: "Cloud-native security architecture" },
        IAM: { name: "Identity and Access Management", description: "Authentication and authorization" },
        INR: { name: "Incident Response", description: "Incident handling and response" },
        MLA: { name: "Monitoring, Logging, and Auditing", description: "Security monitoring and logging" },
        PIY: { name: "Policy and Inventory", description: "Security policy and asset management" },
        RPL: { name: "Recovery Planning", description: "Backup and disaster recovery" },
        SVC: { name: "Service Configuration", description: "Secure service configuration" },
        TPR: { name: "Third-Party Information Resources", description: "Supply chain and vendor risk" }
    },
    
    // All 61 KSI indicators
    indicators: {
        "KSI-AFR-01": { title: "Minimum Assessment Scope", family: "AFR", low: true, moderate: true },
        "KSI-AFR-02": { title: "Key Security Indicators", family: "AFR", low: true, moderate: true },
        "KSI-AFR-03": { title: "Authorization Data Sharing", family: "AFR", low: true, moderate: true },
        "KSI-AFR-04": { title: "Vulnerability Detection and Response", family: "AFR", low: true, moderate: true },
        "KSI-AFR-05": { title: "Significant Change Notifications", family: "AFR", low: true, moderate: true },
        "KSI-AFR-06": { title: "Collaborative Continuous Monitoring", family: "AFR", low: true, moderate: true },
        "KSI-AFR-07": { title: "Recommended Secure Configuration", family: "AFR", low: true, moderate: true },
        "KSI-AFR-08": { title: "FedRAMP Security Inbox", family: "AFR", low: true, moderate: true },
        "KSI-AFR-09": { title: "Persistent Validation and Assessment", family: "AFR", low: true, moderate: true },
        "KSI-AFR-10": { title: "Incident Communications Procedures", family: "AFR", low: true, moderate: true },
        "KSI-AFR-11": { title: "Using Cryptographic Modules", family: "AFR", low: true, moderate: true },
        
        "KSI-CED-01": { title: "General Training", family: "CED", low: true, moderate: true },
        "KSI-CED-02": { title: "Role-Specific Training", family: "CED", low: true, moderate: true },
        "KSI-CED-03": { title: "Development and Engineering Training", family: "CED", low: true, moderate: true },
        "KSI-CED-04": { title: "Incident Response and Disaster Recovery Training", family: "CED", low: true, moderate: true },
        
        "KSI-CMT-01": { title: "Log and Monitor Changes", family: "CMT", low: true, moderate: true },
        "KSI-CMT-02": { title: "Redeployment", family: "CMT", low: true, moderate: true },
        "KSI-CMT-03": { title: "Automated Testing and Validation", family: "CMT", low: true, moderate: true },
        "KSI-CMT-04": { title: "Change Management Procedures", family: "CMT", low: true, moderate: true },
        
        "KSI-CNA-01": { title: "Restrict Network Traffic", family: "CNA", low: true, moderate: true },
        "KSI-CNA-02": { title: "Attack Surface", family: "CNA", low: true, moderate: true },
        "KSI-CNA-03": { title: "Enforce Traffic Flow", family: "CNA", low: true, moderate: true },
        "KSI-CNA-04": { title: "Immutable Infrastructure", family: "CNA", low: true, moderate: true },
        "KSI-CNA-05": { title: "Unwanted Activity", family: "CNA", low: true, moderate: true },
        "KSI-CNA-06": { title: "High Availability", family: "CNA", low: true, moderate: true },
        "KSI-CNA-07": { title: "Best Practices", family: "CNA", low: true, moderate: true },
        "KSI-CNA-08": { title: "Automated Enforcement", family: "CNA", low: false, moderate: true },
        
        "KSI-IAM-01": { title: "Phishing-Resistant MFA", family: "IAM", low: true, moderate: true },
        "KSI-IAM-02": { title: "Passwordless Authentication", family: "IAM", low: true, moderate: true },
        "KSI-IAM-03": { title: "Non-User Accounts", family: "IAM", low: true, moderate: true },
        "KSI-IAM-04": { title: "Just-in-Time Authorization", family: "IAM", low: true, moderate: true },
        "KSI-IAM-05": { title: "Least Privilege", family: "IAM", low: true, moderate: true },
        "KSI-IAM-06": { title: "Suspicious Activity", family: "IAM", low: true, moderate: true },
        "KSI-IAM-07": { title: "Automated Account Management", family: "IAM", low: true, moderate: true },
        
        "KSI-INR-01": { title: "Incident Response Procedures", family: "INR", low: true, moderate: true },
        "KSI-INR-02": { title: "Incident Review", family: "INR", low: true, moderate: true },
        "KSI-INR-03": { title: "Incident After Action Reports", family: "INR", low: true, moderate: true },
        
        "KSI-MLA-01": { title: "Security Information and Event Management (SIEM)", family: "MLA", low: true, moderate: true },
        "KSI-MLA-02": { title: "Audit Logging", family: "MLA", low: true, moderate: true },
        "KSI-MLA-05": { title: "Evaluate Configuration", family: "MLA", low: true, moderate: true },
        "KSI-MLA-07": { title: "Event Types", family: "MLA", low: true, moderate: true },
        "KSI-MLA-08": { title: "Log Data Access", family: "MLA", low: false, moderate: true },
        
        "KSI-PIY-01": { title: "Automated Inventory", family: "PIY", low: true, moderate: true },
        "KSI-PIY-03": { title: "Vulnerability Disclosure Program", family: "PIY", low: true, moderate: true },
        "KSI-PIY-04": { title: "CISA Secure By Design", family: "PIY", low: true, moderate: true },
        "KSI-PIY-06": { title: "Security Investment Effectiveness", family: "PIY", low: true, moderate: true },
        "KSI-PIY-08": { title: "Executive Support", family: "PIY", low: true, moderate: true },
        
        "KSI-RPL-01": { title: "Recovery Objectives", family: "RPL", low: true, moderate: true },
        "KSI-RPL-02": { title: "Recovery Plan", family: "RPL", low: true, moderate: true },
        "KSI-RPL-03": { title: "System Backups", family: "RPL", low: true, moderate: true },
        "KSI-RPL-04": { title: "Recovery Testing", family: "RPL", low: true, moderate: true },
        
        "KSI-SVC-01": { title: "Continuous Improvement", family: "SVC", low: true, moderate: true },
        "KSI-SVC-02": { title: "Network Encryption", family: "SVC", low: true, moderate: true },
        "KSI-SVC-04": { title: "Configuration Automation", family: "SVC", low: true, moderate: true },
        "KSI-SVC-05": { title: "Resource Integrity", family: "SVC", low: true, moderate: true },
        "KSI-SVC-06": { title: "Secret Management", family: "SVC", low: true, moderate: true },
        "KSI-SVC-08": { title: "Prevent Residual Risk", family: "SVC", low: false, moderate: true },
        "KSI-SVC-09": { title: "Communication Integrity", family: "SVC", low: false, moderate: true },
        "KSI-SVC-10": { title: "Unwanted Data Removal", family: "SVC", low: false, moderate: true },
        
        "KSI-TPR-03": { title: "Supply Chain Risk Management", family: "TPR", low: true, moderate: true },
        "KSI-TPR-04": { title: "Supply Chain Risk Monitoring", family: "TPR", low: true, moderate: true }
    },
    
    // Mapping from NIST 800-53 controls to relevant KSIs (for reverse lookup)
    nist80053ToKSI: {
        "AC-2": ["KSI-IAM-01", "KSI-IAM-02", "KSI-IAM-03", "KSI-IAM-04", "KSI-IAM-06", "KSI-IAM-07"],
        "AC-3": ["KSI-IAM-02", "KSI-IAM-04", "KSI-IAM-05"],
        "AC-4": ["KSI-AFR-03", "KSI-IAM-03", "KSI-IAM-04", "KSI-IAM-05"],
        "AC-5": ["KSI-IAM-04", "KSI-PIY-04", "KSI-PIY-06"],
        "AC-6": ["KSI-IAM-04", "KSI-IAM-05"],
        "AC-7": ["KSI-IAM-04", "KSI-IAM-06"],
        "AC-12": ["KSI-CNA-03", "KSI-IAM-05"],
        "AC-17": ["KSI-IAM-04", "KSI-IAM-05"],
        "AC-18": ["KSI-CNA-02"],
        "AC-20": ["KSI-CNA-02", "KSI-IAM-04", "KSI-IAM-05", "KSI-TPR-03", "KSI-TPR-04"],
        "AT-2": ["KSI-CED-01", "KSI-CED-02"],
        "AT-3": ["KSI-CED-02"],
        "AU-2": ["KSI-AFR-03", "KSI-CMT-01", "KSI-MLA-01", "KSI-MLA-02", "KSI-MLA-07"],
        "AU-3": ["KSI-AFR-03", "KSI-MLA-01"],
        "AU-6": ["KSI-AFR-03", "KSI-MLA-02"],
        "AU-7": ["KSI-MLA-01"],
        "AU-8": ["KSI-MLA-01"],
        "AU-9": ["KSI-MLA-01"],
        "AU-11": ["KSI-MLA-01"],
        "AU-12": ["KSI-MLA-07"],
        "CA-2": ["KSI-AFR-03", "KSI-AFR-04", "KSI-PIY-06"],
        "CA-7": ["KSI-AFR-04", "KSI-AFR-05", "KSI-MLA-05"],
        "CM-2": ["KSI-CMT-02", "KSI-CNA-04", "KSI-CNA-07", "KSI-MLA-05", "KSI-SVC-04"],
        "CM-3": ["KSI-CMT-01", "KSI-CMT-02", "KSI-CMT-03", "KSI-CMT-04"],
        "CM-4": ["KSI-CMT-03", "KSI-AFR-05"],
        "CM-5": ["KSI-CMT-02", "KSI-CMT-04", "KSI-IAM-04"],
        "CM-6": ["KSI-CMT-01", "KSI-CMT-02", "KSI-MLA-05", "KSI-SVC-04"],
        "CM-7": ["KSI-CMT-02", "KSI-IAM-04"],
        "CM-8": ["KSI-PIY-01"],
        "CP-2": ["KSI-RPL-02"],
        "CP-4": ["KSI-RPL-04"],
        "CP-6": ["KSI-RPL-02", "KSI-RPL-03", "KSI-RPL-04"],
        "CP-9": ["KSI-RPL-03"],
        "CP-10": ["KSI-RPL-01", "KSI-RPL-02", "KSI-RPL-03", "KSI-RPL-04"],
        "IA-2": ["KSI-IAM-01", "KSI-IAM-05"],
        "IA-3": ["KSI-IAM-03", "KSI-IAM-05"],
        "IA-4": ["KSI-IAM-04", "KSI-IAM-05", "KSI-IAM-07"],
        "IA-5": ["KSI-IAM-01", "KSI-IAM-02", "KSI-IAM-03", "KSI-IAM-05", "KSI-SVC-06"],
        "IR-3": ["KSI-INR-02", "KSI-INR-03", "KSI-RPL-04"],
        "IR-4": ["KSI-AFR-03", "KSI-AFR-04", "KSI-INR-01", "KSI-INR-02", "KSI-INR-03", "KSI-MLA-01"],
        "IR-5": ["KSI-AFR-04", "KSI-INR-02"],
        "IR-6": ["KSI-AFR-04", "KSI-INR-01"],
        "IR-7": ["KSI-INR-01"],
        "IR-8": ["KSI-INR-01", "KSI-INR-02", "KSI-INR-03"],
        "MA-2": ["KSI-CMT-01", "KSI-SVC-01"],
        "RA-5": ["KSI-AFR-03", "KSI-AFR-04", "KSI-AFR-05", "KSI-TPR-04"],
        "SA-9": ["KSI-TPR-03", "KSI-TPR-04"],
        "SC-4": ["KSI-CNA-03", "KSI-IAM-05", "KSI-PIY-04", "KSI-SVC-08"],
        "SC-5": ["KSI-CNA-05"],
        "SC-7": ["KSI-CNA-03", "KSI-SVC-01"],
        "SC-8": ["KSI-AFR-03", "KSI-CNA-02", "KSI-CNA-03", "KSI-SVC-02"],
        "SC-12": ["KSI-SVC-06"],
        "SC-13": ["KSI-SVC-02", "KSI-SVC-05"],
        "SC-17": ["KSI-SVC-06"],
        "SI-2": ["KSI-AFR-04", "KSI-AFR-05", "KSI-CMT-03", "KSI-SVC-01"],
        "SI-3": ["KSI-AFR-04", "KSI-AFR-05", "KSI-CMT-02", "KSI-CNA-04", "KSI-IAM-05"],
        "SI-4": ["KSI-AFR-04", "KSI-MLA-02", "KSI-SVC-01"],
        "SI-7": ["KSI-SVC-05", "KSI-SVC-09", "KSI-TPR-03"],
        "SR-5": ["KSI-TPR-03", "KSI-TPR-04"],
        "SR-6": ["KSI-TPR-03", "KSI-TPR-04"]
    }
};

// Helper function to get KSIs for a NIST 800-171 control based on its 800-53 mappings
function getKSIsForControl(nist80053Controls) {
    const ksis = new Set();
    nist80053Controls.forEach(ctrl => {
        // Strip enhancement numbers for base control lookup
        const baseCtrl = ctrl.split('(')[0];
        const matches = FEDRAMP_20X_KSI.nist80053ToKSI[baseCtrl] || [];
        matches.forEach(ksi => ksis.add(ksi));
        // Also check full control with enhancement
        const fullMatches = FEDRAMP_20X_KSI.nist80053ToKSI[ctrl] || [];
        fullMatches.forEach(ksi => ksis.add(ksi));
    });
    return Array.from(ksis);
}
