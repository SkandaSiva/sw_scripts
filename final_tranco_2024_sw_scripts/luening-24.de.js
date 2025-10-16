// Update the version to force the browser to reload the js files
const versionName = '4';

importScripts(
    `/bundles/burgluening/pwa/idb.js?v=${versionName}`,
    `/bundles/burgluening/pwa/fastorder.js?v=${versionName}`,
    `/bundles/burgluening/pwa/indexDbUtility.js?v=${versionName}`
);
const CACHE_STATIC_NAME = 'static-v12'
const CACHE_DYNAMIC_NAME = 'dynamic-v16'
self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing Service Worker ...', event);

    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(async cache => {
                try {
                    // Delete specific files if they exist in the cache

                    // Attempt to cache files, with logging for failures
                    const urlsToCache = [
                        '/',
                        '/manifest.json',
                        '/bundles/themelueningtwentyfour/assets/pwa/fastorder.png',
                        '/media/27/1b/4f/1632918625/Logo_Luening_115px.png',
                        '/bundles/themelueningtwentyfour/assets/favicon/favicon-32x32.png',
                    ];

                    const cachePromises = urlsToCache.map(url => {
                        return cache.add(url).catch(error => {
                            console.warn(`[Service Worker] Failed to cache ${url}: `, error);
                        });
                    });

                    // Use Promise.allSettled to ensure all caching attempts are handled
                    await Promise.allSettled(cachePromises);

                } catch (error) {
                    console.error('[Service Worker] Caching failed:', error);
                }
            })
            .then(() => self.skipWaiting())  // Force the waiting Service Worker to become active
    );
});

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating Service Worker ....', event);
    event.waitUntil(
        caches.keys()
            .then(keyList => {
                return Promise.all(keyList.map(key => {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                        console.log('Removing old cache', key);
                        return caches.delete(key);
                    }
                }));
            })
            .then(() => self.clients.claim())  // Take control of all clients immediately
    );
});

let dynamicCacheFiles = [
    'all.js',
    'all.css',
    'bundles/burgluening/pwa'
];
let dynamicCacheRequests = [
    'pwa/fastorder/form',
    'pwa/fastorder/scan/form',
];

fastOrder.initBackgroundSync();

let fallback;
// fetch page, which will be shown if no connection is available
fetch('/pwa/fallback', {
    method: "GET",
}).then(res => {
    if (res.ok) {
        return caches.open(CACHE_DYNAMIC_NAME)
            .then(function (cache) {
                cache.put('/pwa/fallback', res.clone());
            })
    }
})

// fetch widget, which will be shown if no connection is available
fetch('/fallback/widgets/checkout/info', {
    method: "GET",
}).then(res => {
    if (res.ok) {
        return caches.open(CACHE_DYNAMIC_NAME)
            .then(function (cache) {
                console.log('cache widget')
                cache.put('/fallback/widgets/checkout/info', res.clone());
            })
    }
})

// Network-First Cache Strategy with Fallback
self.addEventListener('fetch', function(event) {
    const requestUrl = new URL(event.request.url);

    // Define the domain you want to ignore
    const ignoredDomain = 'datagateway.luening-24.de'; // Replace with the actual domain you want to ignore

    // If the request is to the ignored domain, allow the browser to handle it without the Service Worker
    if (requestUrl.hostname === ignoredDomain) {
        return;
    }

    // Respond to fetch event using handleFetch function
    event.respondWith(handleFetch(event.request));
});

// Function to handle fetch requests
async function handleFetch(request) {
    try {
        // Attempt to fetch the request from the network
        const response = await fetch(request);
        // Cache the response if necessary
        await cacheResponse(request, response);
        // Return the response
        return response;
    } catch (error) {
        // If fetch fails (e.g., due to network unavailability)
        // or if the request is a POST request, handle cache fallback
        if (request.method === 'POST') return;
        // Check if there is a cached response for the request
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;

        // If no cached response exists, handle cache fallback
        return handleCacheFallback(request);
    }
}

// Function to cache the response
async function cacheResponse(request, response) {
    // Open the dynamic cache
    const cache = await caches.open(CACHE_DYNAMIC_NAME);
    // Cache defined files
    for (const element of dynamicCacheFiles) {
        if (request.url.includes(element)) {
            cache.put(request.url, response.clone());
            console.log(request.url, 'cloned');
        }
    }
    // Cache defined requests
    for (const element of dynamicCacheRequests) {
        if (request.url.includes(element) && request.method === 'GET') {
            cache.put(request.url, response.clone());
        }

        // // Import search data if the request is for 'pwa/fastorder/form'
        // if (request.url.includes('pwa/fastorder/form')) {
        //     fastOrder.importSearchData();
        //
        // }
    }
}

// Function to handle cache fallback
async function handleCacheFallback(request) {
    // If the request is for basket checkout information, return the cached fallback
    if (request.url.includes('/widgets/checkout/info')) {
        const cache = await caches.open(CACHE_DYNAMIC_NAME);
        console.log('cache-match fallback');
        return cache.match('/fallback/widgets/checkout/info');
    }
    // If the request is for 'pwa' or 'searchProduct', return nothing
    if (request.url.includes('pwa') || request.url.includes('searchProduct')) {
        return;
    }
    // Otherwise, return the generic cached fallback
    const cache = await caches.open(CACHE_DYNAMIC_NAME);
    return cache.match('/pwa/fallback');
}
