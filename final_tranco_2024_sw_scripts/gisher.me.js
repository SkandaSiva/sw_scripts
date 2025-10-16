const PRECACHE = 'gche-v65';
const RUNTIME = 'grn-v81';

const PRECACHE_URLS = [
  '/', '/video/armyanskie-seriali', '/services/armtv.html', '/services/armtv.html?tv=armenia',
  '/services/armtv.html?tv=vivaro-sports', '/services/armtv.html?tv=vmedia-plus',
  '/services/armtv.html?tv=vivaro-arena', '/images/fav/android-chrome-192x192.png',
  '/js/jquery-3.js', '/newplayer/o/g.js', '/newplayer/o/jwpsrv.js',
  '/newplayer/o/jwplayer.core.controls.js', '/newplayer/o/provider.hlsjs.js',
  '/newplayer/o/provider.cast.js', '/newplayer/o/translations/ru.json',
  '/newplayer/o/translations/hy.json', '/css/fonts/gisher.woff2',
  '/css/fonts/gshr.woff2', '/css/fonts/gisherb.woff2', '/css/fonts/gshrb.woff2',
  '/css/gisher.css?37', '/css/g971.css?6', '/css/g970.css?5','/css/gisherd.css?3', '/js/ratev.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => caches.delete(cacheToDelete)));
    }).then(() => caches.open(RUNTIME))
      .then(cache => {
        return cache.keys().then(requests => {
          return Promise.all(requests.map(request => {
            if (!PRECACHE_URLS.includes(new URL(request.url).pathname)) {
              return cache.delete(request);
            }
          }));
        });
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  if (event.request.url.startsWith('http://')) {
    return;
  }
  if (event.request.mode === 'cors') {
    return;
  }  
  if (event.request.method !== 'GET') {	  
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(async function() {
    try {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse && event.request.headers.get('Accept').includes('text/html')) {
        try {
          const fetchResponse = await fetch(event.request);
          if (fetchResponse && fetchResponse.status === 200) {
            const cache = await caches.open(RUNTIME);
            cache.put(event.request, fetchResponse.clone());
          }
          return fetchResponse;
        } catch (error) {
          return cachedResponse;
        }
      }

      if (event.request.url.startsWith(self.location.origin)) {
        try {
          const fetchResponse = await fetch(event.request);
          if (fetchResponse && fetchResponse.status === 200) {
            const cache = await caches.open(RUNTIME);
            cache.put(event.request, fetchResponse.clone());
          }
          return fetchResponse;
        } catch (error) {
          return cachedResponse || new Response('Offline');
        }
      }

      try {
        const fetchResponse = await fetch(event.request);
        return fetchResponse;
      } catch (error) {
        return new Response('Offline');
      }
    } catch (error) {

    }
  }());
});
