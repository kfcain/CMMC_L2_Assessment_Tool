// Compliance Readiness Scorecard Module
// Calculates readiness scores, provides gap analysis, and tracks trends over time
// Works entirely with localStorage

const ReadinessScorecard = {
    config: {
        version: "1.0.0",
        storageKey: "nist-readiness-history",
        gradeThresholds: {
            'A': 95,
            'B': 85,
            'C': 75,
            'D': 65,
            'F': 0
        },
        readinessLevels: {
            'ready': { min: 95, label: 'Assessment Ready', color: '#10b981' },
            'near-ready': { min: 85, label: 'Near Ready', color: '#3b82f6' },
            'in-progress': { min: 70, label: 'In Progress', color: '#f59e0b' },
            'early-stage': { min: 50, label: 'Early Stage', color: '#ef4444' },
            'getting-started': { min: 0, label: 'Getting Started', color: '#6b7280' }
        }
    },

    readinessHistory: [],

    init: function() {
        this.loadHistory();
        this.bindEvents();
        console.log('[ReadinessScorecard] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            // Show readiness scorecard
            if (e.target.closest('#view-readiness-scorecard-btn')) {
                this.showReadinessScorecard();
            }

            // Calculate and save snapshot
            if (e.target.closest('#save-readiness-snapshot-btn')) {
                this.saveReadinessSnapshot();
            }

            // Export scorecard
            if (e.target.closest('#export-scorecard-btn')) {
                this.exportScorecard();
            }

            // View trend details
            if (e.target.closest('.view-trend-details-btn')) {
                this.showTrendDetails();
            }
        });
    },

    loadHistory: function() {
        const saved = localStorage.getItem(this.config.storageKey);
        this.readinessHistory = saved ? JSON.parse(saved) : [];
    },

    saveToStorage: function() {
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.readinessHistory));
    },

    calculateReadinessScore: function() {
        // Get assessment data from main app
        const assessmentData = typeof window.app !== 'undefined' ? window.app.assessmentData : {};
        
        // Get all objectives from control families
        const allObjectives = [];
        if (typeof CONTROL_FAMILIES !== 'undefined') {
            CONTROL_FAMILIES.forEach(family => {
                family.controls.forEach(control => {
                    control.objectives.forEach(objective => {
                        allObjectives.push({
                            id: objective.id,
                            familyId: family.id,
                            controlId: control.id,
                            status: assessmentData[objective.id] || 'not-assessed'
                        });
                    });
                });
            });
        }

        // Calculate scores
        const totalObjectives = allObjectives.length;
        const metObjectives = allObjectives.filter(o => o.status === 'met').length;
        const partialObjectives = allObjectives.filter(o => o.status === 'partial').length;
        const notMetObjectives = allObjectives.filter(o => o.status === 'not-met').length;
        const notAssessed = allObjectives.filter(o => o.status === 'not-assessed').length;

        // Calculate weighted score (Met = 100%, Partial = 50%, Not Met = 0%)
        const weightedScore = ((metObjectives * 100) + (partialObjectives * 50)) / totalObjectives;
        const overallScore = Math.round(weightedScore);

        // Calculate by family
        const familyScores = {};
        if (typeof CONTROL_FAMILIES !== 'undefined') {
            CONTROL_FAMILIES.forEach(family => {
                const familyObjectives = allObjectives.filter(o => o.familyId === family.id);
                const familyMet = familyObjectives.filter(o => o.status === 'met').length;
                const familyPartial = familyObjectives.filter(o => o.status === 'partial').length;
                const familyScore = ((familyMet * 100) + (familyPartial * 50)) / familyObjectives.length;
                
                familyScores[family.id] = {
                    name: family.name,
                    score: Math.round(familyScore),
                    total: familyObjectives.length,
                    met: familyMet,
                    partial: familyPartial,
                    notMet: familyObjectives.filter(o => o.status === 'not-met').length,
                    notAssessed: familyObjectives.filter(o => o.status === 'not-assessed').length
                };
            });
        }

        // Get enhanced data for more insights
        const enhancedData = typeof AssessmentEnhancements !== 'undefined' ? AssessmentEnhancements.enhancedData : {};
        const objectivesWithEvidence = Object.keys(enhancedData).filter(id => 
            enhancedData[id].linkedEvidence && enhancedData[id].linkedEvidence.length > 0
        ).length;

        const objectivesWithImplementation = Object.keys(enhancedData).filter(id =>
            enhancedData[id].implementationNotes && enhancedData[id].implementationNotes.length > 0
        ).length;

        // Get POA&M data
        const poamData = typeof window.app !== 'undefined' ? window.app.poamData : {};
        const poamCount = Object.keys(poamData).length;

        return {
            timestamp: Date.now(),
            overallScore,
            grade: this.calculateGrade(overallScore),
            readinessLevel: this.calculateReadinessLevel(overallScore),
            totalObjectives,
            metObjectives,
            partialObjectives,
            notMetObjectives,
            notAssessed,
            assessmentProgress: Math.round(((totalObjectives - notAssessed) / totalObjectives) * 100),
            evidenceCoverage: Math.round((objectivesWithEvidence / totalObjectives) * 100),
            implementationDocumentation: Math.round((objectivesWithImplementation / totalObjectives) * 100),
            poamCount,
            familyScores,
            gaps: this.identifyGaps(familyScores, allObjectives)
        };
    },

    calculateGrade: function(score) {
        for (const [grade, threshold] of Object.entries(this.config.gradeThresholds)) {
            if (score >= threshold) return grade;
        }
        return 'F';
    },

    calculateReadinessLevel: function(score) {
        for (const [level, config] of Object.entries(this.config.readinessLevels)) {
            if (score >= config.min) return level;
        }
        return 'getting-started';
    },

    identifyGaps: function(familyScores, allObjectives) {
        const gaps = [];

        // Identify families with low scores
        Object.entries(familyScores).forEach(([familyId, data]) => {
            if (data.score < 70) {
                gaps.push({
                    type: 'low-family-score',
                    severity: 'high',
                    family: data.name,
                    score: data.score,
                    description: `${data.name} family has a low readiness score of ${data.score}%`,
                    recommendation: `Focus on implementing controls in ${data.name}. ${data.notMet} objectives are not met.`
                });
            }
        });

        // Identify objectives without evidence
        const enhancedData = typeof AssessmentEnhancements !== 'undefined' ? AssessmentEnhancements.enhancedData : {};
        const metWithoutEvidence = allObjectives.filter(o => 
            o.status === 'met' && 
            (!enhancedData[o.id] || !enhancedData[o.id].linkedEvidence || enhancedData[o.id].linkedEvidence.length === 0)
        );

        if (metWithoutEvidence.length > 0) {
            gaps.push({
                type: 'missing-evidence',
                severity: 'medium',
                count: metWithoutEvidence.length,
                description: `${metWithoutEvidence.length} objectives marked "Met" lack linked evidence`,
                recommendation: 'Link evidence to all "Met" objectives to support assessment findings'
            });
        }

        // Identify high POA&M count
        const poamData = typeof window.app !== 'undefined' ? window.app.poamData : {};
        if (Object.keys(poamData).length > 10) {
            gaps.push({
                type: 'high-poam-count',
                severity: 'medium',
                count: Object.keys(poamData).length,
                description: `${Object.keys(poamData).length} items on POA&M`,
                recommendation: 'Consider prioritizing POA&M remediation to improve readiness'
            });
        }

        return gaps;
    },

    showReadinessScorecard: function() {
        const scorecard = this.calculateReadinessScore();
        const readinessConfig = this.config.readinessLevels[scorecard.readinessLevel];

        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content scorecard-modal">
                <div class="modal-header">
                    <h2>Compliance Readiness Scorecard</h2>
                    <button class="modal-close" data-action="close-backdrop">×</button>
                </div>
                <div class="modal-body">
                    <!-- Overall Score -->
                    <div class="scorecard-hero">
                        <div class="score-display">
                            <div class="score-circle" style="--score: ${scorecard.overallScore}; --color: ${readinessConfig.color}">
                                <svg width="200" height="200">
                                    <circle cx="100" cy="100" r="90" fill="none" stroke="var(--bg-tertiary)" stroke-width="20"/>
                                    <circle cx="100" cy="100" r="90" fill="none" stroke="${readinessConfig.color}" stroke-width="20"
                                            stroke-dasharray="${2 * Math.PI * 90}" 
                                            stroke-dashoffset="${2 * Math.PI * 90 * (1 - scorecard.overallScore / 100)}"
                                            transform="rotate(-90 100 100)"/>
                                </svg>
                                <div class="score-text">
                                    <div class="score-number">${scorecard.overallScore}</div>
                                    <div class="score-grade">${scorecard.grade}</div>
                                </div>
                            </div>
                        </div>
                        <div class="score-details">
                            <div class="readiness-badge" style="background: ${readinessConfig.color}">
                                ${readinessConfig.label}
                            </div>
                            <div class="score-breakdown">
                                <div class="breakdown-item">
                                    <span class="breakdown-label">Met:</span>
                                    <span class="breakdown-value met">${scorecard.metObjectives} (${Math.round(scorecard.metObjectives/scorecard.totalObjectives*100)}%)</span>
                                </div>
                                <div class="breakdown-item">
                                    <span class="breakdown-label">Partial:</span>
                                    <span class="breakdown-value partial">${scorecard.partialObjectives} (${Math.round(scorecard.partialObjectives/scorecard.totalObjectives*100)}%)</span>
                                </div>
                                <div class="breakdown-item">
                                    <span class="breakdown-label">Not Met:</span>
                                    <span class="breakdown-value not-met">${scorecard.notMetObjectives} (${Math.round(scorecard.notMetObjectives/scorecard.totalObjectives*100)}%)</span>
                                </div>
                                <div class="breakdown-item">
                                    <span class="breakdown-label">Not Assessed:</span>
                                    <span class="breakdown-value">${scorecard.notAssessed}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Key Metrics -->
                    <div class="scorecard-metrics">
                        <div class="metric-card">
                            <div class="metric-label">Assessment Progress</div>
                            <div class="metric-value">${scorecard.assessmentProgress}%</div>
                            <div class="metric-bar">
                                <div class="metric-bar-fill" style="width: ${scorecard.assessmentProgress}%"></div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Evidence Coverage</div>
                            <div class="metric-value">${scorecard.evidenceCoverage}%</div>
                            <div class="metric-bar">
                                <div class="metric-bar-fill" style="width: ${scorecard.evidenceCoverage}%"></div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Implementation Docs</div>
                            <div class="metric-value">${scorecard.implementationDocumentation}%</div>
                            <div class="metric-bar">
                                <div class="metric-bar-fill" style="width: ${scorecard.implementationDocumentation}%"></div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">POA&M Items</div>
                            <div class="metric-value">${scorecard.poamCount}</div>
                        </div>
                    </div>

                    <!-- Family Breakdown -->
                    <div class="family-breakdown">
                        <h3>Control Family Breakdown</h3>
                        <div class="family-grid">
                            ${Object.entries(scorecard.familyScores).map(([id, family]) => `
                                <div class="family-card">
                                    <div class="family-header">
                                        <div class="family-name">${family.name}</div>
                                        <div class="family-score ${this.getScoreClass(family.score)}">${family.score}%</div>
                                    </div>
                                    <div class="family-progress">
                                        <div class="progress-bar-fill" style="width: ${family.score}%"></div>
                                    </div>
                                    <div class="family-stats">
                                        <span class="met">${family.met} Met</span>
                                        <span class="partial">${family.partial} Partial</span>
                                        <span class="not-met">${family.notMet} Not Met</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Gap Analysis -->
                    ${scorecard.gaps.length > 0 ? `
                        <div class="gap-analysis">
                            <h3>Gap Analysis</h3>
                            <div class="gaps-list">
                                ${scorecard.gaps.map(gap => `
                                    <div class="gap-item ${gap.severity}">
                                        <div class="gap-header">
                                            <span class="gap-severity">${gap.severity.toUpperCase()}</span>
                                            <span class="gap-type">${gap.type.replace(/-/g, ' ').toUpperCase()}</span>
                                        </div>
                                        <div class="gap-description">${gap.description}</div>
                                        <div class="gap-recommendation"><strong>Recommendation:</strong> ${gap.recommendation}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Trend Analysis -->
                    ${this.readinessHistory.length > 0 ? `
                        <div class="trend-analysis">
                            <h3>Trend Analysis</h3>
                            ${this.renderTrendChart()}
                        </div>
                    ` : ''}

                    <!-- Actions -->
                    <div class="scorecard-actions">
                        <button class="btn-secondary" id="save-readiness-snapshot-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                            Save Snapshot
                        </button>
                        <button class="btn-primary" id="export-scorecard-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Export Scorecard
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    getScoreClass: function(score) {
        if (score >= 90) return 'excellent';
        if (score >= 75) return 'good';
        if (score >= 60) return 'fair';
        return 'poor';
    },

    renderTrendChart: function() {
        const recentHistory = this.readinessHistory.slice(-10);
        const maxScore = 100;
        const chartHeight = 150;

        const points = recentHistory.map((snapshot, index) => {
            const x = (index / (recentHistory.length - 1)) * 100;
            const y = chartHeight - (snapshot.overallScore / maxScore * chartHeight);
            return `${x},${y}`;
        }).join(' ');

        return `
            <div class="trend-chart">
                <svg width="100%" height="${chartHeight}" viewBox="0 0 100 ${chartHeight}" preserveAspectRatio="none">
                    <polyline points="${points}" fill="none" stroke="#10b981" stroke-width="2"/>
                    ${recentHistory.map((snapshot, index) => {
                        const x = (index / (recentHistory.length - 1)) * 100;
                        const y = chartHeight - (snapshot.overallScore / maxScore * chartHeight);
                        return `<circle cx="${x}" cy="${y}" r="3" fill="#10b981"/>`;
                    }).join('')}
                </svg>
                <div class="trend-labels">
                    <span>${recentHistory[0].overallScore}%</span>
                    <span>${recentHistory[recentHistory.length - 1].overallScore}%</span>
                </div>
            </div>
            <div class="trend-summary">
                <p>Showing last ${recentHistory.length} snapshots. 
                ${recentHistory.length > 1 ? 
                    `Trend: ${recentHistory[recentHistory.length - 1].overallScore - recentHistory[0].overallScore > 0 ? '📈 Improving' : '📉 Declining'}` : 
                    'Save more snapshots to see trends.'
                }</p>
            </div>
        `;
    },

    saveReadinessSnapshot: function() {
        const scorecard = this.calculateReadinessScore();
        this.readinessHistory.push(scorecard);
        
        // Keep only last 50 snapshots
        if (this.readinessHistory.length > 50) {
            this.readinessHistory = this.readinessHistory.slice(-50);
        }
        
        this.saveToStorage();
        
        // Refresh view
        document.querySelector('.modal-backdrop').remove();
        this.showReadinessScorecard();
        this.showToast('Readiness snapshot saved', 'success');
    },

    exportScorecard: function() {
        const scorecard = this.calculateReadinessScore();
        
        const report = {
            exportDate: new Date().toISOString(),
            scorecard,
            history: this.readinessHistory
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `readiness-scorecard-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Scorecard exported', 'success');
    },

    showTrendDetails: function() {
        // Future enhancement: show detailed trend analysis
        this.showToast('Trend details coming soon', 'info');
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
    document.addEventListener('DOMContentLoaded', () => ReadinessScorecard.init());
} else {
    ReadinessScorecard.init();
}
