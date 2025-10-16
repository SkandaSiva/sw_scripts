
importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js',
);


workbox.setConfig({
  debug: false,
});

workbox.googleAnalytics.initialize();

workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.core.setCacheNameDetails({
  prefix: 'harbor',
  suffix: 'v1',
  precache: 'install-time',
  runtime: 'run-time',
});

const manifest = self.__WB_MANIFEST;
if (manifest) {
  console.log('precached', manifest);
}

// 预缓存静态资源
const precaches = [];
for (const [key, value] of Object.entries(self.__BUILD_MANIFEST || [] )) {
  if (key.startsWith('/')) {
    const result = value.map((item) => ({
      url: `/_next/${item}`,
      revision: null,
    }));
    precaches.push(...result);
  }
}
workbox.precaching.precacheAndRoute(precaches);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'document',
  new workbox.strategies.NetworkFirst({
    cacheName: 'doc-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 6 * 60 * 60,
      }),
    ],
  }),
);

const isCacheSameDomain = (url) => (
  url.origin === self.location.origin || url.href.indexOf('stylewe') !== -1
);

workbox.routing.registerRoute(
  ({ request, url }) => isCacheSameDomain(url)
    && (request.destination === 'script' || request.destination === 'style')
    && !precaches.some((precache) => precache.url === url.pathname)
    && url.pathname.startsWith('/_next/static/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'runtime-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60,
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  ({ request, url }) => isCacheSameDomain(url)
    && (url.href.indexOf('.jpeg') > 0
      || url.href.indexOf('.jpg') > 0
      || url.href.indexOf('.png') > 0
      || url.href.indexOf('.gif') > 0
      || url.href.indexOf('.svg') > 0
      || url.href.indexOf('.JPG') > 0
      || request.destination === 'font'),
  new workbox.strategies.CacheFirst({
    cacheName: 'static-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds: 7 * 24 * 60 * 60,
        purgeOnQuotaError: true,
      }),
    ],
  }),
);


