// NIST 800-171A / CMMC L2 Assessment Tool
// Main Application Logic

class AssessmentApp {
    constructor() {
        this.assessmentData = {};
        this.poamData = {};
        this.deficiencyData = {}; // Tracks non-POA&M eligible deficiencies
        this.implementationData = {}; // Tracks how objectives are met
        this.orgData = {}; // Organization info (assessor, OSC)
        this.currentView = 'dashboard';
        this.init();
    }

    init() {
        this.loadSavedData();
        this.populateFamilyFilter();
        this.renderControls();
        this.updateProgress();
        this.bindEvents();
        this.renderDashboard(); // Show dashboard on load
    }

    loadSavedData() {
        const savedAssessment = localStorage.getItem('nist-assessment-data');
        const savedPoam = localStorage.getItem('nist-poam-data');
        const savedDeficiency = localStorage.getItem('nist-deficiency-data');
        
        if (savedAssessment) {
            try {
                this.assessmentData = JSON.parse(savedAssessment);
            } catch (e) {
                this.assessmentData = {};
            }
        }
        
        if (savedPoam) {
            try {
                this.poamData = JSON.parse(savedPoam);
            } catch (e) {
                this.poamData = {};
            }
        }

        if (savedDeficiency) {
            try {
                this.deficiencyData = JSON.parse(savedDeficiency);
            } catch (e) {
                this.deficiencyData = {};
            }
        }

        const savedImplementation = localStorage.getItem('nist-implementation-data');
        if (savedImplementation) {
            try {
                this.implementationData = JSON.parse(savedImplementation);
            } catch (e) {
                this.implementationData = {};
            }
        }

        const savedOrg = localStorage.getItem('nist-org-data');
        if (savedOrg) {
            try {
                this.orgData = JSON.parse(savedOrg);
                // Populate the inputs - Assessor
                if (this.orgData.assessorName) {
                    document.getElementById('org-assessor-name').value = this.orgData.assessorName;
                }
                if (this.orgData.assessorUrl) {
                    document.getElementById('org-assessor-url').value = this.orgData.assessorUrl;
                }
                // Validate logo URL before displaying (clear bad cached URLs)
                if (this.orgData.assessorLogo && !this.orgData.assessorLogo.includes('https;')) {
                    this.displayLogo('assessor', this.orgData.assessorLogo);
                } else {
                    this.orgData.assessorLogo = null;
                }
                // Populate the inputs - OSC
                if (this.orgData.oscName) {
                    document.getElementById('org-osc-name').value = this.orgData.oscName;
                }
                if (this.orgData.oscUrl) {
                    document.getElementById('org-osc-url').value = this.orgData.oscUrl;
                }
                // Validate logo URL before displaying (clear bad cached URLs)
                if (this.orgData.oscLogo && !this.orgData.oscLogo.includes('https;')) {
                    this.displayLogo('osc', this.orgData.oscLogo);
                } else {
                    this.orgData.oscLogo = null;
                }
            } catch (e) {
                this.orgData = {};
            }
        }
    }

    saveData() {
        localStorage.setItem('nist-assessment-data', JSON.stringify(this.assessmentData));
        localStorage.setItem('nist-poam-data', JSON.stringify(this.poamData));
        localStorage.setItem('nist-deficiency-data', JSON.stringify(this.deficiencyData));
        localStorage.setItem('nist-implementation-data', JSON.stringify(this.implementationData));
        localStorage.setItem('nist-org-data', JSON.stringify(this.orgData));
        this.showToast('Progress saved successfully', 'success');
    }

    saveOrgData() {
        this.orgData = {
            assessorName: document.getElementById('org-assessor-name')?.value.trim() || '',
            assessorUrl: document.getElementById('org-assessor-url')?.value.trim() || '',
            assessorLogo: this.orgData.assessorLogo || null,
            oscName: document.getElementById('org-osc-name')?.value.trim() || '',
            oscUrl: document.getElementById('org-osc-url')?.value.trim() || '',
            oscLogo: this.orgData.oscLogo || null
        };
        localStorage.setItem('nist-org-data', JSON.stringify(this.orgData));
    }

    handleLogoUpload(file, type) {
        if (!file || !file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            if (type === 'assessor') {
                this.orgData.assessorLogo = base64;
                this.displayLogo('assessor', base64);
            } else {
                this.orgData.oscLogo = base64;
                this.displayLogo('osc', base64);
            }
            localStorage.setItem('nist-org-data', JSON.stringify(this.orgData));
        };
        reader.readAsDataURL(file);
    }

    fetchLogoFromUrl(type) {
        const urlInput = type === 'assessor' ? 'org-assessor-url' : 'org-osc-url';
        let url = document.getElementById(urlInput)?.value.trim();
        if (!url) return;
        
        // Clean up URL - extract domain (handle various input formats)
        let domain = url.toLowerCase().trim();
        
        // Remove protocol
        if (domain.includes('://')) {
            domain = domain.split('://')[1];
        }
        
        // Remove www prefix
        if (domain.startsWith('www.')) {
            domain = domain.substring(4);
        }
        
        // Remove path and query string
        domain = domain.split('/')[0];
        domain = domain.split('?')[0];
        domain = domain.split('#')[0];
        
        // Validate domain
        if (!domain || domain.length < 3 || !domain.includes('.')) {
            this.showToast('Please enter a valid domain (e.g., example.com)', 'error');
            return;
        }
        
        console.log('Fetching logo for domain:', domain);
        this.showToast('Fetching logo...', 'info');
        this.tryLogoWithValidation(null, type, domain, 0);
    }

