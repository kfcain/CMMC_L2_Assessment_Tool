// AI-Powered Gap Analysis Engine
// Analyzes assessment data and provides intelligent recommendations
// Works entirely client-side with rule-based AI (no external API required)

const GapAnalysis = {
    config: {
        version: "1.0.0",
        severityWeights: {
            critical: 10,
            high: 7,
            medium: 4,
            low: 2
        }
    },

    analysisCache: null,
    lastAnalysisTime: null,

    init: function() {
        console.log('[GapAnalysis] Initialized');
    },

    // Main analysis function
    analyzeAssessment: function(assessmentData, controlFamilies) {
        const startTime = Date.now();
        
        const analysis = {
            timestamp: new Date().toISOString(),
            summary: this.generateSummary(assessmentData, controlFamilies),
            gaps: this.identifyGaps(assessmentData, controlFamilies),
            recommendations: this.generateRecommendations(assessmentData, controlFamilies),
            riskScore: this.calculateRiskScore(assessmentData, controlFamilies),
            prioritizedActions: this.prioritizeActions(assessmentData, controlFamilies),
            complianceScore: this.calculateComplianceScore(assessmentData, controlFamilies),
            trends: this.analyzeTrends(assessmentData),
            estimatedEffort: this.estimateRemediationEffort(assessmentData, controlFamilies)
        };

        this.analysisCache = analysis;
        this.lastAnalysisTime = Date.now();
        
        console.log(`[GapAnalysis] Analysis completed in ${Date.now() - startTime}ms`);
        return analysis;
    },

    generateSummary: function(assessmentData, controlFamilies) {
        const stats = this.calculateStats(assessmentData, controlFamilies);
        
        return {
            totalObjectives: stats.total,
            assessed: stats.met + stats.partial + stats.notMet,
            notAssessed: stats.notAssessed,
            complianceRate: stats.total > 0 ? Math.round((stats.met / stats.total) * 100) : 0,
            criticalGaps: this.countCriticalGaps(assessmentData, controlFamilies),
            readinessLevel: this.determineReadinessLevel(stats)
        };
    },

    calculateStats: function(assessmentData, controlFamilies) {
        let total = 0, met = 0, partial = 0, notMet = 0, notAssessed = 0;

        controlFamilies.forEach(family => {
            family.controls.forEach(control => {
                control.objectives.forEach(objective => {
                    total++;
                    const status = assessmentData[objective.id]?.status || 'not-assessed';
                    
                    switch(status) {
                        case 'met': met++; break;
                        case 'partial': partial++; break;
                        case 'not-met': notMet++; break;
                        default: notAssessed++; break;
                    }
                });
            });
        });

        return { total, met, partial, notMet, notAssessed };
    },

    identifyGaps: function(assessmentData, controlFamilies) {
        const gaps = [];

        controlFamilies.forEach(family => {
            family.controls.forEach(control => {
                control.objectives.forEach(objective => {
                    const status = assessmentData[objective.id]?.status;
                    
                    if (status === 'not-met' || status === 'partial') {
                        gaps.push({
                            objectiveId: objective.id,
                            controlId: control.id,
                            familyId: family.id,
                            familyName: family.name,
                            description: objective.description,
                            status: status,
                            severity: this.determineSeverity(control, objective),
                            impact: this.assessImpact(control, objective),
                            dependencies: this.findDependencies(control.id, controlFamilies)
                        });
                    }
                });
            });
        });

        return gaps.sort((a, b) => {
            const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            return severityOrder[a.severity] - severityOrder[b.severity];
        });
    },

    determineSeverity: function(control, objective) {
        // Determine severity based on control characteristics
        const pointValue = control.pointValue || 1;
        const isNeverPoam = control.poamEligibility?.selfAssessment?.canBeOnPoam === false;

        if (isNeverPoam || pointValue >= 5) return 'critical';
        if (pointValue >= 3) return 'high';
        if (pointValue >= 2) return 'medium';
        return 'low';
    },

    assessImpact: function(control, objective) {
        const impacts = [];
        
        // Check control family for common impact areas
        if (control.id.startsWith('3.1.')) impacts.push('Access Control');
        if (control.id.startsWith('3.3.')) impacts.push('Audit & Accountability');
        if (control.id.startsWith('3.4.')) impacts.push('Configuration Management');
        if (control.id.startsWith('3.5.')) impacts.push('Identification & Authentication');
        if (control.id.startsWith('3.6.')) impacts.push('Incident Response');
        if (control.id.startsWith('3.12.')) impacts.push('Security Assessment');
        if (control.id.startsWith('3.13.')) impacts.push('System & Communications Protection');
        if (control.id.startsWith('3.14.')) impacts.push('System & Information Integrity');

        return impacts.length > 0 ? impacts : ['General Security'];
    },

    findDependencies: function(controlId, controlFamilies) {
        // Identify related controls that should be implemented together
        const dependencies = [];
        const family = controlId.split('.').slice(0, 2).join('.');

        // Controls in same family are often related
        controlFamilies.forEach(fam => {
            fam.controls.forEach(ctrl => {
                if (ctrl.id !== controlId && ctrl.id.startsWith(family)) {
                    dependencies.push(ctrl.id);
                }
            });
        });

        return dependencies.slice(0, 3); // Limit to top 3
    },

    generateRecommendations: function(assessmentData, controlFamilies) {
        const recommendations = [];
        const gaps = this.identifyGaps(assessmentData, controlFamilies);

        // Group gaps by family
        const gapsByFamily = {};
        gaps.forEach(gap => {
            if (!gapsByFamily[gap.familyId]) {
                gapsByFamily[gap.familyId] = [];
            }
            gapsByFamily[gap.familyId].push(gap);
        });

        // Generate family-level recommendations
        Object.keys(gapsByFamily).forEach(familyId => {
            const familyGaps = gapsByFamily[familyId];
            const criticalCount = familyGaps.filter(g => g.severity === 'critical').length;
            
            if (criticalCount > 0) {
                recommendations.push({
                    type: 'critical',
                    family: familyGaps[0].familyName,
                    title: `Address ${criticalCount} critical gap${criticalCount > 1 ? 's' : ''} in ${familyGaps[0].familyName}`,
                    description: `Focus on critical controls that cannot be on POA&M`,
                    priority: 1,
                    estimatedEffort: criticalCount * 40, // hours
                    affectedControls: familyGaps.filter(g => g.severity === 'critical').map(g => g.controlId)
                });
            }
        });

        // Add quick wins
        const quickWins = gaps.filter(g => g.severity === 'low' || g.severity === 'medium').slice(0, 5);
        if (quickWins.length > 0) {
            recommendations.push({
                type: 'quick-win',
                title: `Quick wins: ${quickWins.length} medium/low priority controls`,
                description: 'Address these controls to improve compliance score quickly',
                priority: 3,
                estimatedEffort: quickWins.length * 8,
                affectedControls: quickWins.map(g => g.controlId)
            });
        }

        // Add implementation patterns
        recommendations.push({
            type: 'pattern',
            title: 'Implement common security patterns',
            description: 'Consider implementing MFA, encryption, and logging across all systems',
            priority: 2,
            estimatedEffort: 80,
            affectedControls: ['3.5.3', '3.13.11', '3.3.1']
        });

        return recommendations.sort((a, b) => a.priority - b.priority);
    },

    calculateRiskScore: function(assessmentData, controlFamilies) {
        const gaps = this.identifyGaps(assessmentData, controlFamilies);
        let riskScore = 0;

        gaps.forEach(gap => {
            riskScore += this.config.severityWeights[gap.severity] || 1;
        });

        // Normalize to 0-100 scale
        const maxPossibleRisk = controlFamilies.reduce((sum, fam) => 
            sum + fam.controls.reduce((ctrlSum, ctrl) => 
                ctrlSum + ctrl.objectives.length * this.config.severityWeights.critical, 0), 0);

        return {
            score: Math.min(100, Math.round((riskScore / maxPossibleRisk) * 100)),
            level: riskScore < 50 ? 'Low' : riskScore < 150 ? 'Medium' : riskScore < 300 ? 'High' : 'Critical',
            totalGaps: gaps.length,
            criticalGaps: gaps.filter(g => g.severity === 'critical').length
        };
    },

    prioritizeActions: function(assessmentData, controlFamilies) {
        const gaps = this.identifyGaps(assessmentData, controlFamilies);
        
        return gaps.slice(0, 10).map((gap, index) => ({
            rank: index + 1,
            objectiveId: gap.objectiveId,
            controlId: gap.controlId,
            description: gap.description,
            severity: gap.severity,
            reason: this.getActionReason(gap),
            estimatedHours: this.estimateControlEffort(gap)
        }));
    },

    getActionReason: function(gap) {
        if (gap.severity === 'critical') {
            return 'Cannot be on POA&M - must be implemented';
        }
        if (gap.status === 'not-met') {
            return 'Currently not implemented';
        }
        return 'Partially implemented - needs completion';
    },

    estimateControlEffort: function(gap) {
        const baseHours = {
            critical: 40,
            high: 24,
            medium: 16,
            low: 8
        };
        return baseHours[gap.severity] || 16;
    },

    calculateComplianceScore: function(assessmentData, controlFamilies) {
        const stats = this.calculateStats(assessmentData, controlFamilies);
        
        // Weighted scoring: met = 100%, partial = 50%, not-met = 0%
        const score = ((stats.met * 100) + (stats.partial * 50)) / stats.total;
        
        return {
            score: Math.round(score),
            grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F',
            met: stats.met,
            partial: stats.partial,
            notMet: stats.notMet,
            total: stats.total
        };
    },

    analyzeTrends: function(assessmentData) {
        // Analyze edit history for trends
        const editHistory = JSON.parse(localStorage.getItem('nist-edit-history') || '{}');
        const recentEdits = [];

        Object.keys(editHistory).forEach(key => {
            const edits = editHistory[key];
            edits.forEach(edit => {
                const editDate = new Date(edit.timestamp);
                const daysSince = (Date.now() - editDate.getTime()) / (1000 * 60 * 60 * 24);
                
                if (daysSince <= 30) {
                    recentEdits.push({
                        date: editDate,
                        action: edit.action,
                        newValue: edit.newValue
                    });
                }
            });
        });

        const improvements = recentEdits.filter(e => e.newValue === 'met').length;
        const regressions = recentEdits.filter(e => e.newValue === 'not-met').length;

        return {
            recentActivity: recentEdits.length,
            improvements: improvements,
            regressions: regressions,
            momentum: improvements > regressions ? 'positive' : improvements < regressions ? 'negative' : 'stable'
        };
    },

    estimateRemediationEffort: function(assessmentData, controlFamilies) {
        const gaps = this.identifyGaps(assessmentData, controlFamilies);
        
        let totalHours = 0;
        gaps.forEach(gap => {
            totalHours += this.estimateControlEffort(gap);
        });

        return {
            totalHours: totalHours,
            totalDays: Math.ceil(totalHours / 8),
            totalWeeks: Math.ceil(totalHours / 40),
            byPhase: {
                planning: Math.round(totalHours * 0.2),
                implementation: Math.round(totalHours * 0.6),
                testing: Math.round(totalHours * 0.2)
            }
        };
    },

    countCriticalGaps: function(assessmentData, controlFamilies) {
        return this.identifyGaps(assessmentData, controlFamilies)
            .filter(g => g.severity === 'critical').length;
    },

    determineReadinessLevel: function(stats) {
        const complianceRate = (stats.met / stats.total) * 100;
        
        if (complianceRate >= 95) return 'Ready for Assessment';
        if (complianceRate >= 80) return 'Near Ready';
        if (complianceRate >= 60) return 'In Progress';
        if (complianceRate >= 30) return 'Early Stage';
        return 'Getting Started';
    },

    // Export analysis report
    exportReport: function(analysis) {
        const report = {
            generatedAt: new Date().toISOString(),
            summary: analysis.summary,
            complianceScore: analysis.complianceScore,
            riskScore: analysis.riskScore,
            gaps: analysis.gaps,
            recommendations: analysis.recommendations,
            prioritizedActions: analysis.prioritizedActions,
            estimatedEffort: analysis.estimatedEffort
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gap-analysis-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
};

// Initialize
if (typeof window !== 'undefined') {
    window.GapAnalysis = GapAnalysis;
    GapAnalysis.init();
}
