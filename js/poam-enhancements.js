// POA&M Enhancements Module
// Adds risk scoring, cost tracking, detailed timelines, and remediation templates
// Extends existing POA&M functionality in app-main.js

const POAMEnhancements = {
    config: {
        version: "1.0.0",
        storageKey: "nist-poam-enhanced",
        riskMatrix: {
            likelihood: {
                high: { label: "High (>70%)", value: 5, color: "#ef4444" },
                medium: { label: "Medium (30-70%)", value: 3, color: "#f59e0b" },
                low: { label: "Low (<30%)", value: 1, color: "#10b981" }
            },
            impact: {
                high: { label: "High (Severe)", value: 5, color: "#ef4444" },
                medium: { label: "Medium (Moderate)", value: 3, color: "#f59e0b" },
                low: { label: "Low (Minor)", value: 1, color: "#10b981" }
            }
        },
        remediationTemplates: {
            "access-control": {
                name: "Access Control Implementation",
                steps: [
                    "Review current access control policies",
                    "Implement role-based access control (RBAC)",
                    "Configure MFA for all users",
                    "Document access procedures",
                    "Train users on new access controls",
                    "Conduct access review"
                ],
                estimatedDays: 30,
                estimatedCost: 5000
            },
            "encryption": {
                name: "Encryption Implementation",
                steps: [
                    "Identify all CUI data locations",
                    "Select FIPS 140-2 validated encryption solution",
                    "Implement encryption at rest",
                    "Implement encryption in transit",
                    "Document encryption procedures",
                    "Validate encryption implementation"
                ],
                estimatedDays: 45,
                estimatedCost: 15000
            },
            "audit-logging": {
                name: "Audit Logging Implementation",
                steps: [
                    "Deploy centralized logging solution",
                    "Configure log collection for all systems",
                    "Set up log retention policies",
                    "Implement log monitoring and alerting",
                    "Document logging procedures",
                    "Test log integrity"
                ],
                estimatedDays: 21,
                estimatedCost: 8000
            },
            "incident-response": {
                name: "Incident Response Program",
                steps: [
                    "Develop incident response plan",
                    "Establish incident response team",
                    "Implement incident tracking system",
                    "Conduct tabletop exercises",
                    "Document procedures",
                    "Train staff on incident response"
                ],
                estimatedDays: 60,
                estimatedCost: 12000
            }
        }
    },

    enhancedData: {},

    init: function() {
        this.loadEnhancedData();
        this.bindEvents();
        console.log('[POAMEnhancements] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            // Enhanced POA&M view
            if (e.target.closest('#view-enhanced-poam-btn')) {
                this.showEnhancedPOAMDashboard();
            }

            // Add risk assessment
            if (e.target.closest('.add-risk-assessment-btn')) {
                const objectiveId = e.target.closest('.add-risk-assessment-btn').dataset.objectiveId;
                this.showRiskAssessmentModal(objectiveId);
            }

            // Save risk assessment
            if (e.target.closest('#save-risk-assessment-btn')) {
                this.saveRiskAssessment();
            }

            // Add cost breakdown
            if (e.target.closest('.add-cost-breakdown-btn')) {
                const objectiveId = e.target.closest('.add-cost-breakdown-btn').dataset.objectiveId;
                this.showCostBreakdownModal(objectiveId);
            }

            // Save cost breakdown
            if (e.target.closest('#save-cost-breakdown-btn')) {
                this.saveCostBreakdown();
            }

            // Add milestone
            if (e.target.closest('.add-milestone-btn')) {
                const objectiveId = e.target.closest('.add-milestone-btn').dataset.objectiveId;
                this.showAddMilestoneModal(objectiveId);
            }

            // Save milestone
            if (e.target.closest('#save-milestone-btn')) {
                this.saveMilestone();
            }

            // Apply template
            if (e.target.closest('.apply-template-btn')) {
                const templateKey = e.target.closest('.apply-template-btn').dataset.template;
                const objectiveId = e.target.closest('.apply-template-btn').dataset.objectiveId;
                this.applyRemediationTemplate(objectiveId, templateKey);
            }

            // Export POA&M report
            if (e.target.closest('#export-poam-report-btn')) {
                this.exportPOAMReport();
            }
        });
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
                riskAssessment: null,
                costBreakdown: [],
                milestones: [],
                resourceAllocation: [],
                statusUpdates: [],
                created: Date.now(),
                updated: Date.now()
            };
        }
        return this.enhancedData[objectiveId];
    },

    showEnhancedPOAMDashboard: function() {
        // Get all POA&M items from main app
        const poamItems = typeof window.app !== 'undefined' ? window.app.poamData : {};
        const enhancedItems = Object.keys(poamItems).map(objectiveId => {
            const baseData = poamItems[objectiveId];
            const enhanced = this.getEnhancedData(objectiveId);
            return {
                objectiveId,
                ...baseData,
                ...enhanced,
                riskScore: this.calculateRiskScore(enhanced.riskAssessment),
                totalCost: this.calculateTotalCost(enhanced.costBreakdown),
                progress: this.calculateProgress(enhanced.milestones)
            };
        });

        // Sort by risk score descending
        enhancedItems.sort((a, b) => b.riskScore - a.riskScore);

        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content poam-dashboard-modal">
                <div class="modal-header">
                    <h2>Enhanced POA&M Dashboard</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <!-- Summary Stats -->
                    <div class="poam-stats">
                        <div class="poam-stat-card">
                            <div class="stat-value">${enhancedItems.length}</div>
                            <div class="stat-label">Total Items</div>
                        </div>
                        <div class="poam-stat-card high-risk">
                            <div class="stat-value">${enhancedItems.filter(i => i.riskScore >= 15).length}</div>
                            <div class="stat-label">High Risk</div>
                        </div>
                        <div class="poam-stat-card">
                            <div class="stat-value">$${enhancedItems.reduce((sum, i) => sum + i.totalCost, 0).toLocaleString()}</div>
                            <div class="stat-label">Total Cost</div>
                        </div>
                        <div class="poam-stat-card">
                            <div class="stat-value">${Math.round(enhancedItems.reduce((sum, i) => sum + i.progress, 0) / enhancedItems.length || 0)}%</div>
                            <div class="stat-label">Avg Progress</div>
                        </div>
                    </div>

                    <!-- Controls -->
                    <div class="poam-controls">
                        <button class="btn-primary" id="export-poam-report-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Export Report
                        </button>
                    </div>

                    <!-- POA&M Items Table -->
                    <div class="poam-items-table">
                        ${this.renderPOAMItemsTable(enhancedItems)}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    renderPOAMItemsTable: function(items) {
        if (items.length === 0) {
            return '<div class="empty-state">No POA&M items found</div>';
        }

        return `
            <table class="poam-table">
                <thead>
                    <tr>
                        <th>Objective</th>
                        <th>Weakness</th>
                        <th>Risk Score</th>
                        <th>Cost</th>
                        <th>Progress</th>
                        <th>Target Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td><strong>${item.objectiveId}</strong></td>
                            <td>${item.weakness || 'N/A'}</td>
                            <td>
                                <span class="risk-score-badge ${this.getRiskLevel(item.riskScore)}">
                                    ${item.riskScore} - ${this.getRiskLevel(item.riskScore).toUpperCase()}
                                </span>
                            </td>
                            <td>$${item.totalCost.toLocaleString()}</td>
                            <td>
                                <div class="progress-bar-container">
                                    <div class="progress-bar-fill" style="width: ${item.progress}%"></div>
                                    <span class="progress-text">${item.progress}%</span>
                                </div>
                            </td>
                            <td>${item.targetDate ? new Date(item.targetDate).toLocaleDateString() : 'N/A'}</td>
                            <td class="poam-actions">
                                <button class="icon-btn add-risk-assessment-btn" data-objective-id="${item.objectiveId}" title="Risk Assessment">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                                </button>
                                <button class="icon-btn add-cost-breakdown-btn" data-objective-id="${item.objectiveId}" title="Cost Breakdown">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                </button>
                                <button class="icon-btn add-milestone-btn" data-objective-id="${item.objectiveId}" title="Add Milestone">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    showRiskAssessmentModal: function(objectiveId) {
        const enhanced = this.getEnhancedData(objectiveId);
        const existing = enhanced.riskAssessment || {};

        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>Risk Assessment - ${objectiveId}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <form id="risk-assessment-form">
                        <input type="hidden" id="risk-objective-id" value="${objectiveId}">
                        
                        <div class="form-group">
                            <label>Likelihood of Exploitation *</label>
                            <select id="risk-likelihood" class="form-control" required>
                                <option value="">Select likelihood...</option>
                                ${Object.entries(this.config.riskMatrix.likelihood).map(([key, val]) => 
                                    `<option value="${key}" ${existing.likelihood === key ? 'selected' : ''}>${val.label}</option>`
                                ).join('')}
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Impact if Exploited *</label>
                            <select id="risk-impact" class="form-control" required>
                                <option value="">Select impact...</option>
                                ${Object.entries(this.config.riskMatrix.impact).map(([key, val]) => 
                                    `<option value="${key}" ${existing.impact === key ? 'selected' : ''}>${val.label}</option>`
                                ).join('')}
                            </select>
                        </div>

                        <div class="risk-score-preview" id="risk-score-preview">
                            <div class="risk-score-label">Calculated Risk Score:</div>
                            <div class="risk-score-value">-</div>
                        </div>

                        <div class="form-group">
                            <label>Risk Description</label>
                            <textarea id="risk-description" class="form-control" rows="3" placeholder="Describe the specific risk...">${existing.description || ''}</textarea>
                        </div>

                        <div class="form-group">
                            <label>Mitigation Strategy</label>
                            <textarea id="risk-mitigation" class="form-control" rows="3" placeholder="How will this risk be mitigated?">${existing.mitigation || ''}</textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-backdrop').remove()">Cancel</button>
                    <button class="btn-primary" id="save-risk-assessment-btn">Save Risk Assessment</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);

        // Update risk score preview on change
        const likelihoodSelect = modal.querySelector('#risk-likelihood');
        const impactSelect = modal.querySelector('#risk-impact');
        const preview = modal.querySelector('#risk-score-preview');

        const updatePreview = () => {
            const likelihood = likelihoodSelect.value;
            const impact = impactSelect.value;
            if (likelihood && impact) {
                const score = this.calculateRiskScore({ likelihood, impact });
                const level = this.getRiskLevel(score);
                preview.querySelector('.risk-score-value').textContent = `${score} - ${level.toUpperCase()}`;
                preview.querySelector('.risk-score-value').className = `risk-score-value ${level}`;
            }
        };

        likelihoodSelect.addEventListener('change', updatePreview);
        impactSelect.addEventListener('change', updatePreview);
        updatePreview();
    },

    saveRiskAssessment: function() {
        const form = document.getElementById('risk-assessment-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const objectiveId = document.getElementById('risk-objective-id').value;
        const enhanced = this.getEnhancedData(objectiveId);

        enhanced.riskAssessment = {
            likelihood: document.getElementById('risk-likelihood').value,
            impact: document.getElementById('risk-impact').value,
            description: document.getElementById('risk-description').value,
            mitigation: document.getElementById('risk-mitigation').value,
            assessedAt: Date.now()
        };

        enhanced.updated = Date.now();
        this.saveToStorage();

        document.querySelector('.modal-backdrop').remove();
        this.showToast('Risk assessment saved', 'success');
    },

    showCostBreakdownModal: function(objectiveId) {
        const enhanced = this.getEnhancedData(objectiveId);

        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>Cost Breakdown - ${objectiveId}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="current-costs">
                        <h3>Current Cost Items</h3>
                        ${enhanced.costBreakdown.length > 0 ? `
                            <table class="cost-table">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Description</th>
                                        <th>Estimated</th>
                                        <th>Actual</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${enhanced.costBreakdown.map(cost => `
                                        <tr>
                                            <td>${cost.category}</td>
                                            <td>${cost.description}</td>
                                            <td>$${cost.estimated.toLocaleString()}</td>
                                            <td>${cost.actual ? '$' + cost.actual.toLocaleString() : 'Pending'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="2"><strong>Total</strong></td>
                                        <td><strong>$${enhanced.costBreakdown.reduce((sum, c) => sum + c.estimated, 0).toLocaleString()}</strong></td>
                                        <td><strong>$${enhanced.costBreakdown.reduce((sum, c) => sum + (c.actual || 0), 0).toLocaleString()}</strong></td>
                                    </tr>
                                </tfoot>
                            </table>
                        ` : '<p style="color: var(--text-muted);">No cost items added yet</p>'}
                    </div>

                    <div class="hamburger-divider" style="margin: 20px 0;"></div>

                    <h3>Add Cost Item</h3>
                    <form id="cost-breakdown-form">
                        <input type="hidden" id="cost-objective-id" value="${objectiveId}">
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Category *</label>
                                <select id="cost-category" class="form-control" required>
                                    <option value="">Select category...</option>
                                    <option value="software">Software/Licenses</option>
                                    <option value="hardware">Hardware</option>
                                    <option value="consulting">Consulting Services</option>
                                    <option value="training">Training</option>
                                    <option value="labor">Internal Labor</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Estimated Cost *</label>
                                <input type="number" id="cost-estimated" class="form-control" required min="0" step="0.01" placeholder="0.00">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Description *</label>
                            <input type="text" id="cost-description" class="form-control" required placeholder="e.g., MFA solution annual license">
                        </div>

                        <div class="form-group">
                            <label>Actual Cost (if incurred)</label>
                            <input type="number" id="cost-actual" class="form-control" min="0" step="0.01" placeholder="Leave blank if not yet incurred">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-backdrop').remove()">Close</button>
                    <button class="btn-primary" id="save-cost-breakdown-btn">Add Cost Item</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    saveCostBreakdown: function() {
        const form = document.getElementById('cost-breakdown-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const objectiveId = document.getElementById('cost-objective-id').value;
        const enhanced = this.getEnhancedData(objectiveId);

        const costItem = {
            category: document.getElementById('cost-category').value,
            description: document.getElementById('cost-description').value,
            estimated: parseFloat(document.getElementById('cost-estimated').value),
            actual: document.getElementById('cost-actual').value ? parseFloat(document.getElementById('cost-actual').value) : null,
            addedAt: Date.now()
        };

        enhanced.costBreakdown.push(costItem);
        enhanced.updated = Date.now();
        this.saveToStorage();

        // Refresh modal
        document.querySelector('.modal-backdrop').remove();
        this.showCostBreakdownModal(objectiveId);
        this.showToast('Cost item added', 'success');
    },

    showAddMilestoneModal: function(objectiveId) {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>Add Milestone - ${objectiveId}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <form id="milestone-form">
                        <input type="hidden" id="milestone-objective-id" value="${objectiveId}">
                        
                        <div class="form-group">
                            <label>Milestone Name *</label>
                            <input type="text" id="milestone-name" class="form-control" required placeholder="e.g., MFA Deployment Complete">
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Target Date *</label>
                                <input type="date" id="milestone-date" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label>Status *</label>
                                <select id="milestone-status" class="form-control" required>
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="delayed">Delayed</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Description</label>
                            <textarea id="milestone-description" class="form-control" rows="3" placeholder="Milestone details..."></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-backdrop').remove()">Cancel</button>
                    <button class="btn-primary" id="save-milestone-btn">Add Milestone</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    saveMilestone: function() {
        const form = document.getElementById('milestone-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const objectiveId = document.getElementById('milestone-objective-id').value;
        const enhanced = this.getEnhancedData(objectiveId);

        const milestone = {
            id: Date.now().toString(),
            name: document.getElementById('milestone-name').value,
            targetDate: document.getElementById('milestone-date').value,
            status: document.getElementById('milestone-status').value,
            description: document.getElementById('milestone-description').value,
            createdAt: Date.now()
        };

        enhanced.milestones.push(milestone);
        enhanced.updated = Date.now();
        this.saveToStorage();

        document.querySelector('.modal-backdrop').remove();
        this.showToast('Milestone added', 'success');
    },

    applyRemediationTemplate: function(objectiveId, templateKey) {
        const template = this.config.remediationTemplates[templateKey];
        if (!template) return;

        const enhanced = this.getEnhancedData(objectiveId);

        // Add milestones from template
        const startDate = new Date();
        template.steps.forEach((step, index) => {
            const daysOffset = Math.floor((template.estimatedDays / template.steps.length) * (index + 1));
            const targetDate = new Date(startDate);
            targetDate.setDate(targetDate.getDate() + daysOffset);

            enhanced.milestones.push({
                id: Date.now().toString() + index,
                name: step,
                targetDate: targetDate.toISOString().split('T')[0],
                status: 'pending',
                description: `From ${template.name} template`,
                createdAt: Date.now()
            });
        });

        // Add cost estimate
        enhanced.costBreakdown.push({
            category: 'consulting',
            description: `${template.name} - Template Estimate`,
            estimated: template.estimatedCost,
            actual: null,
            addedAt: Date.now()
        });

        enhanced.updated = Date.now();
        this.saveToStorage();

        this.showToast(`Applied template: ${template.name}`, 'success');
    },

    calculateRiskScore: function(riskAssessment) {
        if (!riskAssessment || !riskAssessment.likelihood || !riskAssessment.impact) return 0;
        
        const likelihood = this.config.riskMatrix.likelihood[riskAssessment.likelihood].value;
        const impact = this.config.riskMatrix.impact[riskAssessment.impact].value;
        
        return likelihood * impact;
    },

    getRiskLevel: function(score) {
        if (score >= 15) return 'high';
        if (score >= 6) return 'medium';
        return 'low';
    },

    calculateTotalCost: function(costBreakdown) {
        return costBreakdown.reduce((sum, cost) => sum + cost.estimated, 0);
    },

    calculateProgress: function(milestones) {
        if (milestones.length === 0) return 0;
        const completed = milestones.filter(m => m.status === 'completed').length;
        return Math.round((completed / milestones.length) * 100);
    },

    exportPOAMReport: function() {
        const poamItems = typeof window.app !== 'undefined' ? window.app.poamData : {};
        const enhancedItems = Object.keys(poamItems).map(objectiveId => {
            const baseData = poamItems[objectiveId];
            const enhanced = this.getEnhancedData(objectiveId);
            return {
                objectiveId,
                ...baseData,
                ...enhanced,
                riskScore: this.calculateRiskScore(enhanced.riskAssessment),
                totalCost: this.calculateTotalCost(enhanced.costBreakdown),
                progress: this.calculateProgress(enhanced.milestones)
            };
        });

        const report = {
            exportDate: new Date().toISOString(),
            summary: {
                totalItems: enhancedItems.length,
                highRisk: enhancedItems.filter(i => i.riskScore >= 15).length,
                totalEstimatedCost: enhancedItems.reduce((sum, i) => sum + i.totalCost, 0),
                averageProgress: Math.round(enhancedItems.reduce((sum, i) => sum + i.progress, 0) / enhancedItems.length || 0)
            },
            items: enhancedItems
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `poam-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('POA&M report exported', 'success');
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
    document.addEventListener('DOMContentLoaded', () => POAMEnhancements.init());
} else {
    POAMEnhancements.init();
}
