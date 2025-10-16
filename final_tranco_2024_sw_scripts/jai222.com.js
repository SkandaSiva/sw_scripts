const CACHE_NAME = 'tamjaibet-cache';
const urlsToCache = ['/'];

self.addEventListener('install', event => {
  const preLoaded = caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache));
  event.waitUntil(preLoaded);
});

self.addEventListener('fetch', event => {
  const response = caches.match(event.request).then(match => match || fetch(event.request));
  event.respondWith(response);
});

self.addEventListener('activate', event => {
  const clearCaches = caches.keys().then(cache => caches.delete(cache));
  event.waitUntil(clearCaches);
});
