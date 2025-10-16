/*
Copyright 2015, 2019 Google Inc. All Rights Reserved.
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
const OFFLINE_VERSION = 6;
const CACHE_NAME = 'offline-' + OFFLINE_VERSION;
// Customize this with a different URL if needed.
const OFFLINE_URL = '/dashboard/offline';

const CACHE_LIST = [
    "/favicon.ico",
    "/media/theme/s19/css/offline.css",
    "/media/theme/s19/img/supersklep.svg",
    "/media/theme/s19/img/super-shop.svg"
];

self.addEventListener('install', (event) => {
    event.waitUntil((async() => {
        const cache = await caches.open(CACHE_NAME);

        // Setting {cache: 'reload'} in the new request will ensure that the response
        // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
        CACHE_LIST.forEach(async function(item) {
            await cache.add(new Request(item, { cache: 'reload' }));
        });

        await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));

    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async() => {
        // Enable navigation preload if it's supported.
        // See https://developers.google.com/web/updates/2017/02/navigation-preload
        if ('navigationPreload' in self.registration) {
            await self.registration.navigationPreload.enable();
        }
    })());

    // Tell the active service worker to take control of the page immediately.
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // We only want to call event.respondWith() if this is a navigation request
    // for an HTML page.
    if (event.request.mode === 'navigate' && event.request.destination == 'document' && event.request.method == 'GET') {
        event.respondWith((async() => {
            try {
                // First, try to use the navigation preload response if it's supported.
                const preloadResponse = await event.preloadResponse;
                if (preloadResponse) {
                    return preloadResponse;
                }

                const networkResponse = await fetch(event.request);
                return networkResponse;

            } catch (error) {
                const cache = await caches.open(CACHE_NAME);
                const cachedResponse = await cache.match(OFFLINE_URL);

                return cachedResponse;
            }
        })());
    } else {

        var isCached = false;

        CACHE_LIST.forEach(function(element) {
            if (event.request.url.includes(element)) {
                isCached = true;
            }
        }, this);

        if (isCached === true) {
            event.respondWith((async() => {
                try {
                    const preloadResponse = await event.preloadResponse;
                    if (preloadResponse) {
                        return preloadResponse;
                    }

                    const networkResponse = await fetch(event.request);
                    return networkResponse;
                } catch (error) {
                    const cache = await caches.open(CACHE_NAME);
                    const cachedResponse = await cache.match(event.request);
                    return cachedResponse;
                }
            })());
        }
    }
});

self.track = function(b, a) {
    self.prepareDb(function(e) {
        var d = e.transaction(["settings"], "readwrite").objectStore("settings").get("config");
        d.onsuccess = function(c) {
            c = {};
            a.data && a.data.event_properties && (c = a.data.event_properties);
            c.status = b;
            c = { commands: [{ name: "crm/events", data: { customer_ids: d.result.customer, company_id: d.result.token, type: "campaign", age: 0.1, properties: c, timestamp: Date.now() / 1E3 } }] };
            fetch(d.result.target + "/bulk", {
                method: "post",
                headers: { "Content-type": "text/plain;charset=UTF-8" },
                mode: "no-cors",
                body: JSON.stringify(c)
            })["catch"](function(a) {})
        }
    })
};
self.prepareDb = function(b) {
    var a = indexedDB.open("exponea", 1);
    a.onupgradeneeded = function(a) { a.target.result.createObjectStore("settings", { keyPath: "key" }) };
    a.onsuccess = function(a) { b(a.target.result) }
};
self.addEventListener("push", function(b) {
    if (b.data) {
        var a = b.data.json();
        a.message && (a.body = a.message);
        void 0 === a.data && (a.data = {});
        a.url && (a.data.url = a.url);
        a.event_properties && (a.data.event_properties = a.event_properties);
        b.waitUntil(Promise.all([self.registration.showNotification(a.title, a), self.track("delivered", a)]))
    }
});
self.addEventListener("notificationclick", function(b) {
    b.notification.close();
    var a = Promise.resolve();
    b.action && (a = clients.openWindow(b.action));
    !b.action && b.notification.data && b.notification.data.url && (a = clients.openWindow(b.notification.data.url));
    b.waitUntil(Promise.all([a, self.track("clicked", b.notification)]))
});
self.addEventListener("notificationclose", function(b) { b.waitUntil(Promise.all([self.track("closed", b.notification)])) });