// START FIREBASE
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
try {
  importScripts('/static/js/firebase-app.js');
  importScripts('/static/js/firebase-messaging.js');
} catch(e) {
  console.log("Error opening scripts", e)
}

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '760849045108'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging();

  messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.body,
      vibrate: [100, 200, 100, 100, 200],
      tag: payload.data.tag || "general",
      icon: payload.data.icon || '/static/img/favicon.png'
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  });

  self.addEventListener('push', function(payload) {
   console.log('[sw.js] Received a push message', payload);
  });
  //  console.log('[sw.js] Received a push message', payload.data);
  //
  //  const notificationTitle = payload.data.title || "Blank";
  //  const notificationOptions = {
  //    body: payload.data.body,
  //    //icon: '/firebase-logo.png'
  //  };
  //  payload.waitUntil(
  //    self.registration.showNotification(notificationTitle, notificationOptions);
  //  );
  //});

  self.addEventListener('notificationclick', function(event) {
    console.log('[sw.js] On notification click: ', event.notification.tag);
    // Android doesn’t close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();
    // This looks to see if the current is already open and focuses if it is
    event.waitUntil(clients.matchAll({
      type: 'window'
    })
    .then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if ('focus' in client) {
          return client.focus().then(function(windowClient){
            port && port.postMessage({'channel':event.notification.data.channel_id});
          });
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('?station=nightride').then(function(windowClient){
          port && port.postMessage({'channel':event.notification.data.channel_id});
        });
      }
    }));
  });
}
// END FIREBASE
const staticCacheName = 'nightride-cache-v5.0.7';
const filesToCache = [
  "/",
  "/static/js/main.js?v=55",
  "/static/css/main.css?v=21",
  "/static/img/noise.png",
  "/static/fonts/unscii-16.woff",
  "/static/js/firebase-app.js",
  "/static/js/firebase-messaging.js",
]
console.log("SW Startup!");
// Install Service WorkerSW Says 'Hello back!'
self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  self.skipWaiting();
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
    // caches.open(staticCacheName)
    // .then(cache => {
    //   return cache.addAll(filesToCache);
    // })
    // .catch(err => {console.log("Error opening Cache", err)})
  // );
});

// Service Worker Active
self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheWhitelist = [staticCacheName];
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        console.log(cacheNames);
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log("Checking: ", cacheName);
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log("Deleting: ", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    .catch(err => {console.log("Error getting cache keys", err)})
  );
});

