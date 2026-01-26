// Lazy Script Loader - Load data files on demand
// Improves initial page load by deferring non-critical scripts

const LazyLoader = {
    loaded: new Set(),
    loading: new Map(),
    
    // Script configurations - which scripts are needed for which views
    viewScripts: {
        'impl-planner': [
            'data/implementation-planner.js'
        ],
        'impl-guide': [
            'data/gcc-high-guidance.js',
            'data/gcc-high-impl-guide.js',
            'data/aws-govcloud-guidance.js',
            'data/aws-govcloud-impl-guide.js',
            'data/gcp-guidance.js',
            'data/gcp-impl-guide.js',
            'data/enclave-guidance.js',
            'data/impl-notes.js',
            'data/itar-guidance.js'
        ],
        'crosswalk': [
            'data/framework-mappings.js',
            'data/fedramp-20x-ksi.js',
            'data/nist-800-53a.js',
            'js/crosswalk-visualizer.js'
        ]
    },
    
    // Load a single script
    loadScript(src) {
        // Already loaded
        if (this.loaded.has(src)) {
            return Promise.resolve();
        }
        
        // Currently loading
        if (this.loading.has(src)) {
            return this.loading.get(src);
        }
        
        // Add version cache buster
        const versionedSrc = src.includes('?') ? src : `${src}?v=${Date.now()}`;
        
        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = versionedSrc;
            script.async = true;
            
            script.onload = () => {
                this.loaded.add(src);
                this.loading.delete(src);
                console.log(`[LazyLoader] Loaded: ${src}`);
                resolve();
            };
            
            script.onerror = () => {
                this.loading.delete(src);
                console.error(`[LazyLoader] Failed to load: ${src}`);
                reject(new Error(`Failed to load ${src}`));
            };
            
            document.body.appendChild(script);
        });
        
        this.loading.set(src, promise);
        return promise;
    },
    
    // Load all scripts for a view
    async loadViewScripts(viewName) {
        const scripts = this.viewScripts[viewName];
        if (!scripts || scripts.length === 0) {
            return Promise.resolve();
        }
        
        // Filter out already loaded scripts
        const toLoad = scripts.filter(s => !this.loaded.has(s));
        
        if (toLoad.length === 0) {
            return Promise.resolve();
        }
        
        console.log(`[LazyLoader] Loading ${toLoad.length} scripts for view: ${viewName}`);
        
        // Load all scripts in parallel
        return Promise.all(toLoad.map(src => this.loadScript(src)));
    },
    
    // Mark scripts as already loaded (for scripts in HTML)
    markLoaded(src) {
        this.loaded.add(src);
    },
    
    // Preload scripts for a view (non-blocking)
    preloadView(viewName) {
        const scripts = this.viewScripts[viewName];
        if (!scripts) return;
        
        scripts.forEach(src => {
            if (!this.loaded.has(src) && !this.loading.has(src)) {
                // Use link preload for hinting
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.as = 'script';
                link.href = src;
                document.head.appendChild(link);
            }
        });
    }
};

// Expose globally
window.LazyLoader = LazyLoader;
