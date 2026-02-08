// Shared Sanitization & Input Validation Utility
// Provides XSS protection, input length limits, and localStorage size guards
// Must be loaded before all other JS modules

const Sanitize = {
    // HTML entity map for escaping
    _entityMap: {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#96;'
    },

    // Escape HTML entities to prevent XSS when inserting user data into DOM
    html(str) {
        if (str === null || str === undefined) return '';
        return String(str).replace(/[&<>"'`/]/g, s => Sanitize._entityMap[s]);
    },

    // Alias for compatibility with existing code patterns
    escapeHtml(str) {
        return Sanitize.html(str);
    },

    // Escape for use inside HTML attribute values (double-quote context)
    attr(str) {
        if (str === null || str === undefined) return '';
        return String(str).replace(/[&<>"'`/\\]/g, s => Sanitize._entityMap[s] || ('&#' + s.charCodeAt(0) + ';'));
    },

    // Strip all HTML tags from a string
    stripTags(str) {
        if (str === null || str === undefined) return '';
        return String(str).replace(/<[^>]*>/g, '');
    },

    // Truncate string to max length with ellipsis
    truncate(str, maxLen = 1000) {
        if (str === null || str === undefined) return '';
        const s = String(str);
        return s.length > maxLen ? s.substring(0, maxLen) + '...' : s;
    },

    // Sanitize user input: strip tags, trim, enforce max length
    input(str, maxLen = 5000) {
        if (str === null || str === undefined) return '';
        let s = String(str).trim();
        s = s.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        s = s.replace(/<[^>]*>/g, '');
        if (s.length > maxLen) s = s.substring(0, maxLen);
        return s;
    },

    // Validate and sanitize a URL (only allow http/https/mailto)
    url(str) {
        if (str === null || str === undefined) return '';
        const s = String(str).trim();
        if (!s) return '';
        try {
            const u = new URL(s);
            if (['http:', 'https:', 'mailto:'].includes(u.protocol)) return s;
            return '';
        } catch {
            // Allow relative URLs
            if (s.startsWith('/') || s.startsWith('./') || s.startsWith('../')) return s;
            return '';
        }
    },

    // Validate email format
    isValidEmail(str) {
        if (!str) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(str).trim());
    },

    // Validate IP address (v4 or v6 basic)
    isValidIP(str) {
        if (!str) return false;
        const s = String(str).trim();
        // IPv4
        if (/^(\d{1,3}\.){3}\d{1,3}$/.test(s)) {
            return s.split('.').every(n => parseInt(n) >= 0 && parseInt(n) <= 255);
        }
        // IPv6 basic
        if (/^[0-9a-fA-F:]+$/.test(s) && s.includes(':')) return true;
        return false;
    },

    // Enforce max length on a value, return truncated if over
    enforceMaxLength(str, max = 10000) {
        if (str === null || str === undefined) return '';
        const s = String(str);
        return s.length > max ? s.substring(0, max) : s;
    },

    // localStorage size guard — estimate total usage and warn/block if near limit
    storage: {
        MAX_BYTES: 4.5 * 1024 * 1024, // 4.5 MB soft limit (browsers allow ~5-10 MB)
        WARN_BYTES: 3.5 * 1024 * 1024, // Warn at 3.5 MB

        getUsageBytes() {
            let total = 0;
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    total += (key.length + (localStorage.getItem(key) || '').length) * 2; // UTF-16
                }
            } catch (e) {
                console.warn('[Sanitize] Could not calculate localStorage usage:', e);
            }
            return total;
        },

        getUsageMB() {
            return (this.getUsageBytes() / (1024 * 1024)).toFixed(2);
        },

        isNearLimit() {
            return this.getUsageBytes() > this.WARN_BYTES;
        },

        isAtLimit() {
            return this.getUsageBytes() > this.MAX_BYTES;
        },

        // Safe setItem with size check
        safeSet(key, value) {
            const valStr = typeof value === 'string' ? value : JSON.stringify(value);
            const entrySize = (key.length + valStr.length) * 2;

            if (entrySize > 1024 * 1024) {
                console.warn(`[Sanitize] Refusing to store ${key}: value is ${(entrySize / 1024).toFixed(0)} KB (>1 MB single entry limit)`);
                return false;
            }

            if (this.isAtLimit()) {
                console.warn(`[Sanitize] localStorage near capacity (${this.getUsageMB()} MB). Cannot store ${key}.`);
                return false;
            }

            try {
                localStorage.setItem(key, valStr);
                if (this.isNearLimit()) {
                    console.warn(`[Sanitize] localStorage usage: ${this.getUsageMB()} MB — approaching limit`);
                }
                return true;
            } catch (e) {
                console.error(`[Sanitize] Failed to write to localStorage:`, e);
                return false;
            }
        }
    },

    // Sanitize an entire object's string values (shallow)
    object(obj, maxFieldLen = 5000) {
        if (!obj || typeof obj !== 'object') return obj;
        const result = Array.isArray(obj) ? [] : {};
        for (const [key, val] of Object.entries(obj)) {
            if (typeof val === 'string') {
                result[key] = Sanitize.input(val, maxFieldLen);
            } else if (typeof val === 'object' && val !== null) {
                result[key] = Sanitize.object(val, maxFieldLen);
            } else {
                result[key] = val;
            }
        }
        return result;
    },

    // Prevent prototype pollution in JSON.parse
    safeParse(jsonStr) {
        try {
            const obj = JSON.parse(jsonStr);
            if (obj && typeof obj === 'object') {
                delete obj.__proto__;
                delete obj.constructor;
                delete obj.prototype;
            }
            return obj;
        } catch (e) {
            console.warn('[Sanitize] Failed to parse JSON:', e);
            return null;
        }
    }
};

// Freeze to prevent tampering
Object.freeze(Sanitize._entityMap);
Object.freeze(Sanitize.storage);
Object.freeze(Sanitize);

// Global shorthand
const escHtml = Sanitize.html;

console.log('[Sanitize] Security utilities loaded');
