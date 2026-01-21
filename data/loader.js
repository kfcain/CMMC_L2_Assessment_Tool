// NIST 800-171A Data Loader - Combines all control families
// Total: 14 families, 110 controls, 321 assessment objectives
// Includes SPRS scoring and POA&M eligibility per 32 CFR 170.21

const CONTROL_FAMILIES = [
    ...FAMILIES_AC_AT_AU,
    ...FAMILIES_CM_IA,
    ...FAMILIES_IR_MA_MP_PS_PE,
    ...FAMILIES_RA_CA_SC_SI
];

// Enrich controls with SPRS scoring and POA&M eligibility data
(function() {
    let totalObjectives = 0;
    let totalControls = 0;
    let poamEligibleCount = 0;
    let neverPoamCount = 0;

    CONTROL_FAMILIES.forEach(family => {
        family.controls.forEach(control => {
            totalControls++;
            totalObjectives += control.objectives.length;

            // Add SPRS scoring data to each control
            const eligibility = SPRS_SCORING.getPoamEligibility(control.id);
            control.pointValue = eligibility.pointValue;
            control.cmmcPracticeId = CMMC_PRACTICE_IDS[control.id];
            control.poamEligibility = {
                selfAssessment: eligibility.selfAssessment,
                c3paoAssessment: eligibility.c3paoAssessment
            };

            // Track POA&M eligibility stats
            if (SPRS_SCORING.neverPoam.includes(control.id)) {
                neverPoamCount++;
            } else if (eligibility.pointValue <= 1 || control.id === SPRS_SCORING.fipsException) {
                poamEligibleCount++;
            }
        });
    });

    console.log(`NIST 800-171A Loaded: ${CONTROL_FAMILIES.length} families, ${totalControls} controls, ${totalObjectives} objectives`);
    console.log(`POA&M Eligibility: ${poamEligibleCount} eligible, ${neverPoamCount} never allowed, ${totalControls - poamEligibleCount - neverPoamCount} require full implementation`);
})();
