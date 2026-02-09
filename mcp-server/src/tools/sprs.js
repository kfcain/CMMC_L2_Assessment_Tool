/**
 * SPRS Scoring Reference Tool
 * Provides the official DoD SPRS point values per control and scoring logic
 */

// Official SPRS point values per NIST 800-171 Rev 2 control
// Source: DoD Assessment Methodology v1.2.1
const SPRS_VALUES = {
  '3.1.1': 5, '3.1.2': 5, '3.1.3': 1, '3.1.4': 1, '3.1.5': 1,
  '3.1.6': 1, '3.1.7': 1, '3.1.8': 1, '3.1.9': 1, '3.1.10': 1,
  '3.1.11': 1, '3.1.12': 3, '3.1.13': 3, '3.1.14': 1, '3.1.15': 3,
  '3.1.16': 1, '3.1.17': 3, '3.1.18': 1, '3.1.19': 3, '3.1.20': 5,
  '3.1.21': 1, '3.1.22': 1,
  '3.2.1': 1, '3.2.2': 1, '3.2.3': 1,
  '3.3.1': 5, '3.3.2': 5, '3.3.3': 1, '3.3.4': 1, '3.3.5': 1,
  '3.3.6': 1, '3.3.7': 1, '3.3.8': 3, '3.3.9': 1,
  '3.4.1': 5, '3.4.2': 5, '3.4.3': 3, '3.4.4': 1, '3.4.5': 3,
  '3.4.6': 5, '3.4.7': 3, '3.4.8': 3, '3.4.9': 3,
  '3.5.1': 5, '3.5.2': 5, '3.5.3': 5, '3.5.4': 1, '3.5.5': 1,
  '3.5.6': 1, '3.5.7': 5, '3.5.8': 1, '3.5.9': 1, '3.5.10': 3,
  '3.5.11': 1,
  '3.6.1': 5, '3.6.2': 5, '3.6.3': 1,
  '3.7.1': 1, '3.7.2': 1, '3.7.3': 1, '3.7.4': 1, '3.7.5': 3, '3.7.6': 1,
  '3.8.1': 3, '3.8.2': 1, '3.8.3': 3, '3.8.4': 1, '3.8.5': 3,
  '3.8.6': 3, '3.8.7': 1, '3.8.8': 1, '3.8.9': 1,
  '3.9.1': 1, '3.9.2': 1,
  '3.10.1': 1, '3.10.2': 1, '3.10.3': 1, '3.10.4': 1, '3.10.5': 1, '3.10.6': 1,
  '3.11.1': 5, '3.11.2': 5, '3.11.3': 5,
  '3.12.1': 3, '3.12.2': 1, '3.12.3': 3, '3.12.4': 3,
  '3.13.1': 5, '3.13.2': 5, '3.13.3': 1, '3.13.4': 1, '3.13.5': 3,
  '3.13.6': 1, '3.13.7': 1, '3.13.8': 5, '3.13.9': 1, '3.13.10': 1,
  '3.13.11': 5, '3.13.12': 1, '3.13.13': 1, '3.13.14': 1, '3.13.15': 3,
  '3.13.16': 5,
  '3.14.1': 5, '3.14.2': 5, '3.14.3': 5, '3.14.4': 5, '3.14.5': 1,
  '3.14.6': 5, '3.14.7': 5
};

// Controls that can NEVER be on a POA&M per 32 CFR 170.21
const NEVER_POAM = [
  '3.5.3',  // MFA for privileged accounts
  '3.5.4',  // Replay-resistant authentication
  '3.13.11', // FIPS-validated cryptography
  '3.13.8',  // Cryptographic mechanisms for CUI in transit
  '3.13.16'  // Confidentiality of CUI at rest
];

// High-value controls (5-point) that are critical for CMMC
const HIGH_VALUE_CONTROLS = Object.entries(SPRS_VALUES)
  .filter(([, v]) => v === 5)
  .map(([k]) => k);

