// NIST 800-171A / CMMC L2 Assessment Tool
// Main App Controller
console.log('app-main.js loaded - Project Plan removed');

class AssessmentApp {
    constructor() {
        this.assessmentData = {};
        this.poamData = {};
        this.deficiencyData = {}; // Tracks non-POA&M eligible deficiencies
        this.implementationData = {}; // Tracks how objectives are met
        this.orgData = {}; // Organization info (assessor, OSC)
        this.assessmentLevel = localStorage.getItem('nist-assessment-level') || '2'; // '1' for L1, '2' for L2
        this.assessmentRevision = localStorage.getItem('nist-assessment-revision') || 'r2'; // 'r2' or 'r3'
        this.currentView = localStorage.getItem('nist-current-view') || 'dashboard';
        this.assessmentScriptsLoaded = false; // Track if guidance scripts are loaded
        this.init();
    }

    init() {
        console.log('[App] Starting initialization...');
        this.loadSavedData();
        this.populateFamilyFilter();
        this.restoreFilterState();
        this.renderControls();
        this.updateProgress();
        this.bindEvents();
        this.updateRevisionBranding();
        
        // Ensure dashboard renders on initial load
        console.log('[App] Current view:', this.currentView);
        
        // Ensure only the correct view is active on page load
        // Deactivate ALL views first, then activate only the target
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        
        if (this.currentView === 'dashboard') {
            console.log('[App] Setting dashboard as active view...');
            const dashboardView = document.getElementById('dashboard-view');
            if (dashboardView) dashboardView.classList.add('active');
            
            // Render dashboard immediately
            setTimeout(() => {
                console.log('[App] Rendering dashboard...');
                this.renderDashboard();
            }, 50);
        } else {
            // For other views, use switchView
            this.switchView(this.currentView);
        }
        
        this.initDataStorageNotice();

        // ── Browser History Management ──────────────────────────────────
        // Replace initial state so the first Back press navigates within the app
        const initialView = this.currentView || 'dashboard';
        history.replaceState({ view: initialView }, '', '#' + initialView);

        // Handle Back/Forward button navigation
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.view) {
                this.switchView(e.state.view, true);
            } else {
                // No state means user hit Back past the first page — stay on dashboard
                history.pushState({ view: 'dashboard' }, '', '#dashboard');
                this.switchView('dashboard', true);
            }
        });

        console.log('[App] Initialization complete');
    }

    initDataStorageNotice() {
        const notice = document.getElementById('data-storage-notice');
        const acknowledgeBtn = document.getElementById('acknowledge-notice-btn');
        
        // Check if user has already acknowledged - if not, show the notice
        if (localStorage.getItem('data-storage-notice-acknowledged') !== 'true') {
            notice?.classList.add('visible');
        }
        
        // Bind acknowledge button
        acknowledgeBtn?.addEventListener('click', () => {
            localStorage.setItem('data-storage-notice-acknowledged', 'true');
            notice?.classList.remove('visible');
        });
    }

    // Returns the localStorage key prefix based on current revision
    getStoragePrefix() {
        return this.assessmentRevision === 'r3' ? 'nist-r3-' : 'nist-';
    }

    updateRevisionToggleVisibility() {
        const container = document.getElementById('revision-toggle-container');
        if (container) {
            container.style.display = this.assessmentLevel === '2' ? 'flex' : 'none';
        }
    }

    updateRevisionBranding() {
        const isR3 = this.assessmentRevision === 'r3' && this.assessmentLevel === '2';
        // Toggle body class for site-wide Rev 3 theming
        document.body.classList.toggle('rev3-active', isR3);
        // Swap badge text
        const headerBadge = document.querySelector('.header-badge');
        const panelBadge = document.querySelector('.hb-panel-badge');
        if (headerBadge) headerBadge.textContent = isR3 ? 'CMMC 3.0' : 'CMMC 2.0';
        if (panelBadge) panelBadge.textContent = isR3 ? 'CMMC 3.0' : 'CMMC 2.0';
    }

    // Get the active control families based on current revision
    getActiveControlFamilies() {
        if (this.assessmentRevision === 'r3' && this.assessmentLevel === '2' && typeof CONTROL_FAMILIES_R3 !== 'undefined') {
            return CONTROL_FAMILIES_R3;
        }
        return CONTROL_FAMILIES;
    }

    loadSavedData() {
        const prefix = this.getStoragePrefix();
        const savedAssessment = localStorage.getItem(prefix + 'assessment-data');
        const savedPoam = localStorage.getItem(prefix + 'poam-data');
        const savedDeficiency = localStorage.getItem(prefix + 'deficiency-data');
        
        // Use SecurityUtils for safe JSON parsing and sanitization
        const safeParseAndSanitize = (jsonStr) => {
            if (!jsonStr) return {};
            if (typeof SecurityUtils !== 'undefined') {
                const result = SecurityUtils.validateJson(jsonStr);
                if (result.valid) {
                    return SecurityUtils.sanitizeObject(result.data) || {};
                }
                return {};
            }
            // Fallback if SecurityUtils not loaded
            try {
                return JSON.parse(jsonStr);
            } catch (e) {
                return {};
            }
        };
        
        this.assessmentData = safeParseAndSanitize(savedAssessment);
        this.poamData = safeParseAndSanitize(savedPoam);
        this.deficiencyData = safeParseAndSanitize(savedDeficiency);

        const savedImplementation = localStorage.getItem(prefix + 'implementation-data');
        this.implementationData = safeParseAndSanitize(savedImplementation);

        const savedOrg = localStorage.getItem('nist-org-data');
        this.orgData = safeParseAndSanitize(savedOrg);
        
        // Populate org inputs with sanitized values
        const sanitizeForInput = (val) => {
            if (typeof SecurityUtils !== 'undefined') {
                return SecurityUtils.truncate(val || '', SecurityUtils.MAX_LENGTHS.input);
            }
            return (val || '').slice(0, 10000);
        };
        
        const assessorNameInput = document.getElementById('org-assessor-name');
        const assessorUrlInput = document.getElementById('org-assessor-url');
        const oscNameInput = document.getElementById('org-osc-name');
        const oscUrlInput = document.getElementById('org-osc-url');
        
        if (this.orgData.assessorName && assessorNameInput) {
            assessorNameInput.value = sanitizeForInput(this.orgData.assessorName);
        }
        if (this.orgData.assessorUrl && assessorUrlInput) {
            assessorUrlInput.value = sanitizeForInput(this.orgData.assessorUrl);
        }
        // Validate logo URL before displaying
        if (this.orgData.assessorLogo && typeof SecurityUtils !== 'undefined') {
            const safeUrl = SecurityUtils.sanitizeUrl(this.orgData.assessorLogo);
            if (safeUrl) {
                this.displayLogo('assessor', safeUrl);
            } else {
                this.orgData.assessorLogo = null;
            }
        }
        
        if (this.orgData.oscName && oscNameInput) {
            oscNameInput.value = sanitizeForInput(this.orgData.oscName);
        }
        if (this.orgData.oscUrl && oscUrlInput) {
            oscUrlInput.value = sanitizeForInput(this.orgData.oscUrl);
        }
        // Validate logo URL before displaying
        if (this.orgData.oscLogo && typeof SecurityUtils !== 'undefined') {
            const safeUrl = SecurityUtils.sanitizeUrl(this.orgData.oscLogo);
            if (safeUrl) {
                this.displayLogo('osc', safeUrl);
            } else {
                this.orgData.oscLogo = null;
            }
        }
    }

    saveData() {
        const prefix = this.getStoragePrefix();
        try {
            localStorage.setItem(prefix + 'assessment-data', JSON.stringify(this.assessmentData));
            localStorage.setItem(prefix + 'poam-data', JSON.stringify(this.poamData));
            localStorage.setItem(prefix + 'deficiency-data', JSON.stringify(this.deficiencyData));
            localStorage.setItem(prefix + 'implementation-data', JSON.stringify(this.implementationData));
            localStorage.setItem('nist-org-data', JSON.stringify(this.orgData));
        } catch (e) {
            console.error('[SaveData] localStorage write failed:', e);
            this.showToast('Storage full — export your data to avoid data loss', 'error');
            return;
        }
        if (typeof Sanitize !== 'undefined' && Sanitize.storage.isNearLimit()) {
            console.warn(`[SaveData] localStorage usage: ${Sanitize.storage.getUsageMB()} MB — approaching limit`);
            this.showToast(`Storage ${Sanitize.storage.getUsageMB()} MB — consider exporting data`, 'warning');
        }
        const revLabel = this.assessmentRevision === 'r3' ? ' (Rev 3)' : '';
        this.showToast('Progress saved successfully' + revLabel, 'success');
    }

    migrateRev2ToRev3() {
        if (!confirm('This will copy your Rev 2 assessment statuses to Rev 3 using the control mapping. Existing Rev 3 data will NOT be overwritten. Continue?')) {
            return;
        }

        // Load Rev 2 data
        const r2Assessment = JSON.parse(localStorage.getItem('nist-assessment-data') || '{}');
        const r2Poam = JSON.parse(localStorage.getItem('nist-poam-data') || '{}');
        const r2Deficiency = JSON.parse(localStorage.getItem('nist-deficiency-data') || '{}');
        const r2Implementation = JSON.parse(localStorage.getItem('nist-implementation-data') || '{}');

        // Get migration mapping from nist-800-171a-r3.js
        const migrationMap = (typeof REV2_TO_REV3_MIGRATION !== 'undefined') ? REV2_TO_REV3_MIGRATION : null;

        if (!migrationMap) {
            this.showToast('Migration mapping not available. Ensure Rev 3 data files are loaded.', 'error');
            return;
        }

        let migrated = 0;
        let skipped = 0;

        // Iterate Rev 3 families and map objectives
        if (typeof CONTROL_FAMILIES_R3 !== 'undefined') {
            CONTROL_FAMILIES_R3.forEach(family => {
                family.controls.forEach(control => {
                    const rev2Id = control.rev2Id;
                    if (!rev2Id) return; // New control, no Rev 2 equivalent

                    control.objectives.forEach((objective, idx) => {
                        // Try to find matching Rev 2 objective
                        // Rev 3 objective IDs use format like "03.01.01[a]"
                        // Rev 2 objective IDs use format like "3.1.1[a]"
                        const r3ObjId = objective.id;

                        // Build the corresponding Rev 2 objective ID
                        // Extract the sub-objective letter from Rev 3 ID
                        const letterMatch = r3ObjId.match(/\[([a-z])\]$/);
                        const letter = letterMatch ? letterMatch[1] : null;
                        const r2ObjId = letter ? `${rev2Id}[${letter}]` : rev2Id;

                        // Only migrate if Rev 3 doesn't already have data
                        if (!this.assessmentData[r3ObjId]?.status) {
                            if (r2Assessment[r2ObjId]?.status) {
                                this.assessmentData[r3ObjId] = { ...r2Assessment[r2ObjId] };
                                migrated++;
                            }
                        } else {
                            skipped++;
                        }

                        // Migrate POA&M data
                        if (!this.poamData[r3ObjId] && r2Poam[r2ObjId]) {
                            this.poamData[r3ObjId] = { ...r2Poam[r2ObjId] };
                        }

                        // Migrate deficiency data
                        if (!this.deficiencyData[r3ObjId] && r2Deficiency[r2ObjId]) {
                            this.deficiencyData[r3ObjId] = { ...r2Deficiency[r2ObjId] };
                        }

                        // Migrate implementation data
                        if (!this.implementationData[r3ObjId] && r2Implementation[r2ObjId]) {
                            this.implementationData[r3ObjId] = { ...r2Implementation[r2ObjId] };
                        }
                    });
                });
            });
        }

        // Save migrated data
        this.saveData();
        this.renderControls();
        this.updateProgress();
        this.filterControls();

        this.showToast(`Migration complete: ${migrated} objectives migrated, ${skipped} skipped (already had data)`, 'success');
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

    getDropdownState() {
        const saved = localStorage.getItem('nist-dropdown-state');
        return saved ? JSON.parse(saved) : { families: {}, controls: {}, objectives: {} };
    }

    saveDropdownState(type, id, isExpanded) {
        const state = this.getDropdownState();
        if (type === 'family') {
            state.families[id] = isExpanded;
        } else if (type === 'control') {
            state.controls[id] = isExpanded;
        } else if (type === 'objective') {
            state.objectives[id] = isExpanded;
        }
        localStorage.setItem('nist-dropdown-state', JSON.stringify(state));
    }

    getFilterState() {
        const saved = localStorage.getItem('nist-filter-state');
        return saved ? JSON.parse(saved) : { status: 'all', family: 'all' };
    }

    saveFilterState(status, family) {
        localStorage.setItem('nist-filter-state', JSON.stringify({ status, family }));
    }

    restoreFilterState() {
        const state = this.getFilterState();
        const statusSelect = document.getElementById('filter-status');
        const familySelect = document.getElementById('filter-family');
        
        if (statusSelect && state.status) {
            statusSelect.value = state.status;
        }
        if (familySelect && state.family) {
            familySelect.value = state.family;
        }
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
                        const orgAssessorEl = document.getElementById('org-assessor');
                        const orgOscEl = document.getElementById('org-osc');
                        if (orgAssessorEl) orgAssessorEl.value = this.orgData.assessor || '';
                        if (orgOscEl) orgOscEl.value = this.orgData.osc || '';
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
        if (!select) {
            console.warn('filter-family element not found');
            return;
        }
        // Clear existing options except "All Families"
        while (select.options.length > 1) {
            select.remove(1);
        }
        const families = this.getActiveControlFamilies();
        families.forEach(family => {
            // Count total objectives in this family
            const objectiveCount = family.controls.reduce((sum, ctrl) => sum + (ctrl.objectives?.length || 0), 0);
            const option = document.createElement('option');
            option.value = family.id;
            option.textContent = `${family.id} - ${family.name} (${objectiveCount})`;
            select.appendChild(option);
        });
    }

    bindEvents() {
        // ── Top-nav dropdown logic (Apple/AWS style) ──
        const topnavCats = document.querySelectorAll('.topnav-cat');
        let closeTimer = null;

        const closeAllDropdowns = () => {
            topnavCats.forEach(c => {
                c.classList.remove('open');
                const trigger = c.querySelector('.topnav-trigger');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
            });
        };

        topnavCats.forEach(cat => {
            const trigger = cat.querySelector('.topnav-trigger');
            if (!trigger) return;

            // Click to toggle
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = cat.classList.contains('open');
                closeAllDropdowns();
                if (!isOpen) {
                    cat.classList.add('open');
                    trigger.setAttribute('aria-expanded', 'true');
                }
            });

            // Hover open (desktop) — with small delay to prevent flicker
            cat.addEventListener('mouseenter', () => {
                clearTimeout(closeTimer);
                closeAllDropdowns();
                cat.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
            });
            cat.addEventListener('mouseleave', () => {
                closeTimer = setTimeout(() => {
                    cat.classList.remove('open');
                    trigger.setAttribute('aria-expanded', 'false');
                }, 150);
            });
        });

        // Close dropdowns on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.topnav-cat')) closeAllDropdowns();
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeAllDropdowns();
        });

        // ── Mobile hamburger (unchanged IDs) ──
        const hamburgerToggle = document.getElementById('hamburger-menu-toggle');
        const hamburgerDropdown = document.getElementById('hamburger-dropdown');
        const hamburgerOverlay = document.getElementById('hamburger-overlay');

        const openMenu = () => {
            hamburgerDropdown?.classList.add('active');
            hamburgerOverlay?.classList.add('active');
            hamburgerToggle?.classList.add('open');
        };
        const closeMenu = () => {
            hamburgerDropdown?.classList.remove('active');
            hamburgerOverlay?.classList.remove('active');
            hamburgerToggle?.classList.remove('open');
        };

        hamburgerToggle?.addEventListener('click', () => {
            hamburgerDropdown?.classList.contains('active') ? closeMenu() : openMenu();
        });
        hamburgerOverlay?.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && hamburgerDropdown?.classList.contains('active')) closeMenu();
        });

        // ── Nav button clicks (shared between desktop dropdowns & mobile) ──
        const updateActiveNav = (activeBtn) => {
            document.querySelectorAll('.hamburger-nav-btn').forEach(b => b.classList.remove('active'));
            activeBtn?.classList.add('active');
            // Update parent category has-active state
            topnavCats.forEach(c => c.classList.remove('has-active'));
            const parentCat = activeBtn?.closest('.topnav-cat');
            if (parentCat) parentCat.classList.add('has-active');
        };

        document.querySelectorAll('.hamburger-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                if (view) {
                    this.switchView(view);
                    updateActiveNav(e.currentTarget);
                } else if (e.currentTarget.id === 'open-msp-portal-btn') {
                    if (typeof MSPPortal !== 'undefined') MSPPortal.openPortal();
                }
                closeAllDropdowns();
                closeMenu();
            });
        });

        // Set initial has-active on the category containing the active button
        const initialActive = document.querySelector('.hamburger-nav-btn.active');
        if (initialActive) {
            const parentCat = initialActive.closest('.topnav-cat');
            if (parentCat) parentCat.classList.add('has-active');
        }

        // Header Branding - Click to go to Dashboard
        const headerBranding = document.getElementById('header-branding');
        headerBranding?.addEventListener('click', () => {
            this.switchView('dashboard');
            const dashBtn = document.querySelector('.hamburger-nav-btn[data-view="dashboard"]');
            updateActiveNav(dashBtn);
        });

        // Header Settings Cog - Click to open Settings (Appearance tab)
        const settingsBtn = document.getElementById('header-settings-btn');
        settingsBtn?.addEventListener('click', () => {
            if (typeof SettingsPage !== 'undefined') {
                SettingsPage._activeSection = 'theme';
            }
            this.switchView('settings');
            const setBtn = document.querySelector('.hamburger-nav-btn[data-view="settings"]');
            updateActiveNav(setBtn);
        });

        // Legacy Sidebar Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        // Search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterControls();
            });
        }

        // Assessment Level Selector
        const levelSelect = document.getElementById('assessment-level-select');
        if (levelSelect) {
            levelSelect.value = this.assessmentLevel;
            levelSelect.addEventListener('change', (e) => {
                this.assessmentLevel = e.target.value;
                localStorage.setItem('nist-assessment-level', this.assessmentLevel);
                this.updateRevisionToggleVisibility();
                this.updateRevisionBranding();
                this.renderControls();
                this.updateProgress();
                this.filterControls();
                this.populateFamilyFilter();
            });
        }

        // Revision Toggle (Rev 2 / Rev 3) - only visible when Level 2 is selected
        const revToggleContainer = document.getElementById('revision-toggle-container');
        if (revToggleContainer) {
            revToggleContainer.querySelectorAll('.rev-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const rev = e.currentTarget.dataset.rev;
                    if (rev === this.assessmentRevision) return;
                    this.assessmentRevision = rev;
                    localStorage.setItem('nist-assessment-revision', rev);
                    // Update active state
                    revToggleContainer.querySelectorAll('.rev-btn').forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    // Reload with new revision data
                    this.loadSavedData();
                    this.populateFamilyFilter();
                    this.renderControls();
                    this.updateProgress();
                    this.filterControls();
                    this.updateRevisionBranding();
                });
            });
            // Set initial active state and visibility
            revToggleContainer.querySelectorAll('.rev-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.rev === this.assessmentRevision);
            });
            this.updateRevisionToggleVisibility();
        }

        // Filters
        const filterStatus = document.getElementById('filter-status');
        const filterFamily = document.getElementById('filter-family');
        if (filterStatus) {
            filterStatus.addEventListener('change', () => this.filterControls());
        }
        if (filterFamily) {
            filterFamily.addEventListener('change', () => this.filterControls());
        }

        // Save/Load/Export
        const saveBtn = document.getElementById('save-btn');
        const loadBtn = document.getElementById('load-btn');
        const exportBtn = document.getElementById('export-btn');
        
        if (saveBtn) saveBtn.addEventListener('click', () => this.saveData());
        if (loadBtn) loadBtn.addEventListener('click', () => this.loadDataFromFile());
        if (exportBtn) exportBtn.addEventListener('click', () => this.exportPOAMCSV());
        
        document.getElementById('export-csv-btn')?.addEventListener('click', () => this.exportPOAMCSV());
        document.getElementById('export-assessment-btn')?.addEventListener('click', () => this.exportAssessmentCSV());
        document.getElementById('export-ssp-btn')?.addEventListener('click', () => {
            if (typeof SSPExportGenerator !== 'undefined') SSPExportGenerator.exportToWindow();
            else alert('SSP Export Generator not loaded yet. Please try again.');
        });
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

        // Implementation modal close/cancel buttons (CSP blocks inline onclick)
        document.getElementById('impl-modal-close-btn')?.addEventListener('click', () => this.closeImplementationModal());
        document.getElementById('impl-modal-cancel-btn')?.addEventListener('click', () => this.closeImplementationModal());

        // Implementation Guide Modal
        document.getElementById('open-impl-guide-btn')?.addEventListener('click', () => this.openImplGuideModal());
        document.getElementById('close-impl-guide-btn')?.addEventListener('click', () => this.closeImplGuideModal());
        document.querySelector('.impl-guide-backdrop')?.addEventListener('click', () => this.closeImplGuideModal());
        document.querySelectorAll('.impl-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchImplGuideTab(e.target.dataset.tab));
        });
        document.getElementById('export-project-plan-btn')?.addEventListener('click', () => this.exportImplGuidePlan());
        document.getElementById('impl-cloud-selector')?.addEventListener('change', (e) => this.switchImplGuideCloud(e.target.value));

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

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const mobileOverlay = document.getElementById('mobile-overlay');

        mobileMenuToggle?.addEventListener('click', () => {
            sidebar?.classList.toggle('open');
            mobileOverlay?.classList.toggle('active');
        });

        mobileOverlay?.addEventListener('click', () => {
            sidebar?.classList.remove('open');
            mobileOverlay?.classList.remove('active');
        });

        // Close mobile menu when nav button is clicked
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar?.classList.remove('open');
                    mobileOverlay?.classList.remove('active');
                }
            });
        });

        // Global back button handler for dynamically-rendered views
        document.addEventListener('click', (e) => {
            const backBtn = e.target.closest('.view-back-btn');
            if (backBtn) {
                const targetView = backBtn.dataset.backView || 'dashboard';
                this.switchView(targetView);
            }
        });

        // Initialize Command Search (Cmd+K)
        this.initCommandSearch();
    }

    // =============================================
    // COMMAND SEARCH (Cmd+K)
    // =============================================
    initCommandSearch() {
        this.commandSearchModal = document.getElementById('command-search-modal');
        this.commandSearchInput = document.getElementById('command-search-input');
        this.commandSearchResults = document.getElementById('command-search-results');
        this.commandSelectedIndex = 0;
        this.commandSearchItems = [];
        this.commandSearchFilter = 'all';

        // Build search index
        this.buildSearchIndex();

        // Keyboard shortcut: Cmd+K (Mac) or Ctrl+K (Windows)
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.openCommandSearch();
            }
            // Also allow / to open search when not in an input
            if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
                e.preventDefault();
                this.openCommandSearch();
            }
        });

        // Wire the nav bar search trigger button to open command search
        const searchTrigger = document.getElementById('search-trigger');
        if (searchTrigger) {
            searchTrigger.addEventListener('click', () => this.openCommandSearch());
        }

        // Close on backdrop click
        this.commandSearchModal?.querySelector('.command-search-backdrop')?.addEventListener('click', () => {
            this.closeCommandSearch();
        });

        // Search input handler
        this.commandSearchInput?.addEventListener('input', (e) => {
            this.performCommandSearch(e.target.value);
        });

        // Keyboard navigation in search
        this.commandSearchInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCommandSearch();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateCommandSearch(1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateCommandSearch(-1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.selectCommandSearchItem();
            }
        });

        // Filter buttons
        document.querySelectorAll('.command-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.command-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.commandSearchFilter = btn.dataset.filter;
                this.performCommandSearch(this.commandSearchInput?.value || '');
            });
        });
    }

    buildSearchIndex() {
        this.searchIndex = [];

        // Add all controls
        const families = this.getActiveControlFamilies();
        if (families && families.length > 0) {
            families.forEach(family => {
                family.controls.forEach(control => {
                    const mapping = typeof getFrameworkMappings === 'function' ? getFrameworkMappings(control.id) : null;
                    const level = mapping?.cmmc?.level || 2;
                    this.searchIndex.push({
                        type: 'controls',
                        id: control.id,
                        title: control.name,
                        description: family.name,
                        badges: [
                            { text: 'CMMC', class: 'cmmc' },
                            { text: `L${level}`, class: level === 1 ? 'l1' : 'l2' }
                        ],
                        action: () => {
                            this.closeCommandSearch();
                            this.switchView('assessment');
                            setTimeout(() => {
                                const el = document.querySelector(`[data-control-id="${control.id}"]`);
                                if (el) {
                                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    el.style.boxShadow = '0 0 0 3px var(--accent-blue)';
                                    setTimeout(() => el.style.boxShadow = '', 2000);
                                }
                            }, 100);
                        }
                    });
                });
            });
        }

        // Add views
        const views = [
            { id: 'dashboard', title: 'Dashboard', desc: 'Assessment overview and progress' },
            { id: 'assessment', title: 'Assessment', desc: 'Evaluate controls and objectives' },
            { id: 'poam', title: 'POA&M', desc: 'Plan of Action and Milestones' },
            { id: 'sprs', title: 'SPRS Calculator', desc: 'Calculate SPRS score' },
            { id: 'crosswalk', title: 'Framework Crosswalk', desc: 'Map controls across frameworks' },
            { id: 'impl-guide', title: 'Implementation Guide', desc: 'Technical implementation guidance' },
            { id: 'cheat-sheet', title: 'Assessor Cheat Sheet', desc: 'Quick reference for assessors' },
            { id: 'cmvp-explorer', title: 'CMVP Explorer', desc: 'Search FIPS 140 validated cryptographic modules' },
            { id: 'fedramp-reference', title: 'FedRAMP Reference', desc: 'FedRAMP 20x KSI families and control mappings' },
            { id: 'docs-hub', title: 'Documentation Hub', desc: 'Curated CMMC, NIST, FedRAMP, and DoD documents' },
            { id: 'fedramp-explorer', title: 'FedRAMP Marketplace Explorer', desc: 'Browse and search all FedRAMP authorized cloud service offerings' }
        ];
        views.forEach(v => {
            this.searchIndex.push({
                type: 'views',
                id: v.id,
                title: v.title,
                description: v.desc,
                badges: [{ text: 'View', class: 'view' }],
                action: () => {
                    this.closeCommandSearch();
                    this.switchView(v.id);
                }
            });
        });

        // Add guides
        const guides = [
            { id: 'guide-vdi', title: 'VDI Architecture', desc: 'Virtual Desktop Infrastructure guidance' },
            { id: 'guide-network', title: 'Network Architecture', desc: 'Enclave network design' },
            { id: 'guide-identity', title: 'Identity & Access', desc: 'IAM and authentication' },
            { id: 'guide-logging', title: 'Logging & Monitoring', desc: 'SIEM and audit configuration' },
            { id: 'guide-encryption', title: 'Encryption', desc: 'Data protection and key management' }
        ];
        guides.forEach(g => {
            this.searchIndex.push({
                type: 'guides',
                id: g.id,
                title: g.title,
                description: g.desc,
                badges: [{ text: 'Guide', class: 'guide' }],
                action: () => {
                    this.closeCommandSearch();
                    this.switchView('impl-guide');
                }
            });
        });
    }

    openCommandSearch() {
        if (!this.commandSearchModal) return;
        this.commandSearchModal.style.display = 'block';
        this.commandSearchInput.value = '';
        this.commandSearchInput.focus();
        this.commandSelectedIndex = 0;
        this.performCommandSearch('');
        document.body.style.overflow = 'hidden';
    }

    closeCommandSearch() {
        if (!this.commandSearchModal) return;
        this.commandSearchModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    performCommandSearch(query) {
        const q = query.toLowerCase().trim();
        let results = this.searchIndex;

        // Filter by type
        if (this.commandSearchFilter !== 'all') {
            results = results.filter(item => item.type === this.commandSearchFilter);
        }

        // Filter by query
        if (q) {
            results = results.filter(item => 
                item.id.toLowerCase().includes(q) ||
                item.title.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q)
            );
        }

        // Limit results
        results = results.slice(0, 50);
        this.commandSearchItems = results;
        this.commandSelectedIndex = 0;

        // Render results
        this.renderCommandSearchResults(results);
    }

    renderCommandSearchResults(results) {
        if (!this.commandSearchResults) return;

        if (results.length === 0) {
            this.commandSearchResults.innerHTML = '<div class="command-search-empty">No results found</div>';
            return;
        }

        // Group by type
        const grouped = {};
        results.forEach(item => {
            if (!grouped[item.type]) grouped[item.type] = [];
            grouped[item.type].push(item);
        });

        const typeLabels = {
            controls: 'Controls',
            views: 'Views',
            guides: 'Guides'
        };

        let html = '';
        let globalIndex = 0;
        for (const [type, items] of Object.entries(grouped)) {
            html += `<div class="command-search-group">
                <div class="command-search-group-title">${typeLabels[type] || type}</div>`;
            items.forEach(item => {
                const isSelected = globalIndex === this.commandSelectedIndex;
                html += `<div class="command-search-item ${isSelected ? 'selected' : ''}" data-index="${globalIndex}">
                    <span class="command-item-id">${item.id}</span>
                    <div class="command-item-content">
                        <div class="command-item-title">${item.title}</div>
                        <div class="command-item-desc">${item.description}</div>
                        <div class="command-item-badges">
                            ${item.badges.map(b => `<span class="command-item-badge ${b.class}">${b.text}</span>`).join('')}
                        </div>
                    </div>
                </div>`;
                globalIndex++;
            });
            html += '</div>';
        }

        this.commandSearchResults.innerHTML = html;

        // Bind click handlers
        this.commandSearchResults.querySelectorAll('.command-search-item').forEach(el => {
            el.addEventListener('click', () => {
                this.commandSelectedIndex = parseInt(el.dataset.index);
                this.selectCommandSearchItem();
            });
            el.addEventListener('mouseenter', () => {
                this.commandSelectedIndex = parseInt(el.dataset.index);
                this.updateCommandSearchSelection();
            });
        });
    }

    navigateCommandSearch(direction) {
        const newIndex = this.commandSelectedIndex + direction;
        if (newIndex >= 0 && newIndex < this.commandSearchItems.length) {
            this.commandSelectedIndex = newIndex;
            this.updateCommandSearchSelection();
        }
    }

    updateCommandSearchSelection() {
        this.commandSearchResults?.querySelectorAll('.command-search-item').forEach((el, i) => {
            el.classList.toggle('selected', i === this.commandSelectedIndex);
            if (i === this.commandSelectedIndex) {
                el.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    selectCommandSearchItem() {
        const item = this.commandSearchItems[this.commandSelectedIndex];
        if (item?.action) {
            item.action();
        }
    }

    async switchView(view, fromPopState) {
        console.log('[App] Switching to view:', view);
        this.currentView = view;
        localStorage.setItem('nist-current-view', view);

        // Push browser history state so Back navigates between views, not off the site
        if (!fromPopState) {
            history.pushState({ view: view }, '', '#' + view);
        }
        
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Update views
        document.querySelectorAll('.view').forEach(v => {
            const isActive = v.id === `${view}-view`;
            v.classList.toggle('active', isActive);
            if (isActive) {
                console.log('[App] Activated view:', v.id);
            }
        });

        // Lazy load scripts for view if needed (skip spinner for views with static HTML like crosswalk)
        if (window.LazyLoader && window.LazyLoader.viewScripts[view]) {
            const container = document.getElementById(`${view}-content`) || document.getElementById(`${view.replace('-', '')}-content`);
            const skipSpinner = ['crosswalk', 'impl-planner'].includes(view); // Views with static HTML or direct loading
            console.log(`View: ${view}, skipSpinner: ${skipSpinner}, container loaded: ${container?.dataset.loaded}`);
            if (container && !container.dataset.loaded) {
                if (!skipSpinner) {
                    console.log('Showing spinner for view:', view);
                    container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;padding:60px;color:var(--text-muted)"><svg class="spinner" width="24" height="24" viewBox="0 0 24 24" style="animation:spin 1s linear infinite;margin-right:12px"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/></svg>Loading...</div>';
                } else {
                    console.log('Skipping spinner for view:', view);
                }
                try {
                    await window.LazyLoader.loadViewScripts(view);
                    container.dataset.loaded = 'true';
                } catch (e) {
                    console.error('Failed to load view scripts:', e);
                }
            }
        }

        // Render view content
        if (view === 'poam') {
            this.renderPOAM();
        } else if (view === 'dashboard') {
            this.renderDashboard();
        } else if (view === 'assessment') {
            // Load assessment scripts if needed, then re-render controls
            if (window.LazyLoader && !this.assessmentScriptsLoaded) {
                try {
                    await window.LazyLoader.loadViewScripts('assessment');
                    this.assessmentScriptsLoaded = true;
                    this.renderControls(); // Re-render with guidance available
                } catch (e) {
                    console.error('Failed to load assessment scripts:', e);
                }
            }
        } else if (view === 'crosswalk') {
            // Load crosswalk scripts if needed, then initialize
            if (window.LazyLoader) {
                try {
                    await window.LazyLoader.loadViewScripts('crosswalk');
                    await new Promise(resolve => setTimeout(resolve, 100));
                    if (typeof CrosswalkVisualizer !== 'undefined') {
                        CrosswalkVisualizer.init();
                    }
                } catch (e) {
                    console.error('Failed to load crosswalk scripts:', e);
                }
            } else if (typeof CrosswalkVisualizer !== 'undefined') {
                CrosswalkVisualizer.init();
            }
        } else if (view === 'impl-guide') {
            this.renderImplGuideView();
        } else if (view === 'impl-planner') {
            console.log('Switching to implementation planner view');
            // Mark container as loaded to prevent spinner
            const container = document.getElementById('impl-planner-content');
            if (container) {
                console.log('Found implementation planner container, marking as loaded');
                container.dataset.loaded = 'true';
            } else {
                console.log('Could not find implementation planner container');
            }
            this.renderImplPlanner();
        } else if (view === 'osc-inventory') {
            this.renderOSCInventory();
        } else if (view === 'rev3-crosswalk') {
            // Rev3 Crosswalk view - render using Rev3Crosswalk module
            // Note: rev3-crosswalk.js is deferred, so it may not be loaded yet when
            // app-main.js (synchronous) restores the last view on init.
            // Poll every 200ms for up to 5s to wait for the module.
            const tryRender = () => {
                try {
                    const xw = window.Rev3Crosswalk || (typeof Rev3Crosswalk !== 'undefined' ? Rev3Crosswalk : null);
                    if (xw && xw.renderView) {
                        xw.renderView();
                        return true;
                    }
                } catch (e) {
                    console.error('[App] rev3-crosswalk render error:', e);
                    const c = document.getElementById('rev3-crosswalk-content');
                    if (c) c.innerHTML = '<div style="padding:40px;color:var(--text-muted);text-align:center">Failed to load crosswalk. Try refreshing the page.</div>';
                    return true; // stop retrying on error
                }
                return false;
            };
            if (!tryRender()) {
                let attempts = 0;
                const maxAttempts = 25; // 25 * 200ms = 5 seconds
                const poll = setInterval(() => {
                    attempts++;
                    if (tryRender() || attempts >= maxAttempts) {
                        clearInterval(poll);
                        if (attempts >= maxAttempts && !window.Rev3Crosswalk) {
                            const c = document.getElementById('rev3-crosswalk-content');
                            if (c) c.innerHTML = '<div style="padding:40px;color:var(--text-muted);text-align:center">Crosswalk module failed to load. <button id="retry-crosswalk-btn" style="margin-left:8px;padding:6px 16px;background:var(--accent-blue);color:#fff;border:none;border-radius:6px;cursor:pointer">Retry</button></div>';
                            document.getElementById('retry-crosswalk-btn')?.addEventListener('click', () => {
                                if (window.app) window.app.switchView('rev3-crosswalk');
                            });
                        }
                    }
                }, 200);
            }
        } else if (view === 'cmvp-explorer') {
            if (typeof CMVPExplorer !== 'undefined') {
                CMVPExplorer.init();
            }
        } else if (view === 'fedramp-reference') {
            if (typeof FedRAMPReference !== 'undefined') {
                if (typeof LazyLoader !== 'undefined') {
                    LazyLoader.loadViewScripts('fedramp-reference').then(() => FedRAMPReference.init());
                } else {
                    FedRAMPReference.init();
                }
            }
        } else if (view === 'diagram-hub') {
            if (typeof DiagramHub !== 'undefined') {
                DiagramHub.render();
            }
        } else if (view === 'command-center') {
            if (typeof CommandCenter !== 'undefined') {
                CommandCenter.render();
            }
        } else if (view === 'exec-dashboard') {
            if (typeof ExecDashboard !== 'undefined') {
                ExecDashboard.render();
            }
        } else if (view === 'settings') {
            if (typeof SettingsPage !== 'undefined') {
                SettingsPage.render();
            }
        } else if (view === 'docs-hub') {
            if (typeof DocsHub !== 'undefined') {
                DocsHub.render();
            }
        } else if (view === 'fedramp-explorer') {
            if (typeof FedRAMPExplorer !== 'undefined') {
                FedRAMPExplorer.render();
            }
        } else if (view === 'l2-guide') {
            if (typeof L2Guide !== 'undefined') {
                L2Guide.render();
            }
        }
        
        // Prefetch adjacent views for faster navigation
        this.prefetchAdjacentViews(view);
    }
    
    prefetchAdjacentViews(currentView) {
        if (!window.LazyLoader) return;
        const views = ['dashboard', 'assessment', 'poam', 'impl-planner', 'impl-guide', 'osc-inventory', 'crosswalk'];
        const currentIdx = views.indexOf(currentView);
        // Prefetch next and previous views
        if (currentIdx > 0) window.LazyLoader.preloadView(views[currentIdx - 1]);
        if (currentIdx < views.length - 1) window.LazyLoader.preloadView(views[currentIdx + 1]);
    }
    
    // =============================================
    // IMPLEMENTATION PLANNER
    // =============================================
    renderImplPlanner() {
        const container = document.getElementById('impl-planner-content');
        if (!container) return;
        
        // Hide site title bar when Implementation Planner is shown
        const siteTitleBar = document.getElementById('site-title-bar');
        if (siteTitleBar) siteTitleBar.style.display = 'none';
        
        // Determine planner revision
        this.implPlannerRevision = localStorage.getItem('impl-planner-revision') || 'r2';
        const isR3 = this.implPlannerRevision === 'r3';
        const isL3 = this.implPlannerRevision === 'l3';
        let planner;
        if (isL3) {
            planner = typeof IMPLEMENTATION_PLANNER_L3 !== 'undefined' ? IMPLEMENTATION_PLANNER_L3 : null;
        } else if (isR3) {
            planner = typeof IMPLEMENTATION_PLANNER_R3 !== 'undefined' ? IMPLEMENTATION_PLANNER_R3 : null;
        } else {
            planner = typeof IMPLEMENTATION_PLANNER !== 'undefined' ? IMPLEMENTATION_PLANNER : null;
        }
        console.log('Planner revision:', this.implPlannerRevision, 'Data available:', !!planner);
        
        if (!planner) {
            container.innerHTML = '<p style="padding:40px;text-align:center;color:var(--text-muted)">Implementation Planner data not loaded.</p>';
            return;
        }
        
        // Load saved progress (revision-specific keys)
        const progressKey = isL3 ? 'impl-planner-l3-progress' : (isR3 ? 'impl-planner-r3-progress' : 'impl-planner-progress');
        const phaseKey = isL3 ? 'impl-planner-l3-phase' : (isR3 ? 'impl-planner-r3-phase' : 'impl-planner-phase');
        this.implPlannerProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
        this.implPlannerCurrentPhase = localStorage.getItem(phaseKey) || planner.phases[0].id;
        const storedView = localStorage.getItem('impl-planner-view');
        const allowedViews = ['phases', 'kanban', 'list'];
        this.implPlannerView = allowedViews.includes(storedView) ? storedView : 'phases';
        
        console.log('Current implementation planner view:', this.implPlannerView);
        
        // Calculate overall progress
        const allTasks = this.getAllPlannerTasks(planner);
        const completedTasks = allTasks.filter(t => this.implPlannerProgress[t.id]);
        const overallProgress = allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0;
        
        // Calculate phase progress
        const phaseProgress = {};
        planner.phases.forEach(phase => {
            const phaseTasks = this.getPhaseTasks(phase);
            const phaseCompleted = phaseTasks.filter(t => this.implPlannerProgress[t.id]).length;
            phaseProgress[phase.id] = {
                total: phaseTasks.length,
                completed: phaseCompleted,
                percent: phaseTasks.length > 0 ? Math.round((phaseCompleted / phaseTasks.length) * 100) : 0
            };
        });
        
        const currentPhase = planner.phases.find(p => p.id === this.implPlannerCurrentPhase) || planner.phases[0];
        
        container.innerHTML = `
            <!-- Header -->
            <div class="impl-planner-header">
                <div class="impl-planner-header-top">
                    <button class="view-back-btn" data-back-view="dashboard" title="Back to Dashboard">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        Back
                    </button>
                    <h1>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 14l2 2 4-4"/></svg>
                        CMMC Implementation Planner
                    </h1>
                    <div class="impl-planner-rev-toggle">
                        <button class="impl-rev-btn ${!isR3 && !isL3 ? 'active' : ''}" data-rev="r2">L1/L2 Rev 2</button>
                        <button class="impl-rev-btn ${isR3 ? 'active' : ''}" data-rev="r3">L1/L2 Rev 3</button>
                        <button class="impl-rev-btn impl-rev-btn-l3 ${isL3 ? 'active' : ''}" data-rev="l3">Level 3</button>
                    </div>
                </div>
                <p>${planner.description}</p>
                ${isR3 ? '<div class="impl-planner-r3-badge"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Rev 3 Edition &mdash; 17 families &bull; 97 controls &bull; 422 objectives &bull; ODPs &bull; New: SR, PL</div>' : ''}
                ${isL3 ? '<div class="impl-planner-r3-badge" style="background:rgba(236,72,153,0.12);border-color:rgba(236,72,153,0.3);color:#ec4899"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Level 3 Enhanced &mdash; NIST 800-172 &bull; 23 controls &bull; 59 objectives &bull; APT Defense &bull; DIBCAC Assessment</div>' : ''}
            </div>
            
            <!-- Progress Overview -->
            <div class="impl-progress-overview">
                <div class="impl-progress-card">
                    <h3>Overall Progress</h3>
                    <div class="value">${overallProgress}%</div>
                    <div class="subtext">${completedTasks.length} of ${allTasks.length} tasks complete</div>
                    <div class="impl-progress-bar-container">
                        <div class="impl-progress-bar">
                            <div class="impl-progress-bar-fill" style="width:${overallProgress}%;background:var(--status-met)"></div>
                        </div>
                    </div>
                </div>
                <div class="impl-progress-card">
                    <h3>Current Phase</h3>
                    <div class="value" style="font-size:1.25rem">${currentPhase.name}</div>
                    <div class="subtext">${phaseProgress[currentPhase.id].percent}% complete</div>
                    <div class="impl-progress-bar-container">
                        <div class="impl-progress-bar">
                            <div class="impl-progress-bar-fill" style="width:${phaseProgress[currentPhase.id].percent}%;background:${currentPhase.color}"></div>
                        </div>
                    </div>
                </div>
                <div class="impl-progress-card">
                    <h3>Total Phases</h3>
                    <div class="value">${planner.phases.length}</div>
                    <div class="subtext">${planner.phases.filter(p => phaseProgress[p.id].percent === 100).length} complete</div>
                </div>
                <div class="impl-progress-card">
                    <h3>Critical Tasks</h3>
                    <div class="value">${allTasks.filter(t => t.priority === 'critical' && !this.implPlannerProgress[t.id]).length}</div>
                    <div class="subtext">remaining critical items</div>
                </div>
            </div>
            
                        
            <!-- Phase Timeline (for phases view) -->
            <div class="impl-phase-timeline">
                ${planner.phases.map((phase, idx) => `
                    <div class="impl-phase-tab ${phase.id === this.implPlannerCurrentPhase ? 'active' : ''}" data-phase="${phase.id}" style="border-left:3px solid ${phase.color}">
                        <div class="phase-tab-number">Phase ${idx + 1}</div>
                        <div class="phase-tab-name">${phase.name}</div>
                        <div class="phase-tab-progress">${phaseProgress[phase.id].completed}/${phaseProgress[phase.id].total} tasks</div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Project Plan Content -->
            <div id="impl-phases-content">
                ${this.renderPlannerPhaseContent(currentPhase, phaseProgress)}
            </div>
        `;
        
        this.bindImplPlannerEvents(container, planner, phaseProgress);
    }
    
    getAllPlannerTasks(planner) {
        const tasks = [];
        planner.phases.forEach(phase => {
            phase.milestones.forEach(milestone => {
                milestone.tasks.forEach(task => {
                    tasks.push({ ...task, phaseId: phase.id, phaseName: phase.name, milestoneId: milestone.id, milestoneName: milestone.name, phaseColor: phase.color });
                });
            });
        });
        return tasks;
    }
    
    getPhaseTasks(phase) {
        const tasks = [];
        phase.milestones.forEach(milestone => {
            milestone.tasks.forEach(task => {
                tasks.push(task);
            });
        });
        return tasks;
    }
    
    renderPlannerPhaseContent(phase, phaseProgress) {
        const phaseIcon = this.getPhaseIcon(phase.icon);
        
        // Build project plan tasks for this phase
        let planTasks = [];
        phase.milestones.forEach(milestone => {
            (milestone.tasks || []).forEach(task => {
                const meta = task.projectPlan || {};
                planTasks.push({
                    phaseId: phase.id,
                    implTaskId: task.id,
                    taskId: meta.taskId || `${phase.id}-${task.id}`,
                    task: task.name,
                    week: meta.week || 1,
                    owner: meta.owner || 'TBD',
                    accountable: meta.accountable || 'TBD',
                    deliverable: meta.deliverable || 'TBD',
                    controls: task.controls,
                    priority: task.priority || 'medium'
                });
            });
        });

        return `
            <div class="impl-phase-content">
                <div class="impl-phase-header">
                    <div class="impl-phase-icon" style="background:${phase.color}">
                        ${phaseIcon}
                    </div>
                    <div class="impl-phase-info">
                        <h2>${phase.name}</h2>
                        <p>${phase.description}</p>
                        <div class="impl-phase-meta">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                ${phase.duration}
                            </span>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                ${phaseProgress[phase.id].completed}/${phaseProgress[phase.id].total} tasks
                            </span>
                        </div>
                    </div>
                </div>
                <div class="impl-milestones">
                    ${phase.milestones.map(milestone => this.renderPlannerMilestone(milestone, phase)).join('')}
                </div>
                
                ${planTasks.length ? `
                <div class="impl-phase-project-plan" style="margin-top:24px;padding:16px;background:var(--bg-secondary);border-radius:8px;">
                    <h3 style="margin:0 0 12px 0;font-size:1rem;color:var(--text-primary);display:flex;align-items:center;gap:8px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6M4 4l5 5"/></svg>
                        Project Plan Tasks
                        <span style="font-size:0.75rem;color:var(--text-muted);font-weight:normal;">(${planTasks.filter(t => this.implPlannerProgress[t.implTaskId]).length}/${planTasks.length} complete)</span>
                    </h3>
                    <div style="overflow-x:auto;">
                        <table class="project-plan-table" style="width:100%;border-collapse:collapse;font-size:0.8rem;">
                            <thead>
                                <tr style="background:var(--bg-tertiary);">
                                    <th style="padding:8px;text-align:left;border-bottom:1px solid var(--border-color);">Week</th>
                                    <th style="padding:8px;text-align:left;border-bottom:1px solid var(--border-color);">Task</th>
                                    <th style="padding:8px;text-align:left;border-bottom:1px solid var(--border-color);">Owner</th>
                                    <th style="padding:8px;text-align:left;border-bottom:1px solid var(--border-color);">Deliverable</th>
                                    <th style="padding:8px;text-align:left;border-bottom:1px solid var(--border-color);">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${planTasks.map(task => `
                                    <tr style="${this.implPlannerProgress[task.implTaskId] ? 'opacity:0.6;' : ''}">
                                        <td style="padding:8px;border-bottom:1px solid var(--border-color);"><span style="background:var(--accent-blue);color:white;padding:2px 8px;border-radius:12px;font-size:0.7rem;">Week ${task.week}</span></td>
                                        <td style="padding:8px;border-bottom:1px solid var(--border-color);">
                                            <div>${task.task}</div>
                                            ${task.controls ? `<div style="margin-top:4px;">${task.controls.map(c => `<span style="background:var(--bg-tertiary);padding:1px 6px;border-radius:4px;font-size:0.65rem;margin-right:4px;">${c}</span>`).join('')}</div>` : ''}
                                        </td>
                                        <td style="padding:8px;border-bottom:1px solid var(--border-color);"><span style="background:var(--bg-tertiary);padding:2px 8px;border-radius:12px;font-size:0.7rem;">${task.owner}</span></td>
                                        <td style="padding:8px;border-bottom:1px solid var(--border-color);font-size:0.75rem;color:var(--text-secondary);">${task.deliverable}</td>
                                        <td style="padding:8px;border-bottom:1px solid var(--border-color);">
                                            <span style="color:${this.implPlannerProgress[task.implTaskId] ? 'var(--status-met)' : 'var(--text-muted)'};">
                                                ${this.implPlannerProgress[task.implTaskId] ? '✓ Done' : '○ Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    renderPlannerMilestone(milestone, phase) {
        const milestoneTasks = milestone.tasks;
        const completedCount = milestoneTasks.filter(t => this.implPlannerProgress[t.id]).length;
        const isComplete = completedCount === milestoneTasks.length && milestoneTasks.length > 0;
        const isPartial = completedCount > 0 && completedCount < milestoneTasks.length;
        const isOptional = milestone.optional;
        
        return `
            <div class="impl-milestone ${isOptional ? 'optional' : ''}" data-milestone="${milestone.id}">
                <div class="impl-milestone-header">
                    <div class="impl-milestone-checkbox ${isComplete ? 'completed' : ''} ${isPartial ? 'partial' : ''}">
                        ${isComplete ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                    </div>
                    <div class="impl-milestone-info">
                        <h3>${milestone.name} ${isOptional ? '<span class="impl-optional-badge">Optional</span>' : ''}</h3>
                        <p>${milestone.description}</p>
                    </div>
                    <div class="impl-milestone-progress">${completedCount}/${milestoneTasks.length}</div>
                    <div class="impl-milestone-toggle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                </div>
                <div class="impl-tasks">
                    ${milestoneTasks.map(task => this.renderPlannerTask(task, phase)).join('')}
                </div>
            </div>
        `;
    }
    
    renderPlannerTask(task, phase) {
        const isComplete = this.implPlannerProgress[task.id];
        
        return `
            <div class="impl-task" data-task="${task.id}"${task.isODPTask ? ' data-odp="true"' : ''}>
                <div class="impl-task-checkbox ${isComplete ? 'completed' : ''}" data-task-id="${task.id}">
                    ${isComplete ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                </div>
                <div class="impl-task-content">
                    <div class="impl-task-header">
                        <span class="impl-task-name ${isComplete ? 'completed' : ''}">${task.name}</span>
                        <span class="impl-task-priority ${task.priority}">${task.priority}</span>
                    </div>
                    <div class="impl-task-description">${task.description}</div>
                    ${task.controls && task.controls.length > 0 ? `
                        <div class="impl-task-controls">
                            ${task.controls.map(c => `
                                <button class="impl-task-control" data-control="${c}">
                                    ${c}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                    <button class="impl-task-expand" data-task-id="${task.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                        Show implementation details
                    </button>
                    <div class="impl-task-details" id="task-details-${task.id}">
                        ${this.renderTaskDetails(task)}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderTaskDetails(task) {
        const guidance = task.guidance || {};
        let html = '';
        
        // Deployment Options (for remote access strategy selection)
        if (guidance.deploymentOptions && guidance.deploymentOptions.length > 0) {
            html += `
                <div class="impl-task-section">
                    <h4>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                        Deployment Options
                    </h4>
                    <div class="impl-deployment-options">
                        ${guidance.deploymentOptions.map((opt, idx) => `
                            <div class="impl-deployment-option" style="border-left:3px solid ${idx === 0 ? 'var(--status-met)' : idx === 1 ? 'var(--accent-blue)' : 'var(--accent-purple)'}">
                                <div class="impl-deployment-option-header">
                                    <strong>${opt.name}</strong>
                                    <span class="impl-deployment-best-for">${opt.bestFor}</span>
                                </div>
                                <p style="font-size:0.75rem;color:var(--text-secondary);margin:6px 0">${opt.description}</p>
                                <div class="impl-deployment-pros-cons">
                                    <div class="impl-pros">
                                        <span style="color:var(--status-met);font-weight:600;font-size:0.65rem">✓ PROS</span>
                                        ${opt.pros.map(p => `<span class="impl-pro-item">${p}</span>`).join('')}
                                    </div>
                                    <div class="impl-cons">
                                        <span style="color:var(--status-not-met);font-weight:600;font-size:0.65rem">✗ CONS</span>
                                        ${opt.cons.map(c => `<span class="impl-con-item">${c}</span>`).join('')}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        // Steps
        if (guidance.steps && guidance.steps.length > 0) {
            html += `
                <div class="impl-task-section">
                    <h4>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                        Implementation Steps
                    </h4>
                    <ol class="impl-task-steps">
                        ${guidance.steps.map(s => `<li>${s}</li>`).join('')}
                    </ol>
                </div>
            `;
        }
        
        // Artifacts
        if (guidance.artifacts && guidance.artifacts.length > 0) {
            html += `
                <div class="impl-task-section">
                    <h4>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        Required Artifacts
                    </h4>
                    <div class="impl-task-artifacts">
                        ${guidance.artifacts.map(a => `<span class="impl-artifact-badge">${a}</span>`).join('')}
                    </div>
                </div>
            `;
        }
        
        // Platform-specific configs
        if (guidance.platforms) {
            html += `
                <div class="impl-task-section">
                    <h4>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        Platform Configuration
                    </h4>
                    <div class="impl-platform-configs">
                        ${Object.entries(guidance.platforms).map(([key, platform]) => `
                            <div class="impl-platform-card ${key}">
                                <h5>${platform.name}</h5>
                                ${platform.config ? platform.config.map(c => `
                                    <div class="impl-config-item">
                                        <strong>${c.setting}:</strong> <span class="config-value">${c.value || c.config || ''}</span>
                                        ${c.location ? `<span class="config-location">${c.location}</span>` : ''}
                                        ${c.path ? `<span class="config-location">${c.path}</span>` : ''}
                                    </div>
                                `).join('') : ''}
                                ${platform.steps ? platform.steps.map(s => `
                                    <div class="impl-config-item">${s}</div>
                                `).join('') : ''}
                                ${platform.gpo ? platform.gpo.map(g => `
                                    <div class="impl-config-item">
                                        <strong>${g.setting}:</strong> <span class="config-value">${g.value}</span>
                                        <span class="config-location">${g.path}</span>
                                    </div>
                                `).join('') : ''}
                                ${platform.registry ? platform.registry.map(r => `
                                    <div class="impl-config-item">
                                        <strong>${r.value}:</strong> <span class="config-value">${r.data}</span>
                                        <span class="config-location">${r.key}</span>
                                    </div>
                                `).join('') : ''}
                                ${platform.policies ? platform.policies.map(p => `
                                    <div class="impl-config-item">
                                        <strong>${p.name}:</strong> ${p.controls}
                                        <span class="config-location">Conditions: ${p.conditions}</span>
                                    </div>
                                `).join('') : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        // Rev 3: ODP Values
        if (guidance.odpValues && guidance.odpValues.length > 0) {
            html += `
                <div class="impl-task-section impl-odp-section">
                    <h4>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        Organization-Defined Parameters (ODPs)
                    </h4>
                    <div class="impl-odp-grid">
                        ${guidance.odpValues.map(odp => `
                            <div class="impl-odp-card">
                                <div class="impl-odp-control">${odp.control}</div>
                                <div class="impl-odp-param">${odp.param}</div>
                                <div class="impl-odp-suggested">Suggested: <strong>${odp.suggested}</strong></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Rev 3: ODP Definitions (full list)
        if (guidance.odpDefinitions && guidance.odpDefinitions.length > 0) {
            html += `
                <div class="impl-task-section impl-odp-section">
                    <h4>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        All ODPs to Define
                    </h4>
                    <div class="impl-odp-table-wrapper">
                        <table class="impl-odp-table">
                            <thead><tr><th>Control</th><th>Parameter</th><th>Suggested Value</th></tr></thead>
                            <tbody>
                                ${guidance.odpDefinitions.map(odp => `
                                    <tr>
                                        <td><code>${odp.control}</code></td>
                                        <td>${odp.param}</td>
                                        <td><strong>${odp.suggested}</strong></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        // Rev 3: New Controls badges
        if (guidance.rev3NewControls && guidance.rev3NewControls.length > 0) {
            html += `
                <div class="impl-task-section">
                    <h4>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        New Rev 3 Controls
                    </h4>
                    <div class="impl-new-controls">
                        ${guidance.rev3NewControls.map(c => `
                            <div class="impl-new-control-badge">
                                <span class="impl-new-control-id">${c.id}</span>
                                <span class="impl-new-control-name">${c.name}</span>
                                <span class="impl-new-control-note">${c.note}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Rev 3: Scope Options
        if (guidance.scopeOptions && guidance.scopeOptions.length > 0) {
            html += `
                <div class="impl-task-section">
                    <h4>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                        Scope Options
                    </h4>
                    <div class="impl-deployment-options">
                        ${guidance.scopeOptions.map((opt, idx) => `
                            <div class="impl-deployment-option" style="border-left:3px solid ${idx === 0 ? 'var(--status-met)' : idx === 1 ? 'var(--accent-blue)' : 'var(--accent-purple)'}">
                                <div class="impl-deployment-option-header">
                                    <strong>${opt.name}</strong>
                                    <span class="impl-deployment-best-for">${opt.bestFor}</span>
                                </div>
                                <div class="impl-deployment-pros-cons">
                                    <div class="impl-pros">
                                        <span style="color:var(--status-met);font-weight:600;font-size:0.65rem">PROS</span>
                                        ${opt.pros.map(p => `<span class="impl-pro-item">${p}</span>`).join('')}
                                    </div>
                                    <div class="impl-cons">
                                        <span style="color:var(--status-not-met);font-weight:600;font-size:0.65rem">CONS</span>
                                        ${opt.cons.map(c => `<span class="impl-con-item">${c}</span>`).join('')}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Rev 3: Budget Categories
        if (guidance.budgetCategories && guidance.budgetCategories.length > 0) {
            html += `
                <div class="impl-task-section">
                    <h4>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        Budget Estimates
                    </h4>
                    <div class="impl-odp-table-wrapper">
                        <table class="impl-odp-table">
                            <thead><tr><th>Category</th><th>Range</th><th>Notes</th></tr></thead>
                            <tbody>
                                ${guidance.budgetCategories.map(b => `
                                    <tr>
                                        <td><strong>${b.category}</strong></td>
                                        <td style="color:var(--accent-blue);font-weight:600">${b.range}</td>
                                        <td style="font-size:0.75rem;color:var(--text-secondary)">${b.notes}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        // Rev 3: Maturity Levels
        if (guidance.maturityLevels && guidance.maturityLevels.length > 0) {
            html += `
                <div class="impl-task-section">
                    <h4>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
                        Maturity Levels
                    </h4>
                    <div class="impl-maturity-levels">
                        ${guidance.maturityLevels.map(m => `
                            <div class="impl-maturity-level" style="border-left:3px solid ${m.color}">
                                <strong style="color:${m.color}">${m.level}</strong>
                                <span>${m.description}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Rev 3: Diagram Types
        if (guidance.diagramTypes && guidance.diagramTypes.length > 0) {
            html += `
                <div class="impl-task-section">
                    <h4>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                        Diagram Requirements
                    </h4>
                    <div class="impl-maturity-levels">
                        ${guidance.diagramTypes.map(d => `
                            <div class="impl-maturity-level" style="border-left:3px solid var(--accent-blue)">
                                <strong>${d.name}</strong>
                                <span>${d.description}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        return html || '<p style="font-size:0.75rem;color:var(--text-muted)">No additional details available.</p>';
    }
    
    
    getPhaseIcon(iconName) {
        const icons = {
            foundation: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20"/><path d="M5 20V8l7-4 7 4v12"/><path d="M9 20v-6h6v6"/></svg>',
            identity: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
            endpoint: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
            network: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="2" width="6" height="6"/><rect x="16" y="16" width="6" height="6"/><rect x="2" y="16" width="6" height="6"/><path d="M5 16v-4h14v4"/><line x1="12" y1="12" x2="12" y2="8"/></svg>',
            data: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
            monitor: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>',
            vdi: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 8h2m2 0h2m2 0h2"/><path d="M7 11h10"/></svg>',
            policies: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
            access: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
            audit: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>',
            operations: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
            risk: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            'supply-chain': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 16h6"/><path d="M2 16h6"/><rect x="8" y="12" width="8" height="8" rx="1"/><path d="M12 12V8"/><path d="M8 8h8"/><path d="M12 8V4"/><path d="M8 4h8"/></svg>',
            monitoring: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
            assessment: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>'
        };
        return icons[iconName] || icons.foundation;
    }
    
    bindImplPlannerEvents(container, planner, phaseProgress) {
        // Revision toggle
        container.querySelectorAll('.impl-rev-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rev = e.currentTarget.dataset.rev;
                if (rev !== this.implPlannerRevision) {
                    this.implPlannerRevision = rev;
                    localStorage.setItem('impl-planner-revision', rev);
                    this.renderImplPlanner();
                }
            });
        });
        
        // Phase tab clicks
        container.querySelectorAll('.impl-phase-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const phaseId = e.currentTarget.dataset.phase;
                this.implPlannerCurrentPhase = phaseId;
                const pKey = this.implPlannerRevision === 'l3' ? 'impl-planner-l3-phase' : (this.implPlannerRevision === 'r3' ? 'impl-planner-r3-phase' : 'impl-planner-phase');
                localStorage.setItem(pKey, phaseId);
                this.renderImplPlanner();
            });
        });
        
        // Milestone expand/collapse
        container.querySelectorAll('.impl-milestone-header').forEach(header => {
            header.addEventListener('click', (e) => {
                header.classList.toggle('expanded');
                header.nextElementSibling.classList.toggle('expanded');
            });
        });
        
        // Task checkboxes
        container.querySelectorAll('.impl-task-checkbox').forEach(cb => {
            cb.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = e.currentTarget.dataset.taskId;
                if (taskId) {
                    this.implPlannerProgress[taskId] = !this.implPlannerProgress[taskId];
                    const progressKey = this.implPlannerRevision === 'l3' ? 'impl-planner-l3-progress' : (this.implPlannerRevision === 'r3' ? 'impl-planner-r3-progress' : 'impl-planner-progress');
                    localStorage.setItem(progressKey, JSON.stringify(this.implPlannerProgress));
                    this.renderImplPlanner();
                }
            });
        });
        
        // Task detail expand
        container.querySelectorAll('.impl-task-expand').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = e.currentTarget.dataset.taskId;
                const details = document.getElementById(`task-details-${taskId}`);
                if (details) {
                    details.classList.toggle('expanded');
                    e.currentTarget.innerHTML = details.classList.contains('expanded') 
                        ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg> Hide details'
                        : '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg> Show implementation details';
                }
            });
        });
        
        // Control navigation
        container.querySelectorAll('.impl-task-control').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const controlId = e.currentTarget.dataset.control;
                if (controlId && this.navigateToControl) {
                    this.navigateToControl(controlId);
                }
            });
        });
        
        // Kanban card clicks
        container.querySelectorAll('.impl-kanban-task').forEach(card => {
            card.addEventListener('click', (e) => {
                const taskId = e.currentTarget.dataset.task;
                // Find the task's phase and switch to it
                const taskInfo = this.findTaskPhase(planner, taskId);
                if (taskInfo) {
                    this.implPlannerCurrentPhase = taskInfo.phaseId;
                    this.implPlannerView = 'phases';
                    const pKey = this.implPlannerRevision === 'l3' ? 'impl-planner-l3-phase' : (this.implPlannerRevision === 'r3' ? 'impl-planner-r3-phase' : 'impl-planner-phase');
                    localStorage.setItem(pKey, taskInfo.phaseId);
                    localStorage.setItem('impl-planner-view', 'phases');
                    this.renderImplPlanner();
                    // Expand milestone after render
                    setTimeout(() => {
                        const milestone = document.querySelector(`[data-milestone="${taskInfo.milestoneId}"]`);
                        if (milestone) {
                            milestone.querySelector('.impl-milestone-header')?.classList.add('expanded');
                            milestone.querySelector('.impl-tasks')?.classList.add('expanded');
                            const task = milestone.querySelector(`[data-task="${taskId}"]`);
                            if (task) {
                                task.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                task.style.boxShadow = '0 0 0 2px var(--accent-blue)';
                                setTimeout(() => task.style.boxShadow = '', 2000);
                            }
                        }
                    }, 100);
                }
            });
        });
    }
    
    findTaskPhase(planner, taskId) {
        for (const phase of planner.phases) {
            for (const milestone of phase.milestones) {
                if (milestone.tasks.find(t => t.id === taskId)) {
                    return { phaseId: phase.id, milestoneId: milestone.id };
                }
            }
        }
        return null;
    }
    
    // =============================================
    // OSC INVENTORY - See js/osc-inventory.js
    // =============================================
    renderOSCInventory() {
        if (typeof OSCInventory !== 'undefined') {
            OSCInventory.render(this);
        } else {
            const container = document.getElementById('osc-inventory-content');
            if (container) {
                container.innerHTML = '<p style="padding:40px;text-align:center;color:var(--text-muted)">Loading OSC Inventory...</p>';
            }
        }
    }
    
    renderImplGuideView() {
        const container = document.getElementById('impl-guide-content');
        if (!container) return;
        
        const guide = this.getImplGuide();
        const cloudNames = { azure: 'GCC-High / Azure Government', aws: 'AWS GovCloud', gcp: 'Google Cloud Platform' };
        const cloudShort = { azure: 'Azure', aws: 'AWS', gcp: 'GCP' };
        const currentCloud = this.implGuideCloud || 'azure';
        this.archGuideSection = this.archGuideSection || null;
        
        // Calculate assessment progress stats dynamically from active revision
        const isRev3 = this.assessmentRevision === 'r3' && this.assessmentLevel === '2';
        const families = this.getActiveControlFamilies();
        let totalObjectives = 0, totalControls = 0;
        families.forEach(family => {
            family.controls.forEach(control => {
                totalControls++;
                totalObjectives += control.objectives.length;
            });
        });
        const totalFamilies = families.length;
        const metCount = Object.values(this.assessmentData).filter(s => s === 'met').length;
        const notMetCount = Object.values(this.assessmentData).filter(s => s === 'not-met').length;
        const partialCount = Object.values(this.assessmentData).filter(s => s === 'partial').length;
        const naCount = Object.values(this.assessmentData).filter(s => s === 'na').length;
        const assessedCount = metCount + notMetCount + partialCount + naCount;
        const remainingCount = totalObjectives - assessedCount;
        const progressPct = totalObjectives > 0 ? Math.round((metCount / totalObjectives) * 100) : 0;
        const assessedPct = totalObjectives > 0 ? Math.round((assessedCount / totalObjectives) * 100) : 0;
        const revLabel = isRev3 ? 'Rev 3' : 'Rev 2';
        
        // Determine readiness status
        let readinessStatus, readinessClass;
        if (progressPct >= 100) {
            readinessStatus = 'Assessment Ready';
            readinessClass = 'ready';
        } else if (progressPct >= 75) {
            readinessStatus = 'Nearly Ready';
            readinessClass = 'near';
        } else if (progressPct >= 50) {
            readinessStatus = 'In Progress';
            readinessClass = 'progress';
        } else if (assessedCount > 0) {
            readinessStatus = 'Getting Started';
            readinessClass = 'started';
        } else {
            readinessStatus = 'Not Started';
            readinessClass = 'not-started';
        }
        
        // Render the redesigned Architecture Guide
        container.innerHTML = `
            <div class="arch-guide-container">
                <div class="arch-guide-header">
                    <div class="arch-guide-header-top">
                        <div class="arch-guide-title">
                            <button class="view-back-btn" data-back-view="dashboard" title="Back to Dashboard">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                                Back
                            </button>
                            <div class="arch-status-panel">
                                <div class="arch-status-ring">
                                    <svg viewBox="0 0 36 36" class="arch-progress-ring">
                                        <path class="arch-progress-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                        <path class="arch-progress-fill" stroke-dasharray="${progressPct}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                        <text x="18" y="20.5" class="arch-progress-text">${progressPct}%</text>
                                    </svg>
                                </div>
                                <div class="arch-status-info">
                                    <div class="arch-status-badge ${readinessClass}">${readinessStatus}</div>
                                    <div class="arch-status-counts">
                                        <span class="arch-count met" title="Met"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> ${metCount}</span>
                                        <span class="arch-count not-met" title="Not Met"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> ${notMetCount}</span>
                                        <span class="arch-count partial" title="Partial"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/></svg> ${partialCount}</span>
                                        <span class="arch-count remaining" title="Remaining">${remainingCount} left</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h1>Architecture Guide</h1>
                                <p>Implementation guidance for ${cloudNames[currentCloud]} <span style="opacity:0.6;font-size:0.8em">· NIST 800-171A ${revLabel}</span></p>
                            </div>
                        </div>
                        <div class="arch-cloud-selector">
                            <button class="arch-cloud-btn ${currentCloud === 'azure' ? 'active' : ''}" data-cloud="azure">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M5.483 21.3H24L14.025 4.013l-3.038 8.347 5.836 6.938L5.483 21.3zM13.049 2.7L0 17.623h4.494L13.049 2.7z"></path></svg>
                                Azure
                            </button>
                            <button class="arch-cloud-btn ${currentCloud === 'aws' ? 'active' : ''}" data-cloud="aws">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.75 11.35a4.32 4.32 0 0 1-.79-.08 3.9 3.9 0 0 1-.73-.23l-.17-.04h-.12q-.15 0-.15.21v.33a.43.43 0 0 0 0 .19.5.5 0 0 0 .21.19 3 3 0 0 0 .76.26 4.38 4.38 0 0 0 1 .12 3 3 0 0 0 1-.15 2 2 0 0 0 .72-.4 1.62 1.62 0 0 0 .42-.59 1.83 1.83 0 0 0 .14-.72 1.46 1.46 0 0 0-.36-1 2.55 2.55 0 0 0-1.11-.63l-.74-.24a2.13 2.13 0 0 1-.58-.27.47.47 0 0 1-.17-.37.53.53 0 0 1 .24-.47 1.21 1.21 0 0 1 .66-.15 2.75 2.75 0 0 1 .92.17.75.75 0 0 0 .24.05q.15 0 .15-.21v-.36a.38.38 0 0 0-.06-.21.64.64 0 0 0-.24-.14 2.15 2.15 0 0 0-.55-.14 4.07 4.07 0 0 0-.76-.07 2.85 2.85 0 0 0-.94.14 2 2 0 0 0-.68.38 1.54 1.54 0 0 0-.41.57 1.7 1.7 0 0 0-.14.69 1.54 1.54 0 0 0 .39 1.08 2.67 2.67 0 0 0 1.18.68l.74.24a1.8 1.8 0 0 1 .53.27.45.45 0 0 1 .14.36.59.59 0 0 1-.27.52 1.44 1.44 0 0 1-.76.17zm-7.86-2.14a3.6 3.6 0 0 0-.53 1 3.4 3.4 0 0 0-.17 1.06 3.2 3.2 0 0 0 .19 1.1 2.64 2.64 0 0 0 .55.9 2.54 2.54 0 0 0 .88.6 3.06 3.06 0 0 0 1.17.22 3.8 3.8 0 0 0 .82-.09 2.42 2.42 0 0 0 .63-.22v-1.32h-1.14a.22.22 0 0 0-.16.05.19.19 0 0 0-.05.14v.43a.21.21 0 0 0 .05.14.22.22 0 0 0 .16.06h.53v.6a2.29 2.29 0 0 1-.36.08 2.62 2.62 0 0 1-.44 0 1.74 1.74 0 0 1-.72-.14 1.45 1.45 0 0 1-.53-.41 1.87 1.87 0 0 1-.33-.63 2.68 2.68 0 0 1-.11-.8 2.66 2.66 0 0 1 .11-.79 1.79 1.79 0 0 1 .33-.63 1.5 1.5 0 0 1 .54-.41 1.78 1.78 0 0 1 .74-.15 2.53 2.53 0 0 1 .54.05 2.49 2.49 0 0 1 .43.15l.16.08a.27.27 0 0 0 .12 0 .18.18 0 0 0 .16-.08.31.31 0 0 0 0-.13v-.4a.38.38 0 0 0 0-.15.34.34 0 0 0-.14-.12 2.35 2.35 0 0 0-.58-.19 3.43 3.43 0 0 0-.71-.08 3 3 0 0 0-1.14.21 2.54 2.54 0 0 0-.86.58zM6.94 8.63l-2 5.02a.17.17 0 0 0 0 .1.13.13 0 0 0 .14.1h.67a.28.28 0 0 0 .2-.06.45.45 0 0 0 .09-.16l.4-1.05h2l.42 1.07a.28.28 0 0 0 .09.14.29.29 0 0 0 .2.06h.71a.13.13 0 0 0 .14-.1.17.17 0 0 0 0-.1l-2-5.02a.36.36 0 0 0-.1-.16.32.32 0 0 0-.21-.06h-.56a.3.3 0 0 0-.2.06.36.36 0 0 0-.09.16zm.68 1.24.72 1.87h-1.4z"></path><path d="M21.1 16.64a13.13 13.13 0 0 1-4.28 2.23 18.67 18.67 0 0 1-5.9.89 18.54 18.54 0 0 1-5-1 13.88 13.88 0 0 1-3.93-2.18c-.16-.12-.29 0-.18.16a14 14 0 0 0 4.65 3.54 16.34 16.34 0 0 0 9 1.53 15.47 15.47 0 0 0 5.68-2.94c.28-.22.05-.55-.04-.23z"></path><path d="M22.33 15.17c-.2-.26-.55-.39-1.2-.33a6.72 6.72 0 0 0-1.81.33c-.17.06-.14.15 0 .14s.74-.08 1.11-.08a2.59 2.59 0 0 1 1.23.18c.25.15 0 .72-.23 1.16a4.06 4.06 0 0 1-1.42 1.44c-.17.11-.13.27.05.2a3.24 3.24 0 0 0 1.54-1.32 2.25 2.25 0 0 0 .73-1.72z"></path></svg>
                                AWS
                            </button>
                            <button class="arch-cloud-btn ${currentCloud === 'gcp' ? 'active' : ''}" data-cloud="gcp">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.19 2.38a9.34 9.34 0 0 0-9.23 6.89c.05-.02-.06.01 0 0-3.88 2.55-3.92 8.11-.25 10.94l.01-.01-.01.03a6.72 6.72 0 0 0 4.08 1.36h5.17l.03.03h5.19c6.69.05 9.38-8.61 3.84-12.35a9.37 9.37 0 0 0-8.83-6.89z"></path></svg>
                                GCP
                            </button>
                        </div>
                    </div>
                </div>
                
                ${this.archGuideSection ? this.renderArchGuideSection(guide, this.archGuideSection) : this.renderArchGuideCategories(guide)}
            </div>
        `;
        
        this.bindArchGuideEvents(container, guide);
    }
    
    renderArchGuideCategories(guide) {
        // Dynamic counts from active revision
        const isRev3 = this.assessmentRevision === 'r3' && this.assessmentLevel === '2';
        const activeFamilies = this.getActiveControlFamilies();
        let dynControls = 0, dynObjectives = 0;
        activeFamilies.forEach(f => f.controls.forEach(c => { dynControls++; dynObjectives += c.objectives.length; }));
        const hasL3 = typeof NIST_800_172A_FAMILIES !== 'undefined' && NIST_800_172A_FAMILIES.length > 0;
        let l3Controls = 0, l3Objectives = 0;
        if (hasL3) {
            NIST_800_172A_FAMILIES.forEach(f => f.controls.forEach(c => { l3Controls++; l3Objectives += c.objectives.length; }));
        }
        // Count vendor platforms from comprehensive guidance UI
        const cgui = typeof ComprehensiveGuidanceUI !== 'undefined' ? ComprehensiveGuidanceUI : null;
        const vendorCount = cgui ? Object.keys(cgui.techNames || {}).length : 60;

        const categories = [
            { id: 'project-plan', name: 'Project Plan', desc: 'Implementation timeline, milestones, and task tracking for your CMMC journey', icon: 'clipboard-list', items: guide?.phases?.length || 8 },
            { id: 'evidence', name: 'Evidence Collection', desc: 'Artifact requirements and evidence gathering guidance for each control', icon: 'folder-check', items: dynControls },
            { id: 'policies', name: 'Policies & Procedures', desc: 'Required policy documents and procedure templates mapped to controls', icon: 'file-text', items: 24 },
            { id: 'ssp', name: 'System Security Plan', desc: 'SSP structure, control responsibility matrix, and documentation guidance', icon: 'shield', items: 14 },
            { id: 'services', name: 'Cloud Services', desc: 'FedRAMP-authorized services and configuration guidance for your platform', icon: 'cloud', items: 45 },
            { id: 'security-stack', name: 'Security Stack', desc: 'Vendor & GRC platform guidance — Drata, Vanta, Secureframe, IntelliGRC, Palo Alto, SentinelOne, NinjaOne, Tenable, and 50+ more', icon: 'layers', items: vendorCount },
            { id: 'architecture', name: 'Reference Architecture', desc: 'Network diagrams, enclave patterns, and VDI deployment options', icon: 'layout', items: 12 },
            { id: 'cui-discovery', name: 'CUI Discovery', desc: 'Native tools for identifying and classifying CUI in your environment', icon: 'search', items: 6 },
            { id: 'extras', name: 'Extras & Deep Dives', desc: 'Advanced topics, ITAR guidance, and platform-specific configurations', icon: 'layers', items: 8 }
        ];
        
        const icons = {
            'clipboard-list': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="15" y2="16"/></svg>',
            'folder-check': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><path d="m9 13 2 2 4-4"/></svg>',
            'file-text': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
            'shield': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
            'cloud': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
            'layout': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
            'search': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
            'layers': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'
        };
        
        return `
            <div class="arch-quick-stats">
                <div class="arch-quick-stat"><div class="value">${dynControls}${hasL3 ? '<span style="font-size:0.55em;color:#fbbf24;margin-left:2px">+' + l3Controls + '</span>' : ''}</div><div class="label">${isRev3 ? 'Rev 3' : 'Rev 2'} Controls${hasL3 ? ' + L3' : ''}</div></div>
                <div class="arch-quick-stat"><div class="value">${dynObjectives}${hasL3 ? '<span style="font-size:0.55em;color:#fbbf24;margin-left:2px">+' + l3Objectives + '</span>' : ''}</div><div class="label">Objectives${hasL3 ? ' + L3' : ''}</div></div>
                <div class="arch-quick-stat"><div class="value">${activeFamilies.length}</div><div class="label">Families</div></div>
                <div class="arch-quick-stat"><div class="value">${vendorCount}</div><div class="label">Vendor Platforms</div></div>
                <div class="arch-quick-stat"><div class="value">4</div><div class="label">GRC Platforms</div></div>
                <div class="arch-quick-stat"><div class="value" style="font-size:0.85em">L/M/H</div><div class="label">FedRAMP Baselines</div></div>
            </div>
            ${isRev3 ? `<div class="arch-rev-banner" style="display:flex;align-items:center;gap:10px;padding:10px 16px;margin-bottom:16px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:8px;font-size:0.8rem;color:var(--text-secondary)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <span><strong style="color:#10b981">Rev 3 Active</strong> — ${activeFamilies.length} families, ${dynControls} controls, ${dynObjectives} objectives. Includes new families (PL, SR, SA) and updated control numbering (03.xx.xx format).</span>
            </div>` : ''}
            ${hasL3 ? `<div style="display:flex;align-items:center;gap:10px;padding:10px 16px;margin-bottom:16px;background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.2);border-radius:8px;font-size:0.8rem;color:var(--text-secondary)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span><strong style="color:#fbbf24">CMMC Level 3 Enhanced</strong> — ${l3Controls} additional controls, ${l3Objectives} objectives from NIST SP 800-172A for protecting CUI against advanced persistent threats.</span>
            </div>` : ''}
            <div class="arch-category-grid">
                ${categories.map(cat => `
                    <div class="arch-category-card" data-category="${cat.id}">
                        <div class="arch-category-icon">${icons[cat.icon]}</div>
                        <h3>${cat.name}</h3>
                        <p>${cat.desc}</p>
                        <div class="arch-category-meta">
                            <span class="arch-category-stat">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                ${cat.items} items
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderArchGuideSection(guide, section) {
        const backBtn = `
            <button class="arch-back-btn" data-back="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Back to Categories
            </button>
        `;
        
        switch(section) {
            case 'project-plan': return backBtn + this.renderImplProjectPlan(guide);
            case 'evidence': return backBtn + this.renderImplEvidence(guide);
            case 'policies': return backBtn + this.renderImplPolicies(guide);
            case 'ssp': return backBtn + this.renderImplSSP(guide);
            case 'services': return backBtn + this.renderImplServices(guide);
            case 'security-stack': return backBtn + this.renderSecurityStack();
            case 'architecture': return backBtn + this.renderImplArchitecture();
            case 'cui-discovery': return backBtn + this.renderCUIDiscovery();
            case 'extras': return backBtn + this.renderImplExtras(guide);
            default: return this.renderArchGuideCategories(guide);
        }
    }
    
    renderCUIDiscovery() {
        const guidance = typeof ENCLAVE_GUIDANCE !== 'undefined' ? ENCLAVE_GUIDANCE : null;
        const cuiData = guidance?.cuiIdentification || {};
        const currentCloud = this.implGuideCloud || 'azure';
        const platform = cuiData[currentCloud] || {};
        
        return `
            <div class="arch-section">
                <div class="arch-section-header">
                    <h2>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        CUI Discovery - ${platform.name || 'Native Tools'}
                    </h2>
                </div>
                <div class="arch-section-body">
                    <p style="color:var(--text-secondary);margin-bottom:20px">${platform.description || 'Identify and classify CUI using native cloud tools - no third-party solutions required.'}</p>
                    
                    ${platform.nativeTools ? platform.nativeTools.map(tool => `
                        <div style="background:var(--bg-primary);border:1px solid var(--border-color);border-radius:8px;padding:20px;margin-bottom:16px">
                            <h3 style="font-size:1rem;color:var(--text-primary);margin:0 0 8px 0">${tool.tool}</h3>
                            <p style="font-size:0.85rem;color:var(--text-muted);margin:0 0 16px 0">${tool.purpose}</p>
                            
                            ${tool.setup ? `
                                <h4 style="font-size:0.8rem;color:var(--text-secondary);margin:0 0 8px 0">Setup Steps</h4>
                                <ol style="font-size:0.8rem;color:var(--text-secondary);margin:0 0 16px 0;padding-left:20px">
                                    ${tool.setup.map(s => `<li style="margin-bottom:4px">${s}</li>`).join('')}
                                </ol>
                            ` : ''}
                            
                            ${tool.cliCommands ? `
                                <h4 style="font-size:0.8rem;color:var(--text-secondary);margin:0 0 8px 0">CLI Commands</h4>
                                <pre style="background:var(--bg-tertiary);padding:12px;border-radius:6px;font-size:0.75rem;overflow-x:auto;margin:0 0 16px 0"><code>${tool.cliCommands.join('\n')}</code></pre>
                            ` : ''}
                            
                            ${tool.customIdentifiers ? `
                                <h4 style="font-size:0.8rem;color:var(--text-secondary);margin:0 0 8px 0">Custom CUI Patterns</h4>
                                <div style="display:grid;gap:8px">
                                    ${tool.customIdentifiers.map(id => `
                                        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--bg-tertiary);border-radius:4px">
                                            <span style="font-weight:600;font-size:0.8rem;color:var(--text-primary)">${id.name}</span>
                                            <code style="font-size:0.7rem;color:var(--accent-blue)">${id.regex || id.pattern}</code>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                            
                            ${tool.docLink ? `<a href="${tool.docLink}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;font-size:0.8rem;color:var(--accent-blue);margin-top:12px">Documentation →</a>` : ''}
                        </div>
                    `).join('') : '<p style="color:var(--text-muted)">No CUI discovery guidance available for this platform.</p>'}
                    
                    ${platform.costConsiderations ? `<p style="font-size:0.8rem;color:var(--text-muted);margin-top:16px;padding:12px;background:var(--bg-tertiary);border-radius:6px"><strong>Cost:</strong> ${platform.costConsiderations}</p>` : ''}
                </div>
            </div>
        `;
    }
    
    renderSecurityStack() {
        const isRev3 = this.assessmentRevision === 'r3' && this.assessmentLevel === '2';
        const hasL3 = typeof NIST_800_172A_FAMILIES !== 'undefined' && NIST_800_172A_FAMILIES.length > 0;
        const cgui = typeof ComprehensiveGuidanceUI !== 'undefined' ? ComprehensiveGuidanceUI : null;

        // Define the primary vendor stack with descriptions
        const vendorStack = [
            { key: 'paloalto', name: 'Palo Alto Networks', category: 'Firewalls & Network', color: '#FA582D',
              desc: 'PAN-OS, GlobalProtect, Panorama, WildFire, Threat Prevention, Cortex XDR',
              controls: 'AC, SC, SI, AU, CA, IR — boundary protection, network segmentation, threat prevention, VPN' },
            { key: 'sentinelone', name: 'SentinelOne', category: 'XDR / EDR', color: '#6C2EB9',
              desc: 'Singularity XDR, Device Control, ITDR, Ranger, Deep Visibility, STAR custom rules',
              controls: 'SI, IR, AU, CM, SC — malware protection, incident response, endpoint detection, device control' },
            { key: 'ninjaone', name: 'NinjaOne', category: 'RMM & Endpoint Mgmt', color: '#00AEEF',
              desc: 'RMM, Patch Management, Scripting Engine, Monitoring, Backup, Documentation',
              controls: 'CM, MA, SI, MP — configuration management, patching, maintenance, system monitoring' },
            { key: 'tenable', name: 'Tenable', category: 'Vulnerability Management', color: '#00B1E1',
              desc: 'Tenable.io, Nessus, Compliance Scans, VPR scoring, STIG/CIS audit profiles',
              controls: 'RA, CA, SI, CM — vulnerability scanning, risk assessment, compliance auditing, configuration checks' },
            { key: 'azure', name: 'Microsoft Azure / GCC High', category: 'Cloud Platform', color: '#0078D4',
              desc: 'Entra ID, Intune, Defender, Purview, Sentinel, Azure Virtual Desktop, Key Vault',
              controls: 'All families — identity, endpoint, data protection, monitoring, VDI, encryption' },
            { key: 'aws', name: 'Amazon Web Services GovCloud', category: 'Cloud Platform', color: '#FF9900',
              desc: 'IAM, CloudTrail, GuardDuty, Config, SecurityHub, WorkSpaces, KMS, Systems Manager',
              controls: 'All families — identity, audit logging, threat detection, configuration, VDI, encryption' },
            { key: 'gcp', name: 'Google Cloud Platform', category: 'Cloud Platform', color: '#4285F4',
              desc: 'Cloud IAM, Assured Workloads, Chronicle, BeyondCorp, Cloud KMS, Compute Engine',
              controls: 'All families — identity, compliance workloads, SIEM, zero-trust, encryption' }
        ];

        // GRC & Compliance platforms with per-control guidance
        const grcPlatforms = [
            { key: 'drata', name: 'Drata', color: '#6C63FF',
              desc: 'Automated compliance monitoring, access reviews, evidence collection, risk management, policy center',
              controls: 'All families — continuous compliance monitoring, automated evidence, access reviews, vendor management' },
            { key: 'vanta', name: 'Vanta', color: '#1B1464',
              desc: 'Trust management, automated security monitoring, access reviews, vendor risk, policy management',
              controls: 'All families — automated testing, continuous monitoring, trust center, personnel management' },
            { key: 'secureframe', name: 'Secureframe', color: '#6366F1',
              desc: 'Compliance automation, continuous monitoring, personnel tracking, risk management, readiness reports',
              controls: 'All families — compliance dashboard, automated evidence, risk management, readiness tracking' },
            { key: 'intelligrc', name: 'IntelliGRC', color: '#0D47A1',
              desc: 'GRC platform with control management, evidence library, risk register, assessment scheduling, policy library',
              controls: 'All families — control mapping, evidence management, risk assessment, policy tracking' }
        ];

        // Additional vendors available in comprehensive guidance
        const additionalVendors = [
            { category: 'Identity & Access (IAM/PAM)', vendors: ['Okta', 'CyberArk', 'Delinea', 'BeyondTrust', 'JumpCloud', 'Cisco Duo', 'Keeper'] },
            { category: 'SIEM & Monitoring', vendors: ['Splunk', 'Elastic Stack (ELK)', 'Microsoft Sentinel', 'Sumo Logic', 'Blumira'] },
            { category: 'Email Security', vendors: ['Proofpoint', 'Mimecast', 'Abnormal Security'] },
            { category: 'DLP & Data Protection', vendors: ['Microsoft Purview', 'Netskope', 'Code42 Incydr'] },
            { category: 'Backup & Recovery', vendors: ['Veeam', 'Druva', 'Datto BCDR', 'Acronis'] },
            { category: 'MDM / UEM', vendors: ['Microsoft Intune', 'Jamf Pro', 'Kandji', 'VMware Workspace ONE'] },
            { category: 'CSPM / Cloud Security', vendors: ['Palo Alto Prisma Cloud', 'Wiz', 'Orca Security'] }
        ];

        const icons = cgui?.icons || {};

        return `
            <div class="arch-section">
                <div class="arch-section-header">
                    <h2>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                        Security Stack — Vendor Implementation Guidance
                    </h2>
                    <p style="color:var(--text-secondary);font-size:0.85rem;margin:4px 0 0 0">
                        Per-control implementation steps are available for each vendor below. Open any control in the 
                        <strong>Assessment</strong> view to see detailed, vendor-specific guidance under each objective.
                        ${isRev3 ? '<span style="color:#10b981"> Includes Rev 3 control mappings.</span>' : ''}
                        ${hasL3 ? '<span style="color:#fbbf24"> L3 enhanced controls included.</span>' : ''}
                    </p>
                </div>
                <div class="arch-section-body">
                    <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;margin-bottom:20px;background:rgba(79,70,229,0.08);border:1px solid rgba(79,70,229,0.2);border-radius:8px;font-size:0.8rem;color:var(--text-secondary)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        <span><strong>Tip:</strong> Each control's objectives in the Assessment view include expandable implementation guidance with CLI commands, Terraform examples, verification steps, and cost estimates per vendor.</span>
                    </div>

                    <div id="fedramp-mkt-stats-banner"></div>

                    <h3 style="font-size:0.9rem;color:var(--text-primary);margin:0 0 12px 0;font-weight:600">Primary Vendor Stack</h3>
                    <div class="impl-cards-grid" style="margin-bottom:24px">
                        ${vendorStack.map(v => {
                            const fBadge = (typeof FedRAMPMarketplace !== 'undefined' && FedRAMPMarketplace.loaded) ? FedRAMPMarketplace.renderBadge(v.key, {size:'sm'}) : `<span class="fedramp-badge-slot" data-vendor="${v.key}"></span>`;
                            return `
                            <div class="impl-policy-card" style="border-top:3px solid ${v.color}">
                                <div class="impl-policy-header" style="background:${v.color}15;display:flex;align-items:center;gap:10px">
                                    <span>${icons[v.key] || ''}</span>
                                    <div style="flex:1">
                                        <h4 style="margin:0">${v.name}</h4>
                                        <span style="font-size:0.65rem;opacity:0.7">${v.category}</span>
                                    </div>
                                    ${fBadge}
                                </div>
                                <div class="impl-policy-body">
                                    <p style="font-size:0.8rem;margin:0 0 10px 0;color:var(--text-secondary)">${v.desc}</p>
                                    <div style="font-size:0.7rem;color:var(--text-muted)">
                                        <strong>Control Families:</strong> ${v.controls}
                                    </div>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>

                    <h3 style="font-size:0.9rem;color:var(--text-primary);margin:0 0 12px 0;font-weight:600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" style="vertical-align:-2px;margin-right:6px"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                        GRC & Compliance Platforms
                    </h3>
                    <p style="font-size:0.8rem;color:var(--text-muted);margin:0 0 12px 0">Per-control implementation guidance for automated compliance platforms. Each platform has steps for evidence collection, control mapping, and continuous monitoring.</p>
                    <div class="impl-cards-grid" style="margin-bottom:24px">
                        ${grcPlatforms.map(v => {
                            const logo = (typeof VendorLogos !== 'undefined' && VendorLogos.has(v.key)) ? VendorLogos.get(v.key, 20) : '';
                            const fBadge = (typeof FedRAMPMarketplace !== 'undefined' && FedRAMPMarketplace.loaded) ? FedRAMPMarketplace.renderBadge(v.key, {size:'sm'}) : `<span class="fedramp-badge-slot" data-vendor="${v.key}"></span>`;
                            return `
                            <div class="impl-policy-card" style="border-top:3px solid ${v.color}">
                                <div class="impl-policy-header" style="background:${v.color}15;display:flex;align-items:center;gap:10px">
                                    <span>${logo}</span>
                                    <div style="flex:1">
                                        <h4 style="margin:0">${v.name}</h4>
                                        <span style="font-size:0.65rem;opacity:0.7">GRC & Compliance</span>
                                    </div>
                                    ${fBadge}
                                </div>
                                <div class="impl-policy-body">
                                    <p style="font-size:0.8rem;margin:0 0 10px 0;color:var(--text-secondary)">${v.desc}</p>
                                    <div style="font-size:0.7rem;color:var(--text-muted)">
                                        <strong>Control Families:</strong> ${v.controls}
                                    </div>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>

                    <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;margin-bottom:20px;background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.2);border-radius:8px;font-size:0.8rem;color:var(--text-secondary)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        <span><strong>FedRAMP Baselines:</strong> Each control in the Assessment view now shows FedRAMP baseline tags (Low, Moderate, High, 20x Low) indicating which FedRAMP baselines require that control.</span>
                    </div>

                    <h3 style="font-size:0.9rem;color:var(--text-primary);margin:0 0 12px 0;font-weight:600">Additional Vendors by Category</h3>
                    <p style="font-size:0.8rem;color:var(--text-muted);margin:0 0 12px 0">These vendors also have per-control implementation guidance available in the Assessment view.</p>
                    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin-bottom:20px">
                        ${additionalVendors.map(cat => `
                            <div style="background:var(--bg-primary);border:1px solid var(--border-color);border-radius:8px;padding:14px">
                                <div style="font-size:0.8rem;font-weight:600;color:var(--text-primary);margin-bottom:8px">${cat.category}</div>
                                <div style="display:flex;flex-wrap:wrap;gap:6px">
                                    ${cat.vendors.map(v => `<span style="font-size:0.7rem;padding:3px 8px;background:var(--bg-tertiary);border-radius:4px;color:var(--text-secondary)">${v}</span>`).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div style="padding:14px;background:var(--bg-tertiary);border-radius:8px;font-size:0.8rem;color:var(--text-secondary)">
                        <strong>How to access per-control guidance:</strong>
                        <ol style="margin:8px 0 0 0;padding-left:20px">
                            <li>Navigate to the <strong>Assessment</strong> view from the sidebar</li>
                            <li>Expand any control to see its objectives</li>
                            <li>Each objective has an <strong>Implementation Guidance</strong> section with vendor-specific dropdowns</li>
                            <li>Expand a vendor to see implementation steps, CLI commands, code examples, and verification steps</li>
                        </ol>
                    </div>
                </div>
            </div>
        `;
    }

    bindArchGuideEvents(container, guide) {
        // Cloud selector
        container.querySelectorAll('.arch-cloud-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.implGuideCloud = btn.dataset.cloud;
                this.renderImplGuideView();
            });
        });
        
        // Category cards
        container.querySelectorAll('.arch-category-card').forEach(card => {
            card.addEventListener('click', () => {
                this.archGuideSection = card.dataset.category;
                this.renderImplGuideView();
            });
        });
        
        // Back button
        container.querySelectorAll('.arch-back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.archGuideSection = null;
                this.renderImplGuideView();
            });
        });
        
        // Extras navigation buttons (scroll to section AND expand it)
        container.querySelectorAll('.extras-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.scrollTo;
                const target = document.getElementById(targetId);
                if (target) {
                    // Expand the section if it has section-content (new collapsible style)
                    if (target.classList.contains('extras-collapsible') && !target.classList.contains('section-expanded')) {
                        target.classList.add('section-expanded');
                    }
                    // Also handle old details-based collapsibles
                    const details = target.querySelector('details.extras-details');
                    if (details && !details.open) details.open = true;
                    // Scroll after a brief delay to allow expansion
                    setTimeout(() => {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                }
            });
        });
        
        // Section title click to toggle collapse/expand
        container.querySelectorAll('.extras-collapsible > .impl-section-title').forEach(title => {
            title.addEventListener('click', () => {
                const section = title.closest('.extras-collapsible');
                if (section) {
                    section.classList.toggle('section-expanded');
                }
            });
        });
        
        // Extras search functionality
        const extrasSearch = container.querySelector('#extras-search-input');
        if (extrasSearch) {
            extrasSearch.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                container.querySelectorAll('.extras-collapsible').forEach(section => {
                    const text = section.textContent.toLowerCase();
                    if (query && !text.includes(query)) {
                        section.style.display = 'none';
                    } else {
                        section.style.display = '';
                        // Open matching sections
                        if (query) {
                            section.classList.add('section-expanded');
                            const details = section.querySelector('details.extras-details');
                            if (details) details.open = true;
                        }
                    }
                });
            });
        }
        
        // Architecture search functionality
        const archSearch = container.querySelector('#arch-search-input');
        if (archSearch) {
            archSearch.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                container.querySelectorAll('.extras-collapsible').forEach(section => {
                    const text = section.textContent.toLowerCase();
                    if (query && !text.includes(query)) {
                        section.style.display = 'none';
                    } else {
                        section.style.display = '';
                        // Expand matching sections when searching
                        if (query) {
                            section.classList.add('section-expanded');
                        }
                    }
                });
            });
        }

        // FedRAMP Marketplace: deferred backfill when data loads after render
        if (typeof FedRAMPMarketplace !== 'undefined') {
            const backfillFedRAMP = () => {
                // Fill badge placeholder slots
                container.querySelectorAll('.fedramp-badge-slot[data-vendor]').forEach(slot => {
                    const badge = FedRAMPMarketplace.renderBadge(slot.dataset.vendor, {size:'sm'});
                    if (badge) slot.outerHTML = badge;
                });
                // Render marketplace stats banner
                const banner = container.querySelector('#fedramp-mkt-stats-banner');
                if (banner && !banner.hasChildNodes()) {
                    const tracked = FedRAMPMarketplace.getTrackedVendorStats();
                    const stats = FedRAMPMarketplace.getStats();
                    if (tracked && stats) {
                        banner.innerHTML = `<div class="fedramp-mkt-stats">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                            <span><strong>FedRAMP Marketplace</strong> (live data)</span>
                            <span class="fedramp-mkt-stat"><span class="fedramp-mkt-stat-val">${stats.total}</span><span class="fedramp-mkt-stat-label">CSO listings</span></span>
                            <span class="fedramp-mkt-stat"><span class="fedramp-mkt-stat-val">${tracked.authorized}</span><span class="fedramp-mkt-stat-label">of ${tracked.total} tracked vendors authorized</span></span>
                            <span class="fedramp-mkt-stat"><span class="fedramp-mkt-stat-val">${tracked.inProcess}</span><span class="fedramp-mkt-stat-label">in process</span></span>
                            <span class="fedramp-mkt-stat"><span class="fedramp-mkt-stat-val">${stats.high}</span><span class="fedramp-mkt-stat-label">High</span></span>
                            <span class="fedramp-mkt-stat"><span class="fedramp-mkt-stat-val">${stats.moderate}</span><span class="fedramp-mkt-stat-label">Moderate</span></span>
                        </div>`;
                    }
                }
            };
            if (FedRAMPMarketplace.loaded) {
                backfillFedRAMP();
            } else {
                FedRAMPMarketplace.onReady(backfillFedRAMP);
            }
        }
    }

    renderControls() {
        const container = document.getElementById('controls-list');
        if (!container) {
            console.error('controls-list element not found');
            return;
        }
        container.innerHTML = '';

        // Handle L3 assessment separately using NIST 800-172A data
        if (this.assessmentLevel === '3') {
            this.renderL3Controls(container);
            return;
        }

        // Add Rev 3 info banner when in Rev 3 mode
        if (this.assessmentRevision === 'r3' && this.assessmentLevel === '2') {
            const banner = document.createElement('div');
            banner.className = 'r3-info-banner';
            banner.innerHTML = `
                <div class="r3-banner-content">
                    <div class="r3-banner-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                    </div>
                    <div class="r3-banner-text">
                        <strong>NIST SP 800-171 Revision 3 Assessment</strong>
                        <p>Assessing against NIST SP 800-171A Rev 3 (November 2024). Includes 97 controls across 17 families with 417 assessment objectives. Organization-Defined Parameters (ODPs) are tracked separately with DoD-defined values. Rev 3 assessment data is stored separately from Rev 2. Transition deadline: November 2026.</p>
                        <div class="r3-banner-actions">
                            <button class="r3-migrate-btn" id="r3-migrate-btn" title="Copy Rev 2 assessment statuses to Rev 3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: -2px; margin-right: 4px;"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                                Migrate from Rev 2
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(banner);

            // Bind migrate button
            banner.querySelector('#r3-migrate-btn')?.addEventListener('click', () => this.migrateRev2ToRev3());
        }

        // Get the appropriate control families based on revision
        const families = this.getActiveControlFamilies();

        // Filter families based on assessment level (L1/L2)
        families.forEach(family => {
            // Filter controls within each family based on level
            const filteredControls = family.controls.filter(control => {
                // Rev 3 controls don't have framework mappings yet, show all
                if (this.assessmentRevision === 'r3') return true;
                const mapping = typeof getFrameworkMappings === 'function' ? getFrameworkMappings(control.id) : null;
                const cmmcLevel = mapping?.cmmc?.level || 2;
                // L1 assessment: only show L1 controls; L2 assessment: show all controls
                return this.assessmentLevel === '1' ? cmmcLevel === 1 : true;
            });
            
            // Only render family if it has controls after filtering
            if (filteredControls.length > 0) {
                const familyEl = this.createFamilyElement({ ...family, controls: filteredControls });
                container.appendChild(familyEl);
            }
        });
    }

    renderL3Controls(container) {
        // Check if L3 data is available - try window object as fallback
        const l3Families = typeof NIST_800_172A_FAMILIES !== 'undefined' ? NIST_800_172A_FAMILIES : 
                          (typeof window.NIST_800_172A_FAMILIES !== 'undefined' ? window.NIST_800_172A_FAMILIES : null);
        
        if (!l3Families || !Array.isArray(l3Families) || l3Families.length === 0) {
            // Show loading state while we attempt to load the script dynamically
            container.innerHTML = `
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <h3>Loading CMMC Level 3 Data…</h3>
                    <p>Please wait while the NIST SP 800-172A data loads.</p>
                </div>`;
            // Dynamically load the L3 data script if not yet available
            const scriptSrc = 'data/nist-800-172a.js';
            const existingScript = document.querySelector('script[src^="' + scriptSrc + '"]');
            if (existingScript) {
                // Script tag exists but may not have executed yet (defer) — poll for data
                const pollInterval = setInterval(() => {
                    const data = typeof NIST_800_172A_FAMILIES !== 'undefined' ? NIST_800_172A_FAMILIES :
                                 (typeof window.NIST_800_172A_FAMILIES !== 'undefined' ? window.NIST_800_172A_FAMILIES : null);
                    if (data && Array.isArray(data) && data.length > 0) {
                        clearInterval(pollInterval);
                        // Only re-render if still on L3
                        if (this.assessmentLevel === '3') {
                            container.innerHTML = '';
                            this.renderL3Controls(container);
                            this.updateProgress();
                            this.filterControls();
                            this.populateFamilyFilter();
                        }
                    }
                }, 100);
                // Stop polling after 10 seconds
                setTimeout(() => {
                    clearInterval(pollInterval);
                    const data = typeof NIST_800_172A_FAMILIES !== 'undefined' ? NIST_800_172A_FAMILIES : null;
                    if (!data || !Array.isArray(data) || data.length === 0) {
                        container.innerHTML = `
                            <div class="empty-state">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                <h3>CMMC Level 3 Data Not Available</h3>
                                <p>The NIST SP 800-172A data file could not be loaded. Ensure <code>data/nist-800-172a.js</code> is included in the page.</p>
                            </div>`;
                    }
                }, 10000);
            } else {
                // Script tag doesn't exist — inject it dynamically
                const script = document.createElement('script');
                script.src = scriptSrc + '?v=' + Date.now();
                script.onload = () => {
                    if (this.assessmentLevel === '3') {
                        container.innerHTML = '';
                        this.renderL3Controls(container);
                        this.updateProgress();
                        this.filterControls();
                        this.populateFamilyFilter();
                    }
                };
                script.onerror = () => {
                    container.innerHTML = `
                        <div class="empty-state">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <h3>CMMC Level 3 Data Not Available</h3>
                            <p>The NIST SP 800-172A data file could not be loaded. Ensure <code>data/nist-800-172a.js</code> is included in the page.</p>
                        </div>`;
                };
                document.body.appendChild(script);
            }
            return;
        }

        // Add L3 info banner
        const infoBanner = document.createElement('div');
        infoBanner.className = 'l3-info-banner';
        infoBanner.innerHTML = `
            <div class="l3-banner-content">
                <div class="l3-banner-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                </div>
                <div class="l3-banner-text">
                    <strong>CMMC Level 3 - Enhanced Security Requirements</strong>
                    <p>35 enhanced requirements for protecting CUI from Advanced Persistent Threats (APTs). These are in addition to Level 2 requirements. L3 assessment is tracked separately and does not affect SPRS scoring.</p>
                </div>
            </div>
        `;
        container.appendChild(infoBanner);

        // Render L3 families using the resolved data
        l3Families.forEach(family => {
            const familyEl = this.createL3FamilyElement(family);
            container.appendChild(familyEl);
        });
    }

    createL3FamilyElement(family) {
        const familyDiv = document.createElement('div');
        familyDiv.className = 'control-family l3-family';
        familyDiv.dataset.familyId = family.id;

        // Calculate family stats for L3
        const stats = this.calculateL3FamilyStats(family);

        familyDiv.innerHTML = `
            <div class="family-header">
                <div class="family-title">
                    <span class="family-id l3">${family.id}</span>
                    <h3>${family.name}</h3>
                    <span class="l3-badge">L3 Enhanced</span>
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
            const controlEl = this.createL3ControlElement(control, family.id);
            controlsContainer.appendChild(controlEl);
        });

        return familyDiv;
    }

    createL3ControlElement(control, familyId) {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'control-item l3-control';
        controlDiv.dataset.controlId = control.id;

        const cmmcId = control.cmmcPracticeId || '';
        const baseControl = control.baseControl || '';

        controlDiv.innerHTML = `
            <div class="control-header" data-family-id="${familyId}">
                <div class="control-info">
                    <div class="control-id">
                        ${control.id} - ${control.name}
                        <span class="l3-enhanced-badge" title="Enhanced requirement based on ${baseControl}">Enhanced</span>
                    </div>
                    <div class="control-meta">${cmmcId}${baseControl ? ` (based on ${baseControl})` : ''}</div>
                    <div class="control-name">${control.requirement}</div>
                </div>
                <svg class="control-chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div class="control-objectives"></div>
        `;

        const header = controlDiv.querySelector('.control-header');
        const objectivesContainer = controlDiv.querySelector('.control-objectives');

        header.addEventListener('click', (e) => {
            if (e.target.closest('.status-btn')) return;
            header.classList.toggle('expanded');
            objectivesContainer.classList.toggle('expanded');
            
            // Lazy load objectives if not already loaded
            if (objectivesContainer.classList.contains('expanded') && !objectivesContainer.dataset.loaded) {
                this.renderL3Objectives(control, objectivesContainer);
                objectivesContainer.dataset.loaded = 'true';
            }
        });

        return controlDiv;
    }

    renderL3Objectives(control, container) {
        container.innerHTML = '';

        // Render each objective
        control.objectives.forEach(objective => {
            const objEl = this.createL3ObjectiveElement(objective, control);
            container.appendChild(objEl);
            
            // Add comprehensive guidance for this objective if available
            if (typeof ComprehensiveGuidanceUI !== 'undefined') {
                ComprehensiveGuidanceUI.renderGuidance(objective.id, objEl);
            }
        });

        // Evidence examples (kept — not duplicated by ComprehensiveGuidanceUI)
        if (control.evidenceExamples && control.evidenceExamples.length > 0) {
            const evidenceDiv = document.createElement('div');
            evidenceDiv.className = 'l3-evidence';
            evidenceDiv.innerHTML = `
                <h4>Evidence Examples</h4>
                <ul>${control.evidenceExamples.map(e => `<li>${e}</li>`).join('')}</ul>
            `;
            container.appendChild(evidenceDiv);
        }
    }

    createL3ObjectiveElement(objective, control) {
        const objDiv = document.createElement('div');
        objDiv.className = 'objective-item l3-objective';
        objDiv.dataset.objectiveId = objective.id;

        // Get saved status from L3 assessment data (stored separately)
        const l3Data = JSON.parse(localStorage.getItem('nist-l3-assessment') || '{}');
        const status = l3Data[objective.id]?.status || 'not-assessed';

        // Build ITAR guidance section using details/summary
        const itarHtml = `
            <details class="impl-details l3-itar-details">
                <summary class="impl-summary impl-itar">
                    <span class="itar-badge">ITAR</span> Critical - US Persons Only
                </summary>
                <div class="itar-content">
                    <div class="itar-section">
                        <strong>Restrictions (Non-US Person Limitations):</strong>
                        <ul class="impl-notes-list">
                            <li>Enhanced security functions must be limited to US Persons only</li>
                            <li>Role assignments must consider ITAR access requirements</li>
                            <li>Contractors and subcontractors must also be US Persons for ITAR access</li>
                        </ul>
                    </div>
                    <div class="itar-section">
                        <strong>Implementation Guidance:</strong>
                        <p>Enhanced security controls must include ITAR eligibility as a prerequisite. Document ITAR access separately from general CUI access.</p>
                    </div>
                    <div class="itar-section">
                        <strong>ITAR-Specific Evidence:</strong>
                        <ul class="impl-notes-list">
                            <li>Enhanced control matrix showing ITAR restrictions</li>
                            <li>Access control policy with ITAR provisions</li>
                        </ul>
                    </div>
                </div>
            </details>
        `;

        // Build related objectives section using details/summary
        const relatedHtml = `
            <details class="impl-details l3-related-details">
                <summary class="impl-summary impl-related">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    Related Objectives
                </summary>
                <div class="related-content">
                    <div class="related-group">
                        <strong>Enhanced Security Controls:</strong>
                        <p style="margin: 4px 0 8px; color: var(--text-secondary); font-size: 0.8rem;">Controls related to APT protection and advanced threat mitigation</p>
                        <div class="related-controls" style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
                            <span style="color: var(--text-secondary); font-size: 0.75rem;">Related:</span>
                            <code class="related-control-link">${control.baseControl || control.id}</code>
                            <code class="related-control-link">3.14.6</code>
                            <code class="related-control-link">3.14.7</code>
                        </div>
                        <div class="shared-evidence" style="display: flex; gap: 6px; flex-wrap: wrap;">
                            <span style="color: var(--text-secondary); font-size: 0.75rem;">Shared Evidence:</span>
                            <span class="evidence-tag">Threat detection configs</span>
                            <span class="evidence-tag">IR procedures</span>
                            <span class="evidence-tag">ConMon logs</span>
                        </div>
                    </div>
                </div>
            </details>
        `;

        // Build assessor cheat sheet using details/summary
        const cheatSheetHtml = `
            <details class="impl-details l3-cheatsheet-details">
                <summary class="impl-summary impl-cheatsheet">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    Assessor Cheat Sheet
                </summary>
                <div class="cheat-sheet-content">
                    <div class="cheat-section">
                        <strong>💡 CCA Assessment Tips:</strong>
                        <ul class="impl-notes-list">
                            <li>CCAs will verify enhanced security controls are operational</li>
                            <li>CCAs will test APT detection and response capabilities</li>
                            <li>CCAs will review continuous monitoring implementation</li>
                        </ul>
                    </div>
                    <div class="cheat-section">
                        <strong>Sample Assessor Questions:</strong>
                        <ul class="impl-notes-list">
                            <li>How do you detect and respond to advanced persistent threats?</li>
                            <li>Where is your enhanced security architecture documented?</li>
                            <li>Show me your continuous monitoring dashboards and alert configurations.</li>
                        </ul>
                    </div>
                    <div class="cheat-section">
                        <strong>Evidence Requests:</strong>
                        <ul class="impl-notes-list">
                            <li>Enhanced security control configurations</li>
                            <li>APT detection and response procedures</li>
                            <li>Threat intelligence integration documentation</li>
                        </ul>
                    </div>
                </div>
            </details>
        `;

        // Cloud/vendor guidance is rendered by ComprehensiveGuidanceUI.renderGuidance() after element creation

        objDiv.innerHTML = `
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
                    <button class="impl-link" title="Document Implementation">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                </div>
            </div>
            <div class="objective-details">
                <div class="detail-row"><span class="detail-label">Base Control:</span> <span class="detail-value">${control.baseControl || 'N/A'}</span></div>
                <div class="detail-row"><span class="detail-label">CMMC Practice:</span> <span class="detail-value">${control.cmmcPracticeId || 'N/A'}</span></div>
                ${itarHtml}
                ${relatedHtml}
                ${cheatSheetHtml}
            </div>
        `;

        // Bind status button events
        objDiv.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.setL3ObjectiveStatus(objective.id, btn.dataset.status, objDiv);
            });
        });

        // Bind expand button
        objDiv.querySelector('.objective-expand').addEventListener('click', (e) => {
            e.stopPropagation();
            objDiv.classList.toggle('expanded');
        });

        return objDiv;
    }

    setL3ObjectiveStatus(objectiveId, status, element) {
        // Load existing L3 data
        const l3Data = JSON.parse(localStorage.getItem('nist-l3-assessment') || '{}');
        
        // Update status
        l3Data[objectiveId] = {
            status: status,
            updatedAt: new Date().toISOString()
        };
        
        // Save back to localStorage
        localStorage.setItem('nist-l3-assessment', JSON.stringify(l3Data));
        
        // Update UI
        element.querySelectorAll('.status-btn').forEach(btn => {
            btn.classList.toggle('met', btn.dataset.status === 'met' && status === 'met');
            btn.classList.toggle('partial', btn.dataset.status === 'partial' && status === 'partial');
            btn.classList.toggle('not-met', btn.dataset.status === 'not-met' && status === 'not-met');
        });

        // Update family stats
        this.updateL3FamilyStats();
        
        // Show toast
        this.showToast(`L3 objective ${objectiveId} marked as ${status}`, 'success');
    }

    calculateL3FamilyStats(family) {
        const l3Data = JSON.parse(localStorage.getItem('nist-l3-assessment') || '{}');
        let met = 0, partial = 0, notMet = 0;
        
        family.controls.forEach(control => {
            control.objectives.forEach(objective => {
                const status = l3Data[objective.id]?.status;
                if (status === 'met') met++;
                else if (status === 'partial') partial++;
                else if (status === 'not-met') notMet++;
            });
        });
        
        return { met, partial, notMet };
    }

    updateL3FamilyStats() {
        if (this.assessmentLevel !== '3' || typeof NIST_800_172A_FAMILIES === 'undefined') return;
        
        NIST_800_172A_FAMILIES.forEach(family => {
            const familyEl = document.querySelector(`[data-family-id="${family.id}"]`);
            if (familyEl) {
                const stats = this.calculateL3FamilyStats(family);
                const metCount = familyEl.querySelector('.stat-badge.met .count');
                const partialCount = familyEl.querySelector('.stat-badge.partial .count');
                const notMetCount = familyEl.querySelector('.stat-badge.not-met .count');
                if (metCount) metCount.textContent = stats.met;
                if (partialCount) partialCount.textContent = stats.partial;
                if (notMetCount) notMetCount.textContent = stats.notMet;
            }
        });
        
        // Also update progress bar for L3
        this.updateL3Progress();
    }

    updateL3Progress() {
        if (typeof NIST_800_172A_FAMILIES === 'undefined') return;
        
        const l3Data = JSON.parse(localStorage.getItem('nist-l3-assessment') || '{}');
        let total = 0, assessed = 0, met = 0, partial = 0, notMet = 0;
        
        NIST_800_172A_FAMILIES.forEach(family => {
            family.controls.forEach(control => {
                control.objectives.forEach(objective => {
                    total++;
                    const status = l3Data[objective.id]?.status;
                    if (status) {
                        assessed++;
                        if (status === 'met') met++;
                        else if (status === 'partial') partial++;
                        else if (status === 'not-met') notMet++;
                    }
                });
            });
        });

        // Update progress text
        const progressText = document.getElementById('progress-text');
        if (progressText) progressText.textContent = `${assessed} of ${total} assessed (L3)`;
        
        // Update compliance text
        const complianceRate = assessed > 0 ? Math.round((met / assessed) * 100) : 0;
        const complianceText = document.getElementById('compliance-text');
        if (complianceText) complianceText.textContent = `${complianceRate}% compliant`;

        // Update progress bars
        const metWidth = total > 0 ? (met / total) * 100 : 0;
        const partialWidth = total > 0 ? (partial / total) * 100 : 0;
        const notMetWidth = total > 0 ? (notMet / total) * 100 : 0;

        const progressMet = document.getElementById('progress-met');
        const progressPartial = document.getElementById('progress-partial');
        const progressNotMet = document.getElementById('progress-not-met');
        
        if (progressMet) progressMet.style.width = `${metWidth}%`;
        if (progressPartial) progressPartial.style.width = `${partialWidth}%`;
        if (progressNotMet) progressNotMet.style.width = `${notMetWidth}%`;
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

        // Restore expanded state from localStorage
        const dropdownState = this.getDropdownState();
        if (dropdownState.families && dropdownState.families[family.id]) {
            header.classList.add('expanded');
            controlsContainer.classList.add('expanded');
        }

        header.addEventListener('click', () => {
            header.classList.toggle('expanded');
            controlsContainer.classList.toggle('expanded');
            this.saveDropdownState('family', family.id, header.classList.contains('expanded'));
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
        const scoringSource = (this.assessmentRevision === 'r3' && typeof SPRS_SCORING_R3 !== 'undefined') ? SPRS_SCORING_R3 : (typeof SPRS_SCORING !== 'undefined' ? SPRS_SCORING : null);
        const isNeverPoam = scoringSource?.neverPoam?.includes(control.id);
        const cmmcId = control.cmmcPracticeId || '';

        // Point value badge styling
        const pointClass = pointValue >= 5 ? 'high' : pointValue >= 3 ? 'medium' : 'low';
        const poamWarning = isNeverPoam ? '<span class="poam-warning" title="Cannot be on POA&M per 32 CFR 170.21">⚠️ No POA&M</span>' : 
                           (pointValue > 1 && control.id !== '3.13.11' && control.id !== '03.13.11') ? '<span class="poam-caution" title="Point value > 1, cannot be on POA&M for Conditional status">⚡ Requires Implementation</span>' : '';

        // Rev 3 badges
        let rev3BadgeHtml = '';
        if (this.assessmentRevision === 'r3' && control.changeType) {
            const badgeClass = control.changeType;
            const badgeLabel = control.changeType === 'new' ? 'New in Rev 3' : 
                              control.changeType === 'enhanced' ? 'Enhanced' : 
                              'Renumbered';
            rev3BadgeHtml = `<span class="rev3-badge ${badgeClass}">${badgeLabel}</span>`;
            if (control.rev2Id) {
                rev3BadgeHtml += `<span class="rev3-badge renumbered" title="Was ${control.rev2Id} in Rev 2" style="opacity:0.7;">Rev 2: ${control.rev2Id}</span>`;
            }
        }

        // ODP section for Rev 3 enhanced controls
        // ODPs are tracked separately from assessment objectives (not assessable)
        let odpHtml = '';
        if (this.assessmentRevision === 'r3' && control.odps && control.odps.length > 0) {
            // Try DoD-defined values from Rev3Crosswalk.DOD_ODPS first (more specific), then REV3_ODPS
            const dodOdps = (typeof Rev3Crosswalk !== 'undefined' && Rev3Crosswalk.DOD_ODPS) ? Rev3Crosswalk.DOD_ODPS[control.id] : null;
            const r3Odps = (typeof REV3_ODPS !== 'undefined') ? REV3_ODPS[control.id] : null;
            const odpItems = control.odps.map((odp, i) => {
                let odpValue = '';
                // Prefer DoD-defined values (crosswalk) — these are the official DoD CUI ODP values
                if (dodOdps && dodOdps.odps && dodOdps.odps[i]) {
                    odpValue = dodOdps.odps[i].value || '';
                } else if (r3Odps && r3Odps.parameters && r3Odps.parameters[i]) {
                    odpValue = r3Odps.parameters[i].suggestedValue || '';
                }
                const valueDisplay = odpValue ? `<span style="color: #34d399;">${odpValue}</span>` : '<span style="color: var(--text-muted); font-style: italic;">Organization-defined</span>';
                return `<div class="odp-item"><span class="odp-label">ODP ${i + 1}:</span> ${odp} — ${valueDisplay}</div>`;
            }).join('');
            odpHtml = `
                <div class="odp-section">
                    <div class="odp-section-header" data-action="toggle-next-sibling">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                        Organization-Defined Parameters (${control.odps.length})
                    </div>
                    <div class="odp-list" style="display:none;">${odpItems}</div>
                </div>`;
        }

        controlDiv.innerHTML = `
            <div class="control-header" data-family-id="${familyId}">
                <div class="control-info">
                    <div class="control-id">
                        ${control.id} - ${control.name}
                        ${this.assessmentRevision !== 'r3' ? `<span class="sprs-badge ${pointClass}" title="SPRS Point Value">${pointValue} ${pointValue === 1 ? 'pt' : 'pts'}</span>` : ''}
                        ${rev3BadgeHtml}
                        ${poamWarning}
                    </div>
                    <div class="control-meta">${cmmcId}</div>
                    <div class="control-name">${control.description}</div>
                    ${odpHtml}
                </div>
                <svg class="control-chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div class="control-objectives"></div>
        `;

        const header = controlDiv.querySelector('.control-header');
        const objectivesContainer = controlDiv.querySelector('.control-objectives');

        // Restore expanded state from localStorage
        const dropdownState = this.getDropdownState();
        if (dropdownState.controls && dropdownState.controls[control.id]) {
            header.classList.add('expanded');
            objectivesContainer.classList.add('expanded');
        }

        header.addEventListener('click', () => {
            header.classList.toggle('expanded');
            objectivesContainer.classList.toggle('expanded');
            this.saveDropdownState('control', control.id, header.classList.contains('expanded'));
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
        const isL1 = this.assessmentLevel === '1';
        const showPoamLink = !isL1 && (status === 'not-met' || status === 'partial'); // No POA&M for L1
        const xrefId = typeof CTRL_XREF !== 'undefined' ? (CTRL_XREF[objective.id] || '') : '';

        // Rev2→Rev3 transition annotation
        let transitionHtml = '';
        if (typeof REV2_TO_REV3_MIGRATION !== 'undefined') {
            if (this.assessmentRevision !== 'r3') {
                // Rev2 view: annotate objectives whose control is withdrawn/consolidated in Rev3
                const migration = REV2_TO_REV3_MIGRATION[controlId];
                if (migration && migration.changeType === 'withdrawn') {
                    transitionHtml = `<span class="rev3-transition-badge withdrawn" title="This Rev 2 objective is withdrawn in Rev 3. ${migration.notes}">Withdrawn in Rev 3 → ${migration.rev3Id}</span>`;
                } else if (migration && migration.changeType === 'enhanced') {
                    transitionHtml = `<span class="rev3-transition-badge enhanced" title="Enhanced in Rev 3 with new ODPs. ${migration.notes}">Enhanced in Rev 3</span>`;
                }
            } else {
                // Rev3 view: annotate new controls and consolidated objectives
                const isNew = typeof REV3_NEW_CONTROLS !== 'undefined' && REV3_NEW_CONTROLS.some(c => c.id === controlId);
                if (isNew) {
                    transitionHtml = `<span class="rev3-transition-badge new-in-r3" title="This objective is new in Rev 3 — no Rev 2 equivalent">New in Rev 3</span>`;
                } else {
                    // Check if this Rev3 control consolidated multiple Rev2 controls
                    const consolidated = Object.entries(REV2_TO_REV3_MIGRATION).filter(([_, m]) => m.rev3Id === controlId && m.changeType === 'withdrawn');
                    if (consolidated.length > 0) {
                        const fromIds = consolidated.map(([id]) => id).join(', ');
                        transitionHtml = `<span class="rev3-transition-badge consolidated" title="Consolidated from Rev 2: ${fromIds}">Consolidated from ${consolidated.length} Rev 2 control${consolidated.length > 1 ? 's' : ''}</span>`;
                    }
                }
            }
        }

        // Build assessor cheat sheet section
        const cheatSheetHtml = this.renderAssessorCheatSheet(objective.id, controlId);

        // Build related objectives section
        const relatedHtml = this.renderRelatedObjectives(controlId);

        // Build ITAR guidance section
        const itarHtml = this.renderITARGuidance(controlId);

        // Build cross-framework mappings section
        const frameworkHtml = this.renderFrameworkMappings(controlId);

        // Build cloud guidance section with provider toggle and selection prompt
        const guidanceHtml = `
            <details class="impl-details cloud-details">
                <summary class="impl-summary impl-cloud">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
                    Cloud Implementation Guidance
                </summary>
                <div class="cloud-guidance-section">
                    <div class="cloud-provider-toggle">
                        <span class="cloud-select-label">Select Cloud Environment:</span>
                        <button class="cloud-btn" data-cloud="azure" title="Microsoft Azure / M365 GCC High">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M5.483 21.3H24L14.025 4.013l-3.038 8.347 5.836 6.938L5.483 21.3zM13.049 2.7L0 17.623h4.494L13.049 2.7z"/></svg>
                            <span>Azure</span>
                        </button>
                    <button class="cloud-btn" data-cloud="aws" title="AWS GovCloud">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.414l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z"/></svg>
                        <span>AWS</span>
                    </button>
                    <button class="cloud-btn" data-cloud="gcp" title="Google Cloud Platform">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.19 2.38a9.344 9.344 0 0 0-9.234 6.893c.053-.02-.055.013 0 0-3.875 2.551-3.922 8.11-.247 10.941l.006-.007-.007.03a6.717 6.717 0 0 0 4.077 1.356h5.173l.03.03h5.192c6.687.053 9.376-8.605 3.835-12.35a9.365 9.365 0 0 0-8.825-6.893zM8.073 19.28a4.405 4.405 0 0 1-2.14-.562l-.035-.02 3.834-3.835-.007.007a2.083 2.083 0 0 0 .496-1.317 2.126 2.126 0 0 0-2.122-2.122c-.49 0-.963.18-1.32.496l.007-.006-3.835 3.834a4.473 4.473 0 0 1 .517-5.857 4.476 4.476 0 0 1 6.37.041l4.388-4.388a9.049 9.049 0 0 0-5.19-1.896A9.344 9.344 0 0 0 3.14 9.115l-.007-.007a6.64 6.64 0 0 0-.096 6.63l.006-.006a6.655 6.655 0 0 0 5.03 3.548zm11.108-7.073l.007-.007a4.478 4.478 0 0 1-1.593 6.09 4.418 4.418 0 0 1-2.168.562h-3.304l4.078-4.078a2.126 2.126 0 0 0 2.083-3.402l3.834-3.834a6.72 6.72 0 0 1-.096 6.627l-2.841-1.958z"/></svg>
                        <span>GCP</span>
                    </button>
                </div>
                <div class="cloud-guidance-content" data-objective-id="${objective.id}">
                        <div class="cloud-select-prompt">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
                            Select a cloud environment above to view implementation guidance
                        </div>
                        <div class="cloud-guidance-panel" data-cloud="azure">
                            ${this.renderCloudGuidance('azure', objective.id)}
                        </div>
                        <div class="cloud-guidance-panel" data-cloud="aws">
                            ${this.renderCloudGuidance('aws', objective.id)}
                        </div>
                        <div class="cloud-guidance-panel" data-cloud="gcp">
                            ${this.renderCloudGuidance('gcp', objective.id)}
                        </div>
                    </div>
                </div>
            </details>
        `;

        // Build status buttons - L1 has only Met/Not Met, L2 has Met/Partial/Not Met
        const statusButtonsHtml = isL1 
            ? `<button class="status-btn ${status === 'met' ? 'met' : ''}" data-status="met">Met</button>
               <button class="status-btn ${status === 'not-met' ? 'not-met' : ''}" data-status="not-met">Not Met</button>`
            : `<button class="status-btn ${status === 'met' ? 'met' : ''}" data-status="met">Met</button>
               <button class="status-btn ${status === 'partial' ? 'partial' : ''}" data-status="partial">Partial</button>
               <button class="status-btn ${status === 'not-met' ? 'not-met' : ''}" data-status="not-met">Not Met</button>`;

        objectiveDiv.innerHTML = `
            <div class="objective-main">
                <button class="objective-expand" title="Show details">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <div class="objective-info">
                    <div class="objective-id">
                        ${objective.id}
                        <span class="impl-status-badge" data-objective-id="${objective.id}" style="display: none;"></span>
                        <span class="evidence-count-badge" data-objective-id="${objective.id}" style="display: none;"></span>
                        <span class="mn-badge-slot" data-objective-id="${objective.id}">${typeof MeetingNotesIntegration !== 'undefined' ? MeetingNotesIntegration.renderQuoteBadge(objective.id) : ''}</span>
                        ${typeof InheritedControls !== 'undefined' ? InheritedControls.renderObjectiveBadge(controlId) : ''}
                        ${transitionHtml}
                    </div>
                    <div class="objective-text">${objective.text}</div>
                </div>
                <div class="objective-actions">
                    ${statusButtonsHtml}
                    <button class="open-impl-details-btn" data-objective-id="${objective.id}" title="Implementation Details">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="link-evidence-btn" data-objective-id="${objective.id}" title="Link Evidence">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    </button>
                    <button class="ai-assess-btn" data-objective-id="${objective.id}" data-context="objective" title="AI Assessment Guidance">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/><circle cx="12" cy="15" r="2"/></svg>
                    </button>
                </div>
            </div>
            <div class="objective-details">
                <div class="detail-row"><span class="detail-label">External Ref:</span> <span class="detail-value">${xrefId || 'N/A'}</span></div>
                ${typeof InheritedControls !== 'undefined' ? InheritedControls.renderObjectiveInheritanceDetail(controlId) : ''}
                ${frameworkHtml}
                ${itarHtml}
                ${relatedHtml}
                ${cheatSheetHtml}
                ${guidanceHtml}
            </div>
        `;

        // Bind status buttons
        objectiveDiv.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.setObjectiveStatus(objective.id, btn.dataset.status, objectiveDiv, controlId, familyId);
            });
        });

        // Bind expand button
        const expandBtn = objectiveDiv.querySelector('.objective-expand');
        if (expandBtn) {
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                objectiveDiv.classList.toggle('expanded');
            });
        }

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

        // Initialize assessment enhancement badges
        if (typeof AssessmentEnhancements !== 'undefined') {
            AssessmentEnhancements.updateImplementationBadge(objective.id);
            AssessmentEnhancements.updateEvidenceBadge(objective.id);
        }

        // Add comprehensive guidance for this objective if available
        if (typeof ComprehensiveGuidanceUI !== 'undefined') {
            const detailsSection = objectiveDiv.querySelector('.objective-details');
            if (detailsSection) {
                ComprehensiveGuidanceUI.renderGuidance(objective.id, detailsSection);
            }
        }

        // Bind cloud provider toggle buttons
        objectiveDiv.querySelectorAll('.cloud-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const cloud = btn.dataset.cloud;
                const section = objectiveDiv.querySelector('.cloud-guidance-section');
                
                // Hide the prompt when a cloud is selected
                const prompt = section.querySelector('.cloud-select-prompt');
                if (prompt) prompt.style.display = 'none';
                
                // Update active button
                section.querySelectorAll('.cloud-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active panel
                section.querySelectorAll('.cloud-guidance-panel').forEach(p => p.classList.remove('active'));
                section.querySelector(`.cloud-guidance-panel[data-cloud="${cloud}"]`).classList.add('active');
            });
        });

        return objectiveDiv;
    }

    renderCloudGuidance(cloud, objectiveId) {
        let guidance, serviceName, serviceLabel, consoleLinks, psConnectScript;
        
        if (cloud === 'azure') {
            guidance = typeof getGCCHighGuidance === 'function' ? getGCCHighGuidance(objectiveId) : null;
            serviceName = guidance?.azureService || 'N/A';
            serviceLabel = 'Azure Gov Service';
            consoleLinks = [
                { name: 'Azure Gov Portal', url: 'https://portal.azure.us', icon: 'cloud' },
                { name: 'Entra ID (Azure AD)', url: 'https://entra.microsoft.us', icon: 'users' },
                { name: 'Intune', url: 'https://intune.microsoft.us', icon: 'smartphone' },
                { name: 'Defender Portal', url: 'https://security.microsoft.us', icon: 'shield' },
                { name: 'Purview', url: 'https://compliance.microsoft.us', icon: 'lock' }
            ];
            psConnectScript = `# Connect to Azure Government & M365 GCC High
# Prerequisites: Install-Module Az, Microsoft.Graph, ExchangeOnlineManagement

# Azure Government (Az Module)
Connect-AzAccount -Environment AzureUSGovernment

# Microsoft Graph (GCC High)
Connect-MgGraph -Environment USGov -Scopes "User.Read.All","Directory.Read.All"

# Exchange Online (GCC High)
Connect-ExchangeOnline -ExchangeEnvironmentName O365USGovGCCHigh

# Security & Compliance Center
Connect-IPPSSession -ConnectionUri https://ps.compliance.protection.office365.us/powershell-liveid/

# SharePoint Online (replace TENANT with your tenant name)
Connect-SPOService -Url https://TENANT-admin.sharepoint.us

# Teams (GCC High)
Connect-MicrosoftTeams -TeamsEnvironmentName TeamsGCCH`;
        } else if (cloud === 'aws') {
            guidance = typeof getAWSGovCloudGuidance === 'function' ? getAWSGovCloudGuidance(objectiveId) : null;
            serviceName = guidance?.awsService || 'N/A';
            serviceLabel = 'AWS GovCloud Service';
            consoleLinks = [
                { name: 'AWS GovCloud Console', url: 'https://console.amazonaws-us-gov.com', icon: 'cloud' },
                { name: 'IAM', url: 'https://console.amazonaws-us-gov.com/iam', icon: 'users' },
                { name: 'CloudTrail', url: 'https://console.amazonaws-us-gov.com/cloudtrail', icon: 'activity' },
                { name: 'Security Hub', url: 'https://console.amazonaws-us-gov.com/securityhub', icon: 'shield' },
                { name: 'GuardDuty', url: 'https://console.amazonaws-us-gov.com/guardduty', icon: 'eye' }
            ];
            psConnectScript = `# Configure AWS CLI for GovCloud
# Prerequisites: Install AWS CLI v2

# Set GovCloud region (us-gov-west-1 or us-gov-east-1)
aws configure set region us-gov-west-1

# Verify GovCloud connection
aws sts get-caller-identity

# Common GovCloud CLI Commands
aws iam list-users --output table
aws cloudtrail describe-trails
aws securityhub get-findings --filters '{"RecordState":[{"Value":"ACTIVE","Comparison":"EQUALS"}]}'
aws guardduty list-detectors

# Export credential report
aws iam generate-credential-report
aws iam get-credential-report --output text --query Content | base64 -d > credential_report.csv`;
        } else if (cloud === 'gcp') {
            guidance = typeof getGCPGuidance === 'function' ? getGCPGuidance(objectiveId) : null;
            serviceName = guidance?.gcpService || 'N/A';
            serviceLabel = 'GCP Service';
            consoleLinks = [
                { name: 'GCP Console', url: 'https://console.cloud.google.com', icon: 'cloud' },
                { name: 'Cloud Identity', url: 'https://admin.google.com', icon: 'users' },
                { name: 'Security Command Center', url: 'https://console.cloud.google.com/security/command-center', icon: 'shield' },
                { name: 'IAM & Admin', url: 'https://console.cloud.google.com/iam-admin', icon: 'key' },
                { name: 'Logging', url: 'https://console.cloud.google.com/logs', icon: 'activity' }
            ];
            psConnectScript = `# Configure gcloud CLI for GCP
# Prerequisites: Install Google Cloud SDK

# Authenticate with GCP
gcloud auth login
gcloud auth application-default login

# Set project (replace PROJECT_ID)
gcloud config set project PROJECT_ID

# Common GCP CLI Commands
gcloud iam service-accounts list
gcloud projects get-iam-policy PROJECT_ID
gcloud logging read "logName:cloudaudit.googleapis.com" --limit=50
gcloud asset search-all-iam-policies --scope=projects/PROJECT_ID

# For Assured Workloads (FedRAMP/IL4)
gcloud assured workloads list --location=us-central1
gcloud assured workloads describe WORKLOAD_NAME --location=us-central1`;
        }

        if (!guidance) {
            return `<div class="guidance-unavailable">Guidance not available for this cloud provider.</div>`;
        }

        // Build console quick links
        const consoleLinksHtml = consoleLinks ? `
            <div class="cloud-console-links">
                <span class="console-links-label">Quick Access:</span>
                <div class="console-links-row">
                    ${consoleLinks.map(link => `
                        <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="console-link-btn" title="Open ${link.name}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            ${link.name}
                        </a>
                    `).join('')}
                </div>
            </div>
        ` : '';

        // Build PowerShell/CLI connection script
        const psScriptHtml = psConnectScript ? `
            <details class="ps-connect-section">
                <summary class="ps-connect-summary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                    <span>${cloud === 'azure' ? 'PowerShell Connection Scripts' : 'CLI Connection Commands'}</span>
                    <button class="ps-copy-all-btn" data-action="copy-closest-pre" data-copy-selector=".ps-connect-section pre" data-copy-label="Copy All">Copy All</button>
                </summary>
                <pre class="ps-connect-code">${psConnectScript}</pre>
            </details>
        ` : '';

        // Build CLI commands HTML if available
        let cliHtml = '';
        if (guidance.cliCommands && guidance.cliCommands.length > 0) {
            const cmdList = guidance.cliCommands.map(cmd => `
                <div class="cli-command">
                    <code>${cmd}</code>
                    <button class="cli-copy-btn" title="Copy command" data-action="copy-sibling-code">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </button>
                </div>
            `).join('');
            cliHtml = `
                <div class="guidance-item cli-section">
                    <span class="guidance-label">Verification Commands:</span>
                    <div class="cli-commands">${cmdList}</div>
                </div>
            `;
        }

        // Build automation scripts HTML if available (Azure/GCC High only)
        let scriptsHtml = '';
        if (cloud === 'azure' && guidance.automationScripts && guidance.automationScripts.length > 0) {
            const scriptsList = guidance.automationScripts.map(script => `
                <div class="automation-script-item">
                    <div class="script-header">
                        <span class="script-name">${script.name}</span>
                        <button class="script-copy-btn" title="Copy script" data-action="copy-closest-pre" data-copy-selector=".automation-script-item pre">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </button>
                    </div>
                    <div class="script-description">${script.description}</div>
                    <details class="script-details">
                        <summary>View Script</summary>
                        <pre class="script-code">${script.script.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
                    </details>
                </div>
            `).join('');
            scriptsHtml = `
                <div class="guidance-item scripts-section">
                    <span class="guidance-label">Automation Scripts:</span>
                    <div class="automation-scripts">${scriptsList}</div>
                </div>
            `;
        }

        // Get implementation notes
        let implNotesHtml = '';
        if (typeof getImplNotes === 'function') {
            const implNotes = getImplNotes(objectiveId, cloud);
            if (implNotes) {
                const stepsList = implNotes.steps ? implNotes.steps.map(s => `<li>${s}</li>`).join('') : '';
                const humanList = implNotes.humanInTheLoop ? implNotes.humanInTheLoop.map(h => `<li>${h}</li>`).join('') : '';
                const policyList = implNotes.policyEvidence ? implNotes.policyEvidence.map(p => `<li>${p}</li>`).join('') : '';
                const manualList = implNotes.manualEvidence ? implNotes.manualEvidence.map(m => `<li>${m}</li>`).join('') : '';
                
                implNotesHtml = `
                    <div class="impl-notes-section">
                        <div class="impl-notes-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                            <span>Implementation Guide</span>
                        </div>
                        
                        <details class="impl-details" open>
                            <summary class="impl-summary">Technical Implementation</summary>
                            <ol class="impl-notes-steps">${stepsList}</ol>
                            ${implNotes.quickWin ? `<div class="impl-quick-win"><strong>Quick Win:</strong> ${implNotes.quickWin}</div>` : ''}
                        </details>
                        
                        ${humanList ? `
                        <details class="impl-details">
                            <summary class="impl-summary impl-human">Human-in-the-Loop</summary>
                            <ul class="impl-notes-list">${humanList}</ul>
                        </details>` : ''}
                        
                        ${policyList ? `
                        <details class="impl-details">
                            <summary class="impl-summary impl-policy">Policy/Procedural Evidence</summary>
                            <ul class="impl-notes-list">${policyList}</ul>
                        </details>` : ''}
                        
                        ${manualList ? `
                        <details class="impl-details">
                            <summary class="impl-summary impl-manual">Manual Evidence Collection</summary>
                            <ul class="impl-notes-list">${manualList}</ul>
                        </details>` : ''}
                        
                        ${implNotes.evidenceMethodology ? `
                        <details class="impl-details">
                            <summary class="impl-summary impl-methodology">Evidence Collection Methodology</summary>
                            <p class="impl-methodology-text">${implNotes.evidenceMethodology}</p>
                        </details>` : ''}
                        
                        ${implNotes.evidenceArtifact ? `<div class="impl-evidence-artifact"><strong>Machine-Readable Artifact:</strong> <code>${implNotes.evidenceArtifact}</code></div>` : ''}
                    </div>
                `;
            }
        }

        return `
            ${consoleLinksHtml}
            ${psScriptHtml}
            <div class="guidance-item">
                <span class="guidance-label">Automation:</span>
                <span class="guidance-value">${guidance.automation}</span>
            </div>
            <div class="guidance-item">
                <span class="guidance-label">${serviceLabel}:</span>
                <span class="guidance-value">${serviceName}</span>
            </div>
            <div class="guidance-item">
                <span class="guidance-label">Human Intervention:</span>
                <span class="guidance-value">${guidance.humanIntervention}</span>
            </div>
            ${guidance.smallOrgGuidance ? `
            <div class="guidance-item small-org-guidance">
                <span class="guidance-label">Small Remote Org Guidance:</span>
                <span class="guidance-value">${guidance.smallOrgGuidance}</span>
            </div>` : ''}
            ${cliHtml}
            ${scriptsHtml}
            ${implNotesHtml}
            ${guidance.docLink ? `<a href="${guidance.docLink}" target="_blank" rel="noopener noreferrer" class="guidance-doc-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                View Documentation
            </a>` : ''}
            ${guidance.cuiTrainingTemplate ? `<a href="${guidance.cuiTrainingTemplate}" target="_blank" rel="noopener noreferrer" class="guidance-doc-link cui-training-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                DCSA CUI Training Template (PDF)
            </a>` : ''}
        `;
    }

    renderAssessorCheatSheet(objectiveId, controlId) {
        const ccaData = typeof getCCAQuestions === 'function' ? getCCAQuestions(objectiveId) : null;
        const fedrampData = typeof getFedRAMPServices === 'function' ? getFedRAMPServices(controlId) : null;
        
        // Get family ID from control ID (e.g., "3.1.1" -> "AC", "03.01.01" -> "AC")
        const familyMap = {
            '3.1': 'AC', '3.2': 'AT', '3.3': 'AU', '3.4': 'CM', '3.5': 'IA', '3.6': 'IR', '3.7': 'MA', '3.8': 'MP', '3.9': 'PS', '3.10': 'PE', '3.11': 'RA', '3.12': 'CA', '3.13': 'SC', '3.14': 'SI',
            '03.01': 'AC', '03.02': 'AT', '03.03': 'AU', '03.04': 'CM', '03.05': 'IA', '03.06': 'IR', '03.07': 'MA', '03.08': 'MP', '03.09': 'PS', '03.10': 'PE', '03.11': 'RA', '03.12': 'CA', '03.13': 'SC', '03.14': 'SI', '03.15': 'SR', '03.16': 'PL'
        };
        const familyPrefix = controlId.split('.').slice(0, 2).join('.');
        const familyId = familyMap[familyPrefix];
        const pitfallsData = typeof CCA_PITFALLS !== 'undefined' && familyId ? CCA_PITFALLS.byFamily[familyId] : null;
        
        // Get interview questions from new comprehensive data
        const interviewData = typeof CCA_INTERVIEW_QUESTIONS !== 'undefined' ? 
            CCA_INTERVIEW_QUESTIONS[`${familyId}.L2-${controlId}`] : null;

        if (!ccaData && !fedrampData && !pitfallsData && !interviewData) {
            return '';
        }

        let questionsHtml = '';
        
        // Use new interview questions if available (more comprehensive)
        if (interviewData && interviewData.interviewQuestions) {
            const categorizedQuestions = {};
            interviewData.interviewQuestions.forEach(q => {
                if (!categorizedQuestions[q.category]) categorizedQuestions[q.category] = [];
                categorizedQuestions[q.category].push(q);
            });
            
            let interviewHtml = '';
            for (const [category, questions] of Object.entries(categorizedQuestions)) {
                const qList = questions.map(q => `
                    <li class="interview-question">
                        <span class="question-text">${q.question}</span>
                        <span class="question-followup">↳ ${q.followup}</span>
                    </li>
                `).join('');
                interviewHtml += `
                    <details class="interview-category">
                        <summary class="interview-category-header">${category}</summary>
                        <ul class="interview-questions-list">${qList}</ul>
                    </details>
                `;
            }
            
            // Add topics and screenshare items if available
            let topicsHtml = '';
            if (interviewData.topics) {
                const topicItems = interviewData.topics.split('\n').filter(t => t.trim()).map(t => `<li>${t.trim()}</li>`).join('');
                if (topicItems) {
                    topicsHtml = `
                        <div class="cheat-sheet-subsection">
                            <div class="cheat-sheet-subtitle">📋 Key Discussion Topics</div>
                            <ul class="cheat-sheet-list">${topicItems}</ul>
                        </div>
                    `;
                }
            }
            
            let screenshareHtml = '';
            if (interviewData.screenshareItems) {
                const ssItems = interviewData.screenshareItems.split('\n').filter(s => s.trim()).map(s => `<li>${s.trim()}</li>`).join('');
                if (ssItems) {
                    screenshareHtml = `
                        <div class="cheat-sheet-subsection screenshare-section">
                            <div class="cheat-sheet-subtitle">🖥️ Screenshare Requests</div>
                            <ul class="cheat-sheet-list">${ssItems}</ul>
                        </div>
                    `;
                }
            }
            
            questionsHtml = `
                <div class="cheat-sheet-subsection interview-section">
                    <div class="cheat-sheet-subtitle">🎤 CCA Interview Questions</div>
                    <div class="interview-responsible">Responsible: <strong>${interviewData.responsible || 'TBD'}</strong></div>
                    ${interviewHtml}
                </div>
                ${topicsHtml}
                ${screenshareHtml}
            `;
        } else if (ccaData && ccaData.questions) {
            // Fallback to original data if new data not available
            const questionsList = ccaData.questions.map(q => `<li>${q}</li>`).join('');
            const evidenceReqs = ccaData.evidenceRequests || ccaData.evidence || [];
            const evidenceList = Array.isArray(evidenceReqs) ? evidenceReqs.map(e => `<li>${e}</li>`).join('') : '';
            questionsHtml = `
                <div class="cheat-sheet-subsection">
                    <div class="cheat-sheet-subtitle">Sample Assessor Questions</div>
                    <ul class="cheat-sheet-list">${questionsList}</ul>
                </div>
                <div class="cheat-sheet-subsection">
                    <div class="cheat-sheet-subtitle">Evidence Requests</div>
                    <ul class="cheat-sheet-list">${evidenceList}</ul>
                </div>
            `;
        }

        // Find relevant pitfall for this control
        let pitfallHtml = '';
        if (pitfallsData) {
            const relevantGap = pitfallsData.commonGaps.find(g => g.impact.includes(controlId));
            if (relevantGap) {
                pitfallHtml = `
                    <div class="cheat-sheet-subsection pitfall-warning">
                        <div class="cheat-sheet-subtitle">⚠️ Common Assessment Pitfall</div>
                        <div class="pitfall-issue"><strong>Issue:</strong> ${relevantGap.issue}</div>
                        <div class="pitfall-impact"><strong>Impact:</strong> ${relevantGap.impact}</div>
                        <div class="pitfall-fix"><strong>Fix:</strong> ${relevantGap.fix}</div>
                    </div>
                `;
            }
            // Add CCA tips if this is first objective of control
            if (objectiveId.endsWith('[a]') && pitfallsData.ccaTips && pitfallsData.ccaTips.length > 0) {
                const tipsList = pitfallsData.ccaTips.slice(0, 3).map(t => `<li>${t}</li>`).join('');
                pitfallHtml += `
                    <div class="cheat-sheet-subsection cca-tips">
                        <div class="cheat-sheet-subtitle">💡 CCA Assessment Tips</div>
                        <ul class="cheat-sheet-list">${tipsList}</ul>
                    </div>
                `;
            }
        }

        let servicesHtml = '';
        if (fedrampData && fedrampData.services && fedrampData.services.length > 0) {
            const serviceItems = fedrampData.services.map(s => `
                <li class="fedramp-service-item">
                    <a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}</a>
                    <span class="fedramp-level ${s.level.toLowerCase()}">${s.level}</span>
                    <span class="fedramp-category">${s.category}</span>
                </li>
            `).join('');
            servicesHtml = `
                <div class="cheat-sheet-subsection">
                    <div class="cheat-sheet-subtitle">FedRAMP Authorized Services</div>
                    <ul class="cheat-sheet-services">${serviceItems}</ul>
                </div>
            `;
        }

        return `
            <details class="impl-details cheatsheet-details">
                <summary class="impl-summary impl-cheatsheet">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    Assessor Cheat Sheet
                </summary>
                <div class="cheat-sheet-content">
                    ${pitfallHtml}
                    ${questionsHtml}
                    ${servicesHtml}
                </div>
            </details>
        `;
    }

    renderRelatedObjectives(controlId) {
        const relatedData = typeof getRelatedObjectives === 'function' ? getRelatedObjectives(controlId) : null;

        if (!relatedData || relatedData.length === 0) {
            return '';
        }

        const groupsHtml = relatedData.map(group => {
            const controlLinks = group.relatedControls.map(c => 
                `<a href="#" class="related-control-link" data-control="${c}">${c}</a>`
            ).join('');
            
            const evidenceItems = group.evidenceTypes.map(e => `<li>${e}</li>`).join('');

            return `
                <div class="related-group">
                    <div class="related-group-header">
                        <span class="related-group-label">${group.label}</span>
                    </div>
                    <div class="related-group-desc">${group.description}</div>
                    <div class="related-controls">
                        <span class="related-controls-label">Related Controls:</span>
                        ${controlLinks}
                    </div>
                    <div class="related-evidence">
                        <span class="related-evidence-label">Shared Evidence Types:</span>
                        <ul class="related-evidence-list">${evidenceItems}</ul>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <details class="impl-details related-details">
                <summary class="impl-summary impl-related">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    Related Objectives
                </summary>
                <div class="related-content">
                    ${groupsHtml}
                </div>
            </details>
        `;
    }

    renderITARGuidance(controlId) {
        const itarData = typeof getITARGuidance === 'function' ? getITARGuidance(controlId) : null;

        if (!itarData || !itarData.hasITARImplications) {
            return '';
        }

        const severityClass = itarData.severity || 'medium';
        const severityLabel = {
            critical: 'Critical - US Persons Only',
            high: 'High - Significant Restrictions',
            medium: 'Medium - ITAR Considerations'
        }[severityClass] || 'ITAR Applicable';

        const restrictionsList = itarData.restrictions.map(r => `<li>${r}</li>`).join('');
        const evidenceList = itarData.evidence ? itarData.evidence.map(e => `<li>${e}</li>`).join('') : '';

        return `
            <details class="impl-details itar-details">
                <summary class="impl-summary impl-itar">
                    <span class="itar-badge ${severityClass}">ITAR</span>
                    <span class="itar-severity-label">${severityLabel}</span>
                </summary>
                <div class="itar-content">
                    <div class="itar-subsection">
                        <div class="itar-subtitle">Restrictions (Non-US Person Limitations)</div>
                        <ul class="itar-list">${restrictionsList}</ul>
                    </div>
                    <div class="itar-subsection">
                        <div class="itar-subtitle">Implementation Guidance</div>
                        <p class="itar-guidance-text">${itarData.implementation}</p>
                    </div>
                    ${evidenceList ? `
                    <div class="itar-subsection">
                        <div class="itar-subtitle">ITAR-Specific Evidence</div>
                        <ul class="itar-list">${evidenceList}</ul>
                    </div>
                    ` : ''}
                </div>
            </details>
        `;
    }

    renderFrameworkMappings(controlId) {
        const mapping = typeof getFrameworkMappings === 'function' ? getFrameworkMappings(controlId) : null;
        
        if (!mapping) return '';

        // Build NIST 800-53 links (myctrl.tools)
        const nist53Html = mapping.nist80053 && mapping.nist80053.length > 0
            ? mapping.nist80053.map(ctrl => {
                // Convert AC-6(1) to ac-6-1 for myctrl.tools URL format
                const urlId = ctrl.toLowerCase().replace(/\((\d+)\)/g, '-$1');
                return `<a href="https://www.myctrl.tools/frameworks/nist-800-53-r5/${urlId}" target="_blank" rel="noopener" class="framework-link nist53">${ctrl}</a>`;
            }).join('')
            : '<span class="framework-na">N/A</span>';

        // Dynamically derive KSIs from 800-53 controls using authoritative mapping
        const derivedKSIs = typeof getKSIsForControl === 'function' && mapping.nist80053 
            ? getKSIsForControl(mapping.nist80053) 
            : [];
        
        // Build FedRAMP 20x KSI badges (clickable links to myctrl.tools with descriptions and level badges)
        const fedramp20xHtml = derivedKSIs.length > 0
            ? derivedKSIs.map(ksi => {
                // Convert KSI-IAM-04 to ksi-iam-4 (strip leading zeros)
                const urlId = ksi.toLowerCase().replace(/-0+(\d)/g, '-$1');
                // Get KSI details for tooltip and level
                const ksiInfo = typeof FEDRAMP_20X_KSI !== 'undefined' ? FEDRAMP_20X_KSI.indicators[ksi] : null;
                const tooltip = ksiInfo ? `${ksiInfo.title}: ${ksiInfo.description}` : ksi;
                let levelBadges = '';
                if (ksiInfo) {
                    if (ksiInfo.low) levelBadges += '<span class="ksi-level-badge ksi-low">Low</span>';
                    if (ksiInfo.moderate) levelBadges += '<span class="ksi-level-badge ksi-mod">Mod</span>';
                    if (!ksiInfo.low && !ksiInfo.moderate) levelBadges += '<span class="ksi-level-badge ksi-mod">Mod</span>';
                }
                return `<a href="https://www.myctrl.tools/frameworks/fedramp-20x-ksi/${urlId}" target="_blank" rel="noopener" class="framework-link fedramp20x" title="${tooltip}">${ksi}${levelBadges}</a>`;
            }).join('')
            : '<span class="framework-na">N/A</span>';

        // Build CMMC practice badge with level and classification
        const level = mapping.cmmc?.level;
        const classification = mapping.classification;
        const levelClass = level === 1 ? 'cmmc-l1' : 'cmmc-l2';
        const classificationClass = classification === 'Basic' ? 'cmmc-basic' : 'cmmc-derived';
        
        const cmmcHtml = mapping.cmmc 
            ? `<span class="cmmc-level ${levelClass}">L${level}</span><span class="cmmc-practice">${mapping.cmmc.practice}</span><span class="cmmc-classification ${classificationClass}">${classification}</span>`
            : '';

        return `
            <div class="framework-mappings-section">
                <div class="framework-row">
                    <span class="framework-label">NIST 800-53 Rev 5:</span>
                    <div class="framework-links">${nist53Html}</div>
                </div>
                <div class="framework-row">
                    <span class="framework-label">FedRAMP 20x KSI:</span>
                    <div class="framework-links">${fedramp20xHtml}</div>
                </div>
                <div class="framework-row">
                    <span class="framework-label">CMMC 2.0:</span>
                    <div class="framework-links">${cmmcHtml}</div>
                </div>
            </div>
        `;
    }

    // Implementation Notes Modal Functions
    openImplementationModal(objective, controlId) {
        const modal = document.getElementById('implementation-modal');
        const existingData = this.implementationData[objective.id] || {};

        // Get control info
        let control = null;
        this.getActiveControlFamilies().forEach(family => {
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

        // Populate integration evidence panel
        const intPanel = document.getElementById('impl-integration-panel');
        const intEvidence = document.getElementById('impl-integration-evidence');
        const pullBtn = document.getElementById('impl-pull-evidence-btn');
        if (intPanel && intEvidence) {
            const ih = typeof IntegrationsHub !== 'undefined' ? IntegrationsHub : null;
            const evidence = ih?.getControlEvidence ? ih.getControlEvidence(controlId) : [];
            if (evidence.length > 0) {
                intPanel.style.display = '';
                intEvidence.innerHTML = evidence.map(ev => `
                    <div class="impl-int-item">
                        <div class="impl-int-item-head">
                            <span class="impl-int-source">${ev.source || 'Integration'}</span>
                            <span class="impl-int-type">${ev.type || 'Data'}</span>
                            ${ev.syncDate ? `<span class="impl-int-date">${new Date(ev.syncDate).toLocaleDateString()}</span>` : ''}
                        </div>
                        <div class="impl-int-summary">${ev.summary || JSON.stringify(ev.data || {}).substring(0, 200)}</div>
                    </div>`).join('');
                if (pullBtn) {
                    pullBtn.onclick = () => {
                        const freshEvidence = ih?.getControlEvidence ? ih.getControlEvidence(controlId) : [];
                        if (freshEvidence.length > 0) {
                            const summaries = freshEvidence.map(e => `[${e.source}] ${e.summary || ''}`).join('\n');
                            const notesEl = document.getElementById('impl-notes');
                            if (notesEl) {
                                const existing = notesEl.value.trim();
                                notesEl.value = existing ? existing + '\n\n--- Integration Evidence (pulled ' + new Date().toLocaleString() + ') ---\n' + summaries : '--- Integration Evidence (pulled ' + new Date().toLocaleString() + ') ---\n' + summaries;
                            }
                        }
                    };
                }
            } else {
                intPanel.style.display = 'none';
                intEvidence.innerHTML = '';
            }
        }

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
        const prefix = this.getStoragePrefix();
        localStorage.setItem(prefix + 'assessment-data', JSON.stringify(this.assessmentData));
    }

    findObjectiveById(objectiveId) {
        const families = this.getActiveControlFamilies();
        for (const family of families) {
            for (const control of family.controls) {
                const objective = control.objectives.find(o => o.id === objectiveId);
                if (objective) return objective;
            }
        }
        return null;
    }

    updateFamilyStats(familyId) {
        const families = this.getActiveControlFamilies();
        const family = families.find(f => f.id === familyId);
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

    calculateFamilySPRS(family) {
        let lost = 0;
        let maxPossible = 0;
        const scoringSrc = (this.assessmentRevision === 'r3' && typeof SPRS_SCORING_R3 !== 'undefined') ? SPRS_SCORING_R3 : (typeof SPRS_SCORING !== 'undefined' ? SPRS_SCORING : null);
        
        family.controls.forEach(control => {
            // Get SPRS point value for this control (default to 1 if not specified)
            const pointValue = scoringSrc && scoringSrc.pointValues 
                ? (scoringSrc.pointValues[control.id] || 1) 
                : 1;
            
            maxPossible += pointValue;
            
            // Check if control is NOT fully met (all objectives must be met)
            const allObjectivesMet = control.objectives.every(objective => {
                return this.assessmentData[objective.id]?.status === 'met';
            });
            
            if (!allObjectivesMet && control.objectives.length > 0) {
                lost += pointValue;
            }
        });
        
        return { lost, maxPossible };
    }

    calculateTotalSPRS() {
        // SPRS starts at 110 and subtracts points for non-met controls
        let score = 110;
        const families = this.getActiveControlFamilies();
        const scoringSource = (this.assessmentRevision === 'r3' && typeof SPRS_SCORING_R3 !== 'undefined') ? SPRS_SCORING_R3 : (typeof SPRS_SCORING !== 'undefined' ? SPRS_SCORING : null);
        
        families.forEach(family => {
            family.controls.forEach(control => {
                const pointValue = scoringSource && scoringSource.pointValues 
                    ? (scoringSource.pointValues[control.id] || 1) 
                    : 1;
                
                const allObjectivesMet = control.objectives.every(objective => {
                    return this.assessmentData[objective.id]?.status === 'met';
                });
                
                if (!allObjectivesMet && control.objectives.length > 0) {
                    score -= pointValue;
                }
            });
        });
        
        return score;
    }

    calculateControlsMet() {
        // Count how many controls have ALL objectives met
        let controlsMet = 0;
        const families = this.getActiveControlFamilies();
        
        families.forEach(family => {
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

    calculateL1ControlsMet() {
        // L1 controls per CMMC 2.0 / FAR 52.240-93 (formerly 52.204-21) (17 total)
        const L1_CONTROL_IDS = [
            '3.1.1', '3.1.2', '3.1.20', '3.1.22',  // AC (4)
            '3.3.1', '3.3.2',                       // AU (2)
            '3.4.1', '3.4.2',                       // CM (2)
            '3.5.1', '3.5.2',                       // IA (2)
            '3.8.3',                                // MP (1)
            '3.10.1',                               // PE (1)
            '3.12.1', '3.12.4',                     // SC (2)
            '3.14.1', '3.14.2', '3.14.4'            // SI (3)
        ];
        
        let l1ControlsMet = 0;
        
        this.getActiveControlFamilies().forEach(family => {
            family.controls.forEach(control => {
                if (L1_CONTROL_IDS.includes(control.id)) {
                    const allObjectivesMet = control.objectives.every(objective => {
                        return this.assessmentData[objective.id]?.status === 'met';
                    });
                    if (allObjectivesMet && control.objectives.length > 0) {
                        l1ControlsMet++;
                    }
                }
            });
        });
        
        return { met: l1ControlsMet, total: L1_CONTROL_IDS.length };
    }

    calculateL3ControlsMet() {
        if (typeof NIST_800_172A_FAMILIES === 'undefined') return { met: 0, total: 0 };
        const l3Data = JSON.parse(localStorage.getItem('nist-l3-assessment') || '{}');
        let l3Met = 0, l3Total = 0;
        NIST_800_172A_FAMILIES.forEach(family => {
            family.controls.forEach(control => {
                l3Total++;
                const allMet = control.objectives.length > 0 && control.objectives.every(obj => l3Data[obj.id]?.status === 'met');
                if (allMet) l3Met++;
            });
        });
        return { met: l3Met, total: l3Total };
    }

    updateProgress() {
        // Handle L3 progress separately
        if (this.assessmentLevel === '3') {
            this.updateL3Progress();
            return;
        }

        let total = 0, assessed = 0, met = 0, partial = 0, notMet = 0;

        const families = this.getActiveControlFamilies();
        families.forEach(family => {
            family.controls.forEach(control => {
                // Filter controls based on assessment level (only for Rev 2)
                if (this.assessmentRevision !== 'r3') {
                    const mapping = typeof getFrameworkMappings === 'function' ? getFrameworkMappings(control.id) : null;
                    const cmmcLevel = mapping?.cmmc?.level || 2;
                    if (this.assessmentLevel === '1' && cmmcLevel !== 1) return;
                }
                
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

        // Update text with level and revision indicator
        let levelLabel = this.assessmentLevel === '1' ? 'L1' : 'L2';
        if (this.assessmentRevision === 'r3' && this.assessmentLevel === '2') levelLabel = 'L2 Rev 3';
        document.getElementById('progress-text').textContent = `${assessed} of ${total} assessed (${levelLabel})`;
        
        const complianceRate = assessed > 0 ? Math.round((met / assessed) * 100) : 0;
        document.getElementById('compliance-text').textContent = `${complianceRate}% compliant`;

        // Update progress bars
        const metWidth = total > 0 ? (met / total) * 100 : 0;
        const partialWidth = total > 0 ? (partial / total) * 100 : 0;
        const notMetWidth = total > 0 ? (notMet / total) * 100 : 0;

        document.getElementById('progress-met').style.width = `${metWidth}%`;
        document.getElementById('progress-partial').style.width = `${partialWidth}%`;
        document.getElementById('progress-not-met').style.width = `${notMetWidth}%`;
    }

    filterControls() {
        // L3 controls use lazy-loaded objectives — skip filtering to avoid hiding them
        if (this.assessmentLevel === '3') return;

        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const statusFilter = document.getElementById('filter-status').value;
        const familyFilter = document.getElementById('filter-family').value;
        
        // Save filter state to localStorage
        this.saveFilterState(statusFilter, familyFilter);

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
        this.getActiveControlFamilies().forEach(family => {
            family.controls.forEach(c => {
                if (c.id === controlId) control = c;
            });
        });

        const pointValue = control?.pointValue || 1;
        const scoringRef = (this.assessmentRevision === 'r3' && typeof SPRS_SCORING_R3 !== 'undefined') ? SPRS_SCORING_R3 : (typeof SPRS_SCORING !== 'undefined' ? SPRS_SCORING : null);
        const isNeverPoam = scoringRef?.neverPoam?.includes(controlId);
        const isFipsException = controlId === '3.13.11' || controlId === '03.13.11';
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

        // Populate Weakness Identifying Party dropdown with OSC and Assessor names
        const identifyingPartySelect = document.getElementById('poam-identifying-party');
        const oscName = document.getElementById('org-osc-name').value || 'OSC';
        const assessorName = document.getElementById('org-assessor-name').value || 'Assessor';
        identifyingPartySelect.innerHTML = `
            <option value="">-- Select --</option>
            <option value="${oscName}">${oscName}</option>
            <option value="${assessorName}">${assessorName}</option>
        `;
        identifyingPartySelect.value = formData.identifyingParty || '';

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
        
        // Form validation
        const weakness = document.getElementById('poam-weakness').value.trim();
        const remediation = document.getElementById('poam-remediation').value.trim();
        const scheduledDate = document.getElementById('poam-date').value;
        const responsible = document.getElementById('poam-responsible').value.trim();
        
        if (!weakness) {
            this.showToast('Weakness description is required', 'error');
            document.getElementById('poam-weakness').focus();
            return;
        }
        
        if (!remediation) {
            this.showToast('Remediation plan is required', 'error');
            document.getElementById('poam-remediation').focus();
            return;
        }
        
        if (!scheduledDate) {
            this.showToast('Scheduled completion date is required', 'error');
            document.getElementById('poam-date').focus();
            return;
        }
        
        if (!responsible) {
            this.showToast('Responsible party is required', 'error');
            document.getElementById('poam-responsible').focus();
            return;
        }
        
        const objectiveId = document.getElementById('poam-objective-id').value;
        const isNeverPoam = document.getElementById('poam-form').dataset.isNeverPoam === 'true';
        const controlId = document.getElementById('poam-form').dataset.controlId;
        
        const entryData = {
            weakness: weakness,
            identifyingParty: document.getElementById('poam-identifying-party').value,
            remediation: remediation,
            scheduledDate: scheduledDate,
            responsible: responsible,
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
        const scoringRef2 = (this.assessmentRevision === 'r3' && typeof SPRS_SCORING_R3 !== 'undefined') ? SPRS_SCORING_R3 : (typeof SPRS_SCORING !== 'undefined' ? SPRS_SCORING : null);
        
        this.getActiveControlFamilies().forEach(family => {
            family.controls.forEach(control => {
                const isNeverPoam = scoringRef2?.neverPoam?.includes(control.id);
                
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
                const isFipsException = item.controlId === '3.13.11' || item.controlId === '03.13.11';
                
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
        console.log('[App] Rendering dashboard...');
        const container = document.getElementById('dashboard-content');
        const headerScores = document.getElementById('dashboard-header-scores');
        
        if (!container) {
            console.error('[App] Dashboard content container not found');
            return;
        }
        
        // Calculate overall stats
        let totalObjectives = 0, totalMet = 0, totalPartial = 0, totalNotMet = 0, totalNotAssessed = 0;
        
        this.getActiveControlFamilies().forEach(family => {
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

        // Calculate L1 status
        const l1Status = this.calculateL1ControlsMet();
        const l1Complete = l1Status.met === l1Status.total && l1Status.total > 0;
        const l1StatusClass = l1Complete ? 'eligible' : 'not-eligible';

        // Calculate CMMC L2 Conditional Status eligibility (88/110 = 80%)
        const controlsMet = this.calculateControlsMet();
        const conditionalThreshold = 88;
        const meetsConditionalThreshold = controlsMet >= conditionalThreshold;
        const conditionalStatusClass = meetsConditionalThreshold ? 'eligible' : 'not-eligible';

        // Calculate total SPRS score
        const sprsScore = this.calculateTotalSPRS();
        const sprsClass = sprsScore >= 0 ? 'positive' : sprsScore >= -50 ? 'moderate' : 'critical';

        // Calculate L3 status
        const l3Status = this.calculateL3ControlsMet();
        const l3Complete = l3Status.met === l3Status.total && l3Status.total > 0;
        const l3StatusClass = l3Complete ? 'eligible' : 'not-eligible';

        // Render inline header scores with theme picker
        const isRev3 = this.assessmentRevision === 'r3';
        if (headerScores) {
            headerScores.innerHTML = `
                ${!isRev3 ? `<div class="dashboard-score-badge sprs ${sprsClass}">
                    <span class="score-badge-label">SPRS:</span>
                    <span class="score-badge-value">${sprsScore}</span>
                </div>` : ''}
                <div class="dashboard-score-badge cmmc ${l1StatusClass}">
                    <span class="score-badge-label">L1:</span>
                    <span class="score-badge-value">${l1Status.met}/${l1Status.total}</span>
                    <span>${l1Complete ? '✓' : '⚠'}</span>
                </div>
                <div class="dashboard-score-badge cmmc ${conditionalStatusClass}">
                    <span class="score-badge-label">L2:</span>
                    <span class="score-badge-value">${controlsMet}/110</span>
                    <span>${meetsConditionalThreshold ? '✓' : '⚠'}</span>
                </div>
                ${l3Status.total > 0 ? `<div class="dashboard-score-badge cmmc-l3 ${l3StatusClass}">
                    <span class="score-badge-label">L3:</span>
                    <span class="score-badge-value">${l3Status.met}/${l3Status.total}</span>
                    <span>${l3Complete ? '✓' : '⚠'}</span>
                </div>` : ''}
            `;
        }

        // SVG progress ring helper
        const progressPct = totalObjectives > 0 ? Math.round((totalMet / totalObjectives) * 100) : 0;
        const ringRadius = 54;
        const ringCirc = 2 * Math.PI * ringRadius;
        const ringOffset = ringCirc - (progressPct / 100) * ringCirc;

        // Partial + met combined for "addressed" percentage
        const addressedPct = totalObjectives > 0 ? Math.round(((totalMet + totalPartial) / totalObjectives) * 100) : 0;

        let html = `
            <div class="dash-hero">
                <div class="dash-hero-ring">
                    <svg viewBox="0 0 120 120" class="dash-ring-svg">
                        <circle cx="60" cy="60" r="${ringRadius}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="8"/>
                        <circle cx="60" cy="60" r="${ringRadius}" fill="none" stroke="url(#dashGrad)" stroke-width="8" stroke-linecap="round"
                            stroke-dasharray="${ringCirc}" stroke-dashoffset="${ringOffset}"
                            transform="rotate(-90 60 60)" class="dash-ring-progress"/>
                        <defs>
                            <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#34d399"/>
                                <stop offset="100%" stop-color="#6c8aff"/>
                            </linearGradient>
                        </defs>
                    </svg>
                    <div class="dash-ring-label">
                        <span class="dash-ring-pct">${progressPct}%</span>
                        <span class="dash-ring-sub">Compliant</span>
                    </div>
                </div>
                <div class="dash-hero-stats">
                    <div class="dash-hero-row">
                        <div class="dash-hero-metric">
                            <span class="dash-metric-value">${totalObjectives}</span>
                            <span class="dash-metric-label">Total Objectives</span>
                        </div>
                        <div class="dash-hero-metric">
                            <span class="dash-metric-value" style="color:var(--status-met)">${totalMet}</span>
                            <span class="dash-metric-label">Met</span>
                        </div>
                        <div class="dash-hero-metric">
                            <span class="dash-metric-value" style="color:var(--status-partial)">${totalPartial}</span>
                            <span class="dash-metric-label">Partial</span>
                        </div>
                        <div class="dash-hero-metric">
                            <span class="dash-metric-value" style="color:var(--status-not-met)">${totalNotMet}</span>
                            <span class="dash-metric-label">Not Met</span>
                        </div>
                        <div class="dash-hero-metric">
                            <span class="dash-metric-value" style="color:var(--text-muted)">${totalNotAssessed}</span>
                            <span class="dash-metric-label">Pending</span>
                        </div>
                    </div>
                    <div class="dash-hero-bar">
                        <div class="dash-bar-segment met" style="width:${totalObjectives ? (totalMet/totalObjectives)*100 : 0}%"></div>
                        <div class="dash-bar-segment partial" style="width:${totalObjectives ? (totalPartial/totalObjectives)*100 : 0}%"></div>
                        <div class="dash-bar-segment not-met" style="width:${totalObjectives ? (totalNotMet/totalObjectives)*100 : 0}%"></div>
                    </div>
                    <div class="dash-hero-footer">
                        <span class="dash-addressed">${addressedPct}% addressed</span>
                        <span class="dash-remaining">${totalNotAssessed} remaining</span>
                    </div>
                </div>
            </div>
            <div class="dash-quick-actions" style="display:flex;gap:10px;flex-wrap:wrap;margin:4px 0 8px;">
                <button class="dash-l2-guide-btn" id="dash-l2-guide-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                    <span>L2 Assessment &amp; Scoping Guide</span>
                </button>
            </div>
        `;

        // Family cards
        this.getActiveControlFamilies().forEach(family => {
            const stats = this.calculateFamilyStats(family);
            let familyTotal = 0;
            family.controls.forEach(c => familyTotal += c.objectives.length);
            const notAssessed = familyTotal - stats.met - stats.partial - stats.notMet;
            const famPct = familyTotal > 0 ? Math.round((stats.met / familyTotal) * 100) : 0;

            // Calculate SPRS score for this family
            const familySprs = this.calculateFamilySPRS(family);

            // Mini ring for each family
            const miniR = 20;
            const miniC = 2 * Math.PI * miniR;
            const miniOff = miniC - (famPct / 100) * miniC;
            const ringColor = famPct === 100 ? '#34d399' : famPct >= 50 ? '#6c8aff' : famPct > 0 ? '#fbbf24' : 'rgba(255,255,255,0.08)';

            html += `
                <div class="dashboard-card">
                    <div class="dash-card-header">
                        <div class="dash-card-ring">
                            <svg viewBox="0 0 48 48" width="42" height="42">
                                <circle cx="24" cy="24" r="${miniR}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="4"/>
                                <circle cx="24" cy="24" r="${miniR}" fill="none" stroke="${ringColor}" stroke-width="4" stroke-linecap="round"
                                    stroke-dasharray="${miniC}" stroke-dashoffset="${miniOff}"
                                    transform="rotate(-90 24 24)" style="transition:stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)"/>
                            </svg>
                            <span class="dash-card-ring-pct">${famPct}</span>
                        </div>
                        <h3 class="dashboard-family-link" data-family-id="${family.id}"><span class="family-id">${family.id}</span> ${family.name}</h3>
                    </div>
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
                    ${!isRev3 ? `<div class="sprs-family-score">
                        <span class="sprs-label">SPRS Impact:</span>
                        <span class="sprs-value ${familySprs.lost > 0 ? 'has-loss' : ''}">${familySprs.lost > 0 ? '-' + familySprs.lost : '0'}</span>
                        <span class="sprs-max">/ -${familySprs.maxPossible}</span>
                    </div>` : ''}
                    <div class="dashboard-progress">
                        <div class="progress-met" style="width: ${(stats.met / familyTotal) * 100}%"></div>
                        <div class="progress-partial" style="width: ${(stats.partial / familyTotal) * 100}%"></div>
                        <div class="progress-not-met" style="width: ${(stats.notMet / familyTotal) * 100}%"></div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // L2 Guide quick-access button
        const l2Btn = document.getElementById('dash-l2-guide-btn');
        if (l2Btn) {
            l2Btn.addEventListener('click', () => this.switchView('l2-guide'));
        }

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

    navigateToControl(controlId) {
        // Navigate to a specific control (e.g., "3.1.3")
        // First, determine the family from the control ID
        const parts = controlId.split('.');
        if (parts.length < 2) return;
        
        const familyNumber = parts[1]; // e.g., "1" from "3.1.3"
        
        // Map family numbers to family IDs (Rev 2 and Rev 3 formats)
        const familyMap = {
            '1': 'AC',   '01': 'AC',   // Access Control
            '2': 'AT',   '02': 'AT',   // Awareness and Training
            '3': 'AU',   '03': 'AU',   // Audit and Accountability
            '4': 'CM',   '04': 'CM',   // Configuration Management
            '5': 'IA',   '05': 'IA',   // Identification and Authentication
            '6': 'IR',   '06': 'IR',   // Incident Response
            '7': 'MA',   '07': 'MA',   // Maintenance
            '8': 'MP',   '08': 'MP',   // Media Protection
            '9': 'PS',   '09': 'PS',   // Personnel Security
            '10': 'PE',                 // Physical Protection
            '11': 'RA',                 // Risk Assessment
            '12': 'CA',                 // Security Assessment
            '13': 'SC',                 // System and Communications Protection
            '14': 'SI',                 // System and Information Integrity
            '15': 'SR',                 // Supply Chain Risk Management (Rev 3)
            '16': 'PL'                  // Planning (Rev 3)
        };
        
        const familyId = familyMap[familyNumber];
        if (!familyId) return;
        
        // Switch to assessment view
        this.switchView('assessment');
        
        // Ensure controls are rendered
        const controlsList = document.getElementById('controls-list');
        if (controlsList && controlsList.children.length === 0) {
            this.renderControls();
        }
        
        // Find and expand the control after view has rendered
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
                
                // Find the specific control (e.g., "3.1.3")
                const controlEl = familyEl.querySelector(`.control-card[data-control-id="${controlId}"]`);
                
                if (controlEl) {
                    // Expand this control's objectives
                    const controlHeader = controlEl.querySelector('.control-header');
                    const objectivesDiv = controlHeader?.nextElementSibling;
                    if (controlHeader && objectivesDiv) {
                        controlHeader.classList.add('expanded');
                        objectivesDiv.classList.add('expanded');
                    }
                    
                    // Highlight the control briefly
                    controlEl.style.boxShadow = '0 0 0 3px var(--accent-blue)';
                    controlEl.style.transition = 'box-shadow 0.3s ease';
                    
                    // Scroll to control
                    setTimeout(() => {
                        controlEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        
                        // Remove highlight after 2 seconds
                        setTimeout(() => {
                            controlEl.style.boxShadow = '';
                        }, 2000);
                    }, 50);
                } else {
                    // Control card not found, just scroll to family
                    setTimeout(() => {
                        familyEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                }
            }
        }, 300);
    }

    markAllNotMet() {
        if (!confirm('This will mark ALL objectives as "Not Met" and add them to the POA&M. Are you sure?')) {
            return;
        }
        
        let count = 0;
        this.getActiveControlFamilies().forEach(family => {
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
        const isL1 = this.assessmentLevel === '1';
        
        // Get org info for export
        const assessorName = this.orgData.assessorName || '';
        const assessorUrl = this.orgData.assessorUrl || '';
        const oscName = this.orgData.oscName || '';
        const oscUrl = this.orgData.oscUrl || '';
        
        this.getActiveControlFamilies().forEach(family => {
            family.controls.forEach(control => {
                // Filter controls based on assessment level
                if (this.assessmentRevision !== 'r3') {
                    const mapping = typeof getFrameworkMappings === 'function' ? getFrameworkMappings(control.id) : null;
                    const cmmcLevel = mapping?.cmmc?.level || 2;
                    if (isL1 && cmmcLevel !== 1) return;
                }
                
                control.objectives.forEach(objective => {
                    const assessment = this.assessmentData[objective.id] || {};
                    const impl = this.implementationData[objective.id] || {};
                    const poam = this.poamData[objective.id] || {};
                    const deficiency = this.deficiencyData[objective.id] || {};
                    
                    const xrefId = typeof CTRL_XREF !== 'undefined' ? (CTRL_XREF[objective.id] || '') : '';
                    
                    // Build item based on level - L1 has simpler structure (no POA&M)
                    const item = {
                        'CMMC Level': isL1 ? 'L1' : 'L2',
                        'Control Family': `${family.id} - ${family.name}`,
                        'Control ID': control.id,
                        'Control Name': control.name,
                        'Objective ID': objective.id,
                        'External Ref': xrefId,
                        'Objective': objective.text,
                        'Status': assessment.status || 'Not Assessed',
                        'Implementation Description': impl.description || '',
                        'Implementation Evidence': impl.evidence || '',
                        'Implementation Notes': impl.notes || ''
                    };
                    
                    // Add POA&M fields only for L2
                    if (!isL1) {
                        item['POA&M Weakness'] = poam.weakness || '';
                        item['POA&M Remediation'] = poam.remediation || '';
                        item['POA&M Scheduled Date'] = poam.scheduledDate || '';
                        item['POA&M Responsible Party'] = poam.responsible || '';
                        item['POA&M Risk Level'] = poam.risk || '';
                        item['POA&M Cost'] = poam.cost || '';
                        item['POA&M Notes'] = poam.notes || '';
                        item['Deficiency Notes'] = deficiency.notes || '';
                    }
                    
                    items.push(item);
                });
            });
        });

        if (items.length === 0) {
            this.showToast('No assessment data to export', 'error');
            return;
        }

        // Convert to CSV with header row for Assessor | OSC
        const headers = Object.keys(items[0]);
        const levelLabel = isL1 ? 'CMMC L1 Self-Assessment' : 'CMMC L2 Assessment';
        const orgInfoRow = `"${levelLabel} | ${assessorName}${assessorUrl ? ' (' + assessorUrl + ')' : ''} | ${oscName}${oscUrl ? ' (' + oscUrl + ')' : ''}"`;
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
        const levelSlug = isL1 ? 'L1-' : 'L2-';
        a.download = `CMMC-${levelSlug}Assessment-${oscSlug}${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast(`Exported ${items.length} ${isL1 ? 'L1' : 'L2'} assessment items`, 'success');
    }

    exportPOAMCSV() {
        // =====================================================================
        // Client-Ready POA&M Export
        // Merges base POA&M data with POAMEnhancements (risk, cost, milestones)
        // Produces a professional multi-sheet workbook ready for delivery
        // =====================================================================
        const poamItems = [];
        const riskRows = [];
        const milestoneRows = [];
        const costRows = [];
        
        // Get org info
        const assessorName = this.orgData.assessorName || '';
        const assessorUrl = this.orgData.assessorUrl || '';
        const oscName = this.orgData.oscName || '';
        const oscUrl = this.orgData.oscUrl || '';
        const exportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const exportTimestamp = new Date().toLocaleString();
        
        // POAMEnhancements integration
        const hasEnhancements = typeof POAMEnhancements !== 'undefined';
        const enhancedStore = hasEnhancements ? POAMEnhancements.enhancedData : {};
        
        // SPRS scoring reference
        const scoringRefExport = (this.assessmentRevision === 'r3' && typeof SPRS_SCORING_R3 !== 'undefined') ? SPRS_SCORING_R3 : (typeof SPRS_SCORING !== 'undefined' ? SPRS_SCORING : null);
        
        // Determine POA&M eligibility helpers
        const neverPoamList = scoringRefExport?.neverPoam || (typeof SPRS_SCORING !== 'undefined' ? SPRS_SCORING.neverPoam : []) || [];
        
        // Collect SPRS score for summary
        let totalSPRSDeduction = 0;
        let controlsMet = 0;
        let controlsTotal = 0;
        
        this.getActiveControlFamilies().forEach(family => {
            family.controls.forEach(control => {
                controlsTotal++;
                const isNeverPoam = neverPoamList.includes(control.id);
                const isFipsException = control.id === '3.13.11';
                let controlHasGap = false;
                
                control.objectives.forEach(objective => {
                    const assessment = this.assessmentData[objective.id];
                    if (assessment && (assessment.status === 'not-met' || assessment.status === 'partial')) {
                        controlHasGap = true;
                        const poam = this.poamData[objective.id] || {};
                        const enhanced = enhancedStore[objective.id] || {};
                        const xrefId = typeof CTRL_XREF !== 'undefined' ? (CTRL_XREF[objective.id] || '') : '';
                        const sprsScore = scoringRefExport ? (scoringRefExport.pointValues[control.id] || 0) : 0;
                        const severity = sprsScore >= 5 ? 'High' : sprsScore >= 3 ? 'Medium' : 'Low';
                        const cmmcId = control.cmmcPracticeId || control.id;
                        
                        // POA&M eligibility
                        let poamEligibility = 'Yes';
                        if (isNeverPoam) poamEligibility = 'NO - Cannot POA&M';
                        else if (sprsScore > 1 && !isFipsException) poamEligibility = 'Warning - High Value';
                        else if (isFipsException) poamEligibility = 'FIPS Exception';
                        
                        // Risk data from enhancements
                        let riskScore = 0, riskLevel = 'Not Assessed', likelihood = '', impact = '', riskDesc = '', mitigation = '';
                        if (enhanced.riskAssessment && hasEnhancements) {
                            riskScore = POAMEnhancements.calculateRiskScore(enhanced.riskAssessment);
                            riskLevel = POAMEnhancements.getRiskLevel(riskScore).toUpperCase();
                            likelihood = enhanced.riskAssessment.likelihood || '';
                            impact = enhanced.riskAssessment.impact || '';
                            riskDesc = enhanced.riskAssessment.description || '';
                            mitigation = enhanced.riskAssessment.mitigation || '';
                        }
                        
                        // Cost data from enhancements
                        const costBreakdown = enhanced.costBreakdown || [];
                        const totalEstCost = costBreakdown.reduce((s, c) => s + (c.estimated || 0), 0);
                        const totalActCost = costBreakdown.reduce((s, c) => s + (c.actual || 0), 0);
                        
                        // Milestones from enhancements
                        const milestones = enhanced.milestones || [];
                        const progress = milestones.length > 0 ? Math.round((milestones.filter(m => m.status === 'completed').length / milestones.length) * 100) : 0;
                        
                        // Main POA&M row
                        poamItems.push({
                            'POA&M ID': `POAM-${poamItems.length + 1}`,
                            'CMMC Practice': cmmcId,
                            'Control ID': control.id,
                            'Control Name': control.name,
                            'Objective ID': objective.id,
                            'Objective': objective.text,
                            'Status': assessment.status === 'not-met' ? 'Not Met' : 'Partial',
                            'POA&M Eligible': poamEligibility,
                            'SPRS Pts': sprsScore,
                            'Severity': severity,
                            'Risk Score': riskScore || '',
                            'Risk Level': riskLevel,
                            'Weakness Description': poam.weakness || objective.text,
                            'Identifying Party': poam.identifyingParty || '',
                            'Remediation Plan': poam.remediation || '',
                            'Milestones': milestones.length > 0 ? milestones.map(m => m.name).join('; ') : '',
                            'Progress': progress > 0 ? progress + '%' : '',
                            'Scheduled Completion': poam.scheduledDate || '',
                            'Responsible Party': poam.responsible || '',
                            'Responsible Lead': poam.responsibleLead || '',
                            'Est. Cost': totalEstCost > 0 ? '$' + totalEstCost.toLocaleString() : poam.cost || '',
                            'Actual Cost': totalActCost > 0 ? '$' + totalActCost.toLocaleString() : '',
                            'Notes': poam.notes || ''
                        });
                        
                        // Risk register row
                        riskRows.push({
                            'POA&M ID': `POAM-${poamItems.length}`,
                            'CMMC Practice': cmmcId,
                            'Objective ID': objective.id,
                            'Weakness': poam.weakness || objective.text,
                            'Likelihood': likelihood ? likelihood.charAt(0).toUpperCase() + likelihood.slice(1) : 'Not Assessed',
                            'Impact': impact ? impact.charAt(0).toUpperCase() + impact.slice(1) : 'Not Assessed',
                            'Risk Score': riskScore || 'N/A',
                            'Risk Level': riskLevel,
                            'Risk Description': riskDesc,
                            'Mitigation Strategy': mitigation,
                            'Responsible Party': poam.responsible || '',
                            'Target Date': poam.scheduledDate || ''
                        });
                        
                        // Milestone rows
                        milestones.forEach((ms, idx) => {
                            milestoneRows.push({
                                'POA&M ID': `POAM-${poamItems.length}`,
                                'CMMC Practice': cmmcId,
                                'Objective ID': objective.id,
                                'Milestone #': idx + 1,
                                'Milestone Name': ms.name,
                                'Target Date': ms.targetDate || '',
                                'Status': ms.status ? ms.status.charAt(0).toUpperCase() + ms.status.slice(1).replace('-', ' ') : 'Pending',
                                'Description': ms.description || '',
                                'Responsible Party': poam.responsible || ''
                            });
                        });
                        
                        // Cost breakdown rows
                        costBreakdown.forEach(cb => {
                            costRows.push({
                                'POA&M ID': `POAM-${poamItems.length}`,
                                'CMMC Practice': cmmcId,
                                'Objective ID': objective.id,
                                'Cost Category': cb.category ? cb.category.charAt(0).toUpperCase() + cb.category.slice(1) : '',
                                'Description': cb.description || '',
                                'Estimated Cost': cb.estimated ? '$' + cb.estimated.toLocaleString() : '',
                                'Actual Cost': cb.actual ? '$' + cb.actual.toLocaleString() : 'Pending',
                                'Responsible Party': poam.responsible || ''
                            });
                        });
                    }
                });
                
                if (!controlHasGap) controlsMet++;
            });
        });

        if (poamItems.length === 0) {
            this.showToast('No POA&M items to export', 'error');
            return;
        }
        
        // Calculate summary stats
        totalSPRSDeduction = poamItems.reduce((s, i) => s + (parseInt(i['SPRS Pts']) || 0), 0);
        const sprsScore = 110 - totalSPRSDeduction;
        const highRiskCount = riskRows.filter(r => r['Risk Level'] === 'HIGH').length;
        const medRiskCount = riskRows.filter(r => r['Risk Level'] === 'MEDIUM').length;
        const lowRiskCount = riskRows.filter(r => r['Risk Level'] === 'LOW').length;
        const totalEstimatedCost = costRows.reduce((s, c) => {
            const v = String(c['Estimated Cost']).replace(/[$,]/g, '');
            return s + (parseFloat(v) || 0);
        }, 0);
        const uniqueControls = [...new Set(poamItems.map(i => i['Control ID']))];
        const meetsConditional = controlsMet >= 88;

        // =====================================================================
        // Build Workbook
        // =====================================================================
        const wb = XLSX.utils.book_new();
        
        // ----- Sheet 1: Cover Page -----
        const coverData = [
            ['PLAN OF ACTION & MILESTONES (POA&M)'],
            [''],
            ['Organization (OSC):', oscName || 'N/A'],
            ['Organization URL:', oscUrl || 'N/A'],
            ['Assessor / C3PAO:', assessorName || 'N/A'],
            ['Assessor URL:', assessorUrl || 'N/A'],
            ['Assessment Revision:', this.assessmentRevision === 'r3' ? 'NIST SP 800-171 Rev 3' : 'NIST SP 800-171 Rev 2'],
            ['Export Date:', exportDate],
            [''],
            ['EXECUTIVE SUMMARY'],
            [''],
            ['Total POA&M Items:', poamItems.length],
            ['Unique Controls Affected:', uniqueControls.length],
            ['Controls Implemented:', controlsMet + ' / ' + controlsTotal],
            ['Estimated SPRS Score:', sprsScore],
            ['CMMC Conditional Status:', meetsConditional ? 'ELIGIBLE (>= 80%)' : 'NOT ELIGIBLE (< 80%)'],
            [''],
            ['RISK BREAKDOWN'],
            ['High Risk Items:', highRiskCount],
            ['Medium Risk Items:', medRiskCount],
            ['Low / Not Assessed:', lowRiskCount + ' / ' + riskRows.filter(r => r['Risk Level'] === 'NOT ASSESSED').length],
            [''],
            ['COST SUMMARY'],
            ['Total Estimated Remediation Cost:', totalEstimatedCost > 0 ? '$' + totalEstimatedCost.toLocaleString() : 'Not estimated'],
            ['Cost Line Items:', costRows.length],
            [''],
            ['MILESTONE SUMMARY'],
            ['Total Milestones:', milestoneRows.length],
            ['Completed:', milestoneRows.filter(m => m['Status'] === 'Completed').length],
            ['In Progress:', milestoneRows.filter(m => m['Status'] === 'In progress').length],
            ['Pending:', milestoneRows.filter(m => m['Status'] === 'Pending').length],
            ['Delayed:', milestoneRows.filter(m => m['Status'] === 'Delayed').length],
            [''],
            ['REGULATORY REFERENCES'],
            ['32 CFR 170.21 — CMMC Level 2 POA&M requirements'],
            ['NIST SP 800-171A — Assessment procedures for CUI security requirements'],
            ['DFARS 252.204-7012 — Safeguarding Covered Defense Information'],
            [''],
            ['CONFIDENTIALITY NOTICE'],
            ['This document contains sensitive security assessment information.'],
            ['Distribution is limited to authorized personnel only.']
        ];
        const wsCover = XLSX.utils.aoa_to_sheet(coverData);
        wsCover['!cols'] = [{wch: 35}, {wch: 50}];
        wsCover['!merges'] = [{s:{r:0,c:0}, e:{r:0,c:1}}];
        XLSX.utils.book_append_sheet(wb, wsCover, 'Cover Page');
        
        // ----- Sheet 2: Active POA&M -----
        const activeHeaders = Object.keys(poamItems[0]);
        const activeSheetData = [
            [oscName + ' — Plan of Action & Milestones (POA&M) — ' + exportDate],
            activeHeaders,
            ...poamItems.map(item => Object.values(item))
        ];
        const wsActive = XLSX.utils.aoa_to_sheet(activeSheetData);
        wsActive['!cols'] = [
            {wch: 10}, {wch: 16}, {wch: 10}, {wch: 28}, {wch: 12}, {wch: 45},
            {wch: 10}, {wch: 18}, {wch: 8}, {wch: 10}, {wch: 10}, {wch: 12},
            {wch: 40}, {wch: 18}, {wch: 40}, {wch: 35}, {wch: 10}, {wch: 15},
            {wch: 18}, {wch: 18}, {wch: 14}, {wch: 14}, {wch: 30}
        ];
        wsActive['!merges'] = [{s:{r:0,c:0}, e:{r:0,c:activeHeaders.length - 1}}];
        wsActive['!autofilter'] = {ref: `A2:${String.fromCharCode(64 + activeHeaders.length)}${poamItems.length + 2}`};
        XLSX.utils.book_append_sheet(wb, wsActive, 'Active POA&M');
        
        // ----- Sheet 3: Risk Register -----
        if (riskRows.length > 0) {
            const riskHeaders = Object.keys(riskRows[0]);
            const riskSheetData = [
                ['Risk Register — ' + oscName + ' — ' + exportDate],
                riskHeaders,
                ...riskRows.map(r => Object.values(r))
            ];
            const wsRisk = XLSX.utils.aoa_to_sheet(riskSheetData);
            wsRisk['!cols'] = [
                {wch: 10}, {wch: 16}, {wch: 12}, {wch: 40}, {wch: 14}, {wch: 14},
                {wch: 10}, {wch: 12}, {wch: 40}, {wch: 40}, {wch: 18}, {wch: 14}
            ];
            wsRisk['!merges'] = [{s:{r:0,c:0}, e:{r:0,c:riskHeaders.length - 1}}];
            wsRisk['!autofilter'] = {ref: `A2:${String.fromCharCode(64 + riskHeaders.length)}${riskRows.length + 2}`};
            XLSX.utils.book_append_sheet(wb, wsRisk, 'Risk Register');
        }
        
        // ----- Sheet 4: Milestones & Timeline -----
        if (milestoneRows.length > 0) {
            const msHeaders = Object.keys(milestoneRows[0]);
            const msSheetData = [
                ['Milestones & Timeline — ' + oscName + ' — ' + exportDate],
                msHeaders,
                ...milestoneRows.map(m => Object.values(m))
            ];
            const wsMs = XLSX.utils.aoa_to_sheet(msSheetData);
            wsMs['!cols'] = [
                {wch: 10}, {wch: 16}, {wch: 12}, {wch: 12}, {wch: 35},
                {wch: 14}, {wch: 14}, {wch: 40}, {wch: 18}
            ];
            wsMs['!merges'] = [{s:{r:0,c:0}, e:{r:0,c:msHeaders.length - 1}}];
            wsMs['!autofilter'] = {ref: `A2:${String.fromCharCode(64 + msHeaders.length)}${milestoneRows.length + 2}`};
            XLSX.utils.book_append_sheet(wb, wsMs, 'Milestones');
        }
        
        // ----- Sheet 5: Cost Summary -----
        if (costRows.length > 0) {
            const costHeaders = Object.keys(costRows[0]);
            const costSheetData = [
                ['Cost Summary — ' + oscName + ' — ' + exportDate],
                costHeaders,
                ...costRows.map(c => Object.values(c)),
                [],
                ['', '', '', '', 'TOTAL ESTIMATED:', totalEstimatedCost > 0 ? '$' + totalEstimatedCost.toLocaleString() : 'N/A']
            ];
            const wsCost = XLSX.utils.aoa_to_sheet(costSheetData);
            wsCost['!cols'] = [
                {wch: 10}, {wch: 16}, {wch: 12}, {wch: 16}, {wch: 35},
                {wch: 16}, {wch: 16}, {wch: 18}
            ];
            wsCost['!merges'] = [{s:{r:0,c:0}, e:{r:0,c:costHeaders.length - 1}}];
            XLSX.utils.book_append_sheet(wb, wsCost, 'Cost Summary');
        }
        
        // ----- Sheet 6: Completed POA&M (empty template) -----
        const completedData = [
            [oscName + ' — Completed POA&M Items — ' + exportDate],
            activeHeaders
        ];
        const wsCompleted = XLSX.utils.aoa_to_sheet(completedData);
        wsCompleted['!cols'] = wsActive['!cols'];
        wsCompleted['!merges'] = [{s:{r:0,c:0}, e:{r:0,c:activeHeaders.length - 1}}];
        XLSX.utils.book_append_sheet(wb, wsCompleted, 'Completed POA&M');
        
        // ----- Sheet 7: Instructions -----
        const instructions = [
            ['POA&M WORKBOOK INSTRUCTIONS'],
            [''],
            ['SHEET DESCRIPTIONS:'],
            ['Cover Page — Executive summary with risk, cost, and milestone statistics'],
            ['Active POA&M — All open items with full detail (filter/sort as needed)'],
            ['Risk Register — Risk assessment detail for each POA&M item (likelihood x impact scoring)'],
            ['Milestones — Granular milestone tracking with target dates and status'],
            ['Cost Summary — Itemized cost breakdown by category with estimated and actual costs'],
            ['Completed POA&M — Move resolved items here for audit trail'],
            [''],
            ['STATUS DEFINITIONS:'],
            ['Not Met — Objective is not implemented'],
            ['Partial — Objective is partially implemented'],
            ['Met — Objective is fully implemented (move to Completed sheet)'],
            [''],
            ['POA&M ELIGIBILITY (32 CFR 170.21):'],
            ['Yes — Control can be on POA&M for Conditional Level 2 status'],
            ['NO - Cannot POA&M — Control is listed in 170.21(a)(2)(iii) and must be implemented before assessment'],
            ['Warning - High Value — Control has SPRS point value > 1; cannot be on POA&M per 170.21(a)(2)(ii)'],
            ['FIPS Exception — SC.L2-3.13.11 may be on POA&M if encryption is employed but not FIPS-validated'],
            [''],
            ['RISK SCORING:'],
            ['Risk Score = Likelihood x Impact (each rated 1-5)'],
            ['HIGH = Score >= 15 | MEDIUM = Score 6-14 | LOW = Score 1-5'],
            [''],
            ['REGULATORY REFERENCES:'],
            ['32 CFR Part 170 — Cybersecurity Maturity Model Certification (CMMC) Program'],
            ['NIST SP 800-171 — Protecting Controlled Unclassified Information in Nonfederal Systems'],
            ['NIST SP 800-171A — Assessing Security Requirements for CUI'],
            ['DFARS 252.204-7012 — Safeguarding Covered Defense Information'],
            ['DFARS 252.204-7021 — CMMC Requirements'],
            [''],
            ['EXCEL VBA MACROS (optional — for moving rows between Active/Completed):'],
            [''],
            ['Sub MoveMetItems()'],
            ['    Dim wsA As Worksheet, wsC As Worksheet'],
            ['    Dim lr As Long, lrC As Long, i As Long'],
            ['    Set wsA = Sheets("Active POA&M")'],
            ['    Set wsC = Sheets("Completed POA&M")'],
            ['    lr = wsA.Cells(wsA.Rows.Count, "A").End(xlUp).Row'],
            ['    For i = lr To 3 Step -1'],
            ['        If wsA.Cells(i, 7).Value = "Met" Then'],
            ['            lrC = wsC.Cells(wsC.Rows.Count, "A").End(xlUp).Row + 1'],
            ['            If lrC < 3 Then lrC = 3'],
            ['            wsA.Rows(i).Copy wsC.Rows(lrC)'],
            ['            wsA.Rows(i).Delete'],
            ['        End If'],
            ['    Next i'],
            ['End Sub'],
            [''],
            ['Sub MoveNotMetItems()'],
            ['    Dim wsA As Worksheet, wsC As Worksheet'],
            ['    Dim lr As Long, lrA As Long, i As Long'],
            ['    Set wsA = Sheets("Active POA&M")'],
            ['    Set wsC = Sheets("Completed POA&M")'],
            ['    lr = wsC.Cells(wsC.Rows.Count, "A").End(xlUp).Row'],
            ['    For i = lr To 3 Step -1'],
            ['        If wsC.Cells(i, 7).Value = "Not Met" Or wsC.Cells(i, 7).Value = "Partial" Then'],
            ['            lrA = wsA.Cells(wsA.Rows.Count, "A").End(xlUp).Row + 1'],
            ['            If lrA < 3 Then lrA = 3'],
            ['            wsC.Rows(i).Copy wsA.Rows(lrA)'],
            ['            wsC.Rows(i).Delete'],
            ['        End If'],
            ['    Next i'],
            ['End Sub'],
            [''],
            ['HOW TO USE MACROS:'],
            ['1. Press Alt+F11 to open VBA Editor'],
            ['2. Insert > Module, paste the code above'],
            ['3. Close VBA Editor'],
            ['4. Press Alt+F8, select MoveMetItems or MoveNotMetItems, click Run'],
            [''],
            ['Generated: ' + exportTimestamp],
            ['Tool: CMMC Assessment Tool — POA&M Export']
        ];
        const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
        wsInstructions['!cols'] = [{wch: 90}];
        XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');
        
        // Export workbook
        const oscSlug = oscName ? oscName.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '-' : '';
        XLSX.writeFile(wb, `POAM-${oscSlug}${new Date().toISOString().split('T')[0]}.xlsx`);

        this.showToast(`Exported ${poamItems.length} POA&M items across ${Object.keys(wb.Sheets).length} sheets`, 'success');
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

    // Implementation Guide Modal Methods
    implGuideCloud = 'azure';
    implGuideTab = 'project-plan';

    openImplGuideModal() {
        const modal = document.getElementById('impl-guide-modal');
        modal?.classList.add('active');
        this.implGuideCloud = 'azure';
        document.getElementById('impl-cloud-selector').value = 'azure';
        this.updateImplGuideHeader();
        this.switchImplGuideTab('project-plan');
    }

    closeImplGuideModal() {
        document.getElementById('impl-guide-modal')?.classList.remove('active');
    }

    switchImplGuideCloud(cloud) {
        this.implGuideCloud = cloud;
        this.updateImplGuideHeader();
        this.switchImplGuideTab(this.implGuideTab);
    }

    updateImplGuideHeader() {
        const titles = {
            azure: { title: 'GCC High Implementation Guide', subtitle: 'CMMC L2 Deployment Resources for M365 GCC High / Azure Government' },
            aws: { title: 'AWS GovCloud Implementation Guide', subtitle: 'CMMC L2 Deployment Resources for AWS GovCloud (US-Gov-West/East)' },
            gcp: { title: 'GCP Implementation Guide', subtitle: 'CMMC L2 Deployment Resources for Google Cloud Platform / Google Workspace' }
        };
        const info = titles[this.implGuideCloud] || titles.azure;
        document.getElementById('impl-guide-title').textContent = info.title;
        document.getElementById('impl-guide-subtitle').textContent = info.subtitle;
    }

    getImplGuide() {
        switch(this.implGuideCloud) {
            case 'aws': return typeof AWS_GOVCLOUD_IMPL_GUIDE !== 'undefined' ? AWS_GOVCLOUD_IMPL_GUIDE : null;
            case 'gcp': return typeof GCP_IMPL_GUIDE !== 'undefined' ? GCP_IMPL_GUIDE : null;
            default: return typeof GCC_HIGH_IMPL_GUIDE !== 'undefined' ? GCC_HIGH_IMPL_GUIDE : null;
        }
    }

    switchImplGuideTab(tabId) {
        this.implGuideTab = tabId;
        document.querySelectorAll('.impl-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`.impl-tab[data-tab="${tabId}"]`)?.classList.add('active');
        
        const body = document.getElementById('impl-guide-body');
        const guide = this.getImplGuide();
        if (!body || !guide) return;
        
        let html = '';
        
        switch(tabId) {
            case 'project-plan':
                html = this.renderImplProjectPlan(guide);
                break;
            case 'evidence':
                html = this.renderImplEvidence(guide);
                break;
            case 'policies':
                html = this.renderImplPolicies(guide);
                break;
            case 'ssp':
                html = this.renderImplSSP(guide);
                break;
            case 'services':
                html = this.renderImplServices(guide);
                break;
            case 'extras':
                html = this.renderImplExtras(guide);
                break;
        }
        body.innerHTML = html;
    }

    renderImplProjectPlan(guide) {
        const phaseClass = (phase) => {
            if (phase.includes('Foundation')) return 'foundation';
            if (phase.includes('Security')) return 'security';
            if (phase.includes('Workspace')) return 'workspace';
            if (phase.includes('People')) return 'people';
            if (phase.includes('Governance')) return 'governance';
            if (phase.includes('Audit')) return 'audit';
            return '';
        };
        
        const planRows = guide.projectPlan.map(t => `
            <tr>
                <td><span class="impl-phase-badge ${phaseClass(t.phase)}">${t.phase}</span></td>
                <td>Week ${t.week}</td>
                <td>${t.task}</td>
                <td>${t.owner}</td>
                <td>${t.accountable}</td>
                <td>${t.deliverable}</td>
            </tr>
        `).join('');
        
        const recurringRows = guide.recurringOps.map(r => `
            <tr>
                <td><strong>${r.frequency}</strong></td>
                <td>${r.activity}</td>
                <td>${r.owner}</td>
                <td>${r.purpose}</td>
            </tr>
        `).join('');
        
        return `
            <div class="impl-section">
                <div class="impl-section-title">8-Week Implementation Timeline</div>
                <table class="impl-table">
                    <thead><tr><th>Phase</th><th>Week</th><th>Task</th><th>Owner</th><th>Accountable</th><th>Deliverable</th></tr></thead>
                    <tbody>${planRows}</tbody>
                </table>
            </div>
            <div class="impl-section">
                <div class="impl-section-title">Recurring Operations (Post-Implementation)</div>
                <table class="impl-table">
                    <thead><tr><th>Frequency</th><th>Activity</th><th>Owner</th><th>Purpose</th></tr></thead>
                    <tbody>${recurringRows}</tbody>
                </table>
            </div>
        `;
    }

    renderImplEvidence(guide) {
        const rows = guide.evidenceStrategy.map(e => `
            <tr>
                <td><strong>${e.domain}</strong></td>
                <td><code class="impl-code">${e.artifact}</code></td>
                <td>${e.source}</td>
                <td><code class="impl-code" style="font-size:0.6rem">${e.command}</code></td>
                <td>${e.proves}</td>
            </tr>
        `).join('');
        
        return `
            <div class="impl-section">
                <div class="impl-section-title">Machine-Readable Evidence Strategy</div>
                <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:16px">Run these commands weekly to generate JSON evidence artifacts for your assessor.</p>
                <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;margin-bottom:16px;background:rgba(79,70,229,0.06);border:1px solid rgba(79,70,229,0.15);border-radius:8px;font-size:0.78rem;color:var(--text-secondary)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    <span>Each control in the <strong>Assessment</strong> view includes vendor-specific implementation guidance with CLI commands, Terraform examples, and verification steps.</span>
                </div>
                <table class="impl-table">
                    <thead><tr><th>Domain</th><th>Artifact</th><th>Source</th><th>PowerShell Command</th><th>Proves</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }

    renderImplPolicies(guide) {
        const policies = Object.values(guide.policyTemplates).map(p => `
            <div class="impl-policy-card">
                <div class="impl-policy-header">
                    <h4>${p.title}</h4>
                    <p>${p.purpose}</p>
                </div>
                <div class="impl-policy-body">
                    ${p.sections.map(s => `
                        <div class="impl-policy-section">
                            <h5>${s.heading}</h5>
                            <ul>${s.items.map(i => `<li>${i}</li>`).join('')}</ul>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        return `
            <div class="impl-section">
                <div class="impl-section-title">Policy Templates</div>
                <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:16px">Copy and customize these policy templates for your organization.</p>
                <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;margin-bottom:16px;background:rgba(79,70,229,0.06);border:1px solid rgba(79,70,229,0.15);border-radius:8px;font-size:0.78rem;color:var(--text-secondary)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    <span>For per-control policy requirements, expand any objective in the <strong>Assessment</strong> view to see implementation guidance mapped to specific vendors and platforms.</span>
                </div>
                ${policies}
            </div>
        `;
    }

    renderImplSSP(guide) {
        const items = Object.entries(guide.sspStatements).map(([ctrl, text]) => `
            <div class="impl-ssp-item">
                <div class="impl-ssp-control">${ctrl}</div>
                <div class="impl-ssp-text">${text}</div>
                <button class="impl-copy-btn" data-action="copy-prev-sibling">
                    Copy
                </button>
            </div>
        `).join('');
        
        return `
            <div class="impl-section">
                <div class="impl-section-title">SSP Conformity Statements</div>
                <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:16px">Copy these statements directly into your System Security Plan (SSP).</p>
                <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;margin-bottom:16px;background:rgba(79,70,229,0.06);border:1px solid rgba(79,70,229,0.15);border-radius:8px;font-size:0.78rem;color:var(--text-secondary)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    <span>Detailed control-level implementation steps are available per vendor in the <strong>Assessment</strong> view — use those to validate and refine your SSP statements.</span>
                </div>
                ${items}
            </div>
        `;
    }

    renderImplServices(guide) {
        // Handle different data structures for each cloud
        let servicesHtml = '';
        let fedrampHtml = '';
        let servicesByFamilyHtml = '';
        
        // Services by Control Family (comprehensive view with native + third-party)
        if (guide.servicesByFamily) {
            const familyCards = Object.entries(guide.servicesByFamily).map(([family, data]) => {
                const nativeRows = data.native.map(s => `
                    <tr class="native-service-row">
                        <td><strong>${s.service}</strong></td>
                        <td><span class="service-type-badge native">${s.type}</span></td>
                        <td>${s.purpose}</td>
                    </tr>
                `).join('');
                
                const thirdPartyRows = data.thirdParty.map(s => `
                    <tr class="thirdparty-service-row">
                        <td><strong>${s.service}</strong></td>
                        <td><span class="service-type-badge">${s.type}</span></td>
                        <td><span class="fedramp-badge ${s.fedramp === 'High' ? 'high' : s.fedramp === 'Moderate' ? 'moderate' : 'na'}">${s.fedramp}</span></td>
                        <td><span class="asset-type-badge ${s.assetType.toLowerCase().replace(/\s+/g, '-')}">${s.assetType}</span></td>
                        <td>${s.purpose}</td>
                    </tr>
                `).join('');
                
                return `
                    <details class="service-family-card">
                        <summary class="service-family-header">
                            <span class="family-name">${family}</span>
                            <span class="family-counts">
                                <span class="native-count">${data.native.length} Native</span>
                                <span class="thirdparty-count">${data.thirdParty.length} Third-Party</span>
                            </span>
                        </summary>
                        <div class="service-family-content">
                            <div class="native-services-section">
                                <h4 class="services-subheader native-header">Native Cloud Services</h4>
                                <table class="impl-table compact">
                                    <thead><tr><th>Service</th><th>Type</th><th>Purpose</th></tr></thead>
                                    <tbody>${nativeRows}</tbody>
                                </table>
                            </div>
                            <div class="thirdparty-services-section">
                                <h4 class="services-subheader thirdparty-header">Third-Party Integrations</h4>
                                <table class="impl-table compact">
                                    <thead><tr><th>Service</th><th>Type</th><th>FedRAMP</th><th>Asset Type</th><th>Purpose</th></tr></thead>
                                    <tbody>${thirdPartyRows}</tbody>
                                </table>
                            </div>
                        </div>
                    </details>
                `;
            }).join('');
            
            servicesByFamilyHtml = `
                <div class="impl-section">
                    <div class="impl-section-title">Services by Control Family</div>
                    <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:16px">
                        Native cloud services and FedRAMP-authorized third-party integrations organized by CMMC control family. 
                        Click each family to expand and view available options.
                    </p>
                    <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;margin-bottom:16px;background:rgba(79,70,229,0.06);border:1px solid rgba(79,70,229,0.15);border-radius:8px;font-size:0.78rem;color:var(--text-secondary)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        <span>For detailed per-control configuration steps, see the <strong>Security Stack</strong> category or expand objectives in the <strong>Assessment</strong> view for vendor-specific CLI commands and Terraform examples.</span>
                    </div>
                    <div class="service-families-container">${familyCards}</div>
                </div>
            `;
        }
        
        // CUI Asset Types reference
        if (guide.cuiAssetTypes) {
            const assetRows = guide.cuiAssetTypes.map(a => `
                <tr>
                    <td><span class="asset-type-badge ${a.type.toLowerCase().replace(/\s+/g, '-')}">${a.type}</span></td>
                    <td>${a.description}</td>
                    <td style="font-size:0.7rem;color:var(--text-muted)">${a.examples}</td>
                </tr>
            `).join('');
            
            servicesByFamilyHtml += `
                <div class="impl-section">
                    <div class="impl-section-title">CUI Asset Categories</div>
                    <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px">
                        Categorize your systems using these asset types for your CMMC assessment scope.
                    </p>
                    <table class="impl-table">
                        <thead><tr><th>Asset Type</th><th>Description</th><th>Examples</th></tr></thead>
                        <tbody>${assetRows}</tbody>
                    </table>
                </div>
            `;
        }
        
        // AWS services (legacy format)
        if (guide.awsServices) {
            const rows = guide.awsServices.map(s => `
                <tr>
                    <td><strong>${s.control}</strong></td>
                    <td>${s.service}</td>
                    <td>${s.purpose}</td>
                </tr>
            `).join('');
            servicesHtml = `
                <div class="impl-section">
                    <div class="impl-section-title">AWS Services for CMMC Controls</div>
                    <table class="impl-table">
                        <thead><tr><th>Control</th><th>AWS Service</th><th>Purpose</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            `;
        }
        
        // GCP services (legacy format)
        if (guide.gcpServices) {
            const rows = guide.gcpServices.map(s => `
                <tr>
                    <td><strong>${s.control}</strong></td>
                    <td>${s.service}</td>
                    <td>${s.purpose}</td>
                </tr>
            `).join('');
            servicesHtml = `
                <div class="impl-section">
                    <div class="impl-section-title">GCP Services for CMMC Controls</div>
                    <table class="impl-table">
                        <thead><tr><th>Control</th><th>GCP Service</th><th>Purpose</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            `;
        }
        
        // M365 GCC High services (legacy format - now supplementary)
        if (guide.m365Services && !guide.servicesByFamily) {
            const rows = guide.m365Services.map(s => `
                <tr>
                    <td><strong>${s.control}</strong></td>
                    <td>${s.service}</td>
                    <td>${s.purpose}</td>
                </tr>
            `).join('');
            servicesHtml = `
                <div class="impl-section">
                    <div class="impl-section-title">M365 GCC High Services for CMMC</div>
                    <table class="impl-table">
                        <thead><tr><th>Control</th><th>M365 Service</th><th>Purpose</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            `;
        }
        
        // Azure Government services (legacy format - now supplementary)
        if (guide.azureGovServices && !guide.servicesByFamily) {
            const rows = guide.azureGovServices.map(s => `
                <tr>
                    <td><strong>${s.control}</strong></td>
                    <td>${s.service}</td>
                    <td>${s.purpose}</td>
                </tr>
            `).join('');
            servicesHtml += `
                <div class="impl-section">
                    <div class="impl-section-title">Azure Government Services for CMMC</div>
                    <table class="impl-table">
                        <thead><tr><th>Control</th><th>Azure Gov Service</th><th>Purpose</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            `;
        }
        
        // Azure sensitivity labels (only for Azure)
        if (guide.sensitivityLabels) {
            const rows = guide.sensitivityLabels.map(l => `
                <tr>
                    <td><strong>${l.name}</strong></td>
                    <td>${l.displayName}</td>
                    <td>${l.encryption}</td>
                    <td>${l.marking}</td>
                    <td>${l.audience}</td>
                </tr>
            `).join('');
            servicesHtml += `
                <div class="impl-section">
                    <div class="impl-section-title">Sensitivity Label Taxonomy (Purview)</div>
                    <table class="impl-table">
                        <thead><tr><th>Label</th><th>Display Name</th><th>Encryption</th><th>Visual Marking</th><th>Audience</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            `;
            
            if (guide.conditionalAccessPolicies) {
                const caRows = guide.conditionalAccessPolicies.map(p => `
                    <tr>
                        <td><strong>${p.name}</strong>${p.critical ? ' <span style="color:#ef4444">*</span>' : ''}</td>
                        <td>${p.description}</td>
                        <td>${p.reason}</td>
                    </tr>
                `).join('');
                servicesHtml += `
                    <div class="impl-section">
                        <div class="impl-section-title">Conditional Access Policies to Deploy</div>
                        <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:8px"><span style="color:#ef4444">*</span> = Critical for ITAR/CMMC compliance</p>
                        <table class="impl-table">
                            <thead><tr><th>Policy Name</th><th>Description</th><th>Reason</th></tr></thead>
                            <tbody>${caRows}</tbody>
                        </table>
                    </div>
                `;
            }
        }
        
        // FedRAMP services (AWS/GCP)
        if (guide.fedrampServices) {
            const rows = guide.fedrampServices.map(s => `
                <tr>
                    <td><strong>${s.category}</strong></td>
                    <td>${s.service}</td>
                    <td>${s.authorization}</td>
                </tr>
            `).join('');
            fedrampHtml = `
                <div class="impl-section">
                    <div class="impl-section-title">FedRAMP Authorized Services</div>
                    <table class="impl-table">
                        <thead><tr><th>Category</th><th>Service</th><th>Authorization</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            `;
        }
        
        // FedRAMP providers (Azure)
        if (guide.fedrampProviders) {
            const rows = guide.fedrampProviders.map(p => `
                <tr>
                    <td><strong>${p.category}</strong></td>
                    <td>${p.provider}</td>
                    <td>${p.notes}</td>
                </tr>
            `).join('');
            fedrampHtml = `
                <div class="impl-section">
                    <div class="impl-section-title">FedRAMP Authorized Providers</div>
                    <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:16px">Third-party providers to extend capabilities while maintaining compliance.</p>
                    <table class="impl-table">
                        <thead><tr><th>Category</th><th>Recommended Provider</th><th>Notes</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            `;
        }
        
        return servicesByFamilyHtml + servicesHtml + fedrampHtml || '<p style="color:var(--text-muted)">No services data available.</p>';
    }

    renderImplArchitecture() {
        const guidance = typeof ENCLAVE_GUIDANCE !== 'undefined' ? ENCLAVE_GUIDANCE : null;
        if (!guidance) return '<p style="padding:20px;color:var(--text-muted)">Architecture guidance not available.</p>';

        const currentCloud = this.implGuideCloud || 'azure';
        
        // SVG icons for subsections (stroke-based)
        const icons = {
            'arch-decision': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
            'arch-patterns': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18v-7"></path><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"></path><path d="M14 18v-7"></path><path d="M18 18v-7"></path><path d="M3 22h18"></path><path d="M6 18v-7"></path></svg>',
            'vdi-comparison': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
            'cost-optimization': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
            'network-arch': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
            'integration-patterns': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
            'user-personas': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
            'endpoint-strategy': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
            'impl-checklist': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            'cloud-security': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
            'avd-deep-dive': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
            'citrix-deep-dive': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
            'vmware-deep-dive': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
            'fslogix-deep-dive': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
            'persistent-analysis': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
            'cmmc-vdi-docs': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
            'cost-deep-dive': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
            'endpoints-deep-dive': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
            'ref-architectures': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>'
        };
        
        // Build subsection navigation
        const subsections = [
            { id: 'arch-decision', name: 'Decision Framework' },
            { id: 'arch-patterns', name: 'Architecture Patterns' },
            { id: 'vdi-comparison', name: 'VDI Platforms' },
            { id: 'cost-optimization', name: 'Cost Optimization' },
            { id: 'network-arch', name: 'Network Architecture' },
            { id: 'integration-patterns', name: 'Integration Patterns' },
            { id: 'user-personas', name: 'User Personas' },
            { id: 'endpoint-strategy', name: 'Endpoint Strategy' },
            { id: 'impl-checklist', name: 'Implementation Checklist' },
            { id: 'cloud-security', name: 'Cloud Security (SPA)' }
        ];
        
        // Add VDI deep dive sections if available
        if (guidance.vdiDeepDive?.avd) subsections.push({ id: 'avd-deep-dive', name: 'AVD Deep Dive' });
        if (guidance.vdiDeepDive?.citrix) subsections.push({ id: 'citrix-deep-dive', name: 'Citrix Deep Dive' });
        if (guidance.vdiDeepDive?.vmwareHorizon) subsections.push({ id: 'vmware-deep-dive', name: 'VMware Horizon' });
        if (guidance.fslogixDeepDive) subsections.push({ id: 'fslogix-deep-dive', name: 'FSLogix Profiles' });
        if (guidance.persistentVsNonPersistent) subsections.push({ id: 'persistent-analysis', name: 'Persistent vs Non-Persistent' });
        if (guidance.cmmcVdiDocumentation) subsections.push({ id: 'cmmc-vdi-docs', name: 'CMMC VDI Documentation' });
        if (guidance.costManagementDeepDive) subsections.push({ id: 'cost-deep-dive', name: 'Cost Management' });
        if (guidance.vdiEndpointsDeepDive) subsections.push({ id: 'endpoints-deep-dive', name: 'VDI Endpoints' });
        
        // Navigation and search
        let html = `
            <div class="extras-nav-container">
                <div class="extras-search-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" id="arch-search-input" placeholder="Search in Reference Architecture..." class="extras-search-input">
                </div>
                <div class="extras-subsection-nav arch-grid">
                    ${subsections.map(s => `<button class="extras-nav-btn" data-scroll-to="${s.id}"><span class="extras-nav-icon">${icons[s.id] || ''}</span><span class="extras-nav-label">${s.name}</span></button>`).join('')}
                </div>
            </div>
        `;

        // Start grid container for sections
        html += `<div class="extras-sections-grid">`;

        // Architecture Options
        html += `<div class="impl-section extras-collapsible" id="arch-decision">
            <div class="impl-section-title"><span class="section-icon">${icons['arch-decision']}</span><span class="section-title-text">Architecture Decision Framework</span></div>
            <div class="section-content">
                <div class="impl-table-container">
                    <table class="impl-table">
                        <thead><tr><th>Pattern</th><th>Description</th><th>Best For</th><th>Cost</th><th>Timeline</th></tr></thead>
                        <tbody>
                            ${guidance.architectureOptions.map(opt => `
                                <tr>
                                    <td><strong>${opt.pattern}</strong></td>
                                    <td>${opt.description}</td>
                                    <td>${opt.bestFor}</td>
                                    <td>${opt.costProfile}</td>
                                    <td>${opt.timeToImplement}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;

        // Pros/Cons Detail
        html += `<div class="impl-section extras-collapsible" id="arch-patterns">
            <div class="impl-section-title"><span class="section-icon">${icons['arch-patterns']}</span><span class="section-title-text">Architecture Pattern Details</span></div>
            <div class="section-content">
                <div class="impl-cards-grid">
                    ${guidance.architectureOptions.map(opt => `
                        <div class="impl-policy-card">
                            <div class="impl-policy-header"><h4>${opt.pattern}</h4></div>
                            <div class="impl-policy-body">
                                <div style="margin-bottom:12px">
                                    <strong style="color:var(--accent-green)">Pros:</strong>
                                    <ul style="margin:4px 0 0 16px;font-size:0.75rem">${opt.pros.map(p => `<li>${p}</li>`).join('')}</ul>
                                </div>
                                <div>
                                    <strong style="color:var(--accent-orange)">Cons:</strong>
                                    <ul style="margin:4px 0 0 16px;font-size:0.75rem">${opt.cons.map(c => `<li>${c}</li>`).join('')}</ul>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;

        // VDI Platform Comparison
        html += `<div class="impl-section extras-collapsible" id="vdi-comparison">
            <div class="impl-section-title"><span class="section-icon">${icons['vdi-comparison']}</span><span class="section-title-text">VDI Platform Comparison</span></div>
            <div class="section-content">
                <div class="impl-cards-grid">
                    ${Object.values(guidance.vdiPlatforms).map(platform => `
                        <div class="impl-policy-card">
                            <div class="impl-policy-header">
                                <h4>${platform.name}</h4>
                                <span class="impl-phase-badge governance">${platform.fedrampStatus}</span>
                            </div>
                            <div class="impl-policy-body">
                                <p style="font-size:0.7rem;color:var(--text-muted);margin-bottom:8px">${platform.environment}</p>
                                <div style="margin-bottom:8px">
                                    <strong style="font-size:0.7rem">Strengths:</strong>
                                    <ul style="margin:4px 0 0 16px;font-size:0.7rem">${platform.strengths.slice(0, 4).map(s => `<li>${s}</li>`).join('')}</ul>
                                </div>
                                <div style="margin-bottom:8px">
                                    <strong style="font-size:0.7rem">Typical Cost:</strong>
                                    <span style="font-size:0.7rem;color:var(--accent-blue)">${platform.typicalCosts.perUser}</span>
                                </div>
                                <div style="font-size:0.65rem;color:var(--text-muted)">Best for: ${platform.bestFor}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;

        // Cost Optimization
        html += `<div class="impl-section extras-collapsible" id="cost-optimization">
            <div class="impl-section-title"><span class="section-icon">${icons['cost-optimization']}</span><span class="section-title-text">Cost Optimization Strategies</span></div>
            <div class="section-content">
                <div class="impl-table-container">
                    <table class="impl-table">
                        <thead><tr><th>Category</th><th>Strategy</th><th>Description</th></tr></thead>
                        <tbody>
                            ${guidance.costOptimization.flatMap(cat => 
                                cat.strategies.map((s, i) => `
                                    <tr>
                                        ${i === 0 ? `<td rowspan="${cat.strategies.length}"><strong>${cat.category}</strong></td>` : ''}
                                        <td>${s.name}</td>
                                        <td>${s.description}</td>
                                    </tr>
                                `)
                            ).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;

        // Network Architecture Components
        html += `<div class="impl-section extras-collapsible" id="network-arch">
            <div class="impl-section-title"><span class="section-icon">${icons['network-arch']}</span><span class="section-title-text">Enclave Network Architecture</span></div>
            <div class="section-content">
                <div class="impl-table-container">
                    <table class="impl-table">
                        <thead><tr><th>Component</th><th>Purpose</th><th>Options</th><th>CMMC Relevance</th></tr></thead>
                        <tbody>
                            ${guidance.networkArchitecture.components.map(comp => `
                                <tr>
                                    <td><strong>${comp.name}</strong></td>
                                    <td>${comp.purpose}</td>
                                    <td style="font-size:0.7rem">${comp.options.join(', ')}</td>
                                    <td style="font-size:0.65rem;color:var(--text-muted)">${comp.cmmcRelevance}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;

        // Integration Patterns
        html += `<div class="impl-section extras-collapsible" id="integration-patterns">
            <div class="impl-section-title"><span class="section-icon">${icons['integration-patterns']}</span><span class="section-title-text">Integration Patterns</span></div>
            <div class="section-content">
                <div class="impl-cards-grid">
                    ${guidance.integrationPatterns.map(pattern => `
                        <div class="impl-policy-card">
                            <div class="impl-policy-header"><h4>${pattern.pattern}</h4></div>
                            <div class="impl-policy-body">
                                <p style="font-size:0.75rem;margin-bottom:8px">${pattern.description}</p>
                                <div style="margin-bottom:8px">
                                    <strong style="font-size:0.7rem">Implementation:</strong>
                                    <ul style="margin:4px 0 0 16px;font-size:0.7rem">${pattern.implementation.map(i => `<li>${i}</li>`).join('')}</ul>
                                </div>
                                <div style="font-size:0.65rem;color:var(--accent-orange)">
                                    <strong>Security:</strong> ${pattern.securityConsiderations}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;

        // User Personas
        html += `<div class="impl-section extras-collapsible" id="user-personas">
            <div class="impl-section-title"><span class="section-icon">${icons['user-personas']}</span><span class="section-title-text">User Personas & Sizing</span></div>
            <div class="section-content">
                <div class="impl-table-container">
                    <table class="impl-table">
                        <thead><tr><th>Persona</th><th>Description</th><th>Typical Apps</th><th>Recommended Specs</th><th>Users/Host</th></tr></thead>
                        <tbody>
                            ${guidance.userPersonas.map(p => `
                                <tr>
                                    <td><strong>${p.persona}</strong></td>
                                    <td>${p.description}</td>
                                    <td style="font-size:0.7rem">${p.typicalApps.join(', ')}</td>
                                    <td style="font-size:0.7rem">${p.recommendedSpecs.general}</td>
                                    <td>${p.usersPerHost}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;

        // Endpoint Strategy
        html += `<div class="impl-section extras-collapsible" id="endpoint-strategy">
            <div class="impl-section-title"><span class="section-icon">${icons['endpoint-strategy']}</span><span class="section-title-text">Endpoint Strategy</span></div>
            <div class="section-content">
                <div class="impl-cards-grid">
                ${guidance.endpointStrategy.options.map(opt => `
                    <div class="impl-policy-card">
                        <div class="impl-policy-header"><h4>${opt.type}</h4></div>
                        <div class="impl-policy-body">
                            <p style="font-size:0.75rem;margin-bottom:8px">${opt.description}</p>
                            <p style="font-size:0.65rem;color:var(--text-muted);margin-bottom:8px">Examples: ${opt.examples.join(', ')}</p>
                            <div style="display:flex;gap:16px;margin-bottom:8px">
                                <div>
                                    <strong style="font-size:0.65rem;color:var(--accent-green)">Pros:</strong>
                                    <ul style="margin:2px 0 0 12px;font-size:0.65rem">${opt.pros.map(p => `<li>${p}</li>`).join('')}</ul>
                                </div>
                                <div>
                                    <strong style="font-size:0.65rem;color:var(--accent-orange)">Cons:</strong>
                                    <ul style="margin:2px 0 0 12px;font-size:0.65rem">${opt.cons.map(c => `<li>${c}</li>`).join('')}</ul>
                                </div>
                            </div>
                            <div style="font-size:0.65rem;color:var(--accent-blue)">
                                <strong>CMMC:</strong> ${opt.cmmcConsiderations}
                            </div>
                        </div>
                    </div>
                `).join('')}
                </div>
            </div>
        </div>`;

        // Implementation Checklist
        html += `<div class="impl-section extras-collapsible" id="impl-checklist">
            <div class="impl-section-title"><span class="section-icon">${icons['impl-checklist']}</span><span class="section-title-text">Implementation Checklist</span></div>
            <div class="section-content">
                ${Object.values(guidance.implementationChecklist).map(phase => `
                    <div class="impl-policy-card" style="margin-bottom:12px">
                        <div class="impl-policy-header"><h4>${phase.name}</h4></div>
                        <div class="impl-policy-body">
                            <table class="impl-table" style="margin:0">
                                <thead><tr><th>Task</th><th>Deliverable</th></tr></thead>
                                <tbody>
                                    ${phase.tasks.map(t => `<tr><td>${t.task}</td><td style="color:var(--text-muted)">${t.deliverable}</td></tr>`).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;

        // Reference Architectures
        html += `<div class="impl-section extras-collapsible" id="ref-architectures">
            <div class="impl-section-title"><span class="section-icon">${icons['ref-architectures']}</span><span class="section-title-text">Reference Architectures</span></div>
            <div class="section-content">
                <div class="impl-cards-grid">
                    ${guidance.networkArchitecture.referenceArchitectures.map(ref => `
                        <div class="impl-policy-card">
                            <div class="impl-policy-header"><h4>${ref.name}</h4></div>
                            <div class="impl-policy-body">
                                <p style="font-size:0.75rem;margin-bottom:8px">${ref.description}</p>
                                <a href="${ref.url}" target="_blank" rel="noopener noreferrer" style="font-size:0.7rem;color:var(--accent-blue)">View Documentation →</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;

        // =============================================
        // VDI DEEP DIVE SECTIONS
        // =============================================

        if (guidance.vdiDeepDive) {
            // AVD Deep Dive
            if (guidance.vdiDeepDive.avd) {
                const avd = guidance.vdiDeepDive.avd;
                html += `<div class="impl-section extras-collapsible" id="avd-deep-dive">
                    <div class="impl-section-title"><span class="section-icon">${icons['avd-deep-dive']}</span><span class="section-title-text">${avd.name} - Deep Configuration</span></div>
                    <div class="section-content">
                    <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:16px">${avd.overview}</p>
                    
                    <!-- Deployment Options -->
                    <div class="impl-cards-grid" style="margin-bottom:20px">
                        <div class="impl-policy-card">
                            <div class="impl-policy-header" style="background:var(--accent-blue)"><h4>${avd.deploymentOptions.pooled.name}</h4></div>
                            <div class="impl-policy-body">
                                <p style="font-size:0.75rem;margin-bottom:8px">${avd.deploymentOptions.pooled.description}</p>
                                <p style="font-size:0.7rem"><strong>Best For:</strong> ${avd.deploymentOptions.pooled.bestFor}</p>
                                <p style="font-size:0.7rem"><strong>OS:</strong> ${avd.deploymentOptions.pooled.sessionHostOS}</p>
                                <p style="font-size:0.7rem"><strong>Density:</strong> ${avd.deploymentOptions.pooled.maxUsersPerHost}</p>
                                <p style="font-size:0.65rem;color:var(--accent-orange)"><strong>Profile:</strong> ${avd.deploymentOptions.pooled.profileRequirement}</p>
                            </div>
                        </div>
                        <div class="impl-policy-card">
                            <div class="impl-policy-header" style="background:var(--accent-purple)"><h4>${avd.deploymentOptions.personal.name}</h4></div>
                            <div class="impl-policy-body">
                                <p style="font-size:0.75rem;margin-bottom:8px">${avd.deploymentOptions.personal.description}</p>
                                <p style="font-size:0.7rem"><strong>Best For:</strong> ${avd.deploymentOptions.personal.bestFor}</p>
                                <p style="font-size:0.7rem"><strong>OS:</strong> ${avd.deploymentOptions.personal.sessionHostOS}</p>
                                <p style="font-size:0.7rem"><strong>Cost Control:</strong> ${avd.deploymentOptions.personal.autoStartStop}</p>
                                <p style="font-size:0.65rem;color:var(--accent-green)"><strong>Profile:</strong> ${avd.deploymentOptions.personal.profileRequirement}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Security Configuration -->
                    <h4 style="margin:16px 0 8px;color:var(--accent-orange)">Security Configuration</h4>
                    
                    <!-- RDP Properties -->
                    <div class="impl-table-container" style="margin-bottom:16px">
                        <table class="impl-table">
                            <thead><tr><th>RDP Property</th><th>Purpose</th></tr></thead>
                            <tbody>
                                ${avd.securityConfiguration.rdpProperties.map(p => `
                                    <tr style="${p.purpose.includes('DISABLE') ? 'background:rgba(255,100,100,0.1)' : ''}">
                                        <td><code style="font-size:0.7rem">${p.property}</code></td>
                                        <td style="font-size:0.7rem">${p.purpose}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Conditional Access -->
                    <div class="impl-table-container" style="margin-bottom:16px">
                        <table class="impl-table">
                            <thead><tr><th>Conditional Access Policy</th><th>Target</th><th>Setting</th></tr></thead>
                            <tbody>
                                ${avd.securityConfiguration.conditionalAccess.map(ca => `
                                    <tr>
                                        <td><strong style="font-size:0.75rem">${ca.policy}</strong></td>
                                        <td style="font-size:0.7rem">${ca.target}</td>
                                        <td style="font-size:0.7rem">${ca.setting}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Baseline Hardening -->
                    <h4 style="margin:16px 0 8px;color:var(--accent-green)">Baseline Hardening</h4>
                    <div class="impl-cards-grid" style="margin-bottom:16px">
                        <div class="impl-policy-card">
                            <div class="impl-policy-header"><h4>${avd.baselineHardening.stig.name}</h4></div>
                            <div class="impl-policy-body">
                                <p style="font-size:0.75rem;margin-bottom:8px">${avd.baselineHardening.stig.description}</p>
                                <p style="font-size:0.7rem"><strong>Tools:</strong> ${avd.baselineHardening.stig.automationTools.join(', ')}</p>
                                <ul style="font-size:0.65rem;margin:8px 0 0 16px">${avd.baselineHardening.stig.keySettings.map(s => `<li>${s}</li>`).join('')}</ul>
                            </div>
                        </div>
                        <div class="impl-policy-card">
                            <div class="impl-policy-header"><h4>${avd.baselineHardening.cis.name}</h4></div>
                            <div class="impl-policy-body">
                                <p style="font-size:0.75rem;margin-bottom:8px">${avd.baselineHardening.cis.description}</p>
                                <p style="font-size:0.7rem"><strong>Levels:</strong> ${avd.baselineHardening.cis.levels.join(', ')}</p>
                                <p style="font-size:0.7rem"><strong>Tools:</strong> ${avd.baselineHardening.cis.automationTools.join(', ')}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Image Management -->
                    <h4 style="margin:16px 0 8px;color:var(--accent-purple)">Golden Image Management</h4>
                    <div class="impl-policy-card" style="margin-bottom:16px">
                        <div class="impl-policy-header"><h4>Golden Image Components</h4></div>
                        <div class="impl-policy-body">
                            <ul style="font-size:0.75rem;columns:2;column-gap:24px">${avd.imageManagement.goldenImage.components.map(c => `<li style="margin-bottom:4px">${c}</li>`).join('')}</ul>
                            <p style="font-size:0.7rem;margin-top:12px"><strong>Update Strategy:</strong> ${avd.imageManagement.goldenImage.updateStrategy}</p>
                            <p style="font-size:0.7rem"><strong>Automation Tools:</strong> ${avd.imageManagement.goldenImage.tools.map(t => t.name).join(', ')}</p>
                        </div>
                    </div>

                    <!-- CMMC Documentation -->
                    <h4 style="margin:16px 0 8px;color:var(--accent-blue)">CMMC Documentation Artifacts</h4>
                    <div class="impl-table-container">
                        <table class="impl-table">
                            <thead><tr><th>Artifact</th><th>Description</th><th>Controls</th></tr></thead>
                            <tbody>
                                ${avd.cmmcDocumentation.map(doc => `
                                    <tr>
                                        <td><strong>${doc.artifact}</strong></td>
                                        <td style="font-size:0.7rem">${doc.description}</td>
                                        <td style="font-size:0.65rem;color:var(--text-muted)">${doc.controls}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    </div>
                </div>`;
            }

            // Citrix Deep Dive
            if (guidance.vdiDeepDive.citrix) {
                const citrix = guidance.vdiDeepDive.citrix;
                html += `<div class="impl-section extras-collapsible" id="citrix-deep-dive">
                    <div class="impl-section-title"><span class="section-icon">${icons['citrix-deep-dive']}</span><span class="section-title-text">${citrix.name} - Deep Configuration</span></div>
                    <div class="section-content">
                    <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:16px">${citrix.overview}</p>

                    <!-- Deployment Options -->
                    <div class="impl-cards-grid" style="margin-bottom:20px">
                        ${Object.values(citrix.deploymentOptions).map(opt => `
                            <div class="impl-policy-card">
                                <div class="impl-policy-header"><h4>${opt.name}</h4></div>
                                <div class="impl-policy-body">
                                    <p style="font-size:0.75rem;margin-bottom:8px">${opt.description}</p>
                                    ${opt.components ? `<p style="font-size:0.7rem"><strong>Components:</strong> ${opt.components.join(', ')}</p>` : ''}
                                    ${opt.gccHighSupport ? `<p style="font-size:0.65rem;color:var(--accent-green)">${opt.gccHighSupport}</p>` : ''}
                                    ${opt.advantages ? `<p style="font-size:0.7rem"><strong>Advantages:</strong> ${opt.advantages.join(', ')}</p>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Security Policies -->
                    <h4 style="margin:16px 0 8px;color:var(--accent-orange)">Security Policies</h4>
                    <div class="impl-table-container" style="margin-bottom:16px">
                        <table class="impl-table">
                            <thead><tr><th>Policy</th><th>Setting</th><th>Purpose</th></tr></thead>
                            <tbody>
                                ${citrix.securityConfiguration.policies.map(p => `
                                    <tr style="${p.setting.includes('Disable') ? 'background:rgba(255,100,100,0.1)' : ''}">
                                        <td><strong>${p.policy}</strong></td>
                                        <td style="font-size:0.7rem">${p.setting}</td>
                                        <td style="font-size:0.7rem">${p.purpose}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Profile Management -->
                    <h4 style="margin:16px 0 8px;color:var(--accent-purple)">Profile Management Options</h4>
                    <div class="impl-cards-grid">
                        <div class="impl-policy-card">
                            <div class="impl-policy-header"><h4>${citrix.profileManagement.citrixProfileManagement.name}</h4></div>
                            <div class="impl-policy-body">
                                <p style="font-size:0.75rem;margin-bottom:8px">${citrix.profileManagement.citrixProfileManagement.description}</p>
                                <ul style="font-size:0.7rem;margin:8px 0 0 16px">${citrix.profileManagement.citrixProfileManagement.features.map(f => `<li>${f}</li>`).join('')}</ul>
                                <p style="font-size:0.7rem;margin-top:8px"><strong>Storage:</strong> ${citrix.profileManagement.citrixProfileManagement.storageOptions.join(', ')}</p>
                            </div>
                        </div>
                        <div class="impl-policy-card">
                            <div class="impl-policy-header"><h4>${citrix.profileManagement.fslogixWithCitrix.name}</h4></div>
                            <div class="impl-policy-body">
                                <p style="font-size:0.75rem;margin-bottom:8px">${citrix.profileManagement.fslogixWithCitrix.description}</p>
                                <ul style="font-size:0.7rem;margin:8px 0 0 16px">${citrix.profileManagement.fslogixWithCitrix.advantages.map(a => `<li>${a}</li>`).join('')}</ul>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>`;
            }

            // VMware Horizon Deep Dive
            if (guidance.vdiDeepDive.vmwareHorizon) {
                const vmware = guidance.vdiDeepDive.vmwareHorizon;
                html += `<div class="impl-section extras-collapsible" id="vmware-deep-dive">
                    <div class="impl-section-title"><span class="section-icon">${icons['vmware-deep-dive']}</span><span class="section-title-text">${vmware.name} - Deep Configuration</span></div>
                    <div class="section-content">
                    <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:16px">${vmware.overview}</p>

                    <!-- UAG Security -->
                    <h4 style="margin:16px 0 8px;color:var(--accent-green)">Unified Access Gateway (UAG)</h4>
                    <div class="impl-policy-card" style="margin-bottom:16px">
                        <div class="impl-policy-header"><h4>${vmware.securityConfiguration.uag.name}</h4></div>
                        <div class="impl-policy-body">
                            <p style="font-size:0.75rem;margin-bottom:8px">${vmware.securityConfiguration.uag.description}</p>
                            <div style="display:flex;gap:24px">
                                <div>
                                    <strong style="font-size:0.7rem">Features:</strong>
                                    <ul style="font-size:0.7rem;margin:4px 0 0 16px">${vmware.securityConfiguration.uag.features.map(f => `<li>${f}</li>`).join('')}</ul>
                                </div>
                                <div>
                                    <strong style="font-size:0.7rem">Hardening:</strong>
                                    <ul style="font-size:0.7rem;margin:4px 0 0 16px">${vmware.securityConfiguration.uag.hardening.map(h => `<li>${h}</li>`).join('')}</ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Desktop Policies -->
                    <div class="impl-table-container">
                        <table class="impl-table">
                            <thead><tr><th>Policy</th><th>Setting</th><th>Purpose</th></tr></thead>
                            <tbody>
                                ${vmware.securityConfiguration.desktopPolicies.map(p => `
                                    <tr>
                                        <td><strong>${p.policy}</strong></td>
                                        <td style="font-size:0.7rem">${p.setting}</td>
                                        <td style="font-size:0.7rem">${p.purpose}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    </div>
                </div>`;
            }
        }

        // =============================================
        // FSLOGIX DEEP DIVE
        // =============================================
        if (guidance.fslogixDeepDive) {
            const fsl = guidance.fslogixDeepDive;
            html += `<div class="impl-section extras-collapsible" id="fslogix-deep-dive">
                <div class="impl-section-title"><span class="section-icon">${icons['fslogix-deep-dive']}</span><span class="section-title-text">FSLogix Profile Management</span></div>
                <div class="section-content">
                <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px">${fsl.overview.description}</p>
                <p style="font-size:0.75rem;margin-bottom:16px"><strong>Licensing:</strong> ${fsl.overview.licensing}</p>

                <!-- Components -->
                <div class="impl-cards-grid" style="margin-bottom:20px">
                    ${fsl.overview.components.map(c => `
                        <div class="impl-policy-card" style="padding:12px">
                            <strong style="font-size:0.8rem">${c.name}</strong>
                            <p style="font-size:0.7rem;color:var(--text-muted);margin-top:4px">${c.description}</p>
                        </div>
                    `).join('')}
                </div>

                <!-- Registry Settings -->
                <h4 style="margin:16px 0 8px;color:var(--accent-purple)">Profile Container Registry Settings</h4>
                <div class="impl-table-container" style="margin-bottom:16px">
                    <table class="impl-table">
                        <thead><tr><th>Registry Key</th><th>Value</th><th>Data</th><th>Description</th></tr></thead>
                        <tbody>
                            ${fsl.profileContainerConfig.registrySettings.map(r => `
                                <tr>
                                    <td style="font-size:0.65rem;font-family:monospace">${r.key}</td>
                                    <td><code>${r.value}</code></td>
                                    <td><code>${r.data}</code></td>
                                    <td style="font-size:0.7rem">${r.description}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Storage Options -->
                <h4 style="margin:16px 0 8px;color:var(--accent-blue)">Storage Options</h4>
                <div class="impl-cards-grid" style="margin-bottom:16px">
                    ${Object.values(fsl.storageOptions).map(opt => `
                        <div class="impl-policy-card">
                            <div class="impl-policy-header"><h4>${opt.name}</h4></div>
                            <div class="impl-policy-body">
                                <p style="font-size:0.75rem;margin-bottom:8px">${opt.description}</p>
                                ${opt.tiers ? `<p style="font-size:0.7rem"><strong>Tiers:</strong> ${Array.isArray(opt.tiers) ? opt.tiers.map(t => typeof t === 'object' ? t.tier : t).join(', ') : opt.tiers}</p>` : ''}
                                ${opt.advantages ? `<ul style="font-size:0.7rem;margin:8px 0 0 16px">${opt.advantages.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
                                ${opt.bestFor ? `<p style="font-size:0.65rem;color:var(--text-muted);margin-top:8px">${opt.bestFor}</p>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Troubleshooting -->
                <h4 style="margin:16px 0 8px;color:var(--accent-orange)">Common Issues & Troubleshooting</h4>
                <div class="impl-table-container">
                    <table class="impl-table">
                        <thead><tr><th>Issue</th><th>Cause</th><th>Solution</th></tr></thead>
                        <tbody>
                            ${fsl.troubleshooting.commonIssues.map(i => `
                                <tr>
                                    <td><strong>${i.issue}</strong></td>
                                    <td style="font-size:0.7rem">${i.cause}</td>
                                    <td style="font-size:0.7rem">${i.solution}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                </div>
            </div>`;
        }

        // =============================================
        // PERSISTENT VS NON-PERSISTENT
        // =============================================
        if (guidance.persistentVsNonPersistent) {
            const pvnp = guidance.persistentVsNonPersistent;
            html += `<div class="impl-section extras-collapsible" id="persistent-analysis">
                <div class="impl-section-title"><span class="section-icon">${icons['persistent-analysis']}</span><span class="section-title-text">Persistent vs Non-Persistent</span></div>
                <div class="section-content">

                <!-- Comparison Cards -->
                <div class="impl-cards-grid" style="margin-bottom:20px">
                    <div class="impl-policy-card">
                        <div class="impl-policy-header" style="background:var(--accent-purple)"><h4>${pvnp.comparison.persistent.name}</h4></div>
                        <div class="impl-policy-body">
                            <p style="font-size:0.75rem;margin-bottom:8px">${pvnp.comparison.persistent.description}</p>
                            <p style="font-size:0.7rem"><strong>Architecture:</strong> ${pvnp.comparison.persistent.architecture}</p>
                            <p style="font-size:0.7rem"><strong>Profiles:</strong> ${pvnp.comparison.persistent.profileManagement}</p>
                            <div style="margin:12px 0">
                                <strong style="color:var(--accent-green);font-size:0.7rem">Pros:</strong>
                                <ul style="font-size:0.65rem;margin:4px 0 0 16px">${pvnp.comparison.persistent.pros.map(p => `<li>${p}</li>`).join('')}</ul>
                            </div>
                            <div>
                                <strong style="color:var(--accent-orange);font-size:0.7rem">Cons:</strong>
                                <ul style="font-size:0.65rem;margin:4px 0 0 16px">${pvnp.comparison.persistent.cons.map(c => `<li>${c}</li>`).join('')}</ul>
                            </div>
                            <div style="margin-top:12px;padding:8px;background:var(--bg-secondary);border-radius:4px">
                                <strong style="font-size:0.7rem">Cost Example:</strong>
                                <p style="font-size:0.65rem">${pvnp.comparison.persistent.costModel.example}</p>
                            </div>
                        </div>
                    </div>
                    <div class="impl-policy-card">
                        <div class="impl-policy-header" style="background:var(--accent-blue)"><h4>${pvnp.comparison.nonPersistent.name}</h4></div>
                        <div class="impl-policy-body">
                            <p style="font-size:0.75rem;margin-bottom:8px">${pvnp.comparison.nonPersistent.description}</p>
                            <p style="font-size:0.7rem"><strong>Architecture:</strong> ${pvnp.comparison.nonPersistent.architecture}</p>
                            <p style="font-size:0.7rem"><strong>Profiles:</strong> ${pvnp.comparison.nonPersistent.profileManagement}</p>
                            <div style="margin:12px 0">
                                <strong style="color:var(--accent-green);font-size:0.7rem">Pros:</strong>
                                <ul style="font-size:0.65rem;margin:4px 0 0 16px">${pvnp.comparison.nonPersistent.pros.map(p => `<li>${p}</li>`).join('')}</ul>
                            </div>
                            <div>
                                <strong style="color:var(--accent-orange);font-size:0.7rem">Cons:</strong>
                                <ul style="font-size:0.65rem;margin:4px 0 0 16px">${pvnp.comparison.nonPersistent.cons.map(c => `<li>${c}</li>`).join('')}</ul>
                            </div>
                            <div style="margin-top:12px;padding:8px;background:var(--bg-secondary);border-radius:4px">
                                <strong style="font-size:0.7rem">Cost Example:</strong>
                                <p style="font-size:0.65rem">${pvnp.comparison.nonPersistent.costModel.example}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cost-Benefit Factors -->
                <h4 style="margin:16px 0 8px">Cost-Benefit Analysis by Factor</h4>
                <div class="impl-table-container" style="margin-bottom:16px">
                    <table class="impl-table">
                        <thead><tr><th>Factor</th><th>Persistent</th><th>Non-Persistent</th><th>Guidance</th></tr></thead>
                        <tbody>
                            ${pvnp.costBenefitAnalysis.factors.map(f => `
                                <tr>
                                    <td><strong>${f.factor}</strong></td>
                                    <td style="font-size:0.7rem">${f.persistent}</td>
                                    <td style="font-size:0.7rem">${f.nonPersistent}</td>
                                    <td style="font-size:0.7rem;color:var(--accent-blue)">${f.guidance || f.breakeven}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Recommendations -->
                <h4 style="margin:16px 0 8px">Recommendations by Scenario</h4>
                <div class="impl-cards-grid">
                    ${pvnp.costBenefitAnalysis.recommendations.map(r => `
                        <div class="impl-policy-card" style="padding:12px">
                            <strong style="font-size:0.8rem">${r.scenario}</strong>
                            <p style="font-size:0.75rem;color:var(--accent-green);margin:4px 0">${r.recommendation}</p>
                            <p style="font-size:0.65rem;color:var(--text-muted)">${r.reasoning}</p>
                        </div>
                    `).join('')}
                </div>

                <!-- Hybrid Approach -->
                <h4 style="margin:20px 0 8px;color:var(--accent-purple)">Hybrid Pool Strategy</h4>
                <p style="font-size:0.75rem;margin-bottom:12px">${pvnp.hybridApproach.description}</p>
                <div class="impl-table-container">
                    <table class="impl-table">
                        <thead><tr><th>Pool</th><th>Type</th><th>Users</th><th>Density</th><th>Profile</th></tr></thead>
                        <tbody>
                            ${pvnp.hybridApproach.implementation.map(p => `
                                <tr>
                                    <td><strong>${p.pool}</strong></td>
                                    <td style="font-size:0.7rem">${p.type}</td>
                                    <td style="font-size:0.7rem">${p.users}</td>
                                    <td style="font-size:0.7rem">${p.density}</td>
                                    <td style="font-size:0.7rem">${p.profile}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>`;
        }

        // =============================================
        // CMMC VDI DOCUMENTATION
        // =============================================
        if (guidance.cmmcVdiDocumentation) {
            const cmmc = guidance.cmmcVdiDocumentation;
            html += `<div class="impl-section extras-collapsible" id="cmmc-vdi-docs">
                <div class="impl-section-title"><span class="section-icon">${icons['cmmc-vdi-docs']}</span><span class="section-title-text">CMMC VDI Documentation</span></div>
                <div class="section-content">
                <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:16px">${cmmc.overview}</p>

                <!-- Enhanced Assessment Q&A with Controls and Implementation -->
                <h4 style="margin:16px 0 8px;color:var(--accent-orange)">Assessment Questions with Technical Implementation</h4>
                <p style="font-size:0.7rem;color:var(--text-muted);margin-bottom:12px">Click on control IDs to navigate to the assessment objective. Expand each question for platform-specific implementation guidance.</p>
                
                ${cmmc.assessmentQuestionsEnhanced ? cmmc.assessmentQuestionsEnhanced.map((q, idx) => `
                    <div class="impl-policy-card" style="margin-bottom:16px">
                        <div class="impl-policy-header" style="cursor:pointer" data-action="toggle-tech-details">
                            <h4 style="font-size:0.85rem;flex:1">${q.question}</h4>
                            <span style="font-size:0.7rem;opacity:0.7">▼ Click to expand</span>
                        </div>
                        <div class="impl-policy-body">
                            <p style="font-size:0.75rem;margin-bottom:12px">${q.answer}</p>
                            
                            <!-- Linked Controls -->
                            <div style="margin-bottom:12px">
                                <strong style="font-size:0.7rem;color:var(--accent-blue)">Applicable Controls:</strong>
                                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
                                    ${q.controls.map(c => `
                                        <button class="control-link-btn" data-action="navigate-control" data-param="${c}" 
                                            style="background:var(--accent-blue);color:white;border:none;padding:4px 10px;border-radius:4px;font-size:0.7rem;cursor:pointer;display:flex;align-items:center;gap:4px">
                                            <span style="font-weight:600">${c}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                        </button>
                                    `).join('')}
                                </div>
                                <div style="margin-top:8px;font-size:0.65rem;color:var(--text-muted)">
                                    ${q.controls.map(c => `<div style="margin-bottom:2px"><strong>${c}:</strong> ${q.controlDescriptions[c] || ''}</div>`).join('')}
                                </div>
                            </div>
                            
                            <!-- Technical Implementation Details (Collapsible) -->
                            <div class="impl-tech-details" style="display:none;border-top:1px solid var(--border-color);padding-top:12px;margin-top:12px">
                                
                                <!-- Windows GPO -->
                                ${q.technicalImplementation.windowsGPO ? `
                                <div style="margin-bottom:16px">
                                    <h5 style="font-size:0.75rem;color:var(--accent-purple);margin-bottom:8px;display:flex;align-items:center;gap:6px">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                                        Windows Group Policy (GPO)
                                    </h5>
                                    <div class="impl-table-container">
                                        <table class="impl-table">
                                            <thead><tr><th>Setting</th><th>Path</th><th>Value</th></tr></thead>
                                            <tbody>
                                                ${q.technicalImplementation.windowsGPO.map(g => `
                                                    <tr>
                                                        <td><strong style="font-size:0.65rem">${g.setting}</strong></td>
                                                        <td style="font-size:0.6rem;font-family:monospace;word-break:break-all">${g.path}</td>
                                                        <td style="font-size:0.65rem;color:var(--accent-green)">${g.value}</td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                ` : ''}
                                
                                <!-- Windows Registry -->
                                ${q.technicalImplementation.windowsRegistry ? `
                                <div style="margin-bottom:16px">
                                    <h5 style="font-size:0.75rem;color:var(--accent-orange);margin-bottom:8px;display:flex;align-items:center;gap:6px">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                                        Windows Registry
                                    </h5>
                                    <div class="impl-table-container">
                                        <table class="impl-table">
                                            <thead><tr><th>Key</th><th>Value</th><th>Data</th><th>Description</th></tr></thead>
                                            <tbody>
                                                ${q.technicalImplementation.windowsRegistry.map(r => `
                                                    <tr>
                                                        <td style="font-size:0.55rem;font-family:monospace;word-break:break-all">${r.key}</td>
                                                        <td><code style="font-size:0.6rem">${r.value}</code></td>
                                                        <td><code style="font-size:0.6rem;color:var(--accent-green)">${r.data}</code></td>
                                                        <td style="font-size:0.6rem">${r.description}</td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                ` : ''}
                                
                                <!-- Platform-Specific Implementations -->
                                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:12px">
                                    
                                    <!-- AVD -->
                                    ${q.technicalImplementation.avd ? `
                                    <div style="background:var(--bg-secondary);padding:10px;border-radius:6px;border-left:3px solid var(--accent-blue)">
                                        <h6 style="font-size:0.7rem;color:var(--accent-blue);margin-bottom:6px">Azure Virtual Desktop</h6>
                                        ${q.technicalImplementation.avd.map(a => `
                                            <div style="margin-bottom:6px;font-size:0.65rem">
                                                <strong>${a.setting}:</strong> <span style="color:var(--text-muted)">${a.config}</span>
                                                <div style="font-size:0.55rem;color:var(--accent-blue)">${a.location}</div>
                                            </div>
                                        `).join('')}
                                    </div>
                                    ` : ''}
                                    
                                    <!-- Citrix -->
                                    ${q.technicalImplementation.citrix ? `
                                    <div style="background:var(--bg-secondary);padding:10px;border-radius:6px;border-left:3px solid var(--accent-orange)">
                                        <h6 style="font-size:0.7rem;color:var(--accent-orange);margin-bottom:6px">Citrix CVAD</h6>
                                        ${q.technicalImplementation.citrix.map(c => `
                                            <div style="margin-bottom:6px;font-size:0.65rem">
                                                <strong>${c.setting}:</strong> <span style="color:var(--text-muted)">${c.config}</span>
                                                <div style="font-size:0.55rem;color:var(--accent-orange)">${c.location}</div>
                                            </div>
                                        `).join('')}
                                    </div>
                                    ` : ''}
                                    
                                    <!-- VMware -->
                                    ${q.technicalImplementation.vmware ? `
                                    <div style="background:var(--bg-secondary);padding:10px;border-radius:6px;border-left:3px solid var(--accent-green)">
                                        <h6 style="font-size:0.7rem;color:var(--accent-green);margin-bottom:6px">VMware Horizon</h6>
                                        ${q.technicalImplementation.vmware.map(v => `
                                            <div style="margin-bottom:6px;font-size:0.65rem">
                                                <strong>${v.setting}:</strong> <span style="color:var(--text-muted)">${v.config}</span>
                                                <div style="font-size:0.55rem;color:var(--accent-green)">${v.location}</div>
                                            </div>
                                        `).join('')}
                                    </div>
                                    ` : ''}
                                    
                                    <!-- IGEL -->
                                    ${q.technicalImplementation.igel ? `
                                    <div style="background:var(--bg-secondary);padding:10px;border-radius:6px;border-left:3px solid var(--accent-purple)">
                                        <h6 style="font-size:0.7rem;color:var(--accent-purple);margin-bottom:6px">IGEL OS</h6>
                                        ${q.technicalImplementation.igel.map(i => `
                                            <div style="margin-bottom:6px;font-size:0.65rem">
                                                <strong>${i.setting}:</strong> <span style="color:var(--text-muted)">${i.config}</span>
                                                <div style="font-size:0.55rem;color:var(--accent-purple)">${i.location}</div>
                                            </div>
                                        `).join('')}
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('') : ''}

                <!-- Document Checklist -->
                <h4 style="margin:20px 0 8px;color:var(--accent-green)">Assessment Document Checklist</h4>
                <div class="impl-table-container">
                    <table class="impl-table">
                        <thead><tr><th>Document</th><th>Status</th><th>Description</th></tr></thead>
                        <tbody>
                            ${cmmc.assessmentPrep.documentChecklist.map(d => `
                                <tr>
                                    <td><strong>${d.document}</strong></td>
                                    <td><span class="impl-phase-badge ${d.status === 'Required' ? 'security' : 'governance'}">${d.status}</span></td>
                                    <td style="font-size:0.7rem">${d.description}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                </div>
            </div>`;
        }

        // =============================================
        // COST MANAGEMENT DEEP DIVE
        // =============================================
        if (guidance.costManagementDeepDive) {
            const cost = guidance.costManagementDeepDive;
            html += `<div class="impl-section extras-collapsible" id="cost-deep-dive">
                <div class="impl-section-title"><span class="section-icon">${icons['cost-deep-dive']}</span><span class="section-title-text">VDI Cost Management</span></div>
                <div class="section-content">

                <!-- Azure Cost Management -->
                <h4 style="margin:16px 0 8px;color:var(--accent-blue)">${cost.azure.name}</h4>
                <div class="impl-table-container" style="margin-bottom:16px">
                    <table class="impl-table">
                        <thead><tr><th>Strategy</th><th>Description</th><th>Savings</th></tr></thead>
                        <tbody>
                            ${cost.azure.strategies.map(s => `
                                <tr>
                                    <td><strong>${s.name}</strong></td>
                                    <td style="font-size:0.7rem">${s.description}</td>
                                    <td style="font-size:0.7rem;color:var(--accent-green)">${s.savings || s.bestFor || ''}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- AWS Cost Management -->
                <h4 style="margin:16px 0 8px;color:var(--accent-orange)">${cost.aws.name}</h4>
                <div class="impl-table-container" style="margin-bottom:16px">
                    <table class="impl-table">
                        <thead><tr><th>Strategy</th><th>Description</th><th>Details</th></tr></thead>
                        <tbody>
                            ${cost.aws.strategies.map(s => `
                                <tr>
                                    <td><strong>${s.name}</strong></td>
                                    <td style="font-size:0.7rem">${s.description}</td>
                                    <td style="font-size:0.7rem">${s.savings || s.hourly || ''}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- On-Prem Cost Management -->
                <h4 style="margin:16px 0 8px;color:var(--accent-purple)">${cost.onPrem.name}</h4>
                <div class="impl-cards-grid" style="margin-bottom:16px">
                    ${cost.onPrem.strategies.map(s => `
                        <div class="impl-policy-card" style="padding:12px">
                            <strong style="font-size:0.8rem">${s.name}</strong>
                            <p style="font-size:0.7rem;margin-top:4px">${s.description}</p>
                            ${s.tip ? `<p style="font-size:0.65rem;color:var(--accent-green);margin-top:4px">Tip: ${s.tip}</p>` : ''}
                        </div>
                    `).join('')}
                </div>

                <!-- TCO Comparison -->
                <h4 style="margin:16px 0 8px">Cross-Platform TCO Comparison</h4>
                <div class="impl-table-container">
                    <table class="impl-table">
                        <thead><tr><th>Line Item</th><th>Azure</th><th>AWS</th><th>On-Prem</th></tr></thead>
                        <tbody>
                            ${cost.crossPlatformComparison.template.map(t => `
                                <tr>
                                    <td><strong>${t.lineItem}</strong></td>
                                    <td style="font-size:0.7rem">${t.azure}</td>
                                    <td style="font-size:0.7rem">${t.aws}</td>
                                    <td style="font-size:0.7rem">${t.onPrem}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                </div>
            </div>`;
        }

        // =============================================
        // VDI ENDPOINTS DEEP DIVE
        // =============================================
        if (guidance.vdiEndpointsDeepDive) {
            const endpoints = guidance.vdiEndpointsDeepDive;
            html += `<div class="impl-section extras-collapsible" id="endpoints-deep-dive">
                <div class="impl-section-title"><span class="section-icon">${icons['endpoints-deep-dive']}</span><span class="section-title-text">VDI Endpoints</span></div>
                <div class="section-content">
                <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:16px">${endpoints.overview}</p>

                <!-- Thin Client Hardware Vendors -->
                <h4 style="margin:16px 0 8px;color:var(--accent-blue)">Thin Client Hardware</h4>
                <p style="font-size:0.75rem;margin-bottom:12px">${endpoints.thinClientHardware.description}</p>
                
                ${endpoints.thinClientHardware.vendors.map(vendor => `
                    <div class="impl-policy-card" style="margin-bottom:12px">
                        <div class="impl-policy-header"><h4>${vendor.vendor}</h4></div>
                        <div class="impl-policy-body">
                            <div class="impl-table-container" style="margin-bottom:8px">
                                <table class="impl-table">
                                    <thead><tr><th>Model</th><th>Specs</th><th>Use Case</th><th>Price</th></tr></thead>
                                    <tbody>
                                        ${vendor.products.map(p => `
                                            <tr>
                                                <td><strong>${p.model}</strong></td>
                                                <td style="font-size:0.65rem">${p.specs}</td>
                                                <td style="font-size:0.7rem">${p.useCase}</td>
                                                <td style="font-size:0.7rem;color:var(--accent-green)">${p.priceRange}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                            <p style="font-size:0.7rem"><strong>OS Options:</strong> ${vendor.osOptions.join(', ')}</p>
                            <p style="font-size:0.7rem"><strong>Management:</strong> ${vendor.management}</p>
                            <p style="font-size:0.65rem;color:var(--text-muted)"><strong>Strengths:</strong> ${vendor.strengths.join(', ')}</p>
                        </div>
                    </div>
                `).join('')}

                <!-- Selection Criteria -->
                <h4 style="margin:20px 0 8px">Hardware Selection Criteria</h4>
                <div class="impl-table-container" style="margin-bottom:16px">
                    <table class="impl-table">
                        <thead><tr><th>Factor</th><th>Guidance</th></tr></thead>
                        <tbody>
                            ${endpoints.thinClientHardware.selectionCriteria.map(c => `
                                <tr>
                                    <td><strong>${c.factor}</strong></td>
                                    <td style="font-size:0.7rem">${c.guidance}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Thin Client Software/OS -->
                <h4 style="margin:20px 0 8px;color:var(--accent-orange)">Thin Client Operating Systems</h4>
                <p style="font-size:0.75rem;margin-bottom:12px">${endpoints.thinClientSoftware.description}</p>
                
                <div class="impl-cards-grid" style="margin-bottom:16px">
                    ${endpoints.thinClientSoftware.solutions.map(sol => `
                        <div class="impl-policy-card">
                            <div class="impl-policy-header" style="${sol.name === 'IGEL OS' ? 'background:var(--accent-green)' : ''}">
                                <h4>${sol.name}</h4>
                                <span style="font-size:0.6rem;opacity:0.8">${sol.type}</span>
                            </div>
                            <div class="impl-policy-body">
                                <p style="font-size:0.75rem;margin-bottom:8px">${sol.description}</p>
                                <div style="margin-bottom:8px">
                                    <strong style="font-size:0.7rem">Features:</strong>
                                    <ul style="font-size:0.65rem;margin:4px 0 0 16px">${sol.features.slice(0,5).map(f => `<li>${f}</li>`).join('')}</ul>
                                </div>
                                <p style="font-size:0.7rem"><strong>Management:</strong> ${sol.management.tool}</p>
                                <p style="font-size:0.7rem"><strong>Deployment:</strong> ${sol.deployment.join(', ')}</p>
                                <p style="font-size:0.7rem"><strong>Licensing:</strong> ${sol.licensing}</p>
                                <p style="font-size:0.65rem;color:var(--accent-blue);margin-top:8px">${sol.bestFor}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- OS Comparison Table -->
                <h4 style="margin:16px 0 8px">Thin Client OS Comparison</h4>
                <div class="impl-table-container" style="margin-bottom:16px">
                    <table class="impl-table">
                        <thead><tr><th>Feature</th><th>IGEL</th><th>ThinOS</th><th>ThinPro</th><th>Win IoT</th><th>ChromeOS</th></tr></thead>
                        <tbody>
                            ${endpoints.thinClientSoftware.comparisonTable.map(row => `
                                <tr>
                                    <td><strong>${row.feature}</strong></td>
                                    <td style="font-size:0.65rem">${row.igel}</td>
                                    <td style="font-size:0.65rem">${row.thinOS}</td>
                                    <td style="font-size:0.65rem">${row.thinPro}</td>
                                    <td style="font-size:0.65rem">${row.winIoT}</td>
                                    <td style="font-size:0.65rem">${row.chromeOS}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Zero Clients -->
                <h4 style="margin:20px 0 8px;color:var(--accent-green)">Zero Clients</h4>
                <p style="font-size:0.75rem;margin-bottom:12px">${endpoints.zeroClients.description}</p>
                <div class="impl-table-container" style="margin-bottom:12px">
                    <table class="impl-table">
                        <thead><tr><th>Vendor</th><th>Product</th><th>Features</th><th>Limitation</th><th>Price</th></tr></thead>
                        <tbody>
                            ${endpoints.zeroClients.options.map(opt => `
                                <tr>
                                    <td><strong>${opt.vendor}</strong></td>
                                    <td>${opt.product}</td>
                                    <td style="font-size:0.65rem">${opt.features.join(', ')}</td>
                                    <td style="font-size:0.65rem;color:var(--accent-orange)">${opt.limitation}</td>
                                    <td style="font-size:0.7rem">${opt.priceRange}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Repurposing Hardware -->
                <h4 style="margin:20px 0 8px;color:var(--accent-purple)">Repurposing Existing Hardware</h4>
                <p style="font-size:0.75rem;margin-bottom:12px">${endpoints.repurposingHardware.description}</p>
                <div class="impl-table-container" style="margin-bottom:12px">
                    <table class="impl-table">
                        <thead><tr><th>Solution</th><th>Method</th><th>Hardware</th><th>Cost</th></tr></thead>
                        <tbody>
                            ${endpoints.repurposingHardware.options.map(opt => `
                                <tr>
                                    <td><strong>${opt.solution}</strong></td>
                                    <td style="font-size:0.7rem">${opt.method}</td>
                                    <td style="font-size:0.7rem">${opt.hardware}</td>
                                    <td style="font-size:0.7rem;color:var(--accent-green)">${opt.cost}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div style="background:var(--bg-secondary);padding:12px;border-radius:6px;margin-bottom:16px">
                    <strong style="font-size:0.8rem">Cost-Benefit Analysis (100 users)</strong>
                    <p style="font-size:0.7rem;margin:4px 0"><strong>New Thin Clients:</strong> ${endpoints.repurposingHardware.costBenefit.newThinClients}</p>
                    <p style="font-size:0.7rem;margin:4px 0"><strong>Repurpose PCs:</strong> ${endpoints.repurposingHardware.costBenefit.repurpose}</p>
                    <p style="font-size:0.65rem;color:var(--accent-blue)">${endpoints.repurposingHardware.costBenefit.breakeven}</p>
                </div>

                <!-- Mobile/BYOD -->
                <h4 style="margin:20px 0 8px;color:var(--accent-orange)">Mobile & BYOD Access</h4>
                <div class="impl-cards-grid" style="margin-bottom:12px">
                    ${endpoints.mobileAccess.options.map(opt => `
                        <div class="impl-policy-card" style="padding:12px">
                            <strong style="font-size:0.85rem">${opt.type}</strong>
                            <p style="font-size:0.7rem;margin:4px 0">${opt.description}</p>
                            <p style="font-size:0.65rem"><strong>Security:</strong> ${opt.security.join(', ')}</p>
                        </div>
                    `).join('')}
                </div>
                <div style="background:rgba(255,100,100,0.1);padding:12px;border-radius:6px;border:1px solid var(--accent-orange);margin-bottom:16px">
                    <strong style="font-size:0.8rem;color:var(--accent-orange)">BYOD Policy for CUI</strong>
                    <ul style="font-size:0.7rem;margin:8px 0 0 16px">
                        ${endpoints.mobileAccess.byodPolicy.requirements.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                    <p style="font-size:0.65rem;color:var(--accent-orange);margin-top:8px">${endpoints.mobileAccess.byodPolicy.cmmcConsiderations}</p>
                </div>

                <!-- Endpoint Hardening -->
                <h4 style="margin:20px 0 8px;color:var(--accent-blue)">Endpoint Security Hardening</h4>
                <div class="impl-table-container" style="margin-bottom:16px">
                    <table class="impl-table">
                        <thead><tr><th>Control</th><th>Description</th><th>CMMC</th></tr></thead>
                        <tbody>
                            ${endpoints.endpointHardening.universalControls.map(c => `
                                <tr>
                                    <td><strong>${c.control}</strong></td>
                                    <td style="font-size:0.7rem">${c.description}</td>
                                    <td style="font-size:0.6rem;color:var(--text-muted)">${c.cmmc}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Management Tools -->
                <h4 style="margin:16px 0 8px">Endpoint Management Tools</h4>
                <div class="impl-table-container" style="margin-bottom:12px">
                    <table class="impl-table">
                        <thead><tr><th>Platform</th><th>Management Tool</th></tr></thead>
                        <tbody>
                            ${Object.entries(endpoints.endpointManagement.toolsByPlatform).map(([platform, tool]) => `
                                <tr>
                                    <td><strong>${platform.charAt(0).toUpperCase() + platform.slice(1)}</strong></td>
                                    <td style="font-size:0.75rem">${tool}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Lifecycle Recommendations -->
                <div style="background:var(--bg-secondary);padding:12px;border-radius:6px">
                    <strong style="font-size:0.8rem">Lifecycle Recommendations</strong>
                    <ul style="font-size:0.7rem;margin:8px 0 0 16px">
                        ${endpoints.endpointManagement.lifecycleRecommendations.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                </div>
                </div>
            </div>`;
        }

        // =============================================
        // CLOUD SECURITY (SPA) - Security Protection Assets
        // =============================================
        const cloudName = this.implGuideCloud === 'aws' ? 'AWS GovCloud' : this.implGuideCloud === 'gcp' ? 'GCP Assured Workloads' : 'Azure GCC High';
        html += `<div class="impl-section extras-collapsible" id="cloud-security">
            <div class="impl-section-title"><span class="section-icon">${icons['cloud-security']}</span><span class="section-title-text">Cloud Security (${cloudName})</span></div>
            <div class="section-content">
            <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:16px">Cloud-native security services function as Security Protection Assets (SPAs) that support CMMC L2 assessment objectives. These services provide the technical controls necessary to protect, detect, and respond to threats against CUI.</p>
            
            <!-- SPA Categories -->
            <div class="impl-cards-grid" style="margin-bottom:20px">
                <div class="impl-policy-card">
                    <div class="impl-policy-header" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8)"><h4>Identity & Access Management</h4></div>
                    <div class="impl-policy-body">
                        <p style="font-size:0.75rem;margin-bottom:8px"><strong>CMMC Controls:</strong> AC.L2-3.1.1, AC.L2-3.1.2, AC.L2-3.1.5, IA.L2-3.5.3</p>
                        ${this.implGuideCloud === 'azure' ? `
                            <ul style="font-size:0.7rem;margin:8px 0 0 16px">
                                <li><strong>Entra ID (Azure AD)</strong> - Centralized identity provider with Conditional Access</li>
                                <li><strong>Privileged Identity Management (PIM)</strong> - Just-in-time privileged access</li>
                                <li><strong>Azure AD MFA</strong> - FIDO2, Authenticator app, hardware tokens</li>
                                <li><strong>Access Reviews</strong> - Periodic attestation of user access</li>
                            </ul>
                        ` : this.implGuideCloud === 'aws' ? `
                            <ul style="font-size:0.7rem;margin:8px 0 0 16px">
                                <li><strong>IAM Identity Center</strong> - SSO and centralized identity management</li>
                                <li><strong>IAM Roles</strong> - Least privilege access with assume role</li>
                                <li><strong>MFA</strong> - Virtual/hardware MFA for IAM users</li>
                                <li><strong>Organizations SCPs</strong> - Preventive guardrails</li>
                            </ul>
                        ` : `
                            <ul style="font-size:0.7rem;margin:8px 0 0 16px">
                                <li><strong>Cloud Identity</strong> - SSO and identity management</li>
                                <li><strong>IAM Conditions</strong> - Context-aware access control</li>
                                <li><strong>BeyondCorp Enterprise</strong> - Zero trust access</li>
                                <li><strong>2-Step Verification</strong> - Hardware security keys</li>
                            </ul>
                        `}
                    </div>
                </div>
                
                <div class="impl-policy-card">
                    <div class="impl-policy-header" style="background:linear-gradient(135deg,#f59e0b,#d97706)"><h4>Network Security</h4></div>
                    <div class="impl-policy-body">
                        <p style="font-size:0.75rem;margin-bottom:8px"><strong>CMMC Controls:</strong> SC.L2-3.13.1, SC.L2-3.13.5, SC.L2-3.13.6</p>
                        ${this.implGuideCloud === 'azure' ? `
                            <ul style="font-size:0.7rem;margin:8px 0 0 16px">
                                <li><strong>Azure Firewall Premium</strong> - TLS inspection, IDPS, threat intel</li>
                                <li><strong>Network Security Groups</strong> - Stateful packet filtering</li>
                                <li><strong>Private Endpoints</strong> - Private connectivity to PaaS</li>
                                <li><strong>DDoS Protection</strong> - Volumetric attack mitigation</li>
                            </ul>
                        ` : this.implGuideCloud === 'aws' ? `
                            <ul style="font-size:0.7rem;margin:8px 0 0 16px">
                                <li><strong>Network Firewall</strong> - Stateful inspection with IPS</li>
                                <li><strong>Security Groups/NACLs</strong> - Layer 3/4 filtering</li>
                                <li><strong>PrivateLink</strong> - Private connectivity to services</li>
                                <li><strong>WAF</strong> - Web application firewall rules</li>
                            </ul>
                        ` : `
                            <ul style="font-size:0.7rem;margin:8px 0 0 16px">
                                <li><strong>Cloud Armor</strong> - WAF and DDoS protection</li>
                                <li><strong>VPC Firewall Rules</strong> - Network segmentation</li>
                                <li><strong>Private Google Access</strong> - Private API access</li>
                                <li><strong>Cloud NAT</strong> - Controlled egress</li>
                            </ul>
                        `}
                    </div>
                </div>
                
                <div class="impl-policy-card">
                    <div class="impl-policy-header" style="background:linear-gradient(135deg,#8b5cf6,#6d28d9)"><h4>Data Protection</h4></div>
                    <div class="impl-policy-body">
                        <p style="font-size:0.75rem;margin-bottom:8px"><strong>CMMC Controls:</strong> SC.L2-3.13.8, SC.L2-3.13.11, SC.L2-3.13.16</p>
                        ${this.implGuideCloud === 'azure' ? `
                            <ul style="font-size:0.7rem;margin:8px 0 0 16px">
                                <li><strong>Azure Key Vault (HSM)</strong> - FIPS 140-2 L3 key management</li>
                                <li><strong>Storage Service Encryption</strong> - CMK encryption at rest</li>
                                <li><strong>Microsoft Purview</strong> - Data classification & DLP</li>
                                <li><strong>Azure Information Protection</strong> - Document encryption</li>
                            </ul>
                        ` : this.implGuideCloud === 'aws' ? `
                            <ul style="font-size:0.7rem;margin:8px 0 0 16px">
                                <li><strong>KMS (CloudHSM)</strong> - FIPS 140-2 L3 key management</li>
                                <li><strong>S3 Encryption</strong> - SSE-KMS with CMK</li>
                                <li><strong>Macie</strong> - Data classification for S3</li>
                                <li><strong>Secrets Manager</strong> - Credential rotation</li>
                            </ul>
                        ` : `
                            <ul style="font-size:0.7rem;margin:8px 0 0 16px">
                                <li><strong>Cloud KMS/HSM</strong> - Customer-managed encryption keys</li>
                                <li><strong>CMEK</strong> - Encryption with customer keys</li>
                                <li><strong>DLP API</strong> - Sensitive data detection</li>
                                <li><strong>Secret Manager</strong> - Secret storage & rotation</li>
                            </ul>
                        `}
                    </div>
                </div>
                
                <div class="impl-policy-card">
                    <div class="impl-policy-header" style="background:linear-gradient(135deg,#ef4444,#dc2626)"><h4>Threat Detection & Response</h4></div>
                    <div class="impl-policy-body">
                        <p style="font-size:0.75rem;margin-bottom:8px"><strong>CMMC Controls:</strong> SI.L2-3.14.1, SI.L2-3.14.2, SI.L2-3.14.6, SI.L2-3.14.7</p>
                        ${this.implGuideCloud === 'azure' ? `
                            <ul style="font-size:0.7rem;margin:8px 0 0 16px">
                                <li><strong>Microsoft Defender for Cloud</strong> - CSPM & workload protection</li>
                                <li><strong>Microsoft Sentinel</strong> - Cloud-native SIEM/SOAR</li>
                                <li><strong>Defender for Endpoint</strong> - EDR for VMs</li>
                                <li><strong>Azure Monitor</strong> - Centralized logging & alerting</li>
                            </ul>
                        ` : this.implGuideCloud === 'aws' ? `
                            <ul style="font-size:0.7rem;margin:8px 0 0 16px">
                                <li><strong>Security Hub</strong> - Centralized security findings</li>
                                <li><strong>GuardDuty</strong> - Threat detection service</li>
                                <li><strong>Inspector</strong> - Vulnerability scanning</li>
                                <li><strong>CloudWatch/CloudTrail</strong> - Logging & monitoring</li>
                            </ul>
                        ` : `
                            <ul style="font-size:0.7rem;margin:8px 0 0 16px">
                                <li><strong>Security Command Center</strong> - Centralized security</li>
                                <li><strong>Event Threat Detection</strong> - Runtime threat detection</li>
                                <li><strong>Web Security Scanner</strong> - Vulnerability scanning</li>
                                <li><strong>Cloud Logging</strong> - Audit & access logs</li>
                            </ul>
                        `}
                    </div>
                </div>
            </div>
            
            <!-- SPA Best Practices Table -->
            <h4 style="margin:16px 0 8px;color:#22c55e">Security Protection Asset Configuration Best Practices</h4>
            <div class="impl-table-container">
                <table class="impl-table">
                    <thead><tr><th>Category</th><th>Best Practice</th><th>CMMC Relevance</th></tr></thead>
                    <tbody>
                        <tr>
                            <td><strong>Encryption</strong></td>
                            <td>Use customer-managed keys (CMK) for all CUI data at rest; enforce TLS 1.2+ for data in transit</td>
                            <td>SC.L2-3.13.8, SC.L2-3.13.11</td>
                        </tr>
                        <tr>
                            <td><strong>Network Segmentation</strong></td>
                            <td>Isolate CUI workloads in dedicated VNets/VPCs with explicit deny-all default policies</td>
                            <td>SC.L2-3.13.1, SC.L2-3.13.5</td>
                        </tr>
                        <tr>
                            <td><strong>Identity</strong></td>
                            <td>Enforce MFA for all users; use PIM/JIT for privileged access; regular access reviews</td>
                            <td>AC.L2-3.1.5, IA.L2-3.5.3</td>
                        </tr>
                        <tr>
                            <td><strong>Logging</strong></td>
                            <td>Enable audit logging for all services; retain logs 1+ year; immutable storage</td>
                            <td>AU.L2-3.3.1, AU.L2-3.3.2</td>
                        </tr>
                        <tr>
                            <td><strong>Vulnerability Mgmt</strong></td>
                            <td>Enable continuous vulnerability scanning; remediate critical within 15 days</td>
                            <td>RA.L2-3.11.2, RA.L2-3.11.3</td>
                        </tr>
                        <tr>
                            <td><strong>Malware Protection</strong></td>
                            <td>Deploy EDR on all compute; enable real-time scanning; automated response</td>
                            <td>SI.L2-3.14.1, SI.L2-3.14.2</td>
                        </tr>
                        <tr>
                            <td><strong>Backup</strong></td>
                            <td>Automated backups with CMK encryption; test restoration quarterly; offsite copy</td>
                            <td>CP.L2-3.8.9, MP.L2-3.8.9</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- SPA Inventory Checklist -->
            <h4 style="margin:20px 0 8px;color:#22c55e">Security Protection Asset Inventory Checklist</h4>
            <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px">Document these SPAs in your System Security Plan (SSP) and include them in your asset inventory.</p>
            <div class="impl-table-container">
                <table class="impl-table">
                    <thead><tr><th>Asset Type</th><th>Service Name</th><th>Boundary</th><th>Owner</th><th>Status</th></tr></thead>
                    <tbody>
                        <tr><td>Identity Provider</td><td>${this.implGuideCloud === 'azure' ? 'Entra ID' : this.implGuideCloud === 'aws' ? 'IAM Identity Center' : 'Cloud Identity'}</td><td>System-wide</td><td>IT Security</td><td><input type="checkbox"> Documented</td></tr>
                        <tr><td>SIEM/Log Aggregator</td><td>${this.implGuideCloud === 'azure' ? 'Microsoft Sentinel' : this.implGuideCloud === 'aws' ? 'Security Hub + CloudWatch' : 'Chronicle/Cloud Logging'}</td><td>System-wide</td><td>SOC</td><td><input type="checkbox"> Documented</td></tr>
                        <tr><td>Key Management</td><td>${this.implGuideCloud === 'azure' ? 'Azure Key Vault HSM' : this.implGuideCloud === 'aws' ? 'KMS/CloudHSM' : 'Cloud KMS/HSM'}</td><td>CUI Enclave</td><td>IT Security</td><td><input type="checkbox"> Documented</td></tr>
                        <tr><td>Firewall</td><td>${this.implGuideCloud === 'azure' ? 'Azure Firewall Premium' : this.implGuideCloud === 'aws' ? 'Network Firewall' : 'Cloud Armor + VPC Firewall'}</td><td>Enclave Perimeter</td><td>Network Team</td><td><input type="checkbox"> Documented</td></tr>
                        <tr><td>EDR/Antimalware</td><td>${this.implGuideCloud === 'azure' ? 'Defender for Endpoint' : this.implGuideCloud === 'aws' ? 'Inspector + GuardDuty' : 'SCC + Event Threat Detection'}</td><td>All Compute</td><td>IT Security</td><td><input type="checkbox"> Documented</td></tr>
                        <tr><td>Vulnerability Scanner</td><td>${this.implGuideCloud === 'azure' ? 'Defender for Cloud' : this.implGuideCloud === 'aws' ? 'Inspector' : 'Security Health Analytics'}</td><td>All Resources</td><td>IT Security</td><td><input type="checkbox"> Documented</td></tr>
                        <tr><td>Backup Service</td><td>${this.implGuideCloud === 'azure' ? 'Azure Backup' : this.implGuideCloud === 'aws' ? 'AWS Backup' : 'Cloud Storage + Snapshots'}</td><td>CUI Data</td><td>IT Ops</td><td><input type="checkbox"> Documented</td></tr>
                    </tbody>
                </table>
            </div>
            </div>
        </div>`;

        // Close grid container
        html += `</div>`;

        return html;
    }

    renderImplExtras(guide) {
        const currentCloud = this.implGuideCloud || 'azure';
        const enclaveGuidance = typeof ENCLAVE_GUIDANCE !== 'undefined' ? ENCLAVE_GUIDANCE : null;
        
        // SVG icons for subsections (stroke-based, like myctrl.tools)
        const icons = {
            'evidence-collection': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
            'power-automate': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
            'system-banner': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>',
            'raci-matrix': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
            'azure-endpoints': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
            'cui-patterns': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
            'purview-labels': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
            'dfars-7012': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            'tabletop': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
            'lessons-learned': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
            'scp-examples': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
            'aws-deep-dive': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
            'org-policies': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18v-7"></path><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"></path><path d="M14 18v-7"></path><path d="M18 18v-7"></path><path d="M3 22h18"></path><path d="M6 18v-7"></path></svg>',
            'assured-workloads': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            'gcp-deep-dive': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'
        };
        
        // Build subsection navigation based on available content
        const subsections = [];
        // Machine-readable evidence collection is available for all clouds
        if (enclaveGuidance?.machineReadableEvidence) {
            subsections.push({ id: 'evidence-collection', name: 'Evidence Collection' });
        }
        if (currentCloud === 'azure') {
            if (enclaveGuidance?.powerAutomateGuidance) subsections.push({ id: 'power-automate', name: 'Power Automate' });
            if (guide.systemUseBanner) subsections.push({ id: 'system-banner', name: 'System Banner' });
            if (guide.raciMatrix) subsections.push({ id: 'raci-matrix', name: 'RACI Matrix' });
            if (guide.azureGovEndpoints) subsections.push({ id: 'azure-endpoints', name: 'Azure Endpoints' });
            if (guide.cuiRegexPatterns) subsections.push({ id: 'cui-patterns', name: 'CUI Patterns' });
            if (guide.purviewLabelConfigs) subsections.push({ id: 'purview-labels', name: 'Purview Labels' });
            if (guide.dfars7012Resources) subsections.push({ id: 'dfars-7012', name: 'DFARS 7012' });
            if (guide.tabletopExercises) subsections.push({ id: 'tabletop', name: 'Tabletop Exercises' });
            if (guide.lessonsLearnedTemplate) subsections.push({ id: 'lessons-learned', name: 'Lessons Learned' });
        } else if (currentCloud === 'aws') {
            if (guide.scpExamples) subsections.push({ id: 'scp-examples', name: 'SCPs' });
            subsections.push({ id: 'aws-deep-dive', name: 'GovCloud Deep Dive' });
        } else if (currentCloud === 'gcp') {
            if (guide.orgPolicyExamples) subsections.push({ id: 'org-policies', name: 'Org Policies' });
            if (guide.assuredWorkloads) subsections.push({ id: 'assured-workloads', name: 'Assured Workloads' });
            subsections.push({ id: 'gcp-deep-dive', name: 'GCP Deep Dive' });
        }
        
        // Subsection navigation and search
        let html = `
            <div class="extras-nav-container">
                <div class="extras-search-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" id="extras-search-input" placeholder="Search in Reference Architecture..." class="extras-search-input">
                </div>
                <div class="extras-subsection-nav">
                    ${subsections.map(s => `<button class="extras-nav-btn" data-scroll-to="${s.id}"><span class="extras-nav-icon">${icons[s.id] || ''}</span><span class="extras-nav-label">${s.name}</span></button>`).join('')}
                </div>
            </div>
        `;
        
        // Machine-Readable Evidence Collection (All clouds)
        if (enclaveGuidance?.machineReadableEvidence) {
            const mre = enclaveGuidance.machineReadableEvidence;
            const cloudKey = currentCloud === 'azure' ? 'azure' : currentCloud === 'aws' ? 'aws' : 'gcp';
            const cloudName = currentCloud === 'azure' ? 'Azure/GCC High' : currentCloud === 'aws' ? 'AWS GovCloud' : 'GCP Assured Workloads';
            
            // Build family tabs
            const families = [
                { key: 'accessControl', name: 'Access Control', abbrev: 'AC' },
                { key: 'auditAccountability', name: 'Audit & Accountability', abbrev: 'AU' },
                { key: 'configManagement', name: 'Configuration Mgmt', abbrev: 'CM' },
                { key: 'systemProtection', name: 'System Protection', abbrev: 'SC' },
                { key: 'identificationAuth', name: 'Identification & Auth', abbrev: 'IA' },
                { key: 'riskAssessment', name: 'Risk Assessment', abbrev: 'RA' }
            ];
            
            const familyContent = families.map(fam => {
                const familyData = mre[fam.key];
                if (!familyData || !familyData.objectives) return '';
                
                const objectiveCards = familyData.objectives.map(obj => {
                    const cloudData = obj[cloudKey];
                    if (!cloudData) return '';
                    
                    const automatedCmds = cloudData.automated?.map(cmd => `
                        <div class="evidence-cmd-card">
                            <div class="evidence-cmd-header">
                                <span class="evidence-tool-badge">${cmd.tool}</span>
                                <span class="evidence-freq-badge">${cmd.frequency}</span>
                            </div>
                            <pre class="evidence-cmd-code">${cmd.command}</pre>
                            <div class="evidence-cmd-output">
                                <strong>Output:</strong> ${cmd.output}
                            </div>
                            <button class="impl-copy-btn evidence-copy-btn" data-action="copy-closest-pre" data-copy-selector=".evidence-cmd-card .evidence-cmd-code" data-copy-label="Copy Command">Copy Command</button>
                        </div>
                    `).join('') || '<p class="evidence-no-data">No automated commands available for this cloud.</p>';
                    
                    const humanTasks = cloudData.humanInLoop?.map(task => `<li>${task}</li>`).join('') || '';
                    
                    return `
                        <details class="evidence-objective-card">
                            <summary class="evidence-objective-header">
                                <span class="evidence-obj-id">${obj.objectiveId}</span>
                                <span class="evidence-obj-desc">${obj.description}</span>
                            </summary>
                            <div class="evidence-objective-body">
                                <div class="evidence-section">
                                    <h5 class="evidence-section-title">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                                        Machine-Readable Evidence Commands
                                    </h5>
                                    <div class="evidence-cmd-grid">${automatedCmds}</div>
                                </div>
                                ${humanTasks ? `
                                    <div class="evidence-section evidence-human-section">
                                        <h5 class="evidence-section-title">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                            Human-in-the-Loop Validation
                                        </h5>
                                        <ul class="evidence-human-tasks">${humanTasks}</ul>
                                    </div>
                                ` : ''}
                            </div>
                        </details>
                    `;
                }).join('');
                
                return `
                    <div class="evidence-family-section" data-family="${fam.key}">
                        <div class="evidence-family-header">
                            <span class="evidence-family-abbrev">${fam.abbrev}</span>
                            <span class="evidence-family-name">${fam.name}</span>
                            <span class="evidence-obj-count">${familyData.objectives.length} objectives</span>
                        </div>
                        <div class="evidence-objectives-container">${objectiveCards}</div>
                    </div>
                `;
            }).join('');
            
            html += `
                <div class="impl-section extras-collapsible" id="evidence-collection">
                    <details class="extras-details" open>
                        <summary class="impl-section-title extras-summary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                            Machine-Readable Evidence Collection (${cloudName})
                        </summary>
                        <div class="extras-content">
                            <p class="extras-desc">${mre.description}</p>
                            
                            <div class="evidence-legend">
                                <div class="evidence-legend-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                                    <span>Automated - CLI/API commands that produce JSON output</span>
                                </div>
                                <div class="evidence-legend-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    <span>Human-in-Loop - Manual validation steps to complement automation</span>
                                </div>
                            </div>
                            
                            <div class="evidence-families-container">
                                ${familyContent}
                            </div>
                        </div>
                    </details>
                </div>
            `;
        }
        
        // Power Automate Guidance (Azure)
        if (currentCloud === 'azure' && enclaveGuidance?.powerAutomateGuidance) {
            const pa = enclaveGuidance.powerAutomateGuidance;
            
            const templateCards = pa.automationTemplates.map(t => `
                <details class="pa-template-card">
                    <summary class="pa-template-header">
                        <span class="pa-template-category">${t.category}</span>
                        <span class="pa-template-name">${t.name}</span>
                        <span class="pa-template-controls">${t.cmmcControls.join(', ')}</span>
                    </summary>
                    <div class="pa-template-body">
                        <p class="pa-template-desc">${t.description}</p>
                        <div class="pa-template-trigger"><strong>Trigger:</strong> ${t.trigger}</div>
                        
                        <details class="pa-inner-details">
                            <summary>Workflow Steps (${t.steps.length})</summary>
                            <ol class="pa-steps">${t.steps.map(s => `<li>${s}</li>`).join('')}</ol>
                        </details>
                        
                        <details class="pa-inner-details">
                            <summary>Required Connectors (${t.connectors.length})</summary>
                            <div class="pa-connectors">${t.connectors.map(c => `<span class="pa-connector-badge">${c}</span>`).join('')}</div>
                        </details>
                        
                        <details class="pa-inner-details">
                            <summary>SharePoint List Columns (${t.sharePointColumns.length})</summary>
                            <table class="impl-table compact">
                                <thead><tr><th>Column Name</th><th>Type</th></tr></thead>
                                <tbody>${t.sharePointColumns.map(c => `<tr><td><code>${c.name}</code></td><td>${c.type}</td></tr>`).join('')}</tbody>
                            </table>
                        </details>
                        
                        ${t.sampleJson ? `
                            <details class="pa-inner-details">
                                <summary>Sample Flow JSON</summary>
                                <pre class="pa-sample-json">${t.sampleJson}</pre>
                            </details>
                        ` : ''}
                    </div>
                </details>
            `).join('');
            
            html += `
                <div class="impl-section extras-collapsible" id="power-automate">
                    <details class="extras-details" open>
                        <summary class="impl-section-title extras-summary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0078d4" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            Power Automate Compliance Workflows
                        </summary>
                        <div class="extras-content">
                            <p class="extras-desc">${pa.overview.description}</p>
                            <div class="pa-benefits">
                                <strong>Benefits:</strong>
                                <ul>${pa.overview.benefits.map(b => `<li>${b}</li>`).join('')}</ul>
                            </div>
                            <p class="pa-console-link"><strong>GCC High Console:</strong> <a href="${pa.overview.consoleUrl}" target="_blank" rel="noopener">${pa.overview.consoleUrl}</a></p>
                            
                            <h4 class="pa-templates-header">Automation Templates (${pa.automationTemplates.length})</h4>
                            <div class="pa-templates-grid">${templateCards}</div>
                            
                            <details class="pa-section-details">
                                <summary class="pa-section-summary">Implementation Guide</summary>
                                <div class="pa-impl-guide">
                                    <div class="pa-prereqs">
                                        <h5>Prerequisites</h5>
                                        <ul>${pa.implementationGuide.prerequisites.map(p => `<li>${p}</li>`).join('')}</ul>
                                    </div>
                                    <div class="pa-best-practices">
                                        <h5>Best Practices</h5>
                                        <ul>${pa.implementationGuide.bestPractices.map(p => `<li>${p}</li>`).join('')}</ul>
                                    </div>
                                    <div class="pa-security">
                                        <h5>Security Considerations</h5>
                                        <ul>${pa.implementationGuide.securityConsiderations.map(p => `<li>${p}</li>`).join('')}</ul>
                                    </div>
                                </div>
                            </details>
                            
                            <details class="pa-section-details">
                                <summary class="pa-section-summary">Quick Start Steps</summary>
                                <ol class="pa-quickstart">${pa.quickStartSteps.map(s => `<li>${s}</li>`).join('')}</ol>
                            </details>
                            
                            <details class="pa-section-details">
                                <summary class="pa-section-summary">Graph API Setup for User Provisioning</summary>
                                <div class="pa-graph-setup">
                                    <p>${pa.graphApiSetup.description}</p>
                                    <ol>${pa.graphApiSetup.steps.map(s => `<li>${s}</li>`).join('')}</ol>
                                    <h5>Sample HTTP Action</h5>
                                    <pre class="pa-sample-json">${pa.graphApiSetup.sampleHttpAction}</pre>
                                </div>
                            </details>
                        </div>
                    </details>
                </div>
            `;
        }
        
        // System Use Banner (Azure)
        if (guide.systemUseBanner) {
            html += `
                <div class="impl-section extras-collapsible" id="system-banner">
                    <div class="impl-section-title">System Use Banner (3.1.9)</div>
                    <div class="impl-policy-card">
                        <div class="impl-policy-header">
                            <h4>${guide.systemUseBanner.title}</h4>
                        </div>
                        <div class="impl-policy-body">
                            <p style="font-size:0.7rem;line-height:1.6">${guide.systemUseBanner.text}</p>
                            <button class="impl-copy-btn" data-action="copy-closest-pre" data-copy-selector=".impl-policy-body p" data-copy-label="Copy Banner Text">Copy Banner Text</button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // RACI Matrix (Azure)
        if (guide.raciMatrix) {
            const headerCells = guide.raciMatrix.roles.map(r => `<th>${r}</th>`).join('');
            const rows = guide.raciMatrix.tasks.map(t => `
                <tr>
                    <td><strong>${t.category}</strong></td>
                    <td>${t.action}</td>
                    ${t.raci.map(r => `<td style="text-align:center;font-weight:600;color:${r.includes('R') ? '#22c55e' : r.includes('A') ? '#f59e0b' : 'var(--text-muted)'}">${r}</td>`).join('')}
                </tr>
            `).join('');
            html += `
                <div class="impl-section extras-collapsible" id="raci-matrix">
                    <div class="impl-section-title">RACI Matrix</div>
                    <p style="font-size:0.7rem;color:var(--text-muted);margin-bottom:8px">R=Responsible, A=Accountable, C=Consulted, I=Informed</p>
                    <table class="impl-table">
                        <thead><tr><th>Category</th><th>Action</th>${headerCells}</tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            `;
        }
        
        // SCP Examples (AWS)
        if (guide.scpExamples) {
            const items = guide.scpExamples.map(s => `
                <div class="impl-policy-card">
                    <div class="impl-policy-header">
                        <h4>${s.name}</h4>
                        <p>${s.description}</p>
                    </div>
                    <div class="impl-policy-body">
                        <pre class="script-code" style="font-size:0.65rem;max-height:150px;overflow:auto">${s.policy}</pre>
                        <button class="impl-copy-btn" data-action="copy-prev-sibling">Copy Policy</button>
                    </div>
                </div>
            `).join('');
            html += `
                <div class="impl-section extras-collapsible" id="scp-examples">
                    <div class="impl-section-title">Service Control Policy (SCP) Examples</div>
                    ${items}
                </div>
            `;
        }
        
        // AWS GovCloud Deep Dive
        if (currentCloud === 'aws' && enclaveGuidance?.awsGovCloudDeepDive) {
            const awsDD = enclaveGuidance.awsGovCloudDeepDive;
            
            const templateCards = awsDD.automationTemplates.map(t => `
                <details class="pa-template-card">
                    <summary class="pa-template-header">
                        <span class="pa-template-category">${t.category}</span>
                        <span class="pa-template-name">${t.name}</span>
                        <span class="pa-template-controls">${t.cmmcControls.join(', ')}</span>
                    </summary>
                    <div class="pa-template-body">
                        <p class="pa-template-desc">${t.description}</p>
                        <div class="pa-template-trigger"><strong>Architecture:</strong> ${t.architecture}</div>
                        <div class="pa-connectors" style="margin:12px 0">${t.awsServices.map(s => `<span class="pa-connector-badge">${s}</span>`).join('')}</div>
                        
                        <details class="pa-inner-details">
                            <summary>Workflow Steps (${t.steps.length})</summary>
                            <ol class="pa-steps">${t.steps.map(s => `<li>${s}</li>`).join('')}</ol>
                        </details>
                        
                        ${t.stepFunctionsDefinition ? `
                            <details class="pa-inner-details">
                                <summary>Step Functions Definition</summary>
                                <pre class="pa-sample-json">${t.stepFunctionsDefinition}</pre>
                            </details>
                        ` : ''}
                        
                        ${t.lambdaCode ? `
                            <details class="pa-inner-details">
                                <summary>Lambda Code (Python)</summary>
                                <pre class="pa-sample-json">${t.lambdaCode}</pre>
                            </details>
                        ` : ''}
                        
                        ${t.eventBridgeRule ? `
                            <details class="pa-inner-details">
                                <summary>EventBridge Rule</summary>
                                <pre class="pa-sample-json">${t.eventBridgeRule}</pre>
                            </details>
                        ` : ''}
                    </div>
                </details>
            `).join('');
            
            html += `
                <div class="impl-section extras-collapsible" id="aws-deep-dive">
                    <details class="extras-details" open>
                        <summary class="impl-section-title extras-summary">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="#ff9900"><path d="M18.75 11.35a4.32 4.32 0 0 1-.79-.08l-.17-.04h-.12q-.15 0-.15.21v.33q0 .38.97.45a4.38 4.38 0 0 0 1 .12 3 3 0 0 0 1-.15 2 2 0 0 0 .72-.4 1.62 1.62 0 0 0 .42-.59 1.83 1.83 0 0 0 .14-.72 1.46 1.46 0 0 0-.36-1z"/></svg>
                            AWS GovCloud Automation & Deep Dive
                        </summary>
                        <div class="extras-content">
                            <p class="extras-desc">${awsDD.overview.description}</p>
                            <div class="pa-benefits">
                                <strong>Benefits:</strong>
                                <ul>${awsDD.overview.benefits.map(b => `<li>${b}</li>`).join('')}</ul>
                            </div>
                            <p class="pa-console-link"><strong>Console:</strong> <a href="${awsDD.overview.consoleUrl}" target="_blank" rel="noopener">${awsDD.overview.consoleUrl}</a></p>
                            
                            <h4 class="pa-templates-header">Automation Templates (${awsDD.automationTemplates.length})</h4>
                            <div class="pa-templates-grid">${templateCards}</div>
                            
                            <details class="pa-section-details">
                                <summary class="pa-section-summary">GovCloud Endpoints</summary>
                                <div style="padding:16px">
                                    <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:12px">${awsDD.govCloudEndpoints.description}</p>
                                    <table class="impl-table compact">
                                        <thead><tr><th>Service</th><th>Endpoint</th></tr></thead>
                                        <tbody>${awsDD.govCloudEndpoints.endpoints.map(e => `<tr><td>${e.service}</td><td><code>${e.url}</code></td></tr>`).join('')}</tbody>
                                    </table>
                                    <h5 style="margin:16px 0 8px 0;font-size:0.8rem">CLI Configuration</h5>
                                    <pre class="pa-sample-json">${awsDD.govCloudEndpoints.cliConfiguration.join('\n')}</pre>
                                </div>
                            </details>
                            
                            <details class="pa-section-details">
                                <summary class="pa-section-summary">Compliance Automation</summary>
                                <div style="padding:16px">
                                    <h5 style="margin:0 0 8px 0">${awsDD.complianceAutomation.securityHub.name}</h5>
                                    <p style="font-size:0.75rem;color:var(--text-muted)">${awsDD.complianceAutomation.securityHub.description}</p>
                                    <pre class="pa-sample-json">${awsDD.complianceAutomation.securityHub.setup.join('\n')}</pre>
                                    
                                    <h5 style="margin:16px 0 8px 0">${awsDD.complianceAutomation.auditManager.name}</h5>
                                    <p style="font-size:0.75rem;color:var(--text-muted)">${awsDD.complianceAutomation.auditManager.description}</p>
                                    <p style="font-size:0.7rem"><strong>Frameworks:</strong> ${awsDD.complianceAutomation.auditManager.frameworks.join(', ')}</p>
                                    
                                    <h5 style="margin:16px 0 8px 0">${awsDD.complianceAutomation.configRules.name}</h5>
                                    <p style="font-size:0.75rem;color:var(--text-muted)">${awsDD.complianceAutomation.configRules.description}</p>
                                </div>
                            </details>
                            
                            <details class="pa-section-details">
                                <summary class="pa-section-summary">Incident Response & Forensics</summary>
                                <div style="padding:16px">
                                    <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:12px">${awsDD.incidentResponseResources.description}</p>
                                    <h5 style="margin:0 0 8px 0">Automated Forensics Steps</h5>
                                    <ol style="font-size:0.75rem;color:var(--text-secondary);padding-left:20px">
                                        ${awsDD.incidentResponseResources.automatedForensics.steps.map(s => `<li>${s}</li>`).join('')}
                                    </ol>
                                    <h5 style="margin:16px 0 8px 0">Lambda Forensics Code</h5>
                                    <pre class="pa-sample-json">${awsDD.incidentResponseResources.automatedForensics.lambdaForensics}</pre>
                                </div>
                            </details>
                        </div>
                    </details>
                </div>
            `;
        }
        
        // Organization Policy Examples (GCP)
        if (guide.orgPolicyExamples) {
            const rows = guide.orgPolicyExamples.map(p => `
                <tr>
                    <td><strong>${p.name}</strong></td>
                    <td><code class="impl-code">${p.constraint}</code></td>
                    <td>${p.description}</td>
                    <td>${p.effect}</td>
                </tr>
            `).join('');
            html += `
                <div class="impl-section extras-collapsible" id="org-policies">
                    <div class="impl-section-title">Organization Policy Constraints</div>
                    <table class="impl-table">
                        <thead><tr><th>Policy Name</th><th>Constraint</th><th>Description</th><th>Effect</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            `;
        }
        
        // Assured Workloads (GCP)
        if (guide.assuredWorkloads) {
            const aw = guide.assuredWorkloads;
            html += `
                <div class="impl-section extras-collapsible" id="assured-workloads">
                    <div class="impl-section-title">Assured Workloads (GCP)</div>
                    <div class="impl-policy-card">
                        <div class="impl-policy-header">
                            <h4>Compliance Frameworks</h4>
                            <p>${aw.description}</p>
                        </div>
                        <div class="impl-policy-body">
                            <div class="impl-policy-section">
                                <h5>Supported Compliance Regimes</h5>
                                <ul>${aw.complianceRegimes.map(c => `<li>${c}</li>`).join('')}</ul>
                            </div>
                            <div class="impl-policy-section">
                                <h5>Features</h5>
                                <ul>${aw.features.map(f => `<li>${f}</li>`).join('')}</ul>
                            </div>
                            <p style="font-size:0.7rem;color:#f59e0b;margin-top:12px"><strong>Note:</strong> ${aw.note}</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // GCP Assured Workloads Deep Dive
        if (currentCloud === 'gcp' && enclaveGuidance?.gcpAssuredWorkloadsDeepDive) {
            const gcpDD = enclaveGuidance.gcpAssuredWorkloadsDeepDive;
            
            const templateCards = gcpDD.automationTemplates.map(t => `
                <details class="pa-template-card">
                    <summary class="pa-template-header">
                        <span class="pa-template-category">${t.category}</span>
                        <span class="pa-template-name">${t.name}</span>
                        <span class="pa-template-controls">${t.cmmcControls.join(', ')}</span>
                    </summary>
                    <div class="pa-template-body">
                        <p class="pa-template-desc">${t.description}</p>
                        <div class="pa-template-trigger"><strong>Architecture:</strong> ${t.architecture}</div>
                        <div class="pa-connectors" style="margin:12px 0">${t.gcpServices.map(s => `<span class="pa-connector-badge">${s}</span>`).join('')}</div>
                        
                        <details class="pa-inner-details">
                            <summary>Workflow Steps (${t.steps.length})</summary>
                            <ol class="pa-steps">${t.steps.map(s => `<li>${s}</li>`).join('')}</ol>
                        </details>
                        
                        ${t.workflowYaml ? `
                            <details class="pa-inner-details">
                                <summary>Cloud Workflows YAML</summary>
                                <pre class="pa-sample-json">${t.workflowYaml}</pre>
                            </details>
                        ` : ''}
                        
                        ${t.cloudFunction ? `
                            <details class="pa-inner-details">
                                <summary>Cloud Function (Python)</summary>
                                <pre class="pa-sample-json">${t.cloudFunction}</pre>
                            </details>
                        ` : ''}
                    </div>
                </details>
            `).join('');
            
            html += `
                <div class="impl-section extras-collapsible" id="gcp-deep-dive">
                    <details class="extras-details" open>
                        <summary class="impl-section-title extras-summary">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="#4285f4"><path d="M12.19 2.38a9.34 9.34 0 0 0-9.23 6.89c.05-.02-.06.01 0 0-3.88 2.55-3.92 8.11-.25 10.94a6.72 6.72 0 0 0 4.08 1.36h5.17l.03.03h5.19c6.69.05 9.38-8.61 3.84-12.35a9.37 9.37 0 0 0-8.83-6.89z"/></svg>
                            GCP Assured Workloads Automation & Deep Dive
                        </summary>
                        <div class="extras-content">
                            <p class="extras-desc">${gcpDD.overview.description}</p>
                            <div class="pa-benefits">
                                <strong>Compliance Regimes:</strong>
                                <ul>${gcpDD.overview.complianceRegimes.map(r => `<li>${r}</li>`).join('')}</ul>
                            </div>
                            <div class="pa-benefits">
                                <strong>Benefits:</strong>
                                <ul>${gcpDD.overview.benefits.map(b => `<li>${b}</li>`).join('')}</ul>
                            </div>
                            <p class="pa-console-link"><strong>Console:</strong> <a href="${gcpDD.overview.consoleUrl}" target="_blank" rel="noopener">${gcpDD.overview.consoleUrl}</a></p>
                            
                            <h4 class="pa-templates-header">Automation Templates (${gcpDD.automationTemplates.length})</h4>
                            <div class="pa-templates-grid">${templateCards}</div>
                            
                            <details class="pa-section-details">
                                <summary class="pa-section-summary">Assured Workloads Setup</summary>
                                <div style="padding:16px">
                                    <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:12px">${gcpDD.assuredWorkloadsSetup.description}</p>
                                    <h5 style="margin:0 0 8px 0">Prerequisites</h5>
                                    <ul style="font-size:0.75rem;color:var(--text-secondary);padding-left:20px;margin-bottom:12px">
                                        ${gcpDD.assuredWorkloadsSetup.prerequisites.map(p => `<li>${p}</li>`).join('')}
                                    </ul>
                                    <h5 style="margin:0 0 8px 0">Setup Steps</h5>
                                    <ol style="font-size:0.75rem;color:var(--text-secondary);padding-left:20px;margin-bottom:12px">
                                        ${gcpDD.assuredWorkloadsSetup.steps.map(s => `<li>${s}</li>`).join('')}
                                    </ol>
                                    <h5 style="margin:12px 0 8px 0">gcloud Commands</h5>
                                    <pre class="pa-sample-json">${gcpDD.assuredWorkloadsSetup.gcloudCommands.join('\n')}</pre>
                                </div>
                            </details>
                            
                            <details class="pa-section-details">
                                <summary class="pa-section-summary">Security Command Center</summary>
                                <div style="padding:16px">
                                    <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:12px">${gcpDD.securityCommandCenter.description}</p>
                                    <table class="impl-table compact">
                                        <thead><tr><th>Tier</th><th>Cost</th><th>Features</th></tr></thead>
                                        <tbody>${gcpDD.securityCommandCenter.tiers.map(t => `<tr><td>${t.name}</td><td>${t.cost}</td><td>${t.features.join(', ')}</td></tr>`).join('')}</tbody>
                                    </table>
                                    <h5 style="margin:12px 0 8px 0">Setup Commands</h5>
                                    <pre class="pa-sample-json">${gcpDD.securityCommandCenter.setup.join('\n')}</pre>
                                </div>
                            </details>
                            
                            <details class="pa-section-details">
                                <summary class="pa-section-summary">Encryption (CMEK/EKM)</summary>
                                <div style="padding:16px">
                                    <h5 style="margin:0 0 8px 0">${gcpDD.encryptionConfiguration.cmek.name}</h5>
                                    <p style="font-size:0.75rem;color:var(--text-muted)">${gcpDD.encryptionConfiguration.cmek.description}</p>
                                    <pre class="pa-sample-json">${gcpDD.encryptionConfiguration.cmek.gcloudCommands.join('\n')}</pre>
                                    
                                    <h5 style="margin:16px 0 8px 0">${gcpDD.encryptionConfiguration.ekm.name}</h5>
                                    <p style="font-size:0.75rem;color:var(--text-muted)">${gcpDD.encryptionConfiguration.ekm.description}</p>
                                    <p style="font-size:0.7rem"><strong>Providers:</strong> ${gcpDD.encryptionConfiguration.ekm.providers.join(', ')}</p>
                                </div>
                            </details>
                            
                            <details class="pa-section-details">
                                <summary class="pa-section-summary">VPC Service Controls</summary>
                                <div style="padding:16px">
                                    <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:12px">${gcpDD.vpcServiceControls.description}</p>
                                    <table class="impl-table compact">
                                        <thead><tr><th>Component</th><th>Purpose</th></tr></thead>
                                        <tbody>${gcpDD.vpcServiceControls.components.map(c => `<tr><td>${c.name}</td><td>${c.purpose}</td></tr>`).join('')}</tbody>
                                    </table>
                                    <h5 style="margin:12px 0 8px 0">gcloud Commands</h5>
                                    <pre class="pa-sample-json">${gcpDD.vpcServiceControls.gcloudCommands.join('\n')}</pre>
                                </div>
                            </details>
                        </div>
                    </details>
                </div>
            `;
        }
        
        // Azure Government Endpoints (Azure)
        if (guide.azureGovEndpoints) {
            const ag = guide.azureGovEndpoints;
            const endpointRows = ag.endpoints.map(e => `
                <tr>
                    <td><strong>${e.service}</strong></td>
                    <td><code class="impl-code">${e.url}</code></td>
                </tr>
            `).join('');
            const psRows = ag.powershellConnections.map(p => `
                <tr>
                    <td><strong>${p.module}</strong></td>
                    <td><code class="impl-code" style="font-size:0.6rem">${p.command}</code></td>
                </tr>
            `).join('');
            html += `
                <div class="impl-section extras-collapsible" id="azure-endpoints">
                    <div class="impl-section-title">Azure Government Endpoints</div>
                    <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px">${ag.description}</p>
                    <table class="impl-table">
                        <thead><tr><th>Service</th><th>Endpoint URL</th></tr></thead>
                        <tbody>${endpointRows}</tbody>
                    </table>
                </div>
                <div class="impl-section">
                    <div class="impl-section-title">PowerShell Connection Commands</div>
                    <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px">Use these commands to connect to Azure Gov / GCC High from PowerShell:</p>
                    <table class="impl-table">
                        <thead><tr><th>Module</th><th>Connection Command</th></tr></thead>
                        <tbody>${psRows}</tbody>
                    </table>
                </div>
            `;
        }
        
        // CUI Regex Patterns for Microsoft Purview (Azure)
        if (guide.cuiRegexPatterns) {
            const crp = guide.cuiRegexPatterns;
            
            // Group patterns by category
            const patternsByCategory = {};
            crp.patterns.forEach(p => {
                if (!patternsByCategory[p.category]) patternsByCategory[p.category] = [];
                patternsByCategory[p.category].push(p);
            });
            
            let patternsHtml = '';
            Object.entries(patternsByCategory).forEach(([category, patterns]) => {
                const categoryClass = category.toLowerCase().replace(/[^a-z]/g, '-');
                const rows = patterns.map(p => `
                    <tr>
                        <td><strong>${p.name}</strong></td>
                        <td><code class="regex-code">${p.regex.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>
                            <button class="regex-copy-btn" data-action="copy-sibling-code">Copy</button>
                        </td>
                        <td style="font-size:0.65rem">${p.description}</td>
                        <td style="font-size:0.6rem;color:var(--text-muted)">${p.examples.join(', ')}</td>
                    </tr>
                `).join('');
                patternsHtml += `
                    <details class="regex-category-card ${categoryClass}">
                        <summary class="regex-category-header">
                            <span class="regex-category-badge ${categoryClass}">${category}</span>
                            <span class="regex-count">${patterns.length} patterns</span>
                        </summary>
                        <table class="impl-table compact">
                            <thead><tr><th>Pattern Name</th><th>Regex</th><th>Description</th><th>Examples</th></tr></thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </details>
                `;
            });
            
            // ITAR/EAR specific patterns
            if (crp.itarEarPatterns) {
                const itarRows = crp.itarEarPatterns.map(p => `
                    <tr>
                        <td><strong>${p.name}</strong></td>
                        <td><span class="regex-category-badge ${p.category.toLowerCase()}">${p.category}</span></td>
                        <td><code class="regex-code">${p.regex.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>
                            <button class="regex-copy-btn" data-action="copy-sibling-code">Copy</button>
                        </td>
                        <td style="font-size:0.65rem">${p.description}</td>
                    </tr>
                `).join('');
                patternsHtml += `
                    <details class="regex-category-card itar-ear">
                        <summary class="regex-category-header">
                            <span class="regex-category-badge itar">ITAR</span>
                            <span class="regex-category-badge ear">EAR</span>
                            <span class="regex-count">${crp.itarEarPatterns.length} patterns</span>
                        </summary>
                        <table class="impl-table compact">
                            <thead><tr><th>Pattern Name</th><th>Type</th><th>Regex</th><th>Description</th></tr></thead>
                            <tbody>${itarRows}</tbody>
                        </table>
                    </details>
                `;
            }
            
            html += `
                <div class="impl-section extras-collapsible" id="cui-patterns">
                    <div class="impl-section-title">CUI Marking Regex Patterns (Purview SITs)</div>
                    <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px">${crp.description}</p>
                    <div class="regex-patterns-container">${patternsHtml}</div>
                </div>
            `;
        }
        
        // Purview Sensitivity Label Configurations (Azure)
        if (guide.purviewLabelConfigs) {
            const plc = guide.purviewLabelConfigs;
            
            const labelCards = plc.labels.map(l => `
                <div class="purview-label-card">
                    <div class="purview-label-header" style="border-left-color:${l.color}">
                        <span class="purview-label-name">${l.displayName}</span>
                        <span class="purview-label-id">${l.name}</span>
                    </div>
                    <div class="purview-label-body">
                        <p class="purview-label-tooltip">${l.tooltip}</p>
                        <div class="purview-label-settings">
                            <div class="purview-setting">
                                <span class="setting-label">Encryption:</span>
                                <span class="setting-value ${l.encryption.enabled ? 'enabled' : 'disabled'}">${l.encryption.enabled ? 'Enabled' : 'Disabled'}</span>
                            </div>
                            <div class="purview-setting">
                                <span class="setting-label">Offline Access:</span>
                                <span class="setting-value">${l.encryption.offlineAccess} days</span>
                            </div>
                            <div class="purview-setting">
                                <span class="setting-label">Permissions:</span>
                                <span class="setting-value">${l.encryption.permissions.join(', ')}</span>
                            </div>
                            ${l.encryption.requireMFA ? '<div class="purview-setting"><span class="setting-label">MFA Required:</span><span class="setting-value enabled">Yes</span></div>' : ''}
                            ${l.encryption.blockExternalSharing ? '<div class="purview-setting"><span class="setting-label">Block External:</span><span class="setting-value enabled">Yes</span></div>' : ''}
                        </div>
                        <div class="purview-content-marking">
                            <div class="marking-item"><strong>Header:</strong> ${l.contentMarking.header}</div>
                            <div class="marking-item"><strong>Footer:</strong> <span style="font-size:0.6rem">${l.contentMarking.footer}</span></div>
                            <div class="marking-item"><strong>Watermark:</strong> ${l.contentMarking.watermark ? 'Yes' : 'No'}</div>
                        </div>
                        <div class="purview-auto-labeling">
                            <strong>Auto-Labeling SITs:</strong> ${l.autoLabeling.sensitiveInfoTypes.join(', ')}
                        </div>
                    </div>
                </div>
            `).join('');
            
            html += `
                <div class="impl-section extras-collapsible" id="purview-labels">
                    <div class="impl-section-title">Microsoft Purview Sensitivity Labels</div>
                    <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px">${plc.description}</p>
                    <div class="purview-labels-grid">${labelCards}</div>
                </div>
            `;
            
            // PowerShell deployment script
            if (plc.powershellDeployment) {
                html += `
                    <div class="impl-section">
                        <div class="impl-section-title">Deploy Sensitivity Labels (PowerShell)</div>
                        <details class="ps-deploy-section">
                            <summary class="ps-deploy-summary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                                <span>View Deployment Script</span>
                                <button class="ps-copy-all-btn" data-action="copy-closest-pre" data-copy-selector=".ps-deploy-section pre" data-copy-label="Copy All">Copy All</button>
                            </summary>
                            <pre class="ps-deploy-code">${plc.powershellDeployment}</pre>
                        </details>
                    </div>
                `;
            }
        }
        
        // DFARS 7012 Incident Response Resources (Azure)
        if (guide.dfars7012Resources) {
            const dfars = guide.dfars7012Resources;
            const portalRows = dfars.portals.map(p => `
                <tr>
                    <td><strong>${p.name}</strong></td>
                    <td><a href="${p.url}" target="_blank" rel="noopener noreferrer" class="portal-link">${p.url}</a></td>
                    <td style="font-size:0.65rem">${p.purpose}</td>
                    <td style="font-size:0.6rem;color:var(--text-muted)">${p.requirements}</td>
                </tr>
            `).join('');
            
            const ecaRows = dfars.ecaCertificate.providers.map(p => `
                <tr>
                    <td><strong>${p.name}</strong></td>
                    <td><a href="${p.url}" target="_blank" rel="noopener noreferrer" class="portal-link">${p.type}</a></td>
                </tr>
            `).join('');
            
            const reqRows = dfars.reportingRequirements.map(r => `
                <tr>
                    <td><strong>${r.requirement}</strong></td>
                    <td>${r.description}</td>
                </tr>
            `).join('');
            
            html += `
                <div class="impl-section dfars-section extras-collapsible" id="dfars-7012">
                    <div class="impl-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        DFARS 252.204-7012 Incident Reporting
                    </div>
                    <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px">${dfars.description}</p>
                    
                    <h4 class="dfars-subheader">Reporting Portals</h4>
                    <table class="impl-table compact">
                        <thead><tr><th>Portal</th><th>URL</th><th>Purpose</th><th>Requirements</th></tr></thead>
                        <tbody>${portalRows}</tbody>
                    </table>
                    
                    <h4 class="dfars-subheader">ECA Certificate Providers</h4>
                    <p style="font-size:0.65rem;color:var(--text-muted);margin-bottom:8px">${dfars.ecaCertificate.description}</p>
                    <table class="impl-table compact">
                        <thead><tr><th>Provider</th><th>Type</th></tr></thead>
                        <tbody>${ecaRows}</tbody>
                    </table>
                    <p style="font-size:0.6rem;color:#f59e0b;margin-top:8px"><strong>Note:</strong> ${dfars.ecaCertificate.note}</p>
                    
                    <h4 class="dfars-subheader">Reporting Requirements</h4>
                    <table class="impl-table compact">
                        <thead><tr><th>Requirement</th><th>Description</th></tr></thead>
                        <tbody>${reqRows}</tbody>
                    </table>
                </div>
            `;
        }
        
        // Tabletop Exercises (Azure)
        if (guide.tabletopExercises) {
            const ttx = guide.tabletopExercises;
            const scenarioCards = ttx.scenarios.map(s => {
                const difficultyClass = s.difficulty === 'High' ? 'high' : s.difficulty === 'Medium' ? 'medium' : 'low';
                const injectsList = s.injects.map(i => `<li><strong>${i.time}:</strong> ${i.event}</li>`).join('');
                const questionsList = s.discussionQuestions.map(q => `<li>${q}</li>`).join('');
                const actionsList = s.expectedActions.map(a => `<li>${a}</li>`).join('');
                const participantBadges = s.participants.map(p => `<span class="ttx-participant">${p}</span>`).join('');
                
                return `
                    <div class="ttx-scenario-card">
                        <div class="ttx-scenario-header">
                            <span class="ttx-scenario-id">${s.id}</span>
                            <span class="ttx-scenario-name">${s.name}</span>
                            <span class="ttx-difficulty ${difficultyClass}">${s.difficulty}</span>
                            <span class="ttx-duration">${s.duration}</span>
                        </div>
                        <div class="ttx-participants">${participantBadges}</div>
                        <div class="ttx-scenario-body">
                            <p class="ttx-scenario-text">${s.scenario}</p>
                            
                            <details class="ttx-details">
                                <summary>Scenario Injects (${s.injects.length})</summary>
                                <ol class="ttx-injects">${injectsList}</ol>
                            </details>
                            
                            <details class="ttx-details">
                                <summary>Discussion Questions (${s.discussionQuestions.length})</summary>
                                <ul class="ttx-questions">${questionsList}</ul>
                            </details>
                            
                            <details class="ttx-details">
                                <summary>Expected Actions (${s.expectedActions.length})</summary>
                                <ul class="ttx-actions">${actionsList}</ul>
                            </details>
                        </div>
                    </div>
                `;
            }).join('');
            
            html += `
                <div class="impl-section ttx-section extras-collapsible" id="tabletop">
                    <div class="impl-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                        Tabletop Exercise Scenarios
                    </div>
                    <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px">${ttx.description}</p>
                    <div class="ttx-scenarios-grid">${scenarioCards}</div>
                </div>
            `;
        }
        
        // Lessons Learned Template (Azure)
        if (guide.lessonsLearnedTemplate) {
            const ll = guide.lessonsLearnedTemplate;
            const sectionsList = ll.template.sections.map(s => {
                let content = '';
                if (s.prompts) {
                    content = `<ul class="ll-prompts">${s.prompts.map(p => `<li>${p}</li>`).join('')}</ul>`;
                }
                if (s.examples) {
                    content += `<table class="impl-table compact ll-table"><thead><tr><th>Action</th><th>Owner</th><th>Due</th><th>Priority</th></tr></thead><tbody>
                        ${s.examples.map(e => `<tr><td>${e.action}</td><td>${e.owner}</td><td>${e.dueDate}</td><td><span class="ll-priority ${e.priority.toLowerCase()}">${e.priority}</span></td></tr>`).join('')}
                    </tbody></table>`;
                }
                if (s.metrics) {
                    content += `<table class="impl-table compact ll-table"><thead><tr><th>Metric</th><th>Target</th><th>Actual</th></tr></thead><tbody>
                        ${s.metrics.map(m => `<tr><td>${m.name}</td><td>${m.target}</td><td>${m.actual}</td></tr>`).join('')}
                    </tbody></table>`;
                }
                if (s.approvals) {
                    content += `<div class="ll-approvals">
                        ${s.approvals.map(a => `<div class="ll-approval-row"><span class="ll-role">${a.role}</span><span class="ll-sig">Signature: ${a.signature}</span><span class="ll-date">Date: ${a.date}</span></div>`).join('')}
                    </div>`;
                }
                return `<div class="ll-section"><h5>${s.title}</h5>${content}</div>`;
            }).join('');
            
            const bestPracticesList = ll.bestPractices.map(bp => `<li>${bp}</li>`).join('');
            
            html += `
                <div class="impl-section ll-section-container extras-collapsible" id="lessons-learned">
                    <div class="impl-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                        Lessons Learned Template
                    </div>
                    <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px">${ll.description}</p>
                    
                    <div class="ll-template-card">
                        <div class="ll-header">
                            <div class="ll-header-field"><strong>Incident ID:</strong> ${ll.template.header.incidentId}</div>
                            <div class="ll-header-field"><strong>Exercise ID:</strong> ${ll.template.header.exerciseId}</div>
                            <div class="ll-header-field"><strong>Date:</strong> ${ll.template.header.date}</div>
                            <div class="ll-header-field"><strong>Classification:</strong> ${ll.template.header.classification}</div>
                        </div>
                        
                        <div class="ll-sections">${sectionsList}</div>
                    </div>
                    
                    <div class="ll-best-practices">
                        <h5>Best Practices</h5>
                        <ul>${bestPracticesList}</ul>
                    </div>
                </div>
            `;
        }
        
        return html || '<p style="color:var(--text-muted)">No additional resources available.</p>';
    }

    exportImplGuidePlan() {
        const guide = this.getImplGuide();
        if (!guide) return;
        
        const cloudNames = { azure: 'GCC-High', aws: 'AWS-GovCloud', gcp: 'GCP' };
        const headers = ["Phase", "Week", "Task_ID", "Task", "Owner", "Accountable", "Deliverable", "Status"];
        const rows = guide.projectPlan.map(t => 
            [t.phase, t.week, t.taskId, `"${t.task}"`, t.owner, t.accountable, t.deliverable, "Pending"].join(",")
        );
        const csv = [headers.join(","), ...rows].join("\n");
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CMMC-L2-${cloudNames[this.implGuideCloud]}-Implementation-Plan-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast(`Exported ${cloudNames[this.implGuideCloud]} project plan to CSV`, 'success');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('[App] Initializing AssessmentApp...');
        window.app = new AssessmentApp();
        console.log('[App] AssessmentApp initialized successfully');
        
        // Footer dismiss toggle
        const siteFooter = document.getElementById('site-footer');
        const footerToggle = document.getElementById('footer-toggle-btn');
        if (siteFooter && footerToggle) {
            if (localStorage.getItem('footer-collapsed') === '1') siteFooter.classList.add('collapsed');
            footerToggle.addEventListener('click', () => {
                siteFooter.classList.toggle('collapsed');
                localStorage.setItem('footer-collapsed', siteFooter.classList.contains('collapsed') ? '1' : '0');
            });
        }
    } catch (error) {
        console.error('[App] Failed to initialize:', error);
        console.error('[App] Error stack:', error.stack);
        
        // Show error to user
        const body = document.body;
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #ef4444; color: white; padding: 20px; border-radius: 8px; z-index: 10000; max-width: 600px;';
        errorDiv.innerHTML = `
            <h2 style="margin: 0 0 10px 0;">App Initialization Error</h2>
            <p style="margin: 0 0 10px 0;">${error.message}</p>
            <details style="margin-top: 10px;">
                <summary style="cursor: pointer;">Show Details</summary>
                <pre style="margin-top: 10px; overflow: auto; max-height: 200px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px;">${error.stack}</pre>
            </details>
        `;
        body.appendChild(errorDiv);
    }
});

// Global Search (Cmd+K) functionality
function initGlobalSearch() {
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('search-modal-input');
    const results = document.getElementById('search-modal-results');
    const backdrop = modal?.querySelector('.search-modal-backdrop');
    
    if (!modal || !input || !results) return;
    
    let selectedIndex = -1;
    let searchResults = [];
    
    // Build searchable index
    const searchIndex = buildSearchIndex();
    
    // Keyboard shortcut: Cmd+K or Ctrl+K
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            openSearchModal();
        }
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeSearchModal();
        }
    });
    
    // Close on backdrop click
    backdrop?.addEventListener('click', closeSearchModal);
    
    // Search trigger button click
    const searchTrigger = document.getElementById('search-trigger');
    searchTrigger?.addEventListener('click', openSearchModal);
    
    // Search input handler
    input.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
            results.innerHTML = `
                <div class="search-empty-state">
                    <p>Start typing to search across all controls and objectives</p>
                    <div class="search-hints">
                        <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
                        <span><kbd>Enter</kbd> Select</span>
                        <span><kbd>ESC</kbd> Close</span>
                    </div>
                </div>
            `;
            searchResults = [];
            selectedIndex = -1;
            return;
        }
        
        searchResults = performSearch(searchIndex, query);
        renderSearchResults(results, searchResults, query);
        selectedIndex = searchResults.length > 0 ? 0 : -1;
        updateSelectedResult(results, selectedIndex);
    });
    
    // Keyboard navigation in results
    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (selectedIndex < searchResults.length - 1) {
                selectedIndex++;
                updateSelectedResult(results, selectedIndex);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (selectedIndex > 0) {
                selectedIndex--;
                updateSelectedResult(results, selectedIndex);
            }
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            selectSearchResult(searchResults[selectedIndex]);
            closeSearchModal();
        }
    });
    
    function openSearchModal() {
        modal.classList.add('active');
        input.value = '';
        input.focus();
        selectedIndex = -1;
        results.innerHTML = `
            <div class="search-empty-state">
                <p>Start typing to search across all controls and objectives</p>
                <div class="search-hints">
                    <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
                    <span><kbd>Enter</kbd> Select</span>
                    <span><kbd>ESC</kbd> Close</span>
                </div>
            </div>
        `;
    }
    
    function closeSearchModal() {
        modal.classList.remove('active');
        input.value = '';
    }
}

function buildSearchIndex() {
    const index = [];
    
    if (typeof CONTROL_FAMILIES === 'undefined') return index;
    
    CONTROL_FAMILIES.forEach(family => {
        // Add family to index
        index.push({
            type: 'family',
            id: family.id,
            title: family.name,
            description: `${family.controls.length} controls`,
            familyId: family.id
        });
        
        family.controls.forEach(control => {
            // Add control to index
            index.push({
                type: 'control',
                id: control.id,
                title: `${control.id} - ${control.name}`,
                description: control.description || '',
                familyId: family.id,
                controlId: control.id
            });
            
            // Add objectives to index
            control.objectives?.forEach(obj => {
                index.push({
                    type: 'objective',
                    id: obj.id,
                    title: obj.id,
                    description: obj.text,
                    familyId: family.id,
                    controlId: control.id,
                    objectiveId: obj.id
                });
            });
        });
    });
    
    return index;
}

function performSearch(index, query) {
    const lowerQuery = query.toLowerCase();
    const words = lowerQuery.split(/\s+/);
    
    const scored = index.map(item => {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const descLower = item.description.toLowerCase();
        
        // Exact ID match gets highest score
        if (item.id.toLowerCase() === lowerQuery) {
            score += 100;
        } else if (item.id.toLowerCase().includes(lowerQuery)) {
            score += 50;
        }
        
        // Title matches
        if (titleLower.includes(lowerQuery)) {
            score += 30;
        }
        
        // Word matches in title/description
        words.forEach(word => {
            if (titleLower.includes(word)) score += 10;
            if (descLower.includes(word)) score += 5;
        });
        
        return { ...item, score };
    });
    
    return scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 15);
}

function renderSearchResults(container, results, query) {
    if (results.length === 0) {
        container.innerHTML = `
            <div class="search-no-results">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="m11 8v6"/><path d="m8 11h6"/></svg>
                <p>No results found for "${query}"</p>
            </div>
        `;
        return;
    }
    
    const highlightText = (text, query) => {
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    };
    
    const icons = {
        family: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/></svg>',
        control: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        objective: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>'
    };
    
    const html = results.map((item, idx) => `
        <div class="search-result-item${idx === 0 ? ' selected' : ''}" data-index="${idx}">
            <div class="search-result-icon">${icons[item.type]}</div>
            <div class="search-result-content">
                <div class="search-result-title">${highlightText(item.title, query)}</div>
                <div class="search-result-description">${item.description.substring(0, 100)}${item.description.length > 100 ? '...' : ''}</div>
                <div class="search-result-meta">
                    <span class="search-result-badge">${item.type}</span>
                    ${item.familyId ? `<span class="search-result-badge">${item.familyId}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
    
    // Add click handlers
    container.querySelectorAll('.search-result-item').forEach(el => {
        el.addEventListener('click', () => {
            const idx = parseInt(el.dataset.index);
            selectSearchResult(results[idx]);
            document.getElementById('search-modal').classList.remove('active');
        });
    });
}

function updateSelectedResult(container, index) {
    container.querySelectorAll('.search-result-item').forEach((el, idx) => {
        el.classList.toggle('selected', idx === index);
        if (idx === index) {
            el.scrollIntoView({ block: 'nearest' });
        }
    });
}

function selectSearchResult(item) {
    if (!window.app) return;
    
    // Switch to assessment view
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector('[data-view="assessment"]')?.classList.add('active');
    window.app.currentView = 'assessment';
    document.getElementById('dashboard-view').classList.add('hidden');
    document.getElementById('assessment-view').classList.remove('hidden');
    
    // Set family filter
    const familyFilter = document.getElementById('family-filter');
    if (familyFilter && item.familyId) {
        familyFilter.value = item.familyId;
        window.app.renderControls();
    }
    
    // Scroll to and highlight the item
    setTimeout(() => {
        let targetEl;
        if (item.type === 'objective' && item.objectiveId) {
            targetEl = document.querySelector(`[data-objective-id="${item.objectiveId}"]`);
            if (targetEl) {
                targetEl.classList.add('expanded');
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetEl.style.animation = 'highlightPulse 1s ease-out';
            }
        } else if (item.type === 'control' && item.controlId) {
            targetEl = document.querySelector(`[data-control-id="${item.controlId}"]`);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, 100);
}

// ============================================================
// Global Delegated Event Handler
// Replaces inline onclick handlers blocked by CSP script-src 'self'
// ============================================================
document.addEventListener('click', function(e) {
    // Skip clicks inside MSP Portal — handled by its own delegation
    if (e.target.closest('#msp-portal')) return;
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.dataset.action;
    var param = btn.dataset.param || '';

    switch (action) {
        // --- Generic close patterns ---
        case 'close-modal': {
            var mid = btn.dataset.modalId;
            if (mid) { var el = document.getElementById(mid); if (el) el.remove(); }
            break;
        }
        case 'close-backdrop': {
            var bd = btn.closest(btn.dataset.backdrop || '.modal-backdrop');
            if (bd) bd.remove();
            break;
        }
        case 'close-overlay': {
            var ov = btn.closest(btn.dataset.overlay || '.activity-panel-overlay');
            if (ov) ov.remove();
            break;
        }

        // --- EvidenceUI ---
        case 'evidence-signin': if (typeof evidenceUI !== 'undefined') evidenceUI.signInWithGoogle(); break;
        case 'evidence-signout': if (typeof evidenceUI !== 'undefined') evidenceUI.signOut(); break;
        case 'evidence-create-org': if (typeof evidenceUI !== 'undefined') evidenceUI.showCreateOrgModal(); break;
        case 'evidence-create-assessment': if (typeof evidenceUI !== 'undefined') evidenceUI.showCreateAssessmentModal(); break;
        case 'evidence-profile': if (typeof evidenceUI !== 'undefined') evidenceUI.showProfileModal(); break;
        case 'evidence-close-profile': if (typeof evidenceUI !== 'undefined') evidenceUI.closeProfileModal(); break;
        case 'evidence-close-modal': if (typeof evidenceUI !== 'undefined') evidenceUI.closeEvidenceModal(); break;
        case 'evidence-download': if (typeof evidenceUI !== 'undefined') evidenceUI.downloadEvidence(param); break;
        case 'evidence-delete': if (typeof evidenceUI !== 'undefined') evidenceUI.deleteEvidence(param); break;

        // --- APITester ---
        case 'api-close': if (typeof APITester !== 'undefined') APITester.close(); break;
        case 'api-copy-response': if (typeof APITester !== 'undefined') APITester.copyResponse(); break;
        case 'api-download-response': if (typeof APITester !== 'undefined') APITester.downloadResponse(); break;
        case 'api-map-evidence': if (typeof APITester !== 'undefined') APITester.mapToEvidence(); break;
        case 'api-toggle-visibility': if (typeof APITester !== 'undefined') APITester.toggleVisibility(param); break;
        case 'api-get-oauth-token': if (typeof APITester !== 'undefined') APITester.getOAuthToken(); break;
        case 'api-use-template': if (typeof APITester !== 'undefined') APITester.useTemplate(btn.closest('.template-item, .saved-item')); break;
        case 'api-load-history': if (typeof APITester !== 'undefined') APITester.loadFromHistory(parseInt(param)); break;
        case 'api-remove-history': if (typeof APITester !== 'undefined') APITester.removeFromHistory(parseInt(param)); break;
        case 'api-load-saved': if (typeof APITester !== 'undefined') APITester.loadSavedRequest(parseInt(param)); break;
        case 'api-delete-saved': if (typeof APITester !== 'undefined') APITester.deleteSavedRequest(parseInt(param)); break;

        // --- PortfolioDashboard ---
        case 'pd-open-client': if (typeof PortfolioDashboard !== 'undefined') PortfolioDashboard.openClient(param); break;
        case 'pd-show-details': if (typeof PortfolioDashboard !== 'undefined') PortfolioDashboard.showClientDetails(param); break;
        case 'pd-save-new-client': if (typeof PortfolioDashboard !== 'undefined') PortfolioDashboard.saveNewClient(); break;
        case 'pd-remove-client': if (typeof PortfolioDashboard !== 'undefined') PortfolioDashboard.confirmRemoveClient(param); break;

        // --- InheritedControls ---
        case 'ic-show-edit': if (typeof InheritedControls !== 'undefined') InheritedControls.showEditModal(param); break;
        case 'ic-save-modal': if (typeof InheritedControls !== 'undefined') InheritedControls.saveFromModal(param); break;
        case 'ic-apply-template': if (typeof InheritedControls !== 'undefined') InheritedControls.applySelectedTemplate(); break;

        // --- EvidenceBuilder ---
        case 'eb-toggle-family': if (typeof EvidenceBuilder !== 'undefined') EvidenceBuilder.toggleFamily(param); break;
        case 'eb-upload-artifact': if (typeof EvidenceBuilder !== 'undefined') EvidenceBuilder.uploadArtifact(param, btn.dataset.artifact); break;
        case 'eb-scroll-gaps': if (typeof EvidenceBuilder !== 'undefined') EvidenceBuilder.scrollToGaps(); break;

        // --- CMMCL3Assessment ---
        case 'l3-toggle-family': if (typeof CMMCL3Assessment !== 'undefined') CMMCL3Assessment.toggleFamily(param); break;
        case 'l3-scroll-family': if (typeof CMMCL3Assessment !== 'undefined') CMMCL3Assessment.scrollToFamily(param); break;
        case 'l3-toggle-objective': if (typeof CMMCL3Assessment !== 'undefined') CMMCL3Assessment.toggleObjective(btn); break;

        // --- LocalCollaboration ---
        case 'collab-clear-log': if (typeof LocalCollaboration !== 'undefined') LocalCollaboration.clearActivityLog(); break;
        case 'collab-export-log': if (typeof LocalCollaboration !== 'undefined') LocalCollaboration.exportActivityLog(); break;

        // --- UserManagement ---
        case 'um-cancel-invite': if (typeof UserManagement !== 'undefined') UserManagement.cancelInvite(param); break;

        // --- OSCInventory ---
        case 'osc-download-csv': if (typeof OSCInventory !== 'undefined') OSCInventory.downloadCSVTemplate(param); break;

        // --- AssessmentEnhancements ---
        case 'ae-manage-evidence': {
            if (typeof AssessmentEnhancements !== 'undefined') AssessmentEnhancements.showManageEvidenceModal(param);
            var aeBd = btn.closest('.modal-backdrop');
            if (aeBd) aeBd.remove();
            break;
        }

        // --- SecurityMonitor ---
        case 'srm-close-upload': { var el2 = document.getElementById('srm-upload-modal'); if (el2) el2.remove(); break; }

        // --- ReadinessScorecard ---
        case 'rs-action': {
            var fn = btn.dataset.fn;
            if (fn && typeof window[fn] === 'function') window[fn](param);
            break;
        }

        // --- Planner / POAM enhancements ---
        case 'planner-action': {
            var obj = btn.dataset.obj;
            var method = btn.dataset.method;
            if (obj && method && typeof window[obj] !== 'undefined' && typeof window[obj][method] === 'function') {
                window[obj][method](param);
            }
            break;
        }

        // --- Copy helpers ---
        case 'copy-sibling-code': {
            var codeEl = btn.parentElement && btn.parentElement.querySelector('code');
            if (codeEl) {
                navigator.clipboard.writeText(codeEl.textContent);
                btn.textContent = '\u2713';
                setTimeout(function() { btn.textContent = 'Copy'; }, 1500);
            }
            break;
        }
        case 'copy-deploy-script': {
            e.stopPropagation();
            var preEl = btn.closest('.ps-deploy-section');
            if (preEl) preEl = preEl.querySelector('pre');
            if (preEl) {
                navigator.clipboard.writeText(preEl.textContent);
                btn.textContent = 'Copied!';
                setTimeout(function() { btn.textContent = 'Copy All'; }, 2000);
            }
            break;
        }
        case 'copy-closest-pre': {
            e.stopPropagation();
            var cpSel = btn.dataset.copySelector;
            var cpContainer = btn.closest('.ps-connect-section, .automation-script-item, .evidence-cmd-card, .impl-policy-body, .ps-deploy-section') || btn.parentElement;
            var cpTarget = cpContainer && cpSel ? cpContainer.querySelector(cpSel.split(' ').pop()) : null;
            if (!cpTarget && cpSel) cpTarget = btn.closest('[class]') && btn.closest('[class]').querySelector(cpSel.split(' ').pop());
            if (cpTarget) {
                navigator.clipboard.writeText(cpTarget.textContent);
                var cpLabel = btn.dataset.copyLabel || btn.textContent.trim();
                btn.textContent = 'Copied!';
                setTimeout(function() { btn.textContent = cpLabel; }, 2000);
            }
            break;
        }
        case 'copy-prev-sibling': {
            var prevEl = btn.previousElementSibling;
            if (prevEl) {
                navigator.clipboard.writeText(prevEl.textContent);
                btn.textContent = 'Copied!';
            }
            break;
        }

        // --- Toggle helpers ---
        case 'toggle-next-sibling': {
            btn.classList.toggle('expanded');
            var nextSib = btn.nextElementSibling;
            if (nextSib) nextSib.style.display = btn.classList.contains('expanded') ? 'block' : 'none';
            break;
        }
        case 'toggle-tech-details': {
            var techDetails = btn.parentElement && btn.parentElement.querySelector('.impl-tech-details');
            if (techDetails) techDetails.classList.toggle('expanded');
            break;
        }

        // --- Navigation ---
        case 'navigate-control': {
            e.stopPropagation();
            if (window.app && window.app.navigateToControl) window.app.navigateToControl(param);
            break;
        }

        // --- Page reload ---
        case 'reload-page': {
            window.location.reload();
            break;
        }
    }
});
