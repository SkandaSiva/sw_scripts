var isFunction = function (obj) { return obj && {}.toString.call(obj) === '[object Function]'; },

    runFunctionString = function(funcStr) {
        if (funcStr.trim().length > 0) {
            eval('var func = ' + funcStr);
            if (isFunction(func))
                func();
        }
    };

self.addEventListener('message', function(event) {
    self.client = event.source;
});

self.onnotificationclose = function (event) {
    runFunctionString(event.notification.data.onClose);

    /* Tell Push to execute close callback */
    self.client.postMessage(JSON.stringify({
        id: event.notification.data.id,
        action: 'close'
    }));
};

self.onnotificationclick = function (event) {
    var link, origin, href;

    runFunctionString(event.notification.data.onClick);

    if (typeof event.notification.data.link !== 'undefined' && event.notification.data.link !== null) {
        origin = event.notification.data.origin;
        link = event.notification.data.link;
        href = origin.substring(0, origin.indexOf('/', 8)) + '/';

        event.notification.close();

        // This looks to see if the current is already open and focuses if it is
        event.waitUntil(clients.matchAll({
            type: "window"
        }).then(function (clientList) {
            var client, full_url;

            for (var i = 0; i < clientList.length; i++) {
                client = clientList[i];
                full_url = href + link;

                if (full_url[full_url.length - 1] !== '/' && client.url[client.url.length - 1] == '/')
                    full_url += '/';

                if ((client.url == full_url) && ('focus' in client))
                    return client.focus();
            }

            if (clients.openWindow)
                return clients.openWindow('/' + link);
        }));
    }
};


/**
 * START OFFLINE PAGE CODE
 */
/*
Copyright 2015, 2019, 2020, 2021 Google LLC. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
// This variable is intentionally declared and unused.
// Add a comment for your linter if you want:
// eslint-disable-next-line no-unused-vars
const OFFLINE_VERSION = 1;
const CACHE_NAME = "offline";
// Customize this with a different URL if needed.
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Setting {cache: 'reload'} in the new request ensures that the
      // response isn't fulfilled from the HTTP cache; i.e., it will be
      // from the network.
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
    })()
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Enable navigation preload if it's supported.
      // See https://developers.google.com/web/updates/2017/02/navigation-preload
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Only call event.respondWith() if this is a navigation request
  // for an HTML page.
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // First, try to use the navigation preload response if it's
          // supported.
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          // Always try the network first.
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // catch is only triggered if an exception is thrown, which is
          // likely due to a network error.
          // If fetch() returns a valid HTTP response with a response code in
          // the 4xx or 5xx range, the catch() will NOT be called.
          console.debug("service worker: Fetch failed; returning offline page instead.", error);

          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  }

  // If our if() condition is false, then this fetch handler won't
  // intercept the request. If there are any other fetch handlers
  // registered, they will get a chance to call event.respondWith().
  // If no fetch handlers call event.respondWith(), the request
  // will be handled by the browser as if there were no service
  // worker involvement.
});
/**
 * END OFFLINE PAGE CODE
 */