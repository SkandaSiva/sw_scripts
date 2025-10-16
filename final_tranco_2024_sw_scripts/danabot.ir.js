const serviceWorkerVersion = "1.3.0";

self.addEventListener('install', (event) => {

    console.log('[Service Worker] Installing Service Worker ...');

    const resources = [];

    event.waitUntil(cleanupOldCaches());

    event.waitUntil(addResourcesToCache(resources));

});

self.addEventListener('activate', (event) => {

    console.log('[Service Worker] Activating Service Worker ...');

    event.waitUntil(cleanupOldCaches());

});

self.addEventListener('fetch', (event) => {

    console.log('[Service Worker] Fetching From Cache ...');

    event.respondWith(matchResourcesInFetch(event.request));

});

// Add Resources To Cache
async function addResourcesToCache(resources) {

    const cache = await caches.open(`${serviceWorkerVersion}-static`);

    await cache.addAll(resources);

}

// Match Resources in Fetch
async function matchResourcesInFetch(request) {

    const response = await caches.match(request);

    if (response) {

        console.log('[Service Worker] Fetching From Cache ...');

        return response;

    } else {

        const checkUrl = checkRequest(request.url);

        if (checkUrl) {

            const cache = await caches.open(`${serviceWorkerVersion}-dynamic`);

            await cache.add(request);

        }

        return fetch(request);

    }
}

// Cleanup Old Caches
async function cleanupOldCaches() {

    const keys = await caches.keys();

    return Promise.all(keys.map(key => {

        console.log(key, `${serviceWorkerVersion}`);

        if (key !== `${serviceWorkerVersion}-dynamic` || key !== `${serviceWorkerVersion}-static`) {

            console.log(`[Service Worker] Removing Old Caches (${key}) ...`);

            return caches.delete(key);

        }

    }));

}

function checkRequest(reqUrl) {

    const validUrlExtension = [".css", ".png", ".svg", ".ttf", ".woff", ".ico"];

    return validUrlExtension.some(extension => reqUrl.includes(extension));

}