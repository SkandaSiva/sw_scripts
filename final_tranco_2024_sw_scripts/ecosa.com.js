importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/02a2d6047be57588b0cf.js",
    "revision": "8181f44a92fe801c219d0b8f3535d9a5"
  },
  {
    "url": "/_nuxt/4043db94a0957c79f40c.js",
    "revision": "0de63d3937ffcbf0b3aa49476fa0782b"
  },
  {
    "url": "/_nuxt/572dab2c84273ebd256c.css",
    "revision": "51b6d6f9aa10fbb1f0dc86e79ce2c02a"
  },
  {
    "url": "/_nuxt/b75212e9b57a7ca126ed.css",
    "revision": "a04573fcb2a04bdeddd10d54933aa34a"
  },
  {
    "url": "/_nuxt/daa09a261fc908844c41.js",
    "revision": "c7604a4ffd6c1e3618fe3c5f294fff0d"
  },
  {
    "url": "/_nuxt/ecba8ef756a0a0499c3b.js",
    "revision": "e5f346fc85b444bc0f6f59b5340d63ef"
  }
], {
  "cacheId": "Ecosa",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
