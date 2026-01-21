/**
 * CMMC L2 Assessment Tool - Evidence UI Components
 * Handles evidence upload/download UI integration
 */

class EvidenceUI {
    constructor() {
        this.uploadQueue = [];
        this.isUploading = false;
    }

    /**
     * Initialize evidence UI
     */
    async init() {
        await supabaseClient.init();
        this.bindGlobalEvents();
        this.renderAuthUI();
    }

    /**
     * Bind global event listeners
     */
    bindGlobalEvents() {
        window.addEventListener('auth:signin', () => this.renderAuthUI());
        window.addEventListener('auth:signout', () => this.renderAuthUI());
    }

    /**
     * Render authentication UI in sidebar
     */
    renderAuthUI() {
        const container = document.getElementById('auth-container');
        if (!container) return;

        if (supabaseClient.isAuthenticated()) {
            const user = supabaseClient.getUser();
            container.innerHTML = `
                <div class="auth-user">
                    <img src="${user.user_metadata?.avatar_url || ''}" alt="" class="user-avatar" onerror="this.style.display='none'">
                    <div class="user-info">
                        <span class="user-name">${user.user_metadata?.full_name || user.email}</span>
                        <span class="user-email">${user.email}</span>
                    </div>
                    <button class="btn-icon" onclick="evidenceUI.signOut()" title="Sign Out">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <button class="btn-google-signin" onclick="evidenceUI.signInWithGoogle()">
                    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Sign in with Google
                </button>
            `;
        }
    }

    /**
     * Sign in with Google
     */
    async signInWithGoogle() {
        try {
            await supabaseClient.signInWithGoogle();
        } catch (error) {
            this.showToast('Sign in failed: ' + error.message, 'error');
        }
    }

    /**
     * Sign out
     */
    async signOut() {
        try {
            await supabaseClient.signOut();
            this.showToast('Signed out successfully', 'success');
        } catch (error) {
            this.showToast('Sign out failed: ' + error.message, 'error');
        }
    }

