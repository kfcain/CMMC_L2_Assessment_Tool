// Inherited Controls & Shared Responsibility Matrix
// Manages CSP inheritance for GCC High, AWS GovCloud, and other FedRAMP environments

const InheritedControls = {
    // XSS-safe HTML escaping for user-stored data
    esc(s) { return typeof Sanitize !== 'undefined' ? Sanitize.html(s) : String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;'})[c]); },

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
        this.loadEspProfiles();
        this.bindEvents();
        console.log('[InheritedControls] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.set-inheritance-btn')) {
                const controlId = e.target.closest('.set-inheritance-btn').dataset.controlId;
                this.showEditModal(controlId);
            }
            if (e.target.closest('.set-inheritance-btn-inline')) {
                e.preventDefault();
                e.stopPropagation();
                const controlId = e.target.closest('.set-inheritance-btn-inline').dataset.controlId;
                this.showEditModal(controlId);
            }
            if (e.target.closest('.save-inheritance-btn')) {
                this.saveInheritanceSettings();
            }
            if (e.target.closest('.apply-csp-template-btn')) {
                const cspId = e.target.closest('.apply-csp-template-btn').dataset.cspId;
                this.applyCspTemplate(cspId);
            }
            if (e.target.closest('.open-srm-upload-btn')) {
                e.preventDefault();
                this.showSrmUploadModal();
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

    // Normalize control ID to handle both Rev 2 (3.1.1) and Rev 3 (03.01.01) formats
    normalizeControlId: function(controlId) {
        if (!controlId) return controlId;
        // If Rev 3 format (03.01.01), convert to Rev 2 (3.1.1)
        const r3Match = controlId.match(/^0?(\d+)\.0?(\d+)\.0?(\d+)$/);
        if (r3Match) {
            return `${parseInt(r3Match[1])}.${parseInt(r3Match[2])}.${parseInt(r3Match[3])}`;
        }
        return controlId;
    },

    // Get inheritance status for a control
    getInheritance: function(controlId) {
        const normalized = this.normalizeControlId(controlId);
        return this.inheritanceData[normalized] || this.inheritanceData[controlId] || null;
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
                    <button class="btn-primary apply-template-btn" data-action="ic-apply-template">
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
                            <button class="edit-inheritance-btn" data-action="ic-show-edit" data-param="${control.id}">
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
                    <button class="modal-close" data-action="close-modal" data-modal-id="inheritance-modal">×</button>
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
                    <button class="btn-secondary" data-action="close-modal" data-modal-id="inheritance-modal">Cancel</button>
                    <button class="btn-primary" data-action="ic-save-modal" data-param="${controlId}">Save</button>
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

    // =========================================================================
    // ESP/CSP SRM (Shared Responsibility Matrix) Upload & Parser
    // Parses FedRAMP CIS Appendix J or similar SRM documents
    // =========================================================================

    // Storage for uploaded ESP profiles
    espProfiles: [],

    // NIST 800-171 to FedRAMP 800-53 control mapping (common mappings)
    NIST_TO_FEDRAMP: {
        '3.1.1': ['AC-2', 'AC-3', 'AC-17'],
        '3.1.2': ['AC-3', 'AC-4'],
        '3.1.3': ['AC-4'],
        '3.1.4': ['AC-5'],
        '3.1.5': ['AC-6', 'AC-6(1)', 'AC-6(2)', 'AC-6(5)'],
        '3.1.6': ['AC-6(9)', 'AC-6(10)'],
        '3.1.7': ['AC-6(1)', 'AC-6(2)'],
        '3.1.8': ['AC-7'],
        '3.1.9': ['AC-8'],
        '3.1.10': ['AC-11', 'AC-11(1)'],
        '3.1.11': ['AC-12'],
        '3.1.12': ['AC-17(1)', 'AC-17(2)'],
        '3.1.13': ['AC-17(3)'],
        '3.1.14': ['AC-17(4)'],
        '3.1.15': ['AC-18'],
        '3.1.16': ['AC-18(1)'],
        '3.1.17': ['AC-19'],
        '3.1.18': ['AC-19(5)'],
        '3.1.19': ['AC-20', 'AC-20(1)'],
        '3.1.20': ['AC-20(2)'],
        '3.1.21': ['AC-20(1)'],
        '3.1.22': ['AC-22'],
        '3.2.1': ['AT-2'],
        '3.2.2': ['AT-3'],
        '3.2.3': ['AT-2(2)'],
        '3.3.1': ['AU-2', 'AU-3', 'AU-3(1)', 'AU-12'],
        '3.3.2': ['AU-3', 'AU-6', 'AU-6(1)'],
        '3.3.3': ['AU-6(3)'],
        '3.3.4': ['AU-8'],
        '3.3.5': ['AU-9'],
        '3.3.6': ['AU-9(4)'],
        '3.3.7': ['AU-7', 'AU-7(1)'],
        '3.3.8': ['AU-9'],
        '3.3.9': ['AU-9'],
        '3.4.1': ['CM-2', 'CM-6', 'CM-8', 'CM-8(1)'],
        '3.4.2': ['CM-2', 'CM-6', 'CM-7'],
        '3.4.3': ['CM-3', 'CM-3(2)'],
        '3.4.4': ['CM-3(2)'],
        '3.4.5': ['CM-5'],
        '3.4.6': ['CM-7', 'CM-7(1)', 'CM-7(2)'],
        '3.4.7': ['CM-7(4)', 'CM-7(5)'],
        '3.4.8': ['CM-7(4)', 'CM-7(5)'],
        '3.4.9': ['CM-11'],
        '3.5.1': ['IA-2', 'IA-5'],
        '3.5.2': ['IA-2', 'IA-2(1)', 'IA-2(2)'],
        '3.5.3': ['IA-2(1)', 'IA-2(2)', 'IA-2(8)'],
        '3.5.4': ['IA-2(8)', 'IA-2(9)'],
        '3.5.5': ['IA-4'],
        '3.5.6': ['IA-4'],
        '3.5.7': ['IA-5(1)'],
        '3.5.8': ['IA-5(1)'],
        '3.5.9': ['IA-5(1)'],
        '3.5.10': ['IA-5(2)'],
        '3.5.11': ['IA-6'],
        '3.6.1': ['IR-2', 'IR-4', 'IR-5', 'IR-6', 'IR-7'],
        '3.6.2': ['IR-2', 'IR-3', 'IR-3(2)'],
        '3.6.3': ['IR-3', 'IR-3(2)'],
        '3.7.1': ['MA-2'],
        '3.7.2': ['MA-3', 'MA-3(1)', 'MA-3(2)'],
        '3.7.3': ['MA-3', 'MA-3(1)', 'MA-3(2)'],
        '3.7.4': ['MA-4'],
        '3.7.5': ['MA-5'],
        '3.7.6': ['MA-6'],
        '3.8.1': ['MP-2', 'MP-4', 'MP-6'],
        '3.8.2': ['MP-4'],
        '3.8.3': ['MP-3'],
        '3.8.4': ['MP-5'],
        '3.8.5': ['MP-5(4)'],
        '3.8.6': ['MP-6'],
        '3.8.7': ['MP-6(1)', 'MP-6(2)'],
        '3.8.8': ['MP-6(1)', 'MP-6(2)'],
        '3.8.9': ['MP-7'],
        '3.9.1': ['PS-3', 'PS-4', 'PS-5'],
        '3.9.2': ['PS-4', 'PS-5'],
        '3.10.1': ['PE-2', 'PE-6'],
        '3.10.2': ['PE-2', 'PE-6(1)'],
        '3.10.3': ['PE-3'],
        '3.10.4': ['PE-5'],
        '3.10.5': ['PE-6'],
        '3.10.6': ['PE-17'],
        '3.11.1': ['RA-3'],
        '3.11.2': ['RA-5', 'RA-5(5)'],
        '3.11.3': ['RA-5'],
        '3.12.1': ['CA-2', 'CA-2(1)'],
        '3.12.2': ['CA-5', 'CA-7'],
        '3.12.3': ['CA-7'],
        '3.12.4': ['CA-9'],
        '3.13.1': ['SC-7'],
        '3.13.2': ['SC-7(5)'],
        '3.13.3': ['SC-7'],
        '3.13.4': ['SC-7'],
        '3.13.5': ['SC-7(7)'],
        '3.13.6': ['SC-7'],
        '3.13.7': ['SC-7'],
        '3.13.8': ['SC-8', 'SC-8(1)'],
        '3.13.9': ['SC-10'],
        '3.13.10': ['SC-12'],
        '3.13.11': ['SC-13'],
        '3.13.12': ['SC-15'],
        '3.13.13': ['SC-18'],
        '3.13.14': ['SC-28'],
        '3.13.15': ['SC-28(1)'],
        '3.13.16': ['SC-39'],
        '3.14.1': ['SI-2', 'SI-3', 'SI-5'],
        '3.14.2': ['SI-2'],
        '3.14.3': ['SI-3'],
        '3.14.4': ['SI-3'],
        '3.14.5': ['SI-4'],
        '3.14.6': ['SI-4'],
        '3.14.7': ['SI-5']
    },

    // Load ESP profiles from localStorage
    loadEspProfiles: function() {
        try {
            const saved = localStorage.getItem('cmmc_esp_profiles');
            if (saved) {
                this.espProfiles = JSON.parse(saved);
            }
        } catch (e) {
            console.error('[InheritedControls] Error loading ESP profiles:', e);
        }
    },

    // Save ESP profiles
    saveEspProfiles: function() {
        try {
            localStorage.setItem('cmmc_esp_profiles', JSON.stringify(this.espProfiles));
        } catch (e) {
            console.error('[InheritedControls] Error saving ESP profiles:', e);
        }
    },

    // Parse an uploaded SRM file (Excel - FedRAMP CIS Appendix J format)
    parseSrmFile: function(file) {
        return new Promise((resolve, reject) => {
            if (typeof XLSX === 'undefined') {
                reject(new Error('SheetJS (XLSX) library not loaded'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const result = this.extractSrmData(workbook, file.name);
                    resolve(result);
                } catch (err) {
                    reject(new Error('Failed to parse SRM file: ' + err.message));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    },

    // Extract SRM data from workbook
    extractSrmData: function(workbook, fileName) {
        const srmData = {
            fileName: fileName,
            espName: '',
            fedrampLevel: '',
            controls: {},
            parsedAt: new Date().toISOString(),
            sheetNames: workbook.SheetNames,
            totalControls: 0,
            inheritedCount: 0,
            sharedCount: 0,
            customerCount: 0
        };

        // Try to find the CIS/SRM sheet
        const srmSheetNames = ['CIS', 'CRM', 'SRM', 'Appendix J', 'Shared Responsibility',
                               'Customer Responsibility', 'Responsibility Matrix', 'Control Matrix'];
        
        let srmSheet = null;
        let srmSheetName = '';
        
        for (const name of workbook.SheetNames) {
            const normalizedName = name.toLowerCase().trim();
            if (srmSheetNames.some(s => normalizedName.includes(s.toLowerCase()))) {
                srmSheet = workbook.Sheets[name];
                srmSheetName = name;
                break;
            }
        }

        // Fallback to first sheet if no SRM sheet found
        if (!srmSheet) {
            srmSheetName = workbook.SheetNames[0];
            srmSheet = workbook.Sheets[srmSheetName];
        }

        // Convert to JSON rows
        const rows = XLSX.utils.sheet_to_json(srmSheet, { header: 1, defval: '' });
        if (rows.length < 2) {
            return srmData;
        }

        // Find header row (look for "Control" or "ID" column)
        let headerRowIdx = 0;
        let controlCol = -1;
        let responsibilityCol = -1;
        let descriptionCol = -1;
        let implementationCol = -1;

        for (let i = 0; i < Math.min(rows.length, 10); i++) {
            const row = rows[i];
            for (let j = 0; j < row.length; j++) {
                const cell = String(row[j]).toLowerCase().trim();
                if (cell.includes('control') && (cell.includes('id') || cell.includes('number') || cell.includes('#') || cell === 'control')) {
                    controlCol = j;
                    headerRowIdx = i;
                }
                if (cell.includes('responsib') || cell.includes('inherit') || cell.includes('implementation status') || cell.includes('provider')) {
                    responsibilityCol = j;
                }
                if (cell.includes('description') || cell.includes('title') || cell.includes('name')) {
                    descriptionCol = j;
                }
                if (cell.includes('implementation') && !cell.includes('status') || cell.includes('detail') || cell.includes('how')) {
                    implementationCol = j;
                }
            }
            if (controlCol >= 0 && responsibilityCol >= 0) break;
        }

        // If we couldn't find columns, try broader search
        if (controlCol < 0) {
            // Look for column with values matching control ID patterns (e.g., AC-2, SC-7)
            for (let j = 0; j < (rows[0]?.length || 0); j++) {
                for (let i = 1; i < Math.min(rows.length, 20); i++) {
                    const val = String(rows[i]?.[j] || '');
                    if (/^[A-Z]{2}-\d+/.test(val)) {
                        controlCol = j;
                        break;
                    }
                }
                if (controlCol >= 0) break;
            }
        }

        if (controlCol < 0) {
            console.warn('[InheritedControls] Could not identify control column in SRM');
            return srmData;
        }

        // Parse data rows
        for (let i = headerRowIdx + 1; i < rows.length; i++) {
            const row = rows[i];
            const controlId = String(row[controlCol] || '').trim();
            
            if (!controlId || !/^[A-Z]{2}-\d+/.test(controlId)) continue;

            const responsibility = responsibilityCol >= 0 ? String(row[responsibilityCol] || '').trim() : '';
            const description = descriptionCol >= 0 ? String(row[descriptionCol] || '').trim() : '';
            const implementation = implementationCol >= 0 ? String(row[implementationCol] || '').trim() : '';

            // Normalize responsibility type
            const normalizedResp = this.normalizeResponsibility(responsibility);

            srmData.controls[controlId] = {
                responsibility: normalizedResp,
                rawResponsibility: responsibility,
                description: description,
                implementation: implementation
            };

            srmData.totalControls++;
            if (normalizedResp === 'fully-inherited') srmData.inheritedCount++;
            else if (normalizedResp === 'shared') srmData.sharedCount++;
            else if (normalizedResp === 'customer') srmData.customerCount++;
        }

        // Try to extract ESP name from file or sheet data
        srmData.espName = this.extractEspName(workbook, fileName);

        return srmData;
    },

    // Normalize responsibility text to standard types
    normalizeResponsibility: function(text) {
        const lower = text.toLowerCase().trim();
        
        if (lower.includes('fully inherited') || lower.includes('csp') || lower.includes('provider') ||
            lower.includes('inherited') && !lower.includes('shared') && !lower.includes('partial') ||
            lower === 'yes' || lower === 'p' || lower === 'i') {
            return 'fully-inherited';
        }
        if (lower.includes('shared') || lower.includes('partial') || lower.includes('hybrid') ||
            lower.includes('joint') || lower === 'sp' || lower === 's') {
            return 'shared';
        }
        if (lower.includes('customer') || lower.includes('tenant') || lower.includes('organization') ||
            lower.includes('not inherited') || lower === 'no' || lower === 'c' || lower === 'n') {
            return 'customer';
        }
        // Default to shared if unclear
        return lower ? 'shared' : 'customer';
    },

    // Extract ESP name from workbook metadata or filename
    extractEspName: function(workbook, fileName) {
        // Try workbook properties
        if (workbook.Props?.Title) return workbook.Props.Title;
        if (workbook.Props?.Subject) return workbook.Props.Subject;
        
        // Try to extract from filename
        const name = fileName.replace(/\.(xlsx?|csv)$/i, '').replace(/[-_]/g, ' ');
        // Look for known CSP names
        const cspNames = ['Azure', 'AWS', 'GCP', 'Google', 'Microsoft', 'M365', 'Office 365'];
        for (const csp of cspNames) {
            if (name.toLowerCase().includes(csp.toLowerCase())) return csp + ' SRM';
        }
        return name;
    },

    // Apply parsed SRM data to inheritance model
    applySrmData: function(srmData, espId) {
        const applied = { matched: 0, unmatched: 0, details: [] };

        // Map FedRAMP controls back to NIST 800-171 controls
        Object.entries(this.NIST_TO_FEDRAMP).forEach(([nistId, fedrampIds]) => {
            // Check if any mapped FedRAMP control is in the SRM
            let bestMatch = null;
            let bestResp = 'customer';

            for (const fId of fedrampIds) {
                // Try exact match and enhancement variants
                const variants = [fId, fId.replace(/\(\d+\)/, '')]; // Try with and without enhancement
                for (const variant of variants) {
                    if (srmData.controls[variant]) {
                        const resp = srmData.controls[variant].responsibility;
                        // Prefer the most inherited match
                        if (resp === 'fully-inherited' || (!bestMatch && resp === 'shared') || !bestMatch) {
                            bestMatch = variant;
                            bestResp = resp;
                        }
                    }
                }
            }

            if (bestMatch) {
                this.inheritanceData[nistId] = {
                    type: bestResp,
                    csp: espId,
                    notes: `From SRM: ${bestMatch} (${srmData.controls[bestMatch].rawResponsibility})`,
                    srmSource: srmData.fileName,
                    fedrampControl: bestMatch,
                    updatedAt: new Date().toISOString()
                };
                applied.matched++;
                applied.details.push({ nist: nistId, fedramp: bestMatch, type: bestResp });
            } else {
                applied.unmatched++;
            }
        });

        this.saveInheritanceData();
        return applied;
    },

    // Add or update an ESP profile
    addEspProfile: function(srmData, customName) {
        const profile = {
            id: 'esp-' + Date.now(),
            name: customName || srmData.espName || 'Unknown ESP',
            fileName: srmData.fileName,
            uploadedAt: new Date().toISOString(),
            totalControls: srmData.totalControls,
            inheritedCount: srmData.inheritedCount,
            sharedCount: srmData.sharedCount,
            customerCount: srmData.customerCount,
            controls: srmData.controls
        };

        this.espProfiles.push(profile);
        this.saveEspProfiles();
        return profile;
    },

    // Remove an ESP profile
    removeEspProfile: function(profileId) {
        this.espProfiles = this.espProfiles.filter(p => p.id !== profileId);
        this.saveEspProfiles();
    },

    // =========================================================================
    // Objective-Level Rendering
    // =========================================================================

    // Render a compact inheritance badge for an objective row
    renderObjectiveBadge: function(controlId) {
        const inheritance = this.getInheritance(controlId);
        if (!inheritance) return '';

        const typeKey = inheritance.type.toUpperCase().replace(/-/g, '_');
        const type = this.RESPONSIBILITY_TYPES[typeKey] || this.RESPONSIBILITY_TYPES.CUSTOMER;

        return `<span class="inheritance-badge-sm ${inheritance.type}" 
                      title="${type.label}${inheritance.csp ? ' (' + (this.CSP_PROFILES[inheritance.csp]?.shortName || inheritance.csp) + ')' : ''}"
                      style="color: ${type.color}; background: ${type.color}15; border: 1px solid ${type.color}40;">
            ${type.icon}
        </span>`;
    },

    // Render inheritance detail row for objective details section
    renderObjectiveInheritanceDetail: function(controlId) {
        const normalized = this.normalizeControlId(controlId);
        const inheritance = this.getInheritance(controlId);
        if (!inheritance) {
            return `<div class="detail-row inheritance-detail">
                <span class="detail-label">ESP Inheritance:</span>
                <span class="detail-value inheritance-not-set">Not configured 
                    <button class="set-inheritance-btn-inline" data-control-id="${normalized}" title="Set inheritance">Configure</button>
                </span>
            </div>`;
        }

        const typeKey = inheritance.type.toUpperCase().replace(/-/g, '_');
        const type = this.RESPONSIBILITY_TYPES[typeKey] || this.RESPONSIBILITY_TYPES.CUSTOMER;
        const cspName = inheritance.csp ? (this.CSP_PROFILES[inheritance.csp]?.shortName || inheritance.csp) : '';

        return `<div class="detail-row inheritance-detail">
            <span class="detail-label">ESP Inheritance:</span>
            <span class="detail-value">
                <span class="inheritance-type-tag" style="color: ${type.color}; background: ${type.color}15; border: 1px solid ${type.color}40;">
                    ${type.icon} ${type.label}
                </span>
                ${cspName ? `<span class="inheritance-csp-name">${cspName}</span>` : ''}
                ${inheritance.notes ? `<span class="inheritance-notes">${this.esc(inheritance.notes)}</span>` : ''}
                ${inheritance.srmSource ? `<span class="inheritance-srm-source" title="Imported from SRM">SRM</span>` : ''}
                <button class="set-inheritance-btn-inline" data-control-id="${controlId}" title="Edit inheritance">Edit</button>
            </span>
        </div>`;
    },

    // =========================================================================
    // SRM Upload UI
    // =========================================================================

    // Show the SRM upload modal
    showSrmUploadModal: function() {
        // Remove existing modal
        document.getElementById('srm-upload-modal')?.remove();

        const espListHtml = this.espProfiles.length > 0 
            ? this.espProfiles.map(p => `
                <div class="esp-profile-card" data-esp-id="${p.id}">
                    <div class="esp-profile-info">
                        <strong>${p.name}</strong>
                        <span class="esp-meta">${p.totalControls} controls | Uploaded ${new Date(p.uploadedAt).toLocaleDateString()}</span>
                        <span class="esp-stats">
                            <span class="esp-stat inherited">${p.inheritedCount} inherited</span>
                            <span class="esp-stat shared">${p.sharedCount} shared</span>
                            <span class="esp-stat customer">${p.customerCount} customer</span>
                        </span>
                    </div>
                    <div class="esp-profile-actions">
                        <button class="btn-sm btn-primary apply-esp-btn" data-esp-id="${p.id}">Apply</button>
                        <button class="btn-sm btn-danger remove-esp-btn" data-esp-id="${p.id}">Remove</button>
                    </div>
                </div>
            `).join('')
            : '<p class="esp-empty">No ESP/CSP SRM profiles uploaded yet.</p>';

        const modalHTML = `
        <div class="modal-overlay" id="srm-upload-modal">
            <div class="modal-content srm-modal">
                <div class="modal-header">
                    <h3>ESP/CSP Shared Responsibility Matrix</h3>
                    <button class="modal-close" data-action="close-modal" data-modal-id="srm-upload-modal">×</button>
                </div>
                <div class="modal-body">
                    <div class="srm-upload-section">
                        <h4>Upload SRM Document</h4>
                        <p class="srm-description">Upload a FedRAMP CIS Appendix J, Customer Responsibility Matrix (CRM), or Shared Responsibility Matrix (SRM) spreadsheet from your ESP/CSP. The tool will parse the document and map FedRAMP 800-53 controls to NIST 800-171 assessment objectives.</p>
                        
                        <div class="srm-upload-area" id="srm-upload-area">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            <p>Drop .xlsx or .csv file here, or click to browse</p>
                            <input type="file" id="srm-file-input" accept=".xlsx,.xls,.csv" style="display:none">
                        </div>

                        <div class="srm-esp-name-group" id="srm-esp-name-group" style="display:none">
                            <label>ESP/CSP Name</label>
                            <input type="text" id="srm-esp-name" class="form-input" placeholder="e.g., Microsoft Azure GCC High">
                        </div>

                        <div class="srm-parse-status" id="srm-parse-status" style="display:none"></div>
                    </div>

                    <div class="srm-profiles-section">
                        <h4>Uploaded ESP/CSP Profiles</h4>
                        <div class="esp-profiles-list" id="esp-profiles-list">
                            ${espListHtml}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" data-action="close-modal" data-modal-id="srm-upload-modal">Close</button>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.bindSrmModalEvents();
    },

    // Bind events for SRM upload modal
    bindSrmModalEvents: function() {
        const uploadArea = document.getElementById('srm-upload-area');
        const fileInput = document.getElementById('srm-file-input');

        if (!uploadArea || !fileInput) return;

        // Click to browse
        uploadArea.addEventListener('click', () => fileInput.click());

        // File selected
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleSrmUpload(e.target.files[0]);
            }
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) {
                this.handleSrmUpload(e.dataTransfer.files[0]);
            }
        });

        // Apply/Remove ESP buttons
        document.getElementById('srm-upload-modal').addEventListener('click', (e) => {
            if (e.target.closest('.apply-esp-btn')) {
                const espId = e.target.closest('.apply-esp-btn').dataset.espId;
                this.applyEspProfile(espId);
            }
            if (e.target.closest('.remove-esp-btn')) {
                const espId = e.target.closest('.remove-esp-btn').dataset.espId;
                if (confirm('Remove this ESP profile?')) {
                    this.removeEspProfile(espId);
                    this.showSrmUploadModal(); // Refresh
                }
            }
        });
    },

    // Handle SRM file upload
    handleSrmUpload: async function(file) {
        const statusEl = document.getElementById('srm-parse-status');
        const nameGroup = document.getElementById('srm-esp-name-group');
        
        statusEl.style.display = '';
        statusEl.innerHTML = '<div class="srm-parsing"><span class="spinner"></span> Parsing SRM document...</div>';

        try {
            const srmData = await this.parseSrmFile(file);

            if (srmData.totalControls === 0) {
                statusEl.innerHTML = `<div class="srm-error">No controls found in the uploaded file. Please ensure the file contains a FedRAMP control matrix with Control ID and Responsibility columns.</div>`;
                return;
            }

            // Show ESP name input
            nameGroup.style.display = '';
            document.getElementById('srm-esp-name').value = srmData.espName;

            // Show parse results
            statusEl.innerHTML = `
                <div class="srm-success">
                    <strong>Parsed ${srmData.totalControls} controls</strong> from "${srmData.fileName}"
                    <div class="srm-stats">
                        <span class="esp-stat inherited">${srmData.inheritedCount} inherited</span>
                        <span class="esp-stat shared">${srmData.sharedCount} shared</span>
                        <span class="esp-stat customer">${srmData.customerCount} customer</span>
                    </div>
                    <button class="btn-primary srm-apply-btn" id="srm-apply-parsed">Apply to Assessment</button>
                </div>
            `;

            // Bind apply button
            document.getElementById('srm-apply-parsed').addEventListener('click', () => {
                const espName = document.getElementById('srm-esp-name').value.trim() || srmData.espName;
                const profile = this.addEspProfile(srmData, espName);
                const result = this.applySrmData(srmData, profile.id);

                statusEl.innerHTML = `
                    <div class="srm-success">
                        <strong>Applied!</strong> Mapped ${result.matched} NIST 800-171 controls from SRM.
                        ${result.unmatched > 0 ? `<br>${result.unmatched} controls had no matching FedRAMP mapping.` : ''}
                        <br><em>Refresh the assessment view to see inheritance badges.</em>
                    </div>
                `;

                // Refresh ESP list
                const listEl = document.getElementById('esp-profiles-list');
                if (listEl) {
                    this.loadEspProfiles();
                    listEl.innerHTML = this.espProfiles.map(p => `
                        <div class="esp-profile-card" data-esp-id="${p.id}">
                            <div class="esp-profile-info">
                                <strong>${p.name}</strong>
                                <span class="esp-meta">${p.totalControls} controls | Uploaded ${new Date(p.uploadedAt).toLocaleDateString()}</span>
                                <span class="esp-stats">
                                    <span class="esp-stat inherited">${p.inheritedCount} inherited</span>
                                    <span class="esp-stat shared">${p.sharedCount} shared</span>
                                    <span class="esp-stat customer">${p.customerCount} customer</span>
                                </span>
                            </div>
                            <div class="esp-profile-actions">
                                <button class="btn-sm btn-primary apply-esp-btn" data-esp-id="${p.id}">Apply</button>
                                <button class="btn-sm btn-danger remove-esp-btn" data-esp-id="${p.id}">Remove</button>
                            </div>
                        </div>
                    `).join('');
                }

                // Refresh inheritance matrix if visible
                const grid = document.getElementById('inheritance-matrix-grid');
                if (grid) grid.innerHTML = this.renderMatrixGrid();
            });

        } catch (err) {
            statusEl.innerHTML = `<div class="srm-error">Error: ${err.message}</div>`;
        }
    },

    // Apply a saved ESP profile to inheritance data
    applyEspProfile: function(profileId) {
        const profile = this.espProfiles.find(p => p.id === profileId);
        if (!profile) return;

        const srmData = {
            fileName: profile.fileName,
            controls: profile.controls,
            espName: profile.name
        };

        const result = this.applySrmData(srmData, profileId);
        alert(`Applied ${Sanitize ? Sanitize.stripTags(profile.name) : profile.name}: Mapped ${result.matched} NIST 800-171 controls.\nRefresh the assessment view to see updated inheritance badges.`);

        // Refresh matrix if visible
        const grid = document.getElementById('inheritance-matrix-grid');
        if (grid) grid.innerHTML = this.renderMatrixGrid();
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
