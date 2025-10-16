// Service Worker

// Push event
self.addEventListener('push', function (event) {
    // Parse the incoming push notification data as JSON
    const pushData = event.data.json();

    // Extract the title from the push data
    const title = pushData.title;

    // Extract the options from the push data
    const options = {
        body: pushData.body,
        icon: pushData.icon,
        badge: pushData.badge,
        unreadCount: pushData.unreadCount,
        actions: [
            { action: 'open', title: 'Open App' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    };

    let promises = [];

    if ('setAppBadge' in self.navigator) {
        const badgeCount = 1;
        // Promise to set the badge
        const promise = self.navigator.setAppBadge(badgeCount);
        promises.push(promise);
    }

    event.waitUntil(
        self.registration.showNotification(title, options)
    );

    // Finally...
    event.waitUntil(Promise.all(promises));
});

const CACHE_VERSION = 'v1';
const CACHE_NAME = `linknbio-content-${CACHE_VERSION}`;
const API_URL = '/api/feed';

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.add(API_URL);
        })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    const pathname = new URL(event.request.url).pathname;
    const requestMethod = event.request.method;
    const exemptPaths = [
        '/admin/sociallinks',
        '/admin/layouts',
        '/admin/profile',
        '/admin/plans'
    ];

    // Handle feed API requests
    if (event.request.url.includes(API_URL)) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                return cachedResponse || fetch(event.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone()); // Cache the feed API response
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }

    // Check if request is for admin and not exempt
    if (!pathname.includes('/admin') ||
        exemptPaths.some((exempt) => pathname.includes(exempt)) ||
        requestMethod !== 'GET') {
        event.respondWith(fetch(event.request));
        return;
    }

    // Serve from cache or fetch from network
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response; // Serve from cache
                }

                // Fetch from network and cache the response
                return fetch(event.request)
                    .then((response) => {
                        if (response && response.status === 200 && response.type === 'basic') {
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseToCache); // This will overwrite the existing entry
                            });
                        }

                        return response;
                    });
            })
    );

    // Ensure /all and /account pages are cached if not already cached
    if (['/all', '/account'].includes(pathname) && !navigator.serviceWorker.controller) {
        caches.open(CACHE_NAME)
            .then((cache) => {
                cache.match(event.request)
                    .then((response) => {
                        if (!response) {
                            fetch(event.request)
                                .then((newResponse) => {
                                    if (newResponse && newResponse.status === 200 && newResponse.type === 'basic') {
                                        cache.put(event.request, newResponse.clone()); // Cache the new response
                                    }
                                });
                        }
                    });
            });
    }
});

// Activate event
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Cache Management
self.addEventListener('message', (event) => {
    const { action } = event.data;

    if (action === 'CLEAR_CACHE') {
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            self.clients.claim(); // Ensure that the new service worker takes control immediately
        });
    } else if (action === 'CACHE_RESOURCE') {
        const url = event.data.url;
        caches.open(CACHE_NAME).then((cache) => {
            fetch(url).then((response) => {
                if (response && response.status === 200) {
                    cache.put(url, response);
                    console.log(`Cached new version of: ${url}`);
                }
            }).catch((error) => {
                console.error(`Error fetching ${url}:`, error);
            });
        });
    } else if (action === 'CACHE_RESOURCE_WITH_CONTENT') {
        const cacheUrl = event.data.cacheUrl;
        const fetchUrl = event.data.fetchUrl;
        caches.open(CACHE_NAME).then((cache) => {
            fetch(fetchUrl).then((response) => {
                if (response && response.status === 200) {
                    cache.put(cacheUrl, response.clone());
                    console.log(`Cached ${cacheUrl} with content from ${fetchUrl}`);
                }
            }).catch((error) => {
                console.error(`Error fetching ${fetchUrl}:`, error);
            });
        });
    }
});

// Periodic Data Refreshing
setInterval(() => {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            caches.open(CACHE_NAME)
                .then(cache => cache.put(API_URL, new Response(JSON.stringify(data))))
                .then(() => {
                    // Notify the page that new data is available
                    self.clients.matchAll().then(clients => {
                        clients.forEach(client => {
                            client.postMessage({ action: 'NEW_DATA_AVAILABLE' });
                        });
                    });
                });
        })
        .catch(error => console.error('Error refreshing API data:', error));
}, 300000); // 5 minutes