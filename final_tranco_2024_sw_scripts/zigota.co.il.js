// Notifications Push Listener 
self.addEventListener("push", function (event) {
  self.skipWaiting();

  console.log('[Service Worker] Push Received.');
  if (!(self.Notification && self.Notification.permission === "granted")) {
    return;
  }

  // "Visual Options"
  const data = event.data?.json() ?? {};
  const title = data.title;
  const body = data.body;
  const icon = data.icon;
  const image = data.image;
  const sound = data.sound;
  const badge = data.Badge;
  const dir = data.dir || "rtl"; 
  const timestamp = data.timestamp || "0";
  const actions = [];

  // Both visual & behavioral options"
  if (data.actions){
    data.actions.forEach(action => {
      actions.push(action)      
    });
  }

  const options = {
    title:title,
    body: body,
    icon: icon,
    image:image,
    badge:badge,
    sound:sound,
    dir:dir,
    actions: actions,
    timestamp:timestamp,
    time: new Date(Date.now()).toString(),
    requireInteraction: true,
    tag: 'renotify',
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close(); 
  var fullPath = self.location.origin 
  clients.openWindow(fullPath); 
});


self.addEventListener("install", event => {
  // forces a service worker to activate immediately
  self.skipWaiting();
 });

self.addEventListener("activate", event => {
 // when this SW becomes activated, we claim all the opened clients
 // they can be standalone PWA windows or browser tabs
 event.waitUntil(clients.claim());
});

// This is the "Offline copy of pages" service worker

const CACHE = "pwabuilder-offline";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "index.html";
const offlineFallbackPage = "offline.html";

// PWA
// Install stage sets up the index page (home page) in the cache and opens a new cache
self.addEventListener("install", function (event) {
  console.log("[PWA Builder] Install Event processing");

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("[PWA Builder] Cached offline page during install");

      if (offlineFallbackPage === "ToDo-replace-this-name.html") {
        return cache.add(new Response("TODO: Update the value of the offlineFallbackPage constant in the serviceworker."));
      }
      
      return cache.add(offlineFallbackPage);
    })
  );
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        console.log("[PWA Builder] add page to offline cache: " + response.url);

        // If request was success, add or update it in the cache
        event.waitUntil(updateCache(event.request, response.clone()));

        return response;
      })
      .catch(function (error) {        
        console.log("[PWA Builder] Network request Failed. Serving content from cache: " + error);
        return fromCache(event.request);
      })
  );
});

function fromCache(request) {
  // Check to see if you have it in the cache
  // Return response
  // If not in the cache, then return error page
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        return Promise.reject("no-match");
      }

      return matching;
    });
  });
}

function updateCache(request, response) {
  return caches.open(CACHE).then(function (cache) {
    return cache.put(request, response);
  });
}
