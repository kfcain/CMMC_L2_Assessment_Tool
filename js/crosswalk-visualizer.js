// Crosswalk Visualizer - Control Mapping Visualization
// Provides table and interactive graph views for framework mappings

const CrosswalkVisualizer = {
    currentMode: 'table',
    filters: {
        family: 'all',
        baseline: 'all',
        search: ''
    },
    selectedControl: null,
    nodes: [],
    edges: [],
    animationId: null,
    isAnimating: false,
    
    // Physics settings for springy animation
    physics: {
        springStrength: 0.08,
        damping: 0.85,
        repulsion: 800,
        centerPull: 0.02
    },
    
    init() {
        this.populateFamilyFilter();
        this.populateControlSelector();
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
        
        // Control selector for graph view
        const controlSelector = document.getElementById('graph-control-selector');
        if (controlSelector) {
            controlSelector.addEventListener('change', (e) => {
                this.selectedControl = e.target.value;
                if (this.currentMode === 'graph') {
                    this.renderGraph();
                }
            });
        }
    },
    
    populateControlSelector() {
        const select = document.getElementById('graph-control-selector');
        if (!select || typeof FEDRAMP_20X_KSI === 'undefined') return;
        
        select.innerHTML = '';
        
        const ksiIds = Object.keys(FEDRAMP_20X_KSI.indicators || {});
        
        if (ksiIds.length > 0 && !this.selectedControl) {
            this.selectedControl = ksiIds[0];
        }
        
        // Group by family
        const families = {};
        ksiIds.forEach(id => {
            const ksi = FEDRAMP_20X_KSI.indicators[id];
            if (!families[ksi.family]) families[ksi.family] = [];
            families[ksi.family].push({ id, ...ksi });
        });
        
        Object.entries(families).forEach(([familyId, ksis]) => {
            const group = document.createElement('optgroup');
            group.label = `${familyId} — ${FEDRAMP_20X_KSI.families[familyId]?.name || familyId}`;
            ksis.forEach(ksi => {
                const option = document.createElement('option');
                option.value = ksi.id;
                option.textContent = `${ksi.id} - ${ksi.title}`;
                group.appendChild(option);
            });
            select.appendChild(group);
        });
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
    
    // Build reverse mapping: KSI → 800-53 controls
    buildKsiTo80053Map() {
        if (typeof FEDRAMP_20X_KSI === 'undefined') return {};
        const map = {};
        Object.entries(FEDRAMP_20X_KSI.nist80053ToKSI || {}).forEach(([ctrl, ksis]) => {
            ksis.forEach(ksi => {
                if (!map[ksi]) map[ksi] = [];
                if (!map[ksi].includes(ctrl)) map[ksi].push(ctrl);
            });
        });
        return map;
    },
    
    // Build mapping: 800-53 → 171/CMMC controls
    build80053To171Map() {
        if (typeof FRAMEWORK_MAPPINGS === 'undefined') return {};
        const map = {};
        Object.entries(FRAMEWORK_MAPPINGS).forEach(([controlId, mapping]) => {
            if (controlId.startsWith('_')) return;
            (mapping.nist80053 || []).forEach(ctrl => {
                const baseCtrl = ctrl.split('(')[0];
                if (!map[baseCtrl]) map[baseCtrl] = [];
                map[baseCtrl].push({
                    id: controlId,
                    cmmc: mapping.cmmc,
                    description: mapping.description
                });
            });
        });
        return map;
    },
    
    getKsiData() {
        if (typeof FEDRAMP_20X_KSI === 'undefined') return { families: {}, indicators: [] };
        
        const ksiTo80053 = this.buildKsiTo80053Map();
        const ctrl80053To171 = this.build80053To171Map();
        
        // Group KSIs by family
        const familyGroups = {};
        
        Object.entries(FEDRAMP_20X_KSI.indicators || {}).forEach(([ksiId, ksi]) => {
            const family = ksi.family;
            if (!familyGroups[family]) {
                familyGroups[family] = {
                    ...FEDRAMP_20X_KSI.families[family],
                    indicators: []
                };
            }
            
            // Apply baseline filter
            if (this.filters.baseline !== 'all') {
                if (this.filters.baseline === 'low' && !ksi.low) return;
                if (this.filters.baseline === 'moderate' && !ksi.moderate) return;
                if (this.filters.baseline === 'moderate-only' && (ksi.low || !ksi.moderate)) return;
            }
            
            // Get 800-53 controls for this KSI
            const nist80053Controls = ksiTo80053[ksiId] || [];
            
            // Get related 171/CMMC controls
            const related171 = [];
            nist80053Controls.forEach(ctrl => {
                const baseCtrl = ctrl.split('.')[0];
                (ctrl80053To171[baseCtrl] || []).forEach(m => {
                    if (!related171.find(r => r.id === m.id)) {
                        related171.push(m);
                    }
                });
                (ctrl80053To171[ctrl] || []).forEach(m => {
                    if (!related171.find(r => r.id === m.id)) {
                        related171.push(m);
                    }
                });
            });
            
            // Apply search filter
            if (this.filters.search) {
                const searchStr = `${ksiId} ${ksi.title} ${ksi.description} ${nist80053Controls.join(' ')}`.toLowerCase();
                if (!searchStr.includes(this.filters.search)) return;
            }
            
            // Apply family filter (KSI family, not 171 family)
            if (this.filters.family !== 'all' && family !== this.filters.family) return;
            
            familyGroups[family].indicators.push({
                id: ksiId,
                ...ksi,
                nist80053: nist80053Controls,
                related171
            });
        });
        
        return familyGroups;
    },
    
    renderTable() {
        const container = document.getElementById('crosswalk-table-view');
        if (!container) return;
        
        const familyGroups = this.getKsiData();
        const familyOrder = ['AFR', 'CED', 'CMT', 'CNA', 'IAM', 'INR', 'MLA', 'PIY', 'RPL', 'SVC', 'TPR'];
        
        // Count total indicators
        let totalIndicators = 0;
        familyOrder.forEach(fam => {
            if (familyGroups[fam]) totalIndicators += familyGroups[fam].indicators.length;
        });
        
        if (totalIndicators === 0) {
            container.innerHTML = `
                <div class="crosswalk-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <p>No KSIs found matching your filters</p>
                </div>
            `;
            return;
        }
        
        let html = '<div class="ksi-families">';
        
        familyOrder.forEach(familyId => {
            const family = familyGroups[familyId];
            if (!family || family.indicators.length === 0) return;
            
            html += `
                <div class="ksi-family-section">
                    <div class="family-header">
                        <span class="family-code">${familyId}</span>
                        <span class="family-name">${family.name}</span>
                        <span class="family-count">${family.indicators.length} indicators</span>
                    </div>
                    <div class="family-indicators">
            `;
            
            family.indicators.forEach(ksi => {
                const urlId = ksi.id.toLowerCase().replace(/-0+(\d)/g, '-$1');
                const isLow = ksi.low ? '<span class="ksi-level ksi-low">Low</span>' : '';
                const isMod = ksi.moderate ? '<span class="ksi-level ksi-moderate">Moderate</span>' : '';
                
                // Build 800-53 control links
                const nist53Links = (ksi.nist80053 || []).map(c => {
                    const ctrlUrlId = c.toLowerCase().replace(/\./g, '-');
                    return `<a href="https://www.myctrl.tools/frameworks/nist-800-53-r5/${ctrlUrlId}" target="_blank" rel="noopener" class="mapping-link nist-53">${c}</a>`;
                }).join('');
                
                // Build related 171/CMMC info
                const related171Html = ksi.related171.length > 0 ? `
                    <div class="related-171">
                        <span class="related-label">Related CMMC/171:</span>
                        ${ksi.related171.slice(0, 5).map(r => `<span class="related-ctrl">${r.id}${r.cmmc ? ` (${r.cmmc.practice})` : ''}</span>`).join('')}
                        ${ksi.related171.length > 5 ? `<span class="related-more">+${ksi.related171.length - 5} more</span>` : ''}
                    </div>
                ` : '';
                
                html += `
                    <div class="ksi-card">
                        <div class="ksi-card-header">
                            <a href="https://www.myctrl.tools/frameworks/fedramp-20x-ksi/${urlId}" target="_blank" rel="noopener" class="ksi-id">${ksi.id}</a>
                            <span class="ksi-title">${ksi.title}</span>
                            <div class="ksi-levels">${isLow}${isMod}</div>
                        </div>
                        <p class="ksi-desc">${ksi.description}</p>
                        
                        <div class="ksi-mappings">
                            <div class="mapping-section">
                                <span class="mapping-label">NIST 800-53 / FedRAMP Rev5:</span>
                                <div class="mapping-links">${nist53Links || '<span class="no-mapping">No mappings</span>'}</div>
                            </div>
                            ${related171Html}
                        </div>
                    </div>
                `;
            });
            
            html += '</div></div>';
        });
        
        html += '</div>';
        container.innerHTML = html;
    },
    
    renderGraph() {
        const container = document.getElementById('crosswalk-graph-view');
        const canvas = document.getElementById('crosswalk-canvas');
        if (!container || !canvas) return;
        
        // Stop any existing animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Show control selector
        const selectorContainer = document.getElementById('graph-selector-container');
        if (selectorContainer) selectorContainer.style.display = 'flex';
        
        const ctx = canvas.getContext('2d');
        const rect = container.getBoundingClientRect();
        
        // Set canvas size
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        this.canvasWidth = rect.width;
        this.canvasHeight = rect.height;
        this.ctx = ctx;
        
        // Build hub-and-spoke for selected control
        this.buildHubSpokeData();
        
        // Initialize positions with physics
        this.initializePhysics(rect.width, rect.height);
        
        // Add legend
        this.addGraphLegend(container);
        
        // Add interactivity
        this.addGraphInteractivity(canvas, ctx, rect.width, rect.height);
        
        // Start animation loop
        this.isAnimating = true;
        this.animate();
    },
    
    initializePhysics(width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Initialize hub at center
        const hub = this.nodes.find(n => n.isHub);
        if (hub) {
            hub.x = centerX;
            hub.y = centerY;
            hub.targetX = centerX;
            hub.targetY = centerY;
            hub.vx = 0;
            hub.vy = 0;
        }
        
        // Initialize spokes with random positions and target positions
        const radius = Math.min(width, height) * 0.35;
        const spokes = this.nodes.filter(n => !n.isHub);
        const nist53Spokes = spokes.filter(n => n.type === 'nist-53');
        const cmmcSpokes = spokes.filter(n => n.type === 'cmmc');
        
        // Set target positions in arcs - NIST 800-53 top arc, CMMC/171 bottom arc
        this.setTargetPositionsInArc(nist53Spokes, centerX, centerY, radius, -Math.PI * 0.85, -Math.PI * 0.15);
        this.setTargetPositionsInArc(cmmcSpokes, centerX, centerY, radius * 0.8, Math.PI * 0.15, Math.PI * 0.85);
        
        // Start spokes from center with random offset for springy effect
        spokes.forEach(node => {
            node.x = centerX + (Math.random() - 0.5) * 50;
            node.y = centerY + (Math.random() - 0.5) * 50;
            node.vx = 0;
            node.vy = 0;
        });
    },
    
    setTargetPositionsInArc(nodes, cx, cy, radius, startAngle, endAngle) {
        if (nodes.length === 0) return;
        
        const angleStep = (endAngle - startAngle) / Math.max(1, nodes.length - 1);
        
        nodes.forEach((node, i) => {
            const angle = nodes.length === 1 ? (startAngle + endAngle) / 2 : startAngle + i * angleStep;
            node.targetX = cx + Math.cos(angle) * radius;
            node.targetY = cy + Math.sin(angle) * radius;
        });
    },
    
    animate() {
        if (!this.isAnimating) return;
        
        const { springStrength, damping } = this.physics;
        let totalMovement = 0;
        
        // Apply spring forces to move nodes toward targets
        this.nodes.forEach(node => {
            if (node.isHub) return; // Hub stays fixed
            
            // Spring force toward target
            const dx = node.targetX - node.x;
            const dy = node.targetY - node.y;
            
            node.vx += dx * springStrength;
            node.vy += dy * springStrength;
            
            // Apply damping
            node.vx *= damping;
            node.vy *= damping;
            
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            
            totalMovement += Math.abs(node.vx) + Math.abs(node.vy);
        });
        
        // Draw current state
        this.drawHubSpoke(this.ctx, this.canvasWidth, this.canvasHeight);
        
        // Continue animating if nodes are still moving significantly
        if (totalMovement > 0.1) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.isAnimating = false;
        }
    },
    
    buildHubSpokeData() {
        if (!this.selectedControl || typeof FEDRAMP_20X_KSI === 'undefined') {
            this.nodes = [];
            this.edges = [];
            return;
        }
        
        const ksi = FEDRAMP_20X_KSI.indicators[this.selectedControl];
        if (!ksi) {
            this.nodes = [];
            this.edges = [];
            return;
        }
        
        this.nodes = [];
        this.edges = [];
        
        // Build reverse mapping: KSI → 800-53
        const ksiTo80053 = this.buildKsiTo80053Map();
        const nist80053Controls = ksiTo80053[this.selectedControl] || [];
        
        // Build 800-53 → 171 mapping
        const ctrl80053To171 = this.build80053To171Map();
        
        // Center hub node - KSI
        const levelBadge = ksi.low && ksi.moderate ? 'Low + Moderate' : (ksi.low ? 'Low' : 'Moderate');
        this.nodes.push({
            id: this.selectedControl,
            label: this.selectedControl,
            type: 'fedramp-20x',
            description: ksi.title,
            fullDesc: ksi.description,
            level: levelBadge,
            isHub: true,
            x: 0, y: 0
        });
        
        // NIST 800-53 spoke nodes
        nist80053Controls.forEach(ctrl => {
            this.nodes.push({
                id: ctrl,
                label: ctrl,
                type: 'nist-53',
                x: 0, y: 0
            });
            this.edges.push({ source: this.selectedControl, target: ctrl, type: 'nist-53' });
        });
        
        // Related 171/CMMC controls (secondary spokes)
        const related171 = new Set();
        nist80053Controls.forEach(ctrl => {
            const baseCtrl = ctrl.split('.')[0];
            (ctrl80053To171[baseCtrl] || []).forEach(m => related171.add(JSON.stringify(m)));
            (ctrl80053To171[ctrl] || []).forEach(m => related171.add(JSON.stringify(m)));
        });
        
        Array.from(related171).slice(0, 8).forEach(mStr => {
            const m = JSON.parse(mStr);
            const label = m.cmmc?.practice || m.id;
            if (!this.nodes.find(n => n.id === label)) {
                this.nodes.push({
                    id: label,
                    label: label,
                    type: 'cmmc',
                    description: m.description,
                    x: 0, y: 0
                });
                this.edges.push({ source: this.selectedControl, target: label, type: 'cmmc' });
            }
        });
    },
    
    layoutHubSpoke(width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.35;
        
        // Position hub in center
        const hub = this.nodes.find(n => n.isHub);
        if (hub) {
            hub.x = centerX;
            hub.y = centerY;
        }
        
        // Group spokes by type
        const spokes = this.nodes.filter(n => !n.isHub);
        const nist53Spokes = spokes.filter(n => n.type === 'nist-53');
        const fedSpokes = spokes.filter(n => n.type === 'fedramp');
        const cmmcSpokes = spokes.filter(n => n.type === 'cmmc');
        
        // Position spokes in sectors around the hub
        // NIST 800-53: top-left quadrant
        this.positionSpokesInArc(nist53Spokes, centerX, centerY, radius, -Math.PI * 0.75, -Math.PI * 0.25);
        
        // FedRAMP: top-right quadrant
        this.positionSpokesInArc(fedSpokes, centerX, centerY, radius, -Math.PI * 0.25, Math.PI * 0.25);
        
        // CMMC: bottom quadrant
        this.positionSpokesInArc(cmmcSpokes, centerX, centerY, radius, Math.PI * 0.4, Math.PI * 0.6);
    },
    
    positionSpokesInArc(nodes, cx, cy, radius, startAngle, endAngle) {
        if (nodes.length === 0) return;
        
        const angleStep = (endAngle - startAngle) / Math.max(1, nodes.length - 1);
        
        nodes.forEach((node, i) => {
            const angle = nodes.length === 1 ? (startAngle + endAngle) / 2 : startAngle + i * angleStep;
            node.x = cx + Math.cos(angle) * radius;
            node.y = cy + Math.sin(angle) * radius;
        });
    },
    
    drawHubSpoke(ctx, width, height) {
        const styles = getComputedStyle(document.documentElement);
        
        // Clear canvas
        ctx.fillStyle = styles.getPropertyValue('--bg-primary').trim() || '#0d1117';
        ctx.fillRect(0, 0, width, height);
        
        const colors = {
            'nist-171': '#3b82f6',
            'nist-53': '#8b5cf6',
            'fedramp-20x': '#06b6d4',
            'cmmc': '#f59e0b'
        };
        
        // Draw edges first
        const nodeMap = new Map(this.nodes.map(n => [n.id, n]));
        
        this.edges.forEach(edge => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) return;
            
            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = colors[edge.type] || 'rgba(139, 148, 158, 0.4)';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.4;
            ctx.stroke();
            ctx.globalAlpha = 1;
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            const nodeRadius = node.isHub ? 24 : 10;
            
            // Node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = colors[node.type] || '#6b7280';
            ctx.fill();
            
            // Hub gets a border
            if (node.isHub) {
                ctx.strokeStyle = styles.getPropertyValue('--bg-primary').trim() || '#0d1117';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
            
            // Node label
            ctx.fillStyle = node.isHub ? '#ffffff' : (styles.getPropertyValue('--text-primary').trim() || '#e6edf3');
            ctx.font = node.isHub ? 'bold 12px "SF Mono", monospace' : '500 11px "SF Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            if (node.isHub) {
                ctx.fillText(node.label, node.x, node.y);
            } else {
                // Position label outside the node
                const angle = Math.atan2(node.y - height/2, node.x - width/2);
                const labelDist = nodeRadius + 8;
                const labelX = node.x + Math.cos(angle) * labelDist;
                const labelY = node.y + Math.sin(angle) * labelDist;
                ctx.textAlign = Math.abs(angle) > Math.PI / 2 ? 'right' : 'left';
                ctx.fillText(node.label, labelX, labelY);
            }
        });
        
        // Draw description below hub
        const hub = this.nodes.find(n => n.isHub);
        if (hub?.description) {
            ctx.fillStyle = styles.getPropertyValue('--text-muted').trim() || '#8b949e';
            ctx.font = '400 12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            
            // Word wrap description
            const maxWidth = width * 0.6;
            const words = hub.description.split(' ');
            let line = '';
            let y = hub.y + 40;
            
            words.forEach(word => {
                const testLine = line + word + ' ';
                if (ctx.measureText(testLine).width > maxWidth && line) {
                    ctx.fillText(line.trim(), hub.x, y);
                    line = word + ' ';
                    y += 18;
                } else {
                    line = testLine;
                }
            });
            ctx.fillText(line.trim(), hub.x, y);
        }
    },
    
    addGraphLegend(container) {
        // Remove existing legend
        const existing = container.querySelector('.graph-legend');
        if (existing) existing.remove();
        
        const legend = document.createElement('div');
        legend.className = 'graph-legend';
        legend.innerHTML = `
            <div class="graph-legend-item">
                <span class="legend-color fedramp-20x"></span>
                <span>FedRAMP 20x KSI (Hub)</span>
            </div>
            <div class="graph-legend-item">
                <span class="legend-color nist-53"></span>
                <span>NIST 800-53 / FedRAMP Rev5</span>
            </div>
            <div class="graph-legend-item">
                <span class="legend-color cmmc"></span>
                <span>Related CMMC/171</span>
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
    },
    
    // Export FedRAMP 20x KSI as JSON
    exportKSIJSON() {
        if (typeof FEDRAMP_20X_KSI === 'undefined') {
            console.error('FedRAMP 20x KSI data not loaded');
            return;
        }
        
        const exportData = {
            metadata: {
                frameworkId: "fedramp-20x-ksi",
                frameworkName: "FedRAMP 20x KSI",
                version: "Phase 2",
                exportDate: new Date().toISOString(),
                totalControls: Object.keys(FEDRAMP_20X_KSI.indicators || {}).length,
                license: "public-domain",
                source: "https://www.fedramp.gov/20x/"
            },
            controls: Object.entries(FEDRAMP_20X_KSI.indicators || {}).map(([id, ksi]) => ({
                control_id: id,
                title: ksi.title,
                family: ksi.family,
                description: ksi.description,
                impact_low: ksi.impactLevels?.includes('Low') || ksi.impactLevels?.includes('low') || false,
                impact_moderate: ksi.impactLevels?.includes('Moderate') || ksi.impactLevels?.includes('moderate') || true,
                related_controls: ksi.related53 || [],
                references: ksi.references || [],
                url: `/frameworks/fedramp-20x-ksi/${id.toLowerCase().replace(/-/g, '-')}`
            }))
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fedramp-20x-ksi-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        if (typeof app !== 'undefined' && app.showToast) {
            app.showToast('Exported FedRAMP 20x KSI as JSON', 'success');
        }
    },
    
    // Export FedRAMP 20x KSI as CSV
    exportKSICSV() {
        if (typeof FEDRAMP_20X_KSI === 'undefined') {
            console.error('FedRAMP 20x KSI data not loaded');
            return;
        }
        
        const headers = [
            'Control ID',
            'Title',
            'Family',
            'Family Name',
            'Description',
            'Impact Low',
            'Impact Moderate',
            'Related NIST 800-53 Controls',
            'Related CMMC Controls'
        ];
        
        const rows = Object.entries(FEDRAMP_20X_KSI.indicators || {}).map(([id, ksi]) => {
            const familyName = FEDRAMP_20X_KSI.families?.[ksi.family]?.name || ksi.family;
            const isLow = ksi.impactLevels?.includes('Low') || ksi.impactLevels?.includes('low') || false;
            const isMod = ksi.impactLevels?.includes('Moderate') || ksi.impactLevels?.includes('moderate') || true;
            const related53 = (ksi.related53 || []).join('; ');
            const relatedCMMC = (ksi.relatedCMMC || []).join('; ');
            const desc = (ksi.description || '').replace(/"/g, '""');
            
            return [
                id,
                `"${ksi.title}"`,
                ksi.family,
                `"${familyName}"`,
                `"${desc}"`,
                isLow ? 'Yes' : 'No',
                isMod ? 'Yes' : 'No',
                `"${related53}"`,
                `"${relatedCMMC}"`
            ].join(',');
        });
        
        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fedramp-20x-ksi-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        
        if (typeof app !== 'undefined' && app.showToast) {
            app.showToast('Exported FedRAMP 20x KSI as CSV', 'success');
        }
    }
};

// Initialize when crosswalk view is shown
document.addEventListener('DOMContentLoaded', () => {
    // Will be initialized when view is activated
});
