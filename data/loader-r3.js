// NIST SP 800-171A Rev 3 Data Loader - Combines all Rev 3 control families
// Total: 17 families, 97 controls, 422 assessment objectives
// Based on NIST SP 800-171A Revision 3 (November 2024) — Official assessment objectives
// Includes SPRS scoring and POA&M eligibility mapping for Rev 3

const CONTROL_FAMILIES_R3 = [
    ...FAMILIES_R3_AC_AT_AU,
    ...FAMILIES_R3_CM_IA,
    ...FAMILIES_R3_IR_MA_MP_PS_PE,
    ...FAMILIES_R3_RA_CA_SC_SI,
    ...FAMILIES_R3_SR_PL
];

// Rev 3 SPRS Scoring Data
// Maps Rev 3 control IDs to SPRS point values
// Only includes controls that exist in the official NIST 800-171r3
// Withdrawn controls removed; new controls scored per DoD guidance
const SPRS_SCORING_R3 = {
    pointValues: {
        // AC family (16 controls — 03.01.13-15, 03.01.17, 03.01.19, 03.01.21 withdrawn)
        "03.01.01": 5, "03.01.02": 5, "03.01.03": 5, "03.01.04": 1, "03.01.05": 5,
        "03.01.06": 1, "03.01.07": 5, "03.01.08": 5, "03.01.09": 1, "03.01.10": 5,
        "03.01.11": 1, "03.01.12": 5, "03.01.16": 1, "03.01.18": 5, "03.01.20": 5,
        "03.01.22": 5,
        // AT family (2 controls — 03.02.03 withdrawn)
        "03.02.01": 3, "03.02.02": 3,
        // AU family (8 controls — 03.03.09 withdrawn)
        "03.03.01": 5, "03.03.02": 5, "03.03.03": 3, "03.03.04": 3,
        "03.03.05": 3, "03.03.06": 3, "03.03.07": 1, "03.03.08": 5,
        // CM family (10 controls — 03.04.07, 03.04.09 withdrawn; 03.04.12 new)
        "03.04.01": 5, "03.04.02": 5, "03.04.03": 3, "03.04.04": 3, "03.04.05": 3,
        "03.04.06": 3, "03.04.08": 5, "03.04.10": 3, "03.04.11": 3, "03.04.12": 3,
        // IA family (8 controls — 03.05.06, 03.05.08-10 withdrawn; 03.05.12 new)
        "03.05.01": 5, "03.05.02": 5, "03.05.03": 5, "03.05.04": 5,
        "03.05.05": 1, "03.05.07": 5, "03.05.11": 1, "03.05.12": 5,
        // IR family (5 controls — 03.06.04, 03.06.05 new)
        "03.06.01": 5, "03.06.02": 5, "03.06.03": 3, "03.06.04": 3, "03.06.05": 3,
        // MA family (3 controls — 03.07.01-03 withdrawn)
        "03.07.04": 3, "03.07.05": 5, "03.07.06": 1,
        // MP family (7 controls — 03.08.06, 03.08.08 withdrawn)
        "03.08.01": 3, "03.08.02": 1, "03.08.03": 5, "03.08.04": 1,
        "03.08.05": 3, "03.08.07": 1, "03.08.09": 3,
        // PS family (2 controls)
        "03.09.01": 5, "03.09.02": 5,
        // PE family (5 controls — 03.10.03-05 withdrawn; 03.10.07, 03.10.08 new)
        "03.10.01": 5, "03.10.02": 5, "03.10.06": 1, "03.10.07": 5, "03.10.08": 1,
        // RA family (3 controls — 03.11.03 withdrawn; 03.11.04 Risk Response new)
        "03.11.01": 5, "03.11.02": 5, "03.11.04": 3,
        // CA family (4 controls — 03.12.04 withdrawn; 03.12.05 new)
        "03.12.01": 5, "03.12.02": 5, "03.12.03": 5, "03.12.05": 3,
        // SC family (10 controls — 03.13.02-03, 03.13.05, 03.13.07, 03.13.14, 03.13.16 withdrawn)
        "03.13.01": 5, "03.13.04": 1, "03.13.06": 5, "03.13.08": 5,
        "03.13.09": 1, "03.13.10": 5, "03.13.11": 5, "03.13.12": 1,
        "03.13.13": 1, "03.13.15": 5,
        // SI family (5 controls — 03.14.04-05, 03.14.07 withdrawn; 03.14.08 new)
        "03.14.01": 5, "03.14.02": 5, "03.14.03": 3, "03.14.06": 5, "03.14.08": 3,
        // PL family (new — 03.15)
        "03.15.01": 3, "03.15.02": 5, "03.15.03": 3,
        // SA family (new — 03.16)
        "03.16.01": 3, "03.16.02": 3, "03.16.03": 3,
        // SR family (new — 03.17)
        "03.17.01": 3, "03.17.02": 3, "03.17.03": 3
    },

    // Controls that can NEVER be on a POA&M (must be fully implemented)
    neverPoam: [
        "03.05.03",  // Multi-factor authentication
        "03.13.11",  // Cryptographic protection (FIPS-validated)
        "03.13.08",  // Transmission and storage confidentiality
        "03.13.01"   // Boundary protection
    ],

    getPointValue: function(controlId) {
        return this.pointValues[controlId] || 3;
    },

    getPoamEligibility: function(controlId) {
        const pointValue = this.getPointValue(controlId);
        const isNeverPoam = this.neverPoam.includes(controlId);
        return {
            pointValue: pointValue,
            selfAssessment: isNeverPoam ? "NOT_ALLOWED" : (pointValue <= 3 ? "CONDITIONAL" : "CONDITIONAL"),
            c3paoAssessment: isNeverPoam ? "NOT_ALLOWED" : "CONDITIONAL"
        };
    }
};

