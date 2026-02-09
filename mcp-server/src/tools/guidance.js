/**
 * Implementation guidance tools — platform-specific guidance for controls
 */

export function registerGuidanceTools(server, data) {

  server.tool(
    'get_implementation_guidance',
    'Get platform-specific implementation guidance for a NIST 800-171 control. Covers AWS GovCloud, Azure GCC High, GCP, Palo Alto, SentinelOne, NinjaOne, Tenable, and more.',
    {
      controlId: { type: 'string', description: 'Control ID (e.g. "3.1.1", "AC.L2-3.1.1")' },
      technology: { type: 'string', description: 'Optional: filter by technology (e.g. "aws", "azure", "gcp", "paloalto", "sentinelone"). Omit to get all available.', default: '' }
    },
    async ({ controlId, technology = '' }) => {
      // Try multiple key formats
      const keys = [
        controlId,
        `AC.L2-${controlId}`,
        `AT.L2-${controlId}`,
        `AU.L2-${controlId}`,
        `CM.L2-${controlId}`,
        `IA.L2-${controlId}`,
        `IR.L2-${controlId}`,
        `MA.L2-${controlId}`,
        `MP.L2-${controlId}`,
        `PS.L2-${controlId}`,
        `PE.L2-${controlId}`,
        `RA.L2-${controlId}`,
        `CA.L2-${controlId}`,
        `SC.L2-${controlId}`,
        `SI.L2-${controlId}`
      ];

      let guidanceData = null;
      let matchedKey = null;
      for (const key of keys) {
        if (data.guidance[key]) {
          guidanceData = data.guidance[key];
          matchedKey = key;
          break;
        }
      }

      if (!guidanceData) {
        return {
          content: [{
            type: 'text',
            text: `No implementation guidance found for ${controlId}. Available guidance covers ${Object.keys(data.guidance).length} controls. Try a different control ID format.`
          }]
        };
      }

      // Filter by technology if specified
      let sections = guidanceData;
      if (technology && typeof guidanceData === 'object') {
        const tech = technology.toLowerCase();
        if (Array.isArray(guidanceData)) {
          sections = guidanceData.filter(s =>
            (s.technology || '').toLowerCase().includes(tech) ||
            (s.platform || '').toLowerCase().includes(tech) ||
            (s.title || '').toLowerCase().includes(tech)
          );
        } else if (guidanceData.technologies) {
          sections = guidanceData.technologies.filter(t =>
            (t.id || '').toLowerCase().includes(tech) ||
            (t.name || '').toLowerCase().includes(tech)
          );
        }
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            controlId: matchedKey,
            ...(technology ? { filteredBy: technology } : {}),
            guidance: sections
          }, null, 2)
        }]
      };
    }
  );

  server.tool(
    'get_evidence_requirements',
    'Get the evidence artifacts needed to demonstrate compliance for a specific control during a CMMC assessment.',
    {
      controlId: { type: 'string', description: 'Control ID (e.g. "3.1.1")' }
    },
    async ({ controlId }) => {
      // Build evidence requirements from control objectives and guidance
      const rev2Ctrl = data.rev2Index[controlId];
      const rev3Ctrl = data.rev3Index[controlId];
      const ctrl = rev2Ctrl || rev3Ctrl;

      if (!ctrl) {
        return { content: [{ type: 'text', text: `Control ${controlId} not found.` }] };
      }

      // Standard evidence categories per family
      const evidenceMap = {
        'AC': ['Access control policies', 'User account listings', 'Access authorization records', 'System access logs', 'Network diagrams showing access points'],
        'AT': ['Training records', 'Training materials', 'Attendance logs', 'Role-based training curriculum'],
        'AU': ['Audit log samples', 'Audit policy configuration', 'Log retention settings', 'SIEM dashboard screenshots', 'Alert configuration'],
        'CM': ['Baseline configuration documents', 'Change management records', 'Software inventory', 'Configuration settings screenshots', 'Allowlist/denylist policies'],
        'IA': ['Authentication policy settings', 'MFA configuration evidence', 'Password policy screenshots', 'Certificate management records'],
        'IR': ['Incident response plan', 'IR test/exercise results', 'Incident tracking records', 'IR training records'],
        'MA': ['Maintenance records', 'Maintenance tool inventory', 'Remote maintenance logs', 'Maintenance personnel authorization'],
        'MP': ['Media protection policy', 'Media sanitization records', 'Encryption configuration for portable media', 'Media transport logs'],
        'PS': ['Personnel screening records', 'Access termination procedures', 'Transfer/reassignment procedures'],
        'PE': ['Physical access logs', 'Visitor records', 'Physical security assessment', 'Access control device inventory'],
        'RA': ['Risk assessment report', 'Vulnerability scan results', 'Remediation tracking', 'Threat intelligence sources'],
        'CA': ['Security assessment plan', 'Assessment results', 'POA&M', 'Continuous monitoring strategy'],
        'SC': ['Network architecture diagrams', 'Encryption configuration', 'Boundary protection device configs', 'TLS/certificate settings'],
        'SI': ['Patch management records', 'Antivirus/EDR configuration', 'Vulnerability remediation timelines', 'System monitoring alerts']
      };

      const familyEvidence = evidenceMap[ctrl.familyId] || ['Policy documents', 'Configuration screenshots', 'Process documentation'];

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            controlId: ctrl.controlId,
            controlName: ctrl.controlName,
            family: `${ctrl.familyId} — ${ctrl.familyName}`,
            objectiveCount: ctrl.objectives.length,
            evidenceCategories: familyEvidence,
            perObjective: ctrl.objectives.map(obj => ({
              id: obj.id,
              text: obj.text,
              suggestedEvidence: `Documentation or screenshot demonstrating: ${obj.text}`
            }))
          }, null, 2)
        }]
      };
    }
  );
}
