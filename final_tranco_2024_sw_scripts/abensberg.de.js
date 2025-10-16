importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

const NAME = 'de_abensberg_v4';

if (workbox) {
    workbox.setConfig({
        debug: true
    });
    workbox.core.setCacheNameDetails({
        prefix: NAME,
        precache: 'install-time',
        runtime: 'run-time',
        googleAnalytics: 'ga',
    });

    workbox.routing.registerRoute(
        /(.*)pimcore_editmode(.*)/,
        new workbox.strategies.NetworkOnly()
    );

    workbox.routing.registerRoute(
        /^(?!.*(\/admin\/)).*\/[^\.]*(\.html?|\.php)?$/,
        new workbox.strategies.NetworkFirst({
            cacheName: `${NAME}__html`,
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 128,
                    maxAgeSeconds: 60 * 60, // 1h
                }),
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
            ],
        }),
    );



    workbox.routing.registerRoute(
        /^(?!.*(\/admin\/)).*\.css($|\?.*$)/,
        new workbox.strategies.CacheFirst({
            cacheName: `${NAME}__css`,
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 128,
                    maxAgeSeconds: 7 * 24 * 60 * 60, // 7d
                }),
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
            ],
        }),
    );

    workbox.routing.registerRoute(
        /^(?!.*(\/admin\/)).*\.js($|\?.*$)/,
        new workbox.strategies.CacheFirst({
            cacheName: `${NAME}__js`,
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 128,
                    maxAgeSeconds: 7 * 24 * 60 * 60, // 7d
                }),
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
            ],
        }),
    );

    workbox.routing.registerRoute(
        /^(?!.*(\/admin\/)).*\.(?:png|jpe?g|svg|gif|webp)($|\?.*$)/,
        new workbox.strategies.CacheFirst({
            cacheName: `${NAME}__image`,
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 128,
                    maxAgeSeconds: 7 * 24 * 60 * 60, // 7d
                }),
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
            ],
        }),
    );

    workbox.routing.registerRoute(
        /^(?!.*(\/admin\/)).*\.(?:woff2?|ttf|eot)($|\?.*$)/,
        new workbox.strategies.CacheFirst({
            cacheName: `${NAME}__fonts`,
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 128,
                    maxAgeSeconds: 7 * 24 * 60 * 60, // 7d
                }),
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
            ],
        }),
    );

    workbox.googleAnalytics.initialize();
}

//Add PUSH SW
importScripts('https://static.cleverpush.com/channel/worker/qTsXuhRCjft3796nD.js' + self.location.search);
