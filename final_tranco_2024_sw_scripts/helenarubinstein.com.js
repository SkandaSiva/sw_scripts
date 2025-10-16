 /* TODO: most likely outdated caches will be removed automatically, but need to investigate more.
 * Commenting this for the time beign.
 */
/*
self.addEventListener('activate', function (event) {
    var cacheWhitelist = ['data-api-cache-v1730880111576', 'data-api-cache-v1730880111576',
        'jscss-cache-v1730880111576', 'template-cache-v1730880111576'];

    event.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (cacheWhitelist.indexOf(key) === -1) {
            console.info('Deleting outdated cache ' + key);
            return caches.delete(key);
          }
        }))
      })
    );
    event.waitUntil(self.clients.claim());
});
*/

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');


/**
 * Enable most verbose logging and additional type checking for non production instances
 */
//workbox.setConfig({
//  debug: false
//});

/**
 * Publish new service worker and have it update and control
 * a web page as soon as possible, skipping the default service worker lifecycle.
 */
workbox.core.skipWaiting();
workbox.core.clientsClaim();


/**
 * Resources to be pre-cached during SW installation and always served
 * with cache-first strategy (i.e. homepage css)
 */
workbox.precaching.cleanupOutdatedCaches();
workbox.precaching.precacheAndRoute(
  [{"url":"https://www.helenarubinstein.com/on/demandware.static/Sites-NGHRu-ILM-Site/-/en_IN/v1730880111576/dist/css/commons.css","revision":"v1730880111576"},{"url":"https://www.helenarubinstein.com/on/demandware.static/-/Sites-NGHRu-ILM-Library/default/dw3cbb654c/images/demo/offline.png","revision":"v1730880111576"}]
);

/**
 * Prepopulate cache with important resources that we want to be part of the cache
 * from the very beginning but will use network-first strategy afterwards (e.g. homepage HTML)
 */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('prepopulated-cache-v1730880111576').then(function(cache) {
      return cache.addAll(["/","https://www.helenarubinstein.com/int/transversal/transversal-offline.html"]);
    })
  );
});

/**
 * Retrieve a cached page or offline page if there is no connectivity.
 */
self.addEventListener('fetch', function(event) {
  // Only retrieve offline page if this is a navigation request for an HTML page.
  // request.mode = navigate isn't supported in all browsers
  // so include a check for Accept: text/html header.
  if (event.request.mode === 'navigate' ||
      (event.request.method === 'GET' &&
       event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request).catch(function(error) {
        // If fetch() returns a valid HTTP response with an response code in the 4xx or 5xx
        // range, the catch() will NOT be called.
        return caches.match(event.request).then(function (response) {
          // return response if cached
          if (response) {
            return response;
          } else {
            // Return the offline page
            return caches.match('https://www.helenarubinstein.com/int/transversal/transversal-offline.html');
          }
        });
      })
    );
  }
});

/**
 * Now set network-first strategy for the resources prepopulated in cache
 */
workbox.routing.registerRoute(
  '/',
  new workbox.strategies.NetworkFirst({
    cacheName: 'prepopulated-cache-v1730880111576',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      })
    ],
  })
);
workbox.routing.registerRoute(
  'https://www.helenarubinstein.com/int/transversal/transversal-offline.html',
  new workbox.strategies.NetworkFirst({
    cacheName: 'prepopulated-cache-v1730880111576',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      })
    ],
  })
);

/**
 * Add all runtime caching and routing defined through worker.json configuration file
 *
 * as it wasn't used, runtime cache defined as follow has been removed:
 * {
 *   "cacheName": "data-api-cache",
 *   "matchRegExp": ".*",
 *   "strategy": "cacheFirst",
 *   "cacheableResponse": {
 *     "headers": {
 *       "X-SF-CC-Cacheable": "true"
 *     }
 *   },
 *   "expiration": {
 *     "maxAgeSeconds": 86400
 *   }
 * }
 *
 * will need reactivation when code using the custom header will be reintroduced
 * BEWARE: when a request matches a pattern defined in workbox, even if it isn't found in the cache,
 * the worker will takeover with it's own fetch to the network.
 * as a consequence, requests that are supposed to return some script content (typical exemple: jsonp calls)
 * will be transformed from script/xhr to fetch, blocking the callbacks from firing.
 * einstein/cquotient code typically uses jsonp requests.
 * if a new cache is ever reintroduced, it's critical to find a way to exclude jsonp calls from matching
 */
workbox.routing.registerRoute(
  new RegExp('\.(?:js|css)$'),
  new workbox.strategies.CacheFirst({
    cacheName: 'jscss-cache-v1730880111576',
    plugins: [
      
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 2592000,
        maxEntries: 60
      }),
      
      
    ]
  })
);

/**
 * Add event listener for notification click
 * triggered each time when notification is clicked
 * open new window if notification action is clicked and url is present
 * in notification data
 */
self.addEventListener('notificationclick', function(event){
  let action = event.action;
  let notificationData = event.notification.data;

  // called if no action is passed (clicked on notification itselve)
  // set action to default action
  if (!action && notificationData.defaultAction) {
    action = notificationData.defaultAction;
  }

  // open url action
  if (action && notificationData && notificationData.actions && notificationData.actions[action]) {
    return clients.openWindow(notificationData.actions[action]);
  }
  // close notification action
  if (action && action === 'close') {
    event.notification.close();
  }

}); 