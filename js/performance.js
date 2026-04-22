// ============================================================================
// PERFORMANCE.JS - Web Performance Optimization Demonstrations
// ============================================================================
// This file demonstrates:
// 1. RequestAnimationFrame (RAF) for smooth animations
// 2. Service Worker registration and management
// 3. Cache API usage and management
// 4. Performance monitoring
// ============================================================================

// ============================================================================
// 1. REQUESTANIMATIONFRAME (RAF) ANIMATION SYSTEM
// ============================================================================

// Variables for animation control
let animationFrameId = null;
let animationRunning = false;
let position = 0;
const animationSpeed = 8; // pixels per frame
const maxPosition = 85; // percentage of container width

/**
 * Animate the box using RequestAnimationFrame
 * RAF automatically syncs with browser refresh rate (60fps)
 * More efficient than setTimeout/setInterval
 * 
 * Benefits:
 * - Synchronized with screen refresh rate
 * - Automatic pause when tab is not visible
 * - Better battery efficiency
 * - No frame skipping or jank
 */
function animate() {
    const box = document.getElementById('animatedBox');

    // Update position
    position += animationSpeed;

    // Bounce back when reaching end
    if (position > maxPosition) {
        position = 0;
    }

    // Apply transformation (uses GPU acceleration)
    box.style.transform = `translateX(${position}%)`;

    // Update FPS and frame time metrics
    updatePerformanceMetrics();

    // Request next animation frame
    // This is the key to smooth 60fps animations
    animationFrameId = requestAnimationFrame(animate);
}

/**
 * Start the animation
 * Called when user clicks "Start Animation" button
 */
function startAnimation() {
    if (!animationRunning) {
        animationRunning = true;
        animate(); // Start the RAF loop
        console.log('[Performance] Animation started with requestAnimationFrame');
    }
}

/**
 * Stop the animation
 * Called when user clicks "Stop Animation" button
 * Cancels the animation frame request
 */
function stopAnimation() {
    if (animationRunning) {
        animationRunning = false;
        cancelAnimationFrame(animationFrameId); // Stop the RAF loop
        console.log('[Performance] Animation stopped - RAF cancelled');
    }
}

/**
 * Reset animation to starting position
 */
function resetAnimation() {
    stopAnimation();
    position = 0;
    document.getElementById('animatedBox').style.transform = 'translateX(0%)';
    console.log('[Performance] Animation reset');
}

/**
 * Track and display animation performance metrics
 * Shows FPS and frame time
 */
let lastFrameTime = performance.now();
let frameCount = 0;
let fps = 0;

function updatePerformanceMetrics() {
    const currentTime = performance.now();
    const frameDuration = currentTime - lastFrameTime;

    // Update FPS counter
    frameCount++;
    if (frameCount % 10 === 0) {
        fps = Math.round(1000 / frameDuration);
        document.getElementById('rafFps').textContent = fps;
        document.getElementById('frameTime').textContent = frameDuration.toFixed(2);
    }

    lastFrameTime = currentTime;
}

// ============================================================================
// 2. SERVICE WORKER MANAGEMENT
// ============================================================================

/**
 * Check if Service Workers are supported
 * Service Workers are the backbone of PWA functionality
 */
const hasServiceWorkerSupport = 'serviceWorker' in navigator;

/**
 * Register the Service Worker
 * Service Workers enable:
 * - Offline functionality
 * - Background sync
 * - Push notifications
 * - Network request interception
 */
function registerServiceWorker() {
    if (!hasServiceWorkerSupport) {
        console.warn('[SW] Service Workers are not supported in this browser');
        updateSWStatus('Not Supported', false);
        return;
    }

    navigator.serviceWorker.register('sw.js')
        .then(registration => {
            console.log('[SW] Service Worker registered successfully', registration);
            updateSWStatus('Active', true);

            // Listen for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'activated') {
                        console.log('[SW] New Service Worker activated');
                    }
                });
            });
        })
        .catch(error => {
            console.error('[SW] Service Worker registration failed:', error);
            updateSWStatus('Failed', false);
        });
}

/**
 * Update the Service Worker status display
 * Shows visual indicator of SW registration status
 */
function updateSWStatus(status, isActive) {
    const statusElement = document.getElementById('swStatus');
    statusElement.textContent = status;
    statusElement.className = 'sw-status ' + (isActive ? 'sw-active' : 'sw-inactive');
}

/**
 * Unregister the Service Worker
 */