var port;
self.addEventListener('message', function(event){
    console.log("SW Received Message: ", event.data, event.ports);
    const notificationTitle = event.data.title;
    const notificationOptions = {
      body: event.data.body,
      vibrate: [100, 200, 100, 100, 200],
      tag: `chat_${event.data.channel}`,
      icon: 'static/img/favicon.png',
      data: {channel_id: event.data.channel},
    };
    port = event.ports[0];
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// const noFetch = /\/stream\/|\/archives\/|\/releases\/|irc$|meta$/i;
// const noFetch = /\/nowplaying\/|\/stream\/|\/archives\/.*mp3$|irc$|meta$/i;
// const netFirst = /\/api\//i;
// const noSearch = /\/$|\/index.html$/i;

function openCacheAndMatchRequest(cacheName, request, search) {
  var cachePromise = caches.open(cacheName);
  var matchPromise = cachePromise.then(function(cache) {
    return cache.match(request, {ignoreSearch: search});
  });
  return [cachePromise, matchPromise];
}

function cacheSuccessfulResponse(cache, request, response) {
  if (response.ok) {
    return cache.put(request, response.clone()).then(() => {
      return response;
    });
  } else {
    return response;
  }
}

function networkElseCache (request, cacheName, search) {
  return fetch(request)
    .then(fetchResponse => {
      return caches.open(cacheName)
        .then(cache => cacheSuccessfulResponse(cache, request, fetchResponse));
    })
    .catch(error => {
      console.log("Fetch Error", error);
      console.log("Checking Cache");
      return Promise.all(openCacheAndMatchRequest(cacheName, request, search)).then(responses => {
        return responses[1];
      })
    })
}

function cacheThenNetwork(request, cacheName, search) {
  return Promise.all(openCacheAndMatchRequest(cacheName, request, search)).then(
    function(responses) {
      var cache = responses[0];
      var cacheResponse = responses[1];
      if (cacheResponse) {
        // If it's in the cache then start a fetch to update the cache, but
        // return the cached response
        fetch(request)
          .then(function(fetchResponse) {
            return cacheSuccessfulResponse(cache, request, fetchResponse);
          })
          .catch(function(err) {
            // Offline/network failure, but nothing to worry about
          });
        return cacheResponse;
      } else {
        // If it's not in the cache then start a fetch
        return fetch(request)
          .then(function(fetchResponse) {
            return cacheSuccessfulResponse(cache, request, fetchResponse);
          })
          .catch(function() {
            // Offline, so return the offline page.
            return caches.match('/offline.html');
          });
      }
    }
  );
}

function returnRangeRequest(request, cacheName, search) {
  return caches
    .open(cacheName)
    .then(function(cache) {
      return cache.match(request.url, {ignoreSearch: search});
    })
    .then(function(res) {
      if (res) {
        return res.arrayBuffer().then(arrayBuffer => {
          const bytes = /^bytes\=(\d+)\-(\d+)?$/g.exec(
            request.headers.get('range')
          );
          if (bytes) {
            const start = Number(bytes[1]);
            const end = Number(bytes[2]) || arrayBuffer.byteLength - 1;
            return new Response(arrayBuffer.slice(start, end + 1), {
              status: 206,
              statusText: 'Partial Content',
              headers: [
                ['Content-Range', `bytes ${start}-${end}/${arrayBuffer.byteLength}`]
              ]
            });
          } else {
            // return new Response(null, {
            //   status: 416,
            //   statusText: 'Range Not Satisfiable',
            //   headers: [['Content-Range', `*/${arrayBuffer.byteLength}`]]
            // });
            return fetch(request);
          }
        });
      } else {
        // Cache for a future request
        // Remove the range header and run a parallel request to ensure a 200 response from our server
        // Once cached the next range request will be served by the service worker
        // Warning: this seems to cause issues with large files
        // var newHeaders = new Headers(request.headers);
        // newHeaders.delete("range");
        // const newRequest = new Request(request, {headers: newHeaders});
        // fetch(newRequest).then(res => {
        //   caches.open(cacheName).then(cache => cache.put(newRequest, res))
        // });

        return fetch(request);
      }
    });
}




const noFetch = /.*\.mp3|.*\.m3u8|.*\.m4s|\/nowplaying\/|\/stream\/|\/streamsafe\/.*mp3$|\/archives\/.*mp3$|\/releases\/.*mp3$|irc$|meta$/i;
const netFirst = /\/api\/|\/blog\//i;
const noSearch = /^\/$|^\/news$|^\/eq$|^\/video$|^\/stations$|^\/chat$|^\/archive$|^\/releases$|^\/about$/i;

self.addEventListener('fetch', event => {
  var url = new URL(event.request.url);
  if (event.request.method !== 'GET' || noFetch.test(url.pathname)) {
    // console.log("Bypass for ", url);
    return;
  }

  let search = noSearch.test(url.pathname);
  // if (search) {
  //   // Respond with index
  //   event.respondWith(caches.match('/'));
  //   return
  // }

  // if (event.request.headers.get('range')) {
  //   console.log("Range Request for ", event.request.url);
  //   event.respondWith(returnRangeRequest(event.request, staticCacheName, search));
  // }

  if (netFirst.test(url.pathname)) {
    console.log("Network first for ", event.request.url);
    event.respondWith(networkElseCache(event.request, staticCacheName, search));

  } else {
    console.log("Cache first", event.request.url);
    event.respondWith(cacheThenNetwork(event.request, staticCacheName, search));
  }

});