/**
 * Unified AI Provider Module
 * Supports Anthropic (Claude), OpenAI (GPT/o-series), and Google (Gemini)
 * Provides a single interface for all AI API calls with dynamic model selection.
 * API keys stored in sessionStorage (never persisted to disk).
 */

const AIProvider = {

    // ── Provider Definitions ──────────────────────────────────────────
    PROVIDERS: {
        anthropic: {
            name: 'Anthropic',
            apiUrl: 'https://api.anthropic.com/v1/messages',
            keyPrefix: 'sk-ant-',
            keyPlaceholder: 'sk-ant-...',
            keySessionKey: 'ai-key-anthropic',
            models: [
                { id: 'claude-opus-4-6-20260205', name: 'Claude Opus 4.6', context: '200K', tier: 'premium' },
                { id: 'claude-opus-4-5-20251101', name: 'Claude Opus 4.5', context: '200K', tier: 'premium' },
                { id: 'claude-sonnet-4-5-20260210', name: 'Claude Sonnet 4.5', context: '200K', tier: 'recommended' },
                { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', context: '200K', tier: 'standard' },
                { id: 'claude-opus-4-20250514', name: 'Claude Opus 4', context: '200K', tier: 'standard' },
                { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', context: '200K', tier: 'fast' }
            ]
        },
        openai: {
            name: 'OpenAI',
            apiUrl: 'https://api.openai.com/v1/chat/completions',
            keyPrefix: 'sk-',
            keyPlaceholder: 'sk-...',
            keySessionKey: 'ai-key-openai',
            models: [
                { id: 'gpt-5.2-codex', name: 'GPT-5.2 Codex', context: '200K', tier: 'premium' },
                { id: 'gpt-5.1', name: 'GPT-5.1', context: '1M', tier: 'premium' },
                { id: 'gpt-5.1-mini', name: 'GPT-5.1 Mini', context: '1M', tier: 'standard' },
                { id: 'gpt-4.1', name: 'GPT-4.1', context: '1M', tier: 'recommended' },
                { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', context: '1M', tier: 'fast' },
                { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', context: '1M', tier: 'fast' },
                { id: 'o3', name: 'o3', context: '200K', tier: 'premium' },
                { id: 'o4-mini', name: 'o4-mini', context: '200K', tier: 'standard' }
            ]
        },
        google: {
            name: 'Google',
            apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/',
            keyPrefix: '',
            keyPlaceholder: 'AIza...',
            keySessionKey: 'ai-key-google',
            models: [
                { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro (Preview)', context: '1M', tier: 'premium' },
                { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Preview)', context: '1M', tier: 'standard' },
                { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', context: '1M', tier: 'recommended' },
                { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', context: '1M', tier: 'fast' },
                { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite', context: '1M', tier: 'fast' },
                { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', context: '1M', tier: 'standard' }
            ]
        }
    },

    // ── State ─────────────────────────────────────────────────────────
    _activeProvider: null,
    _activeModel: null,

    /** Get/set the active provider id */
    getActiveProvider() {
        if (!this._activeProvider) {
            this._activeProvider = sessionStorage.getItem('ai-active-provider') || null;
        }
        return this._activeProvider;
    },
    setActiveProvider(providerId) {
        this._activeProvider = providerId;
        sessionStorage.setItem('ai-active-provider', providerId);
    },

    /** Get/set the active model id */
    getActiveModel() {
        if (!this._activeModel) {
            this._activeModel = sessionStorage.getItem('ai-active-model') || null;
        }
        return this._activeModel;
    },
    setActiveModel(modelId) {
        this._activeModel = modelId;
        sessionStorage.setItem('ai-active-model', modelId);
    },

    // ── Key Management ────────────────────────────────────────────────
    getApiKey(providerId) {
        const prov = this.PROVIDERS[providerId];
        if (!prov) return null;
        return sessionStorage.getItem(prov.keySessionKey) || null;
    },

    setApiKey(providerId, key) {
        const prov = this.PROVIDERS[providerId];
        if (!prov) throw new Error('Unknown provider: ' + providerId);
        if (!key || typeof key !== 'string' || key.trim().length < 8) {
            throw new Error('Invalid API key format.');
        }
        if (prov.keyPrefix && !key.startsWith(prov.keyPrefix)) {
            throw new Error('Key must start with ' + prov.keyPrefix);
        }
        sessionStorage.setItem(prov.keySessionKey, key.trim());
    },

    clearApiKey(providerId) {
        const prov = this.PROVIDERS[providerId];
        if (prov) sessionStorage.removeItem(prov.keySessionKey);
        if (this._activeProvider === providerId) {
            this._activeProvider = null;
            this._activeModel = null;
            sessionStorage.removeItem('ai-active-provider');
            sessionStorage.removeItem('ai-active-model');
        }
    },

    /** Check if any provider is configured and ready */
    isConfigured() {
        const prov = this.getActiveProvider();
        return prov && !!this.getApiKey(prov);
    },

    /** Get display name for current provider + model */
    getActiveDisplayName() {
        const provId = this.getActiveProvider();
        const modelId = this.getActiveModel();
        if (!provId) return 'Not connected';
        const prov = this.PROVIDERS[provId];
        const model = prov?.models.find(m => m.id === modelId);
        return model ? model.name : (prov?.name || provId);
    },

    // ── Unified Send ──────────────────────────────────────────────────
    async sendMessage(systemPrompt, messages, options = {}) {
        const providerId = this.getActiveProvider();
        const modelId = options.model || this.getActiveModel();
        const apiKey = this.getApiKey(providerId);

        if (!providerId || !apiKey) {
            throw new Error('AI provider not configured. Please connect an API key.');
        }

        switch (providerId) {
            case 'anthropic': return this._sendAnthropic(apiKey, modelId, systemPrompt, messages, options);
            case 'openai':    return this._sendOpenAI(apiKey, modelId, systemPrompt, messages, options);
            case 'google':    return this._sendGoogle(apiKey, modelId, systemPrompt, messages, options);
            default: throw new Error('Unknown provider: ' + providerId);
        }
    },

    // ── Anthropic ─────────────────────────────────────────────────────
    async _sendAnthropic(apiKey, modelId, systemPrompt, messages, options) {
        const body = {
            model: modelId || 'claude-sonnet-4-5-20260210',
            max_tokens: options.max_tokens || 4096,
            system: systemPrompt,
            messages: messages
        };
        if (options.temperature !== undefined) body.temperature = options.temperature;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            if (response.status === 401) { this.clearApiKey('anthropic'); throw new Error('Invalid API key.'); }
            if (response.status === 429) throw new Error('Rate limited. Please wait and try again.');
            throw new Error(err.error?.message || 'Anthropic API error: ' + response.status);
        }

        const data = await response.json();
        return {
            text: data.content?.map(c => c.text).join('') || '',
            usage: data.usage,
            stopReason: data.stop_reason
        };
    },

    // ── OpenAI ────────────────────────────────────────────────────────
    async _sendOpenAI(apiKey, modelId, systemPrompt, messages, options) {
        const oaiMessages = [
            { role: 'system', content: systemPrompt },
            ...messages
        ];

        const body = {
            model: modelId || 'gpt-4.1',
            messages: oaiMessages,
            max_completion_tokens: options.max_tokens || 4096
        };
        if (options.temperature !== undefined) body.temperature = options.temperature;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            if (response.status === 401) { this.clearApiKey('openai'); throw new Error('Invalid API key.'); }
            if (response.status === 429) throw new Error('Rate limited. Please wait and try again.');
            throw new Error(err.error?.message || 'OpenAI API error: ' + response.status);
        }

        const data = await response.json();
        const choice = data.choices?.[0];
        return {
            text: choice?.message?.content || '',
            usage: data.usage,
            stopReason: choice?.finish_reason
        };
    },

    // ── Google Gemini ─────────────────────────────────────────────────
    async _sendGoogle(apiKey, modelId, systemPrompt, messages, options) {
        const model = modelId || 'gemini-2.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // Convert messages to Gemini format
        const contents = messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        const body = {
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: contents,
            generationConfig: {
                maxOutputTokens: options.max_tokens || 4096
            }
        };
        if (options.temperature !== undefined) body.generationConfig.temperature = options.temperature;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            if (response.status === 400 || response.status === 403) {
                this.clearApiKey('google');
                throw new Error('Invalid API key or permission denied.');
            }
            if (response.status === 429) throw new Error('Rate limited. Please wait and try again.');
            throw new Error(err.error?.message || 'Gemini API error: ' + response.status);
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];
        const text = candidate?.content?.parts?.map(p => p.text).join('') || '';
        return {
            text: text,
            usage: data.usageMetadata || null,
            stopReason: candidate?.finishReason
        };
    },

    // ── UI Helpers ────────────────────────────────────────────────────

    /** Render provider + model selector HTML */
    renderSetupHTML() {
        let html = '<div class="ai-provider-setup">';
        html += '<h3>Connect AI Provider</h3>';
        html += '<p>Choose your AI provider and model. Your key is stored in session memory only.</p>';

        // Provider tabs
        html += '<div class="ai-provider-tabs">';
        for (const [id, prov] of Object.entries(this.PROVIDERS)) {
            html += `<button class="ai-provider-tab" data-provider="${id}">${prov.name}</button>`;
        }
        html += '</div>';

        // Model + key area (populated dynamically)
        html += '<div id="ai-provider-config" class="ai-provider-config"></div>';
        html += '</div>';
        return html;
    },

    /** Render config panel for a specific provider */
    renderProviderConfig(providerId) {
        const prov = this.PROVIDERS[providerId];
        if (!prov) return '';

        let html = '<div class="ai-model-select-group">';
        html += '<label>Model</label>';
        html += `<select id="ai-model-select" class="ai-model-select">`;
        for (const m of prov.models) {
            const badge = m.tier === 'recommended' ? ' ★' : m.tier === 'premium' ? ' ◆' : m.tier === 'fast' ? ' ⚡' : '';
            html += `<option value="${m.id}">${m.name} (${m.context})${badge}</option>`;
        }
        html += '</select></div>';

        html += '<div class="ai-key-input-group">';
        html += `<input type="password" id="ai-api-key-input" class="ai-key-input" placeholder="${prov.keyPlaceholder}" autocomplete="off" spellcheck="false">`;
        html += '<button id="ai-connect-btn" class="ai-connect-btn">Connect</button>';
        html += '</div>';

        html += '<div class="ai-key-note">';
        html += '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
        html += ` Key never leaves your browser. Calls go directly to ${prov.name} API.`;
        html += '</div>';

        return html;
    }
};

// Backward-compatible shim: ClaudeAPI delegates to AIProvider
const ClaudeAPI = {
    get MODEL() { return AIProvider.getActiveModel() || 'claude-sonnet-4-5-20260210'; },
    getApiKey() { return AIProvider.getApiKey(AIProvider.getActiveProvider() || 'anthropic'); },
    setApiKey(key) {
        AIProvider.setApiKey('anthropic', key);
        AIProvider.setActiveProvider('anthropic');
        AIProvider.setActiveModel('claude-sonnet-4-5-20260210');
    },
    clearApiKey() { AIProvider.clearApiKey(AIProvider.getActiveProvider() || 'anthropic'); },
    isConfigured() { return AIProvider.isConfigured(); },
    async sendMessage(systemPrompt, messages, options = {}) {
        return AIProvider.sendMessage(systemPrompt, messages, options);
    },
    buildAssessmentContext: null,
    buildObjectiveContext: null
};

console.log('[AIProvider] Module loaded');
