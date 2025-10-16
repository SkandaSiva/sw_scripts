const cacheName = 'v1';
const preFile = './offline';
const cacheAssets = [
    `${preFile}/offline.html`,
    `${preFile}/offline.css`,
    `${preFile}/offline.jpg`,
    `${preFile}/offline2.jpg`,
    `${preFile}/proximanova-reg-webfont.eot`,
    `${preFile}/proximanova-reg-webfont.svg`,
    `${preFile}/proximanova-reg-webfont.ttf`,
    `${preFile}/proximanova-reg-webfont.woff`,
    `${preFile}/proximanova-reg-webfont.woff2`,
];

// Call install event
self.addEventListener('install', (e) => {
    console.log('Service worker: Installed');

    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('Service Worker: Caching Files');
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
            .catch(err => console.warn(err))
    );
});

// Call activate event
self.addEventListener('activate', (e) => {
    console.log('Service worker: Activated');
    // Remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Servcie Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
});

// Call fetch event

self.addEventListener('fetch', (e) => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request)
            .catch(() => caches.match(`./offline/offline.html`))
    )
});