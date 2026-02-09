#!/usr/bin/env node

/**
 * CMMC Reference MCP Server
 * Layer 1: Static reference data — zero client data, zero risk
 * 
 * Exposes NIST 800-171 controls, Rev2→Rev3 crosswalk, DoD ODPs,
 * implementation guidance, and evidence requirements to any MCP client.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadAllData } from './data-loader.js';
import { registerControlTools } from './tools/controls.js';
import { registerCrosswalkTools } from './tools/crosswalk.js';
import { registerGuidanceTools } from './tools/guidance.js';
import { registerFedRAMPTools } from './tools/fedramp.js';
import { registerSPRSTools } from './tools/sprs.js';
import { registerAssessmentTools } from './tools/assessment.js';

// Load all static reference data at startup
console.error('[CMMC MCP] Starting CMMC Reference MCP Server v2.0.0');
const data = loadAllData();
console.error('[CMMC MCP] Data loaded successfully');

// Create MCP server
const server = new McpServer({
  name: 'cmmc-reference',
  version: '2.0.0'
});

// Register all tool groups
registerControlTools(server, data);
registerCrosswalkTools(server, data);
registerGuidanceTools(server, data);
registerFedRAMPTools(server, data);
registerSPRSTools(server, data);
registerAssessmentTools(server, data);

// Add a server info tool
server.tool(
  'cmmc_server_info',
  'Get information about this CMMC Reference MCP Server and what data is available.',
  {},
  async () => {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          name: 'CMMC Reference MCP Server',
          version: '2.0.0',
          description: 'NIST 800-171 / CMMC compliance reference data and assessment context bridge for AI tools.',
          dataLoaded: data.stats,
          layers: {
            layer1: 'Static reference data (controls, crosswalk, guidance, FedRAMP, SPRS) — always safe, no auth',
            layer2: 'Assessment context bridge (snapshot export from UI → local file → MCP read) — ephemeral, redacted'
          },
          availableTools: [
            { group: 'Controls', tools: [
              { name: 'get_control_info', description: 'Look up a specific control with objectives and ODPs' },
              { name: 'search_controls', description: 'Full-text search across all controls' },
              { name: 'list_families', description: 'List all control families with counts' }
            ]},
            { group: 'Crosswalk & ODPs', tools: [
              { name: 'get_crosswalk', description: 'Rev 2 → Rev 3 control mapping' },
              { name: 'get_odp_values', description: 'DoD-defined ODP values for Rev 3 controls' },
              { name: 'get_new_rev3_controls', description: 'New controls added in Rev 3' },
              { name: 'get_800_53_mapping', description: 'NIST 800-53 to 800-171 tailoring mapping' }
            ]},
            { group: 'Implementation', tools: [
              { name: 'get_implementation_guidance', description: 'Platform-specific implementation guidance' },
              { name: 'get_evidence_requirements', description: 'Evidence artifacts needed for assessment' }
            ]},
            { group: 'FedRAMP', tools: [
              { name: 'get_fedramp_ksi', description: 'FedRAMP 20x Key Security Indicators' },
              { name: 'search_fedramp_ksi', description: 'Search KSIs by keyword' }
            ]},
            { group: 'SPRS Scoring', tools: [
              { name: 'get_sprs_score_info', description: 'SPRS point values, methodology, POA&M rules' },
              { name: 'calculate_sprs_impact', description: 'Calculate SPRS impact for NOT MET controls' }
            ]},
            { group: 'Assessment Bridge', tools: [
              { name: 'get_assessment_snapshot', description: 'Read latest assessment context from UI export' },
              { name: 'get_assessment_gaps', description: 'Analyze gaps with SPRS impact and priorities' },
              { name: 'get_poam_summary', description: 'POA&M items summary with overdue tracking' }
            ]}
          ]
        }, null, 2)
      }]
    };
  }
);

// Start the server with stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('[CMMC MCP] Server running on stdio');
