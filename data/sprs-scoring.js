// SPRS Scoring Data per NIST SP 800-171 DoD Assessment Methodology v1.2.1
// POA&M Eligibility per 32 CFR 170.21

const SPRS_SCORING = {
    // Point values per requirement (1, 3, or 5 based on criticality)
    pointValues: {
        // Access Control (AC)
        "3.1.1": 5,   // Limit system access
        "3.1.2": 5,   // Limit access to functions
        "3.1.3": 5,   // Control CUI flow
        "3.1.4": 1,   // Separation of duties
        "3.1.5": 5,   // Least privilege
        "3.1.6": 1,   // Non-privileged accounts for nonsecurity functions
        "3.1.7": 5,   // Prevent non-privileged users from executing privileged functions
        "3.1.8": 1,   // Limit unsuccessful logon attempts
        "3.1.9": 1,   // Privacy and security notices
        "3.1.10": 1,  // Session lock
        "3.1.11": 1,  // Session termination
        "3.1.12": 3,  // Monitor and control remote access
        "3.1.13": 3,  // Cryptographic protection for remote access
        "3.1.14": 3,  // Route remote access via managed access points
        "3.1.15": 1,  // Authorize remote execution of privileged commands
        "3.1.16": 1,  // Authorize wireless access
        "3.1.17": 3,  // Protect wireless access
        "3.1.18": 1,  // Control mobile device connection
        "3.1.19": 3,  // Encrypt CUI on mobile devices
        "3.1.20": 5,  // External connections (CANNOT be on POA&M)
        "3.1.21": 1,  // Limit portable storage on external systems
        "3.1.22": 5,  // Control public information (CANNOT be on POA&M)

        // Awareness and Training (AT)
        "3.2.1": 1,   // Security awareness
        "3.2.2": 1,   // Role-based training
        "3.2.3": 1,   // Insider threat awareness

        // Audit and Accountability (AU)
        "3.3.1": 3,   // Create and retain audit logs
        "3.3.2": 3,   // User accountability
        "3.3.3": 1,   // Review and update logged events
        "3.3.4": 1,   // Audit failure alerting
        "3.3.5": 1,   // Audit record correlation
        "3.3.6": 1,   // Audit reduction and reporting
        "3.3.7": 1,   // Authoritative time source
        "3.3.8": 3,   // Protect audit information
        "3.3.9": 1,   // Limit audit management

        // Configuration Management (CM)
        "3.4.1": 3,   // Baseline configurations
        "3.4.2": 3,   // Security configuration settings
        "3.4.3": 1,   // Track system changes
        "3.4.4": 1,   // Security impact analysis
        "3.4.5": 3,   // Access restrictions for change
        "3.4.6": 3,   // Least functionality
        "3.4.7": 3,   // Nonessential functionality
        "3.4.8": 3,   // Application execution policy
        "3.4.9": 1,   // User-installed software

        // Identification and Authentication (IA)
        "3.5.1": 3,   // Identify users, processes, devices
        "3.5.2": 3,   // Authenticate identities
        "3.5.3": 5,   // Multifactor authentication
        "3.5.4": 3,   // Replay-resistant authentication
        "3.5.5": 1,   // Identifier reuse
        "3.5.6": 1,   // Identifier disabling
        "3.5.7": 1,   // Password complexity
        "3.5.8": 1,   // Password reuse
        "3.5.9": 1,   // Temporary passwords
        "3.5.10": 3,  // Cryptographic password protection
        "3.5.11": 1,  // Obscure authentication feedback

        // Incident Response (IR)
        "3.6.1": 3,   // Incident handling capability
        "3.6.2": 3,   // Track, document, report incidents
        "3.6.3": 1,   // Test incident response

        // Maintenance (MA)
        "3.7.1": 1,   // Perform maintenance
        "3.7.2": 1,   // Maintenance controls
        "3.7.3": 1,   // Sanitize equipment for off-site maintenance
        "3.7.4": 1,   // Check maintenance media
        "3.7.5": 3,   // MFA for nonlocal maintenance
        "3.7.6": 1,   // Supervise maintenance personnel

        // Media Protection (MP)
        "3.8.1": 1,   // Protect system media
        "3.8.2": 1,   // Limit media access
        "3.8.3": 3,   // Sanitize media
        "3.8.4": 1,   // Mark media
        "3.8.5": 1,   // Control media transport
        "3.8.6": 3,   // Encrypt CUI on media during transport
        "3.8.7": 1,   // Control removable media
        "3.8.8": 1,   // Prohibit unowned portable storage
        "3.8.9": 3,   // Protect backup CUI

        // Personnel Security (PS)
        "3.9.1": 1,   // Screen individuals
        "3.9.2": 1,   // Protect during personnel actions

        // Physical Protection (PE)
        "3.10.1": 1,  // Limit physical access
        "3.10.2": 1,  // Protect and monitor facility
        "3.10.3": 1,  // Escort visitors (CANNOT be on POA&M)
        "3.10.4": 1,  // Physical access logs (CANNOT be on POA&M)
        "3.10.5": 1,  // Manage physical access (CANNOT be on POA&M)
        "3.10.6": 1,  // Alternate work site safeguards

        // Risk Assessment (RA)
        "3.11.1": 1,  // Periodic risk assessment
        "3.11.2": 3,  // Vulnerability scanning
        "3.11.3": 3,  // Vulnerability remediation

        // Security Assessment (CA)
        "3.12.1": 1,  // Assess security controls
        "3.12.2": 1,  // Plan of action
        "3.12.3": 1,  // Continuous monitoring
        "3.12.4": 5,  // System Security Plan (CANNOT be on POA&M)

        // System and Communications Protection (SC)
        "3.13.1": 5,  // Boundary protection
        "3.13.2": 3,  // Security engineering principles
        "3.13.3": 3,  // Separate user/system functionality
        "3.13.4": 3,  // Prevent unauthorized info transfer
        "3.13.5": 5,  // Public access subnetworks
        "3.13.6": 5,  // Deny by default
        "3.13.7": 3,  // Split tunneling
        "3.13.8": 5,  // CUI transmission encryption
        "3.13.9": 1,  // Network connection termination
        "3.13.10": 3, // Cryptographic key management
        "3.13.11": 3, // FIPS-validated cryptography (special POA&M exception)
        "3.13.12": 1, // Collaborative device control
        "3.13.13": 1, // Mobile code control
        "3.13.14": 1, // VoIP control
        "3.13.15": 3, // Session authenticity
        "3.13.16": 5, // CUI at rest encryption

        // System and Information Integrity (SI)
        "3.14.1": 5,  // Flaw remediation
        "3.14.2": 5,  // Malicious code protection
        "3.14.3": 3,  // Security alerts
        "3.14.4": 3,  // Update malicious code protection
        "3.14.5": 3,  // System scanning
        "3.14.6": 5,  // Monitor system traffic
        "3.14.7": 3   // Identify unauthorized use
    },

    // Requirements that CANNOT be on POA&M per 32 CFR 170.21(a)(2)(iii)
    neverPoam: [
        "3.1.20",  // AC.L2-3.1.20 External Connections
        "3.1.22",  // AC.L2-3.1.22 Control Public Information
        "3.12.4",  // CA.L2-3.12.4 System Security Plan
        "3.10.3",  // PE.L2-3.10.3 Escort Visitors
        "3.10.4",  // PE.L2-3.10.4 Physical Access Logs
        "3.10.5"   // PE.L2-3.10.5 Manage Physical Access
    ],

    // Special exception: SC.L2-3.13.11 can be on POA&M if encryption exists but is not FIPS-validated
    fipsException: "3.13.11",

    // POA&M eligibility rules per 32 CFR 170.21(a)(2)(ii)
    // Only requirements with point value <= 1 can be on POA&M (except 3.13.11 FIPS exception)
    getPoamEligibility: function(controlId) {
        const pointValue = this.pointValues[controlId];
        const isNeverPoam = this.neverPoam.includes(controlId);
        const isFipsException = controlId === this.fipsException;

        return {
            pointValue: pointValue,
            // For Conditional Level 2 status, POA&M items must have point value <= 1
            // Exception: 3.13.11 can be on POA&M even with 3 points if encryption exists but not FIPS-validated
            selfAssessment: {
                canBeOnPoam: !isNeverPoam && (pointValue <= 1 || isFipsException),
                reason: isNeverPoam 
                    ? "Cannot be on POA&M per 32 CFR 170.21(a)(2)(iii)" 
                    : (pointValue > 1 && !isFipsException)
                        ? "Point value > 1, cannot be on POA&M per 32 CFR 170.21(a)(2)(ii)"
                        : isFipsException
                            ? "Can be on POA&M if encryption employed but not FIPS-validated"
                            : "Eligible for POA&M"
            },
            c3paoAssessment: {
                canBeOnPoam: !isNeverPoam && (pointValue <= 1 || isFipsException),
                reason: isNeverPoam 
                    ? "Cannot be on POA&M per 32 CFR 170.21(a)(2)(iii)" 
                    : (pointValue > 1 && !isFipsException)
                        ? "Point value > 1, cannot be on POA&M per 32 CFR 170.21(a)(2)(ii)"
                        : isFipsException
                            ? "Can be on POA&M if encryption employed but not FIPS-validated"
                            : "Eligible for POA&M"
            }
        };
    },

    // Calculate if organization can achieve Conditional Level 2 status
    // Per 32 CFR 170.21(a)(2)(i): score / total requirements >= 0.8
    canAchieveConditionalStatus: function(implementedCount, totalRequirements = 110) {
        return (implementedCount / totalRequirements) >= 0.8;
    },

    // Get summary of all requirements by POA&M eligibility
    getSummary: function() {
        const summary = {
            neverPoam: [],
            poamEligible: [],
            requiresImplementation: []
        };

        for (const [controlId, pointValue] of Object.entries(this.pointValues)) {
            if (this.neverPoam.includes(controlId)) {
                summary.neverPoam.push({ id: controlId, points: pointValue });
            } else if (pointValue <= 1 || controlId === this.fipsException) {
                summary.poamEligible.push({ id: controlId, points: pointValue });
            } else {
                summary.requiresImplementation.push({ id: controlId, points: pointValue });
            }
        }

        return summary;
    }
};

