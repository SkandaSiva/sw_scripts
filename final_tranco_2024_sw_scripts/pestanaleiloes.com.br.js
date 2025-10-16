importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

self.addEventListener('activate', event => {
    const promiseChain = caches.keys()
        .then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
            );
        });
    event.waitUntil(promiseChain);
});

self.addEventListener('install', () => {
    self.skipWaiting();
});

if (workbox) {
    workbox.setConfig({debug: false});

    workbox.core.setCacheNameDetails({
        prefix: 'leiloes',
        suffix: 'v1',
        precache: 'leiloes-precache-name',
        runtime: 'leiloes-runtime-name'
    });

    //Offline pages
    workbox.routing.registerRoute(
        ({url}) => url.pathname === '/',
        new workbox.strategies.NetworkFirst({
            cacheName: 'pages'
        })
    );

    //API
    workbox.routing.registerRoute(
        ({url}) => /^\/api\/v2/gi.test(url.pathname) && /(vitrines|estatisticas|parceiro|tipo-bem|lote\/caracteristica\/tipo)$/gi.test(url.pathname) ,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'api'
        }),
    );

    //GED images
    workbox.routing.registerRoute(
        ({url}) => /^https:\/\/ged\.leiloes\.com\.br\/ged\/\d*\.(jpg|png|svg|jpeg|webp|gif|ico)/gi.test(url.href)
            || /^https:\/\/hlg1-ged\.leiloes\.com\.br\/\d*\.(jpg|png|svg|jpeg|webp|gif|ico)/gi.test(url.href),
        new workbox.strategies.CacheFirst({
            cacheName: 'ged-images',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 400,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                })
            ],
        }),
    );

    //Fonts
    workbox.routing.registerRoute(
        ({url}) => /https:\/\/fonts\.googleapis\.com\/css\?.*$/gi.test(url.href)
            || /https:\/\/fonts\.gstatic\.com.*\.(woff2|ttf)$/gi.test(url.href)
            || /font\/.+\.(woff|otf|svg|ttf|woff2)$/gi.test(url.href),
        new workbox.strategies.CacheFirst({
            cacheName: 'fonts'
        }),
    );

    //Static assets
    workbox.routing.registerRoute(
        ({url}) => !/hot-update\.(js|json|css)$/.test(url.href) && /assets\/(css|js)\/(.+)\.(css|js)$/i.test(url.href),
        new workbox.strategies.CacheFirst({
            cacheName: 'common-assets'
        })
    );

    //Static images
    workbox.routing.registerRoute(
        ({url}) => /assets\/media\/(.+)\.(jpg|png|svg|jpeg|webp|gif|ico)$/i.test(url.href)
            || /images\/(.+)\.(jpg|png|svg|jpeg|webp|gif|ico)$/i.test(url.href)
            || /firebasestorage\.googleapis\.com(.+)portal-pestana-leiloes\.appspot\.com/.test(url.href),
        new workbox.strategies.CacheFirst({
            cacheName: 'common-images'
        })
    )
} else {
    console.error(`PWA failed on load 😬`);
}
