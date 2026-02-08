// ═══════════════════════════════════════════════════════════════════════════
//  DiagramVisualizer — Interactive SVG Network/Asset Topology Diagram
//  Reads applications & assets from DiagramHub, renders draggable nodes
//  with zone boundaries, connection lines, zoom/pan, and LLM-assisted layout.
//  Inspired by the CMMC Network Diagram (React Flow) reference design.
// ═══════════════════════════════════════════════════════════════════════════

const DiagramVisualizer = {
    version: '1.0.0',

    // ── State ──
    _svg: null,
    _container: null,
    _nodes: [],       // { id, x, y, w, h, data, type:'app'|'asset', el }
    _edges: [],       // { id, src, tgt, el, data }
    _zones: [],       // { id, el, data }
    _viewBox: { x: 0, y: 0, w: 1800, h: 1000 },
    _drag: null,      // { node, offsetX, offsetY }
    _pan: null,       // { startX, startY, vbX, vbY }
    _scale: 1,
    _selectedNode: null,

    // ── Color palette (matches CMMC Network Diagram theme) ──
    COLORS: {
        bg:          '#1a1b26',
        gridDot:     '#414868',
        cui:         { border: '#7aa2f7', bg: '#1e2030', text: '#c0caf5', badge: 'rgba(122,162,247,0.2)' },
        security:    { border: '#9ece6a', bg: '#1a2b32', text: '#c0caf5', badge: 'rgba(158,206,106,0.2)' },
        crma:        { border: '#e06c75', bg: '#2a1f2a', text: '#c0caf5', badge: 'rgba(224,108,117,0.2)' },
        specialized: { border: '#61afef', bg: '#1a2535', text: '#c0caf5', badge: 'rgba(97,175,239,0.2)' },
        oos:         { border: '#565f89', bg: '#1f2335', text: '#a9b1d6', badge: 'rgba(86,95,137,0.2)' },
        zone_cui:    { border: '#9ece6a', bg: 'rgba(158,206,106,0.06)' },
        zone_oos:    { border: '#f7768e', bg: 'rgba(247,118,142,0.06)' },
        zone_dmz:    { border: '#e0af68', bg: 'rgba(224,175,104,0.06)' },
        edge:        '#414868',
        edgeAnimated:'#7aa2f7',
        selection:   '#bb9af7',
        text:        '#c0caf5',
        textMuted:   '#a9b1d6',
    },

    // Node dimensions
    NODE_W: 180,
    NODE_H: 72,
    ZONE_PAD: 30,

    // ═══════════════════════════════════════════
    //  Public API
    // ═══════════════════════════════════════════

    // Open the visualizer in a full-screen modal
    open: function() {
        var existing = document.getElementById('dv-modal');
        if (existing) existing.remove();

        var modal = document.createElement('div');
        modal.id = 'dv-modal';
        modal.className = 'dv-modal-overlay';
        modal.innerHTML = this._renderModal();
        document.body.appendChild(modal);

        this._container = modal.querySelector('#dv-canvas-wrap');
        this._buildSVG();
        this._bindModalEvents(modal);
        this._loadFromHub();
        this._autoLayout();
        this._renderAll();
        this._fitView();
    },

    // Can also render into a specific container element
    renderInto: function(containerEl) {
        this._container = containerEl;
        containerEl.innerHTML = '';
        this._buildSVG();
        this._loadFromHub();
        this._autoLayout();
        this._renderAll();
        this._fitView();
    },

    // ═══════════════════════════════════════════
    //  Modal HTML
    // ═══════════════════════════════════════════
    _renderModal: function() {
        return '<div class="dv-modal-content">' +
            '<div class="dv-toolbar">' +
                '<div class="dv-toolbar-left">' +
                    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>' +
                    '<span class="dv-toolbar-title">Interactive Topology Diagram</span>' +
                    '<span class="dv-toolbar-count" id="dv-node-count"></span>' +
                '</div>' +
                '<div class="dv-toolbar-center">' +
                    '<button class="dv-tb-btn" id="dv-btn-zoom-in" title="Zoom In">+</button>' +
                    '<button class="dv-tb-btn" id="dv-btn-zoom-out" title="Zoom Out">&minus;</button>' +
                    '<button class="dv-tb-btn" id="dv-btn-fit" title="Fit View">Fit</button>' +
                    '<span class="dv-tb-sep"></span>' +
                    '<button class="dv-tb-btn" id="dv-btn-layout" title="Re-layout">Layout</button>' +
                    '<button class="dv-tb-btn dv-tb-accent" id="dv-btn-ai" title="AI-Assisted Layout">' +
                        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 2v10l7-4"/></svg>' +
                        ' AI Assist' +
                    '</button>' +
                    '<span class="dv-tb-sep"></span>' +
                    '<button class="dv-tb-btn" id="dv-btn-add-asset" title="Add Asset">+ Asset</button>' +
                    '<button class="dv-tb-btn" id="dv-btn-add-conn" title="Add Connection">+ Connection</button>' +
                '</div>' +
                '<div class="dv-toolbar-right">' +
                    '<button class="dv-tb-btn" id="dv-btn-export-svg" title="Export SVG">SVG</button>' +
                    '<button class="dv-tb-btn" id="dv-btn-export-png" title="Export PNG">PNG</button>' +
                    '<button class="dv-modal-close" id="dv-close">&times;</button>' +
                '</div>' +
            '</div>' +
            '<div class="dv-canvas-wrap" id="dv-canvas-wrap"></div>' +
            '<div class="dv-legend" id="dv-legend">' + this._renderLegend() + '</div>' +
            // Side panel for node details / AI
            '<div class="dv-side-panel" id="dv-side-panel" style="display:none;"></div>' +
        '</div>';
    },

    _renderLegend: function() {
        var cats = [
            { label: 'CUI Asset', color: this.COLORS.cui.border },
            { label: 'Security', color: this.COLORS.security.border },
            { label: 'Risk-Managed', color: this.COLORS.crma.border },
            { label: 'Specialized', color: this.COLORS.specialized.border },
            { label: 'Out of Scope', color: this.COLORS.oos.border },
        ];
        var html = '';
        cats.forEach(function(c) {
            html += '<span class="dv-legend-item"><span class="dv-legend-dot" style="background:' + c.color + '"></span>' + c.label + '</span>';
        });
        return html;
    },

    // ═══════════════════════════════════════════
    //  SVG Setup
    // ═══════════════════════════════════════════
    _buildSVG: function() {
        var ns = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('class', 'dv-svg');
        svg.setAttribute('xmlns', ns);
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        this._viewBox = { x: 0, y: 0, w: 1800, h: 1000 };
        svg.setAttribute('viewBox', '0 0 1800 1000');

        // Defs: arrow marker, grid pattern
        var defs = document.createElementNS(ns, 'defs');
        defs.innerHTML =
            '<marker id="dv-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
                '<path d="M 0 0 L 10 5 L 0 10 z" fill="' + this.COLORS.edge + '"/>' +
            '</marker>' +
            '<marker id="dv-arrow-active" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
                '<path d="M 0 0 L 10 5 L 0 10 z" fill="' + this.COLORS.edgeAnimated + '"/>' +
            '</marker>' +
            '<pattern id="dv-grid" width="20" height="20" patternUnits="userSpaceOnUse">' +
                '<circle cx="10" cy="10" r="0.8" fill="' + this.COLORS.gridDot + '"/>' +
            '</pattern>';
        svg.appendChild(defs);

        // Background
        var bgRect = document.createElementNS(ns, 'rect');
        bgRect.setAttribute('width', '100%');
        bgRect.setAttribute('height', '100%');
        bgRect.setAttribute('fill', this.COLORS.bg);
        svg.appendChild(bgRect);

        // Grid
        var gridRect = document.createElementNS(ns, 'rect');
        gridRect.setAttribute('width', '100%');
        gridRect.setAttribute('height', '100%');
        gridRect.setAttribute('fill', 'url(#dv-grid)');
        svg.appendChild(gridRect);

        // Layers
        this._layerZones = document.createElementNS(ns, 'g');
        this._layerZones.setAttribute('class', 'dv-layer-zones');
        svg.appendChild(this._layerZones);

        this._layerEdges = document.createElementNS(ns, 'g');
        this._layerEdges.setAttribute('class', 'dv-layer-edges');
        svg.appendChild(this._layerEdges);

        this._layerNodes = document.createElementNS(ns, 'g');
        this._layerNodes.setAttribute('class', 'dv-layer-nodes');
        svg.appendChild(this._layerNodes);

        this._svg = svg;
        this._container.appendChild(svg);

        // Bind pan/zoom
        this._bindSVGEvents();
    },

    // ═══════════════════════════════════════════
    //  Load data from DiagramHub
    // ═══════════════════════════════════════════
    _loadFromHub: function() {
        this._nodes = [];
        this._edges = [];
        this._zones = [];

        if (typeof DiagramHub === 'undefined') return;
        DiagramHub.load();
        var data = DiagramHub.data;

        // Load applications as nodes
        var self = this;
        (data.applications || []).forEach(function(app) {
            self._nodes.push({
                id: app.id,
                type: 'app',
                x: 0, y: 0,
                w: self.NODE_W, h: self.NODE_H,
                data: app,
                el: null
            });
        });

        // Load assets as nodes
        (data.assets || []).forEach(function(asset) {
            self._nodes.push({
                id: asset.id,
                type: 'asset',
                x: 0, y: 0,
                w: self.NODE_W, h: self.NODE_H,
                data: asset,
                el: null
            });
        });

        // Load connections as edges
        (data.connections || []).forEach(function(conn) {
            self._edges.push({
                id: conn.id,
                src: conn.sourceAppId || conn.sourceAssetId || '',
                tgt: conn.targetAppId || conn.targetAssetId || '',
                data: conn,
                el: null
            });
        });

        // Load zones
        (data.zones || []).forEach(function(zone) {
            self._zones.push({
                id: zone.id,
                data: zone,
                el: null
            });
        });

        // Update count
        var countEl = document.getElementById('dv-node-count');
        if (countEl) countEl.textContent = this._nodes.length + ' nodes, ' + this._edges.length + ' connections';
    },

    // ═══════════════════════════════════════════
    //  Auto-layout (force-directed simplified)
    // ═══════════════════════════════════════════
    _autoLayout: function() {
        if (this._nodes.length === 0) return;

        // Group nodes by scope category
        var groups = {};
        var self = this;
        this._nodes.forEach(function(n) {
            var cat = n.data.assetCategory || n.data.scopeCategory || 'cui';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(n);
        });

        // Layout groups in columns
        var groupOrder = ['cui', 'spa', 'crma', 'specialized', 'oos'];
        var colX = 80;
        var colGap = 260;
        var rowGap = 100;

        groupOrder.forEach(function(cat) {
            var items = groups[cat];
            if (!items || items.length === 0) return;

            var rowY = 120;
            items.forEach(function(n) {
                n.x = colX;
                n.y = rowY;
                rowY += n.h + rowGap;
            });
            colX += self.NODE_W + colGap;
        });

        // Handle any ungrouped nodes
        Object.keys(groups).forEach(function(cat) {
            if (groupOrder.indexOf(cat) >= 0) return;
            var items = groups[cat];
            if (!items) return;
            var rowY = 120;
            items.forEach(function(n) {
                n.x = colX;
                n.y = rowY;
                rowY += n.h + rowGap;
            });
            colX += self.NODE_W + colGap;
        });

        // Expand viewBox to fit
        var maxX = 0, maxY = 0;
        this._nodes.forEach(function(n) {
            if (n.x + n.w > maxX) maxX = n.x + n.w;
            if (n.y + n.h > maxY) maxY = n.y + n.h;
        });
        this._viewBox.w = Math.max(1800, maxX + 200);
        this._viewBox.h = Math.max(1000, maxY + 200);
    },

    // ═══════════════════════════════════════════
    //  Render all elements
    // ═══════════════════════════════════════════
    _renderAll: function() {
        this._layerZones.innerHTML = '';
        this._layerEdges.innerHTML = '';
        this._layerNodes.innerHTML = '';

        if (this._nodes.length === 0) {
            this._renderEmptyState();
            return;
        }

        var self = this;

        // Render zone backgrounds
        this._renderZoneBackgrounds();

        // Render edges
        this._edges.forEach(function(edge) {
            self._renderEdge(edge);
        });

        // Render nodes
        this._nodes.forEach(function(node) {
            self._renderNode(node);
        });
    },

    _renderEmptyState: function() {
        var ns = 'http://www.w3.org/2000/svg';
        var g = document.createElementNS(ns, 'g');
        g.setAttribute('transform', 'translate(700, 400)');
        g.innerHTML =
            '<text x="0" y="0" fill="' + this.COLORS.textMuted + '" font-size="18" text-anchor="middle" font-family="Inter, sans-serif">No applications or assets to visualize</text>' +
            '<text x="0" y="30" fill="' + this.COLORS.oos.border + '" font-size="13" text-anchor="middle" font-family="Inter, sans-serif">Add applications and assets in the Diagram Hub, then open this visualizer</text>' +
            '<text x="0" y="55" fill="' + this.COLORS.oos.border + '" font-size="13" text-anchor="middle" font-family="Inter, sans-serif">or click "+ Asset" above to add directly</text>';
        this._layerNodes.appendChild(g);
    },

    _renderZoneBackgrounds: function() {
        // Group nodes by scope category and draw zone rectangles
        var groups = {};
        var self = this;
        this._nodes.forEach(function(n) {
            var cat = n.data.assetCategory || n.data.scopeCategory || 'cui';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(n);
        });

        var ns = 'http://www.w3.org/2000/svg';
        var catNames = {
            cui: 'CUI Environment',
            spa: 'Security Protection Assets',
            crma: 'Contractor Risk-Managed',
            specialized: 'Specialized Assets',
            oos: 'Out of Scope'
        };
        var catColors = {
            cui: self.COLORS.zone_cui,
            spa: self.COLORS.security,
            crma: self.COLORS.zone_dmz,
            specialized: self.COLORS.specialized,
            oos: self.COLORS.zone_oos
        };

        Object.keys(groups).forEach(function(cat) {
            var items = groups[cat];
            if (!items || items.length === 0) return;

            var minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
            items.forEach(function(n) {
                if (n.x < minX) minX = n.x;
                if (n.y < minY) minY = n.y;
                if (n.x + n.w > maxX) maxX = n.x + n.w;
                if (n.y + n.h > maxY) maxY = n.y + n.h;
            });

            var pad = self.ZONE_PAD;
            var zx = minX - pad;
            var zy = minY - pad - 25;
            var zw = maxX - minX + pad * 2;
            var zh = maxY - minY + pad * 2 + 25;

            var colors = catColors[cat] || { border: self.COLORS.oos.border, bg: 'rgba(86,95,137,0.06)' };
            var borderColor = colors.border || self.COLORS.oos.border;
            var bgColor = colors.bg || 'rgba(86,95,137,0.06)';

            var rect = document.createElementNS(ns, 'rect');
            rect.setAttribute('x', zx);
            rect.setAttribute('y', zy);
            rect.setAttribute('width', zw);
            rect.setAttribute('height', zh);
            rect.setAttribute('rx', '12');
            rect.setAttribute('fill', bgColor);
            rect.setAttribute('stroke', borderColor);
            rect.setAttribute('stroke-width', '2');
            rect.setAttribute('stroke-dasharray', '8,4');
            self._layerZones.appendChild(rect);

            var label = document.createElementNS(ns, 'text');
            label.setAttribute('x', zx + 12);
            label.setAttribute('y', zy + 18);
            label.setAttribute('fill', borderColor);
            label.setAttribute('font-size', '13');
            label.setAttribute('font-weight', '700');
            label.setAttribute('font-family', 'Inter, sans-serif');
            label.textContent = catNames[cat] || cat;
            self._layerZones.appendChild(label);
        });
    },

    // ═══════════════════════════════════════════
    //  Render a single node
    // ═══════════════════════════════════════════
    _renderNode: function(node) {
        var ns = 'http://www.w3.org/2000/svg';
        var g = document.createElementNS(ns, 'g');
        g.setAttribute('transform', 'translate(' + node.x + ',' + node.y + ')');
        g.setAttribute('class', 'dv-node');
        g.setAttribute('data-id', node.id);
        g.style.cursor = 'grab';

        var cat = node.data.assetCategory || node.data.scopeCategory || 'cui';
        var palette = this.COLORS[cat] || this.COLORS.cui;
        if (typeof palette === 'string') palette = this.COLORS.cui;

        // Shadow
        var shadow = document.createElementNS(ns, 'rect');
        shadow.setAttribute('x', '2');
        shadow.setAttribute('y', '2');
        shadow.setAttribute('width', node.w);
        shadow.setAttribute('height', node.h);
        shadow.setAttribute('rx', '10');
        shadow.setAttribute('fill', 'rgba(0,0,0,0.3)');
        g.appendChild(shadow);

        // Background
        var bg = document.createElementNS(ns, 'rect');
        bg.setAttribute('x', '0');
        bg.setAttribute('y', '0');
        bg.setAttribute('width', node.w);
        bg.setAttribute('height', node.h);
        bg.setAttribute('rx', '10');
        bg.setAttribute('fill', palette.bg || '#1e2030');
        bg.setAttribute('stroke', palette.border || '#7aa2f7');
        bg.setAttribute('stroke-width', '2');
        g.appendChild(bg);

        // Icon
        var icon = this._getNodeIcon(node);
        var iconText = document.createElementNS(ns, 'text');
        iconText.setAttribute('x', '14');
        iconText.setAttribute('y', '32');
        iconText.setAttribute('font-size', '20');
        iconText.textContent = icon;
        g.appendChild(iconText);

        // Label
        var label = document.createElementNS(ns, 'text');
        label.setAttribute('x', '42');
        label.setAttribute('y', '28');
        label.setAttribute('fill', palette.text || '#c0caf5');
        label.setAttribute('font-size', '12');
        label.setAttribute('font-weight', '600');
        label.setAttribute('font-family', 'Inter, sans-serif');
        label.textContent = this._truncate(node.data.name, 18);
        g.appendChild(label);

        // Sublabel
        var sublabel = document.createElementNS(ns, 'text');
        sublabel.setAttribute('x', '42');
        sublabel.setAttribute('y', '44');
        sublabel.setAttribute('fill', this.COLORS.textMuted);
        sublabel.setAttribute('font-size', '10');
        sublabel.setAttribute('font-family', 'Inter, sans-serif');
        var subText = node.type === 'asset'
            ? (DiagramHub.ASSET_TYPES[node.data.assetType] || {}).name || node.data.assetType
            : node.data.environment || 'Application';
        sublabel.textContent = subText;
        g.appendChild(sublabel);

        // Scope badge
        var catInfo = DiagramHub.ASSET_CATEGORIES[cat];
        if (catInfo) {
            var badgeG = document.createElementNS(ns, 'g');
            badgeG.setAttribute('transform', 'translate(42, 52)');
            var badgeBg = document.createElementNS(ns, 'rect');
            badgeBg.setAttribute('x', '0');
            badgeBg.setAttribute('y', '0');
            badgeBg.setAttribute('width', String(catInfo.name.length * 6 + 12));
            badgeBg.setAttribute('height', '16');
            badgeBg.setAttribute('rx', '8');
            badgeBg.setAttribute('fill', palette.badge || 'rgba(122,162,247,0.2)');
            badgeBg.setAttribute('stroke', palette.border || '#7aa2f7');
            badgeBg.setAttribute('stroke-width', '0.5');
            badgeG.appendChild(badgeBg);
            var badgeText = document.createElementNS(ns, 'text');
            badgeText.setAttribute('x', '6');
            badgeText.setAttribute('y', '11');
            badgeText.setAttribute('fill', palette.border || '#7aa2f7');
            badgeText.setAttribute('font-size', '9');
            badgeText.setAttribute('font-family', 'Inter, sans-serif');
            badgeText.textContent = catInfo.name;
            badgeG.appendChild(badgeText);
            g.appendChild(badgeG);
        }

        // Connection handles (small circles at top/bottom)
        var handleTop = document.createElementNS(ns, 'circle');
        handleTop.setAttribute('cx', String(node.w / 2));
        handleTop.setAttribute('cy', '0');
        handleTop.setAttribute('r', '4');
        handleTop.setAttribute('fill', palette.border || '#7aa2f7');
        handleTop.setAttribute('class', 'dv-handle');
        g.appendChild(handleTop);

        var handleBot = document.createElementNS(ns, 'circle');
        handleBot.setAttribute('cx', String(node.w / 2));
        handleBot.setAttribute('cy', String(node.h));
        handleBot.setAttribute('r', '4');
        handleBot.setAttribute('fill', palette.border || '#7aa2f7');
        handleBot.setAttribute('class', 'dv-handle');
        g.appendChild(handleBot);

        node.el = g;
        this._layerNodes.appendChild(g);

        // Drag events
        var self = this;
        g.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return;
            e.stopPropagation();
            var pt = self._svgPoint(e);
            self._drag = { node: node, offsetX: pt.x - node.x, offsetY: pt.y - node.y };
            g.style.cursor = 'grabbing';
            self._selectNode(node);
        });

        g.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            self._showNodeDetails(node);
        });
    },

    _getNodeIcon: function(node) {
        if (node.type === 'asset') {
            var at = DiagramHub.ASSET_TYPES[node.data.assetType];
            return at ? at.icon : '📦';
        }
        // Application — pick icon by category
        var cat = node.data.assetCategory || 'cui';
        var icons = { cui: '🖥️', spa: '🛡️', crma: '⚠️', specialized: '⚙️', oos: '❌' };
        return icons[cat] || '📦';
    },

    // ═══════════════════════════════════════════
    //  Render a single edge
    // ═══════════════════════════════════════════
    _renderEdge: function(edge) {
        var srcNode = this._findNode(edge.src);
        var tgtNode = this._findNode(edge.tgt);
        if (!srcNode || !tgtNode) return;

        var ns = 'http://www.w3.org/2000/svg';
        var line = document.createElementNS(ns, 'line');
        var x1 = srcNode.x + srcNode.w / 2;
        var y1 = srcNode.y + srcNode.h;
        var x2 = tgtNode.x + tgtNode.w / 2;
        var y2 = tgtNode.y;

        // If target is above source, flip
        if (tgtNode.y < srcNode.y) {
            y1 = srcNode.y;
            y2 = tgtNode.y + tgtNode.h;
        }
        // If side-by-side, use left/right handles
        if (Math.abs(srcNode.y - tgtNode.y) < srcNode.h) {
            if (tgtNode.x > srcNode.x) {
                x1 = srcNode.x + srcNode.w; y1 = srcNode.y + srcNode.h / 2;
                x2 = tgtNode.x; y2 = tgtNode.y + tgtNode.h / 2;
            } else {
                x1 = srcNode.x; y1 = srcNode.y + srcNode.h / 2;
                x2 = tgtNode.x + tgtNode.w; y2 = tgtNode.y + tgtNode.h / 2;
            }
        }

        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', edge.data.encrypted === false ? '#f7768e' : this.COLORS.edge);
        line.setAttribute('stroke-width', '2');
        line.setAttribute('marker-end', 'url(#dv-arrow)');

        if (edge.data.direction === 'bidirectional') {
            line.setAttribute('marker-start', 'url(#dv-arrow)');
        }

        // Label
        var labelG = document.createElementNS(ns, 'g');
        var mx = (x1 + x2) / 2;
        var my = (y1 + y2) / 2;
        if (edge.data.dataType || edge.data.protocol) {
            var labelBg = document.createElementNS(ns, 'rect');
            var txt = (edge.data.dataType || '') + (edge.data.protocol ? ' / ' + edge.data.protocol : '');
            labelBg.setAttribute('x', mx - txt.length * 3);
            labelBg.setAttribute('y', my - 8);
            labelBg.setAttribute('width', String(txt.length * 6 + 8));
            labelBg.setAttribute('height', '16');
            labelBg.setAttribute('rx', '4');
            labelBg.setAttribute('fill', this.COLORS.bg);
            labelBg.setAttribute('stroke', this.COLORS.edge);
            labelBg.setAttribute('stroke-width', '0.5');
            labelG.appendChild(labelBg);

            var labelText = document.createElementNS(ns, 'text');
            labelText.setAttribute('x', mx);
            labelText.setAttribute('y', my + 4);
            labelText.setAttribute('fill', this.COLORS.textMuted);
            labelText.setAttribute('font-size', '9');
            labelText.setAttribute('text-anchor', 'middle');
            labelText.setAttribute('font-family', 'Inter, sans-serif');
            labelText.textContent = txt;
            labelG.appendChild(labelText);
        }

        edge.el = line;
        this._layerEdges.appendChild(line);
        this._layerEdges.appendChild(labelG);
    },

    // ═══════════════════════════════════════════
    //  SVG interaction: pan, zoom, drag
    // ═══════════════════════════════════════════
    _bindSVGEvents: function() {
        var self = this;
        var svg = this._svg;

        // Pan: mousedown on background
        svg.addEventListener('mousedown', function(e) {
            if (self._drag) return;
            self._pan = {
                startX: e.clientX,
                startY: e.clientY,
                vbX: self._viewBox.x,
                vbY: self._viewBox.y
            };
            svg.style.cursor = 'move';
        });

        svg.addEventListener('mousemove', function(e) {
            if (self._drag) {
                var pt = self._svgPoint(e);
                self._drag.node.x = pt.x - self._drag.offsetX;
                self._drag.node.y = pt.y - self._drag.offsetY;
                self._drag.node.el.setAttribute('transform', 'translate(' + self._drag.node.x + ',' + self._drag.node.y + ')');
                self._updateEdges();
                return;
            }
            if (self._pan) {
                var dx = (e.clientX - self._pan.startX) * (self._viewBox.w / svg.clientWidth);
                var dy = (e.clientY - self._pan.startY) * (self._viewBox.h / svg.clientHeight);
                self._viewBox.x = self._pan.vbX - dx;
                self._viewBox.y = self._pan.vbY - dy;
                self._applyViewBox();
            }
        });

        svg.addEventListener('mouseup', function() {
            if (self._drag) {
                self._drag.node.el.style.cursor = 'grab';
                self._drag = null;
                // Save positions back to DiagramHub? (optional)
            }
            self._pan = null;
            svg.style.cursor = 'default';
        });

        svg.addEventListener('mouseleave', function() {
            self._drag = null;
            self._pan = null;
            svg.style.cursor = 'default';
        });

        // Zoom: wheel
        svg.addEventListener('wheel', function(e) {
            e.preventDefault();
            var factor = e.deltaY > 0 ? 1.1 : 0.9;
            var pt = self._svgPoint(e);
            self._zoomAt(pt.x, pt.y, factor);
        });
    },

    _svgPoint: function(e) {
        var svg = this._svg;
        var rect = svg.getBoundingClientRect();
        return {
            x: this._viewBox.x + (e.clientX - rect.left) / rect.width * this._viewBox.w,
            y: this._viewBox.y + (e.clientY - rect.top) / rect.height * this._viewBox.h
        };
    },

    _zoomAt: function(cx, cy, factor) {
        var vb = this._viewBox;
        var newW = vb.w * factor;
        var newH = vb.h * factor;
        vb.x = cx - (cx - vb.x) * factor;
        vb.y = cy - (cy - vb.y) * factor;
        vb.w = newW;
        vb.h = newH;
        this._scale *= (1 / factor);
        this._applyViewBox();
    },

    _applyViewBox: function() {
        var vb = this._viewBox;
        this._svg.setAttribute('viewBox', vb.x + ' ' + vb.y + ' ' + vb.w + ' ' + vb.h);
    },

    _fitView: function() {
        if (this._nodes.length === 0) {
            this._viewBox = { x: 0, y: 0, w: 1800, h: 1000 };
        } else {
            var minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
            this._nodes.forEach(function(n) {
                if (n.x < minX) minX = n.x;
                if (n.y < minY) minY = n.y;
                if (n.x + n.w > maxX) maxX = n.x + n.w;
                if (n.y + n.h > maxY) maxY = n.y + n.h;
            });
            var pad = 100;
            this._viewBox = {
                x: minX - pad,
                y: minY - pad,
                w: maxX - minX + pad * 2,
                h: maxY - minY + pad * 2
            };
        }
        this._applyViewBox();
    },

    _updateEdges: function() {
        // Re-render edges after node drag
        this._layerEdges.innerHTML = '';
        var self = this;
        this._edges.forEach(function(edge) {
            self._renderEdge(edge);
        });
    },

    _findNode: function(id) {
        for (var i = 0; i < this._nodes.length; i++) {
            if (this._nodes[i].id === id) return this._nodes[i];
        }
        return null;
    },

    _selectNode: function(node) {
        // Deselect previous
        if (this._selectedNode && this._selectedNode.el) {
            var prevBg = this._selectedNode.el.querySelector('rect:nth-child(2)');
            if (prevBg) prevBg.setAttribute('stroke-width', '2');
        }
        this._selectedNode = node;
        if (node && node.el) {
            var bg = node.el.querySelector('rect:nth-child(2)');
            if (bg) {
                bg.setAttribute('stroke', this.COLORS.selection);
                bg.setAttribute('stroke-width', '3');
            }
        }
    },

    _truncate: function(str, max) {
        if (!str) return '';
        return str.length > max ? str.substring(0, max - 1) + '…' : str;
    },

    // ═══════════════════════════════════════════
    //  Modal event binding
    // ═══════════════════════════════════════════
    _bindModalEvents: function(modal) {
        var self = this;

        // Close
        modal.querySelector('#dv-close').addEventListener('click', function() { modal.remove(); });
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

        // Zoom
        modal.querySelector('#dv-btn-zoom-in').addEventListener('click', function() {
            self._zoomAt(self._viewBox.x + self._viewBox.w / 2, self._viewBox.y + self._viewBox.h / 2, 0.8);
        });
        modal.querySelector('#dv-btn-zoom-out').addEventListener('click', function() {
            self._zoomAt(self._viewBox.x + self._viewBox.w / 2, self._viewBox.y + self._viewBox.h / 2, 1.25);
        });
        modal.querySelector('#dv-btn-fit').addEventListener('click', function() { self._fitView(); });

        // Layout
        modal.querySelector('#dv-btn-layout').addEventListener('click', function() {
            self._autoLayout();
            self._renderAll();
            self._fitView();
        });

        // AI Assist
        modal.querySelector('#dv-btn-ai').addEventListener('click', function() { self._showAIPanel(); });

        // Add Asset
        modal.querySelector('#dv-btn-add-asset').addEventListener('click', function() { self._showAddAssetPanel(); });

        // Add Connection
        modal.querySelector('#dv-btn-add-conn').addEventListener('click', function() { self._showAddConnectionPanel(); });

        // Export
        modal.querySelector('#dv-btn-export-svg').addEventListener('click', function() { self._exportSVG(); });
        modal.querySelector('#dv-btn-export-png').addEventListener('click', function() { self._exportPNG(); });
    },

    // ═══════════════════════════════════════════
    //  Side panel: Node details
    // ═══════════════════════════════════════════
    _showNodeDetails: function(node) {
        var panel = document.getElementById('dv-side-panel');
        if (!panel) return;
        panel.style.display = 'block';

        var d = node.data;
        var cat = DiagramHub.ASSET_CATEGORIES[d.assetCategory || d.scopeCategory] || {};
        var typeInfo = node.type === 'asset' ? (DiagramHub.ASSET_TYPES[d.assetType] || {}) : {};

        panel.innerHTML =
            '<div class="dv-panel-header">' +
                '<h3>' + this._escapeHtml(d.name) + '</h3>' +
                '<button class="dv-panel-close" id="dv-panel-close">&times;</button>' +
            '</div>' +
            '<div class="dv-panel-body">' +
                '<div class="dv-panel-field"><label>Type</label><span>' + (node.type === 'asset' ? (typeInfo.name || d.assetType) : 'Application') + '</span></div>' +
                '<div class="dv-panel-field"><label>Scope</label><span style="color:' + (cat.color || '#7aa2f7') + '">' + (cat.name || 'Unknown') + '</span></div>' +
                (d.description ? '<div class="dv-panel-field"><label>Description</label><span>' + this._escapeHtml(d.description) + '</span></div>' : '') +
                (d.owner ? '<div class="dv-panel-field"><label>Owner</label><span>' + this._escapeHtml(d.owner) + '</span></div>' : '') +
                (d.hostname ? '<div class="dv-panel-field"><label>Hostname</label><span>' + this._escapeHtml(d.hostname) + '</span></div>' : '') +
                (d.ipAddress ? '<div class="dv-panel-field"><label>IP Address</label><span>' + this._escapeHtml(d.ipAddress) + '</span></div>' : '') +
                (d.location ? '<div class="dv-panel-field"><label>Location</label><span>' + this._escapeHtml(d.location) + '</span></div>' : '') +
                (d.quantity ? '<div class="dv-panel-field"><label>Quantity</label><span>' + d.quantity + '</span></div>' : '') +
                (d.tags && d.tags.length ? '<div class="dv-panel-field"><label>Tags</label><span>' + d.tags.join(', ') + '</span></div>' : '') +
            '</div>';

        panel.querySelector('#dv-panel-close').addEventListener('click', function() { panel.style.display = 'none'; });
    },

    // ═══════════════════════════════════════════
    //  Side panel: Add Asset
    // ═══════════════════════════════════════════
    _showAddAssetPanel: function() {
        var panel = document.getElementById('dv-side-panel');
        if (!panel) return;
        panel.style.display = 'block';

        var typeOptions = '';
        if (typeof DiagramHub !== 'undefined') {
            Object.keys(DiagramHub.ASSET_TYPES).forEach(function(key) {
                var t = DiagramHub.ASSET_TYPES[key];
                typeOptions += '<option value="' + key + '">' + t.icon + ' ' + t.name + '</option>';
            });
        }

        var catOptions = '';
        if (typeof DiagramHub !== 'undefined') {
            Object.keys(DiagramHub.ASSET_CATEGORIES).forEach(function(key) {
                var c = DiagramHub.ASSET_CATEGORIES[key];
                catOptions += '<option value="' + key + '">' + c.name + '</option>';
            });
        }

        panel.innerHTML =
            '<div class="dv-panel-header"><h3>Add Asset</h3><button class="dv-panel-close" id="dv-panel-close">&times;</button></div>' +
            '<div class="dv-panel-body">' +
                '<div class="dv-panel-form-group"><label>Name *</label><input type="text" id="dv-af-name" placeholder="e.g., Perimeter Firewall"></div>' +
                '<div class="dv-panel-form-group"><label>Asset Type</label><select id="dv-af-type">' + typeOptions + '</select></div>' +
                '<div class="dv-panel-form-group"><label>Scope Category</label><select id="dv-af-scope">' + catOptions + '</select></div>' +
                '<div class="dv-panel-form-group"><label>Hostname</label><input type="text" id="dv-af-hostname" placeholder="e.g., fw-01.corp.local"></div>' +
                '<div class="dv-panel-form-group"><label>IP Address</label><input type="text" id="dv-af-ip" placeholder="e.g., 10.0.1.1"></div>' +
                '<div class="dv-panel-form-group"><label>Location</label><input type="text" id="dv-af-location" placeholder="e.g., HQ Server Room"></div>' +
                '<div class="dv-panel-form-group"><label>Owner</label><input type="text" id="dv-af-owner" placeholder="e.g., IT Security Team"></div>' +
                '<div class="dv-panel-form-group"><label>Quantity</label><input type="number" id="dv-af-qty" value="1" min="1"></div>' +
                '<div class="dv-panel-form-group"><label>Description</label><textarea id="dv-af-desc" rows="2" placeholder="Brief description..."></textarea></div>' +
                '<button class="dv-panel-btn-primary" id="dv-af-save">Add Asset</button>' +
            '</div>';

        var self = this;
        panel.querySelector('#dv-panel-close').addEventListener('click', function() { panel.style.display = 'none'; });
        panel.querySelector('#dv-af-save').addEventListener('click', function() {
            var name = document.getElementById('dv-af-name').value.trim();
            if (!name) { alert('Name is required'); return; }

            if (typeof DiagramHub !== 'undefined') {
                DiagramHub.addAsset({
                    name: name,
                    assetType: document.getElementById('dv-af-type').value,
                    scopeCategory: document.getElementById('dv-af-scope').value,
                    hostname: document.getElementById('dv-af-hostname').value.trim(),
                    ipAddress: document.getElementById('dv-af-ip').value.trim(),
                    location: document.getElementById('dv-af-location').value.trim(),
                    owner: document.getElementById('dv-af-owner').value.trim(),
                    quantity: parseInt(document.getElementById('dv-af-qty').value) || 1,
                    description: document.getElementById('dv-af-desc').value.trim()
                });
            }

            // Reload
            self._loadFromHub();
            self._autoLayout();
            self._renderAll();
            self._fitView();
            panel.style.display = 'none';
        });
    },

    // ═══════════════════════════════════════════
    //  Side panel: Add Connection
    // ═══════════════════════════════════════════
    _showAddConnectionPanel: function() {
        var panel = document.getElementById('dv-side-panel');
        if (!panel) return;
        panel.style.display = 'block';

        var nodeOptions = '';
        this._nodes.forEach(function(n) {
            nodeOptions += '<option value="' + n.id + '">' + n.data.name + '</option>';
        });

        panel.innerHTML =
            '<div class="dv-panel-header"><h3>Add Connection</h3><button class="dv-panel-close" id="dv-panel-close">&times;</button></div>' +
            '<div class="dv-panel-body">' +
                '<div class="dv-panel-form-group"><label>Source</label><select id="dv-cf-src">' + nodeOptions + '</select></div>' +
                '<div class="dv-panel-form-group"><label>Target</label><select id="dv-cf-tgt">' + nodeOptions + '</select></div>' +
                '<div class="dv-panel-form-group"><label>Data Type</label><select id="dv-cf-data">' +
                    '<option value="CUI">CUI</option><option value="FCI">FCI</option><option value="Auth">Authentication</option><option value="Logs">Logs</option><option value="Other">Other</option>' +
                '</select></div>' +
                '<div class="dv-panel-form-group"><label>Protocol</label><input type="text" id="dv-cf-proto" placeholder="e.g., HTTPS, TLS 1.3"></div>' +
                '<div class="dv-panel-form-group"><label>Direction</label><select id="dv-cf-dir">' +
                    '<option value="unidirectional">Unidirectional</option><option value="bidirectional">Bidirectional</option>' +
                '</select></div>' +
                '<div class="dv-panel-form-group"><label>Encrypted?</label><select id="dv-cf-enc"><option value="true">Yes</option><option value="false">No</option></select></div>' +
                '<button class="dv-panel-btn-primary" id="dv-cf-save">Add Connection</button>' +
            '</div>';

        var self = this;
        panel.querySelector('#dv-panel-close').addEventListener('click', function() { panel.style.display = 'none'; });
        panel.querySelector('#dv-cf-save').addEventListener('click', function() {
            var src = document.getElementById('dv-cf-src').value;
            var tgt = document.getElementById('dv-cf-tgt').value;
            if (src === tgt) { alert('Source and target must be different'); return; }

            if (typeof DiagramHub !== 'undefined') {
                DiagramHub.addConnection({
                    sourceAppId: src,
                    targetAppId: tgt,
                    dataType: document.getElementById('dv-cf-data').value,
                    protocol: document.getElementById('dv-cf-proto').value.trim(),
                    direction: document.getElementById('dv-cf-dir').value,
                    encrypted: document.getElementById('dv-cf-enc').value === 'true'
                });
            }

            self._loadFromHub();
            self._renderAll();
            panel.style.display = 'none';
        });
    },

    // ═══════════════════════════════════════════
    //  AI-Assisted Layout Panel
    // ═══════════════════════════════════════════
    _showAIPanel: function() {
        var panel = document.getElementById('dv-side-panel');
        if (!panel) return;
        panel.style.display = 'block';

        var savedKey = localStorage.getItem('dv_llm_api_key') || '';
        var savedProvider = localStorage.getItem('dv_llm_provider') || 'anthropic';

        panel.innerHTML =
            '<div class="dv-panel-header"><h3>AI-Assisted Diagram</h3><button class="dv-panel-close" id="dv-panel-close">&times;</button></div>' +
            '<div class="dv-panel-body">' +
                '<p class="dv-panel-desc">Send your asset inventory to an LLM to get layout suggestions, descriptions, or generate a Mermaid diagram.</p>' +
                '<div class="dv-panel-form-group"><label>LLM Provider</label>' +
                    '<select id="dv-ai-provider">' +
                        '<option value="anthropic"' + (savedProvider === 'anthropic' ? ' selected' : '') + '>Anthropic (Claude)</option>' +
                        '<option value="openai"' + (savedProvider === 'openai' ? ' selected' : '') + '>OpenAI (GPT)</option>' +
                    '</select>' +
                '</div>' +
                '<div class="dv-panel-form-group"><label>API Key</label>' +
                    '<input type="password" id="dv-ai-key" value="' + this._escapeHtml(savedKey) + '" placeholder="sk-... or your API key">' +
                    '<small class="dv-panel-hint">Stored locally in your browser only</small>' +
                '</div>' +
                '<div class="dv-panel-form-group"><label>Prompt</label>' +
                    '<textarea id="dv-ai-prompt" rows="4" placeholder="e.g., Generate a Mermaid.js network diagram showing CUI data flows between all assets...">Generate a Mermaid.js network topology diagram for a CMMC assessment based on the following assets. Group by scope category, show data flows, and label security zones.</textarea>' +
                '</div>' +
                '<button class="dv-panel-btn-primary" id="dv-ai-send">' +
                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 2v10l7-4"/></svg>' +
                    ' Send to LLM' +
                '</button>' +
                '<div id="dv-ai-result" class="dv-ai-result" style="display:none;"></div>' +
            '</div>';

        var self = this;
        panel.querySelector('#dv-panel-close').addEventListener('click', function() { panel.style.display = 'none'; });
        panel.querySelector('#dv-ai-send').addEventListener('click', function() { self._sendToLLM(); });
    },

    _sendToLLM: async function() {
        var provider = document.getElementById('dv-ai-provider').value;
        var apiKey = document.getElementById('dv-ai-key').value.trim();
        var prompt = document.getElementById('dv-ai-prompt').value.trim();
        var resultEl = document.getElementById('dv-ai-result');

        if (!apiKey) { alert('Please enter an API key'); return; }
        if (!prompt) { alert('Please enter a prompt'); return; }

        // Save key locally
        localStorage.setItem('dv_llm_api_key', apiKey);
        localStorage.setItem('dv_llm_provider', provider);

        // Build asset inventory context
        var inventory = this._buildInventoryContext();
        var fullPrompt = prompt + '\n\n--- ASSET INVENTORY ---\n' + inventory;

        resultEl.style.display = 'block';
        resultEl.innerHTML = '<div class="dv-ai-loading">Sending to ' + (provider === 'anthropic' ? 'Claude' : 'GPT') + '...</div>';

        try {
            var response;
            if (provider === 'anthropic') {
                response = await this._callAnthropic(apiKey, fullPrompt);
            } else {
                response = await this._callOpenAI(apiKey, fullPrompt);
            }

            resultEl.innerHTML =
                '<div class="dv-ai-response">' +
                    '<div class="dv-ai-response-header">AI Response</div>' +
                    '<pre class="dv-ai-response-text">' + this._escapeHtml(response) + '</pre>' +
                    '<div class="dv-ai-response-actions">' +
                        '<button class="dv-panel-btn-secondary" id="dv-ai-copy">Copy</button>' +
                        '<button class="dv-panel-btn-secondary" id="dv-ai-use-mermaid">Use as Mermaid Diagram</button>' +
                    '</div>' +
                '</div>';

            var self = this;
            resultEl.querySelector('#dv-ai-copy').addEventListener('click', function() {
                navigator.clipboard.writeText(response);
            });
            resultEl.querySelector('#dv-ai-use-mermaid').addEventListener('click', function() {
                self._saveMermaidDiagram(response);
            });

        } catch (err) {
            resultEl.innerHTML = '<div class="dv-ai-error">Error: ' + this._escapeHtml(err.message) + '</div>';
        }
    },

    _buildInventoryContext: function() {
        var lines = [];
        lines.push('Applications:');
        if (typeof DiagramHub !== 'undefined') {
            (DiagramHub.data.applications || []).forEach(function(app) {
                lines.push('  - ' + app.name + ' [Category: ' + (app.assetCategory || 'cui') + ', Env: ' + (app.environment || 'production') + ', Data: ' + (app.dataClassification || 'CUI') + ']');
            });
            lines.push('');
            lines.push('Assets:');
            (DiagramHub.data.assets || []).forEach(function(a) {
                var t = DiagramHub.ASSET_TYPES[a.assetType] || {};
                lines.push('  - ' + a.name + ' [Type: ' + (t.name || a.assetType) + ', Scope: ' + (a.scopeCategory || 'cui') + ', IP: ' + (a.ipAddress || 'N/A') + ', Qty: ' + (a.quantity || 1) + ']');
            });
            lines.push('');
            lines.push('Connections:');
            (DiagramHub.data.connections || []).forEach(function(c) {
                var src = DiagramHub.getApplication(c.sourceAppId) || DiagramHub.getAsset(c.sourceAppId);
                var tgt = DiagramHub.getApplication(c.targetAppId) || DiagramHub.getAsset(c.targetAppId);
                lines.push('  - ' + (src ? src.name : c.sourceAppId) + ' -> ' + (tgt ? tgt.name : c.targetAppId) + ' [Data: ' + (c.dataType || 'CUI') + ', Protocol: ' + (c.protocol || 'N/A') + ', Encrypted: ' + (c.encrypted !== false ? 'Yes' : 'No') + ']');
            });
            lines.push('');
            lines.push('Security Zones:');
            (DiagramHub.data.zones || []).forEach(function(z) {
                lines.push('  - ' + z.name + ' [Type: ' + (z.type || 'enclave') + ']');
            });
        }
        return lines.join('\n');
    },

    _callAnthropic: async function(apiKey, prompt) {
        var resp = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 4096,
                messages: [{ role: 'user', content: prompt }]
            })
        });
        if (!resp.ok) {
            var errBody = await resp.text();
            throw new Error('Anthropic API error (' + resp.status + '): ' + errBody);
        }
        var data = await resp.json();
        return data.content && data.content[0] ? data.content[0].text : 'No response';
    },

    _callOpenAI: async function(apiKey, prompt) {
        var resp = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 4096
            })
        });
        if (!resp.ok) {
            var errBody = await resp.text();
            throw new Error('OpenAI API error (' + resp.status + '): ' + errBody);
        }
        var data = await resp.json();
        return data.choices && data.choices[0] ? data.choices[0].message.content : 'No response';
    },

    _saveMermaidDiagram: function(mermaidCode) {
        // Extract mermaid code block if wrapped in ```
        var match = mermaidCode.match(/```(?:mermaid)?\s*([\s\S]*?)```/);
        var code = match ? match[1].trim() : mermaidCode.trim();

        if (typeof DiagramHub !== 'undefined') {
            DiagramHub.addDiagram({
                name: 'AI-Generated Topology',
                description: 'Generated by LLM from asset inventory',
                type: 'network',
                source: 'mermaid',
                mermaidCode: code
            });
            alert('Mermaid diagram saved to Diagram Hub!');
        }
    },

    // ═══════════════════════════════════════════
    //  Export
    // ═══════════════════════════════════════════
    _exportSVG: function() {
        var svgData = this._svg.outerHTML;
        var blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'cmmc-topology-diagram.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    _exportPNG: function() {
        var svgData = new XMLSerializer().serializeToString(this._svg);
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = new Image();
        var svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        var url = URL.createObjectURL(svgBlob);

        img.onload = function() {
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            ctx.scale(2, 2);
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);

            canvas.toBlob(function(blob) {
                var pngUrl = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = pngUrl;
                a.download = 'cmmc-topology-diagram.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(pngUrl);
            }, 'image/png');
        };
        img.src = url;
    },

    // ═══════════════════════════════════════════
    //  Utility
    // ═══════════════════════════════════════════
    _escapeHtml: function(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

// Expose globally
if (typeof window !== 'undefined') {
    window.DiagramVisualizer = DiagramVisualizer;
}
