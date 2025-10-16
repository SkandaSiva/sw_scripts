(global => {
    'use strict';

    // Load the sw-tookbox library.
    importScripts('/sw-toolbox.js');

    // Turn on debug logging, visible in the Developer Tools' console.
    global.toolbox.options.debug = true;

    // Media
    toolbox.router.get('/images/(.*)', global.toolbox.cacheFirst, {
        cache: {
            name: 'app-images',
            maxEntries: 10,
            maxAgeSeconds: 86400 // cache for a day
        }
    });

    // App Core
    toolbox.router.get('/app/(.*)', global.toolbox.fastest, {
        cache: {
            name: 'app-core',
            maxEntries: 20
        }
    });

    // Static Resources
    toolbox.router.get('/static/(.*)', global.toolbox.cacheFirst, {
        cache: {
            name: 'app-core-static',
            maxEntries: 20
        }
    });

    // Pages
    // /images/ /css/ /media/ /scripts/ /static/
    toolbox.router.get(/^(?!.*\/(images|scripts|media|static|css)).*\/[^\/\.]*$/, global.toolbox.networkFirst, {
        cache: {
            name: 'app-core-pages',
            maxEntries: 20
        }
    });

    // Google
    toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
        cache: {
            name: 'cdn-googleapis',
            maxEntries: 10,
            maxAgeSeconds: 86400 // cache for a day
        },
        origin: /\.googleapis\.com$/,
        // Set a timeout threshold of 2 seconds
        networkTimeoutSeconds: 2
    });

    // Cloudflare
    toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
        cache: {
            name: 'cdn-cloudflare',
            maxEntries: 10,
            maxAgeSeconds: 86400 // cache for a day
        },
        origin: /\.cloudflare\.com$/,
        // Set a timeout threshold of 2 seconds
        networkTimeoutSeconds: 2
    });

    // Bootstrap
    toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
        cache: {
            name: 'cdn-boostrap',
            maxEntries: 10,
            maxAgeSeconds: 86400 // cache for a day
        },
        origin: /\.bootstrapcdn\.com$/,
        // Set a timeout threshold of 2 seconds
        networkTimeoutSeconds: 2
    });

    // By default, all requests that don't match our custom handler will use the toolbox.networkFirst
    // cache strategy, and their responses will be stored in the default cache.
    global.toolbox.router.default = global.toolbox.networkOnly;

    // Boilerplate to ensure our service worker takes control of the page as soon as possible.
    global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
    global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));
})(self);