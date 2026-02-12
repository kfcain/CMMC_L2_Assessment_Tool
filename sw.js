// Service Worker for CMMC Assessment Tool
// Provides offline caching and faster repeat visits

const CACHE_NAME = 'cmmc-tool-v77';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Core files that should always be cached
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/app-main.js',
    '/styles.css',
    '/css/impl-planner.css',
    '/css/evidence.css',
    '/css/theme-picker.css',
    '/css/crosswalk.css',
    '/css/osc-inventory.css',
    '/css/arch-guide.css',
    '/css/enhanced-features.css',
    '/css/msp-portal.css',
    '/css/comprehensive-guidance.css',
    '/styles/api-tester.css',
    '/js/lazy-loader.js',
    '/js/security.js',
    '/js/theme-picker.js',
    '/js/report-generator.js',
    '/js/inherited-controls.js',
    '/js/portfolio-dashboard.js',
    '/js/evidence-builder.js',
    '/js/msp-portal.js',
    '/js/msp-portal-views.js',
    '/js/rev3-crosswalk.js',
    '/js/cmmc-l3-assessment.js',
    '/js/api-tester.js',
    '/js/comprehensive-guidance-ui.js',
    '/data/families-ac-at-au.js',
    '/data/families-cm-ia.js',
    '/data/families-ir-ma-mp-ps-pe.js',
    '/data/families-ra-ca-sc-si.js',
    '/data/sprs-scoring.js',
    '/data/ctrl-xref.js',
    '/data/loader.js',
    '/data/nist-800-172a.js',
    '/data/nist-800-171a-r3.js',
    '/data/msp-portal-data.js',
    '/data/msp-automation-platforms.js',
    '/data/msp-cloud-templates.js',
    '/data/msp-aws-compliance-toolkit.js',
    '/data/msp-azure-compliance-toolkit.js',
    '/data/msp-gcp-compliance-toolkit.js',
    '/data/msp-evidence-lists.js',
    '/data/msp-data-protection.js',
    '/data/api-evidence-collection.js',
    '/data/comprehensive-implementation-guidance.js',
    '/data/comprehensive-guidance-expansion-part2.js',
    '/data/comprehensive-guidance-expansion-part3.js',
    '/data/comprehensive-guidance-expansion-part4.js',
    '/data/comprehensive-guidance-expansion-part5.js',
    '/data/comprehensive-guidance-soc.js',
    '/data/comprehensive-guidance-l3.js',
    '/data/comprehensive-guidance-r3-new.js',
    '/data/comprehensive-guidance-r3-new2.js',
    '/data/comprehensive-guidance-grc.js',
    '/data/comprehensive-guidance-nutanix.js',
    '/data/comprehensive-guidance-mdm-mam.js',
    '/data/impl-notes-expanded.js',
    '/js/vendor-logos.js',
    '/js/fedramp-marketplace.js',
    '/css/fedramp-marketplace.css',
    '/css/settings-page.css',
    '/js/settings-page.js',
    '/css/fedramp-explorer.css',
    '/js/fedramp-explorer.js',
    '/js/docs-hub.js',
    '/css/docs-hub.css',
    '/css/responsive.css',
    '/favicon.svg'
];

// Install event - cache core assets
self.addEventListener('install', event => {
    console.log('[SW] Installing service worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching core assets');
                return cache.addAll(CORE_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch(err => console.error('[SW] Cache failed:', err))
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating service worker...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - network-first with cache fallback
// Always serve fresh content when online; fall back to cache when offline
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip external requests (CDNs, APIs)
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) {
        return;
    }
    
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // Cache successful responses for offline fallback
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, responseClone));
                }
                return networkResponse;
            })
            .catch(() => {
                // Network failed — serve from cache (offline support)
                return caches.match(event.request)
                    .then(cachedResponse => {
                        if (cachedResponse) return cachedResponse;
                        // Last resort: serve index.html for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
                    });
            })
    );
});

// Listen for messages from the app
self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
    
    // Force refresh cache
    if (event.data === 'clearCache') {
        caches.delete(CACHE_NAME).then(() => {
            console.log('[SW] Cache cleared');
        });
    }
});
