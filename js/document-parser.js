// Smart Document Parser
// Extracts compliance-relevant information from uploaded documents
// Works entirely client-side with no backend required

const DocumentParser = {
    config: {
        version: "1.0.0",
        maxFileSize: 10 * 1024 * 1024, // 10MB
        supportedTypes: {
            'application/pdf': 'PDF',
            'text/plain': 'Text',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
            'text/csv': 'CSV',
            'application/json': 'JSON'
        }
    },

    // Control-related keywords for intelligent extraction
    keywords: {
        accessControl: ['access control', 'authentication', 'authorization', 'mfa', 'multi-factor', 'password', 'login', 'credential'],
        audit: ['audit', 'logging', 'log', 'monitoring', 'siem', 'event', 'tracking'],
        encryption: ['encryption', 'encrypted', 'tls', 'ssl', 'https', 'cipher', 'cryptographic'],
        incident: ['incident', 'breach', 'response', 'detection', 'alert', 'security event'],
        backup: ['backup', 'recovery', 'restore', 'disaster recovery', 'business continuity'],
        configuration: ['configuration', 'baseline', 'hardening', 'settings', 'policy'],
        vulnerability: ['vulnerability', 'patch', 'update', 'cve', 'scanning', 'assessment'],
        training: ['training', 'awareness', 'education', 'phishing', 'security awareness']
    },

    init: function() {
        this.bindEvents();
        console.log('[DocumentParser] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('change', (e) => {
            if (e.target.id === 'document-upload-input') {
                this.handleFileUpload(e.target.files);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('#open-document-parser-btn')) {
                this.showParserModal();
            }
            if (e.target.closest('#parse-documents-btn')) {
                this.parseUploadedDocuments();
            }
        });

        // Drag and drop support
        document.addEventListener('dragover', (e) => {
            const dropZone = e.target.closest('.document-drop-zone');
            if (dropZone) {
                e.preventDefault();
                dropZone.classList.add('drag-over');
            }
        });

        document.addEventListener('dragleave', (e) => {
            const dropZone = e.target.closest('.document-drop-zone');
            if (dropZone) {
                dropZone.classList.remove('drag-over');
            }
        });

        document.addEventListener('drop', (e) => {
            const dropZone = e.target.closest('.document-drop-zone');
            if (dropZone) {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
                this.handleFileUpload(e.dataTransfer.files);
            }
        });
    },

    showParserModal: function() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay document-parser-modal';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2>📄 Smart Document Parser</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="parser-container">
                        <div class="document-drop-zone" onclick="document.getElementById('document-upload-input').click()">
                            <input type="file" id="document-upload-input" multiple accept=".pdf,.txt,.docx,.csv,.json" style="display: none;">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                <polyline points="17 8 12 3 7 8"/>
                                <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                            <h3>Drop documents here or click to upload</h3>
                            <p>Supports PDF, TXT, DOCX, CSV, JSON (max 10MB)</p>
                        </div>
                        <div id="uploaded-files-list" class="uploaded-files-list"></div>
                        <div id="parsing-results" class="parsing-results"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                    <button class="btn-primary" id="parse-documents-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="M21 21l-4.35-4.35"/>
                        </svg>
                        Parse Documents
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    uploadedFiles: [],

    handleFileUpload: function(files) {
        const filesList = document.getElementById('uploaded-files-list');
        if (!filesList) return;

        Array.from(files).forEach(file => {
            if (file.size > this.config.maxFileSize) {
                this.showToast(`File ${file.name} is too large (max 10MB)`, 'error');
                return;
            }

            if (!this.config.supportedTypes[file.type]) {
                this.showToast(`File type ${file.type} not supported`, 'error');
                return;
            }

            this.uploadedFiles.push(file);

            const fileCard = document.createElement('div');
            fileCard.className = 'uploaded-file-card';
            fileCard.innerHTML = `
                <div class="file-icon">📄</div>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-meta">${this.formatFileSize(file.size)} • ${this.config.supportedTypes[file.type]}</div>
                </div>
                <button class="btn-icon" onclick="DocumentParser.removeFile('${file.name}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            `;

            filesList.appendChild(fileCard);
        });
    },

    removeFile: function(fileName) {
        this.uploadedFiles = this.uploadedFiles.filter(f => f.name !== fileName);
        const filesList = document.getElementById('uploaded-files-list');
        if (filesList) {
            filesList.innerHTML = '';
            this.uploadedFiles.forEach(file => {
                // Re-render remaining files
                const fileCard = document.createElement('div');
                fileCard.className = 'uploaded-file-card';
                fileCard.innerHTML = `
                    <div class="file-icon">📄</div>
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-meta">${this.formatFileSize(file.size)} • ${this.config.supportedTypes[file.type]}</div>
                    </div>
                    <button class="btn-icon" onclick="DocumentParser.removeFile('${file.name}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                `;
                filesList.appendChild(fileCard);
            });
        }
    },

    async parseUploadedDocuments() {
        if (this.uploadedFiles.length === 0) {
            this.showToast('No files to parse', 'error');
            return;
        }

        const resultsContainer = document.getElementById('parsing-results');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = '<div class="parsing-loading"><div class="spinner"></div><p>Parsing documents...</p></div>';

        const results = [];

        for (const file of this.uploadedFiles) {
            try {
                const content = await this.readFileContent(file);
                const analysis = this.analyzeContent(content, file.name);
                results.push({
                    fileName: file.name,
                    fileType: this.config.supportedTypes[file.type],
                    analysis: analysis
                });
            } catch (error) {
                console.error(`Error parsing ${file.name}:`, error);
                results.push({
                    fileName: file.name,
                    error: error.message
                });
            }
        }

        this.displayResults(results);

        // Log activity
        if (typeof CollaborationManager !== 'undefined') {
            CollaborationManager.logActivity('document_parsed', `Parsed ${results.length} documents`);
        }
    },

    readFileContent: function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            // For text-based files
            if (file.type === 'text/plain' || file.type === 'text/csv' || file.type === 'application/json') {
                reader.readAsText(file);
            } else {
                // For binary files (PDF, DOCX), read as text for now
                // In production, you'd use pdf.js or mammoth.js
                reader.readAsText(file);
            }
        });
    },

    analyzeContent: function(content, fileName) {
        const analysis = {
            wordCount: content.split(/\s+/).length,
            characterCount: content.length,
            detectedControls: [],
            extractedEvidence: [],
            recommendations: []
        };

        // Detect control families mentioned
        Object.keys(this.keywords).forEach(category => {
            const keywords = this.keywords[category];
            const mentions = keywords.filter(keyword => 
                content.toLowerCase().includes(keyword.toLowerCase())
            );

            if (mentions.length > 0) {
                analysis.detectedControls.push({
                    category: category,
                    keywords: mentions,
                    relevance: mentions.length
                });
            }
        });

        // Extract potential evidence snippets
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            // Look for policy statements, procedures, or configurations
            if (line.match(/policy|procedure|configuration|requirement|control/i)) {
                if (line.length > 20 && line.length < 200) {
                    analysis.extractedEvidence.push({
                        lineNumber: index + 1,
                        snippet: line.trim(),
                        type: this.classifyEvidence(line)
                    });
                }
            }
        });

        // Generate recommendations
        if (analysis.detectedControls.length > 0) {
            analysis.recommendations.push({
                type: 'mapping',
                message: `Document contains evidence relevant to ${analysis.detectedControls.length} control categories`
            });
        }

        if (analysis.extractedEvidence.length > 5) {
            analysis.recommendations.push({
                type: 'evidence',
                message: `Found ${analysis.extractedEvidence.length} potential evidence items - review for compliance mapping`
            });
        }

        return analysis;
    },

    classifyEvidence: function(text) {
        if (text.match(/policy/i)) return 'Policy';
        if (text.match(/procedure/i)) return 'Procedure';
        if (text.match(/configuration|setting/i)) return 'Configuration';
        if (text.match(/log|audit/i)) return 'Audit Log';
        return 'General';
    },

    displayResults: function(results) {
        const resultsContainer = document.getElementById('parsing-results');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `
            <div class="parsing-results-header">
                <h3>📊 Parsing Results</h3>
                <p>Analyzed ${results.length} document${results.length > 1 ? 's' : ''}</p>
            </div>
            <div class="results-list">
                ${results.map(result => this.renderResult(result)).join('')}
            </div>
        `;
    },

    renderResult: function(result) {
        if (result.error) {
            return `
                <div class="result-card error">
                    <h4>${result.fileName}</h4>
                    <p class="error-message">Error: ${result.error}</p>
                </div>
            `;
        }

        const analysis = result.analysis;

        return `
            <div class="result-card">
                <div class="result-header">
                    <h4>${result.fileName}</h4>
                    <span class="file-type-badge">${result.fileType}</span>
                </div>
                <div class="result-stats">
                    <div class="stat">
                        <span class="stat-value">${analysis.wordCount}</span>
                        <span class="stat-label">Words</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${analysis.detectedControls.length}</span>
                        <span class="stat-label">Control Categories</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${analysis.extractedEvidence.length}</span>
                        <span class="stat-label">Evidence Items</span>
                    </div>
                </div>
                ${analysis.detectedControls.length > 0 ? `
                    <div class="detected-controls">
                        <h5>Detected Control Categories:</h5>
                        <div class="control-tags">
                            ${analysis.detectedControls.map(ctrl => `
                                <span class="control-tag">${ctrl.category} (${ctrl.relevance})</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                ${analysis.extractedEvidence.length > 0 ? `
                    <div class="extracted-evidence">
                        <h5>Sample Evidence (showing first 5):</h5>
                        ${analysis.extractedEvidence.slice(0, 5).map(ev => `
                            <div class="evidence-item">
                                <span class="evidence-type">${ev.type}</span>
                                <span class="evidence-snippet">${ev.snippet}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                ${analysis.recommendations.length > 0 ? `
                    <div class="recommendations">
                        ${analysis.recommendations.map(rec => `
                            <div class="recommendation-item">
                                <span class="rec-icon">💡</span>
                                <span>${rec.message}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    },

    formatFileSize: function(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },

    showToast: function(message, type = 'info') {
        if (typeof app !== 'undefined' && app.showToast) {
            app.showToast(message, type);
        } else {
            console.log(`[DocumentParser] ${type}: ${message}`);
        }
    }
};

// Initialize
if (typeof document !== 'undefined') {
    document.readyState === 'loading' ? 
        document.addEventListener('DOMContentLoaded', () => DocumentParser.init()) : 
        DocumentParser.init();
}

if (typeof window !== 'undefined') {
    window.DocumentParser = DocumentParser;
}
