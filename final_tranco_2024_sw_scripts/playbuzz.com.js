const filesToCache = [
  // '/quizzes',
  // '/playbuzz-viewer.js',
  // '/playbuzz-viewer.css'
];

const localHosts = [
  'localhost',
  'playbuzz-site-service-local.playbuzz.com',
  'local-playbuzz-viewer.playbuzz.com'
];

const shouldCacheUrl = (url) => filesToCache.some(file => url.pathname.includes(file));

const isDevelopment = (env) => localHosts.some(host => env.includes(host));

const isChrome = (userAgent) => userAgent.toLowerCase().indexOf('chrome') > -1;

const isSafari = (userAgent) => userAgent.toLowerCase().indexOf('safari') > -1 && !isChrome(userAgent);

self.addEventListener('fetch', event => {
  if (event.request.method === 'GET' && !isSafari(navigator.userAgent)) {
    event.respondWith(async function() {
      const url = new URL(event.request.url);
      let cacheResult = null;
      const fetchResponsePromise = fetch(event.request);
      
      // we only want to cache testyourself at this point
      if (shouldCacheUrl(url) && !isDevelopment(url.host)) {
        // Create promises for both the network response,
        // and a copy of the response that can be used in the cache.
        const fetchResponseClonePromise = fetchResponsePromise.then(r => r.clone());

        // event.waitUntil() ensures that the service worker is kept alive
        // long enough to complete the cache update.
        event.waitUntil(async function() {
          const cache = await caches.open('pb-cache');
          await cache.put(event.request, await fetchResponseClonePromise);
        }());

        cacheResult = await caches.match(event.request);
      }
      // Prefer the cached response, falling back to the fetch response.
      return cacheResult || fetchResponsePromise;
    }());
  }
});

//This is a event that can be fired from your page to tell the SW to update the offline page
self.addEventListener('refreshOffline', function (response) {
  return caches.open('pwabuilder-offline').then(function (cache) {
    console.log('[PWA Builder] Offline page updated from refreshOffline event: ' + response.url);
    return cache.put(offlinePage, response);
  });
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://developers.google.com/web/')
  );
});

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Push Codelab';
  const options = {
    body: 'Yay it works.',
    icon: 'https://img.playbuzz.com/image/upload/v1545037950/pwa/icon-128x128.png',
    badge: 'https://img.playbuzz.com/image/upload/v1545037950/pwa/icon-128x128.png'
  };
  const notificationPromise = self.registration.showNotification(title, options);
  event.waitUntil(notificationPromise);
});