    tryLogoWithValidation(logoUrl, type, domain, attempt) {
        const sources = [
            `https://logo.clearbit.com/${domain}`,
            `https://cdn.brandfetch.io/${domain}/w/400/h/400?c=1idFgHJQ1By`,
            `https://api.faviconkit.com/${domain}/144`,
            `https://icons.duckduckgo.com/ip3/${domain}.ico`,
            `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
        ];
        
        if (attempt >= sources.length) {
            this.showToast('Could not fetch logo - try uploading manually', 'error');
            return;
        }
        
        const currentUrl = sources[attempt];
        const testImg = new Image();
        let resolved = false;
        
        testImg.onload = () => {
            if (resolved) return;
            resolved = true;
            
            // Skip tiny images (likely placeholders) unless it's the last option
            if ((testImg.width < 32 || testImg.height < 32) && attempt < sources.length - 1) {
                this.tryLogoWithValidation(null, type, domain, attempt + 1);
                return;
            }
            
            if (type === 'assessor') {
                this.orgData.assessorLogo = currentUrl;
                this.displayLogo('assessor', currentUrl);
            } else {
                this.orgData.oscLogo = currentUrl;
                this.displayLogo('osc', currentUrl);
            }
            localStorage.setItem('nist-org-data', JSON.stringify(this.orgData));
            this.showToast('Logo fetched successfully', 'success');
        };
        
        testImg.onerror = () => {
            if (resolved) return;
            resolved = true;
            this.tryLogoWithValidation(null, type, domain, attempt + 1);
        };
        
        // Timeout for slow sources
        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                this.tryLogoWithValidation(null, type, domain, attempt + 1);
            }
        }, 2500);
        
        testImg.src = currentUrl;
    }

    displayLogo(type, src) {
        const placeholderId = type === 'assessor' ? 'assessor-logo-placeholder' : 'osc-logo-placeholder';
        const imgId = type === 'assessor' ? 'assessor-logo-img' : 'osc-logo-img';
        const placeholder = document.getElementById(placeholderId);
        const img = document.getElementById(imgId);
        
        if (src) {
            placeholder.style.display = 'none';
            img.src = src;
            img.style.display = 'block';
        } else {
            placeholder.style.display = 'flex';
            img.style.display = 'none';
            img.src = '';
        }
    }

    exportData() {
        const exportData = {
            assessment: this.assessmentData,
            poam: this.poamData,
            deficiencies: this.deficiencyData,
            implementation: this.implementationData,
            organization: this.orgData,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nist-assessment-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    loadDataFromFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data.assessment) this.assessmentData = data.assessment;
                    if (data.poam) this.poamData = data.poam;
                    if (data.deficiencies) this.deficiencyData = data.deficiencies;
                    if (data.implementation) this.implementationData = data.implementation;
                    if (data.organization) {
                        this.orgData = data.organization;
                        document.getElementById('org-assessor').value = this.orgData.assessor || '';
                        document.getElementById('org-osc').value = this.orgData.osc || '';
                    }
                    this.saveData();
                    this.renderControls();
                    this.updateProgress();
                    this.showToast('Data loaded successfully', 'success');
                } catch (err) {
                    this.showToast('Error loading file', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    populateFamilyFilter() {
        const select = document.getElementById('filter-family');
        CONTROL_FAMILIES.forEach(family => {
            const option = document.createElement('option');
            option.value = family.id;
            option.textContent = `${family.id} - ${family.name}`;
            select.appendChild(option);
        });
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        // Search
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filterControls();
        });

        // Filters
        document.getElementById('filter-status').addEventListener('change', () => this.filterControls());
        document.getElementById('filter-family').addEventListener('change', () => this.filterControls());

        // Save/Load/Export
        document.getElementById('save-btn').addEventListener('click', () => this.saveData());
        document.getElementById('load-btn').addEventListener('click', () => this.loadDataFromFile());
        document.getElementById('export-btn').addEventListener('click', () => this.exportPOAMCSV());
        document.getElementById('export-csv-btn')?.addEventListener('click', () => this.exportPOAMCSV());
        document.getElementById('export-assessment-btn')?.addEventListener('click', () => this.exportAssessmentCSV());
        document.getElementById('mark-all-not-met-btn')?.addEventListener('click', () => this.markAllNotMet());

        // POA&M Modal
        document.querySelector('#poam-modal .modal-close')?.addEventListener('click', () => this.closeModal());
        document.querySelector('#poam-modal .btn-cancel')?.addEventListener('click', () => this.closeModal());
        document.getElementById('poam-form')?.addEventListener('submit', (e) => this.savePoamEntry(e));
        
        // Close POA&M modal on outside click
        document.getElementById('poam-modal')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });

        // Implementation Modal
        document.getElementById('implementation-form')?.addEventListener('submit', (e) => this.saveImplementationEntry(e));
        
        // Close implementation modal on outside click
        document.getElementById('implementation-modal')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeImplementationModal();
            }
        });

        // Org info auto-save on blur
        document.getElementById('org-assessor-name')?.addEventListener('blur', () => this.saveOrgData());
        document.getElementById('org-assessor-url')?.addEventListener('blur', () => {
            // Clear logo when URL changes
            this.orgData.assessorLogo = null;
            this.displayLogo('assessor', null);
            this.saveOrgData();
        });
        document.getElementById('org-osc-name')?.addEventListener('blur', () => this.saveOrgData());
        document.getElementById('org-osc-url')?.addEventListener('blur', () => {
            // Clear logo when URL changes
            this.orgData.oscLogo = null;
            this.displayLogo('osc', null);
            this.saveOrgData();
        });

        // Assessor Logo upload (click on placeholder)
        const assessorLogoContainer = document.getElementById('assessor-logo-container');
        const assessorLogoInput = document.getElementById('assessor-logo-input');
        
        assessorLogoContainer?.addEventListener('click', () => {
            assessorLogoInput?.click();
        });
        
        assessorLogoInput?.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.handleLogoUpload(e.target.files[0], 'assessor');
            }
        });

        // OSC Logo upload (click on placeholder)
        const oscLogoContainer = document.getElementById('osc-logo-container');
        const oscLogoInput = document.getElementById('osc-logo-input');
        
        oscLogoContainer?.addEventListener('click', () => {
            oscLogoInput?.click();
        });
        
        oscLogoInput?.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.handleLogoUpload(e.target.files[0], 'osc');
            }
        });

        // Fetch logo from URL buttons
        document.getElementById('fetch-assessor-logo-btn')?.addEventListener('click', () => {
            this.fetchLogoFromUrl('assessor');
        });
        document.getElementById('fetch-osc-logo-btn')?.addEventListener('click', () => {
            this.fetchLogoFromUrl('osc');
        });
    }

    switchView(view) {
        this.currentView = view;
        
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Update views
        document.querySelectorAll('.view').forEach(v => {
            v.classList.toggle('active', v.id === `${view}-view`);
        });

        // Render view content
        if (view === 'poam') {
            this.renderPOAM();
        } else if (view === 'dashboard') {
            this.renderDashboard();
        }
    }

    renderControls() {
        const container = document.getElementById('controls-list');
        container.innerHTML = '';

        CONTROL_FAMILIES.forEach(family => {
            const familyEl = this.createFamilyElement(family);
            container.appendChild(familyEl);
        });
    }

    createFamilyElement(family) {
        const familyDiv = document.createElement('div');
        familyDiv.className = 'control-family';
        familyDiv.dataset.familyId = family.id;

        // Calculate family stats
        const stats = this.calculateFamilyStats(family);

        familyDiv.innerHTML = `
            <div class="family-header">
                <div class="family-title">
                    <span class="family-id">${family.id}</span>
                    <h3>${family.name}</h3>
                </div>
                <div class="family-stats">
                    <div class="stat-badge met"><span class="count">${stats.met}</span> Met</div>
                    <div class="stat-badge partial"><span class="count">${stats.partial}</span> Partial</div>
                    <div class="stat-badge not-met"><span class="count">${stats.notMet}</span> Not Met</div>
                    <svg class="family-chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
            </div>
            <div class="family-controls"></div>
        `;

        const header = familyDiv.querySelector('.family-header');
        const controlsContainer = familyDiv.querySelector('.family-controls');

        header.addEventListener('click', () => {
            header.classList.toggle('expanded');
            controlsContainer.classList.toggle('expanded');
        });

        family.controls.forEach(control => {
            const controlEl = this.createControlElement(control, family.id);
            controlsContainer.appendChild(controlEl);
        });

        return familyDiv;
    }

    createControlElement(control, familyId) {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'control-item';
        controlDiv.dataset.controlId = control.id;

        // Get SPRS scoring info
        const pointValue = control.pointValue || 1;
        const poamEligibility = control.poamEligibility || {};
        const canBeOnPoam = poamEligibility.selfAssessment?.canBeOnPoam !== false;
        const isNeverPoam = SPRS_SCORING?.neverPoam?.includes(control.id);
        const cmmcId = control.cmmcPracticeId || '';

        // Point value badge styling
        const pointClass = pointValue >= 5 ? 'high' : pointValue >= 3 ? 'medium' : 'low';
        const poamWarning = isNeverPoam ? '<span class="poam-warning" title="Cannot be on POA&M per 32 CFR 170.21">⚠️ No POA&M</span>' : 
                           (pointValue > 1 && control.id !== '3.13.11') ? '<span class="poam-caution" title="Point value > 1, cannot be on POA&M for Conditional status">⚡ Requires Implementation</span>' : '';

        controlDiv.innerHTML = `
            <div class="control-header" data-family-id="${familyId}">
                <div class="control-info">
                    <div class="control-id">
                        ${control.id} - ${control.name}
                        <span class="sprs-badge ${pointClass}" title="SPRS Point Value">${pointValue} ${pointValue === 1 ? 'pt' : 'pts'}</span>
                        ${poamWarning}
                    </div>
                    <div class="control-meta">${cmmcId}</div>
                    <div class="control-name">${control.description}</div>
                </div>
                <svg class="control-chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div class="control-objectives"></div>
        `;

        const header = controlDiv.querySelector('.control-header');
        const objectivesContainer = controlDiv.querySelector('.control-objectives');

        header.addEventListener('click', () => {
            header.classList.toggle('expanded');
            objectivesContainer.classList.toggle('expanded');
        });

        control.objectives.forEach(objective => {
            const objectiveEl = this.createObjectiveElement(objective, control.id, familyId);
            objectivesContainer.appendChild(objectiveEl);
        });

        return controlDiv;
    }

    createObjectiveElement(objective, controlId, familyId) {
        const objectiveDiv = document.createElement('div');
        objectiveDiv.className = 'objective-item';
        objectiveDiv.dataset.objectiveId = objective.id;

        const status = this.assessmentData[objective.id]?.status || 'not-assessed';
        const hasImplData = !!this.implementationData[objective.id]?.description;
        const hasPoamData = !!(this.poamData[objective.id] || this.deficiencyData[objective.id]);
        const showPoamLink = status === 'not-met' || status === 'partial';
        const xrefId = typeof CTRL_XREF !== 'undefined' ? (CTRL_XREF[objective.id] || '') : '';

        objectiveDiv.innerHTML = `
            <div class="objective-main">
                <button class="objective-expand" title="Show details">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <div class="objective-info">
                    <div class="objective-id">${objective.id}</div>
                    <div class="objective-text">${objective.text}</div>
                </div>
                <div class="objective-actions">
                    <button class="status-btn ${status === 'met' ? 'met' : ''}" data-status="met">Met</button>
                    <button class="status-btn ${status === 'partial' ? 'partial' : ''}" data-status="partial">Partial</button>
                    <button class="status-btn ${status === 'not-met' ? 'not-met' : ''}" data-status="not-met">Not Met</button>
                    <button class="impl-link ${hasImplData ? 'has-data' : ''}" title="Document Implementation">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                </div>
            </div>
            <div class="objective-details">
                <div class="detail-row"><span class="detail-label">External Ref:</span> <span class="detail-value">${xrefId || 'N/A'}</span></div>
            </div>
        `;

        // Bind status buttons
        objectiveDiv.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.setObjectiveStatus(objective.id, btn.dataset.status, objectiveDiv, controlId, familyId);
            });
        });

        // Bind Implementation Notes link
        objectiveDiv.querySelector('.impl-link').addEventListener('click', (e) => {
            e.stopPropagation();
            this.openImplementationModal(objective, controlId);
        });

        // Bind expand button
        objectiveDiv.querySelector('.objective-expand').addEventListener('click', (e) => {
            e.stopPropagation();
            objectiveDiv.classList.toggle('expanded');
        });

        // Add POA&M link for not-met/partial items
        if (showPoamLink) {
            const poamLink = document.createElement('button');
            poamLink.className = `poam-link visible ${hasPoamData ? 'has-data' : ''}`;
            poamLink.title = 'Add to POA&M';
            poamLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>`;
            poamLink.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openPoamModal(objective, controlId);
            });
            objectiveDiv.querySelector('.objective-actions').appendChild(poamLink);
        }

        return objectiveDiv;
    }

    // Implementation Notes Modal Functions
    openImplementationModal(objective, controlId) {
        const modal = document.getElementById('implementation-modal');
        const existingData = this.implementationData[objective.id] || {};

        // Get control info
        let control = null;
        CONTROL_FAMILIES.forEach(family => {
            family.controls.forEach(c => {
                if (c.id === controlId) control = c;
            });
        });

        const cmmcId = control?.cmmcPracticeId || controlId;

        document.getElementById('impl-objective-id').value = objective.id;
        document.getElementById('impl-control-id').value = `${cmmcId} - ${objective.id}`;
        document.getElementById('impl-requirement').value = objective.text;
        document.getElementById('impl-description').value = existingData.description || '';
        document.getElementById('impl-evidence').value = existingData.evidence || '';
        document.getElementById('impl-responsible').value = existingData.responsible || '';
        document.getElementById('impl-verified-date').value = existingData.verifiedDate || '';
        document.getElementById('impl-notes').value = existingData.notes || '';

        modal.classList.add('active');
    }

    closeImplementationModal() {
        document.getElementById('implementation-modal').classList.remove('active');
    }

    saveImplementationEntry(e) {
        e.preventDefault();
        
        const objectiveId = document.getElementById('impl-objective-id').value;
        const description = document.getElementById('impl-description').value.trim();
        
        this.implementationData[objectiveId] = {
            description: description,
            evidence: document.getElementById('impl-evidence').value,
            responsible: document.getElementById('impl-responsible').value,
            verifiedDate: document.getElementById('impl-verified-date').value,
            notes: document.getElementById('impl-notes').value,
            updatedAt: new Date().toISOString()
        };

        // If description is empty, remove the entry entirely
        if (!description) {
            delete this.implementationData[objectiveId];
        }

        localStorage.setItem('nist-implementation-data', JSON.stringify(this.implementationData));
        
        // Update link indicator based on whether description has content
        const objectiveEl = document.querySelector(`.objective-item[data-objective-id="${objectiveId}"]`);
        if (objectiveEl) {
            const implLink = objectiveEl.querySelector('.impl-link');
            if (description) {
                implLink.classList.add('has-data');
            } else {
                implLink.classList.remove('has-data');
            }
        }

        this.closeImplementationModal();
        this.showToast(description ? 'Implementation details saved' : 'Implementation details cleared', 'success');
    }

    setObjectiveStatus(objectiveId, status, objectiveDiv, controlId, familyId) {
        // Toggle off if same status clicked
        const currentStatus = this.assessmentData[objectiveId]?.status;
        if (currentStatus === status) {
            delete this.assessmentData[objectiveId];
            status = 'not-assessed';
        } else {
            this.assessmentData[objectiveId] = { 
                status, 
                updatedAt: new Date().toISOString(),
                controlId,
                familyId
            };
        }

        // Update UI
        objectiveDiv.querySelectorAll('.status-btn').forEach(btn => {
            btn.classList.remove('met', 'partial', 'not-met');
            if (btn.dataset.status === status) {
                btn.classList.add(status);
            }
        });

        // Show/hide POAM link - create if doesn't exist
        let poamLink = objectiveDiv.querySelector('.poam-link');
        if (status === 'not-met' || status === 'partial') {
            if (!poamLink) {
                poamLink = document.createElement('button');
                poamLink.className = 'poam-link visible';
                poamLink.title = 'Add to POA&M';
                poamLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>`;
                poamLink.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const objective = this.findObjectiveById(objectiveId);
                    if (objective) {
                        this.openPoamModal(objective, controlId);
                    }
                });
                objectiveDiv.querySelector('.objective-actions').appendChild(poamLink);
            } else {
                poamLink.classList.add('visible');
            }
        } else if (poamLink) {
            poamLink.classList.remove('visible');
        }

        // Update family stats
        this.updateFamilyStats(familyId);
        this.updateProgress();
        
        // Auto-save
        localStorage.setItem('nist-assessment-data', JSON.stringify(this.assessmentData));
    }

    findObjectiveById(objectiveId) {
        for (const family of CONTROL_FAMILIES) {
            for (const control of family.controls) {
                const objective = control.objectives.find(o => o.id === objectiveId);
                if (objective) return objective;
            }
        }
        return null;
    }

    updateFamilyStats(familyId) {
        const family = CONTROL_FAMILIES.find(f => f.id === familyId);
        if (!family) return;

        const stats = this.calculateFamilyStats(family);
        const familyEl = document.querySelector(`.control-family[data-family-id="${familyId}"]`);
        
        if (familyEl) {
            familyEl.querySelector('.stat-badge.met .count').textContent = stats.met;
            familyEl.querySelector('.stat-badge.partial .count').textContent = stats.partial;
            familyEl.querySelector('.stat-badge.not-met .count').textContent = stats.notMet;
        }
    }

    calculateFamilyStats(family) {
        let met = 0, partial = 0, notMet = 0;
        
        family.controls.forEach(control => {
            control.objectives.forEach(objective => {
                const status = this.assessmentData[objective.id]?.status;
                if (status === 'met') met++;
                else if (status === 'partial') partial++;
                else if (status === 'not-met') notMet++;
            });
        });

        return { met, partial, notMet };
    }

    calculateControlsMet() {
        // Count how many controls have ALL objectives met
        let controlsMet = 0;
        
        CONTROL_FAMILIES.forEach(family => {
            family.controls.forEach(control => {
                const allObjectivesMet = control.objectives.every(objective => {
                    return this.assessmentData[objective.id]?.status === 'met';
                });
                if (allObjectivesMet && control.objectives.length > 0) {
                    controlsMet++;
                }
            });
        });
        
        return controlsMet;
    }

    updateProgress() {
        let total = 0, assessed = 0, met = 0, partial = 0, notMet = 0;

        CONTROL_FAMILIES.forEach(family => {
            family.controls.forEach(control => {
                control.objectives.forEach(objective => {
                    total++;
                    const status = this.assessmentData[objective.id]?.status;
                    if (status) {
                        assessed++;
                        if (status === 'met') met++;
                        else if (status === 'partial') partial++;
                        else if (status === 'not-met') notMet++;
                    }
                });
            });
        });

        // Update text
        document.getElementById('progress-text').textContent = `${assessed} of ${total} assessed`;
        
        const complianceRate = assessed > 0 ? Math.round((met / assessed) * 100) : 0;
        document.getElementById('compliance-text').textContent = `${complianceRate}% compliant`;

        // Update progress bars
        const metWidth = (met / total) * 100;
        const partialWidth = (partial / total) * 100;
        const notMetWidth = (notMet / total) * 100;

        document.getElementById('progress-met').style.width = `${metWidth}%`;
        document.getElementById('progress-partial').style.width = `${partialWidth}%`;
        document.getElementById('progress-not-met').style.width = `${notMetWidth}%`;
    }

    filterControls() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const statusFilter = document.getElementById('filter-status').value;
        const familyFilter = document.getElementById('filter-family').value;

        document.querySelectorAll('.control-family').forEach(familyEl => {
            const familyId = familyEl.dataset.familyId;
            
            // Family filter
            if (familyFilter !== 'all' && familyId !== familyFilter) {
                familyEl.style.display = 'none';
                return;
            }

            let familyHasVisibleItems = false;

            familyEl.querySelectorAll('.control-item').forEach(controlEl => {
                let controlHasVisibleItems = false;

                controlEl.querySelectorAll('.objective-item').forEach(objectiveEl => {
                    const objectiveId = objectiveEl.dataset.objectiveId;
                    const objectiveText = objectiveEl.querySelector('.objective-text').textContent.toLowerCase();
                    const status = this.assessmentData[objectiveId]?.status || 'not-assessed';

                    // Check search match
                    const matchesSearch = !searchTerm || 
                        objectiveId.toLowerCase().includes(searchTerm) ||
                        objectiveText.includes(searchTerm);

                    // Check status filter
                    const matchesStatus = statusFilter === 'all' || status === statusFilter;

                    if (matchesSearch && matchesStatus) {
                        objectiveEl.style.display = '';
                        controlHasVisibleItems = true;
                    } else {
                        objectiveEl.style.display = 'none';
                    }
                });

                controlEl.style.display = controlHasVisibleItems ? '' : 'none';
                if (controlHasVisibleItems) familyHasVisibleItems = true;
            });

            familyEl.style.display = familyHasVisibleItems ? '' : 'none';
        });
    }

    // POA&M Functions
    openPoamModal(objective, controlId) {
        const modal = document.getElementById('poam-modal');
        const existingData = this.poamData[objective.id] || {};

        // Get control and check POA&M eligibility
        let control = null;
        CONTROL_FAMILIES.forEach(family => {
            family.controls.forEach(c => {
                if (c.id === controlId) control = c;
            });
        });

        const pointValue = control?.pointValue || 1;
        const isNeverPoam = SPRS_SCORING?.neverPoam?.includes(controlId);
        const isFipsException = controlId === '3.13.11';
        const cmmcId = control?.cmmcPracticeId || controlId;

        // Build warning message
        let warningHtml = '';
        if (isNeverPoam) {
            warningHtml = `
                <div class="poam-eligibility-warning critical">
                    <strong>⛔ Cannot be on POA&M</strong><br>
                    ${cmmcId} is listed in 32 CFR 170.21(a)(2)(iii) and cannot be included on a POA&M 
                    for Conditional Level 2 (Self) or Conditional Level 2 (C3PAO) status.
                    <br><strong>This requirement must be fully implemented before assessment.</strong>
                </div>
            `;
        } else if (pointValue > 1 && !isFipsException) {
            warningHtml = `
                <div class="poam-eligibility-warning high">
                    <strong>⚠️ POA&M Eligibility Warning</strong><br>
                    ${cmmcId} has a point value of <strong>${pointValue}</strong>. 
                    Per 32 CFR 170.21(a)(2)(ii), requirements with point value > 1 cannot be on a POA&M 
                    for Conditional Level 2 status (except SC.L2-3.13.11).
                    <br><strong>This requirement should be fully implemented.</strong>
                </div>
            `;
        } else if (isFipsException) {
            warningHtml = `
                <div class="poam-eligibility-warning info">
                    <strong>ℹ️ FIPS Exception Applies</strong><br>
                    ${cmmcId} CUI Encryption may be included on a POA&M if encryption is employed 
                    but it is not FIPS-validated (point value of 3).
                </div>
            `;
        } else {
            warningHtml = `
                <div class="poam-eligibility-warning ok">
                    <strong>✅ POA&M Eligible</strong><br>
                    ${cmmcId} has a point value of <strong>${pointValue}</strong> and can be included on a POA&M 
                    for Conditional Level 2 status.
                </div>
            `;
        }

        // Update modal with warning
        let warningContainer = document.getElementById('poam-eligibility-container');
        if (!warningContainer) {
            warningContainer = document.createElement('div');
            warningContainer.id = 'poam-eligibility-container';
            const form = document.getElementById('poam-form');
            form.insertBefore(warningContainer, form.firstChild);
        }
        warningContainer.innerHTML = warningHtml;

        // For never-POA&M controls, use deficiency data instead
        const dataSource = isNeverPoam ? this.deficiencyData[objective.id] : existingData;
        const formData = dataSource || {};

        document.getElementById('poam-objective-id').value = objective.id;
        document.getElementById('poam-control-id').value = `${cmmcId} - ${objective.id} (${pointValue} ${pointValue === 1 ? 'pt' : 'pts'})`;
        document.getElementById('poam-weakness').value = formData.weakness || objective.text;
        document.getElementById('poam-remediation').value = formData.remediation || '';
        document.getElementById('poam-date').value = formData.scheduledDate || '';
        document.getElementById('poam-responsible').value = formData.responsible || '';
        document.getElementById('poam-risk').value = formData.risk || 'moderate';
        document.getElementById('poam-cost').value = formData.cost || '';
        document.getElementById('poam-notes').value = formData.notes || '';

        // Store whether this is a never-POA&M item for save handling
        document.getElementById('poam-form').dataset.isNeverPoam = isNeverPoam ? 'true' : 'false';
        document.getElementById('poam-form').dataset.controlId = controlId;

        // Update modal title and button text for never-POA&M items
        const modalTitle = document.querySelector('.modal-header h3');
        const saveButton = document.querySelector('.btn-save');
        if (isNeverPoam) {
            modalTitle.textContent = '⛔ Track Deficiency (Not POA&M Eligible)';
            saveButton.textContent = 'Save Deficiency';
        } else {
            modalTitle.textContent = 'POA&M Entry';
            saveButton.textContent = 'Save Entry';
        }

        modal.classList.add('active');
    }

    closeModal() {
        document.getElementById('poam-modal').classList.remove('active');
    }

    savePoamEntry(e) {
        e.preventDefault();
        
        const objectiveId = document.getElementById('poam-objective-id').value;
        const isNeverPoam = document.getElementById('poam-form').dataset.isNeverPoam === 'true';
        const controlId = document.getElementById('poam-form').dataset.controlId;
        
        const entryData = {
            weakness: document.getElementById('poam-weakness').value,
            remediation: document.getElementById('poam-remediation').value,
            scheduledDate: document.getElementById('poam-date').value,
            responsible: document.getElementById('poam-responsible').value,
            risk: document.getElementById('poam-risk').value,
            cost: document.getElementById('poam-cost').value,
            notes: document.getElementById('poam-notes').value,
            controlId: controlId,
            updatedAt: new Date().toISOString()
        };

        if (isNeverPoam) {
            // Save to deficiency tracking, NOT POA&M
            this.deficiencyData[objectiveId] = entryData;
            localStorage.setItem('nist-deficiency-data', JSON.stringify(this.deficiencyData));
            
            // Remove from POA&M if it was incorrectly added before
            if (this.poamData[objectiveId]) {
                delete this.poamData[objectiveId];
                localStorage.setItem('nist-poam-data', JSON.stringify(this.poamData));
            }
            
            this.closeModal();
            this.showToast('Deficiency tracked (not added to POA&M)', 'info');
        } else {
            // Save to POA&M as normal
            this.poamData[objectiveId] = entryData;
            localStorage.setItem('nist-poam-data', JSON.stringify(this.poamData));
            
            this.closeModal();
            this.showToast('POA&M entry saved', 'success');
        }
        
        // Update link indicator
        const objectiveEl = document.querySelector(`.objective-item[data-objective-id="${objectiveId}"]`);
        if (objectiveEl) {
            objectiveEl.querySelector('.poam-link').classList.add('has-data');
        }

        // Refresh POA&M view if currently visible
        if (this.currentView === 'poam') {
            this.renderPOAM();
        }
    }

    renderPOAM() {
        const container = document.getElementById('poam-content');
        
        // Calculate CMMC Conditional Status eligibility (88/110 = 80%)
        const controlsMet = this.calculateControlsMet();
        const conditionalThreshold = 88;
        const meetsConditionalThreshold = controlsMet >= conditionalThreshold;
        const conditionalStatusClass = meetsConditionalThreshold ? 'eligible' : 'not-eligible';
        const conditionalStatusIcon = meetsConditionalThreshold ? '✅' : '⚠️';

        // Separate POA&M eligible items from never-POA&M deficiencies
        const poamItems = [];
        const deficiencyItems = [];
        
        CONTROL_FAMILIES.forEach(family => {
            family.controls.forEach(control => {
                const isNeverPoam = SPRS_SCORING?.neverPoam?.includes(control.id);
                
                control.objectives.forEach(objective => {
                    const assessment = this.assessmentData[objective.id];
                    if (assessment && (assessment.status === 'not-met' || assessment.status === 'partial')) {
                        const item = {
                            familyId: family.id,
                            familyName: family.name,
                            controlId: control.id,
                            controlName: control.name,
                            objectiveId: objective.id,
                            objectiveText: objective.text,
                            status: assessment.status,
                            poamData: isNeverPoam ? (this.deficiencyData[objective.id] || {}) : (this.poamData[objective.id] || {}),
                            pointValue: control.pointValue || 1,
                            cmmcId: control.cmmcPracticeId || control.id,
                            isNeverPoam: isNeverPoam
                        };
                        
                        if (isNeverPoam) {
                            deficiencyItems.push(item);
                        } else {
                            poamItems.push(item);
                        }
                    }
                });
            });
        });

        if (poamItems.length === 0 && deficiencyItems.length === 0) {
            container.innerHTML = `
                <div class="poam-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <h3>No POA&M Items</h3>
                    <p>Mark assessment objectives as "Not Met" or "Partial" to add them to the POA&M.</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="conditional-status-banner ${conditionalStatusClass}">
                <div class="conditional-status-header">
                    ${conditionalStatusIcon} <strong>CMMC Conditional Level 2 Status</strong>
                </div>
                <div class="conditional-status-body">
                    <div class="conditional-score">
                        <span class="score-current">${controlsMet}</span>
                        <span class="score-separator">/</span>
                        <span class="score-required">110</span>
                        <span class="score-label">controls implemented</span>
                    </div>
                    <div class="conditional-message">
                        ${meetsConditionalThreshold 
                            ? 'You meet the minimum 88/110 (80%) threshold. POA&M items below may be used for Conditional Level 2 status.'
                            : `<strong>POA&M not yet permitted.</strong> You need ${conditionalThreshold - controlsMet} more controls to reach 88/110 (80%) before a POA&M can be used for Conditional Level 2 status.`
                        }
                    </div>
                    <div class="conditional-note">
                        Per 32 CFR 170.21: Assessment score ÷ total requirements must be ≥ 0.8 before a POA&M is permitted.
                    </div>
                </div>
            </div>
        `;

        // Deficiencies section (never-POA&M items) - show first as critical
        if (deficiencyItems.length > 0) {
            html += `
                <div class="deficiency-section">
                    <h3 class="section-title critical">
                        ⛔ Critical Deficiencies - Cannot Be On POA&M (${deficiencyItems.length})
                    </h3>
                    <p class="section-description">These controls are listed in 32 CFR 170.21(a)(2)(iii) and must be fully implemented before assessment. They cannot be included on a POA&M for Conditional Level 2 status.</p>
                    <table class="poam-table deficiency-table">
                        <thead>
                            <tr>
                                <th>Control ID</th>
                                <th>SPRS Pts</th>
                                <th>Objective</th>
                                <th>Status</th>
                                <th>Remediation Plan</th>
                                <th>Target Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="deficiency-tbody"></tbody>
                    </table>
                </div>
            `;
        }

        // POA&M section
        if (poamItems.length > 0) {
            html += `
                <div class="poam-section">
                    <h3 class="section-title">📋 POA&M Items (${poamItems.length})</h3>
                    <table class="poam-table">
                        <thead>
                            <tr>
                                <th>Control ID</th>
                                <th>SPRS Pts</th>
                                <th>POA&M OK?</th>
                                <th>Objective</th>
                                <th>Status</th>
                                <th>Remediation</th>
                                <th>Due Date</th>
                                <th>Risk</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="poam-tbody"></tbody>
                    </table>
                </div>
            `;
        }

        container.innerHTML = html;

        // Render deficiency items
        if (deficiencyItems.length > 0) {
            const deficiencyTbody = container.querySelector('#deficiency-tbody');
            deficiencyItems.forEach(item => {
                const pointClass = item.pointValue >= 5 ? 'high' : item.pointValue >= 3 ? 'medium' : 'low';
                const tr = document.createElement('tr');
                tr.className = 'row-critical';
                tr.innerHTML = `
                    <td><strong>${item.cmmcId}</strong><br><small>${item.objectiveId}</small></td>
                    <td><span class="sprs-badge ${pointClass}">${item.pointValue}</span></td>
                    <td>${item.objectiveText}</td>
                    <td><span class="status-badge ${item.status}">${item.status === 'not-met' ? 'Not Met' : 'Partial'}</span></td>
                    <td>${item.poamData.remediation || '-'}</td>
                    <td>${item.poamData.scheduledDate || '-'}</td>
                    <td><button class="edit-poam-btn" data-objective-id="${item.objectiveId}" data-control-id="${item.controlId}">Edit</button></td>
                `;
                
                tr.querySelector('.edit-poam-btn').addEventListener('click', () => {
                    const objective = { id: item.objectiveId, text: item.objectiveText };
                    this.openPoamModal(objective, item.controlId);
                });
                
                deficiencyTbody.appendChild(tr);
            });
        }

        // Render POA&M items
        if (poamItems.length > 0) {
            const poamTbody = container.querySelector('#poam-tbody');
            poamItems.forEach(item => {
                const isFipsException = item.controlId === '3.13.11';
                
                let poamStatus, poamClass;
                if (item.pointValue > 1 && !isFipsException) {
                    poamStatus = '⚠️ No';
                    poamClass = 'poam-no';
                } else if (isFipsException) {
                    poamStatus = 'ℹ️ FIPS*';
                    poamClass = 'poam-fips';
                } else {
                    poamStatus = '✅ Yes';
                    poamClass = 'poam-yes';
                }

                const pointClass = item.pointValue >= 5 ? 'high' : item.pointValue >= 3 ? 'medium' : 'low';

                const tr = document.createElement('tr');
                tr.className = (item.pointValue > 1 && !isFipsException) ? 'row-warning' : '';
                tr.innerHTML = `
                    <td><strong>${item.cmmcId}</strong><br><small>${item.objectiveId}</small></td>
                    <td><span class="sprs-badge ${pointClass}">${item.pointValue}</span></td>
                    <td><span class="poam-status ${poamClass}">${poamStatus}</span></td>
                    <td>${item.objectiveText}</td>
                    <td><span class="status-badge ${item.status}">${item.status === 'not-met' ? 'Not Met' : 'Partial'}</span></td>
                    <td>${item.poamData.remediation || '-'}</td>
                    <td>${item.poamData.scheduledDate || '-'}</td>
                    <td>${item.poamData.risk ? `<span class="risk-badge ${item.poamData.risk}">${item.poamData.risk}</span>` : '-'}</td>
                    <td><button class="edit-poam-btn" data-objective-id="${item.objectiveId}" data-control-id="${item.controlId}">Edit</button></td>
                `;
                
                tr.querySelector('.edit-poam-btn').addEventListener('click', () => {
                    const objective = { id: item.objectiveId, text: item.objectiveText };
                    this.openPoamModal(objective, item.controlId);
                });
                
                poamTbody.appendChild(tr);
            });
        }
    }

    renderDashboard() {
        const container = document.getElementById('dashboard-content');
        
        // Calculate overall stats
        let totalObjectives = 0, totalMet = 0, totalPartial = 0, totalNotMet = 0, totalNotAssessed = 0;
        
        CONTROL_FAMILIES.forEach(family => {
            family.controls.forEach(control => {
                control.objectives.forEach(objective => {
                    totalObjectives++;
                    const status = this.assessmentData[objective.id]?.status;
                    if (status === 'met') totalMet++;
                    else if (status === 'partial') totalPartial++;
                    else if (status === 'not-met') totalNotMet++;
                    else totalNotAssessed++;
                });
            });
        });

        // Calculate CMMC Conditional Status eligibility (88/110 = 80%)
        const controlsMet = this.calculateControlsMet();
        const conditionalThreshold = 88;
        const meetsConditionalThreshold = controlsMet >= conditionalThreshold;
        const conditionalStatusClass = meetsConditionalThreshold ? 'eligible' : 'not-eligible';
        const conditionalStatusIcon = meetsConditionalThreshold ? '✅' : '⚠️';

        let html = `
            <div class="conditional-status-banner ${conditionalStatusClass}">
                <div class="conditional-status-header">
                    ${conditionalStatusIcon} <strong>CMMC Conditional Level 2 Status</strong>
                </div>
                <div class="conditional-status-body">
                    <div class="conditional-score">
                        <span class="score-current">${controlsMet}</span>
                        <span class="score-separator">/</span>
                        <span class="score-required">110</span>
                        <span class="score-label">controls implemented</span>
                    </div>
                    <div class="conditional-message">
                        ${meetsConditionalThreshold 
                            ? 'You meet the minimum 88/110 (80%) threshold for Conditional Level 2 status eligibility.'
                            : `You need <strong>${conditionalThreshold - controlsMet} more controls</strong> to reach the 88/110 (80%) minimum required for Conditional Level 2 status.`
                        }
                    </div>
                    <div class="conditional-note">
                        Per 32 CFR 170.21: Assessment score ÷ total requirements must be ≥ 0.8 before a POA&M is permitted.
                    </div>
                </div>
            </div>

            <div class="dashboard-card summary-card">
                <div class="summary-stat">
                    <div class="summary-stat-value">${totalObjectives}</div>
                    <div class="summary-stat-label">Total Objectives</div>
                </div>
                <div class="summary-stat">
                    <div class="summary-stat-value" style="color: var(--status-met)">${totalMet}</div>
                    <div class="summary-stat-label">Met</div>
                </div>
                <div class="summary-stat">
                    <div class="summary-stat-value" style="color: var(--status-partial)">${totalPartial}</div>
                    <div class="summary-stat-label">Partial</div>
                </div>
                <div class="summary-stat">
                    <div class="summary-stat-value" style="color: var(--status-not-met)">${totalNotMet}</div>
                    <div class="summary-stat-label">Not Met</div>
                </div>
                <div class="summary-stat">
                    <div class="summary-stat-value" style="color: var(--text-muted)">${totalNotAssessed}</div>
                    <div class="summary-stat-label">Not Assessed</div>
                </div>
            </div>
        `;

        // Family cards
        CONTROL_FAMILIES.forEach(family => {
            const stats = this.calculateFamilyStats(family);
            let familyTotal = 0;
            family.controls.forEach(c => familyTotal += c.objectives.length);
            const notAssessed = familyTotal - stats.met - stats.partial - stats.notMet;

            html += `
                <div class="dashboard-card">
                    <h3 class="dashboard-family-link" data-family-id="${family.id}"><span class="family-id">${family.id}</span> ${family.name}</h3>
                    <div class="dashboard-card-stats">
                        <div class="dashboard-stat">
                            <div class="dashboard-stat-value met">${stats.met}</div>
                            <div class="dashboard-stat-label">Met</div>
                        </div>
                        <div class="dashboard-stat">
                            <div class="dashboard-stat-value partial">${stats.partial}</div>
                            <div class="dashboard-stat-label">Partial</div>
                        </div>
                        <div class="dashboard-stat">
                            <div class="dashboard-stat-value not-met">${stats.notMet}</div>
                            <div class="dashboard-stat-label">Not Met</div>
                        </div>
                        <div class="dashboard-stat">
                            <div class="dashboard-stat-value not-assessed">${notAssessed}</div>
                            <div class="dashboard-stat-label">Pending</div>
                        </div>
                    </div>
                    <div class="dashboard-progress">
                        <div class="progress-met" style="width: ${(stats.met / familyTotal) * 100}%"></div>
                        <div class="progress-partial" style="width: ${(stats.partial / familyTotal) * 100}%"></div>
                        <div class="progress-not-met" style="width: ${(stats.notMet / familyTotal) * 100}%"></div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Bind family link clicks
        container.querySelectorAll('.dashboard-family-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToFamily(link.dataset.familyId);
            });
        });
    }

    navigateToFamily(familyId) {
        // Switch to assessment view
        this.switchView('assessment');
        
        // Ensure controls are rendered
        const controlsList = document.getElementById('controls-list');
        if (controlsList && controlsList.children.length === 0) {
            this.renderControls();
        }
        
        // Find and expand the family's controls after view has rendered
        setTimeout(() => {
            const controlsList = document.getElementById('controls-list');
            if (!controlsList) return;
            
            // Find and expand the family container
            const familyEl = controlsList.querySelector(`.control-family[data-family-id="${familyId}"]`);
            
            if (familyEl) {
                const familyHeader = familyEl.querySelector('.family-header');
                const familyControlsContainer = familyEl.querySelector('.family-controls');
                
                // Expand the family accordion
                if (familyHeader && familyControlsContainer) {
                    familyHeader.classList.add('expanded');
                    familyControlsContainer.classList.add('expanded');
                }
                
                // Expand all control objectives within this family
                familyEl.querySelectorAll('.control-header').forEach(header => {
                    const objectivesDiv = header.nextElementSibling;
                    if (objectivesDiv) {
                        header.classList.add('expanded');
                        objectivesDiv.classList.add('expanded');
                    }
                });
                
                // Scroll to family element
                setTimeout(() => {
                    familyEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
            }
        }, 300);
    }

    markAllNotMet() {
        if (!confirm('This will mark ALL objectives as "Not Met" and add them to the POA&M. Are you sure?')) {
            return;
        }
        
        let count = 0;
        CONTROL_FAMILIES.forEach(family => {
            family.controls.forEach(control => {
                control.objectives.forEach(objective => {
                    this.assessmentData[objective.id] = { status: 'not-met' };
                    count++;
                });
            });
        });
        
        // Re-render the controls to show updated status
        this.renderControls();
        this.updateProgress();
        this.showToast(`Marked ${count} objectives as Not Met`, 'success');
    }

    exportAssessmentCSV() {
        const items = [];
        
        // Get org info for export
        const assessorName = this.orgData.assessorName || '';
        const assessorUrl = this.orgData.assessorUrl || '';
        const oscName = this.orgData.oscName || '';
        const oscUrl = this.orgData.oscUrl || '';
        
        CONTROL_FAMILIES.forEach(family => {
            family.controls.forEach(control => {
                control.objectives.forEach(objective => {
                    const assessment = this.assessmentData[objective.id] || {};
                    const impl = this.implementationData[objective.id] || {};
                    const poam = this.poamData[objective.id] || {};
                    const deficiency = this.deficiencyData[objective.id] || {};
                    
                    const xrefId = typeof CTRL_XREF !== 'undefined' ? (CTRL_XREF[objective.id] || '') : '';
                    items.push({
                        'Control Family': `${family.id} - ${family.name}`,
                        'Control ID': control.id,
                        'Control Name': control.name,
                        'Objective ID': objective.id,
                        'External Ref': xrefId,
                        'Objective': objective.text,
                        'Status': assessment.status || 'Not Assessed',
                        'Implementation Description': impl.description || '',
                        'Implementation Evidence': impl.evidence || '',
                        'Implementation Notes': impl.notes || '',
                        'POA&M Weakness': poam.weakness || '',
                        'POA&M Remediation': poam.remediation || '',
                        'POA&M Scheduled Date': poam.scheduledDate || '',
                        'POA&M Responsible Party': poam.responsible || '',
                        'POA&M Risk Level': poam.risk || '',
                        'POA&M Cost': poam.cost || '',
                        'POA&M Notes': poam.notes || '',
                        'Deficiency Notes': deficiency.notes || ''
                    });
                });
            });
        });

        // Convert to CSV with header row for Assessor | OSC
        const headers = Object.keys(items[0]);
        const orgInfoRow = `"${assessorName}${assessorUrl ? ' (' + assessorUrl + ')' : ''} | ${oscName}${oscUrl ? ' (' + oscUrl + ')' : ''}"`;
        const csvContent = [
            orgInfoRow,
            headers.join(','),
            ...items.map(item => 
                headers.map(h => `"${(item[h] || '').toString().replace(/"/g, '""')}"`).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const oscSlug = oscName ? oscName.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '-' : '';
        a.download = `Assessment-${oscSlug}${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast(`Exported ${items.length} assessment items`, 'success');
    }

    exportPOAMCSV() {
        const poamItems = [];
        
        // Get org info for export
        const assessorName = this.orgData.assessorName || '';
        const assessorUrl = this.orgData.assessorUrl || '';
        const oscName = this.orgData.oscName || '';
        const oscUrl = this.orgData.oscUrl || '';
        
        CONTROL_FAMILIES.forEach(family => {
            family.controls.forEach(control => {
                control.objectives.forEach(objective => {
                    const assessment = this.assessmentData[objective.id];
                    if (assessment && (assessment.status === 'not-met' || assessment.status === 'partial')) {
                        const poam = this.poamData[objective.id] || {};
                        const xrefId = typeof CTRL_XREF !== 'undefined' ? (CTRL_XREF[objective.id] || '') : '';
                        
                        // Get SPRS score from control ID
                        const sprsScore = typeof SPRS_SCORING !== 'undefined' ? (SPRS_SCORING.pointValues[control.id] || 0) : 0;
                        const severity = sprsScore === 5 ? 'High' : sprsScore === 3 ? 'Medium' : 'Low';
                        
                        poamItems.push({
                            'Control Family': `${family.id} - ${family.name}`,
                            'Control ID': control.id,
                            'Control Name': control.name,
                            'Objective ID': objective.id,
                            'External Ref': xrefId,
                            'Objective': objective.text,
                            'Status': assessment.status === 'not-met' ? 'Not Met' : 'Partial',
                            'SPRS Score': sprsScore,
                            'Severity': severity,
                            'Weakness Description': poam.weakness || objective.text,
                            'Weakness Identifying Party': poam.identifyingParty || '',
                            'Remediation Plan': poam.remediation || '',
                            'Scheduled Completion': poam.scheduledDate || '',
                            'Responsible Party': poam.responsible || '',
                            'Responsible Party Lead': poam.responsibleLead || '',
                            'Risk Level': poam.risk || '',
                            'Estimated Cost': poam.cost || '',
                            'Notes': poam.notes || ''
                        });
                    }
                });
            });
        });

        if (poamItems.length === 0) {
            this.showToast('No POA&M items to export', 'error');
            return;
        }

        // Create workbook with SheetJS
        const wb = XLSX.utils.book_new();
        
        // Create org info header
        const orgInfo = `${assessorName}${assessorUrl ? ' (' + assessorUrl + ')' : ''} | ${oscName}${oscUrl ? ' (' + oscUrl + ')' : ''}`;
        
        // Active POA&M sheet with header row
        const activeData = [
            [orgInfo],
            Object.keys(poamItems[0]),
            ...poamItems.map(item => Object.values(item))
        ];
        const wsActive = XLSX.utils.aoa_to_sheet(activeData);
        
        // Set column widths (18 columns with new identifying party and lead columns)
        wsActive['!cols'] = [
            {wch: 25}, {wch: 12}, {wch: 30}, {wch: 12}, {wch: 12}, {wch: 50},
            {wch: 12}, {wch: 12}, {wch: 10}, {wch: 40}, {wch: 25}, {wch: 40}, 
            {wch: 15}, {wch: 20}, {wch: 20}, {wch: 12}, {wch: 15}, {wch: 30}
        ];
        
        // Build merge ranges for SPRS Score (column H, index 7) and Severity (column I, index 8) by Control ID
        const merges = [{s: {r: 0, c: 0}, e: {r: 0, c: Object.keys(poamItems[0]).length - 1}}]; // org info merge
        
        // Group consecutive rows by Control ID for SPRS/Severity merging
        let currentControlId = null;
        let mergeStartRow = 3; // Data starts at row 3 (1-indexed: row 1 = org info, row 2 = headers)
        
        poamItems.forEach((item, index) => {
            const rowNum = index + 3; // Excel row (1-indexed, data starts row 3)
            if (item['Control ID'] !== currentControlId) {
                // Close previous merge if it spans multiple rows
                if (currentControlId !== null && rowNum - 1 > mergeStartRow) {
                    // SPRS Score column (H = index 7)
                    merges.push({s: {r: mergeStartRow - 1, c: 7}, e: {r: rowNum - 2, c: 7}});
                    // Severity column (I = index 8)
                    merges.push({s: {r: mergeStartRow - 1, c: 8}, e: {r: rowNum - 2, c: 8}});
                }
                currentControlId = item['Control ID'];
                mergeStartRow = rowNum;
            }
        });
        // Close final merge group
        if (poamItems.length > 0 && poamItems.length + 2 > mergeStartRow) {
            merges.push({s: {r: mergeStartRow - 1, c: 7}, e: {r: poamItems.length + 1, c: 7}});
            merges.push({s: {r: mergeStartRow - 1, c: 8}, e: {r: poamItems.length + 1, c: 8}});
        }
        
        wsActive['!merges'] = merges;
        
        // Add data validation for Status column (column G, index 6) with dropdown
        const statusColIndex = 6; // Status column
        const lastRow = poamItems.length + 2; // +2 for header rows
        wsActive['!dataValidation'] = [{
            sqref: `G3:G${lastRow}`,
            type: 'list',
            formula1: '"Met,Not Met,Partial"'
        }];
        
        XLSX.utils.book_append_sheet(wb, wsActive, 'Active POA&M');
        
        // Completed POA&M sheet (empty with headers)
        const completedData = [
            [orgInfo],
            Object.keys(poamItems[0])
        ];
        const wsCompleted = XLSX.utils.aoa_to_sheet(completedData);
        wsCompleted['!cols'] = wsActive['!cols'];
        wsCompleted['!merges'] = [{s: {r: 0, c: 0}, e: {r: 0, c: Object.keys(poamItems[0]).length - 1}}];
        
        // Add data validation for Status column in Completed sheet (for 500 future rows)
        wsCompleted['!dataValidation'] = [{
            sqref: 'G3:G500',
            type: 'list',
            formula1: '"Met,Not Met,Partial"'
        }];
        
        XLSX.utils.book_append_sheet(wb, wsCompleted, 'Completed POA&M');
        
        // Instructions sheet with VBA macro code
        const instructions = [
            ['POA&M Management Instructions'],
            [''],
            ['STATUS DROPDOWN:'],
            ['The Status column (G) has a dropdown with Met, Not Met, and Partial options.'],
            ['SPRS Score (H) and Severity (I) are merged by Control ID.'],
            [''],
            ['IMPORTANT: Use the VBA macros below to move rows - they handle merged cell resizing.'],
            [''],
            ['EXCEL VBA MACROS - Copy ALL code below into a VBA Module (Alt+F11 > Insert > Module):'],
            [''],
            ['\'=== Helper: Re-merge SPRS/Severity cells by Control ID ==='],
            ['Sub ReMergeSPRS(ws As Worksheet)'],
            ['    Dim lastRow As Long, i As Long, startRow As Long'],
            ['    Dim currentCtrl As String, rng As Range, j As Long'],
            ['    Dim sprsVal As Variant, sevVal As Variant'],
            ['    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row'],
            ['    If lastRow < 3 Then Exit Sub'],
            ['    \'Unmerge columns H and I first'],
            ['    On Error Resume Next'],
            ['    ws.Range("H3:I" & lastRow).UnMerge'],
            ['    On Error GoTo 0'],
            ['    \'Sort by Control ID (column B) to group same controls together'],
            ['    Set rng = ws.Range("A3:R" & lastRow)'],
            ['    rng.Sort Key1:=ws.Range("B3"), Order1:=xlAscending, Header:=xlNo'],
            ['    \'Re-merge by Control ID (column B)'],
            ['    currentCtrl = ""'],
            ['    startRow = 3'],
            ['    Application.DisplayAlerts = False'],
            ['    For i = 3 To lastRow + 1'],
            ['        If i > lastRow Or ws.Cells(i, 2).Value <> currentCtrl Then'],
            ['            If currentCtrl <> "" And i - 1 >= startRow Then'],
            ['                If i - 1 > startRow Then'],
            ['                    sprsVal = ws.Cells(startRow, 8).Value'],
            ['                    sevVal = ws.Cells(startRow, 9).Value'],
            ['                    For j = startRow + 1 To i - 1'],
            ['                        ws.Cells(j, 8).ClearContents'],
            ['                        ws.Cells(j, 9).ClearContents'],
            ['                    Next j'],
            ['                    ws.Range(ws.Cells(startRow, 8), ws.Cells(i - 1, 8)).Merge'],
            ['                    ws.Range(ws.Cells(startRow, 9), ws.Cells(i - 1, 9)).Merge'],
            ['                    ws.Cells(startRow, 8).Value = sprsVal'],
            ['                    ws.Cells(startRow, 9).Value = sevVal'],
            ['                End If'],
            ['            End If'],
            ['            If i <= lastRow Then'],
            ['                currentCtrl = ws.Cells(i, 2).Value'],
            ['                startRow = i'],
            ['            End If'],
            ['        End If'],
            ['    Next i'],
            ['    Application.DisplayAlerts = True'],
            ['End Sub'],
            [''],
            ['\'=== Move Met items to Completed sheet ==='],
            ['Sub MoveMetItems()'],
            ['    Dim wsActive As Worksheet, wsCompleted As Worksheet'],
            ['    Dim lastRowActive As Long, lastRowCompleted As Long, i As Long'],
            ['    Set wsActive = Sheets("Active POA&M")'],
            ['    Set wsCompleted = Sheets("Completed POA&M")'],
            ['    \'Unmerge before moving'],
            ['    On Error Resume Next'],
            ['    wsActive.Range("H:I").UnMerge'],
            ['    wsCompleted.Range("H:I").UnMerge'],
            ['    On Error GoTo 0'],
            ['    lastRowActive = wsActive.Cells(wsActive.Rows.Count, "A").End(xlUp).Row'],
            ['    For i = lastRowActive To 3 Step -1'],
            ['        If wsActive.Cells(i, 7).Value = "Met" Then'],
            ['            lastRowCompleted = wsCompleted.Cells(wsCompleted.Rows.Count, "A").End(xlUp).Row + 1'],
            ['            If lastRowCompleted < 3 Then lastRowCompleted = 3'],
            ['            wsActive.Rows(i).Copy wsCompleted.Rows(lastRowCompleted)'],
            ['            wsActive.Rows(i).Delete'],
            ['        End If'],
            ['    Next i'],
            ['    \'Re-merge both sheets'],
            ['    ReMergeSPRS wsActive'],
            ['    ReMergeSPRS wsCompleted'],
            ['End Sub'],
            [''],
            ['\'=== Move Not Met/Partial items back to Active sheet ==='],
            ['Sub MoveNotMetItems()'],
            ['    Dim wsActive As Worksheet, wsCompleted As Worksheet'],
            ['    Dim lastRowCompleted As Long, lastRowActive As Long, i As Long'],
            ['    Set wsActive = Sheets("Active POA&M")'],
            ['    Set wsCompleted = Sheets("Completed POA&M")'],
            ['    \'Unmerge before moving'],
            ['    On Error Resume Next'],
            ['    wsActive.Range("H:I").UnMerge'],
            ['    wsCompleted.Range("H:I").UnMerge'],
            ['    On Error GoTo 0'],
            ['    lastRowCompleted = wsCompleted.Cells(wsCompleted.Rows.Count, "A").End(xlUp).Row'],
            ['    For i = lastRowCompleted To 3 Step -1'],
            ['        If wsCompleted.Cells(i, 7).Value = "Not Met" Or wsCompleted.Cells(i, 7).Value = "Partial" Then'],
            ['            lastRowActive = wsActive.Cells(wsActive.Rows.Count, "A").End(xlUp).Row + 1'],
            ['            If lastRowActive < 3 Then lastRowActive = 3'],
            ['            wsCompleted.Rows(i).Copy wsActive.Rows(lastRowActive)'],
            ['            wsCompleted.Rows(i).Delete'],
            ['        End If'],
            ['    Next i'],
            ['    \'Re-merge both sheets'],
            ['    ReMergeSPRS wsActive'],
            ['    ReMergeSPRS wsCompleted'],
            ['End Sub'],
            [''],
            ['HOW TO USE:'],
            ['1. Press Alt+F11 to open VBA Editor'],
            ['2. Insert > Module'],
            ['3. Paste ALL the code above'],
            ['4. Close VBA Editor'],
            ['5. Press Alt+F8, select MoveMetItems or MoveNotMetItems, click Run'],
            [''],
            ['STATUS DEFINITIONS:'],
            ['• Met: Objective fully implemented - move to Completed sheet'],
            ['• Not Met: Objective not implemented'],
            ['• Partial: Objective partially implemented'],
            [''],
            ['Generated: ' + new Date().toLocaleString()]
        ];
        const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
        wsInstructions['!cols'] = [{wch: 80}];
        XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');
        
        // Export workbook
        const oscSlug = oscName ? oscName.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '-' : '';
        XLSX.writeFile(wb, `POAM-${oscSlug}${new Date().toISOString().split('T')[0]}.xlsx`);

        this.showToast(`Exported ${poamItems.length} POA&M items to Excel`, 'success');
    }

    showToast(message, type = 'success') {
        // Remove existing toast
        document.querySelector('.toast')?.remove();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AssessmentApp();
});
