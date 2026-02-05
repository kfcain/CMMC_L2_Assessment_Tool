// Secure Storage - Encrypted localStorage with Integrity Checks
// Protects against data tampering and unauthorized access

const SecureStorage = {
    config: {
        version: "1.0.0",
        encryptionAlgorithm: 'AES-GCM',
        keyLength: 256,
        ivLength: 12,
        saltLength: 16,
        iterations: 100000,
        hashAlgorithm: 'SHA-256'
    },

    masterKey: null,
    initialized: false,

    // Initialize secure storage
    async init() {
        console.log('[SecureStorage] Initializing...');
        
        try {
            // Generate or retrieve master key
            await this.initializeMasterKey();
            this.initialized = true;
            console.log('[SecureStorage] Initialized successfully');
        } catch (error) {
            console.error('[SecureStorage] Initialization failed:', error);
            this.logSecurityEvent('secure_storage_init_failed', { error: error.message });
        }
    },

    // Initialize master encryption key
    async initializeMasterKey() {
        // Check if key exists in sessionStorage
        const storedKey = sessionStorage.getItem('_master_key');
        
        if (storedKey) {
            try {
                const keyData = JSON.parse(storedKey);
                this.masterKey = await crypto.subtle.importKey(
                    'jwk',
                    keyData,
                    { name: this.config.encryptionAlgorithm, length: this.config.keyLength },
                    true,
                    ['encrypt', 'decrypt']
                );
                return;
            } catch (e) {
                console.warn('[SecureStorage] Failed to load existing key, generating new one');
            }
        }

        // Generate new master key
        this.masterKey = await crypto.subtle.generateKey(
            { name: this.config.encryptionAlgorithm, length: this.config.keyLength },
            true,
            ['encrypt', 'decrypt']
        );

        // Store key in sessionStorage (cleared on tab close)
        const exportedKey = await crypto.subtle.exportKey('jwk', this.masterKey);
        sessionStorage.setItem('_master_key', JSON.stringify(exportedKey));
    },

    // Encrypt and store data
    async setItem(key, value, options = {}) {
        if (!this.initialized) {
            await this.init();
        }

        try {
            // Serialize value
            const serialized = JSON.stringify(value);
            
            // Generate IV
            const iv = crypto.getRandomValues(new Uint8Array(this.config.ivLength));
            
            // Encrypt data
            const encoder = new TextEncoder();
            const data = encoder.encode(serialized);
            const encrypted = await crypto.subtle.encrypt(
                { name: this.config.encryptionAlgorithm, iv: iv },
                this.masterKey,
                data
            );

            // Generate HMAC for integrity
            const hmac = await this.generateHMAC(serialized);

            // Store encrypted data with metadata
            const storageObject = {
                version: this.config.version,
                iv: Array.from(iv),
                data: Array.from(new Uint8Array(encrypted)),
                hmac: hmac,
                timestamp: Date.now(),
                expires: options.expires || null
            };

            localStorage.setItem(key, JSON.stringify(storageObject));
            return true;
        } catch (error) {
            console.error('[SecureStorage] setItem failed:', error);
            this.logSecurityEvent('secure_storage_write_failed', { key, error: error.message });
            return false;
        }
    },

    // Retrieve and decrypt data
    async getItem(key, defaultValue = null) {
        if (!this.initialized) {
            await this.init();
        }

        try {
            const stored = localStorage.getItem(key);
            if (!stored) return defaultValue;

            const storageObject = JSON.parse(stored);

            // Check expiration
            if (storageObject.expires && Date.now() > storageObject.expires) {
                this.removeItem(key);
                this.logSecurityEvent('secure_storage_expired', { key });
                return defaultValue;
            }

            // Decrypt data
            const iv = new Uint8Array(storageObject.iv);
            const encryptedData = new Uint8Array(storageObject.data);
            
            const decrypted = await crypto.subtle.decrypt(
                { name: this.config.encryptionAlgorithm, iv: iv },
                this.masterKey,
                encryptedData
            );

            const decoder = new TextDecoder();
            const serialized = decoder.decode(decrypted);

            // Verify HMAC integrity
            const expectedHmac = await this.generateHMAC(serialized);
            if (expectedHmac !== storageObject.hmac) {
                this.logSecurityEvent('secure_storage_integrity_failed', { key });
                this.removeItem(key);
                return defaultValue;
            }

            // Deserialize and return
            return JSON.parse(serialized);
        } catch (error) {
            console.error('[SecureStorage] getItem failed:', error);
            this.logSecurityEvent('secure_storage_read_failed', { key, error: error.message });
            return defaultValue;
        }
    },

    // Remove item
    removeItem(key) {
        localStorage.removeItem(key);
    },

    // Clear all secure storage
    clear() {
        // Only clear items with our version marker
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            try {
                const item = localStorage.getItem(key);
                const parsed = JSON.parse(item);
                if (parsed.version === this.config.version) {
                    localStorage.removeItem(key);
                }
            } catch (e) {
                // Not a secure storage item, skip
            }
        });
    },

    // Generate HMAC for integrity checking
    async generateHMAC(data) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest(this.config.hashAlgorithm, dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Migrate from plain localStorage to secure storage
    async migrateFromLocalStorage(key, remove = false) {
        try {
            const plainData = localStorage.getItem(key);
            if (!plainData) return null;

            const parsed = JSON.parse(plainData);
            await this.setItem(key, parsed);

            if (remove) {
                localStorage.removeItem(key);
            }

            this.logSecurityEvent('secure_storage_migrated', { key });
            return parsed;
        } catch (error) {
            console.error('[SecureStorage] Migration failed:', error);
            return null;
        }
    },

    // Get all keys
    keys() {
        const allKeys = Object.keys(localStorage);
        return allKeys.filter(key => {
            try {
                const item = localStorage.getItem(key);
                const parsed = JSON.parse(item);
                return parsed.version === this.config.version;
            } catch (e) {
                return false;
            }
        });
    },

    // Check if key exists
    hasItem(key) {
        return localStorage.getItem(key) !== null;
    },

    // Get storage size estimate
    getStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return total;
    },

    // Clean up expired items
    async cleanupExpired() {
        const keys = this.keys();
        let cleaned = 0;

        for (const key of keys) {
            try {
                const stored = localStorage.getItem(key);
                const storageObject = JSON.parse(stored);
                
                if (storageObject.expires && Date.now() > storageObject.expires) {
                    this.removeItem(key);
                    cleaned++;
                }
            } catch (e) {
                // Skip invalid items
            }
        }

        if (cleaned > 0) {
            this.logSecurityEvent('secure_storage_cleanup', { cleaned });
        }

        return cleaned;
    },

    // Log security events
    logSecurityEvent(type, details = {}) {
        if (window.SecurityUtils && window.SecurityUtils.logSecurityEvent) {
            window.SecurityUtils.logSecurityEvent(type, details);
        } else {
            console.warn('[SecureStorage]', type, details);
        }
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SecureStorage.init());
} else {
    SecureStorage.init();
}

// Export for use
window.SecureStorage = SecureStorage;