// Rev 3 to CMMC Practice ID mapping
// Only includes controls that exist in the official NIST 800-171r3
const CMMC_PRACTICE_IDS_R3 = {
    // AC family
    "03.01.01": "AC.L2-03.01.01", "03.01.02": "AC.L2-03.01.02", "03.01.03": "AC.L2-03.01.03",
    "03.01.04": "AC.L2-03.01.04", "03.01.05": "AC.L2-03.01.05", "03.01.06": "AC.L2-03.01.06",
    "03.01.07": "AC.L2-03.01.07", "03.01.08": "AC.L2-03.01.08", "03.01.09": "AC.L2-03.01.09",
    "03.01.10": "AC.L2-03.01.10", "03.01.11": "AC.L2-03.01.11", "03.01.12": "AC.L2-03.01.12",
    "03.01.16": "AC.L2-03.01.16", "03.01.18": "AC.L2-03.01.18",
    "03.01.20": "AC.L2-03.01.20", "03.01.22": "AC.L2-03.01.22",
    // AT family
    "03.02.01": "AT.L2-03.02.01", "03.02.02": "AT.L2-03.02.02",
    // AU family
    "03.03.01": "AU.L2-03.03.01", "03.03.02": "AU.L2-03.03.02", "03.03.03": "AU.L2-03.03.03",
    "03.03.04": "AU.L2-03.03.04", "03.03.05": "AU.L2-03.03.05", "03.03.06": "AU.L2-03.03.06",
    "03.03.07": "AU.L2-03.03.07", "03.03.08": "AU.L2-03.03.08",
    // CM family
    "03.04.01": "CM.L2-03.04.01", "03.04.02": "CM.L2-03.04.02", "03.04.03": "CM.L2-03.04.03",
    "03.04.04": "CM.L2-03.04.04", "03.04.05": "CM.L2-03.04.05", "03.04.06": "CM.L2-03.04.06",
    "03.04.08": "CM.L2-03.04.08", "03.04.10": "CM.L2-03.04.10", "03.04.11": "CM.L2-03.04.11",
    "03.04.12": "CM.L2-03.04.12",
    // IA family
    "03.05.01": "IA.L2-03.05.01", "03.05.02": "IA.L2-03.05.02", "03.05.03": "IA.L2-03.05.03",
    "03.05.04": "IA.L2-03.05.04", "03.05.05": "IA.L2-03.05.05",
    "03.05.07": "IA.L2-03.05.07", "03.05.11": "IA.L2-03.05.11", "03.05.12": "IA.L2-03.05.12",
    // IR family
    "03.06.01": "IR.L2-03.06.01", "03.06.02": "IR.L2-03.06.02", "03.06.03": "IR.L2-03.06.03",
    "03.06.04": "IR.L2-03.06.04", "03.06.05": "IR.L2-03.06.05",
    // MA family
    "03.07.04": "MA.L2-03.07.04", "03.07.05": "MA.L2-03.07.05", "03.07.06": "MA.L2-03.07.06",
    // MP family
    "03.08.01": "MP.L2-03.08.01", "03.08.02": "MP.L2-03.08.02", "03.08.03": "MP.L2-03.08.03",
    "03.08.04": "MP.L2-03.08.04", "03.08.05": "MP.L2-03.08.05",
    "03.08.07": "MP.L2-03.08.07", "03.08.09": "MP.L2-03.08.09",
    // PS family
    "03.09.01": "PS.L2-03.09.01", "03.09.02": "PS.L2-03.09.02",
    // PE family
    "03.10.01": "PE.L2-03.10.01", "03.10.02": "PE.L2-03.10.02",
    "03.10.06": "PE.L2-03.10.06", "03.10.07": "PE.L2-03.10.07", "03.10.08": "PE.L2-03.10.08",
    // RA family
    "03.11.01": "RA.L2-03.11.01", "03.11.02": "RA.L2-03.11.02", "03.11.04": "RA.L2-03.11.04",
    // CA family
    "03.12.01": "CA.L2-03.12.01", "03.12.02": "CA.L2-03.12.02", "03.12.03": "CA.L2-03.12.03",
    "03.12.05": "CA.L2-03.12.05",
    // SC family
    "03.13.01": "SC.L2-03.13.01", "03.13.04": "SC.L2-03.13.04", "03.13.06": "SC.L2-03.13.06",
    "03.13.08": "SC.L2-03.13.08", "03.13.09": "SC.L2-03.13.09", "03.13.10": "SC.L2-03.13.10",
    "03.13.11": "SC.L2-03.13.11", "03.13.12": "SC.L2-03.13.12", "03.13.13": "SC.L2-03.13.13",
    "03.13.15": "SC.L2-03.13.15",
    // SI family
    "03.14.01": "SI.L2-03.14.01", "03.14.02": "SI.L2-03.14.02", "03.14.03": "SI.L2-03.14.03",
    "03.14.06": "SI.L2-03.14.06", "03.14.08": "SI.L2-03.14.08",
    // PL family (new — 03.15)
    "03.15.01": "PL.L2-03.15.01", "03.15.02": "PL.L2-03.15.02", "03.15.03": "PL.L2-03.15.03",
    // SA family (new — 03.16)
    "03.16.01": "SA.L2-03.16.01", "03.16.02": "SA.L2-03.16.02", "03.16.03": "SA.L2-03.16.03",
    // SR family (new — 03.17)
    "03.17.01": "SR.L2-03.17.01", "03.17.02": "SR.L2-03.17.02", "03.17.03": "SR.L2-03.17.03"
};

