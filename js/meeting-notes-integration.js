// Transcript Analyzer Module
// Paste meeting transcripts and use AI to map quotes to CMMC assessment objectives
// Data persisted in localStorage

const MeetingNotesIntegration = {
    config: {
        version: "2.0.0",
        storageKey: "nist-meeting-notes",
        quotesKey: "nist-meeting-quotes"
    },

    // Linked quotes per objective: { [objectiveId]: [{ quoteId, text, speaker, ... }] }
    linkedQuotes: {},
    // Stored transcripts
    transcripts: [],

    // =========================================
    // INITIALIZATION
    // =========================================
    init() {
        this.loadLinkedQuotes();
        this.loadTranscripts();
        this.bindGlobalEvents();
        console.log('[TranscriptAnalyzer] Initialized — quotes:', Object.keys(this.linkedQuotes).length, 'objectives with quotes');
    },

    bindGlobalEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#open-meeting-notes-btn')) {
                this.showTranscriptAnalyzer();
            }
        });
    },

    loadLinkedQuotes() {
        try {
            this.linkedQuotes = JSON.parse(localStorage.getItem(this.config.quotesKey) || '{}');
        } catch (e) {
            this.linkedQuotes = {};
        }
    },

    saveLinkedQuotes() {
        localStorage.setItem(this.config.quotesKey, JSON.stringify(this.linkedQuotes));
    },

    loadTranscripts() {
        try {
            this.transcripts = JSON.parse(localStorage.getItem(this.config.storageKey) || '[]');
        } catch (e) {
            this.transcripts = [];
        }
    },

    saveTranscripts() {
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.transcripts));
    },

    // Backward-compat stubs for external callers
    getProvider() { return 'transcript'; },
    isConfigured() { return true; },

    // =========================================
    // TRANSCRIPT STORAGE
    // =========================================
    addTranscript(entry) {
        const record = {
            id: 'tx_' + Date.now(),
            title: entry.title || 'Untitled Transcript',
            date: entry.date || new Date().toISOString(),
            speaker: entry.speaker || '',
            summary: entry.summary || '',
            transcript: entry.transcript || '',
            createdAt: Date.now()
        };
        this.transcripts.unshift(record);
        this.saveTranscripts();
        return record;
    },

    // =========================================
    // QUOTE LINKING — Core Feature
    // =========================================
    linkQuote(objectiveId, quote) {
        if (!this.linkedQuotes[objectiveId]) {
            this.linkedQuotes[objectiveId] = [];
        }

        const entry = {
            quoteId: 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            text: quote.text,
            speaker: quote.speaker || 'Unknown',
            speakerRole: quote.speakerRole || '',
            timestamp: quote.timestamp || null,
            meetingId: quote.meetingId || null,
            meetingTitle: quote.meetingTitle || 'Unknown Meeting',
            meetingDate: quote.meetingDate || null,
            provider: quote.provider || this.getProvider() || 'manual',
            linkedAt: Date.now(),
            linkedBy: localStorage.getItem('nist-user-name') || 'Unknown',
            assessorNote: quote.assessorNote || ''
        };

        this.linkedQuotes[objectiveId].push(entry);
        this.saveLinkedQuotes();
        return entry;
    },

    unlinkQuote(objectiveId, quoteId) {
        if (this.linkedQuotes[objectiveId]) {
            this.linkedQuotes[objectiveId] = this.linkedQuotes[objectiveId].filter(q => q.quoteId !== quoteId);
            if (this.linkedQuotes[objectiveId].length === 0) {
                delete this.linkedQuotes[objectiveId];
            }
            this.saveLinkedQuotes();
        }
    },

    updateQuoteNote(objectiveId, quoteId, note) {
        if (this.linkedQuotes[objectiveId]) {
            const quote = this.linkedQuotes[objectiveId].find(q => q.quoteId === quoteId);
            if (quote) {
                quote.assessorNote = note;
                this.saveLinkedQuotes();
            }
        }
    },

    getQuotesForObjective(objectiveId) {
        return this.linkedQuotes[objectiveId] || [];
    },

    getQuoteCount(objectiveId) {
        return (this.linkedQuotes[objectiveId] || []).length;
    },

    getTotalQuoteCount() {
        return Object.values(this.linkedQuotes).reduce((sum, arr) => sum + arr.length, 0);
    },

    getObjectivesWithQuotes() {
        return Object.keys(this.linkedQuotes).filter(k => this.linkedQuotes[k].length > 0);
    },

    // =========================================
    // UI RENDERING
    // =========================================

    // Transcript Evidence tab content for an assessment objective
    renderObjectivePanel(objectiveId) {
        const quotes = this.getQuotesForObjective(objectiveId);

        return `
            <div class="mn-objective-panel" data-objective-id="${objectiveId}">
                <div class="mn-quotes-section">
                    <div class="mn-section-header">
                        <h4>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
                            Linked Transcript Quotes <span class="mn-quote-count">(${quotes.length})</span>
                        </h4>
                        <button class="mn-add-quote-btn" data-objective-id="${objectiveId}" title="Add Quote">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Add Quote
                        </button>
                    </div>
                    <div class="mn-quotes-list" id="mn-quotes-${objectiveId}">
                        ${quotes.length > 0 ? this._renderQuotesList(objectiveId, quotes) : this._renderEmptyQuotes()}
                    </div>
                </div>

                <div class="mn-browse-section" id="mn-browse-${objectiveId}" style="display:none">
                    ${this._renderAddQuoteForm(objectiveId)}
                </div>
            </div>
        `;
    },

    // Compact badge for objective row showing quote count
    renderQuoteBadge(objectiveId) {
        const count = this.getQuoteCount(objectiveId);
        if (count === 0) return '';
        return `<span class="mn-badge" title="${count} transcript quote(s) linked"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg> ${count}</span>`;
    },

    // =========================================
    // PRIVATE RENDER HELPERS
    // =========================================
    _renderEmptyQuotes() {
        return `
            <div class="mn-empty-quotes">
                <p>No transcript quotes linked to this objective yet.</p>
                <p class="mn-empty-hint">Click <strong>Add Quote</strong> to manually link a transcript excerpt, or use the <strong>Transcript Analyzer</strong> from the hamburger menu to have AI map an entire transcript to objectives.</p>
            </div>
        `;
    },

    _renderQuotesList(objectiveId, quotes) {
        return quotes.map(q => `
            <div class="mn-quote-item" data-quote-id="${q.quoteId}">
                <div class="mn-quote-content">
                    <div class="mn-quote-text">&ldquo;${this._escapeHtml(q.text)}&rdquo;</div>
                    <div class="mn-quote-meta">
                        <span class="mn-quote-speaker">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            ${this._escapeHtml(q.speaker)}${q.speakerRole ? ' <span class="mn-speaker-role">(' + this._escapeHtml(q.speakerRole) + ')</span>' : ''}
                        </span>
                        <span class="mn-quote-meeting" title="${this._escapeHtml(q.meetingTitle)}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            ${this._escapeHtml(q.meetingTitle)}
                        </span>
                        ${q.meetingDate ? `<span class="mn-quote-date">${new Date(q.meetingDate).toLocaleDateString()}</span>` : ''}
                    </div>
                    ${q.assessorNote ? `<div class="mn-quote-assessor-note"><strong>Assessor Note:</strong> ${this._escapeHtml(q.assessorNote)}</div>` : ''}
                    <div class="mn-quote-linked-meta">Linked by ${this._escapeHtml(q.linkedBy)} on ${new Date(q.linkedAt).toLocaleDateString()}</div>
                </div>
                <div class="mn-quote-actions">
                    <button class="mn-edit-note-btn" data-objective-id="${objectiveId}" data-quote-id="${q.quoteId}" title="Edit assessor note">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="mn-unlink-btn" data-objective-id="${objectiveId}" data-quote-id="${q.quoteId}" title="Remove quote">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
        `).join('');
    },

    _renderAddQuoteForm(objectiveId) {
        return `
            <div class="mn-add-quote-form">
                <h4>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Link Transcript Quote to Objective
                </h4>

                <div class="mn-manual-quote">
                    <div class="mn-form-group">
                        <label>Quote Text <span class="required">*</span></label>
                        <textarea class="mn-quote-input" id="mn-quote-text-${objectiveId}" rows="4" placeholder="Paste the exact quote from the transcript that demonstrates how this control is implemented..."></textarea>
                    </div>
                    <div class="mn-form-row">
                        <div class="mn-form-group">
                            <label>Speaker Name</label>
                            <input type="text" class="mn-input" id="mn-quote-speaker-${objectiveId}" placeholder="e.g., IT Director, CISO" />
                        </div>
                        <div class="mn-form-group">
                            <label>Speaker Role / Title</label>
                            <input type="text" class="mn-input" id="mn-quote-role-${objectiveId}" placeholder="e.g., System Admin, ISSM" />
                        </div>
                    </div>
                    <div class="mn-form-row">
                        <div class="mn-form-group">
                            <label>Meeting Title</label>
                            <input type="text" class="mn-input" id="mn-quote-meeting-${objectiveId}" placeholder="e.g., CMMC Readiness Review" />
                        </div>
                        <div class="mn-form-group">
                            <label>Meeting Date</label>
                            <input type="date" class="mn-input" id="mn-quote-date-${objectiveId}" />
                        </div>
                    </div>
                    <div class="mn-form-group">
                        <label>Assessor Note (optional)</label>
                        <textarea class="mn-input" id="mn-quote-note-${objectiveId}" rows="2" placeholder="Your interpretation or context for this quote..."></textarea>
                    </div>
                    <div class="mn-form-actions">
                        <button class="mn-cancel-quote-btn btn-secondary" data-objective-id="${objectiveId}">Cancel</button>
                        <button class="mn-save-quote-btn btn-primary" data-objective-id="${objectiveId}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                            Link Quote to Objective
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // =========================================
    // EVENT BINDING
    // =========================================
    bindObjectivePanelEvents(container, objectiveId) {
        // Add Quote button — toggle browse section
        container.querySelectorAll('.mn-add-quote-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const browseSection = container.querySelector(`#mn-browse-${objectiveId}`);
                if (browseSection) {
                    browseSection.style.display = browseSection.style.display === 'none' ? 'block' : 'none';
                }
            });
        });

        // Cancel quote
        container.querySelectorAll('.mn-cancel-quote-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const browseSection = container.querySelector(`#mn-browse-${objectiveId}`);
                if (browseSection) browseSection.style.display = 'none';
            });
        });

        // Save quote
        container.querySelectorAll('.mn-save-quote-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = document.getElementById(`mn-quote-text-${objectiveId}`)?.value.trim();
                if (!text) {
                    this._showToast('Please enter the quote text', 'error');
                    return;
                }
                const quote = {
                    text: text,
                    speaker: document.getElementById(`mn-quote-speaker-${objectiveId}`)?.value.trim() || 'Unknown',
                    speakerRole: document.getElementById(`mn-quote-role-${objectiveId}`)?.value.trim() || '',
                    meetingTitle: document.getElementById(`mn-quote-meeting-${objectiveId}`)?.value.trim() || 'Manual Entry',
                    meetingDate: document.getElementById(`mn-quote-date-${objectiveId}`)?.value || null,
                    assessorNote: document.getElementById(`mn-quote-note-${objectiveId}`)?.value.trim() || ''
                };
                this.linkQuote(objectiveId, quote);
                this._showToast('Quote linked to objective', 'success');
                this._refreshQuotesUI(container, objectiveId);
            });
        });

        // Unlink quote
        container.querySelectorAll('.mn-unlink-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Remove this quote from the objective?')) {
                    this.unlinkQuote(btn.dataset.objectiveId, btn.dataset.quoteId);
                    this._showToast('Quote removed', 'success');
                    this._refreshQuotesUI(container, objectiveId);
                }
            });
        });

        // Edit assessor note
        container.querySelectorAll('.mn-edit-note-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const qId = btn.dataset.quoteId;
                const oId = btn.dataset.objectiveId;
                const quotes = this.getQuotesForObjective(oId);
                const quote = quotes.find(q => q.quoteId === qId);
                if (!quote) return;
                const note = prompt('Assessor note for this quote:', quote.assessorNote || '');
                if (note !== null) {
                    this.updateQuoteNote(oId, qId, note);
                    this._refreshQuotesUI(container, objectiveId);
                }
            });
        });
    },

    _refreshQuotesUI(container, objectiveId) {
        const quotes = this.getQuotesForObjective(objectiveId);
        const listEl = container.querySelector(`#mn-quotes-${objectiveId}`);
        if (listEl) {
            listEl.innerHTML = quotes.length > 0 ? this._renderQuotesList(objectiveId, quotes) : this._renderEmptyQuotes();
        }
        // Update count
        const countEl = container.querySelector('.mn-quote-count');
        if (countEl) countEl.textContent = `(${quotes.length})`;
        // Hide browse section
        const browseSection = container.querySelector(`#mn-browse-${objectiveId}`);
        if (browseSection) browseSection.style.display = 'none';
        // Re-bind events
        this.bindObjectivePanelEvents(container, objectiveId);
        // Update badge in main assessment view
        this._updateObjectiveBadge(objectiveId);
    },

    _updateObjectiveBadge(objectiveId) {
        const badge = document.querySelector(`.mn-badge-slot[data-objective-id="${objectiveId}"]`);
        if (badge) {
            badge.innerHTML = this.renderQuoteBadge(objectiveId);
        }
    },

    // =========================================
    // AI TRANSCRIPT ANALYZER
    // =========================================
    _analyzerState: {
        isAnalyzing: false,
        results: null,
        transcript: ''
    },

    showTranscriptAnalyzer() {
        // Check AI is configured
        if (typeof ClaudeAPI === 'undefined' || !ClaudeAPI.isConfigured()) {
            this._showToast('Please configure an AI provider in Settings first', 'error');
            return;
        }

        document.querySelector('.mn-analyzer-backdrop')?.remove();

        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop active mn-analyzer-backdrop';
        backdrop.innerHTML = `
            <div class="modal-content" style="max-width: 900px; max-height: 90vh; display: flex; flex-direction: column;">
                <div class="modal-header">
                    <h2>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/><circle cx="12" cy="15" r="2"/></svg>
                        AI Transcript Analyzer
                    </h2>
                    <button class="modal-close mn-analyzer-close-btn">&times;</button>
                </div>
                <div class="modal-body" style="overflow-y: auto; flex: 1;">
                    <div id="mn-analyzer-input-phase">
                        <p class="mn-settings-desc">Paste a full meeting transcript below. The AI assessor will analyze it, identify security-relevant statements, and suggest which CMMC assessment objectives they map to.</p>
                        <div class="mn-form-group">
                            <label>Meeting Title</label>
                            <input type="text" class="mn-input" id="mn-analyzer-title" placeholder="e.g., CMMC Readiness Interview — IT Director" />
                        </div>
                        <div class="mn-form-row">
                            <div class="mn-form-group">
                                <label>Meeting Date</label>
                                <input type="date" class="mn-input" id="mn-analyzer-date" value="${new Date().toISOString().split('T')[0]}" />
                            </div>
                            <div class="mn-form-group">
                                <label>Primary Speaker / Interviewee</label>
                                <input type="text" class="mn-input" id="mn-analyzer-speaker" placeholder="e.g., John Smith, IT Director" />
                            </div>
                        </div>
                        <div class="mn-form-group">
                            <label>Transcript Text <span class="required">*</span></label>
                            <textarea class="mn-quote-input" id="mn-analyzer-transcript" rows="12" placeholder="Paste the full meeting transcript here...&#10;&#10;Speaker 1: We use Microsoft Defender on all endpoints...&#10;Speaker 2: Our password policy requires 16 characters minimum..."></textarea>
                        </div>
                        <div class="mn-form-group">
                            <label>Focus Areas (optional)</label>
                            <input type="text" class="mn-input" id="mn-analyzer-focus" placeholder="e.g., Access Control, Incident Response — leave blank to analyze all families" />
                        </div>
                        <div class="mn-form-actions" style="justify-content: space-between;">
                            <span class="mn-analyzer-hint" style="font-size: 0.75rem; color: var(--text-muted);">AI will identify quotes and map them to assessment objectives</span>
                            <button class="btn-primary mn-analyzer-run-btn" id="mn-analyzer-run-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/><circle cx="12" cy="15" r="2"/></svg>
                                Analyze Transcript
                            </button>
                        </div>
                    </div>

                    <div id="mn-analyzer-loading" style="display: none; text-align: center; padding: 48px 24px;">
                        <div class="mn-spin" style="display: inline-block; margin-bottom: 16px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                        </div>
                        <h3 style="margin: 0 0 8px;">Analyzing Transcript...</h3>
                        <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">The AI assessor is reading the transcript and identifying security-relevant statements that map to CMMC assessment objectives. This may take 15-30 seconds.</p>
                    </div>

                    <div id="mn-analyzer-results" style="display: none;"></div>
                </div>
            </div>
        `;
        document.body.appendChild(backdrop);

        // Bind events
        backdrop.querySelector('.mn-analyzer-close-btn').addEventListener('click', () => backdrop.remove());
        backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });
        const escHandler = (e) => { if (e.key === 'Escape') { backdrop.remove(); document.removeEventListener('keydown', escHandler); } };
        document.addEventListener('keydown', escHandler);

        backdrop.querySelector('#mn-analyzer-run-btn').addEventListener('click', () => this._runTranscriptAnalysis(backdrop));
    },

    async _runTranscriptAnalysis(modal) {
        const transcript = modal.querySelector('#mn-analyzer-transcript')?.value.trim();
        if (!transcript) {
            this._showToast('Please paste a transcript to analyze', 'error');
            return;
        }
        if (transcript.length < 100) {
            this._showToast('Transcript seems too short — paste the full meeting notes', 'error');
            return;
        }

        const title = modal.querySelector('#mn-analyzer-title')?.value.trim() || 'Untitled Meeting';
        const date = modal.querySelector('#mn-analyzer-date')?.value || new Date().toISOString().split('T')[0];
        const speaker = modal.querySelector('#mn-analyzer-speaker')?.value.trim() || '';
        const focus = modal.querySelector('#mn-analyzer-focus')?.value.trim() || '';

        // Show loading
        modal.querySelector('#mn-analyzer-input-phase').style.display = 'none';
        modal.querySelector('#mn-analyzer-loading').style.display = 'block';
        modal.querySelector('#mn-analyzer-results').style.display = 'none';

        try {
            const prompt = this._buildAnalyzerPrompt(transcript, focus);
            const response = await ClaudeAPI.sendMessage(
                prompt,
                [{ role: 'user', content: `Here is the meeting transcript to analyze:\n\n---\n${transcript}\n---\n\nPlease analyze this transcript and return the JSON mapping.` }],
                { temperature: 0.2 }
            );

            const mappings = this._parseAnalyzerResponse(response.text);

            if (!mappings || mappings.length === 0) {
                this._showToast('No objective mappings found in the transcript', 'info');
                modal.querySelector('#mn-analyzer-input-phase').style.display = 'block';
                modal.querySelector('#mn-analyzer-loading').style.display = 'none';
                return;
            }

            // Store context for linking
            this._analyzerState = {
                isAnalyzing: false,
                results: mappings,
                transcript: transcript,
                meetingTitle: title,
                meetingDate: date,
                speaker: speaker
            };

            // Render results
            this._renderAnalyzerResults(modal, mappings, title, date, speaker);

        } catch (error) {
            console.error('[MeetingNotes] Transcript analysis failed:', error);
            this._showToast(`Analysis failed: ${error.message}`, 'error');
            modal.querySelector('#mn-analyzer-input-phase').style.display = 'block';
            modal.querySelector('#mn-analyzer-loading').style.display = 'none';
        }
    },

    _buildAnalyzerPrompt(transcript, focusAreas) {
        // Build a list of all objectives for the AI to map to
        let objectivesList = '';
        if (typeof CONTROL_FAMILIES !== 'undefined') {
            CONTROL_FAMILIES.forEach(family => {
                family.controls.forEach(control => {
                    control.objectives.forEach(obj => {
                        objectivesList += `- ${obj.id}: ${control.name} — ${obj.text}\n`;
                    });
                });
            });
        }

        return `You are an expert CMMC Level 2 assessor analyzing a meeting transcript from an assessment interview. Your task is to identify specific quotes from the transcript that serve as evidence for CMMC assessment objectives.

## Instructions
1. Read the transcript carefully
2. Identify statements that describe security practices, policies, tools, or processes
3. Map each relevant quote to the most appropriate CMMC assessment objective(s)
4. Extract the exact quote text (or a close paraphrase if the statement spans multiple turns)
5. Identify the speaker and their role if apparent
6. Provide a brief assessor note explaining why this quote is relevant
7. Rate the evidence strength: "strong" (directly demonstrates compliance), "moderate" (supports but needs corroboration), or "weak" (tangentially relevant)

${focusAreas ? `## Focus Areas\nPrioritize quotes related to: ${focusAreas}\n` : ''}

## Available Assessment Objectives
${objectivesList || 'Assessment objectives not loaded — use standard NIST 800-171 Rev 2 objective IDs (e.g., 3.1.1[a], 3.5.2[b])'}

## Required Output Format
Return ONLY a JSON array (no markdown fencing, no explanation outside the JSON). Each element:
[
  {
    "objectiveId": "3.x.x[y]",
    "quote": "Exact quote from transcript",
    "speaker": "Speaker name or role",
    "speakerRole": "Their title/role if mentioned",
    "assessorNote": "Why this quote is relevant to this objective",
    "strength": "strong|moderate|weak",
    "controlFamily": "AC|AT|AU|CM|IA|IR|MA|MP|PE|PS|RA|CA|SC|SI"
  }
]

Return up to 30 mappings, prioritizing the strongest evidence. If a quote maps to multiple objectives, create separate entries for each.`;
    },

    _parseAnalyzerResponse(responseText) {
        try {
            // Try to extract JSON array from response
            let text = responseText.trim();
            // Remove markdown code fences if present
            text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
            // Find the JSON array
            const arrayMatch = text.match(/\[[\s\S]*\]/);
            if (arrayMatch) {
                const parsed = JSON.parse(arrayMatch[0]);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.filter(m => m.objectiveId && m.quote);
                }
            }
            throw new Error('No valid JSON array found');
        } catch (e) {
            console.error('[MeetingNotes] Failed to parse analyzer response:', e);
            return null;
        }
    },

    _renderAnalyzerResults(modal, mappings, title, date, speaker) {
        modal.querySelector('#mn-analyzer-loading').style.display = 'none';
        const resultsDiv = modal.querySelector('#mn-analyzer-results');
        resultsDiv.style.display = 'block';

        // Group by control family
        const byFamily = {};
        mappings.forEach((m, idx) => {
            const fam = m.controlFamily || m.objectiveId?.split('.')[0]?.replace(/\d/g, '') || '??';
            if (!byFamily[fam]) byFamily[fam] = [];
            m._idx = idx;
            byFamily[fam].push(m);
        });

        const strengthColors = { strong: '#10b981', moderate: '#f59e0b', weak: '#6b7280' };
        const strengthLabels = { strong: 'Strong', moderate: 'Moderate', weak: 'Weak' };

        resultsDiv.innerHTML = `
            <div class="mn-analyzer-results-header">
                <div>
                    <h3 style="margin: 0 0 4px;">Analysis Complete</h3>
                    <p style="color: var(--text-muted); font-size: 0.82rem; margin: 0;">Found <strong>${mappings.length}</strong> potential evidence mappings across <strong>${Object.keys(byFamily).length}</strong> control families</p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-secondary mn-analyzer-back-btn" style="font-size: 0.82rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                        Back
                    </button>
                    <button class="btn-primary mn-analyzer-link-all-btn" style="font-size: 0.82rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        Link All Selected (${mappings.length})
                    </button>
                </div>
            </div>

            <div class="mn-analyzer-select-bar" style="display: flex; gap: 12px; margin: 12px 0; font-size: 0.78rem;">
                <button class="mn-analyzer-select-all" style="color: var(--accent-blue); background: none; border: none; cursor: pointer; font-size: inherit; padding: 0;">Select All</button>
                <button class="mn-analyzer-select-none" style="color: var(--accent-blue); background: none; border: none; cursor: pointer; font-size: inherit; padding: 0;">Select None</button>
                <button class="mn-analyzer-select-strong" style="color: var(--accent-blue); background: none; border: none; cursor: pointer; font-size: inherit; padding: 0;">Strong Only</button>
            </div>

            ${Object.entries(byFamily).sort((a, b) => a[0].localeCompare(b[0])).map(([fam, items]) => `
                <div class="mn-analyzer-family-group" style="margin-bottom: 16px;">
                    <h4 style="font-size: 0.82rem; color: var(--text-secondary); margin: 0 0 8px; padding: 6px 0; border-bottom: 1px solid var(--border-color);">${fam} — ${items.length} mapping${items.length > 1 ? 's' : ''}</h4>
                    ${items.map(m => `
                        <label class="mn-analyzer-mapping" data-idx="${m._idx}" style="display: flex; gap: 10px; padding: 10px 12px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 6px; cursor: pointer; transition: border-color 0.15s;">
                            <input type="checkbox" class="mn-analyzer-cb" data-idx="${m._idx}" checked style="margin-top: 4px; flex-shrink: 0;" />
                            <div style="flex: 1; min-width: 0;">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
                                    <code style="font-size: 0.78rem; background: rgba(79,70,229,0.1); color: var(--accent-blue); padding: 2px 6px; border-radius: 4px; font-weight: 600;">${this._escapeHtml(m.objectiveId)}</code>
                                    <span style="font-size: 0.68rem; padding: 2px 8px; border-radius: 10px; font-weight: 600; background: ${strengthColors[m.strength] || '#6b7280'}20; color: ${strengthColors[m.strength] || '#6b7280'};">${strengthLabels[m.strength] || m.strength}</span>
                                    ${m.speaker ? `<span style="font-size: 0.72rem; color: var(--text-muted);">${this._escapeHtml(m.speaker)}${m.speakerRole ? ' (' + this._escapeHtml(m.speakerRole) + ')' : ''}</span>` : ''}
                                </div>
                                <div style="font-size: 0.85rem; font-style: italic; color: var(--text-primary); line-height: 1.5; padding: 6px 10px; background: rgba(79,70,229,0.05); border-left: 3px solid var(--accent-blue); border-radius: 0 6px 6px 0; margin-bottom: 6px;">&ldquo;${this._escapeHtml(m.quote)}&rdquo;</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted);">${this._escapeHtml(m.assessorNote)}</div>
                            </div>
                        </label>
                    `).join('')}
                </div>
            `).join('')}
        `;

        // Bind result events
        this._bindAnalyzerResultEvents(modal, mappings, title, date, speaker);
    },

    _bindAnalyzerResultEvents(modal, mappings, title, date, speaker) {
        const resultsDiv = modal.querySelector('#mn-analyzer-results');

        // Back button
        resultsDiv.querySelector('.mn-analyzer-back-btn')?.addEventListener('click', () => {
            resultsDiv.style.display = 'none';
            modal.querySelector('#mn-analyzer-input-phase').style.display = 'block';
        });

        // Select all / none / strong
        resultsDiv.querySelector('.mn-analyzer-select-all')?.addEventListener('click', () => {
            resultsDiv.querySelectorAll('.mn-analyzer-cb').forEach(cb => cb.checked = true);
            this._updateLinkAllCount(resultsDiv, mappings);
        });
        resultsDiv.querySelector('.mn-analyzer-select-none')?.addEventListener('click', () => {
            resultsDiv.querySelectorAll('.mn-analyzer-cb').forEach(cb => cb.checked = false);
            this._updateLinkAllCount(resultsDiv, mappings);
        });
        resultsDiv.querySelector('.mn-analyzer-select-strong')?.addEventListener('click', () => {
            resultsDiv.querySelectorAll('.mn-analyzer-cb').forEach(cb => {
                const idx = parseInt(cb.dataset.idx);
                cb.checked = mappings[idx]?.strength === 'strong';
            });
            this._updateLinkAllCount(resultsDiv, mappings);
        });

        // Checkbox changes update count
        resultsDiv.querySelectorAll('.mn-analyzer-cb').forEach(cb => {
            cb.addEventListener('change', () => this._updateLinkAllCount(resultsDiv, mappings));
        });

        // Link All Selected
        resultsDiv.querySelector('.mn-analyzer-link-all-btn')?.addEventListener('click', () => {
            const selected = [];
            resultsDiv.querySelectorAll('.mn-analyzer-cb:checked').forEach(cb => {
                const idx = parseInt(cb.dataset.idx);
                if (mappings[idx]) selected.push(mappings[idx]);
            });

            if (selected.length === 0) {
                this._showToast('No mappings selected', 'error');
                return;
            }

            // Save transcript record
            const txRecord = this.addTranscript({
                title: title,
                date: date,
                speaker: speaker,
                summary: `AI-analyzed transcript — ${selected.length} quotes extracted`,
                transcript: this._analyzerState.transcript
            });

            // Link each selected quote
            let linked = 0;
            selected.forEach(m => {
                this.linkQuote(m.objectiveId, {
                    text: m.quote,
                    speaker: m.speaker || speaker || 'Unknown',
                    speakerRole: m.speakerRole || '',
                    meetingId: txRecord.id,
                    meetingTitle: title,
                    meetingDate: date,
                    assessorNote: `[AI-analyzed: ${m.strength}] ${m.assessorNote}`
                });
                linked++;
            });

            this._showToast(`${linked} quote${linked > 1 ? 's' : ''} linked to ${new Set(selected.map(m => m.objectiveId)).size} objectives`, 'success');

            // Close modal
            modal.closest('.mn-analyzer-backdrop')?.remove();
        });
    },

    _updateLinkAllCount(resultsDiv, mappings) {
        const count = resultsDiv.querySelectorAll('.mn-analyzer-cb:checked').length;
        const btn = resultsDiv.querySelector('.mn-analyzer-link-all-btn');
        if (btn) btn.textContent = `Link All Selected (${count})`;
    },

    // =========================================
    // UTILITIES
    // =========================================
    _escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    _showToast(message, type) {
        if (typeof AssessmentEnhancements !== 'undefined' && AssessmentEnhancements.showToast) {
            AssessmentEnhancements.showToast(message, type);
        } else {
            // Fallback toast
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            toast.style.cssText = 'position:fixed;bottom:20px;right:20px;padding:12px 20px;border-radius:8px;color:white;z-index:10001;font-size:0.85rem;max-width:400px;animation:fadeIn 0.3s ease;';
            toast.style.background = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MeetingNotesIntegration.init());
} else {
    MeetingNotesIntegration.init();
}