export function registerSPRSTools(server, data) {

  server.tool(
    'get_sprs_score_info',
    'Get SPRS scoring reference: point values per control, scoring methodology, and POA&M eligibility rules per 32 CFR 170.21.',
    {
      controlId: { type: 'string', description: 'Optional: specific control ID to get its SPRS value (e.g. "3.5.3"). Omit for full scoring overview.' }
    },
    async ({ controlId }) => {
      if (controlId) {
        const value = SPRS_VALUES[controlId];
        if (value === undefined) {
          return { content: [{ type: 'text', text: `Control ${controlId} not found in SPRS scoring table.` }] };
        }
        const neverPoam = NEVER_POAM.includes(controlId);
        const ctrl = data.rev2Index[controlId];
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              controlId,
              controlName: ctrl?.controlName || 'Unknown',
              family: ctrl ? `${ctrl.familyId} — ${ctrl.familyName}` : 'Unknown',
              sprsPointValue: value,
              isHighValue: value === 5,
              neverPOAM: neverPoam,
              poamEligibility: neverPoam
                ? 'NEVER eligible for POA&M — must be fully implemented for CMMC certification'
                : value === 5
                  ? 'POA&M eligible but high-value — significant SPRS impact if not met'
                  : 'POA&M eligible',
              scoringNote: `If NOT MET, subtract ${value} point(s) from the maximum score of 110.`
            }, null, 2)
          }]
        };
      }

      // Full overview
      const totalPoints = Object.values(SPRS_VALUES).reduce((a, b) => a + b, 0);
      const byValue = {};
      for (const [id, val] of Object.entries(SPRS_VALUES)) {
        if (!byValue[val]) byValue[val] = [];
        byValue[val].push(id);
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            methodology: {
              maxScore: 110,
              minScore: -203,
              totalControls: Object.keys(SPRS_VALUES).length,
              totalPointsAtRisk: totalPoints,
              formula: 'SPRS = 110 - (sum of point values for all NOT MET controls)',
              passingNote: 'CMMC Level 2 requires a score of 110 (all controls met) or an approved POA&M with a score above the contracting threshold.'
            },
            pointDistribution: {
              '5-point controls (critical)': byValue[5]?.length || 0,
              '3-point controls (significant)': byValue[3]?.length || 0,
              '1-point controls (standard)': byValue[1]?.length || 0
            },
            neverPOAM: {
              description: 'Per 32 CFR 170.21, these controls can NEVER be placed on a POA&M for CMMC certification',
              controls: NEVER_POAM.map(id => ({
                id,
                name: data.rev2Index[id]?.controlName || 'Unknown',
                points: SPRS_VALUES[id]
              }))
            },
            highValueControls: HIGH_VALUE_CONTROLS.map(id => ({
              id,
              name: data.rev2Index[id]?.controlName || 'Unknown',
              points: 5
            }))
          }, null, 2)
        }]
      };
    }
  );

  server.tool(
    'calculate_sprs_impact',
    'Calculate the SPRS score impact for a set of NOT MET controls. Useful for understanding the scoring impact of gaps.',
    {
      notMetControls: { type: 'string', description: 'Comma-separated list of NOT MET control IDs (e.g. "3.5.3,3.13.11,3.1.1")' }
    },
    async ({ notMetControls }) => {
      const ids = notMetControls.split(',').map(s => s.trim()).filter(Boolean);
      let totalDeduction = 0;
      const breakdown = [];
      const poamIssues = [];

      for (const id of ids) {
        const value = SPRS_VALUES[id];
        if (value === undefined) {
          breakdown.push({ controlId: id, error: 'Not found in SPRS table' });
          continue;
        }
        totalDeduction += value;
        const entry = {
          controlId: id,
          name: data.rev2Index[id]?.controlName || 'Unknown',
          pointsDeducted: value
        };
        if (NEVER_POAM.includes(id)) {
          entry.warning = 'NEVER eligible for POA&M — blocks CMMC certification';
          poamIssues.push(id);
        }
        breakdown.push(entry);
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            inputControls: ids.length,
            sprsScore: 110 - totalDeduction,
            totalDeduction,
            breakdown,
            ...(poamIssues.length > 0 ? {
              criticalWarning: `${poamIssues.length} control(s) are NEVER POA&M eligible and MUST be remediated before CMMC certification: ${poamIssues.join(', ')}`
            } : {}),
            assessment: totalDeduction === 0
              ? 'Perfect score — all controls met'
              : totalDeduction <= 10
                ? 'Minor gaps — strong compliance posture'
                : totalDeduction <= 30
                  ? 'Moderate gaps — remediation plan recommended'
                  : totalDeduction <= 60
                    ? 'Significant gaps — formal POA&M required'
                    : 'Critical gaps — major remediation effort needed'
          }, null, 2)
        }]
      };
    }
  );
}
