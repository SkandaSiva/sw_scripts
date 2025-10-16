const CACHE_NAME = 'PWA-BY-QE';
                const OFFLINE_URL = '/a/pqe/58708230318/offline.html';

                self.addEventListener('install', function(e) {
                  console.log('WORKER: Install event in progress.');

                 e.waitUntil(
                   caches.open(CACHE_NAME).then(function(cache) {
                     return cache.addAll([
                        '/', 
                        '/a/pqe/58708230318/sw.js',
                        '/a/pqe/58708230318/main.js',
                        '/a/pqe/58708230318/manifest.webmanifest',
                        '/a/pqe/58708230318/index.html',
                        '/a/pqe/58708230318/offline.html'
                       
                     ]);
                   })
                 );
                });


                  self.addEventListener('activate', (event) => {
                    console.log('WORKER: activate event in progress.');
                    event.waitUntil((async () => {
                      if ('navigationPreload' in self.registration) {
                        await self.registration.navigationPreload.enable();
                      }
                    })());
                    self.clients.claim();
                  });


                  self.addEventListener('fetch', (event) => {
                    console.log('WORKER: fetch event in progress.');
                    if (event.request.mode === 'navigate') {
                      event.respondWith((async () => {
                        try {
                          // First, try to use the navigation preload response if it's supported.
                          const preloadResponse = await event.preloadResponse;
                          if (preloadResponse) {
                            return preloadResponse;
                          }

                          const networkResponse = await fetch(event.request);
                          return networkResponse;
                        } catch (error) {

                          console.log('Fetch failed; returning offline page instead.', error);

                          const cache = await caches.open(CACHE_NAME);
                          const cachedResponse = await cache.match(OFFLINE_URL);
                          return cachedResponse;
                        }
                      })());
                    }  

                  });
         