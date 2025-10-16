// sw.js

'use strict';

/* eslint-disable max-len */

// const applicationServerPublicKey = "BNbxGYNMhEIi9zrneh7mqV4oUanjLUK3m+mYZBc62frMKrEoMk88r3Lk596T0ck9xlT+aok0fO1KXBLV4+XqxYM=";

/* eslint-enable max-len */

console.log('WORKER: executing.');

/* A version number is useful when updating the worker logic,
   allowing you to remove outdated cache entries during the update.
*/
var version = 'v22::';

/* These resources will be downloaded and cached by the service worker
   during the installation process. If any resource fails to be downloaded,
   then the service worker won't be installed either.
*/
var offlineFundamentals = [
    ''
];

/* The install event fires when the service worker is first installed.
   You can use this event to prepare the service worker to be able to serve
   files while visitors are offline.
*/
self.addEventListener("install", function(event) {
  console.log('WORKER: install event in progress.');
  /* Using event.waitUntil(p) blocks the installation process on the provided
     promise. If the promise is rejected, the service worker won't be installed.
  */
  event.waitUntil(
    /* The caches built-in is a promise-based API that helps you cache responses,
       as well as finding and deleting them.
    */
    caches
      /* You can open a cache by name, and this method returns a promise. We use
         a versioned cache name here so that we can remove old cache entries in
         one fell swoop later, when phasing out an older service worker.
      */
      .open(version + 'fundamentals')
      .then(function(cache) {
        /* After the cache is opened, we can fill it with the offline fundamentals.
           The method below will add all resources in `offlineFundamentals` to the
           cache, after making requests for them.
        */
        return cache.addAll(offlineFundamentals);
      })
      .then(function() {
        console.log('WORKER: install completed');
      })
  );
});

/* The fetch event fires whenever a page controlled by this service worker requests
   a resource. This isn't limited to `fetch` or even XMLHttpRequest. Instead, it
   comprehends even the request for the HTML page on first load, as well as JS and
   CSS resources, fonts, any images, etc.
*/
self.addEventListener("fetch", function(event) {

  /* We should only cache GET requests, and deal with the rest of method in the
     client-side, by handling failed POST,PUT,PATCH,etc. requests.
  */
  if (event.request.method !== 'GET' || event.request.url.startsWith('https://cdn.cardsrealm') || !event.request.url.includes('cardsrealm.com/?lang=')) {
    /* If we don't block the event as shown below, then the request will go to
       the network as usual.
    */
    return;
  }
  /* Similar to event.waitUntil in that it blocks the fetch event on a promise.
     Fulfillment result will be used as the response, and rejection will end in a
     HTTP response indicating failure.
  */
  event.respondWith(
    caches
      /* This method returns a promise that resolves to a cache entry matching
         the request. Once the promise is settled, we can then provide a response
         to the fetch request.
      */
      .match(event.request)
      .then(function add(cached) {
        /* Even if the response is in our cache, we go to the network as well.
           This pattern is known for producing "eventually fresh" responses,
           where we return cached responses immediately, and meanwhile pull
           a network response and store that in the cache.

           Read more:
           https://ponyfoo.com/articles/progressive-networking-serviceworker
        */
          /*
        var networked = fetch(event.request)
          // We handle the network request with success and failure scenarios.
          .then(fetchedFromNetwork, unableToResolve)
          // We should catch errors on the fetchedFromNetwork handler as well.
          .catch(unableToResolve);

        /* We return the cached response immediately if there is one, and fall
           back to waiting on the network as usual.
        */
          /*
        return networked || cached;
          */
        var networked = fetch(event.request)
          // We handle the network request with success and failure scenarios.
          .then(fetchedFromNetwork, unableToResolve)
          // We should catch errors on the fetchedFromNetwork handler as well.
          .catch(unableToResolve);

        /* We return the cached response immediately if there is one, and fall
           back to waiting on the network as usual.
        */
          return networked;

        function fetchedFromNetwork(response) {
          /* We copy the response before replying to the network request.
             This is the response that will be stored on the ServiceWorker cache.
          */
          // Return the response so that the promise is settled in fulfillment.
          return response;
        }

        /* When this method is called, it means we were unable to produce a response
           from either the cache or the network. This is our opportunity to produce
           a meaningful response even when all else fails. It's the last chance, so
           you probably want to display a "Service Unavailable" view or a generic
           error response.
        */
        function unableToResolve () {
            console.log('WORKER: fetch request failed in both cache and network.');

              /* Here we're creating a response programmatically. The first parameter is the
                 response body, and the second one defines the options for the response.
              */
              return cached || new Response('<html><head><title>Can not connect</title></head><body style="background: #3f3250!important;"><div style="display: block;text-align: center;margin-top: 100px;"><img src="https://cdn.cardsrealm.com/images/carregando.gif"></div><div style="display: block;text-align: center;"><p style="color: white;font-size: 36px;">Loading Cards Realm...</p></div><script src="https://cdn.cardsrealm.com/js/jquery_3_5_1.js" defer></script><script  type="text/javascript" src="https://cdn.cardsrealm.com/js/auto_refresh_offline.js" defer></script></body></html>', {
                status: 503,
                statusText: 'In maintenance',
                headers: new Headers({
                  'Content-Type': 'text/html'
                })
              });
                
          /* There's a couple of things we can do here.
             - Test the Accept header and then return one of the `offlineFundamentals`
               e.g: `return caches.match('/some/cached/image.png')`
             - You should also consider the origin. It's easier to decide what
               "unavailable" means for requests against your origins than for requests
               against a third party, such as an ad provider.
             - Generate a Response programmaticaly, as shown below, and return that.
          */

        }
      }).catch(function() {
      // If both fail, show a generic fallback:
          console.log('WORKER: fetch request failed in both cache and network.');

          /* Here we're creating a response programmatically. The first parameter is the
             response body, and the second one defines the options for the response.
          */
          return cached || new Response('<html><head><title>Can not connect</title></head><body style="background: #3f3250!important;"><div style="display: block;text-align: center;margin-top: 100px;"><img src="https://cdn.cardsrealm.com/images/carregando.gif"></div><div style="display: block;text-align: center;"><p style="color: white;font-size: 36px;">Loading Cards Realm...</p></div><script src="https://cdn.cardsrealm.com/js/jquery_3_5_1.js" defer></script><script  type="text/javascript" src="https://cdn.cardsrealm.com/js/auto_refresh_offline.js" defer></script></body></html>', {
            status: 503,
            statusText: 'In maintenance',
            headers: new Headers({
              'Content-Type': 'text/html'
            })
          });
    })
  );
});

