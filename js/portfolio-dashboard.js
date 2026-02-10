// Multi-Client Portfolio Dashboard
// MSP/Consultant view for managing multiple OSC assessments

const PortfolioDashboard = {
    // XSS-safe HTML escaping for user-stored data
    esc(s) { return typeof Sanitize !== 'undefined' ? Sanitize.html(s) : String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;'})[c]); },

    config: {
        version: "1.0.0"
    },

    // Portfolio data structure
    portfolioData: {
        clients: [],
        lastUpdated: null
    },

    // Initialize the dashboard
    init: function() {
        this.loadPortfolioData();
        this.bindEvents();
        console.log('[PortfolioDashboard] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#open-portfolio-btn')) {
                this.showPortfolioDashboard();
            }
            if (e.target.closest('.add-client-btn')) {
                this.showAddClientModal();
            }
            if (e.target.closest('.refresh-portfolio-btn')) {
                this.refreshPortfolio();
            }
        });
    },

    // Load portfolio data from storage
    loadPortfolioData: function() {
        try {
            const saved = localStorage.getItem('cmmc_portfolio_data');
            if (saved) {
                this.portfolioData = JSON.parse(saved);
            }
            
            // Also try to sync with Supabase if available
            if (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized) {
                this.syncWithSupabase();
            }
        } catch (e) {
            console.error('[PortfolioDashboard] Error loading data:', e);
        }
    },

    // Save portfolio data
    savePortfolioData: function() {
        try {
            this.portfolioData.lastUpdated = new Date().toISOString();
            localStorage.setItem('cmmc_portfolio_data', JSON.stringify(this.portfolioData));
        } catch (e) {
            console.error('[PortfolioDashboard] Error saving data:', e);
        }
    },

    // Sync with Supabase backend
    syncWithSupabase: async function() {
        if (typeof supabaseClient === 'undefined' || !supabaseClient.user) return;

        try {
            const orgs = await supabaseClient.loadUserData();
            if (orgs && orgs.length > 0) {
                // Merge Supabase orgs with local portfolio
                orgs.forEach(org => {
                    const existing = this.portfolioData.clients.find(c => c.id === org.id);
                    if (!existing) {
                        this.portfolioData.clients.push(this.mapOrgToClient(org));
                    } else {
                        // Update existing
                        Object.assign(existing, this.mapOrgToClient(org));
                    }
                });
                this.savePortfolioData();
            }
        } catch (e) {
            console.error('[PortfolioDashboard] Sync error:', e);
        }
    },

    mapOrgToClient: function(org) {
        return {
            id: org.id,
            name: org.name,
            industry: org.industry || 'Defense',
            contractType: org.contract_type || 'Prime',
            assessmentLevel: org.assessment_level || 2,
            status: 'active',
            sprsScore: org.sprs_score || null,
            lastAssessment: org.last_assessment || null,
            nextAssessment: org.next_assessment || null,
            poamCount: org.poam_count || 0,
            completionPercent: org.completion_percent || 0,
            contacts: org.contacts || [],
            notes: org.notes || '',
            createdAt: org.created_at,
            updatedAt: org.updated_at
        };
    },

    // Add a new client
    addClient: function(clientData) {
        const client = {
            id: 'client_' + Date.now(),
            ...clientData,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.portfolioData.clients.push(client);
        this.savePortfolioData();
        return client;
    },

    // Update client data
    updateClient: function(clientId, updates) {
        const client = this.portfolioData.clients.find(c => c.id === clientId);
        if (client) {
            Object.assign(client, updates, { updatedAt: new Date().toISOString() });
            this.savePortfolioData();
        }
        return client;
    },

    // Remove client
    removeClient: function(clientId) {
        this.portfolioData.clients = this.portfolioData.clients.filter(c => c.id !== clientId);
        this.savePortfolioData();
    },

    // Calculate portfolio statistics
    calculatePortfolioStats: function() {
        const clients = this.portfolioData.clients;
        
        if (clients.length === 0) {
            return {
                totalClients: 0,
                activeAssessments: 0,
                avgSprsScore: 0,
                totalPoamItems: 0,
                atRisk: 0,
                onTrack: 0,
                completed: 0,
                byLevel: { l1: 0, l2: 0, l3: 0 },
                upcomingAssessments: [],
                recentActivity: []
            };
        }

        const stats = {
            totalClients: clients.length,
            activeAssessments: clients.filter(c => c.status === 'active').length,
            avgSprsScore: 0,
            totalPoamItems: 0,
            atRisk: 0,
            onTrack: 0,
            completed: 0,
            byLevel: { l1: 0, l2: 0, l3: 0 },
            upcomingAssessments: [],
            recentActivity: []
        };

        let sprsSum = 0;
        let sprsCount = 0;

        clients.forEach(client => {
            // SPRS calculation
            if (client.sprsScore !== null && client.sprsScore !== undefined) {
                sprsSum += client.sprsScore;
                sprsCount++;
            }

            // POA&M count
            stats.totalPoamItems += client.poamCount || 0;

            // Status categorization
            if (client.completionPercent >= 100) {
                stats.completed++;
            } else if (client.sprsScore !== null && client.sprsScore < 70) {
                stats.atRisk++;
            } else {
                stats.onTrack++;
            }

            // Level breakdown
            if (client.assessmentLevel === 1) stats.byLevel.l1++;
            else if (client.assessmentLevel === 2) stats.byLevel.l2++;
            else if (client.assessmentLevel === 3) stats.byLevel.l3++;

            // Upcoming assessments
            if (client.nextAssessment) {
                const daysUntil = Math.ceil((new Date(client.nextAssessment) - new Date()) / (1000 * 60 * 60 * 24));
                if (daysUntil > 0 && daysUntil <= 90) {
                    stats.upcomingAssessments.push({
                        clientId: client.id,
                        clientName: client.name,
                        date: client.nextAssessment,
                        daysUntil: daysUntil
                    });
                }
            }
        });

        stats.avgSprsScore = sprsCount > 0 ? Math.round(sprsSum / sprsCount) : 0;
        stats.upcomingAssessments.sort((a, b) => a.daysUntil - b.daysUntil);

        return stats;
    },

    // Find common gaps across clients
    findCommonGaps: function() {
        // This would analyze assessment data across clients
        // For now, return placeholder structure
        return {
            mostCommonGaps: [],
            byFamily: {},
            recommendations: []
        };
    },

    // Render the portfolio dashboard
    renderPortfolioDashboard: function() {
        const stats = this.calculatePortfolioStats();
        const clients = this.portfolioData.clients;

        return `
        <div class="portfolio-dashboard">
            <div class="portfolio-header">
                <div class="portfolio-title">
                    <h2>Client Portfolio Dashboard</h2>
                    <span class="portfolio-subtitle">CMMC Assessment Management</span>
                </div>
                <div class="portfolio-actions">
                    <button class="btn-icon refresh-portfolio-btn" title="Refresh">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M23 4v6h-6M1 20v-6h6"/>
                            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                        </svg>
                    </button>
                    <button class="btn-primary add-client-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                        Add Client
                    </button>
                </div>
            </div>

            <div class="portfolio-stats-grid">
                <div class="stat-card primary">
                    <div class="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.totalClients}</div>
                        <div class="stat-label">Total Clients</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon sprs">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.avgSprsScore}</div>
                        <div class="stat-label">Avg SPRS Score</div>
                    </div>
                </div>
                <div class="stat-card success">
                    <div class="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                            <path d="M22 4L12 14.01l-3-3"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.onTrack}</div>
                        <div class="stat-label">On Track</div>
                    </div>
                </div>
                <div class="stat-card warning">
                    <div class="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.atRisk}</div>
                        <div class="stat-label">At Risk</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.totalPoamItems}</div>
                        <div class="stat-label">Total POA&M Items</div>
                    </div>
                </div>
            </div>

            ${stats.upcomingAssessments.length > 0 ? `
            <div class="upcoming-assessments-section">
                <h3>Upcoming Assessments</h3>
                <div class="upcoming-list">
                    ${stats.upcomingAssessments.slice(0, 5).map(a => `
                    <div class="upcoming-item ${a.daysUntil <= 30 ? 'urgent' : ''}">
                        <div class="upcoming-client">${a.clientName}</div>
                        <div class="upcoming-date">${new Date(a.date).toLocaleDateString()}</div>
                        <div class="upcoming-countdown">${a.daysUntil} days</div>
                    </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <div class="client-list-section">
                <div class="section-header">
                    <h3>Client Overview</h3>
                    <div class="list-controls">
                        <input type="search" id="client-search" placeholder="Search clients..." class="search-input">
                        <select id="client-filter" class="filter-select">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="at-risk">At Risk</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
                
                <div class="client-grid" id="client-grid">
                    ${clients.length > 0 ? clients.map(client => this.renderClientCard(client)).join('') : `
                    <div class="empty-state">
                        <div class="empty-icon">📋</div>
                        <h4>No Clients Yet</h4>
                        <p>Add your first client to start tracking CMMC assessments</p>
                        <button class="btn-primary add-client-btn">Add Client</button>
                    </div>
                    `}
                </div>
            </div>
        </div>`;
    },

    renderClientCard: function(client) {
        const sprsClass = client.sprsScore >= 70 ? 'good' : client.sprsScore >= 0 ? 'warning' : 'critical';
        const statusClass = client.completionPercent >= 100 ? 'completed' : 
                           client.sprsScore < 70 ? 'at-risk' : 'active';
        
        return `
        <div class="client-card ${statusClass}" data-client-id="${client.id}">
            <div class="client-card-header">
                <div class="client-name">${client.name}</div>
                <div class="client-level">L${client.assessmentLevel}</div>
            </div>
            <div class="client-card-body">
                <div class="client-metrics">
                    <div class="metric">
                        <span class="metric-label">SPRS</span>
                        <span class="metric-value ${sprsClass}">${client.sprsScore !== null ? client.sprsScore : '--'}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Progress</span>
                        <span class="metric-value">${client.completionPercent || 0}%</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">POA&M</span>
                        <span class="metric-value">${client.poamCount || 0}</span>
                    </div>
                </div>
                <div class="client-progress-bar">
                    <div class="progress-fill" style="width: ${client.completionPercent || 0}%"></div>
                </div>
            </div>
            <div class="client-card-footer">
                <span class="client-industry">${client.industry || 'Defense'}</span>
                <div class="client-actions">
                    <button class="btn-icon" data-pd-action="open-client" data-client-id="${client.id}" title="Open Assessment">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                    </button>
                    <button class="btn-icon" data-pd-action="show-details" data-client-id="${client.id}" title="Details">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 16v-4M12 8h.01"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>`;
    },

    // Show the portfolio dashboard modal
    showPortfolioDashboard: function() {
        const modalHTML = `
        <div class="modal-overlay portfolio-modal" id="portfolio-modal">
            <div class="modal-content modal-fullscreen">
                <div class="modal-header">
                    <h2>Client Portfolio</h2>
                    <button class="modal-close" data-pd-action="close-modal" data-modal-id="portfolio-modal">×</button>
                </div>
                <div class="modal-body">
                    ${this.renderPortfolioDashboard()}
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this._bindModalEvents('portfolio-modal');
        this.initClientSearch();
    },

    initClientSearch: function() {
        const searchInput = document.getElementById('client-search');
        const filterSelect = document.getElementById('client-filter');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterClients());
        }
        if (filterSelect) {
            filterSelect.addEventListener('change', () => this.filterClients());
        }
    },

    filterClients: function() {
        const searchTerm = document.getElementById('client-search')?.value.toLowerCase() || '';
        const filterValue = document.getElementById('client-filter')?.value || 'all';
        
        const cards = document.querySelectorAll('.client-card');
        cards.forEach(card => {
            const clientId = card.dataset.clientId;
            const client = this.portfolioData.clients.find(c => c.id === clientId);
            
            if (!client) return;
            
            const matchesSearch = client.name.toLowerCase().includes(searchTerm) ||
                                 (client.industry || '').toLowerCase().includes(searchTerm);
            
            let matchesFilter = true;
            if (filterValue === 'at-risk') {
                matchesFilter = client.sprsScore !== null && client.sprsScore < 70;
            } else if (filterValue === 'completed') {
                matchesFilter = client.completionPercent >= 100;
            } else if (filterValue === 'active') {
                matchesFilter = client.status === 'active' && client.completionPercent < 100;
            }
            
            card.style.display = matchesSearch && matchesFilter ? '' : 'none';
        });
    },

    // Show add client modal
    showAddClientModal: function() {
        const modalHTML = `
        <div class="modal-overlay" id="add-client-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add New Client</h3>
                    <button class="modal-close" data-pd-action="close-modal" data-modal-id="add-client-modal">×</button>
                </div>
                <div class="modal-body">
                    <form id="add-client-form">
                        <div class="form-group">
                            <label>Organization Name *</label>
                            <input type="text" id="client-name" required placeholder="Enter organization name">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Assessment Level</label>
                                <select id="client-level">
                                    <option value="1">Level 1 (Foundational)</option>
                                    <option value="2" selected>Level 2 (Advanced)</option>
                                    <option value="3">Level 3 (Expert)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Industry</label>
                                <select id="client-industry">
                                    <option value="Defense">Defense</option>
                                    <option value="Aerospace">Aerospace</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="IT Services">IT Services</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Research">Research</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Contract Type</label>
                                <select id="client-contract">
                                    <option value="Prime">Prime Contractor</option>
                                    <option value="Sub">Subcontractor</option>
                                    <option value="Supplier">Supplier</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Target Assessment Date</label>
                                <input type="date" id="client-target-date">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Primary Contact</label>
                            <input type="text" id="client-contact" placeholder="Name and email">
                        </div>
                        <div class="form-group">
                            <label>Notes</label>
                            <textarea id="client-notes" rows="3" placeholder="Additional notes..."></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" data-pd-action="close-modal" data-modal-id="add-client-modal">Cancel</button>
                    <button class="btn-primary" data-pd-action="save-new-client">Add Client</button>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this._bindModalEvents('add-client-modal');
    },

    saveNewClient: function() {
        const name = document.getElementById('client-name')?.value;
        if (!name) {
            alert('Organization name is required');
            return;
        }

        const clientData = {
            name: name,
            assessmentLevel: parseInt(document.getElementById('client-level')?.value) || 2,
            industry: document.getElementById('client-industry')?.value || 'Defense',
            contractType: document.getElementById('client-contract')?.value || 'Prime',
            nextAssessment: document.getElementById('client-target-date')?.value || null,
            contacts: [{ name: document.getElementById('client-contact')?.value || '' }],
            notes: document.getElementById('client-notes')?.value || '',
            sprsScore: null,
            completionPercent: 0,
            poamCount: 0
        };

        this.addClient(clientData);
        document.getElementById('add-client-modal')?.remove();
        
        // Refresh the grid
        const grid = document.getElementById('client-grid');
        if (grid) {
            grid.innerHTML = this.portfolioData.clients.map(c => this.renderClientCard(c)).join('');
        }
    },

    openClient: function(clientId) {
        // Switch to the client's assessment
        const client = this.portfolioData.clients.find(c => c.id === clientId);
        if (client && typeof app !== 'undefined') {
            // Close portfolio modal
            document.getElementById('portfolio-modal')?.remove();
            
            // If using Supabase, switch organization
            if (typeof EvidenceUI !== 'undefined' && client.id) {
                EvidenceUI.selectOrganization(client.id);
            }
        }
    },

    showClientDetails: function(clientId) {
        const client = this.portfolioData.clients.find(c => c.id === clientId);
        if (!client) return;

        const modalHTML = `
        <div class="modal-overlay" id="client-details-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${client.name}</h3>
                    <button class="modal-close" data-pd-action="close-modal" data-modal-id="client-details-modal">×</button>
                </div>
                <div class="modal-body">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Assessment Level</label>
                            <span>Level ${client.assessmentLevel}</span>
                        </div>
                        <div class="detail-item">
                            <label>SPRS Score</label>
                            <span>${client.sprsScore !== null ? client.sprsScore : 'Not assessed'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Completion</label>
                            <span>${client.completionPercent || 0}%</span>
                        </div>
                        <div class="detail-item">
                            <label>POA&M Items</label>
                            <span>${client.poamCount || 0}</span>
                        </div>
                        <div class="detail-item">
                            <label>Industry</label>
                            <span>${client.industry || 'Defense'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Contract Type</label>
                            <span>${client.contractType || 'Prime'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Last Assessment</label>
                            <span>${client.lastAssessment ? new Date(client.lastAssessment).toLocaleDateString() : 'None'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Next Assessment</label>
                            <span>${client.nextAssessment ? new Date(client.nextAssessment).toLocaleDateString() : 'Not scheduled'}</span>
                        </div>
                    </div>
                    ${client.notes ? `
                    <div class="detail-notes">
                        <label>Notes</label>
                        <p>${this.esc(client.notes)}</p>
                    </div>
                    ` : ''}
                </div>
                <div class="modal-footer">
                    <button class="btn-danger" data-pd-action="remove-client" data-client-id="${client.id}">Remove</button>
                    <button class="btn-primary" data-pd-action="open-client" data-client-id="${client.id}">Open Assessment</button>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this._bindModalEvents('client-details-modal');
    },

    confirmRemoveClient: function(clientId) {
        if (confirm('Are you sure you want to remove this client from your portfolio? This does not delete their assessment data.')) {
            this.removeClient(clientId);
            document.getElementById('client-details-modal')?.remove();
            
            // Refresh the grid
            const grid = document.getElementById('client-grid');
            if (grid) {
                if (this.portfolioData.clients.length > 0) {
                    grid.innerHTML = this.portfolioData.clients.map(c => this.renderClientCard(c)).join('');
                } else {
                    grid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📋</div>
                        <h4>No Clients Yet</h4>
                        <p>Add your first client to start tracking CMMC assessments</p>
                        <button class="btn-primary add-client-btn">Add Client</button>
                    </div>`;
                }
            }
        }
    },

    _bindModalEvents: function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-pd-action]');
            if (!btn) return;
            const action = btn.dataset.pdAction;
            const clientId = btn.dataset.clientId || '';
            const mid = btn.dataset.modalId || '';
            switch (action) {
                case 'close-modal': document.getElementById(mid)?.remove(); break;
                case 'open-client': this.openClient(clientId); break;
                case 'show-details': this.showClientDetails(clientId); break;
                case 'save-new-client': this.saveNewClient(); break;
                case 'remove-client': this.confirmRemoveClient(clientId); break;
            }
        });
    },

    refreshPortfolio: function() {
        this.syncWithSupabase().then(() => {
            const grid = document.getElementById('client-grid');
            if (grid && this.portfolioData.clients.length > 0) {
                grid.innerHTML = this.portfolioData.clients.map(c => this.renderClientCard(c)).join('');
            }
        });
    },

    // Export portfolio summary
    exportPortfolioSummary: function() {
        const stats = this.calculatePortfolioStats();
        return {
            generatedAt: new Date().toISOString(),
            statistics: stats,
            clients: this.portfolioData.clients.map(c => ({
                name: c.name,
                level: c.assessmentLevel,
                sprsScore: c.sprsScore,
                completion: c.completionPercent,
                poamCount: c.poamCount,
                status: c.status
            }))
        };
    }
};

// Initialize on load
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => PortfolioDashboard.init());
    } else {
        PortfolioDashboard.init();
    }
}

// Export
if (typeof window !== 'undefined') {
    window.PortfolioDashboard = PortfolioDashboard;
}
