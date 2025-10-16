let d = new Date();
d.setMonth(d.getMonth() - 3);

function customHeaderRequestFetch(event) {
    const newRequest = new Request(event.request, {
        credentials: 'same-origin',
        headers: {
            ...event.request.headers,
            'if-modified-since': d.toISOString()
        }
    })
    return fetch(newRequest)
}

// //capture des events
self.addEventListener('fetch', async (evt) => {
    console.log(`Fetching: ${evt.request.url}, Mode: ${evt.request.mode}`)
    if (evt.request.destination === 'document' && evt.request.method !== 'POST') {
        evt.respondWith(customHeaderRequestFetch(evt))
    }
})

// This is the "Offline page" service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});



const JS_CACHE = "sporty-javascript";
const STYLE_CACHE = "sporty-stylesheets";
const IMAGE_CACHE = "sporty-images";
const FONT_CACHE = "sporty-fonts";


workbox.routing.registerRoute(
    ({event}) => event.request.destination === 'script',
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: JS_CACHE,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 20,
                maxAgeSeconds: 24 * 60 * 60,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    ({event}) => event.request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: STYLE_CACHE,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 15,
                maxAgeSeconds: 24 * 60 * 60,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    ({event}) => event.request.destination === 'image',
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: IMAGE_CACHE,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 24 * 60 * 60,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    ({event}) => event.request.destination === 'font',
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: FONT_CACHE,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 15,
                maxAgeSeconds: 24 * 60 * 60,
            }),
        ],
    })
);

