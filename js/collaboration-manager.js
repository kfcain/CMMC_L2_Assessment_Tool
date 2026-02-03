// Collaboration Manager
// Automatically detects and uses the best available collaboration method
// Priority: Supabase Realtime > Local Collaboration

const CollaborationManager = {
    mode: null, // 'supabase' or 'local'
    activeModule: null,

    async init() {
        // Detect which collaboration mode to use
        await this.detectMode();
        
        // Initialize the appropriate module
        if (this.mode === 'supabase' && typeof Collaboration !== 'undefined') {
            this.activeModule = Collaboration;
            await Collaboration.init();
            console.log('[CollaborationManager] Using Supabase Realtime collaboration');
        } else {
            this.mode = 'local';
            this.activeModule = LocalCollaboration;
            LocalCollaboration.init();
            console.log('[CollaborationManager] Using local-first collaboration');
        }

        this.showModeIndicator();
    },

    async detectMode() {
        // Check if Supabase is available and configured
        if (typeof supabaseClient === 'undefined') {
            this.mode = 'local';
            return;
        }

        // Check if user is authenticated
        if (!supabaseClient.isAuthenticated || !supabaseClient.isAuthenticated()) {
            this.mode = 'local';
            return;
        }

        // Check if we can connect to Supabase
        try {
            const { data, error } = await supabaseClient.client
                .from('profiles')
                .select('id')
                .limit(1);
            
            if (error) {
                console.warn('[CollaborationManager] Supabase connection failed, using local mode:', error);
                this.mode = 'local';
                return;
            }

            this.mode = 'supabase';
        } catch (error) {
            console.warn('[CollaborationManager] Supabase not available, using local mode:', error);
            this.mode = 'local';
        }
    },

    showModeIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'collab-mode-indicator';
        indicator.innerHTML = `
            <div class="mode-badge ${this.mode}">
                ${this.mode === 'supabase' ? '☁️ Cloud Sync' : '💾 Local Mode'}
            </div>
        `;

        const header = document.querySelector('.view-header .header-right');
        if (header) {
            header.insertBefore(indicator, header.firstChild);
        }
    },

    // Unified API that works with both modes
    logActivity(type, description, metadata = {}) {
        if (this.activeModule?.logActivity) {
            return this.activeModule.logActivity(type, description, metadata);
        }
    },

    trackEdit(objectiveId, controlId, action, oldValue, newValue) {
        if (this.activeModule?.trackEdit) {
            return this.activeModule.trackEdit(objectiveId, controlId, action, oldValue, newValue);
        }
    },

    showActivityPanel() {
        if (this.mode === 'local' && LocalCollaboration.showActivityPanel) {
            LocalCollaboration.showActivityPanel();
        } else {
            this.showToast('Activity panel only available in local mode', 'info');
        }
    },

    async switchToSupabase() {
        if (typeof supabaseClient === 'undefined') {
            this.showToast('Supabase is not configured', 'error');
            return;
        }

        if (!supabaseClient.isAuthenticated || !supabaseClient.isAuthenticated()) {
            this.showToast('Please sign in to enable cloud sync', 'info');
            // Trigger sign-in flow
            if (typeof EvidenceUI !== 'undefined' && EvidenceUI.showAuthOverlay) {
                EvidenceUI.showAuthOverlay();
            }
            return;
        }

        // Cleanup current mode
        if (this.activeModule?.cleanup) {
            this.activeModule.cleanup();
        }

        // Switch to Supabase mode
        this.mode = 'supabase';
        this.activeModule = Collaboration;
        await Collaboration.init();
        
        this.showModeIndicator();
        this.showToast('Switched to cloud sync mode', 'success');
    },

    switchToLocal() {
        // Cleanup current mode
        if (this.activeModule?.cleanup) {
            this.activeModule.cleanup();
        }

        // Switch to local mode
        this.mode = 'local';
        this.activeModule = LocalCollaboration;
        LocalCollaboration.init();
        
        this.showModeIndicator();
        this.showToast('Switched to local mode', 'success');
    },

    showToast(message, type = 'info') {
        if (typeof app !== 'undefined' && app.showToast) {
            app.showToast(message, type);
        } else {
            console.log(`[CollaborationManager] ${type}: ${message}`);
        }
    }
};

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
    window.CollaborationManager = CollaborationManager;
    
    // Wait for all dependencies to load
    const initWhenReady = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => CollaborationManager.init(), 500);
            });
        } else {
            setTimeout(() => CollaborationManager.init(), 500);
        }
    };

    initWhenReady();
}
