// Real-Time Collaboration Module
// Handles live presence, simultaneous editing, and conflict resolution

const Collaboration = {
    config: {
        version: "1.0.0",
        heartbeatInterval: 30000, // 30 seconds
        presenceTimeout: 60000 // 1 minute
    },

    channel: null,
    presenceState: {},
    activeUsers: [],
    currentEditingControl: null,
    heartbeatTimer: null,

    init: async function() {
        if (!supabaseClient.isAuthenticated()) {
            console.log('[Collaboration] Not authenticated, skipping init');
            return;
        }

        await this.setupRealtimeChannel();
        this.startHeartbeat();
        this.bindEvents();
        console.log('[Collaboration] Initialized');
    },

    async setupRealtimeChannel() {
        if (!supabaseClient.currentAssessment) {
            console.log('[Collaboration] No current assessment, skipping channel setup');
            return;
        }

        const assessmentId = supabaseClient.currentAssessment.id;
        
        // Create a channel for this assessment
        this.channel = supabaseClient.client.channel(`assessment:${assessmentId}`, {
            config: {
                presence: {
                    key: supabaseClient.user.id
                }
            }
        });

        // Subscribe to presence events
        this.channel
            .on('presence', { event: 'sync' }, () => {
                this.updatePresenceState();
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                console.log('[Collaboration] User joined:', key);
                this.updatePresenceState();
                this.showUserJoinedNotification(newPresences[0]);
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                console.log('[Collaboration] User left:', key);
                this.updatePresenceState();
                this.showUserLeftNotification(leftPresences[0]);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    // Track presence
                    await this.channel.track({
                        user_id: supabaseClient.user.id,
                        user_name: supabaseClient.user.user_metadata?.full_name || supabaseClient.user.email,
                        user_email: supabaseClient.user.email,
                        avatar_url: supabaseClient.user.user_metadata?.avatar_url,
                        online_at: new Date().toISOString(),
                        editing_control: null
                    });
                }
            });

        // Subscribe to assessment changes
        this.channel
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'assessment_objectives',
                    filter: `assessment_id=eq.${assessmentId}`
                }, 
                (payload) => {
                    this.handleAssessmentChange(payload);
                }
            );
    },

    updatePresenceState() {
        if (!this.channel) return;

        const state = this.channel.presenceState();
        this.presenceState = state;
        
        // Convert to array of active users
        this.activeUsers = Object.values(state).flat().filter(user => {
            // Filter out stale presence (older than timeout)
            const lastSeen = new Date(user.online_at);
            const now = new Date();
            return (now - lastSeen) < this.config.presenceTimeout;
        });

        this.renderPresenceIndicators();
    },

    renderPresenceIndicators() {
        // Remove existing indicators
        document.querySelectorAll('.presence-indicator').forEach(el => el.remove());

        // Add presence indicators to header
        const header = document.querySelector('.view-header .header-right');
        if (!header) return;

        const existingContainer = document.getElementById('presence-container');
        if (existingContainer) existingContainer.remove();

        const container = document.createElement('div');
        container.id = 'presence-container';
        container.className = 'presence-container';

        // Show active users (excluding self)
        const otherUsers = this.activeUsers.filter(u => u.user_id !== supabaseClient.user?.id);
        
        if (otherUsers.length > 0) {
            container.innerHTML = `
                <div class="presence-avatars">
                    ${otherUsers.slice(0, 3).map(user => `
                        <div class="presence-avatar" title="${user.user_name || user.user_email}${user.editing_control ? ' - Editing ' + user.editing_control : ''}">
                            ${user.avatar_url ? 
                                `<img src="${user.avatar_url}" alt="${user.user_name}">` :
                                `<div class="avatar-placeholder">${(user.user_name || user.user_email).charAt(0)}</div>`
                            }
                            <div class="presence-status online"></div>
                        </div>
                    `).join('')}
                    ${otherUsers.length > 3 ? `
                        <div class="presence-count">+${otherUsers.length - 3}</div>
                    ` : ''}
                </div>
            `;
            header.insertBefore(container, header.firstChild);
        }

        // Show editing indicators on controls
        otherUsers.forEach(user => {
            if (user.editing_control) {
                this.showEditingIndicator(user.editing_control, user);
            }
        });
    },

    showEditingIndicator(controlId, user) {
        const controlEl = document.querySelector(`[data-control-id="${controlId}"]`);
        if (!controlEl) return;

        const indicator = document.createElement('div');
        indicator.className = 'editing-indicator';
        indicator.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <span>${user.user_name || user.user_email} is editing</span>
        `;
        
        const header = controlEl.querySelector('.control-header');
        if (header && !header.querySelector('.editing-indicator')) {
            header.appendChild(indicator);
        }
    },

    async trackEditingControl(controlId) {
        if (!this.channel) return;

        this.currentEditingControl = controlId;
        
        await this.channel.track({
            user_id: supabaseClient.user.id,
            user_name: supabaseClient.user.user_metadata?.full_name || supabaseClient.user.email,
            user_email: supabaseClient.user.email,
            avatar_url: supabaseClient.user.user_metadata?.avatar_url,
            online_at: new Date().toISOString(),
            editing_control: controlId
        });
    },

    async stopEditingControl() {
        if (!this.channel) return;

        this.currentEditingControl = null;
        
        await this.channel.track({
            user_id: supabaseClient.user.id,
            user_name: supabaseClient.user.user_metadata?.full_name || supabaseClient.user.email,
            user_email: supabaseClient.user.email,
            avatar_url: supabaseClient.user.user_metadata?.avatar_url,
            online_at: new Date().toISOString(),
            editing_control: null
        });
    },

    handleAssessmentChange(payload) {
        console.log('[Collaboration] Assessment change:', payload);

        const { eventType, new: newRecord, old: oldRecord } = payload;

        // Check if this change was made by another user
        if (newRecord?.updated_by === supabaseClient.user?.id) {
            return; // Ignore our own changes
        }

        // Show notification about the change
        const objectiveId = newRecord?.objective_id || oldRecord?.objective_id;
        const userName = this.activeUsers.find(u => u.user_id === newRecord?.updated_by)?.user_name || 'Another user';

        switch (eventType) {
            case 'INSERT':
            case 'UPDATE':
                this.showChangeNotification(objectiveId, userName, newRecord?.status);
                this.refreshObjective(objectiveId);
                break;
            case 'DELETE':
                this.showChangeNotification(objectiveId, userName, 'deleted');
                this.refreshObjective(objectiveId);
                break;
        }
    },

    refreshObjective(objectiveId) {
        // Reload the objective data and update UI
        const objectiveEl = document.querySelector(`[data-objective-id="${objectiveId}"]`);
        if (!objectiveEl) return;

        // Add a visual indicator that the objective was updated
        objectiveEl.classList.add('updated-by-other');
        setTimeout(() => {
            objectiveEl.classList.remove('updated-by-other');
        }, 2000);

        // Optionally reload the objective data from server
        // This would require fetching from Supabase and re-rendering
    },

    showChangeNotification(objectiveId, userName, status) {
        const message = status === 'deleted' 
            ? `${userName} deleted ${objectiveId}`
            : `${userName} updated ${objectiveId} to ${status}`;

        this.showToast(message, 'info');
    },

    showUserJoinedNotification(user) {
        const userName = user.user_name || user.user_email;
        this.showToast(`${userName} joined the assessment`, 'info');
    },

    showUserLeftNotification(user) {
        const userName = user.user_name || user.user_email;
        this.showToast(`${userName} left the assessment`, 'info');
    },

    startHeartbeat() {
        this.heartbeatTimer = setInterval(async () => {
            if (this.channel && supabaseClient.isAuthenticated()) {
                await this.channel.track({
                    user_id: supabaseClient.user.id,
                    user_name: supabaseClient.user.user_metadata?.full_name || supabaseClient.user.email,
                    user_email: supabaseClient.user.email,
                    avatar_url: supabaseClient.user.user_metadata?.avatar_url,
                    online_at: new Date().toISOString(),
                    editing_control: this.currentEditingControl
                });
            }
        }, this.config.heartbeatInterval);
    },

    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    },

    bindEvents() {
        // Track when user starts editing a control
        document.addEventListener('focus', (e) => {
            const objectiveItem = e.target.closest('.objective-item');
            if (objectiveItem) {
                const controlItem = objectiveItem.closest('.control-item');
                if (controlItem) {
                    const controlId = controlItem.dataset.controlId;
                    this.trackEditingControl(controlId);
                }
            }
        }, true);

        // Track when user stops editing
        document.addEventListener('blur', (e) => {
            const objectiveItem = e.target.closest('.objective-item');
            if (objectiveItem) {
                setTimeout(() => {
                    // Check if focus moved to another objective in same control
                    const newFocus = document.activeElement;
                    const newObjectiveItem = newFocus?.closest('.objective-item');
                    const newControlItem = newObjectiveItem?.closest('.control-item');
                    
                    if (!newControlItem || newControlItem.dataset.controlId !== this.currentEditingControl) {
                        this.stopEditingControl();
                    }
                }, 100);
            }
        }, true);

        // Listen for auth state changes
        window.addEventListener('auth:signin', () => {
            this.init();
        });

        window.addEventListener('auth:signout', () => {
            this.cleanup();
        });
    },

    cleanup() {
        this.stopHeartbeat();
        if (this.channel) {
            this.channel.unsubscribe();
            this.channel = null;
        }
        this.presenceState = {};
        this.activeUsers = [];
        this.currentEditingControl = null;
    },

    showToast(message, type = 'info') {
        if (typeof app !== 'undefined' && app.showToast) {
            app.showToast(message, type);
        } else {
            console.log(`[Collaboration] ${type}: ${message}`);
        }
    }
};

// Initialize when Supabase is ready
if (typeof window !== 'undefined') {
    window.Collaboration = Collaboration;
    
    // Wait for Supabase to be ready
    window.addEventListener('data:loaded', () => {
        if (supabaseClient.isAuthenticated()) {
            Collaboration.init();
        }
    });
}
