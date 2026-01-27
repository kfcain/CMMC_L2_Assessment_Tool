// Evidence Package Builder
// Create C3PAO-ready evidence packages with artifact checklists

const EvidenceBuilder = {
    config: {
        version: "1.0.0"
    },

    // Evidence requirements by control family
    EVIDENCE_REQUIREMENTS: {
        'AC': {
            name: 'Access Control',
            commonArtifacts: [
                { type: 'policy', name: 'Access Control Policy', required: true },
                { type: 'procedure', name: 'Account Management Procedures', required: true },
                { type: 'screenshot', name: 'User account listings', required: true },
                { type: 'screenshot', name: 'Role/group assignments', required: true },
                { type: 'config', name: 'Conditional Access policies', required: false },
                { type: 'log', name: 'Access review logs', required: false }
            ]
        },
        'AT': {
            name: 'Awareness and Training',
            commonArtifacts: [
                { type: 'policy', name: 'Security Awareness Training Policy', required: true },
                { type: 'document', name: 'Training curriculum/content', required: true },
                { type: 'report', name: 'Training completion records', required: true },
                { type: 'report', name: 'Phishing simulation results', required: false }
            ]
        },
        'AU': {
            name: 'Audit and Accountability',
            commonArtifacts: [
                { type: 'policy', name: 'Audit and Accountability Policy', required: true },
                { type: 'config', name: 'Audit logging configuration', required: true },
                { type: 'screenshot', name: 'SIEM dashboard', required: true },
                { type: 'log', name: 'Sample audit logs', required: true },
                { type: 'procedure', name: 'Log review procedures', required: true }
            ]
        },
        'CM': {
            name: 'Configuration Management',
            commonArtifacts: [
                { type: 'policy', name: 'Configuration Management Policy', required: true },
                { type: 'document', name: 'Baseline configurations', required: true },
                { type: 'document', name: 'System inventory', required: true },
                { type: 'procedure', name: 'Change management procedures', required: true },
                { type: 'config', name: 'Security configuration settings', required: true }
            ]
        },
        'IA': {
            name: 'Identification and Authentication',
            commonArtifacts: [
                { type: 'policy', name: 'Identification and Authentication Policy', required: true },
                { type: 'config', name: 'Password policy settings', required: true },
                { type: 'config', name: 'MFA configuration', required: true },
                { type: 'screenshot', name: 'IdP configuration', required: true }
            ]
        },
        'IR': {
            name: 'Incident Response',
            commonArtifacts: [
                { type: 'policy', name: 'Incident Response Policy', required: true },
                { type: 'procedure', name: 'Incident Response Plan', required: true },
                { type: 'document', name: 'IR team roster and contacts', required: true },
                { type: 'report', name: 'IR test/exercise results', required: true }
            ]
        },
        'MA': {
            name: 'Maintenance',
            commonArtifacts: [
                { type: 'policy', name: 'Maintenance Policy', required: true },
                { type: 'procedure', name: 'Maintenance procedures', required: true },
                { type: 'log', name: 'Maintenance logs', required: false }
            ]
        },
        'MP': {
            name: 'Media Protection',
            commonArtifacts: [
                { type: 'policy', name: 'Media Protection Policy', required: true },
                { type: 'procedure', name: 'Media sanitization procedures', required: true },
                { type: 'log', name: 'Media sanitization records', required: false },
                { type: 'config', name: 'Encryption configuration', required: true }
            ]
        },
        'PS': {
            name: 'Personnel Security',
            commonArtifacts: [
                { type: 'policy', name: 'Personnel Security Policy', required: true },
                { type: 'procedure', name: 'Background check procedures', required: true },
                { type: 'procedure', name: 'Termination procedures', required: true }
            ]
        },
        'PE': {
            name: 'Physical Protection',
            commonArtifacts: [
                { type: 'policy', name: 'Physical Protection Policy', required: true },
                { type: 'document', name: 'Facility diagrams', required: true },
                { type: 'log', name: 'Visitor logs', required: false },
                { type: 'screenshot', name: 'Access control system', required: false }
            ]
        },
        'RA': {
            name: 'Risk Assessment',
            commonArtifacts: [
                { type: 'policy', name: 'Risk Assessment Policy', required: true },
                { type: 'report', name: 'Risk assessment report', required: true },
                { type: 'report', name: 'Vulnerability scan reports', required: true },
                { type: 'document', name: 'Remediation tracking', required: true }
            ]
        },
        'CA': {
            name: 'Security Assessment',
            commonArtifacts: [
                { type: 'policy', name: 'Security Assessment Policy', required: true },
                { type: 'document', name: 'System Security Plan (SSP)', required: true },
                { type: 'report', name: 'Assessment results', required: true },
                { type: 'document', name: 'POA&M', required: true }
            ]
        },
        'SC': {
            name: 'System and Communications Protection',
            commonArtifacts: [
                { type: 'policy', name: 'System and Communications Protection Policy', required: true },
                { type: 'document', name: 'Network architecture diagram', required: true },
                { type: 'config', name: 'Firewall rules', required: true },
                { type: 'config', name: 'Encryption settings', required: true },
                { type: 'screenshot', name: 'DLP configuration', required: false }
            ]
        },
        'SI': {
            name: 'System and Information Integrity',
            commonArtifacts: [
                { type: 'policy', name: 'System and Information Integrity Policy', required: true },
                { type: 'config', name: 'Antimalware configuration', required: true },
                { type: 'screenshot', name: 'Patch management dashboard', required: true },
                { type: 'report', name: 'Vulnerability remediation report', required: true }
            ]
        }
    },

    // Artifact type icons and colors
    ARTIFACT_TYPES: {
        policy: { icon: '📜', label: 'Policy', color: '#3b82f6' },
        procedure: { icon: '📋', label: 'Procedure', color: '#8b5cf6' },
        screenshot: { icon: '📷', label: 'Screenshot', color: '#10b981' },
        config: { icon: '⚙️', label: 'Configuration', color: '#f59e0b' },
        log: { icon: '📊', label: 'Log/Report', color: '#6366f1' },
        document: { icon: '📄', label: 'Document', color: '#64748b' },
        report: { icon: '📈', label: 'Report', color: '#ec4899' }
    },

    // Evidence collection tracking
    collectedEvidence: {},

    init: function() {
        this.loadCollectedEvidence();
        this.bindEvents();
        console.log('[EvidenceBuilder] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#open-evidence-builder-btn')) {
                this.showEvidenceBuilder();
            }
            if (e.target.closest('.export-evidence-package-btn')) {
                this.exportEvidencePackage();
            }
            if (e.target.closest('.generate-checklist-btn')) {
                this.generateChecklist();
            }
        });
    },

    loadCollectedEvidence: function() {
        try {
            const saved = localStorage.getItem('cmmc_collected_evidence');
            if (saved) {
                this.collectedEvidence = JSON.parse(saved);
            }
        } catch (e) {
            console.error('[EvidenceBuilder] Error loading evidence:', e);
        }
    },

    saveCollectedEvidence: function() {
        try {
            localStorage.setItem('cmmc_collected_evidence', JSON.stringify(this.collectedEvidence));
        } catch (e) {
            console.error('[EvidenceBuilder] Error saving evidence:', e);
        }
    },

    // Mark evidence as collected
    markCollected: function(controlId, artifactName, collected = true) {
        if (!this.collectedEvidence[controlId]) {
            this.collectedEvidence[controlId] = {};
        }
        this.collectedEvidence[controlId][artifactName] = {
            collected: collected,
            collectedAt: collected ? new Date().toISOString() : null
        };
        this.saveCollectedEvidence();
    },

    // Check if evidence is collected
    isCollected: function(controlId, artifactName) {
        return this.collectedEvidence[controlId]?.[artifactName]?.collected || false;
    },

    // Calculate evidence completion
    calculateEvidenceCompletion: function() {
        let totalRequired = 0;
        let collectedRequired = 0;
        let totalOptional = 0;
        let collectedOptional = 0;
        const byFamily = {};

        Object.entries(this.EVIDENCE_REQUIREMENTS).forEach(([familyId, family]) => {
            byFamily[familyId] = {
                name: family.name,
                required: 0,
                requiredCollected: 0,
                optional: 0,
                optionalCollected: 0
            };

            family.commonArtifacts.forEach(artifact => {
                if (artifact.required) {
                    totalRequired++;
                    byFamily[familyId].required++;
                    if (this.isCollected(familyId, artifact.name)) {
                        collectedRequired++;
                        byFamily[familyId].requiredCollected++;
                    }
                } else {
                    totalOptional++;
                    byFamily[familyId].optional++;
                    if (this.isCollected(familyId, artifact.name)) {
                        collectedOptional++;
                        byFamily[familyId].optionalCollected++;
                    }
                }
            });
        });

        return {
            totalRequired,
            collectedRequired,
            totalOptional,
            collectedOptional,
            percentComplete: totalRequired > 0 ? Math.round((collectedRequired / totalRequired) * 100) : 0,
            byFamily
        };
    },

    // Get gaps in evidence
    getEvidenceGaps: function() {
        const gaps = [];

        Object.entries(this.EVIDENCE_REQUIREMENTS).forEach(([familyId, family]) => {
            family.commonArtifacts.forEach(artifact => {
                if (artifact.required && !this.isCollected(familyId, artifact.name)) {
                    gaps.push({
                        familyId,
                        familyName: family.name,
                        artifactName: artifact.name,
                        artifactType: artifact.type
                    });
                }
            });
        });

        return gaps;
    },

    // Render evidence builder UI
    renderEvidenceBuilder: function() {
        const completion = this.calculateEvidenceCompletion();
        const gaps = this.getEvidenceGaps();

        return `
        <div class="evidence-builder">
            <div class="evidence-header">
                <div class="evidence-title">
                    <h2>Evidence Package Builder</h2>
                    <p>Collect and organize artifacts for your C3PAO assessment</p>
                </div>
                <div class="evidence-actions">
                    <button class="btn-secondary generate-checklist-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                            <path d="M14 2v6h6M9 15l2 2 4-4"/>
                        </svg>
                        Export Checklist
                    </button>
                    <button class="btn-primary export-evidence-package-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Export Package
                    </button>
                </div>
            </div>

            <div class="evidence-summary">
                <div class="summary-progress">
                    <div class="progress-circle" style="--progress: ${completion.percentComplete}%;">
                        <span class="progress-value">${completion.percentComplete}%</span>
                    </div>
                    <div class="progress-details">
                        <h3>Evidence Collection Progress</h3>
                        <p>${completion.collectedRequired} of ${completion.totalRequired} required artifacts collected</p>
                    </div>
                </div>
                <div class="summary-stats">
                    <div class="stat-item">
                        <span class="stat-value">${completion.totalRequired}</span>
                        <span class="stat-label">Required</span>
                    </div>
                    <div class="stat-item collected">
                        <span class="stat-value">${completion.collectedRequired}</span>
                        <span class="stat-label">Collected</span>
                    </div>
                    <div class="stat-item gap">
                        <span class="stat-value">${gaps.length}</span>
                        <span class="stat-label">Gaps</span>
                    </div>
                </div>
            </div>

            ${gaps.length > 0 ? `
            <div class="evidence-gaps-alert">
                <div class="alert-icon">⚠️</div>
                <div class="alert-content">
                    <strong>${gaps.length} Required Artifacts Missing</strong>
                    <p>Complete these before your C3PAO assessment</p>
                </div>
                <button class="btn-text" onclick="EvidenceBuilder.scrollToGaps()">View Gaps</button>
            </div>
            ` : `
            <div class="evidence-complete-alert">
                <div class="alert-icon">✓</div>
                <div class="alert-content">
                    <strong>All Required Evidence Collected</strong>
                    <p>Your evidence package is ready for assessment</p>
                </div>
            </div>
            `}

            <div class="evidence-families">
                ${Object.entries(this.EVIDENCE_REQUIREMENTS).map(([familyId, family]) => 
                    this.renderFamilyEvidence(familyId, family, completion.byFamily[familyId])
                ).join('')}
            </div>
        </div>`;
    },

    renderFamilyEvidence: function(familyId, family, stats) {
        const isComplete = stats.requiredCollected === stats.required;
        
        return `
        <div class="evidence-family ${isComplete ? 'complete' : ''}" data-family="${familyId}">
            <div class="family-header" onclick="EvidenceBuilder.toggleFamily('${familyId}')">
                <div class="family-info">
                    <span class="family-icon">${isComplete ? '✓' : '○'}</span>
                    <span class="family-name">${family.name}</span>
                    <span class="family-id">${familyId}</span>
                </div>
                <div class="family-stats">
                    <span class="stats-text">${stats.requiredCollected}/${stats.required} required</span>
                    <span class="expand-icon">▼</span>
                </div>
            </div>
            <div class="family-artifacts" id="family-${familyId}-artifacts">
                ${family.commonArtifacts.map(artifact => this.renderArtifact(familyId, artifact)).join('')}
            </div>
        </div>`;
    },

    renderArtifact: function(familyId, artifact) {
        const collected = this.isCollected(familyId, artifact.name);
        const typeInfo = this.ARTIFACT_TYPES[artifact.type] || this.ARTIFACT_TYPES.document;
        
        return `
        <div class="artifact-item ${collected ? 'collected' : ''} ${artifact.required ? 'required' : 'optional'}">
            <label class="artifact-checkbox">
                <input type="checkbox" 
                       ${collected ? 'checked' : ''} 
                       onchange="EvidenceBuilder.toggleArtifact('${familyId}', '${artifact.name}', this.checked)">
                <span class="checkmark"></span>
            </label>
            <div class="artifact-icon" style="background: ${typeInfo.color}20; color: ${typeInfo.color};">
                ${typeInfo.icon}
            </div>
            <div class="artifact-details">
                <span class="artifact-name">${artifact.name}</span>
                <span class="artifact-type">${typeInfo.label}</span>
            </div>
            <div class="artifact-badges">
                ${artifact.required ? '<span class="badge required">Required</span>' : '<span class="badge optional">Optional</span>'}
            </div>
            <button class="btn-icon upload-btn" onclick="EvidenceBuilder.uploadArtifact('${familyId}', '${artifact.name}')" title="Upload">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
            </button>
        </div>`;
    },

    toggleFamily: function(familyId) {
        const artifacts = document.getElementById(`family-${familyId}-artifacts`);
        if (artifacts) {
            artifacts.classList.toggle('expanded');
        }
    },

    toggleArtifact: function(familyId, artifactName, collected) {
        this.markCollected(familyId, artifactName, collected);
        
        // Update UI
        const familyEl = document.querySelector(`.evidence-family[data-family="${familyId}"]`);
        if (familyEl) {
            const completion = this.calculateEvidenceCompletion();
            const stats = completion.byFamily[familyId];
            const statsText = familyEl.querySelector('.stats-text');
            if (statsText) {
                statsText.textContent = `${stats.requiredCollected}/${stats.required} required`;
            }
            
            if (stats.requiredCollected === stats.required) {
                familyEl.classList.add('complete');
                const icon = familyEl.querySelector('.family-icon');
                if (icon) icon.textContent = '✓';
            } else {
                familyEl.classList.remove('complete');
                const icon = familyEl.querySelector('.family-icon');
                if (icon) icon.textContent = '○';
            }
        }

        // Update overall progress
        this.updateProgressUI();
    },

    updateProgressUI: function() {
        const completion = this.calculateEvidenceCompletion();
        const progressCircle = document.querySelector('.progress-circle');
        const progressValue = document.querySelector('.progress-value');
        const progressDetails = document.querySelector('.progress-details p');

        if (progressCircle) {
            progressCircle.style.setProperty('--progress', `${completion.percentComplete}%`);
        }
        if (progressValue) {
            progressValue.textContent = `${completion.percentComplete}%`;
        }
        if (progressDetails) {
            progressDetails.textContent = `${completion.collectedRequired} of ${completion.totalRequired} required artifacts collected`;
        }
    },

    uploadArtifact: function(familyId, artifactName) {
        // Trigger file upload - integrate with EvidenceUI if available
        if (typeof EvidenceUI !== 'undefined') {
            // Could integrate with existing evidence upload
            alert(`Upload artifact for ${familyId}: ${artifactName}\n\nUse the Evidence tab on individual controls to upload files.`);
        } else {
            alert(`Upload artifact: ${artifactName}`);
        }
    },

    scrollToGaps: function() {
        const gaps = this.getEvidenceGaps();
        if (gaps.length > 0) {
            const firstGapFamily = document.querySelector(`.evidence-family[data-family="${gaps[0].familyId}"]`);
            if (firstGapFamily) {
                firstGapFamily.scrollIntoView({ behavior: 'smooth' });
                const artifacts = firstGapFamily.querySelector('.family-artifacts');
                if (artifacts) artifacts.classList.add('expanded');
            }
        }
    },

    // Show evidence builder modal
    showEvidenceBuilder: function() {
        const modalHTML = `
        <div class="modal-overlay evidence-modal" id="evidence-builder-modal">
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2>Evidence Package Builder</h2>
                    <button class="modal-close" onclick="document.getElementById('evidence-builder-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    ${this.renderEvidenceBuilder()}
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    // Generate printable checklist
    generateChecklist: function() {
        const completion = this.calculateEvidenceCompletion();
        
        let checklistHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>CMMC Evidence Checklist</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; font-size: 12px; }
        h1 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; }
        .family { margin-bottom: 25px; page-break-inside: avoid; }
        .family-header { background: #f8fafc; padding: 10px; font-weight: bold; border-left: 4px solid #1e40af; }
        .artifact { display: flex; align-items: center; padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
        .checkbox { width: 16px; height: 16px; border: 2px solid #6b7280; margin-right: 10px; }
        .checkbox.checked { background: #10b981; border-color: #10b981; }
        .required { color: #ef4444; font-size: 10px; margin-left: auto; }
        .optional { color: #6b7280; font-size: 10px; margin-left: auto; }
        .summary { background: #eff6ff; padding: 15px; margin-bottom: 20px; border-radius: 8px; }
        @media print { body { padding: 20px; } }
    </style>
</head>
<body>
    <h1>CMMC Evidence Collection Checklist</h1>
    <div class="summary">
        <strong>Progress:</strong> ${completion.collectedRequired}/${completion.totalRequired} required artifacts (${completion.percentComplete}% complete)
    </div>
`;

        Object.entries(this.EVIDENCE_REQUIREMENTS).forEach(([familyId, family]) => {
            checklistHTML += `
    <div class="family">
        <div class="family-header">${familyId} - ${family.name}</div>
`;
            family.commonArtifacts.forEach(artifact => {
                const collected = this.isCollected(familyId, artifact.name);
                checklistHTML += `
        <div class="artifact">
            <div class="checkbox ${collected ? 'checked' : ''}"></div>
            <span>${artifact.name}</span>
            <span class="${artifact.required ? 'required' : 'optional'}">${artifact.required ? 'REQUIRED' : 'Optional'}</span>
        </div>`;
            });
            checklistHTML += '</div>';
        });

        checklistHTML += `
    <div style="margin-top: 40px; font-size: 10px; color: #6b7280; text-align: center;">
        Generated ${new Date().toLocaleDateString()} by CMMC Assessment Tool
    </div>
</body>
</html>`;

        const win = window.open('', '_blank');
        if (win) {
            win.document.write(checklistHTML);
            win.document.close();
        }
    },

    // Export evidence package info
    exportEvidencePackage: function() {
        const completion = this.calculateEvidenceCompletion();
        const gaps = this.getEvidenceGaps();
        
        const packageInfo = {
            generatedAt: new Date().toISOString(),
            summary: {
                totalRequired: completion.totalRequired,
                collected: completion.collectedRequired,
                percentComplete: completion.percentComplete,
                gaps: gaps.length
            },
            byFamily: {},
            collectedItems: [],
            missingItems: gaps
        };

        Object.entries(this.EVIDENCE_REQUIREMENTS).forEach(([familyId, family]) => {
            packageInfo.byFamily[familyId] = {
                name: family.name,
                artifacts: family.commonArtifacts.map(a => ({
                    name: a.name,
                    type: a.type,
                    required: a.required,
                    collected: this.isCollected(familyId, a.name)
                }))
            };

            family.commonArtifacts.forEach(artifact => {
                if (this.isCollected(familyId, artifact.name)) {
                    packageInfo.collectedItems.push({
                        family: familyId,
                        familyName: family.name,
                        artifact: artifact.name,
                        type: artifact.type
                    });
                }
            });
        });

        // Download as JSON
        const blob = new Blob([JSON.stringify(packageInfo, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cmmc-evidence-package-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
};

// Initialize on load
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => EvidenceBuilder.init());
    } else {
        EvidenceBuilder.init();
    }
}

// Export
if (typeof window !== 'undefined') {
    window.EvidenceBuilder = EvidenceBuilder;
}
