// System & Information Inventory Module
// Comprehensive asset tracking, CUI data classification, and boundary definition
// Works entirely with localStorage

const SystemInventory = {
    // XSS-safe HTML escaping for user-stored data
    esc(s) { return typeof Sanitize !== 'undefined' ? Sanitize.html(s) : String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;'})[c]); },

    config: {
        version: "1.0.0",
        storageKey: "nist-system-inventory",
        assetTypes: {
            server: { label: "Server", icon: "🖥️", color: "#3b82f6" },
            workstation: { label: "Workstation", icon: "💻", color: "#10b981" },
            network: { label: "Network Device", icon: "🌐", color: "#f59e0b" },
            application: { label: "Application", icon: "📱", color: "#8b5cf6" },
            cloud: { label: "Cloud Service", icon: "☁️", color: "#06b6d4" },
            storage: { label: "Storage", icon: "💾", color: "#ef4444" },
            database: { label: "Database", icon: "🗄️", color: "#ec4899" }
        },
        boundaries: {
            inside: { label: "Inside CUI Boundary", color: "#10b981" },
            outside: { label: "Outside CUI Boundary", color: "#6b7280" },
            dmz: { label: "DMZ/Perimeter", color: "#f59e0b" }
        },
        criticality: {
            high: { label: "High", color: "#ef4444" },
            medium: { label: "Medium", color: "#f59e0b" },
            low: { label: "Low", color: "#10b981" }
        }
    },

    inventory: {
        assets: {},
        boundaries: {},
        dataFlows: {}
    },

    init: function() {
        this.loadInventory();
        this.bindEvents();
        console.log('[SystemInventory] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            // Open inventory
            if (e.target.closest('#open-system-inventory-btn')) {
                this.showInventoryDashboard();
            }

            // Add asset
            if (e.target.closest('#add-asset-btn')) {
                this.showAddAssetModal();
            }

            // Save asset
            if (e.target.closest('#save-asset-btn')) {
                this.saveAsset();
            }

            // Edit asset
            if (e.target.closest('.edit-asset-btn')) {
                const assetId = e.target.closest('.edit-asset-btn').dataset.assetId;
                this.showEditAssetModal(assetId);
            }

            // Delete asset
            if (e.target.closest('.delete-asset-btn')) {
                const assetId = e.target.closest('.delete-asset-btn').dataset.assetId;
                this.deleteAsset(assetId);
            }

            // View asset details
            if (e.target.closest('.view-asset-btn')) {
                const assetId = e.target.closest('.view-asset-btn').dataset.assetId;
                this.showAssetDetails(assetId);
            }

            // Export inventory
            if (e.target.closest('#export-inventory-btn')) {
                this.exportInventory();
            }

            // Bulk upload
            if (e.target.closest('#bulk-upload-btn')) {
                this.showBulkUploadModal();
            }

            // Process bulk upload
            if (e.target.closest('#process-bulk-upload-btn')) {
                this.processBulkUpload();
            }

            // Network boundary upload
            if (e.target.closest('#network-boundary-upload-btn')) {
                this.showNetworkBoundaryUpload();
            }

            // Process network boundary
            if (e.target.closest('#process-network-boundary-btn')) {
                this.processNetworkBoundary();
            }

            // Filter assets
            if (e.target.closest('.inventory-filter-btn')) {
                const filter = e.target.closest('.inventory-filter-btn').dataset.filter;
                this.filterAssets(filter);
            }
        });

        // Search
        document.addEventListener('input', (e) => {
            if (e.target.id === 'inventory-search-input') {
                this.searchAssets(e.target.value);
            }
        });

        // File upload handlers
        document.addEventListener('change', (e) => {
            if (e.target.id === 'bulk-upload-file') {
                this.handleBulkUploadFile(e.target.files[0]);
            }
            if (e.target.id === 'network-boundary-file') {
                this.handleNetworkBoundaryFile(e.target.files[0]);
            }
        });
    },

    loadInventory: function() {
        const saved = localStorage.getItem(this.config.storageKey);
        if (saved) {
            this.inventory = JSON.parse(saved);
        }
    },

    saveToStorage: function() {
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.inventory));
    },

    showInventoryDashboard: function() {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.id = 'system-inventory-modal';
        
        const stats = this.calculateStats();
        
        modal.innerHTML = `
            <div class="modal-content inventory-modal">
                <div class="modal-header">
                    <h2>System & Information Inventory</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <!-- Stats Dashboard -->
                    <div class="inventory-stats">
                        <div class="inventory-stat-card">
                            <div class="stat-value">${stats.totalAssets}</div>
                            <div class="stat-label">Total Assets</div>
                        </div>
                        <div class="inventory-stat-card cui">
                            <div class="stat-value">${stats.cuiAssets}</div>
                            <div class="stat-label">CUI Assets</div>
                        </div>
                        <div class="inventory-stat-card critical">
                            <div class="stat-value">${stats.criticalAssets}</div>
                            <div class="stat-label">Critical Assets</div>
                        </div>
                        <div class="inventory-stat-card">
                            <div class="stat-value">${stats.assetTypes}</div>
                            <div class="stat-label">Asset Types</div>
                        </div>
                    </div>

                    <!-- Filters and Search -->
                    <div class="inventory-controls">
                        <input type="text" id="inventory-search-input" class="form-control" placeholder="Search assets...">
                        <div class="inventory-filters">
                            <button class="inventory-filter-btn active" data-filter="all">All</button>
                            <button class="inventory-filter-btn" data-filter="cui">CUI Only</button>
                            <button class="inventory-filter-btn" data-filter="critical">Critical</button>
                            <button class="inventory-filter-btn" data-filter="inside">Inside Boundary</button>
                        </div>
                        <button class="btn-primary" id="add-asset-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Add Asset
                        </button>
                        <button class="btn-secondary" id="export-inventory-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Export
                        </button>
                    </div>

                    <!-- Asset List -->
                    <div class="inventory-list" id="inventory-asset-list">
                        ${this.renderAssetList()}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    calculateStats: function() {
        const assets = Object.values(this.inventory.assets);
        return {
            totalAssets: assets.length,
            cuiAssets: assets.filter(a => a.processesCUI).length,
            criticalAssets: assets.filter(a => a.criticality === 'high').length,
            assetTypes: new Set(assets.map(a => a.type)).size
        };
    },

    renderAssetList: function(filter = 'all') {
        const assets = Object.values(this.inventory.assets);
        
        if (assets.length === 0) {
            return '<div class="empty-state">No assets in inventory. Click "Add Asset" to get started.</div>';
        }

        let filtered = assets;
        if (filter === 'cui') filtered = assets.filter(a => a.processesCUI);
        if (filter === 'critical') filtered = assets.filter(a => a.criticality === 'high');
        if (filter === 'inside') filtered = assets.filter(a => a.boundary === 'inside');

        return `
            <table class="inventory-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>CUI</th>
                        <th>Boundary</th>
                        <th>Criticality</th>
                        <th>Owner</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.map(asset => `
                        <tr>
                            <td>
                                <div class="asset-name">
                                    <span class="asset-icon">${this.config.assetTypes[asset.type].icon}</span>
                                    ${this.esc(asset.name)}
                                </div>
                            </td>
                            <td><span class="asset-type-badge" style="background: ${this.config.assetTypes[asset.type].color}">${this.config.assetTypes[asset.type].label}</span></td>
                            <td>${asset.processesCUI ? '<span class="cui-badge">✓ CUI</span>' : '<span class="no-cui-badge">No CUI</span>'}</td>
                            <td><span class="boundary-badge ${asset.boundary}">${this.config.boundaries[asset.boundary].label}</span></td>
                            <td><span class="criticality-badge ${asset.criticality}">${this.config.criticality[asset.criticality].label}</span></td>
                            <td>${this.esc(asset.owner || 'N/A')}</td>
                            <td class="asset-actions">
                                <button class="icon-btn view-asset-btn" data-asset-id="${asset.id}" title="View Details">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button class="icon-btn edit-asset-btn" data-asset-id="${asset.id}" title="Edit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button class="icon-btn delete-asset-btn" data-asset-id="${asset.id}" title="Delete">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    showAddAssetModal: function() {
        this.showAssetFormModal(null);
    },

    showEditAssetModal: function(assetId) {
        this.showAssetFormModal(assetId);
    },

    showAssetFormModal: function(assetId) {
        const isEdit = !!assetId;
        const asset = isEdit ? this.inventory.assets[assetId] : null;
        
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>${isEdit ? 'Edit Asset' : 'Add New Asset'}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <form id="asset-form">
                        <input type="hidden" id="asset-id" value="${assetId || ''}">
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Asset Name *</label>
                                <input type="text" id="asset-name" class="form-control" required value="${this.esc(asset?.name || '')}" maxlength="500" placeholder="e.g., File Server 01">
                            </div>
                            <div class="form-group">
                                <label>Asset Type *</label>
                                <select id="asset-type" class="form-control" required>
                                    ${Object.entries(this.config.assetTypes).map(([key, type]) => 
                                        `<option value="${key}" ${asset?.type === key ? 'selected' : ''}>${type.icon} ${type.label}</option>`
                                    ).join('')}
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Processes CUI? *</label>
                                <select id="asset-cui" class="form-control" required>
                                    <option value="true" ${asset?.processesCUI ? 'selected' : ''}>Yes - Processes CUI</option>
                                    <option value="false" ${asset?.processesCUI === false ? 'selected' : ''}>No - Does not process CUI</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Security Boundary *</label>
                                <select id="asset-boundary" class="form-control" required>
                                    ${Object.entries(this.config.boundaries).map(([key, boundary]) => 
                                        `<option value="${key}" ${asset?.boundary === key ? 'selected' : ''}>${boundary.label}</option>`
                                    ).join('')}
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Criticality *</label>
                                <select id="asset-criticality" class="form-control" required>
                                    ${Object.entries(this.config.criticality).map(([key, crit]) => 
                                        `<option value="${key}" ${asset?.criticality === key ? 'selected' : ''}>${crit.label}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Owner/Responsible Party</label>
                                <input type="text" id="asset-owner" class="form-control" value="${this.esc(asset?.owner || '')}" maxlength="200" placeholder="e.g., IT Admin">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Location</label>
                            <input type="text" id="asset-location" class="form-control" value="${this.esc(asset?.location || '')}" maxlength="500" placeholder="e.g., On-Premises Data Center, AWS us-east-1">
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>IP Address / Hostname</label>
                                <input type="text" id="asset-ip" class="form-control" value="${this.esc(asset?.ipAddress || '')}" maxlength="45" placeholder="e.g., 10.0.1.50">
                            </div>
                            <div class="form-group">
                                <label>Operating System / Version</label>
                                <input type="text" id="asset-os" class="form-control" value="${this.esc(asset?.os || '')}" maxlength="200" placeholder="e.g., Windows Server 2022">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Related Controls</label>
                            <input type="text" id="asset-controls" class="form-control" value="${this.esc(asset?.relatedControls?.join(', ') || '')}" maxlength="500" placeholder="e.g., 3.1.1, 3.4.1, 3.13.1">
                            <small style="color: var(--text-muted);">Comma-separated list of control IDs</small>
                        </div>

                        <div class="form-group">
                            <label>Notes</label>
                            <textarea id="asset-notes" class="form-control" rows="3" maxlength="5000" placeholder="Additional information about this asset...">${this.esc(asset?.notes || '')}</textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-backdrop').remove()">Cancel</button>
                    <button class="btn-primary" id="save-asset-btn">${isEdit ? 'Update Asset' : 'Add Asset'}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    saveAsset: function() {
        const form = document.getElementById('asset-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const assetId = document.getElementById('asset-id').value || this.generateId();
        const asset = {
            id: assetId,
            name: document.getElementById('asset-name').value,
            type: document.getElementById('asset-type').value,
            processesCUI: document.getElementById('asset-cui').value === 'true',
            boundary: document.getElementById('asset-boundary').value,
            criticality: document.getElementById('asset-criticality').value,
            owner: document.getElementById('asset-owner').value,
            location: document.getElementById('asset-location').value,
            ipAddress: document.getElementById('asset-ip').value,
            os: document.getElementById('asset-os').value,
            relatedControls: document.getElementById('asset-controls').value.split(',').map(c => c.trim()).filter(c => c),
            notes: document.getElementById('asset-notes').value,
            created: this.inventory.assets[assetId]?.created || Date.now(),
            updated: Date.now()
        };

        this.inventory.assets[assetId] = asset;
        this.saveToStorage();

        // Close modal
        document.querySelector('.modal-backdrop').remove();

        // Refresh inventory dashboard if open
        const inventoryModal = document.getElementById('system-inventory-modal');
        if (inventoryModal) {
            const listContainer = document.getElementById('inventory-asset-list');
            listContainer.innerHTML = this.renderAssetList();
            
            // Update stats
            const stats = this.calculateStats();
            inventoryModal.querySelectorAll('.inventory-stat-card .stat-value').forEach((el, i) => {
                el.textContent = Object.values(stats)[i];
            });
        }

        this.showToast(`Asset ${asset.name} ${assetId === document.getElementById('asset-id').value ? 'updated' : 'added'}`, 'success');
    },

    deleteAsset: function(assetId) {
        const asset = this.inventory.assets[assetId];
        if (!confirm(`Delete asset "${asset.name}"? This cannot be undone.`)) return;

        delete this.inventory.assets[assetId];
        this.saveToStorage();

        // Refresh list
        const listContainer = document.getElementById('inventory-asset-list');
        if (listContainer) {
            listContainer.innerHTML = this.renderAssetList();
        }

        this.showToast(`Asset deleted`, 'success');
    },

    showAssetDetails: function(assetId) {
        const asset = this.inventory.assets[assetId];
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>${this.config.assetTypes[asset.type].icon} ${this.esc(asset.name)}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="asset-details">
                        <div class="detail-row">
                            <span class="detail-label">Type:</span>
                            <span class="detail-value"><span class="asset-type-badge" style="background: ${this.config.assetTypes[asset.type].color}">${this.config.assetTypes[asset.type].label}</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Processes CUI:</span>
                            <span class="detail-value">${asset.processesCUI ? '<span class="cui-badge">✓ Yes</span>' : '<span class="no-cui-badge">No</span>'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Security Boundary:</span>
                            <span class="detail-value"><span class="boundary-badge ${asset.boundary}">${this.config.boundaries[asset.boundary].label}</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Criticality:</span>
                            <span class="detail-value"><span class="criticality-badge ${asset.criticality}">${this.config.criticality[asset.criticality].label}</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Owner:</span>
                            <span class="detail-value">${this.esc(asset.owner || 'N/A')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Location:</span>
                            <span class="detail-value">${this.esc(asset.location || 'N/A')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">IP/Hostname:</span>
                            <span class="detail-value">${this.esc(asset.ipAddress || 'N/A')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">OS/Version:</span>
                            <span class="detail-value">${this.esc(asset.os || 'N/A')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Related Controls:</span>
                            <span class="detail-value">${asset.relatedControls?.length ? asset.relatedControls.join(', ') : 'None'}</span>
                        </div>
                        ${asset.notes ? `
                            <div class="detail-row">
                                <span class="detail-label">Notes:</span>
                                <span class="detail-value">${this.esc(asset.notes)}</span>
                            </div>
                        ` : ''}
                        <div class="detail-row">
                            <span class="detail-label">Created:</span>
                            <span class="detail-value">${new Date(asset.created).toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Last Updated:</span>
                            <span class="detail-value">${new Date(asset.updated).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-backdrop').remove()">Close</button>
                    <button class="btn-primary edit-asset-btn" data-asset-id="${assetId}">Edit Asset</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    filterAssets: function(filter) {
        const listContainer = document.getElementById('inventory-asset-list');
        if (!listContainer) return;

        // Update active button
        document.querySelectorAll('.inventory-filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        // Render filtered list
        listContainer.innerHTML = this.renderAssetList(filter);
    },

    searchAssets: function(query) {
        const listContainer = document.getElementById('inventory-asset-list');
        if (!listContainer) return;

        const assets = Object.values(this.inventory.assets);
        const filtered = assets.filter(asset => 
            asset.name.toLowerCase().includes(query.toLowerCase()) ||
            asset.owner?.toLowerCase().includes(query.toLowerCase()) ||
            asset.location?.toLowerCase().includes(query.toLowerCase()) ||
            asset.ipAddress?.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length === 0) {
            listContainer.innerHTML = '<div class="empty-state">No assets match your search.</div>';
            return;
        }

        // Render filtered results (reuse renderAssetList logic but with filtered array)
        this.inventory.assets = Object.fromEntries(filtered.map(a => [a.id, a]));
        listContainer.innerHTML = this.renderAssetList();
        this.loadInventory(); // Restore full inventory
    },

    exportInventory: function() {
        const data = {
            exportDate: new Date().toISOString(),
            stats: this.calculateStats(),
            assets: Object.values(this.inventory.assets)
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system-inventory-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Inventory exported successfully', 'success');
    },

    // Bulk Upload Modal
    showBulkUploadModal: function() {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h2>📤 Bulk Upload System Assets</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="bulk-upload-instructions">
                        <h3>Upload Methods</h3>
                        <p>Import multiple assets at once using CSV or JSON format.</p>
                        
                        <div class="upload-format-tabs">
                            <button class="format-tab active" data-format="csv">CSV Format</button>
                            <button class="format-tab" data-format="json">JSON Format</button>
                        </div>
                        
                        <div class="format-example active" data-format-content="csv">
                            <h4>CSV Format Example:</h4>
                            <pre>name,type,ipAddress,boundary,criticality,description,owner,cuiProcessed
Web Server 01,server,10.0.1.10,inside,high,Production web server,IT Team,yes
Database 01,database,10.0.1.20,inside,high,Customer database,IT Team,yes
Workstation 01,workstation,10.0.2.50,inside,medium,Employee workstation,John Doe,no
Firewall,network,10.0.0.1,dmz,high,Perimeter firewall,Security Team,no</pre>
                            <p><strong>Required columns:</strong> name, type, boundary</p>
                            <p><strong>Optional columns:</strong> ipAddress, criticality, description, owner, cuiProcessed, location, os, version</p>
                        </div>
                        
                        <div class="format-example" data-format-content="json">
                            <h4>JSON Format Example:</h4>
                            <pre>[
  {
    "name": "Web Server 01",
    "type": "server",
    "ipAddress": "10.0.1.10",
    "boundary": "inside",
    "criticality": "high",
    "description": "Production web server",
    "owner": "IT Team",
    "cuiProcessed": true
  },
  {
    "name": "Database 01",
    "type": "database",
    "ipAddress": "10.0.1.20",
    "boundary": "inside",
    "criticality": "high",
    "description": "Customer database",
    "owner": "IT Team",
    "cuiProcessed": true
  }
]</pre>
                        </div>
                    </div>
                    
                    <div class="bulk-upload-section">
                        <h3>Upload File</h3>
                        <input type="file" id="bulk-upload-file" accept=".csv,.json" class="form-control">
                        <div id="bulk-upload-preview" class="bulk-upload-preview"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-backdrop').remove()">Cancel</button>
                    <button class="btn-primary" id="process-bulk-upload-btn" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Import Assets
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Tab switching
        modal.querySelectorAll('.format-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                modal.querySelectorAll('.format-tab').forEach(t => t.classList.remove('active'));
                modal.querySelectorAll('.format-example').forEach(e => e.classList.remove('active'));
                tab.classList.add('active');
                modal.querySelector(`[data-format-content="${tab.dataset.format}"]`).classList.add('active');
            });
        });
    },

    bulkUploadData: null,

    async handleBulkUploadFile(file) {
        if (!file) return;
        
        const preview = document.getElementById('bulk-upload-preview');
        const processBtn = document.getElementById('process-bulk-upload-btn');
        
        try {
            const content = await this.readFileAsText(file);
            let assets = [];
            
            if (file.name.endsWith('.csv')) {
                assets = this.parseCSV(content);
            } else if (file.name.endsWith('.json')) {
                assets = JSON.parse(content);
            }
            
            // Validate assets
            const validAssets = [];
            const errors = [];
            
            assets.forEach((asset, index) => {
                const validation = this.validateBulkAsset(asset, index + 1);
                if (validation.valid) {
                    validAssets.push(asset);
                } else {
                    errors.push(validation.error);
                }
            });
            
            this.bulkUploadData = validAssets;
            
            // Show preview
            preview.innerHTML = `
                <div class="upload-summary">
                    <h4>Upload Summary</h4>
                    <div class="summary-stats">
                        <div class="stat-item success">
                            <strong>${validAssets.length}</strong> valid assets
                        </div>
                        ${errors.length > 0 ? `<div class="stat-item error"><strong>${errors.length}</strong> errors</div>` : ''}
                    </div>
                    ${errors.length > 0 ? `
                        <div class="upload-errors">
                            <h5>Errors:</h5>
                            <ul>
                                ${errors.map(err => `<li>${err}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    <div class="asset-preview">
                        <h5>Assets to Import:</h5>
                        <table class="preview-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Boundary</th>
                                    <th>Criticality</th>
                                    <th>CUI</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${validAssets.slice(0, 10).map(asset => `
                                    <tr>
                                        <td>${this.esc(asset.name)}</td>
                                        <td>${this.esc(asset.type)}</td>
                                        <td>${this.esc(asset.boundary)}</td>
                                        <td>${asset.criticality || 'N/A'}</td>
                                        <td>${asset.cuiProcessed ? 'Yes' : 'No'}</td>
                                    </tr>
                                `).join('')}
                                ${validAssets.length > 10 ? `<tr><td colspan="5" style="text-align: center; font-style: italic;">... and ${validAssets.length - 10} more</td></tr>` : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            
            processBtn.disabled = validAssets.length === 0;
            
        } catch (error) {
            preview.innerHTML = `<div class="error-message">Error reading file: ${error.message}</div>`;
            processBtn.disabled = true;
        }
    },

    parseCSV: function(content) {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];
        
        const headers = lines[0].split(',').map(h => h.trim());
        const assets = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const asset = {};
            
            headers.forEach((header, index) => {
                if (values[index]) {
                    if (header === 'cuiProcessed') {
                        asset[header] = values[index].toLowerCase() === 'yes' || values[index].toLowerCase() === 'true';
                    } else {
                        asset[header] = values[index];
                    }
                }
            });
            
            if (asset.name) {
                assets.push(asset);
            }
        }
        
        return assets;
    },

    validateBulkAsset: function(asset, rowNumber) {
        if (!asset.name) {
            return { valid: false, error: `Row ${rowNumber}: Missing required field 'name'` };
        }
        if (!asset.type) {
            return { valid: false, error: `Row ${rowNumber}: Missing required field 'type'` };
        }
        if (!this.config.assetTypes[asset.type]) {
            return { valid: false, error: `Row ${rowNumber}: Invalid asset type '${asset.type}'` };
        }
        if (!asset.boundary) {
            return { valid: false, error: `Row ${rowNumber}: Missing required field 'boundary'` };
        }
        if (!this.config.boundaries[asset.boundary]) {
            return { valid: false, error: `Row ${rowNumber}: Invalid boundary '${asset.boundary}'` };
        }
        
        return { valid: true };
    },

    processBulkUpload: function() {
        if (!this.bulkUploadData || this.bulkUploadData.length === 0) {
            this.showToast('No valid assets to import', 'error');
            return;
        }
        
        let imported = 0;
        this.bulkUploadData.forEach(asset => {
            const assetId = this.generateId();
            this.inventory.assets[assetId] = {
                id: assetId,
                name: asset.name,
                type: asset.type,
                ipAddress: asset.ipAddress || '',
                boundary: asset.boundary,
                criticality: asset.criticality || 'medium',
                description: asset.description || '',
                owner: asset.owner || '',
                cuiProcessed: asset.cuiProcessed || false,
                location: asset.location || '',
                os: asset.os || '',
                version: asset.version || '',
                dateAdded: Date.now(),
                addedBy: localStorage.getItem('nist-user-name') || 'Bulk Upload'
            };
            imported++;
        });
        
        this.saveToStorage();
        this.bulkUploadData = null;
        
        // Close modal
        document.querySelector('.modal-backdrop').remove();
        
        // Refresh dashboard if open
        if (document.querySelector('.inventory-dashboard')) {
            this.showInventoryDashboard();
        }
        
        this.showToast(`Successfully imported ${imported} assets`, 'success');
    },

    // Network Boundary Upload
    showNetworkBoundaryUpload: function() {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h2>🌐 Network Boundary Upload</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="boundary-instructions">
                        <h3>Network Boundary Configuration</h3>
                        <p>Upload a CSV or JSON file containing network assets with their boundary classifications.</p>
                        
                        <h4>CSV Format Example:</h4>
                        <pre>name,ipAddress,boundary,type,description
Web Server 01,10.0.1.10,inside,server,Production web server
Database Server,10.0.1.20,inside,database,Customer database
DMZ Firewall,192.168.1.1,dmz,network,Perimeter firewall
External API,api.example.com,outside,cloud,Third-party API service</pre>
                        
                        <h4>Boundary Types:</h4>
                        <ul>
                            <li><strong>inside</strong> - Assets within the CUI boundary (processes or stores CUI)</li>
                            <li><strong>outside</strong> - Assets outside the CUI boundary</li>
                            <li><strong>dmz</strong> - Assets in the DMZ/perimeter zone</li>
                        </ul>
                    </div>
                    
                    <div class="boundary-upload-section">
                        <h3>Upload File</h3>
                        <input type="file" id="network-boundary-file" accept=".csv,.json" class="form-control">
                        <div id="network-boundary-preview" class="bulk-upload-preview"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-backdrop').remove()">Cancel</button>
                    <button class="btn-primary" id="process-network-boundary-btn" disabled>
                        Import Network Boundary
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    networkBoundaryData: null,

    async handleNetworkBoundaryFile(file) {
        if (!file) return;
        
        const preview = document.getElementById('network-boundary-preview');
        const processBtn = document.getElementById('process-network-boundary-btn');
        
        try {
            const content = await this.readFileAsText(file);
            let assets = [];
            
            if (file.name.endsWith('.csv')) {
                assets = this.parseCSV(content);
            } else if (file.name.endsWith('.json')) {
                assets = JSON.parse(content);
            }
            
            this.networkBoundaryData = assets;
            
            // Group by boundary
            const byBoundary = {
                inside: assets.filter(a => a.boundary === 'inside'),
                outside: assets.filter(a => a.boundary === 'outside'),
                dmz: assets.filter(a => a.boundary === 'dmz')
            };
            
            preview.innerHTML = `
                <div class="boundary-summary">
                    <h4>Network Boundary Summary</h4>
                    <div class="boundary-stats">
                        <div class="boundary-stat inside">
                            <strong>${byBoundary.inside.length}</strong> Inside CUI Boundary
                        </div>
                        <div class="boundary-stat dmz">
                            <strong>${byBoundary.dmz.length}</strong> DMZ/Perimeter
                        </div>
                        <div class="boundary-stat outside">
                            <strong>${byBoundary.outside.length}</strong> Outside Boundary
                        </div>
                    </div>
                    <div class="boundary-preview-list">
                        ${Object.entries(byBoundary).map(([boundary, items]) => items.length > 0 ? `
                            <div class="boundary-group">
                                <h5>${this.config.boundaries[boundary].label}</h5>
                                <ul>
                                    ${items.slice(0, 5).map(item => `<li>${this.esc(item.name)} ${item.ipAddress ? `(${this.esc(item.ipAddress)})` : ''}</li>`).join('')}
                                    ${items.length > 5 ? `<li><em>... and ${items.length - 5} more</em></li>` : ''}
                                </ul>
                            </div>
                        ` : '').join('')}
                    </div>
                </div>
            `;
            
            processBtn.disabled = assets.length === 0;
            
        } catch (error) {
            preview.innerHTML = `<div class="error-message">Error reading file: ${error.message}</div>`;
            processBtn.disabled = true;
        }
    },

    processNetworkBoundary: function() {
        if (!this.networkBoundaryData || this.networkBoundaryData.length === 0) {
            this.showToast('No assets to import', 'error');
            return;
        }
        
        let imported = 0;
        let updated = 0;
        
        this.networkBoundaryData.forEach(asset => {
            // Check if asset already exists by name or IP
            const existingAsset = Object.values(this.inventory.assets).find(
                a => a.name === asset.name || (asset.ipAddress && a.ipAddress === asset.ipAddress)
            );
            
            if (existingAsset) {
                // Update existing asset's boundary
                existingAsset.boundary = asset.boundary;
                if (asset.ipAddress) existingAsset.ipAddress = asset.ipAddress;
                if (asset.description) existingAsset.description = asset.description;
                updated++;
            } else {
                // Create new asset
                const assetId = this.generateId();
                this.inventory.assets[assetId] = {
                    id: assetId,
                    name: asset.name,
                    type: asset.type || 'server',
                    ipAddress: asset.ipAddress || '',
                    boundary: asset.boundary,
                    criticality: asset.criticality || 'medium',
                    description: asset.description || '',
                    owner: asset.owner || '',
                    cuiProcessed: asset.boundary === 'inside',
                    dateAdded: Date.now(),
                    addedBy: localStorage.getItem('nist-user-name') || 'Network Boundary Upload'
                };
                imported++;
            }
        });
        
        this.saveToStorage();
        this.networkBoundaryData = null;
        
        // Close modal
        document.querySelector('.modal-backdrop').remove();
        
        // Refresh dashboard
        if (document.querySelector('.inventory-dashboard')) {
            this.showInventoryDashboard();
        }
        
        this.showToast(`Imported ${imported} new assets, updated ${updated} existing assets`, 'success');
    },

    readFileAsText: function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    },

    generateId: function() {
        return 'asset-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
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
    document.addEventListener('DOMContentLoaded', () => SystemInventory.init());
} else {
    SystemInventory.init();
}