    /**
     * Create evidence button for objective row
     */
    createEvidenceButton(controlId, objectiveId, evidenceCount = 0) {
        const btn = document.createElement('button');
        btn.className = `evidence-btn ${evidenceCount > 0 ? 'has-evidence' : ''}`;
        btn.title = evidenceCount > 0 ? `${evidenceCount} evidence file(s)` : 'Add evidence';
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            ${evidenceCount > 0 ? `<span class="evidence-count">${evidenceCount}</span>` : ''}
        `;
        btn.onclick = () => this.openEvidenceModal(controlId, objectiveId);
        return btn;
    }

    /**
     * Open evidence modal for an objective
     */
    async openEvidenceModal(controlId, objectiveId) {
        if (!supabaseClient.isAuthenticated()) {
            this.showToast('Please sign in to manage evidence', 'error');
            return;
        }

        if (!supabaseClient.currentAssessment) {
            this.showToast('Please select or create an assessment first', 'error');
            return;
        }

        // Create modal if doesn't exist
        let modal = document.getElementById('evidence-modal');
        if (!modal) {
            modal = this.createEvidenceModal();
            document.body.appendChild(modal);
        }

        // Set current context
        modal.dataset.controlId = controlId;
        modal.dataset.objectiveId = objectiveId;

        // Update header
        modal.querySelector('.modal-title').textContent = `Evidence for ${objectiveId}`;

        // Load existing evidence
        await this.loadEvidenceList(controlId, objectiveId);

        // Show modal
        modal.classList.add('active');
    }

    /**
     * Create evidence modal HTML
     */
    createEvidenceModal() {
        const modal = document.createElement('div');
        modal.id = 'evidence-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content evidence-modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Evidence</h3>
                    <button class="modal-close" onclick="evidenceUI.closeEvidenceModal()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="evidence-upload-area" id="evidence-drop-zone">
                        <input type="file" id="evidence-file-input" multiple hidden>
                        <div class="upload-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        </div>
                        <p class="upload-text">Drag & drop files here or <span class="upload-link">browse</span></p>
                        <p class="upload-hint">Max 50MB • PDF, Images, Office docs, Logs</p>
                    </div>
                    <div class="evidence-list" id="evidence-list">
                        <div class="evidence-loading">Loading evidence...</div>
                    </div>
                </div>
            </div>
        `;

        // Bind events
        const dropZone = modal.querySelector('#evidence-drop-zone');
        const fileInput = modal.querySelector('#evidence-file-input');

        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            this.handleFileSelect(e.dataTransfer.files);
        });
        fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
            e.target.value = '';
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeEvidenceModal();
        });

        return modal;
    }

    /**
     * Close evidence modal
     */
    closeEvidenceModal() {
        const modal = document.getElementById('evidence-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    /**
     * Load evidence list for objective
     */
    async loadEvidenceList(controlId, objectiveId) {
        const listEl = document.getElementById('evidence-list');
        if (!listEl) return;

        try {
            const evidence = await supabaseClient.getEvidenceForObjective(controlId, objectiveId);
            
            if (evidence.length === 0) {
                listEl.innerHTML = '<div class="evidence-empty">No evidence uploaded yet</div>';
                return;
            }

            listEl.innerHTML = evidence.map(item => `
                <div class="evidence-item" data-id="${item.id}">
                    <div class="evidence-icon">${supabaseClient.getFileIcon(item.file_type)}</div>
                    <div class="evidence-info">
                        <span class="evidence-name">${item.file_name}</span>
                        <span class="evidence-meta">${supabaseClient.formatFileSize(item.file_size)} • ${new Date(item.created_at).toLocaleDateString()}</span>
                        ${item.description ? `<span class="evidence-desc">${item.description}</span>` : ''}
                    </div>
                    <div class="evidence-actions">
                        <button class="btn-icon" onclick="evidenceUI.downloadEvidence('${item.id}')" title="Download">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </button>
                        <button class="btn-icon btn-danger" onclick="evidenceUI.deleteEvidence('${item.id}')" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            listEl.innerHTML = `<div class="evidence-error">Error loading evidence: ${error.message}</div>`;
        }
    }

    /**
     * Handle file selection
     */
    async handleFileSelect(files) {
        const modal = document.getElementById('evidence-modal');
        const controlId = modal.dataset.controlId;
        const objectiveId = modal.dataset.objectiveId;

        for (const file of files) {
            // Validate
            const validation = supabaseClient.validateFile(file);
            if (!validation.valid) {
                this.showToast(`${file.name}: ${validation.errors.join(', ')}`, 'error');
                continue;
            }

            // Upload
            try {
                this.showToast(`Uploading ${file.name}...`, 'info');
                await supabaseClient.uploadEvidence(controlId, objectiveId, file);
                this.showToast(`${file.name} uploaded successfully`, 'success');
            } catch (error) {
                this.showToast(`Failed to upload ${file.name}: ${error.message}`, 'error');
            }
        }

        // Refresh list
        await this.loadEvidenceList(controlId, objectiveId);
        
        // Update evidence count on button
        this.updateEvidenceCount(controlId, objectiveId);
    }

    /**
     * Download evidence
     */
    async downloadEvidence(evidenceId) {
        try {
            const { data: evidence } = await supabaseClient.client
                .from('evidence')
                .select('*')
                .eq('id', evidenceId)
                .single();
            
            await supabaseClient.downloadEvidence(evidence);
        } catch (error) {
            this.showToast('Download failed: ' + error.message, 'error');
        }
    }

    /**
     * Delete evidence
     */
    async deleteEvidence(evidenceId) {
        if (!confirm('Are you sure you want to delete this evidence?')) return;

        try {
            await supabaseClient.deleteEvidence(evidenceId);
            this.showToast('Evidence deleted', 'success');
            
            // Refresh list
            const modal = document.getElementById('evidence-modal');
            await this.loadEvidenceList(modal.dataset.controlId, modal.dataset.objectiveId);
            this.updateEvidenceCount(modal.dataset.controlId, modal.dataset.objectiveId);
        } catch (error) {
            this.showToast('Delete failed: ' + error.message, 'error');
        }
    }

    /**
     * Update evidence count on button
     */
    async updateEvidenceCount(controlId, objectiveId) {
        try {
            const evidence = await supabaseClient.getEvidenceForObjective(controlId, objectiveId);
            const btn = document.querySelector(`[data-control="${controlId}"][data-objective="${objectiveId}"] .evidence-btn`);
            if (btn) {
                btn.className = `evidence-btn ${evidence.length > 0 ? 'has-evidence' : ''}`;
                const countSpan = btn.querySelector('.evidence-count');
                if (evidence.length > 0) {
                    if (countSpan) {
                        countSpan.textContent = evidence.length;
                    } else {
                        btn.innerHTML += `<span class="evidence-count">${evidence.length}</span>`;
                    }
                } else if (countSpan) {
                    countSpan.remove();
                }
            }
        } catch (e) {
            console.error('Failed to update evidence count:', e);
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        // Use existing app toast if available
        if (window.app && typeof app.showToast === 'function') {
            app.showToast(message, type);
            return;
        }

        // Fallback toast
        let toast = document.getElementById('evidence-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'evidence-toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Create global instance
const evidenceUI = new EvidenceUI();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    evidenceUI.init();
});