function unregisterServiceWorker() {
    if (!hasServiceWorkerSupport) return;

    navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
            registration.unregister();
            console.log('[SW] Service Worker unregistered');
            updateSWStatus('Unregistered', false);
        });
    });
}

// ============================================================================
// 3. CACHE API MANAGEMENT
// ============================================================================

const CACHE_NAME = 'city-of-cars-cache-v1';

/**
 * Check if Cache API is available
 * Returns true if the browser supports the Cache API
 */
const hasCacheSupport = 'caches' in window;

/**
 * Initialize caches with essential assets
 * This would be called during app initialization
 */
async function initializeCaches() {
    if (!hasCacheSupport) {
        console.log('[Cache] Cache API not supported');
        return;
    }

    try {
        const cache = await caches.open(CACHE_NAME);
        console.log('[Cache] Cache storage initialized:', CACHE_NAME);

        // In a real app, you would pre-cache critical assets
        // Example:
        // const urlsToCache = [
        //     '/',
        //     '/css/styles.css',
        //     '/js/main.js',
        //     '/js/performance.js'
        // ];
        // await cache.addAll(urlsToCache);
    } catch (error) {
        console.error('[Cache] Cache initialization failed:', error);
    }
}

/**
 * Cache-First Strategy
 * Check cache first, if not found, fetch from network
 * Best for static assets that don't change often
 * 
 * Use case: Images, CSS, JS files with versioning
 */
async function cacheFirstStrategy(url) {
    try {
        const cache = await caches.open(CACHE_NAME);
        
        // Check if response is in cache
        const cachedResponse = await cache.match(url);
        if (cachedResponse) {
            console.log('[Cache] Cache HIT:', url);
            return cachedResponse;
        }

        // Not in cache, fetch from network
        const networkResponse = await fetch(url);
        
        // Cache the response
        if (networkResponse.ok) {
            cache.put(url, networkResponse.clone());
            console.log('[Cache] Cached from network:', url);
        }

        return networkResponse;
    } catch (error) {
        console.error('[Cache] Cache-first strategy failed:', error);
    }
}

/**
 * Network-First Strategy
 * Try network first, fallback to cache if offline
 * Best for frequently updated content
 * 
 * Use case: HTML pages, API responses
 */
async function networkFirstStrategy(url) {
    try {
        // Try network first
        const networkResponse = await fetch(url);
        
        // Update cache with new response
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(url, networkResponse.clone());
            console.log('[Cache] Updated cache from network:', url);
        }

        return networkResponse;
    } catch (error) {
        // Network failed, use cache
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(url);
        
        if (cachedResponse) {
            console.log('[Cache] Network failed, using cached version:', url);
            return cachedResponse;
        }

        // No network and no cache - offline
        console.error('[Cache] Offline and no cache available');
        throw new Error('Offline and no cached response available');
    }
}

/**
 * Stale-While-Revalidate Strategy
 * Return cached version immediately, update in background
 * Best for balance between speed and freshness
 * 
 * Use case: User profiles, frequently accessed data
 */
async function staleWhileRevalidateStrategy(url) {
    try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(url);

        // Return cache immediately if available
        if (cachedResponse) {
            console.log('[Cache] Returning stale cache:', url);
        }

        // Fetch fresh version in background
        fetch(url).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
                cache.put(url, networkResponse.clone());
                console.log('[Cache] Updated stale cache in background:', url);
            }
        });

        return cachedResponse || fetch(url);
    } catch (error) {
        console.error('[Cache] Stale-while-revalidate failed:', error);
    }
}

/**
 * Clear entire cache
 * Useful for cache busting or reset
 */
async function clearCache() {
    if (!hasCacheSupport) return;

    try {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('[Cache] All caches cleared');
    } catch (error) {
        console.error('[Cache] Failed to clear caches:', error);
    }
}

/**
 * Get cache statistics
 * Returns size and item count
 */
async function getCacheStats() {
    if (!hasCacheSupport) return null;

    try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();

        let totalSize = 0;
        for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }

        return {
            itemCount: keys.length,
            totalSize: totalSize,
            formattedSize: formatBytes(totalSize)
        };
    } catch (error) {
        console.error('[Cache] Failed to get stats:', error);
        return null;
    }
}

// ============================================================================
// 4. PERFORMANCE MONITORING & UTILITIES
// ============================================================================

