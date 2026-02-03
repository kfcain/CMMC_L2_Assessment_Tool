// Executive Dashboard
// High-level compliance analytics and visualizations for leadership
// Works entirely client-side with no backend required

const ExecutiveDashboard = {
    config: {
        version: "1.0.0"
    },

    init: function() {
        this.bindEvents();
        console.log('[ExecutiveDashboard] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#open-executive-dashboard-btn')) {
                this.showDashboard();
            }
            if (e.target.closest('#export-executive-report-btn')) {
                this.exportReport();
            }
        });
    },

    showDashboard: function() {
        if (!app || !app.assessmentData || !CONTROL_FAMILIES) {
            this.showToast('Assessment data not available', 'error');
            return;
        }

        const analytics = this.generateAnalytics();
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay executive-dashboard-modal';
        modal.innerHTML = `
            <div class="modal-content modal-fullscreen">
                <div class="modal-header">
                    <h2>📊 Executive Dashboard</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    ${this.renderDashboard(analytics)}
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                    <button class="btn-primary" id="export-executive-report-btn">
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

        // Log activity
        if (typeof CollaborationManager !== 'undefined') {
            CollaborationManager.logActivity('executive_dashboard', 'Viewed executive dashboard');
        }
    },

    generateAnalytics: function() {
        const stats = this.calculateDetailedStats();
        const familyBreakdown = this.getFamilyBreakdown();
        const timeline = this.getComplianceTimeline();
        const riskAreas = this.identifyRiskAreas();
        const recommendations = this.getExecutiveRecommendations(stats);

        return {
            stats,
            familyBreakdown,
            timeline,
            riskAreas,
            recommendations,
            generatedAt: new Date().toISOString()
        };
    },

    calculateDetailedStats: function() {
        let total = 0, met = 0, partial = 0, notMet = 0, notAssessed = 0;
        let totalPoints = 0, earnedPoints = 0;

        CONTROL_FAMILIES.forEach(family => {
            family.controls.forEach(control => {
                const pointValue = control.pointValue || 1;
                
                control.objectives.forEach(objective => {
                    total++;
                    totalPoints += pointValue;
                    
                    const status = app.assessmentData[objective.id]?.status || 'not-assessed';
                    
                    switch(status) {
                        case 'met':
                            met++;
                            earnedPoints += pointValue;
                            break;
                        case 'partial':
                            partial++;
                            earnedPoints += pointValue * 0.5;
                            break;
                        case 'not-met':
                            notMet++;
                            break;
                        default:
                            notAssessed++;
                            break;
                    }
                });
            });
        });

        const complianceRate = total > 0 ? Math.round((met / total) * 100) : 0;
        const sprsScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 110) : 0;

        return {
            total,
            met,
            partial,
            notMet,
            notAssessed,
            complianceRate,
            sprsScore,
            totalPoints,
            earnedPoints
        };
    },

    getFamilyBreakdown: function() {
        const breakdown = [];

        CONTROL_FAMILIES.forEach(family => {
            let total = 0, met = 0, partial = 0, notMet = 0;

            family.controls.forEach(control => {
                control.objectives.forEach(objective => {
                    total++;
                    const status = app.assessmentData[objective.id]?.status || 'not-assessed';
                    
                    if (status === 'met') met++;
                    else if (status === 'partial') partial++;
                    else if (status === 'not-met') notMet++;
                });
            });

            const complianceRate = total > 0 ? Math.round((met / total) * 100) : 0;

            breakdown.push({
                id: family.id,
                name: family.name,
                total,
                met,
                partial,
                notMet,
                complianceRate
            });
        });

        return breakdown.sort((a, b) => a.complianceRate - b.complianceRate);
    },

    getComplianceTimeline: function() {
        const editHistory = JSON.parse(localStorage.getItem('nist-edit-history') || '{}');
        const timeline = [];

        Object.keys(editHistory).forEach(key => {
            const edits = editHistory[key];
            edits.forEach(edit => {
                const date = new Date(edit.timestamp);
                const dateKey = date.toISOString().split('T')[0];
                
                const existing = timeline.find(t => t.date === dateKey);
                if (existing) {
                    if (edit.newValue === 'met') existing.improvements++;
                    else if (edit.newValue === 'not-met') existing.regressions++;
                } else {
                    timeline.push({
                        date: dateKey,
                        improvements: edit.newValue === 'met' ? 1 : 0,
                        regressions: edit.newValue === 'not-met' ? 1 : 0
                    });
                }
            });
        });

        return timeline.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-30);
    },

    identifyRiskAreas: function() {
        const risks = [];

        CONTROL_FAMILIES.forEach(family => {
            let criticalGaps = 0;
            let highGaps = 0;

            family.controls.forEach(control => {
                const isNeverPoam = control.poamEligibility?.selfAssessment?.canBeOnPoam === false;
                const pointValue = control.pointValue || 1;

                control.objectives.forEach(objective => {
                    const status = app.assessmentData[objective.id]?.status;
                    
                    if (status === 'not-met' || status === 'partial') {
                        if (isNeverPoam || pointValue >= 5) {
                            criticalGaps++;
                        } else if (pointValue >= 3) {
                            highGaps++;
                        }
                    }
                });
            });

            if (criticalGaps > 0 || highGaps > 2) {
                risks.push({
                    family: family.name,
                    criticalGaps,
                    highGaps,
                    severity: criticalGaps > 0 ? 'critical' : 'high'
                });
            }
        });

        return risks.sort((a, b) => b.criticalGaps - a.criticalGaps);
    },

    getExecutiveRecommendations: function(stats) {
        const recommendations = [];

        if (stats.complianceRate < 70) {
            recommendations.push({
                priority: 'high',
                title: 'Accelerate Compliance Efforts',
                description: `Current compliance rate of ${stats.complianceRate}% is below target. Recommend dedicated resources to address gaps.`,
                impact: 'Critical for certification readiness'
            });
        }

        if (stats.sprsScore < 80) {
            recommendations.push({
                priority: 'high',
                title: 'Improve SPRS Score',
                description: `SPRS score of ${stats.sprsScore} may impact contract eligibility. Focus on high-value controls.`,
                impact: 'Contract and business risk'
            });
        }

        if (stats.notAssessed > stats.total * 0.3) {
            recommendations.push({
                priority: 'medium',
                title: 'Complete Assessment',
                description: `${stats.notAssessed} objectives (${Math.round((stats.notAssessed/stats.total)*100)}%) remain unassessed.`,
                impact: 'Incomplete visibility into compliance posture'
            });
        }

        if (stats.partial > stats.total * 0.2) {
            recommendations.push({
                priority: 'medium',
                title: 'Address Partial Implementations',
                description: `${stats.partial} partially implemented controls need completion.`,
                impact: 'Potential audit findings'
            });
        }

        return recommendations;
    },

    renderDashboard: function(analytics) {
        return `
            <div class="executive-dashboard">
                <!-- KPI Cards -->
                <div class="kpi-section">
                    <div class="kpi-card primary">
                        <div class="kpi-icon">✅</div>
                        <div class="kpi-content">
                            <div class="kpi-value">${analytics.stats.complianceRate}%</div>
                            <div class="kpi-label">Compliance Rate</div>
                            <div class="kpi-sublabel">${analytics.stats.met} of ${analytics.stats.total} controls met</div>
                        </div>
                    </div>
                    <div class="kpi-card accent">
                        <div class="kpi-icon">🎯</div>
                        <div class="kpi-content">
                            <div class="kpi-value">${analytics.stats.sprsScore}</div>
                            <div class="kpi-label">SPRS Score</div>
                            <div class="kpi-sublabel">Out of 110 points</div>
                        </div>
                    </div>
                    <div class="kpi-card ${analytics.stats.notMet > 0 ? 'warning' : 'success'}">
                        <div class="kpi-icon">${analytics.stats.notMet > 0 ? '⚠️' : '✨'}</div>
                        <div class="kpi-content">
                            <div class="kpi-value">${analytics.stats.notMet}</div>
                            <div class="kpi-label">Critical Gaps</div>
                            <div class="kpi-sublabel">${analytics.stats.partial} partial implementations</div>
                        </div>
                    </div>
                    <div class="kpi-card info">
                        <div class="kpi-icon">📋</div>
                        <div class="kpi-content">
                            <div class="kpi-value">${analytics.stats.total - analytics.stats.notAssessed}</div>
                            <div class="kpi-label">Assessed</div>
                            <div class="kpi-sublabel">${analytics.stats.notAssessed} remaining</div>
                        </div>
                    </div>
                </div>

                <!-- Two Column Layout -->
                <div class="dashboard-grid">
                    <!-- Left Column -->
                    <div class="dashboard-column">
                        <!-- Family Breakdown -->
                        <div class="dashboard-card">
                            <h3>📊 Compliance by Control Family</h3>
                            <div class="family-breakdown-list">
                                ${analytics.familyBreakdown.map(family => `
                                    <div class="family-breakdown-item">
                                        <div class="family-info">
                                            <div class="family-name">${family.name}</div>
                                            <div class="family-stats">${family.met}/${family.total} controls</div>
                                        </div>
                                        <div class="family-progress">
                                            <div class="progress-bar-mini">
                                                <div class="progress-fill" style="width: ${family.complianceRate}%; background: ${this.getProgressColor(family.complianceRate)}"></div>
                                            </div>
                                            <div class="progress-label">${family.complianceRate}%</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Risk Areas -->
                        ${analytics.riskAreas.length > 0 ? `
                        <div class="dashboard-card risk-card">
                            <h3>⚠️ High-Risk Areas</h3>
                            <div class="risk-areas-list">
                                ${analytics.riskAreas.map(risk => `
                                    <div class="risk-area-item ${risk.severity}">
                                        <div class="risk-header">
                                            <span class="risk-family">${risk.family}</span>
                                            <span class="risk-badge ${risk.severity}">${risk.severity}</span>
                                        </div>
                                        <div class="risk-details">
                                            ${risk.criticalGaps > 0 ? `<span>${risk.criticalGaps} critical gaps</span>` : ''}
                                            ${risk.highGaps > 0 ? `<span>${risk.highGaps} high priority gaps</span>` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>

                    <!-- Right Column -->
                    <div class="dashboard-column">
                        <!-- Executive Recommendations -->
                        <div class="dashboard-card">
                            <h3>💡 Executive Recommendations</h3>
                            <div class="exec-recommendations-list">
                                ${analytics.recommendations.map(rec => `
                                    <div class="exec-rec-item ${rec.priority}">
                                        <div class="rec-priority-badge ${rec.priority}">${rec.priority}</div>
                                        <div class="rec-content">
                                            <h4>${rec.title}</h4>
                                            <p class="rec-description">${rec.description}</p>
                                            <p class="rec-impact"><strong>Impact:</strong> ${rec.impact}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Compliance Trend -->
                        ${analytics.timeline.length > 0 ? `
                        <div class="dashboard-card">
                            <h3>📈 Recent Activity (Last 30 Days)</h3>
                            <div class="timeline-summary">
                                <div class="timeline-stat positive">
                                    <span class="timeline-value">${analytics.timeline.reduce((sum, t) => sum + t.improvements, 0)}</span>
                                    <span class="timeline-label">Improvements</span>
                                </div>
                                <div class="timeline-stat negative">
                                    <span class="timeline-value">${analytics.timeline.reduce((sum, t) => sum + t.regressions, 0)}</span>
                                    <span class="timeline-label">Regressions</span>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Readiness Assessment -->
                        <div class="dashboard-card readiness-card">
                            <h3>🎯 Assessment Readiness</h3>
                            <div class="readiness-content">
                                <div class="readiness-level ${this.getReadinessClass(analytics.stats.complianceRate)}">
                                    ${this.getReadinessLevel(analytics.stats.complianceRate)}
                                </div>
                                <p class="readiness-description">
                                    ${this.getReadinessDescription(analytics.stats.complianceRate)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    getProgressColor: function(rate) {
        if (rate >= 90) return '#98c379';
        if (rate >= 70) return '#e5c07b';
        return '#e06c75';
    },

    getReadinessClass: function(rate) {
        if (rate >= 95) return 'ready';
        if (rate >= 80) return 'near-ready';
        if (rate >= 60) return 'in-progress';
        return 'early-stage';
    },

    getReadinessLevel: function(rate) {
        if (rate >= 95) return 'Ready for Assessment';
        if (rate >= 80) return 'Near Ready';
        if (rate >= 60) return 'In Progress';
        if (rate >= 30) return 'Early Stage';
        return 'Getting Started';
    },

    getReadinessDescription: function(rate) {
        if (rate >= 95) return 'Organization is ready to schedule a formal CMMC assessment.';
        if (rate >= 80) return 'Focus on remaining gaps to achieve assessment readiness.';
        if (rate >= 60) return 'Continue implementation efforts. Consider gap analysis for prioritization.';
        if (rate >= 30) return 'Establish dedicated resources and timeline for compliance program.';
        return 'Begin with high-priority controls and establish governance framework.';
    },

    exportReport: function() {
        const analytics = this.generateAnalytics();
        
        const report = {
            title: 'CMMC Level 2 Executive Report',
            generatedAt: analytics.generatedAt,
            organization: localStorage.getItem('nist-org-data') ? JSON.parse(localStorage.getItem('nist-org-data')).clientName : 'Unknown',
            summary: {
                complianceRate: analytics.stats.complianceRate,
                sprsScore: analytics.stats.sprsScore,
                totalControls: analytics.stats.total,
                metControls: analytics.stats.met,
                criticalGaps: analytics.stats.notMet,
                readinessLevel: this.getReadinessLevel(analytics.stats.complianceRate)
            },
            familyBreakdown: analytics.familyBreakdown,
            riskAreas: analytics.riskAreas,
            recommendations: analytics.recommendations
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `executive-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Executive report exported', 'success');

        // Log activity
        if (typeof CollaborationManager !== 'undefined') {
            CollaborationManager.logActivity('export', 'Exported executive report');
        }
    },

    showToast: function(message, type = 'info') {
        if (typeof app !== 'undefined' && app.showToast) {
            app.showToast(message, type);
        } else {
            console.log(`[ExecutiveDashboard] ${type}: ${message}`);
        }
    }
};

// Initialize
if (typeof document !== 'undefined') {
    document.readyState === 'loading' ? 
        document.addEventListener('DOMContentLoaded', () => ExecutiveDashboard.init()) : 
        ExecutiveDashboard.init();
}

if (typeof window !== 'undefined') {
    window.ExecutiveDashboard = ExecutiveDashboard;
}
