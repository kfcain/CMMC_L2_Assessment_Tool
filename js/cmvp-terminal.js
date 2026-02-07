// CMVP Terminal — In-browser terminal interface for NIST CMVP data
// Fetches from the same static JSON API as the Go-based cmvp-tui tool.

const CMVPTerminal = {
    modules: null,
    metadata: null,
    loading: false,
    API_BASE: 'https://ethanolivertroy.github.io/NIST-CMVP-API/api',
    terminal: null,

    commands: ['search', 'detail', 'filter', 'stats', 'recent', 'vendors', 'clear', 'help'],

    init(containerId) {
        this.terminal = TerminalUI.create(containerId, {
            title: 'CMVP Explorer — FIPS 140 Module Database',
            prompt: 'cmvp> ',
            welcomeMessage: '',
            commandHandler: (cmd, term) => this.handleCommand(cmd, term),
            autocomplete: (partial) => this.autocomplete(partial)
        });
        this.terminal.mount();
        this.showWelcome();
        this.loadData();
    },

    showWelcome() {
        const t = this.terminal;
        t.writeLine('<span class="terminal-cyan">╔══════════════════════════════════════════════════╗</span>');
        t.writeLine('<span class="terminal-cyan">║</span>  <span class="terminal-success">NIST CMVP Explorer</span> — FIPS 140 Module Database  <span class="terminal-cyan">║</span>');
        t.writeLine('<span class="terminal-cyan">╚══════════════════════════════════════════════════╝</span>');
        t.writeLine('');
        t.writeLine('  Browse and search NIST Cryptographic Module Validation');
        t.writeLine('  Program (CMVP) data directly in your browser.');
        t.writeLine('');
        t.writeLine('  Type <span class="terminal-cyan">help</span> for available commands.', 'info');
        t.writeLine('');
    },

    async loadData() {
        if (this.modules || this.loading) return;
        this.loading = true;
        this.terminal.writeLine('Loading CMVP database...', 'info');
        try {
            const modUrl = this.API_BASE + '/modules.json';
            const metaUrl = this.API_BASE + '/metadata.json';
            const [modRes, metaRes] = await Promise.all([
                window.fetch(modUrl),
                window.fetch(metaUrl)
            ]);
            if (!modRes.ok) throw new Error(`HTTP ${modRes.status} loading modules`);
            if (!metaRes.ok) throw new Error(`HTTP ${metaRes.status} loading metadata`);
            this.modules = await modRes.json();
            this.metadata = await metaRes.json();
            const count = Array.isArray(this.modules) ? this.modules.length : Object.keys(this.modules).length;
            this.terminal.writeLine(`Loaded ${count.toLocaleString()} modules. Ready.`, 'success');
        } catch (err) {
            this.terminal.writeLine(`Failed to load data: ${err.message}`, 'error');
            this.terminal.writeLine('Try reloading the page or check your network connection.', 'info');
        }
        this.loading = false;
    },

    getModulesArray() {
        if (!this.modules) return [];
        return Array.isArray(this.modules) ? this.modules : Object.values(this.modules);
    },

    async handleCommand(input, term) {
        const parts = input.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');

        switch (cmd) {
            case 'help': return this.cmdHelp(term);
            case 'search': return this.cmdSearch(args, term);
            case 'detail': return this.cmdDetail(args, term);
            case 'filter': return this.cmdFilter(args, term);
            case 'stats': return this.cmdStats(term);
            case 'recent': return this.cmdRecent(args, term);
            case 'vendors': return this.cmdVendors(args, term);
            case 'clear': term.clear(); return;
            default:
                term.writeLine(`Unknown command: ${cmd}`, 'error');
                term.writeLine('Type <span class="terminal-cyan">help</span> for available commands.', 'info');
        }
    },

    cmdHelp(term) {
        term.writeLine('');
        term.writeLine('<span class="terminal-section-title">━━━ Available Commands ━━━</span>');
        term.writeLine('');
        const cmds = [
            ['search <query>', 'Search modules by name, vendor, or description'],
            ['detail <cert#>', 'Show full details for a certificate number'],
            ['filter <key>:<value>', 'Filter modules (type, standard, status, level)'],
            ['stats', 'Show database statistics'],
            ['recent [n]', 'Show n most recently validated modules (default: 10)'],
            ['vendors [query]', 'List top vendors or search vendors'],
            ['clear', 'Clear terminal output'],
            ['help', 'Show this help message']
        ];
        for (const [cmd, desc] of cmds) {
            term.writeLine(`  <span class="terminal-cyan">${cmd.padEnd(25)}</span> ${desc}`);
        }
        term.writeLine('');
        term.writeLine('<span class="terminal-section-title">━━━ Filter Keys ━━━</span>');
        term.writeLine('');
        term.writeLine('  <span class="terminal-warning">type:</span>Hardware, Software, Firmware, Hybrid');
        term.writeLine('  <span class="terminal-warning">standard:</span>FIPS 140-2, FIPS 140-3');
        term.writeLine('  <span class="terminal-warning">status:</span>Active, Revoked, Historical');
        term.writeLine('  <span class="terminal-warning">level:</span>1, 2, 3, 4');
        term.writeLine('');
        term.writeLine('  <span class="terminal-info">Keyboard:</span> ↑/↓ history, Ctrl+L clear, Tab autocomplete');
        term.writeLine('');
    },

    cmdSearch(query, term) {
        if (!query) {
            term.writeLine('Usage: search <query>', 'warning');
            return;
        }
        if (!this.modules) {
            term.writeLine('Data not loaded yet. Please wait...', 'warning');
            return;
        }

        const q = query.toLowerCase();
        const mods = this.getModulesArray();
        const results = mods.filter(m => {
            const name = (m.moduleName || m.name || '').toLowerCase();
            const vendor = (m.vendorName || m.vendor || '').toLowerCase();
            const desc = (m.description || '').toLowerCase();
            return name.includes(q) || vendor.includes(q) || desc.includes(q);
        }).slice(0, 25);

        if (results.length === 0) {
            term.writeLine(`No modules found matching "${query}"`, 'warning');
            return;
        }

        term.writeLine(`<span class="terminal-success">Found ${results.length}${results.length === 25 ? '+' : ''} modules matching "${query}"</span>`);
        term.writeLine('');

        const headers = ['Cert#', 'Module Name', 'Vendor', 'Standard', 'Status'];
        const rows = results.map(m => [
            String(m.certificateNumber || m.certNumber || m.id || '?'),
            (m.moduleName || m.name || 'N/A').substring(0, 35),
            (m.vendorName || m.vendor || 'N/A').substring(0, 20),
            m.standard || m.fipsStandard || 'N/A',
            m.status || m.validationStatus || 'N/A'
        ]);
        term.writeTable(headers, rows);
        term.writeLine('');
        term.writeLine('Use <span class="terminal-cyan">detail &lt;cert#&gt;</span> for full module information.', 'info');
    },

    cmdDetail(certNum, term) {
        if (!certNum) {
            term.writeLine('Usage: detail <certificate_number>', 'warning');
            return;
        }
        if (!this.modules) {
            term.writeLine('Data not loaded yet. Please wait...', 'warning');
            return;
        }

        const mods = this.getModulesArray();
        const mod = mods.find(m =>
            String(m.certificateNumber || m.certNumber || m.id) === certNum.trim()
        );

        if (!mod) {
            term.writeLine(`No module found with certificate #${certNum}`, 'error');
            return;
        }

        term.writeLine('');
        term.writeSection('Module Details', [
            `  <span class="terminal-cyan">Certificate:</span>  #${mod.certificateNumber || mod.certNumber || mod.id}`,
            `  <span class="terminal-cyan">Module Name:</span>  ${mod.moduleName || mod.name || 'N/A'}`,
            `  <span class="terminal-cyan">Vendor:</span>       ${mod.vendorName || mod.vendor || 'N/A'}`,
            `  <span class="terminal-cyan">Standard:</span>     ${mod.standard || mod.fipsStandard || 'N/A'}`,
            `  <span class="terminal-cyan">Status:</span>       ${mod.status || mod.validationStatus || 'N/A'}`,
            `  <span class="terminal-cyan">Level:</span>        ${mod.securityLevel || mod.level || mod.overallLevel || 'N/A'}`,
            `  <span class="terminal-cyan">Type:</span>         ${mod.moduleType || mod.type || 'N/A'}`,
            `  <span class="terminal-cyan">Validation:</span>   ${mod.validationDate || mod.dateValidated || 'N/A'}`,
            `  <span class="terminal-cyan">Sunset:</span>       ${mod.sunsetDate || 'N/A'}`,
        ]);

        if (mod.description) {
            term.writeSection('Description', [`  ${mod.description}`]);
        }

        if (mod.algorithms || mod.testedAlgorithms) {
            const algos = mod.algorithms || mod.testedAlgorithms;
            if (Array.isArray(algos)) {
                term.writeSection('Algorithms', algos.map(a => `  • ${typeof a === 'string' ? a : a.algorithm || a.name || JSON.stringify(a)}`));
            } else if (typeof algos === 'string') {
                term.writeSection('Algorithms', [`  ${algos}`]);
            }
        }

        const url = `https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/${mod.certificateNumber || mod.certNumber || mod.id}`;
        term.writeLine(`  <span class="terminal-info">NIST Page:</span> ${url}`);
        term.writeLine('');
    },

    cmdFilter(args, term) {
        if (!args || !args.includes(':')) {
            term.writeLine('Usage: filter <key>:<value>', 'warning');
            term.writeLine('Keys: type, standard, status, level', 'info');
            return;
        }
        if (!this.modules) {
            term.writeLine('Data not loaded yet. Please wait...', 'warning');
            return;
        }

        const [key, ...valueParts] = args.split(':');
        const value = valueParts.join(':').trim().toLowerCase();
        const mods = this.getModulesArray();

        let results;
        switch (key.trim().toLowerCase()) {
            case 'type':
                results = mods.filter(m => (m.moduleType || m.type || '').toLowerCase().includes(value));
                break;
            case 'standard':
                results = mods.filter(m => (m.standard || m.fipsStandard || '').toLowerCase().includes(value));
                break;
            case 'status':
                results = mods.filter(m => (m.status || m.validationStatus || '').toLowerCase().includes(value));
                break;
            case 'level':
                results = mods.filter(m => String(m.securityLevel || m.level || m.overallLevel || '').includes(value));
                break;
            default:
                term.writeLine(`Unknown filter key: ${key}`, 'error');
                return;
        }

        results = results.slice(0, 25);
        if (results.length === 0) {
            term.writeLine(`No modules found with ${key}:${value}`, 'warning');
            return;
        }

        term.writeLine(`<span class="terminal-success">Found ${results.length}${results.length === 25 ? '+' : ''} modules with ${key}:${value}</span>`);
        term.writeLine('');

        const headers = ['Cert#', 'Module Name', 'Vendor', 'Standard', 'Status'];
        const rows = results.map(m => [
            String(m.certificateNumber || m.certNumber || m.id || '?'),
            (m.moduleName || m.name || 'N/A').substring(0, 35),
            (m.vendorName || m.vendor || 'N/A').substring(0, 20),
            m.standard || m.fipsStandard || 'N/A',
            m.status || m.validationStatus || 'N/A'
        ]);
        term.writeTable(headers, rows);
        term.writeLine('');
    },

    cmdStats(term) {
        if (!this.modules) {
            term.writeLine('Data not loaded yet. Please wait...', 'warning');
            return;
        }

        const mods = this.getModulesArray();
        const total = mods.length;

        const byStatus = {};
        const byStandard = {};
        const byType = {};
        const byLevel = {};

        for (const m of mods) {
            const status = m.status || m.validationStatus || 'Unknown';
            const standard = m.standard || m.fipsStandard || 'Unknown';
            const type = m.moduleType || m.type || 'Unknown';
            const level = String(m.securityLevel || m.level || m.overallLevel || 'Unknown');

            byStatus[status] = (byStatus[status] || 0) + 1;
            byStandard[standard] = (byStandard[standard] || 0) + 1;
            byType[type] = (byType[type] || 0) + 1;
            byLevel[level] = (byLevel[level] || 0) + 1;
        }

        term.writeLine('');
        term.writeSection('Database Statistics', [
            `  <span class="terminal-cyan">Total Modules:</span> ${total.toLocaleString()}`
        ]);

        const renderGroup = (title, data) => {
            const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
            term.writeLine(`<span class="terminal-section-title">━━━ ${title} ━━━</span>`);
            for (const [key, count] of sorted) {
                const bar = '█'.repeat(Math.ceil(count / total * 40));
                const pct = ((count / total) * 100).toFixed(1);
                term.writeLine(`  <span class="terminal-warning">${key.padEnd(18)}</span> ${String(count).padStart(6)} <span class="terminal-info">(${pct}%)</span> <span class="terminal-success">${bar}</span>`);
            }
            term.writeLine('');
        };

        renderGroup('By Status', byStatus);
        renderGroup('By Standard', byStandard);
        renderGroup('By Type', byType);
        renderGroup('By Security Level', byLevel);
    },

    cmdRecent(args, term) {
        if (!this.modules) {
            term.writeLine('Data not loaded yet. Please wait...', 'warning');
            return;
        }

        const n = parseInt(args) || 10;
        const mods = this.getModulesArray();

        const sorted = [...mods].sort((a, b) => {
            const da = new Date(a.validationDate || a.dateValidated || 0);
            const db = new Date(b.validationDate || b.dateValidated || 0);
            return db - da;
        }).slice(0, n);

        term.writeLine(`<span class="terminal-success">Most recent ${sorted.length} validated modules</span>`);
        term.writeLine('');

        const headers = ['Cert#', 'Module Name', 'Vendor', 'Date', 'Standard'];
        const rows = sorted.map(m => [
            String(m.certificateNumber || m.certNumber || m.id || '?'),
            (m.moduleName || m.name || 'N/A').substring(0, 30),
            (m.vendorName || m.vendor || 'N/A').substring(0, 18),
            (m.validationDate || m.dateValidated || 'N/A').substring(0, 10),
            m.standard || m.fipsStandard || 'N/A'
        ]);
        term.writeTable(headers, rows);
        term.writeLine('');
    },

    cmdVendors(query, term) {
        if (!this.modules) {
            term.writeLine('Data not loaded yet. Please wait...', 'warning');
            return;
        }

        const mods = this.getModulesArray();
        const vendorCounts = {};
        for (const m of mods) {
            const vendor = m.vendorName || m.vendor || 'Unknown';
            vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1;
        }

        let entries = Object.entries(vendorCounts).sort((a, b) => b[1] - a[1]);

        if (query) {
            const q = query.toLowerCase();
            entries = entries.filter(([v]) => v.toLowerCase().includes(q));
        }

        entries = entries.slice(0, 20);

        if (entries.length === 0) {
            term.writeLine(`No vendors found${query ? ` matching "${query}"` : ''}`, 'warning');
            return;
        }

        term.writeLine(`<span class="terminal-success">Top ${entries.length} vendors${query ? ` matching "${query}"` : ''}</span>`);
        term.writeLine('');

        const headers = ['Vendor', 'Modules'];
        const rows = entries.map(([v, c]) => [v.substring(0, 45), String(c)]);
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
