importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.setConfig({ debug: false });

workbox.routing.registerRoute(
    /^https\:\/\/www\.ingenio\-web\.it\/?(?:\#.*)?$/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'html-cache'
    })
);

workbox.routing.registerRoute(
    /\.js(?:\?\d*)?$/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'js-cache'
    })
);

workbox.routing.registerRoute(
    /\.css(?:\?\d*)?$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'css-cache'
    })
);

workbox.routing.registerRoute(
    /.*(?:googleapis|gstatic)\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'gstatic-cache'
    })
);

workbox.routing.registerRoute(
    /\.(?:icomoon\.eot|icomoon\.svg|icomoon\.ttf|icomoon\.woff)$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'icon-cache'
    })
);

workbox.routing.registerRoute(
    /\.(?:png|svg|gif)$/, //HEADS UP: no jpg
    new workbox.strategies.CacheFirst({
        cacheName: 'images-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

