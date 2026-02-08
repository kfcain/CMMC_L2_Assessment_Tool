// MarkItDown Document Converter — UI Module
// Full-featured document-to-markdown converter with batch processing,
// live preview, and multi-format export (individual .md, ZIP, clipboard)
// Powered by DocumentConverter engine

const DocumentParser = {
    version: "2.0.0",
    uploadedFiles: [],
    convertedResults: [],
    _activePreview: -1,

    init: function() {
        this._bindGlobalEvents();
        console.log('[DocumentParser] v2.0 UI initialized');
    },

    _bindGlobalEvents: function() {
        var self = this;
        document.addEventListener('click', function(e) {
            if (e.target.closest('#open-document-parser-btn')) {
                self.open();
            }
        });
    },

    // ═══════════════════════════════════════════
    //  Supported extensions list (from DocumentConverter)
    // ═══════════════════════════════════════════
    _acceptList: function() {
        if (typeof DocumentConverter !== 'undefined' && DocumentConverter.handlers) {
            return Object.keys(DocumentConverter.handlers).map(function(e) { return '.' + e; }).join(',');
        }
        return '.docx,.pdf,.xlsx,.xls,.csv,.pptx,.html,.htm,.txt,.md,.json,.xml,.rtf,.doc';
    },

    _supportedLabel: function() {
        return 'DOCX, PDF, XLSX, PPTX, CSV, HTML, TXT, JSON, XML, RTF, MD';
    },

    // ═══════════════════════════════════════════
    //  Open the converter modal
    // ═══════════════════════════════════════════
    open: function() {
        // Remove existing modal if any
        var existing = document.getElementById('markitdown-modal');
        if (existing) existing.remove();

        this.uploadedFiles = [];
        this.convertedResults = [];
        this._activePreview = -1;

        var modal = document.createElement('div');
        modal.id = 'markitdown-modal';
        modal.className = 'modal-overlay markitdown-modal';
        modal.innerHTML = this._renderModal();
        document.body.appendChild(modal);

        this._bindModalEvents(modal);
    },

    _renderModal: function() {
        return '<div class="modal-content modal-xl markitdown-container">' +
            '<div class="modal-header markitdown-header">' +
                '<div class="markitdown-title-row">' +
                    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' +
                    '<div>' +
                        '<h2>MarkItDown</h2>' +
                        '<span class="markitdown-subtitle">Document to Markdown Converter</span>' +
                    '</div>' +
                '</div>' +
                '<button class="modal-close" id="markitdown-close">&times;</button>' +
            '</div>' +
            '<div class="modal-body markitdown-body">' +
                // Upload zone
                '<div id="markitdown-upload-zone" class="markitdown-upload-zone">' +
                    '<input type="file" id="markitdown-file-input" multiple accept="' + this._acceptList() + '" style="display:none;">' +
                    '<div class="markitdown-drop-area" id="markitdown-drop-area">' +
                        '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5">' +
                            '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>' +
                            '<polyline points="17 8 12 3 7 8"/>' +
                            '<line x1="12" y1="3" x2="12" y2="15"/>' +
                        '</svg>' +
                        '<p class="markitdown-drop-title">Drop files here or click to browse</p>' +
                        '<p class="markitdown-drop-sub">Supports ' + this._supportedLabel() + ' (max 50MB each)</p>' +
                    '</div>' +
                '</div>' +
                // File list
                '<div id="markitdown-file-list" class="markitdown-file-list" style="display:none;"></div>' +
                // Progress bar
                '<div id="markitdown-progress" class="markitdown-progress" style="display:none;">' +
                    '<div class="markitdown-progress-bar"><div class="markitdown-progress-fill" id="markitdown-progress-fill"></div></div>' +
                    '<span class="markitdown-progress-text" id="markitdown-progress-text">Converting...</span>' +
                '</div>' +
                // Results panel (split: file list left, preview right)
                '<div id="markitdown-results" class="markitdown-results" style="display:none;">' +
                    '<div class="markitdown-results-sidebar" id="markitdown-results-sidebar"></div>' +
                    '<div class="markitdown-preview-panel">' +
                        '<div class="markitdown-preview-toolbar" id="markitdown-preview-toolbar"></div>' +
                        '<div class="markitdown-preview-content" id="markitdown-preview-content">' +
                            '<p class="markitdown-preview-placeholder">Select a file to preview its markdown output</p>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="modal-footer markitdown-footer">' +
                '<div class="markitdown-footer-left">' +
                    '<span class="markitdown-lib-status" id="markitdown-lib-status"></span>' +
                '</div>' +
                '<div class="markitdown-footer-right">' +
                    '<button class="btn-secondary" id="markitdown-close-btn">Close</button>' +
                    '<button class="btn-primary" id="markitdown-convert-btn" disabled>' +
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>' +
                        ' Convert to Markdown' +
                    '</button>' +
                    '<button class="btn-primary markitdown-export-btn" id="markitdown-export-zip" style="display:none;">' +
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
                        ' Download All (.zip)' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    },

    _bindModalEvents: function(modal) {
        var self = this;
        var dropArea = modal.querySelector('#markitdown-drop-area');
        var fileInput = modal.querySelector('#markitdown-file-input');

        // Close
        modal.querySelector('#markitdown-close').addEventListener('click', function() { modal.remove(); });
        modal.querySelector('#markitdown-close-btn').addEventListener('click', function() { modal.remove(); });
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

        // Drop area click → file input
        dropArea.addEventListener('click', function() { fileInput.click(); });

        // File input change
        fileInput.addEventListener('change', function() {
            self._addFiles(fileInput.files);
            fileInput.value = '';
        });

        // Drag and drop
        dropArea.addEventListener('dragover', function(e) { e.preventDefault(); dropArea.classList.add('drag-over'); });
        dropArea.addEventListener('dragleave', function() { dropArea.classList.remove('drag-over'); });
        dropArea.addEventListener('drop', function(e) {
            e.preventDefault();
            dropArea.classList.remove('drag-over');
            self._addFiles(e.dataTransfer.files);
        });

        // Convert button
        modal.querySelector('#markitdown-convert-btn').addEventListener('click', function() { self._convertAll(); });

        // Export ZIP button
        modal.querySelector('#markitdown-export-zip').addEventListener('click', function() { self._exportZip(); });

        // Show library status
        this._updateLibStatus();
    },

    // ═══════════════════════════════════════════
    //  File management
    // ═══════════════════════════════════════════
    _addFiles: function(fileList) {
        var self = this;
        Array.from(fileList).forEach(function(file) {
            // Check if already added
            if (self.uploadedFiles.some(function(f) { return f.name === file.name && f.size === file.size; })) return;
            // Check support
            if (typeof DocumentConverter !== 'undefined' && !DocumentConverter.isSupported(file.name)) {
                self._toast('Unsupported file: ' + file.name, 'error');
                return;
            }
            if (file.size > 50 * 1024 * 1024) {
                self._toast('File too large: ' + file.name, 'error');
                return;
            }
            self.uploadedFiles.push(file);
        });
        this._renderFileList();
    },

    _removeFile: function(index) {
        this.uploadedFiles.splice(index, 1);
        this._renderFileList();
    },

    _renderFileList: function() {
        var listEl = document.getElementById('markitdown-file-list');
        var convertBtn = document.getElementById('markitdown-convert-btn');
        if (!listEl) return;

        if (this.uploadedFiles.length === 0) {
            listEl.style.display = 'none';
            if (convertBtn) convertBtn.disabled = true;
            return;
        }

        listEl.style.display = 'block';
        if (convertBtn) convertBtn.disabled = false;

        var self = this;
        var html = '<div class="markitdown-file-list-header">' +
            '<span>' + this.uploadedFiles.length + ' file' + (this.uploadedFiles.length > 1 ? 's' : '') + ' queued</span>' +
            '<button class="markitdown-clear-btn" id="markitdown-clear-all">Clear All</button>' +
        '</div>';

        this.uploadedFiles.forEach(function(file, i) {
            var info = (typeof DocumentConverter !== 'undefined') ? DocumentConverter.getHandlerInfo(file.name) : null;
            var icon = info ? info.icon : '📄';
            var label = info ? info.label : 'File';
            var size = (typeof DocumentConverter !== 'undefined') ? DocumentConverter.formatFileSize(file.size) : file.size + ' B';

            html += '<div class="markitdown-file-item">' +
                '<span class="markitdown-file-icon">' + icon + '</span>' +
                '<div class="markitdown-file-info">' +
                    '<span class="markitdown-file-name">' + self._escapeHtml(file.name) + '</span>' +
                    '<span class="markitdown-file-meta">' + size + ' &middot; ' + label + '</span>' +
                '</div>' +
                '<button class="markitdown-file-remove" data-idx="' + i + '" title="Remove">' +
                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
                '</button>' +
            '</div>';
        });

        listEl.innerHTML = html;

        // Bind remove buttons
        listEl.querySelectorAll('.markitdown-file-remove').forEach(function(btn) {
            btn.addEventListener('click', function() { self._removeFile(parseInt(btn.dataset.idx)); });
        });
        var clearBtn = listEl.querySelector('#markitdown-clear-all');
        if (clearBtn) clearBtn.addEventListener('click', function() { self.uploadedFiles = []; self._renderFileList(); });
    },

    // ═══════════════════════════════════════════
    //  Conversion
    // ═══════════════════════════════════════════
    _convertAll: async function() {
        if (this.uploadedFiles.length === 0) return;
        if (typeof DocumentConverter === 'undefined') {
            this._toast('DocumentConverter engine not loaded', 'error');
            return;
        }

        var progressEl = document.getElementById('markitdown-progress');
        var progressFill = document.getElementById('markitdown-progress-fill');
        var progressText = document.getElementById('markitdown-progress-text');
        var convertBtn = document.getElementById('markitdown-convert-btn');
        var uploadZone = document.getElementById('markitdown-upload-zone');
        var fileList = document.getElementById('markitdown-file-list');

        if (progressEl) progressEl.style.display = 'block';
        if (convertBtn) convertBtn.disabled = true;
        if (uploadZone) uploadZone.style.display = 'none';
        if (fileList) fileList.style.display = 'none';

        this.convertedResults = [];
        var total = this.uploadedFiles.length;

        for (var i = 0; i < total; i++) {
            var file = this.uploadedFiles[i];
            var pct = Math.round(((i) / total) * 100);
            if (progressFill) progressFill.style.width = pct + '%';
            if (progressText) progressText.textContent = 'Converting ' + (i + 1) + ' of ' + total + ': ' + file.name;

            try {
                var result = await DocumentConverter.convert(file, function(msg) {
                    if (progressText) progressText.textContent = msg + ' (' + (i + 1) + '/' + total + ')';
                });
                this.convertedResults.push(result);
            } catch (err) {
                this.convertedResults.push({
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: 'Error',
                    icon: '⚠️',
                    markdown: '# Conversion Failed\n\n> **Error:** ' + err.message + '\n',
                    convertedAt: new Date().toISOString(),
                    warnings: [err.message],
                    stats: { wordCount: 0, lineCount: 0, tableCount: 0, headingCount: 0 }
                });
            }
        }

        if (progressFill) progressFill.style.width = '100%';
        if (progressText) progressText.textContent = 'Done! Converted ' + total + ' file' + (total > 1 ? 's' : '');

        setTimeout(function() {
            if (progressEl) progressEl.style.display = 'none';
        }, 800);

        this._showResults();
    },

    // ═══════════════════════════════════════════
    //  Results display
    // ═══════════════════════════════════════════
    _showResults: function() {
        var resultsEl = document.getElementById('markitdown-results');
        var convertBtn = document.getElementById('markitdown-convert-btn');
        var exportZip = document.getElementById('markitdown-export-zip');

        if (resultsEl) resultsEl.style.display = 'flex';
        if (convertBtn) convertBtn.style.display = 'none';
        if (exportZip) exportZip.style.display = 'inline-flex';

        this._renderResultsSidebar();
        if (this.convertedResults.length > 0) {
            this._showPreview(0);
        }
    },

    _renderResultsSidebar: function() {
        var sidebar = document.getElementById('markitdown-results-sidebar');
        if (!sidebar) return;

        var self = this;
        var html = '<div class="markitdown-sidebar-header">' +
            '<span class="markitdown-sidebar-count">' + this.convertedResults.length + ' converted</span>' +
        '</div>';

        this.convertedResults.forEach(function(r, i) {
            var hasWarnings = r.warnings && r.warnings.length > 0;
            var activeClass = (i === self._activePreview) ? ' active' : '';
            html += '<div class="markitdown-result-item' + activeClass + '" data-idx="' + i + '">' +
                '<span class="markitdown-result-icon">' + r.icon + '</span>' +
                '<div class="markitdown-result-info">' +
                    '<span class="markitdown-result-name">' + self._escapeHtml(r.fileName) + '</span>' +
                    '<span class="markitdown-result-meta">' +
                        r.stats.wordCount + ' words &middot; ' + r.stats.lineCount + ' lines' +
                        (hasWarnings ? ' &middot; <span class="markitdown-warn-badge">' + r.warnings.length + ' warning' + (r.warnings.length > 1 ? 's' : '') + '</span>' : '') +
                    '</span>' +
                '</div>' +
            '</div>';
        });

        sidebar.innerHTML = html;

        // Bind click
        sidebar.querySelectorAll('.markitdown-result-item').forEach(function(item) {
            item.addEventListener('click', function() {
                self._showPreview(parseInt(item.dataset.idx));
            });
        });
    },

    _showPreview: function(index) {
        this._activePreview = index;
        var result = this.convertedResults[index];
        if (!result) return;

        // Update sidebar active state
        var sidebar = document.getElementById('markitdown-results-sidebar');
        if (sidebar) {
            sidebar.querySelectorAll('.markitdown-result-item').forEach(function(item, i) {
                item.classList.toggle('active', i === index);
            });
        }

        // Toolbar
        var toolbar = document.getElementById('markitdown-preview-toolbar');
        if (toolbar) {
            toolbar.innerHTML =
                '<div class="markitdown-toolbar-left">' +
                    '<span class="markitdown-toolbar-name">' + result.icon + ' ' + this._escapeHtml(result.fileName) + '</span>' +
                    '<span class="markitdown-toolbar-type">' + result.fileType + '</span>' +
                '</div>' +
                '<div class="markitdown-toolbar-right">' +
                    '<button class="markitdown-toolbar-btn" id="markitdown-copy-btn" title="Copy to clipboard">' +
                        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>' +
                        ' Copy' +
                    '</button>' +
                    '<button class="markitdown-toolbar-btn" id="markitdown-download-btn" title="Download .md">' +
                        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
                        ' Download .md' +
                    '</button>' +
                '</div>';

            var self = this;
            toolbar.querySelector('#markitdown-copy-btn').addEventListener('click', function() {
                self._copyToClipboard(result.markdown);
            });
            toolbar.querySelector('#markitdown-download-btn').addEventListener('click', function() {
                DocumentConverter.downloadMarkdown(result);
            });
        }

        // Preview content
        var preview = document.getElementById('markitdown-preview-content');
        if (preview) {
            // Show warnings if any
            var warningHtml = '';
            if (result.warnings && result.warnings.length > 0) {
                warningHtml = '<div class="markitdown-warnings">';
                result.warnings.forEach(function(w) {
                    warningHtml += '<div class="markitdown-warning-item">' +
                        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' +
                        ' ' + self._escapeHtml(w) +
                    '</div>';
                });
                warningHtml += '</div>';
            }

            // Stats bar
            var statsHtml = '<div class="markitdown-stats-bar">' +
                '<span>' + result.stats.wordCount.toLocaleString() + ' words</span>' +
                '<span>' + result.stats.lineCount.toLocaleString() + ' lines</span>' +
                '<span>' + result.stats.headingCount + ' headings</span>' +
                '<span>' + result.stats.tableCount + ' tables</span>' +
                '<span>' + DocumentConverter.formatFileSize(result.fileSize) + ' original</span>' +
            '</div>';

            // Markdown preview (raw source with line numbers)
            var lines = result.markdown.split('\n');
            var codeHtml = '<div class="markitdown-code-view">';
            for (var i = 0; i < lines.length; i++) {
                codeHtml += '<div class="markitdown-code-line">' +
                    '<span class="markitdown-line-num">' + (i + 1) + '</span>' +
                    '<span class="markitdown-line-text">' + this._escapeHtml(lines[i]) + '</span>' +
                '</div>';
            }
            codeHtml += '</div>';

            preview.innerHTML = warningHtml + statsHtml + codeHtml;
        }
    },

    // ═══════════════════════════════════════════
    //  Export
    // ═══════════════════════════════════════════
    _exportZip: async function() {
        if (this.convertedResults.length === 0) return;
        try {
            await DocumentConverter.downloadZip(this.convertedResults, 'markitdown-export.zip');
            this._toast('ZIP downloaded!', 'success');
        } catch (err) {
            this._toast('ZIP export failed: ' + err.message, 'error');
        }
    },

    _copyToClipboard: function(text) {
        var self = this;
        navigator.clipboard.writeText(text).then(function() {
            self._toast('Copied to clipboard!', 'success');
        }).catch(function() {
            // Fallback
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            self._toast('Copied to clipboard!', 'success');
        });
    },

    // ═══════════════════════════════════════════
    //  Library status indicator
    // ═══════════════════════════════════════════
    _updateLibStatus: function() {
        var el = document.getElementById('markitdown-lib-status');
        if (!el) return;
        if (typeof DocumentConverter === 'undefined') {
            el.innerHTML = '<span class="markitdown-lib-err">Engine not loaded</span>';
            return;
        }
        DocumentConverter._checkLibraries();
        var libs = DocumentConverter._libs;
        var parts = [];
        parts.push(this._libDot(libs.mammoth, 'mammoth.js', 'DOCX'));
        parts.push(this._libDot(libs.pdfjsLib, 'pdf.js', 'PDF'));
        parts.push(this._libDot(libs.XLSX, 'SheetJS', 'XLSX'));
        parts.push(this._libDot(libs.JSZip, 'JSZip', 'PPTX/ZIP'));
        el.innerHTML = parts.join(' ');
    },

    _libDot: function(loaded, name, format) {
        var cls = loaded ? 'markitdown-lib-ok' : 'markitdown-lib-miss';
        var label = loaded ? name : name + ' (missing — ' + format + ' limited)';
        return '<span class="' + cls + '" title="' + label + '">' +
            '<span class="markitdown-lib-dot"></span>' + name +
        '</span>';
    },

    // ═══════════════════════════════════════════
    //  Utilities
    // ═══════════════════════════════════════════
    _escapeHtml: function(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    _toast: function(message, type) {
        if (typeof app !== 'undefined' && app.showToast) {
            app.showToast(message, type);
        } else {
            console.log('[MarkItDown] ' + type + ': ' + message);
        }
    }
};

// Initialize
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { DocumentParser.init(); });
    } else {
        DocumentParser.init();
    }
}

if (typeof window !== 'undefined') {
    window.DocumentParser = DocumentParser;
}
