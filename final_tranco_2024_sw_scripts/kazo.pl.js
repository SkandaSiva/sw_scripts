const CACHE_NAME = 'kazo-0.0.1';
const CACHED_FILES = [
    '/offline.html',
];
self.addEventListener('install', (evt) => {
    console.log('[Kazo SW] Install');
evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
        console.log('[Kazo SW] Pre-caching offline page');
return cache.addAll(CACHED_FILES);
})
);
});

self.addEventListener('activate', (evt) => {
    console.log('[Kazo SW] Activate');
evt.waitUntil(
    caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
            if (key !== CACHE_NAME) {
    console.log('[Kazo SW] Removing old cache', key);
    return caches.delete(key);
}
}));
})
);

self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    //console.log('[Lento SW] Fetch', evt.request.url);
    if (evt.request.mode !== 'navigate') {
    // Not a page navigation, bail.
    return;
}
evt.respondWith(
    fetch(evt.request)
        .catch(() => {
        return caches.open(CACHE_NAME)
            .then((cache) => {
            return cache.match('offline.html');
});
})
);

});