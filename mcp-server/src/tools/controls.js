/**
 * Control lookup and search tools
 */

export function registerControlTools(server, data) {
  
  server.tool(
    'get_control_info',
    'Get detailed information about a NIST 800-171 control including objectives, family, and description. Supports both Rev 2 (e.g. "3.1.1") and Rev 3 (e.g. "03.01.01") control IDs.',
    {
      controlId: { type: 'string', description: 'Control ID (e.g. "3.1.1" for Rev 2 or "03.01.01" for Rev 3)' },
      revision: { type: 'string', description: 'Revision: "r2" or "r3". Defaults to "r2".', default: 'r2' }
    },
    async ({ controlId, revision = 'r2' }) => {
      const index = revision === 'r3' ? data.rev3Index : data.rev2Index;
      const ctrl = index[controlId];
      if (!ctrl) {
        return { content: [{ type: 'text', text: `Control ${controlId} not found in Rev ${revision === 'r3' ? '3' : '2'}. Try the other revision or check the ID format.` }] };
      }

      // Add cross-reference IDs for objectives
      const objectives = ctrl.objectives.map(obj => {
        const xref = data.ctrlXref[obj.id];
        return { id: obj.id, text: obj.text, ...(xref ? { externalRef: xref } : {}) };
      });

      // Check for ODPs (Rev 3)
      const odps = data.crosswalk.odps[controlId];

      const result = {
        controlId: ctrl.controlId,
        name: ctrl.controlName,
        family: `${ctrl.familyId} — ${ctrl.familyName}`,
        description: ctrl.description,
        objectiveCount: objectives.length,
        objectives,
        ...(odps ? { dodODPs: odps } : {})
      };

      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'search_controls',
    'Search across all NIST 800-171 controls and objectives by keyword. Returns matching controls with relevance.',
    {
      query: { type: 'string', description: 'Search query (e.g. "multi-factor authentication", "encryption", "audit log")' },
      revision: { type: 'string', description: 'Revision: "r2" or "r3". Defaults to "r2".', default: 'r2' },
      maxResults: { type: 'number', description: 'Maximum results to return. Defaults to 10.', default: 10 }
    },
    async ({ query, revision = 'r2', maxResults = 10 }) => {
      const index = revision === 'r3' ? data.rev3Index : data.rev2Index;
      const q = query.toLowerCase();
      const results = [];

      for (const ctrl of Object.values(index)) {
        let score = 0;
        const matchedObjectives = [];

        // Score control-level matches
        if (ctrl.controlName.toLowerCase().includes(q)) score += 3;
        if (ctrl.description.toLowerCase().includes(q)) score += 2;

        // Score objective-level matches
        for (const obj of ctrl.objectives) {
          if (obj.text.toLowerCase().includes(q)) {
            score += 1;
            matchedObjectives.push(obj.id);
          }
        }

        if (score > 0) {
          results.push({
            controlId: ctrl.controlId,
            name: ctrl.controlName,
            family: ctrl.familyId,
            description: ctrl.description,
            matchedObjectives,
            relevance: score
          });
        }
      }

      results.sort((a, b) => b.relevance - a.relevance);
      const top = results.slice(0, maxResults);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            query,
            revision: revision === 'r3' ? 'Rev 3' : 'Rev 2',
            totalMatches: results.length,
            showing: top.length,
            results: top
          }, null, 2)
        }]
      };
    }
  );

  server.tool(
    'list_families',
    'List all NIST 800-171 control families with control counts and objective counts.',
    {
      revision: { type: 'string', description: 'Revision: "r2" or "r3". Defaults to "r2".', default: 'r2' }
    },
    async ({ revision = 'r2' }) => {
      const families = revision === 'r3' ? data.families.rev3 : data.families.rev2;
      const result = families.map(fam => ({
        id: fam.id,
        name: fam.name,
        controls: (fam.controls || []).length,
        objectives: (fam.controls || []).reduce((n, c) => n + (c.objectives || []).length, 0),
        ...(fam.newInRev3 ? { newInRev3: true } : {})
      }));

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            revision: revision === 'r3' ? 'Rev 3' : 'Rev 2',
            totalFamilies: result.length,
            totalControls: result.reduce((n, f) => n + f.controls, 0),
            totalObjectives: result.reduce((n, f) => n + f.objectives, 0),
            families: result
          }, null, 2)
        }]
      };
    }
  );
}
