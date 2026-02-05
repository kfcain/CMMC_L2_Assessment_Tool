// CSRF Protection - Cross-Site Request Forgery Prevention
// Implements synchronizer token pattern for state-changing operations

const CSRFProtection = {
    config: {
        version: "1.0.0",
        tokenHeader: 'X-CSRF-Token',
        tokenParam: '_csrf',
        tokenRotationInterval: 30 * 60 * 1000, // 30 minutes
    },

    initialized: false,

    // Initialize CSRF protection
    init: function() {
        console.log('[CSRFProtection] Initializing...');
        
        // Inject tokens into all forms
        this.injectTokensIntoForms();
        
        // Set up AJAX request interceptor
        this.setupAjaxInterceptor();
        
        // Set up token rotation
        this.setupTokenRotation();
        
        this.initialized = true;
        console.log('[CSRFProtection] Initialized successfully');
    },

    // Get current CSRF token from session
    getToken: function() {
        if (window.SessionManager && window.SessionManager.getCsrfToken) {
            return window.SessionManager.getCsrfToken();
        }
        
        // Fallback: generate token if session manager not available
        let token = sessionStorage.getItem('csrf-token');
        if (!token) {
            token = this.generateToken();
            sessionStorage.setItem('csrf-token', token);
        }
        return token;
    },

    // Generate new CSRF token
    generateToken: function() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },

    // Rotate CSRF token
    rotateToken: function() {
        if (window.SessionManager && window.SessionManager.rotateCsrfToken) {
            window.SessionManager.rotateCsrfToken();
        } else {
            const newToken = this.generateToken();
            sessionStorage.setItem('csrf-token', newToken);
        }
        
        // Re-inject tokens into forms
        this.injectTokensIntoForms();
        
        this.logSecurityEvent('csrf_token_rotated');
    },

    // Inject CSRF tokens into all forms
    injectTokensIntoForms: function() {
        const token = this.getToken();
        if (!token) return;

        document.querySelectorAll('form').forEach(form => {
            // Skip if already has token
            let tokenInput = form.querySelector(`input[name="${this.config.tokenParam}"]`);
            
            if (!tokenInput) {
                tokenInput = document.createElement('input');
                tokenInput.type = 'hidden';
                tokenInput.name = this.config.tokenParam;
                form.appendChild(tokenInput);
            }
            
            tokenInput.value = token;
        });
    },

    // Validate CSRF token
    validateToken: function(token) {
        const expectedToken = this.getToken();
        
        if (!token || !expectedToken) {
            this.logSecurityEvent('csrf_validation_failed', { reason: 'missing_token' });
            return false;
        }

        if (token !== expectedToken) {
            this.logSecurityEvent('csrf_validation_failed', { reason: 'token_mismatch' });
            return false;
        }

        return true;
    },

    // Set up AJAX request interceptor
    setupAjaxInterceptor: function() {
        // Intercept fetch requests
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const [resource, config] = args;
            
            // Only add token to same-origin requests
            if (this.isSameOrigin(resource)) {
                const token = this.getToken();
                
                if (!config) {
                    args[1] = { headers: {} };
                }
                
                if (!args[1].headers) {
                    args[1].headers = {};
                }
                
                // Add CSRF token header
                if (args[1].headers instanceof Headers) {
                    args[1].headers.set(this.config.tokenHeader, token);
                } else {
                    args[1].headers[this.config.tokenHeader] = token;
                }
            }
            
            return originalFetch.apply(this, args);
        };

        // Intercept XMLHttpRequest
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            this._url = url;
            this._method = method;
            return originalOpen.apply(this, [method, url, ...rest]);
        };
        
        XMLHttpRequest.prototype.send = function(...args) {
            if (CSRFProtection.isSameOrigin(this._url)) {
                const token = CSRFProtection.getToken();
                this.setRequestHeader(CSRFProtection.config.tokenHeader, token);
            }
            return originalSend.apply(this, args);
        };
    },

    // Check if URL is same-origin
    isSameOrigin: function(url) {
        if (!url) return true;
        
        // Handle relative URLs
        if (url.startsWith('/') || !url.includes('://')) {
            return true;
        }
        
        try {
            const urlObj = new URL(url);
            return urlObj.origin === window.location.origin;
        } catch (e) {
            return true; // Assume same-origin if parsing fails
        }
    },

    // Set up automatic token rotation
    setupTokenRotation: function() {
        setInterval(() => {
            this.rotateToken();
        }, this.config.tokenRotationInterval);
    },

    // Validate form submission
    validateFormSubmission: function(form) {
        const tokenInput = form.querySelector(`input[name="${this.config.tokenParam}"]`);
        
        if (!tokenInput) {
            this.logSecurityEvent('csrf_form_missing_token', { form: form.id || 'unknown' });
            return false;
        }

        return this.validateToken(tokenInput.value);
    },

    // Add CSRF protection to form
    protectForm: function(form) {
        const token = this.getToken();
        
        let tokenInput = form.querySelector(`input[name="${this.config.tokenParam}"]`);
        if (!tokenInput) {
            tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = this.config.tokenParam;
            form.appendChild(tokenInput);
        }
        
        tokenInput.value = token;

        // Add validation on submit
        form.addEventListener('submit', (e) => {
            if (!this.validateFormSubmission(form)) {
                e.preventDefault();
                this.showCSRFError();
                return false;
            }
        });
    },

    // Show CSRF error to user
    showCSRFError: function() {
        if (window.app && window.app.showToast) {
            window.app.showToast('Security validation failed. Please refresh the page.', 'error');
        } else {
            alert('Security validation failed. Please refresh the page.');
        }
    },

    // Verify origin and referrer headers
    verifyOrigin: function(request) {
        const origin = request.headers.get('Origin');
        const referrer = request.headers.get('Referer');
        
        if (!origin && !referrer) {
            this.logSecurityEvent('csrf_missing_origin', {});
            return false;
        }

        const expectedOrigin = window.location.origin;
        
        if (origin && origin !== expectedOrigin) {
            this.logSecurityEvent('csrf_origin_mismatch', { origin, expected: expectedOrigin });
            return false;
        }

        if (referrer && !referrer.startsWith(expectedOrigin)) {
            this.logSecurityEvent('csrf_referrer_mismatch', { referrer, expected: expectedOrigin });
            return false;
        }

        return true;
    },

    // Log security events
    logSecurityEvent: function(type, details = {}) {
        if (window.SecurityUtils && window.SecurityUtils.logSecurityEvent) {
            window.SecurityUtils.logSecurityEvent(type, details);
        } else {
            console.warn('[CSRFProtection]', type, details);
        }
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CSRFProtection.init());
} else {
    CSRFProtection.init();
}

// Export for use
window.CSRFProtection = CSRFProtection;
