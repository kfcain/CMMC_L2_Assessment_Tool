// Local-First Collaboration Module
// Works entirely with localStorage, no backend required
// Simulates multi-user features for single-user or local team scenarios

const LocalCollaboration = {
    config: {
        version: "1.0.0",
        sessionTimeout: 300000, // 5 minutes
        maxRecentActivity: 50
    },

    currentSession: null,
    activityLog: [],
    editHistory: {},

    init: function() {
        this.createSession();
        this.loadActivityLog();
        this.bindEvents();
        this.startSessionHeartbeat();
        console.log('[LocalCollaboration] Initialized - Local-first mode');
    },

    createSession: function() {
        const sessionId = this.generateSessionId();
        this.currentSession = {
            id: sessionId,
            userName: this.getUserName(),
            userEmail: this.getUserEmail(),
            startTime: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            editingControl: null
        };

        this.saveSession();
        this.logActivity('session_start', 'Started new session');
    },

    generateSessionId: function() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    getUserName: function() {
        // Try to get from org data first
        const orgData = localStorage.getItem('nist-org-data');
        if (orgData) {
            try {
                const parsed = JSON.parse(orgData);
                if (parsed.assessorName) return parsed.assessorName;
            } catch (e) {}
        }

        // Check if user has set a name before
        let userName = localStorage.getItem('nist-user-name');
        if (!userName) {
            userName = prompt('Enter your name for activity tracking:') || 'Anonymous User';
            localStorage.setItem('nist-user-name', userName);
        }
        return userName;
    },

    getUserEmail: function() {
        return localStorage.getItem('nist-user-email') || '';
    },

    saveSession: function() {
        localStorage.setItem('nist-current-session', JSON.stringify(this.currentSession));
    },

    loadActivityLog: function() {
        const saved = localStorage.getItem('nist-activity-log');
        this.activityLog = saved ? JSON.parse(saved) : [];
    },

    saveActivityLog: function() {
        // Keep only recent activities
        if (this.activityLog.length > this.config.maxRecentActivity) {
            this.activityLog = this.activityLog.slice(-this.config.maxRecentActivity);
        }
        localStorage.setItem('nist-activity-log', JSON.stringify(this.activityLog));
    },

    logActivity: function(type, description, metadata = {}) {
        const activity = {
            id: `activity_${Date.now()}`,
            type: type,
            description: description,
            userName: this.currentSession?.userName || 'Unknown',
            timestamp: new Date().toISOString(),
            metadata: metadata
        };

        this.activityLog.push(activity);
        this.saveActivityLog();
        this.updateActivityFeed();

        return activity;
    },

    updateActivityFeed: function() {
        const feedContainer = document.getElementById('activity-feed');
        if (!feedContainer) return;

        const recentActivities = this.activityLog.slice(-10).reverse();
        
        feedContainer.innerHTML = recentActivities.map(activity => `
            <div class="activity-item" data-type="${activity.type}">
                <div class="activity-icon">${this.getActivityIcon(activity.type)}</div>
                <div class="activity-content">
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-meta">
                        <span class="activity-user">${activity.userName}</span>
                        <span class="activity-time">${this.formatTimeAgo(activity.timestamp)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    getActivityIcon: function(type) {
        const icons = {
            session_start: '🟢',
            assessment_update: '✏️',
            poam_created: '⚠️',
            poam_updated: '📝',
            evidence_uploaded: '📎',
            export: '📤',
            import: '📥',
            status_change: '🔄'
        };
        return icons[type] || '📌';
    },

    formatTimeAgo: function(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();
    },

    trackEdit: function(objectiveId, controlId, action, oldValue, newValue) {
        const editKey = `${controlId}_${objectiveId}`;
        
        if (!this.editHistory[editKey]) {
            this.editHistory[editKey] = [];
        }

        const edit = {
            timestamp: new Date().toISOString(),
            userName: this.currentSession?.userName || 'Unknown',
            action: action,
            oldValue: oldValue,
            newValue: newValue
        };

        this.editHistory[editKey].push(edit);
        this.saveEditHistory();

        // Log activity
        this.logActivity('assessment_update', 
            `Updated ${objectiveId} status to ${newValue}`,
            { objectiveId, controlId, action }
        );
    },

    saveEditHistory: function() {
        localStorage.setItem('nist-edit-history', JSON.stringify(this.editHistory));
    },

    loadEditHistory: function() {
        const saved = localStorage.getItem('nist-edit-history');
        this.editHistory = saved ? JSON.parse(saved) : {};
    },

    getEditHistory: function(objectiveId, controlId) {
        const editKey = `${controlId}_${objectiveId}`;
        return this.editHistory[editKey] || [];
    },

    showEditHistory: function(objectiveId, controlId) {
        const history = this.getEditHistory(objectiveId, controlId);
        
        if (history.length === 0) {
            this.showToast('No edit history available', 'info');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content modal-medium">
                <div class="modal-header">
                    <h2>Edit History - ${objectiveId}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="edit-history-list">
                        ${history.reverse().map(edit => `
                            <div class="edit-history-item">
                                <div class="edit-timestamp">${this.formatTimeAgo(edit.timestamp)}</div>
                                <div class="edit-user">${edit.userName}</div>
                                <div class="edit-change">
                                    ${edit.action}: 
                                    <span class="old-value">${edit.oldValue || 'none'}</span>
                                    →
                                    <span class="new-value">${edit.newValue}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    startSessionHeartbeat: function() {
        setInterval(() => {
            if (this.currentSession) {
                this.currentSession.lastActivity = new Date().toISOString();
                this.saveSession();
            }
        }, 30000); // Every 30 seconds
    },

    bindEvents: function() {
        // Track status changes
        document.addEventListener('click', (e) => {
            if (e.target.closest('.status-btn')) {
                const btn = e.target.closest('.status-btn');
                const objectiveItem = btn.closest('.objective-item');
                const controlItem = objectiveItem?.closest('.control-item');
                
                if (objectiveItem && controlItem) {
                    const objectiveId = objectiveItem.dataset.objectiveId;
                    const controlId = controlItem.dataset.controlId;
                    const newStatus = btn.dataset.status;
                    
                    // Get old status from app data
                    const oldStatus = app?.assessmentData?.[objectiveId]?.status || 'not-assessed';
                    
                    if (oldStatus !== newStatus) {
                        this.trackEdit(objectiveId, controlId, 'status_change', oldStatus, newStatus);
                    }
                }
            }

            // Show edit history button
            if (e.target.closest('.show-history-btn')) {
                const btn = e.target.closest('.show-history-btn');
                const objectiveId = btn.dataset.objectiveId;
                const controlId = btn.dataset.controlId;
                this.showEditHistory(objectiveId, controlId);
            }
        });

        // Track POA&M creation
        const poamForm = document.getElementById('poam-form');
        if (poamForm) {
            poamForm.addEventListener('submit', () => {
                const objectiveId = document.getElementById('poam-objective-id')?.value;
                if (objectiveId) {
                    this.logActivity('poam_created', `Created POA&M for ${objectiveId}`, { objectiveId });
                }
            });
        }

        // Track exports
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.logActivity('export', 'Exported assessment data');
            });
        }
    },

    showActivityPanel: function() {
        const panel = document.createElement('div');
        panel.className = 'activity-panel-overlay';
        panel.innerHTML = `
            <div class="activity-panel">
                <div class="activity-panel-header">
                    <h3>Recent Activity</h3>
                    <button class="panel-close" onclick="this.closest('.activity-panel-overlay').remove()">×</button>
                </div>
                <div class="activity-panel-body">
                    <div id="activity-feed"></div>
                </div>
                <div class="activity-panel-footer">
                    <button class="btn-secondary" onclick="LocalCollaboration.clearActivityLog()">Clear History</button>
                    <button class="btn-secondary" onclick="LocalCollaboration.exportActivityLog()">Export Log</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        this.updateActivityFeed();
    },

    clearActivityLog: function() {
        if (confirm('Clear all activity history?')) {
            this.activityLog = [];
            this.saveActivityLog();
            this.updateActivityFeed();
            this.showToast('Activity log cleared', 'success');
        }
    },

    exportActivityLog: function() {
        const data = {
            exportDate: new Date().toISOString(),
            session: this.currentSession,
            activities: this.activityLog,
            editHistory: this.editHistory
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `activity-log-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Activity log exported', 'success');
    },

    showToast: function(message, type = 'info') {
        if (typeof app !== 'undefined' && app.showToast) {
            app.showToast(message, type);
        } else {
            console.log(`[LocalCollaboration] ${type}: ${message}`);
        }
    }
};

// Initialize
if (typeof document !== 'undefined') {
    document.readyState === 'loading' ? 
        document.addEventListener('DOMContentLoaded', () => LocalCollaboration.init()) : 
        LocalCollaboration.init();
}

if (typeof window !== 'undefined') {
    window.LocalCollaboration = LocalCollaboration;
}
