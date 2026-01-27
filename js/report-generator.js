// Assessment Report Generator Module
// Generates professional PDF reports, executive summaries, and C3PAO-ready documentation

const ReportGenerator = {
    config: {
        version: "1.0.0",
        brandColors: {
            primary: "#1e40af",
            secondary: "#3b82f6",
            success: "#10b981",
            warning: "#f59e0b",
            danger: "#ef4444",
            neutral: "#6b7280"
        }
    },

    // Initialize the report generator
    init: function() {
        this.bindEvents();
        console.log('[ReportGenerator] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#generate-exec-summary-btn')) {
                this.generateExecutiveSummary();
            }
            if (e.target.closest('#generate-gap-analysis-btn')) {
                this.generateGapAnalysis();
            }
            if (e.target.closest('#generate-ssp-appendix-btn')) {
                this.generateSSPAppendix();
            }
            if (e.target.closest('#generate-c3pao-report-btn')) {
                this.generateC3PAOReport();
            }
        });
    },

    // Get current assessment data from the app
    getAssessmentData: function() {
        if (typeof app !== 'undefined') {
            return {
                assessmentData: app.assessmentData || {},
                poamData: app.poamData || {},
                deficiencyData: app.deficiencyData || {},
                implementationData: app.implementationData || {},
                orgData: app.orgData || {},
                assessmentLevel: app.assessmentLevel || 2,
                controlFamilies: typeof CONTROL_FAMILIES !== 'undefined' ? CONTROL_FAMILIES : []
            };
        }
        return null;
    },

    // Calculate comprehensive assessment statistics
    calculateStats: function(data) {
        const stats = {
            totalControls: 0,
            totalObjectives: 0,
            objectivesMet: 0,
            objectivesNotMet: 0,
            objectivesPartial: 0,
            objectivesNA: 0,
            objectivesNotAssessed: 0,
            poamItems: 0,
            deficiencies: 0,
            sprsScore: 110,
            percentComplete: 0,
            byFamily: {},
            criticalGaps: [],
            highValueControls: []
        };

        const sprsScoring = typeof SPRS_SCORING !== 'undefined' ? SPRS_SCORING : null;
        const level = data.assessmentLevel;

        data.controlFamilies.forEach(family => {
            const familyStats = {
                name: family.name,
                controls: 0,
                objectives: 0,
                met: 0,
                notMet: 0,
                partial: 0,
                na: 0,
                notAssessed: 0,
                score: 0
            };

            family.controls.forEach(control => {
                // Skip L2-only controls for L1 assessment
                if (level === 1 && !control.l1Required) return;

                stats.totalControls++;
                familyStats.controls++;

                control.objectives.forEach(obj => {
                    stats.totalObjectives++;
                    familyStats.objectives++;

                    const status = data.assessmentData[obj.id] || 'not-assessed';
                    
                    switch(status) {
                        case 'met':
                            stats.objectivesMet++;
                            familyStats.met++;
                            break;
                        case 'not-met':
                            stats.objectivesNotMet++;
                            familyStats.notMet++;
                            // Check SPRS impact
                            if (sprsScoring && sprsScoring.pointValues[control.id]) {
                                const points = sprsScoring.pointValues[control.id];
                                stats.sprsScore -= points;
                                if (points >= 5) {
                                    stats.criticalGaps.push({
                                        controlId: control.id,
                                        objectiveId: obj.id,
                                        points: points,
                                        name: control.name
                                    });
                                }
                            }
                            break;
                        case 'partially-met':
                            stats.objectivesPartial++;
                            familyStats.partial++;
                            break;
                        case 'not-applicable':
                            stats.objectivesNA++;
                            familyStats.na++;
                            break;
                        default:
                            stats.objectivesNotAssessed++;
                            familyStats.notAssessed++;
                    }
                });

                // Track high-value controls
                if (sprsScoring && sprsScoring.pointValues[control.id] >= 5) {
                    stats.highValueControls.push({
                        id: control.id,
                        name: control.name,
                        points: sprsScoring.pointValues[control.id],
                        family: family.name
                    });
                }
            });

            stats.byFamily[family.id] = familyStats;
        });

        // Calculate POA&M and deficiency counts
        stats.poamItems = Object.keys(data.poamData).length;
        stats.deficiencies = Object.keys(data.deficiencyData).length;

        // Calculate completion percentage
        const assessed = stats.objectivesMet + stats.objectivesNotMet + stats.objectivesPartial + stats.objectivesNA;
        stats.percentComplete = stats.totalObjectives > 0 
            ? Math.round((assessed / stats.totalObjectives) * 100) 
            : 0;

        // Sort critical gaps by impact
        stats.criticalGaps.sort((a, b) => b.points - a.points);

        return stats;
    },

    // Generate Executive Summary Report
    generateExecutiveSummary: async function() {
        const data = this.getAssessmentData();
        if (!data) {
            alert('No assessment data available');
            return;
        }

        const stats = this.calculateStats(data);
        const orgName = data.orgData.oscName || 'Organization';
        const assessorName = data.orgData.assessorName || 'Assessor';
        const assessmentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });

        const reportHTML = this.buildExecutiveSummaryHTML(stats, orgName, assessorName, assessmentDate, data.assessmentLevel);
        
        // Open in new window for printing/PDF
        this.openReportWindow('Executive Summary - ' + orgName, reportHTML);
    },

    buildExecutiveSummaryHTML: function(stats, orgName, assessorName, assessmentDate, level) {
        const levelText = level === 1 ? 'Level 1 (Foundational)' : 'Level 2 (Advanced)';
        const sprsClass = stats.sprsScore >= 70 ? 'score-good' : stats.sprsScore >= 0 ? 'score-warning' : 'score-critical';
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CMMC Assessment Executive Summary</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #1f2937; 
            background: #fff;
            padding: 40px;
        }
        .report-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #1e40af;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .report-title h1 { font-size: 28px; color: #1e40af; margin-bottom: 5px; }
        .report-title h2 { font-size: 18px; color: #6b7280; font-weight: 400; }
        .report-meta { text-align: right; font-size: 14px; color: #6b7280; }
        .report-meta strong { color: #1f2937; }
        
        .score-card {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }
        .score-item {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            border: 1px solid #e2e8f0;
        }
        .score-item.primary { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; }
        .score-item .value { font-size: 36px; font-weight: 700; }
        .score-item .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; }
        
        .score-good .value { color: #10b981; }
        .score-warning .value { color: #f59e0b; }
        .score-critical .value { color: #ef4444; }
        
        .section { margin-bottom: 40px; }
        .section-title { 
            font-size: 18px; 
            font-weight: 600; 
            color: #1e40af; 
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        
        .progress-bar-container { 
            background: #e2e8f0; 
            border-radius: 10px; 
            height: 24px; 
            overflow: hidden;
            margin-bottom: 10px;
        }
        .progress-bar { 
            height: 100%; 
            border-radius: 10px;
            display: flex;
            transition: width 0.3s;
        }
        .progress-met { background: #10b981; }
        .progress-partial { background: #f59e0b; }
        .progress-not-met { background: #ef4444; }
        .progress-na { background: #6b7280; }
        
        .legend { display: flex; gap: 20px; font-size: 12px; margin-top: 10px; }
        .legend-item { display: flex; align-items: center; gap: 5px; }
        .legend-dot { width: 12px; height: 12px; border-radius: 3px; }
        
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f8fafc; font-weight: 600; color: #1e40af; }
        tr:hover { background: #f8fafc; }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status-met { background: #d1fae5; color: #065f46; }
        .status-partial { background: #fef3c7; color: #92400e; }
        .status-not-met { background: #fee2e2; color: #991b1b; }
        
        .critical-gap {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 0 8px 8px 0;
        }
        .critical-gap .control-id { font-weight: 600; color: #991b1b; }
        .critical-gap .points { 
            float: right; 
            background: #ef4444; 
            color: white; 
            padding: 2px 8px; 
            border-radius: 4px;
            font-size: 12px;
        }
        
        .recommendation-box {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        .recommendation-box h4 { color: #1e40af; margin-bottom: 10px; }
        .recommendation-box ul { margin-left: 20px; }
        .recommendation-box li { margin-bottom: 8px; }
        
        .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }
        
        @media print {
            body { padding: 20px; }
            .no-print { display: none; }
            .page-break { page-break-before: always; }
        }
    </style>
</head>
<body>
    <div class="report-header">
        <div class="report-title">
            <h1>CMMC 2.0 Assessment Executive Summary</h1>
            <h2>${orgName}</h2>
        </div>
        <div class="report-meta">
            <div><strong>Assessment Date:</strong> ${assessmentDate}</div>
            <div><strong>Prepared By:</strong> ${assessorName}</div>
            <div><strong>Assessment Level:</strong> ${levelText}</div>
        </div>
    </div>

    <div class="score-card">
        <div class="score-item primary">
            <div class="value">${stats.sprsScore}</div>
            <div class="label">SPRS Score</div>
        </div>
        <div class="score-item">
            <div class="value">${stats.percentComplete}%</div>
            <div class="label">Assessment Complete</div>
        </div>
        <div class="score-item">
            <div class="value">${stats.objectivesMet}</div>
            <div class="label">Objectives Met</div>
        </div>
        <div class="score-item">
            <div class="value">${stats.poamItems}</div>
            <div class="label">POA&M Items</div>
        </div>
    </div>

    <div class="section">
        <h3 class="section-title">Assessment Progress by Status</h3>
        <div class="progress-bar-container">
            <div class="progress-bar" style="width: 100%;">
                <div class="progress-met" style="width: ${(stats.objectivesMet / stats.totalObjectives * 100).toFixed(1)}%"></div>
                <div class="progress-partial" style="width: ${(stats.objectivesPartial / stats.totalObjectives * 100).toFixed(1)}%"></div>
                <div class="progress-not-met" style="width: ${(stats.objectivesNotMet / stats.totalObjectives * 100).toFixed(1)}%"></div>
                <div class="progress-na" style="width: ${(stats.objectivesNA / stats.totalObjectives * 100).toFixed(1)}%"></div>
            </div>
        </div>
        <div class="legend">
            <div class="legend-item"><div class="legend-dot" style="background: #10b981;"></div> Met (${stats.objectivesMet})</div>
            <div class="legend-item"><div class="legend-dot" style="background: #f59e0b;"></div> Partial (${stats.objectivesPartial})</div>
            <div class="legend-item"><div class="legend-dot" style="background: #ef4444;"></div> Not Met (${stats.objectivesNotMet})</div>
            <div class="legend-item"><div class="legend-dot" style="background: #6b7280;"></div> N/A (${stats.objectivesNA})</div>
            <div class="legend-item"><div class="legend-dot" style="background: #e2e8f0;"></div> Not Assessed (${stats.objectivesNotAssessed})</div>
        </div>
    </div>

    <div class="section">
        <h3 class="section-title">Performance by Control Family</h3>
        <table>
            <thead>
                <tr>
                    <th>Family</th>
                    <th>Controls</th>
                    <th>Objectives</th>
                    <th>Met</th>
                    <th>Not Met</th>
                    <th>Compliance %</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(stats.byFamily).map(([id, fam]) => {
                    const complianceRate = fam.objectives > 0 
                        ? Math.round(((fam.met + fam.na) / fam.objectives) * 100) 
                        : 0;
                    const statusClass = complianceRate >= 80 ? 'status-met' : complianceRate >= 50 ? 'status-partial' : 'status-not-met';
                    return `
                    <tr>
                        <td><strong>${fam.name}</strong></td>
                        <td>${fam.controls}</td>
                        <td>${fam.objectives}</td>
                        <td>${fam.met}</td>
                        <td>${fam.notMet}</td>
                        <td><span class="status-badge ${statusClass}">${complianceRate}%</span></td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>
    </div>

    ${stats.criticalGaps.length > 0 ? `
    <div class="section page-break">
        <h3 class="section-title">Critical Gaps (High SPRS Impact)</h3>
        ${stats.criticalGaps.slice(0, 10).map(gap => `
        <div class="critical-gap">
            <span class="points">-${gap.points} pts</span>
            <span class="control-id">${gap.controlId}</span> - ${gap.name}
            <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Objective: ${gap.objectiveId}</div>
        </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="section">
        <h3 class="section-title">Recommendations</h3>
        <div class="recommendation-box">
            <h4>Priority Actions</h4>
            <ul>
                ${stats.criticalGaps.length > 0 ? `<li>Address ${stats.criticalGaps.length} high-impact controls to maximize SPRS score improvement</li>` : ''}
                ${stats.objectivesNotAssessed > 0 ? `<li>Complete assessment of ${stats.objectivesNotAssessed} remaining objectives</li>` : ''}
                ${stats.poamItems > 0 ? `<li>Execute ${stats.poamItems} POA&M items within documented timelines</li>` : ''}
                <li>Document implementation evidence for all MET objectives</li>
                <li>Review and update System Security Plan (SSP) to reflect current state</li>
            </ul>
        </div>
    </div>

    <div class="footer">
        <p>Generated by CMMC 2.0 Assessment Tool | ${new Date().toISOString()}</p>
        <p>This report is for planning purposes. Official CMMC certification requires assessment by an authorized C3PAO.</p>
    </div>
</body>
</html>`;
    },

    // Generate detailed Gap Analysis report
    generateGapAnalysis: async function() {
        const data = this.getAssessmentData();
        if (!data) {
            alert('No assessment data available');
            return;
        }

        const stats = this.calculateStats(data);
        const orgName = data.orgData.oscName || 'Organization';
        const gaps = this.collectGaps(data);
        
        const reportHTML = this.buildGapAnalysisHTML(stats, orgName, gaps, data);
        this.openReportWindow('Gap Analysis - ' + orgName, reportHTML);
    },

    collectGaps: function(data) {
        const gaps = [];
        const sprsScoring = typeof SPRS_SCORING !== 'undefined' ? SPRS_SCORING : null;

        data.controlFamilies.forEach(family => {
            family.controls.forEach(control => {
                control.objectives.forEach(obj => {
                    const status = data.assessmentData[obj.id];
                    if (status === 'not-met' || status === 'partially-met') {
                        const poamItem = data.poamData[obj.id];
                        const deficiency = data.deficiencyData[obj.id];
                        
                        gaps.push({
                            controlId: control.id,
                            controlName: control.name,
                            objectiveId: obj.id,
                            objectiveText: obj.text,
                            status: status,
                            family: family.name,
                            familyId: family.id,
                            sprsPoints: sprsScoring ? (sprsScoring.pointValues[control.id] || 0) : 0,
                            poamEligible: sprsScoring ? (sprsScoring.poamEligibility && sprsScoring.poamEligibility[control.id] !== false) : true,
                            hasPOAM: !!poamItem,
                            hasDeficiency: !!deficiency,
                            poamData: poamItem,
                            deficiencyData: deficiency
                        });
                    }
                });
            });
        });

        // Sort by SPRS impact
        gaps.sort((a, b) => b.sprsPoints - a.sprsPoints);
        return gaps;
    },

    buildGapAnalysisHTML: function(stats, orgName, gaps, data) {
        const assessmentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });
        
        // Group gaps by family
        const gapsByFamily = {};
        gaps.forEach(gap => {
            if (!gapsByFamily[gap.familyId]) {
                gapsByFamily[gap.familyId] = {
                    name: gap.family,
                    gaps: []
                };
            }
            gapsByFamily[gap.familyId].gaps.push(gap);
        });

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CMMC Gap Analysis Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #1f2937; 
            background: #fff;
            padding: 40px;
            font-size: 12px;
        }
        .report-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #1e40af;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .report-title h1 { font-size: 24px; color: #1e40af; margin-bottom: 5px; }
        .report-title h2 { font-size: 16px; color: #6b7280; font-weight: 400; }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }
        .summary-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
        }
        .summary-card .value { font-size: 24px; font-weight: 700; color: #1e40af; }
        .summary-card .label { font-size: 10px; text-transform: uppercase; color: #6b7280; }
        .summary-card.critical .value { color: #ef4444; }
        
        .family-section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .family-header {
            background: #1e40af;
            color: white;
            padding: 10px 15px;
            border-radius: 8px 8px 0 0;
            font-weight: 600;
        }
        .family-body {
            border: 1px solid #e2e8f0;
            border-top: none;
            border-radius: 0 0 8px 8px;
        }
        
        .gap-item {
            padding: 15px;
            border-bottom: 1px solid #e2e8f0;
        }
        .gap-item:last-child { border-bottom: none; }
        .gap-item:hover { background: #f8fafc; }
        
        .gap-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
        }
        .control-id {
            font-weight: 600;
            color: #1e40af;
            font-size: 14px;
        }
        .gap-badges {
            display: flex;
            gap: 8px;
        }
        .badge {
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
        }
        .badge-points { background: #fef2f2; color: #991b1b; }
        .badge-status-not-met { background: #fee2e2; color: #991b1b; }
        .badge-status-partial { background: #fef3c7; color: #92400e; }
        .badge-poam { background: #dbeafe; color: #1e40af; }
        .badge-no-poam { background: #fef2f2; color: #991b1b; }
        
        .objective-text {
            color: #4b5563;
            font-size: 11px;
            margin-bottom: 8px;
            padding-left: 10px;
            border-left: 2px solid #e2e8f0;
        }
        
        .remediation-info {
            background: #f8fafc;
            padding: 10px;
            border-radius: 6px;
            font-size: 11px;
        }
        .remediation-info strong { color: #1e40af; }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 10px;
            color: #6b7280;
            text-align: center;
        }
        
        @media print {
            body { padding: 15px; font-size: 10px; }
            .family-section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="report-header">
        <div class="report-title">
            <h1>CMMC Gap Analysis Report</h1>
            <h2>${orgName}</h2>
        </div>
        <div style="text-align: right; font-size: 11px; color: #6b7280;">
            <div><strong>Generated:</strong> ${assessmentDate}</div>
            <div><strong>Total Gaps:</strong> ${gaps.length}</div>
        </div>
    </div>

    <div class="summary-grid">
        <div class="summary-card critical">
            <div class="value">${gaps.length}</div>
            <div class="label">Total Gaps</div>
        </div>
        <div class="summary-card">
            <div class="value">${gaps.filter(g => g.status === 'not-met').length}</div>
            <div class="label">Not Met</div>
        </div>
        <div class="summary-card">
            <div class="value">${gaps.filter(g => g.status === 'partially-met').length}</div>
            <div class="label">Partial</div>
        </div>
        <div class="summary-card">
            <div class="value">${gaps.filter(g => g.hasPOAM).length}</div>
            <div class="label">On POA&M</div>
        </div>
        <div class="summary-card critical">
            <div class="value">-${gaps.reduce((sum, g) => sum + g.sprsPoints, 0)}</div>
            <div class="label">SPRS Impact</div>
        </div>
    </div>

    ${Object.entries(gapsByFamily).map(([famId, fam]) => `
    <div class="family-section">
        <div class="family-header">${fam.name} (${fam.gaps.length} gaps)</div>
        <div class="family-body">
            ${fam.gaps.map(gap => `
            <div class="gap-item">
                <div class="gap-header">
                    <div>
                        <span class="control-id">${gap.controlId}</span>
                        <span style="color: #6b7280;"> - ${gap.controlName}</span>
                    </div>
                    <div class="gap-badges">
                        ${gap.sprsPoints > 0 ? `<span class="badge badge-points">-${gap.sprsPoints} pts</span>` : ''}
                        <span class="badge badge-status-${gap.status}">${gap.status === 'not-met' ? 'NOT MET' : 'PARTIAL'}</span>
                        ${gap.poamEligible ? 
                            (gap.hasPOAM ? '<span class="badge badge-poam">ON POA&M</span>' : '<span class="badge badge-poam">POA&M ELIGIBLE</span>') 
                            : '<span class="badge badge-no-poam">NO POA&M</span>'}
                    </div>
                </div>
                <div class="objective-text">
                    <strong>${gap.objectiveId}:</strong> ${gap.objectiveText}
                </div>
                ${gap.hasPOAM && gap.poamData ? `
                <div class="remediation-info">
                    <strong>POA&M:</strong> ${gap.poamData.milestone || 'Remediation planned'} 
                    | <strong>Due:</strong> ${gap.poamData.completionDate || 'TBD'}
                </div>
                ` : ''}
            </div>
            `).join('')}
        </div>
    </div>
    `).join('')}

    <div class="footer">
        <p>Generated by CMMC 2.0 Assessment Tool | ${new Date().toISOString()}</p>
    </div>
</body>
</html>`;
    },

    // Generate SSP Appendix with implementation statements
    generateSSPAppendix: async function() {
        const data = this.getAssessmentData();
        if (!data) {
            alert('No assessment data available');
            return;
        }

        const orgName = data.orgData.oscName || 'Organization';
        const reportHTML = this.buildSSPAppendixHTML(data, orgName);
        this.openReportWindow('SSP Appendix - ' + orgName, reportHTML);
    },

    buildSSPAppendixHTML: function(data, orgName) {
        const assessmentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });

        let controlsHTML = '';
        data.controlFamilies.forEach(family => {
            controlsHTML += `
            <div class="family-section">
                <h2 class="family-title">${family.name}</h2>
            `;
            
            family.controls.forEach(control => {
                const implData = data.implementationData[control.id] || {};
                const objectives = control.objectives.map(obj => {
                    const status = data.assessmentData[obj.id] || 'not-assessed';
                    return { ...obj, status };
                });
                
                const statusCounts = {
                    met: objectives.filter(o => o.status === 'met').length,
                    total: objectives.length
                };

                controlsHTML += `
                <div class="control-block">
                    <div class="control-header">
                        <div class="control-id-name">
                            <span class="ctrl-id">${control.id}</span>
                            <span class="ctrl-name">${control.name}</span>
                        </div>
                        <span class="ctrl-status">${statusCounts.met}/${statusCounts.total} Met</span>
                    </div>
                    <div class="control-requirement">
                        <strong>Requirement:</strong> ${control.requirement || control.text || 'See NIST SP 800-171 for requirement text.'}
                    </div>
                    <div class="implementation-section">
                        <strong>Implementation Statement:</strong>
                        <p>${implData.description || '[Implementation description not yet documented]'}</p>
                    </div>
                    ${implData.responsibleParty ? `
                    <div class="meta-info">
                        <strong>Responsible Party:</strong> ${implData.responsibleParty}
                    </div>
                    ` : ''}
                    <div class="objectives-list">
                        <strong>Assessment Objectives:</strong>
                        <table class="obj-table">
                            <thead><tr><th>ID</th><th>Objective</th><th>Status</th></tr></thead>
                            <tbody>
                            ${objectives.map(obj => `
                                <tr>
                                    <td>${obj.id}</td>
                                    <td>${obj.text}</td>
                                    <td class="status-${obj.status}">${obj.status.replace('-', ' ').toUpperCase()}</td>
                                </tr>
                            `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                `;
            });
            
            controlsHTML += '</div>';
        });

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>System Security Plan - Control Implementation Appendix</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.5; 
            color: #1f2937; 
            background: #fff;
            padding: 40px;
            font-size: 11px;
        }
        .report-header {
            text-align: center;
            border-bottom: 3px solid #1e40af;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .report-header h1 { font-size: 22px; color: #1e40af; }
        .report-header h2 { font-size: 16px; color: #6b7280; font-weight: 400; margin-top: 5px; }
        .report-header .meta { font-size: 11px; color: #6b7280; margin-top: 10px; }
        
        .family-section { margin-bottom: 30px; }
        .family-title {
            background: #1e40af;
            color: white;
            padding: 10px 15px;
            font-size: 14px;
            margin-bottom: 15px;
        }
        
        .control-block {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 15px;
            page-break-inside: avoid;
        }
        .control-header {
            background: #f8fafc;
            padding: 10px 15px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .ctrl-id { font-weight: 700; color: #1e40af; margin-right: 10px; }
        .ctrl-name { font-weight: 600; }
        .ctrl-status { 
            background: #dbeafe; 
            color: #1e40af; 
            padding: 3px 10px; 
            border-radius: 4px; 
            font-size: 10px; 
            font-weight: 600;
        }
        
        .control-requirement, .implementation-section, .meta-info, .objectives-list {
            padding: 10px 15px;
            border-bottom: 1px solid #f3f4f6;
        }
        .control-requirement { background: #fefce8; font-size: 11px; }
        .implementation-section p { margin-top: 5px; color: #4b5563; }
        
        .obj-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10px; }
        .obj-table th, .obj-table td { padding: 6px 8px; text-align: left; border: 1px solid #e2e8f0; }
        .obj-table th { background: #f8fafc; }
        .status-met { color: #065f46; font-weight: 600; }
        .status-not-met { color: #991b1b; font-weight: 600; }
        .status-partially-met { color: #92400e; font-weight: 600; }
        .status-not-applicable { color: #6b7280; }
        .status-not-assessed { color: #9ca3af; }
        
        @media print {
            body { padding: 15px; }
            .control-block { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="report-header">
        <h1>System Security Plan</h1>
        <h2>Control Implementation Appendix</h2>
        <div class="meta">
            <strong>${orgName}</strong> | Generated: ${assessmentDate}
        </div>
    </div>

    ${controlsHTML}

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #6b7280; text-align: center;">
        <p>Generated by CMMC 2.0 Assessment Tool</p>
    </div>
</body>
</html>`;
    },

    // Generate C3PAO Pre-Assessment Report
    generateC3PAOReport: async function() {
        const data = this.getAssessmentData();
        if (!data) {
            alert('No assessment data available');
            return;
        }

        const stats = this.calculateStats(data);
        const orgName = data.orgData.oscName || 'Organization';
        const gaps = this.collectGaps(data);
        
        const reportHTML = this.buildC3PAOReportHTML(stats, orgName, gaps, data);
        this.openReportWindow('C3PAO Pre-Assessment - ' + orgName, reportHTML);
    },

    buildC3PAOReportHTML: function(stats, orgName, gaps, data) {
        const assessmentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });
        const level = data.assessmentLevel;
        const levelText = level === 1 ? 'Level 1 (Foundational)' : 'Level 2 (Advanced)';

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>C3PAO Pre-Assessment Readiness Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #1f2937; 
            background: #fff;
            padding: 40px;
            font-size: 12px;
        }
        .header-banner {
            background: linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%);
            color: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .header-banner h1 { font-size: 24px; margin-bottom: 5px; }
        .header-banner h2 { font-size: 16px; font-weight: 400; opacity: 0.9; }
        .header-meta {
            display: flex;
            gap: 30px;
            margin-top: 20px;
            font-size: 12px;
        }
        .header-meta div { opacity: 0.9; }
        .header-meta strong { opacity: 1; }
        
        .readiness-score {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 40px;
            padding: 30px;
            background: #f8fafc;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .score-circle {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-weight: 700;
        }
        .score-circle.ready { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; }
        .score-circle.caution { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; }
        .score-circle.not-ready { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; }
        .score-circle .value { font-size: 36px; }
        .score-circle .label { font-size: 11px; text-transform: uppercase; opacity: 0.9; }
        
        .readiness-details {
            flex: 1;
        }
        .readiness-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .readiness-item:last-child { border-bottom: none; }
        .readiness-item .metric { color: #6b7280; }
        .readiness-item .value { font-weight: 600; }
        .value.good { color: #10b981; }
        .value.warning { color: #f59e0b; }
        .value.critical { color: #ef4444; }
        
        .section { margin-bottom: 30px; }
        .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e40af;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
            margin-bottom: 15px;
        }
        
        .checklist {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        .checklist-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid;
        }
        .checklist-item.pass { border-color: #10b981; }
        .checklist-item.fail { border-color: #ef4444; }
        .checklist-item.partial { border-color: #f59e0b; }
        .check-icon { font-size: 18px; }
        .check-icon.pass { color: #10b981; }
        .check-icon.fail { color: #ef4444; }
        .check-icon.partial { color: #f59e0b; }
        
        .blocker-list {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 20px;
        }
        .blocker-item {
            padding: 10px 0;
            border-bottom: 1px solid #fecaca;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        .blocker-item:last-child { border-bottom: none; }
        .blocker-icon { color: #ef4444; font-size: 16px; }
        
        .timeline-box {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 20px;
        }
        .timeline-item {
            display: flex;
            gap: 15px;
            padding: 10px 0;
        }
        .timeline-marker {
            width: 30px;
            height: 30px;
            background: #1e40af;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 12px;
        }
        
        @media print {
            body { padding: 20px; }
            .header-banner { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="header-banner">
        <h1>C3PAO Pre-Assessment Readiness Report</h1>
        <h2>${orgName}</h2>
        <div class="header-meta">
            <div><strong>Assessment Level:</strong> ${levelText}</div>
            <div><strong>Report Date:</strong> ${assessmentDate}</div>
            <div><strong>Framework:</strong> CMMC 2.0 / NIST SP 800-171A</div>
        </div>
    </div>

    <div class="readiness-score">
        <div class="score-circle ${stats.percentComplete >= 80 && gaps.length < 20 ? 'ready' : stats.percentComplete >= 50 ? 'caution' : 'not-ready'}">
            <div class="value">${stats.percentComplete}%</div>
            <div class="label">Ready</div>
        </div>
        <div class="readiness-details">
            <div class="readiness-item">
                <span class="metric">Assessment Completion</span>
                <span class="value ${stats.percentComplete >= 80 ? 'good' : stats.percentComplete >= 50 ? 'warning' : 'critical'}">${stats.percentComplete}%</span>
            </div>
            <div class="readiness-item">
                <span class="metric">SPRS Score</span>
                <span class="value ${stats.sprsScore >= 70 ? 'good' : stats.sprsScore >= 0 ? 'warning' : 'critical'}">${stats.sprsScore} / 110</span>
            </div>
            <div class="readiness-item">
                <span class="metric">Open Gaps</span>
                <span class="value ${gaps.length < 10 ? 'good' : gaps.length < 30 ? 'warning' : 'critical'}">${gaps.length}</span>
            </div>
            <div class="readiness-item">
                <span class="metric">POA&M Items</span>
                <span class="value">${stats.poamItems}</span>
            </div>
            <div class="readiness-item">
                <span class="metric">Non-POA&M Deficiencies</span>
                <span class="value ${stats.deficiencies === 0 ? 'good' : 'critical'}">${stats.deficiencies}</span>
            </div>
        </div>
    </div>

    <div class="section">
        <h3 class="section-title">Assessment Readiness Checklist</h3>
        <div class="checklist">
            <div class="checklist-item ${stats.percentComplete === 100 ? 'pass' : stats.percentComplete >= 80 ? 'partial' : 'fail'}">
                <span class="check-icon ${stats.percentComplete === 100 ? 'pass' : stats.percentComplete >= 80 ? 'partial' : 'fail'}">${stats.percentComplete === 100 ? '✓' : stats.percentComplete >= 80 ? '◐' : '✗'}</span>
                <div>
                    <strong>All Controls Assessed</strong>
                    <div style="font-size: 11px; color: #6b7280;">${stats.objectivesNotAssessed} objectives remaining</div>
                </div>
            </div>
            <div class="checklist-item ${stats.deficiencies === 0 ? 'pass' : 'fail'}">
                <span class="check-icon ${stats.deficiencies === 0 ? 'pass' : 'fail'}">${stats.deficiencies === 0 ? '✓' : '✗'}</span>
                <div>
                    <strong>No POA&M-Ineligible Gaps</strong>
                    <div style="font-size: 11px; color: #6b7280;">${stats.deficiencies} blocking deficiencies</div>
                </div>
            </div>
            <div class="checklist-item ${stats.poamItems <= 10 ? 'pass' : stats.poamItems <= 30 ? 'partial' : 'fail'}">
                <span class="check-icon ${stats.poamItems <= 10 ? 'pass' : stats.poamItems <= 30 ? 'partial' : 'fail'}">${stats.poamItems <= 10 ? '✓' : stats.poamItems <= 30 ? '◐' : '✗'}</span>
                <div>
                    <strong>POA&M Count Reasonable</strong>
                    <div style="font-size: 11px; color: #6b7280;">${stats.poamItems} items (recommend < 10)</div>
                </div>
            </div>
            <div class="checklist-item partial">
                <span class="check-icon partial">◐</span>
                <div>
                    <strong>Evidence Documented</strong>
                    <div style="font-size: 11px; color: #6b7280;">Verify evidence for all MET objectives</div>
                </div>
            </div>
            <div class="checklist-item partial">
                <span class="check-icon partial">◐</span>
                <div>
                    <strong>SSP Complete</strong>
                    <div style="font-size: 11px; color: #6b7280;">Ensure SSP reflects current implementation</div>
                </div>
            </div>
            <div class="checklist-item partial">
                <span class="check-icon partial">◐</span>
                <div>
                    <strong>Policies Current</strong>
                    <div style="font-size: 11px; color: #6b7280;">Verify all policies reviewed within 12 months</div>
                </div>
            </div>
        </div>
    </div>

    ${gaps.filter(g => !g.poamEligible && g.status === 'not-met').length > 0 ? `
    <div class="section">
        <h3 class="section-title">⚠️ Assessment Blockers (Must Resolve)</h3>
        <div class="blocker-list">
            ${gaps.filter(g => !g.poamEligible && g.status === 'not-met').map(gap => `
            <div class="blocker-item">
                <span class="blocker-icon">⊘</span>
                <div>
                    <strong>${gap.controlId}</strong> - ${gap.controlName}
                    <div style="font-size: 11px; color: #991b1b;">Cannot be placed on POA&M per 32 CFR 170.21</div>
                </div>
            </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    <div class="section">
        <h3 class="section-title">Recommended Timeline to Assessment</h3>
        <div class="timeline-box">
            <div class="timeline-item">
                <div class="timeline-marker">1</div>
                <div>
                    <strong>Close Critical Gaps</strong> (2-4 weeks)
                    <div style="font-size: 11px; color: #6b7280;">Remediate ${gaps.filter(g => !g.poamEligible).length} POA&M-ineligible gaps</div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-marker">2</div>
                <div>
                    <strong>Document Evidence</strong> (1-2 weeks)
                    <div style="font-size: 11px; color: #6b7280;">Collect and organize artifacts for ${stats.objectivesMet} MET objectives</div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-marker">3</div>
                <div>
                    <strong>Finalize POA&M</strong> (1 week)
                    <div style="font-size: 11px; color: #6b7280;">Complete milestones and dates for ${stats.poamItems} POA&M items</div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-marker">4</div>
                <div>
                    <strong>Internal Review</strong> (1 week)
                    <div style="font-size: 11px; color: #6b7280;">Conduct mock assessment / evidence walkthrough</div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-marker">5</div>
                <div>
                    <strong>Schedule C3PAO</strong>
                    <div style="font-size: 11px; color: #6b7280;">Engage certified C3PAO for formal assessment</div>
                </div>
            </div>
        </div>
    </div>

    <div style="margin-top: 40px; padding: 20px; background: #f8fafc; border-radius: 8px; font-size: 11px; color: #6b7280;">
        <strong>Disclaimer:</strong> This pre-assessment report is for planning purposes only. CMMC certification 
        requires formal assessment by a CMMC Third-Party Assessor Organization (C3PAO) authorized by the 
        Cyber AB. This report does not guarantee certification outcomes.
    </div>

    <div style="margin-top: 20px; text-align: center; font-size: 10px; color: #9ca3af;">
        Generated by CMMC 2.0 Assessment Tool | ${new Date().toISOString()}
    </div>
</body>
</html>`;
    },

    // Open report in new window
    openReportWindow: function(title, html) {
        const reportWindow = window.open('', '_blank', 'width=1000,height=800');
        if (reportWindow) {
            reportWindow.document.write(html);
            reportWindow.document.close();
            reportWindow.document.title = title;
        } else {
            alert('Please allow popups to view the report');
        }
    }
};

// Initialize on DOM ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ReportGenerator.init());
    } else {
        ReportGenerator.init();
    }
}

// Export for module usage
if (typeof window !== 'undefined') {
    window.ReportGenerator = ReportGenerator;
}
