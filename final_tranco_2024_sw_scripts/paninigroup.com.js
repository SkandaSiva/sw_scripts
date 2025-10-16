importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/25860e5.js",
    "revision": "af9001e41f0fc19f853ba5629ea6995e"
  },
  {
    "url": "/_nuxt/323428d.js",
    "revision": "343abb77d8c45f6b4a92da3a2b46f28e"
  },
  {
    "url": "/_nuxt/acbd269.js",
    "revision": "726d7f85ad0c54d9f154aae948c9b8f0"
  },
  {
    "url": "/_nuxt/c14cc8a.js",
    "revision": "c2e476370c43d7547ba5e93683733c5a"
  },
  {
    "url": "/_nuxt/d5caac4.js",
    "revision": "78db2c89fd2e9e625889184783313dfd"
  },
  {
    "url": "/_nuxt/d8a7a72.js",
    "revision": "78bd7b6cdb0bc7d308abc864ac86470a"
  }
], {
  "cacheId": "tabloid",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
