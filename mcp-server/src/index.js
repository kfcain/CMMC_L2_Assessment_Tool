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

// Load all static reference data at startup
console.error('[CMMC MCP] Starting CMMC Reference MCP Server v1.0.0');
const data = loadAllData();
console.error('[CMMC MCP] Data loaded successfully');

// Create MCP server
const server = new McpServer({
  name: 'cmmc-reference',
  version: '1.0.0'
});

// Register all tool groups
registerControlTools(server, data);
registerCrosswalkTools(server, data);
registerGuidanceTools(server, data);

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
          version: '1.0.0',
          description: 'Static NIST 800-171 / CMMC compliance reference data. No client data is stored or exposed.',
          dataLoaded: data.stats,
          availableTools: [
            { name: 'get_control_info', description: 'Look up a specific control with objectives and ODPs' },
            { name: 'search_controls', description: 'Full-text search across all controls' },
            { name: 'list_families', description: 'List all control families with counts' },
            { name: 'get_crosswalk', description: 'Rev 2 → Rev 3 control mapping' },
            { name: 'get_odp_values', description: 'DoD-defined ODP values for Rev 3 controls' },
            { name: 'get_new_rev3_controls', description: 'New controls added in Rev 3' },
            { name: 'get_800_53_mapping', description: 'NIST 800-53 to 800-171 tailoring mapping' },
            { name: 'get_implementation_guidance', description: 'Platform-specific implementation guidance' },
            { name: 'get_evidence_requirements', description: 'Evidence artifacts needed for assessment' }
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
