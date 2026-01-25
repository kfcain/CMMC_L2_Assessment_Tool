// Crosswalk Visualizer - Control Mapping Visualization
// Provides table and interactive graph views for framework mappings

const CrosswalkVisualizer = {
    currentMode: 'table',
    filters: {
        family: 'all',
        baseline: 'all',
        search: ''
    },
    graph: null,
    nodes: [],
    edges: [],
    
    init() {
        this.populateFamilyFilter();
        this.bindEvents();
        this.renderTable();
    },
    
    bindEvents() {
        // View toggle
        document.querySelectorAll('.crosswalk-view-toggle .toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setMode(btn.dataset.mode);
            });
        });
        
        // Filters
        const familyFilter = document.getElementById('crosswalk-family-filter');
        const baselineFilter = document.getElementById('crosswalk-baseline-filter');
        const searchInput = document.getElementById('crosswalk-search');
        
        if (familyFilter) {
            familyFilter.addEventListener('change', (e) => {
                this.filters.family = e.target.value;
                this.render();
            });
        }
        
        if (baselineFilter) {
            baselineFilter.addEventListener('change', (e) => {
                this.filters.baseline = e.target.value;
                this.render();
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.render();
            });
        }
    },
    
    populateFamilyFilter() {
        const select = document.getElementById('crosswalk-family-filter');
        if (!select || typeof CONTROL_FAMILIES === 'undefined') return;
        
        CONTROL_FAMILIES.forEach(family => {
            const option = document.createElement('option');
            option.value = family.id;
            option.textContent = `${family.id} - ${family.name}`;
            select.appendChild(option);
        });
    },
    
    setMode(mode) {
        this.currentMode = mode;
        
        // Update toggle buttons
        document.querySelectorAll('.crosswalk-view-toggle .toggle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        // Show/hide views
        const tableView = document.getElementById('crosswalk-table-view');
        const graphView = document.getElementById('crosswalk-graph-view');
        
        if (tableView) tableView.style.display = mode === 'table' ? 'block' : 'none';
        if (graphView) graphView.style.display = mode === 'graph' ? 'block' : 'none';
        
        this.render();
    },
    
    render() {
        if (this.currentMode === 'table') {
            this.renderTable();
        } else {
            this.renderGraph();
        }
    },
    
    getMappingData() {
        if (typeof FRAMEWORK_MAPPINGS === 'undefined') return [];
        
        const data = [];
        
        Object.entries(FRAMEWORK_MAPPINGS).forEach(([controlId, mapping]) => {
            // Apply family filter
            if (this.filters.family !== 'all') {
                const familyPrefix = controlId.split('.')[0];
                const familyId = this.getFamilyIdFromControl(controlId);
                if (familyId !== this.filters.family) return;
            }
            
            // Apply baseline filter
            if (this.filters.baseline !== 'all') {
                const baselineControls = mapping.fedramp?.[this.filters.baseline];
                if (!baselineControls || baselineControls.length === 0) return;
            }
            
            // Apply search filter
            if (this.filters.search) {
                const searchStr = `${controlId} ${mapping.description || ''} ${mapping.nist80053?.join(' ') || ''}`.toLowerCase();
                if (!searchStr.includes(this.filters.search)) return;
            }
            
            data.push({
                controlId,
                ...mapping
            });
        });
        
        return data;
    },
    
    getFamilyIdFromControl(controlId) {
        const prefix = controlId.split('.')[0];
        const familyMap = {
            '3.1': 'AC', '3.2': 'AT', '3.3': 'AU', '3.4': 'CM',
            '3.5': 'IA', '3.6': 'IR', '3.7': 'MA', '3.8': 'MP',
            '3.9': 'PS', '3.10': 'PE', '3.11': 'RA', '3.12': 'CA',
            '3.13': 'SC', '3.14': 'SI'
        };
        return familyMap[prefix] || prefix;
    },
    
    renderTable() {
        const container = document.getElementById('crosswalk-table-view');
        if (!container) return;
        
        const data = this.getMappingData();
        
        if (data.length === 0) {
            container.innerHTML = `
                <div class="crosswalk-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <p>No mappings found matching your filters</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <table class="crosswalk-table">
                <thead>
                    <tr>
                        <th>NIST 800-171</th>
                        <th>Description</th>
                        <th>NIST 800-53</th>
                        <th>FedRAMP Low</th>
                        <th>FedRAMP Mod</th>
                        <th>FedRAMP High</th>
                        <th>CMMC</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        data.forEach(item => {
            const nist53Tags = (item.nist80053 || []).map(c => 
                `<span class="mapping-tag nist-53">${c}</span>`
            ).join('');
            
            const fedLowTags = (item.fedramp?.low || []).map(c => 
                `<span class="mapping-tag fedramp-low">${c}</span>`
            ).join('') || '<span class="mapping-tag">—</span>';
            
            const fedModTags = (item.fedramp?.moderate || []).map(c => 
                `<span class="mapping-tag fedramp-mod">${c}</span>`
            ).join('') || '<span class="mapping-tag">—</span>';
            
            const fedHighTags = (item.fedramp?.high || []).map(c => 
                `<span class="mapping-tag fedramp-high">${c}</span>`
            ).join('') || '<span class="mapping-tag">—</span>';
            
            const cmmcTag = item.cmmc ? 
                `<span class="mapping-tag cmmc">${item.cmmc.practice}</span>` : 
                '<span class="mapping-tag">—</span>';
            
            html += `
                <tr>
                    <td class="control-id">${item.controlId}</td>
                    <td class="control-desc">${item.description || ''}</td>
                    <td class="mapping-tags">${nist53Tags || '<span class="mapping-tag">—</span>'}</td>
                    <td class="mapping-tags">${fedLowTags}</td>
                    <td class="mapping-tags">${fedModTags}</td>
                    <td class="mapping-tags">${fedHighTags}</td>
                    <td class="mapping-tags">${cmmcTag}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    },
    
    renderGraph() {
        const container = document.getElementById('crosswalk-graph-view');
        const canvas = document.getElementById('crosswalk-canvas');
        if (!container || !canvas) return;
        
        const ctx = canvas.getContext('2d');
        const rect = container.getBoundingClientRect();
        
        // Set canvas size
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        const width = rect.width;
        const height = rect.height;
        
        // Build nodes and edges
        this.buildGraphData();
        
        // Simple force-directed layout
        this.layoutGraph(width, height);
        
        // Draw
        this.drawGraph(ctx, width, height);
        
        // Add legend
        this.addGraphLegend(container);
        
        // Add interactivity
        this.addGraphInteractivity(canvas, ctx, width, height);
    },
    
    buildGraphData() {
        const data = this.getMappingData();
        this.nodes = [];
        this.edges = [];
        
        const nodeMap = new Map();
        
        // Create nodes for each framework control
        data.forEach(item => {
            // NIST 800-171 node
            if (!nodeMap.has(item.controlId)) {
                nodeMap.set(item.controlId, {
                    id: item.controlId,
                    label: item.controlId,
                    type: 'nist-171',
                    description: item.description,
                    x: 0, y: 0, vx: 0, vy: 0
                });
            }
            
            // NIST 800-53 nodes
            (item.nist80053 || []).forEach(ctrl => {
                if (!nodeMap.has(ctrl)) {
                    nodeMap.set(ctrl, {
                        id: ctrl,
                        label: ctrl,
                        type: 'nist-53',
                        x: 0, y: 0, vx: 0, vy: 0
                    });
                }
                this.edges.push({ source: item.controlId, target: ctrl });
            });
            
            // CMMC node
            if (item.cmmc?.practice) {
                if (!nodeMap.has(item.cmmc.practice)) {
                    nodeMap.set(item.cmmc.practice, {
                        id: item.cmmc.practice,
                        label: item.cmmc.practice,
                        type: 'cmmc',
                        x: 0, y: 0, vx: 0, vy: 0
                    });
                }
                this.edges.push({ source: item.controlId, target: item.cmmc.practice });
            }
        });
        
        this.nodes = Array.from(nodeMap.values());
    },
    
    layoutGraph(width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Group nodes by type
        const nist171Nodes = this.nodes.filter(n => n.type === 'nist-171');
        const nist53Nodes = this.nodes.filter(n => n.type === 'nist-53');
        const cmmcNodes = this.nodes.filter(n => n.type === 'cmmc');
        
        // Position NIST 800-171 in center column
        const col1X = width * 0.2;
        nist171Nodes.forEach((node, i) => {
            node.x = col1X;
            node.y = 60 + (i * ((height - 120) / Math.max(1, nist171Nodes.length - 1) || 30));
        });
        
        // Position NIST 800-53 in middle column
        const col2X = width * 0.5;
        nist53Nodes.forEach((node, i) => {
            node.x = col2X;
            node.y = 60 + (i * ((height - 120) / Math.max(1, nist53Nodes.length - 1) || 30));
        });
        
        // Position CMMC in right column
        const col3X = width * 0.8;
        cmmcNodes.forEach((node, i) => {
            node.x = col3X;
            node.y = 60 + (i * ((height - 120) / Math.max(1, cmmcNodes.length - 1) || 30));
        });
    },
    
    drawGraph(ctx, width, height) {
        // Clear canvas
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim() || '#0d1117';
        ctx.fillRect(0, 0, width, height);
        
        // Draw column headers
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#8b949e';
        ctx.font = '600 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('NIST 800-171', width * 0.2, 30);
        ctx.fillText('NIST 800-53', width * 0.5, 30);
        ctx.fillText('CMMC L2', width * 0.8, 30);
        
        // Draw edges
        const nodeMap = new Map(this.nodes.map(n => [n.id, n]));
        
        this.edges.forEach(edge => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) return;
            
            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            
            // Curved line
            const cpX = (source.x + target.x) / 2;
            ctx.quadraticCurveTo(cpX, source.y, target.x, target.y);
            
            ctx.strokeStyle = 'rgba(139, 148, 158, 0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
        
        // Draw nodes
        const colors = {
            'nist-171': '#3b82f6',
            'nist-53': '#8b5cf6',
            'cmmc': '#f59e0b'
        };
        
        this.nodes.forEach(node => {
            // Node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = colors[node.type] || '#6b7280';
            ctx.fill();
            
            // Node label
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#c9d1d9';
            ctx.font = '500 10px "SF Mono", "Fira Code", monospace';
            ctx.textAlign = node.type === 'nist-171' ? 'right' : node.type === 'cmmc' ? 'left' : 'center';
            const labelX = node.type === 'nist-171' ? node.x - 12 : node.type === 'cmmc' ? node.x + 12 : node.x;
            const labelY = node.type === 'nist-53' ? node.y - 10 : node.y + 4;
            ctx.fillText(node.label, labelX, labelY);
        });
    },
    
    addGraphLegend(container) {
        // Remove existing legend
        const existing = container.querySelector('.graph-legend');
        if (existing) existing.remove();
        
        const legend = document.createElement('div');
        legend.className = 'graph-legend';
        legend.innerHTML = `
            <div class="graph-legend-item">
                <span class="legend-color nist-171"></span>
                <span>NIST 800-171</span>
            </div>
            <div class="graph-legend-item">
                <span class="legend-color nist-53"></span>
                <span>NIST 800-53</span>
            </div>
            <div class="graph-legend-item">
                <span class="legend-color cmmc"></span>
                <span>CMMC L2</span>
            </div>
        `;
        container.appendChild(legend);
    },
    
    addGraphInteractivity(canvas, ctx, width, height) {
        const tooltip = document.getElementById('graph-tooltip');
        if (!tooltip) return;
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Find hovered node
            const hovered = this.nodes.find(node => {
                const dx = node.x - x;
                const dy = node.y - y;
                return Math.sqrt(dx * dx + dy * dy) < 10;
            });
            
            if (hovered) {
                tooltip.innerHTML = `
                    <div class="tooltip-title">${hovered.label}</div>
                    ${hovered.description ? `<div class="tooltip-desc">${hovered.description}</div>` : ''}
                    <div class="tooltip-mappings">
                        <span class="mapping-tag ${hovered.type}">${hovered.type.replace('-', ' ').toUpperCase()}</span>
                    </div>
                `;
                tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
                tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
                tooltip.classList.add('visible');
                canvas.style.cursor = 'pointer';
            } else {
                tooltip.classList.remove('visible');
                canvas.style.cursor = 'default';
            }
        });
        
        canvas.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    }
};

// Initialize when crosswalk view is shown
document.addEventListener('DOMContentLoaded', () => {
    // Will be initialized when view is activated
});