/* The activate event fires after a service worker has been successfully installed.
   It is most useful when phasing out an older version of a service worker, as at
   this point you know that the new worker was installed correctly. In this example,
   we delete old caches that don't match the version in the worker we just finished
   installing.
*/
self.addEventListener("activate", function(event) {
  /* Just like with the install event, event.waitUntil blocks activate on a promise.
     Activation will fail unless the promise is fulfilled.
  */
  console.log('WORKER: activate event in progress.');

  event.waitUntil(
    caches
      /* This method returns a promise which will resolve to an array of available
         cache keys.
      */
      .keys()
      .then(function (keys) {
        // We return a promise that settles when all outdated caches are deleted.
        return Promise.all(
          keys
            .filter(function (key) {
              // Filter by keys that don't start with the latest version prefix.
              return !key.startsWith(version);
            })
            .map(function (key) {
              /* Return a promise that's fulfilled
                 when each outdated cache is deleted.
              */
              return caches.delete(key);
            })
        );
      })
      .then(function() {
        console.log('WORKER: activate completed.');
      })
  );
});

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  
    var options;
    var title;
    var txt = event.data.text().split("\|");
    
    var url = 'https://cardsrealm.com?&utm_source=Push&utm_medium=affiliate&utm_campaign=Push&partner=Push';
    if (txt.length > 3){
        var url = txt[3] + "?&utm_source=Push&utm_medium=affiliate&utm_campaign=Push&partner=Push";
    } 
    
    var badge = "https://cdn.cardsrealm.com/images/cr_white.png";
    if (txt.length > 4){
        var badge = txt[4];
    } 
    
    if (txt.length > 1){
        options = {
            body: txt[1].trim(),
            icon: txt[2].trim(),
            badge: badge,
            image: txt[2].trim(),
            data: {
                url: url
            }
          };
        title = txt[0];
    } else {
        options = {
            body: event.data.text(),
            icon: "https://cdn.cardsrealm.com/images/uploads/1584225075.jpeg",
            badge: badge,
            data: {
                url: url
            }
          };
        title = "Cards Realm";
    }
  
  

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();
    
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
  const applicationServerPublicKey = "BMll4-Dyf3KpV8j7XAUpWntkw61bXkwVlKpfxl_tne-f85rM-w9ztfAnnT_JAiNYVMnbrSAQbU0GV4qg2s6j0-8";
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(newSubscription) {
      // TODO: Send to application server
      console.log('[Service Worker] New subscription: ', newSubscription);
    })
  );
});