// CMMC Level 2 Practice to NIST 800-171 mapping for reference
const CMMC_PRACTICE_IDS = {
    "3.1.1": "AC.L2-3.1.1",
    "3.1.2": "AC.L2-3.1.2",
    "3.1.3": "AC.L2-3.1.3",
    "3.1.4": "AC.L2-3.1.4",
    "3.1.5": "AC.L2-3.1.5",
    "3.1.6": "AC.L2-3.1.6",
    "3.1.7": "AC.L2-3.1.7",
    "3.1.8": "AC.L2-3.1.8",
    "3.1.9": "AC.L2-3.1.9",
    "3.1.10": "AC.L2-3.1.10",
    "3.1.11": "AC.L2-3.1.11",
    "3.1.12": "AC.L2-3.1.12",
    "3.1.13": "AC.L2-3.1.13",
    "3.1.14": "AC.L2-3.1.14",
    "3.1.15": "AC.L2-3.1.15",
    "3.1.16": "AC.L2-3.1.16",
    "3.1.17": "AC.L2-3.1.17",
    "3.1.18": "AC.L2-3.1.18",
    "3.1.19": "AC.L2-3.1.19",
    "3.1.20": "AC.L2-3.1.20",
    "3.1.21": "AC.L2-3.1.21",
    "3.1.22": "AC.L2-3.1.22",
    "3.2.1": "AT.L2-3.2.1",
    "3.2.2": "AT.L2-3.2.2",
    "3.2.3": "AT.L2-3.2.3",
    "3.3.1": "AU.L2-3.3.1",
    "3.3.2": "AU.L2-3.3.2",
    "3.3.3": "AU.L2-3.3.3",
    "3.3.4": "AU.L2-3.3.4",
    "3.3.5": "AU.L2-3.3.5",
    "3.3.6": "AU.L2-3.3.6",
    "3.3.7": "AU.L2-3.3.7",
    "3.3.8": "AU.L2-3.3.8",
    "3.3.9": "AU.L2-3.3.9",
    "3.4.1": "CM.L2-3.4.1",
    "3.4.2": "CM.L2-3.4.2",
    "3.4.3": "CM.L2-3.4.3",
    "3.4.4": "CM.L2-3.4.4",
    "3.4.5": "CM.L2-3.4.5",
    "3.4.6": "CM.L2-3.4.6",
    "3.4.7": "CM.L2-3.4.7",
    "3.4.8": "CM.L2-3.4.8",
    "3.4.9": "CM.L2-3.4.9",
    "3.5.1": "IA.L2-3.5.1",
    "3.5.2": "IA.L2-3.5.2",
    "3.5.3": "IA.L2-3.5.3",
    "3.5.4": "IA.L2-3.5.4",
    "3.5.5": "IA.L2-3.5.5",
    "3.5.6": "IA.L2-3.5.6",
    "3.5.7": "IA.L2-3.5.7",
    "3.5.8": "IA.L2-3.5.8",
    "3.5.9": "IA.L2-3.5.9",
    "3.5.10": "IA.L2-3.5.10",
    "3.5.11": "IA.L2-3.5.11",
    "3.6.1": "IR.L2-3.6.1",
    "3.6.2": "IR.L2-3.6.2",
    "3.6.3": "IR.L2-3.6.3",
    "3.7.1": "MA.L2-3.7.1",
    "3.7.2": "MA.L2-3.7.2",
    "3.7.3": "MA.L2-3.7.3",
    "3.7.4": "MA.L2-3.7.4",
    "3.7.5": "MA.L2-3.7.5",
    "3.7.6": "MA.L2-3.7.6",
    "3.8.1": "MP.L2-3.8.1",
    "3.8.2": "MP.L2-3.8.2",
    "3.8.3": "MP.L2-3.8.3",
    "3.8.4": "MP.L2-3.8.4",
    "3.8.5": "MP.L2-3.8.5",
    "3.8.6": "MP.L2-3.8.6",
    "3.8.7": "MP.L2-3.8.7",
    "3.8.8": "MP.L2-3.8.8",
    "3.8.9": "MP.L2-3.8.9",
    "3.9.1": "PS.L2-3.9.1",
    "3.9.2": "PS.L2-3.9.2",
    "3.10.1": "PE.L2-3.10.1",
    "3.10.2": "PE.L2-3.10.2",
    "3.10.3": "PE.L2-3.10.3",
    "3.10.4": "PE.L2-3.10.4",
    "3.10.5": "PE.L2-3.10.5",
    "3.10.6": "PE.L2-3.10.6",
    "3.11.1": "RA.L2-3.11.1",
    "3.11.2": "RA.L2-3.11.2",
    "3.11.3": "RA.L2-3.11.3",
    "3.12.1": "CA.L2-3.12.1",
    "3.12.2": "CA.L2-3.12.2",
    "3.12.3": "CA.L2-3.12.3",
    "3.12.4": "CA.L2-3.12.4",
    "3.13.1": "SC.L2-3.13.1",
    "3.13.2": "SC.L2-3.13.2",
    "3.13.3": "SC.L2-3.13.3",
    "3.13.4": "SC.L2-3.13.4",
    "3.13.5": "SC.L2-3.13.5",
    "3.13.6": "SC.L2-3.13.6",
    "3.13.7": "SC.L2-3.13.7",
    "3.13.8": "SC.L2-3.13.8",
    "3.13.9": "SC.L2-3.13.9",
    "3.13.10": "SC.L2-3.13.10",
    "3.13.11": "SC.L2-3.13.11",
    "3.13.12": "SC.L2-3.13.12",
    "3.13.13": "SC.L2-3.13.13",
    "3.13.14": "SC.L2-3.13.14",
    "3.13.15": "SC.L2-3.13.15",
    "3.13.16": "SC.L2-3.13.16",
    "3.14.1": "SI.L2-3.14.1",
    "3.14.2": "SI.L2-3.14.2",
    "3.14.3": "SI.L2-3.14.3",
    "3.14.4": "SI.L2-3.14.4",
    "3.14.5": "SI.L2-3.14.5",
    "3.14.6": "SI.L2-3.14.6",
    "3.14.7": "SI.L2-3.14.7"
};
