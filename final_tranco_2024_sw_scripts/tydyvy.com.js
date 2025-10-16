const staticAssets=[
    '/disconnect.html',
    '/images/disconnect.png',
];

self.addEventListener('install', async event=>{
  event.waitUntil(
    caches.open('static-cache')
      .then(cache => {
        return cache.addAll(staticAssets);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
            .then((data) => {
                return data
            })
            .catch((e) => {
                return caches.match(new Request('/disconnect.html'));
            });
            
      })
    );
});

  

