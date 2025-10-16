importScripts('https://cdn.webpushr.com/sw-server.min.js');

/*const staticCacheName = 'site-static-v1';
const assets = [
  '/index.html',
  '/assets/js/ui.js',
  '/skins/grey/css/main.css',
  '/assets/images/background-home.jpg',
  'https://library.goo1.de/fontawesome/5/css/all.min.css',
  '/skins/grey/css/bootstrap.light.min.css',
  '/skins/grey/css/bootstrap.dark.min.css',
];
// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});
// activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});
// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});*/