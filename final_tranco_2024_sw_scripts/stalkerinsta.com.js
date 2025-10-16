var cacheName = 'stalkerinsta';

self.addEventListener('install', function (event) {
    caches.open(cacheName).then((cache) => {
        cache.addAll([
            // './',
            // './index.html',
            // './como_ver_visitantes_instagram.html',
            // './politica_privacidade.html',
            // './termos.html',
            // './ver_visitantes_instagram.html',
            // './en/how_see_visitors_instagram.html',
            // './en/index.html',
            // './en/privacy_policy.html',
            // './en/see_visitors_instagram.html',
            // './en/terms.html',
            // './en/js/stalkers.js',
            // './js/cDg.js',
            // './js/redirect.js',
            // './js/stalkers.js',
            //'./css/style.css',
            './manifest.webmanifest',
            './images/android-chrome-192x192.png',
            './images/android-chrome-512x512.png',
            './images/maskable_icon.png',
            './images/apple-touch-icon.png',
            './images/favicon-16x16.png',
            './images/favicon-32x32.png',
            './images/favicon.ico',
            './images/instagram_bg.webp',
            './images/instagram_colored_image.webp',
            './images/instagram_image.webp',
        ]);
    });
});

self.addEventListener("fetch", (event) => {
    const req = event.request;
    event.respondWith(cacheFirst(req));
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(req);
    return cachedResponse || fetch(req);
}