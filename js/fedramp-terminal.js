// FedRAMP Docs Terminal — In-browser terminal for FedRAMP document exploration
// Simulates the fedramp-docs-mcp server tools using curated static data.

const FedRAMPTerminal = {
    terminal: null,
    commands: ['list_documents', 'list_ksi', 'get_ksi', 'list_controls', 'get_control', 'filter_by_impact', 'search', 'get_evidence', 'sig_changes', 'ksi_mapping', 'clear', 'help'],

    init(containerId) {
        this.terminal = TerminalUI.create(containerId, {
            title: 'FedRAMP Docs — Compliance Reference Terminal',
            prompt: 'fedramp> ',
            welcomeMessage: '',
            commandHandler: (cmd, term) => this.handleCommand(cmd, term),
            autocomplete: (partial) => this.autocomplete(partial)
        });
        this.terminal.mount();
        this.showWelcome();
    },

    showWelcome() {
        const t = this.terminal;
        t.writeLine('<span class="terminal-cyan">╔══════════════════════════════════════════════════════╗</span>');
        t.writeLine('<span class="terminal-cyan">║</span>  <span class="terminal-success">FedRAMP Docs Terminal</span> — Compliance Reference      <span class="terminal-cyan">║</span>');
        t.writeLine('<span class="terminal-cyan">╚══════════════════════════════════════════════════════╝</span>');
        t.writeLine('');
        t.writeLine('  Browse FedRAMP documents, KSI indicators, 800-53 controls,');
        t.writeLine('  evidence examples, and significant change guidance.');
        t.writeLine('');
        t.writeLine('  Type <span class="terminal-cyan">help</span> for available commands.', 'info');
        t.writeLine('');
    },

    handleCommand(input, term) {
        const parts = input.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');

        if (!this.checkData(term)) return;

        switch (cmd) {
            case 'help': return this.cmdHelp(term);
            case 'list_documents': return this.cmdListDocuments(term);
            case 'list_ksi': return this.cmdListKSI(args, term);
            case 'get_ksi': return this.cmdGetKSI(args, term);
            case 'list_controls': return this.cmdListControls(term);
            case 'get_control': return this.cmdGetControl(args, term);
            case 'filter_by_impact': return this.cmdFilterByImpact(args, term);
            case 'search': return this.cmdSearch(args, term);
            case 'get_evidence': return this.cmdGetEvidence(args, term);
            case 'sig_changes': return this.cmdSigChanges(term);
            case 'ksi_mapping': return this.cmdKSIMapping(args, term);
            case 'clear': term.clear(); return;
            default:
                term.writeLine(`Unknown command: ${cmd}`, 'error');
                term.writeLine('Type <span class="terminal-cyan">help</span> for available commands.', 'info');
        }
    },

    checkData(term) {
        if (typeof FEDRAMP_DOCS_DATA === 'undefined') {
            term.writeLine('FedRAMP docs data not loaded.', 'error');
            return false;
        }
        return true;
    },

    cmdHelp(term) {
        term.writeLine('');
        term.writeLine('<span class="terminal-section-title">━━━ Document Discovery ━━━</span>');
        term.writeLine('');
        term.writeLine('  <span class="terminal-cyan">list_documents</span>          List all FRMR document types');
        term.writeLine('  <span class="terminal-cyan">search <query></span>          Search across all data');
        term.writeLine('');
        term.writeLine('<span class="terminal-section-title">━━━ KSI (Key Security Indicators) ━━━</span>');
        term.writeLine('');
        term.writeLine('  <span class="terminal-cyan">list_ksi [family]</span>       List KSI families or indicators in a family');
        term.writeLine('  <span class="terminal-cyan">get_ksi <id></span>            Get details for a specific KSI');
        term.writeLine('  <span class="terminal-cyan">filter_by_impact <lvl></span>  Filter KSIs by baseline (low/moderate)');
        term.writeLine('  <span class="terminal-cyan">ksi_mapping [family]</span>    Show KSI to 800-53 control mapping');
        term.writeLine('');
        term.writeLine('<span class="terminal-section-title">━━━ Control Mapping ━━━</span>');
        term.writeLine('');
        term.writeLine('  <span class="terminal-cyan">list_controls</span>           List 800-53 control families');
        term.writeLine('  <span class="terminal-cyan">get_control <id></span>        Get control family details');
        term.writeLine('');
        term.writeLine('<span class="terminal-section-title">━━━ Evidence & Guidance ━━━</span>');
        term.writeLine('');
        term.writeLine('  <span class="terminal-cyan">get_evidence <theme></span>    Get evidence examples for a theme');
        term.writeLine('  <span class="terminal-cyan">sig_changes</span>             Show significant change guidance');
        term.writeLine('');
        term.writeLine('<span class="terminal-section-title">━━━ General ━━━</span>');
        term.writeLine('');
        term.writeLine('  <span class="terminal-cyan">clear</span>                   Clear terminal output');
        term.writeLine('  <span class="terminal-cyan">help</span>                    Show this help message');
        term.writeLine('');
        term.writeLine('  <span class="terminal-info">Evidence themes:</span> access-control, audit-logging, configuration-management,');
        term.writeLine('  incident-response, encryption, vulnerability-management, continuous-monitoring');
        term.writeLine('');
    },

    cmdListDocuments(term) {
        const docs = FEDRAMP_DOCS_DATA.documents;
        term.writeLine(`<span class="terminal-success">Found ${docs.length} FRMR document types</span>`);
        term.writeLine('');

        const headers = ['ID', 'Type', 'Title', 'Format'];
        const rows = docs.map(d => [d.id, d.type.substring(0, 25), d.title.substring(0, 35), d.format]);
        term.writeTable(headers, rows);
        term.writeLine('');
    },

    cmdListKSI(args, term) {
        if (typeof FEDRAMP_KSI_REFERENCE === 'undefined') {
            term.writeLine('KSI reference data not loaded.', 'error');
            return;
        }

        const families = FEDRAMP_KSI_REFERENCE.families;

        if (!args) {
            term.writeLine(`<span class="terminal-success">${families.length} KSI Families</span>`);
            term.writeLine('');
            const headers = ['ID', 'Family Name', 'KSIs'];
            const rows = families.map(f => [f.id, f.name, String(f.ksis.length)]);
            term.writeTable(headers, rows);
            term.writeLine('');
            term.writeLine('Use <span class="terminal-cyan">list_ksi &lt;family_id&gt;</span> to see indicators in a family.', 'info');
            return;
        }

        const family = families.find(f => f.id.toLowerCase() === args.toLowerCase());
        if (!family) {
            term.writeLine(`Unknown KSI family: ${args}`, 'error');
            term.writeLine('Use <span class="terminal-cyan">list_ksi</span> to see all families.', 'info');
            return;
        }

        term.writeLine(`<span class="terminal-success">${family.id} — ${family.name}</span>`);
        term.writeLine(`  ${family.description}`);
        term.writeLine('');

        const headers = ['KSI ID', 'Title', 'Baselines'];
        const rows = family.ksis.map(k => [k.id, k.title.substring(0, 40), k.baselines.join(', ')]);
        term.writeTable(headers, rows);
        term.writeLine('');
    },

    cmdGetKSI(id, term) {
        if (!id) {
            term.writeLine('Usage: get_ksi <ksi_id>', 'warning');
            return;
        }
        if (typeof FEDRAMP_KSI_REFERENCE === 'undefined') {
            term.writeLine('KSI reference data not loaded.', 'error');
            return;
        }

        const families = FEDRAMP_KSI_REFERENCE.families;
        let found = null;
        let parentFamily = null;

        for (const f of families) {
            const ksi = f.ksis.find(k => k.id.toLowerCase() === id.toLowerCase());
            if (ksi) {
                found = ksi;
                parentFamily = f;
                break;
            }
        }

        if (!found) {
            term.writeLine(`KSI not found: ${id}`, 'error');
            return;
        }

        term.writeLine('');
        term.writeSection('KSI Details', [
            `  <span class="terminal-cyan">ID:</span>          ${found.id}`,
            `  <span class="terminal-cyan">Title:</span>       ${found.title}`,
            `  <span class="terminal-cyan">Family:</span>      ${parentFamily.id} — ${parentFamily.name}`,
            `  <span class="terminal-cyan">Baselines:</span>   ${found.baselines.join(', ')}`,
            `  <span class="terminal-cyan">Description:</span> ${found.desc}`
        ]);

        const related171 = FEDRAMP_KSI_REFERENCE.familyToNist171[parentFamily.id];
        if (related171 && related171.length) {
            term.writeLine(`  <span class="terminal-cyan">Related 800-171:</span> ${related171.join(', ')}`);
        }

        const related053 = FEDRAMP_DOCS_DATA.ksiTo80053[parentFamily.id];
        if (related053 && related053.length) {
            term.writeLine(`  <span class="terminal-cyan">Related 800-53:</span>  ${related053.join(', ')}`);
        }
        term.writeLine('');
    },

    cmdListControls(term) {
        const families = FEDRAMP_DOCS_DATA.controlFamilies;
        term.writeLine(`<span class="terminal-success">${families.length} NIST 800-53 Control Families</span>`);
        term.writeLine('');

        const headers = ['ID', 'Family Name', 'Controls'];
        const rows = families.map(f => [f.id, f.name.substring(0, 40), String(f.controlCount)]);
        term.writeTable(headers, rows);

        const total = families.reduce((s, f) => s + f.controlCount, 0);
        term.writeLine('');
        term.writeLine(`  <span class="terminal-info">Total controls:</span> ${total}`);
        term.writeLine('');
    },

    cmdGetControl(id, term) {
        if (!id) {
            term.writeLine('Usage: get_control <family_id>', 'warning');
            return;
        }

        const family = FEDRAMP_DOCS_DATA.controlFamilies.find(f =>
            f.id.toLowerCase() === id.toLowerCase()
        );

        if (!family) {
            term.writeLine(`Control family not found: ${id}`, 'error');
            return;
        }

        term.writeLine('');
        term.writeSection(`${family.id} — ${family.name}`, [
            `  <span class="terminal-cyan">Controls:</span>    ${family.controlCount}`,
            `  <span class="terminal-cyan">Description:</span> ${family.description}`
        ]);

        // Find related KSI families
        const relatedKSI = [];
        if (typeof FEDRAMP_KSI_REFERENCE !== 'undefined') {
            for (const [ksiFam, nist171] of Object.entries(FEDRAMP_KSI_REFERENCE.familyToNist171)) {
                if (nist171.includes(family.id)) {
                    const fam = FEDRAMP_KSI_REFERENCE.families.find(f => f.id === ksiFam);
                    if (fam) relatedKSI.push(`${fam.id} (${fam.name})`);
                }
            }
        }

        if (relatedKSI.length) {
            term.writeLine(`  <span class="terminal-cyan">Related KSI Families:</span>`);
            relatedKSI.forEach(k => term.writeLine(`    • ${k}`));
        }

        // Find related 800-53 controls
        const related053 = [];
        for (const [ksiFam, controls] of Object.entries(FEDRAMP_DOCS_DATA.ksiTo80053)) {
            const matching = controls.filter(c => c.startsWith(family.id + '-'));
            if (matching.length) {
                related053.push(...matching);
            }
        }

        if (related053.length) {
            term.writeLine(`  <span class="terminal-cyan">Specific 800-53 Controls:</span> ${related053.join(', ')}`);
        }
        term.writeLine('');
    },

    cmdFilterByImpact(level, term) {
        if (!level || !['low', 'moderate'].includes(level.toLowerCase())) {
            term.writeLine('Usage: filter_by_impact <low|moderate>', 'warning');
            return;
        }
        if (typeof FEDRAMP_KSI_REFERENCE === 'undefined') {
            term.writeLine('KSI reference data not loaded.', 'error');
            return;
        }

        const lvl = level.toLowerCase();
        const families = FEDRAMP_KSI_REFERENCE.families;
        let count = 0;

        term.writeLine(`<span class="terminal-success">KSIs at ${lvl} baseline</span>`);
        term.writeLine('');

        for (const f of families) {
            const filtered = f.ksis.filter(k => {
                if (lvl === 'low') return k.baselines.includes('low');
                return true; // moderate includes all
            });

            if (filtered.length === 0) continue;
            count += filtered.length;

            term.writeLine(`<span class="terminal-warning">${f.id} — ${f.name}</span>`);
            for (const k of filtered) {
                const tag = k.baselines.length === 1 && k.baselines[0] === 'moderate' ? ' <span class="terminal-info">[moderate-only]</span>' : '';
                term.writeLine(`  ${k.id}  ${k.title}${tag}`);
            }
            term.writeLine('');
        }

        term.writeLine(`<span class="terminal-info">Total: ${count} KSIs at ${lvl} baseline</span>`);
        term.writeLine('');
    },

    cmdSearch(query, term) {
        if (!query) {
            term.writeLine('Usage: search <query>', 'warning');
            return;
        }

        const q = query.toLowerCase();
        const results = [];

        // Search documents
        for (const doc of FEDRAMP_DOCS_DATA.documents) {
            if (`${doc.id} ${doc.title} ${doc.description} ${doc.type}`.toLowerCase().includes(q)) {
                results.push({ type: 'Document', id: doc.id, text: doc.title });
            }
        }

        // Search KSIs
        if (typeof FEDRAMP_KSI_REFERENCE !== 'undefined') {
            for (const f of FEDRAMP_KSI_REFERENCE.families) {
                if (`${f.id} ${f.name} ${f.description}`.toLowerCase().includes(q)) {
                    results.push({ type: 'KSI Family', id: f.id, text: f.name });
                }
                for (const k of f.ksis) {
                    if (`${k.id} ${k.title} ${k.desc}`.toLowerCase().includes(q)) {
                        results.push({ type: 'KSI', id: k.id, text: k.title });
                    }
                }
            }
        }

        // Search control families
        for (const cf of FEDRAMP_DOCS_DATA.controlFamilies) {
            if (`${cf.id} ${cf.name} ${cf.description}`.toLowerCase().includes(q)) {
                results.push({ type: '800-53 Family', id: cf.id, text: cf.name });
            }
        }

        // Search evidence themes
        for (const [theme, examples] of Object.entries(FEDRAMP_DOCS_DATA.evidenceExamples)) {
            if (theme.includes(q) || examples.some(e => e.toLowerCase().includes(q))) {
                results.push({ type: 'Evidence', id: theme, text: `${examples.length} examples` });
            }
        }

        // Search significant changes
        for (const sc of FEDRAMP_DOCS_DATA.significantChangeGuidance) {
            if (`${sc.trigger} ${sc.impact} ${sc.action}`.toLowerCase().includes(q)) {
                results.push({ type: 'Sig Change', id: '—', text: sc.trigger.substring(0, 40) });
            }
        }

        if (results.length === 0) {
            term.writeLine(`No results found for "${query}"`, 'warning');
            return;
        }

        term.writeLine(`<span class="terminal-success">Found ${results.length} results for "${query}"</span>`);
        term.writeLine('');

        const headers = ['Type', 'ID', 'Description'];
        const rows = results.slice(0, 25).map(r => [r.type, r.id, r.text.substring(0, 40)]);
        term.writeTable(headers, rows);
        term.writeLine('');
    },

    cmdGetEvidence(theme, term) {
        if (!theme) {
            term.writeLine('Usage: get_evidence <theme>', 'warning');
            term.writeLine('');
            term.writeLine('Available themes:', 'info');
            for (const key of Object.keys(FEDRAMP_DOCS_DATA.evidenceExamples)) {
                term.writeLine(`  <span class="terminal-cyan">${key}</span>`);
            }
            term.writeLine('');
            return;
        }

        const key = theme.toLowerCase().replace(/\s+/g, '-');
        const examples = FEDRAMP_DOCS_DATA.evidenceExamples[key];

        if (!examples) {
            term.writeLine(`Unknown evidence theme: ${theme}`, 'error');
            term.writeLine('Use <span class="terminal-cyan">get_evidence</span> to see available themes.', 'info');
            return;
        }

        term.writeLine('');
        term.writeLine(`<span class="terminal-success">Evidence Examples: ${key}</span>`);
        term.writeLine('');
        examples.forEach((ex, i) => {
            term.writeLine(`  <span class="terminal-cyan">${String(i + 1).padStart(2)}.</span> ${ex}`);
        });
        term.writeLine('');
        term.writeLine('  <span class="terminal-info">Tip:</span> Collect these artifacts during your assessment preparation.', 'info');
        term.writeLine('');
    },

    cmdSigChanges(term) {
        const changes = FEDRAMP_DOCS_DATA.significantChangeGuidance;
        term.writeLine(`<span class="terminal-success">Significant Change Guidance (${changes.length} scenarios)</span>`);
        term.writeLine('');

        for (const sc of changes) {
            term.writeLine(`<span class="terminal-warning">Trigger:</span> ${sc.trigger}`);
            term.writeLine(`  <span class="terminal-cyan">Impact:</span>  ${sc.impact}`);
            term.writeLine(`  <span class="terminal-success">Action:</span>  ${sc.action}`);
            term.writeLine('');
        }
    },

    cmdKSIMapping(args, term) {
        const mapping = FEDRAMP_DOCS_DATA.ksiTo80053;

        if (args) {
            const fam = args.toUpperCase();
            const controls = mapping[fam];
            if (!controls) {
                term.writeLine(`Unknown KSI family: ${args}`, 'error');
                return;
            }

            let famName = fam;
            if (typeof FEDRAMP_KSI_REFERENCE !== 'undefined') {
                const f = FEDRAMP_KSI_REFERENCE.families.find(f => f.id === fam);
                if (f) famName = `${f.id} — ${f.name}`;
            }

            term.writeLine(`<span class="terminal-success">${famName} → 800-53 Controls</span>`);
            term.writeLine('');
            controls.forEach(c => term.writeLine(`  • ${c}`));
            term.writeLine('');
            return;
        }

        term.writeLine('<span class="terminal-success">KSI Family → 800-53 Control Mapping</span>');
        term.writeLine('');

        const headers = ['KSI Family', '800-53 Controls'];
        const rows = Object.entries(mapping).map(([fam, controls]) => {
            let name = fam;
            if (typeof FEDRAMP_KSI_REFERENCE !== 'undefined') {
                const f = FEDRAMP_KSI_REFERENCE.families.find(f => f.id === fam);
                if (f) name = `${f.id} (${f.name.substring(0, 20)})`;
            }
            return [name, controls.join(', ')];
        });
        term.writeTable(headers, rows);
        term.writeLine('');
    },

    autocomplete(partial) {
        if (!partial) return null;
        const p = partial.toLowerCase();
        const match = this.commands.find(c => c.startsWith(p));
        return match ? match + ' ' : null;
    }
};