/**
 * Format bytes to human-readable format
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get Core Web Vitals
 * Monitors LCP (Largest Contentful Paint)
 * FID (First Input Delay)
 * CLS (Cumulative Layout Shift)
 */
function monitorWebVitals() {
    if ('PerformanceObserver' in window) {
        // Monitor LCP (Largest Contentful Paint)
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('[Vitals] LCP:', lastEntry.renderTime || lastEntry.loadTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.log('[Vitals] LCP monitoring not supported');
        }

        // Monitor FID (First Input Delay)
        try {
            const fidObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    console.log('[Vitals] FID:', entry.processingDuration);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.log('[Vitals] FID monitoring not supported');
        }
    }
}

/**
 * Get performance navigation timing
 * Shows page load breakdown
 */
function getPageLoadMetrics() {
    if ('PerformanceTiming' in window) {
        const timing = window.performance.timing;
        const metrics = {
            'DNS Lookup': timing.domainLookupEnd - timing.domainLookupStart,
            'TCP Connection': timing.connectEnd - timing.connectStart,
            'Request Time': timing.responseStart - timing.requestStart,
            'Response Time': timing.responseEnd - timing.responseStart,
            'DOM Parse': timing.domInteractive - timing.domLoading,
            'DOMContentLoaded': timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
            'Total Load Time': timing.loadEventEnd - timing.navigationStart
        };

        console.log('[Performance Metrics]', metrics);
        return metrics;
    }
}

// ============================================================================
// 5. NETWORK STATUS MONITORING
// ============================================================================

/**
 * Monitor network connection status
 * Updates UI with online/offline status
 */
function monitorNetworkStatus() {
    const updateStatus = () => {
        const status = navigator.onLine ? 'Online' : 'Offline';
        document.getElementById('networkStatus').textContent = status;
        console.log('[Network] Status changed to:', status);
    };

    // Initial status
    updateStatus();

    // Listen for changes
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
}

/**
 * Check available storage APIs
 */
function checkStorageAPIs() {
    const support = {
        'Cache API': hasCacheSupport,
        'Service Worker': hasServiceWorkerSupport,
        'LocalStorage': typeof localStorage !== 'undefined',
        'IndexedDB': typeof indexedDB !== 'undefined',
        'Web Workers': typeof Worker !== 'undefined'
    };

    console.log('[Storage APIs]', support);

    const cacheSupport = hasCacheSupport ? 'Supported ✓' : 'Not Supported ✗';
    document.getElementById('cacheSupport').textContent = cacheSupport;
}

// ============================================================================
// 6. INITIALIZATION
// ============================================================================

/**
 * Initialize all performance monitoring on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Performance.js] Initializing performance monitoring...');

    // Initialize modules
    checkStorageAPIs();
    monitorNetworkStatus();
    monitorWebVitals();

    // Log performance metrics
    setTimeout(() => {
        getPageLoadMetrics();
    }, 1000);

    // Auto-animate on load (optional)
    // startAnimation();

    console.log('[Performance.js] Initialization complete');
    console.log('[Tips] Open DevTools Console to see detailed logs');
});

// ============================================================================
// DEBUGGING UTILITIES
// ============================================================================

/**
 * Log comprehensive performance report to console
 */
function logPerformanceReport() {
    console.group('🚀 PERFORMANCE REPORT');
    
    console.group('Animation Status');
    console.log('Running:', animationRunning);
    console.log('FPS:', fps);
    console.log('Position:', position);
    console.groupEnd();

    console.group('Service Worker');
    console.log('Supported:', hasServiceWorkerSupport);
    console.log('Active registrations:', navigator.serviceWorker?.controller ? 'Yes' : 'No');
    console.groupEnd();

    console.group('Cache API');
    console.log('Supported:', hasCacheSupport);
    getCacheStats().then(stats => {
        if (stats) {
            console.log('Items cached:', stats.itemCount);
            console.log('Total size:', stats.formattedSize);
        }
    });
    console.groupEnd();

    console.group('Network');
    console.log('Online:', navigator.onLine);
    console.log('Effective Type:', navigator.connection?.effectiveType);
    console.log('Save Data:', navigator.connection?.saveData);
    console.groupEnd();

    getPageLoadMetrics();

    console.groupEnd();
}

// Make it available in console
window.logPerformanceReport = logPerformanceReport;
window.clearCache = clearCache;
window.getCacheStats = getCacheStats;

console.log('[Performance.js] All utilities loaded. Type logPerformanceReport() in console for detailed stats.');
