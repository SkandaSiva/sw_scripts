importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0864794.js",
    "revision": "4832e11e4626fe41ecdaabcc8b0e270c"
  },
  {
    "url": "/_nuxt/5ff6684.js",
    "revision": "d284e6258fed2b9e64cd865bedf50ef5"
  },
  {
    "url": "/_nuxt/6d511fe.js",
    "revision": "2cd0fdb6d08f815bb4bdcb2f6cac6dc1"
  },
  {
    "url": "/_nuxt/7ba43fc.js",
    "revision": "20fc206d7eb9a3b550554cfedb40afc1"
  },
  {
    "url": "/_nuxt/9363d08.js",
    "revision": "e2722a24d72cfbc74a9147a88e3e1298"
  },
  {
    "url": "/_nuxt/9d60648.js",
    "revision": "832bcddd4013cd1159c16bdbf1c704a8"
  },
  {
    "url": "/_nuxt/aa4aa2f.js",
    "revision": "ac0bb70aabbc136fadd39826ab2eb537"
  },
  {
    "url": "/_nuxt/b558edd.js",
    "revision": "a252f0dfeba9e2b896c96c96f5dd39b2"
  },
  {
    "url": "/_nuxt/b94d668.js",
    "revision": "6236410a3a34d0fa5b2e669b80a4c6e7"
  },
  {
    "url": "/_nuxt/c01dcb8.js",
    "revision": "c21ad798c28f7a3f1709de7c41c5d477"
  },
  {
    "url": "/_nuxt/c4220b5.js",
    "revision": "284def1bb53954317571c46ea06bfc1c"
  },
  {
    "url": "/_nuxt/d06553c.js",
    "revision": "4591e45bd26efb7d2d48311365345836"
  },
  {
    "url": "/_nuxt/d109785.js",
    "revision": "2a5622cbad4decd9a543445cc2331457"
  },
  {
    "url": "/_nuxt/fc57f66.js",
    "revision": "c63602190d5d74a7173995ed0e2b47cb"
  }
], {
  "cacheId": "verkeerplaza",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
