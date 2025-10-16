const cacheKey = 'v1';

self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    const currentCaches = [cacheKey];
    event.waitUntil(caches.keys().then(cacheNames => cacheNames.filter(cacheName => !currentCaches.includes(cacheName))).then(cachesToDelete => Promise.all(cachesToDelete.map(cacheToDelete => caches.delete(cacheToDelete)))).then(() => self.clients.claim()));
});

// add all extension that doesn't need to be updated by network
const nCAs = [
    /\.ttf/,
    /\.woff/,
    /\.otf/,
    /\.woff2/,
    /\.mp4/,
];


const cacheAbles = [
    /\.js/,
    /\.css/,
    /data:image/,
    /\.svg/,
    /\.jpg/,
    /\.webp/,
    /\.gif/,
].concat(nCAs);


async function requestNCache(event) {
    try {
        const response = await fetch(event.request);
        const isCacheAble = cacheAbles.some((cacheAble) => cacheAble.test(event.request.url));

        if (response.ok && isCacheAble) {
            const responseClone = response.clone();
            const cache = await caches.open(cacheKey);
            await cache.put(event.request, responseClone);
        }

        return response;
    } catch (e) {
        return e;
    }
}

async function cacheFlow(event) {
    const cache = await caches.open(cacheKey);
    const response = await cache.match(event.request);
    const isMatched = nCAs.some((nCA) => nCA.test(event.request.url));

    if (!!response && isMatched) {
        return response;
    }

    if (response) {
        requestNCache(event);
        return response;
    }

    return requestNCache(event);
}

function handleFetch(event) {
    if ((event.request.url.indexOf('http') === 0) && event.request.method !== 'POST') {
        event.respondWith(cacheFlow(event));
    }
}

self.addEventListener('fetch', handleFetch);
