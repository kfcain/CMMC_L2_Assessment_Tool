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
        console.log('CrosswalkVisualizer.init() called');
        this.populateFamilyFilter();
        this.populateControlSelector();
        this.bindEvents();
        this.renderTable();
    },
    
    bindEvents() {
        console.log('bindEvents() called');
        
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
        
        console.log('baselineFilter element:', baselineFilter);
        
        if (familyFilter) {
            familyFilter.addEventListener('change', (e) => {
                this.filters.family = e.target.value;
                this.render();
            });
        }
        
        if (baselineFilter) {
            baselineFilter.addEventListener('change', (e) => {
                this.filters.baseline = e.target.value;
                console.log('Baseline filter changed to:', this.filters.baseline);
                this.render();
            });
        } else {
            console.log('baselineFilter NOT FOUND');
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
        if (!select || typeof FRAMEWORK_MAPPINGS === 'undefined') return;
        
        // Get all control IDs sorted
        const controlIds = Object.keys(FRAMEWORK_MAPPINGS).sort((a, b) => {
            const [aMaj, aMin] = a.split('.').map(Number);
            const [bMaj, bMin] = b.split('.').map(Number);
            return aMaj - bMaj || aMin - bMin;
        });
        
        // Set default
        if (controlIds.length > 0 && !this.selectedControl) {
            this.selectedControl = controlIds[0];
        }
        
        controlIds.forEach(id => {
            const mapping = FRAMEWORK_MAPPINGS[id];
            const option = document.createElement('option');
            option.value = id;
            option.textContent = `${id} - ${mapping.description?.substring(0, 50) || ''}...`;
            select.appendChild(option);
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
    
    getMappingData() {
        console.log('getMappingData() called, filters:', this.filters);
        
        if (typeof FRAMEWORK_MAPPINGS === 'undefined') return [];
        
        const data = [];
        let skippedByBaseline = 0;
        
        Object.entries(FRAMEWORK_MAPPINGS).forEach(([controlId, mapping]) => {
            // Skip internal/helper entries
            if (controlId.startsWith('_')) return;
            
            // Dynamically derive KSIs from 800-53 controls using authoritative mapping
            let derivedKSIs = typeof getKSIsForControl === 'function' && mapping.nist80053 
                ? getKSIsForControl(mapping.nist80053) 
                : [];
            
            // Apply family filter
            if (this.filters.family !== 'all') {
                const familyId = this.getFamilyIdFromControl(controlId);
                if (familyId !== this.filters.family) return;
            }
            
            // Apply FedRAMP 20x KSI filter
            if (this.filters.baseline !== 'all') {
                // Filter: Has KSI Mapping
                if (this.filters.baseline === 'has-ksi') {
                    if (derivedKSIs.length === 0) {
                        skippedByBaseline++;
                        return;
                    }
                }
                // Filter: No KSI Mapping
                else if (this.filters.baseline === 'no-ksi') {
                    if (derivedKSIs.length > 0) {
                        skippedByBaseline++;
                        return;
                    }
                }
                // Filter: 20x Low Only (KSIs with low: true)
                else if (this.filters.baseline === 'low') {
                    if (derivedKSIs.length === 0) {
                        skippedByBaseline++;
                        return;
                    }
                    const filteredKSIs = derivedKSIs.filter(ksi => {
                        if (typeof FEDRAMP_20X_KSI === 'undefined') return false;
                        const ksiInfo = FEDRAMP_20X_KSI.indicators[ksi];
                        return ksiInfo && ksiInfo.low === true;
                    });
                    if (filteredKSIs.length === 0) {
                        skippedByBaseline++;
                        return;
                    }
                    derivedKSIs = filteredKSIs;
                }
                // Filter: 20x Moderate Only (KSIs with moderate: true but low: false)
                else if (this.filters.baseline === 'moderate-only') {
                    if (derivedKSIs.length === 0) {
                        skippedByBaseline++;
                        return;
                    }
                    const filteredKSIs = derivedKSIs.filter(ksi => {
                        if (typeof FEDRAMP_20X_KSI === 'undefined') return false;
                        const ksiInfo = FEDRAMP_20X_KSI.indicators[ksi];
                        return ksiInfo && ksiInfo.moderate === true && ksiInfo.low === false;
                    });
                    if (filteredKSIs.length === 0) {
                        skippedByBaseline++;
                        return;
                    }
                    derivedKSIs = filteredKSIs;
                }
            }
            
            // Apply search filter
            if (this.filters.search) {
                const searchStr = `${controlId} ${mapping.description || ''} ${mapping.nist80053?.join(' ') || ''} ${derivedKSIs.join(' ')} ${mapping.cmmc?.practice || ''}`.toLowerCase();
                if (!searchStr.includes(this.filters.search)) return;
            }
            
            data.push({
                controlId,
                ...mapping,
                fedramp20x: derivedKSIs // Override with dynamically derived KSIs
            });
        });
        
        console.log('getMappingData() returning', data.length, 'controls, skipped by baseline:', skippedByBaseline);
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
        console.log('renderTable() called, container:', container);
        if (!container) return;
        
        const data = this.getMappingData();
        console.log('renderTable() rendering', data.length, 'rows');
        
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
                        <th>NIST 800-171 / CMMC L2</th>
                        <th>Description</th>
                        <th>NIST 800-53</th>
                        <th>FedRAMP 20x KSI</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        data.forEach(item => {
            const nist53Tags = (item.nist80053 || []).map(c => {
                // Convert AC-6(1) to ac-6-1 for myctrl.tools URL format
                const urlId = c.toLowerCase().replace(/\((\d+)\)/g, '-$1');
                return `<a href="https://www.myctrl.tools/frameworks/nist-800-53-r5/${urlId}" target="_blank" rel="noopener" class="mapping-tag nist-53">${c}</a>`;
            }).join('');
            
            const fed20xTags = (item.fedramp20x || []).map(ksi => {
                // Convert KSI-IAM-04 to ksi-iam-4 (strip leading zeros)
                const urlId = ksi.toLowerCase().replace(/-0+(\d)/g, '-$1');
                // Get KSI details for tooltip
                const ksiInfo = typeof FEDRAMP_20X_KSI !== 'undefined' ? FEDRAMP_20X_KSI.indicators[ksi] : null;
                const tooltip = ksiInfo ? `${ksiInfo.title}: ${ksiInfo.description}` : ksi;
                return `<a href="https://www.myctrl.tools/frameworks/fedramp-20x-ksi/${urlId}" target="_blank" rel="noopener" class="mapping-tag fedramp-20x" title="${tooltip}">${ksi}</a>`;
            }).join('') || '<span class="mapping-tag empty">—</span>';
            
            // Combined NIST 800-171 / CMMC column with L1/L2 and Basic/Derived badges
            const cmmcPractice = item.cmmc?.practice || '';
            const cmmcLevel = item.cmmc?.level;
            const classification = item.classification;
            const levelClass = cmmcLevel === 1 ? 'cmmc-l1' : 'cmmc-l2';
            const classificationClass = classification === 'Basic' ? 'cmmc-basic' : 'cmmc-derived';
            const controlDisplay = cmmcPractice ? 
                `<span class="mapping-tag nist-171">${item.controlId}</span><span class="cmmc-level ${levelClass}">L${cmmcLevel}</span><span class="mapping-tag cmmc">${cmmcPractice}</span><span class="cmmc-classification ${classificationClass}">${classification}</span>` :
                `<span class="mapping-tag nist-171">${item.controlId}</span>`;
            
            html += `<tr><td class="control-col"><div class="tags-wrap">${controlDisplay}</div></td><td class="control-desc">${item.description || ''}</td><td class="nist53-col"><div class="tags-wrap">${nist53Tags || '—'}</div></td><td class="ksi-col"><div class="tags-wrap">${fed20xTags}</div></td></tr>`;
        });
        
        html += '</tbody></table>';
        console.log('Setting container.innerHTML with', data.length, 'rows');
        container.innerHTML = html;
        console.log('Table updated, rows in DOM:', container.querySelectorAll('tbody tr').length);
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
        const ksiSpokes = spokes.filter(n => n.type === 'fedramp-20x');
        const cmmcSpokes = spokes.filter(n => n.type === 'cmmc');
        
        // Set target positions in arcs - NIST 800-53 left, 20x KSI right, CMMC bottom
        this.setTargetPositionsInArc(nist53Spokes, centerX, centerY, radius, -Math.PI * 0.85, -Math.PI * 0.15);
        this.setTargetPositionsInArc(ksiSpokes, centerX, centerY, radius, Math.PI * 0.15, Math.PI * 0.65);
        this.setTargetPositionsInArc(cmmcSpokes, centerX, centerY, radius * 0.6, Math.PI * 0.75, Math.PI * 0.85);
        
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
        if (!this.selectedControl || typeof FRAMEWORK_MAPPINGS === 'undefined') {
            this.nodes = [];
            this.edges = [];
            return;
        }
        
        const mapping = FRAMEWORK_MAPPINGS[this.selectedControl];
        if (!mapping) {
            this.nodes = [];
            this.edges = [];
            return;
        }
        
        this.nodes = [];
        this.edges = [];
        
        // Center hub node - NIST 800-171
        this.nodes.push({
            id: this.selectedControl,
            label: this.selectedControl,
            type: 'nist-171',
            description: mapping.description,
            isHub: true,
            x: 0, y: 0
        });
        
        // NIST 800-53 spoke nodes
        (mapping.nist80053 || []).forEach(ctrl => {
            this.nodes.push({
                id: ctrl,
                label: ctrl,
                type: 'nist-53',
                x: 0, y: 0
            });
            this.edges.push({ source: this.selectedControl, target: ctrl, type: 'nist-53' });
        });
        
        // FedRAMP 20x KSI spoke nodes (Low/Moderate pilot)
        (mapping.fedramp20x || []).forEach(ksi => {
            // Get KSI title if available
            const ksiInfo = typeof FEDRAMP_20X_KSI !== 'undefined' ? 
                FEDRAMP_20X_KSI.indicators?.[ksi] : null;
            this.nodes.push({
                id: ksi,
                label: ksi,
                title: ksiInfo?.title || '',
                type: 'fedramp-20x',
                x: 0, y: 0
            });
            this.edges.push({ source: this.selectedControl, target: ksi, type: 'fedramp-20x' });
        });
        
        // CMMC spoke node
        if (mapping.cmmc?.practice) {
            this.nodes.push({
                id: mapping.cmmc.practice,
                label: mapping.cmmc.practice,
                type: 'cmmc',
                x: 0, y: 0
            });
            this.edges.push({ source: this.selectedControl, target: mapping.cmmc.practice, type: 'cmmc' });
        }
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
                <span class="legend-color nist-171"></span>
                <span>NIST 800-171</span>
            </div>
            <div class="graph-legend-item">
                <span class="legend-color nist-53"></span>
                <span>NIST 800-53</span>
            </div>
            <div class="graph-legend-item">
                <span class="legend-color fedramp-20x"></span>
                <span>FedRAMP 20x KSI</span>
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
