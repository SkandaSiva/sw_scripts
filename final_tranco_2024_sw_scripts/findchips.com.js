const url = new URL(self.location);
const version = url.searchParams.get('v');
const env = url.searchParams.get('e');

const cacheName = 'fc_CS_' + version;

let cachedFiles = version && env ? [
    '/offline',
    '/manifest.json',
    '/sites/findchips/images/findchips@192x192.png',
] : [];

if (env && env === 'dev') {
    cachedFiles.push(
        `/sites/findchips/stylesheets/home.css?version=${version}${env === 'dev' ? '&site=findchips' : ''}`,
        `/build/min/bundles/fc_home-${version}.js`,
        '/sites/findchips/images/learn-more-4.svg',
        '/sites/findchips/images/alerts-1.svg',
        '/sites/findchips/images/learn-more-9.svg',
        '/sites/findchips/images/learn-more-15.svg',
        '/sites/findchips/images/webp/part-comparison-80x80.webp',
        `/sites/findchips/fonts/fontcustom_e2eb10380bb82345ff60af5c87b72d13.woff2?version=${version}`,
        `/sites/findchips/fonts/fcl-v1-icon-font.woff2?version=${version}`,
        `/sites/findchips/images/webp/logo@2x.webp?version=${version}`,
        `/sites/findchips/images/webp/logo.webp?version=${version}`,
        `/sites/findchips/images/webp/white-logo@2x.webp?version=${version}`,
        `/sites/findchips/images/webp/white-logo.webp?version=${version}`
    );
}

self.addEventListener('install', function(ev) {
    ev.waitUntil(caches.open(cacheName).then(function(cache){
        return cache.addAll(cachedFiles);
    }).then(function() {
        return self.skipWaiting();
    }).catch(function(err) {
        console.log('Caching failed:', err);
    }));
});

self.addEventListener('activate', function(ev) {
    ev.waitUntil(caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
            if (key !== cacheName) {
                return caches.delete(key);
            }
        }));
    }));
    return self.clients.claim();
});

self.addEventListener('fetch', function(ev) {
    if (ev.request.mode === 'navigate' || (ev.request.method === 'GET' && ev.request.headers.get('accept').includes('text/html'))) {
        return ev.respondWith(caches.match(ev.request).then(function(response) {
            return response || fetch(ev.request).catch(() => {
                return caches.match('/offline');
            });
        }));
    }

    if (ev.request.url.startsWith(self.origin)) {
        ev.respondWith(caches.match(ev.request).then(function(response) {
            return response || fetch(ev.request).catch((err) => {
                // do nothing
            });
        }));
    }
});