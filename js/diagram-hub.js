// Diagram Integration Hub
// Manages network diagrams, CUI data flow diagrams, and multi-application scoping
// Supports import from Figma, Draw.io, LucidChart, Visio, and image files

const DiagramHub = {
    // XSS-safe HTML escaping for user-stored data
    esc(s) { return typeof Sanitize !== 'undefined' ? Sanitize.html(s) : String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;'})[c]); },

    config: {
        version: '1.0.0',
        storageKey: 'cmmc_diagram_hub',
        maxFileSize: 10 * 1024 * 1024 // 10MB per file (base64 in localStorage)
    },

    // CMMC Asset Scoping Categories per CMMC Scoping Guide
    ASSET_CATEGORIES: {
        cui: {
            id: 'cui',
            name: 'CUI Asset',
            description: 'Assets that process, store, or transmit CUI',
            color: '#c678dd',
            icon: 'shield'
        },
        spa: {
            id: 'spa',
            name: 'Security Protection Asset',
            description: 'Assets that provide security functions (firewalls, SIEM, AV, etc.)',
            color: '#e5c07b',
            icon: 'lock'
        },
        crma: {
            id: 'crma',
            name: 'Contractor Risk-Managed Asset',
            description: 'Assets that can but do not process, store, or transmit CUI',
            color: '#e06c75',
            icon: 'alert-triangle'
        },
        specialized: {
            id: 'specialized',
            name: 'Specialized Asset',
            description: 'IoT, OT, ICS, test equipment, or GFE',
            color: '#61afef',
            icon: 'cpu'
        },
        oos: {
            id: 'oos',
            name: 'Out-of-Scope',
            description: 'Assets not connected to CUI-processing systems',
            color: '#5c6370',
            icon: 'x-circle'
        }
    },

    // Asset types (hardware, software, network, cloud — beyond just 'applications')
    ASSET_TYPES: {
        'server':      { name: 'Server',            icon: '🖥️',  category: 'infrastructure' },
        'workstation': { name: 'Workstation',        icon: '💻',  category: 'endpoint' },
        'laptop':      { name: 'Laptop',             icon: '💻',  category: 'endpoint' },
        'mobile':      { name: 'Mobile Device',      icon: '📱',  category: 'endpoint' },
        'printer':     { name: 'Printer / MFP',      icon: '🖨️',  category: 'endpoint' },
        'firewall':    { name: 'Firewall',           icon: '🛡️',  category: 'network' },
        'router':      { name: 'Router',             icon: '📡',  category: 'network' },
        'switch':      { name: 'Switch',             icon: '🔀',  category: 'network' },
        'wap':         { name: 'Wireless AP',        icon: '📶',  category: 'network' },
        'vpn':         { name: 'VPN Gateway',        icon: '🔒',  category: 'network' },
        'ids-ips':     { name: 'IDS / IPS',          icon: '🔍',  category: 'security' },
        'siem':        { name: 'SIEM',               icon: '📊',  category: 'security' },
        'cloud':       { name: 'Cloud Service',      icon: '☁️',  category: 'cloud' },
        'saas':        { name: 'SaaS Application',   icon: '🌐',  category: 'cloud' },
        'database':    { name: 'Database',           icon: '🗄️',  category: 'infrastructure' },
        'storage':     { name: 'Storage / NAS',      icon: '💾',  category: 'infrastructure' },
        'iot':         { name: 'IoT Device',         icon: '📟',  category: 'specialized' },
        'ot':          { name: 'OT / ICS',           icon: '⚙️',  category: 'specialized' },
        'other':       { name: 'Other',              icon: '📦',  category: 'other' }
    },

    // Diagram types
    DIAGRAM_TYPES: {
        'data-flow': { name: 'CUI Data Flow Diagram', description: 'Shows how CUI moves through systems' },
        'network': { name: 'Network Topology Diagram', description: 'Network architecture and security zones' },
        'system-boundary': { name: 'System Boundary Diagram', description: 'CMMC assessment scope boundaries' },
        'enclave': { name: 'Enclave Architecture', description: 'CUI enclave segmentation and controls' },
        'integration': { name: 'Application Integration', description: 'How applications exchange data' },
        'physical': { name: 'Physical Topology', description: 'Physical network layout and connections' }
    },

    // Supported import sources
    IMPORT_SOURCES: {
        'figma': { name: 'Figma', accept: '', isLink: true, description: 'Paste a Figma share link or embed URL' },
        'drawio': { name: 'Draw.io / diagrams.net', accept: '.drawio,.xml', isLink: false, description: 'Upload .drawio or .xml export' },
        'lucidchart': { name: 'LucidChart', accept: '', isLink: true, description: 'Paste a LucidChart share/embed link' },
        'visio': { name: 'Microsoft Visio', accept: '.vsd,.vsdx,.vsdm', isLink: false, description: 'Upload .vsdx or .vsd file' },
        'image': { name: 'Image File', accept: 'image/*', isLink: false, description: 'Upload PNG, JPG, SVG, or other image' },
        'pdf': { name: 'PDF Document', accept: '.pdf', isLink: false, description: 'Upload a PDF diagram' },
        'mermaid': { name: 'Mermaid.js', accept: '', isLink: false, description: 'Enter Mermaid.js diagram code' }
    },

    // Data
    data: null,

    // UI state
    currentView: 'applications', // applications | diagrams | scoping
    selectedAppId: null,
    selectedDiagramId: null,

    // =========================================================================
    // Initialization & Storage
    // =========================================================================

    init() {
        this.load();
        console.log('[DiagramHub] Initialized with', this.data.applications.length, 'applications,', this.data.diagrams.length, 'diagrams');
    },

    load() {
        try {
            const saved = localStorage.getItem(this.config.storageKey);
            this.data = saved ? JSON.parse(saved) : this.getDefaultData();
        } catch (e) {
            console.error('[DiagramHub] Error loading data:', e);
            this.data = this.getDefaultData();
        }
        // Ensure all arrays exist
        if (!this.data.applications) this.data.applications = [];
        if (!this.data.assets) this.data.assets = [];
        if (!this.data.diagrams) this.data.diagrams = [];
        if (!this.data.connections) this.data.connections = [];
        if (!this.data.zones) this.data.zones = [];
    },

    save() {
        try {
            localStorage.setItem(this.config.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('[DiagramHub] Error saving data:', e);
            if (e.name === 'QuotaExceededError') {
                alert('Storage quota exceeded. Consider removing some diagram files to free space.');
            }
        }
    },

    getDefaultData() {
        return {
            applications: [],
            assets: [],       // Generic assets (servers, devices, network gear, cloud, etc.)
            diagrams: [],
            connections: [],  // Links between applications/assets
            zones: [],        // Security zones / enclaves
            metadata: {
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                orgName: ''
            }
        };
    },

    // =========================================================================
    // Application Management
    // =========================================================================

    addApplication(appData) {
        const app = {
            id: 'app-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
            name: appData.name,
            description: appData.description || '',
            owner: appData.owner || '',
            team: appData.team || '',
            assetCategory: appData.assetCategory || 'cui',
            environment: appData.environment || 'production',
            cuiTypes: appData.cuiTypes || [],       // Types of CUI handled
            dataClassification: appData.dataClassification || 'CUI',
            externalConnections: appData.externalConnections || [],
            zone: appData.zone || '',
            tags: appData.tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.data.applications.push(app);
        this.data.metadata.lastModified = new Date().toISOString();
        this.save();
        return app;
    },

    updateApplication(appId, updates) {
        const app = this.data.applications.find(a => a.id === appId);
        if (!app) return null;
        Object.assign(app, updates, { updatedAt: new Date().toISOString() });
        this.data.metadata.lastModified = new Date().toISOString();
        this.save();
        return app;
    },

    removeApplication(appId) {
        this.data.applications = this.data.applications.filter(a => a.id !== appId);
        // Also remove associated diagrams
        this.data.diagrams = this.data.diagrams.filter(d => d.applicationId !== appId);
        this.data.connections = this.data.connections.filter(c => c.sourceAppId !== appId && c.targetAppId !== appId);
        this.data.metadata.lastModified = new Date().toISOString();
        this.save();
    },

    getApplication(appId) {
        return this.data.applications.find(a => a.id === appId) || null;
    },

    getApplicationDiagrams(appId) {
        return this.data.diagrams.filter(d => d.applicationId === appId || d.applicationId === 'global');
    },

    // =========================================================================
    // Asset Management (generic hardware/software/network assets)
    // =========================================================================

    addAsset(assetData) {
        const asset = {
            id: 'asset-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
            name: assetData.name,
            description: assetData.description || '',
            assetType: assetData.assetType || 'other',
            scopeCategory: assetData.scopeCategory || 'cui',
            hostname: assetData.hostname || '',
            ipAddress: assetData.ipAddress || '',
            location: assetData.location || '',
            owner: assetData.owner || '',
            quantity: assetData.quantity || 1,
            zone: assetData.zone || '',
            tags: assetData.tags || [],
            applicationId: assetData.applicationId || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.data.assets.push(asset);
        this.data.metadata.lastModified = new Date().toISOString();
        this.save();
        return asset;
    },

    updateAsset(assetId, updates) {
        const asset = this.data.assets.find(a => a.id === assetId);
        if (!asset) return null;
        Object.assign(asset, updates, { updatedAt: new Date().toISOString() });
        this.data.metadata.lastModified = new Date().toISOString();
        this.save();
        return asset;
    },

    removeAsset(assetId) {
        this.data.assets = this.data.assets.filter(a => a.id !== assetId);
        this.data.connections = this.data.connections.filter(c => c.sourceAssetId !== assetId && c.targetAssetId !== assetId);
        this.data.metadata.lastModified = new Date().toISOString();
        this.save();
    },

    getAsset(assetId) {
        return this.data.assets.find(a => a.id === assetId) || null;
    },

    // =========================================================================
    // Diagram Management
    // =========================================================================

    addDiagram(diagramData) {
        const diagram = {
            id: 'diag-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
            name: diagramData.name,
            description: diagramData.description || '',
            type: diagramData.type || 'data-flow',
            applicationId: diagramData.applicationId || 'global',
            source: diagramData.source || 'image',     // figma, drawio, lucidchart, visio, image, pdf, mermaid
            sourceUrl: diagramData.sourceUrl || '',     // For Figma/LucidChart links
            mermaidCode: diagramData.mermaidCode || '', // For Mermaid diagrams
            fileData: diagramData.fileData || null,     // Base64 file data
            fileName: diagramData.fileName || '',
            fileType: diagramData.fileType || '',
            fileSize: diagramData.fileSize || 0,
            version: diagramData.version || '1.0',
            assetCategories: diagramData.assetCategories || [],  // Which asset categories are shown
            scopedAssets: diagramData.scopedAssets || [],         // Specific asset IDs from OSC inventory
            annotations: diagramData.annotations || [],          // User annotations on the diagram
            cuiBoundary: diagramData.cuiBoundary || false,       // Whether CUI boundary is marked
            securityZones: diagramData.securityZones || [],      // Security zones depicted
            relatedControls: diagramData.relatedControls || [],  // NIST controls this diagram supports
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.data.diagrams.push(diagram);
        this.data.metadata.lastModified = new Date().toISOString();
        this.save();
        return diagram;
    },

    updateDiagram(diagramId, updates) {
        const diagram = this.data.diagrams.find(d => d.id === diagramId);
        if (!diagram) return null;
        Object.assign(diagram, updates, { updatedAt: new Date().toISOString() });
        this.data.metadata.lastModified = new Date().toISOString();
        this.save();
        return diagram;
    },

    removeDiagram(diagramId) {
        this.data.diagrams = this.data.diagrams.filter(d => d.id !== diagramId);
        this.data.metadata.lastModified = new Date().toISOString();
        this.save();
    },

    getDiagram(diagramId) {
        return this.data.diagrams.find(d => d.id === diagramId) || null;
    },

    // =========================================================================
    // Connection Management (app-to-app data flows)
    // =========================================================================

    addConnection(connData) {
        const conn = {
            id: 'conn-' + Date.now(),
            sourceAppId: connData.sourceAppId,
            targetAppId: connData.targetAppId,
            dataType: connData.dataType || 'CUI',
            protocol: connData.protocol || '',
            encrypted: connData.encrypted !== false,
            description: connData.description || '',
            direction: connData.direction || 'bidirectional', // unidirectional, bidirectional
            createdAt: new Date().toISOString()
        };
        this.data.connections.push(conn);
        this.save();
        return conn;
    },

    removeConnection(connId) {
        this.data.connections = this.data.connections.filter(c => c.id !== connId);
        this.save();
    },

    getAppConnections(appId) {
        return this.data.connections.filter(c => c.sourceAppId === appId || c.targetAppId === appId);
    },

    // =========================================================================
    // Security Zone Management
    // =========================================================================

    addZone(zoneData) {
        const zone = {
            id: 'zone-' + Date.now(),
            name: zoneData.name,
            description: zoneData.description || '',
            type: zoneData.type || 'enclave', // enclave, dmz, external, internal
            applicationIds: zoneData.applicationIds || [],
            color: zoneData.color || '#6c8aff',
            createdAt: new Date().toISOString()
        };
        this.data.zones.push(zone);
        this.save();
        return zone;
    },

    removeZone(zoneId) {
        this.data.zones = this.data.zones.filter(z => z.id !== zoneId);
        this.save();
    },

    // =========================================================================
    // Import Parsers
    // =========================================================================

    // Parse Draw.io XML file
    parseDrawioFile(xmlContent) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlContent, 'text/xml');
            const mxCells = doc.querySelectorAll('mxCell');
            const elements = [];

            mxCells.forEach(cell => {
                const value = cell.getAttribute('value') || '';
                const style = cell.getAttribute('style') || '';
                const vertex = cell.getAttribute('vertex');
                const edge = cell.getAttribute('edge');

                if (vertex === '1' && value) {
                    elements.push({
                        type: 'node',
                        label: value.replace(/<[^>]*>/g, ''), // Strip HTML
                        style: style,
                        isShape: true
                    });
                } else if (edge === '1') {
                    elements.push({
                        type: 'edge',
                        label: value.replace(/<[^>]*>/g, ''),
                        source: cell.getAttribute('source'),
                        target: cell.getAttribute('target')
                    });
                }
            });

            return {
                success: true,
                elementCount: elements.length,
                nodes: elements.filter(e => e.type === 'node').length,
                edges: elements.filter(e => e.type === 'edge').length,
                elements: elements
            };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    // Validate and normalize a Figma URL
    parseFigmaUrl(url) {
        const figmaPatterns = [
            /figma\.com\/file\/([a-zA-Z0-9]+)/,
            /figma\.com\/design\/([a-zA-Z0-9]+)/,
            /figma\.com\/proto\/([a-zA-Z0-9]+)/,
            /figma\.com\/board\/([a-zA-Z0-9]+)/
        ];

        for (const pattern of figmaPatterns) {
            const match = url.match(pattern);
            if (match) {
                return {
                    valid: true,
                    fileKey: match[1],
                    type: url.includes('/board/') ? 'figjam' : 'design',
                    embedUrl: `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`,
                    originalUrl: url
                };
            }
        }
        return { valid: false, error: 'Invalid Figma URL' };
    },

    // Validate and normalize a LucidChart URL
    parseLucidChartUrl(url) {
        const lucidPatterns = [
            /lucid\.app\/lucidchart\/([a-zA-Z0-9-]+)/,
            /lucidchart\.com\/documents\/([a-zA-Z0-9-]+)/,
            /lucid\.app\/documents\/([a-zA-Z0-9-]+)/
        ];

        for (const pattern of lucidPatterns) {
            const match = url.match(pattern);
            if (match) {
                return {
                    valid: true,
                    documentId: match[1],
                    embedUrl: `https://lucid.app/documents/embedded/${match[1]}`,
                    originalUrl: url
                };
            }
        }
        return { valid: false, error: 'Invalid LucidChart URL' };
    },

    // Handle file upload for any diagram source
    async handleFileUpload(file) {
        if (file.size > this.config.maxFileSize) {
            return { success: false, error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is ${this.config.maxFileSize / 1024 / 1024}MB.` };
        }

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = {
                    success: true,
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    fileData: e.target.result
                };

                // If it's a Draw.io XML, also parse it
                if (file.name.endsWith('.drawio') || file.name.endsWith('.xml')) {
                    // Read as text for parsing
                    const textReader = new FileReader();
                    textReader.onload = (te) => {
                        result.drawioData = this.parseDrawioFile(te.target.result);
                        resolve(result);
                    };
                    textReader.readAsText(file);
                } else {
                    resolve(result);
                }
            };
            reader.onerror = () => resolve({ success: false, error: 'Failed to read file' });
            reader.readAsDataURL(file);
        });
    },

    // =========================================================================
    // Statistics & Reporting
    // =========================================================================

    getStats() {
        const apps = this.data.applications;
        const diagrams = this.data.diagrams;
        const categoryCounts = {};

        Object.keys(this.ASSET_CATEGORIES).forEach(cat => { categoryCounts[cat] = 0; });
        apps.forEach(app => {
            if (categoryCounts[app.assetCategory] !== undefined) {
                categoryCounts[app.assetCategory]++;
            }
        });

        return {
            totalApplications: apps.length,
            totalDiagrams: diagrams.length,
            totalConnections: this.data.connections.length,
            totalZones: this.data.zones.length,
            categoryCounts: categoryCounts,
            diagramsByType: Object.keys(this.DIAGRAM_TYPES).reduce((acc, type) => {
                acc[type] = diagrams.filter(d => d.type === type).length;
                return acc;
            }, {}),
            diagramsBySrc: Object.keys(this.IMPORT_SOURCES).reduce((acc, src) => {
                acc[src] = diagrams.filter(d => d.source === src).length;
                return acc;
            }, {}),
            appsWithDiagrams: new Set(diagrams.map(d => d.applicationId)).size,
            appsWithoutDiagrams: apps.filter(a => !diagrams.some(d => d.applicationId === a.id)).length
        };
    },

    // =========================================================================
    // Rendering
    // =========================================================================

    render() {
        const container = document.getElementById('diagram-hub-content');
        if (!container) return;
        this.load();

        const stats = this.getStats();

        container.innerHTML = `
            <div class="dh-header">
                <div class="dh-header-left">
                    <h1>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue, #6c8aff)" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20"/><path d="M17 2v20"/><path d="M2 12h20"/><path d="M2 7h5"/><path d="M2 17h5"/><path d="M17 7h5"/><path d="M17 17h5"/></svg>
                        Diagram Hub
                    </h1>
                    <p class="dh-subtitle">Manage network diagrams, CUI data flows, and application scoping for CMMC assessment</p>
                </div>
                <div class="dh-header-actions">
                    <button class="dh-btn dh-btn-accent" id="dh-visualize-btn" title="Open Interactive Topology Diagram">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                        Visualize Topology
                    </button>
                    <button class="dh-btn dh-btn-primary" id="dh-add-app-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Application
                    </button>
                    <button class="dh-btn dh-btn-secondary" id="dh-add-diagram-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Upload Diagram
                    </button>
                </div>
            </div>

            <!-- Stats Overview -->
            <div class="dh-stats-row">
                <div class="dh-stat-card">
                    <div class="dh-stat-value">${stats.totalApplications}</div>
                    <div class="dh-stat-label">Applications</div>
                </div>
                <div class="dh-stat-card">
                    <div class="dh-stat-value">${(this.data.assets || []).length}</div>
                    <div class="dh-stat-label">Assets</div>
                </div>
                <div class="dh-stat-card">
                    <div class="dh-stat-value">${stats.totalDiagrams}</div>
                    <div class="dh-stat-label">Diagrams</div>
                </div>
                <div class="dh-stat-card">
                    <div class="dh-stat-value">${stats.totalConnections}</div>
                    <div class="dh-stat-label">Data Flows</div>
                </div>
                <div class="dh-stat-card">
                    <div class="dh-stat-value">${stats.totalZones}</div>
                    <div class="dh-stat-label">Security Zones</div>
                </div>
                ${Object.entries(this.ASSET_CATEGORIES).filter(([k]) => k !== 'oos').map(([key, cat]) => `
                    <div class="dh-stat-card dh-stat-cat" style="border-left: 3px solid ${cat.color};">
                        <div class="dh-stat-value">${stats.categoryCounts[key] || 0}</div>
                        <div class="dh-stat-label">${cat.name}</div>
                    </div>
                `).join('')}
            </div>

            <!-- View Tabs -->
            <div class="dh-tabs">
                <button class="dh-tab ${this.currentView === 'applications' ? 'active' : ''}" data-view="applications">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    Applications
                </button>
                <button class="dh-tab ${this.currentView === 'diagrams' ? 'active' : ''}" data-view="diagrams">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    All Diagrams
                </button>
                <button class="dh-tab ${this.currentView === 'scoping' ? 'active' : ''}" data-view="scoping">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                    Scope Overview
                </button>
                <button class="dh-tab ${this.currentView === 'assets' ? 'active' : ''}" data-view="assets">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
                    Assets
                </button>
                <button class="dh-tab ${this.currentView === 'connections' ? 'active' : ''}" data-view="connections">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    Data Flows
                </button>
            </div>

            <!-- Content Area -->
            <div class="dh-content" id="dh-content-area">
                ${this.renderCurrentView()}
            </div>
        `;

        this.bindEvents(container);
    },

    renderCurrentView() {
        switch (this.currentView) {
            case 'applications': return this.renderApplicationsView();
            case 'assets': return this.renderAssetsView();
            case 'diagrams': return this.renderDiagramsView();
            case 'scoping': return this.renderScopingView();
            case 'connections': return this.renderConnectionsView();
            default: return this.renderApplicationsView();
        }
    },

    // ---- Assets View ----
    renderAssetsView() {
        const assets = this.data.assets || [];
        if (assets.length === 0) {
            return `
                <div class="dh-empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
                    <h3>No Assets Added</h3>
                    <p>Add servers, workstations, network devices, cloud services, and other assets to map your CUI environment.</p>
                    <button class="dh-btn dh-btn-primary" id="dh-empty-add-asset">Add First Asset</button>
                </div>
            `;
        }

        // Group by category
        const grouped = {};
        assets.forEach(a => {
            const cat = a.scopeCategory || 'cui';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(a);
        });

        return `
            <div class="dh-asset-toolbar">
                <button class="dh-btn dh-btn-primary" id="dh-add-asset-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Asset
                </button>
            </div>
            <div class="dh-app-grid">
                ${assets.map(asset => {
                    const typeInfo = this.ASSET_TYPES[asset.assetType] || { name: asset.assetType, icon: '📦' };
                    const cat = this.ASSET_CATEGORIES[asset.scopeCategory] || this.ASSET_CATEGORIES.cui;
                    return `
                    <div class="dh-app-card" data-asset-id="${asset.id}">
                        <div class="dh-app-card-header" style="border-top: 3px solid ${cat.color};">
                            <div class="dh-app-name">${typeInfo.icon} ${this.esc(asset.name)}</div>
                            <span class="dh-app-cat-badge" style="background: ${cat.color}20; color: ${cat.color}; border: 1px solid ${cat.color}40;">${cat.name}</span>
                        </div>
                        <div class="dh-app-card-body">
                            <div class="dh-app-meta">
                                <span class="dh-meta-item"><strong>Type:</strong> ${typeInfo.name}</span>
                                ${asset.hostname ? `<span class="dh-meta-item"><strong>Host:</strong> ${this.esc(asset.hostname)}</span>` : ''}
                                ${asset.ipAddress ? `<span class="dh-meta-item"><strong>IP:</strong> ${this.esc(asset.ipAddress)}</span>` : ''}
                                ${asset.location ? `<span class="dh-meta-item"><strong>Location:</strong> ${this.esc(asset.location)}</span>` : ''}
                                ${asset.owner ? `<span class="dh-meta-item"><strong>Owner:</strong> ${this.esc(asset.owner)}</span>` : ''}
                                ${asset.quantity > 1 ? `<span class="dh-meta-item"><strong>Qty:</strong> ${asset.quantity}</span>` : ''}
                            </div>
                            ${asset.description ? `<p class="dh-app-desc">${this.esc(asset.description)}</p>` : ''}
                        </div>
                        <div class="dh-app-card-actions">
                            <button class="dh-btn-sm dh-btn-ghost dh-edit-asset" data-asset-id="${asset.id}">Edit</button>
                            <button class="dh-btn-sm dh-btn-danger dh-delete-asset" data-asset-id="${asset.id}">Delete</button>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    // ---- Applications View ----
    renderApplicationsView() {
        if (this.data.applications.length === 0) {
            return `
                <div class="dh-empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    <h3>No Applications Added</h3>
                    <p>Add your organization's applications and systems to begin mapping CUI data flows and network diagrams.</p>
                    <button class="dh-btn dh-btn-primary" id="dh-empty-add-app">Add First Application</button>
                </div>
            `;
        }

        return `
            <div class="dh-app-grid">
                ${this.data.applications.map(app => {
                    const diagCount = this.data.diagrams.filter(d => d.applicationId === app.id).length;
                    const connCount = this.getAppConnections(app.id).length;
                    const cat = this.ASSET_CATEGORIES[app.assetCategory] || this.ASSET_CATEGORIES.cui;
                    return `
                    <div class="dh-app-card" data-app-id="${app.id}">
                        <div class="dh-app-card-header" style="border-top: 3px solid ${cat.color};">
                            <div class="dh-app-name">${this.esc(app.name)}</div>
                            <span class="dh-app-cat-badge" style="background: ${cat.color}20; color: ${cat.color}; border: 1px solid ${cat.color}40;">${cat.name}</span>
                        </div>
                        <div class="dh-app-card-body">
                            ${app.description ? `<p class="dh-app-desc">${this.esc(app.description)}</p>` : ''}
                            <div class="dh-app-meta">
                                ${app.owner ? `<span class="dh-meta-item"><strong>Owner:</strong> ${this.esc(app.owner)}</span>` : ''}
                                ${app.team ? `<span class="dh-meta-item"><strong>Team:</strong> ${this.esc(app.team)}</span>` : ''}
                                ${app.environment ? `<span class="dh-meta-item"><strong>Env:</strong> ${app.environment}</span>` : ''}
                            </div>
                            <div class="dh-app-stats">
                                <span class="dh-app-stat">${diagCount} diagram${diagCount !== 1 ? 's' : ''}</span>
                                <span class="dh-app-stat">${connCount} connection${connCount !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                        <div class="dh-app-card-actions">
                            <button class="dh-btn-sm dh-btn-primary dh-upload-for-app" data-app-id="${app.id}">Upload Diagram</button>
                            <button class="dh-btn-sm dh-btn-ghost dh-view-app" data-app-id="${app.id}">View</button>
                            <button class="dh-btn-sm dh-btn-ghost dh-edit-app" data-app-id="${app.id}">Edit</button>
                            <button class="dh-btn-sm dh-btn-danger dh-delete-app" data-app-id="${app.id}">Delete</button>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    // ---- Diagrams View ----
    renderDiagramsView() {
        const diagrams = this.selectedAppId
            ? this.data.diagrams.filter(d => d.applicationId === this.selectedAppId)
            : this.data.diagrams;

        if (diagrams.length === 0) {
            return `
                <div class="dh-empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <h3>No Diagrams Yet</h3>
                    <p>Upload network diagrams, CUI data flow diagrams, or import from Figma, Draw.io, LucidChart, or Visio.</p>
                    <button class="dh-btn dh-btn-primary" id="dh-empty-add-diagram">Upload First Diagram</button>
                </div>
            `;
        }

        return `
            ${this.selectedAppId ? `
                <div class="dh-filter-bar">
                    <span>Showing diagrams for: <strong>${this.getApplication(this.selectedAppId)?.name || 'Unknown'}</strong></span>
                    <button class="dh-btn-sm dh-btn-ghost" id="dh-clear-app-filter">Show All</button>
                </div>
            ` : ''}
            <div class="dh-diagram-grid">
                ${diagrams.map(diag => this.renderDiagramCard(diag)).join('')}
            </div>
        `;
    },

    renderDiagramCard(diagram) {
        const app = this.getApplication(diagram.applicationId);
        const typeInfo = this.DIAGRAM_TYPES[diagram.type] || { name: diagram.type };
        const sourceInfo = this.IMPORT_SOURCES[diagram.source] || { name: diagram.source };
        const isImage = diagram.fileType?.startsWith('image/');
        const isEmbed = diagram.source === 'figma' || diagram.source === 'lucidchart';
        const isMermaid = diagram.source === 'mermaid';

        return `
            <div class="dh-diagram-card" data-diagram-id="${diagram.id}">
                <div class="dh-diagram-preview">
                    ${isImage && diagram.fileData ? `<img src="${diagram.fileData}" alt="${diagram.name}">` :
                      isEmbed && diagram.sourceUrl ? `<div class="dh-embed-badge"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg><span>${sourceInfo.name} Link</span></div>` :
                      isMermaid ? `<div class="dh-embed-badge"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg><span>Mermaid.js</span></div>` :
                      diagram.fileData ? `<div class="dh-embed-badge"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><span>${diagram.fileName || 'File'}</span></div>` :
                      `<div class="dh-embed-badge dh-no-file"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>No preview</span></div>`}
                </div>
                <div class="dh-diagram-info">
                    <div class="dh-diagram-name">${this.esc(diagram.name)}</div>
                    <div class="dh-diagram-meta-row">
                        <span class="dh-diagram-type-badge">${typeInfo.name}</span>
                        <span class="dh-diagram-source-badge">${sourceInfo.name}</span>
                        ${diagram.version ? `<span class="dh-diagram-version">v${diagram.version}</span>` : ''}
                    </div>
                    ${app ? `<div class="dh-diagram-app-link">App: ${this.esc(app.name)}</div>` : ''}
                    ${diagram.assetCategories.length > 0 ? `
                        <div class="dh-diagram-cats">
                            ${diagram.assetCategories.map(cat => {
                                const catInfo = this.ASSET_CATEGORIES[cat];
                                return catInfo ? `<span class="dh-cat-dot" style="background:${catInfo.color}" title="${catInfo.name}"></span>` : '';
                            }).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="dh-diagram-card-actions">
                    <button class="dh-btn-sm dh-btn-ghost dh-view-diagram" data-diagram-id="${diagram.id}" title="View">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button class="dh-btn-sm dh-btn-ghost dh-edit-diagram" data-diagram-id="${diagram.id}" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="dh-btn-sm dh-btn-danger dh-delete-diagram" data-diagram-id="${diagram.id}" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
        `;
    },

    // ---- Scoping View ----
    renderScopingView() {
        const apps = this.data.applications;
        if (apps.length === 0) {
            return `<div class="dh-empty-state"><h3>No Applications to Scope</h3><p>Add applications first to view the scoping overview.</p></div>`;
        }

        return `
            <div class="dh-scoping-overview">
                <h3>CMMC Assessment Scope</h3>
                <p class="dh-scoping-desc">Overview of all applications and their asset categorization per the CMMC Scoping Guide. Each application should have at least one network diagram and one CUI data flow diagram.</p>

                <div class="dh-scope-table-wrap">
                    <table class="dh-scope-table">
                        <thead>
                            <tr>
                                <th>Application / System</th>
                                <th>Asset Category</th>
                                <th>Owner / Team</th>
                                <th>Environment</th>
                                <th>Diagrams</th>
                                <th>Data Flows</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${apps.map(app => {
                                const cat = this.ASSET_CATEGORIES[app.assetCategory] || this.ASSET_CATEGORIES.cui;
                                const diagCount = this.data.diagrams.filter(d => d.applicationId === app.id).length;
                                const connCount = this.getAppConnections(app.id).length;
                                const hasDataFlow = this.data.diagrams.some(d => d.applicationId === app.id && d.type === 'data-flow');
                                const hasNetwork = this.data.diagrams.some(d => d.applicationId === app.id && d.type === 'network');
                                const isComplete = hasDataFlow && hasNetwork;
                                return `
                                <tr>
                                    <td><strong>${app.name}</strong></td>
                                    <td><span class="dh-cat-badge-sm" style="background:${cat.color}20;color:${cat.color};border:1px solid ${cat.color}40;">${cat.name}</span></td>
                                    <td>${app.owner || app.team || '-'}</td>
                                    <td>${app.environment || '-'}</td>
                                    <td>${diagCount}</td>
                                    <td>${connCount}</td>
                                    <td>
                                        ${isComplete ? '<span class="dh-status-complete">Complete</span>' :
                                          diagCount > 0 ? '<span class="dh-status-partial">Partial</span>' :
                                          '<span class="dh-status-missing">Missing</span>'}
                                        ${!hasDataFlow ? '<span class="dh-status-note">No data flow</span>' : ''}
                                        ${!hasNetwork ? '<span class="dh-status-note">No network diagram</span>' : ''}
                                    </td>
                                </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="dh-scope-legend">
                    <h4>Asset Categories</h4>
                    <div class="dh-legend-items">
                        ${Object.entries(this.ASSET_CATEGORIES).map(([key, cat]) => `
                            <div class="dh-legend-item">
                                <span class="dh-legend-dot" style="background:${cat.color}"></span>
                                <strong>${cat.name}</strong> — ${cat.description}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // ---- Connections / Data Flows View ----
    renderConnectionsView() {
        const connections = this.data.connections;

        return `
            <div class="dh-connections-view">
                <div class="dh-connections-header">
                    <h3>Application Data Flows</h3>
                    <button class="dh-btn dh-btn-primary" id="dh-add-connection-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Data Flow
                    </button>
                </div>

                ${connections.length === 0 ? `
                    <div class="dh-empty-state">
                        <p>No data flows defined between applications. Add connections to document how CUI moves between systems.</p>
                    </div>
                ` : `
                    <div class="dh-connections-list">
                        ${connections.map(conn => {
                            const srcApp = this.getApplication(conn.sourceAppId);
                            const tgtApp = this.getApplication(conn.targetAppId);
                            return `
                            <div class="dh-connection-row" data-conn-id="${conn.id}">
                                <div class="dh-conn-apps">
                                    <span class="dh-conn-app">${this.esc(srcApp?.name || 'Unknown')}</span>
                                    <span class="dh-conn-arrow">${conn.direction === 'bidirectional' ? '&#8596;' : '&#8594;'}</span>
                                    <span class="dh-conn-app">${this.esc(tgtApp?.name || 'Unknown')}</span>
                                </div>
                                <div class="dh-conn-details">
                                    <span class="dh-conn-data-type">${this.esc(conn.dataType)}</span>
                                    ${conn.protocol ? `<span class="dh-conn-protocol">${this.esc(conn.protocol)}</span>` : ''}
                                    <span class="dh-conn-encrypted ${conn.encrypted ? 'yes' : 'no'}">${conn.encrypted ? 'Encrypted' : 'Unencrypted'}</span>
                                </div>
                                ${conn.description ? `<div class="dh-conn-desc">${this.esc(conn.description)}</div>` : ''}
                                <button class="dh-btn-sm dh-btn-danger dh-delete-conn" data-conn-id="${conn.id}">Remove</button>
                            </div>
                            `;
                        }).join('')}
                    </div>
                `}
            </div>
        `;
    },

    // =========================================================================
    // Modals
    // =========================================================================

    showAddApplicationModal(editAppId) {
        const existing = editAppId ? this.getApplication(editAppId) : null;
        const title = existing ? 'Edit Application' : 'Add Application';

        const html = `
        <div class="dh-modal-overlay" id="dh-modal">
            <div class="dh-modal">
                <div class="dh-modal-header">
                    <h3>${title}</h3>
                    <button class="dh-modal-close" id="dh-modal-close">&times;</button>
                </div>
                <div class="dh-modal-body">
                    <div class="dh-form-group">
                        <label>Application / System Name *</label>
                        <input type="text" id="dh-f-name" value="${existing?.name || ''}" placeholder="e.g., ITAR Document Management System" required>
                    </div>
                    <div class="dh-form-group">
                        <label>Description</label>
                        <textarea id="dh-f-description" placeholder="What does this application do? What data does it handle?">${existing?.description || ''}</textarea>
                    </div>
                    <div class="dh-form-row">
                        <div class="dh-form-group">
                            <label>Asset Category *</label>
                            <select id="dh-f-assetCategory">
                                ${Object.entries(this.ASSET_CATEGORIES).map(([key, cat]) =>
                                    `<option value="${key}" ${existing?.assetCategory === key ? 'selected' : ''}>${cat.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="dh-form-group">
                            <label>Environment</label>
                            <select id="dh-f-environment">
                                <option value="production" ${existing?.environment === 'production' ? 'selected' : ''}>Production</option>
                                <option value="staging" ${existing?.environment === 'staging' ? 'selected' : ''}>Staging</option>
                                <option value="development" ${existing?.environment === 'development' ? 'selected' : ''}>Development</option>
                                <option value="dr" ${existing?.environment === 'dr' ? 'selected' : ''}>Disaster Recovery</option>
                            </select>
                        </div>
                    </div>
                    <div class="dh-form-row">
                        <div class="dh-form-group">
                            <label>Owner</label>
                            <input type="text" id="dh-f-owner" value="${existing?.owner || ''}" placeholder="System owner name">
                        </div>
                        <div class="dh-form-group">
                            <label>Team / Business Unit</label>
                            <input type="text" id="dh-f-team" value="${existing?.team || ''}" placeholder="e.g., Engineering, Finance">
                        </div>
                    </div>
                    <div class="dh-form-group">
                        <label>Data Classification</label>
                        <select id="dh-f-dataClassification">
                            <option value="CUI" ${existing?.dataClassification === 'CUI' ? 'selected' : ''}>CUI (Controlled Unclassified Information)</option>
                            <option value="CUI-SP" ${existing?.dataClassification === 'CUI-SP' ? 'selected' : ''}>CUI Specified</option>
                            <option value="FCI" ${existing?.dataClassification === 'FCI' ? 'selected' : ''}>FCI (Federal Contract Information)</option>
                            <option value="Public" ${existing?.dataClassification === 'Public' ? 'selected' : ''}>Public / Unclassified</option>
                        </select>
                    </div>
                    <div class="dh-form-group">
                        <label>Tags (comma-separated)</label>
                        <input type="text" id="dh-f-tags" value="${existing?.tags?.join(', ') || ''}" placeholder="e.g., cloud, saas, on-prem">
                    </div>
                </div>
                <div class="dh-modal-footer">
                    <button class="dh-btn dh-btn-ghost" id="dh-modal-cancel">Cancel</button>
                    <button class="dh-btn dh-btn-primary" id="dh-modal-save" data-edit-id="${editAppId || ''}">${existing ? 'Update' : 'Add Application'}</button>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', html);
        this.bindModalEvents('application');
    },

    showAddAssetModal(editAssetId) {
        const existing = editAssetId ? this.getAsset(editAssetId) : null;
        const title = existing ? 'Edit Asset' : 'Add Asset';

        const html = `
        <div class="dh-modal-overlay" id="dh-modal">
            <div class="dh-modal">
                <div class="dh-modal-header">
                    <h3>${title}</h3>
                    <button class="dh-modal-close" id="dh-modal-close">&times;</button>
                </div>
                <div class="dh-modal-body">
                    <div class="dh-form-group">
                        <label>Asset Name *</label>
                        <input type="text" id="dh-f-asset-name" value="${existing?.name || ''}" placeholder="e.g., Perimeter Firewall, File Server" required>
                    </div>
                    <div class="dh-form-row">
                        <div class="dh-form-group">
                            <label>Asset Type *</label>
                            <select id="dh-f-asset-type">
                                ${Object.entries(this.ASSET_TYPES).map(([key, at]) =>
                                    `<option value="${key}" ${existing?.assetType === key ? 'selected' : ''}>${at.icon} ${at.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="dh-form-group">
                            <label>Scope Category *</label>
                            <select id="dh-f-asset-scope">
                                ${Object.entries(this.ASSET_CATEGORIES).map(([key, cat]) =>
                                    `<option value="${key}" ${existing?.scopeCategory === key ? 'selected' : ''}>${cat.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="dh-form-row">
                        <div class="dh-form-group">
                            <label>Hostname</label>
                            <input type="text" id="dh-f-asset-hostname" value="${existing?.hostname || ''}" placeholder="e.g., fw-01.corp.local">
                        </div>
                        <div class="dh-form-group">
                            <label>IP Address</label>
                            <input type="text" id="dh-f-asset-ip" value="${existing?.ipAddress || ''}" placeholder="e.g., 10.0.1.1">
                        </div>
                    </div>
                    <div class="dh-form-row">
                        <div class="dh-form-group">
                            <label>Location</label>
                            <input type="text" id="dh-f-asset-location" value="${existing?.location || ''}" placeholder="e.g., HQ Server Room">
                        </div>
                        <div class="dh-form-group">
                            <label>Owner</label>
                            <input type="text" id="dh-f-asset-owner" value="${existing?.owner || ''}" placeholder="e.g., IT Security Team">
                        </div>
                    </div>
                    <div class="dh-form-row">
                        <div class="dh-form-group">
                            <label>Quantity</label>
                            <input type="number" id="dh-f-asset-qty" value="${existing?.quantity || 1}" min="1">
                        </div>
                        <div class="dh-form-group">
                            <label>Associated Application</label>
                            <select id="dh-f-asset-app">
                                <option value="">— None —</option>
                                ${this.data.applications.map(a =>
                                    `<option value="${a.id}" ${existing?.applicationId === a.id ? 'selected' : ''}>${a.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="dh-form-group">
                        <label>Description</label>
                        <textarea id="dh-f-asset-desc" placeholder="Brief description of this asset...">${existing?.description || ''}</textarea>
                    </div>
                    <div class="dh-form-group">
                        <label>Tags (comma-separated)</label>
                        <input type="text" id="dh-f-asset-tags" value="${existing?.tags?.join(', ') || ''}" placeholder="e.g., encrypted, backup, dmz">
                    </div>
                </div>
                <div class="dh-modal-footer">
                    <button class="dh-btn dh-btn-ghost" id="dh-modal-cancel">Cancel</button>
                    <button class="dh-btn dh-btn-primary" id="dh-modal-save-asset" data-edit-id="${editAssetId || ''}">${existing ? 'Update' : 'Add Asset'}</button>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', html);
        this.bindModalEvents('asset');
    },

    showAddDiagramModal(preselectedAppId) {
        const appOptions = this.data.applications.map(a =>
            `<option value="${a.id}" ${preselectedAppId === a.id ? 'selected' : ''}>${a.name}</option>`
        ).join('');

        const html = `
        <div class="dh-modal-overlay" id="dh-modal">
            <div class="dh-modal dh-modal-wide">
                <div class="dh-modal-header">
                    <h3>Upload / Import Diagram</h3>
                    <button class="dh-modal-close" id="dh-modal-close">&times;</button>
                </div>
                <div class="dh-modal-body">
                    <div class="dh-form-row">
                        <div class="dh-form-group">
                            <label>Diagram Name *</label>
                            <input type="text" id="dh-f-name" placeholder="e.g., CUI Data Flow - ITAR DMS">
                        </div>
                        <div class="dh-form-group">
                            <label>Diagram Type</label>
                            <select id="dh-f-type">
                                ${Object.entries(this.DIAGRAM_TYPES).map(([key, dt]) =>
                                    `<option value="${key}">${dt.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="dh-form-row">
                        <div class="dh-form-group">
                            <label>Application</label>
                            <select id="dh-f-applicationId">
                                <option value="global">Global / All Applications</option>
                                ${appOptions}
                            </select>
                        </div>
                        <div class="dh-form-group">
                            <label>Version</label>
                            <input type="text" id="dh-f-version" value="1.0">
                        </div>
                    </div>
                    <div class="dh-form-group">
                        <label>Description</label>
                        <textarea id="dh-f-description" placeholder="What does this diagram show?"></textarea>
                    </div>

                    <!-- Import Source Selection -->
                    <div class="dh-form-group">
                        <label>Import Source</label>
                        <div class="dh-source-grid">
                            ${Object.entries(this.IMPORT_SOURCES).map(([key, src]) => `
                                <button class="dh-source-btn ${key === 'image' ? 'active' : ''}" data-source="${key}">
                                    ${this.getSourceIcon(key)}
                                    <span>${src.name}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Dynamic import area -->
                    <div id="dh-import-area">
                        ${this.renderImportArea('image')}
                    </div>

                    <!-- Asset Categories -->
                    <div class="dh-form-group">
                        <label>Asset Categories Depicted</label>
                        <div class="dh-checkbox-group">
                            ${Object.entries(this.ASSET_CATEGORIES).map(([key, cat]) => `
                                <label class="dh-checkbox-label">
                                    <input type="checkbox" name="dh-asset-cats" value="${key}">
                                    <span class="dh-cat-dot" style="background:${cat.color}"></span>
                                    ${cat.name}
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Related Controls -->
                    <div class="dh-form-group">
                        <label>Related NIST Controls (comma-separated)</label>
                        <input type="text" id="dh-f-relatedControls" placeholder="e.g., 3.1.3, 3.13.1, 3.13.2">
                    </div>

                    <!-- Upload status -->
                    <div id="dh-upload-status" style="display:none"></div>
                </div>
                <div class="dh-modal-footer">
                    <button class="dh-btn dh-btn-ghost" id="dh-modal-cancel">Cancel</button>
                    <button class="dh-btn dh-btn-primary" id="dh-modal-save-diagram">Upload Diagram</button>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', html);
        this.bindDiagramModalEvents();
    },

    showAddConnectionModal() {
        if (this.data.applications.length < 2) {
            alert('You need at least 2 applications to create a data flow connection.');
            return;
        }

        const appOptions = this.data.applications.map(a =>
            `<option value="${a.id}">${a.name}</option>`
        ).join('');

        const html = `
        <div class="dh-modal-overlay" id="dh-modal">
            <div class="dh-modal">
                <div class="dh-modal-header">
                    <h3>Add Data Flow Connection</h3>
                    <button class="dh-modal-close" id="dh-modal-close">&times;</button>
                </div>
                <div class="dh-modal-body">
                    <div class="dh-form-row">
                        <div class="dh-form-group">
                            <label>Source Application *</label>
                            <select id="dh-f-sourceAppId">${appOptions}</select>
                        </div>
                        <div class="dh-form-group">
                            <label>Target Application *</label>
                            <select id="dh-f-targetAppId">${appOptions}</select>
                        </div>
                    </div>
                    <div class="dh-form-row">
                        <div class="dh-form-group">
                            <label>Data Type</label>
                            <select id="dh-f-dataType">
                                <option value="CUI">CUI</option>
                                <option value="CUI-SP">CUI Specified</option>
                                <option value="FCI">FCI</option>
                                <option value="Metadata">Metadata</option>
                                <option value="Auth">Authentication</option>
                                <option value="Logs">Logs / Audit</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="dh-form-group">
                            <label>Direction</label>
                            <select id="dh-f-direction">
                                <option value="bidirectional">Bidirectional</option>
                                <option value="unidirectional">Unidirectional (Source → Target)</option>
                            </select>
                        </div>
                    </div>
                    <div class="dh-form-row">
                        <div class="dh-form-group">
                            <label>Protocol</label>
                            <input type="text" id="dh-f-protocol" placeholder="e.g., HTTPS, TLS 1.3, SFTP, API">
                        </div>
                        <div class="dh-form-group">
                            <label>Encrypted?</label>
                            <select id="dh-f-encrypted">
                                <option value="true">Yes - Encrypted in Transit</option>
                                <option value="false">No - Unencrypted</option>
                            </select>
                        </div>
                    </div>
                    <div class="dh-form-group">
                        <label>Description</label>
                        <textarea id="dh-f-conn-description" placeholder="Describe the data flow..."></textarea>
                    </div>
                </div>
                <div class="dh-modal-footer">
                    <button class="dh-btn dh-btn-ghost" id="dh-modal-cancel">Cancel</button>
                    <button class="dh-btn dh-btn-primary" id="dh-modal-save-conn">Add Connection</button>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', html);
        this.bindConnectionModalEvents();
    },

    showDiagramViewer(diagramId) {
        const diagram = this.getDiagram(diagramId);
        if (!diagram) return;

        const isImage = diagram.fileType?.startsWith('image/');
        const isEmbed = diagram.source === 'figma' || diagram.source === 'lucidchart';
        const app = this.getApplication(diagram.applicationId);
        const typeInfo = this.DIAGRAM_TYPES[diagram.type] || { name: diagram.type };

        let contentHtml = '';
        if (isImage && diagram.fileData) {
            contentHtml = `<img src="${diagram.fileData}" alt="${diagram.name}" class="dh-viewer-img">`;
        } else if (isEmbed && diagram.sourceUrl) {
            const embedUrl = diagram.source === 'figma'
                ? this.parseFigmaUrl(diagram.sourceUrl).embedUrl
                : this.parseLucidChartUrl(diagram.sourceUrl).embedUrl;
            contentHtml = `<iframe src="${embedUrl}" class="dh-viewer-iframe" allowfullscreen></iframe>`;
        } else if (diagram.source === 'mermaid' && diagram.mermaidCode) {
            contentHtml = `<div class="dh-mermaid-preview"><pre><code>${diagram.mermaidCode}</code></pre><p class="dh-mermaid-note">Mermaid.js rendering requires a Mermaid renderer. Copy the code above to preview at <a href="https://mermaid.live" target="_blank" rel="noopener noreferrer">mermaid.live</a></p></div>`;
        } else if (diagram.fileData) {
            contentHtml = `<div class="dh-viewer-file"><p>File: ${diagram.fileName}</p><a href="${diagram.fileData}" download="${diagram.fileName}" class="dh-btn dh-btn-primary">Download File</a></div>`;
        } else {
            contentHtml = `<div class="dh-viewer-empty"><p>No file or link attached to this diagram.</p></div>`;
        }

        const html = `
        <div class="dh-modal-overlay" id="dh-modal">
            <div class="dh-modal dh-modal-viewer">
                <div class="dh-modal-header">
                    <h3>${diagram.name}</h3>
                    <div class="dh-viewer-meta">
                        <span class="dh-diagram-type-badge">${typeInfo.name}</span>
                        ${app ? `<span class="dh-diagram-app-link">${app.name}</span>` : ''}
                        ${diagram.version ? `<span class="dh-diagram-version">v${diagram.version}</span>` : ''}
                    </div>
                    <button class="dh-modal-close" id="dh-modal-close">&times;</button>
                </div>
                <div class="dh-modal-body dh-viewer-body">
                    ${contentHtml}
                </div>
                ${diagram.description ? `<div class="dh-viewer-desc">${this.esc(diagram.description)}</div>` : ''}
                <div class="dh-modal-footer">
                    ${diagram.sourceUrl ? `<a href="${this.esc(diagram.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="dh-btn dh-btn-ghost">Open Original</a>` : ''}
                    <button class="dh-btn dh-btn-ghost" id="dh-modal-close-btn">Close</button>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', html);
        document.getElementById('dh-modal-close').addEventListener('click', () => this.closeModal());
        document.getElementById('dh-modal-close-btn')?.addEventListener('click', () => this.closeModal());
        document.getElementById('dh-modal').addEventListener('click', (e) => {
            if (e.target.id === 'dh-modal') this.closeModal();
        });
    },

    renderImportArea(source) {
        const src = this.IMPORT_SOURCES[source];
        if (!src) return '';

        if (src.isLink) {
            return `
                <div class="dh-import-section">
                    <p class="dh-import-desc">${src.description}</p>
                    <input type="text" id="dh-f-sourceUrl" class="dh-import-url" placeholder="Paste ${src.name} URL here...">
                </div>
            `;
        }

        if (source === 'mermaid') {
            return `
                <div class="dh-import-section">
                    <p class="dh-import-desc">${src.description}</p>
                    <textarea id="dh-f-mermaidCode" class="dh-mermaid-input" rows="8" placeholder="graph LR\n    A[System A] -->|CUI| B[System B]\n    B --> C[Database]"></textarea>
                </div>
            `;
        }

        return `
            <div class="dh-import-section">
                <p class="dh-import-desc">${src.description}</p>
                <div class="dh-upload-area" id="dh-upload-area">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <p>Drop file here or click to browse</p>
                    <input type="file" id="dh-f-file" accept="${src.accept}" style="display:none">
                </div>
            </div>
        `;
    },

    getSourceIcon(source) {
        const icons = {
            figma: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5zM12 2h3.5a3.5 3.5 0 1 1 0 7H12V2zm0 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0zm-7 0A3.5 3.5 0 0 1 8.5 11H12v3.5a3.5 3.5 0 0 1-7 0zM5 12a3.5 3.5 0 0 1 3.5-3.5H12v7H8.5A3.5 3.5 0 0 1 5 12z"/></svg>',
            drawio: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
            lucidchart: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/></svg>',
            visio: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2l2 3 2-6 2 3h2"/></svg>',
            image: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
            pdf: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
            mermaid: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
        };
        return icons[source] || icons.image;
    },

    // =========================================================================
    // Event Binding
    // =========================================================================

    bindEvents(container) {
        // Tab switching
        container.querySelectorAll('.dh-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.currentView = tab.dataset.view;
                this.selectedAppId = null;
                this.render();
            });
        });

        // Add application
        container.querySelector('#dh-add-app-btn')?.addEventListener('click', () => this.showAddApplicationModal());
        container.querySelector('#dh-empty-add-app')?.addEventListener('click', () => this.showAddApplicationModal());

        // Visualize Topology
        container.querySelector('#dh-visualize-btn')?.addEventListener('click', () => {
            if (typeof DiagramVisualizer !== 'undefined') {
                DiagramVisualizer.open();
            } else {
                alert('Diagram Visualizer is not loaded.');
            }
        });

        // Add asset
        container.querySelector('#dh-add-asset-btn')?.addEventListener('click', () => this.showAddAssetModal());
        container.querySelector('#dh-empty-add-asset')?.addEventListener('click', () => this.showAddAssetModal());

        // Add diagram
        container.querySelector('#dh-add-diagram-btn')?.addEventListener('click', () => this.showAddDiagramModal());
        container.querySelector('#dh-empty-add-diagram')?.addEventListener('click', () => this.showAddDiagramModal());

        // Add connection
        container.querySelector('#dh-add-connection-btn')?.addEventListener('click', () => this.showAddConnectionModal());

        // Clear app filter
        container.querySelector('#dh-clear-app-filter')?.addEventListener('click', () => {
            this.selectedAppId = null;
            this.render();
        });

        // App card actions
        container.querySelectorAll('.dh-upload-for-app').forEach(btn => {
            btn.addEventListener('click', (e) => { e.stopPropagation(); this.showAddDiagramModal(btn.dataset.appId); });
        });
        container.querySelectorAll('.dh-view-app').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectedAppId = btn.dataset.appId;
                this.currentView = 'diagrams';
                this.render();
            });
        });
        container.querySelectorAll('.dh-edit-app').forEach(btn => {
            btn.addEventListener('click', (e) => { e.stopPropagation(); this.showAddApplicationModal(btn.dataset.appId); });
        });
        container.querySelectorAll('.dh-delete-app').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Delete this application and all its diagrams?')) {
                    this.removeApplication(btn.dataset.appId);
                    this.render();
                }
            });
        });

        // Diagram card actions
        container.querySelectorAll('.dh-view-diagram').forEach(btn => {
            btn.addEventListener('click', (e) => { e.stopPropagation(); this.showDiagramViewer(btn.dataset.diagramId); });
        });
        container.querySelectorAll('.dh-delete-diagram').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Delete this diagram?')) {
                    this.removeDiagram(btn.dataset.diagramId);
                    this.render();
                }
            });
        });

        // Connection actions
        container.querySelectorAll('.dh-delete-conn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Remove this data flow?')) {
                    this.removeConnection(btn.dataset.connId);
                    this.render();
                }
            });
        });

        // Asset card actions
        container.querySelectorAll('.dh-edit-asset').forEach(btn => {
            btn.addEventListener('click', (e) => { e.stopPropagation(); this.showAddAssetModal(btn.dataset.assetId); });
        });
        container.querySelectorAll('.dh-delete-asset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Delete this asset?')) {
                    this.removeAsset(btn.dataset.assetId);
                    this.render();
                }
            });
        });
    },

    closeModal() {
        document.getElementById('dh-modal')?.remove();
    },

    bindModalEvents(type) {
        document.getElementById('dh-modal-close')?.addEventListener('click', () => this.closeModal());
        document.getElementById('dh-modal-cancel')?.addEventListener('click', () => this.closeModal());
        document.getElementById('dh-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'dh-modal') this.closeModal();
        });

        if (type === 'application') {
            document.getElementById('dh-modal-save')?.addEventListener('click', () => {
                const editId = document.getElementById('dh-modal-save').dataset.editId;
                const appData = {
                    name: document.getElementById('dh-f-name')?.value?.trim(),
                    description: document.getElementById('dh-f-description')?.value?.trim(),
                    assetCategory: document.getElementById('dh-f-assetCategory')?.value,
                    environment: document.getElementById('dh-f-environment')?.value,
                    owner: document.getElementById('dh-f-owner')?.value?.trim(),
                    team: document.getElementById('dh-f-team')?.value?.trim(),
                    dataClassification: document.getElementById('dh-f-dataClassification')?.value,
                    tags: (document.getElementById('dh-f-tags')?.value || '').split(',').map(t => t.trim()).filter(Boolean)
                };

                if (!appData.name) { alert('Application name is required.'); return; }

                if (editId) {
                    this.updateApplication(editId, appData);
                } else {
                    this.addApplication(appData);
                }
                this.closeModal();
                this.render();
            });
        }

        if (type === 'asset') {
            document.getElementById('dh-modal-save-asset')?.addEventListener('click', () => {
                const editId = document.getElementById('dh-modal-save-asset').dataset.editId;
                const assetData = {
                    name: document.getElementById('dh-f-asset-name')?.value?.trim(),
                    assetType: document.getElementById('dh-f-asset-type')?.value,
                    scopeCategory: document.getElementById('dh-f-asset-scope')?.value,
                    hostname: document.getElementById('dh-f-asset-hostname')?.value?.trim(),
                    ipAddress: document.getElementById('dh-f-asset-ip')?.value?.trim(),
                    location: document.getElementById('dh-f-asset-location')?.value?.trim(),
                    owner: document.getElementById('dh-f-asset-owner')?.value?.trim(),
                    quantity: parseInt(document.getElementById('dh-f-asset-qty')?.value) || 1,
                    applicationId: document.getElementById('dh-f-asset-app')?.value || '',
                    description: document.getElementById('dh-f-asset-desc')?.value?.trim(),
                    tags: (document.getElementById('dh-f-asset-tags')?.value || '').split(',').map(t => t.trim()).filter(Boolean)
                };

                if (!assetData.name) { alert('Asset name is required.'); return; }

                if (editId) {
                    this.updateAsset(editId, assetData);
                } else {
                    this.addAsset(assetData);
                }
                this.closeModal();
                this.render();
            });
        }
    },

    bindDiagramModalEvents() {
        document.getElementById('dh-modal-close')?.addEventListener('click', () => this.closeModal());
        document.getElementById('dh-modal-cancel')?.addEventListener('click', () => this.closeModal());
        document.getElementById('dh-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'dh-modal') this.closeModal();
        });

        // Source selection
        let currentSource = 'image';
        document.querySelectorAll('.dh-source-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.dh-source-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentSource = btn.dataset.source;
                document.getElementById('dh-import-area').innerHTML = this.renderImportArea(currentSource);
                this.bindUploadAreaEvents();
            });
        });

        this.bindUploadAreaEvents();

        // Save diagram
        document.getElementById('dh-modal-save-diagram')?.addEventListener('click', async () => {
            const name = document.getElementById('dh-f-name')?.value?.trim();
            if (!name) { alert('Diagram name is required.'); return; }

            const diagramData = {
                name: name,
                description: document.getElementById('dh-f-description')?.value?.trim() || '',
                type: document.getElementById('dh-f-type')?.value || 'data-flow',
                applicationId: document.getElementById('dh-f-applicationId')?.value || 'global',
                version: document.getElementById('dh-f-version')?.value || '1.0',
                source: currentSource,
                sourceUrl: document.getElementById('dh-f-sourceUrl')?.value?.trim() || '',
                mermaidCode: document.getElementById('dh-f-mermaidCode')?.value || '',
                assetCategories: Array.from(document.querySelectorAll('input[name="dh-asset-cats"]:checked')).map(cb => cb.value),
                relatedControls: (document.getElementById('dh-f-relatedControls')?.value || '').split(',').map(c => c.trim()).filter(Boolean)
            };

            // Handle file upload
            const fileInput = document.getElementById('dh-f-file');
            if (fileInput?.files?.[0]) {
                const statusEl = document.getElementById('dh-upload-status');
                statusEl.style.display = '';
                statusEl.innerHTML = '<div class="dh-uploading">Uploading file...</div>';

                const result = await this.handleFileUpload(fileInput.files[0]);
                if (!result.success) {
                    statusEl.innerHTML = `<div class="dh-upload-error">${result.error}</div>`;
                    return;
                }
                diagramData.fileData = result.fileData;
                diagramData.fileName = result.fileName;
                diagramData.fileType = result.fileType;
                diagramData.fileSize = result.fileSize;
            }

            // Validate link sources
            if (currentSource === 'figma' && diagramData.sourceUrl) {
                const parsed = this.parseFigmaUrl(diagramData.sourceUrl);
                if (!parsed.valid) { alert('Invalid Figma URL. Please paste a valid Figma share link.'); return; }
            }
            if (currentSource === 'lucidchart' && diagramData.sourceUrl) {
                const parsed = this.parseLucidChartUrl(diagramData.sourceUrl);
                if (!parsed.valid) { alert('Invalid LucidChart URL.'); return; }
            }

            this.addDiagram(diagramData);
            this.closeModal();
            this.render();
        });
    },

    bindUploadAreaEvents() {
        const uploadArea = document.getElementById('dh-upload-area');
        const fileInput = document.getElementById('dh-f-file');
        if (!uploadArea || !fileInput) return;

        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', () => {
            if (fileInput.files[0]) {
                uploadArea.querySelector('p').textContent = fileInput.files[0].name;
            }
        });
        uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            if (e.dataTransfer.files[0]) {
                fileInput.files = e.dataTransfer.files;
                uploadArea.querySelector('p').textContent = e.dataTransfer.files[0].name;
            }
        });
    },

    bindConnectionModalEvents() {
        document.getElementById('dh-modal-close')?.addEventListener('click', () => this.closeModal());
        document.getElementById('dh-modal-cancel')?.addEventListener('click', () => this.closeModal());
        document.getElementById('dh-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'dh-modal') this.closeModal();
        });

        document.getElementById('dh-modal-save-conn')?.addEventListener('click', () => {
            const connData = {
                sourceAppId: document.getElementById('dh-f-sourceAppId')?.value,
                targetAppId: document.getElementById('dh-f-targetAppId')?.value,
                dataType: document.getElementById('dh-f-dataType')?.value || 'CUI',
                direction: document.getElementById('dh-f-direction')?.value || 'bidirectional',
                protocol: document.getElementById('dh-f-protocol')?.value?.trim() || '',
                encrypted: document.getElementById('dh-f-encrypted')?.value === 'true',
                description: document.getElementById('dh-f-conn-description')?.value?.trim() || ''
            };

            if (connData.sourceAppId === connData.targetAppId) {
                alert('Source and target applications must be different.');
                return;
            }

            this.addConnection(connData);
            this.closeModal();
            this.render();
        });
    }
};

// Initialize on load
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => DiagramHub.init());
    } else {
        DiagramHub.init();
    }
}

if (typeof window !== 'undefined') {
    window.DiagramHub = DiagramHub;
}
