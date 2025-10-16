(function(global) {
    'use strict';
    var REQUIRED_ASSETS = [
        { url: 'favicon.ico', revision: '20200502' },
        { url: 'images/logo.png', revision: '20200502' },
        { url: 'images/categories.svg', revision: '20200502' },
        { url: 'images/catalog-categories.svg', revision: '20200502' },
        { url: 'images/icons.98b51eed9733f231.svg', revision: null },
        { url: 'images/social.svg', revision: '20200502' },
        { url: 'images/flags/en.svg', revision: '20200502' },
        { url: 'images/flags/bg.svg', revision: '20200502' },
        { url: 'css/frontend/icons.svg', revision: '20200502' },
        { url: 'css/frontend/site.cbcb2ae8b58aeb93.css', revision: null },
        { url: 'css/frontend/page-home.2fed6119822d4395.css', revision: null },
        { url: 'js/frontend/app.7bcb01f7e9ac6cd7.js', revision: null }
    ];

    importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

    if (workbox) {
        workbox.precaching.precacheAndRoute(REQUIRED_ASSETS);

        workbox.routing.registerRoute(/\.(?:js|css)$/, new workbox.strategies.StaleWhileRevalidate());

        workbox.routing.registerRoute(
            /\.(?:png|gif|jpg|jpeg|svg)$/,
            new workbox.strategies.CacheFirst({
                cacheName: 'images',
                plugins: [
                    new workbox.expiration.ExpirationPlugin({
                        maxEntries: 60,
                        maxAgeSeconds: 30 * 24 * 60 * 60,
                        purgeOnQuotaError: true
                    })
                ]
            })
        );

        // workbox.routing.registerRoute(new RegExp('/'+PAGES.join('|')+'$'), new workbox.strategies.StaleWhileRevalidate());

        workbox.routing.registerRoute(
            'https://fonts.(?:googleapis|gstatic).com/(.*)',
            new workbox.strategies.StaleWhileRevalidate({
                cacheName: 'fonts'
            })
        );

        workbox.googleAnalytics.initialize();
    }

    global.addEventListener('install', function(event) {
        event.waitUntil(global.skipWaiting())
    });

    global.addEventListener('activate', function(event) {
        event.waitUntil(global.clients.claim());
    });

})(self);
