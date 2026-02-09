/**
 * FedRAMP KSI and compliance tools
 */

export function registerFedRAMPTools(server, data) {

  server.tool(
    'get_fedramp_ksi',
    'Get FedRAMP 20x Key Security Indicator (KSI) details. Returns KSI definition, thresholds, measurement criteria, and mapped NIST 800-53 controls.',
    {
      ksiId: { type: 'string', description: 'KSI identifier (e.g. "KSI-01", "KSI-12"). Omit to list all KSIs.' }
    },
    async ({ ksiId }) => {
      const ksi = data.fedRAMP;
      if (!ksi || typeof ksi !== 'object') {
        return { content: [{ type: 'text', text: 'FedRAMP KSI data not available.' }] };
      }

      // If no specific KSI requested, list all
      if (!ksiId) {
        const entries = Array.isArray(ksi) ? ksi : (ksi.ksis || ksi.indicators || Object.values(ksi));
        if (!entries || entries.length === 0) {
          return { content: [{ type: 'text', text: 'No FedRAMP KSI entries found in loaded data.' }] };
        }
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              description: 'FedRAMP 20x Key Security Indicators (KSIs) — continuous monitoring metrics',
              count: entries.length,
              ksis: Array.isArray(entries) ? entries.map(k => ({
                id: k.id || k.ksiId,
                title: k.title || k.name,
                category: k.category || k.domain
              })) : entries
            }, null, 2)
          }]
        };
      }

      // Find specific KSI
      const entries = Array.isArray(ksi) ? ksi : (ksi.ksis || ksi.indicators || Object.values(ksi));
      const match = Array.isArray(entries)
        ? entries.find(k => (k.id || k.ksiId || '').toUpperCase() === ksiId.toUpperCase())
        : null;

      if (!match) {
        return { content: [{ type: 'text', text: `KSI "${ksiId}" not found. Use get_fedramp_ksi without a ksiId to list all available KSIs.` }] };
      }

      return { content: [{ type: 'text', text: JSON.stringify(match, null, 2) }] };
    }
  );

  server.tool(
    'search_fedramp_ksi',
    'Search FedRAMP KSIs by keyword. Useful for finding which KSIs relate to a topic like "vulnerability", "patching", "MFA", etc.',
    {
      query: { type: 'string', description: 'Search keyword (e.g. "vulnerability", "access", "encryption")' }
    },
    async ({ query }) => {
      const ksi = data.fedRAMP;
      if (!ksi || typeof ksi !== 'object') {
        return { content: [{ type: 'text', text: 'FedRAMP KSI data not available.' }] };
      }

      const entries = Array.isArray(ksi) ? ksi : (ksi.ksis || ksi.indicators || Object.values(ksi));
      if (!Array.isArray(entries)) {
        return { content: [{ type: 'text', text: 'FedRAMP KSI data format not searchable.' }] };
      }

      const q = query.toLowerCase();
      const results = entries.filter(k => {
        const searchable = JSON.stringify(k).toLowerCase();
        return searchable.includes(q);
      });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            query,
            matches: results.length,
            results: results.map(k => ({
              id: k.id || k.ksiId,
              title: k.title || k.name,
              category: k.category || k.domain,
              ...(k.controls ? { relatedControls: k.controls } : {}),
              ...(k.threshold ? { threshold: k.threshold } : {})
            }))
          }, null, 2)
        }]
      };
    }
  );
}
