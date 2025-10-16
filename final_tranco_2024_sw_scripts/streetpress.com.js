importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/162c51d2e25baf6f01b6.js",
    "revision": "39a0ebcf0532e3ea4ac280b56eafe9a6"
  },
  {
    "url": "/_nuxt/16625abd0e00b0612db1.js",
    "revision": "5cf03fe8d7d38e8e0ae177f76041b97a"
  },
  {
    "url": "/_nuxt/2d4f30437bce05f1f85f.js",
    "revision": "08dabb770edd123c30c673cafb4f1557"
  },
  {
    "url": "/_nuxt/3509367323a2f5f602a2.js",
    "revision": "577038f009f20ca8773d61950ce7c9b7"
  },
  {
    "url": "/_nuxt/4eb7551b05c4e5d9e261.js",
    "revision": "b1988c935a3d3002775c955e6e11e38c"
  },
  {
    "url": "/_nuxt/4fdb14a6ef5043e58250.js",
    "revision": "6b0e06b743a5deec3da5c0879e621d4a"
  },
  {
    "url": "/_nuxt/510e324267b7fbcea823.js",
    "revision": "e26e899ad0771931d7b6c043df48c02d"
  },
  {
    "url": "/_nuxt/7242096581a1194a19c1.js",
    "revision": "3da29516b550bdf9e9a9e190a4dffc6d"
  },
  {
    "url": "/_nuxt/846c73a2d2455cd7c2ca.js",
    "revision": "2f52ee73612862edd5ea5b483c24edcd"
  },
  {
    "url": "/_nuxt/85ed02223961a7d9a5ab.js",
    "revision": "3649dd285e059e5b8bd881f14f04bc15"
  },
  {
    "url": "/_nuxt/930c9e0309e00e6e3e79.js",
    "revision": "7135d0ab45275c80d0668f8d0a484602"
  },
  {
    "url": "/_nuxt/a5c3dd9371d1ed3abbc8.js",
    "revision": "a24daf6efc404eaa91e630e1ee4a0b88"
  },
  {
    "url": "/_nuxt/a989288d14a9dae20503.js",
    "revision": "e2ff37ac9a8547147567c38824077b90"
  },
  {
    "url": "/_nuxt/b68a5934c957433a486b.js",
    "revision": "0e0fb30221c011b91d0bf9ab24c530aa"
  },
  {
    "url": "/_nuxt/c99c7253c1dc7a2ef995.js",
    "revision": "44883bc6ff83cd5875942f1711e6eb22"
  },
  {
    "url": "/_nuxt/f3fc7d9a6a7d14944c2e.js",
    "revision": "e44508d9d57442362c568574690e7759"
  },
  {
    "url": "/_nuxt/f42b7947dc12595d39f7.js",
    "revision": "9772eca9de02330d0a47d0c495fb9265"
  },
  {
    "url": "/_nuxt/f65d9d548e8ac99f59c9.js",
    "revision": "39b244a1e93b65893b917c928e82ef90"
  },
  {
    "url": "/_nuxt/f7fcbc166ef6c8850901.js",
    "revision": "50a301637b3e19ff2b2281bba498ae69"
  },
  {
    "url": "/_nuxt/ff96a43089b4c6991142.js",
    "revision": "8d28fbbcd23a1edd2c27088377f4efdc"
  }
], {
  "cacheId": "streetpress",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
