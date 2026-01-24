// ITAR (International Traffic in Arms Regulations) Guidance for CMMC Assessment
// For OSCs with ITAR data in their CMMC-scoped boundary
// Reference: 22 CFR Parts 120-130 (ITAR), DFARS 252.225-7048

const ITAR_GUIDANCE = {
    // Access Control (AC)
    "3.1.1": {
        hasITARImplications: true,
        severity: "critical",
        restrictions: [
            "Only US Persons (citizens, permanent residents, or protected individuals) may access ITAR-controlled technical data",
            "Foreign nationals, including green card holders from proscribed countries, are prohibited from access",
            "Dual/third-country nationals require State Department approval before access"
        ],
        implementation: "User provisioning must include US Person verification before granting access to ITAR systems/data. Maintain citizenship attestation records.",
        evidence: ["US Person attestation forms", "Citizenship verification records", "HR documentation of nationality status"]
    },
    "3.1.2": {
        hasITARImplications: true,
        severity: "critical",
        restrictions: [
            "Transaction functions involving ITAR data must be limited to US Persons only",
            "Role assignments must consider ITAR access requirements",
            "Contractors and subcontractors must also be US Persons for ITAR access"
        ],
        implementation: "RBAC policies must include ITAR eligibility as a role prerequisite. Document ITAR access separately from general CUI access.",
        evidence: ["RBAC matrix showing ITAR restrictions", "Access control policy with ITAR provisions"]
    },
    "3.1.3": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "ITAR data flow must be controlled to prevent unauthorized export",
            "Data cannot flow to systems accessible by non-US Persons",
            "Cloud services must be configured to prevent data residency outside US"
        ],
        implementation: "Implement DLP rules specific to ITAR data classification. Block transfers to non-US Person accounts or foreign destinations.",
        evidence: ["DLP policy for ITAR data", "Data flow diagrams showing ITAR boundaries", "Cloud residency configuration"]
    },
    "3.1.5": {
        hasITARImplications: true,
        severity: "critical",
        restrictions: [
            "Privileged access to ITAR systems requires US Person verification",
            "System administrators must be US Persons",
            "Managed service providers with admin access must employ only US Persons for ITAR systems"
        ],
        implementation: "Privileged access management must include ITAR eligibility verification. MSP contracts must include US Person requirements.",
        evidence: ["Admin personnel citizenship verification", "MSP contract ITAR clauses"]
    },
    "3.1.12": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "Remote access to ITAR systems must originate from US locations only",
            "VPN connections from foreign countries may constitute deemed export",
            "Remote workers must not access ITAR data while traveling internationally"
        ],
        implementation: "Implement geo-blocking for ITAR system access. Monitor VPN connection origins. Establish travel notification procedures.",
        evidence: ["Geo-restriction configurations", "Travel policy for ITAR personnel", "VPN location logs"]
    },
    "3.1.22": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "Publicly accessible systems must not contain any ITAR data",
            "Web applications must enforce access controls before displaying ITAR content",
            "APIs must not expose ITAR data without authentication"
        ],
        implementation: "Ensure complete separation between public-facing systems and ITAR data repositories.",
        evidence: ["Network segmentation diagrams", "Public system content reviews"]
    },

    // Awareness and Training (AT)
    "3.2.1": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "ITAR-specific training required for all personnel with ITAR access",
            "Training must cover deemed export rules and foreign national restrictions",
            "Annual ITAR refresher training recommended"
        ],
        implementation: "Include ITAR module in security awareness training. Track ITAR training completion separately.",
        evidence: ["ITAR training materials", "Training completion records", "Training acknowledgment forms"]
    },
    "3.2.2": {
        hasITARImplications: true,
        severity: "medium",
        restrictions: [
            "Personnel must understand ITAR spillage reporting requirements",
            "Training must cover penalties for ITAR violations (criminal and civil)",
            "Insider threat training should include ITAR-specific scenarios"
        ],
        implementation: "Role-based training must include ITAR handling procedures for technical staff.",
        evidence: ["Role-specific ITAR training records", "ITAR violation reporting procedures"]
    },

    // Audit and Accountability (AU)
    "3.3.1": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "All access to ITAR data must be logged with user identity",
            "Logs must capture attempted access by non-US Persons",
            "Audit logs for ITAR systems must be retained per ITAR requirements"
        ],
        implementation: "Configure enhanced logging for ITAR-designated systems. Log access attempts with citizenship status correlation.",
        evidence: ["ITAR system audit logs", "Log retention policy", "Access attempt reports"]
    },
    "3.3.2": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "User actions on ITAR data must be traceable to individual US Persons",
            "Shared accounts prohibited for ITAR system access",
            "Service accounts accessing ITAR data must be documented"
        ],
        implementation: "Ensure individual accountability for all ITAR data access. Prohibit shared credentials.",
        evidence: ["Individual account assignment records", "Service account documentation"]
    },

    // Configuration Management (CM)
    "3.4.1": {
        hasITARImplications: true,
        severity: "medium",
        restrictions: [
            "ITAR systems must be identified in asset inventory",
            "Configuration baselines for ITAR systems may require additional hardening",
            "Changes to ITAR systems require US Person approval"
        ],
        implementation: "Tag ITAR systems in CMDB. Establish separate change approval workflow for ITAR assets.",
        evidence: ["Asset inventory with ITAR designation", "ITAR system baseline configurations"]
    },
    "3.4.5": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "Access restrictions for ITAR settings must be enforced",
            "Security configuration changes require US Person authorization",
            "Foreign national IT staff cannot modify ITAR system configurations"
        ],
        implementation: "Limit configuration change authority to US Persons. Document all ITAR system configuration changes.",
        evidence: ["Configuration change logs", "Authorization records for changes"]
    },

    // Identification and Authentication (IA)
    "3.5.1": {
        hasITARImplications: true,
        severity: "critical",
        restrictions: [
            "Identity verification must include US Person status confirmation",
            "Identity proofing for ITAR access requires citizenship documentation",
            "Federated identities from foreign organizations are prohibited"
        ],
        implementation: "Include citizenship verification in identity proofing process. Do not federate with non-US identity providers for ITAR access.",
        evidence: ["Identity proofing procedures", "US Person verification records"]
    },
    "3.5.3": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "MFA required for all ITAR system access",
            "Authenticators for ITAR access should be US-sourced where possible",
            "Hardware tokens should not be manufactured by proscribed countries"
        ],
        implementation: "Implement strong MFA for ITAR systems. Review authenticator supply chain.",
        evidence: ["MFA configuration for ITAR systems", "Authenticator procurement records"]
    },

    // Incident Response (IR)
    "3.6.1": {
        hasITARImplications: true,
        severity: "critical",
        restrictions: [
            "ITAR spillage requires notification to DDTC (Directorate of Defense Trade Controls)",
            "Incident response team for ITAR incidents must be US Persons",
            "Foreign national SOC analysts cannot investigate ITAR incidents"
        ],
        implementation: "Establish ITAR-specific incident response procedures. Designate US Person incident handlers for ITAR.",
        evidence: ["ITAR incident response procedures", "DDTC notification templates", "IR team citizenship verification"]
    },
    "3.6.2": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "ITAR incidents must be tracked separately with restricted access",
            "Incident details cannot be shared with non-US Persons",
            "Third-party IR services must use only US Persons for ITAR incidents"
        ],
        implementation: "Create ITAR-specific incident tracking with access controls. Verify IR vendor personnel citizenship.",
        evidence: ["ITAR incident tickets", "IR vendor US Person attestations"]
    },

    // Maintenance (MA)
    "3.7.1": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "Maintenance personnel for ITAR systems must be US Persons",
            "Vendor maintenance requiring ITAR system access requires US Person technicians",
            "Remote maintenance by foreign nationals is prohibited"
        ],
        implementation: "Verify citizenship of all maintenance personnel. Include ITAR requirements in maintenance contracts.",
        evidence: ["Maintenance personnel verification", "Vendor contract ITAR clauses"]
    },
    "3.7.5": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "Remote maintenance sessions to ITAR systems require US Person verification",
            "Session monitoring required for remote ITAR system maintenance",
            "Foreign-based support centers cannot access ITAR systems"
        ],
        implementation: "Implement session recording for remote ITAR maintenance. Block access from foreign support locations.",
        evidence: ["Remote session logs", "Support center location verification"]
    },

    // Media Protection (MP)
    "3.8.1": {
        hasITARImplications: true,
        severity: "critical",
        restrictions: [
            "ITAR media must be marked with export control warnings",
            "Physical media containing ITAR data cannot be transported internationally without license",
            "Cloud storage of ITAR data must be US-only data centers"
        ],
        implementation: "Implement ITAR-specific media marking. Configure cloud storage for US-only residency.",
        evidence: ["Media marking procedures", "Cloud data residency configuration", "Media inventory"]
    },
    "3.8.3": {
        hasITARImplications: true,
        severity: "critical",
        restrictions: [
            "ITAR media sanitization must meet DoD standards",
            "Sanitization must be performed by US Persons",
            "Certificates of destruction required for ITAR media"
        ],
        implementation: "Use NIST SP 800-88 compliant sanitization. Maintain destruction certificates.",
        evidence: ["Sanitization procedures", "Destruction certificates", "Personnel verification"]
    },

    // Physical Protection (PE)
    "3.10.1": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "Physical access to ITAR processing areas limited to US Persons",
            "Escort required for foreign national visitors in ITAR areas",
            "ITAR areas should be separately controlled from general office space"
        ],
        implementation: "Designate ITAR-controlled areas. Implement badge access with citizenship verification.",
        evidence: ["Physical access control configuration", "ITAR area designation", "Visitor escort procedures"]
    },
    "3.10.5": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "ITAR areas must not have visibility from public areas",
            "Screen positioning to prevent shoulder surfing by visitors",
            "Conference rooms used for ITAR discussions require access controls"
        ],
        implementation: "Position displays away from visitor areas. Use privacy screens in ITAR workspaces.",
        evidence: ["Workspace layout documentation", "Privacy screen deployment"]
    },

    // Personnel Security (PS)
    "3.9.1": {
        hasITARImplications: true,
        severity: "critical",
        restrictions: [
            "Background screening must verify US Person status",
            "Foreign national employees cannot be assigned to ITAR programs",
            "Contractor personnel require US Person verification before ITAR access"
        ],
        implementation: "Include citizenship verification in hiring/onboarding. Screen contractors before ITAR assignment.",
        evidence: ["Background check procedures", "Citizenship verification forms", "Contractor screening records"]
    },
    "3.9.2": {
        hasITARImplications: true,
        severity: "critical",
        restrictions: [
            "ITAR access must be immediately revoked upon termination",
            "Exit interviews must remind personnel of continuing ITAR obligations",
            "Non-disclosure agreements must include ITAR provisions"
        ],
        implementation: "Include ITAR-specific offboarding steps. Retain signed ITAR NDAs.",
        evidence: ["Termination checklists", "ITAR NDA templates", "Access revocation logs"]
    },

    // Risk Assessment (RA)
    "3.11.1": {
        hasITARImplications: true,
        severity: "medium",
        restrictions: [
            "Risk assessments must consider ITAR-specific threats (foreign intelligence, insider threat)",
            "Deemed export risk must be evaluated",
            "Supply chain risks for ITAR data must be assessed"
        ],
        implementation: "Include ITAR threat scenarios in risk assessments. Evaluate foreign national employee risk.",
        evidence: ["Risk assessment with ITAR threats", "Threat modeling documentation"]
    },

    // Security Assessment (CA)
    "3.12.1": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "Security assessors for ITAR systems must be US Persons",
            "Penetration testers accessing ITAR data require US Person verification",
            "Assessment reports containing ITAR details must be protected"
        ],
        implementation: "Verify assessor citizenship. Protect assessment deliverables as ITAR-controlled.",
        evidence: ["Assessor verification records", "Assessment report handling procedures"]
    },
    "3.12.3": {
        hasITARImplications: true,
        severity: "medium",
        restrictions: [
            "Continuous monitoring data for ITAR systems must be protected",
            "SOC personnel monitoring ITAR systems must be US Persons",
            "Managed security services must use US-based, US Person SOC for ITAR"
        ],
        implementation: "Verify MSSP SOC personnel citizenship. Segregate ITAR monitoring from general monitoring.",
        evidence: ["MSSP contract ITAR provisions", "SOC personnel verification"]
    },

    // System and Communications Protection (SC)
    "3.13.1": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "Network boundaries must prevent ITAR data from exiting US jurisdiction",
            "Firewall rules must block ITAR traffic to foreign destinations",
            "CDN and caching services must not replicate ITAR data internationally"
        ],
        implementation: "Configure geo-blocking at network boundary. Audit CDN configurations.",
        evidence: ["Firewall geo-blocking rules", "CDN configuration", "Network flow analysis"]
    },
    "3.13.5": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "ITAR systems must be on separate network segments",
            "Network segmentation must prevent foreign national system access to ITAR segments",
            "Publicly accessible systems must not be on ITAR network segments"
        ],
        implementation: "Create dedicated ITAR VLANs/subnets. Implement strict ACLs between segments.",
        evidence: ["Network segmentation diagrams", "VLAN configurations", "ACL documentation"]
    },
    "3.13.8": {
        hasITARImplications: true,
        severity: "critical",
        restrictions: [
            "ITAR data in transit must use FIPS-validated encryption",
            "Encryption keys for ITAR data must be managed by US Persons",
            "Key escrow with foreign entities is prohibited"
        ],
        implementation: "Use FIPS 140-2/3 validated cryptographic modules. Restrict key management to US Persons.",
        evidence: ["FIPS validation certificates", "Key management procedures", "Key custodian verification"]
    },
    "3.13.11": {
        hasITARImplications: true,
        severity: "critical",
        restrictions: [
            "FIPS-validated cryptography required for all ITAR data protection",
            "Cryptographic modules must not be sourced from proscribed countries",
            "Algorithm selection must comply with NIST recommendations"
        ],
        implementation: "Verify FIPS validation of all cryptographic implementations protecting ITAR data.",
        evidence: ["FIPS 140-2/3 certificates", "Cryptographic module inventory"]
    },
    "3.13.16": {
        hasITARImplications: true,
        severity: "critical",
        restrictions: [
            "ITAR data at rest must be encrypted",
            "Encryption keys must be stored in US-based HSMs/KMS",
            "Cloud provider encryption must use customer-managed keys for ITAR"
        ],
        implementation: "Enable encryption at rest with customer-managed keys. Verify key storage location.",
        evidence: ["Encryption configuration", "KMS/HSM location verification", "Key management documentation"]
    },

    // System and Information Integrity (SI)
    "3.14.1": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "Vulnerability scanning of ITAR systems must be performed by US Persons",
            "Vulnerability scan results for ITAR systems must be protected",
            "Third-party scanners must not transmit ITAR system data internationally"
        ],
        implementation: "Use US-based scanning solutions. Protect scan results as sensitive.",
        evidence: ["Scanner configuration", "Scan result handling procedures"]
    },
    "3.14.6": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "Security monitoring of ITAR systems must be by US Persons",
            "SIEM/SOAR platforms must store ITAR-related logs in US data centers",
            "Threat intelligence sharing must not include ITAR technical details"
        ],
        implementation: "Verify SIEM data residency. Restrict ITAR alert visibility to US Person analysts.",
        evidence: ["SIEM data residency configuration", "Analyst access controls"]
    },
    "3.14.7": {
        hasITARImplications: true,
        severity: "high",
        restrictions: [
            "Unauthorized access attempts to ITAR data must trigger immediate response",
            "Foreign national access attempts must be treated as potential export violations",
            "Correlation rules should detect ITAR boundary violations"
        ],
        implementation: "Create ITAR-specific detection rules. Alert on foreign national access attempts.",
        evidence: ["SIEM correlation rules", "Alert configuration", "Response procedures"]
    }
};

// Helper function to get ITAR guidance for a control
function getITARGuidance(controlId) {
    // Strip objective suffix to get control ID (e.g., "3.1.1[a]" -> "3.1.1")
    const baseControlId = controlId.replace(/\[.*\]$/, '');
    return ITAR_GUIDANCE[baseControlId] || null;
}

// Severity levels for display
const ITAR_SEVERITY_LABELS = {
    critical: "Critical - US Persons Only",
    high: "High - Significant Restrictions",
    medium: "Medium - ITAR Considerations"
};
