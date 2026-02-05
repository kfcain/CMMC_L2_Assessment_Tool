// Session Manager - Secure Session Lifecycle Management
// Protects against session hijacking, fixation, and unauthorized access

const SessionManager = {
    config: {
        version: "1.0.0",
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours inactivity (relaxed for static site)
        absoluteTimeout: 7 * 24 * 60 * 60 * 1000, // 7 days absolute (relaxed for static site)
        fingerprintKey: 'session-fingerprint',
        sessionKey: 'session-data',
        warningTime: 2 * 60 * 1000, // Warn 2 minutes before timeout
        enableTimeoutWarnings: false, // Disabled for static site
        enableTimeoutModals: false, // Disabled for static site
    },

    session: null,
    timeoutWarning: null,
    activityTimer: null,
    absoluteTimer: null,

    // Initialize session management
    init: function() {
        console.log('[SessionManager] Initializing...');
        
        // Check for existing valid session
        const existingSession = this.loadSession();
        if (existingSession && this.validateSession(existingSession)) {
            this.session = existingSession;
            this.refreshSession();
        } else {
            this.createSession();
        }

        // Set up activity monitoring
        this.setupActivityMonitoring();
        
        // Set up timers
        this.resetTimers();

        console.log('[SessionManager] Initialized with session:', this.session.id.substring(0, 8) + '...');
    },

    // Generate cryptographically secure session
    createSession: function() {
        const sessionId = this.generateSecureId();
        const fingerprint = this.generateFingerprint();
        
        this.session = {
            id: sessionId,
            fingerprint: fingerprint,
            createdAt: Date.now(),
            lastActivity: Date.now(),
            csrfToken: this.generateSecureId(),
            version: this.config.version
        };

        this.saveSession();
        this.logSecurityEvent('session_created', { sessionId: sessionId.substring(0, 8) });
    },

    // Generate cryptographically secure ID
    generateSecureId: function() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },

    // Generate browser fingerprint
    generateFingerprint: function() {
        const components = [
            navigator.userAgent,
            navigator.language,
            screen.colorDepth,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            navigator.hardwareConcurrency || 'unknown',
            navigator.platform
        ];

        return this.hashString(components.join('|'));
    },

    // Simple hash function for fingerprinting
    hashString: async function(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Validate session integrity and freshness
    validateSession: function(session) {
        if (!session || !session.id || !session.fingerprint) {
            this.logSecurityEvent('session_invalid', { reason: 'missing_data' });
            return false;
        }

        // Check version compatibility
        if (session.version !== this.config.version) {
            this.logSecurityEvent('session_invalid', { reason: 'version_mismatch' });
            return false;
        }

        // Check absolute timeout
        const age = Date.now() - session.createdAt;
        if (age > this.config.absoluteTimeout) {
            this.logSecurityEvent('session_expired', { reason: 'absolute_timeout', age });
            return false;
        }

        // Check inactivity timeout
        const inactivity = Date.now() - session.lastActivity;
        if (inactivity > this.config.sessionTimeout) {
            this.logSecurityEvent('session_expired', { reason: 'inactivity_timeout', inactivity });
            return false;
        }

        // Validate fingerprint (detect session hijacking)
        const currentFingerprint = this.generateFingerprint();
        if (session.fingerprint !== currentFingerprint) {
            this.logSecurityEvent('session_hijack_attempt', { 
                reason: 'fingerprint_mismatch',
                sessionId: session.id.substring(0, 8)
            });
            return false;
        }

        return true;
    },

    // Refresh session activity timestamp
    refreshSession: function() {
        if (!this.session) return;

        this.session.lastActivity = Date.now();
        this.saveSession();
        this.resetTimers();
    },

    // Save session to storage
    saveSession: function() {
        if (!this.session) return;

        try {
            sessionStorage.setItem(this.config.sessionKey, JSON.stringify(this.session));
        } catch (e) {
            console.error('[SessionManager] Failed to save session:', e);
            this.logSecurityEvent('session_save_failed', { error: e.message });
        }
    },

    // Load session from storage
    loadSession: function() {
        try {
            const sessionData = sessionStorage.getItem(this.config.sessionKey);
            return sessionData ? JSON.parse(sessionData) : null;
        } catch (e) {
            console.error('[SessionManager] Failed to load session:', e);
            return null;
        }
    },

    // Invalidate and clear session
    invalidateSession: function(reason = 'manual') {
        this.logSecurityEvent('session_invalidated', { reason });
        
        // Clear session data
        this.session = null;
        sessionStorage.removeItem(this.config.sessionKey);
        
        // Clear timers
        if (this.activityTimer) clearTimeout(this.activityTimer);
        if (this.absoluteTimer) clearTimeout(this.absoluteTimer);
        if (this.timeoutWarning) clearTimeout(this.timeoutWarning);

        // Optionally redirect or show login
        this.handleSessionExpired(reason);
    },

    // Handle session expiration
    handleSessionExpired: function(reason) {
        // Only log for static site - no intrusive modals
        if (!this.config.enableTimeoutModals) {
            this.logSecurityEvent('session_expired_silent', { reason });
            // Silently create new session instead of showing modal
            this.createSession();
            return;
        }
        
        // Show timeout modal (disabled by default for static site)
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.style.zIndex = '10000';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>⏱️ Session Expired</h2>
                </div>
                <div class="modal-body">
                    <p>Your session has expired due to ${reason === 'inactivity' ? 'inactivity' : 'timeout'}.</p>
                    <p>For your security, please refresh the page to start a new session.</p>
                    <p><strong>Note:</strong> Your work has been automatically saved to local storage.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" onclick="window.location.reload()">
                        Refresh Page
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    // Show timeout warning
    showTimeoutWarning: function() {
        // Skip warnings for static site
        if (!this.config.enableTimeoutWarnings) {
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.id = 'session-warning-modal';
        modal.style.zIndex = '9999';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>⚠️ Session Timeout Warning</h2>
                </div>
                <div class="modal-body">
                    <p>Your session will expire in 2 minutes due to inactivity.</p>
                    <p>Click "Continue Working" to extend your session.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" id="extend-session-btn">
                        Continue Working
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('extend-session-btn').addEventListener('click', () => {
            this.refreshSession();
            modal.remove();
        });
    },

    // Set up activity monitoring
    setupActivityMonitoring: function() {
        const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        
        const handleActivity = () => {
            if (this.session && this.validateSession(this.session)) {
                this.refreshSession();
            }
        };

        // Throttle activity updates to once per minute
        let lastUpdate = 0;
        const throttledHandler = () => {
            const now = Date.now();
            if (now - lastUpdate > 60000) { // 1 minute
                lastUpdate = now;
                handleActivity();
            }
        };

        activityEvents.forEach(event => {
            document.addEventListener(event, throttledHandler, { passive: true });
        });
    },

    // Reset inactivity and absolute timers
    resetTimers: function() {
        // Clear existing timers
        if (this.activityTimer) clearTimeout(this.activityTimer);
        if (this.absoluteTimer) clearTimeout(this.absoluteTimer);
        if (this.timeoutWarning) clearTimeout(this.timeoutWarning);

        // Set timeout warning (2 minutes before expiry)
        this.timeoutWarning = setTimeout(() => {
            this.showTimeoutWarning();
        }, this.config.sessionTimeout - this.config.warningTime);

        // Set inactivity timeout
        this.activityTimer = setTimeout(() => {
            this.invalidateSession('inactivity');
        }, this.config.sessionTimeout);

        // Set absolute timeout
        if (this.session) {
            const remainingTime = this.config.absoluteTimeout - (Date.now() - this.session.createdAt);
            if (remainingTime > 0) {
                this.absoluteTimer = setTimeout(() => {
                    this.invalidateSession('absolute_timeout');
                }, remainingTime);
            }
        }
    },

    // Get current session ID
    getSessionId: function() {
        return this.session?.id || null;
    },

    // Get CSRF token
    getCsrfToken: function() {
        return this.session?.csrfToken || null;
    },

    // Rotate CSRF token
    rotateCsrfToken: function() {
        if (this.session) {
            this.session.csrfToken = this.generateSecureId();
            this.saveSession();
            this.logSecurityEvent('csrf_token_rotated');
        }
    },

    // Check if session is valid
    isValid: function() {
        return this.session && this.validateSession(this.session);
    },

    // Get session info for debugging
    getSessionInfo: function() {
        if (!this.session) return null;

        const now = Date.now();
        return {
            id: this.session.id.substring(0, 8) + '...',
            age: Math.floor((now - this.session.createdAt) / 1000) + 's',
            inactivity: Math.floor((now - this.session.lastActivity) / 1000) + 's',
            remainingTime: Math.floor((this.config.sessionTimeout - (now - this.session.lastActivity)) / 1000) + 's',
            absoluteRemaining: Math.floor((this.config.absoluteTimeout - (now - this.session.createdAt)) / 1000) + 's'
        };
    },

    // Log security events
    logSecurityEvent: function(type, details = {}) {
        if (window.SecurityUtils && window.SecurityUtils.logSecurityEvent) {
            window.SecurityUtils.logSecurityEvent(type, details);
        } else {
            console.warn('[SessionManager]', type, details);
        }
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SessionManager.init());
} else {
    SessionManager.init();
}

// Export for use
window.SessionManager = SessionManager;
