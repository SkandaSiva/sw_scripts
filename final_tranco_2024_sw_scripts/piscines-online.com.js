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
const OFFLINE_URL = "offline";

self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const entrypoints = (await (await fetch("/build/piscine/entrypoints.json")).json()).entrypoints;

            const cache = await caches.open(CACHE_NAME);
            // Setting {cache: 'reload'} in the new request ensures that the
            // response isn't fulfilled from the HTTP cache; i.e., it will be
            // from the network.
            await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));

            for(const entrypoint of Object.values(entrypoints))
            {
                const keys = Object.keys(entrypoint);

                for(const key of keys)
                {
                    for(const value of entrypoint[key])
                    {
                        cache.add(new Request(value, {cache: "reload"}));
                    }
                }
            }
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

self.addEventListener("fetch", (event) =>
{
    event.respondWith(
        (async () => {
            try {
                // First, try to use the navigation preload response if it's
                // supported.
                const preloadResponse = await event.preloadResponse;
                if (preloadResponse)
                {
                    return preloadResponse;
                }

                // Always try the network first.
                const networkResponse = await fetch(event.request);

                return networkResponse;
            } catch (error) {
                const cache = await caches.open(CACHE_NAME);

                let url = event.request.url;

                if(event.request.mode == "navigate")
                {
                    url = OFFLINE_URL;
                }

                const cachedResponse = await cache.match(url);

                return cachedResponse;
            }
        })()
    );

    // If our if() condition is false, then this fetch handler won't
    // intercept the request. If there are any other fetch handlers
    // registered, they will get a chance to call event.respondWith().
    // If no fetch handlers call event.respondWith(), the request
    // will be handled by the browser as if there were no service
    // worker involvement.
});