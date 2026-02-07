// Shared Terminal UI Component
// Provides a reusable terminal emulator for in-browser command-line tools.

const TerminalUI = {
    create(containerId, options = {}) {
        const instance = {
            containerId,
            title: options.title || 'Terminal',
            prompt: options.prompt || '> ',
            welcomeMessage: options.welcomeMessage || 'Type "help" for available commands.',
            commandHandler: options.commandHandler || (() => 'Command not found.'),
            history: [],
            historyIndex: -1,
            container: null,
            outputEl: null,
            inputEl: null,

            mount() {
                const container = document.getElementById(this.containerId);
                if (!container) return;
                this.container = container;

                container.innerHTML = `
                    <div class="terminal-container">
                        <div class="terminal-header">
                            <div class="terminal-header-dots">
                                <span class="terminal-dot red"></span>
                                <span class="terminal-dot yellow"></span>
                                <span class="terminal-dot green"></span>
                            </div>
                            <span class="terminal-header-title">${this.esc(this.title)}</span>
                            <div class="terminal-header-actions">
                                <button class="terminal-copy-btn" title="Copy output">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                </button>
                            </div>
                        </div>
                        <div class="terminal-output" id="${this.containerId}-output"></div>
                        <div class="terminal-input-row">
                            <span class="terminal-prompt">${this.esc(this.prompt)}</span>
                            <input type="text" class="terminal-input" id="${this.containerId}-input" autocomplete="off" spellcheck="false" placeholder="Type a command...">
                        </div>
                    </div>
                `;

                this.outputEl = document.getElementById(`${this.containerId}-output`);
                this.inputEl = document.getElementById(`${this.containerId}-input`);
                this.bindEvents();
                this.writeLine(this.welcomeMessage, 'info');
            },

            bindEvents() {
                this.inputEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const cmd = this.inputEl.value.trim();
                        if (!cmd) return;
                        this.history.push(cmd);
                        this.historyIndex = this.history.length;
                        this.writeCommand(cmd);
                        this.inputEl.value = '';
                        this.processCommand(cmd);
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (this.historyIndex > 0) {
                            this.historyIndex--;
                            this.inputEl.value = this.history[this.historyIndex];
                        }
                    } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (this.historyIndex < this.history.length - 1) {
                            this.historyIndex++;
                            this.inputEl.value = this.history[this.historyIndex];
                        } else {
                            this.historyIndex = this.history.length;
                            this.inputEl.value = '';
                        }
                    } else if (e.key === 'Tab') {
                        e.preventDefault();
                        if (this.autocomplete) {
                            const result = this.autocomplete(this.inputEl.value);
                            if (result) this.inputEl.value = result;
                        }
                    } else if (e.key === 'l' && e.ctrlKey) {
                        e.preventDefault();
                        this.clear();
                    }
                });

                // Copy button
                const copyBtn = this.container.querySelector('.terminal-copy-btn');
                if (copyBtn) {
                    copyBtn.addEventListener('click', () => {
                        const text = this.outputEl.innerText;
                        navigator.clipboard.writeText(text).then(() => {
                            this.writeLine('Output copied to clipboard.', 'success');
                        });
                    });
                }

                // Click to focus input
                this.container.querySelector('.terminal-container').addEventListener('click', () => {
                    this.inputEl.focus();
                });
            },

            async processCommand(cmd) {
                try {
                    const result = await this.commandHandler(cmd, this);
                    if (result !== undefined && result !== null) {
                        if (typeof result === 'string') {
                            this.writeLine(result);
                        } else if (Array.isArray(result)) {
                            result.forEach(line => {
                                if (typeof line === 'object') {
                                    this.writeLine(line.text, line.type);
                                } else {
                                    this.writeLine(line);
                                }
                            });
                        }
                    }
                } catch (err) {
                    this.writeLine(`Error: ${err.message}`, 'error');
                }
                this.scrollToBottom();
            },

            writeCommand(cmd) {
                const line = document.createElement('div');
                line.className = 'terminal-line terminal-cmd';
                line.innerHTML = `<span class="terminal-prompt">${this.esc(this.prompt)}</span><span>${this.esc(cmd)}</span>`;
                this.outputEl.appendChild(line);
                this.scrollToBottom();
            },

            writeLine(text, type) {
                const line = document.createElement('div');
                line.className = `terminal-line ${type ? 'terminal-' + type : ''}`;
                // Support pre-formatted HTML (detect any HTML tags in the string)
                if (text && /<[a-z][\s\S]*>/i.test(text)) {
                    line.innerHTML = text;
                } else {
                    line.textContent = text || '';
                }
                this.outputEl.appendChild(line);
                this.scrollToBottom();
            },

            writeTable(headers, rows) {
                const colWidths = headers.map((h, i) => {
                    const maxData = rows.reduce((max, row) => Math.max(max, String(row[i] || '').length), 0);
                    return Math.max(h.length, maxData);
                });

                const pad = (str, width) => String(str).padEnd(width);
                const sep = colWidths.map(w => '─'.repeat(w + 2)).join('┼');

                this.writeLine(`<span class="terminal-table-header">┌─${colWidths.map(w => '─'.repeat(w + 2)).join('─┬─')}─┐</span>`);
                this.writeLine(`<span class="terminal-table-header">│ ${headers.map((h, i) => pad(h, colWidths[i])).join(' │ ')} │</span>`);
                this.writeLine(`<span class="terminal-table-header">├─${sep}─┤</span>`);

                for (const row of rows) {
                    const cells = headers.map((_, i) => pad(row[i] || '', colWidths[i]));
                    this.writeLine(`<span class="terminal-table-row">│ ${cells.join(' │ ')} │</span>`);
                }

                this.writeLine(`<span class="terminal-table-header">└─${colWidths.map(w => '─'.repeat(w + 2)).join('─┴─')}─┘</span>`);
            },

            writeSection(title, content) {
                this.writeLine(`<span class="terminal-section-title">━━━ ${this.esc(title)} ━━━</span>`);
                if (typeof content === 'string') {
                    this.writeLine(content);
                } else if (Array.isArray(content)) {
                    content.forEach(line => this.writeLine(line));
                }
                this.writeLine('');
            },

            clear() {
                this.outputEl.innerHTML = '';
                this.writeLine(this.welcomeMessage, 'info');
            },

            scrollToBottom() {
                this.outputEl.scrollTop = this.outputEl.scrollHeight;
            },

            esc(str) {
                const el = document.createElement('span');
                el.textContent = str;
                return el.innerHTML;
            }
        };

        // Allow setting autocomplete after creation
        instance.autocomplete = options.autocomplete || null;

        return instance;
    }
};
