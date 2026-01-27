// Inherited Controls & Shared Responsibility Matrix
// Manages CSP inheritance for GCC High, AWS GovCloud, and other FedRAMP environments

const InheritedControls = {
    config: {
        version: "1.0.0"
    },

    // Responsibility types
    RESPONSIBILITY_TYPES: {
        FULLY_INHERITED: {
            id: 'fully-inherited',
            label: 'Fully Inherited',
            description: 'Control fully implemented by CSP; no customer action required',
            color: '#10b981',
            icon: '✓'
        },
        SHARED: {
            id: 'shared',
            label: 'Shared Responsibility',
            description: 'Control requires both CSP and customer implementation',
            color: '#3b82f6',
            icon: '◐'
        },
        CUSTOMER: {
            id: 'customer',
            label: 'Customer Responsibility',
            description: 'Control fully implemented by customer',
            color: '#f59e0b',
            icon: '○'
        },
        HYBRID: {
            id: 'hybrid',
            label: 'Hybrid',
            description: 'Multiple CSPs with different responsibilities',
            color: '#8b5cf6',
            icon: '◑'
        }
    },

    // Cloud Service Providers
    CSP_PROFILES: {
        'azure-gcc-high': {
            id: 'azure-gcc-high',
            name: 'Microsoft Azure Government (GCC High)',
            shortName: 'Azure GCC High',
            fedrampLevel: 'High',
            crmUrl: 'https://learn.microsoft.com/en-us/compliance/regulatory/offering-fedramp',
            logo: 'azure',
            inheritanceMatrix: {}
        },
        'azure-gcc': {
            id: 'azure-gcc',
            name: 'Microsoft Azure Government (GCC)',
            shortName: 'Azure GCC',
            fedrampLevel: 'High',
            crmUrl: 'https://learn.microsoft.com/en-us/compliance/regulatory/offering-fedramp',
            logo: 'azure',
            inheritanceMatrix: {}
        },
        'aws-govcloud': {
            id: 'aws-govcloud',
            name: 'AWS GovCloud (US)',
            shortName: 'AWS GovCloud',
            fedrampLevel: 'High',
            crmUrl: 'https://aws.amazon.com/compliance/fedramp/',
            logo: 'aws',
            inheritanceMatrix: {}
        },
        'm365-gcc-high': {
            id: 'm365-gcc-high',
            name: 'Microsoft 365 GCC High',
            shortName: 'M365 GCC High',
            fedrampLevel: 'High',
            crmUrl: 'https://learn.microsoft.com/en-us/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc-high-and-dod',
            logo: 'm365',
            inheritanceMatrix: {}
        },
        'gcp': {
            id: 'gcp',
            name: 'Google Cloud Platform',
            shortName: 'GCP',
            fedrampLevel: 'High',
            crmUrl: 'https://cloud.google.com/security/compliance/fedramp',
            logo: 'gcp',
            inheritanceMatrix: {}
        }
    },

    // Default inheritance patterns based on control family
    // These represent typical patterns - actual inheritance depends on specific CSP CRM
    DEFAULT_INHERITANCE_PATTERNS: {
        // Access Control - mostly shared
        'AC': {
            pattern: 'shared',
            notes: 'CSP provides IAM platform; customer configures access policies',
            typicalInheritance: {
                '3.1.1': 'shared',
                '3.1.2': 'shared',
                '3.1.3': 'shared',
                '3.1.4': 'customer',
                '3.1.5': 'shared',
                '3.1.6': 'customer',
                '3.1.7': 'shared',
                '3.1.8': 'shared',
                '3.1.9': 'customer',
                '3.1.10': 'shared',
                '3.1.11': 'shared',
                '3.1.12': 'shared',
                '3.1.13': 'fully-inherited',
                '3.1.14': 'shared',
                '3.1.15': 'customer',
                '3.1.16': 'customer',
                '3.1.17': 'shared',
                '3.1.18': 'customer',
                '3.1.19': 'shared',
                '3.1.20': 'customer',
                '3.1.21': 'customer',
                '3.1.22': 'customer'
            }
        },
        // Awareness and Training - customer responsibility
        'AT': {
            pattern: 'customer',
            notes: 'Training is always customer responsibility',
            typicalInheritance: {
                '3.2.1': 'customer',
                '3.2.2': 'customer',
                '3.2.3': 'customer'
            }
        },
        // Audit and Accountability - shared
        'AU': {
            pattern: 'shared',
            notes: 'CSP provides logging infrastructure; customer configures and reviews',
            typicalInheritance: {
                '3.3.1': 'shared',
                '3.3.2': 'shared',
                '3.3.3': 'customer',
                '3.3.4': 'shared',
                '3.3.5': 'shared',
                '3.3.6': 'shared',
                '3.3.7': 'fully-inherited',
                '3.3.8': 'shared',
                '3.3.9': 'shared'
            }
        },
        // Configuration Management - shared
        'CM': {
            pattern: 'shared',
            notes: 'CSP provides platform baselines; customer configures workloads',
            typicalInheritance: {
                '3.4.1': 'shared',
                '3.4.2': 'shared',
                '3.4.3': 'shared',
                '3.4.4': 'customer',
                '3.4.5': 'shared',
                '3.4.6': 'shared',
                '3.4.7': 'shared',
                '3.4.8': 'shared',
                '3.4.9': 'customer'
            }
        },
        // Identification and Authentication - shared
        'IA': {
            pattern: 'shared',
            notes: 'CSP provides IdP capabilities; customer configures auth policies',
            typicalInheritance: {
                '3.5.1': 'shared',
                '3.5.2': 'shared',
                '3.5.3': 'shared',
                '3.5.4': 'shared',
                '3.5.5': 'shared',
                '3.5.6': 'shared',
                '3.5.7': 'shared',
                '3.5.8': 'shared',
                '3.5.9': 'shared',
                '3.5.10': 'shared',
                '3.5.11': 'shared'
            }
        },
        // Incident Response - customer with CSP support
        'IR': {
            pattern: 'shared',
            notes: 'Customer handles their incidents; CSP handles platform incidents',
            typicalInheritance: {
                '3.6.1': 'shared',
                '3.6.2': 'customer',
                '3.6.3': 'customer'
            }
        },
        // Maintenance - mostly CSP for platform
        'MA': {
            pattern: 'shared',
            notes: 'CSP maintains platform; customer maintains workloads',
            typicalInheritance: {
                '3.7.1': 'shared',
                '3.7.2': 'shared',
                '3.7.3': 'shared',
                '3.7.4': 'shared',
                '3.7.5': 'shared',
                '3.7.6': 'shared'
            }
        },
        // Media Protection - shared
        'MP': {
            pattern: 'shared',
            notes: 'CSP handles physical media; customer handles virtual/logical',
            typicalInheritance: {
                '3.8.1': 'shared',
                '3.8.2': 'shared',
                '3.8.3': 'shared',
                '3.8.4': 'customer',
                '3.8.5': 'shared',
                '3.8.6': 'shared',
                '3.8.7': 'customer',
                '3.8.8': 'customer',
                '3.8.9': 'shared'
            }
        },
        // Personnel Security - customer responsibility
        'PS': {
            pattern: 'customer',
            notes: 'Customer screens their own personnel',
            typicalInheritance: {
                '3.9.1': 'customer',
                '3.9.2': 'customer'
            }
        },
        // Physical Protection - fully inherited for IaaS/PaaS
        'PE': {
            pattern: 'fully-inherited',
            notes: 'CSP handles all physical security for cloud environments',
            typicalInheritance: {
                '3.10.1': 'fully-inherited',
                '3.10.2': 'fully-inherited',
                '3.10.3': 'fully-inherited',
                '3.10.4': 'fully-inherited',
                '3.10.5': 'fully-inherited',
                '3.10.6': 'fully-inherited'
            }
        },
        // Risk Assessment - customer with CSP input
        'RA': {
            pattern: 'shared',
            notes: 'Customer performs risk assessment; CSP provides vulnerability data',
            typicalInheritance: {
                '3.11.1': 'customer',
                '3.11.2': 'shared',
                '3.11.3': 'shared'
            }
        },
        // Security Assessment - customer responsibility
        'CA': {
            pattern: 'customer',
            notes: 'Customer assesses their own systems',
            typicalInheritance: {
                '3.12.1': 'customer',
                '3.12.2': 'customer',
                '3.12.3': 'shared',
                '3.12.4': 'customer'
            }
        },
        // System and Communications Protection - shared
        'SC': {
            pattern: 'shared',
            notes: 'CSP provides encryption and network infrastructure',
            typicalInheritance: {
                '3.13.1': 'shared',
                '3.13.2': 'shared',
                '3.13.3': 'shared',
                '3.13.4': 'shared',
                '3.13.5': 'shared',
                '3.13.6': 'shared',
                '3.13.7': 'shared',
                '3.13.8': 'fully-inherited',
                '3.13.9': 'shared',
                '3.13.10': 'shared',
                '3.13.11': 'fully-inherited',
                '3.13.12': 'shared',
                '3.13.13': 'shared',
                '3.13.14': 'shared',
                '3.13.15': 'shared',
                '3.13.16': 'shared'
            }
        },
        // System and Information Integrity - shared
        'SI': {
            pattern: 'shared',
            notes: 'CSP provides security tools; customer configures and monitors',
            typicalInheritance: {
                '3.14.1': 'shared',
                '3.14.2': 'shared',
                '3.14.3': 'shared',
                '3.14.4': 'shared',
                '3.14.5': 'shared',
                '3.14.6': 'shared',
                '3.14.7': 'shared'
            }
        }
    },

    // Storage for organization-specific inheritance data
    inheritanceData: {},

    // Initialize the module
    init: function() {
        this.loadInheritanceData();
        this.bindEvents();
        console.log('[InheritedControls] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.set-inheritance-btn')) {
                const controlId = e.target.closest('.set-inheritance-btn').dataset.controlId;
                this.showInheritanceModal(controlId);
            }
            if (e.target.closest('.save-inheritance-btn')) {
                this.saveInheritanceSettings();
            }
            if (e.target.closest('.apply-csp-template-btn')) {
                const cspId = e.target.closest('.apply-csp-template-btn').dataset.cspId;
                this.applyCspTemplate(cspId);
            }
        });
    },

    // Load saved inheritance data
    loadInheritanceData: function() {
        try {
            const saved = localStorage.getItem('cmmc_inheritance_data');
            if (saved) {
                this.inheritanceData = JSON.parse(saved);
            }
        } catch (e) {
            console.error('[InheritedControls] Error loading data:', e);
        }
    },

    // Save inheritance data
    saveInheritanceData: function() {
        try {
            localStorage.setItem('cmmc_inheritance_data', JSON.stringify(this.inheritanceData));
        } catch (e) {
            console.error('[InheritedControls] Error saving data:', e);
        }
    },

    // Get inheritance status for a control
    getInheritance: function(controlId) {
        return this.inheritanceData[controlId] || null;
    },

    // Set inheritance for a control
    setInheritance: function(controlId, inheritanceType, cspId, notes) {
        this.inheritanceData[controlId] = {
            type: inheritanceType,
            csp: cspId,
            notes: notes || '',
            updatedAt: new Date().toISOString()
        };
        this.saveInheritanceData();
    },

    // Apply a CSP template to all controls
    applyCspTemplate: function(cspId) {
        const patterns = this.DEFAULT_INHERITANCE_PATTERNS;
        
        Object.entries(patterns).forEach(([familyId, familyPattern]) => {
            Object.entries(familyPattern.typicalInheritance).forEach(([controlId, type]) => {
                this.inheritanceData[controlId] = {
                    type: type,
                    csp: cspId,
                    notes: `Applied from ${this.CSP_PROFILES[cspId]?.shortName || cspId} template`,
                    updatedAt: new Date().toISOString()
                };
            });
        });
        
        this.saveInheritanceData();
        return Object.keys(this.inheritanceData).length;
    },

    // Calculate what customer actually needs to implement
    calculateCustomerResponsibility: function() {
        const summary = {
            fullyInherited: [],
            shared: [],
            customer: [],
            hybrid: [],
            notAssigned: []
        };

        // Get all controls
        if (typeof CONTROL_FAMILIES !== 'undefined') {
            CONTROL_FAMILIES.forEach(family => {
                family.controls.forEach(control => {
                    const inheritance = this.inheritanceData[control.id];
                    if (!inheritance) {
                        summary.notAssigned.push(control.id);
                    } else {
                        switch(inheritance.type) {
                            case 'fully-inherited':
                                summary.fullyInherited.push(control.id);
                                break;
                            case 'shared':
                                summary.shared.push(control.id);
                                break;
                            case 'customer':
                                summary.customer.push(control.id);
                                break;
                            case 'hybrid':
                                summary.hybrid.push(control.id);
                                break;
                        }
                    }
                });
            });
        }

        return summary;
    },

    // Generate inheritance summary for reporting
    generateInheritanceSummary: function() {
        const responsibility = this.calculateCustomerResponsibility();
        const total = responsibility.fullyInherited.length + 
                     responsibility.shared.length + 
                     responsibility.customer.length + 
                     responsibility.hybrid.length +
                     responsibility.notAssigned.length;

        return {
            total: total,
            fullyInherited: {
                count: responsibility.fullyInherited.length,
                percentage: Math.round((responsibility.fullyInherited.length / total) * 100),
                controls: responsibility.fullyInherited
            },
            shared: {
                count: responsibility.shared.length,
                percentage: Math.round((responsibility.shared.length / total) * 100),
                controls: responsibility.shared
            },
            customer: {
                count: responsibility.customer.length,
                percentage: Math.round((responsibility.customer.length / total) * 100),
                controls: responsibility.customer
            },
            hybrid: {
                count: responsibility.hybrid.length,
                percentage: Math.round((responsibility.hybrid.length / total) * 100),
                controls: responsibility.hybrid
            },
            notAssigned: {
                count: responsibility.notAssigned.length,
                percentage: Math.round((responsibility.notAssigned.length / total) * 100),
                controls: responsibility.notAssigned
            },
            customerWorkload: responsibility.customer.length + responsibility.shared.length + responsibility.hybrid.length,
            inheritedBenefit: responsibility.fullyInherited.length
        };
    },

    // Render inheritance badge for a control
    renderInheritanceBadge: function(controlId) {
        const inheritance = this.inheritanceData[controlId];
        if (!inheritance) {
            return `<span class="inheritance-badge not-set" title="Inheritance not configured">
                <span class="badge-icon">?</span>
            </span>`;
        }

        const type = this.RESPONSIBILITY_TYPES[inheritance.type.toUpperCase().replace('-', '_')] || 
                    this.RESPONSIBILITY_TYPES.CUSTOMER;
        
        return `<span class="inheritance-badge ${inheritance.type}" 
                      title="${type.label}: ${inheritance.notes || type.description}"
                      style="background: ${type.color}20; border-color: ${type.color};">
            <span class="badge-icon" style="color: ${type.color};">${type.icon}</span>
            <span class="badge-label">${type.label}</span>
        </span>`;
    },

    // Render inheritance matrix view
    renderInheritanceMatrix: function() {
        const summary = this.generateInheritanceSummary();
        
        return `
        <div class="inheritance-matrix-container">
            <div class="matrix-header">
                <h3>Shared Responsibility Matrix</h3>
                <div class="matrix-actions">
                    <select id="csp-template-select" class="csp-select">
                        <option value="">Apply CSP Template...</option>
                        ${Object.entries(this.CSP_PROFILES).map(([id, csp]) => 
                            `<option value="${id}">${csp.shortName}</option>`
                        ).join('')}
                    </select>
                    <button class="btn-primary apply-template-btn" onclick="InheritedControls.applySelectedTemplate()">
                        Apply Template
                    </button>
                </div>
            </div>

            <div class="matrix-summary">
                <div class="summary-card inherited">
                    <div class="card-value">${summary.fullyInherited.count}</div>
                    <div class="card-label">Fully Inherited</div>
                    <div class="card-percent">${summary.fullyInherited.percentage}%</div>
                </div>
                <div class="summary-card shared">
                    <div class="card-value">${summary.shared.count}</div>
                    <div class="card-label">Shared</div>
                    <div class="card-percent">${summary.shared.percentage}%</div>
                </div>
                <div class="summary-card customer">
                    <div class="card-value">${summary.customer.count}</div>
                    <div class="card-label">Customer</div>
                    <div class="card-percent">${summary.customer.percentage}%</div>
                </div>
                <div class="summary-card not-set">
                    <div class="card-value">${summary.notAssigned.count}</div>
                    <div class="card-label">Not Set</div>
                    <div class="card-percent">${summary.notAssigned.percentage}%</div>
                </div>
            </div>

            <div class="matrix-insight">
                <div class="insight-icon">💡</div>
                <div class="insight-text">
                    <strong>${summary.inheritedBenefit} controls</strong> are fully inherited from your CSP, 
                    reducing your compliance workload. You need to implement 
                    <strong>${summary.customerWorkload} controls</strong> (customer or shared responsibility).
                </div>
            </div>

            <div class="matrix-grid" id="inheritance-matrix-grid">
                ${this.renderMatrixGrid()}
            </div>
        </div>`;
    },

    renderMatrixGrid: function() {
        if (typeof CONTROL_FAMILIES === 'undefined') return '<p>No control data available</p>';

        let html = '';
        CONTROL_FAMILIES.forEach(family => {
            html += `
            <div class="matrix-family">
                <div class="family-header-row">
                    <span class="family-name">${family.name}</span>
                    <span class="family-stats">${family.controls.length} controls</span>
                </div>
                <div class="family-controls">
                    ${family.controls.map(control => {
                        const inheritance = this.inheritanceData[control.id];
                        const type = inheritance ? inheritance.type : 'not-set';
                        const typeInfo = this.RESPONSIBILITY_TYPES[type.toUpperCase().replace('-', '_')] || 
                                        { color: '#9ca3af', icon: '?' };
                        
                        return `
                        <div class="control-cell ${type}" 
                             data-control-id="${control.id}"
                             title="${control.id}: ${control.name}"
                             style="border-color: ${typeInfo.color};">
                            <span class="cell-id">${control.id}</span>
                            <span class="cell-icon">${typeInfo.icon}</span>
                            <button class="edit-inheritance-btn" onclick="InheritedControls.showEditModal('${control.id}')">
                                ✎
                            </button>
                        </div>`;
                    }).join('')}
                </div>
            </div>`;
        });

        return html;
    },

    applySelectedTemplate: function() {
        const select = document.getElementById('csp-template-select');
        if (select && select.value) {
            const count = this.applyCspTemplate(select.value);
            alert(`Applied template to ${count} controls`);
            // Refresh the matrix view
            const grid = document.getElementById('inheritance-matrix-grid');
            if (grid) {
                grid.innerHTML = this.renderMatrixGrid();
            }
        }
    },

    showEditModal: function(controlId) {
        const control = this.findControl(controlId);
        const current = this.inheritanceData[controlId] || {};
        
        const modalHTML = `
        <div class="modal-overlay" id="inheritance-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Set Inheritance: ${controlId}</h3>
                    <button class="modal-close" onclick="document.getElementById('inheritance-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p class="control-name">${control?.name || 'Control'}</p>
                    
                    <div class="form-group">
                        <label>Responsibility Type</label>
                        <div class="responsibility-options">
                            ${Object.entries(this.RESPONSIBILITY_TYPES).map(([key, type]) => `
                            <label class="resp-option ${current.type === type.id ? 'selected' : ''}">
                                <input type="radio" name="resp-type" value="${type.id}" 
                                       ${current.type === type.id ? 'checked' : ''}>
                                <span class="resp-icon" style="background: ${type.color};">${type.icon}</span>
                                <span class="resp-label">${type.label}</span>
                                <span class="resp-desc">${type.description}</span>
                            </label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Cloud Service Provider</label>
                        <select id="modal-csp-select">
                            <option value="">Select CSP...</option>
                            ${Object.entries(this.CSP_PROFILES).map(([id, csp]) => 
                                `<option value="${id}" ${current.csp === id ? 'selected' : ''}>${csp.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Notes</label>
                        <textarea id="modal-notes" rows="3" placeholder="Add implementation notes...">${current.notes || ''}</textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="document.getElementById('inheritance-modal').remove()">Cancel</button>
                    <button class="btn-primary" onclick="InheritedControls.saveFromModal('${controlId}')">Save</button>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    saveFromModal: function(controlId) {
        const typeInput = document.querySelector('input[name="resp-type"]:checked');
        const cspSelect = document.getElementById('modal-csp-select');
        const notesInput = document.getElementById('modal-notes');
        
        if (typeInput) {
            this.setInheritance(
                controlId,
                typeInput.value,
                cspSelect?.value || '',
                notesInput?.value || ''
            );
            
            document.getElementById('inheritance-modal')?.remove();
            
            // Refresh the grid
            const grid = document.getElementById('inheritance-matrix-grid');
            if (grid) {
                grid.innerHTML = this.renderMatrixGrid();
            }
        }
    },

    findControl: function(controlId) {
        if (typeof CONTROL_FAMILIES === 'undefined') return null;
        
        for (const family of CONTROL_FAMILIES) {
            const control = family.controls.find(c => c.id === controlId);
            if (control) return control;
        }
        return null;
    },

    // Export inheritance data for SSP
    exportForSSP: function() {
        const summary = this.generateInheritanceSummary();
        const data = [];
        
        if (typeof CONTROL_FAMILIES !== 'undefined') {
            CONTROL_FAMILIES.forEach(family => {
                family.controls.forEach(control => {
                    const inheritance = this.inheritanceData[control.id];
                    data.push({
                        controlId: control.id,
                        controlName: control.name,
                        family: family.name,
                        responsibilityType: inheritance?.type || 'not-set',
                        csp: inheritance?.csp ? this.CSP_PROFILES[inheritance.csp]?.name : '',
                        notes: inheritance?.notes || ''
                    });
                });
            });
        }

        return {
            generatedAt: new Date().toISOString(),
            summary: summary,
            controls: data
        };
    }
};

// Initialize on load
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => InheritedControls.init());
    } else {
        InheritedControls.init();
    }
}

// Export
if (typeof window !== 'undefined') {
    window.InheritedControls = InheritedControls;
}
