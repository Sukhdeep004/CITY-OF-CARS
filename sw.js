// ============================================================================
// SERVICE WORKER (sw.js)
// ============================================================================
// This Service Worker handles:
// 1. Caching strategies (Cache-First, Network-First, Stale-While-Revalidate)
// 2. Offline functionality
// 3. Background synchronization
// 4. Push notifications setup
//
// Service Workers run in the background, separate from the main thread
// They intercept network requests and can serve cached responses
// ============================================================================

const CACHE_VERSION = 'v1';
const CACHE_NAME = `city-of-cars-${CACHE_VERSION}`;
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;

// Assets to cache on Service Worker installation
// These are critical assets needed for basic functionality
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/performance.html',
    '/css/styles.css',
    '/js/main.js',
    '/js/performance.js',
    '/manifest.json'
];

// ============================================================================
// 1. INSTALL EVENT
// ============================================================================
// The install event fires when the Service Worker is registered
// This is where we cache critical static assets
// 
// Lifecycle: install → activate → fetch
self.addEventListener('install', event => {
    console.log('[SW] Install event triggered');

    // Pre-cache critical assets
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[SW] Caching static assets...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                // Skip waiting - activate immediately
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[SW] Installation failed:', error);
            })
    );
});

// ============================================================================
// 2. ACTIVATE EVENT
// ============================================================================
// The activate event fires when the Service Worker becomes active
// This is where we clean up old cache versions
self.addEventListener('activate', event => {
    console.log('[SW] Activate event triggered');

    // Clean up old cache versions
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Delete caches from previous versions
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Claim all clients
            return self.clients.claim();
        })
    );
});

// ============================================================================
// 3. FETCH EVENT - Request Interception
// ============================================================================
// The fetch event fires for every network request from the page
// We use different caching strategies based on the request type

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Don't cache non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Strategy selection based on request type
    if (isImageRequest(url)) {
        // Images: Cache-First (check cache first, then network)
        event.respondWith(cacheFirstStrategy(request));
    } else if (isAPIRequest(url)) {
        // API calls: Network-First (try network, fallback to cache)
        event.respondWith(networkFirstStrategy(request));
    } else if (isHTMLRequest(url)) {
        // HTML pages: Network-First with fallback
        event.respondWith(networkFirstStrategy(request));
    } else {
        // Other assets (CSS, JS, fonts): Cache-First
        event.respondWith(cacheFirstStrategy(request));
    }
});

// ============================================================================
// 4. CACHING STRATEGIES
// ============================================================================

/**
 * CACHE-FIRST STRATEGY
 * 1. Check if resource is in cache
 * 2. If found, return from cache
 * 3. If not found, fetch from network
 * 4. Cache the network response
 * 
 * Best for: Static assets (images, CSS, JS)
 * Pros: Fastest offline support
 * Cons: Updates won't be reflected until cache expires
 */
async function cacheFirstStrategy(request) {
    try {
        // Check if response is already cached
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            console.log('[SW] Cache HIT:', request.url);
            return cachedResponse;
        }

        // Not in cache, fetch from network
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('[SW] Cached from network:', request.url);
        }

        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache-first strategy failed:', error);
        
        // Return offline page if available
        return caches.match('/offline.html') || 
               new Response('Offline - Resource not available', { status: 503 });
    }
}

/**
 * NETWORK-FIRST STRATEGY
 * 1. Try to fetch from network
 * 2. If successful, cache response and return it
 * 3. If network fails, return cached version
 * 
 * Best for: Dynamic content (HTML pages, API responses)
 * Pros: Always gets fresh content when possible
 * Cons: Slower initial load if network is slow
 */
async function networkFirstStrategy(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('[SW] Updated cache from network:', request.url);
        }

        return networkResponse;
    } catch (error) {
        // Network failed, try cache
        console.log('[SW] Network failed, checking cache:', request.url);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('[SW] Returning cached version:', request.url);
            return cachedResponse;
        }

        // No network and no cache
        console.error('[SW] No network and no cache available');
        return new Response('Offline - Resource not available', { status: 503 });
    }
}

/**
 * STALE-WHILE-REVALIDATE STRATEGY
 * 1. Return cached version immediately if available
 * 2. Fetch fresh version in background
 * 3. Update cache with new version
 * 
 * Best for: Non-critical data that changes occasionally
 * Pros: Fast initial load + fresh data
 * Cons: User sees slightly outdated content initially
 */
async function staleWhileRevalidateStrategy(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);

    // Return cached version immediately
    if (cachedResponse) {
        console.log('[SW] Returning stale cache:', request.url);

        // Update cache in background (don't wait)
        fetch(request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
                console.log('[SW] Updated cache in background:', request.url);
            }
        });

        return cachedResponse;
    }

    // No cache, fetch from network
    try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        return new Response('Offline - Resource not available', { status: 503 });
    }
}

// ============================================================================
// 5. HELPER FUNCTIONS
// ============================================================================

/**
 * Check if URL is an image request
 */
function isImageRequest(url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => url.pathname.endsWith(ext));
}

/**
 * Check if URL is an API request
 */
function isAPIRequest(url) {
    return url.pathname.includes('/api/');
}

/**
 * Check if URL is an HTML request
 */
function isHTMLRequest(url) {
    return url.pathname.endsWith('.html') || url.pathname === '/';
}

// ============================================================================
// 6. MESSAGE HANDLING (Communication with main thread)
// ============================================================================

/**
 * Listen for messages from the main thread (page)
 * Allows the page to send commands to the Service Worker
 */
self.addEventListener('message', event => {
    const { type, payload } = event.data;

    switch (type) {
        case 'SKIP_WAITING':
            // Force activation of new Service Worker
            console.log('[SW] Skipping waiting...');
            self.skipWaiting();
            break;

        case 'CLEAR_CACHE':
            // Clear all caches
            clearAllCaches();
            break;

        case 'GET_CACHE_SIZE':
            // Get total cache size
            getCacheSizeTotal().then(size => {
                event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
            });
            break;

        default:
            console.log('[SW] Unknown message type:', type);
    }
});

/**
 * Clear all caches
 */
async function clearAllCaches() {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(name => caches.delete(name))
        );
        console.log('[SW] All caches cleared');
    } catch (error) {
        console.error('[SW] Failed to clear caches:', error);
    }
}

/**
 * Get total size of all caches
 */
async function getCacheSizeTotal() {
    try {
        const cacheNames = await caches.keys();
        let totalSize = 0;

        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();

            for (const request of requests) {
                const response = await cache.match(request);
                if (response) {
                    const blob = await response.blob();
                    totalSize += blob.size;
                }
            }
        }

        return totalSize;
    } catch (error) {
        console.error('[SW] Failed to calculate cache size:', error);
        return 0;
    }
}

// ============================================================================
// 7. BACKGROUND SYNC (Optional - Advanced Feature)
// ============================================================================

/**
 * Background Sync allows queuing failed requests
 * and retrying them when connection is restored
 * 
 * Note: This requires registration in the main thread:
 * navigator.serviceWorker.ready.then(reg => {
 *     reg.sync.register('sync-tag');
 * });
 */
self.addEventListener('sync', event => {
    if (event.tag === 'sync-tag') {
        event.waitUntil(syncFailedRequests());
    }
});

async function syncFailedRequests() {
    console.log('[SW] Background sync triggered');
    // Implement sync logic here
    // This would retry any failed requests
}

// ============================================================================
// LOGGING & DEBUGGING
// ============================================================================

console.log('[SW] Service Worker script loaded');
console.log('[SW] Cache name:', CACHE_NAME);
console.log('[SW] Version:', CACHE_VERSION);
