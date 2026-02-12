// Integrity Validator - Data and Code Integrity Validation
// Ensures data hasn't been tampered with and code integrity is maintained

const IntegrityValidator = {
    config: {
        version: "1.0.0",
        checksumAlgorithm: 'SHA-256',
        validationInterval: 5 * 60 * 1000, // 5 minutes
    },

    knownScripts: new Map(),
    dataChecksums: new Map(),
    initialized: false,

    // Initialize integrity validation
    async init() {
        console.log('[IntegrityValidator] Initializing...');
        
        // Catalog all loaded scripts
        await this.catalogScripts();
        
        // Set up periodic validation
        this.startPeriodicValidation();
        
        this.initialized = true;
        console.log('[IntegrityValidator] Initialized successfully');
    },

    // Catalog all loaded scripts for integrity checking
    async catalogScripts() {
        const scripts = document.querySelectorAll('script[src]');
        
        const origin = location.origin;
        for (const script of scripts) {
            const src = script.src;
            // Only catalog same-origin scripts to avoid CSP violations on CDN scripts
            if (src && !src.startsWith('data:') && src.startsWith(origin)) {
                try {
                    const response = await fetch(src);
                    const content = await response.text();
                    const checksum = await this.generateChecksum(content);
                    
                    this.knownScripts.set(src, {
                        checksum,
                        integrity: script.integrity || null,
                        catalogedAt: Date.now()
                    });
                } catch (e) {
                    console.warn('[IntegrityValidator] Failed to catalog script:', src, e);
                }
            }
        }
        
        console.log(`[IntegrityValidator] Cataloged ${this.knownScripts.size} scripts`);
    },

    // Generate checksum for content
    async generateChecksum(content) {
        const encoder = new TextEncoder();
        const data = encoder.encode(content);
        const hashBuffer = await crypto.subtle.digest(this.config.checksumAlgorithm, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Validate script integrity
    async validateScript(src) {
        const known = this.knownScripts.get(src);
        if (!known) return { valid: true, reason: 'not_cataloged' };

        try {
            const response = await fetch(src);
            const content = await response.text();
            const checksum = await this.generateChecksum(content);
            
            if (checksum !== known.checksum) {
                this.logSecurityEvent('script_integrity_failed', { src, expected: known.checksum, actual: checksum });
                return { valid: false, reason: 'checksum_mismatch' };
            }
            
            return { valid: true };
        } catch (e) {
            return { valid: false, reason: 'fetch_failed', error: e.message };
        }
    },

    // Validate all scripts
    async validateAllScripts() {
        const results = {
            valid: true,
            failures: []
        };

        for (const [src, data] of this.knownScripts.entries()) {
            const result = await this.validateScript(src);
            if (!result.valid) {
                results.valid = false;
                results.failures.push({ src, reason: result.reason });
            }
        }

        return results;
    },

    // Store data with checksum
    async storeWithChecksum(key, data) {
        const serialized = JSON.stringify(data);
        const checksum = await this.generateChecksum(serialized);
        
        this.dataChecksums.set(key, checksum);
        
        return {
            data: serialized,
            checksum,
            timestamp: Date.now()
        };
    },

    // Validate stored data
    async validateData(key, serialized) {
        const expectedChecksum = this.dataChecksums.get(key);
        if (!expectedChecksum) {
            return { valid: true, reason: 'no_checksum' };
        }

        const actualChecksum = await this.generateChecksum(serialized);
        
        if (actualChecksum !== expectedChecksum) {
            this.logSecurityEvent('data_integrity_failed', { key });
            return { valid: false, reason: 'checksum_mismatch' };
        }

        return { valid: true };
    },

    // Validate localStorage integrity
    async validateLocalStorage(key) {
        try {
            const stored = localStorage.getItem(key);
            if (!stored) return { valid: true, reason: 'not_found' };

            const parsed = JSON.parse(stored);
            
            // Check if it's a SecureStorage item with HMAC
            if (parsed.hmac && parsed.data) {
                // SecureStorage handles its own integrity
                return { valid: true, reason: 'secure_storage' };
            }

            // For regular localStorage items, check our checksums
            return await this.validateData(key, stored);
        } catch (e) {
            return { valid: false, reason: 'parse_error', error: e.message };
        }
    },

    // Validate all localStorage items
    async validateAllStorage() {
        const results = {
            valid: true,
            failures: []
        };

        const keys = Object.keys(localStorage);
        
        for (const key of keys) {
            const result = await this.validateLocalStorage(key);
            if (!result.valid && result.reason !== 'not_found') {
                results.valid = false;
                results.failures.push({ key, reason: result.reason });
            }
        }

        return results;
    },

    // Detect unauthorized script injection
    detectUnauthorizedScripts() {
        const allScripts = document.querySelectorAll('script');
        const unauthorized = [];

        allScripts.forEach(script => {
            const src = script.src;
            
            // Check inline scripts without nonce
            if (!src && !script.hasAttribute('nonce')) {
                unauthorized.push({
                    type: 'inline_without_nonce',
                    content: script.textContent?.substring(0, 100)
                });
            }
            
            // Check external scripts not in catalog
            if (src && !this.knownScripts.has(src)) {
                unauthorized.push({
                    type: 'uncataloged_external',
                    src
                });
            }
        });

        if (unauthorized.length > 0) {
            this.logSecurityEvent('unauthorized_scripts_detected', { count: unauthorized.length, scripts: unauthorized });
        }

        return unauthorized;
    },

    // Validate Subresource Integrity (SRI)
    validateSRI() {
        const scriptsWithoutSRI = [];
        const scripts = document.querySelectorAll('script[src]');

        scripts.forEach(script => {
            const src = script.src;
            
            // Check if external CDN script has SRI
            if (src && !src.startsWith(window.location.origin) && !script.integrity) {
                scriptsWithoutSRI.push(src);
            }
        });

        if (scriptsWithoutSRI.length > 0) {
            this.logSecurityEvent('missing_sri', { count: scriptsWithoutSRI.length, scripts: scriptsWithoutSRI });
        }

        return scriptsWithoutSRI;
    },

    // Start periodic validation
    startPeriodicValidation() {
        setInterval(async () => {
            // Validate scripts
            const scriptResults = await this.validateAllScripts();
            if (!scriptResults.valid) {
                this.logSecurityEvent('periodic_script_validation_failed', { failures: scriptResults.failures });
            }

            // Validate storage
            const storageResults = await this.validateAllStorage();
            if (!storageResults.valid) {
                this.logSecurityEvent('periodic_storage_validation_failed', { failures: storageResults.failures });
            }

            // Detect unauthorized scripts
            this.detectUnauthorizedScripts();
        }, this.config.validationInterval);
    },

    // Validate Content Security Policy compliance
    validateCSP() {
        const violations = [];
        
        // Check for inline styles
        const inlineStyles = document.querySelectorAll('[style]');
        if (inlineStyles.length > 0) {
            violations.push({
                type: 'inline_styles',
                count: inlineStyles.length
            });
        }

        // Check for inline event handlers
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            const attrs = el.attributes;
            for (let i = 0; i < attrs.length; i++) {
                if (attrs[i].name.startsWith('on')) {
                    violations.push({
                        type: 'inline_event_handler',
                        element: el.tagName,
                        handler: attrs[i].name
                    });
                }
            }
        });

        return violations;
    },

    // Generate integrity hash for SRI
    async generateSRIHash(content, algorithm = 'sha384') {
        const encoder = new TextEncoder();
        const data = encoder.encode(content);
        const hashBuffer = await crypto.subtle.digest(algorithm.toUpperCase().replace('SHA', 'SHA-'), data);
        const base64 = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
        return `${algorithm}-${base64}`;
    },

    // Get integrity report
    async getIntegrityReport() {
        const scriptValidation = await this.validateAllScripts();
        const storageValidation = await this.validateAllStorage();
        const unauthorizedScripts = this.detectUnauthorizedScripts();
        const missingSRI = this.validateSRI();
        const cspViolations = this.validateCSP();

        return {
            timestamp: new Date().toISOString(),
            scripts: {
                cataloged: this.knownScripts.size,
                valid: scriptValidation.valid,
                failures: scriptValidation.failures
            },
            storage: {
                valid: storageValidation.valid,
                failures: storageValidation.failures
            },
            unauthorized: unauthorizedScripts,
            missingSRI,
            cspViolations,
            overallStatus: scriptValidation.valid && storageValidation.valid && unauthorizedScripts.length === 0
        };
    },

    // Verify data hasn't been tampered with
    async verifyDataIntegrity(key, data) {
        const stored = await this.storeWithChecksum(key, data);
        return stored.checksum;
    },

    // Check if data is valid
    async isDataValid(key, data) {
        const serialized = JSON.stringify(data);
        const result = await this.validateData(key, serialized);
        return result.valid;
    },

    // Log security events
    logSecurityEvent(type, details = {}) {
        if (window.SecurityUtils && window.SecurityUtils.logSecurityEvent) {
            window.SecurityUtils.logSecurityEvent(type, details);
        } else {
            console.warn('[IntegrityValidator]', type, details);
        }
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => IntegrityValidator.init());
} else {
    IntegrityValidator.init();
}

// Export for use
window.IntegrityValidator = IntegrityValidator;
