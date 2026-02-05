// Security Utilities for NIST Assessment Tool
// Protects against XSS, injection attacks, buffer overflow, and fuzzing attempts

const SecurityUtils = {
    // Maximum allowed string lengths to prevent buffer overflow
    MAX_LENGTHS: {
        input: 10000,
        textarea: 50000,
        url: 2048,
        email: 254,
        name: 500,
        id: 100,
        json: 5000000 // 5MB max for JSON data
    },

    // Sanitize HTML to prevent XSS attacks
    escapeHtml(str) {
        if (str === null || str === undefined) return '';
        if (typeof str !== 'string') str = String(str);
        
        const htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
        
        return str.replace(/[&<>"'`=\/]/g, char => htmlEscapes[char]);
    },

    // Sanitize string for use in attributes
    escapeAttr(str) {
        if (str === null || str === undefined) return '';
        if (typeof str !== 'string') str = String(str);
        return str.replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[char]);
    },

    // Validate and sanitize URL
    sanitizeUrl(url) {
        if (!url || typeof url !== 'string') return '';
        
        // Truncate to max length
        url = url.slice(0, this.MAX_LENGTHS.url);
        
        // Only allow http, https protocols
        try {
            const parsed = new URL(url);
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                return '';
            }
            return parsed.href;
        } catch {
            // If it's a relative URL starting with /, allow it
            if (url.startsWith('/') && !url.startsWith('//')) {
                return url.replace(/[<>"'`]/g, '');
            }
            return '';
        }
    },

    // Validate and truncate string to prevent buffer overflow
    truncate(str, maxLength = this.MAX_LENGTHS.input) {
        if (str === null || str === undefined) return '';
        if (typeof str !== 'string') str = String(str);
        return str.slice(0, maxLength);
    },

    // Sanitize input value (combined truncate + escape)
    sanitizeInput(str, maxLength = this.MAX_LENGTHS.input) {
        return this.escapeHtml(this.truncate(str, maxLength));
    },

    // Validate JSON and check size limits
    validateJson(jsonString, maxSize = this.MAX_LENGTHS.json) {
        if (!jsonString || typeof jsonString !== 'string') {
            return { valid: false, error: 'Invalid input' };
        }
        
        if (jsonString.length > maxSize) {
            return { valid: false, error: 'JSON exceeds maximum size limit' };
        }
        
        try {
            const parsed = JSON.parse(jsonString);
            return { valid: true, data: parsed };
        } catch (e) {
            return { valid: false, error: 'Invalid JSON format' };
        }
    },

    // Safe JSON parse with error handling
    safeJsonParse(jsonString, defaultValue = null) {
        const result = this.validateJson(jsonString);
        return result.valid ? result.data : defaultValue;
    },

    // Sanitize object recursively (for data from localStorage, etc.)
    sanitizeObject(obj, depth = 0, maxDepth = 10) {
        if (depth > maxDepth) return null; // Prevent infinite recursion
        
        if (obj === null || obj === undefined) return obj;
        
        if (typeof obj === 'string') {
            return this.truncate(obj);
        }
        
        if (typeof obj === 'number' || typeof obj === 'boolean') {
            return obj;
        }
        
        if (Array.isArray(obj)) {
            // Limit array size to prevent DoS
            const maxArraySize = 10000;
            return obj.slice(0, maxArraySize).map(item => 
                this.sanitizeObject(item, depth + 1, maxDepth)
            );
        }
        
        if (typeof obj === 'object') {
            const sanitized = {};
            const keys = Object.keys(obj).slice(0, 1000); // Limit number of keys
            for (const key of keys) {
                const sanitizedKey = this.truncate(key, this.MAX_LENGTHS.id);
                sanitized[sanitizedKey] = this.sanitizeObject(obj[key], depth + 1, maxDepth);
            }
            return sanitized;
        }
        
        return null;
    },

    // Validate control ID format (e.g., "3.1.1[a]")
    isValidControlId(id) {
        if (!id || typeof id !== 'string') return false;
        // Allow format like "3.1.1", "3.1.1[a]", "AC-1", etc.
        const controlIdPattern = /^[\d.]+(\[[a-z]\])?$|^[A-Z]{2}-\d+(\.\d+)?$/;
        return controlIdPattern.test(id) && id.length <= this.MAX_LENGTHS.id;
    },

    // Validate email format
    isValidEmail(email) {
        if (!email || typeof email !== 'string') return false;
        if (email.length > this.MAX_LENGTHS.email) return false;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    },

    // Strip potentially dangerous patterns
    stripDangerous(str) {
        if (!str || typeof str !== 'string') return '';
        
        // Remove script tags and event handlers
        return str
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/data:/gi, '')
            .replace(/vbscript:/gi, '');
    },

    // Create safe innerHTML alternative using textContent
    setTextContent(element, text) {
        if (element && typeof text === 'string') {
            element.textContent = this.truncate(text);
        }
    },

    // Safe template literal tag for HTML
    html(strings, ...values) {
        let result = strings[0];
        for (let i = 0; i < values.length; i++) {
            result += this.escapeHtml(values[i]) + strings[i + 1];
        }
        return result;
    },

    // Rate limiting for form submissions
    rateLimiter: {
        attempts: {},
        maxAttempts: 10,
        windowMs: 60000, // 1 minute
        
        check(action) {
            const now = Date.now();
            const key = action || 'default';
            
            if (!this.attempts[key]) {
                this.attempts[key] = { count: 1, resetTime: now + SecurityUtils.rateLimiter.windowMs };
                return true;
            }
            
            if (now > this.attempts[key].resetTime) {
                this.attempts[key] = { count: 1, resetTime: now + SecurityUtils.rateLimiter.windowMs };
                return true;
            }
            
            if (this.attempts[key].count >= this.maxAttempts) {
                return false;
            }
            
            this.attempts[key].count++;
            return true;
        },
        
        reset(action) {
            const key = action || 'default';
            delete this.attempts[key];
        }
    },

    // Detect potential fuzzing/attack patterns
    detectSuspiciousInput(str) {
        if (!str || typeof str !== 'string') return false;
        
        const suspiciousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /\x00/, // Null byte
            /\{\{.*\}\}/, // Template injection
            /\$\{.*\}/, // Template literal injection
            /%00/, // URL-encoded null
            /&#0*;/, // HTML entity null
            /eval\s*\(/i,
            /document\.(cookie|write|location)/i,
            /window\.(location|open)/i,
            /\.constructor\s*\(/,
            /__proto__/,
            /prototype\s*\[/
        ];
        
        return suspiciousPatterns.some(pattern => pattern.test(str));
    },

    // Log security events (for monitoring)
    logSecurityEvent(type, details) {
        const event = {
            timestamp: new Date().toISOString(),
            type,
            details: this.truncate(JSON.stringify(details), 1000),
            userAgent: navigator.userAgent?.slice(0, 200),
            sessionId: window.SessionManager?.getSessionId()?.substring(0, 8) || 'unknown'
        };
        
        // Store in sessionStorage for debugging (limited to last 50 events)
        try {
            const logs = JSON.parse(sessionStorage.getItem('security-logs') || '[]');
            logs.push(event);
            if (logs.length > 50) logs.shift();
            sessionStorage.setItem('security-logs', JSON.stringify(logs));
        } catch (e) {
            // Silently fail if storage is full
        }
        
        // Console warning in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.warn('[Security]', type, details);
        }
    },

    // Prevent clickjacking
    preventClickjacking() {
        if (window.self !== window.top) {
            // Page is in an iframe
            this.logSecurityEvent('clickjacking_attempt', { referrer: document.referrer });
            
            // Break out of frame
            window.top.location = window.self.location;
        }
    },

    // Secure external links
    secureExternalLinks() {
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            const url = new URL(link.href);
            if (url.origin !== window.location.origin) {
                // Add security attributes to external links
                link.setAttribute('rel', 'noopener noreferrer');
                link.setAttribute('target', '_blank');
            }
        });
    },

    // Disable autocomplete on sensitive fields
    disableSensitiveAutocomplete() {
        const sensitiveSelectors = [
            'input[type="password"]',
            'input[name*="secret"]',
            'input[name*="token"]',
            'input[name*="key"]'
        ];

        sensitiveSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(input => {
                input.setAttribute('autocomplete', 'off');
                input.setAttribute('autocorrect', 'off');
                input.setAttribute('autocapitalize', 'off');
                input.setAttribute('spellcheck', 'false');
            });
        });
    },

    // Initialize all security features
    initSecurityFeatures() {
        this.preventClickjacking();
        this.secureExternalLinks();
        this.disableSensitiveAutocomplete();
        
        // Re-run on DOM changes
        const observer = new MutationObserver(() => {
            this.secureExternalLinks();
            this.disableSensitiveAutocomplete();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
};

// Freeze the object to prevent tampering
Object.freeze(SecurityUtils);
Object.freeze(SecurityUtils.MAX_LENGTHS);
Object.freeze(SecurityUtils.rateLimiter);

// Export for use
window.SecurityUtils = SecurityUtils;

// Auto-initialize security features
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SecurityUtils.initSecurityFeatures());
} else {
    SecurityUtils.initSecurityFeatures();
}