// Build reverse mapping: Rev 3 ID → Rev 2 ID
const REV3_TO_REV2_MAP = {};
if (typeof REV2_TO_REV3_MIGRATION !== 'undefined') {
    Object.keys(REV2_TO_REV3_MIGRATION).forEach(rev2Id => {
        const mapping = REV2_TO_REV3_MIGRATION[rev2Id];
        REV3_TO_REV2_MAP[mapping.rev3Id] = rev2Id;
    });
}

// Enrich Rev 3 controls with scoring and metadata
(function() {
    let totalObjectives = 0;
    let totalControls = 0;
    let newControls = 0;
    let enhancedControls = 0;

    CONTROL_FAMILIES_R3.forEach(family => {
        family.controls.forEach(control => {
            totalControls++;
            totalObjectives += control.objectives.length;

            // Add SPRS scoring data
            const eligibility = SPRS_SCORING_R3.getPoamEligibility(control.id);
            control.pointValue = eligibility.pointValue;
            control.cmmcPracticeId = CMMC_PRACTICE_IDS_R3[control.id];
            control.poamEligibility = {
                selfAssessment: eligibility.selfAssessment,
                c3paoAssessment: eligibility.c3paoAssessment
            };

            // Track change types
            if (control.changeType === 'new') newControls++;
            if (control.changeType === 'enhanced') enhancedControls++;
        });
    });

    console.log(`NIST 800-171A Rev 3 Loaded: ${CONTROL_FAMILIES_R3.length} families, ${totalControls} controls, ${totalObjectives} objectives`);
    console.log(`Rev 3 Changes: ${newControls} new controls, ${enhancedControls} enhanced controls, ${totalControls - newControls - enhancedControls} renumbered`);
})();
