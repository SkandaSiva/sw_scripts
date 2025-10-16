importScripts('/app/assets/js/workbox-v6.1.0/workbox-sw.js');

workbox.setConfig({
    modulePathPrefix: '/app/assets/js/workbox-v6.1.0/',
    debug:false
});

const _SW_VERSION = 2;

// Cache de todo lo que hay en assets por 3 meses.
workbox.routing.registerRoute(
    new RegExp('/app/assets/'),
    new workbox.strategies.CacheFirst({
        cacheName: 'assets-cache',
        plugins: [
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 24 * 90,
                maxEntries: 80,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /\.js|\.css/,
    new workbox.strategies.StaleWhileRevalidate({
        // Use a custom cache name.
        cacheName: 'js-css-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 100,
                // Cache for a maximum of one month.
                maxAgeSeconds: 30 * 24 * 60 * 60,
            })
        ],
    })
);

workbox.routing.registerRoute(
    // Cache image files.
    /\.(?:png|jpg|jpeg|svg|gif)$/,
    // Use the cache if it's available.
    new workbox.strategies.CacheFirst({
        // Use a custom cache name.
        cacheName: 'image-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                // Cache only 20 images.
                maxEntries: 50,
                // Cache for a maximum of a week.
                maxAgeSeconds: 7 * 24 * 60 * 60,
            })
        ],
    })
);

// Cache de la pagina index de punto de venta
workbox.routing.registerRoute(
    /\/(punto_de_venta|app)\/$/,
    new workbox.strategies.NetworkFirst({
        // Use a custom cache name.
        cacheName: 'page-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 100,
                // Cache for a maximum of one week.
                maxAgeSeconds: 7 * 24 * 60 * 60,
            })
        ],
    })
);

async function sendMessageToPOSClient(body) {
    const clients = await self.clients.matchAll();
    let matched = false;
    for (const client of clients) {
        // Solo enviar el mensaje a las ventanas de Punto de venta
        if (client.url.indexOf('punto_de_venta') > 1) {
            client.postMessage(body);
            matched = true;
        }
    }
    return matched;
}
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'GET_VERSION') {
        sendMessageToPOSClient({
            type: 'REPLY_VERSION',
            version: _SW_VERSION,
        });
    }
});