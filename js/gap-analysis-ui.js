// Gap Analysis Dashboard UI
// Provides visual interface for AI-powered gap analysis

const GapAnalysisUI = {
    currentAnalysis: null,

    init: function() {
        this.bindEvents();
        console.log('[GapAnalysisUI] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#run-gap-analysis-btn')) {
                this.runAnalysis();
            }
            if (e.target.closest('#export-gap-report-btn')) {
                this.exportReport();
            }
        });
    },

    runAnalysis: function() {
        if (!app || !app.assessmentData || !CONTROL_FAMILIES) {
            this.showToast('Assessment data not available', 'error');
            return;
        }

        // Show loading state
        this.showLoadingModal();

        // Run analysis (simulate async for UX)
        setTimeout(() => {
            this.currentAnalysis = GapAnalysis.analyzeAssessment(app.assessmentData, CONTROL_FAMILIES);
            this.showAnalysisDashboard(this.currentAnalysis);
            
            // Log activity
            if (typeof CollaborationManager !== 'undefined') {
                CollaborationManager.logActivity('gap_analysis', 'Ran gap analysis');
            }
        }, 500);
    },

    showLoadingModal: function() {
        const modal = document.createElement('div');
        modal.id = 'gap-analysis-loading';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content modal-small">
                <div class="loading-content">
                    <div class="spinner"></div>
                    <h3>Analyzing Assessment...</h3>
                    <p>Identifying gaps and generating recommendations</p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    showAnalysisDashboard: function(analysis) {
        // Remove loading modal
        document.getElementById('gap-analysis-loading')?.remove();

        const modal = document.createElement('div');
        modal.className = 'modal-overlay gap-analysis-modal';
        modal.innerHTML = `
            <div class="modal-content modal-xlarge">
                <div class="modal-header">
                    <h2>🎯 Gap Analysis Report</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    ${this.renderDashboard(analysis)}
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                    <button class="btn-primary" id="export-gap-report-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Export Report
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    renderDashboard: function(analysis) {
        return `
            <div class="gap-analysis-dashboard">
                <!-- Summary Cards -->
                <div class="gap-summary-cards">
                    ${this.renderSummaryCard('Compliance Score', `${analysis.complianceScore.score}%`, analysis.complianceScore.grade, 'compliance')}
                    ${this.renderSummaryCard('Risk Level', analysis.riskScore.level, `${analysis.riskScore.score}/100`, 'risk')}
                    ${this.renderSummaryCard('Total Gaps', analysis.gaps.length, `${analysis.riskScore.criticalGaps} critical`, 'gaps')}
                    ${this.renderSummaryCard('Readiness', analysis.summary.readinessLevel, `${analysis.summary.complianceRate}%`, 'readiness')}
                </div>

                <!-- Compliance Breakdown -->
                <div class="gap-section">
                    <h3>📊 Compliance Breakdown</h3>
                    <div class="compliance-chart">
                        <div class="chart-bar">
                            <div class="bar-segment met" style="width: ${(analysis.complianceScore.met / analysis.complianceScore.total) * 100}%">
                                ${analysis.complianceScore.met} Met
                            </div>
                            <div class="bar-segment partial" style="width: ${(analysis.complianceScore.partial / analysis.complianceScore.total) * 100}%">
                                ${analysis.complianceScore.partial} Partial
                            </div>
                            <div class="bar-segment not-met" style="width: ${(analysis.complianceScore.notMet / analysis.complianceScore.total) * 100}%">
                                ${analysis.complianceScore.notMet} Not Met
                            </div>
                        </div>
                        <div class="chart-legend">
                            <span class="legend-item"><span class="legend-color met"></span> Met (${analysis.complianceScore.met})</span>
                            <span class="legend-item"><span class="legend-color partial"></span> Partial (${analysis.complianceScore.partial})</span>
                            <span class="legend-item"><span class="legend-color not-met"></span> Not Met (${analysis.complianceScore.notMet})</span>
                        </div>
                    </div>
                </div>

                <!-- Top Recommendations -->
                <div class="gap-section">
                    <h3>💡 Top Recommendations</h3>
                    <div class="recommendations-list">
                        ${analysis.recommendations.slice(0, 5).map(rec => this.renderRecommendation(rec)).join('')}
                    </div>
                </div>

                <!-- Prioritized Actions -->
                <div class="gap-section">
                    <h3>🎯 Prioritized Actions (Top 10)</h3>
                    <div class="actions-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Control</th>
                                    <th>Description</th>
                                    <th>Severity</th>
                                    <th>Est. Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${analysis.prioritizedActions.map(action => this.renderActionRow(action)).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Effort Estimate -->
                <div class="gap-section">
                    <h3>⏱️ Remediation Effort</h3>
                    <div class="effort-cards">
                        <div class="effort-card">
                            <div class="effort-value">${analysis.estimatedEffort.totalHours}</div>
                            <div class="effort-label">Total Hours</div>
                        </div>
                        <div class="effort-card">
                            <div class="effort-value">${analysis.estimatedEffort.totalWeeks}</div>
                            <div class="effort-label">Weeks (FTE)</div>
                        </div>
                        <div class="effort-card">
                            <div class="effort-value">${analysis.estimatedEffort.byPhase.planning}h</div>
                            <div class="effort-label">Planning</div>
                        </div>
                        <div class="effort-card">
                            <div class="effort-value">${analysis.estimatedEffort.byPhase.implementation}h</div>
                            <div class="effort-label">Implementation</div>
                        </div>
                        <div class="effort-card">
                            <div class="effort-value">${analysis.estimatedEffort.byPhase.testing}h</div>
                            <div class="effort-label">Testing</div>
                        </div>
                    </div>
                </div>

                <!-- Trends -->
                ${analysis.trends.recentActivity > 0 ? `
                <div class="gap-section">
                    <h3>📈 Recent Trends (Last 30 Days)</h3>
                    <div class="trends-summary">
                        <div class="trend-item ${analysis.trends.momentum}">
                            <span class="trend-icon">${analysis.trends.momentum === 'positive' ? '📈' : analysis.trends.momentum === 'negative' ? '📉' : '➡️'}</span>
                            <span class="trend-label">Momentum: ${analysis.trends.momentum}</span>
                        </div>
                        <div class="trend-stat">
                            <span class="trend-value positive">${analysis.trends.improvements}</span>
                            <span class="trend-label">Improvements</span>
                        </div>
                        <div class="trend-stat">
                            <span class="trend-value negative">${analysis.trends.regressions}</span>
                            <span class="trend-label">Regressions</span>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    },

    renderSummaryCard: function(title, value, subtitle, type) {
        const icons = {
            compliance: '✅',
            risk: '⚠️',
            gaps: '🔍',
            readiness: '🎯'
        };

        return `
            <div class="summary-card ${type}">
                <div class="card-icon">${icons[type]}</div>
                <div class="card-content">
                    <div class="card-title">${title}</div>
                    <div class="card-value">${value}</div>
                    <div class="card-subtitle">${subtitle}</div>
                </div>
            </div>
        `;
    },

    renderRecommendation: function(rec) {
        const typeIcons = {
            critical: '🔴',
            'quick-win': '⚡',
            pattern: '🔧'
        };

        return `
            <div class="recommendation-card ${rec.type}">
                <div class="rec-header">
                    <span class="rec-icon">${typeIcons[rec.type] || '💡'}</span>
                    <h4>${rec.title}</h4>
                </div>
                <p class="rec-description">${rec.description}</p>
                <div class="rec-footer">
                    <span class="rec-effort">Est. ${rec.estimatedEffort}h</span>
                    <span class="rec-controls">${rec.affectedControls.length} controls</span>
                </div>
            </div>
        `;
    },

    renderActionRow: function(action) {
        const severityColors = {
            critical: '#e06c75',
            high: '#e5c07b',
            medium: '#61afef',
            low: '#98c379'
        };

        return `
            <tr>
                <td>${action.rank}</td>
                <td><code>${action.controlId}</code></td>
                <td class="action-desc">${action.description.substring(0, 60)}...</td>
                <td>
                    <span class="severity-badge" style="background: ${severityColors[action.severity]}20; color: ${severityColors[action.severity]}">
                        ${action.severity}
                    </span>
                </td>
                <td>${action.estimatedHours}h</td>
            </tr>
        `;
    },

    exportReport: function() {
        if (!this.currentAnalysis) {
            this.showToast('No analysis available to export', 'error');
            return;
        }

        GapAnalysis.exportReport(this.currentAnalysis);
        this.showToast('Gap analysis report exported', 'success');
    },

    showToast: function(message, type = 'info') {
        if (typeof app !== 'undefined' && app.showToast) {
            app.showToast(message, type);
        } else {
            console.log(`[GapAnalysisUI] ${type}: ${message}`);
        }
    }
};

// Initialize
if (typeof document !== 'undefined') {
    document.readyState === 'loading' ? 
        document.addEventListener('DOMContentLoaded', () => GapAnalysisUI.init()) : 
        GapAnalysisUI.init();
}

if (typeof window !== 'undefined') {
    window.GapAnalysisUI = GapAnalysisUI;
}
