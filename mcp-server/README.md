# CMMC Reference MCP Server

Static NIST 800-171 / CMMC compliance reference data for AI tools via Model Context Protocol.

**Layer 1 only — zero client data, zero risk.** All data is derived from public NIST publications and DoD guidance.

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

Add to your MCP settings:

```json
{
  "cmmc-reference": {
    "command": "node",
    "args": ["/absolute/path/to/nist-assessment-tool/mcp-server/src/index.js"]
  }
}
```

## Available Tools

| Tool | Description |
|---|---|
| `cmmc_server_info` | Server info and available data stats |
| `get_control_info` | Look up a control with objectives, ODPs, cross-refs |
| `search_controls` | Full-text search across all controls |
| `list_families` | List all control families with counts |
| `get_crosswalk` | Rev 2 → Rev 3 control mapping |
| `get_odp_values` | DoD-defined ODP values for Rev 3 controls |
| `get_new_rev3_controls` | New controls added in Rev 3 |
| `get_800_53_mapping` | NIST 800-53 to 800-171 tailoring mapping |
| `get_implementation_guidance` | Platform-specific implementation guidance |
| `get_evidence_requirements` | Evidence artifacts needed for assessment |

## Data Loaded

- **110** Rev 2 controls, **320** assessment objectives
- **97** Rev 3 controls, **422** assessment objectives
- **110** Rev 2 → Rev 3 crosswalk mappings
- **18** new Rev 3 controls
- **17** controls with DoD-defined ODPs
- **90** NIST 800-53 to 171 mappings
- Platform-specific implementation guidance

## Architecture

This is **Layer 1** of a 3-layer MCP architecture:

1. **Layer 1 (this)** — Static reference data, always safe, no auth needed
2. **Layer 2** — Ephemeral assessment context bridge (clipboard/temp file, redacted)
3. **Layer 3** — Future authenticated API via Supabase (when backend exists)

## Security

- No client assessment data is stored or transmitted
- No API keys or credentials required
- All data is public NIST/DoD reference material
- Runs locally via stdio — no network exposure
