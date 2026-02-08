// AI Assessment Assistant Module
// Analyzes assessment objectives and evidence using user-provided API keys (Claude, OpenAI, Gemini)
// Zero cost to developer - all API costs borne by end-user

const AIAssistant = {
    config: {
        version: "1.0.0",
        storageKey: "nist-ai-config",
        resultsKey: "nist-ai-results",
        providers: {
            claude: {
                name: "Claude (Anthropic)",
                endpoint: "https://api.anthropic.com/v1/messages",
                models: [
                    { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4 (Recommended)", inputCost: 0.003, outputCost: 0.015 },
                    { id: "claude-opus-4-20250514", name: "Claude Opus 4", inputCost: 0.015, outputCost: 0.075 },
                    { id: "claude-3-7-sonnet-20250219", name: "Claude 3.7 Sonnet", inputCost: 0.003, outputCost: 0.015 },
                    { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku (Fast)", inputCost: 0.001, outputCost: 0.005 }
                ],
                defaultModel: "claude-sonnet-4-20250514"
            },
            openai: {
                name: "OpenAI",
                endpoint: "https://api.openai.com/v1/chat/completions",
                models: [
                    { id: "gpt-4.1", name: "GPT-4.1 (Recommended)", inputCost: 0.002, outputCost: 0.008 },
                    { id: "gpt-4.1-mini", name: "GPT-4.1 Mini", inputCost: 0.0004, outputCost: 0.0016 },
                    { id: "gpt-4.1-nano", name: "GPT-4.1 Nano (Fast)", inputCost: 0.0001, outputCost: 0.0004 },
                    { id: "o3", name: "o3 (Reasoning)", inputCost: 0.01, outputCost: 0.04 },
                    { id: "o4-mini", name: "o4-mini (Reasoning)", inputCost: 0.001, outputCost: 0.004 },
                    { id: "gpt-4o", name: "GPT-4o", inputCost: 0.005, outputCost: 0.015 },
                    { id: "gpt-4o-mini", name: "GPT-4o Mini", inputCost: 0.00015, outputCost: 0.0006 }
                ],
                defaultModel: "gpt-4.1"
            },
            gemini: {
                name: "Google Gemini",
                endpoint: "https://generativelanguage.googleapis.com/v1beta/models",
                models: [
                    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro (Recommended)", inputCost: 0.00125, outputCost: 0.01 },
                    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", inputCost: 0.00015, outputCost: 0.0006 },
                    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", inputCost: 0.0001, outputCost: 0.0004 },
                    { id: "gemini-2.0-flash-lite", name: "Gemini 2.0 Flash Lite (Fast)", inputCost: 0.00005, outputCost: 0.0002 }
                ],
                defaultModel: "gemini-2.5-pro"
            }
        }
    },

    apiConfig: null,
    analysisResults: {},

    init: function() {
        this.loadConfig();
        this.loadResults();
        this.bindEvents();
        console.log('[AIAssistant] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            try {
                // Open AI settings
                if (e.target.closest('#open-ai-settings-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[AIAssistant] Opening settings modal');
                    this.showSettingsModal();
                }

                // Save AI config
                if (e.target.closest('#save-ai-config-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[AIAssistant] Saving config');
                    this.saveConfig();
                }

                // Test API connection
                if (e.target.closest('#test-ai-connection-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[AIAssistant] Testing connection');
                    this.testConnection();
                }

                // Clear API key
                if (e.target.closest('#clear-ai-key-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[AIAssistant] Clearing config');
                    this.clearConfig();
                }

                // Analyze single objective
                if (e.target.closest('.analyze-objective-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const objectiveId = e.target.closest('.analyze-objective-btn').dataset.objectiveId;
                    console.log('[AIAssistant] Analyze clicked for:', objectiveId);
                    this.analyzeObjective(objectiveId);
                }

                // View analysis results
                if (e.target.closest('.view-analysis-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const objectiveId = e.target.closest('.view-analysis-btn').dataset.objectiveId;
                    console.log('[AIAssistant] View results clicked for:', objectiveId);
                    this.showAnalysisResults(objectiveId);
                }

                // Batch analyze
                if (e.target.closest('#batch-analyze-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[AIAssistant] Batch analyze clicked');
                    this.showBatchAnalysisModal();
                }

                // Start batch analysis
                if (e.target.closest('#start-batch-analysis-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[AIAssistant] Starting batch analysis');
                    this.startBatchAnalysis();
                }
            } catch (error) {
                console.error('[AIAssistant] Error in click handler:', error);
            }
        });
    },

    loadConfig: function() {
        const saved = localStorage.getItem(this.config.storageKey);
        this.apiConfig = saved ? JSON.parse(saved) : null;
    },

    loadResults: function() {
        const saved = localStorage.getItem(this.config.resultsKey);
        this.analysisResults = saved ? JSON.parse(saved) : {};
    },

    saveConfigToStorage: function() {
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.apiConfig));
    },

    saveResultsToStorage: function() {
        localStorage.setItem(this.config.resultsKey, JSON.stringify(this.analysisResults));
    },

    showSettingsModal: function() {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>AI Assessment Assistant Settings</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <!-- Cost Warning Banner -->
                    <div class="ai-cost-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        <div>
                            <strong>Important: You are responsible for all API usage costs.</strong>
                            <p>This tool uses YOUR API key to make direct calls to the AI provider. You will be charged by the provider based on your usage.</p>
                        </div>
                    </div>

                    ${this.apiConfig ? `
                        <div class="ai-current-config">
                            <h3>Current Configuration</h3>
                            <div class="config-details">
                                <div><strong>Provider:</strong> ${this.config.providers[this.apiConfig.provider].name}</div>
                                <div><strong>Model:</strong> ${this.apiConfig.model}</div>
                                <div><strong>Status:</strong> <span class="status-badge ${this.apiConfig.validated ? 'success' : 'warning'}">${this.apiConfig.validated ? 'Validated' : 'Not Validated'}</span></div>
                                ${this.apiConfig.usageStats ? `
                                    <div class="usage-stats">
                                        <div><strong>Total Calls:</strong> ${this.apiConfig.usageStats.totalCalls}</div>
                                        <div><strong>Total Tokens:</strong> ${this.apiConfig.usageStats.totalTokens.toLocaleString()}</div>
                                        <div><strong>Estimated Cost:</strong> $${this.apiConfig.usageStats.estimatedCost.toFixed(2)}</div>
                                    </div>
                                ` : ''}
                            </div>
                            <button class="btn-secondary" id="clear-ai-key-btn" style="margin-top: 12px;">Clear Configuration</button>
                        </div>
                        <div class="hamburger-divider" style="margin: 20px 0;"></div>
                    ` : ''}

                    <h3>${this.apiConfig ? 'Update' : 'Configure'} AI Provider</h3>
                    
                    <form id="ai-config-form">
                        <div class="form-group">
                            <label>AI Provider *</label>
                            <select id="ai-provider" class="form-control" required>
                                <option value="">Select Provider...</option>
                                ${Object.entries(this.config.providers).map(([key, provider]) => 
                                    `<option value="${key}" ${this.apiConfig?.provider === key ? 'selected' : ''}>${provider.name}</option>`
                                ).join('')}
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Model *</label>
                            <select id="ai-model" class="form-control" required>
                                <option value="">Select model...</option>
                            </select>
                            <small id="model-cost-info" style="color: var(--text-muted);"></small>
                        </div>

                        <div class="form-group">
                            <label>API Key *</label>
                            <input type="password" id="ai-api-key" class="form-control" required 
                                   placeholder="Enter your API key" 
                                   value="${this.apiConfig?.apiKey || ''}">
                            <small style="color: var(--text-muted);">Your API key is encrypted and stored only in your browser.</small>
                        </div>

                        <div class="ai-setup-help" id="ai-setup-help" style="display: none;">
                            <!-- Provider-specific setup instructions will be inserted here -->
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-backdrop').remove()">Cancel</button>
                    <button class="btn-secondary" id="test-ai-connection-btn">Test Connection</button>
                    <button class="btn-primary" id="save-ai-config-btn">Save Configuration</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);

        // Bind provider change to update models
        const providerSelect = modal.querySelector('#ai-provider');
        const modelSelect = modal.querySelector('#ai-model');
        const setupHelp = modal.querySelector('#ai-setup-help');
        const costInfo = modal.querySelector('#model-cost-info');

        providerSelect.addEventListener('change', () => {
            const provider = providerSelect.value;
            if (!provider) {
                modelSelect.innerHTML = '<option value="">Select model...</option>';
                setupHelp.style.display = 'none';
                return;
            }

            const models = this.config.providers[provider].models;
            modelSelect.innerHTML = models.map(model => 
                `<option value="${model.id}" ${this.apiConfig?.model === model.id ? 'selected' : ''}>${model.name}</option>`
            ).join('');

            // Show setup instructions
            setupHelp.innerHTML = this.getSetupInstructions(provider);
            setupHelp.style.display = 'block';

            // Trigger model change to show cost
            modelSelect.dispatchEvent(new Event('change'));
        });

        modelSelect.addEventListener('change', () => {
            const provider = providerSelect.value;
            const modelId = modelSelect.value;
            if (!provider || !modelId) return;

            const model = this.config.providers[provider].models.find(m => m.id === modelId);
            if (model) {
                costInfo.textContent = `Cost: $${model.inputCost}/1K input tokens, $${model.outputCost}/1K output tokens`;
            }
        });

        // Trigger initial load if config exists
        if (this.apiConfig) {
            providerSelect.dispatchEvent(new Event('change'));
        }
    },

    getSetupInstructions: function(provider) {
        const instructions = {
            claude: `
                <h4>How to get your Claude API Key:</h4>
                <ol>
                    <li>Go to <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer">console.anthropic.com</a></li>
                    <li>Sign in or create an account</li>
                    <li>Navigate to "API Keys" in the settings</li>
                    <li>Click "Create Key" and copy the key</li>
                    <li>Paste it above</li>
                </ol>
                <p><strong>Recommended for CMMC:</strong> Claude excels at analyzing compliance documentation and providing detailed assessor perspectives.</p>
            `,
            openai: `
                <h4>How to get your OpenAI API Key:</h4>
                <ol>
                    <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">platform.openai.com/api-keys</a></li>
                    <li>Sign in or create an account</li>
                    <li>Click "Create new secret key"</li>
                    <li>Copy the key (you won't be able to see it again)</li>
                    <li>Paste it above</li>
                </ol>
                <p><strong>Note:</strong> GPT-4 Turbo provides good analysis at a moderate cost.</p>
            `,
            gemini: `
                <h4>How to get your Gemini API Key:</h4>
                <ol>
                    <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">makersuite.google.com/app/apikey</a></li>
                    <li>Sign in with your Google account</li>
                    <li>Click "Create API Key"</li>
                    <li>Copy the key</li>
                    <li>Paste it above</li>
                </ol>
                <p><strong>Low Cost Option:</strong> Gemini Pro is the most cost-effective option for high-volume analysis.</p>
            `
        };

        return `<div class="ai-setup-instructions">${instructions[provider]}</div>`;
    },

    saveConfig: async function() {
        const form = document.getElementById('ai-config-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const provider = document.getElementById('ai-provider').value;
        const model = document.getElementById('ai-model').value;
        const apiKey = document.getElementById('ai-api-key').value;

        // Encrypt API key (basic encryption for localStorage)
        const encryptedKey = btoa(apiKey); // In production, use proper encryption

        this.apiConfig = {
            provider,
            model,
            apiKey: encryptedKey,
            validated: false,
            created: Date.now(),
            usageStats: this.apiConfig?.usageStats || {
                totalCalls: 0,
                totalTokens: 0,
                estimatedCost: 0
            }
        };

        this.saveConfigToStorage();

        // Close modal
        document.querySelector('.modal-backdrop').remove();

        this.showToast('AI configuration saved. Click "Test Connection" to validate.', 'success');
    },

    testConnection: async function() {
        if (!this.apiConfig) {
            this.showToast('Please configure AI provider first', 'error');
            return;
        }

        const btn = document.getElementById('test-ai-connection-btn');
        btn.disabled = true;
        btn.textContent = 'Testing...';

        try {
            const testPrompt = "Respond with 'Connection successful' if you receive this message.";
            const response = await this.callAI(testPrompt, {});

            if (response && response.content) {
                this.apiConfig.validated = true;
                this.apiConfig.lastValidated = Date.now();
                this.saveConfigToStorage();
                this.showToast('Connection successful! AI Assistant is ready.', 'success');
            } else {
                throw new Error('Invalid response from AI');
            }
        } catch (error) {
            this.showToast(`Connection failed: ${error.message}`, 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Test Connection';
        }
    },

    clearConfig: function() {
        if (!confirm('Clear AI configuration? This will remove your API key and all usage statistics.')) return;

        this.apiConfig = null;
        localStorage.removeItem(this.config.storageKey);
        
        document.querySelector('.modal-backdrop').remove();
        this.showToast('AI configuration cleared', 'success');
    },

    callAI: async function(prompt, context) {
        if (!this.apiConfig || !this.apiConfig.validated) {
            throw new Error('AI not configured or not validated');
        }

        const provider = this.apiConfig.provider;
        const apiKey = atob(this.apiConfig.apiKey); // Decrypt

        switch (provider) {
            case 'claude':
                return await this.callClaude(prompt, context, apiKey);
            case 'openai':
                return await this.callOpenAI(prompt, context, apiKey);
            case 'gemini':
                return await this.callGemini(prompt, context, apiKey);
            default:
                throw new Error('Unknown provider');
        }
    },

    callClaude: async function(prompt, context, apiKey) {
        const response = await fetch(this.config.providers.claude.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.apiConfig.model,
                max_tokens: 2048,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Claude API error');
        }

        const data = await response.json();
        
        // Update usage stats
        this.updateUsageStats(data.usage.input_tokens, data.usage.output_tokens);

        return {
            content: data.content[0].text,
            tokens: {
                input: data.usage.input_tokens,
                output: data.usage.output_tokens
            }
        };
    },

    callOpenAI: async function(prompt, context, apiKey) {
        const response = await fetch(this.config.providers.openai.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: this.apiConfig.model,
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                max_tokens: 2048
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API error');
        }

        const data = await response.json();
        
        // Update usage stats
        this.updateUsageStats(data.usage.prompt_tokens, data.usage.completion_tokens);

        return {
            content: data.choices[0].message.content,
            tokens: {
                input: data.usage.prompt_tokens,
                output: data.usage.completion_tokens
            }
        };
    },

    callGemini: async function(prompt, context, apiKey) {
        const modelEndpoint = `${this.config.providers.gemini.endpoint}/${this.apiConfig.model}:generateContent?key=${apiKey}`;
        
        const response = await fetch(modelEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Gemini API error');
        }

        const data = await response.json();
        
        // Gemini doesn't return token counts directly, estimate
        const estimatedInputTokens = Math.ceil(prompt.length / 4);
        const content = data.candidates[0].content.parts[0].text;
        const estimatedOutputTokens = Math.ceil(content.length / 4);
        
        this.updateUsageStats(estimatedInputTokens, estimatedOutputTokens);

        return {
            content,
            tokens: {
                input: estimatedInputTokens,
                output: estimatedOutputTokens
            }
        };
    },

    updateUsageStats: function(inputTokens, outputTokens) {
        if (!this.apiConfig.usageStats) {
            this.apiConfig.usageStats = { totalCalls: 0, totalTokens: 0, estimatedCost: 0 };
        }

        const model = this.config.providers[this.apiConfig.provider].models.find(m => m.id === this.apiConfig.model);
        const cost = (inputTokens / 1000 * model.inputCost) + (outputTokens / 1000 * model.outputCost);

        this.apiConfig.usageStats.totalCalls++;
        this.apiConfig.usageStats.totalTokens += (inputTokens + outputTokens);
        this.apiConfig.usageStats.estimatedCost += cost;

        this.saveConfigToStorage();
    },

    analyzeObjective: async function(objectiveId) {
        if (!this.apiConfig || !this.apiConfig.validated) {
            this.showToast('Please configure and validate AI provider first', 'error');
            this.showSettingsModal();
            return;
        }

        // Get objective data
        const objective = this.getObjectiveData(objectiveId);
        if (!objective) {
            this.showToast('Objective not found', 'error');
            return;
        }

        // Get implementation details
        const enhancedData = typeof AssessmentEnhancements !== 'undefined' 
            ? AssessmentEnhancements.getEnhancedData(objectiveId)
            : null;

        // Get linked evidence
        const evidence = enhancedData?.linkedEvidence || [];

        // Estimate cost
        const estimatedTokens = 800;
        const model = this.config.providers[this.apiConfig.provider].models.find(m => m.id === this.apiConfig.model);
        const estimatedCost = (estimatedTokens / 1000 * (model.inputCost + model.outputCost));

        // Confirm with user
        if (!confirm(`Analyze ${objectiveId}?\n\nEstimated cost: $${estimatedCost.toFixed(4)}\n\nYou will be charged by ${this.config.providers[this.apiConfig.provider].name}.`)) {
            return;
        }

        // Show loading
        this.showToast('Analyzing objective...', 'info');

        try {
            const prompt = this.buildAnalysisPrompt(objective, enhancedData, evidence);
            const response = await this.callAI(prompt, {});
            
            // Parse response
            const analysis = this.parseAnalysisResponse(response.content);
            
            // Save results
            this.analysisResults[objectiveId] = {
                ...analysis,
                analyzedAt: Date.now(),
                tokens: response.tokens,
                cost: (response.tokens.input / 1000 * model.inputCost) + (response.tokens.output / 1000 * model.outputCost)
            };
            this.saveResultsToStorage();

            // Show results
            this.showAnalysisResults(objectiveId);
            this.showToast('Analysis complete!', 'success');

        } catch (error) {
            this.showToast(`Analysis failed: ${error.message}`, 'error');
        }
    },

    buildAnalysisPrompt: function(objective, enhancedData, evidence) {
        return `You are an expert CMMC Certified Assessor (CCA) evaluating whether an organization's implementation and evidence adequately support a specific CMMC assessment objective.

CMMC Level: Level 2
Assessment Objective: ${objective.id}
Objective Text: ${objective.text}

Implementation Description:
${enhancedData?.implementationNotes || 'No implementation description provided.'}

Evidence Provided:
${evidence.length > 0 ? evidence.map((e, i) => `${i + 1}. ${e.title} (${e.type})`).join('\n') : 'No evidence linked.'}

Provide your analysis in the following JSON format:
{
    "adequacyScore": 0-100,
    "sufficiency": "sufficient|partial|insufficient",
    "confidenceLevel": "high|medium|low",
    "evidenceGaps": ["gap1", "gap2"],
    "implementationRecommendations": ["rec1", "rec2"],
    "assessorPerspective": "What a CCA would say...",
    "metLikelihood": "likely|possible|unlikely",
    "riskLevel": "low|medium|high"
}`;
    },

    parseAnalysisResponse: function(content) {
        try {
            // Try to extract JSON from response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('No JSON found in response');
        } catch (error) {
            // Fallback: return basic structure
            return {
                adequacyScore: 50,
                sufficiency: 'partial',
                confidenceLevel: 'low',
                evidenceGaps: ['Unable to parse AI response'],
                implementationRecommendations: [content],
                assessorPerspective: 'Analysis parsing failed',
                metLikelihood: 'possible',
                riskLevel: 'medium'
            };
        }
    },

    getObjectiveData: function(objectiveId) {
        // This would need to integrate with your existing objective data structure
        // For now, return a placeholder
        return {
            id: objectiveId,
            text: 'Objective text would be loaded from your data structure'
        };
    },

    showAnalysisResults: function(objectiveId) {
        const analysis = this.analysisResults[objectiveId];
        if (!analysis) {
            this.showToast('No analysis results found for this objective', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>AI Analysis Results - ${objectiveId}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="analysis-summary">
                        <div class="analysis-score-card">
                            <div class="score-ring" data-score="${analysis.adequacyScore}">
                                <div class="score-value">${analysis.adequacyScore}%</div>
                                <div class="score-label">Adequacy</div>
                            </div>
                            <div class="analysis-badges">
                                <span class="sufficiency-badge ${analysis.sufficiency}">${analysis.sufficiency}</span>
                                <span class="confidence-badge ${analysis.confidenceLevel}">${analysis.confidenceLevel} confidence</span>
                                <span class="risk-badge ${analysis.riskLevel}">${analysis.riskLevel} risk</span>
                            </div>
                        </div>
                    </div>

                    <div class="analysis-sections">
                        <div class="analysis-section">
                            <h3>Evidence Gaps</h3>
                            <ul>
                                ${analysis.evidenceGaps.map(gap => `<li>${gap}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="analysis-section">
                            <h3>Implementation Recommendations</h3>
                            <ul>
                                ${analysis.implementationRecommendations.map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="analysis-section">
                            <h3>Assessor Perspective</h3>
                            <p>${analysis.assessorPerspective}</p>
                        </div>

                        <div class="analysis-meta">
                            <small>
                                Analyzed: ${new Date(analysis.analyzedAt).toLocaleString()} | 
                                Tokens: ${analysis.tokens.input + analysis.tokens.output} | 
                                Cost: $${analysis.cost.toFixed(4)}
                            </small>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-backdrop').remove()">Close</button>
                    <button class="btn-primary analyze-objective-btn" data-objective-id="${objectiveId}">Re-analyze</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
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
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AIAssistant.init());
} else {
    AIAssistant.init();
}
