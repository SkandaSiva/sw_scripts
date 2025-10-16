// Filename: service-worker.js

// Define a unique name for your cache
const CACHE_NAME = 'my-pwa-cache-v1';

// Install the service worker
self.addEventListener('install', event => {
    self.skipWaiting(); // Immediately activate the service worker after installation
});

// Intercept fetch requests and serve cached resources or fetch from network
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    // Define the file extensions to cache
    const fileExtensionsToCache = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.woff', '.mp4'];

    // Check if the request URL ends with one of the file extensions to cache
    const shouldCache = fileExtensionsToCache.some(extension => url.pathname.endsWith(extension));

    // Skip caching PHP files and other non-matching types
    if (!shouldCache) {
        event.respondWith(fetch(request));
        return;
    }

    event.respondWith(
        caches.match(request).then(response => {
            if (response) {
                return response;
            }

            // Clone the request because request is a stream and can be consumed only once
            const fetchRequest = request.clone();

            return fetch(fetchRequest).then(response => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response because response is a stream and can be consumed only once
                const responseToCache = response.clone();

                caches.open(CACHE_NAME).then(cache => {
                    cache.put(request, responseToCache);
                });

                return response;
            });
        })
    );
});

//push notification
self.addEventListener('push', function(event) {
    const data = event.data.json();

    const options = {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        image: data.image,
        data: {
            url: data.data.url,
            vibrate: data.data.vibrate
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});


self.addEventListener('pushsubscriptionchange', function(event) {
    event.waitUntil(
        self.registration.pushManager.getSubscription()
            .then(function(subscription) {
                if (subscription) {
                    console.log('Subscription has been changed or invalidated:', subscription);
                    // Send a request to your server to handle the unsubscription
                    sendUnsubscriptionToServer(subscription);
                } else {
                    console.log('Subscription not found');
                }
            })
            .catch(function(error) {
                console.error('Error fetching subscription:', error);
            })
    );
});

function sendUnsubscriptionToServer(subscription) {
    // Construct your request body with subscription information
    const unsubscribeEndpoint = 'https://www.epersianhotel.com/epersianhotel/api/push-notification/unsubscribe.php'; // Replace with your server endpoint
    fetch(unsubscribeEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subscription: subscription })
    }).then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(function(data) {
        console.log('Unsubscribe request sent to server:', data);
    }).catch(function(error) {
        console.error('Error sending unsubscribe request to server:', error);
    });
}

// Clean up old caches when a new version of the service worker is activated
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
