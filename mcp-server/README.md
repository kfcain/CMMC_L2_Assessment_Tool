# CMMC Reference MCP Server

NIST 800-171 / CMMC compliance reference data and assessment context bridge for AI tools via Model Context Protocol.

**17 tools across 6 categories.** Layer 1 is static reference data (zero risk). Layer 2 is an ephemeral assessment bridge (user-initiated export, auto-expires).

## Quick Start

```bash
cd mcp-server
npm install
npm start
```

## Claude Desktop Configuration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "cmmc-reference": {
      "command": "node",
      "args": ["/Users/YOUR_USERNAME/CascadeProjects/nist-assessment-tool/mcp-server/src/index.js"]
    }
  }
}
```

Replace `YOUR_USERNAME` with your macOS username. Restart Claude Desktop after saving.

## Windsurf / Cursor Configuration

Add to your MCP settings (`.windsurf/mcp.json` or Cursor MCP config):

```json
{
  "cmmc-reference": {
    "command": "node",
    "args": ["/absolute/path/to/nist-assessment-tool/mcp-server/src/index.js"]
  }
}
```

## Available Tools (17)

### Controls
| Tool | Description |
|---|---|
| `get_control_info` | Look up a control with objectives, ODPs, cross-refs |
| `search_controls` | Full-text search across all controls |
| `list_families` | List all control families with counts |

### Crosswalk & ODPs
| Tool | Description |
|---|---|
| `get_crosswalk` | Rev 2 → Rev 3 control mapping |
| `get_odp_values` | DoD-defined ODP values for Rev 3 controls |
| `get_new_rev3_controls` | New controls added in Rev 3 |
| `get_800_53_mapping` | NIST 800-53 to 800-171 tailoring mapping |

### Implementation
| Tool | Description |
|---|---|
| `get_implementation_guidance` | Platform-specific guidance (AWS, Azure, Palo Alto, SentinelOne, etc.) |
| `get_evidence_requirements` | Evidence artifacts needed for assessment |

### FedRAMP
| Tool | Description |
|---|---|
| `get_fedramp_ksi` | FedRAMP 20x Key Security Indicators |
| `search_fedramp_ksi` | Search KSIs by keyword |

### SPRS Scoring
| Tool | Description |
|---|---|
| `get_sprs_score_info` | Point values, methodology, POA&M eligibility rules |
| `calculate_sprs_impact` | Calculate SPRS impact for NOT MET controls |

### Assessment Bridge (Layer 2)
| Tool | Description |
|---|---|
| `get_assessment_snapshot` | Read latest assessment context from UI export |
| `get_assessment_gaps` | Analyze gaps with SPRS impact and priorities |
| `get_poam_summary` | POA&M items summary with overdue tracking |

## Data Loaded

- **110** Rev 2 controls, **320** assessment objectives
- **97** Rev 3 controls, **422** assessment objectives
- **110** Rev 2 → Rev 3 crosswalk mappings
- **18** new Rev 3 controls
- **17** controls with DoD-defined ODPs
- **155+** implementation guidance entries (AWS, Azure, GCP, Palo Alto, SentinelOne, NinjaOne, Tenable, SOC/SIEM platforms, L3 controls)
- **90** NIST 800-53 to 171 mappings
- FedRAMP 20x KSI reference data
- SPRS scoring table (all 110 controls with point values)

## Architecture

Two-layer MCP architecture:

1. **Layer 1** — Static reference data (controls, crosswalk, guidance, FedRAMP, SPRS). Always safe, no auth needed, no client data.
2. **Layer 2** — Assessment context bridge. User exports a snapshot from the UI (Settings → MCP Server → Export Snapshot). Saved to `~/.cmmc-mcp/assessment-context.json`. Auto-expires after 1 hour. Sensitive fields are redacted.

## UI Integration

The MCP Server section is accessible in the CMMC Assessment Tool under **Settings → MCP Server**:
- Server status and stats
- Copy-paste configuration for Claude Desktop, Windsurf, and Cursor
- Assessment Bridge export (download JSON or copy to clipboard)
- Full tool listing with descriptions

## Security

- Layer 1: No client data stored or transmitted. All data is public NIST/DoD reference material.
- Layer 2: Assessment snapshots are user-initiated, stored locally (`~/.cmmc-mcp/`), auto-expire after 1 hour, and redact credentials/API keys.
- No API keys or credentials required to run the server.
- Runs locally via stdio — no network exposure.
