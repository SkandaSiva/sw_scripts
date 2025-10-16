// let cacheData='appV1'
const CACHE_NAME = 'offline-483';
const OFFLINE_URL = 'offline.html';

/* this.addEventListener('install', (event)=>{
    this.skipWaiting()
    event.waitUntil(
        caches.open(cacheData).then((cache)=>{
            cache.addAll([
                '/assets/js/main.js',
                '/static/js/main.chunk.js',
                '/static/js/0.chunk.js',
                '/static/js/bundle.js',
                '/index.html',
                '/',
                '/assets/images/logo/logo-final2.png',
                '/assets/images/logo/logodjp.svg',
                '/assets/images/bg/banner-emeterai-3.png',
                '/assets/images/imagepeople.png',
                '/static/media/logo-emeterai2.488bee32.png'
            ])
        })
    )
}) */

this.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Setting {cache: 'reload'} in the new request will ensure that the response
    // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
    await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
    this.skipWaiting()
  })());
});

this.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Enable navigation preload if it's supported.
    // See https://developers.google.com/web/updates/2017/02/navigation-preload
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      )
    })

    if ('navigationPreload' in this.registration) {
      await this.registration.navigationPreload.enable();
    }
  })());

  // Tell the active service worker to take control of the page immediately.
  this.clients.claim();
});

/* this.addEventListener('fetch', (event)=>{
    console.log('OFFLINE MODE')
    event.respondWith(
        caches.match(event.request).then((resp)=>{
            if(resp){
                return resp || fetch(event.request)
            }
        })
    )
}) */

this.addEventListener('fetch', (event) => {
  // We only want to call event.respondWith() if this is a navigation request
  // for an HTML page.
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
        // catch is only triggered if an exception is thrown, which is likely
        // due to a network error.
        // If fetch() returns a valid HTTP response with a response code in
        // the 4xx or 5xx range, the catch() will NOT be called.
        console.log('Fetch failed; returning offline page instead.', error);

        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    })());
  }

  // If our if() condition is false, then this fetch handler won't intercept the
  // request. If there are any other fetch handlers registered, they will get a
  // chance to call event.respondWith(). If no fetch handlers call
  // event.respondWith(), the request will be handled by the browser as if there
  // were no service worker involvement.
});

this.addEventListener('sync', function (event) {
  // this.registration.showNotification("Sync event fired!");
});

this.addEventListener('push', (e) => {
  // console.log(e);
  const data = e.data.json();
  // console.log(data);
  this.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
  });
});

