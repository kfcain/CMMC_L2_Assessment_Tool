// Assessment Enhancements Module
// Adds implementation maturity tracking, evidence linking, and detailed notes
// Works entirely with localStorage

const AssessmentEnhancements = {
    config: {
        version: "1.0.0",
        storageKey: "nist-assessment-enhanced",
        implementationLevels: {
            implemented: { label: "Implemented", color: "#10b981", description: "Fully operational with evidence" },
            partial: { label: "Partially Implemented", color: "#f59e0b", description: "In progress, some gaps remain" },
            planned: { label: "Planned", color: "#3b82f6", description: "Documented plan, not yet started" },
            na: { label: "Not Applicable", color: "#6b7280", description: "Justified exclusion with documentation" }
        }
    },

    enhancedData: {},

    init: function() {
        this.loadEnhancedData();
        this.bindEvents();
        console.log('[AssessmentEnhancements] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            try {
                // Manage evidence button
                if (e.target.closest('.link-evidence-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const objectiveId = e.target.closest('.link-evidence-btn').dataset.objectiveId;
                    console.log('[AssessmentEnhancements] Manage evidence clicked for:', objectiveId);
                    this.showManageEvidenceModal(objectiveId);
                }

                // Add evidence
                if (e.target.closest('#add-evidence-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const objectiveId = e.target.closest('#add-evidence-btn').dataset.objectiveId;
                    console.log('[AssessmentEnhancements] Adding evidence for:', objectiveId);
                    this.addEvidence(objectiveId);
                }

                // Delete evidence
                if (e.target.closest('.delete-evidence-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const evidenceId = e.target.closest('.delete-evidence-btn').dataset.evidenceId;
                    const objectiveId = e.target.closest('.delete-evidence-btn').dataset.objectiveId;
                    console.log('[AssessmentEnhancements] Deleting evidence:', evidenceId);
                    this.deleteEvidence(objectiveId, evidenceId);
                }

                // Open implementation details
                if (e.target.closest('.open-impl-details-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const objectiveId = e.target.closest('.open-impl-details-btn').dataset.objectiveId;
                    console.log('[AssessmentEnhancements] Implementation details clicked for:', objectiveId);
                    this.showImplementationDetailsModal(objectiveId);
                }

                // Save implementation details
                if (e.target.closest('#save-impl-details-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[AssessmentEnhancements] Saving implementation details');
                    this.saveImplementationDetails();
                }

                // Implementation status change
                if (e.target.closest('.impl-status-select')) {
                    const select = e.target.closest('.impl-status-select');
                    const objectiveId = select.dataset.objectiveId;
                    console.log('[AssessmentEnhancements] Status changed for:', objectiveId);
                    this.updateImplementationStatus(objectiveId, select.value);
                }
            } catch (error) {
                console.error('[AssessmentEnhancements] Error in click handler:', error);
            }
        });

        // Auto-save notes on blur
        document.addEventListener('blur', (e) => {
            if (e.target.classList.contains('impl-notes-textarea')) {
                const objectiveId = e.target.dataset.objectiveId;
                const notes = e.target.value;
                this.updateNotes(objectiveId, 'implementation', notes);
            }
            if (e.target.classList.contains('assessor-notes-textarea')) {
                const objectiveId = e.target.dataset.objectiveId;
                const notes = e.target.value;
                this.updateNotes(objectiveId, 'assessor', notes);
            }
        }, true);
    },

    loadEnhancedData: function() {
        const saved = localStorage.getItem(this.config.storageKey);
        this.enhancedData = saved ? JSON.parse(saved) : {};
    },

    saveToStorage: function() {
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.enhancedData));
    },

    getEnhancedData: function(objectiveId) {
        if (!this.enhancedData[objectiveId]) {
            this.enhancedData[objectiveId] = {
                implementationStatus: null,
                evidence: [], // Array of evidence items directly attached to this AO
                implementationNotes: '',
                assessorNotes: '',
                lastUpdated: Date.now(),
                updatedBy: localStorage.getItem('nist-user-name') || 'Unknown'
            };
        }
        return this.enhancedData[objectiveId];
    },

    updateImplementationStatus: function(objectiveId, status) {
        const data = this.getEnhancedData(objectiveId);
        data.implementationStatus = status;
        data.lastUpdated = Date.now();
        data.updatedBy = localStorage.getItem('nist-user-name') || 'Unknown';
        this.saveToStorage();
        
        // Update UI badge
        this.updateImplementationBadge(objectiveId);
    },

    updateNotes: function(objectiveId, type, notes) {
        const data = this.getEnhancedData(objectiveId);
        if (type === 'implementation') {
            data.implementationNotes = notes;
        } else if (type === 'assessor') {
            data.assessorNotes = notes;
        }
        data.lastUpdated = Date.now();
        data.updatedBy = localStorage.getItem('nist-user-name') || 'Unknown';
        this.saveToStorage();
    },

    showManageEvidenceModal: function(objectiveId) {
        const data = this.getEnhancedData(objectiveId);
        
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.id = 'evidence-modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>Manage Evidence - ${objectiveId}</h2>
                    <button class="modal-close" data-action="close-backdrop">×</button>
                </div>
                <div class="modal-body">
                    <div class="evidence-summary">
                        <div class="evidence-count">
                            <strong>${data.evidence.length}</strong> evidence item(s)
                        </div>
                        <div class="evidence-types">
                            ${this.getEvidenceTypeSummary(data.evidence)}
                        </div>
                    </div>
                    
                    <div class="evidence-add-section">
                        <h3>Add Evidence</h3>
                        <div class="form-group">
                            <label>Evidence Title</label>
                            <input type="text" id="evidence-title" class="form-control" placeholder="e.g., Access Control Policy Document">
                        </div>
                        <div class="form-group">
                            <label>Evidence Type</label>
                            <select id="evidence-type" class="form-control">
                                <option value="document">Document</option>
                                <option value="screenshot">Screenshot</option>
                                <option value="log">Log File</option>
                                <option value="configuration">Configuration File</option>
                                <option value="policy">Policy/Procedure</option>
                                <option value="certificate">Certificate</option>
                                <option value="report">Report</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea id="evidence-description" class="form-control" rows="2" placeholder="Brief description of the evidence..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Upload File (optional)</label>
                            <input type="file" id="evidence-file-upload" class="form-control" accept=".pdf,.txt,.docx,.html,.json,.yaml,.png,.jpg,.jpeg,.gif">
                            <small style="color: var(--text-muted); margin-top: 4px; display: block;">
                                Documents (PDF, Word, Text, HTML) will be auto-converted to markdown for AI assessment.
                                JSON, YAML, and screenshots will be stored as-is.
                            </small>
                        </div>
                        <div class="form-group">
                            <label>Or File Reference/URL</label>
                            <input type="text" id="evidence-file-ref" class="form-control" placeholder="e.g., evidence/AC-001.pdf or https://...">
                        </div>
                        <button class="btn-primary" id="add-evidence-btn" data-objective-id="${objectiveId}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Add Evidence
                        </button>
                    </div>
                    
                    <div class="evidence-list-section">
                        <h3>Evidence Items</h3>
                        <div id="evidence-items-list">
                            ${this.renderEvidenceList(objectiveId, data.evidence)}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" data-action="close-backdrop">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    async addEvidence(objectiveId) {
        const title = document.getElementById('evidence-title').value.trim();
        const type = document.getElementById('evidence-type').value;
        const description = document.getElementById('evidence-description').value.trim();
        const fileRef = document.getElementById('evidence-file-ref').value.trim();
        const fileInput = document.getElementById('evidence-file-upload');
        const file = fileInput?.files[0];
        
        if (!title) {
            this.showToast('Please enter an evidence title', 'error');
            return;
        }
        
        const data = this.getEnhancedData(objectiveId);
        const evidenceItem = {
            id: Date.now().toString(),
            title: title,
            type: type,
            description: description,
            fileReference: fileRef,
            dateAdded: Date.now(),
            addedBy: localStorage.getItem('nist-user-name') || 'Unknown',
            documentId: null,
            hasMarkdown: false
        };
        
        // Process uploaded file if present
        if (file && typeof DocumentConverter !== 'undefined') {
            try {
                this.showToast('Processing file...', 'info');
                const processedDoc = await DocumentConverter.processFile(file, objectiveId);
                evidenceItem.documentId = processedDoc.id;
                evidenceItem.fileReference = processedDoc.fileName;
                evidenceItem.hasMarkdown = processedDoc.conversionStatus === 'converted';
                
                if (processedDoc.conversionStatus === 'converted') {
                    this.showToast(`File uploaded and converted to markdown for AI assessment`, 'success');
                } else if (processedDoc.conversionStatus === 'skipped') {
                    this.showToast(`File uploaded (${processedDoc.fileType} - no conversion needed)`, 'success');
                }
            } catch (error) {
                this.showToast(`File upload failed: ${error.message}`, 'error');
                return;
            }
        }
        
        data.evidence.push(evidenceItem);
        data.lastUpdated = Date.now();
        this.saveToStorage();
        
        // Clear form
        document.getElementById('evidence-title').value = '';
        document.getElementById('evidence-description').value = '';
        document.getElementById('evidence-file-ref').value = '';
        if (fileInput) fileInput.value = '';
        
        // Refresh evidence list
        document.getElementById('evidence-items-list').innerHTML = this.renderEvidenceList(objectiveId, data.evidence);
        
        // Update summary
        const summaryEl = document.querySelector('.evidence-count');
        if (summaryEl) {
            summaryEl.innerHTML = `<strong>${data.evidence.length}</strong> evidence item(s)`;
        }
        const typesEl = document.querySelector('.evidence-types');
        if (typesEl) {
            typesEl.innerHTML = this.getEvidenceTypeSummary(data.evidence);
        }
        
        // Update badge in main view
        this.updateEvidenceBadge(objectiveId);
        
        if (!file) {
            this.showToast('Evidence added successfully', 'success');
        }
    },

    deleteEvidence: function(objectiveId, evidenceId) {
        if (!confirm('Are you sure you want to delete this evidence item?')) {
            return;
        }
        
        const data = this.getEnhancedData(objectiveId);
        data.evidence = data.evidence.filter(e => e.id !== evidenceId);
        data.lastUpdated = Date.now();
        this.saveToStorage();
        
        // Refresh evidence list
        document.getElementById('evidence-items-list').innerHTML = this.renderEvidenceList(objectiveId, data.evidence);
        
        // Update summary
        const summaryEl = document.querySelector('.evidence-count');
        if (summaryEl) {
            summaryEl.innerHTML = `<strong>${data.evidence.length}</strong> evidence item(s)`;
        }
        const typesEl = document.querySelector('.evidence-types');
        if (typesEl) {
            typesEl.innerHTML = this.getEvidenceTypeSummary(data.evidence);
        }
        
        // Update badge in main view
        this.updateEvidenceBadge(objectiveId);
        
        this.showToast('Evidence deleted', 'success');
    },

    renderEvidenceList: function(objectiveId, evidence) {
        if (evidence.length === 0) {
            return '<p style="color: var(--text-muted); text-align: center; padding: 20px;">No evidence items yet. Add evidence above.</p>';
        }
        
        return evidence.map(item => `
            <div class="evidence-item">
                <div class="evidence-item-header">
                    <div class="evidence-item-title-row">
                        <span class="evidence-type-badge ${item.type}">${item.type}</span>
                        <strong>${item.title}</strong>
                        ${item.hasMarkdown ? '<span class="markdown-badge" title="Converted to markdown for AI assessment">📝 MD</span>' : ''}
                    </div>
                    <button class="delete-evidence-btn" data-evidence-id="${item.id}" data-objective-id="${objectiveId}" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
                ${item.description ? `<p class="evidence-description">${item.description}</p>` : ''}
                ${item.fileReference ? `<div class="evidence-file-ref"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg> ${item.fileReference}</div>` : ''}
                ${item.documentId ? `<div class="evidence-document-info"><span class="markdown-status">${item.hasMarkdown ? '✓ Converted to markdown for AI assessment' : 'ℹ️ Stored as-is (no conversion)'}</span></div>` : ''}
                <div class="evidence-meta">
                    Added by ${item.addedBy} on ${new Date(item.dateAdded).toLocaleDateString()}
                </div>
            </div>
        `).join('');
    },

    getEvidenceTypeSummary: function(evidence) {
        if (evidence.length === 0) {
            return '<span style="color: var(--text-muted);">No evidence</span>';
        }
        
        const typeCounts = {};
        evidence.forEach(item => {
            typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
        });
        
        return Object.entries(typeCounts)
            .map(([type, count]) => `<span class="evidence-type-badge ${type}">${count} ${type}</span>`)
            .join(' ');
    },

    showImplementationDetailsModal: function(objectiveId) {
        const data = this.getEnhancedData(objectiveId);
        
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>Implementation Details - ${objectiveId}</h2>
                    <button class="modal-close" data-action="close-backdrop">×</button>
                </div>
                <div class="modal-body">
                    <div class="impl-details-tabs">
                        <button class="impl-tab active" data-tab="implementation">Implementation</button>
                        <button class="impl-tab" data-tab="evidence">Evidence</button>
                        <button class="impl-tab" data-tab="meeting-evidence">Transcript Evidence${typeof MeetingNotesIntegration !== 'undefined' ? (' <span class="mn-tab-count">' + MeetingNotesIntegration.getQuoteCount(objectiveId) + '</span>') : ''}</button>
                        <button class="impl-tab" data-tab="assessor">Assessor Notes</button>
                    </div>
                    
                    <div class="impl-tab-content active" data-tab-content="implementation">
                        <div class="form-group">
                            <label>Implementation Status</label>
                            <select class="form-control impl-status-modal-select" data-objective-id="${objectiveId}">
                                <option value="">Not Set</option>
                                <option value="implemented" ${data.implementationStatus === 'implemented' ? 'selected' : ''}>Implemented</option>
                                <option value="partial" ${data.implementationStatus === 'partial' ? 'selected' : ''}>Partially Implemented</option>
                                <option value="planned" ${data.implementationStatus === 'planned' ? 'selected' : ''}>Planned</option>
                                <option value="na" ${data.implementationStatus === 'na' ? 'selected' : ''}>Not Applicable</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Implementation Description</label>
                            <textarea class="form-control impl-notes-modal-textarea" 
                                      data-objective-id="${objectiveId}"
                                      rows="8"
                                      placeholder="Describe how this objective is implemented in your environment...">${data.implementationNotes || ''}</textarea>
                            <small style="color: var(--text-muted);">Describe technical details, tools used, configurations, etc.</small>
                        </div>
                    </div>
                    
                    <div class="impl-tab-content" data-tab-content="evidence">
                        <div class="evidence-summary" style="margin-bottom: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <strong>${data.evidence.length}</strong> evidence item(s)
                                </div>
                                <button class="btn-secondary" data-action="ae-manage-evidence" data-param="${objectiveId}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                    Manage Evidence
                                </button>
                            </div>
                            <div style="margin-top: 8px;">
                                ${this.getEvidenceTypeSummary(data.evidence)}
                            </div>
                        </div>
                        <div class="evidence-list">
                            ${this.renderEvidenceList(objectiveId, data.evidence)}
                        </div>
                    </div>
                    
                    <div class="impl-tab-content" data-tab-content="meeting-evidence">
                        ${typeof MeetingNotesIntegration !== 'undefined' ? MeetingNotesIntegration.renderObjectivePanel(objectiveId) : '<p style="color:var(--text-muted);text-align:center;padding:20px;">Meeting Notes module not loaded.</p>'}
                    </div>
                    
                    <div class="impl-tab-content" data-tab-content="assessor">
                        <div class="form-group">
                            <label>Assessor Comments</label>
                            <textarea class="form-control assessor-notes-modal-textarea" 
                                      data-objective-id="${objectiveId}"
                                      rows="8"
                                      placeholder="Assessor observations, findings, recommendations...">${data.assessorNotes || ''}</textarea>
                            <small style="color: var(--text-muted);">Internal notes for assessment team only</small>
                        </div>
                    </div>
                    
                    <div class="impl-meta">
                        <small style="color: var(--text-muted);">
                            Last updated: ${data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'Never'} 
                            by ${data.updatedBy}
                        </small>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" data-action="close-backdrop">Cancel</button>
                    <button class="btn-primary" id="save-impl-details-btn" data-objective-id="${objectiveId}">Save Details</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Tab switching
        modal.querySelectorAll('.impl-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                modal.querySelectorAll('.impl-tab').forEach(t => t.classList.remove('active'));
                modal.querySelectorAll('.impl-tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                modal.querySelector(`[data-tab-content="${tab.dataset.tab}"]`).classList.add('active');
            });
        });

        // Bind Meeting Notes Integration events
        if (typeof MeetingNotesIntegration !== 'undefined') {
            const mnPanel = modal.querySelector('.mn-objective-panel');
            if (mnPanel) {
                MeetingNotesIntegration.bindObjectivePanelEvents(mnPanel, objectiveId);
            }
        }
    },

    saveImplementationDetails: function() {
        const btn = document.getElementById('save-impl-details-btn');
        const objectiveId = btn.dataset.objectiveId;
        const modal = btn.closest('.modal-content');
        
        const status = modal.querySelector('.impl-status-modal-select').value;
        const implNotes = modal.querySelector('.impl-notes-modal-textarea').value;
        const assessorNotes = modal.querySelector('.assessor-notes-modal-textarea').value;
        
        const data = this.getEnhancedData(objectiveId);
        data.implementationStatus = status;
        data.implementationNotes = implNotes;
        data.assessorNotes = assessorNotes;
        data.lastUpdated = Date.now();
        data.updatedBy = localStorage.getItem('nist-user-name') || 'Unknown';
        this.saveToStorage();
        
        // Close modal
        btn.closest('.modal-backdrop').remove();
        
        this.showToast('Implementation details saved', 'success');
    },

    updateImplementationBadge: function(objectiveId) {
        const badge = document.querySelector(`.impl-status-badge[data-objective-id="${objectiveId}"]`);
        if (!badge) return;
        
        const data = this.getEnhancedData(objectiveId);
        if (data.implementationStatus) {
            const level = this.config.implementationLevels[data.implementationStatus];
            badge.textContent = level.label;
            badge.style.background = level.color;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    },

    updateEvidenceBadge: function(objectiveId) {
        const badge = document.querySelector(`.evidence-count-badge[data-objective-id="${objectiveId}"]`);
        if (!badge) return;
        
        const data = this.getEnhancedData(objectiveId);
        if (data.evidence.length > 0) {
            // Get type counts
            const typeCounts = {};
            data.evidence.forEach(item => {
                typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
            });
            
            // Create summary text
            const typeText = Object.entries(typeCounts)
                .map(([type, count]) => `${count} ${type}`)
                .join(', ');
            
            badge.textContent = `${data.evidence.length} evidence`;
            badge.title = typeText;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    },

    showToast: function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Export enhanced data for reporting
    exportEnhancedData: function() {
        return {
            exportDate: new Date().toISOString(),
            objectives: this.enhancedData
        };
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AssessmentEnhancements.init());
} else {
    AssessmentEnhancements.init();
}
