importScripts('/workbox/workbox-sw.js');

workbox.setConfig({
  modulePathPrefix: '/workbox/'
});

//-------------------------------------------------------//

const HTML_CACHE = "html";
const JS_CACHE = "javascript";
const STYLE_CACHE = "stylesheets";
const IMAGE_CACHE = "images";
const FONT_CACHE = "fonts";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'document',
  new workbox.strategies.NetworkFirst({
    cacheName: HTML_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 20, // Only cache 20 requests.
        maxAgeSeconds: 24 * 60 * 60, // Cache for a maximum of a day.
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'style',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: STYLE_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for a maximum of a week.
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'font',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: FONT_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for a maximum of a week.
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /\/.*\.(js)/,
 new workbox.strategies.StaleWhileRevalidate({
  cacheName: JS_CACHE,
  plugins: [
    new workbox.expiration.ExpirationPlugin({
      maxEntries: 20,
      maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for a maximum of a week.
    }),
  ],
})
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: IMAGE_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for a maximum of a week.
      }),
    ],
  }),
);
