importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0159769.js",
    "revision": "cb30b5b13effa989b1f8f0deba4d016f"
  },
  {
    "url": "/_nuxt/0f66f42.js",
    "revision": "c3a85eeb7247d3cf8f21adb58667c5c1"
  },
  {
    "url": "/_nuxt/1065510.js",
    "revision": "9d3efe3bba21dd57c17ac1d0bd78d308"
  },
  {
    "url": "/_nuxt/164d064.js",
    "revision": "7ffea66f4912f9c0f45b0c9dd49439fa"
  },
  {
    "url": "/_nuxt/1cbfa2c.js",
    "revision": "d59c5b8c1c9cf8cacbd0c9a9c514ed42"
  },
  {
    "url": "/_nuxt/34c7d12.js",
    "revision": "4df0e4feaca06b11742c759797d5e1dc"
  },
  {
    "url": "/_nuxt/438407c.js",
    "revision": "79529cc84297c2a029d0ae0ab38b303f"
  },
  {
    "url": "/_nuxt/489978a.js",
    "revision": "d7f0ba46a513d0b8737f0440aa5f7bfa"
  },
  {
    "url": "/_nuxt/54aa811.js",
    "revision": "fabbf5614f71e61edc8440bf60e157bb"
  },
  {
    "url": "/_nuxt/54f6daf.js",
    "revision": "c1683c250297e462acfcb2489eb6507b"
  },
  {
    "url": "/_nuxt/5dd87f7.js",
    "revision": "e7ff25d5ce5a4be850141b967eba446f"
  },
  {
    "url": "/_nuxt/5e29178.js",
    "revision": "bf17a99486c561cd316ababd32079de6"
  },
  {
    "url": "/_nuxt/5ee6e74.js",
    "revision": "d2a5c138a077f5f250e6c481bc8479aa"
  },
  {
    "url": "/_nuxt/7b184a0.js",
    "revision": "bee8a659314abe4d98eb5a6ea5f3f35c"
  },
  {
    "url": "/_nuxt/7d840e4.js",
    "revision": "7536ec3efcb57aca276793d968980230"
  },
  {
    "url": "/_nuxt/8b71362.js",
    "revision": "399219969cfb4771399608f411fb2b92"
  },
  {
    "url": "/_nuxt/8c760c0.js",
    "revision": "f8eb76d08cab37882e11b71c3555e523"
  },
  {
    "url": "/_nuxt/9f2d531.js",
    "revision": "9c22cd975e57c77713114663b10a9098"
  },
  {
    "url": "/_nuxt/9fb3cac.js",
    "revision": "cdc2e2b8e6ee16ec432cdaa39c48576d"
  },
  {
    "url": "/_nuxt/b1caef2.js",
    "revision": "c3a2bd8f9fb7e55f14d0c8511f9b47c2"
  },
  {
    "url": "/_nuxt/b2ec84b.js",
    "revision": "c33c8cec554d26518dc29bc0b99476c8"
  },
  {
    "url": "/_nuxt/b7cebbe.js",
    "revision": "39da6aaf2682d51da601b122b7cf0d46"
  },
  {
    "url": "/_nuxt/ba711af.js",
    "revision": "dd1dcb7ebdd74f884f948520a9ef83e9"
  },
  {
    "url": "/_nuxt/c419f45.js",
    "revision": "1e5eaf4b6e51cb3e2251d20990a4cadd"
  },
  {
    "url": "/_nuxt/c7cc96b.js",
    "revision": "33316ece580e947307f7322162e262b5"
  },
  {
    "url": "/_nuxt/cfe4d7e.js",
    "revision": "f30cfb21e3496244603fa5f3710874ec"
  },
  {
    "url": "/_nuxt/d2b3d8f.js",
    "revision": "06dd6a3a652c36211b7724ad4c6a1fb2"
  },
  {
    "url": "/_nuxt/d47eace.js",
    "revision": "9c3050635c47792bbe09ed97e3b65233"
  },
  {
    "url": "/_nuxt/dd456af.js",
    "revision": "67bd20276cfd7beeb6f22c2571d13afa"
  },
  {
    "url": "/_nuxt/df39d24.js",
    "revision": "92a1f71532f77bffcc87def26be66bc0"
  },
  {
    "url": "/_nuxt/e5654c5.js",
    "revision": "145483c4d8b897c1806d2389a925efd5"
  },
  {
    "url": "/_nuxt/f0e6db3.js",
    "revision": "52085e645908e318e2326492b2cdaf2b"
  },
  {
    "url": "/_nuxt/f83057e.js",
    "revision": "28b17a3c8bc92d1f78cfcbae0e55a891"
  },
  {
    "url": "/_nuxt/f85c531.js",
    "revision": "991aca6317313de49caa3c5fa6653924"
  }
], {
  "cacheId": "iyuno",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
