importScripts('/_nuxt/workbox.4c4f5ca6.js')



workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0.5b60da84c0545ddefb4b.js",
    "revision": "47cf71e6b3ae24e4436d8304ddd172c1"
  },
  {
    "url": "/_nuxt/20.119ca4eb0079d0151b1f.js",
    "revision": "ff223f3eb8267f51c086f9346e889033"
  },
  {
    "url": "/_nuxt/21.214479ca6a18f32da58c.js",
    "revision": "759b6a5801b1f5e8271640c51988a621"
  },
  {
    "url": "/_nuxt/22.4a973df88cff753a1c70.js",
    "revision": "2abf3331c6d7ac07e33311a71b08775a"
  },
  {
    "url": "/_nuxt/app.c0f4da31ab55dcaa1f42.js",
    "revision": "086a1f6ac8268bd8983d6ff412317755"
  },
  {
    "url": "/_nuxt/layouts/default.e93a16dd75cd92a12b06.js",
    "revision": "8dc0e1d84d40f95e24553e791961dcb2"
  },
  {
    "url": "/_nuxt/manifest.3afedecf63dfc152ebc5.js",
    "revision": "b7b33f5403eba88d5d31b79a66dcbdf9"
  },
  {
    "url": "/_nuxt/pages/_slug.d00f974668d0ea78e8f7.js",
    "revision": "a5788f27caca3e00cd77e1505b68c441"
  },
  {
    "url": "/_nuxt/pages/careers/_slug.55a6853b20feeab4e67f.js",
    "revision": "ec62b916bf1e4588a031c6bdd806826d"
  },
  {
    "url": "/_nuxt/pages/careers/index.0a47756e3ad572c7b4a8.js",
    "revision": "0dbe1a22547e48214b22d65aee49e5a0"
  },
  {
    "url": "/_nuxt/pages/careers/thank-you.16bc1f8196f0301a3e52.js",
    "revision": "229f0abb0a5e9b4047911494c27b894f"
  },
  {
    "url": "/_nuxt/pages/category/_slug/index.4c9b2230c40f24343d99.js",
    "revision": "cbd6e450e795da5193098cb12551e347"
  },
  {
    "url": "/_nuxt/pages/category/_slug/page/_number.c11c73c3fc7ae72c50a6.js",
    "revision": "9e0288c167735d66e46606a25132139e"
  },
  {
    "url": "/_nuxt/pages/clients/_slug.5df20342527102ff563b.js",
    "revision": "c36bcf32220bc56294ce175d0d2f8534"
  },
  {
    "url": "/_nuxt/pages/clients/index.8a80422fd8de7139d32f.js",
    "revision": "f7fc8c1ff942f8ae1f880a2396231823"
  },
  {
    "url": "/_nuxt/pages/contact.8fba5e73c1ccb2367aa5.js",
    "revision": "c013c79be9c1749504ad120d4627bba3"
  },
  {
    "url": "/_nuxt/pages/index.a0c66bd15386507b13a2.js",
    "revision": "e1153fb3bab3190dbbf64a7dc237158f"
  },
  {
    "url": "/_nuxt/pages/ppc-roi-calculator.7597751f991aa5feea63.js",
    "revision": "4b615a49566981f3e21dc6e7d3bf552d"
  },
  {
    "url": "/_nuxt/pages/services/_slug.d4947cb1c2d1f589671f.js",
    "revision": "b54de97fe05e90b37d2a1e61bc84e8cf"
  },
  {
    "url": "/_nuxt/pages/services/index.1b10a85bc6e3c7396656.js",
    "revision": "81ec199eb4f769f25c61b5a71d90d027"
  },
  {
    "url": "/_nuxt/pages/soapbox/index.d324ec002354e852ac02.js",
    "revision": "e68d12ee677d10baff0e8f890c0d07da"
  },
  {
    "url": "/_nuxt/pages/soapbox/page/_number.1d9349253053d87d3961.js",
    "revision": "d1d202fbbc19f96ef32da7809196ebbd"
  },
  {
    "url": "/_nuxt/pages/thank-you.f960d7097be65fccb690.js",
    "revision": "fb79a57d4e1acc8ba78fea54f9bac844"
  },
  {
    "url": "/_nuxt/vendor.e458b184e7685ab405de.js",
    "revision": "e2d09b49857965ff9a92acf864ff72dc"
  }
], {
  "cacheId": "soap-media",
  "directoryIndex": "/",
  "cleanUrls": false
})



workbox.clientsClaim()
workbox.skipWaiting()


workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')





