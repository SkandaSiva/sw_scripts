// Cache name
const CACHE_NAME = 'pwa-tanpen-caches-v-1.01';
// Cache targets
const urlsToCache = [
    'static/favicon.png',
    'static/offline.html',
    'static/marked.min.js?20230107',
    'static/eve_script.js?20240831',
    'static/eve_style_min.css?20240913',
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (!CACHE_NAME.includes(key)) {
          return caches.delete(key);
        }
      })
    )).then(() => {
      console.log(CACHE_NAME + "activated");
    })
  );
});

self.addEventListener('fetch', (event) => {
 event.respondWith(
   caches.match(event.request)
     .then((response) => {
       return response || fetch(event.request);
     }).catch(function() {
      // If both fail, show a generic fallback:
      return caches.match('static/offline.html');
    })
 );
});