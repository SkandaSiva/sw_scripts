self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('my-cache').then(cache => cache.addAll([])).then(self.skipWaiting())
    );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
    );
});