
      const settings = {"cachePaths":["https://brive.com/static/fonts/Roboto/KFOmCnqEu92Fr1Mu72xKOzY.woff2","https://brive.com/static/fonts/Roboto/KFOmCnqEu92Fr1Mu5mxKOzY.woff2","https://brive.com/static/fonts/Roboto/KFOmCnqEu92Fr1Mu7mxKOzY.woff2","https://brive.com/static/fonts/Roboto/KFOmCnqEu92Fr1Mu4WxKOzY.woff2","https://brive.com/static/fonts/Roboto/KFOmCnqEu92Fr1Mu7WxKOzY.woff2","https://brive.com/static/fonts/Roboto/KFOmCnqEu92Fr1Mu7GxKOzY.woff2","https://brive.com/static/fonts/Roboto/KFOmCnqEu92Fr1Mu4mxK.woff2","https://brive.com/static/fonts/OpenSans/mem8YaGs126MiZpBA-UFUZ0bbck.woff2","https://brive.com/static/fonts/OpenSans/mem8YaGs126MiZpBA-UFVp0bbck.woff2","https://brive.com/static/fonts/OpenSans/mem8YaGs126MiZpBA-UFVZ0b.woff2","https://brive.com/static/fonts/OpenSans/mem8YaGs126MiZpBA-UFW50bbck.woff2","https://brive.com/static/fonts/OpenSans/mem8YaGs126MiZpBA-UFWJ0bbck.woff2","https://brive.com/static/fonts/OpenSans/mem8YaGs126MiZpBA-UFWp0bbck.woff2","https://brive.com/static/fonts/OpenSans/mem8YaGs126MiZpBA-UFWZ0bbck.woff2","https://brive.com/i18n/locales?currentLanguage=en","https://brive.com/i18n/locales?currentLanguage=el","https://brive.com/static/_next/static/"],"version":"1.13.26","domain":"https://brive.com"}
      const ENV = {
  supports: {
    // webp: window.chrome && window.navigator.userAgent.indexOf('Edge') === -1,
    webp: false,
  },
};

const CACHE_NAME = [
  'static-files',
  new Date().getMonth(),
  new Date().getFullYear(),
  settings.version,
].join('-'); // Decache based on month

const URLS_TO_CACHE_ON_INSTALL = ['/offline.html'];
const EXTRA_URLS_TO_CACHE_ON_FETCH = settings.cachePaths;


self.addEventListener('install', function (event) {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(URLS_TO_CACHE_ON_INSTALL);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return !key.startsWith(CACHE_NAME);
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    })
  );
});

function normalFetch(event, noCors) {
  const options = {};

  // if (noCors) {
  //   options.mode = 'no-cors';
  // }

  return fetch(event.request, options).catch(function () {
    return caches.match('/offline.html');
  });
}

 

function urlPartInExtraUrls(url) {
  var exists = false
  EXTRA_URLS_TO_CACHE_ON_FETCH.forEach(function (i) {
    if (url.indexOf(i) !== -1) {
      exists = true
    }
  })
  return exists
}

self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);

  // console.log("url needs cache", urlPartInExtraUrls(event.request.url), event.request.url)

  if (EXTRA_URLS_TO_CACHE_ON_FETCH.indexOf(event.request.url) === -1 && !urlPartInExtraUrls(event.request.url)) {
 

    // We used to cache js,css and images, but this, in fact, is not
    // a good way to go.
    // We should only cache if a resouce is critical for offline
    // That said, and in order to avoid quota issues, let's not cache anymore.
    event.respondWith(normalFetch(event));

    return;
  }

  // At this point we look for cache
  // or fetch and cache
  event.respondWith(
    caches
      .match(event.request)
      .then(function (cached) {
        if (cached) {
          return cached;
        }

        return fetch(event.request)
          .then(fetchedFromNetwork, unableToResolve)
          .catch(unableToResolve);

        function fetchedFromNetwork(response) {
           

          /* We copy the response before replying to the network request.
            This is the response that will be stored on the ServiceWorker cache.
         */
          const cacheCopy = response.clone();

          console.log(
            '[Serive Worker] Fetch response from network.',
            event.request.url
          );

          caches
            // We open a cache to store the response for this request.
            .open(CACHE_NAME)
            .then(function add(cache) {
              /* We store the response for this request. It'll later become
                  available to caches.match(event.request) calls, when looking
                  for cached responses.
               */
              cache.put(event.request, cacheCopy);
            })
            .then(function () {
              console.log(
                '[Service Worker] Fetch response stored in cache.',
                event.request.url
              );
            });

          // Return the response so that the promise is settled in fulfillment.
          return response;
        }

        function unableToResolve() {
  
          return caches.match('/offline.html');
        }
      })
      .catch(function () {
        
        return caches.match('/offline.html');
      })
  );
});

 


self.addEventListener('push', function (event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }

  var d = event.data.json();
  var promise = self.registration.showNotification(d.title, {
    body: d.message,
    icon: d.icon || '/static/pwa/icon.png',
    tag: 'brive-' + event.data.tag,
    data: d
  });

  event.waitUntil(promise);
});

self.addEventListener('notificationclick', function (event) {
  var d = event.notification.data;
  clients.openWindow(d.url);

  // if (d.url) {   
  //   event.waitUntil(
  //     clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(windowClients => {
  //         // Check if there is already a window/tab open with the target URL
  //         for (let i = 0; i < windowClients.length; i++) {
  //             let client = windowClients[i];
  //             // If so, just focus it.
  //             if (client.url.indexOf(settings.domain) !== -1 && 'focus' in client) {
  //                 return client.focus().navigate(settings.domain + d.url);
  //             }
  //         }

  //         if (clients.openWindow) {
  //             return clients.openWindow(settings.domain + d.url);
  //         }
  //     })
  //   ); 
  // }

});
    