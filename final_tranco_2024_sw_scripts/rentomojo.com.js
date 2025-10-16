/* eslint-disable no-undef */
importScripts('https://s3-eu-west-1.amazonaws.com/static.wizrocket.com/js/sw_webpush.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

// Define the URLs of the resources you want to cache
const urlsToCache = [
  'https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js',
  'https://www.googletagmanager.com/gtag/js?id=G-9HT0H1VXEB',
  'https://use.typekit.net/fxb4iqq.css',
  'https://p.typekit.net/p.css?s=1&k=fxb4iqq&ht=tk&f=15705.15708.22710&a=103519831&app=typekit&e=css',
  'https://connect.facebook.net/en_US/fbevents.js',
];

// Cache all the images Using WorkBox
// eslint-disable-next-line no-underscore-dangle
self.__WB_DISABLE_DEV_LOGS = true;
const { registerRoute } = workbox.routing;
const { CacheFirst } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;

// Increment the cache name version to ensure updated images are cached
const IMAGE_CACHE = 'images-v2';

registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg|webp)$/,
  new CacheFirst({
    cacheName: IMAGE_CACHE,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 4 * 24 * 60 * 60, // 4 Days
        purgeOnQuotaError: true,
      }),
    ],
  })
);

self.addEventListener('message', async event => {
  if (!event.data) {
    return;
  }
  /* eslint-disable */
  if ('broadcast' in event.data) {
    const allClients = await clients.matchAll();
    for (const client of allClients) {
      client.postMessage(event.data.broadcast);
    }
  }
  if ('changedCity' in event.data) {
    const allClients = await clients.matchAll();
    for (const client of allClients) {
      client.postMessage(event.data.changedCity);
    }
  }
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return Promise.all(
        urlsToCache.map(url => {
          return fetch(url, { mode: 'no-cors' })
            .then(response => {
              // Check if the response is valid
              if (!response || response.status !== 200 || response.type !== 'basic') {
                throw new Error('Failed to cache ' + url);
              }
              return cache.put(url, response);
            })
            .catch(error => {
              console.error('Caching failed:', error);
            });
        })
      );
    })
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches that don't match the current cache name
          if (cacheName !== 'v1' && cacheName !== IMAGE_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (urlsToCache.includes(event.request.url)) {
    event.respondWith(
      caches.match(event.request).then(async response => {
        // If the resource is in cache, return it
        if (response) {
          return response;
        }
        // Otherwise, fetch it from the network
        try {
          const resp = await fetch(event.request, { mode: 'no-cors' });
          return resp;
        } catch (e) {
          console.log(e);
        }
      })
    );
  }
});
