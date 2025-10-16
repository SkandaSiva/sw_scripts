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

const OFFLINE_VERSION = 1 // Bump to update
const OFFLINE_URL = '/offline'
const CACHE_NAME = 'offline'

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME)

    await cache.addAll([
      new Request(OFFLINE_URL, { cache: 'reload' }),
      'favicon.ico',
    ])
  })())
  
  self.skipWaiting()
})

// self.addEventListener('activate', event => {
//   event.waitUntil((async () => {
//     if ('navigationPreload' in self.registration) await self.registration.navigationPreload.enable()
//   })())

//   self.clients.claim()
// })

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await caches.match(event.request)
        if (response) return response

        // const preloadResponse = await event.preloadResponse
        // if (preloadResponse) return preloadResponse

        const networkResponse = await fetch(event.request)
        return networkResponse
      } catch (error) {
        const cache = await caches.open(CACHE_NAME)
        const cachedResponse = await cache.match(OFFLINE_URL)
        return cachedResponse
      }
    })())
  }
})