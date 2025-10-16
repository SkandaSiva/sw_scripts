const vapidPublicKey = 'BI9ZtEmEPPOdWviUDaixBhQbEfC9dmQXQlgQX4ohmLXGBlRbz-OOLd0e-qpIPdQ9D5IqbwgTDEfdjreY2-D7nVo', licenseCode = '~47b660c0';
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.3/workbox-sw.js');

// Logging to verify the service worker is loaded
console.log('Service Worker loaded: ', new Date());

// Precaching
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// Caching specific JS file
workbox.routing.registerRoute(
    'https://www.livehindustan.com/static/js/lh-script_prod.js',
    new workbox.strategies.CacheFirst({
        cacheName: 'scripts-cache',
        plugins: [
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    })
);

// Caching page routes
const pageHandler = new workbox.strategies.NetworkFirst({
    cacheName: 'pages-cache',
    plugins: [
        new workbox.expiration.ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 1 * 24 * 60 * 60, // 1 day
        }),
    ],
});

const pageRoutes = [
    '/', '/national/', '/state/', '/international/', '/cricket/',
    '/sports/', '/astrology/', '/business/', '/gallery/',
    '/career/', '/health/', '/lifestyle/', '/blog/',
    '/gadgets/', '/auto/', '/crime/', '/entertainment',
    '/national', '/state', '/international', '/cricket',
    '/sports', '/astrology', '/business', '/gallery',
    '/career', '/health', '/lifestyle', '/blog',
    '/gadgets', '/auto', '/crime',  new RegExp('^https?://.*\\.html$'),
];

pageRoutes.forEach(route => workbox.routing.registerRoute(route, pageHandler));

// Caching image assets
workbox.routing.registerRoute(
    new RegExp('^https://www.livehindustan.com/(.*)\\.(?:png|webp|jpg|jpeg|svg|gif|ico|pdf)'),
    new workbox.strategies.CacheFirst({
        cacheName: 'image-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 200,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    })
);

// Caching AMP JS files
workbox.routing.registerRoute(
    /^https:\/\/cdn\.ampproject\.org\/.*/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'amp-js-cache',
    })
);

// Skip waiting to activate the new service worker immediately
self.addEventListener('install', event => {
    self.skipWaiting(); // This line forces the new service worker to activate
});

// Claim clients to control existing pages
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});


