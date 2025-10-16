/* jshint esversion: 8 */
/*
Lemonrock Service Worker - users can receive instant messages via web push.
*/

var CACHE_NAME = "offline";
var OFFLINE_URL = "offline6.htm";

self.addEventListener('install', function(event) {
  console.log("sw7.js: Lemonrock sw thread being installed");
  event.waitUntil(
    (async () => {
      var cache = await caches.open(CACHE_NAME);
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
      await cache.add(new Request("lrlogo-2024.svg", { cache: "reload" }));
    })()
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Lemonrock sw activated');
});

self.addEventListener('notificationclick', function(event) {
  var promiseChain, matchingClient, i, windowClient, urlToOpen;
  console.log("notificationclick", event);
  urlToOpen = "myfavourites.php?new=" + event.notification.data.id;
  console.log("urlToOpen", urlToOpen);

  promiseChain = clients.matchAll({
    type: "window",
    includeUncontrolled: true
  }).then(function(windowClients) {
    matchingClient = null;

    for (i = 0; i < windowClients.length; i++) {
      windowClient = windowClients[i];
      if (windowClient.visibilityState == "visible") {
        if (windowClient.url.indexOf("/myfavourites.php") != -1) {
          matchingClient = windowClient;
          break;
        }
      }
    }
    if (!matchingClient) {
      for (i = 0; i < windowClients.length; i++) {
        windowClient = windowClients[i];
        if (windowClient.url.indexOf("/myfavourites.php") != -1) {
          matchingClient = windowClient;
          break;
        }
      }
    }
    if (matchingClient) {
      matchingClient.postMessage({
        url: urlToOpen
      });
      return matchingClient.focus();
    }
    else {
      return clients.openWindow(urlToOpen);
    }
  });
  event.waitUntil(promiseChain);
});

self.addEventListener('push', function(event) {
  if (event.data) {
    var resp = event.data.json();
    console.log(resp);

    var options = {
      body: resp.msg,
      icon: resp.icon,
      data: {
        id: resp.id
      }
    };
    event.waitUntil(
      self.registration.showNotification(resp.title, options)
    );
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(event.request);
          return networkResponse;
        }
        catch (error) {
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  }
});
