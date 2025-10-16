const PRECACHE = "precache-v3";
const RUNTIME = "runtime";
const PRECACHE_URLS = [
    location.origin + "/offline.html",
    location.origin + "/themes/paper_theme/assets/bundle.js",
    location.origin + "/themes/paper_theme/assets/style.css"
];
self.addEventListener("install", event => { 
    event.waitUntil(caches.open(PRECACHE)
        .then(cache => cache.addAll(PRECACHE_URLS))
        .then(self.skipWaiting()));
});
self.addEventListener("activate", event => { 
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(caches.keys()
        .then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete); 
            })); 
        }).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
    if (navigator.onLine) {
        return;
    }
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return caches.open(RUNTIME).then(cache => {
                if (!navigator.onLine) { 
                    return caches.match(location.origin + "/offline.html");
                }
                return fetch(event.request)
                    .then(response => { 
                        return response;
                    })
                    .catch(error => { 
                        console.warn(error);
                    });
            });
        }));
    }
});
self.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    event.prompt();
});