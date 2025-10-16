importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

const version = 'v2.4';

// Detailed logging is very useful during development
//workbox.setConfig({debug: true});

// Updating SW lifecycle to update the app after user triggered refresh
workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.precaching.cleanupOutdatedCaches();


if (workbox) {

    // top-level routes we want to precache
    workbox.precaching.precacheAndRoute([
        {url: '/offline', revision: version},
        {url: '/styles/ar/desktop.css', revision: version},
        {url: '/images/theme-error.svg', revision: version},
    ]);


    // injected assets by Workbox CLI
    //workbox.precaching.precacheAndRoute([]);

    // Catch routing errors, like if the user is offline
    workbox.routing.setCatchHandler(async ({
        event
    }) => {
        // Return the precached offline page if a document is being requested
        if (event.request.destination === "document") {
            return caches.match(workbox.precaching.getCacheKeyForURL('/offline'));
        }

        return Response.error();
    });


    // js/css files
    workbox.routing.registerRoute(
        /\.(?:js|css|woff|woff2|svg)$/,
        new workbox.strategies.CacheFirst({
            cacheName: "app-shell-files-" + version,
            plugins: [
                new workbox.expiration.Plugin({
                    // Cache for a maximum of a week.
                    maxAgeSeconds: 7 * 24 * 60 * 60
                })
            ]
        })
    );

    // images
    workbox.routing.registerRoute(
        // Cache image files.
        /\.(?:png|jpg|jpeg|gif)$/,
        // Use the cache if it's available.
        new workbox.strategies.CacheFirst({
            // Use a custom cache name.
            cacheName: "image-cache-" + version,
            plugins: [
                new workbox.expiration.Plugin({
                    // Cache upto 50 images.
                    maxEntries: 5000,
                    // Cache for a maximum of a week.
                    maxAgeSeconds: 7 * 24 * 60 * 60
                })
            ]
        })
    );

    // Main files
    workbox.routing.registerRoute(
        ({
            url,
            request,
            event
        }) => {
            return (
                !url.pathname.endsWith(".js") &&
                !url.pathname.endsWith(".css") &&
                !url.pathname.endsWith(".png") &&
                !url.pathname.endsWith(".jpg") &&
                !url.pathname.endsWith(".jpeg") &&
                !url.pathname.endsWith(".svg") &&
                !url.pathname.endsWith(".gif")
            );
        },
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: "files-cache-" + version,
            plugins: [
                new workbox.expiration.Plugin({
                    maxAgeSeconds: 10 * 60 // 10 minutes
                })
            ]
        })

        /* new workbox.strategies.NetworkFirst({
            networkTimeoutSeconds: 3,
            cacheName: "files-cache-"+version
            plugins: [
                new workbox.expiration.Plugin({
                    maxAgeSeconds: 10 * 60 // 10 minutes
                })
            ]
        })*/


    );


    // Clear old caches
    var clearOldCaches = function (event) {
        event.waitUntil(
            caches.keys().then(function (cacheNames) {
                let validCacheSet = new Set(Object.values(workbox.core.cacheNames));
                return Promise.all(
                    cacheNames
                    .filter(function (cacheName) {
                        return !validCacheSet.has(cacheName);
                    })
                    .map(function (cacheName) {
                        return caches.delete(cacheName);
                    })
                );
            })
        );
    };

    self.addEventListener("activate", function (event) {
        clearOldCaches(event);
    });
}
