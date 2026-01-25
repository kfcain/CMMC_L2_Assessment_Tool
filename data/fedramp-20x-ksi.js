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
    
    // All 61 KSI indicators with descriptions
    // Source: https://www.fedramp.gov/20x/ and myctrl.tools
    indicators: {
        // Authorization by FedRAMP (AFR)
        "KSI-AFR-01": { 
            title: "Minimum Assessment Scope", 
            family: "AFR", 
            low: true, 
            moderate: true,
            description: "Apply the FedRAMP Minimum Assessment Scope (MAS) to identify and document the scope of the cloud service offering to be assessed for FedRAMP authorization and provide detailed documentation of the security boundary."
        },
        "KSI-AFR-02": { 
            title: "Key Security Indicators", 
            family: "AFR", 
            low: true, 
            moderate: true,
            description: "Demonstrate compliance with all applicable Key Security Indicators (KSIs) for the target FedRAMP authorization level."
        },
        "KSI-AFR-03": { 
            title: "Authorization Data Sharing", 
            family: "AFR", 
            low: true, 
            moderate: true,
            description: "Share authorization package data with FedRAMP and authorized agency customers, including continuous monitoring data, vulnerability scan results, and incident reports."
        },
        "KSI-AFR-04": { 
            title: "Vulnerability Detection and Response", 
            family: "AFR", 
            low: true, 
            moderate: true,
            description: "Persistently detect and respond to vulnerabilities across all information resources within the authorization boundary, including timely remediation per FedRAMP requirements."
        },
        "KSI-AFR-05": { 
            title: "Significant Change Notifications", 
            family: "AFR", 
            low: true, 
            moderate: true,
            description: "Notify FedRAMP and agency customers of significant changes to the system, security posture, or authorization boundary within required timeframes."
        },
        "KSI-AFR-06": { 
            title: "Collaborative Continuous Monitoring", 
            family: "AFR", 
            low: true, 
            moderate: true,
            description: "Participate in FedRAMP's collaborative continuous monitoring program, including automated data feeds and regular security status reporting."
        },
        "KSI-AFR-07": { 
            title: "Recommended Secure Configuration", 
            family: "AFR", 
            low: true, 
            moderate: true,
            description: "Publish and maintain recommended secure configurations for agency customers using the cloud service offering."
        },
        "KSI-AFR-08": { 
            title: "FedRAMP Security Inbox", 
            family: "AFR", 
            low: true, 
            moderate: true,
            description: "Maintain a monitored security inbox for FedRAMP communications, incident notifications, and vulnerability disclosures with documented response procedures."
        },
        "KSI-AFR-09": { 
            title: "Persistent Validation and Assessment", 
            family: "AFR", 
            low: true, 
            moderate: true,
            description: "Enable persistent validation and assessment of security controls through automated monitoring, continuous testing, and evidence collection."
        },
        "KSI-AFR-10": { 
            title: "Incident Communications Procedures", 
            family: "AFR", 
            low: true, 
            moderate: true,
            description: "Establish and maintain incident communication procedures for notifying FedRAMP and agency customers of security incidents within required timeframes."
        },
        "KSI-AFR-11": { 
            title: "Using Cryptographic Modules", 
            family: "AFR", 
            low: true, 
            moderate: true,
            description: "Use FIPS 140-2/140-3 validated cryptographic modules for all cryptographic operations protecting federal information."
        },
        
        // Cybersecurity Education (CED)
        "KSI-CED-01": { 
            title: "General Training", 
            family: "CED", 
            low: true, 
            moderate: true,
            description: "Persistently review the effectiveness of training given to all employees on policies, procedures, and security-related topics including phishing awareness and social engineering."
        },
        "KSI-CED-02": { 
            title: "Role-Specific Training", 
            family: "CED", 
            low: true, 
            moderate: true,
            description: "Provide role-specific security training to personnel with significant security responsibilities, including administrators, developers, and incident responders."
        },
        "KSI-CED-03": { 
            title: "Development and Engineering Training", 
            family: "CED", 
            low: true, 
            moderate: true,
            description: "Ensure development and engineering personnel receive training on secure coding practices, security architecture, and secure development lifecycle."
        },
        "KSI-CED-04": { 
            title: "Incident Response and Disaster Recovery Training", 
            family: "CED", 
            low: true, 
            moderate: true,
            description: "Provide training on incident response and disaster recovery procedures to personnel with roles in these processes, including tabletop exercises."
        },
        
        // Change Management (CMT)
        "KSI-CMT-01": { 
            title: "Log and Monitor Changes", 
            family: "CMT", 
            low: true, 
            moderate: true,
            description: "Log and monitor all changes to information resources, including configuration changes, code deployments, and infrastructure modifications."
        },
        "KSI-CMT-02": { 
            title: "Redeployment", 
            family: "CMT", 
            low: true, 
            moderate: true,
            description: "Implement capability to rapidly redeploy information resources from a known-good state, supporting immutable infrastructure and rollback capabilities."
        },
        "KSI-CMT-03": { 
            title: "Automated Testing and Validation", 
            family: "CMT", 
            low: true, 
            moderate: true,
            description: "Implement automated testing and validation of changes before deployment, including security testing, integration testing, and compliance checks."
        },
        "KSI-CMT-04": { 
            title: "Change Management Procedures", 
            family: "CMT", 
            low: true, 
            moderate: true,
            description: "Establish and maintain change management procedures including approval workflows, impact assessment, and rollback procedures."
        },
        
        // Cloud Native Architecture (CNA)
        "KSI-CNA-01": { 
            title: "Restrict Network Traffic", 
            family: "CNA", 
            low: true, 
            moderate: true,
            description: "Persistently ensure all machine-based information resources are configured to limit inbound and outbound network traffic to only what is required."
        },
        "KSI-CNA-02": { 
            title: "Attack Surface", 
            family: "CNA", 
            low: true, 
            moderate: true,
            description: "Minimize the attack surface of all information resources by disabling unnecessary services, ports, protocols, and removing unused software."
        },
        "KSI-CNA-03": { 
            title: "Enforce Traffic Flow", 
            family: "CNA", 
            low: true, 
            moderate: true,
            description: "Enforce authorized traffic flows between network segments and services using network segmentation, microsegmentation, and zero-trust principles."
        },
        "KSI-CNA-04": { 
            title: "Immutable Infrastructure", 
            family: "CNA", 
            low: true, 
            moderate: true,
            description: "Implement immutable infrastructure patterns where production systems are replaced rather than modified, ensuring consistent and auditable deployments."
        },
        "KSI-CNA-05": { 
            title: "Unwanted Activity", 
            family: "CNA", 
            low: true, 
            moderate: true,
            description: "Detect and prevent unwanted activity including denial of service attacks, unauthorized access attempts, and malicious traffic patterns."
        },
        "KSI-CNA-06": { 
            title: "High Availability", 
            family: "CNA", 
            low: true, 
            moderate: true,
            description: "Implement high availability architecture to ensure service continuity, including redundancy, load balancing, and failover capabilities."
        },
        "KSI-CNA-07": { 
            title: "Best Practices", 
            family: "CNA", 
            low: true, 
            moderate: true,
            description: "Follow cloud-native security best practices including secure defaults, defense in depth, and leveraging cloud provider security services."
        },
        "KSI-CNA-08": { 
            title: "Automated Enforcement", 
            family: "CNA", 
            low: false, 
            moderate: true,
            description: "Implement automated enforcement of security policies using infrastructure as code, policy as code, and automated compliance checking."
        },
        
        // Identity and Access Management (IAM)
        "KSI-IAM-01": { 
            title: "Phishing-Resistant MFA", 
            family: "IAM", 
            low: true, 
            moderate: true,
            description: "Enforce multi-factor authentication (MFA) using methods that are difficult to intercept or impersonate (phishing-resistant MFA) for all user authentication, such as FIDO2/WebAuthn."
        },
        "KSI-IAM-02": { 
            title: "Passwordless Authentication", 
            family: "IAM", 
            low: true, 
            moderate: true,
            description: "Implement passwordless authentication where feasible, reducing reliance on passwords and improving security posture against credential-based attacks."
        },
        "KSI-IAM-03": { 
            title: "Non-User Accounts", 
            family: "IAM", 
            low: true, 
            moderate: true,
            description: "Manage non-user accounts (service accounts, machine identities) with the same rigor as user accounts, including credential rotation and least privilege."
        },
        "KSI-IAM-04": { 
            title: "Just-in-Time Authorization", 
            family: "IAM", 
            low: true, 
            moderate: true,
            description: "Use a least-privileged, role and attribute-based, and just-in-time security authorization model for all user and non-user accounts and services."
        },
        "KSI-IAM-05": { 
            title: "Least Privilege", 
            family: "IAM", 
            low: true, 
            moderate: true,
            description: "Enforce least privilege access across all accounts and services, ensuring users and systems only have permissions required for their functions."
        },
        "KSI-IAM-06": { 
            title: "Suspicious Activity", 
            family: "IAM", 
            low: true, 
            moderate: true,
            description: "Monitor and respond to suspicious identity and access activity, including impossible travel, unusual access patterns, and privilege escalation attempts."
        },
        "KSI-IAM-07": { 
            title: "Automated Account Management", 
            family: "IAM", 
            low: true, 
            moderate: true,
            description: "Implement automated account provisioning, deprovisioning, and access reviews aligned with personnel actions and role changes."
        },
        
        // Incident Response (INR)
        "KSI-INR-01": { 
            title: "Incident Response Procedures", 
            family: "INR", 
            low: true, 
            moderate: true,
            description: "Establish and maintain incident response procedures including detection, analysis, containment, eradication, recovery, and post-incident activities."
        },
        "KSI-INR-02": { 
            title: "Incident Review", 
            family: "INR", 
            low: true, 
            moderate: true,
            description: "Conduct reviews of security incidents to identify root causes, lessons learned, and improvements to security controls and procedures."
        },
        "KSI-INR-03": { 
            title: "Incident After Action Reports", 
            family: "INR", 
            low: true, 
            moderate: true,
            description: "Produce after action reports for significant incidents, documenting timeline, impact, response actions, and recommendations for improvement."
        },
        
        // Monitoring, Logging, and Auditing (MLA)
        "KSI-MLA-01": { 
            title: "Security Information and Event Management (SIEM)", 
            family: "MLA", 
            low: true, 
            moderate: true,
            description: "Operate a Security Information and Event Management (SIEM) or similar system(s) for centralized, tamper-resistant logging of events, activities, and changes."
        },
        "KSI-MLA-02": { 
            title: "Audit Logging", 
            family: "MLA", 
            low: true, 
            moderate: true,
            description: "Enable comprehensive audit logging across all information resources, capturing security-relevant events with sufficient detail for forensic analysis."
        },
        "KSI-MLA-05": { 
            title: "Evaluate Configuration", 
            family: "MLA", 
            low: true, 
            moderate: true,
            description: "Persistently evaluate system configurations against security baselines and detect configuration drift or unauthorized changes."
        },
        "KSI-MLA-07": { 
            title: "Event Types", 
            family: "MLA", 
            low: true, 
            moderate: true,
            description: "Capture and analyze required event types including authentication events, authorization decisions, administrative actions, and system events."
        },
        "KSI-MLA-08": { 
            title: "Log Data Access", 
            family: "MLA", 
            low: false, 
            moderate: true,
            description: "Control and audit access to log data, ensuring log integrity and preventing unauthorized modification or deletion."
        },
        
        // Policy and Inventory (PIY)
        "KSI-PIY-01": { 
            title: "Automated Inventory", 
            family: "PIY", 
            low: true, 
            moderate: true,
            description: "Maintain an automated, continuously updated inventory of all information resources within the authorization boundary."
        },
        "KSI-PIY-03": { 
            title: "Vulnerability Disclosure Program", 
            family: "PIY", 
            low: true, 
            moderate: true,
            description: "Operate a vulnerability disclosure program allowing security researchers to responsibly report vulnerabilities in the cloud service."
        },
        "KSI-PIY-04": { 
            title: "CISA Secure By Design", 
            family: "PIY", 
            low: true, 
            moderate: true,
            description: "Implement CISA Secure by Design principles throughout the development lifecycle, building security into products from the ground up."
        },
        "KSI-PIY-06": { 
            title: "Security Investment Effectiveness", 
            family: "PIY", 
            low: true, 
            moderate: true,
            description: "Measure and report on the effectiveness of security investments, demonstrating continuous improvement in security posture."
        },
        "KSI-PIY-08": { 
            title: "Executive Support", 
            family: "PIY", 
            low: true, 
            moderate: true,
            description: "Ensure executive-level support and accountability for security, including designated security leadership and adequate resource allocation."
        },
        
        // Recovery Planning (RPL)
        "KSI-RPL-01": { 
            title: "Recovery Objectives", 
            family: "RPL", 
            low: true, 
            moderate: true,
            description: "Persistently review desired Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) ensuring alignment with business requirements."
        },
        "KSI-RPL-02": { 
            title: "Recovery Plan", 
            family: "RPL", 
            low: true, 
            moderate: true,
            description: "Maintain documented recovery plans for restoring system operations following disruption, including procedures for various failure scenarios."
        },
        "KSI-RPL-03": { 
            title: "System Backups", 
            family: "RPL", 
            low: true, 
            moderate: true,
            description: "Implement and test system backup procedures ensuring data and configuration recoverability, including offsite/cross-region storage."
        },
        "KSI-RPL-04": { 
            title: "Recovery Testing", 
            family: "RPL", 
            low: true, 
            moderate: true,
            description: "Regularly test recovery procedures to validate RTO/RPO achievement and identify improvements to recovery capabilities."
        },
        
        // Service Configuration (SVC)
        "KSI-SVC-01": { 
            title: "Continuous Improvement", 
            family: "SVC", 
            low: true, 
            moderate: true,
            description: "Implement improvements based on persistent evaluation of information resources for opportunities to improve security posture."
        },
        "KSI-SVC-02": { 
            title: "Network Encryption", 
            family: "SVC", 
            low: true, 
            moderate: true,
            description: "Encrypt all network traffic using approved cryptographic protocols (TLS 1.2+), both in transit and at the network layer where applicable."
        },
        "KSI-SVC-04": { 
            title: "Configuration Automation", 
            family: "SVC", 
            low: true, 
            moderate: true,
            description: "Automate configuration management using infrastructure as code, ensuring consistent, auditable, and repeatable deployments."
        },
        "KSI-SVC-05": { 
            title: "Resource Integrity", 
            family: "SVC", 
            low: true, 
            moderate: true,
            description: "Verify and maintain the integrity of information resources, including code signing, artifact verification, and runtime integrity monitoring."
        },
        "KSI-SVC-06": { 
            title: "Secret Management", 
            family: "SVC", 
            low: true, 
            moderate: true,
            description: "Implement secure secret management including credential vaulting, automated rotation, and preventing secrets in code or logs."
        },
        "KSI-SVC-08": { 
            title: "Prevent Residual Risk", 
            family: "SVC", 
            low: false, 
            moderate: true,
            description: "Prevent information disclosure through residual data, including secure deletion, memory sanitization, and storage encryption."
        },
        "KSI-SVC-09": { 
            title: "Communication Integrity", 
            family: "SVC", 
            low: false, 
            moderate: true,
            description: "Protect the integrity of communications including message authentication, replay protection, and tampering detection."
        },
        "KSI-SVC-10": { 
            title: "Unwanted Data Removal", 
            family: "SVC", 
            low: false, 
            moderate: true,
            description: "Implement procedures for secure removal of unwanted data, including PII sanitization, data retention enforcement, and secure disposal."
        },
        
        // Third-Party Information Resources (TPR)
        "KSI-TPR-03": { 
            title: "Supply Chain Risk Management", 
            family: "TPR", 
            low: true, 
            moderate: true,
            description: "Implement supply chain risk management processes including vendor assessment, software composition analysis, and third-party security requirements."
        },
        "KSI-TPR-04": { 
            title: "Supply Chain Risk Monitoring", 
            family: "TPR", 
            low: true, 
            moderate: true,
            description: "Continuously monitor supply chain risks including vulnerability notifications for dependencies, vendor security incidents, and emerging threats."
        }
    },
    
    // Authoritative mapping from NIST 800-53 controls to KSIs
    // Source: https://www.fedramp.gov/docs/20x/key-security-indicators/ (Jan 2026)
    nist80053ToKSI: {
        // Access Control (AC)
        "AC-1": ["KSI-AFR-01", "KSI-SVC-02"],
        "AC-2": ["KSI-IAM-01", "KSI-IAM-02", "KSI-IAM-03", "KSI-IAM-04", "KSI-IAM-06"],
        "AC-2.1": ["KSI-IAM-04", "KSI-IAM-06"],
        "AC-2.2": ["KSI-IAM-03", "KSI-IAM-04", "KSI-IAM-07"],
        "AC-2.3": ["KSI-IAM-04", "KSI-IAM-06", "KSI-IAM-07"],
        "AC-2.4": ["KSI-IAM-04", "KSI-MLA-02", "KSI-MLA-07", "KSI-SVC-04"],
        "AC-2.5": ["KSI-IAM-05"],
        "AC-2.6": ["KSI-IAM-04", "KSI-IAM-05"],
        "AC-2.13": ["KSI-IAM-06", "KSI-IAM-07"],
        "AC-3": ["KSI-AFR-03", "KSI-IAM-02", "KSI-IAM-04", "KSI-IAM-05"],
        "AC-4": ["KSI-AFR-03", "KSI-IAM-03", "KSI-IAM-04", "KSI-IAM-05"],
        "AC-5": ["KSI-IAM-04", "KSI-PIY-04", "KSI-PIY-06"],
        "AC-6": ["KSI-IAM-04", "KSI-IAM-05"],
        "AC-6.1": ["KSI-IAM-04"],
        "AC-6.2": ["KSI-IAM-04"],
        "AC-6.5": ["KSI-IAM-03", "KSI-IAM-04"],
        "AC-6.7": ["KSI-IAM-04", "KSI-IAM-07"],
        "AC-6.9": ["KSI-IAM-04", "KSI-MLA-02", "KSI-MLA-07"],
        "AC-6.10": ["KSI-IAM-04"],
        "AC-7": ["KSI-IAM-04", "KSI-IAM-06"],
        "AC-12": ["KSI-CNA-03", "KSI-IAM-05"],
        "AC-14": ["KSI-IAM-05"],
        "AC-17": ["KSI-IAM-04", "KSI-IAM-05"],
        "AC-17.1": ["KSI-IAM-05", "KSI-MLA-01", "KSI-MLA-07"],
        "AC-17.2": ["KSI-IAM-05", "KSI-SVC-02", "KSI-SVC-06"],
        "AC-17.3": ["KSI-CNA-01", "KSI-CNA-02", "KSI-CNA-03", "KSI-CNA-07", "KSI-IAM-05"],
        "AC-18": ["KSI-CNA-02"],
        "AC-18.1": ["KSI-CNA-02"],
        "AC-18.3": ["KSI-CNA-02"],
        "AC-20": ["KSI-IAM-05", "KSI-TPR-03", "KSI-TPR-04"],
        "AC-20.1": ["KSI-CNA-02", "KSI-IAM-04", "KSI-IAM-05", "KSI-MLA-01", "KSI-MLA-07"],
        "AC-21": ["KSI-AFR-01"],
        // Awareness and Training (AT)
        "AT-1": ["KSI-AFR-01"],
        "AT-2": ["KSI-CED-01", "KSI-CED-02"],
        "AT-2.2": ["KSI-CED-01"],
        "AT-2.3": ["KSI-CED-01", "KSI-CED-02"],
        "AT-3": ["KSI-CED-02"],
        "AT-3.5": ["KSI-CED-01"],
        "AT-4": ["KSI-CED-01"],
        // Audit and Accountability (AU)
        "AU-1": ["KSI-AFR-01"],
        "AU-2": ["KSI-AFR-03", "KSI-CMT-01", "KSI-MLA-01", "KSI-MLA-02", "KSI-MLA-07"],
        "AU-3": ["KSI-AFR-03", "KSI-MLA-01"],
        "AU-3.1": ["KSI-MLA-01"],
        "AU-3.3": ["KSI-PIY-04"],
        "AU-4": ["KSI-MLA-01"],
        "AU-5": ["KSI-AFR-05", "KSI-MLA-01"],
        "AU-6": ["KSI-AFR-03", "KSI-MLA-02"],
        "AU-6.1": ["KSI-MLA-01", "KSI-MLA-02"],
        "AU-6.3": ["KSI-MLA-01"],
        "AU-7": ["KSI-MLA-01"],
        "AU-7.1": ["KSI-MLA-01", "KSI-MLA-07"],
        "AU-8": ["KSI-MLA-01"],
        "AU-9": ["KSI-MLA-01"],
        "AU-9.4": ["KSI-IAM-04"],
        "AU-11": ["KSI-MLA-01"],
        "AU-12": ["KSI-MLA-07"],
        // Security Assessment (CA)
        "CA-1": ["KSI-AFR-01"],
        "CA-2": ["KSI-AFR-03", "KSI-AFR-04", "KSI-PIY-06"],
        "CA-2.1": ["KSI-CNA-08"],
        "CA-3": ["KSI-TPR-04"],
        "CA-5": ["KSI-AFR-05"],
        "CA-7": ["KSI-AFR-04", "KSI-AFR-05", "KSI-MLA-05"],
        "CA-7.1": ["KSI-CNA-08"],
        "CA-7.4": ["KSI-AFR-04", "KSI-AFR-05", "KSI-TPR-03"],
        "CA-7.6": ["KSI-AFR-04"],
        "CA-9": ["KSI-CNA-01", "KSI-CNA-02", "KSI-CNA-03"],
        // Configuration Management (CM)
        "CM-1": ["KSI-AFR-01"],
        "CM-2": ["KSI-CMT-02", "KSI-CNA-04", "KSI-CNA-07", "KSI-MLA-05", "KSI-SVC-04"],
        "CM-2.2": ["KSI-PIY-01", "KSI-SVC-04", "KSI-SVC-05"],
        "CM-2.3": ["KSI-RPL-03", "KSI-SVC-04"],
        "CM-2.7": ["KSI-IAM-05"],
        "CM-3": ["KSI-CMT-01", "KSI-CMT-02", "KSI-CMT-03", "KSI-CMT-04"],
        "CM-3.2": ["KSI-CMT-01", "KSI-CMT-03", "KSI-CMT-04"],
        "CM-3.4": ["KSI-AFR-05", "KSI-CMT-04", "KSI-PIY-04"],
        "CM-4": ["KSI-AFR-05"],
        "CM-4.2": ["KSI-CMT-01", "KSI-CMT-03"],
        "CM-5": ["KSI-CMT-02", "KSI-CMT-04", "KSI-IAM-04"],
        "CM-6": ["KSI-CMT-01", "KSI-CMT-02", "KSI-MLA-05", "KSI-SVC-04"],
        "CM-7": ["KSI-CMT-02", "KSI-IAM-04"],
        "CM-7.1": ["KSI-AFR-05", "KSI-CMT-04", "KSI-CNA-01", "KSI-SVC-01", "KSI-SVC-04"],
        "CM-7.2": ["KSI-IAM-04"],
        "CM-7.5": ["KSI-IAM-04", "KSI-PIY-01"],
        "CM-8": ["KSI-PIY-01"],
        "CM-8.1": ["KSI-CMT-02", "KSI-PIY-01"],
        "CM-8.3": ["KSI-CMT-01", "KSI-SVC-05"],
        "CM-9": ["KSI-CMT-04", "KSI-IAM-04", "KSI-IAM-05"],
        "CM-12": ["KSI-PIY-01"],
        "CM-12.1": ["KSI-PIY-01", "KSI-SVC-01"],
        // Contingency Planning (CP)
        "CP-1": ["KSI-AFR-01"],
        "CP-2": ["KSI-RPL-02"],
        "CP-2.1": ["KSI-AFR-01", "KSI-PIY-06", "KSI-RPL-02", "KSI-RPL-04"],
        "CP-2.3": ["KSI-RPL-01", "KSI-RPL-02", "KSI-RPL-04"],
        "CP-2.8": ["KSI-AFR-01", "KSI-PIY-01"],
        "CP-3": ["KSI-CED-03"],
        "CP-4": ["KSI-RPL-04"],
        "CP-4.1": ["KSI-AFR-01", "KSI-PIY-06", "KSI-RPL-02", "KSI-RPL-04"],
        "CP-6": ["KSI-RPL-02", "KSI-RPL-03", "KSI-RPL-04"],
        "CP-6.1": ["KSI-RPL-02", "KSI-RPL-04"],
        "CP-6.3": ["KSI-RPL-02"],
        "CP-7": ["KSI-RPL-02"],
        "CP-7.1": ["KSI-RPL-02"],
        "CP-7.2": ["KSI-RPL-02"],
        "CP-7.3": ["KSI-RPL-02"],
        "CP-8": ["KSI-RPL-02"],
        "CP-8.1": ["KSI-RPL-02"],
        "CP-8.2": ["KSI-RPL-02"],
        "CP-9": ["KSI-RPL-03"],
        "CP-9.1": ["KSI-RPL-04"],
        "CP-9.8": ["KSI-SVC-02"],
        "CP-10": ["KSI-RPL-01", "KSI-RPL-02", "KSI-RPL-03", "KSI-RPL-04"],
        "CP-10.2": ["KSI-RPL-02", "KSI-RPL-03"],
        // Identification and Authentication (IA)
        "IA-1": ["KSI-AFR-01"],
        "IA-2": ["KSI-IAM-01", "KSI-IAM-05"],
        "IA-2.1": ["KSI-IAM-01", "KSI-IAM-02"],
        "IA-2.2": ["KSI-IAM-01", "KSI-IAM-02"],
        "IA-2.8": ["KSI-IAM-01", "KSI-IAM-02"],
        "IA-3": ["KSI-IAM-03", "KSI-IAM-05"],
        "IA-4": ["KSI-IAM-04", "KSI-IAM-05"],
        "IA-4.4": ["KSI-IAM-04", "KSI-IAM-05", "KSI-IAM-07"],
        "IA-5": ["KSI-IAM-01"],
        "IA-5.1": ["KSI-IAM-02"],
        "IA-5.2": ["KSI-IAM-02", "KSI-IAM-03", "KSI-IAM-05", "KSI-SVC-06"],
        "IA-5.6": ["KSI-IAM-02", "KSI-IAM-05", "KSI-SVC-06"],
        "IA-6": ["KSI-IAM-02"],
        "IA-7": ["KSI-IAM-04"],
        "IA-8": ["KSI-IAM-01"],
        "IA-11": ["KSI-IAM-05"],
        "IA-12": ["KSI-IAM-07"],
        "IA-12.2": ["KSI-IAM-07"],
        "IA-12.3": ["KSI-IAM-07"],
        "IA-12.5": ["KSI-IAM-07"],
        // Incident Response (IR)
        "IR-1": ["KSI-AFR-01", "KSI-AFR-04"],
        "IR-2": ["KSI-CED-03"],
        "IR-2.3": ["KSI-CED-01"],
        "IR-3": ["KSI-INR-02", "KSI-INR-03", "KSI-RPL-04"],
        "IR-3.2": ["KSI-PIY-06", "KSI-RPL-04"],
        "IR-4": ["KSI-AFR-03", "KSI-AFR-04", "KSI-INR-01", "KSI-INR-02", "KSI-INR-03"],
        "IR-4.1": ["KSI-AFR-04", "KSI-INR-01", "KSI-INR-02", "KSI-INR-03", "KSI-MLA-01"],
        "IR-5": ["KSI-AFR-04", "KSI-INR-02"],
        "IR-5.1": ["KSI-AFR-04"],
        "IR-6": ["KSI-AFR-04", "KSI-INR-01"],
        "IR-6.1": ["KSI-AFR-04", "KSI-INR-01"],
        "IR-6.2": ["KSI-AFR-04"],
        "IR-6.3": ["KSI-INR-01", "KSI-TPR-04"],
        "IR-7": ["KSI-INR-01"],
        "IR-7.1": ["KSI-INR-01"],
        "IR-8": ["KSI-INR-01", "KSI-INR-02", "KSI-INR-03"],
        "IR-8.1": ["KSI-INR-01"],
        // Maintenance (MA)
        "MA-1": ["KSI-AFR-01"],
        "MA-2": ["KSI-CMT-01", "KSI-SVC-01"],
        // Media Protection (MP)
        "MP-1": ["KSI-AFR-01"],
        // Physical and Environmental (PE)
        "PE-1": ["KSI-AFR-01"],
        // Planning (PL)
        "PL-1": ["KSI-AFR-01"],
        "PL-2": ["KSI-AFR-01"],
        "PL-4": ["KSI-AFR-01"],
        "PL-4.1": ["KSI-AFR-01"],
        "PL-8": ["KSI-PIY-04", "KSI-SVC-01"],
        "PL-9": ["KSI-SVC-04"],
        "PL-10": ["KSI-CNA-07", "KSI-SVC-04"],
        // Program Management (PM)
        "PM-3": ["KSI-AFR-04", "KSI-PIY-06"],
        "PM-5": ["KSI-AFR-04"],
        "PM-7": ["KSI-PIY-04"],
        "PM-31": ["KSI-AFR-04"],
        // Personnel Security (PS)
        "PS-1": ["KSI-AFR-01"],
        "PS-2": ["KSI-IAM-04", "KSI-IAM-05"],
        "PS-3": ["KSI-IAM-04", "KSI-IAM-05"],
        "PS-4": ["KSI-IAM-04", "KSI-IAM-05", "KSI-IAM-06"],
        "PS-5": ["KSI-IAM-04", "KSI-IAM-05"],
        "PS-6": ["KSI-CED-03", "KSI-IAM-04", "KSI-IAM-05"],
        "PS-7": ["KSI-TPR-04"],
        "PS-8": ["KSI-IAM-06"],
        "PS-9": ["KSI-IAM-04"],
        // Risk Assessment (RA)
        "RA-1": ["KSI-AFR-01"],
        "RA-2": ["KSI-AFR-04"],
        "RA-2.1": ["KSI-AFR-04"],
        "RA-3": ["KSI-AFR-04"],
        "RA-3.1": ["KSI-TPR-03"],
        "RA-3.3": ["KSI-AFR-04"],
        "RA-5": ["KSI-AFR-03", "KSI-AFR-04", "KSI-AFR-05", "KSI-TPR-04"],
        "RA-5.2": ["KSI-AFR-04", "KSI-AFR-05"],
        "RA-5.3": ["KSI-AFR-04"],
        "RA-5.4": ["KSI-AFR-04"],
        "RA-5.5": ["KSI-AFR-04", "KSI-IAM-03", "KSI-IAM-04"],
        "RA-5.6": ["KSI-AFR-04"],
        "RA-5.7": ["KSI-AFR-04"],
        "RA-5.11": ["KSI-AFR-04", "KSI-PIY-03"],
        "RA-7": ["KSI-AFR-04"],
        "RA-9": ["KSI-AFR-01", "KSI-AFR-04"],
        "RA-10": ["KSI-AFR-04"],
        // System and Services Acquisition (SA)
        "SA-1": ["KSI-AFR-01"],
        "SA-2": ["KSI-PIY-06"],
        "SA-3": ["KSI-PIY-04", "KSI-PIY-06"],
        "SA-5": ["KSI-SVC-04"],
        "SA-8": ["KSI-PIY-04"],
        "SA-9": ["KSI-TPR-03", "KSI-TPR-04"],
        "SA-10": ["KSI-TPR-03"],
        "SA-11": ["KSI-TPR-03"],
        "SA-15.3": ["KSI-TPR-03"],
        "SA-22": ["KSI-AFR-05", "KSI-TPR-03"],
        // System and Communications (SC)
        "SC-1": ["KSI-AFR-01"],
        "SC-2": ["KSI-IAM-04"],
        "SC-4": ["KSI-CNA-03", "KSI-IAM-05", "KSI-PIY-04", "KSI-SVC-08"],
        "SC-5": ["KSI-CNA-05"],
        "SC-7": ["KSI-CNA-03", "KSI-SVC-01"],
        "SC-7.3": ["KSI-CNA-02"],
        "SC-7.4": ["KSI-CNA-02"],
        "SC-7.5": ["KSI-CNA-01", "KSI-CNA-02"],
        "SC-7.7": ["KSI-CNA-03"],
        "SC-7.8": ["KSI-CNA-02"],
        "SC-8": ["KSI-AFR-03", "KSI-CNA-02", "KSI-CNA-03", "KSI-SVC-02"],
        "SC-8.1": ["KSI-SVC-02"],
        "SC-10": ["KSI-CNA-02", "KSI-CNA-03"],
        "SC-12": ["KSI-SVC-06"],
        "SC-13": ["KSI-SVC-02", "KSI-SVC-05"],
        "SC-17": ["KSI-SVC-06"],
        "SC-18": ["KSI-PIY-04", "KSI-TPR-03"],
        "SC-20": ["KSI-IAM-05", "KSI-SVC-02"],
        "SC-21": ["KSI-IAM-05", "KSI-SVC-02"],
        "SC-22": ["KSI-IAM-05", "KSI-SVC-02"],
        "SC-23": ["KSI-IAM-01", "KSI-IAM-04", "KSI-IAM-05", "KSI-SVC-02", "KSI-SVC-05", "KSI-SVC-09"],
        "SC-39": ["KSI-IAM-04", "KSI-IAM-05", "KSI-SVC-01"],
        // System and Information Integrity (SI)
        "SI-1": ["KSI-AFR-01"],
        "SI-2": ["KSI-AFR-04", "KSI-AFR-05", "KSI-CMT-03"],
        "SI-2.1": ["KSI-AFR-04"],
        "SI-2.2": ["KSI-AFR-04", "KSI-AFR-05", "KSI-SVC-01"],
        "SI-2.4": ["KSI-AFR-04"],
        "SI-2.5": ["KSI-AFR-04"],
        "SI-3": ["KSI-AFR-04", "KSI-AFR-05", "KSI-CMT-02", "KSI-CNA-04", "KSI-IAM-05"],
        "SI-3.1": ["KSI-AFR-04"],
        "SI-3.2": ["KSI-AFR-04"],
        "SI-4": ["KSI-AFR-04", "KSI-MLA-02", "KSI-SVC-01"],
        "SI-4.2": ["KSI-AFR-04", "KSI-MLA-01"],
        "SI-4.3": ["KSI-AFR-04"],
        "SI-4.4": ["KSI-MLA-01", "KSI-MLA-02", "KSI-MLA-07"],
        "SI-4.5": ["KSI-INR-01", "KSI-MLA-07"],
        "SI-4.7": ["KSI-AFR-04"],
        "SI-5": ["KSI-AFR-05", "KSI-SVC-04", "KSI-TPR-04"],
        "SI-7": ["KSI-SVC-05"],
        "SI-7.1": ["KSI-SVC-05", "KSI-SVC-09", "KSI-TPR-03"],
        "SI-7.7": ["KSI-AFR-05", "KSI-MLA-01", "KSI-MLA-05", "KSI-MLA-07"],
        "SI-8": ["KSI-CNA-01", "KSI-CNA-05"],
        "SI-8.2": ["KSI-CNA-05"],
        "SI-10": ["KSI-AFR-05", "KSI-CNA-02", "KSI-PIY-04"],
        "SI-11": ["KSI-AFR-05", "KSI-CNA-02", "KSI-MLA-08", "KSI-PIY-04"],
        "SI-12": ["KSI-RPL-03"],
        "SI-12.3": ["KSI-SVC-10"],
        "SI-16": ["KSI-CNA-02", "KSI-PIY-04"],
        "SI-18.4": ["KSI-SVC-10"],
        // Supply Chain Risk Management (SR)
        "SR-1": ["KSI-AFR-01"],
        "SR-2": ["KSI-AFR-01"],
        "SR-2.1": ["KSI-PIY-06"],
        "SR-3": ["KSI-AFR-01"],
        "SR-5": ["KSI-TPR-03", "KSI-TPR-04"],
        "SR-6": ["KSI-TPR-03", "KSI-TPR-04"],
        "SR-8": ["KSI-TPR-04"],
        "SR-10": ["KSI-SVC-01", "KSI-SVC-04", "KSI-SVC-05"],
        "SR-11": ["KSI-AFR-01"],
        "SR-11.1": ["KSI-CED-02"]
    }
};

// Helper function to get KSIs for a NIST 800-171 control based on its 800-53 mappings
function getKSIsForControl(nist80053Controls) {
    const ksis = new Set();
    const mapping = FEDRAMP_20X_KSI.nist80053ToKSI;
    
    nist80053Controls.forEach(ctrl => {
        // Strip enhancement numbers for base control lookup
        const baseCtrl = ctrl.split('(')[0];
        
        // Check base control
        const baseMatches = mapping[baseCtrl] || [];
        baseMatches.forEach(ksi => ksis.add(ksi));
        
        // Check full control with enhancement (parenthesis format)
        const fullMatches = mapping[ctrl] || [];
        fullMatches.forEach(ksi => ksis.add(ksi));
        
        // Also check for all enhancements of this base control (dot notation format)
        // e.g., if ctrl is "CA-2", also check "CA-2.1", "CA-2.2", etc.
        Object.keys(mapping).forEach(key => {
            if (key.startsWith(baseCtrl + '.')) {
                mapping[key].forEach(ksi => ksis.add(ksi));
            }
        });
    });
    return Array.from(ksis);
}
