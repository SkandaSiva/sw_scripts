    /*
    Copyright 2018 Google Inc.

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

    importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.6.1/workbox-sw.js');

    workbox.setConfig({ debug: false });
   

    self.addEventListener('install', (event) => {
        event.waitUntil(self.skipWaiting());
    });

    self.addEventListener('activate', (event) => {
        event.waitUntil(clients.claim());
    });


    const currentCacheVersion = '2.6.2.0';

    var arr = []
    
    // Precache static assets
    workbox.precaching.precacheAndRoute(arr);

 
    // Cache JS files
    workbox.routing.registerRoute(
        new RegExp('.*\.js'),
        new workbox.strategies.NetworkFirst({
            cacheName: `js-cache-${currentCacheVersion}`,
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                maxEntries: 20,
                maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for a week
                })
            ],
        })
    );

    // Cache images
    workbox.routing.registerRoute(
        /.*\.(?:png|jpg|jpeg|svg|gif)/,
        new workbox.strategies.CacheFirst({
            cacheName: `image-cache-${currentCacheVersion}`,
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                maxEntries: 20,
                maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for a week
                })
            ],
        })
    );

    // Cache fonts
    workbox.routing.registerRoute(
        /\.(?:woff|woff2|eot|ttf|otf)$/,
        new workbox.strategies.CacheFirst({
            cacheName: `font-cache-${currentCacheVersion}`,
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                maxEntries: 5,
                maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for a month
                })
            ],
    })
);

