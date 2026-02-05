// Security Monitor - Real-time Threat Detection and Monitoring
// Detects and responds to suspicious activity and security anomalies

const SecurityMonitor = {
    config: {
        version: "1.0.0",
        maxFailedAttempts: 5,
        lockoutDuration: 15 * 60 * 1000, // 15 minutes
        anomalyThreshold: 10,
        monitoringInterval: 60 * 1000, // 1 minute
    },

    metrics: {
        failedValidations: 0,
        suspiciousPatterns: 0,
        xssAttempts: 0,
        csrfAttempts: 0,
        integrityFailures: 0,
        sessionAnomalies: 0,
    },

    alerts: [],
    isLocked: false,
    lockoutTimer: null,

    // Initialize security monitoring
    init: function() {
        console.log('[SecurityMonitor] Initializing...');
        
        // Set up periodic monitoring
        this.startMonitoring();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load previous metrics
        this.loadMetrics();
        
        console.log('[SecurityMonitor] Initialized successfully');
    },

    // Start periodic monitoring
    startMonitoring: function() {
        setInterval(() => {
            this.checkForAnomalies();
            this.cleanupOldAlerts();
            this.saveMetrics();
        }, this.config.monitoringInterval);
    },

    // Set up security event listeners
    setupEventListeners: function() {
        // Monitor for suspicious input patterns
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.checkInputSecurity(e.target.value);
            }
        }, true);

        // Monitor for suspicious DOM modifications
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            this.checkNodeSecurity(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Monitor for console tampering attempts
        this.monitorConsole();
    },

    // Check input for security issues
    checkInputSecurity: function(value) {
        if (!value || typeof value !== 'string') return;

        // Use SecurityUtils if available
        if (window.SecurityUtils && window.SecurityUtils.detectSuspiciousInput) {
            if (window.SecurityUtils.detectSuspiciousInput(value)) {
                this.recordThreat('xss_attempt', { 
                    pattern: 'suspicious_input',
                    length: value.length 
                });
                this.metrics.xssAttempts++;
            }
        }

        // Check for excessive length (potential DoS)
        if (value.length > 100000) {
            this.recordThreat('dos_attempt', { 
                type: 'excessive_input',
                length: value.length 
            });
        }
    },

    // Check DOM node for security issues
    checkNodeSecurity: function(node) {
        // Check for inline scripts
        if (node.tagName === 'SCRIPT' && !node.hasAttribute('nonce')) {
            this.recordThreat('unauthorized_script', {
                src: node.src || 'inline',
                content: node.textContent?.substring(0, 100)
            });
        }

        // Check for suspicious iframes
        if (node.tagName === 'IFRAME') {
            const src = node.getAttribute('src');
            if (src && !this.isWhitelistedOrigin(src)) {
                this.recordThreat('suspicious_iframe', { src });
            }
        }

        // Check for event handlers
        const attributes = node.attributes;
        if (attributes) {
            for (let i = 0; i < attributes.length; i++) {
                const attr = attributes[i];
                if (attr.name.startsWith('on')) {
                    this.recordThreat('inline_event_handler', {
                        element: node.tagName,
                        handler: attr.name
                    });
                }
            }
        }
    },

    // Check if origin is whitelisted
    isWhitelistedOrigin: function(url) {
        const whitelist = [
            window.location.origin,
            'https://cdn.sheetjs.com',
            'https://cdn.jsdelivr.net',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];

        try {
            const urlObj = new URL(url, window.location.origin);
            return whitelist.some(allowed => urlObj.origin === allowed || urlObj.href.startsWith(allowed));
        } catch (e) {
            return false;
        }
    },

    // Monitor console for tampering
    monitorConsole: function() {
        const originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error
        };

        // Detect if console methods are overridden
        setInterval(() => {
            if (console.log !== originalConsole.log ||
                console.warn !== originalConsole.warn ||
                console.error !== originalConsole.error) {
                this.recordThreat('console_tampering', {});
            }
        }, 5000);
    },

    // Record security threat
    recordThreat: function(type, details = {}) {
        const threat = {
            type,
            details,
            timestamp: Date.now(),
            userAgent: navigator.userAgent?.substring(0, 100),
            url: window.location.href
        };

        this.alerts.push(threat);
        
        // Keep only last 100 alerts
        if (this.alerts.length > 100) {
            this.alerts.shift();
        }

        // Log to SecurityUtils
        this.logSecurityEvent(type, details);

        // Check if we should lock the application
        this.checkLockout();

        // Update metrics
        this.updateMetrics(type);
    },

    // Update threat metrics
    updateMetrics: function(type) {
        if (type.includes('xss')) {
            this.metrics.xssAttempts++;
        } else if (type.includes('csrf')) {
            this.metrics.csrfAttempts++;
        } else if (type.includes('integrity')) {
            this.metrics.integrityFailures++;
        } else if (type.includes('session')) {
            this.metrics.sessionAnomalies++;
        }

        this.metrics.suspiciousPatterns++;
    },

    // Check if application should be locked
    checkLockout: function() {
        const recentThreats = this.alerts.filter(alert => 
            Date.now() - alert.timestamp < 60000 // Last minute
        );

        if (recentThreats.length >= this.config.maxFailedAttempts) {
            this.lockApplication();
        }
    },

    // Lock application due to security threats
    lockApplication: function() {
        if (this.isLocked) return;

        this.isLocked = true;
        this.logSecurityEvent('application_locked', { 
            reason: 'excessive_threats',
            threatCount: this.alerts.length 
        });

        // Show lockout modal
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.id = 'security-lockout-modal';
        modal.style.zIndex = '10001';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px; border: 3px solid #dc3545;">
                <div class="modal-header" style="background: #dc3545; color: white;">
                    <h2>🔒 Security Lockout</h2>
                </div>
                <div class="modal-body">
                    <p><strong>The application has been locked due to suspicious activity.</strong></p>
                    <p>Multiple security threats were detected in a short period of time.</p>
                    <p>This lockout will automatically expire in 15 minutes, or you can refresh the page to start a new session.</p>
                    <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 4px;">
                        <strong>Detected Threats:</strong>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>XSS Attempts: ${this.metrics.xssAttempts}</li>
                            <li>CSRF Attempts: ${this.metrics.csrfAttempts}</li>
                            <li>Integrity Failures: ${this.metrics.integrityFailures}</li>
                            <li>Session Anomalies: ${this.metrics.sessionAnomalies}</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="window.location.reload()">
                        Refresh Page
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Disable all inputs
        document.querySelectorAll('input, textarea, button, select').forEach(el => {
            el.disabled = true;
        });

        // Set unlock timer
        this.lockoutTimer = setTimeout(() => {
            this.unlockApplication();
        }, this.config.lockoutDuration);
    },

    // Unlock application
    unlockApplication: function() {
        this.isLocked = false;
        
        // Remove lockout modal
        const modal = document.getElementById('security-lockout-modal');
        if (modal) modal.remove();

        // Re-enable inputs
        document.querySelectorAll('input, textarea, button, select').forEach(el => {
            el.disabled = false;
        });

        // Clear alerts
        this.alerts = [];
        
        this.logSecurityEvent('application_unlocked', {});
    },

    // Check for anomalies
    checkForAnomalies: function() {
        // Check session validity
        if (window.SessionManager && !window.SessionManager.isValid()) {
            this.recordThreat('session_invalid', {});
            this.metrics.sessionAnomalies++;
        }

        // Check localStorage integrity
        if (window.IntegrityValidator) {
            const integrityCheck = window.IntegrityValidator.validateAllStorage();
            if (!integrityCheck.valid) {
                this.recordThreat('storage_integrity_failure', {
                    failures: integrityCheck.failures
                });
                this.metrics.integrityFailures++;
            }
        }

        // Check for excessive storage usage
        const storageSize = this.getStorageSize();
        if (storageSize > 5 * 1024 * 1024) { // 5MB
            this.recordThreat('excessive_storage', { size: storageSize });
        }
    },

    // Get total storage size
    getStorageSize: function() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return total;
    },

    // Clean up old alerts
    cleanupOldAlerts: function() {
        const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
        this.alerts = this.alerts.filter(alert => alert.timestamp > cutoff);
    },

    // Get security dashboard data
    getDashboardData: function() {
        return {
            metrics: { ...this.metrics },
            recentAlerts: this.alerts.slice(-10),
            isLocked: this.isLocked,
            threatLevel: this.calculateThreatLevel()
        };
    },

    // Calculate current threat level
    calculateThreatLevel: function() {
        const recentThreats = this.alerts.filter(alert => 
            Date.now() - alert.timestamp < 3600000 // Last hour
        ).length;

        if (recentThreats === 0) return 'low';
        if (recentThreats < 5) return 'medium';
        if (recentThreats < 10) return 'high';
        return 'critical';
    },

    // Save metrics to storage
    saveMetrics: function() {
        try {
            sessionStorage.setItem('security-metrics', JSON.stringify(this.metrics));
        } catch (e) {
            console.error('[SecurityMonitor] Failed to save metrics:', e);
        }
    },

    // Load metrics from storage
    loadMetrics: function() {
        try {
            const saved = sessionStorage.getItem('security-metrics');
            if (saved) {
                this.metrics = { ...this.metrics, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error('[SecurityMonitor] Failed to load metrics:', e);
        }
    },

    // Get security report
    getSecurityReport: function() {
        return {
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            threatLevel: this.calculateThreatLevel(),
            recentAlerts: this.alerts.slice(-20),
            sessionInfo: window.SessionManager?.getSessionInfo(),
            storageSize: this.getStorageSize()
        };
    },

    // Log security events
    logSecurityEvent: function(type, details = {}) {
        if (window.SecurityUtils && window.SecurityUtils.logSecurityEvent) {
            window.SecurityUtils.logSecurityEvent(type, details);
        } else {
            console.warn('[SecurityMonitor]', type, details);
        }
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SecurityMonitor.init());
} else {
    SecurityMonitor.init();
}

// Export for use
window.SecurityMonitor = SecurityMonitor;
