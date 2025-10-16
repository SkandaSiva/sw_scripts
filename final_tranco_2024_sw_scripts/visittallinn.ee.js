importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/242d4537d8d1827625a4.js",
    "revision": "4af408fa793447ee509fd198e72562d8"
  },
  {
    "url": "/_nuxt/4870ad0e0089a2907f72.js",
    "revision": "ed520bb8efb60a3985dd5df6840e12d7"
  },
  {
    "url": "/_nuxt/659ef3e285fe1adc51d6.js",
    "revision": "02fd71a16e03c5f5124e67d7ac14f707"
  },
  {
    "url": "/_nuxt/b47b0b77adfb447cd46b.js",
    "revision": "c68b31489686f82a49f672f094955976"
  },
  {
    "url": "/_nuxt/c8ec22ba40b33c975808.js",
    "revision": "a93cf900d05dc828706c7215cc992491"
  }
], {
  "cacheId": "front-end",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
