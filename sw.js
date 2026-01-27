// Service Worker for CMMC Assessment Tool
// Provides offline caching and faster repeat visits

const CACHE_NAME = 'cmmc-tool-v2';
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
    '/js/lazy-loader.js',
    '/js/security.js',
    '/js/theme-picker.js',
    '/js/report-generator.js',
    '/js/inherited-controls.js',
    '/js/portfolio-dashboard.js',
    '/js/evidence-builder.js',
    '/data/families-ac-at-au.js',
    '/data/families-cm-ia.js',
    '/data/families-ir-ma-mp-ps-pe.js',
    '/data/families-ra-ca-sc-si.js',
    '/data/sprs-scoring.js',
    '/data/ctrl-xref.js',
    '/data/loader.js',
    '/data/nist-800-172a.js',
    '/data/nist-800-171a-r3.js',
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

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip external requests (CDNs, APIs)
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Return cached version if available
                if (cachedResponse) {
                    // Fetch updated version in background (stale-while-revalidate)
                    fetch(event.request)
                        .then(networkResponse => {
                            if (networkResponse && networkResponse.status === 200) {
                                caches.open(CACHE_NAME)
                                    .then(cache => cache.put(event.request, networkResponse));
                            }
                        })
                        .catch(() => {}); // Ignore network errors for background update
                    
                    return cachedResponse;
                }
                
                // Not in cache, fetch from network
                return fetch(event.request)
                    .then(networkResponse => {
                        // Cache successful responses
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => cache.put(event.request, responseClone));
                        }
                        return networkResponse;
                    })
                    .catch(err => {
                        console.error('[SW] Fetch failed:', err);
                        // Return offline page if available
                        return caches.match('/index.html');
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
