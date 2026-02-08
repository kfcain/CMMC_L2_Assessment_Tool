// Evidence Collection & Management System
// Organizes and links evidence to specific controls
// Works entirely with localStorage

const EvidenceCollector = {
    config: {
        version: "1.0.0",
        storageKey: "nist-evidence-library"
    },

    evidenceLibrary: {},

    init: function() {
        this.loadEvidence();
        this.bindEvents();
        console.log('[EvidenceCollector] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#open-evidence-library-btn')) {
                this.showEvidenceLibrary();
            }
            if (e.target.closest('#add-evidence-btn')) {
                this.showAddEvidenceModal();
            }
            if (e.target.closest('#save-evidence-btn')) {
                this.saveEvidence();
            }
            if (e.target.closest('.link-evidence-btn')) {
                const objectiveId = e.target.closest('.link-evidence-btn').dataset.objectiveId;
                this.showLinkEvidenceModal(objectiveId);
            }
            if (e.target.closest('.view-evidence-btn')) {
                const evidenceId = e.target.closest('.view-evidence-btn').dataset.evidenceId;
                this.viewEvidence(evidenceId);
            }
            if (e.target.closest('.delete-evidence-btn')) {
                const evidenceId = e.target.closest('.delete-evidence-btn').dataset.evidenceId;
                this.deleteEvidence(evidenceId);
            }
        });
    },

    loadEvidence: function() {
        const saved = localStorage.getItem(this.config.storageKey);
        this.evidenceLibrary = saved ? JSON.parse(saved) : {};
    },

    saveToStorage: function() {
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.evidenceLibrary));
    },

    showEvidenceLibrary: function() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay evidence-library-modal';
        modal.innerHTML = `
            <div class="modal-content modal-xlarge">
                <div class="modal-header">
                    <h2>📚 Evidence Library</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="evidence-library-container">
                        <div class="library-header">
                            <div class="library-stats">
                                <div class="stat-card">
                                    <span class="stat-value">${Object.keys(this.evidenceLibrary).length}</span>
                                    <span class="stat-label">Total Items</span>
                                </div>
                                <div class="stat-card">
                                    <span class="stat-value">${this.countByType('document')}</span>
                                    <span class="stat-label">Documents</span>
                                </div>
                                <div class="stat-card">
                                    <span class="stat-value">${this.countByType('screenshot')}</span>
                                    <span class="stat-label">Screenshots</span>
                                </div>
                                <div class="stat-card">
                                    <span class="stat-value">${this.countByType('policy')}</span>
                                    <span class="stat-label">Policies</span>
                                </div>
                            </div>
                            <button class="btn-primary" id="add-evidence-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"/>
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                                Add Evidence
                            </button>
                        </div>
                        <div class="evidence-grid">
                            ${this.renderEvidenceGrid()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    countByType: function(type) {
        return Object.values(this.evidenceLibrary).filter(e => e.type === type).length;
    },

    renderEvidenceGrid: function() {
        const items = Object.entries(this.evidenceLibrary);

        if (items.length === 0) {
            return `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/>
                        <polyline points="13 2 13 9 20 9"/>
                    </svg>
                    <h3>No Evidence Yet</h3>
                    <p>Start by adding documents, screenshots, or policy references</p>
                    <button class="btn-primary" id="add-evidence-btn">Add First Evidence</button>
                </div>
            `;
        }

        return items.map(([id, evidence]) => `
            <div class="evidence-card" data-evidence-id="${id}">
                <div class="evidence-icon">${this.getEvidenceIcon(evidence.type)}</div>
                <div class="evidence-info">
                    <h4>${evidence.title}</h4>
                    <p class="evidence-description">${evidence.description || 'No description'}</p>
                    <div class="evidence-meta">
                        <span class="evidence-type">${evidence.type}</span>
                        ${evidence.linkedControls ? `<span class="linked-count">${evidence.linkedControls.length} controls</span>` : ''}
                        <span class="evidence-date">${new Date(evidence.dateAdded).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="evidence-actions">
                    <button class="btn-icon view-evidence-btn" data-evidence-id="${id}" title="View">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                    <button class="btn-icon delete-evidence-btn" data-evidence-id="${id}" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    },

    getEvidenceIcon: function(type) {
        const icons = {
            document: '📄',
            screenshot: '📸',
            policy: '📋',
            configuration: '⚙️',
            log: '📊',
            other: '📎'
        };
        return icons[type] || icons.other;
    },

    showAddEvidenceModal: function() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay add-evidence-modal';
        modal.innerHTML = `
            <div class="modal-content modal-medium">
                <div class="modal-header">
                    <h2>➕ Add Evidence</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <form id="add-evidence-form">
                        <div class="form-group">
                            <label>Title *</label>
                            <input type="text" id="evidence-title" class="form-input" required placeholder="e.g., MFA Configuration Policy">
                        </div>
                        <div class="form-group">
                            <label>Type *</label>
                            <select id="evidence-type" class="form-select" required>
                                <option value="">Select type...</option>
                                <option value="document">Document</option>
                                <option value="screenshot">Screenshot</option>
                                <option value="policy">Policy</option>
                                <option value="configuration">Configuration</option>
                                <option value="log">Log/Audit</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea id="evidence-description" class="form-textarea" rows="3" placeholder="Brief description of the evidence..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>File/URL</label>
                            <input type="text" id="evidence-url" class="form-input" placeholder="File path or URL to evidence">
                        </div>
                        <div class="form-group">
                            <label>Link to Controls (optional)</label>
                            <input type="text" id="evidence-controls" class="form-input" placeholder="e.g., 3.5.3, 3.5.7">
                            <small>Comma-separated control IDs</small>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button class="btn-primary" id="save-evidence-btn">Save Evidence</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    saveEvidence: function() {
        const title = document.getElementById('evidence-title')?.value;
        const type = document.getElementById('evidence-type')?.value;
        const description = document.getElementById('evidence-description')?.value;
        const url = document.getElementById('evidence-url')?.value;
        const controlsInput = document.getElementById('evidence-controls')?.value;

        if (!title || !type) {
            this.showToast('Title and type are required', 'error');
            return;
        }

        const evidenceId = `evidence_${Date.now()}`;
        const linkedControls = controlsInput ? 
            controlsInput.split(',').map(c => c.trim()).filter(c => c) : [];

        this.evidenceLibrary[evidenceId] = {
            id: evidenceId,
            title: title,
            type: type,
            description: description,
            url: url,
            linkedControls: linkedControls,
            dateAdded: new Date().toISOString(),
            addedBy: this.getCurrentUser()
        };

        this.saveToStorage();

        // Close modal and refresh library
        document.querySelector('.add-evidence-modal')?.remove();
        document.querySelector('.evidence-library-modal')?.remove();
        this.showEvidenceLibrary();

        this.showToast('Evidence added successfully', 'success');

        // Log activity
        if (typeof CollaborationManager !== 'undefined') {
            CollaborationManager.logActivity('evidence_added', `Added evidence: ${title}`);
        }
    },

    viewEvidence: function(evidenceId) {
        const evidence = this.evidenceLibrary[evidenceId];
        if (!evidence) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay view-evidence-modal';
        modal.innerHTML = `
            <div class="modal-content modal-medium">
                <div class="modal-header">
                    <h2>${this.getEvidenceIcon(evidence.type)} ${evidence.title}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="evidence-details">
                        <div class="detail-row">
                            <span class="detail-label">Type:</span>
                            <span class="detail-value">${evidence.type}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Date Added:</span>
                            <span class="detail-value">${new Date(evidence.dateAdded).toLocaleString()}</span>
                        </div>
                        ${evidence.addedBy ? `
                            <div class="detail-row">
                                <span class="detail-label">Added By:</span>
                                <span class="detail-value">${evidence.addedBy}</span>
                            </div>
                        ` : ''}
                        ${evidence.description ? `
                            <div class="detail-row">
                                <span class="detail-label">Description:</span>
                                <span class="detail-value">${evidence.description}</span>
                            </div>
                        ` : ''}
                        ${evidence.url ? `
                            <div class="detail-row">
                                <span class="detail-label">Location:</span>
                                <span class="detail-value"><a href="${evidence.url}" target="_blank" rel="noopener noreferrer">${evidence.url}</a></span>
                            </div>
                        ` : ''}
                        ${evidence.linkedControls && evidence.linkedControls.length > 0 ? `
                            <div class="detail-row">
                                <span class="detail-label">Linked Controls:</span>
                                <div class="linked-controls-list">
                                    ${evidence.linkedControls.map(ctrl => `<span class="control-badge">${ctrl}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    deleteEvidence: function(evidenceId) {
        const evidence = this.evidenceLibrary[evidenceId];
        if (!evidence) return;

        if (confirm(`Delete evidence "${evidence.title}"?`)) {
            delete this.evidenceLibrary[evidenceId];
            this.saveToStorage();

            // Refresh library view
            document.querySelector('.evidence-library-modal')?.remove();
            this.showEvidenceLibrary();

            this.showToast('Evidence deleted', 'success');

            // Log activity
            if (typeof CollaborationManager !== 'undefined') {
                CollaborationManager.logActivity('evidence_deleted', `Deleted evidence: ${evidence.title}`);
            }
        }
    },

    getCurrentUser: function() {
        return localStorage.getItem('nist-user-name') || 'Unknown User';
    },

    // Get evidence linked to a specific control
    getEvidenceForControl: function(controlId) {
        return Object.values(this.evidenceLibrary).filter(evidence => 
            evidence.linkedControls && evidence.linkedControls.includes(controlId)
        );
    },

    // Export evidence library
    exportLibrary: function() {
        const data = {
            exportDate: new Date().toISOString(),
            evidenceCount: Object.keys(this.evidenceLibrary).length,
            evidence: this.evidenceLibrary
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `evidence-library-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Evidence library exported', 'success');
    },

    showToast: function(message, type = 'info') {
        if (typeof app !== 'undefined' && app.showToast) {
            app.showToast(message, type);
        } else {
            console.log(`[EvidenceCollector] ${type}: ${message}`);
        }
    }
};

// Initialize
if (typeof document !== 'undefined') {
    document.readyState === 'loading' ? 
        document.addEventListener('DOMContentLoaded', () => EvidenceCollector.init()) : 
        EvidenceCollector.init();
}

if (typeof window !== 'undefined') {
    window.EvidenceCollector = EvidenceCollector;
}
