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
            // Link evidence button
            if (e.target.closest('.link-evidence-btn')) {
                const objectiveId = e.target.closest('.link-evidence-btn').dataset.objectiveId;
                this.showLinkEvidenceModal(objectiveId);
            }

            // Save evidence links
            if (e.target.closest('#save-evidence-links-btn')) {
                this.saveEvidenceLinks();
            }

            // Open implementation details
            if (e.target.closest('.open-impl-details-btn')) {
                const objectiveId = e.target.closest('.open-impl-details-btn').dataset.objectiveId;
                this.showImplementationDetailsModal(objectiveId);
            }

            // Save implementation details
            if (e.target.closest('#save-impl-details-btn')) {
                this.saveImplementationDetails();
            }

            // Implementation status change
            if (e.target.closest('.impl-status-select')) {
                const select = e.target.closest('.impl-status-select');
                const objectiveId = select.dataset.objectiveId;
                this.updateImplementationStatus(objectiveId, select.value);
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
                linkedEvidence: [],
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

    showLinkEvidenceModal: function(objectiveId) {
        const data = this.getEnhancedData(objectiveId);
        const evidenceLibrary = this.getEvidenceLibrary();
        
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>Link Evidence to ${objectiveId}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 16px; color: var(--text-secondary);">
                        Select evidence items to link to this objective. Linked evidence will be included in assessment reports.
                    </p>
                    <div class="evidence-selection-list">
                        ${Object.keys(evidenceLibrary).length === 0 ? 
                            '<p style="color: var(--text-muted); text-align: center; padding: 20px;">No evidence items in library. Add evidence first.</p>' :
                            Object.entries(evidenceLibrary).map(([id, item]) => `
                                <label class="evidence-selection-item">
                                    <input type="checkbox" 
                                           class="evidence-checkbox" 
                                           value="${id}"
                                           ${data.linkedEvidence.includes(id) ? 'checked' : ''}>
                                    <div class="evidence-item-info">
                                        <div class="evidence-item-title">${item.title}</div>
                                        <div class="evidence-item-meta">
                                            <span class="evidence-type-badge ${item.type}">${item.type}</span>
                                            <span class="evidence-date">${new Date(item.dateAdded).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </label>
                            `).join('')
                        }
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-backdrop').remove()">Cancel</button>
                    <button class="btn-primary" id="save-evidence-links-btn" data-objective-id="${objectiveId}">Save Links</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    saveEvidenceLinks: function() {
        const btn = document.getElementById('save-evidence-links-btn');
        const objectiveId = btn.dataset.objectiveId;
        const checkboxes = document.querySelectorAll('.evidence-checkbox:checked');
        const linkedEvidence = Array.from(checkboxes).map(cb => cb.value);
        
        const data = this.getEnhancedData(objectiveId);
        data.linkedEvidence = linkedEvidence;
        data.lastUpdated = Date.now();
        data.updatedBy = localStorage.getItem('nist-user-name') || 'Unknown';
        this.saveToStorage();
        
        // Close modal
        btn.closest('.modal-backdrop').remove();
        
        // Update UI
        this.updateEvidenceBadge(objectiveId);
        this.showToast(`Linked ${linkedEvidence.length} evidence item(s) to ${objectiveId}`, 'success');
    },

    showImplementationDetailsModal: function(objectiveId) {
        const data = this.getEnhancedData(objectiveId);
        
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>Implementation Details - ${objectiveId}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="impl-details-tabs">
                        <button class="impl-tab active" data-tab="implementation">Implementation</button>
                        <button class="impl-tab" data-tab="evidence">Evidence</button>
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
                        <div class="linked-evidence-list">
                            ${this.renderLinkedEvidence(data.linkedEvidence)}
                        </div>
                        <button class="btn-secondary" onclick="AssessmentEnhancements.showLinkEvidenceModal('${objectiveId}'); this.closest('.modal-backdrop').remove();">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                            Link Evidence
                        </button>
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
                    <button class="btn-secondary" onclick="this.closest('.modal-backdrop').remove()">Cancel</button>
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
        
        // Update UI
        this.updateImplementationBadge(objectiveId);
        this.showToast('Implementation details saved', 'success');
    },

    renderLinkedEvidence: function(linkedEvidenceIds) {
        if (linkedEvidenceIds.length === 0) {
            return '<p style="color: var(--text-muted); text-align: center; padding: 20px;">No evidence linked yet</p>';
        }
        
        const evidenceLibrary = this.getEvidenceLibrary();
        return linkedEvidenceIds.map(id => {
            const item = evidenceLibrary[id];
            if (!item) return '';
            
            return `
                <div class="linked-evidence-item">
                    <div class="evidence-item-info">
                        <div class="evidence-item-title">${item.title}</div>
                        <div class="evidence-item-meta">
                            <span class="evidence-type-badge ${item.type}">${item.type}</span>
                            <span class="evidence-date">${new Date(item.dateAdded).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    getEvidenceLibrary: function() {
        const saved = localStorage.getItem('nist-evidence-library');
        return saved ? JSON.parse(saved) : {};
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
        if (data.linkedEvidence.length > 0) {
            badge.textContent = `${data.linkedEvidence.length} evidence`;
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
