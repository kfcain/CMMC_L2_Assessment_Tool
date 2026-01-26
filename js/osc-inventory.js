// OSC Inventory Module
// Tracks policies, procedures, SSP, assets, and FIPS certificates

const OSCInventory = {
    data: null,
    currentTab: 'overview',
    assetFilter: 'all',
    modalType: null,
    modalEditIndex: null,
    
    assetCategories: {
        cui: { name: 'CUI Asset', color: '#c678dd', class: 'asset-cui' },
        spa: { name: 'Security Protection Asset', color: '#e5c07b', class: 'asset-spa' },
        crma: { name: 'Contractor Risk-Managed Asset', color: '#e06c75', class: 'asset-crma' },
        specialized: { name: 'Specialized Asset', color: '#61afef', class: 'asset-specialized' },
        oos: { name: 'Out-of-Scope Asset', color: '#5c6370', class: 'asset-oos' }
    },
    
    load() {
        this.data = JSON.parse(localStorage.getItem('osc-inventory') || '{}');
        if (!this.data.policies) this.data.policies = [];
        if (!this.data.procedures) this.data.procedures = [];
        if (!this.data.ssp) this.data.ssp = [];
        if (!this.data.assets) this.data.assets = [];
        if (!this.data.fipsCerts) this.data.fipsCerts = [];
        if (!this.data.dataFlowDiagrams) this.data.dataFlowDiagrams = [];
        if (!this.data.networkDiagrams) this.data.networkDiagrams = [];
        if (!this.data.files) this.data.files = {};
    },
    
    save() {
        localStorage.setItem('osc-inventory', JSON.stringify(this.data));
    },
    
    render(app) {
        const container = document.getElementById('osc-inventory-content');
        if (!container) return;
        
        this.load();
        
        const stats = {
            policies: this.data.policies.length,
            procedures: this.data.procedures.length,
            ssp: this.data.ssp.length,
            assets: this.data.assets.length,
            fipsCerts: this.data.fipsCerts.length,
            diagrams: (this.data.dataFlowDiagrams?.length || 0) + (this.data.networkDiagrams?.length || 0)
        };
        
        container.innerHTML = `
            <div class="osc-inventory-header">
                <h1>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    OSC Inventory
                </h1>
                <p>Track your organization's policies, procedures, SSP documents, assets, and FIPS certifications</p>
            </div>
            
            <div class="osc-summary-stats">
                <div class="osc-stat-card"><h4>Policies</h4><div class="value">${stats.policies}</div></div>
                <div class="osc-stat-card"><h4>Procedures</h4><div class="value">${stats.procedures}</div></div>
                <div class="osc-stat-card"><h4>SSP Documents</h4><div class="value">${stats.ssp}</div></div>
                <div class="osc-stat-card"><h4>Assets</h4><div class="value">${stats.assets}</div></div>
                <div class="osc-stat-card"><h4>FIPS Certs</h4><div class="value">${stats.fipsCerts}</div></div>
                <div class="osc-stat-card"><h4>Diagrams</h4><div class="value">${stats.diagrams}</div></div>
            </div>
            
            <div class="osc-inventory-tabs">
                ${['overview', 'policies', 'procedures', 'ssp', 'assets', 'fips', 'diagrams'].map(tab => `
                    <button class="osc-inventory-tab ${this.currentTab === tab ? 'active' : ''}" data-tab="${tab}">
                        ${this.getTabIcon(tab)}
                        ${tab === 'ssp' ? 'SSP' : tab === 'fips' ? 'FIPS' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        ${tab !== 'overview' ? `<span class="tab-count">${stats[tab === 'fips' ? 'fipsCerts' : tab] || 0}</span>` : ''}
                    </button>
                `).join('')}
            </div>
            
            <div id="osc-tab-content">
                ${this.renderTabContent()}
            </div>
            
            ${this.renderModal()}
        `;
        
        this.bindEvents(container, app);
    },
    
    getTabIcon(tab) {
        const icons = {
            overview: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
            policies: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
            diagrams: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
            procedures: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
            ssp: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
            assets: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
            fips: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
        };
        return icons[tab] || '';
    },
    
    renderTabContent() {
        switch (this.currentTab) {
            case 'overview': return this.renderOverview();
            case 'policies': return this.renderPolicies();
            case 'procedures': return this.renderProcedures();
            case 'ssp': return this.renderSSP();
            case 'assets': return this.renderAssets();
            case 'fips': return this.renderFIPS();
            case 'diagrams': return this.renderDiagrams();
            default: return '';
        }
    },
    
    renderOverview() {
        return `
            <div class="osc-section">
                <div class="osc-section-header">
                    <h2><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> Asset Categories</h2>
                </div>
                <div class="osc-section-body">
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">
                        ${Object.entries(this.assetCategories).map(([key, cat]) => `
                            <div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg-primary);border-radius:8px;border-left:4px solid ${cat.color}">
                                <span style="width:12px;height:12px;border-radius:50%;background:${cat.color}"></span>
                                <div>
                                    <div style="font-weight:600;color:var(--text-primary)">${cat.name}</div>
                                    <div style="font-size:0.75rem;color:var(--text-muted)">${this.data.assets.filter(a => a.category === key).length} assets</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },
    
    renderPolicies() {
        return this.renderItemList('policy', 'policies', 'Security Policies', this.data.policies);
    },
    
    renderProcedures() {
        return this.renderItemList('procedure', 'procedures', 'Procedures', this.data.procedures);
    },
    
    renderSSP() {
        return this.renderItemList('ssp', 'ssp', 'System Security Plan (SSP)', this.data.ssp);
    },
    
    renderItemList(type, key, title, items) {
        return `
            <div class="osc-section">
                <div class="osc-section-header">
                    <h2>${this.getTabIcon(key === 'ssp' ? 'ssp' : key)} ${title}</h2>
                    <button class="osc-add-btn" data-add="${type}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add ${type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                </div>
                <div class="osc-section-body">
                    ${items.length > 0 ? `
                        <div class="osc-item-list">
                            ${items.map((item, idx) => `
                                <div class="osc-item" data-type="${type}" data-index="${idx}">
                                    <div class="osc-item-icon ${type}">
                                        ${this.getTabIcon(key === 'ssp' ? 'ssp' : key)}
                                    </div>
                                    <div class="osc-item-content">
                                        <div class="osc-item-name">${item.name}</div>
                                        <div class="osc-item-meta">${item.description || item.version || 'No details'}</div>
                                    </div>
                                    <div class="osc-item-actions">
                                        <button class="osc-item-action" data-edit="${type}" data-index="${idx}" title="Edit">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                        </button>
                                        <button class="osc-item-action delete" data-delete="${type}" data-index="${idx}" title="Delete">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="osc-empty-state">
                            <p>No ${title.toLowerCase()} documented yet.</p>
                            <button class="osc-add-btn" data-add="${type}">Add First ${type.charAt(0).toUpperCase() + type.slice(1)}</button>
                        </div>
                    `}
                </div>
            </div>
        `;
    },
    
    renderAssets() {
        const filtered = this.assetFilter === 'all' ? this.data.assets : this.data.assets.filter(a => a.category === this.assetFilter);
        
        return `
            <div class="osc-section">
                <div class="osc-section-header">
                    <h2>${this.getTabIcon('assets')} Asset Inventory</h2>
                    <button class="osc-add-btn" data-add="asset">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Asset
                    </button>
                </div>
                <div class="osc-section-body">
                    <div class="osc-asset-categories">
                        <button class="osc-asset-category-filter ${this.assetFilter === 'all' ? 'active' : ''}" data-filter="all">All (${this.data.assets.length})</button>
                        ${Object.entries(this.assetCategories).map(([key, cat]) => `
                            <button class="osc-asset-category-filter ${this.assetFilter === key ? 'active' : ''}" data-filter="${key}">
                                <span class="category-dot ${key}"></span>
                                ${cat.name} (${this.data.assets.filter(a => a.category === key).length})
                            </button>
                        `).join('')}
                    </div>
                    
                    ${filtered.length > 0 ? `
                        <div class="osc-asset-grid">
                            ${filtered.map((asset, idx) => {
                                const actualIdx = this.data.assets.indexOf(asset);
                                const cat = this.assetCategories[asset.category] || {};
                                return `
                                <div class="osc-asset-card asset-${asset.category}">
                                    <div class="osc-asset-card-header">
                                        <div>
                                            <div class="osc-asset-card-title">${asset.name}</div>
                                            <div class="osc-asset-card-type">${asset.assetType || 'Unspecified'}</div>
                                        </div>
                                        <span class="category-badge">${cat.name || asset.category}</span>
                                    </div>
                                    <dl class="osc-asset-card-details">
                                        ${asset.hostname ? `<dt>Hostname</dt><dd>${asset.hostname}</dd>` : ''}
                                        ${asset.ipAddress ? `<dt>IP Address</dt><dd>${asset.ipAddress}</dd>` : ''}
                                        ${asset.owner ? `<dt>Owner</dt><dd>${asset.owner}</dd>` : ''}
                                        ${asset.location ? `<dt>Location</dt><dd>${asset.location}</dd>` : ''}
                                    </dl>
                                    <div class="osc-item-actions" style="margin-top:12px;justify-content:flex-end">
                                        <button class="osc-item-action" data-edit="asset" data-index="${actualIdx}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                                        <button class="osc-item-action delete" data-delete="asset" data-index="${actualIdx}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                                    </div>
                                </div>
                            `}).join('')}
                        </div>
                    ` : `<div class="osc-empty-state"><p>No assets in this category.</p><button class="osc-add-btn" data-add="asset">Add Asset</button></div>`}
                </div>
            </div>
        `;
    },
    
    renderFIPS() {
        return `
            <div class="osc-section">
                <div class="osc-section-header">
                    <h2>${this.getTabIcon('fips')} FIPS 140-2/140-3 Certificates</h2>
                    <button class="osc-add-btn" data-add="fips">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Certificate
                    </button>
                </div>
                <div class="osc-section-body">
                    ${this.data.fipsCerts.length > 0 ? `
                        <div style="overflow-x:auto">
                            <table class="osc-fips-table">
                                <thead><tr><th>Cert #</th><th>Module Name</th><th>Vendor</th><th>Standard</th><th>Level</th><th>Status</th><th>Actions</th></tr></thead>
                                <tbody>
                                    ${this.data.fipsCerts.map((cert, idx) => `
                                        <tr>
                                            <td><span class="osc-fips-cert-number">${cert.certNumber}</span></td>
                                            <td>${cert.moduleName}</td>
                                            <td>${cert.vendor || '-'}</td>
                                            <td>${cert.standard || 'FIPS 140-2'}</td>
                                            <td><span class="osc-fips-level level-${cert.level || '1'}">Level ${cert.level || '1'}</span></td>
                                            <td><span class="osc-fips-status ${cert.status || 'active'}">${cert.status || 'Active'}</span></td>
                                            <td>
                                                <div class="osc-item-actions">
                                                    <button class="osc-item-action" data-edit="fips" data-index="${idx}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                                                    <button class="osc-item-action delete" data-delete="fips" data-index="${idx}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : `<div class="osc-empty-state"><p>No FIPS certificates tracked.</p><button class="osc-add-btn" data-add="fips">Add Certificate</button></div>`}
                </div>
            </div>
            <div class="osc-section" style="margin-top:20px">
                <div class="osc-section-header"><h2>FIPS Certificate Lookup</h2></div>
                <div class="osc-section-body">
                    <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px">Search validated FIPS modules at NIST CMVP:</p>
                    <a href="https://csrc.nist.gov/projects/cryptographic-module-validation-program/validated-modules/search" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:10px 16px;background:var(--accent-blue);color:white;text-decoration:none;border-radius:6px;font-size:0.85rem">Search NIST CMVP</a>
                </div>
            </div>
        `;
    },
    
    renderDiagrams() {
        return `
            <div class="osc-section">
                <div class="osc-section-header">
                    <h2><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></svg> Data Flow / CUI Flow Diagrams</h2>
                    <button class="osc-add-btn" data-add="dataflow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Diagram
                    </button>
                </div>
                <div class="osc-section-body">
                    <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:16px">Document how CUI flows through your systems. Include data sources, processing systems, storage locations, and transmission paths.</p>
                    ${this.data.dataFlowDiagrams.length > 0 ? `
                        <div class="osc-diagram-grid">
                            ${this.data.dataFlowDiagrams.map((diagram, idx) => this.renderDiagramCard(diagram, idx, 'dataflow')).join('')}
                        </div>
                    ` : `<div class="osc-empty-state"><p>No data flow diagrams uploaded yet.</p><button class="osc-add-btn" data-add="dataflow">Add First Diagram</button></div>`}
                </div>
            </div>
            
            <div class="osc-section" style="margin-top:20px">
                <div class="osc-section-header">
                    <h2><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="10" x2="6" y2="14"/><line x1="18" y1="10" x2="18" y2="14"/></svg> Network Diagrams</h2>
                    <button class="osc-add-btn" data-add="network">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Diagram
                    </button>
                </div>
                <div class="osc-section-body">
                    <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:16px">Document your network architecture including CUI enclave boundaries, firewalls, VPNs, and security zones.</p>
                    ${this.data.networkDiagrams.length > 0 ? `
                        <div class="osc-diagram-grid">
                            ${this.data.networkDiagrams.map((diagram, idx) => this.renderDiagramCard(diagram, idx, 'network')).join('')}
                        </div>
                    ` : `<div class="osc-empty-state"><p>No network diagrams uploaded yet.</p><button class="osc-add-btn" data-add="network">Add First Diagram</button></div>`}
                </div>
            </div>
        `;
    },
    
    renderDiagramCard(diagram, idx, type) {
        const hasFile = diagram.fileData;
        const isImage = diagram.fileType?.startsWith('image/');
        return `
            <div class="osc-diagram-card">
                <div class="osc-diagram-preview">
                    ${hasFile && isImage ? `<img src="${diagram.fileData}" alt="${diagram.name}" style="max-width:100%;max-height:200px;object-fit:contain">` : 
                      hasFile ? `<div style="padding:20px;text-align:center"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><div style="margin-top:8px;font-size:0.75rem;color:var(--text-muted)">${diagram.fileName || 'File attached'}</div></div>` :
                      `<div style="padding:20px;text-align:center;color:var(--text-muted)"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><div style="margin-top:8px;font-size:0.75rem">No file attached</div></div>`}
                </div>
                <div class="osc-diagram-info">
                    <div class="osc-diagram-name">${diagram.name}</div>
                    <div class="osc-diagram-meta">${diagram.description || 'No description'}</div>
                    ${diagram.version ? `<div class="osc-diagram-version">v${diagram.version}</div>` : ''}
                </div>
                <div class="osc-item-actions">
                    ${hasFile ? `<button class="osc-item-action" data-view-file="${type}" data-index="${idx}" title="View/Download"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>` : ''}
                    <button class="osc-item-action" data-edit="${type}" data-index="${idx}" title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                    <button class="osc-item-action delete" data-delete="${type}" data-index="${idx}" title="Delete"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                </div>
            </div>
        `;
    },
    
    renderModal() {
        return `
            <div class="osc-modal-overlay" id="osc-modal-overlay">
                <div class="osc-modal" id="osc-modal">
                    <div class="osc-modal-header">
                        <h3 id="osc-modal-title">Add Item</h3>
                        <button class="osc-modal-close" id="osc-modal-close"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                    </div>
                    <div class="osc-modal-body" id="osc-modal-body"></div>
                    <div class="osc-modal-footer">
                        <button class="osc-btn osc-btn-secondary" id="osc-modal-cancel">Cancel</button>
                        <button class="osc-btn osc-btn-primary" id="osc-modal-save">Save</button>
                    </div>
                </div>
            </div>
        `;
    },
    
    bindEvents(container, app) {
        container.querySelectorAll('.osc-inventory-tab').forEach(tab => {
            tab.addEventListener('click', () => { this.currentTab = tab.dataset.tab; this.render(app); });
        });
        container.querySelectorAll('.osc-asset-category-filter').forEach(btn => {
            btn.addEventListener('click', () => { this.assetFilter = btn.dataset.filter; this.render(app); });
        });
        container.querySelectorAll('[data-add]').forEach(btn => {
            btn.addEventListener('click', () => this.openModal(btn.dataset.add, null, app));
        });
        container.querySelectorAll('[data-edit]').forEach(btn => {
            btn.addEventListener('click', (e) => { e.stopPropagation(); this.openModal(btn.dataset.edit, parseInt(btn.dataset.index), app); });
        });
        container.querySelectorAll('[data-delete]').forEach(btn => {
            btn.addEventListener('click', (e) => { e.stopPropagation(); this.deleteItem(btn.dataset.delete, parseInt(btn.dataset.index), app); });
        });
        container.querySelectorAll('[data-view-file]').forEach(btn => {
            btn.addEventListener('click', (e) => { e.stopPropagation(); this.viewFile(btn.dataset.viewFile, parseInt(btn.dataset.index)); });
        });
        document.getElementById('osc-modal-close')?.addEventListener('click', () => this.closeModal());
        document.getElementById('osc-modal-cancel')?.addEventListener('click', () => this.closeModal());
        document.getElementById('osc-modal-overlay')?.addEventListener('click', (e) => { if (e.target.id === 'osc-modal-overlay') this.closeModal(); });
        document.getElementById('osc-modal-save')?.addEventListener('click', () => this.saveItem(app));
    },
    
    openModal(type, index, app) {
        this.modalType = type;
        this.modalEditIndex = index;
        const item = index !== null ? this.getItem(type, index) : {};
        document.getElementById('osc-modal-title').textContent = (index !== null ? 'Edit ' : 'Add ') + type.charAt(0).toUpperCase() + type.slice(1);
        document.getElementById('osc-modal-body').innerHTML = this.getModalForm(type, item);
        document.getElementById('osc-modal-overlay').classList.add('active');
    },
    
    closeModal() {
        document.getElementById('osc-modal-overlay')?.classList.remove('active');
    },
    
    getItem(type, index) {
        const map = { policy: 'policies', procedure: 'procedures', ssp: 'ssp', asset: 'assets', fips: 'fipsCerts', dataflow: 'dataFlowDiagrams', network: 'networkDiagrams' };
        return this.data[map[type]]?.[index] || {};
    },
    
    getModalForm(type, item) {
        const forms = {
            policy: `<div class="osc-form-group"><label>Name *</label><input type="text" id="osc-f-name" value="${item.name||''}" required></div>
                <div class="osc-form-group"><label>Description</label><textarea id="osc-f-description">${item.description||''}</textarea></div>
                <div class="osc-form-group"><label>Version</label><input type="text" id="osc-f-version" value="${item.version||'1.0'}"></div>`,
            procedure: `<div class="osc-form-group"><label>Name *</label><input type="text" id="osc-f-name" value="${item.name||''}" required></div>
                <div class="osc-form-group"><label>Description</label><textarea id="osc-f-description">${item.description||''}</textarea></div>
                <div class="osc-form-group"><label>Related Policy</label><input type="text" id="osc-f-relatedPolicy" value="${item.relatedPolicy||''}"></div>`,
            ssp: `<div class="osc-form-group"><label>Document Name *</label><input type="text" id="osc-f-name" value="${item.name||''}" required></div>
                <div class="osc-form-group"><label>Version</label><input type="text" id="osc-f-version" value="${item.version||'1.0'}"></div>
                <div class="osc-form-group"><label>Last Updated</label><input type="date" id="osc-f-lastUpdated" value="${item.lastUpdated||''}"></div>`,
            asset: `<div class="osc-form-group"><label>Asset Name *</label><input type="text" id="osc-f-name" value="${item.name||''}" required></div>
                <div class="osc-form-group"><label>Category *</label><select id="osc-f-category">
                    <option value="cui" ${item.category==='cui'?'selected':''}>CUI Asset (Purple)</option>
                    <option value="spa" ${item.category==='spa'?'selected':''}>Security Protection Asset (Yellow)</option>
                    <option value="crma" ${item.category==='crma'?'selected':''}>Contractor Risk-Managed Asset (Red)</option>
                    <option value="specialized" ${item.category==='specialized'?'selected':''}>Specialized Asset (Blue)</option>
                    <option value="oos" ${item.category==='oos'?'selected':''}>Out-of-Scope Asset (Gray)</option>
                </select></div>
                <div class="osc-form-group"><label>Asset Type</label><select id="osc-f-assetType">
                    <option value="server" ${item.assetType==='server'?'selected':''}>Server</option>
                    <option value="workstation" ${item.assetType==='workstation'?'selected':''}>Workstation</option>
                    <option value="laptop" ${item.assetType==='laptop'?'selected':''}>Laptop</option>
                    <option value="network" ${item.assetType==='network'?'selected':''}>Network Device</option>
                    <option value="mobile" ${item.assetType==='mobile'?'selected':''}>Mobile Device</option>
                    <option value="virtual" ${item.assetType==='virtual'?'selected':''}>Virtual Machine</option>
                    <option value="cloud" ${item.assetType==='cloud'?'selected':''}>Cloud Resource</option>
                    <option value="other" ${item.assetType==='other'?'selected':''}>Other</option>
                </select></div>
                <div class="osc-form-group"><label>Hostname</label><input type="text" id="osc-f-hostname" value="${item.hostname||''}"></div>
                <div class="osc-form-group"><label>IP Address</label><input type="text" id="osc-f-ipAddress" value="${item.ipAddress||''}"></div>
                <div class="osc-form-group"><label>Owner</label><input type="text" id="osc-f-owner" value="${item.owner||''}"></div>
                <div class="osc-form-group"><label>Location</label><input type="text" id="osc-f-location" value="${item.location||''}"></div>`,
            fips: `<div class="osc-form-group"><label>Certificate # *</label><input type="text" id="osc-f-certNumber" value="${item.certNumber||''}" placeholder="#4282" required></div>
                <div class="osc-form-group"><label>Module Name *</label><input type="text" id="osc-f-moduleName" value="${item.moduleName||''}" required></div>
                <div class="osc-form-group"><label>Vendor</label><input type="text" id="osc-f-vendor" value="${item.vendor||''}"></div>
                <div class="osc-form-group"><label>Standard</label><select id="osc-f-standard">
                    <option value="FIPS 140-2" ${item.standard==='FIPS 140-2'?'selected':''}>FIPS 140-2</option>
                    <option value="FIPS 140-3" ${item.standard==='FIPS 140-3'?'selected':''}>FIPS 140-3</option>
                </select></div>
                <div class="osc-form-group"><label>Level</label><select id="osc-f-level">
                    <option value="1" ${item.level==='1'?'selected':''}>Level 1</option>
                    <option value="2" ${item.level==='2'?'selected':''}>Level 2</option>
                    <option value="3" ${item.level==='3'?'selected':''}>Level 3</option>
                    <option value="4" ${item.level==='4'?'selected':''}>Level 4</option>
                </select></div>
                <div class="osc-form-group"><label>Status</label><select id="osc-f-status">
                    <option value="active" ${item.status==='active'?'selected':''}>Active</option>
                    <option value="historical" ${item.status==='historical'?'selected':''}>Historical</option>
                    <option value="revoked" ${item.status==='revoked'?'selected':''}>Revoked</option>
                </select></div>`,
            dataflow: `<div class="osc-form-group"><label>Diagram Name *</label><input type="text" id="osc-f-name" value="${item.name||''}" placeholder="CUI Data Flow Diagram" required></div>
                <div class="osc-form-group"><label>Description</label><textarea id="osc-f-description" placeholder="Describe what this diagram shows...">${item.description||''}</textarea></div>
                <div class="osc-form-group"><label>Version</label><input type="text" id="osc-f-version" value="${item.version||'1.0'}"></div>
                <div class="osc-form-group">
                    <label>Upload File (Image or PDF)</label>
                    <input type="file" id="osc-f-file" accept="image/*,.pdf,.vsd,.vsdx,.drawio">
                    ${item.fileName ? `<div style="margin-top:8px;font-size:0.8rem;color:var(--text-muted)">Current: ${item.fileName}</div>` : ''}
                </div>`,
            network: `<div class="osc-form-group"><label>Diagram Name *</label><input type="text" id="osc-f-name" value="${item.name||''}" placeholder="Network Architecture Diagram" required></div>
                <div class="osc-form-group"><label>Description</label><textarea id="osc-f-description" placeholder="Describe the network architecture...">${item.description||''}</textarea></div>
                <div class="osc-form-group"><label>Version</label><input type="text" id="osc-f-version" value="${item.version||'1.0'}"></div>
                <div class="osc-form-group">
                    <label>Upload File (Image or PDF)</label>
                    <input type="file" id="osc-f-file" accept="image/*,.pdf,.vsd,.vsdx,.drawio">
                    ${item.fileName ? `<div style="margin-top:8px;font-size:0.8rem;color:var(--text-muted)">Current: ${item.fileName}</div>` : ''}
                </div>`
        };
        return forms[type] || '';
    },
    
    async saveItem(app) {
        const type = this.modalType;
        const map = { policy: 'policies', procedure: 'procedures', ssp: 'ssp', asset: 'assets', fips: 'fipsCerts', dataflow: 'dataFlowDiagrams', network: 'networkDiagrams' };
        const key = map[type];
        
        const item = { dateAdded: Date.now() };
        
        // Handle file upload for diagrams
        const fileInput = document.getElementById('osc-f-file');
        if (fileInput?.files?.[0]) {
            try {
                const file = fileInput.files[0];
                const reader = new FileReader();
                const fileData = await new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
                item.fileData = fileData;
                item.fileName = file.name;
                item.fileType = file.type;
                item.fileSize = file.size;
            } catch (e) {
                console.error('Error reading file:', e);
            }
        } else if (this.modalEditIndex !== null) {
            // Keep existing file if editing and no new file selected
            const existing = this.getItem(type, this.modalEditIndex);
            if (existing.fileData) {
                item.fileData = existing.fileData;
                item.fileName = existing.fileName;
                item.fileType = existing.fileType;
                item.fileSize = existing.fileSize;
            }
        }
        document.querySelectorAll('[id^="osc-f-"]').forEach(el => {
            const field = el.id.replace('osc-f-', '');
            item[field] = el.value;
        });
        
        if (!item.name && !item.certNumber && !item.moduleName) {
            alert('Please fill in required fields');
            return;
        }
        
        if (this.modalEditIndex !== null) {
            this.data[key][this.modalEditIndex] = { ...this.data[key][this.modalEditIndex], ...item };
        } else {
            this.data[key].push(item);
        }
        
        this.save();
        this.closeModal();
        this.render(app);
    },
    
    deleteItem(type, index, app) {
        if (!confirm('Delete this item?')) return;
        const map = { policy: 'policies', procedure: 'procedures', ssp: 'ssp', asset: 'assets', fips: 'fipsCerts', dataflow: 'dataFlowDiagrams', network: 'networkDiagrams' };
        this.data[map[type]].splice(index, 1);
        this.save();
        this.render(app);
    },
    
    viewFile(type, index) {
        const map = { dataflow: 'dataFlowDiagrams', network: 'networkDiagrams' };
        const item = this.data[map[type]]?.[index];
        if (!item?.fileData) return;
        
        // Open file in new tab or download
        const link = document.createElement('a');
        link.href = item.fileData;
        link.target = '_blank';
        if (item.fileType?.startsWith('image/')) {
            // Open images in new tab
            window.open(item.fileData, '_blank');
        } else {
            // Download other files
            link.download = item.fileName || 'diagram';
            link.click();
        }
    }
};

window.OSCInventory = OSCInventory;
