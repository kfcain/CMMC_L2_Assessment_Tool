// Meeting Notes Integration Module
// Supports manual paste from any AI notetaker (Granola, Otter, Fireflies, Fathom, etc.)
// Allows linking meeting transcript quotes to assessment objectives as evidence
// Data persisted in localStorage

const MeetingNotesIntegration = {
    config: {
        version: "1.0.0",
        storageKey: "nist-meeting-notes",
        configKey: "nist-meeting-notes-config",
        quotesKey: "nist-meeting-quotes",
        providers: {
            granola: { label: "Granola", icon: "granola", hasApi: false },
            otter: { label: "Otter.ai", icon: "otter", hasApi: false },
            fireflies: { label: "Fireflies.ai", icon: "fireflies", hasApi: false },
            fathom: { label: "Fathom", icon: "fathom", hasApi: false },
            manual: { label: "Manual / Other", icon: "manual", hasApi: false }
        }
    },

    // Linked quotes per objective: { [objectiveId]: [{ quoteId, text, speaker, timestamp, meetingId, meetingTitle, ... }] }
    linkedQuotes: {},
    // Manual meeting entries
    manualMeetings: [],
    // Provider config
    providerConfig: {},

    // =========================================
    // INITIALIZATION
    // =========================================
    init() {
        this.loadConfig();
        this.loadLinkedQuotes();
        this.loadManualMeetings();
        this.bindGlobalEvents();
        console.log('[MeetingNotes] Initialized — provider:', this.getProvider(), 'quotes:', Object.keys(this.linkedQuotes).length, 'objectives with quotes');
    },

    bindGlobalEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#open-meeting-notes-btn')) {
                this.showSettingsModal();
            }
        });
    },

    loadConfig() {
        try {
            this.providerConfig = JSON.parse(localStorage.getItem(this.config.configKey) || '{}');
        } catch (e) {
            this.providerConfig = {};
        }
    },

    saveConfig() {
        localStorage.setItem(this.config.configKey, JSON.stringify(this.providerConfig));
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

    loadManualMeetings() {
        try {
            this.manualMeetings = JSON.parse(localStorage.getItem(this.config.storageKey) || '[]');
        } catch (e) {
            this.manualMeetings = [];
        }
    },

    saveManualMeetings() {
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.manualMeetings));
    },

    // =========================================
    // PROVIDER CONFIGURATION
    // =========================================
    getProvider() {
        return this.providerConfig.provider || null;
    },

    getApiKey() {
        return this.providerConfig.apiKey || null;
    },

    isConfigured() {
        return !!this.getProvider();
    },

    setProvider(providerId, apiKey) {
        this.providerConfig.provider = providerId;
        if (apiKey) this.providerConfig.apiKey = apiKey;
        this.saveConfig();
    },

    clearProvider() {
        this.providerConfig = {};
        this.saveConfig();
    },

    // =========================================
    // MANUAL MEETING MANAGEMENT (for non-API providers)
    // =========================================
    addManualMeeting(meeting) {
        const entry = {
            id: 'manual_' + Date.now(),
            title: meeting.title || 'Untitled Meeting',
            date: meeting.date || new Date().toISOString(),
            provider: meeting.provider || this.getProvider() || 'manual',
            attendees: meeting.attendees || '',
            summary: meeting.summary || '',
            transcript: meeting.transcript || '',
            createdAt: Date.now()
        };
        this.manualMeetings.unshift(entry);
        this.saveManualMeetings();
        return entry;
    },

    updateManualMeeting(meetingId, updates) {
        const idx = this.manualMeetings.findIndex(m => m.id === meetingId);
        if (idx >= 0) {
            Object.assign(this.manualMeetings[idx], updates);
            this.saveManualMeetings();
            return this.manualMeetings[idx];
        }
        return null;
    },

    deleteManualMeeting(meetingId) {
        this.manualMeetings = this.manualMeetings.filter(m => m.id !== meetingId);
        this.saveManualMeetings();
        // Also remove any linked quotes from this meeting
        Object.keys(this.linkedQuotes).forEach(objId => {
            this.linkedQuotes[objId] = this.linkedQuotes[objId].filter(q => q.meetingId !== meetingId);
            if (this.linkedQuotes[objId].length === 0) delete this.linkedQuotes[objId];
        });
        this.saveLinkedQuotes();
    },

    getAllMeetings() {
        // Return manual meetings, sorted by date desc
        const all = [
            ...this.manualMeetings.map(m => ({
                id: m.id,
                title: m.title,
                date: m.date,
                provider: m.provider,
                source: 'manual',
                owner: '',
                summary: m.summary || ''
            }))
        ];
        all.sort((a, b) => new Date(b.date) - new Date(a.date));
        return all;
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
    // TRANSCRIPT SEARCH (for manual meetings)
    // =========================================
    searchTranscripts(query) {
        if (!query || query.length < 2) return [];
        const lower = query.toLowerCase();
        const results = [];

        // Search manual meetings
        this.manualMeetings.forEach(meeting => {
            if (meeting.transcript) {
                const lines = meeting.transcript.split('\n');
                lines.forEach((line, idx) => {
                    if (line.toLowerCase().includes(lower)) {
                        results.push({
                            meetingId: meeting.id,
                            meetingTitle: meeting.title,
                            meetingDate: meeting.date,
                            provider: meeting.provider,
                            lineIndex: idx,
                            text: line.trim(),
                            context: lines.slice(Math.max(0, idx - 1), idx + 2).join('\n')
                        });
                    }
                });
            }
        });

        return results;
    },

    // =========================================
    // UI RENDERING
    // =========================================

    // Settings panel for configuring provider
    renderSettingsPanel() {
        const provider = this.getProvider();
        const isConfigured = this.isConfigured();

        return `
            <div class="meeting-notes-settings">
                <div class="mn-settings-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    <h3>Meeting Notes Integration</h3>
                    ${isConfigured ? '<span class="mn-status-badge connected">Connected</span>' : '<span class="mn-status-badge disconnected">Not Connected</span>'}
                </div>
                <p class="mn-settings-desc">Select your AI meeting notetaker, then paste or upload transcript text to link quotes directly to assessment objectives as evidence.</p>
                
                <div class="mn-provider-select">
                    <label>Meeting Notes Provider</label>
                    <div class="mn-provider-grid">
                        ${Object.entries(this.config.providers).map(([id, p]) => `
                            <button class="mn-provider-btn ${provider === id ? 'active' : ''}" data-provider="${id}">
                                <span class="mn-provider-icon">${this._getProviderIcon(id)}</span>
                                <span>${p.label}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="mn-provider-help" style="display: ${provider === 'granola' ? 'block' : 'none'}">
                    <small class="mn-api-help">Copy your meeting notes from Granola (select all &rarr; copy), then paste them when adding quotes to objectives.</small>
                </div>

                <div class="mn-settings-actions">
                    <button class="mn-save-btn btn-primary">Save Configuration</button>
                    ${isConfigured ? '<button class="mn-disconnect-btn btn-secondary">Disconnect</button>' : ''}
                </div>

                <div class="mn-stats" style="display: ${isConfigured ? 'block' : 'none'}">
                    <div class="mn-stats-grid">
                        <div class="mn-stat"><span class="mn-stat-value">${this.getTotalQuoteCount()}</span><span class="mn-stat-label">Linked Quotes</span></div>
                        <div class="mn-stat"><span class="mn-stat-value">${this.getObjectivesWithQuotes().length}</span><span class="mn-stat-label">Objectives with Evidence</span></div>
                        <div class="mn-stat"><span class="mn-stat-value">${this.manualMeetings.length}</span><span class="mn-stat-label">Stored Meetings</span></div>
                    </div>
                </div>
            </div>
        `;
    },

    // Meeting Evidence tab content for an assessment objective
    renderObjectivePanel(objectiveId) {
        const quotes = this.getQuotesForObjective(objectiveId);
        const isConfigured = this.isConfigured();
        const provider = this.getProvider();

        return `
            <div class="mn-objective-panel" data-objective-id="${objectiveId}">
                ${!isConfigured ? this._renderSetupPrompt() : ''}
                
                ${isConfigured ? `
                    <!-- Linked Quotes Section -->
                    <div class="mn-quotes-section">
                        <div class="mn-section-header">
                            <h4>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
                                Linked Meeting Quotes <span class="mn-quote-count">(${quotes.length})</span>
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

                    <!-- Browse Meetings / Add Quote Section -->
                    <div class="mn-browse-section" id="mn-browse-${objectiveId}" style="display:none">
                        ${this._renderAddQuoteForm(objectiveId)}
                    </div>
                ` : ''}
            </div>
        `;
    },

    // Compact badge for objective row showing quote count
    renderQuoteBadge(objectiveId) {
        const count = this.getQuoteCount(objectiveId);
        if (count === 0) return '';
        return `<span class="mn-badge" title="${count} meeting quote(s) linked"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg> ${count}</span>`;
    },

    // =========================================
    // PRIVATE RENDER HELPERS
    // =========================================
    _renderSetupPrompt() {
        return `
            <div class="mn-setup-prompt">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                <h4>Meeting Notes Not Connected</h4>
                <p>Connect Granola or another AI notetaker to link meeting transcript quotes to this assessment objective.</p>
                <button class="mn-open-settings-btn btn-secondary">Configure Meeting Notes</button>
            </div>
        `;
    },

    _renderEmptyQuotes() {
        return `
            <div class="mn-empty-quotes">
                <p>No meeting quotes linked to this objective yet.</p>
                <p class="mn-empty-hint">Click <strong>Add Quote</strong> to link a transcript excerpt showing how this control is implemented.</p>
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
                        <span class="mn-quote-provider">${this._getProviderIcon(q.provider)} ${this.config.providers[q.provider]?.label || q.provider}</span>
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
                    Link Meeting Quote to Objective
                </h4>

                <div class="mn-manual-quote">
                    <div class="mn-form-group">
                        <label>Quote Text <span class="required">*</span></label>
                        <textarea class="mn-quote-input" id="mn-quote-text-${objectiveId}" rows="4" placeholder="Paste the exact quote from the meeting transcript that demonstrates how this control is implemented..."></textarea>
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
    bindSettingsEvents(container) {
        // Provider selection
        container.querySelectorAll('.mn-provider-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.mn-provider-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const providerHelp = container.querySelector('.mn-provider-help');
                if (providerHelp) {
                    providerHelp.style.display = btn.dataset.provider === 'granola' ? 'block' : 'none';
                }
            });
        });

        // Save
        const saveBtn = container.querySelector('.mn-save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const activeProvider = container.querySelector('.mn-provider-btn.active')?.dataset.provider;
                if (!activeProvider) {
                    this._showToast('Please select a provider', 'error');
                    return;
                }
                this.setProvider(activeProvider);
                this._showToast(`${this.config.providers[activeProvider].label} connected successfully`, 'success');
                // Re-render settings to show updated state
                const parent = container.closest('.mn-settings-container');
                if (parent) {
                    parent.innerHTML = this.renderSettingsPanel();
                    this.bindSettingsEvents(parent);
                }
            });
        }

        // Disconnect
        const disconnectBtn = container.querySelector('.mn-disconnect-btn');
        if (disconnectBtn) {
            disconnectBtn.addEventListener('click', () => {
                if (confirm('Disconnect meeting notes provider? Your linked quotes will be preserved.')) {
                    this.clearProvider();
                    this._showToast('Provider disconnected', 'success');
                    const parent = container.closest('.mn-settings-container');
                    if (parent) {
                        parent.innerHTML = this.renderSettingsPanel();
                        this.bindSettingsEvents(parent);
                    }
                }
            });
        }
    },

    bindObjectivePanelEvents(container, objectiveId) {
        // Open settings
        container.querySelectorAll('.mn-open-settings-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showSettingsModal();
            });
        });

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

        // Save manual quote
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
                    assessorNote: document.getElementById(`mn-quote-note-${objectiveId}`)?.value.trim() || '',
                    provider: this.getProvider() || 'manual'
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
    // SETTINGS MODAL (standalone)
    // =========================================
    showSettingsModal() {
        // Remove existing
        document.querySelector('.mn-settings-modal-backdrop')?.remove();

        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop active mn-settings-modal-backdrop';
        backdrop.innerHTML = `
            <div class="modal-content" style="max-width: 640px;">
                <div class="modal-header">
                    <h2>Meeting Notes Integration</h2>
                    <button class="modal-close mn-modal-close-btn">&times;</button>
                </div>
                <div class="modal-body mn-settings-container">
                    ${this.renderSettingsPanel()}
                </div>
            </div>
        `;
        document.body.appendChild(backdrop);
        this.bindSettingsEvents(backdrop.querySelector('.mn-settings-container'));

        // Close on X button
        backdrop.querySelector('.mn-modal-close-btn').addEventListener('click', () => {
            backdrop.remove();
        });

        // Close on backdrop click
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) backdrop.remove();
        });

        // Close on Escape key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                backdrop.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
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
    },

    _getProviderIcon(providerId) {
        const icons = {
            granola: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>',
            otter: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>',
            fireflies: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/></svg>',
            fathom: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
            manual: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>'
        };
        return icons[providerId] || icons.manual;
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MeetingNotesIntegration.init());
} else {
    MeetingNotesIntegration.init();
}
