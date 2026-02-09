/**
 * Assessment Context Bridge (Layer 2)
 * Provides tools for AI clients to understand assessment state
 * without directly accessing client localStorage.
 * 
 * The UI exports a JSON snapshot to a temp file or clipboard,
 * and this tool reads it to provide context to the AI.
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { tmpdir, homedir } from 'os';

const BRIDGE_DIR = join(homedir(), '.cmmc-mcp');
const BRIDGE_FILE = join(BRIDGE_DIR, 'assessment-context.json');

function ensureBridgeDir() {
  if (!existsSync(BRIDGE_DIR)) {
    mkdirSync(BRIDGE_DIR, { recursive: true });
  }
}

function readBridgeData() {
  try {
    if (!existsSync(BRIDGE_FILE)) return null;
    const raw = readFileSync(BRIDGE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    // Check staleness — reject data older than 1 hour
    if (parsed._exportedAt) {
      const age = Date.now() - new Date(parsed._exportedAt).getTime();
      if (age > 3600000) {
        return { _stale: true, _exportedAt: parsed._exportedAt, _ageMinutes: Math.round(age / 60000) };
      }
    }
    return parsed;
  } catch (e) {
    return null;
  }
}

export function registerAssessmentTools(server, data) {

  server.tool(
    'get_assessment_snapshot',
    'Read the latest assessment context snapshot exported from the CMMC Assessment Tool UI. Returns current assessment status, SPRS score, control statuses, and POA&M summary. The user must first export a snapshot from the tool (Settings → MCP Bridge → Export Snapshot).',
    {},
    async () => {
      const bridge = readBridgeData();
      if (!bridge) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: 'No assessment snapshot found.',
              instructions: 'Ask the user to export an assessment snapshot from the CMMC Assessment Tool: Settings → MCP Bridge → Export Snapshot. This creates a local file that this MCP server can read.',
              bridgePath: BRIDGE_FILE
            }, null, 2)
          }]
        };
      }

      if (bridge._stale) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              warning: `Assessment snapshot is ${bridge._ageMinutes} minutes old (exported at ${bridge._exportedAt}). Ask the user to export a fresh snapshot for current data.`,
              bridgePath: BRIDGE_FILE
            }, null, 2)
          }]
        };
      }

      // Redact any sensitive fields before returning
      const safe = { ...bridge };
      delete safe._raw;
      delete safe.credentials;
      delete safe.apiKeys;

      return { content: [{ type: 'text', text: JSON.stringify(safe, null, 2) }] };
    }
  );

  server.tool(
    'get_assessment_gaps',
    'Analyze the assessment snapshot to identify compliance gaps, NOT MET controls, and prioritized remediation recommendations based on SPRS impact.',
    {},
    async () => {
      const bridge = readBridgeData();
      if (!bridge || bridge._stale) {
        return {
          content: [{
            type: 'text',
            text: 'No current assessment snapshot available. Ask the user to export one from Settings → MCP Bridge → Export Snapshot.'
          }]
        };
      }

      const statuses = bridge.controlStatuses || bridge.objectiveStatuses || {};
      const notMet = [];
      const partial = [];
      const met = [];
      const notAssessed = [];

      for (const [id, status] of Object.entries(statuses)) {
        const s = (status || '').toLowerCase();
        if (s === 'met' || s === 'implemented') met.push(id);
        else if (s === 'not met' || s === 'not-met' || s === 'not_met' || s === 'not-implemented') notMet.push(id);
        else if (s === 'partially met' || s === 'partial' || s === 'partially-met') partial.push(id);
        else notAssessed.push(id);
      }

      // Calculate SPRS impact for not-met controls
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

      const NEVER_POAM = ['3.5.3', '3.5.4', '3.13.11', '3.13.8', '3.13.16'];

      // Extract control IDs from objective IDs (e.g., "3.1.1[a]" → "3.1.1")
      const extractControlId = (id) => id.replace(/\[.*\]$/, '').replace(/[a-z]$/, '');
      
      const notMetControlIds = [...new Set(notMet.map(extractControlId))];
      let sprsDeduction = 0;
      const prioritized = [];

      for (const ctrlId of notMetControlIds) {
        const pts = SPRS_VALUES[ctrlId];
        if (pts) {
          sprsDeduction += pts;
          prioritized.push({
            controlId: ctrlId,
            name: data.rev2Index[ctrlId]?.controlName || 'Unknown',
            sprsPoints: pts,
            neverPOAM: NEVER_POAM.includes(ctrlId),
            priority: NEVER_POAM.includes(ctrlId) ? 'CRITICAL' : pts === 5 ? 'HIGH' : pts === 3 ? 'MEDIUM' : 'LOW'
          });
        }
      }

      prioritized.sort((a, b) => {
        if (a.neverPOAM !== b.neverPOAM) return a.neverPOAM ? -1 : 1;
        return b.sprsPoints - a.sprsPoints;
      });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            summary: {
              totalAssessed: met.length + notMet.length + partial.length,
              met: met.length,
              notMet: notMet.length,
              partiallyMet: partial.length,
              notAssessed: notAssessed.length,
              estimatedSPRS: 110 - sprsDeduction,
              sprsDeduction
            },
            criticalGaps: prioritized.filter(p => p.priority === 'CRITICAL'),
            highPriorityGaps: prioritized.filter(p => p.priority === 'HIGH'),
            allGaps: prioritized,
            recommendations: [
              ...(prioritized.some(p => p.neverPOAM) ? ['IMMEDIATE: Remediate NEVER-POA&M controls before CMMC assessment'] : []),
              ...(sprsDeduction > 30 ? ['Develop formal POA&M with milestones for all NOT MET controls'] : []),
              ...(notAssessed.length > 10 ? [`Complete assessment for ${notAssessed.length} unassessed objectives`] : []),
              'Review 5-point controls first for maximum SPRS score improvement'
            ]
          }, null, 2)
        }]
      };
    }
  );

  server.tool(
    'get_poam_summary',
    'Get a summary of POA&M items from the assessment snapshot, including overdue items and remediation status.',
    {},
    async () => {
      const bridge = readBridgeData();
      if (!bridge || bridge._stale) {
        return {
          content: [{
            type: 'text',
            text: 'No current assessment snapshot available. Ask the user to export one from Settings → MCP Bridge → Export Snapshot.'
          }]
        };
      }

      const poam = bridge.poamItems || bridge.poam || [];
      if (!Array.isArray(poam) || poam.length === 0) {
        return { content: [{ type: 'text', text: 'No POA&M items found in the assessment snapshot.' }] };
      }

      const now = new Date();
      const overdue = poam.filter(p => p.scheduledCompletion && new Date(p.scheduledCompletion) < now && p.status !== 'completed');
      const byStatus = {};
      for (const p of poam) {
        const s = p.status || 'unknown';
        byStatus[s] = (byStatus[s] || 0) + 1;
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            totalItems: poam.length,
            statusBreakdown: byStatus,
            overdueCount: overdue.length,
            overdueItems: overdue.map(p => ({
              controlId: p.controlId,
              weakness: p.weakness || p.description,
              dueDate: p.scheduledCompletion,
              responsible: p.responsibleParty
            })),
            items: poam.slice(0, 20).map(p => ({
              controlId: p.controlId,
              status: p.status,
              weakness: p.weakness || p.description,
              scheduledCompletion: p.scheduledCompletion,
              responsible: p.responsibleParty
            }))
          }, null, 2)
        }]
      };
    }
  );

  // Write bridge file tool — used by the UI's export function
  server.tool(
    'write_assessment_bridge',
    'Internal tool: Write assessment context data to the bridge file. Called by the CMMC Assessment Tool UI when exporting a snapshot.',
    {
      jsonData: { type: 'string', description: 'JSON string of assessment context data' }
    },
    async ({ jsonData }) => {
      try {
        const parsed = JSON.parse(jsonData);
        parsed._exportedAt = new Date().toISOString();
        parsed._source = 'cmmc-assessment-tool';
        ensureBridgeDir();
        writeFileSync(BRIDGE_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: 'Assessment snapshot saved to MCP bridge.',
              path: BRIDGE_FILE,
              exportedAt: parsed._exportedAt
            }, null, 2)
          }]
        };
      } catch (e) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ success: false, error: e.message }, null, 2)
          }]
        };
      }
    }
  );
}
