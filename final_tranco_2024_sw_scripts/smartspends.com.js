importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

var APP_NAME = 'webapp-';
var SW_VERSION = '1.0.2';
var SW_SUFFIX = '-' + APP_NAME + SW_VERSION

var CSS_VERSION = '0.0.2' + SW_SUFFIX;
var JS_VERSION = '0.0.1' + SW_SUFFIX;
var IMAGE_VERSION = '0.0.1' + SW_SUFFIX;
var FONT_VERSION = '0.0.1' + SW_SUFFIX;
var PAGE_VERSION = '0.0.1' + SW_SUFFIX;
var PRE_CACHE_VERSION = '0.0.1' + SW_SUFFIX;

var WhitelistCaches = [
  "css-" + CSS_VERSION,
  "font-" + FONT_VERSION,
  "image-" + IMAGE_VERSION,
  "page-" + PAGE_VERSION,
  "precache-"+PRE_CACHE_VERSION,
  "js-"+JS_VERSION
];
var WhitelistURL = [
  '/',
  '/investment',
  '/transaction',
  '/tax-saving',
  '/smartdeposit',
  '/loan/loanpass',
  // '/loan/personal-loan',
  '/money-manager'
]
workbox.setConfig({
  debug: false
})

self.addEventListener("activate", function(event) {
  // delete any caches that aren't in whitelistCaches
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (!WhitelistCaches.includes(key)) {
            console.log("Cache Delete", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
});

workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.core.setCacheNameDetails({
  prefix: '',
  suffix: '',
  precache: 'precache-' + PRE_CACHE_VERSION
});

// workbox.precaching.precacheAndRoute([
//   {
//     "url": "https://static.smartspends.com/static/fonts/proxima-novabold.woff2",
//     "revision": "8c732fac7c788256b107f1df35b00dc6"
//   },
//   {
//     "url": "https://static.smartspends.com/static/fonts/proxima-semibold-webfont.woff2",
//     "revision": "4a2a396b64d49615e4e6175812307d2e"
//   }
// ]);


// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "font-" + FONT_VERSION,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 20,
        purgeOnQuotaError: true
      })
    ],
    fetchOptions: {
      mode: "cors",
      credentials: "same-origin"
    }
  })
);

// Cache CSS
workbox.routing.registerRoute(
  /\.(?:css)/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'css-'+ CSS_VERSION,
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// Cache third party CSS
workbox.routing.registerRoute(
  /(^https:\/\/)\S+.css+$/,
  new workbox.strategies.NetworkFirst()
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  /\.(?:woff2|woff|ttf|eot)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'font-' + FONT_VERSION,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 20,
        purgeOnQuotaError: true
      }),
    ],
  })
);

// Cache third party images
workbox.routing.registerRoute(
  function(data) {
    return data.request.url.includes("img.smartspends.com");
  },
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "image-" + IMAGE_VERSION,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days time
        maxEntries: 40,
        purgeOnQuotaError: true
      })
    ],
    fetchOptions: {
      mode: 'cors',
      credentials: 'same-origin'
    }
  })
);

// Cache same origin images
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|webp|svg|ico)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'image-'+ IMAGE_VERSION,
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 40,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// Cache Local JS
workbox.routing.registerRoute(
  /\.(?:js)\?/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'js-'+ JS_VERSION,
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 15,
        maxAgeSeconds: 5 * 24 * 60 * 60, // 5 Days
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// Cache third party JS
// workbox.routing.registerRoute(
//   /(^https:\/\/)\S+.js+$/,
//   new workbox.strategies.CacheFirst({
//     cacheName: 'js-'+ JS_VERSION,
//     plugins: [
//       new workbox.expiration.Plugin({
//         maxEntries: 10,
//         maxAgeSeconds: 60 * 24 * 60 * 60, // 60 Day
//         purgeOnQuotaError: true,
//       }),
//     ],
//     // fetchOptions: {
//     //   mode: 'cors',
//     //   credentials: 'same-origin'
//     // }
//   })
// );

// Cache HTML documents
workbox.routing.registerRoute(
  function(data) {
    const request = data.request;
    if (
      data.request.method === "GET" &&
      data.request.destination === "document" &&
      WhitelistURL.indexOf(data.url.pathname) > -1
    ) {
      return true;
    }
    return false;
  },
  new workbox.strategies.NetworkFirst({
    cacheName: "page-" + PAGE_VERSION,
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
        purgeOnQuotaError: true,
        maxAgeSeconds: 7 * 24 * 60 * 60 // 7 Days
      })
    ]
  })
);

importScripts('https://widgets.in.webengage.com/js/service-worker.js');