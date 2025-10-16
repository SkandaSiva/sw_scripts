self.addEventListener('install', () => {
  // e.waitUntil(
  //   caches.open('store').then(cache => cache.addAll([
  //     '/index.html',
  //   ])),
  // )
})

self.addEventListener('fetch', () => {
  // e.respondWith(
  //   caches.match(e.request).then(response => response || fetch(e.request)),
  // )
})
