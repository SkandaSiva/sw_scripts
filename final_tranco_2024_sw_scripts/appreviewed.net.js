 

var CACHE_VERSION = 'v1';
var CACHE_NAME = CACHE_VERSION + ':sw-cache-';

function onInstall(event) {
 
  event.waitUntil(
    caches.open(CACHE_NAME).then(function prefill(cache) {
      return cache.addAll([

        // make sure serviceworker.js is not required by application.js
        // if you want to reference application.js from here
        '',

        '/assets/application-b834328ae68ee836ba1e4908c37c7647e7bae18664987e4c5f8e1c6d473a3c47.css',

        '/offline.html',

      ]);
    })
  );
}

function onActivate(event) {
 
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
          return cacheName.indexOf(CACHE_VERSION) !== 0;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
}

// Borrowed from https://github.com/TalAter/UpUp
function onFetch(event) {
  event.respondWith(
    // try to return untouched request from network first
    fetch(event.request).catch(function() {
      // if it fails, try to return request from the cache
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        }
        // if not found in cache, return default offline content for navigate requests
        if (event.request.mode === 'navigate' ||
          (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
          console.log('[Serviceworker]', "Fetching offline content", event);
          return caches.match('/offline.html');
        }
      })
    })
  );
}




// serviceworker.js
// The serviceworker context can respond to 'push' events and trigger
// notifications on the registration property
self.addEventListener("push", (event) => {
  var json = event.data.json();
  let title = json.title;
  let body = json.body;
  let tag = json.tag;
  let icon = json.icon;
  let image = json.image;
  event.waitUntil(
   self.registration.showNotification(title, { body, icon, tag, image, data: {url: json.url, tracking: json.tracking} })
   //self.registration.showNotification(title, { body, icon, tag, data: {url: json.url, tracking: json.tracking} })
  )
});


//self.addEventListener('notificationclick', function(event) {
//  event.waitUntil(
//    clients.openWindow(event.notification.data.url + event.notification.data.tracking)
//    );
//	event.notification.close();
//})


self.addEventListener('notificationclick', function(event) {
 
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url == (event.notification.data.url + event.notification.data.tracking) && 'focus' in client)
        return client.focus();
    }
    if (clients.openWindow)
      return clients.openWindow(event.notification.data.url + event.notification.data.tracking);
  }));
});





self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('fetch', onFetch);

self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('Subscription expired!');
  event.waitUntil(
    self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: window.vapidPublicKey })
    .then(function(subscription) {
      console.log('Subscribed after expiration', subscription.endpoint);
      console.log(subscription);
      return fetch('https://neuste-prospekte.de/create-subscriber-domain', {
        mode: 'no-cors',
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          raw: subscription,
          language: navigator.language,
          domain: self.location.hostname,
          lpid: "1",
          tracker: "onpushchange"
        })
      });
    })
  );
});

