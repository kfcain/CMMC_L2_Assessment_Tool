// Meeting Notes Integration Module
// Supports Granola API (primary) + manual paste from any AI notetaker
// Allows linking meeting transcript quotes to assessment objectives as evidence
// Data persisted in localStorage; API calls go direct to Granola public API

const MeetingNotesIntegration = {
    config: {
        version: "1.0.0",
        storageKey: "nist-meeting-notes",
        configKey: "nist-meeting-notes-config",
        quotesKey: "nist-meeting-quotes",
        granola: {
            baseUrl: "https://public-api.granola.ai/v1",
            pageSize: 20
        },
        providers: {
            granola: { label: "Granola", icon: "granola", hasApi: true },
            otter: { label: "Otter.ai", icon: "otter", hasApi: false },
            fireflies: { label: "Fireflies.ai", icon: "fireflies", hasApi: false },
            fathom: { label: "Fathom", icon: "fathom", hasApi: false },
            manual: { label: "Manual / Other", icon: "manual", hasApi: false }
        }
    },

    // Cached meeting notes from API
    meetingsCache: [],
    // Linked quotes per objective: { [objectiveId]: [{ quoteId, text, speaker, timestamp, meetingId, meetingTitle, ... }] }
    linkedQuotes: {},
    // Manual meeting entries (for non-API providers)
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
        const provider = this.getProvider();
        if (!provider) return false;
        if (this.config.providers[provider]?.hasApi) {
            return !!this.getApiKey();
        }
        return true; // Non-API providers are always "configured"
    },

    isGranolaConfigured() {
        return this.getProvider() === 'granola' && !!this.getApiKey();
    },

    setProvider(providerId, apiKey) {
        this.providerConfig.provider = providerId;
        if (apiKey) this.providerConfig.apiKey = apiKey;
        this.saveConfig();
    },

    clearProvider() {
        this.providerConfig = {};
        this.saveConfig();
        this.meetingsCache = [];
    },

    // =========================================
    // GRANOLA API CLIENT
    // =========================================
    async fetchMeetings(options = {}) {
        if (!this.isGranolaConfigured()) {
            throw new Error('Granola API not configured. Add your API key in Meeting Notes settings.');
        }

        const params = new URLSearchParams();
        if (options.before) params.set('before', options.before);
        if (options.after) params.set('after', options.after);
        if (options.cursor) params.set('cursor', options.cursor);
        params.set('limit', String(options.limit || this.config.granola.pageSize));

        const url = `${this.config.granola.baseUrl}/notes?${params.toString()}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.getApiKey()}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error('Invalid Granola API key. Check Settings > Workspaces > API.');
            if (response.status === 429) throw new Error('Rate limited by Granola API. Please wait a moment.');
            throw new Error(`Granola API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        this.meetingsCache = data.notes || [];
        return {
            notes: data.notes || [],
            hasMore: data.hasMore || false,
            cursor: data.cursor || null
        };
    },

    async fetchMeetingDetail(noteId) {
        if (!this.isGranolaConfigured()) {
            throw new Error('Granola API not configured.');
        }

        const url = `${this.config.granola.baseUrl}/notes/${noteId}?transcript=transcript`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.getApiKey()}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch meeting: ${response.status}`);
        }

        return await response.json();
    },

    async testConnection() {
        try {
            const result = await this.fetchMeetings({ limit: 1 });
            return { success: true, noteCount: result.notes.length };
        } catch (error) {
            return { success: false, error: error.message };
        }
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
        // Combine API cache + manual meetings, sorted by date desc
        const all = [
            ...this.meetingsCache.map(n => ({
                id: n.id,
                title: n.title,
                date: n.created_at,
                provider: 'granola',
                source: 'api',
                owner: n.owner?.name || '',
                summary: n.summary_text || ''
            })),
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

    // Settings panel for configuring provider + API key
    renderSettingsPanel() {
        const provider = this.getProvider();
        const apiKey = this.getApiKey();
        const isConfigured = this.isConfigured();

        return `
            <div class="meeting-notes-settings">
                <div class="mn-settings-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    <h3>Meeting Notes Integration</h3>
                    ${isConfigured ? '<span class="mn-status-badge connected">Connected</span>' : '<span class="mn-status-badge disconnected">Not Connected</span>'}
                </div>
                <p class="mn-settings-desc">Connect your AI meeting notetaker to link transcript quotes directly to assessment objectives as evidence of how controls are implemented.</p>
                
                <div class="mn-provider-select">
                    <label>Meeting Notes Provider</label>
                    <div class="mn-provider-grid">
                        ${Object.entries(this.config.providers).map(([id, p]) => `
                            <button class="mn-provider-btn ${provider === id ? 'active' : ''}" data-provider="${id}">
                                <span class="mn-provider-icon">${this._getProviderIcon(id)}</span>
                                <span>${p.label}</span>
                                ${p.hasApi ? '<span class="mn-api-badge">API</span>' : ''}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="mn-api-config" style="display: ${provider === 'granola' ? 'block' : 'none'}">
                    <label>Granola API Key</label>
                    <div class="mn-api-key-row">
                        <input type="password" class="mn-api-key-input" placeholder="Bearer token from Granola Settings > Workspaces > API" value="${apiKey || ''}" />
                        <button class="mn-test-btn" title="Test Connection">Test</button>
                    </div>
                    <small class="mn-api-help">Get your API key: Granola app &rarr; Settings &rarr; Workspaces &rarr; API tab &rarr; Generate API Key</small>
                    <div class="mn-test-result" style="display:none"></div>
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
        const provider = this.getProvider();
        const isGranola = provider === 'granola';

        return `
            <div class="mn-add-quote-form">
                <h4>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Link Meeting Quote to Objective
                </h4>

                ${isGranola ? `
                    <div class="mn-granola-browse">
                        <div class="mn-browse-controls">
                            <button class="mn-fetch-meetings-btn btn-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                                Load Recent Meetings from Granola
                            </button>
                        </div>
                        <div class="mn-meetings-list" id="mn-meetings-list-${objectiveId}"></div>
                        <div class="mn-transcript-viewer" id="mn-transcript-${objectiveId}" style="display:none">
                            <div class="mn-transcript-header">
                                <h5 id="mn-transcript-title-${objectiveId}"></h5>
                                <button class="mn-close-transcript-btn">&times;</button>
                            </div>
                            <div class="mn-transcript-search">
                                <input type="text" class="mn-transcript-search-input" placeholder="Search transcript..." data-objective-id="${objectiveId}" />
                            </div>
                            <div class="mn-transcript-content" id="mn-transcript-content-${objectiveId}"></div>
                        </div>
                    </div>
                    <div class="mn-divider"><span>or paste manually</span></div>
                ` : ''}

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

    _renderMeetingsList(meetings, objectiveId) {
        if (meetings.length === 0) {
            return '<p class="mn-no-meetings">No meetings found. Check your Granola API connection.</p>';
        }
        return meetings.map(m => `
            <div class="mn-meeting-item" data-meeting-id="${m.id}" data-objective-id="${objectiveId}">
                <div class="mn-meeting-info">
                    <strong>${this._escapeHtml(m.title)}</strong>
                    <span class="mn-meeting-date">${new Date(m.created_at).toLocaleDateString()} ${new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    ${m.owner ? `<span class="mn-meeting-owner">${this._escapeHtml(m.owner.name)}</span>` : ''}
                </div>
                <button class="mn-view-transcript-btn btn-secondary" data-meeting-id="${m.id}" data-objective-id="${objectiveId}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    View Transcript
                </button>
            </div>
        `).join('');
    },

    _renderTranscript(transcript, objectiveId, meetingTitle) {
        if (!transcript || transcript.length === 0) {
            return '<p class="mn-no-transcript">No transcript available for this meeting.</p>';
        }
        return transcript.map((entry, idx) => {
            const speaker = entry.speaker?.source === 'microphone' ? 'You' : (entry.speaker?.name || 'Other');
            const time = entry.start_time ? new Date(entry.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
            return `
                <div class="mn-transcript-line" data-line-idx="${idx}">
                    <div class="mn-transcript-line-meta">
                        <span class="mn-transcript-speaker ${entry.speaker?.source === 'microphone' ? 'self' : ''}">${this._escapeHtml(speaker)}</span>
                        ${time ? `<span class="mn-transcript-time">${time}</span>` : ''}
                    </div>
                    <div class="mn-transcript-line-text">${this._escapeHtml(entry.text)}</div>
                    <button class="mn-select-quote-btn" data-line-idx="${idx}" data-objective-id="${objectiveId}" data-meeting-title="${this._escapeHtml(meetingTitle)}" title="Use this as a quote">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
                        Quote
                    </button>
                </div>
            `;
        }).join('');
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
                const apiConfig = container.querySelector('.mn-api-config');
                if (apiConfig) {
                    apiConfig.style.display = btn.dataset.provider === 'granola' ? 'block' : 'none';
                }
            });
        });

        // Test connection
        const testBtn = container.querySelector('.mn-test-btn');
        if (testBtn) {
            testBtn.addEventListener('click', async () => {
                const keyInput = container.querySelector('.mn-api-key-input');
                const resultDiv = container.querySelector('.mn-test-result');
                if (!keyInput?.value.trim()) {
                    resultDiv.style.display = 'block';
                    resultDiv.innerHTML = '<span class="mn-test-error">Please enter an API key first.</span>';
                    return;
                }
                testBtn.disabled = true;
                testBtn.textContent = 'Testing...';
                // Temporarily set key for test
                const oldKey = this.providerConfig.apiKey;
                this.providerConfig.apiKey = keyInput.value.trim();
                this.providerConfig.provider = 'granola';
                const result = await this.testConnection();
                this.providerConfig.apiKey = oldKey; // Restore
                resultDiv.style.display = 'block';
                if (result.success) {
                    resultDiv.innerHTML = '<span class="mn-test-success">Connected successfully! Granola API is reachable.</span>';
                } else {
                    resultDiv.innerHTML = `<span class="mn-test-error">Connection failed: ${this._escapeHtml(result.error)}</span>`;
                }
                testBtn.disabled = false;
                testBtn.textContent = 'Test';
            });
        }

        // Save
        const saveBtn = container.querySelector('.mn-save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const activeProvider = container.querySelector('.mn-provider-btn.active')?.dataset.provider;
                if (!activeProvider) {
                    this._showToast('Please select a provider', 'error');
                    return;
                }
                const apiKey = container.querySelector('.mn-api-key-input')?.value.trim() || null;
                if (activeProvider === 'granola' && !apiKey) {
                    this._showToast('Granola requires an API key', 'error');
                    return;
                }
                this.setProvider(activeProvider, apiKey);
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

        // Fetch meetings from Granola
        container.querySelectorAll('.mn-fetch-meetings-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                btn.disabled = true;
                btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mn-spin"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg> Loading...';
                try {
                    const result = await this.fetchMeetings();
                    const listEl = container.querySelector(`#mn-meetings-list-${objectiveId}`);
                    if (listEl) {
                        listEl.innerHTML = this._renderMeetingsList(result.notes, objectiveId);
                        this._bindMeetingsListEvents(container, objectiveId);
                    }
                } catch (error) {
                    this._showToast(error.message, 'error');
                }
                btn.disabled = false;
                btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg> Load Recent Meetings from Granola';
            });
        });

        // Close transcript viewer
        container.querySelectorAll('.mn-close-transcript-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const viewer = container.querySelector(`#mn-transcript-${objectiveId}`);
                if (viewer) viewer.style.display = 'none';
            });
        });

        // Transcript search
        container.querySelectorAll('.mn-transcript-search-input').forEach(input => {
            let debounce;
            input.addEventListener('input', () => {
                clearTimeout(debounce);
                debounce = setTimeout(() => {
                    const query = input.value.toLowerCase();
                    const lines = container.querySelectorAll(`#mn-transcript-content-${objectiveId} .mn-transcript-line`);
                    lines.forEach(line => {
                        const text = line.querySelector('.mn-transcript-line-text')?.textContent.toLowerCase() || '';
                        line.style.display = !query || text.includes(query) ? '' : 'none';
                        // Highlight matches
                        if (query && text.includes(query)) {
                            line.classList.add('mn-highlight');
                        } else {
                            line.classList.remove('mn-highlight');
                        }
                    });
                }, 200);
            });
        });
    },

    _bindMeetingsListEvents(container, objectiveId) {
        // View transcript buttons
        container.querySelectorAll('.mn-view-transcript-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const meetingId = btn.dataset.meetingId;
                btn.disabled = true;
                btn.textContent = 'Loading...';
                try {
                    const detail = await this.fetchMeetingDetail(meetingId);
                    const viewer = container.querySelector(`#mn-transcript-${objectiveId}`);
                    const titleEl = container.querySelector(`#mn-transcript-title-${objectiveId}`);
                    const contentEl = container.querySelector(`#mn-transcript-content-${objectiveId}`);
                    if (viewer && titleEl && contentEl) {
                        titleEl.textContent = detail.title || 'Meeting Transcript';
                        contentEl.innerHTML = this._renderTranscript(detail.transcript || [], objectiveId, detail.title);
                        viewer.style.display = 'block';
                        this._bindTranscriptQuoteButtons(container, objectiveId, detail);
                    }
                } catch (error) {
                    this._showToast('Failed to load transcript: ' + error.message, 'error');
                }
                btn.disabled = false;
                btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> View Transcript';
            });
        });
    },

    _bindTranscriptQuoteButtons(container, objectiveId, meetingDetail) {
        container.querySelectorAll('.mn-select-quote-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lineIdx = parseInt(btn.dataset.lineIdx);
                const transcript = meetingDetail.transcript || [];
                const entry = transcript[lineIdx];
                if (!entry) return;

                // Pre-fill the manual quote form with this transcript line
                const textEl = document.getElementById(`mn-quote-text-${objectiveId}`);
                const speakerEl = document.getElementById(`mn-quote-speaker-${objectiveId}`);
                const meetingEl = document.getElementById(`mn-quote-meeting-${objectiveId}`);
                const dateEl = document.getElementById(`mn-quote-date-${objectiveId}`);

                if (textEl) textEl.value = entry.text;
                if (speakerEl) speakerEl.value = entry.speaker?.source === 'microphone' ? 'Assessor (You)' : (entry.speaker?.name || 'OSC Representative');
                if (meetingEl) meetingEl.value = meetingDetail.title || '';
                if (dateEl && meetingDetail.created_at) dateEl.value = meetingDetail.created_at.split('T')[0];

                // Scroll to form
                const form = container.querySelector('.mn-manual-quote');
                if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });

                this._showToast('Quote selected — edit details and click "Link Quote to Objective"', 'info');
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
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">&times;</button>
                </div>
                <div class="modal-body mn-settings-container">
                    ${this.renderSettingsPanel()}
                </div>
            </div>
        `;
        document.body.appendChild(backdrop);
        this.bindSettingsEvents(backdrop.querySelector('.mn-settings-container'));

        // Close on backdrop click
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) backdrop.remove();
        });
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
