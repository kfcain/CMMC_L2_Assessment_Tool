// CMMC Lead CCA Assessor Questions
// Sample questions a Lead Certified CMMC Assessor would ask an Organization Seeking Certification (OSC)

const CCA_QUESTIONS = {
    // Access Control (AC) - Key objectives
    "3.1.1[a]": {
        questions: [
            "Can you show me the list of authorized users for systems processing CUI?",
            "How do you determine who is authorized to access CUI systems?",
            "Walk me through your user provisioning process for a new employee."
        ],
        evidenceRequests: ["User access list with authorization dates", "Access request and approval workflows", "HR onboarding procedures"]
    },
    "3.1.1[b]": {
        questions: ["How do you define processes authorized to act on behalf of users?", "What service accounts access CUI systems?"],
        evidenceRequests: ["Service account inventory", "Automated process documentation"]
    },
    "3.1.1[c]": {
        questions: ["What devices are authorized to connect to your CUI environment?", "How do you maintain an inventory of authorized devices?"],
        evidenceRequests: ["Device inventory/asset management records", "MDM enrollment list", "NAC logs"]
    },
    "3.1.1[d]": {
        questions: ["Show me how you limit system access to authorized users only.", "What technical controls prevent unauthorized access?"],
        evidenceRequests: ["Authentication system configuration", "Access control policy enforcement"]
    },
    "3.1.1[e]": {
        questions: ["How do you restrict access to only authorized processes?", "How do you prevent unauthorized scripts from accessing CUI?"],
        evidenceRequests: ["Application whitelisting configuration", "Service account permissions"]
    },
    "3.1.1[f]": {
        questions: ["How do you ensure only authorized devices can access CUI systems?", "Show me your device compliance policies."],
        evidenceRequests: ["Device compliance policy configuration", "Conditional access rules"]
    },
    "3.1.2[a]": {
        questions: ["How do you define what transactions each user is authorized to perform?", "Where is your RBAC documented?"],
        evidenceRequests: ["RBAC matrix or role definitions", "Job function to access mapping"]
    },
    "3.1.2[b]": {
        questions: ["Show me how you enforce authorized transactions.", "What prevents a user from performing unauthorized actions?"],
        evidenceRequests: ["Access control configuration", "Permission denied logs"]
    },
    "3.1.3[a]": {
        questions: ["How do you control the flow of CUI within your environment?", "Show me how you segment CUI from non-CUI systems."],
        evidenceRequests: ["Network segmentation diagrams", "Data flow diagrams for CUI", "DLP policies"]
    },
    "3.1.3[b]": {
        questions: ["What controls prevent CUI from leaving your authorized boundary?", "How do you monitor for unauthorized data exfiltration?"],
        evidenceRequests: ["Firewall egress rules", "DLP alerts and blocking evidence"]
    },
    "3.1.5[a]": {
        questions: ["What is your policy for least privilege?", "How do you ensure users only have access necessary for their job?"],
        evidenceRequests: ["Least privilege policy", "Access justification forms"]
    },
    "3.1.5[b]": {
        questions: ["How do you implement least privilege technically?", "How do you handle requests for elevated access?"],
        evidenceRequests: ["User permission configurations", "Just-in-time access logs"]
    },
    "3.1.7[a]": {
        questions: ["How do you prevent non-privileged users from executing privileged functions?"],
        evidenceRequests: ["UAC or sudo configuration", "Failed privilege escalation logs"]
    },
    "3.1.7[b]": {
        questions: ["Do you capture the execution of privileged functions in audit logs?", "Show me audit logs capturing privileged actions."],
        evidenceRequests: ["Audit log samples", "SIEM alerts for privileged functions"]
    },
    "3.1.8[a]": {
        questions: ["How do you limit unsuccessful login attempts?", "What is your lockout threshold?"],
        evidenceRequests: ["Account lockout policy", "Failed login attempt logs"]
    },
    "3.1.10[a]": {
        questions: ["How do you lock sessions after inactivity?", "What is your inactivity timeout threshold?"],
        evidenceRequests: ["Screen lock policy configuration", "Group policy/MDM settings"]
    },
    "3.1.12[a]": {
        questions: ["What remote access methods are authorized?", "Show me documentation of approved remote access."],
        evidenceRequests: ["Remote access policy", "Approved remote access methods"]
    },
    "3.1.12[c]": {
        questions: ["How do you enforce authorized remote access controls?", "What prevents unauthorized remote access?"],
        evidenceRequests: ["VPN configuration", "MFA requirements for remote access"]
    },
    "3.1.22[a]": {
        questions: ["How do you control CUI posted on publicly accessible systems?", "What review process exists?"],
        evidenceRequests: ["Public posting policy", "Content review procedures"]
    },

    // Awareness and Training (AT)
    "3.2.1[a]": {
        questions: ["How do you ensure managers are aware of security risks?", "What security training do managers receive?"],
        evidenceRequests: ["Manager security training curriculum", "Training completion records"]
    },
    "3.2.1[b]": {
        questions: ["How do you ensure users are aware of security policies?", "What training covers organizational policies?"],
        evidenceRequests: ["Security policy training materials", "User acknowledgment records"]
    },
    "3.2.2[a]": {
        questions: ["How do you train users to recognize security threats?", "Show me the training content."],
        evidenceRequests: ["Security awareness training materials", "Training completion certificates"]
    },
    "3.2.3[a]": {
        questions: ["Do you provide insider threat awareness training?", "What does the insider threat training cover?"],
        evidenceRequests: ["Insider threat training materials", "Training completion records"]
    },

    // Audit and Accountability (AU)
    "3.3.1[a]": {
        questions: ["What system audit logs do you maintain?", "Show me examples of audit logs."],
        evidenceRequests: ["Audit log samples", "Logging configuration"]
    },
    "3.3.1[b]": {
        questions: ["Do your logs contain enough detail to establish what happened?", "Can you trace an event from start to finish?"],
        evidenceRequests: ["Detailed audit log samples", "Audit trail reconstruction"]
    },
    "3.3.2[a]": {
        questions: ["Can you trace actions to individual users?", "How do you ensure user accountability?"],
        evidenceRequests: ["User-attributed audit logs", "Individual accountability policy"]
    },
    "3.3.5[a]": {
        questions: ["How do you correlate audit information?", "Do you use a SIEM?"],
        evidenceRequests: ["SIEM correlation rules", "Cross-system log aggregation"]
    },
    "3.3.8[a]": {
        questions: ["How do you protect audit information from unauthorized access?", "Who can access audit logs?"],
        evidenceRequests: ["Log access permissions", "Role-based access to logs"]
    },

    // Configuration Management (CM)
    "3.4.1[a]": {
        questions: ["Do you maintain baseline configurations?", "Show me your baseline documentation."],
        evidenceRequests: ["Baseline configuration documents", "Hardening standards"]
    },
    "3.4.1[b]": {
        questions: ["Do you maintain inventories of systems?", "Show me your asset inventory."],
        evidenceRequests: ["Asset inventory", "CMDB or inventory system"]
    },
    "3.4.2[a]": {
        questions: ["How do you establish security configuration settings?", "What standards do you follow (CIS, DISA STIGs)?"],
        evidenceRequests: ["Security configuration standards", "CIS/STIG implementation"]
    },
    "3.4.2[b]": {
        questions: ["How do you enforce security configuration settings?", "What tools enforce configurations?"],
        evidenceRequests: ["Configuration enforcement tools", "Compliance scan results"]
    },
    "3.4.6[a]": {
        questions: ["Do you employ least functionality?", "How do you disable unnecessary functions?"],
        evidenceRequests: ["Least functionality policy", "Disabled services documentation"]
    },
    "3.4.8[a]": {
        questions: ["How do you apply deny-by-exception for unauthorized software?", "What is your application whitelisting approach?"],
        evidenceRequests: ["Application whitelist policy", "Approved software list"]
    },

    // Identification and Authentication (IA)
    "3.5.1[a]": {
        questions: ["How do you identify system users?", "What identifiers are used?"],
        evidenceRequests: ["User identification policy", "Naming conventions"]
    },
    "3.5.2[a]": {
        questions: ["How do you authenticate users?", "What authentication mechanisms do you use?"],
        evidenceRequests: ["Authentication mechanism documentation", "MFA configuration"]
    },
    "3.5.3[a]": {
        questions: ["Do you use multi-factor authentication for local access?", "What MFA is required?"],
        evidenceRequests: ["MFA policy for local access", "MFA configuration screenshots"]
    },
    "3.5.3[b]": {
        questions: ["Do you use multi-factor authentication for network access?", "Show me network MFA configuration."],
        evidenceRequests: ["MFA policy for network access", "Conditional access MFA rules"]
    },
    "3.5.7[a]": {
        questions: ["What is your password complexity policy?", "Show me password policy configuration."],
        evidenceRequests: ["Password policy documentation", "Complexity requirements"]
    },
    "3.5.10[a]": {
        questions: ["How do you store passwords?", "Are passwords encrypted or hashed?"],
        evidenceRequests: ["Password storage mechanism", "Hashing algorithm used"]
    },

    // Incident Response (IR)
    "3.6.1[a]": {
        questions: ["Do you have an incident response capability?", "What is your incident response process?"],
        evidenceRequests: ["Incident response plan", "IR procedures"]
    },
    "3.6.2[a]": {
        questions: ["How do you track incidents?", "What ticketing system do you use?"],
        evidenceRequests: ["Incident tracking system", "Incident log/database"]
    },
    "3.6.3[a]": {
        questions: ["Do you test incident response capability?", "How often do you test?"],
        evidenceRequests: ["IR test plans", "Tabletop exercises", "After-action reports"]
    },

    // Maintenance (MA)
    "3.7.1[a]": {
        questions: ["How do you perform system maintenance?", "Show me maintenance procedures."],
        evidenceRequests: ["Maintenance procedures", "Maintenance schedules"]
    },
    "3.7.5[a]": {
        questions: ["Do you require MFA for remote maintenance?", "How is remote maintenance authenticated?"],
        evidenceRequests: ["Remote maintenance policy", "MFA configuration for remote access"]
    },

    // Media Protection (MP)
    "3.8.1[a]": {
        questions: ["How do you protect paper media containing CUI?", "What physical protections exist?"],
        evidenceRequests: ["Media protection policy", "Physical storage controls"]
    },
    "3.8.3[a]": {
        questions: ["How do you sanitize media before disposal?", "What sanitization methods do you use?"],
        evidenceRequests: ["Media sanitization procedures (NIST 800-88)", "Sanitization records"]
    },
    "3.8.6[a]": {
        questions: ["How do you implement cryptographic protection for portable storage?", "What encryption is used?"],
        evidenceRequests: ["Portable storage encryption policy", "BitLocker To Go or similar"]
    },
    "3.8.9[a]": {
        questions: ["How do you protect backup CUI?", "What controls exist for backups?"],
        evidenceRequests: ["Backup protection policy", "Backup encryption"]
    },

    // Personnel Security (PS)
    "3.9.1[a]": {
        questions: ["Do you screen individuals before granting CUI access?", "What screening is performed?"],
        evidenceRequests: ["Personnel screening policy", "Background check procedures"]
    },
    "3.9.2[a]": {
        questions: ["How do you handle CUI during personnel transfers?", "What actions occur during transfer?"],
        evidenceRequests: ["Transfer procedures", "Access modification records"]
    },
    "3.9.2[b]": {
        questions: ["How do you handle CUI during terminations?", "What is your termination process?"],
        evidenceRequests: ["Termination checklist", "Access revocation records"]
    },

    // Physical Protection (PE)
    "3.10.1[a]": {
        questions: ["How do you limit physical access to authorized individuals?", "What physical access controls exist?"],
        evidenceRequests: ["Physical access policy", "Badge/key control system"]
    },
    "3.10.3[a]": {
        questions: ["Do you escort visitors?", "What is your visitor policy?"],
        evidenceRequests: ["Visitor policy", "Escort procedures", "Visitor logs"]
    },
    "3.10.6[a]": {
        questions: ["How do you enforce safeguarding for alternate work sites?", "What controls exist for remote work?"],
        evidenceRequests: ["Remote work policy", "Home office requirements"]
    },

    // Risk Assessment (RA)
    "3.11.1[a]": {
        questions: ["Do you periodically assess risk?", "What is your risk assessment process?"],
        evidenceRequests: ["Risk assessment methodology", "Recent risk assessment results"]
    },
    "3.11.2[a]": {
        questions: ["How do you scan for vulnerabilities?", "What vulnerability scanning do you perform?"],
        evidenceRequests: ["Vulnerability scanning tools", "Recent scan reports"]
    },
    "3.11.3[a]": {
        questions: ["How do you remediate vulnerabilities?", "What is your remediation process?"],
        evidenceRequests: ["Vulnerability remediation procedures", "Patch management process"]
    },

    // Security Assessment (CA)
    "3.12.1[a]": {
        questions: ["Do you periodically assess security controls?", "What is your assessment process?"],
        evidenceRequests: ["Security control assessment procedures", "Assessment results"]
    },
    "3.12.2[a]": {
        questions: ["Do you have a plan of action and milestones (POA&M)?", "How do you track remediation?"],
        evidenceRequests: ["POA&M document", "Remediation tracking"]
    },
    "3.12.3[a]": {
        questions: ["Do you monitor security controls continuously?", "What continuous monitoring do you perform?"],
        evidenceRequests: ["Continuous monitoring plan", "Monitoring dashboards"]
    },
    "3.12.4[a]": {
        questions: ["Do you have a system security plan (SSP)?", "Can I see your SSP?"],
        evidenceRequests: ["System Security Plan", "SSP updates"]
    },

    // System and Communications Protection (SC)
    "3.13.1[a]": {
        questions: ["How do you monitor communications at external boundaries?", "Show me boundary protection."],
        evidenceRequests: ["Firewall configurations", "IDS/IPS configurations"]
    },
    "3.13.1[b]": {
        questions: ["How do you monitor communications at key internal boundaries?"],
        evidenceRequests: ["Internal network segmentation", "Internal monitoring"]
    },
    "3.13.5[a]": {
        questions: ["How do you implement subnetworks for publicly accessible systems?", "Show me DMZ configuration."],
        evidenceRequests: ["DMZ architecture", "Network diagrams"]
    },
    "3.13.8[a]": {
        questions: ["How do you implement cryptographic mechanisms to prevent unauthorized disclosure during transmission?"],
        evidenceRequests: ["TLS configuration", "Encryption in transit"]
    },
    "3.13.11[a]": {
        questions: ["Do you employ FIPS-validated cryptography?", "Show me FIPS compliance."],
        evidenceRequests: ["FIPS 140-2 validation certificates", "Cryptographic module documentation"]
    },
    "3.13.16[a]": {
        questions: ["How do you protect CUI at rest?", "Show me encryption at rest."],
        evidenceRequests: ["Data at rest encryption", "BitLocker/encryption configuration"]
    },

    // System and Information Integrity (SI)
    "3.14.1[a]": {
        questions: ["How do you identify system flaws?", "What vulnerability identification do you perform?"],
        evidenceRequests: ["Vulnerability scanning", "Flaw identification process"]
    },
    "3.14.1[b]": {
        questions: ["How do you report system flaws?", "What is your reporting process?"],
        evidenceRequests: ["Flaw reporting procedures", "Vulnerability tickets"]
    },
    "3.14.1[c]": {
        questions: ["How do you correct system flaws?", "Show me your patching process."],
        evidenceRequests: ["Patch management procedures", "Remediation records"]
    },
    "3.14.2[a]": {
        questions: ["Do you provide malicious code protection at designated locations?", "Where is AV deployed?"],
        evidenceRequests: ["Antivirus/EDR deployment", "Protection point inventory"]
    },
    "3.14.3[a]": {
        questions: ["Do you monitor security alerts?", "What alerts do you track?"],
        evidenceRequests: ["Security alert monitoring", "Alert response procedures"]
    },
    "3.14.4[a]": {
        questions: ["Do you update malicious code protection mechanisms?", "How often are definitions updated?"],
        evidenceRequests: ["AV update configuration", "Update logs"]
    },
    "3.14.5[a]": {
        questions: ["Do you perform periodic scans?", "What is your scan schedule?"],
        evidenceRequests: ["Scan schedules", "Scan results"]
    },
    "3.14.6[a]": {
        questions: ["Do you monitor systems for unauthorized use?", "What monitoring is in place?"],
        evidenceRequests: ["Unauthorized use monitoring", "SIEM configuration"]
    },
    "3.14.7[a]": {
        questions: ["How do you identify unauthorized use of systems?", "What constitutes unauthorized use?"],
        evidenceRequests: ["Unauthorized use definitions", "Detection mechanisms"]
    }
};

// Helper function to get CCA questions for an objective
function getCCAQuestions(objectiveId) {
    return CCA_QUESTIONS[objectiveId] || null;
}
